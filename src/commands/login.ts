import { BaseCommand } from '../lib'
import { getEnvironment } from '../lib/environments'
import fetch from 'node-fetch'

const LOGIN_QUERY = `
query login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
  }
}
`

export default class Login extends BaseCommand {
  static description = 'Login to Slash GraphQL. Calling this function will keep you logged in for 24 hours, and you will not need to pass access tokens for any backends that you own'

  static examples = [
    '$ slash-graphql login email password',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
  }

  static args = [
    { name: 'email', required: true },
    { name: 'password', required: true },
  ]

  async run() {
    const opts = this.parse(Login)
    const { apiServer, authFile } = getEnvironment(opts.flags.environment)

    const res = await fetch(`${apiServer}/graphql`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        query: LOGIN_QUERY,
        variables: opts.args,
      }),
    })

    if (res.status !== 200) {
      this.error('Error contacting auth server.')
      return
    }

    const resJson = await res.json()

    if (!resJson.data?.login) {
      this.error('The email or password were incorrect. Please try again.')
      return
    }

    const token = resJson.data.login.token
    if (!token) {
      this.error('Error retrieving your access token.')
      return
    }

    const tokenJSON = { access_token: token, expires_in: 10800, token_type: 'Bearer', apiTime: Date.now(), scope: 'offline_access', refresh_token: '' }
    this.writeAuthFile(authFile, tokenJSON)

    this.log('Logged In')
  }
}