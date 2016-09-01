MINIFY ?= ./node_modules/uglify-js/bin/uglifyjs
SOURCE = src/morton64.js
define MODULE_PREFIX
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('long'), require('sprintf-js').sprintf) :
  typeof define === 'function' && define.amd ? define(['long', 'sprintf-js'], factory) :
  (global.Morton64 = factory(global.Long, global.sprintf));
}(this,
endef
export MODULE_PREFIX

define MODULE_POSTFIX
));
endef
export MODULE_POSTFIX

all: \
	dist/morton64.js \
	dist/morton64.min.js

dist:
	@mkdir dist

dist/morton64.js: dist ${SOURCE}
	@rm -f $@
	@echo "$$MODULE_PREFIX" >> $@.tmp
	@cat ${SOURCE} >> $@.tmp
	@echo $$MODULE_POSTFIX >> $@.tmp

	@$(MINIFY) $@.tmp -b indent-level=2 -o $@
	@rm -f $@.tmp

dist/morton64.min.js: dist/morton64.js
	@$(MINIFY) $< -c -m -o $@

clean:
	@rm -rf dist