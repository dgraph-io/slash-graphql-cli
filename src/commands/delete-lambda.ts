import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

export default class DeleteLambda extends BaseCommand {
  static description = 'Delete the Lambda script associated with the backend.'

  static examples = [
    '$ slash-graphql delete-lambda -e https://frozen-mango.cloud.dgraph.io/graphql',
    '$ slash-graphql delete-lambda -e 0x1234',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
    confirm: flags.boolean({char: 'y', description: 'Skip Confirmation', default: false}),
  }

  confirm(message: string) {
    this.log(message)
    return cli.confirm('Are you sure you want to proceed?')
  }

  async run() {
    const opts = this.parse(DeleteLambda)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)
    let endpoint = opts.flags.endpoint || ''

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql` login')
    }

    if (!(opts.flags.confirm || await this.confirm('Deleting the lambda script from your backend. Make sure you have a backup.'))) {
      this.log('Aborting')
      return
    }

    if (!endpoint.match(/0x[0-9a-f]+/)) {
      const backend = await this.findBackendByUrl(apiServer, token, endpoint)
      endpoint = backend?.uid || ''
    }

    const {error, response} = await this.patchBackend(apiServer, token, endpoint, {lambdaScript: ''})
    if (error) {
      this.error(error)
    }
    this.log(response.message)
  }
}
