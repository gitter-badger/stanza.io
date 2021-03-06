'use strict';

var stanza = require('jxt');
var jxtutil = require('jxt-xmpp-types');


var Iq = module.exports = stanza.define({
    name: 'iq',
    namespace: 'jabber:client',
    element: 'iq',
    topLevel: true,
    fields: {
        lang: stanza.langAttribute(),
        id: stanza.attribute('id'),
        to: jxtutil.jidAttribute('to', true),
        from: jxtutil.jidAttribute('from', true),
        type: stanza.attribute('type')
    }
});

var toJSON = Iq.prototype.toJSON;

Iq.prototype.toJSON = function () {
    var result = toJSON.call(this);
    result.resultReply = this.resultReply;
    result.errorReply = this.errorReply;
    return result;
};

Iq.prototype.resultReply = function (data) {
    data = data || {};
    data.to = this.from;
    data.id = this.id;
    data.type = 'result';
    return new Iq(data);
};

Iq.prototype.errorReply = function (data) {
    data = data || {};
    data.to = this.from;
    data.id = this.id;
    data.type = 'error';
    return new Iq(data);
};
