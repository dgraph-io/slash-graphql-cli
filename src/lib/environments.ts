const environments = {
  stg: {
    apiServer: 'https://api.thegaas.com',
    apiServerGo: 'https://api.thegaas.com/graphql',
    authFile: 'auth-stg.yml',
  },
  dev: {
    apiServer: 'http://localhost:8070',
    apiServerGo: 'http://localhost:8071/graphql',
    authFile: 'auth-stg.yml',
  },
  prod: {
    apiServer: 'https://api.cloud.dgraph.io',
    apiServerGo: 'https://api.cloud.dgraph.io/graphql',
    authFile: 'auth.yml',
  },
}

export function getEnvironment(env: string) {
  switch (env) {
  case 'dev': return environments.dev
  case 'stg':
  case 'staging': return environments.stg
  default: return environments.prod
  }
}
