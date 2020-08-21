import {writeFile, BaseCommand} from '../lib'

const QUERY = `{
  getGQLSchema {
    schema
  }
}`

export default class GetSchema extends BaseCommand {
  static description = 'Fetch the schema from your backend'

  static examples = [
    '$ slash-graphql get-schema -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken>',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
  }

  static args = [{name: 'file', description: 'Output File', default: '/dev/stdout'}]

  async run() {
    const opts = this.parse(GetSchema)
    const backend = await this.backendFromOpts(opts)
    const {errors, data} = await backend.adminQuery<{getGQLSchema: {schema: string}}>(QUERY)
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      throw new Error('Could not fetch schema')
    }
    await writeFile(opts.args.file, data.getGQLSchema.schema)
  }
}
