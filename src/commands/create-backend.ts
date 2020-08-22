import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'
import fetch from 'node-fetch'
import sleep = require('sleep-promise')

export default class CreateBackend extends BaseCommand {
  static description = 'Create a new Backend'

  static examples = [
    '$ slash-graphql create-backend "My New Backend"',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    region: flags.string({char: 'r', description: 'Region', default: 'us-west-1'}),
    subdomain: flags.string({char: 'r', description: 'Region'}),
  }

  static args = [{name: 'name', description: 'Backend Name'}]

  async run() {
    const opts = this.parse(CreateBackend)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const response = await fetch(`${apiServer}/deployments/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: opts.args.name,
        zone: opts.flags.region,
        subdomain: opts.flags.subdomain,
      }),
    })
    if (response.status !== 200) {
      this.error(`Unable to create backend. Try logging in again\n${await response.text()}`)
    }
    const deployment = await response.json() as APIBackend
    const endpoint = `https://${deployment.url}/graphql`

    if (!opts.flags.quiet) {
      this.log(`Waiting for backend to come up at ${endpoint}`)
    }

    await this.pollForEndpoint(endpoint)

    this.log(endpoint)
  }

  async pollForEndpoint(endpoint: string, endTime = new Date(new Date().getTime() + (120 * 1000))) {
    while (new Date() < endTime) {
      try {
        // eslint-disable-next-line no-await-in-loop
        const res = await fetch(endpoint, {
          method: 'OPTIONS',
          timeout: 3000,
        })
        if (res.status === 200) {
          return
        }
      } catch { }

      sleep(5000)
    }
    this.error('Gave up waiting for backend after 2 minutes')
  }
}
