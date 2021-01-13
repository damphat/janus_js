const Janus = require("./janus");
const replEx = require("./replex");

async function main() {
    var c = await Janus.connect();
    var s = c.call({
        janus: 'create'
    });

    replEx({
        c,
        s,
        Janus
    })
}

main();
