(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],2:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = require('./_wks')('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) require('./_hide')(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};

},{"./_hide":32,"./_wks":89}],3:[function(require,module,exports){
'use strict';
var at = require('./_string-at')(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

},{"./_string-at":76}],4:[function(require,module,exports){
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],5:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":40}],6:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
'use strict';
var toObject = require('./_to-object');
var toAbsoluteIndex = require('./_to-absolute-index');
var toLength = require('./_to-length');
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var aLen = arguments.length;
  var index = toAbsoluteIndex(aLen > 1 ? arguments[1] : undefined, length);
  var end = aLen > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"./_to-absolute-index":78,"./_to-length":81,"./_to-object":82}],7:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-absolute-index":78,"./_to-iobject":80,"./_to-length":81}],8:[function(require,module,exports){
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = require('./_ctx');
var IObject = require('./_iobject');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var asc = require('./_array-species-create');
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};

},{"./_array-species-create":10,"./_ctx":18,"./_iobject":37,"./_to-length":81,"./_to-object":82}],9:[function(require,module,exports){
var isObject = require('./_is-object');
var isArray = require('./_is-array');
var SPECIES = require('./_wks')('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"./_is-array":39,"./_is-object":40,"./_wks":89}],10:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":9}],11:[function(require,module,exports){
'use strict';
var aFunction = require('./_a-function');
var isObject = require('./_is-object');
var invoke = require('./_invoke');
var arraySlice = [].slice;
var factories = {};

var construct = function (F, len, args) {
  if (!(len in factories)) {
    for (var n = [], i = 0; i < len; i++) n[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func
    factories[len] = Function('F,a', 'return new F(' + n.join(',') + ')');
  } return factories[len](F, args);
};

module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = arraySlice.call(arguments, 1);
  var bound = function (/* args... */) {
    var args = partArgs.concat(arraySlice.call(arguments));
    return this instanceof bound ? construct(fn, args.length, args) : invoke(fn, args, that);
  };
  if (isObject(fn.prototype)) bound.prototype = fn.prototype;
  return bound;
};

},{"./_a-function":1,"./_invoke":36,"./_is-object":40}],12:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":13,"./_wks":89}],13:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],14:[function(require,module,exports){
'use strict';
var dP = require('./_object-dp').f;
var create = require('./_object-create');
var redefineAll = require('./_redefine-all');
var ctx = require('./_ctx');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var $iterDefine = require('./_iter-define');
var step = require('./_iter-step');
var setSpecies = require('./_set-species');
var DESCRIPTORS = require('./_descriptors');
var fastKey = require('./_meta').fastKey;
var validate = require('./_validate-collection');
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};

},{"./_an-instance":4,"./_ctx":18,"./_descriptors":20,"./_for-of":28,"./_iter-define":43,"./_iter-step":45,"./_meta":48,"./_object-create":51,"./_object-dp":52,"./_redefine-all":65,"./_set-species":70,"./_validate-collection":86}],15:[function(require,module,exports){
'use strict';
var global = require('./_global');
var $export = require('./_export');
var redefine = require('./_redefine');
var redefineAll = require('./_redefine-all');
var meta = require('./_meta');
var forOf = require('./_for-of');
var anInstance = require('./_an-instance');
var isObject = require('./_is-object');
var fails = require('./_fails');
var $iterDetect = require('./_iter-detect');
var setToStringTag = require('./_set-to-string-tag');
var inheritIfRequired = require('./_inherit-if-required');

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};

},{"./_an-instance":4,"./_export":24,"./_fails":25,"./_for-of":28,"./_global":30,"./_inherit-if-required":35,"./_is-object":40,"./_iter-detect":44,"./_meta":48,"./_redefine":66,"./_redefine-all":65,"./_set-to-string-tag":71}],16:[function(require,module,exports){
var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],17:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":52,"./_property-desc":64}],18:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":1}],19:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],20:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":25}],21:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":30,"./_is-object":40}],22:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],23:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};

},{"./_object-gops":57,"./_object-keys":60,"./_object-pie":61}],24:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var hide = require('./_hide');
var redefine = require('./_redefine');
var ctx = require('./_ctx');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_core":16,"./_ctx":18,"./_global":30,"./_hide":32,"./_redefine":66}],25:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],26:[function(require,module,exports){
'use strict';
require('./es6.regexp.exec');
var redefine = require('./_redefine');
var hide = require('./_hide');
var fails = require('./_fails');
var defined = require('./_defined');
var wks = require('./_wks');
var regexpExec = require('./_regexp-exec');

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};

},{"./_defined":19,"./_fails":25,"./_hide":32,"./_redefine":66,"./_regexp-exec":68,"./_wks":89,"./es6.regexp.exec":105}],27:[function(require,module,exports){
'use strict';
// 21.2.5.3 get RegExp.prototype.flags
var anObject = require('./_an-object');
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"./_an-object":5}],28:[function(require,module,exports){
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_an-object":5,"./_ctx":18,"./_is-array-iter":38,"./_iter-call":41,"./_to-length":81,"./core.get-iterator-method":90}],29:[function(require,module,exports){
module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":73}],30:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],31:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],32:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":20,"./_object-dp":52,"./_property-desc":64}],33:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":30}],34:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":20,"./_dom-create":21,"./_fails":25}],35:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":40,"./_set-proto":69}],36:[function(require,module,exports){
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],37:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":13}],38:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":46,"./_wks":89}],39:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":13}],40:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],41:[function(require,module,exports){
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":5}],42:[function(require,module,exports){
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_hide":32,"./_object-create":51,"./_property-desc":64,"./_set-to-string-tag":71,"./_wks":89}],43:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_export":24,"./_hide":32,"./_iter-create":42,"./_iterators":46,"./_library":47,"./_object-gpo":58,"./_redefine":66,"./_set-to-string-tag":71,"./_wks":89}],44:[function(require,module,exports){
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":89}],45:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],46:[function(require,module,exports){
module.exports = {};

},{}],47:[function(require,module,exports){
module.exports = false;

},{}],48:[function(require,module,exports){
var META = require('./_uid')('meta');
var isObject = require('./_is-object');
var has = require('./_has');
var setDesc = require('./_object-dp').f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !require('./_fails')(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};

},{"./_fails":25,"./_has":31,"./_is-object":40,"./_object-dp":52,"./_uid":84}],49:[function(require,module,exports){
var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_cof":13,"./_global":30,"./_task":77}],50:[function(require,module,exports){
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":1}],51:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":5,"./_dom-create":21,"./_enum-bug-keys":22,"./_html":33,"./_object-dps":53,"./_shared-key":72}],52:[function(require,module,exports){
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":5,"./_descriptors":20,"./_ie8-dom-define":34,"./_to-primitive":83}],53:[function(require,module,exports){
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_an-object":5,"./_descriptors":20,"./_object-dp":52,"./_object-keys":60}],54:[function(require,module,exports){
var pIE = require('./_object-pie');
var createDesc = require('./_property-desc');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var has = require('./_has');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};

},{"./_descriptors":20,"./_has":31,"./_ie8-dom-define":34,"./_object-pie":61,"./_property-desc":64,"./_to-iobject":80,"./_to-primitive":83}],55:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject');
var gOPN = require('./_object-gopn').f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":56,"./_to-iobject":80}],56:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":22,"./_object-keys-internal":59}],57:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],58:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":31,"./_shared-key":72,"./_to-object":82}],59:[function(require,module,exports){
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_array-includes":7,"./_has":31,"./_shared-key":72,"./_to-iobject":80}],60:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":22,"./_object-keys-internal":59}],61:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],62:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],63:[function(require,module,exports){
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":5,"./_is-object":40,"./_new-promise-capability":50}],64:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],65:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":66}],66:[function(require,module,exports){
var global = require('./_global');
var hide = require('./_hide');
var has = require('./_has');
var SRC = require('./_uid')('src');
var $toString = require('./_function-to-string');
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

require('./_core').inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});

},{"./_core":16,"./_function-to-string":29,"./_global":30,"./_has":31,"./_hide":32,"./_uid":84}],67:[function(require,module,exports){
'use strict';

var classof = require('./_classof');
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};

},{"./_classof":12}],68:[function(require,module,exports){
'use strict';

var regexpFlags = require('./_flags');

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;

},{"./_flags":27}],69:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object');
var anObject = require('./_an-object');
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};

},{"./_an-object":5,"./_ctx":18,"./_is-object":40,"./_object-gopd":54}],70:[function(require,module,exports){
'use strict';
var global = require('./_global');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_descriptors":20,"./_global":30,"./_object-dp":52,"./_wks":89}],71:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":31,"./_object-dp":52,"./_wks":89}],72:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":73,"./_uid":84}],73:[function(require,module,exports){
var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":16,"./_global":30,"./_library":47}],74:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":1,"./_an-object":5,"./_wks":89}],75:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":25}],76:[function(require,module,exports){
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_defined":19,"./_to-integer":79}],77:[function(require,module,exports){
var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_cof":13,"./_ctx":18,"./_dom-create":21,"./_global":30,"./_html":33,"./_invoke":36}],78:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":79}],79:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],80:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":19,"./_iobject":37}],81:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":79}],82:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":19}],83:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":40}],84:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],85:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":30}],86:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":40}],87:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":16,"./_global":30,"./_library":47,"./_object-dp":52,"./_wks-ext":88}],88:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":89}],89:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":30,"./_shared":73,"./_uid":84}],90:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":12,"./_core":16,"./_iterators":46,"./_wks":89}],91:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":2,"./_array-fill":6,"./_export":24}],92:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $forEach = require('./_array-methods')(0);
var STRICT = require('./_strict-method')([].forEach, true);

$export($export.P + $export.F * !STRICT, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: function forEach(callbackfn /* , thisArg */) {
    return $forEach(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":8,"./_export":24,"./_strict-method":75}],93:[function(require,module,exports){
'use strict';
var ctx = require('./_ctx');
var $export = require('./_export');
var toObject = require('./_to-object');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var toLength = require('./_to-length');
var createProperty = require('./_create-property');
var getIterFn = require('./core.get-iterator-method');

$export($export.S + $export.F * !require('./_iter-detect')(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});

},{"./_create-property":17,"./_ctx":18,"./_export":24,"./_is-array-iter":38,"./_iter-call":41,"./_iter-detect":44,"./_to-length":81,"./_to-object":82,"./core.get-iterator-method":90}],94:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $indexOf = require('./_array-includes')(false);
var $native = [].indexOf;
var NEGATIVE_ZERO = !!$native && 1 / [1].indexOf(1, -0) < 0;

$export($export.P + $export.F * (NEGATIVE_ZERO || !require('./_strict-method')($native)), 'Array', {
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? $native.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments[1]);
  }
});

},{"./_array-includes":7,"./_export":24,"./_strict-method":75}],95:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":2,"./_iter-define":43,"./_iter-step":45,"./_iterators":46,"./_to-iobject":80}],96:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":8,"./_export":24,"./_strict-method":75}],97:[function(require,module,exports){
var DateProto = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var $toString = DateProto[TO_STRING];
var getTime = DateProto.getTime;
if (new Date(NaN) + '' != INVALID_DATE) {
  require('./_redefine')(DateProto, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare
    return value === value ? $toString.call(this) : INVALID_DATE;
  });
}

},{"./_redefine":66}],98:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":11,"./_export":24}],99:[function(require,module,exports){
var dP = require('./_object-dp').f;
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || require('./_descriptors') && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});

},{"./_descriptors":20,"./_object-dp":52}],100:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var MAP = 'Map';

// 23.1 Map Objects
module.exports = require('./_collection')(MAP, function (get) {
  return function Map() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key) {
    var entry = strong.getEntry(validate(this, MAP), key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value) {
    return strong.def(validate(this, MAP), key === 0 ? 0 : key, value);
  }
}, strong, true);

},{"./_collection":15,"./_collection-strong":14,"./_validate-collection":86}],101:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":24,"./_object-create":51}],102:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":20,"./_export":24,"./_object-dp":52}],103:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":24,"./_set-proto":69}],104:[function(require,module,exports){
'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var userAgent = require('./_user-agent');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_a-function":1,"./_an-instance":4,"./_classof":12,"./_core":16,"./_ctx":18,"./_export":24,"./_for-of":28,"./_global":30,"./_is-object":40,"./_iter-detect":44,"./_library":47,"./_microtask":49,"./_new-promise-capability":50,"./_perform":62,"./_promise-resolve":63,"./_redefine-all":65,"./_set-species":70,"./_set-to-string-tag":71,"./_species-constructor":74,"./_task":77,"./_user-agent":85,"./_wks":89}],105:[function(require,module,exports){
'use strict';
var regexpExec = require('./_regexp-exec');
require('./_export')({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});

},{"./_export":24,"./_regexp-exec":68}],106:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":20,"./_flags":27,"./_object-dp":52}],107:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var toLength = require('./_to-length');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');

// @@match logic
require('./_fix-re-wks')('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

},{"./_advance-string-index":3,"./_an-object":5,"./_fix-re-wks":26,"./_regexp-exec-abstract":67,"./_to-length":81}],108:[function(require,module,exports){
'use strict';
require('./es6.regexp.flags');
var anObject = require('./_an-object');
var $flags = require('./_flags');
var DESCRIPTORS = require('./_descriptors');
var TO_STRING = 'toString';
var $toString = /./[TO_STRING];

var define = function (fn) {
  require('./_redefine')(RegExp.prototype, TO_STRING, fn, true);
};

// 21.2.5.14 RegExp.prototype.toString()
if (require('./_fails')(function () { return $toString.call({ source: 'a', flags: 'b' }) != '/a/b'; })) {
  define(function toString() {
    var R = anObject(this);
    return '/'.concat(R.source, '/',
      'flags' in R ? R.flags : !DESCRIPTORS && R instanceof RegExp ? $flags.call(R) : undefined);
  });
// FF44- RegExp#toString has a wrong name
} else if ($toString.name != TO_STRING) {
  define(function toString() {
    return $toString.call(this);
  });
}

},{"./_an-object":5,"./_descriptors":20,"./_fails":25,"./_flags":27,"./_redefine":66,"./es6.regexp.flags":106}],109:[function(require,module,exports){
'use strict';
var strong = require('./_collection-strong');
var validate = require('./_validate-collection');
var SET = 'Set';

// 23.2 Set Objects
module.exports = require('./_collection')(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);

},{"./_collection":15,"./_collection-strong":14,"./_validate-collection":86}],110:[function(require,module,exports){
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_iter-define":43,"./_string-at":76}],111:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global = require('./_global');
var has = require('./_has');
var DESCRIPTORS = require('./_descriptors');
var $export = require('./_export');
var redefine = require('./_redefine');
var META = require('./_meta').KEY;
var $fails = require('./_fails');
var shared = require('./_shared');
var setToStringTag = require('./_set-to-string-tag');
var uid = require('./_uid');
var wks = require('./_wks');
var wksExt = require('./_wks-ext');
var wksDefine = require('./_wks-define');
var enumKeys = require('./_enum-keys');
var isArray = require('./_is-array');
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var toIObject = require('./_to-iobject');
var toPrimitive = require('./_to-primitive');
var createDesc = require('./_property-desc');
var _create = require('./_object-create');
var gOPNExt = require('./_object-gopn-ext');
var $GOPD = require('./_object-gopd');
var $DP = require('./_object-dp');
var $keys = require('./_object-keys');
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !require('./_library')) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    $replacer = replacer = args[1];
    if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    if (!isArray(replacer)) replacer = function (key, value) {
      if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);

},{"./_an-object":5,"./_descriptors":20,"./_enum-keys":23,"./_export":24,"./_fails":25,"./_global":30,"./_has":31,"./_hide":32,"./_is-array":39,"./_is-object":40,"./_library":47,"./_meta":48,"./_object-create":51,"./_object-dp":52,"./_object-gopd":54,"./_object-gopn":56,"./_object-gopn-ext":55,"./_object-gops":57,"./_object-keys":60,"./_object-pie":61,"./_property-desc":64,"./_redefine":66,"./_set-to-string-tag":71,"./_shared":73,"./_to-iobject":80,"./_to-primitive":83,"./_uid":84,"./_wks":89,"./_wks-define":87,"./_wks-ext":88}],112:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":87}],113:[function(require,module,exports){
var $iterators = require('./es6.array.iterator');
var getKeys = require('./_object-keys');
var redefine = require('./_redefine');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var wks = require('./_wks');
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}

},{"./_global":30,"./_hide":32,"./_iterators":46,"./_object-keys":60,"./_redefine":66,"./_wks":89,"./es6.array.iterator":95}],114:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Particles_1 = require("../Particles/Particles");

var Stars_1 = require("./Stars");

var canvas = new Particles_1.default('#particles', '2d');
canvas.setParticleSettings(Stars_1.Stars.Particles);
canvas.setInteractiveSettings(Stars_1.Stars.Interactive);
canvas.start();

},{"../Particles/Particles":133,"./Stars":115,"core-js/modules/es6.object.define-property":102}],115:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stars = {
  Particles: {
    number: 350,
    density: 200,
    color: '#FFFFFF',
    opacity: 'random',
    radius: [1, 1.5, 2, 2.5, 3, 3.5],
    shape: 'circle',
    stroke: {
      width: 0,
      color: '#000000'
    },
    move: {
      speed: 0.2,
      direction: 'random',
      straight: false,
      random: true,
      edgeBounce: false,
      attract: false
    },
    events: {
      resize: true,
      hover: 'bubble',
      click: false
    },
    animate: {
      opacity: {
        speed: 0.2,
        min: 0,
        sync: false
      },
      radius: {
        speed: 3,
        min: 0,
        sync: false
      }
    }
  },
  Interactive: {
    hover: {
      bubble: {
        distance: 75,
        radius: 7,
        opacity: 1
      }
    }
  }
};

},{"core-js/modules/es6.object.define-property":102}],116:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.create");

require("core-js/modules/es6.object.set-prototype-of");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (b.hasOwnProperty(p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    _extendStatics(d, b);

    function __() {
      this.constructor = d;
    }

    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../../Modules/DOM");

var EventDispatcher_1 = require("../../Modules/EventDispatcher");

var Menu = function (_super) {
  __extends(Menu, _super);

  function Menu() {
    var _this = _super.call(this) || this;

    _this.open = false;
    _this.Container = DOM_1.DOM.getFirstElement('header.menu');
    _this.Hamburger = DOM_1.DOM.getFirstElement('header.menu .hamburger');

    _this.register('toggle');

    return _this;
  }

  Menu.prototype.toggle = function () {
    this.open = !this.open;

    if (this.open) {
      this.Container.setAttribute('open', '');
    } else {
      this.Container.removeAttribute('open');
    }

    this.dispatch('toggle', {
      open: this.open
    });
  };

  return Menu;
}(EventDispatcher_1.Events.EventDispatcher);

exports.Menu = Menu;

},{"../../Modules/DOM":122,"../../Modules/EventDispatcher":123,"core-js/modules/es6.object.create":101,"core-js/modules/es6.object.define-property":102,"core-js/modules/es6.object.set-prototype-of":103}],117:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../../Modules/DOM");

var Section = function () {
  function Section(element) {
    this.element = element;
  }

  Section.prototype.inView = function () {
    var bounding = this.element.getBoundingClientRect();
    var view = DOM_1.DOM.getViewport();
    return bounding.bottom >= 0 && bounding.right >= 0 && bounding.top <= view.height && bounding.left <= view.width;
  };

  Section.prototype.getID = function () {
    return this.element.id;
  };

  return Section;
}();

exports.default = Section;

},{"../../Modules/DOM":122,"core-js/modules/es6.object.define-property":102}],118:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

var delay = 1000;
document.addEventListener('DOMContentLoaded', function () {
  var _loop_1 = function _loop_1(i) {
    setTimeout(function () {
      WebPage_1.CanvasText.children[i].classList.remove('preload');
    }, delay * (i + 1));
  };

  for (var i = 0; i < WebPage_1.CanvasText.childElementCount; i++) {
    _loop_1(i);
  }
});

},{"../Modules/WebPage":125,"core-js/modules/es6.object.define-property":102}],119:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

var DOM_1 = require("../Modules/DOM");

DOM_1.DOM.load().then(function (document) {
  if (!DOM_1.DOM.isIE()) {
    WebPage_1.Logo.Outer.classList.remove('preload');
    setTimeout(function () {
      WebPage_1.Logo.Inner.classList.remove('preload');
    }, 400);
  } else {
    WebPage_1.Logo.Outer.className = 'outer';
    setTimeout(function () {
      WebPage_1.Logo.Inner.className = 'inner';
    }, 400);
  }
});

},{"../Modules/DOM":122,"../Modules/WebPage":125,"core-js/modules/es6.object.define-property":102}],120:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

