// Author: Ritchie Yapp
// https://github.com/speckly

const crypto = require('crypto');
const fs = require('fs');

const keyFilePath = './secretKey.txt';

function generateRandomKey(length) {
    const buffer = crypto.randomBytes(length);
    return buffer.toString('base64');
}

const rotationPeriodDays = 90;
let lastRotationDate;
let secret;

function rotateKeyIfNeeded() {
    const now = new Date();
    const rotationThreshold = new Date(lastRotationDate.getTime() + rotationPeriodDays * 24 * 60 * 60 * 1000);

    if (!lastRotationDate || now >= rotationThreshold) {
        secret = generateRandomKey(32);
        lastRotationDate = now;
        const content = JSON.stringify({ secret, lastRotationDate });
        fs.writeFileSync(keyFilePath, content, 'utf-8');
    }
}

function getCurrentKey() {
    if (!secret || !lastRotationDate) {
        try {
            const content = fs.readFileSync(keyFilePath, 'utf-8');
            const data = JSON.parse(content);
            secret = String(data.secret);
            lastRotationDate = new Date(data.lastRotationDate);
        } catch (error) {
            // If the file doesn't exist or there's an error reading it, generate a new key and store
            secret = generateRandomKey(32);
            lastRotationDate = new Date();
            const content = JSON.stringify({ secret, lastRotationDate });
            fs.writeFileSync(keyFilePath, content, 'utf-8');
        }
    }

    rotateKeyIfNeeded();
    return secret;
}

module.exports.getCurrentKey = getCurrentKey;
