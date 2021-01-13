const Janus = require("./janus")


test('connect', async () => {
    var j = await Janus.connect();

    var s = j.send();

})