import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'

const DELETE_ORGANIZATION_MEMBER = `
mutation DeleteOrganizationMember($member: DeleteOrgMember!) {
  deleteOrganizationMember(input: $member) {
      uid
      name
  }
}

`

export default class DeleteOrganizationMember extends BaseCommand {
  static description = 'Delete a Member from Organization'

  static examples = [
    '$ slash-graphql delete-organization-member 0x123 -m 0x1234',
  ]

  static aliases = ['delete-organization-member']

  static flags = {
    ...BaseCommand.commonFlags,
    member: flags.string({char: 'm', description: 'Member UID', default: ''}),
    organization: flags.string({char: 'o', description: 'Organization UID', default: ''}),
  }

  async run() {
    const opts = this.parse(DeleteOrganizationMember)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, DELETE_ORGANIZATION_MEMBER, {
      input: {
        organizationUID: opts.args.organization,
        memberUID: opts.flags.member,
      },
    })
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    this.log(JSON.stringify(data.deleteOrganizationMember))
  }
}
