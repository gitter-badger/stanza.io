'use strict';

var NS = 'http://jabber.org/protocol/pubsub#owner';


module.exports = function (stanza) {
    var types = stanza.utils;

    var PubsubOwner = stanza.define({
        name: 'pubsubOwner',
        namespace: NS,
        element: 'pubsub',
        fields: {
            create: types.subAttribute(NS, 'create', 'node'),
            purge: types.subAttribute(NS, 'purge', 'node'),
            del: types.subAttribute(NS, 'delete', 'node'),
            redirect: {
                get: function () {
                    var del = types.find(this.xml, this._NS, 'delete');
                    if (del.length) {
                        return types.getSubAttribute(del[0], this._NS, 'redirect', 'uri');
                    }
                    return '';
                },
                set: function (value) {
                    var del = types.findOrCreate(this.xml, this._NS, 'delete');
                    types.setSubAttribute(del, this._NS, 'redirect', 'uri', value);
                }
            }
        }
    });
    
    var Configure = stanza.define({
        name: 'config',
        namespace: NS,
        element: 'configure',
        fields: {
            node: types.attribute('node')
        }
    });
    
    
    stanza.extend(PubsubOwner, Configure);

    stanza.withDataForm(function (DataForm) {
        stanza.extend(Configure, DataForm);
    });
    
    stanza.withIq(function (Iq) {
        stanza.extend(Iq, PubsubOwner);
    });
};
