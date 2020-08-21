import fetch from 'node-fetch'

type GraphQLResponse<T> = {
  data: T;
  errors?: [{ message: string }];
}

export class Backend {
  private endpointOrigin: string;

  private token: string;

  constructor(e: string, t: string) {
    this.endpointOrigin = new URL(e).origin
    this.token = t
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
      throw new Error('Could not connect to your slash backend. Did you pass in the correct api token?')
    }
    const json = await response.json()
    return {
      data: json.data as T,
      errors: json.errors as [{ message: string }],
    }
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
