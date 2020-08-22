slash-graphql
=============

Manage Slash GraphQL from the comfort of your command line!

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
slash-graphql/1.7.1 darwin-x64 node-v14.4.0
$ slash-graphql --help [COMMAND]
USAGE
  $ slash-graphql COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`slash-graphql create-backend NAME`](#slash-graphql-create-backend-name)
* [`slash-graphql drop-data`](#slash-graphql-drop-data)
* [`slash-graphql export-data OUTPUTDIR`](#slash-graphql-export-data-outputdir)
* [`slash-graphql get-schema [FILE]`](#slash-graphql-get-schema-file)
* [`slash-graphql help [COMMAND]`](#slash-graphql-help-command)
* [`slash-graphql import-data INPUT`](#slash-graphql-import-data-input)
* [`slash-graphql list-backends`](#slash-graphql-list-backends)
* [`slash-graphql login`](#slash-graphql-login)
* [`slash-graphql update [CHANNEL]`](#slash-graphql-update-channel)
* [`slash-graphql update-schema [FILE]`](#slash-graphql-update-schema-file)

## `slash-graphql create-backend NAME`

Create a new Backend

```
USAGE
  $ slash-graphql create-backend NAME

ARGUMENTS
  NAME  Backend Name

OPTIONS
  -q, --quiet                Quiet Output
  -r, --region=region        [default: us-west-1] Region
  -r, --subdomain=subdomain  Region

EXAMPLE
  $ slash-graphql create-backend "My New Backend"
```

_See code: [src/commands/create-backend.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.7.1/src/commands/create-backend.ts)_

## `slash-graphql drop-data`

Drop all data in your backend

```
USAGE
  $ slash-graphql drop-data

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -q, --quiet              Quiet Output
  -s, --drop-schema        Drop Schema along with the data
  -t, --token=token        Slash GraphQL Backend API Tokens
  -y, --confirm            Skip Confirmation

EXAMPLE
  $ slash-graphql drop-data -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> schema-file.graphql
```

_See code: [src/commands/drop-data.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.7.1/src/commands/drop-data.ts)_

## `slash-graphql export-data OUTPUTDIR`

Export data from your backend

```
USAGE
  $ slash-graphql export-data OUTPUTDIR

ARGUMENTS
  OUTPUTDIR  Output Directory

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLE
  $ slash-graphql export-data -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> ./output-directory
```

_See code: [src/commands/export-data.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.7.1/src/commands/export-data.ts)_

## `slash-graphql get-schema [FILE]`

Fetch the schema from your backend

```
USAGE
  $ slash-graphql get-schema [FILE]

ARGUMENTS
  FILE  [default: /dev/stdout] Output File

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLE
  $ slash-graphql get-schema -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken>
```

_See code: [src/commands/get-schema.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.7.1/src/commands/get-schema.ts)_

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
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens
  -y, --confirm            Skip Confirmation

EXAMPLE
  $ slash-graphql import-data -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> ./import-directory
```

_See code: [src/commands/import-data.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.7.1/src/commands/import-data.ts)_

## `slash-graphql list-backends`

List your backends

```
USAGE
  $ slash-graphql list-backends

OPTIONS
  -q, --quiet             Quiet Output
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)

EXAMPLES
  $ slash-graphql list-backends
  $ slash-graphql list-backends --csv
```

_See code: [src/commands/list-backends.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.7.1/src/commands/list-backends.ts)_

## `slash-graphql login`

Login to Slash GraphQL. Calling this function will keep you logged in for 24 hours, and you will not need to pass access tokens for any backends that you own

```
USAGE
  $ slash-graphql login

OPTIONS
  -q, --quiet  Quiet Output

EXAMPLE
  $ slash-graphql login
```

_See code: [src/commands/login.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.7.1/src/commands/login.ts)_

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
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLE
  $ slash-graphql update-schema -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> schema-file.graphql
```

_See code: [src/commands/update-schema.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.7.1/src/commands/update-schema.ts)_
<!-- commandsstop -->
