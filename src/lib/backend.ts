import fetch from 'node-fetch'

type GraphQLResponse<T> = {
  data: T;
  errors?: [{ message: string }];
}

export class Backend {
  private endpointOrigin: string;

  private token: string;

  private error: (s: string) => never

  constructor(e: string, t: string, el: (s: string) => never) {
    this.endpointOrigin = new URL(e).origin
    this.token = t
    this.error = el
  }

  private async doGraphQLQuery<T>(query: string, variables = {}, {endpoint = '/admin'} = {}): Promise<GraphQLResponse<T>> {
    const adminEndpoint = this.endpointOrigin + endpoint
    const response = await fetch(adminEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: this.token,
      },
      body: JSON.stringify({query, variables}),
    })
    if (response.status !== 200) {
      this.error('Could not connect to your Slash GraphQL backend. Your credentials may be invalid')
    }
    const json = await response.json()
    return {
      data: json.data as T,
      errors: json.errors as [{ message: string }],
    }
  }

  async query<T>(query: string, variables = {}): Promise<GraphQLResponse<T>> {
    return this.doGraphQLQuery<T>(query, variables, {endpoint: '/query'})
  }

  async adminQuery<T>(query: string, variables = {}): Promise<GraphQLResponse<T>> {
    return this.doGraphQLQuery<T>(query, variables, {endpoint: '/admin'})
  }

  async slashAdminQuery<T>(query: string, variables = {}): Promise<GraphQLResponse<T>> {
    return this.doGraphQLQuery<T>(query, variables, {endpoint: '/admin/slash'})
  }

  getToken() {
    return this.token
  }

  getEndpoint() {
    return this.endpointOrigin
  }

  getGRPCEndpoint() {
    return `${new URL(this.endpointOrigin).host.replace('.', '.grpc.')}:443`
  }
}
