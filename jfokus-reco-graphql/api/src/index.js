import express from 'express'
import http from 'http'
import { typeDefs } from './graphql-schema'
import { ApolloServer } from 'apollo-server-express'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import neo4j from 'neo4j-driver'
import { Neo4jGraphQL } from '@neo4j/graphql'
import { Neo4jGraphQLAuthJWTPlugin } from '@neo4j/graphql-plugin-auth'

import dotenv from 'dotenv'

// set environment variables from .env
dotenv.config()

/*
 * Create a Neo4j driver instance to connect to the database
 * using credentials specified as environment variables
 * with fallback to defaults
 */
const driver = neo4j.driver(
  process.env.NEO4J_URI || 'bolt://localhost:7687',
  neo4j.auth.basic(
    process.env.NEO4J_USER || 'neo4j',
    process.env.NEO4J_PASSWORD || 'neo4j'
  )
)

// Specify host, port and path for GraphQL endpoint
const port = process.env.GRAPHQL_SERVER_PORT || 4001
const path = process.env.GRAPHQL_SERVER_PATH || '/graphql'
const host = process.env.GRAPHQL_SERVER_HOST || '0.0.0.0'

async function startApolloServer() {
  const app = express()
  const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    plugins: {
      auth: new Neo4jGraphQLAuthJWTPlugin({
        secret: 'super-secret',
      }),
    },
  })
  const schema = await neoSchema.getSchema()
  const httpServer = http.createServer(app)
  const server = new ApolloServer({
    context: {
      driver,
      driverConfig: { database: process.env.NEO4J_DATABASE || 'neo4j' },
    },
    schema,
    plugins: [
      ApolloServerPluginLandingPageGraphQLPlayground(),
      ApolloServerPluginDrainHttpServer({ httpServer }),
    ],
    introspection: true,
  })

  await server.start()

  // Additional middleware can be mounted at this point to run before Apollo.
  // app.use('*', jwtCheck, requireAuth, checkScope);

  // Mount Apollo middleware here.
  server.applyMiddleware({ app, path })
  await new Promise((resolve) => httpServer.listen({ port }, resolve))
  console.log(
    `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
  )
  return { server, app }
}

startApolloServer()
