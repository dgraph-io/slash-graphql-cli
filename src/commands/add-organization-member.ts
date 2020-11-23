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
    '$ slash-graphql add-organization-member 0x123 test@gmail.com',
  ]

  static aliases = ['add-organization-member']

  static flags = {
    ...BaseCommand.commonFlags,
    member: flags.string({char: 'm', description: 'Member email ID', default: ''}),
  }

  static args = [{name: 'name', description: 'Organization UID', required: true}]

  async run() {
    const opts = this.parse(AddOrganizationMember)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, ADD_ORGANIZATION_MEMBER, {
      member: {
        organizationUID: opts.args.name,
        email: opts.flags.member,
      },
    })
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    this.log(JSON.stringify(data.addOrganizationMember))
  }
}
