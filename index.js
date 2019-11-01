const Joi = require('@hapi/joi');
const WebSocketServer = require('ws').Server;
const WebSocketAPI = require('./build/libs/websocketApi').default;

const uuidv1 = require('uuid/v1');
const validator = require('validator');
const fastify = require('fastify')({ logger: false });
fastify.register(require('./middleware/jwt'));
fastify.register(require('fastify-helmet'));

// Start websocket server
const wss = new WebSocketServer({ port: 8080 });

// Start websocket api
const wsapi = new WebSocketAPI;
// Load websocket api routes
require('./build/routes/ws').default(wsapi);

// Array of connected users
let clients = [];
const { sendAll } = require('./build/websocketFunctions').default;

wss.on('connection', (ws, req) => {
  let ip = req.connection.remoteAddress;
  let uuid = uuidv1();
  let id = clients.length;

  ws.on('message', data => {
    if (!validator.isJSON(data)) {
      ws.close();
      delete clients[id];
      return;
    }

    if (Joi.object({
      type: Joi.string().valid('new_message').required()
    }).validate(JSON.parse(data)).error == null) {
      data = JSON.parse(data);
      delete data.type;

      wsapi.parseEvent(data.type, data);
    }
  });

  ws.on('close', () => {
    delete clients[id];
  });

  sendAll(clients, JSON.stringify({ type: 'new_client' }));
  clients.push({ uuid, ip, ws });
});

// Include routes from builded ES5 code
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