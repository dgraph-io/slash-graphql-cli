**The slash-graphql CLI tool is deprecated and no longer maintained.**

You can now manage your Dgraph Cloud backends using the [Dgraph Cloud API](https://dgraph.io/docs/cloud/cloud-api/).

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
* [`slash-graphql add-member-to-organization ORGANIZATION MEMBER`](#slash-graphql-add-member-to-organization-organization-member)
* [`slash-graphql create-organization NAME`](#slash-graphql-create-organization-name)
* [`slash-graphql delete-lambda`](#slash-graphql-delete-lambda)
* [`slash-graphql deploy-backend NAME`](#slash-graphql-deploy-backend-name)
* [`slash-graphql destroy-backend ID`](#slash-graphql-destroy-backend-id)
* [`slash-graphql drop`](#slash-graphql-drop)
* [`slash-graphql export-data OUTPUTDIR`](#slash-graphql-export-data-outputdir)
* [`slash-graphql get-lambda`](#slash-graphql-get-lambda)
* [`slash-graphql get-schema [FILE]`](#slash-graphql-get-schema-file)
* [`slash-graphql help [COMMAND]`](#slash-graphql-help-command)
* [`slash-graphql import-data INPUT`](#slash-graphql-import-data-input)
* [`slash-graphql lambda-logs`](#slash-graphql-lambda-logs)
* [`slash-graphql list-backends`](#slash-graphql-list-backends)
* [`slash-graphql list-backups`](#slash-graphql-list-backups)
* [`slash-graphql list-organizations`](#slash-graphql-list-organizations)
* [`slash-graphql login EMAIL PASSWORD`](#slash-graphql-login-email-password)
* [`slash-graphql logout`](#slash-graphql-logout)
* [`slash-graphql remove-member-from-organization ORGANIZATION MEMBER`](#slash-graphql-remove-member-from-organization-organization-member)
* [`slash-graphql restore-backend`](#slash-graphql-restore-backend)
* [`slash-graphql restore-backend-status RESTOREID`](#slash-graphql-restore-backend-status-restoreid)
* [`slash-graphql update [CHANNEL]`](#slash-graphql-update-channel)
* [`slash-graphql update-backend`](#slash-graphql-update-backend)
* [`slash-graphql update-lambda`](#slash-graphql-update-lambda)
* [`slash-graphql update-schema [FILE]`](#slash-graphql-update-schema-file)

## `slash-graphql add-member-to-organization ORGANIZATION MEMBER`

Add a Member to an Organization

```
USAGE
  $ slash-graphql add-member-to-organization ORGANIZATION MEMBER

ARGUMENTS
  ORGANIZATION  Organization Name
  MEMBER        Member Email Address

OPTIONS
  -q, --quiet  Quiet Output

EXAMPLE
  $ slash-graphql add-member-to-organization 0x123 user@dgraph.io
```

_See code: [src/commands/add-member-to-organization.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/add-member-to-organization.ts)_

## `slash-graphql create-organization NAME`

Create an Organization

```
USAGE
  $ slash-graphql create-organization NAME

ARGUMENTS
  NAME  Organization Name

OPTIONS
  -q, --quiet  Quiet Output

EXAMPLE
  $ slash-graphql create-organization myNewOrganization
```

_See code: [src/commands/create-organization.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/create-organization.ts)_

## `slash-graphql delete-lambda`

Delete the Lambda script associated with the backend.

```
USAGE
  $ slash-graphql delete-lambda

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens
  -y, --confirm            Skip Confirmation

EXAMPLES
  $ slash-graphql delete-lambda -e https://frozen-mango.cloud.dgraph.io/graphql
  $ slash-graphql delete-lambda -e 0x1234
```

_See code: [src/commands/delete-lambda.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/delete-lambda.ts)_

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

## `slash-graphql drop`

Drop all data in your backend

```
USAGE
  $ slash-graphql drop

OPTIONS
  -F, --drop-fields=drop-fields  Drop types
  -T, --drop-types=drop-types    Drop types
  -d, --drop-data                Drop data and leave the schema
  -e, --endpoint=endpoint        Slash GraphQL Endpoint
  -l, --list-unused              List unused types and fields
  -q, --quiet                    Quiet Output
  -s, --drop-schema              Drop Schema along with the data
  -t, --token=token              Slash GraphQL Backend API Tokens
  -u, --drop-unused              Drops all unused types and fields
  -y, --confirm                  Skip Confirmation

EXAMPLE
  $ slash-graphql drop -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> [-l] [-d] [-s] [-T <types>] [-F 
  <fields>]
```

_See code: [src/commands/drop.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/drop.ts)_

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

_See code: [src/commands/export-data.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/export-data.ts)_

## `slash-graphql get-lambda`

Get the Lambda script associated with the backend.

```
USAGE
  $ slash-graphql get-lambda

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLES
  $ slash-graphql get-lambda -e https://frozen-mango.cloud.dgraph.io/graphql
  $ slash-graphql get-lambda -e 0x1234
```

_See code: [src/commands/get-lambda.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/get-lambda.ts)_

## `slash-graphql get-schema [FILE]`

Fetch the schema from your backend

```
USAGE
  $ slash-graphql get-schema [FILE]

ARGUMENTS
  FILE  [default: /dev/stdout] Output File

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -g, --generated-schema   Fetch the full schema generated by Slash GraphQL
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLES
  $ slash-graphql get-schema -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken>
  $ slash-graphql get-schema -e 0x42
  $ slash-graphql get-schema -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken> -g
```

_See code: [src/commands/get-schema.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/get-schema.ts)_

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

_See code: [src/commands/import-data.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/import-data.ts)_

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

_See code: [src/commands/list-backends.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/list-backends.ts)_

## `slash-graphql list-backups`

List all backups of the current backend

```
USAGE
  $ slash-graphql list-backups

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLE
  $ slash-graphql list-backups -e https://frozen-mango.cloud.dgraph.io/graphql -t <apiToken>
```

_See code: [src/commands/list-backups.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/list-backups.ts)_

## `slash-graphql list-organizations`

List Organizations associated with the user

```
USAGE
  $ slash-graphql list-organizations

OPTIONS
  -q, --quiet  Quiet Output

EXAMPLE
  $ slash-graphql list-organizations
```

_See code: [src/commands/list-organizations.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/list-organizations.ts)_

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

## `slash-graphql remove-member-from-organization ORGANIZATION MEMBER`

Remove a Member from Organization

```
USAGE
  $ slash-graphql remove-member-from-organization ORGANIZATION MEMBER

ARGUMENTS
  ORGANIZATION  Organization UID
  MEMBER        Member Email Address

OPTIONS
  -q, --quiet  Quiet Output

EXAMPLE
  $ slash-graphql remove-organization-member 0x123 member@dgraph.io
```

_See code: [src/commands/remove-member-from-organization.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/remove-member-from-organization.ts)_

## `slash-graphql restore-backend`

Restore into a backend by source backend ID

```
USAGE
  $ slash-graphql restore-backend

OPTIONS
  -e, --endpoint=endpoint          Slash GraphQL Endpoint
  -f, --backupFolder=backupFolder  Backup folder retrieved from list-backups. Defaults to ""(latest).
  -n, --backupNum=backupNum        Backup number retrieved from list-backups. Defaults to 0(latest).
  -q, --quiet                      Quiet Output
  -s, --source=source              (required) Source backend ID or url to get the data to be restored
  -t, --token=token                Slash GraphQL Backend API Tokens
  -y, --confirm                    Skip Confirmation

EXAMPLE
  $ slash-graphql restore-backend -e https://clone.cloud.dgraph.io/graphql -t <apiToken> --source <source backend id or 
  url> [-f <backup folder> -n <backup number>]
```

_See code: [src/commands/restore-backend.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/restore-backend.ts)_

## `slash-graphql restore-backend-status RESTOREID`

Retrieve the status of a restore operation

```
USAGE
  $ slash-graphql restore-backend-status RESTOREID

ARGUMENTS
  RESTOREID  Restore ID

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLE
  $ slash-graphql restore-backend-status -e https://clone.cloud.dgraph.io/graphql -t <apiToken> "restoreID"
```

_See code: [src/commands/restore-backend-status.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/restore-backend-status.ts)_

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

## `slash-graphql update-lambda`

Get the Lambda script associated with the backend.

```
USAGE
  $ slash-graphql update-lambda

OPTIONS
  -e, --endpoint=endpoint  Slash GraphQL Endpoint
  -f, --file=file          (required) Lambda script file path.
  -q, --quiet              Quiet Output
  -t, --token=token        Slash GraphQL Backend API Tokens

EXAMPLES
  $ slash-graphql update-lambda -e https://frozen-mango.cloud.dgraph.io/graphql -f <filepath>
  $ slash-graphql update-lambda -e 0x1234 -f /home/user/Downloads/script.js
```

_See code: [src/commands/update-lambda.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/update-lambda.ts)_

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

_See code: [src/commands/update-schema.ts](https://github.com/dgraph-io/slash-graphql-cli/blob/v1.18.0/src/commands/update-schema.ts)_
<!-- commandsstop -->
