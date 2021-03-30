import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'
import fetch from 'node-fetch'
import sleep = require('sleep-promise')

const defaultRegion: Record<string, string> = {dev: 'us-test-1', stg: 'us-east-1', prod: 'us-west-2'}

const CREATE_DEPLOYMENT = `
mutation CreateDeployment($dep: NewDeployment!) {
  createDeployment(input: $dep) {
      uid
      name
      url
      owner
      jwtToken
      deploymentMode
      lambdaScript
    }
}
`

export default class DeployBackend extends BaseCommand {
  static description = 'Launch a new Backend'

  static examples = [
    '$ slash-graphql deploy-backend "My New Backend"',
    '$ slash-graphql deploy-backend "My New Backend"',
  ]

  static aliases = ['create-backend', 'launch-backend']

  static flags = {
    ...BaseCommand.commonFlags,
    region: flags.string({char: 'r', description: 'Region'}),
    organizationId: flags.string({char: 'o', description: 'Organization ID', default: ''}),
    subdomain: flags.string({char: 's', description: 'Subdomain'}),
    mode: flags.string({char: 'm', description: 'Backend Mode', default: 'graphql', options: ['readonly', 'graphql', 'flexible']}),
    type: flags.string({char: 'T', description: 'Backend Type', default: 'slash-graphql', options: ['slash-graphql', 'dedicated']}),
    jaeger: flags.string({description: 'Enable Jaeger (Only works for dedicated backends)', default: 'false', options: ['true', 'false']}),
    acl: flags.string({description: 'Enable ACL (Only works for dedicated backends)', default: 'false', options: ['true', 'false']}),
    dgraphHA: flags.string({description: 'Enable High Availability (Only works for dedicated backends)', default: 'false', options: ['true', 'false']}),
    size: flags.string({description: 'Backend Size (Only Works for dedicated backends)', default: 'small', options: ['small', 'medium', 'large', 'xlarge']}),
    storage: flags.integer({description: 'Alpha Storage in GBs - Accepts Only Integers (Only Works for dedicated backends)', default: 10}),
    dataFile: flags.string({description: 'Data File Path for Bulk Loader (Only works for dedicated backends)', default: ''}),
    schemaFile: flags.string({description: 'Dgraph Schema File Path for Bulk Loader (Only works for dedicated backends)', default: ''}),
    gqlSchemaFile: flags.string({description: 'GQL Schema File Path for Bulk Loader (Only works for dedicated backends)', default: ''}),
  }

  static args = [{name: 'name', description: 'Backend Name', required: true}]

  async run() {
    const opts = this.parse(DeployBackend)
    const {apiServer, authFile, deploymentProtocol} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, CREATE_DEPLOYMENT, {
      dep: {
        name: opts.args.name,
        zone: opts.flags.region || defaultRegion[opts.flags.environment],
        subdomain: opts.flags.subdomain,
        deploymentMode: opts.flags.mode,
        organizationUID: opts.flags.organizationId === '' ? null : opts.flags.organizationId,
        enterprise: opts.flags.type === 'dedicated' ? 'true' : 'false',
        size: opts.flags.size,
        storage: opts.flags.storage,
        aclEnabled: opts.flags.acl,
        jaegerEnabled: opts.flags.jaeger,
        dgraphHA: opts.flags.dgraphHA,
        bulkLoadSchemaFilePath: opts.flags.schemaFile,
        bulkLoadGQLSchemaFilePath: opts.flags.gqlSchemaFile,
        bulkLoadDataFilePath: opts.flags.dataFile,
      },
    })
    if (errors) {
      for (const {message} of errors) {
        this.error('Unable to create backend. ' + message)
      }
      return
    }

    const deployment = data.createDeployment as APIBackend
    const endpoint = `${deploymentProtocol}://${deployment.url}/graphql`

    if (!opts.flags.quiet) {
      this.log(`Waiting for backend to come up at ${endpoint}`)
    }

    await this.pollForEndpoint(endpoint)
    this.log(`Deployment Launched at: ${endpoint}`)
  }

  async pollForEndpoint(endpoint: string, endTime = new Date(new Date().getTime() + (120 * 1000))) {
    while (new Date() < endTime) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await fetch(endpoint, {
          method: 'OPTIONS',
          timeout: 3000,
        })
        if (res.status === 200) {
          return
        }
      } catch { }

      sleep(5000)
    }
    this.error('Looks like your backend is taking longer than usual to come up. If you are bulk loading, then it might take a little more time based on your data size.')
  }
}
