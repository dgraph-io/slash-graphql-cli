import schemaParser from './schemaparser'

export const getTypesDiff = (schema, graphqlEx) => {
  const graphql = schemaParser(schema)
  const graphqlTypes = graphql.types.map(type => type.name)
  const graphqlExTypes = graphqlEx.types
  .filter(type => type.name !== 'dgraph.graphql')
  .map(type => type.name)

  return graphqlExTypes.filter(type => graphqlTypes.indexOf(type) === -1)
}

export const getFieldsDiff = (schema, graphqlEx) => {
  const graphql = schemaParser(schema)
  const graphqlFields = [].concat(
    ...graphql.types.map(type =>
      type.fields
      .filter(field => field.type !== 'ID')
      .map(field => type.name + '.' + field.name)
    )
  )

  const graphqlExFields = graphqlEx.schema
  .filter(item => !item.predicate.startsWith('dgraph'))
  .map(item => item.predicate)

  return graphqlExFields.filter(field => graphqlFields.indexOf(field) === -1)
}
