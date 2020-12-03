import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'

const DELETE_ORGANIZATION_MEMBER = `
mutation DeleteOrganizationMember($member: DeleteOrgMember!) {
  deleteOrganizationMember(input: $member) {
      uid
      name
  }
}

`

export default class DeleteMemberFromOrganization extends BaseCommand {
  static description = 'Delete a Member from Organization'

  static examples = [
    '$ slash-graphql delete-organization-member 0x123 0x1234',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
  }

  static args = [
    {name: 'organization', description: 'Organization UID', required: true},
    {name: 'member', description: 'Member UID', required: true},
  ]

  async run() {
    const opts = this.parse(DeleteMemberFromOrganization)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, DELETE_ORGANIZATION_MEMBER, {
      member: {
        organizationUID: opts.args.organization,
        memberUID: opts.args.member,
      },
    })
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    this.log('Member', opts.args.member, 'successfully removed from', data.deleteOrganizationMember.name, 'organization.')
  }
}
