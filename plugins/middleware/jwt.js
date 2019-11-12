const fp = require('fastify-plugin');

module.exports = fp(async fastify => {
  fastify.register(require('fastify-jwt'), {
    secret: "supersecret"
  });

  fastify.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } 
    catch (err) {
      reply.send(err);
    }
  });
});