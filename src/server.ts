import { ApolloServer } from 'apollo-server-fastify';
import { resolvers, typeDefs } from './schema'
import { context } from './context'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import fastify from 'fastify';


function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
    return {
      async serverWillStart() {
        return {
          async drainServer() {
            await app.close();
          },
        };
      },
    };
  }
  
  async function startApolloServer(typeDefs, resolvers) {
    const app = fastify();
    const server = new ApolloServer({
      typeDefs,
      resolvers,
      context,
      plugins: [
        fastifyAppClosePlugin(app),
        ApolloServerPluginDrainHttpServer({ httpServer: app.server }),
      ],
    });
    
    await server.start();
    app.register(server.createHandler());
    await app.listen(4000);
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  }

  startApolloServer(typeDefs, resolvers)