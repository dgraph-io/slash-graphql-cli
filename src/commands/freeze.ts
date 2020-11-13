import {BaseCommand} from '../lib'
import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

const FREEZE_MUTATION = `
  mutation($deepFreeze: Boolean, $backup: Boolean) {
    freeze(deepFreeze: $deepFreeze, backup: $backup)
  }`

export default class Freeze extends BaseCommand {
  static description = 'Freeze your backend.'

  static hidden = true

  static examples = [
    '$ slash-graphql freeze -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> [-d -b]',
    '$ slash-graphql freeze -e 0x42',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
    deepFreeze: flags.boolean({char: 'd', description: 'Deep freeze backup.', default: false}),
    backup: flags.boolean({char: 'b', description: 'Perform backup before freezing', default: true}),
    confirm: flags.boolean({char: 'y', description: 'Skip Confirmation', default: false}),
  }

  confirm(message: string) {
    this.log(message)
    return cli.confirm('Are you sure you want to proceed?')
  }

  async run() {
    const opts = this.parse(Freeze)
    const backend = await this.backendFromOpts(opts)

    if (!(opts.flags.confirm || await this.confirm('Your backend will unfreeze after first request and this will take time.'))) {
      this.log('Aborting')
      return
    }

    const {data, errors} = await backend.slashAdminQuery<{freeze: string}>(FREEZE_MUTATION, {
      deepFreeze: opts.flags.deepFreeze,
      backup: opts.flags.backup,
    })

    if (errors) {
      this.log(data.freeze)
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
