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
slash-graphql/0.1.0 darwin-x64 node-v14.4.0
$ slash-graphql --help [COMMAND]
USAGE
  $ slash-graphql COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`slash-graphql drop-data`](#slash-graphql-drop-data)
* [`slash-graphql get-schema [FILE]`](#slash-graphql-get-schema-file)
* [`slash-graphql help [COMMAND]`](#slash-graphql-help-command)
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
  $ slash-graphql drop-data -e https://frozen-mango.cloud.dgraph.io/graphql -t secretToken= schema-file.graphql
```

_See code: [src/commands/drop-data.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v0.1.0/src/commands/drop-data.ts)_

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
  $ slash-graphql get-schema -e https://frozen-mango.cloud.dgraph.io/graphql -t secretToken=
```

_See code: [src/commands/get-schema.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v0.1.0/src/commands/get-schema.ts)_

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
  $ slash-graphql update-schema -e https://frozen-mango.cloud.dgraph.io/graphql -t secretToken= schema-file.graphql
```

_See code: [src/commands/update-schema.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v0.1.0/src/commands/update-schema.ts)_
<!-- commandsstop -->
