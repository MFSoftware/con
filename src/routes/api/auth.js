import speakeasy from 'speakeasy';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import config from '../../../config';

import QRCode from 'qrcode';
import User from '../../schemas/user';
import Token from '../../schemas/token';

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
        else if (!validator.isHash(request.body.password, 'sha512')) {
            reply.send({ 
                statusCode: 500, 
                error: 'Internal Server Error',
                message: 'Password must be SHA512 hash'
            });
            return;
        }

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

    /*fastify.post('/api/settings/2fa', {
        preValidation: [fastify.authenticate]
    }, async (request, reply) => {
        let secret = speakeasy.generateSecret({ length: 20 });
        QRCode.toDataURL(secret.otpauth_url, function(err, image_data) {
            reply.send({ result: true, qr: image_data });
        });
    });

    fastify.delete('/api/settings/2fa', {
        preValidation: [fastify.authenticate]
    }, async (request, reply) => {

    });*/
}