import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'
import fetch from 'node-fetch'
import {cli} from 'cli-ux'

export default class UpdateBackend extends BaseCommand {
  static description = 'Update Backend'

  static examples = [
    '$ slash-graphql update-backend -n "New Name" 0xid',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    name: flags.string({char: 'n', description: 'Name'}),
    confirm: flags.boolean({char: 'y', description: 'Skip Confirmation', default: false}),
    'deployment-mode': flags.string({char: 'm', description: 'Deployment Mode', options: ['readonly', 'graphql', 'flexible']}),
  }

  static args = [{name: 'id', description: 'Backend UID', required: true}]

  confirm() {
    this.log('Depending on which properties you are updating, this may cause your cluster to restart. Your data will be preserved')
    return cli.confirm('Are you sure you want to proceed?')
  }

  async run() {
    const opts = this.parse(UpdateBackend)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql` login')
    }

    const updates: Record<string, string> = {}
    if (opts.flags.name) {
      updates.name = opts.flags.name
    }
    if (opts.flags['deployment-mode']) {
      updates.deploymentMode = opts.flags['deployment-mode']
    }

    if (Object.keys(updates).length === 0) {
      this.error('Please pass in a property to update')
    }

    if (!(opts.flags.confirm || await this.confirm())) {
      this.log('Aborting')
      return
    }

    const response = await fetch(`${apiServer}/deployment/${opts.args.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    })
    if (response.status !== 200) {
      this.error(`Error while updating backend\n${await response.text()}`)
    }
    if (!opts.flags.quiet) {
      this.log('Updated Backend')
    }
  }
}
