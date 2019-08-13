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

},{"./_hide":33,"./_wks":95}],3:[function(require,module,exports){
'use strict';
var at = require('./_string-at')(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};

},{"./_string-at":80}],4:[function(require,module,exports){
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

},{"./_to-absolute-index":84,"./_to-length":87,"./_to-object":88}],7:[function(require,module,exports){
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

},{"./_to-absolute-index":84,"./_to-iobject":86,"./_to-length":87}],8:[function(require,module,exports){
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

},{"./_array-species-create":10,"./_ctx":18,"./_iobject":38,"./_to-length":87,"./_to-object":88}],9:[function(require,module,exports){
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

},{"./_is-array":40,"./_is-object":41,"./_wks":95}],10:[function(require,module,exports){
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

},{"./_cof":13,"./_wks":95}],13:[function(require,module,exports){
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

},{"./_an-instance":4,"./_ctx":18,"./_descriptors":20,"./_for-of":29,"./_iter-define":45,"./_iter-step":47,"./_meta":50,"./_object-create":53,"./_object-dp":54,"./_redefine-all":69,"./_set-species":74,"./_validate-collection":92}],15:[function(require,module,exports){
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

},{"./_an-instance":4,"./_export":24,"./_fails":26,"./_for-of":29,"./_global":31,"./_inherit-if-required":36,"./_is-object":41,"./_iter-detect":46,"./_meta":50,"./_redefine":70,"./_redefine-all":69,"./_set-to-string-tag":75}],16:[function(require,module,exports){
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

},{"./_object-dp":54,"./_property-desc":68}],18:[function(require,module,exports){
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

},{"./_core":16,"./_ctx":18,"./_global":31,"./_hide":33,"./_redefine":70}],25:[function(require,module,exports){
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

},{"./_wks":95}],26:[function(require,module,exports){
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

},{"./_defined":19,"./_fails":26,"./_hide":33,"./_redefine":70,"./_regexp-exec":72,"./_wks":95,"./es6.regexp.exec":114}],28:[function(require,module,exports){
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

},{"./_an-object":5,"./_ctx":18,"./_is-array-iter":39,"./_iter-call":43,"./_to-length":87,"./core.get-iterator-method":96}],30:[function(require,module,exports){
module.exports = require('./_shared')('native-function-to-string', Function.toString);

},{"./_shared":77}],31:[function(require,module,exports){
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

},{"./_descriptors":20,"./_object-dp":54,"./_property-desc":68}],34:[function(require,module,exports){
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

},{"./_is-object":41,"./_set-proto":73}],37:[function(require,module,exports){
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

},{"./_iterators":48,"./_wks":95}],40:[function(require,module,exports){
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

},{"./_cof":13,"./_is-object":41,"./_wks":95}],43:[function(require,module,exports){
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

},{"./_hide":33,"./_object-create":53,"./_property-desc":68,"./_set-to-string-tag":75,"./_wks":95}],45:[function(require,module,exports){
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

},{"./_export":24,"./_hide":33,"./_iter-create":44,"./_iterators":48,"./_library":49,"./_object-gpo":60,"./_redefine":70,"./_set-to-string-tag":75,"./_wks":95}],46:[function(require,module,exports){
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

},{"./_wks":95}],47:[function(require,module,exports){
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

},{"./_fails":26,"./_has":32,"./_is-object":41,"./_object-dp":54,"./_uid":90}],51:[function(require,module,exports){
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

},{"./_cof":13,"./_global":31,"./_task":83}],52:[function(require,module,exports){
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

},{"./_an-object":5,"./_dom-create":21,"./_enum-bug-keys":22,"./_html":34,"./_object-dps":55,"./_shared-key":76}],54:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":20,"./_ie8-dom-define":35,"./_to-primitive":89}],55:[function(require,module,exports){
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

},{"./_descriptors":20,"./_has":32,"./_ie8-dom-define":35,"./_object-pie":63,"./_property-desc":68,"./_to-iobject":86,"./_to-primitive":89}],57:[function(require,module,exports){
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

},{"./_object-gopn":58,"./_to-iobject":86}],58:[function(require,module,exports){
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

},{"./_has":32,"./_shared-key":76,"./_to-object":88}],61:[function(require,module,exports){
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

},{"./_array-includes":7,"./_has":32,"./_shared-key":76,"./_to-iobject":86}],62:[function(require,module,exports){
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

},{"./_object-keys":62,"./_object-pie":63,"./_to-iobject":86}],66:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],67:[function(require,module,exports){
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

},{"./_an-object":5,"./_is-object":41,"./_new-promise-capability":52}],68:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],69:[function(require,module,exports){
var redefine = require('./_redefine');
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};

},{"./_redefine":70}],70:[function(require,module,exports){
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

},{"./_core":16,"./_function-to-string":30,"./_global":31,"./_has":32,"./_hide":33,"./_uid":90}],71:[function(require,module,exports){
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

},{"./_classof":12}],72:[function(require,module,exports){
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

},{"./_flags":28}],73:[function(require,module,exports){
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

},{"./_an-object":5,"./_ctx":18,"./_is-object":41,"./_object-gopd":56}],74:[function(require,module,exports){
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

},{"./_descriptors":20,"./_global":31,"./_object-dp":54,"./_wks":95}],75:[function(require,module,exports){
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_has":32,"./_object-dp":54,"./_wks":95}],76:[function(require,module,exports){
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":77,"./_uid":90}],77:[function(require,module,exports){
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

},{"./_core":16,"./_global":31,"./_library":49}],78:[function(require,module,exports){
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_a-function":1,"./_an-object":5,"./_wks":95}],79:[function(require,module,exports){
'use strict';
var fails = require('./_fails');

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};

},{"./_fails":26}],80:[function(require,module,exports){
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

},{"./_defined":19,"./_to-integer":85}],81:[function(require,module,exports){
// helper for String#{startsWith, endsWith, includes}
var isRegExp = require('./_is-regexp');
var defined = require('./_defined');

module.exports = function (that, searchString, NAME) {
  if (isRegExp(searchString)) throw TypeError('String#' + NAME + " doesn't accept regex!");
  return String(defined(that));
};

},{"./_defined":19,"./_is-regexp":42}],82:[function(require,module,exports){
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

},{"./_defined":19,"./_export":24,"./_fails":26}],83:[function(require,module,exports){
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

},{"./_cof":13,"./_ctx":18,"./_dom-create":21,"./_global":31,"./_html":34,"./_invoke":37}],84:[function(require,module,exports){
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":85}],85:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],86:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_defined":19,"./_iobject":38}],87:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":85}],88:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":19}],89:[function(require,module,exports){
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

},{"./_is-object":41}],90:[function(require,module,exports){
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],91:[function(require,module,exports){
var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":31}],92:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};

},{"./_is-object":41}],93:[function(require,module,exports){
var global = require('./_global');
var core = require('./_core');
var LIBRARY = require('./_library');
var wksExt = require('./_wks-ext');
var defineProperty = require('./_object-dp').f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};

},{"./_core":16,"./_global":31,"./_library":49,"./_object-dp":54,"./_wks-ext":94}],94:[function(require,module,exports){
exports.f = require('./_wks');

},{"./_wks":95}],95:[function(require,module,exports){
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_global":31,"./_shared":77,"./_uid":90}],96:[function(require,module,exports){
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":12,"./_core":16,"./_iterators":48,"./_wks":95}],97:[function(require,module,exports){
// 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
var $export = require('./_export');

$export($export.P, 'Array', { fill: require('./_array-fill') });

require('./_add-to-unscopables')('fill');

},{"./_add-to-unscopables":2,"./_array-fill":6,"./_export":24}],98:[function(require,module,exports){
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

},{"./_create-property":17,"./_ctx":18,"./_export":24,"./_is-array-iter":39,"./_iter-call":43,"./_iter-detect":46,"./_to-length":87,"./_to-object":88,"./core.get-iterator-method":96}],99:[function(require,module,exports){
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

},{"./_array-includes":7,"./_export":24,"./_strict-method":79}],100:[function(require,module,exports){
// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
var $export = require('./_export');

$export($export.S, 'Array', { isArray: require('./_is-array') });

},{"./_export":24,"./_is-array":40}],101:[function(require,module,exports){
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

},{"./_add-to-unscopables":2,"./_iter-define":45,"./_iter-step":47,"./_iterators":48,"./_to-iobject":86}],102:[function(require,module,exports){
'use strict';
var $export = require('./_export');
var $map = require('./_array-methods')(1);

$export($export.P + $export.F * !require('./_strict-method')([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});

},{"./_array-methods":8,"./_export":24,"./_strict-method":79}],103:[function(require,module,exports){
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

},{"./_redefine":70}],104:[function(require,module,exports){
// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
var $export = require('./_export');

$export($export.P, 'Function', { bind: require('./_bind') });

},{"./_bind":11,"./_export":24}],105:[function(require,module,exports){
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

},{"./_descriptors":20,"./_object-dp":54}],106:[function(require,module,exports){
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

},{"./_collection":15,"./_collection-strong":14,"./_validate-collection":92}],107:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: require('./_object-create') });

},{"./_export":24,"./_object-create":53}],108:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', { defineProperty: require('./_object-dp').f });

},{"./_descriptors":20,"./_export":24,"./_object-dp":54}],109:[function(require,module,exports){
// 19.1.2.14 Object.keys(O)
var toObject = require('./_to-object');
var $keys = require('./_object-keys');

require('./_object-sap')('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});

},{"./_object-keys":62,"./_object-sap":64,"./_to-object":88}],110:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', { setPrototypeOf: require('./_set-proto').set });

},{"./_export":24,"./_set-proto":73}],111:[function(require,module,exports){
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

},{"./_classof":12,"./_redefine":70,"./_wks":95}],112:[function(require,module,exports){
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

},{"./_a-function":1,"./_an-instance":4,"./_classof":12,"./_core":16,"./_ctx":18,"./_export":24,"./_for-of":29,"./_global":31,"./_is-object":41,"./_iter-detect":46,"./_library":49,"./_microtask":51,"./_new-promise-capability":52,"./_perform":66,"./_promise-resolve":67,"./_redefine-all":69,"./_set-species":74,"./_set-to-string-tag":75,"./_species-constructor":78,"./_task":83,"./_user-agent":91,"./_wks":95}],113:[function(require,module,exports){
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

},{"./_an-object":5,"./_export":24,"./_fails":26,"./_object-dp":54,"./_to-primitive":89}],114:[function(require,module,exports){
'use strict';
var regexpExec = require('./_regexp-exec');
require('./_export')({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});

},{"./_export":24,"./_regexp-exec":72}],115:[function(require,module,exports){
// 21.2.5.3 get RegExp.prototype.flags()
if (require('./_descriptors') && /./g.flags != 'g') require('./_object-dp').f(RegExp.prototype, 'flags', {
  configurable: true,
  get: require('./_flags')
});

},{"./_descriptors":20,"./_flags":28,"./_object-dp":54}],116:[function(require,module,exports){
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

},{"./_advance-string-index":3,"./_an-object":5,"./_fix-re-wks":27,"./_regexp-exec-abstract":71,"./_to-length":87}],117:[function(require,module,exports){
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

},{"./_advance-string-index":3,"./_an-object":5,"./_fix-re-wks":27,"./_regexp-exec-abstract":71,"./_to-integer":85,"./_to-length":87,"./_to-object":88}],118:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":20,"./_fails":26,"./_flags":28,"./_redefine":70,"./es6.regexp.flags":115}],119:[function(require,module,exports){
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

},{"./_collection":15,"./_collection-strong":14,"./_validate-collection":92}],120:[function(require,module,exports){
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

},{"./_iter-define":45,"./_string-at":80}],121:[function(require,module,exports){
'use strict';
// B.2.3.10 String.prototype.link(url)
require('./_string-html')('link', function (createHTML) {
  return function link(url) {
    return createHTML(this, 'a', 'href', url);
  };
});

},{"./_string-html":82}],122:[function(require,module,exports){
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

},{"./_export":24,"./_fails-is-regexp":25,"./_string-context":81,"./_to-length":87}],123:[function(require,module,exports){
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

},{"./_an-object":5,"./_descriptors":20,"./_enum-keys":23,"./_export":24,"./_fails":26,"./_global":31,"./_has":32,"./_hide":33,"./_is-array":40,"./_is-object":41,"./_library":49,"./_meta":50,"./_object-create":53,"./_object-dp":54,"./_object-gopd":56,"./_object-gopn":58,"./_object-gopn-ext":57,"./_object-gops":59,"./_object-keys":62,"./_object-pie":63,"./_property-desc":68,"./_redefine":70,"./_set-to-string-tag":75,"./_shared":77,"./_to-iobject":86,"./_to-primitive":89,"./_uid":90,"./_wks":95,"./_wks-define":93,"./_wks-ext":94}],124:[function(require,module,exports){
// https://github.com/tc39/proposal-object-values-entries
var $export = require('./_export');
var $values = require('./_object-to-array')(false);

$export($export.S, 'Object', {
  values: function values(it) {
    return $values(it);
  }
});

},{"./_export":24,"./_object-to-array":65}],125:[function(require,module,exports){
require('./_wks-define')('asyncIterator');

},{"./_wks-define":93}],126:[function(require,module,exports){
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

},{"./_global":31,"./_hide":33,"./_iterators":48,"./_object-keys":62,"./_redefine":70,"./_wks":95,"./es6.array.iterator":101}],127:[function(require,module,exports){
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

},{"../Modules/WebPage":160,"../Particles/Particles":168,"./Stars":128,"core-js/modules/es6.object.define-property":108}],128:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":108}],129:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.function.bind");

