import fetch from 'node-fetch'
import open = require('open')
import sleep = require('sleep-promise')
import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'

export default class Login extends BaseCommand {
  static description = 'Login to Slash GraphQL. Calling this function will keep you logged in for 24 hours, and you will not need to pass access tokens for any backends that you own'

  static examples = [
    '$ slash-graphql login',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
  }

  async run() {
    const opts = this.parse(Login)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const deviceCodeResponse = await fetch(`${apiServer}/command-line/device-code`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({}),
    })
    if (deviceCodeResponse.status !== 200) {
      throw new Error('Could not get device code from Auth0')
    }
    const deviceCode = await deviceCodeResponse.json()
    open(deviceCode.verification_uri_complete)
    this.log('You should see the following code in your browser:', deviceCode.user_code)

    const token = await this.pollForToken(apiServer, deviceCode)
    if (!token) {
      this.error('Was not able to get confirmation in time. Please try logging in again')
      return
    }

    this.writeAuthFile(authFile, token)

    this.log('Logged In!')
  }

  // Lazy programming with the any over here, we really should add types here
  async pollForToken(apiServer: string, deviceCode: any): Promise<Record<string, any> | undefined> {
    // Poll until authorized
    const pollTime = deviceCode.expires_in > 300 ? 300 : deviceCode.expires_in
    const pollUntil = new Date(new Date().getTime() + (pollTime * 1000))
    while (new Date() < pollUntil) {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(`${apiServer}/command-line/access-token`, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({deviceCode: deviceCode.device_code}),
      })
      if (res.status === 200) {
        return res.json()
      }

      // eslint-disable-next-line no-await-in-loop
      await sleep(deviceCode.interval * 1000)
    }
  }
}
