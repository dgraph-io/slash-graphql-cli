import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'

const GET_LAMBDA_LOGS = `
query GetLambdaLogs($input: LambdaLogsInput!) {
  getLambdaLogs(input: $input)
}
`

export default class LambdaLogs extends BaseCommand {
  static description = 'Get the Lambda script associated with the backend.'

  static examples = [
    '$ slash-graphql lambda-logs -e https://frozen-mango.cloud.dgraph.io/graphql',
    '$ slash-graphql lambda-logs -e 0x1234 -h 5',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
    hours: flags.integer({char: 'h', description: 'Show lambda logs for last given hours. Defaults to 1 hour.', required: false, default: 1}),
  }

  async run() {
    const opts = this.parse(LambdaLogs)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)
    const endpoint = await this.convertToGraphQLUid(apiServer, authFile, opts.flags.endpoint) || ''

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql` login')
    }

    const start = new Date()
    start.setHours(start.getHours() - opts.flags.hours)
    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, GET_LAMBDA_LOGS, {
      input: {
        deploymentID: endpoint,
        start: start.toISOString(),
      },
    })

    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }

    const logs = data.getLambdaLogs.join('\n')
    this.log(logs || 'No logs')
  }
}