require("core-js/modules/es6.function.name");

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
      parent.appendChild(this.element);

      if (!this._mounted) {
        Events.dispatch(this, 'mounted', {
          parent: parent
        });
        this._mounted = true;
      }
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

},{"core-js/modules/es6.function.bind":104,"core-js/modules/es6.function.name":105,"core-js/modules/es6.object.create":107,"core-js/modules/es6.object.set-prototype-of":110,"core-js/modules/es6.reflect.define-property":113}],130:[function(require,module,exports){
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
    }, "GPA / ", this.data.gpa.overall, " (overall) / ", this.data.gpa.major, " (major)"), JSX_1.ElementFactory.createElement("hr", null), JSX_1.ElementFactory.createElement("div", {
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

},{"../../Definitions/JSX":146,"../../Modules/DOM":157,"../Component":129,"core-js/modules/es6.array.map":102,"core-js/modules/es6.function.name":105,"core-js/modules/es6.object.create":107,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.set-prototype-of":110,"core-js/modules/es6.string.link":121}],131:[function(require,module,exports){
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
      className: "name is-size-4 is-uppercase is-colored-link"
    }, this.data.company), JSX_1.ElementFactory.createElement("p", {
      className: "location is-size-8 is-italic is-color-light"
    }, this.data.location)), JSX_1.ElementFactory.createElement("div", {
      className: "role"
    }, JSX_1.ElementFactory.createElement("p", {
      className: "name is-size-6 is-bold-weight"
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

},{"../../Definitions/JSX":146,"../Component":129,"core-js/modules/es6.array.map":102,"core-js/modules/es6.object.create":107,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.set-prototype-of":110,"core-js/modules/es6.string.link":121}],132:[function(require,module,exports){
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

},{"../../../Modules/DOM":157,"core-js/modules/es6.object.to-string":111,"core-js/modules/es6.promise":112}],133:[function(require,module,exports){
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

},{"../../Modules/DOM":157,"../../Modules/EventDispatcher":158,"core-js/modules/es6.array.is-array":100,"core-js/modules/es6.array.map":102,"core-js/modules/es6.object.create":107,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.set-prototype-of":110}],134:[function(require,module,exports){
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

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var Project = function (_super) {
  __extends(Project, _super);

  function Project() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.infoDisplayed = false;
    return _this;
  }

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
}(Component_1.DataComponent);

exports.Project = Project;

},{"../../Definitions/JSX":146,"../Component":129,"core-js/modules/es6.array.map":102,"core-js/modules/es6.function.bind":104,"core-js/modules/es6.function.name":105,"core-js/modules/es6.object.create":107,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.set-prototype-of":110}],135:[function(require,module,exports){
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

},{"../../Definitions/JSX":146,"../Component":129,"core-js/modules/es6.function.name":105,"core-js/modules/es6.object.create":107,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.set-prototype-of":110}],136:[function(require,module,exports){
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
    return DOM_1.DOM.inView(this.element);
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

},{"../../Modules/DOM":157,"core-js/modules/es6.object.define-property":108}],137:[function(require,module,exports){
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

var SVG_1 = require("../../Modules/SVG");

var JSX_1 = require("../../Definitions/JSX");

var Component_1 = require("../Component");

var Skill = function (_super) {
  __extends(Skill, _super);

  function Skill() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

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
      className: 'skill'
    }, JSX_1.ElementFactory.createElement("div", {
      className: 'hexagon-container',
      style: {
        color: this.data.color
      }
    }, JSX_1.ElementFactory.createElement("span", {
      className: 'tooltip'
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

},{"../../Definitions/JSX":146,"../../Modules/SVG":159,"../Component":129,"core-js/modules/es6.function.name":105,"core-js/modules/es6.object.create":107,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.set-prototype-of":110,"core-js/modules/es6.object.to-string":111,"core-js/modules/es6.promise":112}],138:[function(require,module,exports){
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

},{"../../Definitions/JSX":146,"../Component":129,"core-js/modules/es6.object.create":107,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.set-prototype-of":110,"core-js/modules/es6.string.link":121}],139:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboutMe = "I am an aspiring web developer and software engineer chasing my passion for working with technology and programming at the University of Texas at Dallas. I crave the opportunity to contribute to meaningful projects that employ my current gifts and interests while also shoving me out of my comfort zone to learn new skills. My goal is to maximize every experience as an opportunity for personal, professional, and technical growth.";

},{"core-js/modules/es6.object.define-property":108}],140:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Education = [{
  name: 'The University of Texas at Dallas',
  color: '#C75B12',
  image: 'utd.svg',
  link: 'http://utdallas.edu',
  location: 'Richardson, TX, USA',
  degree: 'Bachelor of Science in Computer Science',
  start: 'Fall 2018',
  end: 'Spring 2022',
  credits: {
    total: 124,
    completed: 62,
    taking: 16
  },
  gpa: {
    overall: '4.0',
    major: '4.0'
  },
  courses: ['Two Semesters of C++ Programming', 'Discrete Mathematics I', 'Data Science with R Workshop']
}];

},{"core-js/modules/es6.object.define-property":108}],141:[function(require,module,exports){
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
  roles: ['Architected the initial foundations for a full-scale, single-page web application using Vue, TypeScript, and SASS.', 'Designed an interface-oriented, modularized state management system to work behind the application.', 'Developed a Vue configuration library to enhance the ability to mock application state in unit testing.', 'Established a comprehensive UI component library to accelerate the ability to add new content.']
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

},{"core-js/modules/es6.object.define-property":108}],142:[function(require,module,exports){
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
  date: 'Spring/Summer 2019',
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

},{"core-js/modules/es6.object.define-property":108}],143:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":108}],144:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":108}],145:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});
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

},{"core-js/modules/es6.object.define-property":108}],146:[function(require,module,exports){
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

},{"core-js/modules/es6.array.is-array":100,"core-js/modules/es6.array.iterator":101,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.keys":109,"core-js/modules/es6.object.to-string":111,"core-js/modules/es6.regexp.replace":117,"core-js/modules/es6.string.starts-with":122,"core-js/modules/es6.symbol":123,"core-js/modules/es7.symbol.async-iterator":125,"core-js/modules/web.dom.iterable":126}],147:[function(require,module,exports){
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

},{"../Classes/Elements/Quality":135,"../Data/About":139,"../Data/Qualities":143,"../Modules/DOM":157,"../Modules/WebPage":160,"core-js/modules/es6.object.define-property":108}],148:[function(require,module,exports){
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

},{"../Modules/WebPage":160,"core-js/modules/es6.object.define-property":108}],149:[function(require,module,exports){
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

},{"../Classes/Elements/Social":138,"../Data/Social":145,"../Modules/DOM":157,"../Modules/WebPage":160,"core-js/modules/es6.object.define-property":108}],150:[function(require,module,exports){
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

},{"../Classes/Elements/Education":130,"../Data/Education":140,"../Modules/DOM":157,"../Modules/WebPage":160,"core-js/modules/es6.object.define-property":108}],151:[function(require,module,exports){
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

},{"../Classes/Elements/Experience":131,"../Data/Experience":141,"../Modules/DOM":157,"../Modules/WebPage":160,"core-js/modules/es6.object.define-property":108}],152:[function(require,module,exports){
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

},{"../Modules/DOM":157,"../Modules/WebPage":160,"core-js/modules/es6.object.define-property":108}],153:[function(require,module,exports){
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

},{"../Modules/WebPage":160,"core-js/modules/es6.array.iterator":101,"core-js/modules/es6.function.name":105,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.to-string":111,"core-js/modules/web.dom.iterable":126}],154:[function(require,module,exports){
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

},{"../Modules/WebPage":160,"core-js/modules/es6.array.iterator":101,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.to-string":111,"core-js/modules/web.dom.iterable":126}],155:[function(require,module,exports){
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

},{"../Classes/Elements/Project":134,"../Data/Projects":142,"../Modules/DOM":157,"../Modules/WebPage":160,"core-js/modules/es6.object.define-property":108}],156:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

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
    if (!done) {
      throw "Could not initialize Skills object.";
    }

    var skill;

    for (var _i = 0, skillsData_1 = skillsData; _i < skillsData_1.length; _i++) {
      var data = skillsData_1[_i];
      skill = new Skill_1.Skill(data);
      skill.appendTo(WebPage_1.SkillsGrid);
    }
  });
};

},{"../Classes/Elements/Skill":137,"../Data/Skills":144,"../Modules/DOM":157,"../Modules/WebPage":160,"core-js/modules/es6.object.define-property":108}],157:[function(require,module,exports){
"use strict";

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

  function scrollTo(element) {}

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

  function inView(element, offset) {
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

  DOM.inView = inView;

  function onFirstAppearance(element, callback, setting) {
    var timeout = setting ? setting.timeout : 0;
    var offset = setting ? setting.offset : 0;

    if (inView(element, offset)) {
      setTimeout(callback, timeout);
    } else {
      var eventCallback_1 = function eventCallback_1(event) {
        if (inView(element, offset)) {
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
})(DOM = exports.DOM || (exports.DOM = {}));

},{"core-js/modules/es6.array.is-array":100,"core-js/modules/es6.array.iterator":101,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.to-string":111,"core-js/modules/es6.promise":112,"core-js/modules/es6.regexp.match":116,"core-js/modules/es7.object.values":124,"core-js/modules/web.dom.iterable":126}],158:[function(require,module,exports){
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

},{"core-js/modules/es6.array.iterator":101,"core-js/modules/es6.function.name":105,"core-js/modules/es6.map":106,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.to-string":111,"core-js/modules/es6.set":119,"core-js/modules/es6.string.iterator":120,"core-js/modules/web.dom.iterable":126}],159:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.to-string":111,"core-js/modules/es6.promise":112}],160:[function(require,module,exports){
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
exports.SocialGrid = DOM_1.DOM.getFirstElement('section#connect .social-icons');

},{"../Classes/Elements/Menu":133,"../Classes/Elements/Section":136,"./DOM":157,"core-js/modules/es6.array.from":98,"core-js/modules/es6.array.iterator":101,"core-js/modules/es6.map":106,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.to-string":111,"core-js/modules/es6.string.iterator":120,"core-js/modules/web.dom.iterable":126}],161:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":108}],162:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":108}],163:[function(require,module,exports){
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

},{"core-js/modules/es6.date.to-string":103,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.to-string":111,"core-js/modules/es6.regexp.to-string":118}],164:[function(require,module,exports){
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

},{"core-js/modules/es6.date.to-string":103,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.to-string":111,"core-js/modules/es6.regexp.to-string":118}],165:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":108}],166:[function(require,module,exports){
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

},{"./Animation":161,"./Color":163,"./Coordinate":164,"./Stroke":169,"./Vector":170,"core-js/modules/es6.array.index-of":99,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.symbol":123,"core-js/modules/es7.symbol.async-iterator":125}],167:[function(require,module,exports){
"use strict";

require("core-js/modules/es6.object.define-property");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es6.object.define-property":108}],168:[function(require,module,exports){
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

},{"../Modules/DOM":157,"./AnimationFrameFunctions":162,"./Coordinate":164,"./Particle":166,"core-js/modules/es6.array.fill":97,"core-js/modules/es6.array.map":102,"core-js/modules/es6.date.to-string":103,"core-js/modules/es6.function.bind":104,"core-js/modules/es6.object.define-property":108,"core-js/modules/es6.object.to-string":111,"core-js/modules/es6.regexp.to-string":118}],169:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":108}],170:[function(require,module,exports){
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

},{"core-js/modules/es6.object.define-property":108}]},{},[127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,168,167,169,170])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hLWZ1bmN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYWR2YW5jZS1zdHJpbmctaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hbi1pbnN0YW5jZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FuLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2FycmF5LW1ldGhvZHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fYXJyYXktc3BlY2llcy1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvbGxlY3Rpb24tc3Ryb25nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kZWZpbmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZW51bS1idWcta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLWlzLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZhaWxzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZml4LXJlLXdrcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2ZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZnVuY3Rpb24tdG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faGlkZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2luaGVyaXQtaWYtcmVxdWlyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pbnZva2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtYXJyYXktaXRlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2lzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXMtcmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX2l0ZXItZGV0ZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlci1zdGVwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX21ldGEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19taWNyb3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19uZXctcHJvbWlzZS1jYXBhYmlsaXR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1kcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1nb3BuLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19vYmplY3Qtc2FwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fb2JqZWN0LXRvLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcGVyZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Byb21pc2UtcmVzb2x2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS1hbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19yZWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3JlZ2V4cC1leGVjLWFic3RyYWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fcmVnZXhwLWV4ZWMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zZXQtc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc2hhcmVkLWtleS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3NwZWNpZXMtY29uc3RydWN0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpY3QtbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fc3RyaW5nLWNvbnRleHQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL19zdHJpbmctaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3Rhc2suanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1hYnNvbHV0ZS1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL190by1pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fdXNlci1hZ2VudC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3ZhbGlkYXRlLWNvbGxlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL193a3MtZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9fd2tzLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvX3drcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZyb20uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pbmRleC1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmlzLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5kYXRlLnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmZ1bmN0aW9uLmJpbmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5mdW5jdGlvbi5uYW1lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5vYmplY3Qua2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5leGVjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLmZsYWdzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLm1hdGNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucmVnZXhwLnJlcGxhY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWdleHAudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmxpbmsuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuc3RhcnRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNy5vYmplY3QudmFsdWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwib3V0L3RzL0NhbnZhcy9DYW52YXMuanMiLCJvdXQvdHMvQ2FudmFzL1N0YXJzLmpzIiwib3V0L3RzL0NsYXNzZXMvQ29tcG9uZW50L2luZGV4LmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvRWR1Y2F0aW9uLmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvRXhwZXJpZW5jZS5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL0hlbHBlcnMvaW5kZXguanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9NZW51LmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvUHJvamVjdC5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1F1YWxpdHkuanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9TZWN0aW9uLmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvU2tpbGwuanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9Tb2NpYWwuanMiLCJvdXQvdHMvRGF0YS9BYm91dC5qcyIsIm91dC90cy9EYXRhL0VkdWNhdGlvbi5qcyIsIm91dC90cy9EYXRhL0V4cGVyaWVuY2UuanMiLCJvdXQvdHMvRGF0YS9Qcm9qZWN0cy5qcyIsIm91dC90cy9EYXRhL1F1YWxpdGllcy5qcyIsIm91dC90cy9EYXRhL1NraWxscy5qcyIsIm91dC90cy9EYXRhL1NvY2lhbC5qcyIsIm91dC90cy9EZWZpbml0aW9ucy9KU1guanMiLCJvdXQvdHMvRXZlbnRzL0Fib3V0LmpzIiwib3V0L3RzL0V2ZW50cy9Cb2R5LmpzIiwib3V0L3RzL0V2ZW50cy9Db25uZWN0LmpzIiwib3V0L3RzL0V2ZW50cy9FZHVjYXRpb24uanMiLCJvdXQvdHMvRXZlbnRzL0V4cGVyaWVuY2UuanMiLCJvdXQvdHMvRXZlbnRzL0xvZ28uanMiLCJvdXQvdHMvRXZlbnRzL01haW4uanMiLCJvdXQvdHMvRXZlbnRzL01lbnUuanMiLCJvdXQvdHMvRXZlbnRzL1Byb2plY3RzLmpzIiwib3V0L3RzL0V2ZW50cy9Ta2lsbHMuanMiLCJvdXQvdHMvTW9kdWxlcy9ET00uanMiLCJvdXQvdHMvTW9kdWxlcy9FdmVudERpc3BhdGNoZXIuanMiLCJvdXQvdHMvTW9kdWxlcy9TVkcuanMiLCJvdXQvdHMvTW9kdWxlcy9XZWJQYWdlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9BbmltYXRpb24uanMiLCJvdXQvdHMvUGFydGljbGVzL0FuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9Db2xvci5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQ29vcmRpbmF0ZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvTW91c2UuanMiLCJvdXQvdHMvUGFydGljbGVzL1BhcnRpY2xlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9QYXJ0aWNsZVNldHRpbmdzLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9QYXJ0aWNsZXMuanMiLCJvdXQvdHMvUGFydGljbGVzL1N0cm9rZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvVmVjdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5UkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFhLENBQWIsRUFBZ0I7QUFDcEMsUUFBSSxDQUFDLEtBQUssS0FBSyxDQUFmLEVBQWtCO0FBQUUsTUFBQSxDQUFDLEdBQUcsSUFBSjtBQUFXOztBQUMvQixRQUFJLENBQUMsS0FBSyxLQUFLLENBQWYsRUFBa0I7QUFBRSxNQUFBLENBQUMsR0FBRyxJQUFKO0FBQVc7O0FBQy9CLFFBQUksQ0FBSixFQUFPO0FBQ0gsV0FBSyxDQUFMLElBQVUsQ0FBQyxDQUFYO0FBQ0g7O0FBQ0QsUUFBSSxDQUFKLEVBQU87QUFDSCxXQUFLLENBQUwsSUFBVSxDQUFDLENBQVg7QUFDSDtBQUNKLEdBVEQ7O0FBVUEsRUFBQSxNQUFNLENBQUMsU0FBUCxDQUFpQixTQUFqQixHQUE2QixZQUFZO0FBQ3JDLFdBQU8sSUFBSSxDQUFDLElBQUwsQ0FBVyxLQUFLLENBQUwsR0FBUyxLQUFLLENBQWYsR0FBcUIsS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUE3QyxDQUFQO0FBQ0gsR0FGRDs7QUFHQSxFQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLEtBQWpCLEdBQXlCLFlBQVk7QUFDakMsV0FBTyxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBdkIsQ0FBUDtBQUNILEdBRkQ7O0FBR0EsU0FBTyxNQUFQO0FBQ0gsQ0F0QmEsRUFBZDs7QUF1QkEsT0FBTyxXQUFQLEdBQWtCLE1BQWxCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gMjIuMS4zLjMxIEFycmF5LnByb3RvdHlwZVtAQHVuc2NvcGFibGVzXVxudmFyIFVOU0NPUEFCTEVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3Vuc2NvcGFibGVzJyk7XG52YXIgQXJyYXlQcm90byA9IEFycmF5LnByb3RvdHlwZTtcbmlmIChBcnJheVByb3RvW1VOU0NPUEFCTEVTXSA9PSB1bmRlZmluZWQpIHJlcXVpcmUoJy4vX2hpZGUnKShBcnJheVByb3RvLCBVTlNDT1BBQkxFUywge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIEFycmF5UHJvdG9bVU5TQ09QQUJMRVNdW2tleV0gPSB0cnVlO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhdCA9IHJlcXVpcmUoJy4vX3N0cmluZy1hdCcpKHRydWUpO1xuXG4gLy8gYEFkdmFuY2VTdHJpbmdJbmRleGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1hZHZhbmNlc3RyaW5naW5kZXhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFMsIGluZGV4LCB1bmljb2RlKSB7XG4gIHJldHVybiBpbmRleCArICh1bmljb2RlID8gYXQoUywgaW5kZXgpLmxlbmd0aCA6IDEpO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSwgZm9yYmlkZGVuRmllbGQpIHtcbiAgaWYgKCEoaXQgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikgfHwgKGZvcmJpZGRlbkZpZWxkICE9PSB1bmRlZmluZWQgJiYgZm9yYmlkZGVuRmllbGQgaW4gaXQpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKG5hbWUgKyAnOiBpbmNvcnJlY3QgaW52b2NhdGlvbiEnKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59O1xuIiwiLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXG4ndXNlIHN0cmljdCc7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuL190by1hYnNvbHV0ZS1pbmRleCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbGwodmFsdWUgLyogLCBzdGFydCA9IDAsIGVuZCA9IEBsZW5ndGggKi8pIHtcbiAgdmFyIE8gPSB0b09iamVjdCh0aGlzKTtcbiAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgdmFyIGFMZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIGxlbmd0aCk7XG4gIHZhciBlbmQgPSBhTGVuID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgdmFyIGVuZFBvcyA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9BYnNvbHV0ZUluZGV4KGVuZCwgbGVuZ3RoKTtcbiAgd2hpbGUgKGVuZFBvcyA+IGluZGV4KSBPW2luZGV4KytdID0gdmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi9fdG8tYWJzb2x1dGUtaW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKElTX0lOQ0xVREVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGVsLCBmcm9tSW5kZXgpIHtcbiAgICB2YXIgTyA9IHRvSU9iamVjdCgkdGhpcyk7XG4gICAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgICB2YXIgaW5kZXggPSB0b0Fic29sdXRlSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpO1xuICAgIHZhciB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlXG4gICAgICBpZiAodmFsdWUgIT0gdmFsdWUpIHJldHVybiB0cnVlO1xuICAgIC8vIEFycmF5I2luZGV4T2YgaWdub3JlcyBob2xlcywgQXJyYXkjaW5jbHVkZXMgLSBub3RcbiAgICB9IGVsc2UgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChJU19JTkNMVURFUyB8fCBpbmRleCBpbiBPKSB7XG4gICAgICBpZiAoT1tpbmRleF0gPT09IGVsKSByZXR1cm4gSVNfSU5DTFVERVMgfHwgaW5kZXggfHwgMDtcbiAgICB9IHJldHVybiAhSVNfSU5DTFVERVMgJiYgLTE7XG4gIH07XG59O1xuIiwiLy8gMCAtPiBBcnJheSNmb3JFYWNoXG4vLyAxIC0+IEFycmF5I21hcFxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcbi8vIDMgLT4gQXJyYXkjc29tZVxuLy8gNCAtPiBBcnJheSNldmVyeVxuLy8gNSAtPiBBcnJheSNmaW5kXG4vLyA2IC0+IEFycmF5I2ZpbmRJbmRleFxudmFyIGN0eCA9IHJlcXVpcmUoJy4vX2N0eCcpO1xudmFyIElPYmplY3QgPSByZXF1aXJlKCcuL19pb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGFzYyA9IHJlcXVpcmUoJy4vX2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUWVBFLCAkY3JlYXRlKSB7XG4gIHZhciBJU19NQVAgPSBUWVBFID09IDE7XG4gIHZhciBJU19GSUxURVIgPSBUWVBFID09IDI7XG4gIHZhciBJU19TT01FID0gVFlQRSA9PSAzO1xuICB2YXIgSVNfRVZFUlkgPSBUWVBFID09IDQ7XG4gIHZhciBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2O1xuICB2YXIgTk9fSE9MRVMgPSBUWVBFID09IDUgfHwgSVNfRklORF9JTkRFWDtcbiAgdmFyIGNyZWF0ZSA9ICRjcmVhdGUgfHwgYXNjO1xuICByZXR1cm4gZnVuY3Rpb24gKCR0aGlzLCBjYWxsYmFja2ZuLCB0aGF0KSB7XG4gICAgdmFyIE8gPSB0b09iamVjdCgkdGhpcyk7XG4gICAgdmFyIHNlbGYgPSBJT2JqZWN0KE8pO1xuICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIHRoYXQsIDMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChzZWxmLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICB2YXIgcmVzdWx0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSID8gY3JlYXRlKCR0aGlzLCAwKSA6IHVuZGVmaW5lZDtcbiAgICB2YXIgdmFsLCByZXM7XG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIGlmIChOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKSB7XG4gICAgICB2YWwgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XG4gICAgICBpZiAoVFlQRSkge1xuICAgICAgICBpZiAoSVNfTUFQKSByZXN1bHRbaW5kZXhdID0gcmVzOyAgIC8vIG1hcFxuICAgICAgICBlbHNlIGlmIChyZXMpIHN3aXRjaCAoVFlQRSkge1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgIC8vIHNvbWVcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAvLyBmaW5kXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgLy8gZmlsdGVyXG4gICAgICAgIH0gZWxzZSBpZiAoSVNfRVZFUlkpIHJldHVybiBmYWxzZTsgLy8gZXZlcnlcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIElTX0ZJTkRfSU5ERVggPyAtMSA6IElTX1NPTUUgfHwgSVNfRVZFUlkgPyBJU19FVkVSWSA6IHJlc3VsdDtcbiAgfTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi9faXMtYXJyYXknKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWwpIHtcbiAgdmFyIEM7XG4gIGlmIChpc0FycmF5KG9yaWdpbmFsKSkge1xuICAgIEMgPSBvcmlnaW5hbC5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmICh0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpIEMgPSB1bmRlZmluZWQ7XG4gICAgaWYgKGlzT2JqZWN0KEMpKSB7XG4gICAgICBDID0gQ1tTUEVDSUVTXTtcbiAgICAgIGlmIChDID09PSBudWxsKSBDID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSByZXR1cm4gQyA9PT0gdW5kZWZpbmVkID8gQXJyYXkgOiBDO1xufTtcbiIsIi8vIDkuNC4yLjMgQXJyYXlTcGVjaWVzQ3JlYXRlKG9yaWdpbmFsQXJyYXksIGxlbmd0aClcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19hcnJheS1zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9yaWdpbmFsLCBsZW5ndGgpIHtcbiAgcmV0dXJuIG5ldyAoc3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsKSkobGVuZ3RoKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaW52b2tlID0gcmVxdWlyZSgnLi9faW52b2tlJyk7XG52YXIgYXJyYXlTbGljZSA9IFtdLnNsaWNlO1xudmFyIGZhY3RvcmllcyA9IHt9O1xuXG52YXIgY29uc3RydWN0ID0gZnVuY3Rpb24gKEYsIGxlbiwgYXJncykge1xuICBpZiAoIShsZW4gaW4gZmFjdG9yaWVzKSkge1xuICAgIGZvciAodmFyIG4gPSBbXSwgaSA9IDA7IGkgPCBsZW47IGkrKykgbltpXSA9ICdhWycgKyBpICsgJ10nO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgIGZhY3Rvcmllc1tsZW5dID0gRnVuY3Rpb24oJ0YsYScsICdyZXR1cm4gbmV3IEYoJyArIG4uam9pbignLCcpICsgJyknKTtcbiAgfSByZXR1cm4gZmFjdG9yaWVzW2xlbl0oRiwgYXJncyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLmJpbmQgfHwgZnVuY3Rpb24gYmluZCh0aGF0IC8qICwgLi4uYXJncyAqLykge1xuICB2YXIgZm4gPSBhRnVuY3Rpb24odGhpcyk7XG4gIHZhciBwYXJ0QXJncyA9IGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICB2YXIgYm91bmQgPSBmdW5jdGlvbiAoLyogYXJncy4uLiAqLykge1xuICAgIHZhciBhcmdzID0gcGFydEFyZ3MuY29uY2F0KGFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIGJvdW5kID8gY29uc3RydWN0KGZuLCBhcmdzLmxlbmd0aCwgYXJncykgOiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xuICB9O1xuICBpZiAoaXNPYmplY3QoZm4ucHJvdG90eXBlKSkgYm91bmQucHJvdG90eXBlID0gZm4ucHJvdG90eXBlO1xuICByZXR1cm4gYm91bmQ7XG59O1xuIiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcbi8vIEVTMyB3cm9uZyBoZXJlXG52YXIgQVJHID0gY29mKGZ1bmN0aW9uICgpIHsgcmV0dXJuIGFyZ3VtZW50czsgfSgpKSA9PSAnQXJndW1lbnRzJztcblxuLy8gZmFsbGJhY2sgZm9yIElFMTEgU2NyaXB0IEFjY2VzcyBEZW5pZWQgZXJyb3JcbnZhciB0cnlHZXQgPSBmdW5jdGlvbiAoaXQsIGtleSkge1xuICB0cnkge1xuICAgIHJldHVybiBpdFtrZXldO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHZhciBPLCBULCBCO1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/ICdVbmRlZmluZWQnIDogaXQgPT09IG51bGwgPyAnTnVsbCdcbiAgICAvLyBAQHRvU3RyaW5nVGFnIGNhc2VcbiAgICA6IHR5cGVvZiAoVCA9IHRyeUdldChPID0gT2JqZWN0KGl0KSwgVEFHKSkgPT0gJ3N0cmluZycgPyBUXG4gICAgLy8gYnVpbHRpblRhZyBjYXNlXG4gICAgOiBBUkcgPyBjb2YoTylcbiAgICAvLyBFUzMgYXJndW1lbnRzIGZhbGxiYWNrXG4gICAgOiAoQiA9IGNvZihPKSkgPT0gJ09iamVjdCcgJiYgdHlwZW9mIE8uY2FsbGVlID09ICdmdW5jdGlvbicgPyAnQXJndW1lbnRzJyA6IEI7XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi9fYW4taW5zdGFuY2UnKTtcbnZhciBmb3JPZiA9IHJlcXVpcmUoJy4vX2Zvci1vZicpO1xudmFyICRpdGVyRGVmaW5lID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKTtcbnZhciBzdGVwID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJyk7XG52YXIgc2V0U3BlY2llcyA9IHJlcXVpcmUoJy4vX3NldC1zcGVjaWVzJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpO1xudmFyIGZhc3RLZXkgPSByZXF1aXJlKCcuL19tZXRhJykuZmFzdEtleTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBTSVpFID0gREVTQ1JJUFRPUlMgPyAnX3MnIDogJ3NpemUnO1xuXG52YXIgZ2V0RW50cnkgPSBmdW5jdGlvbiAodGhhdCwga2V5KSB7XG4gIC8vIGZhc3QgY2FzZVxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSk7XG4gIHZhciBlbnRyeTtcbiAgaWYgKGluZGV4ICE9PSAnRicpIHJldHVybiB0aGF0Ll9pW2luZGV4XTtcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXG4gIGZvciAoZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKSB7XG4gICAgaWYgKGVudHJ5LmsgPT0ga2V5KSByZXR1cm4gZW50cnk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBnZXRDb25zdHJ1Y3RvcjogZnVuY3Rpb24gKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpIHtcbiAgICB2YXIgQyA9IHdyYXBwZXIoZnVuY3Rpb24gKHRoYXQsIGl0ZXJhYmxlKSB7XG4gICAgICBhbkluc3RhbmNlKHRoYXQsIEMsIE5BTUUsICdfaScpO1xuICAgICAgdGhhdC5fdCA9IE5BTUU7ICAgICAgICAgLy8gY29sbGVjdGlvbiB0eXBlXG4gICAgICB0aGF0Ll9pID0gY3JlYXRlKG51bGwpOyAvLyBpbmRleFxuICAgICAgdGhhdC5fZiA9IHVuZGVmaW5lZDsgICAgLy8gZmlyc3QgZW50cnlcbiAgICAgIHRoYXQuX2wgPSB1bmRlZmluZWQ7ICAgIC8vIGxhc3QgZW50cnlcbiAgICAgIHRoYXRbU0laRV0gPSAwOyAgICAgICAgIC8vIHNpemVcbiAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcbiAgICB9KTtcbiAgICByZWRlZmluZUFsbChDLnByb3RvdHlwZSwge1xuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXG4gICAgICAvLyAyMy4yLjMuMiBTZXQucHJvdG90eXBlLmNsZWFyKClcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgZm9yICh2YXIgdGhhdCA9IHZhbGlkYXRlKHRoaXMsIE5BTUUpLCBkYXRhID0gdGhhdC5faSwgZW50cnkgPSB0aGF0Ll9mOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKSB7XG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XG4gICAgICAgICAgaWYgKGVudHJ5LnApIGVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgZGVsZXRlIGRhdGFbZW50cnkuaV07XG4gICAgICAgIH1cbiAgICAgICAgdGhhdC5fZiA9IHRoYXQuX2wgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxuICAgICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB2YWxpZGF0ZSh0aGlzLCBOQU1FKTtcbiAgICAgICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcbiAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgdmFyIG5leHQgPSBlbnRyeS5uO1xuICAgICAgICAgIHZhciBwcmV2ID0gZW50cnkucDtcbiAgICAgICAgICBkZWxldGUgdGhhdC5faVtlbnRyeS5pXTtcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcbiAgICAgICAgICBpZiAocHJldikgcHJldi5uID0gbmV4dDtcbiAgICAgICAgICBpZiAobmV4dCkgbmV4dC5wID0gcHJldjtcbiAgICAgICAgICBpZiAodGhhdC5fZiA9PSBlbnRyeSkgdGhhdC5fZiA9IG5leHQ7XG4gICAgICAgICAgaWYgKHRoYXQuX2wgPT0gZW50cnkpIHRoYXQuX2wgPSBwcmV2O1xuICAgICAgICAgIHRoYXRbU0laRV0tLTtcbiAgICAgICAgfSByZXR1cm4gISFlbnRyeTtcbiAgICAgIH0sXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcbiAgICAgIC8vIDIzLjEuMy41IE1hcC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhhdCA9IHVuZGVmaW5lZCAqLykge1xuICAgICAgICB2YWxpZGF0ZSh0aGlzLCBOQU1FKTtcbiAgICAgICAgdmFyIGYgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpO1xuICAgICAgICB2YXIgZW50cnk7XG4gICAgICAgIHdoaWxlIChlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoaXMuX2YpIHtcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgICAgIHdoaWxlIChlbnRyeSAmJiBlbnRyeS5yKSBlbnRyeSA9IGVudHJ5LnA7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXG4gICAgICAvLyAyMy4yLjMuNyBTZXQucHJvdG90eXBlLmhhcyh2YWx1ZSlcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBOQU1FKSwga2V5KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAoREVTQ1JJUFRPUlMpIGRQKEMucHJvdG90eXBlLCAnc2l6ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdmFsaWRhdGUodGhpcywgTkFNRSlbU0laRV07XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIEM7XG4gIH0sXG4gIGRlZjogZnVuY3Rpb24gKHRoYXQsIGtleSwgdmFsdWUpIHtcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgIHZhciBwcmV2LCBpbmRleDtcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcbiAgICBpZiAoZW50cnkpIHtcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcbiAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoYXQuX2wgPSBlbnRyeSA9IHtcbiAgICAgICAgaTogaW5kZXggPSBmYXN0S2V5KGtleSwgdHJ1ZSksIC8vIDwtIGluZGV4XG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXG4gICAgICAgIHA6IHByZXYgPSB0aGF0Ll9sLCAgICAgICAgICAgICAvLyA8LSBwcmV2aW91cyBlbnRyeVxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxuICAgICAgfTtcbiAgICAgIGlmICghdGhhdC5fZikgdGhhdC5fZiA9IGVudHJ5O1xuICAgICAgaWYgKHByZXYpIHByZXYubiA9IGVudHJ5O1xuICAgICAgdGhhdFtTSVpFXSsrO1xuICAgICAgLy8gYWRkIHRvIGluZGV4XG4gICAgICBpZiAoaW5kZXggIT09ICdGJykgdGhhdC5faVtpbmRleF0gPSBlbnRyeTtcbiAgICB9IHJldHVybiB0aGF0O1xuICB9LFxuICBnZXRFbnRyeTogZ2V0RW50cnksXG4gIHNldFN0cm9uZzogZnVuY3Rpb24gKEMsIE5BTUUsIElTX01BUCkge1xuICAgIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxuICAgIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcbiAgICAkaXRlckRlZmluZShDLCBOQU1FLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgICAgIHRoaXMuX3QgPSB2YWxpZGF0ZShpdGVyYXRlZCwgTkFNRSk7IC8vIHRhcmdldFxuICAgICAgdGhpcy5fayA9IGtpbmQ7ICAgICAgICAgICAgICAgICAgICAgLy8ga2luZFxuICAgICAgdGhpcy5fbCA9IHVuZGVmaW5lZDsgICAgICAgICAgICAgICAgLy8gcHJldmlvdXNcbiAgICB9LCBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICB2YXIga2luZCA9IHRoYXQuX2s7XG4gICAgICB2YXIgZW50cnkgPSB0aGF0Ll9sO1xuICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XG4gICAgICB3aGlsZSAoZW50cnkgJiYgZW50cnkucikgZW50cnkgPSBlbnRyeS5wO1xuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcbiAgICAgIGlmICghdGhhdC5fdCB8fCAhKHRoYXQuX2wgPSBlbnRyeSA9IGVudHJ5ID8gZW50cnkubiA6IHRoYXQuX3QuX2YpKSB7XG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXG4gICAgICAgIHRoYXQuX3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xuICAgICAgfVxuICAgICAgLy8gcmV0dXJuIHN0ZXAgYnkga2luZFxuICAgICAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcbiAgICAgIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcbiAgICAgIHJldHVybiBzdGVwKDAsIFtlbnRyeS5rLCBlbnRyeS52XSk7XG4gICAgfSwgSVNfTUFQID8gJ2VudHJpZXMnIDogJ3ZhbHVlcycsICFJU19NQVAsIHRydWUpO1xuXG4gICAgLy8gYWRkIFtAQHNwZWNpZXNdLCAyMy4xLjIuMiwgMjMuMi4yLjJcbiAgICBzZXRTcGVjaWVzKE5BTUUpO1xuICB9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKTtcbnZhciBtZXRhID0gcmVxdWlyZSgnLi9fbWV0YScpO1xudmFyIGZvck9mID0gcmVxdWlyZSgnLi9fZm9yLW9mJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG52YXIgJGl0ZXJEZXRlY3QgPSByZXF1aXJlKCcuL19pdGVyLWRldGVjdCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBpbmhlcml0SWZSZXF1aXJlZCA9IHJlcXVpcmUoJy4vX2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSwgd3JhcHBlciwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspIHtcbiAgdmFyIEJhc2UgPSBnbG9iYWxbTkFNRV07XG4gIHZhciBDID0gQmFzZTtcbiAgdmFyIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJztcbiAgdmFyIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZTtcbiAgdmFyIE8gPSB7fTtcbiAgdmFyIGZpeE1ldGhvZCA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgICB2YXIgZm4gPSBwcm90b1tLRVldO1xuICAgIHJlZGVmaW5lKHByb3RvLCBLRVksXG4gICAgICBLRVkgPT0gJ2RlbGV0ZScgPyBmdW5jdGlvbiAoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2hhcycgPyBmdW5jdGlvbiBoYXMoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyBmYWxzZSA6IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhKTtcbiAgICAgIH0gOiBLRVkgPT0gJ2dldCcgPyBmdW5jdGlvbiBnZXQoYSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3QoYSkgPyB1bmRlZmluZWQgOiBmbi5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSk7XG4gICAgICB9IDogS0VZID09ICdhZGQnID8gZnVuY3Rpb24gYWRkKGEpIHsgZm4uY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEpOyByZXR1cm4gdGhpczsgfVxuICAgICAgICA6IGZ1bmN0aW9uIHNldChhLCBiKSB7IGZuLmNhbGwodGhpcywgYSA9PT0gMCA/IDAgOiBhLCBiKTsgcmV0dXJuIHRoaXM7IH1cbiAgICApO1xuICB9O1xuICBpZiAodHlwZW9mIEMgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgcHJvdG8uZm9yRWFjaCAmJiAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIG5ldyBDKCkuZW50cmllcygpLm5leHQoKTtcbiAgfSkpKSB7XG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIE5BTUUsIElTX01BUCwgQURERVIpO1xuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCBtZXRob2RzKTtcbiAgICBtZXRhLk5FRUQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBpbnN0YW5jZSA9IG5ldyBDKCk7XG4gICAgLy8gZWFybHkgaW1wbGVtZW50YXRpb25zIG5vdCBzdXBwb3J0cyBjaGFpbmluZ1xuICAgIHZhciBIQVNOVF9DSEFJTklORyA9IGluc3RhbmNlW0FEREVSXShJU19XRUFLID8ge30gOiAtMCwgMSkgIT0gaW5zdGFuY2U7XG4gICAgLy8gVjggfiAgQ2hyb21pdW0gNDAtIHdlYWstY29sbGVjdGlvbnMgdGhyb3dzIG9uIHByaW1pdGl2ZXMsIGJ1dCBzaG91bGQgcmV0dXJuIGZhbHNlXG4gICAgdmFyIFRIUk9XU19PTl9QUklNSVRJVkVTID0gZmFpbHMoZnVuY3Rpb24gKCkgeyBpbnN0YW5jZS5oYXMoMSk7IH0pO1xuICAgIC8vIG1vc3QgZWFybHkgaW1wbGVtZW50YXRpb25zIGRvZXNuJ3Qgc3VwcG9ydHMgaXRlcmFibGVzLCBtb3N0IG1vZGVybiAtIG5vdCBjbG9zZSBpdCBjb3JyZWN0bHlcbiAgICB2YXIgQUNDRVBUX0lURVJBQkxFUyA9ICRpdGVyRGV0ZWN0KGZ1bmN0aW9uIChpdGVyKSB7IG5ldyBDKGl0ZXIpOyB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICAvLyBmb3IgZWFybHkgaW1wbGVtZW50YXRpb25zIC0wIGFuZCArMCBub3QgdGhlIHNhbWVcbiAgICB2YXIgQlVHR1lfWkVSTyA9ICFJU19XRUFLICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFY4IH4gQ2hyb21pdW0gNDItIGZhaWxzIG9ubHkgd2l0aCA1KyBlbGVtZW50c1xuICAgICAgdmFyICRpbnN0YW5jZSA9IG5ldyBDKCk7XG4gICAgICB2YXIgaW5kZXggPSA1O1xuICAgICAgd2hpbGUgKGluZGV4LS0pICRpbnN0YW5jZVtBRERFUl0oaW5kZXgsIGluZGV4KTtcbiAgICAgIHJldHVybiAhJGluc3RhbmNlLmhhcygtMCk7XG4gICAgfSk7XG4gICAgaWYgKCFBQ0NFUFRfSVRFUkFCTEVTKSB7XG4gICAgICBDID0gd3JhcHBlcihmdW5jdGlvbiAodGFyZ2V0LCBpdGVyYWJsZSkge1xuICAgICAgICBhbkluc3RhbmNlKHRhcmdldCwgQywgTkFNRSk7XG4gICAgICAgIHZhciB0aGF0ID0gaW5oZXJpdElmUmVxdWlyZWQobmV3IEJhc2UoKSwgdGFyZ2V0LCBDKTtcbiAgICAgICAgaWYgKGl0ZXJhYmxlICE9IHVuZGVmaW5lZCkgZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xuICAgICAgICByZXR1cm4gdGhhdDtcbiAgICAgIH0pO1xuICAgICAgQy5wcm90b3R5cGUgPSBwcm90bztcbiAgICAgIHByb3RvLmNvbnN0cnVjdG9yID0gQztcbiAgICB9XG4gICAgaWYgKFRIUk9XU19PTl9QUklNSVRJVkVTIHx8IEJVR0dZX1pFUk8pIHtcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xuICAgICAgSVNfTUFQICYmIGZpeE1ldGhvZCgnZ2V0Jyk7XG4gICAgfVxuICAgIGlmIChCVUdHWV9aRVJPIHx8IEhBU05UX0NIQUlOSU5HKSBmaXhNZXRob2QoQURERVIpO1xuICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgc2hvdWxkIG5vdCBjb250YWlucyAuY2xlYXIgbWV0aG9kXG4gICAgaWYgKElTX1dFQUsgJiYgcHJvdG8uY2xlYXIpIGRlbGV0ZSBwcm90by5jbGVhcjtcbiAgfVxuXG4gIHNldFRvU3RyaW5nVGFnKEMsIE5BTUUpO1xuXG4gIE9bTkFNRV0gPSBDO1xuICAkZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqIChDICE9IEJhc2UpLCBPKTtcblxuICBpZiAoIUlTX1dFQUspIGNvbW1vbi5zZXRTdHJvbmcoQywgTkFNRSwgSVNfTUFQKTtcblxuICByZXR1cm4gQztcbn07XG4iLCJ2YXIgY29yZSA9IG1vZHVsZS5leHBvcnRzID0geyB2ZXJzaW9uOiAnMi42LjUnIH07XG5pZiAodHlwZW9mIF9fZSA9PSAnbnVtYmVyJykgX19lID0gY29yZTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG9iamVjdCwgaW5kZXgsIHZhbHVlKSB7XG4gIGlmIChpbmRleCBpbiBvYmplY3QpICRkZWZpbmVQcm9wZXJ0eS5mKG9iamVjdCwgaW5kZXgsIGNyZWF0ZURlc2MoMCwgdmFsdWUpKTtcbiAgZWxzZSBvYmplY3RbaW5kZXhdID0gdmFsdWU7XG59O1xuIiwiLy8gb3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi9fYS1mdW5jdGlvbicpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIHRoYXQsIGxlbmd0aCkge1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZiAodGhhdCA9PT0gdW5kZWZpbmVkKSByZXR1cm4gZm47XG4gIHN3aXRjaCAobGVuZ3RoKSB7XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiLy8gNy4yLjEgUmVxdWlyZU9iamVjdENvZXJjaWJsZShhcmd1bWVudClcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCA9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsIi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgZG9jdW1lbnQgPSByZXF1aXJlKCcuL19nbG9iYWwnKS5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIGlzID0gaXNPYmplY3QoZG9jdW1lbnQpICYmIGlzT2JqZWN0KGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07XG4iLCIvLyBJRSA4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IChcbiAgJ2NvbnN0cnVjdG9yLGhhc093blByb3BlcnR5LGlzUHJvdG90eXBlT2YscHJvcGVydHlJc0VudW1lcmFibGUsdG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZidcbikuc3BsaXQoJywnKTtcbiIsIi8vIGFsbCBlbnVtZXJhYmxlIG9iamVjdCBrZXlzLCBpbmNsdWRlcyBzeW1ib2xzXG52YXIgZ2V0S2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJyk7XG52YXIgZ09QUyA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJyk7XG52YXIgcElFID0gcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHJlc3VsdCA9IGdldEtleXMoaXQpO1xuICB2YXIgZ2V0U3ltYm9scyA9IGdPUFMuZjtcbiAgaWYgKGdldFN5bWJvbHMpIHtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpO1xuICAgIHZhciBpc0VudW0gPSBwSUUuZjtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIGtleTtcbiAgICB3aGlsZSAoc3ltYm9scy5sZW5ndGggPiBpKSBpZiAoaXNFbnVtLmNhbGwoaXQsIGtleSA9IHN5bWJvbHNbaSsrXSkpIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY29yZSA9IHJlcXVpcmUoJy4vX2NvcmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbiAodHlwZSwgbmFtZSwgc291cmNlKSB7XG4gIHZhciBJU19GT1JDRUQgPSB0eXBlICYgJGV4cG9ydC5GO1xuICB2YXIgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuRztcbiAgdmFyIElTX1NUQVRJQyA9IHR5cGUgJiAkZXhwb3J0LlM7XG4gIHZhciBJU19QUk9UTyA9IHR5cGUgJiAkZXhwb3J0LlA7XG4gIHZhciBJU19CSU5EID0gdHlwZSAmICRleHBvcnQuQjtcbiAgdmFyIHRhcmdldCA9IElTX0dMT0JBTCA/IGdsb2JhbCA6IElTX1NUQVRJQyA/IGdsb2JhbFtuYW1lXSB8fCAoZ2xvYmFsW25hbWVdID0ge30pIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXTtcbiAgdmFyIGV4cG9ydHMgPSBJU19HTE9CQUwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcbiAgdmFyIGV4cFByb3RvID0gZXhwb3J0c1tQUk9UT1RZUEVdIHx8IChleHBvcnRzW1BST1RPVFlQRV0gPSB7fSk7XG4gIHZhciBrZXksIG93biwgb3V0LCBleHA7XG4gIGlmIChJU19HTE9CQUwpIHNvdXJjZSA9IG5hbWU7XG4gIGZvciAoa2V5IGluIHNvdXJjZSkge1xuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxuICAgIG93biA9ICFJU19GT1JDRUQgJiYgdGFyZ2V0ICYmIHRhcmdldFtrZXldICE9PSB1bmRlZmluZWQ7XG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xuICAgIC8vIGJpbmQgdGltZXJzIHRvIGdsb2JhbCBmb3IgY2FsbCBmcm9tIGV4cG9ydCBjb250ZXh0XG4gICAgZXhwID0gSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpIDogSVNfUFJPVE8gJiYgdHlwZW9mIG91dCA9PSAnZnVuY3Rpb24nID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XG4gICAgLy8gZXh0ZW5kIGdsb2JhbFxuICAgIGlmICh0YXJnZXQpIHJlZGVmaW5lKHRhcmdldCwga2V5LCBvdXQsIHR5cGUgJiAkZXhwb3J0LlUpO1xuICAgIC8vIGV4cG9ydFxuICAgIGlmIChleHBvcnRzW2tleV0gIT0gb3V0KSBoaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcbiAgICBpZiAoSVNfUFJPVE8gJiYgZXhwUHJvdG9ba2V5XSAhPSBvdXQpIGV4cFByb3RvW2tleV0gPSBvdXQ7XG4gIH1cbn07XG5nbG9iYWwuY29yZSA9IGNvcmU7XG4vLyB0eXBlIGJpdG1hcFxuJGV4cG9ydC5GID0gMTsgICAvLyBmb3JjZWRcbiRleHBvcnQuRyA9IDI7ICAgLy8gZ2xvYmFsXG4kZXhwb3J0LlMgPSA0OyAgIC8vIHN0YXRpY1xuJGV4cG9ydC5QID0gODsgICAvLyBwcm90b1xuJGV4cG9ydC5CID0gMTY7ICAvLyBiaW5kXG4kZXhwb3J0LlcgPSAzMjsgIC8vIHdyYXBcbiRleHBvcnQuVSA9IDY0OyAgLy8gc2FmZVxuJGV4cG9ydC5SID0gMTI4OyAvLyByZWFsIHByb3RvIG1ldGhvZCBmb3IgYGxpYnJhcnlgXG5tb2R1bGUuZXhwb3J0cyA9ICRleHBvcnQ7XG4iLCJ2YXIgTUFUQ0ggPSByZXF1aXJlKCcuL193a3MnKSgnbWF0Y2gnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSkge1xuICB2YXIgcmUgPSAvLi87XG4gIHRyeSB7XG4gICAgJy8uLydbS0VZXShyZSk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICB0cnkge1xuICAgICAgcmVbTUFUQ0hdID0gZmFsc2U7XG4gICAgICByZXR1cm4gIScvLi8nW0tFWV0ocmUpO1xuICAgIH0gY2F0Y2ggKGYpIHsgLyogZW1wdHkgKi8gfVxuICB9IHJldHVybiB0cnVlO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnJlcXVpcmUoJy4vZXM2LnJlZ2V4cC5leGVjJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuL19yZWRlZmluZScpO1xudmFyIGhpZGUgPSByZXF1aXJlKCcuL19oaWRlJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG52YXIgd2tzID0gcmVxdWlyZSgnLi9fd2tzJyk7XG52YXIgcmVnZXhwRXhlYyA9IHJlcXVpcmUoJy4vX3JlZ2V4cC1leGVjJyk7XG5cbnZhciBTUEVDSUVTID0gd2tzKCdzcGVjaWVzJyk7XG5cbnZhciBSRVBMQUNFX1NVUFBPUlRTX05BTUVEX0dST1VQUyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vICNyZXBsYWNlIG5lZWRzIGJ1aWx0LWluIHN1cHBvcnQgZm9yIG5hbWVkIGdyb3Vwcy5cbiAgLy8gI21hdGNoIHdvcmtzIGZpbmUgYmVjYXVzZSBpdCBqdXN0IHJldHVybiB0aGUgZXhlYyByZXN1bHRzLCBldmVuIGlmIGl0IGhhc1xuICAvLyBhIFwiZ3JvcHNcIiBwcm9wZXJ0eS5cbiAgdmFyIHJlID0gLy4vO1xuICByZS5leGVjID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICByZXN1bHQuZ3JvdXBzID0geyBhOiAnNycgfTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICByZXR1cm4gJycucmVwbGFjZShyZSwgJyQ8YT4nKSAhPT0gJzcnO1xufSk7XG5cbnZhciBTUExJVF9XT1JLU19XSVRIX09WRVJXUklUVEVOX0VYRUMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBDaHJvbWUgNTEgaGFzIGEgYnVnZ3kgXCJzcGxpdFwiIGltcGxlbWVudGF0aW9uIHdoZW4gUmVnRXhwI2V4ZWMgIT09IG5hdGl2ZUV4ZWNcbiAgdmFyIHJlID0gLyg/OikvO1xuICB2YXIgb3JpZ2luYWxFeGVjID0gcmUuZXhlYztcbiAgcmUuZXhlYyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIG9yaWdpbmFsRXhlYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpOyB9O1xuICB2YXIgcmVzdWx0ID0gJ2FiJy5zcGxpdChyZSk7XG4gIHJldHVybiByZXN1bHQubGVuZ3RoID09PSAyICYmIHJlc3VsdFswXSA9PT0gJ2EnICYmIHJlc3VsdFsxXSA9PT0gJ2InO1xufSkoKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoS0VZLCBsZW5ndGgsIGV4ZWMpIHtcbiAgdmFyIFNZTUJPTCA9IHdrcyhLRVkpO1xuXG4gIHZhciBERUxFR0FURVNfVE9fU1lNQk9MID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAvLyBTdHJpbmcgbWV0aG9kcyBjYWxsIHN5bWJvbC1uYW1lZCBSZWdFcCBtZXRob2RzXG4gICAgdmFyIE8gPSB7fTtcbiAgICBPW1NZTUJPTF0gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9O1xuICAgIHJldHVybiAnJ1tLRVldKE8pICE9IDc7XG4gIH0pO1xuXG4gIHZhciBERUxFR0FURVNfVE9fRVhFQyA9IERFTEVHQVRFU19UT19TWU1CT0wgPyAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIFN5bWJvbC1uYW1lZCBSZWdFeHAgbWV0aG9kcyBjYWxsIC5leGVjXG4gICAgdmFyIGV4ZWNDYWxsZWQgPSBmYWxzZTtcbiAgICB2YXIgcmUgPSAvYS87XG4gICAgcmUuZXhlYyA9IGZ1bmN0aW9uICgpIHsgZXhlY0NhbGxlZCA9IHRydWU7IHJldHVybiBudWxsOyB9O1xuICAgIGlmIChLRVkgPT09ICdzcGxpdCcpIHtcbiAgICAgIC8vIFJlZ0V4cFtAQHNwbGl0XSBkb2Vzbid0IGNhbGwgdGhlIHJlZ2V4J3MgZXhlYyBtZXRob2QsIGJ1dCBmaXJzdCBjcmVhdGVzXG4gICAgICAvLyBhIG5ldyBvbmUuIFdlIG5lZWQgdG8gcmV0dXJuIHRoZSBwYXRjaGVkIHJlZ2V4IHdoZW4gY3JlYXRpbmcgdGhlIG5ldyBvbmUuXG4gICAgICByZS5jb25zdHJ1Y3RvciA9IHt9O1xuICAgICAgcmUuY29uc3RydWN0b3JbU1BFQ0lFU10gPSBmdW5jdGlvbiAoKSB7IHJldHVybiByZTsgfTtcbiAgICB9XG4gICAgcmVbU1lNQk9MXSgnJyk7XG4gICAgcmV0dXJuICFleGVjQ2FsbGVkO1xuICB9KSA6IHVuZGVmaW5lZDtcblxuICBpZiAoXG4gICAgIURFTEVHQVRFU19UT19TWU1CT0wgfHxcbiAgICAhREVMRUdBVEVTX1RPX0VYRUMgfHxcbiAgICAoS0VZID09PSAncmVwbGFjZScgJiYgIVJFUExBQ0VfU1VQUE9SVFNfTkFNRURfR1JPVVBTKSB8fFxuICAgIChLRVkgPT09ICdzcGxpdCcgJiYgIVNQTElUX1dPUktTX1dJVEhfT1ZFUldSSVRURU5fRVhFQylcbiAgKSB7XG4gICAgdmFyIG5hdGl2ZVJlZ0V4cE1ldGhvZCA9IC8uL1tTWU1CT0xdO1xuICAgIHZhciBmbnMgPSBleGVjKFxuICAgICAgZGVmaW5lZCxcbiAgICAgIFNZTUJPTCxcbiAgICAgICcnW0tFWV0sXG4gICAgICBmdW5jdGlvbiBtYXliZUNhbGxOYXRpdmUobmF0aXZlTWV0aG9kLCByZWdleHAsIHN0ciwgYXJnMiwgZm9yY2VTdHJpbmdNZXRob2QpIHtcbiAgICAgICAgaWYgKHJlZ2V4cC5leGVjID09PSByZWdleHBFeGVjKSB7XG4gICAgICAgICAgaWYgKERFTEVHQVRFU19UT19TWU1CT0wgJiYgIWZvcmNlU3RyaW5nTWV0aG9kKSB7XG4gICAgICAgICAgICAvLyBUaGUgbmF0aXZlIFN0cmluZyBtZXRob2QgYWxyZWFkeSBkZWxlZ2F0ZXMgdG8gQEBtZXRob2QgKHRoaXNcbiAgICAgICAgICAgIC8vIHBvbHlmaWxsZWQgZnVuY3Rpb24pLCBsZWFzaW5nIHRvIGluZmluaXRlIHJlY3Vyc2lvbi5cbiAgICAgICAgICAgIC8vIFdlIGF2b2lkIGl0IGJ5IGRpcmVjdGx5IGNhbGxpbmcgdGhlIG5hdGl2ZSBAQG1ldGhvZCBtZXRob2QuXG4gICAgICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogbmF0aXZlUmVnRXhwTWV0aG9kLmNhbGwocmVnZXhwLCBzdHIsIGFyZzIpIH07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiBuYXRpdmVNZXRob2QuY2FsbChzdHIsIHJlZ2V4cCwgYXJnMikgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBkb25lOiBmYWxzZSB9O1xuICAgICAgfVxuICAgICk7XG4gICAgdmFyIHN0cmZuID0gZm5zWzBdO1xuICAgIHZhciByeGZuID0gZm5zWzFdO1xuXG4gICAgcmVkZWZpbmUoU3RyaW5nLnByb3RvdHlwZSwgS0VZLCBzdHJmbik7XG4gICAgaGlkZShSZWdFeHAucHJvdG90eXBlLCBTWU1CT0wsIGxlbmd0aCA9PSAyXG4gICAgICAvLyAyMS4yLjUuOCBSZWdFeHAucHJvdG90eXBlW0BAcmVwbGFjZV0oc3RyaW5nLCByZXBsYWNlVmFsdWUpXG4gICAgICAvLyAyMS4yLjUuMTEgUmVnRXhwLnByb3RvdHlwZVtAQHNwbGl0XShzdHJpbmcsIGxpbWl0KVxuICAgICAgPyBmdW5jdGlvbiAoc3RyaW5nLCBhcmcpIHsgcmV0dXJuIHJ4Zm4uY2FsbChzdHJpbmcsIHRoaXMsIGFyZyk7IH1cbiAgICAgIC8vIDIxLjIuNS42IFJlZ0V4cC5wcm90b3R5cGVbQEBtYXRjaF0oc3RyaW5nKVxuICAgICAgLy8gMjEuMi41LjkgUmVnRXhwLnByb3RvdHlwZVtAQHNlYXJjaF0oc3RyaW5nKVxuICAgICAgOiBmdW5jdGlvbiAoc3RyaW5nKSB7IHJldHVybiByeGZuLmNhbGwoc3RyaW5nLCB0aGlzKTsgfVxuICAgICk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAyMS4yLjUuMyBnZXQgUmVnRXhwLnByb3RvdHlwZS5mbGFnc1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIHRoYXQgPSBhbk9iamVjdCh0aGlzKTtcbiAgdmFyIHJlc3VsdCA9ICcnO1xuICBpZiAodGhhdC5nbG9iYWwpIHJlc3VsdCArPSAnZyc7XG4gIGlmICh0aGF0Lmlnbm9yZUNhc2UpIHJlc3VsdCArPSAnaSc7XG4gIGlmICh0aGF0Lm11bHRpbGluZSkgcmVzdWx0ICs9ICdtJztcbiAgaWYgKHRoYXQudW5pY29kZSkgcmVzdWx0ICs9ICd1JztcbiAgaWYgKHRoYXQuc3RpY2t5KSByZXN1bHQgKz0gJ3knO1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG52YXIgQlJFQUsgPSB7fTtcbnZhciBSRVRVUk4gPSB7fTtcbnZhciBleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0LCBJVEVSQVRPUikge1xuICB2YXIgaXRlckZuID0gSVRFUkFUT1IgPyBmdW5jdGlvbiAoKSB7IHJldHVybiBpdGVyYWJsZTsgfSA6IGdldEl0ZXJGbihpdGVyYWJsZSk7XG4gIHZhciBmID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGVuZ3RoLCBzdGVwLCBpdGVyYXRvciwgcmVzdWx0O1xuICBpZiAodHlwZW9mIGl0ZXJGbiAhPSAnZnVuY3Rpb24nKSB0aHJvdyBUeXBlRXJyb3IoaXRlcmFibGUgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgLy8gZmFzdCBjYXNlIGZvciBhcnJheXMgd2l0aCBkZWZhdWx0IGl0ZXJhdG9yXG4gIGlmIChpc0FycmF5SXRlcihpdGVyRm4pKSBmb3IgKGxlbmd0aCA9IHRvTGVuZ3RoKGl0ZXJhYmxlLmxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgcmVzdWx0ID0gZW50cmllcyA/IGYoYW5PYmplY3Qoc3RlcCA9IGl0ZXJhYmxlW2luZGV4XSlbMF0sIHN0ZXBbMV0pIDogZihpdGVyYWJsZVtpbmRleF0pO1xuICAgIGlmIChyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKSByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2UgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKGl0ZXJhYmxlKTsgIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lOykge1xuICAgIHJlc3VsdCA9IGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpO1xuICAgIGlmIChyZXN1bHQgPT09IEJSRUFLIHx8IHJlc3VsdCA9PT0gUkVUVVJOKSByZXR1cm4gcmVzdWx0O1xuICB9XG59O1xuZXhwb3J0cy5CUkVBSyA9IEJSRUFLO1xuZXhwb3J0cy5SRVRVUk4gPSBSRVRVUk47XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpKCduYXRpdmUtZnVuY3Rpb24tdG8tc3RyaW5nJywgRnVuY3Rpb24udG9TdHJpbmcpO1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzg2I2lzc3VlY29tbWVudC0xMTU3NTkwMjhcbnZhciBnbG9iYWwgPSBtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgIT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93Lk1hdGggPT0gTWF0aFxuICA/IHdpbmRvdyA6IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnICYmIHNlbGYuTWF0aCA9PSBNYXRoID8gc2VsZlxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmNcbiAgOiBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuaWYgKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpIF9fZyA9IGdsb2JhbDsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bmRlZlxuIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xufTtcbiIsInZhciBkUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gIHJldHVybiBkUC5mKG9iamVjdCwga2V5LCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG59IDogZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSkge1xuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xuICByZXR1cm4gb2JqZWN0O1xufTtcbiIsInZhciBkb2N1bWVudCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLmRvY3VtZW50O1xubW9kdWxlLmV4cG9ydHMgPSBkb2N1bWVudCAmJiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4iLCJtb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpICYmICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pLmEgIT0gNztcbn0pO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXQ7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0aGF0LCB0YXJnZXQsIEMpIHtcbiAgdmFyIFMgPSB0YXJnZXQuY29uc3RydWN0b3I7XG4gIHZhciBQO1xuICBpZiAoUyAhPT0gQyAmJiB0eXBlb2YgUyA9PSAnZnVuY3Rpb24nICYmIChQID0gUy5wcm90b3R5cGUpICE9PSBDLnByb3RvdHlwZSAmJiBpc09iamVjdChQKSAmJiBzZXRQcm90b3R5cGVPZikge1xuICAgIHNldFByb3RvdHlwZU9mKHRoYXQsIFApO1xuICB9IHJldHVybiB0aGF0O1xufTtcbiIsIi8vIGZhc3QgYXBwbHksIGh0dHA6Ly9qc3BlcmYubG5raXQuY29tL2Zhc3QtYXBwbHkvNVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZm4sIGFyZ3MsIHRoYXQpIHtcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOiByZXR1cm4gdW4gPyBmbigpXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQpO1xuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSk7XG4gICAgY2FzZSAyOiByZXR1cm4gdW4gPyBmbihhcmdzWzBdLCBhcmdzWzFdKVxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcbiAgICBjYXNlIDM6IHJldHVybiB1biA/IGZuKGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pXG4gICAgICAgICAgICAgICAgICAgICAgOiBmbi5jYWxsKHRoYXQsIGFyZ3NbMF0sIGFyZ3NbMV0sIGFyZ3NbMl0pO1xuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcbiAgICAgICAgICAgICAgICAgICAgICA6IGZuLmNhbGwodGhhdCwgYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSk7XG4gIH0gcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xufTtcbiIsIi8vIGZhbGxiYWNrIGZvciBub24tYXJyYXktbGlrZSBFUzMgYW5kIG5vbi1lbnVtZXJhYmxlIG9sZCBWOCBzdHJpbmdzXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdCgneicpLnByb3BlcnR5SXNFbnVtZXJhYmxlKDApID8gT2JqZWN0IDogZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07XG4iLCIvLyBjaGVjayBvbiBkZWZhdWx0IEFycmF5IGl0ZXJhdG9yXG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvID0gQXJyYXkucHJvdG90eXBlO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgIT09IHVuZGVmaW5lZCAmJiAoSXRlcmF0b3JzLkFycmF5ID09PSBpdCB8fCBBcnJheVByb3RvW0lURVJBVE9SXSA9PT0gaXQpO1xufTtcbiIsIi8vIDcuMi4yIElzQXJyYXkoYXJndW1lbnQpXG52YXIgY29mID0gcmVxdWlyZSgnLi9fY29mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpIHtcbiAgcmV0dXJuIGNvZihhcmcpID09ICdBcnJheSc7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCIvLyA3LjIuOCBJc1JlZ0V4cChhcmd1bWVudClcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIGNvZiA9IHJlcXVpcmUoJy4vX2NvZicpO1xudmFyIE1BVENIID0gcmVxdWlyZSgnLi9fd2tzJykoJ21hdGNoJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgaXNSZWdFeHA7XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgKChpc1JlZ0V4cCA9IGl0W01BVENIXSkgIT09IHVuZGVmaW5lZCA/ICEhaXNSZWdFeHAgOiBjb2YoaXQpID09ICdSZWdFeHAnKTtcbn07XG4iLCIvLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZXJhdG9yLCBmbiwgdmFsdWUsIGVudHJpZXMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZW50cmllcyA/IGZuKGFuT2JqZWN0KHZhbHVlKVswXSwgdmFsdWVbMV0pIDogZm4odmFsdWUpO1xuICAvLyA3LjQuNiBJdGVyYXRvckNsb3NlKGl0ZXJhdG9yLCBjb21wbGV0aW9uKVxuICB9IGNhdGNoIChlKSB7XG4gICAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcbiAgICBpZiAocmV0ICE9PSB1bmRlZmluZWQpIGFuT2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XG4gICAgdGhyb3cgZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyk7XG52YXIgZGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogZGVzY3JpcHRvcigxLCBuZXh0KSB9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyICRpdGVyQ3JlYXRlID0gcmVxdWlyZSgnLi9faXRlci1jcmVhdGUnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBCVUdHWSA9ICEoW10ua2V5cyAmJiAnbmV4dCcgaW4gW10ua2V5cygpKTsgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxudmFyIEZGX0lURVJBVE9SID0gJ0BAaXRlcmF0b3InO1xudmFyIEtFWVMgPSAna2V5cyc7XG52YXIgVkFMVUVTID0gJ3ZhbHVlcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQmFzZSwgTkFNRSwgQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uIChraW5kKSB7XG4gICAgaWYgKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKSByZXR1cm4gcHJvdG9ba2luZF07XG4gICAgc3dpdGNoIChraW5kKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgICAgY2FzZSBWQUxVRVM6IHJldHVybiBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgfSByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgdmFyIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFUztcbiAgdmFyIFZBTFVFU19CVUcgPSBmYWxzZTtcbiAgdmFyIHByb3RvID0gQmFzZS5wcm90b3R5cGU7XG4gIHZhciAkbmF0aXZlID0gcHJvdG9bSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdO1xuICB2YXIgJGRlZmF1bHQgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKTtcbiAgdmFyICRlbnRyaWVzID0gREVGQVVMVCA/ICFERUZfVkFMVUVTID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoJ2VudHJpZXMnKSA6IHVuZGVmaW5lZDtcbiAgdmFyICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlO1xuICB2YXIgbWV0aG9kcywga2V5LCBJdGVyYXRvclByb3RvdHlwZTtcbiAgLy8gRml4IG5hdGl2ZVxuICBpZiAoJGFueU5hdGl2ZSkge1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKCkpKTtcbiAgICBpZiAoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUgJiYgSXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmICghTElCUkFSWSAmJiB0eXBlb2YgSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIGhpZGUoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SLCByZXR1cm5UaGlzKTtcbiAgICB9XG4gIH1cbiAgLy8gZml4IEFycmF5I3t2YWx1ZXMsIEBAaXRlcmF0b3J9Lm5hbWUgaW4gVjggLyBGRlxuICBpZiAoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKSB7XG4gICAgVkFMVUVTX0JVRyA9IHRydWU7XG4gICAgJGRlZmF1bHQgPSBmdW5jdGlvbiB2YWx1ZXMoKSB7IHJldHVybiAkbmF0aXZlLmNhbGwodGhpcyk7IH07XG4gIH1cbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXG4gIGlmICgoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSkge1xuICAgIGhpZGUocHJvdG8sIElURVJBVE9SLCAkZGVmYXVsdCk7XG4gIH1cbiAgLy8gUGx1ZyBmb3IgbGlicmFyeVxuICBJdGVyYXRvcnNbTkFNRV0gPSAkZGVmYXVsdDtcbiAgSXRlcmF0b3JzW1RBR10gPSByZXR1cm5UaGlzO1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IERFRl9WQUxVRVMgPyAkZGVmYXVsdCA6IGdldE1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYgKEZPUkNFRCkgZm9yIChrZXkgaW4gbWV0aG9kcykge1xuICAgICAgaWYgKCEoa2V5IGluIHByb3RvKSkgcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTtcbiIsInZhciBJVEVSQVRPUiA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgcml0ZXIgPSBbN11bSVRFUkFUT1JdKCk7XG4gIHJpdGVyWydyZXR1cm4nXSA9IGZ1bmN0aW9uICgpIHsgU0FGRV9DTE9TSU5HID0gdHJ1ZTsgfTtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXRocm93LWxpdGVyYWxcbiAgQXJyYXkuZnJvbShyaXRlciwgZnVuY3Rpb24gKCkgeyB0aHJvdyAyOyB9KTtcbn0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBza2lwQ2xvc2luZykge1xuICBpZiAoIXNraXBDbG9zaW5nICYmICFTQUZFX0NMT1NJTkcpIHJldHVybiBmYWxzZTtcbiAgdmFyIHNhZmUgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgYXJyID0gWzddO1xuICAgIHZhciBpdGVyID0gYXJyW0lURVJBVE9SXSgpO1xuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHsgZG9uZTogc2FmZSA9IHRydWUgfTsgfTtcbiAgICBhcnJbSVRFUkFUT1JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gaXRlcjsgfTtcbiAgICBleGVjKGFycik7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gc2FmZTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChkb25lLCB2YWx1ZSkge1xuICByZXR1cm4geyB2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZSB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge307XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwidmFyIE1FVEEgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgc2V0RGVzYyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG52YXIgaWQgPSAwO1xudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24gKCkge1xuICByZXR1cm4gaXNFeHRlbnNpYmxlKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyh7fSkpO1xufSk7XG52YXIgc2V0TWV0YSA9IGZ1bmN0aW9uIChpdCkge1xuICBzZXREZXNjKGl0LCBNRVRBLCB7IHZhbHVlOiB7XG4gICAgaTogJ08nICsgKytpZCwgLy8gb2JqZWN0IElEXG4gICAgdzoge30gICAgICAgICAgLy8gd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSB9KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcbiAgaWYgKCFpc09iamVjdChpdCkpIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCcgPyBpdCA6ICh0eXBlb2YgaXQgPT0gJ3N0cmluZycgPyAnUycgOiAnUCcpICsgaXQ7XG4gIGlmICghaGFzKGl0LCBNRVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhKGl0KTtcbiAgLy8gcmV0dXJuIG9iamVjdCBJRFxuICB9IHJldHVybiBpdFtNRVRBXS5pO1xufTtcbnZhciBnZXRXZWFrID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgaWYgKCFoYXMoaXQsIE1FVEEpKSB7XG4gICAgLy8gY2FuJ3Qgc2V0IG1ldGFkYXRhIHRvIHVuY2F1Z2h0IGZyb3plbiBvYmplY3RcbiAgICBpZiAoIWlzRXh0ZW5zaWJsZShpdCkpIHJldHVybiB0cnVlO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpIHNldE1ldGEoaXQpO1xuICByZXR1cm4gaXQ7XG59O1xudmFyIG1ldGEgPSBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgS0VZOiBNRVRBLFxuICBORUVEOiBmYWxzZSxcbiAgZmFzdEtleTogZmFzdEtleSxcbiAgZ2V0V2VhazogZ2V0V2VhayxcbiAgb25GcmVlemU6IG9uRnJlZXplXG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpO1xudmFyIG1hY3JvdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgT2JzZXJ2ZXIgPSBnbG9iYWwuTXV0YXRpb25PYnNlcnZlciB8fCBnbG9iYWwuV2ViS2l0TXV0YXRpb25PYnNlcnZlcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgUHJvbWlzZSA9IGdsb2JhbC5Qcm9taXNlO1xudmFyIGlzTm9kZSA9IHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBoZWFkLCBsYXN0LCBub3RpZnk7XG5cbiAgdmFyIGZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmIChpc05vZGUgJiYgKHBhcmVudCA9IHByb2Nlc3MuZG9tYWluKSkgcGFyZW50LmV4aXQoKTtcbiAgICB3aGlsZSAoaGVhZCkge1xuICAgICAgZm4gPSBoZWFkLmZuO1xuICAgICAgaGVhZCA9IGhlYWQubmV4dDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGZuKCk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGlmIChoZWFkKSBub3RpZnkoKTtcbiAgICAgICAgZWxzZSBsYXN0ID0gdW5kZWZpbmVkO1xuICAgICAgICB0aHJvdyBlO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBOb2RlLmpzXG4gIGlmIChpc05vZGUpIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXIsIGV4Y2VwdCBpT1MgU2FmYXJpIC0gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzMzOVxuICB9IGVsc2UgaWYgKE9ic2VydmVyICYmICEoZ2xvYmFsLm5hdmlnYXRvciAmJiBnbG9iYWwubmF2aWdhdG9yLnN0YW5kYWxvbmUpKSB7XG4gICAgdmFyIHRvZ2dsZSA9IHRydWU7XG4gICAgdmFyIG5vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnJyk7XG4gICAgbmV3IE9ic2VydmVyKGZsdXNoKS5vYnNlcnZlKG5vZGUsIHsgY2hhcmFjdGVyRGF0YTogdHJ1ZSB9KTsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBub2RlLmRhdGEgPSB0b2dnbGUgPSAhdG9nZ2xlO1xuICAgIH07XG4gIC8vIGVudmlyb25tZW50cyB3aXRoIG1heWJlIG5vbi1jb21wbGV0ZWx5IGNvcnJlY3QsIGJ1dCBleGlzdGVudCBQcm9taXNlXG4gIH0gZWxzZSBpZiAoUHJvbWlzZSAmJiBQcm9taXNlLnJlc29sdmUpIHtcbiAgICAvLyBQcm9taXNlLnJlc29sdmUgd2l0aG91dCBhbiBhcmd1bWVudCB0aHJvd3MgYW4gZXJyb3IgaW4gTEcgV2ViT1MgMlxuICAgIHZhciBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgcHJvbWlzZS50aGVuKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICB2YXIgdGFzayA9IHsgZm46IGZuLCBuZXh0OiB1bmRlZmluZWQgfTtcbiAgICBpZiAobGFzdCkgbGFzdC5uZXh0ID0gdGFzaztcbiAgICBpZiAoIWhlYWQpIHtcbiAgICAgIGhlYWQgPSB0YXNrO1xuICAgICAgbm90aWZ5KCk7XG4gICAgfSBsYXN0ID0gdGFzaztcbiAgfTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyAyNS40LjEuNSBOZXdQcm9taXNlQ2FwYWJpbGl0eShDKVxudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcblxuZnVuY3Rpb24gUHJvbWlzZUNhcGFiaWxpdHkoQykge1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbiAoJCRyZXNvbHZlLCAkJHJlamVjdCkge1xuICAgIGlmIChyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCA9IGFGdW5jdGlvbihyZWplY3QpO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gKEMpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlQ2FwYWJpbGl0eShDKTtcbn07XG4iLCIvLyAxOS4xLjIuMiAvIDE1LjIuMy41IE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGRQcyA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcbnZhciBJRV9QUk9UTyA9IHJlcXVpcmUoJy4vX3NoYXJlZC1rZXknKSgnSUVfUFJPVE8nKTtcbnZhciBFbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbiAoKSB7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpO1xuICB2YXIgaSA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgdmFyIGx0ID0gJzwnO1xuICB2YXIgZ3QgPSAnPic7XG4gIHZhciBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZSAoaS0tKSBkZWxldGUgY3JlYXRlRGljdFtQUk9UT1RZUEVdW2VudW1CdWdLZXlzW2ldXTtcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmNyZWF0ZSB8fCBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICB2YXIgcmVzdWx0O1xuICBpZiAoTyAhPT0gbnVsbCkge1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHkoKTtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gbnVsbDtcbiAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHBvbHlmaWxsXG4gICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XG4gIH0gZWxzZSByZXN1bHQgPSBjcmVhdGVEaWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkUHMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcbnZhciBkUCA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIFAgPSB0b1ByaW1pdGl2ZShQLCB0cnVlKTtcbiAgYW5PYmplY3QoQXR0cmlidXRlcyk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZFAoTywgUCwgQXR0cmlidXRlcyk7XG4gIH0gY2F0Y2ggKGUpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkIScpO1xuICBpZiAoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKSBPW1BdID0gQXR0cmlidXRlcy52YWx1ZTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaSA9IDA7XG4gIHZhciBQO1xuICB3aGlsZSAobGVuZ3RoID4gaSkgZFAuZihPLCBQID0ga2V5c1tpKytdLCBQcm9wZXJ0aWVzW1BdKTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIHBJRSA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbnZhciBjcmVhdGVEZXNjID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi9faWU4LWRvbS1kZWZpbmUnKTtcbnZhciBnT1BEID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSA/IGdPUEQgOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCkge1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmIChJRThfRE9NX0RFRklORSkgdHJ5IHtcbiAgICByZXR1cm4gZ09QRChPLCBQKTtcbiAgfSBjYXRjaCAoZSkgeyAvKiBlbXB0eSAqLyB9XG4gIGlmIChoYXMoTywgUCkpIHJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07XG4iLCIvLyBmYWxsYmFjayBmb3IgSUUxMSBidWdneSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB3aXRoIGlmcmFtZSBhbmQgd2luZG93XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGdPUE4gPSByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmY7XG52YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxudmFyIHdpbmRvd05hbWVzID0gdHlwZW9mIHdpbmRvdyA9PSAnb2JqZWN0JyAmJiB3aW5kb3cgJiYgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXNcbiAgPyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh3aW5kb3cpIDogW107XG5cbnZhciBnZXRXaW5kb3dOYW1lcyA9IGZ1bmN0aW9uIChpdCkge1xuICB0cnkge1xuICAgIHJldHVybiBnT1BOKGl0KTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiB3aW5kb3dOYW1lcy5zbGljZSgpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCkge1xuICByZXR1cm4gd2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XScgPyBnZXRXaW5kb3dOYW1lcyhpdCkgOiBnT1BOKHRvSU9iamVjdChpdCkpO1xufTtcbiIsIi8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbnZhciAka2V5cyA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJyk7XG52YXIgaGlkZGVuS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKS5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgfHwgZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhPKSB7XG4gIHJldHVybiAka2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwiLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YgfHwgZnVuY3Rpb24gKE8pIHtcbiAgTyA9IHRvT2JqZWN0KE8pO1xuICBpZiAoaGFzKE8sIElFX1BST1RPKSkgcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZiAodHlwZW9mIE8uY29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiBPIGluc3RhbmNlb2YgTy5jb25zdHJ1Y3Rvcikge1xuICAgIHJldHVybiBPLmNvbnN0cnVjdG9yLnByb3RvdHlwZTtcbiAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi9faGFzJyk7XG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xudmFyIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpO1xudmFyIElFX1BST1RPID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIG5hbWVzKSB7XG4gIHZhciBPID0gdG9JT2JqZWN0KG9iamVjdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICB2YXIga2V5O1xuICBmb3IgKGtleSBpbiBPKSBpZiAoa2V5ICE9IElFX1BST1RPKSBoYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xuICAvLyBEb24ndCBlbnVtIGJ1ZyAmIGhpZGRlbiBrZXlzXG4gIHdoaWxlIChuYW1lcy5sZW5ndGggPiBpKSBpZiAoaGFzKE8sIGtleSA9IG5hbWVzW2krK10pKSB7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsIi8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuICRrZXlzKE8sIGVudW1CdWdLZXlzKTtcbn07XG4iLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiIsIi8vIG1vc3QgT2JqZWN0IG1ldGhvZHMgYnkgRVM2IHNob3VsZCBhY2NlcHQgcHJpbWl0aXZlc1xudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSwgZXhlYykge1xuICB2YXIgZm4gPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV07XG4gIHZhciBleHAgPSB7fTtcbiAgZXhwW0tFWV0gPSBleGVjKGZuKTtcbiAgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbiAoKSB7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59O1xuIiwidmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciBpc0VudW0gPSByZXF1aXJlKCcuL19vYmplY3QtcGllJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlzRW50cmllcykge1xuICByZXR1cm4gZnVuY3Rpb24gKGl0KSB7XG4gICAgdmFyIE8gPSB0b0lPYmplY3QoaXQpO1xuICAgIHZhciBrZXlzID0gZ2V0S2V5cyhPKTtcbiAgICB2YXIgbGVuZ3RoID0ga2V5cy5sZW5ndGg7XG4gICAgdmFyIGkgPSAwO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBpKSBpZiAoaXNFbnVtLmNhbGwoTywga2V5ID0ga2V5c1tpKytdKSkge1xuICAgICAgcmVzdWx0LnB1c2goaXNFbnRyaWVzID8gW2tleSwgT1trZXldXSA6IE9ba2V5XSk7XG4gICAgfSByZXR1cm4gcmVzdWx0O1xuICB9O1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4geyBlOiBmYWxzZSwgdjogZXhlYygpIH07XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4geyBlOiB0cnVlLCB2OiBlIH07XG4gIH1cbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gcmVxdWlyZSgnLi9fbmV3LXByb21pc2UtY2FwYWJpbGl0eScpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDLCB4KSB7XG4gIGFuT2JqZWN0KEMpO1xuICBpZiAoaXNPYmplY3QoeCkgJiYgeC5jb25zdHJ1Y3RvciA9PT0gQykgcmV0dXJuIHg7XG4gIHZhciBwcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5LmYoQyk7XG4gIHZhciByZXNvbHZlID0gcHJvbWlzZUNhcGFiaWxpdHkucmVzb2x2ZTtcbiAgcmVzb2x2ZSh4KTtcbiAgcmV0dXJuIHByb21pc2VDYXBhYmlsaXR5LnByb21pc2U7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYml0bWFwLCB2YWx1ZSkge1xuICByZXR1cm4ge1xuICAgIGVudW1lcmFibGU6ICEoYml0bWFwICYgMSksXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxuICAgIHdyaXRhYmxlOiAhKGJpdG1hcCAmIDQpLFxuICAgIHZhbHVlOiB2YWx1ZVxuICB9O1xufTtcbiIsInZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh0YXJnZXQsIHNyYywgc2FmZSkge1xuICBmb3IgKHZhciBrZXkgaW4gc3JjKSByZWRlZmluZSh0YXJnZXQsIGtleSwgc3JjW2tleV0sIHNhZmUpO1xuICByZXR1cm4gdGFyZ2V0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4vX2hhcycpO1xudmFyIFNSQyA9IHJlcXVpcmUoJy4vX3VpZCcpKCdzcmMnKTtcbnZhciAkdG9TdHJpbmcgPSByZXF1aXJlKCcuL19mdW5jdGlvbi10by1zdHJpbmcnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyIFRQTCA9ICgnJyArICR0b1N0cmluZykuc3BsaXQoVE9fU1RSSU5HKTtcblxucmVxdWlyZSgnLi9fY29yZScpLmluc3BlY3RTb3VyY2UgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuICR0b1N0cmluZy5jYWxsKGl0KTtcbn07XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChPLCBrZXksIHZhbCwgc2FmZSkge1xuICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiB2YWwgPT0gJ2Z1bmN0aW9uJztcbiAgaWYgKGlzRnVuY3Rpb24pIGhhcyh2YWwsICduYW1lJykgfHwgaGlkZSh2YWwsICduYW1lJywga2V5KTtcbiAgaWYgKE9ba2V5XSA9PT0gdmFsKSByZXR1cm47XG4gIGlmIChpc0Z1bmN0aW9uKSBoYXModmFsLCBTUkMpIHx8IGhpZGUodmFsLCBTUkMsIE9ba2V5XSA/ICcnICsgT1trZXldIDogVFBMLmpvaW4oU3RyaW5nKGtleSkpKTtcbiAgaWYgKE8gPT09IGdsb2JhbCkge1xuICAgIE9ba2V5XSA9IHZhbDtcbiAgfSBlbHNlIGlmICghc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gICAgaGlkZShPLCBrZXksIHZhbCk7XG4gIH0gZWxzZSBpZiAoT1trZXldKSB7XG4gICAgT1trZXldID0gdmFsO1xuICB9IGVsc2Uge1xuICAgIGhpZGUoTywga2V5LCB2YWwpO1xuICB9XG4vLyBhZGQgZmFrZSBGdW5jdGlvbiN0b1N0cmluZyBmb3IgY29ycmVjdCB3b3JrIHdyYXBwZWQgbWV0aG9kcyAvIGNvbnN0cnVjdG9ycyB3aXRoIG1ldGhvZHMgbGlrZSBMb0Rhc2ggaXNOYXRpdmVcbn0pKEZ1bmN0aW9uLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgcmV0dXJuIHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgJiYgdGhpc1tTUkNdIHx8ICR0b1N0cmluZy5jYWxsKHRoaXMpO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIGJ1aWx0aW5FeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjO1xuXG4gLy8gYFJlZ0V4cEV4ZWNgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtcmVnZXhwZXhlY1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoUiwgUykge1xuICB2YXIgZXhlYyA9IFIuZXhlYztcbiAgaWYgKHR5cGVvZiBleGVjID09PSAnZnVuY3Rpb24nKSB7XG4gICAgdmFyIHJlc3VsdCA9IGV4ZWMuY2FsbChSLCBTKTtcbiAgICBpZiAodHlwZW9mIHJlc3VsdCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZ0V4cCBleGVjIG1ldGhvZCByZXR1cm5lZCBzb21ldGhpbmcgb3RoZXIgdGhhbiBhbiBPYmplY3Qgb3IgbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG4gIGlmIChjbGFzc29mKFIpICE9PSAnUmVnRXhwJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1JlZ0V4cCNleGVjIGNhbGxlZCBvbiBpbmNvbXBhdGlibGUgcmVjZWl2ZXInKTtcbiAgfVxuICByZXR1cm4gYnVpbHRpbkV4ZWMuY2FsbChSLCBTKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciByZWdleHBGbGFncyA9IHJlcXVpcmUoJy4vX2ZsYWdzJyk7XG5cbnZhciBuYXRpdmVFeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjO1xuLy8gVGhpcyBhbHdheXMgcmVmZXJzIHRvIHRoZSBuYXRpdmUgaW1wbGVtZW50YXRpb24sIGJlY2F1c2UgdGhlXG4vLyBTdHJpbmcjcmVwbGFjZSBwb2x5ZmlsbCB1c2VzIC4vZml4LXJlZ2V4cC13ZWxsLWtub3duLXN5bWJvbC1sb2dpYy5qcyxcbi8vIHdoaWNoIGxvYWRzIHRoaXMgZmlsZSBiZWZvcmUgcGF0Y2hpbmcgdGhlIG1ldGhvZC5cbnZhciBuYXRpdmVSZXBsYWNlID0gU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlO1xuXG52YXIgcGF0Y2hlZEV4ZWMgPSBuYXRpdmVFeGVjO1xuXG52YXIgTEFTVF9JTkRFWCA9ICdsYXN0SW5kZXgnO1xuXG52YXIgVVBEQVRFU19MQVNUX0lOREVYX1dST05HID0gKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlMSA9IC9hLyxcbiAgICAgIHJlMiA9IC9iKi9nO1xuICBuYXRpdmVFeGVjLmNhbGwocmUxLCAnYScpO1xuICBuYXRpdmVFeGVjLmNhbGwocmUyLCAnYScpO1xuICByZXR1cm4gcmUxW0xBU1RfSU5ERVhdICE9PSAwIHx8IHJlMltMQVNUX0lOREVYXSAhPT0gMDtcbn0pKCk7XG5cbi8vIG5vbnBhcnRpY2lwYXRpbmcgY2FwdHVyaW5nIGdyb3VwLCBjb3BpZWQgZnJvbSBlczUtc2hpbSdzIFN0cmluZyNzcGxpdCBwYXRjaC5cbnZhciBOUENHX0lOQ0xVREVEID0gLygpPz8vLmV4ZWMoJycpWzFdICE9PSB1bmRlZmluZWQ7XG5cbnZhciBQQVRDSCA9IFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyB8fCBOUENHX0lOQ0xVREVEO1xuXG5pZiAoUEFUQ0gpIHtcbiAgcGF0Y2hlZEV4ZWMgPSBmdW5jdGlvbiBleGVjKHN0cikge1xuICAgIHZhciByZSA9IHRoaXM7XG4gICAgdmFyIGxhc3RJbmRleCwgcmVDb3B5LCBtYXRjaCwgaTtcblxuICAgIGlmIChOUENHX0lOQ0xVREVEKSB7XG4gICAgICByZUNvcHkgPSBuZXcgUmVnRXhwKCdeJyArIHJlLnNvdXJjZSArICckKD8hXFxcXHMpJywgcmVnZXhwRmxhZ3MuY2FsbChyZSkpO1xuICAgIH1cbiAgICBpZiAoVVBEQVRFU19MQVNUX0lOREVYX1dST05HKSBsYXN0SW5kZXggPSByZVtMQVNUX0lOREVYXTtcblxuICAgIG1hdGNoID0gbmF0aXZlRXhlYy5jYWxsKHJlLCBzdHIpO1xuXG4gICAgaWYgKFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyAmJiBtYXRjaCkge1xuICAgICAgcmVbTEFTVF9JTkRFWF0gPSByZS5nbG9iYWwgPyBtYXRjaC5pbmRleCArIG1hdGNoWzBdLmxlbmd0aCA6IGxhc3RJbmRleDtcbiAgICB9XG4gICAgaWYgKE5QQ0dfSU5DTFVERUQgJiYgbWF0Y2ggJiYgbWF0Y2gubGVuZ3RoID4gMSkge1xuICAgICAgLy8gRml4IGJyb3dzZXJzIHdob3NlIGBleGVjYCBtZXRob2RzIGRvbid0IGNvbnNpc3RlbnRseSByZXR1cm4gYHVuZGVmaW5lZGBcbiAgICAgIC8vIGZvciBOUENHLCBsaWtlIElFOC4gTk9URTogVGhpcyBkb2Vzbicgd29yayBmb3IgLyguPyk/L1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLWxvb3AtZnVuY1xuICAgICAgbmF0aXZlUmVwbGFjZS5jYWxsKG1hdGNoWzBdLCByZUNvcHksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZm9yIChpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAyOyBpKyspIHtcbiAgICAgICAgICBpZiAoYXJndW1lbnRzW2ldID09PSB1bmRlZmluZWQpIG1hdGNoW2ldID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2hlZEV4ZWM7XG4iLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGNoZWNrID0gZnVuY3Rpb24gKE8sIHByb3RvKSB7XG4gIGFuT2JqZWN0KE8pO1xuICBpZiAoIWlzT2JqZWN0KHByb3RvKSAmJiBwcm90byAhPT0gbnVsbCkgdGhyb3cgVHlwZUVycm9yKHByb3RvICsgXCI6IGNhbid0IHNldCBhcyBwcm90b3R5cGUhXCIpO1xufTtcbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG4gICAgZnVuY3Rpb24gKHRlc3QsIGJ1Z2d5LCBzZXQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHNldCA9IHJlcXVpcmUoJy4vX2N0eCcpKEZ1bmN0aW9uLmNhbGwsIHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZihPYmplY3QucHJvdG90eXBlLCAnX19wcm90b19fJykuc2V0LCAyKTtcbiAgICAgICAgc2V0KHRlc3QsIFtdKTtcbiAgICAgICAgYnVnZ3kgPSAhKHRlc3QgaW5zdGFuY2VvZiBBcnJheSk7XG4gICAgICB9IGNhdGNoIChlKSB7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKSB7XG4gICAgICAgIGNoZWNrKE8sIHByb3RvKTtcbiAgICAgICAgaWYgKGJ1Z2d5KSBPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgU1BFQ0lFUyA9IHJlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSkge1xuICB2YXIgQyA9IGdsb2JhbFtLRVldO1xuICBpZiAoREVTQ1JJUFRPUlMgJiYgQyAmJiAhQ1tTUEVDSUVTXSkgZFAuZihDLCBTUEVDSUVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfVxuICB9KTtcbn07XG4iLCJ2YXIgZGVmID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBUQUcgPSByZXF1aXJlKCcuL193a3MnKSgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIHRhZywgc3RhdCkge1xuICBpZiAoaXQgJiYgIWhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkgZGVmKGl0LCBUQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnIH0pO1xufTtcbiIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoa2V5KSB7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGNvcmUgPSByZXF1aXJlKCcuL19jb3JlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCAoZ2xvYmFsW1NIQVJFRF0gPSB7fSk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiBjb3JlLnZlcnNpb24sXG4gIG1vZGU6IHJlcXVpcmUoJy4vX2xpYnJhcnknKSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDE5IERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCIvLyA3LjMuMjAgU3BlY2llc0NvbnN0cnVjdG9yKE8sIGRlZmF1bHRDb25zdHJ1Y3RvcilcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4vX2EtZnVuY3Rpb24nKTtcbnZhciBTUEVDSUVTID0gcmVxdWlyZSgnLi9fd2tzJykoJ3NwZWNpZXMnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKE8sIEQpIHtcbiAgdmFyIEMgPSBhbk9iamVjdChPKS5jb25zdHJ1Y3RvcjtcbiAgdmFyIFM7XG4gIHJldHVybiBDID09PSB1bmRlZmluZWQgfHwgKFMgPSBhbk9iamVjdChDKVtTUEVDSUVTXSkgPT0gdW5kZWZpbmVkID8gRCA6IGFGdW5jdGlvbihTKTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChtZXRob2QsIGFyZykge1xuICByZXR1cm4gISFtZXRob2QgJiYgZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWNhbGxcbiAgICBhcmcgPyBtZXRob2QuY2FsbChudWxsLCBmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0sIDEpIDogbWV0aG9kLmNhbGwobnVsbCk7XG4gIH0pO1xufTtcbiIsInZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChUT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGF0LCBwb3MpIHtcbiAgICB2YXIgcyA9IFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbiAgICB2YXIgaSA9IHRvSW50ZWdlcihwb3MpO1xuICAgIHZhciBsID0gcy5sZW5ndGg7XG4gICAgdmFyIGEsIGI7XG4gICAgaWYgKGkgPCAwIHx8IGkgPj0gbCkgcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07XG4iLCIvLyBoZWxwZXIgZm9yIFN0cmluZyN7c3RhcnRzV2l0aCwgZW5kc1dpdGgsIGluY2x1ZGVzfVxudmFyIGlzUmVnRXhwID0gcmVxdWlyZSgnLi9faXMtcmVnZXhwJyk7XG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGhhdCwgc2VhcmNoU3RyaW5nLCBOQU1FKSB7XG4gIGlmIChpc1JlZ0V4cChzZWFyY2hTdHJpbmcpKSB0aHJvdyBUeXBlRXJyb3IoJ1N0cmluZyMnICsgTkFNRSArIFwiIGRvZXNuJ3QgYWNjZXB0IHJlZ2V4IVwiKTtcbiAgcmV0dXJuIFN0cmluZyhkZWZpbmVkKHRoYXQpKTtcbn07XG4iLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi9fZmFpbHMnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xudmFyIHF1b3QgPSAvXCIvZztcbi8vIEIuMi4zLjIuMSBDcmVhdGVIVE1MKHN0cmluZywgdGFnLCBhdHRyaWJ1dGUsIHZhbHVlKVxudmFyIGNyZWF0ZUhUTUwgPSBmdW5jdGlvbiAoc3RyaW5nLCB0YWcsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgdmFyIFMgPSBTdHJpbmcoZGVmaW5lZChzdHJpbmcpKTtcbiAgdmFyIHAxID0gJzwnICsgdGFnO1xuICBpZiAoYXR0cmlidXRlICE9PSAnJykgcDEgKz0gJyAnICsgYXR0cmlidXRlICsgJz1cIicgKyBTdHJpbmcodmFsdWUpLnJlcGxhY2UocXVvdCwgJyZxdW90OycpICsgJ1wiJztcbiAgcmV0dXJuIHAxICsgJz4nICsgUyArICc8LycgKyB0YWcgKyAnPic7XG59O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSwgZXhlYykge1xuICB2YXIgTyA9IHt9O1xuICBPW05BTUVdID0gZXhlYyhjcmVhdGVIVE1MKTtcbiAgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHRlc3QgPSAnJ1tOQU1FXSgnXCInKTtcbiAgICByZXR1cm4gdGVzdCAhPT0gdGVzdC50b0xvd2VyQ2FzZSgpIHx8IHRlc3Quc3BsaXQoJ1wiJykubGVuZ3RoID4gMztcbiAgfSksICdTdHJpbmcnLCBPKTtcbn07XG4iLCJ2YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgaW52b2tlID0gcmVxdWlyZSgnLi9faW52b2tlJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4vX2h0bWwnKTtcbnZhciBjZWwgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIHNldFRhc2sgPSBnbG9iYWwuc2V0SW1tZWRpYXRlO1xudmFyIGNsZWFyVGFzayA9IGdsb2JhbC5jbGVhckltbWVkaWF0ZTtcbnZhciBNZXNzYWdlQ2hhbm5lbCA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbDtcbnZhciBEaXNwYXRjaCA9IGdsb2JhbC5EaXNwYXRjaDtcbnZhciBjb3VudGVyID0gMDtcbnZhciBxdWV1ZSA9IHt9O1xudmFyIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xudmFyIGRlZmVyLCBjaGFubmVsLCBwb3J0O1xudmFyIHJ1biA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIGlkID0gK3RoaXM7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnNcbiAgaWYgKHF1ZXVlLmhhc093blByb3BlcnR5KGlkKSkge1xuICAgIHZhciBmbiA9IHF1ZXVlW2lkXTtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICAgIGZuKCk7XG4gIH1cbn07XG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XG59O1xuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxuaWYgKCFzZXRUYXNrIHx8ICFjbGVhclRhc2spIHtcbiAgc2V0VGFzayA9IGZ1bmN0aW9uIHNldEltbWVkaWF0ZShmbikge1xuICAgIHZhciBhcmdzID0gW107XG4gICAgdmFyIGkgPSAxO1xuICAgIHdoaWxlIChhcmd1bWVudHMubGVuZ3RoID4gaSkgYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jXG4gICAgICBpbnZva2UodHlwZW9mIGZuID09ICdmdW5jdGlvbicgPyBmbiA6IEZ1bmN0aW9uKGZuKSwgYXJncyk7XG4gICAgfTtcbiAgICBkZWZlcihjb3VudGVyKTtcbiAgICByZXR1cm4gY291bnRlcjtcbiAgfTtcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpIHtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYgKHJlcXVpcmUoJy4vX2NvZicpKHByb2Nlc3MpID09ICdwcm9jZXNzJykge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGN0eChydW4sIGlkLCAxKSk7XG4gICAgfTtcbiAgLy8gU3BoZXJlIChKUyBnYW1lIGVuZ2luZSkgRGlzcGF0Y2ggQVBJXG4gIH0gZWxzZSBpZiAoRGlzcGF0Y2ggJiYgRGlzcGF0Y2gubm93KSB7XG4gICAgZGVmZXIgPSBmdW5jdGlvbiAoaWQpIHtcbiAgICAgIERpc3BhdGNoLm5vdyhjdHgocnVuLCBpZCwgMSkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgfSBlbHNlIGlmIChNZXNzYWdlQ2hhbm5lbCkge1xuICAgIGNoYW5uZWwgPSBuZXcgTWVzc2FnZUNoYW5uZWwoKTtcbiAgICBwb3J0ID0gY2hhbm5lbC5wb3J0MjtcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RlbmVyO1xuICAgIGRlZmVyID0gY3R4KHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmIChnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJiB0eXBlb2YgcG9zdE1lc3NhZ2UgPT0gJ2Z1bmN0aW9uJyAmJiAhZ2xvYmFsLmltcG9ydFNjcmlwdHMpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgZ2xvYmFsLnBvc3RNZXNzYWdlKGlkICsgJycsICcqJyk7XG4gICAgfTtcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGxpc3RlbmVyLCBmYWxzZSk7XG4gIC8vIElFOC1cbiAgfSBlbHNlIGlmIChPTlJFQURZU1RBVEVDSEFOR0UgaW4gY2VsKCdzY3JpcHQnKSkge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNlbCgnc2NyaXB0JykpW09OUkVBRFlTVEFURUNIQU5HRV0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGh0bWwucmVtb3ZlQ2hpbGQodGhpcyk7XG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcbiAgICAgIH07XG4gICAgfTtcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcbiAgfSBlbHNlIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgc2V0VGltZW91dChjdHgocnVuLCBpZCwgMSksIDApO1xuICAgIH07XG4gIH1cbn1cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IHNldFRhc2ssXG4gIGNsZWFyOiBjbGVhclRhc2tcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi9fdG8taW50ZWdlcicpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5kZXgsIGxlbmd0aCkge1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTtcbiIsIi8vIDcuMS40IFRvSW50ZWdlclxudmFyIGNlaWwgPSBNYXRoLmNlaWw7XG52YXIgZmxvb3IgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XG59O1xuIiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKTtcbnZhciBkZWZpbmVkID0gcmVxdWlyZSgnLi9fZGVmaW5lZCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTtcbiIsIi8vIDcuMS4xNSBUb0xlbmd0aFxudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBtaW4gPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwiLy8gNy4xLjEzIFRvT2JqZWN0KGFyZ3VtZW50KVxudmFyIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07XG4iLCIvLyA3LjEuMSBUb1ByaW1pdGl2ZShpbnB1dCBbLCBQcmVmZXJyZWRUeXBlXSlcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xuLy8gaW5zdGVhZCBvZiB0aGUgRVM2IHNwZWMgdmVyc2lvbiwgd2UgZGlkbid0IGltcGxlbWVudCBAQHRvUHJpbWl0aXZlIGNhc2Vcbi8vIGFuZCB0aGUgc2Vjb25kIGFyZ3VtZW50IC0gZmxhZyAtIHByZWZlcnJlZCB0eXBlIGlzIGEgc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgUykge1xuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYgKFMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIGlmICh0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKSByZXR1cm4gdmFsO1xuICBpZiAoIVMgJiYgdHlwZW9mIChmbiA9IGl0LnRvU3RyaW5nKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGl0KSkpIHJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4gJ1N5bWJvbCgnLmNvbmNhdChrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5LCAnKV8nLCAoKytpZCArIHB4KS50b1N0cmluZygzNikpO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBuYXZpZ2F0b3IgPSBnbG9iYWwubmF2aWdhdG9yO1xuXG5tb2R1bGUuZXhwb3J0cyA9IG5hdmlnYXRvciAmJiBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9faXMtb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCwgVFlQRSkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSB8fCBpdC5fdCAhPT0gVFlQRSkgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCEnKTtcbiAgcmV0dXJuIGl0O1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBjb3JlID0gcmVxdWlyZSgnLi9fY29yZScpO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgd2tzRXh0ID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgdmFyICRTeW1ib2wgPSBjb3JlLlN5bWJvbCB8fCAoY29yZS5TeW1ib2wgPSBMSUJSQVJZID8ge30gOiBnbG9iYWwuU3ltYm9sIHx8IHt9KTtcbiAgaWYgKG5hbWUuY2hhckF0KDApICE9ICdfJyAmJiAhKG5hbWUgaW4gJFN5bWJvbCkpIGRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHsgdmFsdWU6IHdrc0V4dC5mKG5hbWUpIH0pO1xufTtcbiIsImV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX3drcycpO1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi9fc2hhcmVkJykoJ3drcycpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4vX3VpZCcpO1xudmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpLlN5bWJvbDtcbnZhciBVU0VfU1lNQk9MID0gdHlwZW9mIFN5bWJvbCA9PSAnZnVuY3Rpb24nO1xuXG52YXIgJGV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxuICAgIFVTRV9TWU1CT0wgJiYgU3ltYm9sW25hbWVdIHx8IChVU0VfU1lNQk9MID8gU3ltYm9sIDogdWlkKSgnU3ltYm9sLicgKyBuYW1lKSk7XG59O1xuXG4kZXhwb3J0cy5zdG9yZSA9IHN0b3JlO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuL19jbGFzc29mJyk7XG52YXIgSVRFUkFUT1IgPSByZXF1aXJlKCcuL193a3MnKSgnaXRlcmF0b3InKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fY29yZScpLmdldEl0ZXJhdG9yTWV0aG9kID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCIvLyAyMi4xLjMuNiBBcnJheS5wcm90b3R5cGUuZmlsbCh2YWx1ZSwgc3RhcnQgPSAwLCBlbmQgPSB0aGlzLmxlbmd0aClcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5QLCAnQXJyYXknLCB7IGZpbGw6IHJlcXVpcmUoJy4vX2FycmF5LWZpbGwnKSB9KTtcblxucmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJykoJ2ZpbGwnKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjdHggPSByZXF1aXJlKCcuL19jdHgnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciBjYWxsID0gcmVxdWlyZSgnLi9faXRlci1jYWxsJyk7XG52YXIgaXNBcnJheUl0ZXIgPSByZXF1aXJlKCcuL19pcy1hcnJheS1pdGVyJyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuL190by1sZW5ndGgnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJGbiA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2l0ZXItZGV0ZWN0JykoZnVuY3Rpb24gKGl0ZXIpIHsgQXJyYXkuZnJvbShpdGVyKTsgfSksICdBcnJheScsIHtcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxuICBmcm9tOiBmdW5jdGlvbiBmcm9tKGFycmF5TGlrZSAvKiAsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkICovKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICAgIHZhciBDID0gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheTtcbiAgICB2YXIgYUxlbiA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gICAgdmFyIG1hcGZuID0gYUxlbiA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQ7XG4gICAgdmFyIG1hcHBpbmcgPSBtYXBmbiAhPT0gdW5kZWZpbmVkO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGl0ZXJGbiA9IGdldEl0ZXJGbihPKTtcbiAgICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yO1xuICAgIGlmIChtYXBwaW5nKSBtYXBmbiA9IGN0eChtYXBmbiwgYUxlbiA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQsIDIpO1xuICAgIC8vIGlmIG9iamVjdCBpc24ndCBpdGVyYWJsZSBvciBpdCdzIGFycmF5IHdpdGggZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBzaW1wbGUgY2FzZVxuICAgIGlmIChpdGVyRm4gIT0gdW5kZWZpbmVkICYmICEoQyA9PSBBcnJheSAmJiBpc0FycmF5SXRlcihpdGVyRm4pKSkge1xuICAgICAgZm9yIChpdGVyYXRvciA9IGl0ZXJGbi5jYWxsKE8pLCByZXN1bHQgPSBuZXcgQygpOyAhKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmU7IGluZGV4KyspIHtcbiAgICAgICAgY3JlYXRlUHJvcGVydHkocmVzdWx0LCBpbmRleCwgbWFwcGluZyA/IGNhbGwoaXRlcmF0b3IsIG1hcGZuLCBbc3RlcC52YWx1ZSwgaW5kZXhdLCB0cnVlKSA6IHN0ZXAudmFsdWUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgICBmb3IgKHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7IGxlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIG1hcHBpbmcgPyBtYXBmbihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXN1bHQubGVuZ3RoID0gaW5kZXg7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRpbmRleE9mID0gcmVxdWlyZSgnLi9fYXJyYXktaW5jbHVkZXMnKShmYWxzZSk7XG52YXIgJG5hdGl2ZSA9IFtdLmluZGV4T2Y7XG52YXIgTkVHQVRJVkVfWkVSTyA9ICEhJG5hdGl2ZSAmJiAxIC8gWzFdLmluZGV4T2YoMSwgLTApIDwgMDtcblxuJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoTkVHQVRJVkVfWkVSTyB8fCAhcmVxdWlyZSgnLi9fc3RyaWN0LW1ldGhvZCcpKCRuYXRpdmUpKSwgJ0FycmF5Jywge1xuICAvLyAyMi4xLjMuMTEgLyAxNS40LjQuMTQgQXJyYXkucHJvdG90eXBlLmluZGV4T2Yoc2VhcmNoRWxlbWVudCBbLCBmcm9tSW5kZXhdKVxuICBpbmRleE9mOiBmdW5jdGlvbiBpbmRleE9mKHNlYXJjaEVsZW1lbnQgLyogLCBmcm9tSW5kZXggPSAwICovKSB7XG4gICAgcmV0dXJuIE5FR0FUSVZFX1pFUk9cbiAgICAgIC8vIGNvbnZlcnQgLTAgdG8gKzBcbiAgICAgID8gJG5hdGl2ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IDBcbiAgICAgIDogJGluZGV4T2YodGhpcywgc2VhcmNoRWxlbWVudCwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG4iLCIvLyAyMi4xLjIuMiAvIDE1LjQuMy4yIEFycmF5LmlzQXJyYXkoYXJnKVxudmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdBcnJheScsIHsgaXNBcnJheTogcmVxdWlyZSgnLi9faXMtYXJyYXknKSB9KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJyk7XG52YXIgc3RlcCA9IHJlcXVpcmUoJy4vX2l0ZXItc3RlcCcpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcblxuLy8gMjIuMS4zLjQgQXJyYXkucHJvdG90eXBlLmVudHJpZXMoKVxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcbi8vIDIyLjEuMy4yOSBBcnJheS5wcm90b3R5cGUudmFsdWVzKClcbi8vIDIyLjEuMy4zMCBBcnJheS5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19pdGVyLWRlZmluZScpKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbiAoaXRlcmF0ZWQsIGtpbmQpIHtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBPID0gdGhpcy5fdDtcbiAgdmFyIGtpbmQgPSB0aGlzLl9rO1xuICB2YXIgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmICghTyB8fCBpbmRleCA+PSBPLmxlbmd0aCkge1xuICAgIHRoaXMuX3QgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHN0ZXAoMSk7XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4gc3RlcCgwLCBpbmRleCk7XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyICRtYXAgPSByZXF1aXJlKCcuL19hcnJheS1tZXRob2RzJykoMSk7XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX3N0cmljdC1tZXRob2QnKShbXS5tYXAsIHRydWUpLCAnQXJyYXknLCB7XG4gIC8vIDIyLjEuMy4xNSAvIDE1LjQuNC4xOSBBcnJheS5wcm90b3R5cGUubWFwKGNhbGxiYWNrZm4gWywgdGhpc0FyZ10pXG4gIG1hcDogZnVuY3Rpb24gbWFwKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgcmV0dXJuICRtYXAodGhpcywgY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdKTtcbiAgfVxufSk7XG4iLCJ2YXIgRGF0ZVByb3RvID0gRGF0ZS5wcm90b3R5cGU7XG52YXIgSU5WQUxJRF9EQVRFID0gJ0ludmFsaWQgRGF0ZSc7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciAkdG9TdHJpbmcgPSBEYXRlUHJvdG9bVE9fU1RSSU5HXTtcbnZhciBnZXRUaW1lID0gRGF0ZVByb3RvLmdldFRpbWU7XG5pZiAobmV3IERhdGUoTmFOKSArICcnICE9IElOVkFMSURfREFURSkge1xuICByZXF1aXJlKCcuL19yZWRlZmluZScpKERhdGVQcm90bywgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgdmFsdWUgPSBnZXRUaW1lLmNhbGwodGhpcyk7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXNlbGYtY29tcGFyZVxuICAgIHJldHVybiB2YWx1ZSA9PT0gdmFsdWUgPyAkdG9TdHJpbmcuY2FsbCh0aGlzKSA6IElOVkFMSURfREFURTtcbiAgfSk7XG59XG4iLCIvLyAxOS4yLjMuMiAvIDE1LjMuNC41IEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKHRoaXNBcmcsIGFyZ3MuLi4pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUCwgJ0Z1bmN0aW9uJywgeyBiaW5kOiByZXF1aXJlKCcuL19iaW5kJykgfSk7XG4iLCJ2YXIgZFAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKS5mO1xudmFyIEZQcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbnZhciBuYW1lUkUgPSAvXlxccypmdW5jdGlvbiAoW14gKF0qKS87XG52YXIgTkFNRSA9ICduYW1lJztcblxuLy8gMTkuMi40LjIgbmFtZVxuTkFNRSBpbiBGUHJvdG8gfHwgcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSAmJiBkUChGUHJvdG8sIE5BTUUsIHtcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuICgnJyArIHRoaXMpLm1hdGNoKG5hbWVSRSlbMV07XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBNQVAgPSAnTWFwJztcblxuLy8gMjMuMSBNYXAgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoTUFQLCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4xLjMuNiBNYXAucHJvdG90eXBlLmdldChrZXkpXG4gIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh2YWxpZGF0ZSh0aGlzLCBNQVApLCBrZXkpO1xuICAgIHJldHVybiBlbnRyeSAmJiBlbnRyeS52O1xuICB9LFxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxuICBzZXQ6IGZ1bmN0aW9uIHNldChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodmFsaWRhdGUodGhpcywgTUFQKSwga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICB9XG59LCBzdHJvbmcsIHRydWUpO1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7IGNyZWF0ZTogcmVxdWlyZSgnLi9fb2JqZWN0LWNyZWF0ZScpIH0pO1xuIiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKTtcbi8vIDE5LjEuMi40IC8gMTUuMi4zLjYgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFyZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpLCAnT2JqZWN0JywgeyBkZWZpbmVQcm9wZXJ0eTogcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZiB9KTtcbiIsIi8vIDE5LjEuMi4xNCBPYmplY3Qua2V5cyhPKVxudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0Jyk7XG52YXIgJGtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5yZXF1aXJlKCcuL19vYmplY3Qtc2FwJykoJ2tleXMnLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBmdW5jdGlvbiBrZXlzKGl0KSB7XG4gICAgcmV0dXJuICRrZXlzKHRvT2JqZWN0KGl0KSk7XG4gIH07XG59KTtcbiIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7IHNldFByb3RvdHlwZU9mOiByZXF1aXJlKCcuL19zZXQtcHJvdG8nKS5zZXQgfSk7XG4iLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi9fY2xhc3NvZicpO1xudmFyIHRlc3QgPSB7fTtcbnRlc3RbcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyldID0gJ3onO1xuaWYgKHRlc3QgKyAnJyAhPSAnW29iamVjdCB6XScpIHtcbiAgcmVxdWlyZSgnLi9fcmVkZWZpbmUnKShPYmplY3QucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gJ1tvYmplY3QgJyArIGNsYXNzb2YodGhpcykgKyAnXSc7XG4gIH0sIHRydWUpO1xufVxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIExJQlJBUlkgPSByZXF1aXJlKCcuL19saWJyYXJ5Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi9fZ2xvYmFsJyk7XG52YXIgY3R4ID0gcmVxdWlyZSgnLi9fY3R4Jyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKTtcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4vX2FuLWluc3RhbmNlJyk7XG52YXIgZm9yT2YgPSByZXF1aXJlKCcuL19mb3Itb2YnKTtcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuL19zcGVjaWVzLWNvbnN0cnVjdG9yJyk7XG52YXIgdGFzayA9IHJlcXVpcmUoJy4vX3Rhc2snKS5zZXQ7XG52YXIgbWljcm90YXNrID0gcmVxdWlyZSgnLi9fbWljcm90YXNrJykoKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZSA9IHJlcXVpcmUoJy4vX25ldy1wcm9taXNlLWNhcGFiaWxpdHknKTtcbnZhciBwZXJmb3JtID0gcmVxdWlyZSgnLi9fcGVyZm9ybScpO1xudmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4vX3VzZXItYWdlbnQnKTtcbnZhciBwcm9taXNlUmVzb2x2ZSA9IHJlcXVpcmUoJy4vX3Byb21pc2UtcmVzb2x2ZScpO1xudmFyIFBST01JU0UgPSAnUHJvbWlzZSc7XG52YXIgVHlwZUVycm9yID0gZ2xvYmFsLlR5cGVFcnJvcjtcbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgdmVyc2lvbnMgPSBwcm9jZXNzICYmIHByb2Nlc3MudmVyc2lvbnM7XG52YXIgdjggPSB2ZXJzaW9ucyAmJiB2ZXJzaW9ucy52OCB8fCAnJztcbnZhciAkUHJvbWlzZSA9IGdsb2JhbFtQUk9NSVNFXTtcbnZhciBpc05vZGUgPSBjbGFzc29mKHByb2Nlc3MpID09ICdwcm9jZXNzJztcbnZhciBlbXB0eSA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcbnZhciBJbnRlcm5hbCwgbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5LCBPd25Qcm9taXNlQ2FwYWJpbGl0eSwgV3JhcHBlcjtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmY7XG5cbnZhciBVU0VfTkFUSVZFID0gISFmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgLy8gY29ycmVjdCBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gICAgdmFyIHByb21pc2UgPSAkUHJvbWlzZS5yZXNvbHZlKDEpO1xuICAgIHZhciBGYWtlUHJvbWlzZSA9IChwcm9taXNlLmNvbnN0cnVjdG9yID0ge30pW3JlcXVpcmUoJy4vX3drcycpKCdzcGVjaWVzJyldID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgICAgIGV4ZWMoZW1wdHksIGVtcHR5KTtcbiAgICB9O1xuICAgIC8vIHVuaGFuZGxlZCByZWplY3Rpb25zIHRyYWNraW5nIHN1cHBvcnQsIE5vZGVKUyBQcm9taXNlIHdpdGhvdXQgaXQgZmFpbHMgQEBzcGVjaWVzIHRlc3RcbiAgICByZXR1cm4gKGlzTm9kZSB8fCB0eXBlb2YgUHJvbWlzZVJlamVjdGlvbkV2ZW50ID09ICdmdW5jdGlvbicpXG4gICAgICAmJiBwcm9taXNlLnRoZW4oZW1wdHkpIGluc3RhbmNlb2YgRmFrZVByb21pc2VcbiAgICAgIC8vIHY4IDYuNiAoTm9kZSAxMCBhbmQgQ2hyb21lIDY2KSBoYXZlIGEgYnVnIHdpdGggcmVzb2x2aW5nIGN1c3RvbSB0aGVuYWJsZXNcbiAgICAgIC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTgzMDU2NVxuICAgICAgLy8gd2UgY2FuJ3QgZGV0ZWN0IGl0IHN5bmNocm9ub3VzbHksIHNvIGp1c3QgY2hlY2sgdmVyc2lvbnNcbiAgICAgICYmIHY4LmluZGV4T2YoJzYuNicpICE9PSAwXG4gICAgICAmJiB1c2VyQWdlbnQuaW5kZXhPZignQ2hyb21lLzY2JykgPT09IC0xO1xuICB9IGNhdGNoIChlKSB7IC8qIGVtcHR5ICovIH1cbn0oKTtcblxuLy8gaGVscGVyc1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG52YXIgbm90aWZ5ID0gZnVuY3Rpb24gKHByb21pc2UsIGlzUmVqZWN0KSB7XG4gIGlmIChwcm9taXNlLl9uKSByZXR1cm47XG4gIHByb21pc2UuX24gPSB0cnVlO1xuICB2YXIgY2hhaW4gPSBwcm9taXNlLl9jO1xuICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIG9rID0gcHJvbWlzZS5fcyA9PSAxO1xuICAgIHZhciBpID0gMDtcbiAgICB2YXIgcnVuID0gZnVuY3Rpb24gKHJlYWN0aW9uKSB7XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsO1xuICAgICAgdmFyIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlO1xuICAgICAgdmFyIHJlamVjdCA9IHJlYWN0aW9uLnJlamVjdDtcbiAgICAgIHZhciBkb21haW4gPSByZWFjdGlvbi5kb21haW47XG4gICAgICB2YXIgcmVzdWx0LCB0aGVuLCBleGl0ZWQ7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgIGlmIChwcm9taXNlLl9oID09IDIpIG9uSGFuZGxlVW5oYW5kbGVkKHByb21pc2UpO1xuICAgICAgICAgICAgcHJvbWlzZS5faCA9IDE7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChoYW5kbGVyID09PSB0cnVlKSByZXN1bHQgPSB2YWx1ZTtcbiAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChkb21haW4pIGRvbWFpbi5lbnRlcigpO1xuICAgICAgICAgICAgcmVzdWx0ID0gaGFuZGxlcih2YWx1ZSk7IC8vIG1heSB0aHJvd1xuICAgICAgICAgICAgaWYgKGRvbWFpbikge1xuICAgICAgICAgICAgICBkb21haW4uZXhpdCgpO1xuICAgICAgICAgICAgICBleGl0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAocmVzdWx0ID09PSByZWFjdGlvbi5wcm9taXNlKSB7XG4gICAgICAgICAgICByZWplY3QoVHlwZUVycm9yKCdQcm9taXNlLWNoYWluIGN5Y2xlJykpO1xuICAgICAgICAgIH0gZWxzZSBpZiAodGhlbiA9IGlzVGhlbmFibGUocmVzdWx0KSkge1xuICAgICAgICAgICAgdGhlbi5jYWxsKHJlc3VsdCwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgICB9IGVsc2UgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9IGVsc2UgcmVqZWN0KHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgaWYgKGRvbWFpbiAmJiAhZXhpdGVkKSBkb21haW4uZXhpdCgpO1xuICAgICAgICByZWplY3QoZSk7XG4gICAgICB9XG4gICAgfTtcbiAgICB3aGlsZSAoY2hhaW4ubGVuZ3RoID4gaSkgcnVuKGNoYWluW2krK10pOyAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHByb21pc2UuX2MgPSBbXTtcbiAgICBwcm9taXNlLl9uID0gZmFsc2U7XG4gICAgaWYgKGlzUmVqZWN0ICYmICFwcm9taXNlLl9oKSBvblVuaGFuZGxlZChwcm9taXNlKTtcbiAgfSk7XG59O1xudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgdGFzay5jYWxsKGdsb2JhbCwgZnVuY3Rpb24gKCkge1xuICAgIHZhciB2YWx1ZSA9IHByb21pc2UuX3Y7XG4gICAgdmFyIHVuaGFuZGxlZCA9IGlzVW5oYW5kbGVkKHByb21pc2UpO1xuICAgIHZhciByZXN1bHQsIGhhbmRsZXIsIGNvbnNvbGU7XG4gICAgaWYgKHVuaGFuZGxlZCkge1xuICAgICAgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChpc05vZGUpIHtcbiAgICAgICAgICBwcm9jZXNzLmVtaXQoJ3VuaGFuZGxlZFJlamVjdGlvbicsIHZhbHVlLCBwcm9taXNlKTtcbiAgICAgICAgfSBlbHNlIGlmIChoYW5kbGVyID0gZ2xvYmFsLm9udW5oYW5kbGVkcmVqZWN0aW9uKSB7XG4gICAgICAgICAgaGFuZGxlcih7IHByb21pc2U6IHByb21pc2UsIHJlYXNvbjogdmFsdWUgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoKGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZSkgJiYgY29uc29sZS5lcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1VuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvbicsIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICAvLyBCcm93c2VycyBzaG91bGQgbm90IHRyaWdnZXIgYHJlamVjdGlvbkhhbmRsZWRgIGV2ZW50IGlmIGl0IHdhcyBoYW5kbGVkIGhlcmUsIE5vZGVKUyAtIHNob3VsZFxuICAgICAgcHJvbWlzZS5faCA9IGlzTm9kZSB8fCBpc1VuaGFuZGxlZChwcm9taXNlKSA/IDIgOiAxO1xuICAgIH0gcHJvbWlzZS5fYSA9IHVuZGVmaW5lZDtcbiAgICBpZiAodW5oYW5kbGVkICYmIHJlc3VsdC5lKSB0aHJvdyByZXN1bHQudjtcbiAgfSk7XG59O1xudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgcmV0dXJuIHByb21pc2UuX2ggIT09IDEgJiYgKHByb21pc2UuX2EgfHwgcHJvbWlzZS5fYykubGVuZ3RoID09PSAwO1xufTtcbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgaGFuZGxlcjtcbiAgICBpZiAoaXNOb2RlKSB7XG4gICAgICBwcm9jZXNzLmVtaXQoJ3JlamVjdGlvbkhhbmRsZWQnLCBwcm9taXNlKTtcbiAgICB9IGVsc2UgaWYgKGhhbmRsZXIgPSBnbG9iYWwub25yZWplY3Rpb25oYW5kbGVkKSB7XG4gICAgICBoYW5kbGVyKHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiBwcm9taXNlLl92IH0pO1xuICAgIH1cbiAgfSk7XG59O1xudmFyICRyZWplY3QgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgdmFyIHByb21pc2UgPSB0aGlzO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHByb21pc2UuX3YgPSB2YWx1ZTtcbiAgcHJvbWlzZS5fcyA9IDI7XG4gIGlmICghcHJvbWlzZS5fYSkgcHJvbWlzZS5fYSA9IHByb21pc2UuX2Muc2xpY2UoKTtcbiAgbm90aWZ5KHByb21pc2UsIHRydWUpO1xufTtcbnZhciAkcmVzb2x2ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICB2YXIgcHJvbWlzZSA9IHRoaXM7XG4gIHZhciB0aGVuO1xuICBpZiAocHJvbWlzZS5fZCkgcmV0dXJuO1xuICBwcm9taXNlLl9kID0gdHJ1ZTtcbiAgcHJvbWlzZSA9IHByb21pc2UuX3cgfHwgcHJvbWlzZTsgLy8gdW53cmFwXG4gIHRyeSB7XG4gICAgaWYgKHByb21pc2UgPT09IHZhbHVlKSB0aHJvdyBUeXBlRXJyb3IoXCJQcm9taXNlIGNhbid0IGJlIHJlc29sdmVkIGl0c2VsZlwiKTtcbiAgICBpZiAodGhlbiA9IGlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICBtaWNyb3Rhc2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgd3JhcHBlciA9IHsgX3c6IHByb21pc2UsIF9kOiBmYWxzZSB9OyAvLyB3cmFwXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLCBjdHgoJHJlc29sdmUsIHdyYXBwZXIsIDEpLCBjdHgoJHJlamVjdCwgd3JhcHBlciwgMSkpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgJHJlamVjdC5jYWxsKHdyYXBwZXIsIGUpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcHJvbWlzZS5fdiA9IHZhbHVlO1xuICAgICAgcHJvbWlzZS5fcyA9IDE7XG4gICAgICBub3RpZnkocHJvbWlzZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkge1xuICAgICRyZWplY3QuY2FsbCh7IF93OiBwcm9taXNlLCBfZDogZmFsc2UgfSwgZSk7IC8vIHdyYXBcbiAgfVxufTtcblxuLy8gY29uc3RydWN0b3IgcG9seWZpbGxcbmlmICghVVNFX05BVElWRSkge1xuICAvLyAyNS40LjMuMSBQcm9taXNlKGV4ZWN1dG9yKVxuICAkUHJvbWlzZSA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICBhbkluc3RhbmNlKHRoaXMsICRQcm9taXNlLCBQUk9NSVNFLCAnX2gnKTtcbiAgICBhRnVuY3Rpb24oZXhlY3V0b3IpO1xuICAgIEludGVybmFsLmNhbGwodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGN0eCgkcmVzb2x2ZSwgdGhpcywgMSksIGN0eCgkcmVqZWN0LCB0aGlzLCAxKSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAkcmVqZWN0LmNhbGwodGhpcywgZXJyKTtcbiAgICB9XG4gIH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICB0aGlzLl9jID0gW107ICAgICAgICAgICAgIC8vIDwtIGF3YWl0aW5nIHJlYWN0aW9uc1xuICAgIHRoaXMuX2EgPSB1bmRlZmluZWQ7ICAgICAgLy8gPC0gY2hlY2tlZCBpbiBpc1VuaGFuZGxlZCByZWFjdGlvbnNcbiAgICB0aGlzLl9zID0gMDsgICAgICAgICAgICAgIC8vIDwtIHN0YXRlXG4gICAgdGhpcy5fZCA9IGZhbHNlOyAgICAgICAgICAvLyA8LSBkb25lXG4gICAgdGhpcy5fdiA9IHVuZGVmaW5lZDsgICAgICAvLyA8LSB2YWx1ZVxuICAgIHRoaXMuX2ggPSAwOyAgICAgICAgICAgICAgLy8gPC0gcmVqZWN0aW9uIHN0YXRlLCAwIC0gZGVmYXVsdCwgMSAtIGhhbmRsZWQsIDIgLSB1bmhhbmRsZWRcbiAgICB0aGlzLl9uID0gZmFsc2U7ICAgICAgICAgIC8vIDwtIG5vdGlmeVxuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZXF1aXJlKCcuL19yZWRlZmluZS1hbGwnKSgkUHJvbWlzZS5wcm90b3R5cGUsIHtcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxuICAgIHRoZW46IGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgIHZhciByZWFjdGlvbiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHNwZWNpZXNDb25zdHJ1Y3Rvcih0aGlzLCAkUHJvbWlzZSkpO1xuICAgICAgcmVhY3Rpb24ub2sgPSB0eXBlb2Ygb25GdWxmaWxsZWQgPT0gJ2Z1bmN0aW9uJyA/IG9uRnVsZmlsbGVkIDogdHJ1ZTtcbiAgICAgIHJlYWN0aW9uLmZhaWwgPSB0eXBlb2Ygb25SZWplY3RlZCA9PSAnZnVuY3Rpb24nICYmIG9uUmVqZWN0ZWQ7XG4gICAgICByZWFjdGlvbi5kb21haW4gPSBpc05vZGUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHRoaXMuX2MucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAodGhpcy5fYSkgdGhpcy5fYS5wdXNoKHJlYWN0aW9uKTtcbiAgICAgIGlmICh0aGlzLl9zKSBub3RpZnkodGhpcywgZmFsc2UpO1xuICAgICAgcmV0dXJuIHJlYWN0aW9uLnByb21pc2U7XG4gICAgfSxcbiAgICAvLyAyNS40LjUuMSBQcm9taXNlLnByb3RvdHlwZS5jYXRjaChvblJlamVjdGVkKVxuICAgICdjYXRjaCc6IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgT3duUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgSW50ZXJuYWwoKTtcbiAgICB0aGlzLnByb21pc2UgPSBwcm9taXNlO1xuICAgIHRoaXMucmVzb2x2ZSA9IGN0eCgkcmVzb2x2ZSwgcHJvbWlzZSwgMSk7XG4gICAgdGhpcy5yZWplY3QgPSBjdHgoJHJlamVjdCwgcHJvbWlzZSwgMSk7XG4gIH07XG4gIG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmYgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IGZ1bmN0aW9uIChDKSB7XG4gICAgcmV0dXJuIEMgPT09ICRQcm9taXNlIHx8IEMgPT09IFdyYXBwZXJcbiAgICAgID8gbmV3IE93blByb21pc2VDYXBhYmlsaXR5KEMpXG4gICAgICA6IG5ld0dlbmVyaWNQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgfTtcbn1cblxuJGV4cG9ydCgkZXhwb3J0LkcgKyAkZXhwb3J0LlcgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgeyBQcm9taXNlOiAkUHJvbWlzZSB9KTtcbnJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJykoJFByb21pc2UsIFBST01JU0UpO1xucmVxdWlyZSgnLi9fc2V0LXNwZWNpZXMnKShQUk9NSVNFKTtcbldyYXBwZXIgPSByZXF1aXJlKCcuL19jb3JlJylbUFJPTUlTRV07XG5cbi8vIHN0YXRpY3NcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIFBST01JU0UsIHtcbiAgLy8gMjUuNC40LjUgUHJvbWlzZS5yZWplY3QocilcbiAgcmVqZWN0OiBmdW5jdGlvbiByZWplY3Qocikge1xuICAgIHZhciBjYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkodGhpcyk7XG4gICAgdmFyICQkcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgJCRyZWplY3Qocik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIChMSUJSQVJZIHx8ICFVU0VfTkFUSVZFKSwgUFJPTUlTRSwge1xuICAvLyAyNS40LjQuNiBQcm9taXNlLnJlc29sdmUoeClcbiAgcmVzb2x2ZTogZnVuY3Rpb24gcmVzb2x2ZSh4KSB7XG4gICAgcmV0dXJuIHByb21pc2VSZXNvbHZlKExJQlJBUlkgJiYgdGhpcyA9PT0gV3JhcHBlciA/ICRQcm9taXNlIDogdGhpcywgeCk7XG4gIH1cbn0pO1xuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhKFVTRV9OQVRJVkUgJiYgcmVxdWlyZSgnLi9faXRlci1kZXRlY3QnKShmdW5jdGlvbiAoaXRlcikge1xuICAkUHJvbWlzZS5hbGwoaXRlcilbJ2NhdGNoJ10oZW1wdHkpO1xufSkpLCBQUk9NSVNFLCB7XG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZXNvbHZlID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICB2YXIgaW5kZXggPSAwO1xuICAgICAgdmFyIHJlbWFpbmluZyA9IDE7XG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIHZhciAkaW5kZXggPSBpbmRleCsrO1xuICAgICAgICB2YXIgYWxyZWFkeUNhbGxlZCA9IGZhbHNlO1xuICAgICAgICB2YWx1ZXMucHVzaCh1bmRlZmluZWQpO1xuICAgICAgICByZW1haW5pbmcrKztcbiAgICAgICAgQy5yZXNvbHZlKHByb21pc2UpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGFscmVhZHlDYWxsZWQpIHJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbJGluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIC0tcmVtYWluaW5nIHx8IHJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfSwgcmVqZWN0KTtcbiAgICAgIH0pO1xuICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgIH0pO1xuICAgIGlmIChyZXN1bHQuZSkgcmVqZWN0KHJlc3VsdC52KTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9LFxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCBmdW5jdGlvbiAocHJvbWlzZSkge1xuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmUpIHJlamVjdChyZXN1bHQudik7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfVxufSk7XG4iLCIvLyAyNi4xLjMgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKVxudmFyIGRQID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9QcmltaXRpdmUgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKTtcblxuLy8gTVMgRWRnZSBoYXMgYnJva2VuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkgLSB0aHJvd2luZyBpbnN0ZWFkIG9mIHJldHVybmluZyBmYWxzZVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uICgpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG4gIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoZFAuZih7fSwgMSwgeyB2YWx1ZTogMSB9KSwgMSwgeyB2YWx1ZTogMiB9KTtcbn0pLCAnUmVmbGVjdCcsIHtcbiAgZGVmaW5lUHJvcGVydHk6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpIHtcbiAgICBhbk9iamVjdCh0YXJnZXQpO1xuICAgIHByb3BlcnR5S2V5ID0gdG9QcmltaXRpdmUocHJvcGVydHlLZXksIHRydWUpO1xuICAgIGFuT2JqZWN0KGF0dHJpYnV0ZXMpO1xuICAgIHRyeSB7XG4gICAgICBkUC5mKHRhcmdldCwgcHJvcGVydHlLZXksIGF0dHJpYnV0ZXMpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcmVnZXhwRXhlYyA9IHJlcXVpcmUoJy4vX3JlZ2V4cC1leGVjJyk7XG5yZXF1aXJlKCcuL19leHBvcnQnKSh7XG4gIHRhcmdldDogJ1JlZ0V4cCcsXG4gIHByb3RvOiB0cnVlLFxuICBmb3JjZWQ6IHJlZ2V4cEV4ZWMgIT09IC8uLy5leGVjXG59LCB7XG4gIGV4ZWM6IHJlZ2V4cEV4ZWNcbn0pO1xuIiwiLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3MoKVxuaWYgKHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgLy4vZy5mbGFncyAhPSAnZycpIHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmYoUmVnRXhwLnByb3RvdHlwZSwgJ2ZsYWdzJywge1xuICBjb25maWd1cmFibGU6IHRydWUsXG4gIGdldDogcmVxdWlyZSgnLi9fZmxhZ3MnKVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgYWR2YW5jZVN0cmluZ0luZGV4ID0gcmVxdWlyZSgnLi9fYWR2YW5jZS1zdHJpbmctaW5kZXgnKTtcbnZhciByZWdFeHBFeGVjID0gcmVxdWlyZSgnLi9fcmVnZXhwLWV4ZWMtYWJzdHJhY3QnKTtcblxuLy8gQEBtYXRjaCBsb2dpY1xucmVxdWlyZSgnLi9fZml4LXJlLXdrcycpKCdtYXRjaCcsIDEsIGZ1bmN0aW9uIChkZWZpbmVkLCBNQVRDSCwgJG1hdGNoLCBtYXliZUNhbGxOYXRpdmUpIHtcbiAgcmV0dXJuIFtcbiAgICAvLyBgU3RyaW5nLnByb3RvdHlwZS5tYXRjaGAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmdpdGh1Yi5pby9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5tYXRjaFxuICAgIGZ1bmN0aW9uIG1hdGNoKHJlZ2V4cCkge1xuICAgICAgdmFyIE8gPSBkZWZpbmVkKHRoaXMpO1xuICAgICAgdmFyIGZuID0gcmVnZXhwID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJlZ2V4cFtNQVRDSF07XG4gICAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZCA/IGZuLmNhbGwocmVnZXhwLCBPKSA6IG5ldyBSZWdFeHAocmVnZXhwKVtNQVRDSF0oU3RyaW5nKE8pKTtcbiAgICB9LFxuICAgIC8vIGBSZWdFeHAucHJvdG90eXBlW0BAbWF0Y2hdYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLUBAbWF0Y2hcbiAgICBmdW5jdGlvbiAocmVnZXhwKSB7XG4gICAgICB2YXIgcmVzID0gbWF5YmVDYWxsTmF0aXZlKCRtYXRjaCwgcmVnZXhwLCB0aGlzKTtcbiAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcbiAgICAgIHZhciByeCA9IGFuT2JqZWN0KHJlZ2V4cCk7XG4gICAgICB2YXIgUyA9IFN0cmluZyh0aGlzKTtcbiAgICAgIGlmICghcnguZ2xvYmFsKSByZXR1cm4gcmVnRXhwRXhlYyhyeCwgUyk7XG4gICAgICB2YXIgZnVsbFVuaWNvZGUgPSByeC51bmljb2RlO1xuICAgICAgcngubGFzdEluZGV4ID0gMDtcbiAgICAgIHZhciBBID0gW107XG4gICAgICB2YXIgbiA9IDA7XG4gICAgICB2YXIgcmVzdWx0O1xuICAgICAgd2hpbGUgKChyZXN1bHQgPSByZWdFeHBFeGVjKHJ4LCBTKSkgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIG1hdGNoU3RyID0gU3RyaW5nKHJlc3VsdFswXSk7XG4gICAgICAgIEFbbl0gPSBtYXRjaFN0cjtcbiAgICAgICAgaWYgKG1hdGNoU3RyID09PSAnJykgcngubGFzdEluZGV4ID0gYWR2YW5jZVN0cmluZ0luZGV4KFMsIHRvTGVuZ3RoKHJ4Lmxhc3RJbmRleCksIGZ1bGxVbmljb2RlKTtcbiAgICAgICAgbisrO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG4gPT09IDAgPyBudWxsIDogQTtcbiAgICB9XG4gIF07XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuL190by1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpO1xudmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKTtcbnZhciBhZHZhbmNlU3RyaW5nSW5kZXggPSByZXF1aXJlKCcuL19hZHZhbmNlLXN0cmluZy1pbmRleCcpO1xudmFyIHJlZ0V4cEV4ZWMgPSByZXF1aXJlKCcuL19yZWdleHAtZXhlYy1hYnN0cmFjdCcpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcbnZhciBTVUJTVElUVVRJT05fU1lNQk9MUyA9IC9cXCQoWyQmYCddfFxcZFxcZD98PFtePl0qPikvZztcbnZhciBTVUJTVElUVVRJT05fU1lNQk9MU19OT19OQU1FRCA9IC9cXCQoWyQmYCddfFxcZFxcZD8pL2c7XG5cbnZhciBtYXliZVRvU3RyaW5nID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gaXQgOiBTdHJpbmcoaXQpO1xufTtcblxuLy8gQEByZXBsYWNlIGxvZ2ljXG5yZXF1aXJlKCcuL19maXgtcmUtd2tzJykoJ3JlcGxhY2UnLCAyLCBmdW5jdGlvbiAoZGVmaW5lZCwgUkVQTEFDRSwgJHJlcGxhY2UsIG1heWJlQ2FsbE5hdGl2ZSkge1xuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VgIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUucmVwbGFjZVxuICAgIGZ1bmN0aW9uIHJlcGxhY2Uoc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgdmFyIE8gPSBkZWZpbmVkKHRoaXMpO1xuICAgICAgdmFyIGZuID0gc2VhcmNoVmFsdWUgPT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogc2VhcmNoVmFsdWVbUkVQTEFDRV07XG4gICAgICByZXR1cm4gZm4gIT09IHVuZGVmaW5lZFxuICAgICAgICA/IGZuLmNhbGwoc2VhcmNoVmFsdWUsIE8sIHJlcGxhY2VWYWx1ZSlcbiAgICAgICAgOiAkcmVwbGFjZS5jYWxsKFN0cmluZyhPKSwgc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQHJlcGxhY2VdYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZ2l0aHViLmlvL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLUBAcmVwbGFjZVxuICAgIGZ1bmN0aW9uIChyZWdleHAsIHJlcGxhY2VWYWx1ZSkge1xuICAgICAgdmFyIHJlcyA9IG1heWJlQ2FsbE5hdGl2ZSgkcmVwbGFjZSwgcmVnZXhwLCB0aGlzLCByZXBsYWNlVmFsdWUpO1xuICAgICAgaWYgKHJlcy5kb25lKSByZXR1cm4gcmVzLnZhbHVlO1xuXG4gICAgICB2YXIgcnggPSBhbk9iamVjdChyZWdleHApO1xuICAgICAgdmFyIFMgPSBTdHJpbmcodGhpcyk7XG4gICAgICB2YXIgZnVuY3Rpb25hbFJlcGxhY2UgPSB0eXBlb2YgcmVwbGFjZVZhbHVlID09PSAnZnVuY3Rpb24nO1xuICAgICAgaWYgKCFmdW5jdGlvbmFsUmVwbGFjZSkgcmVwbGFjZVZhbHVlID0gU3RyaW5nKHJlcGxhY2VWYWx1ZSk7XG4gICAgICB2YXIgZ2xvYmFsID0gcnguZ2xvYmFsO1xuICAgICAgaWYgKGdsb2JhbCkge1xuICAgICAgICB2YXIgZnVsbFVuaWNvZGUgPSByeC51bmljb2RlO1xuICAgICAgICByeC5sYXN0SW5kZXggPSAwO1xuICAgICAgfVxuICAgICAgdmFyIHJlc3VsdHMgPSBbXTtcbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciByZXN1bHQgPSByZWdFeHBFeGVjKHJ4LCBTKTtcbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkgYnJlYWs7XG4gICAgICAgIHJlc3VsdHMucHVzaChyZXN1bHQpO1xuICAgICAgICBpZiAoIWdsb2JhbCkgYnJlYWs7XG4gICAgICAgIHZhciBtYXRjaFN0ciA9IFN0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICBpZiAobWF0Y2hTdHIgPT09ICcnKSByeC5sYXN0SW5kZXggPSBhZHZhbmNlU3RyaW5nSW5kZXgoUywgdG9MZW5ndGgocngubGFzdEluZGV4KSwgZnVsbFVuaWNvZGUpO1xuICAgICAgfVxuICAgICAgdmFyIGFjY3VtdWxhdGVkUmVzdWx0ID0gJyc7XG4gICAgICB2YXIgbmV4dFNvdXJjZVBvc2l0aW9uID0gMDtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVzdWx0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICByZXN1bHQgPSByZXN1bHRzW2ldO1xuICAgICAgICB2YXIgbWF0Y2hlZCA9IFN0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICB2YXIgcG9zaXRpb24gPSBtYXgobWluKHRvSW50ZWdlcihyZXN1bHQuaW5kZXgpLCBTLmxlbmd0aCksIDApO1xuICAgICAgICB2YXIgY2FwdHVyZXMgPSBbXTtcbiAgICAgICAgLy8gTk9URTogVGhpcyBpcyBlcXVpdmFsZW50IHRvXG4gICAgICAgIC8vICAgY2FwdHVyZXMgPSByZXN1bHQuc2xpY2UoMSkubWFwKG1heWJlVG9TdHJpbmcpXG4gICAgICAgIC8vIGJ1dCBmb3Igc29tZSByZWFzb24gYG5hdGl2ZVNsaWNlLmNhbGwocmVzdWx0LCAxLCByZXN1bHQubGVuZ3RoKWAgKGNhbGxlZCBpblxuICAgICAgICAvLyB0aGUgc2xpY2UgcG9seWZpbGwgd2hlbiBzbGljaW5nIG5hdGl2ZSBhcnJheXMpIFwiZG9lc24ndCB3b3JrXCIgaW4gc2FmYXJpIDkgYW5kXG4gICAgICAgIC8vIGNhdXNlcyBhIGNyYXNoIChodHRwczovL3Bhc3RlYmluLmNvbS9OMjFRemVRQSkgd2hlbiB0cnlpbmcgdG8gZGVidWcgaXQuXG4gICAgICAgIGZvciAodmFyIGogPSAxOyBqIDwgcmVzdWx0Lmxlbmd0aDsgaisrKSBjYXB0dXJlcy5wdXNoKG1heWJlVG9TdHJpbmcocmVzdWx0W2pdKSk7XG4gICAgICAgIHZhciBuYW1lZENhcHR1cmVzID0gcmVzdWx0Lmdyb3VwcztcbiAgICAgICAgaWYgKGZ1bmN0aW9uYWxSZXBsYWNlKSB7XG4gICAgICAgICAgdmFyIHJlcGxhY2VyQXJncyA9IFttYXRjaGVkXS5jb25jYXQoY2FwdHVyZXMsIHBvc2l0aW9uLCBTKTtcbiAgICAgICAgICBpZiAobmFtZWRDYXB0dXJlcyAhPT0gdW5kZWZpbmVkKSByZXBsYWNlckFyZ3MucHVzaChuYW1lZENhcHR1cmVzKTtcbiAgICAgICAgICB2YXIgcmVwbGFjZW1lbnQgPSBTdHJpbmcocmVwbGFjZVZhbHVlLmFwcGx5KHVuZGVmaW5lZCwgcmVwbGFjZXJBcmdzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmVwbGFjZW1lbnQgPSBnZXRTdWJzdGl0dXRpb24obWF0Y2hlZCwgUywgcG9zaXRpb24sIGNhcHR1cmVzLCBuYW1lZENhcHR1cmVzLCByZXBsYWNlVmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwb3NpdGlvbiA+PSBuZXh0U291cmNlUG9zaXRpb24pIHtcbiAgICAgICAgICBhY2N1bXVsYXRlZFJlc3VsdCArPSBTLnNsaWNlKG5leHRTb3VyY2VQb3NpdGlvbiwgcG9zaXRpb24pICsgcmVwbGFjZW1lbnQ7XG4gICAgICAgICAgbmV4dFNvdXJjZVBvc2l0aW9uID0gcG9zaXRpb24gKyBtYXRjaGVkLmxlbmd0aDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGFjY3VtdWxhdGVkUmVzdWx0ICsgUy5zbGljZShuZXh0U291cmNlUG9zaXRpb24pO1xuICAgIH1cbiAgXTtcblxuICAgIC8vIGh0dHBzOi8vdGMzOS5naXRodWIuaW8vZWNtYTI2Mi8jc2VjLWdldHN1YnN0aXR1dGlvblxuICBmdW5jdGlvbiBnZXRTdWJzdGl0dXRpb24obWF0Y2hlZCwgc3RyLCBwb3NpdGlvbiwgY2FwdHVyZXMsIG5hbWVkQ2FwdHVyZXMsIHJlcGxhY2VtZW50KSB7XG4gICAgdmFyIHRhaWxQb3MgPSBwb3NpdGlvbiArIG1hdGNoZWQubGVuZ3RoO1xuICAgIHZhciBtID0gY2FwdHVyZXMubGVuZ3RoO1xuICAgIHZhciBzeW1ib2xzID0gU1VCU1RJVFVUSU9OX1NZTUJPTFNfTk9fTkFNRUQ7XG4gICAgaWYgKG5hbWVkQ2FwdHVyZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgbmFtZWRDYXB0dXJlcyA9IHRvT2JqZWN0KG5hbWVkQ2FwdHVyZXMpO1xuICAgICAgc3ltYm9scyA9IFNVQlNUSVRVVElPTl9TWU1CT0xTO1xuICAgIH1cbiAgICByZXR1cm4gJHJlcGxhY2UuY2FsbChyZXBsYWNlbWVudCwgc3ltYm9scywgZnVuY3Rpb24gKG1hdGNoLCBjaCkge1xuICAgICAgdmFyIGNhcHR1cmU7XG4gICAgICBzd2l0Y2ggKGNoLmNoYXJBdCgwKSkge1xuICAgICAgICBjYXNlICckJzogcmV0dXJuICckJztcbiAgICAgICAgY2FzZSAnJic6IHJldHVybiBtYXRjaGVkO1xuICAgICAgICBjYXNlICdgJzogcmV0dXJuIHN0ci5zbGljZSgwLCBwb3NpdGlvbik7XG4gICAgICAgIGNhc2UgXCInXCI6IHJldHVybiBzdHIuc2xpY2UodGFpbFBvcyk7XG4gICAgICAgIGNhc2UgJzwnOlxuICAgICAgICAgIGNhcHR1cmUgPSBuYW1lZENhcHR1cmVzW2NoLnNsaWNlKDEsIC0xKV07XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6IC8vIFxcZFxcZD9cbiAgICAgICAgICB2YXIgbiA9ICtjaDtcbiAgICAgICAgICBpZiAobiA9PT0gMCkgcmV0dXJuIG1hdGNoO1xuICAgICAgICAgIGlmIChuID4gbSkge1xuICAgICAgICAgICAgdmFyIGYgPSBmbG9vcihuIC8gMTApO1xuICAgICAgICAgICAgaWYgKGYgPT09IDApIHJldHVybiBtYXRjaDtcbiAgICAgICAgICAgIGlmIChmIDw9IG0pIHJldHVybiBjYXB0dXJlc1tmIC0gMV0gPT09IHVuZGVmaW5lZCA/IGNoLmNoYXJBdCgxKSA6IGNhcHR1cmVzW2YgLSAxXSArIGNoLmNoYXJBdCgxKTtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgICB9XG4gICAgICAgICAgY2FwdHVyZSA9IGNhcHR1cmVzW24gLSAxXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjYXB0dXJlID09PSB1bmRlZmluZWQgPyAnJyA6IGNhcHR1cmU7XG4gICAgfSk7XG4gIH1cbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xucmVxdWlyZSgnLi9lczYucmVnZXhwLmZsYWdzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciAkZmxhZ3MgPSByZXF1aXJlKCcuL19mbGFncycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKTtcbnZhciBUT19TVFJJTkcgPSAndG9TdHJpbmcnO1xudmFyICR0b1N0cmluZyA9IC8uL1tUT19TVFJJTkddO1xuXG52YXIgZGVmaW5lID0gZnVuY3Rpb24gKGZuKSB7XG4gIHJlcXVpcmUoJy4vX3JlZGVmaW5lJykoUmVnRXhwLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmbiwgdHJ1ZSk7XG59O1xuXG4vLyAyMS4yLjUuMTQgUmVnRXhwLnByb3RvdHlwZS50b1N0cmluZygpXG5pZiAocmVxdWlyZSgnLi9fZmFpbHMnKShmdW5jdGlvbiAoKSB7IHJldHVybiAkdG9TdHJpbmcuY2FsbCh7IHNvdXJjZTogJ2EnLCBmbGFnczogJ2InIH0pICE9ICcvYS9iJzsgfSkpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHZhciBSID0gYW5PYmplY3QodGhpcyk7XG4gICAgcmV0dXJuICcvJy5jb25jYXQoUi5zb3VyY2UsICcvJyxcbiAgICAgICdmbGFncycgaW4gUiA/IFIuZmxhZ3MgOiAhREVTQ1JJUFRPUlMgJiYgUiBpbnN0YW5jZW9mIFJlZ0V4cCA/ICRmbGFncy5jYWxsKFIpIDogdW5kZWZpbmVkKTtcbiAgfSk7XG4vLyBGRjQ0LSBSZWdFeHAjdG9TdHJpbmcgaGFzIGEgd3JvbmcgbmFtZVxufSBlbHNlIGlmICgkdG9TdHJpbmcubmFtZSAhPSBUT19TVFJJTkcpIHtcbiAgZGVmaW5lKGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAkdG9TdHJpbmcuY2FsbCh0aGlzKTtcbiAgfSk7XG59XG4iLCIndXNlIHN0cmljdCc7XG52YXIgc3Ryb25nID0gcmVxdWlyZSgnLi9fY29sbGVjdGlvbi1zdHJvbmcnKTtcbnZhciB2YWxpZGF0ZSA9IHJlcXVpcmUoJy4vX3ZhbGlkYXRlLWNvbGxlY3Rpb24nKTtcbnZhciBTRVQgPSAnU2V0JztcblxuLy8gMjMuMiBTZXQgT2JqZWN0c1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL19jb2xsZWN0aW9uJykoU0VULCBmdW5jdGlvbiAoZ2V0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKSB7IHJldHVybiBnZXQodGhpcywgYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwge1xuICAvLyAyMy4yLjMuMSBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICByZXR1cm4gc3Ryb25nLmRlZih2YWxpZGF0ZSh0aGlzLCBTRVQpLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gIH1cbn0sIHN0cm9uZyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJGF0ID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uICgpIHtcbiAgdmFyIE8gPSB0aGlzLl90O1xuICB2YXIgaW5kZXggPSB0aGlzLl9pO1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBPLmxlbmd0aCkgcmV0dXJuIHsgdmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZSB9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4geyB2YWx1ZTogcG9pbnQsIGRvbmU6IGZhbHNlIH07XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIEIuMi4zLjEwIFN0cmluZy5wcm90b3R5cGUubGluayh1cmwpXG5yZXF1aXJlKCcuL19zdHJpbmctaHRtbCcpKCdsaW5rJywgZnVuY3Rpb24gKGNyZWF0ZUhUTUwpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGxpbmsodXJsKSB7XG4gICAgcmV0dXJuIGNyZWF0ZUhUTUwodGhpcywgJ2EnLCAnaHJlZicsIHVybCk7XG4gIH07XG59KTtcbiIsIi8vIDIxLjEuMy4xOCBTdHJpbmcucHJvdG90eXBlLnN0YXJ0c1dpdGgoc2VhcmNoU3RyaW5nIFssIHBvc2l0aW9uIF0pXG4ndXNlIHN0cmljdCc7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJyk7XG52YXIgY29udGV4dCA9IHJlcXVpcmUoJy4vX3N0cmluZy1jb250ZXh0Jyk7XG52YXIgU1RBUlRTX1dJVEggPSAnc3RhcnRzV2l0aCc7XG52YXIgJHN0YXJ0c1dpdGggPSAnJ1tTVEFSVFNfV0lUSF07XG5cbiRleHBvcnQoJGV4cG9ydC5QICsgJGV4cG9ydC5GICogcmVxdWlyZSgnLi9fZmFpbHMtaXMtcmVnZXhwJykoU1RBUlRTX1dJVEgpLCAnU3RyaW5nJywge1xuICBzdGFydHNXaXRoOiBmdW5jdGlvbiBzdGFydHNXaXRoKHNlYXJjaFN0cmluZyAvKiAsIHBvc2l0aW9uID0gMCAqLykge1xuICAgIHZhciB0aGF0ID0gY29udGV4dCh0aGlzLCBzZWFyY2hTdHJpbmcsIFNUQVJUU19XSVRIKTtcbiAgICB2YXIgaW5kZXggPSB0b0xlbmd0aChNYXRoLm1pbihhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCwgdGhhdC5sZW5ndGgpKTtcbiAgICB2YXIgc2VhcmNoID0gU3RyaW5nKHNlYXJjaFN0cmluZyk7XG4gICAgcmV0dXJuICRzdGFydHNXaXRoXG4gICAgICA/ICRzdGFydHNXaXRoLmNhbGwodGhhdCwgc2VhcmNoLCBpbmRleClcbiAgICAgIDogdGhhdC5zbGljZShpbmRleCwgaW5kZXggKyBzZWFyY2gubGVuZ3RoKSA9PT0gc2VhcmNoO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8vIEVDTUFTY3JpcHQgNiBzeW1ib2xzIHNoaW1cbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuL19oYXMnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyk7XG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBNRVRBID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWTtcbnZhciAkZmFpbHMgPSByZXF1aXJlKCcuL19mYWlscycpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4vX3NoYXJlZCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuL191aWQnKTtcbnZhciB3a3MgPSByZXF1aXJlKCcuL193a3MnKTtcbnZhciB3a3NFeHQgPSByZXF1aXJlKCcuL193a3MtZXh0Jyk7XG52YXIgd2tzRGVmaW5lID0gcmVxdWlyZSgnLi9fd2tzLWRlZmluZScpO1xudmFyIGVudW1LZXlzID0gcmVxdWlyZSgnLi9fZW51bS1rZXlzJyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4vX2lzLWFycmF5Jyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpO1xudmFyIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG52YXIgX2NyZWF0ZSA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKTtcbnZhciBnT1BORXh0ID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4tZXh0Jyk7XG52YXIgJEdPUEQgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpO1xudmFyICREUCA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpO1xudmFyICRrZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKTtcbnZhciBnT1BEID0gJEdPUEQuZjtcbnZhciBkUCA9ICREUC5mO1xudmFyIGdPUE4gPSBnT1BORXh0LmY7XG52YXIgJFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgJEpTT04gPSBnbG9iYWwuSlNPTjtcbnZhciBfc3RyaW5naWZ5ID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5O1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIEhJRERFTiA9IHdrcygnX2hpZGRlbicpO1xudmFyIFRPX1BSSU1JVElWRSA9IHdrcygndG9QcmltaXRpdmUnKTtcbnZhciBpc0VudW0gPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTtcbnZhciBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5Jyk7XG52YXIgQWxsU3ltYm9scyA9IHNoYXJlZCgnc3ltYm9scycpO1xudmFyIE9QU3ltYm9scyA9IHNoYXJlZCgnb3Atc3ltYm9scycpO1xudmFyIE9iamVjdFByb3RvID0gT2JqZWN0W1BST1RPVFlQRV07XG52YXIgVVNFX05BVElWRSA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbic7XG52YXIgUU9iamVjdCA9IGdsb2JhbC5RT2JqZWN0O1xuLy8gRG9uJ3QgdXNlIHNldHRlcnMgaW4gUXQgU2NyaXB0LCBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMTczXG52YXIgc2V0dGVyID0gIVFPYmplY3QgfHwgIVFPYmplY3RbUFJPVE9UWVBFXSB8fCAhUU9iamVjdFtQUk9UT1RZUEVdLmZpbmRDaGlsZDtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0NSSVBUT1JTICYmICRmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBfY3JlYXRlKGRQKHt9LCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGRQKHRoaXMsICdhJywgeyB2YWx1ZTogNyB9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uIChpdCwga2V5LCBEKSB7XG4gIHZhciBwcm90b0Rlc2MgPSBnT1BEKE9iamVjdFByb3RvLCBrZXkpO1xuICBpZiAocHJvdG9EZXNjKSBkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgZFAoaXQsIGtleSwgRCk7XG4gIGlmIChwcm90b0Rlc2MgJiYgaXQgIT09IE9iamVjdFByb3RvKSBkUChPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xufSA6IGRQO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uICh0YWcpIHtcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9IF9jcmVhdGUoJFN5bWJvbFtQUk9UT1RZUEVdKTtcbiAgc3ltLl9rID0gdGFnO1xuICByZXR1cm4gc3ltO1xufTtcblxudmFyIGlzU3ltYm9sID0gVVNFX05BVElWRSAmJiB0eXBlb2YgJFN5bWJvbC5pdGVyYXRvciA9PSAnc3ltYm9sJyA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgaW5zdGFuY2VvZiAkU3ltYm9sO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpIHtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90bykgJGRlZmluZVByb3BlcnR5KE9QU3ltYm9scywga2V5LCBEKTtcbiAgYW5PYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBhbk9iamVjdChEKTtcbiAgaWYgKGhhcyhBbGxTeW1ib2xzLCBrZXkpKSB7XG4gICAgaWYgKCFELmVudW1lcmFibGUpIHtcbiAgICAgIGlmICghaGFzKGl0LCBISURERU4pKSBkUChpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkgaXRbSElEREVOXVtrZXldID0gZmFsc2U7XG4gICAgICBEID0gX2NyZWF0ZShELCB7IGVudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpIH0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIGRQKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApIHtcbiAgYW5PYmplY3QoaXQpO1xuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b0lPYmplY3QoUCkpO1xuICB2YXIgaSA9IDA7XG4gIHZhciBsID0ga2V5cy5sZW5ndGg7XG4gIHZhciBrZXk7XG4gIHdoaWxlIChsID4gaSkgJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCkge1xuICByZXR1cm4gUCA9PT0gdW5kZWZpbmVkID8gX2NyZWF0ZShpdCkgOiAkZGVmaW5lUHJvcGVydGllcyhfY3JlYXRlKGl0KSwgUCk7XG59O1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IGZ1bmN0aW9uIHByb3BlcnR5SXNFbnVtZXJhYmxlKGtleSkge1xuICB2YXIgRSA9IGlzRW51bS5jYWxsKHRoaXMsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpO1xuICBpZiAodGhpcyA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIEUgfHwgIWhhcyh0aGlzLCBrZXkpIHx8ICFoYXMoQWxsU3ltYm9scywga2V5KSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1ba2V5XSA/IEUgOiB0cnVlO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpIHtcbiAgaXQgPSB0b0lPYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBpZiAoaXQgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKSByZXR1cm47XG4gIHZhciBEID0gZ09QRChpdCwga2V5KTtcbiAgaWYgKEQgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIShoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKSkgRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCkge1xuICB2YXIgbmFtZXMgPSBnT1BOKHRvSU9iamVjdChpdCkpO1xuICB2YXIgcmVzdWx0ID0gW107XG4gIHZhciBpID0gMDtcbiAgdmFyIGtleTtcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIHtcbiAgICBpZiAoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOICYmIGtleSAhPSBNRVRBKSByZXN1bHQucHVzaChrZXkpO1xuICB9IHJldHVybiByZXN1bHQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpIHtcbiAgdmFyIElTX09QID0gaXQgPT09IE9iamVjdFByb3RvO1xuICB2YXIgbmFtZXMgPSBnT1BOKElTX09QID8gT1BTeW1ib2xzIDogdG9JT2JqZWN0KGl0KSk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGkgPSAwO1xuICB2YXIga2V5O1xuICB3aGlsZSAobmFtZXMubGVuZ3RoID4gaSkge1xuICAgIGlmIChoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYgKElTX09QID8gaGFzKE9iamVjdFByb3RvLCBrZXkpIDogdHJ1ZSkpIHJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYgKCFVU0VfTkFUSVZFKSB7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKSB0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvciEnKTtcbiAgICB2YXIgdGFnID0gdWlkKGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTtcbiAgICB2YXIgJHNldCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvKSAkc2V0LmNhbGwoT1BTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZiAoaGFzKHRoaXMsIEhJRERFTikgJiYgaGFzKHRoaXNbSElEREVOXSwgdGFnKSkgdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG4gICAgfTtcbiAgICBpZiAoREVTQ1JJUFRPUlMgJiYgc2V0dGVyKSBzZXRTeW1ib2xEZXNjKE9iamVjdFByb3RvLCB0YWcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCBzZXQ6ICRzZXQgfSk7XG4gICAgcmV0dXJuIHdyYXAodGFnKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEVdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5faztcbiAgfSk7XG5cbiAgJEdPUEQuZiA9ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICREUC5mID0gJGRlZmluZVByb3BlcnR5O1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmYgPSBnT1BORXh0LmYgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpLmYgPSAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1nb3BzJykuZiA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgaWYgKERFU0NSSVBUT1JTICYmICFyZXF1aXJlKCcuL19saWJyYXJ5JykpIHtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxuXG4gIHdrc0V4dC5mID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gd3JhcCh3a3MobmFtZSkpO1xuICB9O1xufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7IFN5bWJvbDogJFN5bWJvbCB9KTtcblxuZm9yICh2YXIgZXM2U3ltYm9scyA9IChcbiAgLy8gMTkuNC4yLjIsIDE5LjQuMi4zLCAxOS40LjIuNCwgMTkuNC4yLjYsIDE5LjQuMi44LCAxOS40LjIuOSwgMTkuNC4yLjEwLCAxOS40LjIuMTEsIDE5LjQuMi4xMiwgMTkuNC4yLjEzLCAxOS40LjIuMTRcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBqID0gMDsgZXM2U3ltYm9scy5sZW5ndGggPiBqOyl3a3MoZXM2U3ltYm9sc1tqKytdKTtcblxuZm9yICh2YXIgd2VsbEtub3duU3ltYm9scyA9ICRrZXlzKHdrcy5zdG9yZSksIGsgPSAwOyB3ZWxsS25vd25TeW1ib2xzLmxlbmd0aCA+IGs7KSB3a3NEZWZpbmUod2VsbEtub3duU3ltYm9sc1trKytdKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ1N5bWJvbCcsIHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbiAoa2V5KSB7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihzeW0pIHtcbiAgICBpZiAoIWlzU3ltYm9sKHN5bSkpIHRocm93IFR5cGVFcnJvcihzeW0gKyAnIGlzIG5vdCBhIHN5bWJvbCEnKTtcbiAgICBmb3IgKHZhciBrZXkgaW4gU3ltYm9sUmVnaXN0cnkpIGlmIChTeW1ib2xSZWdpc3RyeVtrZXldID09PSBzeW0pIHJldHVybiBrZXk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24gKCkgeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uICgpIHsgc2V0dGVyID0gZmFsc2U7IH1cbn0pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnT2JqZWN0Jywge1xuICAvLyAxOS4xLjIuMiBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4gIGNyZWF0ZTogJGNyZWF0ZSxcbiAgLy8gMTkuMS4yLjQgT2JqZWN0LmRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpXG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIDE5LjEuMi4zIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpXG4gIGRlZmluZVByb3BlcnRpZXM6ICRkZWZpbmVQcm9wZXJ0aWVzLFxuICAvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogJGdldE93blByb3BlcnR5RGVzY3JpcHRvcixcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIDE5LjEuMi44IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoTylcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiAkZ2V0T3duUHJvcGVydHlTeW1ib2xzXG59KTtcblxuLy8gMjQuMy4yIEpTT04uc3RyaW5naWZ5KHZhbHVlIFssIHJlcGxhY2VyIFssIHNwYWNlXV0pXG4kSlNPTiAmJiAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICghVVNFX05BVElWRSB8fCAkZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7IGE6IFMgfSkgIT0gJ3t9JyB8fCBfc3RyaW5naWZ5KE9iamVjdChTKSkgIT0gJ3t9Jztcbn0pKSwgJ0pTT04nLCB7XG4gIHN0cmluZ2lmeTogZnVuY3Rpb24gc3RyaW5naWZ5KGl0KSB7XG4gICAgdmFyIGFyZ3MgPSBbaXRdO1xuICAgIHZhciBpID0gMTtcbiAgICB2YXIgcmVwbGFjZXIsICRyZXBsYWNlcjtcbiAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGkpIGFyZ3MucHVzaChhcmd1bWVudHNbaSsrXSk7XG4gICAgJHJlcGxhY2VyID0gcmVwbGFjZXIgPSBhcmdzWzFdO1xuICAgIGlmICghaXNPYmplY3QocmVwbGFjZXIpICYmIGl0ID09PSB1bmRlZmluZWQgfHwgaXNTeW1ib2woaXQpKSByZXR1cm47IC8vIElFOCByZXR1cm5zIHN0cmluZyBvbiB1bmRlZmluZWRcbiAgICBpZiAoIWlzQXJyYXkocmVwbGFjZXIpKSByZXBsYWNlciA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgICBpZiAodHlwZW9mICRyZXBsYWNlciA9PSAnZnVuY3Rpb24nKSB2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgaWYgKCFpc1N5bWJvbCh2YWx1ZSkpIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7XG4iLCIvLyBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1vYmplY3QtdmFsdWVzLWVudHJpZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG52YXIgJHZhbHVlcyA9IHJlcXVpcmUoJy4vX29iamVjdC10by1hcnJheScpKGZhbHNlKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7XG4gIHZhbHVlczogZnVuY3Rpb24gdmFsdWVzKGl0KSB7XG4gICAgcmV0dXJuICR2YWx1ZXMoaXQpO1xuICB9XG59KTtcbiIsInJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKSgnYXN5bmNJdGVyYXRvcicpO1xuIiwidmFyICRpdGVyYXRvcnMgPSByZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdldEtleXMgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKTtcbnZhciBoaWRlID0gcmVxdWlyZSgnLi9faGlkZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpO1xudmFyIHdrcyA9IHJlcXVpcmUoJy4vX3drcycpO1xudmFyIElURVJBVE9SID0gd2tzKCdpdGVyYXRvcicpO1xudmFyIFRPX1NUUklOR19UQUcgPSB3a3MoJ3RvU3RyaW5nVGFnJyk7XG52YXIgQXJyYXlWYWx1ZXMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbnZhciBET01JdGVyYWJsZXMgPSB7XG4gIENTU1J1bGVMaXN0OiB0cnVlLCAvLyBUT0RPOiBOb3Qgc3BlYyBjb21wbGlhbnQsIHNob3VsZCBiZSBmYWxzZS5cbiAgQ1NTU3R5bGVEZWNsYXJhdGlvbjogZmFsc2UsXG4gIENTU1ZhbHVlTGlzdDogZmFsc2UsXG4gIENsaWVudFJlY3RMaXN0OiBmYWxzZSxcbiAgRE9NUmVjdExpc3Q6IGZhbHNlLFxuICBET01TdHJpbmdMaXN0OiBmYWxzZSxcbiAgRE9NVG9rZW5MaXN0OiB0cnVlLFxuICBEYXRhVHJhbnNmZXJJdGVtTGlzdDogZmFsc2UsXG4gIEZpbGVMaXN0OiBmYWxzZSxcbiAgSFRNTEFsbENvbGxlY3Rpb246IGZhbHNlLFxuICBIVE1MQ29sbGVjdGlvbjogZmFsc2UsXG4gIEhUTUxGb3JtRWxlbWVudDogZmFsc2UsXG4gIEhUTUxTZWxlY3RFbGVtZW50OiBmYWxzZSxcbiAgTWVkaWFMaXN0OiB0cnVlLCAvLyBUT0RPOiBOb3Qgc3BlYyBjb21wbGlhbnQsIHNob3VsZCBiZSBmYWxzZS5cbiAgTWltZVR5cGVBcnJheTogZmFsc2UsXG4gIE5hbWVkTm9kZU1hcDogZmFsc2UsXG4gIE5vZGVMaXN0OiB0cnVlLFxuICBQYWludFJlcXVlc3RMaXN0OiBmYWxzZSxcbiAgUGx1Z2luOiBmYWxzZSxcbiAgUGx1Z2luQXJyYXk6IGZhbHNlLFxuICBTVkdMZW5ndGhMaXN0OiBmYWxzZSxcbiAgU1ZHTnVtYmVyTGlzdDogZmFsc2UsXG4gIFNWR1BhdGhTZWdMaXN0OiBmYWxzZSxcbiAgU1ZHUG9pbnRMaXN0OiBmYWxzZSxcbiAgU1ZHU3RyaW5nTGlzdDogZmFsc2UsXG4gIFNWR1RyYW5zZm9ybUxpc3Q6IGZhbHNlLFxuICBTb3VyY2VCdWZmZXJMaXN0OiBmYWxzZSxcbiAgU3R5bGVTaGVldExpc3Q6IHRydWUsIC8vIFRPRE86IE5vdCBzcGVjIGNvbXBsaWFudCwgc2hvdWxkIGJlIGZhbHNlLlxuICBUZXh0VHJhY2tDdWVMaXN0OiBmYWxzZSxcbiAgVGV4dFRyYWNrTGlzdDogZmFsc2UsXG4gIFRvdWNoTGlzdDogZmFsc2Vcbn07XG5cbmZvciAodmFyIGNvbGxlY3Rpb25zID0gZ2V0S2V5cyhET01JdGVyYWJsZXMpLCBpID0gMDsgaSA8IGNvbGxlY3Rpb25zLmxlbmd0aDsgaSsrKSB7XG4gIHZhciBOQU1FID0gY29sbGVjdGlvbnNbaV07XG4gIHZhciBleHBsaWNpdCA9IERPTUl0ZXJhYmxlc1tOQU1FXTtcbiAgdmFyIENvbGxlY3Rpb24gPSBnbG9iYWxbTkFNRV07XG4gIHZhciBwcm90byA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIHZhciBrZXk7XG4gIGlmIChwcm90bykge1xuICAgIGlmICghcHJvdG9bSVRFUkFUT1JdKSBoaWRlKHByb3RvLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xuICAgIGlmICghcHJvdG9bVE9fU1RSSU5HX1RBR10pIGhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICAgIEl0ZXJhdG9yc1tOQU1FXSA9IEFycmF5VmFsdWVzO1xuICAgIGlmIChleHBsaWNpdCkgZm9yIChrZXkgaW4gJGl0ZXJhdG9ycykgaWYgKCFwcm90b1trZXldKSByZWRlZmluZShwcm90bywga2V5LCAkaXRlcmF0b3JzW2tleV0sIHRydWUpO1xuICB9XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBQYXJ0aWNsZXNfMSA9IHJlcXVpcmUoXCIuLi9QYXJ0aWNsZXMvUGFydGljbGVzXCIpO1xudmFyIFN0YXJzXzEgPSByZXF1aXJlKFwiLi9TdGFyc1wiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIGNhbnZhcyA9IG5ldyBQYXJ0aWNsZXNfMS5kZWZhdWx0KCcjcGFydGljbGVzJywgJzJkJyk7XG5jYW52YXMuc2V0UGFydGljbGVTZXR0aW5ncyhTdGFyc18xLlN0YXJzLlBhcnRpY2xlcyk7XG5jYW52YXMuc2V0SW50ZXJhY3RpdmVTZXR0aW5ncyhTdGFyc18xLlN0YXJzLkludGVyYWN0aXZlKTtcbmNhbnZhcy5zdGFydCgpO1xudmFyIHBhdXNlZCA9IGZhbHNlO1xuV2ViUGFnZV8xLlNjcm9sbEhvb2suYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24gKCkge1xuICAgIGlmIChXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdjYW52YXMnKS5pblZpZXcoKSkge1xuICAgICAgICBpZiAocGF1c2VkKSB7XG4gICAgICAgICAgICBwYXVzZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGNhbnZhcy5yZXN1bWUoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYgKCFwYXVzZWQpIHtcbiAgICAgICAgICAgIHBhdXNlZCA9IHRydWU7XG4gICAgICAgICAgICBjYW52YXMucGF1c2UoKTtcbiAgICAgICAgfVxuICAgIH1cbn0sIHtcbiAgICBjYXB0dXJlOiB0cnVlLFxuICAgIHBhc3NpdmU6IHRydWVcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlN0YXJzID0ge1xuICAgIFBhcnRpY2xlczoge1xuICAgICAgICBudW1iZXI6IDMwMCxcbiAgICAgICAgZGVuc2l0eTogMjAwLFxuICAgICAgICBjb2xvcjogJyNGRkZGRkYnLFxuICAgICAgICBvcGFjaXR5OiAncmFuZG9tJyxcbiAgICAgICAgcmFkaXVzOiBbMiwgMi41LCAzLCAzLjUsIDQsIDQuNV0sXG4gICAgICAgIHNoYXBlOiAnY2lyY2xlJyxcbiAgICAgICAgc3Ryb2tlOiB7XG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCdcbiAgICAgICAgfSxcbiAgICAgICAgbW92ZToge1xuICAgICAgICAgICAgc3BlZWQ6IDAuMixcbiAgICAgICAgICAgIGRpcmVjdGlvbjogJ3JhbmRvbScsXG4gICAgICAgICAgICBzdHJhaWdodDogZmFsc2UsXG4gICAgICAgICAgICByYW5kb206IHRydWUsXG4gICAgICAgICAgICBlZGdlQm91bmNlOiBmYWxzZSxcbiAgICAgICAgICAgIGF0dHJhY3Q6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgcmVzaXplOiB0cnVlLFxuICAgICAgICAgICAgaG92ZXI6ICdidWJibGUnLFxuICAgICAgICAgICAgY2xpY2s6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGU6IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IHtcbiAgICAgICAgICAgICAgICBzcGVlZDogMC4yLFxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBzeW5jOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhZGl1czoge1xuICAgICAgICAgICAgICAgIHNwZWVkOiAzLFxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBzeW5jOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBJbnRlcmFjdGl2ZToge1xuICAgICAgICBob3Zlcjoge1xuICAgICAgICAgICAgYnViYmxlOiB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6IDc1LFxuICAgICAgICAgICAgICAgIHJhZGl1czogOCxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbnZhciBDb21wb25lbnRzO1xuKGZ1bmN0aW9uIChDb21wb25lbnRzKSB7XG4gICAgdmFyIEhlbHBlcnM7XG4gICAgKGZ1bmN0aW9uIChIZWxwZXJzKSB7XG4gICAgICAgIGZ1bmN0aW9uIHJ1bklmRGVmaW5lZChfdGhpcywgbWV0aG9kLCBkYXRhKSB7XG4gICAgICAgICAgICBpZiAoX3RoaXNbbWV0aG9kXSAmJiBfdGhpc1ttZXRob2RdIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBfdGhpc1ttZXRob2RdKGRhdGEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEhlbHBlcnMucnVuSWZEZWZpbmVkID0gcnVuSWZEZWZpbmVkO1xuICAgICAgICBmdW5jdGlvbiBhdHRhY2hJbnRlcmZhY2UoX3RoaXMsIG5hbWUpIHtcbiAgICAgICAgICAgIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoX3RoaXMsIG5hbWUsIHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogSW50ZXJmYWNlW25hbWVdLFxuICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IGZhbHNlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBIZWxwZXJzLmF0dGFjaEludGVyZmFjZSA9IGF0dGFjaEludGVyZmFjZTtcbiAgICB9KShIZWxwZXJzIHx8IChIZWxwZXJzID0ge30pKTtcbiAgICB2YXIgSW50ZXJmYWNlO1xuICAgIChmdW5jdGlvbiAoSW50ZXJmYWNlKSB7XG4gICAgICAgIGZ1bmN0aW9uIGFwcGVuZFRvKHBhcmVudCkge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoIXRoaXMuX21vdW50ZWQpIHtcbiAgICAgICAgICAgICAgICBFdmVudHMuZGlzcGF0Y2godGhpcywgJ21vdW50ZWQnLCB7IHBhcmVudDogcGFyZW50IH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuX21vdW50ZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIEludGVyZmFjZS5hcHBlbmRUbyA9IGFwcGVuZFRvO1xuICAgIH0pKEludGVyZmFjZSB8fCAoSW50ZXJmYWNlID0ge30pKTtcbiAgICB2YXIgRXZlbnRzO1xuICAgIChmdW5jdGlvbiAoRXZlbnRzKSB7XG4gICAgICAgIGZ1bmN0aW9uIGRpc3BhdGNoKF90aGlzLCBldmVudCwgZGF0YSkge1xuICAgICAgICAgICAgSGVscGVycy5ydW5JZkRlZmluZWQoX3RoaXMsIGV2ZW50LCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBFdmVudHMuZGlzcGF0Y2ggPSBkaXNwYXRjaDtcbiAgICB9KShFdmVudHMgfHwgKEV2ZW50cyA9IHt9KSk7XG4gICAgdmFyIF9fQmFzZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIF9fQmFzZSgpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIF9fQmFzZTtcbiAgICB9KCkpO1xuICAgIHZhciBDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoQ29tcG9uZW50LCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBDb21wb25lbnQoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXNfMSA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgICAgICBfdGhpc18xLmVsZW1lbnQgPSBudWxsO1xuICAgICAgICAgICAgX3RoaXNfMS5fbW91bnRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgX3RoaXNfMS5fc2V0dXBJbnRlcmZhY2UoKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpc18xO1xuICAgICAgICB9XG4gICAgICAgIENvbXBvbmVudC5wcm90b3R5cGUuX3NldHVwSW50ZXJmYWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgSGVscGVycy5hdHRhY2hJbnRlcmZhY2UodGhpcywgJ2FwcGVuZFRvJyk7XG4gICAgICAgIH07XG4gICAgICAgIENvbXBvbmVudC5wcm90b3R5cGUuYXBwZW5kVG8gPSBmdW5jdGlvbiAocGFyZW50KSB7IH07XG4gICAgICAgIENvbXBvbmVudC5wcm90b3R5cGUuZ2V0UmVmZXJlbmNlID0gZnVuY3Rpb24gKHJlZikge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiW3JlZj1cXFwiXCIgKyByZWYgKyBcIlxcXCJdXCIpIHx8IG51bGw7XG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBDb21wb25lbnQ7XG4gICAgfShfX0Jhc2UpKTtcbiAgICB2YXIgSW5pdGlhbGl6ZTtcbiAgICAoZnVuY3Rpb24gKEluaXRpYWxpemUpIHtcbiAgICAgICAgZnVuY3Rpb24gX19Jbml0aWFsaXplKCkge1xuICAgICAgICAgICAgdGhpcy5lbGVtZW50ID0gdGhpcy5jcmVhdGVFbGVtZW50KCk7XG4gICAgICAgICAgICBFdmVudHMuZGlzcGF0Y2godGhpcywgJ2NyZWF0ZWQnKTtcbiAgICAgICAgfVxuICAgICAgICBmdW5jdGlvbiBNYWluKF90aGlzKSB7XG4gICAgICAgICAgICAoX19Jbml0aWFsaXplLmJpbmQoX3RoaXMpKSgpO1xuICAgICAgICB9XG4gICAgICAgIEluaXRpYWxpemUuTWFpbiA9IE1haW47XG4gICAgfSkoSW5pdGlhbGl6ZSB8fCAoSW5pdGlhbGl6ZSA9IHt9KSk7XG4gICAgdmFyIEhUTUxDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoSFRNTENvbXBvbmVudCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gSFRNTENvbXBvbmVudCgpIHtcbiAgICAgICAgICAgIHZhciBfdGhpc18xID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgICAgIEluaXRpYWxpemUuTWFpbihfdGhpc18xKTtcbiAgICAgICAgICAgIHJldHVybiBfdGhpc18xO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBIVE1MQ29tcG9uZW50O1xuICAgIH0oQ29tcG9uZW50KSk7XG4gICAgQ29tcG9uZW50cy5IVE1MQ29tcG9uZW50ID0gSFRNTENvbXBvbmVudDtcbiAgICB2YXIgRGF0YUNvbXBvbmVudCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgICAgIF9fZXh0ZW5kcyhEYXRhQ29tcG9uZW50LCBfc3VwZXIpO1xuICAgICAgICBmdW5jdGlvbiBEYXRhQ29tcG9uZW50KGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBfdGhpc18xID0gX3N1cGVyLmNhbGwodGhpcykgfHwgdGhpcztcbiAgICAgICAgICAgIF90aGlzXzEuZGF0YSA9IGRhdGE7XG4gICAgICAgICAgICBJbml0aWFsaXplLk1haW4oX3RoaXNfMSk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXNfMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRGF0YUNvbXBvbmVudDtcbiAgICB9KENvbXBvbmVudCkpO1xuICAgIENvbXBvbmVudHMuRGF0YUNvbXBvbmVudCA9IERhdGFDb21wb25lbnQ7XG59KShDb21wb25lbnRzIHx8IChDb21wb25lbnRzID0ge30pKTtcbm1vZHVsZS5leHBvcnRzID0gQ29tcG9uZW50cztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBFZHVjYXRpb24gPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhFZHVjYXRpb24sIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gRWR1Y2F0aW9uKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIEVkdWNhdGlvbi5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgIEVkdWNhdGlvbi5wcm90b3R5cGUuY3JlYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgRE9NXzEuRE9NLm9uRmlyc3RBcHBlYXJhbmNlKHRoaXMuZWxlbWVudCwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgX3RoaXMuc2V0UHJvZ3Jlc3MoKTtcbiAgICAgICAgfSwgeyB0aW1lb3V0OiA1MDAsIG9mZnNldDogMC4zIH0pO1xuICAgIH07XG4gICAgRWR1Y2F0aW9uLnByb3RvdHlwZS5zZXRQcm9ncmVzcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGNvbXBsZXRlZCA9IHRoaXMuZGF0YS5jcmVkaXRzLmNvbXBsZXRlZCAvIHRoaXMuZGF0YS5jcmVkaXRzLnRvdGFsICogMTAwICsgXCIlXCI7XG4gICAgICAgIHZhciB0YWtpbmcgPSAodGhpcy5kYXRhLmNyZWRpdHMuY29tcGxldGVkICsgdGhpcy5kYXRhLmNyZWRpdHMudGFraW5nKSAvIHRoaXMuZGF0YS5jcmVkaXRzLnRvdGFsICogMTAwICsgXCIlXCI7XG4gICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdjb21wbGV0ZWRUcmFjaycpLnN0eWxlLndpZHRoID0gY29tcGxldGVkO1xuICAgICAgICB0aGlzLmdldFJlZmVyZW5jZSgndGFraW5nVHJhY2snKS5zdHlsZS53aWR0aCA9IHRha2luZztcbiAgICAgICAgdmFyIGNvbXBsZXRlZE1hcmtlciA9IHRoaXMuZ2V0UmVmZXJlbmNlKCdjb21wbGV0ZWRNYXJrZXInKTtcbiAgICAgICAgdmFyIHRha2luZ01hcmtlciA9IHRoaXMuZ2V0UmVmZXJlbmNlKCd0YWtpbmdNYXJrZXInKTtcbiAgICAgICAgY29tcGxldGVkTWFya2VyLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG4gICAgICAgIGNvbXBsZXRlZE1hcmtlci5zdHlsZS5sZWZ0ID0gY29tcGxldGVkO1xuICAgICAgICB0YWtpbmdNYXJrZXIuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgICAgdGFraW5nTWFya2VyLnN0eWxlLmxlZnQgPSB0YWtpbmc7XG4gICAgfTtcbiAgICBFZHVjYXRpb24ucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpbmxpbmVTdHlsZSA9IHtcbiAgICAgICAgICAgICctLXByb2dyZXNzLWJhci1jb2xvcic6IHRoaXMuZGF0YS5jb2xvclxuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gKEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiZWR1Y2F0aW9uIGNhcmQgaXMtdGhlbWUtc2Vjb25kYXJ5IGVsZXZhdGlvbi0xXCIsIHN0eWxlOiBpbmxpbmVTdHlsZSB9LFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjb250ZW50IHBhZGRpbmctMlwiIH0sXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJib2R5XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJoZWFkZXIgZmxleCByb3cgc20td3JhcCBtZC1ub3dyYXAgeHMteC1jZW50ZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImFcIiwgeyBjbGFzc05hbWU6IFwiaWNvbiB4cy1hdXRvXCIsIGhyZWY6IHRoaXMuZGF0YS5saW5rLCB0YXJnZXQ6IFwiX2JsYW5rXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBcIm91dC9pbWFnZXMvRWR1Y2F0aW9uL1wiICsgdGhpcy5kYXRhLmltYWdlIH0pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYWJvdXQgeHMtZnVsbFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpbnN0aXR1dGlvbiBmbGV4IHJvdyB4cy14LWNlbnRlciB4cy15LWNlbnRlciBtZC14LWJlZ2luXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImFcIiwgeyBjbGFzc05hbWU6IFwibmFtZSB4cy1mdWxsIG1kLWF1dG8gaXMtY2VudGVyLWFsaWduZWQgaXMtYm9sZC13ZWlnaHQgaXMtc2l6ZS02IGlzLWNvbG9yZWQtbGlua1wiLCBocmVmOiB0aGlzLmRhdGEubGluaywgdGFyZ2V0OiBcIl9ibGFua1wiIH0sIHRoaXMuZGF0YS5uYW1lKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwibG9jYXRpb24gbWQteC1zZWxmLWVuZCBpcy1pdGFsaWMgaXMtc2l6ZS04IGlzLWNvbG9yLWxpZ2h0XCIgfSwgdGhpcy5kYXRhLmxvY2F0aW9uKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJkZWdyZWUgZmxleCByb3cgeHMteC1jZW50ZXIgeHMteS1jZW50ZXIgbWQteC1iZWdpblwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcIm5hbWUgeHMtZnVsbCBtZC1hdXRvIGlzLWNlbnRlci1hbGlnbmVkIGlzLWJvbGQtd2VpZ2h0IGlzLXNpemUtNyBpcy1jb2xvci1saWdodFwiIH0sIHRoaXMuZGF0YS5kZWdyZWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJkYXRlIG1kLXgtc2VsZi1lbmQgaXMtaXRhbGljIGlzLXNpemUtOCBpcy1jb2xvci1saWdodFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIihcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zdGFydCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIFxcdTIwMTQgXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuZW5kLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIpXCIpKSkpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInByb2dyZXNzIGZsZXggcm93IHhzLW5vd3JhcCB4cy15LWNlbnRlciBwcm9ncmVzcy1iYXItaG92ZXItY29udGFpbmVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicHJvZ3Jlc3MtYmFyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImNvbXBsZXRlZCBtYXJrZXJcIiwgc3R5bGU6IHsgb3BhY2l0eTogMCB9LCByZWY6IFwiY29tcGxldGVkTWFya2VyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiaXMtc2l6ZS04XCIgfSwgdGhpcy5kYXRhLmNyZWRpdHMuY29tcGxldGVkKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0YWtpbmcgbWFya2VyXCIsIHN0eWxlOiB7IG9wYWNpdHk6IDAgfSwgcmVmOiBcInRha2luZ01hcmtlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlzLXNpemUtOFwiIH0sIHRoaXMuZGF0YS5jcmVkaXRzLmNvbXBsZXRlZCArIHRoaXMuZGF0YS5jcmVkaXRzLnRha2luZykpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwidHJhY2tcIiB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImJ1ZmZlclwiLCByZWY6IFwidGFraW5nVHJhY2tcIiB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImZpbGxcIiwgcmVmOiBcImNvbXBsZXRlZFRyYWNrXCIgfSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiY3JlZGl0cyBpcy1zaXplLTggeHMtYXV0b1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLmNyZWRpdHMudG90YWwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgY3JlZGl0c1wiKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaW5mbyBjb250ZW50IHBhZGRpbmcteC00IHBhZGRpbmcteS0yXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlzLWxpZ2h0LWNvbG9yIGlzLXNpemUtOCBpcy1pdGFsaWNcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiR1BBIC8gXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLmdwYS5vdmVyYWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiIChvdmVyYWxsKSAvIFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5ncGEubWFqb3IsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgKG1ham9yKVwiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY291cnNlc1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiaXMtYm9sZC13ZWlnaHQgaXMtc2l6ZS02XCIgfSwgXCJSZWNlbnQgQ291cnNld29ya1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwidWxcIiwgeyBjbGFzc05hbWU6IFwiZmxleCByb3cgaXMtc2l6ZS03XCIgfSwgdGhpcy5kYXRhLmNvdXJzZXMubWFwKGZ1bmN0aW9uIChjb3Vyc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7IGNsYXNzTmFtZTogXCJ4cy0xMiBtZC02XCIgfSwgY291cnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSkpKSkpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gRWR1Y2F0aW9uO1xufShDb21wb25lbnRfMS5EYXRhQ29tcG9uZW50KSk7XG5leHBvcnRzLkVkdWNhdGlvbiA9IEVkdWNhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBFeHBlcmllbmNlID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoRXhwZXJpZW5jZSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFeHBlcmllbmNlKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIEV4cGVyaWVuY2UucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICBFeHBlcmllbmNlLnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY2FyZCBpcy10aGVtZS1zZWNvbmRhcnkgZWxldmF0aW9uLTEgZXhwZXJpZW5jZVwiIH0sXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImNvbnRlbnQgcGFkZGluZy0yXCIgfSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImhlYWRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaWNvblwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGhyZWY6IHRoaXMuZGF0YS5saW5rLCB0YXJnZXQ6IFwiX2JsYW5rXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBcIi4vb3V0L2ltYWdlcy9FeHBlcmllbmNlL1wiICsgdGhpcy5kYXRhLnN2ZyArIFwiLnN2Z1wiIH0pKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29tcGFueVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGhyZWY6IHRoaXMuZGF0YS5saW5rLCB0YXJnZXQ6IFwiX2JsYW5rXCIsIGNsYXNzTmFtZTogXCJuYW1lIGlzLXNpemUtNCBpcy11cHBlcmNhc2UgaXMtY29sb3JlZC1saW5rXCIgfSwgdGhpcy5kYXRhLmNvbXBhbnkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwibG9jYXRpb24gaXMtc2l6ZS04IGlzLWl0YWxpYyBpcy1jb2xvci1saWdodFwiIH0sIHRoaXMuZGF0YS5sb2NhdGlvbikpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInJvbGVcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwibmFtZSBpcy1zaXplLTYgaXMtYm9sZC13ZWlnaHRcIiB9LCB0aGlzLmRhdGEucG9zaXRpb24pLFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZGF0ZSBpcy1zaXplLTggaXMtaXRhbGljIGlzLWNvbG9yLWxpZ2h0XCIgfSwgXCIoXCIgKyB0aGlzLmRhdGEuYmVnaW4gKyBcIiBcXHUyMDE0IFwiICsgdGhpcy5kYXRhLmVuZCArIFwiKVwiKSkpLFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImNvbnRlbnQgaW5mb1wiIH0sXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImRlc2NyaXB0aW9uIGlzLXNpemUtOCBpcy1jb2xvci1saWdodCBpcy1pdGFsaWMgaXMtanVzdGlmaWVkIGlzLXF1b3RlXCIgfSwgdGhpcy5kYXRhLmZsYXZvciksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7IGNsYXNzTmFtZTogXCJqb2IgaXMtbGVmdC1hbGlnbmVkIGlzLXNpemUtNyB4cy15LXBhZGRpbmctYmV0d2Vlbi0xXCIgfSwgdGhpcy5kYXRhLnJvbGVzLm1hcChmdW5jdGlvbiAocm9sZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCBudWxsLCByb2xlKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpKSkpKTtcbiAgICB9O1xuICAgIHJldHVybiBFeHBlcmllbmNlO1xufShDb21wb25lbnRfMS5EYXRhQ29tcG9uZW50KSk7XG5leHBvcnRzLkV4cGVyaWVuY2UgPSBFeHBlcmllbmNlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vLi4vLi4vTW9kdWxlcy9ET01cIik7XG52YXIgSGVscGVycztcbihmdW5jdGlvbiAoSGVscGVycykge1xuICAgIGZ1bmN0aW9uIGxvYWRPbkZpcnN0QXBwZWFyYW5jZShob29rLCBjbGFzc05hbWUpIHtcbiAgICAgICAgaWYgKGNsYXNzTmFtZSA9PT0gdm9pZCAwKSB7IGNsYXNzTmFtZSA9ICdwcmVsb2FkJzsgfVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgaG9vay5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSk7XG4gICAgICAgICAgICBET01fMS5ET00ub25GaXJzdEFwcGVhcmFuY2UoaG9vaywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGhvb2suY2xhc3NMaXN0LnJlbW92ZShjbGFzc05hbWUpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgIH0sIHsgb2Zmc2V0OiAwLjUgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBIZWxwZXJzLmxvYWRPbkZpcnN0QXBwZWFyYW5jZSA9IGxvYWRPbkZpcnN0QXBwZWFyYW5jZTtcbn0pKEhlbHBlcnMgfHwgKEhlbHBlcnMgPSB7fSkpO1xubW9kdWxlLmV4cG9ydHMgPSBIZWxwZXJzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBFdmVudERpc3BhdGNoZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBNZW51ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWVudSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNZW51KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5vcGVuID0gZmFsc2U7XG4gICAgICAgIF90aGlzLlJHQlJlZ0V4cCA9IC8ocmdiXFwoKFswLTldezEsM30pLCAoWzAtOV17MSwzfSksIChbMC05XXsxLDN9KVxcKSl8KHJnYmFcXCgoWzAtOV17MSwzfSksIChbMC05XXsxLDN9KSwgKFswLTldezEsM30pLCAoMCg/OlxcLlswLTldezEsMn0pPylcXCkpL2c7XG4gICAgICAgIF90aGlzLkNvbnRhaW5lciA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5tZW51Jyk7XG4gICAgICAgIF90aGlzLkhhbWJ1cmdlciA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5tZW51IC5oYW1idXJnZXInKTtcbiAgICAgICAgX3RoaXMucmVnaXN0ZXIoJ3RvZ2dsZScpO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIE1lbnUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vcGVuID0gIXRoaXMub3BlbjtcbiAgICAgICAgdGhpcy5vcGVuID8gdGhpcy5vcGVuTWVudSgpIDogdGhpcy5jbG9zZU1lbnUoKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaCgndG9nZ2xlJywgeyBvcGVuOiB0aGlzLm9wZW4gfSk7XG4gICAgfTtcbiAgICBNZW51LnByb3RvdHlwZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5Db250YWluZXIuc2V0QXR0cmlidXRlKCdvcGVuJywgJycpO1xuICAgICAgICB0aGlzLmRhcmtlbigpO1xuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUuY2xvc2VNZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLkNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoJ29wZW4nKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy51cGRhdGVDb250cmFzdCgpOyB9LCA3NTApO1xuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUuZGFya2VuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLkhhbWJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdsaWdodCcpO1xuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUubGlnaHRlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5IYW1idXJnZXIuY2xhc3NMaXN0LmFkZCgnbGlnaHQnKTtcbiAgICB9O1xuICAgIE1lbnUucHJvdG90eXBlLnVwZGF0ZUNvbnRyYXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMub3Blbikge1xuICAgICAgICAgICAgdmFyIGJhY2tncm91bmRDb2xvciA9IHRoaXMuZ2V0QmFja2dyb3VuZENvbG9yKCk7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUNvbnRyYXN0KGJhY2tncm91bmRDb2xvcik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE1lbnUucHJvdG90eXBlLmdldEJhY2tncm91bmRDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzRnJvbVBvaW50ID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQgPyAnZWxlbWVudHNGcm9tUG9pbnQnIDogJ21zRWxlbWVudHNGcm9tUG9pbnQnO1xuICAgICAgICB2YXIgX2EgPSB0aGlzLkhhbWJ1cmdlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgdG9wID0gX2EudG9wLCBsZWZ0ID0gX2EubGVmdDtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnRbZWxlbWVudHNGcm9tUG9pbnRdKGxlZnQsIHRvcCk7XG4gICAgICAgIHZhciBsZW5ndGggPSBlbGVtZW50cy5sZW5ndGg7XG4gICAgICAgIHZhciBSR0IgPSBbXTtcbiAgICAgICAgdmFyIGJhY2tncm91bmQsIHJlZ0V4UmVzdWx0O1xuICAgICAgICB2YXIgc3R5bGVzO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbmd0aDsgKytpLCB0aGlzLlJHQlJlZ0V4cC5sYXN0SW5kZXggPSAwKSB7XG4gICAgICAgICAgICBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50c1tpXSk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kID0gc3R5bGVzLmJhY2tncm91bmQgfHwgc3R5bGVzLmJhY2tncm91bmRDb2xvciArIHN0eWxlcy5iYWNrZ3JvdW5kSW1hZ2U7XG4gICAgICAgICAgICB3aGlsZSAocmVnRXhSZXN1bHQgPSB0aGlzLlJHQlJlZ0V4cC5leGVjKGJhY2tncm91bmQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ0V4UmVzdWx0WzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIFJHQiA9IHJlZ0V4UmVzdWx0LnNsaWNlKDIsIDUpLm1hcChmdW5jdGlvbiAodmFsKSB7IHJldHVybiBwYXJzZUludCh2YWwpOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJHQjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVnRXhSZXN1bHRbNV0pIHtcbiAgICAgICAgICAgICAgICAgICAgUkdCID0gcmVnRXhSZXN1bHQuc2xpY2UoNiwgMTApLm1hcChmdW5jdGlvbiAodmFsKSB7IHJldHVybiBwYXJzZUludCh2YWwpOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFSR0IuZXZlcnkoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsID09PSAwOyB9KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJHQjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUkdCO1xuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUuY2hhbmdlQ29udHJhc3QgPSBmdW5jdGlvbiAoUkdCKSB7XG4gICAgICAgIHZhciBjb250cmFzdCwgbHVtaW5hbmNlO1xuICAgICAgICBpZiAoUkdCLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgY29udHJhc3QgPSBSR0IubWFwKGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHZhbCAvIDI1NTsgfSkubWFwKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsIDw9IDAuMDM5MjggPyB2YWwgLyAxMi45MiA6IE1hdGgucG93KCh2YWwgKyAwLjA1NSkgLyAxLjA1NSwgMi40KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbHVtaW5hbmNlID0gMC4yMTI2ICogY29udHJhc3RbMF0gKyAwLjcxNTIgKiBjb250cmFzdFsxXSArIDAuMDcyMiAqIGNvbnRyYXN0WzJdO1xuICAgICAgICAgICAgaWYgKGx1bWluYW5jZSA+IDAuMTc5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXJrZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubGlnaHRlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYXJrZW4oKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIE1lbnU7XG59KEV2ZW50RGlzcGF0Y2hlcl8xLkV2ZW50cy5FdmVudERpc3BhdGNoZXIpKTtcbmV4cG9ydHMuTWVudSA9IE1lbnU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEpTWF8xID0gcmVxdWlyZShcIi4uLy4uL0RlZmluaXRpb25zL0pTWFwiKTtcbnZhciBDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRcIik7XG52YXIgUHJvamVjdCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFByb2plY3QsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUHJvamVjdCgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgICAgIF90aGlzLmluZm9EaXNwbGF5ZWQgPSBmYWxzZTtcbiAgICAgICAgcmV0dXJuIF90aGlzO1xuICAgIH1cbiAgICBQcm9qZWN0LnByb3RvdHlwZS5sZXNzSW5mbyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5pbmZvRGlzcGxheWVkID0gZmFsc2U7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfTtcbiAgICBQcm9qZWN0LnByb3RvdHlwZS50b2dnbGVJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluZm9EaXNwbGF5ZWQgPSAhdGhpcy5pbmZvRGlzcGxheWVkO1xuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgIH07XG4gICAgUHJvamVjdC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5pbmZvRGlzcGxheWVkKSB7XG4gICAgICAgICAgICB0aGlzLmdldFJlZmVyZW5jZSgnc2xpZGVyJykuc2V0QXR0cmlidXRlKCdvcGVuZWQnLCAnJyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmdldFJlZmVyZW5jZSgnc2xpZGVyJykucmVtb3ZlQXR0cmlidXRlKCdvcGVuZWQnKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdldFJlZmVyZW5jZSgnaW5mb1RleHQnKS5pbm5lckhUTUwgPSAodGhpcy5pbmZvRGlzcGxheWVkID8gJ0xlc3MnIDogJ01vcmUnKSArIFwiIEluZm9cIjtcbiAgICB9O1xuICAgIFByb2plY3QucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBpbmxpbmVTdHlsZSA9IHtcbiAgICAgICAgICAgICctLWJ1dHRvbi1iYWNrZ3JvdW5kLWNvbG9yJzogdGhpcy5kYXRhLmNvbG9yXG4gICAgICAgIH07XG4gICAgICAgIHZhciBpbWFnZVN0eWxlID0ge1xuICAgICAgICAgICAgYmFja2dyb3VuZEltYWdlOiBcInVybChcIiArIChcIi4vb3V0L2ltYWdlcy9Qcm9qZWN0cy9cIiArIHRoaXMuZGF0YS5pbWFnZSkgKyBcIilcIlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ4cy0xMiBzbS02IG1kLTRcIiB9LFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwcm9qZWN0IGNhcmQgaXMtdGhlbWUtc2Vjb25kYXJ5IGVsZXZhdGlvbi0xIGlzLWluLWdyaWRcIiwgc3R5bGU6IGlubGluZVN0eWxlIH0sXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpbWFnZVwiLCBzdHlsZTogaW1hZ2VTdHlsZSB9KSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImNvbnRlbnQgcGFkZGluZy0yXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0aXRsZVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJuYW1lIGlzLXNpemUtNiBpcy1ib2xkLXdlaWdodFwiLCBzdHlsZTogeyBjb2xvcjogdGhpcy5kYXRhLmNvbG9yIH0gfSwgdGhpcy5kYXRhLm5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwidHlwZSBpcy1zaXplLThcIiB9LCB0aGlzLmRhdGEudHlwZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJkYXRlIGlzLXNpemUtOCBpcy1jb2xvci1saWdodFwiIH0sIHRoaXMuZGF0YS5kYXRlKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYm9keVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJmbGF2b3IgaXMtc2l6ZS03XCIgfSwgdGhpcy5kYXRhLmZsYXZvcikpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInNsaWRlciBpcy10aGVtZS1zZWNvbmRhcnlcIiwgcmVmOiBcInNsaWRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImNvbnRlbnQgcGFkZGluZy00XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRpdGxlIGZsZXggcm93IHhzLXgtYmVnaW4geHMteS1jZW50ZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJpcy1zaXplLTYgaXMtYm9sZC13ZWlnaHRcIiB9LCBcIkRldGFpbHNcIiksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnRuIGNsb3NlIGlzLXN2ZyBpcy1wcmltYXJ5IHhzLXgtc2VsZi1lbmRcIiwgdGFiaW5kZXg6IFwiLTFcIiwgb25DbGljazogdGhpcy5sZXNzSW5mby5iaW5kKHRoaXMpIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYXMgZmEtdGltZXNcIiB9KSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYm9keVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7IGNsYXNzTmFtZTogXCJkZXRhaWxzIHhzLXktcGFkZGluZy1iZXR3ZWVuLTEgaXMtc2l6ZS04XCIgfSwgdGhpcy5kYXRhLmRldGFpbHMubWFwKGZ1bmN0aW9uIChkZXRhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgZGV0YWlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpKSkpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcIm9wdGlvbnMgaXMtdGhlbWUtc2Vjb25kYXJ5IHhzLXgtbWFyZ2luLWJldHdlZW4tMVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcImluZm8gYnRuIGlzLXByaW1hcnkgaXMtdGV4dCBpcy1jdXN0b21cIiwgb25DbGljazogdGhpcy50b2dnbGVJbmZvLmJpbmQodGhpcykgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYXMgZmEtaW5mb1wiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgcmVmOiBcImluZm9UZXh0XCIgfSwgXCJNb3JlIEluZm9cIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLnJlcG8gP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgY2xhc3NOYW1lOiBcImNvZGUgYnRuIGlzLXByaW1hcnkgaXMtdGV4dCBpcy1jdXN0b21cIiwgaHJlZjogdGhpcy5kYXRhLnJlcG8sIHRhcmdldDogXCJfYmxhbmtcIiwgdGFiaW5kZXg6IFwiMFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImZhcyBmYS1jb2RlXCIgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIFwiU2VlIENvZGVcIikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLmV4dGVybmFsID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJleHRlcm5hbCBidG4gaXMtcHJpbWFyeSBpcy10ZXh0IGlzLWN1c3RvbVwiLCBocmVmOiB0aGlzLmRhdGEuZXh0ZXJuYWwsIHRhcmdldDogXCJfYmxhbmtcIiwgdGFiaW5kZXg6IFwiMFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImZhcyBmYS1leHRlcm5hbC1saW5rLWFsdFwiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBcIlZpZXcgT25saW5lXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCkpKSkpO1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50O1xuICAgIH07XG4gICAgcmV0dXJuIFByb2plY3Q7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuUHJvamVjdCA9IFByb2plY3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEpTWF8xID0gcmVxdWlyZShcIi4uLy4uL0RlZmluaXRpb25zL0pTWFwiKTtcbnZhciBDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRcIik7XG52YXIgUXVhbGl0eSA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFF1YWxpdHksIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gUXVhbGl0eShkYXRhKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIuY2FsbCh0aGlzLCBkYXRhKSB8fCB0aGlzO1xuICAgIH1cbiAgICBRdWFsaXR5LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgUXVhbGl0eS5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInhzLTEyIHNtLTRcIiB9LFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImlcIiwgeyBjbGFzc05hbWU6IFwiaWNvbiBcIiArIHRoaXMuZGF0YS5mYUNsYXNzIH0pLFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwicXVhbGl0eSBpcy1zaXplLTUgaXMtdXBwZXJjYXNlXCIgfSwgdGhpcy5kYXRhLm5hbWUpLFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiZGVzYyBpcy1saWdodC13ZWlnaHQgaXMtc2l6ZS02XCIgfSwgdGhpcy5kYXRhLmRlc2NyaXB0aW9uKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIFF1YWxpdHk7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuUXVhbGl0eSA9IFF1YWxpdHk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBTZWN0aW9uID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTZWN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5lbGVtZW50ID0gZWxlbWVudDtcbiAgICB9XG4gICAgU2VjdGlvbi5wcm90b3R5cGUuaW5WaWV3ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gRE9NXzEuRE9NLmluVmlldyh0aGlzLmVsZW1lbnQpO1xuICAgIH07XG4gICAgU2VjdGlvbi5wcm90b3R5cGUuZ2V0SUQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQuaWQ7XG4gICAgfTtcbiAgICBTZWN0aW9uLnByb3RvdHlwZS5pbk1lbnUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAhdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5jb250YWlucygnbm8tbWVudScpO1xuICAgIH07XG4gICAgcmV0dXJuIFNlY3Rpb247XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gU2VjdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU1ZHXzEgPSByZXF1aXJlKFwiLi4vLi4vTW9kdWxlcy9TVkdcIik7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBTa2lsbCA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFNraWxsLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFNraWxsKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIFNraWxsLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgU2tpbGwucHJvdG90eXBlLmNyZWF0ZWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIFNWR18xLlNWRy5sb2FkU1ZHKFwiLi9vdXQvaW1hZ2VzL1NraWxscy9cIiArIHRoaXMuZGF0YS5zdmcpLnRoZW4oZnVuY3Rpb24gKHN2Zykge1xuICAgICAgICAgICAgc3ZnLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCAnaWNvbicpO1xuICAgICAgICAgICAgdmFyIGhleGFnb24gPSBfdGhpcy5nZXRSZWZlcmVuY2UoJ2hleGFnb24nKTtcbiAgICAgICAgICAgIGhleGFnb24ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoc3ZnLCBoZXhhZ29uKTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTa2lsbC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCFTa2lsbC5IZXhhZ29uU1ZHKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNyZWF0ZSBTa2lsbCBlbGVtZW50IHdpdGhvdXQgYmVpbmcgaW5pdGlhbGl6ZWQuJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7IGNsYXNzTmFtZTogJ3NraWxsJyB9LFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogJ2hleGFnb24tY29udGFpbmVyJywgc3R5bGU6IHsgY29sb3I6IHRoaXMuZGF0YS5jb2xvciB9IH0sXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInNwYW5cIiwgeyBjbGFzc05hbWU6ICd0b29sdGlwJyB9LCB0aGlzLmRhdGEubmFtZSksXG4gICAgICAgICAgICAgICAgU2tpbGwuSGV4YWdvblNWRy5jbG9uZU5vZGUodHJ1ZSkpKSk7XG4gICAgfTtcbiAgICBTa2lsbC5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgaWYgKFNraWxsLkhleGFnb25TVkcpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgU1ZHXzEuU1ZHLmxvYWRTVkcoJy4vb3V0L2ltYWdlcy9Db250ZW50L0hleGFnb24nKS50aGVuKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdoZXhhZ29uJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdyZWYnLCAnaGV4YWdvbicpO1xuICAgICAgICAgICAgICAgICAgICBTa2lsbC5IZXhhZ29uU1ZHID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gU2tpbGw7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuU2tpbGwgPSBTa2lsbDtcblNraWxsLmluaXRpYWxpemUoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBTb2NpYWwgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb2NpYWwsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU29jaWFsKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIFNvY2lhbC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgIFNvY2lhbC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInNvY2lhbFwiIH0sXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJidG4gaXMtc3ZnIGlzLXByaW1hcnlcIiwgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiB0aGlzLmRhdGEuZmFDbGFzcyB9KSkpKTtcbiAgICB9O1xuICAgIHJldHVybiBTb2NpYWw7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuU29jaWFsID0gU29jaWFsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFib3V0TWUgPSBcIkkgYW0gYW4gYXNwaXJpbmcgd2ViIGRldmVsb3BlciBhbmQgc29mdHdhcmUgZW5naW5lZXIgY2hhc2luZyBteSBwYXNzaW9uIGZvciB3b3JraW5nIHdpdGggdGVjaG5vbG9neSBhbmQgcHJvZ3JhbW1pbmcgYXQgdGhlIFVuaXZlcnNpdHkgb2YgVGV4YXMgYXQgRGFsbGFzLiBJIGNyYXZlIHRoZSBvcHBvcnR1bml0eSB0byBjb250cmlidXRlIHRvIG1lYW5pbmdmdWwgcHJvamVjdHMgdGhhdCBlbXBsb3kgbXkgY3VycmVudCBnaWZ0cyBhbmQgaW50ZXJlc3RzIHdoaWxlIGFsc28gc2hvdmluZyBtZSBvdXQgb2YgbXkgY29tZm9ydCB6b25lIHRvIGxlYXJuIG5ldyBza2lsbHMuIE15IGdvYWwgaXMgdG8gbWF4aW1pemUgZXZlcnkgZXhwZXJpZW5jZSBhcyBhbiBvcHBvcnR1bml0eSBmb3IgcGVyc29uYWwsIHByb2Zlc3Npb25hbCwgYW5kIHRlY2huaWNhbCBncm93dGguXCI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRWR1Y2F0aW9uID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ1RoZSBVbml2ZXJzaXR5IG9mIFRleGFzIGF0IERhbGxhcycsXG4gICAgICAgIGNvbG9yOiAnI0M3NUIxMicsXG4gICAgICAgIGltYWdlOiAndXRkLnN2ZycsXG4gICAgICAgIGxpbms6ICdodHRwOi8vdXRkYWxsYXMuZWR1JyxcbiAgICAgICAgbG9jYXRpb246ICdSaWNoYXJkc29uLCBUWCwgVVNBJyxcbiAgICAgICAgZGVncmVlOiAnQmFjaGVsb3Igb2YgU2NpZW5jZSBpbiBDb21wdXRlciBTY2llbmNlJyxcbiAgICAgICAgc3RhcnQ6ICdGYWxsIDIwMTgnLFxuICAgICAgICBlbmQ6ICdTcHJpbmcgMjAyMicsXG4gICAgICAgIGNyZWRpdHM6IHtcbiAgICAgICAgICAgIHRvdGFsOiAxMjQsXG4gICAgICAgICAgICBjb21wbGV0ZWQ6IDYyLFxuICAgICAgICAgICAgdGFraW5nOiAxNlxuICAgICAgICB9LFxuICAgICAgICBncGE6IHtcbiAgICAgICAgICAgIG92ZXJhbGw6ICc0LjAnLFxuICAgICAgICAgICAgbWFqb3I6ICc0LjAnXG4gICAgICAgIH0sXG4gICAgICAgIGNvdXJzZXM6IFtcbiAgICAgICAgICAgICdUd28gU2VtZXN0ZXJzIG9mIEMrKyBQcm9ncmFtbWluZycsXG4gICAgICAgICAgICAnRGlzY3JldGUgTWF0aGVtYXRpY3MgSScsXG4gICAgICAgICAgICAnRGF0YSBTY2llbmNlIHdpdGggUiBXb3Jrc2hvcCdcbiAgICAgICAgXVxuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRXhwZXJpZW5jZSA9IFtcbiAgICB7XG4gICAgICAgIHN2ZzogJ21lZGl0JyxcbiAgICAgICAgbGluazogJ2h0dHA6Ly9tZWRpdC5vbmxpbmUnLFxuICAgICAgICBjb21wYW55OiAnTWVkaXQnLFxuICAgICAgICBsb2NhdGlvbjogJ0R1YmxpbiwgSXJlbGFuZCcsXG4gICAgICAgIHBvc2l0aW9uOiAnV2ViIEFwcGxpY2F0aW9uIERldmVsb3BlcicsXG4gICAgICAgIGJlZ2luOiAnTWF5IDIwMTknLFxuICAgICAgICBlbmQ6ICdKdWx5IDIwMTknLFxuICAgICAgICBmbGF2b3I6ICdNZWRpdCBpcyBhIHN0YXJ0LXVwIGNvbXBhbnkgY29tbWl0dGVkIHRvIG1ha2luZyBtZWRpY2FsIGVkdWNhdGlvbiBtb3JlIGVmZmljaWVudCB0aHJvdWdoIHRoZWlyIG1vYmlsZSBzb2x1dGlvbnMuIEJ5IGNvbWJpbmluZyB0ZWNobm9sb2d5IHdpdGggY3VyYXRlZCBjb250ZW50LCBwcmFjdGljaW5nIHByb2Zlc3Npb25hbHMgYXJlIGdpdmVuIGEgcXVpY2ssIHVuaXF1ZSwgYW5kIHJlbGV2YW50IGxlYXJuaW5nIGV4cGVyaWVuY2UuIEkgaGFkIHRoZSBvcHBvcnR1bml0eSB0byB3b3JrIGFzIHRoZSBjb21wYW55XFwncyBmaXJzdCB3ZWIgZGV2ZWxvcGVyLCBsYXlpbmcgZG93biB0aGUgZXNzZW50aWFsIGZvdW5kYXRpb25zIGZvciBhIHdlYi1iYXNlZCB2ZXJzaW9uIG9mIHRoZWlyIGFwcGxpY2F0aW9uLicsXG4gICAgICAgIHJvbGVzOiBbXG4gICAgICAgICAgICAnQXJjaGl0ZWN0ZWQgdGhlIGluaXRpYWwgZm91bmRhdGlvbnMgZm9yIGEgZnVsbC1zY2FsZSwgc2luZ2xlLXBhZ2Ugd2ViIGFwcGxpY2F0aW9uIHVzaW5nIFZ1ZSwgVHlwZVNjcmlwdCwgYW5kIFNBU1MuJyxcbiAgICAgICAgICAgICdEZXNpZ25lZCBhbiBpbnRlcmZhY2Utb3JpZW50ZWQsIG1vZHVsYXJpemVkIHN0YXRlIG1hbmFnZW1lbnQgc3lzdGVtIHRvIHdvcmsgYmVoaW5kIHRoZSBhcHBsaWNhdGlvbi4nLFxuICAgICAgICAgICAgJ0RldmVsb3BlZCBhIFZ1ZSBjb25maWd1cmF0aW9uIGxpYnJhcnkgdG8gZW5oYW5jZSB0aGUgYWJpbGl0eSB0byBtb2NrIGFwcGxpY2F0aW9uIHN0YXRlIGluIHVuaXQgdGVzdGluZy4nLFxuICAgICAgICAgICAgJ0VzdGFibGlzaGVkIGEgY29tcHJlaGVuc2l2ZSBVSSBjb21wb25lbnQgbGlicmFyeSB0byBhY2NlbGVyYXRlIHRoZSBhYmlsaXR5IHRvIGFkZCBuZXcgY29udGVudC4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgc3ZnOiAnbGlmZWNodXJjaCcsXG4gICAgICAgIGxpbms6ICdodHRwOi8vbGlmZS5jaHVyY2gnLFxuICAgICAgICBjb21wYW55OiAnTGlmZS5DaHVyY2gnLFxuICAgICAgICBsb2NhdGlvbjogJ0VkbW9uZCwgT0ssIFVTQScsXG4gICAgICAgIHBvc2l0aW9uOiAnSW5mb3JtYXRpb24gVGVjaG5vbG9neSBJbnRlcm4nLFxuICAgICAgICBiZWdpbjogJ01heSAyMDE4JyxcbiAgICAgICAgZW5kOiAnQXVndXN0IDIwMTgnLFxuICAgICAgICBmbGF2b3I6ICdMaWZlLkNodXJjaCBpcyBhIG11bHRpLXNpdGUgY2h1cmNoIHdpdGggYSB3b3JsZHdpZGUgaW1wYWN0LCBjZW50ZXJlZCBhcm91bmQgdGhlaXIgbWlzc2lvbiB0byBcImxlYWQgcGVvcGxlIHRvIGJlY29tZSBmdWxseS1kZXZvdGVkIGZvbGxvd2VycyBvZiBDaHJpc3QuXCIgSSB3b3JrZWQgYWxvbmdzaWRlIHRoZWlyIENlbnRyYWwgSW5mb3JtYXRpb24gVGVjaG5vbG9neSB0ZWFtOiBhIGdyb3VwIGRlZGljYXRlZCB0byB1dGlsaXppbmcgdGVjaG5vbG9neSB0byBzZXJ2ZSBhbmQgZXF1aXAgdGhlIGNodXJjaC4nLFxuICAgICAgICByb2xlczogW1xuICAgICAgICAgICAgJ1NwZW50IHRpbWUgbGVhcm5pbmcgZnJvbSBoYXJkd2FyZSwgc29mdHdhcmUsIGFuZCBkYXRhYmFzZSB0ZWFtcyBpbiBhbiBBZ2lsZSBlbnZpcm9ubWVudC4nLFxuICAgICAgICAgICAgJ0Rlc2lnbmVkIGFuZCBkZXZlbG9wZWQgYSB3ZWIgYXBwbGljYXRpb24gZm9yIHJlbW90ZSB2b2x1bnRlZXIgdHJhY2tpbmcgd2l0aCBOb2RlLmpzIGFuZCBQb3N0Z3JlU1FMLicsXG4gICAgICAgICAgICAnRHluYW1pY2FsbHkgZGVwbG95ZWQgYXBwbGljYXRpb24gdG8gR29vZ2xlIENsb3VkIFBsYXRmb3JtIHVzaW5nIENsb3VkIEJ1aWxkcywgRG9ja2VyLCBhbmQgS3ViZXJuZXRlcy4nXG4gICAgICAgIF1cbiAgICB9XG5dO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlByb2plY3RzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ1BvcnRmb2xpbyBXZWJzaXRlJyxcbiAgICAgICAgY29sb3I6ICcjMjlBQjg3JyxcbiAgICAgICAgaW1hZ2U6ICdwb3J0Zm9saW8td2Vic2l0ZS5qcGcnLFxuICAgICAgICB0eXBlOiAnU2lkZSBQcm9qZWN0JyxcbiAgICAgICAgZGF0ZTogJ1NwcmluZy9TdW1tZXIgMjAxOScsXG4gICAgICAgIGZsYXZvcjogJ1BlcnNvbmFsIHdlYnNpdGUgdG8gc2hvd2Nhc2UgbXkgd29yayBhbmQgZXhwZXJpZW5jZS4nLFxuICAgICAgICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL2phY2tzb24tbmVzdGVscm9hZC9wb3J0Zm9saW8td2Vic2l0ZScsXG4gICAgICAgIGV4dGVybmFsOiAnaHR0cHM6Ly9qYWNrc29uLm5lc3RlbHJvYWQuY29tJyxcbiAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgICAgJ0ltcGxlbWVudGVkIGZyb20gc2NyYXRjaCB3aXRoIHB1cmUgVHlwZVNjcmlwdC4nLFxuICAgICAgICAgICAgJ0N1c3RvbS1tYWRlLCBkeW5hbWljIFNDU1MgbGlicmFyeS4nLFxuICAgICAgICAgICAgJ0NsYXNzLWJhc2VkLCBlYXN5LXRvLXVwZGF0ZSBKU1ggcmVuZGVyaW5nIGZvciByZWN1cnJpbmcgY29udGVudC4nLFxuICAgICAgICAgICAgJ1N1cHBvcnRzIEludGVybmV0IEV4cGxvcmVyIDExLidcbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnUG9uZGVyJyxcbiAgICAgICAgY29sb3I6ICcjRkZBNTAwJyxcbiAgICAgICAgaW1hZ2U6ICdwb25kZXIuanBnJyxcbiAgICAgICAgdHlwZTogJ1NpZGUgUHJvamVjdCcsXG4gICAgICAgIGRhdGU6ICdIYWNrVVREIDIwMTknLFxuICAgICAgICBmbGF2b3I6ICdXZWIgYW5kIG1vYmlsZSBhcHBsaWNhdGlvbiB0byBtYWtlIGdyb3VwIGJyYWluc3Rvcm1pbmcgb3JnYW5pemVkIGFuZCBlZmZpY2llbnQuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQvcG9uZGVyLWhhY2t1dGQtMTknLFxuICAgICAgICBleHRlcm5hbDogbnVsbCxcbiAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgICAgJ1dpbm5lciBvZiBcIkJlc3QgVUkvVVhcIiBmb3IgSGFja1VURCAyMDE5LicsXG4gICAgICAgICAgICAnSW1wbGVtZW50ZWQgd2l0aCBSZWFjdCBhbmQgRmlyZWJhc2UgUmVhbHRpbWUgRGF0YWJhc2UuJyxcbiAgICAgICAgICAgICdDb21wbGV0ZSBjb25uZWN0aW9uIGFuZCByZWFsdGltZSB1cGRhdGVzIHdpdGggbW9iaWxlIGNvdW50ZXJwYXJ0LicsXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0tleSBDb25zdW1lcicsXG4gICAgICAgIGNvbG9yOiAnIzdBNjlBRCcsXG4gICAgICAgIGltYWdlOiAna2V5LWNvbnN1bWVyLmpwZycsXG4gICAgICAgIHR5cGU6ICdTaWRlIFByb2plY3QnLFxuICAgICAgICBkYXRlOiAnSmFudWFyeSAyMDE5JyxcbiAgICAgICAgZmxhdm9yOiAnV2luZG93cyBjb21tYW5kIHRvIGF0dGFjaCBhIGxvdy1sZXZlbCBrZXlib2FyZCBob29rIGluIGFub3RoZXIgcnVubmluZyBwcm9jZXNzLicsXG4gICAgICAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkL2tleS1jb25zdW1lcicsXG4gICAgICAgIGV4dGVybmFsOiBudWxsLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAnSW1wbGVtZW50ZWQgd2l0aCBDKysgYW5kIFdpbmRvd3MgQVBJLicsXG4gICAgICAgICAgICAnQXR0YWNoZXMgLmRsbCBmaWxlIHRvIGFub3RoZXIgcHJvY2VzcyB0byBhdm9pZCBkZXRlY3Rpb24uJyxcbiAgICAgICAgICAgICdJbnRlcmNlcHRzIGFuZCBjaGFuZ2VzIGtleSBpbnB1dHMgb24gdGhlIGZseS4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0NvbWV0IENsaW1hdGUgQVBJJyxcbiAgICAgICAgY29sb3I6ICcjMkQ4N0M2JyxcbiAgICAgICAgaW1hZ2U6ICdjb21ldC1jbGltYXRlLmpwZycsXG4gICAgICAgIHR5cGU6ICdDbGFzcyBQcm9qZWN0JyxcbiAgICAgICAgZGF0ZTogJ05vdmVtYmVyIDIwMTgnLFxuICAgICAgICBmbGF2b3I6ICdTZWxmLXVwZGF0aW5nIEFQSSB0byBjb2xsZWN0IGN1cnJlbnQgd2VhdGhlciBhbmQgVHdpdHRlciBkYXRhIGZvciB0aGUgVW5pdmVyc2l0eSBvZiBUZXhhcyBhdCBEYWxsYXMuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQvY29tZXQtY2xpbWF0ZS1zZXJ2ZXInLFxuICAgICAgICBleHRlcm5hbDogbnVsbCxcbiAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgICAgJ0ltcGxlbWVudGVkIHdpdGggQyMgYW5kIHRoZSAuTkVUIENvcmUgbGlicmFyeS4nLFxuICAgICAgICAgICAgJ0RlcGxveWVkIHRvIEhlcm9rdSB3aXRoIFBvc3RncmVTUUwgZGF0YWJhc2UuJyxcbiAgICAgICAgICAgICdBbHdheXMgcmV0dXJucyBkYXRhIGxlc3MgdGhhbiAxMCBtaW51dGVzIG9sZC4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0NocmlzdC1DZW50ZXJlZCcsXG4gICAgICAgIGNvbG9yOiAnI0ZFOTA0RScsXG4gICAgICAgIGltYWdlOiAnY2hyaXN0LWNlbnRlcmVkLmpwZycsXG4gICAgICAgIHR5cGU6ICdTaWRlIFByb2plY3QnLFxuICAgICAgICBkYXRlOiAnRmFsbCAyMDE4JyxcbiAgICAgICAgZmxhdm9yOiAnR29vZ2xlIENocm9tZSBleHRlbnNpb24gdG8gZGVsaXZlciB0aGUgWW91VmVyc2lvbiBWZXJzZSBvZiB0aGUgRGF5IHRvIHlvdXIgbmV3IHRhYi4nLFxuICAgICAgICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL2phY2tzb24tbmVzdGVscm9hZC9jaHJpc3QtY2VudGVyZWQnLFxuICAgICAgICBleHRlcm5hbDogJ2h0dHA6Ly9iaXQubHkvY2hyaXN0LWNlbnRlcmVkJyxcbiAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgICAgJ0ltcGxlbWVudGVkIHdpdGggUmVhY3QgYW5kIENocm9tZSBBUEkuJyxcbiAgICAgICAgICAgICdDdXN0b20gdmVyc2Ugc2VhcmNoaW5nIGJ5IGtleXdvcmQgb3IgbnVtYmVyLicsXG4gICAgICAgICAgICAnR2l2ZXMgY3VycmVudCB3ZWF0aGVyIGZvciB1c2VyXFwncyBsb2NhdGlvbiB2aWEgdGhlIE9wZW5XZWF0aGVyTWFwIEFQSS4nXG4gICAgICAgIF1cbiAgICB9XG5dO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlF1YWxpdGllcyA9IFtcbiAgICB7XG4gICAgICAgIGZhQ2xhc3M6ICdmYXMgZmEtaGlzdG9yeScsXG4gICAgICAgIG5hbWU6ICdFZmZpY2llbnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgY29uc2lzdGVudGx5IGJyaW5nIGVuZXJneSwgcHJvZHVjdGl2aXR5LCBvcmdhbml6YXRpb24sIGFuZCBhZ2lsaXR5IHRvIHRoZSB0YWJsZSBhcyBhbiBlZmZlY3RpdmUgd29ya2VyIGFuZCBhIHF1aWNrIGxlYXJuZXIuJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBmYUNsYXNzOiAnZmFyIGZhLXNub3dmbGFrZScsXG4gICAgICAgIG5hbWU6ICdBdHRlbnRpdmUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RvIG1lLCBldmVyeSBkZXRhaWwgbWF0dGVycy4gSSBsb3ZlIGZvcm11bGF0aW5nIHRoZSBiaWcgcGljdHVyZSBqdXN0IGFzIG11Y2ggYXMgbWVhc3VyaW5nIG91dCB0aGUgdGlueSBkZXRhaWxzIGFuZCBlZGdlIGNhc2VzLidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgZmFDbGFzczogJ2ZhcyBmYS1mZWF0aGVyLWFsdCcsXG4gICAgICAgIG5hbWU6ICdGbGV4aWJsZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSB3b3JrIGJlc3Qgd2hlbiBJIGFtIGNoYWxsZW5nZWQuIFdoaWxlIEkgdGhyaXZlIGluIG9yZ2FuaXphdGlvbiwgSSBjYW4gYWx3YXlzIGFkYXB0IGFuZCBwaWNrIHVwIG5ldyB0aGluZ3MgaW4gYSBzd2lmdCBtYW5uZXIuJ1xuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2tpbGxzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ0MrKycsXG4gICAgICAgIHN2ZzogJ2NwbHVzcGx1cycsXG4gICAgICAgIGNvbG9yOiAnIzlCMDIzQSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0MjJyxcbiAgICAgICAgc3ZnOiAnY3NoYXJwJyxcbiAgICAgICAgY29sb3I6ICcjOUI0Rjk3J1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQ1NTJyxcbiAgICAgICAgc3ZnOiAnY3NzJyxcbiAgICAgICAgY29sb3I6ICcjM0M5Q0Q3J1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnRG9ja2VyJyxcbiAgICAgICAgc3ZnOiAnZG9ja2VyJyxcbiAgICAgICAgY29sb3I6ICcjMjJCOUVDJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnLk5FVCBDb3JlL0ZyYW1ld29yaycsXG4gICAgICAgIHN2ZzogJ2RvdG5ldCcsXG4gICAgICAgIGNvbG9yOiAnIzBGNzZCRCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0V4cHJlc3MgSlMnLFxuICAgICAgICBzdmc6ICdleHByZXNzJyxcbiAgICAgICAgY29sb3I6ICcjM0QzRDNEJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnRmlyZWJhc2UnLFxuICAgICAgICBzdmc6ICdmaXJlYmFzZScsXG4gICAgICAgIGNvbG9yOiAnI0ZGQ0EyOCdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0dpdCcsXG4gICAgICAgIHN2ZzogJ2dpdCcsXG4gICAgICAgIGNvbG9yOiAnI0YwNTAzMidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0dvb2dsZSBDbG91ZCBQbGF0Zm9ybScsXG4gICAgICAgIHN2ZzogJ2djcCcsXG4gICAgICAgIGNvbG9yOiAnIzQzODZGQSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0d1bHAnLFxuICAgICAgICBzdmc6ICdndWxwJyxcbiAgICAgICAgY29sb3I6ICcjREE0NjQ4J1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSGVyb2t1JyxcbiAgICAgICAgc3ZnOiAnaGVyb2t1JyxcbiAgICAgICAgY29sb3I6ICcjNjc2MkE2J1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSFRNTCcsXG4gICAgICAgIHN2ZzogJ2h0bWwnLFxuICAgICAgICBjb2xvcjogJyNFRjY1MkEnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdKYXZhU2NyaXB0JyxcbiAgICAgICAgc3ZnOiAnamF2YXNjcmlwdCcsXG4gICAgICAgIGNvbG9yOiAnI0YwREI0RidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0plc3QnLFxuICAgICAgICBzdmc6ICdqZXN0JyxcbiAgICAgICAgY29sb3I6ICcjQzIxMzI1J1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnS3ViZXJuZXRlcycsXG4gICAgICAgIHN2ZzogJ2t1YmVybmV0ZXMnLFxuICAgICAgICBjb2xvcjogJyMzNTZERTYnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdOb2RlLmpzJyxcbiAgICAgICAgc3ZnOiAnbm9kZWpzJyxcbiAgICAgICAgY29sb3I6ICcjOENDODRCJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnUG9zdGdyZVNRTCcsXG4gICAgICAgIHN2ZzogJ3Bvc3RncmVzcWwnLFxuICAgICAgICBjb2xvcjogJyMzMjY2OTAnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdSZWFjdCcsXG4gICAgICAgIHN2ZzogJ3JlYWN0JyxcbiAgICAgICAgY29sb3I6ICcjMDBEOEZGJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnUiBMYW5ndWFnZScsXG4gICAgICAgIHN2ZzogJ3JsYW5nJyxcbiAgICAgICAgY29sb3I6ICcjMjM2OUJDJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnU0FTUy9TQ1NTJyxcbiAgICAgICAgc3ZnOiAnc2FzcycsXG4gICAgICAgIGNvbG9yOiAnI0NENjY5QSdcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1R5cGVTY3JpcHQnLFxuICAgICAgICBzdmc6ICd0eXBlc2NyaXB0JyxcbiAgICAgICAgY29sb3I6ICcjMDA3QUNDJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnVnVlLmpzJyxcbiAgICAgICAgc3ZnOiAndnVlJyxcbiAgICAgICAgY29sb3I6ICcjNEZDMDhEJ1xuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU29jaWFsID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ0dpdEh1YicsXG4gICAgICAgIGZhQ2xhc3M6ICdmYWIgZmEtZ2l0aHViJyxcbiAgICAgICAgbGluazogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQnXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdMaW5rZWRJbicsXG4gICAgICAgIGZhQ2xhc3M6ICdmYWIgZmEtbGlua2VkaW4nLFxuICAgICAgICBsaW5rOiAnaHR0cHM6Ly93d3cubGlua2VkaW4uY29tL2luL2phY2tzb25yb2FkNy8nXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdFbWFpbCcsXG4gICAgICAgIGZhQ2xhc3M6ICdmYXMgZmEtZW52ZWxvcGUnLFxuICAgICAgICBsaW5rOiAnbWFpbHRvOmphY2tzb25AbmVzdGVscm9hZC5jb20nXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEVsZW1lbnRGYWN0b3J5O1xuKGZ1bmN0aW9uIChFbGVtZW50RmFjdG9yeSkge1xuICAgIHZhciBGcmFnbWVudCA9ICc8PjwvPic7XG4gICAgZnVuY3Rpb24gY3JlYXRlRWxlbWVudCh0YWdOYW1lLCBhdHRyaWJ1dGVzKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDI7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgY2hpbGRyZW5bX2kgLSAyXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhZ05hbWUgPT09IEZyYWdtZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCh0YWdOYW1lKTtcbiAgICAgICAgaWYgKGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9hID0gMCwgX2IgPSBPYmplY3Qua2V5cyhhdHRyaWJ1dGVzKTsgX2EgPCBfYi5sZW5ndGg7IF9hKyspIHtcbiAgICAgICAgICAgICAgICB2YXIga2V5ID0gX2JbX2FdO1xuICAgICAgICAgICAgICAgIHZhciBhdHRyaWJ1dGVWYWx1ZSA9IGF0dHJpYnV0ZXNba2V5XTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAnY2xhc3NOYW1lJykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ3N0eWxlJykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgSlN0b0NTUyhhdHRyaWJ1dGVWYWx1ZSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoJ3N0eWxlJywgYXR0cmlidXRlVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGtleS5zdGFydHNXaXRoKCdvbicpICYmIHR5cGVvZiBhdHRyaWJ1dGVWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoa2V5LnN1YnN0cmluZygyKS50b0xvd2VyQ2FzZSgpLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAnYm9vbGVhbicgJiYgYXR0cmlidXRlVmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgJycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yICh2YXIgX2MgPSAwLCBjaGlsZHJlbl8xID0gY2hpbGRyZW47IF9jIDwgY2hpbGRyZW5fMS5sZW5ndGg7IF9jKyspIHtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IGNoaWxkcmVuXzFbX2NdO1xuICAgICAgICAgICAgYXBwZW5kQ2hpbGQoZWxlbWVudCwgY2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH1cbiAgICBFbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50ID0gY3JlYXRlRWxlbWVudDtcbiAgICBmdW5jdGlvbiBhcHBlbmRDaGlsZChwYXJlbnQsIGNoaWxkKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY2hpbGQgPT09ICd1bmRlZmluZWQnIHx8IGNoaWxkID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGQpKSB7XG4gICAgICAgICAgICBmb3IgKHZhciBfaSA9IDAsIGNoaWxkXzEgPSBjaGlsZDsgX2kgPCBjaGlsZF8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGNoaWxkXzFbX2ldO1xuICAgICAgICAgICAgICAgIGFwcGVuZENoaWxkKHBhcmVudCwgdmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHBhcmVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjaGlsZCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGNoaWxkIGluc3RhbmNlb2YgTm9kZSkge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgY2hpbGQgPT09ICdib29sZWFuJykge1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFN0cmluZyhjaGlsZCkpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBFbGVtZW50RmFjdG9yeS5hcHBlbmRDaGlsZCA9IGFwcGVuZENoaWxkO1xuICAgIGZ1bmN0aW9uIEpTdG9DU1MoY3NzT2JqZWN0KSB7XG4gICAgICAgIHZhciBjc3NTdHJpbmcgPSBcIlwiO1xuICAgICAgICB2YXIgcnVsZTtcbiAgICAgICAgdmFyIHJ1bGVzID0gT2JqZWN0LmtleXMoY3NzT2JqZWN0KTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBydWxlcy5sZW5ndGg7IGkrKywgY3NzU3RyaW5nICs9ICcgJykge1xuICAgICAgICAgICAgcnVsZSA9IHJ1bGVzW2ldO1xuICAgICAgICAgICAgY3NzU3RyaW5nICs9IHJ1bGUucmVwbGFjZSgvKFtBLVpdKS9nLCBmdW5jdGlvbiAodXBwZXIpIHsgcmV0dXJuIFwiLVwiICsgdXBwZXJbMF0udG9Mb3dlckNhc2UoKTsgfSkgKyBcIjogXCIgKyBjc3NPYmplY3RbcnVsZV0gKyBcIjtcIjtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY3NzU3RyaW5nO1xuICAgIH1cbn0pKEVsZW1lbnRGYWN0b3J5ID0gZXhwb3J0cy5FbGVtZW50RmFjdG9yeSB8fCAoZXhwb3J0cy5FbGVtZW50RmFjdG9yeSA9IHt9KSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIEFib3V0XzEgPSByZXF1aXJlKFwiLi4vRGF0YS9BYm91dFwiKTtcbnZhciBRdWFsaXRpZXNfMSA9IHJlcXVpcmUoXCIuLi9EYXRhL1F1YWxpdGllc1wiKTtcbnZhciBRdWFsaXR5XzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9RdWFsaXR5XCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgIFdlYlBhZ2VfMS5GbGF2b3JUZXh0LmlubmVyVGV4dCA9IEFib3V0XzEuQWJvdXRNZTtcbn0pO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgIHZhciBvYmplY3Q7XG4gICAgZm9yICh2YXIgX2kgPSAwLCBRdWFsaXRpZXNfMiA9IFF1YWxpdGllc18xLlF1YWxpdGllczsgX2kgPCBRdWFsaXRpZXNfMi5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIHF1YWxpdHkgPSBRdWFsaXRpZXNfMltfaV07XG4gICAgICAgIG9iamVjdCA9IG5ldyBRdWFsaXR5XzEuUXVhbGl0eShxdWFsaXR5KTtcbiAgICAgICAgb2JqZWN0LmFwcGVuZFRvKFdlYlBhZ2VfMS5RdWFsaXRpZXNDb250YWluZXIpO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbldlYlBhZ2VfMS5Cb2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoKSB7XG59LCB7XG4gICAgY2FwdHVyZTogdHJ1ZSxcbiAgICBwYXNzaXZlOiB0cnVlXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgU29jaWFsXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9Tb2NpYWxcIik7XG52YXIgU29jaWFsXzIgPSByZXF1aXJlKFwiLi4vRGF0YS9Tb2NpYWxcIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgdmFyIGNhcmQ7XG4gICAgZm9yICh2YXIgX2kgPSAwLCBEYXRhXzEgPSBTb2NpYWxfMi5Tb2NpYWw7IF9pIDwgRGF0YV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgZGF0YSA9IERhdGFfMVtfaV07XG4gICAgICAgIGNhcmQgPSBuZXcgU29jaWFsXzEuU29jaWFsKGRhdGEpO1xuICAgICAgICBjYXJkLmFwcGVuZFRvKFdlYlBhZ2VfMS5Tb2NpYWxHcmlkKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgRWR1Y2F0aW9uXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9FZHVjYXRpb25cIik7XG52YXIgRWR1Y2F0aW9uXzIgPSByZXF1aXJlKFwiLi4vRGF0YS9FZHVjYXRpb25cIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgdmFyIEVkdWNhdGlvblNlY3Rpb24gPSBXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdlZHVjYXRpb24nKS5lbGVtZW50O1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gRWR1Y2F0aW9uXzIuRWR1Y2F0aW9uOyBfaSA8IERhdGFfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGRhdGEgPSBEYXRhXzFbX2ldO1xuICAgICAgICBjYXJkID0gbmV3IEVkdWNhdGlvbl8xLkVkdWNhdGlvbihkYXRhKTtcbiAgICAgICAgY2FyZC5hcHBlbmRUbyhFZHVjYXRpb25TZWN0aW9uKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgRXhwZXJpZW5jZV8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvRXhwZXJpZW5jZVwiKTtcbnZhciBFeHBlcmllbmNlXzIgPSByZXF1aXJlKFwiLi4vRGF0YS9FeHBlcmllbmNlXCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgIHZhciBFeHBlcmllbmNlU2VjdGlvbiA9IFdlYlBhZ2VfMS5TZWN0aW9ucy5nZXQoJ2V4cGVyaWVuY2UnKS5lbGVtZW50O1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gRXhwZXJpZW5jZV8yLkV4cGVyaWVuY2U7IF9pIDwgRGF0YV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgZGF0YSA9IERhdGFfMVtfaV07XG4gICAgICAgIGNhcmQgPSBuZXcgRXhwZXJpZW5jZV8xLkV4cGVyaWVuY2UoZGF0YSk7XG4gICAgICAgIGNhcmQuYXBwZW5kVG8oRXhwZXJpZW5jZVNlY3Rpb24pO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICBpZiAoIURPTV8xLkRPTS5pc0lFKCkpIHtcbiAgICAgICAgV2ViUGFnZV8xLkxvZ28uT3V0ZXIuY2xhc3NMaXN0LnJlbW92ZSgncHJlbG9hZCcpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5Mb2dvLklubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZWxvYWQnKTtcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIFdlYlBhZ2VfMS5Mb2dvLk91dGVyLmNsYXNzTmFtZSA9ICdvdXRlcic7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgV2ViUGFnZV8xLkxvZ28uSW5uZXIuY2xhc3NOYW1lID0gJ2lubmVyJztcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG5XZWJQYWdlXzEuTWVudUJ1dHRvbi5zdWJzY3JpYmUoV2ViUGFnZV8xLk1haW4sIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5uYW1lID09PSAndG9nZ2xlJykge1xuICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLm9wZW4pIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5NYWluLnNldEF0dHJpYnV0ZSgnc2hpZnRlZCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5NYWluLnJlbW92ZUF0dHJpYnV0ZSgnc2hpZnRlZCcpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5XZWJQYWdlXzEuU2Nyb2xsSG9vay5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIHNlY3Rpb247XG4gICAgdmFyIGFuY2hvcjtcbiAgICB2YXIgaXRlciA9IFdlYlBhZ2VfMS5TZWN0aW9uVG9NZW51LnZhbHVlcygpO1xuICAgIHZhciBjdXJyZW50ID0gaXRlci5uZXh0KCk7XG4gICAgZm9yICh2YXIgZG9uZSA9IGZhbHNlOyAhZG9uZTsgY3VycmVudCA9IGl0ZXIubmV4dCgpLCBkb25lID0gY3VycmVudC5kb25lKSB7XG4gICAgICAgIF9hID0gY3VycmVudC52YWx1ZSwgc2VjdGlvbiA9IF9hWzBdLCBhbmNob3IgPSBfYVsxXTtcbiAgICAgICAgaWYgKHNlY3Rpb24uaW5WaWV3KCkpIHtcbiAgICAgICAgICAgIGFuY2hvci5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yLnJlbW92ZUF0dHJpYnV0ZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0sIHtcbiAgICBjYXB0dXJlOiB0cnVlLFxuICAgIHBhc3NpdmU6IHRydWVcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIFdlYlBhZ2VfMS5NZW51QnV0dG9uLnVwZGF0ZUNvbnRyYXN0KCk7XG59LCB7XG4gICAgY2FwdHVyZTogdHJ1ZSxcbiAgICBwYXNzaXZlOiB0cnVlXG59KTtcbldlYlBhZ2VfMS5NZW51QnV0dG9uLkhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBXZWJQYWdlXzEuTWVudUJ1dHRvbi50b2dnbGUoKTtcbn0pO1xudmFyIGl0ZXIgPSBXZWJQYWdlXzEuU2VjdGlvblRvTWVudS52YWx1ZXMoKTtcbnZhciBjdXJyZW50ID0gaXRlci5uZXh0KCk7XG52YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBzZWN0aW9uO1xuICAgIHZhciBhbmNob3IgPSB2b2lkIDA7XG4gICAgX2EgPSBjdXJyZW50LnZhbHVlLCBzZWN0aW9uID0gX2FbMF0sIGFuY2hvciA9IF9hWzFdO1xuICAgIGFuY2hvci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWN0aW9uLmVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbmZvciAodmFyIGRvbmUgPSBmYWxzZTsgIWRvbmU7IGN1cnJlbnQgPSBpdGVyLm5leHQoKSwgZG9uZSA9IGN1cnJlbnQuZG9uZSkge1xuICAgIF9sb29wXzEoZG9uZSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIFByb2plY3RfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1Byb2plY3RcIik7XG52YXIgUHJvamVjdHNfMSA9IHJlcXVpcmUoXCIuLi9EYXRhL1Byb2plY3RzXCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgUHJvamVjdHNDb250YWluZXIgPSBXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdwcm9qZWN0cycpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzLWNvbnRhaW5lcicpO1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gUHJvamVjdHNfMS5Qcm9qZWN0czsgX2kgPCBEYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBkYXRhID0gRGF0YV8xW19pXTtcbiAgICAgICAgY2FyZCA9IG5ldyBQcm9qZWN0XzEuUHJvamVjdChkYXRhKTtcbiAgICAgICAgY2FyZC5hcHBlbmRUbyhQcm9qZWN0c0NvbnRhaW5lcik7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIFNraWxsXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbFwiKTtcbnZhciBTa2lsbHNfMSA9IHJlcXVpcmUoXCIuLi9EYXRhL1NraWxsc1wiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICBjcmVhdGVTa2lsbHMoU2tpbGxzXzEuU2tpbGxzKTtcbn0pO1xudmFyIGNyZWF0ZVNraWxscyA9IGZ1bmN0aW9uIChza2lsbHNEYXRhKSB7XG4gICAgU2tpbGxfMS5Ta2lsbC5pbml0aWFsaXplKCkudGhlbihmdW5jdGlvbiAoZG9uZSkge1xuICAgICAgICBpZiAoIWRvbmUpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ291bGQgbm90IGluaXRpYWxpemUgU2tpbGxzIG9iamVjdC5cIjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc2tpbGw7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgc2tpbGxzRGF0YV8xID0gc2tpbGxzRGF0YTsgX2kgPCBza2lsbHNEYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHNraWxsc0RhdGFfMVtfaV07XG4gICAgICAgICAgICBza2lsbCA9IG5ldyBTa2lsbF8xLlNraWxsKGRhdGEpO1xuICAgICAgICAgICAgc2tpbGwuYXBwZW5kVG8oV2ViUGFnZV8xLlNraWxsc0dyaWQpO1xuICAgICAgICB9XG4gICAgfSk7XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NO1xuKGZ1bmN0aW9uIChET00pIHtcbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50cyhxdWVyeSkge1xuICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChxdWVyeSk7XG4gICAgfVxuICAgIERPTS5nZXRFbGVtZW50cyA9IGdldEVsZW1lbnRzO1xuICAgIGZ1bmN0aW9uIGdldEZpcnN0RWxlbWVudChxdWVyeSkge1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRFbGVtZW50cyhxdWVyeSlbMF07XG4gICAgfVxuICAgIERPTS5nZXRGaXJzdEVsZW1lbnQgPSBnZXRGaXJzdEVsZW1lbnQ7XG4gICAgZnVuY3Rpb24gZ2V0Vmlld3BvcnQoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBoZWlnaHQ6IE1hdGgubWF4KHdpbmRvdy5pbm5lckhlaWdodCwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudEhlaWdodCksXG4gICAgICAgICAgICB3aWR0aDogTWF0aC5tYXgod2luZG93LmlubmVyV2lkdGgsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aClcbiAgICAgICAgfTtcbiAgICB9XG4gICAgRE9NLmdldFZpZXdwb3J0ID0gZ2V0Vmlld3BvcnQ7XG4gICAgZnVuY3Rpb24gc2Nyb2xsVG8oZWxlbWVudCkge1xuICAgIH1cbiAgICBET00uc2Nyb2xsVG8gPSBzY3JvbGxUbztcbiAgICBmdW5jdGlvbiBpc0lFKCkge1xuICAgICAgICByZXR1cm4gd2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQubWF0Y2goLyhNU0lFfFRyaWRlbnQpLykgIT09IG51bGw7XG4gICAgfVxuICAgIERPTS5pc0lFID0gaXNJRTtcbiAgICBmdW5jdGlvbiBsb2FkKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT09ICdjb21wbGV0ZScpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKGRvY3VtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBjYWxsYmFja18xID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2FsbGJhY2tfMSk7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnQpO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGNhbGxiYWNrXzEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgRE9NLmxvYWQgPSBsb2FkO1xuICAgIGZ1bmN0aW9uIGJvdW5kaW5nQ2xpZW50UmVjdFRvT2JqZWN0KHJlY3QpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogcmVjdC50b3AsXG4gICAgICAgICAgICByaWdodDogcmVjdC5yaWdodCxcbiAgICAgICAgICAgIGJvdHRvbTogcmVjdC5ib3R0b20sXG4gICAgICAgICAgICBsZWZ0OiByZWN0LmxlZnQsXG4gICAgICAgICAgICB3aWR0aDogcmVjdC53aWR0aCxcbiAgICAgICAgICAgIGhlaWdodDogcmVjdC5oZWlnaHQsXG4gICAgICAgICAgICB4OiByZWN0LnggPyByZWN0LnggOiAwLFxuICAgICAgICAgICAgeTogcmVjdC55ID8gcmVjdC55IDogMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBmdW5jdGlvbiBvblBhZ2UoZWxlbWVudCkge1xuICAgICAgICB2YXIgcmVjdCA9IGVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHJldHVybiAhT2JqZWN0LnZhbHVlcyhib3VuZGluZ0NsaWVudFJlY3RUb09iamVjdChyZWN0KSkuZXZlcnkoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsID09PSAwOyB9KTtcbiAgICB9XG4gICAgRE9NLm9uUGFnZSA9IG9uUGFnZTtcbiAgICBmdW5jdGlvbiBpblZpZXcoZWxlbWVudCwgb2Zmc2V0KSB7XG4gICAgICAgIGlmIChvZmZzZXQgPT09IHZvaWQgMCkgeyBvZmZzZXQgPSAwOyB9XG4gICAgICAgIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgaWYgKE9iamVjdC52YWx1ZXMoYm91bmRpbmdDbGllbnRSZWN0VG9PYmplY3QocmVjdCkpLmV2ZXJ5KGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHZhbCA9PT0gMDsgfSkpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgdmlld0hlaWdodCA9IGdldFZpZXdwb3J0KCkuaGVpZ2h0O1xuICAgICAgICBpZiAob2Zmc2V0IDw9IDEpIHtcbiAgICAgICAgICAgIG9mZnNldCA9IHZpZXdIZWlnaHQgKiBvZmZzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChyZWN0LmJvdHRvbSArIG9mZnNldCkgPj0gMCAmJiAocmVjdC50b3AgKyBvZmZzZXQgLSB2aWV3SGVpZ2h0KSA8IDA7XG4gICAgfVxuICAgIERPTS5pblZpZXcgPSBpblZpZXc7XG4gICAgZnVuY3Rpb24gb25GaXJzdEFwcGVhcmFuY2UoZWxlbWVudCwgY2FsbGJhY2ssIHNldHRpbmcpIHtcbiAgICAgICAgdmFyIHRpbWVvdXQgPSBzZXR0aW5nID8gc2V0dGluZy50aW1lb3V0IDogMDtcbiAgICAgICAgdmFyIG9mZnNldCA9IHNldHRpbmcgPyBzZXR0aW5nLm9mZnNldCA6IDA7XG4gICAgICAgIGlmIChpblZpZXcoZWxlbWVudCwgb2Zmc2V0KSkge1xuICAgICAgICAgICAgc2V0VGltZW91dChjYWxsYmFjaywgdGltZW91dCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB2YXIgZXZlbnRDYWxsYmFja18xID0gZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgaWYgKGluVmlldyhlbGVtZW50LCBvZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBldmVudENhbGxiYWNrXzEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGV2ZW50Q2FsbGJhY2tfMSwge1xuICAgICAgICAgICAgICAgIGNhcHR1cmU6IHRydWUsXG4gICAgICAgICAgICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgRE9NLm9uRmlyc3RBcHBlYXJhbmNlID0gb25GaXJzdEFwcGVhcmFuY2U7XG59KShET00gPSBleHBvcnRzLkRPTSB8fCAoZXhwb3J0cy5ET00gPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRXZlbnRzO1xuKGZ1bmN0aW9uIChFdmVudHMpIHtcbiAgICB2YXIgTmV3RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBOZXdFdmVudChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5kZXRhaWwgPSBkZXRhaWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE5ld0V2ZW50O1xuICAgIH0oKSk7XG4gICAgRXZlbnRzLk5ld0V2ZW50ID0gTmV3RXZlbnQ7XG4gICAgdmFyIEV2ZW50RGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5hZGQobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kZWxldGUobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uIChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuZXZlbnRzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBldmVudCA9IG5ldyBOZXdFdmVudChuYW1lLCBkZXRhaWwpO1xuICAgICAgICAgICAgdmFyIGl0ID0gdGhpcy5saXN0ZW5lcnMudmFsdWVzKCk7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICAgICAgICB3aGlsZSAoY2FsbGJhY2sgPSBpdC5uZXh0KCkudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RGlzcGF0Y2hlcjtcbiAgICB9KCkpO1xuICAgIEV2ZW50cy5FdmVudERpc3BhdGNoZXIgPSBFdmVudERpc3BhdGNoZXI7XG59KShFdmVudHMgPSBleHBvcnRzLkV2ZW50cyB8fCAoZXhwb3J0cy5FdmVudHMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU1ZHO1xuKGZ1bmN0aW9uIChTVkcpIHtcbiAgICBTVkcuc3ZnbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnO1xuICAgIFNWRy54bGlua25zID0gJ2h0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsnO1xuICAgIFNWRy5sb2FkU1ZHID0gZnVuY3Rpb24gKHVybCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgdmFyIHJlcXVlc3QgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICAgICAgICAgIHJlcXVlc3Qub3BlbignR0VUJywgdXJsICsgXCIuc3ZnXCIsIHRydWUpO1xuICAgICAgICAgICAgcmVxdWVzdC5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VkRG9jdW1lbnQgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKHJlcXVlc3QucmVzcG9uc2VUZXh0LCAnaW1hZ2Uvc3ZnK3htbCcpO1xuICAgICAgICAgICAgICAgIHJlc29sdmUocGFyc2VkRG9jdW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnJykpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Qub25lcnJvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZWplY3QoXCJGYWlsZWQgdG8gcmVhZCBTVkcuXCIpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJlcXVlc3Quc2VuZCgpO1xuICAgICAgICB9KTtcbiAgICB9O1xufSkoU1ZHID0gZXhwb3J0cy5TVkcgfHwgKGV4cG9ydHMuU1ZHID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4vRE9NXCIpO1xudmFyIFNlY3Rpb25fMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1NlY3Rpb25cIik7XG52YXIgTWVudV8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvTWVudVwiKTtcbmV4cG9ydHMuQm9keSA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2JvZHknKTtcbmV4cG9ydHMuTWFpbiA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ21haW4nKTtcbmV4cG9ydHMuTWFpblNjcm9sbCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ21haW4gLnNjcm9sbCcpO1xuZXhwb3J0cy5TY3JvbGxIb29rID0gRE9NXzEuRE9NLmlzSUUoKSA/IHdpbmRvdyA6IGV4cG9ydHMuTWFpblNjcm9sbDtcbmV4cG9ydHMuTG9nbyA9IHtcbiAgICBPdXRlcjogRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnaGVhZGVyLmxvZ28gLmltYWdlIGltZy5vdXRlcicpLFxuICAgIElubmVyOiBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdoZWFkZXIubG9nbyAuaW1hZ2UgaW1nLmlubmVyJylcbn07XG5leHBvcnRzLk1lbnVCdXR0b24gPSBuZXcgTWVudV8xLk1lbnUoKTtcbmV4cG9ydHMuU2VjdGlvbnMgPSBuZXcgTWFwKCk7XG5mb3IgKHZhciBfaSA9IDAsIF9hID0gQXJyYXkuZnJvbShET01fMS5ET00uZ2V0RWxlbWVudHMoJ3NlY3Rpb24nKSk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBfYVtfaV07XG4gICAgZXhwb3J0cy5TZWN0aW9ucy5zZXQoZWxlbWVudC5pZCwgbmV3IFNlY3Rpb25fMS5kZWZhdWx0KGVsZW1lbnQpKTtcbn1cbmV4cG9ydHMuU2VjdGlvblRvTWVudSA9IG5ldyBNYXAoKTtcbmZvciAodmFyIF9iID0gMCwgX2MgPSBBcnJheS5mcm9tKERPTV8xLkRPTS5nZXRFbGVtZW50cygnaGVhZGVyLm5hdmlnYXRpb24gLnNlY3Rpb25zIGEnKSk7IF9iIDwgX2MubGVuZ3RoOyBfYisrKSB7XG4gICAgdmFyIGFuY2hvciA9IF9jW19iXTtcbiAgICB2YXIgaWQgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpO1xuICAgIGlmIChleHBvcnRzLlNlY3Rpb25zLmdldChpZCkgJiYgZXhwb3J0cy5TZWN0aW9ucy5nZXQoaWQpLmluTWVudSgpKSB7XG4gICAgICAgIGV4cG9ydHMuU2VjdGlvblRvTWVudS5zZXQoaWQsIFtleHBvcnRzLlNlY3Rpb25zLmdldChpZCksIGFuY2hvcl0pO1xuICAgIH1cbn1cbmV4cG9ydHMuRmxhdm9yVGV4dCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ3NlY3Rpb24jYWJvdXQgLmZsYXZvcicpO1xuZXhwb3J0cy5RdWFsaXRpZXNDb250YWluZXIgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI2Fib3V0IC5xdWFsaXRpZXMnKTtcbmV4cG9ydHMuU2tpbGxzR3JpZCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ3NlY3Rpb24jc2tpbGxzIC5oZXgtZ3JpZCcpO1xuZXhwb3J0cy5Tb2NpYWxHcmlkID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnc2VjdGlvbiNjb25uZWN0IC5zb2NpYWwtaWNvbnMnKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbiA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQW5pbWF0aW9uKHNwZWVkLCBtYXgsIG1pbiwgaW5jcmVhc2luZykge1xuICAgICAgICBpZiAoaW5jcmVhc2luZyA9PT0gdm9pZCAwKSB7IGluY3JlYXNpbmcgPSBmYWxzZTsgfVxuICAgICAgICB0aGlzLnNwZWVkID0gc3BlZWQ7XG4gICAgICAgIHRoaXMubWF4ID0gbWF4O1xuICAgICAgICB0aGlzLm1pbiA9IG1pbjtcbiAgICAgICAgdGhpcy5pbmNyZWFzaW5nID0gaW5jcmVhc2luZztcbiAgICB9XG4gICAgcmV0dXJuIEFuaW1hdGlvbjtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBBbmltYXRpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb25GcmFtZUZ1bmN0aW9ucztcbihmdW5jdGlvbiAoQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMpIHtcbiAgICBmdW5jdGlvbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gd2luZG93LnNldFRpbWVvdXQoY2FsbGJhY2ssIDEwMDAgLyA2MCk7XG4gICAgICAgICAgICB9O1xuICAgIH1cbiAgICBBbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG4gICAgZnVuY3Rpb24gY2FuY2VsQW5pbWF0aW9uRnJhbWUoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cuY2FuY2VsQW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgY2xlYXJUaW1lb3V0O1xuICAgIH1cbiAgICBBbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IGNhbmNlbEFuaW1hdGlvbkZyYW1lO1xufSkoQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgPSBleHBvcnRzLkFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zIHx8IChleHBvcnRzLkFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENvbG9yID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBDb2xvcihyLCBnLCBiKSB7XG4gICAgICAgIHRoaXMuciA9IHI7XG4gICAgICAgIHRoaXMuZyA9IGc7XG4gICAgICAgIHRoaXMuYiA9IGI7XG4gICAgfVxuICAgIENvbG9yLmZyb21SR0IgPSBmdW5jdGlvbiAociwgZywgYikge1xuICAgICAgICBpZiAociA+PSAwICYmIHIgPCAyNTYgJiYgZyA+PSAwICYmIGcgPCAyNTYgJiYgYiA+PSAwICYmIGIgPCAyNTYpIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ29sb3IociwgZywgYik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgQ29sb3IuZnJvbU9iamVjdCA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAgICAgcmV0dXJuIENvbG9yLmZyb21SR0Iob2JqLnIsIG9iai5nLCBvYmouYik7XG4gICAgfTtcbiAgICBDb2xvci5mcm9tSGV4ID0gZnVuY3Rpb24gKGhleCkge1xuICAgICAgICByZXR1cm4gQ29sb3IuZnJvbU9iamVjdChDb2xvci5oZXhUb1JHQihoZXgpKTtcbiAgICB9O1xuICAgIENvbG9yLmhleFRvUkdCID0gZnVuY3Rpb24gKGhleCkge1xuICAgICAgICB2YXIgcmVzdWx0ID0gL14jKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdCA/IHtcbiAgICAgICAgICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxuICAgICAgICAgICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXG4gICAgICAgICAgICBiOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxuICAgICAgICB9IDogbnVsbDtcbiAgICB9O1xuICAgIENvbG9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChvcGFjaXR5KSB7XG4gICAgICAgIGlmIChvcGFjaXR5ID09PSB2b2lkIDApIHsgb3BhY2l0eSA9IDE7IH1cbiAgICAgICAgcmV0dXJuIFwicmdiYShcIiArIHRoaXMuciArIFwiLFwiICsgdGhpcy5nICsgXCIsXCIgKyB0aGlzLmIgKyBcIixcIiArIG9wYWNpdHkgKyBcIilcIjtcbiAgICB9O1xuICAgIHJldHVybiBDb2xvcjtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb2xvcjtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIENvb3JkaW5hdGUgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvb3JkaW5hdGUoeCwgeSkge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbiAgICBDb29yZGluYXRlLnByb3RvdHlwZS5kaXN0YW5jZSA9IGZ1bmN0aW9uIChjb29yZCkge1xuICAgICAgICB2YXIgZHggPSBjb29yZC54IC0gdGhpcy54O1xuICAgICAgICB2YXIgZHkgPSBjb29yZC55IC0gdGhpcy55O1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbiAgICB9O1xuICAgIENvb3JkaW5hdGUucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy54ICsgXCJ4XCIgKyB0aGlzLnk7XG4gICAgfTtcbiAgICByZXR1cm4gQ29vcmRpbmF0ZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBDb29yZGluYXRlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb25fMSA9IHJlcXVpcmUoXCIuL0FuaW1hdGlvblwiKTtcbnZhciBDb2xvcl8xID0gcmVxdWlyZShcIi4vQ29sb3JcIik7XG52YXIgQ29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vQ29vcmRpbmF0ZVwiKTtcbnZhciBTdHJva2VfMSA9IHJlcXVpcmUoXCIuL1N0cm9rZVwiKTtcbnZhciBWZWN0b3JfMSA9IHJlcXVpcmUoXCIuL1ZlY3RvclwiKTtcbnZhciBQYXJ0aWNsZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGFydGljbGUoc2V0dGluZ3MpIHtcbiAgICAgICAgdGhpcy5vcGFjaXR5QW5pbWF0aW9uID0gbnVsbDtcbiAgICAgICAgdGhpcy5yYWRpdXNBbmltYXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLmNvbG9yID0gdGhpcy5jcmVhdGVDb2xvcihzZXR0aW5ncy5jb2xvcik7XG4gICAgICAgIHRoaXMub3BhY2l0eSA9IHRoaXMuY3JlYXRlT3BhY2l0eShzZXR0aW5ncy5vcGFjaXR5KTtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IHRoaXMuY3JlYXRlVmVsb2NpdHkoc2V0dGluZ3MubW92ZSk7XG4gICAgICAgIHRoaXMuc2hhcGUgPSB0aGlzLmNyZWF0ZVNoYXBlKHNldHRpbmdzLnNoYXBlKTtcbiAgICAgICAgdGhpcy5zdHJva2UgPSB0aGlzLmNyZWF0ZVN0cm9rZShzZXR0aW5ncy5zdHJva2UpO1xuICAgICAgICB0aGlzLnJhZGl1cyA9IHRoaXMuY3JlYXRlUmFkaXVzKHNldHRpbmdzLnJhZGl1cyk7XG4gICAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRlKSB7XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYW5pbWF0ZS5vcGFjaXR5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5vcGFjaXR5QW5pbWF0aW9uID0gdGhpcy5hbmltYXRlT3BhY2l0eShzZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNldHRpbmdzLmFuaW1hdGUucmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yYWRpdXNBbmltYXRpb24gPSB0aGlzLmFuaW1hdGVSYWRpdXMoc2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuYnViYmxlZCA9IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgICByYWRpdXM6IDBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZUNvbG9yID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgIGlmICh0eXBlb2YgY29sb3IgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAoY29sb3IgPT09ICdyYW5kb20nKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbG9yXzEuZGVmYXVsdC5mcm9tUkdCKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NiksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NiksIE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDI1NikpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbG9yXzEuZGVmYXVsdC5mcm9tSGV4KGNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgY29sb3IgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAoY29sb3IgaW5zdGFuY2VvZiBDb2xvcl8xLmRlZmF1bHQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gY29sb3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChjb2xvciBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlQ29sb3IoY29sb3JbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY29sb3IubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIENvbG9yXzEuZGVmYXVsdC5mcm9tT2JqZWN0KGNvbG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21SR0IoMCwgMCwgMCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlT3BhY2l0eSA9IGZ1bmN0aW9uIChvcGFjaXR5KSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3BhY2l0eSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChvcGFjaXR5IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVPcGFjaXR5KG9wYWNpdHlbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogb3BhY2l0eS5sZW5ndGgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG9wYWNpdHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAob3BhY2l0eSA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChvcGFjaXR5ID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb3BhY2l0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVWZWxvY2l0eSA9IGZ1bmN0aW9uIChtb3ZlKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbW92ZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgICAgICBpZiAoIW1vdmUpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIG1vdmUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICB2YXIgdmVsb2NpdHkgPSB2b2lkIDA7XG4gICAgICAgICAgICBzd2l0Y2ggKG1vdmUuZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAtMSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ3RvcC1yaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMC43LCAtMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDEsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20tcmlnaHQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAuNywgMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnYm90dG9tLWxlZnQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KC0wLjcsIDAuNyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KC0xLCAwKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wLWxlZnQnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KC0wLjcsIC0wLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChtb3ZlLnN0cmFpZ2h0KSB7XG4gICAgICAgICAgICAgICAgaWYgKG1vdmUucmFuZG9tKSB7XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5LnggKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkueSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHZlbG9jaXR5LnggKz0gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgICAgICAgICB2ZWxvY2l0eS55ICs9IE1hdGgucmFuZG9tKCkgLSAwLjU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdmVsb2NpdHk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDApO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZVNoYXBlID0gZnVuY3Rpb24gKHNoYXBlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc2hhcGUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICBpZiAoc2hhcGUgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVNoYXBlKHNoYXBlW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHNoYXBlLmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygc2hhcGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB2YXIgc2lkZXMgPSBwYXJzZUludChzaGFwZS5zdWJzdHJpbmcoMCwgc2hhcGUuaW5kZXhPZignLScpKSk7XG4gICAgICAgICAgICBpZiAoIWlzTmFOKHNpZGVzKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVNoYXBlKHNpZGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBzaGFwZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygc2hhcGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAoc2hhcGUgPj0gMykge1xuICAgICAgICAgICAgICAgIHJldHVybiBzaGFwZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gJ2NpcmNsZSc7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlU3Ryb2tlID0gZnVuY3Rpb24gKHN0cm9rZSkge1xuICAgICAgICBpZiAodHlwZW9mIHN0cm9rZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2Ygc3Ryb2tlLndpZHRoID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICAgIGlmIChzdHJva2Uud2lkdGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3Ryb2tlXzEuZGVmYXVsdChzdHJva2Uud2lkdGgsIHRoaXMuY3JlYXRlQ29sb3Ioc3Ryb2tlLmNvbG9yKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgU3Ryb2tlXzEuZGVmYXVsdCgwLCBDb2xvcl8xLmRlZmF1bHQuZnJvbVJHQigwLCAwLCAwKSk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlUmFkaXVzID0gZnVuY3Rpb24gKHJhZGl1cykge1xuICAgICAgICBpZiAodHlwZW9mIHJhZGl1cyA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChyYWRpdXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZVJhZGl1cyhyYWRpdXNbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogcmFkaXVzLmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcmFkaXVzID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgaWYgKHJhZGl1cyA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgcmFkaXVzID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKHJhZGl1cyA+PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHJhZGl1cztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gNTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5wYXJzZVNwZWVkID0gZnVuY3Rpb24gKHNwZWVkKSB7XG4gICAgICAgIGlmIChzcGVlZCA+IDApIHtcbiAgICAgICAgICAgIHJldHVybiBzcGVlZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gMC41O1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmFuaW1hdGVPcGFjaXR5ID0gZnVuY3Rpb24gKGFuaW1hdGlvbikge1xuICAgICAgICBpZiAoYW5pbWF0aW9uKSB7XG4gICAgICAgICAgICB2YXIgbWF4ID0gdGhpcy5vcGFjaXR5O1xuICAgICAgICAgICAgdmFyIG1pbiA9IHRoaXMuY3JlYXRlT3BhY2l0eShhbmltYXRpb24ubWluKTtcbiAgICAgICAgICAgIHZhciBzcGVlZCA9IHRoaXMucGFyc2VTcGVlZChhbmltYXRpb24uc3BlZWQpIC8gMTAwO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb24uc3luYykge1xuICAgICAgICAgICAgICAgIHNwZWVkICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9wYWNpdHkgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW5pbWF0aW9uXzEuZGVmYXVsdChzcGVlZCwgbWF4LCBtaW4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmFuaW1hdGVSYWRpdXMgPSBmdW5jdGlvbiAoYW5pbWF0aW9uKSB7XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICAgIHZhciBtYXggPSB0aGlzLnJhZGl1cztcbiAgICAgICAgICAgIHZhciBtaW4gPSB0aGlzLmNyZWF0ZVJhZGl1cyhhbmltYXRpb24ubWluKTtcbiAgICAgICAgICAgIHZhciBzcGVlZCA9IHRoaXMucGFyc2VTcGVlZChhbmltYXRpb24uc3BlZWQpIC8gMTAwO1xuICAgICAgICAgICAgaWYgKCFhbmltYXRpb24uc3luYykge1xuICAgICAgICAgICAgICAgIHNwZWVkICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLm9wYWNpdHkgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgQW5pbWF0aW9uXzEuZGVmYXVsdChzcGVlZCwgbWF4LCBtaW4pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLnNldFBvc2l0aW9uID0gZnVuY3Rpb24gKHBvc2l0aW9uKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBwb3NpdGlvbjtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5tb3ZlID0gZnVuY3Rpb24gKHNwZWVkKSB7XG4gICAgICAgIHRoaXMucG9zaXRpb24ueCArPSB0aGlzLnZlbG9jaXR5LnggKiBzcGVlZDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi55ICs9IHRoaXMudmVsb2NpdHkueSAqIHNwZWVkO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmdldFJhZGl1cyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmFkaXVzICsgdGhpcy5idWJibGVkLnJhZGl1cztcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5nZXRPcGFjaXR5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcGFjaXR5ICsgdGhpcy5idWJibGVkLm9wYWNpdHk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZWRnZSA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICAgICAgc3dpdGNoIChkaXIpIHtcbiAgICAgICAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSAtIHRoaXMuZ2V0UmFkaXVzKCkpO1xuICAgICAgICAgICAgY2FzZSAncmlnaHQnOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQodGhpcy5wb3NpdGlvbi54ICsgdGhpcy5nZXRSYWRpdXMoKSwgdGhpcy5wb3NpdGlvbi55KTtcbiAgICAgICAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLngsIHRoaXMucG9zaXRpb24ueSArIHRoaXMuZ2V0UmFkaXVzKCkpO1xuICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLnggLSB0aGlzLmdldFJhZGl1cygpLCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbjtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmludGVyc2VjdGluZyA9IGZ1bmN0aW9uIChwYXJ0aWNsZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5wb3NpdGlvbi5kaXN0YW5jZShwYXJ0aWNsZS5wb3NpdGlvbikgPCB0aGlzLmdldFJhZGl1cygpICsgcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYnViYmxlID0gZnVuY3Rpb24gKG1vdXNlLCBzZXR0aW5ncykge1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSB0aGlzLnBvc2l0aW9uLmRpc3RhbmNlKG1vdXNlLnBvc2l0aW9uKTtcbiAgICAgICAgdmFyIHJhdGlvID0gMSAtIGRpc3RhbmNlIC8gc2V0dGluZ3MuZGlzdGFuY2U7XG4gICAgICAgIGlmIChyYXRpbyA+PSAwICYmIG1vdXNlLm92ZXIpIHtcbiAgICAgICAgICAgIHRoaXMuYnViYmxlZC5vcGFjaXR5ID0gcmF0aW8gKiAoc2V0dGluZ3Mub3BhY2l0eSAtIHRoaXMub3BhY2l0eSk7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQucmFkaXVzID0gcmF0aW8gKiAoc2V0dGluZ3MucmFkaXVzIC0gdGhpcy5yYWRpdXMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLm9wYWNpdHkgPSAwO1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLnJhZGl1cyA9IDA7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBQYXJ0aWNsZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBQYXJ0aWNsZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMSA9IHJlcXVpcmUoXCIuL0FuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXCIpO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIENvb3JkaW5hdGVfMSA9IHJlcXVpcmUoXCIuL0Nvb3JkaW5hdGVcIik7XG52YXIgUGFydGljbGVfMSA9IHJlcXVpcmUoXCIuL1BhcnRpY2xlXCIpO1xudmFyIFBhcnRpY2xlcyA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gUGFydGljbGVzKGNzc1F1ZXJ5LCBjb250ZXh0KSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAnc3RvcHBlZCc7XG4gICAgICAgIHRoaXMucGl4ZWxSYXRpb0xpbWl0ID0gODtcbiAgICAgICAgdGhpcy5waXhlbFJhdGlvID0gMTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZXMgPSBuZXcgQXJyYXkoKTtcbiAgICAgICAgdGhpcy5tb3VzZSA9IHtcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoMCwgMCksXG4gICAgICAgICAgICBvdmVyOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IG51bGw7XG4gICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KGNzc1F1ZXJ5KTtcbiAgICAgICAgaWYgKHRoaXMuY2FudmFzID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aHJvdyBcIkNhbnZhcyBJRCBcIiArIGNzc1F1ZXJ5ICsgXCIgbm90IGZvdW5kLlwiO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4ID0gdGhpcy5jYW52YXMuZ2V0Q29udGV4dChjb250ZXh0KTtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXzEuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMucmVxdWVzdEFuaW1hdGlvbkZyYW1lKCk7XG4gICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSA9IEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zXzEuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMuY2FuY2VsQW5pbWF0aW9uRnJhbWUoKTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzID0ge1xuICAgICAgICAgICAgbnVtYmVyOiAzNTAsXG4gICAgICAgICAgICBkZW5zaXR5OiAxMDAwLFxuICAgICAgICAgICAgY29sb3I6ICcjRkZGRkZGJyxcbiAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICByYWRpdXM6IDUsXG4gICAgICAgICAgICBzaGFwZTogJ2NpcmNsZScsXG4gICAgICAgICAgICBzdHJva2U6IHtcbiAgICAgICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDAwMDAnXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW92ZToge1xuICAgICAgICAgICAgICAgIHNwZWVkOiAwLjQsXG4gICAgICAgICAgICAgICAgZGlyZWN0aW9uOiAnYm90dG9tJyxcbiAgICAgICAgICAgICAgICBzdHJhaWdodDogdHJ1ZSxcbiAgICAgICAgICAgICAgICByYW5kb206IHRydWUsXG4gICAgICAgICAgICAgICAgZWRnZUJvdW5jZTogZmFsc2UsXG4gICAgICAgICAgICAgICAgYXR0cmFjdDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBldmVudHM6IHtcbiAgICAgICAgICAgICAgICByZXNpemU6IHRydWUsXG4gICAgICAgICAgICAgICAgaG92ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIGNsaWNrOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGFuaW1hdGU6IHtcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiBmYWxzZSxcbiAgICAgICAgICAgICAgICByYWRpdXM6IGZhbHNlXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncyA9IHtcbiAgICAgICAgICAgIGhvdmVyOiB7XG4gICAgICAgICAgICAgICAgYnViYmxlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiA3NSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiA3LFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZXB1bHNlOiB7XG4gICAgICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAxMDAsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNsaWNrOiB7XG4gICAgICAgICAgICAgICAgYWRkOiB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlcjogNFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVtb3ZlOiB7XG4gICAgICAgICAgICAgICAgICAgIG51bWJlcjogMlxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnRyYWNrTW91c2UoKTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplUGl4ZWxSYXRpbyh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA+PSB0aGlzLnBpeGVsUmF0aW9MaW1pdCA/IHRoaXMucGl4ZWxSYXRpb0xpbWl0IC0gMiA6IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvKTtcbiAgICAgICAgdGhpcy5zZXRDYW52YXNTaXplKCk7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5yZW1vdmVQYXJ0aWNsZXMoKTtcbiAgICAgICAgdGhpcy5jcmVhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgdGhpcy5kaXN0cmlidXRlUGFydGljbGVzKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnRyYWNrTW91c2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cykge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuaG92ZXIpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2UucG9zaXRpb24ueCA9IGV2ZW50Lm9mZnNldFggKiBfdGhpcy5waXhlbFJhdGlvO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi55ID0gZXZlbnQub2Zmc2V0WSAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLm92ZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnggPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi55ID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2Uub3ZlciA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuY2xpY2spIHtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1vdXNlRXZlbnRzQXR0YWNoZWQgPSB0cnVlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5pbml0aWFsaXplUGl4ZWxSYXRpbyA9IGZ1bmN0aW9uIChuZXdSYXRpbykge1xuICAgICAgICBpZiAobmV3UmF0aW8gPT09IHZvaWQgMCkgeyBuZXdSYXRpbyA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvOyB9XG4gICAgICAgIHZhciBtdWx0aXBsaWVyID0gbmV3UmF0aW8gLyB0aGlzLnBpeGVsUmF0aW87XG4gICAgICAgIHRoaXMud2lkdGggPSB0aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCAqIG11bHRpcGxpZXI7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0ICogbXVsdGlwbGllcjtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyA9IHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMubWFwKGZ1bmN0aW9uIChyKSB7IHJldHVybiByICogbXVsdGlwbGllcjsgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHRoaXMucGFydGljbGVTZXR0aW5ncy5yYWRpdXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuc3BlZWQgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUgJiYgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUucmFkaXVzKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMuc3BlZWQgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5idWJibGUucmFkaXVzICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZS5kaXN0YW5jZSAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3Zlci5yZXB1bHNlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLnJlcHVsc2UuZGlzdGFuY2UgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBpeGVsUmF0aW8gPSBuZXdSYXRpbztcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuY2hlY2tab29tID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAod2luZG93LmRldmljZVBpeGVsUmF0aW8gIT09IHRoaXMucGl4ZWxSYXRpbyAmJiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyA8IHRoaXMucGl4ZWxSYXRpb0xpbWl0KSB7XG4gICAgICAgICAgICB0aGlzLnN0b3BEcmF3aW5nKCk7XG4gICAgICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgICAgIHRoaXMuZHJhdygpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldENhbnZhc1NpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIHRoaXMuY2FudmFzLndpZHRoID0gdGhpcy53aWR0aDtcbiAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0ID0gdGhpcy5oZWlnaHQ7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzICYmIHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMucmVzaXplKSB7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jaGVja1pvb20oKTtcbiAgICAgICAgICAgICAgICBfdGhpcy53aWR0aCA9IF90aGlzLmNhbnZhcy5vZmZzZXRXaWR0aCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgX3RoaXMuaGVpZ2h0ID0gX3RoaXMuY2FudmFzLm9mZnNldEhlaWdodCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FudmFzLndpZHRoID0gX3RoaXMud2lkdGg7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2FudmFzLmhlaWdodCA9IF90aGlzLmhlaWdodDtcbiAgICAgICAgICAgICAgICBpZiAoIV90aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5yZW1vdmVQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuY3JlYXRlUGFydGljbGVzKCk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmRyYXdQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgX3RoaXMuZGlzdHJpYnV0ZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZ2V0RmlsbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY3R4LmZpbGxTdHlsZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0RmlsbCA9IGZ1bmN0aW9uIChjb2xvcikge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0U3Ryb2tlID0gZnVuY3Rpb24gKHN0cm9rZSkge1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IHN0cm9rZS5jb2xvci50b1N0cmluZygpO1xuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSBzdHJva2Uud2lkdGg7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmN0eC5jbGVhclJlY3QoMCwgMCwgdGhpcy5jYW52YXMud2lkdGgsIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuZHJhd1BhcnRpY2xlcygpO1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpXG4gICAgICAgICAgICB0aGlzLmFuaW1hdGlvbkZyYW1lID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLmRyYXcuYmluZCh0aGlzKSk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0b3BEcmF3aW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5oYW5kbGVSZXNpemUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XG4gICAgICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMuYW5pbWF0aW9uRnJhbWUpIHtcbiAgICAgICAgICAgIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSh0aGlzLmFuaW1hdGlvbkZyYW1lKTtcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQb2x5Z29uID0gZnVuY3Rpb24gKGNlbnRlciwgcmFkaXVzLCBzaWRlcykge1xuICAgICAgICB2YXIgZGlhZ29uYWxBbmdsZSA9IDM2MCAvIHNpZGVzO1xuICAgICAgICBkaWFnb25hbEFuZ2xlICo9IE1hdGguUEkgLyAxODA7XG4gICAgICAgIHRoaXMuY3R4LnNhdmUoKTtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4LnRyYW5zbGF0ZShjZW50ZXIueCwgY2VudGVyLnkpO1xuICAgICAgICB0aGlzLmN0eC5yb3RhdGUoZGlhZ29uYWxBbmdsZSAvIChzaWRlcyAlIDIgPyA0IDogMikpO1xuICAgICAgICB0aGlzLmN0eC5tb3ZlVG8ocmFkaXVzLCAwKTtcbiAgICAgICAgdmFyIGFuZ2xlO1xuICAgICAgICBmb3IgKHZhciBzID0gMDsgcyA8IHNpZGVzOyBzKyspIHtcbiAgICAgICAgICAgIGFuZ2xlID0gcyAqIGRpYWdvbmFsQW5nbGU7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8ocmFkaXVzICogTWF0aC5jb3MoYW5nbGUpLCByYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuY3R4LmZpbGwoKTtcbiAgICAgICAgdGhpcy5jdHgucmVzdG9yZSgpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kcmF3UGFydGljbGUgPSBmdW5jdGlvbiAocGFydGljbGUpIHtcbiAgICAgICAgdmFyIG9wYWNpdHkgPSBwYXJ0aWNsZS5nZXRPcGFjaXR5KCk7XG4gICAgICAgIHZhciByYWRpdXMgPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgdGhpcy5zZXRGaWxsKHBhcnRpY2xlLmNvbG9yLnRvU3RyaW5nKG9wYWNpdHkpKTtcbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGlmICh0eXBlb2YgKHBhcnRpY2xlLnNoYXBlKSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1BvbHlnb24ocGFydGljbGUucG9zaXRpb24sIHJhZGl1cywgcGFydGljbGUuc2hhcGUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgc3dpdGNoIChwYXJ0aWNsZS5zaGFwZSkge1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgY2FzZSAnY2lyY2xlJzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdHguYXJjKHBhcnRpY2xlLnBvc2l0aW9uLngsIHBhcnRpY2xlLnBvc2l0aW9uLnksIHJhZGl1cywgMCwgTWF0aC5QSSAqIDIsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguY2xvc2VQYXRoKCk7XG4gICAgICAgIGlmIChwYXJ0aWNsZS5zdHJva2Uud2lkdGggPiAwKSB7XG4gICAgICAgICAgICB0aGlzLnNldFN0cm9rZShwYXJ0aWNsZS5zdHJva2UpO1xuICAgICAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5nZXROZXdQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdChNYXRoLnJhbmRvbSgpICogdGhpcy5jYW52YXMud2lkdGgsIE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy5oZWlnaHQpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jaGVja1Bvc2l0aW9uID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLmVkZ2VCb3VuY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPCAwKVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi54ICs9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA+IHRoaXMud2lkdGgpXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggLT0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3RvcCcpLnkgPCAwKVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55ICs9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPiB0aGlzLmhlaWdodClcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueSAtPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZGlzdHJpYnV0ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5kZW5zaXR5ICYmIHR5cGVvZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHkpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdmFyIGFyZWEgPSB0aGlzLmNhbnZhcy53aWR0aCAqIHRoaXMuY2FudmFzLmhlaWdodCAvIDEwMDA7XG4gICAgICAgICAgICBhcmVhIC89IHRoaXMucGl4ZWxSYXRpbyAqIDI7XG4gICAgICAgICAgICB2YXIgcGFydGljbGVzUGVyQXJlYSA9IGFyZWEgKiB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubnVtYmVyIC8gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHk7XG4gICAgICAgICAgICB2YXIgbWlzc2luZyA9IHBhcnRpY2xlc1BlckFyZWEgLSB0aGlzLnBhcnRpY2xlcy5sZW5ndGg7XG4gICAgICAgICAgICBpZiAobWlzc2luZyA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVBhcnRpY2xlcyhtaXNzaW5nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlUGFydGljbGVzKE1hdGguYWJzKG1pc3NpbmcpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jcmVhdGVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAobnVtYmVyLCBwb3NpdGlvbikge1xuICAgICAgICBpZiAobnVtYmVyID09PSB2b2lkIDApIHsgbnVtYmVyID0gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm51bWJlcjsgfVxuICAgICAgICBpZiAocG9zaXRpb24gPT09IHZvaWQgMCkgeyBwb3NpdGlvbiA9IG51bGw7IH1cbiAgICAgICAgaWYgKCF0aGlzLnBhcnRpY2xlU2V0dGluZ3MpXG4gICAgICAgICAgICB0aHJvdyAnUGFydGljbGUgc2V0dGluZ3MgbXVzdCBiZSBpbml0YWxpemVkIGJlZm9yZSBhIHBhcnRpY2xlIGlzIGNyZWF0ZWQuJztcbiAgICAgICAgdmFyIHBhcnRpY2xlO1xuICAgICAgICBmb3IgKHZhciBwID0gMDsgcCA8IG51bWJlcjsgcCsrKSB7XG4gICAgICAgICAgICBwYXJ0aWNsZSA9IG5ldyBQYXJ0aWNsZV8xLmRlZmF1bHQodGhpcy5wYXJ0aWNsZVNldHRpbmdzKTtcbiAgICAgICAgICAgIGlmIChwb3NpdGlvbikge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKHBvc2l0aW9uKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24odGhpcy5nZXROZXdQb3NpdGlvbigpKTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlICghdGhpcy5jaGVja1Bvc2l0aW9uKHBhcnRpY2xlKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5wdXNoKHBhcnRpY2xlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5yZW1vdmVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAobnVtYmVyKSB7XG4gICAgICAgIGlmIChudW1iZXIgPT09IHZvaWQgMCkgeyBudW1iZXIgPSBudWxsOyB9XG4gICAgICAgIGlmICghbnVtYmVyKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZXMuc3BsaWNlKDAsIG51bWJlcik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUudXBkYXRlUGFydGljbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5wYXJ0aWNsZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFydGljbGUgPSBfYVtfaV07XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUpIHtcbiAgICAgICAgICAgICAgICBwYXJ0aWNsZS5tb3ZlKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLnNwZWVkKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlLmVkZ2VCb3VuY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLndpZHRoICsgcGFydGljbGUuZ2V0UmFkaXVzKCksIE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLmVkZ2UoJ2xlZnQnKS54ID4gdGhpcy53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KC0xICogcGFydGljbGUuZ2V0UmFkaXVzKCksIE1hdGgucmFuZG9tKCkgKiB0aGlzLmhlaWdodCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdib3R0b20nKS55IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KE1hdGgucmFuZG9tKCkgKiB0aGlzLndpZHRoLCB0aGlzLmhlaWdodCArIHBhcnRpY2xlLmdldFJhZGl1cygpKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgndG9wJykueSA+IHRoaXMuaGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGgsIC0xICogcGFydGljbGUuZ2V0UmFkaXVzKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPCAwIHx8IHBhcnRpY2xlLmVkZ2UoJ3JpZ2h0JykueCA+IHRoaXMud2lkdGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnZlbG9jaXR5LmZsaXAodHJ1ZSwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCd0b3AnKS55IDwgMCB8fCBwYXJ0aWNsZS5lZGdlKCdib3R0b20nKS55ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnZlbG9jaXR5LmZsaXAoZmFsc2UsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPj0gcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPD0gcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eSArPSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLnNwZWVkICogKHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uaW5jcmVhc2luZyA/IDEgOiAtMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5vcGFjaXR5IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLnJhZGl1cykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUucmFkaXVzID49IHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5tYXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUucmFkaXVzIDw9IHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5taW4pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5yYWRpdXMgKz0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLnNwZWVkICogKHBhcnRpY2xlLnJhZGl1c0FuaW1hdGlvbi5pbmNyZWFzaW5nID8gMSA6IC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLnJhZGl1cyA8IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1cyA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzLmhvdmVyID09PSAnYnViYmxlJyAmJiB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIgJiYgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSkge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5idWJibGUodGhpcy5tb3VzZSwgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQYXJ0aWNsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy51cGRhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgZm9yICh2YXIgX2kgPSAwLCBfYSA9IHRoaXMucGFydGljbGVzOyBfaSA8IF9hLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgdmFyIHBhcnRpY2xlID0gX2FbX2ldO1xuICAgICAgICAgICAgdGhpcy5kcmF3UGFydGljbGUocGFydGljbGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldFBhcnRpY2xlU2V0dGluZ3MgPSBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09ICdzdG9wcGVkJykge1xuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjaGFuZ2Ugc2V0dGluZ3Mgd2hpbGUgQ2FudmFzIGlzIHJ1bm5pbmcuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnNldEludGVyYWN0aXZlU2V0dGluZ3MgPSBmdW5jdGlvbiAoc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09ICdzdG9wcGVkJykge1xuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjaGFuZ2Ugc2V0dGluZ3Mgd2hpbGUgQ2FudmFzIGlzIHJ1bm5pbmcuJztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncyA9IHNldHRpbmdzO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0YXJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzID09PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgJ1BhcnRpY2xlIHNldHRpbmdzIG11c3QgYmUgaW5pdGFsaXplZCBiZWZvcmUgQ2FudmFzIGNhbiBzdGFydC4nO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ3N0b3BwZWQnKVxuICAgICAgICAgICAgdGhyb3cgJ0NhbnZhcyBpcyBhbHJlYWR5IHJ1bm5pbmcuJztcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdydW5uaW5nJztcbiAgICAgICAgdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5wYXVzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgPT09ICdzdG9wcGVkJykge1xuICAgICAgICAgICAgdGhyb3cgJ05vIFBhcnRpY2xlcyB0byBwYXVzZS4nO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUgPSAncGF1c2VkJztcbiAgICAgICAgdGhpcy5tb3ZlU2V0dGluZ3MgPSB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZTtcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUgPSBmYWxzZTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUucmVzdW1lID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnTm8gUGFydGljbGVzIHRvIHJlc3VtZS4nO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhdGUgPSAncnVubmluZyc7XG4gICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlID0gdGhpcy5tb3ZlU2V0dGluZ3M7XG4gICAgICAgIHRoaXMuZHJhdygpO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zdG9wID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLnN0YXRlID0gJ3N0b3BwZWQnO1xuICAgICAgICB0aGlzLnN0b3BEcmF3aW5nKCk7XG4gICAgfTtcbiAgICByZXR1cm4gUGFydGljbGVzO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBhcnRpY2xlcztcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFN0cm9rZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gU3Ryb2tlKHdpZHRoLCBjb2xvcikge1xuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICB9XG4gICAgcmV0dXJuIFN0cm9rZTtcbn0oKSk7XG5leHBvcnRzLmRlZmF1bHQgPSBTdHJva2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBWZWN0b3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFZlY3Rvcih4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIFZlY3Rvci5wcm90b3R5cGUuZmxpcCA9IGZ1bmN0aW9uICh4LCB5KSB7XG4gICAgICAgIGlmICh4ID09PSB2b2lkIDApIHsgeCA9IHRydWU7IH1cbiAgICAgICAgaWYgKHkgPT09IHZvaWQgMCkgeyB5ID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoeCkge1xuICAgICAgICAgICAgdGhpcy54ICo9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmICh5KSB7XG4gICAgICAgICAgICB0aGlzLnkgKj0gLTE7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFZlY3Rvci5wcm90b3R5cGUubWFnbml0dWRlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KCh0aGlzLnggKiB0aGlzLngpICsgKHRoaXMueSAqIHRoaXMueSkpO1xuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5hbmdsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGgudGFuKHRoaXMueSAvIHRoaXMueCk7XG4gICAgfTtcbiAgICByZXR1cm4gVmVjdG9yO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFZlY3RvcjtcbiJdfQ==
