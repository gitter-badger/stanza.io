'use strict';

exports.JID = require('xmpp-jid').JID;
exports.Client = require('./lib/client');


exports.createClient = function (opts) {
    var client = new exports.Client(opts);
    client.use(require('./lib/plugins'));

    return client;
};
