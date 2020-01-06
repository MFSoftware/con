const development = process.env.PRODUCTION === 'development';

const WebSocketAPI = require('./build/libs/websocketApi').default;

const mongoose = require('mongoose');
const fastify = require('fastify')({ logger: development });
//const server = require('http').Server(fastify);
//const switchboard = require('rtc-switchboard')(server);

// Connect to MongoDB server
mongoose.connect('mongodb://localhost:27017/codamon', {
  useCreateIndex: true,
	useNewUrlParser: true,
	useUnifiedTopology: true
});

require('./plugins')(fastify);

// TODO: Start websocket api

// Load builded websocket api routes
// require('./build/routes/ws').default(wsapi);

// Include routes from builded code
require('./build/routes/api').default(fastify);

const start = async () => {
  try {
    await fastify.listen(80);
    fastify.log.info(`Server listening on ${fastify.server.address().port}`);
  } 
  catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Start HTTP server
start();

// For unit test
if (development) module.exports = this;