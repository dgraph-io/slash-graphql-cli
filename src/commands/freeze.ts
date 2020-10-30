import {BaseCommand} from '../lib'

const MUTATION = `mutation { freeze }`

export default class Freeze extends BaseCommand {
  static description = 'Freeze your backend.'
  static hidden = true
  static examples = [
    '$ slash-graphql freeze -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken>',
    '$ slash-graphql freeze -e 0x42',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
  }

  async run() {
    const opts = this.parse(Freeze)
    const backend = await this.backendFromOpts(opts)
    const {errors} = await backend.slashAdminQuery<{freeze: any}>(MUTATION)
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    if (!opts.flags.quiet) {
      this.log('Successfully froze backend')
    }
  }
}