WebPage_1.Navigation.subscribe(WebPage_1.Main, function (event) {
  if (event.name === 'toggle') {
    if (event.detail.open) {
      WebPage_1.Main.setAttribute('shifted', '');
    } else {
      WebPage_1.Main.removeAttribute('shifted');
    }
  }
});

},{"../Modules/WebPage":125,"core-js/modules/es6.function.name":99,"core-js/modules/es6.object.define-property":102}],121:[function(require,module,exports){
"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

WebPage_1.Navigation.Hamburger.addEventListener('click', function () {
  WebPage_1.Navigation.toggle();
});
WebPage_1.NavigationAnchors.forEach(function (anchor) {
  anchor.addEventListener('click', function (event) {
    event.preventDefault();
    var destination = WebPage_1.Sections[this.getAttribute('href').substr(1)];
    destination.element.scrollIntoView({
      behavior: 'smooth'
    });
  });
});

},{"../Modules/WebPage":125,"core-js/modules/es6.array.for-each":92,"core-js/modules/es6.object.define-property":102,"core-js/modules/web.dom.iterable":113}],122:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var DOM;

(function (DOM) {
  function getElements(query) {
    return document.querySelectorAll(query);
  }

  DOM.getElements = getElements;

  function getFirstElement(query) {
    return this.getElements(query)[0];
  }

  DOM.getFirstElement = getFirstElement;

  function getViewport() {
    return {
      height: window.innerHeight || document.documentElement.clientHeight,
      width: window.innerWidth || document.documentElement.clientWidth
    };
  }

  DOM.getViewport = getViewport;

  function scrollTo(x, y) {
    window.scrollTo({
      top: y,
      left: x,
      behavior: 'smooth'
    });
  }

  DOM.scrollTo = scrollTo;

  function isIE() {
    return window.navigator.userAgent.match(/(MSIE|Trident)/) !== null;
  }

  DOM.isIE = isIE;

  function load() {
    return new Promise(function (resolve, reject) {
      if (document.readyState === 'complete') {
        resolve(document);
      } else {
        var callback_1 = function callback_1() {
          document.removeEventListener('DOMContentLoaded', callback_1);
          resolve(document);
        };

        document.addEventListener('DOMContentLoaded', callback_1);
      }
    });
  }

  DOM.load = load;
})(DOM = exports.DOM || (exports.DOM = {}));

},{"core-js/modules/es6.object.define-property":102,"core-js/modules/es6.promise":104,"core-js/modules/es6.regexp.match":107}],123:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.map");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.set");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Events;

(function (Events) {
  var NewEvent = function () {
    function NewEvent(name, detail) {
      if (detail === void 0) {
        detail = null;
      }

      this.name = name;
      this.detail = detail;
    }

    return NewEvent;
  }();

  Events.NewEvent = NewEvent;

  var EventDispatcher = function () {
    function EventDispatcher() {
      this.events = new Set();
      this.listeners = new Map();
    }

    EventDispatcher.prototype.register = function (name) {
      this.events.add(name);
    };

    EventDispatcher.prototype.unregister = function (name) {
      this.events.delete(name);
    };

    EventDispatcher.prototype.subscribe = function (element, callback) {
      this.listeners.set(element, callback);
    };

    EventDispatcher.prototype.unsubscribe = function (element) {
      this.listeners.delete(element);
    };

    EventDispatcher.prototype.dispatch = function (name, detail) {
      if (detail === void 0) {
        detail = null;
      }

      if (!this.events.has(name)) {
        return false;
      }

      var event = new NewEvent(name, detail);
      var it = this.listeners.values();
      var callback;

      while (callback = it.next().value) {
        callback(event);
      }

      return true;
    };

    return EventDispatcher;
  }();

  Events.EventDispatcher = EventDispatcher;
})(Events = exports.Events || (exports.Events = {}));

},{"core-js/modules/es6.array.iterator":95,"core-js/modules/es6.map":100,"core-js/modules/es6.object.define-property":102,"core-js/modules/es6.set":109,"core-js/modules/es6.string.iterator":110,"core-js/modules/web.dom.iterable":113}],124:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var SVG;

(function (SVG) {
  SVG.svgns = 'http://www.w3.org/2000/svg';
  SVG.xlinkns = 'http://www.w3.org/1999/xlink';
})(SVG = exports.SVG || (exports.SVG = {}));

},{"core-js/modules/es6.object.define-property":102}],125:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.array.from");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("./DOM");

var Section_1 = require("../Classes/Elements/Section");

var Menu_1 = require("../Classes/Elements/Menu");

exports.Main = DOM_1.DOM.getFirstElement('main');
exports.Logo = {
  Outer: DOM_1.DOM.getFirstElement('header.logo .image img.outer'),
  Inner: DOM_1.DOM.getFirstElement('header.logo .image img.inner')
};
exports.CanvasText = DOM_1.DOM.getFirstElement('div.canvas div.canvas-text-container');
exports.Navigation = new Menu_1.Menu();
exports.NavigationAnchors = DOM_1.DOM.getElements('header.navigation .sections a');
exports.Sections = {};

for (var _i = 0, _a = Array.from(DOM_1.DOM.getElements('section')); _i < _a.length; _i++) {
  var element = _a[_i];
  exports.Sections[element.id] = new Section_1.default(element);
}

},{"../Classes/Elements/Menu":116,"../Classes/Elements/Section":117,"./DOM":122,"core-js/modules/es6.array.from":93,"core-js/modules/es6.object.define-property":102,"core-js/modules/es6.string.iterator":110}],126:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Animation = function () {
  function Animation(speed, max, min, increasing) {
    if (increasing === void 0) {
      increasing = false;
    }

    this.speed = speed;
    this.max = max;
    this.min = min;
    this.increasing = increasing;
  }

  return Animation;
}();

exports.default = Animation;

},{"core-js/modules/es6.object.define-property":102}],127:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
var AnimationFrameFunctions;

(function (AnimationFrameFunctions) {
  function requestAnimationFrame() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
  }

  AnimationFrameFunctions.requestAnimationFrame = requestAnimationFrame;

  function cancelAnimationFrame() {
    return window.cancelAnimationFrame || window.webkitCancelAnimationFrame || clearTimeout;
  }

  AnimationFrameFunctions.cancelAnimationFrame = cancelAnimationFrame;
})(AnimationFrameFunctions = exports.AnimationFrameFunctions || (exports.AnimationFrameFunctions = {}));

},{"core-js/modules/es6.object.define-property":102}],128:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Color = function () {
  function Color(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }

  Color.fromRGB = function (r, g, b) {
    if (r >= 0 && r < 256 && g >= 0 && g < 256 && b >= 0 && b < 256) {
      return new Color(r, g, b);
    } else {
      return null;
    }
  };

  Color.fromObject = function (obj) {
    return Color.fromRGB(obj.r, obj.g, obj.b);
  };

  Color.fromHex = function (hex) {
    return Color.fromObject(Color.hexToRGB(hex));
  };

  Color.hexToRGB = function (hex) {
    var result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  Color.prototype.toString = function (opacity) {
    if (opacity === void 0) {
      opacity = 1;
    }

    return "rgba(" + this.r + "," + this.g + "," + this.b + "," + opacity + ")";
  };

  return Color;
}();

exports.default = Color;

},{"core-js/modules/es6.object.define-property":102}],129:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Coordinate = function () {
  function Coordinate(x, y) {
    this.x = x;
    this.y = y;
  }

  Coordinate.prototype.distance = function (coord) {
    var dx = coord.x - this.x;
    var dy = coord.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  Coordinate.prototype.toString = function () {
    return this.x + "x" + this.y;
  };

  return Coordinate;
}();

exports.default = Coordinate;

},{"core-js/modules/es6.object.define-property":102}],130:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":102}],131:[function(require,module,exports){
"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.object.define-property");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Animation_1 = require("./Animation");

var Color_1 = require("./Color");

var Coordinate_1 = require("./Coordinate");

var Stroke_1 = require("./Stroke");

var Vector_1 = require("./Vector");

var Particle = function () {
  function Particle(settings) {
    this.opacityAnimation = null;
    this.radiusAnimation = null;
    this.color = this.createColor(settings.color);
    this.opacity = this.createOpacity(settings.opacity);
    this.velocity = this.createVelocity(settings.move);
    this.shape = this.createShape(settings.shape);
    this.stroke = this.createStroke(settings.stroke);
    this.radius = this.createRadius(settings.radius);

    if (settings.animate) {
      if (settings.animate.opacity) {
        this.opacityAnimation = this.animateOpacity(settings.animate.opacity);
      }

      if (settings.animate.radius) {
        this.radiusAnimation = this.animateRadius(settings.animate.radius);
      }
    }

    this.bubbled = {
      opacity: 0,
      radius: 0
    };
  }

  Particle.prototype.createColor = function (color) {
    if (typeof color === 'string') {
      if (color === 'random') {
        return Color_1.default.fromRGB(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
      } else {
        return Color_1.default.fromHex(color);
      }
    } else if (_typeof(color) === 'object') {
      if (color instanceof Color_1.default) {
        return color;
      } else if (color instanceof Array) {
        return this.createColor(color[Math.floor(Math.random() * color.length)]);
      } else {
        return Color_1.default.fromObject(color);
      }
    }

    return Color_1.default.fromRGB(0, 0, 0);
  };

  Particle.prototype.createOpacity = function (opacity) {
    if (_typeof(opacity) === 'object') {
      if (opacity instanceof Array) {
        return this.createOpacity(opacity[Math.floor(Math.random() * opacity.length)]);
      }
    } else if (typeof opacity === 'string') {
      if (opacity === 'random') {
        return Math.random();
      }
    } else if (typeof opacity === 'number') {
      if (opacity >= 0) {
        return opacity;
      }
    }

    return 1;
  };

  Particle.prototype.createVelocity = function (move) {
    if (typeof move === 'boolean') {
      if (!move) {
        return new Vector_1.default(0, 0);
      }
    } else if (_typeof(move) === 'object') {
      var velocity = void 0;

      switch (move.direction) {
        case 'top':
          velocity = new Vector_1.default(0, -1);
          break;

        case 'top-right':
          velocity = new Vector_1.default(0.7, -0.7);
          break;

        case 'right':
          velocity = new Vector_1.default(1, 0);
          break;

        case 'bottom-right':
          velocity = new Vector_1.default(0.7, 0.7);
          break;

        case 'bottom':
          velocity = new Vector_1.default(0, 1);
          break;

        case 'bottom-left':
          velocity = new Vector_1.default(-0.7, 0.7);
          break;

        case 'left':
          velocity = new Vector_1.default(-1, 0);
          break;

        case 'top-left':
          velocity = new Vector_1.default(-0.7, -0.7);
          break;

        default:
          velocity = new Vector_1.default(0, 0);
          break;
      }

      if (move.straight) {
        if (move.random) {
          velocity.x *= Math.random();
          velocity.y *= Math.random();
        }
      } else {
        velocity.x += Math.random() - 0.5;
        velocity.y += Math.random() - 0.5;
      }

      return velocity;
    }

    return new Vector_1.default(0, 0);
  };

  Particle.prototype.createShape = function (shape) {
    if (_typeof(shape) === 'object') {
      if (shape instanceof Array) {
        return this.createShape(shape[Math.floor(Math.random() * shape.length)]);
      }
    } else if (typeof shape === 'string') {
      var sides = parseInt(shape.substring(0, shape.indexOf('-')));

      if (!isNaN(sides)) {
        return this.createShape(sides);
      }

      return shape;
    } else if (typeof shape === 'number') {
      if (shape >= 3) {
        return shape;
      }
    }

    return 'circle';
  };

  Particle.prototype.createStroke = function (stroke) {
    if (_typeof(stroke) === 'object') {
      if (typeof stroke.width === 'number') {
        if (stroke.width > 0) {
          return new Stroke_1.default(stroke.width, this.createColor(stroke.color));
        }
      }
    }

    return new Stroke_1.default(0, Color_1.default.fromRGB(0, 0, 0));
  };

  Particle.prototype.createRadius = function (radius) {
    if (_typeof(radius) === 'object') {
      if (radius instanceof Array) {
        return this.createRadius(radius[Math.floor(Math.random() * radius.length)]);
      }
    } else if (typeof radius === 'string') {
      if (radius === 'random') {
        return Math.random();
      }
    } else if (typeof radius === 'number') {
      if (radius >= 0) {
        return radius;
      }
    }

    return 5;
  };

  Particle.prototype.parseSpeed = function (speed) {
    if (speed > 0) {
      return speed;
    }

    return 0.5;
  };

  Particle.prototype.animateOpacity = function (animation) {
    if (animation) {
      var max = this.opacity;
      var min = this.createOpacity(animation.min);
      var speed = this.parseSpeed(animation.speed) / 100;

      if (!animation.sync) {
        speed *= Math.random();
      }

      this.opacity *= Math.random();
      return new Animation_1.default(speed, max, min);
    }

    return null;
  };

  Particle.prototype.animateRadius = function (animation) {
    if (animation) {
      var max = this.radius;
      var min = this.createRadius(animation.min);
      var speed = this.parseSpeed(animation.speed) / 100;

      if (!animation.sync) {
        speed *= Math.random();
      }

      this.opacity *= Math.random();
      return new Animation_1.default(speed, max, min);
    }

    return null;
  };

  Particle.prototype.setPosition = function (position) {
    this.position = position;
  };

  Particle.prototype.move = function (speed) {
    this.position.x += this.velocity.x * speed;
    this.position.y += this.velocity.y * speed;
  };

  Particle.prototype.getRadius = function () {
    return this.radius + this.bubbled.radius;
  };

  Particle.prototype.getOpacity = function () {
    return this.opacity + this.bubbled.opacity;
  };

  Particle.prototype.edge = function (dir) {
    switch (dir) {
      case 'top':
        return new Coordinate_1.default(this.position.x, this.position.y - this.getRadius());

      case 'right':
        return new Coordinate_1.default(this.position.x + this.getRadius(), this.position.y);

      case 'bottom':
        return new Coordinate_1.default(this.position.x, this.position.y + this.getRadius());

      case 'left':
        return new Coordinate_1.default(this.position.x - this.getRadius(), this.position.y);

      default:
        return this.position;
    }
  };

  Particle.prototype.intersecting = function (particle) {
    return this.position.distance(particle.position) < this.getRadius() + particle.getRadius();
  };

  Particle.prototype.bubble = function (mouse, settings) {
    var distance = this.position.distance(mouse.position);
    var ratio = 1 - distance / settings.distance;

    if (ratio >= 0 && mouse.over) {
      this.bubbled.opacity = ratio * (settings.opacity - this.opacity);
      this.bubbled.radius = ratio * (settings.radius - this.radius);
    } else {
      this.bubbled.opacity = 0;
      this.bubbled.radius = 0;
    }
  };

  return Particle;
}();

exports.default = Particle;

},{"./Animation":126,"./Color":128,"./Coordinate":129,"./Stroke":134,"./Vector":135,"core-js/modules/es6.array.index-of":94,"core-js/modules/es6.object.define-property":102,"core-js/modules/es6.symbol":111,"core-js/modules/es7.symbol.async-iterator":112}],132:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":102}],133:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.fill");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var AnimationFrameFunctions_1 = require("./AnimationFrameFunctions");

var DOM_1 = require("../Modules/DOM");

var Coordinate_1 = require("./Coordinate");

var Particle_1 = require("./Particle");

