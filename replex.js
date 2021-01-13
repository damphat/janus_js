function replEx(context) {
    const server = require('repl').start({
        prompt: '>',
        useGlobal: true,
        eval: function(cmd, context, file, cb) {
            var ret = require('vm').runInNewContext(cmd, context);
            if(ret instanceof Promise) {
                console.log("promise:")
                ret
                .then(value => cb(null, value))
                .catch(err => cb(err));
            } else {
                cb(null, ret);
            }
        }
    });

    Object.assign(server.context, context);
    return server;
}

module.exports = replEx;