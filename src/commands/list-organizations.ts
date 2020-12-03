import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {cli} from 'cli-ux'

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

export default class ListOrganizations extends BaseCommand {
  static description = 'Get Organizations associated with the user'

  static examples = [
    '$ slash-graphql list-organizations',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
  }

  async run() {
    const opts = this.parse(ListOrganizations)
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

    if (data.organizations === null) {
      this.error('Unable to fetch organizations. Please try logging in again with `slash-graphql login`')
    }

    if (data.organizations.length === 0) {
      this.warn('You do not have any organizations.')
    }

    cli.table(data.organizations, {
      uid: {
        minWidth: 7,
      },
      name: {
        minWidth: 10,
      },
      createdBy: {
        get: org => org.createdBy.auth0User.email,
      },
    }, {
      printLine: this.log,
      ...opts.flags, // parsed flags
    })
  }
}
