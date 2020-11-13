import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'
import fetch from 'node-fetch'
import {cli} from 'cli-ux'

export default class DestroyBackend extends BaseCommand {
  static description = 'Destroy a Backend by id'

  static examples = [
    '$ slash-graphql destroy-backend "0xid"',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    confirm: flags.boolean({char: 'y', description: 'Skip Confirmation', default: false}),
  }

  static args = [{name: 'id', description: 'Backend id', required: true}]

  confirm() {
    this.log('This will destroy your backend, and cannot be reversed')
    return cli.confirm('Are you sure you want to proceed?')
  }

  async run() {
    const opts = this.parse(DestroyBackend)
    const {apiServer, apiServerGo, authFile} = getEnvironment(opts.flags.environment)

    const id = opts.args.id

    if (!id.match(/0x[0-9a-f]+/)) {
      this.error(`Invalid id ${id}`)
    }

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql login`')
    }

    const backend = this.findBackendByUid(apiServerGo, token, id)

    if (!backend) {
      this.error('Cannot find the backend that you are trying to delete. Please run `slash-graphql list-backends` to get a list of backends')
    }

    if (!(opts.flags.confirm || await this.confirm())) {
      this.log('Aborting')
      return
    }

    const response = await fetch(`${apiServer}/deployment/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (response.status !== 200) {
      this.error(`Unable to destroy backend. Try logging in again\n${await response.text()}`)
    }

    if (!opts.flags.quiet) {
      this.log('Deleted')
    }
  }
}
