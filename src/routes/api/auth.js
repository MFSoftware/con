import validator from 'validator';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import config from '../../../config';

import User from '../../schemas/user';

export default fastify => {
    fastify.post('/api/auth/register', {
        body: {
            email: {
                type: 'string',
                requered: true
            },
            password: {
                type: 'string',
                requered: true
            },
            username: {
                type: 'string',
                requered: true
            }
        }
    }, async (request, reply) => {
        if (!validator.isEmail(request.body.email)) {
            reply.send({ 
                statusCode: 500, 
                error: 'Internal Server Error', 
                message: 'Not valid email address' 
            });
            return;
        }
        else if (!validator.isHash(request.body.password, 'sha512'))
            throw fastify.httpErrors.internalServerError('Password must be sha512 hash');

        User.findOne({ username: request.body.username }, (err, eusr) => {
            if (eusr == null) {
                new User({ 
                    username: request.body.username,
                    password: request.body.password,
                    email: request.body.email
                }).save((err, usr) => {
                    if (usr == null) reply.send(err);
                    else {
                        jwt.sign({ 
                            user: request.body.username,
                            nonce: 1
                        }, config.jwtSecret, {
                            expiresIn: '5h'
                        }, (err, token) => reply.send({ token }));
                    }
                });
            }
            else reply.send({ result: false, message: 'User already exists' });
        });
    });
}