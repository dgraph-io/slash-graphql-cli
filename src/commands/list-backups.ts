import {BaseCommand} from '../lib'
import {cli} from 'cli-ux'

const LIST_BACKUPS_QUERY = `
query {
    listBackups {
        response {
            type
            backupNum
            folder
            timestamp
        }, errors {
            message
        }
    }
}`

export default class ListBackups extends BaseCommand {
  static description = 'List all backups of the current backend'

  static examples = [
    '$ slash-graphql list-backups -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken>',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
  }

  async run() {
    const opts = this.parse(ListBackups)
    const backend = await this.backendFromOpts(opts)

    const {data, errors} = await backend.slashAdminQuery<{listBackups: {response: {type: string; path: string; backupNum: number}; errors: {message: string}}}>(LIST_BACKUPS_QUERY)

    if (errors) {
      this.log('Failed to fetch backups list')
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }

    const response: any = data.listBackups.response
    const backupsList = [].concat(...[].concat(...response).reverse())

    cli.table(backupsList, {Timestamp: {get: ({timestamp}) => timestamp}, Type: {get: ({type}) => type}, BackupFolder: {get: ({folder}) => folder}, BackupNum: {get: ({backupNum}) => backupNum}}, {printLine: this.log, ...opts.flags})
  }
}
