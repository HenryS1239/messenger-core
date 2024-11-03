import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { CIPHER_ALGORITHM, CIPHER_KEY } from '@src/config';

@Injectable()
export class CipherService {
    encrypt(data) {
        const iv = crypto.randomBytes(16);
        const cipher = crypto.createCipheriv(CIPHER_ALGORITHM, Buffer.from(CIPHER_KEY), iv);
        const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);

        const obj = { iv: iv.toString('hex'), encrypted: encrypted.toString('hex') };
        return new Buffer(JSON.stringify(obj)).toString('base64');
    }

    decrypt(encrypted) {
        const obj = JSON.parse((new Buffer(encrypted, 'base64')).toString('utf8'));
        const iv = Buffer.from(obj.iv, 'hex');
        const decipher = crypto.createDecipheriv(CIPHER_ALGORITHM, Buffer.from(CIPHER_KEY), iv);
        const decrypted = Buffer.concat([decipher.update(Buffer.from(obj.encrypted, 'hex')), decipher.final()]);
        return decrypted.toString();
    }
}
