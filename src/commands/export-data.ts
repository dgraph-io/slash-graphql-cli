import {createDirectory, getFileName, BaseCommand} from '../lib'
import {cli} from 'cli-ux'
import {createWriteStream} from 'fs'
import {join} from 'path'
import fetch from 'node-fetch'

const QUERY = `
mutation {
  export {
    signedUrls
  }
}`

export default class ExportData extends BaseCommand {
  static description = 'Export data from your backend'

  static examples = [
    '$ slash-graphql export-data -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> ./output-directory',
  ]

  static flags = {
    ...BaseCommand.commonFlags,
    ...BaseCommand.endpointFlags,
  }

  static args = [{name: 'outputdir', description: 'Output Directory', required: true}]

  // FIXME: The progress bar can get a lot better here
  async run() {
    const opts = this.parse(ExportData)
    const backend = await this.backendFromOpts(opts)
    const outputDir = opts.args.outputdir as string

    await createDirectory(outputDir)

    if (!opts.flags.quiet) {
      this.log('Exporting Data, this might take a few minutes')
    }
    const progressBar = opts.flags.quiet ?
      null :
      cli.progress({
        format: '{step} [{bar}] {percentage}%',
      })
    progressBar && progressBar.start()
    progressBar && progressBar.update(10, {
      step: 'Exporting',
    })
    const {errors, data} = await backend.slashAdminQuery<{ export: { signedUrls: string[] } }>(QUERY)
    progressBar && progressBar.update(33, {
      step: 'Downloading',
    })
    if (errors) {
      for (const {message} of errors) {
        this.error(message)
      }
      return
    }
    const urls = data.export.signedUrls
    const stepIncrement = 67 / (urls.length || 1)
    for (const url of urls) {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetch(url)
      if (res.status !== 200 || !res.body) {
        this.error('Unable to download file')
        return
      }
      res.body.pipe(createWriteStream(join(outputDir, getFileName(url))))
      progressBar && progressBar.increment(stepIncrement)
    }
    progressBar && progressBar.update(100, {step: 'Success'})
    progressBar && progressBar.stop()
  }
}
