import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {cli} from 'cli-ux'

export default class ListBackends extends BaseCommand {
  static description = 'List your backends'

  static examples = [
    '$ slash-graphql list-backends',
    '$ slash-graphql list-backends --csv',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...cli.table.flags(),
  }

  async run() {
    const opts = this.parse(ListBackends)
    const {apiServer, apiServerGo, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql` login')
      return
    }

    const backends = await this.getBackendsGo(apiServerGo, token)
    if (backends === null) {
      this.error('Unable to fetch backends. Please try logging in again with `slash-graphql login`')
    }

    if (backends.length === 0) {
      this.warn('You do not have any backends')
    }

    cli.table(backends, {
      id: {
        get: ({uid}) => uid,
      },
      name: {
        minWidth: 10,
      },
      region: {
        get: ({zone}) => zone,
        extended: true,
      },
      mode: {
        get: ({deploymentMode}) => deploymentMode,
        extended: true,
      },
      endpoint: {
        get: ({url}) => `https://${url}/graphql`,
      },
    }, {
      printLine: this.log,
      ...opts.flags, // parsed flags
    })
  }
}
