import {BaseCommand} from '../lib'
import {cli} from 'cli-ux'

const LIST_BACKUPS_QUERY = `
query {
    listBackups {
        response {
            path
            type
            backupNum
        }, errors {
            message
        }
    }
}`

const getBackupTimeStamp = (path: string) => {
  // example: /0xb/2020-41/dgraph.20201013.081611.623/manifest.json
  const timeregex = path.match(new RegExp('/dgraph.(.*)/manifest.json'))
  if (!timeregex) return ''

  // format: YYYYMMDD.HHMMSS.Milliseconds
  // example: 20201013.100403.500
  const timestr = timeregex[1]
  const year = parseInt(timestr.substr(0, 4), 10)
  const month = parseInt(timestr.substr(4, 2), 10) - 1 // month is 0 indexed
  const date = parseInt(timestr.substr(6, 2), 10)
  const hour = parseInt(timestr.substr(9, 2), 10)
  const minute = parseInt(timestr.substr(11, 2), 10)
  const second = parseInt(timestr.substr(12, 2), 10)

  return new Date(Date.UTC(year, month, date, hour, minute, second)).toString()
};

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

    cli.table(backupsList, {Id: {get: ({backupNum}) => backupNum}, Type: {get: ({type}) => type}, Timestamp: {get: ({path}) => getBackupTimeStamp(path)}}, {printLine: this.log, ...opts.flags})
  }
}
