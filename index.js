const Joi = require('@hapi/joi');
const WebSocketAPI = require('./build/libs/websocketApi').default;

const mongoose = require('mongoose');
const fastify = require('fastify')({ logger: false });
const { sendAll } = require('./build/websocketFunctions').default;

// Connect to MongoDB server
mongoose.connect('mongodb://localhost:27017/codamon', { 
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Set handler for 404 page
fastify.setNotFoundHandler((request, reply) => {
  reply.code(404).type('text/plain').send('a custom not found');
});

require('./plugins')(fastify);

// Start websocket api
const wsapi = new WebSocketAPI({ port: 8080 });
//wsapi.on('postConnection', () => sendAll(clients, JSON.stringify({ type: 'new_client' })));
wsapi.on('echo', {
  text: Joi.string().required()
}, data => {
  console.log(data.text);
});

// Load websocket api routes
//require('./build/routes/ws').default(wsapi);

// Include routes from builded code
require('./build/routes/api').default(fastify);

const start = async () => {
  try {
    await fastify.listen(1241);
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } 
  catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Start HTTP server
start();