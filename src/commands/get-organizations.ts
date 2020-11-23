import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'

const GET_ORGANIZATIONS = `
query GetOrganizations {
  organizations {
    uid
    name
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

export default class GetOrganizations extends BaseCommand {
  static description = 'Get Organizations associated with the user'

  static examples = [
    '$ slash-graphql get-organizations',
  ]

  static aliases = ['get-organizations']

  static flags = {
    ...BaseCommand.commonFlags,
  }

  async run() {
    const opts = this.parse(GetOrganizations)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, GET_ORGANIZATIONS, {})
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    this.log(JSON.stringify(data.organizations, null, 2))
  }
}
