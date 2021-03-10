// https://stackoverflow.com/a/57713960
if (typeof global.TextEncoder === 'undefined') {
    const { TextEncoder } = require('util');
    global.TextEncoder = TextEncoder;
}