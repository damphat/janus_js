const Transaction = require("./transaction")

test('transaction', () => {
    var t = new Transaction();
    expect(t.count).toBe(0);
    expect(t.callbacks).toStrictEqual({});

    // request
    var handler = (err, res) => {
        if(err) handler.log.err++;
        if(res) handler.log.res++;
    }
    handler.log = {err: 0, res: 0};

    t.request({}, handler);
    t.request({}, handler);
    t.request({}, handler);
    
    expect(t.count).toBe(3);
    expect(t.callbacks).toStrictEqual({
        '0': handler,
        '1': handler,
        '2': handler,
    });
    expect(handler.log).toStrictEqual({
        err: 0,
        res: 0,
    })

    // response
    expect(t.response({})).toBe(false);
    expect(t.response({transaction: '1'})).toBe(true);
    expect(() => t.response({transaction: '1'})).toThrow();

    expect(t.count).toBe(3);
    expect(t.callbacks).toStrictEqual({
        '0': handler,
        '2': handler,
    });
    expect(handler.log).toStrictEqual({
        err: 0,
        res: 1,
    })

    // rejectAll
    t.rejectAll('close');
    expect(t.count).toBe(3);
    expect(t.callbacks).toStrictEqual({});
    expect(handler.log).toStrictEqual({
        err: 2,
        res: 1,
    })
})