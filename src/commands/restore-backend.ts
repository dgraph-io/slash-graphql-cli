import {getEnvironment} from '../lib/environments'
import {BaseCommand} from '../lib'
import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

const RESTORE_MUTATION  = `
mutation($uid: String!, $backupFolder: String, $backupNum: Int) {
  restore(uid: $uid, backupFolder: $backupFolder, backupNum: $backupNum) {
    response {
      code
      message
      restoreId
    }, errors {
      message
    }
  }
}`

export default class RestoreBackend extends BaseCommand {
    static description = 'Restore into a backend by source backend ID'

    static examples = [
      '$ slash-graphql restore-backend -e https://clone.cloud.dgraph.io/graphql -t <apiToken> --source <source backend id or url> [-f <backup folder> -n <backup number>]',
    ]

    static flags = {
      ...BaseCommand.commonFlags,
      ...BaseCommand.endpointFlags,
      source: flags.string({char: 's', description: 'Source backend ID or url to get the data to be restored', required: true}),
      backupFolder: flags.string({char: 'f', description: 'Backup folder retrieved from list-backups. Defaults to ""(latest).', required: false, default: ''}),
      backupNum: flags.integer({char: 'n', description: 'Backup number retrieved from list-backups. Defaults to 0(latest).', required: false, default: 0}),
      confirm: flags.boolean({char: 'y', description: 'Skip Confirmation', default: false}),
    }

    confirm() {
      this.log('This will replace all data in your backend.')
      return cli.confirm('Are you sure you want to proceed?')
    }

    async run() {
      const opts = this.parse(RestoreBackend)
      const backend = await this.backendFromOpts(opts)
      const {apiServer, authFile} = getEnvironment(opts.flags.environment)
      const sourceID = await this.convertToGraphQLUid(apiServer, authFile, opts.flags.source) || ''

      if (!(opts.flags.confirm || await this.confirm())) {
        this.log('Aborting')
        return
      }

      const {errors, data} = await backend.slashAdminQuery<{restore: {response: {code: string; message: string; restoreId: number}; errors: [{ message: string }]}}>(RESTORE_MUTATION, {
        uid: sourceID,
        backupFolder: opts.flags.backupFolder,
        backupNum: opts.flags.backupNum,
      })

      if (errors) {
        for (const {message} of errors) {
          this.error(message)
        }
        return
      }

      if (data.restore.errors) {
        for (const {message} of data.restore.errors) {
          this.error(message)
        }
        return
      }

      const restoreId = data.restore.response.restoreId

      if (opts.flags.quiet) {
        this.log('Restore key: ' + restoreId)
      } else {
        this.log('Restore in progress. Please run "slash-graphql restore-backend-status" to fetch the current status, using the following key', restoreId)
      }
    }
}
