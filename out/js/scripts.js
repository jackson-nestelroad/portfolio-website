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

},{"./_hide":33,"./_wks":94}],3:[function(require,module,exports){
'use strict';
var at = require('./_string-at')(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

},{"./_string-at":79}],4:[function(require,module,exports){
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

},{"./_is-object":41}],6:[function(require,module,exports){
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

},{"./_to-absolute-index":83,"./_to-length":86,"./_to-object":87}],7:[function(require,module,exports){
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

},{"./_to-absolute-index":83,"./_to-iobject":85,"./_to-length":86}],8:[function(require,module,exports){
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

},{"./_array-species-create":10,"./_ctx":18,"./_iobject":38,"./_to-length":86,"./_to-object":87}],9:[function(require,module,exports){
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

},{"./_is-array":40,"./_is-object":41,"./_wks":94}],10:[function(require,module,exports){
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

},{"./_a-function":1,"./_invoke":37,"./_is-object":41}],12:[function(require,module,exports){
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

},{"./_cof":13,"./_wks":94}],13:[function(require,module,exports){
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

},{"./_an-instance":4,"./_ctx":18,"./_descriptors":20,"./_for-of":29,"./_iter-define":45,"./_iter-step":47,"./_meta":50,"./_object-create":53,"./_object-dp":54,"./_redefine-all":68,"./_set-species":73,"./_validate-collection":91}],15:[function(require,module,exports){
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

},{"./_an-instance":4,"./_export":24,"./_fails":26,"./_for-of":29,"./_global":31,"./_inherit-if-required":36,"./_is-object":41,"./_iter-detect":46,"./_meta":50,"./_redefine":69,"./_redefine-all":68,"./_set-to-string-tag":74}],16:[function(require,module,exports){
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

},{"./_object-dp":54,"./_property-desc":67}],18:[function(require,module,exports){
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

},{"./_fails":26}],21:[function(require,module,exports){
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_global":31,"./_is-object":41}],22:[function(require,module,exports){
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

},{"./_object-gops":59,"./_object-keys":62,"./_object-pie":63}],24:[function(require,module,exports){
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

},{"./_core":16,"./_ctx":18,"./_global":31,"./_hide":33,"./_redefine":69}],25:[function(require,module,exports){
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

},{"./_wks":94}],26:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],27:[function(require,module,exports){
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

},{"./_defined":19,"./_fails":26,"./_hide":33,"./_redefine":69,"./_regexp-exec":71,"./_wks":94,"./es6.regexp.exec":112}],28:[function(require,module,exports){
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

},{"./_an-object":5}],29:[function(require,module,exports){
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

},{"./_an-object":5,"./_ctx":18,"./_is-array-iter":39,"./_iter-call":43,"./_to-length":86,"./core.get-iterator-method":95}],30:[function(require,module,exports){
module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":76}],31:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],32:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],33:[function(require,module,exports){
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_descriptors":20,"./_object-dp":54,"./_property-desc":67}],34:[function(require,module,exports){
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":31}],35:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":20,"./_dom-create":21,"./_fails":26}],36:[function(require,module,exports){
var isObject = require('./_is-object');
var setPrototypeOf = require('./_set-proto').set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};

},{"./_is-object":41,"./_set-proto":72}],37:[function(require,module,exports){
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

},{}],38:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":13}],39:[function(require,module,exports){
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":48,"./_wks":94}],40:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};

},{"./_cof":13}],41:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],42:[function(require,module,exports){
// 7.2.8 IsRegExp(argument)
var isObject = require('./_is-object');
var cof = require('./_cof');
var MATCH = require('./_wks')('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};

},{"./_cof":13,"./_is-object":41,"./_wks":94}],43:[function(require,module,exports){
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

},{"./_an-object":5}],44:[function(require,module,exports){
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

},{"./_hide":33,"./_object-create":53,"./_property-desc":67,"./_set-to-string-tag":74,"./_wks":94}],45:[function(require,module,exports){
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

},{"./_export":24,"./_hide":33,"./_iter-create":44,"./_iterators":48,"./_library":49,"./_object-gpo":60,"./_redefine":69,"./_set-to-string-tag":74,"./_wks":94}],46:[function(require,module,exports){
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

},{"./_wks":94}],47:[function(require,module,exports){
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],48:[function(require,module,exports){
module.exports = {};

},{}],49:[function(require,module,exports){
module.exports = false;

},{}],50:[function(require,module,exports){
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

},{"./_fails":26,"./_has":32,"./_is-object":41,"./_object-dp":54,"./_uid":89}],51:[function(require,module,exports){
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

},{"./_cof":13,"./_global":31,"./_task":82}],52:[function(require,module,exports){
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

},{"./_a-function":1}],53:[function(require,module,exports){
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

},{"./_an-object":5,"./_dom-create":21,"./_enum-bug-keys":22,"./_html":34,"./_object-dps":55,"./_shared-key":75}],54:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":20,"./_ie8-dom-define":35,"./_to-primitive":88}],55:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":20,"./_object-dp":54,"./_object-keys":62}],56:[function(require,module,exports){
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

},{"./_descriptors":20,"./_has":32,"./_ie8-dom-define":35,"./_object-pie":63,"./_property-desc":67,"./_to-iobject":85,"./_to-primitive":88}],57:[function(require,module,exports){
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

},{"./_object-gopn":58,"./_to-iobject":85}],58:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = require('./_object-keys-internal');
var hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};

},{"./_enum-bug-keys":22,"./_object-keys-internal":61}],59:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;

},{}],60:[function(require,module,exports){
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

},{"./_has":32,"./_shared-key":75,"./_to-object":87}],61:[function(require,module,exports){
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

},{"./_array-includes":7,"./_has":32,"./_shared-key":75,"./_to-iobject":85}],62:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_enum-bug-keys":22,"./_object-keys-internal":61}],63:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;

},{}],64:[function(require,module,exports){
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

},{"./_core":16,"./_export":24,"./_fails":26}],65:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],66:[function(require,module,exports){
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

},{"./_an-object":5,"./_is-object":41,"./_new-promise-capability":52}],67:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],68:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":69}],69:[function(require,module,exports){
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

},{"./_core":16,"./_function-to-string":30,"./_global":31,"./_has":32,"./_hide":33,"./_uid":89}],70:[function(require,module,exports){
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

},{"./_classof":12}],71:[function(require,module,exports){
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

},{"./_flags":28}],72:[function(require,module,exports){
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

},{"./_an-object":5,"./_ctx":18,"./_is-object":41,"./_object-gopd":56}],73:[function(require,module,exports){
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

},{"./_descriptors":20,"./_global":31,"./_object-dp":54,"./_wks":94}],74:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":32,"./_object-dp":54,"./_wks":94}],75:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":76,"./_uid":89}],76:[function(require,module,exports){
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

},{"./_core":16,"./_global":31,"./_library":49}],77:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":1,"./_an-object":5,"./_wks":94}],78:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":26}],79:[function(require,module,exports){
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

},{"./_defined":19,"./_to-integer":84}],80:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":19,"./_is-regexp":42}],81:[function(require,module,exports){
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

},{"./_defined":19,"./_export":24,"./_fails":26}],82:[function(require,module,exports){
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

},{"./_cof":13,"./_ctx":18,"./_dom-create":21,"./_global":31,"./_html":34,"./_invoke":37}],83:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":84}],84:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],85:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":19,"./_iobject":38}],86:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":84}],87:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":19}],88:[function(require,module,exports){
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

},{"./_is-object":41}],89:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],90:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":31}],91:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":41}],92:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":16,"./_global":31,"./_library":49,"./_object-dp":54,"./_wks-ext":93}],93:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":94}],94:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":31,"./_shared":76,"./_uid":89}],95:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":12,"./_core":16,"./_iterators":48,"./_wks":94}],96:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":2,"./_array-fill":6,"./_export":24}],97:[function(require,module,exports){
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

},{"./_create-property":17,"./_ctx":18,"./_export":24,"./_is-array-iter":39,"./_iter-call":43,"./_iter-detect":46,"./_to-length":86,"./_to-object":87,"./core.get-iterator-method":95}],98:[function(require,module,exports){
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

},{"./_array-includes":7,"./_export":24,"./_strict-method":78}],99:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":24,"./_is-array":40}],100:[function(require,module,exports){
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

},{"./_add-to-unscopables":2,"./_iter-define":45,"./_iter-step":47,"./_iterators":48,"./_to-iobject":85}],101:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":8,"./_export":24,"./_strict-method":78}],102:[function(require,module,exports){
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

},{"./_redefine":69}],103:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":11,"./_export":24}],104:[function(require,module,exports){
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

},{"./_descriptors":20,"./_object-dp":54}],105:[function(require,module,exports){
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

},{"./_collection":15,"./_collection-strong":14,"./_validate-collection":91}],106:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":24,"./_object-create":53}],107:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":20,"./_export":24,"./_object-dp":54}],108:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":62,"./_object-sap":64,"./_to-object":87}],109:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":24,"./_set-proto":72}],110:[function(require,module,exports){
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

},{"./_classof":12,"./_redefine":69,"./_wks":94}],111:[function(require,module,exports){
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

},{"./_a-function":1,"./_an-instance":4,"./_classof":12,"./_core":16,"./_ctx":18,"./_export":24,"./_for-of":29,"./_global":31,"./_is-object":41,"./_iter-detect":46,"./_library":49,"./_microtask":51,"./_new-promise-capability":52,"./_perform":65,"./_promise-resolve":66,"./_redefine-all":68,"./_set-species":73,"./_set-to-string-tag":74,"./_species-constructor":77,"./_task":82,"./_user-agent":90,"./_wks":94}],112:[function(require,module,exports){
'use strict';
var regexpExec = require('./_regexp-exec');
require('./_export')({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});

},{"./_export":24,"./_regexp-exec":71}],113:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":20,"./_flags":28,"./_object-dp":54}],114:[function(require,module,exports){
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

},{"./_advance-string-index":3,"./_an-object":5,"./_fix-re-wks":27,"./_regexp-exec-abstract":70,"./_to-length":86}],115:[function(require,module,exports){
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

},{"./_advance-string-index":3,"./_an-object":5,"./_fix-re-wks":27,"./_regexp-exec-abstract":70,"./_to-integer":84,"./_to-length":86,"./_to-object":87}],116:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":20,"./_fails":26,"./_flags":28,"./_redefine":69,"./es6.regexp.flags":113}],117:[function(require,module,exports){
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

},{"./_collection":15,"./_collection-strong":14,"./_validate-collection":91}],118:[function(require,module,exports){
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

},{"./_iter-define":45,"./_string-at":79}],119:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":81}],120:[function(require,module,exports){
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

},{"./_export":24,"./_fails-is-regexp":25,"./_string-context":80,"./_to-length":86}],121:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":20,"./_enum-keys":23,"./_export":24,"./_fails":26,"./_global":31,"./_has":32,"./_hide":33,"./_is-array":40,"./_is-object":41,"./_library":49,"./_meta":50,"./_object-create":53,"./_object-dp":54,"./_object-gopd":56,"./_object-gopn":58,"./_object-gopn-ext":57,"./_object-gops":59,"./_object-keys":62,"./_object-pie":63,"./_property-desc":67,"./_redefine":69,"./_set-to-string-tag":74,"./_shared":76,"./_to-iobject":85,"./_to-primitive":88,"./_uid":89,"./_wks":94,"./_wks-define":92,"./_wks-ext":93}],122:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":92}],123:[function(require,module,exports){
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

},{"./_global":31,"./_hide":33,"./_iterators":48,"./_object-keys":62,"./_redefine":69,"./_wks":94,"./es6.array.iterator":100}],124:[function(require,module,exports){
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
});

},{"../Modules/WebPage":146,"../Particles/Particles":154,"./Stars":125,"core-js/modules/es6.object.define-property":107}],125:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107}],126:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.string.link");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var JSX_1 = require("../../Definitions/JSX");

var Experience = function () {
  function Experience(data) {
    this.data = data;
  }

  Experience.prototype.createElement = function () {
    return JSX_1.ElementFactory.createElement("div", {
      className: "card is-primary experience"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "content"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "header"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "icon"
    }, JSX_1.ElementFactory.createElement("a", {
      href: this.data.link
    }, JSX_1.ElementFactory.createElement("img", {
      src: "./out/images/Experience/" + this.data.svg + ".svg"
    }))), JSX_1.ElementFactory.createElement("div", {
      className: "company"
    }, JSX_1.ElementFactory.createElement("a", {
      href: this.data.link,
      className: "name is-size-1 is-normal-weight is-uppercase"
    }, this.data.company), JSX_1.ElementFactory.createElement("p", {
      className: "location is-size-5 is-italic is-light-color is-normal-weight"
    }, this.data.location)), JSX_1.ElementFactory.createElement("div", {
      className: "role"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "name is-size-3 is-bold"
    }, this.data.position), JSX_1.ElementFactory.createElement("p", {
      className: "date is-size-5 is-italic is-light-color is-normal-weight"
    }, "(" + this.data.begin + " \u2014 " + this.data.end + ")"))), JSX_1.ElementFactory.createElement("hr", null), JSX_1.ElementFactory.createElement("div", {
      className: "content info"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "description is-size-4 is-normal-weight is-light-color is-italic is-justified is-quote"
    }, this.data.flavor), JSX_1.ElementFactory.createElement("ul", {
      className: "job is-left-aligned is-size-4"
    }, this.data.roles.map(function (role) {
      return JSX_1.ElementFactory.createElement("li", null, role);
    })))));
  };

  return Experience;
}();

exports.Experience = Experience;

},{"../../Definitions/JSX":135,"core-js/modules/es6.array.map":101,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.string.link":119}],127:[function(require,module,exports){
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

},{"../../Modules/DOM":143,"../../Modules/EventDispatcher":144,"core-js/modules/es6.object.create":106,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.set-prototype-of":109}],128:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var JSX_1 = require("../../Definitions/JSX");

var Quality = function () {
  function Quality(data) {
    this.data = data;
  }

  Quality.prototype.createElement = function () {
    return JSX_1.ElementFactory.createElement("div", {
      className: "grid-col sm12 md4 sm-block"
    }, JSX_1.ElementFactory.createElement("i", {
      className: "icon " + this.data.faClass
    }), JSX_1.ElementFactory.createElement("p", {
      className: "quality is-size-2 is-bold is-uppercase"
    }, this.data.name), JSX_1.ElementFactory.createElement("p", {
      className: "desc is-light-weight is-size-3"
    }, this.data.description));
  };

  return Quality;
}();

exports.Quality = Quality;

},{"../../Definitions/JSX":135,"core-js/modules/es6.function.name":104,"core-js/modules/es6.object.define-property":107}],129:[function(require,module,exports){
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

  Section.prototype.inMenu = function () {
    return !this.element.classList.contains('no-menu');
  };

  return Section;
}();

exports["default"] = Section;

},{"../../Modules/DOM":143,"core-js/modules/es6.object.define-property":107}],130:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var SVG_1 = require("../../Modules/SVG");

var JSX_1 = require("../../Definitions/JSX");

var Skill = function () {
  function Skill(data) {
    this.element = null;
    this.data = data;
  }

  Skill.prototype.createElement = function () {
    var _this = this;

    return new Promise(function (resolve, reject) {
      if (_this.element) {
        resolve(_this.element);
      }

      SVG_1.SVG.loadSVG("./out/images/Skills/" + _this.data.svg).then(function (svg) {
        svg.setAttribute('class', 'icon');
        resolve(JSX_1.ElementFactory.createElement("li", {
          className: 'skill'
        }, JSX_1.ElementFactory.createElement("div", {
          className: 'hexagon-container',
          style: {
            color: _this.data.color
          }
        }, JSX_1.ElementFactory.createElement("span", {
          className: 'tooltip'
        }, _this.data.name), svg, Skill.HexagonSVG.cloneNode(true))));
      })["catch"](function (err) {
        reject(err);
      });
    });
  };

  Skill.initialize = function () {
    return new Promise(function (resolve, reject) {
      if (Skill.HexagonSVG) {
        resolve(true);
      } else {
        SVG_1.SVG.loadSVG('./out/images/Content/Hexagon').then(function (element) {
          element.setAttribute('class', 'hexagon');
          Skill.HexagonSVG = element;
          resolve(true);
        })["catch"](function (err) {
          resolve(false);
        });
      }
    });
  };

  return Skill;
}();

exports.Skill = Skill;
Skill.initialize();

},{"../../Definitions/JSX":135,"../../Modules/SVG":145,"core-js/modules/es6.function.name":104,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.promise":111}],131:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboutMe = "I am an aspiring web developer and software engineer chasing my passion for working with technology and programming at the University of Texas at Dallas. I crave the opportunity to contribute to meaningful projects that employ my current gifts and interests while also shoving me out of my comfort zone to learn new skills. My goal is to maximize every experience as an opportunity for personal, professional, and technical growth.";

},{"core-js/modules/es6.object.define-property":107}],132:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Experience = [{
  svg: 'lifechurch',
  link: 'http://life.church',
  company: 'Life.Church',
  location: 'Edmond, OK, USA',
  position: 'Information Technology Intern',
  begin: 'May 2018',
  end: 'August 2018',
  flavor: 'Life.Church is a multi-site church centered around their mission to "lead people to become fully-devoted followers of Christ." I worked alongside their Central Information Technology team: a group dedicated to utilizing technology to serve and equip the church.',
  roles: ['Spent time learning from hardware, software, and database teams in an Agile environment.', 'Designed and developed a web application for remote volunteer tracking with Node.js and PostgreSQL.', 'Dynamically deployed application to Google Cloud Platform using Cloud Builds, Docker, and Kubernetes.']
}];

},{"core-js/modules/es6.object.define-property":107}],133:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

},{"core-js/modules/es6.object.define-property":107}],134:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Skills = [{
  name: 'C++',
  svg: 'cplusplus',
  color: '#9B023A'
}, {
  name: 'C#',
  svg: 'csharp',
  color: '#9B4F97'
}, {
  name: 'CSS',
  svg: 'css',
  color: '#3C9CD7'
}, {
  name: 'Docker',
  svg: 'docker',
  color: '#22B9EC'
}, {
  name: '.NET Core/Framework',
  svg: 'dotnet',
  color: '#0F76BD'
}, {
  name: 'Express JS',
  svg: 'express',
  color: '#3D3D3D'
}, {
  name: 'Google Cloud Platform',
  svg: 'gcp',
  color: '#4386FA'
}, {
  name: 'Gulp',
  svg: 'gulp',
  color: '#DA4648'
}, {
  name: 'Heroku',
  svg: 'heroku',
  color: '#6762A6'
}, {
  name: 'HTML',
  svg: 'html',
  color: '#EF652A'
}, {
  name: 'JavaScript',
  svg: 'javascript',
  color: '#F0DB4F'
}, {
  name: 'Jest',
  svg: 'jest',
  color: '#C21325'
}, {
  name: 'Kubernetes',
  svg: 'kubernetes',
  color: '#356DE6'
}, {
  name: 'Node.js',
  svg: 'nodejs',
  color: '#8CC84B'
}, {
  name: 'PostgreSQL',
  svg: 'postgresql',
  color: '#326690'
}, {
  name: 'React',
  svg: 'react',
  color: '#00D8FF'
}, {
  name: 'R Language',
  svg: 'rlang',
  color: '#2369BC'
}, {
  name: 'SASS/SCSS',
  svg: 'sass',
  color: '#CD669A'
}, {
  name: 'TypeScript',
  svg: 'typescript',
  color: '#007ACC'
}, {
  name: 'Vue',
  svg: 'vue',
  color: '#4FC08D'
}];

},{"core-js/modules/es6.object.define-property":107}],135:[function(require,module,exports){
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

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
          element.addEventListener(key.substring(2), attributeValue);
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

},{"core-js/modules/es6.array.is-array":99,"core-js/modules/es6.array.iterator":100,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.keys":108,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.regexp.replace":115,"core-js/modules/es6.string.starts-with":120,"core-js/modules/es6.symbol":121,"core-js/modules/es7.symbol.async-iterator":122,"core-js/modules/web.dom.iterable":123}],136:[function(require,module,exports){
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
    WebPage_1.QualitiesContainer.appendChild(object.createElement());
  }
});

},{"../Classes/Elements/Quality":128,"../Data/About":131,"../Data/Qualities":133,"../Modules/DOM":143,"../Modules/WebPage":146,"core-js/modules/es6.object.define-property":107}],137:[function(require,module,exports){
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

},{"../Modules/WebPage":146,"core-js/modules/es6.object.define-property":107}],138:[function(require,module,exports){
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
  var card;

  for (var _i = 0, Data_1 = Experience_2.Experience; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Experience_1.Experience(data);
    WebPage_1.ExperienceSection.appendChild(card.createElement());
  }
});

},{"../Classes/Elements/Experience":126,"../Data/Experience":132,"../Modules/DOM":143,"../Modules/WebPage":146,"core-js/modules/es6.object.define-property":107}],139:[function(require,module,exports){
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

},{"../Modules/DOM":143,"../Modules/WebPage":146,"core-js/modules/es6.object.define-property":107}],140:[function(require,module,exports){
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
});

},{"../Modules/WebPage":146,"core-js/modules/es6.array.iterator":100,"core-js/modules/es6.function.name":104,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/web.dom.iterable":123}],141:[function(require,module,exports){
"use strict";

require("core-js/modules/web.dom.iterable");

require("core-js/modules/es6.array.iterator");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

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

},{"../Modules/WebPage":146,"core-js/modules/es6.array.iterator":100,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/web.dom.iterable":123}],142:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

require("core-js/modules/es7.symbol.async-iterator");

require("core-js/modules/es6.symbol");

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : new P(function (resolve) {
        resolve(result.value);
      }).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __generator = void 0 && (void 0).__generator || function (thisArg, body) {
  var _ = {
    label: 0,
    sent: function sent() {
      if (t[0] & 1) throw t[1];
      return t[1];
    },
    trys: [],
    ops: []
  },
      f,
      y,
      t,
      g;
  return g = {
    next: verb(0),
    "throw": verb(1),
    "return": verb(2)
  }, typeof Symbol === "function" && (g[Symbol.iterator] = function () {
    return this;
  }), g;

  function verb(n) {
    return function (v) {
      return step([n, v]);
    };
  }

  function step(op) {
    if (f) throw new TypeError("Generator is already executing.");

    while (_) {
      try {
        if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
        if (y = 0, t) op = [op[0] & 2, t.value];

        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;

          case 4:
            _.label++;
            return {
              value: op[1],
              done: false
            };

          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;

          case 7:
            op = _.ops.pop();

            _.trys.pop();

            continue;

          default:
            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }

            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _.label = op[1];
              break;
            }

            if (op[0] === 6 && _.label < t[1]) {
              _.label = t[1];
              t = op;
              break;
            }

            if (t && _.label < t[2]) {
              _.label = t[2];

              _.ops.push(op);

              break;
            }

            if (t[2]) _.ops.pop();

            _.trys.pop();

            continue;
        }

        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t = 0;
      }
    }

    if (op[0] & 5) throw op[1];
    return {
      value: op[0] ? op[1] : void 0,
      done: true
    };
  }
};

var _this = void 0;

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Skill_1 = require("../Classes/Elements/Skill");

var Skills_1 = require("../Data/Skills");

DOM_1.DOM.load().then(function (document) {
  createSkills(Skills_1.Skills);
});

