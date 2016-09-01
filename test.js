var Test = require("tape");
var Long = require("long");
var Morton64 = require("./dist/morton64");

function doTestBadMake64(t, dimensions, bits) {
  try {
    new Morton64(dimensions, bits);
  }
  catch (err) {
    t.ok(true);
    return;
  }
  t.fail();
}

Test('badMake64', function(t) {
  doTestBadMake64(t, 0, 1);
  doTestBadMake64(t, 1, 0);
  doTestBadMake64(t, 1, 65);

  t.end();
});

function doTestValueBoundaries(t, dimensions, bits, value) {
  var m = new Morton64(dimensions, bits);
  var values = [];
  for (var i = 0; i < values.length; i++) {
    values[i] = 0;
  }
  values[0] = value;
  try {
    m.pack(values);
  }
  catch (err) {
    t.ok(true);
    return;
  }
  t.fail();
}

Test('valueBoundaries', function(t) {
  doTestValueBoundaries(t, 2, 1, 2);
  doTestValueBoundaries(t, 16, 4, 16);

  t.end();
});

function doTestSValueBoundaries(t, dimensions, bits, value) {
  var m = new Morton64(dimensions, bits);
  var values = [];
  for (var i = 0; i < values.length; i++) {
    values[i] = 0;
  }
  values[0] = value;
  try {
    m.spack(values);
  }
  catch (err) {
    t.ok(true);
    return;
  }
  t.fail();
}

Test('sValueBoundaries', function(t) {
  doTestSValueBoundaries(t, 2, 2, 2);
  doTestSValueBoundaries(t, 2, 2, -2);
  doTestSValueBoundaries(t, 16, 4, 8);
  doTestSValueBoundaries(t, 16, 4, -8);

  t.end();
});

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

function doTestSPackUnpack(t, dimensions, bits, values) {
  for (var i = 0; i < values.length; i++) {
    if (!Long.isLong(values[i])) {
      values[i] = Long.fromInt(values[i]);
    }
  }

  var m = new Morton64(dimensions, bits);
  var code = m.spack(values);
  var unpacked = m.sunpack(code);
  t.equals(unpacked.toString(), values.toString());
}

Test('sPackUnpack', function(t) {
  doTestSPackUnpack(t, 2, 32, [1, 2]);
  doTestSPackUnpack(t, 2, 32, [2, 1]);
  doTestSPackUnpack(t, 2, 32, [Long.ONE.shl(31).sub(1), Long.ONE.shl(31).sub(1)]);
  doTestSPackUnpack(t, 2, 2, [1, 1]);
  doTestSPackUnpack(t, 2, 32, [-1, -2]);
  doTestSPackUnpack(t, 2, 32, [-2, -1]);
  doTestSPackUnpack(t, 2, 32, [Long.ONE.shl(31).sub(1).negate(), Long.ONE.shl(31).sub(1).negate()]);
  doTestSPackUnpack(t, 2, 2, [-1, -1]);

  doTestSPackUnpack(t, 3, 21, [1, 2, 4]);
  doTestSPackUnpack(t, 3, 21, [4, 2, 1]);
  doTestSPackUnpack(t, 3, 21, [Long.ONE.shl(20).sub(1), Long.ONE.shl(20).sub(1), Long.ONE.shl(20).sub(1)]);
  doTestSPackUnpack(t, 3, 2, [1, 1, 1]);
  doTestSPackUnpack(t, 3, 21, [-1, -2, -4]);
  doTestSPackUnpack(t, 3, 21, [-4, -2, -1]);
  doTestSPackUnpack(t, 3, 21, [Long.ONE.shl(20).sub(1).negate(), Long.ONE.shl(20).sub(1).negate(), Long.ONE.shl(20).sub(1).negate()]);
  doTestSPackUnpack(t, 3, 2, [-1, -1, -1]);

  doTestSPackUnpack(t, 4, 16, [1, 2, 4, 8]);
  doTestSPackUnpack(t, 4, 16, [8, 4, 2, 1]);
  doTestSPackUnpack(t, 4, 16, [Long.ONE.shl(15).sub(1), Long.ONE.shl(15).sub(1), Long.ONE.shl(15).sub(1), Long.ONE.shl(15).sub(1)]);
  doTestSPackUnpack(t, 4, 2, [1, 1, 1, 1]);
  doTestSPackUnpack(t, 4, 16, [-1, -2, -4, -8]);
  doTestSPackUnpack(t, 4, 16, [-8, -4, -2, -1]);
  doTestSPackUnpack(t, 4, 16, [Long.ONE.shl(15).sub(1).negate(), Long.ONE.shl(15).sub(1).negate(), Long.ONE.shl(15).sub(1).negate(), Long.ONE.shl(15).sub(1).negate()]);
  doTestSPackUnpack(t, 4, 2, [-1, -1, -1, -1]);

  doTestSPackUnpack(t, 6, 10, [1, 2, 4, 8, 16, 32]);
  doTestSPackUnpack(t, 6, 10, [32, 16, 8, 4, 2, 1]);
  doTestSPackUnpack(t, 6, 10, [511, 511, 511, 511, 511, 511]);
  doTestSPackUnpack(t, 6, 10, [-1, -2, -4, -8, -16, -32]);
  doTestSPackUnpack(t, 6, 10, [-32, -16, -8, -4, -2, -1]);
  doTestSPackUnpack(t, 6, 10, [-511, -511, -511, -511, -511, -511]);

  doTestSPackUnpack(t, 6, 10, [1, 2, 4, 8, 16, 32]);
  doTestSPackUnpack(t, 6, 10, [32, 16, 8, 4, 2, 1]);
  doTestSPackUnpack(t, 6, 10, [511, 511, 511, 511, 511, 511]);
  doTestSPackUnpack(t, 6, 10, [-1, -2, -4, -8, -16, -32]);
  doTestSPackUnpack(t, 6, 10, [-32, -16, -8, -4, -2, -1]);
  doTestSPackUnpack(t, 6, 10, [-511, -511, -511, -511, -511, -511]);

  var values = [];
  for (var i = 0; i < 32; i++) {
    values.push(1 - 2 * (i % 2));
  }
  doTestSPackUnpack(t, 32, 2, values);

  t.end();
});

function doTestPackArrayDimensions(t, dimensions, bits, size) {
  var m = new Morton64(dimensions, bits);
  var values = [];
  for (var i = 0; i < size; i++) {
    values[i] = 0;
  }
  try {
    m.pack(values);
  }
  catch (err) {
    t.ok(true);
    return;
  }
  t.fail();
}

Test('testPackArrayDimensions', function(t) {
  doTestPackArrayDimensions(t, 2, 32, 3);
  doTestPackArrayDimensions(t, 2, 32, 1);

  t.end();
});
