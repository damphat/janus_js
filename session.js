const Janus = require("./janus");

// @ts-check
class Session {
    constructor(client, res) {
        this.client = client;
        this.id = res.data.id;

        this._init();
    }

    _init() {
        this.client.sessions[this.id] = this;
        this._timer = setInterval(() => {
            this.call({janus: 'keepalive'});
        }, 10 * 1000);
    }

    _destroy() {
        delete this.client.sessions[this.id];
        clearInterval(this._timer);
    }

    call(req) {
        if(req != null && typeof req === 'object') req.session_id = this.id;
        return this.client.call(req);
    }

    attach(plugin) {
        return this.call({
            janus: 'attach',
            plugin
        })
    }

    destroy() {
        this._destroy();
        return this.call({janus: 'destroy'});
    }
}

Session.connect = async function(url) {
    var janus = await Janus.connect();
    return await janus.create();
}

module.exports = Session;