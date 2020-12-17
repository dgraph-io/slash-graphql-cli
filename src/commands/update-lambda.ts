import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'
import fs from 'fs'

export default class LambdaLogs extends BaseCommand {
    static description = 'Get the Lambda script associated with the backend.'

    static examples = [
      '$ slash-graphql update-lambda -e https://frozen-mango.cloud.dgraph.io/graphql -f <filepath>',
      '$ slash-graphql update-lambda -e 0x1234 -f /home/user/Downloads/script.js',
    ]

    static flags = {
      ...BaseCommand.commonFlags,
      ...BaseCommand.endpointFlags,
      file: flags.string({char: 'f', description: 'Lambda script file path.', required: true}),
    }

    async run() {
      const opts = this.parse(LambdaLogs)
      const {apiServer, authFile} = getEnvironment(opts.flags.environment)
      const endpoint = await this.convertToGraphQLUid(apiServer, authFile, opts.flags.endpoint) || ''

      const token = await this.getAccessToken(apiServer, authFile)
      if (!token) {
        this.error('Please login with `slash-graphql` login')
      }

      const data = fs.readFileSync(opts.flags.file, 'utf8')
      const lambdaScript = Buffer.from(data).toString('base64')
      const {error, response} = await this.patchBackend(apiServer, token, endpoint, {lambdaScript})
      if (error) {
        this.error(error)
      }
      this.log(response.message)
    }
}