var createSkills = function createSkills(skillsData) {
  Skill_1.Skill.initialize().then(function (done) {
    return __awaiter(_this, void 0, void 0, function () {
      var skill, element, _i, skillsData_1, data;

      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!done) {
              throw "Could not initialize Skills object.";
            }

            _i = 0, skillsData_1 = skillsData;
            _a.label = 1;

          case 1:
            if (!(_i < skillsData_1.length)) return [3, 4];
            data = skillsData_1[_i];
            skill = new Skill_1.Skill(data);
            return [4, skill.createElement()];

          case 2:
            element = _a.sent();
            WebPage_1.SkillsGrid.appendChild(element);
            _a.label = 3;

          case 3:
            _i++;
            return [3, 1];

          case 4:
            return [2];
        }
      });
    });
  });
};

},{"../Classes/Elements/Skill":130,"../Data/Skills":134,"../Modules/DOM":143,"../Modules/WebPage":146,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.promise":111,"core-js/modules/es6.symbol":121,"core-js/modules/es7.symbol.async-iterator":122}],143:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

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

},{"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.promise":111,"core-js/modules/es6.regexp.match":114}],144:[function(require,module,exports){
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

},{"core-js/modules/es6.array.iterator":100,"core-js/modules/es6.function.name":104,"core-js/modules/es6.map":105,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.set":117,"core-js/modules/es6.string.iterator":118,"core-js/modules/web.dom.iterable":123}],145:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

},{"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.promise":111}],146:[function(require,module,exports){
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

var DOM_1 = require("./DOM");

var Section_1 = require("../Classes/Elements/Section");

var Menu_1 = require("../Classes/Elements/Menu");

exports.Main = DOM_1.DOM.getFirstElement('main');
exports.MainScroll = DOM_1.DOM.getFirstElement('main .scroll');
exports.ScrollHook = DOM_1.DOM.isIE() ? window : exports.MainScroll;
exports.Logo = {
  Outer: DOM_1.DOM.getFirstElement('header.logo .image img.outer'),
  Inner: DOM_1.DOM.getFirstElement('header.logo .image img.inner')
};
exports.CanvasText = DOM_1.DOM.getFirstElement('div.canvas div.canvas-text-container');
exports.MenuButton = new Menu_1.Menu();
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

exports.FlavorText = DOM_1.DOM.getFirstElement('section#about .flavor');
exports.QualitiesContainer = DOM_1.DOM.getFirstElement('section#about .qualities');
exports.SkillsGrid = DOM_1.DOM.getFirstElement('section#skills .hex-grid');
exports.ExperienceSection = DOM_1.DOM.getFirstElement('section#experience');

},{"../Classes/Elements/Menu":127,"../Classes/Elements/Section":129,"./DOM":143,"core-js/modules/es6.array.from":97,"core-js/modules/es6.array.iterator":100,"core-js/modules/es6.map":105,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.string.iterator":118,"core-js/modules/web.dom.iterable":123}],147:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107}],148:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107}],149:[function(require,module,exports){
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

},{"core-js/modules/es6.date.to-string":102,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.regexp.to-string":116}],150:[function(require,module,exports){
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

},{"core-js/modules/es6.date.to-string":102,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.regexp.to-string":116}],151:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":107}],152:[function(require,module,exports){
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

},{"./Animation":147,"./Color":149,"./Coordinate":150,"./Stroke":155,"./Vector":156,"core-js/modules/es6.array.index-of":98,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.symbol":121,"core-js/modules/es7.symbol.async-iterator":122}],153:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":107}],154:[function(require,module,exports){
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

},{"../Modules/DOM":143,"./AnimationFrameFunctions":148,"./Coordinate":150,"./Particle":152,"core-js/modules/es6.array.fill":96,"core-js/modules/es6.array.map":101,"core-js/modules/es6.date.to-string":102,"core-js/modules/es6.function.bind":103,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.regexp.to-string":116}],155:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107}],156:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107}]},{},[124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,154,153,155,156])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWR2YW5jZS1zdHJpbmctaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZnVuY3Rpb24tdG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtcmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21ldGEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qtc2FwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcGVyZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Byb21pc2UtcmVzb2x2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS1hbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZ2V4cC1leGVjLWFic3RyYWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVnZXhwLWV4ZWMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLWtleS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NwZWNpZXMtY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpY3QtbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdXNlci1hZ2VudC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3ZhbGlkYXRlLWNvbGxlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MtZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pbmRleC1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmlzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5kYXRlLnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmZ1bmN0aW9uLmJpbmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5mdW5jdGlvbi5uYW1lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuZXhlYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5mbGFncy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5tYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5yZXBsYWNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnNldC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5saW5rLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnN0YXJ0cy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwib3V0L3RzL0NhbnZhcy9DYW52YXMuanMiLCJvdXQvdHMvQ2FudmFzL1N0YXJzLmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvRXhwZXJpZW5jZS5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL01lbnUuanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9RdWFsaXR5LmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvU2VjdGlvbi5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NraWxsLmpzIiwib3V0L3RzL0RhdGEvQWJvdXQuanMiLCJvdXQvdHMvRGF0YS9FeHBlcmllbmNlLmpzIiwib3V0L3RzL0RhdGEvUXVhbGl0aWVzLmpzIiwib3V0L3RzL0RhdGEvU2tpbGxzLmpzIiwib3V0L3RzL0RlZmluaXRpb25zL0pTWC5qcyIsIm91dC90cy9FdmVudHMvQWJvdXQuanMiLCJvdXQvdHMvRXZlbnRzL0NhbnZhc1RleHQuanMiLCJvdXQvdHMvRXZlbnRzL0V4cGVyaWVuY2UuanMiLCJvdXQvdHMvRXZlbnRzL0xvZ28uanMiLCJvdXQvdHMvRXZlbnRzL01haW4uanMiLCJvdXQvdHMvRXZlbnRzL01lbnUuanMiLCJvdXQvdHMvRXZlbnRzL1NraWxscy5qcyIsIm91dC90cy9Nb2R1bGVzL0RPTS5qcyIsIm91dC90cy9Nb2R1bGVzL0V2ZW50RGlzcGF0Y2hlci5qcyIsIm91dC90cy9Nb2R1bGVzL1NWRy5qcyIsIm91dC90cy9Nb2R1bGVzL1dlYlBhZ2UuanMiLCJvdXQvdHMvUGFydGljbGVzL0FuaW1hdGlvbi5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMuanMiLCJvdXQvdHMvUGFydGljbGVzL0NvbG9yLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Db29yZGluYXRlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Nb3VzZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvUGFydGljbGUuanMiLCJvdXQvdHMvUGFydGljbGVzL1BhcnRpY2xlU2V0dGluZ3MuanMiLCJvdXQvdHMvUGFydGljbGVzL1BhcnRpY2xlcy5qcyIsIm91dC90cy9QYXJ0aWNsZXMvU3Ryb2tlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9WZWN0b3IuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JGQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFrQixNQUFsQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICh0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cbnZhciBVTlNDT1BBQkxFUyA9IHJlcXVpcmUoJy4vX3drcycpKCd1bnNjb3BhYmxlcycpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5pZiAoQXJyYXlQcm90b1tVTlNDT1BBQkxFU10gPT0gdW5kZWZpbmVkKSByZXF1aXJlKCcuL19oaWRlJykoQXJyYXlQcm90bywgVU5TQ09QQUJMRVMsIHt9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICBBcnJheVByb3RvW1VOU0NPUEFCTEVTXVtrZXldID0gdHJ1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYXQgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuIC8vIGBBZHZhbmNlU3RyaW5nSW5kZXhgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtYWR2YW5jZXN0cmluZ2luZGV4XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChTLCBpbmRleCwgdW5pY29kZSkge1xuICByZXR1cm4gaW5kZXggKyAodW5pY29kZSA/IGF0KFMsIGluZGV4KS5sZW5ndGggOiAxKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgQ29uc3RydWN0b3IsIG5hbWUsIGZvcmJpZGRlbkZpZWxkKSB7XG4gIGlmICghKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpIHx8IChmb3JiaWRkZW5GaWVsZCAhPT0gdW5kZWZpbmVkICYmIGZvcmJpZGRlbkZpZWxkIGluIGl0KSkge1xuICAgIHRocm93IFR5cGVFcnJvcihuYW1lICsgJzogaW5jb3JyZWN0IGludm9jYXRpb24hJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIDIyLjEuMy42IEFycmF5LnByb3RvdHlwZS5maWxsKHZhbHVlLCBzdGFydCA9IDAsIGVuZCA9IHRoaXMubGVuZ3RoKVxuJ3VzZSBzdHJpY3QnO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBmaWxsKHZhbHVlIC8qICwgc3RhcnQgPSAwLCBlbmQgPSBAbGVuZ3RoICovKSB7XG4gIHZhciBPID0gdG9PYmplY3QodGhpcyk7XG4gIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gIHZhciBhTGVuID0gYXJndW1lbnRzLmxlbmd0aDtcbiAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCBsZW5ndGgpO1xuICB2YXIgZW5kID0gYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gIHZhciBlbmRQb3MgPSBlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IHRvQWJzb2x1dGVJbmRleChlbmQsIGxlbmd0aCk7XG4gIHdoaWxlIChlbmRQb3MgPiBpbmRleCkgT1tpbmRleCsrXSA9IHZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChJU19JTkNMVURFUykge1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBlbCwgZnJvbUluZGV4KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoJHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gdG9BYnNvbHV0ZUluZGV4KGZyb21JbmRleCwgbGVuZ3RoKTtcbiAgICB2YXIgdmFsdWU7XG4gICAgLy8gQXJyYXkjaW5jbHVkZXMgdXNlcyBTYW1lVmFsdWVaZXJvIGVxdWFsaXR5IGFsZ29yaXRobVxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICBpZiAoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpIHdoaWxlIChsZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTykge1xuICAgICAgaWYgKE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcbiIsIi8vIDAgLT4gQXJyYXkjZm9yRWFjaFxuLy8gMSAtPiBBcnJheSNtYXBcbi8vIDIgLT4gQXJyYXkjZmlsdGVyXG4vLyAzIC0+IEFycmF5I3NvbWVcbi8vIDQgLT4gQXJyYXkjZXZlcnlcbi8vIDUgLT4gQXJyYXkjZmluZFxuLy8gNiAtPiBBcnJheSNmaW5kSW5kZXhcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBJT2JqZWN0ID0gcmVxdWlyZSgnLi9faW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBhc2MgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVFlQRSwgJGNyZWF0ZSkge1xuICB2YXIgSVNfTUFQID0gVFlQRSA9PSAxO1xuICB2YXIgSVNfRklMVEVSID0gVFlQRSA9PSAyO1xuICB2YXIgSVNfU09NRSA9IFRZUEUgPT0gMztcbiAgdmFyIElTX0VWRVJZID0gVFlQRSA9PSA0O1xuICB2YXIgSVNfRklORF9JTkRFWCA9IFRZUEUgPT0gNjtcbiAgdmFyIE5PX0hPTEVTID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVg7XG4gIHZhciBjcmVhdGUgPSAkY3JlYXRlIHx8IGFzYztcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgY2FsbGJhY2tmbiwgdGhhdCkge1xuICAgIHZhciBPID0gdG9PYmplY3QoJHRoaXMpO1xuICAgIHZhciBzZWxmID0gSU9iamVjdChPKTtcbiAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCB0aGF0LCAzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIHJlc3VsdCA9IElTX01BUCA/IGNyZWF0ZSgkdGhpcywgbGVuZ3RoKSA6IElTX0ZJTFRFUiA/IGNyZWF0ZSgkdGhpcywgMCkgOiB1bmRlZmluZWQ7XG4gICAgdmFyIHZhbCwgcmVzO1xuICAgIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZikge1xuICAgICAgdmFsID0gc2VsZltpbmRleF07XG4gICAgICByZXMgPSBmKHZhbCwgaW5kZXgsIE8pO1xuICAgICAgaWYgKFRZUEUpIHtcbiAgICAgICAgaWYgKElTX01BUCkgcmVzdWx0W2luZGV4XSA9IHJlczsgICAvLyBtYXBcbiAgICAgICAgZWxzZSBpZiAocmVzKSBzd2l0Y2ggKFRZUEUpIHtcbiAgICAgICAgICBjYXNlIDM6IHJldHVybiB0cnVlOyAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsOyAgICAgICAgICAgICAgLy8gZmluZFxuICAgICAgICAgIGNhc2UgNjogcmV0dXJuIGluZGV4OyAgICAgICAgICAgIC8vIGZpbmRJbmRleFxuICAgICAgICAgIGNhc2UgMjogcmVzdWx0LnB1c2godmFsKTsgICAgICAgIC8vIGZpbHRlclxuICAgICAgICB9IGVsc2UgaWYgKElTX0VWRVJZKSByZXR1cm4gZmFsc2U7IC8vIGV2ZXJ5XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XG4gIH07XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzLWFycmF5Jyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsKSB7XG4gIHZhciBDO1xuICBpZiAoaXNBcnJheShvcmlnaW5hbCkpIHtcbiAgICBDID0gb3JpZ2luYWwuY29uc3RydWN0b3I7XG4gICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICBpZiAodHlwZW9mIEMgPT0gJ2Z1bmN0aW9uJyAmJiAoQyA9PT0gQXJyYXkgfHwgaXNBcnJheShDLnByb3RvdHlwZSkpKSBDID0gdW5kZWZpbmVkO1xuICAgIGlmIChpc09iamVjdChDKSkge1xuICAgICAgQyA9IENbU1BFQ0lFU107XG4gICAgICBpZiAoQyA9PT0gbnVsbCkgQyA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH0gcmV0dXJuIEMgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQztcbn07XG4iLCIvLyA5LjQuMi4zIEFycmF5U3BlY2llc0NyZWF0ZShvcmlnaW5hbEFycmF5LCBsZW5ndGgpXG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbCwgbGVuZ3RoKSB7XG4gIHJldHVybiBuZXcgKHNwZWNpZXNDb25zdHJ1Y3RvcihvcmlnaW5hbCkpKGxlbmd0aCk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGludm9rZSA9IHJlcXVpcmUoJy4vX2ludm9rZScpO1xudmFyIGFycmF5U2xpY2UgPSBbXS5zbGljZTtcbnZhciBmYWN0b3JpZXMgPSB7fTtcblxudmFyIGNvbnN0cnVjdCA9IGZ1bmN0aW9uIChGLCBsZW4sIGFyZ3MpIHtcbiAgaWYgKCEobGVuIGluIGZhY3RvcmllcykpIHtcbiAgICBmb3IgKHZhciBuID0gW10sIGkgPSAwOyBpIDwgbGVuOyBpKyspIG5baV0gPSAnYVsnICsgaSArICddJztcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgICBmYWN0b3JpZXNbbGVuXSA9IEZ1bmN0aW9uKCdGLGEnLCAncmV0dXJuIG5ldyBGKCcgKyBuLmpvaW4oJywnKSArICcpJyk7XG4gIH0gcmV0dXJuIGZhY3Rvcmllc1tsZW5dKEYsIGFyZ3MpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGdW5jdGlvbi5iaW5kIHx8IGZ1bmN0aW9uIGJpbmQodGhhdCAvKiAsIC4uLmFyZ3MgKi8pIHtcbiAgdmFyIGZuID0gYUZ1bmN0aW9uKHRoaXMpO1xuICB2YXIgcGFydEFyZ3MgPSBhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgdmFyIGJvdW5kID0gZnVuY3Rpb24gKC8qIGFyZ3MuLi4gKi8pIHtcbiAgICB2YXIgYXJncyA9IHBhcnRBcmdzLmNvbmNhdChhcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XG4gICAgcmV0dXJuIHRoaXMgaW5zdGFuY2VvZiBib3VuZCA/IGNvbnN0cnVjdChmbiwgYXJncy5sZW5ndGgsIGFyZ3MpIDogaW52b2tlKGZuLCBhcmdzLCB0aGF0KTtcbiAgfTtcbiAgaWYgKGlzT2JqZWN0KGZuLnByb3RvdHlwZSkpIGJvdW5kLnByb3RvdHlwZSA9IGZuLnByb3RvdHlwZTtcbiAgcmV0dXJuIGJvdW5kO1xufTtcbiIsIi8vIGdldHRpbmcgdGFnIGZyb20gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG4vLyBFUzMgd3JvbmcgaGVyZVxudmFyIEFSRyA9IGNvZihmdW5jdGlvbiAoKSB7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gaXRba2V5XTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTtcbiIsInZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciAkaXRlckRlZmluZSA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIHNldFNwZWNpZXMgPSByZXF1aXJlKCcuL19zZXQtc3BlY2llcycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBmYXN0S2V5ID0gcmVxdWlyZSgnLi9fbWV0YScpLmZhc3RLZXk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0laRSA9IERFU0NSSVBUT1JTID8gJ19zJyA6ICdzaXplJztcblxudmFyIGdldEVudHJ5ID0gZnVuY3Rpb24gKHRoYXQsIGtleSkge1xuICAvLyBmYXN0IGNhc2VcbiAgdmFyIGluZGV4ID0gZmFzdEtleShrZXkpO1xuICB2YXIgZW50cnk7XG4gIGlmIChpbmRleCAhPT0gJ0YnKSByZXR1cm4gdGhhdC5faVtpbmRleF07XG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICBmb3IgKGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubikge1xuICAgIGlmIChlbnRyeS5rID09IGtleSkgcmV0dXJuIGVudHJ5O1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uICh3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKSB7XG4gICAgdmFyIEMgPSB3cmFwcGVyKGZ1bmN0aW9uICh0aGF0LCBpdGVyYWJsZSkge1xuICAgICAgYW5JbnN0YW5jZSh0aGF0LCBDLCBOQU1FLCAnX2knKTtcbiAgICAgIHRoYXQuX3QgPSBOQU1FOyAgICAgICAgIC8vIGNvbGxlY3Rpb24gdHlwZVxuICAgICAgdGhhdC5faSA9IGNyZWF0ZShudWxsKTsgLy8gaW5kZXhcbiAgICAgIHRoYXQuX2YgPSB1bmRlZmluZWQ7ICAgIC8vIGZpcnN0IGVudHJ5XG4gICAgICB0aGF0Ll9sID0gdW5kZWZpbmVkOyAgICAvLyBsYXN0IGVudHJ5XG4gICAgICB0aGF0W1NJWkVdID0gMDsgICAgICAgICAvLyBzaXplXG4gICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgfSk7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIHtcbiAgICAgIC8vIDIzLjEuMy4xIE1hcC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXG4gICAgICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XG4gICAgICAgIGZvciAodmFyIHRoYXQgPSB2YWxpZGF0ZSh0aGlzLCBOQU1FKSwgZGF0YSA9IHRoYXQuX2ksIGVudHJ5ID0gdGhhdC5fZjsgZW50cnk7IGVudHJ5ID0gZW50cnkubikge1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmIChlbnRyeS5wKSBlbnRyeS5wID0gZW50cnkucC5uID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xuICAgICAgICB9XG4gICAgICAgIHRoYXQuX2YgPSB0aGF0Ll9sID0gdW5kZWZpbmVkO1xuICAgICAgICB0aGF0W1NJWkVdID0gMDtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXG4gICAgICAvLyAyMy4yLjMuNCBTZXQucHJvdG90eXBlLmRlbGV0ZSh2YWx1ZSlcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHZhciB0aGF0ID0gdmFsaWRhdGUodGhpcywgTkFNRSk7XG4gICAgICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkubjtcbiAgICAgICAgICB2YXIgcHJldiA9IGVudHJ5LnA7XG4gICAgICAgICAgZGVsZXRlIHRoYXQuX2lbZW50cnkuaV07XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYgKHByZXYpIHByZXYubiA9IG5leHQ7XG4gICAgICAgICAgaWYgKG5leHQpIG5leHQucCA9IHByZXY7XG4gICAgICAgICAgaWYgKHRoYXQuX2YgPT0gZW50cnkpIHRoYXQuX2YgPSBuZXh0O1xuICAgICAgICAgIGlmICh0aGF0Ll9sID09IGVudHJ5KSB0aGF0Ll9sID0gcHJldjtcbiAgICAgICAgICB0aGF0W1NJWkVdLS07XG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMi4zLjYgU2V0LnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uIGZvckVhY2goY2FsbGJhY2tmbiAvKiAsIHRoYXQgPSB1bmRlZmluZWQgKi8pIHtcbiAgICAgICAgdmFsaWRhdGUodGhpcywgTkFNRSk7XG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCAzKTtcbiAgICAgICAgdmFyIGVudHJ5O1xuICAgICAgICB3aGlsZSAoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzLl9mKSB7XG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZSAoZW50cnkgJiYgZW50cnkucikgZW50cnkgPSBlbnRyeS5wO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjcgTWFwLnByb3RvdHlwZS5oYXMoa2V5KVxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpIHtcbiAgICAgICAgcmV0dXJuICEhZ2V0RW50cnkodmFsaWRhdGUodGhpcywgTkFNRSksIGtleSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKERFU0NSSVBUT1JTKSBkUChDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHZhbGlkYXRlKHRoaXMsIE5BTUUpW1NJWkVdO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiBDO1xuICB9LFxuICBkZWY6IGZ1bmN0aW9uICh0aGF0LCBrZXksIHZhbHVlKSB7XG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICB2YXIgcHJldiwgaW5kZXg7XG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XG4gICAgaWYgKGVudHJ5KSB7XG4gICAgICBlbnRyeS52ID0gdmFsdWU7XG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGF0Ll9sID0gZW50cnkgPSB7XG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XG4gICAgICAgIHY6IHZhbHVlLCAgICAgICAgICAgICAgICAgICAgICAvLyA8LSB2YWx1ZVxuICAgICAgICBwOiBwcmV2ID0gdGhhdC5fbCwgICAgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcbiAgICAgICAgcjogZmFsc2UgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHJlbW92ZWRcbiAgICAgIH07XG4gICAgICBpZiAoIXRoYXQuX2YpIHRoYXQuX2YgPSBlbnRyeTtcbiAgICAgIGlmIChwcmV2KSBwcmV2Lm4gPSBlbnRyeTtcbiAgICAgIHRoYXRbU0laRV0rKztcbiAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgaWYgKGluZGV4ICE9PSAnRicpIHRoYXQuX2lbaW5kZXhdID0gZW50cnk7XG4gICAgfSByZXR1cm4gdGhhdDtcbiAgfSxcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxuICBzZXRTdHJvbmc6IGZ1bmN0aW9uIChDLCBOQU1FLCBJU19NQVApIHtcbiAgICAvLyBhZGQgLmtleXMsIC52YWx1ZXMsIC5lbnRyaWVzLCBbQEBpdGVyYXRvcl1cbiAgICAvLyAyMy4xLjMuNCwgMjMuMS4zLjgsIDIzLjEuMy4xMSwgMjMuMS4zLjEyLCAyMy4yLjMuNSwgMjMuMi4zLjgsIDIzLjIuMy4xMCwgMjMuMi4zLjExXG4gICAgJGl0ZXJEZWZpbmUoQywgTkFNRSwgZnVuY3Rpb24gKGl0ZXJhdGVkLCBraW5kKSB7XG4gICAgICB0aGlzLl90ID0gdmFsaWRhdGUoaXRlcmF0ZWQsIE5BTUUpOyAvLyB0YXJnZXRcbiAgICAgIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAgICAgIC8vIGtpbmRcbiAgICAgIHRoaXMuX2wgPSB1bmRlZmluZWQ7ICAgICAgICAgICAgICAgIC8vIHByZXZpb3VzXG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgdmFyIGtpbmQgPSB0aGF0Ll9rO1xuICAgICAgdmFyIGVudHJ5ID0gdGhhdC5fbDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnIpIGVudHJ5ID0gZW50cnkucDtcbiAgICAgIC8vIGdldCBuZXh0IGVudHJ5XG4gICAgICBpZiAoIXRoYXQuX3QgfHwgISh0aGF0Ll9sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGF0Ll90Ll9mKSkge1xuICAgICAgICAvLyBvciBmaW5pc2ggdGhlIGl0ZXJhdGlvblxuICAgICAgICB0aGF0Ll90ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gc3RlcCgxKTtcbiAgICAgIH1cbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcbiAgICAgIGlmIChraW5kID09ICdrZXlzJykgcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XG4gICAgICBpZiAoa2luZCA9PSAndmFsdWVzJykgcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XG4gICAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnLCAhSVNfTUFQLCB0cnVlKTtcblxuICAgIC8vIGFkZCBbQEBzcGVjaWVzXSwgMjMuMS4yLjIsIDIzLjIuMi4yXG4gICAgc2V0U3BlY2llcyhOQU1FKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJyk7XG52YXIgbWV0YSA9IHJlcXVpcmUoJy4vX21ldGEnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyICRpdGVyRGV0ZWN0ID0gcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgaW5oZXJpdElmUmVxdWlyZWQgPSByZXF1aXJlKCcuL19pbmhlcml0LWlmLXJlcXVpcmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE5BTUUsIHdyYXBwZXIsIG1ldGhvZHMsIGNvbW1vbiwgSVNfTUFQLCBJU19XRUFLKSB7XG4gIHZhciBCYXNlID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgQyA9IEJhc2U7XG4gIHZhciBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCc7XG4gIHZhciBwcm90byA9IEMgJiYgQy5wcm90b3R5cGU7XG4gIHZhciBPID0ge307XG4gIHZhciBmaXhNZXRob2QgPSBmdW5jdGlvbiAoS0VZKSB7XG4gICAgdmFyIGZuID0gcHJvdG9bS0VZXTtcbiAgICByZWRlZmluZShwcm90bywgS0VZLFxuICAgICAgS0VZID09ICdkZWxldGUnID8gZnVuY3Rpb24gKGEpIHtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpID8gZmFsc2UgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdoYXMnID8gZnVuY3Rpb24gaGFzKGEpIHtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpID8gZmFsc2UgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdnZXQnID8gZnVuY3Rpb24gZ2V0KGEpIHtcbiAgICAgICAgcmV0dXJuIElTX1dFQUsgJiYgIWlzT2JqZWN0KGEpID8gdW5kZWZpbmVkIDogZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpO1xuICAgICAgfSA6IEtFWSA9PSAnYWRkJyA/IGZ1bmN0aW9uIGFkZChhKSB7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTsgcmV0dXJuIHRoaXM7IH1cbiAgICAgICAgOiBmdW5jdGlvbiBzZXQoYSwgYikgeyBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSwgYik7IHJldHVybiB0aGlzOyB9XG4gICAgKTtcbiAgfTtcbiAgaWYgKHR5cGVvZiBDICE9ICdmdW5jdGlvbicgfHwgIShJU19XRUFLIHx8IHByb3RvLmZvckVhY2ggJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICBuZXcgQygpLmVudHJpZXMoKS5uZXh0KCk7XG4gIH0pKSkge1xuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXG4gICAgQyA9IGNvbW1vbi5nZXRDb25zdHJ1Y3Rvcih3cmFwcGVyLCBOQU1FLCBJU19NQVAsIEFEREVSKTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwgbWV0aG9kcyk7XG4gICAgbWV0YS5ORUVEID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQygpO1xuICAgIC8vIGVhcmx5IGltcGxlbWVudGF0aW9ucyBub3Qgc3VwcG9ydHMgY2hhaW5pbmdcbiAgICB2YXIgSEFTTlRfQ0hBSU5JTkcgPSBpbnN0YW5jZVtBRERFUl0oSVNfV0VBSyA/IHt9IDogLTAsIDEpICE9IGluc3RhbmNlO1xuICAgIC8vIFY4IH4gIENocm9taXVtIDQwLSB3ZWFrLWNvbGxlY3Rpb25zIHRocm93cyBvbiBwcmltaXRpdmVzLCBidXQgc2hvdWxkIHJldHVybiBmYWxzZVxuICAgIHZhciBUSFJPV1NfT05fUFJJTUlUSVZFUyA9IGZhaWxzKGZ1bmN0aW9uICgpIHsgaW5zdGFuY2UuaGFzKDEpOyB9KTtcbiAgICAvLyBtb3N0IGVhcmx5IGltcGxlbWVudGF0aW9ucyBkb2Vzbid0IHN1cHBvcnRzIGl0ZXJhYmxlcywgbW9zdCBtb2Rlcm4gLSBub3QgY2xvc2UgaXQgY29ycmVjdGx5XG4gICAgdmFyIEFDQ0VQVF9JVEVSQUJMRVMgPSAkaXRlckRldGVjdChmdW5jdGlvbiAoaXRlcikgeyBuZXcgQyhpdGVyKTsgfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgLy8gZm9yIGVhcmx5IGltcGxlbWVudGF0aW9ucyAtMCBhbmQgKzAgbm90IHRoZSBzYW1lXG4gICAgdmFyIEJVR0dZX1pFUk8gPSAhSVNfV0VBSyAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBWOCB+IENocm9taXVtIDQyLSBmYWlscyBvbmx5IHdpdGggNSsgZWxlbWVudHNcbiAgICAgIHZhciAkaW5zdGFuY2UgPSBuZXcgQygpO1xuICAgICAgdmFyIGluZGV4ID0gNTtcbiAgICAgIHdoaWxlIChpbmRleC0tKSAkaW5zdGFuY2VbQURERVJdKGluZGV4LCBpbmRleCk7XG4gICAgICByZXR1cm4gISRpbnN0YW5jZS5oYXMoLTApO1xuICAgIH0pO1xuICAgIGlmICghQUNDRVBUX0lURVJBQkxFUykge1xuICAgICAgQyA9IHdyYXBwZXIoZnVuY3Rpb24gKHRhcmdldCwgaXRlcmFibGUpIHtcbiAgICAgICAgYW5JbnN0YW5jZSh0YXJnZXQsIEMsIE5BTUUpO1xuICAgICAgICB2YXIgdGhhdCA9IGluaGVyaXRJZlJlcXVpcmVkKG5ldyBCYXNlKCksIHRhcmdldCwgQyk7XG4gICAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICB9KTtcbiAgICAgIEMucHJvdG90eXBlID0gcHJvdG87XG4gICAgICBwcm90by5jb25zdHJ1Y3RvciA9IEM7XG4gICAgfVxuICAgIGlmIChUSFJPV1NfT05fUFJJTUlUSVZFUyB8fCBCVUdHWV9aRVJPKSB7XG4gICAgICBmaXhNZXRob2QoJ2RlbGV0ZScpO1xuICAgICAgZml4TWV0aG9kKCdoYXMnKTtcbiAgICAgIElTX01BUCAmJiBmaXhNZXRob2QoJ2dldCcpO1xuICAgIH1cbiAgICBpZiAoQlVHR1lfWkVSTyB8fCBIQVNOVF9DSEFJTklORykgZml4TWV0aG9kKEFEREVSKTtcbiAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIHNob3VsZCBub3QgY29udGFpbnMgLmNsZWFyIG1ldGhvZFxuICAgIGlmIChJU19XRUFLICYmIHByb3RvLmNsZWFyKSBkZWxldGUgcHJvdG8uY2xlYXI7XG4gIH1cblxuICBzZXRUb1N0cmluZ1RhZyhDLCBOQU1FKTtcblxuICBPW05BTUVdID0gQztcbiAgJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAoQyAhPSBCYXNlKSwgTyk7XG5cbiAgaWYgKCFJU19XRUFLKSBjb21tb24uc2V0U3Ryb25nKEMsIE5BTUUsIElTX01BUCk7XG5cbiAgcmV0dXJuIEM7XG59O1xuIiwidmFyIGNvcmUgPSBtb2R1bGUuZXhwb3J0cyA9IHsgdmVyc2lvbjogJzIuNi41JyB9O1xuaWYgKHR5cGVvZiBfX2UgPT0gJ251bWJlcicpIF9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIGluZGV4LCB2YWx1ZSkge1xuICBpZiAoaW5kZXggaW4gb2JqZWN0KSAkZGVmaW5lUHJvcGVydHkuZihvYmplY3QsIGluZGV4LCBjcmVhdGVEZXNjKDAsIHZhbHVlKSk7XG4gIGVsc2Ugb2JqZWN0W2luZGV4XSA9IHZhbHVlO1xufTtcbiIsIi8vIG9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uIChhKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcbiAgICB9O1xuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uIChhLCBiLCBjKSB7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiLCBjKTtcbiAgICB9O1xuICB9XG4gIHJldHVybiBmdW5jdGlvbiAoLyogLi4uYXJncyAqLykge1xuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xuICB9O1xufTtcbiIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjYWxsIG1ldGhvZCBvbiAgXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG4vLyB0eXBlb2YgZG9jdW1lbnQuY3JlYXRlRWxlbWVudCBpcyAnb2JqZWN0JyBpbiBvbGQgSUVcbnZhciBpcyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpcyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7XG4iLCIvLyBhbGwgZW51bWVyYWJsZSBvYmplY3Qga2V5cywgaW5jbHVkZXMgc3ltYm9sc1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIGdPUFMgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpO1xudmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciByZXN1bHQgPSBnZXRLZXlzKGl0KTtcbiAgdmFyIGdldFN5bWJvbHMgPSBnT1BTLmY7XG4gIGlmIChnZXRTeW1ib2xzKSB7XG4gICAgdmFyIHN5bWJvbHMgPSBnZXRTeW1ib2xzKGl0KTtcbiAgICB2YXIgaXNFbnVtID0gcElFLmY7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKHN5bWJvbHMubGVuZ3RoID4gaSkgaWYgKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKSByZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbnZhciAkZXhwb3J0ID0gZnVuY3Rpb24gKHR5cGUsIG5hbWUsIHNvdXJjZSkge1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRjtcbiAgdmFyIElTX0dMT0JBTCA9IHR5cGUgJiAkZXhwb3J0Lkc7XG4gIHZhciBJU19TVEFUSUMgPSB0eXBlICYgJGV4cG9ydC5TO1xuICB2YXIgSVNfUFJPVE8gPSB0eXBlICYgJGV4cG9ydC5QO1xuICB2YXIgSVNfQklORCA9IHR5cGUgJiAkZXhwb3J0LkI7XG4gIHZhciB0YXJnZXQgPSBJU19HTE9CQUwgPyBnbG9iYWwgOiBJU19TVEFUSUMgPyBnbG9iYWxbbmFtZV0gfHwgKGdsb2JhbFtuYW1lXSA9IHt9KSA6IChnbG9iYWxbbmFtZV0gfHwge30pW1BST1RPVFlQRV07XG4gIHZhciBleHBvcnRzID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSk7XG4gIHZhciBleHBQcm90byA9IGV4cG9ydHNbUFJPVE9UWVBFXSB8fCAoZXhwb3J0c1tQUk9UT1RZUEVdID0ge30pO1xuICB2YXIga2V5LCBvd24sIG91dCwgZXhwO1xuICBpZiAoSVNfR0xPQkFMKSBzb3VyY2UgPSBuYW1lO1xuICBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXG4gICAgb3V0ID0gKG93biA/IHRhcmdldCA6IHNvdXJjZSlba2V5XTtcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIGV4cCA9IElTX0JJTkQgJiYgb3duID8gY3R4KG91dCwgZ2xvYmFsKSA6IElTX1BST1RPICYmIHR5cGVvZiBvdXQgPT0gJ2Z1bmN0aW9uJyA/IGN0eChGdW5jdGlvbi5jYWxsLCBvdXQpIDogb3V0O1xuICAgIC8vIGV4dGVuZCBnbG9iYWxcbiAgICBpZiAodGFyZ2V0KSByZWRlZmluZSh0YXJnZXQsIGtleSwgb3V0LCB0eXBlICYgJGV4cG9ydC5VKTtcbiAgICAvLyBleHBvcnRcbiAgICBpZiAoZXhwb3J0c1trZXldICE9IG91dCkgaGlkZShleHBvcnRzLCBrZXksIGV4cCk7XG4gICAgaWYgKElTX1BST1RPICYmIGV4cFByb3RvW2tleV0gIT0gb3V0KSBleHBQcm90b1trZXldID0gb3V0O1xuICB9XG59O1xuZ2xvYmFsLmNvcmUgPSBjb3JlO1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YFxubW9kdWxlLmV4cG9ydHMgPSAkZXhwb3J0O1xuIiwidmFyIE1BVENIID0gcmVxdWlyZSgnLi9fd2tzJykoJ21hdGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIHJlID0gLy4vO1xuICB0cnkge1xuICAgICcvLi8nW0tFWV0ocmUpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJlW01BVENIXSA9IGZhbHNlO1xuICAgICAgcmV0dXJuICEnLy4vJ1tLRVldKHJlKTtcbiAgICB9IGNhdGNoIChmKSB7IC8qIGVtcHR5ICovIH1cbiAgfSByZXR1cm4gdHJ1ZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhZXhlYygpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG5yZXF1aXJlKCcuL2VzNi5yZWdleHAuZXhlYycpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xudmFyIHdrcyA9IHJlcXVpcmUoJy4vX3drcycpO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuL19yZWdleHAtZXhlYycpO1xuXG52YXIgU1BFQ0lFUyA9IHdrcygnc3BlY2llcycpO1xuXG52YXIgUkVQTEFDRV9TVVBQT1JUU19OQU1FRF9HUk9VUFMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyAjcmVwbGFjZSBuZWVkcyBidWlsdC1pbiBzdXBwb3J0IGZvciBuYW1lZCBncm91cHMuXG4gIC8vICNtYXRjaCB3b3JrcyBmaW5lIGJlY2F1c2UgaXQganVzdCByZXR1cm4gdGhlIGV4ZWMgcmVzdWx0cywgZXZlbiBpZiBpdCBoYXNcbiAgLy8gYSBcImdyb3BzXCIgcHJvcGVydHkuXG4gIHZhciByZSA9IC8uLztcbiAgcmUuZXhlYyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgcmVzdWx0Lmdyb3VwcyA9IHsgYTogJzcnIH07XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgcmV0dXJuICcnLnJlcGxhY2UocmUsICckPGE+JykgIT09ICc3Jztcbn0pO1xuXG52YXIgU1BMSVRfV09SS1NfV0lUSF9PVkVSV1JJVFRFTl9FWEVDID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gQ2hyb21lIDUxIGhhcyBhIGJ1Z2d5IFwic3BsaXRcIiBpbXBsZW1lbnRhdGlvbiB3aGVuIFJlZ0V4cCNleGVjICE9PSBuYXRpdmVFeGVjXG4gIHZhciByZSA9IC8oPzopLztcbiAgdmFyIG9yaWdpbmFsRXhlYyA9IHJlLmV4ZWM7XG4gIHJlLmV4ZWMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBvcmlnaW5hbEV4ZWMuYXBwbHkodGhpcywgYXJndW1lbnRzKTsgfTtcbiAgdmFyIHJlc3VsdCA9ICdhYicuc3BsaXQocmUpO1xuICByZXR1cm4gcmVzdWx0Lmxlbmd0aCA9PT0gMiAmJiByZXN1bHRbMF0gPT09ICdhJyAmJiByZXN1bHRbMV0gPT09ICdiJztcbn0pKCk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSwgbGVuZ3RoLCBleGVjKSB7XG4gIHZhciBTWU1CT0wgPSB3a3MoS0VZKTtcblxuICB2YXIgREVMRUdBVEVTX1RPX1NZTUJPTCA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gU3RyaW5nIG1ldGhvZHMgY2FsbCBzeW1ib2wtbmFtZWQgUmVnRXAgbWV0aG9kc1xuICAgIHZhciBPID0ge307XG4gICAgT1tTWU1CT0xdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfTtcbiAgICByZXR1cm4gJydbS0VZXShPKSAhPSA3O1xuICB9KTtcblxuICB2YXIgREVMRUdBVEVTX1RPX0VYRUMgPSBERUxFR0FURVNfVE9fU1lNQk9MID8gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTeW1ib2wtbmFtZWQgUmVnRXhwIG1ldGhvZHMgY2FsbCAuZXhlY1xuICAgIHZhciBleGVjQ2FsbGVkID0gZmFsc2U7XG4gICAgdmFyIHJlID0gL2EvO1xuICAgIHJlLmV4ZWMgPSBmdW5jdGlvbiAoKSB7IGV4ZWNDYWxsZWQgPSB0cnVlOyByZXR1cm4gbnVsbDsgfTtcbiAgICBpZiAoS0VZID09PSAnc3BsaXQnKSB7XG4gICAgICAvLyBSZWdFeHBbQEBzcGxpdF0gZG9lc24ndCBjYWxsIHRoZSByZWdleCdzIGV4ZWMgbWV0aG9kLCBidXQgZmlyc3QgY3JlYXRlc1xuICAgICAgLy8gYSBuZXcgb25lLiBXZSBuZWVkIHRvIHJldHVybiB0aGUgcGF0Y2hlZCByZWdleCB3aGVuIGNyZWF0aW5nIHRoZSBuZXcgb25lLlxuICAgICAgcmUuY29uc3RydWN0b3IgPSB7fTtcbiAgICAgIHJlLmNvbnN0cnVjdG9yW1NQRUNJRVNdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gcmU7IH07XG4gICAgfVxuICAgIHJlW1NZTUJPTF0oJycpO1xuICAgIHJldHVybiAhZXhlY0NhbGxlZDtcbiAgfSkgOiB1bmRlZmluZWQ7XG5cbiAgaWYgKFxuICAgICFERUxFR0FURVNfVE9fU1lNQk9MIHx8XG4gICAgIURFTEVHQVRFU19UT19FWEVDIHx8XG4gICAgKEtFWSA9PT0gJ3JlcGxhY2UnICYmICFSRVBMQUNFX1NVUFBPUlRTX05BTUVEX0dST1VQUykgfHxcbiAgICAoS0VZID09PSAnc3BsaXQnICYmICFTUExJVF9XT1JLU19XSVRIX09WRVJXUklUVEVOX0VYRUMpXG4gICkge1xuICAgIHZhciBuYXRpdmVSZWdFeHBNZXRob2QgPSAvLi9bU1lNQk9MXTtcbiAgICB2YXIgZm5zID0gZXhlYyhcbiAgICAgIGRlZmluZWQsXG4gICAgICBTWU1CT0wsXG4gICAgICAnJ1tLRVldLFxuICAgICAgZnVuY3Rpb24gbWF5YmVDYWxsTmF0aXZlKG5hdGl2ZU1ldGhvZCwgcmVnZXhwLCBzdHIsIGFyZzIsIGZvcmNlU3RyaW5nTWV0aG9kKSB7XG4gICAgICAgIGlmIChyZWdleHAuZXhlYyA9PT0gcmVnZXhwRXhlYykge1xuICAgICAgICAgIGlmIChERUxFR0FURVNfVE9fU1lNQk9MICYmICFmb3JjZVN0cmluZ01ldGhvZCkge1xuICAgICAgICAgICAgLy8gVGhlIG5hdGl2ZSBTdHJpbmcgbWV0aG9kIGFscmVhZHkgZGVsZWdhdGVzIHRvIEBAbWV0aG9kICh0aGlzXG4gICAgICAgICAgICAvLyBwb2x5ZmlsbGVkIGZ1bmN0aW9uKSwgbGVhc2luZyB0byBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgICAgICAgICAvLyBXZSBhdm9pZCBpdCBieSBkaXJlY3RseSBjYWxsaW5nIHRoZSBuYXRpdmUgQEBtZXRob2QgbWV0aG9kLlxuICAgICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IG5hdGl2ZVJlZ0V4cE1ldGhvZC5jYWxsKHJlZ2V4cCwgc3RyLCBhcmcyKSB9O1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogbmF0aXZlTWV0aG9kLmNhbGwoc3RyLCByZWdleHAsIGFyZzIpIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHsgZG9uZTogZmFsc2UgfTtcbiAgICAgIH1cbiAgICApO1xuICAgIHZhciBzdHJmbiA9IGZuc1swXTtcbiAgICB2YXIgcnhmbiA9IGZuc1sxXTtcblxuICAgIHJlZGVmaW5lKFN0cmluZy5wcm90b3R5cGUsIEtFWSwgc3RyZm4pO1xuICAgIGhpZGUoUmVnRXhwLnByb3RvdHlwZSwgU1lNQk9MLCBsZW5ndGggPT0gMlxuICAgICAgLy8gMjEuMi41LjggUmVnRXhwLnByb3RvdHlwZVtAQHJlcGxhY2VdKHN0cmluZywgcmVwbGFjZVZhbHVlKVxuICAgICAgLy8gMjEuMi41LjExIFJlZ0V4cC5wcm90b3R5cGVbQEBzcGxpdF0oc3RyaW5nLCBsaW1pdClcbiAgICAgID8gZnVuY3Rpb24gKHN0cmluZywgYXJnKSB7IHJldHVybiByeGZuLmNhbGwoc3RyaW5nLCB0aGlzLCBhcmcpOyB9XG4gICAgICAvLyAyMS4yLjUuNiBSZWdFeHAucHJvdG90eXBlW0BAbWF0Y2hdKHN0cmluZylcbiAgICAgIC8vIDIxLjIuNS45IFJlZ0V4cC5wcm90b3R5cGVbQEBzZWFyY2hdKHN0cmluZylcbiAgICAgIDogZnVuY3Rpb24gKHN0cmluZykgeyByZXR1cm4gcnhmbi5jYWxsKHN0cmluZywgdGhpcyk7IH1cbiAgICApO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3NcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciB0aGF0ID0gYW5PYmplY3QodGhpcyk7XG4gIHZhciByZXN1bHQgPSAnJztcbiAgaWYgKHRoYXQuZ2xvYmFsKSByZXN1bHQgKz0gJ2cnO1xuICBpZiAodGhhdC5pZ25vcmVDYXNlKSByZXN1bHQgKz0gJ2knO1xuICBpZiAodGhhdC5tdWx0aWxpbmUpIHJlc3VsdCArPSAnbSc7XG4gIGlmICh0aGF0LnVuaWNvZGUpIHJlc3VsdCArPSAndSc7XG4gIGlmICh0aGF0LnN0aWNreSkgcmVzdWx0ICs9ICd5JztcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xudmFyIEJSRUFLID0ge307XG52YXIgUkVUVVJOID0ge307XG52YXIgZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhYmxlLCBlbnRyaWVzLCBmbiwgdGhhdCwgSVRFUkFUT1IpIHtcbiAgdmFyIGl0ZXJGbiA9IElURVJBVE9SID8gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcmFibGU7IH0gOiBnZXRJdGVyRm4oaXRlcmFibGUpO1xuICB2YXIgZiA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKTtcbiAgdmFyIGluZGV4ID0gMDtcbiAgdmFyIGxlbmd0aCwgc3RlcCwgaXRlcmF0b3IsIHJlc3VsdDtcbiAgaWYgKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJykgdGhyb3cgVHlwZUVycm9yKGl0ZXJhYmxlICsgJyBpcyBub3QgaXRlcmFibGUhJyk7XG4gIC8vIGZhc3QgY2FzZSBmb3IgYXJyYXlzIHdpdGggZGVmYXVsdCBpdGVyYXRvclxuICBpZiAoaXNBcnJheUl0ZXIoaXRlckZuKSkgZm9yIChsZW5ndGggPSB0b0xlbmd0aChpdGVyYWJsZS5sZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgIHJlc3VsdCA9IGVudHJpZXMgPyBmKGFuT2JqZWN0KHN0ZXAgPSBpdGVyYWJsZVtpbmRleF0pWzBdLCBzdGVwWzFdKSA6IGYoaXRlcmFibGVbaW5kZXhdKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChpdGVyYWJsZSk7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTspIHtcbiAgICByZXN1bHQgPSBjYWxsKGl0ZXJhdG9yLCBmLCBzdGVwLnZhbHVlLCBlbnRyaWVzKTtcbiAgICBpZiAocmVzdWx0ID09PSBCUkVBSyB8fCByZXN1bHQgPT09IFJFVFVSTikgcmV0dXJuIHJlc3VsdDtcbiAgfVxufTtcbmV4cG9ydHMuQlJFQUsgPSBCUkVBSztcbmV4cG9ydHMuUkVUVVJOID0gUkVUVVJOO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnbmF0aXZlLWZ1bmN0aW9uLXRvLXN0cmluZycsIEZ1bmN0aW9uLnRvU3RyaW5nKTtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy84NiNpc3N1ZWNvbW1lbnQtMTE1NzU5MDI4XG52YXIgZ2xvYmFsID0gbW9kdWxlLmV4cG9ydHMgPSB0eXBlb2Ygd2luZG93ICE9ICd1bmRlZmluZWQnICYmIHdpbmRvdy5NYXRoID09IE1hdGhcbiAgPyB3aW5kb3cgOiB0eXBlb2Ygc2VsZiAhPSAndW5kZWZpbmVkJyAmJiBzZWxmLk1hdGggPT0gTWF0aCA/IHNlbGZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmICh0eXBlb2YgX19nID09ICdudW1iZXInKSBfX2cgPSBnbG9iYWw7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWZcbiIsInZhciBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJ2YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbm1vZHVsZS5leHBvcnRzID0gZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50O1xuIiwibW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkocmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdkaXYnKSwgJ2EnLCB7IGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfSB9KS5hICE9IDc7XG59KTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGhhdCwgdGFyZ2V0LCBDKSB7XG4gIHZhciBTID0gdGFyZ2V0LmNvbnN0cnVjdG9yO1xuICB2YXIgUDtcbiAgaWYgKFMgIT09IEMgJiYgdHlwZW9mIFMgPT0gJ2Z1bmN0aW9uJyAmJiAoUCA9IFMucHJvdG90eXBlKSAhPT0gQy5wcm90b3R5cGUgJiYgaXNPYmplY3QoUCkgJiYgc2V0UHJvdG90eXBlT2YpIHtcbiAgICBzZXRQcm90b3R5cGVPZih0aGF0LCBQKTtcbiAgfSByZXR1cm4gdGhhdDtcbn07XG4iLCIvLyBmYXN0IGFwcGx5LCBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCBhcmdzLCB0aGF0KSB7XG4gIHZhciB1biA9IHRoYXQgPT09IHVuZGVmaW5lZDtcbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIHVuID8gZm4oKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcbiAgICBjYXNlIDE6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0pO1xuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSk7XG4gICAgY2FzZSAzOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcbiAgICBjYXNlIDQ6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0sIGFyZ3NbM10pO1xuICB9IHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmdzKTtcbn07XG4iLCIvLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGluc1xubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QoJ3onKS5wcm9wZXJ0eUlzRW51bWVyYWJsZSgwKSA/IE9iamVjdCA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY29mKGl0KSA9PSAnU3RyaW5nJyA/IGl0LnNwbGl0KCcnKSA6IE9iamVjdChpdCk7XG59O1xuIiwiLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b1tJVEVSQVRPUl0gPT09IGl0KTtcbn07XG4iLCIvLyA3LjIuMiBJc0FycmF5KGFyZ3VtZW50KVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xubW9kdWxlLmV4cG9ydHMgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIGlzQXJyYXkoYXJnKSB7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59O1xuIiwiLy8gNy4yLjggSXNSZWdFeHAoYXJndW1lbnQpXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBNQVRDSCA9IHJlcXVpcmUoJy4vX3drcycpKCdtYXRjaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIGlzUmVnRXhwO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmICgoaXNSZWdFeHAgPSBpdFtNQVRDSF0pICE9PSB1bmRlZmluZWQgPyAhIWlzUmVnRXhwIDogY29mKGl0KSA9PSAnUmVnRXhwJyk7XG59O1xuIiwiLy8gY2FsbCBzb21ldGhpbmcgb24gaXRlcmF0b3Igc3RlcCB3aXRoIHNhZmUgY2xvc2luZyBvbiBlcnJvclxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgLy8gNy40LjYgSXRlcmF0b3JDbG9zZShpdGVyYXRvciwgY29tcGxldGlvbilcbiAgfSBjYXRjaCAoZSkge1xuICAgIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XG4gICAgaWYgKHJldCAhPT0gdW5kZWZpbmVkKSBhbk9iamVjdChyZXQuY2FsbChpdGVyYXRvcikpO1xuICAgIHRocm93IGU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3JlYXRlID0gcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19oaWRlJykoSXRlcmF0b3JQcm90b3R5cGUsIHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpLCBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpIHtcbiAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gY3JlYXRlKEl0ZXJhdG9yUHJvdG90eXBlLCB7IG5leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCkgfSk7XG4gIHNldFRvU3RyaW5nVGFnKENvbnN0cnVjdG9yLCBOQU1FICsgJyBJdGVyYXRvcicpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciAkaXRlckNyZWF0ZSA9IHJlcXVpcmUoJy4vX2l0ZXItY3JlYXRlJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdwbycpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgQlVHR1kgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSk7IC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcbnZhciBGRl9JVEVSQVRPUiA9ICdAQGl0ZXJhdG9yJztcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCkge1xuICAkaXRlckNyZWF0ZShDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG4gIHZhciBnZXRNZXRob2QgPSBmdW5jdGlvbiAoa2luZCkge1xuICAgIGlmICghQlVHR1kgJiYga2luZCBpbiBwcm90bykgcmV0dXJuIHByb3RvW2tpbmRdO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBLRVlTOiByZXR1cm4gZnVuY3Rpb24ga2V5cygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICAgIGNhc2UgVkFMVUVTOiByZXR1cm4gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gIH07XG4gIHZhciBUQUcgPSBOQU1FICsgJyBJdGVyYXRvcic7XG4gIHZhciBERUZfVkFMVUVTID0gREVGQVVMVCA9PSBWQUxVRVM7XG4gIHZhciBWQUxVRVNfQlVHID0gZmFsc2U7XG4gIHZhciBwcm90byA9IEJhc2UucHJvdG90eXBlO1xuICB2YXIgJG5hdGl2ZSA9IHByb3RvW0lURVJBVE9SXSB8fCBwcm90b1tGRl9JVEVSQVRPUl0gfHwgREVGQVVMVCAmJiBwcm90b1tERUZBVUxUXTtcbiAgdmFyICRkZWZhdWx0ID0gJG5hdGl2ZSB8fCBnZXRNZXRob2QoREVGQVVMVCk7XG4gIHZhciAkZW50cmllcyA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWQ7XG4gIHZhciAkYW55TmF0aXZlID0gTkFNRSA9PSAnQXJyYXknID8gcHJvdG8uZW50cmllcyB8fCAkbmF0aXZlIDogJG5hdGl2ZTtcbiAgdmFyIG1ldGhvZHMsIGtleSwgSXRlcmF0b3JQcm90b3R5cGU7XG4gIC8vIEZpeCBuYXRpdmVcbiAgaWYgKCRhbnlOYXRpdmUpIHtcbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKCRhbnlOYXRpdmUuY2FsbChuZXcgQmFzZSgpKSk7XG4gICAgaWYgKEl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlICYmIEl0ZXJhdG9yUHJvdG90eXBlLm5leHQpIHtcbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEl0ZXJhdG9yUHJvdG90eXBlLCBUQUcsIHRydWUpO1xuICAgICAgLy8gZml4IGZvciBzb21lIG9sZCBlbmdpbmVzXG4gICAgICBpZiAoIUxJQlJBUlkgJiYgdHlwZW9mIEl0ZXJhdG9yUHJvdG90eXBlW0lURVJBVE9SXSAhPSAnZnVuY3Rpb24nKSBoaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYgKERFRl9WQUxVRVMgJiYgJG5hdGl2ZSAmJiAkbmF0aXZlLm5hbWUgIT09IFZBTFVFUykge1xuICAgIFZBTFVFU19CVUcgPSB0cnVlO1xuICAgICRkZWZhdWx0ID0gZnVuY3Rpb24gdmFsdWVzKCkgeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZiAoKCFMSUJSQVJZIHx8IEZPUkNFRCkgJiYgKEJVR0dZIHx8IFZBTFVFU19CVUcgfHwgIXByb3RvW0lURVJBVE9SXSkpIHtcbiAgICBoaWRlKHByb3RvLCBJVEVSQVRPUiwgJGRlZmF1bHQpO1xuICB9XG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcbiAgSXRlcmF0b3JzW05BTUVdID0gJGRlZmF1bHQ7XG4gIEl0ZXJhdG9yc1tUQUddID0gcmV0dXJuVGhpcztcbiAgaWYgKERFRkFVTFQpIHtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiBERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoVkFMVUVTKSxcbiAgICAgIGtleXM6IElTX1NFVCA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogJGVudHJpZXNcbiAgICB9O1xuICAgIGlmIChGT1JDRUQpIGZvciAoa2V5IGluIG1ldGhvZHMpIHtcbiAgICAgIGlmICghKGtleSBpbiBwcm90bykpIHJlZGVmaW5lKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XG4gICAgfSBlbHNlICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKEJVR0dZIHx8IFZBTFVFU19CVUcpLCBOQU1FLCBtZXRob2RzKTtcbiAgfVxuICByZXR1cm4gbWV0aG9kcztcbn07XG4iLCJ2YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBTQUZFX0NMT1NJTkcgPSBmYWxzZTtcblxudHJ5IHtcbiAgdmFyIHJpdGVyID0gWzddW0lURVJBVE9SXSgpO1xuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbiAoKSB7IFNBRkVfQ0xPU0lORyA9IHRydWU7IH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby10aHJvdy1saXRlcmFsXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uICgpIHsgdGhyb3cgMjsgfSk7XG59IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYywgc2tpcENsb3NpbmcpIHtcbiAgaWYgKCFza2lwQ2xvc2luZyAmJiAhU0FGRV9DTE9TSU5HKSByZXR1cm4gZmFsc2U7XG4gIHZhciBzYWZlID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgdmFyIGFyciA9IFs3XTtcbiAgICB2YXIgaXRlciA9IGFycltJVEVSQVRPUl0oKTtcbiAgICBpdGVyLm5leHQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB7IGRvbmU6IHNhZmUgPSB0cnVlIH07IH07XG4gICAgYXJyW0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXI7IH07XG4gICAgZXhlYyhhcnIpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgcmV0dXJuIHNhZmU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZG9uZSwgdmFsdWUpIHtcbiAgcmV0dXJuIHsgdmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmUgfTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHt9O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmYWxzZTtcbiIsInZhciBNRVRBID0gcmVxdWlyZSgnLi9fdWlkJykoJ21ldGEnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHNldERlc2MgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGlkID0gMDtcbnZhciBpc0V4dGVuc2libGUgPSBPYmplY3QuaXNFeHRlbnNpYmxlIHx8IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRydWU7XG59O1xudmFyIEZSRUVaRSA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbiAoaXQpIHtcbiAgc2V0RGVzYyhpdCwgTUVUQSwgeyB2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gfSk7XG59O1xudmFyIGZhc3RLZXkgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmICghaXNPYmplY3QoaXQpKSByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnID8gaXQgOiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xuICBpZiAoIWhhcyhpdCwgTUVUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gJ0UnO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQV0uaTtcbn07XG52YXIgZ2V0V2VhayA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIGlmICghaGFzKGl0LCBNRVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIGhhc2ggd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSByZXR1cm4gaXRbTUVUQV0udztcbn07XG4vLyBhZGQgbWV0YWRhdGEgb24gZnJlZXplLWZhbWlseSBtZXRob2RzIGNhbGxpbmdcbnZhciBvbkZyZWV6ZSA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoRlJFRVpFICYmIG1ldGEuTkVFRCAmJiBpc0V4dGVuc2libGUoaXQpICYmICFoYXMoaXQsIE1FVEEpKSBzZXRNZXRhKGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIEtFWTogTUVUQSxcbiAgTkVFRDogZmFsc2UsXG4gIGZhc3RLZXk6IGZhc3RLZXksXG4gIGdldFdlYWs6IGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBtYWNyb3Rhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0O1xudmFyIE9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcbnZhciBpc05vZGUgPSByZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgaGVhZCwgbGFzdCwgbm90aWZ5O1xuXG4gIHZhciBmbHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcGFyZW50LCBmbjtcbiAgICBpZiAoaXNOb2RlICYmIChwYXJlbnQgPSBwcm9jZXNzLmRvbWFpbikpIHBhcmVudC5leGl0KCk7XG4gICAgd2hpbGUgKGhlYWQpIHtcbiAgICAgIGZuID0gaGVhZC5mbjtcbiAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBpZiAoaGVhZCkgbm90aWZ5KCk7XG4gICAgICAgIGVsc2UgbGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhyb3cgZTtcbiAgICAgIH1cbiAgICB9IGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHBhcmVudCkgcGFyZW50LmVudGVyKCk7XG4gIH07XG5cbiAgLy8gTm9kZS5qc1xuICBpZiAoaXNOb2RlKSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhmbHVzaCk7XG4gICAgfTtcbiAgLy8gYnJvd3NlcnMgd2l0aCBNdXRhdGlvbk9ic2VydmVyLCBleGNlcHQgaU9TIFNhZmFyaSAtIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy8zMzlcbiAgfSBlbHNlIGlmIChPYnNlcnZlciAmJiAhKGdsb2JhbC5uYXZpZ2F0b3IgJiYgZ2xvYmFsLm5hdmlnYXRvci5zdGFuZGFsb25lKSkge1xuICAgIHZhciB0b2dnbGUgPSB0cnVlO1xuICAgIHZhciBub2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJycpO1xuICAgIG5ldyBPYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tbmV3XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlID0gIXRvZ2dsZTtcbiAgICB9O1xuICAvLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxuICB9IGVsc2UgaWYgKFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKSB7XG4gICAgLy8gUHJvbWlzZS5yZXNvbHZlIHdpdGhvdXQgYW4gYXJndW1lbnQgdGhyb3dzIGFuIGVycm9yIGluIExHIFdlYk9TIDJcbiAgICB2YXIgcHJvbWlzZSA9IFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpO1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb21pc2UudGhlbihmbHVzaCk7XG4gICAgfTtcbiAgLy8gZm9yIG90aGVyIGVudmlyb25tZW50cyAtIG1hY3JvdGFzayBiYXNlZCBvbjpcbiAgLy8gLSBzZXRJbW1lZGlhdGVcbiAgLy8gLSBNZXNzYWdlQ2hhbm5lbFxuICAvLyAtIHdpbmRvdy5wb3N0TWVzc2FnXG4gIC8vIC0gb25yZWFkeXN0YXRlY2hhbmdlXG4gIC8vIC0gc2V0VGltZW91dFxuICB9IGVsc2Uge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIHN0cmFuZ2UgSUUgKyB3ZWJwYWNrIGRldiBzZXJ2ZXIgYnVnIC0gdXNlIC5jYWxsKGdsb2JhbClcbiAgICAgIG1hY3JvdGFzay5jYWxsKGdsb2JhbCwgZmx1c2gpO1xuICAgIH07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKGZuKSB7XG4gICAgdmFyIHRhc2sgPSB7IGZuOiBmbiwgbmV4dDogdW5kZWZpbmVkIH07XG4gICAgaWYgKGxhc3QpIGxhc3QubmV4dCA9IHRhc2s7XG4gICAgaWYgKCFoZWFkKSB7XG4gICAgICBoZWFkID0gdGFzaztcbiAgICAgIG5vdGlmeSgpO1xuICAgIH0gbGFzdCA9IHRhc2s7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMjUuNC4xLjUgTmV3UHJvbWlzZUNhcGFiaWxpdHkoQylcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5cbmZ1bmN0aW9uIFByb21pc2VDYXBhYmlsaXR5KEMpIHtcbiAgdmFyIHJlc29sdmUsIHJlamVjdDtcbiAgdGhpcy5wcm9taXNlID0gbmV3IEMoZnVuY3Rpb24gKCQkcmVzb2x2ZSwgJCRyZWplY3QpIHtcbiAgICBpZiAocmVzb2x2ZSAhPT0gdW5kZWZpbmVkIHx8IHJlamVjdCAhPT0gdW5kZWZpbmVkKSB0aHJvdyBUeXBlRXJyb3IoJ0JhZCBQcm9taXNlIGNvbnN0cnVjdG9yJyk7XG4gICAgcmVzb2x2ZSA9ICQkcmVzb2x2ZTtcbiAgICByZWplY3QgPSAkJHJlamVjdDtcbiAgfSk7XG4gIHRoaXMucmVzb2x2ZSA9IGFGdW5jdGlvbihyZXNvbHZlKTtcbiAgdGhpcy5yZWplY3QgPSBhRnVuY3Rpb24ocmVqZWN0KTtcbn1cblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIChDKSB7XG4gIHJldHVybiBuZXcgUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG59O1xuIiwiLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBkUHMgPSByZXF1aXJlKCcuL19vYmplY3QtZHBzJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgRW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgUFJPVE9UWVBFID0gJ3Byb3RvdHlwZSc7XG5cbi8vIENyZWF0ZSBvYmplY3Qgd2l0aCBmYWtlIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcbnZhciBjcmVhdGVEaWN0ID0gZnVuY3Rpb24gKCkge1xuICAvLyBUaHJhc2gsIHdhc3RlIGFuZCBzb2RvbXk6IElFIEdDIGJ1Z1xuICB2YXIgaWZyYW1lID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpKCdpZnJhbWUnKTtcbiAgdmFyIGkgPSBlbnVtQnVnS2V5cy5sZW5ndGg7XG4gIHZhciBsdCA9ICc8JztcbiAgdmFyIGd0ID0gJz4nO1xuICB2YXIgaWZyYW1lRG9jdW1lbnQ7XG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICByZXF1aXJlKCcuL19odG1sJykuYXBwZW5kQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lLnNyYyA9ICdqYXZhc2NyaXB0Oic7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tc2NyaXB0LXVybFxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xuICAvLyBodG1sLnJlbW92ZUNoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZURvY3VtZW50ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuZG9jdW1lbnQ7XG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgaWZyYW1lRG9jdW1lbnQud3JpdGUobHQgKyAnc2NyaXB0JyArIGd0ICsgJ2RvY3VtZW50LkY9T2JqZWN0JyArIGx0ICsgJy9zY3JpcHQnICsgZ3QpO1xuICBpZnJhbWVEb2N1bWVudC5jbG9zZSgpO1xuICBjcmVhdGVEaWN0ID0gaWZyYW1lRG9jdW1lbnQuRjtcbiAgd2hpbGUgKGktLSkgZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5KCk7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gcmVzdWx0IDogZFBzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgZFAgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydHkgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGRQKE8sIFAsIEF0dHJpYnV0ZXMpO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKCdnZXQnIGluIEF0dHJpYnV0ZXMgfHwgJ3NldCcgaW4gQXR0cmlidXRlcykgdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYgKCd2YWx1ZScgaW4gQXR0cmlidXRlcykgT1tQXSA9IEF0dHJpYnV0ZXMudmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzIDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyA9IGdldEtleXMoUHJvcGVydGllcyk7XG4gIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgdmFyIGkgPSAwO1xuICB2YXIgUDtcbiAgd2hpbGUgKGxlbmd0aCA+IGkpIGRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTtcbiIsInZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgZ09QRCA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApIHtcbiAgTyA9IHRvSU9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoaGFzKE8sIFApKSByZXR1cm4gY3JlYXRlRGVzYyghcElFLmYuY2FsbChPLCBQKSwgT1tQXSk7XG59O1xuIiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBnT1BOID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mO1xudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgd2luZG93ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xuXG52YXIgZ2V0V2luZG93TmFtZXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZ09QTihpdCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgcmV0dXJuIHdpbmRvd05hbWVzICYmIHRvU3RyaW5nLmNhbGwoaXQpID09ICdbb2JqZWN0IFdpbmRvd10nID8gZ2V0V2luZG93TmFtZXMoaXQpIDogZ09QTih0b0lPYmplY3QoaXQpKTtcbn07XG4iLCIvLyAxOS4xLjIuNyAvIDE1LjIuMy40IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJykuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTykge1xuICByZXR1cm4gJGtleXMoTywgaGlkZGVuS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scztcbiIsIi8vIDE5LjEuMi45IC8gMTUuMi4zLjIgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uIChPKSB7XG4gIE8gPSB0b09iamVjdChPKTtcbiAgaWYgKGhhcyhPLCBJRV9QUk9UTykpIHJldHVybiBPW0lFX1BST1RPXTtcbiAgaWYgKHR5cGVvZiBPLmNvbnN0cnVjdG9yID09ICdmdW5jdGlvbicgJiYgTyBpbnN0YW5jZW9mIE8uY29uc3RydWN0b3IpIHtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59O1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBhcnJheUluZGV4T2YgPSByZXF1aXJlKCcuL19hcnJheS1pbmNsdWRlcycpKGZhbHNlKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSU9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgaWYgKGtleSAhPSBJRV9QUk9UTykgaGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkgaWYgKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSkge1xuICAgIH5hcnJheUluZGV4T2YocmVzdWx0LCBrZXkpIHx8IHJlc3VsdC5wdXNoKGtleSk7XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgZW51bUJ1Z0tleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmtleXMgfHwgZnVuY3Rpb24ga2V5cyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiZXhwb3J0cy5mID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVksIGV4ZWMpIHtcbiAgdmFyIGZuID0gKGNvcmUuT2JqZWN0IHx8IHt9KVtLRVldIHx8IE9iamVjdFtLRVldO1xuICB2YXIgZXhwID0ge307XG4gIGV4cFtLRVldID0gZXhlYyhmbik7XG4gICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24gKCkgeyBmbigxKTsgfSksICdPYmplY3QnLCBleHApO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4geyBlOiBmYWxzZSwgdjogZXhlYygpIH07XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4geyBlOiB0cnVlLCB2OiBlIH07XG4gIH1cbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDLCB4KSB7XG4gIGFuT2JqZWN0KEMpO1xuICBpZiAoaXNPYmplY3QoeCkgJiYgeC5jb25zdHJ1Y3RvciA9PT0gQykgcmV0dXJuIHg7XG4gIHZhciBwcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5LmYoQyk7XG4gIHZhciByZXNvbHZlID0gcHJvbWlzZUNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgcmVzb2x2ZSh4KTtcbiAgcmV0dXJuIHByb21pc2VDYXBhYmlsaXR5LnByb21pc2U7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsInZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHNyYywgc2FmZSkge1xuICBmb3IgKHZhciBrZXkgaW4gc3JjKSByZWRlZmluZSh0YXJnZXQsIGtleSwgc3JjW2tleV0sIHNhZmUpO1xuICByZXR1cm4gdGFyZ2V0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFNSQyA9IHJlcXVpcmUoJy4vX3VpZCcpKCdzcmMnKTtcbnZhciAkdG9TdHJpbmcgPSByZXF1aXJlKCcuL19mdW5jdGlvbi10by1zdHJpbmcnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyIFRQTCA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbCwgc2FmZSkge1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYgKE9ba2V5XSA9PT0gdmFsKSByZXR1cm47XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmICghc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoT1trZXldKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIGJ1aWx0aW5FeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjO1xuXG4gLy8gYFJlZ0V4cEV4ZWNgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwZXhlY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoUiwgUykge1xuICB2YXIgZXhlYyA9IFIuZXhlYztcbiAgaWYgKHR5cGVvZiBleGVjID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIHJlc3VsdCA9IGV4ZWMuY2FsbChSLCBTKTtcbiAgICBpZiAodHlwZW9mIHJlc3VsdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZ0V4cCBleGVjIG1ldGhvZCByZXR1cm5lZCBzb21ldGhpbmcgb3RoZXIgdGhhbiBhbiBPYmplY3Qgb3IgbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmIChjbGFzc29mKFIpICE9PSAnUmVnRXhwJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZ0V4cCNleGVjIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgcmVjZWl2ZXInKTtcbiAgfVxuICByZXR1cm4gYnVpbHRpbkV4ZWMuY2FsbChSLCBTKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZWdleHBGbGFncyA9IHJlcXVpcmUoJy4vX2ZsYWdzJyk7XG5cbnZhciBuYXRpdmVFeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjO1xuLy8gVGhpcyBhbHdheXMgcmVmZXJzIHRvIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24sIGJlY2F1c2UgdGhlXG4vLyBTdHJpbmcjcmVwbGFjZSBwb2x5ZmlsbCB1c2VzIC4vZml4LXJlZ2V4cC13ZWxsLWtub3duLXN5bWJvbC1sb2dpYy5qcyxcbi8vIHdoaWNoIGxvYWRzIHRoaXMgZmlsZSBiZWZvcmUgcGF0Y2hpbmcgdGhlIG1ldGhvZC5cbnZhciBuYXRpdmVSZXBsYWNlID0gU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlO1xuXG52YXIgcGF0Y2hlZEV4ZWMgPSBuYXRpdmVFeGVjO1xuXG52YXIgTEFTVF9JTkRFWCA9ICdsYXN0SW5kZXgnO1xuXG52YXIgVVBEQVRFU19MQVNUX0lOREVYX1dST05HID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlMSA9IC9hLyxcbiAgICAgIHJlMiA9IC9iKi9nO1xuICBuYXRpdmVFeGVjLmNhbGwocmUxLCAnYScpO1xuICBuYXRpdmVFeGVjLmNhbGwocmUyLCAnYScpO1xuICByZXR1cm4gcmUxW0xBU1RfSU5ERVhdICE9PSAwIHx8IHJlMltMQVNUX0lOREVYXSAhPT0gMDtcbn0pKCk7XG5cbi8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwLCBjb3BpZWQgZnJvbSBlczUtc2hpbSdzIFN0cmluZyNzcGxpdCBwYXRjaC5cbnZhciBOUENHX0lOQ0xVREVEID0gLygpPz8vLmV4ZWMoJycpWzFdICE9PSB1bmRlZmluZWQ7XG5cbnZhciBQQVRDSCA9IFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyB8fCBOUENHX0lOQ0xVREVEO1xuXG5pZiAoUEFUQ0gpIHtcbiAgcGF0Y2hlZEV4ZWMgPSBmdW5jdGlvbiBleGVjKHN0cikge1xuICAgIHZhciByZSA9IHRoaXM7XG4gICAgdmFyIGxhc3RJbmRleCwgcmVDb3B5LCBtYXRjaCwgaTtcblxuICAgIGlmIChOUENHX0lOQ0xVREVEKSB7XG4gICAgICByZUNvcHkgPSBuZXcgUmVnRXhwKCdeJyArIHJlLnNvdXJjZSArICckKD8hXFxcXHMpJywgcmVnZXhwRmxhZ3MuY2FsbChyZSkpO1xuICAgIH1cbiAgICBpZiAoVVBEQVRFU19MQVNUX0lOREVYX1dST05HKSBsYXN0SW5kZXggPSByZVtMQVNUX0lOREVYXTtcblxuICAgIG1hdGNoID0gbmF0aXZlRXhlYy5jYWxsKHJlLCBzdHIpO1xuXG4gICAgaWYgKFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyAmJiBtYXRjaCkge1xuICAgICAgcmVbTEFTVF9JTkRFWF0gPSByZS5nbG9iYWwgPyBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCA6IGxhc3RJbmRleDtcbiAgICB9XG4gICAgaWYgKE5QQ0dfSU5DTFVERUQgJiYgbWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID4gMSkge1xuICAgICAgLy8gRml4IGJyb3dzZXJzIHdob3NlIGBleGVjYCBtZXRob2RzIGRvbid0IGNvbnNpc3RlbnRseSByZXR1cm4gYHVuZGVmaW5lZGBcbiAgICAgIC8vIGZvciBOUENHLCBsaWtlIElFOC4gTk9URTogVGhpcyBkb2Vzbicgd29yayBmb3IgLyguPyk/L1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3AtZnVuY1xuICAgICAgbmF0aXZlUmVwbGFjZS5jYWxsKG1hdGNoWzBdLCByZUNvcHksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldID09PSB1bmRlZmluZWQpIG1hdGNoW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2hlZEV4ZWM7XG4iLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24gKE8sIHByb3RvKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBpZiAoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCkgdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24gKHRlc3QsIGJ1Z2d5LCBzZXQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vX2N0eCcpKEZ1bmN0aW9uLmNhbGwsIHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZihPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoIChlKSB7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKSB7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYgKGJ1Z2d5KSBPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSkge1xuICB2YXIgQyA9IGdsb2JhbFtLRVldO1xuICBpZiAoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkgZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE5IERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIEQpIHtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvcjtcbiAgdmFyIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtZXRob2QsIGFyZykge1xuICByZXR1cm4gISFtZXRob2QgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGxcbiAgICBhcmcgPyBtZXRob2QuY2FsbChudWxsLCBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0sIDEpIDogbWV0aG9kLmNhbGwobnVsbCk7XG4gIH0pO1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCIvLyBoZWxwZXIgZm9yIFN0cmluZyN7c3RhcnRzV2l0aCwgZW5kc1dpdGgsIGluY2x1ZGVzfVxudmFyIGlzUmVnRXhwID0gcmVxdWlyZSgnLi9faXMtcmVnZXhwJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGhhdCwgc2VhcmNoU3RyaW5nLCBOQU1FKSB7XG4gIGlmIChpc1JlZ0V4cChzZWFyY2hTdHJpbmcpKSB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZyMnICsgTkFNRSArIFwiIGRvZXNuJ3QgYWNjZXB0IHJlZ2V4IVwiKTtcbiAgcmV0dXJuIFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbn07XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xudmFyIHF1b3QgPSAvXCIvZztcbi8vIEIuMi4zLjIuMSBDcmVhdGVIVE1MKHN0cmluZywgdGFnLCBhdHRyaWJ1dGUsIHZhbHVlKVxudmFyIGNyZWF0ZUhUTUwgPSBmdW5jdGlvbiAoc3RyaW5nLCB0YWcsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgdmFyIFMgPSBTdHJpbmcoZGVmaW5lZChzdHJpbmcpKTtcbiAgdmFyIHAxID0gJzwnICsgdGFnO1xuICBpZiAoYXR0cmlidXRlICE9PSAnJykgcDEgKz0gJyAnICsgYXR0cmlidXRlICsgJz1cIicgKyBTdHJpbmcodmFsdWUpLnJlcGxhY2UocXVvdCwgJyZxdW90OycpICsgJ1wiJztcbiAgcmV0dXJuIHAxICsgJz4nICsgUyArICc8LycgKyB0YWcgKyAnPic7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSwgZXhlYykge1xuICB2YXIgTyA9IHt9O1xuICBPW05BTUVdID0gZXhlYyhjcmVhdGVIVE1MKTtcbiAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRlc3QgPSAnJ1tOQU1FXSgnXCInKTtcbiAgICByZXR1cm4gdGVzdCAhPT0gdGVzdC50b0xvd2VyQ2FzZSgpIHx8IHRlc3Quc3BsaXQoJ1wiJykubGVuZ3RoID4gMztcbiAgfSksICdTdHJpbmcnLCBPKTtcbn07XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaW52b2tlID0gcmVxdWlyZSgnLi9faW52b2tlJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4vX2h0bWwnKTtcbnZhciBjZWwgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIHNldFRhc2sgPSBnbG9iYWwuc2V0SW1tZWRpYXRlO1xudmFyIGNsZWFyVGFzayA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZTtcbnZhciBNZXNzYWdlQ2hhbm5lbCA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbDtcbnZhciBEaXNwYXRjaCA9IGdsb2JhbC5EaXNwYXRjaDtcbnZhciBjb3VudGVyID0gMDtcbnZhciBxdWV1ZSA9IHt9O1xudmFyIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xudmFyIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgaWYgKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYgKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spIHtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbikge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgdmFyIGkgPSAxO1xuICAgIHdoaWxlIChhcmd1bWVudHMubGVuZ3RoID4gaSkgYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpIHtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYgKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gU3BoZXJlIChKUyBnYW1lIGVuZ2luZSkgRGlzcGF0Y2ggQVBJXG4gIH0gZWxzZSBpZiAoRGlzcGF0Y2ggJiYgRGlzcGF0Y2gubm93KSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIERpc3BhdGNoLm5vdyhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmIChNZXNzYWdlQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICBwb3J0ID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmIChPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSkge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBuYXZpZ2F0b3IgPSBnbG9iYWwubmF2aWdhdG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgVFlQRSkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSB8fCBpdC5fdCAhPT0gVFlQRSkgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgd2tzRXh0ID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyICRTeW1ib2wgPSBjb3JlLlN5bWJvbCB8fCAoY29yZS5TeW1ib2wgPSBMSUJSQVJZID8ge30gOiBnbG9iYWwuU3ltYm9sIHx8IHt9KTtcbiAgaWYgKG5hbWUuY2hhckF0KDApICE9ICdfJyAmJiAhKG5hbWUgaW4gJFN5bWJvbCkpIGRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHsgdmFsdWU6IHdrc0V4dC5mKG5hbWUpIH0pO1xufTtcbiIsImV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX3drcycpO1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCIvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnQXJyYXknLCB7IGZpbGw6IHJlcXVpcmUoJy4vX2FycmF5LWZpbGwnKSB9KTtcblxucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoJ2ZpbGwnKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRpbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgJG5hdGl2ZSA9IFtdLmluZGV4T2Y7XG52YXIgTkVHQVRJVkVfWkVSTyA9ICEhJG5hdGl2ZSAmJiAxIC8gWzFdLmluZGV4T2YoMSwgLTApIDwgMDtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoTkVHQVRJVkVfWkVSTyB8fCAhcmVxdWlyZSgnLi9fc3RyaWN0LW1ldGhvZCcpKCRuYXRpdmUpKSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjMuMTEgLyAxNS40LjQuMTQgQXJyYXkucHJvdG90eXBlLmluZGV4T2Yoc2VhcmNoRWxlbWVudCBbLCBmcm9tSW5kZXhdKVxuICBpbmRleE9mOiBmdW5jdGlvbiBpbmRleE9mKHNlYXJjaEVsZW1lbnQgLyogLCBmcm9tSW5kZXggPSAwICovKSB7XG4gICAgcmV0dXJuIE5FR0FUSVZFX1pFUk9cbiAgICAgIC8vIGNvbnZlcnQgLTAgdG8gKzBcbiAgICAgID8gJG5hdGl2ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IDBcbiAgICAgIDogJGluZGV4T2YodGhpcywgc2VhcmNoRWxlbWVudCwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG4iLCIvLyAyMi4xLjIuMiAvIDE1LjQuMy4yIEFycmF5LmlzQXJyYXkoYXJnKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdBcnJheScsIHsgaXNBcnJheTogcmVxdWlyZSgnLi9faXMtYXJyYXknKSB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRtYXAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMSk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX3N0cmljdC1tZXRob2QnKShbXS5tYXAsIHRydWUpLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4xNSAvIDE1LjQuNC4xOSBBcnJheS5wcm90b3R5cGUubWFwKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIG1hcDogZnVuY3Rpb24gbWFwKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgcmV0dXJuICRtYXAodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG4iLCJ2YXIgRGF0ZVByb3RvID0gRGF0ZS5wcm90b3R5cGU7XG52YXIgSU5WQUxJRF9EQVRFID0gJ0ludmFsaWQgRGF0ZSc7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSBEYXRlUHJvdG9bVE9fU1RSSU5HXTtcbnZhciBnZXRUaW1lID0gRGF0ZVByb3RvLmdldFRpbWU7XG5pZiAobmV3IERhdGUoTmFOKSArICcnICE9IElOVkFMSURfREFURSkge1xuICByZXF1aXJlKCcuL19yZWRlZmluZScpKERhdGVQcm90bywgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgdmFsdWUgPSBnZXRUaW1lLmNhbGwodGhpcyk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAkdG9TdHJpbmcuY2FsbCh0aGlzKSA6IElOVkFMSURfREFURTtcbiAgfSk7XG59XG4iLCIvLyAxOS4yLjMuMiAvIDE1LjMuNC41IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKHRoaXNBcmcsIGFyZ3MuLi4pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ0Z1bmN0aW9uJywgeyBiaW5kOiByZXF1aXJlKCcuL19iaW5kJykgfSk7XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIEZQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbnZhciBuYW1lUkUgPSAvXlxccypmdW5jdGlvbiAoW14gKF0qKS87XG52YXIgTkFNRSA9ICduYW1lJztcblxuLy8gMTkuMi40LjIgbmFtZVxuTkFNRSBpbiBGUHJvdG8gfHwgcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiBkUChGUHJvdG8sIE5BTUUsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICgnJyArIHRoaXMpLm1hdGNoKG5hbWVSRSlbMV07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBNQVAgPSAnTWFwJztcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoTUFQLCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgTUFQKSwga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpO1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7IGNyZWF0ZTogcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpIH0pO1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbi8vIDE5LjEuMi40IC8gMTUuMi4zLjYgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpLCAnT2JqZWN0JywgeyBkZWZpbmVQcm9wZXJ0eTogcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZiB9KTtcbiIsIi8vIDE5LjEuMi4xNCBPYmplY3Qua2V5cyhPKVxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2tleXMnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBrZXlzKGl0KSB7XG4gICAgcmV0dXJuICRrZXlzKHRvT2JqZWN0KGl0KSk7XG4gIH07XG59KTtcbiIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7IHNldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXQgfSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIHRlc3QgPSB7fTtcbnRlc3RbcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyldID0gJ3onO1xuaWYgKHRlc3QgKyAnJyAhPSAnW29iamVjdCB6XScpIHtcbiAgcmVxdWlyZSgnLi9fcmVkZWZpbmUnKShPYmplY3QucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ1tvYmplY3QgJyArIGNsYXNzb2YodGhpcykgKyAnXSc7XG4gIH0sIHRydWUpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG52YXIgdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgbWljcm90YXNrID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcbnZhciBwZXJmb3JtID0gcmVxdWlyZSgnLi9fcGVyZm9ybScpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4vX3VzZXItYWdlbnQnKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4vX3Byb21pc2UtcmVzb2x2ZScpO1xudmFyIFBST01JU0UgPSAnUHJvbWlzZSc7XG52YXIgVHlwZUVycm9yID0gZ2xvYmFsLlR5cGVFcnJvcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgdmVyc2lvbnMgPSBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnM7XG52YXIgdjggPSB2ZXJzaW9ucyAmJiB2ZXJzaW9ucy52OCB8fCAnJztcbnZhciAkUHJvbWlzZSA9IGdsb2JhbFtQUk9NSVNFXTtcbnZhciBpc05vZGUgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJztcbnZhciBlbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBJbnRlcm5hbCwgbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBPd25Qcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmY7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgPSAkUHJvbWlzZS5yZXNvbHZlKDEpO1xuICAgIHZhciBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgICAgIGV4ZWMoZW1wdHksIGVtcHR5KTtcbiAgICB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAmJiBwcm9taXNlLnRoZW4oZW1wdHkpIGluc3RhbmNlb2YgRmFrZVByb21pc2VcbiAgICAgIC8vIHY4IDYuNiAoTm9kZSAxMCBhbmQgQ2hyb21lIDY2KSBoYXZlIGEgYnVnIHdpdGggcmVzb2x2aW5nIGN1c3RvbSB0aGVuYWJsZXNcbiAgICAgIC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTgzMDU2NVxuICAgICAgLy8gd2UgY2FuJ3QgZGV0ZWN0IGl0IHN5bmNocm9ub3VzbHksIHNvIGp1c3QgY2hlY2sgdmVyc2lvbnNcbiAgICAgICYmIHY4LmluZGV4T2YoJzYuNicpICE9PSAwXG4gICAgICAmJiB1c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lLzY2JykgPT09IC0xO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24gKHByb21pc2UsIGlzUmVqZWN0KSB7XG4gIGlmIChwcm9taXNlLl9uKSByZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIG9rID0gcHJvbWlzZS5fcyA9PSAxO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsO1xuICAgICAgdmFyIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlO1xuICAgICAgdmFyIHJlamVjdCA9IHJlYWN0aW9uLnJlamVjdDtcbiAgICAgIHZhciBkb21haW4gPSByZWFjdGlvbi5kb21haW47XG4gICAgICB2YXIgcmVzdWx0LCB0aGVuLCBleGl0ZWQ7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgIGlmIChwcm9taXNlLl9oID09IDIpIG9uSGFuZGxlVW5oYW5kbGVkKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZS5faCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChoYW5kbGVyID09PSB0cnVlKSByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkb21haW4pIGRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgcmVzdWx0ID0gaGFuZGxlcih2YWx1ZSk7IC8vIG1heSB0aHJvd1xuICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICBkb21haW4uZXhpdCgpO1xuICAgICAgICAgICAgICBleGl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0ID09PSByZWFjdGlvbi5wcm9taXNlKSB7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSkge1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2UgcmVqZWN0KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGRvbWFpbiAmJiAhZXhpdGVkKSBkb21haW4uZXhpdCgpO1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZSAoY2hhaW4ubGVuZ3RoID4gaSkgcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYgKGlzUmVqZWN0ICYmICFwcm9taXNlLl9oKSBvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIHVuaGFuZGxlZCA9IGlzVW5oYW5kbGVkKHByb21pc2UpO1xuICAgIHZhciByZXN1bHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYgKHVuaGFuZGxlZCkge1xuICAgICAgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpc05vZGUpIHtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKSB7XG4gICAgICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWUgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBCcm93c2VycyBzaG91bGQgbm90IHRyaWdnZXIgYHJlamVjdGlvbkhhbmRsZWRgIGV2ZW50IGlmIGl0IHdhcyBoYW5kbGVkIGhlcmUsIE5vZGVKUyAtIHNob3VsZFxuICAgICAgcHJvbWlzZS5faCA9IGlzTm9kZSB8fCBpc1VuaGFuZGxlZChwcm9taXNlKSA/IDIgOiAxO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgICBpZiAodW5oYW5kbGVkICYmIHJlc3VsdC5lKSB0aHJvdyByZXN1bHQudjtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgcmV0dXJuIHByb21pc2UuX2ggIT09IDEgJiYgKHByb21pc2UuX2EgfHwgcHJvbWlzZS5fYykubGVuZ3RoID09PSAwO1xufTtcbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZiAoaXNOb2RlKSB7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgaWYgKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKSB7XG4gICAgICBoYW5kbGVyKHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiBwcm9taXNlLl92IH0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmICghcHJvbWlzZS5fYSkgcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIHZhciB0aGVuO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZiAodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IHsgX3c6IHByb21pc2UsIF9kOiBmYWxzZSB9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgICRyZWplY3QuY2FsbCh7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmICghVVNFX05BVElWRSkge1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICB0aGlzLl9jID0gW107ICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgIHRoaXMuX2EgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICB0aGlzLl9zID0gMDsgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgdGhpcy5fZCA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBkb25lXG4gICAgdGhpcy5fdiA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSB2YWx1ZVxuICAgIHRoaXMuX2ggPSAwOyAgICAgICAgICAgICAgLy8gPC0gcmVqZWN0aW9uIHN0YXRlLCAwIC0gZGVmYXVsdCwgMSAtIGhhbmRsZWQsIDIgLSB1bmhhbmRsZWRcbiAgICB0aGlzLl9uID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKSgkUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgIHZhciByZWFjdGlvbiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWFjdGlvbi5kb21haW4gPSBpc05vZGUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fYSkgdGhpcy5fYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9zKSBub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgT3duUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgSW50ZXJuYWwoKTtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgPSBjdHgoJHJlamVjdCwgcHJvbWlzZSwgMSk7XG4gIH07XG4gIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmYgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uIChDKSB7XG4gICAgcmV0dXJuIEMgPT09ICRQcm9taXNlIHx8IEMgPT09IFdyYXBwZXJcbiAgICAgID8gbmV3IE93blByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICA6IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgeyBQcm9taXNlOiAkUHJvbWlzZSB9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocikge1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcyk7XG4gICAgdmFyICQkcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKExJQlJBUlkgJiYgdGhpcyA9PT0gV3JhcHBlciA/ICRQcm9taXNlIDogdGhpcywgeCk7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikge1xuICAkUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZW1wdHkpO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZXNvbHZlID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IDE7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIHZhciAkaW5kZXggPSBpbmRleCsrO1xuICAgICAgICB2YXIgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGFscmVhZHlDYWxsZWQpIHJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmIChyZXN1bHQuZSkgcmVqZWN0KHJlc3VsdC52KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcmVnZXhwRXhlYyA9IHJlcXVpcmUoJy4vX3JlZ2V4cC1leGVjJyk7XG5yZXF1aXJlKCcuL19leHBvcnQnKSh7XG4gIHRhcmdldDogJ1JlZ0V4cCcsXG4gIHByb3RvOiB0cnVlLFxuICBmb3JjZWQ6IHJlZ2V4cEV4ZWMgIT09IC8uLy5leGVjXG59LCB7XG4gIGV4ZWM6IHJlZ2V4cEV4ZWNcbn0pO1xuIiwiLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3MoKVxuaWYgKHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgLy4vZy5mbGFncyAhPSAnZycpIHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmYoUmVnRXhwLnByb3RvdHlwZSwgJ2ZsYWdzJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogcmVxdWlyZSgnLi9fZmxhZ3MnKVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgYWR2YW5jZVN0cmluZ0luZGV4ID0gcmVxdWlyZSgnLi9fYWR2YW5jZS1zdHJpbmctaW5kZXgnKTtcbnZhciByZWdFeHBFeGVjID0gcmVxdWlyZSgnLi9fcmVnZXhwLWV4ZWMtYWJzdHJhY3QnKTtcblxuLy8gQEBtYXRjaCBsb2dpY1xucmVxdWlyZSgnLi9fZml4LXJlLXdrcycpKCdtYXRjaCcsIDEsIGZ1bmN0aW9uIChkZWZpbmVkLCBNQVRDSCwgJG1hdGNoLCBtYXliZUNhbGxOYXRpdmUpIHtcbiAgcmV0dXJuIFtcbiAgICAvLyBgU3RyaW5nLnByb3RvdHlwZS5tYXRjaGAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5tYXRjaFxuICAgIGZ1bmN0aW9uIG1hdGNoKHJlZ2V4cCkge1xuICAgICAgdmFyIE8gPSBkZWZpbmVkKHRoaXMpO1xuICAgICAgdmFyIGZuID0gcmVnZXhwID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJlZ2V4cFtNQVRDSF07XG4gICAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZCA/IGZuLmNhbGwocmVnZXhwLCBPKSA6IG5ldyBSZWdFeHAocmVnZXhwKVtNQVRDSF0oU3RyaW5nKE8pKTtcbiAgICB9LFxuICAgIC8vIGBSZWdFeHAucHJvdG90eXBlW0BAbWF0Y2hdYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLUBAbWF0Y2hcbiAgICBmdW5jdGlvbiAocmVnZXhwKSB7XG4gICAgICB2YXIgcmVzID0gbWF5YmVDYWxsTmF0aXZlKCRtYXRjaCwgcmVnZXhwLCB0aGlzKTtcbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcbiAgICAgIHZhciByeCA9IGFuT2JqZWN0KHJlZ2V4cCk7XG4gICAgICB2YXIgUyA9IFN0cmluZyh0aGlzKTtcbiAgICAgIGlmICghcnguZ2xvYmFsKSByZXR1cm4gcmVnRXhwRXhlYyhyeCwgUyk7XG4gICAgICB2YXIgZnVsbFVuaWNvZGUgPSByeC51bmljb2RlO1xuICAgICAgcngubGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciBBID0gW107XG4gICAgICB2YXIgbiA9IDA7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgd2hpbGUgKChyZXN1bHQgPSByZWdFeHBFeGVjKHJ4LCBTKSkgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIG1hdGNoU3RyID0gU3RyaW5nKHJlc3VsdFswXSk7XG4gICAgICAgIEFbbl0gPSBtYXRjaFN0cjtcbiAgICAgICAgaWYgKG1hdGNoU3RyID09PSAnJykgcngubGFzdEluZGV4ID0gYWR2YW5jZVN0cmluZ0luZGV4KFMsIHRvTGVuZ3RoKHJ4Lmxhc3RJbmRleCksIGZ1bGxVbmljb2RlKTtcbiAgICAgICAgbisrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG4gPT09IDAgPyBudWxsIDogQTtcbiAgICB9XG4gIF07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBhZHZhbmNlU3RyaW5nSW5kZXggPSByZXF1aXJlKCcuL19hZHZhbmNlLXN0cmluZy1pbmRleCcpO1xudmFyIHJlZ0V4cEV4ZWMgPSByZXF1aXJlKCcuL19yZWdleHAtZXhlYy1hYnN0cmFjdCcpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbnZhciBTVUJTVElUVVRJT05fU1lNQk9MUyA9IC9cXCQoWyQmYCddfFxcZFxcZD98PFtePl0qPikvZztcbnZhciBTVUJTVElUVVRJT05fU1lNQk9MU19OT19OQU1FRCA9IC9cXCQoWyQmYCddfFxcZFxcZD8pL2c7XG5cbnZhciBtYXliZVRvU3RyaW5nID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gaXQgOiBTdHJpbmcoaXQpO1xufTtcblxuLy8gQEByZXBsYWNlIGxvZ2ljXG5yZXF1aXJlKCcuL19maXgtcmUtd2tzJykoJ3JlcGxhY2UnLCAyLCBmdW5jdGlvbiAoZGVmaW5lZCwgUkVQTEFDRSwgJHJlcGxhY2UsIG1heWJlQ2FsbE5hdGl2ZSkge1xuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VgIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUucmVwbGFjZVxuICAgIGZ1bmN0aW9uIHJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgdmFyIE8gPSBkZWZpbmVkKHRoaXMpO1xuICAgICAgdmFyIGZuID0gc2VhcmNoVmFsdWUgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogc2VhcmNoVmFsdWVbUkVQTEFDRV07XG4gICAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZFxuICAgICAgICA/IGZuLmNhbGwoc2VhcmNoVmFsdWUsIE8sIHJlcGxhY2VWYWx1ZSlcbiAgICAgICAgOiAkcmVwbGFjZS5jYWxsKFN0cmluZyhPKSwgc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQHJlcGxhY2VdYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLUBAcmVwbGFjZVxuICAgIGZ1bmN0aW9uIChyZWdleHAsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgdmFyIHJlcyA9IG1heWJlQ2FsbE5hdGl2ZSgkcmVwbGFjZSwgcmVnZXhwLCB0aGlzLCByZXBsYWNlVmFsdWUpO1xuICAgICAgaWYgKHJlcy5kb25lKSByZXR1cm4gcmVzLnZhbHVlO1xuXG4gICAgICB2YXIgcnggPSBhbk9iamVjdChyZWdleHApO1xuICAgICAgdmFyIFMgPSBTdHJpbmcodGhpcyk7XG4gICAgICB2YXIgZnVuY3Rpb25hbFJlcGxhY2UgPSB0eXBlb2YgcmVwbGFjZVZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgICAgaWYgKCFmdW5jdGlvbmFsUmVwbGFjZSkgcmVwbGFjZVZhbHVlID0gU3RyaW5nKHJlcGxhY2VWYWx1ZSk7XG4gICAgICB2YXIgZ2xvYmFsID0gcnguZ2xvYmFsO1xuICAgICAgaWYgKGdsb2JhbCkge1xuICAgICAgICB2YXIgZnVsbFVuaWNvZGUgPSByeC51bmljb2RlO1xuICAgICAgICByeC5sYXN0SW5kZXggPSAwO1xuICAgICAgfVxuICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWdFeHBFeGVjKHJ4LCBTKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkgYnJlYWs7XG4gICAgICAgIHJlc3VsdHMucHVzaChyZXN1bHQpO1xuICAgICAgICBpZiAoIWdsb2JhbCkgYnJlYWs7XG4gICAgICAgIHZhciBtYXRjaFN0ciA9IFN0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICBpZiAobWF0Y2hTdHIgPT09ICcnKSByeC5sYXN0SW5kZXggPSBhZHZhbmNlU3RyaW5nSW5kZXgoUywgdG9MZW5ndGgocngubGFzdEluZGV4KSwgZnVsbFVuaWNvZGUpO1xuICAgICAgfVxuICAgICAgdmFyIGFjY3VtdWxhdGVkUmVzdWx0ID0gJyc7XG4gICAgICB2YXIgbmV4dFNvdXJjZVBvc2l0aW9uID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHQgPSByZXN1bHRzW2ldO1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IFN0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSBtYXgobWluKHRvSW50ZWdlcihyZXN1bHQuaW5kZXgpLCBTLmxlbmd0aCksIDApO1xuICAgICAgICB2YXIgY2FwdHVyZXMgPSBbXTtcbiAgICAgICAgLy8gTk9URTogVGhpcyBpcyBlcXVpdmFsZW50IHRvXG4gICAgICAgIC8vICAgY2FwdHVyZXMgPSByZXN1bHQuc2xpY2UoMSkubWFwKG1heWJlVG9TdHJpbmcpXG4gICAgICAgIC8vIGJ1dCBmb3Igc29tZSByZWFzb24gYG5hdGl2ZVNsaWNlLmNhbGwocmVzdWx0LCAxLCByZXN1bHQubGVuZ3RoKWAgKGNhbGxlZCBpblxuICAgICAgICAvLyB0aGUgc2xpY2UgcG9seWZpbGwgd2hlbiBzbGljaW5nIG5hdGl2ZSBhcnJheXMpIFwiZG9lc24ndCB3b3JrXCIgaW4gc2FmYXJpIDkgYW5kXG4gICAgICAgIC8vIGNhdXNlcyBhIGNyYXNoIChodHRwczovL3Bhc3RlYmluLmNvbS9OMjFRemVRQSkgd2hlbiB0cnlpbmcgdG8gZGVidWcgaXQuXG4gICAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgcmVzdWx0Lmxlbmd0aDsgaisrKSBjYXB0dXJlcy5wdXNoKG1heWJlVG9TdHJpbmcocmVzdWx0W2pdKSk7XG4gICAgICAgIHZhciBuYW1lZENhcHR1cmVzID0gcmVzdWx0Lmdyb3VwcztcbiAgICAgICAgaWYgKGZ1bmN0aW9uYWxSZXBsYWNlKSB7XG4gICAgICAgICAgdmFyIHJlcGxhY2VyQXJncyA9IFttYXRjaGVkXS5jb25jYXQoY2FwdHVyZXMsIHBvc2l0aW9uLCBTKTtcbiAgICAgICAgICBpZiAobmFtZWRDYXB0dXJlcyAhPT0gdW5kZWZpbmVkKSByZXBsYWNlckFyZ3MucHVzaChuYW1lZENhcHR1cmVzKTtcbiAgICAgICAgICB2YXIgcmVwbGFjZW1lbnQgPSBTdHJpbmcocmVwbGFjZVZhbHVlLmFwcGx5KHVuZGVmaW5lZCwgcmVwbGFjZXJBcmdzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVwbGFjZW1lbnQgPSBnZXRTdWJzdGl0dXRpb24obWF0Y2hlZCwgUywgcG9zaXRpb24sIGNhcHR1cmVzLCBuYW1lZENhcHR1cmVzLCByZXBsYWNlVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NpdGlvbiA+PSBuZXh0U291cmNlUG9zaXRpb24pIHtcbiAgICAgICAgICBhY2N1bXVsYXRlZFJlc3VsdCArPSBTLnNsaWNlKG5leHRTb3VyY2VQb3NpdGlvbiwgcG9zaXRpb24pICsgcmVwbGFjZW1lbnQ7XG4gICAgICAgICAgbmV4dFNvdXJjZVBvc2l0aW9uID0gcG9zaXRpb24gKyBtYXRjaGVkLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGFjY3VtdWxhdGVkUmVzdWx0ICsgUy5zbGljZShuZXh0U291cmNlUG9zaXRpb24pO1xuICAgIH1cbiAgXTtcblxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWdldHN1YnN0aXR1dGlvblxuICBmdW5jdGlvbiBnZXRTdWJzdGl0dXRpb24obWF0Y2hlZCwgc3RyLCBwb3NpdGlvbiwgY2FwdHVyZXMsIG5hbWVkQ2FwdHVyZXMsIHJlcGxhY2VtZW50KSB7XG4gICAgdmFyIHRhaWxQb3MgPSBwb3NpdGlvbiArIG1hdGNoZWQubGVuZ3RoO1xuICAgIHZhciBtID0gY2FwdHVyZXMubGVuZ3RoO1xuICAgIHZhciBzeW1ib2xzID0gU1VCU1RJVFVUSU9OX1NZTUJPTFNfTk9fTkFNRUQ7XG4gICAgaWYgKG5hbWVkQ2FwdHVyZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbmFtZWRDYXB0dXJlcyA9IHRvT2JqZWN0KG5hbWVkQ2FwdHVyZXMpO1xuICAgICAgc3ltYm9scyA9IFNVQlNUSVRVVElPTl9TWU1CT0xTO1xuICAgIH1cbiAgICByZXR1cm4gJHJlcGxhY2UuY2FsbChyZXBsYWNlbWVudCwgc3ltYm9scywgZnVuY3Rpb24gKG1hdGNoLCBjaCkge1xuICAgICAgdmFyIGNhcHR1cmU7XG4gICAgICBzd2l0Y2ggKGNoLmNoYXJBdCgwKSkge1xuICAgICAgICBjYXNlICckJzogcmV0dXJuICckJztcbiAgICAgICAgY2FzZSAnJic6IHJldHVybiBtYXRjaGVkO1xuICAgICAgICBjYXNlICdgJzogcmV0dXJuIHN0ci5zbGljZSgwLCBwb3NpdGlvbik7XG4gICAgICAgIGNhc2UgXCInXCI6IHJldHVybiBzdHIuc2xpY2UodGFpbFBvcyk7XG4gICAgICAgIGNhc2UgJzwnOlxuICAgICAgICAgIGNhcHR1cmUgPSBuYW1lZENhcHR1cmVzW2NoLnNsaWNlKDEsIC0xKV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IC8vIFxcZFxcZD9cbiAgICAgICAgICB2YXIgbiA9ICtjaDtcbiAgICAgICAgICBpZiAobiA9PT0gMCkgcmV0dXJuIG1hdGNoO1xuICAgICAgICAgIGlmIChuID4gbSkge1xuICAgICAgICAgICAgdmFyIGYgPSBmbG9vcihuIC8gMTApO1xuICAgICAgICAgICAgaWYgKGYgPT09IDApIHJldHVybiBtYXRjaDtcbiAgICAgICAgICAgIGlmIChmIDw9IG0pIHJldHVybiBjYXB0dXJlc1tmIC0gMV0gPT09IHVuZGVmaW5lZCA/IGNoLmNoYXJBdCgxKSA6IGNhcHR1cmVzW2YgLSAxXSArIGNoLmNoYXJBdCgxKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FwdHVyZSA9IGNhcHR1cmVzW24gLSAxXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjYXB0dXJlID09PSB1bmRlZmluZWQgPyAnJyA6IGNhcHR1cmU7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xucmVxdWlyZSgnLi9lczYucmVnZXhwLmZsYWdzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciAkZmxhZ3MgPSByZXF1aXJlKCcuL19mbGFncycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyICR0b1N0cmluZyA9IC8uL1tUT19TVFJJTkddO1xuXG52YXIgZGVmaW5lID0gZnVuY3Rpb24gKGZuKSB7XG4gIHJlcXVpcmUoJy4vX3JlZGVmaW5lJykoUmVnRXhwLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmbiwgdHJ1ZSk7XG59O1xuXG4vLyAyMS4yLjUuMTQgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZygpXG5pZiAocmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7IHJldHVybiAkdG9TdHJpbmcuY2FsbCh7IHNvdXJjZTogJ2EnLCBmbGFnczogJ2InIH0pICE9ICcvYS9iJzsgfSkpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHZhciBSID0gYW5PYmplY3QodGhpcyk7XG4gICAgcmV0dXJuICcvJy5jb25jYXQoUi5zb3VyY2UsICcvJyxcbiAgICAgICdmbGFncycgaW4gUiA/IFIuZmxhZ3MgOiAhREVTQ1JJUFRPUlMgJiYgUiBpbnN0YW5jZW9mIFJlZ0V4cCA/ICRmbGFncy5jYWxsKFIpIDogdW5kZWZpbmVkKTtcbiAgfSk7XG4vLyBGRjQ0LSBSZWdFeHAjdG9TdHJpbmcgaGFzIGEgd3JvbmcgbmFtZVxufSBlbHNlIGlmICgkdG9TdHJpbmcubmFtZSAhPSBUT19TVFJJTkcpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBTRVQgPSAnU2V0JztcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoU0VULCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih2YWxpZGF0ZSh0aGlzLCBTRVQpLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIEIuMi4zLjEwIFN0cmluZy5wcm90b3R5cGUubGluayh1cmwpXG5yZXF1aXJlKCcuL19zdHJpbmctaHRtbCcpKCdsaW5rJywgZnVuY3Rpb24gKGNyZWF0ZUhUTUwpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGxpbmsodXJsKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhUTUwodGhpcywgJ2EnLCAnaHJlZicsIHVybCk7XG4gIH07XG59KTtcbiIsIi8vIDIxLjEuMy4xOCBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nIFssIHBvc2l0aW9uIF0pXG4ndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY29udGV4dCA9IHJlcXVpcmUoJy4vX3N0cmluZy1jb250ZXh0Jyk7XG52YXIgU1RBUlRTX1dJVEggPSAnc3RhcnRzV2l0aCc7XG52YXIgJHN0YXJ0c1dpdGggPSAnJ1tTVEFSVFNfV0lUSF07XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMtaXMtcmVnZXhwJykoU1RBUlRTX1dJVEgpLCAnU3RyaW5nJywge1xuICBzdGFydHNXaXRoOiBmdW5jdGlvbiBzdGFydHNXaXRoKHNlYXJjaFN0cmluZyAvKiAsIHBvc2l0aW9uID0gMCAqLykge1xuICAgIHZhciB0aGF0ID0gY29udGV4dCh0aGlzLCBzZWFyY2hTdHJpbmcsIFNUQVJUU19XSVRIKTtcbiAgICB2YXIgaW5kZXggPSB0b0xlbmd0aChNYXRoLm1pbihhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgdGhhdC5sZW5ndGgpKTtcbiAgICB2YXIgc2VhcmNoID0gU3RyaW5nKHNlYXJjaFN0cmluZyk7XG4gICAgcmV0dXJuICRzdGFydHNXaXRoXG4gICAgICA/ICRzdGFydHNXaXRoLmNhbGwodGhhdCwgc2VhcmNoLCBpbmRleClcbiAgICAgIDogdGhhdC5zbGljZShpbmRleCwgaW5kZXggKyBzZWFyY2gubGVuZ3RoKSA9PT0gc2VhcmNoO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBNRVRBID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWTtcbnZhciAkZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciB3a3NFeHQgPSByZXF1aXJlKCcuL193a3MtZXh0Jyk7XG52YXIgd2tzRGVmaW5lID0gcmVxdWlyZSgnLi9fd2tzLWRlZmluZScpO1xudmFyIGVudW1LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1rZXlzJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzLWFycmF5Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgX2NyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBnT1BORXh0ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4tZXh0Jyk7XG52YXIgJEdPUEQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpO1xudmFyICREUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BEID0gJEdPUEQuZjtcbnZhciBkUCA9ICREUC5mO1xudmFyIGdPUE4gPSBnT1BORXh0LmY7XG52YXIgJFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgJEpTT04gPSBnbG9iYWwuSlNPTjtcbnZhciBfc3RyaW5naWZ5ID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIEhJRERFTiA9IHdrcygnX2hpZGRlbicpO1xudmFyIFRPX1BSSU1JVElWRSA9IHdrcygndG9QcmltaXRpdmUnKTtcbnZhciBpc0VudW0gPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5Jyk7XG52YXIgQWxsU3ltYm9scyA9IHNoYXJlZCgnc3ltYm9scycpO1xudmFyIE9QU3ltYm9scyA9IHNoYXJlZCgnb3Atc3ltYm9scycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0W1BST1RPVFlQRV07XG52YXIgVVNFX05BVElWRSA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbic7XG52YXIgUU9iamVjdCA9IGdsb2JhbC5RT2JqZWN0O1xuLy8gRG9uJ3QgdXNlIHNldHRlcnMgaW4gUXQgU2NyaXB0LCBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMTczXG52YXIgc2V0dGVyID0gIVFPYmplY3QgfHwgIVFPYmplY3RbUFJPVE9UWVBFXSB8fCAhUU9iamVjdFtQUk9UT1RZUEVdLmZpbmRDaGlsZDtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0NSSVBUT1JTICYmICRmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBfY3JlYXRlKGRQKHt9LCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRQKHRoaXMsICdhJywgeyB2YWx1ZTogNyB9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uIChpdCwga2V5LCBEKSB7XG4gIHZhciBwcm90b0Rlc2MgPSBnT1BEKE9iamVjdFByb3RvLCBrZXkpO1xuICBpZiAocHJvdG9EZXNjKSBkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgZFAoaXQsIGtleSwgRCk7XG4gIGlmIChwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKSBkUChPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xufSA6IGRQO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9IF9jcmVhdGUoJFN5bWJvbFtQUk9UT1RZUEVdKTtcbiAgc3ltLl9rID0gdGFnO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gVVNFX05BVElWRSAmJiB0eXBlb2YgJFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgaW5zdGFuY2VvZiAkU3ltYm9sO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpIHtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90bykgJGRlZmluZVByb3BlcnR5KE9QU3ltYm9scywga2V5LCBEKTtcbiAgYW5PYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBhbk9iamVjdChEKTtcbiAgaWYgKGhhcyhBbGxTeW1ib2xzLCBrZXkpKSB7XG4gICAgaWYgKCFELmVudW1lcmFibGUpIHtcbiAgICAgIGlmICghaGFzKGl0LCBISURERU4pKSBkUChpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkgaXRbSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBEID0gX2NyZWF0ZShELCB7IGVudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpIH0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIGRQKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApIHtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpO1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0ga2V5cy5sZW5ndGg7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChsID4gaSkgJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCkge1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSkge1xuICB2YXIgRSA9IGlzRW51bS5jYWxsKHRoaXMsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpO1xuICBpZiAodGhpcyA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XSA/IEUgOiB0cnVlO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpIHtcbiAgaXQgPSB0b0lPYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBpZiAoaXQgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKSByZXR1cm47XG4gIHZhciBEID0gZ09QRChpdCwga2V5KTtcbiAgaWYgKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSkgRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCkge1xuICB2YXIgbmFtZXMgPSBnT1BOKHRvSU9iamVjdChpdCkpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBpID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIHtcbiAgICBpZiAoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOICYmIGtleSAhPSBNRVRBKSByZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpIHtcbiAgdmFyIElTX09QID0gaXQgPT09IE9iamVjdFByb3RvO1xuICB2YXIgbmFtZXMgPSBnT1BOKElTX09QID8gT1BTeW1ib2xzIDogdG9JT2JqZWN0KGl0KSk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGkgPSAwO1xuICB2YXIga2V5O1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkge1xuICAgIGlmIChoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYgKElTX09QID8gaGFzKE9iamVjdFByb3RvLCBrZXkpIDogdHJ1ZSkpIHJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYgKCFVU0VfTkFUSVZFKSB7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKSB0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvciEnKTtcbiAgICB2YXIgdGFnID0gdWlkKGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTtcbiAgICB2YXIgJHNldCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvKSAkc2V0LmNhbGwoT1BTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZiAoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSkgdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG4gICAgfTtcbiAgICBpZiAoREVTQ1JJUFRPUlMgJiYgc2V0dGVyKSBzZXRTeW1ib2xEZXNjKE9iamVjdFByb3RvLCB0YWcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCBzZXQ6ICRzZXQgfSk7XG4gICAgcmV0dXJuIHdyYXAodGFnKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEVdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgJEdPUEQuZiA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICREUC5mID0gJGRlZmluZVByb3BlcnR5O1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmYgPSBnT1BORXh0LmYgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpLmYgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJykuZiA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYgKERFU0NSSVBUT1JTICYmICFyZXF1aXJlKCcuL19saWJyYXJ5JykpIHtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxuXG4gIHdrc0V4dC5mID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gd3JhcCh3a3MobmFtZSkpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7IFN5bWJvbDogJFN5bWJvbCB9KTtcblxuZm9yICh2YXIgZXM2U3ltYm9scyA9IChcbiAgLy8gMTkuNC4yLjIsIDE5LjQuMi4zLCAxOS40LjIuNCwgMTkuNC4yLjYsIDE5LjQuMi44LCAxOS40LjIuOSwgMTkuNC4yLjEwLCAxOS40LjIuMTEsIDE5LjQuMi4xMiwgMTkuNC4yLjEzLCAxOS40LjIuMTRcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBqID0gMDsgZXM2U3ltYm9scy5sZW5ndGggPiBqOyl3a3MoZXM2U3ltYm9sc1tqKytdKTtcblxuZm9yICh2YXIgd2VsbEtub3duU3ltYm9scyA9ICRrZXlzKHdrcy5zdG9yZSksIGsgPSAwOyB3ZWxsS25vd25TeW1ib2xzLmxlbmd0aCA+IGs7KSB3a3NEZWZpbmUod2VsbEtub3duU3ltYm9sc1trKytdKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ1N5bWJvbCcsIHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihzeW0pIHtcbiAgICBpZiAoIWlzU3ltYm9sKHN5bSkpIHRocm93IFR5cGVFcnJvcihzeW0gKyAnIGlzIG5vdCBhIHN5bWJvbCEnKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gU3ltYm9sUmVnaXN0cnkpIGlmIChTeW1ib2xSZWdpc3RyeVtrZXldID09PSBzeW0pIHJldHVybiBrZXk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24gKCkgeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uICgpIHsgc2V0dGVyID0gZmFsc2U7IH1cbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuMiBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAkZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gMjQuMy4yIEpTT04uc3RyaW5naWZ5KHZhbHVlIFssIHJlcGxhY2VyIFssIHNwYWNlXV0pXG4kSlNPTiAmJiAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghVVNFX05BVElWRSB8fCAkZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7IGE6IFMgfSkgIT0gJ3t9JyB8fCBfc3RyaW5naWZ5KE9iamVjdChTKSkgIT0gJ3t9Jztcbn0pKSwgJ0pTT04nLCB7XG4gIHN0cmluZ2lmeTogZnVuY3Rpb24gc3RyaW5naWZ5KGl0KSB7XG4gICAgdmFyIGFyZ3MgPSBbaXRdO1xuICAgIHZhciBpID0gMTtcbiAgICB2YXIgcmVwbGFjZXIsICRyZXBsYWNlcjtcbiAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGkpIGFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgJHJlcGxhY2VyID0gcmVwbGFjZXIgPSBhcmdzWzFdO1xuICAgIGlmICghaXNPYmplY3QocmVwbGFjZXIpICYmIGl0ID09PSB1bmRlZmluZWQgfHwgaXNTeW1ib2woaXQpKSByZXR1cm47IC8vIElFOCByZXR1cm5zIHN0cmluZyBvbiB1bmRlZmluZWRcbiAgICBpZiAoIWlzQXJyYXkocmVwbGFjZXIpKSByZXBsYWNlciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mICRyZXBsYWNlciA9PSAnZnVuY3Rpb24nKSB2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgaWYgKCFpc1N5bWJvbCh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7XG4iLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ2FzeW5jSXRlcmF0b3InKTtcbiIsInZhciAkaXRlcmF0b3JzID0gcmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciBJVEVSQVRPUiA9IHdrcygnaXRlcmF0b3InKTtcbnZhciBUT19TVFJJTkdfVEFHID0gd2tzKCd0b1N0cmluZ1RhZycpO1xudmFyIEFycmF5VmFsdWVzID0gSXRlcmF0b3JzLkFycmF5O1xuXG52YXIgRE9NSXRlcmFibGVzID0ge1xuICBDU1NSdWxlTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIENTU1N0eWxlRGVjbGFyYXRpb246IGZhbHNlLFxuICBDU1NWYWx1ZUxpc3Q6IGZhbHNlLFxuICBDbGllbnRSZWN0TGlzdDogZmFsc2UsXG4gIERPTVJlY3RMaXN0OiBmYWxzZSxcbiAgRE9NU3RyaW5nTGlzdDogZmFsc2UsXG4gIERPTVRva2VuTGlzdDogdHJ1ZSxcbiAgRGF0YVRyYW5zZmVySXRlbUxpc3Q6IGZhbHNlLFxuICBGaWxlTGlzdDogZmFsc2UsXG4gIEhUTUxBbGxDb2xsZWN0aW9uOiBmYWxzZSxcbiAgSFRNTENvbGxlY3Rpb246IGZhbHNlLFxuICBIVE1MRm9ybUVsZW1lbnQ6IGZhbHNlLFxuICBIVE1MU2VsZWN0RWxlbWVudDogZmFsc2UsXG4gIE1lZGlhTGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIE1pbWVUeXBlQXJyYXk6IGZhbHNlLFxuICBOYW1lZE5vZGVNYXA6IGZhbHNlLFxuICBOb2RlTGlzdDogdHJ1ZSxcbiAgUGFpbnRSZXF1ZXN0TGlzdDogZmFsc2UsXG4gIFBsdWdpbjogZmFsc2UsXG4gIFBsdWdpbkFycmF5OiBmYWxzZSxcbiAgU1ZHTGVuZ3RoTGlzdDogZmFsc2UsXG4gIFNWR051bWJlckxpc3Q6IGZhbHNlLFxuICBTVkdQYXRoU2VnTGlzdDogZmFsc2UsXG4gIFNWR1BvaW50TGlzdDogZmFsc2UsXG4gIFNWR1N0cmluZ0xpc3Q6IGZhbHNlLFxuICBTVkdUcmFuc2Zvcm1MaXN0OiBmYWxzZSxcbiAgU291cmNlQnVmZmVyTGlzdDogZmFsc2UsXG4gIFN0eWxlU2hlZXRMaXN0OiB0cnVlLCAvLyBUT0RPOiBOb3Qgc3BlYyBjb21wbGlhbnQsIHNob3VsZCBiZSBmYWxzZS5cbiAgVGV4dFRyYWNrQ3VlTGlzdDogZmFsc2UsXG4gIFRleHRUcmFja0xpc3Q6IGZhbHNlLFxuICBUb3VjaExpc3Q6IGZhbHNlXG59O1xuXG5mb3IgKHZhciBjb2xsZWN0aW9ucyA9IGdldEtleXMoRE9NSXRlcmFibGVzKSwgaSA9IDA7IGkgPCBjb2xsZWN0aW9ucy5sZW5ndGg7IGkrKykge1xuICB2YXIgTkFNRSA9IGNvbGxlY3Rpb25zW2ldO1xuICB2YXIgZXhwbGljaXQgPSBET01JdGVyYWJsZXNbTkFNRV07XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdO1xuICB2YXIgcHJvdG8gPSBDb2xsZWN0aW9uICYmIENvbGxlY3Rpb24ucHJvdG90eXBlO1xuICB2YXIga2V5O1xuICBpZiAocHJvdG8pIHtcbiAgICBpZiAoIXByb3RvW0lURVJBVE9SXSkgaGlkZShwcm90bywgSVRFUkFUT1IsIEFycmF5VmFsdWVzKTtcbiAgICBpZiAoIXByb3RvW1RPX1NUUklOR19UQUddKSBoaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgICBJdGVyYXRvcnNbTkFNRV0gPSBBcnJheVZhbHVlcztcbiAgICBpZiAoZXhwbGljaXQpIGZvciAoa2V5IGluICRpdGVyYXRvcnMpIGlmICghcHJvdG9ba2V5XSkgcmVkZWZpbmUocHJvdG8sIGtleSwgJGl0ZXJhdG9yc1trZXldLCB0cnVlKTtcbiAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgUGFydGljbGVzXzEgPSByZXF1aXJlKFwiLi4vUGFydGljbGVzL1BhcnRpY2xlc1wiKTtcbnZhciBTdGFyc18xID0gcmVxdWlyZShcIi4vU3RhcnNcIik7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBjYW52YXMgPSBuZXcgUGFydGljbGVzXzEuZGVmYXVsdCgnI3BhcnRpY2xlcycsICcyZCcpO1xuY2FudmFzLnNldFBhcnRpY2xlU2V0dGluZ3MoU3RhcnNfMS5TdGFycy5QYXJ0aWNsZXMpO1xuY2FudmFzLnNldEludGVyYWN0aXZlU2V0dGluZ3MoU3RhcnNfMS5TdGFycy5JbnRlcmFjdGl2ZSk7XG5jYW52YXMuc3RhcnQoKTtcbnZhciBwYXVzZWQgPSBmYWxzZTtcbldlYlBhZ2VfMS5TY3JvbGxIb29rLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoV2ViUGFnZV8xLlNlY3Rpb25zLmdldCgnY2FudmFzJykuaW5WaWV3KCkpIHtcbiAgICAgICAgaWYgKHBhdXNlZCkge1xuICAgICAgICAgICAgcGF1c2VkID0gZmFsc2U7XG4gICAgICAgICAgICBjYW52YXMucmVzdW1lKCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmICghcGF1c2VkKSB7XG4gICAgICAgICAgICBwYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgY2FudmFzLnBhdXNlKCk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5TdGFycyA9IHtcbiAgICBQYXJ0aWNsZXM6IHtcbiAgICAgICAgbnVtYmVyOiAzNTAsXG4gICAgICAgIGRlbnNpdHk6IDIwMCxcbiAgICAgICAgY29sb3I6ICcjRkZGRkZGJyxcbiAgICAgICAgb3BhY2l0eTogJ3JhbmRvbScsXG4gICAgICAgIHJhZGl1czogWzEsIDEuNSwgMiwgMi41LCAzLCAzLjVdLFxuICAgICAgICBzaGFwZTogJ2NpcmNsZScsXG4gICAgICAgIHN0cm9rZToge1xuICAgICAgICAgICAgd2lkdGg6IDAsXG4gICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgICAgIH0sXG4gICAgICAgIG1vdmU6IHtcbiAgICAgICAgICAgIHNwZWVkOiAwLjIsXG4gICAgICAgICAgICBkaXJlY3Rpb246ICdyYW5kb20nLFxuICAgICAgICAgICAgc3RyYWlnaHQ6IGZhbHNlLFxuICAgICAgICAgICAgcmFuZG9tOiB0cnVlLFxuICAgICAgICAgICAgZWRnZUJvdW5jZTogZmFsc2UsXG4gICAgICAgICAgICBhdHRyYWN0OiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgIHJlc2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgIGhvdmVyOiAnYnViYmxlJyxcbiAgICAgICAgICAgIGNsaWNrOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBhbmltYXRlOiB7XG4gICAgICAgICAgICBvcGFjaXR5OiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuMixcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgc3luYzogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYWRpdXM6IHtcbiAgICAgICAgICAgICAgICBzcGVlZDogMyxcbiAgICAgICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICAgICAgc3luYzogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgSW50ZXJhY3RpdmU6IHtcbiAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgIGJ1YmJsZToge1xuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiA3NSxcbiAgICAgICAgICAgICAgICByYWRpdXM6IDcsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogMVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEpTWF8xID0gcmVxdWlyZShcIi4uLy4uL0RlZmluaXRpb25zL0pTWFwiKTtcbnZhciBFeHBlcmllbmNlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBFeHBlcmllbmNlKGRhdGEpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG4gICAgRXhwZXJpZW5jZS5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImNhcmQgaXMtcHJpbWFyeSBleHBlcmllbmNlXCIgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudFwiIH0sXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJoZWFkZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImljb25cIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImFcIiwgeyBocmVmOiB0aGlzLmRhdGEubGluayB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IFwiLi9vdXQvaW1hZ2VzL0V4cGVyaWVuY2UvXCIgKyB0aGlzLmRhdGEuc3ZnICsgXCIuc3ZnXCIgfSkpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjb21wYW55XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogdGhpcy5kYXRhLmxpbmssIGNsYXNzTmFtZTogXCJuYW1lIGlzLXNpemUtMSBpcy1ub3JtYWwtd2VpZ2h0IGlzLXVwcGVyY2FzZVwiIH0sIHRoaXMuZGF0YS5jb21wYW55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImxvY2F0aW9uIGlzLXNpemUtNSBpcy1pdGFsaWMgaXMtbGlnaHQtY29sb3IgaXMtbm9ybWFsLXdlaWdodFwiIH0sIHRoaXMuZGF0YS5sb2NhdGlvbikpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInJvbGVcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwibmFtZSBpcy1zaXplLTMgaXMtYm9sZFwiIH0sIHRoaXMuZGF0YS5wb3NpdGlvbiksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJkYXRlIGlzLXNpemUtNSBpcy1pdGFsaWMgaXMtbGlnaHQtY29sb3IgaXMtbm9ybWFsLXdlaWdodFwiIH0sIFwiKFwiICsgdGhpcy5kYXRhLmJlZ2luICsgXCIgXFx1MjAxNCBcIiArIHRoaXMuZGF0YS5lbmQgKyBcIilcIikpKSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjb250ZW50IGluZm9cIiB9LFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJkZXNjcmlwdGlvbiBpcy1zaXplLTQgaXMtbm9ybWFsLXdlaWdodCBpcy1saWdodC1jb2xvciBpcy1pdGFsaWMgaXMtanVzdGlmaWVkIGlzLXF1b3RlXCIgfSwgdGhpcy5kYXRhLmZsYXZvciksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7IGNsYXNzTmFtZTogXCJqb2IgaXMtbGVmdC1hbGlnbmVkIGlzLXNpemUtNFwiIH0sIHRoaXMuZGF0YS5yb2xlcy5tYXAoZnVuY3Rpb24gKHJvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgcm9sZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKSkpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gRXhwZXJpZW5jZTtcbn0oKSk7XG5leHBvcnRzLkV4cGVyaWVuY2UgPSBFeHBlcmllbmNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBFdmVudERpc3BhdGNoZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBNZW51ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWVudSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNZW51KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5vcGVuID0gZmFsc2U7XG4gICAgICAgIF90aGlzLkNvbnRhaW5lciA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5tZW51Jyk7XG4gICAgICAgIF90aGlzLkhhbWJ1cmdlciA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5tZW51IC5oYW1idXJnZXInKTtcbiAgICAgICAgX3RoaXMucmVnaXN0ZXIoJ3RvZ2dsZScpO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIE1lbnUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vcGVuID0gIXRoaXMub3BlbjtcbiAgICAgICAgaWYgKHRoaXMub3Blbikge1xuICAgICAgICAgICAgdGhpcy5Db250YWluZXIuc2V0QXR0cmlidXRlKCdvcGVuJywgJycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5Db250YWluZXIucmVtb3ZlQXR0cmlidXRlKCdvcGVuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwYXRjaCgndG9nZ2xlJywgeyBvcGVuOiB0aGlzLm9wZW4gfSk7XG4gICAgfTtcbiAgICByZXR1cm4gTWVudTtcbn0oRXZlbnREaXNwYXRjaGVyXzEuRXZlbnRzLkV2ZW50RGlzcGF0Y2hlcikpO1xuZXhwb3J0cy5NZW51ID0gTWVudTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEpTWF8xID0gcmVxdWlyZShcIi4uLy4uL0RlZmluaXRpb25zL0pTWFwiKTtcbnZhciBRdWFsaXR5ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBRdWFsaXR5KGRhdGEpIHtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG4gICAgUXVhbGl0eS5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImdyaWQtY29sIHNtMTIgbWQ0IHNtLWJsb2NrXCIgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImljb24gXCIgKyB0aGlzLmRhdGEuZmFDbGFzcyB9KSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInF1YWxpdHkgaXMtc2l6ZS0yIGlzLWJvbGQgaXMtdXBwZXJjYXNlXCIgfSwgdGhpcy5kYXRhLm5hbWUpLFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZGVzYyBpcy1saWdodC13ZWlnaHQgaXMtc2l6ZS0zXCIgfSwgdGhpcy5kYXRhLmRlc2NyaXB0aW9uKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIFF1YWxpdHk7XG59KCkpO1xuZXhwb3J0cy5RdWFsaXR5ID0gUXVhbGl0eTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFNlY3Rpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNlY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIH1cbiAgICBTZWN0aW9uLnByb3RvdHlwZS5pblZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBib3VuZGluZyA9IHRoaXMuZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIHZpZXcgPSBET01fMS5ET00uZ2V0Vmlld3BvcnQoKTtcbiAgICAgICAgcmV0dXJuIGJvdW5kaW5nLmJvdHRvbSA+PSAwICYmXG4gICAgICAgICAgICBib3VuZGluZy5yaWdodCA+PSAwICYmXG4gICAgICAgICAgICBib3VuZGluZy50b3AgPD0gdmlldy5oZWlnaHQgJiZcbiAgICAgICAgICAgIGJvdW5kaW5nLmxlZnQgPD0gdmlldy53aWR0aDtcbiAgICB9O1xuICAgIFNlY3Rpb24ucHJvdG90eXBlLmdldElEID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlkO1xuICAgIH07XG4gICAgU2VjdGlvbi5wcm90b3R5cGUuaW5NZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vLW1lbnUnKTtcbiAgICB9O1xuICAgIHJldHVybiBTZWN0aW9uO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNlY3Rpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBTVkdfMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL1NWR1wiKTtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgU2tpbGwgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNraWxsKGRhdGEpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB9XG4gICAgU2tpbGwucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoX3RoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBTVkdfMS5TVkcubG9hZFNWRyhcIi4vb3V0L2ltYWdlcy9Ta2lsbHMvXCIgKyBfdGhpcy5kYXRhLnN2ZykudGhlbihmdW5jdGlvbiAoc3ZnKSB7XG4gICAgICAgICAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnaWNvbicpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImxpXCIsIHsgY2xhc3NOYW1lOiAnc2tpbGwnIH0sXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6ICdoZXhhZ29uLWNvbnRhaW5lcicsIHN0eWxlOiB7IGNvbG9yOiBfdGhpcy5kYXRhLmNvbG9yIH0gfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiAndG9vbHRpcCcgfSwgX3RoaXMuZGF0YS5uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN2ZyxcbiAgICAgICAgICAgICAgICAgICAgICAgIFNraWxsLkhleGFnb25TVkcuY2xvbmVOb2RlKHRydWUpKSkpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU2tpbGwuaW5pdGlhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGlmIChTa2lsbC5IZXhhZ29uU1ZHKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIFNWR18xLlNWRy5sb2FkU1ZHKCcuL291dC9pbWFnZXMvQ29udGVudC9IZXhhZ29uJykudGhlbihmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnaGV4YWdvbicpO1xuICAgICAgICAgICAgICAgICAgICBTa2lsbC5IZXhhZ29uU1ZHID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gU2tpbGw7XG59KCkpO1xuZXhwb3J0cy5Ta2lsbCA9IFNraWxsO1xuU2tpbGwuaW5pdGlhbGl6ZSgpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFib3V0TWUgPSBcIkkgYW0gYW4gYXNwaXJpbmcgd2ViIGRldmVsb3BlciBhbmQgc29mdHdhcmUgZW5naW5lZXIgY2hhc2luZyBteSBwYXNzaW9uIGZvciB3b3JraW5nIHdpdGggdGVjaG5vbG9neSBhbmQgcHJvZ3JhbW1pbmcgYXQgdGhlIFVuaXZlcnNpdHkgb2YgVGV4YXMgYXQgRGFsbGFzLiBJIGNyYXZlIHRoZSBvcHBvcnR1bml0eSB0byBjb250cmlidXRlIHRvIG1lYW5pbmdmdWwgcHJvamVjdHMgdGhhdCBlbXBsb3kgbXkgY3VycmVudCBnaWZ0cyBhbmQgaW50ZXJlc3RzIHdoaWxlIGFsc28gc2hvdmluZyBtZSBvdXQgb2YgbXkgY29tZm9ydCB6b25lIHRvIGxlYXJuIG5ldyBza2lsbHMuIE15IGdvYWwgaXMgdG8gbWF4aW1pemUgZXZlcnkgZXhwZXJpZW5jZSBhcyBhbiBvcHBvcnR1bml0eSBmb3IgcGVyc29uYWwsIHByb2Zlc3Npb25hbCwgYW5kIHRlY2huaWNhbCBncm93dGguXCI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRXhwZXJpZW5jZSA9IFtcbiAgICB7XG4gICAgICAgIHN2ZzogJ2xpZmVjaHVyY2gnLFxuICAgICAgICBsaW5rOiAnaHR0cDovL2xpZmUuY2h1cmNoJyxcbiAgICAgICAgY29tcGFueTogJ0xpZmUuQ2h1cmNoJyxcbiAgICAgICAgbG9jYXRpb246ICdFZG1vbmQsIE9LLCBVU0EnLFxuICAgICAgICBwb3NpdGlvbjogJ0luZm9ybWF0aW9uIFRlY2hub2xvZ3kgSW50ZXJuJyxcbiAgICAgICAgYmVnaW46ICdNYXkgMjAxOCcsXG4gICAgICAgIGVuZDogJ0F1Z3VzdCAyMDE4JyxcbiAgICAgICAgZmxhdm9yOiAnTGlmZS5DaHVyY2ggaXMgYSBtdWx0aS1zaXRlIGNodXJjaCBjZW50ZXJlZCBhcm91bmQgdGhlaXIgbWlzc2lvbiB0byBcImxlYWQgcGVvcGxlIHRvIGJlY29tZSBmdWxseS1kZXZvdGVkIGZvbGxvd2VycyBvZiBDaHJpc3QuXCIgSSB3b3JrZWQgYWxvbmdzaWRlIHRoZWlyIENlbnRyYWwgSW5mb3JtYXRpb24gVGVjaG5vbG9neSB0ZWFtOiBhIGdyb3VwIGRlZGljYXRlZCB0byB1dGlsaXppbmcgdGVjaG5vbG9neSB0byBzZXJ2ZSBhbmQgZXF1aXAgdGhlIGNodXJjaC4nLFxuICAgICAgICByb2xlczogW1xuICAgICAgICAgICAgJ1NwZW50IHRpbWUgbGVhcm5pbmcgZnJvbSBoYXJkd2FyZSwgc29mdHdhcmUsIGFuZCBkYXRhYmFzZSB0ZWFtcyBpbiBhbiBBZ2lsZSBlbnZpcm9ubWVudC4nLFxuICAgICAgICAgICAgJ0Rlc2lnbmVkIGFuZCBkZXZlbG9wZWQgYSB3ZWIgYXBwbGljYXRpb24gZm9yIHJlbW90ZSB2b2x1bnRlZXIgdHJhY2tpbmcgd2l0aCBOb2RlLmpzIGFuZCBQb3N0Z3JlU1FMLicsXG4gICAgICAgICAgICAnRHluYW1pY2FsbHkgZGVwbG95ZWQgYXBwbGljYXRpb24gdG8gR29vZ2xlIENsb3VkIFBsYXRmb3JtIHVzaW5nIENsb3VkIEJ1aWxkcywgRG9ja2VyLCBhbmQgS3ViZXJuZXRlcy4nXG4gICAgICAgIF1cbiAgICB9XG5dO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlF1YWxpdGllcyA9IFtcbiAgICB7XG4gICAgICAgIGZhQ2xhc3M6ICdmYXMgZmEtaGlzdG9yeScsXG4gICAgICAgIG5hbWU6ICdFZmZpY2llbnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgY29uc2lzdGVudGx5IGJyaW5nIGVuZXJneSwgcHJvZHVjdGl2aXR5LCBvcmdhbml6YXRpb24sIGFuZCBhZ2lsaXR5IHRvIHRoZSB0YWJsZSBhcyBhbiBlZmZlY3RpdmUgd29ya2VyIGFuZCBhIHF1aWNrIGxlYXJuZXIuJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBmYUNsYXNzOiAnZmFyIGZhLXNub3dmbGFrZScsXG4gICAgICAgIG5hbWU6ICdBdHRlbnRpdmUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RvIG1lLCBldmVyeSBkZXRhaWwgbWF0dGVycy4gSSBsb3ZlIGZvcm11bGF0aW5nIHRoZSBiaWcgcGljdHVyZSBqdXN0IGFzIG11Y2ggYXMgbWVhc3VyaW5nIG91dCB0aGUgdGlueSBkZXRhaWxzIGFuZCBlZGdlIGNhc2VzLidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgZmFDbGFzczogJ2ZhcyBmYS1mZWF0aGVyLWFsdCcsXG4gICAgICAgIG5hbWU6ICdGbGV4aWJsZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSB3b3JrIGJlc3Qgd2hlbiBJIGFtIGNoYWxsZW5nZWQuIFdoaWxlIEkgdGhyaXZlIGluIG9yZ2FuaXphdGlvbiwgSSBjYW4gYWx3YXlzIGFkYXB0IGFuZCBwaWNrIHVwIG5ldyB0aGluZ3MgaW4gYSBzd2lmdCBtYW5uZXIuJ1xuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2tpbGxzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ0MrKycsXG4gICAgICAgIHN2ZzogJ2NwbHVzcGx1cycsXG4gICAgICAgIGNvbG9yOiAnIzlCMDIzQSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0MjJyxcbiAgICAgICAgc3ZnOiAnY3NoYXJwJyxcbiAgICAgICAgY29sb3I6ICcjOUI0Rjk3J1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQ1NTJyxcbiAgICAgICAgc3ZnOiAnY3NzJyxcbiAgICAgICAgY29sb3I6ICcjM0M5Q0Q3J1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnRG9ja2VyJyxcbiAgICAgICAgc3ZnOiAnZG9ja2VyJyxcbiAgICAgICAgY29sb3I6ICcjMjJCOUVDJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnLk5FVCBDb3JlL0ZyYW1ld29yaycsXG4gICAgICAgIHN2ZzogJ2RvdG5ldCcsXG4gICAgICAgIGNvbG9yOiAnIzBGNzZCRCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0V4cHJlc3MgSlMnLFxuICAgICAgICBzdmc6ICdleHByZXNzJyxcbiAgICAgICAgY29sb3I6ICcjM0QzRDNEJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnR29vZ2xlIENsb3VkIFBsYXRmb3JtJyxcbiAgICAgICAgc3ZnOiAnZ2NwJyxcbiAgICAgICAgY29sb3I6ICcjNDM4NkZBJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnR3VscCcsXG4gICAgICAgIHN2ZzogJ2d1bHAnLFxuICAgICAgICBjb2xvcjogJyNEQTQ2NDgnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdIZXJva3UnLFxuICAgICAgICBzdmc6ICdoZXJva3UnLFxuICAgICAgICBjb2xvcjogJyM2NzYyQTYnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdIVE1MJyxcbiAgICAgICAgc3ZnOiAnaHRtbCcsXG4gICAgICAgIGNvbG9yOiAnI0VGNjUyQSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0phdmFTY3JpcHQnLFxuICAgICAgICBzdmc6ICdqYXZhc2NyaXB0JyxcbiAgICAgICAgY29sb3I6ICcjRjBEQjRGJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSmVzdCcsXG4gICAgICAgIHN2ZzogJ2plc3QnLFxuICAgICAgICBjb2xvcjogJyNDMjEzMjUnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdLdWJlcm5ldGVzJyxcbiAgICAgICAgc3ZnOiAna3ViZXJuZXRlcycsXG4gICAgICAgIGNvbG9yOiAnIzM1NkRFNidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ05vZGUuanMnLFxuICAgICAgICBzdmc6ICdub2RlanMnLFxuICAgICAgICBjb2xvcjogJyM4Q0M4NEInXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdQb3N0Z3JlU1FMJyxcbiAgICAgICAgc3ZnOiAncG9zdGdyZXNxbCcsXG4gICAgICAgIGNvbG9yOiAnIzMyNjY5MCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1JlYWN0JyxcbiAgICAgICAgc3ZnOiAncmVhY3QnLFxuICAgICAgICBjb2xvcjogJyMwMEQ4RkYnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdSIExhbmd1YWdlJyxcbiAgICAgICAgc3ZnOiAncmxhbmcnLFxuICAgICAgICBjb2xvcjogJyMyMzY5QkMnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdTQVNTL1NDU1MnLFxuICAgICAgICBzdmc6ICdzYXNzJyxcbiAgICAgICAgY29sb3I6ICcjQ0Q2NjlBJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnVHlwZVNjcmlwdCcsXG4gICAgICAgIHN2ZzogJ3R5cGVzY3JpcHQnLFxuICAgICAgICBjb2xvcjogJyMwMDdBQ0MnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdWdWUnLFxuICAgICAgICBzdmc6ICd2dWUnLFxuICAgICAgICBjb2xvcjogJyM0RkMwOEQnXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEVsZW1lbnRGYWN0b3J5O1xuKGZ1bmN0aW9uIChFbGVtZW50RmFjdG9yeSkge1xuICAgIHZhciBGcmFnbWVudCA9ICc8PjwvPic7XG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWdOYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDI7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgY2hpbGRyZW5bX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZ05hbWUgPT09IEZyYWdtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgX2IgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTsgX2EgPCBfYi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gX2JbX2FdO1xuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAnY2xhc3NOYW1lJykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgSlN0b0NTUyhhdHRyaWJ1dGVWYWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGtleS5zdGFydHNXaXRoKCdvbicpICYmIHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoa2V5LnN1YnN0cmluZygyKSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ2Jvb2xlYW4nICYmIGF0dHJpYnV0ZVZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksICcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAodmFyIF9jID0gMCwgY2hpbGRyZW5fMSA9IGNoaWxkcmVuOyBfYyA8IGNoaWxkcmVuXzEubGVuZ3RoOyBfYysrKSB7XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBjaGlsZHJlbl8xW19jXTtcbiAgICAgICAgICAgIGFwcGVuZENoaWxkKGVsZW1lbnQsIGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWxlbWVudDtcbiAgICB9XG4gICAgRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudCA9IGNyZWF0ZUVsZW1lbnQ7XG4gICAgZnVuY3Rpb24gYXBwZW5kQ2hpbGQocGFyZW50LCBjaGlsZCkge1xuICAgICAgICBpZiAodHlwZW9mIGNoaWxkID09PSAndW5kZWZpbmVkJyB8fCBjaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChBcnJheS5pc0FycmF5KGNoaWxkKSkge1xuICAgICAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBjaGlsZF8xID0gY2hpbGQ7IF9pIDwgY2hpbGRfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBjaGlsZF8xW19pXTtcbiAgICAgICAgICAgICAgICBhcHBlbmRDaGlsZChwYXJlbnQsIHZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2hpbGQgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY2hpbGQpKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjaGlsZCBpbnN0YW5jZW9mIE5vZGUpIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNoaWxkID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShTdHJpbmcoY2hpbGQpKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgRWxlbWVudEZhY3RvcnkuYXBwZW5kQ2hpbGQgPSBhcHBlbmRDaGlsZDtcbiAgICBmdW5jdGlvbiBKU3RvQ1NTKGNzc09iamVjdCkge1xuICAgICAgICB2YXIgY3NzU3RyaW5nID0gXCJcIjtcbiAgICAgICAgdmFyIHJ1bGU7XG4gICAgICAgIHZhciBydWxlcyA9IE9iamVjdC5rZXlzKGNzc09iamVjdCk7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcnVsZXMubGVuZ3RoOyBpKyssIGNzc1N0cmluZyArPSAnICcpIHtcbiAgICAgICAgICAgIHJ1bGUgPSBydWxlc1tpXTtcbiAgICAgICAgICAgIGNzc1N0cmluZyArPSBydWxlLnJlcGxhY2UoLyhbQS1aXSkvZywgZnVuY3Rpb24gKHVwcGVyKSB7IHJldHVybiBcIi1cIiArIHVwcGVyWzBdLnRvTG93ZXJDYXNlKCk7IH0pICsgXCI6IFwiICsgY3NzT2JqZWN0W3J1bGVdICsgXCI7XCI7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGNzc1N0cmluZztcbiAgICB9XG59KShFbGVtZW50RmFjdG9yeSA9IGV4cG9ydHMuRWxlbWVudEZhY3RvcnkgfHwgKGV4cG9ydHMuRWxlbWVudEZhY3RvcnkgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBBYm91dF8xID0gcmVxdWlyZShcIi4uL0RhdGEvQWJvdXRcIik7XG52YXIgUXVhbGl0aWVzXzEgPSByZXF1aXJlKFwiLi4vRGF0YS9RdWFsaXRpZXNcIik7XG52YXIgUXVhbGl0eV8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvUXVhbGl0eVwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICBXZWJQYWdlXzEuRmxhdm9yVGV4dC5pbm5lclRleHQgPSBBYm91dF8xLkFib3V0TWU7XG59KTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICB2YXIgb2JqZWN0O1xuICAgIGZvciAodmFyIF9pID0gMCwgUXVhbGl0aWVzXzIgPSBRdWFsaXRpZXNfMS5RdWFsaXRpZXM7IF9pIDwgUXVhbGl0aWVzXzIubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBxdWFsaXR5ID0gUXVhbGl0aWVzXzJbX2ldO1xuICAgICAgICBvYmplY3QgPSBuZXcgUXVhbGl0eV8xLlF1YWxpdHkocXVhbGl0eSk7XG4gICAgICAgIFdlYlBhZ2VfMS5RdWFsaXRpZXNDb250YWluZXIuYXBwZW5kQ2hpbGQob2JqZWN0LmNyZWF0ZUVsZW1lbnQoKSk7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIGRlbGF5ID0gMTAwMDtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoaSkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5DYW52YXNUZXh0LmNoaWxkcmVuW2ldLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZWxvYWQnKTtcbiAgICAgICAgfSwgZGVsYXkgKiAoaSArIDEpKTtcbiAgICB9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgV2ViUGFnZV8xLkNhbnZhc1RleHQuY2hpbGRFbGVtZW50Q291bnQ7IGkrKykge1xuICAgICAgICBfbG9vcF8xKGkpO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBFeHBlcmllbmNlXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9FeHBlcmllbmNlXCIpO1xudmFyIEV4cGVyaWVuY2VfMiA9IHJlcXVpcmUoXCIuLi9EYXRhL0V4cGVyaWVuY2VcIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgdmFyIGNhcmQ7XG4gICAgZm9yICh2YXIgX2kgPSAwLCBEYXRhXzEgPSBFeHBlcmllbmNlXzIuRXhwZXJpZW5jZTsgX2kgPCBEYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBkYXRhID0gRGF0YV8xW19pXTtcbiAgICAgICAgY2FyZCA9IG5ldyBFeHBlcmllbmNlXzEuRXhwZXJpZW5jZShkYXRhKTtcbiAgICAgICAgV2ViUGFnZV8xLkV4cGVyaWVuY2VTZWN0aW9uLmFwcGVuZENoaWxkKGNhcmQuY3JlYXRlRWxlbWVudCgpKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgaWYgKCFET01fMS5ET00uaXNJRSgpKSB7XG4gICAgICAgIFdlYlBhZ2VfMS5Mb2dvLk91dGVyLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZWxvYWQnKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBXZWJQYWdlXzEuTG9nby5Jbm5lci5jbGFzc0xpc3QucmVtb3ZlKCdwcmVsb2FkJyk7XG4gICAgICAgIH0sIDQwMCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBXZWJQYWdlXzEuTG9nby5PdXRlci5jbGFzc05hbWUgPSAnb3V0ZXInO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5Mb2dvLklubmVyLmNsYXNzTmFtZSA9ICdpbm5lcic7XG4gICAgICAgIH0sIDQwMCk7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xuV2ViUGFnZV8xLk1lbnVCdXR0b24uc3Vic2NyaWJlKFdlYlBhZ2VfMS5NYWluLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICBpZiAoZXZlbnQubmFtZSA9PT0gJ3RvZ2dsZScpIHtcbiAgICAgICAgaWYgKGV2ZW50LmRldGFpbC5vcGVuKSB7XG4gICAgICAgICAgICBXZWJQYWdlXzEuTWFpbi5zZXRBdHRyaWJ1dGUoJ3NoaWZ0ZWQnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBXZWJQYWdlXzEuTWFpbi5yZW1vdmVBdHRyaWJ1dGUoJ3NoaWZ0ZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0pO1xuV2ViUGFnZV8xLlNjcm9sbEhvb2suYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBzZWN0aW9uO1xuICAgIHZhciBhbmNob3I7XG4gICAgdmFyIGl0ZXIgPSBXZWJQYWdlXzEuU2VjdGlvblRvTWVudS52YWx1ZXMoKTtcbiAgICB2YXIgY3VycmVudCA9IGl0ZXIubmV4dCgpO1xuICAgIGZvciAodmFyIGRvbmUgPSBmYWxzZTsgIWRvbmU7IGN1cnJlbnQgPSBpdGVyLm5leHQoKSwgZG9uZSA9IGN1cnJlbnQuZG9uZSkge1xuICAgICAgICBfYSA9IGN1cnJlbnQudmFsdWUsIHNlY3Rpb24gPSBfYVswXSwgYW5jaG9yID0gX2FbMV07XG4gICAgICAgIGlmIChzZWN0aW9uLmluVmlldygpKSB7XG4gICAgICAgICAgICBhbmNob3Iuc2V0QXR0cmlidXRlKCdzZWxlY3RlZCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGFuY2hvci5yZW1vdmVBdHRyaWJ1dGUoJ3NlbGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG5XZWJQYWdlXzEuTWVudUJ1dHRvbi5IYW1idXJnZXIuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgV2ViUGFnZV8xLk1lbnVCdXR0b24udG9nZ2xlKCk7XG59KTtcbnZhciBpdGVyID0gV2ViUGFnZV8xLlNlY3Rpb25Ub01lbnUudmFsdWVzKCk7XG52YXIgY3VycmVudCA9IGl0ZXIubmV4dCgpO1xudmFyIF9sb29wXzEgPSBmdW5jdGlvbiAoZG9uZSkge1xuICAgIHZhciBfYTtcbiAgICB2YXIgc2VjdGlvbjtcbiAgICB2YXIgYW5jaG9yID0gdm9pZCAwO1xuICAgIF9hID0gY3VycmVudC52YWx1ZSwgc2VjdGlvbiA9IF9hWzBdLCBhbmNob3IgPSBfYVsxXTtcbiAgICBhbmNob3IuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgc2VjdGlvbi5lbGVtZW50LnNjcm9sbEludG9WaWV3KHtcbiAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbn07XG5mb3IgKHZhciBkb25lID0gZmFsc2U7ICFkb25lOyBjdXJyZW50ID0gaXRlci5uZXh0KCksIGRvbmUgPSBjdXJyZW50LmRvbmUpIHtcbiAgICBfbG9vcF8xKGRvbmUpO1xufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbnZhciBfX2dlbmVyYXRvciA9ICh0aGlzICYmIHRoaXMuX19nZW5lcmF0b3IpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBib2R5KSB7XG4gICAgdmFyIF8gPSB7IGxhYmVsOiAwLCBzZW50OiBmdW5jdGlvbigpIHsgaWYgKHRbMF0gJiAxKSB0aHJvdyB0WzFdOyByZXR1cm4gdFsxXTsgfSwgdHJ5czogW10sIG9wczogW10gfSwgZiwgeSwgdCwgZztcbiAgICByZXR1cm4gZyA9IHsgbmV4dDogdmVyYigwKSwgXCJ0aHJvd1wiOiB2ZXJiKDEpLCBcInJldHVyblwiOiB2ZXJiKDIpIH0sIHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiAoZ1tTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzOyB9KSwgZztcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cbiAgICBmdW5jdGlvbiBzdGVwKG9wKSB7XG4gICAgICAgIGlmIChmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgZXhlY3V0aW5nLlwiKTtcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XG4gICAgICAgICAgICBpZiAoZiA9IDEsIHkgJiYgKHQgPSBvcFswXSAmIDIgPyB5W1wicmV0dXJuXCJdIDogb3BbMF0gPyB5W1widGhyb3dcIl0gfHwgKCh0ID0geVtcInJldHVyblwiXSkgJiYgdC5jYWxsKHkpLCAwKSA6IHkubmV4dCkgJiYgISh0ID0gdC5jYWxsKHksIG9wWzFdKSkuZG9uZSkgcmV0dXJuIHQ7XG4gICAgICAgICAgICBpZiAoeSA9IDAsIHQpIG9wID0gW29wWzBdICYgMiwgdC52YWx1ZV07XG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IHQgPSBvcDsgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSA0OiBfLmxhYmVsKys7IHJldHVybiB7IHZhbHVlOiBvcFsxXSwgZG9uZTogZmFsc2UgfTtcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XG4gICAgICAgICAgICAgICAgY2FzZSA3OiBvcCA9IF8ub3BzLnBvcCgpOyBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDMgJiYgKCF0IHx8IChvcFsxXSA+IHRbMF0gJiYgb3BbMV0gPCB0WzNdKSkpIHsgXy5sYWJlbCA9IG9wWzFdOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAob3BbMF0gPT09IDYgJiYgXy5sYWJlbCA8IHRbMV0pIHsgXy5sYWJlbCA9IHRbMV07IHQgPSBvcDsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodFsyXSkgXy5vcHMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIF8udHJ5cy5wb3AoKTsgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBvcCA9IGJvZHkuY2FsbCh0aGlzQXJnLCBfKTtcbiAgICAgICAgfSBjYXRjaCAoZSkgeyBvcCA9IFs2LCBlXTsgeSA9IDA7IH0gZmluYWxseSB7IGYgPSB0ID0gMDsgfVxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcbiAgICB9XG59O1xudmFyIF90aGlzID0gdGhpcztcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIFNraWxsXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbFwiKTtcbnZhciBTa2lsbHNfMSA9IHJlcXVpcmUoXCIuLi9EYXRhL1NraWxsc1wiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICBjcmVhdGVTa2lsbHMoU2tpbGxzXzEuU2tpbGxzKTtcbn0pO1xudmFyIGNyZWF0ZVNraWxscyA9IGZ1bmN0aW9uIChza2lsbHNEYXRhKSB7XG4gICAgU2tpbGxfMS5Ta2lsbC5pbml0aWFsaXplKCkudGhlbihmdW5jdGlvbiAoZG9uZSkgeyByZXR1cm4gX19hd2FpdGVyKF90aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgc2tpbGwsIGVsZW1lbnQsIF9pLCBza2lsbHNEYXRhXzEsIGRhdGE7XG4gICAgICAgIHJldHVybiBfX2dlbmVyYXRvcih0aGlzLCBmdW5jdGlvbiAoX2EpIHtcbiAgICAgICAgICAgIHN3aXRjaCAoX2EubGFiZWwpIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgXCJDb3VsZCBub3QgaW5pdGlhbGl6ZSBTa2lsbHMgb2JqZWN0LlwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF9pID0gMCwgc2tpbGxzRGF0YV8xID0gc2tpbGxzRGF0YTtcbiAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAxO1xuICAgICAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICAgICAgaWYgKCEoX2kgPCBza2lsbHNEYXRhXzEubGVuZ3RoKSkgcmV0dXJuIFszLCA0XTtcbiAgICAgICAgICAgICAgICAgICAgZGF0YSA9IHNraWxsc0RhdGFfMVtfaV07XG4gICAgICAgICAgICAgICAgICAgIHNraWxsID0gbmV3IFNraWxsXzEuU2tpbGwoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbNCwgc2tpbGwuY3JlYXRlRWxlbWVudCgpXTtcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBfYS5zZW50KCk7XG4gICAgICAgICAgICAgICAgICAgIFdlYlBhZ2VfMS5Ta2lsbHNHcmlkLmFwcGVuZENoaWxkKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICBfYS5sYWJlbCA9IDM7XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICBfaSsrO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzMsIDFdO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogcmV0dXJuIFsyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7IH0pO1xufTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTTtcbihmdW5jdGlvbiAoRE9NKSB7XG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudHMocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpO1xuICAgIH1cbiAgICBET00uZ2V0RWxlbWVudHMgPSBnZXRFbGVtZW50cztcbiAgICBmdW5jdGlvbiBnZXRGaXJzdEVsZW1lbnQocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudHMocXVlcnkpWzBdO1xuICAgIH1cbiAgICBET00uZ2V0Rmlyc3RFbGVtZW50ID0gZ2V0Rmlyc3RFbGVtZW50O1xuICAgIGZ1bmN0aW9uIGdldFZpZXdwb3J0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVpZ2h0OiB3aW5kb3cuaW5uZXJIZWlnaHQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOiB3aW5kb3cuaW5uZXJXaWR0aCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGhcbiAgICAgICAgfTtcbiAgICB9XG4gICAgRE9NLmdldFZpZXdwb3J0ID0gZ2V0Vmlld3BvcnQ7XG4gICAgZnVuY3Rpb24gc2Nyb2xsVG8oeCwgeSkge1xuICAgICAgICB3aW5kb3cuc2Nyb2xsVG8oe1xuICAgICAgICAgICAgdG9wOiB5LFxuICAgICAgICAgICAgbGVmdDogeCxcbiAgICAgICAgICAgIGJlaGF2aW9yOiAnc21vb3RoJ1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgRE9NLnNjcm9sbFRvID0gc2Nyb2xsVG87XG4gICAgZnVuY3Rpb24gaXNJRSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50Lm1hdGNoKC8oTVNJRXxUcmlkZW50KS8pICE9PSBudWxsO1xuICAgIH1cbiAgICBET00uaXNJRSA9IGlzSUU7XG4gICAgZnVuY3Rpb24gbG9hZCgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShkb2N1bWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgY2FsbGJhY2tfMSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGNhbGxiYWNrXzEpO1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGRvY3VtZW50KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFja18xKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIERPTS5sb2FkID0gbG9hZDtcbn0pKERPTSA9IGV4cG9ydHMuRE9NIHx8IChleHBvcnRzLkRPTSA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBFdmVudHM7XG4oZnVuY3Rpb24gKEV2ZW50cykge1xuICAgIHZhciBOZXdFdmVudCA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIE5ld0V2ZW50KG5hbWUsIGRldGFpbCkge1xuICAgICAgICAgICAgaWYgKGRldGFpbCA9PT0gdm9pZCAwKSB7IGRldGFpbCA9IG51bGw7IH1cbiAgICAgICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgICAgICAgICB0aGlzLmRldGFpbCA9IGRldGFpbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTmV3RXZlbnQ7XG4gICAgfSgpKTtcbiAgICBFdmVudHMuTmV3RXZlbnQgPSBOZXdFdmVudDtcbiAgICB2YXIgRXZlbnREaXNwYXRjaGVyID0gKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZnVuY3Rpb24gRXZlbnREaXNwYXRjaGVyKCkge1xuICAgICAgICAgICAgdGhpcy5ldmVudHMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgfVxuICAgICAgICBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnJlZ2lzdGVyID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmFkZChuYW1lKTtcbiAgICAgICAgfTtcbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS51bnJlZ2lzdGVyID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzLmRlbGV0ZShuYW1lKTtcbiAgICAgICAgfTtcbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoZWxlbWVudCwgY2FsbGJhY2spIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLnNldChlbGVtZW50LCBjYWxsYmFjayk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudW5zdWJzY3JpYmUgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMuZGVsZXRlKGVsZW1lbnQpO1xuICAgICAgICB9O1xuICAgICAgICBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLmRpc3BhdGNoID0gZnVuY3Rpb24gKG5hbWUsIGRldGFpbCkge1xuICAgICAgICAgICAgaWYgKGRldGFpbCA9PT0gdm9pZCAwKSB7IGRldGFpbCA9IG51bGw7IH1cbiAgICAgICAgICAgIGlmICghdGhpcy5ldmVudHMuaGFzKG5hbWUpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGV2ZW50ID0gbmV3IE5ld0V2ZW50KG5hbWUsIGRldGFpbCk7XG4gICAgICAgICAgICB2YXIgaXQgPSB0aGlzLmxpc3RlbmVycy52YWx1ZXMoKTtcbiAgICAgICAgICAgIHZhciBjYWxsYmFjaztcbiAgICAgICAgICAgIHdoaWxlIChjYWxsYmFjayA9IGl0Lm5leHQoKS52YWx1ZSkge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gRXZlbnREaXNwYXRjaGVyO1xuICAgIH0oKSk7XG4gICAgRXZlbnRzLkV2ZW50RGlzcGF0Y2hlciA9IEV2ZW50RGlzcGF0Y2hlcjtcbn0pKEV2ZW50cyA9IGV4cG9ydHMuRXZlbnRzIHx8IChleHBvcnRzLkV2ZW50cyA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBTVkc7XG4oZnVuY3Rpb24gKFNWRykge1xuICAgIFNWRy5zdmducyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG4gICAgU1ZHLnhsaW5rbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc7XG4gICAgU1ZHLmxvYWRTVkcgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwgKyBcIi5zdmdcIiwgdHJ1ZSk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgICAgICAgICAgIHZhciBwYXJzZWREb2N1bWVudCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmVxdWVzdC5yZXNwb25zZVRleHQsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShwYXJzZWREb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlamVjdChcIkZhaWxlZCB0byByZWFkIFNWRy5cIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG59KShTVkcgPSBleHBvcnRzLlNWRyB8fCAoZXhwb3J0cy5TVkcgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi9ET01cIik7XG52YXIgU2VjdGlvbl8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvU2VjdGlvblwiKTtcbnZhciBNZW51XzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9NZW51XCIpO1xuZXhwb3J0cy5NYWluID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnbWFpbicpO1xuZXhwb3J0cy5NYWluU2Nyb2xsID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnbWFpbiAuc2Nyb2xsJyk7XG5leHBvcnRzLlNjcm9sbEhvb2sgPSBET01fMS5ET00uaXNJRSgpID8gd2luZG93IDogZXhwb3J0cy5NYWluU2Nyb2xsO1xuZXhwb3J0cy5Mb2dvID0ge1xuICAgIE91dGVyOiBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdoZWFkZXIubG9nbyAuaW1hZ2UgaW1nLm91dGVyJyksXG4gICAgSW5uZXI6IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5sb2dvIC5pbWFnZSBpbWcuaW5uZXInKVxufTtcbmV4cG9ydHMuQ2FudmFzVGV4dCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2Rpdi5jYW52YXMgZGl2LmNhbnZhcy10ZXh0LWNvbnRhaW5lcicpO1xuZXhwb3J0cy5NZW51QnV0dG9uID0gbmV3IE1lbnVfMS5NZW51KCk7XG5leHBvcnRzLlNlY3Rpb25zID0gbmV3IE1hcCgpO1xuZm9yICh2YXIgX2kgPSAwLCBfYSA9IEFycmF5LmZyb20oRE9NXzEuRE9NLmdldEVsZW1lbnRzKCdzZWN0aW9uJykpOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgIHZhciBlbGVtZW50ID0gX2FbX2ldO1xuICAgIGV4cG9ydHMuU2VjdGlvbnMuc2V0KGVsZW1lbnQuaWQsIG5ldyBTZWN0aW9uXzEuZGVmYXVsdChlbGVtZW50KSk7XG59XG5leHBvcnRzLlNlY3Rpb25Ub01lbnUgPSBuZXcgTWFwKCk7XG5mb3IgKHZhciBfYiA9IDAsIF9jID0gQXJyYXkuZnJvbShET01fMS5ET00uZ2V0RWxlbWVudHMoJ2hlYWRlci5uYXZpZ2F0aW9uIC5zZWN0aW9ucyBhJykpOyBfYiA8IF9jLmxlbmd0aDsgX2IrKykge1xuICAgIHZhciBhbmNob3IgPSBfY1tfYl07XG4gICAgdmFyIGlkID0gYW5jaG9yLmdldEF0dHJpYnV0ZSgnaHJlZicpLnN1YnN0cigxKTtcbiAgICBpZiAoZXhwb3J0cy5TZWN0aW9ucy5nZXQoaWQpICYmIGV4cG9ydHMuU2VjdGlvbnMuZ2V0KGlkKS5pbk1lbnUoKSkge1xuICAgICAgICBleHBvcnRzLlNlY3Rpb25Ub01lbnUuc2V0KGlkLCBbZXhwb3J0cy5TZWN0aW9ucy5nZXQoaWQpLCBhbmNob3JdKTtcbiAgICB9XG59XG5leHBvcnRzLkZsYXZvclRleHQgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI2Fib3V0IC5mbGF2b3InKTtcbmV4cG9ydHMuUXVhbGl0aWVzQ29udGFpbmVyID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnc2VjdGlvbiNhYm91dCAucXVhbGl0aWVzJyk7XG5leHBvcnRzLlNraWxsc0dyaWQgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI3NraWxscyAuaGV4LWdyaWQnKTtcbmV4cG9ydHMuRXhwZXJpZW5jZVNlY3Rpb24gPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI2V4cGVyaWVuY2UnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQW5pbWF0aW9uKHNwZWVkLCBtYXgsIG1pbiwgaW5jcmVhc2luZykge1xuICAgICAgICBpZiAoaW5jcmVhc2luZyA9PT0gdm9pZCAwKSB7IGluY3JlYXNpbmcgPSBmYWxzZTsgfVxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgICAgIHRoaXMubWF4ID0gbWF4O1xuICAgICAgICB0aGlzLm1pbiA9IG1pbjtcbiAgICAgICAgdGhpcy5pbmNyZWFzaW5nID0gaW5jcmVhc2luZztcbiAgICB9XG4gICAgcmV0dXJuIEFuaW1hdGlvbjtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBBbmltYXRpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb25GcmFtZUZ1bmN0aW9ucztcbihmdW5jdGlvbiAoQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMpIHtcbiAgICBmdW5jdGlvbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG4gICAgICAgICAgICB9O1xuICAgIH1cbiAgICBBbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgZnVuY3Rpb24gY2FuY2VsQW5pbWF0aW9uRnJhbWUoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0O1xuICAgIH1cbiAgICBBbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xufSkoQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgPSBleHBvcnRzLkFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zIHx8IChleHBvcnRzLkFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENvbG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb2xvcihyLCBnLCBiKSB7XG4gICAgICAgIHRoaXMuciA9IHI7XG4gICAgICAgIHRoaXMuZyA9IGc7XG4gICAgICAgIHRoaXMuYiA9IGI7XG4gICAgfVxuICAgIENvbG9yLmZyb21SR0IgPSBmdW5jdGlvbiAociwgZywgYikge1xuICAgICAgICBpZiAociA+PSAwICYmIHIgPCAyNTYgJiYgZyA+PSAwICYmIGcgPCAyNTYgJiYgYiA+PSAwICYmIGIgPCAyNTYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IociwgZywgYik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ29sb3IuZnJvbU9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIENvbG9yLmZyb21SR0Iob2JqLnIsIG9iai5nLCBvYmouYik7XG4gICAgfTtcbiAgICBDb2xvci5mcm9tSGV4ID0gZnVuY3Rpb24gKGhleCkge1xuICAgICAgICByZXR1cm4gQ29sb3IuZnJvbU9iamVjdChDb2xvci5oZXhUb1JHQihoZXgpKTtcbiAgICB9O1xuICAgIENvbG9yLmhleFRvUkdCID0gZnVuY3Rpb24gKGhleCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gL14jKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxuICAgICAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXG4gICAgICAgICAgICBiOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxuICAgICAgICB9IDogbnVsbDtcbiAgICB9O1xuICAgIENvbG9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChvcGFjaXR5KSB7XG4gICAgICAgIGlmIChvcGFjaXR5ID09PSB2b2lkIDApIHsgb3BhY2l0eSA9IDE7IH1cbiAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIHRoaXMuciArIFwiLFwiICsgdGhpcy5nICsgXCIsXCIgKyB0aGlzLmIgKyBcIixcIiArIG9wYWNpdHkgKyBcIilcIjtcbiAgICB9O1xuICAgIHJldHVybiBDb2xvcjtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb2xvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENvb3JkaW5hdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvb3JkaW5hdGUoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBDb29yZGluYXRlLnByb3RvdHlwZS5kaXN0YW5jZSA9IGZ1bmN0aW9uIChjb29yZCkge1xuICAgICAgICB2YXIgZHggPSBjb29yZC54IC0gdGhpcy54O1xuICAgICAgICB2YXIgZHkgPSBjb29yZC55IC0gdGhpcy55O1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICB9O1xuICAgIENvb3JkaW5hdGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54ICsgXCJ4XCIgKyB0aGlzLnk7XG4gICAgfTtcbiAgICByZXR1cm4gQ29vcmRpbmF0ZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb29yZGluYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb25fMSA9IHJlcXVpcmUoXCIuL0FuaW1hdGlvblwiKTtcbnZhciBDb2xvcl8xID0gcmVxdWlyZShcIi4vQ29sb3JcIik7XG52YXIgQ29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vQ29vcmRpbmF0ZVwiKTtcbnZhciBTdHJva2VfMSA9IHJlcXVpcmUoXCIuL1N0cm9rZVwiKTtcbnZhciBWZWN0b3JfMSA9IHJlcXVpcmUoXCIuL1ZlY3RvclwiKTtcbnZhciBQYXJ0aWNsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGFydGljbGUoc2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy5vcGFjaXR5QW5pbWF0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5yYWRpdXNBbmltYXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmNvbG9yID0gdGhpcy5jcmVhdGVDb2xvcihzZXR0aW5ncy5jb2xvcik7XG4gICAgICAgIHRoaXMub3BhY2l0eSA9IHRoaXMuY3JlYXRlT3BhY2l0eShzZXR0aW5ncy5vcGFjaXR5KTtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IHRoaXMuY3JlYXRlVmVsb2NpdHkoc2V0dGluZ3MubW92ZSk7XG4gICAgICAgIHRoaXMuc2hhcGUgPSB0aGlzLmNyZWF0ZVNoYXBlKHNldHRpbmdzLnNoYXBlKTtcbiAgICAgICAgdGhpcy5zdHJva2UgPSB0aGlzLmNyZWF0ZVN0cm9rZShzZXR0aW5ncy5zdHJva2UpO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHRoaXMuY3JlYXRlUmFkaXVzKHNldHRpbmdzLnJhZGl1cyk7XG4gICAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRlKSB7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYW5pbWF0ZS5vcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGFjaXR5QW5pbWF0aW9uID0gdGhpcy5hbmltYXRlT3BhY2l0eShzZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmFuaW1hdGUucmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yYWRpdXNBbmltYXRpb24gPSB0aGlzLmFuaW1hdGVSYWRpdXMoc2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnViYmxlZCA9IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICByYWRpdXM6IDBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZUNvbG9yID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoY29sb3IgPT09ICdyYW5kb20nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbG9yXzEuZGVmYXVsdC5mcm9tUkdCKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NiksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NiksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbG9yXzEuZGVmYXVsdC5mcm9tSGV4KGNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgY29sb3IgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvcl8xLmRlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb2xvciBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQ29sb3IoY29sb3JbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29sb3IubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbG9yXzEuZGVmYXVsdC5mcm9tT2JqZWN0KGNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21SR0IoMCwgMCwgMCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlT3BhY2l0eSA9IGZ1bmN0aW9uIChvcGFjaXR5KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3BhY2l0eSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChvcGFjaXR5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVPcGFjaXR5KG9wYWNpdHlbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BhY2l0eS5sZW5ndGgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9wYWNpdHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAob3BhY2l0eSA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChvcGFjaXR5ID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BhY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVWZWxvY2l0eSA9IGZ1bmN0aW9uIChtb3ZlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbW92ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBpZiAoIW1vdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG1vdmUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgdmVsb2NpdHkgPSB2b2lkIDA7XG4gICAgICAgICAgICBzd2l0Y2ggKG1vdmUuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RvcC1yaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMC43LCAtMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDEsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20tcmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAuNywgMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYm90dG9tLWxlZnQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KC0wLjcsIDAuNyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KC0xLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wLWxlZnQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KC0wLjcsIC0wLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb3ZlLnN0cmFpZ2h0KSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmUucmFuZG9tKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5LnggKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkueSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZlbG9jaXR5LnggKz0gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eS55ICs9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmVsb2NpdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDApO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZVNoYXBlID0gZnVuY3Rpb24gKHNoYXBlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2hhcGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAoc2hhcGUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVNoYXBlKHNoYXBlW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNoYXBlLmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygc2hhcGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YXIgc2lkZXMgPSBwYXJzZUludChzaGFwZS5zdWJzdHJpbmcoMCwgc2hhcGUuaW5kZXhPZignLScpKSk7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKHNpZGVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVNoYXBlKHNpZGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzaGFwZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygc2hhcGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAoc2hhcGUgPj0gMykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzaGFwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ2NpcmNsZSc7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlU3Ryb2tlID0gZnVuY3Rpb24gKHN0cm9rZSkge1xuICAgICAgICBpZiAodHlwZW9mIHN0cm9rZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3Ryb2tlLndpZHRoID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIGlmIChzdHJva2Uud2lkdGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3Ryb2tlXzEuZGVmYXVsdChzdHJva2Uud2lkdGgsIHRoaXMuY3JlYXRlQ29sb3Ioc3Ryb2tlLmNvbG9yKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgU3Ryb2tlXzEuZGVmYXVsdCgwLCBDb2xvcl8xLmRlZmF1bHQuZnJvbVJHQigwLCAwLCAwKSk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlUmFkaXVzID0gZnVuY3Rpb24gKHJhZGl1cykge1xuICAgICAgICBpZiAodHlwZW9mIHJhZGl1cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChyYWRpdXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVJhZGl1cyhyYWRpdXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFkaXVzLmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcmFkaXVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKHJhZGl1cyA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcmFkaXVzID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKHJhZGl1cyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhZGl1cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gNTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5wYXJzZVNwZWVkID0gZnVuY3Rpb24gKHNwZWVkKSB7XG4gICAgICAgIGlmIChzcGVlZCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBzcGVlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMC41O1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmFuaW1hdGVPcGFjaXR5ID0gZnVuY3Rpb24gKGFuaW1hdGlvbikge1xuICAgICAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICB2YXIgbWF4ID0gdGhpcy5vcGFjaXR5O1xuICAgICAgICAgICAgdmFyIG1pbiA9IHRoaXMuY3JlYXRlT3BhY2l0eShhbmltYXRpb24ubWluKTtcbiAgICAgICAgICAgIHZhciBzcGVlZCA9IHRoaXMucGFyc2VTcGVlZChhbmltYXRpb24uc3BlZWQpIC8gMTAwO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb24uc3luYykge1xuICAgICAgICAgICAgICAgIHNwZWVkICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9wYWNpdHkgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW5pbWF0aW9uXzEuZGVmYXVsdChzcGVlZCwgbWF4LCBtaW4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmFuaW1hdGVSYWRpdXMgPSBmdW5jdGlvbiAoYW5pbWF0aW9uKSB7XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICAgIHZhciBtYXggPSB0aGlzLnJhZGl1cztcbiAgICAgICAgICAgIHZhciBtaW4gPSB0aGlzLmNyZWF0ZVJhZGl1cyhhbmltYXRpb24ubWluKTtcbiAgICAgICAgICAgIHZhciBzcGVlZCA9IHRoaXMucGFyc2VTcGVlZChhbmltYXRpb24uc3BlZWQpIC8gMTAwO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb24uc3luYykge1xuICAgICAgICAgICAgICAgIHNwZWVkICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9wYWNpdHkgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW5pbWF0aW9uXzEuZGVmYXVsdChzcGVlZCwgbWF4LCBtaW4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKHNwZWVkKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnggKiBzcGVlZDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueSAqIHNwZWVkO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmdldFJhZGl1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFkaXVzICsgdGhpcy5idWJibGVkLnJhZGl1cztcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5nZXRPcGFjaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGFjaXR5ICsgdGhpcy5idWJibGVkLm9wYWNpdHk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZWRnZSA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICAgICAgc3dpdGNoIChkaXIpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSAtIHRoaXMuZ2V0UmFkaXVzKCkpO1xuICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQodGhpcy5wb3NpdGlvbi54ICsgdGhpcy5nZXRSYWRpdXMoKSwgdGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSArIHRoaXMuZ2V0UmFkaXVzKCkpO1xuICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLnggLSB0aGlzLmdldFJhZGl1cygpLCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmludGVyc2VjdGluZyA9IGZ1bmN0aW9uIChwYXJ0aWNsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5kaXN0YW5jZShwYXJ0aWNsZS5wb3NpdGlvbikgPCB0aGlzLmdldFJhZGl1cygpICsgcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYnViYmxlID0gZnVuY3Rpb24gKG1vdXNlLCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSB0aGlzLnBvc2l0aW9uLmRpc3RhbmNlKG1vdXNlLnBvc2l0aW9uKTtcbiAgICAgICAgdmFyIHJhdGlvID0gMSAtIGRpc3RhbmNlIC8gc2V0dGluZ3MuZGlzdGFuY2U7XG4gICAgICAgIGlmIChyYXRpbyA+PSAwICYmIG1vdXNlLm92ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYnViYmxlZC5vcGFjaXR5ID0gcmF0aW8gKiAoc2V0dGluZ3Mub3BhY2l0eSAtIHRoaXMub3BhY2l0eSk7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQucmFkaXVzID0gcmF0aW8gKiAoc2V0dGluZ3MucmFkaXVzIC0gdGhpcy5yYWRpdXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLnJhZGl1cyA9IDA7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBQYXJ0aWNsZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBQYXJ0aWNsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMSA9IHJlcXVpcmUoXCIuL0FuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXCIpO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIENvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL0Nvb3JkaW5hdGVcIik7XG52YXIgUGFydGljbGVfMSA9IHJlcXVpcmUoXCIuL1BhcnRpY2xlXCIpO1xudmFyIFBhcnRpY2xlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGFydGljbGVzKGNzc1F1ZXJ5LCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAnc3RvcHBlZCc7XG4gICAgICAgIHRoaXMucGl4ZWxSYXRpb0xpbWl0ID0gODtcbiAgICAgICAgdGhpcy5waXhlbFJhdGlvID0gMTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgdGhpcy5tb3VzZSA9IHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoMCwgMCksXG4gICAgICAgICAgICBvdmVyOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KGNzc1F1ZXJ5KTtcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNhbnZhcyBJRCBcIiArIGNzc1F1ZXJ5ICsgXCIgbm90IGZvdW5kLlwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChjb250ZXh0KTtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXzEuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCk7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXzEuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMuY2FuY2VsQW5pbWF0aW9uRnJhbWUoKTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzID0ge1xuICAgICAgICAgICAgbnVtYmVyOiAzNTAsXG4gICAgICAgICAgICBkZW5zaXR5OiAxMDAwLFxuICAgICAgICAgICAgY29sb3I6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICByYWRpdXM6IDUsXG4gICAgICAgICAgICBzaGFwZTogJ2NpcmNsZScsXG4gICAgICAgICAgICBzdHJva2U6IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW92ZToge1xuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjQsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAnYm90dG9tJyxcbiAgICAgICAgICAgICAgICBzdHJhaWdodDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByYW5kb206IHRydWUsXG4gICAgICAgICAgICAgICAgZWRnZUJvdW5jZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXR0cmFjdDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgICByZXNpemU6IHRydWUsXG4gICAgICAgICAgICAgICAgaG92ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNsaWNrOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGU6IHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByYWRpdXM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICAgICAgYnViYmxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiA3NSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA3LFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXB1bHNlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAxMDAsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsaWNrOiB7XG4gICAgICAgICAgICAgICAgYWRkOiB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlcjogNFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVtb3ZlOiB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlcjogMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRyYWNrTW91c2UoKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+PSB0aGlzLnBpeGVsUmF0aW9MaW1pdCA/IHRoaXMucGl4ZWxSYXRpb0xpbWl0IC0gMiA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgdGhpcy5zZXRDYW52YXNTaXplKCk7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVQYXJ0aWNsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgdGhpcy5kaXN0cmlidXRlUGFydGljbGVzKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnRyYWNrTW91c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuaG92ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2UucG9zaXRpb24ueCA9IGV2ZW50Lm9mZnNldFggKiBfdGhpcy5waXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi55ID0gZXZlbnQub2Zmc2V0WSAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLm92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi55ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2Uub3ZlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuY2xpY2spIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQgPSB0cnVlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5pbml0aWFsaXplUGl4ZWxSYXRpbyA9IGZ1bmN0aW9uIChuZXdSYXRpbykge1xuICAgICAgICBpZiAobmV3UmF0aW8gPT09IHZvaWQgMCkgeyBuZXdSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvOyB9XG4gICAgICAgIHZhciBtdWx0aXBsaWVyID0gbmV3UmF0aW8gLyB0aGlzLnBpeGVsUmF0aW87XG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCAqIG11bHRpcGxpZXI7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0ICogbXVsdGlwbGllcjtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyA9IHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMubWFwKGZ1bmN0aW9uIChyKSB7IHJldHVybiByICogbXVsdGlwbGllcjsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuc3BlZWQgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUgJiYgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUucmFkaXVzKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMuc3BlZWQgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5idWJibGUucmFkaXVzICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZS5kaXN0YW5jZSAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5yZXB1bHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLnJlcHVsc2UuZGlzdGFuY2UgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBpeGVsUmF0aW8gPSBuZXdSYXRpbztcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuY2hlY2tab29tID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8gIT09IHRoaXMucGl4ZWxSYXRpbyAmJiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA8IHRoaXMucGl4ZWxSYXRpb0xpbWl0KSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BEcmF3aW5nKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldENhbnZhc1NpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzICYmIHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMucmVzaXplKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaGVja1pvb20oKTtcbiAgICAgICAgICAgICAgICBfdGhpcy53aWR0aCA9IF90aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgX3RoaXMuaGVpZ2h0ID0gX3RoaXMuY2FudmFzLm9mZnNldEhlaWdodCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FudmFzLndpZHRoID0gX3RoaXMud2lkdGg7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FudmFzLmhlaWdodCA9IF90aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICBpZiAoIV90aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZW1vdmVQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY3JlYXRlUGFydGljbGVzKCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRyYXdQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMuZGlzdHJpYnV0ZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZ2V0RmlsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LmZpbGxTdHlsZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0U3Ryb2tlID0gZnVuY3Rpb24gKHN0cm9rZSkge1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZS5jb2xvci50b1N0cmluZygpO1xuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBzdHJva2Uud2lkdGg7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZHJhd1BhcnRpY2xlcygpO1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0b3BEcmF3aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5oYW5kbGVSZXNpemUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQb2x5Z29uID0gZnVuY3Rpb24gKGNlbnRlciwgcmFkaXVzLCBzaWRlcykge1xuICAgICAgICB2YXIgZGlhZ29uYWxBbmdsZSA9IDM2MCAvIHNpZGVzO1xuICAgICAgICBkaWFnb25hbEFuZ2xlICo9IE1hdGguUEkgLyAxODA7XG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZShjZW50ZXIueCwgY2VudGVyLnkpO1xuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoZGlhZ29uYWxBbmdsZSAvIChzaWRlcyAlIDIgPyA0IDogMikpO1xuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8ocmFkaXVzLCAwKTtcbiAgICAgICAgdmFyIGFuZ2xlO1xuICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IHNpZGVzOyBzKyspIHtcbiAgICAgICAgICAgIGFuZ2xlID0gcyAqIGRpYWdvbmFsQW5nbGU7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8ocmFkaXVzICogTWF0aC5jb3MoYW5nbGUpLCByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kcmF3UGFydGljbGUgPSBmdW5jdGlvbiAocGFydGljbGUpIHtcbiAgICAgICAgdmFyIG9wYWNpdHkgPSBwYXJ0aWNsZS5nZXRPcGFjaXR5KCk7XG4gICAgICAgIHZhciByYWRpdXMgPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgdGhpcy5zZXRGaWxsKHBhcnRpY2xlLmNvbG9yLnRvU3RyaW5nKG9wYWNpdHkpKTtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmICh0eXBlb2YgKHBhcnRpY2xlLnNoYXBlKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1BvbHlnb24ocGFydGljbGUucG9zaXRpb24sIHJhZGl1cywgcGFydGljbGUuc2hhcGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoIChwYXJ0aWNsZS5zaGFwZSkge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdHguYXJjKHBhcnRpY2xlLnBvc2l0aW9uLngsIHBhcnRpY2xlLnBvc2l0aW9uLnksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGlmIChwYXJ0aWNsZS5zdHJva2Uud2lkdGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0cm9rZShwYXJ0aWNsZS5zdHJva2UpO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5nZXROZXdQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdChNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXMud2lkdGgsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLmVkZ2VCb3VuY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPCAwKVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ICs9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA+IHRoaXMud2lkdGgpXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggLT0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3RvcCcpLnkgPCAwKVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ICs9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPiB0aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSAtPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZGlzdHJpYnV0ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5kZW5zaXR5ICYmIHR5cGVvZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHkpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIGFyZWEgPSB0aGlzLmNhbnZhcy53aWR0aCAqIHRoaXMuY2FudmFzLmhlaWdodCAvIDEwMDA7XG4gICAgICAgICAgICBhcmVhIC89IHRoaXMucGl4ZWxSYXRpbyAqIDI7XG4gICAgICAgICAgICB2YXIgcGFydGljbGVzUGVyQXJlYSA9IGFyZWEgKiB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubnVtYmVyIC8gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHk7XG4gICAgICAgICAgICB2YXIgbWlzc2luZyA9IHBhcnRpY2xlc1BlckFyZWEgLSB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobWlzc2luZyA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVBhcnRpY2xlcyhtaXNzaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlUGFydGljbGVzKE1hdGguYWJzKG1pc3NpbmcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jcmVhdGVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAobnVtYmVyLCBwb3NpdGlvbikge1xuICAgICAgICBpZiAobnVtYmVyID09PSB2b2lkIDApIHsgbnVtYmVyID0gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm51bWJlcjsgfVxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHZvaWQgMCkgeyBwb3NpdGlvbiA9IG51bGw7IH1cbiAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlU2V0dGluZ3MpXG4gICAgICAgICAgICB0aHJvdyAnUGFydGljbGUgc2V0dGluZ3MgbXVzdCBiZSBpbml0YWxpemVkIGJlZm9yZSBhIHBhcnRpY2xlIGlzIGNyZWF0ZWQuJztcbiAgICAgICAgdmFyIHBhcnRpY2xlO1xuICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IG51bWJlcjsgcCsrKSB7XG4gICAgICAgICAgICBwYXJ0aWNsZSA9IG5ldyBQYXJ0aWNsZV8xLmRlZmF1bHQodGhpcy5wYXJ0aWNsZVNldHRpbmdzKTtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24odGhpcy5nZXROZXdQb3NpdGlvbigpKTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlICghdGhpcy5jaGVja1Bvc2l0aW9uKHBhcnRpY2xlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5yZW1vdmVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPT09IHZvaWQgMCkgeyBudW1iZXIgPSBudWxsOyB9XG4gICAgICAgIGlmICghbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMuc3BsaWNlKDAsIG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUudXBkYXRlUGFydGljbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5wYXJ0aWNsZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFydGljbGUgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZS5tb3ZlKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLnNwZWVkKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLmVkZ2VCb3VuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLndpZHRoICsgcGFydGljbGUuZ2V0UmFkaXVzKCksIE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ2xlZnQnKS54ID4gdGhpcy53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KC0xICogcGFydGljbGUuZ2V0UmFkaXVzKCksIE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdib3R0b20nKS55IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCArIHBhcnRpY2xlLmdldFJhZGl1cygpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgndG9wJykueSA+IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGgsIC0xICogcGFydGljbGUuZ2V0UmFkaXVzKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPCAwIHx8IHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnZlbG9jaXR5LmZsaXAodHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCd0b3AnKS55IDwgMCB8fCBwYXJ0aWNsZS5lZGdlKCdib3R0b20nKS55ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnZlbG9jaXR5LmZsaXAoZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPj0gcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPD0gcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eSArPSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLnNwZWVkICogKHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA/IDEgOiAtMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5vcGFjaXR5IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLnJhZGl1cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUucmFkaXVzID49IHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUucmFkaXVzIDw9IHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5yYWRpdXMgKz0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLnNwZWVkICogKHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID8gMSA6IC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLnJhZGl1cyA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1cyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzLmhvdmVyID09PSAnYnViYmxlJyAmJiB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIgJiYgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5idWJibGUodGhpcy5tb3VzZSwgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQYXJ0aWNsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMucGFydGljbGVzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gX2FbX2ldO1xuICAgICAgICAgICAgdGhpcy5kcmF3UGFydGljbGUocGFydGljbGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldFBhcnRpY2xlU2V0dGluZ3MgPSBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09ICdzdG9wcGVkJykge1xuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjaGFuZ2Ugc2V0dGluZ3Mgd2hpbGUgQ2FudmFzIGlzIHJ1bm5pbmcuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldEludGVyYWN0aXZlU2V0dGluZ3MgPSBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09ICdzdG9wcGVkJykge1xuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjaGFuZ2Ugc2V0dGluZ3Mgd2hpbGUgQ2FudmFzIGlzIHJ1bm5pbmcuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgJ1BhcnRpY2xlIHNldHRpbmdzIG11c3QgYmUgaW5pdGFsaXplZCBiZWZvcmUgQ2FudmFzIGNhbiBzdGFydC4nO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ3N0b3BwZWQnKVxuICAgICAgICAgICAgdGhyb3cgJ0NhbnZhcyBpcyBhbHJlYWR5IHJ1bm5pbmcuJztcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdydW5uaW5nJztcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09ICdzdG9wcGVkJykge1xuICAgICAgICAgICAgdGhyb3cgJ05vIFBhcnRpY2xlcyB0byBwYXVzZS4nO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUgPSAncGF1c2VkJztcbiAgICAgICAgdGhpcy5tb3ZlU2V0dGluZ3MgPSB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUgPSBmYWxzZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnTm8gUGFydGljbGVzIHRvIHJlc3VtZS4nO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUgPSAncnVubmluZyc7XG4gICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlID0gdGhpcy5tb3ZlU2V0dGluZ3M7XG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gJ3N0b3BwZWQnO1xuICAgICAgICB0aGlzLnN0b3BEcmF3aW5nKCk7XG4gICAgfTtcbiAgICByZXR1cm4gUGFydGljbGVzO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBhcnRpY2xlcztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFN0cm9rZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3Ryb2tlKHdpZHRoLCBjb2xvcikge1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG4gICAgcmV0dXJuIFN0cm9rZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTdHJva2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBWZWN0b3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFZlY3Rvcih4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIFZlY3Rvci5wcm90b3R5cGUuZmxpcCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIGlmICh4ID09PSB2b2lkIDApIHsgeCA9IHRydWU7IH1cbiAgICAgICAgaWYgKHkgPT09IHZvaWQgMCkgeyB5ID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgdGhpcy54ICo9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmICh5KSB7XG4gICAgICAgICAgICB0aGlzLnkgKj0gLTE7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFZlY3Rvci5wcm90b3R5cGUubWFnbml0dWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCh0aGlzLnggKiB0aGlzLngpICsgKHRoaXMueSAqIHRoaXMueSkpO1xuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5hbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgudGFuKHRoaXMueSAvIHRoaXMueCk7XG4gICAgfTtcbiAgICByZXR1cm4gVmVjdG9yO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFZlY3RvcjtcbiJdfQ==
