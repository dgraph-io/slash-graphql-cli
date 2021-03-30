import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'
import fetch from 'node-fetch'
import {join} from 'path'

export default class Logout extends BaseCommand {
  static description = 'Logout of Slash GraphQL Command Line'

  static examples = [
    '$ slash-graphql logout',
    '$ slash-graphql logout -a',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    all: flags.boolean({char: 'a', description: 'Log out of all command line clients', default: false}),
  }

  async run() {
    const opts = this.parse(Logout)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    if (opts.flags.all) {
      const {tokens_count} = await this.logOutOfAllBackends(apiServer, authFile)
      if (!opts.flags.quiet) {
        this.log(`Logged out of ${tokens_count} devices`)
      }
    } else {
      await this.invalidateRefreshToken(apiServer, authFile)
      if (!opts.flags.quiet) {
        this.log('Logged out')
      }
    }

    await this.deleteAuthFile(authFile)
  }

  async logOutOfAllBackends(apiServer: string, authFile: string) {
    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login in order to log out of all clients.')
    }
    const response = await fetch(`${apiServer}/command-line/access-token/revoke-all`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({}),
    })
    if (response.status !== 200) {
      this.error('Something went wrong while logging you out')
    }
    return response.json()
  }

  async invalidateRefreshToken(apiServer: string, authFile: string) {
    const res = await fetch(`${apiServer}/command-line/access-token/revoke`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({refreshToken: await this.getRefreshToken(authFile)}),
    })
    if (res.status !== 200) {
      this.error('Could not log you out. Please try logging in with `slash-graphql login`, then try invalidating all clients with `slash-graphql logout -a`')
    }
  }

  async getRefreshToken(authFile: string) {
    try {
      const {refresh_token} = await this.readAuthFile(authFile)
      return refresh_token as string
    } catch {
      this.error(`Could not read ${join(this.config.configDir, authFile)}. Are you logged in?`)
    }
  }
}
