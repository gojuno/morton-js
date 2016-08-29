(function(global, factory) {
  if (typeof define === 'function' && define["amd"]) {
    define([], factory);
  } else if (typeof require === 'function' && typeof module === "object" && module && module["exports"]) {
    module["exports"] = factory();
  } else {
    (global["gojuno"] = global["gojuno"] || {})["Morton64"] = factory();
  }
})(this, function() {
           var Long = require("long");

           function Morton64(dimensions, bits) {
             this.dimensions = Long.fromInt(dimensions);
             this.bits = Long.fromInt(bits);

             var mask = Long.ONE.shl(this.bits).sub(1);

             var shift = this.dimensions.mul(this.bits.sub(1));
             shift = shift.or(shift.shru(1));
             shift = shift.or(shift.shru(2));
             shift = shift.or(shift.shru(4));
             shift = shift.or(shift.shru(8));
             shift = shift.or(shift.shru(16));
             shift = shift.or(shift.shru(32));
             shift = shift.sub(shift.shru(1));

             this.masks = [];
             this.lshifts = [];

             this.masks.push(mask);
             this.lshifts.push(Long.ZERO);

             while (shift.greaterThan(0)) {
               mask = Long.ZERO;
               var shifted = Long.ZERO;

               for (var bit = 0; bit < this.bits; bit++) {
                 var distance = this.dimensions.mul(bit).sub(bit);

                 shifted = shifted.or(shift.and(distance));
                 mask = mask.or(Long.ONE.shl(bit).shl(shift.sub(1).not().and(distance)));
               }

               if (shifted.notEquals(0)) {
                 this.masks.push(mask);
                 this.lshifts.push(shift);
               }

               shift = shift.shru(1);
             }

             this.rshifts = [];
             for (var i = 0; i < this.lshifts.length - 1; i++) {
               this.rshifts.push(this.lshifts[i + 1]);
             }
             this.rshifts.push(Long.ZERO);
           }

           Morton64.prototype.pack = function(values) {
             var code = Long.ZERO;
             for (var i = 0; i < values.length; i++) {
               code = code.or(this.split(values[i]).shl(i));
             }
             return code;
           }

           Morton64.prototype.spack = function(values) {
             var uvalues = [];
             for (var i = 0; i < values.length; i++) {
               uvalues.push(this.shiftSign(values[i]));
             }
             return this.pack(uvalues);
           }

           Morton64.prototype.unpack = function(code) {
             var values = [];
             for (var i = 0; i < this.dimensions; i++) {
               values[i] = this.compact(code.shru(i));
             }
             return values;
           }

           Morton64.prototype.sunpack = function(code) {
             var values = this.unpack(code);
             for (var i = 0; i < values.length; i++) {
               values[i] = this.unshiftSign(values[i]);
             }
             return values;
           }

           Morton64.prototype.shiftSign = function(value) {
             if (value.lessThan(0)) {
               value = value.negate().or(Long.ONE.shl(this.bits - 1));
             }
             return value;
           }

           Morton64.prototype.unshiftSign = function(value) {
             var sign = value.and(Long.ONE.shl(this.bits - 1));
             value = value.and(Long.ONE.shl(this.bits - 1).sub(1));
             if (!sign.equals(0)) {
               value = value.negate();
             }
             return value;
           }

           Morton64.prototype.split = function(value) {
             for (var o = 0; o < this.masks.length; o ++) {
               value = value.or(value.shl(this.lshifts[o])).and(this.masks[o]);
             }
             return value;
           }

           Morton64.prototype.compact = function(code) {
             for (var o = this.masks.length - 1; o >= 0; o--) {
               code = code.or(code.shru(this.rshifts[o])).and(this.masks[o]);
             }
             return code;
           }

           return Morton64;
         });
