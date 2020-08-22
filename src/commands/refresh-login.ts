import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'

export default class RefreshLogin extends BaseCommand {
  static description = 'Refresh your access token. Only meant for debugging'

  static hidden = true;

  static examples = [
    '$ slash-graphql refresh-login',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
  }

  async run() {
    const opts = this.parse(RefreshLogin)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile, true)
    if (token) {
      this.log(`Got a new token: ${token}`)
    } else {
      this.warn('Could not get a new token. Please run `slash-graphql login`')
    }
  }
}
