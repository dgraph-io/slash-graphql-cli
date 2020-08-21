import {Command, flags} from '@oclif/command'
import {endpointAuth} from '../lib'
import * as fs from 'fs'

const {readFile} = fs.promises

const QUERY = `
mutation($sch: String!) {
  updateGQLSchema(input: { set: { schema: $sch } })
  {
    gqlSchema {
      schema
    }
  }
}`

export default class UpdateSchema extends Command {
  static description = 'Update the schema in your backend'

  static examples = [
    '$ slash-graphql update-schema -e https://frozen-mango.cloud.dgraph.io/graphql -t secretToken= schema-file.graphql',
  ]

  static flags = {
    endpoint: flags.string({char: 'e', description: 'Slash GraphQL Endpoint'}),
    token: flags.string({char: 't', description: 'Slash GraphQL Backend API Tokens'}),
  }

  static args = [{name: 'file', description: 'Input File', default: '/dev/stdin'}]

  async run() {
    const opts = this.parse(UpdateSchema)
    const schema = await readFile(opts.args.file)
    const backend = await endpointAuth(opts)
    const {errors} = await backend.adminQuery<{updateGQLSchema: {gqlSchema: {schema: string}}}>(QUERY, {
      sch: schema.toString(),
    })
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      throw new Error('Could not update schema')
    }
    this.log('Sucessfully updated schema!')
  }
}
