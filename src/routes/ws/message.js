import Joi from '@hapi/joi';

export default wsapi => {
    wsapi.on('message', {
        text: Joi.string().required().max(64)
    }, data => {
        console.log(data);
    });
}