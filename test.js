var Test = require("tape");
var Long = require("long");
var Morton64 = require("./");

function doTestPackUnpack(t, dimensions, bits, values) {
  for (var i = 0; i < values.length; i++) {
    if (!Long.isLong(values[i])) {
      values[i] = Long.fromInt(values[i]);
    }
  }

  var m = new Morton64(dimensions, bits);
  var code = m.pack(values);
  var unpacked = m.unpack(code);
  t.equals(unpacked.toString(), values.toString());
}

Test('packUnpack', function(t) {
  doTestPackUnpack(t, 2, 32, [1, 2]);
  doTestPackUnpack(t, 2, 32, [2, 1]);
  doTestPackUnpack(t, 2, 32, [Long.ONE.shl(32).sub(1), Long.ONE.shl(32).sub(1)]);
  doTestPackUnpack(t, 2, 1, [1, 1]);

  doTestPackUnpack(t, 3, 21, [1, 2, 4]);
  doTestPackUnpack(t, 3, 21, [4, 2, 1]);
  doTestPackUnpack(t, 3, 21, [Long.ONE.shl(21).sub(1), Long.ONE.shl(21).sub(1), Long.ONE.shl(21).sub(1)]);
  doTestPackUnpack(t, 3, 1, [1, 1, 1]);

  doTestPackUnpack(t, 4, 16, [1, 2, 4, 8]);
  doTestPackUnpack(t, 4, 16, [8, 4, 2, 1]);
  doTestPackUnpack(t, 4, 16, [Long.ONE.shl(16).sub(1), Long.ONE.shl(16).sub(1), Long.ONE.shl(16).sub(1), Long.ONE.shl(16).sub(1)]);
  doTestPackUnpack(t, 4, 1, [1, 1, 1, 1]);

  doTestPackUnpack(t, 6, 10, [1, 2, 4, 8, 16, 32]);
  doTestPackUnpack(t, 6, 10, [32, 16, 8, 4, 2, 1]);
  doTestPackUnpack(t, 6, 10, [1023, 1023, 1023, 1023, 1023, 1023]);

  doTestPackUnpack(t, 6, 10, [1, 2, 4, 8, 16, 32]);
  doTestPackUnpack(t, 6, 10, [32, 16, 8, 4, 2, 1]);
  doTestPackUnpack(t, 6, 10, [1023, 1023, 1023, 1023, 1023, 1023]);

  var values = [];
  for (var i = 0; i < 64; i++) {
    values.push(Long.ONE);
  }
  doTestPackUnpack(t, 64, 1, values);

  t.end();
});