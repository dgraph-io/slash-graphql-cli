import {BaseCommand} from '../lib'
import {getEnvironment} from '../lib/environments'

const CREATE_ORGANIZATION = `
mutation CreateOrganization($name: String!) {
    createOrganization(input: { name: $name }) {
      name
      uid
    }
}
`

export default class CreateOrganization extends BaseCommand {
  static hidden = true

  static description = 'Create an Organization'

  static examples = [
    '$ slash-graphql create-organization myNewOrganization',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
  }

  static args = [{name: 'name', description: 'Organization Name', required: true}]

  async run() {
    const opts = this.parse(CreateOrganization)
    const {apiServer, authFile} = getEnvironment(opts.flags.environment)

    const token = await this.getAccessToken(apiServer, authFile)

    if (!token) {
      this.error('Please login with `slash-graphql login` before creating a backend')
    }

    const {errors, data} = await this.sendGraphQLRequest(apiServer, token, CREATE_ORGANIZATION, {
      name: opts.args.name,
    })

    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    this.log('Organization', data.createOrganization.name, 'created successfully.')
  }
}
