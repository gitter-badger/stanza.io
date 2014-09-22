'use strict';


module.exports = function (client, stanzas) {
    stanzas.use(require('../stanza/pubsub'));
    stanzas.use(require('../stanza/pubsubOwner'));
    stanzas.use(require('../stanza/pubsubEvents'));
    stanzas.use(require('../stanza/pubsubError'));

    client.on('message', function (msg) {
        if (msg.event) {
            client.emit('pubsub:event', msg);
            if (msg.event.updated) {
                client.emit('pubsub:updated', msg, msg.event.updated);
                client.emit('pubsub:updated:[' + msg.event.node + ']', msg, msg.event.updated);
            } else if (msg.event.deleted) {
                client.emit('pubsub:deleted', msg);
            } else if (msg.event.purged) {
                client.emit('pubsub:purged', msg);
            } else if (msg.event.subscriptionChanged) {
                client.emit('pubsub:subscription', msg);
            } else if (msg.event.configurationChanged) {
                client.emit('pubsub:config', msg);
            }
        }
    });

    client.subscribeToNode = function (jid, opts, cb) {
        return this.sendIq({
            type: 'set',
            to: jid,
            pubsub: {
                subscribe: {
                    node: opts.node,
                    jid: opts.jid || client.jid
                }
            }
        }, cb);
    };

    client.unsubscribeFromNode = function (jid, opts, cb) {
        return this.sendIq({
            type: 'set',
            to: jid,
            pubsub: {
                unsubscribe: {
                    node: opts.node,
                    jid: opts.jid || client.jid.split('/')[0]
                }
            }
        }, cb);
    };

    client.publish = function (jid, node, item, cb) {
        return this.sendIq({
            type: 'set',
            to: jid,
            pubsub: {
                publish: {
                    node: node,
                    item: item
                }
            }
        }, cb);
    };

    client.getItem = function (jid, node, id, cb) {
        return this.sendIq({
            type: 'get',
            to: jid,
            pubsub: {
                retrieve: {
                    node: node,
                    item: id
                }
            }
        }, cb);
    };

    client.getItems = function (jid, node, opts, cb) {
        opts = opts || {};
        opts.node = node;
        return this.sendIq({
            type: 'get',
            to: jid,
            pubsub: {
                retrieve: {
                    node: node,
                    max: opts.max
                },
                rsm: opts.rsm
            }
        }, cb);
    };

    client.retract = function (jid, node, id, notify, cb) {
        return this.sendIq({
            type: 'set',
            to: jid,
            pubsub: {
                retract: {
                    node: node,
                    notify: notify,
                    id: id
                }
            }
        }, cb);
    };

    client.purgeNode = function (jid, node, cb) {
        return this.sendIq({
            type: 'set',
            to: jid,
            pubsubOwner: {
                purge: node
            }
        }, cb);
    };

    client.deleteNode = function (jid, node, cb) {
        return this.sendIq({
            type: 'set',
            to: jid,
            pubsubOwner: {
                del: node
            }
        }, cb);
    };

    client.createNode = function (jid, node, config, cb) {
        var cmd = {
            type: 'set',
            to: jid,
            pubsubOwner: {
                create: node
            }
        };

        if (config) {
            cmd.pubsubOwner.config = {form: config};
        }

        return this.sendIq(cmd, cb);
    };
};
