#Morton Pack/Unpack Library
##Basics
Check [wikipedia](https://en.wikipedia.org/wiki/Z-order_curve) for details.
##Example
```js
var Morton64 = require("morton64");

var m = new Morton64(2, 32); // 2 dimenstions 32 bits each
var code = m.pack([13, 42]); // pack two values, returns Long
var values = m.unpack(code); // should get back 13 and 42 (as Long)
```
