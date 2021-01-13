// @ts-check
var WebSocket = require('ws');
const Session = require('./session');
const Transaction = require('./transaction');

class Janus {
    constructor(ws) {
        this.ws = ws;
        this.trans = new Transaction();
        this.sessions = {};
        
        ws.on('message', data => {
            var res = JSON.parse(String(data));
            if(this.trans.response(res)) return;
            console.log(res);
        });

        ws.on('close', () => {
            this._destroy();
        });
    }

    _init() {

    }

    _destroy() {
        this.trans.rejectAll();
        for(var k in this.sessions) {
            this.sessions[k]._destroy();
            delete this.sessions[k];
        }
    }

    destroy() {
        this.ws.close();
    }

    async create() {
        var res = await this.call({janus: 'create'});
        if (res.janus !== 'success') throw res;
        
        var s = new Session(this, res);
        this.sessions[s.id] = s;
    }

    call(req) {
        return new Promise((resolve, reject) => {
            this.trans.request(req, (err, res) => {
                if(err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })

            this.ws.send(JSON.stringify(req));
        });
    }
}

Janus.connect = function (url) {
    return new Promise((resolve, reject) => {
        var ws = new WebSocket(url || 'ws://janus.damphat.com:8188', 'janus-protocol');
        ws.once('open', () => {
            resolve(new Janus(ws));
        });

        ws.once('error', (err) => {
            reject(err);
        })
    })
}

module.exports = Janus;