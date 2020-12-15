import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import fetch from 'node-fetch'

export default class MoveBackendToOrganization extends BaseCommand {
  static description = 'Move a backend to an organization'

  static examples = [
    '$ slash-graphql move-backend-to-organization 0x123 0x1234',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
  }

  static args = [{name: 'name', description: 'Backend UID', required: true},
    {name: 'organizationId', description: 'Organization UID', required: true}]

  async run() {
    const opts = this.parse(MoveBackendToOrganization)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const response = await fetch(`${apiServer}/deployment/${opts.args.name}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        organizationId: opts.args.organizationId,
      }),
    })
    if (response.status !== 200) {
      this.error(`Unable to move backend to the organization. Try logging in again\n${await response.text()}`)
    }

    this.log('Successfully moved backend' + opts.args.name + 'to organization' + opts.args.organizationId)
  }
}
