import { BaseCommand } from '../lib'
import { getEnvironment } from '../lib/environments'
import { flags } from '@oclif/command'
import { cli } from 'cli-ux'


const UPDATE_DEPLOYMENT = `
mutation UpdateDeployment($dep: UpdateDeploymentInput!) {
  updateDeployment(input: $dep)
}
`;

export default class UpdateBackend extends BaseCommand {
  static description = 'Update Backend'

  static examples = [
    '$ slash-graphql update-backend -e 0xid -n "New Name" -m flexible',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
    name: flags.string({ char: 'n', description: 'Name' }),
    organizationId: flags.string({ char: 'o', description: 'Organization UID', default: '' }),
    confirm: flags.boolean({ char: 'y', description: 'Skip Confirmation', default: false }),
    mode: flags.string({ char: 'm', description: 'Backend Mode', options: ['readonly', 'graphql', 'flexible'] }),
  }

  confirm() {
    this.log('Depending on which properties you are updating, this may cause your backend to restart. Your data will be preserved')
    return cli.confirm('Are you sure you want to proceed?')
  }

  async run() {
    const opts = this.parse(UpdateBackend)
    const { apiServer, authFile } = getEnvironment(opts.flags.environment)
    const endpoint = await this.convertToGraphQLUid(apiServer, authFile, opts.flags.endpoint) || ''

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql` login')
    }

    const updates: Record<string, string> = {}
    if (opts.flags.name) {
      updates.name = opts.flags.name
    }
    if (opts.flags.mode) {
      updates.deploymentMode = opts.flags.mode
    }
    if (opts.flags.organizationId) {
      updates.organizationId = opts.flags.organizationId
    }

    if (Object.keys(updates).length === 0) {
      this.error('Please pass in a property to update')
    }

    if (!(opts.flags.confirm || await this.confirm())) {
      this.log('Aborting')
      return
    }

    const { errors, data } = await this.sendGraphQLRequest(apiServer, token, UPDATE_DEPLOYMENT, {
      dep: {
        uid: opts.flags.endpoint,
        name: opts.flags.name,
        deploymentMode: opts.flags.mode,
        organizationUID: opts.flags.organizationId === "" ? null : opts.flags.organizationId,
      },
    })
    if (errors) {
      for (const { message } of errors) {
        this.error("Unable to update backend. " + message)
      }
      return
    }

    this.log(data.updateDeployment)
  }
}
