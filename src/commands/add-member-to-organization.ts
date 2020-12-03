import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'

const ADD_ORGANIZATION_MEMBER = `
mutation AddOrganizationMember($member: AddOrgMember!) {
    addOrganizationMember(input: $member) {
      uid
      name
    }
}
`

export default class AddMemberToOrganization extends BaseCommand {
  static description = 'Add a Member to an Organization'

  static examples = [
    '$ slash-graphql add-member-to-organization 0x123 user@dgraph.io',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
  }

  static args = [
    {name: 'organization', description: 'Organization Name', required: true},
    {name: 'member', description: 'Member Email Address', required: true},
  ]

  async run() {
    const opts = this.parse(AddMemberToOrganization)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, ADD_ORGANIZATION_MEMBER, {
      member: {
        organizationUID: opts.args.organization,
        email: opts.args.member,
      },
    })
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    this.log('User', opts.args.member, 'successfully added to', data.addOrganizationMember.uid, 'organization.')
  }
}
