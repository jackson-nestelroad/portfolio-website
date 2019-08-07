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
}, {
  capture: true,
  passive: true
});

},{"../Modules/WebPage":149,"../Particles/Particles":157,"./Stars":125,"core-js/modules/es6.object.define-property":107}],125:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
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
      className: "name is-size-4 is-normal-weight is-uppercase is-colored-link"
    }, this.data.company), JSX_1.ElementFactory.createElement("p", {
      className: "location is-size-8 is-italic is-color-light is-normal-weight"
    }, this.data.location)), JSX_1.ElementFactory.createElement("div", {
      className: "role"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "name is-size-6 is-bold-weight"
    }, this.data.position), JSX_1.ElementFactory.createElement("p", {
      className: "date is-size-8 is-italic is-color-light is-normal-weight"
    }, "(" + this.data.begin + " \u2014 " + this.data.end + ")"))), JSX_1.ElementFactory.createElement("hr", null), JSX_1.ElementFactory.createElement("div", {
      className: "content info"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "description is-size-8 is-normal-weight is-color-light is-italic is-justified is-quote"
    }, this.data.flavor), JSX_1.ElementFactory.createElement("ul", {
      className: "job is-left-aligned is-size-7 xs-y-padding-between-1"
    }, this.data.roles.map(function (role) {
      return JSX_1.ElementFactory.createElement("li", null, role);
    })))));
  };

  return Experience;
}();

exports.Experience = Experience;

},{"../../Definitions/JSX":137,"core-js/modules/es6.array.map":101,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.string.link":119}],127:[function(require,module,exports){
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

},{"../../Modules/DOM":146,"../../Modules/EventDispatcher":147,"core-js/modules/es6.object.create":106,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.set-prototype-of":109}],128:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.array.map");

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.function.name");

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var JSX_1 = require("../../Definitions/JSX");

