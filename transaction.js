class Transaction {
    constructor() {
        this.count = 0;
        this.callbacks = {};
    }

    request(req, cb) {
        if(req == null || typeof req !== 'object') throw new Error('req is not object')
        if(typeof cb !== 'function') throw new Error('cb is not a function');
        req.transaction = String(this.count++);
        this.callbacks[req.transaction] = cb;
    }

    response(res) {
        if(!res.transaction) return false;
        var cb = this.callbacks[res.transaction];
        if (!cb) throw new Error('the callback for a transaction is not found')
        delete this.callbacks[res.transaction];
        cb(null, res);
        return true;
    }

    rejectAll(reason) {
        reason = reason || 'unknown';
        // xoa trong luc liet ke
        for (var id in this.callbacks) {
            this.callbacks[id](reason);
            delete this.callbacks[id];
        }
    }
}

module.exports = Transaction;
