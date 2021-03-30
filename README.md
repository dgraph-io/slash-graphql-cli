# slash-graphql

Manage Slash GraphQL from the comfort of your command line!

[![Version](https://img.shields.io/npm/v/slash-graphql.svg)](https://npmjs.org/package/slash-graphql)
[![Downloads/week](https://img.shields.io/npm/dw/slash-graphql.svg)](https://npmjs.org/package/slash-graphql)
[![License](https://img.shields.io/npm/l/slash-graphql.svg)](https://github.com/dgraph-io/slash-graphql-cli/blob/master/package.json)

<!-- toc -->
* [slash-graphql](#slash-graphql)
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
slash-graphql/1.18.0 darwin-x64 node-v14.9.0
$ slash-graphql --help [COMMAND]
USAGE
  $ slash-graphql COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`slash-graphql deploy-backend NAME`](#slash-graphql-deploy-backend-name)
* [`slash-graphql destroy-backend ID`](#slash-graphql-destroy-backend-id)
* [`slash-graphql lambda-logs`](#slash-graphql-lambda-logs)
* [`slash-graphql login EMAIL PASSWORD`](#slash-graphql-login-email-password)
* [`slash-graphql logout`](#slash-graphql-logout)
* [`slash-graphql update-backend`](#slash-graphql-update-backend)

## `slash-graphql deploy-backend NAME`

Launch a new Backend

```
USAGE
  $ slash-graphql deploy-backend NAME

ARGUMENTS
  NAME  Backend Name

OPTIONS
  -T, --type=slash-graphql|dedicated    [default: slash-graphql] Backend Type
  -m, --mode=readonly|graphql|flexible  [default: graphql] Backend Mode
  -o, --organizationId=organizationId   Organization ID
  -q, --quiet                           Quiet Output
  -r, --region=region                   Region
  -s, --subdomain=subdomain             Subdomain
  --acl=true|false                      [default: false] Enable ACL (Only works for dedicated backends)
  --dataFile=dataFile                   Data File Path for Bulk Loader (Only works for dedicated backends)
  --dgraphHA=true|false                 [default: false] Enable High Availability (Only works for dedicated backends)
  --gqlSchemaFile=gqlSchemaFile         GQL Schema File Path for Bulk Loader (Only works for dedicated backends)
  --jaeger=true|false                   [default: false] Enable Jaeger (Only works for dedicated backends)
  --schemaFile=schemaFile               Dgraph Schema File Path for Bulk Loader (Only works for dedicated backends)
  --size=small|medium|large|xlarge      [default: small] Backend Size (Only Works for dedicated backends)

  --storage=storage                     [default: 10] Alpha Storage in GBs - Accepts Only Integers (Only Works for
                                        dedicated backends)

ALIASES
  $ slash-graphql create-backend
  $ slash-graphql launch-backend

EXAMPLES
  $ slash-graphql deploy-backend "My New Backend"
  $ slash-graphql deploy-backend "My New Backend"
```

_See code: [src/commands/deploy-backend.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/deploy-backend.ts)_

## `slash-graphql destroy-backend ID`

Destroy a Backend by id

```
USAGE
  $ slash-graphql destroy-backend ID

ARGUMENTS
  ID  Backend id

OPTIONS
  -q, --quiet    Quiet Output
  -y, --confirm  Skip Confirmation

EXAMPLE
  $ slash-graphql destroy-backend "0xid"
```

_See code: [src/commands/destroy-backend.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/destroy-backend.ts)_

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

## `slash-graphql lambda-logs`

Get the Lambda script associated with the backend.

```
USAGE
  $ slash-graphql lambda-logs

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -h, --hours=hours        [default: 1] Show lambda logs for last given hours. Defaults to 1 hour.
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLES
  $ slash-graphql lambda-logs -e https://frozen-mango.cloud.dgraph.io/graphql
  $ slash-graphql lambda-logs -e 0x1234 -h 5
```

_See code: [src/commands/lambda-logs.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/lambda-logs.ts)_

## `slash-graphql login EMAIL PASSWORD`

Login to Slash GraphQL. Calling this function will keep you logged in for 24 hours, and you will not need to pass access tokens for any backends that you own

```
USAGE
  $ slash-graphql login EMAIL PASSWORD

OPTIONS
  -q, --quiet  Quiet Output

EXAMPLE
  $ slash-graphql login email password
```

_See code: [src/commands/login.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/login.ts)_

## `slash-graphql logout`

Logout of Slash GraphQL Command Line

```
USAGE
  $ slash-graphql logout

OPTIONS
  -a, --all    Log out of all command line clients
  -q, --quiet  Quiet Output

EXAMPLES
  $ slash-graphql logout
  $ slash-graphql logout -a
```

_See code: [src/commands/logout.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/logout.ts)_

## `slash-graphql update [CHANNEL]`

update the slash-graphql CLI

```
USAGE
  $ slash-graphql update [CHANNEL]
```

_See code: [@oclif/plugin-update](https://github.com/oclif/plugin-update/blob/v1.3.10/src/commands/update.ts)_

## `slash-graphql update-backend`

Update Backend

```
USAGE
  $ slash-graphql update-backend

OPTIONS
  -e, --endpoint=endpoint               Slash GraphQL Endpoint
  -m, --mode=readonly|graphql|flexible  Backend Mode
  -n, --name=name                       Name
  -o, --organizationId=organizationId   Organization UID
  -q, --quiet                           Quiet Output
  -t, --token=token                     Slash GraphQL Backend API Tokens
  -y, --confirm                         Skip Confirmation

EXAMPLE
  $ slash-graphql update-backend -e 0xid -n "New Name" -m flexible
```

_See code: [src/commands/update-backend.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/update-backend.ts)_


_See code: [src/commands/update-schema.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/update-schema.ts)_
<!-- commandsstop -->
