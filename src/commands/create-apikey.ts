import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'
import fetch from 'node-fetch'
import {cli} from 'cli-ux'

export default class CreateApikey extends BaseCommand {
  static description = 'Create an API key for a Backend by id'

  static examples = [
    '$ slash-graphql create-apikey "0xid"',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    name: flags.string({char: 'n', description: 'Client name', default: 'slash-graphql-cli'}),
    isAdmin: flags.boolean({char: 'a', description: 'Grant admin role', default: false})
  }

  static args = [{name: 'id', description: 'Backend id', required: true}]

  async run() {
    const opts = this.parse(CreateApikey)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const id = opts.args.id

    if (!id.match(/0x[0-9a-f]+/)) {
      this.error(`Invalid id ${id}`)
    }

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql login`')
    }

    const backend = this.findBackendByUid(apiServer, token, id)

    if (!backend) {
      this.error('Cannot find the backend that you are trying to create an API key for. Please run `slash-graphql list-backends` to get a list of backends')
    }

    const response = await fetch(`${apiServer}/deployment/${id}/api-keys`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: opts.args.name,
        role: opts.args.isAdmin ? 'admin' : 'client'
      })
    })
    if (response.status !== 200) {
      this.error(`Unable to create API key. Try logging in again\n${await response.text()}`)
    }
    const apiKey = await response.json() as APIKey

    if (!opts.flags.quiet) {
      this.log(apiKey.key)
    }
  }
}
