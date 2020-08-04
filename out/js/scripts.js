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

},{"./_hide":34,"./_wks":99}],3:[function(require,module,exports){
'use strict';
var at = require('./_string-at')(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

},{"./_string-at":82}],4:[function(require,module,exports){
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

},{"./_is-object":42}],6:[function(require,module,exports){
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

},{"./_to-absolute-index":88,"./_to-length":91,"./_to-object":92}],7:[function(require,module,exports){
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

},{"./_to-absolute-index":88,"./_to-iobject":90,"./_to-length":91}],8:[function(require,module,exports){
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

},{"./_array-species-create":11,"./_ctx":19,"./_iobject":39,"./_to-length":91,"./_to-object":92}],9:[function(require,module,exports){
var aFunction = require('./_a-function');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var toLength = require('./_to-length');

module.exports = function (that, callbackfn, aLen, memo, isRight) {
  aFunction(callbackfn);
  var O = toObject(that);
  var self = IObject(O);
  var length = toLength(O.length);
  var index = isRight ? length - 1 : 0;
  var i = isRight ? -1 : 1;
  if (aLen < 2) for (;;) {
    if (index in self) {
      memo = self[index];
      index += i;
      break;
    }
    index += i;
    if (isRight ? index < 0 : length <= index) {
      throw TypeError('Reduce of empty array with no initial value');
    }
  }
  for (;isRight ? index >= 0 : length > index; index += i) if (index in self) {
    memo = callbackfn(memo, self[index], index, O);
  }
  return memo;
};

},{"./_a-function":1,"./_iobject":39,"./_to-length":91,"./_to-object":92}],10:[function(require,module,exports){
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

},{"./_is-array":41,"./_is-object":42,"./_wks":99}],11:[function(require,module,exports){
// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = require('./_array-species-constructor');

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};

},{"./_array-species-constructor":10}],12:[function(require,module,exports){
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

},{"./_a-function":1,"./_invoke":38,"./_is-object":42}],13:[function(require,module,exports){
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

},{"./_cof":14,"./_wks":99}],14:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],15:[function(require,module,exports){
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

},{"./_an-instance":4,"./_ctx":19,"./_descriptors":21,"./_for-of":30,"./_iter-define":46,"./_iter-step":48,"./_meta":51,"./_object-create":55,"./_object-dp":56,"./_redefine-all":71,"./_set-species":76,"./_validate-collection":96}],16:[function(require,module,exports){
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

},{"./_an-instance":4,"./_export":25,"./_fails":27,"./_for-of":30,"./_global":32,"./_inherit-if-required":37,"./_is-object":42,"./_iter-detect":47,"./_meta":51,"./_redefine":72,"./_redefine-all":71,"./_set-to-string-tag":77}],17:[function(require,module,exports){
var core = module.exports = { version: '2.6.5' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],18:[function(require,module,exports){
'use strict';
var $defineProperty = require('./_object-dp');
var createDesc = require('./_property-desc');

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};

},{"./_object-dp":56,"./_property-desc":70}],19:[function(require,module,exports){
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

},{"./_a-function":1}],20:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],21:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":27}],22:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":32,"./_is-object":42}],23:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],24:[function(require,module,exports){
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

},{"./_object-gops":61,"./_object-keys":64,"./_object-pie":65}],25:[function(require,module,exports){
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

},{"./_core":17,"./_ctx":19,"./_global":32,"./_hide":34,"./_redefine":72}],26:[function(require,module,exports){
var MATCH = require('./_wks')('match');
module.exports = function (KEY) {
  var re = /./;
  try {
    '/./'[KEY](re);
  } catch (e) {
    try {
      re[MATCH] = false;
      return !'/./'[KEY](re);
    } catch (f) { /* empty */ }
  } return true;
};

},{"./_wks":99}],27:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],28:[function(require,module,exports){
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

},{"./_defined":20,"./_fails":27,"./_hide":34,"./_redefine":72,"./_regexp-exec":74,"./_wks":99,"./es6.regexp.exec":123}],29:[function(require,module,exports){
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

},{"./_an-object":5}],30:[function(require,module,exports){
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

},{"./_an-object":5,"./_ctx":19,"./_is-array-iter":40,"./_iter-call":44,"./_to-length":91,"./core.get-iterator-method":100}],31:[function(require,module,exports){
module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":79}],32:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],33:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],34:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":21,"./_object-dp":56,"./_property-desc":70}],35:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":32}],36:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":21,"./_dom-create":22,"./_fails":27}],37:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":42,"./_set-proto":75}],38:[function(require,module,exports){
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

},{}],39:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":14}],40:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":49,"./_wks":99}],41:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":14}],42:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],43:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":14,"./_is-object":42,"./_wks":99}],44:[function(require,module,exports){
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

},{"./_an-object":5}],45:[function(require,module,exports){
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

},{"./_hide":34,"./_object-create":55,"./_property-desc":70,"./_set-to-string-tag":77,"./_wks":99}],46:[function(require,module,exports){
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

},{"./_export":25,"./_hide":34,"./_iter-create":45,"./_iterators":49,"./_library":50,"./_object-gpo":62,"./_redefine":72,"./_set-to-string-tag":77,"./_wks":99}],47:[function(require,module,exports){
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

},{"./_wks":99}],48:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],49:[function(require,module,exports){
module.exports = {};

},{}],50:[function(require,module,exports){
module.exports = false;

},{}],51:[function(require,module,exports){
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

},{"./_fails":27,"./_has":33,"./_is-object":42,"./_object-dp":56,"./_uid":94}],52:[function(require,module,exports){
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

},{"./_cof":14,"./_global":32,"./_task":87}],53:[function(require,module,exports){
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

},{"./_a-function":1}],54:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = require('./_object-keys');
var gOPS = require('./_object-gops');
var pIE = require('./_object-pie');
var toObject = require('./_to-object');
var IObject = require('./_iobject');
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;

},{"./_fails":27,"./_iobject":39,"./_object-gops":61,"./_object-keys":64,"./_object-pie":65,"./_to-object":92}],55:[function(require,module,exports){
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

},{"./_an-object":5,"./_dom-create":22,"./_enum-bug-keys":23,"./_html":35,"./_object-dps":57,"./_shared-key":78}],56:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":21,"./_ie8-dom-define":36,"./_to-primitive":93}],57:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":21,"./_object-dp":56,"./_object-keys":64}],58:[function(require,module,exports){
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

},{"./_descriptors":21,"./_has":33,"./_ie8-dom-define":36,"./_object-pie":65,"./_property-desc":70,"./_to-iobject":90,"./_to-primitive":93}],59:[function(require,module,exports){
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

},{"./_object-gopn":60,"./_to-iobject":90}],60:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":23,"./_object-keys-internal":63}],61:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],62:[function(require,module,exports){
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

},{"./_has":33,"./_shared-key":78,"./_to-object":92}],63:[function(require,module,exports){
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

},{"./_array-includes":7,"./_has":33,"./_shared-key":78,"./_to-iobject":90}],64:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":23,"./_object-keys-internal":63}],65:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],66:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export');
var core = require('./_core');
var fails = require('./_fails');
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};

},{"./_core":17,"./_export":25,"./_fails":27}],67:[function(require,module,exports){
var getKeys = require('./_object-keys');
var toIObject = require('./_to-iobject');
var isEnum = require('./_object-pie').f;
module.exports = function (isEntries) {
  return function (it) {
    var O = toIObject(it);
    var keys = getKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) if (isEnum.call(O, key = keys[i++])) {
      result.push(isEntries ? [key, O[key]] : O[key]);
    } return result;
  };
};

},{"./_object-keys":64,"./_object-pie":65,"./_to-iobject":90}],68:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],69:[function(require,module,exports){
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

},{"./_an-object":5,"./_is-object":42,"./_new-promise-capability":53}],70:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],71:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":72}],72:[function(require,module,exports){
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

},{"./_core":17,"./_function-to-string":31,"./_global":32,"./_has":33,"./_hide":34,"./_uid":94}],73:[function(require,module,exports){
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

},{"./_classof":13}],74:[function(require,module,exports){
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

},{"./_flags":29}],75:[function(require,module,exports){
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

},{"./_an-object":5,"./_ctx":19,"./_is-object":42,"./_object-gopd":58}],76:[function(require,module,exports){
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

},{"./_descriptors":21,"./_global":32,"./_object-dp":56,"./_wks":99}],77:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":33,"./_object-dp":56,"./_wks":99}],78:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":79,"./_uid":94}],79:[function(require,module,exports){
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

},{"./_core":17,"./_global":32,"./_library":50}],80:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":1,"./_an-object":5,"./_wks":99}],81:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":27}],82:[function(require,module,exports){
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

},{"./_defined":20,"./_to-integer":89}],83:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":20,"./_is-regexp":43}],84:[function(require,module,exports){
var $export = require('./_export');
var fails = require('./_fails');
var defined = require('./_defined');
var quot = /"/g;
// B.2.3.2.1 CreateHTML(string, tag, attribute, value)
var createHTML = function (string, tag, attribute, value) {
  var S = String(defined(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + String(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};
module.exports = function (NAME, exec) {
  var O = {};
  O[NAME] = exec(createHTML);
  $export($export.P + $export.F * fails(function () {
    var test = ''[NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  }), 'String', O);
};

},{"./_defined":20,"./_export":25,"./_fails":27}],85:[function(require,module,exports){
var $export = require('./_export');
var defined = require('./_defined');
var fails = require('./_fails');
var spaces = require('./_string-ws');
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;

},{"./_defined":20,"./_export":25,"./_fails":27,"./_string-ws":86}],86:[function(require,module,exports){
module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],87:[function(require,module,exports){
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

},{"./_cof":14,"./_ctx":19,"./_dom-create":22,"./_global":32,"./_html":35,"./_invoke":38}],88:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":89}],89:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],90:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":20,"./_iobject":39}],91:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":89}],92:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":20}],93:[function(require,module,exports){
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

},{"./_is-object":42}],94:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],95:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":32}],96:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":42}],97:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":17,"./_global":32,"./_library":50,"./_object-dp":56,"./_wks-ext":98}],98:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":99}],99:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":32,"./_shared":79,"./_uid":94}],100:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":13,"./_core":17,"./_iterators":49,"./_wks":99}],101:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":2,"./_array-fill":6,"./_export":25}],102:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $filter = require('./_array-methods')(2);

$export($export.P + $export.F * !require('./_strict-method')([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":8,"./_export":25,"./_strict-method":81}],103:[function(require,module,exports){
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

},{"./_array-methods":8,"./_export":25,"./_strict-method":81}],104:[function(require,module,exports){
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

},{"./_create-property":18,"./_ctx":19,"./_export":25,"./_is-array-iter":40,"./_iter-call":44,"./_iter-detect":47,"./_to-length":91,"./_to-object":92,"./core.get-iterator-method":100}],105:[function(require,module,exports){
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

},{"./_array-includes":7,"./_export":25,"./_strict-method":81}],106:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":25,"./_is-array":41}],107:[function(require,module,exports){
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

},{"./_add-to-unscopables":2,"./_iter-define":46,"./_iter-step":48,"./_iterators":49,"./_to-iobject":90}],108:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":8,"./_export":25,"./_strict-method":81}],109:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $reduce = require('./_array-reduce');

$export($export.P + $export.F * !require('./_strict-method')([].reduce, true), 'Array', {
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments[1], false);
  }
});

},{"./_array-reduce":9,"./_export":25,"./_strict-method":81}],110:[function(require,module,exports){
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

},{"./_redefine":72}],111:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":12,"./_export":25}],112:[function(require,module,exports){
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

},{"./_descriptors":21,"./_object-dp":56}],113:[function(require,module,exports){
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

},{"./_collection":16,"./_collection-strong":15,"./_validate-collection":96}],114:[function(require,module,exports){
'use strict';
var global = require('./_global');
var has = require('./_has');
var cof = require('./_cof');
var inheritIfRequired = require('./_inherit-if-required');
var toPrimitive = require('./_to-primitive');
var fails = require('./_fails');
var gOPN = require('./_object-gopn').f;
var gOPD = require('./_object-gopd').f;
var dP = require('./_object-dp').f;
var $trim = require('./_string-trim').trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(require('./_object-create')(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = require('./_descriptors') ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  require('./_redefine')(global, NUMBER, $Number);
}

},{"./_cof":14,"./_descriptors":21,"./_fails":27,"./_global":32,"./_has":33,"./_inherit-if-required":37,"./_object-create":55,"./_object-dp":56,"./_object-gopd":58,"./_object-gopn":60,"./_redefine":72,"./_string-trim":85,"./_to-primitive":93}],115:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', { assign: require('./_object-assign') });

},{"./_export":25,"./_object-assign":54}],116:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":25,"./_object-create":55}],117:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":21,"./_export":25,"./_object-dp":56}],118:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":64,"./_object-sap":66,"./_to-object":92}],119:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":25,"./_set-proto":75}],120:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var classof = require('./_classof');
var test = {};
test[require('./_wks')('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  require('./_redefine')(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}

},{"./_classof":13,"./_redefine":72,"./_wks":99}],121:[function(require,module,exports){
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

},{"./_a-function":1,"./_an-instance":4,"./_classof":13,"./_core":17,"./_ctx":19,"./_export":25,"./_for-of":30,"./_global":32,"./_is-object":42,"./_iter-detect":47,"./_library":50,"./_microtask":52,"./_new-promise-capability":53,"./_perform":68,"./_promise-resolve":69,"./_redefine-all":71,"./_set-species":76,"./_set-to-string-tag":77,"./_species-constructor":80,"./_task":87,"./_user-agent":95,"./_wks":99}],122:[function(require,module,exports){
// 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
var dP = require('./_object-dp');
var $export = require('./_export');
var anObject = require('./_an-object');
var toPrimitive = require('./_to-primitive');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
$export($export.S + $export.F * require('./_fails')(function () {
  // eslint-disable-next-line no-undef
  Reflect.defineProperty(dP.f({}, 1, { value: 1 }), 1, { value: 2 });
}), 'Reflect', {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    propertyKey = toPrimitive(propertyKey, true);
    anObject(attributes);
    try {
      dP.f(target, propertyKey, attributes);
      return true;
    } catch (e) {
      return false;
    }
  }
});

},{"./_an-object":5,"./_export":25,"./_fails":27,"./_object-dp":56,"./_to-primitive":93}],123:[function(require,module,exports){
'use strict';
var regexpExec = require('./_regexp-exec');
require('./_export')({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});

},{"./_export":25,"./_regexp-exec":74}],124:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":21,"./_flags":29,"./_object-dp":56}],125:[function(require,module,exports){
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

},{"./_advance-string-index":3,"./_an-object":5,"./_fix-re-wks":28,"./_regexp-exec-abstract":73,"./_to-length":91}],126:[function(require,module,exports){
'use strict';

var anObject = require('./_an-object');
var toObject = require('./_to-object');
var toLength = require('./_to-length');
var toInteger = require('./_to-integer');
var advanceStringIndex = require('./_advance-string-index');
var regExpExec = require('./_regexp-exec-abstract');
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
require('./_fix-re-wks')('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

},{"./_advance-string-index":3,"./_an-object":5,"./_fix-re-wks":28,"./_regexp-exec-abstract":73,"./_to-integer":89,"./_to-length":91,"./_to-object":92}],127:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":21,"./_fails":27,"./_flags":29,"./_redefine":72,"./es6.regexp.flags":124}],128:[function(require,module,exports){
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

},{"./_collection":16,"./_collection-strong":15,"./_validate-collection":96}],129:[function(require,module,exports){
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

},{"./_iter-define":46,"./_string-at":82}],130:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":84}],131:[function(require,module,exports){
// 21.1.3.18 String.prototype.startsWith(searchString [, position ])
'use strict';
var $export = require('./_export');
var toLength = require('./_to-length');
var context = require('./_string-context');
var STARTS_WITH = 'startsWith';
var $startsWith = ''[STARTS_WITH];

$export($export.P + $export.F * require('./_fails-is-regexp')(STARTS_WITH), 'String', {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = context(this, searchString, STARTS_WITH);
    var index = toLength(Math.min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = String(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"./_export":25,"./_fails-is-regexp":26,"./_string-context":83,"./_to-length":91}],132:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":21,"./_enum-keys":24,"./_export":25,"./_fails":27,"./_global":32,"./_has":33,"./_hide":34,"./_is-array":41,"./_is-object":42,"./_library":50,"./_meta":51,"./_object-create":55,"./_object-dp":56,"./_object-gopd":58,"./_object-gopn":60,"./_object-gopn-ext":59,"./_object-gops":61,"./_object-keys":64,"./_object-pie":65,"./_property-desc":70,"./_redefine":72,"./_set-to-string-tag":77,"./_shared":79,"./_to-iobject":90,"./_to-primitive":93,"./_uid":94,"./_wks":99,"./_wks-define":97,"./_wks-ext":98}],133:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $entries = require('./_object-to-array')(true);

$export($export.S, 'Object', {
  entries: function entries(it) {
    return $entries(it);
  }
});

},{"./_export":25,"./_object-to-array":67}],134:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":25,"./_object-to-array":67}],135:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":97}],136:[function(require,module,exports){
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

},{"./_global":32,"./_hide":34,"./_iterators":49,"./_object-keys":64,"./_redefine":72,"./_wks":99,"./es6.array.iterator":107}],137:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Particles_1 = require("../Particles/Particles");

var Stars_1 = require("./Stars");

var WebPage_1 = require("../Modules/WebPage");

var canvas = new Particles_1["default"]('#particles', '2d');
canvas.setParticleSettings(Stars_1.Stars.Particles);
canvas.setInteractiveSettings(Stars_1.Stars.Interactive);
canvas.start();
var paused = false;
WebPage_1.ScrollHook.addEventListener('scroll', function () {
  if (WebPage_1.Sections.get('canvas').inView()) {
    if (paused) {
      paused = false;
      canvas.resume();
    }
  } else {
    if (!paused) {
      paused = true;
      canvas.pause();
    }
  }
}, {
  capture: true,
  passive: true
});

},{"../Modules/WebPage":173,"../Particles/Particles":181,"./Stars":138,"core-js/modules/es6.object.define-property":117}],138:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Stars = void 0;
exports.Stars = {
  Particles: {
    number: 300,
    density: 200,
    color: '#FFFFFF',
    opacity: 'random',
    radius: [2, 2.5, 3, 3.5, 4, 4.5],
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
        radius: 8,
        opacity: 1
      }
    }
  }
};

},{"core-js/modules/es6.object.define-property":117}],139:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.reflect.define-property");

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

var Components;

(function (Components) {
  var Helpers;

  (function (Helpers) {
    function runIfDefined(_this, method, data) {
      if (_this[method] && _this[method] instanceof Function) {
        _this[method](data);
      }
    }

    Helpers.runIfDefined = runIfDefined;

    function attachInterface(_this, name) {
      Reflect.defineProperty(_this, name, {
        value: Interface[name],
        configurable: false,
        writable: false
      });
    }

    Helpers.attachInterface = attachInterface;
  })(Helpers || (Helpers = {}));

  var Interface;

  (function (Interface) {
    function appendTo(parent) {
      var _this_1 = this;

      parent.appendChild(this.element);
      setTimeout(function () {
        if (!_this_1._mounted) {
          Events.dispatch(_this_1, 'mounted', {
            parent: parent
          });
          _this_1._mounted = true;
        }
      }, 0);
    }

    Interface.appendTo = appendTo;
  })(Interface || (Interface = {}));

  var Events;

  (function (Events) {
    function dispatch(_this, event, data) {
      Helpers.runIfDefined(_this, event, data);
    }

    Events.dispatch = dispatch;
  })(Events || (Events = {}));

  var __Base = function () {
    function __Base() {
      this.element = null;
    }

    return __Base;
  }();

  var Component = function (_super) {
    __extends(Component, _super);

    function Component() {
      var _this_1 = _super.call(this) || this;

      _this_1.element = null;
      _this_1._mounted = false;

      _this_1._setupInterface();

      return _this_1;
    }

    Component.prototype._setupInterface = function () {
      Helpers.attachInterface(this, 'appendTo');
    };

    Component.prototype.appendTo = function (parent) {};

    Component.prototype.getReference = function (ref) {
      return this.element.querySelector("[ref=\"" + ref + "\"]") || null;
    };

    return Component;
  }(__Base);

  var Initialize;

  (function (Initialize) {
    function __Initialize() {
      this.element = this.createElement();
      Events.dispatch(this, 'created');
    }

    function Main(_this) {
      __Initialize.bind(_this)();
    }

    Initialize.Main = Main;
  })(Initialize || (Initialize = {}));

  var HTMLComponent = function (_super) {
    __extends(HTMLComponent, _super);

    function HTMLComponent() {
      var _this_1 = _super.call(this) || this;

      Initialize.Main(_this_1);
      return _this_1;
    }

    return HTMLComponent;
  }(Component);

  Components.HTMLComponent = HTMLComponent;

  var DataComponent = function (_super) {
    __extends(DataComponent, _super);

    function DataComponent(data) {
      var _this_1 = _super.call(this) || this;

      _this_1.data = data;
      Initialize.Main(_this_1);
      return _this_1;
    }

    return DataComponent;
  }(Component);

  Components.DataComponent = DataComponent;
})(Components || (Components = {}));

module.exports = Components;

},{"core-js/modules/es6.function.bind":111,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.set-prototype-of":119,"core-js/modules/es6.reflect.define-property":122}],140:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.string.link");

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
exports.Education = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var DOM_1 = require("../../Modules/DOM");

var Education = function (_super) {
  __extends(Education, _super);

  function Education() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Education.prototype.update = function () {};

  Education.prototype.created = function () {
    var _this = this;

    DOM_1.DOM.onFirstAppearance(this.element, function () {
      _this.setProgress();
    }, {
      timeout: 500,
      offset: 0.3
    });
  };

  Education.prototype.setProgress = function () {
    var completed = this.data.credits.completed / this.data.credits.total * 100 + "%";
    var taking = (this.data.credits.completed + this.data.credits.taking) / this.data.credits.total * 100 + "%";
    this.getReference('completedTrack').style.width = completed;
    this.getReference('takingTrack').style.width = taking;
    var completedMarker = this.getReference('completedMarker');
    var takingMarker = this.getReference('takingMarker');
    completedMarker.style.opacity = '1';
    completedMarker.style.left = completed;
    takingMarker.style.opacity = '1';
    takingMarker.style.left = taking;
  };

  Education.prototype.createElement = function () {
    var inlineStyle = {
      '--progress-bar-color': this.data.color
    };
    return JSX_1.ElementFactory.createElement("div", {
      className: "education card is-theme-secondary elevation-1",
      style: inlineStyle
    }, JSX_1.ElementFactory.createElement("div", {
      className: "content padding-2"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "body"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "header flex row sm-wrap md-nowrap xs-x-center"
    }, JSX_1.ElementFactory.createElement("a", {
      className: "icon xs-auto",
      href: this.data.link,
      target: "_blank"
    }, JSX_1.ElementFactory.createElement("img", {
      src: "out/images/Education/" + this.data.image
    })), JSX_1.ElementFactory.createElement("div", {
      className: "about xs-full"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "institution flex row xs-x-center xs-y-center md-x-begin"
    }, JSX_1.ElementFactory.createElement("a", {
      className: "name xs-full md-auto is-center-aligned is-bold-weight is-size-6 is-colored-link",
      href: this.data.link,
      target: "_blank"
    }, this.data.name), JSX_1.ElementFactory.createElement("p", {
      className: "location md-x-self-end is-italic is-size-8 is-color-light"
    }, this.data.location)), JSX_1.ElementFactory.createElement("div", {
      className: "degree flex row xs-x-center xs-y-center md-x-begin"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "name xs-full md-auto is-center-aligned is-bold-weight is-size-7 is-color-light"
    }, this.data.degree), JSX_1.ElementFactory.createElement("p", {
      className: "date md-x-self-end is-italic is-size-8 is-color-light"
    }, "(", this.data.start, " \u2014 ", this.data.end, ")")))), JSX_1.ElementFactory.createElement("div", {
      className: "progress flex row xs-nowrap xs-y-center progress-bar-hover-container"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "progress-bar"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "completed marker",
      style: {
        opacity: 0
      },
      ref: "completedMarker"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "is-size-8"
    }, this.data.credits.completed)), JSX_1.ElementFactory.createElement("div", {
      className: "taking marker",
      style: {
        opacity: 0
      },
      ref: "takingMarker"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "is-size-8"
    }, this.data.credits.completed + this.data.credits.taking)), JSX_1.ElementFactory.createElement("div", {
      className: "track"
    }), JSX_1.ElementFactory.createElement("div", {
      className: "buffer",
      ref: "takingTrack"
    }), JSX_1.ElementFactory.createElement("div", {
      className: "fill",
      ref: "completedTrack"
    })), JSX_1.ElementFactory.createElement("p", {
      className: "credits is-size-8 xs-auto"
    }, this.data.credits.total, " credits")), JSX_1.ElementFactory.createElement("div", {
      className: "info content padding-x-4 padding-y-2"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "is-light-color is-size-8 is-italic"
    }, "GPA / ", this.data.gpa.overall, " (overall) / ", this.data.gpa.major, " (major)"), this.data.notes.map(function (note) {
      return JSX_1.ElementFactory.createElement("p", {
        className: "is-light-color is-size-8 is-italic"
      }, note);
    }), JSX_1.ElementFactory.createElement("hr", null), JSX_1.ElementFactory.createElement("div", {
      className: "courses"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "is-bold-weight is-size-6"
    }, "Recent Coursework"), JSX_1.ElementFactory.createElement("ul", {
      className: "flex row is-size-7"
    }, this.data.courses.map(function (course) {
      return JSX_1.ElementFactory.createElement("li", {
        className: "xs-12 md-6"
      }, course);
    })))))));
  };

  return Education;
}(Component_1.DataComponent);

exports.Education = Education;

},{"../../Definitions/JSX":157,"../../Modules/DOM":170,"../Component":139,"core-js/modules/es6.array.map":108,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119,"core-js/modules/es6.string.link":130}],141:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.string.link");

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
exports.Experience = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var Experience = function (_super) {
  __extends(Experience, _super);

  function Experience() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Experience.prototype.update = function () {};

  Experience.prototype.createElement = function () {
    return JSX_1.ElementFactory.createElement("div", {
      className: "card is-theme-secondary elevation-1 experience"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "content padding-2"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "header"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "icon"
    }, JSX_1.ElementFactory.createElement("a", {
      href: this.data.link,
      target: "_blank"
    }, JSX_1.ElementFactory.createElement("img", {
      src: "./out/images/Experience/" + this.data.svg + ".svg"
    }))), JSX_1.ElementFactory.createElement("div", {
      className: "company"
    }, JSX_1.ElementFactory.createElement("a", {
      href: this.data.link,
      target: "_blank",
      className: "name is-size-6 is-bold-weight is-colored-link"
    }, this.data.company), JSX_1.ElementFactory.createElement("p", {
      className: "location is-size-8 is-italic is-color-light"
    }, this.data.location)), JSX_1.ElementFactory.createElement("div", {
      className: "role"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "name is-size-7 is-bold-weight"
    }, this.data.position), JSX_1.ElementFactory.createElement("p", {
      className: "date is-size-8 is-italic is-color-light"
    }, "(" + this.data.begin + " \u2014 " + this.data.end + ")"))), JSX_1.ElementFactory.createElement("hr", null), JSX_1.ElementFactory.createElement("div", {
      className: "content info"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "description is-size-8 is-color-light is-italic is-justified is-quote"
    }, this.data.flavor), JSX_1.ElementFactory.createElement("ul", {
      className: "job is-left-aligned is-size-7 xs-y-padding-between-1"
    }, this.data.roles.map(function (role) {
      return JSX_1.ElementFactory.createElement("li", null, role);
    })))));
  };

  return Experience;
}(Component_1.DataComponent);

exports.Experience = Experience;

},{"../../Definitions/JSX":157,"../Component":139,"core-js/modules/es6.array.map":108,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119,"core-js/modules/es6.string.link":130}],142:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

var DOM_1 = require("../../../Modules/DOM");

var Helpers;

(function (Helpers) {
  function loadOnFirstAppearance(hook, className) {
    if (className === void 0) {
      className = 'preload';
    }

    return new Promise(function (resolve, reject) {
      hook.classList.add(className);
      DOM_1.DOM.onFirstAppearance(hook, function () {
        hook.classList.remove(className);
        resolve();
      }, {
        offset: 0.5
      });
    });
  }

  Helpers.loadOnFirstAppearance = loadOnFirstAppearance;
})(Helpers || (Helpers = {}));

module.exports = Helpers;

},{"../../../Modules/DOM":170,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.promise":121}],143:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.array.map");

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
exports.Menu = void 0;

var DOM_1 = require("../../Modules/DOM");

var EventDispatcher_1 = require("../../Modules/EventDispatcher");

var Menu = function (_super) {
  __extends(Menu, _super);

  function Menu() {
    var _this = _super.call(this) || this;

    _this.open = false;
    _this.RGBRegExp = /(rgb\(([0-9]{1,3}), ([0-9]{1,3}), ([0-9]{1,3})\))|(rgba\(([0-9]{1,3}), ([0-9]{1,3}), ([0-9]{1,3}), (0(?:\.[0-9]{1,2})?)\))/g;
    _this.Container = DOM_1.DOM.getFirstElement('header.menu');
    _this.Hamburger = DOM_1.DOM.getFirstElement('header.menu .hamburger');

    _this.register('toggle');

    return _this;
  }

  Menu.prototype.toggle = function () {
    this.open = !this.open;
    this.open ? this.openMenu() : this.closeMenu();
    this.dispatch('toggle', {
      open: this.open
    });
  };

  Menu.prototype.openMenu = function () {
    this.Container.setAttribute('open', '');
    this.darken();
  };

  Menu.prototype.closeMenu = function () {
    var _this = this;

    this.Container.removeAttribute('open');
    setTimeout(function () {
      return _this.updateContrast();
    }, 750);
  };

  Menu.prototype.darken = function () {
    this.Hamburger.classList.remove('light');
  };

  Menu.prototype.lighten = function () {
    this.Hamburger.classList.add('light');
  };

  Menu.prototype.updateContrast = function () {
    if (!this.open) {
      var backgroundColor = this.getBackgroundColor();
      this.changeContrast(backgroundColor);
    }
  };

  Menu.prototype.getBackgroundColor = function () {
    var elementsFromPoint = document.elementsFromPoint ? 'elementsFromPoint' : 'msElementsFromPoint';

    var _a = this.Hamburger.getBoundingClientRect(),
        top = _a.top,
        left = _a.left;

    var elements = document[elementsFromPoint](left, top);
    var length = elements.length;
    var RGB = [];
    var background, regExResult;
    var styles;

    for (var i = 1; i < length; ++i, this.RGBRegExp.lastIndex = 0) {
      styles = window.getComputedStyle(elements[i]);
      background = styles.background || styles.backgroundColor + styles.backgroundImage;

      while (regExResult = this.RGBRegExp.exec(background)) {
        if (regExResult[1]) {
          RGB = regExResult.slice(2, 5).map(function (val) {
            return parseInt(val);
          });
          return RGB;
        } else if (regExResult[5]) {
          RGB = regExResult.slice(6, 10).map(function (val) {
            return parseInt(val);
          });

          if (!RGB.every(function (val) {
            return val === 0;
          })) {
            return RGB;
          }
        }
      }
    }

    return RGB;
  };

  Menu.prototype.changeContrast = function (RGB) {
    var contrast, luminance;

    if (RGB.length === 3) {
      contrast = RGB.map(function (val) {
        return val / 255;
      }).map(function (val) {
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
      });
      luminance = 0.2126 * contrast[0] + 0.7152 * contrast[1] + 0.0722 * contrast[2];

      if (luminance > 0.179) {
        this.darken();
      } else {
        this.lighten();
      }
    } else {
      this.darken();
    }
  };

  return Menu;
}(EventDispatcher_1.Events.EventDispatcher);

exports.Menu = Menu;

},{"../../Modules/DOM":170,"../../Modules/EventDispatcher":171,"core-js/modules/es6.array.is-array":106,"core-js/modules/es6.array.map":108,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119}],144:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.function.name");

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
exports.Project = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var DOM_1 = require("../../Modules/DOM");

var Project = function (_super) {
  __extends(Project, _super);

  function Project() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.infoDisplayed = false;
    _this.tooltipLeft = true;
    return _this;
  }

  Project.prototype.created = function () {
    var _this = this;

    if (this.data.award) {
      window.addEventListener('resize', function () {
        return _this.checkTooltipSide();
      }, {
        passive: true
      });
    }
  };

  Project.prototype.mounted = function () {
    if (this.data.award) {
      this.checkTooltipSide();
    }
  };

  Project.prototype.checkTooltipSide = function () {
    var tooltip = this.getReference('tooltip');
    var tooltipPos = tooltip.getBoundingClientRect().left;
    var screenWidth = DOM_1.DOM.getViewport().width;

    if (this.tooltipLeft !== tooltipPos >= screenWidth / 2) {
      this.tooltipLeft = !this.tooltipLeft;
      var add = this.tooltipLeft ? 'left' : 'top';
      var remove = this.tooltipLeft ? 'top' : 'left';
      tooltip.classList.remove(remove);
      tooltip.classList.add(add);
    }
  };

  Project.prototype.lessInfo = function () {
    this.infoDisplayed = false;
    this.update();
  };

  Project.prototype.toggleInfo = function () {
    this.infoDisplayed = !this.infoDisplayed;
    this.update();
  };

  Project.prototype.update = function () {
    if (this.infoDisplayed) {
      this.getReference('slider').setAttribute('opened', '');
    } else {
      this.getReference('slider').removeAttribute('opened');
    }

    this.getReference('infoText').innerHTML = (this.infoDisplayed ? 'Less' : 'More') + " Info";
  };

  Project.prototype.createElement = function () {
    var inlineStyle = {
      '--button-background-color': this.data.color
    };
    var imageStyle = {
      backgroundImage: "url(" + ("./out/images/Projects/" + this.data.image) + ")"
    };
    return JSX_1.ElementFactory.createElement("div", {
      className: "xs-12 sm-6 md-4"
    }, this.data.award ? JSX_1.ElementFactory.createElement("div", {
      className: "award"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "tooltip-container"
    }, JSX_1.ElementFactory.createElement("img", {
      src: "out/images/Projects/award.png"
    }), JSX_1.ElementFactory.createElement("span", {
      ref: "tooltip",
      className: "tooltip left is-size-8"
    }, this.data.award))) : null, JSX_1.ElementFactory.createElement("div", {
      className: "project card is-theme-secondary elevation-1 is-in-grid hide-overflow",
      style: inlineStyle
    }, JSX_1.ElementFactory.createElement("div", {
      className: "image",
      style: imageStyle
    }), JSX_1.ElementFactory.createElement("div", {
      className: "content padding-2"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "title"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "name is-size-6 is-bold-weight",
      style: {
        color: this.data.color
      }
    }, this.data.name), JSX_1.ElementFactory.createElement("p", {
      className: "type is-size-8"
    }, this.data.type), JSX_1.ElementFactory.createElement("p", {
      className: "date is-size-8 is-color-light"
    }, this.data.date)), JSX_1.ElementFactory.createElement("div", {
      className: "body"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "flavor is-size-7"
    }, this.data.flavor)), JSX_1.ElementFactory.createElement("div", {
      className: "slider is-theme-secondary",
      ref: "slider"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "content padding-4"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "title flex row xs-x-begin xs-y-center"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "is-size-6 is-bold-weight"
    }, "Details"), JSX_1.ElementFactory.createElement("div", {
      className: "close-btn-wrapper xs-x-self-end"
    }, JSX_1.ElementFactory.createElement("button", {
      className: "btn close is-svg is-primary",
      tabindex: "-1",
      onClick: this.lessInfo.bind(this)
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-times"
    })))), JSX_1.ElementFactory.createElement("div", {
      className: "body"
    }, JSX_1.ElementFactory.createElement("ul", {
      className: "details xs-y-padding-between-1 is-size-9"
    }, this.data.details.map(function (detail) {
      return JSX_1.ElementFactory.createElement("li", null, detail);
    }))))), JSX_1.ElementFactory.createElement("div", {
      className: "options is-theme-secondary xs-x-margin-between-1"
    }, JSX_1.ElementFactory.createElement("button", {
      className: "info btn is-primary is-text is-custom",
      onClick: this.toggleInfo.bind(this)
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-info"
    }), JSX_1.ElementFactory.createElement("span", {
      ref: "infoText"
    }, "More Info")), this.data.repo ? JSX_1.ElementFactory.createElement("a", {
      className: "code btn is-primary is-text is-custom",
      href: this.data.repo,
      target: "_blank",
      tabindex: "0"
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-code"
    }), JSX_1.ElementFactory.createElement("span", null, "See Code")) : null, this.data.external ? JSX_1.ElementFactory.createElement("a", {
      className: "external btn is-primary is-text is-custom",
      href: this.data.external,
      target: "_blank",
      tabindex: "0"
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-external-link-alt"
    }), JSX_1.ElementFactory.createElement("span", null, "View Online")) : null))));
  };

  return Project;
}(Component_1.DataComponent);

exports.Project = Project;

},{"../../Definitions/JSX":157,"../../Modules/DOM":170,"../Component":139,"core-js/modules/es6.array.map":108,"core-js/modules/es6.function.bind":111,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119}],145:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.function.name");

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
exports.Quality = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var Quality = function (_super) {
  __extends(Quality, _super);

  function Quality(data) {
    return _super.call(this, data) || this;
  }

  Quality.prototype.update = function () {};

  Quality.prototype.createElement = function () {
    return JSX_1.ElementFactory.createElement("div", {
      className: "xs-12 sm-4"
    }, JSX_1.ElementFactory.createElement("i", {
      className: "icon " + this.data.faClass
    }), JSX_1.ElementFactory.createElement("p", {
      className: "quality is-size-5 is-uppercase"
    }, this.data.name), JSX_1.ElementFactory.createElement("p", {
      className: "desc is-light-weight is-size-6"
    }, this.data.description));
  };

  return Quality;
}(Component_1.DataComponent);

exports.Quality = Quality;

},{"../../Definitions/JSX":157,"../Component":139,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119}],146:[function(require,module,exports){
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
    return DOM_1.DOM.inVerticalWindowView(this.element);
  };

  Section.prototype.getID = function () {
    return this.element.id;
  };

  Section.prototype.inMenu = function () {
    return !this.element.classList.contains('no-menu');
  };

  return Section;
}();

exports["default"] = Section;

},{"../../Modules/DOM":170,"core-js/modules/es6.object.define-property":117}],147:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.function.name");

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
exports.Skill = exports.SkillCategory = void 0;

var SVG_1 = require("../../Modules/SVG");

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var SkillCategory;

(function (SkillCategory) {
  SkillCategory[SkillCategory["Programming"] = 1] = "Programming";
  SkillCategory[SkillCategory["Scripting"] = 2] = "Scripting";
  SkillCategory[SkillCategory["Web"] = 4] = "Web";
  SkillCategory[SkillCategory["Server"] = 8] = "Server";
  SkillCategory[SkillCategory["Database"] = 16] = "Database";
  SkillCategory[SkillCategory["DevOps"] = 32] = "DevOps";
  SkillCategory[SkillCategory["Framework"] = 64] = "Framework";
  SkillCategory[SkillCategory["Other"] = 128] = "Other";
})(SkillCategory = exports.SkillCategory || (exports.SkillCategory = {}));

var Skill = function (_super) {
  __extends(Skill, _super);

  function Skill() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Skill.prototype.getCategory = function () {
    return this.data.category;
  };

  Skill.prototype.update = function () {};

  Skill.prototype.created = function () {
    var _this = this;

    SVG_1.SVG.loadSVG("./out/images/Skills/" + this.data.svg).then(function (svg) {
      svg.setAttribute('class', 'icon');

      var hexagon = _this.getReference('hexagon');

      hexagon.parentNode.insertBefore(svg, hexagon);
    });
  };

  Skill.prototype.createElement = function () {
    if (!Skill.HexagonSVG) {
      throw 'Cannot create Skill element without being initialized.';
    }

    return JSX_1.ElementFactory.createElement("li", {
      className: 'skill tooltip-container'
    }, JSX_1.ElementFactory.createElement("div", {
      className: 'hexagon-container',
      style: {
        color: this.data.color
      }
    }, JSX_1.ElementFactory.createElement("span", {
      className: 'tooltip top is-size-7'
    }, this.data.name), Skill.HexagonSVG.cloneNode(true)));
  };

  Skill.initialize = function () {
    return new Promise(function (resolve, reject) {
      if (Skill.HexagonSVG) {
        resolve(true);
      } else {
        SVG_1.SVG.loadSVG('./out/images/Content/Hexagon').then(function (element) {
          element.setAttribute('class', 'hexagon');
          element.setAttribute('ref', 'hexagon');
          Skill.HexagonSVG = element;
          resolve(true);
        })["catch"](function (err) {
          resolve(false);
        });
      }
    });
  };

  return Skill;
}(Component_1.DataComponent);

exports.Skill = Skill;
Skill.initialize();

},{"../../Definitions/JSX":157,"../../Modules/SVG":172,"../Component":139,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.promise":121}],148:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.array.for-each");

require("core-js/modules/es6.number.constructor");

require("core-js/modules/es7.object.entries");

require("core-js/modules/es6.array.reduce");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.map");

require("core-js/modules/es6.array.filter");

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es6.object.assign");

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SkillsFilter = void 0;

var JSX_1 = require("../../Definitions/JSX");

var DOM_1 = require("../../Modules/DOM");

var Skill_1 = require("./Skill");

var WebPage_1 = require("../../Modules/WebPage");

var Skills_1 = require("../../Data/Skills");

var SkillsFilter = function () {
  function SkillsFilter() {
    var _this = this;

    this.filter = 0;
    this.active = false;
    this.top = false;
    this.maxHeight = 224;
    this.optionElements = new Map();
    this.skillElements = [];
    this.usingArrowKeys = false;
    this.lastSelected = null;
    this.Container = DOM_1.DOM.getFirstElement('section#skills .skills-filter');
    this.Dropdown = this.Container.querySelector('.dropdown');
    this.SelectedOptionsDisplay = this.Dropdown.querySelector('.selected-options .display');
    this.Menu = this.Dropdown.querySelector('.menu');
    this.MenuOptions = this.Menu.querySelector('.options');
    this.CategoryMap = Object.entries(Skill_1.SkillCategory).filter(function (_a) {
      var key = _a[0],
          val = _a[1];
      return !isNaN(Number(key));
    }).reduce(function (obj, _a) {
      var _b;

      var key = _a[0],
          val = _a[1];
      return __assign(__assign({}, obj), (_b = {}, _b[key] = val, _b));
    }, {});
    DOM_1.DOM.load().then(function (document) {
      Skill_1.Skill.initialize().then(function () {
        _this.initialize();

        _this.createSkillElements();

        _this.createOptions();

        _this.update();

        _this.createEventListeners();
      });
    });
  }

  SkillsFilter.prototype.initialize = function () {
    this.Menu.style.maxHeight = this.maxHeight + "px";
    this.checkPosition();
  };

  SkillsFilter.prototype.createOptions = function () {
    var _this = this;

    Object.entries(this.CategoryMap).forEach(function (_a) {
      var key = _a[0],
          val = _a[1];
      var element = JSX_1.ElementFactory.createElement("li", {
        className: "is-size-7"
      }, val);

      _this.optionElements.set(element, Number(key));

      _this.MenuOptions.appendChild(element);
    });
  };

  SkillsFilter.prototype.createSkillElements = function () {
    for (var _i = 0, Skills_2 = Skills_1.Skills; _i < Skills_2.length; _i++) {
      var skill = Skills_2[_i];
      this.skillElements.push(new Skill_1.Skill(skill));
    }
  };

  SkillsFilter.prototype.update = function () {
    var _this = this;

    for (var i = WebPage_1.SkillsGrid.children.length - 1; i >= 0; --i) {
      WebPage_1.SkillsGrid.removeChild(WebPage_1.SkillsGrid.children.item(i));
    }

    if (this.filter === 0) {
      this.skillElements.forEach(function (skill) {
        return skill.appendTo(WebPage_1.SkillsGrid);
      });
      this.SelectedOptionsDisplay.innerText = 'None';
    } else {
      this.skillElements.filter(function (skill) {
        return (skill.getCategory() & _this.filter) !== 0;
      }).forEach(function (skill) {
        return skill.appendTo(WebPage_1.SkillsGrid);
      });
      var text = Object.entries(this.CategoryMap).filter(function (_a) {
        var key = _a[0],
            val = _a[1];
        return (_this.filter & Number(key)) !== 0;
      }).map(function (_a) {
        var key = _a[0],
            val = _a[1];
        return val;
      }).join(', ');
      this.SelectedOptionsDisplay.innerText = text;
    }
  };

  SkillsFilter.prototype.createEventListeners = function () {
    var _this = this;

    document.addEventListener('click', function (event) {
      if (_this.optionElements.has(event.target)) {
        _this.toggleOption(event.target);
      } else {
        var path = DOM_1.DOM.getPathToRoot(event.target);

        if (path.indexOf(_this.Dropdown) === -1) {
          _this.close();
        } else {
          _this.active ? _this.close() : _this.open();
        }
      }
    }, {
      passive: true
    });
    document.addEventListener('keydown', function (event) {
      if (event.keyCode === 32) {
        var path = DOM_1.DOM.getPathToRoot(document.activeElement);

        if (path.indexOf(_this.Dropdown) !== -1) {
          if (_this.active && _this.usingArrowKeys) {
            _this.toggleOption(_this.lastSelected);
          }

          _this.toggle();

          event.preventDefault();
          event.stopPropagation();
        }
      } else if (_this.active) {
        if (event.keyCode === 37 || event.keyCode === 38) {
          _this.moveArrowSelection(-1);

          event.preventDefault();
          event.stopPropagation();
        } else if (event.keyCode === 39 || event.keyCode === 40) {
          _this.moveArrowSelection(1);

          event.preventDefault();
          event.stopPropagation();
        }
      }
    });
    this.MenuOptions.addEventListener('mouseover', function (event) {
      if (_this.lastSelected) {
        _this.usingArrowKeys = false;

        _this.lastSelected.classList.remove('hover');
      }
    });
    this.Dropdown.addEventListener('blur', function (event) {
      if (_this.active) {
        _this.close();
      }
    });
    WebPage_1.ScrollHook.addEventListener('scroll', function (event) {
      _this.checkPosition();
    }, {
      passive: true
    });
  };

  SkillsFilter.prototype.close = function () {
    this.active = false;
    this.Dropdown.classList.remove('active');
  };

  SkillsFilter.prototype.open = function () {
    this.active = true;
    this.Dropdown.classList.add('active');

    if (this.lastSelected) {
      this.lastSelected.classList.add('hover');
    }
  };

  SkillsFilter.prototype.toggle = function () {
    this.active ? this.close() : this.open();
  };

  SkillsFilter.prototype.toggleOption = function (option) {
    var bit = this.optionElements.get(option);

    if ((this.filter & bit) !== 0) {
      option.classList.remove('selected');
    } else {
      option.classList.add('selected');
    }

    this.filter ^= bit;
    this.lastSelected = option;
    this.update();
  };

  SkillsFilter.prototype.moveArrowSelection = function (dir) {
    if (!this.lastSelected) {
      this.lastSelected = this.MenuOptions.firstElementChild;
      this.lastSelected.classList.add('hover');
    } else {
      if (this.usingArrowKeys) {
        this.lastSelected.classList.remove('hover');

        if (dir < 0) {
          this.lastSelected = this.lastSelected.previousElementSibling || this.MenuOptions.lastElementChild;
        } else {
          this.lastSelected = this.lastSelected.nextElementSibling || this.MenuOptions.firstElementChild;
        }
      } else {
        this.usingArrowKeys = true;
      }

      this.lastSelected.classList.add('hover');

      if (!DOM_1.DOM.inOffsetView(this.lastSelected, {
        ignoreX: true,
        whole: true
      })) {
        DOM_1.DOM.scrollContainerToViewWholeChild(this.Menu, this.lastSelected, {
          ignoreX: true,
          smooth: true
        });
      }
    }

    this.usingArrowKeys = true;
  };

  SkillsFilter.prototype.checkPosition = function () {
    if (DOM_1.DOM.pixelsAboveScreenBottom(this.Dropdown) <= this.maxHeight) {
      if (!this.top) {
        this.top = true;
        this.Dropdown.classList.add('top');
      }
    } else {
      if (this.top) {
        this.top = false;
        this.Dropdown.classList.remove('top');
      }
    }
  };

  return SkillsFilter;
}();

exports.SkillsFilter = SkillsFilter;

},{"../../Data/Skills":155,"../../Definitions/JSX":157,"../../Modules/DOM":170,"../../Modules/WebPage":173,"./Skill":147,"core-js/modules/es6.array.filter":102,"core-js/modules/es6.array.for-each":103,"core-js/modules/es6.array.index-of":105,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.array.map":108,"core-js/modules/es6.array.reduce":109,"core-js/modules/es6.map":113,"core-js/modules/es6.number.constructor":114,"core-js/modules/es6.object.assign":115,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.string.iterator":129,"core-js/modules/es7.object.entries":133,"core-js/modules/web.dom.iterable":136}],149:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.string.link");

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
exports.Social = void 0;

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var Social = function (_super) {
  __extends(Social, _super);

  function Social() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  Social.prototype.update = function () {};

  Social.prototype.createElement = function () {
    return JSX_1.ElementFactory.createElement("div", {
      className: "social"
    }, JSX_1.ElementFactory.createElement("a", {
      className: "btn is-svg is-primary",
      href: this.data.link,
      target: "_blank"
    }, JSX_1.ElementFactory.createElement("i", {
      className: this.data.faClass
    })));
  };

  return Social;
}(Component_1.DataComponent);

exports.Social = Social;

},{"../../Definitions/JSX":157,"../Component":139,"core-js/modules/es6.object.create":116,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.set-prototype-of":119,"core-js/modules/es6.string.link":130}],150:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboutMe = void 0;
exports.AboutMe = "I am an aspiring web developer and software engineer chasing my passion for working with technology and programming at the University of Texas at Dallas. I crave the opportunity to contribute to meaningful projects that employ my current gifts and interests while also shoving me out of my comfort zone to learn new skills. My goal is to maximize every experience as an opportunity for personal, professional, and technical growth.";

},{"core-js/modules/es6.object.define-property":117}],151:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Education = void 0;
exports.Education = [{
  name: 'The University of Texas at Dallas',
  color: '#C75B12',
  image: 'utd.svg',
  link: 'http://utdallas.edu',
  location: 'Richardson, TX, USA',
  degree: 'Bachelor of Science in Computer Science',
  start: 'Fall 2018',
  end: 'Fall 2021',
  credits: {
    total: 124,
    completed: 90,
    taking: 14
  },
  gpa: {
    overall: '4.0',
    major: '4.0'
  },
  notes: ['Collegium V Honors'],
  courses: ['Two Semesters of C++ Programming', 'Computer Architecture', 'Software Engineering', 'Programming in UNIX']
}];

},{"core-js/modules/es6.object.define-property":117}],152:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Experience = void 0;
exports.Experience = [{
  svg: 'fidelity',
  link: 'https://www.fidelity.com/',
  company: 'Fidelity Investments',
  location: 'Remote',
  position: 'Software Engineer Intern',
  begin: 'June 2020',
  end: 'July 2020',
  flavor: 'Fidelity Investments is an international provider of financial services that help individuals and institutions meet their financial objectives. As a leader in the industry, Fidelity is committed to using state-of-the-art technology to serve its customers. I worked remotely as a part of the Single Sign-On team in the Customer Protection division of Workplace Investing.',
  roles: ['Created a full-stack web application for single sign-on work intake using Angular and Spring Boot.', 'Developed a dynamic form component library focused on reusable logic, UI abstraction, and design flexibility.', 'Integrated front-end and back-end applications using Maven build tools and Docker.', 'Engaged in professional training sessions for developing on Amazon Web Services.', 'Worked closely with the Agile process and incremental software delivery.']
}, {
  svg: 'medit',
  link: 'https://medit.online',
  company: 'Medit',
  location: 'Dublin, Ireland',
  position: 'Web Application Developer',
  begin: 'May 2019',
  end: 'July 2019',
  flavor: 'Medit is a start-up company committed to making medical education more efficient through their mobile solutions. By combining technology with curated content, practicing professionals are given a quick, unique, and relevant learning experience. I had the opportunity to work as the company\'s first web developer, laying down the essential foundations for a web-based version of their application.',
  roles: ['Architected the initial foundations for a full-scale, single-page web application using Vue, TypeScript, and SASS.', 'Designed an interface-oriented, modularized state management system to work behind the application.', 'Developed a Vue configuration library to enhance the ability to mock application state in unit testing.', 'Established a comprehensive UI component library to accelerate the ability to add new content.']
}, {
  svg: 'lifechurch',
  link: 'https://life.church',
  company: 'Life.Church',
  location: 'Edmond, OK, USA',
  position: 'Information Technology Intern',
  begin: 'May 2018',
  end: 'August 2018',
  flavor: 'Life.Church is a multi-site church with a worldwide impact, centered around their mission to "lead people to become fully-devoted followers of Christ." I worked alongside their Central Information Technology team: a group dedicated to utilizing technology to serve and equip the church.',
  roles: ['Spent time learning from hardware, software, and database teams in an Agile environment.', 'Designed and developed a web application for remote volunteer tracking with Node.js and PostgreSQL.', 'Dynamically deployed application to Google Cloud Platform using Cloud Builds, Docker, and Kubernetes.']
}];

},{"core-js/modules/es6.object.define-property":117}],153:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Projects = void 0;
exports.Projects = [{
  name: 'Aether',
  color: '#1C1C67',
  image: 'aether.jpg',
  type: 'Side Project',
  date: 'Spring 2020',
  award: null,
  flavor: 'TCP proxy server for viewing and intercepting web traffic.',
  repo: 'https://github.com/jackson-nestelroad/aether-proxy',
  external: null,
  details: ['Implemented with C++ using the Boost.Asio library.', 'Multithreaded HTTP parsing and forwarding.', 'TCP tunneling for HTTPS/TLS and WebSockets.']
}, {
  name: 'AR Sphere',
  color: '#DB4F54',
  image: 'ar-sphere.jpg',
  type: 'ACM Ignite',
  date: 'Fall 2019',
  award: 'First place for Fall 2019 ACM Ignite',
  flavor: 'Mobile application to place persistent AR models and experiences across the globe.',
  repo: 'https://github.com/jackson-nestelroad/ar-sphere-server',
  external: null,
  details: ['Semester-long team entrepreneurial project.', 'Lead server developer with C#, ASP.NET Core MVC, and Entity Framework.', 'Stream continuous data and real-time updates with SignalR.', 'Saves geographical data with Azure Spatial Anchors.', 'Deployed to Microsoft Azure with SQL Server and Blob Storage.']
}, {
  name: 'Portfolio Website',
  color: '#29AB87',
  image: 'portfolio-website.jpg',
  type: 'Side Project',
  date: 'Spring/Summer 2019',
  award: null,
  flavor: 'Personal website to showcase my work and experience.',
  repo: 'https://github.com/jackson-nestelroad/portfolio-website',
  external: 'https://jackson.nestelroad.com',
  details: ['Implemented from scratch with pure TypeScript.', 'Custom-made, dynamic SCSS library.', 'Class-based, easy-to-update JSX rendering for recurring content.', 'Supports Internet Explorer 11.']
}, {
  name: 'Ponder',
  color: '#FFA500',
  image: 'ponder.jpg',
  type: 'Side Project',
  date: 'HackUTD 2019',
  award: '"Best UI/UX" for HackUTD 2019',
  flavor: 'Web and mobile application to make group brainstorming organized and efficient.',
  repo: 'https://github.com/jackson-nestelroad/ponder-hackutd-19',
  external: null,
  details: ['Implemented with React and Firebase Realtime Database.', 'Complete connection and realtime updates with mobile counterpart.']
}, {
  name: 'Key Consumer',
  color: '#7A69AD',
  image: 'key-consumer.jpg',
  type: 'Side Project',
  date: 'January 2019',
  award: null,
  flavor: 'Windows command to attach a low-level keyboard hook in another running process.',
  repo: 'https://github.com/jackson-nestelroad/key-consumer',
  external: null,
  details: ['Implemented with C++ and Windows API.', 'Attaches .dll file to another process to avoid detection.', 'Intercepts and changes key inputs on the fly.']
}, {
  name: 'Comet Climate API',
  color: '#2D87C6',
  image: 'comet-climate.jpg',
  type: 'Class Project',
  date: 'November 2018',
  award: null,
  flavor: 'Self-updating API to collect current weather and Twitter data for the University of Texas at Dallas.',
  repo: 'https://github.com/jackson-nestelroad/comet-climate-server',
  external: null,
  details: ['Implemented with C# and the ASP.NET Core MVC.', 'Deployed to Heroku with PostgreSQL database.', 'Always returns data less than 10 minutes old.']
}, {
  name: 'Christ-Centered',
  color: '#FE904E',
  image: 'christ-centered.jpg',
  type: 'Side Project',
  date: 'Fall 2018',
  award: null,
  flavor: 'Google Chrome extension to deliver the YouVersion Verse of the Day to your new tab.',
  repo: 'https://github.com/jackson-nestelroad/christ-centered',
  external: 'http://bit.ly/christ-centered',
  details: ['Implemented with React and Chrome API.', 'Custom verse searching by keyword or number.', 'Gives current weather for user\'s location via the OpenWeatherMap API.']
}];

},{"core-js/modules/es6.object.define-property":117}],154:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Qualities = void 0;
exports.Qualities = [{
  faClass: 'fas fa-history',
  name: 'Efficient',
  description: 'I consistently bring energy, productivity, organization, and agility to the table as an effective worker and a quick learner.'
}, {
  faClass: 'far fa-snowflake',
  name: 'Attentive',
  description: 'To me, every detail matters. I love formulating the big picture just as much as measuring out the tiny details and edge cases.'
}, {
  faClass: 'fas fa-feather-alt',
  name: 'Flexible',
  description: 'I work best when I am challenged. While I thrive in organization, I can always adapt and pick up new things in a swift manner.'
}];

},{"core-js/modules/es6.object.define-property":117}],155:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Skills = void 0;

var Skill_1 = require("../Classes/Elements/Skill");

exports.Skills = [{
  name: 'Amazon Web Services',
  svg: 'aws',
  color: '#232F3E',
  category: Skill_1.SkillCategory.DevOps
}, {
  name: 'Angular',
  svg: 'angular',
  color: '#DD0031',
  category: Skill_1.SkillCategory.Web | Skill_1.SkillCategory.Framework
}, {
  name: 'C++',
  svg: 'cplusplus',
  color: '#9B023A',
  category: Skill_1.SkillCategory.Programming | Skill_1.SkillCategory.Server
}, {
  name: 'C#',
  svg: 'csharp',
  color: '#9B4F97',
  category: Skill_1.SkillCategory.Programming | Skill_1.SkillCategory.Server
}, {
  name: 'CSS',
  svg: 'css',
  color: '#3C9CD7',
  category: Skill_1.SkillCategory.Web
}, {
  name: 'Docker',
  svg: 'docker',
  color: '#22B9EC',
  category: Skill_1.SkillCategory.DevOps
}, {
  name: '.NET Core/Framework',
  svg: 'dotnet',
  color: '#0F76BD',
  category: Skill_1.SkillCategory.Programming | Skill_1.SkillCategory.Server | Skill_1.SkillCategory.Framework
}, {
  name: 'Express JS',
  svg: 'express',
  color: '#3D3D3D',
  category: Skill_1.SkillCategory.Server | Skill_1.SkillCategory.Framework
}, {
  name: 'Figma',
  svg: 'figma',
  color: '#F24E1E',
  category: Skill_1.SkillCategory.Other
}, {
  name: 'Firebase',
  svg: 'firebase',
  color: '#FFCA28',
  category: Skill_1.SkillCategory.Database
}, {
  name: 'Git',
  svg: 'git',
  color: '#F05032',
  category: Skill_1.SkillCategory.Programming
}, {
  name: 'GNU Bash',
  svg: 'bash',
  color: '#2B3539',
  category: Skill_1.SkillCategory.Scripting
}, {
  name: 'Google Cloud Platform',
  svg: 'gcp',
  color: '#4386FA',
  category: Skill_1.SkillCategory.DevOps
}, {
  name: 'Gulp',
  svg: 'gulp',
  color: '#DA4648',
  category: Skill_1.SkillCategory.Web
}, {
  name: 'Heroku',
  svg: 'heroku',
  color: '#6762A6',
  category: Skill_1.SkillCategory.DevOps
}, {
  name: 'HTML',
  svg: 'html',
  color: '#EF652A',
  category: Skill_1.SkillCategory.Web
}, {
  name: 'Java',
  svg: 'java',
  color: '#007699',
  category: Skill_1.SkillCategory.Programming | Skill_1.SkillCategory.Server
}, {
  name: 'JavaScript',
  svg: 'javascript',
  color: '#F0DB4F',
  category: Skill_1.SkillCategory.Web | Skill_1.SkillCategory.Programming
}, {
  name: 'Jest',
  svg: 'jest',
  color: '#C21325',
  category: Skill_1.SkillCategory.Web
}, {
  name: 'Kubernetes',
  svg: 'kubernetes',
  color: '#356DE6',
  category: Skill_1.SkillCategory.DevOps
}, {
  name: 'Microsoft Azure',
  svg: 'azure',
  color: '#0089D6',
  category: Skill_1.SkillCategory.DevOps
}, {
  name: 'Node.js',
  svg: 'nodejs',
  color: '#8CC84B',
  category: Skill_1.SkillCategory.Programming | Skill_1.SkillCategory.Server
}, {
  name: 'PostgreSQL',
  svg: 'postgresql',
  color: '#326690',
  category: Skill_1.SkillCategory.Database
}, {
  name: 'Python',
  svg: 'python',
  color: '#3776AB',
  category: Skill_1.SkillCategory.Programming | Skill_1.SkillCategory.Scripting | Skill_1.SkillCategory.Server
}, {
  name: 'React',
  svg: 'react',
  color: '#00D8FF',
  category: Skill_1.SkillCategory.Web | Skill_1.SkillCategory.Framework
}, {
  name: 'R Language',
  svg: 'rlang',
  color: '#2369BC',
  category: Skill_1.SkillCategory.Programming
}, {
  name: 'SASS/SCSS',
  svg: 'sass',
  color: '#CD669A',
  category: Skill_1.SkillCategory.Web
}, {
  name: 'Spring',
  svg: 'spring',
  color: '#6DB33F',
  category: Skill_1.SkillCategory.Framework | Skill_1.SkillCategory.Server
}, {
  name: 'SQL',
  svg: 'sql',
  color: '#F89700',
  category: Skill_1.SkillCategory.Database
}, {
  name: 'TypeScript',
  svg: 'typescript',
  color: '#007ACC',
  category: Skill_1.SkillCategory.Web | Skill_1.SkillCategory.Programming
}, {
  name: 'Vue.js',
  svg: 'vue',
  color: '#4FC08D',
  category: Skill_1.SkillCategory.Web | Skill_1.SkillCategory.Framework
}];

},{"../Classes/Elements/Skill":147,"core-js/modules/es6.object.define-property":117}],156:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Social = void 0;
exports.Social = [{
  name: 'GitHub',
  faClass: 'fab fa-github',
  link: 'https://github.com/jackson-nestelroad'
}, {
  name: 'LinkedIn',
  faClass: 'fab fa-linkedin',
  link: 'https://www.linkedin.com/in/jacksonroad7/'
}, {
  name: 'Email',
  faClass: 'fas fa-envelope',
  link: 'mailto:jackson@nestelroad.com'
}];

},{"core-js/modules/es6.object.define-property":117}],157:[function(require,module,exports){
"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.string.starts-with");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.keys");

require("core-js/modules/es6.object.define-property");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ElementFactory = void 0;
var ElementFactory;

(function (ElementFactory) {
  var Fragment = '<></>';

  function createElement(tagName, attributes) {
    var children = [];

    for (var _i = 2; _i < arguments.length; _i++) {
      children[_i - 2] = arguments[_i];
    }

    if (tagName === Fragment) {
      return document.createDocumentFragment();
    }

    var element = document.createElement(tagName);

    if (attributes) {
      for (var _a = 0, _b = Object.keys(attributes); _a < _b.length; _a++) {
        var key = _b[_a];
        var attributeValue = attributes[key];

        if (key === 'className') {
          element.setAttribute('class', attributeValue);
        } else if (key === 'style') {
          if (_typeof(attributeValue) === 'object') {
            element.setAttribute('style', JStoCSS(attributeValue));
          } else {
            element.setAttribute('style', attributeValue);
          }
        } else if (key.startsWith('on') && typeof attributeValue === 'function') {
          element.addEventListener(key.substring(2).toLowerCase(), attributeValue);
        } else {
          if (typeof attributeValue === 'boolean' && attributeValue) {
            element.setAttribute(key, '');
          } else {
            element.setAttribute(key, attributeValue);
          }
        }
      }
    }

    for (var _c = 0, children_1 = children; _c < children_1.length; _c++) {
      var child = children_1[_c];
      appendChild(element, child);
    }

    return element;
  }

  ElementFactory.createElement = createElement;

  function appendChild(parent, child) {
    if (typeof child === 'undefined' || child === null) {
      return;
    }

    if (Array.isArray(child)) {
      for (var _i = 0, child_1 = child; _i < child_1.length; _i++) {
        var value = child_1[_i];
        appendChild(parent, value);
      }
    } else if (typeof child === 'string') {
      parent.appendChild(document.createTextNode(child));
    } else if (child instanceof Node) {
      parent.appendChild(child);
    } else if (typeof child === 'boolean') {} else {
      parent.appendChild(document.createTextNode(String(child)));
    }
  }

  ElementFactory.appendChild = appendChild;

  function JStoCSS(cssObject) {
    var cssString = "";
    var rule;
    var rules = Object.keys(cssObject);

    for (var i = 0; i < rules.length; i++, cssString += ' ') {
      rule = rules[i];
      cssString += rule.replace(/([A-Z])/g, function (upper) {
        return "-" + upper[0].toLowerCase();
      }) + ": " + cssObject[rule] + ";";
    }

    return cssString;
  }
})(ElementFactory = exports.ElementFactory || (exports.ElementFactory = {}));

},{"core-js/modules/es6.array.is-array":106,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.keys":118,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.regexp.replace":126,"core-js/modules/es6.string.starts-with":131,"core-js/modules/es6.symbol":132,"core-js/modules/es7.symbol.async-iterator":135,"core-js/modules/web.dom.iterable":136}],158:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var About_1 = require("../Data/About");

var Qualities_1 = require("../Data/Qualities");

var Quality_1 = require("../Classes/Elements/Quality");

DOM_1.DOM.load().then(function (document) {
  WebPage_1.FlavorText.innerText = About_1.AboutMe;
});
DOM_1.DOM.load().then(function (document) {
  var object;

  for (var _i = 0, Qualities_2 = Qualities_1.Qualities; _i < Qualities_2.length; _i++) {
    var quality = Qualities_2[_i];
    object = new Quality_1.Quality(quality);
    object.appendTo(WebPage_1.QualitiesContainer);
  }
});

},{"../Classes/Elements/Quality":145,"../Data/About":150,"../Data/Qualities":154,"../Modules/DOM":170,"../Modules/WebPage":173,"core-js/modules/es6.object.define-property":117}],159:[function(require,module,exports){
"use strict";

},{}],160:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

WebPage_1.Body.addEventListener('touchstart', function () {}, {
  capture: true,
  passive: true
});

},{"../Modules/WebPage":173,"core-js/modules/es6.object.define-property":117}],161:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Social_1 = require("../Classes/Elements/Social");

var Social_2 = require("../Data/Social");

DOM_1.DOM.load().then(function (document) {
  var card;

  for (var _i = 0, Data_1 = Social_2.Social; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Social_1.Social(data);
    card.appendTo(WebPage_1.SocialGrid);
  }
});

},{"../Classes/Elements/Social":149,"../Data/Social":156,"../Modules/DOM":170,"../Modules/WebPage":173,"core-js/modules/es6.object.define-property":117}],162:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

DOM_1.DOM.load().then(function (document) {
  DOM_1.DOM.getFirstElement('#connect .footer .copyright .year').innerText = new Date().getFullYear().toString();
});

},{"../Modules/DOM":170,"core-js/modules/es6.date.to-string":110,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.regexp.to-string":127}],163:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Education_1 = require("../Classes/Elements/Education");

var Education_2 = require("../Data/Education");

DOM_1.DOM.load().then(function (document) {
  var EducationSection = WebPage_1.Sections.get('education').element;
  var card;

  for (var _i = 0, Data_1 = Education_2.Education; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Education_1.Education(data);
    card.appendTo(EducationSection);
  }
});

},{"../Classes/Elements/Education":140,"../Data/Education":151,"../Modules/DOM":170,"../Modules/WebPage":173,"core-js/modules/es6.object.define-property":117}],164:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Experience_1 = require("../Classes/Elements/Experience");

var Experience_2 = require("../Data/Experience");

DOM_1.DOM.load().then(function (document) {
  var ExperienceSection = WebPage_1.Sections.get('experience').element;
  var card;

  for (var _i = 0, Data_1 = Experience_2.Experience; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Experience_1.Experience(data);
    card.appendTo(ExperienceSection);
  }
});

},{"../Classes/Elements/Experience":141,"../Data/Experience":152,"../Modules/DOM":170,"../Modules/WebPage":173,"core-js/modules/es6.object.define-property":117}],165:[function(require,module,exports){
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

},{"../Modules/DOM":170,"../Modules/WebPage":173,"core-js/modules/es6.object.define-property":117}],166:[function(require,module,exports){
"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

WebPage_1.MenuButton.subscribe(WebPage_1.Main, function (event) {
  if (event.name === 'toggle') {
    if (event.detail.open) {
      WebPage_1.Main.setAttribute('shifted', '');
    } else {
      WebPage_1.Main.removeAttribute('shifted');
    }
  }
});
WebPage_1.ScrollHook.addEventListener('scroll', function (event) {
  var _a;

  var section;
  var anchor;
  var iter = WebPage_1.SectionToMenu.values();
  var current = iter.next();

  for (var done = false; !done; current = iter.next(), done = current.done) {
    _a = current.value, section = _a[0], anchor = _a[1];

    if (section.inView()) {
      anchor.setAttribute('selected', '');
    } else {
      anchor.removeAttribute('selected');
    }
  }
}, {
  capture: true,
  passive: true
});

},{"../Modules/WebPage":173,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.function.name":112,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/web.dom.iterable":136}],167:[function(require,module,exports){
"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

document.addEventListener('scroll', function (event) {
  WebPage_1.MenuButton.updateContrast();
}, {
  capture: true,
  passive: true
});
WebPage_1.MenuButton.Hamburger.addEventListener('click', function () {
  WebPage_1.MenuButton.toggle();
});
var iter = WebPage_1.SectionToMenu.values();
var current = iter.next();

var _loop_1 = function _loop_1(done) {
  var _a;

  var section;
  var anchor = void 0;
  _a = current.value, section = _a[0], anchor = _a[1];
  anchor.addEventListener('click', function (event) {
    event.preventDefault();
    section.element.scrollIntoView({
      behavior: 'smooth'
    });
  });
};

for (var done = false; !done; current = iter.next(), done = current.done) {
  _loop_1(done);
}

},{"../Modules/WebPage":173,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/web.dom.iterable":136}],168:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Project_1 = require("../Classes/Elements/Project");

var Projects_1 = require("../Data/Projects");

DOM_1.DOM.load().then(function () {
  var ProjectsContainer = WebPage_1.Sections.get('projects').element.querySelector('.projects-container');
  var card;

  for (var _i = 0, Data_1 = Projects_1.Projects; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Project_1.Project(data);
    card.appendTo(ProjectsContainer);
  }
});

},{"../Classes/Elements/Project":144,"../Data/Projects":153,"../Modules/DOM":170,"../Modules/WebPage":173,"core-js/modules/es6.object.define-property":117}],169:[function(require,module,exports){
arguments[4][159][0].apply(exports,arguments)
},{"dup":159}],170:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.regexp.replace");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es7.object.values");

require("core-js/modules/es6.array.is-array");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.regexp.match");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DOM = void 0;
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
      height: Math.max(window.innerHeight, document.documentElement.clientHeight),
      width: Math.max(window.innerWidth, document.documentElement.clientWidth)
    };
  }

  DOM.getViewport = getViewport;

  function getCenterOfViewport() {
    var _a = getViewport(),
        height = _a.height,
        width = _a.width;

    return {
      x: width / 2,
      y: height / 2
    };
  }

  DOM.getCenterOfViewport = getCenterOfViewport;

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

  function boundingClientRectToObject(rect) {
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      x: rect.x ? rect.x : 0,
      y: rect.y ? rect.y : 0
    };
  }

  function onPage(element) {
    var rect = element.getBoundingClientRect();
    return !Object.values(boundingClientRectToObject(rect)).every(function (val) {
      return val === 0;
    });
  }

  DOM.onPage = onPage;

  function getDOMName(element) {
    var str = element.tagName.toLowerCase();

    if (element.id) {
      str += '#' + element.id;
    }

    if (element.className) {
      str += '.' + element.className.replace(/ /g, '.');
    }

    return str;
  }

  DOM.getDOMName = getDOMName;

  function getDOMPath(element) {
    if (!element) {
      return [];
    }

    var path = [element];

    while (element = element.parentElement) {
      if (element.tagName.toLowerCase() === 'html') {
        break;
      }

      path.unshift(element);
    }

    return path;
  }

  DOM.getDOMPath = getDOMPath;

  function getDOMPathNames(element) {
    var path = getDOMPath(element);

    if (path.length === 0) {
      return [];
    }

    return path.map(function (element) {
      return getDOMName(element);
    });
  }

  DOM.getDOMPathNames = getDOMPathNames;

  function getCSSSelector(element, condense) {
    if (condense === void 0) {
      condense = true;
    }

    var names = getDOMPathNames(element);

    if (!condense || names.length <= 6) {
      return names.join(' > ');
    }

    var length = names.length;
    var begin = names.slice(0, 3);
    var end = names.slice(length - 3, length);
    return begin.join(' > ') + " > ... > " + end.join(' > ');
  }

  DOM.getCSSSelector = getCSSSelector;

  function getChildOffsetPosForContainer(container, child, caller) {
    if (caller === void 0) {
      caller = '';
    }

    var offsetTop = 0;
    var offsetLeft = 0;
    var curr = child;

    while (curr && curr !== container) {
      offsetTop += curr.offsetTop;
      offsetLeft += curr.offsetLeft;
      curr = curr.offsetParent;
    }

    if (!curr) {
      throw new Error((caller ? caller + " => " : '') + "\"" + getCSSSelector(child) + "\" does not contain \"" + getCSSSelector(container) + "\" as an offset parent. Check that the container has \"position: relative\" set or that it is in the DOM path.");
    }

    return {
      offsetTop: offsetTop,
      offsetLeft: offsetLeft
    };
  }

  DOM.getChildOffsetPosForContainer = getChildOffsetPosForContainer;

  function lines(top1, size1, top2, size2, offset) {
    return [top1 - offset, top1 - offset + size1, top2, top2 + size2];
  }

  function xyOffset(xOffset, yOffset, width, height) {
    if (xOffset && xOffset <= 1) {
      xOffset = width * xOffset;
    } else {
      xOffset = 0;
    }

    if (yOffset && yOffset <= 1) {
      yOffset = height * yOffset;
    } else {
      yOffset = 0;
    }

    return {
      xOffset: xOffset,
      yOffset: yOffset
    };
  }

  function inOffsetView(child, settings) {
    if (settings === void 0) {
      settings = {};
    }

    var container;
    var offsetTop;
    var offsetLeft;

    if (!settings.container) {
      container = child.offsetParent;

      if (!container) {
        throw new Error('inOffsetView(child, ...) => child.offsetParent cannot be null. Check that it is in a container with "position: relative" set.');
      }

      offsetTop = child.offsetTop;
      offsetLeft = child.offsetLeft;
    } else {
      var result = getChildOffsetPosForContainer(settings.container, child, 'inOffsetView(child, ...)');
      offsetTop = result.offsetTop;
      offsetLeft = result.offsetLeft;
    }

    var childRect = child.getBoundingClientRect();

    if (Object.values(boundingClientRectToObject(childRect)).every(function (val) {
      return val === 0;
    })) {
      return false;
    }

    var containerRect = container.getBoundingClientRect();

    var _a = xyOffset(settings.xOffset, settings.yOffset, containerRect.width, containerRect.height),
        xOffset = _a.xOffset,
        yOffset = _a.yOffset;

    var x = true;
    var y = true;

    if (!settings.ignoreY) {
      var _b = lines(container.scrollTop, containerRect.height, offsetTop, childRect.height, yOffset),
          containerTopLine = _b[0],
          containerBottomLine = _b[1],
          childTopLine = _b[2],
          childBottomLine = _b[3];

      y = settings.whole ? childBottomLine < containerBottomLine && childTopLine > containerTopLine : childBottomLine > containerTopLine && childTopLine < containerBottomLine;
    }

    if (!settings.ignoreX) {
      var _c = lines(container.scrollLeft, containerRect.width, offsetLeft, childRect.width, xOffset),
          containerLeftLine = _c[0],
          containerRightLine = _c[1],
          childLeftLine = _c[2],
          childRightLine = _c[3];

      x = settings.whole ? childRightLine < containerRightLine && childLeftLine > containerLeftLine : childRightLine > containerLeftLine && childLeftLine < containerRightLine;
    }

    return x && y;
  }

  DOM.inOffsetView = inOffsetView;

  function scrollTo(container, left, top, settings) {
    if (settings === void 0) {
      settings = {};
    }

    if (isIE()) {
      container.scrollLeft = left;
      container.scrollTop = top;
    } else {
      container.scrollTo({
        left: left,
        top: top,
        behavior: settings.smooth ? 'smooth' : 'auto'
      });
    }
  }

  function scrollContainerToViewWholeChild(container, child, settings) {
    if (settings === void 0) {
      settings = {};
    }

    var result = getChildOffsetPosForContainer(container, child, 'scrollContainerToViewChildWhole(...)');
    var offsetTop = result.offsetTop;
    var offsetLeft = result.offsetLeft;
    var containerRect = container.getBoundingClientRect();
    var childRect = child.getBoundingClientRect();

    var _a = xyOffset(settings.xOffset, settings.yOffset, containerRect.width, containerRect.height),
        xOffset = _a.xOffset,
        yOffset = _a.yOffset;

    var _b = lines(container.scrollTop, containerRect.height, offsetTop, childRect.height, yOffset),
        containerTopLine = _b[0],
        containerBottomLine = _b[1],
        childTopLine = _b[2],
        childBottomLine = _b[3];

    var _c = lines(container.scrollLeft, containerRect.width, offsetLeft, childRect.width, xOffset),
        containerLeftLine = _c[0],
        containerRightLine = _c[1],
        childLeftLine = _c[2],
        childRightLine = _c[3];

    var x = container.scrollLeft;
    var y = container.scrollTop;

    if (!settings.ignoreY) {
      var above = childTopLine < containerTopLine;
      var below = childBottomLine > containerBottomLine;

      if (above && !below) {
        y = childTopLine;
      } else if (!above && below) {
        y += childBottomLine - containerBottomLine;
      }
    }

    if (!settings.ignoreX) {
      var left = childLeftLine < containerLeftLine;
      var right = childRightLine > containerRightLine;

      if (left && !right) {
        x = childLeftLine;
      } else if (!left && right) {
        x += childRightLine - containerRightLine;
      }
    }

    scrollTo(container, x, y, settings);
  }

  DOM.scrollContainerToViewWholeChild = scrollContainerToViewWholeChild;

  function inVerticalWindowView(element, offset) {
    if (offset === void 0) {
      offset = 0;
    }

    var rect = element.getBoundingClientRect();

    if (Object.values(boundingClientRectToObject(rect)).every(function (val) {
      return val === 0;
    })) {
      return false;
    }

    var viewHeight = getViewport().height;

    if (offset <= 1) {
      offset = viewHeight * offset;
    }

    return rect.bottom + offset >= 0 && rect.top + offset - viewHeight < 0;
  }

  DOM.inVerticalWindowView = inVerticalWindowView;

  function pixelsBelowScreenTop(element) {
    return element.getBoundingClientRect().top;
  }

  DOM.pixelsBelowScreenTop = pixelsBelowScreenTop;

  function pixelsAboveScreenBottom(element) {
    var rect = element.getBoundingClientRect();
    var viewHeight = getViewport().height;
    return viewHeight - rect.bottom;
  }

  DOM.pixelsAboveScreenBottom = pixelsAboveScreenBottom;

  function onFirstAppearance(element, callback, setting) {
    var timeout = setting ? setting.timeout : 0;
    var offset = setting ? setting.offset : 0;

    if (inVerticalWindowView(element, offset)) {
      setTimeout(callback, timeout);
    } else {
      var eventCallback_1 = function eventCallback_1(event) {
        if (inVerticalWindowView(element, offset)) {
          setTimeout(callback, timeout);
          document.removeEventListener('scroll', eventCallback_1, {
            capture: true
          });
        }
      };

      document.addEventListener('scroll', eventCallback_1, {
        capture: true,
        passive: true
      });
    }
  }

  DOM.onFirstAppearance = onFirstAppearance;

  function getPathToRoot(element) {
    var path = [];
    var curr = element;

    while (curr) {
      path.push(curr);
      curr = curr.parentElement;
    }

    if (path.indexOf(window) === -1 && path.indexOf(document) === -1) {
      path.push(document);
    }

    if (path.indexOf(window) === -1) {
      path.push(window);
    }

    return path;
  }

  DOM.getPathToRoot = getPathToRoot;
})(DOM = exports.DOM || (exports.DOM = {}));

},{"core-js/modules/es6.array.index-of":105,"core-js/modules/es6.array.is-array":106,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.array.map":108,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.promise":121,"core-js/modules/es6.regexp.match":125,"core-js/modules/es6.regexp.replace":126,"core-js/modules/es7.object.values":134,"core-js/modules/web.dom.iterable":136}],171:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.map");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.set");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Events = void 0;
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
      this.events["delete"](name);
    };

    EventDispatcher.prototype.subscribe = function (element, callback) {
      this.listeners.set(element, callback);
    };

    EventDispatcher.prototype.unsubscribe = function (element) {
      this.listeners["delete"](element);
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

},{"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.function.name":112,"core-js/modules/es6.map":113,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.set":128,"core-js/modules/es6.string.iterator":129,"core-js/modules/web.dom.iterable":136}],172:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SVG = void 0;
var SVG;

(function (SVG) {
  SVG.svgns = 'http://www.w3.org/2000/svg';
  SVG.xlinkns = 'http://www.w3.org/1999/xlink';

  SVG.loadSVG = function (url) {
    return new Promise(function (resolve, reject) {
      var request = new XMLHttpRequest();
      request.open('GET', url + ".svg", true);

      request.onload = function () {
        var parser = new DOMParser();
        var parsedDocument = parser.parseFromString(request.responseText, 'image/svg+xml');
        resolve(parsedDocument.querySelector('svg'));
      };

      request.onerror = function () {
        reject("Failed to read SVG.");
      };

      request.send();
    });
  };
})(SVG = exports.SVG || (exports.SVG = {}));

},{"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.promise":121}],173:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.from");

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.string.iterator");

require("core-js/modules/es6.map");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SocialGrid = exports.SkillsGrid = exports.QualitiesContainer = exports.FlavorText = exports.Background = exports.SectionToMenu = exports.Sections = exports.SkillsFilterObject = exports.MenuButton = exports.Logo = exports.ScrollHook = exports.MainScroll = exports.Main = exports.Body = void 0;

var DOM_1 = require("./DOM");

var Section_1 = require("../Classes/Elements/Section");

var Menu_1 = require("../Classes/Elements/Menu");

var SkillsFilter_1 = require("../Classes/Elements/SkillsFilter");

exports.Body = DOM_1.DOM.getFirstElement('body');
exports.Main = DOM_1.DOM.getFirstElement('main');
exports.MainScroll = DOM_1.DOM.getFirstElement('main .scroll');
exports.ScrollHook = DOM_1.DOM.isIE() ? window : exports.MainScroll;
exports.Logo = {
  Outer: DOM_1.DOM.getFirstElement('header.logo .image img.outer'),
  Inner: DOM_1.DOM.getFirstElement('header.logo .image img.inner')
};
exports.MenuButton = new Menu_1.Menu();
exports.SkillsFilterObject = new SkillsFilter_1.SkillsFilter();
exports.Sections = new Map();

for (var _i = 0, _a = Array.from(DOM_1.DOM.getElements('section')); _i < _a.length; _i++) {
  var element = _a[_i];
  exports.Sections.set(element.id, new Section_1["default"](element));
}

exports.SectionToMenu = new Map();

for (var _b = 0, _c = Array.from(DOM_1.DOM.getElements('header.navigation .sections a')); _b < _c.length; _b++) {
  var anchor = _c[_b];
  var id = anchor.getAttribute('href').substr(1);

  if (exports.Sections.get(id) && exports.Sections.get(id).inMenu()) {
    exports.SectionToMenu.set(id, [exports.Sections.get(id), anchor]);
  }
}

exports.Background = DOM_1.DOM.getFirstElement('bg');
exports.FlavorText = DOM_1.DOM.getFirstElement('section#about .flavor');
exports.QualitiesContainer = DOM_1.DOM.getFirstElement('section#about .qualities');
exports.SkillsGrid = DOM_1.DOM.getFirstElement('section#skills .hex-grid');
exports.SocialGrid = DOM_1.DOM.getFirstElement('section#connect .social-icons');

},{"../Classes/Elements/Menu":143,"../Classes/Elements/Section":146,"../Classes/Elements/SkillsFilter":148,"./DOM":170,"core-js/modules/es6.array.from":104,"core-js/modules/es6.array.iterator":107,"core-js/modules/es6.map":113,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.string.iterator":129,"core-js/modules/web.dom.iterable":136}],174:[function(require,module,exports){
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

exports["default"] = Animation;

},{"core-js/modules/es6.object.define-property":117}],175:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AnimationFrameFunctions = void 0;
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

},{"core-js/modules/es6.object.define-property":117}],176:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

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

exports["default"] = Color;

},{"core-js/modules/es6.date.to-string":110,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.regexp.to-string":127}],177:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

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

exports["default"] = Coordinate;

},{"core-js/modules/es6.date.to-string":110,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.regexp.to-string":127}],178:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":117}],179:[function(require,module,exports){
"use strict";

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.array.index-of");

require("core-js/modules/es6.object.define-property");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

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
        return Color_1["default"].fromRGB(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
      } else {
        return Color_1["default"].fromHex(color);
      }
    } else if (_typeof(color) === 'object') {
      if (color instanceof Color_1["default"]) {
        return color;
      } else if (color instanceof Array) {
        return this.createColor(color[Math.floor(Math.random() * color.length)]);
      } else {
        return Color_1["default"].fromObject(color);
      }
    }

    return Color_1["default"].fromRGB(0, 0, 0);
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
        return new Vector_1["default"](0, 0);
      }
    } else if (_typeof(move) === 'object') {
      var velocity = void 0;

      switch (move.direction) {
        case 'top':
          velocity = new Vector_1["default"](0, -1);
          break;

        case 'top-right':
          velocity = new Vector_1["default"](0.7, -0.7);
          break;

        case 'right':
          velocity = new Vector_1["default"](1, 0);
          break;

        case 'bottom-right':
          velocity = new Vector_1["default"](0.7, 0.7);
          break;

        case 'bottom':
          velocity = new Vector_1["default"](0, 1);
          break;

        case 'bottom-left':
          velocity = new Vector_1["default"](-0.7, 0.7);
          break;

        case 'left':
          velocity = new Vector_1["default"](-1, 0);
          break;

        case 'top-left':
          velocity = new Vector_1["default"](-0.7, -0.7);
          break;

        default:
          velocity = new Vector_1["default"](0, 0);
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

    return new Vector_1["default"](0, 0);
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
          return new Stroke_1["default"](stroke.width, this.createColor(stroke.color));
        }
      }
    }

    return new Stroke_1["default"](0, Color_1["default"].fromRGB(0, 0, 0));
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
      return new Animation_1["default"](speed, max, min);
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
      return new Animation_1["default"](speed, max, min);
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
        return new Coordinate_1["default"](this.position.x, this.position.y - this.getRadius());

      case 'right':
        return new Coordinate_1["default"](this.position.x + this.getRadius(), this.position.y);

      case 'bottom':
        return new Coordinate_1["default"](this.position.x, this.position.y + this.getRadius());

      case 'left':
        return new Coordinate_1["default"](this.position.x - this.getRadius(), this.position.y);

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

exports["default"] = Particle;

},{"./Animation":174,"./Color":176,"./Coordinate":177,"./Stroke":182,"./Vector":183,"core-js/modules/es6.array.index-of":105,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.symbol":132,"core-js/modules/es7.symbol.async-iterator":135}],180:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":117}],181:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.fill");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.regexp.to-string");

require("core-js/modules/es6.date.to-string");

require("core-js/modules/es6.object.to-string");

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
    this.state = 'stopped';
    this.pixelRatioLimit = 8;
    this.pixelRatio = 1;
    this.particles = new Array();
    this.mouse = {
      position: new Coordinate_1["default"](0, 0),
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
    return new Coordinate_1["default"](Math.random() * this.canvas.width, Math.random() * this.canvas.height);
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
      particle = new Particle_1["default"](this.particleSettings);

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
            particle.setPosition(new Coordinate_1["default"](this.width + particle.getRadius(), Math.random() * this.height));
          } else if (particle.edge('left').x > this.width) {
            particle.setPosition(new Coordinate_1["default"](-1 * particle.getRadius(), Math.random() * this.height));
          }

          if (particle.edge('bottom').y < 0) {
            particle.setPosition(new Coordinate_1["default"](Math.random() * this.width, this.height + particle.getRadius()));
          } else if (particle.edge('top').y > this.height) {
            particle.setPosition(new Coordinate_1["default"](Math.random() * this.width, -1 * particle.getRadius()));
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
    if (this.state !== 'stopped') {
      throw 'Cannot change settings while Canvas is running.';
    } else {
      this.particleSettings = settings;
    }
  };

  Particles.prototype.setInteractiveSettings = function (settings) {
    if (this.state !== 'stopped') {
      throw 'Cannot change settings while Canvas is running.';
    } else {
      this.interactiveSettings = settings;
    }
  };

  Particles.prototype.start = function () {
    if (this.particleSettings === null) throw 'Particle settings must be initalized before Canvas can start.';
    if (this.state !== 'stopped') throw 'Canvas is already running.';
    this.state = 'running';
    this.initialize();
    this.draw();
  };

  Particles.prototype.pause = function () {
    if (this.state === 'stopped') {
      throw 'No Particles to pause.';
    }

    this.state = 'paused';
    this.moveSettings = this.particleSettings.move;
    this.particleSettings.move = false;
  };

  Particles.prototype.resume = function () {
    if (this.state === 'stopped') {
      throw 'No Particles to resume.';
    }

    this.state = 'running';
    this.particleSettings.move = this.moveSettings;
    this.draw();
  };

  Particles.prototype.stop = function () {
    this.state = 'stopped';
    this.stopDrawing();
  };

  return Particles;
}();

exports["default"] = Particles;

},{"../Modules/DOM":170,"./AnimationFrameFunctions":175,"./Coordinate":177,"./Particle":179,"core-js/modules/es6.array.fill":101,"core-js/modules/es6.array.map":108,"core-js/modules/es6.date.to-string":110,"core-js/modules/es6.function.bind":111,"core-js/modules/es6.object.define-property":117,"core-js/modules/es6.object.to-string":120,"core-js/modules/es6.regexp.to-string":127}],182:[function(require,module,exports){
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

exports["default"] = Stroke;

},{"core-js/modules/es6.object.define-property":117}],183:[function(require,module,exports){
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

exports["default"] = Vector;

},{"core-js/modules/es6.object.define-property":117}]},{},[137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,181,180,182,183])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWR2YW5jZS1zdHJpbmctaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1yZWR1Y2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZnVuY3Rpb24tdG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtcmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21ldGEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcGQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wbi1leHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdwby5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtcGllLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LXNhcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC10by1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3BlcmZvcm0uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9taXNlLXJlc29sdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19wcm9wZXJ0eS1kZXNjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUtYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWdleHAtZXhlYy1hYnN0cmFjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZ2V4cC1leGVjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXByb3RvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2V0LXNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaWN0LW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy1jb250ZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWh0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctdHJpbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3N0cmluZy13cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdXNlci1hZ2VudC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3ZhbGlkYXRlLWNvbGxlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MtZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbHRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZvci1lYWNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmluZGV4LW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuaXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5Lm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LnJlZHVjZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmRhdGUudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuZnVuY3Rpb24uYmluZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmZ1bmN0aW9uLm5hbWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5udW1iZXIuY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5leGVjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLmZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLm1hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmxpbmsuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5vYmplY3QuZW50cmllcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3Lm9iamVjdC52YWx1ZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJvdXQvdHMvQ2FudmFzL0NhbnZhcy5qcyIsIm91dC90cy9DYW52YXMvU3RhcnMuanMiLCJvdXQvdHMvQ2xhc3Nlcy9Db21wb25lbnQvaW5kZXguanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9FZHVjYXRpb24uanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9FeHBlcmllbmNlLmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvSGVscGVycy9pbmRleC5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL01lbnUuanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9Qcm9qZWN0LmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvUXVhbGl0eS5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NlY3Rpb24uanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbC5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NraWxsc0ZpbHRlci5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NvY2lhbC5qcyIsIm91dC90cy9EYXRhL0Fib3V0LmpzIiwib3V0L3RzL0RhdGEvRWR1Y2F0aW9uLmpzIiwib3V0L3RzL0RhdGEvRXhwZXJpZW5jZS5qcyIsIm91dC90cy9EYXRhL1Byb2plY3RzLmpzIiwib3V0L3RzL0RhdGEvUXVhbGl0aWVzLmpzIiwib3V0L3RzL0RhdGEvU2tpbGxzLmpzIiwib3V0L3RzL0RhdGEvU29jaWFsLmpzIiwib3V0L3RzL0RlZmluaXRpb25zL0pTWC5qcyIsIm91dC90cy9FdmVudHMvQWJvdXQuanMiLCJvdXQvdHMvRXZlbnRzL0JnLmpzIiwib3V0L3RzL0V2ZW50cy9Cb2R5LmpzIiwib3V0L3RzL0V2ZW50cy9Db25uZWN0LmpzIiwib3V0L3RzL0V2ZW50cy9Db3B5cmlnaHRZZWFyLmpzIiwib3V0L3RzL0V2ZW50cy9FZHVjYXRpb24uanMiLCJvdXQvdHMvRXZlbnRzL0V4cGVyaWVuY2UuanMiLCJvdXQvdHMvRXZlbnRzL0xvZ28uanMiLCJvdXQvdHMvRXZlbnRzL01haW4uanMiLCJvdXQvdHMvRXZlbnRzL01lbnUuanMiLCJvdXQvdHMvRXZlbnRzL1Byb2plY3RzLmpzIiwib3V0L3RzL01vZHVsZXMvRE9NLmpzIiwib3V0L3RzL01vZHVsZXMvRXZlbnREaXNwYXRjaGVyLmpzIiwib3V0L3RzL01vZHVsZXMvU1ZHLmpzIiwib3V0L3RzL01vZHVsZXMvV2ViUGFnZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQW5pbWF0aW9uLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9BbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQ29sb3IuanMiLCJvdXQvdHMvUGFydGljbGVzL0Nvb3JkaW5hdGUuanMiLCJvdXQvdHMvUGFydGljbGVzL01vdXNlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9QYXJ0aWNsZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvUGFydGljbGVTZXR0aW5ncy5qcyIsIm91dC90cy9QYXJ0aWNsZXMvUGFydGljbGVzLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9TdHJva2UuanMiLCJvdXQvdHMvUGFydGljbGVzL1ZlY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckZBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsd0JBQUQsQ0FBekI7O0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFNBQUQsQ0FBckI7O0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQXZCOztBQUNBLElBQUksTUFBTSxHQUFHLElBQUksV0FBVyxXQUFmLENBQXdCLFlBQXhCLEVBQXNDLElBQXRDLENBQWI7QUFDQSxNQUFNLENBQUMsbUJBQVAsQ0FBMkIsT0FBTyxDQUFDLEtBQVIsQ0FBYyxTQUF6QztBQUNBLE1BQU0sQ0FBQyxzQkFBUCxDQUE4QixPQUFPLENBQUMsS0FBUixDQUFjLFdBQTVDO0FBQ0EsTUFBTSxDQUFDLEtBQVA7QUFDQSxJQUFJLE1BQU0sR0FBRyxLQUFiO0FBQ0EsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsZ0JBQXJCLENBQXNDLFFBQXRDLEVBQWdELFlBQVk7QUFDeEQsTUFBSSxTQUFTLENBQUMsUUFBVixDQUFtQixHQUFuQixDQUF1QixRQUF2QixFQUFpQyxNQUFqQyxFQUFKLEVBQStDO0FBQzNDLFFBQUksTUFBSixFQUFZO0FBQ1IsTUFBQSxNQUFNLEdBQUcsS0FBVDtBQUNBLE1BQUEsTUFBTSxDQUFDLE1BQVA7QUFDSDtBQUNKLEdBTEQsTUFNSztBQUNELFFBQUksQ0FBQyxNQUFMLEVBQWE7QUFDVCxNQUFBLE1BQU0sR0FBRyxJQUFUO0FBQ0EsTUFBQSxNQUFNLENBQUMsS0FBUDtBQUNIO0FBQ0o7QUFDSixDQWJELEVBYUc7QUFDQyxFQUFBLE9BQU8sRUFBRSxJQURWO0FBRUMsRUFBQSxPQUFPLEVBQUU7QUFGVixDQWJIOzs7QUNWQTs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxLQUFSLEdBQWdCLEtBQUssQ0FBckI7QUFDQSxPQUFPLENBQUMsS0FBUixHQUFnQjtBQUNaLEVBQUEsU0FBUyxFQUFFO0FBQ1AsSUFBQSxNQUFNLEVBQUUsR0FERDtBQUVQLElBQUEsT0FBTyxFQUFFLEdBRkY7QUFHUCxJQUFBLEtBQUssRUFBRSxTQUhBO0FBSVAsSUFBQSxPQUFPLEVBQUUsUUFKRjtBQUtQLElBQUEsTUFBTSxFQUFFLENBQUMsQ0FBRCxFQUFJLEdBQUosRUFBUyxDQUFULEVBQVksR0FBWixFQUFpQixDQUFqQixFQUFvQixHQUFwQixDQUxEO0FBTVAsSUFBQSxLQUFLLEVBQUUsUUFOQTtBQU9QLElBQUEsTUFBTSxFQUFFO0FBQ0osTUFBQSxLQUFLLEVBQUUsQ0FESDtBQUVKLE1BQUEsS0FBSyxFQUFFO0FBRkgsS0FQRDtBQVdQLElBQUEsSUFBSSxFQUFFO0FBQ0YsTUFBQSxLQUFLLEVBQUUsR0FETDtBQUVGLE1BQUEsU0FBUyxFQUFFLFFBRlQ7QUFHRixNQUFBLFFBQVEsRUFBRSxLQUhSO0FBSUYsTUFBQSxNQUFNLEVBQUUsSUFKTjtBQUtGLE1BQUEsVUFBVSxFQUFFLEtBTFY7QUFNRixNQUFBLE9BQU8sRUFBRTtBQU5QLEtBWEM7QUFtQlAsSUFBQSxNQUFNLEVBQUU7QUFDSixNQUFBLE1BQU0sRUFBRSxJQURKO0FBRUosTUFBQSxLQUFLLEVBQUUsUUFGSDtBQUdKLE1BQUEsS0FBSyxFQUFFO0FBSEgsS0FuQkQ7QUF3QlAsSUFBQSxPQUFPLEVBQUU7QUFDTCxNQUFBLE9BQU8sRUFBRTtBQUNMLFFBQUEsS0FBSyxFQUFFLEdBREY7QUFFTCxRQUFBLEdBQUcsRUFBRSxDQUZBO0FBR0wsUUFBQSxJQUFJLEVBQUU7QUFIRCxPQURKO0FBTUwsTUFBQSxNQUFNLEVBQUU7QUFDSixRQUFBLEtBQUssRUFBRSxDQURIO0FBRUosUUFBQSxHQUFHLEVBQUUsQ0FGRDtBQUdKLFFBQUEsSUFBSSxFQUFFO0FBSEY7QUFOSDtBQXhCRixHQURDO0FBc0NaLEVBQUEsV0FBVyxFQUFFO0FBQ1QsSUFBQSxLQUFLLEVBQUU7QUFDSCxNQUFBLE1BQU0sRUFBRTtBQUNKLFFBQUEsUUFBUSxFQUFFLEVBRE47QUFFSixRQUFBLE1BQU0sRUFBRSxDQUZKO0FBR0osUUFBQSxPQUFPLEVBQUU7QUFITDtBQURMO0FBREU7QUF0Q0QsQ0FBaEI7OztBQ0hBOzs7Ozs7Ozs7O0FBQ0EsSUFBSSxTQUFTLEdBQUksVUFBUSxTQUFLLFNBQWQsSUFBNkIsWUFBWTtBQUNyRCxNQUFJLGNBQWEsR0FBRyx1QkFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUNoQyxJQUFBLGNBQWEsR0FBRyxNQUFNLENBQUMsY0FBUCxJQUNYO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixpQkFBNkIsS0FBN0IsSUFBc0MsVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUFFLE1BQUEsQ0FBQyxDQUFDLFNBQUYsR0FBYyxDQUFkO0FBQWtCLEtBRC9ELElBRVosVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUFFLFdBQUssSUFBSSxDQUFULElBQWMsQ0FBZDtBQUFpQixZQUFJLENBQUMsQ0FBQyxjQUFGLENBQWlCLENBQWpCLENBQUosRUFBeUIsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQUMsQ0FBQyxDQUFELENBQVI7QUFBMUM7QUFBd0QsS0FGOUU7O0FBR0EsV0FBTyxjQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBcEI7QUFDSCxHQUxEOztBQU1BLFNBQU8sVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUNuQixJQUFBLGNBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFiOztBQUNBLGFBQVMsRUFBVCxHQUFjO0FBQUUsV0FBSyxXQUFMLEdBQW1CLENBQW5CO0FBQXVCOztBQUN2QyxJQUFBLENBQUMsQ0FBQyxTQUFGLEdBQWMsQ0FBQyxLQUFLLElBQU4sR0FBYSxNQUFNLENBQUMsTUFBUCxDQUFjLENBQWQsQ0FBYixJQUFpQyxFQUFFLENBQUMsU0FBSCxHQUFlLENBQUMsQ0FBQyxTQUFqQixFQUE0QixJQUFJLEVBQUosRUFBN0QsQ0FBZDtBQUNILEdBSkQ7QUFLSCxDQVoyQyxFQUE1Qzs7QUFhQSxJQUFJLFVBQUo7O0FBQ0EsQ0FBQyxVQUFVLFVBQVYsRUFBc0I7QUFDbkIsTUFBSSxPQUFKOztBQUNBLEdBQUMsVUFBVSxPQUFWLEVBQW1CO0FBQ2hCLGFBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixNQUE3QixFQUFxQyxJQUFyQyxFQUEyQztBQUN2QyxVQUFJLEtBQUssQ0FBQyxNQUFELENBQUwsSUFBaUIsS0FBSyxDQUFDLE1BQUQsQ0FBTCxZQUF5QixRQUE5QyxFQUF3RDtBQUNwRCxRQUFBLEtBQUssQ0FBQyxNQUFELENBQUwsQ0FBYyxJQUFkO0FBQ0g7QUFDSjs7QUFDRCxJQUFBLE9BQU8sQ0FBQyxZQUFSLEdBQXVCLFlBQXZCOztBQUNBLGFBQVMsZUFBVCxDQUF5QixLQUF6QixFQUFnQyxJQUFoQyxFQUFzQztBQUNsQyxNQUFBLE9BQU8sQ0FBQyxjQUFSLENBQXVCLEtBQXZCLEVBQThCLElBQTlCLEVBQW9DO0FBQ2hDLFFBQUEsS0FBSyxFQUFFLFNBQVMsQ0FBQyxJQUFELENBRGdCO0FBRWhDLFFBQUEsWUFBWSxFQUFFLEtBRmtCO0FBR2hDLFFBQUEsUUFBUSxFQUFFO0FBSHNCLE9BQXBDO0FBS0g7O0FBQ0QsSUFBQSxPQUFPLENBQUMsZUFBUixHQUEwQixlQUExQjtBQUNILEdBZkQsRUFlRyxPQUFPLEtBQUssT0FBTyxHQUFHLEVBQWYsQ0FmVjs7QUFnQkEsTUFBSSxTQUFKOztBQUNBLEdBQUMsVUFBVSxTQUFWLEVBQXFCO0FBQ2xCLGFBQVMsUUFBVCxDQUFrQixNQUFsQixFQUEwQjtBQUN0QixVQUFJLE9BQU8sR0FBRyxJQUFkOztBQUNBLE1BQUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsS0FBSyxPQUF4QjtBQUNBLE1BQUEsVUFBVSxDQUFDLFlBQVk7QUFDbkIsWUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFiLEVBQXVCO0FBQ25CLFVBQUEsTUFBTSxDQUFDLFFBQVAsQ0FBZ0IsT0FBaEIsRUFBeUIsU0FBekIsRUFBb0M7QUFBRSxZQUFBLE1BQU0sRUFBRTtBQUFWLFdBQXBDO0FBQ0EsVUFBQSxPQUFPLENBQUMsUUFBUixHQUFtQixJQUFuQjtBQUNIO0FBQ0osT0FMUyxFQUtQLENBTE8sQ0FBVjtBQU1IOztBQUNELElBQUEsU0FBUyxDQUFDLFFBQVYsR0FBcUIsUUFBckI7QUFDSCxHQVpELEVBWUcsU0FBUyxLQUFLLFNBQVMsR0FBRyxFQUFqQixDQVpaOztBQWFBLE1BQUksTUFBSjs7QUFDQSxHQUFDLFVBQVUsTUFBVixFQUFrQjtBQUNmLGFBQVMsUUFBVCxDQUFrQixLQUFsQixFQUF5QixLQUF6QixFQUFnQyxJQUFoQyxFQUFzQztBQUNsQyxNQUFBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLEtBQXJCLEVBQTRCLEtBQTVCLEVBQW1DLElBQW5DO0FBQ0g7O0FBQ0QsSUFBQSxNQUFNLENBQUMsUUFBUCxHQUFrQixRQUFsQjtBQUNILEdBTEQsRUFLRyxNQUFNLEtBQUssTUFBTSxHQUFHLEVBQWQsQ0FMVDs7QUFNQSxNQUFJLE1BQU0sR0FBSSxZQUFZO0FBQ3RCLGFBQVMsTUFBVCxHQUFrQjtBQUNkLFdBQUssT0FBTCxHQUFlLElBQWY7QUFDSDs7QUFDRCxXQUFPLE1BQVA7QUFDSCxHQUxhLEVBQWQ7O0FBTUEsTUFBSSxTQUFTLEdBQUksVUFBVSxNQUFWLEVBQWtCO0FBQy9CLElBQUEsU0FBUyxDQUFDLFNBQUQsRUFBWSxNQUFaLENBQVQ7O0FBQ0EsYUFBUyxTQUFULEdBQXFCO0FBQ2pCLFVBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixLQUFxQixJQUFuQzs7QUFDQSxNQUFBLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLElBQWxCO0FBQ0EsTUFBQSxPQUFPLENBQUMsUUFBUixHQUFtQixLQUFuQjs7QUFDQSxNQUFBLE9BQU8sQ0FBQyxlQUFSOztBQUNBLGFBQU8sT0FBUDtBQUNIOztBQUNELElBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsZUFBcEIsR0FBc0MsWUFBWTtBQUM5QyxNQUFBLE9BQU8sQ0FBQyxlQUFSLENBQXdCLElBQXhCLEVBQThCLFVBQTlCO0FBQ0gsS0FGRDs7QUFHQSxJQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLFFBQXBCLEdBQStCLFVBQVUsTUFBVixFQUFrQixDQUFHLENBQXBEOztBQUNBLElBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsWUFBcEIsR0FBbUMsVUFBVSxHQUFWLEVBQWU7QUFDOUMsYUFBTyxLQUFLLE9BQUwsQ0FBYSxhQUFiLENBQTJCLFlBQVksR0FBWixHQUFrQixLQUE3QyxLQUF1RCxJQUE5RDtBQUNILEtBRkQ7O0FBR0EsV0FBTyxTQUFQO0FBQ0gsR0FqQmdCLENBaUJmLE1BakJlLENBQWpCOztBQWtCQSxNQUFJLFVBQUo7O0FBQ0EsR0FBQyxVQUFVLFVBQVYsRUFBc0I7QUFDbkIsYUFBUyxZQUFULEdBQXdCO0FBQ3BCLFdBQUssT0FBTCxHQUFlLEtBQUssYUFBTCxFQUFmO0FBQ0EsTUFBQSxNQUFNLENBQUMsUUFBUCxDQUFnQixJQUFoQixFQUFzQixTQUF0QjtBQUNIOztBQUNELGFBQVMsSUFBVCxDQUFjLEtBQWQsRUFBcUI7QUFDaEIsTUFBQSxZQUFZLENBQUMsSUFBYixDQUFrQixLQUFsQixDQUFEO0FBQ0g7O0FBQ0QsSUFBQSxVQUFVLENBQUMsSUFBWCxHQUFrQixJQUFsQjtBQUNILEdBVEQsRUFTRyxVQUFVLEtBQUssVUFBVSxHQUFHLEVBQWxCLENBVGI7O0FBVUEsTUFBSSxhQUFhLEdBQUksVUFBVSxNQUFWLEVBQWtCO0FBQ25DLElBQUEsU0FBUyxDQUFDLGFBQUQsRUFBZ0IsTUFBaEIsQ0FBVDs7QUFDQSxhQUFTLGFBQVQsR0FBeUI7QUFDckIsVUFBSSxPQUFPLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxJQUFaLEtBQXFCLElBQW5DOztBQUNBLE1BQUEsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsT0FBaEI7QUFDQSxhQUFPLE9BQVA7QUFDSDs7QUFDRCxXQUFPLGFBQVA7QUFDSCxHQVJvQixDQVFuQixTQVJtQixDQUFyQjs7QUFTQSxFQUFBLFVBQVUsQ0FBQyxhQUFYLEdBQTJCLGFBQTNCOztBQUNBLE1BQUksYUFBYSxHQUFJLFVBQVUsTUFBVixFQUFrQjtBQUNuQyxJQUFBLFNBQVMsQ0FBQyxhQUFELEVBQWdCLE1BQWhCLENBQVQ7O0FBQ0EsYUFBUyxhQUFULENBQXVCLElBQXZCLEVBQTZCO0FBQ3pCLFVBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixLQUFxQixJQUFuQzs7QUFDQSxNQUFBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsSUFBZjtBQUNBLE1BQUEsVUFBVSxDQUFDLElBQVgsQ0FBZ0IsT0FBaEI7QUFDQSxhQUFPLE9BQVA7QUFDSDs7QUFDRCxXQUFPLGFBQVA7QUFDSCxHQVRvQixDQVNuQixTQVRtQixDQUFyQjs7QUFVQSxFQUFBLFVBQVUsQ0FBQyxhQUFYLEdBQTJCLGFBQTNCO0FBQ0gsQ0EvRkQsRUErRkcsVUFBVSxLQUFLLFVBQVUsR0FBRyxFQUFsQixDQS9GYjs7QUFnR0EsTUFBTSxDQUFDLE9BQVAsR0FBaUIsVUFBakI7OztBQy9HQTs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFJLFNBQVMsR0FBSSxVQUFRLFNBQUssU0FBZCxJQUE2QixZQUFZO0FBQ3JELE1BQUksY0FBYSxHQUFHLHVCQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ2hDLElBQUEsY0FBYSxHQUFHLE1BQU0sQ0FBQyxjQUFQLElBQ1g7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLGlCQUE2QixLQUE3QixJQUFzQyxVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQUUsTUFBQSxDQUFDLENBQUMsU0FBRixHQUFjLENBQWQ7QUFBa0IsS0FEL0QsSUFFWixVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQUUsV0FBSyxJQUFJLENBQVQsSUFBYyxDQUFkO0FBQWlCLFlBQUksQ0FBQyxDQUFDLGNBQUYsQ0FBaUIsQ0FBakIsQ0FBSixFQUF5QixDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sQ0FBQyxDQUFDLENBQUQsQ0FBUjtBQUExQztBQUF3RCxLQUY5RTs7QUFHQSxXQUFPLGNBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFwQjtBQUNILEdBTEQ7O0FBTUEsU0FBTyxVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ25CLElBQUEsY0FBYSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWI7O0FBQ0EsYUFBUyxFQUFULEdBQWM7QUFBRSxXQUFLLFdBQUwsR0FBbUIsQ0FBbkI7QUFBdUI7O0FBQ3ZDLElBQUEsQ0FBQyxDQUFDLFNBQUYsR0FBYyxDQUFDLEtBQUssSUFBTixHQUFhLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBZCxDQUFiLElBQWlDLEVBQUUsQ0FBQyxTQUFILEdBQWUsQ0FBQyxDQUFDLFNBQWpCLEVBQTRCLElBQUksRUFBSixFQUE3RCxDQUFkO0FBQ0gsR0FKRDtBQUtILENBWjJDLEVBQTVDOztBQWFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLEtBQUssQ0FBekI7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQW5COztBQUNBLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXpCOztBQUNBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxtQkFBRCxDQUFuQjs7QUFDQSxJQUFJLFNBQVMsR0FBSSxVQUFVLE1BQVYsRUFBa0I7QUFDL0IsRUFBQSxTQUFTLENBQUMsU0FBRCxFQUFZLE1BQVosQ0FBVDs7QUFDQSxXQUFTLFNBQVQsR0FBcUI7QUFDakIsV0FBTyxNQUFNLEtBQUssSUFBWCxJQUFtQixNQUFNLENBQUMsS0FBUCxDQUFhLElBQWIsRUFBbUIsU0FBbkIsQ0FBbkIsSUFBb0QsSUFBM0Q7QUFDSDs7QUFDRCxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLE1BQXBCLEdBQTZCLFlBQVksQ0FBRyxDQUE1Qzs7QUFDQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLE9BQXBCLEdBQThCLFlBQVk7QUFDdEMsUUFBSSxLQUFLLEdBQUcsSUFBWjs7QUFDQSxJQUFBLEtBQUssQ0FBQyxHQUFOLENBQVUsaUJBQVYsQ0FBNEIsS0FBSyxPQUFqQyxFQUEwQyxZQUFZO0FBQ2xELE1BQUEsS0FBSyxDQUFDLFdBQU47QUFDSCxLQUZELEVBRUc7QUFBRSxNQUFBLE9BQU8sRUFBRSxHQUFYO0FBQWdCLE1BQUEsTUFBTSxFQUFFO0FBQXhCLEtBRkg7QUFHSCxHQUxEOztBQU1BLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsV0FBcEIsR0FBa0MsWUFBWTtBQUMxQyxRQUFJLFNBQVMsR0FBRyxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQWtCLFNBQWxCLEdBQThCLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsS0FBaEQsR0FBd0QsR0FBeEQsR0FBOEQsR0FBOUU7QUFDQSxRQUFJLE1BQU0sR0FBRyxDQUFDLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsU0FBbEIsR0FBOEIsS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixNQUFqRCxJQUEyRCxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQWtCLEtBQTdFLEdBQXFGLEdBQXJGLEdBQTJGLEdBQXhHO0FBQ0EsU0FBSyxZQUFMLENBQWtCLGdCQUFsQixFQUFvQyxLQUFwQyxDQUEwQyxLQUExQyxHQUFrRCxTQUFsRDtBQUNBLFNBQUssWUFBTCxDQUFrQixhQUFsQixFQUFpQyxLQUFqQyxDQUF1QyxLQUF2QyxHQUErQyxNQUEvQztBQUNBLFFBQUksZUFBZSxHQUFHLEtBQUssWUFBTCxDQUFrQixpQkFBbEIsQ0FBdEI7QUFDQSxRQUFJLFlBQVksR0FBRyxLQUFLLFlBQUwsQ0FBa0IsY0FBbEIsQ0FBbkI7QUFDQSxJQUFBLGVBQWUsQ0FBQyxLQUFoQixDQUFzQixPQUF0QixHQUFnQyxHQUFoQztBQUNBLElBQUEsZUFBZSxDQUFDLEtBQWhCLENBQXNCLElBQXRCLEdBQTZCLFNBQTdCO0FBQ0EsSUFBQSxZQUFZLENBQUMsS0FBYixDQUFtQixPQUFuQixHQUE2QixHQUE3QjtBQUNBLElBQUEsWUFBWSxDQUFDLEtBQWIsQ0FBbUIsSUFBbkIsR0FBMEIsTUFBMUI7QUFDSCxHQVhEOztBQVlBLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsYUFBcEIsR0FBb0MsWUFBWTtBQUM1QyxRQUFJLFdBQVcsR0FBRztBQUNkLDhCQUF3QixLQUFLLElBQUwsQ0FBVTtBQURwQixLQUFsQjtBQUdBLFdBQVEsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsS0FBbkMsRUFBMEM7QUFBRSxNQUFBLFNBQVMsRUFBRSwrQ0FBYjtBQUE4RCxNQUFBLEtBQUssRUFBRTtBQUFyRSxLQUExQyxFQUNKLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUUsY0FBYjtBQUE2QixNQUFBLElBQUksRUFBRSxLQUFLLElBQUwsQ0FBVSxJQUE3QztBQUFtRCxNQUFBLE1BQU0sRUFBRTtBQUEzRCxLQUF4QyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxHQUFHLEVBQUUsMEJBQTBCLEtBQUssSUFBTCxDQUFVO0FBQTNDLEtBQTFDLENBREosQ0FESixFQUdJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUUsaUZBQWI7QUFBZ0csTUFBQSxJQUFJLEVBQUUsS0FBSyxJQUFMLENBQVUsSUFBaEg7QUFBc0gsTUFBQSxNQUFNLEVBQUU7QUFBOUgsS0FBeEMsRUFBa0wsS0FBSyxJQUFMLENBQVUsSUFBNUwsQ0FESixFQUVJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QyxFQUFvSCxLQUFLLElBQUwsQ0FBVSxRQUE5SCxDQUZKLENBREosRUFJSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBMUMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxHQUFuQyxFQUF3QztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBeEMsRUFBeUksS0FBSyxJQUFMLENBQVUsTUFBbkosQ0FESixFQUVJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QyxFQUNJLEdBREosRUFFSSxLQUFLLElBQUwsQ0FBVSxLQUZkLEVBR0ksVUFISixFQUlJLEtBQUssSUFBTCxDQUFVLEdBSmQsRUFLSSxHQUxKLENBRkosQ0FKSixDQUhKLENBREosRUFnQkksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsS0FBbkMsRUFBMEM7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQTFDLEVBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsS0FBbkMsRUFBMEM7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQTFDLEVBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsS0FBbkMsRUFBMEM7QUFBRSxNQUFBLFNBQVMsRUFBRSxrQkFBYjtBQUFpQyxNQUFBLEtBQUssRUFBRTtBQUFFLFFBQUEsT0FBTyxFQUFFO0FBQVgsT0FBeEM7QUFBd0QsTUFBQSxHQUFHLEVBQUU7QUFBN0QsS0FBMUMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxHQUFuQyxFQUF3QztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBeEMsRUFBb0UsS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixTQUF0RixDQURKLENBREosRUFHSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFLGVBQWI7QUFBOEIsTUFBQSxLQUFLLEVBQUU7QUFBRSxRQUFBLE9BQU8sRUFBRTtBQUFYLE9BQXJDO0FBQXFELE1BQUEsR0FBRyxFQUFFO0FBQTFELEtBQTFDLEVBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsR0FBbkMsRUFBd0M7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQXhDLEVBQW9FLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsU0FBbEIsR0FBOEIsS0FBSyxJQUFMLENBQVUsT0FBVixDQUFrQixNQUFwSCxDQURKLENBSEosRUFLSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBMUMsQ0FMSixFQU1JLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUUsUUFBYjtBQUF1QixNQUFBLEdBQUcsRUFBRTtBQUE1QixLQUExQyxDQU5KLEVBT0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsS0FBbkMsRUFBMEM7QUFBRSxNQUFBLFNBQVMsRUFBRSxNQUFiO0FBQXFCLE1BQUEsR0FBRyxFQUFFO0FBQTFCLEtBQTFDLENBUEosQ0FESixFQVNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QyxFQUNJLEtBQUssSUFBTCxDQUFVLE9BQVYsQ0FBa0IsS0FEdEIsRUFFSSxVQUZKLENBVEosQ0FoQkosRUE0QkksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsS0FBbkMsRUFBMEM7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQTFDLEVBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsR0FBbkMsRUFBd0M7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQXhDLEVBQ0ksUUFESixFQUVJLEtBQUssSUFBTCxDQUFVLEdBQVYsQ0FBYyxPQUZsQixFQUdJLGVBSEosRUFJSSxLQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsS0FKbEIsRUFLSSxVQUxKLENBREosRUFPSSxLQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLEdBQWhCLENBQW9CLFVBQVUsSUFBVixFQUFnQjtBQUNoQyxhQUFPLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsUUFBQSxTQUFTLEVBQUU7QUFBYixPQUF4QyxFQUE2RixJQUE3RixDQUFQO0FBQ0gsS0FGRCxDQVBKLEVBVUksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsSUFBbkMsRUFBeUMsSUFBekMsQ0FWSixFQVdJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QyxFQUFtRixtQkFBbkYsQ0FESixFQUVJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLElBQW5DLEVBQXlDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF6QyxFQUE4RSxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQWtCLEdBQWxCLENBQXNCLFVBQVUsTUFBVixFQUFrQjtBQUNsSCxhQUFPLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLElBQW5DLEVBQXlDO0FBQUUsUUFBQSxTQUFTLEVBQUU7QUFBYixPQUF6QyxFQUFzRSxNQUF0RSxDQUFQO0FBQ0gsS0FGNkUsQ0FBOUUsQ0FGSixDQVhKLENBNUJKLENBREosQ0FESSxDQUFSO0FBOENILEdBbEREOztBQW1EQSxTQUFPLFNBQVA7QUFDSCxDQTVFZ0IsQ0E0RWYsV0FBVyxDQUFDLGFBNUVHLENBQWpCOztBQTZFQSxPQUFPLENBQUMsU0FBUixHQUFvQixTQUFwQjs7O0FDaEdBOzs7Ozs7Ozs7Ozs7QUFDQSxJQUFJLFNBQVMsR0FBSSxVQUFRLFNBQUssU0FBZCxJQUE2QixZQUFZO0FBQ3JELE1BQUksY0FBYSxHQUFHLHVCQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ2hDLElBQUEsY0FBYSxHQUFHLE1BQU0sQ0FBQyxjQUFQLElBQ1g7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLGlCQUE2QixLQUE3QixJQUFzQyxVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQUUsTUFBQSxDQUFDLENBQUMsU0FBRixHQUFjLENBQWQ7QUFBa0IsS0FEL0QsSUFFWixVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQUUsV0FBSyxJQUFJLENBQVQsSUFBYyxDQUFkO0FBQWlCLFlBQUksQ0FBQyxDQUFDLGNBQUYsQ0FBaUIsQ0FBakIsQ0FBSixFQUF5QixDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sQ0FBQyxDQUFDLENBQUQsQ0FBUjtBQUExQztBQUF3RCxLQUY5RTs7QUFHQSxXQUFPLGNBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFwQjtBQUNILEdBTEQ7O0FBTUEsU0FBTyxVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ25CLElBQUEsY0FBYSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWI7O0FBQ0EsYUFBUyxFQUFULEdBQWM7QUFBRSxXQUFLLFdBQUwsR0FBbUIsQ0FBbkI7QUFBdUI7O0FBQ3ZDLElBQUEsQ0FBQyxDQUFDLFNBQUYsR0FBYyxDQUFDLEtBQUssSUFBTixHQUFhLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBZCxDQUFiLElBQWlDLEVBQUUsQ0FBQyxTQUFILEdBQWUsQ0FBQyxDQUFDLFNBQWpCLEVBQTRCLElBQUksRUFBSixFQUE3RCxDQUFkO0FBQ0gsR0FKRDtBQUtILENBWjJDLEVBQTVDOztBQWFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLEtBQUssQ0FBMUI7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQW5COztBQUNBLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXpCOztBQUNBLElBQUksVUFBVSxHQUFJLFVBQVUsTUFBVixFQUFrQjtBQUNoQyxFQUFBLFNBQVMsQ0FBQyxVQUFELEVBQWEsTUFBYixDQUFUOztBQUNBLFdBQVMsVUFBVCxHQUFzQjtBQUNsQixXQUFPLE1BQU0sS0FBSyxJQUFYLElBQW1CLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBYixFQUFtQixTQUFuQixDQUFuQixJQUFvRCxJQUEzRDtBQUNIOztBQUNELEVBQUEsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsTUFBckIsR0FBOEIsWUFBWSxDQUFHLENBQTdDOztBQUNBLEVBQUEsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsYUFBckIsR0FBcUMsWUFBWTtBQUM3QyxXQUFRLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNKLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxJQUFJLEVBQUUsS0FBSyxJQUFMLENBQVUsSUFBbEI7QUFBd0IsTUFBQSxNQUFNLEVBQUU7QUFBaEMsS0FBeEMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsR0FBRyxFQUFFLDZCQUE2QixLQUFLLElBQUwsQ0FBVSxHQUF2QyxHQUE2QztBQUFwRCxLQUExQyxDQURKLENBREosQ0FESixFQUlJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxJQUFJLEVBQUUsS0FBSyxJQUFMLENBQVUsSUFBbEI7QUFBd0IsTUFBQSxNQUFNLEVBQUUsUUFBaEM7QUFBMEMsTUFBQSxTQUFTLEVBQUU7QUFBckQsS0FBeEMsRUFBZ0osS0FBSyxJQUFMLENBQVUsT0FBMUosQ0FESixFQUVJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QyxFQUFzRyxLQUFLLElBQUwsQ0FBVSxRQUFoSCxDQUZKLENBSkosRUFPSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBMUMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxHQUFuQyxFQUF3QztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBeEMsRUFBd0YsS0FBSyxJQUFMLENBQVUsUUFBbEcsQ0FESixFQUVJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QyxFQUFrRyxNQUFNLEtBQUssSUFBTCxDQUFVLEtBQWhCLEdBQXdCLFVBQXhCLEdBQXFDLEtBQUssSUFBTCxDQUFVLEdBQS9DLEdBQXFELEdBQXZKLENBRkosQ0FQSixDQURKLEVBV0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsSUFBbkMsRUFBeUMsSUFBekMsQ0FYSixFQVlJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QyxFQUErSCxLQUFLLElBQUwsQ0FBVSxNQUF6SSxDQURKLEVBRUksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsSUFBbkMsRUFBeUM7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQXpDLEVBQWdILEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsR0FBaEIsQ0FBb0IsVUFBVSxJQUFWLEVBQWdCO0FBQ2hKLGFBQU8sS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsSUFBbkMsRUFBeUMsSUFBekMsRUFBK0MsSUFBL0MsQ0FBUDtBQUNILEtBRitHLENBQWhILENBRkosQ0FaSixDQURJLENBQVI7QUFrQkgsR0FuQkQ7O0FBb0JBLFNBQU8sVUFBUDtBQUNILENBM0JpQixDQTJCaEIsV0FBVyxDQUFDLGFBM0JJLENBQWxCOztBQTRCQSxPQUFPLENBQUMsVUFBUixHQUFxQixVQUFyQjs7O0FDOUNBOzs7Ozs7QUFDQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsc0JBQUQsQ0FBbkI7O0FBQ0EsSUFBSSxPQUFKOztBQUNBLENBQUMsVUFBVSxPQUFWLEVBQW1CO0FBQ2hCLFdBQVMscUJBQVQsQ0FBK0IsSUFBL0IsRUFBcUMsU0FBckMsRUFBZ0Q7QUFDNUMsUUFBSSxTQUFTLEtBQUssS0FBSyxDQUF2QixFQUEwQjtBQUFFLE1BQUEsU0FBUyxHQUFHLFNBQVo7QUFBd0I7O0FBQ3BELFdBQU8sSUFBSSxPQUFKLENBQVksVUFBVSxPQUFWLEVBQW1CLE1BQW5CLEVBQTJCO0FBQzFDLE1BQUEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxHQUFmLENBQW1CLFNBQW5CO0FBQ0EsTUFBQSxLQUFLLENBQUMsR0FBTixDQUFVLGlCQUFWLENBQTRCLElBQTVCLEVBQWtDLFlBQVk7QUFDMUMsUUFBQSxJQUFJLENBQUMsU0FBTCxDQUFlLE1BQWYsQ0FBc0IsU0FBdEI7QUFDQSxRQUFBLE9BQU87QUFDVixPQUhELEVBR0c7QUFBRSxRQUFBLE1BQU0sRUFBRTtBQUFWLE9BSEg7QUFJSCxLQU5NLENBQVA7QUFPSDs7QUFDRCxFQUFBLE9BQU8sQ0FBQyxxQkFBUixHQUFnQyxxQkFBaEM7QUFDSCxDQVpELEVBWUcsT0FBTyxLQUFLLE9BQU8sR0FBRyxFQUFmLENBWlY7O0FBYUEsTUFBTSxDQUFDLE9BQVAsR0FBaUIsT0FBakI7OztBQ2hCQTs7Ozs7Ozs7Ozs7O0FBQ0EsSUFBSSxTQUFTLEdBQUksVUFBUSxTQUFLLFNBQWQsSUFBNkIsWUFBWTtBQUNyRCxNQUFJLGNBQWEsR0FBRyx1QkFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUNoQyxJQUFBLGNBQWEsR0FBRyxNQUFNLENBQUMsY0FBUCxJQUNYO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixpQkFBNkIsS0FBN0IsSUFBc0MsVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUFFLE1BQUEsQ0FBQyxDQUFDLFNBQUYsR0FBYyxDQUFkO0FBQWtCLEtBRC9ELElBRVosVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUFFLFdBQUssSUFBSSxDQUFULElBQWMsQ0FBZDtBQUFpQixZQUFJLENBQUMsQ0FBQyxjQUFGLENBQWlCLENBQWpCLENBQUosRUFBeUIsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQUMsQ0FBQyxDQUFELENBQVI7QUFBMUM7QUFBd0QsS0FGOUU7O0FBR0EsV0FBTyxjQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBcEI7QUFDSCxHQUxEOztBQU1BLFNBQU8sVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUNuQixJQUFBLGNBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFiOztBQUNBLGFBQVMsRUFBVCxHQUFjO0FBQUUsV0FBSyxXQUFMLEdBQW1CLENBQW5CO0FBQXVCOztBQUN2QyxJQUFBLENBQUMsQ0FBQyxTQUFGLEdBQWMsQ0FBQyxLQUFLLElBQU4sR0FBYSxNQUFNLENBQUMsTUFBUCxDQUFjLENBQWQsQ0FBYixJQUFpQyxFQUFFLENBQUMsU0FBSCxHQUFlLENBQUMsQ0FBQyxTQUFqQixFQUE0QixJQUFJLEVBQUosRUFBN0QsQ0FBZDtBQUNILEdBSkQ7QUFLSCxDQVoyQyxFQUE1Qzs7QUFhQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7QUFDQSxPQUFPLENBQUMsSUFBUixHQUFlLEtBQUssQ0FBcEI7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLG1CQUFELENBQW5COztBQUNBLElBQUksaUJBQWlCLEdBQUcsT0FBTyxDQUFDLCtCQUFELENBQS9COztBQUNBLElBQUksSUFBSSxHQUFJLFVBQVUsTUFBVixFQUFrQjtBQUMxQixFQUFBLFNBQVMsQ0FBQyxJQUFELEVBQU8sTUFBUCxDQUFUOztBQUNBLFdBQVMsSUFBVCxHQUFnQjtBQUNaLFFBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixLQUFxQixJQUFqQzs7QUFDQSxJQUFBLEtBQUssQ0FBQyxJQUFOLEdBQWEsS0FBYjtBQUNBLElBQUEsS0FBSyxDQUFDLFNBQU4sR0FBa0IsNkhBQWxCO0FBQ0EsSUFBQSxLQUFLLENBQUMsU0FBTixHQUFrQixLQUFLLENBQUMsR0FBTixDQUFVLGVBQVYsQ0FBMEIsYUFBMUIsQ0FBbEI7QUFDQSxJQUFBLEtBQUssQ0FBQyxTQUFOLEdBQWtCLEtBQUssQ0FBQyxHQUFOLENBQVUsZUFBVixDQUEwQix3QkFBMUIsQ0FBbEI7O0FBQ0EsSUFBQSxLQUFLLENBQUMsUUFBTixDQUFlLFFBQWY7O0FBQ0EsV0FBTyxLQUFQO0FBQ0g7O0FBQ0QsRUFBQSxJQUFJLENBQUMsU0FBTCxDQUFlLE1BQWYsR0FBd0IsWUFBWTtBQUNoQyxTQUFLLElBQUwsR0FBWSxDQUFDLEtBQUssSUFBbEI7QUFDQSxTQUFLLElBQUwsR0FBWSxLQUFLLFFBQUwsRUFBWixHQUE4QixLQUFLLFNBQUwsRUFBOUI7QUFDQSxTQUFLLFFBQUwsQ0FBYyxRQUFkLEVBQXdCO0FBQUUsTUFBQSxJQUFJLEVBQUUsS0FBSztBQUFiLEtBQXhCO0FBQ0gsR0FKRDs7QUFLQSxFQUFBLElBQUksQ0FBQyxTQUFMLENBQWUsUUFBZixHQUEwQixZQUFZO0FBQ2xDLFNBQUssU0FBTCxDQUFlLFlBQWYsQ0FBNEIsTUFBNUIsRUFBb0MsRUFBcEM7QUFDQSxTQUFLLE1BQUw7QUFDSCxHQUhEOztBQUlBLEVBQUEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxTQUFmLEdBQTJCLFlBQVk7QUFDbkMsUUFBSSxLQUFLLEdBQUcsSUFBWjs7QUFDQSxTQUFLLFNBQUwsQ0FBZSxlQUFmLENBQStCLE1BQS9CO0FBQ0EsSUFBQSxVQUFVLENBQUMsWUFBWTtBQUFFLGFBQU8sS0FBSyxDQUFDLGNBQU4sRUFBUDtBQUFnQyxLQUEvQyxFQUFpRCxHQUFqRCxDQUFWO0FBQ0gsR0FKRDs7QUFLQSxFQUFBLElBQUksQ0FBQyxTQUFMLENBQWUsTUFBZixHQUF3QixZQUFZO0FBQ2hDLFNBQUssU0FBTCxDQUFlLFNBQWYsQ0FBeUIsTUFBekIsQ0FBZ0MsT0FBaEM7QUFDSCxHQUZEOztBQUdBLEVBQUEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxPQUFmLEdBQXlCLFlBQVk7QUFDakMsU0FBSyxTQUFMLENBQWUsU0FBZixDQUF5QixHQUF6QixDQUE2QixPQUE3QjtBQUNILEdBRkQ7O0FBR0EsRUFBQSxJQUFJLENBQUMsU0FBTCxDQUFlLGNBQWYsR0FBZ0MsWUFBWTtBQUN4QyxRQUFJLENBQUMsS0FBSyxJQUFWLEVBQWdCO0FBQ1osVUFBSSxlQUFlLEdBQUcsS0FBSyxrQkFBTCxFQUF0QjtBQUNBLFdBQUssY0FBTCxDQUFvQixlQUFwQjtBQUNIO0FBQ0osR0FMRDs7QUFNQSxFQUFBLElBQUksQ0FBQyxTQUFMLENBQWUsa0JBQWYsR0FBb0MsWUFBWTtBQUM1QyxRQUFJLGlCQUFpQixHQUFHLFFBQVEsQ0FBQyxpQkFBVCxHQUE2QixtQkFBN0IsR0FBbUQscUJBQTNFOztBQUNBLFFBQUksRUFBRSxHQUFHLEtBQUssU0FBTCxDQUFlLHFCQUFmLEVBQVQ7QUFBQSxRQUFpRCxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQTFEO0FBQUEsUUFBK0QsSUFBSSxHQUFHLEVBQUUsQ0FBQyxJQUF6RTs7QUFDQSxRQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsaUJBQUQsQ0FBUixDQUE0QixJQUE1QixFQUFrQyxHQUFsQyxDQUFmO0FBQ0EsUUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLE1BQXRCO0FBQ0EsUUFBSSxHQUFHLEdBQUcsRUFBVjtBQUNBLFFBQUksVUFBSixFQUFnQixXQUFoQjtBQUNBLFFBQUksTUFBSjs7QUFDQSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLE1BQXBCLEVBQTRCLEVBQUUsQ0FBRixFQUFLLEtBQUssU0FBTCxDQUFlLFNBQWYsR0FBMkIsQ0FBNUQsRUFBK0Q7QUFDM0QsTUFBQSxNQUFNLEdBQUcsTUFBTSxDQUFDLGdCQUFQLENBQXdCLFFBQVEsQ0FBQyxDQUFELENBQWhDLENBQVQ7QUFDQSxNQUFBLFVBQVUsR0FBRyxNQUFNLENBQUMsVUFBUCxJQUFxQixNQUFNLENBQUMsZUFBUCxHQUF5QixNQUFNLENBQUMsZUFBbEU7O0FBQ0EsYUFBTyxXQUFXLEdBQUcsS0FBSyxTQUFMLENBQWUsSUFBZixDQUFvQixVQUFwQixDQUFyQixFQUFzRDtBQUNsRCxZQUFJLFdBQVcsQ0FBQyxDQUFELENBQWYsRUFBb0I7QUFDaEIsVUFBQSxHQUFHLEdBQUcsV0FBVyxDQUFDLEtBQVosQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsR0FBeEIsQ0FBNEIsVUFBVSxHQUFWLEVBQWU7QUFBRSxtQkFBTyxRQUFRLENBQUMsR0FBRCxDQUFmO0FBQXVCLFdBQXBFLENBQU47QUFDQSxpQkFBTyxHQUFQO0FBQ0gsU0FIRCxNQUlLLElBQUksV0FBVyxDQUFDLENBQUQsQ0FBZixFQUFvQjtBQUNyQixVQUFBLEdBQUcsR0FBRyxXQUFXLENBQUMsS0FBWixDQUFrQixDQUFsQixFQUFxQixFQUFyQixFQUF5QixHQUF6QixDQUE2QixVQUFVLEdBQVYsRUFBZTtBQUFFLG1CQUFPLFFBQVEsQ0FBQyxHQUFELENBQWY7QUFBdUIsV0FBckUsQ0FBTjs7QUFDQSxjQUFJLENBQUMsR0FBRyxDQUFDLEtBQUosQ0FBVSxVQUFVLEdBQVYsRUFBZTtBQUFFLG1CQUFPLEdBQUcsS0FBSyxDQUFmO0FBQW1CLFdBQTlDLENBQUwsRUFBc0Q7QUFDbEQsbUJBQU8sR0FBUDtBQUNIO0FBQ0o7QUFDSjtBQUNKOztBQUNELFdBQU8sR0FBUDtBQUNILEdBekJEOztBQTBCQSxFQUFBLElBQUksQ0FBQyxTQUFMLENBQWUsY0FBZixHQUFnQyxVQUFVLEdBQVYsRUFBZTtBQUMzQyxRQUFJLFFBQUosRUFBYyxTQUFkOztBQUNBLFFBQUksR0FBRyxDQUFDLE1BQUosS0FBZSxDQUFuQixFQUFzQjtBQUNsQixNQUFBLFFBQVEsR0FBRyxHQUFHLENBQUMsR0FBSixDQUFRLFVBQVUsR0FBVixFQUFlO0FBQUUsZUFBTyxHQUFHLEdBQUcsR0FBYjtBQUFtQixPQUE1QyxFQUE4QyxHQUE5QyxDQUFrRCxVQUFVLEdBQVYsRUFBZTtBQUN4RSxlQUFPLEdBQUcsSUFBSSxPQUFQLEdBQWlCLEdBQUcsR0FBRyxLQUF2QixHQUErQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQUMsR0FBRyxHQUFHLEtBQVAsSUFBZ0IsS0FBekIsRUFBZ0MsR0FBaEMsQ0FBdEM7QUFDSCxPQUZVLENBQVg7QUFHQSxNQUFBLFNBQVMsR0FBRyxTQUFTLFFBQVEsQ0FBQyxDQUFELENBQWpCLEdBQXVCLFNBQVMsUUFBUSxDQUFDLENBQUQsQ0FBeEMsR0FBOEMsU0FBUyxRQUFRLENBQUMsQ0FBRCxDQUEzRTs7QUFDQSxVQUFJLFNBQVMsR0FBRyxLQUFoQixFQUF1QjtBQUNuQixhQUFLLE1BQUw7QUFDSCxPQUZELE1BR0s7QUFDRCxhQUFLLE9BQUw7QUFDSDtBQUNKLEtBWEQsTUFZSztBQUNELFdBQUssTUFBTDtBQUNIO0FBQ0osR0FqQkQ7O0FBa0JBLFNBQU8sSUFBUDtBQUNILENBbEZXLENBa0ZWLGlCQUFpQixDQUFDLE1BQWxCLENBQXlCLGVBbEZmLENBQVo7O0FBbUZBLE9BQU8sQ0FBQyxJQUFSLEdBQWUsSUFBZjs7O0FDckdBOzs7Ozs7Ozs7Ozs7OztBQUNBLElBQUksU0FBUyxHQUFJLFVBQVEsU0FBSyxTQUFkLElBQTZCLFlBQVk7QUFDckQsTUFBSSxjQUFhLEdBQUcsdUJBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFDaEMsSUFBQSxjQUFhLEdBQUcsTUFBTSxDQUFDLGNBQVAsSUFDWDtBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsaUJBQTZCLEtBQTdCLElBQXNDLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFBRSxNQUFBLENBQUMsQ0FBQyxTQUFGLEdBQWMsQ0FBZDtBQUFrQixLQUQvRCxJQUVaLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFBRSxXQUFLLElBQUksQ0FBVCxJQUFjLENBQWQ7QUFBaUIsWUFBSSxDQUFDLENBQUMsY0FBRixDQUFpQixDQUFqQixDQUFKLEVBQXlCLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTyxDQUFDLENBQUMsQ0FBRCxDQUFSO0FBQTFDO0FBQXdELEtBRjlFOztBQUdBLFdBQU8sY0FBYSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXBCO0FBQ0gsR0FMRDs7QUFNQSxTQUFPLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFDbkIsSUFBQSxjQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBYjs7QUFDQSxhQUFTLEVBQVQsR0FBYztBQUFFLFdBQUssV0FBTCxHQUFtQixDQUFuQjtBQUF1Qjs7QUFDdkMsSUFBQSxDQUFDLENBQUMsU0FBRixHQUFjLENBQUMsS0FBSyxJQUFOLEdBQWEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFkLENBQWIsSUFBaUMsRUFBRSxDQUFDLFNBQUgsR0FBZSxDQUFDLENBQUMsU0FBakIsRUFBNEIsSUFBSSxFQUFKLEVBQTdELENBQWQ7QUFDSCxHQUpEO0FBS0gsQ0FaMkMsRUFBNUM7O0FBYUEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRSxFQUFBLEtBQUssRUFBRTtBQUFULENBQTdDO0FBQ0EsT0FBTyxDQUFDLE9BQVIsR0FBa0IsS0FBSyxDQUF2Qjs7QUFDQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsdUJBQUQsQ0FBbkI7O0FBQ0EsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGNBQUQsQ0FBekI7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLG1CQUFELENBQW5COztBQUNBLElBQUksT0FBTyxHQUFJLFVBQVUsTUFBVixFQUFrQjtBQUM3QixFQUFBLFNBQVMsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFUOztBQUNBLFdBQVMsT0FBVCxHQUFtQjtBQUNmLFFBQUksS0FBSyxHQUFHLE1BQU0sS0FBSyxJQUFYLElBQW1CLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBYixFQUFtQixTQUFuQixDQUFuQixJQUFvRCxJQUFoRTs7QUFDQSxJQUFBLEtBQUssQ0FBQyxhQUFOLEdBQXNCLEtBQXRCO0FBQ0EsSUFBQSxLQUFLLENBQUMsV0FBTixHQUFvQixJQUFwQjtBQUNBLFdBQU8sS0FBUDtBQUNIOztBQUNELEVBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsT0FBbEIsR0FBNEIsWUFBWTtBQUNwQyxRQUFJLEtBQUssR0FBRyxJQUFaOztBQUNBLFFBQUksS0FBSyxJQUFMLENBQVUsS0FBZCxFQUFxQjtBQUNqQixNQUFBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUFZO0FBQUUsZUFBTyxLQUFLLENBQUMsZ0JBQU4sRUFBUDtBQUFrQyxPQUFsRixFQUFvRjtBQUFFLFFBQUEsT0FBTyxFQUFFO0FBQVgsT0FBcEY7QUFDSDtBQUNKLEdBTEQ7O0FBTUEsRUFBQSxPQUFPLENBQUMsU0FBUixDQUFrQixPQUFsQixHQUE0QixZQUFZO0FBQ3BDLFFBQUksS0FBSyxJQUFMLENBQVUsS0FBZCxFQUFxQjtBQUNqQixXQUFLLGdCQUFMO0FBQ0g7QUFDSixHQUpEOztBQUtBLEVBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsZ0JBQWxCLEdBQXFDLFlBQVk7QUFDN0MsUUFBSSxPQUFPLEdBQUcsS0FBSyxZQUFMLENBQWtCLFNBQWxCLENBQWQ7QUFDQSxRQUFJLFVBQVUsR0FBRyxPQUFPLENBQUMscUJBQVIsR0FBZ0MsSUFBakQ7QUFDQSxRQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsR0FBTixDQUFVLFdBQVYsR0FBd0IsS0FBMUM7O0FBQ0EsUUFBSSxLQUFLLFdBQUwsS0FBc0IsVUFBVSxJQUFJLFdBQVcsR0FBRyxDQUF0RCxFQUEwRDtBQUN0RCxXQUFLLFdBQUwsR0FBbUIsQ0FBQyxLQUFLLFdBQXpCO0FBQ0EsVUFBSSxHQUFHLEdBQUcsS0FBSyxXQUFMLEdBQW1CLE1BQW5CLEdBQTRCLEtBQXRDO0FBQ0EsVUFBSSxNQUFNLEdBQUcsS0FBSyxXQUFMLEdBQW1CLEtBQW5CLEdBQTJCLE1BQXhDO0FBQ0EsTUFBQSxPQUFPLENBQUMsU0FBUixDQUFrQixNQUFsQixDQUF5QixNQUF6QjtBQUNBLE1BQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsR0FBbEIsQ0FBc0IsR0FBdEI7QUFDSDtBQUNKLEdBWEQ7O0FBWUEsRUFBQSxPQUFPLENBQUMsU0FBUixDQUFrQixRQUFsQixHQUE2QixZQUFZO0FBQ3JDLFNBQUssYUFBTCxHQUFxQixLQUFyQjtBQUNBLFNBQUssTUFBTDtBQUNILEdBSEQ7O0FBSUEsRUFBQSxPQUFPLENBQUMsU0FBUixDQUFrQixVQUFsQixHQUErQixZQUFZO0FBQ3ZDLFNBQUssYUFBTCxHQUFxQixDQUFDLEtBQUssYUFBM0I7QUFDQSxTQUFLLE1BQUw7QUFDSCxHQUhEOztBQUlBLEVBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsTUFBbEIsR0FBMkIsWUFBWTtBQUNuQyxRQUFJLEtBQUssYUFBVCxFQUF3QjtBQUNwQixXQUFLLFlBQUwsQ0FBa0IsUUFBbEIsRUFBNEIsWUFBNUIsQ0FBeUMsUUFBekMsRUFBbUQsRUFBbkQ7QUFDSCxLQUZELE1BR0s7QUFDRCxXQUFLLFlBQUwsQ0FBa0IsUUFBbEIsRUFBNEIsZUFBNUIsQ0FBNEMsUUFBNUM7QUFDSDs7QUFDRCxTQUFLLFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEIsU0FBOUIsR0FBMEMsQ0FBQyxLQUFLLGFBQUwsR0FBcUIsTUFBckIsR0FBOEIsTUFBL0IsSUFBeUMsT0FBbkY7QUFDSCxHQVJEOztBQVNBLEVBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsYUFBbEIsR0FBa0MsWUFBWTtBQUMxQyxRQUFJLFdBQVcsR0FBRztBQUNkLG1DQUE2QixLQUFLLElBQUwsQ0FBVTtBQUR6QixLQUFsQjtBQUdBLFFBQUksVUFBVSxHQUFHO0FBQ2IsTUFBQSxlQUFlLEVBQUUsVUFBVSwyQkFBMkIsS0FBSyxJQUFMLENBQVUsS0FBL0MsSUFBd0Q7QUFENUQsS0FBakI7QUFHQSxXQUFRLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNKLEtBQUssSUFBTCxDQUFVLEtBQVYsR0FDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBMUMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBMUMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsR0FBRyxFQUFFO0FBQVAsS0FBMUMsQ0FESixFQUVJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLE1BQW5DLEVBQTJDO0FBQUUsTUFBQSxHQUFHLEVBQUUsU0FBUDtBQUFrQixNQUFBLFNBQVMsRUFBRTtBQUE3QixLQUEzQyxFQUFvRyxLQUFLLElBQUwsQ0FBVSxLQUE5RyxDQUZKLENBREosQ0FESixHQUtNLElBTkYsRUFPSixLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFLHNFQUFiO0FBQXFGLE1BQUEsS0FBSyxFQUFFO0FBQTVGLEtBQTFDLEVBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsS0FBbkMsRUFBMEM7QUFBRSxNQUFBLFNBQVMsRUFBRSxPQUFiO0FBQXNCLE1BQUEsS0FBSyxFQUFFO0FBQTdCLEtBQTFDLENBREosRUFFSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBMUMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBMUMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxHQUFuQyxFQUF3QztBQUFFLE1BQUEsU0FBUyxFQUFFLCtCQUFiO0FBQThDLE1BQUEsS0FBSyxFQUFFO0FBQUUsUUFBQSxLQUFLLEVBQUUsS0FBSyxJQUFMLENBQVU7QUFBbkI7QUFBckQsS0FBeEMsRUFBMkgsS0FBSyxJQUFMLENBQVUsSUFBckksQ0FESixFQUVJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QyxFQUF5RSxLQUFLLElBQUwsQ0FBVSxJQUFuRixDQUZKLEVBR0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsR0FBbkMsRUFBd0M7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQXhDLEVBQXdGLEtBQUssSUFBTCxDQUFVLElBQWxHLENBSEosQ0FESixFQUtJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QyxFQUEyRSxLQUFLLElBQUwsQ0FBVSxNQUFyRixDQURKLENBTEosRUFPSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFLDJCQUFiO0FBQTBDLE1BQUEsR0FBRyxFQUFFO0FBQS9DLEtBQTFDLEVBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsS0FBbkMsRUFBMEM7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQTFDLEVBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsS0FBbkMsRUFBMEM7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQTFDLEVBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsR0FBbkMsRUFBd0M7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQXhDLEVBQW1GLFNBQW5GLENBREosRUFFSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxLQUFuQyxFQUEwQztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBMUMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxRQUFuQyxFQUE2QztBQUFFLE1BQUEsU0FBUyxFQUFFLDZCQUFiO0FBQTRDLE1BQUEsUUFBUSxFQUFFLElBQXREO0FBQTRELE1BQUEsT0FBTyxFQUFFLEtBQUssUUFBTCxDQUFjLElBQWQsQ0FBbUIsSUFBbkI7QUFBckUsS0FBN0MsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxHQUFuQyxFQUF3QztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBeEMsQ0FESixDQURKLENBRkosQ0FESixFQU1JLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLElBQW5DLEVBQXlDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF6QyxFQUFvRyxLQUFLLElBQUwsQ0FBVSxPQUFWLENBQWtCLEdBQWxCLENBQXNCLFVBQVUsTUFBVixFQUFrQjtBQUN4SSxhQUFPLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLElBQW5DLEVBQXlDLElBQXpDLEVBQStDLE1BQS9DLENBQVA7QUFDSCxLQUZtRyxDQUFwRyxDQURKLENBTkosQ0FESixDQVBKLEVBa0JJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLFFBQW5DLEVBQTZDO0FBQUUsTUFBQSxTQUFTLEVBQUUsdUNBQWI7QUFBc0QsTUFBQSxPQUFPLEVBQUUsS0FBSyxVQUFMLENBQWdCLElBQWhCLENBQXFCLElBQXJCO0FBQS9ELEtBQTdDLEVBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsR0FBbkMsRUFBd0M7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQXhDLENBREosRUFFSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxNQUFuQyxFQUEyQztBQUFFLE1BQUEsR0FBRyxFQUFFO0FBQVAsS0FBM0MsRUFBZ0UsV0FBaEUsQ0FGSixDQURKLEVBSUksS0FBSyxJQUFMLENBQVUsSUFBVixHQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUUsdUNBQWI7QUFBc0QsTUFBQSxJQUFJLEVBQUUsS0FBSyxJQUFMLENBQVUsSUFBdEU7QUFBNEUsTUFBQSxNQUFNLEVBQUUsUUFBcEY7QUFBOEYsTUFBQSxRQUFRLEVBQUU7QUFBeEcsS0FBeEMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxHQUFuQyxFQUF3QztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBeEMsQ0FESixFQUVJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLE1BQW5DLEVBQTJDLElBQTNDLEVBQWlELFVBQWpELENBRkosQ0FESixHQUlNLElBUlYsRUFTSSxLQUFLLElBQUwsQ0FBVSxRQUFWLEdBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsR0FBbkMsRUFBd0M7QUFBRSxNQUFBLFNBQVMsRUFBRSwyQ0FBYjtBQUEwRCxNQUFBLElBQUksRUFBRSxLQUFLLElBQUwsQ0FBVSxRQUExRTtBQUFvRixNQUFBLE1BQU0sRUFBRSxRQUE1RjtBQUFzRyxNQUFBLFFBQVEsRUFBRTtBQUFoSCxLQUF4QyxFQUNJLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUF4QyxDQURKLEVBRUksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsTUFBbkMsRUFBMkMsSUFBM0MsRUFBaUQsYUFBakQsQ0FGSixDQURKLEdBSU0sSUFiVixDQWxCSixDQUZKLENBUEksQ0FBUjtBQXlDSCxHQWhERDs7QUFpREEsU0FBTyxPQUFQO0FBQ0gsQ0FsR2MsQ0FrR2IsV0FBVyxDQUFDLGFBbEdDLENBQWY7O0FBbUdBLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLE9BQWxCOzs7QUN0SEE7Ozs7Ozs7Ozs7QUFDQSxJQUFJLFNBQVMsR0FBSSxVQUFRLFNBQUssU0FBZCxJQUE2QixZQUFZO0FBQ3JELE1BQUksY0FBYSxHQUFHLHVCQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ2hDLElBQUEsY0FBYSxHQUFHLE1BQU0sQ0FBQyxjQUFQLElBQ1g7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLGlCQUE2QixLQUE3QixJQUFzQyxVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQUUsTUFBQSxDQUFDLENBQUMsU0FBRixHQUFjLENBQWQ7QUFBa0IsS0FEL0QsSUFFWixVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQUUsV0FBSyxJQUFJLENBQVQsSUFBYyxDQUFkO0FBQWlCLFlBQUksQ0FBQyxDQUFDLGNBQUYsQ0FBaUIsQ0FBakIsQ0FBSixFQUF5QixDQUFDLENBQUMsQ0FBRCxDQUFELEdBQU8sQ0FBQyxDQUFDLENBQUQsQ0FBUjtBQUExQztBQUF3RCxLQUY5RTs7QUFHQSxXQUFPLGNBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFwQjtBQUNILEdBTEQ7O0FBTUEsU0FBTyxVQUFVLENBQVYsRUFBYSxDQUFiLEVBQWdCO0FBQ25CLElBQUEsY0FBYSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQWI7O0FBQ0EsYUFBUyxFQUFULEdBQWM7QUFBRSxXQUFLLFdBQUwsR0FBbUIsQ0FBbkI7QUFBdUI7O0FBQ3ZDLElBQUEsQ0FBQyxDQUFDLFNBQUYsR0FBYyxDQUFDLEtBQUssSUFBTixHQUFhLE1BQU0sQ0FBQyxNQUFQLENBQWMsQ0FBZCxDQUFiLElBQWlDLEVBQUUsQ0FBQyxTQUFILEdBQWUsQ0FBQyxDQUFDLFNBQWpCLEVBQTRCLElBQUksRUFBSixFQUE3RCxDQUFkO0FBQ0gsR0FKRDtBQUtILENBWjJDLEVBQTVDOztBQWFBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLEtBQUssQ0FBdkI7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQW5COztBQUNBLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXpCOztBQUNBLElBQUksT0FBTyxHQUFJLFVBQVUsTUFBVixFQUFrQjtBQUM3QixFQUFBLFNBQVMsQ0FBQyxPQUFELEVBQVUsTUFBVixDQUFUOztBQUNBLFdBQVMsT0FBVCxDQUFpQixJQUFqQixFQUF1QjtBQUNuQixXQUFPLE1BQU0sQ0FBQyxJQUFQLENBQVksSUFBWixFQUFrQixJQUFsQixLQUEyQixJQUFsQztBQUNIOztBQUNELEVBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsTUFBbEIsR0FBMkIsWUFBWSxDQUFHLENBQTFDOztBQUNBLEVBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsYUFBbEIsR0FBa0MsWUFBWTtBQUMxQyxXQUFRLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNKLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUUsVUFBVSxLQUFLLElBQUwsQ0FBVTtBQUFqQyxLQUF4QyxDQURJLEVBRUosS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsR0FBbkMsRUFBd0M7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQXhDLEVBQXlGLEtBQUssSUFBTCxDQUFVLElBQW5HLENBRkksRUFHSixLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxHQUFuQyxFQUF3QztBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsS0FBeEMsRUFBeUYsS0FBSyxJQUFMLENBQVUsV0FBbkcsQ0FISSxDQUFSO0FBSUgsR0FMRDs7QUFNQSxTQUFPLE9BQVA7QUFDSCxDQWJjLENBYWIsV0FBVyxDQUFDLGFBYkMsQ0FBZjs7QUFjQSxPQUFPLENBQUMsT0FBUixHQUFrQixPQUFsQjs7O0FDaENBOzs7O0FBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRSxFQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxtQkFBRCxDQUFuQjs7QUFDQSxJQUFJLE9BQU8sR0FBSSxZQUFZO0FBQ3ZCLFdBQVMsT0FBVCxDQUFpQixPQUFqQixFQUEwQjtBQUN0QixTQUFLLE9BQUwsR0FBZSxPQUFmO0FBQ0g7O0FBQ0QsRUFBQSxPQUFPLENBQUMsU0FBUixDQUFrQixNQUFsQixHQUEyQixZQUFZO0FBQ25DLFdBQU8sS0FBSyxDQUFDLEdBQU4sQ0FBVSxvQkFBVixDQUErQixLQUFLLE9BQXBDLENBQVA7QUFDSCxHQUZEOztBQUdBLEVBQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsS0FBbEIsR0FBMEIsWUFBWTtBQUNsQyxXQUFPLEtBQUssT0FBTCxDQUFhLEVBQXBCO0FBQ0gsR0FGRDs7QUFHQSxFQUFBLE9BQU8sQ0FBQyxTQUFSLENBQWtCLE1BQWxCLEdBQTJCLFlBQVk7QUFDbkMsV0FBTyxDQUFDLEtBQUssT0FBTCxDQUFhLFNBQWIsQ0FBdUIsUUFBdkIsQ0FBZ0MsU0FBaEMsQ0FBUjtBQUNILEdBRkQ7O0FBR0EsU0FBTyxPQUFQO0FBQ0gsQ0FkYyxFQUFmOztBQWVBLE9BQU8sV0FBUCxHQUFrQixPQUFsQjs7O0FDbEJBOzs7Ozs7Ozs7Ozs7OztBQUNBLElBQUksU0FBUyxHQUFJLFVBQVEsU0FBSyxTQUFkLElBQTZCLFlBQVk7QUFDckQsTUFBSSxjQUFhLEdBQUcsdUJBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFDaEMsSUFBQSxjQUFhLEdBQUcsTUFBTSxDQUFDLGNBQVAsSUFDWDtBQUFFLE1BQUEsU0FBUyxFQUFFO0FBQWIsaUJBQTZCLEtBQTdCLElBQXNDLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFBRSxNQUFBLENBQUMsQ0FBQyxTQUFGLEdBQWMsQ0FBZDtBQUFrQixLQUQvRCxJQUVaLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFBRSxXQUFLLElBQUksQ0FBVCxJQUFjLENBQWQ7QUFBaUIsWUFBSSxDQUFDLENBQUMsY0FBRixDQUFpQixDQUFqQixDQUFKLEVBQXlCLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTyxDQUFDLENBQUMsQ0FBRCxDQUFSO0FBQTFDO0FBQXdELEtBRjlFOztBQUdBLFdBQU8sY0FBYSxDQUFDLENBQUQsRUFBSSxDQUFKLENBQXBCO0FBQ0gsR0FMRDs7QUFNQSxTQUFPLFVBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0I7QUFDbkIsSUFBQSxjQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBYjs7QUFDQSxhQUFTLEVBQVQsR0FBYztBQUFFLFdBQUssV0FBTCxHQUFtQixDQUFuQjtBQUF1Qjs7QUFDdkMsSUFBQSxDQUFDLENBQUMsU0FBRixHQUFjLENBQUMsS0FBSyxJQUFOLEdBQWEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxDQUFkLENBQWIsSUFBaUMsRUFBRSxDQUFDLFNBQUgsR0FBZSxDQUFDLENBQUMsU0FBakIsRUFBNEIsSUFBSSxFQUFKLEVBQTdELENBQWQ7QUFDSCxHQUpEO0FBS0gsQ0FaMkMsRUFBNUM7O0FBYUEsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRSxFQUFBLEtBQUssRUFBRTtBQUFULENBQTdDO0FBQ0EsT0FBTyxDQUFDLEtBQVIsR0FBZ0IsT0FBTyxDQUFDLGFBQVIsR0FBd0IsS0FBSyxDQUE3Qzs7QUFDQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsbUJBQUQsQ0FBbkI7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQW5COztBQUNBLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQXpCOztBQUNBLElBQUksYUFBSjs7QUFDQSxDQUFDLFVBQVUsYUFBVixFQUF5QjtBQUN0QixFQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsYUFBRCxDQUFiLEdBQStCLENBQWhDLENBQWIsR0FBa0QsYUFBbEQ7QUFDQSxFQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBRCxDQUFiLEdBQTZCLENBQTlCLENBQWIsR0FBZ0QsV0FBaEQ7QUFDQSxFQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsS0FBRCxDQUFiLEdBQXVCLENBQXhCLENBQWIsR0FBMEMsS0FBMUM7QUFDQSxFQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsUUFBRCxDQUFiLEdBQTBCLENBQTNCLENBQWIsR0FBNkMsUUFBN0M7QUFDQSxFQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsVUFBRCxDQUFiLEdBQTRCLEVBQTdCLENBQWIsR0FBZ0QsVUFBaEQ7QUFDQSxFQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsUUFBRCxDQUFiLEdBQTBCLEVBQTNCLENBQWIsR0FBOEMsUUFBOUM7QUFDQSxFQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsV0FBRCxDQUFiLEdBQTZCLEVBQTlCLENBQWIsR0FBaUQsV0FBakQ7QUFDQSxFQUFBLGFBQWEsQ0FBQyxhQUFhLENBQUMsT0FBRCxDQUFiLEdBQXlCLEdBQTFCLENBQWIsR0FBOEMsT0FBOUM7QUFDSCxDQVRELEVBU0csYUFBYSxHQUFHLE9BQU8sQ0FBQyxhQUFSLEtBQTBCLE9BQU8sQ0FBQyxhQUFSLEdBQXdCLEVBQWxELENBVG5COztBQVVBLElBQUksS0FBSyxHQUFJLFVBQVUsTUFBVixFQUFrQjtBQUMzQixFQUFBLFNBQVMsQ0FBQyxLQUFELEVBQVEsTUFBUixDQUFUOztBQUNBLFdBQVMsS0FBVCxHQUFpQjtBQUNiLFdBQU8sTUFBTSxLQUFLLElBQVgsSUFBbUIsTUFBTSxDQUFDLEtBQVAsQ0FBYSxJQUFiLEVBQW1CLFNBQW5CLENBQW5CLElBQW9ELElBQTNEO0FBQ0g7O0FBQ0QsRUFBQSxLQUFLLENBQUMsU0FBTixDQUFnQixXQUFoQixHQUE4QixZQUFZO0FBQ3RDLFdBQU8sS0FBSyxJQUFMLENBQVUsUUFBakI7QUFDSCxHQUZEOztBQUdBLEVBQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsTUFBaEIsR0FBeUIsWUFBWSxDQUFHLENBQXhDOztBQUNBLEVBQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsT0FBaEIsR0FBMEIsWUFBWTtBQUNsQyxRQUFJLEtBQUssR0FBRyxJQUFaOztBQUNBLElBQUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxPQUFWLENBQWtCLHlCQUF5QixLQUFLLElBQUwsQ0FBVSxHQUFyRCxFQUEwRCxJQUExRCxDQUErRCxVQUFVLEdBQVYsRUFBZTtBQUMxRSxNQUFBLEdBQUcsQ0FBQyxZQUFKLENBQWlCLE9BQWpCLEVBQTBCLE1BQTFCOztBQUNBLFVBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxZQUFOLENBQW1CLFNBQW5CLENBQWQ7O0FBQ0EsTUFBQSxPQUFPLENBQUMsVUFBUixDQUFtQixZQUFuQixDQUFnQyxHQUFoQyxFQUFxQyxPQUFyQztBQUNILEtBSkQ7QUFLSCxHQVBEOztBQVFBLEVBQUEsS0FBSyxDQUFDLFNBQU4sQ0FBZ0IsYUFBaEIsR0FBZ0MsWUFBWTtBQUN4QyxRQUFJLENBQUMsS0FBSyxDQUFDLFVBQVgsRUFBdUI7QUFDbkIsWUFBTSx3REFBTjtBQUNIOztBQUNELFdBQVEsS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsSUFBbkMsRUFBeUM7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQXpDLEVBQ0osS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsS0FBbkMsRUFBMEM7QUFBRSxNQUFBLFNBQVMsRUFBRSxtQkFBYjtBQUFrQyxNQUFBLEtBQUssRUFBRTtBQUFFLFFBQUEsS0FBSyxFQUFFLEtBQUssSUFBTCxDQUFVO0FBQW5CO0FBQXpDLEtBQTFDLEVBQ0ksS0FBSyxDQUFDLGNBQU4sQ0FBcUIsYUFBckIsQ0FBbUMsTUFBbkMsRUFBMkM7QUFBRSxNQUFBLFNBQVMsRUFBRTtBQUFiLEtBQTNDLEVBQW1GLEtBQUssSUFBTCxDQUFVLElBQTdGLENBREosRUFFSSxLQUFLLENBQUMsVUFBTixDQUFpQixTQUFqQixDQUEyQixJQUEzQixDQUZKLENBREksQ0FBUjtBQUlILEdBUkQ7O0FBU0EsRUFBQSxLQUFLLENBQUMsVUFBTixHQUFtQixZQUFZO0FBQzNCLFdBQU8sSUFBSSxPQUFKLENBQVksVUFBVSxPQUFWLEVBQW1CLE1BQW5CLEVBQTJCO0FBQzFDLFVBQUksS0FBSyxDQUFDLFVBQVYsRUFBc0I7QUFDbEIsUUFBQSxPQUFPLENBQUMsSUFBRCxDQUFQO0FBQ0gsT0FGRCxNQUdLO0FBQ0QsUUFBQSxLQUFLLENBQUMsR0FBTixDQUFVLE9BQVYsQ0FBa0IsOEJBQWxCLEVBQWtELElBQWxELENBQXVELFVBQVUsT0FBVixFQUFtQjtBQUN0RSxVQUFBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLE9BQXJCLEVBQThCLFNBQTlCO0FBQ0EsVUFBQSxPQUFPLENBQUMsWUFBUixDQUFxQixLQUFyQixFQUE0QixTQUE1QjtBQUNBLFVBQUEsS0FBSyxDQUFDLFVBQU4sR0FBbUIsT0FBbkI7QUFDQSxVQUFBLE9BQU8sQ0FBQyxJQUFELENBQVA7QUFDSCxTQUxELFdBTVcsVUFBVSxHQUFWLEVBQWU7QUFDdEIsVUFBQSxPQUFPLENBQUMsS0FBRCxDQUFQO0FBQ0gsU0FSRDtBQVNIO0FBQ0osS0FmTSxDQUFQO0FBZ0JILEdBakJEOztBQWtCQSxTQUFPLEtBQVA7QUFDSCxDQTdDWSxDQTZDWCxXQUFXLENBQUMsYUE3Q0QsQ0FBYjs7QUE4Q0EsT0FBTyxDQUFDLEtBQVIsR0FBZ0IsS0FBaEI7QUFDQSxLQUFLLENBQUMsVUFBTjs7O0FDN0VBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxJQUFJLFFBQVEsR0FBSSxVQUFRLFNBQUssUUFBZCxJQUEyQixZQUFZO0FBQ2xELEVBQUEsUUFBUSxHQUFHLE1BQU0sQ0FBQyxNQUFQLElBQWlCLFVBQVMsQ0FBVCxFQUFZO0FBQ3BDLFNBQUssSUFBSSxDQUFKLEVBQU8sQ0FBQyxHQUFHLENBQVgsRUFBYyxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQWpDLEVBQXlDLENBQUMsR0FBRyxDQUE3QyxFQUFnRCxDQUFDLEVBQWpELEVBQXFEO0FBQ2pELE1BQUEsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFELENBQWI7O0FBQ0EsV0FBSyxJQUFJLENBQVQsSUFBYyxDQUFkO0FBQWlCLFlBQUksTUFBTSxDQUFDLFNBQVAsQ0FBaUIsY0FBakIsQ0FBZ0MsSUFBaEMsQ0FBcUMsQ0FBckMsRUFBd0MsQ0FBeEMsQ0FBSixFQUNiLENBQUMsQ0FBQyxDQUFELENBQUQsR0FBTyxDQUFDLENBQUMsQ0FBRCxDQUFSO0FBREo7QUFFSDs7QUFDRCxXQUFPLENBQVA7QUFDSCxHQVBEOztBQVFBLFNBQU8sUUFBUSxDQUFDLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLFNBQXJCLENBQVA7QUFDSCxDQVZEOztBQVdBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxZQUFSLEdBQXVCLEtBQUssQ0FBNUI7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLHVCQUFELENBQW5COztBQUNBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxtQkFBRCxDQUFuQjs7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBRCxDQUFyQjs7QUFDQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsdUJBQUQsQ0FBdkI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLG1CQUFELENBQXRCOztBQUNBLElBQUksWUFBWSxHQUFJLFlBQVk7QUFDNUIsV0FBUyxZQUFULEdBQXdCO0FBQ3BCLFFBQUksS0FBSyxHQUFHLElBQVo7O0FBQ0EsU0FBSyxNQUFMLEdBQWMsQ0FBZDtBQUNBLFNBQUssTUFBTCxHQUFjLEtBQWQ7QUFDQSxTQUFLLEdBQUwsR0FBVyxLQUFYO0FBQ0EsU0FBSyxTQUFMLEdBQWlCLEdBQWpCO0FBQ0EsU0FBSyxjQUFMLEdBQXNCLElBQUksR0FBSixFQUF0QjtBQUNBLFNBQUssYUFBTCxHQUFxQixFQUFyQjtBQUNBLFNBQUssY0FBTCxHQUFzQixLQUF0QjtBQUNBLFNBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNBLFNBQUssU0FBTCxHQUFpQixLQUFLLENBQUMsR0FBTixDQUFVLGVBQVYsQ0FBMEIsK0JBQTFCLENBQWpCO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEtBQUssU0FBTCxDQUFlLGFBQWYsQ0FBNkIsV0FBN0IsQ0FBaEI7QUFDQSxTQUFLLHNCQUFMLEdBQThCLEtBQUssUUFBTCxDQUFjLGFBQWQsQ0FBNEIsNEJBQTVCLENBQTlCO0FBQ0EsU0FBSyxJQUFMLEdBQVksS0FBSyxRQUFMLENBQWMsYUFBZCxDQUE0QixPQUE1QixDQUFaO0FBQ0EsU0FBSyxXQUFMLEdBQW1CLEtBQUssSUFBTCxDQUFVLGFBQVYsQ0FBd0IsVUFBeEIsQ0FBbkI7QUFDQSxTQUFLLFdBQUwsR0FBbUIsTUFBTSxDQUFDLE9BQVAsQ0FBZSxPQUFPLENBQUMsYUFBdkIsRUFDZCxNQURjLENBQ1AsVUFBVSxFQUFWLEVBQWM7QUFDdEIsVUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBWjtBQUFBLFVBQWlCLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUF6QjtBQUNBLGFBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUQsQ0FBUCxDQUFiO0FBQ0gsS0FKa0IsRUFLZCxNQUxjLENBS1AsVUFBVSxHQUFWLEVBQWUsRUFBZixFQUFtQjtBQUMzQixVQUFJLEVBQUo7O0FBQ0EsVUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBWjtBQUFBLFVBQWlCLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUF6QjtBQUNBLGFBQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFELEVBQUssR0FBTCxDQUFULEdBQXFCLEVBQUUsR0FBRyxFQUFMLEVBQVMsRUFBRSxDQUFDLEdBQUQsQ0FBRixHQUFVLEdBQW5CLEVBQXdCLEVBQTdDLEVBQWY7QUFDSCxLQVRrQixFQVNoQixFQVRnQixDQUFuQjtBQVVBLElBQUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFWLEdBQWlCLElBQWpCLENBQXNCLFVBQVUsUUFBVixFQUFvQjtBQUN0QyxNQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsVUFBZCxHQUEyQixJQUEzQixDQUFnQyxZQUFZO0FBQ3hDLFFBQUEsS0FBSyxDQUFDLFVBQU47O0FBQ0EsUUFBQSxLQUFLLENBQUMsbUJBQU47O0FBQ0EsUUFBQSxLQUFLLENBQUMsYUFBTjs7QUFDQSxRQUFBLEtBQUssQ0FBQyxNQUFOOztBQUNBLFFBQUEsS0FBSyxDQUFDLG9CQUFOO0FBQ0gsT0FORDtBQU9ILEtBUkQ7QUFTSDs7QUFDRCxFQUFBLFlBQVksQ0FBQyxTQUFiLENBQXVCLFVBQXZCLEdBQW9DLFlBQVk7QUFDNUMsU0FBSyxJQUFMLENBQVUsS0FBVixDQUFnQixTQUFoQixHQUE0QixLQUFLLFNBQUwsR0FBaUIsSUFBN0M7QUFDQSxTQUFLLGFBQUw7QUFDSCxHQUhEOztBQUlBLEVBQUEsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsYUFBdkIsR0FBdUMsWUFBWTtBQUMvQyxRQUFJLEtBQUssR0FBRyxJQUFaOztBQUNBLElBQUEsTUFBTSxDQUFDLE9BQVAsQ0FBZSxLQUFLLFdBQXBCLEVBQWlDLE9BQWpDLENBQXlDLFVBQVUsRUFBVixFQUFjO0FBQ25ELFVBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFELENBQVo7QUFBQSxVQUFpQixHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBekI7QUFDQSxVQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxJQUFuQyxFQUF5QztBQUFFLFFBQUEsU0FBUyxFQUFFO0FBQWIsT0FBekMsRUFBcUUsR0FBckUsQ0FBZDs7QUFDQSxNQUFBLEtBQUssQ0FBQyxjQUFOLENBQXFCLEdBQXJCLENBQXlCLE9BQXpCLEVBQWtDLE1BQU0sQ0FBQyxHQUFELENBQXhDOztBQUNBLE1BQUEsS0FBSyxDQUFDLFdBQU4sQ0FBa0IsV0FBbEIsQ0FBOEIsT0FBOUI7QUFDSCxLQUxEO0FBTUgsR0FSRDs7QUFTQSxFQUFBLFlBQVksQ0FBQyxTQUFiLENBQXVCLG1CQUF2QixHQUE2QyxZQUFZO0FBQ3JELFNBQUssSUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZLFFBQVEsR0FBRyxRQUFRLENBQUMsTUFBckMsRUFBNkMsRUFBRSxHQUFHLFFBQVEsQ0FBQyxNQUEzRCxFQUFtRSxFQUFFLEVBQXJFLEVBQXlFO0FBQ3JFLFVBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxFQUFELENBQXBCO0FBQ0EsV0FBSyxhQUFMLENBQW1CLElBQW5CLENBQXdCLElBQUksT0FBTyxDQUFDLEtBQVosQ0FBa0IsS0FBbEIsQ0FBeEI7QUFDSDtBQUNKLEdBTEQ7O0FBTUEsRUFBQSxZQUFZLENBQUMsU0FBYixDQUF1QixNQUF2QixHQUFnQyxZQUFZO0FBQ3hDLFFBQUksS0FBSyxHQUFHLElBQVo7O0FBQ0EsU0FBSyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsVUFBVixDQUFxQixRQUFyQixDQUE4QixNQUE5QixHQUF1QyxDQUFwRCxFQUF1RCxDQUFDLElBQUksQ0FBNUQsRUFBK0QsRUFBRSxDQUFqRSxFQUFvRTtBQUNoRSxNQUFBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLFdBQXJCLENBQWlDLFNBQVMsQ0FBQyxVQUFWLENBQXFCLFFBQXJCLENBQThCLElBQTlCLENBQW1DLENBQW5DLENBQWpDO0FBQ0g7O0FBQ0QsUUFBSSxLQUFLLE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFDbkIsV0FBSyxhQUFMLENBQW1CLE9BQW5CLENBQTJCLFVBQVUsS0FBVixFQUFpQjtBQUFFLGVBQU8sS0FBSyxDQUFDLFFBQU4sQ0FBZSxTQUFTLENBQUMsVUFBekIsQ0FBUDtBQUE4QyxPQUE1RjtBQUNBLFdBQUssc0JBQUwsQ0FBNEIsU0FBNUIsR0FBd0MsTUFBeEM7QUFDSCxLQUhELE1BSUs7QUFDRCxXQUFLLGFBQUwsQ0FBbUIsTUFBbkIsQ0FBMEIsVUFBVSxLQUFWLEVBQWlCO0FBQUUsZUFBTyxDQUFDLEtBQUssQ0FBQyxXQUFOLEtBQXNCLEtBQUssQ0FBQyxNQUE3QixNQUF5QyxDQUFoRDtBQUFvRCxPQUFqRyxFQUNLLE9BREwsQ0FDYSxVQUFVLEtBQVYsRUFBaUI7QUFBRSxlQUFPLEtBQUssQ0FBQyxRQUFOLENBQWUsU0FBUyxDQUFDLFVBQXpCLENBQVA7QUFBOEMsT0FEOUU7QUFFQSxVQUFJLElBQUksR0FBRyxNQUFNLENBQUMsT0FBUCxDQUFlLEtBQUssV0FBcEIsRUFBaUMsTUFBakMsQ0FBd0MsVUFBVSxFQUFWLEVBQWM7QUFDN0QsWUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBWjtBQUFBLFlBQWlCLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUF6QjtBQUNBLGVBQU8sQ0FBQyxLQUFLLENBQUMsTUFBTixHQUFlLE1BQU0sQ0FBQyxHQUFELENBQXRCLE1BQWlDLENBQXhDO0FBQ0gsT0FIVSxFQUlOLEdBSk0sQ0FJRixVQUFVLEVBQVYsRUFBYztBQUNuQixZQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUFaO0FBQUEsWUFBaUIsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFELENBQXpCO0FBQ0EsZUFBTyxHQUFQO0FBQ0gsT0FQVSxFQU9SLElBUFEsQ0FPSCxJQVBHLENBQVg7QUFRQSxXQUFLLHNCQUFMLENBQTRCLFNBQTVCLEdBQXdDLElBQXhDO0FBQ0g7QUFDSixHQXRCRDs7QUF1QkEsRUFBQSxZQUFZLENBQUMsU0FBYixDQUF1QixvQkFBdkIsR0FBOEMsWUFBWTtBQUN0RCxRQUFJLEtBQUssR0FBRyxJQUFaOztBQUNBLElBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLE9BQTFCLEVBQW1DLFVBQVUsS0FBVixFQUFpQjtBQUNoRCxVQUFJLEtBQUssQ0FBQyxjQUFOLENBQXFCLEdBQXJCLENBQXlCLEtBQUssQ0FBQyxNQUEvQixDQUFKLEVBQTRDO0FBQ3hDLFFBQUEsS0FBSyxDQUFDLFlBQU4sQ0FBbUIsS0FBSyxDQUFDLE1BQXpCO0FBQ0gsT0FGRCxNQUdLO0FBQ0QsWUFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLEdBQU4sQ0FBVSxhQUFWLENBQXdCLEtBQUssQ0FBQyxNQUE5QixDQUFYOztBQUNBLFlBQUksSUFBSSxDQUFDLE9BQUwsQ0FBYSxLQUFLLENBQUMsUUFBbkIsTUFBaUMsQ0FBQyxDQUF0QyxFQUF5QztBQUNyQyxVQUFBLEtBQUssQ0FBQyxLQUFOO0FBQ0gsU0FGRCxNQUdLO0FBQ0QsVUFBQSxLQUFLLENBQUMsTUFBTixHQUFlLEtBQUssQ0FBQyxLQUFOLEVBQWYsR0FBK0IsS0FBSyxDQUFDLElBQU4sRUFBL0I7QUFDSDtBQUNKO0FBQ0osS0FiRCxFQWFHO0FBQ0MsTUFBQSxPQUFPLEVBQUU7QUFEVixLQWJIO0FBZ0JBLElBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLFNBQTFCLEVBQXFDLFVBQVUsS0FBVixFQUFpQjtBQUNsRCxVQUFJLEtBQUssQ0FBQyxPQUFOLEtBQWtCLEVBQXRCLEVBQTBCO0FBQ3RCLFlBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFOLENBQVUsYUFBVixDQUF3QixRQUFRLENBQUMsYUFBakMsQ0FBWDs7QUFDQSxZQUFJLElBQUksQ0FBQyxPQUFMLENBQWEsS0FBSyxDQUFDLFFBQW5CLE1BQWlDLENBQUMsQ0FBdEMsRUFBeUM7QUFDckMsY0FBSSxLQUFLLENBQUMsTUFBTixJQUFnQixLQUFLLENBQUMsY0FBMUIsRUFBMEM7QUFDdEMsWUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixLQUFLLENBQUMsWUFBekI7QUFDSDs7QUFDRCxVQUFBLEtBQUssQ0FBQyxNQUFOOztBQUNBLFVBQUEsS0FBSyxDQUFDLGNBQU47QUFDQSxVQUFBLEtBQUssQ0FBQyxlQUFOO0FBQ0g7QUFDSixPQVZELE1BV0ssSUFBSSxLQUFLLENBQUMsTUFBVixFQUFrQjtBQUNuQixZQUFJLEtBQUssQ0FBQyxPQUFOLEtBQWtCLEVBQWxCLElBQXdCLEtBQUssQ0FBQyxPQUFOLEtBQWtCLEVBQTlDLEVBQWtEO0FBQzlDLFVBQUEsS0FBSyxDQUFDLGtCQUFOLENBQXlCLENBQUMsQ0FBMUI7O0FBQ0EsVUFBQSxLQUFLLENBQUMsY0FBTjtBQUNBLFVBQUEsS0FBSyxDQUFDLGVBQU47QUFDSCxTQUpELE1BS0ssSUFBSSxLQUFLLENBQUMsT0FBTixLQUFrQixFQUFsQixJQUF3QixLQUFLLENBQUMsT0FBTixLQUFrQixFQUE5QyxFQUFrRDtBQUNuRCxVQUFBLEtBQUssQ0FBQyxrQkFBTixDQUF5QixDQUF6Qjs7QUFDQSxVQUFBLEtBQUssQ0FBQyxjQUFOO0FBQ0EsVUFBQSxLQUFLLENBQUMsZUFBTjtBQUNIO0FBQ0o7QUFDSixLQXhCRDtBQXlCQSxTQUFLLFdBQUwsQ0FBaUIsZ0JBQWpCLENBQWtDLFdBQWxDLEVBQStDLFVBQVUsS0FBVixFQUFpQjtBQUM1RCxVQUFJLEtBQUssQ0FBQyxZQUFWLEVBQXdCO0FBQ3BCLFFBQUEsS0FBSyxDQUFDLGNBQU4sR0FBdUIsS0FBdkI7O0FBQ0EsUUFBQSxLQUFLLENBQUMsWUFBTixDQUFtQixTQUFuQixDQUE2QixNQUE3QixDQUFvQyxPQUFwQztBQUNIO0FBQ0osS0FMRDtBQU1BLFNBQUssUUFBTCxDQUFjLGdCQUFkLENBQStCLE1BQS9CLEVBQXVDLFVBQVUsS0FBVixFQUFpQjtBQUNwRCxVQUFJLEtBQUssQ0FBQyxNQUFWLEVBQWtCO0FBQ2QsUUFBQSxLQUFLLENBQUMsS0FBTjtBQUNIO0FBQ0osS0FKRDtBQUtBLElBQUEsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsZ0JBQXJCLENBQXNDLFFBQXRDLEVBQWdELFVBQVUsS0FBVixFQUFpQjtBQUM3RCxNQUFBLEtBQUssQ0FBQyxhQUFOO0FBQ0gsS0FGRCxFQUVHO0FBQ0MsTUFBQSxPQUFPLEVBQUU7QUFEVixLQUZIO0FBS0gsR0EzREQ7O0FBNERBLEVBQUEsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsS0FBdkIsR0FBK0IsWUFBWTtBQUN2QyxTQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0EsU0FBSyxRQUFMLENBQWMsU0FBZCxDQUF3QixNQUF4QixDQUErQixRQUEvQjtBQUNILEdBSEQ7O0FBSUEsRUFBQSxZQUFZLENBQUMsU0FBYixDQUF1QixJQUF2QixHQUE4QixZQUFZO0FBQ3RDLFNBQUssTUFBTCxHQUFjLElBQWQ7QUFDQSxTQUFLLFFBQUwsQ0FBYyxTQUFkLENBQXdCLEdBQXhCLENBQTRCLFFBQTVCOztBQUNBLFFBQUksS0FBSyxZQUFULEVBQXVCO0FBQ25CLFdBQUssWUFBTCxDQUFrQixTQUFsQixDQUE0QixHQUE1QixDQUFnQyxPQUFoQztBQUNIO0FBQ0osR0FORDs7QUFPQSxFQUFBLFlBQVksQ0FBQyxTQUFiLENBQXVCLE1BQXZCLEdBQWdDLFlBQVk7QUFDeEMsU0FBSyxNQUFMLEdBQWMsS0FBSyxLQUFMLEVBQWQsR0FBNkIsS0FBSyxJQUFMLEVBQTdCO0FBQ0gsR0FGRDs7QUFHQSxFQUFBLFlBQVksQ0FBQyxTQUFiLENBQXVCLFlBQXZCLEdBQXNDLFVBQVUsTUFBVixFQUFrQjtBQUNwRCxRQUFJLEdBQUcsR0FBRyxLQUFLLGNBQUwsQ0FBb0IsR0FBcEIsQ0FBd0IsTUFBeEIsQ0FBVjs7QUFDQSxRQUFJLENBQUMsS0FBSyxNQUFMLEdBQWMsR0FBZixNQUF3QixDQUE1QixFQUErQjtBQUMzQixNQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLE1BQWpCLENBQXdCLFVBQXhCO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsTUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixHQUFqQixDQUFxQixVQUFyQjtBQUNIOztBQUNELFNBQUssTUFBTCxJQUFlLEdBQWY7QUFDQSxTQUFLLFlBQUwsR0FBb0IsTUFBcEI7QUFDQSxTQUFLLE1BQUw7QUFDSCxHQVhEOztBQVlBLEVBQUEsWUFBWSxDQUFDLFNBQWIsQ0FBdUIsa0JBQXZCLEdBQTRDLFVBQVUsR0FBVixFQUFlO0FBQ3ZELFFBQUksQ0FBQyxLQUFLLFlBQVYsRUFBd0I7QUFDcEIsV0FBSyxZQUFMLEdBQW9CLEtBQUssV0FBTCxDQUFpQixpQkFBckM7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBNEIsR0FBNUIsQ0FBZ0MsT0FBaEM7QUFDSCxLQUhELE1BSUs7QUFDRCxVQUFJLEtBQUssY0FBVCxFQUF5QjtBQUNyQixhQUFLLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBNEIsTUFBNUIsQ0FBbUMsT0FBbkM7O0FBQ0EsWUFBSSxHQUFHLEdBQUcsQ0FBVixFQUFhO0FBQ1QsZUFBSyxZQUFMLEdBQXFCLEtBQUssWUFBTCxDQUFrQixzQkFBbEIsSUFBNEMsS0FBSyxXQUFMLENBQWlCLGdCQUFsRjtBQUNILFNBRkQsTUFHSztBQUNELGVBQUssWUFBTCxHQUFxQixLQUFLLFlBQUwsQ0FBa0Isa0JBQWxCLElBQXdDLEtBQUssV0FBTCxDQUFpQixpQkFBOUU7QUFDSDtBQUNKLE9BUkQsTUFTSztBQUNELGFBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNIOztBQUNELFdBQUssWUFBTCxDQUFrQixTQUFsQixDQUE0QixHQUE1QixDQUFnQyxPQUFoQzs7QUFDQSxVQUFJLENBQUMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxZQUFWLENBQXVCLEtBQUssWUFBNUIsRUFBMEM7QUFBRSxRQUFBLE9BQU8sRUFBRSxJQUFYO0FBQWlCLFFBQUEsS0FBSyxFQUFFO0FBQXhCLE9BQTFDLENBQUwsRUFBZ0Y7QUFDNUUsUUFBQSxLQUFLLENBQUMsR0FBTixDQUFVLCtCQUFWLENBQTBDLEtBQUssSUFBL0MsRUFBcUQsS0FBSyxZQUExRCxFQUF3RTtBQUFFLFVBQUEsT0FBTyxFQUFFLElBQVg7QUFBaUIsVUFBQSxNQUFNLEVBQUU7QUFBekIsU0FBeEU7QUFDSDtBQUNKOztBQUNELFNBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNILEdBeEJEOztBQXlCQSxFQUFBLFlBQVksQ0FBQyxTQUFiLENBQXVCLGFBQXZCLEdBQXVDLFlBQVk7QUFDL0MsUUFBSSxLQUFLLENBQUMsR0FBTixDQUFVLHVCQUFWLENBQWtDLEtBQUssUUFBdkMsS0FBb0QsS0FBSyxTQUE3RCxFQUF3RTtBQUNwRSxVQUFJLENBQUMsS0FBSyxHQUFWLEVBQWU7QUFDWCxhQUFLLEdBQUwsR0FBVyxJQUFYO0FBQ0EsYUFBSyxRQUFMLENBQWMsU0FBZCxDQUF3QixHQUF4QixDQUE0QixLQUE1QjtBQUNIO0FBQ0osS0FMRCxNQU1LO0FBQ0QsVUFBSSxLQUFLLEdBQVQsRUFBYztBQUNWLGFBQUssR0FBTCxHQUFXLEtBQVg7QUFDQSxhQUFLLFFBQUwsQ0FBYyxTQUFkLENBQXdCLE1BQXhCLENBQStCLEtBQS9CO0FBQ0g7QUFDSjtBQUNKLEdBYkQ7O0FBY0EsU0FBTyxZQUFQO0FBQ0gsQ0E1TW1CLEVBQXBCOztBQTZNQSxPQUFPLENBQUMsWUFBUixHQUF1QixZQUF2Qjs7O0FDaE9BOzs7Ozs7Ozs7O0FBQ0EsSUFBSSxTQUFTLEdBQUksVUFBUSxTQUFLLFNBQWQsSUFBNkIsWUFBWTtBQUNyRCxNQUFJLGNBQWEsR0FBRyx1QkFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUNoQyxJQUFBLGNBQWEsR0FBRyxNQUFNLENBQUMsY0FBUCxJQUNYO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixpQkFBNkIsS0FBN0IsSUFBc0MsVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUFFLE1BQUEsQ0FBQyxDQUFDLFNBQUYsR0FBYyxDQUFkO0FBQWtCLEtBRC9ELElBRVosVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUFFLFdBQUssSUFBSSxDQUFULElBQWMsQ0FBZDtBQUFpQixZQUFJLENBQUMsQ0FBQyxjQUFGLENBQWlCLENBQWpCLENBQUosRUFBeUIsQ0FBQyxDQUFDLENBQUQsQ0FBRCxHQUFPLENBQUMsQ0FBQyxDQUFELENBQVI7QUFBMUM7QUFBd0QsS0FGOUU7O0FBR0EsV0FBTyxjQUFhLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBcEI7QUFDSCxHQUxEOztBQU1BLFNBQU8sVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUNuQixJQUFBLGNBQWEsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFiOztBQUNBLGFBQVMsRUFBVCxHQUFjO0FBQUUsV0FBSyxXQUFMLEdBQW1CLENBQW5CO0FBQXVCOztBQUN2QyxJQUFBLENBQUMsQ0FBQyxTQUFGLEdBQWMsQ0FBQyxLQUFLLElBQU4sR0FBYSxNQUFNLENBQUMsTUFBUCxDQUFjLENBQWQsQ0FBYixJQUFpQyxFQUFFLENBQUMsU0FBSCxHQUFlLENBQUMsQ0FBQyxTQUFqQixFQUE0QixJQUFJLEVBQUosRUFBN0QsQ0FBZDtBQUNILEdBSkQ7QUFLSCxDQVoyQyxFQUE1Qzs7QUFhQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7QUFDQSxPQUFPLENBQUMsTUFBUixHQUFpQixLQUFLLENBQXRCOztBQUNBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyx1QkFBRCxDQUFuQjs7QUFDQSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsY0FBRCxDQUF6Qjs7QUFDQSxJQUFJLE1BQU0sR0FBSSxVQUFVLE1BQVYsRUFBa0I7QUFDNUIsRUFBQSxTQUFTLENBQUMsTUFBRCxFQUFTLE1BQVQsQ0FBVDs7QUFDQSxXQUFTLE1BQVQsR0FBa0I7QUFDZCxXQUFPLE1BQU0sS0FBSyxJQUFYLElBQW1CLE1BQU0sQ0FBQyxLQUFQLENBQWEsSUFBYixFQUFtQixTQUFuQixDQUFuQixJQUFvRCxJQUEzRDtBQUNIOztBQUNELEVBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsTUFBakIsR0FBMEIsWUFBWSxDQUFHLENBQXpDOztBQUNBLEVBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsYUFBakIsR0FBaUMsWUFBWTtBQUN6QyxXQUFRLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEtBQW5DLEVBQTBDO0FBQUUsTUFBQSxTQUFTLEVBQUU7QUFBYixLQUExQyxFQUNKLEtBQUssQ0FBQyxjQUFOLENBQXFCLGFBQXJCLENBQW1DLEdBQW5DLEVBQXdDO0FBQUUsTUFBQSxTQUFTLEVBQUUsdUJBQWI7QUFBc0MsTUFBQSxJQUFJLEVBQUUsS0FBSyxJQUFMLENBQVUsSUFBdEQ7QUFBNEQsTUFBQSxNQUFNLEVBQUU7QUFBcEUsS0FBeEMsRUFDSSxLQUFLLENBQUMsY0FBTixDQUFxQixhQUFyQixDQUFtQyxHQUFuQyxFQUF3QztBQUFFLE1BQUEsU0FBUyxFQUFFLEtBQUssSUFBTCxDQUFVO0FBQXZCLEtBQXhDLENBREosQ0FESSxDQUFSO0FBR0gsR0FKRDs7QUFLQSxTQUFPLE1BQVA7QUFDSCxDQVphLENBWVosV0FBVyxDQUFDLGFBWkEsQ0FBZDs7QUFhQSxPQUFPLENBQUMsTUFBUixHQUFpQixNQUFqQjs7O0FDL0JBOzs7O0FBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRSxFQUFBLEtBQUssRUFBRTtBQUFULENBQTdDO0FBQ0EsT0FBTyxDQUFDLE9BQVIsR0FBa0IsS0FBSyxDQUF2QjtBQUNBLE9BQU8sQ0FBQyxPQUFSLEdBQWtCLGliQUFsQjs7O0FDSEE7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7QUFDQSxPQUFPLENBQUMsU0FBUixHQUFvQixLQUFLLENBQXpCO0FBQ0EsT0FBTyxDQUFDLFNBQVIsR0FBb0IsQ0FDaEI7QUFDSSxFQUFBLElBQUksRUFBRSxtQ0FEVjtBQUVJLEVBQUEsS0FBSyxFQUFFLFNBRlg7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxJQUFJLEVBQUUscUJBSlY7QUFLSSxFQUFBLFFBQVEsRUFBRSxxQkFMZDtBQU1JLEVBQUEsTUFBTSxFQUFFLHlDQU5aO0FBT0ksRUFBQSxLQUFLLEVBQUUsV0FQWDtBQVFJLEVBQUEsR0FBRyxFQUFFLFdBUlQ7QUFTSSxFQUFBLE9BQU8sRUFBRTtBQUNMLElBQUEsS0FBSyxFQUFFLEdBREY7QUFFTCxJQUFBLFNBQVMsRUFBRSxFQUZOO0FBR0wsSUFBQSxNQUFNLEVBQUU7QUFISCxHQVRiO0FBY0ksRUFBQSxHQUFHLEVBQUU7QUFDRCxJQUFBLE9BQU8sRUFBRSxLQURSO0FBRUQsSUFBQSxLQUFLLEVBQUU7QUFGTixHQWRUO0FBa0JJLEVBQUEsS0FBSyxFQUFFLENBQ0gsb0JBREcsQ0FsQlg7QUFxQkksRUFBQSxPQUFPLEVBQUUsQ0FDTCxrQ0FESyxFQUVMLHVCQUZLLEVBR0wsc0JBSEssRUFJTCxxQkFKSztBQXJCYixDQURnQixDQUFwQjs7O0FDSEE7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7QUFDQSxPQUFPLENBQUMsVUFBUixHQUFxQixLQUFLLENBQTFCO0FBQ0EsT0FBTyxDQUFDLFVBQVIsR0FBcUIsQ0FDakI7QUFDSSxFQUFBLEdBQUcsRUFBRSxVQURUO0FBRUksRUFBQSxJQUFJLEVBQUUsMkJBRlY7QUFHSSxFQUFBLE9BQU8sRUFBRSxzQkFIYjtBQUlJLEVBQUEsUUFBUSxFQUFFLFFBSmQ7QUFLSSxFQUFBLFFBQVEsRUFBRSwwQkFMZDtBQU1JLEVBQUEsS0FBSyxFQUFFLFdBTlg7QUFPSSxFQUFBLEdBQUcsRUFBRSxXQVBUO0FBUUksRUFBQSxNQUFNLEVBQUUsb1hBUlo7QUFTSSxFQUFBLEtBQUssRUFBRSxDQUNILG9HQURHLEVBRUgsK0dBRkcsRUFHSCxvRkFIRyxFQUlILGtGQUpHLEVBS0gsMEVBTEc7QUFUWCxDQURpQixFQWtCakI7QUFDSSxFQUFBLEdBQUcsRUFBRSxPQURUO0FBRUksRUFBQSxJQUFJLEVBQUUsc0JBRlY7QUFHSSxFQUFBLE9BQU8sRUFBRSxPQUhiO0FBSUksRUFBQSxRQUFRLEVBQUUsaUJBSmQ7QUFLSSxFQUFBLFFBQVEsRUFBRSwyQkFMZDtBQU1JLEVBQUEsS0FBSyxFQUFFLFVBTlg7QUFPSSxFQUFBLEdBQUcsRUFBRSxXQVBUO0FBUUksRUFBQSxNQUFNLEVBQUUsK1lBUlo7QUFTSSxFQUFBLEtBQUssRUFBRSxDQUNILG9IQURHLEVBRUgscUdBRkcsRUFHSCx5R0FIRyxFQUlILGdHQUpHO0FBVFgsQ0FsQmlCLEVBa0NqQjtBQUNJLEVBQUEsR0FBRyxFQUFFLFlBRFQ7QUFFSSxFQUFBLElBQUksRUFBRSxxQkFGVjtBQUdJLEVBQUEsT0FBTyxFQUFFLGFBSGI7QUFJSSxFQUFBLFFBQVEsRUFBRSxpQkFKZDtBQUtJLEVBQUEsUUFBUSxFQUFFLCtCQUxkO0FBTUksRUFBQSxLQUFLLEVBQUUsVUFOWDtBQU9JLEVBQUEsR0FBRyxFQUFFLGFBUFQ7QUFRSSxFQUFBLE1BQU0sRUFBRSxnU0FSWjtBQVNJLEVBQUEsS0FBSyxFQUFFLENBQ0gsMEZBREcsRUFFSCxxR0FGRyxFQUdILHVHQUhHO0FBVFgsQ0FsQ2lCLENBQXJCOzs7QUNIQTs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxRQUFSLEdBQW1CLEtBQUssQ0FBeEI7QUFDQSxPQUFPLENBQUMsUUFBUixHQUFtQixDQUNmO0FBQ0ksRUFBQSxJQUFJLEVBQUUsUUFEVjtBQUVJLEVBQUEsS0FBSyxFQUFFLFNBRlg7QUFHSSxFQUFBLEtBQUssRUFBRSxZQUhYO0FBSUksRUFBQSxJQUFJLEVBQUUsY0FKVjtBQUtJLEVBQUEsSUFBSSxFQUFFLGFBTFY7QUFNSSxFQUFBLEtBQUssRUFBRSxJQU5YO0FBT0ksRUFBQSxNQUFNLEVBQUUsNERBUFo7QUFRSSxFQUFBLElBQUksRUFBRSxvREFSVjtBQVNJLEVBQUEsUUFBUSxFQUFFLElBVGQ7QUFVSSxFQUFBLE9BQU8sRUFBRSxDQUNMLG9EQURLLEVBRUwsNENBRkssRUFHTCw2Q0FISztBQVZiLENBRGUsRUFpQmY7QUFDSSxFQUFBLElBQUksRUFBRSxXQURWO0FBRUksRUFBQSxLQUFLLEVBQUUsU0FGWDtBQUdJLEVBQUEsS0FBSyxFQUFFLGVBSFg7QUFJSSxFQUFBLElBQUksRUFBRSxZQUpWO0FBS0ksRUFBQSxJQUFJLEVBQUUsV0FMVjtBQU1JLEVBQUEsS0FBSyxFQUFFLHNDQU5YO0FBT0ksRUFBQSxNQUFNLEVBQUUsb0ZBUFo7QUFRSSxFQUFBLElBQUksRUFBRSx3REFSVjtBQVNJLEVBQUEsUUFBUSxFQUFFLElBVGQ7QUFVSSxFQUFBLE9BQU8sRUFBRSxDQUNMLDZDQURLLEVBRUwsd0VBRkssRUFHTCw0REFISyxFQUlMLHFEQUpLLEVBS0wsK0RBTEs7QUFWYixDQWpCZSxFQW1DZjtBQUNJLEVBQUEsSUFBSSxFQUFFLG1CQURWO0FBRUksRUFBQSxLQUFLLEVBQUUsU0FGWDtBQUdJLEVBQUEsS0FBSyxFQUFFLHVCQUhYO0FBSUksRUFBQSxJQUFJLEVBQUUsY0FKVjtBQUtJLEVBQUEsSUFBSSxFQUFFLG9CQUxWO0FBTUksRUFBQSxLQUFLLEVBQUUsSUFOWDtBQU9JLEVBQUEsTUFBTSxFQUFFLHNEQVBaO0FBUUksRUFBQSxJQUFJLEVBQUUseURBUlY7QUFTSSxFQUFBLFFBQVEsRUFBRSxnQ0FUZDtBQVVJLEVBQUEsT0FBTyxFQUFFLENBQ0wsZ0RBREssRUFFTCxvQ0FGSyxFQUdMLGtFQUhLLEVBSUwsZ0NBSks7QUFWYixDQW5DZSxFQW9EZjtBQUNJLEVBQUEsSUFBSSxFQUFFLFFBRFY7QUFFSSxFQUFBLEtBQUssRUFBRSxTQUZYO0FBR0ksRUFBQSxLQUFLLEVBQUUsWUFIWDtBQUlJLEVBQUEsSUFBSSxFQUFFLGNBSlY7QUFLSSxFQUFBLElBQUksRUFBRSxjQUxWO0FBTUksRUFBQSxLQUFLLEVBQUUsK0JBTlg7QUFPSSxFQUFBLE1BQU0sRUFBRSxpRkFQWjtBQVFJLEVBQUEsSUFBSSxFQUFFLHlEQVJWO0FBU0ksRUFBQSxRQUFRLEVBQUUsSUFUZDtBQVVJLEVBQUEsT0FBTyxFQUFFLENBQ0wsd0RBREssRUFFTCxtRUFGSztBQVZiLENBcERlLEVBbUVmO0FBQ0ksRUFBQSxJQUFJLEVBQUUsY0FEVjtBQUVJLEVBQUEsS0FBSyxFQUFFLFNBRlg7QUFHSSxFQUFBLEtBQUssRUFBRSxrQkFIWDtBQUlJLEVBQUEsSUFBSSxFQUFFLGNBSlY7QUFLSSxFQUFBLElBQUksRUFBRSxjQUxWO0FBTUksRUFBQSxLQUFLLEVBQUUsSUFOWDtBQU9JLEVBQUEsTUFBTSxFQUFFLGlGQVBaO0FBUUksRUFBQSxJQUFJLEVBQUUsb0RBUlY7QUFTSSxFQUFBLFFBQVEsRUFBRSxJQVRkO0FBVUksRUFBQSxPQUFPLEVBQUUsQ0FDTCx1Q0FESyxFQUVMLDJEQUZLLEVBR0wsK0NBSEs7QUFWYixDQW5FZSxFQW1GZjtBQUNJLEVBQUEsSUFBSSxFQUFFLG1CQURWO0FBRUksRUFBQSxLQUFLLEVBQUUsU0FGWDtBQUdJLEVBQUEsS0FBSyxFQUFFLG1CQUhYO0FBSUksRUFBQSxJQUFJLEVBQUUsZUFKVjtBQUtJLEVBQUEsSUFBSSxFQUFFLGVBTFY7QUFNSSxFQUFBLEtBQUssRUFBRSxJQU5YO0FBT0ksRUFBQSxNQUFNLEVBQUUsc0dBUFo7QUFRSSxFQUFBLElBQUksRUFBRSw0REFSVjtBQVNJLEVBQUEsUUFBUSxFQUFFLElBVGQ7QUFVSSxFQUFBLE9BQU8sRUFBRSxDQUNMLCtDQURLLEVBRUwsOENBRkssRUFHTCwrQ0FISztBQVZiLENBbkZlLEVBbUdmO0FBQ0ksRUFBQSxJQUFJLEVBQUUsaUJBRFY7QUFFSSxFQUFBLEtBQUssRUFBRSxTQUZYO0FBR0ksRUFBQSxLQUFLLEVBQUUscUJBSFg7QUFJSSxFQUFBLElBQUksRUFBRSxjQUpWO0FBS0ksRUFBQSxJQUFJLEVBQUUsV0FMVjtBQU1JLEVBQUEsS0FBSyxFQUFFLElBTlg7QUFPSSxFQUFBLE1BQU0sRUFBRSxxRkFQWjtBQVFJLEVBQUEsSUFBSSxFQUFFLHVEQVJWO0FBU0ksRUFBQSxRQUFRLEVBQUUsK0JBVGQ7QUFVSSxFQUFBLE9BQU8sRUFBRSxDQUNMLHdDQURLLEVBRUwsOENBRkssRUFHTCx3RUFISztBQVZiLENBbkdlLENBQW5COzs7QUNIQTs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxTQUFSLEdBQW9CLEtBQUssQ0FBekI7QUFDQSxPQUFPLENBQUMsU0FBUixHQUFvQixDQUNoQjtBQUNJLEVBQUEsT0FBTyxFQUFFLGdCQURiO0FBRUksRUFBQSxJQUFJLEVBQUUsV0FGVjtBQUdJLEVBQUEsV0FBVyxFQUFFO0FBSGpCLENBRGdCLEVBTWhCO0FBQ0ksRUFBQSxPQUFPLEVBQUUsa0JBRGI7QUFFSSxFQUFBLElBQUksRUFBRSxXQUZWO0FBR0ksRUFBQSxXQUFXLEVBQUU7QUFIakIsQ0FOZ0IsRUFXaEI7QUFDSSxFQUFBLE9BQU8sRUFBRSxvQkFEYjtBQUVJLEVBQUEsSUFBSSxFQUFFLFVBRlY7QUFHSSxFQUFBLFdBQVcsRUFBRTtBQUhqQixDQVhnQixDQUFwQjs7O0FDSEE7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7QUFDQSxPQUFPLENBQUMsTUFBUixHQUFpQixLQUFLLENBQXRCOztBQUNBLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQywyQkFBRCxDQUFyQjs7QUFDQSxPQUFPLENBQUMsTUFBUixHQUFpQixDQUNiO0FBQ0ksRUFBQSxJQUFJLEVBQUUscUJBRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxLQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnBDLENBRGEsRUFPYjtBQUNJLEVBQUEsSUFBSSxFQUFFLFNBRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxTQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCLEdBQXRCLEdBQTRCLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSmhFLENBUGEsRUFhYjtBQUNJLEVBQUEsSUFBSSxFQUFFLEtBRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxXQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCLFdBQXRCLEdBQW9DLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnhFLENBYmEsRUFtQmI7QUFDSSxFQUFBLElBQUksRUFBRSxJQURWO0FBRUksRUFBQSxHQUFHLEVBQUUsUUFGVDtBQUdJLEVBQUEsS0FBSyxFQUFFLFNBSFg7QUFJSSxFQUFBLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBUixDQUFzQixXQUF0QixHQUFvQyxPQUFPLENBQUMsYUFBUixDQUFzQjtBQUp4RSxDQW5CYSxFQXlCYjtBQUNJLEVBQUEsSUFBSSxFQUFFLEtBRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxLQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnBDLENBekJhLEVBK0JiO0FBQ0ksRUFBQSxJQUFJLEVBQUUsUUFEVjtBQUVJLEVBQUEsR0FBRyxFQUFFLFFBRlQ7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0I7QUFKcEMsQ0EvQmEsRUFxQ2I7QUFDSSxFQUFBLElBQUksRUFBRSxxQkFEVjtBQUVJLEVBQUEsR0FBRyxFQUFFLFFBRlQ7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsV0FBdEIsR0FBb0MsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsTUFBMUQsR0FBbUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0I7QUFKdkcsQ0FyQ2EsRUEyQ2I7QUFDSSxFQUFBLElBQUksRUFBRSxZQURWO0FBRUksRUFBQSxHQUFHLEVBQUUsU0FGVDtBQUdJLEVBQUEsS0FBSyxFQUFFLFNBSFg7QUFJSSxFQUFBLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBUixDQUFzQixNQUF0QixHQUErQixPQUFPLENBQUMsYUFBUixDQUFzQjtBQUpuRSxDQTNDYSxFQWlEYjtBQUNJLEVBQUEsSUFBSSxFQUFFLE9BRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxPQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnBDLENBakRhLEVBdURiO0FBQ0ksRUFBQSxJQUFJLEVBQUUsVUFEVjtBQUVJLEVBQUEsR0FBRyxFQUFFLFVBRlQ7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0I7QUFKcEMsQ0F2RGEsRUE2RGI7QUFDSSxFQUFBLElBQUksRUFBRSxLQURWO0FBRUksRUFBQSxHQUFHLEVBQUUsS0FGVDtBQUdJLEVBQUEsS0FBSyxFQUFFLFNBSFg7QUFJSSxFQUFBLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBUixDQUFzQjtBQUpwQyxDQTdEYSxFQW1FYjtBQUNJLEVBQUEsSUFBSSxFQUFFLFVBRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxNQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnBDLENBbkVhLEVBeUViO0FBQ0ksRUFBQSxJQUFJLEVBQUUsdUJBRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxLQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnBDLENBekVhLEVBK0ViO0FBQ0ksRUFBQSxJQUFJLEVBQUUsTUFEVjtBQUVJLEVBQUEsR0FBRyxFQUFFLE1BRlQ7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0I7QUFKcEMsQ0EvRWEsRUFxRmI7QUFDSSxFQUFBLElBQUksRUFBRSxRQURWO0FBRUksRUFBQSxHQUFHLEVBQUUsUUFGVDtBQUdJLEVBQUEsS0FBSyxFQUFFLFNBSFg7QUFJSSxFQUFBLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBUixDQUFzQjtBQUpwQyxDQXJGYSxFQTJGYjtBQUNJLEVBQUEsSUFBSSxFQUFFLE1BRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxNQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnBDLENBM0ZhLEVBaUdiO0FBQ0ksRUFBQSxJQUFJLEVBQUUsTUFEVjtBQUVJLEVBQUEsR0FBRyxFQUFFLE1BRlQ7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsV0FBdEIsR0FBb0MsT0FBTyxDQUFDLGFBQVIsQ0FBc0I7QUFKeEUsQ0FqR2EsRUF1R2I7QUFDSSxFQUFBLElBQUksRUFBRSxZQURWO0FBRUksRUFBQSxHQUFHLEVBQUUsWUFGVDtBQUdJLEVBQUEsS0FBSyxFQUFFLFNBSFg7QUFJSSxFQUFBLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBUixDQUFzQixHQUF0QixHQUE0QixPQUFPLENBQUMsYUFBUixDQUFzQjtBQUpoRSxDQXZHYSxFQTZHYjtBQUNJLEVBQUEsSUFBSSxFQUFFLE1BRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxNQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnBDLENBN0dhLEVBbUhiO0FBQ0ksRUFBQSxJQUFJLEVBQUUsWUFEVjtBQUVJLEVBQUEsR0FBRyxFQUFFLFlBRlQ7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0I7QUFKcEMsQ0FuSGEsRUF5SGI7QUFDSSxFQUFBLElBQUksRUFBRSxpQkFEVjtBQUVJLEVBQUEsR0FBRyxFQUFFLE9BRlQ7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0I7QUFKcEMsQ0F6SGEsRUErSGI7QUFDSSxFQUFBLElBQUksRUFBRSxTQURWO0FBRUksRUFBQSxHQUFHLEVBQUUsUUFGVDtBQUdJLEVBQUEsS0FBSyxFQUFFLFNBSFg7QUFJSSxFQUFBLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBUixDQUFzQixXQUF0QixHQUFvQyxPQUFPLENBQUMsYUFBUixDQUFzQjtBQUp4RSxDQS9IYSxFQXFJYjtBQUNJLEVBQUEsSUFBSSxFQUFFLFlBRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxZQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnBDLENBcklhLEVBMkliO0FBQ0ksRUFBQSxJQUFJLEVBQUUsUUFEVjtBQUVJLEVBQUEsR0FBRyxFQUFFLFFBRlQ7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsV0FBdEIsR0FBb0MsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsU0FBMUQsR0FBc0UsT0FBTyxDQUFDLGFBQVIsQ0FBc0I7QUFKMUcsQ0EzSWEsRUFpSmI7QUFDSSxFQUFBLElBQUksRUFBRSxPQURWO0FBRUksRUFBQSxHQUFHLEVBQUUsT0FGVDtBQUdJLEVBQUEsS0FBSyxFQUFFLFNBSFg7QUFJSSxFQUFBLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBUixDQUFzQixHQUF0QixHQUE0QixPQUFPLENBQUMsYUFBUixDQUFzQjtBQUpoRSxDQWpKYSxFQXVKYjtBQUNJLEVBQUEsSUFBSSxFQUFFLFlBRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxPQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnBDLENBdkphLEVBNkpiO0FBQ0ksRUFBQSxJQUFJLEVBQUUsV0FEVjtBQUVJLEVBQUEsR0FBRyxFQUFFLE1BRlQ7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0I7QUFKcEMsQ0E3SmEsRUFtS2I7QUFDSSxFQUFBLElBQUksRUFBRSxRQURWO0FBRUksRUFBQSxHQUFHLEVBQUUsUUFGVDtBQUdJLEVBQUEsS0FBSyxFQUFFLFNBSFg7QUFJSSxFQUFBLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBUixDQUFzQixTQUF0QixHQUFrQyxPQUFPLENBQUMsYUFBUixDQUFzQjtBQUp0RSxDQW5LYSxFQXlLYjtBQUNJLEVBQUEsSUFBSSxFQUFFLEtBRFY7QUFFSSxFQUFBLEdBQUcsRUFBRSxLQUZUO0FBR0ksRUFBQSxLQUFLLEVBQUUsU0FIWDtBQUlJLEVBQUEsUUFBUSxFQUFFLE9BQU8sQ0FBQyxhQUFSLENBQXNCO0FBSnBDLENBekthLEVBK0tiO0FBQ0ksRUFBQSxJQUFJLEVBQUUsWUFEVjtBQUVJLEVBQUEsR0FBRyxFQUFFLFlBRlQ7QUFHSSxFQUFBLEtBQUssRUFBRSxTQUhYO0FBSUksRUFBQSxRQUFRLEVBQUUsT0FBTyxDQUFDLGFBQVIsQ0FBc0IsR0FBdEIsR0FBNEIsT0FBTyxDQUFDLGFBQVIsQ0FBc0I7QUFKaEUsQ0EvS2EsRUFxTGI7QUFDSSxFQUFBLElBQUksRUFBRSxRQURWO0FBRUksRUFBQSxHQUFHLEVBQUUsS0FGVDtBQUdJLEVBQUEsS0FBSyxFQUFFLFNBSFg7QUFJSSxFQUFBLFFBQVEsRUFBRSxPQUFPLENBQUMsYUFBUixDQUFzQixHQUF0QixHQUE0QixPQUFPLENBQUMsYUFBUixDQUFzQjtBQUpoRSxDQXJMYSxDQUFqQjs7O0FDSkE7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7QUFDQSxPQUFPLENBQUMsTUFBUixHQUFpQixLQUFLLENBQXRCO0FBQ0EsT0FBTyxDQUFDLE1BQVIsR0FBaUIsQ0FDYjtBQUNJLEVBQUEsSUFBSSxFQUFFLFFBRFY7QUFFSSxFQUFBLE9BQU8sRUFBRSxlQUZiO0FBR0ksRUFBQSxJQUFJLEVBQUU7QUFIVixDQURhLEVBTWI7QUFDSSxFQUFBLElBQUksRUFBRSxVQURWO0FBRUksRUFBQSxPQUFPLEVBQUUsaUJBRmI7QUFHSSxFQUFBLElBQUksRUFBRTtBQUhWLENBTmEsRUFXYjtBQUNJLEVBQUEsSUFBSSxFQUFFLE9BRFY7QUFFSSxFQUFBLE9BQU8sRUFBRSxpQkFGYjtBQUdJLEVBQUEsSUFBSSxFQUFFO0FBSFYsQ0FYYSxDQUFqQjs7O0FDSEE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxjQUFSLEdBQXlCLEtBQUssQ0FBOUI7QUFDQSxJQUFJLGNBQUo7O0FBQ0EsQ0FBQyxVQUFVLGNBQVYsRUFBMEI7QUFDdkIsTUFBSSxRQUFRLEdBQUcsT0FBZjs7QUFDQSxXQUFTLGFBQVQsQ0FBdUIsT0FBdkIsRUFBZ0MsVUFBaEMsRUFBNEM7QUFDeEMsUUFBSSxRQUFRLEdBQUcsRUFBZjs7QUFDQSxTQUFLLElBQUksRUFBRSxHQUFHLENBQWQsRUFBaUIsRUFBRSxHQUFHLFNBQVMsQ0FBQyxNQUFoQyxFQUF3QyxFQUFFLEVBQTFDLEVBQThDO0FBQzFDLE1BQUEsUUFBUSxDQUFDLEVBQUUsR0FBRyxDQUFOLENBQVIsR0FBbUIsU0FBUyxDQUFDLEVBQUQsQ0FBNUI7QUFDSDs7QUFDRCxRQUFJLE9BQU8sS0FBSyxRQUFoQixFQUEwQjtBQUN0QixhQUFPLFFBQVEsQ0FBQyxzQkFBVCxFQUFQO0FBQ0g7O0FBQ0QsUUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsT0FBdkIsQ0FBZDs7QUFDQSxRQUFJLFVBQUosRUFBZ0I7QUFDWixXQUFLLElBQUksRUFBRSxHQUFHLENBQVQsRUFBWSxFQUFFLEdBQUcsTUFBTSxDQUFDLElBQVAsQ0FBWSxVQUFaLENBQXRCLEVBQStDLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBdkQsRUFBK0QsRUFBRSxFQUFqRSxFQUFxRTtBQUNqRSxZQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRCxDQUFaO0FBQ0EsWUFBSSxjQUFjLEdBQUcsVUFBVSxDQUFDLEdBQUQsQ0FBL0I7O0FBQ0EsWUFBSSxHQUFHLEtBQUssV0FBWixFQUF5QjtBQUNyQixVQUFBLE9BQU8sQ0FBQyxZQUFSLENBQXFCLE9BQXJCLEVBQThCLGNBQTlCO0FBQ0gsU0FGRCxNQUdLLElBQUksR0FBRyxLQUFLLE9BQVosRUFBcUI7QUFDdEIsY0FBSSxRQUFPLGNBQVAsTUFBMEIsUUFBOUIsRUFBd0M7QUFDcEMsWUFBQSxPQUFPLENBQUMsWUFBUixDQUFxQixPQUFyQixFQUE4QixPQUFPLENBQUMsY0FBRCxDQUFyQztBQUNILFdBRkQsTUFHSztBQUNELFlBQUEsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsT0FBckIsRUFBOEIsY0FBOUI7QUFDSDtBQUNKLFNBUEksTUFRQSxJQUFJLEdBQUcsQ0FBQyxVQUFKLENBQWUsSUFBZixLQUF3QixPQUFPLGNBQVAsS0FBMEIsVUFBdEQsRUFBa0U7QUFDbkUsVUFBQSxPQUFPLENBQUMsZ0JBQVIsQ0FBeUIsR0FBRyxDQUFDLFNBQUosQ0FBYyxDQUFkLEVBQWlCLFdBQWpCLEVBQXpCLEVBQXlELGNBQXpEO0FBQ0gsU0FGSSxNQUdBO0FBQ0QsY0FBSSxPQUFPLGNBQVAsS0FBMEIsU0FBMUIsSUFBdUMsY0FBM0MsRUFBMkQ7QUFDdkQsWUFBQSxPQUFPLENBQUMsWUFBUixDQUFxQixHQUFyQixFQUEwQixFQUExQjtBQUNILFdBRkQsTUFHSztBQUNELFlBQUEsT0FBTyxDQUFDLFlBQVIsQ0FBcUIsR0FBckIsRUFBMEIsY0FBMUI7QUFDSDtBQUNKO0FBQ0o7QUFDSjs7QUFDRCxTQUFLLElBQUksRUFBRSxHQUFHLENBQVQsRUFBWSxVQUFVLEdBQUcsUUFBOUIsRUFBd0MsRUFBRSxHQUFHLFVBQVUsQ0FBQyxNQUF4RCxFQUFnRSxFQUFFLEVBQWxFLEVBQXNFO0FBQ2xFLFVBQUksS0FBSyxHQUFHLFVBQVUsQ0FBQyxFQUFELENBQXRCO0FBQ0EsTUFBQSxXQUFXLENBQUMsT0FBRCxFQUFVLEtBQVYsQ0FBWDtBQUNIOztBQUNELFdBQU8sT0FBUDtBQUNIOztBQUNELEVBQUEsY0FBYyxDQUFDLGFBQWYsR0FBK0IsYUFBL0I7O0FBQ0EsV0FBUyxXQUFULENBQXFCLE1BQXJCLEVBQTZCLEtBQTdCLEVBQW9DO0FBQ2hDLFFBQUksT0FBTyxLQUFQLEtBQWlCLFdBQWpCLElBQWdDLEtBQUssS0FBSyxJQUE5QyxFQUFvRDtBQUNoRDtBQUNIOztBQUNELFFBQUksS0FBSyxDQUFDLE9BQU4sQ0FBYyxLQUFkLENBQUosRUFBMEI7QUFDdEIsV0FBSyxJQUFJLEVBQUUsR0FBRyxDQUFULEVBQVksT0FBTyxHQUFHLEtBQTNCLEVBQWtDLEVBQUUsR0FBRyxPQUFPLENBQUMsTUFBL0MsRUFBdUQsRUFBRSxFQUF6RCxFQUE2RDtBQUN6RCxZQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsRUFBRCxDQUFuQjtBQUNBLFFBQUEsV0FBVyxDQUFDLE1BQUQsRUFBUyxLQUFULENBQVg7QUFDSDtBQUNKLEtBTEQsTUFNSyxJQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUNoQyxNQUFBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLFFBQVEsQ0FBQyxjQUFULENBQXdCLEtBQXhCLENBQW5CO0FBQ0gsS0FGSSxNQUdBLElBQUksS0FBSyxZQUFZLElBQXJCLEVBQTJCO0FBQzVCLE1BQUEsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsS0FBbkI7QUFDSCxLQUZJLE1BR0EsSUFBSSxPQUFPLEtBQVAsS0FBaUIsU0FBckIsRUFBZ0MsQ0FDcEMsQ0FESSxNQUVBO0FBQ0QsTUFBQSxNQUFNLENBQUMsV0FBUCxDQUFtQixRQUFRLENBQUMsY0FBVCxDQUF3QixNQUFNLENBQUMsS0FBRCxDQUE5QixDQUFuQjtBQUNIO0FBQ0o7O0FBQ0QsRUFBQSxjQUFjLENBQUMsV0FBZixHQUE2QixXQUE3Qjs7QUFDQSxXQUFTLE9BQVQsQ0FBaUIsU0FBakIsRUFBNEI7QUFDeEIsUUFBSSxTQUFTLEdBQUcsRUFBaEI7QUFDQSxRQUFJLElBQUo7QUFDQSxRQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsSUFBUCxDQUFZLFNBQVosQ0FBWjs7QUFDQSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUExQixFQUFrQyxDQUFDLElBQUksU0FBUyxJQUFJLEdBQXBELEVBQXlEO0FBQ3JELE1BQUEsSUFBSSxHQUFHLEtBQUssQ0FBQyxDQUFELENBQVo7QUFDQSxNQUFBLFNBQVMsSUFBSSxJQUFJLENBQUMsT0FBTCxDQUFhLFVBQWIsRUFBeUIsVUFBVSxLQUFWLEVBQWlCO0FBQUUsZUFBTyxNQUFNLEtBQUssQ0FBQyxDQUFELENBQUwsQ0FBUyxXQUFULEVBQWI7QUFBc0MsT0FBbEYsSUFBc0YsSUFBdEYsR0FBNkYsU0FBUyxDQUFDLElBQUQsQ0FBdEcsR0FBK0csR0FBNUg7QUFDSDs7QUFDRCxXQUFPLFNBQVA7QUFDSDtBQUNKLENBL0VELEVBK0VHLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBUixLQUEyQixPQUFPLENBQUMsY0FBUixHQUF5QixFQUFwRCxDQS9FcEI7OztBQ0pBOzs7O0FBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRSxFQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBRCxDQUFuQjs7QUFDQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsb0JBQUQsQ0FBdkI7O0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLGVBQUQsQ0FBckI7O0FBQ0EsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLG1CQUFELENBQXpCOztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyw2QkFBRCxDQUF2Qjs7QUFDQSxLQUFLLENBQUMsR0FBTixDQUFVLElBQVYsR0FBaUIsSUFBakIsQ0FBc0IsVUFBVSxRQUFWLEVBQW9CO0FBQ3RDLEVBQUEsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsU0FBckIsR0FBaUMsT0FBTyxDQUFDLE9BQXpDO0FBQ0gsQ0FGRDtBQUdBLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVixHQUFpQixJQUFqQixDQUFzQixVQUFVLFFBQVYsRUFBb0I7QUFDdEMsTUFBSSxNQUFKOztBQUNBLE9BQUssSUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZLFdBQVcsR0FBRyxXQUFXLENBQUMsU0FBM0MsRUFBc0QsRUFBRSxHQUFHLFdBQVcsQ0FBQyxNQUF2RSxFQUErRSxFQUFFLEVBQWpGLEVBQXFGO0FBQ2pGLFFBQUksT0FBTyxHQUFHLFdBQVcsQ0FBQyxFQUFELENBQXpCO0FBQ0EsSUFBQSxNQUFNLEdBQUcsSUFBSSxTQUFTLENBQUMsT0FBZCxDQUFzQixPQUF0QixDQUFUO0FBQ0EsSUFBQSxNQUFNLENBQUMsUUFBUCxDQUFnQixTQUFTLENBQUMsa0JBQTFCO0FBQ0g7QUFDSixDQVBEOzs7QUNWQTtBQUNBOztBQ0RBOzs7O0FBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRSxFQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxvQkFBRCxDQUF2Qjs7QUFDQSxTQUFTLENBQUMsSUFBVixDQUFlLGdCQUFmLENBQWdDLFlBQWhDLEVBQThDLFlBQVksQ0FDekQsQ0FERCxFQUNHO0FBQ0MsRUFBQSxPQUFPLEVBQUUsSUFEVjtBQUVDLEVBQUEsT0FBTyxFQUFFO0FBRlYsQ0FESDs7O0FDSEE7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFELENBQW5COztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxvQkFBRCxDQUF2Qjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsNEJBQUQsQ0FBdEI7O0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGdCQUFELENBQXRCOztBQUNBLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVixHQUFpQixJQUFqQixDQUFzQixVQUFVLFFBQVYsRUFBb0I7QUFDdEMsTUFBSSxJQUFKOztBQUNBLE9BQUssSUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBbkMsRUFBMkMsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUF2RCxFQUErRCxFQUFFLEVBQWpFLEVBQXFFO0FBQ2pFLFFBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxFQUFELENBQWpCO0FBQ0EsSUFBQSxJQUFJLEdBQUcsSUFBSSxRQUFRLENBQUMsTUFBYixDQUFvQixJQUFwQixDQUFQO0FBQ0EsSUFBQSxJQUFJLENBQUMsUUFBTCxDQUFjLFNBQVMsQ0FBQyxVQUF4QjtBQUNIO0FBQ0osQ0FQRDs7O0FDTkE7Ozs7Ozs7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFELENBQW5COztBQUNBLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVixHQUFpQixJQUFqQixDQUFzQixVQUFVLFFBQVYsRUFBb0I7QUFDdEMsRUFBQSxLQUFLLENBQUMsR0FBTixDQUFVLGVBQVYsQ0FBMEIsbUNBQTFCLEVBQStELFNBQS9ELEdBQTJFLElBQUksSUFBSixHQUFXLFdBQVgsR0FBeUIsUUFBekIsRUFBM0U7QUFDSCxDQUZEOzs7QUNIQTs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQUQsQ0FBbkI7O0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQXZCOztBQUNBLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQywrQkFBRCxDQUF6Qjs7QUFDQSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsbUJBQUQsQ0FBekI7O0FBQ0EsS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFWLEdBQWlCLElBQWpCLENBQXNCLFVBQVUsUUFBVixFQUFvQjtBQUN0QyxNQUFJLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxRQUFWLENBQW1CLEdBQW5CLENBQXVCLFdBQXZCLEVBQW9DLE9BQTNEO0FBQ0EsTUFBSSxJQUFKOztBQUNBLE9BQUssSUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZLE1BQU0sR0FBRyxXQUFXLENBQUMsU0FBdEMsRUFBaUQsRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUE3RCxFQUFxRSxFQUFFLEVBQXZFLEVBQTJFO0FBQ3ZFLFFBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxFQUFELENBQWpCO0FBQ0EsSUFBQSxJQUFJLEdBQUcsSUFBSSxXQUFXLENBQUMsU0FBaEIsQ0FBMEIsSUFBMUIsQ0FBUDtBQUNBLElBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxnQkFBZDtBQUNIO0FBQ0osQ0FSRDs7O0FDTkE7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFELENBQW5COztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxvQkFBRCxDQUF2Qjs7QUFDQSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsZ0NBQUQsQ0FBMUI7O0FBQ0EsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQTFCOztBQUNBLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVixHQUFpQixJQUFqQixDQUFzQixVQUFVLFFBQVYsRUFBb0I7QUFDdEMsTUFBSSxpQkFBaUIsR0FBRyxTQUFTLENBQUMsUUFBVixDQUFtQixHQUFuQixDQUF1QixZQUF2QixFQUFxQyxPQUE3RDtBQUNBLE1BQUksSUFBSjs7QUFDQSxPQUFLLElBQUksRUFBRSxHQUFHLENBQVQsRUFBWSxNQUFNLEdBQUcsWUFBWSxDQUFDLFVBQXZDLEVBQW1ELEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBL0QsRUFBdUUsRUFBRSxFQUF6RSxFQUE2RTtBQUN6RSxRQUFJLElBQUksR0FBRyxNQUFNLENBQUMsRUFBRCxDQUFqQjtBQUNBLElBQUEsSUFBSSxHQUFHLElBQUksWUFBWSxDQUFDLFVBQWpCLENBQTRCLElBQTVCLENBQVA7QUFDQSxJQUFBLElBQUksQ0FBQyxRQUFMLENBQWMsaUJBQWQ7QUFDSDtBQUNKLENBUkQ7OztBQ05BOzs7O0FBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRSxFQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxvQkFBRCxDQUF2Qjs7QUFDQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsZ0JBQUQsQ0FBbkI7O0FBQ0EsS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFWLEdBQWlCLElBQWpCLENBQXNCLFVBQVUsUUFBVixFQUFvQjtBQUN0QyxNQUFJLENBQUMsS0FBSyxDQUFDLEdBQU4sQ0FBVSxJQUFWLEVBQUwsRUFBdUI7QUFDbkIsSUFBQSxTQUFTLENBQUMsSUFBVixDQUFlLEtBQWYsQ0FBcUIsU0FBckIsQ0FBK0IsTUFBL0IsQ0FBc0MsU0FBdEM7QUFDQSxJQUFBLFVBQVUsQ0FBQyxZQUFZO0FBQ25CLE1BQUEsU0FBUyxDQUFDLElBQVYsQ0FBZSxLQUFmLENBQXFCLFNBQXJCLENBQStCLE1BQS9CLENBQXNDLFNBQXRDO0FBQ0gsS0FGUyxFQUVQLEdBRk8sQ0FBVjtBQUdILEdBTEQsTUFNSztBQUNELElBQUEsU0FBUyxDQUFDLElBQVYsQ0FBZSxLQUFmLENBQXFCLFNBQXJCLEdBQWlDLE9BQWpDO0FBQ0EsSUFBQSxVQUFVLENBQUMsWUFBWTtBQUNuQixNQUFBLFNBQVMsQ0FBQyxJQUFWLENBQWUsS0FBZixDQUFxQixTQUFyQixHQUFpQyxPQUFqQztBQUNILEtBRlMsRUFFUCxHQUZPLENBQVY7QUFHSDtBQUNKLENBYkQ7OztBQ0pBOzs7Ozs7Ozs7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLG9CQUFELENBQXZCOztBQUNBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLFNBQXJCLENBQStCLFNBQVMsQ0FBQyxJQUF6QyxFQUErQyxVQUFVLEtBQVYsRUFBaUI7QUFDNUQsTUFBSSxLQUFLLENBQUMsSUFBTixLQUFlLFFBQW5CLEVBQTZCO0FBQ3pCLFFBQUksS0FBSyxDQUFDLE1BQU4sQ0FBYSxJQUFqQixFQUF1QjtBQUNuQixNQUFBLFNBQVMsQ0FBQyxJQUFWLENBQWUsWUFBZixDQUE0QixTQUE1QixFQUF1QyxFQUF2QztBQUNILEtBRkQsTUFHSztBQUNELE1BQUEsU0FBUyxDQUFDLElBQVYsQ0FBZSxlQUFmLENBQStCLFNBQS9CO0FBQ0g7QUFDSjtBQUNKLENBVEQ7QUFVQSxTQUFTLENBQUMsVUFBVixDQUFxQixnQkFBckIsQ0FBc0MsUUFBdEMsRUFBZ0QsVUFBVSxLQUFWLEVBQWlCO0FBQzdELE1BQUksRUFBSjs7QUFDQSxNQUFJLE9BQUo7QUFDQSxNQUFJLE1BQUo7QUFDQSxNQUFJLElBQUksR0FBRyxTQUFTLENBQUMsYUFBVixDQUF3QixNQUF4QixFQUFYO0FBQ0EsTUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUwsRUFBZDs7QUFDQSxPQUFLLElBQUksSUFBSSxHQUFHLEtBQWhCLEVBQXVCLENBQUMsSUFBeEIsRUFBOEIsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFMLEVBQVYsRUFBdUIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFwRSxFQUEwRTtBQUN0RSxJQUFBLEVBQUUsR0FBRyxPQUFPLENBQUMsS0FBYixFQUFvQixPQUFPLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBaEMsRUFBcUMsTUFBTSxHQUFHLEVBQUUsQ0FBQyxDQUFELENBQWhEOztBQUNBLFFBQUksT0FBTyxDQUFDLE1BQVIsRUFBSixFQUFzQjtBQUNsQixNQUFBLE1BQU0sQ0FBQyxZQUFQLENBQW9CLFVBQXBCLEVBQWdDLEVBQWhDO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsTUFBQSxNQUFNLENBQUMsZUFBUCxDQUF1QixVQUF2QjtBQUNIO0FBQ0o7QUFDSixDQWZELEVBZUc7QUFDQyxFQUFBLE9BQU8sRUFBRSxJQURWO0FBRUMsRUFBQSxPQUFPLEVBQUU7QUFGVixDQWZIOzs7QUNiQTs7Ozs7Ozs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsb0JBQUQsQ0FBdkI7O0FBQ0EsUUFBUSxDQUFDLGdCQUFULENBQTBCLFFBQTFCLEVBQW9DLFVBQVUsS0FBVixFQUFpQjtBQUNqRCxFQUFBLFNBQVMsQ0FBQyxVQUFWLENBQXFCLGNBQXJCO0FBQ0gsQ0FGRCxFQUVHO0FBQ0MsRUFBQSxPQUFPLEVBQUUsSUFEVjtBQUVDLEVBQUEsT0FBTyxFQUFFO0FBRlYsQ0FGSDtBQU1BLFNBQVMsQ0FBQyxVQUFWLENBQXFCLFNBQXJCLENBQStCLGdCQUEvQixDQUFnRCxPQUFoRCxFQUF5RCxZQUFZO0FBQ2pFLEVBQUEsU0FBUyxDQUFDLFVBQVYsQ0FBcUIsTUFBckI7QUFDSCxDQUZEO0FBR0EsSUFBSSxJQUFJLEdBQUcsU0FBUyxDQUFDLGFBQVYsQ0FBd0IsTUFBeEIsRUFBWDtBQUNBLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFMLEVBQWQ7O0FBQ0EsSUFBSSxPQUFPLEdBQUcsU0FBVixPQUFVLENBQVUsSUFBVixFQUFnQjtBQUMxQixNQUFJLEVBQUo7O0FBQ0EsTUFBSSxPQUFKO0FBQ0EsTUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFsQjtBQUNBLEVBQUEsRUFBRSxHQUFHLE9BQU8sQ0FBQyxLQUFiLEVBQW9CLE9BQU8sR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUFoQyxFQUFxQyxNQUFNLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBaEQ7QUFDQSxFQUFBLE1BQU0sQ0FBQyxnQkFBUCxDQUF3QixPQUF4QixFQUFpQyxVQUFVLEtBQVYsRUFBaUI7QUFDOUMsSUFBQSxLQUFLLENBQUMsY0FBTjtBQUNBLElBQUEsT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsY0FBaEIsQ0FBK0I7QUFDM0IsTUFBQSxRQUFRLEVBQUU7QUFEaUIsS0FBL0I7QUFHSCxHQUxEO0FBTUgsQ0FYRDs7QUFZQSxLQUFLLElBQUksSUFBSSxHQUFHLEtBQWhCLEVBQXVCLENBQUMsSUFBeEIsRUFBOEIsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFMLEVBQVYsRUFBdUIsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFwRSxFQUEwRTtBQUN0RSxFQUFBLE9BQU8sQ0FBQyxJQUFELENBQVA7QUFDSDs7O0FDNUJEOzs7O0FBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRSxFQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxnQkFBRCxDQUFuQjs7QUFDQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsb0JBQUQsQ0FBdkI7O0FBQ0EsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLDZCQUFELENBQXZCOztBQUNBLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxrQkFBRCxDQUF4Qjs7QUFDQSxLQUFLLENBQUMsR0FBTixDQUFVLElBQVYsR0FBaUIsSUFBakIsQ0FBc0IsWUFBWTtBQUM5QixNQUFJLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxRQUFWLENBQW1CLEdBQW5CLENBQXVCLFVBQXZCLEVBQW1DLE9BQW5DLENBQTJDLGFBQTNDLENBQXlELHFCQUF6RCxDQUF4QjtBQUNBLE1BQUksSUFBSjs7QUFDQSxPQUFLLElBQUksRUFBRSxHQUFHLENBQVQsRUFBWSxNQUFNLEdBQUcsVUFBVSxDQUFDLFFBQXJDLEVBQStDLEVBQUUsR0FBRyxNQUFNLENBQUMsTUFBM0QsRUFBbUUsRUFBRSxFQUFyRSxFQUF5RTtBQUNyRSxRQUFJLElBQUksR0FBRyxNQUFNLENBQUMsRUFBRCxDQUFqQjtBQUNBLElBQUEsSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLE9BQWQsQ0FBc0IsSUFBdEIsQ0FBUDtBQUNBLElBQUEsSUFBSSxDQUFDLFFBQUwsQ0FBYyxpQkFBZDtBQUNIO0FBQ0osQ0FSRDs7Ozs7QUNOQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRSxFQUFBLEtBQUssRUFBRTtBQUFULENBQTdDO0FBQ0EsT0FBTyxDQUFDLEdBQVIsR0FBYyxLQUFLLENBQW5CO0FBQ0EsSUFBSSxHQUFKOztBQUNBLENBQUMsVUFBVSxHQUFWLEVBQWU7QUFDWixXQUFTLFdBQVQsQ0FBcUIsS0FBckIsRUFBNEI7QUFDeEIsV0FBTyxRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsS0FBMUIsQ0FBUDtBQUNIOztBQUNELEVBQUEsR0FBRyxDQUFDLFdBQUosR0FBa0IsV0FBbEI7O0FBQ0EsV0FBUyxlQUFULENBQXlCLEtBQXpCLEVBQWdDO0FBQzVCLFdBQU8sS0FBSyxXQUFMLENBQWlCLEtBQWpCLEVBQXdCLENBQXhCLENBQVA7QUFDSDs7QUFDRCxFQUFBLEdBQUcsQ0FBQyxlQUFKLEdBQXNCLGVBQXRCOztBQUNBLFdBQVMsV0FBVCxHQUF1QjtBQUNuQixXQUFPO0FBQ0gsTUFBQSxNQUFNLEVBQUUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxNQUFNLENBQUMsV0FBaEIsRUFBNkIsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsWUFBdEQsQ0FETDtBQUVILE1BQUEsS0FBSyxFQUFFLElBQUksQ0FBQyxHQUFMLENBQVMsTUFBTSxDQUFDLFVBQWhCLEVBQTRCLFFBQVEsQ0FBQyxlQUFULENBQXlCLFdBQXJEO0FBRkosS0FBUDtBQUlIOztBQUNELEVBQUEsR0FBRyxDQUFDLFdBQUosR0FBa0IsV0FBbEI7O0FBQ0EsV0FBUyxtQkFBVCxHQUErQjtBQUMzQixRQUFJLEVBQUUsR0FBRyxXQUFXLEVBQXBCO0FBQUEsUUFBd0IsTUFBTSxHQUFHLEVBQUUsQ0FBQyxNQUFwQztBQUFBLFFBQTRDLEtBQUssR0FBRyxFQUFFLENBQUMsS0FBdkQ7O0FBQ0EsV0FBTztBQUNILE1BQUEsQ0FBQyxFQUFFLEtBQUssR0FBRyxDQURSO0FBRUgsTUFBQSxDQUFDLEVBQUUsTUFBTSxHQUFHO0FBRlQsS0FBUDtBQUlIOztBQUNELEVBQUEsR0FBRyxDQUFDLG1CQUFKLEdBQTBCLG1CQUExQjs7QUFDQSxXQUFTLElBQVQsR0FBZ0I7QUFDWixXQUFPLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQWpCLENBQTJCLEtBQTNCLENBQWlDLGdCQUFqQyxNQUF1RCxJQUE5RDtBQUNIOztBQUNELEVBQUEsR0FBRyxDQUFDLElBQUosR0FBVyxJQUFYOztBQUNBLFdBQVMsSUFBVCxHQUFnQjtBQUNaLFdBQU8sSUFBSSxPQUFKLENBQVksVUFBVSxPQUFWLEVBQW1CLE1BQW5CLEVBQTJCO0FBQzFDLFVBQUksUUFBUSxDQUFDLFVBQVQsS0FBd0IsVUFBNUIsRUFBd0M7QUFDcEMsUUFBQSxPQUFPLENBQUMsUUFBRCxDQUFQO0FBQ0gsT0FGRCxNQUdLO0FBQ0QsWUFBSSxVQUFVLEdBQUcsU0FBYixVQUFhLEdBQVk7QUFDekIsVUFBQSxRQUFRLENBQUMsbUJBQVQsQ0FBNkIsa0JBQTdCLEVBQWlELFVBQWpEO0FBQ0EsVUFBQSxPQUFPLENBQUMsUUFBRCxDQUFQO0FBQ0gsU0FIRDs7QUFJQSxRQUFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsVUFBOUM7QUFDSDtBQUNKLEtBWE0sQ0FBUDtBQVlIOztBQUNELEVBQUEsR0FBRyxDQUFDLElBQUosR0FBVyxJQUFYOztBQUNBLFdBQVMsMEJBQVQsQ0FBb0MsSUFBcEMsRUFBMEM7QUFDdEMsV0FBTztBQUNILE1BQUEsR0FBRyxFQUFFLElBQUksQ0FBQyxHQURQO0FBRUgsTUFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBRlQ7QUFHSCxNQUFBLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFIVjtBQUlILE1BQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUpSO0FBS0gsTUFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBTFQ7QUFNSCxNQUFBLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFOVjtBQU9ILE1BQUEsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFMLEdBQVMsSUFBSSxDQUFDLENBQWQsR0FBa0IsQ0FQbEI7QUFRSCxNQUFBLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBTCxHQUFTLElBQUksQ0FBQyxDQUFkLEdBQWtCO0FBUmxCLEtBQVA7QUFVSDs7QUFDRCxXQUFTLE1BQVQsQ0FBZ0IsT0FBaEIsRUFBeUI7QUFDckIsUUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLHFCQUFSLEVBQVg7QUFDQSxXQUFPLENBQUMsTUFBTSxDQUFDLE1BQVAsQ0FBYywwQkFBMEIsQ0FBQyxJQUFELENBQXhDLEVBQWdELEtBQWhELENBQXNELFVBQVUsR0FBVixFQUFlO0FBQUUsYUFBTyxHQUFHLEtBQUssQ0FBZjtBQUFtQixLQUExRixDQUFSO0FBQ0g7O0FBQ0QsRUFBQSxHQUFHLENBQUMsTUFBSixHQUFhLE1BQWI7O0FBQ0EsV0FBUyxVQUFULENBQW9CLE9BQXBCLEVBQTZCO0FBQ3pCLFFBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxPQUFSLENBQWdCLFdBQWhCLEVBQVY7O0FBQ0EsUUFBSSxPQUFPLENBQUMsRUFBWixFQUFnQjtBQUNaLE1BQUEsR0FBRyxJQUFJLE1BQU0sT0FBTyxDQUFDLEVBQXJCO0FBQ0g7O0FBQ0QsUUFBSSxPQUFPLENBQUMsU0FBWixFQUF1QjtBQUNuQixNQUFBLEdBQUcsSUFBSSxNQUFNLE9BQU8sQ0FBQyxTQUFSLENBQWtCLE9BQWxCLENBQTBCLElBQTFCLEVBQWdDLEdBQWhDLENBQWI7QUFDSDs7QUFDRCxXQUFPLEdBQVA7QUFDSDs7QUFDRCxFQUFBLEdBQUcsQ0FBQyxVQUFKLEdBQWlCLFVBQWpCOztBQUNBLFdBQVMsVUFBVCxDQUFvQixPQUFwQixFQUE2QjtBQUN6QixRQUFJLENBQUMsT0FBTCxFQUFjO0FBQ1YsYUFBTyxFQUFQO0FBQ0g7O0FBQ0QsUUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFELENBQVg7O0FBQ0EsV0FBTyxPQUFPLEdBQUcsT0FBTyxDQUFDLGFBQXpCLEVBQXdDO0FBQ3BDLFVBQUksT0FBTyxDQUFDLE9BQVIsQ0FBZ0IsV0FBaEIsT0FBa0MsTUFBdEMsRUFBOEM7QUFDMUM7QUFDSDs7QUFDRCxNQUFBLElBQUksQ0FBQyxPQUFMLENBQWEsT0FBYjtBQUNIOztBQUNELFdBQU8sSUFBUDtBQUNIOztBQUNELEVBQUEsR0FBRyxDQUFDLFVBQUosR0FBaUIsVUFBakI7O0FBQ0EsV0FBUyxlQUFULENBQXlCLE9BQXpCLEVBQWtDO0FBQzlCLFFBQUksSUFBSSxHQUFHLFVBQVUsQ0FBQyxPQUFELENBQXJCOztBQUNBLFFBQUksSUFBSSxDQUFDLE1BQUwsS0FBZ0IsQ0FBcEIsRUFBdUI7QUFDbkIsYUFBTyxFQUFQO0FBQ0g7O0FBQ0QsV0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLFVBQVUsT0FBVixFQUFtQjtBQUFFLGFBQU8sVUFBVSxDQUFDLE9BQUQsQ0FBakI7QUFBNkIsS0FBM0QsQ0FBUDtBQUNIOztBQUNELEVBQUEsR0FBRyxDQUFDLGVBQUosR0FBc0IsZUFBdEI7O0FBQ0EsV0FBUyxjQUFULENBQXdCLE9BQXhCLEVBQWlDLFFBQWpDLEVBQTJDO0FBQ3ZDLFFBQUksUUFBUSxLQUFLLEtBQUssQ0FBdEIsRUFBeUI7QUFBRSxNQUFBLFFBQVEsR0FBRyxJQUFYO0FBQWtCOztBQUM3QyxRQUFJLEtBQUssR0FBRyxlQUFlLENBQUMsT0FBRCxDQUEzQjs7QUFDQSxRQUFJLENBQUMsUUFBRCxJQUFhLEtBQUssQ0FBQyxNQUFOLElBQWdCLENBQWpDLEVBQW9DO0FBQ2hDLGFBQU8sS0FBSyxDQUFDLElBQU4sQ0FBVyxLQUFYLENBQVA7QUFDSDs7QUFDRCxRQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBbkI7QUFDQSxRQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBTixDQUFZLENBQVosRUFBZSxDQUFmLENBQVo7QUFDQSxRQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsS0FBTixDQUFZLE1BQU0sR0FBRyxDQUFyQixFQUF3QixNQUF4QixDQUFWO0FBQ0EsV0FBTyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQVgsSUFBb0IsV0FBcEIsR0FBa0MsR0FBRyxDQUFDLElBQUosQ0FBUyxLQUFULENBQXpDO0FBQ0g7O0FBQ0QsRUFBQSxHQUFHLENBQUMsY0FBSixHQUFxQixjQUFyQjs7QUFDQSxXQUFTLDZCQUFULENBQXVDLFNBQXZDLEVBQWtELEtBQWxELEVBQXlELE1BQXpELEVBQWlFO0FBQzdELFFBQUksTUFBTSxLQUFLLEtBQUssQ0FBcEIsRUFBdUI7QUFBRSxNQUFBLE1BQU0sR0FBRyxFQUFUO0FBQWM7O0FBQ3ZDLFFBQUksU0FBUyxHQUFHLENBQWhCO0FBQ0EsUUFBSSxVQUFVLEdBQUcsQ0FBakI7QUFDQSxRQUFJLElBQUksR0FBRyxLQUFYOztBQUNBLFdBQU8sSUFBSSxJQUFJLElBQUksS0FBSyxTQUF4QixFQUFtQztBQUMvQixNQUFBLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBbEI7QUFDQSxNQUFBLFVBQVUsSUFBSSxJQUFJLENBQUMsVUFBbkI7QUFDQSxNQUFBLElBQUksR0FBSSxJQUFJLENBQUMsWUFBYjtBQUNIOztBQUNELFFBQUksQ0FBQyxJQUFMLEVBQVc7QUFDUCxZQUFNLElBQUksS0FBSixDQUFVLENBQUMsTUFBTSxHQUFHLE1BQU0sR0FBRyxNQUFaLEdBQXFCLEVBQTVCLElBQWtDLElBQWxDLEdBQXlDLGNBQWMsQ0FBQyxLQUFELENBQXZELEdBQWlFLHdCQUFqRSxHQUE0RixjQUFjLENBQUMsU0FBRCxDQUExRyxHQUF3SCxnSEFBbEksQ0FBTjtBQUNIOztBQUNELFdBQU87QUFBRSxNQUFBLFNBQVMsRUFBRSxTQUFiO0FBQXdCLE1BQUEsVUFBVSxFQUFFO0FBQXBDLEtBQVA7QUFDSDs7QUFDRCxFQUFBLEdBQUcsQ0FBQyw2QkFBSixHQUFvQyw2QkFBcEM7O0FBQ0EsV0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixLQUFyQixFQUE0QixJQUE1QixFQUFrQyxLQUFsQyxFQUF5QyxNQUF6QyxFQUFpRDtBQUM3QyxXQUFPLENBQ0gsSUFBSSxHQUFHLE1BREosRUFFSCxJQUFJLEdBQUcsTUFBUCxHQUFnQixLQUZiLEVBR0gsSUFIRyxFQUlILElBQUksR0FBRyxLQUpKLENBQVA7QUFNSDs7QUFDRCxXQUFTLFFBQVQsQ0FBa0IsT0FBbEIsRUFBMkIsT0FBM0IsRUFBb0MsS0FBcEMsRUFBMkMsTUFBM0MsRUFBbUQ7QUFDL0MsUUFBSSxPQUFPLElBQUksT0FBTyxJQUFJLENBQTFCLEVBQTZCO0FBQ3pCLE1BQUEsT0FBTyxHQUFHLEtBQUssR0FBRyxPQUFsQjtBQUNILEtBRkQsTUFHSztBQUNELE1BQUEsT0FBTyxHQUFHLENBQVY7QUFDSDs7QUFDRCxRQUFJLE9BQU8sSUFBSSxPQUFPLElBQUksQ0FBMUIsRUFBNkI7QUFDekIsTUFBQSxPQUFPLEdBQUcsTUFBTSxHQUFHLE9BQW5CO0FBQ0gsS0FGRCxNQUdLO0FBQ0QsTUFBQSxPQUFPLEdBQUcsQ0FBVjtBQUNIOztBQUNELFdBQU87QUFBRSxNQUFBLE9BQU8sRUFBRSxPQUFYO0FBQW9CLE1BQUEsT0FBTyxFQUFFO0FBQTdCLEtBQVA7QUFDSDs7QUFDRCxXQUFTLFlBQVQsQ0FBc0IsS0FBdEIsRUFBNkIsUUFBN0IsRUFBdUM7QUFDbkMsUUFBSSxRQUFRLEtBQUssS0FBSyxDQUF0QixFQUF5QjtBQUFFLE1BQUEsUUFBUSxHQUFHLEVBQVg7QUFBZ0I7O0FBQzNDLFFBQUksU0FBSjtBQUNBLFFBQUksU0FBSjtBQUNBLFFBQUksVUFBSjs7QUFDQSxRQUFJLENBQUMsUUFBUSxDQUFDLFNBQWQsRUFBeUI7QUFDckIsTUFBQSxTQUFTLEdBQUcsS0FBSyxDQUFDLFlBQWxCOztBQUNBLFVBQUksQ0FBQyxTQUFMLEVBQWdCO0FBQ1osY0FBTSxJQUFJLEtBQUosQ0FBVSwrSEFBVixDQUFOO0FBQ0g7O0FBQ0QsTUFBQSxTQUFTLEdBQUcsS0FBSyxDQUFDLFNBQWxCO0FBQ0EsTUFBQSxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQW5CO0FBQ0gsS0FQRCxNQVFLO0FBQ0QsVUFBSSxNQUFNLEdBQUcsNkJBQTZCLENBQUMsUUFBUSxDQUFDLFNBQVYsRUFBcUIsS0FBckIsRUFBNEIsMEJBQTVCLENBQTFDO0FBQ0EsTUFBQSxTQUFTLEdBQUcsTUFBTSxDQUFDLFNBQW5CO0FBQ0EsTUFBQSxVQUFVLEdBQUcsTUFBTSxDQUFDLFVBQXBCO0FBQ0g7O0FBQ0QsUUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLHFCQUFOLEVBQWhCOztBQUNBLFFBQUksTUFBTSxDQUFDLE1BQVAsQ0FBYywwQkFBMEIsQ0FBQyxTQUFELENBQXhDLEVBQXFELEtBQXJELENBQTJELFVBQVUsR0FBVixFQUFlO0FBQUUsYUFBTyxHQUFHLEtBQUssQ0FBZjtBQUFtQixLQUEvRixDQUFKLEVBQXNHO0FBQ2xHLGFBQU8sS0FBUDtBQUNIOztBQUNELFFBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxxQkFBVixFQUFwQjs7QUFDQSxRQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQVYsRUFBbUIsUUFBUSxDQUFDLE9BQTVCLEVBQXFDLGFBQWEsQ0FBQyxLQUFuRCxFQUEwRCxhQUFhLENBQUMsTUFBeEUsQ0FBakI7QUFBQSxRQUFrRyxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQS9HO0FBQUEsUUFBd0gsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFySTs7QUFDQSxRQUFJLENBQUMsR0FBRyxJQUFSO0FBQ0EsUUFBSSxDQUFDLEdBQUcsSUFBUjs7QUFDQSxRQUFJLENBQUMsUUFBUSxDQUFDLE9BQWQsRUFBdUI7QUFDbkIsVUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxTQUFYLEVBQXNCLGFBQWEsQ0FBQyxNQUFwQyxFQUE0QyxTQUE1QyxFQUF1RCxTQUFTLENBQUMsTUFBakUsRUFBeUUsT0FBekUsQ0FBZDtBQUFBLFVBQWlHLGdCQUFnQixHQUFHLEVBQUUsQ0FBQyxDQUFELENBQXRIO0FBQUEsVUFBMkgsbUJBQW1CLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBbko7QUFBQSxVQUF3SixZQUFZLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBeks7QUFBQSxVQUE4SyxlQUFlLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBbE07O0FBQ0EsTUFBQSxDQUFDLEdBQUcsUUFBUSxDQUFDLEtBQVQsR0FDQSxlQUFlLEdBQUcsbUJBQWxCLElBQ08sWUFBWSxHQUFHLGdCQUZ0QixHQUdFLGVBQWUsR0FBRyxnQkFBbEIsSUFDSyxZQUFZLEdBQUcsbUJBSjFCO0FBS0g7O0FBQ0QsUUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFkLEVBQXVCO0FBQ25CLFVBQUksRUFBRSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsVUFBWCxFQUF1QixhQUFhLENBQUMsS0FBckMsRUFBNEMsVUFBNUMsRUFBd0QsU0FBUyxDQUFDLEtBQWxFLEVBQXlFLE9BQXpFLENBQWQ7QUFBQSxVQUFpRyxpQkFBaUIsR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUF2SDtBQUFBLFVBQTRILGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxDQUFELENBQW5KO0FBQUEsVUFBd0osYUFBYSxHQUFHLEVBQUUsQ0FBQyxDQUFELENBQTFLO0FBQUEsVUFBK0ssY0FBYyxHQUFHLEVBQUUsQ0FBQyxDQUFELENBQWxNOztBQUNBLE1BQUEsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxLQUFULEdBQ0EsY0FBYyxHQUFHLGtCQUFqQixJQUNPLGFBQWEsR0FBRyxpQkFGdkIsR0FHRSxjQUFjLEdBQUcsaUJBQWpCLElBQ0ssYUFBYSxHQUFHLGtCQUozQjtBQUtIOztBQUNELFdBQU8sQ0FBQyxJQUFJLENBQVo7QUFDSDs7QUFDRCxFQUFBLEdBQUcsQ0FBQyxZQUFKLEdBQW1CLFlBQW5COztBQUNBLFdBQVMsUUFBVCxDQUFrQixTQUFsQixFQUE2QixJQUE3QixFQUFtQyxHQUFuQyxFQUF3QyxRQUF4QyxFQUFrRDtBQUM5QyxRQUFJLFFBQVEsS0FBSyxLQUFLLENBQXRCLEVBQXlCO0FBQUUsTUFBQSxRQUFRLEdBQUcsRUFBWDtBQUFnQjs7QUFDM0MsUUFBSSxJQUFJLEVBQVIsRUFBWTtBQUNSLE1BQUEsU0FBUyxDQUFDLFVBQVYsR0FBdUIsSUFBdkI7QUFDQSxNQUFBLFNBQVMsQ0FBQyxTQUFWLEdBQXNCLEdBQXRCO0FBQ0gsS0FIRCxNQUlLO0FBQ0QsTUFBQSxTQUFTLENBQUMsUUFBVixDQUFtQjtBQUNmLFFBQUEsSUFBSSxFQUFFLElBRFM7QUFFZixRQUFBLEdBQUcsRUFBRSxHQUZVO0FBR2YsUUFBQSxRQUFRLEVBQUUsUUFBUSxDQUFDLE1BQVQsR0FBa0IsUUFBbEIsR0FBNkI7QUFIeEIsT0FBbkI7QUFLSDtBQUNKOztBQUNELFdBQVMsK0JBQVQsQ0FBeUMsU0FBekMsRUFBb0QsS0FBcEQsRUFBMkQsUUFBM0QsRUFBcUU7QUFDakUsUUFBSSxRQUFRLEtBQUssS0FBSyxDQUF0QixFQUF5QjtBQUFFLE1BQUEsUUFBUSxHQUFHLEVBQVg7QUFBZ0I7O0FBQzNDLFFBQUksTUFBTSxHQUFHLDZCQUE2QixDQUFDLFNBQUQsRUFBWSxLQUFaLEVBQW1CLHNDQUFuQixDQUExQztBQUNBLFFBQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxTQUF2QjtBQUNBLFFBQUksVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUF4QjtBQUNBLFFBQUksYUFBYSxHQUFHLFNBQVMsQ0FBQyxxQkFBVixFQUFwQjtBQUNBLFFBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxxQkFBTixFQUFoQjs7QUFDQSxRQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQVYsRUFBbUIsUUFBUSxDQUFDLE9BQTVCLEVBQXFDLGFBQWEsQ0FBQyxLQUFuRCxFQUEwRCxhQUFhLENBQUMsTUFBeEUsQ0FBakI7QUFBQSxRQUFrRyxPQUFPLEdBQUcsRUFBRSxDQUFDLE9BQS9HO0FBQUEsUUFBd0gsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFySTs7QUFDQSxRQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFNBQVgsRUFBc0IsYUFBYSxDQUFDLE1BQXBDLEVBQTRDLFNBQTVDLEVBQXVELFNBQVMsQ0FBQyxNQUFqRSxFQUF5RSxPQUF6RSxDQUFkO0FBQUEsUUFBaUcsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBdEg7QUFBQSxRQUEySCxtQkFBbUIsR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUFuSjtBQUFBLFFBQXdKLFlBQVksR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUF6SztBQUFBLFFBQThLLGVBQWUsR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUFsTTs7QUFDQSxRQUFJLEVBQUUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLFVBQVgsRUFBdUIsYUFBYSxDQUFDLEtBQXJDLEVBQTRDLFVBQTVDLEVBQXdELFNBQVMsQ0FBQyxLQUFsRSxFQUF5RSxPQUF6RSxDQUFkO0FBQUEsUUFBaUcsaUJBQWlCLEdBQUcsRUFBRSxDQUFDLENBQUQsQ0FBdkg7QUFBQSxRQUE0SCxrQkFBa0IsR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUFuSjtBQUFBLFFBQXdKLGFBQWEsR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUExSztBQUFBLFFBQStLLGNBQWMsR0FBRyxFQUFFLENBQUMsQ0FBRCxDQUFsTTs7QUFDQSxRQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsVUFBbEI7QUFDQSxRQUFJLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBbEI7O0FBQ0EsUUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFkLEVBQXVCO0FBQ25CLFVBQUksS0FBSyxHQUFHLFlBQVksR0FBRyxnQkFBM0I7QUFDQSxVQUFJLEtBQUssR0FBRyxlQUFlLEdBQUcsbUJBQTlCOztBQUNBLFVBQUksS0FBSyxJQUFJLENBQUMsS0FBZCxFQUFxQjtBQUNqQixRQUFBLENBQUMsR0FBRyxZQUFKO0FBQ0gsT0FGRCxNQUdLLElBQUksQ0FBQyxLQUFELElBQVUsS0FBZCxFQUFxQjtBQUN0QixRQUFBLENBQUMsSUFBSSxlQUFlLEdBQUcsbUJBQXZCO0FBQ0g7QUFDSjs7QUFDRCxRQUFJLENBQUMsUUFBUSxDQUFDLE9BQWQsRUFBdUI7QUFDbkIsVUFBSSxJQUFJLEdBQUcsYUFBYSxHQUFHLGlCQUEzQjtBQUNBLFVBQUksS0FBSyxHQUFHLGNBQWMsR0FBRyxrQkFBN0I7O0FBQ0EsVUFBSSxJQUFJLElBQUksQ0FBQyxLQUFiLEVBQW9CO0FBQ2hCLFFBQUEsQ0FBQyxHQUFHLGFBQUo7QUFDSCxPQUZELE1BR0ssSUFBSSxDQUFDLElBQUQsSUFBUyxLQUFiLEVBQW9CO0FBQ3JCLFFBQUEsQ0FBQyxJQUFJLGNBQWMsR0FBRyxrQkFBdEI7QUFDSDtBQUNKOztBQUNELElBQUEsUUFBUSxDQUFDLFNBQUQsRUFBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQixRQUFsQixDQUFSO0FBQ0g7O0FBQ0QsRUFBQSxHQUFHLENBQUMsK0JBQUosR0FBc0MsK0JBQXRDOztBQUNBLFdBQVMsb0JBQVQsQ0FBOEIsT0FBOUIsRUFBdUMsTUFBdkMsRUFBK0M7QUFDM0MsUUFBSSxNQUFNLEtBQUssS0FBSyxDQUFwQixFQUF1QjtBQUFFLE1BQUEsTUFBTSxHQUFHLENBQVQ7QUFBYTs7QUFDdEMsUUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLHFCQUFSLEVBQVg7O0FBQ0EsUUFBSSxNQUFNLENBQUMsTUFBUCxDQUFjLDBCQUEwQixDQUFDLElBQUQsQ0FBeEMsRUFBZ0QsS0FBaEQsQ0FBc0QsVUFBVSxHQUFWLEVBQWU7QUFBRSxhQUFPLEdBQUcsS0FBSyxDQUFmO0FBQW1CLEtBQTFGLENBQUosRUFBaUc7QUFDN0YsYUFBTyxLQUFQO0FBQ0g7O0FBQ0QsUUFBSSxVQUFVLEdBQUcsV0FBVyxHQUFHLE1BQS9COztBQUNBLFFBQUksTUFBTSxJQUFJLENBQWQsRUFBaUI7QUFDYixNQUFBLE1BQU0sR0FBRyxVQUFVLEdBQUcsTUFBdEI7QUFDSDs7QUFDRCxXQUFRLElBQUksQ0FBQyxNQUFMLEdBQWMsTUFBZixJQUEwQixDQUExQixJQUFnQyxJQUFJLENBQUMsR0FBTCxHQUFXLE1BQVgsR0FBb0IsVUFBckIsR0FBbUMsQ0FBekU7QUFDSDs7QUFDRCxFQUFBLEdBQUcsQ0FBQyxvQkFBSixHQUEyQixvQkFBM0I7O0FBQ0EsV0FBUyxvQkFBVCxDQUE4QixPQUE5QixFQUF1QztBQUNuQyxXQUFPLE9BQU8sQ0FBQyxxQkFBUixHQUFnQyxHQUF2QztBQUNIOztBQUNELEVBQUEsR0FBRyxDQUFDLG9CQUFKLEdBQTJCLG9CQUEzQjs7QUFDQSxXQUFTLHVCQUFULENBQWlDLE9BQWpDLEVBQTBDO0FBQ3RDLFFBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxxQkFBUixFQUFYO0FBQ0EsUUFBSSxVQUFVLEdBQUcsV0FBVyxHQUFHLE1BQS9CO0FBQ0EsV0FBTyxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQXpCO0FBQ0g7O0FBQ0QsRUFBQSxHQUFHLENBQUMsdUJBQUosR0FBOEIsdUJBQTlCOztBQUNBLFdBQVMsaUJBQVQsQ0FBMkIsT0FBM0IsRUFBb0MsUUFBcEMsRUFBOEMsT0FBOUMsRUFBdUQ7QUFDbkQsUUFBSSxPQUFPLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFYLEdBQXFCLENBQTFDO0FBQ0EsUUFBSSxNQUFNLEdBQUcsT0FBTyxHQUFHLE9BQU8sQ0FBQyxNQUFYLEdBQW9CLENBQXhDOztBQUNBLFFBQUksb0JBQW9CLENBQUMsT0FBRCxFQUFVLE1BQVYsQ0FBeEIsRUFBMkM7QUFDdkMsTUFBQSxVQUFVLENBQUMsUUFBRCxFQUFXLE9BQVgsQ0FBVjtBQUNILEtBRkQsTUFHSztBQUNELFVBQUksZUFBZSxHQUFHLFNBQWxCLGVBQWtCLENBQVUsS0FBVixFQUFpQjtBQUNuQyxZQUFJLG9CQUFvQixDQUFDLE9BQUQsRUFBVSxNQUFWLENBQXhCLEVBQTJDO0FBQ3ZDLFVBQUEsVUFBVSxDQUFDLFFBQUQsRUFBVyxPQUFYLENBQVY7QUFDQSxVQUFBLFFBQVEsQ0FBQyxtQkFBVCxDQUE2QixRQUE3QixFQUF1QyxlQUF2QyxFQUF3RDtBQUNwRCxZQUFBLE9BQU8sRUFBRTtBQUQyQyxXQUF4RDtBQUdIO0FBQ0osT0FQRDs7QUFRQSxNQUFBLFFBQVEsQ0FBQyxnQkFBVCxDQUEwQixRQUExQixFQUFvQyxlQUFwQyxFQUFxRDtBQUNqRCxRQUFBLE9BQU8sRUFBRSxJQUR3QztBQUVqRCxRQUFBLE9BQU8sRUFBRTtBQUZ3QyxPQUFyRDtBQUlIO0FBQ0o7O0FBQ0QsRUFBQSxHQUFHLENBQUMsaUJBQUosR0FBd0IsaUJBQXhCOztBQUNBLFdBQVMsYUFBVCxDQUF1QixPQUF2QixFQUFnQztBQUM1QixRQUFJLElBQUksR0FBRyxFQUFYO0FBQ0EsUUFBSSxJQUFJLEdBQUcsT0FBWDs7QUFDQSxXQUFPLElBQVAsRUFBYTtBQUNULE1BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFWO0FBQ0EsTUFBQSxJQUFJLEdBQUcsSUFBSSxDQUFDLGFBQVo7QUFDSDs7QUFDRCxRQUFJLElBQUksQ0FBQyxPQUFMLENBQWEsTUFBYixNQUF5QixDQUFDLENBQTFCLElBQStCLElBQUksQ0FBQyxPQUFMLENBQWEsUUFBYixNQUEyQixDQUFDLENBQS9ELEVBQWtFO0FBQzlELE1BQUEsSUFBSSxDQUFDLElBQUwsQ0FBVSxRQUFWO0FBQ0g7O0FBQ0QsUUFBSSxJQUFJLENBQUMsT0FBTCxDQUFhLE1BQWIsTUFBeUIsQ0FBQyxDQUE5QixFQUFpQztBQUM3QixNQUFBLElBQUksQ0FBQyxJQUFMLENBQVUsTUFBVjtBQUNIOztBQUNELFdBQU8sSUFBUDtBQUNIOztBQUNELEVBQUEsR0FBRyxDQUFDLGFBQUosR0FBb0IsYUFBcEI7QUFDSCxDQTNTRCxFQTJTRyxHQUFHLEdBQUcsT0FBTyxDQUFDLEdBQVIsS0FBZ0IsT0FBTyxDQUFDLEdBQVIsR0FBYyxFQUE5QixDQTNTVDs7O0FDSkE7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLEtBQUssQ0FBdEI7QUFDQSxJQUFJLE1BQUo7O0FBQ0EsQ0FBQyxVQUFVLE1BQVYsRUFBa0I7QUFDZixNQUFJLFFBQVEsR0FBSSxZQUFZO0FBQ3hCLGFBQVMsUUFBVCxDQUFrQixJQUFsQixFQUF3QixNQUF4QixFQUFnQztBQUM1QixVQUFJLE1BQU0sS0FBSyxLQUFLLENBQXBCLEVBQXVCO0FBQUUsUUFBQSxNQUFNLEdBQUcsSUFBVDtBQUFnQjs7QUFDekMsV0FBSyxJQUFMLEdBQVksSUFBWjtBQUNBLFdBQUssTUFBTCxHQUFjLE1BQWQ7QUFDSDs7QUFDRCxXQUFPLFFBQVA7QUFDSCxHQVBlLEVBQWhCOztBQVFBLEVBQUEsTUFBTSxDQUFDLFFBQVAsR0FBa0IsUUFBbEI7O0FBQ0EsTUFBSSxlQUFlLEdBQUksWUFBWTtBQUMvQixhQUFTLGVBQVQsR0FBMkI7QUFDdkIsV0FBSyxNQUFMLEdBQWMsSUFBSSxHQUFKLEVBQWQ7QUFDQSxXQUFLLFNBQUwsR0FBaUIsSUFBSSxHQUFKLEVBQWpCO0FBQ0g7O0FBQ0QsSUFBQSxlQUFlLENBQUMsU0FBaEIsQ0FBMEIsUUFBMUIsR0FBcUMsVUFBVSxJQUFWLEVBQWdCO0FBQ2pELFdBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsSUFBaEI7QUFDSCxLQUZEOztBQUdBLElBQUEsZUFBZSxDQUFDLFNBQWhCLENBQTBCLFVBQTFCLEdBQXVDLFVBQVUsSUFBVixFQUFnQjtBQUNuRCxXQUFLLE1BQUwsV0FBbUIsSUFBbkI7QUFDSCxLQUZEOztBQUdBLElBQUEsZUFBZSxDQUFDLFNBQWhCLENBQTBCLFNBQTFCLEdBQXNDLFVBQVUsT0FBVixFQUFtQixRQUFuQixFQUE2QjtBQUMvRCxXQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLE9BQW5CLEVBQTRCLFFBQTVCO0FBQ0gsS0FGRDs7QUFHQSxJQUFBLGVBQWUsQ0FBQyxTQUFoQixDQUEwQixXQUExQixHQUF3QyxVQUFVLE9BQVYsRUFBbUI7QUFDdkQsV0FBSyxTQUFMLFdBQXNCLE9BQXRCO0FBQ0gsS0FGRDs7QUFHQSxJQUFBLGVBQWUsQ0FBQyxTQUFoQixDQUEwQixRQUExQixHQUFxQyxVQUFVLElBQVYsRUFBZ0IsTUFBaEIsRUFBd0I7QUFDekQsVUFBSSxNQUFNLEtBQUssS0FBSyxDQUFwQixFQUF1QjtBQUFFLFFBQUEsTUFBTSxHQUFHLElBQVQ7QUFBZ0I7O0FBQ3pDLFVBQUksQ0FBQyxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLElBQWhCLENBQUwsRUFBNEI7QUFDeEIsZUFBTyxLQUFQO0FBQ0g7O0FBQ0QsVUFBSSxLQUFLLEdBQUcsSUFBSSxRQUFKLENBQWEsSUFBYixFQUFtQixNQUFuQixDQUFaO0FBQ0EsVUFBSSxFQUFFLEdBQUcsS0FBSyxTQUFMLENBQWUsTUFBZixFQUFUO0FBQ0EsVUFBSSxRQUFKOztBQUNBLGFBQU8sUUFBUSxHQUFHLEVBQUUsQ0FBQyxJQUFILEdBQVUsS0FBNUIsRUFBbUM7QUFDL0IsUUFBQSxRQUFRLENBQUMsS0FBRCxDQUFSO0FBQ0g7O0FBQ0QsYUFBTyxJQUFQO0FBQ0gsS0FaRDs7QUFhQSxXQUFPLGVBQVA7QUFDSCxHQS9Cc0IsRUFBdkI7O0FBZ0NBLEVBQUEsTUFBTSxDQUFDLGVBQVAsR0FBeUIsZUFBekI7QUFDSCxDQTNDRCxFQTJDRyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQVIsS0FBbUIsT0FBTyxDQUFDLE1BQVIsR0FBaUIsRUFBcEMsQ0EzQ1o7OztBQ0pBOzs7Ozs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxHQUFSLEdBQWMsS0FBSyxDQUFuQjtBQUNBLElBQUksR0FBSjs7QUFDQSxDQUFDLFVBQVUsR0FBVixFQUFlO0FBQ1osRUFBQSxHQUFHLENBQUMsS0FBSixHQUFZLDRCQUFaO0FBQ0EsRUFBQSxHQUFHLENBQUMsT0FBSixHQUFjLDhCQUFkOztBQUNBLEVBQUEsR0FBRyxDQUFDLE9BQUosR0FBYyxVQUFVLEdBQVYsRUFBZTtBQUN6QixXQUFPLElBQUksT0FBSixDQUFZLFVBQVUsT0FBVixFQUFtQixNQUFuQixFQUEyQjtBQUMxQyxVQUFJLE9BQU8sR0FBRyxJQUFJLGNBQUosRUFBZDtBQUNBLE1BQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxLQUFiLEVBQW9CLEdBQUcsR0FBRyxNQUExQixFQUFrQyxJQUFsQzs7QUFDQSxNQUFBLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLFlBQVk7QUFDekIsWUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFKLEVBQWI7QUFDQSxZQUFJLGNBQWMsR0FBRyxNQUFNLENBQUMsZUFBUCxDQUF1QixPQUFPLENBQUMsWUFBL0IsRUFBNkMsZUFBN0MsQ0FBckI7QUFDQSxRQUFBLE9BQU8sQ0FBQyxjQUFjLENBQUMsYUFBZixDQUE2QixLQUE3QixDQUFELENBQVA7QUFDSCxPQUpEOztBQUtBLE1BQUEsT0FBTyxDQUFDLE9BQVIsR0FBa0IsWUFBWTtBQUMxQixRQUFBLE1BQU0sQ0FBQyxxQkFBRCxDQUFOO0FBQ0gsT0FGRDs7QUFHQSxNQUFBLE9BQU8sQ0FBQyxJQUFSO0FBQ0gsS0FaTSxDQUFQO0FBYUgsR0FkRDtBQWVILENBbEJELEVBa0JHLEdBQUcsR0FBRyxPQUFPLENBQUMsR0FBUixLQUFnQixPQUFPLENBQUMsR0FBUixHQUFjLEVBQTlCLENBbEJUOzs7QUNKQTs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLE9BQU8sQ0FBQyxrQkFBUixHQUE2QixPQUFPLENBQUMsVUFBUixHQUFxQixPQUFPLENBQUMsVUFBUixHQUFxQixPQUFPLENBQUMsYUFBUixHQUF3QixPQUFPLENBQUMsUUFBUixHQUFtQixPQUFPLENBQUMsa0JBQVIsR0FBNkIsT0FBTyxDQUFDLFVBQVIsR0FBcUIsT0FBTyxDQUFDLElBQVIsR0FBZSxPQUFPLENBQUMsVUFBUixHQUFxQixPQUFPLENBQUMsVUFBUixHQUFxQixPQUFPLENBQUMsSUFBUixHQUFlLE9BQU8sQ0FBQyxJQUFSLEdBQWUsS0FBSyxDQUExUzs7QUFDQSxJQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsT0FBRCxDQUFuQjs7QUFDQSxJQUFJLFNBQVMsR0FBRyxPQUFPLENBQUMsNkJBQUQsQ0FBdkI7O0FBQ0EsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLDBCQUFELENBQXBCOztBQUNBLElBQUksY0FBYyxHQUFHLE9BQU8sQ0FBQyxrQ0FBRCxDQUE1Qjs7QUFDQSxPQUFPLENBQUMsSUFBUixHQUFlLEtBQUssQ0FBQyxHQUFOLENBQVUsZUFBVixDQUEwQixNQUExQixDQUFmO0FBQ0EsT0FBTyxDQUFDLElBQVIsR0FBZSxLQUFLLENBQUMsR0FBTixDQUFVLGVBQVYsQ0FBMEIsTUFBMUIsQ0FBZjtBQUNBLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLEtBQUssQ0FBQyxHQUFOLENBQVUsZUFBVixDQUEwQixjQUExQixDQUFyQjtBQUNBLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLEtBQUssQ0FBQyxHQUFOLENBQVUsSUFBVixLQUFtQixNQUFuQixHQUE0QixPQUFPLENBQUMsVUFBekQ7QUFDQSxPQUFPLENBQUMsSUFBUixHQUFlO0FBQ1gsRUFBQSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQU4sQ0FBVSxlQUFWLENBQTBCLDhCQUExQixDQURJO0FBRVgsRUFBQSxLQUFLLEVBQUUsS0FBSyxDQUFDLEdBQU4sQ0FBVSxlQUFWLENBQTBCLDhCQUExQjtBQUZJLENBQWY7QUFJQSxPQUFPLENBQUMsVUFBUixHQUFxQixJQUFJLE1BQU0sQ0FBQyxJQUFYLEVBQXJCO0FBQ0EsT0FBTyxDQUFDLGtCQUFSLEdBQTZCLElBQUksY0FBYyxDQUFDLFlBQW5CLEVBQTdCO0FBQ0EsT0FBTyxDQUFDLFFBQVIsR0FBbUIsSUFBSSxHQUFKLEVBQW5COztBQUNBLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxHQUFOLENBQVUsV0FBVixDQUFzQixTQUF0QixDQUFYLENBQXRCLEVBQW9FLEVBQUUsR0FBRyxFQUFFLENBQUMsTUFBNUUsRUFBb0YsRUFBRSxFQUF0RixFQUEwRjtBQUN0RixNQUFJLE9BQU8sR0FBRyxFQUFFLENBQUMsRUFBRCxDQUFoQjtBQUNBLEVBQUEsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsR0FBakIsQ0FBcUIsT0FBTyxDQUFDLEVBQTdCLEVBQWlDLElBQUksU0FBUyxXQUFiLENBQXNCLE9BQXRCLENBQWpDO0FBQ0g7O0FBQ0QsT0FBTyxDQUFDLGFBQVIsR0FBd0IsSUFBSSxHQUFKLEVBQXhCOztBQUNBLEtBQUssSUFBSSxFQUFFLEdBQUcsQ0FBVCxFQUFZLEVBQUUsR0FBRyxLQUFLLENBQUMsSUFBTixDQUFXLEtBQUssQ0FBQyxHQUFOLENBQVUsV0FBVixDQUFzQiwrQkFBdEIsQ0FBWCxDQUF0QixFQUEwRixFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQWxHLEVBQTBHLEVBQUUsRUFBNUcsRUFBZ0g7QUFDNUcsTUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDLEVBQUQsQ0FBZjtBQUNBLE1BQUksRUFBRSxHQUFHLE1BQU0sQ0FBQyxZQUFQLENBQW9CLE1BQXBCLEVBQTRCLE1BQTVCLENBQW1DLENBQW5DLENBQVQ7O0FBQ0EsTUFBSSxPQUFPLENBQUMsUUFBUixDQUFpQixHQUFqQixDQUFxQixFQUFyQixLQUE0QixPQUFPLENBQUMsUUFBUixDQUFpQixHQUFqQixDQUFxQixFQUFyQixFQUF5QixNQUF6QixFQUFoQyxFQUFtRTtBQUMvRCxJQUFBLE9BQU8sQ0FBQyxhQUFSLENBQXNCLEdBQXRCLENBQTBCLEVBQTFCLEVBQThCLENBQUMsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsR0FBakIsQ0FBcUIsRUFBckIsQ0FBRCxFQUEyQixNQUEzQixDQUE5QjtBQUNIO0FBQ0o7O0FBQ0QsT0FBTyxDQUFDLFVBQVIsR0FBcUIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxlQUFWLENBQTBCLElBQTFCLENBQXJCO0FBQ0EsT0FBTyxDQUFDLFVBQVIsR0FBcUIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxlQUFWLENBQTBCLHVCQUExQixDQUFyQjtBQUNBLE9BQU8sQ0FBQyxrQkFBUixHQUE2QixLQUFLLENBQUMsR0FBTixDQUFVLGVBQVYsQ0FBMEIsMEJBQTFCLENBQTdCO0FBQ0EsT0FBTyxDQUFDLFVBQVIsR0FBcUIsS0FBSyxDQUFDLEdBQU4sQ0FBVSxlQUFWLENBQTBCLDBCQUExQixDQUFyQjtBQUNBLE9BQU8sQ0FBQyxVQUFSLEdBQXFCLEtBQUssQ0FBQyxHQUFOLENBQVUsZUFBVixDQUEwQiwrQkFBMUIsQ0FBckI7OztBQ2xDQTs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxJQUFJLFNBQVMsR0FBSSxZQUFZO0FBQ3pCLFdBQVMsU0FBVCxDQUFtQixLQUFuQixFQUEwQixHQUExQixFQUErQixHQUEvQixFQUFvQyxVQUFwQyxFQUFnRDtBQUM1QyxRQUFJLFVBQVUsS0FBSyxLQUFLLENBQXhCLEVBQTJCO0FBQUUsTUFBQSxVQUFVLEdBQUcsS0FBYjtBQUFxQjs7QUFDbEQsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLFNBQUssR0FBTCxHQUFXLEdBQVg7QUFDQSxTQUFLLEdBQUwsR0FBVyxHQUFYO0FBQ0EsU0FBSyxVQUFMLEdBQWtCLFVBQWxCO0FBQ0g7O0FBQ0QsU0FBTyxTQUFQO0FBQ0gsQ0FUZ0IsRUFBakI7O0FBVUEsT0FBTyxXQUFQLEdBQWtCLFNBQWxCOzs7QUNaQTs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3QztBQUNBLE9BQU8sQ0FBQyx1QkFBUixHQUFrQyxLQUFLLENBQXZDO0FBQ0EsSUFBSSx1QkFBSjs7QUFDQSxDQUFDLFVBQVUsdUJBQVYsRUFBbUM7QUFDaEMsV0FBUyxxQkFBVCxHQUFpQztBQUM3QixXQUFPLE1BQU0sQ0FBQyxxQkFBUCxJQUNILE1BQU0sQ0FBQywyQkFESixJQUVILFVBQVUsUUFBVixFQUFvQjtBQUNoQixhQUFPLE1BQU0sQ0FBQyxVQUFQLENBQWtCLFFBQWxCLEVBQTRCLE9BQU8sRUFBbkMsQ0FBUDtBQUNILEtBSkw7QUFLSDs7QUFDRCxFQUFBLHVCQUF1QixDQUFDLHFCQUF4QixHQUFnRCxxQkFBaEQ7O0FBQ0EsV0FBUyxvQkFBVCxHQUFnQztBQUM1QixXQUFPLE1BQU0sQ0FBQyxvQkFBUCxJQUNILE1BQU0sQ0FBQywwQkFESixJQUVILFlBRko7QUFHSDs7QUFDRCxFQUFBLHVCQUF1QixDQUFDLG9CQUF4QixHQUErQyxvQkFBL0M7QUFDSCxDQWZELEVBZUcsdUJBQXVCLEdBQUcsT0FBTyxDQUFDLHVCQUFSLEtBQW9DLE9BQU8sQ0FBQyx1QkFBUixHQUFrQyxFQUF0RSxDQWY3Qjs7O0FDSkE7Ozs7Ozs7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsSUFBSSxLQUFLLEdBQUksWUFBWTtBQUNyQixXQUFTLEtBQVQsQ0FBZSxDQUFmLEVBQWtCLENBQWxCLEVBQXFCLENBQXJCLEVBQXdCO0FBQ3BCLFNBQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsU0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNIOztBQUNELEVBQUEsS0FBSyxDQUFDLE9BQU4sR0FBZ0IsVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQixDQUFoQixFQUFtQjtBQUMvQixRQUFJLENBQUMsSUFBSSxDQUFMLElBQVUsQ0FBQyxHQUFHLEdBQWQsSUFBcUIsQ0FBQyxJQUFJLENBQTFCLElBQStCLENBQUMsR0FBRyxHQUFuQyxJQUEwQyxDQUFDLElBQUksQ0FBL0MsSUFBb0QsQ0FBQyxHQUFHLEdBQTVELEVBQWlFO0FBQzdELGFBQU8sSUFBSSxLQUFKLENBQVUsQ0FBVixFQUFhLENBQWIsRUFBZ0IsQ0FBaEIsQ0FBUDtBQUNILEtBRkQsTUFHSztBQUNELGFBQU8sSUFBUDtBQUNIO0FBQ0osR0FQRDs7QUFRQSxFQUFBLEtBQUssQ0FBQyxVQUFOLEdBQW1CLFVBQVUsR0FBVixFQUFlO0FBQzlCLFdBQU8sS0FBSyxDQUFDLE9BQU4sQ0FBYyxHQUFHLENBQUMsQ0FBbEIsRUFBcUIsR0FBRyxDQUFDLENBQXpCLEVBQTRCLEdBQUcsQ0FBQyxDQUFoQyxDQUFQO0FBQ0gsR0FGRDs7QUFHQSxFQUFBLEtBQUssQ0FBQyxPQUFOLEdBQWdCLFVBQVUsR0FBVixFQUFlO0FBQzNCLFdBQU8sS0FBSyxDQUFDLFVBQU4sQ0FBaUIsS0FBSyxDQUFDLFFBQU4sQ0FBZSxHQUFmLENBQWpCLENBQVA7QUFDSCxHQUZEOztBQUdBLEVBQUEsS0FBSyxDQUFDLFFBQU4sR0FBaUIsVUFBVSxHQUFWLEVBQWU7QUFDNUIsUUFBSSxNQUFNLEdBQUcsMkNBQTJDLElBQTNDLENBQWdELEdBQWhELENBQWI7QUFDQSxXQUFPLE1BQU0sR0FBRztBQUNaLE1BQUEsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBRCxDQUFQLEVBQVksRUFBWixDQURDO0FBRVosTUFBQSxDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFELENBQVAsRUFBWSxFQUFaLENBRkM7QUFHWixNQUFBLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUQsQ0FBUCxFQUFZLEVBQVo7QUFIQyxLQUFILEdBSVQsSUFKSjtBQUtILEdBUEQ7O0FBUUEsRUFBQSxLQUFLLENBQUMsU0FBTixDQUFnQixRQUFoQixHQUEyQixVQUFVLE9BQVYsRUFBbUI7QUFDMUMsUUFBSSxPQUFPLEtBQUssS0FBSyxDQUFyQixFQUF3QjtBQUFFLE1BQUEsT0FBTyxHQUFHLENBQVY7QUFBYzs7QUFDeEMsV0FBTyxVQUFVLEtBQUssQ0FBZixHQUFtQixHQUFuQixHQUF5QixLQUFLLENBQTlCLEdBQWtDLEdBQWxDLEdBQXdDLEtBQUssQ0FBN0MsR0FBaUQsR0FBakQsR0FBdUQsT0FBdkQsR0FBaUUsR0FBeEU7QUFDSCxHQUhEOztBQUlBLFNBQU8sS0FBUDtBQUNILENBakNZLEVBQWI7O0FBa0NBLE9BQU8sV0FBUCxHQUFrQixLQUFsQjs7O0FDcENBOzs7Ozs7Ozs7O0FBQ0EsTUFBTSxDQUFDLGNBQVAsQ0FBc0IsT0FBdEIsRUFBK0IsWUFBL0IsRUFBNkM7QUFBRSxFQUFBLEtBQUssRUFBRTtBQUFULENBQTdDOztBQUNBLElBQUksVUFBVSxHQUFJLFlBQVk7QUFDMUIsV0FBUyxVQUFULENBQW9CLENBQXBCLEVBQXVCLENBQXZCLEVBQTBCO0FBQ3RCLFNBQUssQ0FBTCxHQUFTLENBQVQ7QUFDQSxTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0g7O0FBQ0QsRUFBQSxVQUFVLENBQUMsU0FBWCxDQUFxQixRQUFyQixHQUFnQyxVQUFVLEtBQVYsRUFBaUI7QUFDN0MsUUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQU4sR0FBVSxLQUFLLENBQXhCO0FBQ0EsUUFBSSxFQUFFLEdBQUcsS0FBSyxDQUFDLENBQU4sR0FBVSxLQUFLLENBQXhCO0FBQ0EsV0FBTyxJQUFJLENBQUMsSUFBTCxDQUFVLEVBQUUsR0FBRyxFQUFMLEdBQVUsRUFBRSxHQUFHLEVBQXpCLENBQVA7QUFDSCxHQUpEOztBQUtBLEVBQUEsVUFBVSxDQUFDLFNBQVgsQ0FBcUIsUUFBckIsR0FBZ0MsWUFBWTtBQUN4QyxXQUFPLEtBQUssQ0FBTCxHQUFTLEdBQVQsR0FBZSxLQUFLLENBQTNCO0FBQ0gsR0FGRDs7QUFHQSxTQUFPLFVBQVA7QUFDSCxDQWRpQixFQUFsQjs7QUFlQSxPQUFPLFdBQVAsR0FBa0IsVUFBbEI7OztBQ2pCQTs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7O0FDREE7Ozs7Ozs7Ozs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsYUFBRCxDQUF6Qjs7QUFDQSxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBRCxDQUFyQjs7QUFDQSxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsY0FBRCxDQUExQjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBRCxDQUF0Qjs7QUFDQSxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsVUFBRCxDQUF0Qjs7QUFDQSxJQUFJLFFBQVEsR0FBSSxZQUFZO0FBQ3hCLFdBQVMsUUFBVCxDQUFrQixRQUFsQixFQUE0QjtBQUN4QixTQUFLLGdCQUFMLEdBQXdCLElBQXhCO0FBQ0EsU0FBSyxlQUFMLEdBQXVCLElBQXZCO0FBQ0EsU0FBSyxLQUFMLEdBQWEsS0FBSyxXQUFMLENBQWlCLFFBQVEsQ0FBQyxLQUExQixDQUFiO0FBQ0EsU0FBSyxPQUFMLEdBQWUsS0FBSyxhQUFMLENBQW1CLFFBQVEsQ0FBQyxPQUE1QixDQUFmO0FBQ0EsU0FBSyxRQUFMLEdBQWdCLEtBQUssY0FBTCxDQUFvQixRQUFRLENBQUMsSUFBN0IsQ0FBaEI7QUFDQSxTQUFLLEtBQUwsR0FBYSxLQUFLLFdBQUwsQ0FBaUIsUUFBUSxDQUFDLEtBQTFCLENBQWI7QUFDQSxTQUFLLE1BQUwsR0FBYyxLQUFLLFlBQUwsQ0FBa0IsUUFBUSxDQUFDLE1BQTNCLENBQWQ7QUFDQSxTQUFLLE1BQUwsR0FBYyxLQUFLLFlBQUwsQ0FBa0IsUUFBUSxDQUFDLE1BQTNCLENBQWQ7O0FBQ0EsUUFBSSxRQUFRLENBQUMsT0FBYixFQUFzQjtBQUNsQixVQUFJLFFBQVEsQ0FBQyxPQUFULENBQWlCLE9BQXJCLEVBQThCO0FBQzFCLGFBQUssZ0JBQUwsR0FBd0IsS0FBSyxjQUFMLENBQW9CLFFBQVEsQ0FBQyxPQUFULENBQWlCLE9BQXJDLENBQXhCO0FBQ0g7O0FBQ0QsVUFBSSxRQUFRLENBQUMsT0FBVCxDQUFpQixNQUFyQixFQUE2QjtBQUN6QixhQUFLLGVBQUwsR0FBdUIsS0FBSyxhQUFMLENBQW1CLFFBQVEsQ0FBQyxPQUFULENBQWlCLE1BQXBDLENBQXZCO0FBQ0g7QUFDSjs7QUFDRCxTQUFLLE9BQUwsR0FBZTtBQUNYLE1BQUEsT0FBTyxFQUFFLENBREU7QUFFWCxNQUFBLE1BQU0sRUFBRTtBQUZHLEtBQWY7QUFJSDs7QUFDRCxFQUFBLFFBQVEsQ0FBQyxTQUFULENBQW1CLFdBQW5CLEdBQWlDLFVBQVUsS0FBVixFQUFpQjtBQUM5QyxRQUFJLE9BQU8sS0FBUCxLQUFpQixRQUFyQixFQUErQjtBQUMzQixVQUFJLEtBQUssS0FBSyxRQUFkLEVBQXdCO0FBQ3BCLGVBQU8sT0FBTyxXQUFQLENBQWdCLE9BQWhCLENBQXdCLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsS0FBZ0IsR0FBM0IsQ0FBeEIsRUFBeUQsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsTUFBTCxLQUFnQixHQUEzQixDQUF6RCxFQUEwRixJQUFJLENBQUMsS0FBTCxDQUFXLElBQUksQ0FBQyxNQUFMLEtBQWdCLEdBQTNCLENBQTFGLENBQVA7QUFDSCxPQUZELE1BR0s7QUFDRCxlQUFPLE9BQU8sV0FBUCxDQUFnQixPQUFoQixDQUF3QixLQUF4QixDQUFQO0FBQ0g7QUFDSixLQVBELE1BUUssSUFBSSxRQUFPLEtBQVAsTUFBaUIsUUFBckIsRUFBK0I7QUFDaEMsVUFBSSxLQUFLLFlBQVksT0FBTyxXQUE1QixFQUFzQztBQUNsQyxlQUFPLEtBQVA7QUFDSCxPQUZELE1BR0ssSUFBSSxLQUFLLFlBQVksS0FBckIsRUFBNEI7QUFDN0IsZUFBTyxLQUFLLFdBQUwsQ0FBaUIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsS0FBZ0IsS0FBSyxDQUFDLE1BQWpDLENBQUQsQ0FBdEIsQ0FBUDtBQUNILE9BRkksTUFHQTtBQUNELGVBQU8sT0FBTyxXQUFQLENBQWdCLFVBQWhCLENBQTJCLEtBQTNCLENBQVA7QUFDSDtBQUNKOztBQUNELFdBQU8sT0FBTyxXQUFQLENBQWdCLE9BQWhCLENBQXdCLENBQXhCLEVBQTJCLENBQTNCLEVBQThCLENBQTlCLENBQVA7QUFDSCxHQXJCRDs7QUFzQkEsRUFBQSxRQUFRLENBQUMsU0FBVCxDQUFtQixhQUFuQixHQUFtQyxVQUFVLE9BQVYsRUFBbUI7QUFDbEQsUUFBSSxRQUFPLE9BQVAsTUFBbUIsUUFBdkIsRUFBaUM7QUFDN0IsVUFBSSxPQUFPLFlBQVksS0FBdkIsRUFBOEI7QUFDMUIsZUFBTyxLQUFLLGFBQUwsQ0FBbUIsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsS0FBZ0IsT0FBTyxDQUFDLE1BQW5DLENBQUQsQ0FBMUIsQ0FBUDtBQUNIO0FBQ0osS0FKRCxNQUtLLElBQUksT0FBTyxPQUFQLEtBQW1CLFFBQXZCLEVBQWlDO0FBQ2xDLFVBQUksT0FBTyxLQUFLLFFBQWhCLEVBQTBCO0FBQ3RCLGVBQU8sSUFBSSxDQUFDLE1BQUwsRUFBUDtBQUNIO0FBQ0osS0FKSSxNQUtBLElBQUksT0FBTyxPQUFQLEtBQW1CLFFBQXZCLEVBQWlDO0FBQ2xDLFVBQUksT0FBTyxJQUFJLENBQWYsRUFBa0I7QUFDZCxlQUFPLE9BQVA7QUFDSDtBQUNKOztBQUNELFdBQU8sQ0FBUDtBQUNILEdBakJEOztBQWtCQSxFQUFBLFFBQVEsQ0FBQyxTQUFULENBQW1CLGNBQW5CLEdBQW9DLFVBQVUsSUFBVixFQUFnQjtBQUNoRCxRQUFJLE9BQU8sSUFBUCxLQUFnQixTQUFwQixFQUErQjtBQUMzQixVQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1AsZUFBTyxJQUFJLFFBQVEsV0FBWixDQUFxQixDQUFyQixFQUF3QixDQUF4QixDQUFQO0FBQ0g7QUFDSixLQUpELE1BS0ssSUFBSSxRQUFPLElBQVAsTUFBZ0IsUUFBcEIsRUFBOEI7QUFDL0IsVUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFwQjs7QUFDQSxjQUFRLElBQUksQ0FBQyxTQUFiO0FBQ0ksYUFBSyxLQUFMO0FBQ0ksVUFBQSxRQUFRLEdBQUcsSUFBSSxRQUFRLFdBQVosQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBQyxDQUF6QixDQUFYO0FBQ0E7O0FBQ0osYUFBSyxXQUFMO0FBQ0ksVUFBQSxRQUFRLEdBQUcsSUFBSSxRQUFRLFdBQVosQ0FBcUIsR0FBckIsRUFBMEIsQ0FBQyxHQUEzQixDQUFYO0FBQ0E7O0FBQ0osYUFBSyxPQUFMO0FBQ0ksVUFBQSxRQUFRLEdBQUcsSUFBSSxRQUFRLFdBQVosQ0FBcUIsQ0FBckIsRUFBd0IsQ0FBeEIsQ0FBWDtBQUNBOztBQUNKLGFBQUssY0FBTDtBQUNJLFVBQUEsUUFBUSxHQUFHLElBQUksUUFBUSxXQUFaLENBQXFCLEdBQXJCLEVBQTBCLEdBQTFCLENBQVg7QUFDQTs7QUFDSixhQUFLLFFBQUw7QUFDSSxVQUFBLFFBQVEsR0FBRyxJQUFJLFFBQVEsV0FBWixDQUFxQixDQUFyQixFQUF3QixDQUF4QixDQUFYO0FBQ0E7O0FBQ0osYUFBSyxhQUFMO0FBQ0ksVUFBQSxRQUFRLEdBQUcsSUFBSSxRQUFRLFdBQVosQ0FBcUIsQ0FBQyxHQUF0QixFQUEyQixHQUEzQixDQUFYO0FBQ0E7O0FBQ0osYUFBSyxNQUFMO0FBQ0ksVUFBQSxRQUFRLEdBQUcsSUFBSSxRQUFRLFdBQVosQ0FBcUIsQ0FBQyxDQUF0QixFQUF5QixDQUF6QixDQUFYO0FBQ0E7O0FBQ0osYUFBSyxVQUFMO0FBQ0ksVUFBQSxRQUFRLEdBQUcsSUFBSSxRQUFRLFdBQVosQ0FBcUIsQ0FBQyxHQUF0QixFQUEyQixDQUFDLEdBQTVCLENBQVg7QUFDQTs7QUFDSjtBQUNJLFVBQUEsUUFBUSxHQUFHLElBQUksUUFBUSxXQUFaLENBQXFCLENBQXJCLEVBQXdCLENBQXhCLENBQVg7QUFDQTtBQTNCUjs7QUE2QkEsVUFBSSxJQUFJLENBQUMsUUFBVCxFQUFtQjtBQUNmLFlBQUksSUFBSSxDQUFDLE1BQVQsRUFBaUI7QUFDYixVQUFBLFFBQVEsQ0FBQyxDQUFULElBQWMsSUFBSSxDQUFDLE1BQUwsRUFBZDtBQUNBLFVBQUEsUUFBUSxDQUFDLENBQVQsSUFBYyxJQUFJLENBQUMsTUFBTCxFQUFkO0FBQ0g7QUFDSixPQUxELE1BTUs7QUFDRCxRQUFBLFFBQVEsQ0FBQyxDQUFULElBQWMsSUFBSSxDQUFDLE1BQUwsS0FBZ0IsR0FBOUI7QUFDQSxRQUFBLFFBQVEsQ0FBQyxDQUFULElBQWMsSUFBSSxDQUFDLE1BQUwsS0FBZ0IsR0FBOUI7QUFDSDs7QUFDRCxhQUFPLFFBQVA7QUFDSDs7QUFDRCxXQUFPLElBQUksUUFBUSxXQUFaLENBQXFCLENBQXJCLEVBQXdCLENBQXhCLENBQVA7QUFDSCxHQWxERDs7QUFtREEsRUFBQSxRQUFRLENBQUMsU0FBVCxDQUFtQixXQUFuQixHQUFpQyxVQUFVLEtBQVYsRUFBaUI7QUFDOUMsUUFBSSxRQUFPLEtBQVAsTUFBaUIsUUFBckIsRUFBK0I7QUFDM0IsVUFBSSxLQUFLLFlBQVksS0FBckIsRUFBNEI7QUFDeEIsZUFBTyxLQUFLLFdBQUwsQ0FBaUIsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBSSxDQUFDLE1BQUwsS0FBZ0IsS0FBSyxDQUFDLE1BQWpDLENBQUQsQ0FBdEIsQ0FBUDtBQUNIO0FBQ0osS0FKRCxNQUtLLElBQUksT0FBTyxLQUFQLEtBQWlCLFFBQXJCLEVBQStCO0FBQ2hDLFVBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsU0FBTixDQUFnQixDQUFoQixFQUFtQixLQUFLLENBQUMsT0FBTixDQUFjLEdBQWQsQ0FBbkIsQ0FBRCxDQUFwQjs7QUFDQSxVQUFJLENBQUMsS0FBSyxDQUFDLEtBQUQsQ0FBVixFQUFtQjtBQUNmLGVBQU8sS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQVA7QUFDSDs7QUFDRCxhQUFPLEtBQVA7QUFDSCxLQU5JLE1BT0EsSUFBSSxPQUFPLEtBQVAsS0FBaUIsUUFBckIsRUFBK0I7QUFDaEMsVUFBSSxLQUFLLElBQUksQ0FBYixFQUFnQjtBQUNaLGVBQU8sS0FBUDtBQUNIO0FBQ0o7O0FBQ0QsV0FBTyxRQUFQO0FBQ0gsR0FuQkQ7O0FBb0JBLEVBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsWUFBbkIsR0FBa0MsVUFBVSxNQUFWLEVBQWtCO0FBQ2hELFFBQUksUUFBTyxNQUFQLE1BQWtCLFFBQXRCLEVBQWdDO0FBQzVCLFVBQUksT0FBTyxNQUFNLENBQUMsS0FBZCxLQUF3QixRQUE1QixFQUFzQztBQUNsQyxZQUFJLE1BQU0sQ0FBQyxLQUFQLEdBQWUsQ0FBbkIsRUFBc0I7QUFDbEIsaUJBQU8sSUFBSSxRQUFRLFdBQVosQ0FBcUIsTUFBTSxDQUFDLEtBQTVCLEVBQW1DLEtBQUssV0FBTCxDQUFpQixNQUFNLENBQUMsS0FBeEIsQ0FBbkMsQ0FBUDtBQUNIO0FBQ0o7QUFDSjs7QUFDRCxXQUFPLElBQUksUUFBUSxXQUFaLENBQXFCLENBQXJCLEVBQXdCLE9BQU8sV0FBUCxDQUFnQixPQUFoQixDQUF3QixDQUF4QixFQUEyQixDQUEzQixFQUE4QixDQUE5QixDQUF4QixDQUFQO0FBQ0gsR0FURDs7QUFVQSxFQUFBLFFBQVEsQ0FBQyxTQUFULENBQW1CLFlBQW5CLEdBQWtDLFVBQVUsTUFBVixFQUFrQjtBQUNoRCxRQUFJLFFBQU8sTUFBUCxNQUFrQixRQUF0QixFQUFnQztBQUM1QixVQUFJLE1BQU0sWUFBWSxLQUF0QixFQUE2QjtBQUN6QixlQUFPLEtBQUssWUFBTCxDQUFrQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFJLENBQUMsTUFBTCxLQUFnQixNQUFNLENBQUMsTUFBbEMsQ0FBRCxDQUF4QixDQUFQO0FBQ0g7QUFDSixLQUpELE1BS0ssSUFBSSxPQUFPLE1BQVAsS0FBa0IsUUFBdEIsRUFBZ0M7QUFDakMsVUFBSSxNQUFNLEtBQUssUUFBZixFQUF5QjtBQUNyQixlQUFPLElBQUksQ0FBQyxNQUFMLEVBQVA7QUFDSDtBQUNKLEtBSkksTUFLQSxJQUFJLE9BQU8sTUFBUCxLQUFrQixRQUF0QixFQUFnQztBQUNqQyxVQUFJLE1BQU0sSUFBSSxDQUFkLEVBQWlCO0FBQ2IsZUFBTyxNQUFQO0FBQ0g7QUFDSjs7QUFDRCxXQUFPLENBQVA7QUFDSCxHQWpCRDs7QUFrQkEsRUFBQSxRQUFRLENBQUMsU0FBVCxDQUFtQixVQUFuQixHQUFnQyxVQUFVLEtBQVYsRUFBaUI7QUFDN0MsUUFBSSxLQUFLLEdBQUcsQ0FBWixFQUFlO0FBQ1gsYUFBTyxLQUFQO0FBQ0g7O0FBQ0QsV0FBTyxHQUFQO0FBQ0gsR0FMRDs7QUFNQSxFQUFBLFFBQVEsQ0FBQyxTQUFULENBQW1CLGNBQW5CLEdBQW9DLFVBQVUsU0FBVixFQUFxQjtBQUNyRCxRQUFJLFNBQUosRUFBZTtBQUNYLFVBQUksR0FBRyxHQUFHLEtBQUssT0FBZjtBQUNBLFVBQUksR0FBRyxHQUFHLEtBQUssYUFBTCxDQUFtQixTQUFTLENBQUMsR0FBN0IsQ0FBVjtBQUNBLFVBQUksS0FBSyxHQUFHLEtBQUssVUFBTCxDQUFnQixTQUFTLENBQUMsS0FBMUIsSUFBbUMsR0FBL0M7O0FBQ0EsVUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLEVBQXFCO0FBQ2pCLFFBQUEsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFMLEVBQVQ7QUFDSDs7QUFDRCxXQUFLLE9BQUwsSUFBZ0IsSUFBSSxDQUFDLE1BQUwsRUFBaEI7QUFDQSxhQUFPLElBQUksV0FBVyxXQUFmLENBQXdCLEtBQXhCLEVBQStCLEdBQS9CLEVBQW9DLEdBQXBDLENBQVA7QUFDSDs7QUFDRCxXQUFPLElBQVA7QUFDSCxHQVpEOztBQWFBLEVBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsYUFBbkIsR0FBbUMsVUFBVSxTQUFWLEVBQXFCO0FBQ3BELFFBQUksU0FBSixFQUFlO0FBQ1gsVUFBSSxHQUFHLEdBQUcsS0FBSyxNQUFmO0FBQ0EsVUFBSSxHQUFHLEdBQUcsS0FBSyxZQUFMLENBQWtCLFNBQVMsQ0FBQyxHQUE1QixDQUFWO0FBQ0EsVUFBSSxLQUFLLEdBQUcsS0FBSyxVQUFMLENBQWdCLFNBQVMsQ0FBQyxLQUExQixJQUFtQyxHQUEvQzs7QUFDQSxVQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsRUFBcUI7QUFDakIsUUFBQSxLQUFLLElBQUksSUFBSSxDQUFDLE1BQUwsRUFBVDtBQUNIOztBQUNELFdBQUssT0FBTCxJQUFnQixJQUFJLENBQUMsTUFBTCxFQUFoQjtBQUNBLGFBQU8sSUFBSSxXQUFXLFdBQWYsQ0FBd0IsS0FBeEIsRUFBK0IsR0FBL0IsRUFBb0MsR0FBcEMsQ0FBUDtBQUNIOztBQUNELFdBQU8sSUFBUDtBQUNILEdBWkQ7O0FBYUEsRUFBQSxRQUFRLENBQUMsU0FBVCxDQUFtQixXQUFuQixHQUFpQyxVQUFVLFFBQVYsRUFBb0I7QUFDakQsU0FBSyxRQUFMLEdBQWdCLFFBQWhCO0FBQ0gsR0FGRDs7QUFHQSxFQUFBLFFBQVEsQ0FBQyxTQUFULENBQW1CLElBQW5CLEdBQTBCLFVBQVUsS0FBVixFQUFpQjtBQUN2QyxTQUFLLFFBQUwsQ0FBYyxDQUFkLElBQW1CLEtBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsS0FBckM7QUFDQSxTQUFLLFFBQUwsQ0FBYyxDQUFkLElBQW1CLEtBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsS0FBckM7QUFDSCxHQUhEOztBQUlBLEVBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsU0FBbkIsR0FBK0IsWUFBWTtBQUN2QyxXQUFPLEtBQUssTUFBTCxHQUFjLEtBQUssT0FBTCxDQUFhLE1BQWxDO0FBQ0gsR0FGRDs7QUFHQSxFQUFBLFFBQVEsQ0FBQyxTQUFULENBQW1CLFVBQW5CLEdBQWdDLFlBQVk7QUFDeEMsV0FBTyxLQUFLLE9BQUwsR0FBZSxLQUFLLE9BQUwsQ0FBYSxPQUFuQztBQUNILEdBRkQ7O0FBR0EsRUFBQSxRQUFRLENBQUMsU0FBVCxDQUFtQixJQUFuQixHQUEwQixVQUFVLEdBQVYsRUFBZTtBQUNyQyxZQUFRLEdBQVI7QUFDSSxXQUFLLEtBQUw7QUFDSSxlQUFPLElBQUksWUFBWSxXQUFoQixDQUF5QixLQUFLLFFBQUwsQ0FBYyxDQUF2QyxFQUEwQyxLQUFLLFFBQUwsQ0FBYyxDQUFkLEdBQWtCLEtBQUssU0FBTCxFQUE1RCxDQUFQOztBQUNKLFdBQUssT0FBTDtBQUNJLGVBQU8sSUFBSSxZQUFZLFdBQWhCLENBQXlCLEtBQUssUUFBTCxDQUFjLENBQWQsR0FBa0IsS0FBSyxTQUFMLEVBQTNDLEVBQTZELEtBQUssUUFBTCxDQUFjLENBQTNFLENBQVA7O0FBQ0osV0FBSyxRQUFMO0FBQ0ksZUFBTyxJQUFJLFlBQVksV0FBaEIsQ0FBeUIsS0FBSyxRQUFMLENBQWMsQ0FBdkMsRUFBMEMsS0FBSyxRQUFMLENBQWMsQ0FBZCxHQUFrQixLQUFLLFNBQUwsRUFBNUQsQ0FBUDs7QUFDSixXQUFLLE1BQUw7QUFDSSxlQUFPLElBQUksWUFBWSxXQUFoQixDQUF5QixLQUFLLFFBQUwsQ0FBYyxDQUFkLEdBQWtCLEtBQUssU0FBTCxFQUEzQyxFQUE2RCxLQUFLLFFBQUwsQ0FBYyxDQUEzRSxDQUFQOztBQUNKO0FBQ0ksZUFBTyxLQUFLLFFBQVo7QUFWUjtBQVlILEdBYkQ7O0FBY0EsRUFBQSxRQUFRLENBQUMsU0FBVCxDQUFtQixZQUFuQixHQUFrQyxVQUFVLFFBQVYsRUFBb0I7QUFDbEQsV0FBTyxLQUFLLFFBQUwsQ0FBYyxRQUFkLENBQXVCLFFBQVEsQ0FBQyxRQUFoQyxJQUE0QyxLQUFLLFNBQUwsS0FBbUIsUUFBUSxDQUFDLFNBQVQsRUFBdEU7QUFDSCxHQUZEOztBQUdBLEVBQUEsUUFBUSxDQUFDLFNBQVQsQ0FBbUIsTUFBbkIsR0FBNEIsVUFBVSxLQUFWLEVBQWlCLFFBQWpCLEVBQTJCO0FBQ25ELFFBQUksUUFBUSxHQUFHLEtBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsS0FBSyxDQUFDLFFBQTdCLENBQWY7QUFDQSxRQUFJLEtBQUssR0FBRyxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBcEM7O0FBQ0EsUUFBSSxLQUFLLElBQUksQ0FBVCxJQUFjLEtBQUssQ0FBQyxJQUF4QixFQUE4QjtBQUMxQixXQUFLLE9BQUwsQ0FBYSxPQUFiLEdBQXVCLEtBQUssSUFBSSxRQUFRLENBQUMsT0FBVCxHQUFtQixLQUFLLE9BQTVCLENBQTVCO0FBQ0EsV0FBSyxPQUFMLENBQWEsTUFBYixHQUFzQixLQUFLLElBQUksUUFBUSxDQUFDLE1BQVQsR0FBa0IsS0FBSyxNQUEzQixDQUEzQjtBQUNILEtBSEQsTUFJSztBQUNELFdBQUssT0FBTCxDQUFhLE9BQWIsR0FBdUIsQ0FBdkI7QUFDQSxXQUFLLE9BQUwsQ0FBYSxNQUFiLEdBQXNCLENBQXRCO0FBQ0g7QUFDSixHQVhEOztBQVlBLFNBQU8sUUFBUDtBQUNILENBN09lLEVBQWhCOztBQThPQSxPQUFPLFdBQVAsR0FBa0IsUUFBbEI7OztBQ3JQQTs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7O0FDREE7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsSUFBSSx5QkFBeUIsR0FBRyxPQUFPLENBQUMsMkJBQUQsQ0FBdkM7O0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLGdCQUFELENBQW5COztBQUNBLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxjQUFELENBQTFCOztBQUNBLElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxZQUFELENBQXhCOztBQUNBLElBQUksU0FBUyxHQUFJLFlBQVk7QUFDekIsV0FBUyxTQUFULENBQW1CLFFBQW5CLEVBQTZCLE9BQTdCLEVBQXNDO0FBQ2xDLFNBQUssS0FBTCxHQUFhLFNBQWI7QUFDQSxTQUFLLGVBQUwsR0FBdUIsQ0FBdkI7QUFDQSxTQUFLLFVBQUwsR0FBa0IsQ0FBbEI7QUFDQSxTQUFLLFNBQUwsR0FBaUIsSUFBSSxLQUFKLEVBQWpCO0FBQ0EsU0FBSyxLQUFMLEdBQWE7QUFDVCxNQUFBLFFBQVEsRUFBRSxJQUFJLFlBQVksV0FBaEIsQ0FBeUIsQ0FBekIsRUFBNEIsQ0FBNUIsQ0FERDtBQUVULE1BQUEsSUFBSSxFQUFFO0FBRkcsS0FBYjtBQUlBLFNBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNBLFNBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNBLFNBQUssbUJBQUwsR0FBMkIsS0FBM0I7QUFDQSxTQUFLLE1BQUwsR0FBYyxLQUFLLENBQUMsR0FBTixDQUFVLGVBQVYsQ0FBMEIsUUFBMUIsQ0FBZDs7QUFDQSxRQUFJLEtBQUssTUFBTCxLQUFnQixJQUFwQixFQUEwQjtBQUN0QixZQUFNLGVBQWUsUUFBZixHQUEwQixhQUFoQztBQUNIOztBQUNELFNBQUssR0FBTCxHQUFXLEtBQUssTUFBTCxDQUFZLFVBQVosQ0FBdUIsT0FBdkIsQ0FBWDtBQUNBLElBQUEsTUFBTSxDQUFDLHFCQUFQLEdBQStCLHlCQUF5QixDQUFDLHVCQUExQixDQUFrRCxxQkFBbEQsRUFBL0I7QUFDQSxJQUFBLE1BQU0sQ0FBQyxvQkFBUCxHQUE4Qix5QkFBeUIsQ0FBQyx1QkFBMUIsQ0FBa0Qsb0JBQWxELEVBQTlCO0FBQ0EsU0FBSyxnQkFBTCxHQUF3QjtBQUNwQixNQUFBLE1BQU0sRUFBRSxHQURZO0FBRXBCLE1BQUEsT0FBTyxFQUFFLElBRlc7QUFHcEIsTUFBQSxLQUFLLEVBQUUsU0FIYTtBQUlwQixNQUFBLE9BQU8sRUFBRSxDQUpXO0FBS3BCLE1BQUEsTUFBTSxFQUFFLENBTFk7QUFNcEIsTUFBQSxLQUFLLEVBQUUsUUFOYTtBQU9wQixNQUFBLE1BQU0sRUFBRTtBQUNKLFFBQUEsS0FBSyxFQUFFLENBREg7QUFFSixRQUFBLEtBQUssRUFBRTtBQUZILE9BUFk7QUFXcEIsTUFBQSxJQUFJLEVBQUU7QUFDRixRQUFBLEtBQUssRUFBRSxHQURMO0FBRUYsUUFBQSxTQUFTLEVBQUUsUUFGVDtBQUdGLFFBQUEsUUFBUSxFQUFFLElBSFI7QUFJRixRQUFBLE1BQU0sRUFBRSxJQUpOO0FBS0YsUUFBQSxVQUFVLEVBQUUsS0FMVjtBQU1GLFFBQUEsT0FBTyxFQUFFO0FBTlAsT0FYYztBQW1CcEIsTUFBQSxNQUFNLEVBQUU7QUFDSixRQUFBLE1BQU0sRUFBRSxJQURKO0FBRUosUUFBQSxLQUFLLEVBQUUsS0FGSDtBQUdKLFFBQUEsS0FBSyxFQUFFO0FBSEgsT0FuQlk7QUF3QnBCLE1BQUEsT0FBTyxFQUFFO0FBQ0wsUUFBQSxPQUFPLEVBQUUsS0FESjtBQUVMLFFBQUEsTUFBTSxFQUFFO0FBRkg7QUF4QlcsS0FBeEI7QUE2QkEsU0FBSyxtQkFBTCxHQUEyQjtBQUN2QixNQUFBLEtBQUssRUFBRTtBQUNILFFBQUEsTUFBTSxFQUFFO0FBQ0osVUFBQSxRQUFRLEVBQUUsRUFETjtBQUVKLFVBQUEsTUFBTSxFQUFFLENBRko7QUFHSixVQUFBLE9BQU8sRUFBRTtBQUhMLFNBREw7QUFNSCxRQUFBLE9BQU8sRUFBRTtBQUNMLFVBQUEsUUFBUSxFQUFFO0FBREw7QUFOTixPQURnQjtBQVd2QixNQUFBLEtBQUssRUFBRTtBQUNILFFBQUEsR0FBRyxFQUFFO0FBQ0QsVUFBQSxNQUFNLEVBQUU7QUFEUCxTQURGO0FBSUgsUUFBQSxNQUFNLEVBQUU7QUFDSixVQUFBLE1BQU0sRUFBRTtBQURKO0FBSkw7QUFYZ0IsS0FBM0I7QUFvQkg7O0FBQ0QsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixVQUFwQixHQUFpQyxZQUFZO0FBQ3pDLFNBQUssVUFBTDtBQUNBLFNBQUssb0JBQUwsQ0FBMEIsTUFBTSxDQUFDLGdCQUFQLElBQTJCLEtBQUssZUFBaEMsR0FBa0QsS0FBSyxlQUFMLEdBQXVCLENBQXpFLEdBQTZFLE1BQU0sQ0FBQyxnQkFBOUc7QUFDQSxTQUFLLGFBQUw7QUFDQSxTQUFLLEtBQUw7QUFDQSxTQUFLLGVBQUw7QUFDQSxTQUFLLGVBQUw7QUFDQSxTQUFLLG1CQUFMO0FBQ0gsR0FSRDs7QUFTQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLFVBQXBCLEdBQWlDLFlBQVk7QUFDekMsUUFBSSxLQUFLLEdBQUcsSUFBWjs7QUFDQSxRQUFJLEtBQUssbUJBQVQsRUFBOEI7QUFDMUI7QUFDSDs7QUFDRCxRQUFJLEtBQUssZ0JBQUwsQ0FBc0IsTUFBMUIsRUFBa0M7QUFDOUIsVUFBSSxLQUFLLGdCQUFMLENBQXNCLE1BQXRCLENBQTZCLEtBQWpDLEVBQXdDO0FBQ3BDLGFBQUssTUFBTCxDQUFZLGdCQUFaLENBQTZCLFdBQTdCLEVBQTBDLFVBQVUsS0FBVixFQUFpQjtBQUN2RCxVQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksUUFBWixDQUFxQixDQUFyQixHQUF5QixLQUFLLENBQUMsT0FBTixHQUFnQixLQUFLLENBQUMsVUFBL0M7QUFDQSxVQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksUUFBWixDQUFxQixDQUFyQixHQUF5QixLQUFLLENBQUMsT0FBTixHQUFnQixLQUFLLENBQUMsVUFBL0M7QUFDQSxVQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBWixHQUFtQixJQUFuQjtBQUNILFNBSkQ7QUFLQSxhQUFLLE1BQUwsQ0FBWSxnQkFBWixDQUE2QixZQUE3QixFQUEyQyxZQUFZO0FBQ25ELFVBQUEsS0FBSyxDQUFDLEtBQU4sQ0FBWSxRQUFaLENBQXFCLENBQXJCLEdBQXlCLElBQXpCO0FBQ0EsVUFBQSxLQUFLLENBQUMsS0FBTixDQUFZLFFBQVosQ0FBcUIsQ0FBckIsR0FBeUIsSUFBekI7QUFDQSxVQUFBLEtBQUssQ0FBQyxLQUFOLENBQVksSUFBWixHQUFtQixLQUFuQjtBQUNILFNBSkQ7QUFLSDs7QUFDRCxVQUFJLEtBQUssZ0JBQUwsQ0FBc0IsTUFBdEIsQ0FBNkIsS0FBakMsRUFBd0MsQ0FDdkM7QUFDSjs7QUFDRCxTQUFLLG1CQUFMLEdBQTJCLElBQTNCO0FBQ0gsR0F0QkQ7O0FBdUJBLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0Isb0JBQXBCLEdBQTJDLFVBQVUsUUFBVixFQUFvQjtBQUMzRCxRQUFJLFFBQVEsS0FBSyxLQUFLLENBQXRCLEVBQXlCO0FBQUUsTUFBQSxRQUFRLEdBQUcsTUFBTSxDQUFDLGdCQUFsQjtBQUFxQzs7QUFDaEUsUUFBSSxVQUFVLEdBQUcsUUFBUSxHQUFHLEtBQUssVUFBakM7QUFDQSxTQUFLLEtBQUwsR0FBYSxLQUFLLE1BQUwsQ0FBWSxXQUFaLEdBQTBCLFVBQXZDO0FBQ0EsU0FBSyxNQUFMLEdBQWMsS0FBSyxNQUFMLENBQVksWUFBWixHQUEyQixVQUF6Qzs7QUFDQSxRQUFJLEtBQUssZ0JBQUwsQ0FBc0IsTUFBdEIsWUFBd0MsS0FBNUMsRUFBbUQ7QUFDL0MsV0FBSyxnQkFBTCxDQUFzQixNQUF0QixHQUErQixLQUFLLGdCQUFMLENBQXNCLE1BQXRCLENBQTZCLEdBQTdCLENBQWlDLFVBQVUsQ0FBVixFQUFhO0FBQUUsZUFBTyxDQUFDLEdBQUcsVUFBWDtBQUF3QixPQUF4RSxDQUEvQjtBQUNILEtBRkQsTUFHSztBQUNELFVBQUksT0FBTyxLQUFLLGdCQUFMLENBQXNCLE1BQTdCLEtBQXdDLFFBQTVDLEVBQXNEO0FBQ2xELGFBQUssZ0JBQUwsQ0FBc0IsTUFBdEIsSUFBZ0MsVUFBaEM7QUFDSDtBQUNKOztBQUNELFFBQUksS0FBSyxnQkFBTCxDQUFzQixJQUExQixFQUFnQztBQUM1QixXQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLEtBQTNCLElBQW9DLFVBQXBDO0FBQ0g7O0FBQ0QsUUFBSSxLQUFLLGdCQUFMLENBQXNCLE9BQXRCLElBQWlDLEtBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsQ0FBOEIsTUFBbkUsRUFBMkU7QUFDdkUsV0FBSyxnQkFBTCxDQUFzQixPQUF0QixDQUE4QixNQUE5QixDQUFxQyxLQUFyQyxJQUE4QyxVQUE5QztBQUNIOztBQUNELFFBQUksS0FBSyxtQkFBTCxDQUF5QixLQUE3QixFQUFvQztBQUNoQyxVQUFJLEtBQUssbUJBQUwsQ0FBeUIsS0FBekIsQ0FBK0IsTUFBbkMsRUFBMkM7QUFDdkMsYUFBSyxtQkFBTCxDQUF5QixLQUF6QixDQUErQixNQUEvQixDQUFzQyxNQUF0QyxJQUFnRCxVQUFoRDtBQUNBLGFBQUssbUJBQUwsQ0FBeUIsS0FBekIsQ0FBK0IsTUFBL0IsQ0FBc0MsUUFBdEMsSUFBa0QsVUFBbEQ7QUFDSDs7QUFDRCxVQUFJLEtBQUssbUJBQUwsQ0FBeUIsS0FBekIsQ0FBK0IsT0FBbkMsRUFBNEM7QUFDeEMsYUFBSyxtQkFBTCxDQUF5QixLQUF6QixDQUErQixPQUEvQixDQUF1QyxRQUF2QyxJQUFtRCxVQUFuRDtBQUNIO0FBQ0o7O0FBQ0QsU0FBSyxVQUFMLEdBQWtCLFFBQWxCO0FBQ0gsR0E3QkQ7O0FBOEJBLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsU0FBcEIsR0FBZ0MsWUFBWTtBQUN4QyxRQUFJLE1BQU0sQ0FBQyxnQkFBUCxLQUE0QixLQUFLLFVBQWpDLElBQStDLE1BQU0sQ0FBQyxnQkFBUCxHQUEwQixLQUFLLGVBQWxGLEVBQW1HO0FBQy9GLFdBQUssV0FBTDtBQUNBLFdBQUssVUFBTDtBQUNBLFdBQUssSUFBTDtBQUNIO0FBQ0osR0FORDs7QUFPQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLGFBQXBCLEdBQW9DLFlBQVk7QUFDNUMsUUFBSSxLQUFLLEdBQUcsSUFBWjs7QUFDQSxTQUFLLE1BQUwsQ0FBWSxLQUFaLEdBQW9CLEtBQUssS0FBekI7QUFDQSxTQUFLLE1BQUwsQ0FBWSxNQUFaLEdBQXFCLEtBQUssTUFBMUI7O0FBQ0EsUUFBSSxLQUFLLGdCQUFMLENBQXNCLE1BQXRCLElBQWdDLEtBQUssZ0JBQUwsQ0FBc0IsTUFBdEIsQ0FBNkIsTUFBakUsRUFBeUU7QUFDckUsV0FBSyxZQUFMLEdBQW9CLFlBQVk7QUFDNUIsUUFBQSxLQUFLLENBQUMsU0FBTjs7QUFDQSxRQUFBLEtBQUssQ0FBQyxLQUFOLEdBQWMsS0FBSyxDQUFDLE1BQU4sQ0FBYSxXQUFiLEdBQTJCLEtBQUssQ0FBQyxVQUEvQztBQUNBLFFBQUEsS0FBSyxDQUFDLE1BQU4sR0FBZSxLQUFLLENBQUMsTUFBTixDQUFhLFlBQWIsR0FBNEIsS0FBSyxDQUFDLFVBQWpEO0FBQ0EsUUFBQSxLQUFLLENBQUMsTUFBTixDQUFhLEtBQWIsR0FBcUIsS0FBSyxDQUFDLEtBQTNCO0FBQ0EsUUFBQSxLQUFLLENBQUMsTUFBTixDQUFhLE1BQWIsR0FBc0IsS0FBSyxDQUFDLE1BQTVCOztBQUNBLFlBQUksQ0FBQyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsSUFBNUIsRUFBa0M7QUFDOUIsVUFBQSxLQUFLLENBQUMsZUFBTjs7QUFDQSxVQUFBLEtBQUssQ0FBQyxlQUFOOztBQUNBLFVBQUEsS0FBSyxDQUFDLGFBQU47QUFDSDs7QUFDRCxRQUFBLEtBQUssQ0FBQyxtQkFBTjtBQUNILE9BWkQ7O0FBYUEsTUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsS0FBSyxZQUF2QztBQUNIO0FBQ0osR0FwQkQ7O0FBcUJBLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsT0FBcEIsR0FBOEIsWUFBWTtBQUN0QyxXQUFPLEtBQUssR0FBTCxDQUFTLFNBQWhCO0FBQ0gsR0FGRDs7QUFHQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLE9BQXBCLEdBQThCLFVBQVUsS0FBVixFQUFpQjtBQUMzQyxTQUFLLEdBQUwsQ0FBUyxTQUFULEdBQXFCLEtBQXJCO0FBQ0gsR0FGRDs7QUFHQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLFNBQXBCLEdBQWdDLFVBQVUsTUFBVixFQUFrQjtBQUM5QyxTQUFLLEdBQUwsQ0FBUyxXQUFULEdBQXVCLE1BQU0sQ0FBQyxLQUFQLENBQWEsUUFBYixFQUF2QjtBQUNBLFNBQUssR0FBTCxDQUFTLFNBQVQsR0FBcUIsTUFBTSxDQUFDLEtBQTVCO0FBQ0gsR0FIRDs7QUFJQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLEtBQXBCLEdBQTRCLFlBQVk7QUFDcEMsU0FBSyxHQUFMLENBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixLQUFLLE1BQUwsQ0FBWSxLQUFyQyxFQUE0QyxLQUFLLE1BQUwsQ0FBWSxNQUF4RDtBQUNILEdBRkQ7O0FBR0EsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixJQUFwQixHQUEyQixZQUFZO0FBQ25DLFNBQUssYUFBTDtBQUNBLFFBQUksS0FBSyxnQkFBTCxDQUFzQixJQUExQixFQUNJLEtBQUssY0FBTCxHQUFzQixNQUFNLENBQUMscUJBQVAsQ0FBNkIsS0FBSyxJQUFMLENBQVUsSUFBVixDQUFlLElBQWYsQ0FBN0IsQ0FBdEI7QUFDUCxHQUpEOztBQUtBLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsV0FBcEIsR0FBa0MsWUFBWTtBQUMxQyxRQUFJLEtBQUssWUFBVCxFQUF1QjtBQUNuQixNQUFBLE1BQU0sQ0FBQyxtQkFBUCxDQUEyQixRQUEzQixFQUFxQyxLQUFLLFlBQTFDO0FBQ0EsV0FBSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0g7O0FBQ0QsUUFBSSxLQUFLLGNBQVQsRUFBeUI7QUFDckIsTUFBQSxNQUFNLENBQUMsb0JBQVAsQ0FBNEIsS0FBSyxjQUFqQztBQUNBLFdBQUssY0FBTCxHQUFzQixJQUF0QjtBQUNIO0FBQ0osR0FURDs7QUFVQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLFdBQXBCLEdBQWtDLFVBQVUsTUFBVixFQUFrQixNQUFsQixFQUEwQixLQUExQixFQUFpQztBQUMvRCxRQUFJLGFBQWEsR0FBRyxNQUFNLEtBQTFCO0FBQ0EsSUFBQSxhQUFhLElBQUksSUFBSSxDQUFDLEVBQUwsR0FBVSxHQUEzQjtBQUNBLFNBQUssR0FBTCxDQUFTLElBQVQ7QUFDQSxTQUFLLEdBQUwsQ0FBUyxTQUFUO0FBQ0EsU0FBSyxHQUFMLENBQVMsU0FBVCxDQUFtQixNQUFNLENBQUMsQ0FBMUIsRUFBNkIsTUFBTSxDQUFDLENBQXBDO0FBQ0EsU0FBSyxHQUFMLENBQVMsTUFBVCxDQUFnQixhQUFhLElBQUksS0FBSyxHQUFHLENBQVIsR0FBWSxDQUFaLEdBQWdCLENBQXBCLENBQTdCO0FBQ0EsU0FBSyxHQUFMLENBQVMsTUFBVCxDQUFnQixNQUFoQixFQUF3QixDQUF4QjtBQUNBLFFBQUksS0FBSjs7QUFDQSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLEtBQXBCLEVBQTJCLENBQUMsRUFBNUIsRUFBZ0M7QUFDNUIsTUFBQSxLQUFLLEdBQUcsQ0FBQyxHQUFHLGFBQVo7QUFDQSxXQUFLLEdBQUwsQ0FBUyxNQUFULENBQWdCLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBekIsRUFBMEMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFuRDtBQUNIOztBQUNELFNBQUssR0FBTCxDQUFTLElBQVQ7QUFDQSxTQUFLLEdBQUwsQ0FBUyxPQUFUO0FBQ0gsR0FmRDs7QUFnQkEsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixZQUFwQixHQUFtQyxVQUFVLFFBQVYsRUFBb0I7QUFDbkQsUUFBSSxPQUFPLEdBQUcsUUFBUSxDQUFDLFVBQVQsRUFBZDtBQUNBLFFBQUksTUFBTSxHQUFHLFFBQVEsQ0FBQyxTQUFULEVBQWI7QUFDQSxTQUFLLE9BQUwsQ0FBYSxRQUFRLENBQUMsS0FBVCxDQUFlLFFBQWYsQ0FBd0IsT0FBeEIsQ0FBYjtBQUNBLFNBQUssR0FBTCxDQUFTLFNBQVQ7O0FBQ0EsUUFBSSxPQUFRLFFBQVEsQ0FBQyxLQUFqQixLQUE0QixRQUFoQyxFQUEwQztBQUN0QyxXQUFLLFdBQUwsQ0FBaUIsUUFBUSxDQUFDLFFBQTFCLEVBQW9DLE1BQXBDLEVBQTRDLFFBQVEsQ0FBQyxLQUFyRDtBQUNILEtBRkQsTUFHSztBQUNELGNBQVEsUUFBUSxDQUFDLEtBQWpCO0FBQ0k7QUFDQSxhQUFLLFFBQUw7QUFDSSxlQUFLLEdBQUwsQ0FBUyxHQUFULENBQWEsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsQ0FBL0IsRUFBa0MsUUFBUSxDQUFDLFFBQVQsQ0FBa0IsQ0FBcEQsRUFBdUQsTUFBdkQsRUFBK0QsQ0FBL0QsRUFBa0UsSUFBSSxDQUFDLEVBQUwsR0FBVSxDQUE1RSxFQUErRSxLQUEvRTtBQUNBO0FBSlI7QUFNSDs7QUFDRCxTQUFLLEdBQUwsQ0FBUyxTQUFUOztBQUNBLFFBQUksUUFBUSxDQUFDLE1BQVQsQ0FBZ0IsS0FBaEIsR0FBd0IsQ0FBNUIsRUFBK0I7QUFDM0IsV0FBSyxTQUFMLENBQWUsUUFBUSxDQUFDLE1BQXhCO0FBQ0EsV0FBSyxHQUFMLENBQVMsTUFBVDtBQUNIOztBQUNELFNBQUssR0FBTCxDQUFTLElBQVQ7QUFDSCxHQXRCRDs7QUF1QkEsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixjQUFwQixHQUFxQyxZQUFZO0FBQzdDLFdBQU8sSUFBSSxZQUFZLFdBQWhCLENBQXlCLElBQUksQ0FBQyxNQUFMLEtBQWdCLEtBQUssTUFBTCxDQUFZLEtBQXJELEVBQTRELElBQUksQ0FBQyxNQUFMLEtBQWdCLEtBQUssTUFBTCxDQUFZLE1BQXhGLENBQVA7QUFDSCxHQUZEOztBQUdBLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsYUFBcEIsR0FBb0MsVUFBVSxRQUFWLEVBQW9CO0FBQ3BELFFBQUksS0FBSyxnQkFBTCxDQUFzQixJQUExQixFQUFnQztBQUM1QixVQUFJLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsVUFBL0IsRUFBMkM7QUFDdkMsWUFBSSxRQUFRLENBQUMsSUFBVCxDQUFjLE1BQWQsRUFBc0IsQ0FBdEIsR0FBMEIsQ0FBOUIsRUFDSSxRQUFRLENBQUMsUUFBVCxDQUFrQixDQUFsQixJQUF1QixRQUFRLENBQUMsU0FBVCxFQUF2QixDQURKLEtBRUssSUFBSSxRQUFRLENBQUMsSUFBVCxDQUFjLE9BQWQsRUFBdUIsQ0FBdkIsR0FBMkIsS0FBSyxLQUFwQyxFQUNELFFBQVEsQ0FBQyxRQUFULENBQWtCLENBQWxCLElBQXVCLFFBQVEsQ0FBQyxTQUFULEVBQXZCO0FBQ0osWUFBSSxRQUFRLENBQUMsSUFBVCxDQUFjLEtBQWQsRUFBcUIsQ0FBckIsR0FBeUIsQ0FBN0IsRUFDSSxRQUFRLENBQUMsUUFBVCxDQUFrQixDQUFsQixJQUF1QixRQUFRLENBQUMsU0FBVCxFQUF2QixDQURKLEtBRUssSUFBSSxRQUFRLENBQUMsSUFBVCxDQUFjLFFBQWQsRUFBd0IsQ0FBeEIsR0FBNEIsS0FBSyxNQUFyQyxFQUNELFFBQVEsQ0FBQyxRQUFULENBQWtCLENBQWxCLElBQXVCLFFBQVEsQ0FBQyxTQUFULEVBQXZCO0FBQ1A7QUFDSjs7QUFDRCxXQUFPLElBQVA7QUFDSCxHQWREOztBQWVBLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsbUJBQXBCLEdBQTBDLFlBQVk7QUFDbEQsUUFBSSxLQUFLLGdCQUFMLENBQXNCLE9BQXRCLElBQWlDLE9BQVEsS0FBSyxnQkFBTCxDQUFzQixPQUE5QixLQUEyQyxRQUFoRixFQUEwRjtBQUN0RixVQUFJLElBQUksR0FBRyxLQUFLLE1BQUwsQ0FBWSxLQUFaLEdBQW9CLEtBQUssTUFBTCxDQUFZLE1BQWhDLEdBQXlDLElBQXBEO0FBQ0EsTUFBQSxJQUFJLElBQUksS0FBSyxVQUFMLEdBQWtCLENBQTFCO0FBQ0EsVUFBSSxnQkFBZ0IsR0FBRyxJQUFJLEdBQUcsS0FBSyxnQkFBTCxDQUFzQixNQUE3QixHQUFzQyxLQUFLLGdCQUFMLENBQXNCLE9BQW5GO0FBQ0EsVUFBSSxPQUFPLEdBQUcsZ0JBQWdCLEdBQUcsS0FBSyxTQUFMLENBQWUsTUFBaEQ7O0FBQ0EsVUFBSSxPQUFPLEdBQUcsQ0FBZCxFQUFpQjtBQUNiLGFBQUssZUFBTCxDQUFxQixPQUFyQjtBQUNILE9BRkQsTUFHSztBQUNELGFBQUssZUFBTCxDQUFxQixJQUFJLENBQUMsR0FBTCxDQUFTLE9BQVQsQ0FBckI7QUFDSDtBQUNKO0FBQ0osR0FiRDs7QUFjQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLGVBQXBCLEdBQXNDLFVBQVUsTUFBVixFQUFrQixRQUFsQixFQUE0QjtBQUM5RCxRQUFJLE1BQU0sS0FBSyxLQUFLLENBQXBCLEVBQXVCO0FBQUUsTUFBQSxNQUFNLEdBQUcsS0FBSyxnQkFBTCxDQUFzQixNQUEvQjtBQUF3Qzs7QUFDakUsUUFBSSxRQUFRLEtBQUssS0FBSyxDQUF0QixFQUF5QjtBQUFFLE1BQUEsUUFBUSxHQUFHLElBQVg7QUFBa0I7O0FBQzdDLFFBQUksQ0FBQyxLQUFLLGdCQUFWLEVBQ0ksTUFBTSxvRUFBTjtBQUNKLFFBQUksUUFBSjs7QUFDQSxTQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLE1BQXBCLEVBQTRCLENBQUMsRUFBN0IsRUFBaUM7QUFDN0IsTUFBQSxRQUFRLEdBQUcsSUFBSSxVQUFVLFdBQWQsQ0FBdUIsS0FBSyxnQkFBNUIsQ0FBWDs7QUFDQSxVQUFJLFFBQUosRUFBYztBQUNWLFFBQUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsUUFBckI7QUFDSCxPQUZELE1BR0s7QUFDRCxXQUFHO0FBQ0MsVUFBQSxRQUFRLENBQUMsV0FBVCxDQUFxQixLQUFLLGNBQUwsRUFBckI7QUFDSCxTQUZELFFBRVMsQ0FBQyxLQUFLLGFBQUwsQ0FBbUIsUUFBbkIsQ0FGVjtBQUdIOztBQUNELFdBQUssU0FBTCxDQUFlLElBQWYsQ0FBb0IsUUFBcEI7QUFDSDtBQUNKLEdBbEJEOztBQW1CQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLGVBQXBCLEdBQXNDLFVBQVUsTUFBVixFQUFrQjtBQUNwRCxRQUFJLE1BQU0sS0FBSyxLQUFLLENBQXBCLEVBQXVCO0FBQUUsTUFBQSxNQUFNLEdBQUcsSUFBVDtBQUFnQjs7QUFDekMsUUFBSSxDQUFDLE1BQUwsRUFBYTtBQUNULFdBQUssU0FBTCxHQUFpQixJQUFJLEtBQUosRUFBakI7QUFDSCxLQUZELE1BR0s7QUFDRCxXQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLENBQXRCLEVBQXlCLE1BQXpCO0FBQ0g7QUFDSixHQVJEOztBQVNBLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsZUFBcEIsR0FBc0MsWUFBWTtBQUM5QyxTQUFLLElBQUksRUFBRSxHQUFHLENBQVQsRUFBWSxFQUFFLEdBQUcsS0FBSyxTQUEzQixFQUFzQyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQTlDLEVBQXNELEVBQUUsRUFBeEQsRUFBNEQ7QUFDeEQsVUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUQsQ0FBakI7O0FBQ0EsVUFBSSxLQUFLLGdCQUFMLENBQXNCLElBQTFCLEVBQWdDO0FBQzVCLFFBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLEtBQXpDOztBQUNBLFlBQUksQ0FBQyxLQUFLLGdCQUFMLENBQXNCLElBQXRCLENBQTJCLFVBQWhDLEVBQTRDO0FBQ3hDLGNBQUksUUFBUSxDQUFDLElBQVQsQ0FBYyxPQUFkLEVBQXVCLENBQXZCLEdBQTJCLENBQS9CLEVBQWtDO0FBQzlCLFlBQUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsSUFBSSxZQUFZLFdBQWhCLENBQXlCLEtBQUssS0FBTCxHQUFhLFFBQVEsQ0FBQyxTQUFULEVBQXRDLEVBQTRELElBQUksQ0FBQyxNQUFMLEtBQWdCLEtBQUssTUFBakYsQ0FBckI7QUFDSCxXQUZELE1BR0ssSUFBSSxRQUFRLENBQUMsSUFBVCxDQUFjLE1BQWQsRUFBc0IsQ0FBdEIsR0FBMEIsS0FBSyxLQUFuQyxFQUEwQztBQUMzQyxZQUFBLFFBQVEsQ0FBQyxXQUFULENBQXFCLElBQUksWUFBWSxXQUFoQixDQUF5QixDQUFDLENBQUQsR0FBSyxRQUFRLENBQUMsU0FBVCxFQUE5QixFQUFvRCxJQUFJLENBQUMsTUFBTCxLQUFnQixLQUFLLE1BQXpFLENBQXJCO0FBQ0g7O0FBQ0QsY0FBSSxRQUFRLENBQUMsSUFBVCxDQUFjLFFBQWQsRUFBd0IsQ0FBeEIsR0FBNEIsQ0FBaEMsRUFBbUM7QUFDL0IsWUFBQSxRQUFRLENBQUMsV0FBVCxDQUFxQixJQUFJLFlBQVksV0FBaEIsQ0FBeUIsSUFBSSxDQUFDLE1BQUwsS0FBZ0IsS0FBSyxLQUE5QyxFQUFxRCxLQUFLLE1BQUwsR0FBYyxRQUFRLENBQUMsU0FBVCxFQUFuRSxDQUFyQjtBQUNILFdBRkQsTUFHSyxJQUFJLFFBQVEsQ0FBQyxJQUFULENBQWMsS0FBZCxFQUFxQixDQUFyQixHQUF5QixLQUFLLE1BQWxDLEVBQTBDO0FBQzNDLFlBQUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsSUFBSSxZQUFZLFdBQWhCLENBQXlCLElBQUksQ0FBQyxNQUFMLEtBQWdCLEtBQUssS0FBOUMsRUFBcUQsQ0FBQyxDQUFELEdBQUssUUFBUSxDQUFDLFNBQVQsRUFBMUQsQ0FBckI7QUFDSDtBQUNKOztBQUNELFlBQUksS0FBSyxnQkFBTCxDQUFzQixJQUF0QixDQUEyQixVQUEvQixFQUEyQztBQUN2QyxjQUFJLFFBQVEsQ0FBQyxJQUFULENBQWMsTUFBZCxFQUFzQixDQUF0QixHQUEwQixDQUExQixJQUErQixRQUFRLENBQUMsSUFBVCxDQUFjLE9BQWQsRUFBdUIsQ0FBdkIsR0FBMkIsS0FBSyxLQUFuRSxFQUEwRTtBQUN0RSxZQUFBLFFBQVEsQ0FBQyxRQUFULENBQWtCLElBQWxCLENBQXVCLElBQXZCLEVBQTZCLEtBQTdCO0FBQ0g7O0FBQ0QsY0FBSSxRQUFRLENBQUMsSUFBVCxDQUFjLEtBQWQsRUFBcUIsQ0FBckIsR0FBeUIsQ0FBekIsSUFBOEIsUUFBUSxDQUFDLElBQVQsQ0FBYyxRQUFkLEVBQXdCLENBQXhCLEdBQTRCLEtBQUssTUFBbkUsRUFBMkU7QUFDdkUsWUFBQSxRQUFRLENBQUMsUUFBVCxDQUFrQixJQUFsQixDQUF1QixLQUF2QixFQUE4QixJQUE5QjtBQUNIO0FBQ0o7QUFDSjs7QUFDRCxVQUFJLEtBQUssZ0JBQUwsQ0FBc0IsT0FBMUIsRUFBbUM7QUFDL0IsWUFBSSxLQUFLLGdCQUFMLENBQXNCLE9BQXRCLENBQThCLE9BQWxDLEVBQTJDO0FBQ3ZDLGNBQUksUUFBUSxDQUFDLE9BQVQsSUFBb0IsUUFBUSxDQUFDLGdCQUFULENBQTBCLEdBQWxELEVBQXVEO0FBQ25ELFlBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLFVBQTFCLEdBQXVDLEtBQXZDO0FBQ0gsV0FGRCxNQUdLLElBQUksUUFBUSxDQUFDLE9BQVQsSUFBb0IsUUFBUSxDQUFDLGdCQUFULENBQTBCLEdBQWxELEVBQXVEO0FBQ3hELFlBQUEsUUFBUSxDQUFDLGdCQUFULENBQTBCLFVBQTFCLEdBQXVDLElBQXZDO0FBQ0g7O0FBQ0QsVUFBQSxRQUFRLENBQUMsT0FBVCxJQUFvQixRQUFRLENBQUMsZ0JBQVQsQ0FBMEIsS0FBMUIsSUFBbUMsUUFBUSxDQUFDLGdCQUFULENBQTBCLFVBQTFCLEdBQXVDLENBQXZDLEdBQTJDLENBQUMsQ0FBL0UsQ0FBcEI7O0FBQ0EsY0FBSSxRQUFRLENBQUMsT0FBVCxHQUFtQixDQUF2QixFQUEwQjtBQUN0QixZQUFBLFFBQVEsQ0FBQyxPQUFULEdBQW1CLENBQW5CO0FBQ0g7QUFDSjs7QUFDRCxZQUFJLEtBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsQ0FBOEIsTUFBbEMsRUFBMEM7QUFDdEMsY0FBSSxRQUFRLENBQUMsTUFBVCxJQUFtQixRQUFRLENBQUMsZUFBVCxDQUF5QixHQUFoRCxFQUFxRDtBQUNqRCxZQUFBLFFBQVEsQ0FBQyxlQUFULENBQXlCLFVBQXpCLEdBQXNDLEtBQXRDO0FBQ0gsV0FGRCxNQUdLLElBQUksUUFBUSxDQUFDLE1BQVQsSUFBbUIsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsR0FBaEQsRUFBcUQ7QUFDdEQsWUFBQSxRQUFRLENBQUMsZUFBVCxDQUF5QixVQUF6QixHQUFzQyxJQUF0QztBQUNIOztBQUNELFVBQUEsUUFBUSxDQUFDLE1BQVQsSUFBbUIsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsS0FBekIsSUFBa0MsUUFBUSxDQUFDLGVBQVQsQ0FBeUIsVUFBekIsR0FBc0MsQ0FBdEMsR0FBMEMsQ0FBQyxDQUE3RSxDQUFuQjs7QUFDQSxjQUFJLFFBQVEsQ0FBQyxNQUFULEdBQWtCLENBQXRCLEVBQXlCO0FBQ3JCLFlBQUEsUUFBUSxDQUFDLE1BQVQsR0FBa0IsQ0FBbEI7QUFDSDtBQUNKO0FBQ0o7O0FBQ0QsVUFBSSxLQUFLLGdCQUFMLENBQXNCLE1BQTFCLEVBQWtDO0FBQzlCLFlBQUksS0FBSyxnQkFBTCxDQUFzQixNQUF0QixDQUE2QixLQUE3QixLQUF1QyxRQUF2QyxJQUFtRCxLQUFLLG1CQUFMLENBQXlCLEtBQTVFLElBQXFGLEtBQUssbUJBQUwsQ0FBeUIsS0FBekIsQ0FBK0IsTUFBeEgsRUFBZ0k7QUFDNUgsVUFBQSxRQUFRLENBQUMsTUFBVCxDQUFnQixLQUFLLEtBQXJCLEVBQTRCLEtBQUssbUJBQUwsQ0FBeUIsS0FBekIsQ0FBK0IsTUFBM0Q7QUFDSDtBQUNKO0FBQ0o7QUFDSixHQTVERDs7QUE2REEsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixhQUFwQixHQUFvQyxZQUFZO0FBQzVDLFNBQUssS0FBTDtBQUNBLFNBQUssZUFBTDs7QUFDQSxTQUFLLElBQUksRUFBRSxHQUFHLENBQVQsRUFBWSxFQUFFLEdBQUcsS0FBSyxTQUEzQixFQUFzQyxFQUFFLEdBQUcsRUFBRSxDQUFDLE1BQTlDLEVBQXNELEVBQUUsRUFBeEQsRUFBNEQ7QUFDeEQsVUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDLEVBQUQsQ0FBakI7QUFDQSxXQUFLLFlBQUwsQ0FBa0IsUUFBbEI7QUFDSDtBQUNKLEdBUEQ7O0FBUUEsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixtQkFBcEIsR0FBMEMsVUFBVSxRQUFWLEVBQW9CO0FBQzFELFFBQUksS0FBSyxLQUFMLEtBQWUsU0FBbkIsRUFBOEI7QUFDMUIsWUFBTSxpREFBTjtBQUNILEtBRkQsTUFHSztBQUNELFdBQUssZ0JBQUwsR0FBd0IsUUFBeEI7QUFDSDtBQUNKLEdBUEQ7O0FBUUEsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixzQkFBcEIsR0FBNkMsVUFBVSxRQUFWLEVBQW9CO0FBQzdELFFBQUksS0FBSyxLQUFMLEtBQWUsU0FBbkIsRUFBOEI7QUFDMUIsWUFBTSxpREFBTjtBQUNILEtBRkQsTUFHSztBQUNELFdBQUssbUJBQUwsR0FBMkIsUUFBM0I7QUFDSDtBQUNKLEdBUEQ7O0FBUUEsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixLQUFwQixHQUE0QixZQUFZO0FBQ3BDLFFBQUksS0FBSyxnQkFBTCxLQUEwQixJQUE5QixFQUNJLE1BQU0sK0RBQU47QUFDSixRQUFJLEtBQUssS0FBTCxLQUFlLFNBQW5CLEVBQ0ksTUFBTSw0QkFBTjtBQUNKLFNBQUssS0FBTCxHQUFhLFNBQWI7QUFDQSxTQUFLLFVBQUw7QUFDQSxTQUFLLElBQUw7QUFDSCxHQVJEOztBQVNBLEVBQUEsU0FBUyxDQUFDLFNBQVYsQ0FBb0IsS0FBcEIsR0FBNEIsWUFBWTtBQUNwQyxRQUFJLEtBQUssS0FBTCxLQUFlLFNBQW5CLEVBQThCO0FBQzFCLFlBQU0sd0JBQU47QUFDSDs7QUFDRCxTQUFLLEtBQUwsR0FBYSxRQUFiO0FBQ0EsU0FBSyxZQUFMLEdBQW9CLEtBQUssZ0JBQUwsQ0FBc0IsSUFBMUM7QUFDQSxTQUFLLGdCQUFMLENBQXNCLElBQXRCLEdBQTZCLEtBQTdCO0FBQ0gsR0FQRDs7QUFRQSxFQUFBLFNBQVMsQ0FBQyxTQUFWLENBQW9CLE1BQXBCLEdBQTZCLFlBQVk7QUFDckMsUUFBSSxLQUFLLEtBQUwsS0FBZSxTQUFuQixFQUE4QjtBQUMxQixZQUFNLHlCQUFOO0FBQ0g7O0FBQ0QsU0FBSyxLQUFMLEdBQWEsU0FBYjtBQUNBLFNBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsR0FBNkIsS0FBSyxZQUFsQztBQUNBLFNBQUssSUFBTDtBQUNILEdBUEQ7O0FBUUEsRUFBQSxTQUFTLENBQUMsU0FBVixDQUFvQixJQUFwQixHQUEyQixZQUFZO0FBQ25DLFNBQUssS0FBTCxHQUFhLFNBQWI7QUFDQSxTQUFLLFdBQUw7QUFDSCxHQUhEOztBQUlBLFNBQU8sU0FBUDtBQUNILENBbFpnQixFQUFqQjs7QUFtWkEsT0FBTyxXQUFQLEdBQWtCLFNBQWxCOzs7QUN6WkE7Ozs7QUFDQSxNQUFNLENBQUMsY0FBUCxDQUFzQixPQUF0QixFQUErQixZQUEvQixFQUE2QztBQUFFLEVBQUEsS0FBSyxFQUFFO0FBQVQsQ0FBN0M7O0FBQ0EsSUFBSSxNQUFNLEdBQUksWUFBWTtBQUN0QixXQUFTLE1BQVQsQ0FBZ0IsS0FBaEIsRUFBdUIsS0FBdkIsRUFBOEI7QUFDMUIsU0FBSyxLQUFMLEdBQWEsS0FBYjtBQUNBLFNBQUssS0FBTCxHQUFhLEtBQWI7QUFDSDs7QUFDRCxTQUFPLE1BQVA7QUFDSCxDQU5hLEVBQWQ7O0FBT0EsT0FBTyxXQUFQLEdBQWtCLE1BQWxCOzs7QUNUQTs7OztBQUNBLE1BQU0sQ0FBQyxjQUFQLENBQXNCLE9BQXRCLEVBQStCLFlBQS9CLEVBQTZDO0FBQUUsRUFBQSxLQUFLLEVBQUU7QUFBVCxDQUE3Qzs7QUFDQSxJQUFJLE1BQU0sR0FBSSxZQUFZO0FBQ3RCLFdBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQjtBQUNsQixTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsU0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNIOztBQUNELEVBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsSUFBakIsR0FBd0IsVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUNwQyxRQUFJLENBQUMsS0FBSyxLQUFLLENBQWYsRUFBa0I7QUFBRSxNQUFBLENBQUMsR0FBRyxJQUFKO0FBQVc7O0FBQy9CLFFBQUksQ0FBQyxLQUFLLEtBQUssQ0FBZixFQUFrQjtBQUFFLE1BQUEsQ0FBQyxHQUFHLElBQUo7QUFBVzs7QUFDL0IsUUFBSSxDQUFKLEVBQU87QUFDSCxXQUFLLENBQUwsSUFBVSxDQUFDLENBQVg7QUFDSDs7QUFDRCxRQUFJLENBQUosRUFBTztBQUNILFdBQUssQ0FBTCxJQUFVLENBQUMsQ0FBWDtBQUNIO0FBQ0osR0FURDs7QUFVQSxFQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQWpCLEdBQTZCLFlBQVk7QUFDckMsV0FBTyxJQUFJLENBQUMsSUFBTCxDQUFXLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBZixHQUFxQixLQUFLLENBQUwsR0FBUyxLQUFLLENBQTdDLENBQVA7QUFDSCxHQUZEOztBQUdBLEVBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsS0FBakIsR0FBeUIsWUFBWTtBQUNqQyxXQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUF2QixDQUFQO0FBQ0gsR0FGRDs7QUFHQSxTQUFPLE1BQVA7QUFDSCxDQXRCYSxFQUFkOztBQXVCQSxPQUFPLFdBQVAsR0FBa0IsTUFBbEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyAyMi4xLjMuMzEgQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXG52YXIgVU5TQ09QQUJMRVMgPSByZXF1aXJlKCcuL193a3MnKSgndW5zY29wYWJsZXMnKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuaWYgKEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdID09IHVuZGVmaW5lZCkgcmVxdWlyZSgnLi9faGlkZScpKEFycmF5UHJvdG8sIFVOU0NPUEFCTEVTLCB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgQXJyYXlQcm90b1tVTlNDT1BBQkxFU11ba2V5XSA9IHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbiAvLyBgQWR2YW5jZVN0cmluZ0luZGV4YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFkdmFuY2VzdHJpbmdpbmRleFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoUywgaW5kZXgsIHVuaWNvZGUpIHtcbiAgcmV0dXJuIGluZGV4ICsgKHVuaWNvZGUgPyBhdChTLCBpbmRleCkubGVuZ3RoIDogMSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCkge1xuICBpZiAoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbid1c2Ugc3RyaWN0JztcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmlsbCh2YWx1ZSAvKiAsIHN0YXJ0ID0gMCwgZW5kID0gQGxlbmd0aCAqLykge1xuICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgbGVuZ3RoKTtcbiAgdmFyIGVuZCA9IGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICB2YXIgZW5kUG9zID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0Fic29sdXRlSW5kZXgoZW5kLCBsZW5ndGgpO1xuICB3aGlsZSAoZW5kUG9zID4gaW5kZXgpIE9baW5kZXgrK10gPSB2YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyAwIC0+IEFycmF5I2ZvckVhY2hcbi8vIDEgLT4gQXJyYXkjbWFwXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxuLy8gMyAtPiBBcnJheSNzb21lXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XG4vLyA1IC0+IEFycmF5I2ZpbmRcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgYXNjID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRZUEUsICRjcmVhdGUpIHtcbiAgdmFyIElTX01BUCA9IFRZUEUgPT0gMTtcbiAgdmFyIElTX0ZJTFRFUiA9IFRZUEUgPT0gMjtcbiAgdmFyIElTX1NPTUUgPSBUWVBFID09IDM7XG4gIHZhciBJU19FVkVSWSA9IFRZUEUgPT0gNDtcbiAgdmFyIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDY7XG4gIHZhciBOT19IT0xFUyA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYO1xuICB2YXIgY3JlYXRlID0gJGNyZWF0ZSB8fCBhc2M7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQpIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgc2VsZiA9IElPYmplY3QoTyk7XG4gICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciByZXN1bHQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkO1xuICAgIHZhciB2YWwsIHJlcztcbiAgICBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpIHtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmIChUWVBFKSB7XG4gICAgICAgIGlmIChJU19NQVApIHJlc3VsdFtpbmRleF0gPSByZXM7ICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYgKHJlcykgc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmIChJU19FVkVSWSkgcmV0dXJuIGZhbHNlOyAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTtcbiIsInZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRoYXQsIGNhbGxiYWNrZm4sIGFMZW4sIG1lbW8sIGlzUmlnaHQpIHtcbiAgYUZ1bmN0aW9uKGNhbGxiYWNrZm4pO1xuICB2YXIgTyA9IHRvT2JqZWN0KHRoYXQpO1xuICB2YXIgc2VsZiA9IElPYmplY3QoTyk7XG4gIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gIHZhciBpbmRleCA9IGlzUmlnaHQgPyBsZW5ndGggLSAxIDogMDtcbiAgdmFyIGkgPSBpc1JpZ2h0ID8gLTEgOiAxO1xuICBpZiAoYUxlbiA8IDIpIGZvciAoOzspIHtcbiAgICBpZiAoaW5kZXggaW4gc2VsZikge1xuICAgICAgbWVtbyA9IHNlbGZbaW5kZXhdO1xuICAgICAgaW5kZXggKz0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgICBpbmRleCArPSBpO1xuICAgIGlmIChpc1JpZ2h0ID8gaW5kZXggPCAwIDogbGVuZ3RoIDw9IGluZGV4KSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcbiAgICB9XG4gIH1cbiAgZm9yICg7aXNSaWdodCA/IGluZGV4ID49IDAgOiBsZW5ndGggPiBpbmRleDsgaW5kZXggKz0gaSkgaWYgKGluZGV4IGluIHNlbGYpIHtcbiAgICBtZW1vID0gY2FsbGJhY2tmbihtZW1vLCBzZWxmW2luZGV4XSwgaW5kZXgsIE8pO1xuICB9XG4gIHJldHVybiBtZW1vO1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL19pcy1hcnJheScpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbCkge1xuICB2YXIgQztcbiAgaWYgKGlzQXJyYXkob3JpZ2luYWwpKSB7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYgKHR5cGVvZiBDID09ICdmdW5jdGlvbicgJiYgKEMgPT09IEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSkgQyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoaXNPYmplY3QoQykpIHtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYgKEMgPT09IG51bGwpIEMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59O1xuIiwiLy8gOS40LjIuMyBBcnJheVNwZWNpZXNDcmVhdGUob3JpZ2luYWxBcnJheSwgbGVuZ3RoKVxudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwsIGxlbmd0aCkge1xuICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWwpKShsZW5ndGgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBpbnZva2UgPSByZXF1aXJlKCcuL19pbnZva2UnKTtcbnZhciBhcnJheVNsaWNlID0gW10uc2xpY2U7XG52YXIgZmFjdG9yaWVzID0ge307XG5cbnZhciBjb25zdHJ1Y3QgPSBmdW5jdGlvbiAoRiwgbGVuLCBhcmdzKSB7XG4gIGlmICghKGxlbiBpbiBmYWN0b3JpZXMpKSB7XG4gICAgZm9yICh2YXIgbiA9IFtdLCBpID0gMDsgaSA8IGxlbjsgaSsrKSBuW2ldID0gJ2FbJyArIGkgKyAnXSc7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgZmFjdG9yaWVzW2xlbl0gPSBGdW5jdGlvbignRixhJywgJ3JldHVybiBuZXcgRignICsgbi5qb2luKCcsJykgKyAnKScpO1xuICB9IHJldHVybiBmYWN0b3JpZXNbbGVuXShGLCBhcmdzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb24uYmluZCB8fCBmdW5jdGlvbiBiaW5kKHRoYXQgLyogLCAuLi5hcmdzICovKSB7XG4gIHZhciBmbiA9IGFGdW5jdGlvbih0aGlzKTtcbiAgdmFyIHBhcnRBcmdzID0gYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBib3VuZCA9IGZ1bmN0aW9uICgvKiBhcmdzLi4uICovKSB7XG4gICAgdmFyIGFyZ3MgPSBwYXJ0QXJncy5jb25jYXQoYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgYm91bmQgPyBjb25zdHJ1Y3QoZm4sIGFyZ3MubGVuZ3RoLCBhcmdzKSA6IGludm9rZShmbiwgYXJncywgdGhhdCk7XG4gIH07XG4gIGlmIChpc09iamVjdChmbi5wcm90b3R5cGUpKSBib3VuZC5wcm90b3R5cGUgPSBmbi5wcm90b3R5cGU7XG4gIHJldHVybiBib3VuZDtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgJGl0ZXJEZWZpbmUgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpO1xudmFyIHN0ZXAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKTtcbnZhciBzZXRTcGVjaWVzID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFzdEtleSA9IHJlcXVpcmUoJy4vX21ldGEnKS5mYXN0S2V5O1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIFNJWkUgPSBERVNDUklQVE9SUyA/ICdfcycgOiAnc2l6ZSc7XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uICh0aGF0LCBrZXkpIHtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KTtcbiAgdmFyIGVudHJ5O1xuICBpZiAoaW5kZXggIT09ICdGJykgcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yIChlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pIHtcbiAgICBpZiAoZW50cnkuayA9PSBrZXkpIHJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbiAod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUikge1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll90ID0gTkFNRTsgICAgICAgICAvLyBjb2xsZWN0aW9uIHR5cGVcbiAgICAgIHRoYXQuX2kgPSBjcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgLy8gbGFzdCBlbnRyeVxuICAgICAgdGhhdFtTSVpFXSA9IDA7ICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICBmb3IgKHZhciB0aGF0ID0gdmFsaWRhdGUodGhpcywgTkFNRSksIGRhdGEgPSB0aGF0Ll9pLCBlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pIHtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZW50cnkucCkgZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0Ll9mID0gdGhhdC5fbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdGhhdCA9IHZhbGlkYXRlKHRoaXMsIE5BTUUpO1xuICAgICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm47XG4gICAgICAgICAgdmFyIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0Ll9pW2VudHJ5LmldO1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmIChwcmV2KSBwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmIChuZXh0KSBuZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmICh0aGF0Ll9mID09IGVudHJ5KSB0aGF0Ll9mID0gbmV4dDtcbiAgICAgICAgICBpZiAodGhhdC5fbCA9PSBlbnRyeSkgdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyogLCB0aGF0ID0gdW5kZWZpbmVkICovKSB7XG4gICAgICAgIHZhbGlkYXRlKHRoaXMsIE5BTUUpO1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMyk7XG4gICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgd2hpbGUgKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZikge1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnIpIGVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHZhbGlkYXRlKHRoaXMsIE5BTUUpLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChERVNDUklQVE9SUykgZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZSh0aGlzLCBOQU1FKVtTSVpFXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbiAodGhhdCwga2V5LCB2YWx1ZSkge1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgdmFyIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmIChlbnRyeSkge1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5fbCA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXQuX2wsICAgICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYgKCF0aGF0Ll9mKSB0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZiAocHJldikgcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmIChpbmRleCAhPT0gJ0YnKSB0aGF0Ll9pW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbiAoQywgTkFNRSwgSVNfTUFQKSB7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICAgICAgdGhpcy5fdCA9IHZhbGlkYXRlKGl0ZXJhdGVkLCBOQU1FKTsgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAgICAgICAgICAgICAgICAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHZhciBraW5kID0gdGhhdC5faztcbiAgICAgIHZhciBlbnRyeSA9IHRoYXQuX2w7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yKSBlbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYgKCF0aGF0Ll90IHx8ICEodGhhdC5fbCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhhdC5fdC5fZikpIHtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiBzdGVwKDAsIGVudHJ5LnYpO1xuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJywgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIG1ldGEgPSByZXF1aXJlKCcuL19tZXRhJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciAkaXRlckRldGVjdCA9IHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0Jyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGluaGVyaXRJZlJlcXVpcmVkID0gcmVxdWlyZSgnLi9faW5oZXJpdC1pZi1yZXF1aXJlZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChOQU1FLCB3cmFwcGVyLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgSVNfV0VBSykge1xuICB2YXIgQmFzZSA9IGdsb2JhbFtOQU1FXTtcbiAgdmFyIEMgPSBCYXNlO1xuICB2YXIgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnO1xuICB2YXIgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlO1xuICB2YXIgTyA9IHt9O1xuICB2YXIgZml4TWV0aG9kID0gZnVuY3Rpb24gKEtFWSkge1xuICAgIHZhciBmbiA9IHByb3RvW0tFWV07XG4gICAgcmVkZWZpbmUocHJvdG8sIEtFWSxcbiAgICAgIEtFWSA9PSAnZGVsZXRlJyA/IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChhKSA/IGZhbHNlIDogZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpO1xuICAgICAgfSA6IEtFWSA9PSAnaGFzJyA/IGZ1bmN0aW9uIGhhcyhhKSB7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChhKSA/IGZhbHNlIDogZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpO1xuICAgICAgfSA6IEtFWSA9PSAnZ2V0JyA/IGZ1bmN0aW9uIGdldChhKSB7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChhKSA/IHVuZGVmaW5lZCA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2FkZCcgPyBmdW5jdGlvbiBhZGQoYSkgeyBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7IHJldHVybiB0aGlzOyB9XG4gICAgICAgIDogZnVuY3Rpb24gc2V0KGEsIGIpIHsgZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEsIGIpOyByZXR1cm4gdGhpczsgfVxuICAgICk7XG4gIH07XG4gIGlmICh0eXBlb2YgQyAhPSAnZnVuY3Rpb24nIHx8ICEoSVNfV0VBSyB8fCBwcm90by5mb3JFYWNoICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgbmV3IEMoKS5lbnRyaWVzKCkubmV4dCgpO1xuICB9KSkpIHtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICAgIG1ldGEuTkVFRCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IEMoKTtcbiAgICAvLyBlYXJseSBpbXBsZW1lbnRhdGlvbnMgbm90IHN1cHBvcnRzIGNoYWluaW5nXG4gICAgdmFyIEhBU05UX0NIQUlOSU5HID0gaW5zdGFuY2VbQURERVJdKElTX1dFQUsgPyB7fSA6IC0wLCAxKSAhPSBpbnN0YW5jZTtcbiAgICAvLyBWOCB+ICBDaHJvbWl1bSA0MC0gd2Vhay1jb2xsZWN0aW9ucyB0aHJvd3Mgb24gcHJpbWl0aXZlcywgYnV0IHNob3VsZCByZXR1cm4gZmFsc2VcbiAgICB2YXIgVEhST1dTX09OX1BSSU1JVElWRVMgPSBmYWlscyhmdW5jdGlvbiAoKSB7IGluc3RhbmNlLmhhcygxKTsgfSk7XG4gICAgLy8gbW9zdCBlYXJseSBpbXBsZW1lbnRhdGlvbnMgZG9lc24ndCBzdXBwb3J0cyBpdGVyYWJsZXMsIG1vc3QgbW9kZXJuIC0gbm90IGNsb3NlIGl0IGNvcnJlY3RseVxuICAgIHZhciBBQ0NFUFRfSVRFUkFCTEVTID0gJGl0ZXJEZXRlY3QoZnVuY3Rpb24gKGl0ZXIpIHsgbmV3IEMoaXRlcik7IH0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIC8vIGZvciBlYXJseSBpbXBsZW1lbnRhdGlvbnMgLTAgYW5kICswIG5vdCB0aGUgc2FtZVxuICAgIHZhciBCVUdHWV9aRVJPID0gIUlTX1dFQUsgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVjggfiBDaHJvbWl1bSA0Mi0gZmFpbHMgb25seSB3aXRoIDUrIGVsZW1lbnRzXG4gICAgICB2YXIgJGluc3RhbmNlID0gbmV3IEMoKTtcbiAgICAgIHZhciBpbmRleCA9IDU7XG4gICAgICB3aGlsZSAoaW5kZXgtLSkgJGluc3RhbmNlW0FEREVSXShpbmRleCwgaW5kZXgpO1xuICAgICAgcmV0dXJuICEkaW5zdGFuY2UuaGFzKC0wKTtcbiAgICB9KTtcbiAgICBpZiAoIUFDQ0VQVF9JVEVSQUJMRVMpIHtcbiAgICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uICh0YXJnZXQsIGl0ZXJhYmxlKSB7XG4gICAgICAgIGFuSW5zdGFuY2UodGFyZ2V0LCBDLCBOQU1FKTtcbiAgICAgICAgdmFyIHRoYXQgPSBpbmhlcml0SWZSZXF1aXJlZChuZXcgQmFzZSgpLCB0YXJnZXQsIEMpO1xuICAgICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgfSk7XG4gICAgICBDLnByb3RvdHlwZSA9IHByb3RvO1xuICAgICAgcHJvdG8uY29uc3RydWN0b3IgPSBDO1xuICAgIH1cbiAgICBpZiAoVEhST1dTX09OX1BSSU1JVElWRVMgfHwgQlVHR1lfWkVSTykge1xuICAgICAgZml4TWV0aG9kKCdkZWxldGUnKTtcbiAgICAgIGZpeE1ldGhvZCgnaGFzJyk7XG4gICAgICBJU19NQVAgJiYgZml4TWV0aG9kKCdnZXQnKTtcbiAgICB9XG4gICAgaWYgKEJVR0dZX1pFUk8gfHwgSEFTTlRfQ0hBSU5JTkcpIGZpeE1ldGhvZChBRERFUik7XG4gICAgLy8gd2VhayBjb2xsZWN0aW9ucyBzaG91bGQgbm90IGNvbnRhaW5zIC5jbGVhciBtZXRob2RcbiAgICBpZiAoSVNfV0VBSyAmJiBwcm90by5jbGVhcikgZGVsZXRlIHByb3RvLmNsZWFyO1xuICB9XG5cbiAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogKEMgIT0gQmFzZSksIE8pO1xuXG4gIGlmICghSVNfV0VBSykgY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjYuNScgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgcmVzdWx0ID0gZ2V0S2V5cyhpdCk7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICBpZiAoZ2V0U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gZ2V0U3ltYm9scyhpdCk7XG4gICAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChzeW1ib2xzLmxlbmd0aCA+IGkpIGlmIChpc0VudW0uY2FsbChpdCwga2V5ID0gc3ltYm9sc1tpKytdKSkgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsInZhciBNQVRDSCA9IHJlcXVpcmUoJy4vX3drcycpKCdtYXRjaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZKSB7XG4gIHZhciByZSA9IC8uLztcbiAgdHJ5IHtcbiAgICAnLy4vJ1tLRVldKHJlKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRyeSB7XG4gICAgICByZVtNQVRDSF0gPSBmYWxzZTtcbiAgICAgIHJldHVybiAhJy8uLydbS0VZXShyZSk7XG4gICAgfSBjYXRjaCAoZikgeyAvKiBlbXB0eSAqLyB9XG4gIH0gcmV0dXJuIHRydWU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xucmVxdWlyZSgnLi9lczYucmVnZXhwLmV4ZWMnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciByZWdleHBFeGVjID0gcmVxdWlyZSgnLi9fcmVnZXhwLWV4ZWMnKTtcblxudmFyIFNQRUNJRVMgPSB3a3MoJ3NwZWNpZXMnKTtcblxudmFyIFJFUExBQ0VfU1VQUE9SVFNfTkFNRURfR1JPVVBTID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gI3JlcGxhY2UgbmVlZHMgYnVpbHQtaW4gc3VwcG9ydCBmb3IgbmFtZWQgZ3JvdXBzLlxuICAvLyAjbWF0Y2ggd29ya3MgZmluZSBiZWNhdXNlIGl0IGp1c3QgcmV0dXJuIHRoZSBleGVjIHJlc3VsdHMsIGV2ZW4gaWYgaXQgaGFzXG4gIC8vIGEgXCJncm9wc1wiIHByb3BlcnR5LlxuICB2YXIgcmUgPSAvLi87XG4gIHJlLmV4ZWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHJlc3VsdC5ncm91cHMgPSB7IGE6ICc3JyB9O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHJldHVybiAnJy5yZXBsYWNlKHJlLCAnJDxhPicpICE9PSAnNyc7XG59KTtcblxudmFyIFNQTElUX1dPUktTX1dJVEhfT1ZFUldSSVRURU5fRVhFQyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIENocm9tZSA1MSBoYXMgYSBidWdneSBcInNwbGl0XCIgaW1wbGVtZW50YXRpb24gd2hlbiBSZWdFeHAjZXhlYyAhPT0gbmF0aXZlRXhlY1xuICB2YXIgcmUgPSAvKD86KS87XG4gIHZhciBvcmlnaW5hbEV4ZWMgPSByZS5leGVjO1xuICByZS5leGVjID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gb3JpZ2luYWxFeGVjLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gIHZhciByZXN1bHQgPSAnYWInLnNwbGl0KHJlKTtcbiAgcmV0dXJuIHJlc3VsdC5sZW5ndGggPT09IDIgJiYgcmVzdWx0WzBdID09PSAnYScgJiYgcmVzdWx0WzFdID09PSAnYic7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVksIGxlbmd0aCwgZXhlYykge1xuICB2YXIgU1lNQk9MID0gd2tzKEtFWSk7XG5cbiAgdmFyIERFTEVHQVRFU19UT19TWU1CT0wgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIFN0cmluZyBtZXRob2RzIGNhbGwgc3ltYm9sLW5hbWVkIFJlZ0VwIG1ldGhvZHNcbiAgICB2YXIgTyA9IHt9O1xuICAgIE9bU1lNQk9MXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH07XG4gICAgcmV0dXJuICcnW0tFWV0oTykgIT0gNztcbiAgfSk7XG5cbiAgdmFyIERFTEVHQVRFU19UT19FWEVDID0gREVMRUdBVEVTX1RPX1NZTUJPTCA/ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gU3ltYm9sLW5hbWVkIFJlZ0V4cCBtZXRob2RzIGNhbGwgLmV4ZWNcbiAgICB2YXIgZXhlY0NhbGxlZCA9IGZhbHNlO1xuICAgIHZhciByZSA9IC9hLztcbiAgICByZS5leGVjID0gZnVuY3Rpb24gKCkgeyBleGVjQ2FsbGVkID0gdHJ1ZTsgcmV0dXJuIG51bGw7IH07XG4gICAgaWYgKEtFWSA9PT0gJ3NwbGl0Jykge1xuICAgICAgLy8gUmVnRXhwW0BAc3BsaXRdIGRvZXNuJ3QgY2FsbCB0aGUgcmVnZXgncyBleGVjIG1ldGhvZCwgYnV0IGZpcnN0IGNyZWF0ZXNcbiAgICAgIC8vIGEgbmV3IG9uZS4gV2UgbmVlZCB0byByZXR1cm4gdGhlIHBhdGNoZWQgcmVnZXggd2hlbiBjcmVhdGluZyB0aGUgbmV3IG9uZS5cbiAgICAgIHJlLmNvbnN0cnVjdG9yID0ge307XG4gICAgICByZS5jb25zdHJ1Y3RvcltTUEVDSUVTXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlOyB9O1xuICAgIH1cbiAgICByZVtTWU1CT0xdKCcnKTtcbiAgICByZXR1cm4gIWV4ZWNDYWxsZWQ7XG4gIH0pIDogdW5kZWZpbmVkO1xuXG4gIGlmIChcbiAgICAhREVMRUdBVEVTX1RPX1NZTUJPTCB8fFxuICAgICFERUxFR0FURVNfVE9fRVhFQyB8fFxuICAgIChLRVkgPT09ICdyZXBsYWNlJyAmJiAhUkVQTEFDRV9TVVBQT1JUU19OQU1FRF9HUk9VUFMpIHx8XG4gICAgKEtFWSA9PT0gJ3NwbGl0JyAmJiAhU1BMSVRfV09SS1NfV0lUSF9PVkVSV1JJVFRFTl9FWEVDKVxuICApIHtcbiAgICB2YXIgbmF0aXZlUmVnRXhwTWV0aG9kID0gLy4vW1NZTUJPTF07XG4gICAgdmFyIGZucyA9IGV4ZWMoXG4gICAgICBkZWZpbmVkLFxuICAgICAgU1lNQk9MLFxuICAgICAgJydbS0VZXSxcbiAgICAgIGZ1bmN0aW9uIG1heWJlQ2FsbE5hdGl2ZShuYXRpdmVNZXRob2QsIHJlZ2V4cCwgc3RyLCBhcmcyLCBmb3JjZVN0cmluZ01ldGhvZCkge1xuICAgICAgICBpZiAocmVnZXhwLmV4ZWMgPT09IHJlZ2V4cEV4ZWMpIHtcbiAgICAgICAgICBpZiAoREVMRUdBVEVTX1RPX1NZTUJPTCAmJiAhZm9yY2VTdHJpbmdNZXRob2QpIHtcbiAgICAgICAgICAgIC8vIFRoZSBuYXRpdmUgU3RyaW5nIG1ldGhvZCBhbHJlYWR5IGRlbGVnYXRlcyB0byBAQG1ldGhvZCAodGhpc1xuICAgICAgICAgICAgLy8gcG9seWZpbGxlZCBmdW5jdGlvbiksIGxlYXNpbmcgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgICAgICAgICAgLy8gV2UgYXZvaWQgaXQgYnkgZGlyZWN0bHkgY2FsbGluZyB0aGUgbmF0aXZlIEBAbWV0aG9kIG1ldGhvZC5cbiAgICAgICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiBuYXRpdmVSZWdFeHBNZXRob2QuY2FsbChyZWdleHAsIHN0ciwgYXJnMikgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IG5hdGl2ZU1ldGhvZC5jYWxsKHN0ciwgcmVnZXhwLCBhcmcyKSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlIH07XG4gICAgICB9XG4gICAgKTtcbiAgICB2YXIgc3RyZm4gPSBmbnNbMF07XG4gICAgdmFyIHJ4Zm4gPSBmbnNbMV07XG5cbiAgICByZWRlZmluZShTdHJpbmcucHJvdG90eXBlLCBLRVksIHN0cmZuKTtcbiAgICBoaWRlKFJlZ0V4cC5wcm90b3R5cGUsIFNZTUJPTCwgbGVuZ3RoID09IDJcbiAgICAgIC8vIDIxLjIuNS44IFJlZ0V4cC5wcm90b3R5cGVbQEByZXBsYWNlXShzdHJpbmcsIHJlcGxhY2VWYWx1ZSlcbiAgICAgIC8vIDIxLjIuNS4xMSBSZWdFeHAucHJvdG90eXBlW0BAc3BsaXRdKHN0cmluZywgbGltaXQpXG4gICAgICA/IGZ1bmN0aW9uIChzdHJpbmcsIGFyZykgeyByZXR1cm4gcnhmbi5jYWxsKHN0cmluZywgdGhpcywgYXJnKTsgfVxuICAgICAgLy8gMjEuMi41LjYgUmVnRXhwLnByb3RvdHlwZVtAQG1hdGNoXShzdHJpbmcpXG4gICAgICAvLyAyMS4yLjUuOSBSZWdFeHAucHJvdG90eXBlW0BAc2VhcmNoXShzdHJpbmcpXG4gICAgICA6IGZ1bmN0aW9uIChzdHJpbmcpIHsgcmV0dXJuIHJ4Zm4uY2FsbChzdHJpbmcsIHRoaXMpOyB9XG4gICAgKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDIxLjIuNS4zIGdldCBSZWdFeHAucHJvdG90eXBlLmZsYWdzXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdGhhdCA9IGFuT2JqZWN0KHRoaXMpO1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIGlmICh0aGF0Lmdsb2JhbCkgcmVzdWx0ICs9ICdnJztcbiAgaWYgKHRoYXQuaWdub3JlQ2FzZSkgcmVzdWx0ICs9ICdpJztcbiAgaWYgKHRoYXQubXVsdGlsaW5lKSByZXN1bHQgKz0gJ20nO1xuICBpZiAodGhhdC51bmljb2RlKSByZXN1bHQgKz0gJ3UnO1xuICBpZiAodGhhdC5zdGlja3kpIHJlc3VsdCArPSAneSc7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBCUkVBSyA9IHt9O1xudmFyIFJFVFVSTiA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKSB7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKTtcbiAgdmFyIGYgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSk7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmICh0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYgKGlzQXJyYXlJdGVyKGl0ZXJGbikpIGZvciAobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7KSB7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ25hdGl2ZS1mdW5jdGlvbi10by1zdHJpbmcnLCBGdW5jdGlvbi50b1N0cmluZyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRoYXQsIHRhcmdldCwgQykge1xuICB2YXIgUyA9IHRhcmdldC5jb25zdHJ1Y3RvcjtcbiAgdmFyIFA7XG4gIGlmIChTICE9PSBDICYmIHR5cGVvZiBTID09ICdmdW5jdGlvbicgJiYgKFAgPSBTLnByb3RvdHlwZSkgIT09IEMucHJvdG90eXBlICYmIGlzT2JqZWN0KFApICYmIHNldFByb3RvdHlwZU9mKSB7XG4gICAgc2V0UHJvdG90eXBlT2YodGhhdCwgUCk7XG4gIH0gcmV0dXJuIHRoYXQ7XG59O1xuIiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgYXJncywgdGhhdCkge1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgfSByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJncyk7XG59O1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIi8vIDcuMi44IElzUmVnRXhwKGFyZ3VtZW50KVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgTUFUQ0ggPSByZXF1aXJlKCcuL193a3MnKSgnbWF0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBpc1JlZ0V4cDtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiAoKGlzUmVnRXhwID0gaXRbTUFUQ0hdKSAhPT0gdW5kZWZpbmVkID8gISFpc1JlZ0V4cCA6IGNvZihpdCkgPT0gJ1JlZ0V4cCcpO1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRvbmUsIHZhbHVlKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCJ2YXIgTUVUQSA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBzZXREZXNjID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBpZCA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBpc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcbnZhciBzZXRNZXRhID0gZnVuY3Rpb24gKGl0KSB7XG4gIHNldERlc2MoaXQsIE1FVEEsIHsgdmFsdWU6IHtcbiAgICBpOiAnTycgKyArK2lkLCAvLyBvYmplY3QgSURcbiAgICB3OiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IH0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYgKCFoYXMoaXQsIE1FVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICBpZiAoIWhhcyhpdCwgTUVUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSkgc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6IE1FVEEsXG4gIE5FRUQ6IGZhbHNlLFxuICBmYXN0S2V5OiBmYXN0S2V5LFxuICBnZXRXZWFrOiBnZXRXZWFrLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgbWFjcm90YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldDtcbnZhciBPYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBQcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG52YXIgaXNOb2RlID0gcmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGhlYWQsIGxhc3QsIG5vdGlmeTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhcmVudCwgZm47XG4gICAgaWYgKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKSBwYXJlbnQuZXhpdCgpO1xuICAgIHdoaWxlIChoZWFkKSB7XG4gICAgICBmbiA9IGhlYWQuZm47XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGhlYWQpIG5vdGlmeSgpO1xuICAgICAgICBlbHNlIGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgIGlmIChwYXJlbnQpIHBhcmVudC5lbnRlcigpO1xuICB9O1xuXG4gIC8vIE5vZGUuanNcbiAgaWYgKGlzTm9kZSkge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIC8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlciwgZXhjZXB0IGlPUyBTYWZhcmkgLSBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMzM5XG4gIH0gZWxzZSBpZiAoT2JzZXJ2ZXIgJiYgIShnbG9iYWwubmF2aWdhdG9yICYmIGdsb2JhbC5uYXZpZ2F0b3Iuc3RhbmRhbG9uZSkpIHtcbiAgICB2YXIgdG9nZ2xlID0gdHJ1ZTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9ICF0b2dnbGU7XG4gICAgfTtcbiAgLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2VcbiAgfSBlbHNlIGlmIChQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSkge1xuICAgIC8vIFByb21pc2UucmVzb2x2ZSB3aXRob3V0IGFuIGFyZ3VtZW50IHRocm93cyBhbiBlcnJvciBpbiBMRyBXZWJPUyAyXG4gICAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodW5kZWZpbmVkKTtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9taXNlLnRoZW4oZmx1c2gpO1xuICAgIH07XG4gIC8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4gIC8vIC0gc2V0SW1tZWRpYXRlXG4gIC8vIC0gTWVzc2FnZUNoYW5uZWxcbiAgLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuICAvLyAtIG9ucmVhZHlzdGF0ZWNoYW5nZVxuICAvLyAtIHNldFRpbWVvdXRcbiAgfSBlbHNlIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgICBtYWNyb3Rhc2suY2FsbChnbG9iYWwsIGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgIHZhciB0YXNrID0geyBmbjogZm4sIG5leHQ6IHVuZGVmaW5lZCB9O1xuICAgIGlmIChsYXN0KSBsYXN0Lm5leHQgPSB0YXNrO1xuICAgIGlmICghaGVhZCkge1xuICAgICAgaGVhZCA9IHRhc2s7XG4gICAgICBub3RpZnkoKTtcbiAgICB9IGxhc3QgPSB0YXNrO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDI1LjQuMS41IE5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xuXG5mdW5jdGlvbiBQcm9taXNlQ2FwYWJpbGl0eShDKSB7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uICgkJHJlc29sdmUsICQkcmVqZWN0KSB7XG4gICAgaWYgKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSk7XG4gIHRoaXMucmVqZWN0ID0gYUZ1bmN0aW9uKHJlamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiAoQykge1xuICByZXR1cm4gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpO1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDE5LjEuMi4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UsIC4uLilcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyICRhc3NpZ24gPSBPYmplY3QuYXNzaWduO1xuXG4vLyBzaG91bGQgd29yayB3aXRoIHN5bWJvbHMgYW5kIHNob3VsZCBoYXZlIGRldGVybWluaXN0aWMgcHJvcGVydHkgb3JkZXIgKFY4IGJ1Zylcbm1vZHVsZS5leHBvcnRzID0gISRhc3NpZ24gfHwgcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICB2YXIgUyA9IFN5bWJvbCgpO1xuICB2YXIgSyA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbU10gPSA3O1xuICBLLnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChrKSB7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXG4gIHZhciBUID0gdG9PYmplY3QodGFyZ2V0KTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICB3aGlsZSAoYUxlbiA+IGluZGV4KSB7XG4gICAgdmFyIFMgPSBJT2JqZWN0KGFyZ3VtZW50c1tpbmRleCsrXSk7XG4gICAgdmFyIGtleXMgPSBnZXRTeW1ib2xzID8gZ2V0S2V5cyhTKS5jb25jYXQoZ2V0U3ltYm9scyhTKSkgOiBnZXRLZXlzKFMpO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaiA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaikgaWYgKGlzRW51bS5jYWxsKFMsIGtleSA9IGtleXNbaisrXSkpIFRba2V5XSA9IFNba2V5XTtcbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduO1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgZ09QRCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApIHtcbiAgTyA9IHRvSU9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoaGFzKE8sIFApKSByZXR1cm4gY3JlYXRlRGVzYyghcElFLmYuY2FsbChPLCBQKSwgT1tQXSk7XG59O1xuIiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBnT1BOID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mO1xudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgd2luZG93ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xuXG52YXIgZ2V0V2luZG93TmFtZXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ09QTihpdCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nID8gZ2V0V2luZG93TmFtZXMoaXQpIDogZ09QTih0b0lPYmplY3QoaXQpKTtcbn07XG4iLCIvLyAxOS4xLjIuNyAvIDE1LjIuMy40IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJykuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTykge1xuICByZXR1cm4gJGtleXMoTywgaGlkZGVuS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVksIGV4ZWMpIHtcbiAgdmFyIGZuID0gKGNvcmUuT2JqZWN0IHx8IHt9KVtLRVldIHx8IE9iamVjdFtLRVldO1xuICB2YXIgZXhwID0ge307XG4gIGV4cFtLRVldID0gZXhlYyhmbik7XG4gICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24gKCkgeyBmbigxKTsgfSksICdPYmplY3QnLCBleHApO1xufTtcbiIsInZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgaXNFbnVtID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpc0VudHJpZXMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChpdCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KGl0KTtcbiAgICB2YXIga2V5cyA9IGdldEtleXMoTyk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAobGVuZ3RoID4gaSkgaWYgKGlzRW51bS5jYWxsKE8sIGtleSA9IGtleXNbaSsrXSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKGlzRW50cmllcyA/IFtrZXksIE9ba2V5XV0gOiBPW2tleV0pO1xuICAgIH0gcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHsgZTogZmFsc2UsIHY6IGV4ZWMoKSB9O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgZTogdHJ1ZSwgdjogZSB9O1xuICB9XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQywgeCkge1xuICBhbk9iamVjdChDKTtcbiAgaWYgKGlzT2JqZWN0KHgpICYmIHguY29uc3RydWN0b3IgPT09IEMpIHJldHVybiB4O1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKEMpO1xuICB2YXIgcmVzb2x2ZSA9IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmU7XG4gIHJlc29sdmUoeCk7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIHNhZmUpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldLCBzYWZlKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgJHRvU3RyaW5nID0gcmVxdWlyZSgnLi9fZnVuY3Rpb24tdG8tc3RyaW5nJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBUUEwgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWwsIHNhZmUpIHtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmIChPW2tleV0gPT09IHZhbCkgcmV0dXJuO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoIXNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKE9ba2V5XSkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBidWlsdGluRXhlYyA9IFJlZ0V4cC5wcm90b3R5cGUuZXhlYztcblxuIC8vIGBSZWdFeHBFeGVjYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cGV4ZWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFIsIFMpIHtcbiAgdmFyIGV4ZWMgPSBSLmV4ZWM7XG4gIGlmICh0eXBlb2YgZXhlYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciByZXN1bHQgPSBleGVjLmNhbGwoUiwgUyk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWdFeHAgZXhlYyBtZXRob2QgcmV0dXJuZWQgc29tZXRoaW5nIG90aGVyIHRoYW4gYW4gT2JqZWN0IG9yIG51bGwnKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoY2xhc3NvZihSKSAhPT0gJ1JlZ0V4cCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWdFeHAjZXhlYyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG4gIH1cbiAgcmV0dXJuIGJ1aWx0aW5FeGVjLmNhbGwoUiwgUyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVnZXhwRmxhZ3MgPSByZXF1aXJlKCcuL19mbGFncycpO1xuXG52YXIgbmF0aXZlRXhlYyA9IFJlZ0V4cC5wcm90b3R5cGUuZXhlYztcbi8vIFRoaXMgYWx3YXlzIHJlZmVycyB0byB0aGUgbmF0aXZlIGltcGxlbWVudGF0aW9uLCBiZWNhdXNlIHRoZVxuLy8gU3RyaW5nI3JlcGxhY2UgcG9seWZpbGwgdXNlcyAuL2ZpeC1yZWdleHAtd2VsbC1rbm93bi1zeW1ib2wtbG9naWMuanMsXG4vLyB3aGljaCBsb2FkcyB0aGlzIGZpbGUgYmVmb3JlIHBhdGNoaW5nIHRoZSBtZXRob2QuXG52YXIgbmF0aXZlUmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcblxudmFyIHBhdGNoZWRFeGVjID0gbmF0aXZlRXhlYztcblxudmFyIExBU1RfSU5ERVggPSAnbGFzdEluZGV4JztcblxudmFyIFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciByZTEgPSAvYS8sXG4gICAgICByZTIgPSAvYiovZztcbiAgbmF0aXZlRXhlYy5jYWxsKHJlMSwgJ2EnKTtcbiAgbmF0aXZlRXhlYy5jYWxsKHJlMiwgJ2EnKTtcbiAgcmV0dXJuIHJlMVtMQVNUX0lOREVYXSAhPT0gMCB8fCByZTJbTEFTVF9JTkRFWF0gIT09IDA7XG59KSgpO1xuXG4vLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cCwgY29waWVkIGZyb20gZXM1LXNoaW0ncyBTdHJpbmcjc3BsaXQgcGF0Y2guXG52YXIgTlBDR19JTkNMVURFRCA9IC8oKT8/Ly5leGVjKCcnKVsxXSAhPT0gdW5kZWZpbmVkO1xuXG52YXIgUEFUQ0ggPSBVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgfHwgTlBDR19JTkNMVURFRDtcblxuaWYgKFBBVENIKSB7XG4gIHBhdGNoZWRFeGVjID0gZnVuY3Rpb24gZXhlYyhzdHIpIHtcbiAgICB2YXIgcmUgPSB0aGlzO1xuICAgIHZhciBsYXN0SW5kZXgsIHJlQ29weSwgbWF0Y2gsIGk7XG5cbiAgICBpZiAoTlBDR19JTkNMVURFRCkge1xuICAgICAgcmVDb3B5ID0gbmV3IFJlZ0V4cCgnXicgKyByZS5zb3VyY2UgKyAnJCg/IVxcXFxzKScsIHJlZ2V4cEZsYWdzLmNhbGwocmUpKTtcbiAgICB9XG4gICAgaWYgKFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORykgbGFzdEluZGV4ID0gcmVbTEFTVF9JTkRFWF07XG5cbiAgICBtYXRjaCA9IG5hdGl2ZUV4ZWMuY2FsbChyZSwgc3RyKTtcblxuICAgIGlmIChVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgJiYgbWF0Y2gpIHtcbiAgICAgIHJlW0xBU1RfSU5ERVhdID0gcmUuZ2xvYmFsID8gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGggOiBsYXN0SW5kZXg7XG4gICAgfVxuICAgIGlmIChOUENHX0lOQ0xVREVEICYmIG1hdGNoICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgXG4gICAgICAvLyBmb3IgTlBDRywgbGlrZSBJRTguIE5PVEU6IFRoaXMgZG9lc24nIHdvcmsgZm9yIC8oLj8pPy9cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb29wLWZ1bmNcbiAgICAgIG5hdGl2ZVJlcGxhY2UuY2FsbChtYXRjaFswXSwgcmVDb3B5LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSA9PT0gdW5kZWZpbmVkKSBtYXRjaFtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGNoZWRFeGVjO1xuIiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uIChPLCBwcm90bykge1xuICBhbk9iamVjdChPKTtcbiAgaWYgKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpIHRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uICh0ZXN0LCBidWdneSwgc2V0KSB7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuL19jdHgnKShGdW5jdGlvbi5jYWxsLCByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmYoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgIHNldCh0ZXN0LCBbXSk7XG4gICAgICAgIGJ1Z2d5ID0gISh0ZXN0IGluc3RhbmNlb2YgQXJyYXkpO1xuICAgICAgfSBjYXRjaCAoZSkgeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90bykge1xuICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgIGlmIChidWdneSkgTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIEMgPSBnbG9iYWxbS0VZXTtcbiAgaWYgKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pIGRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59O1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAxOSBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBEKSB7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3I7XG4gIHZhciBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWV0aG9kLCBhcmcpIHtcbiAgcmV0dXJuICEhbWV0aG9kICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlbGVzcy1jYWxsXG4gICAgYXJnID8gbWV0aG9kLmNhbGwobnVsbCwgZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9LCAxKSA6IG1ldGhvZC5jYWxsKG51bGwpO1xuICB9KTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwiLy8gaGVscGVyIGZvciBTdHJpbmcje3N0YXJ0c1dpdGgsIGVuZHNXaXRoLCBpbmNsdWRlc31cbnZhciBpc1JlZ0V4cCA9IHJlcXVpcmUoJy4vX2lzLXJlZ2V4cCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRoYXQsIHNlYXJjaFN0cmluZywgTkFNRSkge1xuICBpZiAoaXNSZWdFeHAoc2VhcmNoU3RyaW5nKSkgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmcjJyArIE5BTUUgKyBcIiBkb2Vzbid0IGFjY2VwdCByZWdleCFcIik7XG4gIHJldHVybiBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG59O1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbnZhciBxdW90ID0gL1wiL2c7XG4vLyBCLjIuMy4yLjEgQ3JlYXRlSFRNTChzdHJpbmcsIHRhZywgYXR0cmlidXRlLCB2YWx1ZSlcbnZhciBjcmVhdGVIVE1MID0gZnVuY3Rpb24gKHN0cmluZywgdGFnLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gIHZhciBTID0gU3RyaW5nKGRlZmluZWQoc3RyaW5nKSk7XG4gIHZhciBwMSA9ICc8JyArIHRhZztcbiAgaWYgKGF0dHJpYnV0ZSAhPT0gJycpIHAxICs9ICcgJyArIGF0dHJpYnV0ZSArICc9XCInICsgU3RyaW5nKHZhbHVlKS5yZXBsYWNlKHF1b3QsICcmcXVvdDsnKSArICdcIic7XG4gIHJldHVybiBwMSArICc+JyArIFMgKyAnPC8nICsgdGFnICsgJz4nO1xufTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE5BTUUsIGV4ZWMpIHtcbiAgdmFyIE8gPSB7fTtcbiAgT1tOQU1FXSA9IGV4ZWMoY3JlYXRlSFRNTCk7XG4gICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXN0ID0gJydbTkFNRV0oJ1wiJyk7XG4gICAgcmV0dXJuIHRlc3QgIT09IHRlc3QudG9Mb3dlckNhc2UoKSB8fCB0ZXN0LnNwbGl0KCdcIicpLmxlbmd0aCA+IDM7XG4gIH0pLCAnU3RyaW5nJywgTyk7XG59O1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBzcGFjZXMgPSByZXF1aXJlKCcuL19zdHJpbmctd3MnKTtcbnZhciBzcGFjZSA9ICdbJyArIHNwYWNlcyArICddJztcbnZhciBub24gPSAnXFx1MjAwYlxcdTAwODUnO1xudmFyIGx0cmltID0gUmVnRXhwKCdeJyArIHNwYWNlICsgc3BhY2UgKyAnKicpO1xudmFyIHJ0cmltID0gUmVnRXhwKHNwYWNlICsgc3BhY2UgKyAnKiQnKTtcblxudmFyIGV4cG9ydGVyID0gZnVuY3Rpb24gKEtFWSwgZXhlYywgQUxJQVMpIHtcbiAgdmFyIGV4cCA9IHt9O1xuICB2YXIgRk9SQ0UgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuICEhc3BhY2VzW0tFWV0oKSB8fCBub25bS0VZXSgpICE9IG5vbjtcbiAgfSk7XG4gIHZhciBmbiA9IGV4cFtLRVldID0gRk9SQ0UgPyBleGVjKHRyaW0pIDogc3BhY2VzW0tFWV07XG4gIGlmIChBTElBUykgZXhwW0FMSUFTXSA9IGZuO1xuICAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIEZPUkNFLCAnU3RyaW5nJywgZXhwKTtcbn07XG5cbi8vIDEgLT4gU3RyaW5nI3RyaW1MZWZ0XG4vLyAyIC0+IFN0cmluZyN0cmltUmlnaHRcbi8vIDMgLT4gU3RyaW5nI3RyaW1cbnZhciB0cmltID0gZXhwb3J0ZXIudHJpbSA9IGZ1bmN0aW9uIChzdHJpbmcsIFRZUEUpIHtcbiAgc3RyaW5nID0gU3RyaW5nKGRlZmluZWQoc3RyaW5nKSk7XG4gIGlmIChUWVBFICYgMSkgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UobHRyaW0sICcnKTtcbiAgaWYgKFRZUEUgJiAyKSBzdHJpbmcgPSBzdHJpbmcucmVwbGFjZShydHJpbSwgJycpO1xuICByZXR1cm4gc3RyaW5nO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRlcjtcbiIsIm1vZHVsZS5leHBvcnRzID0gJ1xceDA5XFx4MEFcXHgwQlxceDBDXFx4MERcXHgyMFxceEEwXFx1MTY4MFxcdTE4MEVcXHUyMDAwXFx1MjAwMVxcdTIwMDJcXHUyMDAzJyArXG4gICdcXHUyMDA0XFx1MjAwNVxcdTIwMDZcXHUyMDA3XFx1MjAwOFxcdTIwMDlcXHUyMDBBXFx1MjAyRlxcdTIwNUZcXHUzMDAwXFx1MjAyOFxcdTIwMjlcXHVGRUZGJztcbiIsInZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBpbnZva2UgPSByZXF1aXJlKCcuL19pbnZva2UnKTtcbnZhciBodG1sID0gcmVxdWlyZSgnLi9faHRtbCcpO1xudmFyIGNlbCA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgc2V0VGFzayA9IGdsb2JhbC5zZXRJbW1lZGlhdGU7XG52YXIgY2xlYXJUYXNrID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xudmFyIE1lc3NhZ2VDaGFubmVsID0gZ2xvYmFsLk1lc3NhZ2VDaGFubmVsO1xudmFyIERpc3BhdGNoID0gZ2xvYmFsLkRpc3BhdGNoO1xudmFyIGNvdW50ZXIgPSAwO1xudmFyIHF1ZXVlID0ge307XG52YXIgT05SRUFEWVNUQVRFQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG52YXIgZGVmZXIsIGNoYW5uZWwsIHBvcnQ7XG52YXIgcnVuID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaWQgPSArdGhpcztcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xuICBpZiAocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcbnZhciBsaXN0ZW5lciA9IGZ1bmN0aW9uIChldmVudCkge1xuICBydW4uY2FsbChldmVudC5kYXRhKTtcbn07XG4vLyBOb2RlLmpzIDAuOSsgJiBJRTEwKyBoYXMgc2V0SW1tZWRpYXRlLCBvdGhlcndpc2U6XG5pZiAoIXNldFRhc2sgfHwgIWNsZWFyVGFzaykge1xuICBzZXRUYXNrID0gZnVuY3Rpb24gc2V0SW1tZWRpYXRlKGZuKSB7XG4gICAgdmFyIGFyZ3MgPSBbXTtcbiAgICB2YXIgaSA9IDE7XG4gICAgd2hpbGUgKGFyZ3VtZW50cy5sZW5ndGggPiBpKSBhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHF1ZXVlWysrY291bnRlcl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICAgIGludm9rZSh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcbiAgICB9O1xuICAgIGRlZmVyKGNvdW50ZXIpO1xuICAgIHJldHVybiBjb3VudGVyO1xuICB9O1xuICBjbGVhclRhc2sgPSBmdW5jdGlvbiBjbGVhckltbWVkaWF0ZShpZCkge1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gIH07XG4gIC8vIE5vZGUuanMgMC44LVxuICBpZiAocmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBTcGhlcmUgKEpTIGdhbWUgZW5naW5lKSBEaXNwYXRjaCBBUElcbiAgfSBlbHNlIGlmIChEaXNwYXRjaCAmJiBEaXNwYXRjaC5ub3cpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgRGlzcGF0Y2gubm93KGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBNZXNzYWdlQ2hhbm5lbCwgaW5jbHVkZXMgV2ViV29ya2Vyc1xuICB9IGVsc2UgaWYgKE1lc3NhZ2VDaGFubmVsKSB7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIHBvcnQgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdGVuZXI7XG4gICAgZGVmZXIgPSBjdHgocG9ydC5wb3N0TWVzc2FnZSwgcG9ydCwgMSk7XG4gIC8vIEJyb3dzZXJzIHdpdGggcG9zdE1lc3NhZ2UsIHNraXAgV2ViV29ya2Vyc1xuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyAnb2JqZWN0J1xuICB9IGVsc2UgaWYgKGdsb2JhbC5hZGRFdmVudExpc3RlbmVyICYmIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmICFnbG9iYWwuaW1wb3J0U2NyaXB0cykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBnbG9iYWwucG9zdE1lc3NhZ2UoaWQgKyAnJywgJyonKTtcbiAgICB9O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYgKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjZWwoJ3NjcmlwdCcpKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGh0bWwuYXBwZW5kQ2hpbGQoY2VsKCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaHRtbC5yZW1vdmVDaGlsZCh0aGlzKTtcbiAgICAgICAgcnVuLmNhbGwoaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBzZXRUaW1lb3V0KGN0eChydW4sIGlkLCAxKSwgMCk7XG4gICAgfTtcbiAgfVxufVxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogc2V0VGFzayxcbiAgY2xlYXI6IGNsZWFyVGFza1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XG59O1xuIiwiLy8gNy4xLjQgVG9JbnRlZ2VyXG52YXIgY2VpbCA9IE1hdGguY2VpbDtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07XG4iLCIvLyB0byBpbmRleGVkIG9iamVjdCwgdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gSU9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjE1IFRvTGVuZ3RoXG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcbn07XG4iLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xIFRvUHJpbWl0aXZlKGlucHV0IFssIFByZWZlcnJlZFR5cGVdKVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG4vLyBpbnN0ZWFkIG9mIHRoZSBFUzYgc3BlYyB2ZXJzaW9uLCB3ZSBkaWRuJ3QgaW1wbGVtZW50IEBAdG9QcmltaXRpdmUgY2FzZVxuLy8gYW5kIHRoZSBzZWNvbmQgYXJndW1lbnQgLSBmbGFnIC0gcHJlZmVycmVkIHR5cGUgaXMgYSBzdHJpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBTKSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gaXQ7XG4gIHZhciBmbiwgdmFsO1xuICBpZiAoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpdC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICghUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBpZCA9IDA7XG52YXIgcHggPSBNYXRoLnJhbmRvbSgpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiAnU3ltYm9sKCcuY29uY2F0KGtleSA9PT0gdW5kZWZpbmVkID8gJycgOiBrZXksICcpXycsICgrK2lkICsgcHgpLnRvU3RyaW5nKDM2KSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIG5hdmlnYXRvciA9IGdsb2JhbC5uYXZpZ2F0b3I7XG5cbm1vZHVsZS5leHBvcnRzID0gbmF2aWdhdG9yICYmIG5hdmlnYXRvci51c2VyQWdlbnQgfHwgJyc7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBUWVBFKSB7XG4gIGlmICghaXNPYmplY3QoaXQpIHx8IGl0Ll90ICE9PSBUWVBFKSB0aHJvdyBUeXBlRXJyb3IoJ0luY29tcGF0aWJsZSByZWNlaXZlciwgJyArIFRZUEUgKyAnIHJlcXVpcmVkIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciB3a3NFeHQgPSByZXF1aXJlKCcuL193a3MtZXh0Jyk7XG52YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICB2YXIgJFN5bWJvbCA9IGNvcmUuU3ltYm9sIHx8IChjb3JlLlN5bWJvbCA9IExJQlJBUlkgPyB7fSA6IGdsb2JhbC5TeW1ib2wgfHwge30pO1xuICBpZiAobmFtZS5jaGFyQXQoMCkgIT0gJ18nICYmICEobmFtZSBpbiAkU3ltYm9sKSkgZGVmaW5lUHJvcGVydHkoJFN5bWJvbCwgbmFtZSwgeyB2YWx1ZTogd2tzRXh0LmYobmFtZSkgfSk7XG59O1xuIiwiZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fd2tzJyk7XG4iLCJ2YXIgc3RvcmUgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sO1xudmFyIFVTRV9TWU1CT0wgPSB0eXBlb2YgU3ltYm9sID09ICdmdW5jdGlvbic7XG5cbnZhciAkZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb3JlJykuZ2V0SXRlcmF0b3JNZXRob2QgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ICE9IHVuZGVmaW5lZCkgcmV0dXJuIGl0W0lURVJBVE9SXVxuICAgIHx8IGl0WydAQGl0ZXJhdG9yJ11cbiAgICB8fCBJdGVyYXRvcnNbY2xhc3NvZihpdCldO1xufTtcbiIsIi8vIDIyLjEuMy42IEFycmF5LnByb3RvdHlwZS5maWxsKHZhbHVlLCBzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdBcnJheScsIHsgZmlsbDogcmVxdWlyZSgnLi9fYXJyYXktZmlsbCcpIH0pO1xuXG5yZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKSgnZmlsbCcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkZmlsdGVyID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDIpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19zdHJpY3QtbWV0aG9kJykoW10uZmlsdGVyLCB0cnVlKSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjMuNyAvIDE1LjQuNC4yMCBBcnJheS5wcm90b3R5cGUuZmlsdGVyKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgcmV0dXJuICRmaWx0ZXIodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRmb3JFYWNoID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDApO1xudmFyIFNUUklDVCA9IHJlcXVpcmUoJy4vX3N0cmljdC1tZXRob2QnKShbXS5mb3JFYWNoLCB0cnVlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAhU1RSSUNULCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4xMCAvIDE1LjQuNC4xOCBBcnJheS5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgcmV0dXJuICRmb3JFYWNoKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikgeyBBcnJheS5mcm9tKGl0ZXIpOyB9KSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjIuMSBBcnJheS5mcm9tKGFycmF5TGlrZSwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gIGZyb206IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KGFycmF5TGlrZSk7XG4gICAgdmFyIEMgPSB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nID8gdGhpcyA6IEFycmF5O1xuICAgIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgICB2YXIgbWFwZm4gPSBhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgaXRlckZuID0gZ2V0SXRlckZuKE8pO1xuICAgIHZhciBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XG4gICAgaWYgKG1hcHBpbmcpIG1hcGZuID0gY3R4KG1hcGZuLCBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gICAgLy8gaWYgb2JqZWN0IGlzbid0IGl0ZXJhYmxlIG9yIGl0J3MgYXJyYXkgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yIC0gdXNlIHNpbXBsZSBjYXNlXG4gICAgaWYgKGl0ZXJGbiAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyKGl0ZXJGbikpKSB7XG4gICAgICBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoTyksIHJlc3VsdCA9IG5ldyBDKCk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gY2FsbChpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICAgIGZvciAocmVzdWx0ID0gbmV3IEMobGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJGluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciAkbmF0aXZlID0gW10uaW5kZXhPZjtcbnZhciBORUdBVElWRV9aRVJPID0gISEkbmF0aXZlICYmIDEgLyBbMV0uaW5kZXhPZigxLCAtMCkgPCAwO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChORUdBVElWRV9aRVJPIHx8ICFyZXF1aXJlKCcuL19zdHJpY3QtbWV0aG9kJykoJG5hdGl2ZSkpLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4xMSAvIDE1LjQuNC4xNCBBcnJheS5wcm90b3R5cGUuaW5kZXhPZihzZWFyY2hFbGVtZW50IFssIGZyb21JbmRleF0pXG4gIGluZGV4T2Y6IGZ1bmN0aW9uIGluZGV4T2Yoc2VhcmNoRWxlbWVudCAvKiAsIGZyb21JbmRleCA9IDAgKi8pIHtcbiAgICByZXR1cm4gTkVHQVRJVkVfWkVST1xuICAgICAgLy8gY29udmVydCAtMCB0byArMFxuICAgICAgPyAkbmF0aXZlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgMFxuICAgICAgOiAkaW5kZXhPZih0aGlzLCBzZWFyY2hFbGVtZW50LCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTtcbiIsIi8vIDIyLjEuMi4yIC8gMTUuNC4zLjIgQXJyYXkuaXNBcnJheShhcmcpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ0FycmF5JywgeyBpc0FycmF5OiByZXF1aXJlKCcuL19pcy1hcnJheScpIH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKTtcbnZhciBzdGVwID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIga2luZCA9IHRoaXMuX2s7XG4gIHZhciBpbmRleCA9IHRoaXMuX2krKztcbiAgaWYgKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKSB7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJG1hcCA9IHJlcXVpcmUoJy4vX2FycmF5LW1ldGhvZHMnKSgxKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fc3RyaWN0LW1ldGhvZCcpKFtdLm1hcCwgdHJ1ZSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4zLjE1IC8gMTUuNC40LjE5IEFycmF5LnByb3RvdHlwZS5tYXAoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcbiAgbWFwOiBmdW5jdGlvbiBtYXAoY2FsbGJhY2tmbiAvKiAsIHRoaXNBcmcgKi8pIHtcbiAgICByZXR1cm4gJG1hcCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0pO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJHJlZHVjZSA9IHJlcXVpcmUoJy4vX2FycmF5LXJlZHVjZScpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19zdHJpY3QtbWV0aG9kJykoW10ucmVkdWNlLCB0cnVlKSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjMuMTggLyAxNS40LjQuMjEgQXJyYXkucHJvdG90eXBlLnJlZHVjZShjYWxsYmFja2ZuIFssIGluaXRpYWxWYWx1ZV0pXG4gIHJlZHVjZTogZnVuY3Rpb24gcmVkdWNlKGNhbGxiYWNrZm4gLyogLCBpbml0aWFsVmFsdWUgKi8pIHtcbiAgICByZXR1cm4gJHJlZHVjZSh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoLCBhcmd1bWVudHNbMV0sIGZhbHNlKTtcbiAgfVxufSk7XG4iLCJ2YXIgRGF0ZVByb3RvID0gRGF0ZS5wcm90b3R5cGU7XG52YXIgSU5WQUxJRF9EQVRFID0gJ0ludmFsaWQgRGF0ZSc7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSBEYXRlUHJvdG9bVE9fU1RSSU5HXTtcbnZhciBnZXRUaW1lID0gRGF0ZVByb3RvLmdldFRpbWU7XG5pZiAobmV3IERhdGUoTmFOKSArICcnICE9IElOVkFMSURfREFURSkge1xuICByZXF1aXJlKCcuL19yZWRlZmluZScpKERhdGVQcm90bywgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgdmFsdWUgPSBnZXRUaW1lLmNhbGwodGhpcyk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAkdG9TdHJpbmcuY2FsbCh0aGlzKSA6IElOVkFMSURfREFURTtcbiAgfSk7XG59XG4iLCIvLyAxOS4yLjMuMiAvIDE1LjMuNC41IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKHRoaXNBcmcsIGFyZ3MuLi4pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ0Z1bmN0aW9uJywgeyBiaW5kOiByZXF1aXJlKCcuL19iaW5kJykgfSk7XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIEZQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbnZhciBuYW1lUkUgPSAvXlxccypmdW5jdGlvbiAoW14gKF0qKS87XG52YXIgTkFNRSA9ICduYW1lJztcblxuLy8gMTkuMi40LjIgbmFtZVxuTkFNRSBpbiBGUHJvdG8gfHwgcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiBkUChGUHJvdG8sIE5BTUUsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICgnJyArIHRoaXMpLm1hdGNoKG5hbWVSRSlbMV07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBNQVAgPSAnTWFwJztcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoTUFQLCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgTUFQKSwga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIGluaGVyaXRJZlJlcXVpcmVkID0gcmVxdWlyZSgnLi9faW5oZXJpdC1pZi1yZXF1aXJlZCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIGdPUE4gPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmY7XG52YXIgZ09QRCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZjtcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgJHRyaW0gPSByZXF1aXJlKCcuL19zdHJpbmctdHJpbScpLnRyaW07XG52YXIgTlVNQkVSID0gJ051bWJlcic7XG52YXIgJE51bWJlciA9IGdsb2JhbFtOVU1CRVJdO1xudmFyIEJhc2UgPSAkTnVtYmVyO1xudmFyIHByb3RvID0gJE51bWJlci5wcm90b3R5cGU7XG4vLyBPcGVyYSB+MTIgaGFzIGJyb2tlbiBPYmplY3QjdG9TdHJpbmdcbnZhciBCUk9LRU5fQ09GID0gY29mKHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKShwcm90bykpID09IE5VTUJFUjtcbnZhciBUUklNID0gJ3RyaW0nIGluIFN0cmluZy5wcm90b3R5cGU7XG5cbi8vIDcuMS4zIFRvTnVtYmVyKGFyZ3VtZW50KVxudmFyIHRvTnVtYmVyID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHZhciBpdCA9IHRvUHJpbWl0aXZlKGFyZ3VtZW50LCBmYWxzZSk7XG4gIGlmICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgJiYgaXQubGVuZ3RoID4gMikge1xuICAgIGl0ID0gVFJJTSA/IGl0LnRyaW0oKSA6ICR0cmltKGl0LCAzKTtcbiAgICB2YXIgZmlyc3QgPSBpdC5jaGFyQ29kZUF0KDApO1xuICAgIHZhciB0aGlyZCwgcmFkaXgsIG1heENvZGU7XG4gICAgaWYgKGZpcnN0ID09PSA0MyB8fCBmaXJzdCA9PT0gNDUpIHtcbiAgICAgIHRoaXJkID0gaXQuY2hhckNvZGVBdCgyKTtcbiAgICAgIGlmICh0aGlyZCA9PT0gODggfHwgdGhpcmQgPT09IDEyMCkgcmV0dXJuIE5hTjsgLy8gTnVtYmVyKCcrMHgxJykgc2hvdWxkIGJlIE5hTiwgb2xkIFY4IGZpeFxuICAgIH0gZWxzZSBpZiAoZmlyc3QgPT09IDQ4KSB7XG4gICAgICBzd2l0Y2ggKGl0LmNoYXJDb2RlQXQoMSkpIHtcbiAgICAgICAgY2FzZSA2NjogY2FzZSA5ODogcmFkaXggPSAyOyBtYXhDb2RlID0gNDk7IGJyZWFrOyAvLyBmYXN0IGVxdWFsIC9eMGJbMDFdKyQvaVxuICAgICAgICBjYXNlIDc5OiBjYXNlIDExMTogcmFkaXggPSA4OyBtYXhDb2RlID0gNTU7IGJyZWFrOyAvLyBmYXN0IGVxdWFsIC9eMG9bMC03XSskL2lcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuICtpdDtcbiAgICAgIH1cbiAgICAgIGZvciAodmFyIGRpZ2l0cyA9IGl0LnNsaWNlKDIpLCBpID0gMCwgbCA9IGRpZ2l0cy5sZW5ndGgsIGNvZGU7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgY29kZSA9IGRpZ2l0cy5jaGFyQ29kZUF0KGkpO1xuICAgICAgICAvLyBwYXJzZUludCBwYXJzZXMgYSBzdHJpbmcgdG8gYSBmaXJzdCB1bmF2YWlsYWJsZSBzeW1ib2xcbiAgICAgICAgLy8gYnV0IFRvTnVtYmVyIHNob3VsZCByZXR1cm4gTmFOIGlmIGEgc3RyaW5nIGNvbnRhaW5zIHVuYXZhaWxhYmxlIHN5bWJvbHNcbiAgICAgICAgaWYgKGNvZGUgPCA0OCB8fCBjb2RlID4gbWF4Q29kZSkgcmV0dXJuIE5hTjtcbiAgICAgIH0gcmV0dXJuIHBhcnNlSW50KGRpZ2l0cywgcmFkaXgpO1xuICAgIH1cbiAgfSByZXR1cm4gK2l0O1xufTtcblxuaWYgKCEkTnVtYmVyKCcgMG8xJykgfHwgISROdW1iZXIoJzBiMScpIHx8ICROdW1iZXIoJysweDEnKSkge1xuICAkTnVtYmVyID0gZnVuY3Rpb24gTnVtYmVyKHZhbHVlKSB7XG4gICAgdmFyIGl0ID0gYXJndW1lbnRzLmxlbmd0aCA8IDEgPyAwIDogdmFsdWU7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHJldHVybiB0aGF0IGluc3RhbmNlb2YgJE51bWJlclxuICAgICAgLy8gY2hlY2sgb24gMS4uY29uc3RydWN0b3IoZm9vKSBjYXNlXG4gICAgICAmJiAoQlJPS0VOX0NPRiA/IGZhaWxzKGZ1bmN0aW9uICgpIHsgcHJvdG8udmFsdWVPZi5jYWxsKHRoYXQpOyB9KSA6IGNvZih0aGF0KSAhPSBOVU1CRVIpXG4gICAgICAgID8gaW5oZXJpdElmUmVxdWlyZWQobmV3IEJhc2UodG9OdW1iZXIoaXQpKSwgdGhhdCwgJE51bWJlcikgOiB0b051bWJlcihpdCk7XG4gIH07XG4gIGZvciAodmFyIGtleXMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZ09QTihCYXNlKSA6IChcbiAgICAvLyBFUzM6XG4gICAgJ01BWF9WQUxVRSxNSU5fVkFMVUUsTmFOLE5FR0FUSVZFX0lORklOSVRZLFBPU0lUSVZFX0lORklOSVRZLCcgK1xuICAgIC8vIEVTNiAoaW4gY2FzZSwgaWYgbW9kdWxlcyB3aXRoIEVTNiBOdW1iZXIgc3RhdGljcyByZXF1aXJlZCBiZWZvcmUpOlxuICAgICdFUFNJTE9OLGlzRmluaXRlLGlzSW50ZWdlcixpc05hTixpc1NhZmVJbnRlZ2VyLE1BWF9TQUZFX0lOVEVHRVIsJyArXG4gICAgJ01JTl9TQUZFX0lOVEVHRVIscGFyc2VGbG9hdCxwYXJzZUludCxpc0ludGVnZXInXG4gICkuc3BsaXQoJywnKSwgaiA9IDAsIGtleTsga2V5cy5sZW5ndGggPiBqOyBqKyspIHtcbiAgICBpZiAoaGFzKEJhc2UsIGtleSA9IGtleXNbal0pICYmICFoYXMoJE51bWJlciwga2V5KSkge1xuICAgICAgZFAoJE51bWJlciwga2V5LCBnT1BEKEJhc2UsIGtleSkpO1xuICAgIH1cbiAgfVxuICAkTnVtYmVyLnByb3RvdHlwZSA9IHByb3RvO1xuICBwcm90by5jb25zdHJ1Y3RvciA9ICROdW1iZXI7XG4gIHJlcXVpcmUoJy4vX3JlZGVmaW5lJykoZ2xvYmFsLCBOVU1CRVIsICROdW1iZXIpO1xufVxuIiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0JywgeyBhc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKSB9KTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4vLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0JywgeyBjcmVhdGU6IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKSB9KTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4vLyAxOS4xLjIuNCAvIDE1LjIuMy42IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSwgJ09iamVjdCcsIHsgZGVmaW5lUHJvcGVydHk6IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmYgfSk7XG4iLCIvLyAxOS4xLjIuMTQgT2JqZWN0LmtleXMoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdrZXlzJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24ga2V5cyhpdCkge1xuICAgIHJldHVybiAka2V5cyh0b09iamVjdChpdCkpO1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0JywgeyBzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0IH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciB0ZXN0ID0ge307XG50ZXN0W3JlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXSA9ICd6JztcbmlmICh0ZXN0ICsgJycgIT0gJ1tvYmplY3Qgel0nKSB7XG4gIHJlcXVpcmUoJy4vX3JlZGVmaW5lJykoT2JqZWN0LnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdbb2JqZWN0ICcgKyBjbGFzc29mKHRoaXMpICsgJ10nO1xuICB9LCB0cnVlKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xudmFyIHRhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0O1xudmFyIG1pY3JvdGFzayA9IHJlcXVpcmUoJy4vX21pY3JvdGFzaycpKCk7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUgPSByZXF1aXJlKCcuL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5Jyk7XG52YXIgcGVyZm9ybSA9IHJlcXVpcmUoJy4vX3BlcmZvcm0nKTtcbnZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuL191c2VyLWFnZW50Jyk7XG52YXIgcHJvbWlzZVJlc29sdmUgPSByZXF1aXJlKCcuL19wcm9taXNlLXJlc29sdmUnKTtcbnZhciBQUk9NSVNFID0gJ1Byb21pc2UnO1xudmFyIFR5cGVFcnJvciA9IGdsb2JhbC5UeXBlRXJyb3I7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIHZlcnNpb25zID0gcHJvY2VzcyAmJiBwcm9jZXNzLnZlcnNpb25zO1xudmFyIHY4ID0gdmVyc2lvbnMgJiYgdmVyc2lvbnMudjggfHwgJyc7XG52YXIgJFByb21pc2UgPSBnbG9iYWxbUFJPTUlTRV07XG52YXIgaXNOb2RlID0gY2xhc3NvZihwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG52YXIgZW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgSW50ZXJuYWwsIG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSwgT3duUHJvbWlzZUNhcGFiaWxpdHksIFdyYXBwZXI7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZS5mO1xuXG52YXIgVVNFX05BVElWRSA9ICEhZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIC8vIGNvcnJlY3Qgc3ViY2xhc3Npbmcgd2l0aCBAQHNwZWNpZXMgc3VwcG9ydFxuICAgIHZhciBwcm9taXNlID0gJFByb21pc2UucmVzb2x2ZSgxKTtcbiAgICB2YXIgRmFrZVByb21pc2UgPSAocHJvbWlzZS5jb25zdHJ1Y3RvciA9IHt9KVtyZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpXSA9IGZ1bmN0aW9uIChleGVjKSB7XG4gICAgICBleGVjKGVtcHR5LCBlbXB0eSk7XG4gICAgfTtcbiAgICAvLyB1bmhhbmRsZWQgcmVqZWN0aW9ucyB0cmFja2luZyBzdXBwb3J0LCBOb2RlSlMgUHJvbWlzZSB3aXRob3V0IGl0IGZhaWxzIEBAc3BlY2llcyB0ZXN0XG4gICAgcmV0dXJuIChpc05vZGUgfHwgdHlwZW9mIFByb21pc2VSZWplY3Rpb25FdmVudCA9PSAnZnVuY3Rpb24nKVxuICAgICAgJiYgcHJvbWlzZS50aGVuKGVtcHR5KSBpbnN0YW5jZW9mIEZha2VQcm9taXNlXG4gICAgICAvLyB2OCA2LjYgKE5vZGUgMTAgYW5kIENocm9tZSA2NikgaGF2ZSBhIGJ1ZyB3aXRoIHJlc29sdmluZyBjdXN0b20gdGhlbmFibGVzXG4gICAgICAvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD04MzA1NjVcbiAgICAgIC8vIHdlIGNhbid0IGRldGVjdCBpdCBzeW5jaHJvbm91c2x5LCBzbyBqdXN0IGNoZWNrIHZlcnNpb25zXG4gICAgICAmJiB2OC5pbmRleE9mKCc2LjYnKSAhPT0gMFxuICAgICAgJiYgdXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZS82NicpID09PSAtMTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uIChwcm9taXNlLCBpc1JlamVjdCkge1xuICBpZiAocHJvbWlzZS5fbikgcmV0dXJuO1xuICBwcm9taXNlLl9uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYztcbiAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92O1xuICAgIHZhciBvayA9IHByb21pc2UuX3MgPT0gMTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbDtcbiAgICAgIHZhciByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZTtcbiAgICAgIHZhciByZWplY3QgPSByZWFjdGlvbi5yZWplY3Q7XG4gICAgICB2YXIgZG9tYWluID0gcmVhY3Rpb24uZG9tYWluO1xuICAgICAgdmFyIHJlc3VsdCwgdGhlbiwgZXhpdGVkO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICBpZiAocHJvbWlzZS5faCA9PSAyKSBvbkhhbmRsZVVuaGFuZGxlZChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UuX2ggPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaGFuZGxlciA9PT0gdHJ1ZSkgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoZG9tYWluKSBkb21haW4uZW50ZXIoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIodmFsdWUpOyAvLyBtYXkgdGhyb3dcbiAgICAgICAgICAgIGlmIChkb21haW4pIHtcbiAgICAgICAgICAgICAgZG9tYWluLmV4aXQoKTtcbiAgICAgICAgICAgICAgZXhpdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSkge1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoZW4gPSBpc1RoZW5hYmxlKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChkb21haW4gJiYgIWV4aXRlZCkgZG9tYWluLmV4aXQoKTtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUgKGNoYWluLmxlbmd0aCA+IGkpIHJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBwcm9taXNlLl9jID0gW107XG4gICAgcHJvbWlzZS5fbiA9IGZhbHNlO1xuICAgIGlmIChpc1JlamVjdCAmJiAhcHJvbWlzZS5faCkgb25VbmhhbmRsZWQocHJvbWlzZSk7XG4gIH0pO1xufTtcbnZhciBvblVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92O1xuICAgIHZhciB1bmhhbmRsZWQgPSBpc1VuaGFuZGxlZChwcm9taXNlKTtcbiAgICB2YXIgcmVzdWx0LCBoYW5kbGVyLCBjb25zb2xlO1xuICAgIGlmICh1bmhhbmRsZWQpIHtcbiAgICAgIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaXNOb2RlKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbikge1xuICAgICAgICAgIGhhbmRsZXIoeyBwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKChjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUpICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gQnJvd3NlcnMgc2hvdWxkIG5vdCB0cmlnZ2VyIGByZWplY3Rpb25IYW5kbGVkYCBldmVudCBpZiBpdCB3YXMgaGFuZGxlZCBoZXJlLCBOb2RlSlMgLSBzaG91bGRcbiAgICAgIHByb21pc2UuX2ggPSBpc05vZGUgfHwgaXNVbmhhbmRsZWQocHJvbWlzZSkgPyAyIDogMTtcbiAgICB9IHByb21pc2UuX2EgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHVuaGFuZGxlZCAmJiByZXN1bHQuZSkgdGhyb3cgcmVzdWx0LnY7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHJldHVybiBwcm9taXNlLl9oICE9PSAxICYmIChwcm9taXNlLl9hIHx8IHByb21pc2UuX2MpLmxlbmd0aCA9PT0gMDtcbn07XG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYgKGlzTm9kZSkge1xuICAgICAgcHJvY2Vzcy5lbWl0KCdyZWplY3Rpb25IYW5kbGVkJywgcHJvbWlzZSk7XG4gICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCkge1xuICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogcHJvbWlzZS5fdiB9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgaWYgKHByb21pc2UuX2QpIHJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICBwcm9taXNlLl92ID0gdmFsdWU7XG4gIHByb21pc2UuX3MgPSAyO1xuICBpZiAoIXByb21pc2UuX2EpIHByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICB2YXIgdGhlbjtcbiAgaWYgKHByb21pc2UuX2QpIHJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkgdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYgKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAkcmVqZWN0LmNhbGwoeyBfdzogcHJvbWlzZSwgX2Q6IGZhbHNlIH0sIGUpOyAvLyB3cmFwXG4gIH1cbn07XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZiAoIVVTRV9OQVRJVkUpIHtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkUHJvbWlzZSwgUFJPTUlTRSwgJ19oJyk7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICBJbnRlcm5hbC5jYWxsKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHRoaXMsIDEpLCBjdHgoJHJlamVjdCwgdGhpcywgMSkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgSW50ZXJuYWwgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgdGhpcy5fYyA9IFtdOyAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICB0aGlzLl9hID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgdGhpcy5fcyA9IDA7ICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgIHRoaXMuX2QgPSBmYWxzZTsgICAgICAgICAgLy8gPC0gZG9uZVxuICAgIHRoaXMuX3YgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gdmFsdWVcbiAgICB0aGlzLl9oID0gMDsgICAgICAgICAgICAgIC8vIDwtIHJlamVjdGlvbiBzdGF0ZSwgMCAtIGRlZmF1bHQsIDEgLSBoYW5kbGVkLCAyIC0gdW5oYW5kbGVkXG4gICAgdGhpcy5fbiA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgfTtcbiAgSW50ZXJuYWwucHJvdG90eXBlID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJykoJFByb21pc2UucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gaXNOb2RlID8gcHJvY2Vzcy5kb21haW4gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYgKHRoaXMuX2EpIHRoaXMuX2EucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fcykgbm90aWZ5KHRoaXMsIGZhbHNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbi5wcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbiAob25SZWplY3RlZCkge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIE93blByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9taXNlID0gbmV3IEludGVybmFsKCk7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ID0gY3R4KCRyZWplY3QsIHByb21pc2UsIDEpO1xuICB9O1xuICBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZS5mID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoQykge1xuICAgIHJldHVybiBDID09PSAkUHJvbWlzZSB8fCBDID09PSBXcmFwcGVyXG4gICAgICA/IG5ldyBPd25Qcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgOiBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHsgUHJvbWlzZTogJFByb21pc2UgfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpIHtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpO1xuICAgIHZhciAkJHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCkge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShMSUJSQVJZICYmIHRoaXMgPT09IFdyYXBwZXIgPyAkUHJvbWlzZSA6IHRoaXMsIHgpO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHtcbiAgJFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGVtcHR5KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVzb2x2ZSA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIHZhciByZW1haW5pbmcgPSAxO1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICB2YXIgJGluZGV4ID0gaW5kZXgrKztcbiAgICAgICAgdmFyIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIGlmIChhbHJlYWR5Q2FsbGVkKSByZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgdmFsdWVzWyRpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKSB7XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gICAgdmFyIHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lKSByZWplY3QocmVzdWx0LnYpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuIiwiLy8gMjYuMS4zIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcylcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG5cbi8vIE1TIEVkZ2UgaGFzIGJyb2tlbiBSZWZsZWN0LmRlZmluZVByb3BlcnR5IC0gdGhyb3dpbmcgaW5zdGVhZCBvZiByZXR1cm5pbmcgZmFsc2VcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuICBSZWZsZWN0LmRlZmluZVByb3BlcnR5KGRQLmYoe30sIDEsIHsgdmFsdWU6IDEgfSksIDEsIHsgdmFsdWU6IDIgfSk7XG59KSwgJ1JlZmxlY3QnLCB7XG4gIGRlZmluZVByb3BlcnR5OiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKSB7XG4gICAgYW5PYmplY3QodGFyZ2V0KTtcbiAgICBwcm9wZXJ0eUtleSA9IHRvUHJpbWl0aXZlKHByb3BlcnR5S2V5LCB0cnVlKTtcbiAgICBhbk9iamVjdChhdHRyaWJ1dGVzKTtcbiAgICB0cnkge1xuICAgICAgZFAuZih0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuL19yZWdleHAtZXhlYycpO1xucmVxdWlyZSgnLi9fZXhwb3J0Jykoe1xuICB0YXJnZXQ6ICdSZWdFeHAnLFxuICBwcm90bzogdHJ1ZSxcbiAgZm9yY2VkOiByZWdleHBFeGVjICE9PSAvLi8uZXhlY1xufSwge1xuICBleGVjOiByZWdleHBFeGVjXG59KTtcbiIsIi8vIDIxLjIuNS4zIGdldCBSZWdFeHAucHJvdG90eXBlLmZsYWdzKClcbmlmIChyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmIC8uL2cuZmxhZ3MgIT0gJ2cnKSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mKFJlZ0V4cC5wcm90b3R5cGUsICdmbGFncycsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IHJlcXVpcmUoJy4vX2ZsYWdzJylcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGFkdmFuY2VTdHJpbmdJbmRleCA9IHJlcXVpcmUoJy4vX2FkdmFuY2Utc3RyaW5nLWluZGV4Jyk7XG52YXIgcmVnRXhwRXhlYyA9IHJlcXVpcmUoJy4vX3JlZ2V4cC1leGVjLWFic3RyYWN0Jyk7XG5cbi8vIEBAbWF0Y2ggbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgnbWF0Y2gnLCAxLCBmdW5jdGlvbiAoZGVmaW5lZCwgTUFUQ0gsICRtYXRjaCwgbWF5YmVDYWxsTmF0aXZlKSB7XG4gIHJldHVybiBbXG4gICAgLy8gYFN0cmluZy5wcm90b3R5cGUubWF0Y2hgIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUubWF0Y2hcbiAgICBmdW5jdGlvbiBtYXRjaChyZWdleHApIHtcbiAgICAgIHZhciBPID0gZGVmaW5lZCh0aGlzKTtcbiAgICAgIHZhciBmbiA9IHJlZ2V4cCA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiByZWdleHBbTUFUQ0hdO1xuICAgICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWQgPyBmbi5jYWxsKHJlZ2V4cCwgTykgOiBuZXcgUmVnRXhwKHJlZ2V4cClbTUFUQ0hdKFN0cmluZyhPKSk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQG1hdGNoXWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS1AQG1hdGNoXG4gICAgZnVuY3Rpb24gKHJlZ2V4cCkge1xuICAgICAgdmFyIHJlcyA9IG1heWJlQ2FsbE5hdGl2ZSgkbWF0Y2gsIHJlZ2V4cCwgdGhpcyk7XG4gICAgICBpZiAocmVzLmRvbmUpIHJldHVybiByZXMudmFsdWU7XG4gICAgICB2YXIgcnggPSBhbk9iamVjdChyZWdleHApO1xuICAgICAgdmFyIFMgPSBTdHJpbmcodGhpcyk7XG4gICAgICBpZiAoIXJ4Lmdsb2JhbCkgcmV0dXJuIHJlZ0V4cEV4ZWMocngsIFMpO1xuICAgICAgdmFyIGZ1bGxVbmljb2RlID0gcngudW5pY29kZTtcbiAgICAgIHJ4Lmxhc3RJbmRleCA9IDA7XG4gICAgICB2YXIgQSA9IFtdO1xuICAgICAgdmFyIG4gPSAwO1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIHdoaWxlICgocmVzdWx0ID0gcmVnRXhwRXhlYyhyeCwgUykpICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBtYXRjaFN0ciA9IFN0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICBBW25dID0gbWF0Y2hTdHI7XG4gICAgICAgIGlmIChtYXRjaFN0ciA9PT0gJycpIHJ4Lmxhc3RJbmRleCA9IGFkdmFuY2VTdHJpbmdJbmRleChTLCB0b0xlbmd0aChyeC5sYXN0SW5kZXgpLCBmdWxsVW5pY29kZSk7XG4gICAgICAgIG4rKztcbiAgICAgIH1cbiAgICAgIHJldHVybiBuID09PSAwID8gbnVsbCA6IEE7XG4gICAgfVxuICBdO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgYWR2YW5jZVN0cmluZ0luZGV4ID0gcmVxdWlyZSgnLi9fYWR2YW5jZS1zdHJpbmctaW5kZXgnKTtcbnZhciByZWdFeHBFeGVjID0gcmVxdWlyZSgnLi9fcmVnZXhwLWV4ZWMtYWJzdHJhY3QnKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG52YXIgU1VCU1RJVFVUSU9OX1NZTUJPTFMgPSAvXFwkKFskJmAnXXxcXGRcXGQ/fDxbXj5dKj4pL2c7XG52YXIgU1VCU1RJVFVUSU9OX1NZTUJPTFNfTk9fTkFNRUQgPSAvXFwkKFskJmAnXXxcXGRcXGQ/KS9nO1xuXG52YXIgbWF5YmVUb1N0cmluZyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/IGl0IDogU3RyaW5nKGl0KTtcbn07XG5cbi8vIEBAcmVwbGFjZSBsb2dpY1xucmVxdWlyZSgnLi9fZml4LXJlLXdrcycpKCdyZXBsYWNlJywgMiwgZnVuY3Rpb24gKGRlZmluZWQsIFJFUExBQ0UsICRyZXBsYWNlLCBtYXliZUNhbGxOYXRpdmUpIHtcbiAgcmV0dXJuIFtcbiAgICAvLyBgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnJlcGxhY2VcbiAgICBmdW5jdGlvbiByZXBsYWNlKHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpIHtcbiAgICAgIHZhciBPID0gZGVmaW5lZCh0aGlzKTtcbiAgICAgIHZhciBmbiA9IHNlYXJjaFZhbHVlID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHNlYXJjaFZhbHVlW1JFUExBQ0VdO1xuICAgICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBmbi5jYWxsKHNlYXJjaFZhbHVlLCBPLCByZXBsYWNlVmFsdWUpXG4gICAgICAgIDogJHJlcGxhY2UuY2FsbChTdHJpbmcoTyksIHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpO1xuICAgIH0sXG4gICAgLy8gYFJlZ0V4cC5wcm90b3R5cGVbQEByZXBsYWNlXWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS1AQHJlcGxhY2VcbiAgICBmdW5jdGlvbiAocmVnZXhwLCByZXBsYWNlVmFsdWUpIHtcbiAgICAgIHZhciByZXMgPSBtYXliZUNhbGxOYXRpdmUoJHJlcGxhY2UsIHJlZ2V4cCwgdGhpcywgcmVwbGFjZVZhbHVlKTtcbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcblxuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuICAgICAgdmFyIGZ1bmN0aW9uYWxSZXBsYWNlID0gdHlwZW9mIHJlcGxhY2VWYWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAgIGlmICghZnVuY3Rpb25hbFJlcGxhY2UpIHJlcGxhY2VWYWx1ZSA9IFN0cmluZyhyZXBsYWNlVmFsdWUpO1xuICAgICAgdmFyIGdsb2JhbCA9IHJ4Lmdsb2JhbDtcbiAgICAgIGlmIChnbG9iYWwpIHtcbiAgICAgICAgdmFyIGZ1bGxVbmljb2RlID0gcngudW5pY29kZTtcbiAgICAgICAgcngubGFzdEluZGV4ID0gMDtcbiAgICAgIH1cbiAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVnRXhwRXhlYyhyeCwgUyk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIGJyZWFrO1xuICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgaWYgKCFnbG9iYWwpIGJyZWFrO1xuICAgICAgICB2YXIgbWF0Y2hTdHIgPSBTdHJpbmcocmVzdWx0WzBdKTtcbiAgICAgICAgaWYgKG1hdGNoU3RyID09PSAnJykgcngubGFzdEluZGV4ID0gYWR2YW5jZVN0cmluZ0luZGV4KFMsIHRvTGVuZ3RoKHJ4Lmxhc3RJbmRleCksIGZ1bGxVbmljb2RlKTtcbiAgICAgIH1cbiAgICAgIHZhciBhY2N1bXVsYXRlZFJlc3VsdCA9ICcnO1xuICAgICAgdmFyIG5leHRTb3VyY2VQb3NpdGlvbiA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBTdHJpbmcocmVzdWx0WzBdKTtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gbWF4KG1pbih0b0ludGVnZXIocmVzdWx0LmluZGV4KSwgUy5sZW5ndGgpLCAwKTtcbiAgICAgICAgdmFyIGNhcHR1cmVzID0gW107XG4gICAgICAgIC8vIE5PVEU6IFRoaXMgaXMgZXF1aXZhbGVudCB0b1xuICAgICAgICAvLyAgIGNhcHR1cmVzID0gcmVzdWx0LnNsaWNlKDEpLm1hcChtYXliZVRvU3RyaW5nKVxuICAgICAgICAvLyBidXQgZm9yIHNvbWUgcmVhc29uIGBuYXRpdmVTbGljZS5jYWxsKHJlc3VsdCwgMSwgcmVzdWx0Lmxlbmd0aClgIChjYWxsZWQgaW5cbiAgICAgICAgLy8gdGhlIHNsaWNlIHBvbHlmaWxsIHdoZW4gc2xpY2luZyBuYXRpdmUgYXJyYXlzKSBcImRvZXNuJ3Qgd29ya1wiIGluIHNhZmFyaSA5IGFuZFxuICAgICAgICAvLyBjYXVzZXMgYSBjcmFzaCAoaHR0cHM6Ly9wYXN0ZWJpbi5jb20vTjIxUXplUUEpIHdoZW4gdHJ5aW5nIHRvIGRlYnVnIGl0LlxuICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8IHJlc3VsdC5sZW5ndGg7IGorKykgY2FwdHVyZXMucHVzaChtYXliZVRvU3RyaW5nKHJlc3VsdFtqXSkpO1xuICAgICAgICB2YXIgbmFtZWRDYXB0dXJlcyA9IHJlc3VsdC5ncm91cHM7XG4gICAgICAgIGlmIChmdW5jdGlvbmFsUmVwbGFjZSkge1xuICAgICAgICAgIHZhciByZXBsYWNlckFyZ3MgPSBbbWF0Y2hlZF0uY29uY2F0KGNhcHR1cmVzLCBwb3NpdGlvbiwgUyk7XG4gICAgICAgICAgaWYgKG5hbWVkQ2FwdHVyZXMgIT09IHVuZGVmaW5lZCkgcmVwbGFjZXJBcmdzLnB1c2gobmFtZWRDYXB0dXJlcyk7XG4gICAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gU3RyaW5nKHJlcGxhY2VWYWx1ZS5hcHBseSh1bmRlZmluZWQsIHJlcGxhY2VyQXJncykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcGxhY2VtZW50ID0gZ2V0U3Vic3RpdHV0aW9uKG1hdGNoZWQsIFMsIHBvc2l0aW9uLCBjYXB0dXJlcywgbmFtZWRDYXB0dXJlcywgcmVwbGFjZVZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPj0gbmV4dFNvdXJjZVBvc2l0aW9uKSB7XG4gICAgICAgICAgYWNjdW11bGF0ZWRSZXN1bHQgKz0gUy5zbGljZShuZXh0U291cmNlUG9zaXRpb24sIHBvc2l0aW9uKSArIHJlcGxhY2VtZW50O1xuICAgICAgICAgIG5leHRTb3VyY2VQb3NpdGlvbiA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2N1bXVsYXRlZFJlc3VsdCArIFMuc2xpY2UobmV4dFNvdXJjZVBvc2l0aW9uKTtcbiAgICB9XG4gIF07XG5cbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1nZXRzdWJzdGl0dXRpb25cbiAgZnVuY3Rpb24gZ2V0U3Vic3RpdHV0aW9uKG1hdGNoZWQsIHN0ciwgcG9zaXRpb24sIGNhcHR1cmVzLCBuYW1lZENhcHR1cmVzLCByZXBsYWNlbWVudCkge1xuICAgIHZhciB0YWlsUG9zID0gcG9zaXRpb24gKyBtYXRjaGVkLmxlbmd0aDtcbiAgICB2YXIgbSA9IGNhcHR1cmVzLmxlbmd0aDtcbiAgICB2YXIgc3ltYm9scyA9IFNVQlNUSVRVVElPTl9TWU1CT0xTX05PX05BTUVEO1xuICAgIGlmIChuYW1lZENhcHR1cmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG5hbWVkQ2FwdHVyZXMgPSB0b09iamVjdChuYW1lZENhcHR1cmVzKTtcbiAgICAgIHN5bWJvbHMgPSBTVUJTVElUVVRJT05fU1lNQk9MUztcbiAgICB9XG4gICAgcmV0dXJuICRyZXBsYWNlLmNhbGwocmVwbGFjZW1lbnQsIHN5bWJvbHMsIGZ1bmN0aW9uIChtYXRjaCwgY2gpIHtcbiAgICAgIHZhciBjYXB0dXJlO1xuICAgICAgc3dpdGNoIChjaC5jaGFyQXQoMCkpIHtcbiAgICAgICAgY2FzZSAnJCc6IHJldHVybiAnJCc7XG4gICAgICAgIGNhc2UgJyYnOiByZXR1cm4gbWF0Y2hlZDtcbiAgICAgICAgY2FzZSAnYCc6IHJldHVybiBzdHIuc2xpY2UoMCwgcG9zaXRpb24pO1xuICAgICAgICBjYXNlIFwiJ1wiOiByZXR1cm4gc3RyLnNsaWNlKHRhaWxQb3MpO1xuICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgICBjYXB0dXJlID0gbmFtZWRDYXB0dXJlc1tjaC5zbGljZSgxLCAtMSldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiAvLyBcXGRcXGQ/XG4gICAgICAgICAgdmFyIG4gPSArY2g7XG4gICAgICAgICAgaWYgKG4gPT09IDApIHJldHVybiBtYXRjaDtcbiAgICAgICAgICBpZiAobiA+IG0pIHtcbiAgICAgICAgICAgIHZhciBmID0gZmxvb3IobiAvIDEwKTtcbiAgICAgICAgICAgIGlmIChmID09PSAwKSByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgICBpZiAoZiA8PSBtKSByZXR1cm4gY2FwdHVyZXNbZiAtIDFdID09PSB1bmRlZmluZWQgPyBjaC5jaGFyQXQoMSkgOiBjYXB0dXJlc1tmIC0gMV0gKyBjaC5jaGFyQXQoMSk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhcHR1cmUgPSBjYXB0dXJlc1tuIC0gMV07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FwdHVyZSA9PT0gdW5kZWZpbmVkID8gJycgOiBjYXB0dXJlO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnJlcXVpcmUoJy4vZXM2LnJlZ2V4cC5mbGFncycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgJGZsYWdzID0gcmVxdWlyZSgnLi9fZmxhZ3MnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSAvLi9bVE9fU1RSSU5HXTtcblxudmFyIGRlZmluZSA9IGZ1bmN0aW9uIChmbikge1xuICByZXF1aXJlKCcuL19yZWRlZmluZScpKFJlZ0V4cC5wcm90b3R5cGUsIFRPX1NUUklORywgZm4sIHRydWUpO1xufTtcblxuLy8gMjEuMi41LjE0IFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcoKVxuaWYgKHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkgeyByZXR1cm4gJHRvU3RyaW5nLmNhbGwoeyBzb3VyY2U6ICdhJywgZmxhZ3M6ICdiJyB9KSAhPSAnL2EvYic7IH0pKSB7XG4gIGRlZmluZShmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgUiA9IGFuT2JqZWN0KHRoaXMpO1xuICAgIHJldHVybiAnLycuY29uY2F0KFIuc291cmNlLCAnLycsXG4gICAgICAnZmxhZ3MnIGluIFIgPyBSLmZsYWdzIDogIURFU0NSSVBUT1JTICYmIFIgaW5zdGFuY2VvZiBSZWdFeHAgPyAkZmxhZ3MuY2FsbChSKSA6IHVuZGVmaW5lZCk7XG4gIH0pO1xuLy8gRkY0NC0gUmVnRXhwI3RvU3RyaW5nIGhhcyBhIHdyb25nIG5hbWVcbn0gZWxzZSBpZiAoJHRvU3RyaW5nLm5hbWUgIT0gVE9fU1RSSU5HKSB7XG4gIGRlZmluZShmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJHRvU3RyaW5nLmNhbGwodGhpcyk7XG4gIH0pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0VUID0gJ1NldCc7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKFNFVCwgZnVuY3Rpb24gKGdldCkge1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCkgeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgU0VUKSwgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBCLjIuMy4xMCBTdHJpbmcucHJvdG90eXBlLmxpbmsodXJsKVxucmVxdWlyZSgnLi9fc3RyaW5nLWh0bWwnKSgnbGluaycsIGZ1bmN0aW9uIChjcmVhdGVIVE1MKSB7XG4gIHJldHVybiBmdW5jdGlvbiBsaW5rKHVybCkge1xuICAgIHJldHVybiBjcmVhdGVIVE1MKHRoaXMsICdhJywgJ2hyZWYnLCB1cmwpO1xuICB9O1xufSk7XG4iLCIvLyAyMS4xLjMuMTggU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKHNlYXJjaFN0cmluZyBbLCBwb3NpdGlvbiBdKVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNvbnRleHQgPSByZXF1aXJlKCcuL19zdHJpbmctY29udGV4dCcpO1xudmFyIFNUQVJUU19XSVRIID0gJ3N0YXJ0c1dpdGgnO1xudmFyICRzdGFydHNXaXRoID0gJydbU1RBUlRTX1dJVEhdO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzLWlzLXJlZ2V4cCcpKFNUQVJUU19XSVRIKSwgJ1N0cmluZycsIHtcbiAgc3RhcnRzV2l0aDogZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgLyogLCBwb3NpdGlvbiA9IDAgKi8pIHtcbiAgICB2YXIgdGhhdCA9IGNvbnRleHQodGhpcywgc2VhcmNoU3RyaW5nLCBTVEFSVFNfV0lUSCk7XG4gICAgdmFyIGluZGV4ID0gdG9MZW5ndGgoTWF0aC5taW4oYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIHRoYXQubGVuZ3RoKSk7XG4gICAgdmFyIHNlYXJjaCA9IFN0cmluZyhzZWFyY2hTdHJpbmcpO1xuICAgIHJldHVybiAkc3RhcnRzV2l0aFxuICAgICAgPyAkc3RhcnRzV2l0aC5jYWxsKHRoYXQsIHNlYXJjaCwgaW5kZXgpXG4gICAgICA6IHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoLmxlbmd0aCkgPT09IHNlYXJjaDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgTUVUQSA9IHJlcXVpcmUoJy4vX21ldGEnKS5LRVk7XG52YXIgJGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgd2tzID0gcmVxdWlyZSgnLi9fd2tzJyk7XG52YXIgd2tzRXh0ID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpO1xudmFyIHdrc0RlZmluZSA9IHJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKTtcbnZhciBlbnVtS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0ta2V5cycpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL19pcy1hcnJheScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIF9jcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZ09QTkV4dCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuLWV4dCcpO1xudmFyICRHT1BEID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKTtcbnZhciAkRFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QRCA9ICRHT1BELmY7XG52YXIgZFAgPSAkRFAuZjtcbnZhciBnT1BOID0gZ09QTkV4dC5mO1xudmFyICRTeW1ib2wgPSBnbG9iYWwuU3ltYm9sO1xudmFyICRKU09OID0gZ2xvYmFsLkpTT047XG52YXIgX3N0cmluZ2lmeSA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcbnZhciBISURERU4gPSB3a3MoJ19oaWRkZW4nKTtcbnZhciBUT19QUklNSVRJVkUgPSB3a3MoJ3RvUHJpbWl0aXZlJyk7XG52YXIgaXNFbnVtID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG52YXIgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpO1xudmFyIEFsbFN5bWJvbHMgPSBzaGFyZWQoJ3N5bWJvbHMnKTtcbnZhciBPUFN5bWJvbHMgPSBzaGFyZWQoJ29wLXN5bWJvbHMnKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdFtQUk9UT1RZUEVdO1xudmFyIFVTRV9OQVRJVkUgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xudmFyIFFPYmplY3QgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gX2NyZWF0ZShkUCh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkUCh0aGlzLCAnYScsIHsgdmFsdWU6IDcgfSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbiAoaXQsIGtleSwgRCkge1xuICB2YXIgcHJvdG9EZXNjID0gZ09QRChPYmplY3RQcm90bywga2V5KTtcbiAgaWYgKHByb3RvRGVzYykgZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gIGRQKGl0LCBrZXksIEQpO1xuICBpZiAocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bykgZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbiAodGFnKSB7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2xbUFJPVE9UWVBFXSk7XG4gIHN5bS5fayA9IHRhZztcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IFVTRV9OQVRJVkUgJiYgdHlwZW9mICRTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCcgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKSB7XG4gIGlmIChpdCA9PT0gT2JqZWN0UHJvdG8pICRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmIChoYXMoQWxsU3ltYm9scywga2V5KSkge1xuICAgIGlmICghRC5lbnVtZXJhYmxlKSB7XG4gICAgICBpZiAoIWhhcyhpdCwgSElEREVOKSkgZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pIGl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwgeyBlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKSB9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBkUChpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKSB7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgbCA9IGtleXMubGVuZ3RoO1xuICB2YXIga2V5O1xuICB3aGlsZSAobCA+IGkpICRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApIHtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpIHtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV0gPyBFIDogdHJ1ZTtcbn07XG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KSB7XG4gIGl0ID0gdG9JT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSkgcmV0dXJuO1xuICB2YXIgRCA9IGdPUEQoaXQsIGtleSk7XG4gIGlmIChEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpIEQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgdmFyIG5hbWVzID0gZ09QTih0b0lPYmplY3QoaXQpKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgaSA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSB7XG4gICAgaWYgKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTiAmJiBrZXkgIT0gTUVUQSkgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSB7XG4gIHZhciBJU19PUCA9IGl0ID09PSBPYmplY3RQcm90bztcbiAgdmFyIG5hbWVzID0gZ09QTihJU19PUCA/IE9QU3ltYm9scyA6IHRvSU9iamVjdChpdCkpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBpID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIHtcbiAgICBpZiAoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKSByZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmICghVVNFX05BVElWRSkge1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCkgdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzID09PSBPYmplY3RQcm90bykgJHNldC5jYWxsKE9QU3ltYm9scywgdmFsdWUpO1xuICAgICAgaWYgKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpIHRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYgKERFU0NSSVBUT1JTICYmIHNldHRlcikgc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0IH0pO1xuICAgIHJldHVybiB3cmFwKHRhZyk7XG4gIH07XG4gIHJlZGVmaW5lKCRTeW1ib2xbUFJPVE9UWVBFXSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gICRHT1BELmYgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkRFAuZiA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpLmYgPSAkZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4gIGlmIChERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi9fbGlicmFyeScpKSB7XG4gICAgcmVkZWZpbmUoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG4gIH1cblxuICB3a3NFeHQuZiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgcmV0dXJuIHdyYXAod2tzKG5hbWUpKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgeyBTeW1ib2w6ICRTeW1ib2wgfSk7XG5cbmZvciAodmFyIGVzNlN5bWJvbHMgPSAoXG4gIC8vIDE5LjQuMi4yLCAxOS40LjIuMywgMTkuNC4yLjQsIDE5LjQuMi42LCAxOS40LjIuOCwgMTkuNC4yLjksIDE5LjQuMi4xMCwgMTkuNC4yLjExLCAxOS40LjIuMTIsIDE5LjQuMi4xMywgMTkuNC4yLjE0XG4gICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcbikuc3BsaXQoJywnKSwgaiA9IDA7IGVzNlN5bWJvbHMubGVuZ3RoID4gajspd2tzKGVzNlN5bWJvbHNbaisrXSk7XG5cbmZvciAodmFyIHdlbGxLbm93blN5bWJvbHMgPSAka2V5cyh3a3Muc3RvcmUpLCBrID0gMDsgd2VsbEtub3duU3ltYm9scy5sZW5ndGggPiBrOykgd2tzRGVmaW5lKHdlbGxLbm93blN5bWJvbHNbaysrXSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdTeW1ib2wnLCB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioc3ltKSB7XG4gICAgaWYgKCFpc1N5bWJvbChzeW0pKSB0aHJvdyBUeXBlRXJyb3Ioc3ltICsgJyBpcyBub3QgYSBzeW1ib2whJyk7XG4gICAgZm9yICh2YXIga2V5IGluIFN5bWJvbFJlZ2lzdHJ5KSBpZiAoU3ltYm9sUmVnaXN0cnlba2V5XSA9PT0gc3ltKSByZXR1cm4ga2V5O1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uICgpIHsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbiAoKSB7IHNldHRlciA9IGZhbHNlOyB9XG59KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6ICRjcmVhdGUsXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogJGRlZmluZVByb3BlcnR5LFxuICAvLyAxOS4xLjIuMyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiAkZGVmaW5lUHJvcGVydGllcyxcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogJGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIDI0LjMuMiBKU09OLnN0cmluZ2lmeSh2YWx1ZSBbLCByZXBsYWNlciBbLCBzcGFjZV1dKVxuJEpTT04gJiYgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgJGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoeyBhOiBTIH0pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCkge1xuICAgIHZhciBhcmdzID0gW2l0XTtcbiAgICB2YXIgaSA9IDE7XG4gICAgdmFyIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUgKGFyZ3VtZW50cy5sZW5ndGggPiBpKSBhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgICRyZXBsYWNlciA9IHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgICBpZiAoIWlzT2JqZWN0KHJlcGxhY2VyKSAmJiBpdCA9PT0gdW5kZWZpbmVkIHx8IGlzU3ltYm9sKGl0KSkgcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgaWYgKCFpc0FycmF5KHJlcGxhY2VyKSkgcmVwbGFjZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiAkcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykgdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gICAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xuICB9XG59KTtcblxuLy8gMTkuNC4zLjQgU3ltYm9sLnByb3RvdHlwZVtAQHRvUHJpbWl0aXZlXShoaW50KVxuJFN5bWJvbFtQUk9UT1RZUEVdW1RPX1BSSU1JVElWRV0gfHwgcmVxdWlyZSgnLi9faGlkZScpKCRTeW1ib2xbUFJPVE9UWVBFXSwgVE9fUFJJTUlUSVZFLCAkU3ltYm9sW1BST1RPVFlQRV0udmFsdWVPZik7XG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtb2JqZWN0LXZhbHVlcy1lbnRyaWVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRlbnRyaWVzID0gcmVxdWlyZSgnLi9fb2JqZWN0LXRvLWFycmF5JykodHJ1ZSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0Jywge1xuICBlbnRyaWVzOiBmdW5jdGlvbiBlbnRyaWVzKGl0KSB7XG4gICAgcmV0dXJuICRlbnRyaWVzKGl0KTtcbiAgfVxufSk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1vYmplY3QtdmFsdWVzLWVudHJpZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJHZhbHVlcyA9IHJlcXVpcmUoJy4vX29iamVjdC10by1hcnJheScpKGZhbHNlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7XG4gIHZhbHVlczogZnVuY3Rpb24gdmFsdWVzKGl0KSB7XG4gICAgcmV0dXJuICR2YWx1ZXMoaXQpO1xuICB9XG59KTtcbiIsInJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKSgnYXN5bmNJdGVyYXRvcicpO1xuIiwidmFyICRpdGVyYXRvcnMgPSByZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHdrcyA9IHJlcXVpcmUoJy4vX3drcycpO1xudmFyIElURVJBVE9SID0gd2tzKCdpdGVyYXRvcicpO1xudmFyIFRPX1NUUklOR19UQUcgPSB3a3MoJ3RvU3RyaW5nVGFnJyk7XG52YXIgQXJyYXlWYWx1ZXMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbnZhciBET01JdGVyYWJsZXMgPSB7XG4gIENTU1J1bGVMaXN0OiB0cnVlLCAvLyBUT0RPOiBOb3Qgc3BlYyBjb21wbGlhbnQsIHNob3VsZCBiZSBmYWxzZS5cbiAgQ1NTU3R5bGVEZWNsYXJhdGlvbjogZmFsc2UsXG4gIENTU1ZhbHVlTGlzdDogZmFsc2UsXG4gIENsaWVudFJlY3RMaXN0OiBmYWxzZSxcbiAgRE9NUmVjdExpc3Q6IGZhbHNlLFxuICBET01TdHJpbmdMaXN0OiBmYWxzZSxcbiAgRE9NVG9rZW5MaXN0OiB0cnVlLFxuICBEYXRhVHJhbnNmZXJJdGVtTGlzdDogZmFsc2UsXG4gIEZpbGVMaXN0OiBmYWxzZSxcbiAgSFRNTEFsbENvbGxlY3Rpb246IGZhbHNlLFxuICBIVE1MQ29sbGVjdGlvbjogZmFsc2UsXG4gIEhUTUxGb3JtRWxlbWVudDogZmFsc2UsXG4gIEhUTUxTZWxlY3RFbGVtZW50OiBmYWxzZSxcbiAgTWVkaWFMaXN0OiB0cnVlLCAvLyBUT0RPOiBOb3Qgc3BlYyBjb21wbGlhbnQsIHNob3VsZCBiZSBmYWxzZS5cbiAgTWltZVR5cGVBcnJheTogZmFsc2UsXG4gIE5hbWVkTm9kZU1hcDogZmFsc2UsXG4gIE5vZGVMaXN0OiB0cnVlLFxuICBQYWludFJlcXVlc3RMaXN0OiBmYWxzZSxcbiAgUGx1Z2luOiBmYWxzZSxcbiAgUGx1Z2luQXJyYXk6IGZhbHNlLFxuICBTVkdMZW5ndGhMaXN0OiBmYWxzZSxcbiAgU1ZHTnVtYmVyTGlzdDogZmFsc2UsXG4gIFNWR1BhdGhTZWdMaXN0OiBmYWxzZSxcbiAgU1ZHUG9pbnRMaXN0OiBmYWxzZSxcbiAgU1ZHU3RyaW5nTGlzdDogZmFsc2UsXG4gIFNWR1RyYW5zZm9ybUxpc3Q6IGZhbHNlLFxuICBTb3VyY2VCdWZmZXJMaXN0OiBmYWxzZSxcbiAgU3R5bGVTaGVldExpc3Q6IHRydWUsIC8vIFRPRE86IE5vdCBzcGVjIGNvbXBsaWFudCwgc2hvdWxkIGJlIGZhbHNlLlxuICBUZXh0VHJhY2tDdWVMaXN0OiBmYWxzZSxcbiAgVGV4dFRyYWNrTGlzdDogZmFsc2UsXG4gIFRvdWNoTGlzdDogZmFsc2Vcbn07XG5cbmZvciAodmFyIGNvbGxlY3Rpb25zID0gZ2V0S2V5cyhET01JdGVyYWJsZXMpLCBpID0gMDsgaSA8IGNvbGxlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gIHZhciBOQU1FID0gY29sbGVjdGlvbnNbaV07XG4gIHZhciBleHBsaWNpdCA9IERPTUl0ZXJhYmxlc1tOQU1FXTtcbiAgdmFyIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV07XG4gIHZhciBwcm90byA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIHZhciBrZXk7XG4gIGlmIChwcm90bykge1xuICAgIGlmICghcHJvdG9bSVRFUkFUT1JdKSBoaWRlKHByb3RvLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xuICAgIGlmICghcHJvdG9bVE9fU1RSSU5HX1RBR10pIGhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICAgIEl0ZXJhdG9yc1tOQU1FXSA9IEFycmF5VmFsdWVzO1xuICAgIGlmIChleHBsaWNpdCkgZm9yIChrZXkgaW4gJGl0ZXJhdG9ycykgaWYgKCFwcm90b1trZXldKSByZWRlZmluZShwcm90bywga2V5LCAkaXRlcmF0b3JzW2tleV0sIHRydWUpO1xuICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBQYXJ0aWNsZXNfMSA9IHJlcXVpcmUoXCIuLi9QYXJ0aWNsZXMvUGFydGljbGVzXCIpO1xudmFyIFN0YXJzXzEgPSByZXF1aXJlKFwiLi9TdGFyc1wiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIGNhbnZhcyA9IG5ldyBQYXJ0aWNsZXNfMS5kZWZhdWx0KCcjcGFydGljbGVzJywgJzJkJyk7XG5jYW52YXMuc2V0UGFydGljbGVTZXR0aW5ncyhTdGFyc18xLlN0YXJzLlBhcnRpY2xlcyk7XG5jYW52YXMuc2V0SW50ZXJhY3RpdmVTZXR0aW5ncyhTdGFyc18xLlN0YXJzLkludGVyYWN0aXZlKTtcbmNhbnZhcy5zdGFydCgpO1xudmFyIHBhdXNlZCA9IGZhbHNlO1xuV2ViUGFnZV8xLlNjcm9sbEhvb2suYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdjYW52YXMnKS5pblZpZXcoKSkge1xuICAgICAgICBpZiAocGF1c2VkKSB7XG4gICAgICAgICAgICBwYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNhbnZhcy5yZXN1bWUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKCFwYXVzZWQpIHtcbiAgICAgICAgICAgIHBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICBjYW52YXMucGF1c2UoKTtcbiAgICAgICAgfVxuICAgIH1cbn0sIHtcbiAgICBjYXB0dXJlOiB0cnVlLFxuICAgIHBhc3NpdmU6IHRydWVcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlN0YXJzID0gdm9pZCAwO1xuZXhwb3J0cy5TdGFycyA9IHtcbiAgICBQYXJ0aWNsZXM6IHtcbiAgICAgICAgbnVtYmVyOiAzMDAsXG4gICAgICAgIGRlbnNpdHk6IDIwMCxcbiAgICAgICAgY29sb3I6ICcjRkZGRkZGJyxcbiAgICAgICAgb3BhY2l0eTogJ3JhbmRvbScsXG4gICAgICAgIHJhZGl1czogWzIsIDIuNSwgMywgMy41LCA0LCA0LjVdLFxuICAgICAgICBzaGFwZTogJ2NpcmNsZScsXG4gICAgICAgIHN0cm9rZToge1xuICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgICAgIH0sXG4gICAgICAgIG1vdmU6IHtcbiAgICAgICAgICAgIHNwZWVkOiAwLjIsXG4gICAgICAgICAgICBkaXJlY3Rpb246ICdyYW5kb20nLFxuICAgICAgICAgICAgc3RyYWlnaHQ6IGZhbHNlLFxuICAgICAgICAgICAgcmFuZG9tOiB0cnVlLFxuICAgICAgICAgICAgZWRnZUJvdW5jZTogZmFsc2UsXG4gICAgICAgICAgICBhdHRyYWN0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIHJlc2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgIGhvdmVyOiAnYnViYmxlJyxcbiAgICAgICAgICAgIGNsaWNrOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBhbmltYXRlOiB7XG4gICAgICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuMixcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgc3luYzogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYWRpdXM6IHtcbiAgICAgICAgICAgICAgICBzcGVlZDogMyxcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgc3luYzogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgSW50ZXJhY3RpdmU6IHtcbiAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgIGJ1YmJsZToge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiA3NSxcbiAgICAgICAgICAgICAgICByYWRpdXM6IDgsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG52YXIgQ29tcG9uZW50cztcbihmdW5jdGlvbiAoQ29tcG9uZW50cykge1xuICAgIHZhciBIZWxwZXJzO1xuICAgIChmdW5jdGlvbiAoSGVscGVycykge1xuICAgICAgICBmdW5jdGlvbiBydW5JZkRlZmluZWQoX3RoaXMsIG1ldGhvZCwgZGF0YSkge1xuICAgICAgICAgICAgaWYgKF90aGlzW21ldGhvZF0gJiYgX3RoaXNbbWV0aG9kXSBpbnN0YW5jZW9mIEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgICAgX3RoaXNbbWV0aG9kXShkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBIZWxwZXJzLnJ1bklmRGVmaW5lZCA9IHJ1bklmRGVmaW5lZDtcbiAgICAgICAgZnVuY3Rpb24gYXR0YWNoSW50ZXJmYWNlKF90aGlzLCBuYW1lKSB7XG4gICAgICAgICAgICBSZWZsZWN0LmRlZmluZVByb3BlcnR5KF90aGlzLCBuYW1lLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IEludGVyZmFjZVtuYW1lXSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgSGVscGVycy5hdHRhY2hJbnRlcmZhY2UgPSBhdHRhY2hJbnRlcmZhY2U7XG4gICAgfSkoSGVscGVycyB8fCAoSGVscGVycyA9IHt9KSk7XG4gICAgdmFyIEludGVyZmFjZTtcbiAgICAoZnVuY3Rpb24gKEludGVyZmFjZSkge1xuICAgICAgICBmdW5jdGlvbiBhcHBlbmRUbyhwYXJlbnQpIHtcbiAgICAgICAgICAgIHZhciBfdGhpc18xID0gdGhpcztcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCFfdGhpc18xLl9tb3VudGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIEV2ZW50cy5kaXNwYXRjaChfdGhpc18xLCAnbW91bnRlZCcsIHsgcGFyZW50OiBwYXJlbnQgfSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzXzEuX21vdW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICB9XG4gICAgICAgIEludGVyZmFjZS5hcHBlbmRUbyA9IGFwcGVuZFRvO1xuICAgIH0pKEludGVyZmFjZSB8fCAoSW50ZXJmYWNlID0ge30pKTtcbiAgICB2YXIgRXZlbnRzO1xuICAgIChmdW5jdGlvbiAoRXZlbnRzKSB7XG4gICAgICAgIGZ1bmN0aW9uIGRpc3BhdGNoKF90aGlzLCBldmVudCwgZGF0YSkge1xuICAgICAgICAgICAgSGVscGVycy5ydW5JZkRlZmluZWQoX3RoaXMsIGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBFdmVudHMuZGlzcGF0Y2ggPSBkaXNwYXRjaDtcbiAgICB9KShFdmVudHMgfHwgKEV2ZW50cyA9IHt9KSk7XG4gICAgdmFyIF9fQmFzZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIF9fQmFzZSgpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9fQmFzZTtcbiAgICB9KCkpO1xuICAgIHZhciBDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoQ29tcG9uZW50LCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBDb21wb25lbnQoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXNfMSA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgICAgICBfdGhpc18xLmVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgX3RoaXNfMS5fbW91bnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgX3RoaXNfMS5fc2V0dXBJbnRlcmZhY2UoKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpc18xO1xuICAgICAgICB9XG4gICAgICAgIENvbXBvbmVudC5wcm90b3R5cGUuX3NldHVwSW50ZXJmYWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgSGVscGVycy5hdHRhY2hJbnRlcmZhY2UodGhpcywgJ2FwcGVuZFRvJyk7XG4gICAgICAgIH07XG4gICAgICAgIENvbXBvbmVudC5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7IH07XG4gICAgICAgIENvbXBvbmVudC5wcm90b3R5cGUuZ2V0UmVmZXJlbmNlID0gZnVuY3Rpb24gKHJlZikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiW3JlZj1cXFwiXCIgKyByZWYgKyBcIlxcXCJdXCIpIHx8IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBDb21wb25lbnQ7XG4gICAgfShfX0Jhc2UpKTtcbiAgICB2YXIgSW5pdGlhbGl6ZTtcbiAgICAoZnVuY3Rpb24gKEluaXRpYWxpemUpIHtcbiAgICAgICAgZnVuY3Rpb24gX19Jbml0aWFsaXplKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gdGhpcy5jcmVhdGVFbGVtZW50KCk7XG4gICAgICAgICAgICBFdmVudHMuZGlzcGF0Y2godGhpcywgJ2NyZWF0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBNYWluKF90aGlzKSB7XG4gICAgICAgICAgICAoX19Jbml0aWFsaXplLmJpbmQoX3RoaXMpKSgpO1xuICAgICAgICB9XG4gICAgICAgIEluaXRpYWxpemUuTWFpbiA9IE1haW47XG4gICAgfSkoSW5pdGlhbGl6ZSB8fCAoSW5pdGlhbGl6ZSA9IHt9KSk7XG4gICAgdmFyIEhUTUxDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoSFRNTENvbXBvbmVudCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gSFRNTENvbXBvbmVudCgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpc18xID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgICAgIEluaXRpYWxpemUuTWFpbihfdGhpc18xKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpc18xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBIVE1MQ29tcG9uZW50O1xuICAgIH0oQ29tcG9uZW50KSk7XG4gICAgQ29tcG9uZW50cy5IVE1MQ29tcG9uZW50ID0gSFRNTENvbXBvbmVudDtcbiAgICB2YXIgRGF0YUNvbXBvbmVudCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhEYXRhQ29tcG9uZW50LCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBEYXRhQ29tcG9uZW50KGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBfdGhpc18xID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgICAgIF90aGlzXzEuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICBJbml0aWFsaXplLk1haW4oX3RoaXNfMSk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXNfMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGF0YUNvbXBvbmVudDtcbiAgICB9KENvbXBvbmVudCkpO1xuICAgIENvbXBvbmVudHMuRGF0YUNvbXBvbmVudCA9IERhdGFDb21wb25lbnQ7XG59KShDb21wb25lbnRzIHx8IChDb21wb25lbnRzID0ge30pKTtcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50cztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVkdWNhdGlvbiA9IHZvaWQgMDtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50XCIpO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvRE9NXCIpO1xudmFyIEVkdWNhdGlvbiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEVkdWNhdGlvbiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFZHVjYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgRWR1Y2F0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgRWR1Y2F0aW9uLnByb3RvdHlwZS5jcmVhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBET01fMS5ET00ub25GaXJzdEFwcGVhcmFuY2UodGhpcy5lbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5zZXRQcm9ncmVzcygpO1xuICAgICAgICB9LCB7IHRpbWVvdXQ6IDUwMCwgb2Zmc2V0OiAwLjMgfSk7XG4gICAgfTtcbiAgICBFZHVjYXRpb24ucHJvdG90eXBlLnNldFByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29tcGxldGVkID0gdGhpcy5kYXRhLmNyZWRpdHMuY29tcGxldGVkIC8gdGhpcy5kYXRhLmNyZWRpdHMudG90YWwgKiAxMDAgKyBcIiVcIjtcbiAgICAgICAgdmFyIHRha2luZyA9ICh0aGlzLmRhdGEuY3JlZGl0cy5jb21wbGV0ZWQgKyB0aGlzLmRhdGEuY3JlZGl0cy50YWtpbmcpIC8gdGhpcy5kYXRhLmNyZWRpdHMudG90YWwgKiAxMDAgKyBcIiVcIjtcbiAgICAgICAgdGhpcy5nZXRSZWZlcmVuY2UoJ2NvbXBsZXRlZFRyYWNrJykuc3R5bGUud2lkdGggPSBjb21wbGV0ZWQ7XG4gICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCd0YWtpbmdUcmFjaycpLnN0eWxlLndpZHRoID0gdGFraW5nO1xuICAgICAgICB2YXIgY29tcGxldGVkTWFya2VyID0gdGhpcy5nZXRSZWZlcmVuY2UoJ2NvbXBsZXRlZE1hcmtlcicpO1xuICAgICAgICB2YXIgdGFraW5nTWFya2VyID0gdGhpcy5nZXRSZWZlcmVuY2UoJ3Rha2luZ01hcmtlcicpO1xuICAgICAgICBjb21wbGV0ZWRNYXJrZXIuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgICAgY29tcGxldGVkTWFya2VyLnN0eWxlLmxlZnQgPSBjb21wbGV0ZWQ7XG4gICAgICAgIHRha2luZ01hcmtlci5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgICAgICB0YWtpbmdNYXJrZXIuc3R5bGUubGVmdCA9IHRha2luZztcbiAgICB9O1xuICAgIEVkdWNhdGlvbi5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlubGluZVN0eWxlID0ge1xuICAgICAgICAgICAgJy0tcHJvZ3Jlc3MtYmFyLWNvbG9yJzogdGhpcy5kYXRhLmNvbG9yXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJlZHVjYXRpb24gY2FyZCBpcy10aGVtZS1zZWNvbmRhcnkgZWxldmF0aW9uLTFcIiwgc3R5bGU6IGlubGluZVN0eWxlIH0sXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImNvbnRlbnQgcGFkZGluZy0yXCIgfSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImJvZHlcIiB9LFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImhlYWRlciBmbGV4IHJvdyBzbS13cmFwIG1kLW5vd3JhcCB4cy14LWNlbnRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJpY29uIHhzLWF1dG9cIiwgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IFwib3V0L2ltYWdlcy9FZHVjYXRpb24vXCIgKyB0aGlzLmRhdGEuaW1hZ2UgfSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJhYm91dCB4cy1mdWxsXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImluc3RpdHV0aW9uIGZsZXggcm93IHhzLXgtY2VudGVyIHhzLXktY2VudGVyIG1kLXgtYmVnaW5cIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJuYW1lIHhzLWZ1bGwgbWQtYXV0byBpcy1jZW50ZXItYWxpZ25lZCBpcy1ib2xkLXdlaWdodCBpcy1zaXplLTYgaXMtY29sb3JlZC1saW5rXCIsIGhyZWY6IHRoaXMuZGF0YS5saW5rLCB0YXJnZXQ6IFwiX2JsYW5rXCIgfSwgdGhpcy5kYXRhLm5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJsb2NhdGlvbiBtZC14LXNlbGYtZW5kIGlzLWl0YWxpYyBpcy1zaXplLTggaXMtY29sb3ItbGlnaHRcIiB9LCB0aGlzLmRhdGEubG9jYXRpb24pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImRlZ3JlZSBmbGV4IHJvdyB4cy14LWNlbnRlciB4cy15LWNlbnRlciBtZC14LWJlZ2luXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwibmFtZSB4cy1mdWxsIG1kLWF1dG8gaXMtY2VudGVyLWFsaWduZWQgaXMtYm9sZC13ZWlnaHQgaXMtc2l6ZS03IGlzLWNvbG9yLWxpZ2h0XCIgfSwgdGhpcy5kYXRhLmRlZ3JlZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImRhdGUgbWQteC1zZWxmLWVuZCBpcy1pdGFsaWMgaXMtc2l6ZS04IGlzLWNvbG9yLWxpZ2h0XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiKFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLnN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXFx1MjAxNCBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5lbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIilcIikpKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicHJvZ3Jlc3MgZmxleCByb3cgeHMtbm93cmFwIHhzLXktY2VudGVyIHByb2dyZXNzLWJhci1ob3Zlci1jb250YWluZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwcm9ncmVzcy1iYXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29tcGxldGVkIG1hcmtlclwiLCBzdHlsZTogeyBvcGFjaXR5OiAwIH0sIHJlZjogXCJjb21wbGV0ZWRNYXJrZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJpcy1zaXplLThcIiB9LCB0aGlzLmRhdGEuY3JlZGl0cy5jb21wbGV0ZWQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRha2luZyBtYXJrZXJcIiwgc3R5bGU6IHsgb3BhY2l0eTogMCB9LCByZWY6IFwidGFraW5nTWFya2VyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiaXMtc2l6ZS04XCIgfSwgdGhpcy5kYXRhLmNyZWRpdHMuY29tcGxldGVkICsgdGhpcy5kYXRhLmNyZWRpdHMudGFraW5nKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0cmFja1wiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYnVmZmVyXCIsIHJlZjogXCJ0YWtpbmdUcmFja1wiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiZmlsbFwiLCByZWY6IFwiY29tcGxldGVkVHJhY2tcIiB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJjcmVkaXRzIGlzLXNpemUtOCB4cy1hdXRvXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuY3JlZGl0cy50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBjcmVkaXRzXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpbmZvIGNvbnRlbnQgcGFkZGluZy14LTQgcGFkZGluZy15LTJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiaXMtbGlnaHQtY29sb3IgaXMtc2l6ZS04IGlzLWl0YWxpY1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJHUEEgLyBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuZ3BhLm92ZXJhbGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgKG92ZXJhbGwpIC8gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLmdwYS5tYWpvcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiAobWFqb3IpXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLm5vdGVzLm1hcChmdW5jdGlvbiAobm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJpcy1saWdodC1jb2xvciBpcy1zaXplLTggaXMtaXRhbGljXCIgfSwgbm90ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY291cnNlc1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiaXMtYm9sZC13ZWlnaHQgaXMtc2l6ZS02XCIgfSwgXCJSZWNlbnQgQ291cnNld29ya1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwidWxcIiwgeyBjbGFzc05hbWU6IFwiZmxleCByb3cgaXMtc2l6ZS03XCIgfSwgdGhpcy5kYXRhLmNvdXJzZXMubWFwKGZ1bmN0aW9uIChjb3Vyc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7IGNsYXNzTmFtZTogXCJ4cy0xMiBtZC02XCIgfSwgY291cnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSkpKSkpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gRWR1Y2F0aW9uO1xufShDb21wb25lbnRfMS5EYXRhQ29tcG9uZW50KSk7XG5leHBvcnRzLkVkdWNhdGlvbiA9IEVkdWNhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkV4cGVyaWVuY2UgPSB2b2lkIDA7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBFeHBlcmllbmNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRXhwZXJpZW5jZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFeHBlcmllbmNlKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIEV4cGVyaWVuY2UucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICBFeHBlcmllbmNlLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY2FyZCBpcy10aGVtZS1zZWNvbmRhcnkgZWxldmF0aW9uLTEgZXhwZXJpZW5jZVwiIH0sXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImNvbnRlbnQgcGFkZGluZy0yXCIgfSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImhlYWRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaWNvblwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGhyZWY6IHRoaXMuZGF0YS5saW5rLCB0YXJnZXQ6IFwiX2JsYW5rXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBcIi4vb3V0L2ltYWdlcy9FeHBlcmllbmNlL1wiICsgdGhpcy5kYXRhLnN2ZyArIFwiLnN2Z1wiIH0pKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29tcGFueVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGhyZWY6IHRoaXMuZGF0YS5saW5rLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIGNsYXNzTmFtZTogXCJuYW1lIGlzLXNpemUtNiBpcy1ib2xkLXdlaWdodCBpcy1jb2xvcmVkLWxpbmtcIiB9LCB0aGlzLmRhdGEuY29tcGFueSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJsb2NhdGlvbiBpcy1zaXplLTggaXMtaXRhbGljIGlzLWNvbG9yLWxpZ2h0XCIgfSwgdGhpcy5kYXRhLmxvY2F0aW9uKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicm9sZVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJuYW1lIGlzLXNpemUtNyBpcy1ib2xkLXdlaWdodFwiIH0sIHRoaXMuZGF0YS5wb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJkYXRlIGlzLXNpemUtOCBpcy1pdGFsaWMgaXMtY29sb3ItbGlnaHRcIiB9LCBcIihcIiArIHRoaXMuZGF0YS5iZWdpbiArIFwiIFxcdTIwMTQgXCIgKyB0aGlzLmRhdGEuZW5kICsgXCIpXCIpKSksXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBpbmZvXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZGVzY3JpcHRpb24gaXMtc2l6ZS04IGlzLWNvbG9yLWxpZ2h0IGlzLWl0YWxpYyBpcy1qdXN0aWZpZWQgaXMtcXVvdGVcIiB9LCB0aGlzLmRhdGEuZmxhdm9yKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInVsXCIsIHsgY2xhc3NOYW1lOiBcImpvYiBpcy1sZWZ0LWFsaWduZWQgaXMtc2l6ZS03IHhzLXktcGFkZGluZy1iZXR3ZWVuLTFcIiB9LCB0aGlzLmRhdGEucm9sZXMubWFwKGZ1bmN0aW9uIChyb2xlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIHJvbGUpO1xuICAgICAgICAgICAgICAgICAgICB9KSkpKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIEV4cGVyaWVuY2U7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuRXhwZXJpZW5jZSA9IEV4cGVyaWVuY2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBIZWxwZXJzO1xuKGZ1bmN0aW9uIChIZWxwZXJzKSB7XG4gICAgZnVuY3Rpb24gbG9hZE9uRmlyc3RBcHBlYXJhbmNlKGhvb2ssIGNsYXNzTmFtZSkge1xuICAgICAgICBpZiAoY2xhc3NOYW1lID09PSB2b2lkIDApIHsgY2xhc3NOYW1lID0gJ3ByZWxvYWQnOyB9XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBob29rLmNsYXNzTGlzdC5hZGQoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgIERPTV8xLkRPTS5vbkZpcnN0QXBwZWFyYW5jZShob29rLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgaG9vay5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfSwgeyBvZmZzZXQ6IDAuNSB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIEhlbHBlcnMubG9hZE9uRmlyc3RBcHBlYXJhbmNlID0gbG9hZE9uRmlyc3RBcHBlYXJhbmNlO1xufSkoSGVscGVycyB8fCAoSGVscGVycyA9IHt9KSk7XG5tb2R1bGUuZXhwb3J0cyA9IEhlbHBlcnM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5NZW51ID0gdm9pZCAwO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvRE9NXCIpO1xudmFyIEV2ZW50RGlzcGF0Y2hlcl8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvRXZlbnREaXNwYXRjaGVyXCIpO1xudmFyIE1lbnUgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhNZW51LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1lbnUoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLm9wZW4gPSBmYWxzZTtcbiAgICAgICAgX3RoaXMuUkdCUmVnRXhwID0gLyhyZ2JcXCgoWzAtOV17MSwzfSksIChbMC05XXsxLDN9KSwgKFswLTldezEsM30pXFwpKXwocmdiYVxcKChbMC05XXsxLDN9KSwgKFswLTldezEsM30pLCAoWzAtOV17MSwzfSksICgwKD86XFwuWzAtOV17MSwyfSk/KVxcKSkvZztcbiAgICAgICAgX3RoaXMuQ29udGFpbmVyID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnaGVhZGVyLm1lbnUnKTtcbiAgICAgICAgX3RoaXMuSGFtYnVyZ2VyID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnaGVhZGVyLm1lbnUgLmhhbWJ1cmdlcicpO1xuICAgICAgICBfdGhpcy5yZWdpc3RlcigndG9nZ2xlJyk7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgTWVudS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLm9wZW4gPSAhdGhpcy5vcGVuO1xuICAgICAgICB0aGlzLm9wZW4gPyB0aGlzLm9wZW5NZW51KCkgOiB0aGlzLmNsb3NlTWVudSgpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoKCd0b2dnbGUnLCB7IG9wZW46IHRoaXMub3BlbiB9KTtcbiAgICB9O1xuICAgIE1lbnUucHJvdG90eXBlLm9wZW5NZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLkNvbnRhaW5lci5zZXRBdHRyaWJ1dGUoJ29wZW4nLCAnJyk7XG4gICAgICAgIHRoaXMuZGFya2VuKCk7XG4gICAgfTtcbiAgICBNZW51LnByb3RvdHlwZS5jbG9zZU1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuQ29udGFpbmVyLnJlbW92ZUF0dHJpYnV0ZSgnb3BlbicpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLnVwZGF0ZUNvbnRyYXN0KCk7IH0sIDc1MCk7XG4gICAgfTtcbiAgICBNZW51LnByb3RvdHlwZS5kYXJrZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuSGFtYnVyZ2VyLmNsYXNzTGlzdC5yZW1vdmUoJ2xpZ2h0Jyk7XG4gICAgfTtcbiAgICBNZW51LnByb3RvdHlwZS5saWdodGVuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLkhhbWJ1cmdlci5jbGFzc0xpc3QuYWRkKCdsaWdodCcpO1xuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUudXBkYXRlQ29udHJhc3QgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghdGhpcy5vcGVuKSB7XG4gICAgICAgICAgICB2YXIgYmFja2dyb3VuZENvbG9yID0gdGhpcy5nZXRCYWNrZ3JvdW5kQ29sb3IoKTtcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlQ29udHJhc3QoYmFja2dyb3VuZENvbG9yKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUuZ2V0QmFja2dyb3VuZENvbG9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZWxlbWVudHNGcm9tUG9pbnQgPSBkb2N1bWVudC5lbGVtZW50c0Zyb21Qb2ludCA/ICdlbGVtZW50c0Zyb21Qb2ludCcgOiAnbXNFbGVtZW50c0Zyb21Qb2ludCc7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuSGFtYnVyZ2VyLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLCB0b3AgPSBfYS50b3AsIGxlZnQgPSBfYS5sZWZ0O1xuICAgICAgICB2YXIgZWxlbWVudHMgPSBkb2N1bWVudFtlbGVtZW50c0Zyb21Qb2ludF0obGVmdCwgdG9wKTtcbiAgICAgICAgdmFyIGxlbmd0aCA9IGVsZW1lbnRzLmxlbmd0aDtcbiAgICAgICAgdmFyIFJHQiA9IFtdO1xuICAgICAgICB2YXIgYmFja2dyb3VuZCwgcmVnRXhSZXN1bHQ7XG4gICAgICAgIHZhciBzdHlsZXM7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgbGVuZ3RoOyArK2ksIHRoaXMuUkdCUmVnRXhwLmxhc3RJbmRleCA9IDApIHtcbiAgICAgICAgICAgIHN0eWxlcyA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsZW1lbnRzW2ldKTtcbiAgICAgICAgICAgIGJhY2tncm91bmQgPSBzdHlsZXMuYmFja2dyb3VuZCB8fCBzdHlsZXMuYmFja2dyb3VuZENvbG9yICsgc3R5bGVzLmJhY2tncm91bmRJbWFnZTtcbiAgICAgICAgICAgIHdoaWxlIChyZWdFeFJlc3VsdCA9IHRoaXMuUkdCUmVnRXhwLmV4ZWMoYmFja2dyb3VuZCkpIHtcbiAgICAgICAgICAgICAgICBpZiAocmVnRXhSZXN1bHRbMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgUkdCID0gcmVnRXhSZXN1bHQuc2xpY2UoMiwgNSkubWFwKGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHBhcnNlSW50KHZhbCk7IH0pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gUkdCO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChyZWdFeFJlc3VsdFs1XSkge1xuICAgICAgICAgICAgICAgICAgICBSR0IgPSByZWdFeFJlc3VsdC5zbGljZSg2LCAxMCkubWFwKGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHBhcnNlSW50KHZhbCk7IH0pO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIVJHQi5ldmVyeShmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgPT09IDA7IH0pKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUkdCO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSR0I7XG4gICAgfTtcbiAgICBNZW51LnByb3RvdHlwZS5jaGFuZ2VDb250cmFzdCA9IGZ1bmN0aW9uIChSR0IpIHtcbiAgICAgICAgdmFyIGNvbnRyYXN0LCBsdW1pbmFuY2U7XG4gICAgICAgIGlmIChSR0IubGVuZ3RoID09PSAzKSB7XG4gICAgICAgICAgICBjb250cmFzdCA9IFJHQi5tYXAoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsIC8gMjU1OyB9KS5tYXAoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWwgPD0gMC4wMzkyOCA/IHZhbCAvIDEyLjkyIDogTWF0aC5wb3coKHZhbCArIDAuMDU1KSAvIDEuMDU1LCAyLjQpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBsdW1pbmFuY2UgPSAwLjIxMjYgKiBjb250cmFzdFswXSArIDAuNzE1MiAqIGNvbnRyYXN0WzFdICsgMC4wNzIyICogY29udHJhc3RbMl07XG4gICAgICAgICAgICBpZiAobHVtaW5hbmNlID4gMC4xNzkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRhcmtlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5saWdodGVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRhcmtlbigpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gTWVudTtcbn0oRXZlbnREaXNwYXRjaGVyXzEuRXZlbnRzLkV2ZW50RGlzcGF0Y2hlcikpO1xuZXhwb3J0cy5NZW51ID0gTWVudTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlByb2plY3QgPSB2b2lkIDA7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBQcm9qZWN0ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUHJvamVjdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBQcm9qZWN0KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuaW5mb0Rpc3BsYXllZCA9IGZhbHNlO1xuICAgICAgICBfdGhpcy50b29sdGlwTGVmdCA9IHRydWU7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgUHJvamVjdC5wcm90b3R5cGUuY3JlYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5hd2FyZCkge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmNoZWNrVG9vbHRpcFNpZGUoKTsgfSwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQcm9qZWN0LnByb3RvdHlwZS5tb3VudGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhLmF3YXJkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrVG9vbHRpcFNpZGUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUHJvamVjdC5wcm90b3R5cGUuY2hlY2tUb29sdGlwU2lkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvb2x0aXAgPSB0aGlzLmdldFJlZmVyZW5jZSgndG9vbHRpcCcpO1xuICAgICAgICB2YXIgdG9vbHRpcFBvcyA9IHRvb2x0aXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgICAgdmFyIHNjcmVlbldpZHRoID0gRE9NXzEuRE9NLmdldFZpZXdwb3J0KCkud2lkdGg7XG4gICAgICAgIGlmICh0aGlzLnRvb2x0aXBMZWZ0ICE9PSAodG9vbHRpcFBvcyA+PSBzY3JlZW5XaWR0aCAvIDIpKSB7XG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBMZWZ0ID0gIXRoaXMudG9vbHRpcExlZnQ7XG4gICAgICAgICAgICB2YXIgYWRkID0gdGhpcy50b29sdGlwTGVmdCA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgICAgICAgICAgdmFyIHJlbW92ZSA9IHRoaXMudG9vbHRpcExlZnQgPyAndG9wJyA6ICdsZWZ0JztcbiAgICAgICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZShyZW1vdmUpO1xuICAgICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKGFkZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFByb2plY3QucHJvdG90eXBlLmxlc3NJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluZm9EaXNwbGF5ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9O1xuICAgIFByb2plY3QucHJvdG90eXBlLnRvZ2dsZUluZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5mb0Rpc3BsYXllZCA9ICF0aGlzLmluZm9EaXNwbGF5ZWQ7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfTtcbiAgICBQcm9qZWN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmluZm9EaXNwbGF5ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdzbGlkZXInKS5zZXRBdHRyaWJ1dGUoJ29wZW5lZCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdzbGlkZXInKS5yZW1vdmVBdHRyaWJ1dGUoJ29wZW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdpbmZvVGV4dCcpLmlubmVySFRNTCA9ICh0aGlzLmluZm9EaXNwbGF5ZWQgPyAnTGVzcycgOiAnTW9yZScpICsgXCIgSW5mb1wiO1xuICAgIH07XG4gICAgUHJvamVjdC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlubGluZVN0eWxlID0ge1xuICAgICAgICAgICAgJy0tYnV0dG9uLWJhY2tncm91bmQtY29sb3InOiB0aGlzLmRhdGEuY29sb3JcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGltYWdlU3R5bGUgPSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IFwidXJsKFwiICsgKFwiLi9vdXQvaW1hZ2VzL1Byb2plY3RzL1wiICsgdGhpcy5kYXRhLmltYWdlKSArIFwiKVwiXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ4cy0xMiBzbS02IG1kLTRcIiB9LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmF3YXJkID9cbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImF3YXJkXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0b29sdGlwLWNvbnRhaW5lclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBcIm91dC9pbWFnZXMvUHJvamVjdHMvYXdhcmQucG5nXCIgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHJlZjogXCJ0b29sdGlwXCIsIGNsYXNzTmFtZTogXCJ0b29sdGlwIGxlZnQgaXMtc2l6ZS04XCIgfSwgdGhpcy5kYXRhLmF3YXJkKSkpXG4gICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwcm9qZWN0IGNhcmQgaXMtdGhlbWUtc2Vjb25kYXJ5IGVsZXZhdGlvbi0xIGlzLWluLWdyaWQgaGlkZS1vdmVyZmxvd1wiLCBzdHlsZTogaW5saW5lU3R5bGUgfSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImltYWdlXCIsIHN0eWxlOiBpbWFnZVN0eWxlIH0pLFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTJcIiB9LFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRpdGxlXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcIm5hbWUgaXMtc2l6ZS02IGlzLWJvbGQtd2VpZ2h0XCIsIHN0eWxlOiB7IGNvbG9yOiB0aGlzLmRhdGEuY29sb3IgfSB9LCB0aGlzLmRhdGEubmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJ0eXBlIGlzLXNpemUtOFwiIH0sIHRoaXMuZGF0YS50eXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImRhdGUgaXMtc2l6ZS04IGlzLWNvbG9yLWxpZ2h0XCIgfSwgdGhpcy5kYXRhLmRhdGUpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJib2R5XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImZsYXZvciBpcy1zaXplLTdcIiB9LCB0aGlzLmRhdGEuZmxhdm9yKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic2xpZGVyIGlzLXRoZW1lLXNlY29uZGFyeVwiLCByZWY6IFwic2xpZGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTRcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwidGl0bGUgZmxleCByb3cgeHMteC1iZWdpbiB4cy15LWNlbnRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlzLXNpemUtNiBpcy1ib2xkLXdlaWdodFwiIH0sIFwiRGV0YWlsc1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjbG9zZS1idG4td3JhcHBlciB4cy14LXNlbGYtZW5kXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnRuIGNsb3NlIGlzLXN2ZyBpcy1wcmltYXJ5XCIsIHRhYmluZGV4OiBcIi0xXCIsIG9uQ2xpY2s6IHRoaXMubGVzc0luZm8uYmluZCh0aGlzKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImZhcyBmYS10aW1lc1wiIH0pKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYm9keVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7IGNsYXNzTmFtZTogXCJkZXRhaWxzIHhzLXktcGFkZGluZy1iZXR3ZWVuLTEgaXMtc2l6ZS05XCIgfSwgdGhpcy5kYXRhLmRldGFpbHMubWFwKGZ1bmN0aW9uIChkZXRhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgZGV0YWlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpKSkpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcIm9wdGlvbnMgaXMtdGhlbWUtc2Vjb25kYXJ5IHhzLXgtbWFyZ2luLWJldHdlZW4tMVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcImluZm8gYnRuIGlzLXByaW1hcnkgaXMtdGV4dCBpcy1jdXN0b21cIiwgb25DbGljazogdGhpcy50b2dnbGVJbmZvLmJpbmQodGhpcykgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYXMgZmEtaW5mb1wiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgcmVmOiBcImluZm9UZXh0XCIgfSwgXCJNb3JlIEluZm9cIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLnJlcG8gP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgY2xhc3NOYW1lOiBcImNvZGUgYnRuIGlzLXByaW1hcnkgaXMtdGV4dCBpcy1jdXN0b21cIiwgaHJlZjogdGhpcy5kYXRhLnJlcG8sIHRhcmdldDogXCJfYmxhbmtcIiwgdGFiaW5kZXg6IFwiMFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImZhcyBmYS1jb2RlXCIgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIFwiU2VlIENvZGVcIikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLmV4dGVybmFsID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJleHRlcm5hbCBidG4gaXMtcHJpbWFyeSBpcy10ZXh0IGlzLWN1c3RvbVwiLCBocmVmOiB0aGlzLmRhdGEuZXh0ZXJuYWwsIHRhcmdldDogXCJfYmxhbmtcIiwgdGFiaW5kZXg6IFwiMFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImZhcyBmYS1leHRlcm5hbC1saW5rLWFsdFwiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBcIlZpZXcgT25saW5lXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCkpKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIFByb2plY3Q7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuUHJvamVjdCA9IFByb2plY3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5RdWFsaXR5ID0gdm9pZCAwO1xudmFyIEpTWF8xID0gcmVxdWlyZShcIi4uLy4uL0RlZmluaXRpb25zL0pTWFwiKTtcbnZhciBDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRcIik7XG52YXIgUXVhbGl0eSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFF1YWxpdHksIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUXVhbGl0eShkYXRhKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBkYXRhKSB8fCB0aGlzO1xuICAgIH1cbiAgICBRdWFsaXR5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgUXVhbGl0eS5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInhzLTEyIHNtLTRcIiB9LFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImlcIiwgeyBjbGFzc05hbWU6IFwiaWNvbiBcIiArIHRoaXMuZGF0YS5mYUNsYXNzIH0pLFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwicXVhbGl0eSBpcy1zaXplLTUgaXMtdXBwZXJjYXNlXCIgfSwgdGhpcy5kYXRhLm5hbWUpLFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZGVzYyBpcy1saWdodC13ZWlnaHQgaXMtc2l6ZS02XCIgfSwgdGhpcy5kYXRhLmRlc2NyaXB0aW9uKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIFF1YWxpdHk7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuUXVhbGl0eSA9IFF1YWxpdHk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBTZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTZWN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB9XG4gICAgU2VjdGlvbi5wcm90b3R5cGUuaW5WaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gRE9NXzEuRE9NLmluVmVydGljYWxXaW5kb3dWaWV3KHRoaXMuZWxlbWVudCk7XG4gICAgfTtcbiAgICBTZWN0aW9uLnByb3RvdHlwZS5nZXRJRCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pZDtcbiAgICB9O1xuICAgIFNlY3Rpb24ucHJvdG90eXBlLmluTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCduby1tZW51Jyk7XG4gICAgfTtcbiAgICByZXR1cm4gU2VjdGlvbjtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTZWN0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2tpbGwgPSBleHBvcnRzLlNraWxsQ2F0ZWdvcnkgPSB2b2lkIDA7XG52YXIgU1ZHXzEgPSByZXF1aXJlKFwiLi4vLi4vTW9kdWxlcy9TVkdcIik7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBTa2lsbENhdGVnb3J5O1xuKGZ1bmN0aW9uIChTa2lsbENhdGVnb3J5KSB7XG4gICAgU2tpbGxDYXRlZ29yeVtTa2lsbENhdGVnb3J5W1wiUHJvZ3JhbW1pbmdcIl0gPSAxXSA9IFwiUHJvZ3JhbW1pbmdcIjtcbiAgICBTa2lsbENhdGVnb3J5W1NraWxsQ2F0ZWdvcnlbXCJTY3JpcHRpbmdcIl0gPSAyXSA9IFwiU2NyaXB0aW5nXCI7XG4gICAgU2tpbGxDYXRlZ29yeVtTa2lsbENhdGVnb3J5W1wiV2ViXCJdID0gNF0gPSBcIldlYlwiO1xuICAgIFNraWxsQ2F0ZWdvcnlbU2tpbGxDYXRlZ29yeVtcIlNlcnZlclwiXSA9IDhdID0gXCJTZXJ2ZXJcIjtcbiAgICBTa2lsbENhdGVnb3J5W1NraWxsQ2F0ZWdvcnlbXCJEYXRhYmFzZVwiXSA9IDE2XSA9IFwiRGF0YWJhc2VcIjtcbiAgICBTa2lsbENhdGVnb3J5W1NraWxsQ2F0ZWdvcnlbXCJEZXZPcHNcIl0gPSAzMl0gPSBcIkRldk9wc1wiO1xuICAgIFNraWxsQ2F0ZWdvcnlbU2tpbGxDYXRlZ29yeVtcIkZyYW1ld29ya1wiXSA9IDY0XSA9IFwiRnJhbWV3b3JrXCI7XG4gICAgU2tpbGxDYXRlZ29yeVtTa2lsbENhdGVnb3J5W1wiT3RoZXJcIl0gPSAxMjhdID0gXCJPdGhlclwiO1xufSkoU2tpbGxDYXRlZ29yeSA9IGV4cG9ydHMuU2tpbGxDYXRlZ29yeSB8fCAoZXhwb3J0cy5Ta2lsbENhdGVnb3J5ID0ge30pKTtcbnZhciBTa2lsbCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNraWxsLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNraWxsKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIFNraWxsLnByb3RvdHlwZS5nZXRDYXRlZ29yeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YS5jYXRlZ29yeTtcbiAgICB9O1xuICAgIFNraWxsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgU2tpbGwucHJvdG90eXBlLmNyZWF0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIFNWR18xLlNWRy5sb2FkU1ZHKFwiLi9vdXQvaW1hZ2VzL1NraWxscy9cIiArIHRoaXMuZGF0YS5zdmcpLnRoZW4oZnVuY3Rpb24gKHN2Zykge1xuICAgICAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnaWNvbicpO1xuICAgICAgICAgICAgdmFyIGhleGFnb24gPSBfdGhpcy5nZXRSZWZlcmVuY2UoJ2hleGFnb24nKTtcbiAgICAgICAgICAgIGhleGFnb24ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc3ZnLCBoZXhhZ29uKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTa2lsbC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFTa2lsbC5IZXhhZ29uU1ZHKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNyZWF0ZSBTa2lsbCBlbGVtZW50IHdpdGhvdXQgYmVpbmcgaW5pdGlhbGl6ZWQuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7IGNsYXNzTmFtZTogJ3NraWxsIHRvb2x0aXAtY29udGFpbmVyJyB9LFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogJ2hleGFnb24tY29udGFpbmVyJywgc3R5bGU6IHsgY29sb3I6IHRoaXMuZGF0YS5jb2xvciB9IH0sXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBjbGFzc05hbWU6ICd0b29sdGlwIHRvcCBpcy1zaXplLTcnIH0sIHRoaXMuZGF0YS5uYW1lKSxcbiAgICAgICAgICAgICAgICBTa2lsbC5IZXhhZ29uU1ZHLmNsb25lTm9kZSh0cnVlKSkpKTtcbiAgICB9O1xuICAgIFNraWxsLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoU2tpbGwuSGV4YWdvblNWRykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBTVkdfMS5TVkcubG9hZFNWRygnLi9vdXQvaW1hZ2VzL0NvbnRlbnQvSGV4YWdvbicpLnRoZW4oZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2hleGFnb24nKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3JlZicsICdoZXhhZ29uJyk7XG4gICAgICAgICAgICAgICAgICAgIFNraWxsLkhleGFnb25TVkcgPSBlbGVtZW50O1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaChmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZmFsc2UpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIHJldHVybiBTa2lsbDtcbn0oQ29tcG9uZW50XzEuRGF0YUNvbXBvbmVudCkpO1xuZXhwb3J0cy5Ta2lsbCA9IFNraWxsO1xuU2tpbGwuaW5pdGlhbGl6ZSgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hc3NpZ24gPSAodGhpcyAmJiB0aGlzLl9fYXNzaWduKSB8fCBmdW5jdGlvbiAoKSB7XG4gICAgX19hc3NpZ24gPSBPYmplY3QuYXNzaWduIHx8IGZ1bmN0aW9uKHQpIHtcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XG4gICAgICAgICAgICBzID0gYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgZm9yICh2YXIgcCBpbiBzKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMsIHApKVxuICAgICAgICAgICAgICAgIHRbcF0gPSBzW3BdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0O1xuICAgIH07XG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Ta2lsbHNGaWx0ZXIgPSB2b2lkIDA7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFNraWxsXzEgPSByZXF1aXJlKFwiLi9Ta2lsbFwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIFNraWxsc18xID0gcmVxdWlyZShcIi4uLy4uL0RhdGEvU2tpbGxzXCIpO1xudmFyIFNraWxsc0ZpbHRlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU2tpbGxzRmlsdGVyKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLmZpbHRlciA9IDA7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMudG9wID0gZmFsc2U7XG4gICAgICAgIHRoaXMubWF4SGVpZ2h0ID0gMjI0O1xuICAgICAgICB0aGlzLm9wdGlvbkVsZW1lbnRzID0gbmV3IE1hcCgpO1xuICAgICAgICB0aGlzLnNraWxsRWxlbWVudHMgPSBbXTtcbiAgICAgICAgdGhpcy51c2luZ0Fycm93S2V5cyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZCA9IG51bGw7XG4gICAgICAgIHRoaXMuQ29udGFpbmVyID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnc2VjdGlvbiNza2lsbHMgLnNraWxscy1maWx0ZXInKTtcbiAgICAgICAgdGhpcy5Ecm9wZG93biA9IHRoaXMuQ29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJy5kcm9wZG93bicpO1xuICAgICAgICB0aGlzLlNlbGVjdGVkT3B0aW9uc0Rpc3BsYXkgPSB0aGlzLkRyb3Bkb3duLnF1ZXJ5U2VsZWN0b3IoJy5zZWxlY3RlZC1vcHRpb25zIC5kaXNwbGF5Jyk7XG4gICAgICAgIHRoaXMuTWVudSA9IHRoaXMuRHJvcGRvd24ucXVlcnlTZWxlY3RvcignLm1lbnUnKTtcbiAgICAgICAgdGhpcy5NZW51T3B0aW9ucyA9IHRoaXMuTWVudS5xdWVyeVNlbGVjdG9yKCcub3B0aW9ucycpO1xuICAgICAgICB0aGlzLkNhdGVnb3J5TWFwID0gT2JqZWN0LmVudHJpZXMoU2tpbGxfMS5Ta2lsbENhdGVnb3J5KVxuICAgICAgICAgICAgLmZpbHRlcihmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBfYVswXSwgdmFsID0gX2FbMV07XG4gICAgICAgICAgICByZXR1cm4gIWlzTmFOKE51bWJlcihrZXkpKTtcbiAgICAgICAgfSlcbiAgICAgICAgICAgIC5yZWR1Y2UoZnVuY3Rpb24gKG9iaiwgX2EpIHtcbiAgICAgICAgICAgIHZhciBfYjtcbiAgICAgICAgICAgIHZhciBrZXkgPSBfYVswXSwgdmFsID0gX2FbMV07XG4gICAgICAgICAgICByZXR1cm4gX19hc3NpZ24oX19hc3NpZ24oe30sIG9iaiksIChfYiA9IHt9LCBfYltrZXldID0gdmFsLCBfYikpO1xuICAgICAgICB9LCB7fSk7XG4gICAgICAgIERPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICAgICAgICAgIFNraWxsXzEuU2tpbGwuaW5pdGlhbGl6ZSgpLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5jcmVhdGVTa2lsbEVsZW1lbnRzKCk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY3JlYXRlT3B0aW9ucygpO1xuICAgICAgICAgICAgICAgIF90aGlzLnVwZGF0ZSgpO1xuICAgICAgICAgICAgICAgIF90aGlzLmNyZWF0ZUV2ZW50TGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5NZW51LnN0eWxlLm1heEhlaWdodCA9IHRoaXMubWF4SGVpZ2h0ICsgXCJweFwiO1xuICAgICAgICB0aGlzLmNoZWNrUG9zaXRpb24oKTtcbiAgICB9O1xuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUuY3JlYXRlT3B0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgT2JqZWN0LmVudHJpZXModGhpcy5DYXRlZ29yeU1hcCkuZm9yRWFjaChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHZhciBrZXkgPSBfYVswXSwgdmFsID0gX2FbMV07XG4gICAgICAgICAgICB2YXIgZWxlbWVudCA9IEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7IGNsYXNzTmFtZTogXCJpcy1zaXplLTdcIiB9LCB2YWwpO1xuICAgICAgICAgICAgX3RoaXMub3B0aW9uRWxlbWVudHMuc2V0KGVsZW1lbnQsIE51bWJlcihrZXkpKTtcbiAgICAgICAgICAgIF90aGlzLk1lbnVPcHRpb25zLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUuY3JlYXRlU2tpbGxFbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBTa2lsbHNfMiA9IFNraWxsc18xLlNraWxsczsgX2kgPCBTa2lsbHNfMi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBza2lsbCA9IFNraWxsc18yW19pXTtcbiAgICAgICAgICAgIHRoaXMuc2tpbGxFbGVtZW50cy5wdXNoKG5ldyBTa2lsbF8xLlNraWxsKHNraWxsKSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBmb3IgKHZhciBpID0gV2ViUGFnZV8xLlNraWxsc0dyaWQuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5Ta2lsbHNHcmlkLnJlbW92ZUNoaWxkKFdlYlBhZ2VfMS5Ta2lsbHNHcmlkLmNoaWxkcmVuLml0ZW0oaSkpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmZpbHRlciA9PT0gMCkge1xuICAgICAgICAgICAgdGhpcy5za2lsbEVsZW1lbnRzLmZvckVhY2goZnVuY3Rpb24gKHNraWxsKSB7IHJldHVybiBza2lsbC5hcHBlbmRUbyhXZWJQYWdlXzEuU2tpbGxzR3JpZCk7IH0pO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZE9wdGlvbnNEaXNwbGF5LmlubmVyVGV4dCA9ICdOb25lJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2tpbGxFbGVtZW50cy5maWx0ZXIoZnVuY3Rpb24gKHNraWxsKSB7IHJldHVybiAoc2tpbGwuZ2V0Q2F0ZWdvcnkoKSAmIF90aGlzLmZpbHRlcikgIT09IDA7IH0pXG4gICAgICAgICAgICAgICAgLmZvckVhY2goZnVuY3Rpb24gKHNraWxsKSB7IHJldHVybiBza2lsbC5hcHBlbmRUbyhXZWJQYWdlXzEuU2tpbGxzR3JpZCk7IH0pO1xuICAgICAgICAgICAgdmFyIHRleHQgPSBPYmplY3QuZW50cmllcyh0aGlzLkNhdGVnb3J5TWFwKS5maWx0ZXIoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IF9hWzBdLCB2YWwgPSBfYVsxXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gKF90aGlzLmZpbHRlciAmIE51bWJlcihrZXkpKSAhPT0gMDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLm1hcChmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gX2FbMF0sIHZhbCA9IF9hWzFdO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWw7XG4gICAgICAgICAgICB9KS5qb2luKCcsICcpO1xuICAgICAgICAgICAgdGhpcy5TZWxlY3RlZE9wdGlvbnNEaXNwbGF5LmlubmVyVGV4dCA9IHRleHQ7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUuY3JlYXRlRXZlbnRMaXN0ZW5lcnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMub3B0aW9uRWxlbWVudHMuaGFzKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy50b2dnbGVPcHRpb24oZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gRE9NXzEuRE9NLmdldFBhdGhUb1Jvb3QoZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgICAgICAgICBpZiAocGF0aC5pbmRleE9mKF90aGlzLkRyb3Bkb3duKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmFjdGl2ZSA/IF90aGlzLmNsb3NlKCkgOiBfdGhpcy5vcGVuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB7XG4gICAgICAgICAgICBwYXNzaXZlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LmtleUNvZGUgPT09IDMyKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhdGggPSBET01fMS5ET00uZ2V0UGF0aFRvUm9vdChkb2N1bWVudC5hY3RpdmVFbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAocGF0aC5pbmRleE9mKF90aGlzLkRyb3Bkb3duKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKF90aGlzLmFjdGl2ZSAmJiBfdGhpcy51c2luZ0Fycm93S2V5cykge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMudG9nZ2xlT3B0aW9uKF90aGlzLmxhc3RTZWxlY3RlZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudG9nZ2xlKCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKF90aGlzLmFjdGl2ZSkge1xuICAgICAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzNyB8fCBldmVudC5rZXlDb2RlID09PSAzOCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3ZlQXJyb3dTZWxlY3Rpb24oLTEpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzkgfHwgZXZlbnQua2V5Q29kZSA9PT0gNDApIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW92ZUFycm93U2VsZWN0aW9uKDEpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLk1lbnVPcHRpb25zLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlb3ZlcicsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLmxhc3RTZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgIF90aGlzLnVzaW5nQXJyb3dLZXlzID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgX3RoaXMubGFzdFNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLkRyb3Bkb3duLmFkZEV2ZW50TGlzdGVuZXIoJ2JsdXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jbG9zZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgV2ViUGFnZV8xLlNjcm9sbEhvb2suYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBfdGhpcy5jaGVja1Bvc2l0aW9uKCk7XG4gICAgICAgIH0sIHtcbiAgICAgICAgICAgIHBhc3NpdmU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5Ecm9wZG93bi5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9O1xuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUub3BlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPSB0cnVlO1xuICAgICAgICB0aGlzLkRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgICBpZiAodGhpcy5sYXN0U2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubGFzdFNlbGVjdGVkLmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmFjdGl2ZSA/IHRoaXMuY2xvc2UoKSA6IHRoaXMub3BlbigpO1xuICAgIH07XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS50b2dnbGVPcHRpb24gPSBmdW5jdGlvbiAob3B0aW9uKSB7XG4gICAgICAgIHZhciBiaXQgPSB0aGlzLm9wdGlvbkVsZW1lbnRzLmdldChvcHRpb24pO1xuICAgICAgICBpZiAoKHRoaXMuZmlsdGVyICYgYml0KSAhPT0gMCkge1xuICAgICAgICAgICAgb3B0aW9uLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBvcHRpb24uY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZpbHRlciBePSBiaXQ7XG4gICAgICAgIHRoaXMubGFzdFNlbGVjdGVkID0gb3B0aW9uO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH07XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS5tb3ZlQXJyb3dTZWxlY3Rpb24gPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgICAgIGlmICghdGhpcy5sYXN0U2VsZWN0ZWQpIHtcbiAgICAgICAgICAgIHRoaXMubGFzdFNlbGVjdGVkID0gdGhpcy5NZW51T3B0aW9ucy5maXJzdEVsZW1lbnRDaGlsZDtcbiAgICAgICAgICAgIHRoaXMubGFzdFNlbGVjdGVkLmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy51c2luZ0Fycm93S2V5cykge1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFNlbGVjdGVkLmNsYXNzTGlzdC5yZW1vdmUoJ2hvdmVyJyk7XG4gICAgICAgICAgICAgICAgaWYgKGRpciA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0U2VsZWN0ZWQgPSAodGhpcy5sYXN0U2VsZWN0ZWQucHJldmlvdXNFbGVtZW50U2libGluZyB8fCB0aGlzLk1lbnVPcHRpb25zLmxhc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sYXN0U2VsZWN0ZWQgPSAodGhpcy5sYXN0U2VsZWN0ZWQubmV4dEVsZW1lbnRTaWJsaW5nIHx8IHRoaXMuTWVudU9wdGlvbnMuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMudXNpbmdBcnJvd0tleXMgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sYXN0U2VsZWN0ZWQuY2xhc3NMaXN0LmFkZCgnaG92ZXInKTtcbiAgICAgICAgICAgIGlmICghRE9NXzEuRE9NLmluT2Zmc2V0Vmlldyh0aGlzLmxhc3RTZWxlY3RlZCwgeyBpZ25vcmVYOiB0cnVlLCB3aG9sZTogdHJ1ZSB9KSkge1xuICAgICAgICAgICAgICAgIERPTV8xLkRPTS5zY3JvbGxDb250YWluZXJUb1ZpZXdXaG9sZUNoaWxkKHRoaXMuTWVudSwgdGhpcy5sYXN0U2VsZWN0ZWQsIHsgaWdub3JlWDogdHJ1ZSwgc21vb3RoOiB0cnVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMudXNpbmdBcnJvd0tleXMgPSB0cnVlO1xuICAgIH07XG4gICAgU2tpbGxzRmlsdGVyLnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoRE9NXzEuRE9NLnBpeGVsc0Fib3ZlU2NyZWVuQm90dG9tKHRoaXMuRHJvcGRvd24pIDw9IHRoaXMubWF4SGVpZ2h0KSB7XG4gICAgICAgICAgICBpZiAoIXRoaXMudG9wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b3AgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuRHJvcGRvd24uY2xhc3NMaXN0LmFkZCgndG9wJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy50b3ApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvcCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuRHJvcGRvd24uY2xhc3NMaXN0LnJlbW92ZSgndG9wJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBTa2lsbHNGaWx0ZXI7XG59KCkpO1xuZXhwb3J0cy5Ta2lsbHNGaWx0ZXIgPSBTa2lsbHNGaWx0ZXI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Tb2NpYWwgPSB2b2lkIDA7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBTb2NpYWwgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb2NpYWwsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU29jaWFsKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIFNvY2lhbC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgIFNvY2lhbC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInNvY2lhbFwiIH0sXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJidG4gaXMtc3ZnIGlzLXByaW1hcnlcIiwgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiB0aGlzLmRhdGEuZmFDbGFzcyB9KSkpKTtcbiAgICB9O1xuICAgIHJldHVybiBTb2NpYWw7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuU29jaWFsID0gU29jaWFsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFib3V0TWUgPSB2b2lkIDA7XG5leHBvcnRzLkFib3V0TWUgPSBcIkkgYW0gYW4gYXNwaXJpbmcgd2ViIGRldmVsb3BlciBhbmQgc29mdHdhcmUgZW5naW5lZXIgY2hhc2luZyBteSBwYXNzaW9uIGZvciB3b3JraW5nIHdpdGggdGVjaG5vbG9neSBhbmQgcHJvZ3JhbW1pbmcgYXQgdGhlIFVuaXZlcnNpdHkgb2YgVGV4YXMgYXQgRGFsbGFzLiBJIGNyYXZlIHRoZSBvcHBvcnR1bml0eSB0byBjb250cmlidXRlIHRvIG1lYW5pbmdmdWwgcHJvamVjdHMgdGhhdCBlbXBsb3kgbXkgY3VycmVudCBnaWZ0cyBhbmQgaW50ZXJlc3RzIHdoaWxlIGFsc28gc2hvdmluZyBtZSBvdXQgb2YgbXkgY29tZm9ydCB6b25lIHRvIGxlYXJuIG5ldyBza2lsbHMuIE15IGdvYWwgaXMgdG8gbWF4aW1pemUgZXZlcnkgZXhwZXJpZW5jZSBhcyBhbiBvcHBvcnR1bml0eSBmb3IgcGVyc29uYWwsIHByb2Zlc3Npb25hbCwgYW5kIHRlY2huaWNhbCBncm93dGguXCI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRWR1Y2F0aW9uID0gdm9pZCAwO1xuZXhwb3J0cy5FZHVjYXRpb24gPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnVGhlIFVuaXZlcnNpdHkgb2YgVGV4YXMgYXQgRGFsbGFzJyxcbiAgICAgICAgY29sb3I6ICcjQzc1QjEyJyxcbiAgICAgICAgaW1hZ2U6ICd1dGQuc3ZnJyxcbiAgICAgICAgbGluazogJ2h0dHA6Ly91dGRhbGxhcy5lZHUnLFxuICAgICAgICBsb2NhdGlvbjogJ1JpY2hhcmRzb24sIFRYLCBVU0EnLFxuICAgICAgICBkZWdyZWU6ICdCYWNoZWxvciBvZiBTY2llbmNlIGluIENvbXB1dGVyIFNjaWVuY2UnLFxuICAgICAgICBzdGFydDogJ0ZhbGwgMjAxOCcsXG4gICAgICAgIGVuZDogJ0ZhbGwgMjAyMScsXG4gICAgICAgIGNyZWRpdHM6IHtcbiAgICAgICAgICAgIHRvdGFsOiAxMjQsXG4gICAgICAgICAgICBjb21wbGV0ZWQ6IDkwLFxuICAgICAgICAgICAgdGFraW5nOiAxNFxuICAgICAgICB9LFxuICAgICAgICBncGE6IHtcbiAgICAgICAgICAgIG92ZXJhbGw6ICc0LjAnLFxuICAgICAgICAgICAgbWFqb3I6ICc0LjAnXG4gICAgICAgIH0sXG4gICAgICAgIG5vdGVzOiBbXG4gICAgICAgICAgICAnQ29sbGVnaXVtIFYgSG9ub3JzJ1xuICAgICAgICBdLFxuICAgICAgICBjb3Vyc2VzOiBbXG4gICAgICAgICAgICAnVHdvIFNlbWVzdGVycyBvZiBDKysgUHJvZ3JhbW1pbmcnLFxuICAgICAgICAgICAgJ0NvbXB1dGVyIEFyY2hpdGVjdHVyZScsXG4gICAgICAgICAgICAnU29mdHdhcmUgRW5naW5lZXJpbmcnLFxuICAgICAgICAgICAgJ1Byb2dyYW1taW5nIGluIFVOSVgnXG4gICAgICAgIF1cbiAgICB9XG5dO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkV4cGVyaWVuY2UgPSB2b2lkIDA7XG5leHBvcnRzLkV4cGVyaWVuY2UgPSBbXG4gICAge1xuICAgICAgICBzdmc6ICdmaWRlbGl0eScsXG4gICAgICAgIGxpbms6ICdodHRwczovL3d3dy5maWRlbGl0eS5jb20vJyxcbiAgICAgICAgY29tcGFueTogJ0ZpZGVsaXR5IEludmVzdG1lbnRzJyxcbiAgICAgICAgbG9jYXRpb246ICdSZW1vdGUnLFxuICAgICAgICBwb3NpdGlvbjogJ1NvZnR3YXJlIEVuZ2luZWVyIEludGVybicsXG4gICAgICAgIGJlZ2luOiAnSnVuZSAyMDIwJyxcbiAgICAgICAgZW5kOiAnSnVseSAyMDIwJyxcbiAgICAgICAgZmxhdm9yOiAnRmlkZWxpdHkgSW52ZXN0bWVudHMgaXMgYW4gaW50ZXJuYXRpb25hbCBwcm92aWRlciBvZiBmaW5hbmNpYWwgc2VydmljZXMgdGhhdCBoZWxwIGluZGl2aWR1YWxzIGFuZCBpbnN0aXR1dGlvbnMgbWVldCB0aGVpciBmaW5hbmNpYWwgb2JqZWN0aXZlcy4gQXMgYSBsZWFkZXIgaW4gdGhlIGluZHVzdHJ5LCBGaWRlbGl0eSBpcyBjb21taXR0ZWQgdG8gdXNpbmcgc3RhdGUtb2YtdGhlLWFydCB0ZWNobm9sb2d5IHRvIHNlcnZlIGl0cyBjdXN0b21lcnMuIEkgd29ya2VkIHJlbW90ZWx5IGFzIGEgcGFydCBvZiB0aGUgU2luZ2xlIFNpZ24tT24gdGVhbSBpbiB0aGUgQ3VzdG9tZXIgUHJvdGVjdGlvbiBkaXZpc2lvbiBvZiBXb3JrcGxhY2UgSW52ZXN0aW5nLicsXG4gICAgICAgIHJvbGVzOiBbXG4gICAgICAgICAgICAnQ3JlYXRlZCBhIGZ1bGwtc3RhY2sgd2ViIGFwcGxpY2F0aW9uIGZvciBzaW5nbGUgc2lnbi1vbiB3b3JrIGludGFrZSB1c2luZyBBbmd1bGFyIGFuZCBTcHJpbmcgQm9vdC4nLFxuICAgICAgICAgICAgJ0RldmVsb3BlZCBhIGR5bmFtaWMgZm9ybSBjb21wb25lbnQgbGlicmFyeSBmb2N1c2VkIG9uIHJldXNhYmxlIGxvZ2ljLCBVSSBhYnN0cmFjdGlvbiwgYW5kIGRlc2lnbiBmbGV4aWJpbGl0eS4nLFxuICAgICAgICAgICAgJ0ludGVncmF0ZWQgZnJvbnQtZW5kIGFuZCBiYWNrLWVuZCBhcHBsaWNhdGlvbnMgdXNpbmcgTWF2ZW4gYnVpbGQgdG9vbHMgYW5kIERvY2tlci4nLFxuICAgICAgICAgICAgJ0VuZ2FnZWQgaW4gcHJvZmVzc2lvbmFsIHRyYWluaW5nIHNlc3Npb25zIGZvciBkZXZlbG9waW5nIG9uIEFtYXpvbiBXZWIgU2VydmljZXMuJyxcbiAgICAgICAgICAgICdXb3JrZWQgY2xvc2VseSB3aXRoIHRoZSBBZ2lsZSBwcm9jZXNzIGFuZCBpbmNyZW1lbnRhbCBzb2Z0d2FyZSBkZWxpdmVyeS4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgc3ZnOiAnbWVkaXQnLFxuICAgICAgICBsaW5rOiAnaHR0cHM6Ly9tZWRpdC5vbmxpbmUnLFxuICAgICAgICBjb21wYW55OiAnTWVkaXQnLFxuICAgICAgICBsb2NhdGlvbjogJ0R1YmxpbiwgSXJlbGFuZCcsXG4gICAgICAgIHBvc2l0aW9uOiAnV2ViIEFwcGxpY2F0aW9uIERldmVsb3BlcicsXG4gICAgICAgIGJlZ2luOiAnTWF5IDIwMTknLFxuICAgICAgICBlbmQ6ICdKdWx5IDIwMTknLFxuICAgICAgICBmbGF2b3I6ICdNZWRpdCBpcyBhIHN0YXJ0LXVwIGNvbXBhbnkgY29tbWl0dGVkIHRvIG1ha2luZyBtZWRpY2FsIGVkdWNhdGlvbiBtb3JlIGVmZmljaWVudCB0aHJvdWdoIHRoZWlyIG1vYmlsZSBzb2x1dGlvbnMuIEJ5IGNvbWJpbmluZyB0ZWNobm9sb2d5IHdpdGggY3VyYXRlZCBjb250ZW50LCBwcmFjdGljaW5nIHByb2Zlc3Npb25hbHMgYXJlIGdpdmVuIGEgcXVpY2ssIHVuaXF1ZSwgYW5kIHJlbGV2YW50IGxlYXJuaW5nIGV4cGVyaWVuY2UuIEkgaGFkIHRoZSBvcHBvcnR1bml0eSB0byB3b3JrIGFzIHRoZSBjb21wYW55XFwncyBmaXJzdCB3ZWIgZGV2ZWxvcGVyLCBsYXlpbmcgZG93biB0aGUgZXNzZW50aWFsIGZvdW5kYXRpb25zIGZvciBhIHdlYi1iYXNlZCB2ZXJzaW9uIG9mIHRoZWlyIGFwcGxpY2F0aW9uLicsXG4gICAgICAgIHJvbGVzOiBbXG4gICAgICAgICAgICAnQXJjaGl0ZWN0ZWQgdGhlIGluaXRpYWwgZm91bmRhdGlvbnMgZm9yIGEgZnVsbC1zY2FsZSwgc2luZ2xlLXBhZ2Ugd2ViIGFwcGxpY2F0aW9uIHVzaW5nIFZ1ZSwgVHlwZVNjcmlwdCwgYW5kIFNBU1MuJyxcbiAgICAgICAgICAgICdEZXNpZ25lZCBhbiBpbnRlcmZhY2Utb3JpZW50ZWQsIG1vZHVsYXJpemVkIHN0YXRlIG1hbmFnZW1lbnQgc3lzdGVtIHRvIHdvcmsgYmVoaW5kIHRoZSBhcHBsaWNhdGlvbi4nLFxuICAgICAgICAgICAgJ0RldmVsb3BlZCBhIFZ1ZSBjb25maWd1cmF0aW9uIGxpYnJhcnkgdG8gZW5oYW5jZSB0aGUgYWJpbGl0eSB0byBtb2NrIGFwcGxpY2F0aW9uIHN0YXRlIGluIHVuaXQgdGVzdGluZy4nLFxuICAgICAgICAgICAgJ0VzdGFibGlzaGVkIGEgY29tcHJlaGVuc2l2ZSBVSSBjb21wb25lbnQgbGlicmFyeSB0byBhY2NlbGVyYXRlIHRoZSBhYmlsaXR5IHRvIGFkZCBuZXcgY29udGVudC4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgc3ZnOiAnbGlmZWNodXJjaCcsXG4gICAgICAgIGxpbms6ICdodHRwczovL2xpZmUuY2h1cmNoJyxcbiAgICAgICAgY29tcGFueTogJ0xpZmUuQ2h1cmNoJyxcbiAgICAgICAgbG9jYXRpb246ICdFZG1vbmQsIE9LLCBVU0EnLFxuICAgICAgICBwb3NpdGlvbjogJ0luZm9ybWF0aW9uIFRlY2hub2xvZ3kgSW50ZXJuJyxcbiAgICAgICAgYmVnaW46ICdNYXkgMjAxOCcsXG4gICAgICAgIGVuZDogJ0F1Z3VzdCAyMDE4JyxcbiAgICAgICAgZmxhdm9yOiAnTGlmZS5DaHVyY2ggaXMgYSBtdWx0aS1zaXRlIGNodXJjaCB3aXRoIGEgd29ybGR3aWRlIGltcGFjdCwgY2VudGVyZWQgYXJvdW5kIHRoZWlyIG1pc3Npb24gdG8gXCJsZWFkIHBlb3BsZSB0byBiZWNvbWUgZnVsbHktZGV2b3RlZCBmb2xsb3dlcnMgb2YgQ2hyaXN0LlwiIEkgd29ya2VkIGFsb25nc2lkZSB0aGVpciBDZW50cmFsIEluZm9ybWF0aW9uIFRlY2hub2xvZ3kgdGVhbTogYSBncm91cCBkZWRpY2F0ZWQgdG8gdXRpbGl6aW5nIHRlY2hub2xvZ3kgdG8gc2VydmUgYW5kIGVxdWlwIHRoZSBjaHVyY2guJyxcbiAgICAgICAgcm9sZXM6IFtcbiAgICAgICAgICAgICdTcGVudCB0aW1lIGxlYXJuaW5nIGZyb20gaGFyZHdhcmUsIHNvZnR3YXJlLCBhbmQgZGF0YWJhc2UgdGVhbXMgaW4gYW4gQWdpbGUgZW52aXJvbm1lbnQuJyxcbiAgICAgICAgICAgICdEZXNpZ25lZCBhbmQgZGV2ZWxvcGVkIGEgd2ViIGFwcGxpY2F0aW9uIGZvciByZW1vdGUgdm9sdW50ZWVyIHRyYWNraW5nIHdpdGggTm9kZS5qcyBhbmQgUG9zdGdyZVNRTC4nLFxuICAgICAgICAgICAgJ0R5bmFtaWNhbGx5IGRlcGxveWVkIGFwcGxpY2F0aW9uIHRvIEdvb2dsZSBDbG91ZCBQbGF0Zm9ybSB1c2luZyBDbG91ZCBCdWlsZHMsIERvY2tlciwgYW5kIEt1YmVybmV0ZXMuJ1xuICAgICAgICBdXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Qcm9qZWN0cyA9IHZvaWQgMDtcbmV4cG9ydHMuUHJvamVjdHMgPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnQWV0aGVyJyxcbiAgICAgICAgY29sb3I6ICcjMUMxQzY3JyxcbiAgICAgICAgaW1hZ2U6ICdhZXRoZXIuanBnJyxcbiAgICAgICAgdHlwZTogJ1NpZGUgUHJvamVjdCcsXG4gICAgICAgIGRhdGU6ICdTcHJpbmcgMjAyMCcsXG4gICAgICAgIGF3YXJkOiBudWxsLFxuICAgICAgICBmbGF2b3I6ICdUQ1AgcHJveHkgc2VydmVyIGZvciB2aWV3aW5nIGFuZCBpbnRlcmNlcHRpbmcgd2ViIHRyYWZmaWMuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQvYWV0aGVyLXByb3h5JyxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIEMrKyB1c2luZyB0aGUgQm9vc3QuQXNpbyBsaWJyYXJ5LicsXG4gICAgICAgICAgICAnTXVsdGl0aHJlYWRlZCBIVFRQIHBhcnNpbmcgYW5kIGZvcndhcmRpbmcuJyxcbiAgICAgICAgICAgICdUQ1AgdHVubmVsaW5nIGZvciBIVFRQUy9UTFMgYW5kIFdlYlNvY2tldHMuJ1xuICAgICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdBUiBTcGhlcmUnLFxuICAgICAgICBjb2xvcjogJyNEQjRGNTQnLFxuICAgICAgICBpbWFnZTogJ2FyLXNwaGVyZS5qcGcnLFxuICAgICAgICB0eXBlOiAnQUNNIElnbml0ZScsXG4gICAgICAgIGRhdGU6ICdGYWxsIDIwMTknLFxuICAgICAgICBhd2FyZDogJ0ZpcnN0IHBsYWNlIGZvciBGYWxsIDIwMTkgQUNNIElnbml0ZScsXG4gICAgICAgIGZsYXZvcjogJ01vYmlsZSBhcHBsaWNhdGlvbiB0byBwbGFjZSBwZXJzaXN0ZW50IEFSIG1vZGVscyBhbmQgZXhwZXJpZW5jZXMgYWNyb3NzIHRoZSBnbG9iZS4nLFxuICAgICAgICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL2phY2tzb24tbmVzdGVscm9hZC9hci1zcGhlcmUtc2VydmVyJyxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdTZW1lc3Rlci1sb25nIHRlYW0gZW50cmVwcmVuZXVyaWFsIHByb2plY3QuJyxcbiAgICAgICAgICAgICdMZWFkIHNlcnZlciBkZXZlbG9wZXIgd2l0aCBDIywgQVNQLk5FVCBDb3JlIE1WQywgYW5kIEVudGl0eSBGcmFtZXdvcmsuJyxcbiAgICAgICAgICAgICdTdHJlYW0gY29udGludW91cyBkYXRhIGFuZCByZWFsLXRpbWUgdXBkYXRlcyB3aXRoIFNpZ25hbFIuJyxcbiAgICAgICAgICAgICdTYXZlcyBnZW9ncmFwaGljYWwgZGF0YSB3aXRoIEF6dXJlIFNwYXRpYWwgQW5jaG9ycy4nLFxuICAgICAgICAgICAgJ0RlcGxveWVkIHRvIE1pY3Jvc29mdCBBenVyZSB3aXRoIFNRTCBTZXJ2ZXIgYW5kIEJsb2IgU3RvcmFnZS4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1BvcnRmb2xpbyBXZWJzaXRlJyxcbiAgICAgICAgY29sb3I6ICcjMjlBQjg3JyxcbiAgICAgICAgaW1hZ2U6ICdwb3J0Zm9saW8td2Vic2l0ZS5qcGcnLFxuICAgICAgICB0eXBlOiAnU2lkZSBQcm9qZWN0JyxcbiAgICAgICAgZGF0ZTogJ1NwcmluZy9TdW1tZXIgMjAxOScsXG4gICAgICAgIGF3YXJkOiBudWxsLFxuICAgICAgICBmbGF2b3I6ICdQZXJzb25hbCB3ZWJzaXRlIHRvIHNob3djYXNlIG15IHdvcmsgYW5kIGV4cGVyaWVuY2UuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQvcG9ydGZvbGlvLXdlYnNpdGUnLFxuICAgICAgICBleHRlcm5hbDogJ2h0dHBzOi8vamFja3Nvbi5uZXN0ZWxyb2FkLmNvbScsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCBmcm9tIHNjcmF0Y2ggd2l0aCBwdXJlIFR5cGVTY3JpcHQuJyxcbiAgICAgICAgICAgICdDdXN0b20tbWFkZSwgZHluYW1pYyBTQ1NTIGxpYnJhcnkuJyxcbiAgICAgICAgICAgICdDbGFzcy1iYXNlZCwgZWFzeS10by11cGRhdGUgSlNYIHJlbmRlcmluZyBmb3IgcmVjdXJyaW5nIGNvbnRlbnQuJyxcbiAgICAgICAgICAgICdTdXBwb3J0cyBJbnRlcm5ldCBFeHBsb3JlciAxMS4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1BvbmRlcicsXG4gICAgICAgIGNvbG9yOiAnI0ZGQTUwMCcsXG4gICAgICAgIGltYWdlOiAncG9uZGVyLmpwZycsXG4gICAgICAgIHR5cGU6ICdTaWRlIFByb2plY3QnLFxuICAgICAgICBkYXRlOiAnSGFja1VURCAyMDE5JyxcbiAgICAgICAgYXdhcmQ6ICdcIkJlc3QgVUkvVVhcIiBmb3IgSGFja1VURCAyMDE5JyxcbiAgICAgICAgZmxhdm9yOiAnV2ViIGFuZCBtb2JpbGUgYXBwbGljYXRpb24gdG8gbWFrZSBncm91cCBicmFpbnN0b3JtaW5nIG9yZ2FuaXplZCBhbmQgZWZmaWNpZW50LicsXG4gICAgICAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkL3BvbmRlci1oYWNrdXRkLTE5JyxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIFJlYWN0IGFuZCBGaXJlYmFzZSBSZWFsdGltZSBEYXRhYmFzZS4nLFxuICAgICAgICAgICAgJ0NvbXBsZXRlIGNvbm5lY3Rpb24gYW5kIHJlYWx0aW1lIHVwZGF0ZXMgd2l0aCBtb2JpbGUgY291bnRlcnBhcnQuJyxcbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnS2V5IENvbnN1bWVyJyxcbiAgICAgICAgY29sb3I6ICcjN0E2OUFEJyxcbiAgICAgICAgaW1hZ2U6ICdrZXktY29uc3VtZXIuanBnJyxcbiAgICAgICAgdHlwZTogJ1NpZGUgUHJvamVjdCcsXG4gICAgICAgIGRhdGU6ICdKYW51YXJ5IDIwMTknLFxuICAgICAgICBhd2FyZDogbnVsbCxcbiAgICAgICAgZmxhdm9yOiAnV2luZG93cyBjb21tYW5kIHRvIGF0dGFjaCBhIGxvdy1sZXZlbCBrZXlib2FyZCBob29rIGluIGFub3RoZXIgcnVubmluZyBwcm9jZXNzLicsXG4gICAgICAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkL2tleS1jb25zdW1lcicsXG4gICAgICAgIGV4dGVybmFsOiBudWxsLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAnSW1wbGVtZW50ZWQgd2l0aCBDKysgYW5kIFdpbmRvd3MgQVBJLicsXG4gICAgICAgICAgICAnQXR0YWNoZXMgLmRsbCBmaWxlIHRvIGFub3RoZXIgcHJvY2VzcyB0byBhdm9pZCBkZXRlY3Rpb24uJyxcbiAgICAgICAgICAgICdJbnRlcmNlcHRzIGFuZCBjaGFuZ2VzIGtleSBpbnB1dHMgb24gdGhlIGZseS4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0NvbWV0IENsaW1hdGUgQVBJJyxcbiAgICAgICAgY29sb3I6ICcjMkQ4N0M2JyxcbiAgICAgICAgaW1hZ2U6ICdjb21ldC1jbGltYXRlLmpwZycsXG4gICAgICAgIHR5cGU6ICdDbGFzcyBQcm9qZWN0JyxcbiAgICAgICAgZGF0ZTogJ05vdmVtYmVyIDIwMTgnLFxuICAgICAgICBhd2FyZDogbnVsbCxcbiAgICAgICAgZmxhdm9yOiAnU2VsZi11cGRhdGluZyBBUEkgdG8gY29sbGVjdCBjdXJyZW50IHdlYXRoZXIgYW5kIFR3aXR0ZXIgZGF0YSBmb3IgdGhlIFVuaXZlcnNpdHkgb2YgVGV4YXMgYXQgRGFsbGFzLicsXG4gICAgICAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkL2NvbWV0LWNsaW1hdGUtc2VydmVyJyxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIEMjIGFuZCB0aGUgQVNQLk5FVCBDb3JlIE1WQy4nLFxuICAgICAgICAgICAgJ0RlcGxveWVkIHRvIEhlcm9rdSB3aXRoIFBvc3RncmVTUUwgZGF0YWJhc2UuJyxcbiAgICAgICAgICAgICdBbHdheXMgcmV0dXJucyBkYXRhIGxlc3MgdGhhbiAxMCBtaW51dGVzIG9sZC4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0NocmlzdC1DZW50ZXJlZCcsXG4gICAgICAgIGNvbG9yOiAnI0ZFOTA0RScsXG4gICAgICAgIGltYWdlOiAnY2hyaXN0LWNlbnRlcmVkLmpwZycsXG4gICAgICAgIHR5cGU6ICdTaWRlIFByb2plY3QnLFxuICAgICAgICBkYXRlOiAnRmFsbCAyMDE4JyxcbiAgICAgICAgYXdhcmQ6IG51bGwsXG4gICAgICAgIGZsYXZvcjogJ0dvb2dsZSBDaHJvbWUgZXh0ZW5zaW9uIHRvIGRlbGl2ZXIgdGhlIFlvdVZlcnNpb24gVmVyc2Ugb2YgdGhlIERheSB0byB5b3VyIG5ldyB0YWIuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQvY2hyaXN0LWNlbnRlcmVkJyxcbiAgICAgICAgZXh0ZXJuYWw6ICdodHRwOi8vYml0Lmx5L2NocmlzdC1jZW50ZXJlZCcsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIFJlYWN0IGFuZCBDaHJvbWUgQVBJLicsXG4gICAgICAgICAgICAnQ3VzdG9tIHZlcnNlIHNlYXJjaGluZyBieSBrZXl3b3JkIG9yIG51bWJlci4nLFxuICAgICAgICAgICAgJ0dpdmVzIGN1cnJlbnQgd2VhdGhlciBmb3IgdXNlclxcJ3MgbG9jYXRpb24gdmlhIHRoZSBPcGVuV2VhdGhlck1hcCBBUEkuJ1xuICAgICAgICBdXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5RdWFsaXRpZXMgPSB2b2lkIDA7XG5leHBvcnRzLlF1YWxpdGllcyA9IFtcbiAgICB7XG4gICAgICAgIGZhQ2xhc3M6ICdmYXMgZmEtaGlzdG9yeScsXG4gICAgICAgIG5hbWU6ICdFZmZpY2llbnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgY29uc2lzdGVudGx5IGJyaW5nIGVuZXJneSwgcHJvZHVjdGl2aXR5LCBvcmdhbml6YXRpb24sIGFuZCBhZ2lsaXR5IHRvIHRoZSB0YWJsZSBhcyBhbiBlZmZlY3RpdmUgd29ya2VyIGFuZCBhIHF1aWNrIGxlYXJuZXIuJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBmYUNsYXNzOiAnZmFyIGZhLXNub3dmbGFrZScsXG4gICAgICAgIG5hbWU6ICdBdHRlbnRpdmUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RvIG1lLCBldmVyeSBkZXRhaWwgbWF0dGVycy4gSSBsb3ZlIGZvcm11bGF0aW5nIHRoZSBiaWcgcGljdHVyZSBqdXN0IGFzIG11Y2ggYXMgbWVhc3VyaW5nIG91dCB0aGUgdGlueSBkZXRhaWxzIGFuZCBlZGdlIGNhc2VzLidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgZmFDbGFzczogJ2ZhcyBmYS1mZWF0aGVyLWFsdCcsXG4gICAgICAgIG5hbWU6ICdGbGV4aWJsZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSB3b3JrIGJlc3Qgd2hlbiBJIGFtIGNoYWxsZW5nZWQuIFdoaWxlIEkgdGhyaXZlIGluIG9yZ2FuaXphdGlvbiwgSSBjYW4gYWx3YXlzIGFkYXB0IGFuZCBwaWNrIHVwIG5ldyB0aGluZ3MgaW4gYSBzd2lmdCBtYW5uZXIuJ1xuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2tpbGxzID0gdm9pZCAwO1xudmFyIFNraWxsXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbFwiKTtcbmV4cG9ydHMuU2tpbGxzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ0FtYXpvbiBXZWIgU2VydmljZXMnLFxuICAgICAgICBzdmc6ICdhd3MnLFxuICAgICAgICBjb2xvcjogJyMyMzJGM0UnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRldk9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0FuZ3VsYXInLFxuICAgICAgICBzdmc6ICdhbmd1bGFyJyxcbiAgICAgICAgY29sb3I6ICcjREQwMDMxJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuRnJhbWV3b3JrLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQysrJyxcbiAgICAgICAgc3ZnOiAnY3BsdXNwbHVzJyxcbiAgICAgICAgY29sb3I6ICcjOUIwMjNBJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5Qcm9ncmFtbWluZyB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5TZXJ2ZXIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdDIycsXG4gICAgICAgIHN2ZzogJ2NzaGFycCcsXG4gICAgICAgIGNvbG9yOiAnIzlCNEY5NycsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2VydmVyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQ1NTJyxcbiAgICAgICAgc3ZnOiAnY3NzJyxcbiAgICAgICAgY29sb3I6ICcjM0M5Q0Q3JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdEb2NrZXInLFxuICAgICAgICBzdmc6ICdkb2NrZXInLFxuICAgICAgICBjb2xvcjogJyMyMkI5RUMnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRldk9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJy5ORVQgQ29yZS9GcmFtZXdvcmsnLFxuICAgICAgICBzdmc6ICdkb3RuZXQnLFxuICAgICAgICBjb2xvcjogJyMwRjc2QkQnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlNlcnZlciB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5GcmFtZXdvcmssXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdFeHByZXNzIEpTJyxcbiAgICAgICAgc3ZnOiAnZXhwcmVzcycsXG4gICAgICAgIGNvbG9yOiAnIzNEM0QzRCcsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2VydmVyIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkZyYW1ld29yayxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0ZpZ21hJyxcbiAgICAgICAgc3ZnOiAnZmlnbWEnLFxuICAgICAgICBjb2xvcjogJyNGMjRFMUUnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5Lk90aGVyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnRmlyZWJhc2UnLFxuICAgICAgICBzdmc6ICdmaXJlYmFzZScsXG4gICAgICAgIGNvbG9yOiAnI0ZGQ0EyOCcsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuRGF0YWJhc2UsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdHaXQnLFxuICAgICAgICBzdmc6ICdnaXQnLFxuICAgICAgICBjb2xvcjogJyNGMDUwMzInLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnR05VIEJhc2gnLFxuICAgICAgICBzdmc6ICdiYXNoJyxcbiAgICAgICAgY29sb3I6ICcjMkIzNTM5JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5TY3JpcHRpbmcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdHb29nbGUgQ2xvdWQgUGxhdGZvcm0nLFxuICAgICAgICBzdmc6ICdnY3AnLFxuICAgICAgICBjb2xvcjogJyM0Mzg2RkEnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRldk9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0d1bHAnLFxuICAgICAgICBzdmc6ICdndWxwJyxcbiAgICAgICAgY29sb3I6ICcjREE0NjQ4JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdIZXJva3UnLFxuICAgICAgICBzdmc6ICdoZXJva3UnLFxuICAgICAgICBjb2xvcjogJyM2NzYyQTYnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRldk9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0hUTUwnLFxuICAgICAgICBzdmc6ICdodG1sJyxcbiAgICAgICAgY29sb3I6ICcjRUY2NTJBJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdKYXZhJyxcbiAgICAgICAgc3ZnOiAnamF2YScsXG4gICAgICAgIGNvbG9yOiAnIzAwNzY5OScsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2VydmVyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSmF2YVNjcmlwdCcsXG4gICAgICAgIHN2ZzogJ2phdmFzY3JpcHQnLFxuICAgICAgICBjb2xvcjogJyNGMERCNEYnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LldlYiB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5Qcm9ncmFtbWluZyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0plc3QnLFxuICAgICAgICBzdmc6ICdqZXN0JyxcbiAgICAgICAgY29sb3I6ICcjQzIxMzI1JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdLdWJlcm5ldGVzJyxcbiAgICAgICAgc3ZnOiAna3ViZXJuZXRlcycsXG4gICAgICAgIGNvbG9yOiAnIzM1NkRFNicsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuRGV2T3BzLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnTWljcm9zb2Z0IEF6dXJlJyxcbiAgICAgICAgc3ZnOiAnYXp1cmUnLFxuICAgICAgICBjb2xvcjogJyMwMDg5RDYnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRldk9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ05vZGUuanMnLFxuICAgICAgICBzdmc6ICdub2RlanMnLFxuICAgICAgICBjb2xvcjogJyM4Q0M4NEInLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlNlcnZlcixcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1Bvc3RncmVTUUwnLFxuICAgICAgICBzdmc6ICdwb3N0Z3Jlc3FsJyxcbiAgICAgICAgY29sb3I6ICcjMzI2NjkwJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5EYXRhYmFzZSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1B5dGhvbicsXG4gICAgICAgIHN2ZzogJ3B5dGhvbicsXG4gICAgICAgIGNvbG9yOiAnIzM3NzZBQicsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2NyaXB0aW5nIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlNlcnZlcixcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1JlYWN0JyxcbiAgICAgICAgc3ZnOiAncmVhY3QnLFxuICAgICAgICBjb2xvcjogJyMwMEQ4RkYnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LldlYiB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5GcmFtZXdvcmssXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdSIExhbmd1YWdlJyxcbiAgICAgICAgc3ZnOiAncmxhbmcnLFxuICAgICAgICBjb2xvcjogJyMyMzY5QkMnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnU0FTUy9TQ1NTJyxcbiAgICAgICAgc3ZnOiAnc2FzcycsXG4gICAgICAgIGNvbG9yOiAnI0NENjY5QScsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuV2ViLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnU3ByaW5nJyxcbiAgICAgICAgc3ZnOiAnc3ByaW5nJyxcbiAgICAgICAgY29sb3I6ICcjNkRCMzNGJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5GcmFtZXdvcmsgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2VydmVyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnU1FMJyxcbiAgICAgICAgc3ZnOiAnc3FsJyxcbiAgICAgICAgY29sb3I6ICcjRjg5NzAwJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5EYXRhYmFzZSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1R5cGVTY3JpcHQnLFxuICAgICAgICBzdmc6ICd0eXBlc2NyaXB0JyxcbiAgICAgICAgY29sb3I6ICcjMDA3QUNDJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdWdWUuanMnLFxuICAgICAgICBzdmc6ICd2dWUnLFxuICAgICAgICBjb2xvcjogJyM0RkMwOEQnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LldlYiB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5GcmFtZXdvcmssXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Tb2NpYWwgPSB2b2lkIDA7XG5leHBvcnRzLlNvY2lhbCA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6ICdHaXRIdWInLFxuICAgICAgICBmYUNsYXNzOiAnZmFiIGZhLWdpdGh1YicsXG4gICAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnTGlua2VkSW4nLFxuICAgICAgICBmYUNsYXNzOiAnZmFiIGZhLWxpbmtlZGluJyxcbiAgICAgICAgbGluazogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9qYWNrc29ucm9hZDcvJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnRW1haWwnLFxuICAgICAgICBmYUNsYXNzOiAnZmFzIGZhLWVudmVsb3BlJyxcbiAgICAgICAgbGluazogJ21haWx0bzpqYWNrc29uQG5lc3RlbHJvYWQuY29tJ1xuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRWxlbWVudEZhY3RvcnkgPSB2b2lkIDA7XG52YXIgRWxlbWVudEZhY3Rvcnk7XG4oZnVuY3Rpb24gKEVsZW1lbnRGYWN0b3J5KSB7XG4gICAgdmFyIEZyYWdtZW50ID0gJzw+PC8+JztcbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHRhZ05hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBjaGlsZHJlbltfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFnTmFtZSA9PT0gRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBfYiA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpOyBfYSA8IF9iLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfYltfYV07XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdjbGFzc05hbWUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBKU3RvQ1NTKGF0dHJpYnV0ZVZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoa2V5LnN0YXJ0c1dpdGgoJ29uJykgJiYgdHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihrZXkuc3Vic3RyaW5nKDIpLnRvTG93ZXJDYXNlKCksIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICdib29sZWFuJyAmJiBhdHRyaWJ1dGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBfYyA9IDAsIGNoaWxkcmVuXzEgPSBjaGlsZHJlbjsgX2MgPCBjaGlsZHJlbl8xLmxlbmd0aDsgX2MrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5fMVtfY107XG4gICAgICAgICAgICBhcHBlbmRDaGlsZChlbGVtZW50LCBjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICAgIEVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50O1xuICAgIGZ1bmN0aW9uIGFwcGVuZENoaWxkKHBhcmVudCwgY2hpbGQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3VuZGVmaW5lZCcgfHwgY2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZCkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgY2hpbGRfMSA9IGNoaWxkOyBfaSA8IGNoaWxkXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gY2hpbGRfMVtfaV07XG4gICAgICAgICAgICAgICAgYXBwZW5kQ2hpbGQocGFyZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoaWxkKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoU3RyaW5nKGNoaWxkKSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIEVsZW1lbnRGYWN0b3J5LmFwcGVuZENoaWxkID0gYXBwZW5kQ2hpbGQ7XG4gICAgZnVuY3Rpb24gSlN0b0NTUyhjc3NPYmplY3QpIHtcbiAgICAgICAgdmFyIGNzc1N0cmluZyA9IFwiXCI7XG4gICAgICAgIHZhciBydWxlO1xuICAgICAgICB2YXIgcnVsZXMgPSBPYmplY3Qua2V5cyhjc3NPYmplY3QpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrLCBjc3NTdHJpbmcgKz0gJyAnKSB7XG4gICAgICAgICAgICBydWxlID0gcnVsZXNbaV07XG4gICAgICAgICAgICBjc3NTdHJpbmcgKz0gcnVsZS5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uICh1cHBlcikgeyByZXR1cm4gXCItXCIgKyB1cHBlclswXS50b0xvd2VyQ2FzZSgpOyB9KSArIFwiOiBcIiArIGNzc09iamVjdFtydWxlXSArIFwiO1wiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjc3NTdHJpbmc7XG4gICAgfVxufSkoRWxlbWVudEZhY3RvcnkgPSBleHBvcnRzLkVsZW1lbnRGYWN0b3J5IHx8IChleHBvcnRzLkVsZW1lbnRGYWN0b3J5ID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgQWJvdXRfMSA9IHJlcXVpcmUoXCIuLi9EYXRhL0Fib3V0XCIpO1xudmFyIFF1YWxpdGllc18xID0gcmVxdWlyZShcIi4uL0RhdGEvUXVhbGl0aWVzXCIpO1xudmFyIFF1YWxpdHlfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1F1YWxpdHlcIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgV2ViUGFnZV8xLkZsYXZvclRleHQuaW5uZXJUZXh0ID0gQWJvdXRfMS5BYm91dE1lO1xufSk7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgdmFyIG9iamVjdDtcbiAgICBmb3IgKHZhciBfaSA9IDAsIFF1YWxpdGllc18yID0gUXVhbGl0aWVzXzEuUXVhbGl0aWVzOyBfaSA8IFF1YWxpdGllc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgcXVhbGl0eSA9IFF1YWxpdGllc18yW19pXTtcbiAgICAgICAgb2JqZWN0ID0gbmV3IFF1YWxpdHlfMS5RdWFsaXR5KHF1YWxpdHkpO1xuICAgICAgICBvYmplY3QuYXBwZW5kVG8oV2ViUGFnZV8xLlF1YWxpdGllc0NvbnRhaW5lcik7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xuV2ViUGFnZV8xLkJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpIHtcbn0sIHtcbiAgICBjYXB0dXJlOiB0cnVlLFxuICAgIHBhc3NpdmU6IHRydWVcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBTb2NpYWxfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1NvY2lhbFwiKTtcbnZhciBTb2NpYWxfMiA9IHJlcXVpcmUoXCIuLi9EYXRhL1NvY2lhbFwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICB2YXIgY2FyZDtcbiAgICBmb3IgKHZhciBfaSA9IDAsIERhdGFfMSA9IFNvY2lhbF8yLlNvY2lhbDsgX2kgPCBEYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBkYXRhID0gRGF0YV8xW19pXTtcbiAgICAgICAgY2FyZCA9IG5ldyBTb2NpYWxfMS5Tb2NpYWwoZGF0YSk7XG4gICAgICAgIGNhcmQuYXBwZW5kVG8oV2ViUGFnZV8xLlNvY2lhbEdyaWQpO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnI2Nvbm5lY3QgLmZvb3RlciAuY29weXJpZ2h0IC55ZWFyJykuaW5uZXJUZXh0ID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgRWR1Y2F0aW9uXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9FZHVjYXRpb25cIik7XG52YXIgRWR1Y2F0aW9uXzIgPSByZXF1aXJlKFwiLi4vRGF0YS9FZHVjYXRpb25cIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgdmFyIEVkdWNhdGlvblNlY3Rpb24gPSBXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdlZHVjYXRpb24nKS5lbGVtZW50O1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gRWR1Y2F0aW9uXzIuRWR1Y2F0aW9uOyBfaSA8IERhdGFfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGRhdGEgPSBEYXRhXzFbX2ldO1xuICAgICAgICBjYXJkID0gbmV3IEVkdWNhdGlvbl8xLkVkdWNhdGlvbihkYXRhKTtcbiAgICAgICAgY2FyZC5hcHBlbmRUbyhFZHVjYXRpb25TZWN0aW9uKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgRXhwZXJpZW5jZV8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvRXhwZXJpZW5jZVwiKTtcbnZhciBFeHBlcmllbmNlXzIgPSByZXF1aXJlKFwiLi4vRGF0YS9FeHBlcmllbmNlXCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgIHZhciBFeHBlcmllbmNlU2VjdGlvbiA9IFdlYlBhZ2VfMS5TZWN0aW9ucy5nZXQoJ2V4cGVyaWVuY2UnKS5lbGVtZW50O1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gRXhwZXJpZW5jZV8yLkV4cGVyaWVuY2U7IF9pIDwgRGF0YV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgZGF0YSA9IERhdGFfMVtfaV07XG4gICAgICAgIGNhcmQgPSBuZXcgRXhwZXJpZW5jZV8xLkV4cGVyaWVuY2UoZGF0YSk7XG4gICAgICAgIGNhcmQuYXBwZW5kVG8oRXhwZXJpZW5jZVNlY3Rpb24pO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICBpZiAoIURPTV8xLkRPTS5pc0lFKCkpIHtcbiAgICAgICAgV2ViUGFnZV8xLkxvZ28uT3V0ZXIuY2xhc3NMaXN0LnJlbW92ZSgncHJlbG9hZCcpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5Mb2dvLklubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZWxvYWQnKTtcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIFdlYlBhZ2VfMS5Mb2dvLk91dGVyLmNsYXNzTmFtZSA9ICdvdXRlcic7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgV2ViUGFnZV8xLkxvZ28uSW5uZXIuY2xhc3NOYW1lID0gJ2lubmVyJztcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG5XZWJQYWdlXzEuTWVudUJ1dHRvbi5zdWJzY3JpYmUoV2ViUGFnZV8xLk1haW4sIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5uYW1lID09PSAndG9nZ2xlJykge1xuICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLm9wZW4pIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5NYWluLnNldEF0dHJpYnV0ZSgnc2hpZnRlZCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5NYWluLnJlbW92ZUF0dHJpYnV0ZSgnc2hpZnRlZCcpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5XZWJQYWdlXzEuU2Nyb2xsSG9vay5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIHNlY3Rpb247XG4gICAgdmFyIGFuY2hvcjtcbiAgICB2YXIgaXRlciA9IFdlYlBhZ2VfMS5TZWN0aW9uVG9NZW51LnZhbHVlcygpO1xuICAgIHZhciBjdXJyZW50ID0gaXRlci5uZXh0KCk7XG4gICAgZm9yICh2YXIgZG9uZSA9IGZhbHNlOyAhZG9uZTsgY3VycmVudCA9IGl0ZXIubmV4dCgpLCBkb25lID0gY3VycmVudC5kb25lKSB7XG4gICAgICAgIF9hID0gY3VycmVudC52YWx1ZSwgc2VjdGlvbiA9IF9hWzBdLCBhbmNob3IgPSBfYVsxXTtcbiAgICAgICAgaWYgKHNlY3Rpb24uaW5WaWV3KCkpIHtcbiAgICAgICAgICAgIGFuY2hvci5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yLnJlbW92ZUF0dHJpYnV0ZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0sIHtcbiAgICBjYXB0dXJlOiB0cnVlLFxuICAgIHBhc3NpdmU6IHRydWVcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIFdlYlBhZ2VfMS5NZW51QnV0dG9uLnVwZGF0ZUNvbnRyYXN0KCk7XG59LCB7XG4gICAgY2FwdHVyZTogdHJ1ZSxcbiAgICBwYXNzaXZlOiB0cnVlXG59KTtcbldlYlBhZ2VfMS5NZW51QnV0dG9uLkhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBXZWJQYWdlXzEuTWVudUJ1dHRvbi50b2dnbGUoKTtcbn0pO1xudmFyIGl0ZXIgPSBXZWJQYWdlXzEuU2VjdGlvblRvTWVudS52YWx1ZXMoKTtcbnZhciBjdXJyZW50ID0gaXRlci5uZXh0KCk7XG52YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBzZWN0aW9uO1xuICAgIHZhciBhbmNob3IgPSB2b2lkIDA7XG4gICAgX2EgPSBjdXJyZW50LnZhbHVlLCBzZWN0aW9uID0gX2FbMF0sIGFuY2hvciA9IF9hWzFdO1xuICAgIGFuY2hvci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWN0aW9uLmVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbmZvciAodmFyIGRvbmUgPSBmYWxzZTsgIWRvbmU7IGN1cnJlbnQgPSBpdGVyLm5leHQoKSwgZG9uZSA9IGN1cnJlbnQuZG9uZSkge1xuICAgIF9sb29wXzEoZG9uZSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIFByb2plY3RfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1Byb2plY3RcIik7XG52YXIgUHJvamVjdHNfMSA9IHJlcXVpcmUoXCIuLi9EYXRhL1Byb2plY3RzXCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgUHJvamVjdHNDb250YWluZXIgPSBXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdwcm9qZWN0cycpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzLWNvbnRhaW5lcicpO1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gUHJvamVjdHNfMS5Qcm9qZWN0czsgX2kgPCBEYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBkYXRhID0gRGF0YV8xW19pXTtcbiAgICAgICAgY2FyZCA9IG5ldyBQcm9qZWN0XzEuUHJvamVjdChkYXRhKTtcbiAgICAgICAgY2FyZC5hcHBlbmRUbyhQcm9qZWN0c0NvbnRhaW5lcik7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRE9NID0gdm9pZCAwO1xudmFyIERPTTtcbihmdW5jdGlvbiAoRE9NKSB7XG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudHMocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpO1xuICAgIH1cbiAgICBET00uZ2V0RWxlbWVudHMgPSBnZXRFbGVtZW50cztcbiAgICBmdW5jdGlvbiBnZXRGaXJzdEVsZW1lbnQocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudHMocXVlcnkpWzBdO1xuICAgIH1cbiAgICBET00uZ2V0Rmlyc3RFbGVtZW50ID0gZ2V0Rmlyc3RFbGVtZW50O1xuICAgIGZ1bmN0aW9uIGdldFZpZXdwb3J0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLm1heCh3aW5kb3cuaW5uZXJIZWlnaHQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpLFxuICAgICAgICAgICAgd2lkdGg6IE1hdGgubWF4KHdpbmRvdy5pbm5lcldpZHRoLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpXG4gICAgICAgIH07XG4gICAgfVxuICAgIERPTS5nZXRWaWV3cG9ydCA9IGdldFZpZXdwb3J0O1xuICAgIGZ1bmN0aW9uIGdldENlbnRlck9mVmlld3BvcnQoKSB7XG4gICAgICAgIHZhciBfYSA9IGdldFZpZXdwb3J0KCksIGhlaWdodCA9IF9hLmhlaWdodCwgd2lkdGggPSBfYS53aWR0aDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHdpZHRoIC8gMixcbiAgICAgICAgICAgIHk6IGhlaWdodCAvIDJcbiAgICAgICAgfTtcbiAgICB9XG4gICAgRE9NLmdldENlbnRlck9mVmlld3BvcnQgPSBnZXRDZW50ZXJPZlZpZXdwb3J0O1xuICAgIGZ1bmN0aW9uIGlzSUUoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKE1TSUV8VHJpZGVudCkvKSAhPT0gbnVsbDtcbiAgICB9XG4gICAgRE9NLmlzSUUgPSBpc0lFO1xuICAgIGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrXzEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFja18xKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2N1bWVudCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2FsbGJhY2tfMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBET00ubG9hZCA9IGxvYWQ7XG4gICAgZnVuY3Rpb24gYm91bmRpbmdDbGllbnRSZWN0VG9PYmplY3QocmVjdCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgICAgIHJpZ2h0OiByZWN0LnJpZ2h0LFxuICAgICAgICAgICAgYm90dG9tOiByZWN0LmJvdHRvbSxcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCxcbiAgICAgICAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgICAgICAgIHg6IHJlY3QueCA/IHJlY3QueCA6IDAsXG4gICAgICAgICAgICB5OiByZWN0LnkgPyByZWN0LnkgOiAwXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uUGFnZShlbGVtZW50KSB7XG4gICAgICAgIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuICFPYmplY3QudmFsdWVzKGJvdW5kaW5nQ2xpZW50UmVjdFRvT2JqZWN0KHJlY3QpKS5ldmVyeShmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgPT09IDA7IH0pO1xuICAgIH1cbiAgICBET00ub25QYWdlID0gb25QYWdlO1xuICAgIGZ1bmN0aW9uIGdldERPTU5hbWUoZWxlbWVudCkge1xuICAgICAgICB2YXIgc3RyID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChlbGVtZW50LmlkKSB7XG4gICAgICAgICAgICBzdHIgKz0gJyMnICsgZWxlbWVudC5pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHN0ciArPSAnLicgKyBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgRE9NLmdldERPTU5hbWUgPSBnZXRET01OYW1lO1xuICAgIGZ1bmN0aW9uIGdldERPTVBhdGgoZWxlbWVudCkge1xuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGF0aCA9IFtlbGVtZW50XTtcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2h0bWwnKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXRoLnVuc2hpZnQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxuICAgIERPTS5nZXRET01QYXRoID0gZ2V0RE9NUGF0aDtcbiAgICBmdW5jdGlvbiBnZXRET01QYXRoTmFtZXMoZWxlbWVudCkge1xuICAgICAgICB2YXIgcGF0aCA9IGdldERPTVBhdGgoZWxlbWVudCk7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoLm1hcChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZ2V0RE9NTmFtZShlbGVtZW50KTsgfSk7XG4gICAgfVxuICAgIERPTS5nZXRET01QYXRoTmFtZXMgPSBnZXRET01QYXRoTmFtZXM7XG4gICAgZnVuY3Rpb24gZ2V0Q1NTU2VsZWN0b3IoZWxlbWVudCwgY29uZGVuc2UpIHtcbiAgICAgICAgaWYgKGNvbmRlbnNlID09PSB2b2lkIDApIHsgY29uZGVuc2UgPSB0cnVlOyB9XG4gICAgICAgIHZhciBuYW1lcyA9IGdldERPTVBhdGhOYW1lcyhlbGVtZW50KTtcbiAgICAgICAgaWYgKCFjb25kZW5zZSB8fCBuYW1lcy5sZW5ndGggPD0gNikge1xuICAgICAgICAgICAgcmV0dXJuIG5hbWVzLmpvaW4oJyA+ICcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW5ndGggPSBuYW1lcy5sZW5ndGg7XG4gICAgICAgIHZhciBiZWdpbiA9IG5hbWVzLnNsaWNlKDAsIDMpO1xuICAgICAgICB2YXIgZW5kID0gbmFtZXMuc2xpY2UobGVuZ3RoIC0gMywgbGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIGJlZ2luLmpvaW4oJyA+ICcpICsgXCIgPiAuLi4gPiBcIiArIGVuZC5qb2luKCcgPiAnKTtcbiAgICB9XG4gICAgRE9NLmdldENTU1NlbGVjdG9yID0gZ2V0Q1NTU2VsZWN0b3I7XG4gICAgZnVuY3Rpb24gZ2V0Q2hpbGRPZmZzZXRQb3NGb3JDb250YWluZXIoY29udGFpbmVyLCBjaGlsZCwgY2FsbGVyKSB7XG4gICAgICAgIGlmIChjYWxsZXIgPT09IHZvaWQgMCkgeyBjYWxsZXIgPSAnJzsgfVxuICAgICAgICB2YXIgb2Zmc2V0VG9wID0gMDtcbiAgICAgICAgdmFyIG9mZnNldExlZnQgPSAwO1xuICAgICAgICB2YXIgY3VyciA9IGNoaWxkO1xuICAgICAgICB3aGlsZSAoY3VyciAmJiBjdXJyICE9PSBjb250YWluZXIpIHtcbiAgICAgICAgICAgIG9mZnNldFRvcCArPSBjdXJyLm9mZnNldFRvcDtcbiAgICAgICAgICAgIG9mZnNldExlZnQgKz0gY3Vyci5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgY3VyciA9IChjdXJyLm9mZnNldFBhcmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjdXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKGNhbGxlciA/IGNhbGxlciArIFwiID0+IFwiIDogJycpICsgXCJcXFwiXCIgKyBnZXRDU1NTZWxlY3RvcihjaGlsZCkgKyBcIlxcXCIgZG9lcyBub3QgY29udGFpbiBcXFwiXCIgKyBnZXRDU1NTZWxlY3Rvcihjb250YWluZXIpICsgXCJcXFwiIGFzIGFuIG9mZnNldCBwYXJlbnQuIENoZWNrIHRoYXQgdGhlIGNvbnRhaW5lciBoYXMgXFxcInBvc2l0aW9uOiByZWxhdGl2ZVxcXCIgc2V0IG9yIHRoYXQgaXQgaXMgaW4gdGhlIERPTSBwYXRoLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBvZmZzZXRUb3A6IG9mZnNldFRvcCwgb2Zmc2V0TGVmdDogb2Zmc2V0TGVmdCB9O1xuICAgIH1cbiAgICBET00uZ2V0Q2hpbGRPZmZzZXRQb3NGb3JDb250YWluZXIgPSBnZXRDaGlsZE9mZnNldFBvc0ZvckNvbnRhaW5lcjtcbiAgICBmdW5jdGlvbiBsaW5lcyh0b3AxLCBzaXplMSwgdG9wMiwgc2l6ZTIsIG9mZnNldCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdG9wMSAtIG9mZnNldCxcbiAgICAgICAgICAgIHRvcDEgLSBvZmZzZXQgKyBzaXplMSxcbiAgICAgICAgICAgIHRvcDIsXG4gICAgICAgICAgICB0b3AyICsgc2l6ZTIsXG4gICAgICAgIF07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHh5T2Zmc2V0KHhPZmZzZXQsIHlPZmZzZXQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgaWYgKHhPZmZzZXQgJiYgeE9mZnNldCA8PSAxKSB7XG4gICAgICAgICAgICB4T2Zmc2V0ID0gd2lkdGggKiB4T2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeE9mZnNldCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHlPZmZzZXQgJiYgeU9mZnNldCA8PSAxKSB7XG4gICAgICAgICAgICB5T2Zmc2V0ID0gaGVpZ2h0ICogeU9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHlPZmZzZXQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHhPZmZzZXQ6IHhPZmZzZXQsIHlPZmZzZXQ6IHlPZmZzZXQgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5PZmZzZXRWaWV3KGNoaWxkLCBzZXR0aW5ncykge1xuICAgICAgICBpZiAoc2V0dGluZ3MgPT09IHZvaWQgMCkgeyBzZXR0aW5ncyA9IHt9OyB9XG4gICAgICAgIHZhciBjb250YWluZXI7XG4gICAgICAgIHZhciBvZmZzZXRUb3A7XG4gICAgICAgIHZhciBvZmZzZXRMZWZ0O1xuICAgICAgICBpZiAoIXNldHRpbmdzLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgY29udGFpbmVyID0gY2hpbGQub2Zmc2V0UGFyZW50O1xuICAgICAgICAgICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2luT2Zmc2V0VmlldyhjaGlsZCwgLi4uKSA9PiBjaGlsZC5vZmZzZXRQYXJlbnQgY2Fubm90IGJlIG51bGwuIENoZWNrIHRoYXQgaXQgaXMgaW4gYSBjb250YWluZXIgd2l0aCBcInBvc2l0aW9uOiByZWxhdGl2ZVwiIHNldC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9mZnNldFRvcCA9IGNoaWxkLm9mZnNldFRvcDtcbiAgICAgICAgICAgIG9mZnNldExlZnQgPSBjaGlsZC5vZmZzZXRMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldENoaWxkT2Zmc2V0UG9zRm9yQ29udGFpbmVyKHNldHRpbmdzLmNvbnRhaW5lciwgY2hpbGQsICdpbk9mZnNldFZpZXcoY2hpbGQsIC4uLiknKTtcbiAgICAgICAgICAgIG9mZnNldFRvcCA9IHJlc3VsdC5vZmZzZXRUb3A7XG4gICAgICAgICAgICBvZmZzZXRMZWZ0ID0gcmVzdWx0Lm9mZnNldExlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoaWxkUmVjdCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoT2JqZWN0LnZhbHVlcyhib3VuZGluZ0NsaWVudFJlY3RUb09iamVjdChjaGlsZFJlY3QpKS5ldmVyeShmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgPT09IDA7IH0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBfYSA9IHh5T2Zmc2V0KHNldHRpbmdzLnhPZmZzZXQsIHNldHRpbmdzLnlPZmZzZXQsIGNvbnRhaW5lclJlY3Qud2lkdGgsIGNvbnRhaW5lclJlY3QuaGVpZ2h0KSwgeE9mZnNldCA9IF9hLnhPZmZzZXQsIHlPZmZzZXQgPSBfYS55T2Zmc2V0O1xuICAgICAgICB2YXIgeCA9IHRydWU7XG4gICAgICAgIHZhciB5ID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFzZXR0aW5ncy5pZ25vcmVZKSB7XG4gICAgICAgICAgICB2YXIgX2IgPSBsaW5lcyhjb250YWluZXIuc2Nyb2xsVG9wLCBjb250YWluZXJSZWN0LmhlaWdodCwgb2Zmc2V0VG9wLCBjaGlsZFJlY3QuaGVpZ2h0LCB5T2Zmc2V0KSwgY29udGFpbmVyVG9wTGluZSA9IF9iWzBdLCBjb250YWluZXJCb3R0b21MaW5lID0gX2JbMV0sIGNoaWxkVG9wTGluZSA9IF9iWzJdLCBjaGlsZEJvdHRvbUxpbmUgPSBfYlszXTtcbiAgICAgICAgICAgIHkgPSBzZXR0aW5ncy53aG9sZSA/XG4gICAgICAgICAgICAgICAgY2hpbGRCb3R0b21MaW5lIDwgY29udGFpbmVyQm90dG9tTGluZVxuICAgICAgICAgICAgICAgICAgICAmJiBjaGlsZFRvcExpbmUgPiBjb250YWluZXJUb3BMaW5lXG4gICAgICAgICAgICAgICAgOiBjaGlsZEJvdHRvbUxpbmUgPiBjb250YWluZXJUb3BMaW5lXG4gICAgICAgICAgICAgICAgICAgICYmIGNoaWxkVG9wTGluZSA8IGNvbnRhaW5lckJvdHRvbUxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXR0aW5ncy5pZ25vcmVYKSB7XG4gICAgICAgICAgICB2YXIgX2MgPSBsaW5lcyhjb250YWluZXIuc2Nyb2xsTGVmdCwgY29udGFpbmVyUmVjdC53aWR0aCwgb2Zmc2V0TGVmdCwgY2hpbGRSZWN0LndpZHRoLCB4T2Zmc2V0KSwgY29udGFpbmVyTGVmdExpbmUgPSBfY1swXSwgY29udGFpbmVyUmlnaHRMaW5lID0gX2NbMV0sIGNoaWxkTGVmdExpbmUgPSBfY1syXSwgY2hpbGRSaWdodExpbmUgPSBfY1szXTtcbiAgICAgICAgICAgIHggPSBzZXR0aW5ncy53aG9sZSA/XG4gICAgICAgICAgICAgICAgY2hpbGRSaWdodExpbmUgPCBjb250YWluZXJSaWdodExpbmVcbiAgICAgICAgICAgICAgICAgICAgJiYgY2hpbGRMZWZ0TGluZSA+IGNvbnRhaW5lckxlZnRMaW5lXG4gICAgICAgICAgICAgICAgOiBjaGlsZFJpZ2h0TGluZSA+IGNvbnRhaW5lckxlZnRMaW5lXG4gICAgICAgICAgICAgICAgICAgICYmIGNoaWxkTGVmdExpbmUgPCBjb250YWluZXJSaWdodExpbmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggJiYgeTtcbiAgICB9XG4gICAgRE9NLmluT2Zmc2V0VmlldyA9IGluT2Zmc2V0VmlldztcbiAgICBmdW5jdGlvbiBzY3JvbGxUbyhjb250YWluZXIsIGxlZnQsIHRvcCwgc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzID09PSB2b2lkIDApIHsgc2V0dGluZ3MgPSB7fTsgfVxuICAgICAgICBpZiAoaXNJRSgpKSB7XG4gICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsTGVmdCA9IGxlZnQ7XG4gICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29udGFpbmVyLnNjcm9sbFRvKHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgICAgIGJlaGF2aW9yOiBzZXR0aW5ncy5zbW9vdGggPyAnc21vb3RoJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNjcm9sbENvbnRhaW5lclRvVmlld1dob2xlQ2hpbGQoY29udGFpbmVyLCBjaGlsZCwgc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzID09PSB2b2lkIDApIHsgc2V0dGluZ3MgPSB7fTsgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0Q2hpbGRPZmZzZXRQb3NGb3JDb250YWluZXIoY29udGFpbmVyLCBjaGlsZCwgJ3Njcm9sbENvbnRhaW5lclRvVmlld0NoaWxkV2hvbGUoLi4uKScpO1xuICAgICAgICB2YXIgb2Zmc2V0VG9wID0gcmVzdWx0Lm9mZnNldFRvcDtcbiAgICAgICAgdmFyIG9mZnNldExlZnQgPSByZXN1bHQub2Zmc2V0TGVmdDtcbiAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBjaGlsZFJlY3QgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIF9hID0geHlPZmZzZXQoc2V0dGluZ3MueE9mZnNldCwgc2V0dGluZ3MueU9mZnNldCwgY29udGFpbmVyUmVjdC53aWR0aCwgY29udGFpbmVyUmVjdC5oZWlnaHQpLCB4T2Zmc2V0ID0gX2EueE9mZnNldCwgeU9mZnNldCA9IF9hLnlPZmZzZXQ7XG4gICAgICAgIHZhciBfYiA9IGxpbmVzKGNvbnRhaW5lci5zY3JvbGxUb3AsIGNvbnRhaW5lclJlY3QuaGVpZ2h0LCBvZmZzZXRUb3AsIGNoaWxkUmVjdC5oZWlnaHQsIHlPZmZzZXQpLCBjb250YWluZXJUb3BMaW5lID0gX2JbMF0sIGNvbnRhaW5lckJvdHRvbUxpbmUgPSBfYlsxXSwgY2hpbGRUb3BMaW5lID0gX2JbMl0sIGNoaWxkQm90dG9tTGluZSA9IF9iWzNdO1xuICAgICAgICB2YXIgX2MgPSBsaW5lcyhjb250YWluZXIuc2Nyb2xsTGVmdCwgY29udGFpbmVyUmVjdC53aWR0aCwgb2Zmc2V0TGVmdCwgY2hpbGRSZWN0LndpZHRoLCB4T2Zmc2V0KSwgY29udGFpbmVyTGVmdExpbmUgPSBfY1swXSwgY29udGFpbmVyUmlnaHRMaW5lID0gX2NbMV0sIGNoaWxkTGVmdExpbmUgPSBfY1syXSwgY2hpbGRSaWdodExpbmUgPSBfY1szXTtcbiAgICAgICAgdmFyIHggPSBjb250YWluZXIuc2Nyb2xsTGVmdDtcbiAgICAgICAgdmFyIHkgPSBjb250YWluZXIuc2Nyb2xsVG9wO1xuICAgICAgICBpZiAoIXNldHRpbmdzLmlnbm9yZVkpIHtcbiAgICAgICAgICAgIHZhciBhYm92ZSA9IGNoaWxkVG9wTGluZSA8IGNvbnRhaW5lclRvcExpbmU7XG4gICAgICAgICAgICB2YXIgYmVsb3cgPSBjaGlsZEJvdHRvbUxpbmUgPiBjb250YWluZXJCb3R0b21MaW5lO1xuICAgICAgICAgICAgaWYgKGFib3ZlICYmICFiZWxvdykge1xuICAgICAgICAgICAgICAgIHkgPSBjaGlsZFRvcExpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghYWJvdmUgJiYgYmVsb3cpIHtcbiAgICAgICAgICAgICAgICB5ICs9IGNoaWxkQm90dG9tTGluZSAtIGNvbnRhaW5lckJvdHRvbUxpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXR0aW5ncy5pZ25vcmVYKSB7XG4gICAgICAgICAgICB2YXIgbGVmdCA9IGNoaWxkTGVmdExpbmUgPCBjb250YWluZXJMZWZ0TGluZTtcbiAgICAgICAgICAgIHZhciByaWdodCA9IGNoaWxkUmlnaHRMaW5lID4gY29udGFpbmVyUmlnaHRMaW5lO1xuICAgICAgICAgICAgaWYgKGxlZnQgJiYgIXJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgeCA9IGNoaWxkTGVmdExpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghbGVmdCAmJiByaWdodCkge1xuICAgICAgICAgICAgICAgIHggKz0gY2hpbGRSaWdodExpbmUgLSBjb250YWluZXJSaWdodExpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2Nyb2xsVG8oY29udGFpbmVyLCB4LCB5LCBzZXR0aW5ncyk7XG4gICAgfVxuICAgIERPTS5zY3JvbGxDb250YWluZXJUb1ZpZXdXaG9sZUNoaWxkID0gc2Nyb2xsQ29udGFpbmVyVG9WaWV3V2hvbGVDaGlsZDtcbiAgICBmdW5jdGlvbiBpblZlcnRpY2FsV2luZG93VmlldyhlbGVtZW50LCBvZmZzZXQpIHtcbiAgICAgICAgaWYgKG9mZnNldCA9PT0gdm9pZCAwKSB7IG9mZnNldCA9IDA7IH1cbiAgICAgICAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoT2JqZWN0LnZhbHVlcyhib3VuZGluZ0NsaWVudFJlY3RUb09iamVjdChyZWN0KSkuZXZlcnkoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsID09PSAwOyB9KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2aWV3SGVpZ2h0ID0gZ2V0Vmlld3BvcnQoKS5oZWlnaHQ7XG4gICAgICAgIGlmIChvZmZzZXQgPD0gMSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gdmlld0hlaWdodCAqIG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHJlY3QuYm90dG9tICsgb2Zmc2V0KSA+PSAwICYmIChyZWN0LnRvcCArIG9mZnNldCAtIHZpZXdIZWlnaHQpIDwgMDtcbiAgICB9XG4gICAgRE9NLmluVmVydGljYWxXaW5kb3dWaWV3ID0gaW5WZXJ0aWNhbFdpbmRvd1ZpZXc7XG4gICAgZnVuY3Rpb24gcGl4ZWxzQmVsb3dTY3JlZW5Ub3AoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgfVxuICAgIERPTS5waXhlbHNCZWxvd1NjcmVlblRvcCA9IHBpeGVsc0JlbG93U2NyZWVuVG9wO1xuICAgIGZ1bmN0aW9uIHBpeGVsc0Fib3ZlU2NyZWVuQm90dG9tKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgdmlld0hlaWdodCA9IGdldFZpZXdwb3J0KCkuaGVpZ2h0O1xuICAgICAgICByZXR1cm4gdmlld0hlaWdodCAtIHJlY3QuYm90dG9tO1xuICAgIH1cbiAgICBET00ucGl4ZWxzQWJvdmVTY3JlZW5Cb3R0b20gPSBwaXhlbHNBYm92ZVNjcmVlbkJvdHRvbTtcbiAgICBmdW5jdGlvbiBvbkZpcnN0QXBwZWFyYW5jZShlbGVtZW50LCBjYWxsYmFjaywgc2V0dGluZykge1xuICAgICAgICB2YXIgdGltZW91dCA9IHNldHRpbmcgPyBzZXR0aW5nLnRpbWVvdXQgOiAwO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gc2V0dGluZyA/IHNldHRpbmcub2Zmc2V0IDogMDtcbiAgICAgICAgaWYgKGluVmVydGljYWxXaW5kb3dWaWV3KGVsZW1lbnQsIG9mZnNldCkpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2tfMSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChpblZlcnRpY2FsV2luZG93VmlldyhlbGVtZW50LCBvZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBldmVudENhbGxiYWNrXzEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGV2ZW50Q2FsbGJhY2tfMSwge1xuICAgICAgICAgICAgICAgIGNhcHR1cmU6IHRydWUsXG4gICAgICAgICAgICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgRE9NLm9uRmlyc3RBcHBlYXJhbmNlID0gb25GaXJzdEFwcGVhcmFuY2U7XG4gICAgZnVuY3Rpb24gZ2V0UGF0aFRvUm9vdChlbGVtZW50KSB7XG4gICAgICAgIHZhciBwYXRoID0gW107XG4gICAgICAgIHZhciBjdXJyID0gZWxlbWVudDtcbiAgICAgICAgd2hpbGUgKGN1cnIpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChjdXJyKTtcbiAgICAgICAgICAgIGN1cnIgPSBjdXJyLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGguaW5kZXhPZih3aW5kb3cpID09PSAtMSAmJiBwYXRoLmluZGV4T2YoZG9jdW1lbnQpID09PSAtMSkge1xuICAgICAgICAgICAgcGF0aC5wdXNoKGRvY3VtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGF0aC5pbmRleE9mKHdpbmRvdykgPT09IC0xKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2god2luZG93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG4gICAgRE9NLmdldFBhdGhUb1Jvb3QgPSBnZXRQYXRoVG9Sb290O1xufSkoRE9NID0gZXhwb3J0cy5ET00gfHwgKGV4cG9ydHMuRE9NID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FdmVudHMgPSB2b2lkIDA7XG52YXIgRXZlbnRzO1xuKGZ1bmN0aW9uIChFdmVudHMpIHtcbiAgICB2YXIgTmV3RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBOZXdFdmVudChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5kZXRhaWwgPSBkZXRhaWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE5ld0V2ZW50O1xuICAgIH0oKSk7XG4gICAgRXZlbnRzLk5ld0V2ZW50ID0gTmV3RXZlbnQ7XG4gICAgdmFyIEV2ZW50RGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5hZGQobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kZWxldGUobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uIChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuZXZlbnRzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBldmVudCA9IG5ldyBOZXdFdmVudChuYW1lLCBkZXRhaWwpO1xuICAgICAgICAgICAgdmFyIGl0ID0gdGhpcy5saXN0ZW5lcnMudmFsdWVzKCk7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICAgICAgICB3aGlsZSAoY2FsbGJhY2sgPSBpdC5uZXh0KCkudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RGlzcGF0Y2hlcjtcbiAgICB9KCkpO1xuICAgIEV2ZW50cy5FdmVudERpc3BhdGNoZXIgPSBFdmVudERpc3BhdGNoZXI7XG59KShFdmVudHMgPSBleHBvcnRzLkV2ZW50cyB8fCAoZXhwb3J0cy5FdmVudHMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNWRyA9IHZvaWQgMDtcbnZhciBTVkc7XG4oZnVuY3Rpb24gKFNWRykge1xuICAgIFNWRy5zdmducyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG4gICAgU1ZHLnhsaW5rbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc7XG4gICAgU1ZHLmxvYWRTVkcgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwgKyBcIi5zdmdcIiwgdHJ1ZSk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgICAgICAgICAgIHZhciBwYXJzZWREb2N1bWVudCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmVxdWVzdC5yZXNwb25zZVRleHQsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShwYXJzZWREb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlamVjdChcIkZhaWxlZCB0byByZWFkIFNWRy5cIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG59KShTVkcgPSBleHBvcnRzLlNWRyB8fCAoZXhwb3J0cy5TVkcgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNvY2lhbEdyaWQgPSBleHBvcnRzLlNraWxsc0dyaWQgPSBleHBvcnRzLlF1YWxpdGllc0NvbnRhaW5lciA9IGV4cG9ydHMuRmxhdm9yVGV4dCA9IGV4cG9ydHMuQmFja2dyb3VuZCA9IGV4cG9ydHMuU2VjdGlvblRvTWVudSA9IGV4cG9ydHMuU2VjdGlvbnMgPSBleHBvcnRzLlNraWxsc0ZpbHRlck9iamVjdCA9IGV4cG9ydHMuTWVudUJ1dHRvbiA9IGV4cG9ydHMuTG9nbyA9IGV4cG9ydHMuU2Nyb2xsSG9vayA9IGV4cG9ydHMuTWFpblNjcm9sbCA9IGV4cG9ydHMuTWFpbiA9IGV4cG9ydHMuQm9keSA9IHZvaWQgMDtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuL0RPTVwiKTtcbnZhciBTZWN0aW9uXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9TZWN0aW9uXCIpO1xudmFyIE1lbnVfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL01lbnVcIik7XG52YXIgU2tpbGxzRmlsdGVyXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbHNGaWx0ZXJcIik7XG5leHBvcnRzLkJvZHkgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdib2R5Jyk7XG5leHBvcnRzLk1haW4gPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdtYWluJyk7XG5leHBvcnRzLk1haW5TY3JvbGwgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdtYWluIC5zY3JvbGwnKTtcbmV4cG9ydHMuU2Nyb2xsSG9vayA9IERPTV8xLkRPTS5pc0lFKCkgPyB3aW5kb3cgOiBleHBvcnRzLk1haW5TY3JvbGw7XG5leHBvcnRzLkxvZ28gPSB7XG4gICAgT3V0ZXI6IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5sb2dvIC5pbWFnZSBpbWcub3V0ZXInKSxcbiAgICBJbm5lcjogRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnaGVhZGVyLmxvZ28gLmltYWdlIGltZy5pbm5lcicpXG59O1xuZXhwb3J0cy5NZW51QnV0dG9uID0gbmV3IE1lbnVfMS5NZW51KCk7XG5leHBvcnRzLlNraWxsc0ZpbHRlck9iamVjdCA9IG5ldyBTa2lsbHNGaWx0ZXJfMS5Ta2lsbHNGaWx0ZXIoKTtcbmV4cG9ydHMuU2VjdGlvbnMgPSBuZXcgTWFwKCk7XG5mb3IgKHZhciBfaSA9IDAsIF9hID0gQXJyYXkuZnJvbShET01fMS5ET00uZ2V0RWxlbWVudHMoJ3NlY3Rpb24nKSk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBfYVtfaV07XG4gICAgZXhwb3J0cy5TZWN0aW9ucy5zZXQoZWxlbWVudC5pZCwgbmV3IFNlY3Rpb25fMS5kZWZhdWx0KGVsZW1lbnQpKTtcbn1cbmV4cG9ydHMuU2VjdGlvblRvTWVudSA9IG5ldyBNYXAoKTtcbmZvciAodmFyIF9iID0gMCwgX2MgPSBBcnJheS5mcm9tKERPTV8xLkRPTS5nZXRFbGVtZW50cygnaGVhZGVyLm5hdmlnYXRpb24gLnNlY3Rpb25zIGEnKSk7IF9iIDwgX2MubGVuZ3RoOyBfYisrKSB7XG4gICAgdmFyIGFuY2hvciA9IF9jW19iXTtcbiAgICB2YXIgaWQgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpO1xuICAgIGlmIChleHBvcnRzLlNlY3Rpb25zLmdldChpZCkgJiYgZXhwb3J0cy5TZWN0aW9ucy5nZXQoaWQpLmluTWVudSgpKSB7XG4gICAgICAgIGV4cG9ydHMuU2VjdGlvblRvTWVudS5zZXQoaWQsIFtleHBvcnRzLlNlY3Rpb25zLmdldChpZCksIGFuY2hvcl0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQmFja2dyb3VuZCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2JnJyk7XG5leHBvcnRzLkZsYXZvclRleHQgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI2Fib3V0IC5mbGF2b3InKTtcbmV4cG9ydHMuUXVhbGl0aWVzQ29udGFpbmVyID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnc2VjdGlvbiNhYm91dCAucXVhbGl0aWVzJyk7XG5leHBvcnRzLlNraWxsc0dyaWQgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI3NraWxscyAuaGV4LWdyaWQnKTtcbmV4cG9ydHMuU29jaWFsR3JpZCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ3NlY3Rpb24jY29ubmVjdCAuc29jaWFsLWljb25zJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFuaW1hdGlvbihzcGVlZCwgbWF4LCBtaW4sIGluY3JlYXNpbmcpIHtcbiAgICAgICAgaWYgKGluY3JlYXNpbmcgPT09IHZvaWQgMCkgeyBpbmNyZWFzaW5nID0gZmFsc2U7IH1cbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgICAgICB0aGlzLm1heCA9IG1heDtcbiAgICAgICAgdGhpcy5taW4gPSBtaW47XG4gICAgICAgIHRoaXMuaW5jcmVhc2luZyA9IGluY3JlYXNpbmc7XG4gICAgfVxuICAgIHJldHVybiBBbmltYXRpb247XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQW5pbWF0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zID0gdm9pZCAwO1xudmFyIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zO1xuKGZ1bmN0aW9uIChBbmltYXRpb25GcmFtZUZ1bmN0aW9ucykge1xuICAgIGZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICAgICAgICAgIH07XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICBmdW5jdGlvbiBjYW5jZWxBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQ7XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG59KShBbmltYXRpb25GcmFtZUZ1bmN0aW9ucyA9IGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgfHwgKGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbG9yKHIsIGcsIGIpIHtcbiAgICAgICAgdGhpcy5yID0gcjtcbiAgICAgICAgdGhpcy5nID0gZztcbiAgICAgICAgdGhpcy5iID0gYjtcbiAgICB9XG4gICAgQ29sb3IuZnJvbVJHQiA9IGZ1bmN0aW9uIChyLCBnLCBiKSB7XG4gICAgICAgIGlmIChyID49IDAgJiYgciA8IDI1NiAmJiBnID49IDAgJiYgZyA8IDI1NiAmJiBiID49IDAgJiYgYiA8IDI1Nikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb2xvci5mcm9tT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gQ29sb3IuZnJvbVJHQihvYmouciwgb2JqLmcsIG9iai5iKTtcbiAgICB9O1xuICAgIENvbG9yLmZyb21IZXggPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHJldHVybiBDb2xvci5mcm9tT2JqZWN0KENvbG9yLmhleFRvUkdCKGhleCkpO1xuICAgIH07XG4gICAgQ29sb3IuaGV4VG9SR0IgPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHZhciByZXN1bHQgPSAvXiMoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICAgICAgICByZXR1cm4gcmVzdWx0ID8ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gICAgICAgIH0gOiBudWxsO1xuICAgIH07XG4gICAgQ29sb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKG9wYWNpdHkgPT09IHZvaWQgMCkgeyBvcGFjaXR5ID0gMTsgfVxuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgdGhpcy5yICsgXCIsXCIgKyB0aGlzLmcgKyBcIixcIiArIHRoaXMuYiArIFwiLFwiICsgb3BhY2l0eSArIFwiKVwiO1xuICAgIH07XG4gICAgcmV0dXJuIENvbG9yO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29vcmRpbmF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29vcmRpbmF0ZSh4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIENvb3JkaW5hdGUucHJvdG90eXBlLmRpc3RhbmNlID0gZnVuY3Rpb24gKGNvb3JkKSB7XG4gICAgICAgIHZhciBkeCA9IGNvb3JkLnggLSB0aGlzLng7XG4gICAgICAgIHZhciBkeSA9IGNvb3JkLnkgLSB0aGlzLnk7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIH07XG4gICAgQ29vcmRpbmF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKyBcInhcIiArIHRoaXMueTtcbiAgICB9O1xuICAgIHJldHVybiBDb29yZGluYXRlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvb3JkaW5hdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbl8xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uXCIpO1xudmFyIENvbG9yXzEgPSByZXF1aXJlKFwiLi9Db2xvclwiKTtcbnZhciBDb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9Db29yZGluYXRlXCIpO1xudmFyIFN0cm9rZV8xID0gcmVxdWlyZShcIi4vU3Ryb2tlXCIpO1xudmFyIFZlY3Rvcl8xID0gcmVxdWlyZShcIi4vVmVjdG9yXCIpO1xudmFyIFBhcnRpY2xlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZShzZXR0aW5ncykge1xuICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmNyZWF0ZUNvbG9yKHNldHRpbmdzLmNvbG9yKTtcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gdGhpcy5jcmVhdGVPcGFjaXR5KHNldHRpbmdzLm9wYWNpdHkpO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdGhpcy5jcmVhdGVWZWxvY2l0eShzZXR0aW5ncy5tb3ZlKTtcbiAgICAgICAgdGhpcy5zaGFwZSA9IHRoaXMuY3JlYXRlU2hhcGUoc2V0dGluZ3Muc2hhcGUpO1xuICAgICAgICB0aGlzLnN0cm9rZSA9IHRoaXMuY3JlYXRlU3Ryb2tlKHNldHRpbmdzLnN0cm9rZSk7XG4gICAgICAgIHRoaXMucmFkaXVzID0gdGhpcy5jcmVhdGVSYWRpdXMoc2V0dGluZ3MucmFkaXVzKTtcbiAgICAgICAgaWYgKHNldHRpbmdzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSB0aGlzLmFuaW1hdGVPcGFjaXR5KHNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZVJhZGl1cyhzZXR0aW5ncy5hbmltYXRlLnJhZGl1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idWJibGVkID0ge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIHJhZGl1czogMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlQ29sb3IgPSBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21SR0IoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21IZXgoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yXzEuZGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbG9yIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVDb2xvcihjb2xvcltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvci5sZW5ndGgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21PYmplY3QoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDb2xvcl8xLmRlZmF1bHQuZnJvbVJHQigwLCAwLCAwKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVPcGFjaXR5ID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9wYWNpdHkob3BhY2l0eVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvcGFjaXR5Lmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChvcGFjaXR5ID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZVZlbG9jaXR5ID0gZnVuY3Rpb24gKG1vdmUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtb3ZlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgbW92ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB2ZWxvY2l0eSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHN3aXRjaCAobW92ZS5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wLXJpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLjcsIC0wLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbS1yaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMC43LCAwLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20tbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTEsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AtbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgLTAuNyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdmUuc3RyYWlnaHQpIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5yYW5kb20pIHtcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkueCAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eS55ICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmVsb2NpdHkueCArPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICAgICAgICAgIHZlbG9jaXR5LnkgKz0gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2ZWxvY2l0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlU2hhcGUgPSBmdW5jdGlvbiAoc2hhcGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2hhcGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2hhcGUubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBzaWRlcyA9IHBhcnNlSW50KHNoYXBlLnN1YnN0cmluZygwLCBzaGFwZS5pbmRleE9mKCctJykpKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4oc2lkZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2lkZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSA+PSAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnY2lyY2xlJztcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVTdHJva2UgPSBmdW5jdGlvbiAoc3Ryb2tlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3Ryb2tlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHJva2Uud2lkdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cm9rZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KHN0cm9rZS53aWR0aCwgdGhpcy5jcmVhdGVDb2xvcihzdHJva2UuY29sb3IpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KDAsIENvbG9yXzEuZGVmYXVsdC5mcm9tUkdCKDAsIDAsIDApKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVSYWRpdXMgPSBmdW5jdGlvbiAocmFkaXVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmFkaXVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHJhZGl1cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUmFkaXVzKHJhZGl1c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYWRpdXMubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFkaXVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiA1O1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLnBhcnNlU3BlZWQgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNwZWVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwLjU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZU9wYWNpdHkgPSBmdW5jdGlvbiAoYW5pbWF0aW9uKSB7XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICAgIHZhciBtYXggPSB0aGlzLm9wYWNpdHk7XG4gICAgICAgICAgICB2YXIgbWluID0gdGhpcy5jcmVhdGVPcGFjaXR5KGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZVJhZGl1cyA9IGZ1bmN0aW9uIChhbmltYXRpb24pIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgICAgdmFyIG1heCA9IHRoaXMucmFkaXVzO1xuICAgICAgICAgICAgdmFyIG1pbiA9IHRoaXMuY3JlYXRlUmFkaXVzKGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIHNwZWVkO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogc3BlZWQ7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZ2V0UmFkaXVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYWRpdXMgKyB0aGlzLmJ1YmJsZWQucmFkaXVzO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmdldE9wYWNpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHkgKyB0aGlzLmJ1YmJsZWQub3BhY2l0eTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5lZGdlID0gZnVuY3Rpb24gKGRpcikge1xuICAgICAgICBzd2l0Y2ggKGRpcikge1xuICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55IC0gdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLmdldFJhZGl1cygpLCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCAtIHRoaXMuZ2V0UmFkaXVzKCksIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuaW50ZXJzZWN0aW5nID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmRpc3RhbmNlKHBhcnRpY2xlLnBvc2l0aW9uKSA8IHRoaXMuZ2V0UmFkaXVzKCkgKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5idWJibGUgPSBmdW5jdGlvbiAobW91c2UsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMucG9zaXRpb24uZGlzdGFuY2UobW91c2UucG9zaXRpb24pO1xuICAgICAgICB2YXIgcmF0aW8gPSAxIC0gZGlzdGFuY2UgLyBzZXR0aW5ncy5kaXN0YW5jZTtcbiAgICAgICAgaWYgKHJhdGlvID49IDAgJiYgbW91c2Uub3Zlcikge1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLm9wYWNpdHkgPSByYXRpbyAqIChzZXR0aW5ncy5vcGFjaXR5IC0gdGhpcy5vcGFjaXR5KTtcbiAgICAgICAgICAgIHRoaXMuYnViYmxlZC5yYWRpdXMgPSByYXRpbyAqIChzZXR0aW5ncy5yYWRpdXMgLSB0aGlzLnJhZGl1cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQucmFkaXVzID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFBhcnRpY2xlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBhcnRpY2xlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb25GcmFtZUZ1bmN0aW9uc18xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNcIik7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgQ29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vQ29vcmRpbmF0ZVwiKTtcbnZhciBQYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vUGFydGljbGVcIik7XG52YXIgUGFydGljbGVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZXMoY3NzUXVlcnksIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdzdG9wcGVkJztcbiAgICAgICAgdGhpcy5waXhlbFJhdGlvTGltaXQgPSA4O1xuICAgICAgICB0aGlzLnBpeGVsUmF0aW8gPSAxO1xuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB0aGlzLm1vdXNlID0ge1xuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCgwLCAwKSxcbiAgICAgICAgICAgIG92ZXI6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoY3NzUXVlcnkpO1xuICAgICAgICBpZiAodGhpcy5jYW52YXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2FudmFzIElEIFwiICsgY3NzUXVlcnkgKyBcIiBub3QgZm91bmQuXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KGNvbnRleHQpO1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMS5BbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMS5BbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5jYW5jZWxBbmltYXRpb25GcmFtZSgpO1xuICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBudW1iZXI6IDM1MCxcbiAgICAgICAgICAgIGRlbnNpdHk6IDEwMDAsXG4gICAgICAgICAgICBjb2xvcjogJyNGRkZGRkYnLFxuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIHJhZGl1czogNSxcbiAgICAgICAgICAgIHNoYXBlOiAnY2lyY2xlJyxcbiAgICAgICAgICAgIHN0cm9rZToge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtb3ZlOiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuNCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICdib3R0b20nLFxuICAgICAgICAgICAgICAgIHN0cmFpZ2h0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJhbmRvbTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlZGdlQm91bmNlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdHRyYWN0OiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgIHJlc2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBob3ZlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgY2xpY2s6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0ZToge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJhZGl1czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzID0ge1xuICAgICAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgICAgICBidWJibGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IDc1LFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDcsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlcHVsc2U6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IDEwMCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xpY2s6IHtcbiAgICAgICAgICAgICAgICBhZGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiA0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW1vdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiAyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudHJhY2tNb3VzZSgpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID49IHRoaXMucGl4ZWxSYXRpb0xpbWl0ID8gdGhpcy5waXhlbFJhdGlvTGltaXQgLSAyIDogd2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgICB0aGlzLnNldENhbnZhc1NpemUoKTtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLnJlbW92ZVBhcnRpY2xlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZVBhcnRpY2xlcygpO1xuICAgICAgICB0aGlzLmRpc3RyaWJ1dGVQYXJ0aWNsZXMoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUudHJhY2tNb3VzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5ob3Zlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi54ID0gZXZlbnQub2Zmc2V0WCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnkgPSBldmVudC5vZmZzZXRZICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2Uub3ZlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2UucG9zaXRpb24ueCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnkgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5vdmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5jbGljaykge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCA9IHRydWU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmluaXRpYWxpemVQaXhlbFJhdGlvID0gZnVuY3Rpb24gKG5ld1JhdGlvKSB7XG4gICAgICAgIGlmIChuZXdSYXRpbyA9PT0gdm9pZCAwKSB7IG5ld1JhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87IH1cbiAgICAgICAgdmFyIG11bHRpcGxpZXIgPSBuZXdSYXRpbyAvIHRoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoICogbXVsdGlwbGllcjtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQgKiBtdWx0aXBsaWVyO1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzID0gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cy5tYXAoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIHIgKiBtdWx0aXBsaWVyOyB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5zcGVlZCAqPSBtdWx0aXBsaWVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZSAmJiB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLnJhZGl1cy5zcGVlZCAqPSBtdWx0aXBsaWVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZS5yYWRpdXMgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlLmRpc3RhbmNlICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLnJlcHVsc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIucmVwdWxzZS5kaXN0YW5jZSAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGl4ZWxSYXRpbyA9IG5ld1JhdGlvO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jaGVja1pvb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyAhPT0gdGhpcy5waXhlbFJhdGlvICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIDwgdGhpcy5waXhlbFJhdGlvTGltaXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcERyYXdpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0Q2FudmFzU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMgJiYgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5yZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNoZWNrWm9vbSgpO1xuICAgICAgICAgICAgICAgIF90aGlzLndpZHRoID0gX3RoaXMuY2FudmFzLm9mZnNldFdpZHRoICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfdGhpcy5oZWlnaHQgPSBfdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0ICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfdGhpcy5jYW52YXMud2lkdGggPSBfdGhpcy53aWR0aDtcbiAgICAgICAgICAgICAgICBfdGhpcy5jYW52YXMuaGVpZ2h0ID0gX3RoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmICghX3RoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlbW92ZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jcmVhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZHJhd1BhcnRpY2xlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy5kaXN0cmlidXRlUGFydGljbGVzKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5nZXRGaWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHguZmlsbFN0eWxlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRTdHJva2UgPSBmdW5jdGlvbiAoc3Ryb2tlKSB7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlLmNvbG9yLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHN0cm9rZS53aWR0aDtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kcmF3UGFydGljbGVzKCk7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSlcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc3RvcERyYXdpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhd1BvbHlnb24gPSBmdW5jdGlvbiAoY2VudGVyLCByYWRpdXMsIHNpZGVzKSB7XG4gICAgICAgIHZhciBkaWFnb25hbEFuZ2xlID0gMzYwIC8gc2lkZXM7XG4gICAgICAgIGRpYWdvbmFsQW5nbGUgKj0gTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKGNlbnRlci54LCBjZW50ZXIueSk7XG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZShkaWFnb25hbEFuZ2xlIC8gKHNpZGVzICUgMiA/IDQgOiAyKSk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhyYWRpdXMsIDApO1xuICAgICAgICB2YXIgYW5nbGU7XG4gICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgc2lkZXM7IHMrKykge1xuICAgICAgICAgICAgYW5nbGUgPSBzICogZGlhZ29uYWxBbmdsZTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSksIHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQYXJ0aWNsZSA9IGZ1bmN0aW9uIChwYXJ0aWNsZSkge1xuICAgICAgICB2YXIgb3BhY2l0eSA9IHBhcnRpY2xlLmdldE9wYWNpdHkoKTtcbiAgICAgICAgdmFyIHJhZGl1cyA9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICB0aGlzLnNldEZpbGwocGFydGljbGUuY29sb3IudG9TdHJpbmcob3BhY2l0eSkpO1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgaWYgKHR5cGVvZiAocGFydGljbGUuc2hhcGUpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdGhpcy5kcmF3UG9seWdvbihwYXJ0aWNsZS5wb3NpdGlvbiwgcmFkaXVzLCBwYXJ0aWNsZS5zaGFwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHBhcnRpY2xlLnNoYXBlKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjYXNlICdjaXJjbGUnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN0eC5hcmMocGFydGljbGUucG9zaXRpb24ueCwgcGFydGljbGUucG9zaXRpb24ueSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgaWYgKHBhcnRpY2xlLnN0cm9rZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3Ryb2tlKHBhcnRpY2xlLnN0cm9rZSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmdldE5ld1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy53aWR0aCwgTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNoZWNrUG9zaXRpb24gPSBmdW5jdGlvbiAocGFydGljbGUpIHtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdsZWZ0JykueCA8IDApXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggKz0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgncmlnaHQnKS54ID4gdGhpcy53aWR0aClcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCAtPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgndG9wJykueSA8IDApXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgKz0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgnYm90dG9tJykueSA+IHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55IC09IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kaXN0cmlidXRlUGFydGljbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHkgJiYgdHlwZW9mICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZGVuc2l0eSkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgYXJlYSA9IHRoaXMuY2FudmFzLndpZHRoICogdGhpcy5jYW52YXMuaGVpZ2h0IC8gMTAwMDtcbiAgICAgICAgICAgIGFyZWEgLz0gdGhpcy5waXhlbFJhdGlvICogMjtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZXNQZXJBcmVhID0gYXJlYSAqIHRoaXMucGFydGljbGVTZXR0aW5ncy5udW1iZXIgLyB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZGVuc2l0eTtcbiAgICAgICAgICAgIHZhciBtaXNzaW5nID0gcGFydGljbGVzUGVyQXJlYSAtIHRoaXMucGFydGljbGVzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChtaXNzaW5nID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUGFydGljbGVzKG1pc3NpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQYXJ0aWNsZXMoTWF0aC5hYnMobWlzc2luZykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNyZWF0ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uIChudW1iZXIsIHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChudW1iZXIgPT09IHZvaWQgMCkgeyBudW1iZXIgPSB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubnVtYmVyOyB9XG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdm9pZCAwKSB7IHBvc2l0aW9uID0gbnVsbDsgfVxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTZXR0aW5ncylcbiAgICAgICAgICAgIHRocm93ICdQYXJ0aWNsZSBzZXR0aW5ncyBtdXN0IGJlIGluaXRhbGl6ZWQgYmVmb3JlIGEgcGFydGljbGUgaXMgY3JlYXRlZC4nO1xuICAgICAgICB2YXIgcGFydGljbGU7XG4gICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgbnVtYmVyOyBwKyspIHtcbiAgICAgICAgICAgIHBhcnRpY2xlID0gbmV3IFBhcnRpY2xlXzEuZGVmYXVsdCh0aGlzLnBhcnRpY2xlU2V0dGluZ3MpO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1Bvc2l0aW9uKCkpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKCF0aGlzLmNoZWNrUG9zaXRpb24ocGFydGljbGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnJlbW92ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA9PT0gdm9pZCAwKSB7IG51bWJlciA9IG51bGw7IH1cbiAgICAgICAgaWYgKCFudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5zcGxpY2UoMCwgbnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS51cGRhdGVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnBhcnRpY2xlczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZSA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLm1vdmUodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuc3BlZWQpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgncmlnaHQnKS54IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMud2lkdGggKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKSwgTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPiB0aGlzLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoLTEgKiBwYXJ0aWNsZS5nZXRSYWRpdXMoKSwgTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0ICsgcGFydGljbGUuZ2V0UmFkaXVzKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5lZGdlKCd0b3AnKS55ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdChNYXRoLnJhbmRvbSgpICogdGhpcy53aWR0aCwgLTEgKiBwYXJ0aWNsZS5nZXRSYWRpdXMoKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5lZGdlQm91bmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdsZWZ0JykueCA8IDAgfHwgcGFydGljbGUuZWRnZSgncmlnaHQnKS54ID4gdGhpcy53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHkuZmxpcCh0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3RvcCcpLnkgPCAwIHx8IHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHkuZmxpcChmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUub3BhY2l0eSA+PSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUub3BhY2l0eSA8PSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5vcGFjaXR5ICs9IHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uc3BlZWQgKiAocGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID8gMSA6IC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUucmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5yYWRpdXMgPj0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5yYWRpdXMgPD0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1cyArPSBwYXJ0aWNsZS5yYWRpdXNBbmltYXRpb24uc3BlZWQgKiAocGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPyAxIDogLTEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUucmFkaXVzIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuaG92ZXIgPT09ICdidWJibGUnICYmIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3ZlciAmJiB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLmJ1YmJsZSh0aGlzLm1vdXNlLCB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhd1BhcnRpY2xlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhcnRpY2xlcygpO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5wYXJ0aWNsZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFydGljbGUgPSBfYVtfaV07XG4gICAgICAgICAgICB0aGlzLmRyYXdQYXJ0aWNsZShwYXJ0aWNsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0UGFydGljbGVTZXR0aW5ncyA9IGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNoYW5nZSBzZXR0aW5ncyB3aGlsZSBDYW52YXMgaXMgcnVubmluZy4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0SW50ZXJhY3RpdmVTZXR0aW5ncyA9IGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNoYW5nZSBzZXR0aW5ncyB3aGlsZSBDYW52YXMgaXMgcnVubmluZy4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyAnUGFydGljbGUgc2V0dGluZ3MgbXVzdCBiZSBpbml0YWxpemVkIGJlZm9yZSBDYW52YXMgY2FuIHN0YXJ0Lic7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSAnc3RvcHBlZCcpXG4gICAgICAgICAgICB0aHJvdyAnQ2FudmFzIGlzIGFscmVhZHkgcnVubmluZy4nO1xuICAgICAgICB0aGlzLnN0YXRlID0gJ3J1bm5pbmcnO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnTm8gUGFydGljbGVzIHRvIHBhdXNlLic7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdwYXVzZWQnO1xuICAgICAgICB0aGlzLm1vdmVTZXR0aW5ncyA9IHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlO1xuICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSA9IGZhbHNlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSAnc3RvcHBlZCcpIHtcbiAgICAgICAgICAgIHRocm93ICdObyBQYXJ0aWNsZXMgdG8gcmVzdW1lLic7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdydW5uaW5nJztcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUgPSB0aGlzLm1vdmVTZXR0aW5ncztcbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAnc3RvcHBlZCc7XG4gICAgICAgIHRoaXMuc3RvcERyYXdpbmcoKTtcbiAgICB9O1xuICAgIHJldHVybiBQYXJ0aWNsZXM7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gUGFydGljbGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU3Ryb2tlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdHJva2Uod2lkdGgsIGNvbG9yKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cbiAgICByZXR1cm4gU3Ryb2tlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFN0cm9rZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFZlY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmVjdG9yKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgVmVjdG9yLnByb3RvdHlwZS5mbGlwID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPT09IHZvaWQgMCkgeyB4ID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoeSA9PT0gdm9pZCAwKSB7IHkgPSB0cnVlOyB9XG4gICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICB0aGlzLnggKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkpIHtcbiAgICAgICAgICAgIHRoaXMueSAqPSAtMTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5tYWduaXR1ZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoKHRoaXMueCAqIHRoaXMueCkgKyAodGhpcy55ICogdGhpcy55KSk7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLmFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gTWF0aC50YW4odGhpcy55IC8gdGhpcy54KTtcbiAgICB9O1xuICAgIHJldHVybiBWZWN0b3I7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gVmVjdG9yO1xuIl19
