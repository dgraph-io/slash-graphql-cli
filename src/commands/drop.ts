import {flags} from '@oclif/command'
import {BaseCommand} from '../lib'
import {cli} from 'cli-ux'
import {getTypesDiff, getFieldsDiff} from '../lib/schema-parser/getdiff'
import {Backend} from '../lib/backend'

const DROP_DATA  = `
mutation {
  dropData(allData: true) {
    response { code message }
  }
}`

const DROP_SCHEMA  = `
mutation {
  dropData(allDataAndSchema: true) {
    response { code message }
  }
}`

const DROP_TYPES = `
mutation($types: [String!]) {
  dropData(types: $types) {
    response { code message }
  }
}
`

const DROP_FIELDS = `
mutation($fields: [String!]) {
  dropData(fields: $fields) {
    response { code message }
  }
}
`

export default class Drop extends BaseCommand {
  static description = 'Drop all data in your backend'

  static examples = [
    '$ slash-graphql drop -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> [-l] [-d] [-s] [-T <types>] [-F <fields>]',
  ]

  static getOtherFlags(excludeFlag: string) {
    const options = ['list-unused', 'drpo-unused', 'drop-data', 'drop-schema', 'drop-types', 'drop-fields']
    const index = options.indexOf(excludeFlag)
    options.splice(index, 1)
    return options
  }

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
    'list-unused': flags.boolean({char: 'l', description: 'List unused types and fields', default: false, exclusive: Drop.getOtherFlags('list-unused')}),
    'drop-unused': flags.boolean({char: 'u', description: 'Drops all unused types and fields', default: false, exclusive: Drop.getOtherFlags('drop-unused')}),
    'drop-data': flags.boolean({char: 'd', description: 'Drop data and leave the schema', default: false, exclusive: Drop.getOtherFlags('drop-data')}),
    'drop-schema': flags.boolean({char: 's', description: 'Drop Schema along with the data', default: false, exclusive: Drop.getOtherFlags('drop-schema')}),
    'drop-types': flags.string({char: 'T', description: 'Drop types', multiple: true, exclusive: ['list-unused', 'drop-unused', 'drop-data', 'drop-schema']}),
    'drop-fields': flags.string({char: 'F', description: 'Drop types', multiple: true, exclusive: ['list-unused', 'drop-unused', 'drop-data', 'drop-schema']}),
    confirm: flags.boolean({char: 'y', description: 'Skip Confirmation', default: false}),
  }

  confirm(message: string) {
    this.log(message)
    return cli.confirm('Are you sure you want to proceed?')
  }

  handleResult(errors: [{message: string}] | undefined, successMessage: string | '') {
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }

    this.log(successMessage)
  }

  async listUnused(backend: Backend) {
    const opts = this.parse(Drop)

    const {data: graphqlex, errors: graphqlexErrors} = await backend.query<{data: object }>('schema { __typename }')
    const {data: graphql, errors: graphqlErrors} = await backend.adminQuery<{getGQLSchema: { schema: string }}>('{ getGQLSchema { schema } }')

    if (graphqlErrors || graphqlexErrors) {
      this.handleResult(graphqlErrors, '')
      this.handleResult(graphqlexErrors, '')
    }

    const unusedTypes = getTypesDiff(graphql.getGQLSchema.schema, graphqlex)
    const unusedFields = getFieldsDiff(graphql.getGQLSchema.schema, graphqlex)

    const unusedTypesList = unusedTypes.map((type: string) => ({name: type, type: 'type'}))
    const unusedFieldsList = unusedFields.map((field: string) => ({name: field, type: 'field'}))

    const unused = [...unusedTypesList, ...unusedFieldsList]
    if (unused.length === 0) {
      this.log('There are no unused types or fields')
      return
    }

    cli.table(unused, {Name: {get: ({name}) => name}, Type: {get: ({type}) => type}}, {printLine: this.log, ...opts.flags})

    return {
      types: unusedTypes,
      fields: unusedFields,
    }
  }

  async dropUnused(backend: Backend, dropTypes: string[], dropFields: string[]) {
    // TODO: fix proxy and do these in a single query
    if (dropTypes) {
      const {errors} = await backend.slashAdminQuery<{dropData: {response: {code: string; message: string}}}>(DROP_TYPES, {
        types: dropTypes,
      })

      if (errors) {
        this.handleResult(errors, '')
      }
    }

    if (dropFields) {
      const {errors} = await backend.slashAdminQuery<{dropData: {response: {code: string; message: string}}}>(DROP_FIELDS, {
        fields: dropFields,
      })

      if (errors) {
        this.handleResult(errors, '')
      }
    }

    this.log('Successfully dropped listed types/fields')
  }

  async run() {
    const opts = this.parse(Drop)
    const backend = await this.backendFromOpts(opts)

    if (opts.flags['list-unused']) {
      await this.listUnused(backend)
      return
    }

    if (opts.flags['drop-unused']) {
      const unused = await this.listUnused(backend)
      if (!unused) return
      if (opts.flags.confirm || await this.confirm('This will drop the listed unused types/fields, and cannot be reversed')) {
        await this.dropUnused(backend, unused.types, unused.fields)
      } else {
        this.log('Aborting')
      }
      return
    }

    if (opts.flags['drop-schema']) {
      if (opts.flags.confirm || await this.confirm('This will drop all data and schema in your backend, and cannot be reversed')) {
        const {errors} = await backend.slashAdminQuery<{dropData: {response: {code: string; message: string}}}>(DROP_SCHEMA)
        this.handleResult(errors, 'Successfully dropped all data and schema!')
      } else {
        this.log('Aborting')
      }
      return
    }

    if (opts.flags['drop-data']) {
      if (opts.flags.confirm || await this.confirm('This will drop all data in your backend, and cannot be reversed')) {
        const {errors} = await backend.slashAdminQuery<{dropData: {response: {code: string; message: string}}}>(DROP_DATA)
        this.handleResult(errors, 'Successfully dropped all data!')
      } else {
        this.log('Aborting')
      }
      return
    }

    const dropTypes = opts.flags['drop-types']
    const dropFields = opts.flags['drop-fields']
    if (dropTypes || dropFields) {
      if (opts.flags.confirm || await this.confirm('This will drop the listed unused types/fields, and cannot be reversed')) {
        await this.dropUnused(backend, dropTypes, dropFields)
      } else {
        this.log('Aborting')
      }
      return
    }

    this.log('No options provided. Use drop --help to learn about the options.')
  }
}
