slash-graphql
=============

Command Line Tools to Manage Slash GraphQL

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/slash-graphql.svg)](https://npmjs.org/package/slash-graphql)
[![Downloads/week](https://img.shields.io/npm/dw/slash-graphql.svg)](https://npmjs.org/package/slash-graphql)
[![License](https://img.shields.io/npm/l/slash-graphql.svg)](https://github.com/dgraph-io/slash-graphql-cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g slash-graphql
$ slash-graphql COMMAND
running command...
$ slash-graphql (-v|--version|version)
slash-graphql/1.4.0 darwin-x64 node-v14.4.0
$ slash-graphql --help [COMMAND]
USAGE
  $ slash-graphql COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`slash-graphql drop-data`](#slash-graphql-drop-data)
* [`slash-graphql export-data OUTPUTDIR`](#slash-graphql-export-data-outputdir)
* [`slash-graphql get-schema [FILE]`](#slash-graphql-get-schema-file)
* [`slash-graphql help [COMMAND]`](#slash-graphql-help-command)
* [`slash-graphql import-data INPUT`](#slash-graphql-import-data-input)
* [`slash-graphql update [CHANNEL]`](#slash-graphql-update-channel)
* [`slash-graphql update-schema [FILE]`](#slash-graphql-update-schema-file)

## `slash-graphql drop-data`

Drop all data in your backend

```
USAGE
  $ slash-graphql drop-data

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -s, --drop-schema        Drop Schema along with the data
  -t, --token=token        Slash GraphQL Backend API Tokens
  -y, --confirm            Skip Confirmation

EXAMPLE
  $ slash-graphql drop-data -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> schema-file.graphql
```

_See code: [src/commands/drop-data.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.4.0/src/commands/drop-data.ts)_

## `slash-graphql export-data OUTPUTDIR`

Export data from your backend

```
USAGE
  $ slash-graphql export-data OUTPUTDIR

ARGUMENTS
  OUTPUTDIR  Output Directory

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLE
  $ slash-graphql export-data -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> ./output-directory
```

_See code: [src/commands/export-data.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.4.0/src/commands/export-data.ts)_

## `slash-graphql get-schema [FILE]`

Fetch the schema from your backend

```
USAGE
  $ slash-graphql get-schema [FILE]

ARGUMENTS
  FILE  [default: /dev/stdout] Output File

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLE
  $ slash-graphql get-schema -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken>
```

_See code: [src/commands/get-schema.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.4.0/src/commands/get-schema.ts)_

## `slash-graphql help [COMMAND]`

display help for slash-graphql

```
USAGE
  $ slash-graphql help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

## `slash-graphql import-data INPUT`

Import your data back via live loader (requires docker)

```
USAGE
  $ slash-graphql import-data INPUT

ARGUMENTS
  INPUT  Input Directory

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -t, --token=token        Slash GraphQL Backend API Tokens
  -y, --confirm            Skip Confirmation

EXAMPLE
  $ slash-graphql import-data -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> ./import-directory
```

_See code: [src/commands/import-data.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.4.0/src/commands/import-data.ts)_

## `slash-graphql update [CHANNEL]`

update the slash-graphql CLI

```
USAGE
  $ slash-graphql update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.10/src/commands/update.ts)_

## `slash-graphql update-schema [FILE]`

Update the schema in your backend

```
USAGE
  $ slash-graphql update-schema [FILE]

ARGUMENTS
  FILE  [default: /dev/stdin] Input File

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLE
  $ slash-graphql update-schema -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> schema-file.graphql
```

_See code: [src/commands/update-schema.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.4.0/src/commands/update-schema.ts)_
<!-- commandsstop -->