var Project = function () {
  function Project(data) {
    this.element = null;
    this.infoDisplayed = false;
    this.data = data;
    this.createElement();
  }

  Project.prototype.lessInfo = function () {
    this.infoDisplayed = false;
    this.update();
  };

  Project.prototype.toggleInfo = function () {
    this.infoDisplayed = !this.infoDisplayed;
    this.update();
  };

  Project.prototype.getReference = function (ref) {
    return this.element.querySelector("[ref=\"" + ref + "\"]") || null;
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
    this.element = JSX_1.ElementFactory.createElement("div", {
      className: "xs-12 sm-6 md-4"
    }, JSX_1.ElementFactory.createElement("div", {
      className: "project card is-theme-secondary elevation-1 is-in-grid",
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
    }, "Details"), JSX_1.ElementFactory.createElement("button", {
      className: "btn close is-svg is-primary xs-x-self-end",
      tabindex: "-1",
      onClick: this.lessInfo.bind(this)
    }, JSX_1.ElementFactory.createElement("i", {
      className: "fas fa-times"
    }))), JSX_1.ElementFactory.createElement("div", {
      className: "body"
    }, JSX_1.ElementFactory.createElement("ul", {
      className: "details xs-y-padding-between-1 is-size-8"
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
    return this.element;
  };

  return Project;
}();

exports.Project = Project;

},{"../../Definitions/JSX":137,"core-js/modules/es6.array.map":101,"core-js/modules/es6.function.bind":103,"core-js/modules/es6.function.name":104,"core-js/modules/es6.object.define-property":107}],129:[function(require,module,exports){
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
}();

exports.Quality = Quality;

},{"../../Definitions/JSX":137,"core-js/modules/es6.function.name":104,"core-js/modules/es6.object.define-property":107}],130:[function(require,module,exports){
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

},{"../../Modules/DOM":146,"core-js/modules/es6.object.define-property":107}],131:[function(require,module,exports){
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

},{"../../Definitions/JSX":137,"../../Modules/SVG":148,"core-js/modules/es6.function.name":104,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.promise":111}],132:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboutMe = "I am an aspiring web developer and software engineer chasing my passion for working with technology and programming at the University of Texas at Dallas. I crave the opportunity to contribute to meaningful projects that employ my current gifts and interests while also shoving me out of my comfort zone to learn new skills. My goal is to maximize every experience as an opportunity for personal, professional, and technical growth.";

},{"core-js/modules/es6.object.define-property":107}],133:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Experience = [{
  svg: 'medit',
  link: 'http://medit.online',
  company: 'Medit',
  location: 'Dublin, Ireland',
  position: 'Web Application Developer',
  begin: 'May 2019',
  end: 'July 2019',
  flavor: 'Medit is a start-up company committed to making medical education more efficient through their mobile solutions. By combining technology with curated content, practicing professionals are given a quick, unique, and relevant learning experience. I had the opportunity to work as the company\'s first web developer, laying down the essential foundations for a web-based version of their application.',
  roles: ['Architected the initial foundations for a full-scale, single-page web application using Vue, TypeScript, and SASS.', 'Designed an interface-oriented, modularized state management system to work behind the application.', 'Developed a Vue configuration library to enhance the ability to mock application state in unit testing.', 'Estbalished a comprehensive UI component library to accelerate the ability to add new content.']
}, {
  svg: 'lifechurch',
  link: 'http://life.church',
  company: 'Life.Church',
  location: 'Edmond, OK, USA',
  position: 'Information Technology Intern',
  begin: 'May 2018',
  end: 'August 2018',
  flavor: 'Life.Church is a multi-site church with a worldwide impact, centered around their mission to "lead people to become fully-devoted followers of Christ." I worked alongside their Central Information Technology team: a group dedicated to utilizing technology to serve and equip the church.',
  roles: ['Spent time learning from hardware, software, and database teams in an Agile environment.', 'Designed and developed a web application for remote volunteer tracking with Node.js and PostgreSQL.', 'Dynamically deployed application to Google Cloud Platform using Cloud Builds, Docker, and Kubernetes.']
}];

},{"core-js/modules/es6.object.define-property":107}],134:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Projects = [{
  name: 'Portfolio Website',
  color: '#29AB87',
  image: 'portfolio-website.jpg',
  type: 'Side Project',
  date: 'Spring/Fall 2019',
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
  flavor: 'Web and mobile application to make group brainstorming organized and efficient.',
  repo: 'https://github.com/jackson-nestelroad/ponder-hackutd-19',
  external: null,
  details: ['Winner of "Best UI/UX" for HackUTD 2019.', 'Implemented with React and Firebase Realtime Database.', 'Complete connection and realtime updates with mobile counterpart.']
}, {
  name: 'Key Consumer',
  color: '#7A69AD',
  image: 'key-consumer.jpg',
  type: 'Side Project',
  date: 'January 2019',
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
  flavor: 'Self-updating API to collect current weather and Twitter data for the University of Texas at Dallas.',
  repo: 'https://github.com/jackson-nestelroad/comet-climate-server',
  external: null,
  details: ['Implemented with C# and the .NET Core library.', 'Deployed to Heroku with PostgreSQL database.', 'Always returns data less than 10 minutes old.']
}, {
  name: 'Christ-Centered',
  color: '#FE904E',
  image: 'christ-centered.jpg',
  type: 'Side Project',
  date: 'Fall 2018',
  flavor: 'Google Chrome extension to deliver the YouVersion Verse of the Day to your new tab.',
  repo: 'https://github.com/jackson-nestelroad/christ-centered',
  external: 'http://bit.ly/christ-centered',
  details: ['Implemented with React and Chrome API.', 'Custom verse searching by keyword or number.', 'Gives current weather for user\'s location via the OpenWeatherMap API.']
}];

},{"core-js/modules/es6.object.define-property":107}],135:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107}],136:[function(require,module,exports){
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
  name: 'Firebase',
  svg: 'firebase',
  color: '#FFCA28'
}, {
  name: 'Git',
  svg: 'git',
  color: '#F05032'
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
  name: 'Vue.js',
  svg: 'vue',
  color: '#4FC08D'
}];

},{"core-js/modules/es6.object.define-property":107}],137:[function(require,module,exports){
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

},{"core-js/modules/es6.array.is-array":99,"core-js/modules/es6.array.iterator":100,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.keys":108,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.regexp.replace":115,"core-js/modules/es6.string.starts-with":120,"core-js/modules/es6.symbol":121,"core-js/modules/es7.symbol.async-iterator":122,"core-js/modules/web.dom.iterable":123}],138:[function(require,module,exports){
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

},{"../Classes/Elements/Quality":129,"../Data/About":132,"../Data/Qualities":135,"../Modules/DOM":146,"../Modules/WebPage":149,"core-js/modules/es6.object.define-property":107}],139:[function(require,module,exports){
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

},{"../Modules/WebPage":149,"core-js/modules/es6.object.define-property":107}],140:[function(require,module,exports){
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
    ExperienceSection.appendChild(card.createElement());
  }
});

},{"../Classes/Elements/Experience":126,"../Data/Experience":133,"../Modules/DOM":146,"../Modules/WebPage":149,"core-js/modules/es6.object.define-property":107}],141:[function(require,module,exports){
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

},{"../Modules/DOM":146,"../Modules/WebPage":149,"core-js/modules/es6.object.define-property":107}],142:[function(require,module,exports){
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

},{"../Modules/WebPage":149,"core-js/modules/es6.array.iterator":100,"core-js/modules/es6.function.name":104,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/web.dom.iterable":123}],143:[function(require,module,exports){
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

},{"../Modules/WebPage":149,"core-js/modules/es6.array.iterator":100,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/web.dom.iterable":123}],144:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

var WebPage_1 = require("../Modules/WebPage");

var Project_1 = require("../Classes/Elements/Project");

var Projects_1 = require("../Data/Projects");

DOM_1.DOM.load().then(function (document) {
  var ProjectsContainer = WebPage_1.Sections.get('projects').element.querySelector('.projects-container');
  var card;

  for (var _i = 0, Data_1 = Projects_1.Projects; _i < Data_1.length; _i++) {
    var data = Data_1[_i];
    card = new Project_1.Project(data);
    ProjectsContainer.appendChild(card.createElement());
  }
});

},{"../Classes/Elements/Project":128,"../Data/Projects":134,"../Modules/DOM":146,"../Modules/WebPage":149,"core-js/modules/es6.object.define-property":107}],145:[function(require,module,exports){
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

},{"../Classes/Elements/Skill":131,"../Data/Skills":136,"../Modules/DOM":146,"../Modules/WebPage":149,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.promise":111,"core-js/modules/es6.symbol":121,"core-js/modules/es7.symbol.async-iterator":122}],146:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.promise":111,"core-js/modules/es6.regexp.match":114}],147:[function(require,module,exports){
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

},{"core-js/modules/es6.array.iterator":100,"core-js/modules/es6.function.name":104,"core-js/modules/es6.map":105,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.set":117,"core-js/modules/es6.string.iterator":118,"core-js/modules/web.dom.iterable":123}],148:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.promise":111}],149:[function(require,module,exports){
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

exports.Body = DOM_1.DOM.getFirstElement('body');
exports.Main = DOM_1.DOM.getFirstElement('main');
exports.MainScroll = DOM_1.DOM.getFirstElement('main .scroll');
exports.ScrollHook = DOM_1.DOM.isIE() ? window : exports.MainScroll;
exports.Logo = {
  Outer: DOM_1.DOM.getFirstElement('header.logo .image img.outer'),
  Inner: DOM_1.DOM.getFirstElement('header.logo .image img.inner')
};
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

},{"../Classes/Elements/Menu":127,"../Classes/Elements/Section":130,"./DOM":146,"core-js/modules/es6.array.from":97,"core-js/modules/es6.array.iterator":100,"core-js/modules/es6.map":105,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.string.iterator":118,"core-js/modules/web.dom.iterable":123}],150:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107}],151:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107}],152:[function(require,module,exports){
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

},{"core-js/modules/es6.date.to-string":102,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.regexp.to-string":116}],153:[function(require,module,exports){
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

},{"core-js/modules/es6.date.to-string":102,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.regexp.to-string":116}],154:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":107}],155:[function(require,module,exports){
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

},{"./Animation":150,"./Color":152,"./Coordinate":153,"./Stroke":158,"./Vector":159,"core-js/modules/es6.array.index-of":98,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.symbol":121,"core-js/modules/es7.symbol.async-iterator":122}],156:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":107}],157:[function(require,module,exports){
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

},{"../Modules/DOM":146,"./AnimationFrameFunctions":151,"./Coordinate":153,"./Particle":155,"core-js/modules/es6.array.fill":96,"core-js/modules/es6.array.map":101,"core-js/modules/es6.date.to-string":102,"core-js/modules/es6.function.bind":103,"core-js/modules/es6.object.define-property":107,"core-js/modules/es6.object.to-string":110,"core-js/modules/es6.regexp.to-string":116}],158:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107}],159:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":107}]},{},[124,125,126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,157,156,158,159])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWR2YW5jZS1zdHJpbmctaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZnVuY3Rpb24tdG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtcmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21ldGEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qtc2FwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcGVyZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Byb21pc2UtcmVzb2x2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS1hbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZ2V4cC1leGVjLWFic3RyYWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVnZXhwLWV4ZWMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLWtleS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NwZWNpZXMtY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpY3QtbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdXNlci1hZ2VudC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3ZhbGlkYXRlLWNvbGxlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MtZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pbmRleC1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmlzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5kYXRlLnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmZ1bmN0aW9uLmJpbmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5mdW5jdGlvbi5uYW1lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAuZXhlYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5mbGFncy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5tYXRjaC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5yZXBsYWNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnNldC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5saW5rLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnN0YXJ0cy13aXRoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwib3V0L3RzL0NhbnZhcy9DYW52YXMuanMiLCJvdXQvdHMvQ2FudmFzL1N0YXJzLmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvRXhwZXJpZW5jZS5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL01lbnUuanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9Qcm9qZWN0LmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvUXVhbGl0eS5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NlY3Rpb24uanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbC5qcyIsIm91dC90cy9EYXRhL0Fib3V0LmpzIiwib3V0L3RzL0RhdGEvRXhwZXJpZW5jZS5qcyIsIm91dC90cy9EYXRhL1Byb2plY3RzLmpzIiwib3V0L3RzL0RhdGEvUXVhbGl0aWVzLmpzIiwib3V0L3RzL0RhdGEvU2tpbGxzLmpzIiwib3V0L3RzL0RlZmluaXRpb25zL0pTWC5qcyIsIm91dC90cy9FdmVudHMvQWJvdXQuanMiLCJvdXQvdHMvRXZlbnRzL0JvZHkuanMiLCJvdXQvdHMvRXZlbnRzL0V4cGVyaWVuY2UuanMiLCJvdXQvdHMvRXZlbnRzL0xvZ28uanMiLCJvdXQvdHMvRXZlbnRzL01haW4uanMiLCJvdXQvdHMvRXZlbnRzL01lbnUuanMiLCJvdXQvdHMvRXZlbnRzL1Byb2plY3RzLmpzIiwib3V0L3RzL0V2ZW50cy9Ta2lsbHMuanMiLCJvdXQvdHMvTW9kdWxlcy9ET00uanMiLCJvdXQvdHMvTW9kdWxlcy9FdmVudERpc3BhdGNoZXIuanMiLCJvdXQvdHMvTW9kdWxlcy9TVkcuanMiLCJvdXQvdHMvTW9kdWxlcy9XZWJQYWdlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9BbmltYXRpb24uanMiLCJvdXQvdHMvUGFydGljbGVzL0FuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Db2xvci5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQ29vcmRpbmF0ZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvTW91c2UuanMiLCJvdXQvdHMvUGFydGljbGVzL1BhcnRpY2xlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9QYXJ0aWNsZVNldHRpbmdzLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9QYXJ0aWNsZXMuanMiLCJvdXQvdHMvUGFydGljbGVzL1N0cm9rZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvVmVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtB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dGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyAyMi4xLjMuMzEgQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXG52YXIgVU5TQ09QQUJMRVMgPSByZXF1aXJlKCcuL193a3MnKSgndW5zY29wYWJsZXMnKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuaWYgKEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdID09IHVuZGVmaW5lZCkgcmVxdWlyZSgnLi9faGlkZScpKEFycmF5UHJvdG8sIFVOU0NPUEFCTEVTLCB7fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgQXJyYXlQcm90b1tVTlNDT1BBQkxFU11ba2V5XSA9IHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbiAvLyBgQWR2YW5jZVN0cmluZ0luZGV4YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWFkdmFuY2VzdHJpbmdpbmRleFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoUywgaW5kZXgsIHVuaWNvZGUpIHtcbiAgcmV0dXJuIGluZGV4ICsgKHVuaWNvZGUgPyBhdChTLCBpbmRleCkubGVuZ3RoIDogMSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lLCBmb3JiaWRkZW5GaWVsZCkge1xuICBpZiAoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSB8fCAoZm9yYmlkZGVuRmllbGQgIT09IHVuZGVmaW5lZCAmJiBmb3JiaWRkZW5GaWVsZCBpbiBpdCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IobmFtZSArICc6IGluY29ycmVjdCBpbnZvY2F0aW9uIScpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmICghaXNPYmplY3QoaXQpKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCIvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbid1c2Ugc3RyaWN0JztcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIHRvQWJzb2x1dGVJbmRleCA9IHJlcXVpcmUoJy4vX3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZmlsbCh2YWx1ZSAvKiAsIHN0YXJ0ID0gMCwgZW5kID0gQGxlbmd0aCAqLykge1xuICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChhTGVuID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgbGVuZ3RoKTtcbiAgdmFyIGVuZCA9IGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkO1xuICB2YXIgZW5kUG9zID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0Fic29sdXRlSW5kZXgoZW5kLCBsZW5ndGgpO1xuICB3aGlsZSAoZW5kUG9zID4gaW5kZXgpIE9baW5kZXgrK10gPSB2YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwiLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxuLy8gdHJ1ZSAgLT4gQXJyYXkjaW5jbHVkZXNcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgaWYgKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKSB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIHtcbiAgICAgIHZhbHVlID0gT1tpbmRleCsrXTtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICAgIGlmICh2YWx1ZSAhPSB2YWx1ZSkgcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjaW5kZXhPZiBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pIHtcbiAgICAgIGlmIChPW2luZGV4XSA9PT0gZWwpIHJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07XG4iLCIvLyAwIC0+IEFycmF5I2ZvckVhY2hcbi8vIDEgLT4gQXJyYXkjbWFwXG4vLyAyIC0+IEFycmF5I2ZpbHRlclxuLy8gMyAtPiBBcnJheSNzb21lXG4vLyA0IC0+IEFycmF5I2V2ZXJ5XG4vLyA1IC0+IEFycmF5I2ZpbmRcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgYXNjID0gcmVxdWlyZSgnLi9fYXJyYXktc3BlY2llcy1jcmVhdGUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFRZUEUsICRjcmVhdGUpIHtcbiAgdmFyIElTX01BUCA9IFRZUEUgPT0gMTtcbiAgdmFyIElTX0ZJTFRFUiA9IFRZUEUgPT0gMjtcbiAgdmFyIElTX1NPTUUgPSBUWVBFID09IDM7XG4gIHZhciBJU19FVkVSWSA9IFRZUEUgPT0gNDtcbiAgdmFyIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDY7XG4gIHZhciBOT19IT0xFUyA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYO1xuICB2YXIgY3JlYXRlID0gJGNyZWF0ZSB8fCBhc2M7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQpIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgc2VsZiA9IElPYmplY3QoTyk7XG4gICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgdGhhdCwgMyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKHNlbGYubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciByZXN1bHQgPSBJU19NQVAgPyBjcmVhdGUoJHRoaXMsIGxlbmd0aCkgOiBJU19GSUxURVIgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkO1xuICAgIHZhciB2YWwsIHJlcztcbiAgICBmb3IgKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKykgaWYgKE5PX0hPTEVTIHx8IGluZGV4IGluIHNlbGYpIHtcbiAgICAgIHZhbCA9IHNlbGZbaW5kZXhdO1xuICAgICAgcmVzID0gZih2YWwsIGluZGV4LCBPKTtcbiAgICAgIGlmIChUWVBFKSB7XG4gICAgICAgIGlmIChJU19NQVApIHJlc3VsdFtpbmRleF0gPSByZXM7ICAgLy8gbWFwXG4gICAgICAgIGVsc2UgaWYgKHJlcykgc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSAzOiByZXR1cm4gdHJ1ZTsgICAgICAgICAgICAgLy8gc29tZVxuICAgICAgICAgIGNhc2UgNTogcmV0dXJuIHZhbDsgICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAvLyBmaW5kSW5kZXhcbiAgICAgICAgICBjYXNlIDI6IHJlc3VsdC5wdXNoKHZhbCk7ICAgICAgICAvLyBmaWx0ZXJcbiAgICAgICAgfSBlbHNlIGlmIChJU19FVkVSWSkgcmV0dXJuIGZhbHNlOyAvLyBldmVyeVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gSVNfRklORF9JTkRFWCA/IC0xIDogSVNfU09NRSB8fCBJU19FVkVSWSA/IElTX0VWRVJZIDogcmVzdWx0O1xuICB9O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL19pcy1hcnJheScpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvcmlnaW5hbCkge1xuICB2YXIgQztcbiAgaWYgKGlzQXJyYXkob3JpZ2luYWwpKSB7XG4gICAgQyA9IG9yaWdpbmFsLmNvbnN0cnVjdG9yO1xuICAgIC8vIGNyb3NzLXJlYWxtIGZhbGxiYWNrXG4gICAgaWYgKHR5cGVvZiBDID09ICdmdW5jdGlvbicgJiYgKEMgPT09IEFycmF5IHx8IGlzQXJyYXkoQy5wcm90b3R5cGUpKSkgQyA9IHVuZGVmaW5lZDtcbiAgICBpZiAoaXNPYmplY3QoQykpIHtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYgKEMgPT09IG51bGwpIEMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59O1xuIiwiLy8gOS40LjIuMyBBcnJheVNwZWNpZXNDcmVhdGUob3JpZ2luYWxBcnJheSwgbGVuZ3RoKVxudmFyIHNwZWNpZXNDb25zdHJ1Y3RvciA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwsIGxlbmd0aCkge1xuICByZXR1cm4gbmV3IChzcGVjaWVzQ29uc3RydWN0b3Iob3JpZ2luYWwpKShsZW5ndGgpO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBpbnZva2UgPSByZXF1aXJlKCcuL19pbnZva2UnKTtcbnZhciBhcnJheVNsaWNlID0gW10uc2xpY2U7XG52YXIgZmFjdG9yaWVzID0ge307XG5cbnZhciBjb25zdHJ1Y3QgPSBmdW5jdGlvbiAoRiwgbGVuLCBhcmdzKSB7XG4gIGlmICghKGxlbiBpbiBmYWN0b3JpZXMpKSB7XG4gICAgZm9yICh2YXIgbiA9IFtdLCBpID0gMDsgaSA8IGxlbjsgaSsrKSBuW2ldID0gJ2FbJyArIGkgKyAnXSc7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgZmFjdG9yaWVzW2xlbl0gPSBGdW5jdGlvbignRixhJywgJ3JldHVybiBuZXcgRignICsgbi5qb2luKCcsJykgKyAnKScpO1xuICB9IHJldHVybiBmYWN0b3JpZXNbbGVuXShGLCBhcmdzKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb24uYmluZCB8fCBmdW5jdGlvbiBiaW5kKHRoYXQgLyogLCAuLi5hcmdzICovKSB7XG4gIHZhciBmbiA9IGFGdW5jdGlvbih0aGlzKTtcbiAgdmFyIHBhcnRBcmdzID0gYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gIHZhciBib3VuZCA9IGZ1bmN0aW9uICgvKiBhcmdzLi4uICovKSB7XG4gICAgdmFyIGFyZ3MgPSBwYXJ0QXJncy5jb25jYXQoYXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIHJldHVybiB0aGlzIGluc3RhbmNlb2YgYm91bmQgPyBjb25zdHJ1Y3QoZm4sIGFyZ3MubGVuZ3RoLCBhcmdzKSA6IGludm9rZShmbiwgYXJncywgdGhhdCk7XG4gIH07XG4gIGlmIChpc09iamVjdChmbi5wcm90b3R5cGUpKSBib3VuZC5wcm90b3R5cGUgPSBmbi5wcm90b3R5cGU7XG4gIHJldHVybiBib3VuZDtcbn07XG4iLCIvLyBnZXR0aW5nIHRhZyBmcm9tIDE5LjEuMy42IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcoKVxudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBBUkcgPSBjb2YoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIE8sIFQsIEI7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mIChUID0gdHJ5R2V0KE8gPSBPYmplY3QoaXQpLCBUQUcpKSA9PSAnc3RyaW5nJyA/IFRcbiAgICAvLyBidWlsdGluVGFnIGNhc2VcbiAgICA6IEFSRyA/IGNvZihPKVxuICAgIC8vIEVTMyBhcmd1bWVudHMgZmFsbGJhY2tcbiAgICA6IChCID0gY29mKE8pKSA9PSAnT2JqZWN0JyAmJiB0eXBlb2YgTy5jYWxsZWUgPT0gJ2Z1bmN0aW9uJyA/ICdBcmd1bWVudHMnIDogQjtcbn07XG4iLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHRvU3RyaW5nLmNhbGwoaXQpLnNsaWNlKDgsIC0xKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgJGl0ZXJEZWZpbmUgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpO1xudmFyIHN0ZXAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKTtcbnZhciBzZXRTcGVjaWVzID0gcmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFzdEtleSA9IHJlcXVpcmUoJy4vX21ldGEnKS5mYXN0S2V5O1xudmFyIHZhbGlkYXRlID0gcmVxdWlyZSgnLi9fdmFsaWRhdGUtY29sbGVjdGlvbicpO1xudmFyIFNJWkUgPSBERVNDUklQVE9SUyA/ICdfcycgOiAnc2l6ZSc7XG5cbnZhciBnZXRFbnRyeSA9IGZ1bmN0aW9uICh0aGF0LCBrZXkpIHtcbiAgLy8gZmFzdCBjYXNlXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KTtcbiAgdmFyIGVudHJ5O1xuICBpZiAoaW5kZXggIT09ICdGJykgcmV0dXJuIHRoYXQuX2lbaW5kZXhdO1xuICAvLyBmcm96ZW4gb2JqZWN0IGNhc2VcbiAgZm9yIChlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pIHtcbiAgICBpZiAoZW50cnkuayA9PSBrZXkpIHJldHVybiBlbnRyeTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbiAod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUikge1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgTkFNRSwgJ19pJyk7XG4gICAgICB0aGF0Ll90ID0gTkFNRTsgICAgICAgICAvLyBjb2xsZWN0aW9uIHR5cGVcbiAgICAgIHRoYXQuX2kgPSBjcmVhdGUobnVsbCk7IC8vIGluZGV4XG4gICAgICB0aGF0Ll9mID0gdW5kZWZpbmVkOyAgICAvLyBmaXJzdCBlbnRyeVxuICAgICAgdGhhdC5fbCA9IHVuZGVmaW5lZDsgICAgLy8gbGFzdCBlbnRyeVxuICAgICAgdGhhdFtTSVpFXSA9IDA7ICAgICAgICAgLy8gc2l6ZVxuICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgIH0pO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICBmb3IgKHZhciB0aGF0ID0gdmFsaWRhdGUodGhpcywgTkFNRSksIGRhdGEgPSB0aGF0Ll9pLCBlbnRyeSA9IHRoYXQuX2Y7IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pIHtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZW50cnkucCkgZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcbiAgICAgICAgfVxuICAgICAgICB0aGF0Ll9mID0gdGhhdC5fbCA9IHVuZGVmaW5lZDtcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XG4gICAgICB9LFxuICAgICAgLy8gMjMuMS4zLjMgTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdGhhdCA9IHZhbGlkYXRlKHRoaXMsIE5BTUUpO1xuICAgICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm47XG4gICAgICAgICAgdmFyIHByZXYgPSBlbnRyeS5wO1xuICAgICAgICAgIGRlbGV0ZSB0aGF0Ll9pW2VudHJ5LmldO1xuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xuICAgICAgICAgIGlmIChwcmV2KSBwcmV2Lm4gPSBuZXh0O1xuICAgICAgICAgIGlmIChuZXh0KSBuZXh0LnAgPSBwcmV2O1xuICAgICAgICAgIGlmICh0aGF0Ll9mID09IGVudHJ5KSB0aGF0Ll9mID0gbmV4dDtcbiAgICAgICAgICBpZiAodGhhdC5fbCA9PSBlbnRyeSkgdGhhdC5fbCA9IHByZXY7XG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXG4gICAgICBmb3JFYWNoOiBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyogLCB0aGF0ID0gdW5kZWZpbmVkICovKSB7XG4gICAgICAgIHZhbGlkYXRlKHRoaXMsIE5BTUUpO1xuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgMyk7XG4gICAgICAgIHZhciBlbnRyeTtcbiAgICAgICAgd2hpbGUgKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpcy5fZikge1xuICAgICAgICAgIGYoZW50cnkudiwgZW50cnkuaywgdGhpcyk7XG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnIpIGVudHJ5ID0gZW50cnkucDtcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxuICAgICAgaGFzOiBmdW5jdGlvbiBoYXMoa2V5KSB7XG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHZhbGlkYXRlKHRoaXMsIE5BTUUpLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChERVNDUklQVE9SUykgZFAoQy5wcm90b3R5cGUsICdzaXplJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB2YWxpZGF0ZSh0aGlzLCBOQU1FKVtTSVpFXTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgZGVmOiBmdW5jdGlvbiAodGhhdCwga2V5LCB2YWx1ZSkge1xuICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgdmFyIHByZXYsIGluZGV4O1xuICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgIGlmIChlbnRyeSkge1xuICAgICAgZW50cnkudiA9IHZhbHVlO1xuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhhdC5fbCA9IGVudHJ5ID0ge1xuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcbiAgICAgICAgazoga2V5LCAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGtleVxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcbiAgICAgICAgcDogcHJldiA9IHRoYXQuX2wsICAgICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XG4gICAgICAgIG46IHVuZGVmaW5lZCwgICAgICAgICAgICAgICAgICAvLyA8LSBuZXh0IGVudHJ5XG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXG4gICAgICB9O1xuICAgICAgaWYgKCF0aGF0Ll9mKSB0aGF0Ll9mID0gZW50cnk7XG4gICAgICBpZiAocHJldikgcHJldi5uID0gZW50cnk7XG4gICAgICB0aGF0W1NJWkVdKys7XG4gICAgICAvLyBhZGQgdG8gaW5kZXhcbiAgICAgIGlmIChpbmRleCAhPT0gJ0YnKSB0aGF0Ll9pW2luZGV4XSA9IGVudHJ5O1xuICAgIH0gcmV0dXJuIHRoYXQ7XG4gIH0sXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbiAoQywgTkFNRSwgSVNfTUFQKSB7XG4gICAgLy8gYWRkIC5rZXlzLCAudmFsdWVzLCAuZW50cmllcywgW0BAaXRlcmF0b3JdXG4gICAgLy8gMjMuMS4zLjQsIDIzLjEuMy44LCAyMy4xLjMuMTEsIDIzLjEuMy4xMiwgMjMuMi4zLjUsIDIzLjIuMy44LCAyMy4yLjMuMTAsIDIzLjIuMy4xMVxuICAgICRpdGVyRGVmaW5lKEMsIE5BTUUsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICAgICAgdGhpcy5fdCA9IHZhbGlkYXRlKGl0ZXJhdGVkLCBOQU1FKTsgLy8gdGFyZ2V0XG4gICAgICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgICAgICAvLyBraW5kXG4gICAgICB0aGlzLl9sID0gdW5kZWZpbmVkOyAgICAgICAgICAgICAgICAvLyBwcmV2aW91c1xuICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgIHZhciBraW5kID0gdGhhdC5faztcbiAgICAgIHZhciBlbnRyeSA9IHRoYXQuX2w7XG4gICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yKSBlbnRyeSA9IGVudHJ5LnA7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYgKCF0aGF0Ll90IHx8ICEodGhhdC5fbCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhhdC5fdC5fZikpIHtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgdGhhdC5fdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHN0ZXAoMSk7XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiBzdGVwKDAsIGVudHJ5LmspO1xuICAgICAgaWYgKGtpbmQgPT0gJ3ZhbHVlcycpIHJldHVybiBzdGVwKDAsIGVudHJ5LnYpO1xuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJywgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBhZGQgW0BAc3BlY2llc10sIDIzLjEuMi4yLCAyMy4yLjIuMlxuICAgIHNldFNwZWNpZXMoTkFNRSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciByZWRlZmluZUFsbCA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lLWFsbCcpO1xudmFyIG1ldGEgPSByZXF1aXJlKCcuL19tZXRhJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciAkaXRlckRldGVjdCA9IHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0Jyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGluaGVyaXRJZlJlcXVpcmVkID0gcmVxdWlyZSgnLi9faW5oZXJpdC1pZi1yZXF1aXJlZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChOQU1FLCB3cmFwcGVyLCBtZXRob2RzLCBjb21tb24sIElTX01BUCwgSVNfV0VBSykge1xuICB2YXIgQmFzZSA9IGdsb2JhbFtOQU1FXTtcbiAgdmFyIEMgPSBCYXNlO1xuICB2YXIgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnO1xuICB2YXIgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlO1xuICB2YXIgTyA9IHt9O1xuICB2YXIgZml4TWV0aG9kID0gZnVuY3Rpb24gKEtFWSkge1xuICAgIHZhciBmbiA9IHByb3RvW0tFWV07XG4gICAgcmVkZWZpbmUocHJvdG8sIEtFWSxcbiAgICAgIEtFWSA9PSAnZGVsZXRlJyA/IGZ1bmN0aW9uIChhKSB7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChhKSA/IGZhbHNlIDogZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpO1xuICAgICAgfSA6IEtFWSA9PSAnaGFzJyA/IGZ1bmN0aW9uIGhhcyhhKSB7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChhKSA/IGZhbHNlIDogZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpO1xuICAgICAgfSA6IEtFWSA9PSAnZ2V0JyA/IGZ1bmN0aW9uIGdldChhKSB7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChhKSA/IHVuZGVmaW5lZCA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2FkZCcgPyBmdW5jdGlvbiBhZGQoYSkgeyBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7IHJldHVybiB0aGlzOyB9XG4gICAgICAgIDogZnVuY3Rpb24gc2V0KGEsIGIpIHsgZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEsIGIpOyByZXR1cm4gdGhpczsgfVxuICAgICk7XG4gIH07XG4gIGlmICh0eXBlb2YgQyAhPSAnZnVuY3Rpb24nIHx8ICEoSVNfV0VBSyB8fCBwcm90by5mb3JFYWNoICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgbmV3IEMoKS5lbnRyaWVzKCkubmV4dCgpO1xuICB9KSkpIHtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3Iod3JhcHBlciwgTkFNRSwgSVNfTUFQLCBBRERFUik7XG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xuICAgIG1ldGEuTkVFRCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGluc3RhbmNlID0gbmV3IEMoKTtcbiAgICAvLyBlYXJseSBpbXBsZW1lbnRhdGlvbnMgbm90IHN1cHBvcnRzIGNoYWluaW5nXG4gICAgdmFyIEhBU05UX0NIQUlOSU5HID0gaW5zdGFuY2VbQURERVJdKElTX1dFQUsgPyB7fSA6IC0wLCAxKSAhPSBpbnN0YW5jZTtcbiAgICAvLyBWOCB+ICBDaHJvbWl1bSA0MC0gd2Vhay1jb2xsZWN0aW9ucyB0aHJvd3Mgb24gcHJpbWl0aXZlcywgYnV0IHNob3VsZCByZXR1cm4gZmFsc2VcbiAgICB2YXIgVEhST1dTX09OX1BSSU1JVElWRVMgPSBmYWlscyhmdW5jdGlvbiAoKSB7IGluc3RhbmNlLmhhcygxKTsgfSk7XG4gICAgLy8gbW9zdCBlYXJseSBpbXBsZW1lbnRhdGlvbnMgZG9lc24ndCBzdXBwb3J0cyBpdGVyYWJsZXMsIG1vc3QgbW9kZXJuIC0gbm90IGNsb3NlIGl0IGNvcnJlY3RseVxuICAgIHZhciBBQ0NFUFRfSVRFUkFCTEVTID0gJGl0ZXJEZXRlY3QoZnVuY3Rpb24gKGl0ZXIpIHsgbmV3IEMoaXRlcik7IH0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIC8vIGZvciBlYXJseSBpbXBsZW1lbnRhdGlvbnMgLTAgYW5kICswIG5vdCB0aGUgc2FtZVxuICAgIHZhciBCVUdHWV9aRVJPID0gIUlTX1dFQUsgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gVjggfiBDaHJvbWl1bSA0Mi0gZmFpbHMgb25seSB3aXRoIDUrIGVsZW1lbnRzXG4gICAgICB2YXIgJGluc3RhbmNlID0gbmV3IEMoKTtcbiAgICAgIHZhciBpbmRleCA9IDU7XG4gICAgICB3aGlsZSAoaW5kZXgtLSkgJGluc3RhbmNlW0FEREVSXShpbmRleCwgaW5kZXgpO1xuICAgICAgcmV0dXJuICEkaW5zdGFuY2UuaGFzKC0wKTtcbiAgICB9KTtcbiAgICBpZiAoIUFDQ0VQVF9JVEVSQUJMRVMpIHtcbiAgICAgIEMgPSB3cmFwcGVyKGZ1bmN0aW9uICh0YXJnZXQsIGl0ZXJhYmxlKSB7XG4gICAgICAgIGFuSW5zdGFuY2UodGFyZ2V0LCBDLCBOQU1FKTtcbiAgICAgICAgdmFyIHRoYXQgPSBpbmhlcml0SWZSZXF1aXJlZChuZXcgQmFzZSgpLCB0YXJnZXQsIEMpO1xuICAgICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XG4gICAgICAgIHJldHVybiB0aGF0O1xuICAgICAgfSk7XG4gICAgICBDLnByb3RvdHlwZSA9IHByb3RvO1xuICAgICAgcHJvdG8uY29uc3RydWN0b3IgPSBDO1xuICAgIH1cbiAgICBpZiAoVEhST1dTX09OX1BSSU1JVElWRVMgfHwgQlVHR1lfWkVSTykge1xuICAgICAgZml4TWV0aG9kKCdkZWxldGUnKTtcbiAgICAgIGZpeE1ldGhvZCgnaGFzJyk7XG4gICAgICBJU19NQVAgJiYgZml4TWV0aG9kKCdnZXQnKTtcbiAgICB9XG4gICAgaWYgKEJVR0dZX1pFUk8gfHwgSEFTTlRfQ0hBSU5JTkcpIGZpeE1ldGhvZChBRERFUik7XG4gICAgLy8gd2VhayBjb2xsZWN0aW9ucyBzaG91bGQgbm90IGNvbnRhaW5zIC5jbGVhciBtZXRob2RcbiAgICBpZiAoSVNfV0VBSyAmJiBwcm90by5jbGVhcikgZGVsZXRlIHByb3RvLmNsZWFyO1xuICB9XG5cbiAgc2V0VG9TdHJpbmdUYWcoQywgTkFNRSk7XG5cbiAgT1tOQU1FXSA9IEM7XG4gICRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogKEMgIT0gQmFzZSksIE8pO1xuXG4gIGlmICghSVNfV0VBSykgY29tbW9uLnNldFN0cm9uZyhDLCBOQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDO1xufTtcbiIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7IHZlcnNpb246ICcyLjYuNScgfTtcbmlmICh0eXBlb2YgX19lID09ICdudW1iZXInKSBfX2UgPSBjb3JlOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBpbmRleCwgdmFsdWUpIHtcbiAgaWYgKGluZGV4IGluIG9iamVjdCkgJGRlZmluZVByb3BlcnR5LmYob2JqZWN0LCBpbmRleCwgY3JlYXRlRGVzYygwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtpbmRleF0gPSB2YWx1ZTtcbn07XG4iLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgdGhhdCwgbGVuZ3RoKSB7XG4gIGFGdW5jdGlvbihmbik7XG4gIGlmICh0aGF0ID09PSB1bmRlZmluZWQpIHJldHVybiBmbjtcbiAgc3dpdGNoIChsZW5ndGgpIHtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbiAoYSkge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSk7XG4gICAgfTtcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XG4gICAgfTtcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbiAoYSwgYiwgYykge1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24gKC8qIC4uLmFyZ3MgKi8pIHtcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcbiAgfTtcbn07XG4iLCIvLyA3LjIuMSBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlKGFyZ3VtZW50KVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eVxubW9kdWxlLmV4cG9ydHMgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xuLy8gdHlwZW9mIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQgaXMgJ29iamVjdCcgaW4gb2xkIElFXG52YXIgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXMgPyBkb2N1bWVudC5jcmVhdGVFbGVtZW50KGl0KSA6IHt9O1xufTtcbiIsIi8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcbm1vZHVsZS5leHBvcnRzID0gKFxuICAnY29uc3RydWN0b3IsaGFzT3duUHJvcGVydHksaXNQcm90b3R5cGVPZixwcm9wZXJ0eUlzRW51bWVyYWJsZSx0b0xvY2FsZVN0cmluZyx0b1N0cmluZyx2YWx1ZU9mJ1xuKS5zcGxpdCgnLCcpO1xuIiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BTID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKTtcbnZhciBwSUUgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgcmVzdWx0ID0gZ2V0S2V5cyhpdCk7XG4gIHZhciBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICBpZiAoZ2V0U3ltYm9scykge1xuICAgIHZhciBzeW1ib2xzID0gZ2V0U3ltYm9scyhpdCk7XG4gICAgdmFyIGlzRW51bSA9IHBJRS5mO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChzeW1ib2xzLmxlbmd0aCA+IGkpIGlmIChpc0VudW0uY2FsbChpdCwga2V5ID0gc3ltYm9sc1tpKytdKSkgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG52YXIgJGV4cG9ydCA9IGZ1bmN0aW9uICh0eXBlLCBuYW1lLCBzb3VyY2UpIHtcbiAgdmFyIElTX0ZPUkNFRCA9IHR5cGUgJiAkZXhwb3J0LkY7XG4gIHZhciBJU19HTE9CQUwgPSB0eXBlICYgJGV4cG9ydC5HO1xuICB2YXIgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuUztcbiAgdmFyIElTX1BST1RPID0gdHlwZSAmICRleHBvcnQuUDtcbiAgdmFyIElTX0JJTkQgPSB0eXBlICYgJGV4cG9ydC5CO1xuICB2YXIgdGFyZ2V0ID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIHx8IChnbG9iYWxbbmFtZV0gPSB7fSkgOiAoZ2xvYmFsW25hbWVdIHx8IHt9KVtQUk9UT1RZUEVdO1xuICB2YXIgZXhwb3J0cyA9IElTX0dMT0JBTCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xuICB2YXIgZXhwUHJvdG8gPSBleHBvcnRzW1BST1RPVFlQRV0gfHwgKGV4cG9ydHNbUFJPVE9UWVBFXSA9IHt9KTtcbiAgdmFyIGtleSwgb3duLCBvdXQsIGV4cDtcbiAgaWYgKElTX0dMT0JBTCkgc291cmNlID0gbmFtZTtcbiAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXG4gICAgb3duID0gIUlTX0ZPUkNFRCAmJiB0YXJnZXQgJiYgdGFyZ2V0W2tleV0gIT09IHVuZGVmaW5lZDtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcbiAgICBleHAgPSBJU19CSU5EICYmIG93biA/IGN0eChvdXQsIGdsb2JhbCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgaWYgKHRhcmdldCkgcmVkZWZpbmUodGFyZ2V0LCBrZXksIG91dCwgdHlwZSAmICRleHBvcnQuVSk7XG4gICAgLy8gZXhwb3J0XG4gICAgaWYgKGV4cG9ydHNba2V5XSAhPSBvdXQpIGhpZGUoZXhwb3J0cywga2V5LCBleHApO1xuICAgIGlmIChJU19QUk9UTyAmJiBleHBQcm90b1trZXldICE9IG91dCkgZXhwUHJvdG9ba2V5XSA9IG91dDtcbiAgfVxufTtcbmdsb2JhbC5jb3JlID0gY29yZTtcbi8vIHR5cGUgYml0bWFwXG4kZXhwb3J0LkYgPSAxOyAgIC8vIGZvcmNlZFxuJGV4cG9ydC5HID0gMjsgICAvLyBnbG9iYWxcbiRleHBvcnQuUyA9IDQ7ICAgLy8gc3RhdGljXG4kZXhwb3J0LlAgPSA4OyAgIC8vIHByb3RvXG4kZXhwb3J0LkIgPSAxNjsgIC8vIGJpbmRcbiRleHBvcnQuVyA9IDMyOyAgLy8gd3JhcFxuJGV4cG9ydC5VID0gNjQ7ICAvLyBzYWZlXG4kZXhwb3J0LlIgPSAxMjg7IC8vIHJlYWwgcHJvdG8gbWV0aG9kIGZvciBgbGlicmFyeWBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDtcbiIsInZhciBNQVRDSCA9IHJlcXVpcmUoJy4vX3drcycpKCdtYXRjaCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZKSB7XG4gIHZhciByZSA9IC8uLztcbiAgdHJ5IHtcbiAgICAnLy4vJ1tLRVldKHJlKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHRyeSB7XG4gICAgICByZVtNQVRDSF0gPSBmYWxzZTtcbiAgICAgIHJldHVybiAhJy8uLydbS0VZXShyZSk7XG4gICAgfSBjYXRjaCAoZikgeyAvKiBlbXB0eSAqLyB9XG4gIH0gcmV0dXJuIHRydWU7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xucmVxdWlyZSgnLi9lczYucmVnZXhwLmV4ZWMnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciByZWdleHBFeGVjID0gcmVxdWlyZSgnLi9fcmVnZXhwLWV4ZWMnKTtcblxudmFyIFNQRUNJRVMgPSB3a3MoJ3NwZWNpZXMnKTtcblxudmFyIFJFUExBQ0VfU1VQUE9SVFNfTkFNRURfR1JPVVBTID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gI3JlcGxhY2UgbmVlZHMgYnVpbHQtaW4gc3VwcG9ydCBmb3IgbmFtZWQgZ3JvdXBzLlxuICAvLyAjbWF0Y2ggd29ya3MgZmluZSBiZWNhdXNlIGl0IGp1c3QgcmV0dXJuIHRoZSBleGVjIHJlc3VsdHMsIGV2ZW4gaWYgaXQgaGFzXG4gIC8vIGEgXCJncm9wc1wiIHByb3BlcnR5LlxuICB2YXIgcmUgPSAvLi87XG4gIHJlLmV4ZWMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHJlc3VsdC5ncm91cHMgPSB7IGE6ICc3JyB9O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIHJldHVybiAnJy5yZXBsYWNlKHJlLCAnJDxhPicpICE9PSAnNyc7XG59KTtcblxudmFyIFNQTElUX1dPUktTX1dJVEhfT1ZFUldSSVRURU5fRVhFQyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIENocm9tZSA1MSBoYXMgYSBidWdneSBcInNwbGl0XCIgaW1wbGVtZW50YXRpb24gd2hlbiBSZWdFeHAjZXhlYyAhPT0gbmF0aXZlRXhlY1xuICB2YXIgcmUgPSAvKD86KS87XG4gIHZhciBvcmlnaW5hbEV4ZWMgPSByZS5leGVjO1xuICByZS5leGVjID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gb3JpZ2luYWxFeGVjLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7IH07XG4gIHZhciByZXN1bHQgPSAnYWInLnNwbGl0KHJlKTtcbiAgcmV0dXJuIHJlc3VsdC5sZW5ndGggPT09IDIgJiYgcmVzdWx0WzBdID09PSAnYScgJiYgcmVzdWx0WzFdID09PSAnYic7XG59KSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVksIGxlbmd0aCwgZXhlYykge1xuICB2YXIgU1lNQk9MID0gd2tzKEtFWSk7XG5cbiAgdmFyIERFTEVHQVRFU19UT19TWU1CT0wgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIFN0cmluZyBtZXRob2RzIGNhbGwgc3ltYm9sLW5hbWVkIFJlZ0VwIG1ldGhvZHNcbiAgICB2YXIgTyA9IHt9O1xuICAgIE9bU1lNQk9MXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH07XG4gICAgcmV0dXJuICcnW0tFWV0oTykgIT0gNztcbiAgfSk7XG5cbiAgdmFyIERFTEVHQVRFU19UT19FWEVDID0gREVMRUdBVEVTX1RPX1NZTUJPTCA/ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gU3ltYm9sLW5hbWVkIFJlZ0V4cCBtZXRob2RzIGNhbGwgLmV4ZWNcbiAgICB2YXIgZXhlY0NhbGxlZCA9IGZhbHNlO1xuICAgIHZhciByZSA9IC9hLztcbiAgICByZS5leGVjID0gZnVuY3Rpb24gKCkgeyBleGVjQ2FsbGVkID0gdHJ1ZTsgcmV0dXJuIG51bGw7IH07XG4gICAgaWYgKEtFWSA9PT0gJ3NwbGl0Jykge1xuICAgICAgLy8gUmVnRXhwW0BAc3BsaXRdIGRvZXNuJ3QgY2FsbCB0aGUgcmVnZXgncyBleGVjIG1ldGhvZCwgYnV0IGZpcnN0IGNyZWF0ZXNcbiAgICAgIC8vIGEgbmV3IG9uZS4gV2UgbmVlZCB0byByZXR1cm4gdGhlIHBhdGNoZWQgcmVnZXggd2hlbiBjcmVhdGluZyB0aGUgbmV3IG9uZS5cbiAgICAgIHJlLmNvbnN0cnVjdG9yID0ge307XG4gICAgICByZS5jb25zdHJ1Y3RvcltTUEVDSUVTXSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlOyB9O1xuICAgIH1cbiAgICByZVtTWU1CT0xdKCcnKTtcbiAgICByZXR1cm4gIWV4ZWNDYWxsZWQ7XG4gIH0pIDogdW5kZWZpbmVkO1xuXG4gIGlmIChcbiAgICAhREVMRUdBVEVTX1RPX1NZTUJPTCB8fFxuICAgICFERUxFR0FURVNfVE9fRVhFQyB8fFxuICAgIChLRVkgPT09ICdyZXBsYWNlJyAmJiAhUkVQTEFDRV9TVVBQT1JUU19OQU1FRF9HUk9VUFMpIHx8XG4gICAgKEtFWSA9PT0gJ3NwbGl0JyAmJiAhU1BMSVRfV09SS1NfV0lUSF9PVkVSV1JJVFRFTl9FWEVDKVxuICApIHtcbiAgICB2YXIgbmF0aXZlUmVnRXhwTWV0aG9kID0gLy4vW1NZTUJPTF07XG4gICAgdmFyIGZucyA9IGV4ZWMoXG4gICAgICBkZWZpbmVkLFxuICAgICAgU1lNQk9MLFxuICAgICAgJydbS0VZXSxcbiAgICAgIGZ1bmN0aW9uIG1heWJlQ2FsbE5hdGl2ZShuYXRpdmVNZXRob2QsIHJlZ2V4cCwgc3RyLCBhcmcyLCBmb3JjZVN0cmluZ01ldGhvZCkge1xuICAgICAgICBpZiAocmVnZXhwLmV4ZWMgPT09IHJlZ2V4cEV4ZWMpIHtcbiAgICAgICAgICBpZiAoREVMRUdBVEVTX1RPX1NZTUJPTCAmJiAhZm9yY2VTdHJpbmdNZXRob2QpIHtcbiAgICAgICAgICAgIC8vIFRoZSBuYXRpdmUgU3RyaW5nIG1ldGhvZCBhbHJlYWR5IGRlbGVnYXRlcyB0byBAQG1ldGhvZCAodGhpc1xuICAgICAgICAgICAgLy8gcG9seWZpbGxlZCBmdW5jdGlvbiksIGxlYXNpbmcgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgICAgICAgICAgLy8gV2UgYXZvaWQgaXQgYnkgZGlyZWN0bHkgY2FsbGluZyB0aGUgbmF0aXZlIEBAbWV0aG9kIG1ldGhvZC5cbiAgICAgICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiBuYXRpdmVSZWdFeHBNZXRob2QuY2FsbChyZWdleHAsIHN0ciwgYXJnMikgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHsgZG9uZTogdHJ1ZSwgdmFsdWU6IG5hdGl2ZU1ldGhvZC5jYWxsKHN0ciwgcmVnZXhwLCBhcmcyKSB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IGRvbmU6IGZhbHNlIH07XG4gICAgICB9XG4gICAgKTtcbiAgICB2YXIgc3RyZm4gPSBmbnNbMF07XG4gICAgdmFyIHJ4Zm4gPSBmbnNbMV07XG5cbiAgICByZWRlZmluZShTdHJpbmcucHJvdG90eXBlLCBLRVksIHN0cmZuKTtcbiAgICBoaWRlKFJlZ0V4cC5wcm90b3R5cGUsIFNZTUJPTCwgbGVuZ3RoID09IDJcbiAgICAgIC8vIDIxLjIuNS44IFJlZ0V4cC5wcm90b3R5cGVbQEByZXBsYWNlXShzdHJpbmcsIHJlcGxhY2VWYWx1ZSlcbiAgICAgIC8vIDIxLjIuNS4xMSBSZWdFeHAucHJvdG90eXBlW0BAc3BsaXRdKHN0cmluZywgbGltaXQpXG4gICAgICA/IGZ1bmN0aW9uIChzdHJpbmcsIGFyZykgeyByZXR1cm4gcnhmbi5jYWxsKHN0cmluZywgdGhpcywgYXJnKTsgfVxuICAgICAgLy8gMjEuMi41LjYgUmVnRXhwLnByb3RvdHlwZVtAQG1hdGNoXShzdHJpbmcpXG4gICAgICAvLyAyMS4yLjUuOSBSZWdFeHAucHJvdG90eXBlW0BAc2VhcmNoXShzdHJpbmcpXG4gICAgICA6IGZ1bmN0aW9uIChzdHJpbmcpIHsgcmV0dXJuIHJ4Zm4uY2FsbChzdHJpbmcsIHRoaXMpOyB9XG4gICAgKTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDIxLjIuNS4zIGdldCBSZWdFeHAucHJvdG90eXBlLmZsYWdzXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdGhhdCA9IGFuT2JqZWN0KHRoaXMpO1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIGlmICh0aGF0Lmdsb2JhbCkgcmVzdWx0ICs9ICdnJztcbiAgaWYgKHRoYXQuaWdub3JlQ2FzZSkgcmVzdWx0ICs9ICdpJztcbiAgaWYgKHRoYXQubXVsdGlsaW5lKSByZXN1bHQgKz0gJ20nO1xuICBpZiAodGhhdC51bmljb2RlKSByZXN1bHQgKz0gJ3UnO1xuICBpZiAodGhhdC5zdGlja3kpIHJlc3VsdCArPSAneSc7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNhbGwgPSByZXF1aXJlKCcuL19pdGVyLWNhbGwnKTtcbnZhciBpc0FycmF5SXRlciA9IHJlcXVpcmUoJy4vX2lzLWFycmF5LWl0ZXInKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgZ2V0SXRlckZuID0gcmVxdWlyZSgnLi9jb3JlLmdldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBCUkVBSyA9IHt9O1xudmFyIFJFVFVSTiA9IHt9O1xudmFyIGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQsIElURVJBVE9SKSB7XG4gIHZhciBpdGVyRm4gPSBJVEVSQVRPUiA/IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGl0ZXJhYmxlOyB9IDogZ2V0SXRlckZuKGl0ZXJhYmxlKTtcbiAgdmFyIGYgPSBjdHgoZm4sIHRoYXQsIGVudHJpZXMgPyAyIDogMSk7XG4gIHZhciBpbmRleCA9IDA7XG4gIHZhciBsZW5ndGgsIHN0ZXAsIGl0ZXJhdG9yLCByZXN1bHQ7XG4gIGlmICh0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcihpdGVyYWJsZSArICcgaXMgbm90IGl0ZXJhYmxlIScpO1xuICAvLyBmYXN0IGNhc2UgZm9yIGFycmF5cyB3aXRoIGRlZmF1bHQgaXRlcmF0b3JcbiAgaWYgKGlzQXJyYXlJdGVyKGl0ZXJGbikpIGZvciAobGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICByZXN1bHQgPSBlbnRyaWVzID8gZihhbk9iamVjdChzdGVwID0gaXRlcmFibGVbaW5kZXhdKVswXSwgc3RlcFsxXSkgOiBmKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSBmb3IgKGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7KSB7XG4gICAgcmVzdWx0ID0gY2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcyk7XG4gICAgaWYgKHJlc3VsdCA9PT0gQlJFQUsgfHwgcmVzdWx0ID09PSBSRVRVUk4pIHJldHVybiByZXN1bHQ7XG4gIH1cbn07XG5leHBvcnRzLkJSRUFLID0gQlJFQUs7XG5leHBvcnRzLlJFVFVSTiA9IFJFVFVSTjtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ25hdGl2ZS1mdW5jdGlvbi10by1zdHJpbmcnLCBGdW5jdGlvbi50b1N0cmluZyk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmXG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5pZiAodHlwZW9mIF9fZyA9PSAnbnVtYmVyJykgX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmXG4iLCJ2YXIgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBrZXkpIHtcbiAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgY3JlYXRlRGVzYyA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRQLmYob2JqZWN0LCBrZXksIGNyZWF0ZURlc2MoMSwgdmFsdWUpKTtcbn0gOiBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59O1xuIiwidmFyIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQ7XG5tb2R1bGUuZXhwb3J0cyA9IGRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnZGl2JyksICdhJywgeyBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH0gfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRoYXQsIHRhcmdldCwgQykge1xuICB2YXIgUyA9IHRhcmdldC5jb25zdHJ1Y3RvcjtcbiAgdmFyIFA7XG4gIGlmIChTICE9PSBDICYmIHR5cGVvZiBTID09ICdmdW5jdGlvbicgJiYgKFAgPSBTLnByb3RvdHlwZSkgIT09IEMucHJvdG90eXBlICYmIGlzT2JqZWN0KFApICYmIHNldFByb3RvdHlwZU9mKSB7XG4gICAgc2V0UHJvdG90eXBlT2YodGhhdCwgUCk7XG4gIH0gcmV0dXJuIHRoYXQ7XG59O1xuIiwiLy8gZmFzdCBhcHBseSwgaHR0cDovL2pzcGVyZi5sbmtpdC5jb20vZmFzdC1hcHBseS81XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgYXJncywgdGhhdCkge1xuICB2YXIgdW4gPSB0aGF0ID09PSB1bmRlZmluZWQ7XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCk7XG4gICAgY2FzZSAxOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcbiAgICBjYXNlIDI6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0pO1xuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSk7XG4gICAgY2FzZSA0OiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcbiAgfSByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJncyk7XG59O1xuIiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xufTtcbiIsIi8vIGNoZWNrIG9uIGRlZmF1bHQgQXJyYXkgaXRlcmF0b3JcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEFycmF5UHJvdG8gPSBBcnJheS5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAhPT0gdW5kZWZpbmVkICYmIChJdGVyYXRvcnMuQXJyYXkgPT09IGl0IHx8IEFycmF5UHJvdG9bSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZykge1xuICByZXR1cm4gY29mKGFyZykgPT0gJ0FycmF5Jztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09PSAnb2JqZWN0JyA/IGl0ICE9PSBudWxsIDogdHlwZW9mIGl0ID09PSAnZnVuY3Rpb24nO1xufTtcbiIsIi8vIDcuMi44IElzUmVnRXhwKGFyZ3VtZW50KVxudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG52YXIgTUFUQ0ggPSByZXF1aXJlKCcuL193a3MnKSgnbWF0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBpc1JlZ0V4cDtcbiAgcmV0dXJuIGlzT2JqZWN0KGl0KSAmJiAoKGlzUmVnRXhwID0gaXRbTUFUQ0hdKSAhPT0gdW5kZWZpbmVkID8gISFpc1JlZ0V4cCA6IGNvZihpdCkgPT0gJ1JlZ0V4cCcpO1xufTtcbiIsIi8vIGNhbGwgc29tZXRoaW5nIG9uIGl0ZXJhdG9yIHN0ZXAgd2l0aCBzYWZlIGNsb3Npbmcgb24gZXJyb3JcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmF0b3IsIGZuLCB2YWx1ZSwgZW50cmllcykge1xuICB0cnkge1xuICAgIHJldHVybiBlbnRyaWVzID8gZm4oYW5PYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XG4gIC8vIDcuNC42IEl0ZXJhdG9yQ2xvc2UoaXRlcmF0b3IsIGNvbXBsZXRpb24pXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB2YXIgcmV0ID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICAgIGlmIChyZXQgIT09IHVuZGVmaW5lZCkgYW5PYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcbiAgICB0aHJvdyBlO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBkZXNjcmlwdG9yID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xuXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faGlkZScpKEl0ZXJhdG9yUHJvdG90eXBlLCByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KSB7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwgeyBuZXh0OiBkZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgTElCUkFSWSA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgJGl0ZXJDcmVhdGUgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcbnZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZID0gIShbXS5rZXlzICYmICduZXh0JyBpbiBbXS5rZXlzKCkpOyAvLyBTYWZhcmkgaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG52YXIgRkZfSVRFUkFUT1IgPSAnQEBpdGVyYXRvcic7XG52YXIgS0VZUyA9ICdrZXlzJztcbnZhciBWQUxVRVMgPSAndmFsdWVzJztcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRUQpIHtcbiAgJGl0ZXJDcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xuICB2YXIgZ2V0TWV0aG9kID0gZnVuY3Rpb24gKGtpbmQpIHtcbiAgICBpZiAoIUJVR0dZICYmIGtpbmQgaW4gcHJvdG8pIHJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgS0VZUzogcmV0dXJuIGZ1bmN0aW9uIGtleXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgICB9IHJldHVybiBmdW5jdGlvbiBlbnRyaWVzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICB9O1xuICB2YXIgVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgREVGX1ZBTFVFUyA9IERFRkFVTFQgPT0gVkFMVUVTO1xuICB2YXIgVkFMVUVTX0JVRyA9IGZhbHNlO1xuICB2YXIgcHJvdG8gPSBCYXNlLnByb3RvdHlwZTtcbiAgdmFyICRuYXRpdmUgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF07XG4gIHZhciAkZGVmYXVsdCA9ICRuYXRpdmUgfHwgZ2V0TWV0aG9kKERFRkFVTFQpO1xuICB2YXIgJGVudHJpZXMgPSBERUZBVUxUID8gIURFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZCgnZW50cmllcycpIDogdW5kZWZpbmVkO1xuICB2YXIgJGFueU5hdGl2ZSA9IE5BTUUgPT0gJ0FycmF5JyA/IHByb3RvLmVudHJpZXMgfHwgJG5hdGl2ZSA6ICRuYXRpdmU7XG4gIHZhciBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmICgkYW55TmF0aXZlKSB7XG4gICAgSXRlcmF0b3JQcm90b3R5cGUgPSBnZXRQcm90b3R5cGVPZigkYW55TmF0aXZlLmNhbGwobmV3IEJhc2UoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBJdGVyYXRvclByb3RvdHlwZS5uZXh0KSB7XG4gICAgICAvLyBTZXQgQEB0b1N0cmluZ1RhZyB0byBuYXRpdmUgaXRlcmF0b3JzXG4gICAgICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcbiAgICAgIC8vIGZpeCBmb3Igc29tZSBvbGQgZW5naW5lc1xuICAgICAgaWYgKCFMSUJSQVJZICYmIHR5cGVvZiBJdGVyYXRvclByb3RvdHlwZVtJVEVSQVRPUl0gIT0gJ2Z1bmN0aW9uJykgaGlkZShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xuICAgIH1cbiAgfVxuICAvLyBmaXggQXJyYXkje3ZhbHVlcywgQEBpdGVyYXRvcn0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZfVkFMVUVTICYmICRuYXRpdmUgJiYgJG5hdGl2ZS5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuICRuYXRpdmUuY2FsbCh0aGlzKTsgfTtcbiAgfVxuICAvLyBEZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghTElCUkFSWSB8fCBGT1JDRUQpICYmIChCVUdHWSB8fCBWQUxVRVNfQlVHIHx8ICFwcm90b1tJVEVSQVRPUl0pKSB7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSA9IHJldHVyblRoaXM7XG4gIGlmIChERUZBVUxUKSB7XG4gICAgbWV0aG9kcyA9IHtcbiAgICAgIHZhbHVlczogREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiBJU19TRVQgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChLRVlTKSxcbiAgICAgIGVudHJpZXM6ICRlbnRyaWVzXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKGtleSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoIShrZXkgaW4gcHJvdG8pKSByZWRlZmluZShwcm90bywga2V5LCBtZXRob2RzW2tleV0pO1xuICAgIH0gZWxzZSAkZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIChCVUdHWSB8fCBWQUxVRVNfQlVHKSwgTkFNRSwgbWV0aG9kcyk7XG4gIH1cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgU0FGRV9DTE9TSU5HID0gZmFsc2U7XG5cbnRyeSB7XG4gIHZhciByaXRlciA9IFs3XVtJVEVSQVRPUl0oKTtcbiAgcml0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24gKCkgeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdGhyb3ctbGl0ZXJhbFxuICBBcnJheS5mcm9tKHJpdGVyLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMsIHNraXBDbG9zaW5nKSB7XG4gIGlmICghc2tpcENsb3NpbmcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgc2FmZSA9IGZhbHNlO1xuICB0cnkge1xuICAgIHZhciBhcnIgPSBbN107XG4gICAgdmFyIGl0ZXIgPSBhcnJbSVRFUkFUT1JdKCk7XG4gICAgaXRlci5uZXh0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4geyBkb25lOiBzYWZlID0gdHJ1ZSB9OyB9O1xuICAgIGFycltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyOyB9O1xuICAgIGV4ZWMoYXJyKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBzYWZlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGRvbmUsIHZhbHVlKSB7XG4gIHJldHVybiB7IHZhbHVlOiB2YWx1ZSwgZG9uZTogISFkb25lIH07XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZmFsc2U7XG4iLCJ2YXIgTUVUQSA9IHJlcXVpcmUoJy4vX3VpZCcpKCdtZXRhJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBzZXREZXNjID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBpZCA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0cnVlO1xufTtcbnZhciBGUkVFWkUgPSAhcmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBpc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcbnZhciBzZXRNZXRhID0gZnVuY3Rpb24gKGl0KSB7XG4gIHNldERlc2MoaXQsIE1FVEEsIHsgdmFsdWU6IHtcbiAgICBpOiAnTycgKyArK2lkLCAvLyBvYmplY3QgSURcbiAgICB3OiB7fSAgICAgICAgICAvLyB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IH0pO1xufTtcbnZhciBmYXN0S2V5ID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgLy8gcmV0dXJuIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYgKCFoYXMoaXQsIE1FVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiAnRic7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbiAoaXQsIGNyZWF0ZSkge1xuICBpZiAoIWhhcyhpdCwgTUVUQSkpIHtcbiAgICAvLyBjYW4ndCBzZXQgbWV0YWRhdGEgdG8gdW5jYXVnaHQgZnJvemVuIG9iamVjdFxuICAgIGlmICghaXNFeHRlbnNpYmxlKGl0KSkgcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZiAoIWNyZWF0ZSkgcmV0dXJuIGZhbHNlO1xuICAgIC8vIGFkZCBtaXNzaW5nIG1ldGFkYXRhXG4gICAgc2V0TWV0YShpdCk7XG4gIC8vIHJldHVybiBoYXNoIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gcmV0dXJuIGl0W01FVEFdLnc7XG59O1xuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKEZSRUVaRSAmJiBtZXRhLk5FRUQgJiYgaXNFeHRlbnNpYmxlKGl0KSAmJiAhaGFzKGl0LCBNRVRBKSkgc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6IE1FVEEsXG4gIE5FRUQ6IGZhbHNlLFxuICBmYXN0S2V5OiBmYXN0S2V5LFxuICBnZXRXZWFrOiBnZXRXZWFrLFxuICBvbkZyZWV6ZTogb25GcmVlemVcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgbWFjcm90YXNrID0gcmVxdWlyZSgnLi9fdGFzaycpLnNldDtcbnZhciBPYnNlcnZlciA9IGdsb2JhbC5NdXRhdGlvbk9ic2VydmVyIHx8IGdsb2JhbC5XZWJLaXRNdXRhdGlvbk9ic2VydmVyO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBQcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG52YXIgaXNOb2RlID0gcmVxdWlyZSgnLi9fY29mJykocHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGhlYWQsIGxhc3QsIG5vdGlmeTtcblxuICB2YXIgZmx1c2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHBhcmVudCwgZm47XG4gICAgaWYgKGlzTm9kZSAmJiAocGFyZW50ID0gcHJvY2Vzcy5kb21haW4pKSBwYXJlbnQuZXhpdCgpO1xuICAgIHdoaWxlIChoZWFkKSB7XG4gICAgICBmbiA9IGhlYWQuZm47XG4gICAgICBoZWFkID0gaGVhZC5uZXh0O1xuICAgICAgdHJ5IHtcbiAgICAgICAgZm4oKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGhlYWQpIG5vdGlmeSgpO1xuICAgICAgICBlbHNlIGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRocm93IGU7XG4gICAgICB9XG4gICAgfSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgIGlmIChwYXJlbnQpIHBhcmVudC5lbnRlcigpO1xuICB9O1xuXG4gIC8vIE5vZGUuanNcbiAgaWYgKGlzTm9kZSkge1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHByb2Nlc3MubmV4dFRpY2soZmx1c2gpO1xuICAgIH07XG4gIC8vIGJyb3dzZXJzIHdpdGggTXV0YXRpb25PYnNlcnZlciwgZXhjZXB0IGlPUyBTYWZhcmkgLSBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMzM5XG4gIH0gZWxzZSBpZiAoT2JzZXJ2ZXIgJiYgIShnbG9iYWwubmF2aWdhdG9yICYmIGdsb2JhbC5uYXZpZ2F0b3Iuc3RhbmRhbG9uZSkpIHtcbiAgICB2YXIgdG9nZ2xlID0gdHJ1ZTtcbiAgICB2YXIgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBuZXcgT2JzZXJ2ZXIoZmx1c2gpLm9ic2VydmUobm9kZSwgeyBjaGFyYWN0ZXJEYXRhOiB0cnVlIH0pOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xuICAgIG5vdGlmeSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIG5vZGUuZGF0YSA9IHRvZ2dsZSA9ICF0b2dnbGU7XG4gICAgfTtcbiAgLy8gZW52aXJvbm1lbnRzIHdpdGggbWF5YmUgbm9uLWNvbXBsZXRlbHkgY29ycmVjdCwgYnV0IGV4aXN0ZW50IFByb21pc2VcbiAgfSBlbHNlIGlmIChQcm9taXNlICYmIFByb21pc2UucmVzb2x2ZSkge1xuICAgIC8vIFByb21pc2UucmVzb2x2ZSB3aXRob3V0IGFuIGFyZ3VtZW50IHRocm93cyBhbiBlcnJvciBpbiBMRyBXZWJPUyAyXG4gICAgdmFyIHByb21pc2UgPSBQcm9taXNlLnJlc29sdmUodW5kZWZpbmVkKTtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9taXNlLnRoZW4oZmx1c2gpO1xuICAgIH07XG4gIC8vIGZvciBvdGhlciBlbnZpcm9ubWVudHMgLSBtYWNyb3Rhc2sgYmFzZWQgb246XG4gIC8vIC0gc2V0SW1tZWRpYXRlXG4gIC8vIC0gTWVzc2FnZUNoYW5uZWxcbiAgLy8gLSB3aW5kb3cucG9zdE1lc3NhZ1xuICAvLyAtIG9ucmVhZHlzdGF0ZWNoYW5nZVxuICAvLyAtIHNldFRpbWVvdXRcbiAgfSBlbHNlIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAvLyBzdHJhbmdlIElFICsgd2VicGFjayBkZXYgc2VydmVyIGJ1ZyAtIHVzZSAuY2FsbChnbG9iYWwpXG4gICAgICBtYWNyb3Rhc2suY2FsbChnbG9iYWwsIGZsdXNoKTtcbiAgICB9O1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIChmbikge1xuICAgIHZhciB0YXNrID0geyBmbjogZm4sIG5leHQ6IHVuZGVmaW5lZCB9O1xuICAgIGlmIChsYXN0KSBsYXN0Lm5leHQgPSB0YXNrO1xuICAgIGlmICghaGVhZCkge1xuICAgICAgaGVhZCA9IHRhc2s7XG4gICAgICBub3RpZnkoKTtcbiAgICB9IGxhc3QgPSB0YXNrO1xuICB9O1xufTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIDI1LjQuMS41IE5ld1Byb21pc2VDYXBhYmlsaXR5KEMpXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xuXG5mdW5jdGlvbiBQcm9taXNlQ2FwYWJpbGl0eShDKSB7XG4gIHZhciByZXNvbHZlLCByZWplY3Q7XG4gIHRoaXMucHJvbWlzZSA9IG5ldyBDKGZ1bmN0aW9uICgkJHJlc29sdmUsICQkcmVqZWN0KSB7XG4gICAgaWYgKHJlc29sdmUgIT09IHVuZGVmaW5lZCB8fCByZWplY3QgIT09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKCdCYWQgUHJvbWlzZSBjb25zdHJ1Y3RvcicpO1xuICAgIHJlc29sdmUgPSAkJHJlc29sdmU7XG4gICAgcmVqZWN0ID0gJCRyZWplY3Q7XG4gIH0pO1xuICB0aGlzLnJlc29sdmUgPSBhRnVuY3Rpb24ocmVzb2x2ZSk7XG4gIHRoaXMucmVqZWN0ID0gYUZ1bmN0aW9uKHJlamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiAoQykge1xuICByZXR1cm4gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpO1xufTtcbiIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgZFBzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIEVtcHR5ID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IHJlcXVpcmUoJy4vX2RvbS1jcmVhdGUnKSgnaWZyYW1lJyk7XG4gIHZhciBpID0gZW51bUJ1Z0tleXMubGVuZ3RoO1xuICB2YXIgbHQgPSAnPCc7XG4gIHZhciBndCA9ICc+JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZnJhbWUuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgcmVxdWlyZSgnLi9faHRtbCcpLmFwcGVuZENoaWxkKGlmcmFtZSk7XG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcbiAgLy8gY3JlYXRlRGljdCA9IGlmcmFtZS5jb250ZW50V2luZG93Lk9iamVjdDtcbiAgLy8gaHRtbC5yZW1vdmVDaGlsZChpZnJhbWUpO1xuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICBpZnJhbWVEb2N1bWVudC5vcGVuKCk7XG4gIGlmcmFtZURvY3VtZW50LndyaXRlKGx0ICsgJ3NjcmlwdCcgKyBndCArICdkb2N1bWVudC5GPU9iamVjdCcgKyBsdCArICcvc2NyaXB0JyArIGd0KTtcbiAgaWZyYW1lRG9jdW1lbnQuY2xvc2UoKTtcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XG4gIHdoaWxlIChpLS0pIGRlbGV0ZSBjcmVhdGVEaWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbaV1dO1xuICByZXR1cm4gY3JlYXRlRGljdCgpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuY3JlYXRlIHx8IGZ1bmN0aW9uIGNyZWF0ZShPLCBQcm9wZXJ0aWVzKSB7XG4gIHZhciByZXN1bHQ7XG4gIGlmIChPICE9PSBudWxsKSB7XG4gICAgRW1wdHlbUFJPVE9UWVBFXSA9IGFuT2JqZWN0KE8pO1xuICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGRQID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJpbWl0aXZlKFAsIHRydWUpO1xuICBhbk9iamVjdChBdHRyaWJ1dGVzKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmICgnZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpIHRocm93IFR5cGVFcnJvcignQWNjZXNzb3JzIG5vdCBzdXBwb3J0ZWQhJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcykge1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleXMgPSBnZXRLZXlzKFByb3BlcnRpZXMpO1xuICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gIHZhciBpID0gMDtcbiAgdmFyIFA7XG4gIHdoaWxlIChsZW5ndGggPiBpKSBkUC5mKE8sIFAgPSBrZXlzW2krK10sIFByb3BlcnRpZXNbUF0pO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvUHJpbWl0aXZlID0gcmVxdWlyZSgnLi9fdG8tcHJpbWl0aXZlJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpO1xudmFyIGdPUEQgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gZ09QRCA6IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKSB7XG4gIE8gPSB0b0lPYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiBnT1BEKE8sIFApO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbiAgaWYgKGhhcyhPLCBQKSkgcmV0dXJuIGNyZWF0ZURlc2MoIXBJRS5mLmNhbGwoTywgUCksIE9bUF0pO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBJRTExIGJ1Z2d5IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHdpdGggaWZyYW1lIGFuZCB3aW5kb3dcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgZ09QTiA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZjtcbnZhciB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGdPUE4oaXQpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHdpbmRvd05hbWVzLnNsaWNlKCk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKGl0KSB7XG4gIHJldHVybiB3aW5kb3dOYW1lcyAmJiB0b1N0cmluZy5jYWxsKGl0KSA9PSAnW29iamVjdCBXaW5kb3ddJyA/IGdldFdpbmRvd05hbWVzKGl0KSA6IGdPUE4odG9JT2JqZWN0KGl0KSk7XG59O1xuIiwiLy8gMTkuMS4yLjcgLyAxNS4yLjMuNCBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpLmNvbmNhdCgnbGVuZ3RoJywgJ3Byb3RvdHlwZScpO1xuXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGhpZGRlbktleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG4iLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG52YXIgT2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5nZXRQcm90b3R5cGVPZiB8fCBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG8gOiBudWxsO1xufTtcbiIsInZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgYXJyYXlJbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgSUVfUFJPVE8gPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgbmFtZXMpIHtcbiAgdmFyIE8gPSB0b0lPYmplY3Qob2JqZWN0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIE8pIGlmIChrZXkgIT0gSUVfUFJPVE8pIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+YXJyYXlJbmRleE9mKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xuICB9XG4gIHJldHVybiByZXN1bHQ7XG59O1xuIiwiLy8gMTkuMS4yLjE0IC8gMTUuMi4zLjE0IE9iamVjdC5rZXlzKE8pXG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5rZXlzIHx8IGZ1bmN0aW9uIGtleXMoTykge1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTtcbiIsImV4cG9ydHMuZiA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuIiwiLy8gbW9zdCBPYmplY3QgbWV0aG9kcyBieSBFUzYgc2hvdWxkIGFjY2VwdCBwcmltaXRpdmVzXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBleGVjKSB7XG4gIHZhciBmbiA9IChjb3JlLk9iamVjdCB8fCB7fSlbS0VZXSB8fCBPYmplY3RbS0VZXTtcbiAgdmFyIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uICgpIHsgZm4oMSk7IH0pLCAnT2JqZWN0JywgZXhwKTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIHsgZTogZmFsc2UsIHY6IGV4ZWMoKSB9O1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIHsgZTogdHJ1ZSwgdjogZSB9O1xuICB9XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQywgeCkge1xuICBhbk9iamVjdChDKTtcbiAgaWYgKGlzT2JqZWN0KHgpICYmIHguY29uc3RydWN0b3IgPT09IEMpIHJldHVybiB4O1xuICB2YXIgcHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eS5mKEMpO1xuICB2YXIgcmVzb2x2ZSA9IHByb21pc2VDYXBhYmlsaXR5LnJlc29sdmU7XG4gIHJlc29sdmUoeCk7XG4gIHJldHVybiBwcm9taXNlQ2FwYWJpbGl0eS5wcm9taXNlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGJpdG1hcCwgdmFsdWUpIHtcbiAgcmV0dXJuIHtcbiAgICBlbnVtZXJhYmxlOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZTogIShiaXRtYXAgJiA0KSxcbiAgICB2YWx1ZTogdmFsdWVcbiAgfTtcbn07XG4iLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIHNhZmUpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldLCBzYWZlKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGlkZSA9IHJlcXVpcmUoJy4vX2hpZGUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBTUkMgPSByZXF1aXJlKCcuL191aWQnKSgnc3JjJyk7XG52YXIgJHRvU3RyaW5nID0gcmVxdWlyZSgnLi9fZnVuY3Rpb24tdG8tc3RyaW5nJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBUUEwgPSAoJycgKyAkdG9TdHJpbmcpLnNwbGl0KFRPX1NUUklORyk7XG5cbnJlcXVpcmUoJy4vX2NvcmUnKS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiAkdG9TdHJpbmcuY2FsbChpdCk7XG59O1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWwsIHNhZmUpIHtcbiAgdmFyIGlzRnVuY3Rpb24gPSB0eXBlb2YgdmFsID09ICdmdW5jdGlvbic7XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCAnbmFtZScpIHx8IGhpZGUodmFsLCAnbmFtZScsIGtleSk7XG4gIGlmIChPW2tleV0gPT09IHZhbCkgcmV0dXJuO1xuICBpZiAoaXNGdW5jdGlvbikgaGFzKHZhbCwgU1JDKSB8fCBoaWRlKHZhbCwgU1JDLCBPW2tleV0gPyAnJyArIE9ba2V5XSA6IFRQTC5qb2luKFN0cmluZyhrZXkpKSk7XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBPW2tleV0gPSB2YWw7XG4gIH0gZWxzZSBpZiAoIXNhZmUpIHtcbiAgICBkZWxldGUgT1trZXldO1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9IGVsc2UgaWYgKE9ba2V5XSkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIHtcbiAgICBoaWRlKE8sIGtleSwgdmFsKTtcbiAgfVxuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiB0eXBlb2YgdGhpcyA9PSAnZnVuY3Rpb24nICYmIHRoaXNbU1JDXSB8fCAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciBidWlsdGluRXhlYyA9IFJlZ0V4cC5wcm90b3R5cGUuZXhlYztcblxuIC8vIGBSZWdFeHBFeGVjYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXJlZ2V4cGV4ZWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFIsIFMpIHtcbiAgdmFyIGV4ZWMgPSBSLmV4ZWM7XG4gIGlmICh0eXBlb2YgZXhlYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciByZXN1bHQgPSBleGVjLmNhbGwoUiwgUyk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWdFeHAgZXhlYyBtZXRob2QgcmV0dXJuZWQgc29tZXRoaW5nIG90aGVyIHRoYW4gYW4gT2JqZWN0IG9yIG51bGwnKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuICBpZiAoY2xhc3NvZihSKSAhPT0gJ1JlZ0V4cCcpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdSZWdFeHAjZXhlYyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG4gIH1cbiAgcmV0dXJuIGJ1aWx0aW5FeGVjLmNhbGwoUiwgUyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVnZXhwRmxhZ3MgPSByZXF1aXJlKCcuL19mbGFncycpO1xuXG52YXIgbmF0aXZlRXhlYyA9IFJlZ0V4cC5wcm90b3R5cGUuZXhlYztcbi8vIFRoaXMgYWx3YXlzIHJlZmVycyB0byB0aGUgbmF0aXZlIGltcGxlbWVudGF0aW9uLCBiZWNhdXNlIHRoZVxuLy8gU3RyaW5nI3JlcGxhY2UgcG9seWZpbGwgdXNlcyAuL2ZpeC1yZWdleHAtd2VsbC1rbm93bi1zeW1ib2wtbG9naWMuanMsXG4vLyB3aGljaCBsb2FkcyB0aGlzIGZpbGUgYmVmb3JlIHBhdGNoaW5nIHRoZSBtZXRob2QuXG52YXIgbmF0aXZlUmVwbGFjZSA9IFN0cmluZy5wcm90b3R5cGUucmVwbGFjZTtcblxudmFyIHBhdGNoZWRFeGVjID0gbmF0aXZlRXhlYztcblxudmFyIExBU1RfSU5ERVggPSAnbGFzdEluZGV4JztcblxudmFyIFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyA9IChmdW5jdGlvbiAoKSB7XG4gIHZhciByZTEgPSAvYS8sXG4gICAgICByZTIgPSAvYiovZztcbiAgbmF0aXZlRXhlYy5jYWxsKHJlMSwgJ2EnKTtcbiAgbmF0aXZlRXhlYy5jYWxsKHJlMiwgJ2EnKTtcbiAgcmV0dXJuIHJlMVtMQVNUX0lOREVYXSAhPT0gMCB8fCByZTJbTEFTVF9JTkRFWF0gIT09IDA7XG59KSgpO1xuXG4vLyBub25wYXJ0aWNpcGF0aW5nIGNhcHR1cmluZyBncm91cCwgY29waWVkIGZyb20gZXM1LXNoaW0ncyBTdHJpbmcjc3BsaXQgcGF0Y2guXG52YXIgTlBDR19JTkNMVURFRCA9IC8oKT8/Ly5leGVjKCcnKVsxXSAhPT0gdW5kZWZpbmVkO1xuXG52YXIgUEFUQ0ggPSBVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgfHwgTlBDR19JTkNMVURFRDtcblxuaWYgKFBBVENIKSB7XG4gIHBhdGNoZWRFeGVjID0gZnVuY3Rpb24gZXhlYyhzdHIpIHtcbiAgICB2YXIgcmUgPSB0aGlzO1xuICAgIHZhciBsYXN0SW5kZXgsIHJlQ29weSwgbWF0Y2gsIGk7XG5cbiAgICBpZiAoTlBDR19JTkNMVURFRCkge1xuICAgICAgcmVDb3B5ID0gbmV3IFJlZ0V4cCgnXicgKyByZS5zb3VyY2UgKyAnJCg/IVxcXFxzKScsIHJlZ2V4cEZsYWdzLmNhbGwocmUpKTtcbiAgICB9XG4gICAgaWYgKFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORykgbGFzdEluZGV4ID0gcmVbTEFTVF9JTkRFWF07XG5cbiAgICBtYXRjaCA9IG5hdGl2ZUV4ZWMuY2FsbChyZSwgc3RyKTtcblxuICAgIGlmIChVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgJiYgbWF0Y2gpIHtcbiAgICAgIHJlW0xBU1RfSU5ERVhdID0gcmUuZ2xvYmFsID8gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGggOiBsYXN0SW5kZXg7XG4gICAgfVxuICAgIGlmIChOUENHX0lOQ0xVREVEICYmIG1hdGNoICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgXG4gICAgICAvLyBmb3IgTlBDRywgbGlrZSBJRTguIE5PVEU6IFRoaXMgZG9lc24nIHdvcmsgZm9yIC8oLj8pPy9cbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1sb29wLWZ1bmNcbiAgICAgIG5hdGl2ZVJlcGxhY2UuY2FsbChtYXRjaFswXSwgcmVDb3B5LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSA9PT0gdW5kZWZpbmVkKSBtYXRjaFtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoO1xuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHBhdGNoZWRFeGVjO1xuIiwiLy8gV29ya3Mgd2l0aCBfX3Byb3RvX18gb25seS4gT2xkIHY4IGNhbid0IHdvcmsgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBjaGVjayA9IGZ1bmN0aW9uIChPLCBwcm90bykge1xuICBhbk9iamVjdChPKTtcbiAgaWYgKCFpc09iamVjdChwcm90bykgJiYgcHJvdG8gIT09IG51bGwpIHRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uICh0ZXN0LCBidWdneSwgc2V0KSB7XG4gICAgICB0cnkge1xuICAgICAgICBzZXQgPSByZXF1aXJlKCcuL19jdHgnKShGdW5jdGlvbi5jYWxsLCByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmYoT2JqZWN0LnByb3RvdHlwZSwgJ19fcHJvdG9fXycpLnNldCwgMik7XG4gICAgICAgIHNldCh0ZXN0LCBbXSk7XG4gICAgICAgIGJ1Z2d5ID0gISh0ZXN0IGluc3RhbmNlb2YgQXJyYXkpO1xuICAgICAgfSBjYXRjaCAoZSkgeyBidWdneSA9IHRydWU7IH1cbiAgICAgIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90bykge1xuICAgICAgICBjaGVjayhPLCBwcm90byk7XG4gICAgICAgIGlmIChidWdneSkgTy5fX3Byb3RvX18gPSBwcm90bztcbiAgICAgICAgZWxzZSBzZXQoTywgcHJvdG8pO1xuICAgICAgICByZXR1cm4gTztcbiAgICAgIH07XG4gICAgfSh7fSwgZmFsc2UpIDogdW5kZWZpbmVkKSxcbiAgY2hlY2s6IGNoZWNrXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIFNQRUNJRVMgPSByZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgdmFyIEMgPSBnbG9iYWxbS0VZXTtcbiAgaWYgKERFU0NSSVBUT1JTICYmIEMgJiYgIUNbU1BFQ0lFU10pIGRQLmYoQywgU1BFQ0lFUywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH1cbiAgfSk7XG59O1xuIiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCB0YWcsIHN0YXQpIHtcbiAgaWYgKGl0ICYmICFoYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpIGRlZihpdCwgVEFHLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgdmFsdWU6IHRhZyB9KTtcbn07XG4iLCJ2YXIgc2hhcmVkID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ2tleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gc2hhcmVkW2tleV0gfHwgKHNoYXJlZFtrZXldID0gdWlkKGtleSkpO1xufTtcbiIsInZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nO1xudmFyIHN0b3JlID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHZhbHVlICE9PSB1bmRlZmluZWQgPyB2YWx1ZSA6IHt9KTtcbn0pKCd2ZXJzaW9ucycsIFtdKS5wdXNoKHtcbiAgdmVyc2lvbjogY29yZS52ZXJzaW9uLFxuICBtb2RlOiByZXF1aXJlKCcuL19saWJyYXJ5JykgPyAncHVyZScgOiAnZ2xvYmFsJyxcbiAgY29weXJpZ2h0OiAnwqkgMjAxOSBEZW5pcyBQdXNoa2FyZXYgKHpsb2lyb2NrLnJ1KSdcbn0pO1xuIiwiLy8gNy4zLjIwIFNwZWNpZXNDb25zdHJ1Y3RvcihPLCBkZWZhdWx0Q29uc3RydWN0b3IpXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBEKSB7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3I7XG4gIHZhciBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IEQgOiBhRnVuY3Rpb24oUyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobWV0aG9kLCBhcmcpIHtcbiAgcmV0dXJuICEhbWV0aG9kICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdXNlbGVzcy1jYWxsXG4gICAgYXJnID8gbWV0aG9kLmNhbGwobnVsbCwgZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9LCAxKSA6IG1ldGhvZC5jYWxsKG51bGwpO1xuICB9KTtcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG4vLyB0cnVlICAtPiBTdHJpbmcjYXRcbi8vIGZhbHNlIC0+IFN0cmluZyNjb2RlUG9pbnRBdFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoVE9fU1RSSU5HKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgcG9zKSB7XG4gICAgdmFyIHMgPSBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG4gICAgdmFyIGkgPSB0b0ludGVnZXIocG9zKTtcbiAgICB2YXIgbCA9IHMubGVuZ3RoO1xuICAgIHZhciBhLCBiO1xuICAgIGlmIChpIDwgMCB8fCBpID49IGwpIHJldHVybiBUT19TVFJJTkcgPyAnJyA6IHVuZGVmaW5lZDtcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xuICAgIHJldHVybiBhIDwgMHhkODAwIHx8IGEgPiAweGRiZmYgfHwgaSArIDEgPT09IGwgfHwgKGIgPSBzLmNoYXJDb2RlQXQoaSArIDEpKSA8IDB4ZGMwMCB8fCBiID4gMHhkZmZmXG4gICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxuICAgICAgOiBUT19TVFJJTkcgPyBzLnNsaWNlKGksIGkgKyAyKSA6IChhIC0gMHhkODAwIDw8IDEwKSArIChiIC0gMHhkYzAwKSArIDB4MTAwMDA7XG4gIH07XG59O1xuIiwiLy8gaGVscGVyIGZvciBTdHJpbmcje3N0YXJ0c1dpdGgsIGVuZHNXaXRoLCBpbmNsdWRlc31cbnZhciBpc1JlZ0V4cCA9IHJlcXVpcmUoJy4vX2lzLXJlZ2V4cCcpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHRoYXQsIHNlYXJjaFN0cmluZywgTkFNRSkge1xuICBpZiAoaXNSZWdFeHAoc2VhcmNoU3RyaW5nKSkgdGhyb3cgVHlwZUVycm9yKCdTdHJpbmcjJyArIE5BTUUgKyBcIiBkb2Vzbid0IGFjY2VwdCByZWdleCFcIik7XG4gIHJldHVybiBTdHJpbmcoZGVmaW5lZCh0aGF0KSk7XG59O1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbnZhciBxdW90ID0gL1wiL2c7XG4vLyBCLjIuMy4yLjEgQ3JlYXRlSFRNTChzdHJpbmcsIHRhZywgYXR0cmlidXRlLCB2YWx1ZSlcbnZhciBjcmVhdGVIVE1MID0gZnVuY3Rpb24gKHN0cmluZywgdGFnLCBhdHRyaWJ1dGUsIHZhbHVlKSB7XG4gIHZhciBTID0gU3RyaW5nKGRlZmluZWQoc3RyaW5nKSk7XG4gIHZhciBwMSA9ICc8JyArIHRhZztcbiAgaWYgKGF0dHJpYnV0ZSAhPT0gJycpIHAxICs9ICcgJyArIGF0dHJpYnV0ZSArICc9XCInICsgU3RyaW5nKHZhbHVlKS5yZXBsYWNlKHF1b3QsICcmcXVvdDsnKSArICdcIic7XG4gIHJldHVybiBwMSArICc+JyArIFMgKyAnPC8nICsgdGFnICsgJz4nO1xufTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE5BTUUsIGV4ZWMpIHtcbiAgdmFyIE8gPSB7fTtcbiAgT1tOQU1FXSA9IGV4ZWMoY3JlYXRlSFRNTCk7XG4gICRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIHZhciB0ZXN0ID0gJydbTkFNRV0oJ1wiJyk7XG4gICAgcmV0dXJuIHRlc3QgIT09IHRlc3QudG9Mb3dlckNhc2UoKSB8fCB0ZXN0LnNwbGl0KCdcIicpLmxlbmd0aCA+IDM7XG4gIH0pLCAnU3RyaW5nJywgTyk7XG59O1xuIiwidmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGludm9rZSA9IHJlcXVpcmUoJy4vX2ludm9rZScpO1xudmFyIGh0bWwgPSByZXF1aXJlKCcuL19odG1sJyk7XG52YXIgY2VsID0gcmVxdWlyZSgnLi9fZG9tLWNyZWF0ZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBzZXRUYXNrID0gZ2xvYmFsLnNldEltbWVkaWF0ZTtcbnZhciBjbGVhclRhc2sgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGU7XG52YXIgTWVzc2FnZUNoYW5uZWwgPSBnbG9iYWwuTWVzc2FnZUNoYW5uZWw7XG52YXIgRGlzcGF0Y2ggPSBnbG9iYWwuRGlzcGF0Y2g7XG52YXIgY291bnRlciA9IDA7XG52YXIgcXVldWUgPSB7fTtcbnZhciBPTlJFQURZU1RBVEVDSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcbnZhciBkZWZlciwgY2hhbm5lbCwgcG9ydDtcbnZhciBydW4gPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBpZCA9ICt0aGlzO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG4gIGlmIChxdWV1ZS5oYXNPd25Qcm9wZXJ0eShpZCkpIHtcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgICBmbigpO1xuICB9XG59O1xudmFyIGxpc3RlbmVyID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gIHJ1bi5jYWxsKGV2ZW50LmRhdGEpO1xufTtcbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmICghc2V0VGFzayB8fCAhY2xlYXJUYXNrKSB7XG4gIHNldFRhc2sgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIHZhciBpID0gMTtcbiAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGkpIGFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgaW52b2tlKHR5cGVvZiBmbiA9PSAnZnVuY3Rpb24nID8gZm4gOiBGdW5jdGlvbihmbiksIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyVGFzayA9IGZ1bmN0aW9uIGNsZWFySW1tZWRpYXRlKGlkKSB7XG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcbiAgfTtcbiAgLy8gTm9kZS5qcyAwLjgtXG4gIGlmIChyZXF1aXJlKCcuL19jb2YnKShwcm9jZXNzKSA9PSAncHJvY2VzcycpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIFNwaGVyZSAoSlMgZ2FtZSBlbmdpbmUpIERpc3BhdGNoIEFQSVxuICB9IGVsc2UgaWYgKERpc3BhdGNoICYmIERpc3BhdGNoLm5vdykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBEaXNwYXRjaC5ub3coY3R4KHJ1biwgaWQsIDEpKTtcbiAgICB9O1xuICAvLyBCcm93c2VycyB3aXRoIE1lc3NhZ2VDaGFubmVsLCBpbmNsdWRlcyBXZWJXb3JrZXJzXG4gIH0gZWxzZSBpZiAoTWVzc2FnZUNoYW5uZWwpIHtcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsKCk7XG4gICAgcG9ydCA9IGNoYW5uZWwucG9ydDI7XG4gICAgY2hhbm5lbC5wb3J0MS5vbm1lc3NhZ2UgPSBsaXN0ZW5lcjtcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcbiAgLy8gQnJvd3NlcnMgd2l0aCBwb3N0TWVzc2FnZSwgc2tpcCBXZWJXb3JrZXJzXG4gIC8vIElFOCBoYXMgcG9zdE1lc3NhZ2UsIGJ1dCBpdCdzIHN5bmMgJiB0eXBlb2YgaXRzIHBvc3RNZXNzYWdlIGlzICdvYmplY3QnXG4gIH0gZWxzZSBpZiAoZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIgJiYgdHlwZW9mIHBvc3RNZXNzYWdlID09ICdmdW5jdGlvbicgJiYgIWdsb2JhbC5pbXBvcnRTY3JpcHRzKSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIGdsb2JhbC5wb3N0TWVzc2FnZShpZCArICcnLCAnKicpO1xuICAgIH07XG4gICAgZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0ZW5lciwgZmFsc2UpO1xuICAvLyBJRTgtXG4gIH0gZWxzZSBpZiAoT05SRUFEWVNUQVRFQ0hBTkdFIGluIGNlbCgnc2NyaXB0JykpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgaHRtbC5hcHBlbmRDaGlsZChjZWwoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4uY2FsbChpZCk7XG4gICAgICB9O1xuICAgIH07XG4gIC8vIFJlc3Qgb2xkIGJyb3dzZXJzXG4gIH0gZWxzZSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcbiAgICB9O1xuICB9XG59XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBzZXRUYXNrLFxuICBjbGVhcjogY2xlYXJUYXNrXG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGluZGV4LCBsZW5ndGgpIHtcbiAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xuICByZXR1cm4gaW5kZXggPCAwID8gbWF4KGluZGV4ICsgbGVuZ3RoLCAwKSA6IG1pbihpbmRleCwgbGVuZ3RoKTtcbn07XG4iLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpc05hTihpdCA9ICtpdCkgPyAwIDogKGl0ID4gMCA/IGZsb29yIDogY2VpbCkoaXQpO1xufTtcbiIsIi8vIHRvIGluZGV4ZWQgb2JqZWN0LCB0b09iamVjdCB3aXRoIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgc3RyaW5nc1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBJT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgbWluID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTtcbiIsIi8vIDcuMS4xMyBUb09iamVjdChhcmd1bWVudClcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIE9iamVjdChkZWZpbmVkKGl0KSk7XG59O1xuIiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFMpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiBpdDtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAodHlwZW9mIChmbiA9IGl0LnZhbHVlT2YpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICB0aHJvdyBUeXBlRXJyb3IoXCJDYW4ndCBjb252ZXJ0IG9iamVjdCB0byBwcmltaXRpdmUgdmFsdWVcIik7XG59O1xuIiwidmFyIGlkID0gMDtcbnZhciBweCA9IE1hdGgucmFuZG9tKCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgbmF2aWdhdG9yID0gZ2xvYmFsLm5hdmlnYXRvcjtcblxubW9kdWxlLmV4cG9ydHMgPSBuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLnVzZXJBZ2VudCB8fCAnJztcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFRZUEUpIHtcbiAgaWYgKCFpc09iamVjdChpdCkgfHwgaXQuX3QgIT09IFRZUEUpIHRocm93IFR5cGVFcnJvcignSW5jb21wYXRpYmxlIHJlY2VpdmVyLCAnICsgVFlQRSArICcgcmVxdWlyZWQhJyk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyIHdrc0V4dCA9IHJlcXVpcmUoJy4vX3drcy1leHQnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHZhciAkU3ltYm9sID0gY29yZS5TeW1ib2wgfHwgKGNvcmUuU3ltYm9sID0gTElCUkFSWSA/IHt9IDogZ2xvYmFsLlN5bWJvbCB8fCB7fSk7XG4gIGlmIChuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKSBkZWZpbmVQcm9wZXJ0eSgkU3ltYm9sLCBuYW1lLCB7IHZhbHVlOiB3a3NFeHQuZihuYW1lKSB9KTtcbn07XG4iLCJleHBvcnRzLmYgPSByZXF1aXJlKCcuL193a3MnKTtcbiIsInZhciBzdG9yZSA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCd3a3MnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5TeW1ib2w7XG52YXIgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobmFtZSkge1xuICByZXR1cm4gc3RvcmVbbmFtZV0gfHwgKHN0b3JlW25hbWVdID1cbiAgICBVU0VfU1lNQk9MICYmIFN5bWJvbFtuYW1lXSB8fCAoVVNFX1NZTUJPTCA/IFN5bWJvbCA6IHVpZCkoJ1N5bWJvbC4nICsgbmFtZSkpO1xufTtcblxuJGV4cG9ydHMuc3RvcmUgPSBzdG9yZTtcbiIsInZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIElURVJBVE9SID0gcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoaXQgIT0gdW5kZWZpbmVkKSByZXR1cm4gaXRbSVRFUkFUT1JdXG4gICAgfHwgaXRbJ0BAaXRlcmF0b3InXVxuICAgIHx8IEl0ZXJhdG9yc1tjbGFzc29mKGl0KV07XG59O1xuIiwiLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ0FycmF5JywgeyBmaWxsOiByZXF1aXJlKCcuL19hcnJheS1maWxsJykgfSk7XG5cbnJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpKCdmaWxsJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgY2FsbCA9IHJlcXVpcmUoJy4vX2l0ZXItY2FsbCcpO1xudmFyIGlzQXJyYXlJdGVyID0gcmVxdWlyZSgnLi9faXMtYXJyYXktaXRlcicpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuL19jcmVhdGUtcHJvcGVydHknKTtcbnZhciBnZXRJdGVyRm4gPSByZXF1aXJlKCcuL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpKGZ1bmN0aW9uIChpdGVyKSB7IEFycmF5LmZyb20oaXRlcik7IH0pLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMi4xIEFycmF5LmZyb20oYXJyYXlMaWtlLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgZnJvbTogZnVuY3Rpb24gZnJvbShhcnJheUxpa2UgLyogLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCAqLykge1xuICAgIHZhciBPID0gdG9PYmplY3QoYXJyYXlMaWtlKTtcbiAgICB2YXIgQyA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXk7XG4gICAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBtYXBmbiA9IGFMZW4gPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICAgIHZhciBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZDtcbiAgICB2YXIgaW5kZXggPSAwO1xuICAgIHZhciBpdGVyRm4gPSBnZXRJdGVyRm4oTyk7XG4gICAgdmFyIGxlbmd0aCwgcmVzdWx0LCBzdGVwLCBpdGVyYXRvcjtcbiAgICBpZiAobWFwcGluZykgbWFwZm4gPSBjdHgobWFwZm4sIGFMZW4gPiAyID8gYXJndW1lbnRzWzJdIDogdW5kZWZpbmVkLCAyKTtcbiAgICAvLyBpZiBvYmplY3QgaXNuJ3QgaXRlcmFibGUgb3IgaXQncyBhcnJheSB3aXRoIGRlZmF1bHQgaXRlcmF0b3IgLSB1c2Ugc2ltcGxlIGNhc2VcbiAgICBpZiAoaXRlckZuICE9IHVuZGVmaW5lZCAmJiAhKEMgPT0gQXJyYXkgJiYgaXNBcnJheUl0ZXIoaXRlckZuKSkpIHtcbiAgICAgIGZvciAoaXRlcmF0b3IgPSBpdGVyRm4uY2FsbChPKSwgcmVzdWx0ID0gbmV3IEMoKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBjYWxsKGl0ZXJhdG9yLCBtYXBmbiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgICAgZm9yIChyZXN1bHQgPSBuZXcgQyhsZW5ndGgpOyBsZW5ndGggPiBpbmRleDsgaW5kZXgrKykge1xuICAgICAgICBjcmVhdGVQcm9wZXJ0eShyZXN1bHQsIGluZGV4LCBtYXBwaW5nID8gbWFwZm4oT1tpbmRleF0sIGluZGV4KSA6IE9baW5kZXhdKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkaW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyICRuYXRpdmUgPSBbXS5pbmRleE9mO1xudmFyIE5FR0FUSVZFX1pFUk8gPSAhISRuYXRpdmUgJiYgMSAvIFsxXS5pbmRleE9mKDEsIC0wKSA8IDA7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogKE5FR0FUSVZFX1pFUk8gfHwgIXJlcXVpcmUoJy4vX3N0cmljdC1tZXRob2QnKSgkbmF0aXZlKSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4zLjExIC8gMTUuNC40LjE0IEFycmF5LnByb3RvdHlwZS5pbmRleE9mKHNlYXJjaEVsZW1lbnQgWywgZnJvbUluZGV4XSlcbiAgaW5kZXhPZjogZnVuY3Rpb24gaW5kZXhPZihzZWFyY2hFbGVtZW50IC8qICwgZnJvbUluZGV4ID0gMCAqLykge1xuICAgIHJldHVybiBORUdBVElWRV9aRVJPXG4gICAgICAvLyBjb252ZXJ0IC0wIHRvICswXG4gICAgICA/ICRuYXRpdmUuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCAwXG4gICAgICA6ICRpbmRleE9mKHRoaXMsIHNlYXJjaEVsZW1lbnQsIGFyZ3VtZW50c1sxXSk7XG4gIH1cbn0pO1xuIiwiLy8gMjIuMS4yLjIgLyAxNS40LjMuMiBBcnJheS5pc0FycmF5KGFyZylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnQXJyYXknLCB7IGlzQXJyYXk6IHJlcXVpcmUoJy4vX2lzLWFycmF5JykgfSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4vX2FkZC10by11bnNjb3BhYmxlcycpO1xudmFyIHN0ZXAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24gKGl0ZXJhdGVkLCBraW5kKSB7XG4gIHRoaXMuX3QgPSB0b0lPYmplY3QoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbiAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgIC8vIGtpbmRcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxufSwgZnVuY3Rpb24gKCkge1xuICB2YXIgTyA9IHRoaXMuX3Q7XG4gIHZhciBraW5kID0gdGhpcy5faztcbiAgdmFyIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZiAoIU8gfHwgaW5kZXggPj0gTy5sZW5ndGgpIHtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmIChraW5kID09ICdrZXlzJykgcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZiAoa2luZCA9PSAndmFsdWVzJykgcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciAkbWFwID0gcmVxdWlyZSgnLi9fYXJyYXktbWV0aG9kcycpKDEpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19zdHJpY3QtbWV0aG9kJykoW10ubWFwLCB0cnVlKSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjMuMTUgLyAxNS40LjQuMTkgQXJyYXkucHJvdG90eXBlLm1hcChjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxuICBtYXA6IGZ1bmN0aW9uIG1hcChjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgIHJldHVybiAkbWFwKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSk7XG4gIH1cbn0pO1xuIiwidmFyIERhdGVQcm90byA9IERhdGUucHJvdG90eXBlO1xudmFyIElOVkFMSURfREFURSA9ICdJbnZhbGlkIERhdGUnO1xudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgJHRvU3RyaW5nID0gRGF0ZVByb3RvW1RPX1NUUklOR107XG52YXIgZ2V0VGltZSA9IERhdGVQcm90by5nZXRUaW1lO1xuaWYgKG5ldyBEYXRlKE5hTikgKyAnJyAhPSBJTlZBTElEX0RBVEUpIHtcbiAgcmVxdWlyZSgnLi9fcmVkZWZpbmUnKShEYXRlUHJvdG8sIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgdmFyIHZhbHVlID0gZ2V0VGltZS5jYWxsKHRoaXMpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmVcbiAgICByZXR1cm4gdmFsdWUgPT09IHZhbHVlID8gJHRvU3RyaW5nLmNhbGwodGhpcykgOiBJTlZBTElEX0RBVEU7XG4gIH0pO1xufVxuIiwiLy8gMTkuMi4zLjIgLyAxNS4zLjQuNSBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCh0aGlzQXJnLCBhcmdzLi4uKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlAsICdGdW5jdGlvbicsIHsgYmluZDogcmVxdWlyZSgnLi9fYmluZCcpIH0pO1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBGUHJvdG8gPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXIgbmFtZVJFID0gL15cXHMqZnVuY3Rpb24gKFteIChdKikvO1xudmFyIE5BTUUgPSAnbmFtZSc7XG5cbi8vIDE5LjIuNC4yIG5hbWVcbk5BTUUgaW4gRlByb3RvIHx8IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgZFAoRlByb3RvLCBOQU1FLCB7XG4gIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiAoJycgKyB0aGlzKS5tYXRjaChuYW1lUkUpWzFdO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgTUFQID0gJ01hcCc7XG5cbi8vIDIzLjEgTWFwIE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKE1BUCwgZnVuY3Rpb24gKGdldCkge1xuICByZXR1cm4gZnVuY3Rpb24gTWFwKCkgeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpIHtcbiAgICB2YXIgZW50cnkgPSBzdHJvbmcuZ2V0RW50cnkodmFsaWRhdGUodGhpcywgTUFQKSwga2V5KTtcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcbiAgfSxcbiAgLy8gMjMuMS4zLjkgTWFwLnByb3RvdHlwZS5zZXQoa2V5LCB2YWx1ZSlcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSkge1xuICAgIHJldHVybiBzdHJvbmcuZGVmKHZhbGlkYXRlKHRoaXMsIE1BUCksIGtleSA9PT0gMCA/IDAgOiBrZXksIHZhbHVlKTtcbiAgfVxufSwgc3Ryb25nLCB0cnVlKTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4vLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0JywgeyBjcmVhdGU6IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKSB9KTtcbiIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4vLyAxOS4xLjIuNCAvIDE1LjIuMy42IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSwgJ09iamVjdCcsIHsgZGVmaW5lUHJvcGVydHk6IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmYgfSk7XG4iLCIvLyAxOS4xLjIuMTQgT2JqZWN0LmtleXMoTylcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdrZXlzJywgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZnVuY3Rpb24ga2V5cyhpdCkge1xuICAgIHJldHVybiAka2V5cyh0b09iamVjdChpdCkpO1xuICB9O1xufSk7XG4iLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbiRleHBvcnQoJGV4cG9ydC5TLCAnT2JqZWN0JywgeyBzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0IH0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuLy8gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciB0ZXN0ID0ge307XG50ZXN0W3JlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXSA9ICd6JztcbmlmICh0ZXN0ICsgJycgIT0gJ1tvYmplY3Qgel0nKSB7XG4gIHJlcXVpcmUoJy4vX3JlZGVmaW5lJykoT2JqZWN0LnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuICdbb2JqZWN0ICcgKyBjbGFzc29mKHRoaXMpICsgJ10nO1xuICB9LCB0cnVlKTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZID0gcmVxdWlyZSgnLi9fbGlicmFyeScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIGFuSW5zdGFuY2UgPSByZXF1aXJlKCcuL19hbi1pbnN0YW5jZScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgc3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi9fc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xudmFyIHRhc2sgPSByZXF1aXJlKCcuL190YXNrJykuc2V0O1xudmFyIG1pY3JvdGFzayA9IHJlcXVpcmUoJy4vX21pY3JvdGFzaycpKCk7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUgPSByZXF1aXJlKCcuL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5Jyk7XG52YXIgcGVyZm9ybSA9IHJlcXVpcmUoJy4vX3BlcmZvcm0nKTtcbnZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuL191c2VyLWFnZW50Jyk7XG52YXIgcHJvbWlzZVJlc29sdmUgPSByZXF1aXJlKCcuL19wcm9taXNlLXJlc29sdmUnKTtcbnZhciBQUk9NSVNFID0gJ1Byb21pc2UnO1xudmFyIFR5cGVFcnJvciA9IGdsb2JhbC5UeXBlRXJyb3I7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIHZlcnNpb25zID0gcHJvY2VzcyAmJiBwcm9jZXNzLnZlcnNpb25zO1xudmFyIHY4ID0gdmVyc2lvbnMgJiYgdmVyc2lvbnMudjggfHwgJyc7XG52YXIgJFByb21pc2UgPSBnbG9iYWxbUFJPTUlTRV07XG52YXIgaXNOb2RlID0gY2xhc3NvZihwcm9jZXNzKSA9PSAncHJvY2Vzcyc7XG52YXIgZW1wdHkgPSBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH07XG52YXIgSW50ZXJuYWwsIG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSwgT3duUHJvbWlzZUNhcGFiaWxpdHksIFdyYXBwZXI7XG52YXIgbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZS5mO1xuXG52YXIgVVNFX05BVElWRSA9ICEhZnVuY3Rpb24gKCkge1xuICB0cnkge1xuICAgIC8vIGNvcnJlY3Qgc3ViY2xhc3Npbmcgd2l0aCBAQHNwZWNpZXMgc3VwcG9ydFxuICAgIHZhciBwcm9taXNlID0gJFByb21pc2UucmVzb2x2ZSgxKTtcbiAgICB2YXIgRmFrZVByb21pc2UgPSAocHJvbWlzZS5jb25zdHJ1Y3RvciA9IHt9KVtyZXF1aXJlKCcuL193a3MnKSgnc3BlY2llcycpXSA9IGZ1bmN0aW9uIChleGVjKSB7XG4gICAgICBleGVjKGVtcHR5LCBlbXB0eSk7XG4gICAgfTtcbiAgICAvLyB1bmhhbmRsZWQgcmVqZWN0aW9ucyB0cmFja2luZyBzdXBwb3J0LCBOb2RlSlMgUHJvbWlzZSB3aXRob3V0IGl0IGZhaWxzIEBAc3BlY2llcyB0ZXN0XG4gICAgcmV0dXJuIChpc05vZGUgfHwgdHlwZW9mIFByb21pc2VSZWplY3Rpb25FdmVudCA9PSAnZnVuY3Rpb24nKVxuICAgICAgJiYgcHJvbWlzZS50aGVuKGVtcHR5KSBpbnN0YW5jZW9mIEZha2VQcm9taXNlXG4gICAgICAvLyB2OCA2LjYgKE5vZGUgMTAgYW5kIENocm9tZSA2NikgaGF2ZSBhIGJ1ZyB3aXRoIHJlc29sdmluZyBjdXN0b20gdGhlbmFibGVzXG4gICAgICAvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD04MzA1NjVcbiAgICAgIC8vIHdlIGNhbid0IGRldGVjdCBpdCBzeW5jaHJvbm91c2x5LCBzbyBqdXN0IGNoZWNrIHZlcnNpb25zXG4gICAgICAmJiB2OC5pbmRleE9mKCc2LjYnKSAhPT0gMFxuICAgICAgJiYgdXNlckFnZW50LmluZGV4T2YoJ0Nocm9tZS82NicpID09PSAtMTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG59KCk7XG5cbi8vIGhlbHBlcnNcbnZhciBpc1RoZW5hYmxlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciB0aGVuO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmIHR5cGVvZiAodGhlbiA9IGl0LnRoZW4pID09ICdmdW5jdGlvbicgPyB0aGVuIDogZmFsc2U7XG59O1xudmFyIG5vdGlmeSA9IGZ1bmN0aW9uIChwcm9taXNlLCBpc1JlamVjdCkge1xuICBpZiAocHJvbWlzZS5fbikgcmV0dXJuO1xuICBwcm9taXNlLl9uID0gdHJ1ZTtcbiAgdmFyIGNoYWluID0gcHJvbWlzZS5fYztcbiAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92O1xuICAgIHZhciBvayA9IHByb21pc2UuX3MgPT0gMTtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHJ1biA9IGZ1bmN0aW9uIChyZWFjdGlvbikge1xuICAgICAgdmFyIGhhbmRsZXIgPSBvayA/IHJlYWN0aW9uLm9rIDogcmVhY3Rpb24uZmFpbDtcbiAgICAgIHZhciByZXNvbHZlID0gcmVhY3Rpb24ucmVzb2x2ZTtcbiAgICAgIHZhciByZWplY3QgPSByZWFjdGlvbi5yZWplY3Q7XG4gICAgICB2YXIgZG9tYWluID0gcmVhY3Rpb24uZG9tYWluO1xuICAgICAgdmFyIHJlc3VsdCwgdGhlbiwgZXhpdGVkO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKGhhbmRsZXIpIHtcbiAgICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICBpZiAocHJvbWlzZS5faCA9PSAyKSBvbkhhbmRsZVVuaGFuZGxlZChwcm9taXNlKTtcbiAgICAgICAgICAgIHByb21pc2UuX2ggPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAoaGFuZGxlciA9PT0gdHJ1ZSkgcmVzdWx0ID0gdmFsdWU7XG4gICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAoZG9tYWluKSBkb21haW4uZW50ZXIoKTtcbiAgICAgICAgICAgIHJlc3VsdCA9IGhhbmRsZXIodmFsdWUpOyAvLyBtYXkgdGhyb3dcbiAgICAgICAgICAgIGlmIChkb21haW4pIHtcbiAgICAgICAgICAgICAgZG9tYWluLmV4aXQoKTtcbiAgICAgICAgICAgICAgZXhpdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHJlc3VsdCA9PT0gcmVhY3Rpb24ucHJvbWlzZSkge1xuICAgICAgICAgICAgcmVqZWN0KFR5cGVFcnJvcignUHJvbWlzZS1jaGFpbiBjeWNsZScpKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoZW4gPSBpc1RoZW5hYmxlKHJlc3VsdCkpIHtcbiAgICAgICAgICAgIHRoZW4uY2FsbChyZXN1bHQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgICAgfSBlbHNlIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgfSBlbHNlIHJlamVjdCh2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChkb21haW4gJiYgIWV4aXRlZCkgZG9tYWluLmV4aXQoKTtcbiAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgfVxuICAgIH07XG4gICAgd2hpbGUgKGNoYWluLmxlbmd0aCA+IGkpIHJ1bihjaGFpbltpKytdKTsgLy8gdmFyaWFibGUgbGVuZ3RoIC0gY2FuJ3QgdXNlIGZvckVhY2hcbiAgICBwcm9taXNlLl9jID0gW107XG4gICAgcHJvbWlzZS5fbiA9IGZhbHNlO1xuICAgIGlmIChpc1JlamVjdCAmJiAhcHJvbWlzZS5faCkgb25VbmhhbmRsZWQocHJvbWlzZSk7XG4gIH0pO1xufTtcbnZhciBvblVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBwcm9taXNlLl92O1xuICAgIHZhciB1bmhhbmRsZWQgPSBpc1VuaGFuZGxlZChwcm9taXNlKTtcbiAgICB2YXIgcmVzdWx0LCBoYW5kbGVyLCBjb25zb2xlO1xuICAgIGlmICh1bmhhbmRsZWQpIHtcbiAgICAgIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoaXNOb2RlKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoaGFuZGxlciA9IGdsb2JhbC5vbnVuaGFuZGxlZHJlamVjdGlvbikge1xuICAgICAgICAgIGhhbmRsZXIoeyBwcm9taXNlOiBwcm9taXNlLCByZWFzb246IHZhbHVlIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKChjb25zb2xlID0gZ2xvYmFsLmNvbnNvbGUpICYmIGNvbnNvbGUuZXJyb3IpIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgLy8gQnJvd3NlcnMgc2hvdWxkIG5vdCB0cmlnZ2VyIGByZWplY3Rpb25IYW5kbGVkYCBldmVudCBpZiBpdCB3YXMgaGFuZGxlZCBoZXJlLCBOb2RlSlMgLSBzaG91bGRcbiAgICAgIHByb21pc2UuX2ggPSBpc05vZGUgfHwgaXNVbmhhbmRsZWQocHJvbWlzZSkgPyAyIDogMTtcbiAgICB9IHByb21pc2UuX2EgPSB1bmRlZmluZWQ7XG4gICAgaWYgKHVuaGFuZGxlZCAmJiByZXN1bHQuZSkgdGhyb3cgcmVzdWx0LnY7XG4gIH0pO1xufTtcbnZhciBpc1VuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHJldHVybiBwcm9taXNlLl9oICE9PSAxICYmIChwcm9taXNlLl9hIHx8IHByb21pc2UuX2MpLmxlbmd0aCA9PT0gMDtcbn07XG52YXIgb25IYW5kbGVVbmhhbmRsZWQgPSBmdW5jdGlvbiAocHJvbWlzZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhhbmRsZXI7XG4gICAgaWYgKGlzTm9kZSkge1xuICAgICAgcHJvY2Vzcy5lbWl0KCdyZWplY3Rpb25IYW5kbGVkJywgcHJvbWlzZSk7XG4gICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9ucmVqZWN0aW9uaGFuZGxlZCkge1xuICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogcHJvbWlzZS5fdiB9KTtcbiAgICB9XG4gIH0pO1xufTtcbnZhciAkcmVqZWN0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciBwcm9taXNlID0gdGhpcztcbiAgaWYgKHByb21pc2UuX2QpIHJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICBwcm9taXNlLl92ID0gdmFsdWU7XG4gIHByb21pc2UuX3MgPSAyO1xuICBpZiAoIXByb21pc2UuX2EpIHByb21pc2UuX2EgPSBwcm9taXNlLl9jLnNsaWNlKCk7XG4gIG5vdGlmeShwcm9taXNlLCB0cnVlKTtcbn07XG52YXIgJHJlc29sdmUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICB2YXIgdGhlbjtcbiAgaWYgKHByb21pc2UuX2QpIHJldHVybjtcbiAgcHJvbWlzZS5fZCA9IHRydWU7XG4gIHByb21pc2UgPSBwcm9taXNlLl93IHx8IHByb21pc2U7IC8vIHVud3JhcFxuICB0cnkge1xuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkgdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgaWYgKHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfTsgLy8gd3JhcFxuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbCh2YWx1ZSwgY3R4KCRyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KCRyZWplY3QsIHdyYXBwZXIsIDEpKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICRyZWplY3QuY2FsbCh3cmFwcGVyLCBlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgICAgIHByb21pc2UuX3MgPSAxO1xuICAgICAgbm90aWZ5KHByb21pc2UsIGZhbHNlKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICAkcmVqZWN0LmNhbGwoeyBfdzogcHJvbWlzZSwgX2Q6IGZhbHNlIH0sIGUpOyAvLyB3cmFwXG4gIH1cbn07XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZiAoIVVTRV9OQVRJVkUpIHtcbiAgLy8gMjUuNC4zLjEgUHJvbWlzZShleGVjdXRvcilcbiAgJFByb21pc2UgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgYW5JbnN0YW5jZSh0aGlzLCAkUHJvbWlzZSwgUFJPTUlTRSwgJ19oJyk7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICBJbnRlcm5hbC5jYWxsKHRoaXMpO1xuICAgIHRyeSB7XG4gICAgICBleGVjdXRvcihjdHgoJHJlc29sdmUsIHRoaXMsIDEpLCBjdHgoJHJlamVjdCwgdGhpcywgMSkpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgJHJlamVjdC5jYWxsKHRoaXMsIGVycik7XG4gICAgfVxuICB9O1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgSW50ZXJuYWwgPSBmdW5jdGlvbiBQcm9taXNlKGV4ZWN1dG9yKSB7XG4gICAgdGhpcy5fYyA9IFtdOyAgICAgICAgICAgICAvLyA8LSBhd2FpdGluZyByZWFjdGlvbnNcbiAgICB0aGlzLl9hID0gdW5kZWZpbmVkOyAgICAgIC8vIDwtIGNoZWNrZWQgaW4gaXNVbmhhbmRsZWQgcmVhY3Rpb25zXG4gICAgdGhpcy5fcyA9IDA7ICAgICAgICAgICAgICAvLyA8LSBzdGF0ZVxuICAgIHRoaXMuX2QgPSBmYWxzZTsgICAgICAgICAgLy8gPC0gZG9uZVxuICAgIHRoaXMuX3YgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gdmFsdWVcbiAgICB0aGlzLl9oID0gMDsgICAgICAgICAgICAgIC8vIDwtIHJlamVjdGlvbiBzdGF0ZSwgMCAtIGRlZmF1bHQsIDEgLSBoYW5kbGVkLCAyIC0gdW5oYW5kbGVkXG4gICAgdGhpcy5fbiA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBub3RpZnlcbiAgfTtcbiAgSW50ZXJuYWwucHJvdG90eXBlID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUtYWxsJykoJFByb21pc2UucHJvdG90eXBlLCB7XG4gICAgLy8gMjUuNC41LjMgUHJvbWlzZS5wcm90b3R5cGUudGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZClcbiAgICB0aGVuOiBmdW5jdGlvbiB0aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKSB7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgJFByb21pc2UpKTtcbiAgICAgIHJlYWN0aW9uLm9rID0gdHlwZW9mIG9uRnVsZmlsbGVkID09ICdmdW5jdGlvbicgPyBvbkZ1bGZpbGxlZCA6IHRydWU7XG4gICAgICByZWFjdGlvbi5mYWlsID0gdHlwZW9mIG9uUmVqZWN0ZWQgPT0gJ2Z1bmN0aW9uJyAmJiBvblJlamVjdGVkO1xuICAgICAgcmVhY3Rpb24uZG9tYWluID0gaXNOb2RlID8gcHJvY2Vzcy5kb21haW4gOiB1bmRlZmluZWQ7XG4gICAgICB0aGlzLl9jLnB1c2gocmVhY3Rpb24pO1xuICAgICAgaWYgKHRoaXMuX2EpIHRoaXMuX2EucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fcykgbm90aWZ5KHRoaXMsIGZhbHNlKTtcbiAgICAgIHJldHVybiByZWFjdGlvbi5wcm9taXNlO1xuICAgIH0sXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcbiAgICAnY2F0Y2gnOiBmdW5jdGlvbiAob25SZWplY3RlZCkge1xuICAgICAgcmV0dXJuIHRoaXMudGhlbih1bmRlZmluZWQsIG9uUmVqZWN0ZWQpO1xuICAgIH1cbiAgfSk7XG4gIE93blByb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwcm9taXNlID0gbmV3IEludGVybmFsKCk7XG4gICAgdGhpcy5wcm9taXNlID0gcHJvbWlzZTtcbiAgICB0aGlzLnJlc29sdmUgPSBjdHgoJHJlc29sdmUsIHByb21pc2UsIDEpO1xuICAgIHRoaXMucmVqZWN0ID0gY3R4KCRyZWplY3QsIHByb21pc2UsIDEpO1xuICB9O1xuICBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZS5mID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoQykge1xuICAgIHJldHVybiBDID09PSAkUHJvbWlzZSB8fCBDID09PSBXcmFwcGVyXG4gICAgICA/IG5ldyBPd25Qcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgOiBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gIH07XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHsgUHJvbWlzZTogJFByb21pc2UgfSk7XG5yZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpKCRQcm9taXNlLCBQUk9NSVNFKTtcbnJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJykoUFJPTUlTRSk7XG5XcmFwcGVyID0gcmVxdWlyZSgnLi9fY29yZScpW1BST01JU0VdO1xuXG4vLyBzdGF0aWNzXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC41IFByb21pc2UucmVqZWN0KHIpXG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpIHtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpO1xuICAgIHZhciAkJHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgICQkcmVqZWN0KHIpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoTElCUkFSWSB8fCAhVVNFX05BVElWRSksIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjYgUHJvbWlzZS5yZXNvbHZlKHgpXG4gIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoeCkge1xuICAgIHJldHVybiBwcm9taXNlUmVzb2x2ZShMSUJSQVJZICYmIHRoaXMgPT09IFdyYXBwZXIgPyAkUHJvbWlzZSA6IHRoaXMsIHgpO1xuICB9XG59KTtcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIShVU0VfTkFUSVZFICYmIHJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHtcbiAgJFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGVtcHR5KTtcbn0pKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuMSBQcm9taXNlLmFsbChpdGVyYWJsZSlcbiAgYWxsOiBmdW5jdGlvbiBhbGwoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVzb2x2ZSA9IGNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHZhbHVlcyA9IFtdO1xuICAgICAgdmFyIGluZGV4ID0gMDtcbiAgICAgIHZhciByZW1haW5pbmcgPSAxO1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICB2YXIgJGluZGV4ID0gaW5kZXgrKztcbiAgICAgICAgdmFyIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgIGlmIChhbHJlYWR5Q2FsbGVkKSByZXR1cm47XG4gICAgICAgICAgYWxyZWFkeUNhbGxlZCA9IHRydWU7XG4gICAgICAgICAgdmFsdWVzWyRpbmRleF0gPSB2YWx1ZTtcbiAgICAgICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgIH0sIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gMjUuNC40LjQgUHJvbWlzZS5yYWNlKGl0ZXJhYmxlKVxuICByYWNlOiBmdW5jdGlvbiByYWNlKGl0ZXJhYmxlKSB7XG4gICAgdmFyIEMgPSB0aGlzO1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gICAgdmFyIHJlamVjdCA9IGNhcGFiaWxpdHkucmVqZWN0O1xuICAgIHZhciByZXN1bHQgPSBwZXJmb3JtKGZ1bmN0aW9uICgpIHtcbiAgICAgIGZvck9mKGl0ZXJhYmxlLCBmYWxzZSwgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oY2FwYWJpbGl0eS5yZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lKSByZWplY3QocmVzdWx0LnYpO1xuICAgIHJldHVybiBjYXBhYmlsaXR5LnByb21pc2U7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHJlZ2V4cEV4ZWMgPSByZXF1aXJlKCcuL19yZWdleHAtZXhlYycpO1xucmVxdWlyZSgnLi9fZXhwb3J0Jykoe1xuICB0YXJnZXQ6ICdSZWdFeHAnLFxuICBwcm90bzogdHJ1ZSxcbiAgZm9yY2VkOiByZWdleHBFeGVjICE9PSAvLi8uZXhlY1xufSwge1xuICBleGVjOiByZWdleHBFeGVjXG59KTtcbiIsIi8vIDIxLjIuNS4zIGdldCBSZWdFeHAucHJvdG90eXBlLmZsYWdzKClcbmlmIChyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmIC8uL2cuZmxhZ3MgIT0gJ2cnKSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mKFJlZ0V4cC5wcm90b3R5cGUsICdmbGFncycsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IHJlcXVpcmUoJy4vX2ZsYWdzJylcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGFkdmFuY2VTdHJpbmdJbmRleCA9IHJlcXVpcmUoJy4vX2FkdmFuY2Utc3RyaW5nLWluZGV4Jyk7XG52YXIgcmVnRXhwRXhlYyA9IHJlcXVpcmUoJy4vX3JlZ2V4cC1leGVjLWFic3RyYWN0Jyk7XG5cbi8vIEBAbWF0Y2ggbG9naWNcbnJlcXVpcmUoJy4vX2ZpeC1yZS13a3MnKSgnbWF0Y2gnLCAxLCBmdW5jdGlvbiAoZGVmaW5lZCwgTUFUQ0gsICRtYXRjaCwgbWF5YmVDYWxsTmF0aXZlKSB7XG4gIHJldHVybiBbXG4gICAgLy8gYFN0cmluZy5wcm90b3R5cGUubWF0Y2hgIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUubWF0Y2hcbiAgICBmdW5jdGlvbiBtYXRjaChyZWdleHApIHtcbiAgICAgIHZhciBPID0gZGVmaW5lZCh0aGlzKTtcbiAgICAgIHZhciBmbiA9IHJlZ2V4cCA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiByZWdleHBbTUFUQ0hdO1xuICAgICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWQgPyBmbi5jYWxsKHJlZ2V4cCwgTykgOiBuZXcgUmVnRXhwKHJlZ2V4cClbTUFUQ0hdKFN0cmluZyhPKSk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQG1hdGNoXWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS1AQG1hdGNoXG4gICAgZnVuY3Rpb24gKHJlZ2V4cCkge1xuICAgICAgdmFyIHJlcyA9IG1heWJlQ2FsbE5hdGl2ZSgkbWF0Y2gsIHJlZ2V4cCwgdGhpcyk7XG4gICAgICBpZiAocmVzLmRvbmUpIHJldHVybiByZXMudmFsdWU7XG4gICAgICB2YXIgcnggPSBhbk9iamVjdChyZWdleHApO1xuICAgICAgdmFyIFMgPSBTdHJpbmcodGhpcyk7XG4gICAgICBpZiAoIXJ4Lmdsb2JhbCkgcmV0dXJuIHJlZ0V4cEV4ZWMocngsIFMpO1xuICAgICAgdmFyIGZ1bGxVbmljb2RlID0gcngudW5pY29kZTtcbiAgICAgIHJ4Lmxhc3RJbmRleCA9IDA7XG4gICAgICB2YXIgQSA9IFtdO1xuICAgICAgdmFyIG4gPSAwO1xuICAgICAgdmFyIHJlc3VsdDtcbiAgICAgIHdoaWxlICgocmVzdWx0ID0gcmVnRXhwRXhlYyhyeCwgUykpICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBtYXRjaFN0ciA9IFN0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICBBW25dID0gbWF0Y2hTdHI7XG4gICAgICAgIGlmIChtYXRjaFN0ciA9PT0gJycpIHJ4Lmxhc3RJbmRleCA9IGFkdmFuY2VTdHJpbmdJbmRleChTLCB0b0xlbmd0aChyeC5sYXN0SW5kZXgpLCBmdWxsVW5pY29kZSk7XG4gICAgICAgIG4rKztcbiAgICAgIH1cbiAgICAgIHJldHVybiBuID09PSAwID8gbnVsbCA6IEE7XG4gICAgfVxuICBdO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgYWR2YW5jZVN0cmluZ0luZGV4ID0gcmVxdWlyZSgnLi9fYWR2YW5jZS1zdHJpbmctaW5kZXgnKTtcbnZhciByZWdFeHBFeGVjID0gcmVxdWlyZSgnLi9fcmVnZXhwLWV4ZWMtYWJzdHJhY3QnKTtcbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG52YXIgU1VCU1RJVFVUSU9OX1NZTUJPTFMgPSAvXFwkKFskJmAnXXxcXGRcXGQ/fDxbXj5dKj4pL2c7XG52YXIgU1VCU1RJVFVUSU9OX1NZTUJPTFNfTk9fTkFNRUQgPSAvXFwkKFskJmAnXXxcXGRcXGQ/KS9nO1xuXG52YXIgbWF5YmVUb1N0cmluZyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/IGl0IDogU3RyaW5nKGl0KTtcbn07XG5cbi8vIEBAcmVwbGFjZSBsb2dpY1xucmVxdWlyZSgnLi9fZml4LXJlLXdrcycpKCdyZXBsYWNlJywgMiwgZnVuY3Rpb24gKGRlZmluZWQsIFJFUExBQ0UsICRyZXBsYWNlLCBtYXliZUNhbGxOYXRpdmUpIHtcbiAgcmV0dXJuIFtcbiAgICAvLyBgU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnJlcGxhY2VcbiAgICBmdW5jdGlvbiByZXBsYWNlKHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpIHtcbiAgICAgIHZhciBPID0gZGVmaW5lZCh0aGlzKTtcbiAgICAgIHZhciBmbiA9IHNlYXJjaFZhbHVlID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHNlYXJjaFZhbHVlW1JFUExBQ0VdO1xuICAgICAgcmV0dXJuIGZuICE9PSB1bmRlZmluZWRcbiAgICAgICAgPyBmbi5jYWxsKHNlYXJjaFZhbHVlLCBPLCByZXBsYWNlVmFsdWUpXG4gICAgICAgIDogJHJlcGxhY2UuY2FsbChTdHJpbmcoTyksIHNlYXJjaFZhbHVlLCByZXBsYWNlVmFsdWUpO1xuICAgIH0sXG4gICAgLy8gYFJlZ0V4cC5wcm90b3R5cGVbQEByZXBsYWNlXWAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwLnByb3RvdHlwZS1AQHJlcGxhY2VcbiAgICBmdW5jdGlvbiAocmVnZXhwLCByZXBsYWNlVmFsdWUpIHtcbiAgICAgIHZhciByZXMgPSBtYXliZUNhbGxOYXRpdmUoJHJlcGxhY2UsIHJlZ2V4cCwgdGhpcywgcmVwbGFjZVZhbHVlKTtcbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcblxuICAgICAgdmFyIHJ4ID0gYW5PYmplY3QocmVnZXhwKTtcbiAgICAgIHZhciBTID0gU3RyaW5nKHRoaXMpO1xuICAgICAgdmFyIGZ1bmN0aW9uYWxSZXBsYWNlID0gdHlwZW9mIHJlcGxhY2VWYWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAgIGlmICghZnVuY3Rpb25hbFJlcGxhY2UpIHJlcGxhY2VWYWx1ZSA9IFN0cmluZyhyZXBsYWNlVmFsdWUpO1xuICAgICAgdmFyIGdsb2JhbCA9IHJ4Lmdsb2JhbDtcbiAgICAgIGlmIChnbG9iYWwpIHtcbiAgICAgICAgdmFyIGZ1bGxVbmljb2RlID0gcngudW5pY29kZTtcbiAgICAgICAgcngubGFzdEluZGV4ID0gMDtcbiAgICAgIH1cbiAgICAgIHZhciByZXN1bHRzID0gW107XG4gICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gcmVnRXhwRXhlYyhyeCwgUyk7XG4gICAgICAgIGlmIChyZXN1bHQgPT09IG51bGwpIGJyZWFrO1xuICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgaWYgKCFnbG9iYWwpIGJyZWFrO1xuICAgICAgICB2YXIgbWF0Y2hTdHIgPSBTdHJpbmcocmVzdWx0WzBdKTtcbiAgICAgICAgaWYgKG1hdGNoU3RyID09PSAnJykgcngubGFzdEluZGV4ID0gYWR2YW5jZVN0cmluZ0luZGV4KFMsIHRvTGVuZ3RoKHJ4Lmxhc3RJbmRleCksIGZ1bGxVbmljb2RlKTtcbiAgICAgIH1cbiAgICAgIHZhciBhY2N1bXVsYXRlZFJlc3VsdCA9ICcnO1xuICAgICAgdmFyIG5leHRTb3VyY2VQb3NpdGlvbiA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0c1tpXTtcbiAgICAgICAgdmFyIG1hdGNoZWQgPSBTdHJpbmcocmVzdWx0WzBdKTtcbiAgICAgICAgdmFyIHBvc2l0aW9uID0gbWF4KG1pbih0b0ludGVnZXIocmVzdWx0LmluZGV4KSwgUy5sZW5ndGgpLCAwKTtcbiAgICAgICAgdmFyIGNhcHR1cmVzID0gW107XG4gICAgICAgIC8vIE5PVEU6IFRoaXMgaXMgZXF1aXZhbGVudCB0b1xuICAgICAgICAvLyAgIGNhcHR1cmVzID0gcmVzdWx0LnNsaWNlKDEpLm1hcChtYXliZVRvU3RyaW5nKVxuICAgICAgICAvLyBidXQgZm9yIHNvbWUgcmVhc29uIGBuYXRpdmVTbGljZS5jYWxsKHJlc3VsdCwgMSwgcmVzdWx0Lmxlbmd0aClgIChjYWxsZWQgaW5cbiAgICAgICAgLy8gdGhlIHNsaWNlIHBvbHlmaWxsIHdoZW4gc2xpY2luZyBuYXRpdmUgYXJyYXlzKSBcImRvZXNuJ3Qgd29ya1wiIGluIHNhZmFyaSA5IGFuZFxuICAgICAgICAvLyBjYXVzZXMgYSBjcmFzaCAoaHR0cHM6Ly9wYXN0ZWJpbi5jb20vTjIxUXplUUEpIHdoZW4gdHJ5aW5nIHRvIGRlYnVnIGl0LlxuICAgICAgICBmb3IgKHZhciBqID0gMTsgaiA8IHJlc3VsdC5sZW5ndGg7IGorKykgY2FwdHVyZXMucHVzaChtYXliZVRvU3RyaW5nKHJlc3VsdFtqXSkpO1xuICAgICAgICB2YXIgbmFtZWRDYXB0dXJlcyA9IHJlc3VsdC5ncm91cHM7XG4gICAgICAgIGlmIChmdW5jdGlvbmFsUmVwbGFjZSkge1xuICAgICAgICAgIHZhciByZXBsYWNlckFyZ3MgPSBbbWF0Y2hlZF0uY29uY2F0KGNhcHR1cmVzLCBwb3NpdGlvbiwgUyk7XG4gICAgICAgICAgaWYgKG5hbWVkQ2FwdHVyZXMgIT09IHVuZGVmaW5lZCkgcmVwbGFjZXJBcmdzLnB1c2gobmFtZWRDYXB0dXJlcyk7XG4gICAgICAgICAgdmFyIHJlcGxhY2VtZW50ID0gU3RyaW5nKHJlcGxhY2VWYWx1ZS5hcHBseSh1bmRlZmluZWQsIHJlcGxhY2VyQXJncykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcGxhY2VtZW50ID0gZ2V0U3Vic3RpdHV0aW9uKG1hdGNoZWQsIFMsIHBvc2l0aW9uLCBjYXB0dXJlcywgbmFtZWRDYXB0dXJlcywgcmVwbGFjZVZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPj0gbmV4dFNvdXJjZVBvc2l0aW9uKSB7XG4gICAgICAgICAgYWNjdW11bGF0ZWRSZXN1bHQgKz0gUy5zbGljZShuZXh0U291cmNlUG9zaXRpb24sIHBvc2l0aW9uKSArIHJlcGxhY2VtZW50O1xuICAgICAgICAgIG5leHRTb3VyY2VQb3NpdGlvbiA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2N1bXVsYXRlZFJlc3VsdCArIFMuc2xpY2UobmV4dFNvdXJjZVBvc2l0aW9uKTtcbiAgICB9XG4gIF07XG5cbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1nZXRzdWJzdGl0dXRpb25cbiAgZnVuY3Rpb24gZ2V0U3Vic3RpdHV0aW9uKG1hdGNoZWQsIHN0ciwgcG9zaXRpb24sIGNhcHR1cmVzLCBuYW1lZENhcHR1cmVzLCByZXBsYWNlbWVudCkge1xuICAgIHZhciB0YWlsUG9zID0gcG9zaXRpb24gKyBtYXRjaGVkLmxlbmd0aDtcbiAgICB2YXIgbSA9IGNhcHR1cmVzLmxlbmd0aDtcbiAgICB2YXIgc3ltYm9scyA9IFNVQlNUSVRVVElPTl9TWU1CT0xTX05PX05BTUVEO1xuICAgIGlmIChuYW1lZENhcHR1cmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIG5hbWVkQ2FwdHVyZXMgPSB0b09iamVjdChuYW1lZENhcHR1cmVzKTtcbiAgICAgIHN5bWJvbHMgPSBTVUJTVElUVVRJT05fU1lNQk9MUztcbiAgICB9XG4gICAgcmV0dXJuICRyZXBsYWNlLmNhbGwocmVwbGFjZW1lbnQsIHN5bWJvbHMsIGZ1bmN0aW9uIChtYXRjaCwgY2gpIHtcbiAgICAgIHZhciBjYXB0dXJlO1xuICAgICAgc3dpdGNoIChjaC5jaGFyQXQoMCkpIHtcbiAgICAgICAgY2FzZSAnJCc6IHJldHVybiAnJCc7XG4gICAgICAgIGNhc2UgJyYnOiByZXR1cm4gbWF0Y2hlZDtcbiAgICAgICAgY2FzZSAnYCc6IHJldHVybiBzdHIuc2xpY2UoMCwgcG9zaXRpb24pO1xuICAgICAgICBjYXNlIFwiJ1wiOiByZXR1cm4gc3RyLnNsaWNlKHRhaWxQb3MpO1xuICAgICAgICBjYXNlICc8JzpcbiAgICAgICAgICBjYXB0dXJlID0gbmFtZWRDYXB0dXJlc1tjaC5zbGljZSgxLCAtMSldO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICBkZWZhdWx0OiAvLyBcXGRcXGQ/XG4gICAgICAgICAgdmFyIG4gPSArY2g7XG4gICAgICAgICAgaWYgKG4gPT09IDApIHJldHVybiBtYXRjaDtcbiAgICAgICAgICBpZiAobiA+IG0pIHtcbiAgICAgICAgICAgIHZhciBmID0gZmxvb3IobiAvIDEwKTtcbiAgICAgICAgICAgIGlmIChmID09PSAwKSByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgICBpZiAoZiA8PSBtKSByZXR1cm4gY2FwdHVyZXNbZiAtIDFdID09PSB1bmRlZmluZWQgPyBjaC5jaGFyQXQoMSkgOiBjYXB0dXJlc1tmIC0gMV0gKyBjaC5jaGFyQXQoMSk7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNhcHR1cmUgPSBjYXB0dXJlc1tuIC0gMV07XG4gICAgICB9XG4gICAgICByZXR1cm4gY2FwdHVyZSA9PT0gdW5kZWZpbmVkID8gJycgOiBjYXB0dXJlO1xuICAgIH0pO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnJlcXVpcmUoJy4vZXM2LnJlZ2V4cC5mbGFncycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgJGZsYWdzID0gcmVxdWlyZSgnLi9fZmxhZ3MnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSAvLi9bVE9fU1RSSU5HXTtcblxudmFyIGRlZmluZSA9IGZ1bmN0aW9uIChmbikge1xuICByZXF1aXJlKCcuL19yZWRlZmluZScpKFJlZ0V4cC5wcm90b3R5cGUsIFRPX1NUUklORywgZm4sIHRydWUpO1xufTtcblxuLy8gMjEuMi41LjE0IFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmcoKVxuaWYgKHJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkgeyByZXR1cm4gJHRvU3RyaW5nLmNhbGwoeyBzb3VyY2U6ICdhJywgZmxhZ3M6ICdiJyB9KSAhPSAnL2EvYic7IH0pKSB7XG4gIGRlZmluZShmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgUiA9IGFuT2JqZWN0KHRoaXMpO1xuICAgIHJldHVybiAnLycuY29uY2F0KFIuc291cmNlLCAnLycsXG4gICAgICAnZmxhZ3MnIGluIFIgPyBSLmZsYWdzIDogIURFU0NSSVBUT1JTICYmIFIgaW5zdGFuY2VvZiBSZWdFeHAgPyAkZmxhZ3MuY2FsbChSKSA6IHVuZGVmaW5lZCk7XG4gIH0pO1xuLy8gRkY0NC0gUmVnRXhwI3RvU3RyaW5nIGhhcyBhIHdyb25nIG5hbWVcbn0gZWxzZSBpZiAoJHRvU3RyaW5nLm5hbWUgIT0gVE9fU1RSSU5HKSB7XG4gIGRlZmluZShmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJHRvU3RyaW5nLmNhbGwodGhpcyk7XG4gIH0pO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vX2NvbGxlY3Rpb24tc3Ryb25nJyk7XG52YXIgdmFsaWRhdGUgPSByZXF1aXJlKCcuL192YWxpZGF0ZS1jb2xsZWN0aW9uJyk7XG52YXIgU0VUID0gJ1NldCc7XG5cbi8vIDIzLjIgU2V0IE9iamVjdHNcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbicpKFNFVCwgZnVuY3Rpb24gKGdldCkge1xuICByZXR1cm4gZnVuY3Rpb24gU2V0KCkgeyByZXR1cm4gZ2V0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTsgfTtcbn0sIHtcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXG4gIGFkZDogZnVuY3Rpb24gYWRkKHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgU0VUKSwgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4vLyAyMS4xLjMuMjcgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5yZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKFN0cmluZywgJ1N0cmluZycsIGZ1bmN0aW9uIChpdGVyYXRlZCkge1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGluZGV4ID0gdGhpcy5faTtcbiAgdmFyIHBvaW50O1xuICBpZiAoaW5kZXggPj0gTy5sZW5ndGgpIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgcG9pbnQgPSAkYXQoTywgaW5kZXgpO1xuICB0aGlzLl9pICs9IHBvaW50Lmxlbmd0aDtcbiAgcmV0dXJuIHsgdmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZSB9O1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBCLjIuMy4xMCBTdHJpbmcucHJvdG90eXBlLmxpbmsodXJsKVxucmVxdWlyZSgnLi9fc3RyaW5nLWh0bWwnKSgnbGluaycsIGZ1bmN0aW9uIChjcmVhdGVIVE1MKSB7XG4gIHJldHVybiBmdW5jdGlvbiBsaW5rKHVybCkge1xuICAgIHJldHVybiBjcmVhdGVIVE1MKHRoaXMsICdhJywgJ2hyZWYnLCB1cmwpO1xuICB9O1xufSk7XG4iLCIvLyAyMS4xLjMuMTggU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKHNlYXJjaFN0cmluZyBbLCBwb3NpdGlvbiBdKVxuJ3VzZSBzdHJpY3QnO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGNvbnRleHQgPSByZXF1aXJlKCcuL19zdHJpbmctY29udGV4dCcpO1xudmFyIFNUQVJUU19XSVRIID0gJ3N0YXJ0c1dpdGgnO1xudmFyICRzdGFydHNXaXRoID0gJydbU1RBUlRTX1dJVEhdO1xuXG4kZXhwb3J0KCRleHBvcnQuUCArICRleHBvcnQuRiAqIHJlcXVpcmUoJy4vX2ZhaWxzLWlzLXJlZ2V4cCcpKFNUQVJUU19XSVRIKSwgJ1N0cmluZycsIHtcbiAgc3RhcnRzV2l0aDogZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgLyogLCBwb3NpdGlvbiA9IDAgKi8pIHtcbiAgICB2YXIgdGhhdCA9IGNvbnRleHQodGhpcywgc2VhcmNoU3RyaW5nLCBTVEFSVFNfV0lUSCk7XG4gICAgdmFyIGluZGV4ID0gdG9MZW5ndGgoTWF0aC5taW4oYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIHRoYXQubGVuZ3RoKSk7XG4gICAgdmFyIHNlYXJjaCA9IFN0cmluZyhzZWFyY2hTdHJpbmcpO1xuICAgIHJldHVybiAkc3RhcnRzV2l0aFxuICAgICAgPyAkc3RhcnRzV2l0aC5jYWxsKHRoYXQsIHNlYXJjaCwgaW5kZXgpXG4gICAgICA6IHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoLmxlbmd0aCkgPT09IHNlYXJjaDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgTUVUQSA9IHJlcXVpcmUoJy4vX21ldGEnKS5LRVk7XG52YXIgJGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi9fdWlkJyk7XG52YXIgd2tzID0gcmVxdWlyZSgnLi9fd2tzJyk7XG52YXIgd2tzRXh0ID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpO1xudmFyIHdrc0RlZmluZSA9IHJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKTtcbnZhciBlbnVtS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0ta2V5cycpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuL19pcy1hcnJheScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIF9jcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZ09QTkV4dCA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuLWV4dCcpO1xudmFyICRHT1BEID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKTtcbnZhciAkRFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QRCA9ICRHT1BELmY7XG52YXIgZFAgPSAkRFAuZjtcbnZhciBnT1BOID0gZ09QTkV4dC5mO1xudmFyICRTeW1ib2wgPSBnbG9iYWwuU3ltYm9sO1xudmFyICRKU09OID0gZ2xvYmFsLkpTT047XG52YXIgX3N0cmluZ2lmeSA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcbnZhciBISURERU4gPSB3a3MoJ19oaWRkZW4nKTtcbnZhciBUT19QUklNSVRJVkUgPSB3a3MoJ3RvUHJpbWl0aXZlJyk7XG52YXIgaXNFbnVtID0ge30ucHJvcGVydHlJc0VudW1lcmFibGU7XG52YXIgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpO1xudmFyIEFsbFN5bWJvbHMgPSBzaGFyZWQoJ3N5bWJvbHMnKTtcbnZhciBPUFN5bWJvbHMgPSBzaGFyZWQoJ29wLXN5bWJvbHMnKTtcbnZhciBPYmplY3RQcm90byA9IE9iamVjdFtQUk9UT1RZUEVdO1xudmFyIFVTRV9OQVRJVkUgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xudmFyIFFPYmplY3QgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gX2NyZWF0ZShkUCh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBkUCh0aGlzLCAnYScsIHsgdmFsdWU6IDcgfSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbiAoaXQsIGtleSwgRCkge1xuICB2YXIgcHJvdG9EZXNjID0gZ09QRChPYmplY3RQcm90bywga2V5KTtcbiAgaWYgKHByb3RvRGVzYykgZGVsZXRlIE9iamVjdFByb3RvW2tleV07XG4gIGRQKGl0LCBrZXksIEQpO1xuICBpZiAocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bykgZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbiAodGFnKSB7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2xbUFJPVE9UWVBFXSk7XG4gIHN5bS5fayA9IHRhZztcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IFVTRV9OQVRJVkUgJiYgdHlwZW9mICRTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCcgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKSB7XG4gIGlmIChpdCA9PT0gT2JqZWN0UHJvdG8pICRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmIChoYXMoQWxsU3ltYm9scywga2V5KSkge1xuICAgIGlmICghRC5lbnVtZXJhYmxlKSB7XG4gICAgICBpZiAoIWhhcyhpdCwgSElEREVOKSkgZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pIGl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwgeyBlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKSB9KTtcbiAgICB9IHJldHVybiBzZXRTeW1ib2xEZXNjKGl0LCBrZXksIEQpO1xuICB9IHJldHVybiBkUChpdCwga2V5LCBEKTtcbn07XG52YXIgJGRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKGl0LCBQKSB7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgbCA9IGtleXMubGVuZ3RoO1xuICB2YXIga2V5O1xuICB3aGlsZSAobCA+IGkpICRkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xuICByZXR1cm4gaXQ7XG59O1xudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoaXQsIFApIHtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpIHtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV0gPyBFIDogdHJ1ZTtcbn07XG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KSB7XG4gIGl0ID0gdG9JT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSkgcmV0dXJuO1xuICB2YXIgRCA9IGdPUEQoaXQsIGtleSk7XG4gIGlmIChEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpIEQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpIHtcbiAgdmFyIG5hbWVzID0gZ09QTih0b0lPYmplY3QoaXQpKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIgaSA9IDA7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSB7XG4gICAgaWYgKCFoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYga2V5ICE9IEhJRERFTiAmJiBrZXkgIT0gTUVUQSkgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSB7XG4gIHZhciBJU19PUCA9IGl0ID09PSBPYmplY3RQcm90bztcbiAgdmFyIG5hbWVzID0gZ09QTihJU19PUCA/IE9QU3ltYm9scyA6IHRvSU9iamVjdChpdCkpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBpID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIHtcbiAgICBpZiAoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKSByZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xuXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcbmlmICghVVNFX05BVElWRSkge1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCkgdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgIGlmICh0aGlzID09PSBPYmplY3RQcm90bykgJHNldC5jYWxsKE9QU3ltYm9scywgdmFsdWUpO1xuICAgICAgaWYgKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpIHRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYgKERFU0NSSVBUT1JTICYmIHNldHRlcikgc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0IH0pO1xuICAgIHJldHVybiB3cmFwKHRhZyk7XG4gIH07XG4gIHJlZGVmaW5lKCRTeW1ib2xbUFJPVE9UWVBFXSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gICRHT1BELmYgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkRFAuZiA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpLmYgPSAkZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4gIGlmIChERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi9fbGlicmFyeScpKSB7XG4gICAgcmVkZWZpbmUoT2JqZWN0UHJvdG8sICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgdHJ1ZSk7XG4gIH1cblxuICB3a3NFeHQuZiA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgcmV0dXJuIHdyYXAod2tzKG5hbWUpKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgeyBTeW1ib2w6ICRTeW1ib2wgfSk7XG5cbmZvciAodmFyIGVzNlN5bWJvbHMgPSAoXG4gIC8vIDE5LjQuMi4yLCAxOS40LjIuMywgMTkuNC4yLjQsIDE5LjQuMi42LCAxOS40LjIuOCwgMTkuNC4yLjksIDE5LjQuMi4xMCwgMTkuNC4yLjExLCAxOS40LjIuMTIsIDE5LjQuMi4xMywgMTkuNC4yLjE0XG4gICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcbikuc3BsaXQoJywnKSwgaiA9IDA7IGVzNlN5bWJvbHMubGVuZ3RoID4gajspd2tzKGVzNlN5bWJvbHNbaisrXSk7XG5cbmZvciAodmFyIHdlbGxLbm93blN5bWJvbHMgPSAka2V5cyh3a3Muc3RvcmUpLCBrID0gMDsgd2VsbEtub3duU3ltYm9scy5sZW5ndGggPiBrOykgd2tzRGVmaW5lKHdlbGxLbm93blN5bWJvbHNbaysrXSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdTeW1ib2wnLCB7XG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxuICAnZm9yJzogZnVuY3Rpb24gKGtleSkge1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioc3ltKSB7XG4gICAgaWYgKCFpc1N5bWJvbChzeW0pKSB0aHJvdyBUeXBlRXJyb3Ioc3ltICsgJyBpcyBub3QgYSBzeW1ib2whJyk7XG4gICAgZm9yICh2YXIga2V5IGluIFN5bWJvbFJlZ2lzdHJ5KSBpZiAoU3ltYm9sUmVnaXN0cnlba2V5XSA9PT0gc3ltKSByZXR1cm4ga2V5O1xuICB9LFxuICB1c2VTZXR0ZXI6IGZ1bmN0aW9uICgpIHsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbiAoKSB7IHNldHRlciA9IGZhbHNlOyB9XG59KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6ICRjcmVhdGUsXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogJGRlZmluZVByb3BlcnR5LFxuICAvLyAxOS4xLjIuMyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiAkZGVmaW5lUHJvcGVydGllcyxcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogJGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIDI0LjMuMiBKU09OLnN0cmluZ2lmeSh2YWx1ZSBbLCByZXBsYWNlciBbLCBzcGFjZV1dKVxuJEpTT04gJiYgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgJGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIFMgPSAkU3ltYm9sKCk7XG4gIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gIC8vIFdlYktpdCBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMgbnVsbFxuICAvLyBWOCB0aHJvd3Mgb24gYm94ZWQgc3ltYm9sc1xuICByZXR1cm4gX3N0cmluZ2lmeShbU10pICE9ICdbbnVsbF0nIHx8IF9zdHJpbmdpZnkoeyBhOiBTIH0pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCkge1xuICAgIHZhciBhcmdzID0gW2l0XTtcbiAgICB2YXIgaSA9IDE7XG4gICAgdmFyIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUgKGFyZ3VtZW50cy5sZW5ndGggPiBpKSBhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgICRyZXBsYWNlciA9IHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgICBpZiAoIWlzT2JqZWN0KHJlcGxhY2VyKSAmJiBpdCA9PT0gdW5kZWZpbmVkIHx8IGlzU3ltYm9sKGl0KSkgcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgaWYgKCFpc0FycmF5KHJlcGxhY2VyKSkgcmVwbGFjZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgaWYgKHR5cGVvZiAkcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykgdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICAgIGlmICghaXNTeW1ib2wodmFsdWUpKSByZXR1cm4gdmFsdWU7XG4gICAgfTtcbiAgICBhcmdzWzFdID0gcmVwbGFjZXI7XG4gICAgcmV0dXJuIF9zdHJpbmdpZnkuYXBwbHkoJEpTT04sIGFyZ3MpO1xuICB9XG59KTtcblxuLy8gMTkuNC4zLjQgU3ltYm9sLnByb3RvdHlwZVtAQHRvUHJpbWl0aXZlXShoaW50KVxuJFN5bWJvbFtQUk9UT1RZUEVdW1RPX1BSSU1JVElWRV0gfHwgcmVxdWlyZSgnLi9faGlkZScpKCRTeW1ib2xbUFJPVE9UWVBFXSwgVE9fUFJJTUlUSVZFLCAkU3ltYm9sW1BST1RPVFlQRV0udmFsdWVPZik7XG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZygkU3ltYm9sLCAnU3ltYm9sJyk7XG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKGdsb2JhbC5KU09OLCAnSlNPTicsIHRydWUpO1xuIiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdhc3luY0l0ZXJhdG9yJyk7XG4iLCJ2YXIgJGl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgd2tzID0gcmVxdWlyZSgnLi9fd2tzJyk7XG52YXIgSVRFUkFUT1IgPSB3a3MoJ2l0ZXJhdG9yJyk7XG52YXIgVE9fU1RSSU5HX1RBRyA9IHdrcygndG9TdHJpbmdUYWcnKTtcbnZhciBBcnJheVZhbHVlcyA9IEl0ZXJhdG9ycy5BcnJheTtcblxudmFyIERPTUl0ZXJhYmxlcyA9IHtcbiAgQ1NTUnVsZUxpc3Q6IHRydWUsIC8vIFRPRE86IE5vdCBzcGVjIGNvbXBsaWFudCwgc2hvdWxkIGJlIGZhbHNlLlxuICBDU1NTdHlsZURlY2xhcmF0aW9uOiBmYWxzZSxcbiAgQ1NTVmFsdWVMaXN0OiBmYWxzZSxcbiAgQ2xpZW50UmVjdExpc3Q6IGZhbHNlLFxuICBET01SZWN0TGlzdDogZmFsc2UsXG4gIERPTVN0cmluZ0xpc3Q6IGZhbHNlLFxuICBET01Ub2tlbkxpc3Q6IHRydWUsXG4gIERhdGFUcmFuc2Zlckl0ZW1MaXN0OiBmYWxzZSxcbiAgRmlsZUxpc3Q6IGZhbHNlLFxuICBIVE1MQWxsQ29sbGVjdGlvbjogZmFsc2UsXG4gIEhUTUxDb2xsZWN0aW9uOiBmYWxzZSxcbiAgSFRNTEZvcm1FbGVtZW50OiBmYWxzZSxcbiAgSFRNTFNlbGVjdEVsZW1lbnQ6IGZhbHNlLFxuICBNZWRpYUxpc3Q6IHRydWUsIC8vIFRPRE86IE5vdCBzcGVjIGNvbXBsaWFudCwgc2hvdWxkIGJlIGZhbHNlLlxuICBNaW1lVHlwZUFycmF5OiBmYWxzZSxcbiAgTmFtZWROb2RlTWFwOiBmYWxzZSxcbiAgTm9kZUxpc3Q6IHRydWUsXG4gIFBhaW50UmVxdWVzdExpc3Q6IGZhbHNlLFxuICBQbHVnaW46IGZhbHNlLFxuICBQbHVnaW5BcnJheTogZmFsc2UsXG4gIFNWR0xlbmd0aExpc3Q6IGZhbHNlLFxuICBTVkdOdW1iZXJMaXN0OiBmYWxzZSxcbiAgU1ZHUGF0aFNlZ0xpc3Q6IGZhbHNlLFxuICBTVkdQb2ludExpc3Q6IGZhbHNlLFxuICBTVkdTdHJpbmdMaXN0OiBmYWxzZSxcbiAgU1ZHVHJhbnNmb3JtTGlzdDogZmFsc2UsXG4gIFNvdXJjZUJ1ZmZlckxpc3Q6IGZhbHNlLFxuICBTdHlsZVNoZWV0TGlzdDogdHJ1ZSwgLy8gVE9ETzogTm90IHNwZWMgY29tcGxpYW50LCBzaG91bGQgYmUgZmFsc2UuXG4gIFRleHRUcmFja0N1ZUxpc3Q6IGZhbHNlLFxuICBUZXh0VHJhY2tMaXN0OiBmYWxzZSxcbiAgVG91Y2hMaXN0OiBmYWxzZVxufTtcblxuZm9yICh2YXIgY29sbGVjdGlvbnMgPSBnZXRLZXlzKERPTUl0ZXJhYmxlcyksIGkgPSAwOyBpIDwgY29sbGVjdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgdmFyIE5BTUUgPSBjb2xsZWN0aW9uc1tpXTtcbiAgdmFyIGV4cGxpY2l0ID0gRE9NSXRlcmFibGVzW05BTUVdO1xuICB2YXIgQ29sbGVjdGlvbiA9IGdsb2JhbFtOQU1FXTtcbiAgdmFyIHByb3RvID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgdmFyIGtleTtcbiAgaWYgKHByb3RvKSB7XG4gICAgaWYgKCFwcm90b1tJVEVSQVRPUl0pIGhpZGUocHJvdG8sIElURVJBVE9SLCBBcnJheVZhbHVlcyk7XG4gICAgaWYgKCFwcm90b1tUT19TVFJJTkdfVEFHXSkgaGlkZShwcm90bywgVE9fU1RSSU5HX1RBRywgTkFNRSk7XG4gICAgSXRlcmF0b3JzW05BTUVdID0gQXJyYXlWYWx1ZXM7XG4gICAgaWYgKGV4cGxpY2l0KSBmb3IgKGtleSBpbiAkaXRlcmF0b3JzKSBpZiAoIXByb3RvW2tleV0pIHJlZGVmaW5lKHByb3RvLCBrZXksICRpdGVyYXRvcnNba2V5XSwgdHJ1ZSk7XG4gIH1cbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFBhcnRpY2xlc18xID0gcmVxdWlyZShcIi4uL1BhcnRpY2xlcy9QYXJ0aWNsZXNcIik7XG52YXIgU3RhcnNfMSA9IHJlcXVpcmUoXCIuL1N0YXJzXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgY2FudmFzID0gbmV3IFBhcnRpY2xlc18xLmRlZmF1bHQoJyNwYXJ0aWNsZXMnLCAnMmQnKTtcbmNhbnZhcy5zZXRQYXJ0aWNsZVNldHRpbmdzKFN0YXJzXzEuU3RhcnMuUGFydGljbGVzKTtcbmNhbnZhcy5zZXRJbnRlcmFjdGl2ZVNldHRpbmdzKFN0YXJzXzEuU3RhcnMuSW50ZXJhY3RpdmUpO1xuY2FudmFzLnN0YXJ0KCk7XG52YXIgcGF1c2VkID0gZmFsc2U7XG5XZWJQYWdlXzEuU2Nyb2xsSG9vay5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFdlYlBhZ2VfMS5TZWN0aW9ucy5nZXQoJ2NhbnZhcycpLmluVmlldygpKSB7XG4gICAgICAgIGlmIChwYXVzZWQpIHtcbiAgICAgICAgICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgY2FudmFzLnJlc3VtZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoIXBhdXNlZCkge1xuICAgICAgICAgICAgcGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNhbnZhcy5wYXVzZSgpO1xuICAgICAgICB9XG4gICAgfVxufSwge1xuICAgIGNhcHR1cmU6IHRydWUsXG4gICAgcGFzc2l2ZTogdHJ1ZVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU3RhcnMgPSB7XG4gICAgUGFydGljbGVzOiB7XG4gICAgICAgIG51bWJlcjogMzAwLFxuICAgICAgICBkZW5zaXR5OiAyMDAsXG4gICAgICAgIGNvbG9yOiAnI0ZGRkZGRicsXG4gICAgICAgIG9wYWNpdHk6ICdyYW5kb20nLFxuICAgICAgICByYWRpdXM6IFsyLCAyLjUsIDMsIDMuNSwgNCwgNC41XSxcbiAgICAgICAgc2hhcGU6ICdjaXJjbGUnLFxuICAgICAgICBzdHJva2U6IHtcbiAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgY29sb3I6ICcjMDAwMDAwJ1xuICAgICAgICB9LFxuICAgICAgICBtb3ZlOiB7XG4gICAgICAgICAgICBzcGVlZDogMC4yLFxuICAgICAgICAgICAgZGlyZWN0aW9uOiAncmFuZG9tJyxcbiAgICAgICAgICAgIHN0cmFpZ2h0OiBmYWxzZSxcbiAgICAgICAgICAgIHJhbmRvbTogdHJ1ZSxcbiAgICAgICAgICAgIGVkZ2VCb3VuY2U6IGZhbHNlLFxuICAgICAgICAgICAgYXR0cmFjdDogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgZXZlbnRzOiB7XG4gICAgICAgICAgICByZXNpemU6IHRydWUsXG4gICAgICAgICAgICBob3ZlcjogJ2J1YmJsZScsXG4gICAgICAgICAgICBjbGljazogZmFsc2VcbiAgICAgICAgfSxcbiAgICAgICAgYW5pbWF0ZToge1xuICAgICAgICAgICAgb3BhY2l0eToge1xuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjIsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIHN5bmM6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmFkaXVzOiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDMsXG4gICAgICAgICAgICAgICAgbWluOiAwLFxuICAgICAgICAgICAgICAgIHN5bmM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuICAgIEludGVyYWN0aXZlOiB7XG4gICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICBidWJibGU6IHtcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogNzUsXG4gICAgICAgICAgICAgICAgcmFkaXVzOiA4LFxuICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgRXhwZXJpZW5jZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gRXhwZXJpZW5jZShkYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuICAgIEV4cGVyaWVuY2UucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjYXJkIGlzLXRoZW1lLXNlY29uZGFyeSBlbGV2YXRpb24tMSBleHBlcmllbmNlXCIgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTJcIiB9LFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaGVhZGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpY29uXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IFwiLi9vdXQvaW1hZ2VzL0V4cGVyaWVuY2UvXCIgKyB0aGlzLmRhdGEuc3ZnICsgXCIuc3ZnXCIgfSkpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjb21wYW55XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiwgY2xhc3NOYW1lOiBcIm5hbWUgaXMtc2l6ZS00IGlzLW5vcm1hbC13ZWlnaHQgaXMtdXBwZXJjYXNlIGlzLWNvbG9yZWQtbGlua1wiIH0sIHRoaXMuZGF0YS5jb21wYW55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImxvY2F0aW9uIGlzLXNpemUtOCBpcy1pdGFsaWMgaXMtY29sb3ItbGlnaHQgaXMtbm9ybWFsLXdlaWdodFwiIH0sIHRoaXMuZGF0YS5sb2NhdGlvbikpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInJvbGVcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwibmFtZSBpcy1zaXplLTYgaXMtYm9sZC13ZWlnaHRcIiB9LCB0aGlzLmRhdGEucG9zaXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZGF0ZSBpcy1zaXplLTggaXMtaXRhbGljIGlzLWNvbG9yLWxpZ2h0IGlzLW5vcm1hbC13ZWlnaHRcIiB9LCBcIihcIiArIHRoaXMuZGF0YS5iZWdpbiArIFwiIFxcdTIwMTQgXCIgKyB0aGlzLmRhdGEuZW5kICsgXCIpXCIpKSksXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImhyXCIsIG51bGwpLFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBpbmZvXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZGVzY3JpcHRpb24gaXMtc2l6ZS04IGlzLW5vcm1hbC13ZWlnaHQgaXMtY29sb3ItbGlnaHQgaXMtaXRhbGljIGlzLWp1c3RpZmllZCBpcy1xdW90ZVwiIH0sIHRoaXMuZGF0YS5mbGF2b3IpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwidWxcIiwgeyBjbGFzc05hbWU6IFwiam9iIGlzLWxlZnQtYWxpZ25lZCBpcy1zaXplLTcgeHMteS1wYWRkaW5nLWJldHdlZW4tMVwiIH0sIHRoaXMuZGF0YS5yb2xlcy5tYXAoZnVuY3Rpb24gKHJvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgcm9sZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKSkpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gRXhwZXJpZW5jZTtcbn0oKSk7XG5leHBvcnRzLkV4cGVyaWVuY2UgPSBFeHBlcmllbmNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBFdmVudERpc3BhdGNoZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBNZW51ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWVudSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNZW51KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5vcGVuID0gZmFsc2U7XG4gICAgICAgIF90aGlzLkNvbnRhaW5lciA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5tZW51Jyk7XG4gICAgICAgIF90aGlzLkhhbWJ1cmdlciA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5tZW51IC5oYW1idXJnZXInKTtcbiAgICAgICAgX3RoaXMucmVnaXN0ZXIoJ3RvZ2dsZScpO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIE1lbnUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vcGVuID0gIXRoaXMub3BlbjtcbiAgICAgICAgaWYgKHRoaXMub3Blbikge1xuICAgICAgICAgICAgdGhpcy5Db250YWluZXIuc2V0QXR0cmlidXRlKCdvcGVuJywgJycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5Db250YWluZXIucmVtb3ZlQXR0cmlidXRlKCdvcGVuJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kaXNwYXRjaCgndG9nZ2xlJywgeyBvcGVuOiB0aGlzLm9wZW4gfSk7XG4gICAgfTtcbiAgICByZXR1cm4gTWVudTtcbn0oRXZlbnREaXNwYXRjaGVyXzEuRXZlbnRzLkV2ZW50RGlzcGF0Y2hlcikpO1xuZXhwb3J0cy5NZW51ID0gTWVudTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEpTWF8xID0gcmVxdWlyZShcIi4uLy4uL0RlZmluaXRpb25zL0pTWFwiKTtcbnZhciBQcm9qZWN0ID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQcm9qZWN0KGRhdGEpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgdGhpcy5pbmZvRGlzcGxheWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMuY3JlYXRlRWxlbWVudCgpO1xuICAgIH1cbiAgICBQcm9qZWN0LnByb3RvdHlwZS5sZXNzSW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbmZvRGlzcGxheWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfTtcbiAgICBQcm9qZWN0LnByb3RvdHlwZS50b2dnbGVJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluZm9EaXNwbGF5ZWQgPSAhdGhpcy5pbmZvRGlzcGxheWVkO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH07XG4gICAgUHJvamVjdC5wcm90b3R5cGUuZ2V0UmVmZXJlbmNlID0gZnVuY3Rpb24gKHJlZikge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCJbcmVmPVxcXCJcIiArIHJlZiArIFwiXFxcIl1cIikgfHwgbnVsbDtcbiAgICB9O1xuICAgIFByb2plY3QucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuaW5mb0Rpc3BsYXllZCkge1xuICAgICAgICAgICAgdGhpcy5nZXRSZWZlcmVuY2UoJ3NsaWRlcicpLnNldEF0dHJpYnV0ZSgnb3BlbmVkJywgJycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5nZXRSZWZlcmVuY2UoJ3NsaWRlcicpLnJlbW92ZUF0dHJpYnV0ZSgnb3BlbmVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5nZXRSZWZlcmVuY2UoJ2luZm9UZXh0JykuaW5uZXJIVE1MID0gKHRoaXMuaW5mb0Rpc3BsYXllZCA/ICdMZXNzJyA6ICdNb3JlJykgKyBcIiBJbmZvXCI7XG4gICAgfTtcbiAgICBQcm9qZWN0LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5saW5lU3R5bGUgPSB7XG4gICAgICAgICAgICAnLS1idXR0b24tYmFja2dyb3VuZC1jb2xvcic6IHRoaXMuZGF0YS5jb2xvclxuICAgICAgICB9O1xuICAgICAgICB2YXIgaW1hZ2VTdHlsZSA9IHtcbiAgICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogXCJ1cmwoXCIgKyAoXCIuL291dC9pbWFnZXMvUHJvamVjdHMvXCIgKyB0aGlzLmRhdGEuaW1hZ2UpICsgXCIpXCJcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gKEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwieHMtMTIgc20tNiBtZC00XCIgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicHJvamVjdCBjYXJkIGlzLXRoZW1lLXNlY29uZGFyeSBlbGV2YXRpb24tMSBpcy1pbi1ncmlkXCIsIHN0eWxlOiBpbmxpbmVTdHlsZSB9LFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaW1hZ2VcIiwgc3R5bGU6IGltYWdlU3R5bGUgfSksXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjb250ZW50IHBhZGRpbmctMlwiIH0sXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwidGl0bGVcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwibmFtZSBpcy1zaXplLTYgaXMtYm9sZC13ZWlnaHRcIiwgc3R5bGU6IHsgY29sb3I6IHRoaXMuZGF0YS5jb2xvciB9IH0sIHRoaXMuZGF0YS5uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInR5cGUgaXMtc2l6ZS04XCIgfSwgdGhpcy5kYXRhLnR5cGUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZGF0ZSBpcy1zaXplLTggaXMtY29sb3ItbGlnaHRcIiB9LCB0aGlzLmRhdGEuZGF0ZSkpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImJvZHlcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZmxhdm9yIGlzLXNpemUtN1wiIH0sIHRoaXMuZGF0YS5mbGF2b3IpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJzbGlkZXIgaXMtdGhlbWUtc2Vjb25kYXJ5XCIsIHJlZjogXCJzbGlkZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjb250ZW50IHBhZGRpbmctNFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0aXRsZSBmbGV4IHJvdyB4cy14LWJlZ2luIHhzLXktY2VudGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiaXMtc2l6ZS02IGlzLWJvbGQtd2VpZ2h0XCIgfSwgXCJEZXRhaWxzXCIpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcImJ0biBjbG9zZSBpcy1zdmcgaXMtcHJpbWFyeSB4cy14LXNlbGYtZW5kXCIsIHRhYmluZGV4OiBcIi0xXCIsIG9uQ2xpY2s6IHRoaXMubGVzc0luZm8uYmluZCh0aGlzKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImlcIiwgeyBjbGFzc05hbWU6IFwiZmFzIGZhLXRpbWVzXCIgfSkpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImJvZHlcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwidWxcIiwgeyBjbGFzc05hbWU6IFwiZGV0YWlscyB4cy15LXBhZGRpbmctYmV0d2Vlbi0xIGlzLXNpemUtOFwiIH0sIHRoaXMuZGF0YS5kZXRhaWxzLm1hcChmdW5jdGlvbiAoZGV0YWlsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImxpXCIsIG51bGwsIGRldGFpbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pKSkpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJvcHRpb25zIGlzLXRoZW1lLXNlY29uZGFyeSB4cy14LW1hcmdpbi1iZXR3ZWVuLTFcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiLCB7IGNsYXNzTmFtZTogXCJpbmZvIGJ0biBpcy1wcmltYXJ5IGlzLXRleHQgaXMtY3VzdG9tXCIsIG9uQ2xpY2s6IHRoaXMudG9nZ2xlSW5mby5iaW5kKHRoaXMpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImlcIiwgeyBjbGFzc05hbWU6IFwiZmFzIGZhLWluZm9cIiB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHJlZjogXCJpbmZvVGV4dFwiIH0sIFwiTW9yZSBJbmZvXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5yZXBvID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJjb2RlIGJ0biBpcy1wcmltYXJ5IGlzLXRleHQgaXMtY3VzdG9tXCIsIGhyZWY6IHRoaXMuZGF0YS5yZXBvLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIHRhYmluZGV4OiBcIjBcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYXMgZmEtY29kZVwiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBcIlNlZSBDb2RlXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5leHRlcm5hbCA/XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImFcIiwgeyBjbGFzc05hbWU6IFwiZXh0ZXJuYWwgYnRuIGlzLXByaW1hcnkgaXMtdGV4dCBpcy1jdXN0b21cIiwgaHJlZjogdGhpcy5kYXRhLmV4dGVybmFsLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIHRhYmluZGV4OiBcIjBcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYXMgZmEtZXh0ZXJuYWwtbGluay1hbHRcIiB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgbnVsbCwgXCJWaWV3IE9ubGluZVwiKSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGwpKSkpKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudDtcbiAgICB9O1xuICAgIHJldHVybiBQcm9qZWN0O1xufSgpKTtcbmV4cG9ydHMuUHJvamVjdCA9IFByb2plY3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgUXVhbGl0eSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUXVhbGl0eShkYXRhKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuICAgIFF1YWxpdHkucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ4cy0xMiBzbS00XCIgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImljb24gXCIgKyB0aGlzLmRhdGEuZmFDbGFzcyB9KSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcInF1YWxpdHkgaXMtc2l6ZS01IGlzLXVwcGVyY2FzZVwiIH0sIHRoaXMuZGF0YS5uYW1lKSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImRlc2MgaXMtbGlnaHQtd2VpZ2h0IGlzLXNpemUtNlwiIH0sIHRoaXMuZGF0YS5kZXNjcmlwdGlvbikpKTtcbiAgICB9O1xuICAgIHJldHVybiBRdWFsaXR5O1xufSgpKTtcbmV4cG9ydHMuUXVhbGl0eSA9IFF1YWxpdHk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBTZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTZWN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB9XG4gICAgU2VjdGlvbi5wcm90b3R5cGUuaW5WaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYm91bmRpbmcgPSB0aGlzLmVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciB2aWV3ID0gRE9NXzEuRE9NLmdldFZpZXdwb3J0KCk7XG4gICAgICAgIHJldHVybiBib3VuZGluZy5ib3R0b20gPj0gMCAmJlxuICAgICAgICAgICAgYm91bmRpbmcucmlnaHQgPj0gMCAmJlxuICAgICAgICAgICAgYm91bmRpbmcudG9wIDw9IHZpZXcuaGVpZ2h0ICYmXG4gICAgICAgICAgICBib3VuZGluZy5sZWZ0IDw9IHZpZXcud2lkdGg7XG4gICAgfTtcbiAgICBTZWN0aW9uLnByb3RvdHlwZS5nZXRJRCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5pZDtcbiAgICB9O1xuICAgIFNlY3Rpb24ucHJvdG90eXBlLmluTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLmVsZW1lbnQuY2xhc3NMaXN0LmNvbnRhaW5zKCduby1tZW51Jyk7XG4gICAgfTtcbiAgICByZXR1cm4gU2VjdGlvbjtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTZWN0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU1ZHXzEgPSByZXF1aXJlKFwiLi4vLi4vTW9kdWxlcy9TVkdcIik7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIFNraWxsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTa2lsbChkYXRhKSB7XG4gICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgfVxuICAgIFNraWxsLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLmVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKF90aGlzLmVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgU1ZHXzEuU1ZHLmxvYWRTVkcoXCIuL291dC9pbWFnZXMvU2tpbGxzL1wiICsgX3RoaXMuZGF0YS5zdmcpLnRoZW4oZnVuY3Rpb24gKHN2Zykge1xuICAgICAgICAgICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2ljb24nKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7IGNsYXNzTmFtZTogJ3NraWxsJyB9LFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiAnaGV4YWdvbi1jb250YWluZXInLCBzdHlsZTogeyBjb2xvcjogX3RoaXMuZGF0YS5jb2xvciB9IH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IGNsYXNzTmFtZTogJ3Rvb2x0aXAnIH0sIF90aGlzLmRhdGEubmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBzdmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBTa2lsbC5IZXhhZ29uU1ZHLmNsb25lTm9kZSh0cnVlKSkpKTtcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNraWxsLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoU2tpbGwuSGV4YWdvblNWRykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBTVkdfMS5TVkcubG9hZFNWRygnLi9vdXQvaW1hZ2VzL0NvbnRlbnQvSGV4YWdvbicpLnRoZW4oZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2hleGFnb24nKTtcbiAgICAgICAgICAgICAgICAgICAgU2tpbGwuSGV4YWdvblNWRyA9IGVsZW1lbnQ7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIFNraWxsO1xufSgpKTtcbmV4cG9ydHMuU2tpbGwgPSBTa2lsbDtcblNraWxsLmluaXRpYWxpemUoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5BYm91dE1lID0gXCJJIGFtIGFuIGFzcGlyaW5nIHdlYiBkZXZlbG9wZXIgYW5kIHNvZnR3YXJlIGVuZ2luZWVyIGNoYXNpbmcgbXkgcGFzc2lvbiBmb3Igd29ya2luZyB3aXRoIHRlY2hub2xvZ3kgYW5kIHByb2dyYW1taW5nIGF0IHRoZSBVbml2ZXJzaXR5IG9mIFRleGFzIGF0IERhbGxhcy4gSSBjcmF2ZSB0aGUgb3Bwb3J0dW5pdHkgdG8gY29udHJpYnV0ZSB0byBtZWFuaW5nZnVsIHByb2plY3RzIHRoYXQgZW1wbG95IG15IGN1cnJlbnQgZ2lmdHMgYW5kIGludGVyZXN0cyB3aGlsZSBhbHNvIHNob3ZpbmcgbWUgb3V0IG9mIG15IGNvbWZvcnQgem9uZSB0byBsZWFybiBuZXcgc2tpbGxzLiBNeSBnb2FsIGlzIHRvIG1heGltaXplIGV2ZXJ5IGV4cGVyaWVuY2UgYXMgYW4gb3Bwb3J0dW5pdHkgZm9yIHBlcnNvbmFsLCBwcm9mZXNzaW9uYWwsIGFuZCB0ZWNobmljYWwgZ3Jvd3RoLlwiO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkV4cGVyaWVuY2UgPSBbXG4gICAge1xuICAgICAgICBzdmc6ICdtZWRpdCcsXG4gICAgICAgIGxpbms6ICdodHRwOi8vbWVkaXQub25saW5lJyxcbiAgICAgICAgY29tcGFueTogJ01lZGl0JyxcbiAgICAgICAgbG9jYXRpb246ICdEdWJsaW4sIElyZWxhbmQnLFxuICAgICAgICBwb3NpdGlvbjogJ1dlYiBBcHBsaWNhdGlvbiBEZXZlbG9wZXInLFxuICAgICAgICBiZWdpbjogJ01heSAyMDE5JyxcbiAgICAgICAgZW5kOiAnSnVseSAyMDE5JyxcbiAgICAgICAgZmxhdm9yOiAnTWVkaXQgaXMgYSBzdGFydC11cCBjb21wYW55IGNvbW1pdHRlZCB0byBtYWtpbmcgbWVkaWNhbCBlZHVjYXRpb24gbW9yZSBlZmZpY2llbnQgdGhyb3VnaCB0aGVpciBtb2JpbGUgc29sdXRpb25zLiBCeSBjb21iaW5pbmcgdGVjaG5vbG9neSB3aXRoIGN1cmF0ZWQgY29udGVudCwgcHJhY3RpY2luZyBwcm9mZXNzaW9uYWxzIGFyZSBnaXZlbiBhIHF1aWNrLCB1bmlxdWUsIGFuZCByZWxldmFudCBsZWFybmluZyBleHBlcmllbmNlLiBJIGhhZCB0aGUgb3Bwb3J0dW5pdHkgdG8gd29yayBhcyB0aGUgY29tcGFueVxcJ3MgZmlyc3Qgd2ViIGRldmVsb3BlciwgbGF5aW5nIGRvd24gdGhlIGVzc2VudGlhbCBmb3VuZGF0aW9ucyBmb3IgYSB3ZWItYmFzZWQgdmVyc2lvbiBvZiB0aGVpciBhcHBsaWNhdGlvbi4nLFxuICAgICAgICByb2xlczogW1xuICAgICAgICAgICAgJ0FyY2hpdGVjdGVkIHRoZSBpbml0aWFsIGZvdW5kYXRpb25zIGZvciBhIGZ1bGwtc2NhbGUsIHNpbmdsZS1wYWdlIHdlYiBhcHBsaWNhdGlvbiB1c2luZyBWdWUsIFR5cGVTY3JpcHQsIGFuZCBTQVNTLicsXG4gICAgICAgICAgICAnRGVzaWduZWQgYW4gaW50ZXJmYWNlLW9yaWVudGVkLCBtb2R1bGFyaXplZCBzdGF0ZSBtYW5hZ2VtZW50IHN5c3RlbSB0byB3b3JrIGJlaGluZCB0aGUgYXBwbGljYXRpb24uJyxcbiAgICAgICAgICAgICdEZXZlbG9wZWQgYSBWdWUgY29uZmlndXJhdGlvbiBsaWJyYXJ5IHRvIGVuaGFuY2UgdGhlIGFiaWxpdHkgdG8gbW9jayBhcHBsaWNhdGlvbiBzdGF0ZSBpbiB1bml0IHRlc3RpbmcuJyxcbiAgICAgICAgICAgICdFc3RiYWxpc2hlZCBhIGNvbXByZWhlbnNpdmUgVUkgY29tcG9uZW50IGxpYnJhcnkgdG8gYWNjZWxlcmF0ZSB0aGUgYWJpbGl0eSB0byBhZGQgbmV3IGNvbnRlbnQuJ1xuICAgICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHN2ZzogJ2xpZmVjaHVyY2gnLFxuICAgICAgICBsaW5rOiAnaHR0cDovL2xpZmUuY2h1cmNoJyxcbiAgICAgICAgY29tcGFueTogJ0xpZmUuQ2h1cmNoJyxcbiAgICAgICAgbG9jYXRpb246ICdFZG1vbmQsIE9LLCBVU0EnLFxuICAgICAgICBwb3NpdGlvbjogJ0luZm9ybWF0aW9uIFRlY2hub2xvZ3kgSW50ZXJuJyxcbiAgICAgICAgYmVnaW46ICdNYXkgMjAxOCcsXG4gICAgICAgIGVuZDogJ0F1Z3VzdCAyMDE4JyxcbiAgICAgICAgZmxhdm9yOiAnTGlmZS5DaHVyY2ggaXMgYSBtdWx0aS1zaXRlIGNodXJjaCB3aXRoIGEgd29ybGR3aWRlIGltcGFjdCwgY2VudGVyZWQgYXJvdW5kIHRoZWlyIG1pc3Npb24gdG8gXCJsZWFkIHBlb3BsZSB0byBiZWNvbWUgZnVsbHktZGV2b3RlZCBmb2xsb3dlcnMgb2YgQ2hyaXN0LlwiIEkgd29ya2VkIGFsb25nc2lkZSB0aGVpciBDZW50cmFsIEluZm9ybWF0aW9uIFRlY2hub2xvZ3kgdGVhbTogYSBncm91cCBkZWRpY2F0ZWQgdG8gdXRpbGl6aW5nIHRlY2hub2xvZ3kgdG8gc2VydmUgYW5kIGVxdWlwIHRoZSBjaHVyY2guJyxcbiAgICAgICAgcm9sZXM6IFtcbiAgICAgICAgICAgICdTcGVudCB0aW1lIGxlYXJuaW5nIGZyb20gaGFyZHdhcmUsIHNvZnR3YXJlLCBhbmQgZGF0YWJhc2UgdGVhbXMgaW4gYW4gQWdpbGUgZW52aXJvbm1lbnQuJyxcbiAgICAgICAgICAgICdEZXNpZ25lZCBhbmQgZGV2ZWxvcGVkIGEgd2ViIGFwcGxpY2F0aW9uIGZvciByZW1vdGUgdm9sdW50ZWVyIHRyYWNraW5nIHdpdGggTm9kZS5qcyBhbmQgUG9zdGdyZVNRTC4nLFxuICAgICAgICAgICAgJ0R5bmFtaWNhbGx5IGRlcGxveWVkIGFwcGxpY2F0aW9uIHRvIEdvb2dsZSBDbG91ZCBQbGF0Zm9ybSB1c2luZyBDbG91ZCBCdWlsZHMsIERvY2tlciwgYW5kIEt1YmVybmV0ZXMuJ1xuICAgICAgICBdXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Qcm9qZWN0cyA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6ICdQb3J0Zm9saW8gV2Vic2l0ZScsXG4gICAgICAgIGNvbG9yOiAnIzI5QUI4NycsXG4gICAgICAgIGltYWdlOiAncG9ydGZvbGlvLXdlYnNpdGUuanBnJyxcbiAgICAgICAgdHlwZTogJ1NpZGUgUHJvamVjdCcsXG4gICAgICAgIGRhdGU6ICdTcHJpbmcvRmFsbCAyMDE5JyxcbiAgICAgICAgZmxhdm9yOiAnUGVyc29uYWwgd2Vic2l0ZSB0byBzaG93Y2FzZSBteSB3b3JrIGFuZCBleHBlcmllbmNlLicsXG4gICAgICAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkL3BvcnRmb2xpby13ZWJzaXRlJyxcbiAgICAgICAgZXh0ZXJuYWw6ICdodHRwczovL2phY2tzb24ubmVzdGVscm9hZC5jb20nLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAnSW1wbGVtZW50ZWQgZnJvbSBzY3JhdGNoIHdpdGggcHVyZSBUeXBlU2NyaXB0LicsXG4gICAgICAgICAgICAnQ3VzdG9tLW1hZGUsIGR5bmFtaWMgU0NTUyBsaWJyYXJ5LicsXG4gICAgICAgICAgICAnQ2xhc3MtYmFzZWQsIGVhc3ktdG8tdXBkYXRlIEpTWCByZW5kZXJpbmcgZm9yIHJlY3VycmluZyBjb250ZW50LicsXG4gICAgICAgICAgICAnU3VwcG9ydHMgSW50ZXJuZXQgRXhwbG9yZXIgMTEuJ1xuICAgICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdQb25kZXInLFxuICAgICAgICBjb2xvcjogJyNGRkE1MDAnLFxuICAgICAgICBpbWFnZTogJ3BvbmRlci5qcGcnLFxuICAgICAgICB0eXBlOiAnU2lkZSBQcm9qZWN0JyxcbiAgICAgICAgZGF0ZTogJ0hhY2tVVEQgMjAxOScsXG4gICAgICAgIGZsYXZvcjogJ1dlYiBhbmQgbW9iaWxlIGFwcGxpY2F0aW9uIHRvIG1ha2UgZ3JvdXAgYnJhaW5zdG9ybWluZyBvcmdhbml6ZWQgYW5kIGVmZmljaWVudC4nLFxuICAgICAgICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL2phY2tzb24tbmVzdGVscm9hZC9wb25kZXItaGFja3V0ZC0xOScsXG4gICAgICAgIGV4dGVybmFsOiBudWxsLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAnV2lubmVyIG9mIFwiQmVzdCBVSS9VWFwiIGZvciBIYWNrVVREIDIwMTkuJyxcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIFJlYWN0IGFuZCBGaXJlYmFzZSBSZWFsdGltZSBEYXRhYmFzZS4nLFxuICAgICAgICAgICAgJ0NvbXBsZXRlIGNvbm5lY3Rpb24gYW5kIHJlYWx0aW1lIHVwZGF0ZXMgd2l0aCBtb2JpbGUgY291bnRlcnBhcnQuJyxcbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnS2V5IENvbnN1bWVyJyxcbiAgICAgICAgY29sb3I6ICcjN0E2OUFEJyxcbiAgICAgICAgaW1hZ2U6ICdrZXktY29uc3VtZXIuanBnJyxcbiAgICAgICAgdHlwZTogJ1NpZGUgUHJvamVjdCcsXG4gICAgICAgIGRhdGU6ICdKYW51YXJ5IDIwMTknLFxuICAgICAgICBmbGF2b3I6ICdXaW5kb3dzIGNvbW1hbmQgdG8gYXR0YWNoIGEgbG93LWxldmVsIGtleWJvYXJkIGhvb2sgaW4gYW5vdGhlciBydW5uaW5nIHByb2Nlc3MuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQva2V5LWNvbnN1bWVyJyxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIEMrKyBhbmQgV2luZG93cyBBUEkuJyxcbiAgICAgICAgICAgICdBdHRhY2hlcyAuZGxsIGZpbGUgdG8gYW5vdGhlciBwcm9jZXNzIHRvIGF2b2lkIGRldGVjdGlvbi4nLFxuICAgICAgICAgICAgJ0ludGVyY2VwdHMgYW5kIGNoYW5nZXMga2V5IGlucHV0cyBvbiB0aGUgZmx5LidcbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQ29tZXQgQ2xpbWF0ZSBBUEknLFxuICAgICAgICBjb2xvcjogJyMyRDg3QzYnLFxuICAgICAgICBpbWFnZTogJ2NvbWV0LWNsaW1hdGUuanBnJyxcbiAgICAgICAgdHlwZTogJ0NsYXNzIFByb2plY3QnLFxuICAgICAgICBkYXRlOiAnTm92ZW1iZXIgMjAxOCcsXG4gICAgICAgIGZsYXZvcjogJ1NlbGYtdXBkYXRpbmcgQVBJIHRvIGNvbGxlY3QgY3VycmVudCB3ZWF0aGVyIGFuZCBUd2l0dGVyIGRhdGEgZm9yIHRoZSBVbml2ZXJzaXR5IG9mIFRleGFzIGF0IERhbGxhcy4nLFxuICAgICAgICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL2phY2tzb24tbmVzdGVscm9hZC9jb21ldC1jbGltYXRlLXNlcnZlcicsXG4gICAgICAgIGV4dGVybmFsOiBudWxsLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAnSW1wbGVtZW50ZWQgd2l0aCBDIyBhbmQgdGhlIC5ORVQgQ29yZSBsaWJyYXJ5LicsXG4gICAgICAgICAgICAnRGVwbG95ZWQgdG8gSGVyb2t1IHdpdGggUG9zdGdyZVNRTCBkYXRhYmFzZS4nLFxuICAgICAgICAgICAgJ0Fsd2F5cyByZXR1cm5zIGRhdGEgbGVzcyB0aGFuIDEwIG1pbnV0ZXMgb2xkLidcbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQ2hyaXN0LUNlbnRlcmVkJyxcbiAgICAgICAgY29sb3I6ICcjRkU5MDRFJyxcbiAgICAgICAgaW1hZ2U6ICdjaHJpc3QtY2VudGVyZWQuanBnJyxcbiAgICAgICAgdHlwZTogJ1NpZGUgUHJvamVjdCcsXG4gICAgICAgIGRhdGU6ICdGYWxsIDIwMTgnLFxuICAgICAgICBmbGF2b3I6ICdHb29nbGUgQ2hyb21lIGV4dGVuc2lvbiB0byBkZWxpdmVyIHRoZSBZb3VWZXJzaW9uIFZlcnNlIG9mIHRoZSBEYXkgdG8geW91ciBuZXcgdGFiLicsXG4gICAgICAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkL2NocmlzdC1jZW50ZXJlZCcsXG4gICAgICAgIGV4dGVybmFsOiAnaHR0cDovL2JpdC5seS9jaHJpc3QtY2VudGVyZWQnLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAnSW1wbGVtZW50ZWQgd2l0aCBSZWFjdCBhbmQgQ2hyb21lIEFQSS4nLFxuICAgICAgICAgICAgJ0N1c3RvbSB2ZXJzZSBzZWFyY2hpbmcgYnkga2V5d29yZCBvciBudW1iZXIuJyxcbiAgICAgICAgICAgICdHaXZlcyBjdXJyZW50IHdlYXRoZXIgZm9yIHVzZXJcXCdzIGxvY2F0aW9uIHZpYSB0aGUgT3BlbldlYXRoZXJNYXAgQVBJLidcbiAgICAgICAgXVxuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuUXVhbGl0aWVzID0gW1xuICAgIHtcbiAgICAgICAgZmFDbGFzczogJ2ZhcyBmYS1oaXN0b3J5JyxcbiAgICAgICAgbmFtZTogJ0VmZmljaWVudCcsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSBjb25zaXN0ZW50bHkgYnJpbmcgZW5lcmd5LCBwcm9kdWN0aXZpdHksIG9yZ2FuaXphdGlvbiwgYW5kIGFnaWxpdHkgdG8gdGhlIHRhYmxlIGFzIGFuIGVmZmVjdGl2ZSB3b3JrZXIgYW5kIGEgcXVpY2sgbGVhcm5lci4nXG4gICAgfSxcbiAgICB7XG4gICAgICAgIGZhQ2xhc3M6ICdmYXIgZmEtc25vd2ZsYWtlJyxcbiAgICAgICAgbmFtZTogJ0F0dGVudGl2ZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnVG8gbWUsIGV2ZXJ5IGRldGFpbCBtYXR0ZXJzLiBJIGxvdmUgZm9ybXVsYXRpbmcgdGhlIGJpZyBwaWN0dXJlIGp1c3QgYXMgbXVjaCBhcyBtZWFzdXJpbmcgb3V0IHRoZSB0aW55IGRldGFpbHMgYW5kIGVkZ2UgY2FzZXMuJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBmYUNsYXNzOiAnZmFzIGZhLWZlYXRoZXItYWx0JyxcbiAgICAgICAgbmFtZTogJ0ZsZXhpYmxlJyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdJIHdvcmsgYmVzdCB3aGVuIEkgYW0gY2hhbGxlbmdlZC4gV2hpbGUgSSB0aHJpdmUgaW4gb3JnYW5pemF0aW9uLCBJIGNhbiBhbHdheXMgYWRhcHQgYW5kIHBpY2sgdXAgbmV3IHRoaW5ncyBpbiBhIHN3aWZ0IG1hbm5lci4nXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Ta2lsbHMgPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnQysrJyxcbiAgICAgICAgc3ZnOiAnY3BsdXNwbHVzJyxcbiAgICAgICAgY29sb3I6ICcjOUIwMjNBJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQyMnLFxuICAgICAgICBzdmc6ICdjc2hhcnAnLFxuICAgICAgICBjb2xvcjogJyM5QjRGOTcnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdDU1MnLFxuICAgICAgICBzdmc6ICdjc3MnLFxuICAgICAgICBjb2xvcjogJyMzQzlDRDcnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdEb2NrZXInLFxuICAgICAgICBzdmc6ICdkb2NrZXInLFxuICAgICAgICBjb2xvcjogJyMyMkI5RUMnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICcuTkVUIENvcmUvRnJhbWV3b3JrJyxcbiAgICAgICAgc3ZnOiAnZG90bmV0JyxcbiAgICAgICAgY29sb3I6ICcjMEY3NkJEJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnRXhwcmVzcyBKUycsXG4gICAgICAgIHN2ZzogJ2V4cHJlc3MnLFxuICAgICAgICBjb2xvcjogJyMzRDNEM0QnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdGaXJlYmFzZScsXG4gICAgICAgIHN2ZzogJ2ZpcmViYXNlJyxcbiAgICAgICAgY29sb3I6ICcjRkZDQTI4J1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnR2l0JyxcbiAgICAgICAgc3ZnOiAnZ2l0JyxcbiAgICAgICAgY29sb3I6ICcjRjA1MDMyJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnR29vZ2xlIENsb3VkIFBsYXRmb3JtJyxcbiAgICAgICAgc3ZnOiAnZ2NwJyxcbiAgICAgICAgY29sb3I6ICcjNDM4NkZBJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnR3VscCcsXG4gICAgICAgIHN2ZzogJ2d1bHAnLFxuICAgICAgICBjb2xvcjogJyNEQTQ2NDgnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdIZXJva3UnLFxuICAgICAgICBzdmc6ICdoZXJva3UnLFxuICAgICAgICBjb2xvcjogJyM2NzYyQTYnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdIVE1MJyxcbiAgICAgICAgc3ZnOiAnaHRtbCcsXG4gICAgICAgIGNvbG9yOiAnI0VGNjUyQSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0phdmFTY3JpcHQnLFxuICAgICAgICBzdmc6ICdqYXZhc2NyaXB0JyxcbiAgICAgICAgY29sb3I6ICcjRjBEQjRGJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSmVzdCcsXG4gICAgICAgIHN2ZzogJ2plc3QnLFxuICAgICAgICBjb2xvcjogJyNDMjEzMjUnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdLdWJlcm5ldGVzJyxcbiAgICAgICAgc3ZnOiAna3ViZXJuZXRlcycsXG4gICAgICAgIGNvbG9yOiAnIzM1NkRFNidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ05vZGUuanMnLFxuICAgICAgICBzdmc6ICdub2RlanMnLFxuICAgICAgICBjb2xvcjogJyM4Q0M4NEInXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdQb3N0Z3JlU1FMJyxcbiAgICAgICAgc3ZnOiAncG9zdGdyZXNxbCcsXG4gICAgICAgIGNvbG9yOiAnIzMyNjY5MCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1JlYWN0JyxcbiAgICAgICAgc3ZnOiAncmVhY3QnLFxuICAgICAgICBjb2xvcjogJyMwMEQ4RkYnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdSIExhbmd1YWdlJyxcbiAgICAgICAgc3ZnOiAncmxhbmcnLFxuICAgICAgICBjb2xvcjogJyMyMzY5QkMnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdTQVNTL1NDU1MnLFxuICAgICAgICBzdmc6ICdzYXNzJyxcbiAgICAgICAgY29sb3I6ICcjQ0Q2NjlBJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnVHlwZVNjcmlwdCcsXG4gICAgICAgIHN2ZzogJ3R5cGVzY3JpcHQnLFxuICAgICAgICBjb2xvcjogJyMwMDdBQ0MnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdWdWUuanMnLFxuICAgICAgICBzdmc6ICd2dWUnLFxuICAgICAgICBjb2xvcjogJyM0RkMwOEQnXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEVsZW1lbnRGYWN0b3J5O1xuKGZ1bmN0aW9uIChFbGVtZW50RmFjdG9yeSkge1xuICAgIHZhciBGcmFnbWVudCA9ICc8PjwvPic7XG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWdOYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDI7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgY2hpbGRyZW5bX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZ05hbWUgPT09IEZyYWdtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgX2IgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTsgX2EgPCBfYi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gX2JbX2FdO1xuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAnY2xhc3NOYW1lJykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgSlN0b0NTUyhhdHRyaWJ1dGVWYWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGtleS5zdGFydHNXaXRoKCdvbicpICYmIHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoa2V5LnN1YnN0cmluZygyKS50b0xvd2VyQ2FzZSgpLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAnYm9vbGVhbicgJiYgYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgX2MgPSAwLCBjaGlsZHJlbl8xID0gY2hpbGRyZW47IF9jIDwgY2hpbGRyZW5fMS5sZW5ndGg7IF9jKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuXzFbX2NdO1xuICAgICAgICAgICAgYXBwZW5kQ2hpbGQoZWxlbWVudCwgY2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cbiAgICBFbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50ID0gY3JlYXRlRWxlbWVudDtcbiAgICBmdW5jdGlvbiBhcHBlbmRDaGlsZChwYXJlbnQsIGNoaWxkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2hpbGQgPT09ICd1bmRlZmluZWQnIHx8IGNoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGQpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGNoaWxkXzEgPSBjaGlsZDsgX2kgPCBjaGlsZF8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGNoaWxkXzFbX2ldO1xuICAgICAgICAgICAgICAgIGFwcGVuZENoaWxkKHBhcmVudCwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGlsZCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2hpbGQgPT09ICdib29sZWFuJykge1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFN0cmluZyhjaGlsZCkpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBFbGVtZW50RmFjdG9yeS5hcHBlbmRDaGlsZCA9IGFwcGVuZENoaWxkO1xuICAgIGZ1bmN0aW9uIEpTdG9DU1MoY3NzT2JqZWN0KSB7XG4gICAgICAgIHZhciBjc3NTdHJpbmcgPSBcIlwiO1xuICAgICAgICB2YXIgcnVsZTtcbiAgICAgICAgdmFyIHJ1bGVzID0gT2JqZWN0LmtleXMoY3NzT2JqZWN0KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKywgY3NzU3RyaW5nICs9ICcgJykge1xuICAgICAgICAgICAgcnVsZSA9IHJ1bGVzW2ldO1xuICAgICAgICAgICAgY3NzU3RyaW5nICs9IHJ1bGUucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAodXBwZXIpIHsgcmV0dXJuIFwiLVwiICsgdXBwZXJbMF0udG9Mb3dlckNhc2UoKTsgfSkgKyBcIjogXCIgKyBjc3NPYmplY3RbcnVsZV0gKyBcIjtcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3NzU3RyaW5nO1xuICAgIH1cbn0pKEVsZW1lbnRGYWN0b3J5ID0gZXhwb3J0cy5FbGVtZW50RmFjdG9yeSB8fCAoZXhwb3J0cy5FbGVtZW50RmFjdG9yeSA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIEFib3V0XzEgPSByZXF1aXJlKFwiLi4vRGF0YS9BYm91dFwiKTtcbnZhciBRdWFsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi9EYXRhL1F1YWxpdGllc1wiKTtcbnZhciBRdWFsaXR5XzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9RdWFsaXR5XCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgIFdlYlBhZ2VfMS5GbGF2b3JUZXh0LmlubmVyVGV4dCA9IEFib3V0XzEuQWJvdXRNZTtcbn0pO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgIHZhciBvYmplY3Q7XG4gICAgZm9yICh2YXIgX2kgPSAwLCBRdWFsaXRpZXNfMiA9IFF1YWxpdGllc18xLlF1YWxpdGllczsgX2kgPCBRdWFsaXRpZXNfMi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIHF1YWxpdHkgPSBRdWFsaXRpZXNfMltfaV07XG4gICAgICAgIG9iamVjdCA9IG5ldyBRdWFsaXR5XzEuUXVhbGl0eShxdWFsaXR5KTtcbiAgICAgICAgV2ViUGFnZV8xLlF1YWxpdGllc0NvbnRhaW5lci5hcHBlbmRDaGlsZChvYmplY3QuY3JlYXRlRWxlbWVudCgpKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG5XZWJQYWdlXzEuQm9keS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgZnVuY3Rpb24gKCkge1xufSwge1xuICAgIGNhcHR1cmU6IHRydWUsXG4gICAgcGFzc2l2ZTogdHJ1ZVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIEV4cGVyaWVuY2VfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL0V4cGVyaWVuY2VcIik7XG52YXIgRXhwZXJpZW5jZV8yID0gcmVxdWlyZShcIi4uL0RhdGEvRXhwZXJpZW5jZVwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICB2YXIgRXhwZXJpZW5jZVNlY3Rpb24gPSBXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdleHBlcmllbmNlJykuZWxlbWVudDtcbiAgICB2YXIgY2FyZDtcbiAgICBmb3IgKHZhciBfaSA9IDAsIERhdGFfMSA9IEV4cGVyaWVuY2VfMi5FeHBlcmllbmNlOyBfaSA8IERhdGFfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGRhdGEgPSBEYXRhXzFbX2ldO1xuICAgICAgICBjYXJkID0gbmV3IEV4cGVyaWVuY2VfMS5FeHBlcmllbmNlKGRhdGEpO1xuICAgICAgICBFeHBlcmllbmNlU2VjdGlvbi5hcHBlbmRDaGlsZChjYXJkLmNyZWF0ZUVsZW1lbnQoKSk7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgIGlmICghRE9NXzEuRE9NLmlzSUUoKSkge1xuICAgICAgICBXZWJQYWdlXzEuTG9nby5PdXRlci5jbGFzc0xpc3QucmVtb3ZlKCdwcmVsb2FkJyk7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgV2ViUGFnZV8xLkxvZ28uSW5uZXIuY2xhc3NMaXN0LnJlbW92ZSgncHJlbG9hZCcpO1xuICAgICAgICB9LCA0MDApO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgV2ViUGFnZV8xLkxvZ28uT3V0ZXIuY2xhc3NOYW1lID0gJ291dGVyJztcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBXZWJQYWdlXzEuTG9nby5Jbm5lci5jbGFzc05hbWUgPSAnaW5uZXInO1xuICAgICAgICB9LCA0MDApO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbldlYlBhZ2VfMS5NZW51QnV0dG9uLnN1YnNjcmliZShXZWJQYWdlXzEuTWFpbiwgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgaWYgKGV2ZW50Lm5hbWUgPT09ICd0b2dnbGUnKSB7XG4gICAgICAgIGlmIChldmVudC5kZXRhaWwub3Blbikge1xuICAgICAgICAgICAgV2ViUGFnZV8xLk1haW4uc2V0QXR0cmlidXRlKCdzaGlmdGVkJywgJycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgV2ViUGFnZV8xLk1haW4ucmVtb3ZlQXR0cmlidXRlKCdzaGlmdGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG59KTtcbldlYlBhZ2VfMS5TY3JvbGxIb29rLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIHZhciBfYTtcbiAgICB2YXIgc2VjdGlvbjtcbiAgICB2YXIgYW5jaG9yO1xuICAgIHZhciBpdGVyID0gV2ViUGFnZV8xLlNlY3Rpb25Ub01lbnUudmFsdWVzKCk7XG4gICAgdmFyIGN1cnJlbnQgPSBpdGVyLm5leHQoKTtcbiAgICBmb3IgKHZhciBkb25lID0gZmFsc2U7ICFkb25lOyBjdXJyZW50ID0gaXRlci5uZXh0KCksIGRvbmUgPSBjdXJyZW50LmRvbmUpIHtcbiAgICAgICAgX2EgPSBjdXJyZW50LnZhbHVlLCBzZWN0aW9uID0gX2FbMF0sIGFuY2hvciA9IF9hWzFdO1xuICAgICAgICBpZiAoc2VjdGlvbi5pblZpZXcoKSkge1xuICAgICAgICAgICAgYW5jaG9yLnNldEF0dHJpYnV0ZSgnc2VsZWN0ZWQnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhbmNob3IucmVtb3ZlQXR0cmlidXRlKCdzZWxlY3RlZCcpO1xuICAgICAgICB9XG4gICAgfVxufSwge1xuICAgIGNhcHR1cmU6IHRydWUsXG4gICAgcGFzc2l2ZTogdHJ1ZVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xuV2ViUGFnZV8xLk1lbnVCdXR0b24uSGFtYnVyZ2VyLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIFdlYlBhZ2VfMS5NZW51QnV0dG9uLnRvZ2dsZSgpO1xufSk7XG52YXIgaXRlciA9IFdlYlBhZ2VfMS5TZWN0aW9uVG9NZW51LnZhbHVlcygpO1xudmFyIGN1cnJlbnQgPSBpdGVyLm5leHQoKTtcbnZhciBfbG9vcF8xID0gZnVuY3Rpb24gKGRvbmUpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIHNlY3Rpb247XG4gICAgdmFyIGFuY2hvciA9IHZvaWQgMDtcbiAgICBfYSA9IGN1cnJlbnQudmFsdWUsIHNlY3Rpb24gPSBfYVswXSwgYW5jaG9yID0gX2FbMV07XG4gICAgYW5jaG9yLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHNlY3Rpb24uZWxlbWVudC5zY3JvbGxJbnRvVmlldyh7XG4gICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgICAgfSk7XG4gICAgfSk7XG59O1xuZm9yICh2YXIgZG9uZSA9IGZhbHNlOyAhZG9uZTsgY3VycmVudCA9IGl0ZXIubmV4dCgpLCBkb25lID0gY3VycmVudC5kb25lKSB7XG4gICAgX2xvb3BfMShkb25lKTtcbn1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgUHJvamVjdF8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvUHJvamVjdFwiKTtcbnZhciBQcm9qZWN0c18xID0gcmVxdWlyZShcIi4uL0RhdGEvUHJvamVjdHNcIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgdmFyIFByb2plY3RzQ29udGFpbmVyID0gV2ViUGFnZV8xLlNlY3Rpb25zLmdldCgncHJvamVjdHMnKS5lbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJy5wcm9qZWN0cy1jb250YWluZXInKTtcbiAgICB2YXIgY2FyZDtcbiAgICBmb3IgKHZhciBfaSA9IDAsIERhdGFfMSA9IFByb2plY3RzXzEuUHJvamVjdHM7IF9pIDwgRGF0YV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgZGF0YSA9IERhdGFfMVtfaV07XG4gICAgICAgIGNhcmQgPSBuZXcgUHJvamVjdF8xLlByb2plY3QoZGF0YSk7XG4gICAgICAgIFByb2plY3RzQ29udGFpbmVyLmFwcGVuZENoaWxkKGNhcmQuY3JlYXRlRWxlbWVudCgpKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG52YXIgX19nZW5lcmF0b3IgPSAodGhpcyAmJiB0aGlzLl9fZ2VuZXJhdG9yKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgYm9keSkge1xuICAgIHZhciBfID0geyBsYWJlbDogMCwgc2VudDogZnVuY3Rpb24oKSB7IGlmICh0WzBdICYgMSkgdGhyb3cgdFsxXTsgcmV0dXJuIHRbMV07IH0sIHRyeXM6IFtdLCBvcHM6IFtdIH0sIGYsIHksIHQsIGc7XG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XG4gICAgZnVuY3Rpb24gdmVyYihuKSB7IHJldHVybiBmdW5jdGlvbiAodikgeyByZXR1cm4gc3RlcChbbiwgdl0pOyB9OyB9XG4gICAgZnVuY3Rpb24gc3RlcChvcCkge1xuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XG4gICAgICAgIHdoaWxlIChfKSB0cnkge1xuICAgICAgICAgICAgaWYgKGYgPSAxLCB5ICYmICh0ID0gb3BbMF0gJiAyID8geVtcInJldHVyblwiXSA6IG9wWzBdID8geVtcInRocm93XCJdIHx8ICgodCA9IHlbXCJyZXR1cm5cIl0pICYmIHQuY2FsbCh5KSwgMCkgOiB5Lm5leHQpICYmICEodCA9IHQuY2FsbCh5LCBvcFsxXSkpLmRvbmUpIHJldHVybiB0O1xuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xuICAgICAgICAgICAgc3dpdGNoIChvcFswXSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiB0ID0gb3A7IGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XG4gICAgICAgICAgICAgICAgY2FzZSA1OiBfLmxhYmVsKys7IHkgPSBvcFsxXTsgb3AgPSBbMF07IGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGNhc2UgNzogb3AgPSBfLm9wcy5wb3AoKTsgXy50cnlzLnBvcCgpOyBjb250aW51ZTtcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICBpZiAoISh0ID0gXy50cnlzLCB0ID0gdC5sZW5ndGggPiAwICYmIHRbdC5sZW5ndGggLSAxXSkgJiYgKG9wWzBdID09PSA2IHx8IG9wWzBdID09PSAyKSkgeyBfID0gMDsgY29udGludWU7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSAzICYmICghdCB8fCAob3BbMV0gPiB0WzBdICYmIG9wWzFdIDwgdFszXSkpKSB7IF8ubGFiZWwgPSBvcFsxXTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XG4gICAgICAgICAgICAgICAgICAgIGlmICh0ICYmIF8ubGFiZWwgPCB0WzJdKSB7IF8ubGFiZWwgPSB0WzJdOyBfLm9wcy5wdXNoKG9wKTsgYnJlYWs7IH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRbMl0pIF8ub3BzLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3AgPSBib2R5LmNhbGwodGhpc0FyZywgXyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cbiAgICAgICAgaWYgKG9wWzBdICYgNSkgdGhyb3cgb3BbMV07IHJldHVybiB7IHZhbHVlOiBvcFswXSA/IG9wWzFdIDogdm9pZCAwLCBkb25lOiB0cnVlIH07XG4gICAgfVxufTtcbnZhciBfdGhpcyA9IHRoaXM7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBTa2lsbF8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvU2tpbGxcIik7XG52YXIgU2tpbGxzXzEgPSByZXF1aXJlKFwiLi4vRGF0YS9Ta2lsbHNcIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgY3JlYXRlU2tpbGxzKFNraWxsc18xLlNraWxscyk7XG59KTtcbnZhciBjcmVhdGVTa2lsbHMgPSBmdW5jdGlvbiAoc2tpbGxzRGF0YSkge1xuICAgIFNraWxsXzEuU2tpbGwuaW5pdGlhbGl6ZSgpLnRoZW4oZnVuY3Rpb24gKGRvbmUpIHsgcmV0dXJuIF9fYXdhaXRlcihfdGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHNraWxsLCBlbGVtZW50LCBfaSwgc2tpbGxzRGF0YV8xLCBkYXRhO1xuICAgICAgICByZXR1cm4gX19nZW5lcmF0b3IodGhpcywgZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICBzd2l0Y2ggKF9hLmxhYmVsKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICBpZiAoIWRvbmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGluaXRpYWxpemUgU2tpbGxzIG9iamVjdC5cIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBfaSA9IDAsIHNraWxsc0RhdGFfMSA9IHNraWxsc0RhdGE7XG4gICAgICAgICAgICAgICAgICAgIF9hLmxhYmVsID0gMTtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIGlmICghKF9pIDwgc2tpbGxzRGF0YV8xLmxlbmd0aCkpIHJldHVybiBbMywgNF07XG4gICAgICAgICAgICAgICAgICAgIGRhdGEgPSBza2lsbHNEYXRhXzFbX2ldO1xuICAgICAgICAgICAgICAgICAgICBza2lsbCA9IG5ldyBTa2lsbF8xLlNraWxsKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gWzQsIHNraWxsLmNyZWF0ZUVsZW1lbnQoKV07XG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gX2Euc2VudCgpO1xuICAgICAgICAgICAgICAgICAgICBXZWJQYWdlXzEuU2tpbGxzR3JpZC5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgX2EubGFiZWwgPSAzO1xuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgX2krKztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFszLCAxXTtcbiAgICAgICAgICAgICAgICBjYXNlIDQ6IHJldHVybiBbMl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pOyB9KTtcbn07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET007XG4oZnVuY3Rpb24gKERPTSkge1xuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnRzKHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKHF1ZXJ5KTtcbiAgICB9XG4gICAgRE9NLmdldEVsZW1lbnRzID0gZ2V0RWxlbWVudHM7XG4gICAgZnVuY3Rpb24gZ2V0Rmlyc3RFbGVtZW50KHF1ZXJ5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldEVsZW1lbnRzKHF1ZXJ5KVswXTtcbiAgICB9XG4gICAgRE9NLmdldEZpcnN0RWxlbWVudCA9IGdldEZpcnN0RWxlbWVudDtcbiAgICBmdW5jdGlvbiBnZXRWaWV3cG9ydCgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDogd2luZG93LmlubmVyV2lkdGggfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoXG4gICAgICAgIH07XG4gICAgfVxuICAgIERPTS5nZXRWaWV3cG9ydCA9IGdldFZpZXdwb3J0O1xuICAgIGZ1bmN0aW9uIHNjcm9sbFRvKHgsIHkpIHtcbiAgICAgICAgd2luZG93LnNjcm9sbFRvKHtcbiAgICAgICAgICAgIHRvcDogeSxcbiAgICAgICAgICAgIGxlZnQ6IHgsXG4gICAgICAgICAgICBiZWhhdmlvcjogJ3Ntb290aCdcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIERPTS5zY3JvbGxUbyA9IHNjcm9sbFRvO1xuICAgIGZ1bmN0aW9uIGlzSUUoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKE1TSUV8VHJpZGVudCkvKSAhPT0gbnVsbDtcbiAgICB9XG4gICAgRE9NLmlzSUUgPSBpc0lFO1xuICAgIGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrXzEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFja18xKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2N1bWVudCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2FsbGJhY2tfMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBET00ubG9hZCA9IGxvYWQ7XG59KShET00gPSBleHBvcnRzLkRPTSB8fCAoZXhwb3J0cy5ET00gPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRXZlbnRzO1xuKGZ1bmN0aW9uIChFdmVudHMpIHtcbiAgICB2YXIgTmV3RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBOZXdFdmVudChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5kZXRhaWwgPSBkZXRhaWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE5ld0V2ZW50O1xuICAgIH0oKSk7XG4gICAgRXZlbnRzLk5ld0V2ZW50ID0gTmV3RXZlbnQ7XG4gICAgdmFyIEV2ZW50RGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5hZGQobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kZWxldGUobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uIChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuZXZlbnRzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBldmVudCA9IG5ldyBOZXdFdmVudChuYW1lLCBkZXRhaWwpO1xuICAgICAgICAgICAgdmFyIGl0ID0gdGhpcy5saXN0ZW5lcnMudmFsdWVzKCk7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICAgICAgICB3aGlsZSAoY2FsbGJhY2sgPSBpdC5uZXh0KCkudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RGlzcGF0Y2hlcjtcbiAgICB9KCkpO1xuICAgIEV2ZW50cy5FdmVudERpc3BhdGNoZXIgPSBFdmVudERpc3BhdGNoZXI7XG59KShFdmVudHMgPSBleHBvcnRzLkV2ZW50cyB8fCAoZXhwb3J0cy5FdmVudHMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU1ZHO1xuKGZ1bmN0aW9uIChTVkcpIHtcbiAgICBTVkcuc3ZnbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuICAgIFNWRy54bGlua25zID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xuICAgIFNWRy5sb2FkU1ZHID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsICsgXCIuc3ZnXCIsIHRydWUpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VkRG9jdW1lbnQgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlcXVlc3QucmVzcG9uc2VUZXh0LCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUocGFyc2VkRG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJykpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoXCJGYWlsZWQgdG8gcmVhZCBTVkcuXCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xufSkoU1ZHID0gZXhwb3J0cy5TVkcgfHwgKGV4cG9ydHMuU1ZHID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4vRE9NXCIpO1xudmFyIFNlY3Rpb25fMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1NlY3Rpb25cIik7XG52YXIgTWVudV8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvTWVudVwiKTtcbmV4cG9ydHMuQm9keSA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2JvZHknKTtcbmV4cG9ydHMuTWFpbiA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ21haW4nKTtcbmV4cG9ydHMuTWFpblNjcm9sbCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ21haW4gLnNjcm9sbCcpO1xuZXhwb3J0cy5TY3JvbGxIb29rID0gRE9NXzEuRE9NLmlzSUUoKSA/IHdpbmRvdyA6IGV4cG9ydHMuTWFpblNjcm9sbDtcbmV4cG9ydHMuTG9nbyA9IHtcbiAgICBPdXRlcjogRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnaGVhZGVyLmxvZ28gLmltYWdlIGltZy5vdXRlcicpLFxuICAgIElubmVyOiBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdoZWFkZXIubG9nbyAuaW1hZ2UgaW1nLmlubmVyJylcbn07XG5leHBvcnRzLk1lbnVCdXR0b24gPSBuZXcgTWVudV8xLk1lbnUoKTtcbmV4cG9ydHMuU2VjdGlvbnMgPSBuZXcgTWFwKCk7XG5mb3IgKHZhciBfaSA9IDAsIF9hID0gQXJyYXkuZnJvbShET01fMS5ET00uZ2V0RWxlbWVudHMoJ3NlY3Rpb24nKSk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBfYVtfaV07XG4gICAgZXhwb3J0cy5TZWN0aW9ucy5zZXQoZWxlbWVudC5pZCwgbmV3IFNlY3Rpb25fMS5kZWZhdWx0KGVsZW1lbnQpKTtcbn1cbmV4cG9ydHMuU2VjdGlvblRvTWVudSA9IG5ldyBNYXAoKTtcbmZvciAodmFyIF9iID0gMCwgX2MgPSBBcnJheS5mcm9tKERPTV8xLkRPTS5nZXRFbGVtZW50cygnaGVhZGVyLm5hdmlnYXRpb24gLnNlY3Rpb25zIGEnKSk7IF9iIDwgX2MubGVuZ3RoOyBfYisrKSB7XG4gICAgdmFyIGFuY2hvciA9IF9jW19iXTtcbiAgICB2YXIgaWQgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpO1xuICAgIGlmIChleHBvcnRzLlNlY3Rpb25zLmdldChpZCkgJiYgZXhwb3J0cy5TZWN0aW9ucy5nZXQoaWQpLmluTWVudSgpKSB7XG4gICAgICAgIGV4cG9ydHMuU2VjdGlvblRvTWVudS5zZXQoaWQsIFtleHBvcnRzLlNlY3Rpb25zLmdldChpZCksIGFuY2hvcl0pO1xuICAgIH1cbn1cbmV4cG9ydHMuRmxhdm9yVGV4dCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ3NlY3Rpb24jYWJvdXQgLmZsYXZvcicpO1xuZXhwb3J0cy5RdWFsaXRpZXNDb250YWluZXIgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI2Fib3V0IC5xdWFsaXRpZXMnKTtcbmV4cG9ydHMuU2tpbGxzR3JpZCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ3NlY3Rpb24jc2tpbGxzIC5oZXgtZ3JpZCcpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQW5pbWF0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBBbmltYXRpb24oc3BlZWQsIG1heCwgbWluLCBpbmNyZWFzaW5nKSB7XG4gICAgICAgIGlmIChpbmNyZWFzaW5nID09PSB2b2lkIDApIHsgaW5jcmVhc2luZyA9IGZhbHNlOyB9XG4gICAgICAgIHRoaXMuc3BlZWQgPSBzcGVlZDtcbiAgICAgICAgdGhpcy5tYXggPSBtYXg7XG4gICAgICAgIHRoaXMubWluID0gbWluO1xuICAgICAgICB0aGlzLmluY3JlYXNpbmcgPSBpbmNyZWFzaW5nO1xuICAgIH1cbiAgICByZXR1cm4gQW5pbWF0aW9uO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IEFuaW1hdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zO1xuKGZ1bmN0aW9uIChBbmltYXRpb25GcmFtZUZ1bmN0aW9ucykge1xuICAgIGZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICAgICAgICAgIH07XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICBmdW5jdGlvbiBjYW5jZWxBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQ7XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG59KShBbmltYXRpb25GcmFtZUZ1bmN0aW9ucyA9IGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgfHwgKGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbG9yKHIsIGcsIGIpIHtcbiAgICAgICAgdGhpcy5yID0gcjtcbiAgICAgICAgdGhpcy5nID0gZztcbiAgICAgICAgdGhpcy5iID0gYjtcbiAgICB9XG4gICAgQ29sb3IuZnJvbVJHQiA9IGZ1bmN0aW9uIChyLCBnLCBiKSB7XG4gICAgICAgIGlmIChyID49IDAgJiYgciA8IDI1NiAmJiBnID49IDAgJiYgZyA8IDI1NiAmJiBiID49IDAgJiYgYiA8IDI1Nikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb2xvci5mcm9tT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gQ29sb3IuZnJvbVJHQihvYmouciwgb2JqLmcsIG9iai5iKTtcbiAgICB9O1xuICAgIENvbG9yLmZyb21IZXggPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHJldHVybiBDb2xvci5mcm9tT2JqZWN0KENvbG9yLmhleFRvUkdCKGhleCkpO1xuICAgIH07XG4gICAgQ29sb3IuaGV4VG9SR0IgPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHZhciByZXN1bHQgPSAvXiMoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICAgICAgICByZXR1cm4gcmVzdWx0ID8ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gICAgICAgIH0gOiBudWxsO1xuICAgIH07XG4gICAgQ29sb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKG9wYWNpdHkgPT09IHZvaWQgMCkgeyBvcGFjaXR5ID0gMTsgfVxuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgdGhpcy5yICsgXCIsXCIgKyB0aGlzLmcgKyBcIixcIiArIHRoaXMuYiArIFwiLFwiICsgb3BhY2l0eSArIFwiKVwiO1xuICAgIH07XG4gICAgcmV0dXJuIENvbG9yO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29vcmRpbmF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29vcmRpbmF0ZSh4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIENvb3JkaW5hdGUucHJvdG90eXBlLmRpc3RhbmNlID0gZnVuY3Rpb24gKGNvb3JkKSB7XG4gICAgICAgIHZhciBkeCA9IGNvb3JkLnggLSB0aGlzLng7XG4gICAgICAgIHZhciBkeSA9IGNvb3JkLnkgLSB0aGlzLnk7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIH07XG4gICAgQ29vcmRpbmF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKyBcInhcIiArIHRoaXMueTtcbiAgICB9O1xuICAgIHJldHVybiBDb29yZGluYXRlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvb3JkaW5hdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbl8xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uXCIpO1xudmFyIENvbG9yXzEgPSByZXF1aXJlKFwiLi9Db2xvclwiKTtcbnZhciBDb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9Db29yZGluYXRlXCIpO1xudmFyIFN0cm9rZV8xID0gcmVxdWlyZShcIi4vU3Ryb2tlXCIpO1xudmFyIFZlY3Rvcl8xID0gcmVxdWlyZShcIi4vVmVjdG9yXCIpO1xudmFyIFBhcnRpY2xlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZShzZXR0aW5ncykge1xuICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmNyZWF0ZUNvbG9yKHNldHRpbmdzLmNvbG9yKTtcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gdGhpcy5jcmVhdGVPcGFjaXR5KHNldHRpbmdzLm9wYWNpdHkpO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdGhpcy5jcmVhdGVWZWxvY2l0eShzZXR0aW5ncy5tb3ZlKTtcbiAgICAgICAgdGhpcy5zaGFwZSA9IHRoaXMuY3JlYXRlU2hhcGUoc2V0dGluZ3Muc2hhcGUpO1xuICAgICAgICB0aGlzLnN0cm9rZSA9IHRoaXMuY3JlYXRlU3Ryb2tlKHNldHRpbmdzLnN0cm9rZSk7XG4gICAgICAgIHRoaXMucmFkaXVzID0gdGhpcy5jcmVhdGVSYWRpdXMoc2V0dGluZ3MucmFkaXVzKTtcbiAgICAgICAgaWYgKHNldHRpbmdzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSB0aGlzLmFuaW1hdGVPcGFjaXR5KHNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZVJhZGl1cyhzZXR0aW5ncy5hbmltYXRlLnJhZGl1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idWJibGVkID0ge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIHJhZGl1czogMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlQ29sb3IgPSBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21SR0IoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21IZXgoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yXzEuZGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbG9yIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVDb2xvcihjb2xvcltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvci5sZW5ndGgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21PYmplY3QoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDb2xvcl8xLmRlZmF1bHQuZnJvbVJHQigwLCAwLCAwKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVPcGFjaXR5ID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9wYWNpdHkob3BhY2l0eVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvcGFjaXR5Lmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChvcGFjaXR5ID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZVZlbG9jaXR5ID0gZnVuY3Rpb24gKG1vdmUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtb3ZlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgbW92ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB2ZWxvY2l0eSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHN3aXRjaCAobW92ZS5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wLXJpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLjcsIC0wLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbS1yaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMC43LCAwLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20tbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTEsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AtbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgLTAuNyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdmUuc3RyYWlnaHQpIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5yYW5kb20pIHtcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkueCAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eS55ICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmVsb2NpdHkueCArPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICAgICAgICAgIHZlbG9jaXR5LnkgKz0gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2ZWxvY2l0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlU2hhcGUgPSBmdW5jdGlvbiAoc2hhcGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2hhcGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2hhcGUubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBzaWRlcyA9IHBhcnNlSW50KHNoYXBlLnN1YnN0cmluZygwLCBzaGFwZS5pbmRleE9mKCctJykpKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4oc2lkZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2lkZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSA+PSAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnY2lyY2xlJztcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVTdHJva2UgPSBmdW5jdGlvbiAoc3Ryb2tlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3Ryb2tlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHJva2Uud2lkdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cm9rZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KHN0cm9rZS53aWR0aCwgdGhpcy5jcmVhdGVDb2xvcihzdHJva2UuY29sb3IpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KDAsIENvbG9yXzEuZGVmYXVsdC5mcm9tUkdCKDAsIDAsIDApKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVSYWRpdXMgPSBmdW5jdGlvbiAocmFkaXVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmFkaXVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHJhZGl1cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUmFkaXVzKHJhZGl1c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYWRpdXMubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFkaXVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiA1O1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLnBhcnNlU3BlZWQgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNwZWVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwLjU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZU9wYWNpdHkgPSBmdW5jdGlvbiAoYW5pbWF0aW9uKSB7XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICAgIHZhciBtYXggPSB0aGlzLm9wYWNpdHk7XG4gICAgICAgICAgICB2YXIgbWluID0gdGhpcy5jcmVhdGVPcGFjaXR5KGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZVJhZGl1cyA9IGZ1bmN0aW9uIChhbmltYXRpb24pIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgICAgdmFyIG1heCA9IHRoaXMucmFkaXVzO1xuICAgICAgICAgICAgdmFyIG1pbiA9IHRoaXMuY3JlYXRlUmFkaXVzKGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIHNwZWVkO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogc3BlZWQ7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZ2V0UmFkaXVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYWRpdXMgKyB0aGlzLmJ1YmJsZWQucmFkaXVzO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmdldE9wYWNpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHkgKyB0aGlzLmJ1YmJsZWQub3BhY2l0eTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5lZGdlID0gZnVuY3Rpb24gKGRpcikge1xuICAgICAgICBzd2l0Y2ggKGRpcikge1xuICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55IC0gdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLmdldFJhZGl1cygpLCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCAtIHRoaXMuZ2V0UmFkaXVzKCksIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuaW50ZXJzZWN0aW5nID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmRpc3RhbmNlKHBhcnRpY2xlLnBvc2l0aW9uKSA8IHRoaXMuZ2V0UmFkaXVzKCkgKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5idWJibGUgPSBmdW5jdGlvbiAobW91c2UsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMucG9zaXRpb24uZGlzdGFuY2UobW91c2UucG9zaXRpb24pO1xuICAgICAgICB2YXIgcmF0aW8gPSAxIC0gZGlzdGFuY2UgLyBzZXR0aW5ncy5kaXN0YW5jZTtcbiAgICAgICAgaWYgKHJhdGlvID49IDAgJiYgbW91c2Uub3Zlcikge1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLm9wYWNpdHkgPSByYXRpbyAqIChzZXR0aW5ncy5vcGFjaXR5IC0gdGhpcy5vcGFjaXR5KTtcbiAgICAgICAgICAgIHRoaXMuYnViYmxlZC5yYWRpdXMgPSByYXRpbyAqIChzZXR0aW5ncy5yYWRpdXMgLSB0aGlzLnJhZGl1cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQucmFkaXVzID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFBhcnRpY2xlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBhcnRpY2xlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb25GcmFtZUZ1bmN0aW9uc18xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNcIik7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgQ29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vQ29vcmRpbmF0ZVwiKTtcbnZhciBQYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vUGFydGljbGVcIik7XG52YXIgUGFydGljbGVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZXMoY3NzUXVlcnksIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdzdG9wcGVkJztcbiAgICAgICAgdGhpcy5waXhlbFJhdGlvTGltaXQgPSA4O1xuICAgICAgICB0aGlzLnBpeGVsUmF0aW8gPSAxO1xuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB0aGlzLm1vdXNlID0ge1xuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCgwLCAwKSxcbiAgICAgICAgICAgIG92ZXI6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoY3NzUXVlcnkpO1xuICAgICAgICBpZiAodGhpcy5jYW52YXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2FudmFzIElEIFwiICsgY3NzUXVlcnkgKyBcIiBub3QgZm91bmQuXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KGNvbnRleHQpO1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMS5BbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMS5BbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5jYW5jZWxBbmltYXRpb25GcmFtZSgpO1xuICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBudW1iZXI6IDM1MCxcbiAgICAgICAgICAgIGRlbnNpdHk6IDEwMDAsXG4gICAgICAgICAgICBjb2xvcjogJyNGRkZGRkYnLFxuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIHJhZGl1czogNSxcbiAgICAgICAgICAgIHNoYXBlOiAnY2lyY2xlJyxcbiAgICAgICAgICAgIHN0cm9rZToge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtb3ZlOiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuNCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICdib3R0b20nLFxuICAgICAgICAgICAgICAgIHN0cmFpZ2h0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJhbmRvbTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlZGdlQm91bmNlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdHRyYWN0OiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgIHJlc2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBob3ZlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgY2xpY2s6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0ZToge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJhZGl1czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzID0ge1xuICAgICAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgICAgICBidWJibGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IDc1LFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDcsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlcHVsc2U6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IDEwMCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xpY2s6IHtcbiAgICAgICAgICAgICAgICBhZGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiA0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW1vdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiAyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudHJhY2tNb3VzZSgpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID49IHRoaXMucGl4ZWxSYXRpb0xpbWl0ID8gdGhpcy5waXhlbFJhdGlvTGltaXQgLSAyIDogd2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgICB0aGlzLnNldENhbnZhc1NpemUoKTtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLnJlbW92ZVBhcnRpY2xlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZVBhcnRpY2xlcygpO1xuICAgICAgICB0aGlzLmRpc3RyaWJ1dGVQYXJ0aWNsZXMoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUudHJhY2tNb3VzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5ob3Zlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi54ID0gZXZlbnQub2Zmc2V0WCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnkgPSBldmVudC5vZmZzZXRZICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2Uub3ZlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2UucG9zaXRpb24ueCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnkgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5vdmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5jbGljaykge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCA9IHRydWU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmluaXRpYWxpemVQaXhlbFJhdGlvID0gZnVuY3Rpb24gKG5ld1JhdGlvKSB7XG4gICAgICAgIGlmIChuZXdSYXRpbyA9PT0gdm9pZCAwKSB7IG5ld1JhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87IH1cbiAgICAgICAgdmFyIG11bHRpcGxpZXIgPSBuZXdSYXRpbyAvIHRoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoICogbXVsdGlwbGllcjtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQgKiBtdWx0aXBsaWVyO1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzID0gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cy5tYXAoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIHIgKiBtdWx0aXBsaWVyOyB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5zcGVlZCAqPSBtdWx0aXBsaWVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZSAmJiB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLnJhZGl1cy5zcGVlZCAqPSBtdWx0aXBsaWVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZS5yYWRpdXMgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlLmRpc3RhbmNlICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLnJlcHVsc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIucmVwdWxzZS5kaXN0YW5jZSAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGl4ZWxSYXRpbyA9IG5ld1JhdGlvO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jaGVja1pvb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyAhPT0gdGhpcy5waXhlbFJhdGlvICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIDwgdGhpcy5waXhlbFJhdGlvTGltaXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcERyYXdpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0Q2FudmFzU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMgJiYgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5yZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNoZWNrWm9vbSgpO1xuICAgICAgICAgICAgICAgIF90aGlzLndpZHRoID0gX3RoaXMuY2FudmFzLm9mZnNldFdpZHRoICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfdGhpcy5oZWlnaHQgPSBfdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0ICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfdGhpcy5jYW52YXMud2lkdGggPSBfdGhpcy53aWR0aDtcbiAgICAgICAgICAgICAgICBfdGhpcy5jYW52YXMuaGVpZ2h0ID0gX3RoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmICghX3RoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlbW92ZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jcmVhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZHJhd1BhcnRpY2xlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy5kaXN0cmlidXRlUGFydGljbGVzKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5nZXRGaWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHguZmlsbFN0eWxlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRTdHJva2UgPSBmdW5jdGlvbiAoc3Ryb2tlKSB7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlLmNvbG9yLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHN0cm9rZS53aWR0aDtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kcmF3UGFydGljbGVzKCk7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSlcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc3RvcERyYXdpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhd1BvbHlnb24gPSBmdW5jdGlvbiAoY2VudGVyLCByYWRpdXMsIHNpZGVzKSB7XG4gICAgICAgIHZhciBkaWFnb25hbEFuZ2xlID0gMzYwIC8gc2lkZXM7XG4gICAgICAgIGRpYWdvbmFsQW5nbGUgKj0gTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKGNlbnRlci54LCBjZW50ZXIueSk7XG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZShkaWFnb25hbEFuZ2xlIC8gKHNpZGVzICUgMiA/IDQgOiAyKSk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhyYWRpdXMsIDApO1xuICAgICAgICB2YXIgYW5nbGU7XG4gICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgc2lkZXM7IHMrKykge1xuICAgICAgICAgICAgYW5nbGUgPSBzICogZGlhZ29uYWxBbmdsZTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSksIHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQYXJ0aWNsZSA9IGZ1bmN0aW9uIChwYXJ0aWNsZSkge1xuICAgICAgICB2YXIgb3BhY2l0eSA9IHBhcnRpY2xlLmdldE9wYWNpdHkoKTtcbiAgICAgICAgdmFyIHJhZGl1cyA9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICB0aGlzLnNldEZpbGwocGFydGljbGUuY29sb3IudG9TdHJpbmcob3BhY2l0eSkpO1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgaWYgKHR5cGVvZiAocGFydGljbGUuc2hhcGUpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdGhpcy5kcmF3UG9seWdvbihwYXJ0aWNsZS5wb3NpdGlvbiwgcmFkaXVzLCBwYXJ0aWNsZS5zaGFwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHBhcnRpY2xlLnNoYXBlKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjYXNlICdjaXJjbGUnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN0eC5hcmMocGFydGljbGUucG9zaXRpb24ueCwgcGFydGljbGUucG9zaXRpb24ueSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgaWYgKHBhcnRpY2xlLnN0cm9rZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3Ryb2tlKHBhcnRpY2xlLnN0cm9rZSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmdldE5ld1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy53aWR0aCwgTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNoZWNrUG9zaXRpb24gPSBmdW5jdGlvbiAocGFydGljbGUpIHtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdsZWZ0JykueCA8IDApXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggKz0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgncmlnaHQnKS54ID4gdGhpcy53aWR0aClcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCAtPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgndG9wJykueSA8IDApXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgKz0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgnYm90dG9tJykueSA+IHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55IC09IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kaXN0cmlidXRlUGFydGljbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHkgJiYgdHlwZW9mICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZGVuc2l0eSkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgYXJlYSA9IHRoaXMuY2FudmFzLndpZHRoICogdGhpcy5jYW52YXMuaGVpZ2h0IC8gMTAwMDtcbiAgICAgICAgICAgIGFyZWEgLz0gdGhpcy5waXhlbFJhdGlvICogMjtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZXNQZXJBcmVhID0gYXJlYSAqIHRoaXMucGFydGljbGVTZXR0aW5ncy5udW1iZXIgLyB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZGVuc2l0eTtcbiAgICAgICAgICAgIHZhciBtaXNzaW5nID0gcGFydGljbGVzUGVyQXJlYSAtIHRoaXMucGFydGljbGVzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChtaXNzaW5nID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUGFydGljbGVzKG1pc3NpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQYXJ0aWNsZXMoTWF0aC5hYnMobWlzc2luZykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNyZWF0ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uIChudW1iZXIsIHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChudW1iZXIgPT09IHZvaWQgMCkgeyBudW1iZXIgPSB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubnVtYmVyOyB9XG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdm9pZCAwKSB7IHBvc2l0aW9uID0gbnVsbDsgfVxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTZXR0aW5ncylcbiAgICAgICAgICAgIHRocm93ICdQYXJ0aWNsZSBzZXR0aW5ncyBtdXN0IGJlIGluaXRhbGl6ZWQgYmVmb3JlIGEgcGFydGljbGUgaXMgY3JlYXRlZC4nO1xuICAgICAgICB2YXIgcGFydGljbGU7XG4gICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgbnVtYmVyOyBwKyspIHtcbiAgICAgICAgICAgIHBhcnRpY2xlID0gbmV3IFBhcnRpY2xlXzEuZGVmYXVsdCh0aGlzLnBhcnRpY2xlU2V0dGluZ3MpO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1Bvc2l0aW9uKCkpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKCF0aGlzLmNoZWNrUG9zaXRpb24ocGFydGljbGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnJlbW92ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA9PT0gdm9pZCAwKSB7IG51bWJlciA9IG51bGw7IH1cbiAgICAgICAgaWYgKCFudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5zcGxpY2UoMCwgbnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS51cGRhdGVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnBhcnRpY2xlczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZSA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLm1vdmUodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuc3BlZWQpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgncmlnaHQnKS54IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMud2lkdGggKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKSwgTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPiB0aGlzLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoLTEgKiBwYXJ0aWNsZS5nZXRSYWRpdXMoKSwgTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0ICsgcGFydGljbGUuZ2V0UmFkaXVzKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5lZGdlKCd0b3AnKS55ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdChNYXRoLnJhbmRvbSgpICogdGhpcy53aWR0aCwgLTEgKiBwYXJ0aWNsZS5nZXRSYWRpdXMoKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5lZGdlQm91bmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdsZWZ0JykueCA8IDAgfHwgcGFydGljbGUuZWRnZSgncmlnaHQnKS54ID4gdGhpcy53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHkuZmxpcCh0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3RvcCcpLnkgPCAwIHx8IHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHkuZmxpcChmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUub3BhY2l0eSA+PSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUub3BhY2l0eSA8PSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5vcGFjaXR5ICs9IHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uc3BlZWQgKiAocGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID8gMSA6IC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUucmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5yYWRpdXMgPj0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5yYWRpdXMgPD0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1cyArPSBwYXJ0aWNsZS5yYWRpdXNBbmltYXRpb24uc3BlZWQgKiAocGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPyAxIDogLTEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUucmFkaXVzIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuaG92ZXIgPT09ICdidWJibGUnICYmIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3ZlciAmJiB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLmJ1YmJsZSh0aGlzLm1vdXNlLCB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhd1BhcnRpY2xlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhcnRpY2xlcygpO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5wYXJ0aWNsZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFydGljbGUgPSBfYVtfaV07XG4gICAgICAgICAgICB0aGlzLmRyYXdQYXJ0aWNsZShwYXJ0aWNsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0UGFydGljbGVTZXR0aW5ncyA9IGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNoYW5nZSBzZXR0aW5ncyB3aGlsZSBDYW52YXMgaXMgcnVubmluZy4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0SW50ZXJhY3RpdmVTZXR0aW5ncyA9IGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNoYW5nZSBzZXR0aW5ncyB3aGlsZSBDYW52YXMgaXMgcnVubmluZy4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyAnUGFydGljbGUgc2V0dGluZ3MgbXVzdCBiZSBpbml0YWxpemVkIGJlZm9yZSBDYW52YXMgY2FuIHN0YXJ0Lic7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSAnc3RvcHBlZCcpXG4gICAgICAgICAgICB0aHJvdyAnQ2FudmFzIGlzIGFscmVhZHkgcnVubmluZy4nO1xuICAgICAgICB0aGlzLnN0YXRlID0gJ3J1bm5pbmcnO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnTm8gUGFydGljbGVzIHRvIHBhdXNlLic7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdwYXVzZWQnO1xuICAgICAgICB0aGlzLm1vdmVTZXR0aW5ncyA9IHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlO1xuICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSA9IGZhbHNlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSAnc3RvcHBlZCcpIHtcbiAgICAgICAgICAgIHRocm93ICdObyBQYXJ0aWNsZXMgdG8gcmVzdW1lLic7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdydW5uaW5nJztcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUgPSB0aGlzLm1vdmVTZXR0aW5ncztcbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAnc3RvcHBlZCc7XG4gICAgICAgIHRoaXMuc3RvcERyYXdpbmcoKTtcbiAgICB9O1xuICAgIHJldHVybiBQYXJ0aWNsZXM7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gUGFydGljbGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU3Ryb2tlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdHJva2Uod2lkdGgsIGNvbG9yKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cbiAgICByZXR1cm4gU3Ryb2tlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFN0cm9rZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFZlY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmVjdG9yKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgVmVjdG9yLnByb3RvdHlwZS5mbGlwID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPT09IHZvaWQgMCkgeyB4ID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoeSA9PT0gdm9pZCAwKSB7IHkgPSB0cnVlOyB9XG4gICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICB0aGlzLnggKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkpIHtcbiAgICAgICAgICAgIHRoaXMueSAqPSAtMTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5tYWduaXR1ZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoKHRoaXMueCAqIHRoaXMueCkgKyAodGhpcy55ICogdGhpcy55KSk7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLmFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gTWF0aC50YW4odGhpcy55IC8gdGhpcy54KTtcbiAgICB9O1xuICAgIHJldHVybiBWZWN0b3I7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gVmVjdG9yO1xuIl19
