const environments = {
  stg: {
    apiServer: 'https://api.thegaas.com',
    authFile: 'auth-stg.yml',
    deploymentProtocol: 'https',
  },
  dev: {
    apiServer: 'http://localhost:8070',
    authFile: 'auth-stg.yml',
    deploymentProtocol: 'http',
  },
  prod: {
    apiServer: 'https://api.cloud.dgraph.io',
    authFile: 'auth.yml',
    deploymentProtocol: 'https',
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
