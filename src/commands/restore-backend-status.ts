import {BaseCommand} from '../lib'

const RESTORE_QUERY = `
query($restoreId: Int!) {
  restoreStatus(restoreId: $restoreId) {
    response {status errors}
  }
}
`

export default class RestoreBackendStatus extends BaseCommand {
    static description = 'Retrieve the status of a restore operation'

    static examples = [
      '$ slash-graphql restore-backend-status -e https://clone.cloud.dgraph.io/graphql -t <apiToken> "restoreID"',
    ]

    static flags = {
      ...BaseCommand.commonFlags,
      ...BaseCommand.endpointFlags,
    }

    static args = [{name: 'restoreID', description: 'Restore ID', required: true}]

    async run() {
      const opts = this.parse(RestoreBackendStatus)
      const backend = await this.backendFromOpts(opts)

      const {data, errors} = await backend.slashAdminQuery<{restoreStatus: { response: {status: string; errors: string[]}}}>(RESTORE_QUERY, {
        restoreId: opts.args.restoreID,
      })

      if (errors) {
        for (const {message} of errors) {
          this.error(message)
        }
        return
      }

      const failures = data.restoreStatus.response.errors
      if (failures.length !== 0) {
        this.error(failures)
        return
      }

      const status = data.restoreStatus.response.status

      this.log('Restore status:', status)
    }
}
