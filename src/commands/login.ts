import fetch from 'node-fetch'
import open = require('open')
import sleep = require('sleep-promise')
import {stringify} from 'yaml'
import {createDirectory, writeFile, BaseCommand} from '../lib'
import {join} from 'path'
import {getEnvironment} from '../lib/environments'

export default class Login extends BaseCommand {
  static description = 'Login to Slash GraphQL. Calling this function will keep you logged in for 24 hours, and you will not need to pass access tokens for any backends that you own'

  static examples = [
    '$ slash-graphql login',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
  }

  static args = [{name: 'file', description: 'Input File', default: '/dev/stdin'}]

  async run() {
    const opts = this.parse(Login)
    const {auth0domain, auth0clientId, audience, authFile} = getEnvironment(opts.flags.environment)

    const deviceCodeResponse = await fetch(`https://${auth0domain}/oauth/device/code`, {
      method: 'POST',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({client_id: auth0clientId, scope: 'offline_access', audience: audience}),
    })
    if (deviceCodeResponse.status !== 200) {
      throw new Error('Could not get device code from Auth0')
    }
    const deviceCode = await deviceCodeResponse.json()
    open(deviceCode.verification_uri_complete)
    this.log('You should see the following code in your browser:', deviceCode.user_code)

    const token = await this.pollForToken(auth0domain, auth0clientId, deviceCode)
    if (!token) {
      this.error('Was not able to get confirmation in time. Please try logging in again')
      return
    }

    await createDirectory(this.config.configDir)
    await writeFile(join(this.config.configDir, authFile), stringify(token))

    this.log('Logged In!')
  }

  // Lazy programming with the any over here
  async pollForToken(auth0domain: string, auth0ClientId: string, deviceCode: any): Promise<any | undefined> {
    // Poll until authorized
    const pollTime = deviceCode.expires_in > 300 ? 300 : deviceCode.expires_in
    const pollUntil = new Date(new Date().getTime() + (pollTime * 1000))
    while (new Date() < pollUntil) {
      const apiTime = new Date()
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(`https://${auth0domain}/oauth/token`, {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        body: JSON.stringify({
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
          device_code: deviceCode.device_code,
          client_id: auth0ClientId,
        }),
      })
      if (res.status === 200) {
        // eslint-disable-next-line no-await-in-loop
        return {apiTime, ...(await res.json())}
      }

      // eslint-disable-next-line no-await-in-loop
      await sleep(deviceCode.interval * 1000)
    }
  }
}
