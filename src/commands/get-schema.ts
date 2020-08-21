import {Command, flags} from '@oclif/command'
import {endpointAuth} from '../lib'
import * as fs from 'fs'

const {writeFile} = fs.promises

const FETCH_SCHEMA = `{
  getGQLSchema {
    schema
  }
}`

export default class GetSchema extends Command {
  static description = 'Fetch the schema from your backend'

  static examples = [
    `$ slash-graphql hello
hello world from ./src/hello.ts!
`,
  ]

  static flags = {
    endpoint: flags.string({char: 'e', description: 'Slash GraphQL Endpoint'}),
    token: flags.string({char: 't', description: 'Slash GraphQL Backend API Tokens'}),
  }

  static args = [{name: 'file', description: 'Output File (defaults to stdout)'}]

  async run() {
    const opts = this.parse(GetSchema)
    const backend = await endpointAuth(opts)
    const response = await backend.adminQuery<{getGQLSchema: {schema: string}}>(FETCH_SCHEMA)
    if (opts.args.file) {
      await writeFile(opts.args.file, response.getGQLSchema.schema)
    } else {
      process.stdout.write(response.getGQLSchema.schema)
      process.stdout.write('\n')
    }
  }
}
