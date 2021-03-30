import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'
import {flags} from '@oclif/command'
import {cli} from 'cli-ux'

const DELETE_DEPLOYMENT = `
mutation DeleteDeployment($deploymentID: String!) {
  deleteDeployment(deploymentID: $deploymentID)
}
`
export default class DestroyBackend extends BaseCommand {
  static description = 'Destroy a Backend by id'

  static examples = [
    '$ slash-graphql destroy-backend "0xid"',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    confirm: flags.boolean({char: 'y', description: 'Skip Confirmation', default: false}),
  }

  static args = [{name: 'id', description: 'Backend id', required: true}]

  confirm() {
    this.log('This will destroy your backend, and cannot be reversed')
    return cli.confirm('Are you sure you want to proceed?')
  }

  async run() {
    const opts = this.parse(DestroyBackend)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const id = opts.args.id

    if (!id.match(/0x[0-9a-f]+/)) {
      this.error(`Invalid id ${id}`)
    }

    const token = await this.getAccessToken(apiServer, authFile)
    if (!token) {
      this.error('Please login with `slash-graphql login`')
    }

    const backend = this.findBackendByUid(apiServer, token, id)

    if (!backend) {
      this.error('Cannot find the backend that you are trying to delete. Please run `slash-graphql list-backends` to get a list of backends')
    }

    if (!(opts.flags.confirm || await this.confirm())) {
      this.log('Aborting')
      return
    }

    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, DELETE_DEPLOYMENT, {
      deploymentID: opts.args.id,
    })

    if (errors) {
      for (const {message} of errors) {
        this.error('Unable to update backend. ' + message)
      }
      return
    }

    this.log(data.deleteDeployment)
  }
}
