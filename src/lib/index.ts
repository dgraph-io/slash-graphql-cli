import {Output} from '@oclif/parser'
import {flags} from '@oclif/command'
import * as fs from 'fs'
import {spawn} from 'child_process'
import {Backend} from './backend'

const {stat, mkdir} = fs.promises

// Async so that we can eventually implement logic, and automatically get tokens
export async function backendFromOpts(opts: Output<{ endpoint: string | undefined; token: string | undefined }, any>): Promise<Backend> {
  if (opts.flags.endpoint && opts.flags.token) {
    return new Backend(opts.flags.endpoint, opts.flags.token)
  }
  throw new Error('Please pass an endpoint and api token')
}

export const endpointFlags = {
  endpoint: flags.string({char: 'e', description: 'Slash GraphQL Endpoint'}),
  token: flags.string({char: 't', description: 'Slash GraphQL Backend API Tokens'}),
}

export async function createDirectory(path: string) {
  try {
    const file = await stat(path)
    if (!file.isDirectory()) {
      throw new Error('Output path is not a directory')
    }
  } catch {
    mkdir(path, {recursive: true})
  }
}

export function getFileName(path: string): string {
  const parts = new URL(path).pathname.split('/')
  return parts[parts.length - 1]
}

export function runCommand(command: string, ...args: string[]): Promise<number> {
  return new Promise(resolve => {
    spawn(command, args, {
      stdio: 'inherit',
    }).on('close', resolve)
  })
}
