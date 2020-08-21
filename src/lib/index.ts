import {Output} from '@oclif/parser'
import fetch from 'node-fetch'
import {flags} from '@oclif/command'
import * as fs from 'fs'
import {spawn} from 'child_process'

const {stat, mkdir} = fs.promises

type GraphQLResponse<T> = {
  data: T;
  errors?: [{message: string}];
}

class Backend {
  private endpoint: string;

  private token: string;

  constructor(e: string, t: string) {
    this.endpoint = e
    this.token = t
  }

  private async doGraphQLQuery<T>(query: string, variables = {}, {endpoint = '/admin'} = {}): Promise<GraphQLResponse<T>> {
    const adminEndpoint = this.endpoint.replace(/\/graphql$/, endpoint)
    const response = await fetch(adminEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token,
      },
      body: JSON.stringify({query, variables}),
    })
    if (response.status !== 200) {
      throw new Error('Could not connect to your slash backend. Did you pass in the correct api token?')
    }
    const json = await response.json()
    return {
      data: json.data as T,
      errors: json.errors as [{message: string}],
    }
  }

  async adminQuery<T>(query: string, variables = {}): Promise<GraphQLResponse<T>> {
    return this.doGraphQLQuery<T>(query, variables, {endpoint: '/admin'})
  }

  async slashAdminQuery<T>(query: string, variables = {}): Promise<GraphQLResponse<T>> {
    return this.doGraphQLQuery<T>(query, variables, {endpoint: '/admin/slash'})
  }

  getToken() {
    return this.token
  }

  getEndpoint() {
    return this.endpoint
  }

  getGRPCEndpoint() {
    return `${new URL(this.endpoint).host.replace('.', '.grpc.')}:443`
  }
}

// Async so that we can eventually implement logic, and automatically get tokens
export async function backendFromOpts(opts: Output<{ endpoint: string | undefined; token: string | undefined }, any>): Promise<Backend> {
  if (opts.flags.endpoint && opts.flags.token) {
    return new Backend(opts.flags.endpoint, opts.flags.token)
  }
  throw new Error('Please pass an endpoint and api token')
}

export const endpointFlags = {
  endpoint: flags.string({char: 'e', description: 'Slash GraphQL Endpoint'}),
  token: flags.string({char: 't', description: 'Slash GraphQL Backend API Tokens'}),
}

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
