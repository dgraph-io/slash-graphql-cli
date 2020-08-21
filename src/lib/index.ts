import {Output} from '@oclif/parser'
import Command, {flags} from '@oclif/command'
import * as fs from 'fs'
import {spawn} from 'child_process'
import {Backend} from './backend'
import * as getStdin from 'get-stdin'

const {stat, mkdir} = fs.promises

export abstract class BaseCommand extends Command {
  static globalFlags = {
    environment: flags.string({description: 'Environment', default: 'prod', hidden: true}),
  }

  static endpointFlags = {
    endpoint: flags.string({char: 'e', description: 'Slash GraphQL Endpoint'}),
    token: flags.string({char: 't', description: 'Slash GraphQL Backend API Tokens'}),
  }

  // Async so that we can eventually implement logic, and automatically get tokens
  async  backendFromOpts(opts: Output<{ endpoint: string | undefined; token: string | undefined }, any>): Promise<Backend> {
    if (opts.flags.endpoint && opts.flags.token) {
      return new Backend(opts.flags.endpoint, opts.flags.token)
    }
    throw new Error('Please pass an endpoint and api token')
  }
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

export async function writeFile(path: string, data: string) {
  if (path === '/dev/stdout') {
    await new Promise(resolve => process.stdout.write(data, resolve))
  } else {
    await fs.promises.writeFile(path, data)
  }
}

export async function readFile(path: string): Promise<Buffer> {
  if (path === '/dev/stdin') {
    return getStdin.buffer()
  }
  return fs.promises.readFile(path)
}