var Particles = function () {
  function Particles(cssQuery, context) {
    this.running = false;
    this.pixelRatioLimit = 8;
    this.pixelRatio = 1;
    this.particles = new Array();
    this.mouse = {
      position: new Coordinate_1.default(0, 0),
      over: false
    };
    this.handleResize = null;
    this.animationFrame = null;
    this.mouseEventsAttached = false;
    this.canvas = DOM_1.DOM.getFirstElement(cssQuery);

    if (this.canvas === null) {
      throw "Canvas ID " + cssQuery + " not found.";
    }

    this.ctx = this.canvas.getContext(context);
    window.requestAnimationFrame = AnimationFrameFunctions_1.AnimationFrameFunctions.requestAnimationFrame();
    window.cancelAnimationFrame = AnimationFrameFunctions_1.AnimationFrameFunctions.cancelAnimationFrame();
    this.particleSettings = {
      number: 350,
      density: 1000,
      color: '#FFFFFF',
      opacity: 1,
      radius: 5,
      shape: 'circle',
      stroke: {
        width: 0,
        color: '#000000'
      },
      move: {
        speed: 0.4,
        direction: 'bottom',
        straight: true,
        random: true,
        edgeBounce: false,
        attract: false
      },
      events: {
        resize: true,
        hover: false,
        click: false
      },
      animate: {
        opacity: false,
        radius: false
      }
    };
    this.interactiveSettings = {
      hover: {
        bubble: {
          distance: 75,
          radius: 7,
          opacity: 1
        },
        repulse: {
          distance: 100
        }
      },
      click: {
        add: {
          number: 4
        },
        remove: {
          number: 2
        }
      }
    };
  }

  Particles.prototype.initialize = function () {
    this.trackMouse();
    this.initializePixelRatio(window.devicePixelRatio >= this.pixelRatioLimit ? this.pixelRatioLimit - 2 : window.devicePixelRatio);
    this.setCanvasSize();
    this.clear();
    this.removeParticles();
    this.createParticles();
    this.distributeParticles();
  };

  Particles.prototype.trackMouse = function () {
    var _this = this;

    if (this.mouseEventsAttached) {
      return;
    }

    if (this.particleSettings.events) {
      if (this.particleSettings.events.hover) {
        this.canvas.addEventListener('mousemove', function (event) {
          _this.mouse.position.x = event.offsetX * _this.pixelRatio;
          _this.mouse.position.y = event.offsetY * _this.pixelRatio;
          _this.mouse.over = true;
        });
        this.canvas.addEventListener('mouseleave', function () {
          _this.mouse.position.x = null;
          _this.mouse.position.y = null;
          _this.mouse.over = false;
        });
      }

      if (this.particleSettings.events.click) {}
    }

    this.mouseEventsAttached = true;
  };

  Particles.prototype.initializePixelRatio = function (newRatio) {
    if (newRatio === void 0) {
      newRatio = window.devicePixelRatio;
    }

    var multiplier = newRatio / this.pixelRatio;
    this.width = this.canvas.offsetWidth * multiplier;
    this.height = this.canvas.offsetHeight * multiplier;

    if (this.particleSettings.radius instanceof Array) {
      this.particleSettings.radius = this.particleSettings.radius.map(function (r) {
        return r * multiplier;
      });
    } else {
      if (typeof this.particleSettings.radius === 'number') {
        this.particleSettings.radius *= multiplier;
      }
    }

    if (this.particleSettings.move) {
      this.particleSettings.move.speed *= multiplier;
    }

    if (this.particleSettings.animate && this.particleSettings.animate.radius) {
      this.particleSettings.animate.radius.speed *= multiplier;
    }

    if (this.interactiveSettings.hover) {
      if (this.interactiveSettings.hover.bubble) {
        this.interactiveSettings.hover.bubble.radius *= multiplier;
        this.interactiveSettings.hover.bubble.distance *= multiplier;
      }

      if (this.interactiveSettings.hover.repulse) {
        this.interactiveSettings.hover.repulse.distance *= multiplier;
      }
    }

    this.pixelRatio = newRatio;
  };

  Particles.prototype.checkZoom = function () {
    if (window.devicePixelRatio !== this.pixelRatio && window.devicePixelRatio < this.pixelRatioLimit) {
      this.stopDrawing();
      this.initialize();
      this.draw();
    }
  };

  Particles.prototype.setCanvasSize = function () {
    var _this = this;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    if (this.particleSettings.events && this.particleSettings.events.resize) {
      this.handleResize = function () {
        _this.checkZoom();

        _this.width = _this.canvas.offsetWidth * _this.pixelRatio;
        _this.height = _this.canvas.offsetHeight * _this.pixelRatio;
        _this.canvas.width = _this.width;
        _this.canvas.height = _this.height;

        if (!_this.particleSettings.move) {
          _this.removeParticles();

          _this.createParticles();

          _this.drawParticles();
        }

        _this.distributeParticles();
      };

      window.addEventListener('resize', this.handleResize);
    }
  };

  Particles.prototype.getFill = function () {
    return this.ctx.fillStyle;
  };

  Particles.prototype.setFill = function (color) {
    this.ctx.fillStyle = color;
  };

  Particles.prototype.setStroke = function (stroke) {
    this.ctx.strokeStyle = stroke.color.toString();
    this.ctx.lineWidth = stroke.width;
  };

  Particles.prototype.clear = function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  };

  Particles.prototype.draw = function () {
    this.drawParticles();
    if (this.particleSettings.move) this.animationFrame = window.requestAnimationFrame(this.draw.bind(this));
  };

  Particles.prototype.stopDrawing = function () {
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize);
      this.handleResize = null;
    }

    if (this.animationFrame) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  };

  Particles.prototype.drawPolygon = function (center, radius, sides) {
    var diagonalAngle = 360 / sides;
    diagonalAngle *= Math.PI / 180;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.translate(center.x, center.y);
    this.ctx.rotate(diagonalAngle / (sides % 2 ? 4 : 2));
    this.ctx.moveTo(radius, 0);
    var angle;

    for (var s = 0; s < sides; s++) {
      angle = s * diagonalAngle;
      this.ctx.lineTo(radius * Math.cos(angle), radius * Math.sin(angle));
    }

    this.ctx.fill();
    this.ctx.restore();
  };

  Particles.prototype.drawParticle = function (particle) {
    var opacity = particle.getOpacity();
    var radius = particle.getRadius();
    this.setFill(particle.color.toString(opacity));
    this.ctx.beginPath();

    if (typeof particle.shape === 'number') {
      this.drawPolygon(particle.position, radius, particle.shape);
    } else {
      switch (particle.shape) {
        default:
        case 'circle':
          this.ctx.arc(particle.position.x, particle.position.y, radius, 0, Math.PI * 2, false);
          break;
      }
    }

    this.ctx.closePath();

    if (particle.stroke.width > 0) {
      this.setStroke(particle.stroke);
      this.ctx.stroke();
    }

    this.ctx.fill();
  };

  Particles.prototype.getNewPosition = function () {
    return new Coordinate_1.default(Math.random() * this.canvas.width, Math.random() * this.canvas.height);
  };

  Particles.prototype.checkPosition = function (particle) {
    if (this.particleSettings.move) {
      if (this.particleSettings.move.edgeBounce) {
        if (particle.edge('left').x < 0) particle.position.x += particle.getRadius();else if (particle.edge('right').x > this.width) particle.position.x -= particle.getRadius();
        if (particle.edge('top').y < 0) particle.position.y += particle.getRadius();else if (particle.edge('bottom').y > this.height) particle.position.y -= particle.getRadius();
      }
    }

    return true;
  };

  Particles.prototype.distributeParticles = function () {
    if (this.particleSettings.density && typeof this.particleSettings.density === 'number') {
      var area = this.canvas.width * this.canvas.height / 1000;
      area /= this.pixelRatio * 2;
      var particlesPerArea = area * this.particleSettings.number / this.particleSettings.density;
      var missing = particlesPerArea - this.particles.length;

      if (missing > 0) {
        this.createParticles(missing);
      } else {
        this.removeParticles(Math.abs(missing));
      }
    }
  };

  Particles.prototype.createParticles = function (number, position) {
    if (number === void 0) {
      number = this.particleSettings.number;
    }

    if (position === void 0) {
      position = null;
    }

    if (!this.particleSettings) throw 'Particle settings must be initalized before a particle is created.';
    var particle;

    for (var p = 0; p < number; p++) {
      particle = new Particle_1.default(this.particleSettings);

      if (position) {
        particle.setPosition(position);
      } else {
        do {
          particle.setPosition(this.getNewPosition());
        } while (!this.checkPosition(particle));
      }

      this.particles.push(particle);
    }
  };

  Particles.prototype.removeParticles = function (number) {
    if (number === void 0) {
      number = null;
    }

    if (!number) {
      this.particles = new Array();
    } else {
      this.particles.splice(0, number);
    }
  };

  Particles.prototype.updateParticles = function () {
    for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
      var particle = _a[_i];

      if (this.particleSettings.move) {
        particle.move(this.particleSettings.move.speed);

        if (!this.particleSettings.move.edgeBounce) {
          if (particle.edge('right').x < 0) {
            particle.setPosition(new Coordinate_1.default(this.width + particle.getRadius(), Math.random() * this.height));
          } else if (particle.edge('left').x > this.width) {
            particle.setPosition(new Coordinate_1.default(-1 * particle.getRadius(), Math.random() * this.height));
          }

          if (particle.edge('bottom').y < 0) {
            particle.setPosition(new Coordinate_1.default(Math.random() * this.width, this.height + particle.getRadius()));
          } else if (particle.edge('top').y > this.height) {
            particle.setPosition(new Coordinate_1.default(Math.random() * this.width, -1 * particle.getRadius()));
          }
        }

        if (this.particleSettings.move.edgeBounce) {
          if (particle.edge('left').x < 0 || particle.edge('right').x > this.width) {
            particle.velocity.flip(true, false);
          }

          if (particle.edge('top').y < 0 || particle.edge('bottom').y > this.height) {
            particle.velocity.flip(false, true);
          }
        }
      }

      if (this.particleSettings.animate) {
        if (this.particleSettings.animate.opacity) {
          if (particle.opacity >= particle.opacityAnimation.max) {
            particle.opacityAnimation.increasing = false;
          } else if (particle.opacity <= particle.opacityAnimation.min) {
            particle.opacityAnimation.increasing = true;
          }

          particle.opacity += particle.opacityAnimation.speed * (particle.opacityAnimation.increasing ? 1 : -1);

          if (particle.opacity < 0) {
            particle.opacity = 0;
          }
        }

        if (this.particleSettings.animate.radius) {
          if (particle.radius >= particle.radiusAnimation.max) {
            particle.radiusAnimation.increasing = false;
          } else if (particle.radius <= particle.radiusAnimation.min) {
            particle.radiusAnimation.increasing = true;
          }

          particle.radius += particle.radiusAnimation.speed * (particle.radiusAnimation.increasing ? 1 : -1);

          if (particle.radius < 0) {
            particle.radius = 0;
          }
        }
      }

      if (this.particleSettings.events) {
        if (this.particleSettings.events.hover === 'bubble' && this.interactiveSettings.hover && this.interactiveSettings.hover.bubble) {
          particle.bubble(this.mouse, this.interactiveSettings.hover.bubble);
        }
      }
    }
  };

  Particles.prototype.drawParticles = function () {
    this.clear();
    this.updateParticles();

    for (var _i = 0, _a = this.particles; _i < _a.length; _i++) {
      var particle = _a[_i];
      this.drawParticle(particle);
    }
  };

  Particles.prototype.setParticleSettings = function (settings) {
    if (this.running) {
      throw 'Cannot change settings while Canvas is running.';
    } else {
      this.particleSettings = settings;
    }
  };

  Particles.prototype.setInteractiveSettings = function (settings) {
    if (this.running) {
      throw 'Cannot change settings while Canvas is running.';
    } else {
      this.interactiveSettings = settings;
    }
  };

  Particles.prototype.start = function () {
    if (this.particleSettings === null) throw 'Particle settings must be initalized before Canvas can start.';
    if (this.running) throw 'Canvas is already running.';
    this.running = true;
    this.initialize();
    this.draw();
  };

  return Particles;
}();

exports.default = Particles;

},{"../Modules/DOM":122,"./AnimationFrameFunctions":127,"./Coordinate":129,"./Particle":131,"core-js/modules/es6.array.fill":91,"core-js/modules/es6.array.map":96,"core-js/modules/es6.date.to-string":97,"core-js/modules/es6.function.bind":98,"core-js/modules/es6.object.define-property":102,"core-js/modules/es6.regexp.to-string":108}],134:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Stroke = function () {
  function Stroke(width, color) {
    this.width = width;
    this.color = color;
  }

  return Stroke;
}();

exports.default = Stroke;

},{"core-js/modules/es6.object.define-property":102}],135:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Vector = function () {
  function Vector(x, y) {
    this.x = x;
    this.y = y;
  }

  Vector.prototype.flip = function (x, y) {
    if (x === void 0) {
      x = true;
    }

    if (y === void 0) {
      y = true;
    }

    if (x) {
      this.x *= -1;
    }

    if (y) {
      this.y *= -1;
    }
  };

  Vector.prototype.magnitude = function () {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  };

  Vector.prototype.angle = function () {
    return Math.tan(this.y / this.x);
  };

  return Vector;
}();

