import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'

export default class GetLambda extends BaseCommand {
  static description = 'Get the Lambda script associated with the backend.'

  static examples = [
    '$ slash-graphql get-lambda -e https://frozen-mango.cloud.dgraph.io/graphql',
    '$ slash-graphql get-lambda -e 0x1234',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
  }

  async run() {
    const opts = this.parse(GetLambda)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)
    const endpoint = opts.flags.endpoint || ''

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql` login')
    }

    let backend = null
    if (endpoint.match(/0x[0-9a-f]+/)) {
      backend = await this.findBackendByUid(apiServer, token, endpoint)
    } else {
      backend = await this.findBackendByUrl(apiServer, token, endpoint)
    }

    const lambdaScript = Buffer.from(backend?.lambdaScript || '', 'base64').toString()
    this.log(lambdaScript || 'No lambda script')
  }
}
