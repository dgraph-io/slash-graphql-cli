import {getEnvironment} from '../lib/environments'
import {BaseCommand} from '../lib'
import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

const RESTORE_MUTATION  = `
mutation($uid: String!) {
  restore(uid: $uid) {
    response { code message restoreId }
  }
}`

export default class RestoreBackend extends BaseCommand {
    static description = 'Restore into a backend by source backend ID'

    static hidden = true;

    static examples = [
      '$ slash-graphql restore-backend -e https://clone.cloud.dgraph.io/graphql -t <apiToken> --source <source backend id or url>',
    ]

    static flags = {
      ...BaseCommand.commonFlags,
      ...BaseCommand.endpointFlags,
      source: flags.string({char: 's', description: 'Source backend ID or url to get the data to be restored', required: true}),
      confirm: flags.boolean({char: 'y', description: 'Skip Confirmation', default: false}),
    }

    confirm() {
      this.log('This will replace all data in your backend.')
      return cli.confirm('Are you sure you want to proceed?')
    }

    async run() {
      const opts = this.parse(RestoreBackend)
      const backend = await this.backendFromOpts(opts)
      let sourceID = opts.flags.source

      if (!sourceID.match(/0x[0-9a-f]+/)) {
        const {apiServer, authFile} = getEnvironment(opts.flags.environment)
        sourceID = await this.convertToGraphQLUid(apiServer, authFile, sourceID) || ''
      }

      if (!(opts.flags.confirm || await this.confirm())) {
        this.log('Aborting')
        return
      }

      const {errors, data} = await backend.slashAdminQuery<{restore: {response: {code: string; message: string; restoreId: number}}}>(RESTORE_MUTATION, {
        uid: sourceID,
      })

      if (errors) {
        for (const {message} of errors) {
          this.error(message)
        }
        return
      }

      const restoreId = data.restore.response.restoreId

      if (opts.flags.quiet) {
        this.log(restoreId)
      } else {
        this.log('Restore in progress. Please run "slash-graphql restore-backend-status" to fetch the current status, using the following key ', restoreId)
      }
    }
}
