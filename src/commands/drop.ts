import {flags} from '@oclif/command'
import {BaseCommand} from '../lib'
import {cli} from 'cli-ux'
import {getTypesDiff, getFieldsDiff} from '../lib/schema-parser/getdiff'

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

export default class DropData extends BaseCommand {
  static description = 'Drop all data in your backend'

  static aliases = ['drop-data']

  static examples = [
    '$ slash-graphql drop-data -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> [-l] [-d] [-s] [-T <types>] [-F <fields>]',
  ]

  static getOtherFlags(flag: string) {
    const options = ['list-unused', 'drop-data', 'drop-schema', 'drop-types', 'drop-fields']
    const index = options.indexOf(flag)
    options.splice(index, 1)
    return options
  }

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
    'list-unused': flags.boolean({char: 'l', description: 'List unused types and fields', default: false, exclusive: DropData.getOtherFlags('list-unused')}),
    'drop-data': flags.boolean({char: 'd', description: 'Drop data and leave the schema', default: false, exclusive: DropData.getOtherFlags('drop-data')}),
    'drop-schema': flags.boolean({char: 's', description: 'Drop Schema along with the data', default: false, exclusive: DropData.getOtherFlags('drop-schema')}),
    'drop-types': flags.string({char: 'T', description: 'Drop types', multiple: true, exclusive: ['list-unused', 'drop-data', 'drop-schema']}),
    'drop-fields': flags.string({char: 'F', description: 'Drop types', multiple: true, exclusive: ['list-unused', 'drop-data', 'drop-schema']}),
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

  async run() {
    const opts = this.parse(DropData)
    const backend = await this.backendFromOpts(opts)

    if (opts.flags['list-unused']) {
      const {data: graphqlex, errors: graphqlexErrors} = await backend.query<{data: object }>('schema { __typename }')
      const {data: graphql, errors: graphqlErrors} = await backend.adminQuery<{getGQLSchema: { schema: string }}>('{ getGQLSchema { schema } }')

      if (graphqlErrors || graphqlexErrors) {
        this.handleResult(graphqlErrors, '')
        this.handleResult(graphqlexErrors, '')
        return
      }

      const unusedTypes: [{type: string}] = getTypesDiff(graphql.getGQLSchema.schema, graphqlex).map((type: string) => ({type: type}))
      const unusedFields: [{field: string}] = getFieldsDiff(graphql.getGQLSchema.schema, graphqlex).map((field: string) => ({field: field}))

      cli.table(unusedTypes, {'Unused Types': {get: ({type}) => type}}, {printLine: this.log, ...opts.flags})
      cli.table(unusedFields, {'Unused Fields': {get: ({field}) => field}}, {printLine: this.log, ...opts.flags})
      return
    }

    if (opts.flags['drop-schema']) {
      if (opts.flags.confirm || await this.confirm('This will delete all data and schema in your backend, and cannot be reversed')) {
        const {errors} = await backend.slashAdminQuery<{dropData: {response: {code: string; message: string}}}>(DROP_SCHEMA)
        this.handleResult(errors, 'Successfully dropped all data and schema!')
      } else {
        this.log('Aborting')
      }
      return
    }

    if (opts.flags['drop-data']) {
      if (opts.flags.confirm || await this.confirm('This will delete all data in your backend, and cannot be reversed')) {
        const {errors} = await backend.slashAdminQuery<{dropData: {response: {code: string; message: string}}}>(DROP_DATA)
        this.handleResult(errors, 'Successfully dropped all data!')
      } else {
        this.log('Aborting')
      }
      return
    }

    const deleteTypes = opts.flags['drop-types']
    const deleteFields = opts.flags['drop-fields']
    if (deleteTypes || deleteFields) {
      // TODO: fix proxy and do these in a single query
      if (!(opts.flags.confirm || await this.confirm('This will delete the listed types/fields, and cannot be reversed'))) {
        this.log('Aborting')
        return
      }

      if (deleteTypes) {
        const {errors} = await backend.slashAdminQuery<{dropData: {response: {code: string; message: string}}}>(DROP_TYPES, {
          types: deleteTypes,
        })

        if (errors) {
          this.handleResult(errors, '')
        } else {
          cli.table(deleteTypes.map((type: string) => ({type: type})), {'Deleted Types': {get: ({type}) => type}}, {printLine: this.log, ...opts.flags})
        }
      }

      if (deleteFields) {
        const {errors} = await backend.slashAdminQuery<{dropData: {response: {code: string; message: string}}}>(DROP_FIELDS, {
          fields: deleteFields,
        })

        if (errors) {
          this.handleResult(errors, '')
        } else {
          cli.table(deleteFields.map((field: string) => ({field: field})), {'Deleted Fields': {get: ({field}) => field}}, {printLine: this.log, ...opts.flags})
        }
      }
      return
    }

    this.log('No options provided. Use drop --help to learn about the options.')
  }
}
