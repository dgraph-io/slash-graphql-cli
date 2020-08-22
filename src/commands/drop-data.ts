import {flags} from '@oclif/command'
import {BaseCommand} from '../lib'
import {cli} from 'cli-ux'

const QUERY  = `
mutation($dropSchema: Boolean!) {
  dropData(allData: true, allDataAndSchema: $dropSchema) {
    response { code message }
  }
}`

export default class DropData extends BaseCommand {
  static description = 'Drop all data in your backend'

  static examples = [
    '$ slash-graphql drop-data -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> schema-file.graphql',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
    'drop-schema': flags.boolean({char: 's', description: 'Drop Schema along with the data', default: false}),
    confirm: flags.boolean({char: 'y', description: 'Skip Confirmation', default: false}),
  }

  confirm() {
    this.log('This will delete all data in your backend, and cannot be reversed')
    return cli.confirm('Are you sure you want to proceed?')
  }

  async run() {
    const opts = this.parse(DropData)
    const backend = await this.backendFromOpts(opts)

    if (!(opts.flags.confirm || await this.confirm())) {
      this.log('Aborting')
      return
    }

    const {errors} = await backend.slashAdminQuery<{updateGQLSchema: {gqlSchema: {schema: string}}}>(QUERY, {
      dropSchema: opts.flags['drop-schema'],
    })
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    this.log('Sucessfully dropped all data!')
  }
}
