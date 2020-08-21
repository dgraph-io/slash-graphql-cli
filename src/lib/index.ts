import {Output} from '@oclif/parser'
import fetch from 'node-fetch'

class Backend {
  private endpoint: string;

  private token: string;

  constructor(e: string, t: string) {
    this.endpoint = e
    this.token = t
  }

  async adminQuery<T>(query: string, variables = {}): Promise<T> {
    const adminEndpoint = this.endpoint.replace(/graphql$/, 'admin')
    const response = await fetch(adminEndpoint, {
      method: 'POST',
      url: adminEndpoint,
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token,
      },
      body: JSON.stringify({query, variables}),
    })
    if (response.status !== 200) {
      throw new Error('Could not connect to your slash backend. Did you pass in the correct api token?')
    }
    const json = await response.json()
    return json.data as T
  }
}

// Async so that we can eventually implement logic, and automatically get tokens
export async function endpointAuth(opts: Output<{ endpoint: string | undefined; token: string | undefined }, any>): Promise<Backend> {
  if (opts.flags.endpoint && opts.flags.token) {
    return new Backend(opts.flags.endpoint, opts.flags.token)
  }
  throw new Error('Please pass an endpoint and api token')
}