exports.default = Vector;

},{"core-js/modules/es6.object.define-property":102}]},{},[114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,133,132,134,135])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWR2YW5jZS1zdHJpbmctaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZnVuY3Rpb24tdG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21ldGEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wZXJmb3JtLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcHJvbWlzZS1yZXNvbHZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLWFsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVnZXhwLWV4ZWMtYWJzdHJhY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWdleHAtZXhlYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC1wcm90by5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC1zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmljdC1tZXRob2QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctYXQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190YXNrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tYWJzb2x1dGUtaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3VzZXItYWdlbnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL192YWxpZGF0ZS1jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy1leHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5mb3ItZWFjaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pbmRleC1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuZGF0ZS50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5mdW5jdGlvbi5iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuZnVuY3Rpb24ubmFtZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5wcm9taXNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLmV4ZWMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuZmxhZ3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAubWF0Y2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwib3V0L3RzL0NhbnZhcy9DYW52YXMuanMiLCJvdXQvdHMvQ2FudmFzL1N0YXJzLmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvTWVudS5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NlY3Rpb24uanMiLCJvdXQvdHMvRXZlbnRzL0NhbnZhc1RleHQuanMiLCJvdXQvdHMvRXZlbnRzL0xvZ28uanMiLCJvdXQvdHMvRXZlbnRzL01haW4uanMiLCJvdXQvdHMvRXZlbnRzL01lbnUuanMiLCJvdXQvdHMvTW9kdWxlcy9ET00uanMiLCJvdXQvdHMvTW9kdWxlcy9FdmVudERpc3BhdGNoZXIuanMiLCJvdXQvdHMvTW9kdWxlcy9TVkcuanMiLCJvdXQvdHMvTW9kdWxlcy9XZWJQYWdlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9BbmltYXRpb24uanMiLCJvdXQvdHMvUGFydGljbGVzL0FuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Db2xvci5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQ29vcmRpbmF0ZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvTW91c2UuanMiLCJvdXQvdHMvUGFydGljbGVzL1BhcnRpY2xlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9QYXJ0aWNsZVNldHRpbmdzLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9QYXJ0aWNsZXMuanMiLCJvdXQvdHMvUGFydGljbGVzL1N0cm9rZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvVmVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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LENBQVQ7QUFDQSxTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0g7O0FBQ0QsRUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixJQUFqQixHQUF3QixVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ3BDLFFBQUksQ0FBQyxLQUFLLEtBQUssQ0FBZixFQUFrQjtBQUFFLE1BQUEsQ0FBQyxHQUFHLElBQUo7QUFBVzs7QUFDL0IsUUFBSSxDQUFDLEtBQUssS0FBSyxDQUFmLEVBQWtCO0FBQUUsTUFBQSxDQUFDLEdBQUcsSUFBSjtBQUFXOztBQUMvQixRQUFJLENBQUosRUFBTztBQUNILFdBQUssQ0FBTCxJQUFVLENBQUMsQ0FBWDtBQUNIOztBQUNELFFBQUksQ0FBSixFQUFPO0FBQ0gsV0FBSyxDQUFMLElBQVUsQ0FBQyxDQUFYO0FBQ0g7QUFDSixHQVREOztBQVVBLEVBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsU0FBakIsR0FBNkIsWUFBWTtBQUNyQyxXQUFPLElBQUksQ0FBQyxJQUFMLENBQVcsS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUFmLEdBQXFCLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBN0MsQ0FBUDtBQUNILEdBRkQ7O0FBR0EsRUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixLQUFqQixHQUF5QixZQUFZO0FBQ2pDLFdBQU8sSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFLLENBQUwsR0FBUyxLQUFLLENBQXZCLENBQVA7QUFDSCxHQUZEOztBQUdBLFNBQU8sTUFBUDtBQUNILENBdEJhLEVBQWQ7O0FBdUJBLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLE1BQWxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gMjIuMS4zLjMxIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxudmFyIFVOU0NPUEFCTEVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3Vuc2NvcGFibGVzJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcbmlmIChBcnJheVByb3RvW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpIHJlcXVpcmUoJy4vX2hpZGUnKShBcnJheVByb3RvLCBVTlNDT1BBQkxFUywge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4gLy8gYEFkdmFuY2VTdHJpbmdJbmRleGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hZHZhbmNlc3RyaW5naW5kZXhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFMsIGluZGV4LCB1bmljb2RlKSB7XG4gIHJldHVybiBpbmRleCArICh1bmljb2RlID8gYXQoUywgaW5kZXgpLmxlbmd0aCA6IDEpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpIHtcbiAgaWYgKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXG4ndXNlIHN0cmljdCc7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbGwodmFsdWUgLyogLCBzdGFydCA9IDAsIGVuZCA9IEBsZW5ndGggKi8pIHtcbiAgdmFyIE8gPSB0b09iamVjdCh0aGlzKTtcbiAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIGxlbmd0aCk7XG4gIHZhciBlbmQgPSBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgdmFyIGVuZFBvcyA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9BYnNvbHV0ZUluZGV4KGVuZCwgbGVuZ3RoKTtcbiAgd2hpbGUgKGVuZFBvcyA+IGluZGV4KSBPW2luZGV4KytdID0gdmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGFzYyA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUWVBFLCAkY3JlYXRlKSB7XG4gIHZhciBJU19NQVAgPSBUWVBFID09IDE7XG4gIHZhciBJU19GSUxURVIgPSBUWVBFID09IDI7XG4gIHZhciBJU19TT01FID0gVFlQRSA9PSAzO1xuICB2YXIgSVNfRVZFUlkgPSBUWVBFID09IDQ7XG4gIHZhciBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2O1xuICB2YXIgTk9fSE9MRVMgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgdmFyIGNyZWF0ZSA9ICRjcmVhdGUgfHwgYXNjO1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KSB7XG4gICAgdmFyIE8gPSB0b09iamVjdCgkdGhpcyk7XG4gICAgdmFyIHNlbGYgPSBJT2JqZWN0KE8pO1xuICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgdmFsLCByZXM7XG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKSB7XG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XG4gICAgICBpZiAoVFlQRSkge1xuICAgICAgICBpZiAoSVNfTUFQKSByZXN1bHRbaW5kZXhdID0gcmVzOyAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmIChyZXMpIHN3aXRjaCAoVFlQRSkge1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZiAoSVNfRVZFUlkpIHJldHVybiBmYWxzZTsgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsKSkge1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmICh0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpIEMgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTtcbiIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsLCBsZW5ndGgpIHtcbiAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsKSkobGVuZ3RoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaW52b2tlID0gcmVxdWlyZSgnLi9faW52b2tlJyk7XG52YXIgYXJyYXlTbGljZSA9IFtdLnNsaWNlO1xudmFyIGZhY3RvcmllcyA9IHt9O1xuXG52YXIgY29uc3RydWN0ID0gZnVuY3Rpb24gKEYsIGxlbiwgYXJncykge1xuICBpZiAoIShsZW4gaW4gZmFjdG9yaWVzKSkge1xuICAgIGZvciAodmFyIG4gPSBbXSwgaSA9IDA7IGkgPCBsZW47IGkrKykgbltpXSA9ICdhWycgKyBpICsgJ10nO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgIGZhY3Rvcmllc1tsZW5dID0gRnVuY3Rpb24oJ0YsYScsICdyZXR1cm4gbmV3IEYoJyArIG4uam9pbignLCcpICsgJyknKTtcbiAgfSByZXR1cm4gZmFjdG9yaWVzW2xlbl0oRiwgYXJncyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLmJpbmQgfHwgZnVuY3Rpb24gYmluZCh0aGF0IC8qICwgLi4uYXJncyAqLykge1xuICB2YXIgZm4gPSBhRnVuY3Rpb24odGhpcyk7XG4gIHZhciBwYXJ0QXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICB2YXIgYm91bmQgPSBmdW5jdGlvbiAoLyogYXJncy4uLiAqLykge1xuICAgIHZhciBhcmdzID0gcGFydEFyZ3MuY29uY2F0KGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIGJvdW5kID8gY29uc3RydWN0KGZuLCBhcmdzLmxlbmd0aCwgYXJncykgOiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xuICB9O1xuICBpZiAoaXNPYmplY3QoZm4ucHJvdG90eXBlKSkgYm91bmQucHJvdG90eXBlID0gZm4ucHJvdG90eXBlO1xuICByZXR1cm4gYm91bmQ7XG59O1xuIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQVJHID0gY29mKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyICRpdGVyRGVmaW5lID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKTtcbnZhciBzdGVwID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJyk7XG52YXIgc2V0U3BlY2llcyA9IHJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIGZhc3RLZXkgPSByZXF1aXJlKCcuL19tZXRhJykuZmFzdEtleTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBTSVpFID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnO1xuXG52YXIgZ2V0RW50cnkgPSBmdW5jdGlvbiAodGhhdCwga2V5KSB7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSk7XG4gIHZhciBlbnRyeTtcbiAgaWYgKGluZGV4ICE9PSAnRicpIHJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvciAoZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKSB7XG4gICAgaWYgKGVudHJ5LmsgPT0ga2V5KSByZXR1cm4gZW50cnk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24gKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpIHtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24gKHRoYXQsIGl0ZXJhYmxlKSB7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5fdCA9IE5BTUU7ICAgICAgICAgLy8gY29sbGVjdGlvbiB0eXBlXG4gICAgICB0aGF0Ll9pID0gY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgLy8gZmlyc3QgZW50cnlcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7ICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgZm9yICh2YXIgdGhhdCA9IHZhbGlkYXRlKHRoaXMsIE5BTUUpLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKSB7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYgKGVudHJ5LnApIGVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB2YWxpZGF0ZSh0aGlzLCBOQU1FKTtcbiAgICAgICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uO1xuICAgICAgICAgIHZhciBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZiAocHJldikgcHJldi5uID0gbmV4dDtcbiAgICAgICAgICBpZiAobmV4dCkgbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZiAodGhhdC5fZiA9PSBlbnRyeSkgdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYgKHRoYXQuX2wgPT0gZW50cnkpIHRoYXQuX2wgPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhhdCA9IHVuZGVmaW5lZCAqLykge1xuICAgICAgICB2YWxpZGF0ZSh0aGlzLCBOQU1FKTtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpO1xuICAgICAgICB2YXIgZW50cnk7XG4gICAgICAgIHdoaWxlIChlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXMuX2YpIHtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yKSBlbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBOQU1FKSwga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoREVTQ1JJUFRPUlMpIGRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUodGhpcywgTkFNRSlbU0laRV07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24gKHRoYXQsIGtleSwgdmFsdWUpIHtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgIHZhciBwcmV2LCBpbmRleDtcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICBpZiAoZW50cnkpIHtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmICghdGhhdC5fZikgdGhhdC5fZiA9IGVudHJ5O1xuICAgICAgaWYgKHByZXYpIHByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZiAoaW5kZXggIT09ICdGJykgdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24gKEMsIE5BTUUsIElTX01BUCkge1xuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgICAkaXRlckRlZmluZShDLCBOQU1FLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgICAgIHRoaXMuX3QgPSB2YWxpZGF0ZShpdGVyYXRlZCwgTkFNRSk7IC8vIHRhcmdldFxuICAgICAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgICAgICAgLy8ga2luZFxuICAgICAgdGhpcy5fbCA9IHVuZGVmaW5lZDsgICAgICAgICAgICAgICAgLy8gcHJldmlvdXNcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIga2luZCA9IHRoYXQuX2s7XG4gICAgICB2YXIgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZSAoZW50cnkgJiYgZW50cnkucikgZW50cnkgPSBlbnRyeS5wO1xuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcbiAgICAgIGlmICghdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKSB7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHRoYXQuX3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycsICFJU19NQVAsIHRydWUpO1xuXG4gICAgLy8gYWRkIFtAQHNwZWNpZXNdLCAyMy4xLjIuMiwgMjMuMi4yLjJcbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgJGl0ZXJEZXRlY3QgPSByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBpbmhlcml0SWZSZXF1aXJlZCA9IHJlcXVpcmUoJy4vX2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspIHtcbiAgdmFyIEJhc2UgPSBnbG9iYWxbTkFNRV07XG4gIHZhciBDID0gQmFzZTtcbiAgdmFyIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJztcbiAgdmFyIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZTtcbiAgdmFyIE8gPSB7fTtcbiAgdmFyIGZpeE1ldGhvZCA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgICB2YXIgZm4gPSBwcm90b1tLRVldO1xuICAgIHJlZGVmaW5lKHByb3RvLCBLRVksXG4gICAgICBLRVkgPT0gJ2RlbGV0ZScgPyBmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2hhcycgPyBmdW5jdGlvbiBoYXMoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2dldCcgPyBmdW5jdGlvbiBnZXQoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyB1bmRlZmluZWQgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdhZGQnID8gZnVuY3Rpb24gYWRkKGEpIHsgZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpOyByZXR1cm4gdGhpczsgfVxuICAgICAgICA6IGZ1bmN0aW9uIHNldChhLCBiKSB7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhLCBiKTsgcmV0dXJuIHRoaXM7IH1cbiAgICApO1xuICB9O1xuICBpZiAodHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKSB7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBDKCk7XG4gICAgLy8gZWFybHkgaW1wbGVtZW50YXRpb25zIG5vdCBzdXBwb3J0cyBjaGFpbmluZ1xuICAgIHZhciBIQVNOVF9DSEFJTklORyA9IGluc3RhbmNlW0FEREVSXShJU19XRUFLID8ge30gOiAtMCwgMSkgIT0gaW5zdGFuY2U7XG4gICAgLy8gVjggfiAgQ2hyb21pdW0gNDAtIHdlYWstY29sbGVjdGlvbnMgdGhyb3dzIG9uIHByaW1pdGl2ZXMsIGJ1dCBzaG91bGQgcmV0dXJuIGZhbHNlXG4gICAgdmFyIFRIUk9XU19PTl9QUklNSVRJVkVTID0gZmFpbHMoZnVuY3Rpb24gKCkgeyBpbnN0YW5jZS5oYXMoMSk7IH0pO1xuICAgIC8vIG1vc3QgZWFybHkgaW1wbGVtZW50YXRpb25zIGRvZXNuJ3Qgc3VwcG9ydHMgaXRlcmFibGVzLCBtb3N0IG1vZGVybiAtIG5vdCBjbG9zZSBpdCBjb3JyZWN0bHlcbiAgICB2YXIgQUNDRVBUX0lURVJBQkxFUyA9ICRpdGVyRGV0ZWN0KGZ1bmN0aW9uIChpdGVyKSB7IG5ldyBDKGl0ZXIpOyB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAvLyBmb3IgZWFybHkgaW1wbGVtZW50YXRpb25zIC0wIGFuZCArMCBub3QgdGhlIHNhbWVcbiAgICB2YXIgQlVHR1lfWkVSTyA9ICFJU19XRUFLICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFY4IH4gQ2hyb21pdW0gNDItIGZhaWxzIG9ubHkgd2l0aCA1KyBlbGVtZW50c1xuICAgICAgdmFyICRpbnN0YW5jZSA9IG5ldyBDKCk7XG4gICAgICB2YXIgaW5kZXggPSA1O1xuICAgICAgd2hpbGUgKGluZGV4LS0pICRpbnN0YW5jZVtBRERFUl0oaW5kZXgsIGluZGV4KTtcbiAgICAgIHJldHVybiAhJGluc3RhbmNlLmhhcygtMCk7XG4gICAgfSk7XG4gICAgaWYgKCFBQ0NFUFRfSVRFUkFCTEVTKSB7XG4gICAgICBDID0gd3JhcHBlcihmdW5jdGlvbiAodGFyZ2V0LCBpdGVyYWJsZSkge1xuICAgICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSk7XG4gICAgICAgIHZhciB0aGF0ID0gaW5oZXJpdElmUmVxdWlyZWQobmV3IEJhc2UoKSwgdGFyZ2V0LCBDKTtcbiAgICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH0pO1xuICAgICAgQy5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgIHByb3RvLmNvbnN0cnVjdG9yID0gQztcbiAgICB9XG4gICAgaWYgKFRIUk9XU19PTl9QUklNSVRJVkVTIHx8IEJVR0dZX1pFUk8pIHtcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xuICAgICAgSVNfTUFQICYmIGZpeE1ldGhvZCgnZ2V0Jyk7XG4gICAgfVxuICAgIGlmIChCVUdHWV9aRVJPIHx8IEhBU05UX0NIQUlOSU5HKSBmaXhNZXRob2QoQURERVIpO1xuICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgc2hvdWxkIG5vdCBjb250YWlucyAuY2xlYXIgbWV0aG9kXG4gICAgaWYgKElTX1dFQUsgJiYgcHJvdG8uY2xlYXIpIGRlbGV0ZSBwcm90by5jbGVhcjtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqIChDICE9IEJhc2UpLCBPKTtcblxuICBpZiAoIUlTX1dFQUspIGNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi42LjUnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHJlc3VsdCA9IGdldEtleXMoaXQpO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgaWYgKGdldFN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpO1xuICAgIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAoc3ltYm9scy5sZW5ndGggPiBpKSBpZiAoaXNFbnVtLmNhbGwoaXQsIGtleSA9IHN5bWJvbHNbaSsrXSkpIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIHRhcmdldCA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSB8fCAoZ2xvYmFsW25hbWVdID0ge30pIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSk7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHA7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmICh0YXJnZXQpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQsIHR5cGUgJiAkZXhwb3J0LlUpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmIChleHBvcnRzW2tleV0gIT0gb3V0KSBoaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZiAoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpIGV4cFByb3RvW2tleV0gPSBvdXQ7XG4gIH1cbn07XG5nbG9iYWwuY29yZSA9IGNvcmU7XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5yZXF1aXJlKCcuL2VzNi5yZWdleHAuZXhlYycpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xudmFyIHdrcyA9IHJlcXVpcmUoJy4vX3drcycpO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuL19yZWdleHAtZXhlYycpO1xuXG52YXIgU1BFQ0lFUyA9IHdrcygnc3BlY2llcycpO1xuXG52YXIgUkVQTEFDRV9TVVBQT1JUU19OQU1FRF9HUk9VUFMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyAjcmVwbGFjZSBuZWVkcyBidWlsdC1pbiBzdXBwb3J0IGZvciBuYW1lZCBncm91cHMuXG4gIC8vICNtYXRjaCB3b3JrcyBmaW5lIGJlY2F1c2UgaXQganVzdCByZXR1cm4gdGhlIGV4ZWMgcmVzdWx0cywgZXZlbiBpZiBpdCBoYXNcbiAgLy8gYSBcImdyb3BzXCIgcHJvcGVydHkuXG4gIHZhciByZSA9IC8uLztcbiAgcmUuZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgcmVzdWx0Lmdyb3VwcyA9IHsgYTogJzcnIH07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuICcnLnJlcGxhY2UocmUsICckPGE+JykgIT09ICc3Jztcbn0pO1xuXG52YXIgU1BMSVRfV09SS1NfV0lUSF9PVkVSV1JJVFRFTl9FWEVDID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gQ2hyb21lIDUxIGhhcyBhIGJ1Z2d5IFwic3BsaXRcIiBpbXBsZW1lbnRhdGlvbiB3aGVuIFJlZ0V4cCNleGVjICE9PSBuYXRpdmVFeGVjXG4gIHZhciByZSA9IC8oPzopLztcbiAgdmFyIG9yaWdpbmFsRXhlYyA9IHJlLmV4ZWM7XG4gIHJlLmV4ZWMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBvcmlnaW5hbEV4ZWMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgdmFyIHJlc3VsdCA9ICdhYicuc3BsaXQocmUpO1xuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA9PT0gMiAmJiByZXN1bHRbMF0gPT09ICdhJyAmJiByZXN1bHRbMV0gPT09ICdiJztcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSwgbGVuZ3RoLCBleGVjKSB7XG4gIHZhciBTWU1CT0wgPSB3a3MoS0VZKTtcblxuICB2YXIgREVMRUdBVEVTX1RPX1NZTUJPTCA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gU3RyaW5nIG1ldGhvZHMgY2FsbCBzeW1ib2wtbmFtZWQgUmVnRXAgbWV0aG9kc1xuICAgIHZhciBPID0ge307XG4gICAgT1tTWU1CT0xdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfTtcbiAgICByZXR1cm4gJydbS0VZXShPKSAhPSA3O1xuICB9KTtcblxuICB2YXIgREVMRUdBVEVTX1RPX0VYRUMgPSBERUxFR0FURVNfVE9fU1lNQk9MID8gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTeW1ib2wtbmFtZWQgUmVnRXhwIG1ldGhvZHMgY2FsbCAuZXhlY1xuICAgIHZhciBleGVjQ2FsbGVkID0gZmFsc2U7XG4gICAgdmFyIHJlID0gL2EvO1xuICAgIHJlLmV4ZWMgPSBmdW5jdGlvbiAoKSB7IGV4ZWNDYWxsZWQgPSB0cnVlOyByZXR1cm4gbnVsbDsgfTtcbiAgICBpZiAoS0VZID09PSAnc3BsaXQnKSB7XG4gICAgICAvLyBSZWdFeHBbQEBzcGxpdF0gZG9lc24ndCBjYWxsIHRoZSByZWdleCdzIGV4ZWMgbWV0aG9kLCBidXQgZmlyc3QgY3JlYXRlc1xuICAgICAgLy8gYSBuZXcgb25lLiBXZSBuZWVkIHRvIHJldHVybiB0aGUgcGF0Y2hlZCByZWdleCB3aGVuIGNyZWF0aW5nIHRoZSBuZXcgb25lLlxuICAgICAgcmUuY29uc3RydWN0b3IgPSB7fTtcbiAgICAgIHJlLmNvbnN0cnVjdG9yW1NQRUNJRVNdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gcmU7IH07XG4gICAgfVxuICAgIHJlW1NZTUJPTF0oJycpO1xuICAgIHJldHVybiAhZXhlY0NhbGxlZDtcbiAgfSkgOiB1bmRlZmluZWQ7XG5cbiAgaWYgKFxuICAgICFERUxFR0FURVNfVE9fU1lNQk9MIHx8XG4gICAgIURFTEVHQVRFU19UT19FWEVDIHx8XG4gICAgKEtFWSA9PT0gJ3JlcGxhY2UnICYmICFSRVBMQUNFX1NVUFBPUlRTX05BTUVEX0dST1VQUykgfHxcbiAgICAoS0VZID09PSAnc3BsaXQnICYmICFTUExJVF9XT1JLU19XSVRIX09WRVJXUklUVEVOX0VYRUMpXG4gICkge1xuICAgIHZhciBuYXRpdmVSZWdFeHBNZXRob2QgPSAvLi9bU1lNQk9MXTtcbiAgICB2YXIgZm5zID0gZXhlYyhcbiAgICAgIGRlZmluZWQsXG4gICAgICBTWU1CT0wsXG4gICAgICAnJ1tLRVldLFxuICAgICAgZnVuY3Rpb24gbWF5YmVDYWxsTmF0aXZlKG5hdGl2ZU1ldGhvZCwgcmVnZXhwLCBzdHIsIGFyZzIsIGZvcmNlU3RyaW5nTWV0aG9kKSB7XG4gICAgICAgIGlmIChyZWdleHAuZXhlYyA9PT0gcmVnZXhwRXhlYykge1xuICAgICAgICAgIGlmIChERUxFR0FURVNfVE9fU1lNQk9MICYmICFmb3JjZVN0cmluZ01ldGhvZCkge1xuICAgICAgICAgICAgLy8gVGhlIG5hdGl2ZSBTdHJpbmcgbWV0aG9kIGFscmVhZHkgZGVsZWdhdGVzIHRvIEBAbWV0aG9kICh0aGlzXG4gICAgICAgICAgICAvLyBwb2x5ZmlsbGVkIGZ1bmN0aW9uKSwgbGVhc2luZyB0byBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgICAgICAgICAvLyBXZSBhdm9pZCBpdCBieSBkaXJlY3RseSBjYWxsaW5nIHRoZSBuYXRpdmUgQEBtZXRob2QgbWV0aG9kLlxuICAgICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IG5hdGl2ZVJlZ0V4cE1ldGhvZC5jYWxsKHJlZ2V4cCwgc3RyLCBhcmcyKSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogbmF0aXZlTWV0aG9kLmNhbGwoc3RyLCByZWdleHAsIGFyZzIpIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UgfTtcbiAgICAgIH1cbiAgICApO1xuICAgIHZhciBzdHJmbiA9IGZuc1swXTtcbiAgICB2YXIgcnhmbiA9IGZuc1sxXTtcblxuICAgIHJlZGVmaW5lKFN0cmluZy5wcm90b3R5cGUsIEtFWSwgc3RyZm4pO1xuICAgIGhpZGUoUmVnRXhwLnByb3RvdHlwZSwgU1lNQk9MLCBsZW5ndGggPT0gMlxuICAgICAgLy8gMjEuMi41LjggUmVnRXhwLnByb3RvdHlwZVtAQHJlcGxhY2VdKHN0cmluZywgcmVwbGFjZVZhbHVlKVxuICAgICAgLy8gMjEuMi41LjExIFJlZ0V4cC5wcm90b3R5cGVbQEBzcGxpdF0oc3RyaW5nLCBsaW1pdClcbiAgICAgID8gZnVuY3Rpb24gKHN0cmluZywgYXJnKSB7IHJldHVybiByeGZuLmNhbGwoc3RyaW5nLCB0aGlzLCBhcmcpOyB9XG4gICAgICAvLyAyMS4yLjUuNiBSZWdFeHAucHJvdG90eXBlW0BAbWF0Y2hdKHN0cmluZylcbiAgICAgIC8vIDIxLjIuNS45IFJlZ0V4cC5wcm90b3R5cGVbQEBzZWFyY2hdKHN0cmluZylcbiAgICAgIDogZnVuY3Rpb24gKHN0cmluZykgeyByZXR1cm4gcnhmbi5jYWxsKHN0cmluZywgdGhpcyk7IH1cbiAgICApO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3NcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB0aGF0ID0gYW5PYmplY3QodGhpcyk7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgaWYgKHRoYXQuZ2xvYmFsKSByZXN1bHQgKz0gJ2cnO1xuICBpZiAodGhhdC5pZ25vcmVDYXNlKSByZXN1bHQgKz0gJ2knO1xuICBpZiAodGhhdC5tdWx0aWxpbmUpIHJlc3VsdCArPSAnbSc7XG4gIGlmICh0aGF0LnVuaWNvZGUpIHJlc3VsdCArPSAndSc7XG4gIGlmICh0aGF0LnN0aWNreSkgcmVzdWx0ICs9ICd5JztcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xudmFyIEJSRUFLID0ge307XG52YXIgUkVUVVJOID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1IpIHtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpO1xuICB2YXIgZiA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKTtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYgKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZiAoaXNBcnJheUl0ZXIoaXRlckZuKSkgZm9yIChsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTspIHtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnbmF0aXZlLWZ1bmN0aW9uLXRvLXN0cmluZycsIEZ1bmN0aW9uLnRvU3RyaW5nKTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGhhdCwgdGFyZ2V0LCBDKSB7XG4gIHZhciBTID0gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuICB2YXIgUDtcbiAgaWYgKFMgIT09IEMgJiYgdHlwZW9mIFMgPT0gJ2Z1bmN0aW9uJyAmJiAoUCA9IFMucHJvdG90eXBlKSAhPT0gQy5wcm90b3R5cGUgJiYgaXNPYmplY3QoUCkgJiYgc2V0UHJvdG90eXBlT2YpIHtcbiAgICBzZXRQcm90b3R5cGVPZih0aGF0LCBQKTtcbiAgfSByZXR1cm4gdGhhdDtcbn07XG4iLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCBhcmdzLCB0aGF0KSB7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZG9uZSwgdmFsdWUpIHtcbiAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmUgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsInZhciBNRVRBID0gcmVxdWlyZSgnLi9fdWlkJykoJ21ldGEnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHNldERlc2MgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGlkID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xudmFyIEZSRUVaRSA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbiAoaXQpIHtcbiAgc2V0RGVzYyhpdCwgTUVUQSwgeyB2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gfSk7XG59O1xudmFyIGZhc3RLZXkgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZiAoIWhhcyhpdCwgTUVUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIGlmICghaGFzKGl0LCBNRVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIGhhc2ggd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSByZXR1cm4gaXRbTUVUQV0udztcbn07XG4vLyBhZGQgbWV0YWRhdGEgb24gZnJlZXplLWZhbWlseSBtZXRob2RzIGNhbGxpbmdcbnZhciBvbkZyZWV6ZSA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoRlJFRVpFICYmIG1ldGEuTkVFRCAmJiBpc0V4dGVuc2libGUoaXQpICYmICFoYXMoaXQsIE1FVEEpKSBzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogTUVUQSxcbiAgTkVFRDogZmFsc2UsXG4gIGZhc3RLZXk6IGZhc3RLZXksXG4gIGdldFdlYWs6IGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0O1xudmFyIE9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcbnZhciBpc05vZGUgPSByZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGFyZW50LCBmbjtcbiAgICBpZiAoaXNOb2RlICYmIChwYXJlbnQgPSBwcm9jZXNzLmRvbWFpbikpIHBhcmVudC5leGl0KCk7XG4gICAgd2hpbGUgKGhlYWQpIHtcbiAgICAgIGZuID0gaGVhZC5mbjtcbiAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoaGVhZCkgbm90aWZ5KCk7XG4gICAgICAgIGVsc2UgbGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LmVudGVyKCk7XG4gIH07XG5cbiAgLy8gTm9kZS5qc1xuICBpZiAoaXNOb2RlKSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gICAgfTtcbiAgLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyLCBleGNlcHQgaU9TIFNhZmFyaSAtIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8zMzlcbiAgfSBlbHNlIGlmIChPYnNlcnZlciAmJiAhKGdsb2JhbC5uYXZpZ2F0b3IgJiYgZ2xvYmFsLm5hdmlnYXRvci5zdGFuZGFsb25lKSkge1xuICAgIHZhciB0b2dnbGUgPSB0cnVlO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlID0gIXRvZ2dsZTtcbiAgICB9O1xuICAvLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxuICB9IGVsc2UgaWYgKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKSB7XG4gICAgLy8gUHJvbWlzZS5yZXNvbHZlIHdpdGhvdXQgYW4gYXJndW1lbnQgdGhyb3dzIGFuIGVycm9yIGluIExHIFdlYk9TIDJcbiAgICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb21pc2UudGhlbihmbHVzaCk7XG4gICAgfTtcbiAgLy8gZm9yIG90aGVyIGVudmlyb25tZW50cyAtIG1hY3JvdGFzayBiYXNlZCBvbjpcbiAgLy8gLSBzZXRJbW1lZGlhdGVcbiAgLy8gLSBNZXNzYWdlQ2hhbm5lbFxuICAvLyAtIHdpbmRvdy5wb3N0TWVzc2FnXG4gIC8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4gIC8vIC0gc2V0VGltZW91dFxuICB9IGVsc2Uge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgdmFyIHRhc2sgPSB7IGZuOiBmbiwgbmV4dDogdW5kZWZpbmVkIH07XG4gICAgaWYgKGxhc3QpIGxhc3QubmV4dCA9IHRhc2s7XG4gICAgaWYgKCFoZWFkKSB7XG4gICAgICBoZWFkID0gdGFzaztcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gbGFzdCA9IHRhc2s7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjUuNC4xLjUgTmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5cbmZ1bmN0aW9uIFByb21pc2VDYXBhYmlsaXR5KEMpIHtcbiAgdmFyIHJlc29sdmUsIHJlamVjdDtcbiAgdGhpcy5wcm9taXNlID0gbmV3IEMoZnVuY3Rpb24gKCQkcmVzb2x2ZSwgJCRyZWplY3QpIHtcbiAgICBpZiAocmVzb2x2ZSAhPT0gdW5kZWZpbmVkIHx8IHJlamVjdCAhPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgPSAkJHJlamVjdDtcbiAgfSk7XG4gIHRoaXMucmVzb2x2ZSA9IGFGdW5jdGlvbihyZXNvbHZlKTtcbiAgdGhpcy5yZWplY3QgPSBhRnVuY3Rpb24ocmVqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIChDKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG59O1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgZ09QRCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApIHtcbiAgTyA9IHRvSU9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoaGFzKE8sIFApKSByZXR1cm4gY3JlYXRlRGVzYyghcElFLmYuY2FsbChPLCBQKSwgT1tQXSk7XG59O1xuIiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBnT1BOID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mO1xudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgd2luZG93ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xuXG52YXIgZ2V0V2luZG93TmFtZXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ09QTihpdCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nID8gZ2V0V2luZG93TmFtZXMoaXQpIDogZ09QTih0b0lPYmplY3QoaXQpKTtcbn07XG4iLCIvLyAxOS4xLjIuNyAvIDE1LjIuMy40IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJykuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTykge1xuICByZXR1cm4gJGtleXMoTywgaGlkZGVuS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHsgZTogZmFsc2UsIHY6IGV4ZWMoKSB9O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgZTogdHJ1ZSwgdjogZSB9O1xuICB9XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQywgeCkge1xuICBhbk9iamVjdChDKTtcbiAgaWYgKGlzT2JqZWN0KHgpICYmIHguY29uc3RydWN0b3IgPT09IEMpIHJldHVybiB4O1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKEMpO1xuICB2YXIgcmVzb2x2ZSA9IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmU7XG4gIHJlc29sdmUoeCk7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIHNhZmUpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldLCBzYWZlKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgJHRvU3RyaW5nID0gcmVxdWlyZSgnLi9fZnVuY3Rpb24tdG8tc3RyaW5nJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBUUEwgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWwsIHNhZmUpIHtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmIChPW2tleV0gPT09IHZhbCkgcmV0dXJuO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoIXNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKE9ba2V5XSkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBidWlsdGluRXhlYyA9IFJlZ0V4cC5wcm90b3R5cGUuZXhlYztcblxuIC8vIGBSZWdFeHBFeGVjYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cGV4ZWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFIsIFMpIHtcbiAgdmFyIGV4ZWMgPSBSLmV4ZWM7XG4gIGlmICh0eXBlb2YgZXhlYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciByZXN1bHQgPSBleGVjLmNhbGwoUiwgUyk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWdFeHAgZXhlYyBtZXRob2QgcmV0dXJuZWQgc29tZXRoaW5nIG90aGVyIHRoYW4gYW4gT2JqZWN0IG9yIG51bGwnKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoY2xhc3NvZihSKSAhPT0gJ1JlZ0V4cCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWdFeHAjZXhlYyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG4gIH1cbiAgcmV0dXJuIGJ1aWx0aW5FeGVjLmNhbGwoUiwgUyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVnZXhwRmxhZ3MgPSByZXF1aXJlKCcuL19mbGFncycpO1xuXG52YXIgbmF0aXZlRXhlYyA9IFJlZ0V4cC5wcm90b3R5cGUuZXhlYztcbi8vIFRoaXMgYWx3YXlzIHJlZmVycyB0byB0aGUgbmF0aXZlIGltcGxlbWVudGF0aW9uLCBiZWNhdXNlIHRoZVxuLy8gU3RyaW5nI3JlcGxhY2UgcG9seWZpbGwgdXNlcyAuL2ZpeC1yZWdleHAtd2VsbC1rbm93bi1zeW1ib2wtbG9naWMuanMsXG4vLyB3aGljaCBsb2FkcyB0aGlzIGZpbGUgYmVmb3JlIHBhdGNoaW5nIHRoZSBtZXRob2QuXG52YXIgbmF0aXZlUmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcblxudmFyIHBhdGNoZWRFeGVjID0gbmF0aXZlRXhlYztcblxudmFyIExBU1RfSU5ERVggPSAnbGFzdEluZGV4JztcblxudmFyIFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciByZTEgPSAvYS8sXG4gICAgICByZTIgPSAvYiovZztcbiAgbmF0aXZlRXhlYy5jYWxsKHJlMSwgJ2EnKTtcbiAgbmF0aXZlRXhlYy5jYWxsKHJlMiwgJ2EnKTtcbiAgcmV0dXJuIHJlMVtMQVNUX0lOREVYXSAhPT0gMCB8fCByZTJbTEFTVF9JTkRFWF0gIT09IDA7XG59KSgpO1xuXG4vLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cCwgY29waWVkIGZyb20gZXM1LXNoaW0ncyBTdHJpbmcjc3BsaXQgcGF0Y2guXG52YXIgTlBDR19JTkNMVURFRCA9IC8oKT8/Ly5leGVjKCcnKVsxXSAhPT0gdW5kZWZpbmVkO1xuXG52YXIgUEFUQ0ggPSBVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgfHwgTlBDR19JTkNMVURFRDtcblxuaWYgKFBBVENIKSB7XG4gIHBhdGNoZWRFeGVjID0gZnVuY3Rpb24gZXhlYyhzdHIpIHtcbiAgICB2YXIgcmUgPSB0aGlzO1xuICAgIHZhciBsYXN0SW5kZXgsIHJlQ29weSwgbWF0Y2gsIGk7XG5cbiAgICBpZiAoTlBDR19JTkNMVURFRCkge1xuICAgICAgcmVDb3B5ID0gbmV3IFJlZ0V4cCgnXicgKyByZS5zb3VyY2UgKyAnJCg/IVxcXFxzKScsIHJlZ2V4cEZsYWdzLmNhbGwocmUpKTtcbiAgICB9XG4gICAgaWYgKFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORykgbGFzdEluZGV4ID0gcmVbTEFTVF9JTkRFWF07XG5cbiAgICBtYXRjaCA9IG5hdGl2ZUV4ZWMuY2FsbChyZSwgc3RyKTtcblxuICAgIGlmIChVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgJiYgbWF0Y2gpIHtcbiAgICAgIHJlW0xBU1RfSU5ERVhdID0gcmUuZ2xvYmFsID8gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGggOiBsYXN0SW5kZXg7XG4gICAgfVxuICAgIGlmIChOUENHX0lOQ0xVREVEICYmIG1hdGNoICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgXG4gICAgICAvLyBmb3IgTlBDRywgbGlrZSBJRTguIE5PVEU6IFRoaXMgZG9lc24nIHdvcmsgZm9yIC8oLj8pPy9cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb29wLWZ1bmNcbiAgICAgIG5hdGl2ZVJlcGxhY2UuY2FsbChtYXRjaFswXSwgcmVDb3B5LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSA9PT0gdW5kZWZpbmVkKSBtYXRjaFtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGNoZWRFeGVjO1xuIiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uIChPLCBwcm90bykge1xuICBhbk9iamVjdChPKTtcbiAgaWYgKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpIHRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uICh0ZXN0LCBidWdneSwgc2V0KSB7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuL19jdHgnKShGdW5jdGlvbi5jYWxsLCByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmYoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgIHNldCh0ZXN0LCBbXSk7XG4gICAgICAgIGJ1Z2d5ID0gISh0ZXN0IGluc3RhbmNlb2YgQXJyYXkpO1xuICAgICAgfSBjYXRjaCAoZSkgeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90bykge1xuICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgIGlmIChidWdneSkgTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIEMgPSBnbG9iYWxbS0VZXTtcbiAgaWYgKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pIGRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59O1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAxOSBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBEKSB7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3I7XG4gIHZhciBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWV0aG9kLCBhcmcpIHtcbiAgcmV0dXJuICEhbWV0aG9kICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlbGVzcy1jYWxsXG4gICAgYXJnID8gbWV0aG9kLmNhbGwobnVsbCwgZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9LCAxKSA6IG1ldGhvZC5jYWxsKG51bGwpO1xuICB9KTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGludm9rZSA9IHJlcXVpcmUoJy4vX2ludm9rZScpO1xudmFyIGh0bWwgPSByZXF1aXJlKCcuL19odG1sJyk7XG52YXIgY2VsID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBzZXRUYXNrID0gZ2xvYmFsLnNldEltbWVkaWF0ZTtcbnZhciBjbGVhclRhc2sgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGU7XG52YXIgTWVzc2FnZUNoYW5uZWwgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWw7XG52YXIgRGlzcGF0Y2ggPSBnbG9iYWwuRGlzcGF0Y2g7XG52YXIgY291bnRlciA9IDA7XG52YXIgcXVldWUgPSB7fTtcbnZhciBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcbnZhciBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpZCA9ICt0aGlzO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gIGlmIChxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmICghc2V0VGFzayB8fCAhY2xlYXJUYXNrKSB7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIHZhciBpID0gMTtcbiAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGkpIGFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKSB7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmIChyZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcycpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIFNwaGVyZSAoSlMgZ2FtZSBlbmdpbmUpIERpc3BhdGNoIEFQSVxuICB9IGVsc2UgaWYgKERpc3BhdGNoICYmIERpc3BhdGNoLm5vdykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBEaXNwYXRjaC5ub3coY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZiAoTWVzc2FnZUNoYW5uZWwpIHtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgcG9ydCA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZiAoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0JykpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgbmF2aWdhdG9yID0gZ2xvYmFsLm5hdmlnYXRvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCB8fCAnJztcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFRZUEUpIHtcbiAgaWYgKCFpc09iamVjdChpdCkgfHwgaXQuX3QgIT09IFRZUEUpIHRocm93IFR5cGVFcnJvcignSW5jb21wYXRpYmxlIHJlY2VpdmVyLCAnICsgVFlQRSArICcgcmVxdWlyZWQhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyIHdrc0V4dCA9IHJlcXVpcmUoJy4vX3drcy1leHQnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciAkU3ltYm9sID0gY29yZS5TeW1ib2wgfHwgKGNvcmUuU3ltYm9sID0gTElCUkFSWSA/IHt9IDogZ2xvYmFsLlN5bWJvbCB8fCB7fSk7XG4gIGlmIChuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKSBkZWZpbmVQcm9wZXJ0eSgkU3ltYm9sLCBuYW1lLCB7IHZhbHVlOiB3a3NFeHQuZihuYW1lKSB9KTtcbn07XG4iLCJleHBvcnRzLmYgPSByZXF1aXJlKCcuL193a3MnKTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ0FycmF5JywgeyBmaWxsOiByZXF1aXJlKCcuL19hcnJheS1maWxsJykgfSk7XG5cbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKCdmaWxsJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRmb3JFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDApO1xudmFyIFNUUklDVCA9IHJlcXVpcmUoJy4vX3N0cmljdC1tZXRob2QnKShbXS5mb3JFYWNoLCB0cnVlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAhU1RSSUNULCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4xMCAvIDE1LjQuNC4xOCBBcnJheS5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgcmV0dXJuICRmb3JFYWNoKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciAkbmF0aXZlID0gW10uaW5kZXhPZjtcbnZhciBORUdBVElWRV9aRVJPID0gISEkbmF0aXZlICYmIDEgLyBbMV0uaW5kZXhPZigxLCAtMCkgPCAwO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChORUdBVElWRV9aRVJPIHx8ICFyZXF1aXJlKCcuL19zdHJpY3QtbWV0aG9kJykoJG5hdGl2ZSkpLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4xMSAvIDE1LjQuNC4xNCBBcnJheS5wcm90b3R5cGUuaW5kZXhPZihzZWFyY2hFbGVtZW50IFssIGZyb21JbmRleF0pXG4gIGluZGV4T2Y6IGZ1bmN0aW9uIGluZGV4T2Yoc2VhcmNoRWxlbWVudCAvKiAsIGZyb21JbmRleCA9IDAgKi8pIHtcbiAgICByZXR1cm4gTkVHQVRJVkVfWkVST1xuICAgICAgLy8gY29udmVydCAtMCB0byArMFxuICAgICAgPyAkbmF0aXZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgMFxuICAgICAgOiAkaW5kZXhPZih0aGlzLCBzZWFyY2hFbGVtZW50LCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRtYXAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMSk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX3N0cmljdC1tZXRob2QnKShbXS5tYXAsIHRydWUpLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4xNSAvIDE1LjQuNC4xOSBBcnJheS5wcm90b3R5cGUubWFwKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIG1hcDogZnVuY3Rpb24gbWFwKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgcmV0dXJuICRtYXAodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG4iLCJ2YXIgRGF0ZVByb3RvID0gRGF0ZS5wcm90b3R5cGU7XG52YXIgSU5WQUxJRF9EQVRFID0gJ0ludmFsaWQgRGF0ZSc7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSBEYXRlUHJvdG9bVE9fU1RSSU5HXTtcbnZhciBnZXRUaW1lID0gRGF0ZVByb3RvLmdldFRpbWU7XG5pZiAobmV3IERhdGUoTmFOKSArICcnICE9IElOVkFMSURfREFURSkge1xuICByZXF1aXJlKCcuL19yZWRlZmluZScpKERhdGVQcm90bywgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgdmFsdWUgPSBnZXRUaW1lLmNhbGwodGhpcyk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAkdG9TdHJpbmcuY2FsbCh0aGlzKSA6IElOVkFMSURfREFURTtcbiAgfSk7XG59XG4iLCIvLyAxOS4yLjMuMiAvIDE1LjMuNC41IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKHRoaXNBcmcsIGFyZ3MuLi4pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ0Z1bmN0aW9uJywgeyBiaW5kOiByZXF1aXJlKCcuL19iaW5kJykgfSk7XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIEZQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbnZhciBuYW1lUkUgPSAvXlxccypmdW5jdGlvbiAoW14gKF0qKS87XG52YXIgTkFNRSA9ICduYW1lJztcblxuLy8gMTkuMi40LjIgbmFtZVxuTkFNRSBpbiBGUHJvdG8gfHwgcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiBkUChGUHJvdG8sIE5BTUUsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICgnJyArIHRoaXMpLm1hdGNoKG5hbWVSRSlbMV07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBNQVAgPSAnTWFwJztcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoTUFQLCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgTUFQKSwga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpO1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7IGNyZWF0ZTogcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpIH0pO1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbi8vIDE5LjEuMi40IC8gMTUuMi4zLjYgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpLCAnT2JqZWN0JywgeyBkZWZpbmVQcm9wZXJ0eTogcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZiB9KTtcbiIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7IHNldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXQgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX3NwZWNpZXMtY29uc3RydWN0b3InKTtcbnZhciB0YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldDtcbnZhciBtaWNyb3Rhc2sgPSByZXF1aXJlKCcuL19taWNyb3Rhc2snKSgpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xudmFyIHBlcmZvcm0gPSByZXF1aXJlKCcuL19wZXJmb3JtJyk7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi9fdXNlci1hZ2VudCcpO1xudmFyIHByb21pc2VSZXNvbHZlID0gcmVxdWlyZSgnLi9fcHJvbWlzZS1yZXNvbHZlJyk7XG52YXIgUFJPTUlTRSA9ICdQcm9taXNlJztcbnZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciB2ZXJzaW9ucyA9IHByb2Nlc3MgJiYgcHJvY2Vzcy52ZXJzaW9ucztcbnZhciB2OCA9IHZlcnNpb25zICYmIHZlcnNpb25zLnY4IHx8ICcnO1xudmFyICRQcm9taXNlID0gZ2xvYmFsW1BST01JU0VdO1xudmFyIGlzTm9kZSA9IGNsYXNzb2YocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xudmFyIGVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIEludGVybmFsLCBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHksIE93blByb21pc2VDYXBhYmlsaXR5LCBXcmFwcGVyO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUuZjtcblxudmFyIFVTRV9OQVRJVkUgPSAhIWZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICAvLyBjb3JyZWN0IHN1YmNsYXNzaW5nIHdpdGggQEBzcGVjaWVzIHN1cHBvcnRcbiAgICB2YXIgcHJvbWlzZSA9ICRQcm9taXNlLnJlc29sdmUoMSk7XG4gICAgdmFyIEZha2VQcm9taXNlID0gKHByb21pc2UuY29uc3RydWN0b3IgPSB7fSlbcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKV0gPSBmdW5jdGlvbiAoZXhlYykge1xuICAgICAgZXhlYyhlbXB0eSwgZW1wdHkpO1xuICAgIH07XG4gICAgLy8gdW5oYW5kbGVkIHJlamVjdGlvbnMgdHJhY2tpbmcgc3VwcG9ydCwgTm9kZUpTIFByb21pc2Ugd2l0aG91dCBpdCBmYWlscyBAQHNwZWNpZXMgdGVzdFxuICAgIHJldHVybiAoaXNOb2RlIHx8IHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPT0gJ2Z1bmN0aW9uJylcbiAgICAgICYmIHByb21pc2UudGhlbihlbXB0eSkgaW5zdGFuY2VvZiBGYWtlUHJvbWlzZVxuICAgICAgLy8gdjggNi42IChOb2RlIDEwIGFuZCBDaHJvbWUgNjYpIGhhdmUgYSBidWcgd2l0aCByZXNvbHZpbmcgY3VzdG9tIHRoZW5hYmxlc1xuICAgICAgLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9ODMwNTY1XG4gICAgICAvLyB3ZSBjYW4ndCBkZXRlY3QgaXQgc3luY2hyb25vdXNseSwgc28ganVzdCBjaGVjayB2ZXJzaW9uc1xuICAgICAgJiYgdjguaW5kZXhPZignNi42JykgIT09IDBcbiAgICAgICYmIHVzZXJBZ2VudC5pbmRleE9mKCdDaHJvbWUvNjYnKSA9PT0gLTE7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufSgpO1xuXG4vLyBoZWxwZXJzXG52YXIgaXNUaGVuYWJsZSA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgdGhlbjtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiB0eXBlb2YgKHRoZW4gPSBpdC50aGVuKSA9PSAnZnVuY3Rpb24nID8gdGhlbiA6IGZhbHNlO1xufTtcbnZhciBub3RpZnkgPSBmdW5jdGlvbiAocHJvbWlzZSwgaXNSZWplY3QpIHtcbiAgaWYgKHByb21pc2UuX24pIHJldHVybjtcbiAgcHJvbWlzZS5fbiA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHByb21pc2UuX2M7XG4gIG1pY3JvdGFzayhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdjtcbiAgICB2YXIgb2sgPSBwcm9taXNlLl9zID09IDE7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBydW4gPSBmdW5jdGlvbiAocmVhY3Rpb24pIHtcbiAgICAgIHZhciBoYW5kbGVyID0gb2sgPyByZWFjdGlvbi5vayA6IHJlYWN0aW9uLmZhaWw7XG4gICAgICB2YXIgcmVzb2x2ZSA9IHJlYWN0aW9uLnJlc29sdmU7XG4gICAgICB2YXIgcmVqZWN0ID0gcmVhY3Rpb24ucmVqZWN0O1xuICAgICAgdmFyIGRvbWFpbiA9IHJlYWN0aW9uLmRvbWFpbjtcbiAgICAgIHZhciByZXN1bHQsIHRoZW4sIGV4aXRlZDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmIChoYW5kbGVyKSB7XG4gICAgICAgICAgaWYgKCFvaykge1xuICAgICAgICAgICAgaWYgKHByb21pc2UuX2ggPT0gMikgb25IYW5kbGVVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgICAgICAgICBwcm9taXNlLl9oID0gMTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhbmRsZXIgPT09IHRydWUpIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRvbWFpbikgZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTsgLy8gbWF5IHRocm93XG4gICAgICAgICAgICBpZiAoZG9tYWluKSB7XG4gICAgICAgICAgICAgIGRvbWFpbi5leGl0KCk7XG4gICAgICAgICAgICAgIGV4aXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2UpIHtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoZG9tYWluICYmICFleGl0ZWQpIGRvbWFpbi5leGl0KCk7XG4gICAgICAgIHJlamVjdChlKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlIChjaGFpbi5sZW5ndGggPiBpKSBydW4oY2hhaW5baSsrXSk7IC8vIHZhcmlhYmxlIGxlbmd0aCAtIGNhbid0IHVzZSBmb3JFYWNoXG4gICAgcHJvbWlzZS5fYyA9IFtdO1xuICAgIHByb21pc2UuX24gPSBmYWxzZTtcbiAgICBpZiAoaXNSZWplY3QgJiYgIXByb21pc2UuX2gpIG9uVW5oYW5kbGVkKHByb21pc2UpO1xuICB9KTtcbn07XG52YXIgb25VbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gcHJvbWlzZS5fdjtcbiAgICB2YXIgdW5oYW5kbGVkID0gaXNVbmhhbmRsZWQocHJvbWlzZSk7XG4gICAgdmFyIHJlc3VsdCwgaGFuZGxlciwgY29uc29sZTtcbiAgICBpZiAodW5oYW5kbGVkKSB7XG4gICAgICByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGlzTm9kZSkge1xuICAgICAgICAgIHByb2Nlc3MuZW1pdCgndW5oYW5kbGVkUmVqZWN0aW9uJywgdmFsdWUsIHByb21pc2UpO1xuICAgICAgICB9IGVsc2UgaWYgKGhhbmRsZXIgPSBnbG9iYWwub251bmhhbmRsZWRyZWplY3Rpb24pIHtcbiAgICAgICAgICBoYW5kbGVyKHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiB2YWx1ZSB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgoY29uc29sZSA9IGdsb2JhbC5jb25zb2xlKSAmJiBjb25zb2xlLmVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcignVW5oYW5kbGVkIHByb21pc2UgcmVqZWN0aW9uJywgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIC8vIEJyb3dzZXJzIHNob3VsZCBub3QgdHJpZ2dlciBgcmVqZWN0aW9uSGFuZGxlZGAgZXZlbnQgaWYgaXQgd2FzIGhhbmRsZWQgaGVyZSwgTm9kZUpTIC0gc2hvdWxkXG4gICAgICBwcm9taXNlLl9oID0gaXNOb2RlIHx8IGlzVW5oYW5kbGVkKHByb21pc2UpID8gMiA6IDE7XG4gICAgfSBwcm9taXNlLl9hID0gdW5kZWZpbmVkO1xuICAgIGlmICh1bmhhbmRsZWQgJiYgcmVzdWx0LmUpIHRocm93IHJlc3VsdC52O1xuICB9KTtcbn07XG52YXIgaXNVbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICByZXR1cm4gcHJvbWlzZS5faCAhPT0gMSAmJiAocHJvbWlzZS5fYSB8fCBwcm9taXNlLl9jKS5sZW5ndGggPT09IDA7XG59O1xudmFyIG9uSGFuZGxlVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciBoYW5kbGVyO1xuICAgIGlmIChpc05vZGUpIHtcbiAgICAgIHByb2Nlc3MuZW1pdCgncmVqZWN0aW9uSGFuZGxlZCcsIHByb21pc2UpO1xuICAgIH0gZWxzZSBpZiAoaGFuZGxlciA9IGdsb2JhbC5vbnJlamVjdGlvbmhhbmRsZWQpIHtcbiAgICAgIGhhbmRsZXIoeyBwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHByb21pc2UuX3YgfSk7XG4gICAgfVxuICB9KTtcbn07XG52YXIgJHJlamVjdCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIGlmIChwcm9taXNlLl9kKSByZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICBwcm9taXNlLl9zID0gMjtcbiAgaWYgKCFwcm9taXNlLl9hKSBwcm9taXNlLl9hID0gcHJvbWlzZS5fYy5zbGljZSgpO1xuICBub3RpZnkocHJvbWlzZSwgdHJ1ZSk7XG59O1xudmFyICRyZXNvbHZlID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgdmFyIHRoZW47XG4gIGlmIChwcm9taXNlLl9kKSByZXR1cm47XG4gIHByb21pc2UuX2QgPSB0cnVlO1xuICBwcm9taXNlID0gcHJvbWlzZS5fdyB8fCBwcm9taXNlOyAvLyB1bndyYXBcbiAgdHJ5IHtcbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHRocm93IFR5cGVFcnJvcihcIlByb21pc2UgY2FuJ3QgYmUgcmVzb2x2ZWQgaXRzZWxmXCIpO1xuICAgIGlmICh0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpIHtcbiAgICAgIG1pY3JvdGFzayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB3cmFwcGVyID0geyBfdzogcHJvbWlzZSwgX2Q6IGZhbHNlIH07IC8vIHdyYXBcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eCgkcmVzb2x2ZSwgd3JhcHBlciwgMSksIGN0eCgkcmVqZWN0LCB3cmFwcGVyLCAxKSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAkcmVqZWN0LmNhbGwod3JhcHBlciwgZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBwcm9taXNlLl92ID0gdmFsdWU7XG4gICAgICBwcm9taXNlLl9zID0gMTtcbiAgICAgIG5vdGlmeShwcm9taXNlLCBmYWxzZSk7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgJHJlamVjdC5jYWxsKHsgX3c6IHByb21pc2UsIF9kOiBmYWxzZSB9LCBlKTsgLy8gd3JhcFxuICB9XG59O1xuXG4vLyBjb25zdHJ1Y3RvciBwb2x5ZmlsbFxuaWYgKCFVU0VfTkFUSVZFKSB7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gICRQcm9taXNlID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcikge1xuICAgIGFuSW5zdGFuY2UodGhpcywgJFByb21pc2UsIFBST01JU0UsICdfaCcpO1xuICAgIGFGdW5jdGlvbihleGVjdXRvcik7XG4gICAgSW50ZXJuYWwuY2FsbCh0aGlzKTtcbiAgICB0cnkge1xuICAgICAgZXhlY3V0b3IoY3R4KCRyZXNvbHZlLCB0aGlzLCAxKSwgY3R4KCRyZWplY3QsIHRoaXMsIDEpKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICRyZWplY3QuY2FsbCh0aGlzLCBlcnIpO1xuICAgIH1cbiAgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gIEludGVybmFsID0gZnVuY3Rpb24gUHJvbWlzZShleGVjdXRvcikge1xuICAgIHRoaXMuX2MgPSBbXTsgICAgICAgICAgICAgLy8gPC0gYXdhaXRpbmcgcmVhY3Rpb25zXG4gICAgdGhpcy5fYSA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSBjaGVja2VkIGluIGlzVW5oYW5kbGVkIHJlYWN0aW9uc1xuICAgIHRoaXMuX3MgPSAwOyAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcbiAgICB0aGlzLl9kID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIGRvbmVcbiAgICB0aGlzLl92ID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIHZhbHVlXG4gICAgdGhpcy5faCA9IDA7ICAgICAgICAgICAgICAvLyA8LSByZWplY3Rpb24gc3RhdGUsIDAgLSBkZWZhdWx0LCAxIC0gaGFuZGxlZCwgMiAtIHVuaGFuZGxlZFxuICAgIHRoaXMuX24gPSBmYWxzZTsgICAgICAgICAgLy8gPC0gbm90aWZ5XG4gIH07XG4gIEludGVybmFsLnByb3RvdHlwZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpKCRQcm9taXNlLnByb3RvdHlwZSwge1xuICAgIC8vIDI1LjQuNS4zIFByb21pc2UucHJvdG90eXBlLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgICAgdmFyIHJlYWN0aW9uID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoc3BlY2llc0NvbnN0cnVjdG9yKHRoaXMsICRQcm9taXNlKSk7XG4gICAgICByZWFjdGlvbi5vayA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlO1xuICAgICAgcmVhY3Rpb24uZmFpbCA9IHR5cGVvZiBvblJlamVjdGVkID09ICdmdW5jdGlvbicgJiYgb25SZWplY3RlZDtcbiAgICAgIHJlYWN0aW9uLmRvbWFpbiA9IGlzTm9kZSA/IHByb2Nlc3MuZG9tYWluIDogdW5kZWZpbmVkO1xuICAgICAgdGhpcy5fYy5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9hKSB0aGlzLl9hLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYgKHRoaXMuX3MpIG5vdGlmeSh0aGlzLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcmVhY3Rpb24ucHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIDI1LjQuNS4xIFByb21pc2UucHJvdG90eXBlLmNhdGNoKG9uUmVqZWN0ZWQpXG4gICAgJ2NhdGNoJzogZnVuY3Rpb24gKG9uUmVqZWN0ZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4odW5kZWZpbmVkLCBvblJlamVjdGVkKTtcbiAgICB9XG4gIH0pO1xuICBPd25Qcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvbWlzZSA9IG5ldyBJbnRlcm5hbCgpO1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgdGhpcy5yZXNvbHZlID0gY3R4KCRyZXNvbHZlLCBwcm9taXNlLCAxKTtcbiAgICB0aGlzLnJlamVjdCA9IGN0eCgkcmVqZWN0LCBwcm9taXNlLCAxKTtcbiAgfTtcbiAgbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUuZiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKEMpIHtcbiAgICByZXR1cm4gQyA9PT0gJFByb21pc2UgfHwgQyA9PT0gV3JhcHBlclxuICAgICAgPyBuZXcgT3duUHJvbWlzZUNhcGFiaWxpdHkoQylcbiAgICAgIDogbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7IFByb21pc2U6ICRQcm9taXNlIH0pO1xucmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKSgkUHJvbWlzZSwgUFJPTUlTRSk7XG5yZXF1aXJlKCcuL19zZXQtc3BlY2llcycpKFBST01JU0UpO1xuV3JhcHBlciA9IHJlcXVpcmUoJy4vX2NvcmUnKVtQUk9NSVNFXTtcblxuLy8gc3RhdGljc1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxuICByZWplY3Q6IGZ1bmN0aW9uIHJlamVjdChyKSB7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSh0aGlzKTtcbiAgICB2YXIgJCRyZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICAkJHJlamVjdChyKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKExJQlJBUlkgfHwgIVVTRV9OQVRJVkUpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmUoTElCUkFSWSAmJiB0aGlzID09PSBXcmFwcGVyID8gJFByb21pc2UgOiB0aGlzLCB4KTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICEoVVNFX05BVElWRSAmJiByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7XG4gICRQcm9taXNlLmFsbChpdGVyKVsnY2F0Y2gnXShlbXB0eSk7XG59KSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjEgUHJvbWlzZS5hbGwoaXRlcmFibGUpXG4gIGFsbDogZnVuY3Rpb24gYWxsKGl0ZXJhYmxlKSB7XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gICAgdmFyIHJlc29sdmUgPSBjYXBhYmlsaXR5LnJlc29sdmU7XG4gICAgdmFyIHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB2YWx1ZXMgPSBbXTtcbiAgICAgIHZhciBpbmRleCA9IDA7XG4gICAgICB2YXIgcmVtYWluaW5nID0gMTtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgdmFyICRpbmRleCA9IGluZGV4Kys7XG4gICAgICAgIHZhciBhbHJlYWR5Q2FsbGVkID0gZmFsc2U7XG4gICAgICAgIHZhbHVlcy5wdXNoKHVuZGVmaW5lZCk7XG4gICAgICAgIHJlbWFpbmluZysrO1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICBpZiAoYWxyZWFkeUNhbGxlZCkgcmV0dXJuO1xuICAgICAgICAgIGFscmVhZHlDYWxsZWQgPSB0cnVlO1xuICAgICAgICAgIHZhbHVlc1skaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lKSByZWplY3QocmVzdWx0LnYpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH0sXG4gIC8vIDI1LjQuNC40IFByb21pc2UucmFjZShpdGVyYWJsZSlcbiAgcmFjZTogZnVuY3Rpb24gcmFjZShpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGNhcGFiaWxpdHkucmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGlmIChyZXN1bHQuZSkgcmVqZWN0KHJlc3VsdC52KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciByZWdleHBFeGVjID0gcmVxdWlyZSgnLi9fcmVnZXhwLWV4ZWMnKTtcbnJlcXVpcmUoJy4vX2V4cG9ydCcpKHtcbiAgdGFyZ2V0OiAnUmVnRXhwJyxcbiAgcHJvdG86IHRydWUsXG4gIGZvcmNlZDogcmVnZXhwRXhlYyAhPT0gLy4vLmV4ZWNcbn0sIHtcbiAgZXhlYzogcmVnZXhwRXhlY1xufSk7XG4iLCIvLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFncygpXG5pZiAocmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAvLi9nLmZsYWdzICE9ICdnJykgcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZihSZWdFeHAucHJvdG90eXBlLCAnZmxhZ3MnLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiByZXF1aXJlKCcuL19mbGFncycpXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBhZHZhbmNlU3RyaW5nSW5kZXggPSByZXF1aXJlKCcuL19hZHZhbmNlLXN0cmluZy1pbmRleCcpO1xudmFyIHJlZ0V4cEV4ZWMgPSByZXF1aXJlKCcuL19yZWdleHAtZXhlYy1hYnN0cmFjdCcpO1xuXG4vLyBAQG1hdGNoIGxvZ2ljXG5yZXF1aXJlKCcuL19maXgtcmUtd2tzJykoJ21hdGNoJywgMSwgZnVuY3Rpb24gKGRlZmluZWQsIE1BVENILCAkbWF0Y2gsIG1heWJlQ2FsbE5hdGl2ZSkge1xuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLm1hdGNoYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLm1hdGNoXG4gICAgZnVuY3Rpb24gbWF0Y2gocmVnZXhwKSB7XG4gICAgICB2YXIgTyA9IGRlZmluZWQodGhpcyk7XG4gICAgICB2YXIgZm4gPSByZWdleHAgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogcmVnZXhwW01BVENIXTtcbiAgICAgIHJldHVybiBmbiAhPT0gdW5kZWZpbmVkID8gZm4uY2FsbChyZWdleHAsIE8pIDogbmV3IFJlZ0V4cChyZWdleHApW01BVENIXShTdHJpbmcoTykpO1xuICAgIH0sXG4gICAgLy8gYFJlZ0V4cC5wcm90b3R5cGVbQEBtYXRjaF1gIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUtQEBtYXRjaFxuICAgIGZ1bmN0aW9uIChyZWdleHApIHtcbiAgICAgIHZhciByZXMgPSBtYXliZUNhbGxOYXRpdmUoJG1hdGNoLCByZWdleHAsIHRoaXMpO1xuICAgICAgaWYgKHJlcy5kb25lKSByZXR1cm4gcmVzLnZhbHVlO1xuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuICAgICAgaWYgKCFyeC5nbG9iYWwpIHJldHVybiByZWdFeHBFeGVjKHJ4LCBTKTtcbiAgICAgIHZhciBmdWxsVW5pY29kZSA9IHJ4LnVuaWNvZGU7XG4gICAgICByeC5sYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIEEgPSBbXTtcbiAgICAgIHZhciBuID0gMDtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICB3aGlsZSAoKHJlc3VsdCA9IHJlZ0V4cEV4ZWMocngsIFMpKSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbWF0Y2hTdHIgPSBTdHJpbmcocmVzdWx0WzBdKTtcbiAgICAgICAgQVtuXSA9IG1hdGNoU3RyO1xuICAgICAgICBpZiAobWF0Y2hTdHIgPT09ICcnKSByeC5sYXN0SW5kZXggPSBhZHZhbmNlU3RyaW5nSW5kZXgoUywgdG9MZW5ndGgocngubGFzdEluZGV4KSwgZnVsbFVuaWNvZGUpO1xuICAgICAgICBuKys7XG4gICAgICB9XG4gICAgICByZXR1cm4gbiA9PT0gMCA/IG51bGwgOiBBO1xuICAgIH1cbiAgXTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xucmVxdWlyZSgnLi9lczYucmVnZXhwLmZsYWdzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciAkZmxhZ3MgPSByZXF1aXJlKCcuL19mbGFncycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyICR0b1N0cmluZyA9IC8uL1tUT19TVFJJTkddO1xuXG52YXIgZGVmaW5lID0gZnVuY3Rpb24gKGZuKSB7XG4gIHJlcXVpcmUoJy4vX3JlZGVmaW5lJykoUmVnRXhwLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmbiwgdHJ1ZSk7XG59O1xuXG4vLyAyMS4yLjUuMTQgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZygpXG5pZiAocmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7IHJldHVybiAkdG9TdHJpbmcuY2FsbCh7IHNvdXJjZTogJ2EnLCBmbGFnczogJ2InIH0pICE9ICcvYS9iJzsgfSkpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHZhciBSID0gYW5PYmplY3QodGhpcyk7XG4gICAgcmV0dXJuICcvJy5jb25jYXQoUi5zb3VyY2UsICcvJyxcbiAgICAgICdmbGFncycgaW4gUiA/IFIuZmxhZ3MgOiAhREVTQ1JJUFRPUlMgJiYgUiBpbnN0YW5jZW9mIFJlZ0V4cCA/ICRmbGFncy5jYWxsKFIpIDogdW5kZWZpbmVkKTtcbiAgfSk7XG4vLyBGRjQ0LSBSZWdFeHAjdG9TdHJpbmcgaGFzIGEgd3JvbmcgbmFtZVxufSBlbHNlIGlmICgkdG9TdHJpbmcubmFtZSAhPSBUT19TVFJJTkcpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBTRVQgPSAnU2V0JztcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoU0VULCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih2YWxpZGF0ZSh0aGlzLCBTRVQpLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBNRVRBID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWTtcbnZhciAkZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciB3a3NFeHQgPSByZXF1aXJlKCcuL193a3MtZXh0Jyk7XG52YXIgd2tzRGVmaW5lID0gcmVxdWlyZSgnLi9fd2tzLWRlZmluZScpO1xudmFyIGVudW1LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1rZXlzJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzLWFycmF5Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgX2NyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBnT1BORXh0ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4tZXh0Jyk7XG52YXIgJEdPUEQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpO1xudmFyICREUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BEID0gJEdPUEQuZjtcbnZhciBkUCA9ICREUC5mO1xudmFyIGdPUE4gPSBnT1BORXh0LmY7XG52YXIgJFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgJEpTT04gPSBnbG9iYWwuSlNPTjtcbnZhciBfc3RyaW5naWZ5ID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIEhJRERFTiA9IHdrcygnX2hpZGRlbicpO1xudmFyIFRPX1BSSU1JVElWRSA9IHdrcygndG9QcmltaXRpdmUnKTtcbnZhciBpc0VudW0gPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5Jyk7XG52YXIgQWxsU3ltYm9scyA9IHNoYXJlZCgnc3ltYm9scycpO1xudmFyIE9QU3ltYm9scyA9IHNoYXJlZCgnb3Atc3ltYm9scycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0W1BST1RPVFlQRV07XG52YXIgVVNFX05BVElWRSA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbic7XG52YXIgUU9iamVjdCA9IGdsb2JhbC5RT2JqZWN0O1xuLy8gRG9uJ3QgdXNlIHNldHRlcnMgaW4gUXQgU2NyaXB0LCBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMTczXG52YXIgc2V0dGVyID0gIVFPYmplY3QgfHwgIVFPYmplY3RbUFJPVE9UWVBFXSB8fCAhUU9iamVjdFtQUk9UT1RZUEVdLmZpbmRDaGlsZDtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0NSSVBUT1JTICYmICRmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBfY3JlYXRlKGRQKHt9LCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRQKHRoaXMsICdhJywgeyB2YWx1ZTogNyB9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uIChpdCwga2V5LCBEKSB7XG4gIHZhciBwcm90b0Rlc2MgPSBnT1BEKE9iamVjdFByb3RvLCBrZXkpO1xuICBpZiAocHJvdG9EZXNjKSBkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgZFAoaXQsIGtleSwgRCk7XG4gIGlmIChwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKSBkUChPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xufSA6IGRQO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9IF9jcmVhdGUoJFN5bWJvbFtQUk9UT1RZUEVdKTtcbiAgc3ltLl9rID0gdGFnO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gVVNFX05BVElWRSAmJiB0eXBlb2YgJFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgaW5zdGFuY2VvZiAkU3ltYm9sO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpIHtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90bykgJGRlZmluZVByb3BlcnR5KE9QU3ltYm9scywga2V5LCBEKTtcbiAgYW5PYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBhbk9iamVjdChEKTtcbiAgaWYgKGhhcyhBbGxTeW1ib2xzLCBrZXkpKSB7XG4gICAgaWYgKCFELmVudW1lcmFibGUpIHtcbiAgICAgIGlmICghaGFzKGl0LCBISURERU4pKSBkUChpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkgaXRbSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBEID0gX2NyZWF0ZShELCB7IGVudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpIH0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIGRQKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApIHtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpO1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0ga2V5cy5sZW5ndGg7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChsID4gaSkgJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCkge1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSkge1xuICB2YXIgRSA9IGlzRW51bS5jYWxsKHRoaXMsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpO1xuICBpZiAodGhpcyA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XSA/IEUgOiB0cnVlO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpIHtcbiAgaXQgPSB0b0lPYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBpZiAoaXQgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKSByZXR1cm47XG4gIHZhciBEID0gZ09QRChpdCwga2V5KTtcbiAgaWYgKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSkgRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCkge1xuICB2YXIgbmFtZXMgPSBnT1BOKHRvSU9iamVjdChpdCkpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBpID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIHtcbiAgICBpZiAoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOICYmIGtleSAhPSBNRVRBKSByZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpIHtcbiAgdmFyIElTX09QID0gaXQgPT09IE9iamVjdFByb3RvO1xuICB2YXIgbmFtZXMgPSBnT1BOKElTX09QID8gT1BTeW1ib2xzIDogdG9JT2JqZWN0KGl0KSk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGkgPSAwO1xuICB2YXIga2V5O1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkge1xuICAgIGlmIChoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYgKElTX09QID8gaGFzKE9iamVjdFByb3RvLCBrZXkpIDogdHJ1ZSkpIHJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYgKCFVU0VfTkFUSVZFKSB7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKSB0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvciEnKTtcbiAgICB2YXIgdGFnID0gdWlkKGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTtcbiAgICB2YXIgJHNldCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvKSAkc2V0LmNhbGwoT1BTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZiAoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSkgdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG4gICAgfTtcbiAgICBpZiAoREVTQ1JJUFRPUlMgJiYgc2V0dGVyKSBzZXRTeW1ib2xEZXNjKE9iamVjdFByb3RvLCB0YWcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCBzZXQ6ICRzZXQgfSk7XG4gICAgcmV0dXJuIHdyYXAodGFnKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEVdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgJEdPUEQuZiA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICREUC5mID0gJGRlZmluZVByb3BlcnR5O1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmYgPSBnT1BORXh0LmYgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpLmYgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJykuZiA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYgKERFU0NSSVBUT1JTICYmICFyZXF1aXJlKCcuL19saWJyYXJ5JykpIHtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxuXG4gIHdrc0V4dC5mID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gd3JhcCh3a3MobmFtZSkpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7IFN5bWJvbDogJFN5bWJvbCB9KTtcblxuZm9yICh2YXIgZXM2U3ltYm9scyA9IChcbiAgLy8gMTkuNC4yLjIsIDE5LjQuMi4zLCAxOS40LjIuNCwgMTkuNC4yLjYsIDE5LjQuMi44LCAxOS40LjIuOSwgMTkuNC4yLjEwLCAxOS40LjIuMTEsIDE5LjQuMi4xMiwgMTkuNC4yLjEzLCAxOS40LjIuMTRcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBqID0gMDsgZXM2U3ltYm9scy5sZW5ndGggPiBqOyl3a3MoZXM2U3ltYm9sc1tqKytdKTtcblxuZm9yICh2YXIgd2VsbEtub3duU3ltYm9scyA9ICRrZXlzKHdrcy5zdG9yZSksIGsgPSAwOyB3ZWxsS25vd25TeW1ib2xzLmxlbmd0aCA+IGs7KSB3a3NEZWZpbmUod2VsbEtub3duU3ltYm9sc1trKytdKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ1N5bWJvbCcsIHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihzeW0pIHtcbiAgICBpZiAoIWlzU3ltYm9sKHN5bSkpIHRocm93IFR5cGVFcnJvcihzeW0gKyAnIGlzIG5vdCBhIHN5bWJvbCEnKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gU3ltYm9sUmVnaXN0cnkpIGlmIChTeW1ib2xSZWdpc3RyeVtrZXldID09PSBzeW0pIHJldHVybiBrZXk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24gKCkgeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uICgpIHsgc2V0dGVyID0gZmFsc2U7IH1cbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuMiBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAkZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gMjQuMy4yIEpTT04uc3RyaW5naWZ5KHZhbHVlIFssIHJlcGxhY2VyIFssIHNwYWNlXV0pXG4kSlNPTiAmJiAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghVVNFX05BVElWRSB8fCAkZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7IGE6IFMgfSkgIT0gJ3t9JyB8fCBfc3RyaW5naWZ5KE9iamVjdChTKSkgIT0gJ3t9Jztcbn0pKSwgJ0pTT04nLCB7XG4gIHN0cmluZ2lmeTogZnVuY3Rpb24gc3RyaW5naWZ5KGl0KSB7XG4gICAgdmFyIGFyZ3MgPSBbaXRdO1xuICAgIHZhciBpID0gMTtcbiAgICB2YXIgcmVwbGFjZXIsICRyZXBsYWNlcjtcbiAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGkpIGFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgJHJlcGxhY2VyID0gcmVwbGFjZXIgPSBhcmdzWzFdO1xuICAgIGlmICghaXNPYmplY3QocmVwbGFjZXIpICYmIGl0ID09PSB1bmRlZmluZWQgfHwgaXNTeW1ib2woaXQpKSByZXR1cm47IC8vIElFOCByZXR1cm5zIHN0cmluZyBvbiB1bmRlZmluZWRcbiAgICBpZiAoIWlzQXJyYXkocmVwbGFjZXIpKSByZXBsYWNlciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mICRyZXBsYWNlciA9PSAnZnVuY3Rpb24nKSB2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgaWYgKCFpc1N5bWJvbCh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7XG4iLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ2FzeW5jSXRlcmF0b3InKTtcbiIsInZhciAkaXRlcmF0b3JzID0gcmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciBJVEVSQVRPUiA9IHdrcygnaXRlcmF0b3InKTtcbnZhciBUT19TVFJJTkdfVEFHID0gd2tzKCd0b1N0cmluZ1RhZycpO1xudmFyIEFycmF5VmFsdWVzID0gSXRlcmF0b3JzLkFycmF5O1xuXG52YXIgRE9NSXRlcmFibGVzID0ge1xuICBDU1NSdWxlTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIENTU1N0eWxlRGVjbGFyYXRpb246IGZhbHNlLFxuICBDU1NWYWx1ZUxpc3Q6IGZhbHNlLFxuICBDbGllbnRSZWN0TGlzdDogZmFsc2UsXG4gIERPTVJlY3RMaXN0OiBmYWxzZSxcbiAgRE9NU3RyaW5nTGlzdDogZmFsc2UsXG4gIERPTVRva2VuTGlzdDogdHJ1ZSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IGZhbHNlLFxuICBGaWxlTGlzdDogZmFsc2UsXG4gIEhUTUxBbGxDb2xsZWN0aW9uOiBmYWxzZSxcbiAgSFRNTENvbGxlY3Rpb246IGZhbHNlLFxuICBIVE1MRm9ybUVsZW1lbnQ6IGZhbHNlLFxuICBIVE1MU2VsZWN0RWxlbWVudDogZmFsc2UsXG4gIE1lZGlhTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIE1pbWVUeXBlQXJyYXk6IGZhbHNlLFxuICBOYW1lZE5vZGVNYXA6IGZhbHNlLFxuICBOb2RlTGlzdDogdHJ1ZSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogZmFsc2UsXG4gIFBsdWdpbjogZmFsc2UsXG4gIFBsdWdpbkFycmF5OiBmYWxzZSxcbiAgU1ZHTGVuZ3RoTGlzdDogZmFsc2UsXG4gIFNWR051bWJlckxpc3Q6IGZhbHNlLFxuICBTVkdQYXRoU2VnTGlzdDogZmFsc2UsXG4gIFNWR1BvaW50TGlzdDogZmFsc2UsXG4gIFNWR1N0cmluZ0xpc3Q6IGZhbHNlLFxuICBTVkdUcmFuc2Zvcm1MaXN0OiBmYWxzZSxcbiAgU291cmNlQnVmZmVyTGlzdDogZmFsc2UsXG4gIFN0eWxlU2hlZXRMaXN0OiB0cnVlLCAvLyBUT0RPOiBOb3Qgc3BlYyBjb21wbGlhbnQsIHNob3VsZCBiZSBmYWxzZS5cbiAgVGV4dFRyYWNrQ3VlTGlzdDogZmFsc2UsXG4gIFRleHRUcmFja0xpc3Q6IGZhbHNlLFxuICBUb3VjaExpc3Q6IGZhbHNlXG59O1xuXG5mb3IgKHZhciBjb2xsZWN0aW9ucyA9IGdldEtleXMoRE9NSXRlcmFibGVzKSwgaSA9IDA7IGkgPCBjb2xsZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICB2YXIgTkFNRSA9IGNvbGxlY3Rpb25zW2ldO1xuICB2YXIgZXhwbGljaXQgPSBET01JdGVyYWJsZXNbTkFNRV07XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgcHJvdG8gPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICB2YXIga2V5O1xuICBpZiAocHJvdG8pIHtcbiAgICBpZiAoIXByb3RvW0lURVJBVE9SXSkgaGlkZShwcm90bywgSVRFUkFUT1IsIEFycmF5VmFsdWVzKTtcbiAgICBpZiAoIXByb3RvW1RPX1NUUklOR19UQUddKSBoaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgICBJdGVyYXRvcnNbTkFNRV0gPSBBcnJheVZhbHVlcztcbiAgICBpZiAoZXhwbGljaXQpIGZvciAoa2V5IGluICRpdGVyYXRvcnMpIGlmICghcHJvdG9ba2V5XSkgcmVkZWZpbmUocHJvdG8sIGtleSwgJGl0ZXJhdG9yc1trZXldLCB0cnVlKTtcbiAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgUGFydGljbGVzXzEgPSByZXF1aXJlKFwiLi4vUGFydGljbGVzL1BhcnRpY2xlc1wiKTtcbnZhciBTdGFyc18xID0gcmVxdWlyZShcIi4vU3RhcnNcIik7XG52YXIgY2FudmFzID0gbmV3IFBhcnRpY2xlc18xLmRlZmF1bHQoJyNwYXJ0aWNsZXMnLCAnMmQnKTtcbmNhbnZhcy5zZXRQYXJ0aWNsZVNldHRpbmdzKFN0YXJzXzEuU3RhcnMuUGFydGljbGVzKTtcbmNhbnZhcy5zZXRJbnRlcmFjdGl2ZVNldHRpbmdzKFN0YXJzXzEuU3RhcnMuSW50ZXJhY3RpdmUpO1xuY2FudmFzLnN0YXJ0KCk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU3RhcnMgPSB7XG4gICAgUGFydGljbGVzOiB7XG4gICAgICAgIG51bWJlcjogMzUwLFxuICAgICAgICBkZW5zaXR5OiAyMDAsXG4gICAgICAgIGNvbG9yOiAnI0ZGRkZGRicsXG4gICAgICAgIG9wYWNpdHk6ICdyYW5kb20nLFxuICAgICAgICByYWRpdXM6IFsxLCAxLjUsIDIsIDIuNSwgMywgMy41XSxcbiAgICAgICAgc2hhcGU6ICdjaXJjbGUnLFxuICAgICAgICBzdHJva2U6IHtcbiAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJ1xuICAgICAgICB9LFxuICAgICAgICBtb3ZlOiB7XG4gICAgICAgICAgICBzcGVlZDogMC4yLFxuICAgICAgICAgICAgZGlyZWN0aW9uOiAncmFuZG9tJyxcbiAgICAgICAgICAgIHN0cmFpZ2h0OiBmYWxzZSxcbiAgICAgICAgICAgIHJhbmRvbTogdHJ1ZSxcbiAgICAgICAgICAgIGVkZ2VCb3VuY2U6IGZhbHNlLFxuICAgICAgICAgICAgYXR0cmFjdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICByZXNpemU6IHRydWUsXG4gICAgICAgICAgICBob3ZlcjogJ2J1YmJsZScsXG4gICAgICAgICAgICBjbGljazogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0ZToge1xuICAgICAgICAgICAgb3BhY2l0eToge1xuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjIsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIHN5bmM6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmFkaXVzOiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDMsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIHN5bmM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIEludGVyYWN0aXZlOiB7XG4gICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICBidWJibGU6IHtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogNzUsXG4gICAgICAgICAgICAgICAgcmFkaXVzOiA3LFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcclxuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcclxuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcclxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XHJcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cclxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbiAgICB9O1xyXG59KSgpO1xyXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vLi4vTW9kdWxlcy9ET01cIik7XG52YXIgRXZlbnREaXNwYXRjaGVyXzEgPSByZXF1aXJlKFwiLi4vLi4vTW9kdWxlcy9FdmVudERpc3BhdGNoZXJcIik7XG52YXIgTWVudSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKE1lbnUsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gTWVudSgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMub3BlbiA9IGZhbHNlO1xuICAgICAgICBfdGhpcy5Db250YWluZXIgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdoZWFkZXIubWVudScpO1xuICAgICAgICBfdGhpcy5IYW1idXJnZXIgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdoZWFkZXIubWVudSAuaGFtYnVyZ2VyJyk7XG4gICAgICAgIF90aGlzLnJlZ2lzdGVyKCd0b2dnbGUnKTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBNZW51LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMub3BlbiA9ICF0aGlzLm9wZW47XG4gICAgICAgIGlmICh0aGlzLm9wZW4pIHtcbiAgICAgICAgICAgIHRoaXMuQ29udGFpbmVyLnNldEF0dHJpYnV0ZSgnb3BlbicsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuQ29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZSgnb3BlbicpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZGlzcGF0Y2goJ3RvZ2dsZScsIHsgb3BlbjogdGhpcy5vcGVuIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIE1lbnU7XG59KEV2ZW50RGlzcGF0Y2hlcl8xLkV2ZW50cy5FdmVudERpc3BhdGNoZXIpKTtcbmV4cG9ydHMuTWVudSA9IE1lbnU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBTZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTZWN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB9XG4gICAgU2VjdGlvbi5wcm90b3R5cGUuaW5WaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYm91bmRpbmcgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciB2aWV3ID0gRE9NXzEuRE9NLmdldFZpZXdwb3J0KCk7XG4gICAgICAgIHJldHVybiBib3VuZGluZy5ib3R0b20gPj0gMCAmJlxuICAgICAgICAgICAgYm91bmRpbmcucmlnaHQgPj0gMCAmJlxuICAgICAgICAgICAgYm91bmRpbmcudG9wIDw9IHZpZXcuaGVpZ2h0ICYmXG4gICAgICAgICAgICBib3VuZGluZy5sZWZ0IDw9IHZpZXcud2lkdGg7XG4gICAgfTtcbiAgICBTZWN0aW9uLnByb3RvdHlwZS5nZXRJRCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pZDtcbiAgICB9O1xuICAgIHJldHVybiBTZWN0aW9uO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNlY3Rpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIGRlbGF5ID0gMTAwMDtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5DYW52YXNUZXh0LmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZWxvYWQnKTtcbiAgICAgICAgfSwgZGVsYXkgKiAoaSArIDEpKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgV2ViUGFnZV8xLkNhbnZhc1RleHQuY2hpbGRFbGVtZW50Q291bnQ7IGkrKykge1xuICAgICAgICBfbG9vcF8xKGkpO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICBpZiAoIURPTV8xLkRPTS5pc0lFKCkpIHtcbiAgICAgICAgV2ViUGFnZV8xLkxvZ28uT3V0ZXIuY2xhc3NMaXN0LnJlbW92ZSgncHJlbG9hZCcpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5Mb2dvLklubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZWxvYWQnKTtcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIFdlYlBhZ2VfMS5Mb2dvLk91dGVyLmNsYXNzTmFtZSA9ICdvdXRlcic7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgV2ViUGFnZV8xLkxvZ28uSW5uZXIuY2xhc3NOYW1lID0gJ2lubmVyJztcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG5XZWJQYWdlXzEuTmF2aWdhdGlvbi5zdWJzY3JpYmUoV2ViUGFnZV8xLk1haW4sIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5uYW1lID09PSAndG9nZ2xlJykge1xuICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLm9wZW4pIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5NYWluLnNldEF0dHJpYnV0ZSgnc2hpZnRlZCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5NYWluLnJlbW92ZUF0dHJpYnV0ZSgnc2hpZnRlZCcpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xuV2ViUGFnZV8xLk5hdmlnYXRpb24uSGFtYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIFdlYlBhZ2VfMS5OYXZpZ2F0aW9uLnRvZ2dsZSgpO1xufSk7XG5XZWJQYWdlXzEuTmF2aWdhdGlvbkFuY2hvcnMuZm9yRWFjaChmdW5jdGlvbiAoYW5jaG9yKSB7XG4gICAgYW5jaG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHZhciBkZXN0aW5hdGlvbiA9IFdlYlBhZ2VfMS5TZWN0aW9uc1t0aGlzLmdldEF0dHJpYnV0ZSgnaHJlZicpLnN1YnN0cigxKV07XG4gICAgICAgIGRlc3RpbmF0aW9uLmVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET007XG4oZnVuY3Rpb24gKERPTSkge1xuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRzKHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KTtcbiAgICB9XG4gICAgRE9NLmdldEVsZW1lbnRzID0gZ2V0RWxlbWVudHM7XG4gICAgZnVuY3Rpb24gZ2V0Rmlyc3RFbGVtZW50KHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEVsZW1lbnRzKHF1ZXJ5KVswXTtcbiAgICB9XG4gICAgRE9NLmdldEZpcnN0RWxlbWVudCA9IGdldEZpcnN0RWxlbWVudDtcbiAgICBmdW5jdGlvbiBnZXRWaWV3cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gICAgICAgIH07XG4gICAgfVxuICAgIERPTS5nZXRWaWV3cG9ydCA9IGdldFZpZXdwb3J0O1xuICAgIGZ1bmN0aW9uIHNjcm9sbFRvKHgsIHkpIHtcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKHtcbiAgICAgICAgICAgIHRvcDogeSxcbiAgICAgICAgICAgIGxlZnQ6IHgsXG4gICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIERPTS5zY3JvbGxUbyA9IHNjcm9sbFRvO1xuICAgIGZ1bmN0aW9uIGlzSUUoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKE1TSUV8VHJpZGVudCkvKSAhPT0gbnVsbDtcbiAgICB9XG4gICAgRE9NLmlzSUUgPSBpc0lFO1xuICAgIGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrXzEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFja18xKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2N1bWVudCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2FsbGJhY2tfMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBET00ubG9hZCA9IGxvYWQ7XG59KShET00gPSBleHBvcnRzLkRPTSB8fCAoZXhwb3J0cy5ET00gPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRXZlbnRzO1xuKGZ1bmN0aW9uIChFdmVudHMpIHtcbiAgICB2YXIgTmV3RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBOZXdFdmVudChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5kZXRhaWwgPSBkZXRhaWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE5ld0V2ZW50O1xuICAgIH0oKSk7XG4gICAgRXZlbnRzLk5ld0V2ZW50ID0gTmV3RXZlbnQ7XG4gICAgdmFyIEV2ZW50RGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5hZGQobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kZWxldGUobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uIChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuZXZlbnRzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBldmVudCA9IG5ldyBOZXdFdmVudChuYW1lLCBkZXRhaWwpO1xuICAgICAgICAgICAgdmFyIGl0ID0gdGhpcy5saXN0ZW5lcnMudmFsdWVzKCk7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICAgICAgICB3aGlsZSAoY2FsbGJhY2sgPSBpdC5uZXh0KCkudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RGlzcGF0Y2hlcjtcbiAgICB9KCkpO1xuICAgIEV2ZW50cy5FdmVudERpc3BhdGNoZXIgPSBFdmVudERpc3BhdGNoZXI7XG59KShFdmVudHMgPSBleHBvcnRzLkV2ZW50cyB8fCAoZXhwb3J0cy5FdmVudHMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU1ZHO1xuKGZ1bmN0aW9uIChTVkcpIHtcbiAgICBTVkcuc3ZnbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuICAgIFNWRy54bGlua25zID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xufSkoU1ZHID0gZXhwb3J0cy5TVkcgfHwgKGV4cG9ydHMuU1ZHID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4vRE9NXCIpO1xudmFyIFNlY3Rpb25fMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1NlY3Rpb25cIik7XG52YXIgTWVudV8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvTWVudVwiKTtcbmV4cG9ydHMuTWFpbiA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ21haW4nKTtcbmV4cG9ydHMuTG9nbyA9IHtcbiAgICBPdXRlcjogRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnaGVhZGVyLmxvZ28gLmltYWdlIGltZy5vdXRlcicpLFxuICAgIElubmVyOiBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdoZWFkZXIubG9nbyAuaW1hZ2UgaW1nLmlubmVyJylcbn07XG5leHBvcnRzLkNhbnZhc1RleHQgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdkaXYuY2FudmFzIGRpdi5jYW52YXMtdGV4dC1jb250YWluZXInKTtcbmV4cG9ydHMuTmF2aWdhdGlvbiA9IG5ldyBNZW51XzEuTWVudSgpO1xuZXhwb3J0cy5OYXZpZ2F0aW9uQW5jaG9ycyA9IERPTV8xLkRPTS5nZXRFbGVtZW50cygnaGVhZGVyLm5hdmlnYXRpb24gLnNlY3Rpb25zIGEnKTtcbmV4cG9ydHMuU2VjdGlvbnMgPSB7fTtcbmZvciAodmFyIF9pID0gMCwgX2EgPSBBcnJheS5mcm9tKERPTV8xLkRPTS5nZXRFbGVtZW50cygnc2VjdGlvbicpKTsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICB2YXIgZWxlbWVudCA9IF9hW19pXTtcbiAgICBleHBvcnRzLlNlY3Rpb25zW2VsZW1lbnQuaWRdID0gbmV3IFNlY3Rpb25fMS5kZWZhdWx0KGVsZW1lbnQpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQW5pbWF0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBbmltYXRpb24oc3BlZWQsIG1heCwgbWluLCBpbmNyZWFzaW5nKSB7XG4gICAgICAgIGlmIChpbmNyZWFzaW5nID09PSB2b2lkIDApIHsgaW5jcmVhc2luZyA9IGZhbHNlOyB9XG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICAgICAgdGhpcy5tYXggPSBtYXg7XG4gICAgICAgIHRoaXMubWluID0gbWluO1xuICAgICAgICB0aGlzLmluY3JlYXNpbmcgPSBpbmNyZWFzaW5nO1xuICAgIH1cbiAgICByZXR1cm4gQW5pbWF0aW9uO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEFuaW1hdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zO1xuKGZ1bmN0aW9uIChBbmltYXRpb25GcmFtZUZ1bmN0aW9ucykge1xuICAgIGZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICAgICAgICAgIH07XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICBmdW5jdGlvbiBjYW5jZWxBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQ7XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG59KShBbmltYXRpb25GcmFtZUZ1bmN0aW9ucyA9IGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgfHwgKGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbG9yKHIsIGcsIGIpIHtcbiAgICAgICAgdGhpcy5yID0gcjtcbiAgICAgICAgdGhpcy5nID0gZztcbiAgICAgICAgdGhpcy5iID0gYjtcbiAgICB9XG4gICAgQ29sb3IuZnJvbVJHQiA9IGZ1bmN0aW9uIChyLCBnLCBiKSB7XG4gICAgICAgIGlmIChyID49IDAgJiYgciA8IDI1NiAmJiBnID49IDAgJiYgZyA8IDI1NiAmJiBiID49IDAgJiYgYiA8IDI1Nikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb2xvci5mcm9tT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gQ29sb3IuZnJvbVJHQihvYmouciwgb2JqLmcsIG9iai5iKTtcbiAgICB9O1xuICAgIENvbG9yLmZyb21IZXggPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHJldHVybiBDb2xvci5mcm9tT2JqZWN0KENvbG9yLmhleFRvUkdCKGhleCkpO1xuICAgIH07XG4gICAgQ29sb3IuaGV4VG9SR0IgPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHZhciByZXN1bHQgPSAvXiMoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICAgICAgICByZXR1cm4gcmVzdWx0ID8ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gICAgICAgIH0gOiBudWxsO1xuICAgIH07XG4gICAgQ29sb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKG9wYWNpdHkgPT09IHZvaWQgMCkgeyBvcGFjaXR5ID0gMTsgfVxuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgdGhpcy5yICsgXCIsXCIgKyB0aGlzLmcgKyBcIixcIiArIHRoaXMuYiArIFwiLFwiICsgb3BhY2l0eSArIFwiKVwiO1xuICAgIH07XG4gICAgcmV0dXJuIENvbG9yO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29vcmRpbmF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29vcmRpbmF0ZSh4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIENvb3JkaW5hdGUucHJvdG90eXBlLmRpc3RhbmNlID0gZnVuY3Rpb24gKGNvb3JkKSB7XG4gICAgICAgIHZhciBkeCA9IGNvb3JkLnggLSB0aGlzLng7XG4gICAgICAgIHZhciBkeSA9IGNvb3JkLnkgLSB0aGlzLnk7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIH07XG4gICAgQ29vcmRpbmF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKyBcInhcIiArIHRoaXMueTtcbiAgICB9O1xuICAgIHJldHVybiBDb29yZGluYXRlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvb3JkaW5hdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbl8xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uXCIpO1xudmFyIENvbG9yXzEgPSByZXF1aXJlKFwiLi9Db2xvclwiKTtcbnZhciBDb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9Db29yZGluYXRlXCIpO1xudmFyIFN0cm9rZV8xID0gcmVxdWlyZShcIi4vU3Ryb2tlXCIpO1xudmFyIFZlY3Rvcl8xID0gcmVxdWlyZShcIi4vVmVjdG9yXCIpO1xudmFyIFBhcnRpY2xlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZShzZXR0aW5ncykge1xuICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmNyZWF0ZUNvbG9yKHNldHRpbmdzLmNvbG9yKTtcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gdGhpcy5jcmVhdGVPcGFjaXR5KHNldHRpbmdzLm9wYWNpdHkpO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdGhpcy5jcmVhdGVWZWxvY2l0eShzZXR0aW5ncy5tb3ZlKTtcbiAgICAgICAgdGhpcy5zaGFwZSA9IHRoaXMuY3JlYXRlU2hhcGUoc2V0dGluZ3Muc2hhcGUpO1xuICAgICAgICB0aGlzLnN0cm9rZSA9IHRoaXMuY3JlYXRlU3Ryb2tlKHNldHRpbmdzLnN0cm9rZSk7XG4gICAgICAgIHRoaXMucmFkaXVzID0gdGhpcy5jcmVhdGVSYWRpdXMoc2V0dGluZ3MucmFkaXVzKTtcbiAgICAgICAgaWYgKHNldHRpbmdzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSB0aGlzLmFuaW1hdGVPcGFjaXR5KHNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZVJhZGl1cyhzZXR0aW5ncy5hbmltYXRlLnJhZGl1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idWJibGVkID0ge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIHJhZGl1czogMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlQ29sb3IgPSBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21SR0IoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21IZXgoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yXzEuZGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbG9yIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVDb2xvcihjb2xvcltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvci5sZW5ndGgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21PYmplY3QoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDb2xvcl8xLmRlZmF1bHQuZnJvbVJHQigwLCAwLCAwKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVPcGFjaXR5ID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9wYWNpdHkob3BhY2l0eVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvcGFjaXR5Lmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChvcGFjaXR5ID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZVZlbG9jaXR5ID0gZnVuY3Rpb24gKG1vdmUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtb3ZlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgbW92ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB2ZWxvY2l0eSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHN3aXRjaCAobW92ZS5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wLXJpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLjcsIC0wLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbS1yaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMC43LCAwLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20tbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTEsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AtbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgLTAuNyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdmUuc3RyYWlnaHQpIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5yYW5kb20pIHtcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkueCAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eS55ICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmVsb2NpdHkueCArPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICAgICAgICAgIHZlbG9jaXR5LnkgKz0gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2ZWxvY2l0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlU2hhcGUgPSBmdW5jdGlvbiAoc2hhcGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2hhcGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2hhcGUubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBzaWRlcyA9IHBhcnNlSW50KHNoYXBlLnN1YnN0cmluZygwLCBzaGFwZS5pbmRleE9mKCctJykpKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4oc2lkZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2lkZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSA+PSAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnY2lyY2xlJztcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVTdHJva2UgPSBmdW5jdGlvbiAoc3Ryb2tlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3Ryb2tlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHJva2Uud2lkdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cm9rZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KHN0cm9rZS53aWR0aCwgdGhpcy5jcmVhdGVDb2xvcihzdHJva2UuY29sb3IpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KDAsIENvbG9yXzEuZGVmYXVsdC5mcm9tUkdCKDAsIDAsIDApKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVSYWRpdXMgPSBmdW5jdGlvbiAocmFkaXVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmFkaXVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHJhZGl1cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUmFkaXVzKHJhZGl1c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYWRpdXMubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFkaXVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiA1O1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLnBhcnNlU3BlZWQgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNwZWVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwLjU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZU9wYWNpdHkgPSBmdW5jdGlvbiAoYW5pbWF0aW9uKSB7XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICAgIHZhciBtYXggPSB0aGlzLm9wYWNpdHk7XG4gICAgICAgICAgICB2YXIgbWluID0gdGhpcy5jcmVhdGVPcGFjaXR5KGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZVJhZGl1cyA9IGZ1bmN0aW9uIChhbmltYXRpb24pIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgICAgdmFyIG1heCA9IHRoaXMucmFkaXVzO1xuICAgICAgICAgICAgdmFyIG1pbiA9IHRoaXMuY3JlYXRlUmFkaXVzKGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIHNwZWVkO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogc3BlZWQ7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZ2V0UmFkaXVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYWRpdXMgKyB0aGlzLmJ1YmJsZWQucmFkaXVzO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmdldE9wYWNpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHkgKyB0aGlzLmJ1YmJsZWQub3BhY2l0eTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5lZGdlID0gZnVuY3Rpb24gKGRpcikge1xuICAgICAgICBzd2l0Y2ggKGRpcikge1xuICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55IC0gdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLmdldFJhZGl1cygpLCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCAtIHRoaXMuZ2V0UmFkaXVzKCksIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuaW50ZXJzZWN0aW5nID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmRpc3RhbmNlKHBhcnRpY2xlLnBvc2l0aW9uKSA8IHRoaXMuZ2V0UmFkaXVzKCkgKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5idWJibGUgPSBmdW5jdGlvbiAobW91c2UsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMucG9zaXRpb24uZGlzdGFuY2UobW91c2UucG9zaXRpb24pO1xuICAgICAgICB2YXIgcmF0aW8gPSAxIC0gZGlzdGFuY2UgLyBzZXR0aW5ncy5kaXN0YW5jZTtcbiAgICAgICAgaWYgKHJhdGlvID49IDAgJiYgbW91c2Uub3Zlcikge1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLm9wYWNpdHkgPSByYXRpbyAqIChzZXR0aW5ncy5vcGFjaXR5IC0gdGhpcy5vcGFjaXR5KTtcbiAgICAgICAgICAgIHRoaXMuYnViYmxlZC5yYWRpdXMgPSByYXRpbyAqIChzZXR0aW5ncy5yYWRpdXMgLSB0aGlzLnJhZGl1cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQucmFkaXVzID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFBhcnRpY2xlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBhcnRpY2xlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb25GcmFtZUZ1bmN0aW9uc18xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNcIik7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgQ29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vQ29vcmRpbmF0ZVwiKTtcbnZhciBQYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vUGFydGljbGVcIik7XG52YXIgUGFydGljbGVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZXMoY3NzUXVlcnksIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gZmFsc2U7XG4gICAgICAgIHRoaXMucGl4ZWxSYXRpb0xpbWl0ID0gODtcbiAgICAgICAgdGhpcy5waXhlbFJhdGlvID0gMTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgdGhpcy5tb3VzZSA9IHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoMCwgMCksXG4gICAgICAgICAgICBvdmVyOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KGNzc1F1ZXJ5KTtcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNhbnZhcyBJRCBcIiArIGNzc1F1ZXJ5ICsgXCIgbm90IGZvdW5kLlwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChjb250ZXh0KTtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXzEuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCk7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXzEuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMuY2FuY2VsQW5pbWF0aW9uRnJhbWUoKTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzID0ge1xuICAgICAgICAgICAgbnVtYmVyOiAzNTAsXG4gICAgICAgICAgICBkZW5zaXR5OiAxMDAwLFxuICAgICAgICAgICAgY29sb3I6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICByYWRpdXM6IDUsXG4gICAgICAgICAgICBzaGFwZTogJ2NpcmNsZScsXG4gICAgICAgICAgICBzdHJva2U6IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW92ZToge1xuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjQsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAnYm90dG9tJyxcbiAgICAgICAgICAgICAgICBzdHJhaWdodDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByYW5kb206IHRydWUsXG4gICAgICAgICAgICAgICAgZWRnZUJvdW5jZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXR0cmFjdDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgICByZXNpemU6IHRydWUsXG4gICAgICAgICAgICAgICAgaG92ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNsaWNrOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGU6IHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByYWRpdXM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICAgICAgYnViYmxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiA3NSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA3LFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXB1bHNlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAxMDAsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsaWNrOiB7XG4gICAgICAgICAgICAgICAgYWRkOiB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlcjogNFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVtb3ZlOiB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlcjogMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRyYWNrTW91c2UoKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+PSB0aGlzLnBpeGVsUmF0aW9MaW1pdCA/IHRoaXMucGl4ZWxSYXRpb0xpbWl0IC0gMiA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgdGhpcy5zZXRDYW52YXNTaXplKCk7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVQYXJ0aWNsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgdGhpcy5kaXN0cmlidXRlUGFydGljbGVzKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnRyYWNrTW91c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuaG92ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2UucG9zaXRpb24ueCA9IGV2ZW50Lm9mZnNldFggKiBfdGhpcy5waXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi55ID0gZXZlbnQub2Zmc2V0WSAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLm92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi55ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2Uub3ZlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuY2xpY2spIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQgPSB0cnVlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5pbml0aWFsaXplUGl4ZWxSYXRpbyA9IGZ1bmN0aW9uIChuZXdSYXRpbykge1xuICAgICAgICBpZiAobmV3UmF0aW8gPT09IHZvaWQgMCkgeyBuZXdSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvOyB9XG4gICAgICAgIHZhciBtdWx0aXBsaWVyID0gbmV3UmF0aW8gLyB0aGlzLnBpeGVsUmF0aW87XG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCAqIG11bHRpcGxpZXI7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0ICogbXVsdGlwbGllcjtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyA9IHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMubWFwKGZ1bmN0aW9uIChyKSB7IHJldHVybiByICogbXVsdGlwbGllcjsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuc3BlZWQgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUgJiYgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUucmFkaXVzKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMuc3BlZWQgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5idWJibGUucmFkaXVzICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZS5kaXN0YW5jZSAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5yZXB1bHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLnJlcHVsc2UuZGlzdGFuY2UgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBpeGVsUmF0aW8gPSBuZXdSYXRpbztcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuY2hlY2tab29tID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8gIT09IHRoaXMucGl4ZWxSYXRpbyAmJiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA8IHRoaXMucGl4ZWxSYXRpb0xpbWl0KSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BEcmF3aW5nKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldENhbnZhc1NpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzICYmIHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMucmVzaXplKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaGVja1pvb20oKTtcbiAgICAgICAgICAgICAgICBfdGhpcy53aWR0aCA9IF90aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgX3RoaXMuaGVpZ2h0ID0gX3RoaXMuY2FudmFzLm9mZnNldEhlaWdodCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FudmFzLndpZHRoID0gX3RoaXMud2lkdGg7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FudmFzLmhlaWdodCA9IF90aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICBpZiAoIV90aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZW1vdmVQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY3JlYXRlUGFydGljbGVzKCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRyYXdQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMuZGlzdHJpYnV0ZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZ2V0RmlsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LmZpbGxTdHlsZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0U3Ryb2tlID0gZnVuY3Rpb24gKHN0cm9rZSkge1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZS5jb2xvci50b1N0cmluZygpO1xuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBzdHJva2Uud2lkdGg7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZHJhd1BhcnRpY2xlcygpO1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0b3BEcmF3aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5oYW5kbGVSZXNpemUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQb2x5Z29uID0gZnVuY3Rpb24gKGNlbnRlciwgcmFkaXVzLCBzaWRlcykge1xuICAgICAgICB2YXIgZGlhZ29uYWxBbmdsZSA9IDM2MCAvIHNpZGVzO1xuICAgICAgICBkaWFnb25hbEFuZ2xlICo9IE1hdGguUEkgLyAxODA7XG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZShjZW50ZXIueCwgY2VudGVyLnkpO1xuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoZGlhZ29uYWxBbmdsZSAvIChzaWRlcyAlIDIgPyA0IDogMikpO1xuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8ocmFkaXVzLCAwKTtcbiAgICAgICAgdmFyIGFuZ2xlO1xuICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IHNpZGVzOyBzKyspIHtcbiAgICAgICAgICAgIGFuZ2xlID0gcyAqIGRpYWdvbmFsQW5nbGU7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8ocmFkaXVzICogTWF0aC5jb3MoYW5nbGUpLCByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kcmF3UGFydGljbGUgPSBmdW5jdGlvbiAocGFydGljbGUpIHtcbiAgICAgICAgdmFyIG9wYWNpdHkgPSBwYXJ0aWNsZS5nZXRPcGFjaXR5KCk7XG4gICAgICAgIHZhciByYWRpdXMgPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgdGhpcy5zZXRGaWxsKHBhcnRpY2xlLmNvbG9yLnRvU3RyaW5nKG9wYWNpdHkpKTtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmICh0eXBlb2YgKHBhcnRpY2xlLnNoYXBlKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1BvbHlnb24ocGFydGljbGUucG9zaXRpb24sIHJhZGl1cywgcGFydGljbGUuc2hhcGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoIChwYXJ0aWNsZS5zaGFwZSkge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdHguYXJjKHBhcnRpY2xlLnBvc2l0aW9uLngsIHBhcnRpY2xlLnBvc2l0aW9uLnksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGlmIChwYXJ0aWNsZS5zdHJva2Uud2lkdGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0cm9rZShwYXJ0aWNsZS5zdHJva2UpO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5nZXROZXdQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdChNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXMud2lkdGgsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLmVkZ2VCb3VuY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPCAwKVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ICs9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA+IHRoaXMud2lkdGgpXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggLT0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3RvcCcpLnkgPCAwKVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ICs9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPiB0aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSAtPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZGlzdHJpYnV0ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5kZW5zaXR5ICYmIHR5cGVvZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHkpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIGFyZWEgPSB0aGlzLmNhbnZhcy53aWR0aCAqIHRoaXMuY2FudmFzLmhlaWdodCAvIDEwMDA7XG4gICAgICAgICAgICBhcmVhIC89IHRoaXMucGl4ZWxSYXRpbyAqIDI7XG4gICAgICAgICAgICB2YXIgcGFydGljbGVzUGVyQXJlYSA9IGFyZWEgKiB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubnVtYmVyIC8gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHk7XG4gICAgICAgICAgICB2YXIgbWlzc2luZyA9IHBhcnRpY2xlc1BlckFyZWEgLSB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobWlzc2luZyA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVBhcnRpY2xlcyhtaXNzaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlUGFydGljbGVzKE1hdGguYWJzKG1pc3NpbmcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jcmVhdGVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAobnVtYmVyLCBwb3NpdGlvbikge1xuICAgICAgICBpZiAobnVtYmVyID09PSB2b2lkIDApIHsgbnVtYmVyID0gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm51bWJlcjsgfVxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHZvaWQgMCkgeyBwb3NpdGlvbiA9IG51bGw7IH1cbiAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlU2V0dGluZ3MpXG4gICAgICAgICAgICB0aHJvdyAnUGFydGljbGUgc2V0dGluZ3MgbXVzdCBiZSBpbml0YWxpemVkIGJlZm9yZSBhIHBhcnRpY2xlIGlzIGNyZWF0ZWQuJztcbiAgICAgICAgdmFyIHBhcnRpY2xlO1xuICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IG51bWJlcjsgcCsrKSB7XG4gICAgICAgICAgICBwYXJ0aWNsZSA9IG5ldyBQYXJ0aWNsZV8xLmRlZmF1bHQodGhpcy5wYXJ0aWNsZVNldHRpbmdzKTtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24odGhpcy5nZXROZXdQb3NpdGlvbigpKTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlICghdGhpcy5jaGVja1Bvc2l0aW9uKHBhcnRpY2xlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5yZW1vdmVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPT09IHZvaWQgMCkgeyBudW1iZXIgPSBudWxsOyB9XG4gICAgICAgIGlmICghbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMuc3BsaWNlKDAsIG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUudXBkYXRlUGFydGljbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5wYXJ0aWNsZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFydGljbGUgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZS5tb3ZlKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLnNwZWVkKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLmVkZ2VCb3VuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLndpZHRoICsgcGFydGljbGUuZ2V0UmFkaXVzKCksIE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ2xlZnQnKS54ID4gdGhpcy53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KC0xICogcGFydGljbGUuZ2V0UmFkaXVzKCksIE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdib3R0b20nKS55IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCArIHBhcnRpY2xlLmdldFJhZGl1cygpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgndG9wJykueSA+IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGgsIC0xICogcGFydGljbGUuZ2V0UmFkaXVzKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPCAwIHx8IHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnZlbG9jaXR5LmZsaXAodHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCd0b3AnKS55IDwgMCB8fCBwYXJ0aWNsZS5lZGdlKCdib3R0b20nKS55ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnZlbG9jaXR5LmZsaXAoZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPj0gcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPD0gcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eSArPSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLnNwZWVkICogKHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA/IDEgOiAtMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5vcGFjaXR5IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLnJhZGl1cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUucmFkaXVzID49IHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUucmFkaXVzIDw9IHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5yYWRpdXMgKz0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLnNwZWVkICogKHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID8gMSA6IC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLnJhZGl1cyA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1cyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzLmhvdmVyID09PSAnYnViYmxlJyAmJiB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIgJiYgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5idWJibGUodGhpcy5tb3VzZSwgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQYXJ0aWNsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMucGFydGljbGVzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gX2FbX2ldO1xuICAgICAgICAgICAgdGhpcy5kcmF3UGFydGljbGUocGFydGljbGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldFBhcnRpY2xlU2V0dGluZ3MgPSBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjaGFuZ2Ugc2V0dGluZ3Mgd2hpbGUgQ2FudmFzIGlzIHJ1bm5pbmcuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldEludGVyYWN0aXZlU2V0dGluZ3MgPSBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMucnVubmluZykge1xuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjaGFuZ2Ugc2V0dGluZ3Mgd2hpbGUgQ2FudmFzIGlzIHJ1bm5pbmcuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgJ1BhcnRpY2xlIHNldHRpbmdzIG11c3QgYmUgaW5pdGFsaXplZCBiZWZvcmUgQ2FudmFzIGNhbiBzdGFydC4nO1xuICAgICAgICBpZiAodGhpcy5ydW5uaW5nKVxuICAgICAgICAgICAgdGhyb3cgJ0NhbnZhcyBpcyBhbHJlYWR5IHJ1bm5pbmcuJztcbiAgICAgICAgdGhpcy5ydW5uaW5nID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gICAgcmV0dXJuIFBhcnRpY2xlcztcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBQYXJ0aWNsZXM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBTdHJva2UgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFN0cm9rZSh3aWR0aCwgY29sb3IpIHtcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgfVxuICAgIHJldHVybiBTdHJva2U7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gU3Ryb2tlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgVmVjdG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBWZWN0b3IoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBWZWN0b3IucHJvdG90eXBlLmZsaXAgPSBmdW5jdGlvbiAoeCwgeSkge1xuICAgICAgICBpZiAoeCA9PT0gdm9pZCAwKSB7IHggPSB0cnVlOyB9XG4gICAgICAgIGlmICh5ID09PSB2b2lkIDApIHsgeSA9IHRydWU7IH1cbiAgICAgICAgaWYgKHgpIHtcbiAgICAgICAgICAgIHRoaXMueCAqPSAtMTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoeSkge1xuICAgICAgICAgICAgdGhpcy55ICo9IC0xO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLm1hZ25pdHVkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCgodGhpcy54ICogdGhpcy54KSArICh0aGlzLnkgKiB0aGlzLnkpKTtcbiAgICB9O1xuICAgIFZlY3Rvci5wcm90b3R5cGUuYW5nbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnRhbih0aGlzLnkgLyB0aGlzLngpO1xuICAgIH07XG4gICAgcmV0dXJuIFZlY3Rvcjtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBWZWN0b3I7XG4iXX0=
