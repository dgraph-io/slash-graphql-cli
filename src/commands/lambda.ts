import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'
import fs from 'fs'

const GET_LAMBDA_LOGS = `
query GetLambdaLogs($input: LambdaLogsInput!) {
  getLambdaLogs(input: $input)
}
`

export default class Lambda extends BaseCommand {
  static description = 'Lambda'

  static examples = [
    '$ slash-graphql lambda [-f /home/user/desktop/script.js] [--logs 3] [--script] [--delete]',
  ]

  static getOtherFlags(excludeFlags: string[]) {
    const options = ['file', 'script', 'delete', 'logs']
    return options.filter(option => !excludeFlags.includes(option))
  }

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
    file: flags.string({char: 'f', description: 'Lambda script path', required: false, exclusive: Lambda.getOtherFlags(['file'])}),
    script: flags.boolean({char: 's', description: 'Show lambda Script', required: false, default: false, exclusive: Lambda.getOtherFlags(['script'])}),
    delete: flags.boolean({char: 'd', description: 'Delete Lambda Script', required: false, default: false, exclusive: Lambda.getOtherFlags(['delete'])}),
    logs: flags.integer({char: 'l', description: 'Show lambda logs for last given hours', required: false, default: 0, exclusive: Lambda.getOtherFlags(['logs'])}),
  }

  async run() {
    const opts = this.parse(Lambda)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)
    const endpoint = opts.flags.endpoint || ''

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql` login')
    }

    if (opts.flags.file) {
      const data = fs.readFileSync(opts.flags.file, 'utf8')
      const lambdaScript = Buffer.from(data).toString('base64')
      const {error, response} = await this.patchBackend(apiServer, token, endpoint, {lambdaScript})
      if (error) {
        this.error(error)
      }
      this.log(response.message)
      return
    }

    if (opts.flags.script) {
      const backend = await this.findBackendByUid(apiServer, token, endpoint)
      const lambdaScript = Buffer.from(backend?.lambdaScript || '', 'base64').toString()
      this.log(lambdaScript || 'No lambda script')
      return
    }

    if (opts.flags.delete) {
      const {error, response} = await this.patchBackend(apiServer, token, endpoint, {lambdaScript: ''})
      if (error) {
        this.error(error)
      }
      this.log(response.message)
      return
    }

    if (opts.flags.logs) {
      const start = new Date()
      start.setHours(start.getHours() - opts.flags.logs)
      const variables = {
        input: {
          deploymentID: endpoint,
          start,
        },
      }
      const {errors, data} = await this.sendGraphQLRequest(apiServer, token, GET_LAMBDA_LOGS, variables)
      if (errors) {
        for (const {message} of errors) {
          this.error(message)
        }
        return
      }
      const logs = data.getLambdaLogs.join('\n')
      this.log(logs || 'No logs')
      return
    }

    this.log('No options provided. Use slash-graphql lambda --help to learn about the options.')
  }
}
