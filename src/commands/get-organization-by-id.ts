import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'

const GET_ORGANIZATION_BY_ID = `
query GetOrganizationById($orgID: ID!) {
  getOrganizationByID(orgID: $orgID) {
    uid
    name
    members {
      uid
      auth0User {
        name
        email
        id
      }
    }
    createdBy {
      auth0User {
        name
        email
        id
      }
    }
  }
}
`

export default class GetOrganizationByID extends BaseCommand {
  static description = 'Get an Organization by its UID'

  static examples = [
    '$ slash-graphql get-organization-by-id 0x123',
  ]

  static aliases = ['get-organization-by-id']

  static args = [{name: 'OrganizationUID', description: 'Organization UID', required: true}]

  async run() {
    const opts = this.parse(GetOrganizationByID)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, GET_ORGANIZATION_BY_ID, {
      orgID: opts.args.OrganizationUID,
    })
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    this.log('Name of organization:', data.getOrganizationByID.name)
    this.log('Members of organization: ')
    for (const {uid, auth0User} of data.getOrganizationByID.members) {
      this.log(auth0User.email, uid)
    }
  }
}
