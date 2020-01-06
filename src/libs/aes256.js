import crypto from 'crypto';
import cryptiles from '@hapi/cryptiles';
import sha256 from 'sha256';

export default class AES256 {
    constructor(options = {}) {
        if (options.key == 'undefined') options.key = cryptiles.randomString(32);

        Object.assign(this, options);

        this.encrypt = value => {
            const iv = cryptiles.randomString(16);

            let cipher = crypto.createCipheriv('aes-256-cbc', sha256(this.key), iv);
            let ciphertext = cipher.update(Buffer.from(value));
            return Buffer.concat([ iv, ciphertext, cipher.final() ]).toString('base64');
        };

        this.decrypt = value => {
            const iv = input.slice(0, 16);
            let decipher = crypto.createDecipheriv('aes-256-cbc', sha256(this.key), iv);
            let ciphertext = input.slice(16);
            let plaintext = decipher.update(ciphertext) + decipher.final();
            return plaintext;
        };
    }

    static encrypt(key, value) {

    }

    static decrypt(key, value) {

    }
}