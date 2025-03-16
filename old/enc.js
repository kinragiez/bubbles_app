function encrypt(text) {
    return Buffer.from(text).toString('base64');
}

function decrypt(encodedText) {
    return Buffer.from(encodedText, 'base64').toString('utf8');
}

module.exports = { encrypt, decrypt };