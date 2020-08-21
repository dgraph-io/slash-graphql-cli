const environments = {
  stg: {
    auth0domain: 'dev-dgraph-saas.auth0.com',
    auth0clientId: 'P221BC5Rv1ByZOHGCcCJ7U07d0njVIKt',
    audience: 'http://localhost:8070',
    apiServer: 'https://api.thegaas.com',
    authFile: 'auth-stg.yml',
  },
  prod: {
    auth0domain: 'login.dgraph.io',
    auth0clientId: '0qOIoJon9BtMMyCfdkvxU68sbnR4jcjw',
    apiServer: 'https://api.cloud.dgraph.io',
    audience: 'https://cloud.dgraph.io',
    authFile: 'auth.yml',
  },
}

export function getEnvironment(env: string) {
  return env === 'stg' ? environments.stg : environments.prod
}
