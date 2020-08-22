const environments = {
  stg: {
    apiServer: 'https://api.thegaas.com',
    authFile: 'auth-stg.yml',
  },
  prod: {
    apiServer: 'https://api.cloud.dgraph.io',
    authFile: 'auth.yml',
  },
}

export function getEnvironment(env: string) {
  return env === 'stg' ? environments.stg : environments.prod
}
