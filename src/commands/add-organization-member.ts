import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'

const ADD_ORGANIZATION_MEMBER = `
mutation AddOrganizationMember($member: AddOrgMember!) {
    addOrganizationMember(input: $member) {
      uid
      name
    }
}
`

export default class AddOrganizationMember extends BaseCommand {
  static description = 'Add a Member to an Organization'

  static examples = [
    '$ slash-graphql add-organization-member -o 0x123 -m test@gmail.com',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    member: flags.string({char: 'm', description: 'Member email ID', default: ''}),
    organization: flags.string({char: 'o', description: 'Organization UID', default: ''}),
  }

  async run() {
    const opts = this.parse(AddOrganizationMember)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, ADD_ORGANIZATION_MEMBER, {
      member: {
        organizationUID: opts.flags.organization,
        email: opts.flags.member,
      },
    })
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    this.log('User', opts.flags.member, 'successfully added to', data.addOrganizationMember.uid, 'organization.')
  }
}
