import {buildSchema} from 'graphql'
import schemaExtras from './schemaextras'
import * as difference from 'lodash/difference'

const compare = (a, b) => a.astNode.loc.start - b.astNode.loc.start

const hasSubscription = type => Boolean(Object.values(type.astNode.directives).find(directive => directive.name.value === 'withSubscription'))

const isMandatory = type => String(type)[String(type).length - 1] === '!'

const isArray = type => String(type)[0] === '['

const isArrayMandatory = type => {
  const diff = isMandatory(type) ? -2 : -1
  return isArray(type) && isMandatory(String(type).slice(1, diff))
}

const sanitizeType = type => {
  let result = String(type)
  if (isMandatory(result)) result = String(result).slice(0, -1)
  if (isArray(result)) result = String(result).slice(1, -1)
  if (isMandatory(result)) result = String(result).slice(0, -1)
  return result
}

const parseArguments = argument => {
  return {
    [argument.name.value]:
      argument.value.value || argument.value.values.map(arg => arg.value)
  }
}

const parseDirectives = directives => {
  return {
    name: directives.name.value,
    params: Object.values(directives.arguments).map(argument =>
      parseArguments(argument)
    ),
  }
}

const parseFields = field => {
  return {
    name: field.name,
    type: sanitizeType(field.type),
    mandatory: isMandatory(field.type),
    array: isArray(field.type),
    arrayMandatory: isArrayMandatory(field.type),
    directives: Object.values(field.astNode.directives).map(directive =>
      parseDirectives(directive)
    ),
  }
}

const parseTypes = type => {
  return {
    name: type.name,
    description: type.description,
    subscription: hasSubscription(type),
    fields: Object.values(type.getFields()).map(field => parseFields(field))
  }
}

const parseSchema = inputSchema => {
  const schema = schemaExtras + inputSchema
  const wholeSchema = buildSchema(schema)
  const extraSchema = buildSchema(schemaExtras)
  const types = difference(
    Object.keys(wholeSchema._typeMap),
    Object.keys(extraSchema._typeMap)
  )

  return {
    types: Object.values(types)
    .map(type => wholeSchema.getType(type))
    .filter(
      type => type.astNode && type.astNode.kind === 'ObjectTypeDefinition'
    )
    .sort(compare)
    .reduce((result, schemaType) => {
      result.push(parseTypes(schemaType))
      return result
    }, []),
  }
}

export default parseSchema
