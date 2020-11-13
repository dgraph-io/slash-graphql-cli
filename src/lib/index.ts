import {Output} from '@oclif/parser'
import Command, {flags} from '@oclif/command'
import * as fs from 'fs'
import {spawn} from 'child_process'
import {Backend} from './backend'
import * as getStdin from 'get-stdin'
import {getEnvironment} from './environments'
import {join} from 'path'
import yaml = require('yaml')
import fetch from 'node-fetch'

const {stat, mkdir, unlink} = fs.promises

export async function createDirectory(path: string) {
  try {
    const file = await stat(path)
    if (!file.isDirectory()) {
      throw new Error('Output path is not a directory')
    }
  } catch {
    mkdir(path, {recursive: true})
  }
}

export function getFileName(path: string): string {
  const parts = new URL(path).pathname.split('/')
  return parts[parts.length - 1]
}

export function runCommand(command: string, ...args: string[]): Promise<number> {
  return new Promise(resolve => {
    spawn(command, args, {
      stdio: 'inherit',
    }).on('close', resolve)
  })
}

export async function writeFile(path: string, data: string) {
  if (path === '/dev/stdout') {
    await new Promise(resolve => process.stdout.write(data, resolve))
  } else {
    await fs.promises.writeFile(path, data)
  }
}

export async function readFile(path: string): Promise<Buffer> {
  if (path === '/dev/stdin') {
    return getStdin.buffer()
  }
  return fs.promises.readFile(path)
}

export abstract class BaseCommand extends Command {
  static commonFlags = {
    quiet: flags.boolean({char: 'q', description: 'Quiet Output', default: false}),
    environment: flags.string({description: 'Environment', default: 'prod', hidden: true}),
  }

  static endpointFlags = {
    endpoint: flags.string({char: 'e', description: 'Slash GraphQL Endpoint'}),
    token: flags.string({char: 't', description: 'Slash GraphQL Backend API Tokens'}),
  }

  async backendFromOpts(opts: Output<{ endpoint: string | undefined; token: string | undefined; environment: string }, any>): Promise<Backend> {
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)
    const endpoint = await this.convertToGraphQLEndpoint(apiServer, authFile, opts.flags.endpoint)
    if (!endpoint) {
      this.error('Please pass an endpoint or cluster id with the -e flag')
    }
    const token = opts.flags.token || await this.getEndpointJWTToken(apiServer, authFile, endpoint)
    if (!token) {
      this.error('Please login with `slash-graphql login` or pass a token with the -t flag')
    }

    return new Backend(endpoint, token, this.error)
  }

  async writeAuthFile(authFile: string, token: AuthConfig) {
    await createDirectory(this.config.configDir)
    await writeFile(join(this.config.configDir, authFile), yaml.stringify(token))
  }

  async getEndpointJWTToken(apiServer: string, authFile: string, endpoint: string) {
    const host = new URL(endpoint).host
    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      return null
    }

    const backends = await this.getBackends(apiServer, token)

    if (backends === null) {
      return null
    }

    for (const {url, jwtToken} of backends) {
      if (url === host) {
        return jwtToken as string
      }
    }
    return null
  }

  async getBackends(apiServer: string, token: string): Promise<APIBackend[] | null> {
    const query = `{
      deployments {
        uid
        name
        zone
        url
        owner
        jwtToken
        deploymentMode
        lambdaScript
      }
    }`
    const backendsResponse = await fetch(`${apiServer}/graphql`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({query}),
    })
    const res = await backendsResponse.json()
    return res.data.deployments as APIBackend[]
  }

  async patchBackend(apiServer: string, token: string, deploymentUid: string, attrs: any) {
    const response = await fetch(`${apiServer}/deployment/${deploymentUid}`, {
      method: 'PATCH',
      headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
      body: JSON.stringify(attrs),
    })

    const res = await response.json()
    if (response.status !== 200) {
      this.error(res)
    }

    return res
  }

  async sendGraphQLRequest(apiServer: string, token: string, query: string, variables: any) {
    const response = await fetch(`${apiServer}/graphql`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${token}`, 'Content-Type': 'application/json'},
      body: JSON.stringify({query, variables}),
    })

    const res = await response.json()
    return res
  }

  async readAuthFile(authFile: string): Promise<AuthConfig> {
    const yamlContent = await readFile(join(this.config.configDir, authFile))
    return yaml.parse(yamlContent.toString())
  }

  async getAccessToken(apiServer: string, authFile: string, forceRefresh = false) {
    try {
      const {apiTime, access_token, expires_in, refresh_token} = await this.readAuthFile(authFile)
      if (forceRefresh || new Date() > new Date(new Date(apiTime).getTime() + (1000 * expires_in))) {
        return this.tryToRefreshAccessToken(apiServer, authFile, refresh_token)
      }
      return access_token as string
    } catch {
      return null
    }
  }

  async deleteAuthFile(authFile: string) {
    await unlink(join(this.config.configDir, authFile))
  }

  async tryToRefreshAccessToken(apiServer: string, authFile: string, refreshToken: string) {
    if (!refreshToken) {
      return null
    }
    this.warn('Attempting to refresh token')
    const res = await fetch(`${apiServer}/command-line/access-token/refresh`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({refreshToken}),
    })
    if (res.status !== 200) {
      this.warn('Could not refresh token. Please try logging in again with `slash-graphql login`')
      return null
    }
    const data = await res.json() as AuthConfig
    await this.writeAuthFile(authFile, data)
    this.warn('Successfully refreshed token')
    return data.access_token as string
  }

  async findBackendByUid(apiServer: string, token: string, uid: string) {
    const backends = await this.getBackends(apiServer, token)
    if (!backends) {
      this.error('Please login with `slash-graphql login`')
    }
    return backends.find(backend => backend.uid === uid) || null
  }

  async findBackendByUrl(apiServer: string, token: string, url: string) {
    const hotname = new URL(url).host
    const backends = await this.getBackends(apiServer, token)
    if (!backends) {
      this.error('Please login with `slash-graphql login`')
    }
    return backends.find(backend => backend.url === hotname) || null
  }

  async convertToGraphQLEndpoint(apiServer: string, authFile: string, endpoint: string | undefined): Promise<string | null> {
    if (!endpoint) {
      return null
    }

    // Return unless we get a UID
    if (!endpoint.match(/0x[0-9a-f]+/)) {
      return endpoint
    }

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql login` in order to access endpoints by id')
    }

    const backend = await this.findBackendByUid(apiServer, token, endpoint)
    if (!backend) {
      this.error(`Cannot find backend ${endpoint}`)
    }

    return `https://${backend.url}/graphql`
  }

  async convertToGraphQLUid(apiServer: string, authFile: string, endpoint: string | undefined): Promise<string | null> {
    if (!endpoint) {
      return null
    }

    // Return unless we get a URL
    if (endpoint.match(/0x[0-9a-f]+/)) {
      return endpoint
    }

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql login` in order to access endpoints by url')
    }

    const backend = await this.findBackendByUrl(apiServer, token, endpoint)
    if (!backend) {
      this.error(`Cannot find backend ${endpoint}`)
    }

    return backend.uid
  }
}
