module.exports = fastify => {
    // Setup HTTP server plugins
    fastify.register(require('./middleware/jwt'));
    fastify.register(require('fastify-helmet'));
    fastify.register(require('fastify-sensible'));
}