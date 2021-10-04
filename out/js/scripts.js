(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
module.exports = function (it) {
  if (typeof it != 'function') {
    throw TypeError(String(it) + ' is not a function');
  } return it;
};

},{}],2:[function(require,module,exports){
var isObject = require('../internals/is-object');

module.exports = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

},{"../internals/is-object":67}],3:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');
var create = require('../internals/object-create');
var definePropertyModule = require('../internals/object-define-property');

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;

// Array.prototype[@@unscopables]
// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  definePropertyModule.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: create(null)
  });
}

// add a key to Array.prototype[@@unscopables]
module.exports = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

},{"../internals/object-create":83,"../internals/object-define-property":85,"../internals/well-known-symbol":134}],4:[function(require,module,exports){
'use strict';
var charAt = require('../internals/string-multibyte').charAt;

// `AdvanceStringIndex` abstract operation
// https://tc39.es/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

},{"../internals/string-multibyte":119}],5:[function(require,module,exports){
module.exports = function (it, Constructor, name) {
  if (!(it instanceof Constructor)) {
    throw TypeError('Incorrect ' + (name ? name + ' ' : '') + 'invocation');
  } return it;
};

},{}],6:[function(require,module,exports){
var isObject = require('../internals/is-object');

module.exports = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

},{"../internals/is-object":67}],7:[function(require,module,exports){
'use strict';
var toObject = require('../internals/to-object');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');

// `Array.prototype.fill` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.fill
module.exports = function fill(value /* , start = 0, end = @length */) {
  var O = toObject(this);
  var length = toLength(O.length);
  var argumentsLength = arguments.length;
  var index = toAbsoluteIndex(argumentsLength > 1 ? arguments[1] : undefined, length);
  var end = argumentsLength > 2 ? arguments[2] : undefined;
  var endPos = end === undefined ? length : toAbsoluteIndex(end, length);
  while (endPos > index) O[index++] = value;
  return O;
};

},{"../internals/to-absolute-index":122,"../internals/to-length":125,"../internals/to-object":126}],8:[function(require,module,exports){
'use strict';
var $forEach = require('../internals/array-iteration').forEach;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var STRICT_METHOD = arrayMethodIsStrict('forEach');

// `Array.prototype.forEach` method implementation
// https://tc39.es/ecma262/#sec-array.prototype.foreach
module.exports = !STRICT_METHOD ? function forEach(callbackfn /* , thisArg */) {
  return $forEach(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
} : [].forEach;

},{"../internals/array-iteration":11,"../internals/array-method-is-strict":13}],9:[function(require,module,exports){
'use strict';
var bind = require('../internals/function-bind-context');
var toObject = require('../internals/to-object');
var callWithSafeIterationClosing = require('../internals/call-with-safe-iteration-closing');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var toLength = require('../internals/to-length');
var createProperty = require('../internals/create-property');
var getIteratorMethod = require('../internals/get-iterator-method');

// `Array.from` method implementation
// https://tc39.es/ecma262/#sec-array.from
module.exports = function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
  var O = toObject(arrayLike);
  var C = typeof this == 'function' ? this : Array;
  var argumentsLength = arguments.length;
  var mapfn = argumentsLength > 1 ? arguments[1] : undefined;
  var mapping = mapfn !== undefined;
  var iteratorMethod = getIteratorMethod(O);
  var index = 0;
  var length, result, step, iterator, next, value;
  if (mapping) mapfn = bind(mapfn, argumentsLength > 2 ? arguments[2] : undefined, 2);
  // if the target is not iterable or it's an array with the default iterator - use a simple case
  if (iteratorMethod != undefined && !(C == Array && isArrayIteratorMethod(iteratorMethod))) {
    iterator = iteratorMethod.call(O);
    next = iterator.next;
    result = new C();
    for (;!(step = next.call(iterator)).done; index++) {
      value = mapping ? callWithSafeIterationClosing(iterator, mapfn, [step.value, index], true) : step.value;
      createProperty(result, index, value);
    }
  } else {
    length = toLength(O.length);
    result = new C(length);
    for (;length > index; index++) {
      value = mapping ? mapfn(O[index], index) : O[index];
      createProperty(result, index, value);
    }
  }
  result.length = index;
  return result;
};

},{"../internals/call-with-safe-iteration-closing":17,"../internals/create-property":30,"../internals/function-bind-context":48,"../internals/get-iterator-method":51,"../internals/is-array-iterator-method":64,"../internals/to-length":125,"../internals/to-object":126}],10:[function(require,module,exports){
var toIndexedObject = require('../internals/to-indexed-object');
var toLength = require('../internals/to-length');
var toAbsoluteIndex = require('../internals/to-absolute-index');

// `Array.prototype.{ indexOf, includes }` methods implementation
var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare -- NaN check
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare -- NaN check
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

module.exports = {
  // `Array.prototype.includes` method
  // https://tc39.es/ecma262/#sec-array.prototype.includes
  includes: createMethod(true),
  // `Array.prototype.indexOf` method
  // https://tc39.es/ecma262/#sec-array.prototype.indexof
  indexOf: createMethod(false)
};

},{"../internals/to-absolute-index":122,"../internals/to-indexed-object":123,"../internals/to-length":125}],11:[function(require,module,exports){
var bind = require('../internals/function-bind-context');
var IndexedObject = require('../internals/indexed-object');
var toObject = require('../internals/to-object');
var toLength = require('../internals/to-length');
var arraySpeciesCreate = require('../internals/array-species-create');

var push = [].push;

// `Array.prototype.{ forEach, map, filter, some, every, find, findIndex, filterReject }` methods implementation
var createMethod = function (TYPE) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var IS_FILTER_REJECT = TYPE == 7;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  return function ($this, callbackfn, that, specificCreate) {
    var O = toObject($this);
    var self = IndexedObject(O);
    var boundFunction = bind(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var create = specificCreate || arraySpeciesCreate;
    var target = IS_MAP ? create($this, length) : IS_FILTER || IS_FILTER_REJECT ? create($this, 0) : undefined;
    var value, result;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      value = self[index];
      result = boundFunction(value, index, O);
      if (TYPE) {
        if (IS_MAP) target[index] = result; // map
        else if (result) switch (TYPE) {
          case 3: return true;              // some
          case 5: return value;             // find
          case 6: return index;             // findIndex
          case 2: push.call(target, value); // filter
        } else switch (TYPE) {
          case 4: return false;             // every
          case 7: push.call(target, value); // filterReject
        }
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : target;
  };
};

module.exports = {
  // `Array.prototype.forEach` method
  // https://tc39.es/ecma262/#sec-array.prototype.foreach
  forEach: createMethod(0),
  // `Array.prototype.map` method
  // https://tc39.es/ecma262/#sec-array.prototype.map
  map: createMethod(1),
  // `Array.prototype.filter` method
  // https://tc39.es/ecma262/#sec-array.prototype.filter
  filter: createMethod(2),
  // `Array.prototype.some` method
  // https://tc39.es/ecma262/#sec-array.prototype.some
  some: createMethod(3),
  // `Array.prototype.every` method
  // https://tc39.es/ecma262/#sec-array.prototype.every
  every: createMethod(4),
  // `Array.prototype.find` method
  // https://tc39.es/ecma262/#sec-array.prototype.find
  find: createMethod(5),
  // `Array.prototype.findIndex` method
  // https://tc39.es/ecma262/#sec-array.prototype.findIndex
  findIndex: createMethod(6),
  // `Array.prototype.filterReject` method
  // https://github.com/tc39/proposal-array-filtering
  filterReject: createMethod(7)
};

},{"../internals/array-species-create":16,"../internals/function-bind-context":48,"../internals/indexed-object":59,"../internals/to-length":125,"../internals/to-object":126}],12:[function(require,module,exports){
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var V8_VERSION = require('../internals/engine-v8-version');

var SPECIES = wellKnownSymbol('species');

module.exports = function (METHOD_NAME) {
  // We can't use this feature detection in V8 since it causes
  // deoptimization and serious performance degradation
  // https://github.com/zloirock/core-js/issues/677
  return V8_VERSION >= 51 || !fails(function () {
    var array = [];
    var constructor = array.constructor = {};
    constructor[SPECIES] = function () {
      return { foo: 1 };
    };
    return array[METHOD_NAME](Boolean).foo !== 1;
  });
};

},{"../internals/engine-v8-version":42,"../internals/fails":45,"../internals/well-known-symbol":134}],13:[function(require,module,exports){
'use strict';
var fails = require('../internals/fails');

module.exports = function (METHOD_NAME, argument) {
  var method = [][METHOD_NAME];
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call,no-throw-literal -- required for testing
    method.call(null, argument || function () { throw 1; }, 1);
  });
};

},{"../internals/fails":45}],14:[function(require,module,exports){
var aFunction = require('../internals/a-function');
var toObject = require('../internals/to-object');
var IndexedObject = require('../internals/indexed-object');
var toLength = require('../internals/to-length');

// `Array.prototype.{ reduce, reduceRight }` methods implementation
var createMethod = function (IS_RIGHT) {
  return function (that, callbackfn, argumentsLength, memo) {
    aFunction(callbackfn);
    var O = toObject(that);
    var self = IndexedObject(O);
    var length = toLength(O.length);
    var index = IS_RIGHT ? length - 1 : 0;
    var i = IS_RIGHT ? -1 : 1;
    if (argumentsLength < 2) while (true) {
      if (index in self) {
        memo = self[index];
        index += i;
        break;
      }
      index += i;
      if (IS_RIGHT ? index < 0 : length <= index) {
        throw TypeError('Reduce of empty array with no initial value');
      }
    }
    for (;IS_RIGHT ? index >= 0 : length > index; index += i) if (index in self) {
      memo = callbackfn(memo, self[index], index, O);
    }
    return memo;
  };
};

module.exports = {
  // `Array.prototype.reduce` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduce
  left: createMethod(false),
  // `Array.prototype.reduceRight` method
  // https://tc39.es/ecma262/#sec-array.prototype.reduceright
  right: createMethod(true)
};

},{"../internals/a-function":1,"../internals/indexed-object":59,"../internals/to-length":125,"../internals/to-object":126}],15:[function(require,module,exports){
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');

// a part of `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray) {
  var C;
  if (isArray(originalArray)) {
    C = originalArray.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    else if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};

},{"../internals/is-array":65,"../internals/is-object":67,"../internals/well-known-symbol":134}],16:[function(require,module,exports){
var arraySpeciesConstructor = require('../internals/array-species-constructor');

// `ArraySpeciesCreate` abstract operation
// https://tc39.es/ecma262/#sec-arrayspeciescreate
module.exports = function (originalArray, length) {
  return new (arraySpeciesConstructor(originalArray))(length === 0 ? 0 : length);
};

},{"../internals/array-species-constructor":15}],17:[function(require,module,exports){
var anObject = require('../internals/an-object');
var iteratorClose = require('../internals/iterator-close');

// call something on iterator step with safe closing on error
module.exports = function (iterator, fn, value, ENTRIES) {
  try {
    return ENTRIES ? fn(anObject(value)[0], value[1]) : fn(value);
  } catch (error) {
    iteratorClose(iterator);
    throw error;
  }
};

},{"../internals/an-object":6,"../internals/iterator-close":72}],18:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var SAFE_CLOSING = false;

try {
  var called = 0;
  var iteratorWithReturn = {
    next: function () {
      return { done: !!called++ };
    },
    'return': function () {
      SAFE_CLOSING = true;
    }
  };
  iteratorWithReturn[ITERATOR] = function () {
    return this;
  };
  // eslint-disable-next-line es/no-array-from, no-throw-literal -- required for testing
  Array.from(iteratorWithReturn, function () { throw 2; });
} catch (error) { /* empty */ }

module.exports = function (exec, SKIP_CLOSING) {
  if (!SKIP_CLOSING && !SAFE_CLOSING) return false;
  var ITERATION_SUPPORT = false;
  try {
    var object = {};
    object[ITERATOR] = function () {
      return {
        next: function () {
          return { done: ITERATION_SUPPORT = true };
        }
      };
    };
    exec(object);
  } catch (error) { /* empty */ }
  return ITERATION_SUPPORT;
};

},{"../internals/well-known-symbol":134}],19:[function(require,module,exports){
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],20:[function(require,module,exports){
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var classofRaw = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
// ES3 wrong here
var CORRECT_ARGUMENTS = classofRaw(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (error) { /* empty */ }
};

// getting tag from ES6+ `Object.prototype.toString`
module.exports = TO_STRING_TAG_SUPPORT ? classofRaw : function (it) {
  var O, tag, result;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (tag = tryGet(O = Object(it), TO_STRING_TAG)) == 'string' ? tag
    // builtinTag case
    : CORRECT_ARGUMENTS ? classofRaw(O)
    // ES3 arguments fallback
    : (result = classofRaw(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : result;
};

},{"../internals/classof-raw":19,"../internals/to-string-tag-support":129,"../internals/well-known-symbol":134}],21:[function(require,module,exports){
'use strict';
var defineProperty = require('../internals/object-define-property').f;
var create = require('../internals/object-create');
var redefineAll = require('../internals/redefine-all');
var bind = require('../internals/function-bind-context');
var anInstance = require('../internals/an-instance');
var iterate = require('../internals/iterate');
var defineIterator = require('../internals/define-iterator');
var setSpecies = require('../internals/set-species');
var DESCRIPTORS = require('../internals/descriptors');
var fastKey = require('../internals/internal-metadata').fastKey;
var InternalStateModule = require('../internals/internal-state');

var setInternalState = InternalStateModule.set;
var internalStateGetterFor = InternalStateModule.getterFor;

module.exports = {
  getConstructor: function (wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, CONSTRUCTOR_NAME);
      setInternalState(that, {
        type: CONSTRUCTOR_NAME,
        index: create(null),
        first: undefined,
        last: undefined,
        size: 0
      });
      if (!DESCRIPTORS) that.size = 0;
      if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
    });

    var getInternalState = internalStateGetterFor(CONSTRUCTOR_NAME);

    var define = function (that, key, value) {
      var state = getInternalState(that);
      var entry = getEntry(that, key);
      var previous, index;
      // change existing entry
      if (entry) {
        entry.value = value;
      // create new entry
      } else {
        state.last = entry = {
          index: index = fastKey(key, true),
          key: key,
          value: value,
          previous: previous = state.last,
          next: undefined,
          removed: false
        };
        if (!state.first) state.first = entry;
        if (previous) previous.next = entry;
        if (DESCRIPTORS) state.size++;
        else that.size++;
        // add to index
        if (index !== 'F') state.index[index] = entry;
      } return that;
    };

    var getEntry = function (that, key) {
      var state = getInternalState(that);
      // fast case
      var index = fastKey(key);
      var entry;
      if (index !== 'F') return state.index[index];
      // frozen object case
      for (entry = state.first; entry; entry = entry.next) {
        if (entry.key == key) return entry;
      }
    };

    redefineAll(C.prototype, {
      // `{ Map, Set }.prototype.clear()` methods
      // https://tc39.es/ecma262/#sec-map.prototype.clear
      // https://tc39.es/ecma262/#sec-set.prototype.clear
      clear: function clear() {
        var that = this;
        var state = getInternalState(that);
        var data = state.index;
        var entry = state.first;
        while (entry) {
          entry.removed = true;
          if (entry.previous) entry.previous = entry.previous.next = undefined;
          delete data[entry.index];
          entry = entry.next;
        }
        state.first = state.last = undefined;
        if (DESCRIPTORS) state.size = 0;
        else that.size = 0;
      },
      // `{ Map, Set }.prototype.delete(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.delete
      // https://tc39.es/ecma262/#sec-set.prototype.delete
      'delete': function (key) {
        var that = this;
        var state = getInternalState(that);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.next;
          var prev = entry.previous;
          delete state.index[entry.index];
          entry.removed = true;
          if (prev) prev.next = next;
          if (next) next.previous = prev;
          if (state.first == entry) state.first = next;
          if (state.last == entry) state.last = prev;
          if (DESCRIPTORS) state.size--;
          else that.size--;
        } return !!entry;
      },
      // `{ Map, Set }.prototype.forEach(callbackfn, thisArg = undefined)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.foreach
      // https://tc39.es/ecma262/#sec-set.prototype.foreach
      forEach: function forEach(callbackfn /* , that = undefined */) {
        var state = getInternalState(this);
        var boundFunction = bind(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.next : state.first) {
          boundFunction(entry.value, entry.key, this);
          // revert to the last existing entry
          while (entry && entry.removed) entry = entry.previous;
        }
      },
      // `{ Map, Set}.prototype.has(key)` methods
      // https://tc39.es/ecma262/#sec-map.prototype.has
      // https://tc39.es/ecma262/#sec-set.prototype.has
      has: function has(key) {
        return !!getEntry(this, key);
      }
    });

    redefineAll(C.prototype, IS_MAP ? {
      // `Map.prototype.get(key)` method
      // https://tc39.es/ecma262/#sec-map.prototype.get
      get: function get(key) {
        var entry = getEntry(this, key);
        return entry && entry.value;
      },
      // `Map.prototype.set(key, value)` method
      // https://tc39.es/ecma262/#sec-map.prototype.set
      set: function set(key, value) {
        return define(this, key === 0 ? 0 : key, value);
      }
    } : {
      // `Set.prototype.add(value)` method
      // https://tc39.es/ecma262/#sec-set.prototype.add
      add: function add(value) {
        return define(this, value = value === 0 ? 0 : value, value);
      }
    });
    if (DESCRIPTORS) defineProperty(C.prototype, 'size', {
      get: function () {
        return getInternalState(this).size;
      }
    });
    return C;
  },
  setStrong: function (C, CONSTRUCTOR_NAME, IS_MAP) {
    var ITERATOR_NAME = CONSTRUCTOR_NAME + ' Iterator';
    var getInternalCollectionState = internalStateGetterFor(CONSTRUCTOR_NAME);
    var getInternalIteratorState = internalStateGetterFor(ITERATOR_NAME);
    // `{ Map, Set }.prototype.{ keys, values, entries, @@iterator }()` methods
    // https://tc39.es/ecma262/#sec-map.prototype.entries
    // https://tc39.es/ecma262/#sec-map.prototype.keys
    // https://tc39.es/ecma262/#sec-map.prototype.values
    // https://tc39.es/ecma262/#sec-map.prototype-@@iterator
    // https://tc39.es/ecma262/#sec-set.prototype.entries
    // https://tc39.es/ecma262/#sec-set.prototype.keys
    // https://tc39.es/ecma262/#sec-set.prototype.values
    // https://tc39.es/ecma262/#sec-set.prototype-@@iterator
    defineIterator(C, CONSTRUCTOR_NAME, function (iterated, kind) {
      setInternalState(this, {
        type: ITERATOR_NAME,
        target: iterated,
        state: getInternalCollectionState(iterated),
        kind: kind,
        last: undefined
      });
    }, function () {
      var state = getInternalIteratorState(this);
      var kind = state.kind;
      var entry = state.last;
      // revert to the last existing entry
      while (entry && entry.removed) entry = entry.previous;
      // get next entry
      if (!state.target || !(state.last = entry = entry ? entry.next : state.state.first)) {
        // or finish the iteration
        state.target = undefined;
        return { value: undefined, done: true };
      }
      // return step by kind
      if (kind == 'keys') return { value: entry.key, done: false };
      if (kind == 'values') return { value: entry.value, done: false };
      return { value: [entry.key, entry.value], done: false };
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // `{ Map, Set }.prototype[@@species]` accessors
    // https://tc39.es/ecma262/#sec-get-map-@@species
    // https://tc39.es/ecma262/#sec-get-set-@@species
    setSpecies(CONSTRUCTOR_NAME);
  }
};

},{"../internals/an-instance":5,"../internals/define-iterator":31,"../internals/descriptors":33,"../internals/function-bind-context":48,"../internals/internal-metadata":62,"../internals/internal-state":63,"../internals/iterate":71,"../internals/object-create":83,"../internals/object-define-property":85,"../internals/redefine-all":102,"../internals/set-species":112}],22:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var isForced = require('../internals/is-forced');
var redefine = require('../internals/redefine');
var InternalMetadataModule = require('../internals/internal-metadata');
var iterate = require('../internals/iterate');
var anInstance = require('../internals/an-instance');
var isObject = require('../internals/is-object');
var fails = require('../internals/fails');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var setToStringTag = require('../internals/set-to-string-tag');
var inheritIfRequired = require('../internals/inherit-if-required');

module.exports = function (CONSTRUCTOR_NAME, wrapper, common) {
  var IS_MAP = CONSTRUCTOR_NAME.indexOf('Map') !== -1;
  var IS_WEAK = CONSTRUCTOR_NAME.indexOf('Weak') !== -1;
  var ADDER = IS_MAP ? 'set' : 'add';
  var NativeConstructor = global[CONSTRUCTOR_NAME];
  var NativePrototype = NativeConstructor && NativeConstructor.prototype;
  var Constructor = NativeConstructor;
  var exported = {};

  var fixMethod = function (KEY) {
    var nativeMethod = NativePrototype[KEY];
    redefine(NativePrototype, KEY,
      KEY == 'add' ? function add(value) {
        nativeMethod.call(this, value === 0 ? 0 : value);
        return this;
      } : KEY == 'delete' ? function (key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'get' ? function get(key) {
        return IS_WEAK && !isObject(key) ? undefined : nativeMethod.call(this, key === 0 ? 0 : key);
      } : KEY == 'has' ? function has(key) {
        return IS_WEAK && !isObject(key) ? false : nativeMethod.call(this, key === 0 ? 0 : key);
      } : function set(key, value) {
        nativeMethod.call(this, key === 0 ? 0 : key, value);
        return this;
      }
    );
  };

  var REPLACE = isForced(
    CONSTRUCTOR_NAME,
    typeof NativeConstructor != 'function' || !(IS_WEAK || NativePrototype.forEach && !fails(function () {
      new NativeConstructor().entries().next();
    }))
  );

  if (REPLACE) {
    // create collection constructor
    Constructor = common.getConstructor(wrapper, CONSTRUCTOR_NAME, IS_MAP, ADDER);
    InternalMetadataModule.enable();
  } else if (isForced(CONSTRUCTOR_NAME, true)) {
    var instance = new Constructor();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~ Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    // eslint-disable-next-line no-new -- required for testing
    var ACCEPT_ITERABLES = checkCorrectnessOfIteration(function (iterable) { new NativeConstructor(iterable); });
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new NativeConstructor();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });

    if (!ACCEPT_ITERABLES) {
      Constructor = wrapper(function (dummy, iterable) {
        anInstance(dummy, Constructor, CONSTRUCTOR_NAME);
        var that = inheritIfRequired(new NativeConstructor(), dummy, Constructor);
        if (iterable != undefined) iterate(iterable, that[ADDER], { that: that, AS_ENTRIES: IS_MAP });
        return that;
      });
      Constructor.prototype = NativePrototype;
      NativePrototype.constructor = Constructor;
    }

    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }

    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);

    // weak collections should not contains .clear method
    if (IS_WEAK && NativePrototype.clear) delete NativePrototype.clear;
  }

  exported[CONSTRUCTOR_NAME] = Constructor;
  $({ global: true, forced: Constructor != NativeConstructor }, exported);

  setToStringTag(Constructor, CONSTRUCTOR_NAME);

  if (!IS_WEAK) common.setStrong(Constructor, CONSTRUCTOR_NAME, IS_MAP);

  return Constructor;
};

},{"../internals/an-instance":5,"../internals/check-correctness-of-iteration":18,"../internals/export":44,"../internals/fails":45,"../internals/global":53,"../internals/inherit-if-required":60,"../internals/internal-metadata":62,"../internals/is-forced":66,"../internals/is-object":67,"../internals/iterate":71,"../internals/redefine":103,"../internals/set-to-string-tag":113}],23:[function(require,module,exports){
var has = require('../internals/has');
var ownKeys = require('../internals/own-keys');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');

module.exports = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = definePropertyModule.f;
  var getOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

},{"../internals/has":54,"../internals/object-define-property":85,"../internals/object-get-own-property-descriptor":86,"../internals/own-keys":98}],24:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');

module.exports = function (METHOD_NAME) {
  var regexp = /./;
  try {
    '/./'[METHOD_NAME](regexp);
  } catch (error1) {
    try {
      regexp[MATCH] = false;
      return '/./'[METHOD_NAME](regexp);
    } catch (error2) { /* empty */ }
  } return false;
};

},{"../internals/well-known-symbol":134}],25:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !fails(function () {
  function F() { /* empty */ }
  F.prototype.constructor = null;
  // eslint-disable-next-line es/no-object-getprototypeof -- required for testing
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

},{"../internals/fails":45}],26:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');

var quot = /"/g;

// `CreateHTML` abstract operation
// https://tc39.es/ecma262/#sec-createhtml
module.exports = function (string, tag, attribute, value) {
  var S = toString(requireObjectCoercible(string));
  var p1 = '<' + tag;
  if (attribute !== '') p1 += ' ' + attribute + '="' + toString(value).replace(quot, '&quot;') + '"';
  return p1 + '>' + S + '</' + tag + '>';
};

},{"../internals/require-object-coercible":110,"../internals/to-string":130}],27:[function(require,module,exports){
'use strict';
var IteratorPrototype = require('../internals/iterators-core').IteratorPrototype;
var create = require('../internals/object-create');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var setToStringTag = require('../internals/set-to-string-tag');
var Iterators = require('../internals/iterators');

var returnThis = function () { return this; };

module.exports = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = create(IteratorPrototype, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false, true);
  Iterators[TO_STRING_TAG] = returnThis;
  return IteratorConstructor;
};

},{"../internals/create-property-descriptor":29,"../internals/iterators":74,"../internals/iterators-core":73,"../internals/object-create":83,"../internals/set-to-string-tag":113}],28:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = DESCRIPTORS ? function (object, key, value) {
  return definePropertyModule.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"../internals/create-property-descriptor":29,"../internals/descriptors":33,"../internals/object-define-property":85}],29:[function(require,module,exports){
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],30:[function(require,module,exports){
'use strict';
var toPropertyKey = require('../internals/to-property-key');
var definePropertyModule = require('../internals/object-define-property');
var createPropertyDescriptor = require('../internals/create-property-descriptor');

module.exports = function (object, key, value) {
  var propertyKey = toPropertyKey(key);
  if (propertyKey in object) definePropertyModule.f(object, propertyKey, createPropertyDescriptor(0, value));
  else object[propertyKey] = value;
};

},{"../internals/create-property-descriptor":29,"../internals/object-define-property":85,"../internals/to-property-key":128}],31:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var createIteratorConstructor = require('../internals/create-iterator-constructor');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');
var Iterators = require('../internals/iterators');
var IteratorsCore = require('../internals/iterators-core');

var IteratorPrototype = IteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS = IteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';

var returnThis = function () { return this; };

module.exports = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);

  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };

  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;

  // fix native
  if (anyNativeIterator) {
    CurrentIteratorPrototype = getPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype !== Object.prototype && CurrentIteratorPrototype.next) {
      if (!IS_PURE && getPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype) {
        if (setPrototypeOf) {
          setPrototypeOf(CurrentIteratorPrototype, IteratorPrototype);
        } else if (typeof CurrentIteratorPrototype[ITERATOR] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR, returnThis);
        }
      }
      // Set @@toStringTag to native iterators
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true, true);
      if (IS_PURE) Iterators[TO_STRING_TAG] = returnThis;
    }
  }

  // fix Array.prototype.{ values, @@iterator }.name in V8 / FF
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }

  // define iterator
  if ((!IS_PURE || FORCED) && IterablePrototype[ITERATOR] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR, defaultIterator);
  }
  Iterators[NAME] = defaultIterator;

  // export additional methods
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else $({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS || INCORRECT_VALUES_NAME }, methods);
  }

  return methods;
};

},{"../internals/create-iterator-constructor":27,"../internals/create-non-enumerable-property":28,"../internals/export":44,"../internals/is-pure":68,"../internals/iterators":74,"../internals/iterators-core":73,"../internals/object-get-prototype-of":90,"../internals/object-set-prototype-of":94,"../internals/redefine":103,"../internals/set-to-string-tag":113,"../internals/well-known-symbol":134}],32:[function(require,module,exports){
var path = require('../internals/path');
var has = require('../internals/has');
var wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped');
var defineProperty = require('../internals/object-define-property').f;

module.exports = function (NAME) {
  var Symbol = path.Symbol || (path.Symbol = {});
  if (!has(Symbol, NAME)) defineProperty(Symbol, NAME, {
    value: wrappedWellKnownSymbolModule.f(NAME)
  });
};

},{"../internals/has":54,"../internals/object-define-property":85,"../internals/path":99,"../internals/well-known-symbol-wrapped":133}],33:[function(require,module,exports){
var fails = require('../internals/fails');

// Detect IE8's incomplete defineProperty implementation
module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- required for testing
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

},{"../internals/fails":45}],34:[function(require,module,exports){
var global = require('../internals/global');
var isObject = require('../internals/is-object');

var document = global.document;
// typeof document.createElement is 'object' in old IE
var EXISTS = isObject(document) && isObject(document.createElement);

module.exports = function (it) {
  return EXISTS ? document.createElement(it) : {};
};

},{"../internals/global":53,"../internals/is-object":67}],35:[function(require,module,exports){
// iterable DOM collections
// flag - `iterable` interface - 'entries', 'keys', 'values', 'forEach' methods
module.exports = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

},{}],36:[function(require,module,exports){
module.exports = typeof window == 'object';

},{}],37:[function(require,module,exports){
var userAgent = require('../internals/engine-user-agent');
var global = require('../internals/global');

module.exports = /iphone|ipod|ipad/i.test(userAgent) && global.Pebble !== undefined;

},{"../internals/engine-user-agent":41,"../internals/global":53}],38:[function(require,module,exports){
var userAgent = require('../internals/engine-user-agent');

module.exports = /(?:iphone|ipod|ipad).*applewebkit/i.test(userAgent);

},{"../internals/engine-user-agent":41}],39:[function(require,module,exports){
var classof = require('../internals/classof-raw');
var global = require('../internals/global');

module.exports = classof(global.process) == 'process';

},{"../internals/classof-raw":19,"../internals/global":53}],40:[function(require,module,exports){
var userAgent = require('../internals/engine-user-agent');

module.exports = /web0s(?!.*chrome)/i.test(userAgent);

},{"../internals/engine-user-agent":41}],41:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('navigator', 'userAgent') || '';

},{"../internals/get-built-in":50}],42:[function(require,module,exports){
var global = require('../internals/global');
var userAgent = require('../internals/engine-user-agent');

var process = global.process;
var Deno = global.Deno;
var versions = process && process.versions || Deno && Deno.version;
var v8 = versions && versions.v8;
var match, version;

if (v8) {
  match = v8.split('.');
  version = match[0] < 4 ? 1 : match[0] + match[1];
} else if (userAgent) {
  match = userAgent.match(/Edge\/(\d+)/);
  if (!match || match[1] >= 74) {
    match = userAgent.match(/Chrome\/(\d+)/);
    if (match) version = match[1];
  }
}

module.exports = version && +version;

},{"../internals/engine-user-agent":41,"../internals/global":53}],43:[function(require,module,exports){
// IE8- don't enum bug keys
module.exports = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

},{}],44:[function(require,module,exports){
var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var setGlobal = require('../internals/set-global');
var copyConstructorProperties = require('../internals/copy-constructor-properties');
var isForced = require('../internals/is-forced');

/*
  options.target      - name of the target object
  options.global      - target is the global object
  options.stat        - export as static methods of target
  options.proto       - export as prototype methods of target
  options.real        - real prototype method for the `pure` version
  options.forced      - export even if the native feature is available
  options.bind        - bind methods to the target, required for the `pure` version
  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
  options.sham        - add a flag to not completely full polyfills
  options.enumerable  - export as enumerable property
  options.noTargetGet - prevent calling a getter on target
*/
module.exports = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global;
  } else if (STATIC) {
    target = global[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    // contained in target
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    // add a flag to not completely full polyfills
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    // extend global
    redefine(target, key, sourceProperty, options);
  }
};

},{"../internals/copy-constructor-properties":23,"../internals/create-non-enumerable-property":28,"../internals/global":53,"../internals/is-forced":66,"../internals/object-get-own-property-descriptor":86,"../internals/redefine":103,"../internals/set-global":111}],45:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

},{}],46:[function(require,module,exports){
'use strict';
// TODO: Remove from `core-js@4` since it's moved to entry points
require('../modules/es.regexp.exec');
var redefine = require('../internals/redefine');
var regexpExec = require('../internals/regexp-exec');
var fails = require('../internals/fails');
var wellKnownSymbol = require('../internals/well-known-symbol');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

var SPECIES = wellKnownSymbol('species');
var RegExpPrototype = RegExp.prototype;

module.exports = function (KEY, exec, FORCED, SHAM) {
  var SYMBOL = wellKnownSymbol(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;

    if (KEY === 'split') {
      // We can't use real regex here since it causes deoptimization
      // and serious performance degradation in V8
      // https://github.com/zloirock/core-js/issues/306
      re = {};
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }

    re.exec = function () { execCalled = true; return null; };

    re[SYMBOL]('');
    return !execCalled;
  });

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    FORCED
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      var $exec = regexp.exec;
      if ($exec === regexpExec || $exec === RegExpPrototype.exec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          // The native String method already delegates to @@method (this
          // polyfilled function), leasing to infinite recursion.
          // We avoid it by directly calling the native @@method method.
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    });

    redefine(String.prototype, KEY, methods[0]);
    redefine(RegExpPrototype, SYMBOL, methods[1]);
  }

  if (SHAM) createNonEnumerableProperty(RegExpPrototype[SYMBOL], 'sham', true);
};

},{"../internals/create-non-enumerable-property":28,"../internals/fails":45,"../internals/redefine":103,"../internals/regexp-exec":105,"../internals/well-known-symbol":134,"../modules/es.regexp.exec":165}],47:[function(require,module,exports){
var fails = require('../internals/fails');

module.exports = !fails(function () {
  // eslint-disable-next-line es/no-object-isextensible, es/no-object-preventextensions -- required for testing
  return Object.isExtensible(Object.preventExtensions({}));
});

},{"../internals/fails":45}],48:[function(require,module,exports){
var aFunction = require('../internals/a-function');

// optional / simple context binding
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 0: return function () {
      return fn.call(that);
    };
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

},{"../internals/a-function":1}],49:[function(require,module,exports){
'use strict';
var aFunction = require('../internals/a-function');
var isObject = require('../internals/is-object');

var slice = [].slice;
var factories = {};

var construct = function (C, argsLength, args) {
  if (!(argsLength in factories)) {
    for (var list = [], i = 0; i < argsLength; i++) list[i] = 'a[' + i + ']';
    // eslint-disable-next-line no-new-func -- we have no proper alternatives, IE8- only
    factories[argsLength] = Function('C,a', 'return new C(' + list.join(',') + ')');
  } return factories[argsLength](C, args);
};

// `Function.prototype.bind` method implementation
// https://tc39.es/ecma262/#sec-function.prototype.bind
module.exports = Function.bind || function bind(that /* , ...args */) {
  var fn = aFunction(this);
  var partArgs = slice.call(arguments, 1);
  var boundFunction = function bound(/* args... */) {
    var args = partArgs.concat(slice.call(arguments));
    return this instanceof boundFunction ? construct(fn, args.length, args) : fn.apply(that, args);
  };
  if (isObject(fn.prototype)) boundFunction.prototype = fn.prototype;
  return boundFunction;
};

},{"../internals/a-function":1,"../internals/is-object":67}],50:[function(require,module,exports){
var global = require('../internals/global');

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};

module.exports = function (namespace, method) {
  return arguments.length < 2 ? aFunction(global[namespace]) : global[namespace] && global[namespace][method];
};

},{"../internals/global":53}],51:[function(require,module,exports){
var classof = require('../internals/classof');
var Iterators = require('../internals/iterators');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');

module.exports = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"../internals/classof":20,"../internals/iterators":74,"../internals/well-known-symbol":134}],52:[function(require,module,exports){
var toObject = require('../internals/to-object');

var floor = Math.floor;
var replace = ''.replace;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d{1,2}|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d{1,2})/g;

// `GetSubstitution` abstract operation
// https://tc39.es/ecma262/#sec-getsubstitution
module.exports = function (matched, str, position, captures, namedCaptures, replacement) {
  var tailPos = position + matched.length;
  var m = captures.length;
  var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
  if (namedCaptures !== undefined) {
    namedCaptures = toObject(namedCaptures);
    symbols = SUBSTITUTION_SYMBOLS;
  }
  return replace.call(replacement, symbols, function (match, ch) {
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
};

},{"../internals/to-object":126}],53:[function(require,module,exports){
(function (global){(function (){
var check = function (it) {
  return it && it.Math == Math && it;
};

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
module.exports =
  // eslint-disable-next-line es/no-global-this -- safe
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  // eslint-disable-next-line no-restricted-globals -- safe
  check(typeof self == 'object' && self) ||
  check(typeof global == 'object' && global) ||
  // eslint-disable-next-line no-new-func -- fallback
  (function () { return this; })() || Function('return this')();

}).call(this)}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],54:[function(require,module,exports){
var toObject = require('../internals/to-object');

var hasOwnProperty = {}.hasOwnProperty;

module.exports = Object.hasOwn || function hasOwn(it, key) {
  return hasOwnProperty.call(toObject(it), key);
};

},{"../internals/to-object":126}],55:[function(require,module,exports){
module.exports = {};

},{}],56:[function(require,module,exports){
var global = require('../internals/global');

module.exports = function (a, b) {
  var console = global.console;
  if (console && console.error) {
    arguments.length === 1 ? console.error(a) : console.error(a, b);
  }
};

},{"../internals/global":53}],57:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');

module.exports = getBuiltIn('document', 'documentElement');

},{"../internals/get-built-in":50}],58:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var createElement = require('../internals/document-create-element');

// Thank's IE8 for his funny defineProperty
module.exports = !DESCRIPTORS && !fails(function () {
  // eslint-disable-next-line es/no-object-defineproperty -- requied for testing
  return Object.defineProperty(createElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

},{"../internals/descriptors":33,"../internals/document-create-element":34,"../internals/fails":45}],59:[function(require,module,exports){
var fails = require('../internals/fails');
var classof = require('../internals/classof-raw');

var split = ''.split;

// fallback for non-array-like ES3 and non-enumerable old V8 strings
module.exports = fails(function () {
  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
  // eslint-disable-next-line no-prototype-builtins -- safe
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classof(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

},{"../internals/classof-raw":19,"../internals/fails":45}],60:[function(require,module,exports){
var isObject = require('../internals/is-object');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// makes subclassing work correct for wrapped built-ins
module.exports = function ($this, dummy, Wrapper) {
  var NewTarget, NewTargetPrototype;
  if (
    // it can work only with native `setPrototypeOf`
    setPrototypeOf &&
    // we haven't completely correct pre-ES6 way for getting `new.target`, so use this
    typeof (NewTarget = dummy.constructor) == 'function' &&
    NewTarget !== Wrapper &&
    isObject(NewTargetPrototype = NewTarget.prototype) &&
    NewTargetPrototype !== Wrapper.prototype
  ) setPrototypeOf($this, NewTargetPrototype);
  return $this;
};

},{"../internals/is-object":67,"../internals/object-set-prototype-of":94}],61:[function(require,module,exports){
var store = require('../internals/shared-store');

var functionToString = Function.toString;

// this helper broken in `core-js@3.4.1-3.4.4`, so we can't use `shared` helper
if (typeof store.inspectSource != 'function') {
  store.inspectSource = function (it) {
    return functionToString.call(it);
  };
}

module.exports = store.inspectSource;

},{"../internals/shared-store":115}],62:[function(require,module,exports){
var $ = require('../internals/export');
var hiddenKeys = require('../internals/hidden-keys');
var isObject = require('../internals/is-object');
var has = require('../internals/has');
var defineProperty = require('../internals/object-define-property').f;
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertyNamesExternalModule = require('../internals/object-get-own-property-names-external');
var uid = require('../internals/uid');
var FREEZING = require('../internals/freezing');

var REQUIRED = false;
var METADATA = uid('meta');
var id = 0;

// eslint-disable-next-line es/no-object-isextensible -- safe
var isExtensible = Object.isExtensible || function () {
  return true;
};

var setMetadata = function (it) {
  defineProperty(it, METADATA, { value: {
    objectID: 'O' + id++, // object ID
    weakData: {}          // weak collections IDs
  } });
};

var fastKey = function (it, create) {
  // return a primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMetadata(it);
  // return object ID
  } return it[METADATA].objectID;
};

var getWeakData = function (it, create) {
  if (!has(it, METADATA)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMetadata(it);
  // return the store of weak collections IDs
  } return it[METADATA].weakData;
};

// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZING && REQUIRED && isExtensible(it) && !has(it, METADATA)) setMetadata(it);
  return it;
};

var enable = function () {
  meta.enable = function () { /* empty */ };
  REQUIRED = true;
  var getOwnPropertyNames = getOwnPropertyNamesModule.f;
  var splice = [].splice;
  var test = {};
  test[METADATA] = 1;

  // prevent exposing of metadata key
  if (getOwnPropertyNames(test).length) {
    getOwnPropertyNamesModule.f = function (it) {
      var result = getOwnPropertyNames(it);
      for (var i = 0, length = result.length; i < length; i++) {
        if (result[i] === METADATA) {
          splice.call(result, i, 1);
          break;
        }
      } return result;
    };

    $({ target: 'Object', stat: true, forced: true }, {
      getOwnPropertyNames: getOwnPropertyNamesExternalModule.f
    });
  }
};

var meta = module.exports = {
  enable: enable,
  fastKey: fastKey,
  getWeakData: getWeakData,
  onFreeze: onFreeze
};

hiddenKeys[METADATA] = true;

},{"../internals/export":44,"../internals/freezing":47,"../internals/has":54,"../internals/hidden-keys":55,"../internals/is-object":67,"../internals/object-define-property":85,"../internals/object-get-own-property-names":88,"../internals/object-get-own-property-names-external":87,"../internals/uid":131}],63:[function(require,module,exports){
var NATIVE_WEAK_MAP = require('../internals/native-weak-map');
var global = require('../internals/global');
var isObject = require('../internals/is-object');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var objectHas = require('../internals/has');
var shared = require('../internals/shared-store');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');

var OBJECT_ALREADY_INITIALIZED = 'Object already initialized';
var WeakMap = global.WeakMap;
var set, get, has;

var enforce = function (it) {
  return has(it) ? get(it) : set(it, {});
};

var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};

if (NATIVE_WEAK_MAP || shared.state) {
  var store = shared.state || (shared.state = new WeakMap());
  var wmget = store.get;
  var wmhas = store.has;
  var wmset = store.set;
  set = function (it, metadata) {
    if (wmhas.call(store, it)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    wmset.call(store, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store, it) || {};
  };
  has = function (it) {
    return wmhas.call(store, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    if (objectHas(it, STATE)) throw new TypeError(OBJECT_ALREADY_INITIALIZED);
    metadata.facade = it;
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return objectHas(it, STATE) ? it[STATE] : {};
  };
  has = function (it) {
    return objectHas(it, STATE);
  };
}

module.exports = {
  set: set,
  get: get,
  has: has,
  enforce: enforce,
  getterFor: getterFor
};

},{"../internals/create-non-enumerable-property":28,"../internals/global":53,"../internals/has":54,"../internals/hidden-keys":55,"../internals/is-object":67,"../internals/native-weak-map":78,"../internals/shared-key":114,"../internals/shared-store":115}],64:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');
var Iterators = require('../internals/iterators');

var ITERATOR = wellKnownSymbol('iterator');
var ArrayPrototype = Array.prototype;

// check on default Array iterator
module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayPrototype[ITERATOR] === it);
};

},{"../internals/iterators":74,"../internals/well-known-symbol":134}],65:[function(require,module,exports){
var classof = require('../internals/classof-raw');

// `IsArray` abstract operation
// https://tc39.es/ecma262/#sec-isarray
// eslint-disable-next-line es/no-array-isarray -- safe
module.exports = Array.isArray || function isArray(arg) {
  return classof(arg) == 'Array';
};

},{"../internals/classof-raw":19}],66:[function(require,module,exports){
var fails = require('../internals/fails');

var replacement = /#|\.prototype\./;

var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};

var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};

var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';

module.exports = isForced;

},{"../internals/fails":45}],67:[function(require,module,exports){
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],68:[function(require,module,exports){
module.exports = false;

},{}],69:[function(require,module,exports){
var isObject = require('../internals/is-object');
var classof = require('../internals/classof-raw');
var wellKnownSymbol = require('../internals/well-known-symbol');

var MATCH = wellKnownSymbol('match');

// `IsRegExp` abstract operation
// https://tc39.es/ecma262/#sec-isregexp
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : classof(it) == 'RegExp');
};

},{"../internals/classof-raw":19,"../internals/is-object":67,"../internals/well-known-symbol":134}],70:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

module.exports = USE_SYMBOL_AS_UID ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  var $Symbol = getBuiltIn('Symbol');
  return typeof $Symbol == 'function' && Object(it) instanceof $Symbol;
};

},{"../internals/get-built-in":50,"../internals/use-symbol-as-uid":132}],71:[function(require,module,exports){
var anObject = require('../internals/an-object');
var isArrayIteratorMethod = require('../internals/is-array-iterator-method');
var toLength = require('../internals/to-length');
var bind = require('../internals/function-bind-context');
var getIteratorMethod = require('../internals/get-iterator-method');
var iteratorClose = require('../internals/iterator-close');

var Result = function (stopped, result) {
  this.stopped = stopped;
  this.result = result;
};

module.exports = function (iterable, unboundFunction, options) {
  var that = options && options.that;
  var AS_ENTRIES = !!(options && options.AS_ENTRIES);
  var IS_ITERATOR = !!(options && options.IS_ITERATOR);
  var INTERRUPTED = !!(options && options.INTERRUPTED);
  var fn = bind(unboundFunction, that, 1 + AS_ENTRIES + INTERRUPTED);
  var iterator, iterFn, index, length, result, next, step;

  var stop = function (condition) {
    if (iterator) iteratorClose(iterator);
    return new Result(true, condition);
  };

  var callFn = function (value) {
    if (AS_ENTRIES) {
      anObject(value);
      return INTERRUPTED ? fn(value[0], value[1], stop) : fn(value[0], value[1]);
    } return INTERRUPTED ? fn(value, stop) : fn(value);
  };

  if (IS_ITERATOR) {
    iterator = iterable;
  } else {
    iterFn = getIteratorMethod(iterable);
    if (typeof iterFn != 'function') throw TypeError('Target is not iterable');
    // optimisation for array iterators
    if (isArrayIteratorMethod(iterFn)) {
      for (index = 0, length = toLength(iterable.length); length > index; index++) {
        result = callFn(iterable[index]);
        if (result && result instanceof Result) return result;
      } return new Result(false);
    }
    iterator = iterFn.call(iterable);
  }

  next = iterator.next;
  while (!(step = next.call(iterator)).done) {
    try {
      result = callFn(step.value);
    } catch (error) {
      iteratorClose(iterator);
      throw error;
    }
    if (typeof result == 'object' && result && result instanceof Result) return result;
  } return new Result(false);
};

},{"../internals/an-object":6,"../internals/function-bind-context":48,"../internals/get-iterator-method":51,"../internals/is-array-iterator-method":64,"../internals/iterator-close":72,"../internals/to-length":125}],72:[function(require,module,exports){
var anObject = require('../internals/an-object');

module.exports = function (iterator) {
  var returnMethod = iterator['return'];
  if (returnMethod !== undefined) {
    return anObject(returnMethod.call(iterator)).value;
  }
};

},{"../internals/an-object":6}],73:[function(require,module,exports){
'use strict';
var fails = require('../internals/fails');
var getPrototypeOf = require('../internals/object-get-prototype-of');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var has = require('../internals/has');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_PURE = require('../internals/is-pure');

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;

var returnThis = function () { return this; };

// `%IteratorPrototype%` object
// https://tc39.es/ecma262/#sec-%iteratorprototype%-object
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;

/* eslint-disable es/no-array-prototype-keys -- safe */
if ([].keys) {
  arrayIterator = [].keys();
  // Safari 8 has buggy iterators w/o `next`
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = getPrototypeOf(getPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}

var NEW_ITERATOR_PROTOTYPE = IteratorPrototype == undefined || fails(function () {
  var test = {};
  // FF44- legacy iterators case
  return IteratorPrototype[ITERATOR].call(test) !== test;
});

if (NEW_ITERATOR_PROTOTYPE) IteratorPrototype = {};

// `%IteratorPrototype%[@@iterator]()` method
// https://tc39.es/ecma262/#sec-%iteratorprototype%-@@iterator
if ((!IS_PURE || NEW_ITERATOR_PROTOTYPE) && !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}

module.exports = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

},{"../internals/create-non-enumerable-property":28,"../internals/fails":45,"../internals/has":54,"../internals/is-pure":68,"../internals/object-get-prototype-of":90,"../internals/well-known-symbol":134}],74:[function(require,module,exports){
arguments[4][55][0].apply(exports,arguments)
},{"dup":55}],75:[function(require,module,exports){
var global = require('../internals/global');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var macrotask = require('../internals/task').set;
var IS_IOS = require('../internals/engine-is-ios');
var IS_IOS_PEBBLE = require('../internals/engine-is-ios-pebble');
var IS_WEBOS_WEBKIT = require('../internals/engine-is-webos-webkit');
var IS_NODE = require('../internals/engine-is-node');

var MutationObserver = global.MutationObserver || global.WebKitMutationObserver;
var document = global.document;
var process = global.process;
var Promise = global.Promise;
// Node.js 11 shows ExperimentalWarning on getting `queueMicrotask`
var queueMicrotaskDescriptor = getOwnPropertyDescriptor(global, 'queueMicrotask');
var queueMicrotask = queueMicrotaskDescriptor && queueMicrotaskDescriptor.value;

var flush, head, last, notify, toggle, node, promise, then;

// modern engines have queueMicrotask method
if (!queueMicrotask) {
  flush = function () {
    var parent, fn;
    if (IS_NODE && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (error) {
        if (head) notify();
        else last = undefined;
        throw error;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // browsers with MutationObserver, except iOS - https://github.com/zloirock/core-js/issues/339
  // also except WebOS Webkit https://github.com/zloirock/core-js/issues/898
  if (!IS_IOS && !IS_NODE && !IS_WEBOS_WEBKIT && MutationObserver && document) {
    toggle = true;
    node = document.createTextNode('');
    new MutationObserver(flush).observe(node, { characterData: true });
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (!IS_IOS_PEBBLE && Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    promise = Promise.resolve(undefined);
    // workaround of WebKit ~ iOS Safari 10.1 bug
    promise.constructor = Promise;
    then = promise.then;
    notify = function () {
      then.call(promise, flush);
    };
  // Node.js without promises
  } else if (IS_NODE) {
    notify = function () {
      process.nextTick(flush);
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
}

module.exports = queueMicrotask || function (fn) {
  var task = { fn: fn, next: undefined };
  if (last) last.next = task;
  if (!head) {
    head = task;
    notify();
  } last = task;
};

},{"../internals/engine-is-ios":38,"../internals/engine-is-ios-pebble":37,"../internals/engine-is-node":39,"../internals/engine-is-webos-webkit":40,"../internals/global":53,"../internals/object-get-own-property-descriptor":86,"../internals/task":121}],76:[function(require,module,exports){
var global = require('../internals/global');

module.exports = global.Promise;

},{"../internals/global":53}],77:[function(require,module,exports){
/* eslint-disable es/no-symbol -- required for testing */
var V8_VERSION = require('../internals/engine-v8-version');
var fails = require('../internals/fails');

// eslint-disable-next-line es/no-object-getownpropertysymbols -- required for testing
module.exports = !!Object.getOwnPropertySymbols && !fails(function () {
  var symbol = Symbol();
  // Chrome 38 Symbol has incorrect toString conversion
  // `get-own-property-symbols` polyfill symbols converted to object are not Symbol instances
  return !String(symbol) || !(Object(symbol) instanceof Symbol) ||
    // Chrome 38-40 symbols are not inherited from DOM collections prototypes to instances
    !Symbol.sham && V8_VERSION && V8_VERSION < 41;
});

},{"../internals/engine-v8-version":42,"../internals/fails":45}],78:[function(require,module,exports){
var global = require('../internals/global');
var inspectSource = require('../internals/inspect-source');

var WeakMap = global.WeakMap;

module.exports = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

},{"../internals/global":53,"../internals/inspect-source":61}],79:[function(require,module,exports){
'use strict';
var aFunction = require('../internals/a-function');

var PromiseCapability = function (C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
};

// `NewPromiseCapability` abstract operation
// https://tc39.es/ecma262/#sec-newpromisecapability
module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"../internals/a-function":1}],80:[function(require,module,exports){
var isRegExp = require('../internals/is-regexp');

module.exports = function (it) {
  if (isRegExp(it)) {
    throw TypeError("The method doesn't accept regular expressions");
  } return it;
};

},{"../internals/is-regexp":69}],81:[function(require,module,exports){
var global = require('../internals/global');
var toString = require('../internals/to-string');
var trim = require('../internals/string-trim').trim;
var whitespaces = require('../internals/whitespaces');

var $parseInt = global.parseInt;
var hex = /^[+-]?0[Xx]/;
var FORCED = $parseInt(whitespaces + '08') !== 8 || $parseInt(whitespaces + '0x16') !== 22;

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
module.exports = FORCED ? function parseInt(string, radix) {
  var S = trim(toString(string));
  return $parseInt(S, (radix >>> 0) || (hex.test(S) ? 16 : 10));
} : $parseInt;

},{"../internals/global":53,"../internals/string-trim":120,"../internals/to-string":130,"../internals/whitespaces":135}],82:[function(require,module,exports){
'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var fails = require('../internals/fails');
var objectKeys = require('../internals/object-keys');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var toObject = require('../internals/to-object');
var IndexedObject = require('../internals/indexed-object');

// eslint-disable-next-line es/no-object-assign -- safe
var $assign = Object.assign;
// eslint-disable-next-line es/no-object-defineproperty -- required for testing
var defineProperty = Object.defineProperty;

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
module.exports = !$assign || fails(function () {
  // should have correct order of operations (Edge bug)
  if (DESCRIPTORS && $assign({ b: 1 }, $assign(defineProperty({}, 'a', {
    enumerable: true,
    get: function () {
      defineProperty(this, 'b', {
        value: 3,
        enumerable: false
      });
    }
  }), { b: 2 })).b !== 1) return true;
  // should work with symbols and should have deterministic property order (V8 bug)
  var A = {};
  var B = {};
  // eslint-disable-next-line es/no-symbol -- safe
  var symbol = Symbol();
  var alphabet = 'abcdefghijklmnopqrst';
  A[symbol] = 7;
  alphabet.split('').forEach(function (chr) { B[chr] = chr; });
  return $assign({}, A)[symbol] != 7 || objectKeys($assign({}, B)).join('') != alphabet;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars -- required for `.length`
  var T = toObject(target);
  var argumentsLength = arguments.length;
  var index = 1;
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  var propertyIsEnumerable = propertyIsEnumerableModule.f;
  while (argumentsLength > index) {
    var S = IndexedObject(arguments[index++]);
    var keys = getOwnPropertySymbols ? objectKeys(S).concat(getOwnPropertySymbols(S)) : objectKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) {
      key = keys[j++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(S, key)) T[key] = S[key];
    }
  } return T;
} : $assign;

},{"../internals/descriptors":33,"../internals/fails":45,"../internals/indexed-object":59,"../internals/object-get-own-property-symbols":89,"../internals/object-keys":92,"../internals/object-property-is-enumerable":93,"../internals/to-object":126}],83:[function(require,module,exports){
/* global ActiveXObject -- old IE, WSH */
var anObject = require('../internals/an-object');
var defineProperties = require('../internals/object-define-properties');
var enumBugKeys = require('../internals/enum-bug-keys');
var hiddenKeys = require('../internals/hidden-keys');
var html = require('../internals/html');
var documentCreateElement = require('../internals/document-create-element');
var sharedKey = require('../internals/shared-key');

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');

var EmptyConstructor = function () { /* empty */ };

var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};

// Create object with fake `null` prototype: use ActiveX Object with cleared prototype
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null; // avoid memory leak
  return temp;
};

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var NullProtoObjectViaIFrame = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  if (iframe.style) {
    iframe.style.display = 'none';
    html.appendChild(iframe);
    // https://github.com/zloirock/core-js/issues/475
    iframe.src = String(JS);
    iframeDocument = iframe.contentWindow.document;
    iframeDocument.open();
    iframeDocument.write(scriptTag('document.F=Object'));
    iframeDocument.close();
    return iframeDocument.F;
  }
};

// Check for document.domain and active x support
// No need to use active x approach when document.domain is not set
// see https://github.com/es-shims/es5-shim/issues/150
// variation of https://github.com/kitcambridge/es5-shim/commit/4f738ac066346
// avoid IE GC bug
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = new ActiveXObject('htmlfile');
  } catch (error) { /* ignore */ }
  NullProtoObject = document.domain && activeXDocument ?
    NullProtoObjectViaActiveX(activeXDocument) : // old IE
    NullProtoObjectViaIFrame() ||
    NullProtoObjectViaActiveX(activeXDocument); // WSH
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};

hiddenKeys[IE_PROTO] = true;

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : defineProperties(result, Properties);
};

},{"../internals/an-object":6,"../internals/document-create-element":34,"../internals/enum-bug-keys":43,"../internals/hidden-keys":55,"../internals/html":57,"../internals/object-define-properties":84,"../internals/shared-key":114}],84:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var definePropertyModule = require('../internals/object-define-property');
var anObject = require('../internals/an-object');
var objectKeys = require('../internals/object-keys');

// `Object.defineProperties` method
// https://tc39.es/ecma262/#sec-object.defineproperties
// eslint-disable-next-line es/no-object-defineproperties -- safe
module.exports = DESCRIPTORS ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) definePropertyModule.f(O, key = keys[index++], Properties[key]);
  return O;
};

},{"../internals/an-object":6,"../internals/descriptors":33,"../internals/object-define-property":85,"../internals/object-keys":92}],85:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');
var anObject = require('../internals/an-object');
var toPropertyKey = require('../internals/to-property-key');

// eslint-disable-next-line es/no-object-defineproperty -- safe
var $defineProperty = Object.defineProperty;

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
exports.f = DESCRIPTORS ? $defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPropertyKey(P);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return $defineProperty(O, P, Attributes);
  } catch (error) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"../internals/an-object":6,"../internals/descriptors":33,"../internals/ie8-dom-define":58,"../internals/to-property-key":128}],86:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var toIndexedObject = require('../internals/to-indexed-object');
var toPropertyKey = require('../internals/to-property-key');
var has = require('../internals/has');
var IE8_DOM_DEFINE = require('../internals/ie8-dom-define');

// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var $getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// `Object.getOwnPropertyDescriptor` method
// https://tc39.es/ecma262/#sec-object.getownpropertydescriptor
exports.f = DESCRIPTORS ? $getOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPropertyKey(P);
  if (IE8_DOM_DEFINE) try {
    return $getOwnPropertyDescriptor(O, P);
  } catch (error) { /* empty */ }
  if (has(O, P)) return createPropertyDescriptor(!propertyIsEnumerableModule.f.call(O, P), O[P]);
};

},{"../internals/create-property-descriptor":29,"../internals/descriptors":33,"../internals/has":54,"../internals/ie8-dom-define":58,"../internals/object-property-is-enumerable":93,"../internals/to-indexed-object":123,"../internals/to-property-key":128}],87:[function(require,module,exports){
/* eslint-disable es/no-object-getownpropertynames -- safe */
var toIndexedObject = require('../internals/to-indexed-object');
var $getOwnPropertyNames = require('../internals/object-get-own-property-names').f;

var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return $getOwnPropertyNames(it);
  } catch (error) {
    return windowNames.slice();
  }
};

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]'
    ? getWindowNames(it)
    : $getOwnPropertyNames(toIndexedObject(it));
};

},{"../internals/object-get-own-property-names":88,"../internals/to-indexed-object":123}],88:[function(require,module,exports){
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

var hiddenKeys = enumBugKeys.concat('length', 'prototype');

// `Object.getOwnPropertyNames` method
// https://tc39.es/ecma262/#sec-object.getownpropertynames
// eslint-disable-next-line es/no-object-getownpropertynames -- safe
exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return internalObjectKeys(O, hiddenKeys);
};

},{"../internals/enum-bug-keys":43,"../internals/object-keys-internal":91}],89:[function(require,module,exports){
// eslint-disable-next-line es/no-object-getownpropertysymbols -- safe
exports.f = Object.getOwnPropertySymbols;

},{}],90:[function(require,module,exports){
var has = require('../internals/has');
var toObject = require('../internals/to-object');
var sharedKey = require('../internals/shared-key');
var CORRECT_PROTOTYPE_GETTER = require('../internals/correct-prototype-getter');

var IE_PROTO = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;

// `Object.getPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.getprototypeof
// eslint-disable-next-line es/no-object-getprototypeof -- safe
module.exports = CORRECT_PROTOTYPE_GETTER ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

},{"../internals/correct-prototype-getter":25,"../internals/has":54,"../internals/shared-key":114,"../internals/to-object":126}],91:[function(require,module,exports){
var has = require('../internals/has');
var toIndexedObject = require('../internals/to-indexed-object');
var indexOf = require('../internals/array-includes').indexOf;
var hiddenKeys = require('../internals/hidden-keys');

module.exports = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

},{"../internals/array-includes":10,"../internals/has":54,"../internals/hidden-keys":55,"../internals/to-indexed-object":123}],92:[function(require,module,exports){
var internalObjectKeys = require('../internals/object-keys-internal');
var enumBugKeys = require('../internals/enum-bug-keys');

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
// eslint-disable-next-line es/no-object-keys -- safe
module.exports = Object.keys || function keys(O) {
  return internalObjectKeys(O, enumBugKeys);
};

},{"../internals/enum-bug-keys":43,"../internals/object-keys-internal":91}],93:[function(require,module,exports){
'use strict';
var $propertyIsEnumerable = {}.propertyIsEnumerable;
// eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// Nashorn ~ JDK8 bug
var NASHORN_BUG = getOwnPropertyDescriptor && !$propertyIsEnumerable.call({ 1: 2 }, 1);

// `Object.prototype.propertyIsEnumerable` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.propertyisenumerable
exports.f = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : $propertyIsEnumerable;

},{}],94:[function(require,module,exports){
/* eslint-disable no-proto -- safe */
var anObject = require('../internals/an-object');
var aPossiblePrototype = require('../internals/a-possible-prototype');

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
// Works with __proto__ only. Old v8 can't work with null proto objects.
// eslint-disable-next-line es/no-object-setprototypeof -- safe
module.exports = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    // eslint-disable-next-line es/no-object-getownpropertydescriptor -- safe
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) { /* empty */ }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

},{"../internals/a-possible-prototype":2,"../internals/an-object":6}],95:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var objectKeys = require('../internals/object-keys');
var toIndexedObject = require('../internals/to-indexed-object');
var propertyIsEnumerable = require('../internals/object-property-is-enumerable').f;

// `Object.{ entries, values }` methods implementation
var createMethod = function (TO_ENTRIES) {
  return function (it) {
    var O = toIndexedObject(it);
    var keys = objectKeys(O);
    var length = keys.length;
    var i = 0;
    var result = [];
    var key;
    while (length > i) {
      key = keys[i++];
      if (!DESCRIPTORS || propertyIsEnumerable.call(O, key)) {
        result.push(TO_ENTRIES ? [key, O[key]] : O[key]);
      }
    }
    return result;
  };
};

module.exports = {
  // `Object.entries` method
  // https://tc39.es/ecma262/#sec-object.entries
  entries: createMethod(true),
  // `Object.values` method
  // https://tc39.es/ecma262/#sec-object.values
  values: createMethod(false)
};

},{"../internals/descriptors":33,"../internals/object-keys":92,"../internals/object-property-is-enumerable":93,"../internals/to-indexed-object":123}],96:[function(require,module,exports){
'use strict';
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var classof = require('../internals/classof');

// `Object.prototype.toString` method implementation
// https://tc39.es/ecma262/#sec-object.prototype.tostring
module.exports = TO_STRING_TAG_SUPPORT ? {}.toString : function toString() {
  return '[object ' + classof(this) + ']';
};

},{"../internals/classof":20,"../internals/to-string-tag-support":129}],97:[function(require,module,exports){
var isObject = require('../internals/is-object');

// `OrdinaryToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-ordinarytoprimitive
module.exports = function (input, pref) {
  var fn, val;
  if (pref === 'string' && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (pref !== 'string' && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"../internals/is-object":67}],98:[function(require,module,exports){
var getBuiltIn = require('../internals/get-built-in');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var anObject = require('../internals/an-object');

// all object keys, includes non-enumerable and symbols
module.exports = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = getOwnPropertyNamesModule.f(anObject(it));
  var getOwnPropertySymbols = getOwnPropertySymbolsModule.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

},{"../internals/an-object":6,"../internals/get-built-in":50,"../internals/object-get-own-property-names":88,"../internals/object-get-own-property-symbols":89}],99:[function(require,module,exports){
var global = require('../internals/global');

module.exports = global;

},{"../internals/global":53}],100:[function(require,module,exports){
module.exports = function (exec) {
  try {
    return { error: false, value: exec() };
  } catch (error) {
    return { error: true, value: error };
  }
};

},{}],101:[function(require,module,exports){
var anObject = require('../internals/an-object');
var isObject = require('../internals/is-object');
var newPromiseCapability = require('../internals/new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"../internals/an-object":6,"../internals/is-object":67,"../internals/new-promise-capability":79}],102:[function(require,module,exports){
var redefine = require('../internals/redefine');

module.exports = function (target, src, options) {
  for (var key in src) redefine(target, key, src[key], options);
  return target;
};

},{"../internals/redefine":103}],103:[function(require,module,exports){
var global = require('../internals/global');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var has = require('../internals/has');
var setGlobal = require('../internals/set-global');
var inspectSource = require('../internals/inspect-source');
var InternalStateModule = require('../internals/internal-state');

var getInternalState = InternalStateModule.get;
var enforceInternalState = InternalStateModule.enforce;
var TEMPLATE = String(String).split('String');

(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  var state;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) {
      createNonEnumerableProperty(value, 'name', key);
    }
    state = enforceInternalState(value);
    if (!state.source) {
      state.source = TEMPLATE.join(typeof key == 'string' ? key : '');
    }
  }
  if (O === global) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});

},{"../internals/create-non-enumerable-property":28,"../internals/global":53,"../internals/has":54,"../internals/inspect-source":61,"../internals/internal-state":63,"../internals/set-global":111}],104:[function(require,module,exports){
var classof = require('./classof-raw');
var regexpExec = require('./regexp-exec');

// `RegExpExec` abstract operation
// https://tc39.es/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }

  if (classof(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }

  return regexpExec.call(R, S);
};


},{"./classof-raw":19,"./regexp-exec":105}],105:[function(require,module,exports){
'use strict';
/* eslint-disable regexp/no-assertion-capturing-group, regexp/no-empty-group, regexp/no-lazy-ends -- testing */
/* eslint-disable regexp/no-useless-quantifier -- testing */
var toString = require('../internals/to-string');
var regexpFlags = require('../internals/regexp-flags');
var stickyHelpers = require('../internals/regexp-sticky-helpers');
var shared = require('../internals/shared');
var create = require('../internals/object-create');
var getInternalState = require('../internals/internal-state').get;
var UNSUPPORTED_DOT_ALL = require('../internals/regexp-unsupported-dot-all');
var UNSUPPORTED_NCG = require('../internals/regexp-unsupported-ncg');

var nativeExec = RegExp.prototype.exec;
var nativeReplace = shared('native-string-replace', String.prototype.replace);

var patchedExec = nativeExec;

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();

var UNSUPPORTED_Y = stickyHelpers.UNSUPPORTED_Y || stickyHelpers.BROKEN_CARET;

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y || UNSUPPORTED_DOT_ALL || UNSUPPORTED_NCG;

if (PATCH) {
  // eslint-disable-next-line max-statements -- TODO
  patchedExec = function exec(string) {
    var re = this;
    var state = getInternalState(re);
    var str = toString(string);
    var raw = state.raw;
    var result, reCopy, lastIndex, match, i, object, group;

    if (raw) {
      raw.lastIndex = re.lastIndex;
      result = patchedExec.call(raw, str);
      re.lastIndex = raw.lastIndex;
      return result;
    }

    var groups = state.groups;
    var sticky = UNSUPPORTED_Y && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;

    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }

      strCopy = str.slice(re.lastIndex);
      // Support anchored sticky behavior.
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str.charAt(re.lastIndex - 1) !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      // ^(? + rx + ) is needed, in combination with some str slicing, to
      // simulate the 'y' flag.
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;

    match = nativeExec.call(sticky ? reCopy : re, strCopy);

    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    if (match && groups) {
      match.groups = object = create(null);
      for (i = 0; i < groups.length; i++) {
        group = groups[i];
        object[group[0]] = match[group[1]];
      }
    }

    return match;
  };
}

module.exports = patchedExec;

},{"../internals/internal-state":63,"../internals/object-create":83,"../internals/regexp-flags":106,"../internals/regexp-sticky-helpers":107,"../internals/regexp-unsupported-dot-all":108,"../internals/regexp-unsupported-ncg":109,"../internals/shared":116,"../internals/to-string":130}],106:[function(require,module,exports){
'use strict';
var anObject = require('../internals/an-object');

// `RegExp.prototype.flags` getter implementation
// https://tc39.es/ecma262/#sec-get-regexp.prototype.flags
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

},{"../internals/an-object":6}],107:[function(require,module,exports){
var fails = require('../internals/fails');

// babel-minify transpiles RegExp('a', 'y') -> /a/y and it causes SyntaxError,
var RE = function (s, f) {
  return RegExp(s, f);
};

exports.UNSUPPORTED_Y = fails(function () {
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});

exports.BROKEN_CARET = fails(function () {
  // https://bugzilla.mozilla.org/show_bug.cgi?id=773687
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

},{"../internals/fails":45}],108:[function(require,module,exports){
var fails = require('./fails');

module.exports = fails(function () {
  // babel-minify transpiles RegExp('.', 's') -> /./s and it causes SyntaxError
  var re = RegExp('.', (typeof '').charAt(0));
  return !(re.dotAll && re.exec('\n') && re.flags === 's');
});

},{"./fails":45}],109:[function(require,module,exports){
var fails = require('./fails');

module.exports = fails(function () {
  // babel-minify transpiles RegExp('.', 'g') -> /./g and it causes SyntaxError
  var re = RegExp('(?<a>b)', (typeof '').charAt(5));
  return re.exec('b').groups.a !== 'b' ||
    'b'.replace(re, '$<a>c') !== 'bc';
});

},{"./fails":45}],110:[function(require,module,exports){
// `RequireObjectCoercible` abstract operation
// https://tc39.es/ecma262/#sec-requireobjectcoercible
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

},{}],111:[function(require,module,exports){
var global = require('../internals/global');

module.exports = function (key, value) {
  try {
    // eslint-disable-next-line es/no-object-defineproperty -- safe
    Object.defineProperty(global, key, { value: value, configurable: true, writable: true });
  } catch (error) {
    global[key] = value;
  } return value;
};

},{"../internals/global":53}],112:[function(require,module,exports){
'use strict';
var getBuiltIn = require('../internals/get-built-in');
var definePropertyModule = require('../internals/object-define-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var DESCRIPTORS = require('../internals/descriptors');

var SPECIES = wellKnownSymbol('species');

module.exports = function (CONSTRUCTOR_NAME) {
  var Constructor = getBuiltIn(CONSTRUCTOR_NAME);
  var defineProperty = definePropertyModule.f;

  if (DESCRIPTORS && Constructor && !Constructor[SPECIES]) {
    defineProperty(Constructor, SPECIES, {
      configurable: true,
      get: function () { return this; }
    });
  }
};

},{"../internals/descriptors":33,"../internals/get-built-in":50,"../internals/object-define-property":85,"../internals/well-known-symbol":134}],113:[function(require,module,exports){
var defineProperty = require('../internals/object-define-property').f;
var has = require('../internals/has');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');

module.exports = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

},{"../internals/has":54,"../internals/object-define-property":85,"../internals/well-known-symbol":134}],114:[function(require,module,exports){
var shared = require('../internals/shared');
var uid = require('../internals/uid');

var keys = shared('keys');

module.exports = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

},{"../internals/shared":116,"../internals/uid":131}],115:[function(require,module,exports){
var global = require('../internals/global');
var setGlobal = require('../internals/set-global');

var SHARED = '__core-js_shared__';
var store = global[SHARED] || setGlobal(SHARED, {});

module.exports = store;

},{"../internals/global":53,"../internals/set-global":111}],116:[function(require,module,exports){
var IS_PURE = require('../internals/is-pure');
var store = require('../internals/shared-store');

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.16.1',
  mode: IS_PURE ? 'pure' : 'global',
  copyright: '© 2021 Denis Pushkarev (zloirock.ru)'
});

},{"../internals/is-pure":68,"../internals/shared-store":115}],117:[function(require,module,exports){
var anObject = require('../internals/an-object');
var aFunction = require('../internals/a-function');
var wellKnownSymbol = require('../internals/well-known-symbol');

var SPECIES = wellKnownSymbol('species');

// `SpeciesConstructor` abstract operation
// https://tc39.es/ecma262/#sec-speciesconstructor
module.exports = function (O, defaultConstructor) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? defaultConstructor : aFunction(S);
};

},{"../internals/a-function":1,"../internals/an-object":6,"../internals/well-known-symbol":134}],118:[function(require,module,exports){
var fails = require('../internals/fails');

// check the existence of a method, lowercase
// of a tag and escaping quotes in arguments
module.exports = function (METHOD_NAME) {
  return fails(function () {
    var test = ''[METHOD_NAME]('"');
    return test !== test.toLowerCase() || test.split('"').length > 3;
  });
};

},{"../internals/fails":45}],119:[function(require,module,exports){
var toInteger = require('../internals/to-integer');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');

// `String.prototype.codePointAt` methods implementation
var createMethod = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = toString(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};

module.exports = {
  // `String.prototype.codePointAt` method
  // https://tc39.es/ecma262/#sec-string.prototype.codepointat
  codeAt: createMethod(false),
  // `String.prototype.at` method
  // https://github.com/mathiasbynens/String.prototype.at
  charAt: createMethod(true)
};

},{"../internals/require-object-coercible":110,"../internals/to-integer":124,"../internals/to-string":130}],120:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');
var toString = require('../internals/to-string');
var whitespaces = require('../internals/whitespaces');

var whitespace = '[' + whitespaces + ']';
var ltrim = RegExp('^' + whitespace + whitespace + '*');
var rtrim = RegExp(whitespace + whitespace + '*$');

// `String.prototype.{ trim, trimStart, trimEnd, trimLeft, trimRight }` methods implementation
var createMethod = function (TYPE) {
  return function ($this) {
    var string = toString(requireObjectCoercible($this));
    if (TYPE & 1) string = string.replace(ltrim, '');
    if (TYPE & 2) string = string.replace(rtrim, '');
    return string;
  };
};

module.exports = {
  // `String.prototype.{ trimLeft, trimStart }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimstart
  start: createMethod(1),
  // `String.prototype.{ trimRight, trimEnd }` methods
  // https://tc39.es/ecma262/#sec-string.prototype.trimend
  end: createMethod(2),
  // `String.prototype.trim` method
  // https://tc39.es/ecma262/#sec-string.prototype.trim
  trim: createMethod(3)
};

},{"../internals/require-object-coercible":110,"../internals/to-string":130,"../internals/whitespaces":135}],121:[function(require,module,exports){
var global = require('../internals/global');
var fails = require('../internals/fails');
var bind = require('../internals/function-bind-context');
var html = require('../internals/html');
var createElement = require('../internals/document-create-element');
var IS_IOS = require('../internals/engine-is-ios');
var IS_NODE = require('../internals/engine-is-node');

var set = global.setImmediate;
var clear = global.clearImmediate;
var process = global.process;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var location, defer, channel, port;

try {
  // Deno throws a ReferenceError on `location` access without `--location` flag
  location = global.location;
} catch (error) { /* empty */ }

var run = function (id) {
  // eslint-disable-next-line no-prototype-builtins -- safe
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};

var runner = function (id) {
  return function () {
    run(id);
  };
};

var listener = function (event) {
  run(event.data);
};

var post = function (id) {
  // old engines have not location.origin
  global.postMessage(String(id), location.protocol + '//' + location.host);
};

// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!set || !clear) {
  set = function setImmediate(fn) {
    var args = [];
    var argumentsLength = arguments.length;
    var i = 1;
    while (argumentsLength > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func -- spec requirement
      (typeof fn == 'function' ? fn : Function(fn)).apply(undefined, args);
    };
    defer(counter);
    return counter;
  };
  clear = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (IS_NODE) {
    defer = function (id) {
      process.nextTick(runner(id));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(runner(id));
    };
  // Browsers with MessageChannel, includes WebWorkers
  // except iOS - https://github.com/zloirock/core-js/issues/624
  } else if (MessageChannel && !IS_IOS) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = bind(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (
    global.addEventListener &&
    typeof postMessage == 'function' &&
    !global.importScripts &&
    location && location.protocol !== 'file:' &&
    !fails(post)
  ) {
    defer = post;
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in createElement('script')) {
    defer = function (id) {
      html.appendChild(createElement('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(runner(id), 0);
    };
  }
}

module.exports = {
  set: set,
  clear: clear
};

},{"../internals/document-create-element":34,"../internals/engine-is-ios":38,"../internals/engine-is-node":39,"../internals/fails":45,"../internals/function-bind-context":48,"../internals/global":53,"../internals/html":57}],122:[function(require,module,exports){
var toInteger = require('../internals/to-integer');

var max = Math.max;
var min = Math.min;

// Helper for a popular repeating case of the spec:
// Let integer be ? ToInteger(index).
// If integer < 0, let result be max((length + integer), 0); else let result be min(integer, length).
module.exports = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min(integer, length);
};

},{"../internals/to-integer":124}],123:[function(require,module,exports){
// toObject with fallback for non-array-like ES3 strings
var IndexedObject = require('../internals/indexed-object');
var requireObjectCoercible = require('../internals/require-object-coercible');

module.exports = function (it) {
  return IndexedObject(requireObjectCoercible(it));
};

},{"../internals/indexed-object":59,"../internals/require-object-coercible":110}],124:[function(require,module,exports){
var ceil = Math.ceil;
var floor = Math.floor;

// `ToInteger` abstract operation
// https://tc39.es/ecma262/#sec-tointeger
module.exports = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

},{}],125:[function(require,module,exports){
var toInteger = require('../internals/to-integer');

var min = Math.min;

// `ToLength` abstract operation
// https://tc39.es/ecma262/#sec-tolength
module.exports = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0; // 2 ** 53 - 1 == 9007199254740991
};

},{"../internals/to-integer":124}],126:[function(require,module,exports){
var requireObjectCoercible = require('../internals/require-object-coercible');

// `ToObject` abstract operation
// https://tc39.es/ecma262/#sec-toobject
module.exports = function (argument) {
  return Object(requireObjectCoercible(argument));
};

},{"../internals/require-object-coercible":110}],127:[function(require,module,exports){
var isObject = require('../internals/is-object');
var isSymbol = require('../internals/is-symbol');
var ordinaryToPrimitive = require('../internals/ordinary-to-primitive');
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');

// `ToPrimitive` abstract operation
// https://tc39.es/ecma262/#sec-toprimitive
module.exports = function (input, pref) {
  if (!isObject(input) || isSymbol(input)) return input;
  var exoticToPrim = input[TO_PRIMITIVE];
  var result;
  if (exoticToPrim !== undefined) {
    if (pref === undefined) pref = 'default';
    result = exoticToPrim.call(input, pref);
    if (!isObject(result) || isSymbol(result)) return result;
    throw TypeError("Can't convert object to primitive value");
  }
  if (pref === undefined) pref = 'number';
  return ordinaryToPrimitive(input, pref);
};

},{"../internals/is-object":67,"../internals/is-symbol":70,"../internals/ordinary-to-primitive":97,"../internals/well-known-symbol":134}],128:[function(require,module,exports){
var toPrimitive = require('../internals/to-primitive');
var isSymbol = require('../internals/is-symbol');

// `ToPropertyKey` abstract operation
// https://tc39.es/ecma262/#sec-topropertykey
module.exports = function (argument) {
  var key = toPrimitive(argument, 'string');
  return isSymbol(key) ? key : String(key);
};

},{"../internals/is-symbol":70,"../internals/to-primitive":127}],129:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var test = {};

test[TO_STRING_TAG] = 'z';

module.exports = String(test) === '[object z]';

},{"../internals/well-known-symbol":134}],130:[function(require,module,exports){
var isSymbol = require('../internals/is-symbol');

module.exports = function (argument) {
  if (isSymbol(argument)) throw TypeError('Cannot convert a Symbol value to a string');
  return String(argument);
};

},{"../internals/is-symbol":70}],131:[function(require,module,exports){
var id = 0;
var postfix = Math.random();

module.exports = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

},{}],132:[function(require,module,exports){
/* eslint-disable es/no-symbol -- required for testing */
var NATIVE_SYMBOL = require('../internals/native-symbol');

module.exports = NATIVE_SYMBOL
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

},{"../internals/native-symbol":77}],133:[function(require,module,exports){
var wellKnownSymbol = require('../internals/well-known-symbol');

exports.f = wellKnownSymbol;

},{"../internals/well-known-symbol":134}],134:[function(require,module,exports){
var global = require('../internals/global');
var shared = require('../internals/shared');
var has = require('../internals/has');
var uid = require('../internals/uid');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var USE_SYMBOL_AS_UID = require('../internals/use-symbol-as-uid');

var WellKnownSymbolsStore = shared('wks');
var Symbol = global.Symbol;
var createWellKnownSymbol = USE_SYMBOL_AS_UID ? Symbol : Symbol && Symbol.withoutSetter || uid;

module.exports = function (name) {
  if (!has(WellKnownSymbolsStore, name) || !(NATIVE_SYMBOL || typeof WellKnownSymbolsStore[name] == 'string')) {
    if (NATIVE_SYMBOL && has(Symbol, name)) {
      WellKnownSymbolsStore[name] = Symbol[name];
    } else {
      WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
    }
  } return WellKnownSymbolsStore[name];
};

},{"../internals/global":53,"../internals/has":54,"../internals/native-symbol":77,"../internals/shared":116,"../internals/uid":131,"../internals/use-symbol-as-uid":132}],135:[function(require,module,exports){
// a string of all valid unicode whitespaces
module.exports = '\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u2000\u2001\u2002' +
  '\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';

},{}],136:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $every = require('../internals/array-iteration').every;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var STRICT_METHOD = arrayMethodIsStrict('every');

// `Array.prototype.every` method
// https://tc39.es/ecma262/#sec-array.prototype.every
$({ target: 'Array', proto: true, forced: !STRICT_METHOD }, {
  every: function every(callbackfn /* , thisArg */) {
    return $every(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":11,"../internals/array-method-is-strict":13,"../internals/export":44}],137:[function(require,module,exports){
var $ = require('../internals/export');
var fill = require('../internals/array-fill');
var addToUnscopables = require('../internals/add-to-unscopables');

// `Array.prototype.fill` method
// https://tc39.es/ecma262/#sec-array.prototype.fill
$({ target: 'Array', proto: true }, {
  fill: fill
});

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('fill');

},{"../internals/add-to-unscopables":3,"../internals/array-fill":7,"../internals/export":44}],138:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $filter = require('../internals/array-iteration').filter;
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('filter');

// `Array.prototype.filter` method
// https://tc39.es/ecma262/#sec-array.prototype.filter
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":11,"../internals/array-method-has-species-support":12,"../internals/export":44}],139:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var forEach = require('../internals/array-for-each');

// `Array.prototype.forEach` method
// https://tc39.es/ecma262/#sec-array.prototype.foreach
// eslint-disable-next-line es/no-array-prototype-foreach -- safe
$({ target: 'Array', proto: true, forced: [].forEach != forEach }, {
  forEach: forEach
});

},{"../internals/array-for-each":8,"../internals/export":44}],140:[function(require,module,exports){
var $ = require('../internals/export');
var from = require('../internals/array-from');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');

var INCORRECT_ITERATION = !checkCorrectnessOfIteration(function (iterable) {
  // eslint-disable-next-line es/no-array-from -- required for testing
  Array.from(iterable);
});

// `Array.from` method
// https://tc39.es/ecma262/#sec-array.from
$({ target: 'Array', stat: true, forced: INCORRECT_ITERATION }, {
  from: from
});

},{"../internals/array-from":9,"../internals/check-correctness-of-iteration":18,"../internals/export":44}],141:[function(require,module,exports){
'use strict';
/* eslint-disable es/no-array-prototype-indexof -- required for testing */
var $ = require('../internals/export');
var $indexOf = require('../internals/array-includes').indexOf;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var nativeIndexOf = [].indexOf;

var NEGATIVE_ZERO = !!nativeIndexOf && 1 / [1].indexOf(1, -0) < 0;
var STRICT_METHOD = arrayMethodIsStrict('indexOf');

// `Array.prototype.indexOf` method
// https://tc39.es/ecma262/#sec-array.prototype.indexof
$({ target: 'Array', proto: true, forced: NEGATIVE_ZERO || !STRICT_METHOD }, {
  indexOf: function indexOf(searchElement /* , fromIndex = 0 */) {
    return NEGATIVE_ZERO
      // convert -0 to +0
      ? nativeIndexOf.apply(this, arguments) || 0
      : $indexOf(this, searchElement, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-includes":10,"../internals/array-method-is-strict":13,"../internals/export":44}],142:[function(require,module,exports){
var $ = require('../internals/export');
var isArray = require('../internals/is-array');

// `Array.isArray` method
// https://tc39.es/ecma262/#sec-array.isarray
$({ target: 'Array', stat: true }, {
  isArray: isArray
});

},{"../internals/export":44,"../internals/is-array":65}],143:[function(require,module,exports){
'use strict';
var toIndexedObject = require('../internals/to-indexed-object');
var addToUnscopables = require('../internals/add-to-unscopables');
var Iterators = require('../internals/iterators');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(ARRAY_ITERATOR);

// `Array.prototype.entries` method
// https://tc39.es/ecma262/#sec-array.prototype.entries
// `Array.prototype.keys` method
// https://tc39.es/ecma262/#sec-array.prototype.keys
// `Array.prototype.values` method
// https://tc39.es/ecma262/#sec-array.prototype.values
// `Array.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-array.prototype-@@iterator
// `CreateArrayIterator` internal method
// https://tc39.es/ecma262/#sec-createarrayiterator
module.exports = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated), // target
    index: 0,                          // next index
    kind: kind                         // kind
  });
// `%ArrayIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%arrayiteratorprototype%.next
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values%
// https://tc39.es/ecma262/#sec-createunmappedargumentsobject
// https://tc39.es/ecma262/#sec-createmappedargumentsobject
Iterators.Arguments = Iterators.Array;

// https://tc39.es/ecma262/#sec-array.prototype-@@unscopables
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"../internals/add-to-unscopables":3,"../internals/define-iterator":31,"../internals/internal-state":63,"../internals/iterators":74,"../internals/to-indexed-object":123}],144:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var IndexedObject = require('../internals/indexed-object');
var toIndexedObject = require('../internals/to-indexed-object');
var arrayMethodIsStrict = require('../internals/array-method-is-strict');

var nativeJoin = [].join;

var ES3_STRINGS = IndexedObject != Object;
var STRICT_METHOD = arrayMethodIsStrict('join', ',');

// `Array.prototype.join` method
// https://tc39.es/ecma262/#sec-array.prototype.join
$({ target: 'Array', proto: true, forced: ES3_STRINGS || !STRICT_METHOD }, {
  join: function join(separator) {
    return nativeJoin.call(toIndexedObject(this), separator === undefined ? ',' : separator);
  }
});

},{"../internals/array-method-is-strict":13,"../internals/export":44,"../internals/indexed-object":59,"../internals/to-indexed-object":123}],145:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $map = require('../internals/array-iteration').map;
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('map');

// `Array.prototype.map` method
// https://tc39.es/ecma262/#sec-array.prototype.map
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-iteration":11,"../internals/array-method-has-species-support":12,"../internals/export":44}],146:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var $reduce = require('../internals/array-reduce').left;
var arrayMethodIsStrict = require('../internals/array-method-is-strict');
var CHROME_VERSION = require('../internals/engine-v8-version');
var IS_NODE = require('../internals/engine-is-node');

var STRICT_METHOD = arrayMethodIsStrict('reduce');
// Chrome 80-82 has a critical bug
// https://bugs.chromium.org/p/chromium/issues/detail?id=1049982
var CHROME_BUG = !IS_NODE && CHROME_VERSION > 79 && CHROME_VERSION < 83;

// `Array.prototype.reduce` method
// https://tc39.es/ecma262/#sec-array.prototype.reduce
$({ target: 'Array', proto: true, forced: !STRICT_METHOD || CHROME_BUG }, {
  reduce: function reduce(callbackfn /* , initialValue */) {
    return $reduce(this, callbackfn, arguments.length, arguments.length > 1 ? arguments[1] : undefined);
  }
});

},{"../internals/array-method-is-strict":13,"../internals/array-reduce":14,"../internals/engine-is-node":39,"../internals/engine-v8-version":42,"../internals/export":44}],147:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var isObject = require('../internals/is-object');
var isArray = require('../internals/is-array');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toLength = require('../internals/to-length');
var toIndexedObject = require('../internals/to-indexed-object');
var createProperty = require('../internals/create-property');
var wellKnownSymbol = require('../internals/well-known-symbol');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('slice');

var SPECIES = wellKnownSymbol('species');
var nativeSlice = [].slice;
var max = Math.max;

// `Array.prototype.slice` method
// https://tc39.es/ecma262/#sec-array.prototype.slice
// fallback for not array-like ES3 strings and DOM objects
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  slice: function slice(start, end) {
    var O = toIndexedObject(this);
    var length = toLength(O.length);
    var k = toAbsoluteIndex(start, length);
    var fin = toAbsoluteIndex(end === undefined ? length : end, length);
    // inline `ArraySpeciesCreate` for usage native `Array#slice` where it's possible
    var Constructor, result, n;
    if (isArray(O)) {
      Constructor = O.constructor;
      // cross-realm fallback
      if (typeof Constructor == 'function' && (Constructor === Array || isArray(Constructor.prototype))) {
        Constructor = undefined;
      } else if (isObject(Constructor)) {
        Constructor = Constructor[SPECIES];
        if (Constructor === null) Constructor = undefined;
      }
      if (Constructor === Array || Constructor === undefined) {
        return nativeSlice.call(O, k, fin);
      }
    }
    result = new (Constructor === undefined ? Array : Constructor)(max(fin - k, 0));
    for (n = 0; k < fin; k++, n++) if (k in O) createProperty(result, n, O[k]);
    result.length = n;
    return result;
  }
});

},{"../internals/array-method-has-species-support":12,"../internals/create-property":30,"../internals/export":44,"../internals/is-array":65,"../internals/is-object":67,"../internals/to-absolute-index":122,"../internals/to-indexed-object":123,"../internals/to-length":125,"../internals/well-known-symbol":134}],148:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var toAbsoluteIndex = require('../internals/to-absolute-index');
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');
var toObject = require('../internals/to-object');
var arraySpeciesCreate = require('../internals/array-species-create');
var createProperty = require('../internals/create-property');
var arrayMethodHasSpeciesSupport = require('../internals/array-method-has-species-support');

var HAS_SPECIES_SUPPORT = arrayMethodHasSpeciesSupport('splice');

var max = Math.max;
var min = Math.min;
var MAX_SAFE_INTEGER = 0x1FFFFFFFFFFFFF;
var MAXIMUM_ALLOWED_LENGTH_EXCEEDED = 'Maximum allowed length exceeded';

// `Array.prototype.splice` method
// https://tc39.es/ecma262/#sec-array.prototype.splice
// with adding support of @@species
$({ target: 'Array', proto: true, forced: !HAS_SPECIES_SUPPORT }, {
  splice: function splice(start, deleteCount /* , ...items */) {
    var O = toObject(this);
    var len = toLength(O.length);
    var actualStart = toAbsoluteIndex(start, len);
    var argumentsLength = arguments.length;
    var insertCount, actualDeleteCount, A, k, from, to;
    if (argumentsLength === 0) {
      insertCount = actualDeleteCount = 0;
    } else if (argumentsLength === 1) {
      insertCount = 0;
      actualDeleteCount = len - actualStart;
    } else {
      insertCount = argumentsLength - 2;
      actualDeleteCount = min(max(toInteger(deleteCount), 0), len - actualStart);
    }
    if (len + insertCount - actualDeleteCount > MAX_SAFE_INTEGER) {
      throw TypeError(MAXIMUM_ALLOWED_LENGTH_EXCEEDED);
    }
    A = arraySpeciesCreate(O, actualDeleteCount);
    for (k = 0; k < actualDeleteCount; k++) {
      from = actualStart + k;
      if (from in O) createProperty(A, k, O[from]);
    }
    A.length = actualDeleteCount;
    if (insertCount < actualDeleteCount) {
      for (k = actualStart; k < len - actualDeleteCount; k++) {
        from = k + actualDeleteCount;
        to = k + insertCount;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
      for (k = len; k > len - actualDeleteCount + insertCount; k--) delete O[k - 1];
    } else if (insertCount > actualDeleteCount) {
      for (k = len - actualDeleteCount; k > actualStart; k--) {
        from = k + actualDeleteCount - 1;
        to = k + insertCount - 1;
        if (from in O) O[to] = O[from];
        else delete O[to];
      }
    }
    for (k = 0; k < insertCount; k++) {
      O[k + actualStart] = arguments[k + 2];
    }
    O.length = len - actualDeleteCount + insertCount;
    return A;
  }
});

},{"../internals/array-method-has-species-support":12,"../internals/array-species-create":16,"../internals/create-property":30,"../internals/export":44,"../internals/to-absolute-index":122,"../internals/to-integer":124,"../internals/to-length":125,"../internals/to-object":126}],149:[function(require,module,exports){
var redefine = require('../internals/redefine');

var DatePrototype = Date.prototype;
var INVALID_DATE = 'Invalid Date';
var TO_STRING = 'toString';
var nativeDateToString = DatePrototype[TO_STRING];
var getTime = DatePrototype.getTime;

// `Date.prototype.toString` method
// https://tc39.es/ecma262/#sec-date.prototype.tostring
if (String(new Date(NaN)) != INVALID_DATE) {
  redefine(DatePrototype, TO_STRING, function toString() {
    var value = getTime.call(this);
    // eslint-disable-next-line no-self-compare -- NaN check
    return value === value ? nativeDateToString.call(this) : INVALID_DATE;
  });
}

},{"../internals/redefine":103}],150:[function(require,module,exports){
var $ = require('../internals/export');
var bind = require('../internals/function-bind');

// `Function.prototype.bind` method
// https://tc39.es/ecma262/#sec-function.prototype.bind
$({ target: 'Function', proto: true }, {
  bind: bind
});

},{"../internals/export":44,"../internals/function-bind":49}],151:[function(require,module,exports){
var DESCRIPTORS = require('../internals/descriptors');
var defineProperty = require('../internals/object-define-property').f;

var FunctionPrototype = Function.prototype;
var FunctionPrototypeToString = FunctionPrototype.toString;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// Function instances `.name` property
// https://tc39.es/ecma262/#sec-function-instances-name
if (DESCRIPTORS && !(NAME in FunctionPrototype)) {
  defineProperty(FunctionPrototype, NAME, {
    configurable: true,
    get: function () {
      try {
        return FunctionPrototypeToString.call(this).match(nameRE)[1];
      } catch (error) {
        return '';
      }
    }
  });
}

},{"../internals/descriptors":33,"../internals/object-define-property":85}],152:[function(require,module,exports){
'use strict';
var collection = require('../internals/collection');
var collectionStrong = require('../internals/collection-strong');

// `Map` constructor
// https://tc39.es/ecma262/#sec-map-objects
module.exports = collection('Map', function (init) {
  return function Map() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

},{"../internals/collection":22,"../internals/collection-strong":21}],153:[function(require,module,exports){
'use strict';
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var isForced = require('../internals/is-forced');
var redefine = require('../internals/redefine');
var has = require('../internals/has');
var classof = require('../internals/classof-raw');
var inheritIfRequired = require('../internals/inherit-if-required');
var isSymbol = require('../internals/is-symbol');
var toPrimitive = require('../internals/to-primitive');
var fails = require('../internals/fails');
var create = require('../internals/object-create');
var getOwnPropertyNames = require('../internals/object-get-own-property-names').f;
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var defineProperty = require('../internals/object-define-property').f;
var trim = require('../internals/string-trim').trim;

var NUMBER = 'Number';
var NativeNumber = global[NUMBER];
var NumberPrototype = NativeNumber.prototype;

// Opera ~12 has broken Object#toString
var BROKEN_CLASSOF = classof(create(NumberPrototype)) == NUMBER;

// `ToNumber` abstract operation
// https://tc39.es/ecma262/#sec-tonumber
var toNumber = function (argument) {
  if (isSymbol(argument)) throw TypeError('Cannot convert a Symbol value to a number');
  var it = toPrimitive(argument, 'number');
  var first, third, radix, maxCode, digits, length, index, code;
  if (typeof it == 'string' && it.length > 2) {
    it = trim(it);
    first = it.charCodeAt(0);
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal of /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal of /^0o[0-7]+$/i
        default: return +it;
      }
      digits = it.slice(2);
      length = digits.length;
      for (index = 0; index < length; index++) {
        code = digits.charCodeAt(index);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

// `Number` constructor
// https://tc39.es/ecma262/#sec-number-constructor
if (isForced(NUMBER, !NativeNumber(' 0o1') || !NativeNumber('0b1') || NativeNumber('+0x1'))) {
  var NumberWrapper = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var dummy = this;
    return dummy instanceof NumberWrapper
      // check on 1..constructor(foo) case
      && (BROKEN_CLASSOF ? fails(function () { NumberPrototype.valueOf.call(dummy); }) : classof(dummy) != NUMBER)
        ? inheritIfRequired(new NativeNumber(toNumber(it)), dummy, NumberWrapper) : toNumber(it);
  };
  for (var keys = DESCRIPTORS ? getOwnPropertyNames(NativeNumber) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES2015 (in case, if modules with ES2015 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger,' +
    // ESNext
    'fromString,range'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(NativeNumber, key = keys[j]) && !has(NumberWrapper, key)) {
      defineProperty(NumberWrapper, key, getOwnPropertyDescriptor(NativeNumber, key));
    }
  }
  NumberWrapper.prototype = NumberPrototype;
  NumberPrototype.constructor = NumberWrapper;
  redefine(global, NUMBER, NumberWrapper);
}

},{"../internals/classof-raw":19,"../internals/descriptors":33,"../internals/fails":45,"../internals/global":53,"../internals/has":54,"../internals/inherit-if-required":60,"../internals/is-forced":66,"../internals/is-symbol":70,"../internals/object-create":83,"../internals/object-define-property":85,"../internals/object-get-own-property-descriptor":86,"../internals/object-get-own-property-names":88,"../internals/redefine":103,"../internals/string-trim":120,"../internals/to-primitive":127}],154:[function(require,module,exports){
var $ = require('../internals/export');
var assign = require('../internals/object-assign');

// `Object.assign` method
// https://tc39.es/ecma262/#sec-object.assign
// eslint-disable-next-line es/no-object-assign -- required for testing
$({ target: 'Object', stat: true, forced: Object.assign !== assign }, {
  assign: assign
});

},{"../internals/export":44,"../internals/object-assign":82}],155:[function(require,module,exports){
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var create = require('../internals/object-create');

// `Object.create` method
// https://tc39.es/ecma262/#sec-object.create
$({ target: 'Object', stat: true, sham: !DESCRIPTORS }, {
  create: create
});

},{"../internals/descriptors":33,"../internals/export":44,"../internals/object-create":83}],156:[function(require,module,exports){
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var objectDefinePropertyModile = require('../internals/object-define-property');

// `Object.defineProperty` method
// https://tc39.es/ecma262/#sec-object.defineproperty
$({ target: 'Object', stat: true, forced: !DESCRIPTORS, sham: !DESCRIPTORS }, {
  defineProperty: objectDefinePropertyModile.f
});

},{"../internals/descriptors":33,"../internals/export":44,"../internals/object-define-property":85}],157:[function(require,module,exports){
var $ = require('../internals/export');
var $entries = require('../internals/object-to-array').entries;

// `Object.entries` method
// https://tc39.es/ecma262/#sec-object.entries
$({ target: 'Object', stat: true }, {
  entries: function entries(O) {
    return $entries(O);
  }
});

},{"../internals/export":44,"../internals/object-to-array":95}],158:[function(require,module,exports){
var $ = require('../internals/export');
var toObject = require('../internals/to-object');
var nativeKeys = require('../internals/object-keys');
var fails = require('../internals/fails');

var FAILS_ON_PRIMITIVES = fails(function () { nativeKeys(1); });

// `Object.keys` method
// https://tc39.es/ecma262/#sec-object.keys
$({ target: 'Object', stat: true, forced: FAILS_ON_PRIMITIVES }, {
  keys: function keys(it) {
    return nativeKeys(toObject(it));
  }
});

},{"../internals/export":44,"../internals/fails":45,"../internals/object-keys":92,"../internals/to-object":126}],159:[function(require,module,exports){
var $ = require('../internals/export');
var setPrototypeOf = require('../internals/object-set-prototype-of');

// `Object.setPrototypeOf` method
// https://tc39.es/ecma262/#sec-object.setprototypeof
$({ target: 'Object', stat: true }, {
  setPrototypeOf: setPrototypeOf
});

},{"../internals/export":44,"../internals/object-set-prototype-of":94}],160:[function(require,module,exports){
var TO_STRING_TAG_SUPPORT = require('../internals/to-string-tag-support');
var redefine = require('../internals/redefine');
var toString = require('../internals/object-to-string');

// `Object.prototype.toString` method
// https://tc39.es/ecma262/#sec-object.prototype.tostring
if (!TO_STRING_TAG_SUPPORT) {
  redefine(Object.prototype, 'toString', toString, { unsafe: true });
}

},{"../internals/object-to-string":96,"../internals/redefine":103,"../internals/to-string-tag-support":129}],161:[function(require,module,exports){
var $ = require('../internals/export');
var $values = require('../internals/object-to-array').values;

// `Object.values` method
// https://tc39.es/ecma262/#sec-object.values
$({ target: 'Object', stat: true }, {
  values: function values(O) {
    return $values(O);
  }
});

},{"../internals/export":44,"../internals/object-to-array":95}],162:[function(require,module,exports){
var $ = require('../internals/export');
var parseIntImplementation = require('../internals/number-parse-int');

// `parseInt` method
// https://tc39.es/ecma262/#sec-parseint-string-radix
$({ global: true, forced: parseInt != parseIntImplementation }, {
  parseInt: parseIntImplementation
});

},{"../internals/export":44,"../internals/number-parse-int":81}],163:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var IS_PURE = require('../internals/is-pure');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var NativePromise = require('../internals/native-promise-constructor');
var redefine = require('../internals/redefine');
var redefineAll = require('../internals/redefine-all');
var setPrototypeOf = require('../internals/object-set-prototype-of');
var setToStringTag = require('../internals/set-to-string-tag');
var setSpecies = require('../internals/set-species');
var isObject = require('../internals/is-object');
var aFunction = require('../internals/a-function');
var anInstance = require('../internals/an-instance');
var inspectSource = require('../internals/inspect-source');
var iterate = require('../internals/iterate');
var checkCorrectnessOfIteration = require('../internals/check-correctness-of-iteration');
var speciesConstructor = require('../internals/species-constructor');
var task = require('../internals/task').set;
var microtask = require('../internals/microtask');
var promiseResolve = require('../internals/promise-resolve');
var hostReportErrors = require('../internals/host-report-errors');
var newPromiseCapabilityModule = require('../internals/new-promise-capability');
var perform = require('../internals/perform');
var InternalStateModule = require('../internals/internal-state');
var isForced = require('../internals/is-forced');
var wellKnownSymbol = require('../internals/well-known-symbol');
var IS_BROWSER = require('../internals/engine-is-browser');
var IS_NODE = require('../internals/engine-is-node');
var V8_VERSION = require('../internals/engine-v8-version');

var SPECIES = wellKnownSymbol('species');
var PROMISE = 'Promise';
var getInternalState = InternalStateModule.get;
var setInternalState = InternalStateModule.set;
var getInternalPromiseState = InternalStateModule.getterFor(PROMISE);
var NativePromisePrototype = NativePromise && NativePromise.prototype;
var PromiseConstructor = NativePromise;
var PromiseConstructorPrototype = NativePromisePrototype;
var TypeError = global.TypeError;
var document = global.document;
var process = global.process;
var newPromiseCapability = newPromiseCapabilityModule.f;
var newGenericPromiseCapability = newPromiseCapability;
var DISPATCH_EVENT = !!(document && document.createEvent && global.dispatchEvent);
var NATIVE_REJECTION_EVENT = typeof PromiseRejectionEvent == 'function';
var UNHANDLED_REJECTION = 'unhandledrejection';
var REJECTION_HANDLED = 'rejectionhandled';
var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;
var HANDLED = 1;
var UNHANDLED = 2;
var SUBCLASSING = false;
var Internal, OwnPromiseCapability, PromiseWrapper, nativeThen;

var FORCED = isForced(PROMISE, function () {
  var PROMISE_CONSTRUCTOR_SOURCE = inspectSource(PromiseConstructor);
  var GLOBAL_CORE_JS_PROMISE = PROMISE_CONSTRUCTOR_SOURCE !== String(PromiseConstructor);
  // V8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
  // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
  // We can't detect it synchronously, so just check versions
  if (!GLOBAL_CORE_JS_PROMISE && V8_VERSION === 66) return true;
  // We need Promise#finally in the pure version for preventing prototype pollution
  if (IS_PURE && !PromiseConstructorPrototype['finally']) return true;
  // We can't use @@species feature detection in V8 since it causes
  // deoptimization and performance degradation
  // https://github.com/zloirock/core-js/issues/679
  if (V8_VERSION >= 51 && /native code/.test(PROMISE_CONSTRUCTOR_SOURCE)) return false;
  // Detect correctness of subclassing with @@species support
  var promise = new PromiseConstructor(function (resolve) { resolve(1); });
  var FakePromise = function (exec) {
    exec(function () { /* empty */ }, function () { /* empty */ });
  };
  var constructor = promise.constructor = {};
  constructor[SPECIES] = FakePromise;
  SUBCLASSING = promise.then(function () { /* empty */ }) instanceof FakePromise;
  if (!SUBCLASSING) return true;
  // Unhandled rejections tracking support, NodeJS Promise without it fails @@species test
  return !GLOBAL_CORE_JS_PROMISE && IS_BROWSER && !NATIVE_REJECTION_EVENT;
});

var INCORRECT_ITERATION = FORCED || !checkCorrectnessOfIteration(function (iterable) {
  PromiseConstructor.all(iterable)['catch'](function () { /* empty */ });
});

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};

var notify = function (state, isReject) {
  if (state.notified) return;
  state.notified = true;
  var chain = state.reactions;
  microtask(function () {
    var value = state.value;
    var ok = state.state == FULFILLED;
    var index = 0;
    // variable length - can't use forEach
    while (chain.length > index) {
      var reaction = chain[index++];
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (state.rejection === UNHANDLED) onHandleUnhandled(state);
            state.rejection = HANDLED;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // can throw
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
      } catch (error) {
        if (domain && !exited) domain.exit();
        reject(error);
      }
    }
    state.reactions = [];
    state.notified = false;
    if (isReject && !state.rejection) onUnhandled(state);
  });
};

var dispatchEvent = function (name, promise, reason) {
  var event, handler;
  if (DISPATCH_EVENT) {
    event = document.createEvent('Event');
    event.promise = promise;
    event.reason = reason;
    event.initEvent(name, false, true);
    global.dispatchEvent(event);
  } else event = { promise: promise, reason: reason };
  if (!NATIVE_REJECTION_EVENT && (handler = global['on' + name])) handler(event);
  else if (name === UNHANDLED_REJECTION) hostReportErrors('Unhandled promise rejection', reason);
};

var onUnhandled = function (state) {
  task.call(global, function () {
    var promise = state.facade;
    var value = state.value;
    var IS_UNHANDLED = isUnhandled(state);
    var result;
    if (IS_UNHANDLED) {
      result = perform(function () {
        if (IS_NODE) {
          process.emit('unhandledRejection', value, promise);
        } else dispatchEvent(UNHANDLED_REJECTION, promise, value);
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      state.rejection = IS_NODE || isUnhandled(state) ? UNHANDLED : HANDLED;
      if (result.error) throw result.value;
    }
  });
};

var isUnhandled = function (state) {
  return state.rejection !== HANDLED && !state.parent;
};

var onHandleUnhandled = function (state) {
  task.call(global, function () {
    var promise = state.facade;
    if (IS_NODE) {
      process.emit('rejectionHandled', promise);
    } else dispatchEvent(REJECTION_HANDLED, promise, state.value);
  });
};

var bind = function (fn, state, unwrap) {
  return function (value) {
    fn(state, value, unwrap);
  };
};

var internalReject = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  state.value = value;
  state.state = REJECTED;
  notify(state, true);
};

var internalResolve = function (state, value, unwrap) {
  if (state.done) return;
  state.done = true;
  if (unwrap) state = unwrap;
  try {
    if (state.facade === value) throw TypeError("Promise can't be resolved itself");
    var then = isThenable(value);
    if (then) {
      microtask(function () {
        var wrapper = { done: false };
        try {
          then.call(value,
            bind(internalResolve, wrapper, state),
            bind(internalReject, wrapper, state)
          );
        } catch (error) {
          internalReject(wrapper, error, state);
        }
      });
    } else {
      state.value = value;
      state.state = FULFILLED;
      notify(state, false);
    }
  } catch (error) {
    internalReject({ done: false }, error, state);
  }
};

// constructor polyfill
if (FORCED) {
  // 25.4.3.1 Promise(executor)
  PromiseConstructor = function Promise(executor) {
    anInstance(this, PromiseConstructor, PROMISE);
    aFunction(executor);
    Internal.call(this);
    var state = getInternalState(this);
    try {
      executor(bind(internalResolve, state), bind(internalReject, state));
    } catch (error) {
      internalReject(state, error);
    }
  };
  PromiseConstructorPrototype = PromiseConstructor.prototype;
  // eslint-disable-next-line no-unused-vars -- required for `.length`
  Internal = function Promise(executor) {
    setInternalState(this, {
      type: PROMISE,
      done: false,
      notified: false,
      parent: false,
      reactions: [],
      rejection: false,
      state: PENDING,
      value: undefined
    });
  };
  Internal.prototype = redefineAll(PromiseConstructorPrototype, {
    // `Promise.prototype.then` method
    // https://tc39.es/ecma262/#sec-promise.prototype.then
    then: function then(onFulfilled, onRejected) {
      var state = getInternalPromiseState(this);
      var reaction = newPromiseCapability(speciesConstructor(this, PromiseConstructor));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = IS_NODE ? process.domain : undefined;
      state.parent = true;
      state.reactions.push(reaction);
      if (state.state != PENDING) notify(state, false);
      return reaction.promise;
    },
    // `Promise.prototype.catch` method
    // https://tc39.es/ecma262/#sec-promise.prototype.catch
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    var state = getInternalState(promise);
    this.promise = promise;
    this.resolve = bind(internalResolve, state);
    this.reject = bind(internalReject, state);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === PromiseConstructor || C === PromiseWrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };

  if (!IS_PURE && typeof NativePromise == 'function' && NativePromisePrototype !== Object.prototype) {
    nativeThen = NativePromisePrototype.then;

    if (!SUBCLASSING) {
      // make `Promise#then` return a polyfilled `Promise` for native promise-based APIs
      redefine(NativePromisePrototype, 'then', function then(onFulfilled, onRejected) {
        var that = this;
        return new PromiseConstructor(function (resolve, reject) {
          nativeThen.call(that, resolve, reject);
        }).then(onFulfilled, onRejected);
      // https://github.com/zloirock/core-js/issues/640
      }, { unsafe: true });

      // makes sure that native promise-based APIs `Promise#catch` properly works with patched `Promise#then`
      redefine(NativePromisePrototype, 'catch', PromiseConstructorPrototype['catch'], { unsafe: true });
    }

    // make `.constructor === Promise` work for native promise-based APIs
    try {
      delete NativePromisePrototype.constructor;
    } catch (error) { /* empty */ }

    // make `instanceof Promise` work for native promise-based APIs
    if (setPrototypeOf) {
      setPrototypeOf(NativePromisePrototype, PromiseConstructorPrototype);
    }
  }
}

$({ global: true, wrap: true, forced: FORCED }, {
  Promise: PromiseConstructor
});

setToStringTag(PromiseConstructor, PROMISE, false, true);
setSpecies(PROMISE);

PromiseWrapper = getBuiltIn(PROMISE);

// statics
$({ target: PROMISE, stat: true, forced: FORCED }, {
  // `Promise.reject` method
  // https://tc39.es/ecma262/#sec-promise.reject
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    capability.reject.call(undefined, r);
    return capability.promise;
  }
});

$({ target: PROMISE, stat: true, forced: IS_PURE || FORCED }, {
  // `Promise.resolve` method
  // https://tc39.es/ecma262/#sec-promise.resolve
  resolve: function resolve(x) {
    return promiseResolve(IS_PURE && this === PromiseWrapper ? PromiseConstructor : this, x);
  }
});

$({ target: PROMISE, stat: true, forced: INCORRECT_ITERATION }, {
  // `Promise.all` method
  // https://tc39.es/ecma262/#sec-promise.all
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      var values = [];
      var counter = 0;
      var remaining = 1;
      iterate(iterable, function (promise) {
        var index = counter++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        $promiseResolve.call(C, promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.error) reject(result.value);
    return capability.promise;
  },
  // `Promise.race` method
  // https://tc39.es/ecma262/#sec-promise.race
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      var $promiseResolve = aFunction(C.resolve);
      iterate(iterable, function (promise) {
        $promiseResolve.call(C, promise).then(capability.resolve, reject);
      });
    });
    if (result.error) reject(result.value);
    return capability.promise;
  }
});

},{"../internals/a-function":1,"../internals/an-instance":5,"../internals/check-correctness-of-iteration":18,"../internals/engine-is-browser":36,"../internals/engine-is-node":39,"../internals/engine-v8-version":42,"../internals/export":44,"../internals/get-built-in":50,"../internals/global":53,"../internals/host-report-errors":56,"../internals/inspect-source":61,"../internals/internal-state":63,"../internals/is-forced":66,"../internals/is-object":67,"../internals/is-pure":68,"../internals/iterate":71,"../internals/microtask":75,"../internals/native-promise-constructor":76,"../internals/new-promise-capability":79,"../internals/object-set-prototype-of":94,"../internals/perform":100,"../internals/promise-resolve":101,"../internals/redefine":103,"../internals/redefine-all":102,"../internals/set-species":112,"../internals/set-to-string-tag":113,"../internals/species-constructor":117,"../internals/task":121,"../internals/well-known-symbol":134}],164:[function(require,module,exports){
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var anObject = require('../internals/an-object');
var toPropertyKey = require('../internals/to-property-key');
var definePropertyModule = require('../internals/object-define-property');
var fails = require('../internals/fails');

// MS Edge has broken Reflect.defineProperty - throwing instead of returning false
var ERROR_INSTEAD_OF_FALSE = fails(function () {
  // eslint-disable-next-line es/no-reflect -- required for testing
  Reflect.defineProperty(definePropertyModule.f({}, 1, { value: 1 }), 1, { value: 2 });
});

// `Reflect.defineProperty` method
// https://tc39.es/ecma262/#sec-reflect.defineproperty
$({ target: 'Reflect', stat: true, forced: ERROR_INSTEAD_OF_FALSE, sham: !DESCRIPTORS }, {
  defineProperty: function defineProperty(target, propertyKey, attributes) {
    anObject(target);
    var key = toPropertyKey(propertyKey);
    anObject(attributes);
    try {
      definePropertyModule.f(target, key, attributes);
      return true;
    } catch (error) {
      return false;
    }
  }
});

},{"../internals/an-object":6,"../internals/descriptors":33,"../internals/export":44,"../internals/fails":45,"../internals/object-define-property":85,"../internals/to-property-key":128}],165:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var exec = require('../internals/regexp-exec');

// `RegExp.prototype.exec` method
// https://tc39.es/ecma262/#sec-regexp.prototype.exec
$({ target: 'RegExp', proto: true, forced: /./.exec !== exec }, {
  exec: exec
});

},{"../internals/export":44,"../internals/regexp-exec":105}],166:[function(require,module,exports){
'use strict';
var redefine = require('../internals/redefine');
var anObject = require('../internals/an-object');
var $toString = require('../internals/to-string');
var fails = require('../internals/fails');
var flags = require('../internals/regexp-flags');

var TO_STRING = 'toString';
var RegExpPrototype = RegExp.prototype;
var nativeToString = RegExpPrototype[TO_STRING];

var NOT_GENERIC = fails(function () { return nativeToString.call({ source: 'a', flags: 'b' }) != '/a/b'; });
// FF44- RegExp#toString has a wrong name
var INCORRECT_NAME = nativeToString.name != TO_STRING;

// `RegExp.prototype.toString` method
// https://tc39.es/ecma262/#sec-regexp.prototype.tostring
if (NOT_GENERIC || INCORRECT_NAME) {
  redefine(RegExp.prototype, TO_STRING, function toString() {
    var R = anObject(this);
    var p = $toString(R.source);
    var rf = R.flags;
    var f = $toString(rf === undefined && R instanceof RegExp && !('flags' in RegExpPrototype) ? flags.call(R) : rf);
    return '/' + p + '/' + f;
  }, { unsafe: true });
}

},{"../internals/an-object":6,"../internals/fails":45,"../internals/redefine":103,"../internals/regexp-flags":106,"../internals/to-string":130}],167:[function(require,module,exports){
'use strict';
var collection = require('../internals/collection');
var collectionStrong = require('../internals/collection-strong');

// `Set` constructor
// https://tc39.es/ecma262/#sec-set-objects
module.exports = collection('Set', function (init) {
  return function Set() { return init(this, arguments.length ? arguments[0] : undefined); };
}, collectionStrong);

},{"../internals/collection":22,"../internals/collection-strong":21}],168:[function(require,module,exports){
'use strict';
var charAt = require('../internals/string-multibyte').charAt;
var toString = require('../internals/to-string');
var InternalStateModule = require('../internals/internal-state');
var defineIterator = require('../internals/define-iterator');

var STRING_ITERATOR = 'String Iterator';
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(STRING_ITERATOR);

// `String.prototype[@@iterator]` method
// https://tc39.es/ecma262/#sec-string.prototype-@@iterator
defineIterator(String, 'String', function (iterated) {
  setInternalState(this, {
    type: STRING_ITERATOR,
    string: toString(iterated),
    index: 0
  });
// `%StringIteratorPrototype%.next` method
// https://tc39.es/ecma262/#sec-%stringiteratorprototype%.next
}, function next() {
  var state = getInternalState(this);
  var string = state.string;
  var index = state.index;
  var point;
  if (index >= string.length) return { value: undefined, done: true };
  point = charAt(string, index);
  state.index += point.length;
  return { value: point, done: false };
});

},{"../internals/define-iterator":31,"../internals/internal-state":63,"../internals/string-multibyte":119,"../internals/to-string":130}],169:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var createHTML = require('../internals/create-html');
var forcedStringHTMLMethod = require('../internals/string-html-forced');

// `String.prototype.link` method
// https://tc39.es/ecma262/#sec-string.prototype.link
$({ target: 'String', proto: true, forced: forcedStringHTMLMethod('link') }, {
  link: function link(url) {
    return createHTML(this, 'a', 'href', url);
  }
});

},{"../internals/create-html":26,"../internals/export":44,"../internals/string-html-forced":118}],170:[function(require,module,exports){
'use strict';
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var anObject = require('../internals/an-object');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');
var advanceStringIndex = require('../internals/advance-string-index');
var regExpExec = require('../internals/regexp-exec-abstract');

// @@match logic
fixRegExpWellKnownSymbolLogic('match', function (MATCH, nativeMatch, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.es/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = requireObjectCoercible(this);
      var matcher = regexp == undefined ? undefined : regexp[MATCH];
      return matcher !== undefined ? matcher.call(regexp, O) : new RegExp(regexp)[MATCH](toString(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@match
    function (string) {
      var rx = anObject(this);
      var S = toString(string);
      var res = maybeCallNative(nativeMatch, rx, S);

      if (res.done) return res.value;

      if (!rx.global) return regExpExec(rx, S);

      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = toString(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});

},{"../internals/advance-string-index":4,"../internals/an-object":6,"../internals/fix-regexp-well-known-symbol-logic":46,"../internals/regexp-exec-abstract":104,"../internals/require-object-coercible":110,"../internals/to-length":125,"../internals/to-string":130}],171:[function(require,module,exports){
'use strict';
var fixRegExpWellKnownSymbolLogic = require('../internals/fix-regexp-well-known-symbol-logic');
var fails = require('../internals/fails');
var anObject = require('../internals/an-object');
var toInteger = require('../internals/to-integer');
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var requireObjectCoercible = require('../internals/require-object-coercible');
var advanceStringIndex = require('../internals/advance-string-index');
var getSubstitution = require('../internals/get-substitution');
var regExpExec = require('../internals/regexp-exec-abstract');
var wellKnownSymbol = require('../internals/well-known-symbol');

var REPLACE = wellKnownSymbol('replace');
var max = Math.max;
var min = Math.min;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// IE <= 11 replaces $0 with the whole match, as if it was $&
// https://stackoverflow.com/questions/6024666/getting-ie-to-replace-a-regex-with-the-literal-string-0
var REPLACE_KEEPS_$0 = (function () {
  // eslint-disable-next-line regexp/prefer-escape-replacement-dollar-char -- required for testing
  return 'a'.replace(/./, '$0') === '$0';
})();

// Safari <= 13.0.3(?) substitutes nth capture where n>m with an empty string
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

// @@replace logic
fixRegExpWellKnownSymbolLogic('replace', function (_, nativeReplace, maybeCallNative) {
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';

  return [
    // `String.prototype.replace` method
    // https://tc39.es/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(toString(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.es/ecma262/#sec-regexp.prototype-@@replace
    function (string, replaceValue) {
      var rx = anObject(this);
      var S = toString(string);

      if (
        typeof replaceValue === 'string' &&
        replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1 &&
        replaceValue.indexOf('$<') === -1
      ) {
        var res = maybeCallNative(nativeReplace, rx, S, replaceValue);
        if (res.done) return res.value;
      }

      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = toString(replaceValue);

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

        var matchStr = toString(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }

      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];

        var matched = toString(result[0]);
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
          var replacement = toString(replaceValue.apply(undefined, replacerArgs));
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
}, !REPLACE_SUPPORTS_NAMED_GROUPS || !REPLACE_KEEPS_$0 || REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE);

},{"../internals/advance-string-index":4,"../internals/an-object":6,"../internals/fails":45,"../internals/fix-regexp-well-known-symbol-logic":46,"../internals/get-substitution":52,"../internals/regexp-exec-abstract":104,"../internals/require-object-coercible":110,"../internals/to-integer":124,"../internals/to-length":125,"../internals/to-string":130,"../internals/well-known-symbol":134}],172:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var getOwnPropertyDescriptor = require('../internals/object-get-own-property-descriptor').f;
var toLength = require('../internals/to-length');
var toString = require('../internals/to-string');
var notARegExp = require('../internals/not-a-regexp');
var requireObjectCoercible = require('../internals/require-object-coercible');
var correctIsRegExpLogic = require('../internals/correct-is-regexp-logic');
var IS_PURE = require('../internals/is-pure');

// eslint-disable-next-line es/no-string-prototype-startswith -- safe
var $startsWith = ''.startsWith;
var min = Math.min;

var CORRECT_IS_REGEXP_LOGIC = correctIsRegExpLogic('startsWith');
// https://github.com/zloirock/core-js/pull/702
var MDN_POLYFILL_BUG = !IS_PURE && !CORRECT_IS_REGEXP_LOGIC && !!function () {
  var descriptor = getOwnPropertyDescriptor(String.prototype, 'startsWith');
  return descriptor && !descriptor.writable;
}();

// `String.prototype.startsWith` method
// https://tc39.es/ecma262/#sec-string.prototype.startswith
$({ target: 'String', proto: true, forced: !MDN_POLYFILL_BUG && !CORRECT_IS_REGEXP_LOGIC }, {
  startsWith: function startsWith(searchString /* , position = 0 */) {
    var that = toString(requireObjectCoercible(this));
    notARegExp(searchString);
    var index = toLength(min(arguments.length > 1 ? arguments[1] : undefined, that.length));
    var search = toString(searchString);
    return $startsWith
      ? $startsWith.call(that, search, index)
      : that.slice(index, index + search.length) === search;
  }
});

},{"../internals/correct-is-regexp-logic":24,"../internals/export":44,"../internals/is-pure":68,"../internals/not-a-regexp":80,"../internals/object-get-own-property-descriptor":86,"../internals/require-object-coercible":110,"../internals/to-length":125,"../internals/to-string":130}],173:[function(require,module,exports){
// `Symbol.prototype.description` getter
// https://tc39.es/ecma262/#sec-symbol.prototype.description
'use strict';
var $ = require('../internals/export');
var DESCRIPTORS = require('../internals/descriptors');
var global = require('../internals/global');
var has = require('../internals/has');
var isObject = require('../internals/is-object');
var defineProperty = require('../internals/object-define-property').f;
var copyConstructorProperties = require('../internals/copy-constructor-properties');

var NativeSymbol = global.Symbol;

if (DESCRIPTORS && typeof NativeSymbol == 'function' && (!('description' in NativeSymbol.prototype) ||
  // Safari 12 bug
  NativeSymbol().description !== undefined
)) {
  var EmptyStringDescriptionStore = {};
  // wrap Symbol constructor for correct work with undefined description
  var SymbolWrapper = function Symbol() {
    var description = arguments.length < 1 || arguments[0] === undefined ? undefined : String(arguments[0]);
    var result = this instanceof SymbolWrapper
      ? new NativeSymbol(description)
      // in Edge 13, String(Symbol(undefined)) === 'Symbol(undefined)'
      : description === undefined ? NativeSymbol() : NativeSymbol(description);
    if (description === '') EmptyStringDescriptionStore[result] = true;
    return result;
  };
  copyConstructorProperties(SymbolWrapper, NativeSymbol);
  var symbolPrototype = SymbolWrapper.prototype = NativeSymbol.prototype;
  symbolPrototype.constructor = SymbolWrapper;

  var symbolToString = symbolPrototype.toString;
  var native = String(NativeSymbol('test')) == 'Symbol(test)';
  var regexp = /^Symbol\((.*)\)[^)]+$/;
  defineProperty(symbolPrototype, 'description', {
    configurable: true,
    get: function description() {
      var symbol = isObject(this) ? this.valueOf() : this;
      var string = symbolToString.call(symbol);
      if (has(EmptyStringDescriptionStore, symbol)) return '';
      var desc = native ? string.slice(7, -1) : string.replace(regexp, '$1');
      return desc === '' ? undefined : desc;
    }
  });

  $({ global: true, forced: true }, {
    Symbol: SymbolWrapper
  });
}

},{"../internals/copy-constructor-properties":23,"../internals/descriptors":33,"../internals/export":44,"../internals/global":53,"../internals/has":54,"../internals/is-object":67,"../internals/object-define-property":85}],174:[function(require,module,exports){
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');

// `Symbol.iterator` well-known symbol
// https://tc39.es/ecma262/#sec-symbol.iterator
defineWellKnownSymbol('iterator');

},{"../internals/define-well-known-symbol":32}],175:[function(require,module,exports){
'use strict';
var $ = require('../internals/export');
var global = require('../internals/global');
var getBuiltIn = require('../internals/get-built-in');
var IS_PURE = require('../internals/is-pure');
var DESCRIPTORS = require('../internals/descriptors');
var NATIVE_SYMBOL = require('../internals/native-symbol');
var fails = require('../internals/fails');
var has = require('../internals/has');
var isArray = require('../internals/is-array');
var isObject = require('../internals/is-object');
var isSymbol = require('../internals/is-symbol');
var anObject = require('../internals/an-object');
var toObject = require('../internals/to-object');
var toIndexedObject = require('../internals/to-indexed-object');
var toPropertyKey = require('../internals/to-property-key');
var $toString = require('../internals/to-string');
var createPropertyDescriptor = require('../internals/create-property-descriptor');
var nativeObjectCreate = require('../internals/object-create');
var objectKeys = require('../internals/object-keys');
var getOwnPropertyNamesModule = require('../internals/object-get-own-property-names');
var getOwnPropertyNamesExternal = require('../internals/object-get-own-property-names-external');
var getOwnPropertySymbolsModule = require('../internals/object-get-own-property-symbols');
var getOwnPropertyDescriptorModule = require('../internals/object-get-own-property-descriptor');
var definePropertyModule = require('../internals/object-define-property');
var propertyIsEnumerableModule = require('../internals/object-property-is-enumerable');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var redefine = require('../internals/redefine');
var shared = require('../internals/shared');
var sharedKey = require('../internals/shared-key');
var hiddenKeys = require('../internals/hidden-keys');
var uid = require('../internals/uid');
var wellKnownSymbol = require('../internals/well-known-symbol');
var wrappedWellKnownSymbolModule = require('../internals/well-known-symbol-wrapped');
var defineWellKnownSymbol = require('../internals/define-well-known-symbol');
var setToStringTag = require('../internals/set-to-string-tag');
var InternalStateModule = require('../internals/internal-state');
var $forEach = require('../internals/array-iteration').forEach;

var HIDDEN = sharedKey('hidden');
var SYMBOL = 'Symbol';
var PROTOTYPE = 'prototype';
var TO_PRIMITIVE = wellKnownSymbol('toPrimitive');
var setInternalState = InternalStateModule.set;
var getInternalState = InternalStateModule.getterFor(SYMBOL);
var ObjectPrototype = Object[PROTOTYPE];
var $Symbol = global.Symbol;
var $stringify = getBuiltIn('JSON', 'stringify');
var nativeGetOwnPropertyDescriptor = getOwnPropertyDescriptorModule.f;
var nativeDefineProperty = definePropertyModule.f;
var nativeGetOwnPropertyNames = getOwnPropertyNamesExternal.f;
var nativePropertyIsEnumerable = propertyIsEnumerableModule.f;
var AllSymbols = shared('symbols');
var ObjectPrototypeSymbols = shared('op-symbols');
var StringToSymbolRegistry = shared('string-to-symbol-registry');
var SymbolToStringRegistry = shared('symbol-to-string-registry');
var WellKnownSymbolsStore = shared('wks');
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var USE_SETTER = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDescriptor = DESCRIPTORS && fails(function () {
  return nativeObjectCreate(nativeDefineProperty({}, 'a', {
    get: function () { return nativeDefineProperty(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (O, P, Attributes) {
  var ObjectPrototypeDescriptor = nativeGetOwnPropertyDescriptor(ObjectPrototype, P);
  if (ObjectPrototypeDescriptor) delete ObjectPrototype[P];
  nativeDefineProperty(O, P, Attributes);
  if (ObjectPrototypeDescriptor && O !== ObjectPrototype) {
    nativeDefineProperty(ObjectPrototype, P, ObjectPrototypeDescriptor);
  }
} : nativeDefineProperty;

var wrap = function (tag, description) {
  var symbol = AllSymbols[tag] = nativeObjectCreate($Symbol[PROTOTYPE]);
  setInternalState(symbol, {
    type: SYMBOL,
    tag: tag,
    description: description
  });
  if (!DESCRIPTORS) symbol.description = description;
  return symbol;
};

var $defineProperty = function defineProperty(O, P, Attributes) {
  if (O === ObjectPrototype) $defineProperty(ObjectPrototypeSymbols, P, Attributes);
  anObject(O);
  var key = toPropertyKey(P);
  anObject(Attributes);
  if (has(AllSymbols, key)) {
    if (!Attributes.enumerable) {
      if (!has(O, HIDDEN)) nativeDefineProperty(O, HIDDEN, createPropertyDescriptor(1, {}));
      O[HIDDEN][key] = true;
    } else {
      if (has(O, HIDDEN) && O[HIDDEN][key]) O[HIDDEN][key] = false;
      Attributes = nativeObjectCreate(Attributes, { enumerable: createPropertyDescriptor(0, false) });
    } return setSymbolDescriptor(O, key, Attributes);
  } return nativeDefineProperty(O, key, Attributes);
};

var $defineProperties = function defineProperties(O, Properties) {
  anObject(O);
  var properties = toIndexedObject(Properties);
  var keys = objectKeys(properties).concat($getOwnPropertySymbols(properties));
  $forEach(keys, function (key) {
    if (!DESCRIPTORS || $propertyIsEnumerable.call(properties, key)) $defineProperty(O, key, properties[key]);
  });
  return O;
};

var $create = function create(O, Properties) {
  return Properties === undefined ? nativeObjectCreate(O) : $defineProperties(nativeObjectCreate(O), Properties);
};

var $propertyIsEnumerable = function propertyIsEnumerable(V) {
  var P = toPropertyKey(V);
  var enumerable = nativePropertyIsEnumerable.call(this, P);
  if (this === ObjectPrototype && has(AllSymbols, P) && !has(ObjectPrototypeSymbols, P)) return false;
  return enumerable || !has(this, P) || !has(AllSymbols, P) || has(this, HIDDEN) && this[HIDDEN][P] ? enumerable : true;
};

var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(O, P) {
  var it = toIndexedObject(O);
  var key = toPropertyKey(P);
  if (it === ObjectPrototype && has(AllSymbols, key) && !has(ObjectPrototypeSymbols, key)) return;
  var descriptor = nativeGetOwnPropertyDescriptor(it, key);
  if (descriptor && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) {
    descriptor.enumerable = true;
  }
  return descriptor;
};

var $getOwnPropertyNames = function getOwnPropertyNames(O) {
  var names = nativeGetOwnPropertyNames(toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (!has(AllSymbols, key) && !has(hiddenKeys, key)) result.push(key);
  });
  return result;
};

var $getOwnPropertySymbols = function getOwnPropertySymbols(O) {
  var IS_OBJECT_PROTOTYPE = O === ObjectPrototype;
  var names = nativeGetOwnPropertyNames(IS_OBJECT_PROTOTYPE ? ObjectPrototypeSymbols : toIndexedObject(O));
  var result = [];
  $forEach(names, function (key) {
    if (has(AllSymbols, key) && (!IS_OBJECT_PROTOTYPE || has(ObjectPrototype, key))) {
      result.push(AllSymbols[key]);
    }
  });
  return result;
};

// `Symbol` constructor
// https://tc39.es/ecma262/#sec-symbol-constructor
if (!NATIVE_SYMBOL) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor');
    var description = !arguments.length || arguments[0] === undefined ? undefined : $toString(arguments[0]);
    var tag = uid(description);
    var setter = function (value) {
      if (this === ObjectPrototype) setter.call(ObjectPrototypeSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDescriptor(this, tag, createPropertyDescriptor(1, value));
    };
    if (DESCRIPTORS && USE_SETTER) setSymbolDescriptor(ObjectPrototype, tag, { configurable: true, set: setter });
    return wrap(tag, description);
  };

  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return getInternalState(this).tag;
  });

  redefine($Symbol, 'withoutSetter', function (description) {
    return wrap(uid(description), description);
  });

  propertyIsEnumerableModule.f = $propertyIsEnumerable;
  definePropertyModule.f = $defineProperty;
  getOwnPropertyDescriptorModule.f = $getOwnPropertyDescriptor;
  getOwnPropertyNamesModule.f = getOwnPropertyNamesExternal.f = $getOwnPropertyNames;
  getOwnPropertySymbolsModule.f = $getOwnPropertySymbols;

  wrappedWellKnownSymbolModule.f = function (name) {
    return wrap(wellKnownSymbol(name), name);
  };

  if (DESCRIPTORS) {
    // https://github.com/tc39/proposal-Symbol-description
    nativeDefineProperty($Symbol[PROTOTYPE], 'description', {
      configurable: true,
      get: function description() {
        return getInternalState(this).description;
      }
    });
    if (!IS_PURE) {
      redefine(ObjectPrototype, 'propertyIsEnumerable', $propertyIsEnumerable, { unsafe: true });
    }
  }
}

$({ global: true, wrap: true, forced: !NATIVE_SYMBOL, sham: !NATIVE_SYMBOL }, {
  Symbol: $Symbol
});

$forEach(objectKeys(WellKnownSymbolsStore), function (name) {
  defineWellKnownSymbol(name);
});

$({ target: SYMBOL, stat: true, forced: !NATIVE_SYMBOL }, {
  // `Symbol.for` method
  // https://tc39.es/ecma262/#sec-symbol.for
  'for': function (key) {
    var string = $toString(key);
    if (has(StringToSymbolRegistry, string)) return StringToSymbolRegistry[string];
    var symbol = $Symbol(string);
    StringToSymbolRegistry[string] = symbol;
    SymbolToStringRegistry[symbol] = string;
    return symbol;
  },
  // `Symbol.keyFor` method
  // https://tc39.es/ecma262/#sec-symbol.keyfor
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol');
    if (has(SymbolToStringRegistry, sym)) return SymbolToStringRegistry[sym];
  },
  useSetter: function () { USE_SETTER = true; },
  useSimple: function () { USE_SETTER = false; }
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL, sham: !DESCRIPTORS }, {
  // `Object.create` method
  // https://tc39.es/ecma262/#sec-object.create
  create: $create,
  // `Object.defineProperty` method
  // https://tc39.es/ecma262/#sec-object.defineproperty
  defineProperty: $defineProperty,
  // `Object.defineProperties` method
  // https://tc39.es/ecma262/#sec-object.defineproperties
  defineProperties: $defineProperties,
  // `Object.getOwnPropertyDescriptor` method
  // https://tc39.es/ecma262/#sec-object.getownpropertydescriptors
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor
});

$({ target: 'Object', stat: true, forced: !NATIVE_SYMBOL }, {
  // `Object.getOwnPropertyNames` method
  // https://tc39.es/ecma262/#sec-object.getownpropertynames
  getOwnPropertyNames: $getOwnPropertyNames,
  // `Object.getOwnPropertySymbols` method
  // https://tc39.es/ecma262/#sec-object.getownpropertysymbols
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// Chrome 38 and 39 `Object.getOwnPropertySymbols` fails on primitives
// https://bugs.chromium.org/p/v8/issues/detail?id=3443
$({ target: 'Object', stat: true, forced: fails(function () { getOwnPropertySymbolsModule.f(1); }) }, {
  getOwnPropertySymbols: function getOwnPropertySymbols(it) {
    return getOwnPropertySymbolsModule.f(toObject(it));
  }
});

// `JSON.stringify` method behavior with symbols
// https://tc39.es/ecma262/#sec-json.stringify
if ($stringify) {
  var FORCED_JSON_STRINGIFY = !NATIVE_SYMBOL || fails(function () {
    var symbol = $Symbol();
    // MS Edge converts symbol values to JSON as {}
    return $stringify([symbol]) != '[null]'
      // WebKit converts symbol values to JSON as null
      || $stringify({ a: symbol }) != '{}'
      // V8 throws on boxed symbols
      || $stringify(Object(symbol)) != '{}';
  });

  $({ target: 'JSON', stat: true, forced: FORCED_JSON_STRINGIFY }, {
    // eslint-disable-next-line no-unused-vars -- required for `.length`
    stringify: function stringify(it, replacer, space) {
      var args = [it];
      var index = 1;
      var $replacer;
      while (arguments.length > index) args.push(arguments[index++]);
      $replacer = replacer;
      if (!isObject(replacer) && it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
      if (!isArray(replacer)) replacer = function (key, value) {
        if (typeof $replacer == 'function') value = $replacer.call(this, key, value);
        if (!isSymbol(value)) return value;
      };
      args[1] = replacer;
      return $stringify.apply(null, args);
    }
  });
}

// `Symbol.prototype[@@toPrimitive]` method
// https://tc39.es/ecma262/#sec-symbol.prototype-@@toprimitive
if (!$Symbol[PROTOTYPE][TO_PRIMITIVE]) {
  createNonEnumerableProperty($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
}
// `Symbol.prototype[@@toStringTag]` property
// https://tc39.es/ecma262/#sec-symbol.prototype-@@tostringtag
setToStringTag($Symbol, SYMBOL);

hiddenKeys[HIDDEN] = true;

},{"../internals/an-object":6,"../internals/array-iteration":11,"../internals/create-non-enumerable-property":28,"../internals/create-property-descriptor":29,"../internals/define-well-known-symbol":32,"../internals/descriptors":33,"../internals/export":44,"../internals/fails":45,"../internals/get-built-in":50,"../internals/global":53,"../internals/has":54,"../internals/hidden-keys":55,"../internals/internal-state":63,"../internals/is-array":65,"../internals/is-object":67,"../internals/is-pure":68,"../internals/is-symbol":70,"../internals/native-symbol":77,"../internals/object-create":83,"../internals/object-define-property":85,"../internals/object-get-own-property-descriptor":86,"../internals/object-get-own-property-names":88,"../internals/object-get-own-property-names-external":87,"../internals/object-get-own-property-symbols":89,"../internals/object-keys":92,"../internals/object-property-is-enumerable":93,"../internals/redefine":103,"../internals/set-to-string-tag":113,"../internals/shared":116,"../internals/shared-key":114,"../internals/to-indexed-object":123,"../internals/to-object":126,"../internals/to-property-key":128,"../internals/to-string":130,"../internals/uid":131,"../internals/well-known-symbol":134,"../internals/well-known-symbol-wrapped":133}],176:[function(require,module,exports){
var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var forEach = require('../internals/array-for-each');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  // some Chrome versions have non-configurable methods on DOMTokenList
  if (CollectionPrototype && CollectionPrototype.forEach !== forEach) try {
    createNonEnumerableProperty(CollectionPrototype, 'forEach', forEach);
  } catch (error) {
    CollectionPrototype.forEach = forEach;
  }
}

},{"../internals/array-for-each":8,"../internals/create-non-enumerable-property":28,"../internals/dom-iterables":35,"../internals/global":53}],177:[function(require,module,exports){
var global = require('../internals/global');
var DOMIterables = require('../internals/dom-iterables');
var ArrayIteratorMethods = require('../modules/es.array.iterator');
var createNonEnumerableProperty = require('../internals/create-non-enumerable-property');
var wellKnownSymbol = require('../internals/well-known-symbol');

var ITERATOR = wellKnownSymbol('iterator');
var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var ArrayValues = ArrayIteratorMethods.values;

for (var COLLECTION_NAME in DOMIterables) {
  var Collection = global[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    // some Chrome versions have non-configurable methods on DOMTokenList
    if (CollectionPrototype[ITERATOR] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG, COLLECTION_NAME);
    }
    if (DOMIterables[COLLECTION_NAME]) for (var METHOD_NAME in ArrayIteratorMethods) {
      // some Chrome versions have non-configurable methods on DOMTokenList
      if (CollectionPrototype[METHOD_NAME] !== ArrayIteratorMethods[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, ArrayIteratorMethods[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = ArrayIteratorMethods[METHOD_NAME];
      }
    }
  }
}

},{"../internals/create-non-enumerable-property":28,"../internals/dom-iterables":35,"../internals/global":53,"../internals/well-known-symbol":134,"../modules/es.array.iterator":143}],178:[function(require,module,exports){
var $ = require('../internals/export');
var global = require('../internals/global');
var userAgent = require('../internals/engine-user-agent');

var slice = [].slice;
var MSIE = /MSIE .\./.test(userAgent); // <- dirty ie9- check

var wrap = function (scheduler) {
  return function (handler, timeout /* , ...arguments */) {
    var boundArgs = arguments.length > 2;
    var args = boundArgs ? slice.call(arguments, 2) : undefined;
    return scheduler(boundArgs ? function () {
      // eslint-disable-next-line no-new-func -- spec requirement
      (typeof handler == 'function' ? handler : Function(handler)).apply(this, args);
    } : handler, timeout);
  };
};

// ie9- setTimeout & setInterval additional parameters fix
// https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers
$({ global: true, bind: true, forced: MSIE }, {
  // `setTimeout` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-settimeout
  setTimeout: wrap(global.setTimeout),
  // `setInterval` method
  // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#dom-setinterval
  setInterval: wrap(global.setInterval)
});

},{"../internals/engine-user-agent":41,"../internals/export":44,"../internals/global":53}],179:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"../Modules/WebPage":215,"../Particles/Particles":223,"./Stars":180,"core-js/modules/es.object.define-property.js":156}],180:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"core-js/modules/es.object.define-property.js":156}],181:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.create.js");

require("core-js/modules/es.reflect.define-property.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.function.bind.js");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

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

},{"core-js/modules/es.function.bind.js":150,"core-js/modules/es.object.create.js":155,"core-js/modules/es.object.set-prototype-of.js":159,"core-js/modules/es.reflect.define-property.js":164,"core-js/modules/web.timers.js":178}],182:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.create.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.string.link.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.map.js");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

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
    }, this.data.gpa.major ? "GPA / " + this.data.gpa.overall + " (overall) / " + this.data.gpa.major + " (major)" : "GPA / " + this.data.gpa.overall), this.data.notes.map(function (note) {
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

},{"../../Definitions/JSX":199,"../../Modules/DOM":212,"../Component":181,"core-js/modules/es.array.map.js":145,"core-js/modules/es.function.name.js":151,"core-js/modules/es.object.create.js":155,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.set-prototype-of.js":159,"core-js/modules/es.string.link.js":169}],183:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.create.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.string.link.js");

require("core-js/modules/es.array.map.js");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

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

},{"../../Definitions/JSX":199,"../Component":181,"core-js/modules/es.array.map.js":145,"core-js/modules/es.object.create.js":155,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.set-prototype-of.js":159,"core-js/modules/es.string.link.js":169}],184:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

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

},{"../../../Modules/DOM":212,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.promise.js":163}],185:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.create.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.array.every.js");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

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

},{"../../Modules/DOM":212,"../../Modules/EventDispatcher":213,"core-js/modules/es.array.every.js":136,"core-js/modules/es.array.map.js":145,"core-js/modules/es.array.slice.js":147,"core-js/modules/es.object.create.js":155,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.set-prototype-of.js":159,"core-js/modules/es.parse-int.js":162,"core-js/modules/es.regexp.exec.js":165,"core-js/modules/web.timers.js":178}],186:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.create.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.function.bind.js");

require("core-js/modules/es.array.map.js");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

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

},{"../../Definitions/JSX":199,"../../Modules/DOM":212,"../Component":181,"core-js/modules/es.array.map.js":145,"core-js/modules/es.function.bind.js":150,"core-js/modules/es.function.name.js":151,"core-js/modules/es.object.create.js":155,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.set-prototype-of.js":159}],187:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.create.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

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

},{"../../Definitions/JSX":199,"../Component":181,"core-js/modules/es.function.name.js":151,"core-js/modules/es.object.create.js":155,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.set-prototype-of.js":159,"core-js/modules/es.symbol.description.js":173,"core-js/modules/es.symbol.js":175}],188:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"../../Modules/DOM":212,"core-js/modules/es.object.define-property.js":156}],189:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.create.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

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

},{"../../Definitions/JSX":199,"../../Modules/SVG":214,"../Component":181,"core-js/modules/es.function.name.js":151,"core-js/modules/es.object.create.js":155,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.set-prototype-of.js":159,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.promise.js":163}],190:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.assign.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.filter.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.map.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.reduce.js");

require("core-js/modules/es.object.entries.js");

require("core-js/modules/es.number.constructor.js");

require("core-js/modules/es.array.for-each.js");

require("core-js/modules/web.dom-collections.for-each.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.index-of.js");

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

},{"../../Data/Skills":197,"../../Definitions/JSX":199,"../../Modules/DOM":212,"../../Modules/WebPage":215,"./Skill":189,"core-js/modules/es.array.filter.js":138,"core-js/modules/es.array.for-each.js":139,"core-js/modules/es.array.index-of.js":141,"core-js/modules/es.array.iterator.js":143,"core-js/modules/es.array.join.js":144,"core-js/modules/es.array.map.js":145,"core-js/modules/es.array.reduce.js":146,"core-js/modules/es.map.js":152,"core-js/modules/es.number.constructor.js":153,"core-js/modules/es.object.assign.js":154,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.entries.js":157,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.string.iterator.js":168,"core-js/modules/web.dom-collections.for-each.js":176,"core-js/modules/web.dom-collections.iterator.js":177}],191:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.set-prototype-of.js");

require("core-js/modules/es.object.create.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.string.link.js");

var __extends = void 0 && (void 0).__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };

    return _extendStatics(d, b);
  };

  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");

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

},{"../../Definitions/JSX":199,"../Component":181,"core-js/modules/es.object.create.js":155,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.set-prototype-of.js":159,"core-js/modules/es.string.link.js":169}],192:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AboutMe = void 0;
exports.AboutMe = "I am an aspiring web developer and software engineer chasing my passion for working with technology and programming at the University of Texas at Dallas. I crave the opportunity to contribute to meaningful projects that employ my current gifts and interests while also shoving me out of my comfort zone to learn new skills. My goal is to maximize every experience as an opportunity for personal, professional, and technical growth.";

},{"core-js/modules/es.object.define-property.js":156}],193:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Education = void 0;
exports.Education = [{
  name: 'The University of Texas at Dallas',
  color: '#C75B12',
  image: 'utd.svg',
  link: 'https://utdallas.edu',
  location: 'Richardson, TX, USA',
  degree: 'Master of Science in Computer Science',
  start: 'Spring 2021',
  end: 'Fall 2022',
  credits: {
    total: 33,
    completed: 6,
    taking: 9
  },
  gpa: {
    overall: '4.0'
  },
  notes: ['Systems Track', 'Jonsson School Fast-Track Program'],
  courses: ['Computer Architecture', 'Design and Analysis of Computer Algorithms']
}, {
  name: 'The University of Texas at Dallas',
  color: '#C75B12',
  image: 'utd.svg',
  link: 'https://utdallas.edu',
  location: 'Richardson, TX, USA',
  degree: 'Bachelor of Science in Computer Science',
  start: 'Fall 2018',
  end: 'Fall 2021',
  credits: {
    total: 124,
    completed: 114,
    taking: 10
  },
  gpa: {
    overall: '4.0',
    major: '4.0'
  },
  notes: ['Collegium V Honors'],
  courses: ['Data Structures and Algorithm Analysis', 'Operating Systems', 'Software Engineering', 'Programming in UNIX']
}];

},{"core-js/modules/es.object.define-property.js":156}],194:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Experience = void 0;
exports.Experience = [{
  svg: 'google',
  link: 'https://about.google/',
  company: 'Google',
  location: 'Remote',
  position: 'Software Engineering Intern',
  begin: 'May 2021',
  end: 'August 2021',
  flavor: 'Google is a multinational technology company that provides a wide variety of Internet-related products and services. As one of the largest technology companies in the world, Google continues to lead the web in innovation and creativity. I worked remotely in Cloud Technical Infrastructure on the internal cluster management system that empowers all of Google at scale.',
  roles: ['Designed and implemented running OCI containers in Google’s large-scale cluster manager using modern C++, Go, and Protobuf, helping bridge the growing gap between the open source stack and internal stack.', 'Developed internal changes to on-machine package lifecycle, allowing packages to be directly tied to the lifetime of dependent tasks.', 'Wrote extensive unit tests, integration tests, and design documentation.']
}, {
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

},{"core-js/modules/es.object.define-property.js":156}],195:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Projects = void 0;
exports.Projects = [{
  name: 'DataJoint Core',
  color: '#51A8B9',
  image: 'datajoint-core.jpg',
  type: 'Senior Capstone',
  date: 'Fall 2021',
  award: null,
  flavor: 'Rust library for shared code across user-level DataJoint frameworks.',
  repo: 'https://github.com/datajoint/datajoint-core',
  external: null,
  details: ['Implemented with Rust and SQLx.', 'Moves database connection and querying code to a shared library to avoid code duplication.', 'Allows connections to any MySQL, Postgres, MSSQL, or SQLite database.', 'Exposed over a C FFI for user-level frameworks in Python, MATLAB, and more.']
}, {
  name: 'Panda',
  color: '#5865F2',
  image: 'panda-discord.jpg',
  type: 'NPM Package',
  date: 'Summer 2021',
  award: null,
  flavor: 'Command framework for building Discord bots with discord.js.',
  repo: 'https://github.com/jackson-nestelroad/panda-discord',
  external: 'https://www.npmjs.com/package/panda-discord',
  details: ['Implemented with TypeScript and discord.js.', 'Strongly-typed, class-based structure for writing complex commands.', 'Allows message commands and interaction commands to be handled by a single method.', 'Handles argument parsing, categories, permissions, cooldowns, and more.']
}, {
  name: 'Spinda Discord Bot',
  color: '#F75D5D',
  image: 'spinda.jpg',
  type: 'Side Project',
  date: 'Fall 2020',
  award: null,
  flavor: 'Discord bot for generating Spinda patterns, custom commands, and more.',
  repo: 'https://github.com/jackson-nestelroad/spinda-discord-bot',
  external: null,
  details: ['Implemented with TypeScript, discord.js, Sequelize, and Panda.', 'Deployed with a PostgreSQL database to Heroku.', "Generates a random pattern of the Pok\xE9mon Spinda from 4,294,967,295 possibilities, matching the behavior of the mainline Pok\xE9mon games", 'Server-specific, highly-programmable custom commands.']
}, {
  name: 'Aether',
  color: '#1C1C67',
  image: 'aether.jpg',
  type: 'Side Project',
  date: 'Spring-Winter 2020',
  award: null,
  flavor: 'HTTP/HTTPS/WebSocket proxy server for viewing and intercepting web traffic.',
  repo: 'https://github.com/jackson-nestelroad/aether-proxy',
  external: null,
  details: ['Implemented with C++ using the Boost.Asio library.', 'Multithreaded HTTP/HTTPS/WebSocket parsing, forwarding, and interception.', 'Custom certificate authority and certificate generation with OpenSSL.', 'WebSocket compression and decompression with zlib.', 'Dozens of command-line options and event hook interceptors.']
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

},{"core-js/modules/es.object.define-property.js":156}],196:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"core-js/modules/es.object.define-property.js":156}],197:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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
  name: 'Rust',
  svg: 'rust',
  color: '#000000',
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

},{"../Classes/Elements/Skill":189,"core-js/modules/es.object.define-property.js":156}],198:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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
  link: 'https://www.linkedin.com/in/jackson-nestelroad/'
}, {
  name: 'Email',
  faClass: 'fas fa-envelope',
  link: 'mailto:jackson@nestelroad.com'
}];

},{"core-js/modules/es.object.define-property.js":156}],199:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.keys.js");

require("core-js/modules/es.string.starts-with.js");

require("core-js/modules/es.array.is-array.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.replace.js");

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

},{"core-js/modules/es.array.is-array.js":142,"core-js/modules/es.array.iterator.js":143,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.keys.js":158,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.regexp.exec.js":165,"core-js/modules/es.string.iterator.js":168,"core-js/modules/es.string.replace.js":171,"core-js/modules/es.string.starts-with.js":172,"core-js/modules/es.symbol.description.js":173,"core-js/modules/es.symbol.iterator.js":174,"core-js/modules/es.symbol.js":175,"core-js/modules/web.dom-collections.iterator.js":177}],200:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"../Classes/Elements/Quality":187,"../Data/About":192,"../Data/Qualities":196,"../Modules/DOM":212,"../Modules/WebPage":215,"core-js/modules/es.object.define-property.js":156}],201:[function(require,module,exports){
"use strict";

},{}],202:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var WebPage_1 = require("../Modules/WebPage");

WebPage_1.Body.addEventListener('touchstart', function () {}, {
  capture: true,
  passive: true
});

},{"../Modules/WebPage":215,"core-js/modules/es.object.define-property.js":156}],203:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"../Classes/Elements/Social":191,"../Data/Social":198,"../Modules/DOM":212,"../Modules/WebPage":215,"core-js/modules/es.object.define-property.js":156}],204:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

var DOM_1 = require("../Modules/DOM");

DOM_1.DOM.load().then(function (document) {
  DOM_1.DOM.getFirstElement('#connect .footer .copyright .year').innerText = new Date().getFullYear().toString();
});

},{"../Modules/DOM":212,"core-js/modules/es.date.to-string.js":149,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.regexp.to-string.js":166}],205:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"../Classes/Elements/Education":182,"../Data/Education":193,"../Modules/DOM":212,"../Modules/WebPage":215,"core-js/modules/es.object.define-property.js":156}],206:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"../Classes/Elements/Experience":183,"../Data/Experience":194,"../Modules/DOM":212,"../Modules/WebPage":215,"core-js/modules/es.object.define-property.js":156}],207:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/web.timers.js");

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

},{"../Modules/DOM":212,"../Modules/WebPage":215,"core-js/modules/es.object.define-property.js":156,"core-js/modules/web.timers.js":178}],208:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.iterator.js");

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

},{"../Modules/WebPage":215,"core-js/modules/es.array.iterator.js":143,"core-js/modules/es.function.name.js":151,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/web.dom-collections.iterator.js":177}],209:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/web.dom-collections.iterator.js");

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

},{"../Modules/WebPage":215,"core-js/modules/es.array.iterator.js":143,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/web.dom-collections.iterator.js":177}],210:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"../Classes/Elements/Project":186,"../Data/Projects":195,"../Modules/DOM":212,"../Modules/WebPage":215,"core-js/modules/es.object.define-property.js":156}],211:[function(require,module,exports){
arguments[4][201][0].apply(exports,arguments)
},{"dup":201}],212:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.string.match.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.array.every.js");

require("core-js/modules/es.object.values.js");

require("core-js/modules/es.string.replace.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.array.join.js");

require("core-js/modules/es.array.slice.js");

require("core-js/modules/web.timers.js");

require("core-js/modules/es.array.index-of.js");

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

},{"core-js/modules/es.array.every.js":136,"core-js/modules/es.array.index-of.js":141,"core-js/modules/es.array.join.js":144,"core-js/modules/es.array.map.js":145,"core-js/modules/es.array.slice.js":147,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.object.values.js":161,"core-js/modules/es.promise.js":163,"core-js/modules/es.regexp.exec.js":165,"core-js/modules/es.string.match.js":170,"core-js/modules/es.string.replace.js":171,"core-js/modules/web.timers.js":178}],213:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.function.name.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.set.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.map.js");

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

},{"core-js/modules/es.array.iterator.js":143,"core-js/modules/es.function.name.js":151,"core-js/modules/es.map.js":152,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.set.js":167,"core-js/modules/es.string.iterator.js":168,"core-js/modules/web.dom-collections.iterator.js":177}],214:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

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

},{"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.promise.js":163}],215:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.map.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.array.from.js");

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

},{"../Classes/Elements/Menu":185,"../Classes/Elements/Section":188,"../Classes/Elements/SkillsFilter":190,"./DOM":212,"core-js/modules/es.array.from.js":140,"core-js/modules/es.array.iterator.js":143,"core-js/modules/es.map.js":152,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.string.iterator.js":168,"core-js/modules/web.dom-collections.iterator.js":177}],216:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"core-js/modules/es.object.define-property.js":156}],217:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/web.timers.js");

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

},{"core-js/modules/es.object.define-property.js":156,"core-js/modules/web.timers.js":178}],218:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.regexp.exec.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

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

},{"core-js/modules/es.date.to-string.js":149,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.parse-int.js":162,"core-js/modules/es.regexp.exec.js":165,"core-js/modules/es.regexp.to-string.js":166}],219:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

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

},{"core-js/modules/es.date.to-string.js":149,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.regexp.to-string.js":166}],220:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es.object.define-property.js":156}],221:[function(require,module,exports){
"use strict";

require("core-js/modules/es.symbol.js");

require("core-js/modules/es.symbol.description.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.symbol.iterator.js");

require("core-js/modules/es.array.iterator.js");

require("core-js/modules/es.string.iterator.js");

require("core-js/modules/web.dom-collections.iterator.js");

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.parse-int.js");

require("core-js/modules/es.array.index-of.js");

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

},{"./Animation":216,"./Color":218,"./Coordinate":219,"./Stroke":224,"./Vector":225,"core-js/modules/es.array.index-of.js":141,"core-js/modules/es.array.iterator.js":143,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.parse-int.js":162,"core-js/modules/es.string.iterator.js":168,"core-js/modules/es.symbol.description.js":173,"core-js/modules/es.symbol.iterator.js":174,"core-js/modules/es.symbol.js":175,"core-js/modules/web.dom-collections.iterator.js":177}],222:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

Object.defineProperty(exports, "__esModule", {
  value: true
});

},{"core-js/modules/es.object.define-property.js":156}],223:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

require("core-js/modules/es.array.map.js");

require("core-js/modules/es.date.to-string.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.regexp.to-string.js");

require("core-js/modules/es.function.bind.js");

require("core-js/modules/es.array.fill.js");

require("core-js/modules/es.array.splice.js");

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

},{"../Modules/DOM":212,"./AnimationFrameFunctions":217,"./Coordinate":219,"./Particle":221,"core-js/modules/es.array.fill.js":137,"core-js/modules/es.array.map.js":145,"core-js/modules/es.array.splice.js":148,"core-js/modules/es.date.to-string.js":149,"core-js/modules/es.function.bind.js":150,"core-js/modules/es.object.define-property.js":156,"core-js/modules/es.object.to-string.js":160,"core-js/modules/es.regexp.to-string.js":166}],224:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"core-js/modules/es.object.define-property.js":156}],225:[function(require,module,exports){
"use strict";

require("core-js/modules/es.object.define-property.js");

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

},{"core-js/modules/es.object.define-property.js":156}]},{},[179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200,201,202,203,204,205,206,207,208,209,210,211,212,213,214,215,216,217,218,219,220,221,223,222,224,225])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hLXBvc3NpYmxlLXByb3RvdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hZGQtdG8tdW5zY29wYWJsZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYWR2YW5jZS1zdHJpbmctaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4taW5zdGFuY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2FycmF5LWZpbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktZm9yLWVhY2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1pdGVyYXRpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWhhcy1zcGVjaWVzLXN1cHBvcnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1yZWR1Y2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvYXJyYXktc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9hcnJheS1zcGVjaWVzLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jYWxsLXdpdGgtc2FmZS1pdGVyYXRpb24tY2xvc2luZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jaGVjay1jb3JyZWN0bmVzcy1vZi1pdGVyYXRpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi1yYXcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb2xsZWN0aW9uLXN0cm9uZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb2xsZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NvcHktY29uc3RydWN0b3ItcHJvcGVydGllcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb3JyZWN0LWlzLXJlZ2V4cC1sb2dpYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jb3JyZWN0LXByb3RvdHlwZS1nZXR0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLWh0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvY3JlYXRlLWl0ZXJhdG9yLWNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZGVmaW5lLWl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2RlZmluZS13ZWxsLWtub3duLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kZXNjcmlwdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb2N1bWVudC1jcmVhdGUtZWxlbWVudC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9kb20taXRlcmFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VuZ2luZS1pcy1icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VuZ2luZS1pcy1pb3MtcGViYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2VuZ2luZS1pcy1pb3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW5naW5lLWlzLW5vZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZW5naW5lLWlzLXdlYm9zLXdlYmtpdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9maXgtcmVnZXhwLXdlbGwta25vd24tc3ltYm9sLWxvZ2ljLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ZyZWV6aW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtY29udGV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1idWlsdC1pbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9nZXQtaXRlcmF0b3ItbWV0aG9kLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2dldC1zdWJzdGl0dXRpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2hhcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9oaWRkZW4ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9ob3N0LXJlcG9ydC1lcnJvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaHRtbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbmRleGVkLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pbmhlcml0LWlmLXJlcXVpcmVkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ludGVybmFsLW1ldGFkYXRhLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2ludGVybmFsLXN0YXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLWFycmF5LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pcy1mb3JjZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXB1cmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvaXMtcmVnZXhwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2lzLXN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9pdGVyYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2l0ZXJhdG9yLWNsb3NlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL2l0ZXJhdG9ycy1jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL21pY3JvdGFzay5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9uYXRpdmUtcHJvbWlzZS1jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9uYXRpdmUtc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL25hdGl2ZS13ZWFrLW1hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9uZXctcHJvbWlzZS1jYXBhYmlsaXR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL25vdC1hLXJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9udW1iZXItcGFyc2UtaW50LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnRpZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzLWV4dGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWdldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LXByb3BlcnR5LWlzLWVudW1lcmFibGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LXNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb2JqZWN0LXRvLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL29iamVjdC10by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvb3JkaW5hcnktdG8tcHJpbWl0aXZlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL293bi1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3BhdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcGVyZm9ybS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9wcm9taXNlLXJlc29sdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVkZWZpbmUtYWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZ2V4cC1leGVjLWFic3RyYWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZ2V4cC1leGVjLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3JlZ2V4cC1mbGFncy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZWdleHAtc3RpY2t5LWhlbHBlcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVnZXhwLXVuc3VwcG9ydGVkLWRvdC1hbGwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvcmVnZXhwLXVuc3VwcG9ydGVkLW5jZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc2V0LWdsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zZXQtc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zZXQtdG8tc3RyaW5nLXRhZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3NoYXJlZC1zdG9yZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc3BlY2llcy1jb25zdHJ1Y3Rvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zdHJpbmctaHRtbC1mb3JjZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvc3RyaW5nLW11bHRpYnl0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy9zdHJpbmctdHJpbS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90YXNrLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1wcmltaXRpdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdG8tcHJvcGVydHkta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3RvLXN0cmluZy10YWctc3VwcG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2ludGVybmFscy90by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sLXdyYXBwZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9pbnRlcm5hbHMvd2hpdGVzcGFjZXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LmV2ZXJ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5maWxsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5maWx0ZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LmZvci1lYWNoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5mcm9tLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5pbmRleC1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuaXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5Lml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5qb2luLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5hcnJheS5tYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LnJlZHVjZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuYXJyYXkuc2xpY2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmFycmF5LnNwbGljZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuZGF0ZS50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmZ1bmN0aW9uLmJpbmQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLmZ1bmN0aW9uLm5hbWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLm1hcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMubnVtYmVyLmNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5vYmplY3QuY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5vYmplY3QuZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5vYmplY3QuZW50cmllcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMub2JqZWN0LmtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5vYmplY3QudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5vYmplY3QudmFsdWVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5wYXJzZS1pbnQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnByb21pc2UuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnJlZmxlY3QuZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5yZWdleHAuZXhlYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMucmVnZXhwLnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuc2V0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnN0cmluZy5saW5rLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcubWF0Y2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnN0cmluZy5yZXBsYWNlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zdHJpbmcuc3RhcnRzLXdpdGguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzLnN5bWJvbC5kZXNjcmlwdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXMuc3ltYm9sLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lcy5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20tY29sbGVjdGlvbnMuZm9yLWVhY2guanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20tY29sbGVjdGlvbnMuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi50aW1lcnMuanMiLCJvdXQvdHMvQ2FudmFzL0NhbnZhcy5qcyIsIm91dC90cy9DYW52YXMvU3RhcnMuanMiLCJvdXQvdHMvQ2xhc3Nlcy9Db21wb25lbnQvaW5kZXguanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9FZHVjYXRpb24uanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9FeHBlcmllbmNlLmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvSGVscGVycy9pbmRleC5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL01lbnUuanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9Qcm9qZWN0LmpzIiwib3V0L3RzL0NsYXNzZXMvRWxlbWVudHMvUXVhbGl0eS5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NlY3Rpb24uanMiLCJvdXQvdHMvQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbC5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NraWxsc0ZpbHRlci5qcyIsIm91dC90cy9DbGFzc2VzL0VsZW1lbnRzL1NvY2lhbC5qcyIsIm91dC90cy9EYXRhL0Fib3V0LmpzIiwib3V0L3RzL0RhdGEvRWR1Y2F0aW9uLmpzIiwib3V0L3RzL0RhdGEvRXhwZXJpZW5jZS5qcyIsIm91dC90cy9EYXRhL1Byb2plY3RzLmpzIiwib3V0L3RzL0RhdGEvUXVhbGl0aWVzLmpzIiwib3V0L3RzL0RhdGEvU2tpbGxzLmpzIiwib3V0L3RzL0RhdGEvU29jaWFsLmpzIiwib3V0L3RzL0RlZmluaXRpb25zL0pTWC5qcyIsIm91dC90cy9FdmVudHMvQWJvdXQuanMiLCJvdXQvdHMvRXZlbnRzL0JnLmpzIiwib3V0L3RzL0V2ZW50cy9Cb2R5LmpzIiwib3V0L3RzL0V2ZW50cy9Db25uZWN0LmpzIiwib3V0L3RzL0V2ZW50cy9Db3B5cmlnaHRZZWFyLmpzIiwib3V0L3RzL0V2ZW50cy9FZHVjYXRpb24uanMiLCJvdXQvdHMvRXZlbnRzL0V4cGVyaWVuY2UuanMiLCJvdXQvdHMvRXZlbnRzL0xvZ28uanMiLCJvdXQvdHMvRXZlbnRzL01haW4uanMiLCJvdXQvdHMvRXZlbnRzL01lbnUuanMiLCJvdXQvdHMvRXZlbnRzL1Byb2plY3RzLmpzIiwib3V0L3RzL01vZHVsZXMvRE9NLmpzIiwib3V0L3RzL01vZHVsZXMvRXZlbnREaXNwYXRjaGVyLmpzIiwib3V0L3RzL01vZHVsZXMvU1ZHLmpzIiwib3V0L3RzL01vZHVsZXMvV2ViUGFnZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQW5pbWF0aW9uLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9BbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5qcyIsIm91dC90cy9QYXJ0aWNsZXMvQ29sb3IuanMiLCJvdXQvdHMvUGFydGljbGVzL0Nvb3JkaW5hdGUuanMiLCJvdXQvdHMvUGFydGljbGVzL01vdXNlLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9QYXJ0aWNsZS5qcyIsIm91dC90cy9QYXJ0aWNsZXMvUGFydGljbGVTZXR0aW5ncy5qcyIsIm91dC90cy9QYXJ0aWNsZXMvUGFydGljbGVzLmpzIiwib3V0L3RzL1BhcnRpY2xlcy9TdHJva2UuanMiLCJvdXQvdHMvUGFydGljbGVzL1ZlY3Rvci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3REQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1hBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6WUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsVEE7QUFDQTtB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VCxDQUE3Qzs7QUFDQSxJQUFJLE1BQU0sR0FBSSxZQUFZO0FBQ3RCLFdBQVMsTUFBVCxDQUFnQixDQUFoQixFQUFtQixDQUFuQixFQUFzQjtBQUNsQixTQUFLLENBQUwsR0FBUyxDQUFUO0FBQ0EsU0FBSyxDQUFMLEdBQVMsQ0FBVDtBQUNIOztBQUNELEVBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsSUFBakIsR0FBd0IsVUFBVSxDQUFWLEVBQWEsQ0FBYixFQUFnQjtBQUNwQyxRQUFJLENBQUMsS0FBSyxLQUFLLENBQWYsRUFBa0I7QUFBRSxNQUFBLENBQUMsR0FBRyxJQUFKO0FBQVc7O0FBQy9CLFFBQUksQ0FBQyxLQUFLLEtBQUssQ0FBZixFQUFrQjtBQUFFLE1BQUEsQ0FBQyxHQUFHLElBQUo7QUFBVzs7QUFDL0IsUUFBSSxDQUFKLEVBQU87QUFDSCxXQUFLLENBQUwsSUFBVSxDQUFDLENBQVg7QUFDSDs7QUFDRCxRQUFJLENBQUosRUFBTztBQUNILFdBQUssQ0FBTCxJQUFVLENBQUMsQ0FBWDtBQUNIO0FBQ0osR0FURDs7QUFVQSxFQUFBLE1BQU0sQ0FBQyxTQUFQLENBQWlCLFNBQWpCLEdBQTZCLFlBQVk7QUFDckMsV0FBTyxJQUFJLENBQUMsSUFBTCxDQUFXLEtBQUssQ0FBTCxHQUFTLEtBQUssQ0FBZixHQUFxQixLQUFLLENBQUwsR0FBUyxLQUFLLENBQTdDLENBQVA7QUFDSCxHQUZEOztBQUdBLEVBQUEsTUFBTSxDQUFDLFNBQVAsQ0FBaUIsS0FBakIsR0FBeUIsWUFBWTtBQUNqQyxXQUFPLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBSyxDQUFMLEdBQVMsS0FBSyxDQUF2QixDQUFQO0FBQ0gsR0FGRDs7QUFHQSxTQUFPLE1BQVA7QUFDSCxDQXRCYSxFQUFkOztBQXVCQSxPQUFPLFdBQVAsR0FBa0IsTUFBbEIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAodHlwZW9mIGl0ICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoU3RyaW5nKGl0KSArICcgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdCkge1xuICBpZiAoIWlzT2JqZWN0KGl0KSAmJiBpdCAhPT0gbnVsbCkge1xuICAgIHRocm93IFR5cGVFcnJvcihcIkNhbid0IHNldCBcIiArIFN0cmluZyhpdCkgKyAnIGFzIGEgcHJvdG90eXBlJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcbiIsInZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZScpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcblxudmFyIFVOU0NPUEFCTEVTID0gd2VsbEtub3duU3ltYm9sKCd1bnNjb3BhYmxlcycpO1xudmFyIEFycmF5UHJvdG90eXBlID0gQXJyYXkucHJvdG90eXBlO1xuXG4vLyBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLUBAdW5zY29wYWJsZXNcbmlmIChBcnJheVByb3RvdHlwZVtVTlNDT1BBQkxFU10gPT0gdW5kZWZpbmVkKSB7XG4gIGRlZmluZVByb3BlcnR5TW9kdWxlLmYoQXJyYXlQcm90b3R5cGUsIFVOU0NPUEFCTEVTLCB7XG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgIHZhbHVlOiBjcmVhdGUobnVsbClcbiAgfSk7XG59XG5cbi8vIGFkZCBhIGtleSB0byBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICBBcnJheVByb3RvdHlwZVtVTlNDT1BBQkxFU11ba2V5XSA9IHRydWU7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGNoYXJBdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zdHJpbmctbXVsdGlieXRlJykuY2hhckF0O1xuXG4vLyBgQWR2YW5jZVN0cmluZ0luZGV4YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYWR2YW5jZXN0cmluZ2luZGV4XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChTLCBpbmRleCwgdW5pY29kZSkge1xuICByZXR1cm4gaW5kZXggKyAodW5pY29kZSA/IGNoYXJBdChTLCBpbmRleCkubGVuZ3RoIDogMSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIENvbnN0cnVjdG9yLCBuYW1lKSB7XG4gIGlmICghKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdJbmNvcnJlY3QgJyArIChuYW1lID8gbmFtZSArICcgJyA6ICcnKSArICdpbnZvY2F0aW9uJyk7XG4gIH0gcmV0dXJuIGl0O1xufTtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKCFpc09iamVjdChpdCkpIHtcbiAgICB0aHJvdyBUeXBlRXJyb3IoU3RyaW5nKGl0KSArICcgaXMgbm90IGFuIG9iamVjdCcpO1xuICB9IHJldHVybiBpdDtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuZmlsbGAgbWV0aG9kIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maWxsXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZpbGwodmFsdWUgLyogLCBzdGFydCA9IDAsIGVuZCA9IEBsZW5ndGggKi8pIHtcbiAgdmFyIE8gPSB0b09iamVjdCh0aGlzKTtcbiAgdmFyIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKTtcbiAgdmFyIGFyZ3VtZW50c0xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGg7XG4gIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChhcmd1bWVudHNMZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkLCBsZW5ndGgpO1xuICB2YXIgZW5kID0gYXJndW1lbnRzTGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgdmFyIGVuZFBvcyA9IGVuZCA9PT0gdW5kZWZpbmVkID8gbGVuZ3RoIDogdG9BYnNvbHV0ZUluZGV4KGVuZCwgbGVuZ3RoKTtcbiAgd2hpbGUgKGVuZFBvcyA+IGluZGV4KSBPW2luZGV4KytdID0gdmFsdWU7XG4gIHJldHVybiBPO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkZm9yRWFjaCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pdGVyYXRpb24nKS5mb3JFYWNoO1xudmFyIGFycmF5TWV0aG9kSXNTdHJpY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdCcpO1xuXG52YXIgU1RSSUNUX01FVEhPRCA9IGFycmF5TWV0aG9kSXNTdHJpY3QoJ2ZvckVhY2gnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZvcmVhY2hcbm1vZHVsZS5leHBvcnRzID0gIVNUUklDVF9NRVRIT0QgPyBmdW5jdGlvbiBmb3JFYWNoKGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gIHJldHVybiAkZm9yRWFjaCh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tYXJyYXktcHJvdG90eXBlLWZvcmVhY2ggLS0gc2FmZVxufSA6IFtdLmZvckVhY2g7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLWNvbnRleHQnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBjYWxsV2l0aFNhZmVJdGVyYXRpb25DbG9zaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NhbGwtd2l0aC1zYWZlLWl0ZXJhdGlvbi1jbG9zaW5nJyk7XG52YXIgaXNBcnJheUl0ZXJhdG9yTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5LWl0ZXJhdG9yLW1ldGhvZCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWxlbmd0aCcpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGdldEl0ZXJhdG9yTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1pdGVyYXRvci1tZXRob2QnKTtcblxuLy8gYEFycmF5LmZyb21gIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5mcm9tXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGZyb20oYXJyYXlMaWtlIC8qICwgbWFwZm4gPSB1bmRlZmluZWQsIHRoaXNBcmcgPSB1bmRlZmluZWQgKi8pIHtcbiAgdmFyIE8gPSB0b09iamVjdChhcnJheUxpa2UpO1xuICB2YXIgQyA9IHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXk7XG4gIHZhciBhcmd1bWVudHNMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgbWFwZm4gPSBhcmd1bWVudHNMZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkO1xuICB2YXIgbWFwcGluZyA9IG1hcGZuICE9PSB1bmRlZmluZWQ7XG4gIHZhciBpdGVyYXRvck1ldGhvZCA9IGdldEl0ZXJhdG9yTWV0aG9kKE8pO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIgbGVuZ3RoLCByZXN1bHQsIHN0ZXAsIGl0ZXJhdG9yLCBuZXh0LCB2YWx1ZTtcbiAgaWYgKG1hcHBpbmcpIG1hcGZuID0gYmluZChtYXBmbiwgYXJndW1lbnRzTGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZCwgMik7XG4gIC8vIGlmIHRoZSB0YXJnZXQgaXMgbm90IGl0ZXJhYmxlIG9yIGl0J3MgYW4gYXJyYXkgd2l0aCB0aGUgZGVmYXVsdCBpdGVyYXRvciAtIHVzZSBhIHNpbXBsZSBjYXNlXG4gIGlmIChpdGVyYXRvck1ldGhvZCAhPSB1bmRlZmluZWQgJiYgIShDID09IEFycmF5ICYmIGlzQXJyYXlJdGVyYXRvck1ldGhvZChpdGVyYXRvck1ldGhvZCkpKSB7XG4gICAgaXRlcmF0b3IgPSBpdGVyYXRvck1ldGhvZC5jYWxsKE8pO1xuICAgIG5leHQgPSBpdGVyYXRvci5uZXh0O1xuICAgIHJlc3VsdCA9IG5ldyBDKCk7XG4gICAgZm9yICg7IShzdGVwID0gbmV4dC5jYWxsKGl0ZXJhdG9yKSkuZG9uZTsgaW5kZXgrKykge1xuICAgICAgdmFsdWUgPSBtYXBwaW5nID8gY2FsbFdpdGhTYWZlSXRlcmF0aW9uQ2xvc2luZyhpdGVyYXRvciwgbWFwZm4sIFtzdGVwLnZhbHVlLCBpbmRleF0sIHRydWUpIDogc3RlcC52YWx1ZTtcbiAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIHZhbHVlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHJlc3VsdCA9IG5ldyBDKGxlbmd0aCk7XG4gICAgZm9yICg7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgIHZhbHVlID0gbWFwcGluZyA/IG1hcGZuKE9baW5kZXhdLCBpbmRleCkgOiBPW2luZGV4XTtcbiAgICAgIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgaW5kZXgsIHZhbHVlKTtcbiAgICB9XG4gIH1cbiAgcmVzdWx0Lmxlbmd0aCA9IGluZGV4O1xuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXgnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS57IGluZGV4T2YsIGluY2x1ZGVzIH1gIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbiAoSVNfSU5DTFVERVMpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgZWwsIGZyb21JbmRleCkge1xuICAgIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KCR0aGlzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IHRvQWJzb2x1dGVJbmRleChmcm9tSW5kZXgsIGxlbmd0aCk7XG4gICAgdmFyIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICAgIGlmIChJU19JTkNMVURFUyAmJiBlbCAhPSBlbCkgd2hpbGUgKGxlbmd0aCA+IGluZGV4KSB7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tc2VsZi1jb21wYXJlIC0tIE5hTiBjaGVja1xuICAgICAgaWYgKHZhbHVlICE9IHZhbHVlKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSNpbmRleE9mIGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSB7XG4gICAgICBpZiAoKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pICYmIE9baW5kZXhdID09PSBlbCkgcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGBBcnJheS5wcm90b3R5cGUuaW5jbHVkZXNgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmNsdWRlc1xuICBpbmNsdWRlczogY3JlYXRlTWV0aG9kKHRydWUpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmluZGV4T2ZgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5pbmRleG9mXG4gIGluZGV4T2Y6IGNyZWF0ZU1ldGhvZChmYWxzZSlcbn07XG4iLCJ2YXIgYmluZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLWNvbnRleHQnKTtcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG52YXIgYXJyYXlTcGVjaWVzQ3JlYXRlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY3JlYXRlJyk7XG5cbnZhciBwdXNoID0gW10ucHVzaDtcblxuLy8gYEFycmF5LnByb3RvdHlwZS57IGZvckVhY2gsIG1hcCwgZmlsdGVyLCBzb21lLCBldmVyeSwgZmluZCwgZmluZEluZGV4LCBmaWx0ZXJSZWplY3QgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHZhciBJU19NQVAgPSBUWVBFID09IDE7XG4gIHZhciBJU19GSUxURVIgPSBUWVBFID09IDI7XG4gIHZhciBJU19TT01FID0gVFlQRSA9PSAzO1xuICB2YXIgSVNfRVZFUlkgPSBUWVBFID09IDQ7XG4gIHZhciBJU19GSU5EX0lOREVYID0gVFlQRSA9PSA2O1xuICB2YXIgSVNfRklMVEVSX1JFSkVDVCA9IFRZUEUgPT0gNztcbiAgdmFyIE5PX0hPTEVTID0gVFlQRSA9PSA1IHx8IElTX0ZJTkRfSU5ERVg7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMsIGNhbGxiYWNrZm4sIHRoYXQsIHNwZWNpZmljQ3JlYXRlKSB7XG4gICAgdmFyIE8gPSB0b09iamVjdCgkdGhpcyk7XG4gICAgdmFyIHNlbGYgPSBJbmRleGVkT2JqZWN0KE8pO1xuICAgIHZhciBib3VuZEZ1bmN0aW9uID0gYmluZChjYWxsYmFja2ZuLCB0aGF0LCAzKTtcbiAgICB2YXIgbGVuZ3RoID0gdG9MZW5ndGgoc2VsZi5sZW5ndGgpO1xuICAgIHZhciBpbmRleCA9IDA7XG4gICAgdmFyIGNyZWF0ZSA9IHNwZWNpZmljQ3JlYXRlIHx8IGFycmF5U3BlY2llc0NyZWF0ZTtcbiAgICB2YXIgdGFyZ2V0ID0gSVNfTUFQID8gY3JlYXRlKCR0aGlzLCBsZW5ndGgpIDogSVNfRklMVEVSIHx8IElTX0ZJTFRFUl9SRUpFQ1QgPyBjcmVhdGUoJHRoaXMsIDApIDogdW5kZWZpbmVkO1xuICAgIHZhciB2YWx1ZSwgcmVzdWx0O1xuICAgIGZvciAoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKSBpZiAoTk9fSE9MRVMgfHwgaW5kZXggaW4gc2VsZikge1xuICAgICAgdmFsdWUgPSBzZWxmW2luZGV4XTtcbiAgICAgIHJlc3VsdCA9IGJvdW5kRnVuY3Rpb24odmFsdWUsIGluZGV4LCBPKTtcbiAgICAgIGlmIChUWVBFKSB7XG4gICAgICAgIGlmIChJU19NQVApIHRhcmdldFtpbmRleF0gPSByZXN1bHQ7IC8vIG1hcFxuICAgICAgICBlbHNlIGlmIChyZXN1bHQpIHN3aXRjaCAoVFlQRSkge1xuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAvLyBzb21lXG4gICAgICAgICAgY2FzZSA1OiByZXR1cm4gdmFsdWU7ICAgICAgICAgICAgIC8vIGZpbmRcbiAgICAgICAgICBjYXNlIDY6IHJldHVybiBpbmRleDsgICAgICAgICAgICAgLy8gZmluZEluZGV4XG4gICAgICAgICAgY2FzZSAyOiBwdXNoLmNhbGwodGFyZ2V0LCB2YWx1ZSk7IC8vIGZpbHRlclxuICAgICAgICB9IGVsc2Ugc3dpdGNoIChUWVBFKSB7XG4gICAgICAgICAgY2FzZSA0OiByZXR1cm4gZmFsc2U7ICAgICAgICAgICAgIC8vIGV2ZXJ5XG4gICAgICAgICAgY2FzZSA3OiBwdXNoLmNhbGwodGFyZ2V0LCB2YWx1ZSk7IC8vIGZpbHRlclJlamVjdFxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiB0YXJnZXQ7XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5mb3JFYWNoYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZm9yZWFjaFxuICBmb3JFYWNoOiBjcmVhdGVNZXRob2QoMCksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUubWFwYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUubWFwXG4gIG1hcDogY3JlYXRlTWV0aG9kKDEpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmZpbHRlcmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbHRlclxuICBmaWx0ZXI6IGNyZWF0ZU1ldGhvZCgyKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5zb21lYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuc29tZVxuICBzb21lOiBjcmVhdGVNZXRob2QoMyksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZXZlcnlgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5ldmVyeVxuICBldmVyeTogY3JlYXRlTWV0aG9kKDQpLFxuICAvLyBgQXJyYXkucHJvdG90eXBlLmZpbmRgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maW5kXG4gIGZpbmQ6IGNyZWF0ZU1ldGhvZCg1KSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5maW5kSW5kZXhgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5maW5kSW5kZXhcbiAgZmluZEluZGV4OiBjcmVhdGVNZXRob2QoNiksXG4gIC8vIGBBcnJheS5wcm90b3R5cGUuZmlsdGVyUmVqZWN0YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3RjMzkvcHJvcG9zYWwtYXJyYXktZmlsdGVyaW5nXG4gIGZpbHRlclJlamVjdDogY3JlYXRlTWV0aG9kKDcpXG59O1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgVjhfVkVSU0lPTiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbicpO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChNRVRIT0RfTkFNRSkge1xuICAvLyBXZSBjYW4ndCB1c2UgdGhpcyBmZWF0dXJlIGRldGVjdGlvbiBpbiBWOCBzaW5jZSBpdCBjYXVzZXNcbiAgLy8gZGVvcHRpbWl6YXRpb24gYW5kIHNlcmlvdXMgcGVyZm9ybWFuY2UgZGVncmFkYXRpb25cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzY3N1xuICByZXR1cm4gVjhfVkVSU0lPTiA+PSA1MSB8fCAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAgIHZhciBhcnJheSA9IFtdO1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IGFycmF5LmNvbnN0cnVjdG9yID0ge307XG4gICAgY29uc3RydWN0b3JbU1BFQ0lFU10gPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4geyBmb286IDEgfTtcbiAgICB9O1xuICAgIHJldHVybiBhcnJheVtNRVRIT0RfTkFNRV0oQm9vbGVhbikuZm9vICE9PSAxO1xuICB9KTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUsIGFyZ3VtZW50KSB7XG4gIHZhciBtZXRob2QgPSBbXVtNRVRIT0RfTkFNRV07XG4gIHJldHVybiAhIW1ldGhvZCAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZWxlc3MtY2FsbCxuby10aHJvdy1saXRlcmFsIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gICAgbWV0aG9kLmNhbGwobnVsbCwgYXJndW1lbnQgfHwgZnVuY3Rpb24gKCkgeyB0aHJvdyAxOyB9LCAxKTtcbiAgfSk7XG59O1xuIiwidmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWZ1bmN0aW9uJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWxlbmd0aCcpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLnsgcmVkdWNlLCByZWR1Y2VSaWdodCB9YCBtZXRob2RzIGltcGxlbWVudGF0aW9uXG52YXIgY3JlYXRlTWV0aG9kID0gZnVuY3Rpb24gKElTX1JJR0hUKSB7XG4gIHJldHVybiBmdW5jdGlvbiAodGhhdCwgY2FsbGJhY2tmbiwgYXJndW1lbnRzTGVuZ3RoLCBtZW1vKSB7XG4gICAgYUZ1bmN0aW9uKGNhbGxiYWNrZm4pO1xuICAgIHZhciBPID0gdG9PYmplY3QodGhhdCk7XG4gICAgdmFyIHNlbGYgPSBJbmRleGVkT2JqZWN0KE8pO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGluZGV4ID0gSVNfUklHSFQgPyBsZW5ndGggLSAxIDogMDtcbiAgICB2YXIgaSA9IElTX1JJR0hUID8gLTEgOiAxO1xuICAgIGlmIChhcmd1bWVudHNMZW5ndGggPCAyKSB3aGlsZSAodHJ1ZSkge1xuICAgICAgaWYgKGluZGV4IGluIHNlbGYpIHtcbiAgICAgICAgbWVtbyA9IHNlbGZbaW5kZXhdO1xuICAgICAgICBpbmRleCArPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGluZGV4ICs9IGk7XG4gICAgICBpZiAoSVNfUklHSFQgPyBpbmRleCA8IDAgOiBsZW5ndGggPD0gaW5kZXgpIHtcbiAgICAgICAgdGhyb3cgVHlwZUVycm9yKCdSZWR1Y2Ugb2YgZW1wdHkgYXJyYXkgd2l0aCBubyBpbml0aWFsIHZhbHVlJyk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoO0lTX1JJR0hUID8gaW5kZXggPj0gMCA6IGxlbmd0aCA+IGluZGV4OyBpbmRleCArPSBpKSBpZiAoaW5kZXggaW4gc2VsZikge1xuICAgICAgbWVtbyA9IGNhbGxiYWNrZm4obWVtbywgc2VsZltpbmRleF0sIGluZGV4LCBPKTtcbiAgICB9XG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5yZWR1Y2VcbiAgbGVmdDogY3JlYXRlTWV0aG9kKGZhbHNlKSxcbiAgLy8gYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodGAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnJlZHVjZXJpZ2h0XG4gIHJpZ2h0OiBjcmVhdGVNZXRob2QodHJ1ZSlcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgaXNBcnJheSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1hcnJheScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xuXG4vLyBhIHBhcnQgb2YgYEFycmF5U3BlY2llc0NyZWF0ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5c3BlY2llc2NyZWF0ZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWxBcnJheSkge1xuICB2YXIgQztcbiAgaWYgKGlzQXJyYXkob3JpZ2luYWxBcnJheSkpIHtcbiAgICBDID0gb3JpZ2luYWxBcnJheS5jb25zdHJ1Y3RvcjtcbiAgICAvLyBjcm9zcy1yZWFsbSBmYWxsYmFja1xuICAgIGlmICh0eXBlb2YgQyA9PSAnZnVuY3Rpb24nICYmIChDID09PSBBcnJheSB8fCBpc0FycmF5KEMucHJvdG90eXBlKSkpIEMgPSB1bmRlZmluZWQ7XG4gICAgZWxzZSBpZiAoaXNPYmplY3QoQykpIHtcbiAgICAgIEMgPSBDW1NQRUNJRVNdO1xuICAgICAgaWYgKEMgPT09IG51bGwpIEMgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9IHJldHVybiBDID09PSB1bmRlZmluZWQgPyBBcnJheSA6IEM7XG59O1xuIiwidmFyIGFycmF5U3BlY2llc0NvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LXNwZWNpZXMtY29uc3RydWN0b3InKTtcblxuLy8gYEFycmF5U3BlY2llc0NyZWF0ZWAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5c3BlY2llc2NyZWF0ZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3JpZ2luYWxBcnJheSwgbGVuZ3RoKSB7XG4gIHJldHVybiBuZXcgKGFycmF5U3BlY2llc0NvbnN0cnVjdG9yKG9yaWdpbmFsQXJyYXkpKShsZW5ndGggPT09IDAgPyAwIDogbGVuZ3RoKTtcbn07XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgaXRlcmF0b3JDbG9zZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRvci1jbG9zZScpO1xuXG4vLyBjYWxsIHNvbWV0aGluZyBvbiBpdGVyYXRvciBzdGVwIHdpdGggc2FmZSBjbG9zaW5nIG9uIGVycm9yXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvciwgZm4sIHZhbHVlLCBFTlRSSUVTKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEVOVFJJRVMgPyBmbihhbk9iamVjdCh2YWx1ZSlbMF0sIHZhbHVlWzFdKSA6IGZuKHZhbHVlKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpdGVyYXRvckNsb3NlKGl0ZXJhdG9yKTtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufTtcbiIsInZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIElURVJBVE9SID0gd2VsbEtub3duU3ltYm9sKCdpdGVyYXRvcicpO1xudmFyIFNBRkVfQ0xPU0lORyA9IGZhbHNlO1xuXG50cnkge1xuICB2YXIgY2FsbGVkID0gMDtcbiAgdmFyIGl0ZXJhdG9yV2l0aFJldHVybiA9IHtcbiAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4geyBkb25lOiAhIWNhbGxlZCsrIH07XG4gICAgfSxcbiAgICAncmV0dXJuJzogZnVuY3Rpb24gKCkge1xuICAgICAgU0FGRV9DTE9TSU5HID0gdHJ1ZTtcbiAgICB9XG4gIH07XG4gIGl0ZXJhdG9yV2l0aFJldHVybltJVEVSQVRPUl0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1hcnJheS1mcm9tLCBuby10aHJvdy1saXRlcmFsIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gIEFycmF5LmZyb20oaXRlcmF0b3JXaXRoUmV0dXJuLCBmdW5jdGlvbiAoKSB7IHRocm93IDI7IH0pO1xufSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChleGVjLCBTS0lQX0NMT1NJTkcpIHtcbiAgaWYgKCFTS0lQX0NMT1NJTkcgJiYgIVNBRkVfQ0xPU0lORykgcmV0dXJuIGZhbHNlO1xuICB2YXIgSVRFUkFUSU9OX1NVUFBPUlQgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICB2YXIgb2JqZWN0ID0ge307XG4gICAgb2JqZWN0W0lURVJBVE9SXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIG5leHQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4geyBkb25lOiBJVEVSQVRJT05fU1VQUE9SVCA9IHRydWUgfTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuICAgIGV4ZWMob2JqZWN0KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICByZXR1cm4gSVRFUkFUSU9OX1NVUFBPUlQ7XG59O1xuIiwidmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59O1xuIiwidmFyIFRPX1NUUklOR19UQUdfU1VQUE9SVCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1zdHJpbmctdGFnLXN1cHBvcnQnKTtcbnZhciBjbGFzc29mUmF3ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xuLy8gRVMzIHdyb25nIGhlcmVcbnZhciBDT1JSRUNUX0FSR1VNRU5UUyA9IGNsYXNzb2ZSYXcoZnVuY3Rpb24gKCkgeyByZXR1cm4gYXJndW1lbnRzOyB9KCkpID09ICdBcmd1bWVudHMnO1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBTY3JpcHQgQWNjZXNzIERlbmllZCBlcnJvclxudmFyIHRyeUdldCA9IGZ1bmN0aW9uIChpdCwga2V5KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cbn07XG5cbi8vIGdldHRpbmcgdGFnIGZyb20gRVM2KyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2Bcbm1vZHVsZS5leHBvcnRzID0gVE9fU1RSSU5HX1RBR19TVVBQT1JUID8gY2xhc3NvZlJhdyA6IGZ1bmN0aW9uIChpdCkge1xuICB2YXIgTywgdGFnLCByZXN1bHQ7XG4gIHJldHVybiBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiBpdCA9PT0gbnVsbCA/ICdOdWxsJ1xuICAgIC8vIEBAdG9TdHJpbmdUYWcgY2FzZVxuICAgIDogdHlwZW9mICh0YWcgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRPX1NUUklOR19UQUcpKSA9PSAnc3RyaW5nJyA/IHRhZ1xuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQ09SUkVDVF9BUkdVTUVOVFMgPyBjbGFzc29mUmF3KE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKHJlc3VsdCA9IGNsYXNzb2ZSYXcoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiByZXN1bHQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKS5mO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtY3JlYXRlJyk7XG52YXIgcmVkZWZpbmVBbGwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUtYWxsJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLWNvbnRleHQnKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLWluc3RhbmNlJyk7XG52YXIgaXRlcmF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRlJyk7XG52YXIgZGVmaW5lSXRlcmF0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVmaW5lLWl0ZXJhdG9yJyk7XG52YXIgc2V0U3BlY2llcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtc3BlY2llcycpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFzdEtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1tZXRhZGF0YScpLmZhc3RLZXk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xuXG52YXIgc2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuc2V0O1xudmFyIGludGVybmFsU3RhdGVHZXR0ZXJGb3IgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmdldHRlckZvcjtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbiAod3JhcHBlciwgQ09OU1RSVUNUT1JfTkFNRSwgSVNfTUFQLCBBRERFUikge1xuICAgIHZhciBDID0gd3JhcHBlcihmdW5jdGlvbiAodGhhdCwgaXRlcmFibGUpIHtcbiAgICAgIGFuSW5zdGFuY2UodGhhdCwgQywgQ09OU1RSVUNUT1JfTkFNRSk7XG4gICAgICBzZXRJbnRlcm5hbFN0YXRlKHRoYXQsIHtcbiAgICAgICAgdHlwZTogQ09OU1RSVUNUT1JfTkFNRSxcbiAgICAgICAgaW5kZXg6IGNyZWF0ZShudWxsKSxcbiAgICAgICAgZmlyc3Q6IHVuZGVmaW5lZCxcbiAgICAgICAgbGFzdDogdW5kZWZpbmVkLFxuICAgICAgICBzaXplOiAwXG4gICAgICB9KTtcbiAgICAgIGlmICghREVTQ1JJUFRPUlMpIHRoYXQuc2l6ZSA9IDA7XG4gICAgICBpZiAoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSBpdGVyYXRlKGl0ZXJhYmxlLCB0aGF0W0FEREVSXSwgeyB0aGF0OiB0aGF0LCBBU19FTlRSSUVTOiBJU19NQVAgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IGludGVybmFsU3RhdGVHZXR0ZXJGb3IoQ09OU1RSVUNUT1JfTkFNRSk7XG5cbiAgICB2YXIgZGVmaW5lID0gZnVuY3Rpb24gKHRoYXQsIGtleSwgdmFsdWUpIHtcbiAgICAgIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhhdCk7XG4gICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xuICAgICAgdmFyIHByZXZpb3VzLCBpbmRleDtcbiAgICAgIC8vIGNoYW5nZSBleGlzdGluZyBlbnRyeVxuICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgIGVudHJ5LnZhbHVlID0gdmFsdWU7XG4gICAgICAvLyBjcmVhdGUgbmV3IGVudHJ5XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzdGF0ZS5sYXN0ID0gZW50cnkgPSB7XG4gICAgICAgICAgaW5kZXg6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLFxuICAgICAgICAgIGtleToga2V5LFxuICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICBwcmV2aW91czogcHJldmlvdXMgPSBzdGF0ZS5sYXN0LFxuICAgICAgICAgIG5leHQ6IHVuZGVmaW5lZCxcbiAgICAgICAgICByZW1vdmVkOiBmYWxzZVxuICAgICAgICB9O1xuICAgICAgICBpZiAoIXN0YXRlLmZpcnN0KSBzdGF0ZS5maXJzdCA9IGVudHJ5O1xuICAgICAgICBpZiAocHJldmlvdXMpIHByZXZpb3VzLm5leHQgPSBlbnRyeTtcbiAgICAgICAgaWYgKERFU0NSSVBUT1JTKSBzdGF0ZS5zaXplKys7XG4gICAgICAgIGVsc2UgdGhhdC5zaXplKys7XG4gICAgICAgIC8vIGFkZCB0byBpbmRleFxuICAgICAgICBpZiAoaW5kZXggIT09ICdGJykgc3RhdGUuaW5kZXhbaW5kZXhdID0gZW50cnk7XG4gICAgICB9IHJldHVybiB0aGF0O1xuICAgIH07XG5cbiAgICB2YXIgZ2V0RW50cnkgPSBmdW5jdGlvbiAodGhhdCwga2V5KSB7XG4gICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoYXQpO1xuICAgICAgLy8gZmFzdCBjYXNlXG4gICAgICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSk7XG4gICAgICB2YXIgZW50cnk7XG4gICAgICBpZiAoaW5kZXggIT09ICdGJykgcmV0dXJuIHN0YXRlLmluZGV4W2luZGV4XTtcbiAgICAgIC8vIGZyb3plbiBvYmplY3QgY2FzZVxuICAgICAgZm9yIChlbnRyeSA9IHN0YXRlLmZpcnN0OyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uZXh0KSB7XG4gICAgICAgIGlmIChlbnRyeS5rZXkgPT0ga2V5KSByZXR1cm4gZW50cnk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJlZGVmaW5lQWxsKEMucHJvdG90eXBlLCB7XG4gICAgICAvLyBgeyBNYXAsIFNldCB9LnByb3RvdHlwZS5jbGVhcigpYCBtZXRob2RzXG4gICAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW1hcC5wcm90b3R5cGUuY2xlYXJcbiAgICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc2V0LnByb3RvdHlwZS5jbGVhclxuICAgICAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhhdCk7XG4gICAgICAgIHZhciBkYXRhID0gc3RhdGUuaW5kZXg7XG4gICAgICAgIHZhciBlbnRyeSA9IHN0YXRlLmZpcnN0O1xuICAgICAgICB3aGlsZSAoZW50cnkpIHtcbiAgICAgICAgICBlbnRyeS5yZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoZW50cnkucHJldmlvdXMpIGVudHJ5LnByZXZpb3VzID0gZW50cnkucHJldmlvdXMubmV4dCA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pbmRleF07XG4gICAgICAgICAgZW50cnkgPSBlbnRyeS5uZXh0O1xuICAgICAgICB9XG4gICAgICAgIHN0YXRlLmZpcnN0ID0gc3RhdGUubGFzdCA9IHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKERFU0NSSVBUT1JTKSBzdGF0ZS5zaXplID0gMDtcbiAgICAgICAgZWxzZSB0aGF0LnNpemUgPSAwO1xuICAgICAgfSxcbiAgICAgIC8vIGB7IE1hcCwgU2V0IH0ucHJvdG90eXBlLmRlbGV0ZShrZXkpYCBtZXRob2RzXG4gICAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW1hcC5wcm90b3R5cGUuZGVsZXRlXG4gICAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNldC5wcm90b3R5cGUuZGVsZXRlXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgICAgIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhhdCk7XG4gICAgICAgIHZhciBlbnRyeSA9IGdldEVudHJ5KHRoYXQsIGtleSk7XG4gICAgICAgIGlmIChlbnRyeSkge1xuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkubmV4dDtcbiAgICAgICAgICB2YXIgcHJldiA9IGVudHJ5LnByZXZpb3VzO1xuICAgICAgICAgIGRlbGV0ZSBzdGF0ZS5pbmRleFtlbnRyeS5pbmRleF07XG4gICAgICAgICAgZW50cnkucmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgaWYgKHByZXYpIHByZXYubmV4dCA9IG5leHQ7XG4gICAgICAgICAgaWYgKG5leHQpIG5leHQucHJldmlvdXMgPSBwcmV2O1xuICAgICAgICAgIGlmIChzdGF0ZS5maXJzdCA9PSBlbnRyeSkgc3RhdGUuZmlyc3QgPSBuZXh0O1xuICAgICAgICAgIGlmIChzdGF0ZS5sYXN0ID09IGVudHJ5KSBzdGF0ZS5sYXN0ID0gcHJldjtcbiAgICAgICAgICBpZiAoREVTQ1JJUFRPUlMpIHN0YXRlLnNpemUtLTtcbiAgICAgICAgICBlbHNlIHRoYXQuc2l6ZS0tO1xuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xuICAgICAgfSxcbiAgICAgIC8vIGB7IE1hcCwgU2V0IH0ucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClgIG1ldGhvZHNcbiAgICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbWFwLnByb3RvdHlwZS5mb3JlYWNoXG4gICAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNldC5wcm90b3R5cGUuZm9yZWFjaFxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qICwgdGhhdCA9IHVuZGVmaW5lZCAqLykge1xuICAgICAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpO1xuICAgICAgICB2YXIgYm91bmRGdW5jdGlvbiA9IGJpbmQoY2FsbGJhY2tmbiwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIDMpO1xuICAgICAgICB2YXIgZW50cnk7XG4gICAgICAgIHdoaWxlIChlbnRyeSA9IGVudHJ5ID8gZW50cnkubmV4dCA6IHN0YXRlLmZpcnN0KSB7XG4gICAgICAgICAgYm91bmRGdW5jdGlvbihlbnRyeS52YWx1ZSwgZW50cnkua2V5LCB0aGlzKTtcbiAgICAgICAgICAvLyByZXZlcnQgdG8gdGhlIGxhc3QgZXhpc3RpbmcgZW50cnlcbiAgICAgICAgICB3aGlsZSAoZW50cnkgJiYgZW50cnkucmVtb3ZlZCkgZW50cnkgPSBlbnRyeS5wcmV2aW91cztcbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIC8vIGB7IE1hcCwgU2V0fS5wcm90b3R5cGUuaGFzKGtleSlgIG1ldGhvZHNcbiAgICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbWFwLnByb3RvdHlwZS5oYXNcbiAgICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc2V0LnByb3RvdHlwZS5oYXNcbiAgICAgIGhhczogZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgcmVkZWZpbmVBbGwoQy5wcm90b3R5cGUsIElTX01BUCA/IHtcbiAgICAgIC8vIGBNYXAucHJvdG90eXBlLmdldChrZXkpYCBtZXRob2RcbiAgICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbWFwLnByb3RvdHlwZS5nZXRcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0KGtleSkge1xuICAgICAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGlzLCBrZXkpO1xuICAgICAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudmFsdWU7XG4gICAgICB9LFxuICAgICAgLy8gYE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpYCBtZXRob2RcbiAgICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbWFwLnByb3RvdHlwZS5zZXRcbiAgICAgIHNldDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZmluZSh0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSA6IHtcbiAgICAgIC8vIGBTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlgIG1ldGhvZFxuICAgICAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zZXQucHJvdG90eXBlLmFkZFxuICAgICAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZmluZSh0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKERFU0NSSVBUT1JTKSBkZWZpbmVQcm9wZXJ0eShDLnByb3RvdHlwZSwgJ3NpemUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGdldEludGVybmFsU3RhdGUodGhpcykuc2l6ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gQztcbiAgfSxcbiAgc2V0U3Ryb25nOiBmdW5jdGlvbiAoQywgQ09OU1RSVUNUT1JfTkFNRSwgSVNfTUFQKSB7XG4gICAgdmFyIElURVJBVE9SX05BTUUgPSBDT05TVFJVQ1RPUl9OQU1FICsgJyBJdGVyYXRvcic7XG4gICAgdmFyIGdldEludGVybmFsQ29sbGVjdGlvblN0YXRlID0gaW50ZXJuYWxTdGF0ZUdldHRlckZvcihDT05TVFJVQ1RPUl9OQU1FKTtcbiAgICB2YXIgZ2V0SW50ZXJuYWxJdGVyYXRvclN0YXRlID0gaW50ZXJuYWxTdGF0ZUdldHRlckZvcihJVEVSQVRPUl9OQU1FKTtcbiAgICAvLyBgeyBNYXAsIFNldCB9LnByb3RvdHlwZS57IGtleXMsIHZhbHVlcywgZW50cmllcywgQEBpdGVyYXRvciB9KClgIG1ldGhvZHNcbiAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW1hcC5wcm90b3R5cGUuZW50cmllc1xuICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbWFwLnByb3RvdHlwZS5rZXlzXG4gICAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1tYXAucHJvdG90eXBlLnZhbHVlc1xuICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbWFwLnByb3RvdHlwZS1AQGl0ZXJhdG9yXG4gICAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zZXQucHJvdG90eXBlLmVudHJpZXNcbiAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNldC5wcm90b3R5cGUua2V5c1xuICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc2V0LnByb3RvdHlwZS52YWx1ZXNcbiAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNldC5wcm90b3R5cGUtQEBpdGVyYXRvclxuICAgIGRlZmluZUl0ZXJhdG9yKEMsIENPTlNUUlVDVE9SX05BTUUsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICAgICAgc2V0SW50ZXJuYWxTdGF0ZSh0aGlzLCB7XG4gICAgICAgIHR5cGU6IElURVJBVE9SX05BTUUsXG4gICAgICAgIHRhcmdldDogaXRlcmF0ZWQsXG4gICAgICAgIHN0YXRlOiBnZXRJbnRlcm5hbENvbGxlY3Rpb25TdGF0ZShpdGVyYXRlZCksXG4gICAgICAgIGtpbmQ6IGtpbmQsXG4gICAgICAgIGxhc3Q6IHVuZGVmaW5lZFxuICAgICAgfSk7XG4gICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxJdGVyYXRvclN0YXRlKHRoaXMpO1xuICAgICAgdmFyIGtpbmQgPSBzdGF0ZS5raW5kO1xuICAgICAgdmFyIGVudHJ5ID0gc3RhdGUubGFzdDtcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxuICAgICAgd2hpbGUgKGVudHJ5ICYmIGVudHJ5LnJlbW92ZWQpIGVudHJ5ID0gZW50cnkucHJldmlvdXM7XG4gICAgICAvLyBnZXQgbmV4dCBlbnRyeVxuICAgICAgaWYgKCFzdGF0ZS50YXJnZXQgfHwgIShzdGF0ZS5sYXN0ID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm5leHQgOiBzdGF0ZS5zdGF0ZS5maXJzdCkpIHtcbiAgICAgICAgLy8gb3IgZmluaXNoIHRoZSBpdGVyYXRpb25cbiAgICAgICAgc3RhdGUudGFyZ2V0ID0gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gICAgICB9XG4gICAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXG4gICAgICBpZiAoa2luZCA9PSAna2V5cycpIHJldHVybiB7IHZhbHVlOiBlbnRyeS5rZXksIGRvbmU6IGZhbHNlIH07XG4gICAgICBpZiAoa2luZCA9PSAndmFsdWVzJykgcmV0dXJuIHsgdmFsdWU6IGVudHJ5LnZhbHVlLCBkb25lOiBmYWxzZSB9O1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IFtlbnRyeS5rZXksIGVudHJ5LnZhbHVlXSwgZG9uZTogZmFsc2UgfTtcbiAgICB9LCBJU19NQVAgPyAnZW50cmllcycgOiAndmFsdWVzJywgIUlTX01BUCwgdHJ1ZSk7XG5cbiAgICAvLyBgeyBNYXAsIFNldCB9LnByb3RvdHlwZVtAQHNwZWNpZXNdYCBhY2Nlc3NvcnNcbiAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWdldC1tYXAtQEBzcGVjaWVzXG4gICAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1nZXQtc2V0LUBAc3BlY2llc1xuICAgIHNldFNwZWNpZXMoQ09OU1RSVUNUT1JfTkFNRSk7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNGb3JjZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtZm9yY2VkJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBJbnRlcm5hbE1ldGFkYXRhTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ludGVybmFsLW1ldGFkYXRhJyk7XG52YXIgaXRlcmF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRlJyk7XG52YXIgYW5JbnN0YW5jZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1pbnN0YW5jZScpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgY2hlY2tDb3JyZWN0bmVzc09mSXRlcmF0aW9uID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NoZWNrLWNvcnJlY3RuZXNzLW9mLWl0ZXJhdGlvbicpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgaW5oZXJpdElmUmVxdWlyZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW5oZXJpdC1pZi1yZXF1aXJlZCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChDT05TVFJVQ1RPUl9OQU1FLCB3cmFwcGVyLCBjb21tb24pIHtcbiAgdmFyIElTX01BUCA9IENPTlNUUlVDVE9SX05BTUUuaW5kZXhPZignTWFwJykgIT09IC0xO1xuICB2YXIgSVNfV0VBSyA9IENPTlNUUlVDVE9SX05BTUUuaW5kZXhPZignV2VhaycpICE9PSAtMTtcbiAgdmFyIEFEREVSID0gSVNfTUFQID8gJ3NldCcgOiAnYWRkJztcbiAgdmFyIE5hdGl2ZUNvbnN0cnVjdG9yID0gZ2xvYmFsW0NPTlNUUlVDVE9SX05BTUVdO1xuICB2YXIgTmF0aXZlUHJvdG90eXBlID0gTmF0aXZlQ29uc3RydWN0b3IgJiYgTmF0aXZlQ29uc3RydWN0b3IucHJvdG90eXBlO1xuICB2YXIgQ29uc3RydWN0b3IgPSBOYXRpdmVDb25zdHJ1Y3RvcjtcbiAgdmFyIGV4cG9ydGVkID0ge307XG5cbiAgdmFyIGZpeE1ldGhvZCA9IGZ1bmN0aW9uIChLRVkpIHtcbiAgICB2YXIgbmF0aXZlTWV0aG9kID0gTmF0aXZlUHJvdG90eXBlW0tFWV07XG4gICAgcmVkZWZpbmUoTmF0aXZlUHJvdG90eXBlLCBLRVksXG4gICAgICBLRVkgPT0gJ2FkZCcgPyBmdW5jdGlvbiBhZGQodmFsdWUpIHtcbiAgICAgICAgbmF0aXZlTWV0aG9kLmNhbGwodGhpcywgdmFsdWUgPT09IDAgPyAwIDogdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH0gOiBLRVkgPT0gJ2RlbGV0ZScgPyBmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChrZXkpID8gZmFsc2UgOiBuYXRpdmVNZXRob2QuY2FsbCh0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5KTtcbiAgICAgIH0gOiBLRVkgPT0gJ2dldCcgPyBmdW5jdGlvbiBnZXQoa2V5KSB7XG4gICAgICAgIHJldHVybiBJU19XRUFLICYmICFpc09iamVjdChrZXkpID8gdW5kZWZpbmVkIDogbmF0aXZlTWV0aG9kLmNhbGwodGhpcywga2V5ID09PSAwID8gMCA6IGtleSk7XG4gICAgICB9IDogS0VZID09ICdoYXMnID8gZnVuY3Rpb24gaGFzKGtleSkge1xuICAgICAgICByZXR1cm4gSVNfV0VBSyAmJiAhaXNPYmplY3Qoa2V5KSA/IGZhbHNlIDogbmF0aXZlTWV0aG9kLmNhbGwodGhpcywga2V5ID09PSAwID8gMCA6IGtleSk7XG4gICAgICB9IDogZnVuY3Rpb24gc2V0KGtleSwgdmFsdWUpIHtcbiAgICAgICAgbmF0aXZlTWV0aG9kLmNhbGwodGhpcywga2V5ID09PSAwID8gMCA6IGtleSwgdmFsdWUpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICApO1xuICB9O1xuXG4gIHZhciBSRVBMQUNFID0gaXNGb3JjZWQoXG4gICAgQ09OU1RSVUNUT1JfTkFNRSxcbiAgICB0eXBlb2YgTmF0aXZlQ29uc3RydWN0b3IgIT0gJ2Z1bmN0aW9uJyB8fCAhKElTX1dFQUsgfHwgTmF0aXZlUHJvdG90eXBlLmZvckVhY2ggJiYgIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIG5ldyBOYXRpdmVDb25zdHJ1Y3RvcigpLmVudHJpZXMoKS5uZXh0KCk7XG4gICAgfSkpXG4gICk7XG5cbiAgaWYgKFJFUExBQ0UpIHtcbiAgICAvLyBjcmVhdGUgY29sbGVjdGlvbiBjb25zdHJ1Y3RvclxuICAgIENvbnN0cnVjdG9yID0gY29tbW9uLmdldENvbnN0cnVjdG9yKHdyYXBwZXIsIENPTlNUUlVDVE9SX05BTUUsIElTX01BUCwgQURERVIpO1xuICAgIEludGVybmFsTWV0YWRhdGFNb2R1bGUuZW5hYmxlKCk7XG4gIH0gZWxzZSBpZiAoaXNGb3JjZWQoQ09OU1RSVUNUT1JfTkFNRSwgdHJ1ZSkpIHtcbiAgICB2YXIgaW5zdGFuY2UgPSBuZXcgQ29uc3RydWN0b3IoKTtcbiAgICAvLyBlYXJseSBpbXBsZW1lbnRhdGlvbnMgbm90IHN1cHBvcnRzIGNoYWluaW5nXG4gICAgdmFyIEhBU05UX0NIQUlOSU5HID0gaW5zdGFuY2VbQURERVJdKElTX1dFQUsgPyB7fSA6IC0wLCAxKSAhPSBpbnN0YW5jZTtcbiAgICAvLyBWOCB+IENocm9taXVtIDQwLSB3ZWFrLWNvbGxlY3Rpb25zIHRocm93cyBvbiBwcmltaXRpdmVzLCBidXQgc2hvdWxkIHJldHVybiBmYWxzZVxuICAgIHZhciBUSFJPV1NfT05fUFJJTUlUSVZFUyA9IGZhaWxzKGZ1bmN0aW9uICgpIHsgaW5zdGFuY2UuaGFzKDEpOyB9KTtcbiAgICAvLyBtb3N0IGVhcmx5IGltcGxlbWVudGF0aW9ucyBkb2Vzbid0IHN1cHBvcnRzIGl0ZXJhYmxlcywgbW9zdCBtb2Rlcm4gLSBub3QgY2xvc2UgaXQgY29ycmVjdGx5XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldyAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xuICAgIHZhciBBQ0NFUFRfSVRFUkFCTEVTID0gY2hlY2tDb3JyZWN0bmVzc09mSXRlcmF0aW9uKGZ1bmN0aW9uIChpdGVyYWJsZSkgeyBuZXcgTmF0aXZlQ29uc3RydWN0b3IoaXRlcmFibGUpOyB9KTtcbiAgICAvLyBmb3IgZWFybHkgaW1wbGVtZW50YXRpb25zIC0wIGFuZCArMCBub3QgdGhlIHNhbWVcbiAgICB2YXIgQlVHR1lfWkVSTyA9ICFJU19XRUFLICYmIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFY4IH4gQ2hyb21pdW0gNDItIGZhaWxzIG9ubHkgd2l0aCA1KyBlbGVtZW50c1xuICAgICAgdmFyICRpbnN0YW5jZSA9IG5ldyBOYXRpdmVDb25zdHJ1Y3RvcigpO1xuICAgICAgdmFyIGluZGV4ID0gNTtcbiAgICAgIHdoaWxlIChpbmRleC0tKSAkaW5zdGFuY2VbQURERVJdKGluZGV4LCBpbmRleCk7XG4gICAgICByZXR1cm4gISRpbnN0YW5jZS5oYXMoLTApO1xuICAgIH0pO1xuXG4gICAgaWYgKCFBQ0NFUFRfSVRFUkFCTEVTKSB7XG4gICAgICBDb25zdHJ1Y3RvciA9IHdyYXBwZXIoZnVuY3Rpb24gKGR1bW15LCBpdGVyYWJsZSkge1xuICAgICAgICBhbkluc3RhbmNlKGR1bW15LCBDb25zdHJ1Y3RvciwgQ09OU1RSVUNUT1JfTkFNRSk7XG4gICAgICAgIHZhciB0aGF0ID0gaW5oZXJpdElmUmVxdWlyZWQobmV3IE5hdGl2ZUNvbnN0cnVjdG9yKCksIGR1bW15LCBDb25zdHJ1Y3Rvcik7XG4gICAgICAgIGlmIChpdGVyYWJsZSAhPSB1bmRlZmluZWQpIGl0ZXJhdGUoaXRlcmFibGUsIHRoYXRbQURERVJdLCB7IHRoYXQ6IHRoYXQsIEFTX0VOVFJJRVM6IElTX01BUCB9KTtcbiAgICAgICAgcmV0dXJuIHRoYXQ7XG4gICAgICB9KTtcbiAgICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IE5hdGl2ZVByb3RvdHlwZTtcbiAgICAgIE5hdGl2ZVByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yO1xuICAgIH1cblxuICAgIGlmIChUSFJPV1NfT05fUFJJTUlUSVZFUyB8fCBCVUdHWV9aRVJPKSB7XG4gICAgICBmaXhNZXRob2QoJ2RlbGV0ZScpO1xuICAgICAgZml4TWV0aG9kKCdoYXMnKTtcbiAgICAgIElTX01BUCAmJiBmaXhNZXRob2QoJ2dldCcpO1xuICAgIH1cblxuICAgIGlmIChCVUdHWV9aRVJPIHx8IEhBU05UX0NIQUlOSU5HKSBmaXhNZXRob2QoQURERVIpO1xuXG4gICAgLy8gd2VhayBjb2xsZWN0aW9ucyBzaG91bGQgbm90IGNvbnRhaW5zIC5jbGVhciBtZXRob2RcbiAgICBpZiAoSVNfV0VBSyAmJiBOYXRpdmVQcm90b3R5cGUuY2xlYXIpIGRlbGV0ZSBOYXRpdmVQcm90b3R5cGUuY2xlYXI7XG4gIH1cblxuICBleHBvcnRlZFtDT05TVFJVQ1RPUl9OQU1FXSA9IENvbnN0cnVjdG9yO1xuICAkKHsgZ2xvYmFsOiB0cnVlLCBmb3JjZWQ6IENvbnN0cnVjdG9yICE9IE5hdGl2ZUNvbnN0cnVjdG9yIH0sIGV4cG9ydGVkKTtcblxuICBzZXRUb1N0cmluZ1RhZyhDb25zdHJ1Y3RvciwgQ09OU1RSVUNUT1JfTkFNRSk7XG5cbiAgaWYgKCFJU19XRUFLKSBjb21tb24uc2V0U3Ryb25nKENvbnN0cnVjdG9yLCBDT05TVFJVQ1RPUl9OQU1FLCBJU19NQVApO1xuXG4gIHJldHVybiBDb25zdHJ1Y3Rvcjtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIG93bktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb3duLWtleXMnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UpIHtcbiAgdmFyIGtleXMgPSBvd25LZXlzKHNvdXJjZSk7XG4gIHZhciBkZWZpbmVQcm9wZXJ0eSA9IGRlZmluZVByb3BlcnR5TW9kdWxlLmY7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JNb2R1bGUuZjtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGtleSA9IGtleXNbaV07XG4gICAgaWYgKCFoYXModGFyZ2V0LCBrZXkpKSBkZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7XG4gIH1cbn07XG4iLCJ2YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBNQVRDSCA9IHdlbGxLbm93blN5bWJvbCgnbWF0Y2gnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUpIHtcbiAgdmFyIHJlZ2V4cCA9IC8uLztcbiAgdHJ5IHtcbiAgICAnLy4vJ1tNRVRIT0RfTkFNRV0ocmVnZXhwKTtcbiAgfSBjYXRjaCAoZXJyb3IxKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJlZ2V4cFtNQVRDSF0gPSBmYWxzZTtcbiAgICAgIHJldHVybiAnLy4vJ1tNRVRIT0RfTkFNRV0ocmVnZXhwKTtcbiAgICB9IGNhdGNoIChlcnJvcjIpIHsgLyogZW1wdHkgKi8gfVxuICB9IHJldHVybiBmYWxzZTtcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBGKCkgeyAvKiBlbXB0eSAqLyB9XG4gIEYucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gbnVsbDtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRwcm90b3R5cGVvZiAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xuICByZXR1cm4gT2JqZWN0LmdldFByb3RvdHlwZU9mKG5ldyBGKCkpICE9PSBGLnByb3RvdHlwZTtcbn0pO1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG52YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nJyk7XG5cbnZhciBxdW90ID0gL1wiL2c7XG5cbi8vIGBDcmVhdGVIVE1MYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtY3JlYXRlaHRtbFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoc3RyaW5nLCB0YWcsIGF0dHJpYnV0ZSwgdmFsdWUpIHtcbiAgdmFyIFMgPSB0b1N0cmluZyhyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKHN0cmluZykpO1xuICB2YXIgcDEgPSAnPCcgKyB0YWc7XG4gIGlmIChhdHRyaWJ1dGUgIT09ICcnKSBwMSArPSAnICcgKyBhdHRyaWJ1dGUgKyAnPVwiJyArIHRvU3RyaW5nKHZhbHVlKS5yZXBsYWNlKHF1b3QsICcmcXVvdDsnKSArICdcIic7XG4gIHJldHVybiBwMSArICc+JyArIFMgKyAnPC8nICsgdGFnICsgJz4nO1xufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRvcnMtY29yZScpLkl0ZXJhdG9yUHJvdG90eXBlO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtY3JlYXRlJyk7XG52YXIgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzJyk7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSXRlcmF0b3JDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCkge1xuICB2YXIgVE9fU1RSSU5HX1RBRyA9IE5BTUUgKyAnIEl0ZXJhdG9yJztcbiAgSXRlcmF0b3JDb25zdHJ1Y3Rvci5wcm90b3R5cGUgPSBjcmVhdGUoSXRlcmF0b3JQcm90b3R5cGUsIHsgbmV4dDogY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDEsIG5leHQpIH0pO1xuICBzZXRUb1N0cmluZ1RhZyhJdGVyYXRvckNvbnN0cnVjdG9yLCBUT19TVFJJTkdfVEFHLCBmYWxzZSwgdHJ1ZSk7XG4gIEl0ZXJhdG9yc1tUT19TVFJJTkdfVEFHXSA9IHJldHVyblRoaXM7XG4gIHJldHVybiBJdGVyYXRvckNvbnN0cnVjdG9yO1xufTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcblxubW9kdWxlLmV4cG9ydHMgPSBERVNDUklQVE9SUyA/IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgcmV0dXJuIGRlZmluZVByb3BlcnR5TW9kdWxlLmYob2JqZWN0LCBrZXksIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgcmV0dXJuIG9iamVjdDtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChiaXRtYXAsIHZhbHVlKSB7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZTogIShiaXRtYXAgJiAxKSxcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXG4gICAgd3JpdGFibGU6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWU6IHZhbHVlXG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIHRvUHJvcGVydHlLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJvcGVydHkta2V5Jyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvcicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgdmFyIHByb3BlcnR5S2V5ID0gdG9Qcm9wZXJ0eUtleShrZXkpO1xuICBpZiAocHJvcGVydHlLZXkgaW4gb2JqZWN0KSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKG9iamVjdCwgcHJvcGVydHlLZXksIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigwLCB2YWx1ZSkpO1xuICBlbHNlIG9iamVjdFtwcm9wZXJ0eUtleV0gPSB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBjcmVhdGVJdGVyYXRvckNvbnN0cnVjdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1pdGVyYXRvci1jb25zdHJ1Y3RvcicpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtcHJvdG90eXBlLW9mJyk7XG52YXIgc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXNldC1wcm90b3R5cGUtb2YnKTtcbnZhciBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zZXQtdG8tc3RyaW5nLXRhZycpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWRlZmluZScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIElTX1BVUkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtcHVyZScpO1xudmFyIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pdGVyYXRvcnMnKTtcbnZhciBJdGVyYXRvcnNDb3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9ycy1jb3JlJyk7XG5cbnZhciBJdGVyYXRvclByb3RvdHlwZSA9IEl0ZXJhdG9yc0NvcmUuSXRlcmF0b3JQcm90b3R5cGU7XG52YXIgQlVHR1lfU0FGQVJJX0lURVJBVE9SUyA9IEl0ZXJhdG9yc0NvcmUuQlVHR1lfU0FGQVJJX0lURVJBVE9SUztcbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBLRVlTID0gJ2tleXMnO1xudmFyIFZBTFVFUyA9ICd2YWx1ZXMnO1xudmFyIEVOVFJJRVMgPSAnZW50cmllcyc7XG5cbnZhciByZXR1cm5UaGlzID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoSXRlcmFibGUsIE5BTUUsIEl0ZXJhdG9yQ29uc3RydWN0b3IsIG5leHQsIERFRkFVTFQsIElTX1NFVCwgRk9SQ0VEKSB7XG4gIGNyZWF0ZUl0ZXJhdG9yQ29uc3RydWN0b3IoSXRlcmF0b3JDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCk7XG5cbiAgdmFyIGdldEl0ZXJhdGlvbk1ldGhvZCA9IGZ1bmN0aW9uIChLSU5EKSB7XG4gICAgaWYgKEtJTkQgPT09IERFRkFVTFQgJiYgZGVmYXVsdEl0ZXJhdG9yKSByZXR1cm4gZGVmYXVsdEl0ZXJhdG9yO1xuICAgIGlmICghQlVHR1lfU0FGQVJJX0lURVJBVE9SUyAmJiBLSU5EIGluIEl0ZXJhYmxlUHJvdG90eXBlKSByZXR1cm4gSXRlcmFibGVQcm90b3R5cGVbS0lORF07XG4gICAgc3dpdGNoIChLSU5EKSB7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCkgeyByZXR1cm4gbmV3IEl0ZXJhdG9yQ29uc3RydWN0b3IodGhpcywgS0lORCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5ldyBJdGVyYXRvckNvbnN0cnVjdG9yKHRoaXMsIEtJTkQpOyB9O1xuICAgICAgY2FzZSBFTlRSSUVTOiByZXR1cm4gZnVuY3Rpb24gZW50cmllcygpIHsgcmV0dXJuIG5ldyBJdGVyYXRvckNvbnN0cnVjdG9yKHRoaXMsIEtJTkQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBJdGVyYXRvckNvbnN0cnVjdG9yKHRoaXMpOyB9O1xuICB9O1xuXG4gIHZhciBUT19TVFJJTkdfVEFHID0gTkFNRSArICcgSXRlcmF0b3InO1xuICB2YXIgSU5DT1JSRUNUX1ZBTFVFU19OQU1FID0gZmFsc2U7XG4gIHZhciBJdGVyYWJsZVByb3RvdHlwZSA9IEl0ZXJhYmxlLnByb3RvdHlwZTtcbiAgdmFyIG5hdGl2ZUl0ZXJhdG9yID0gSXRlcmFibGVQcm90b3R5cGVbSVRFUkFUT1JdXG4gICAgfHwgSXRlcmFibGVQcm90b3R5cGVbJ0BAaXRlcmF0b3InXVxuICAgIHx8IERFRkFVTFQgJiYgSXRlcmFibGVQcm90b3R5cGVbREVGQVVMVF07XG4gIHZhciBkZWZhdWx0SXRlcmF0b3IgPSAhQlVHR1lfU0FGQVJJX0lURVJBVE9SUyAmJiBuYXRpdmVJdGVyYXRvciB8fCBnZXRJdGVyYXRpb25NZXRob2QoREVGQVVMVCk7XG4gIHZhciBhbnlOYXRpdmVJdGVyYXRvciA9IE5BTUUgPT0gJ0FycmF5JyA/IEl0ZXJhYmxlUHJvdG90eXBlLmVudHJpZXMgfHwgbmF0aXZlSXRlcmF0b3IgOiBuYXRpdmVJdGVyYXRvcjtcbiAgdmFyIEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSwgbWV0aG9kcywgS0VZO1xuXG4gIC8vIGZpeCBuYXRpdmVcbiAgaWYgKGFueU5hdGl2ZUl0ZXJhdG9yKSB7XG4gICAgQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoYW55TmF0aXZlSXRlcmF0b3IuY2FsbChuZXcgSXRlcmFibGUoKSkpO1xuICAgIGlmIChJdGVyYXRvclByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSAmJiBDdXJyZW50SXRlcmF0b3JQcm90b3R5cGUubmV4dCkge1xuICAgICAgaWYgKCFJU19QVVJFICYmIGdldFByb3RvdHlwZU9mKEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSkgIT09IEl0ZXJhdG9yUHJvdG90eXBlKSB7XG4gICAgICAgIGlmIChzZXRQcm90b3R5cGVPZikge1xuICAgICAgICAgIHNldFByb3RvdHlwZU9mKEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSwgSXRlcmF0b3JQcm90b3R5cGUpO1xuICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBDdXJyZW50SXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoQ3VycmVudEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFNldCBAQHRvU3RyaW5nVGFnIHRvIG5hdGl2ZSBpdGVyYXRvcnNcbiAgICAgIHNldFRvU3RyaW5nVGFnKEN1cnJlbnRJdGVyYXRvclByb3RvdHlwZSwgVE9fU1RSSU5HX1RBRywgdHJ1ZSwgdHJ1ZSk7XG4gICAgICBpZiAoSVNfUFVSRSkgSXRlcmF0b3JzW1RPX1NUUklOR19UQUddID0gcmV0dXJuVGhpcztcbiAgICB9XG4gIH1cblxuICAvLyBmaXggQXJyYXkucHJvdG90eXBlLnsgdmFsdWVzLCBAQGl0ZXJhdG9yIH0ubmFtZSBpbiBWOCAvIEZGXG4gIGlmIChERUZBVUxUID09IFZBTFVFUyAmJiBuYXRpdmVJdGVyYXRvciAmJiBuYXRpdmVJdGVyYXRvci5uYW1lICE9PSBWQUxVRVMpIHtcbiAgICBJTkNPUlJFQ1RfVkFMVUVTX05BTUUgPSB0cnVlO1xuICAgIGRlZmF1bHRJdGVyYXRvciA9IGZ1bmN0aW9uIHZhbHVlcygpIHsgcmV0dXJuIG5hdGl2ZUl0ZXJhdG9yLmNhbGwodGhpcyk7IH07XG4gIH1cblxuICAvLyBkZWZpbmUgaXRlcmF0b3JcbiAgaWYgKCghSVNfUFVSRSB8fCBGT1JDRUQpICYmIEl0ZXJhYmxlUHJvdG90eXBlW0lURVJBVE9SXSAhPT0gZGVmYXVsdEl0ZXJhdG9yKSB7XG4gICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KEl0ZXJhYmxlUHJvdG90eXBlLCBJVEVSQVRPUiwgZGVmYXVsdEl0ZXJhdG9yKTtcbiAgfVxuICBJdGVyYXRvcnNbTkFNRV0gPSBkZWZhdWx0SXRlcmF0b3I7XG5cbiAgLy8gZXhwb3J0IGFkZGl0aW9uYWwgbWV0aG9kc1xuICBpZiAoREVGQVVMVCkge1xuICAgIG1ldGhvZHMgPSB7XG4gICAgICB2YWx1ZXM6IGdldEl0ZXJhdGlvbk1ldGhvZChWQUxVRVMpLFxuICAgICAga2V5czogSVNfU0VUID8gZGVmYXVsdEl0ZXJhdG9yIDogZ2V0SXRlcmF0aW9uTWV0aG9kKEtFWVMpLFxuICAgICAgZW50cmllczogZ2V0SXRlcmF0aW9uTWV0aG9kKEVOVFJJRVMpXG4gICAgfTtcbiAgICBpZiAoRk9SQ0VEKSBmb3IgKEtFWSBpbiBtZXRob2RzKSB7XG4gICAgICBpZiAoQlVHR1lfU0FGQVJJX0lURVJBVE9SUyB8fCBJTkNPUlJFQ1RfVkFMVUVTX05BTUUgfHwgIShLRVkgaW4gSXRlcmFibGVQcm90b3R5cGUpKSB7XG4gICAgICAgIHJlZGVmaW5lKEl0ZXJhYmxlUHJvdG90eXBlLCBLRVksIG1ldGhvZHNbS0VZXSk7XG4gICAgICB9XG4gICAgfSBlbHNlICQoeyB0YXJnZXQ6IE5BTUUsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMgfHwgSU5DT1JSRUNUX1ZBTFVFU19OQU1FIH0sIG1ldGhvZHMpO1xuICB9XG5cbiAgcmV0dXJuIG1ldGhvZHM7XG59O1xuIiwidmFyIHBhdGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcGF0aCcpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcbnZhciB3cmFwcGVkV2VsbEtub3duU3ltYm9sTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sLXdyYXBwZWQnKTtcbnZhciBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5JykuZjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTkFNRSkge1xuICB2YXIgU3ltYm9sID0gcGF0aC5TeW1ib2wgfHwgKHBhdGguU3ltYm9sID0ge30pO1xuICBpZiAoIWhhcyhTeW1ib2wsIE5BTUUpKSBkZWZpbmVQcm9wZXJ0eShTeW1ib2wsIE5BTUUsIHtcbiAgICB2YWx1ZTogd3JhcHBlZFdlbGxLbm93blN5bWJvbE1vZHVsZS5mKE5BTUUpXG4gIH0pO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG4vLyBEZXRlY3QgSUU4J3MgaW5jb21wbGV0ZSBkZWZpbmVQcm9wZXJ0eSBpbXBsZW1lbnRhdGlvblxubW9kdWxlLmV4cG9ydHMgPSAhZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sIDEsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiA3OyB9IH0pWzFdICE9IDc7XG59KTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbnZhciBkb2N1bWVudCA9IGdsb2JhbC5kb2N1bWVudDtcbi8vIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnIGluIG9sZCBJRVxudmFyIEVYSVNUUyA9IGlzT2JqZWN0KGRvY3VtZW50KSAmJiBpc09iamVjdChkb2N1bWVudC5jcmVhdGVFbGVtZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEVYSVNUUyA/IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoaXQpIDoge307XG59O1xuIiwiLy8gaXRlcmFibGUgRE9NIGNvbGxlY3Rpb25zXG4vLyBmbGFnIC0gYGl0ZXJhYmxlYCBpbnRlcmZhY2UgLSAnZW50cmllcycsICdrZXlzJywgJ3ZhbHVlcycsICdmb3JFYWNoJyBtZXRob2RzXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgQ1NTUnVsZUxpc3Q6IDAsXG4gIENTU1N0eWxlRGVjbGFyYXRpb246IDAsXG4gIENTU1ZhbHVlTGlzdDogMCxcbiAgQ2xpZW50UmVjdExpc3Q6IDAsXG4gIERPTVJlY3RMaXN0OiAwLFxuICBET01TdHJpbmdMaXN0OiAwLFxuICBET01Ub2tlbkxpc3Q6IDEsXG4gIERhdGFUcmFuc2Zlckl0ZW1MaXN0OiAwLFxuICBGaWxlTGlzdDogMCxcbiAgSFRNTEFsbENvbGxlY3Rpb246IDAsXG4gIEhUTUxDb2xsZWN0aW9uOiAwLFxuICBIVE1MRm9ybUVsZW1lbnQ6IDAsXG4gIEhUTUxTZWxlY3RFbGVtZW50OiAwLFxuICBNZWRpYUxpc3Q6IDAsXG4gIE1pbWVUeXBlQXJyYXk6IDAsXG4gIE5hbWVkTm9kZU1hcDogMCxcbiAgTm9kZUxpc3Q6IDEsXG4gIFBhaW50UmVxdWVzdExpc3Q6IDAsXG4gIFBsdWdpbjogMCxcbiAgUGx1Z2luQXJyYXk6IDAsXG4gIFNWR0xlbmd0aExpc3Q6IDAsXG4gIFNWR051bWJlckxpc3Q6IDAsXG4gIFNWR1BhdGhTZWdMaXN0OiAwLFxuICBTVkdQb2ludExpc3Q6IDAsXG4gIFNWR1N0cmluZ0xpc3Q6IDAsXG4gIFNWR1RyYW5zZm9ybUxpc3Q6IDAsXG4gIFNvdXJjZUJ1ZmZlckxpc3Q6IDAsXG4gIFN0eWxlU2hlZXRMaXN0OiAwLFxuICBUZXh0VHJhY2tDdWVMaXN0OiAwLFxuICBUZXh0VHJhY2tMaXN0OiAwLFxuICBUb3VjaExpc3Q6IDBcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCc7XG4iLCJ2YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS11c2VyLWFnZW50Jyk7XG52YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IC9pcGhvbmV8aXBvZHxpcGFkL2kudGVzdCh1c2VyQWdlbnQpICYmIGdsb2JhbC5QZWJibGUgIT09IHVuZGVmaW5lZDtcbiIsInZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXVzZXItYWdlbnQnKTtcblxubW9kdWxlLmV4cG9ydHMgPSAvKD86aXBob25lfGlwb2R8aXBhZCkuKmFwcGxld2Via2l0L2kudGVzdCh1c2VyQWdlbnQpO1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gY2xhc3NvZihnbG9iYWwucHJvY2VzcykgPT0gJ3Byb2Nlc3MnO1xuIiwidmFyIHVzZXJBZ2VudCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdXNlci1hZ2VudCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IC93ZWIwcyg/IS4qY2hyb21lKS9pLnRlc3QodXNlckFnZW50KTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ25hdmlnYXRvcicsICd1c2VyQWdlbnQnKSB8fCAnJztcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgdXNlckFnZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS11c2VyLWFnZW50Jyk7XG5cbnZhciBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3M7XG52YXIgRGVubyA9IGdsb2JhbC5EZW5vO1xudmFyIHZlcnNpb25zID0gcHJvY2VzcyAmJiBwcm9jZXNzLnZlcnNpb25zIHx8IERlbm8gJiYgRGVuby52ZXJzaW9uO1xudmFyIHY4ID0gdmVyc2lvbnMgJiYgdmVyc2lvbnMudjg7XG52YXIgbWF0Y2gsIHZlcnNpb247XG5cbmlmICh2OCkge1xuICBtYXRjaCA9IHY4LnNwbGl0KCcuJyk7XG4gIHZlcnNpb24gPSBtYXRjaFswXSA8IDQgPyAxIDogbWF0Y2hbMF0gKyBtYXRjaFsxXTtcbn0gZWxzZSBpZiAodXNlckFnZW50KSB7XG4gIG1hdGNoID0gdXNlckFnZW50Lm1hdGNoKC9FZGdlXFwvKFxcZCspLyk7XG4gIGlmICghbWF0Y2ggfHwgbWF0Y2hbMV0gPj0gNzQpIHtcbiAgICBtYXRjaCA9IHVzZXJBZ2VudC5tYXRjaCgvQ2hyb21lXFwvKFxcZCspLyk7XG4gICAgaWYgKG1hdGNoKSB2ZXJzaW9uID0gbWF0Y2hbMV07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB2ZXJzaW9uICYmICt2ZXJzaW9uO1xuIiwiLy8gSUU4LSBkb24ndCBlbnVtIGJ1ZyBrZXlzXG5tb2R1bGUuZXhwb3J0cyA9IFtcbiAgJ2NvbnN0cnVjdG9yJyxcbiAgJ2hhc093blByb3BlcnR5JyxcbiAgJ2lzUHJvdG90eXBlT2YnLFxuICAncHJvcGVydHlJc0VudW1lcmFibGUnLFxuICAndG9Mb2NhbGVTdHJpbmcnLFxuICAndG9TdHJpbmcnLFxuICAndmFsdWVPZidcbl07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJykuZjtcbnZhciBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLW5vbi1lbnVtZXJhYmxlLXByb3BlcnR5Jyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xudmFyIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzJyk7XG52YXIgaXNGb3JjZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtZm9yY2VkJyk7XG5cbi8qXG4gIG9wdGlvbnMudGFyZ2V0ICAgICAgLSBuYW1lIG9mIHRoZSB0YXJnZXQgb2JqZWN0XG4gIG9wdGlvbnMuZ2xvYmFsICAgICAgLSB0YXJnZXQgaXMgdGhlIGdsb2JhbCBvYmplY3RcbiAgb3B0aW9ucy5zdGF0ICAgICAgICAtIGV4cG9ydCBhcyBzdGF0aWMgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5wcm90byAgICAgICAtIGV4cG9ydCBhcyBwcm90b3R5cGUgbWV0aG9kcyBvZiB0YXJnZXRcbiAgb3B0aW9ucy5yZWFsICAgICAgICAtIHJlYWwgcHJvdG90eXBlIG1ldGhvZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMuZm9yY2VkICAgICAgLSBleHBvcnQgZXZlbiBpZiB0aGUgbmF0aXZlIGZlYXR1cmUgaXMgYXZhaWxhYmxlXG4gIG9wdGlvbnMuYmluZCAgICAgICAgLSBiaW5kIG1ldGhvZHMgdG8gdGhlIHRhcmdldCwgcmVxdWlyZWQgZm9yIHRoZSBgcHVyZWAgdmVyc2lvblxuICBvcHRpb25zLndyYXAgICAgICAgIC0gd3JhcCBjb25zdHJ1Y3RvcnMgdG8gcHJldmVudGluZyBnbG9iYWwgcG9sbHV0aW9uLCByZXF1aXJlZCBmb3IgdGhlIGBwdXJlYCB2ZXJzaW9uXG4gIG9wdGlvbnMudW5zYWZlICAgICAgLSB1c2UgdGhlIHNpbXBsZSBhc3NpZ25tZW50IG9mIHByb3BlcnR5IGluc3RlYWQgb2YgZGVsZXRlICsgZGVmaW5lUHJvcGVydHlcbiAgb3B0aW9ucy5zaGFtICAgICAgICAtIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgb3B0aW9ucy5lbnVtZXJhYmxlICAtIGV4cG9ydCBhcyBlbnVtZXJhYmxlIHByb3BlcnR5XG4gIG9wdGlvbnMubm9UYXJnZXRHZXQgLSBwcmV2ZW50IGNhbGxpbmcgYSBnZXR0ZXIgb24gdGFyZ2V0XG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob3B0aW9ucywgc291cmNlKSB7XG4gIHZhciBUQVJHRVQgPSBvcHRpb25zLnRhcmdldDtcbiAgdmFyIEdMT0JBTCA9IG9wdGlvbnMuZ2xvYmFsO1xuICB2YXIgU1RBVElDID0gb3B0aW9ucy5zdGF0O1xuICB2YXIgRk9SQ0VELCB0YXJnZXQsIGtleSwgdGFyZ2V0UHJvcGVydHksIHNvdXJjZVByb3BlcnR5LCBkZXNjcmlwdG9yO1xuICBpZiAoR0xPQkFMKSB7XG4gICAgdGFyZ2V0ID0gZ2xvYmFsO1xuICB9IGVsc2UgaWYgKFNUQVRJQykge1xuICAgIHRhcmdldCA9IGdsb2JhbFtUQVJHRVRdIHx8IHNldEdsb2JhbChUQVJHRVQsIHt9KTtcbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQgPSAoZ2xvYmFsW1RBUkdFVF0gfHwge30pLnByb3RvdHlwZTtcbiAgfVxuICBpZiAodGFyZ2V0KSBmb3IgKGtleSBpbiBzb3VyY2UpIHtcbiAgICBzb3VyY2VQcm9wZXJ0eSA9IHNvdXJjZVtrZXldO1xuICAgIGlmIChvcHRpb25zLm5vVGFyZ2V0R2V0KSB7XG4gICAgICBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwga2V5KTtcbiAgICAgIHRhcmdldFByb3BlcnR5ID0gZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlO1xuICAgIH0gZWxzZSB0YXJnZXRQcm9wZXJ0eSA9IHRhcmdldFtrZXldO1xuICAgIEZPUkNFRCA9IGlzRm9yY2VkKEdMT0JBTCA/IGtleSA6IFRBUkdFVCArIChTVEFUSUMgPyAnLicgOiAnIycpICsga2V5LCBvcHRpb25zLmZvcmNlZCk7XG4gICAgLy8gY29udGFpbmVkIGluIHRhcmdldFxuICAgIGlmICghRk9SQ0VEICYmIHRhcmdldFByb3BlcnR5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0eXBlb2Ygc291cmNlUHJvcGVydHkgPT09IHR5cGVvZiB0YXJnZXRQcm9wZXJ0eSkgY29udGludWU7XG4gICAgICBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzKHNvdXJjZVByb3BlcnR5LCB0YXJnZXRQcm9wZXJ0eSk7XG4gICAgfVxuICAgIC8vIGFkZCBhIGZsYWcgdG8gbm90IGNvbXBsZXRlbHkgZnVsbCBwb2x5ZmlsbHNcbiAgICBpZiAob3B0aW9ucy5zaGFtIHx8ICh0YXJnZXRQcm9wZXJ0eSAmJiB0YXJnZXRQcm9wZXJ0eS5zaGFtKSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHNvdXJjZVByb3BlcnR5LCAnc2hhbScsIHRydWUpO1xuICAgIH1cbiAgICAvLyBleHRlbmQgZ2xvYmFsXG4gICAgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNvdXJjZVByb3BlcnR5LCBvcHRpb25zKTtcbiAgfVxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISFleGVjKCk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG4iLCIndXNlIHN0cmljdCc7XG4vLyBUT0RPOiBSZW1vdmUgZnJvbSBgY29yZS1qc0A0YCBzaW5jZSBpdCdzIG1vdmVkIHRvIGVudHJ5IHBvaW50c1xucmVxdWlyZSgnLi4vbW9kdWxlcy9lcy5yZWdleHAuZXhlYycpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgcmVnZXhwRXhlYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZXhlYycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xudmFyIFJlZ0V4cFByb3RvdHlwZSA9IFJlZ0V4cC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEtFWSwgZXhlYywgRk9SQ0VELCBTSEFNKSB7XG4gIHZhciBTWU1CT0wgPSB3ZWxsS25vd25TeW1ib2woS0VZKTtcblxuICB2YXIgREVMRUdBVEVTX1RPX1NZTUJPTCA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gU3RyaW5nIG1ldGhvZHMgY2FsbCBzeW1ib2wtbmFtZWQgUmVnRXAgbWV0aG9kc1xuICAgIHZhciBPID0ge307XG4gICAgT1tTWU1CT0xdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNzsgfTtcbiAgICByZXR1cm4gJydbS0VZXShPKSAhPSA3O1xuICB9KTtcblxuICB2YXIgREVMRUdBVEVTX1RPX0VYRUMgPSBERUxFR0FURVNfVE9fU1lNQk9MICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gICAgLy8gU3ltYm9sLW5hbWVkIFJlZ0V4cCBtZXRob2RzIGNhbGwgLmV4ZWNcbiAgICB2YXIgZXhlY0NhbGxlZCA9IGZhbHNlO1xuICAgIHZhciByZSA9IC9hLztcblxuICAgIGlmIChLRVkgPT09ICdzcGxpdCcpIHtcbiAgICAgIC8vIFdlIGNhbid0IHVzZSByZWFsIHJlZ2V4IGhlcmUgc2luY2UgaXQgY2F1c2VzIGRlb3B0aW1pemF0aW9uXG4gICAgICAvLyBhbmQgc2VyaW91cyBwZXJmb3JtYW5jZSBkZWdyYWRhdGlvbiBpbiBWOFxuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzMwNlxuICAgICAgcmUgPSB7fTtcbiAgICAgIC8vIFJlZ0V4cFtAQHNwbGl0XSBkb2Vzbid0IGNhbGwgdGhlIHJlZ2V4J3MgZXhlYyBtZXRob2QsIGJ1dCBmaXJzdCBjcmVhdGVzXG4gICAgICAvLyBhIG5ldyBvbmUuIFdlIG5lZWQgdG8gcmV0dXJuIHRoZSBwYXRjaGVkIHJlZ2V4IHdoZW4gY3JlYXRpbmcgdGhlIG5ldyBvbmUuXG4gICAgICByZS5jb25zdHJ1Y3RvciA9IHt9O1xuICAgICAgcmUuY29uc3RydWN0b3JbU1BFQ0lFU10gPSBmdW5jdGlvbiAoKSB7IHJldHVybiByZTsgfTtcbiAgICAgIHJlLmZsYWdzID0gJyc7XG4gICAgICByZVtTWU1CT0xdID0gLy4vW1NZTUJPTF07XG4gICAgfVxuXG4gICAgcmUuZXhlYyA9IGZ1bmN0aW9uICgpIHsgZXhlY0NhbGxlZCA9IHRydWU7IHJldHVybiBudWxsOyB9O1xuXG4gICAgcmVbU1lNQk9MXSgnJyk7XG4gICAgcmV0dXJuICFleGVjQ2FsbGVkO1xuICB9KTtcblxuICBpZiAoXG4gICAgIURFTEVHQVRFU19UT19TWU1CT0wgfHxcbiAgICAhREVMRUdBVEVTX1RPX0VYRUMgfHxcbiAgICBGT1JDRURcbiAgKSB7XG4gICAgdmFyIG5hdGl2ZVJlZ0V4cE1ldGhvZCA9IC8uL1tTWU1CT0xdO1xuICAgIHZhciBtZXRob2RzID0gZXhlYyhTWU1CT0wsICcnW0tFWV0sIGZ1bmN0aW9uIChuYXRpdmVNZXRob2QsIHJlZ2V4cCwgc3RyLCBhcmcyLCBmb3JjZVN0cmluZ01ldGhvZCkge1xuICAgICAgdmFyICRleGVjID0gcmVnZXhwLmV4ZWM7XG4gICAgICBpZiAoJGV4ZWMgPT09IHJlZ2V4cEV4ZWMgfHwgJGV4ZWMgPT09IFJlZ0V4cFByb3RvdHlwZS5leGVjKSB7XG4gICAgICAgIGlmIChERUxFR0FURVNfVE9fU1lNQk9MICYmICFmb3JjZVN0cmluZ01ldGhvZCkge1xuICAgICAgICAgIC8vIFRoZSBuYXRpdmUgU3RyaW5nIG1ldGhvZCBhbHJlYWR5IGRlbGVnYXRlcyB0byBAQG1ldGhvZCAodGhpc1xuICAgICAgICAgIC8vIHBvbHlmaWxsZWQgZnVuY3Rpb24pLCBsZWFzaW5nIHRvIGluZmluaXRlIHJlY3Vyc2lvbi5cbiAgICAgICAgICAvLyBXZSBhdm9pZCBpdCBieSBkaXJlY3RseSBjYWxsaW5nIHRoZSBuYXRpdmUgQEBtZXRob2QgbWV0aG9kLlxuICAgICAgICAgIHJldHVybiB7IGRvbmU6IHRydWUsIHZhbHVlOiBuYXRpdmVSZWdFeHBNZXRob2QuY2FsbChyZWdleHAsIHN0ciwgYXJnMikgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBkb25lOiB0cnVlLCB2YWx1ZTogbmF0aXZlTWV0aG9kLmNhbGwoc3RyLCByZWdleHAsIGFyZzIpIH07XG4gICAgICB9XG4gICAgICByZXR1cm4geyBkb25lOiBmYWxzZSB9O1xuICAgIH0pO1xuXG4gICAgcmVkZWZpbmUoU3RyaW5nLnByb3RvdHlwZSwgS0VZLCBtZXRob2RzWzBdKTtcbiAgICByZWRlZmluZShSZWdFeHBQcm90b3R5cGUsIFNZTUJPTCwgbWV0aG9kc1sxXSk7XG4gIH1cblxuICBpZiAoU0hBTSkgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KFJlZ0V4cFByb3RvdHlwZVtTWU1CT0xdLCAnc2hhbScsIHRydWUpO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9ICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtaXNleHRlbnNpYmxlLCBlcy9uby1vYmplY3QtcHJldmVudGV4dGVuc2lvbnMgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuIE9iamVjdC5pc0V4dGVuc2libGUoT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKHt9KSk7XG59KTtcbiIsInZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1mdW5jdGlvbicpO1xuXG4vLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGZuLCB0aGF0LCBsZW5ndGgpIHtcbiAgYUZ1bmN0aW9uKGZuKTtcbiAgaWYgKHRoYXQgPT09IHVuZGVmaW5lZCkgcmV0dXJuIGZuO1xuICBzd2l0Y2ggKGxlbmd0aCkge1xuICAgIGNhc2UgMDogcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQpO1xuICAgIH07XG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24gKGEpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIpO1xuICAgIH07XG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24gKGEsIGIsIGMpIHtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGZ1bmN0aW9uICgvKiAuLi5hcmdzICovKSB7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFGdW5jdGlvbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hLWZ1bmN0aW9uJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbnZhciBzbGljZSA9IFtdLnNsaWNlO1xudmFyIGZhY3RvcmllcyA9IHt9O1xuXG52YXIgY29uc3RydWN0ID0gZnVuY3Rpb24gKEMsIGFyZ3NMZW5ndGgsIGFyZ3MpIHtcbiAgaWYgKCEoYXJnc0xlbmd0aCBpbiBmYWN0b3JpZXMpKSB7XG4gICAgZm9yICh2YXIgbGlzdCA9IFtdLCBpID0gMDsgaSA8IGFyZ3NMZW5ndGg7IGkrKykgbGlzdFtpXSA9ICdhWycgKyBpICsgJ10nO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuYyAtLSB3ZSBoYXZlIG5vIHByb3BlciBhbHRlcm5hdGl2ZXMsIElFOC0gb25seVxuICAgIGZhY3Rvcmllc1thcmdzTGVuZ3RoXSA9IEZ1bmN0aW9uKCdDLGEnLCAncmV0dXJuIG5ldyBDKCcgKyBsaXN0LmpvaW4oJywnKSArICcpJyk7XG4gIH0gcmV0dXJuIGZhY3Rvcmllc1thcmdzTGVuZ3RoXShDLCBhcmdzKTtcbn07XG5cbi8vIGBGdW5jdGlvbi5wcm90b3R5cGUuYmluZGAgbWV0aG9kIGltcGxlbWVudGF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kXG5tb2R1bGUuZXhwb3J0cyA9IEZ1bmN0aW9uLmJpbmQgfHwgZnVuY3Rpb24gYmluZCh0aGF0IC8qICwgLi4uYXJncyAqLykge1xuICB2YXIgZm4gPSBhRnVuY3Rpb24odGhpcyk7XG4gIHZhciBwYXJ0QXJncyA9IHNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgdmFyIGJvdW5kRnVuY3Rpb24gPSBmdW5jdGlvbiBib3VuZCgvKiBhcmdzLi4uICovKSB7XG4gICAgdmFyIGFyZ3MgPSBwYXJ0QXJncy5jb25jYXQoc2xpY2UuY2FsbChhcmd1bWVudHMpKTtcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIGJvdW5kRnVuY3Rpb24gPyBjb25zdHJ1Y3QoZm4sIGFyZ3MubGVuZ3RoLCBhcmdzKSA6IGZuLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICB9O1xuICBpZiAoaXNPYmplY3QoZm4ucHJvdG90eXBlKSkgYm91bmRGdW5jdGlvbi5wcm90b3R5cGUgPSBmbi5wcm90b3R5cGU7XG4gIHJldHVybiBib3VuZEZ1bmN0aW9uO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG5cbnZhciBhRnVuY3Rpb24gPSBmdW5jdGlvbiAodmFyaWFibGUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YXJpYWJsZSA9PSAnZnVuY3Rpb24nID8gdmFyaWFibGUgOiB1bmRlZmluZWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lc3BhY2UsIG1ldGhvZCkge1xuICByZXR1cm4gYXJndW1lbnRzLmxlbmd0aCA8IDIgPyBhRnVuY3Rpb24oZ2xvYmFsW25hbWVzcGFjZV0pIDogZ2xvYmFsW25hbWVzcGFjZV0gJiYgZ2xvYmFsW25hbWVzcGFjZV1bbWV0aG9kXTtcbn07XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mJyk7XG52YXIgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9ycycpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgSVRFUkFUT1IgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0KSB7XG4gIGlmIChpdCAhPSB1bmRlZmluZWQpIHJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07XG4iLCJ2YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG5cbnZhciBmbG9vciA9IE1hdGguZmxvb3I7XG52YXIgcmVwbGFjZSA9ICcnLnJlcGxhY2U7XG52YXIgU1VCU1RJVFVUSU9OX1NZTUJPTFMgPSAvXFwkKFskJidgXXxcXGR7MSwyfXw8W14+XSo+KS9nO1xudmFyIFNVQlNUSVRVVElPTl9TWU1CT0xTX05PX05BTUVEID0gL1xcJChbJCYnYF18XFxkezEsMn0pL2c7XG5cbi8vIGBHZXRTdWJzdGl0dXRpb25gIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1nZXRzdWJzdGl0dXRpb25cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKG1hdGNoZWQsIHN0ciwgcG9zaXRpb24sIGNhcHR1cmVzLCBuYW1lZENhcHR1cmVzLCByZXBsYWNlbWVudCkge1xuICB2YXIgdGFpbFBvcyA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gIHZhciBtID0gY2FwdHVyZXMubGVuZ3RoO1xuICB2YXIgc3ltYm9scyA9IFNVQlNUSVRVVElPTl9TWU1CT0xTX05PX05BTUVEO1xuICBpZiAobmFtZWRDYXB0dXJlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgbmFtZWRDYXB0dXJlcyA9IHRvT2JqZWN0KG5hbWVkQ2FwdHVyZXMpO1xuICAgIHN5bWJvbHMgPSBTVUJTVElUVVRJT05fU1lNQk9MUztcbiAgfVxuICByZXR1cm4gcmVwbGFjZS5jYWxsKHJlcGxhY2VtZW50LCBzeW1ib2xzLCBmdW5jdGlvbiAobWF0Y2gsIGNoKSB7XG4gICAgdmFyIGNhcHR1cmU7XG4gICAgc3dpdGNoIChjaC5jaGFyQXQoMCkpIHtcbiAgICAgIGNhc2UgJyQnOiByZXR1cm4gJyQnO1xuICAgICAgY2FzZSAnJic6IHJldHVybiBtYXRjaGVkO1xuICAgICAgY2FzZSAnYCc6IHJldHVybiBzdHIuc2xpY2UoMCwgcG9zaXRpb24pO1xuICAgICAgY2FzZSBcIidcIjogcmV0dXJuIHN0ci5zbGljZSh0YWlsUG9zKTtcbiAgICAgIGNhc2UgJzwnOlxuICAgICAgICBjYXB0dXJlID0gbmFtZWRDYXB0dXJlc1tjaC5zbGljZSgxLCAtMSldO1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6IC8vIFxcZFxcZD9cbiAgICAgICAgdmFyIG4gPSArY2g7XG4gICAgICAgIGlmIChuID09PSAwKSByZXR1cm4gbWF0Y2g7XG4gICAgICAgIGlmIChuID4gbSkge1xuICAgICAgICAgIHZhciBmID0gZmxvb3IobiAvIDEwKTtcbiAgICAgICAgICBpZiAoZiA9PT0gMCkgcmV0dXJuIG1hdGNoO1xuICAgICAgICAgIGlmIChmIDw9IG0pIHJldHVybiBjYXB0dXJlc1tmIC0gMV0gPT09IHVuZGVmaW5lZCA/IGNoLmNoYXJBdCgxKSA6IGNhcHR1cmVzW2YgLSAxXSArIGNoLmNoYXJBdCgxKTtcbiAgICAgICAgICByZXR1cm4gbWF0Y2g7XG4gICAgICAgIH1cbiAgICAgICAgY2FwdHVyZSA9IGNhcHR1cmVzW24gLSAxXTtcbiAgICB9XG4gICAgcmV0dXJuIGNhcHR1cmUgPT09IHVuZGVmaW5lZCA/ICcnIDogY2FwdHVyZTtcbiAgfSk7XG59O1xuIiwidmFyIGNoZWNrID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBpdCAmJiBpdC5NYXRoID09IE1hdGggJiYgaXQ7XG59O1xuXG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxubW9kdWxlLmV4cG9ydHMgPVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tZ2xvYmFsLXRoaXMgLS0gc2FmZVxuICBjaGVjayh0eXBlb2YgZ2xvYmFsVGhpcyA9PSAnb2JqZWN0JyAmJiBnbG9iYWxUaGlzKSB8fFxuICBjaGVjayh0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdykgfHxcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtZ2xvYmFscyAtLSBzYWZlXG4gIGNoZWNrKHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYpIHx8XG4gIGNoZWNrKHR5cGVvZiBnbG9iYWwgPT0gJ29iamVjdCcgJiYgZ2xvYmFsKSB8fFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tbmV3LWZ1bmMgLS0gZmFsbGJhY2tcbiAgKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXM7IH0pKCkgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbiIsInZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcblxudmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0Lmhhc093biB8fCBmdW5jdGlvbiBoYXNPd24oaXQsIGtleSkge1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbCh0b09iamVjdChpdCksIGtleSk7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7fTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgdmFyIGNvbnNvbGUgPSBnbG9iYWwuY29uc29sZTtcbiAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS5lcnJvcikge1xuICAgIGFyZ3VtZW50cy5sZW5ndGggPT09IDEgPyBjb25zb2xlLmVycm9yKGEpIDogY29uc29sZS5lcnJvcihhLCBiKTtcbiAgfVxufTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ2RvY3VtZW50JywgJ2RvY3VtZW50RWxlbWVudCcpO1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG5cbi8vIFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHlcbm1vZHVsZS5leHBvcnRzID0gIURFU0NSSVBUT1JTICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydHkgLS0gcmVxdWllZCBmb3IgdGVzdGluZ1xuICByZXR1cm4gT2JqZWN0LmRlZmluZVByb3BlcnR5KGNyZWF0ZUVsZW1lbnQoJ2RpdicpLCAnYScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDc7IH1cbiAgfSkuYSAhPSA3O1xufSk7XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YtcmF3Jyk7XG5cbnZhciBzcGxpdCA9ICcnLnNwbGl0O1xuXG4vLyBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIGFuZCBub24tZW51bWVyYWJsZSBvbGQgVjggc3RyaW5nc1xubW9kdWxlLmV4cG9ydHMgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIHRocm93cyBhbiBlcnJvciBpbiByaGlubywgc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3ppbGxhL3JoaW5vL2lzc3Vlcy8zNDZcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXByb3RvdHlwZS1idWlsdGlucyAtLSBzYWZlXG4gIHJldHVybiAhT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCk7XG59KSA/IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gY2xhc3NvZihpdCkgPT0gJ1N0cmluZycgPyBzcGxpdC5jYWxsKGl0LCAnJykgOiBPYmplY3QoaXQpO1xufSA6IE9iamVjdDtcbiIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qtc2V0LXByb3RvdHlwZS1vZicpO1xuXG4vLyBtYWtlcyBzdWJjbGFzc2luZyB3b3JrIGNvcnJlY3QgZm9yIHdyYXBwZWQgYnVpbHQtaW5zXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICgkdGhpcywgZHVtbXksIFdyYXBwZXIpIHtcbiAgdmFyIE5ld1RhcmdldCwgTmV3VGFyZ2V0UHJvdG90eXBlO1xuICBpZiAoXG4gICAgLy8gaXQgY2FuIHdvcmsgb25seSB3aXRoIG5hdGl2ZSBgc2V0UHJvdG90eXBlT2ZgXG4gICAgc2V0UHJvdG90eXBlT2YgJiZcbiAgICAvLyB3ZSBoYXZlbid0IGNvbXBsZXRlbHkgY29ycmVjdCBwcmUtRVM2IHdheSBmb3IgZ2V0dGluZyBgbmV3LnRhcmdldGAsIHNvIHVzZSB0aGlzXG4gICAgdHlwZW9mIChOZXdUYXJnZXQgPSBkdW1teS5jb25zdHJ1Y3RvcikgPT0gJ2Z1bmN0aW9uJyAmJlxuICAgIE5ld1RhcmdldCAhPT0gV3JhcHBlciAmJlxuICAgIGlzT2JqZWN0KE5ld1RhcmdldFByb3RvdHlwZSA9IE5ld1RhcmdldC5wcm90b3R5cGUpICYmXG4gICAgTmV3VGFyZ2V0UHJvdG90eXBlICE9PSBXcmFwcGVyLnByb3RvdHlwZVxuICApIHNldFByb3RvdHlwZU9mKCR0aGlzLCBOZXdUYXJnZXRQcm90b3R5cGUpO1xuICByZXR1cm4gJHRoaXM7XG59O1xuIiwidmFyIHN0b3JlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1zdG9yZScpO1xuXG52YXIgZnVuY3Rpb25Ub1N0cmluZyA9IEZ1bmN0aW9uLnRvU3RyaW5nO1xuXG4vLyB0aGlzIGhlbHBlciBicm9rZW4gaW4gYGNvcmUtanNAMy40LjEtMy40LjRgLCBzbyB3ZSBjYW4ndCB1c2UgYHNoYXJlZGAgaGVscGVyXG5pZiAodHlwZW9mIHN0b3JlLmluc3BlY3RTb3VyY2UgIT0gJ2Z1bmN0aW9uJykge1xuICBzdG9yZS5pbnNwZWN0U291cmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uVG9TdHJpbmcuY2FsbChpdCk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmUuaW5zcGVjdFNvdXJjZTtcbiIsInZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpLmY7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcycpO1xudmFyIGdldE93blByb3BlcnR5TmFtZXNFeHRlcm5hbE1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcy1leHRlcm5hbCcpO1xudmFyIHVpZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy91aWQnKTtcbnZhciBGUkVFWklORyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mcmVlemluZycpO1xuXG52YXIgUkVRVUlSRUQgPSBmYWxzZTtcbnZhciBNRVRBREFUQSA9IHVpZCgnbWV0YScpO1xudmFyIGlkID0gMDtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1pc2V4dGVuc2libGUgLS0gc2FmZVxudmFyIGlzRXh0ZW5zaWJsZSA9IE9iamVjdC5pc0V4dGVuc2libGUgfHwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdHJ1ZTtcbn07XG5cbnZhciBzZXRNZXRhZGF0YSA9IGZ1bmN0aW9uIChpdCkge1xuICBkZWZpbmVQcm9wZXJ0eShpdCwgTUVUQURBVEEsIHsgdmFsdWU6IHtcbiAgICBvYmplY3RJRDogJ08nICsgaWQrKywgLy8gb2JqZWN0IElEXG4gICAgd2Vha0RhdGE6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH0gfSk7XG59O1xuXG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uIChpdCwgY3JlYXRlKSB7XG4gIC8vIHJldHVybiBhIHByaW1pdGl2ZSB3aXRoIHByZWZpeFxuICBpZiAoIWlzT2JqZWN0KGl0KSkgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYgKCFoYXMoaXQsIE1FVEFEQVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gJ0YnO1xuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIG1ldGFkYXRhXG4gICAgaWYgKCFjcmVhdGUpIHJldHVybiAnRSc7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhZGF0YShpdCk7XG4gIC8vIHJldHVybiBvYmplY3QgSURcbiAgfSByZXR1cm4gaXRbTUVUQURBVEFdLm9iamVjdElEO1xufTtcblxudmFyIGdldFdlYWtEYXRhID0gZnVuY3Rpb24gKGl0LCBjcmVhdGUpIHtcbiAgaWYgKCFoYXMoaXQsIE1FVEFEQVRBKSkge1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYgKCFpc0V4dGVuc2libGUoaXQpKSByZXR1cm4gdHJ1ZTtcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmICghY3JlYXRlKSByZXR1cm4gZmFsc2U7XG4gICAgLy8gYWRkIG1pc3NpbmcgbWV0YWRhdGFcbiAgICBzZXRNZXRhZGF0YShpdCk7XG4gIC8vIHJldHVybiB0aGUgc3RvcmUgb2Ygd2VhayBjb2xsZWN0aW9ucyBJRHNcbiAgfSByZXR1cm4gaXRbTUVUQURBVEFdLndlYWtEYXRhO1xufTtcblxuLy8gYWRkIG1ldGFkYXRhIG9uIGZyZWV6ZS1mYW1pbHkgbWV0aG9kcyBjYWxsaW5nXG52YXIgb25GcmVlemUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKEZSRUVaSU5HICYmIFJFUVVJUkVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQURBVEEpKSBzZXRNZXRhZGF0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG5cbnZhciBlbmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gIG1ldGEuZW5hYmxlID0gZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9O1xuICBSRVFVSVJFRCA9IHRydWU7XG4gIHZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZS5mO1xuICB2YXIgc3BsaWNlID0gW10uc3BsaWNlO1xuICB2YXIgdGVzdCA9IHt9O1xuICB0ZXN0W01FVEFEQVRBXSA9IDE7XG5cbiAgLy8gcHJldmVudCBleHBvc2luZyBvZiBtZXRhZGF0YSBrZXlcbiAgaWYgKGdldE93blByb3BlcnR5TmFtZXModGVzdCkubGVuZ3RoKSB7XG4gICAgZ2V0T3duUHJvcGVydHlOYW1lc01vZHVsZS5mID0gZnVuY3Rpb24gKGl0KSB7XG4gICAgICB2YXIgcmVzdWx0ID0gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCk7XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuZ3RoID0gcmVzdWx0Lmxlbmd0aDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChyZXN1bHRbaV0gPT09IE1FVEFEQVRBKSB7XG4gICAgICAgICAgc3BsaWNlLmNhbGwocmVzdWx0LCBpLCAxKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSByZXR1cm4gcmVzdWx0O1xuICAgIH07XG5cbiAgICAkKHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSwgZm9yY2VkOiB0cnVlIH0sIHtcbiAgICAgIGdldE93blByb3BlcnR5TmFtZXM6IGdldE93blByb3BlcnR5TmFtZXNFeHRlcm5hbE1vZHVsZS5mXG4gICAgfSk7XG4gIH1cbn07XG5cbnZhciBtZXRhID0gbW9kdWxlLmV4cG9ydHMgPSB7XG4gIGVuYWJsZTogZW5hYmxlLFxuICBmYXN0S2V5OiBmYXN0S2V5LFxuICBnZXRXZWFrRGF0YTogZ2V0V2Vha0RhdGEsXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTtcblxuaGlkZGVuS2V5c1tNRVRBREFUQV0gPSB0cnVlO1xuIiwidmFyIE5BVElWRV9XRUFLX01BUCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uYXRpdmUtd2Vhay1tYXAnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIG9iamVjdEhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcbnZhciBzaGFyZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG5cbnZhciBPQkpFQ1RfQUxSRUFEWV9JTklUSUFMSVpFRCA9ICdPYmplY3QgYWxyZWFkeSBpbml0aWFsaXplZCc7XG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xudmFyIHNldCwgZ2V0LCBoYXM7XG5cbnZhciBlbmZvcmNlID0gZnVuY3Rpb24gKGl0KSB7XG4gIHJldHVybiBoYXMoaXQpID8gZ2V0KGl0KSA6IHNldChpdCwge30pO1xufTtcblxudmFyIGdldHRlckZvciA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXQpIHtcbiAgICB2YXIgc3RhdGU7XG4gICAgaWYgKCFpc09iamVjdChpdCkgfHwgKHN0YXRlID0gZ2V0KGl0KSkudHlwZSAhPT0gVFlQRSkge1xuICAgICAgdGhyb3cgVHlwZUVycm9yKCdJbmNvbXBhdGlibGUgcmVjZWl2ZXIsICcgKyBUWVBFICsgJyByZXF1aXJlZCcpO1xuICAgIH0gcmV0dXJuIHN0YXRlO1xuICB9O1xufTtcblxuaWYgKE5BVElWRV9XRUFLX01BUCB8fCBzaGFyZWQuc3RhdGUpIHtcbiAgdmFyIHN0b3JlID0gc2hhcmVkLnN0YXRlIHx8IChzaGFyZWQuc3RhdGUgPSBuZXcgV2Vha01hcCgpKTtcbiAgdmFyIHdtZ2V0ID0gc3RvcmUuZ2V0O1xuICB2YXIgd21oYXMgPSBzdG9yZS5oYXM7XG4gIHZhciB3bXNldCA9IHN0b3JlLnNldDtcbiAgc2V0ID0gZnVuY3Rpb24gKGl0LCBtZXRhZGF0YSkge1xuICAgIGlmICh3bWhhcy5jYWxsKHN0b3JlLCBpdCkpIHRocm93IG5ldyBUeXBlRXJyb3IoT0JKRUNUX0FMUkVBRFlfSU5JVElBTElaRUQpO1xuICAgIG1ldGFkYXRhLmZhY2FkZSA9IGl0O1xuICAgIHdtc2V0LmNhbGwoc3RvcmUsIGl0LCBtZXRhZGF0YSk7XG4gICAgcmV0dXJuIG1ldGFkYXRhO1xuICB9O1xuICBnZXQgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gd21nZXQuY2FsbChzdG9yZSwgaXQpIHx8IHt9O1xuICB9O1xuICBoYXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gd21oYXMuY2FsbChzdG9yZSwgaXQpO1xuICB9O1xufSBlbHNlIHtcbiAgdmFyIFNUQVRFID0gc2hhcmVkS2V5KCdzdGF0ZScpO1xuICBoaWRkZW5LZXlzW1NUQVRFXSA9IHRydWU7XG4gIHNldCA9IGZ1bmN0aW9uIChpdCwgbWV0YWRhdGEpIHtcbiAgICBpZiAob2JqZWN0SGFzKGl0LCBTVEFURSkpIHRocm93IG5ldyBUeXBlRXJyb3IoT0JKRUNUX0FMUkVBRFlfSU5JVElBTElaRUQpO1xuICAgIG1ldGFkYXRhLmZhY2FkZSA9IGl0O1xuICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShpdCwgU1RBVEUsIG1ldGFkYXRhKTtcbiAgICByZXR1cm4gbWV0YWRhdGE7XG4gIH07XG4gIGdldCA9IGZ1bmN0aW9uIChpdCkge1xuICAgIHJldHVybiBvYmplY3RIYXMoaXQsIFNUQVRFKSA/IGl0W1NUQVRFXSA6IHt9O1xuICB9O1xuICBoYXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgICByZXR1cm4gb2JqZWN0SGFzKGl0LCBTVEFURSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzZXQ6IHNldCxcbiAgZ2V0OiBnZXQsXG4gIGhhczogaGFzLFxuICBlbmZvcmNlOiBlbmZvcmNlLFxuICBnZXR0ZXJGb3I6IGdldHRlckZvclxufTtcbiIsInZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzJyk7XG5cbnZhciBJVEVSQVRPUiA9IHdlbGxLbm93blN5bWJvbCgnaXRlcmF0b3InKTtcbnZhciBBcnJheVByb3RvdHlwZSA9IEFycmF5LnByb3RvdHlwZTtcblxuLy8gY2hlY2sgb24gZGVmYXVsdCBBcnJheSBpdGVyYXRvclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIGl0ICE9PSB1bmRlZmluZWQgJiYgKEl0ZXJhdG9ycy5BcnJheSA9PT0gaXQgfHwgQXJyYXlQcm90b3R5cGVbSVRFUkFUT1JdID09PSBpdCk7XG59O1xuIiwidmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcblxuLy8gYElzQXJyYXlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1pc2FycmF5XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tYXJyYXktaXNhcnJheSAtLSBzYWZlXG5tb2R1bGUuZXhwb3J0cyA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gaXNBcnJheShhcmcpIHtcbiAgcmV0dXJuIGNsYXNzb2YoYXJnKSA9PSAnQXJyYXknO1xufTtcbiIsInZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xuXG52YXIgcmVwbGFjZW1lbnQgPSAvI3xcXC5wcm90b3R5cGVcXC4vO1xuXG52YXIgaXNGb3JjZWQgPSBmdW5jdGlvbiAoZmVhdHVyZSwgZGV0ZWN0aW9uKSB7XG4gIHZhciB2YWx1ZSA9IGRhdGFbbm9ybWFsaXplKGZlYXR1cmUpXTtcbiAgcmV0dXJuIHZhbHVlID09IFBPTFlGSUxMID8gdHJ1ZVxuICAgIDogdmFsdWUgPT0gTkFUSVZFID8gZmFsc2VcbiAgICA6IHR5cGVvZiBkZXRlY3Rpb24gPT0gJ2Z1bmN0aW9uJyA/IGZhaWxzKGRldGVjdGlvbilcbiAgICA6ICEhZGV0ZWN0aW9uO1xufTtcblxudmFyIG5vcm1hbGl6ZSA9IGlzRm9yY2VkLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgcmV0dXJuIFN0cmluZyhzdHJpbmcpLnJlcGxhY2UocmVwbGFjZW1lbnQsICcuJykudG9Mb3dlckNhc2UoKTtcbn07XG5cbnZhciBkYXRhID0gaXNGb3JjZWQuZGF0YSA9IHt9O1xudmFyIE5BVElWRSA9IGlzRm9yY2VkLk5BVElWRSA9ICdOJztcbnZhciBQT0xZRklMTCA9IGlzRm9yY2VkLlBPTFlGSUxMID0gJ1AnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRm9yY2VkO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PT0gJ29iamVjdCcgPyBpdCAhPT0gbnVsbCA6IHR5cGVvZiBpdCA9PT0gJ2Z1bmN0aW9uJztcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZhbHNlO1xuIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGNsYXNzb2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2xhc3NvZi1yYXcnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIE1BVENIID0gd2VsbEtub3duU3ltYm9sKCdtYXRjaCcpO1xuXG4vLyBgSXNSZWdFeHBgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1pc3JlZ2V4cFxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIGlzUmVnRXhwO1xuICByZXR1cm4gaXNPYmplY3QoaXQpICYmICgoaXNSZWdFeHAgPSBpdFtNQVRDSF0pICE9PSB1bmRlZmluZWQgPyAhIWlzUmVnRXhwIDogY2xhc3NvZihpdCkgPT0gJ1JlZ0V4cCcpO1xufTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIFVTRV9TWU1CT0xfQVNfVUlEID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gVVNFX1NZTUJPTF9BU19VSUQgPyBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJztcbn0gOiBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyICRTeW1ib2wgPSBnZXRCdWlsdEluKCdTeW1ib2wnKTtcbiAgcmV0dXJuIHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbicgJiYgT2JqZWN0KGl0KSBpbnN0YW5jZW9mICRTeW1ib2w7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIGlzQXJyYXlJdGVyYXRvck1ldGhvZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1hcnJheS1pdGVyYXRvci1tZXRob2QnKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciBiaW5kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Z1bmN0aW9uLWJpbmQtY29udGV4dCcpO1xudmFyIGdldEl0ZXJhdG9yTWV0aG9kID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1pdGVyYXRvci1tZXRob2QnKTtcbnZhciBpdGVyYXRvckNsb3NlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2l0ZXJhdG9yLWNsb3NlJyk7XG5cbnZhciBSZXN1bHQgPSBmdW5jdGlvbiAoc3RvcHBlZCwgcmVzdWx0KSB7XG4gIHRoaXMuc3RvcHBlZCA9IHN0b3BwZWQ7XG4gIHRoaXMucmVzdWx0ID0gcmVzdWx0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlcmFibGUsIHVuYm91bmRGdW5jdGlvbiwgb3B0aW9ucykge1xuICB2YXIgdGhhdCA9IG9wdGlvbnMgJiYgb3B0aW9ucy50aGF0O1xuICB2YXIgQVNfRU5UUklFUyA9ICEhKG9wdGlvbnMgJiYgb3B0aW9ucy5BU19FTlRSSUVTKTtcbiAgdmFyIElTX0lURVJBVE9SID0gISEob3B0aW9ucyAmJiBvcHRpb25zLklTX0lURVJBVE9SKTtcbiAgdmFyIElOVEVSUlVQVEVEID0gISEob3B0aW9ucyAmJiBvcHRpb25zLklOVEVSUlVQVEVEKTtcbiAgdmFyIGZuID0gYmluZCh1bmJvdW5kRnVuY3Rpb24sIHRoYXQsIDEgKyBBU19FTlRSSUVTICsgSU5URVJSVVBURUQpO1xuICB2YXIgaXRlcmF0b3IsIGl0ZXJGbiwgaW5kZXgsIGxlbmd0aCwgcmVzdWx0LCBuZXh0LCBzdGVwO1xuXG4gIHZhciBzdG9wID0gZnVuY3Rpb24gKGNvbmRpdGlvbikge1xuICAgIGlmIChpdGVyYXRvcikgaXRlcmF0b3JDbG9zZShpdGVyYXRvcik7XG4gICAgcmV0dXJuIG5ldyBSZXN1bHQodHJ1ZSwgY29uZGl0aW9uKTtcbiAgfTtcblxuICB2YXIgY2FsbEZuID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKEFTX0VOVFJJRVMpIHtcbiAgICAgIGFuT2JqZWN0KHZhbHVlKTtcbiAgICAgIHJldHVybiBJTlRFUlJVUFRFRCA/IGZuKHZhbHVlWzBdLCB2YWx1ZVsxXSwgc3RvcCkgOiBmbih2YWx1ZVswXSwgdmFsdWVbMV0pO1xuICAgIH0gcmV0dXJuIElOVEVSUlVQVEVEID8gZm4odmFsdWUsIHN0b3ApIDogZm4odmFsdWUpO1xuICB9O1xuXG4gIGlmIChJU19JVEVSQVRPUikge1xuICAgIGl0ZXJhdG9yID0gaXRlcmFibGU7XG4gIH0gZWxzZSB7XG4gICAgaXRlckZuID0gZ2V0SXRlcmF0b3JNZXRob2QoaXRlcmFibGUpO1xuICAgIGlmICh0eXBlb2YgaXRlckZuICE9ICdmdW5jdGlvbicpIHRocm93IFR5cGVFcnJvcignVGFyZ2V0IGlzIG5vdCBpdGVyYWJsZScpO1xuICAgIC8vIG9wdGltaXNhdGlvbiBmb3IgYXJyYXkgaXRlcmF0b3JzXG4gICAgaWYgKGlzQXJyYXlJdGVyYXRvck1ldGhvZChpdGVyRm4pKSB7XG4gICAgICBmb3IgKGluZGV4ID0gMCwgbGVuZ3RoID0gdG9MZW5ndGgoaXRlcmFibGUubGVuZ3RoKTsgbGVuZ3RoID4gaW5kZXg7IGluZGV4KyspIHtcbiAgICAgICAgcmVzdWx0ID0gY2FsbEZuKGl0ZXJhYmxlW2luZGV4XSk7XG4gICAgICAgIGlmIChyZXN1bHQgJiYgcmVzdWx0IGluc3RhbmNlb2YgUmVzdWx0KSByZXR1cm4gcmVzdWx0O1xuICAgICAgfSByZXR1cm4gbmV3IFJlc3VsdChmYWxzZSk7XG4gICAgfVxuICAgIGl0ZXJhdG9yID0gaXRlckZuLmNhbGwoaXRlcmFibGUpO1xuICB9XG5cbiAgbmV4dCA9IGl0ZXJhdG9yLm5leHQ7XG4gIHdoaWxlICghKHN0ZXAgPSBuZXh0LmNhbGwoaXRlcmF0b3IpKS5kb25lKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IGNhbGxGbihzdGVwLnZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaXRlcmF0b3JDbG9zZShpdGVyYXRvcik7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgPT0gJ29iamVjdCcgJiYgcmVzdWx0ICYmIHJlc3VsdCBpbnN0YW5jZW9mIFJlc3VsdCkgcmV0dXJuIHJlc3VsdDtcbiAgfSByZXR1cm4gbmV3IFJlc3VsdChmYWxzZSk7XG59O1xuIiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVyYXRvcikge1xuICB2YXIgcmV0dXJuTWV0aG9kID0gaXRlcmF0b3JbJ3JldHVybiddO1xuICBpZiAocmV0dXJuTWV0aG9kICE9PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gYW5PYmplY3QocmV0dXJuTWV0aG9kLmNhbGwoaXRlcmF0b3IpKS52YWx1ZTtcbiAgfVxufTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGdldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtcHJvdG90eXBlLW9mJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcbnZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcblxudmFyIElURVJBVE9SID0gd2VsbEtub3duU3ltYm9sKCdpdGVyYXRvcicpO1xudmFyIEJVR0dZX1NBRkFSSV9JVEVSQVRPUlMgPSBmYWxzZTtcblxudmFyIHJldHVyblRoaXMgPSBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9O1xuXG4vLyBgJUl0ZXJhdG9yUHJvdG90eXBlJWAgb2JqZWN0XG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSVpdGVyYXRvcnByb3RvdHlwZSUtb2JqZWN0XG52YXIgSXRlcmF0b3JQcm90b3R5cGUsIFByb3RvdHlwZU9mQXJyYXlJdGVyYXRvclByb3RvdHlwZSwgYXJyYXlJdGVyYXRvcjtcblxuLyogZXNsaW50LWRpc2FibGUgZXMvbm8tYXJyYXktcHJvdG90eXBlLWtleXMgLS0gc2FmZSAqL1xuaWYgKFtdLmtleXMpIHtcbiAgYXJyYXlJdGVyYXRvciA9IFtdLmtleXMoKTtcbiAgLy8gU2FmYXJpIDggaGFzIGJ1Z2d5IGl0ZXJhdG9ycyB3L28gYG5leHRgXG4gIGlmICghKCduZXh0JyBpbiBhcnJheUl0ZXJhdG9yKSkgQlVHR1lfU0FGQVJJX0lURVJBVE9SUyA9IHRydWU7XG4gIGVsc2Uge1xuICAgIFByb3RvdHlwZU9mQXJyYXlJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvdHlwZU9mKGdldFByb3RvdHlwZU9mKGFycmF5SXRlcmF0b3IpKTtcbiAgICBpZiAoUHJvdG90eXBlT2ZBcnJheUl0ZXJhdG9yUHJvdG90eXBlICE9PSBPYmplY3QucHJvdG90eXBlKSBJdGVyYXRvclByb3RvdHlwZSA9IFByb3RvdHlwZU9mQXJyYXlJdGVyYXRvclByb3RvdHlwZTtcbiAgfVxufVxuXG52YXIgTkVXX0lURVJBVE9SX1BST1RPVFlQRSA9IEl0ZXJhdG9yUHJvdG90eXBlID09IHVuZGVmaW5lZCB8fCBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciB0ZXN0ID0ge307XG4gIC8vIEZGNDQtIGxlZ2FjeSBpdGVyYXRvcnMgY2FzZVxuICByZXR1cm4gSXRlcmF0b3JQcm90b3R5cGVbSVRFUkFUT1JdLmNhbGwodGVzdCkgIT09IHRlc3Q7XG59KTtcblxuaWYgKE5FV19JVEVSQVRPUl9QUk9UT1RZUEUpIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG5cbi8vIGAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0laXRlcmF0b3Jwcm90b3R5cGUlLUBAaXRlcmF0b3JcbmlmICgoIUlTX1BVUkUgfHwgTkVXX0lURVJBVE9SX1BST1RPVFlQRSkgJiYgIWhhcyhJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IpKSB7XG4gIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShJdGVyYXRvclByb3RvdHlwZSwgSVRFUkFUT1IsIHJldHVyblRoaXMpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgSXRlcmF0b3JQcm90b3R5cGU6IEl0ZXJhdG9yUHJvdG90eXBlLFxuICBCVUdHWV9TQUZBUklfSVRFUkFUT1JTOiBCVUdHWV9TQUZBUklfSVRFUkFUT1JTXG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpLmY7XG52YXIgbWFjcm90YXNrID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3Rhc2snKS5zZXQ7XG52YXIgSVNfSU9TID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS1pcy1pb3MnKTtcbnZhciBJU19JT1NfUEVCQkxFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS1pcy1pb3MtcGViYmxlJyk7XG52YXIgSVNfV0VCT1NfV0VCS0lUID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS1pcy13ZWJvcy13ZWJraXQnKTtcbnZhciBJU19OT0RFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS1pcy1ub2RlJyk7XG5cbnZhciBNdXRhdGlvbk9ic2VydmVyID0gZ2xvYmFsLk11dGF0aW9uT2JzZXJ2ZXIgfHwgZ2xvYmFsLldlYktpdE11dGF0aW9uT2JzZXJ2ZXI7XG52YXIgZG9jdW1lbnQgPSBnbG9iYWwuZG9jdW1lbnQ7XG52YXIgcHJvY2VzcyA9IGdsb2JhbC5wcm9jZXNzO1xudmFyIFByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcbi8vIE5vZGUuanMgMTEgc2hvd3MgRXhwZXJpbWVudGFsV2FybmluZyBvbiBnZXR0aW5nIGBxdWV1ZU1pY3JvdGFza2BcbnZhciBxdWV1ZU1pY3JvdGFza0Rlc2NyaXB0b3IgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZ2xvYmFsLCAncXVldWVNaWNyb3Rhc2snKTtcbnZhciBxdWV1ZU1pY3JvdGFzayA9IHF1ZXVlTWljcm90YXNrRGVzY3JpcHRvciAmJiBxdWV1ZU1pY3JvdGFza0Rlc2NyaXB0b3IudmFsdWU7XG5cbnZhciBmbHVzaCwgaGVhZCwgbGFzdCwgbm90aWZ5LCB0b2dnbGUsIG5vZGUsIHByb21pc2UsIHRoZW47XG5cbi8vIG1vZGVybiBlbmdpbmVzIGhhdmUgcXVldWVNaWNyb3Rhc2sgbWV0aG9kXG5pZiAoIXF1ZXVlTWljcm90YXNrKSB7XG4gIGZsdXNoID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXJlbnQsIGZuO1xuICAgIGlmIChJU19OT0RFICYmIChwYXJlbnQgPSBwcm9jZXNzLmRvbWFpbikpIHBhcmVudC5leGl0KCk7XG4gICAgd2hpbGUgKGhlYWQpIHtcbiAgICAgIGZuID0gaGVhZC5mbjtcbiAgICAgIGhlYWQgPSBoZWFkLm5leHQ7XG4gICAgICB0cnkge1xuICAgICAgICBmbigpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGhlYWQpIG5vdGlmeSgpO1xuICAgICAgICBlbHNlIGxhc3QgPSB1bmRlZmluZWQ7XG4gICAgICAgIHRocm93IGVycm9yO1xuICAgICAgfVxuICAgIH0gbGFzdCA9IHVuZGVmaW5lZDtcbiAgICBpZiAocGFyZW50KSBwYXJlbnQuZW50ZXIoKTtcbiAgfTtcblxuICAvLyBicm93c2VycyB3aXRoIE11dGF0aW9uT2JzZXJ2ZXIsIGV4Y2VwdCBpT1MgLSBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMzM5XG4gIC8vIGFsc28gZXhjZXB0IFdlYk9TIFdlYmtpdCBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODk4XG4gIGlmICghSVNfSU9TICYmICFJU19OT0RFICYmICFJU19XRUJPU19XRUJLSVQgJiYgTXV0YXRpb25PYnNlcnZlciAmJiBkb2N1bWVudCkge1xuICAgIHRvZ2dsZSA9IHRydWU7XG4gICAgbm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcnKTtcbiAgICBuZXcgTXV0YXRpb25PYnNlcnZlcihmbHVzaCkub2JzZXJ2ZShub2RlLCB7IGNoYXJhY3RlckRhdGE6IHRydWUgfSk7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgbm9kZS5kYXRhID0gdG9nZ2xlID0gIXRvZ2dsZTtcbiAgICB9O1xuICAvLyBlbnZpcm9ubWVudHMgd2l0aCBtYXliZSBub24tY29tcGxldGVseSBjb3JyZWN0LCBidXQgZXhpc3RlbnQgUHJvbWlzZVxuICB9IGVsc2UgaWYgKCFJU19JT1NfUEVCQkxFICYmIFByb21pc2UgJiYgUHJvbWlzZS5yZXNvbHZlKSB7XG4gICAgLy8gUHJvbWlzZS5yZXNvbHZlIHdpdGhvdXQgYW4gYXJndW1lbnQgdGhyb3dzIGFuIGVycm9yIGluIExHIFdlYk9TIDJcbiAgICBwcm9taXNlID0gUHJvbWlzZS5yZXNvbHZlKHVuZGVmaW5lZCk7XG4gICAgLy8gd29ya2Fyb3VuZCBvZiBXZWJLaXQgfiBpT1MgU2FmYXJpIDEwLjEgYnVnXG4gICAgcHJvbWlzZS5jb25zdHJ1Y3RvciA9IFByb21pc2U7XG4gICAgdGhlbiA9IHByb21pc2UudGhlbjtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aGVuLmNhbGwocHJvbWlzZSwgZmx1c2gpO1xuICAgIH07XG4gIC8vIE5vZGUuanMgd2l0aG91dCBwcm9taXNlc1xuICB9IGVsc2UgaWYgKElTX05PREUpIHtcbiAgICBub3RpZnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBwcm9jZXNzLm5leHRUaWNrKGZsdXNoKTtcbiAgICB9O1xuICAvLyBmb3Igb3RoZXIgZW52aXJvbm1lbnRzIC0gbWFjcm90YXNrIGJhc2VkIG9uOlxuICAvLyAtIHNldEltbWVkaWF0ZVxuICAvLyAtIE1lc3NhZ2VDaGFubmVsXG4gIC8vIC0gd2luZG93LnBvc3RNZXNzYWdcbiAgLy8gLSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gLSBzZXRUaW1lb3V0XG4gIH0gZWxzZSB7XG4gICAgbm90aWZ5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gc3RyYW5nZSBJRSArIHdlYnBhY2sgZGV2IHNlcnZlciBidWcgLSB1c2UgLmNhbGwoZ2xvYmFsKVxuICAgICAgbWFjcm90YXNrLmNhbGwoZ2xvYmFsLCBmbHVzaCk7XG4gICAgfTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHF1ZXVlTWljcm90YXNrIHx8IGZ1bmN0aW9uIChmbikge1xuICB2YXIgdGFzayA9IHsgZm46IGZuLCBuZXh0OiB1bmRlZmluZWQgfTtcbiAgaWYgKGxhc3QpIGxhc3QubmV4dCA9IHRhc2s7XG4gIGlmICghaGVhZCkge1xuICAgIGhlYWQgPSB0YXNrO1xuICAgIG5vdGlmeSgpO1xuICB9IGxhc3QgPSB0YXNrO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsLlByb21pc2U7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBlcy9uby1zeW1ib2wgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmcgKi9cbnZhciBWOF9WRVJTSU9OID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS12OC12ZXJzaW9uJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eXN5bWJvbHMgLS0gcmVxdWlyZWQgZm9yIHRlc3Rpbmdcbm1vZHVsZS5leHBvcnRzID0gISFPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzICYmICFmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHZhciBzeW1ib2wgPSBTeW1ib2woKTtcbiAgLy8gQ2hyb21lIDM4IFN5bWJvbCBoYXMgaW5jb3JyZWN0IHRvU3RyaW5nIGNvbnZlcnNpb25cbiAgLy8gYGdldC1vd24tcHJvcGVydHktc3ltYm9sc2AgcG9seWZpbGwgc3ltYm9scyBjb252ZXJ0ZWQgdG8gb2JqZWN0IGFyZSBub3QgU3ltYm9sIGluc3RhbmNlc1xuICByZXR1cm4gIVN0cmluZyhzeW1ib2wpIHx8ICEoT2JqZWN0KHN5bWJvbCkgaW5zdGFuY2VvZiBTeW1ib2wpIHx8XG4gICAgLy8gQ2hyb21lIDM4LTQwIHN5bWJvbHMgYXJlIG5vdCBpbmhlcml0ZWQgZnJvbSBET00gY29sbGVjdGlvbnMgcHJvdG90eXBlcyB0byBpbnN0YW5jZXNcbiAgICAhU3ltYm9sLnNoYW0gJiYgVjhfVkVSU0lPTiAmJiBWOF9WRVJTSU9OIDwgNDE7XG59KTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xuXG52YXIgV2Vha01hcCA9IGdsb2JhbC5XZWFrTWFwO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHR5cGVvZiBXZWFrTWFwID09PSAnZnVuY3Rpb24nICYmIC9uYXRpdmUgY29kZS8udGVzdChpbnNwZWN0U291cmNlKFdlYWtNYXApKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYS1mdW5jdGlvbicpO1xuXG52YXIgUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoQykge1xuICB2YXIgcmVzb2x2ZSwgcmVqZWN0O1xuICB0aGlzLnByb21pc2UgPSBuZXcgQyhmdW5jdGlvbiAoJCRyZXNvbHZlLCAkJHJlamVjdCkge1xuICAgIGlmIChyZXNvbHZlICE9PSB1bmRlZmluZWQgfHwgcmVqZWN0ICE9PSB1bmRlZmluZWQpIHRocm93IFR5cGVFcnJvcignQmFkIFByb21pc2UgY29uc3RydWN0b3InKTtcbiAgICByZXNvbHZlID0gJCRyZXNvbHZlO1xuICAgIHJlamVjdCA9ICQkcmVqZWN0O1xuICB9KTtcbiAgdGhpcy5yZXNvbHZlID0gYUZ1bmN0aW9uKHJlc29sdmUpO1xuICB0aGlzLnJlamVjdCA9IGFGdW5jdGlvbihyZWplY3QpO1xufTtcblxuLy8gYE5ld1Byb21pc2VDYXBhYmlsaXR5YCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtbmV3cHJvbWlzZWNhcGFiaWxpdHlcbm1vZHVsZS5leHBvcnRzLmYgPSBmdW5jdGlvbiAoQykge1xuICByZXR1cm4gbmV3IFByb21pc2VDYXBhYmlsaXR5KEMpO1xufTtcbiIsInZhciBpc1JlZ0V4cCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1yZWdleHAnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGlzUmVnRXhwKGl0KSkge1xuICAgIHRocm93IFR5cGVFcnJvcihcIlRoZSBtZXRob2QgZG9lc24ndCBhY2NlcHQgcmVndWxhciBleHByZXNzaW9uc1wiKTtcbiAgfSByZXR1cm4gaXQ7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciB0b1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1zdHJpbmcnKTtcbnZhciB0cmltID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N0cmluZy10cmltJykudHJpbTtcbnZhciB3aGl0ZXNwYWNlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93aGl0ZXNwYWNlcycpO1xuXG52YXIgJHBhcnNlSW50ID0gZ2xvYmFsLnBhcnNlSW50O1xudmFyIGhleCA9IC9eWystXT8wW1h4XS87XG52YXIgRk9SQ0VEID0gJHBhcnNlSW50KHdoaXRlc3BhY2VzICsgJzA4JykgIT09IDggfHwgJHBhcnNlSW50KHdoaXRlc3BhY2VzICsgJzB4MTYnKSAhPT0gMjI7XG5cbi8vIGBwYXJzZUludGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXBhcnNlaW50LXN0cmluZy1yYWRpeFxubW9kdWxlLmV4cG9ydHMgPSBGT1JDRUQgPyBmdW5jdGlvbiBwYXJzZUludChzdHJpbmcsIHJhZGl4KSB7XG4gIHZhciBTID0gdHJpbSh0b1N0cmluZyhzdHJpbmcpKTtcbiAgcmV0dXJuICRwYXJzZUludChTLCAocmFkaXggPj4+IDApIHx8IChoZXgudGVzdChTKSA/IDE2IDogMTApKTtcbn0gOiAkcGFyc2VJbnQ7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIG9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktc3ltYm9scycpO1xudmFyIHByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1wcm9wZXJ0eS1pcy1lbnVtZXJhYmxlJyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWFzc2lnbiAtLSBzYWZlXG52YXIgJGFzc2lnbiA9IE9iamVjdC5hc3NpZ247XG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG52YXIgZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbi8vIGBPYmplY3QuYXNzaWduYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmFzc2lnblxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIHNob3VsZCBoYXZlIGNvcnJlY3Qgb3JkZXIgb2Ygb3BlcmF0aW9ucyAoRWRnZSBidWcpXG4gIGlmIChERVNDUklQVE9SUyAmJiAkYXNzaWduKHsgYjogMSB9LCAkYXNzaWduKGRlZmluZVByb3BlcnR5KHt9LCAnYScsIHtcbiAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgZGVmaW5lUHJvcGVydHkodGhpcywgJ2InLCB7XG4gICAgICAgIHZhbHVlOiAzLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuICB9KSwgeyBiOiAyIH0pKS5iICE9PSAxKSByZXR1cm4gdHJ1ZTtcbiAgLy8gc2hvdWxkIHdvcmsgd2l0aCBzeW1ib2xzIGFuZCBzaG91bGQgaGF2ZSBkZXRlcm1pbmlzdGljIHByb3BlcnR5IG9yZGVyIChWOCBidWcpXG4gIHZhciBBID0ge307XG4gIHZhciBCID0ge307XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1zeW1ib2wgLS0gc2FmZVxuICB2YXIgc3ltYm9sID0gU3ltYm9sKCk7XG4gIHZhciBhbHBoYWJldCA9ICdhYmNkZWZnaGlqa2xtbm9wcXJzdCc7XG4gIEFbc3ltYm9sXSA9IDc7XG4gIGFscGhhYmV0LnNwbGl0KCcnKS5mb3JFYWNoKGZ1bmN0aW9uIChjaHIpIHsgQltjaHJdID0gY2hyOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW3N5bWJvbF0gIT0gNyB8fCBvYmplY3RLZXlzKCRhc3NpZ24oe30sIEIpKS5qb2luKCcnKSAhPSBhbHBoYWJldDtcbn0pID8gZnVuY3Rpb24gYXNzaWduKHRhcmdldCwgc291cmNlKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnMgLS0gcmVxdWlyZWQgZm9yIGAubGVuZ3RoYFxuICB2YXIgVCA9IHRvT2JqZWN0KHRhcmdldCk7XG4gIHZhciBhcmd1bWVudHNMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAxO1xuICB2YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlLmY7XG4gIHZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlLmY7XG4gIHdoaWxlIChhcmd1bWVudHNMZW5ndGggPiBpbmRleCkge1xuICAgIHZhciBTID0gSW5kZXhlZE9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pO1xuICAgIHZhciBrZXlzID0gZ2V0T3duUHJvcGVydHlTeW1ib2xzID8gb2JqZWN0S2V5cyhTKS5jb25jYXQoZ2V0T3duUHJvcGVydHlTeW1ib2xzKFMpKSA6IG9iamVjdEtleXMoUyk7XG4gICAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICAgIHZhciBqID0gMDtcbiAgICB2YXIga2V5O1xuICAgIHdoaWxlIChsZW5ndGggPiBqKSB7XG4gICAgICBrZXkgPSBrZXlzW2orK107XG4gICAgICBpZiAoIURFU0NSSVBUT1JTIHx8IHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoUywga2V5KSkgVFtrZXldID0gU1trZXldO1xuICAgIH1cbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduO1xuIiwiLyogZ2xvYmFsIEFjdGl2ZVhPYmplY3QgLS0gb2xkIElFLCBXU0ggKi9cbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBkZWZpbmVQcm9wZXJ0aWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydGllcycpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcbnZhciBoaWRkZW5LZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hpZGRlbi1rZXlzJyk7XG52YXIgaHRtbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9odG1sJyk7XG52YXIgZG9jdW1lbnRDcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG52YXIgc2hhcmVkS2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NoYXJlZC1rZXknKTtcblxudmFyIEdUID0gJz4nO1xudmFyIExUID0gJzwnO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIFNDUklQVCA9ICdzY3JpcHQnO1xudmFyIElFX1BST1RPID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xuXG52YXIgRW1wdHlDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfTtcblxudmFyIHNjcmlwdFRhZyA9IGZ1bmN0aW9uIChjb250ZW50KSB7XG4gIHJldHVybiBMVCArIFNDUklQVCArIEdUICsgY29udGVudCArIExUICsgJy8nICsgU0NSSVBUICsgR1Q7XG59O1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgQWN0aXZlWCBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIE51bGxQcm90b09iamVjdFZpYUFjdGl2ZVggPSBmdW5jdGlvbiAoYWN0aXZlWERvY3VtZW50KSB7XG4gIGFjdGl2ZVhEb2N1bWVudC53cml0ZShzY3JpcHRUYWcoJycpKTtcbiAgYWN0aXZlWERvY3VtZW50LmNsb3NlKCk7XG4gIHZhciB0ZW1wID0gYWN0aXZlWERvY3VtZW50LnBhcmVudFdpbmRvdy5PYmplY3Q7XG4gIGFjdGl2ZVhEb2N1bWVudCA9IG51bGw7IC8vIGF2b2lkIG1lbW9yeSBsZWFrXG4gIHJldHVybiB0ZW1wO1xufTtcblxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGZha2UgYG51bGxgIHByb3RvdHlwZTogdXNlIGlmcmFtZSBPYmplY3Qgd2l0aCBjbGVhcmVkIHByb3RvdHlwZVxudmFyIE51bGxQcm90b09iamVjdFZpYUlGcmFtZSA9IGZ1bmN0aW9uICgpIHtcbiAgLy8gVGhyYXNoLCB3YXN0ZSBhbmQgc29kb215OiBJRSBHQyBidWdcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50Q3JlYXRlRWxlbWVudCgnaWZyYW1lJyk7XG4gIHZhciBKUyA9ICdqYXZhJyArIFNDUklQVCArICc6JztcbiAgdmFyIGlmcmFtZURvY3VtZW50O1xuICBpZiAoaWZyYW1lLnN0eWxlKSB7XG4gICAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgaHRtbC5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy80NzVcbiAgICBpZnJhbWUuc3JjID0gU3RyaW5nKEpTKTtcbiAgICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xuICAgIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcbiAgICBpZnJhbWVEb2N1bWVudC53cml0ZShzY3JpcHRUYWcoJ2RvY3VtZW50LkY9T2JqZWN0JykpO1xuICAgIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gICAgcmV0dXJuIGlmcmFtZURvY3VtZW50LkY7XG4gIH1cbn07XG5cbi8vIENoZWNrIGZvciBkb2N1bWVudC5kb21haW4gYW5kIGFjdGl2ZSB4IHN1cHBvcnRcbi8vIE5vIG5lZWQgdG8gdXNlIGFjdGl2ZSB4IGFwcHJvYWNoIHdoZW4gZG9jdW1lbnQuZG9tYWluIGlzIG5vdCBzZXRcbi8vIHNlZSBodHRwczovL2dpdGh1Yi5jb20vZXMtc2hpbXMvZXM1LXNoaW0vaXNzdWVzLzE1MFxuLy8gdmFyaWF0aW9uIG9mIGh0dHBzOi8vZ2l0aHViLmNvbS9raXRjYW1icmlkZ2UvZXM1LXNoaW0vY29tbWl0LzRmNzM4YWMwNjYzNDZcbi8vIGF2b2lkIElFIEdDIGJ1Z1xudmFyIGFjdGl2ZVhEb2N1bWVudDtcbnZhciBOdWxsUHJvdG9PYmplY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgYWN0aXZlWERvY3VtZW50ID0gbmV3IEFjdGl2ZVhPYmplY3QoJ2h0bWxmaWxlJyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGlnbm9yZSAqLyB9XG4gIE51bGxQcm90b09iamVjdCA9IGRvY3VtZW50LmRvbWFpbiAmJiBhY3RpdmVYRG9jdW1lbnQgP1xuICAgIE51bGxQcm90b09iamVjdFZpYUFjdGl2ZVgoYWN0aXZlWERvY3VtZW50KSA6IC8vIG9sZCBJRVxuICAgIE51bGxQcm90b09iamVjdFZpYUlGcmFtZSgpIHx8XG4gICAgTnVsbFByb3RvT2JqZWN0VmlhQWN0aXZlWChhY3RpdmVYRG9jdW1lbnQpOyAvLyBXU0hcbiAgdmFyIGxlbmd0aCA9IGVudW1CdWdLZXlzLmxlbmd0aDtcbiAgd2hpbGUgKGxlbmd0aC0tKSBkZWxldGUgTnVsbFByb3RvT2JqZWN0W1BST1RPVFlQRV1bZW51bUJ1Z0tleXNbbGVuZ3RoXV07XG4gIHJldHVybiBOdWxsUHJvdG9PYmplY3QoKTtcbn07XG5cbmhpZGRlbktleXNbSUVfUFJPVE9dID0gdHJ1ZTtcblxuLy8gYE9iamVjdC5jcmVhdGVgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuY3JlYXRlXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpIHtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKE8gIT09IG51bGwpIHtcbiAgICBFbXB0eUNvbnN0cnVjdG9yW1BST1RPVFlQRV0gPSBhbk9iamVjdChPKTtcbiAgICByZXN1bHQgPSBuZXcgRW1wdHlDb25zdHJ1Y3RvcigpO1xuICAgIEVtcHR5Q29uc3RydWN0b3JbUFJPVE9UWVBFXSA9IG51bGw7XG4gICAgLy8gYWRkIFwiX19wcm90b19fXCIgZm9yIE9iamVjdC5nZXRQcm90b3R5cGVPZiBwb2x5ZmlsbFxuICAgIHJlc3VsdFtJRV9QUk9UT10gPSBPO1xuICB9IGVsc2UgcmVzdWx0ID0gTnVsbFByb3RvT2JqZWN0KCk7XG4gIHJldHVybiBQcm9wZXJ0aWVzID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiBkZWZpbmVQcm9wZXJ0aWVzKHJlc3VsdCwgUHJvcGVydGllcyk7XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgZGVmaW5lUHJvcGVydHlNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xudmFyIG9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMnKTtcblxuLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnRpZXNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZGVmaW5lcHJvcGVydGllcyAtLSBzYWZlXG5tb2R1bGUuZXhwb3J0cyA9IERFU0NSSVBUT1JTID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgOiBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKE8sIFByb3BlcnRpZXMpIHtcbiAgYW5PYmplY3QoTyk7XG4gIHZhciBrZXlzID0gb2JqZWN0S2V5cyhQcm9wZXJ0aWVzKTtcbiAgdmFyIGxlbmd0aCA9IGtleXMubGVuZ3RoO1xuICB2YXIgaW5kZXggPSAwO1xuICB2YXIga2V5O1xuICB3aGlsZSAobGVuZ3RoID4gaW5kZXgpIGRlZmluZVByb3BlcnR5TW9kdWxlLmYoTywga2V5ID0ga2V5c1tpbmRleCsrXSwgUHJvcGVydGllc1trZXldKTtcbiAgcmV0dXJuIE87XG59O1xuIiwidmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaWU4LWRvbS1kZWZpbmUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b1Byb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleScpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWRlZmluZXByb3BlcnR5IC0tIHNhZmVcbnZhciAkZGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbi8vIGBPYmplY3QuZGVmaW5lUHJvcGVydHlgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZGVmaW5lcHJvcGVydHlcbmV4cG9ydHMuZiA9IERFU0NSSVBUT1JTID8gJGRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcykge1xuICBhbk9iamVjdChPKTtcbiAgUCA9IHRvUHJvcGVydHlLZXkoUCk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoSUU4X0RPTV9ERUZJTkUpIHRyeSB7XG4gICAgcmV0dXJuICRkZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuICBpZiAoJ2dldCcgaW4gQXR0cmlidXRlcyB8fCAnc2V0JyBpbiBBdHRyaWJ1dGVzKSB0aHJvdyBUeXBlRXJyb3IoJ0FjY2Vzc29ycyBub3Qgc3VwcG9ydGVkJyk7XG4gIGlmICgndmFsdWUnIGluIEF0dHJpYnV0ZXMpIE9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07XG4iLCJ2YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZScpO1xudmFyIGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtcHJvcGVydHktZGVzY3JpcHRvcicpO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvUHJvcGVydHlLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tcHJvcGVydHkta2V5Jyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIElFOF9ET01fREVGSU5FID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2llOC1kb20tZGVmaW5lJyk7XG5cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yIC0tIHNhZmVcbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yXG5leHBvcnRzLmYgPSBERVNDUklQVE9SUyA/ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUCkge1xuICBPID0gdG9JbmRleGVkT2JqZWN0KE8pO1xuICBQID0gdG9Qcm9wZXJ0eUtleShQKTtcbiAgaWYgKElFOF9ET01fREVGSU5FKSB0cnkge1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApO1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIGlmIChoYXMoTywgUCkpIHJldHVybiBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoIXByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlLmYuY2FsbChPLCBQKSwgT1tQXSk7XG59O1xuIiwiLyogZXNsaW50LWRpc2FibGUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5bmFtZXMgLS0gc2FmZSAqL1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzJykuZjtcblxudmFyIHRvU3RyaW5nID0ge30udG9TdHJpbmc7XG5cbnZhciB3aW5kb3dOYW1lcyA9IHR5cGVvZiB3aW5kb3cgPT0gJ29iamVjdCcgJiYgd2luZG93ICYmIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzXG4gID8gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMod2luZG93KSA6IFtdO1xuXG52YXIgZ2V0V2luZG93TmFtZXMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5TmFtZXMoaXQpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB3aW5kb3dOYW1lcy5zbGljZSgpO1xuICB9XG59O1xuXG4vLyBmYWxsYmFjayBmb3IgSUUxMSBidWdneSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB3aXRoIGlmcmFtZSBhbmQgd2luZG93XG5tb2R1bGUuZXhwb3J0cy5mID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCkge1xuICByZXR1cm4gd2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XSdcbiAgICA/IGdldFdpbmRvd05hbWVzKGl0KVxuICAgIDogJGdldE93blByb3BlcnR5TmFtZXModG9JbmRleGVkT2JqZWN0KGl0KSk7XG59O1xuIiwidmFyIGludGVybmFsT2JqZWN0S2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cy1pbnRlcm5hbCcpO1xudmFyIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VudW0tYnVnLWtleXMnKTtcblxudmFyIGhpZGRlbktleXMgPSBlbnVtQnVnS2V5cy5jb25jYXQoJ2xlbmd0aCcsICdwcm90b3R5cGUnKTtcblxuLy8gYE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmdldG93bnByb3BlcnR5bmFtZXNcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHluYW1lcyAtLSBzYWZlXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyB8fCBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eU5hbWVzKE8pIHtcbiAgcmV0dXJuIGludGVybmFsT2JqZWN0S2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07XG4iLCIvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWdldG93bnByb3BlcnR5c3ltYm9scyAtLSBzYWZlXG5leHBvcnRzLmYgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuIiwidmFyIGhhcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9oYXMnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciBzaGFyZWRLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLWtleScpO1xudmFyIENPUlJFQ1RfUFJPVE9UWVBFX0dFVFRFUiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jb3JyZWN0LXByb3RvdHlwZS1nZXR0ZXInKTtcblxudmFyIElFX1BST1RPID0gc2hhcmVkS2V5KCdJRV9QUk9UTycpO1xudmFyIE9iamVjdFByb3RvdHlwZSA9IE9iamVjdC5wcm90b3R5cGU7XG5cbi8vIGBPYmplY3QuZ2V0UHJvdG90eXBlT2ZgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0cHJvdG90eXBlb2Zcbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0cHJvdG90eXBlb2YgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBDT1JSRUNUX1BST1RPVFlQRV9HRVRURVIgPyBPYmplY3QuZ2V0UHJvdG90eXBlT2YgOiBmdW5jdGlvbiAoTykge1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmIChoYXMoTywgSUVfUFJPVE8pKSByZXR1cm4gT1tJRV9QUk9UT107XG4gIGlmICh0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKSB7XG4gICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xuICB9IHJldHVybiBPIGluc3RhbmNlb2YgT2JqZWN0ID8gT2JqZWN0UHJvdG90eXBlIDogbnVsbDtcbn07XG4iLCJ2YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIGluZGV4T2YgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaW5jbHVkZXMnKS5pbmRleE9mO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAob2JqZWN0LCBuYW1lcykge1xuICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdChvYmplY3QpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgdmFyIGtleTtcbiAgZm9yIChrZXkgaW4gTykgIWhhcyhoaWRkZW5LZXlzLCBrZXkpICYmIGhhcyhPLCBrZXkpICYmIHJlc3VsdC5wdXNoKGtleSk7XG4gIC8vIERvbid0IGVudW0gYnVnICYgaGlkZGVuIGtleXNcbiAgd2hpbGUgKG5hbWVzLmxlbmd0aCA+IGkpIGlmIChoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpIHtcbiAgICB+aW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciBpbnRlcm5hbE9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMtaW50ZXJuYWwnKTtcbnZhciBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbnVtLWJ1Zy1rZXlzJyk7XG5cbi8vIGBPYmplY3Qua2V5c2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5rZXlzXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWtleXMgLS0gc2FmZVxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pIHtcbiAgcmV0dXJuIGludGVybmFsT2JqZWN0S2V5cyhPLCBlbnVtQnVnS2V5cyk7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1nZXRvd25wcm9wZXJ0eWRlc2NyaXB0b3IgLS0gc2FmZVxudmFyIGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbi8vIE5hc2hvcm4gfiBKREs4IGJ1Z1xudmFyIE5BU0hPUk5fQlVHID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICYmICEkcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbCh7IDE6IDIgfSwgMSk7XG5cbi8vIGBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlYCBtZXRob2QgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eWlzZW51bWVyYWJsZVxuZXhwb3J0cy5mID0gTkFTSE9STl9CVUcgPyBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShWKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRoaXMsIFYpO1xuICByZXR1cm4gISFkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IuZW51bWVyYWJsZTtcbn0gOiAkcHJvcGVydHlJc0VudW1lcmFibGU7XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAtLSBzYWZlICovXG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgYVBvc3NpYmxlUHJvdG90eXBlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtcG9zc2libGUtcHJvdG90eXBlJyk7XG5cbi8vIGBPYmplY3Quc2V0UHJvdG90eXBlT2ZgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3Quc2V0cHJvdG90eXBlb2Zcbi8vIFdvcmtzIHdpdGggX19wcm90b19fIG9ubHkuIE9sZCB2OCBjYW4ndCB3b3JrIHdpdGggbnVsbCBwcm90byBvYmplY3RzLlxuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1zZXRwcm90b3R5cGVvZiAtLSBzYWZlXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fCAoJ19fcHJvdG9fXycgaW4ge30gPyBmdW5jdGlvbiAoKSB7XG4gIHZhciBDT1JSRUNUX1NFVFRFUiA9IGZhbHNlO1xuICB2YXIgdGVzdCA9IHt9O1xuICB2YXIgc2V0dGVyO1xuICB0cnkge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1vYmplY3QtZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yIC0tIHNhZmVcbiAgICBzZXR0ZXIgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQ7XG4gICAgc2V0dGVyLmNhbGwodGVzdCwgW10pO1xuICAgIENPUlJFQ1RfU0VUVEVSID0gdGVzdCBpbnN0YW5jZW9mIEFycmF5O1xuICB9IGNhdGNoIChlcnJvcikgeyAvKiBlbXB0eSAqLyB9XG4gIHJldHVybiBmdW5jdGlvbiBzZXRQcm90b3R5cGVPZihPLCBwcm90bykge1xuICAgIGFuT2JqZWN0KE8pO1xuICAgIGFQb3NzaWJsZVByb3RvdHlwZShwcm90byk7XG4gICAgaWYgKENPUlJFQ1RfU0VUVEVSKSBzZXR0ZXIuY2FsbChPLCBwcm90byk7XG4gICAgZWxzZSBPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgIHJldHVybiBPO1xuICB9O1xufSgpIDogdW5kZWZpbmVkKTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIG9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMnKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZScpLmY7XG5cbi8vIGBPYmplY3QueyBlbnRyaWVzLCB2YWx1ZXMgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uIChUT19FTlRSSUVTKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoaXQpIHtcbiAgICB2YXIgTyA9IHRvSW5kZXhlZE9iamVjdChpdCk7XG4gICAgdmFyIGtleXMgPSBvYmplY3RLZXlzKE8pO1xuICAgIHZhciBsZW5ndGggPSBrZXlzLmxlbmd0aDtcbiAgICB2YXIgaSA9IDA7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBrZXk7XG4gICAgd2hpbGUgKGxlbmd0aCA+IGkpIHtcbiAgICAgIGtleSA9IGtleXNbaSsrXTtcbiAgICAgIGlmICghREVTQ1JJUFRPUlMgfHwgcHJvcGVydHlJc0VudW1lcmFibGUuY2FsbChPLCBrZXkpKSB7XG4gICAgICAgIHJlc3VsdC5wdXNoKFRPX0VOVFJJRVMgPyBba2V5LCBPW2tleV1dIDogT1trZXldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgT2JqZWN0LmVudHJpZXNgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5lbnRyaWVzXG4gIGVudHJpZXM6IGNyZWF0ZU1ldGhvZCh0cnVlKSxcbiAgLy8gYE9iamVjdC52YWx1ZXNgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC52YWx1ZXNcbiAgdmFsdWVzOiBjcmVhdGVNZXRob2QoZmFsc2UpXG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIFRPX1NUUklOR19UQUdfU1VQUE9SVCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1zdHJpbmctdGFnLXN1cHBvcnQnKTtcbnZhciBjbGFzc29mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NsYXNzb2YnKTtcblxuLy8gYE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmdgIG1ldGhvZCBpbXBsZW1lbnRhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nXG5tb2R1bGUuZXhwb3J0cyA9IFRPX1NUUklOR19UQUdfU1VQUE9SVCA/IHt9LnRvU3RyaW5nIDogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gIHJldHVybiAnW29iamVjdCAnICsgY2xhc3NvZih0aGlzKSArICddJztcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG5cbi8vIGBPcmRpbmFyeVRvUHJpbWl0aXZlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb3JkaW5hcnl0b3ByaW1pdGl2ZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaW5wdXQsIHByZWYpIHtcbiAgdmFyIGZuLCB2YWw7XG4gIGlmIChwcmVmID09PSAnc3RyaW5nJyAmJiB0eXBlb2YgKGZuID0gaW5wdXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgaWYgKHR5cGVvZiAoZm4gPSBpbnB1dC52YWx1ZU9mKSA9PSAnZnVuY3Rpb24nICYmICFpc09iamVjdCh2YWwgPSBmbi5jYWxsKGlucHV0KSkpIHJldHVybiB2YWw7XG4gIGlmIChwcmVmICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgKGZuID0gaW5wdXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaW5wdXQpKSkgcmV0dXJuIHZhbDtcbiAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xufTtcbiIsInZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIGdldE93blByb3BlcnR5TmFtZXNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktbmFtZXMnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktc3ltYm9scycpO1xudmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLW9iamVjdCcpO1xuXG4vLyBhbGwgb2JqZWN0IGtleXMsIGluY2x1ZGVzIG5vbi1lbnVtZXJhYmxlIGFuZCBzeW1ib2xzXG5tb2R1bGUuZXhwb3J0cyA9IGdldEJ1aWx0SW4oJ1JlZmxlY3QnLCAnb3duS2V5cycpIHx8IGZ1bmN0aW9uIG93bktleXMoaXQpIHtcbiAgdmFyIGtleXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzTW9kdWxlLmYoYW5PYmplY3QoaXQpKTtcbiAgdmFyIGdldE93blByb3BlcnR5U3ltYm9scyA9IGdldE93blByb3BlcnR5U3ltYm9sc01vZHVsZS5mO1xuICByZXR1cm4gZ2V0T3duUHJvcGVydHlTeW1ib2xzID8ga2V5cy5jb25jYXQoZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KSkgOiBrZXlzO1xufTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZ2xvYmFsO1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZXhlYykge1xuICB0cnkge1xuICAgIHJldHVybiB7IGVycm9yOiBmYWxzZSwgdmFsdWU6IGV4ZWMoKSB9O1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJldHVybiB7IGVycm9yOiB0cnVlLCB2YWx1ZTogZXJyb3IgfTtcbiAgfVxufTtcbiIsInZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uZXctcHJvbWlzZS1jYXBhYmlsaXR5Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKEMsIHgpIHtcbiAgYW5PYmplY3QoQyk7XG4gIGlmIChpc09iamVjdCh4KSAmJiB4LmNvbnN0cnVjdG9yID09PSBDKSByZXR1cm4geDtcbiAgdmFyIHByb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHkuZihDKTtcbiAgdmFyIHJlc29sdmUgPSBwcm9taXNlQ2FwYWJpbGl0eS5yZXNvbHZlO1xuICByZXNvbHZlKHgpO1xuICByZXR1cm4gcHJvbWlzZUNhcGFiaWxpdHkucHJvbWlzZTtcbn07XG4iLCJ2YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodGFyZ2V0LCBzcmMsIG9wdGlvbnMpIHtcbiAgZm9yICh2YXIga2V5IGluIHNyYykgcmVkZWZpbmUodGFyZ2V0LCBrZXksIHNyY1trZXldLCBvcHRpb25zKTtcbiAgcmV0dXJuIHRhcmdldDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgc2V0R2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC1nbG9iYWwnKTtcbnZhciBpbnNwZWN0U291cmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luc3BlY3Qtc291cmNlJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xuXG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0O1xudmFyIGVuZm9yY2VJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5lbmZvcmNlO1xudmFyIFRFTVBMQVRFID0gU3RyaW5nKFN0cmluZykuc3BsaXQoJ1N0cmluZycpO1xuXG4obW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywga2V5LCB2YWx1ZSwgb3B0aW9ucykge1xuICB2YXIgdW5zYWZlID0gb3B0aW9ucyA/ICEhb3B0aW9ucy51bnNhZmUgOiBmYWxzZTtcbiAgdmFyIHNpbXBsZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMuZW51bWVyYWJsZSA6IGZhbHNlO1xuICB2YXIgbm9UYXJnZXRHZXQgPSBvcHRpb25zID8gISFvcHRpb25zLm5vVGFyZ2V0R2V0IDogZmFsc2U7XG4gIHZhciBzdGF0ZTtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnZnVuY3Rpb24nKSB7XG4gICAgaWYgKHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgJiYgIWhhcyh2YWx1ZSwgJ25hbWUnKSkge1xuICAgICAgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KHZhbHVlLCAnbmFtZScsIGtleSk7XG4gICAgfVxuICAgIHN0YXRlID0gZW5mb3JjZUludGVybmFsU3RhdGUodmFsdWUpO1xuICAgIGlmICghc3RhdGUuc291cmNlKSB7XG4gICAgICBzdGF0ZS5zb3VyY2UgPSBURU1QTEFURS5qb2luKHR5cGVvZiBrZXkgPT0gJ3N0cmluZycgPyBrZXkgOiAnJyk7XG4gICAgfVxuICB9XG4gIGlmIChPID09PSBnbG9iYWwpIHtcbiAgICBpZiAoc2ltcGxlKSBPW2tleV0gPSB2YWx1ZTtcbiAgICBlbHNlIHNldEdsb2JhbChrZXksIHZhbHVlKTtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAoIXVuc2FmZSkge1xuICAgIGRlbGV0ZSBPW2tleV07XG4gIH0gZWxzZSBpZiAoIW5vVGFyZ2V0R2V0ICYmIE9ba2V5XSkge1xuICAgIHNpbXBsZSA9IHRydWU7XG4gIH1cbiAgaWYgKHNpbXBsZSkgT1trZXldID0gdmFsdWU7XG4gIGVsc2UgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5KE8sIGtleSwgdmFsdWUpO1xuLy8gYWRkIGZha2UgRnVuY3Rpb24jdG9TdHJpbmcgZm9yIGNvcnJlY3Qgd29yayB3cmFwcGVkIG1ldGhvZHMgLyBjb25zdHJ1Y3RvcnMgd2l0aCBtZXRob2RzIGxpa2UgTG9EYXNoIGlzTmF0aXZlXG59KShGdW5jdGlvbi5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICByZXR1cm4gdHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyAmJiBnZXRJbnRlcm5hbFN0YXRlKHRoaXMpLnNvdXJjZSB8fCBpbnNwZWN0U291cmNlKHRoaXMpO1xufSk7XG4iLCJ2YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4vY2xhc3NvZi1yYXcnKTtcbnZhciByZWdleHBFeGVjID0gcmVxdWlyZSgnLi9yZWdleHAtZXhlYycpO1xuXG4vLyBgUmVnRXhwRXhlY2AgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXJlZ2V4cGV4ZWNcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKFIsIFMpIHtcbiAgdmFyIGV4ZWMgPSBSLmV4ZWM7XG4gIGlmICh0eXBlb2YgZXhlYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHZhciByZXN1bHQgPSBleGVjLmNhbGwoUiwgUyk7XG4gICAgaWYgKHR5cGVvZiByZXN1bHQgIT09ICdvYmplY3QnKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoJ1JlZ0V4cCBleGVjIG1ldGhvZCByZXR1cm5lZCBzb21ldGhpbmcgb3RoZXIgdGhhbiBhbiBPYmplY3Qgb3IgbnVsbCcpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaWYgKGNsYXNzb2YoUikgIT09ICdSZWdFeHAnKSB7XG4gICAgdGhyb3cgVHlwZUVycm9yKCdSZWdFeHAjZXhlYyBjYWxsZWQgb24gaW5jb21wYXRpYmxlIHJlY2VpdmVyJyk7XG4gIH1cblxuICByZXR1cm4gcmVnZXhwRXhlYy5jYWxsKFIsIFMpO1xufTtcblxuIiwiJ3VzZSBzdHJpY3QnO1xuLyogZXNsaW50LWRpc2FibGUgcmVnZXhwL25vLWFzc2VydGlvbi1jYXB0dXJpbmctZ3JvdXAsIHJlZ2V4cC9uby1lbXB0eS1ncm91cCwgcmVnZXhwL25vLWxhenktZW5kcyAtLSB0ZXN0aW5nICovXG4vKiBlc2xpbnQtZGlzYWJsZSByZWdleHAvbm8tdXNlbGVzcy1xdWFudGlmaWVyIC0tIHRlc3RpbmcgKi9cbnZhciB0b1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1zdHJpbmcnKTtcbnZhciByZWdleHBGbGFncyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZmxhZ3MnKTtcbnZhciBzdGlja3lIZWxwZXJzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZ2V4cC1zdGlja3ktaGVscGVycycpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZScpO1xudmFyIGdldEludGVybmFsU3RhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaW50ZXJuYWwtc3RhdGUnKS5nZXQ7XG52YXIgVU5TVVBQT1JURURfRE9UX0FMTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtdW5zdXBwb3J0ZWQtZG90LWFsbCcpO1xudmFyIFVOU1VQUE9SVEVEX05DRyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtdW5zdXBwb3J0ZWQtbmNnJyk7XG5cbnZhciBuYXRpdmVFeGVjID0gUmVnRXhwLnByb3RvdHlwZS5leGVjO1xudmFyIG5hdGl2ZVJlcGxhY2UgPSBzaGFyZWQoJ25hdGl2ZS1zdHJpbmctcmVwbGFjZScsIFN0cmluZy5wcm90b3R5cGUucmVwbGFjZSk7XG5cbnZhciBwYXRjaGVkRXhlYyA9IG5hdGl2ZUV4ZWM7XG5cbnZhciBVUERBVEVTX0xBU1RfSU5ERVhfV1JPTkcgPSAoZnVuY3Rpb24gKCkge1xuICB2YXIgcmUxID0gL2EvO1xuICB2YXIgcmUyID0gL2IqL2c7XG4gIG5hdGl2ZUV4ZWMuY2FsbChyZTEsICdhJyk7XG4gIG5hdGl2ZUV4ZWMuY2FsbChyZTIsICdhJyk7XG4gIHJldHVybiByZTEubGFzdEluZGV4ICE9PSAwIHx8IHJlMi5sYXN0SW5kZXggIT09IDA7XG59KSgpO1xuXG52YXIgVU5TVVBQT1JURURfWSA9IHN0aWNreUhlbHBlcnMuVU5TVVBQT1JURURfWSB8fCBzdGlja3lIZWxwZXJzLkJST0tFTl9DQVJFVDtcblxuLy8gbm9ucGFydGljaXBhdGluZyBjYXB0dXJpbmcgZ3JvdXAsIGNvcGllZCBmcm9tIGVzNS1zaGltJ3MgU3RyaW5nI3NwbGl0IHBhdGNoLlxudmFyIE5QQ0dfSU5DTFVERUQgPSAvKCk/Py8uZXhlYygnJylbMV0gIT09IHVuZGVmaW5lZDtcblxudmFyIFBBVENIID0gVVBEQVRFU19MQVNUX0lOREVYX1dST05HIHx8IE5QQ0dfSU5DTFVERUQgfHwgVU5TVVBQT1JURURfWSB8fCBVTlNVUFBPUlRFRF9ET1RfQUxMIHx8IFVOU1VQUE9SVEVEX05DRztcblxuaWYgKFBBVENIKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBtYXgtc3RhdGVtZW50cyAtLSBUT0RPXG4gIHBhdGNoZWRFeGVjID0gZnVuY3Rpb24gZXhlYyhzdHJpbmcpIHtcbiAgICB2YXIgcmUgPSB0aGlzO1xuICAgIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUocmUpO1xuICAgIHZhciBzdHIgPSB0b1N0cmluZyhzdHJpbmcpO1xuICAgIHZhciByYXcgPSBzdGF0ZS5yYXc7XG4gICAgdmFyIHJlc3VsdCwgcmVDb3B5LCBsYXN0SW5kZXgsIG1hdGNoLCBpLCBvYmplY3QsIGdyb3VwO1xuXG4gICAgaWYgKHJhdykge1xuICAgICAgcmF3Lmxhc3RJbmRleCA9IHJlLmxhc3RJbmRleDtcbiAgICAgIHJlc3VsdCA9IHBhdGNoZWRFeGVjLmNhbGwocmF3LCBzdHIpO1xuICAgICAgcmUubGFzdEluZGV4ID0gcmF3Lmxhc3RJbmRleDtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuXG4gICAgdmFyIGdyb3VwcyA9IHN0YXRlLmdyb3VwcztcbiAgICB2YXIgc3RpY2t5ID0gVU5TVVBQT1JURURfWSAmJiByZS5zdGlja3k7XG4gICAgdmFyIGZsYWdzID0gcmVnZXhwRmxhZ3MuY2FsbChyZSk7XG4gICAgdmFyIHNvdXJjZSA9IHJlLnNvdXJjZTtcbiAgICB2YXIgY2hhcnNBZGRlZCA9IDA7XG4gICAgdmFyIHN0ckNvcHkgPSBzdHI7XG5cbiAgICBpZiAoc3RpY2t5KSB7XG4gICAgICBmbGFncyA9IGZsYWdzLnJlcGxhY2UoJ3knLCAnJyk7XG4gICAgICBpZiAoZmxhZ3MuaW5kZXhPZignZycpID09PSAtMSkge1xuICAgICAgICBmbGFncyArPSAnZyc7XG4gICAgICB9XG5cbiAgICAgIHN0ckNvcHkgPSBzdHIuc2xpY2UocmUubGFzdEluZGV4KTtcbiAgICAgIC8vIFN1cHBvcnQgYW5jaG9yZWQgc3RpY2t5IGJlaGF2aW9yLlxuICAgICAgaWYgKHJlLmxhc3RJbmRleCA+IDAgJiYgKCFyZS5tdWx0aWxpbmUgfHwgcmUubXVsdGlsaW5lICYmIHN0ci5jaGFyQXQocmUubGFzdEluZGV4IC0gMSkgIT09ICdcXG4nKSkge1xuICAgICAgICBzb3VyY2UgPSAnKD86ICcgKyBzb3VyY2UgKyAnKSc7XG4gICAgICAgIHN0ckNvcHkgPSAnICcgKyBzdHJDb3B5O1xuICAgICAgICBjaGFyc0FkZGVkKys7XG4gICAgICB9XG4gICAgICAvLyBeKD8gKyByeCArICkgaXMgbmVlZGVkLCBpbiBjb21iaW5hdGlvbiB3aXRoIHNvbWUgc3RyIHNsaWNpbmcsIHRvXG4gICAgICAvLyBzaW11bGF0ZSB0aGUgJ3knIGZsYWcuXG4gICAgICByZUNvcHkgPSBuZXcgUmVnRXhwKCdeKD86JyArIHNvdXJjZSArICcpJywgZmxhZ3MpO1xuICAgIH1cblxuICAgIGlmIChOUENHX0lOQ0xVREVEKSB7XG4gICAgICByZUNvcHkgPSBuZXcgUmVnRXhwKCdeJyArIHNvdXJjZSArICckKD8hXFxcXHMpJywgZmxhZ3MpO1xuICAgIH1cbiAgICBpZiAoVVBEQVRFU19MQVNUX0lOREVYX1dST05HKSBsYXN0SW5kZXggPSByZS5sYXN0SW5kZXg7XG5cbiAgICBtYXRjaCA9IG5hdGl2ZUV4ZWMuY2FsbChzdGlja3kgPyByZUNvcHkgOiByZSwgc3RyQ29weSk7XG5cbiAgICBpZiAoc3RpY2t5KSB7XG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgbWF0Y2guaW5wdXQgPSBtYXRjaC5pbnB1dC5zbGljZShjaGFyc0FkZGVkKTtcbiAgICAgICAgbWF0Y2hbMF0gPSBtYXRjaFswXS5zbGljZShjaGFyc0FkZGVkKTtcbiAgICAgICAgbWF0Y2guaW5kZXggPSByZS5sYXN0SW5kZXg7XG4gICAgICAgIHJlLmxhc3RJbmRleCArPSBtYXRjaFswXS5sZW5ndGg7XG4gICAgICB9IGVsc2UgcmUubGFzdEluZGV4ID0gMDtcbiAgICB9IGVsc2UgaWYgKFVQREFURVNfTEFTVF9JTkRFWF9XUk9ORyAmJiBtYXRjaCkge1xuICAgICAgcmUubGFzdEluZGV4ID0gcmUuZ2xvYmFsID8gbWF0Y2guaW5kZXggKyBtYXRjaFswXS5sZW5ndGggOiBsYXN0SW5kZXg7XG4gICAgfVxuICAgIGlmIChOUENHX0lOQ0xVREVEICYmIG1hdGNoICYmIG1hdGNoLmxlbmd0aCA+IDEpIHtcbiAgICAgIC8vIEZpeCBicm93c2VycyB3aG9zZSBgZXhlY2AgbWV0aG9kcyBkb24ndCBjb25zaXN0ZW50bHkgcmV0dXJuIGB1bmRlZmluZWRgXG4gICAgICAvLyBmb3IgTlBDRywgbGlrZSBJRTguIE5PVEU6IFRoaXMgZG9lc24nIHdvcmsgZm9yIC8oLj8pPy9cbiAgICAgIG5hdGl2ZVJlcGxhY2UuY2FsbChtYXRjaFswXSwgcmVDb3B5LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAoaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoIC0gMjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGFyZ3VtZW50c1tpXSA9PT0gdW5kZWZpbmVkKSBtYXRjaFtpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKG1hdGNoICYmIGdyb3Vwcykge1xuICAgICAgbWF0Y2guZ3JvdXBzID0gb2JqZWN0ID0gY3JlYXRlKG51bGwpO1xuICAgICAgZm9yIChpID0gMDsgaSA8IGdyb3Vwcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBncm91cCA9IGdyb3Vwc1tpXTtcbiAgICAgICAgb2JqZWN0W2dyb3VwWzBdXSA9IG1hdGNoW2dyb3VwWzFdXTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2g7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcGF0Y2hlZEV4ZWM7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG5cbi8vIGBSZWdFeHAucHJvdG90eXBlLmZsYWdzYCBnZXR0ZXIgaW1wbGVtZW50YXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZ2V0LXJlZ2V4cC5wcm90b3R5cGUuZmxhZ3Ncbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKCkge1xuICB2YXIgdGhhdCA9IGFuT2JqZWN0KHRoaXMpO1xuICB2YXIgcmVzdWx0ID0gJyc7XG4gIGlmICh0aGF0Lmdsb2JhbCkgcmVzdWx0ICs9ICdnJztcbiAgaWYgKHRoYXQuaWdub3JlQ2FzZSkgcmVzdWx0ICs9ICdpJztcbiAgaWYgKHRoYXQubXVsdGlsaW5lKSByZXN1bHQgKz0gJ20nO1xuICBpZiAodGhhdC5kb3RBbGwpIHJlc3VsdCArPSAncyc7XG4gIGlmICh0aGF0LnVuaWNvZGUpIHJlc3VsdCArPSAndSc7XG4gIGlmICh0aGF0LnN0aWNreSkgcmVzdWx0ICs9ICd5JztcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxuLy8gYmFiZWwtbWluaWZ5IHRyYW5zcGlsZXMgUmVnRXhwKCdhJywgJ3knKSAtPiAvYS95IGFuZCBpdCBjYXVzZXMgU3ludGF4RXJyb3IsXG52YXIgUkUgPSBmdW5jdGlvbiAocywgZikge1xuICByZXR1cm4gUmVnRXhwKHMsIGYpO1xufTtcblxuZXhwb3J0cy5VTlNVUFBPUlRFRF9ZID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICB2YXIgcmUgPSBSRSgnYScsICd5Jyk7XG4gIHJlLmxhc3RJbmRleCA9IDI7XG4gIHJldHVybiByZS5leGVjKCdhYmNkJykgIT0gbnVsbDtcbn0pO1xuXG5leHBvcnRzLkJST0tFTl9DQVJFVCA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NzczNjg3XG4gIHZhciByZSA9IFJFKCdecicsICdneScpO1xuICByZS5sYXN0SW5kZXggPSAyO1xuICByZXR1cm4gcmUuZXhlYygnc3RyJykgIT0gbnVsbDtcbn0pO1xuIiwidmFyIGZhaWxzID0gcmVxdWlyZSgnLi9mYWlscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgLy8gYmFiZWwtbWluaWZ5IHRyYW5zcGlsZXMgUmVnRXhwKCcuJywgJ3MnKSAtPiAvLi9zIGFuZCBpdCBjYXVzZXMgU3ludGF4RXJyb3JcbiAgdmFyIHJlID0gUmVnRXhwKCcuJywgKHR5cGVvZiAnJykuY2hhckF0KDApKTtcbiAgcmV0dXJuICEocmUuZG90QWxsICYmIHJlLmV4ZWMoJ1xcbicpICYmIHJlLmZsYWdzID09PSAncycpO1xufSk7XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuL2ZhaWxzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZmFpbHMoZnVuY3Rpb24gKCkge1xuICAvLyBiYWJlbC1taW5pZnkgdHJhbnNwaWxlcyBSZWdFeHAoJy4nLCAnZycpIC0+IC8uL2cgYW5kIGl0IGNhdXNlcyBTeW50YXhFcnJvclxuICB2YXIgcmUgPSBSZWdFeHAoJyg/PGE+YiknLCAodHlwZW9mICcnKS5jaGFyQXQoNSkpO1xuICByZXR1cm4gcmUuZXhlYygnYicpLmdyb3Vwcy5hICE9PSAnYicgfHxcbiAgICAnYicucmVwbGFjZShyZSwgJyQ8YT5jJykgIT09ICdiYyc7XG59KTtcbiIsIi8vIGBSZXF1aXJlT2JqZWN0Q29lcmNpYmxlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcmVxdWlyZW9iamVjdGNvZXJjaWJsZVxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgaWYgKGl0ID09IHVuZGVmaW5lZCkgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gXCIgKyBpdCk7XG4gIHJldHVybiBpdDtcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHRyeSB7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLW9iamVjdC1kZWZpbmVwcm9wZXJ0eSAtLSBzYWZlXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbCwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBnbG9iYWxba2V5XSA9IHZhbHVlO1xuICB9IHJldHVybiB2YWx1ZTtcbn07XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcblxudmFyIFNQRUNJRVMgPSB3ZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoQ09OU1RSVUNUT1JfTkFNRSkge1xuICB2YXIgQ29uc3RydWN0b3IgPSBnZXRCdWlsdEluKENPTlNUUlVDVE9SX05BTUUpO1xuICB2YXIgZGVmaW5lUHJvcGVydHkgPSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mO1xuXG4gIGlmIChERVNDUklQVE9SUyAmJiBDb25zdHJ1Y3RvciAmJiAhQ29uc3RydWN0b3JbU1BFQ0lFU10pIHtcbiAgICBkZWZpbmVQcm9wZXJ0eShDb25zdHJ1Y3RvciwgU1BFQ0lFUywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiB0aGlzOyB9XG4gICAgfSk7XG4gIH1cbn07XG4iLCJ2YXIgZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWRlZmluZS1wcm9wZXJ0eScpLmY7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgVE9fU1RSSU5HX1RBRyA9IHdlbGxLbm93blN5bWJvbCgndG9TdHJpbmdUYWcnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQsIFRBRywgU1RBVElDKSB7XG4gIGlmIChpdCAmJiAhaGFzKGl0ID0gU1RBVElDID8gaXQgOiBpdC5wcm90b3R5cGUsIFRPX1NUUklOR19UQUcpKSB7XG4gICAgZGVmaW5lUHJvcGVydHkoaXQsIFRPX1NUUklOR19UQUcsIHsgY29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogVEFHIH0pO1xuICB9XG59O1xuIiwidmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG5cbnZhciBrZXlzID0gc2hhcmVkKCdrZXlzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGtleSkge1xuICByZXR1cm4ga2V5c1trZXldIHx8IChrZXlzW2tleV0gPSB1aWQoa2V5KSk7XG59O1xuIiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBzZXRHbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LWdsb2JhbCcpO1xuXG52YXIgU0hBUkVEID0gJ19fY29yZS1qc19zaGFyZWRfXyc7XG52YXIgc3RvcmUgPSBnbG9iYWxbU0hBUkVEXSB8fCBzZXRHbG9iYWwoU0hBUkVELCB7fSk7XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmU7XG4iLCJ2YXIgSVNfUFVSRSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1wdXJlJyk7XG52YXIgc3RvcmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLXN0b3JlJyk7XG5cbihtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gIHJldHVybiBzdG9yZVtrZXldIHx8IChzdG9yZVtrZXldID0gdmFsdWUgIT09IHVuZGVmaW5lZCA/IHZhbHVlIDoge30pO1xufSkoJ3ZlcnNpb25zJywgW10pLnB1c2goe1xuICB2ZXJzaW9uOiAnMy4xNi4xJyxcbiAgbW9kZTogSVNfUFVSRSA/ICdwdXJlJyA6ICdnbG9iYWwnLFxuICBjb3B5cmlnaHQ6ICfCqSAyMDIxIERlbmlzIFB1c2hrYXJldiAoemxvaXJvY2sucnUpJ1xufSk7XG4iLCJ2YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtZnVuY3Rpb24nKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFNQRUNJRVMgPSB3ZWxsS25vd25TeW1ib2woJ3NwZWNpZXMnKTtcblxuLy8gYFNwZWNpZXNDb25zdHJ1Y3RvcmAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNwZWNpZXNjb25zdHJ1Y3RvclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTywgZGVmYXVsdENvbnN0cnVjdG9yKSB7XG4gIHZhciBDID0gYW5PYmplY3QoTykuY29uc3RydWN0b3I7XG4gIHZhciBTO1xuICByZXR1cm4gQyA9PT0gdW5kZWZpbmVkIHx8IChTID0gYW5PYmplY3QoQylbU1BFQ0lFU10pID09IHVuZGVmaW5lZCA/IGRlZmF1bHRDb25zdHJ1Y3RvciA6IGFGdW5jdGlvbihTKTtcbn07XG4iLCJ2YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxuLy8gY2hlY2sgdGhlIGV4aXN0ZW5jZSBvZiBhIG1ldGhvZCwgbG93ZXJjYXNlXG4vLyBvZiBhIHRhZyBhbmQgZXNjYXBpbmcgcXVvdGVzIGluIGFyZ3VtZW50c1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoTUVUSE9EX05BTUUpIHtcbiAgcmV0dXJuIGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdGVzdCA9ICcnW01FVEhPRF9OQU1FXSgnXCInKTtcbiAgICByZXR1cm4gdGVzdCAhPT0gdGVzdC50b0xvd2VyQ2FzZSgpIHx8IHRlc3Quc3BsaXQoJ1wiJykubGVuZ3RoID4gMztcbiAgfSk7XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyJyk7XG52YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nJyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUuY29kZVBvaW50QXRgIG1ldGhvZHMgaW1wbGVtZW50YXRpb25cbnZhciBjcmVhdGVNZXRob2QgPSBmdW5jdGlvbiAoQ09OVkVSVF9UT19TVFJJTkcpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICgkdGhpcywgcG9zKSB7XG4gICAgdmFyIFMgPSB0b1N0cmluZyhyZXF1aXJlT2JqZWN0Q29lcmNpYmxlKCR0aGlzKSk7XG4gICAgdmFyIHBvc2l0aW9uID0gdG9JbnRlZ2VyKHBvcyk7XG4gICAgdmFyIHNpemUgPSBTLmxlbmd0aDtcbiAgICB2YXIgZmlyc3QsIHNlY29uZDtcbiAgICBpZiAocG9zaXRpb24gPCAwIHx8IHBvc2l0aW9uID49IHNpemUpIHJldHVybiBDT05WRVJUX1RPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGZpcnN0ID0gUy5jaGFyQ29kZUF0KHBvc2l0aW9uKTtcbiAgICByZXR1cm4gZmlyc3QgPCAweEQ4MDAgfHwgZmlyc3QgPiAweERCRkYgfHwgcG9zaXRpb24gKyAxID09PSBzaXplXG4gICAgICB8fCAoc2Vjb25kID0gUy5jaGFyQ29kZUF0KHBvc2l0aW9uICsgMSkpIDwgMHhEQzAwIHx8IHNlY29uZCA+IDB4REZGRlxuICAgICAgICA/IENPTlZFUlRfVE9fU1RSSU5HID8gUy5jaGFyQXQocG9zaXRpb24pIDogZmlyc3RcbiAgICAgICAgOiBDT05WRVJUX1RPX1NUUklORyA/IFMuc2xpY2UocG9zaXRpb24sIHBvc2l0aW9uICsgMikgOiAoZmlyc3QgLSAweEQ4MDAgPDwgMTApICsgKHNlY29uZCAtIDB4REMwMCkgKyAweDEwMDAwO1xuICB9O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIC8vIGBTdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0YCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLmNvZGVwb2ludGF0XG4gIGNvZGVBdDogY3JlYXRlTWV0aG9kKGZhbHNlKSxcbiAgLy8gYFN0cmluZy5wcm90b3R5cGUuYXRgIG1ldGhvZFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XG4gIGNoYXJBdDogY3JlYXRlTWV0aG9kKHRydWUpXG59O1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG52YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nJyk7XG52YXIgd2hpdGVzcGFjZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2hpdGVzcGFjZXMnKTtcblxudmFyIHdoaXRlc3BhY2UgPSAnWycgKyB3aGl0ZXNwYWNlcyArICddJztcbnZhciBsdHJpbSA9IFJlZ0V4cCgnXicgKyB3aGl0ZXNwYWNlICsgd2hpdGVzcGFjZSArICcqJyk7XG52YXIgcnRyaW0gPSBSZWdFeHAod2hpdGVzcGFjZSArIHdoaXRlc3BhY2UgKyAnKiQnKTtcblxuLy8gYFN0cmluZy5wcm90b3R5cGUueyB0cmltLCB0cmltU3RhcnQsIHRyaW1FbmQsIHRyaW1MZWZ0LCB0cmltUmlnaHQgfWAgbWV0aG9kcyBpbXBsZW1lbnRhdGlvblxudmFyIGNyZWF0ZU1ldGhvZCA9IGZ1bmN0aW9uIChUWVBFKSB7XG4gIHJldHVybiBmdW5jdGlvbiAoJHRoaXMpIHtcbiAgICB2YXIgc3RyaW5nID0gdG9TdHJpbmcocmVxdWlyZU9iamVjdENvZXJjaWJsZSgkdGhpcykpO1xuICAgIGlmIChUWVBFICYgMSkgc3RyaW5nID0gc3RyaW5nLnJlcGxhY2UobHRyaW0sICcnKTtcbiAgICBpZiAoVFlQRSAmIDIpIHN0cmluZyA9IHN0cmluZy5yZXBsYWNlKHJ0cmltLCAnJyk7XG4gICAgcmV0dXJuIHN0cmluZztcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAvLyBgU3RyaW5nLnByb3RvdHlwZS57IHRyaW1MZWZ0LCB0cmltU3RhcnQgfWAgbWV0aG9kc1xuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUudHJpbXN0YXJ0XG4gIHN0YXJ0OiBjcmVhdGVNZXRob2QoMSksXG4gIC8vIGBTdHJpbmcucHJvdG90eXBlLnsgdHJpbVJpZ2h0LCB0cmltRW5kIH1gIG1ldGhvZHNcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLnRyaW1lbmRcbiAgZW5kOiBjcmVhdGVNZXRob2QoMiksXG4gIC8vIGBTdHJpbmcucHJvdG90eXBlLnRyaW1gIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUudHJpbVxuICB0cmltOiBjcmVhdGVNZXRob2QoMylcbn07XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgYmluZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mdW5jdGlvbi1iaW5kLWNvbnRleHQnKTtcbnZhciBodG1sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2h0bWwnKTtcbnZhciBjcmVhdGVFbGVtZW50ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvY3VtZW50LWNyZWF0ZS1lbGVtZW50Jyk7XG52YXIgSVNfSU9TID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS1pcy1pb3MnKTtcbnZhciBJU19OT0RFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS1pcy1ub2RlJyk7XG5cbnZhciBzZXQgPSBnbG9iYWwuc2V0SW1tZWRpYXRlO1xudmFyIGNsZWFyID0gZ2xvYmFsLmNsZWFySW1tZWRpYXRlO1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBNZXNzYWdlQ2hhbm5lbCA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbDtcbnZhciBEaXNwYXRjaCA9IGdsb2JhbC5EaXNwYXRjaDtcbnZhciBjb3VudGVyID0gMDtcbnZhciBxdWV1ZSA9IHt9O1xudmFyIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xudmFyIGxvY2F0aW9uLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcblxudHJ5IHtcbiAgLy8gRGVubyB0aHJvd3MgYSBSZWZlcmVuY2VFcnJvciBvbiBgbG9jYXRpb25gIGFjY2VzcyB3aXRob3V0IGAtLWxvY2F0aW9uYCBmbGFnXG4gIGxvY2F0aW9uID0gZ2xvYmFsLmxvY2F0aW9uO1xufSBjYXRjaCAoZXJyb3IpIHsgLyogZW1wdHkgKi8gfVxuXG52YXIgcnVuID0gZnVuY3Rpb24gKGlkKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1wcm90b3R5cGUtYnVpbHRpbnMgLS0gc2FmZVxuICBpZiAocXVldWUuaGFzT3duUHJvcGVydHkoaWQpKSB7XG4gICAgdmFyIGZuID0gcXVldWVbaWRdO1xuICAgIGRlbGV0ZSBxdWV1ZVtpZF07XG4gICAgZm4oKTtcbiAgfVxufTtcblxudmFyIHJ1bm5lciA9IGZ1bmN0aW9uIChpZCkge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJ1bihpZCk7XG4gIH07XG59O1xuXG52YXIgbGlzdGVuZXIgPSBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgcnVuKGV2ZW50LmRhdGEpO1xufTtcblxudmFyIHBvc3QgPSBmdW5jdGlvbiAoaWQpIHtcbiAgLy8gb2xkIGVuZ2luZXMgaGF2ZSBub3QgbG9jYXRpb24ub3JpZ2luXG4gIGdsb2JhbC5wb3N0TWVzc2FnZShTdHJpbmcoaWQpLCBsb2NhdGlvbi5wcm90b2NvbCArICcvLycgKyBsb2NhdGlvbi5ob3N0KTtcbn07XG5cbi8vIE5vZGUuanMgMC45KyAmIElFMTArIGhhcyBzZXRJbW1lZGlhdGUsIG90aGVyd2lzZTpcbmlmICghc2V0IHx8ICFjbGVhcikge1xuICBzZXQgPSBmdW5jdGlvbiBzZXRJbW1lZGlhdGUoZm4pIHtcbiAgICB2YXIgYXJncyA9IFtdO1xuICAgIHZhciBhcmd1bWVudHNMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBpID0gMTtcbiAgICB3aGlsZSAoYXJndW1lbnRzTGVuZ3RoID4gaSkgYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICBxdWV1ZVsrK2NvdW50ZXJdID0gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jIC0tIHNwZWMgcmVxdWlyZW1lbnRcbiAgICAgICh0eXBlb2YgZm4gPT0gJ2Z1bmN0aW9uJyA/IGZuIDogRnVuY3Rpb24oZm4pKS5hcHBseSh1bmRlZmluZWQsIGFyZ3MpO1xuICAgIH07XG4gICAgZGVmZXIoY291bnRlcik7XG4gICAgcmV0dXJuIGNvdW50ZXI7XG4gIH07XG4gIGNsZWFyID0gZnVuY3Rpb24gY2xlYXJJbW1lZGlhdGUoaWQpIHtcbiAgICBkZWxldGUgcXVldWVbaWRdO1xuICB9O1xuICAvLyBOb2RlLmpzIDAuOC1cbiAgaWYgKElTX05PREUpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgcHJvY2Vzcy5uZXh0VGljayhydW5uZXIoaWQpKTtcbiAgICB9O1xuICAvLyBTcGhlcmUgKEpTIGdhbWUgZW5naW5lKSBEaXNwYXRjaCBBUElcbiAgfSBlbHNlIGlmIChEaXNwYXRjaCAmJiBEaXNwYXRjaC5ub3cpIHtcbiAgICBkZWZlciA9IGZ1bmN0aW9uIChpZCkge1xuICAgICAgRGlzcGF0Y2gubm93KHJ1bm5lcihpZCkpO1xuICAgIH07XG4gIC8vIEJyb3dzZXJzIHdpdGggTWVzc2FnZUNoYW5uZWwsIGluY2x1ZGVzIFdlYldvcmtlcnNcbiAgLy8gZXhjZXB0IGlPUyAtIGh0dHBzOi8vZ2l0aHViLmNvbS96bG9pcm9jay9jb3JlLWpzL2lzc3Vlcy82MjRcbiAgfSBlbHNlIGlmIChNZXNzYWdlQ2hhbm5lbCAmJiAhSVNfSU9TKSB7XG4gICAgY2hhbm5lbCA9IG5ldyBNZXNzYWdlQ2hhbm5lbCgpO1xuICAgIHBvcnQgPSBjaGFubmVsLnBvcnQyO1xuICAgIGNoYW5uZWwucG9ydDEub25tZXNzYWdlID0gbGlzdGVuZXI7XG4gICAgZGVmZXIgPSBiaW5kKHBvcnQucG9zdE1lc3NhZ2UsIHBvcnQsIDEpO1xuICAvLyBCcm93c2VycyB3aXRoIHBvc3RNZXNzYWdlLCBza2lwIFdlYldvcmtlcnNcbiAgLy8gSUU4IGhhcyBwb3N0TWVzc2FnZSwgYnV0IGl0J3Mgc3luYyAmIHR5cGVvZiBpdHMgcG9zdE1lc3NhZ2UgaXMgJ29iamVjdCdcbiAgfSBlbHNlIGlmIChcbiAgICBnbG9iYWwuYWRkRXZlbnRMaXN0ZW5lciAmJlxuICAgIHR5cGVvZiBwb3N0TWVzc2FnZSA9PSAnZnVuY3Rpb24nICYmXG4gICAgIWdsb2JhbC5pbXBvcnRTY3JpcHRzICYmXG4gICAgbG9jYXRpb24gJiYgbG9jYXRpb24ucHJvdG9jb2wgIT09ICdmaWxlOicgJiZcbiAgICAhZmFpbHMocG9zdClcbiAgKSB7XG4gICAgZGVmZXIgPSBwb3N0O1xuICAgIGdsb2JhbC5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgbGlzdGVuZXIsIGZhbHNlKTtcbiAgLy8gSUU4LVxuICB9IGVsc2UgaWYgKE9OUkVBRFlTVEFURUNIQU5HRSBpbiBjcmVhdGVFbGVtZW50KCdzY3JpcHQnKSkge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBodG1sLmFwcGVuZENoaWxkKGNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpKVtPTlJFQURZU1RBVEVDSEFOR0VdID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBodG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xuICAgICAgICBydW4oaWQpO1xuICAgICAgfTtcbiAgICB9O1xuICAvLyBSZXN0IG9sZCBicm93c2Vyc1xuICB9IGVsc2Uge1xuICAgIGRlZmVyID0gZnVuY3Rpb24gKGlkKSB7XG4gICAgICBzZXRUaW1lb3V0KHJ1bm5lcihpZCksIDApO1xuICAgIH07XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHNldDogc2V0LFxuICBjbGVhcjogY2xlYXJcbn07XG4iLCJ2YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcblxudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBIZWxwZXIgZm9yIGEgcG9wdWxhciByZXBlYXRpbmcgY2FzZSBvZiB0aGUgc3BlYzpcbi8vIExldCBpbnRlZ2VyIGJlID8gVG9JbnRlZ2VyKGluZGV4KS5cbi8vIElmIGludGVnZXIgPCAwLCBsZXQgcmVzdWx0IGJlIG1heCgobGVuZ3RoICsgaW50ZWdlciksIDApOyBlbHNlIGxldCByZXN1bHQgYmUgbWluKGludGVnZXIsIGxlbmd0aCkuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpbmRleCwgbGVuZ3RoKSB7XG4gIHZhciBpbnRlZ2VyID0gdG9JbnRlZ2VyKGluZGV4KTtcbiAgcmV0dXJuIGludGVnZXIgPCAwID8gbWF4KGludGVnZXIgKyBsZW5ndGgsIDApIDogbWluKGludGVnZXIsIGxlbmd0aCk7XG59O1xuIiwiLy8gdG9PYmplY3Qgd2l0aCBmYWxsYmFjayBmb3Igbm9uLWFycmF5LWxpa2UgRVMzIHN0cmluZ3NcbnZhciBJbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luZGV4ZWQtb2JqZWN0Jyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXQpIHtcbiAgcmV0dXJuIEluZGV4ZWRPYmplY3QocmVxdWlyZU9iamVjdENvZXJjaWJsZShpdCkpO1xufTtcbiIsInZhciBjZWlsID0gTWF0aC5jZWlsO1xudmFyIGZsb29yID0gTWF0aC5mbG9vcjtcblxuLy8gYFRvSW50ZWdlcmAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvaW50ZWdlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgcmV0dXJuIGlzTmFOKGFyZ3VtZW50ID0gK2FyZ3VtZW50KSA/IDAgOiAoYXJndW1lbnQgPiAwID8gZmxvb3IgOiBjZWlsKShhcmd1bWVudCk7XG59O1xuIiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbnRlZ2VyJyk7XG5cbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLy8gYFRvTGVuZ3RoYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9sZW5ndGhcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGFyZ3VtZW50KSB7XG4gIHJldHVybiBhcmd1bWVudCA+IDAgPyBtaW4odG9JbnRlZ2VyKGFyZ3VtZW50KSwgMHgxRkZGRkZGRkZGRkZGRikgOiAwOyAvLyAyICoqIDUzIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXG59O1xuIiwidmFyIHJlcXVpcmVPYmplY3RDb2VyY2libGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVxdWlyZS1vYmplY3QtY29lcmNpYmxlJyk7XG5cbi8vIGBUb09iamVjdGAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvb2JqZWN0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICByZXR1cm4gT2JqZWN0KHJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpKTtcbn07XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgaXNTeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtc3ltYm9sJyk7XG52YXIgb3JkaW5hcnlUb1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vcmRpbmFyeS10by1wcmltaXRpdmUnKTtcbnZhciB3ZWxsS25vd25TeW1ib2wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvd2VsbC1rbm93bi1zeW1ib2wnKTtcblxudmFyIFRPX1BSSU1JVElWRSA9IHdlbGxLbm93blN5bWJvbCgndG9QcmltaXRpdmUnKTtcblxuLy8gYFRvUHJpbWl0aXZlYCBhYnN0cmFjdCBvcGVyYXRpb25cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtdG9wcmltaXRpdmVcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGlucHV0LCBwcmVmKSB7XG4gIGlmICghaXNPYmplY3QoaW5wdXQpIHx8IGlzU3ltYm9sKGlucHV0KSkgcmV0dXJuIGlucHV0O1xuICB2YXIgZXhvdGljVG9QcmltID0gaW5wdXRbVE9fUFJJTUlUSVZFXTtcbiAgdmFyIHJlc3VsdDtcbiAgaWYgKGV4b3RpY1RvUHJpbSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHByZWYgPT09IHVuZGVmaW5lZCkgcHJlZiA9ICdkZWZhdWx0JztcbiAgICByZXN1bHQgPSBleG90aWNUb1ByaW0uY2FsbChpbnB1dCwgcHJlZik7XG4gICAgaWYgKCFpc09iamVjdChyZXN1bHQpIHx8IGlzU3ltYm9sKHJlc3VsdCkpIHJldHVybiByZXN1bHQ7XG4gICAgdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY29udmVydCBvYmplY3QgdG8gcHJpbWl0aXZlIHZhbHVlXCIpO1xuICB9XG4gIGlmIChwcmVmID09PSB1bmRlZmluZWQpIHByZWYgPSAnbnVtYmVyJztcbiAgcmV0dXJuIG9yZGluYXJ5VG9QcmltaXRpdmUoaW5wdXQsIHByZWYpO1xufTtcbiIsInZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcmltaXRpdmUnKTtcbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1zeW1ib2wnKTtcblxuLy8gYFRvUHJvcGVydHlLZXlgIGFic3RyYWN0IG9wZXJhdGlvblxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy10b3Byb3BlcnR5a2V5XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChhcmd1bWVudCkge1xuICB2YXIga2V5ID0gdG9QcmltaXRpdmUoYXJndW1lbnQsICdzdHJpbmcnKTtcbiAgcmV0dXJuIGlzU3ltYm9sKGtleSkgPyBrZXkgOiBTdHJpbmcoa2V5KTtcbn07XG4iLCJ2YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG5cbnZhciBUT19TVFJJTkdfVEFHID0gd2VsbEtub3duU3ltYm9sKCd0b1N0cmluZ1RhZycpO1xudmFyIHRlc3QgPSB7fTtcblxudGVzdFtUT19TVFJJTkdfVEFHXSA9ICd6JztcblxubW9kdWxlLmV4cG9ydHMgPSBTdHJpbmcodGVzdCkgPT09ICdbb2JqZWN0IHpdJztcbiIsInZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1zeW1ib2wnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgaWYgKGlzU3ltYm9sKGFyZ3VtZW50KSkgdGhyb3cgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBhIFN5bWJvbCB2YWx1ZSB0byBhIHN0cmluZycpO1xuICByZXR1cm4gU3RyaW5nKGFyZ3VtZW50KTtcbn07XG4iLCJ2YXIgaWQgPSAwO1xudmFyIHBvc3RmaXggPSBNYXRoLnJhbmRvbSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgcmV0dXJuICdTeW1ib2woJyArIFN0cmluZyhrZXkgPT09IHVuZGVmaW5lZCA/ICcnIDoga2V5KSArICcpXycgKyAoKytpZCArIHBvc3RmaXgpLnRvU3RyaW5nKDM2KTtcbn07XG4iLCIvKiBlc2xpbnQtZGlzYWJsZSBlcy9uby1zeW1ib2wgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmcgKi9cbnZhciBOQVRJVkVfU1lNQk9MID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL25hdGl2ZS1zeW1ib2wnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBOQVRJVkVfU1lNQk9MXG4gICYmICFTeW1ib2wuc2hhbVxuICAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnO1xuIiwidmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG5leHBvcnRzLmYgPSB3ZWxsS25vd25TeW1ib2w7XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgdWlkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3VpZCcpO1xudmFyIE5BVElWRV9TWU1CT0wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbCcpO1xudmFyIFVTRV9TWU1CT0xfQVNfVUlEID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3VzZS1zeW1ib2wtYXMtdWlkJyk7XG5cbnZhciBXZWxsS25vd25TeW1ib2xzU3RvcmUgPSBzaGFyZWQoJ3drcycpO1xudmFyIFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgY3JlYXRlV2VsbEtub3duU3ltYm9sID0gVVNFX1NZTUJPTF9BU19VSUQgPyBTeW1ib2wgOiBTeW1ib2wgJiYgU3ltYm9sLndpdGhvdXRTZXR0ZXIgfHwgdWlkO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIGlmICghaGFzKFdlbGxLbm93blN5bWJvbHNTdG9yZSwgbmFtZSkgfHwgIShOQVRJVkVfU1lNQk9MIHx8IHR5cGVvZiBXZWxsS25vd25TeW1ib2xzU3RvcmVbbmFtZV0gPT0gJ3N0cmluZycpKSB7XG4gICAgaWYgKE5BVElWRV9TWU1CT0wgJiYgaGFzKFN5bWJvbCwgbmFtZSkpIHtcbiAgICAgIFdlbGxLbm93blN5bWJvbHNTdG9yZVtuYW1lXSA9IFN5bWJvbFtuYW1lXTtcbiAgICB9IGVsc2Uge1xuICAgICAgV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdID0gY3JlYXRlV2VsbEtub3duU3ltYm9sKCdTeW1ib2wuJyArIG5hbWUpO1xuICAgIH1cbiAgfSByZXR1cm4gV2VsbEtub3duU3ltYm9sc1N0b3JlW25hbWVdO1xufTtcbiIsIi8vIGEgc3RyaW5nIG9mIGFsbCB2YWxpZCB1bmljb2RlIHdoaXRlc3BhY2VzXG5tb2R1bGUuZXhwb3J0cyA9ICdcXHUwMDA5XFx1MDAwQVxcdTAwMEJcXHUwMDBDXFx1MDAwRFxcdTAwMjBcXHUwMEEwXFx1MTY4MFxcdTIwMDBcXHUyMDAxXFx1MjAwMicgK1xuICAnXFx1MjAwM1xcdTIwMDRcXHUyMDA1XFx1MjAwNlxcdTIwMDdcXHUyMDA4XFx1MjAwOVxcdTIwMEFcXHUyMDJGXFx1MjA1RlxcdTMwMDBcXHUyMDI4XFx1MjAyOVxcdUZFRkYnO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgJGV2ZXJ5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbicpLmV2ZXJ5O1xudmFyIGFycmF5TWV0aG9kSXNTdHJpY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdCcpO1xuXG52YXIgU1RSSUNUX01FVEhPRCA9IGFycmF5TWV0aG9kSXNTdHJpY3QoJ2V2ZXJ5Jyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuZXZlcnlgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZXZlcnlcbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6ICFTVFJJQ1RfTUVUSE9EIH0sIHtcbiAgZXZlcnk6IGZ1bmN0aW9uIGV2ZXJ5KGNhbGxiYWNrZm4gLyogLCB0aGlzQXJnICovKSB7XG4gICAgcmV0dXJuICRldmVyeSh0aGlzLCBjYWxsYmFja2ZuLCBhcmd1bWVudHMubGVuZ3RoID4gMSA/IGFyZ3VtZW50c1sxXSA6IHVuZGVmaW5lZCk7XG4gIH1cbn0pO1xuIiwidmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZmlsbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1maWxsJyk7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hZGQtdG8tdW5zY29wYWJsZXMnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5maWxsYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmZpbGxcbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlIH0sIHtcbiAgZmlsbDogZmlsbFxufSk7XG5cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLUBAdW5zY29wYWJsZXNcbmFkZFRvVW5zY29wYWJsZXMoJ2ZpbGwnKTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyICRmaWx0ZXIgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaXRlcmF0aW9uJykuZmlsdGVyO1xudmFyIGFycmF5TWV0aG9kSGFzU3BlY2llc1N1cHBvcnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWhhcy1zcGVjaWVzLXN1cHBvcnQnKTtcblxudmFyIEhBU19TUEVDSUVTX1NVUFBPUlQgPSBhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0KCdmaWx0ZXInKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5maWx0ZXJgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZmlsdGVyXG4vLyB3aXRoIGFkZGluZyBzdXBwb3J0IG9mIEBAc3BlY2llc1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIUhBU19TUEVDSUVTX1NVUFBPUlQgfSwge1xuICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgIHJldHVybiAkZmlsdGVyKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWZvci1lYWNoJyk7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuZm9yRWFjaGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5mb3JlYWNoXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tYXJyYXktcHJvdG90eXBlLWZvcmVhY2ggLS0gc2FmZVxuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogW10uZm9yRWFjaCAhPSBmb3JFYWNoIH0sIHtcbiAgZm9yRWFjaDogZm9yRWFjaFxufSk7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBmcm9tID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWZyb20nKTtcbnZhciBjaGVja0NvcnJlY3RuZXNzT2ZJdGVyYXRpb24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY2hlY2stY29ycmVjdG5lc3Mtb2YtaXRlcmF0aW9uJyk7XG5cbnZhciBJTkNPUlJFQ1RfSVRFUkFUSU9OID0gIWNoZWNrQ29ycmVjdG5lc3NPZkl0ZXJhdGlvbihmdW5jdGlvbiAoaXRlcmFibGUpIHtcbiAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIGVzL25vLWFycmF5LWZyb20gLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgQXJyYXkuZnJvbShpdGVyYWJsZSk7XG59KTtcblxuLy8gYEFycmF5LmZyb21gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5mcm9tXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBzdGF0OiB0cnVlLCBmb3JjZWQ6IElOQ09SUkVDVF9JVEVSQVRJT04gfSwge1xuICBmcm9tOiBmcm9tXG59KTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIGVzL25vLWFycmF5LXByb3RvdHlwZS1pbmRleG9mIC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nICovXG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkaW5kZXhPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1pbmNsdWRlcycpLmluZGV4T2Y7XG52YXIgYXJyYXlNZXRob2RJc1N0cmljdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaXMtc3RyaWN0Jyk7XG5cbnZhciBuYXRpdmVJbmRleE9mID0gW10uaW5kZXhPZjtcblxudmFyIE5FR0FUSVZFX1pFUk8gPSAhIW5hdGl2ZUluZGV4T2YgJiYgMSAvIFsxXS5pbmRleE9mKDEsIC0wKSA8IDA7XG52YXIgU1RSSUNUX01FVEhPRCA9IGFycmF5TWV0aG9kSXNTdHJpY3QoJ2luZGV4T2YnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5pbmRleE9mYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmluZGV4b2ZcbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IE5FR0FUSVZFX1pFUk8gfHwgIVNUUklDVF9NRVRIT0QgfSwge1xuICBpbmRleE9mOiBmdW5jdGlvbiBpbmRleE9mKHNlYXJjaEVsZW1lbnQgLyogLCBmcm9tSW5kZXggPSAwICovKSB7XG4gICAgcmV0dXJuIE5FR0FUSVZFX1pFUk9cbiAgICAgIC8vIGNvbnZlcnQgLTAgdG8gKzBcbiAgICAgID8gbmF0aXZlSW5kZXhPZi5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IDBcbiAgICAgIDogJGluZGV4T2YodGhpcywgc2VhcmNoRWxlbWVudCwgYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQpO1xuICB9XG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtYXJyYXknKTtcblxuLy8gYEFycmF5LmlzQXJyYXlgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5pc2FycmF5XG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBzdGF0OiB0cnVlIH0sIHtcbiAgaXNBcnJheTogaXNBcnJheVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgYWRkVG9VbnNjb3BhYmxlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hZGQtdG8tdW5zY29wYWJsZXMnKTtcbnZhciBJdGVyYXRvcnMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0b3JzJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xudmFyIGRlZmluZUl0ZXJhdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RlZmluZS1pdGVyYXRvcicpO1xuXG52YXIgQVJSQVlfSVRFUkFUT1IgPSAnQXJyYXkgSXRlcmF0b3InO1xudmFyIHNldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLnNldDtcbnZhciBnZXRJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5nZXR0ZXJGb3IoQVJSQVlfSVRFUkFUT1IpO1xuXG4vLyBgQXJyYXkucHJvdG90eXBlLmVudHJpZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUuZW50cmllc1xuLy8gYEFycmF5LnByb3RvdHlwZS5rZXlzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmtleXNcbi8vIGBBcnJheS5wcm90b3R5cGUudmFsdWVzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnZhbHVlc1xuLy8gYEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS1AQGl0ZXJhdG9yXG4vLyBgQ3JlYXRlQXJyYXlJdGVyYXRvcmAgaW50ZXJuYWwgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWNyZWF0ZWFycmF5aXRlcmF0b3Jcbm1vZHVsZS5leHBvcnRzID0gZGVmaW5lSXRlcmF0b3IoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uIChpdGVyYXRlZCwga2luZCkge1xuICBzZXRJbnRlcm5hbFN0YXRlKHRoaXMsIHtcbiAgICB0eXBlOiBBUlJBWV9JVEVSQVRPUixcbiAgICB0YXJnZXQ6IHRvSW5kZXhlZE9iamVjdChpdGVyYXRlZCksIC8vIHRhcmdldFxuICAgIGluZGV4OiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICAgIGtpbmQ6IGtpbmQgICAgICAgICAgICAgICAgICAgICAgICAgLy8ga2luZFxuICB9KTtcbi8vIGAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dGAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLSVhcnJheWl0ZXJhdG9ycHJvdG90eXBlJS5uZXh0XG59LCBmdW5jdGlvbiAoKSB7XG4gIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhpcyk7XG4gIHZhciB0YXJnZXQgPSBzdGF0ZS50YXJnZXQ7XG4gIHZhciBraW5kID0gc3RhdGUua2luZDtcbiAgdmFyIGluZGV4ID0gc3RhdGUuaW5kZXgrKztcbiAgaWYgKCF0YXJnZXQgfHwgaW5kZXggPj0gdGFyZ2V0Lmxlbmd0aCkge1xuICAgIHN0YXRlLnRhcmdldCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIH1cbiAgaWYgKGtpbmQgPT0gJ2tleXMnKSByZXR1cm4geyB2YWx1ZTogaW5kZXgsIGRvbmU6IGZhbHNlIH07XG4gIGlmIChraW5kID09ICd2YWx1ZXMnKSByZXR1cm4geyB2YWx1ZTogdGFyZ2V0W2luZGV4XSwgZG9uZTogZmFsc2UgfTtcbiAgcmV0dXJuIHsgdmFsdWU6IFtpbmRleCwgdGFyZ2V0W2luZGV4XV0sIGRvbmU6IGZhbHNlIH07XG59LCAndmFsdWVzJyk7XG5cbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJVxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1jcmVhdGV1bm1hcHBlZGFyZ3VtZW50c29iamVjdFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1jcmVhdGVtYXBwZWRhcmd1bWVudHNvYmplY3Rcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XG5cbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLUBAdW5zY29wYWJsZXNcbmFkZFRvVW5zY29wYWJsZXMoJ2tleXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ3ZhbHVlcycpO1xuYWRkVG9VbnNjb3BhYmxlcygnZW50cmllcycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbmRleGVkLW9iamVjdCcpO1xudmFyIHRvSW5kZXhlZE9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1pbmRleGVkLW9iamVjdCcpO1xudmFyIGFycmF5TWV0aG9kSXNTdHJpY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWlzLXN0cmljdCcpO1xuXG52YXIgbmF0aXZlSm9pbiA9IFtdLmpvaW47XG5cbnZhciBFUzNfU1RSSU5HUyA9IEluZGV4ZWRPYmplY3QgIT0gT2JqZWN0O1xudmFyIFNUUklDVF9NRVRIT0QgPSBhcnJheU1ldGhvZElzU3RyaWN0KCdqb2luJywgJywnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5qb2luYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLmpvaW5cbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IEVTM19TVFJJTkdTIHx8ICFTVFJJQ1RfTUVUSE9EIH0sIHtcbiAgam9pbjogZnVuY3Rpb24gam9pbihzZXBhcmF0b3IpIHtcbiAgICByZXR1cm4gbmF0aXZlSm9pbi5jYWxsKHRvSW5kZXhlZE9iamVjdCh0aGlzKSwgc2VwYXJhdG9yID09PSB1bmRlZmluZWQgPyAnLCcgOiBzZXBhcmF0b3IpO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyICRtYXAgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktaXRlcmF0aW9uJykubWFwO1xudmFyIGFycmF5TWV0aG9kSGFzU3BlY2llc1N1cHBvcnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWhhcy1zcGVjaWVzLXN1cHBvcnQnKTtcblxudmFyIEhBU19TUEVDSUVTX1NVUFBPUlQgPSBhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0KCdtYXAnKTtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5tYXBgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUubWFwXG4vLyB3aXRoIGFkZGluZyBzdXBwb3J0IG9mIEBAc3BlY2llc1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIUhBU19TUEVDSUVTX1NVUFBPUlQgfSwge1xuICBtYXA6IGZ1bmN0aW9uIG1hcChjYWxsYmFja2ZuIC8qICwgdGhpc0FyZyAqLykge1xuICAgIHJldHVybiAkbWFwKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkcmVkdWNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LXJlZHVjZScpLmxlZnQ7XG52YXIgYXJyYXlNZXRob2RJc1N0cmljdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaXMtc3RyaWN0Jyk7XG52YXIgQ0hST01FX1ZFUlNJT04gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXY4LXZlcnNpb24nKTtcbnZhciBJU19OT0RFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS1pcy1ub2RlJyk7XG5cbnZhciBTVFJJQ1RfTUVUSE9EID0gYXJyYXlNZXRob2RJc1N0cmljdCgncmVkdWNlJyk7XG4vLyBDaHJvbWUgODAtODIgaGFzIGEgY3JpdGljYWwgYnVnXG4vLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD0xMDQ5OTgyXG52YXIgQ0hST01FX0JVRyA9ICFJU19OT0RFICYmIENIUk9NRV9WRVJTSU9OID4gNzkgJiYgQ0hST01FX1ZFUlNJT04gPCA4MztcblxuLy8gYEFycmF5LnByb3RvdHlwZS5yZWR1Y2VgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1hcnJheS5wcm90b3R5cGUucmVkdWNlXG4kKHsgdGFyZ2V0OiAnQXJyYXknLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiAhU1RSSUNUX01FVEhPRCB8fCBDSFJPTUVfQlVHIH0sIHtcbiAgcmVkdWNlOiBmdW5jdGlvbiByZWR1Y2UoY2FsbGJhY2tmbiAvKiAsIGluaXRpYWxWYWx1ZSAqLykge1xuICAgIHJldHVybiAkcmVkdWNlKHRoaXMsIGNhbGxiYWNrZm4sIGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3VtZW50cy5sZW5ndGggPiAxID8gYXJndW1lbnRzWzFdIDogdW5kZWZpbmVkKTtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc0FycmF5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWFycmF5Jyk7XG52YXIgdG9BYnNvbHV0ZUluZGV4ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWFic29sdXRlLWluZGV4Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG52YXIgdG9JbmRleGVkT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWluZGV4ZWQtb2JqZWN0Jyk7XG52YXIgY3JlYXRlUHJvcGVydHkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5Jyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgYXJyYXlNZXRob2RIYXNTcGVjaWVzU3VwcG9ydCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1tZXRob2QtaGFzLXNwZWNpZXMtc3VwcG9ydCcpO1xuXG52YXIgSEFTX1NQRUNJRVNfU1VQUE9SVCA9IGFycmF5TWV0aG9kSGFzU3BlY2llc1N1cHBvcnQoJ3NsaWNlJyk7XG5cbnZhciBTUEVDSUVTID0gd2VsbEtub3duU3ltYm9sKCdzcGVjaWVzJyk7XG52YXIgbmF0aXZlU2xpY2UgPSBbXS5zbGljZTtcbnZhciBtYXggPSBNYXRoLm1heDtcblxuLy8gYEFycmF5LnByb3RvdHlwZS5zbGljZWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLWFycmF5LnByb3RvdHlwZS5zbGljZVxuLy8gZmFsbGJhY2sgZm9yIG5vdCBhcnJheS1saWtlIEVTMyBzdHJpbmdzIGFuZCBET00gb2JqZWN0c1xuJCh7IHRhcmdldDogJ0FycmF5JywgcHJvdG86IHRydWUsIGZvcmNlZDogIUhBU19TUEVDSUVTX1NVUFBPUlQgfSwge1xuICBzbGljZTogZnVuY3Rpb24gc2xpY2Uoc3RhcnQsIGVuZCkge1xuICAgIHZhciBPID0gdG9JbmRleGVkT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW5ndGggPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGsgPSB0b0Fic29sdXRlSW5kZXgoc3RhcnQsIGxlbmd0aCk7XG4gICAgdmFyIGZpbiA9IHRvQWJzb2x1dGVJbmRleChlbmQgPT09IHVuZGVmaW5lZCA/IGxlbmd0aCA6IGVuZCwgbGVuZ3RoKTtcbiAgICAvLyBpbmxpbmUgYEFycmF5U3BlY2llc0NyZWF0ZWAgZm9yIHVzYWdlIG5hdGl2ZSBgQXJyYXkjc2xpY2VgIHdoZXJlIGl0J3MgcG9zc2libGVcbiAgICB2YXIgQ29uc3RydWN0b3IsIHJlc3VsdCwgbjtcbiAgICBpZiAoaXNBcnJheShPKSkge1xuICAgICAgQ29uc3RydWN0b3IgPSBPLmNvbnN0cnVjdG9yO1xuICAgICAgLy8gY3Jvc3MtcmVhbG0gZmFsbGJhY2tcbiAgICAgIGlmICh0eXBlb2YgQ29uc3RydWN0b3IgPT0gJ2Z1bmN0aW9uJyAmJiAoQ29uc3RydWN0b3IgPT09IEFycmF5IHx8IGlzQXJyYXkoQ29uc3RydWN0b3IucHJvdG90eXBlKSkpIHtcbiAgICAgICAgQ29uc3RydWN0b3IgPSB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2UgaWYgKGlzT2JqZWN0KENvbnN0cnVjdG9yKSkge1xuICAgICAgICBDb25zdHJ1Y3RvciA9IENvbnN0cnVjdG9yW1NQRUNJRVNdO1xuICAgICAgICBpZiAoQ29uc3RydWN0b3IgPT09IG51bGwpIENvbnN0cnVjdG9yID0gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgaWYgKENvbnN0cnVjdG9yID09PSBBcnJheSB8fCBDb25zdHJ1Y3RvciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBuYXRpdmVTbGljZS5jYWxsKE8sIGssIGZpbik7XG4gICAgICB9XG4gICAgfVxuICAgIHJlc3VsdCA9IG5ldyAoQ29uc3RydWN0b3IgPT09IHVuZGVmaW5lZCA/IEFycmF5IDogQ29uc3RydWN0b3IpKG1heChmaW4gLSBrLCAwKSk7XG4gICAgZm9yIChuID0gMDsgayA8IGZpbjsgaysrLCBuKyspIGlmIChrIGluIE8pIGNyZWF0ZVByb3BlcnR5KHJlc3VsdCwgbiwgT1trXSk7XG4gICAgcmVzdWx0Lmxlbmd0aCA9IG47XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciB0b0Fic29sdXRlSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tYWJzb2x1dGUtaW5kZXgnKTtcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW50ZWdlcicpO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWxlbmd0aCcpO1xudmFyIHRvT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLW9iamVjdCcpO1xudmFyIGFycmF5U3BlY2llc0NyZWF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hcnJheS1zcGVjaWVzLWNyZWF0ZScpO1xudmFyIGNyZWF0ZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1wcm9wZXJ0eScpO1xudmFyIGFycmF5TWV0aG9kSGFzU3BlY2llc1N1cHBvcnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYXJyYXktbWV0aG9kLWhhcy1zcGVjaWVzLXN1cHBvcnQnKTtcblxudmFyIEhBU19TUEVDSUVTX1NVUFBPUlQgPSBhcnJheU1ldGhvZEhhc1NwZWNpZXNTdXBwb3J0KCdzcGxpY2UnKTtcblxudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSAweDFGRkZGRkZGRkZGRkZGO1xudmFyIE1BWElNVU1fQUxMT1dFRF9MRU5HVEhfRVhDRUVERUQgPSAnTWF4aW11bSBhbGxvd2VkIGxlbmd0aCBleGNlZWRlZCc7XG5cbi8vIGBBcnJheS5wcm90b3R5cGUuc3BsaWNlYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtYXJyYXkucHJvdG90eXBlLnNwbGljZVxuLy8gd2l0aCBhZGRpbmcgc3VwcG9ydCBvZiBAQHNwZWNpZXNcbiQoeyB0YXJnZXQ6ICdBcnJheScsIHByb3RvOiB0cnVlLCBmb3JjZWQ6ICFIQVNfU1BFQ0lFU19TVVBQT1JUIH0sIHtcbiAgc3BsaWNlOiBmdW5jdGlvbiBzcGxpY2Uoc3RhcnQsIGRlbGV0ZUNvdW50IC8qICwgLi4uaXRlbXMgKi8pIHtcbiAgICB2YXIgTyA9IHRvT2JqZWN0KHRoaXMpO1xuICAgIHZhciBsZW4gPSB0b0xlbmd0aChPLmxlbmd0aCk7XG4gICAgdmFyIGFjdHVhbFN0YXJ0ID0gdG9BYnNvbHV0ZUluZGV4KHN0YXJ0LCBsZW4pO1xuICAgIHZhciBhcmd1bWVudHNMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIHZhciBpbnNlcnRDb3VudCwgYWN0dWFsRGVsZXRlQ291bnQsIEEsIGssIGZyb20sIHRvO1xuICAgIGlmIChhcmd1bWVudHNMZW5ndGggPT09IDApIHtcbiAgICAgIGluc2VydENvdW50ID0gYWN0dWFsRGVsZXRlQ291bnQgPSAwO1xuICAgIH0gZWxzZSBpZiAoYXJndW1lbnRzTGVuZ3RoID09PSAxKSB7XG4gICAgICBpbnNlcnRDb3VudCA9IDA7XG4gICAgICBhY3R1YWxEZWxldGVDb3VudCA9IGxlbiAtIGFjdHVhbFN0YXJ0O1xuICAgIH0gZWxzZSB7XG4gICAgICBpbnNlcnRDb3VudCA9IGFyZ3VtZW50c0xlbmd0aCAtIDI7XG4gICAgICBhY3R1YWxEZWxldGVDb3VudCA9IG1pbihtYXgodG9JbnRlZ2VyKGRlbGV0ZUNvdW50KSwgMCksIGxlbiAtIGFjdHVhbFN0YXJ0KTtcbiAgICB9XG4gICAgaWYgKGxlbiArIGluc2VydENvdW50IC0gYWN0dWFsRGVsZXRlQ291bnQgPiBNQVhfU0FGRV9JTlRFR0VSKSB7XG4gICAgICB0aHJvdyBUeXBlRXJyb3IoTUFYSU1VTV9BTExPV0VEX0xFTkdUSF9FWENFRURFRCk7XG4gICAgfVxuICAgIEEgPSBhcnJheVNwZWNpZXNDcmVhdGUoTywgYWN0dWFsRGVsZXRlQ291bnQpO1xuICAgIGZvciAoayA9IDA7IGsgPCBhY3R1YWxEZWxldGVDb3VudDsgaysrKSB7XG4gICAgICBmcm9tID0gYWN0dWFsU3RhcnQgKyBrO1xuICAgICAgaWYgKGZyb20gaW4gTykgY3JlYXRlUHJvcGVydHkoQSwgaywgT1tmcm9tXSk7XG4gICAgfVxuICAgIEEubGVuZ3RoID0gYWN0dWFsRGVsZXRlQ291bnQ7XG4gICAgaWYgKGluc2VydENvdW50IDwgYWN0dWFsRGVsZXRlQ291bnQpIHtcbiAgICAgIGZvciAoayA9IGFjdHVhbFN0YXJ0OyBrIDwgbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQ7IGsrKykge1xuICAgICAgICBmcm9tID0gayArIGFjdHVhbERlbGV0ZUNvdW50O1xuICAgICAgICB0byA9IGsgKyBpbnNlcnRDb3VudDtcbiAgICAgICAgaWYgKGZyb20gaW4gTykgT1t0b10gPSBPW2Zyb21dO1xuICAgICAgICBlbHNlIGRlbGV0ZSBPW3RvXTtcbiAgICAgIH1cbiAgICAgIGZvciAoayA9IGxlbjsgayA+IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50ICsgaW5zZXJ0Q291bnQ7IGstLSkgZGVsZXRlIE9bayAtIDFdO1xuICAgIH0gZWxzZSBpZiAoaW5zZXJ0Q291bnQgPiBhY3R1YWxEZWxldGVDb3VudCkge1xuICAgICAgZm9yIChrID0gbGVuIC0gYWN0dWFsRGVsZXRlQ291bnQ7IGsgPiBhY3R1YWxTdGFydDsgay0tKSB7XG4gICAgICAgIGZyb20gPSBrICsgYWN0dWFsRGVsZXRlQ291bnQgLSAxO1xuICAgICAgICB0byA9IGsgKyBpbnNlcnRDb3VudCAtIDE7XG4gICAgICAgIGlmIChmcm9tIGluIE8pIE9bdG9dID0gT1tmcm9tXTtcbiAgICAgICAgZWxzZSBkZWxldGUgT1t0b107XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAoayA9IDA7IGsgPCBpbnNlcnRDb3VudDsgaysrKSB7XG4gICAgICBPW2sgKyBhY3R1YWxTdGFydF0gPSBhcmd1bWVudHNbayArIDJdO1xuICAgIH1cbiAgICBPLmxlbmd0aCA9IGxlbiAtIGFjdHVhbERlbGV0ZUNvdW50ICsgaW5zZXJ0Q291bnQ7XG4gICAgcmV0dXJuIEE7XG4gIH1cbn0pO1xuIiwidmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG5cbnZhciBEYXRlUHJvdG90eXBlID0gRGF0ZS5wcm90b3R5cGU7XG52YXIgSU5WQUxJRF9EQVRFID0gJ0ludmFsaWQgRGF0ZSc7XG52YXIgVE9fU1RSSU5HID0gJ3RvU3RyaW5nJztcbnZhciBuYXRpdmVEYXRlVG9TdHJpbmcgPSBEYXRlUHJvdG90eXBlW1RPX1NUUklOR107XG52YXIgZ2V0VGltZSA9IERhdGVQcm90b3R5cGUuZ2V0VGltZTtcblxuLy8gYERhdGUucHJvdG90eXBlLnRvU3RyaW5nYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtZGF0ZS5wcm90b3R5cGUudG9zdHJpbmdcbmlmIChTdHJpbmcobmV3IERhdGUoTmFOKSkgIT0gSU5WQUxJRF9EQVRFKSB7XG4gIHJlZGVmaW5lKERhdGVQcm90b3R5cGUsIFRPX1NUUklORywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgdmFyIHZhbHVlID0gZ2V0VGltZS5jYWxsKHRoaXMpO1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1zZWxmLWNvbXBhcmUgLS0gTmFOIGNoZWNrXG4gICAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/IG5hdGl2ZURhdGVUb1N0cmluZy5jYWxsKHRoaXMpIDogSU5WQUxJRF9EQVRFO1xuICB9KTtcbn1cbiIsInZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGJpbmQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZnVuY3Rpb24tYmluZCcpO1xuXG4vLyBgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1mdW5jdGlvbi5wcm90b3R5cGUuYmluZFxuJCh7IHRhcmdldDogJ0Z1bmN0aW9uJywgcHJvdG86IHRydWUgfSwge1xuICBiaW5kOiBiaW5kXG59KTtcbiIsInZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKS5mO1xuXG52YXIgRnVuY3Rpb25Qcm90b3R5cGUgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG52YXIgRnVuY3Rpb25Qcm90b3R5cGVUb1N0cmluZyA9IEZ1bmN0aW9uUHJvdG90eXBlLnRvU3RyaW5nO1xudmFyIG5hbWVSRSA9IC9eXFxzKmZ1bmN0aW9uIChbXiAoXSopLztcbnZhciBOQU1FID0gJ25hbWUnO1xuXG4vLyBGdW5jdGlvbiBpbnN0YW5jZXMgYC5uYW1lYCBwcm9wZXJ0eVxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1mdW5jdGlvbi1pbnN0YW5jZXMtbmFtZVxuaWYgKERFU0NSSVBUT1JTICYmICEoTkFNRSBpbiBGdW5jdGlvblByb3RvdHlwZSkpIHtcbiAgZGVmaW5lUHJvcGVydHkoRnVuY3Rpb25Qcm90b3R5cGUsIE5BTUUsIHtcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gRnVuY3Rpb25Qcm90b3R5cGVUb1N0cmluZy5jYWxsKHRoaXMpLm1hdGNoKG5hbWVSRSlbMV07XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICByZXR1cm4gJyc7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvbGxlY3Rpb24nKTtcbnZhciBjb2xsZWN0aW9uU3Ryb25nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIGBNYXBgIGNvbnN0cnVjdG9yXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW1hcC1vYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IGNvbGxlY3Rpb24oJ01hcCcsIGZ1bmN0aW9uIChpbml0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBNYXAoKSB7IHJldHVybiBpbml0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwgY29sbGVjdGlvblN0cm9uZyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaXNGb3JjZWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtZm9yY2VkJyk7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBoYXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGFzJyk7XG52YXIgY2xhc3NvZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jbGFzc29mLXJhdycpO1xudmFyIGluaGVyaXRJZlJlcXVpcmVkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2luaGVyaXQtaWYtcmVxdWlyZWQnKTtcbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1zeW1ib2wnKTtcbnZhciB0b1ByaW1pdGl2ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcmltaXRpdmUnKTtcbnZhciBmYWlscyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9mYWlscycpO1xudmFyIGNyZWF0ZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtY3JlYXRlJyk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZ2V0LW93bi1wcm9wZXJ0eS1uYW1lcycpLmY7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKS5mO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKS5mO1xudmFyIHRyaW0gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc3RyaW5nLXRyaW0nKS50cmltO1xuXG52YXIgTlVNQkVSID0gJ051bWJlcic7XG52YXIgTmF0aXZlTnVtYmVyID0gZ2xvYmFsW05VTUJFUl07XG52YXIgTnVtYmVyUHJvdG90eXBlID0gTmF0aXZlTnVtYmVyLnByb3RvdHlwZTtcblxuLy8gT3BlcmEgfjEyIGhhcyBicm9rZW4gT2JqZWN0I3RvU3RyaW5nXG52YXIgQlJPS0VOX0NMQVNTT0YgPSBjbGFzc29mKGNyZWF0ZShOdW1iZXJQcm90b3R5cGUpKSA9PSBOVU1CRVI7XG5cbi8vIGBUb051bWJlcmAgYWJzdHJhY3Qgb3BlcmF0aW9uXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXRvbnVtYmVyXG52YXIgdG9OdW1iZXIgPSBmdW5jdGlvbiAoYXJndW1lbnQpIHtcbiAgaWYgKGlzU3ltYm9sKGFyZ3VtZW50KSkgdGhyb3cgVHlwZUVycm9yKCdDYW5ub3QgY29udmVydCBhIFN5bWJvbCB2YWx1ZSB0byBhIG51bWJlcicpO1xuICB2YXIgaXQgPSB0b1ByaW1pdGl2ZShhcmd1bWVudCwgJ251bWJlcicpO1xuICB2YXIgZmlyc3QsIHRoaXJkLCByYWRpeCwgbWF4Q29kZSwgZGlnaXRzLCBsZW5ndGgsIGluZGV4LCBjb2RlO1xuICBpZiAodHlwZW9mIGl0ID09ICdzdHJpbmcnICYmIGl0Lmxlbmd0aCA+IDIpIHtcbiAgICBpdCA9IHRyaW0oaXQpO1xuICAgIGZpcnN0ID0gaXQuY2hhckNvZGVBdCgwKTtcbiAgICBpZiAoZmlyc3QgPT09IDQzIHx8IGZpcnN0ID09PSA0NSkge1xuICAgICAgdGhpcmQgPSBpdC5jaGFyQ29kZUF0KDIpO1xuICAgICAgaWYgKHRoaXJkID09PSA4OCB8fCB0aGlyZCA9PT0gMTIwKSByZXR1cm4gTmFOOyAvLyBOdW1iZXIoJysweDEnKSBzaG91bGQgYmUgTmFOLCBvbGQgVjggZml4XG4gICAgfSBlbHNlIGlmIChmaXJzdCA9PT0gNDgpIHtcbiAgICAgIHN3aXRjaCAoaXQuY2hhckNvZGVBdCgxKSkge1xuICAgICAgICBjYXNlIDY2OiBjYXNlIDk4OiByYWRpeCA9IDI7IG1heENvZGUgPSA0OTsgYnJlYWs7IC8vIGZhc3QgZXF1YWwgb2YgL14wYlswMV0rJC9pXG4gICAgICAgIGNhc2UgNzk6IGNhc2UgMTExOiByYWRpeCA9IDg7IG1heENvZGUgPSA1NTsgYnJlYWs7IC8vIGZhc3QgZXF1YWwgb2YgL14wb1swLTddKyQvaVxuICAgICAgICBkZWZhdWx0OiByZXR1cm4gK2l0O1xuICAgICAgfVxuICAgICAgZGlnaXRzID0gaXQuc2xpY2UoMik7XG4gICAgICBsZW5ndGggPSBkaWdpdHMubGVuZ3RoO1xuICAgICAgZm9yIChpbmRleCA9IDA7IGluZGV4IDwgbGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgIGNvZGUgPSBkaWdpdHMuY2hhckNvZGVBdChpbmRleCk7XG4gICAgICAgIC8vIHBhcnNlSW50IHBhcnNlcyBhIHN0cmluZyB0byBhIGZpcnN0IHVuYXZhaWxhYmxlIHN5bWJvbFxuICAgICAgICAvLyBidXQgVG9OdW1iZXIgc2hvdWxkIHJldHVybiBOYU4gaWYgYSBzdHJpbmcgY29udGFpbnMgdW5hdmFpbGFibGUgc3ltYm9sc1xuICAgICAgICBpZiAoY29kZSA8IDQ4IHx8IGNvZGUgPiBtYXhDb2RlKSByZXR1cm4gTmFOO1xuICAgICAgfSByZXR1cm4gcGFyc2VJbnQoZGlnaXRzLCByYWRpeCk7XG4gICAgfVxuICB9IHJldHVybiAraXQ7XG59O1xuXG4vLyBgTnVtYmVyYCBjb25zdHJ1Y3RvclxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1udW1iZXItY29uc3RydWN0b3JcbmlmIChpc0ZvcmNlZChOVU1CRVIsICFOYXRpdmVOdW1iZXIoJyAwbzEnKSB8fCAhTmF0aXZlTnVtYmVyKCcwYjEnKSB8fCBOYXRpdmVOdW1iZXIoJysweDEnKSkpIHtcbiAgdmFyIE51bWJlcldyYXBwZXIgPSBmdW5jdGlvbiBOdW1iZXIodmFsdWUpIHtcbiAgICB2YXIgaXQgPSBhcmd1bWVudHMubGVuZ3RoIDwgMSA/IDAgOiB2YWx1ZTtcbiAgICB2YXIgZHVtbXkgPSB0aGlzO1xuICAgIHJldHVybiBkdW1teSBpbnN0YW5jZW9mIE51bWJlcldyYXBwZXJcbiAgICAgIC8vIGNoZWNrIG9uIDEuLmNvbnN0cnVjdG9yKGZvbykgY2FzZVxuICAgICAgJiYgKEJST0tFTl9DTEFTU09GID8gZmFpbHMoZnVuY3Rpb24gKCkgeyBOdW1iZXJQcm90b3R5cGUudmFsdWVPZi5jYWxsKGR1bW15KTsgfSkgOiBjbGFzc29mKGR1bW15KSAhPSBOVU1CRVIpXG4gICAgICAgID8gaW5oZXJpdElmUmVxdWlyZWQobmV3IE5hdGl2ZU51bWJlcih0b051bWJlcihpdCkpLCBkdW1teSwgTnVtYmVyV3JhcHBlcikgOiB0b051bWJlcihpdCk7XG4gIH07XG4gIGZvciAodmFyIGtleXMgPSBERVNDUklQVE9SUyA/IGdldE93blByb3BlcnR5TmFtZXMoTmF0aXZlTnVtYmVyKSA6IChcbiAgICAvLyBFUzM6XG4gICAgJ01BWF9WQUxVRSxNSU5fVkFMVUUsTmFOLE5FR0FUSVZFX0lORklOSVRZLFBPU0lUSVZFX0lORklOSVRZLCcgK1xuICAgIC8vIEVTMjAxNSAoaW4gY2FzZSwgaWYgbW9kdWxlcyB3aXRoIEVTMjAxNSBOdW1iZXIgc3RhdGljcyByZXF1aXJlZCBiZWZvcmUpOlxuICAgICdFUFNJTE9OLGlzRmluaXRlLGlzSW50ZWdlcixpc05hTixpc1NhZmVJbnRlZ2VyLE1BWF9TQUZFX0lOVEVHRVIsJyArXG4gICAgJ01JTl9TQUZFX0lOVEVHRVIscGFyc2VGbG9hdCxwYXJzZUludCxpc0ludGVnZXIsJyArXG4gICAgLy8gRVNOZXh0XG4gICAgJ2Zyb21TdHJpbmcscmFuZ2UnXG4gICkuc3BsaXQoJywnKSwgaiA9IDAsIGtleTsga2V5cy5sZW5ndGggPiBqOyBqKyspIHtcbiAgICBpZiAoaGFzKE5hdGl2ZU51bWJlciwga2V5ID0ga2V5c1tqXSkgJiYgIWhhcyhOdW1iZXJXcmFwcGVyLCBrZXkpKSB7XG4gICAgICBkZWZpbmVQcm9wZXJ0eShOdW1iZXJXcmFwcGVyLCBrZXksIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihOYXRpdmVOdW1iZXIsIGtleSkpO1xuICAgIH1cbiAgfVxuICBOdW1iZXJXcmFwcGVyLnByb3RvdHlwZSA9IE51bWJlclByb3RvdHlwZTtcbiAgTnVtYmVyUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTnVtYmVyV3JhcHBlcjtcbiAgcmVkZWZpbmUoZ2xvYmFsLCBOVU1CRVIsIE51bWJlcldyYXBwZXIpO1xufVxuIiwidmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgYXNzaWduID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1hc3NpZ24nKTtcblxuLy8gYE9iamVjdC5hc3NpZ25gIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuYXNzaWduXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tb2JqZWN0LWFzc2lnbiAtLSByZXF1aXJlZCBmb3IgdGVzdGluZ1xuJCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogT2JqZWN0LmFzc2lnbiAhPT0gYXNzaWduIH0sIHtcbiAgYXNzaWduOiBhc3NpZ25cbn0pO1xuIiwidmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBjcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZScpO1xuXG4vLyBgT2JqZWN0LmNyZWF0ZWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5jcmVhdGVcbiQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBzaGFtOiAhREVTQ1JJUFRPUlMgfSwge1xuICBjcmVhdGU6IGNyZWF0ZVxufSk7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIG9iamVjdERlZmluZVByb3BlcnR5TW9kaWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcblxuLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5kZWZpbmVwcm9wZXJ0eVxuJCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogIURFU0NSSVBUT1JTLCBzaGFtOiAhREVTQ1JJUFRPUlMgfSwge1xuICBkZWZpbmVQcm9wZXJ0eTogb2JqZWN0RGVmaW5lUHJvcGVydHlNb2RpbGUuZlxufSk7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciAkZW50cmllcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtdG8tYXJyYXknKS5lbnRyaWVzO1xuXG4vLyBgT2JqZWN0LmVudHJpZXNgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZW50cmllc1xuJCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUgfSwge1xuICBlbnRyaWVzOiBmdW5jdGlvbiBlbnRyaWVzKE8pIHtcbiAgICByZXR1cm4gJGVudHJpZXMoTyk7XG4gIH1cbn0pO1xuIiwidmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgdG9PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tb2JqZWN0Jyk7XG52YXIgbmF0aXZlS2V5cyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qta2V5cycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG5cbnZhciBGQUlMU19PTl9QUklNSVRJVkVTID0gZmFpbHMoZnVuY3Rpb24gKCkgeyBuYXRpdmVLZXlzKDEpOyB9KTtcblxuLy8gYE9iamVjdC5rZXlzYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmtleXNcbiQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBmb3JjZWQ6IEZBSUxTX09OX1BSSU1JVElWRVMgfSwge1xuICBrZXlzOiBmdW5jdGlvbiBrZXlzKGl0KSB7XG4gICAgcmV0dXJuIG5hdGl2ZUtleXModG9PYmplY3QoaXQpKTtcbiAgfVxufSk7XG4iLCJ2YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBzZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3Qtc2V0LXByb3RvdHlwZS1vZicpO1xuXG4vLyBgT2JqZWN0LnNldFByb3RvdHlwZU9mYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LnNldHByb3RvdHlwZW9mXG4kKHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSB9LCB7XG4gIHNldFByb3RvdHlwZU9mOiBzZXRQcm90b3R5cGVPZlxufSk7XG4iLCJ2YXIgVE9fU1RSSU5HX1RBR19TVVBQT1JUID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXN0cmluZy10YWctc3VwcG9ydCcpO1xudmFyIHJlZGVmaW5lID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lJyk7XG52YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXRvLXN0cmluZycpO1xuXG4vLyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC5wcm90b3R5cGUudG9zdHJpbmdcbmlmICghVE9fU1RSSU5HX1RBR19TVVBQT1JUKSB7XG4gIHJlZGVmaW5lKE9iamVjdC5wcm90b3R5cGUsICd0b1N0cmluZycsIHRvU3RyaW5nLCB7IHVuc2FmZTogdHJ1ZSB9KTtcbn1cbiIsInZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyICR2YWx1ZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LXRvLWFycmF5JykudmFsdWVzO1xuXG4vLyBgT2JqZWN0LnZhbHVlc2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLW9iamVjdC52YWx1ZXNcbiQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlIH0sIHtcbiAgdmFsdWVzOiBmdW5jdGlvbiB2YWx1ZXMoTykge1xuICAgIHJldHVybiAkdmFsdWVzKE8pO1xuICB9XG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIHBhcnNlSW50SW1wbGVtZW50YXRpb24gPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbnVtYmVyLXBhcnNlLWludCcpO1xuXG4vLyBgcGFyc2VJbnRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1wYXJzZWludC1zdHJpbmctcmFkaXhcbiQoeyBnbG9iYWw6IHRydWUsIGZvcmNlZDogcGFyc2VJbnQgIT0gcGFyc2VJbnRJbXBsZW1lbnRhdGlvbiB9LCB7XG4gIHBhcnNlSW50OiBwYXJzZUludEltcGxlbWVudGF0aW9uXG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIElTX1BVUkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtcHVyZScpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciBnZXRCdWlsdEluID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dldC1idWlsdC1pbicpO1xudmFyIE5hdGl2ZVByb21pc2UgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXByb21pc2UtY29uc3RydWN0b3InKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWRlZmluZScpO1xudmFyIHJlZGVmaW5lQWxsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZGVmaW5lLWFsbCcpO1xudmFyIHNldFByb3RvdHlwZU9mID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1zZXQtcHJvdG90eXBlLW9mJyk7XG52YXIgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2V0LXRvLXN0cmluZy10YWcnKTtcbnZhciBzZXRTcGVjaWVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC1zcGVjaWVzJyk7XG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtb2JqZWN0Jyk7XG52YXIgYUZ1bmN0aW9uID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2EtZnVuY3Rpb24nKTtcbnZhciBhbkluc3RhbmNlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FuLWluc3RhbmNlJyk7XG52YXIgaW5zcGVjdFNvdXJjZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnNwZWN0LXNvdXJjZScpO1xudmFyIGl0ZXJhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXRlcmF0ZScpO1xudmFyIGNoZWNrQ29ycmVjdG5lc3NPZkl0ZXJhdGlvbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jaGVjay1jb3JyZWN0bmVzcy1vZi1pdGVyYXRpb24nKTtcbnZhciBzcGVjaWVzQ29uc3RydWN0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc3BlY2llcy1jb25zdHJ1Y3RvcicpO1xudmFyIHRhc2sgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdGFzaycpLnNldDtcbnZhciBtaWNyb3Rhc2sgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbWljcm90YXNrJyk7XG52YXIgcHJvbWlzZVJlc29sdmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcHJvbWlzZS1yZXNvbHZlJyk7XG52YXIgaG9zdFJlcG9ydEVycm9ycyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9ob3N0LXJlcG9ydC1lcnJvcnMnKTtcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9uZXctcHJvbWlzZS1jYXBhYmlsaXR5Jyk7XG52YXIgcGVyZm9ybSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9wZXJmb3JtJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xudmFyIGlzRm9yY2VkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLWZvcmNlZCcpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIElTX0JST1dTRVIgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLWlzLWJyb3dzZXInKTtcbnZhciBJU19OT0RFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2VuZ2luZS1pcy1ub2RlJyk7XG52YXIgVjhfVkVSU0lPTiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9lbmdpbmUtdjgtdmVyc2lvbicpO1xuXG52YXIgU1BFQ0lFUyA9IHdlbGxLbm93blN5bWJvbCgnc3BlY2llcycpO1xudmFyIFBST01JU0UgPSAnUHJvbWlzZSc7XG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0O1xudmFyIHNldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLnNldDtcbnZhciBnZXRJbnRlcm5hbFByb21pc2VTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0dGVyRm9yKFBST01JU0UpO1xudmFyIE5hdGl2ZVByb21pc2VQcm90b3R5cGUgPSBOYXRpdmVQcm9taXNlICYmIE5hdGl2ZVByb21pc2UucHJvdG90eXBlO1xudmFyIFByb21pc2VDb25zdHJ1Y3RvciA9IE5hdGl2ZVByb21pc2U7XG52YXIgUHJvbWlzZUNvbnN0cnVjdG9yUHJvdG90eXBlID0gTmF0aXZlUHJvbWlzZVByb3RvdHlwZTtcbnZhciBUeXBlRXJyb3IgPSBnbG9iYWwuVHlwZUVycm9yO1xudmFyIGRvY3VtZW50ID0gZ2xvYmFsLmRvY3VtZW50O1xudmFyIHByb2Nlc3MgPSBnbG9iYWwucHJvY2VzcztcbnZhciBuZXdQcm9taXNlQ2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5TW9kdWxlLmY7XG52YXIgbmV3R2VuZXJpY1Byb21pc2VDYXBhYmlsaXR5ID0gbmV3UHJvbWlzZUNhcGFiaWxpdHk7XG52YXIgRElTUEFUQ0hfRVZFTlQgPSAhIShkb2N1bWVudCAmJiBkb2N1bWVudC5jcmVhdGVFdmVudCAmJiBnbG9iYWwuZGlzcGF0Y2hFdmVudCk7XG52YXIgTkFUSVZFX1JFSkVDVElPTl9FVkVOVCA9IHR5cGVvZiBQcm9taXNlUmVqZWN0aW9uRXZlbnQgPT0gJ2Z1bmN0aW9uJztcbnZhciBVTkhBTkRMRURfUkVKRUNUSU9OID0gJ3VuaGFuZGxlZHJlamVjdGlvbic7XG52YXIgUkVKRUNUSU9OX0hBTkRMRUQgPSAncmVqZWN0aW9uaGFuZGxlZCc7XG52YXIgUEVORElORyA9IDA7XG52YXIgRlVMRklMTEVEID0gMTtcbnZhciBSRUpFQ1RFRCA9IDI7XG52YXIgSEFORExFRCA9IDE7XG52YXIgVU5IQU5ETEVEID0gMjtcbnZhciBTVUJDTEFTU0lORyA9IGZhbHNlO1xudmFyIEludGVybmFsLCBPd25Qcm9taXNlQ2FwYWJpbGl0eSwgUHJvbWlzZVdyYXBwZXIsIG5hdGl2ZVRoZW47XG5cbnZhciBGT1JDRUQgPSBpc0ZvcmNlZChQUk9NSVNFLCBmdW5jdGlvbiAoKSB7XG4gIHZhciBQUk9NSVNFX0NPTlNUUlVDVE9SX1NPVVJDRSA9IGluc3BlY3RTb3VyY2UoUHJvbWlzZUNvbnN0cnVjdG9yKTtcbiAgdmFyIEdMT0JBTF9DT1JFX0pTX1BST01JU0UgPSBQUk9NSVNFX0NPTlNUUlVDVE9SX1NPVVJDRSAhPT0gU3RyaW5nKFByb21pc2VDb25zdHJ1Y3Rvcik7XG4gIC8vIFY4IDYuNiAoTm9kZSAxMCBhbmQgQ2hyb21lIDY2KSBoYXZlIGEgYnVnIHdpdGggcmVzb2x2aW5nIGN1c3RvbSB0aGVuYWJsZXNcbiAgLy8gaHR0cHM6Ly9idWdzLmNocm9taXVtLm9yZy9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9ODMwNTY1XG4gIC8vIFdlIGNhbid0IGRldGVjdCBpdCBzeW5jaHJvbm91c2x5LCBzbyBqdXN0IGNoZWNrIHZlcnNpb25zXG4gIGlmICghR0xPQkFMX0NPUkVfSlNfUFJPTUlTRSAmJiBWOF9WRVJTSU9OID09PSA2NikgcmV0dXJuIHRydWU7XG4gIC8vIFdlIG5lZWQgUHJvbWlzZSNmaW5hbGx5IGluIHRoZSBwdXJlIHZlcnNpb24gZm9yIHByZXZlbnRpbmcgcHJvdG90eXBlIHBvbGx1dGlvblxuICBpZiAoSVNfUFVSRSAmJiAhUHJvbWlzZUNvbnN0cnVjdG9yUHJvdG90eXBlWydmaW5hbGx5J10pIHJldHVybiB0cnVlO1xuICAvLyBXZSBjYW4ndCB1c2UgQEBzcGVjaWVzIGZlYXR1cmUgZGV0ZWN0aW9uIGluIFY4IHNpbmNlIGl0IGNhdXNlc1xuICAvLyBkZW9wdGltaXphdGlvbiBhbmQgcGVyZm9ybWFuY2UgZGVncmFkYXRpb25cbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzY3OVxuICBpZiAoVjhfVkVSU0lPTiA+PSA1MSAmJiAvbmF0aXZlIGNvZGUvLnRlc3QoUFJPTUlTRV9DT05TVFJVQ1RPUl9TT1VSQ0UpKSByZXR1cm4gZmFsc2U7XG4gIC8vIERldGVjdCBjb3JyZWN0bmVzcyBvZiBzdWJjbGFzc2luZyB3aXRoIEBAc3BlY2llcyBzdXBwb3J0XG4gIHZhciBwcm9taXNlID0gbmV3IFByb21pc2VDb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKDEpOyB9KTtcbiAgdmFyIEZha2VQcm9taXNlID0gZnVuY3Rpb24gKGV4ZWMpIHtcbiAgICBleGVjKGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfSwgZnVuY3Rpb24gKCkgeyAvKiBlbXB0eSAqLyB9KTtcbiAgfTtcbiAgdmFyIGNvbnN0cnVjdG9yID0gcHJvbWlzZS5jb25zdHJ1Y3RvciA9IHt9O1xuICBjb25zdHJ1Y3RvcltTUEVDSUVTXSA9IEZha2VQcm9taXNlO1xuICBTVUJDTEFTU0lORyA9IHByb21pc2UudGhlbihmdW5jdGlvbiAoKSB7IC8qIGVtcHR5ICovIH0pIGluc3RhbmNlb2YgRmFrZVByb21pc2U7XG4gIGlmICghU1VCQ0xBU1NJTkcpIHJldHVybiB0cnVlO1xuICAvLyBVbmhhbmRsZWQgcmVqZWN0aW9ucyB0cmFja2luZyBzdXBwb3J0LCBOb2RlSlMgUHJvbWlzZSB3aXRob3V0IGl0IGZhaWxzIEBAc3BlY2llcyB0ZXN0XG4gIHJldHVybiAhR0xPQkFMX0NPUkVfSlNfUFJPTUlTRSAmJiBJU19CUk9XU0VSICYmICFOQVRJVkVfUkVKRUNUSU9OX0VWRU5UO1xufSk7XG5cbnZhciBJTkNPUlJFQ1RfSVRFUkFUSU9OID0gRk9SQ0VEIHx8ICFjaGVja0NvcnJlY3RuZXNzT2ZJdGVyYXRpb24oZnVuY3Rpb24gKGl0ZXJhYmxlKSB7XG4gIFByb21pc2VDb25zdHJ1Y3Rvci5hbGwoaXRlcmFibGUpWydjYXRjaCddKGZ1bmN0aW9uICgpIHsgLyogZW1wdHkgKi8gfSk7XG59KTtcblxuLy8gaGVscGVyc1xudmFyIGlzVGhlbmFibGUgPSBmdW5jdGlvbiAoaXQpIHtcbiAgdmFyIHRoZW47XG4gIHJldHVybiBpc09iamVjdChpdCkgJiYgdHlwZW9mICh0aGVuID0gaXQudGhlbikgPT0gJ2Z1bmN0aW9uJyA/IHRoZW4gOiBmYWxzZTtcbn07XG5cbnZhciBub3RpZnkgPSBmdW5jdGlvbiAoc3RhdGUsIGlzUmVqZWN0KSB7XG4gIGlmIChzdGF0ZS5ub3RpZmllZCkgcmV0dXJuO1xuICBzdGF0ZS5ub3RpZmllZCA9IHRydWU7XG4gIHZhciBjaGFpbiA9IHN0YXRlLnJlYWN0aW9ucztcbiAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgdmFsdWUgPSBzdGF0ZS52YWx1ZTtcbiAgICB2YXIgb2sgPSBzdGF0ZS5zdGF0ZSA9PSBGVUxGSUxMRUQ7XG4gICAgdmFyIGluZGV4ID0gMDtcbiAgICAvLyB2YXJpYWJsZSBsZW5ndGggLSBjYW4ndCB1c2UgZm9yRWFjaFxuICAgIHdoaWxlIChjaGFpbi5sZW5ndGggPiBpbmRleCkge1xuICAgICAgdmFyIHJlYWN0aW9uID0gY2hhaW5baW5kZXgrK107XG4gICAgICB2YXIgaGFuZGxlciA9IG9rID8gcmVhY3Rpb24ub2sgOiByZWFjdGlvbi5mYWlsO1xuICAgICAgdmFyIHJlc29sdmUgPSByZWFjdGlvbi5yZXNvbHZlO1xuICAgICAgdmFyIHJlamVjdCA9IHJlYWN0aW9uLnJlamVjdDtcbiAgICAgIHZhciBkb21haW4gPSByZWFjdGlvbi5kb21haW47XG4gICAgICB2YXIgcmVzdWx0LCB0aGVuLCBleGl0ZWQ7XG4gICAgICB0cnkge1xuICAgICAgICBpZiAoaGFuZGxlcikge1xuICAgICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgIGlmIChzdGF0ZS5yZWplY3Rpb24gPT09IFVOSEFORExFRCkgb25IYW5kbGVVbmhhbmRsZWQoc3RhdGUpO1xuICAgICAgICAgICAgc3RhdGUucmVqZWN0aW9uID0gSEFORExFRDtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGhhbmRsZXIgPT09IHRydWUpIHJlc3VsdCA9IHZhbHVlO1xuICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGRvbWFpbikgZG9tYWluLmVudGVyKCk7XG4gICAgICAgICAgICByZXN1bHQgPSBoYW5kbGVyKHZhbHVlKTsgLy8gY2FuIHRocm93XG4gICAgICAgICAgICBpZiAoZG9tYWluKSB7XG4gICAgICAgICAgICAgIGRvbWFpbi5leGl0KCk7XG4gICAgICAgICAgICAgIGV4aXRlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChyZXN1bHQgPT09IHJlYWN0aW9uLnByb21pc2UpIHtcbiAgICAgICAgICAgIHJlamVjdChUeXBlRXJyb3IoJ1Byb21pc2UtY2hhaW4gY3ljbGUnKSk7XG4gICAgICAgICAgfSBlbHNlIGlmICh0aGVuID0gaXNUaGVuYWJsZShyZXN1bHQpKSB7XG4gICAgICAgICAgICB0aGVuLmNhbGwocmVzdWx0LCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0gZWxzZSByZXNvbHZlKHJlc3VsdCk7XG4gICAgICAgIH0gZWxzZSByZWplY3QodmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgaWYgKGRvbWFpbiAmJiAhZXhpdGVkKSBkb21haW4uZXhpdCgpO1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdGF0ZS5yZWFjdGlvbnMgPSBbXTtcbiAgICBzdGF0ZS5ub3RpZmllZCA9IGZhbHNlO1xuICAgIGlmIChpc1JlamVjdCAmJiAhc3RhdGUucmVqZWN0aW9uKSBvblVuaGFuZGxlZChzdGF0ZSk7XG4gIH0pO1xufTtcblxudmFyIGRpc3BhdGNoRXZlbnQgPSBmdW5jdGlvbiAobmFtZSwgcHJvbWlzZSwgcmVhc29uKSB7XG4gIHZhciBldmVudCwgaGFuZGxlcjtcbiAgaWYgKERJU1BBVENIX0VWRU5UKSB7XG4gICAgZXZlbnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnRXZlbnQnKTtcbiAgICBldmVudC5wcm9taXNlID0gcHJvbWlzZTtcbiAgICBldmVudC5yZWFzb24gPSByZWFzb247XG4gICAgZXZlbnQuaW5pdEV2ZW50KG5hbWUsIGZhbHNlLCB0cnVlKTtcbiAgICBnbG9iYWwuZGlzcGF0Y2hFdmVudChldmVudCk7XG4gIH0gZWxzZSBldmVudCA9IHsgcHJvbWlzZTogcHJvbWlzZSwgcmVhc29uOiByZWFzb24gfTtcbiAgaWYgKCFOQVRJVkVfUkVKRUNUSU9OX0VWRU5UICYmIChoYW5kbGVyID0gZ2xvYmFsWydvbicgKyBuYW1lXSkpIGhhbmRsZXIoZXZlbnQpO1xuICBlbHNlIGlmIChuYW1lID09PSBVTkhBTkRMRURfUkVKRUNUSU9OKSBob3N0UmVwb3J0RXJyb3JzKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCByZWFzb24pO1xufTtcblxudmFyIG9uVW5oYW5kbGVkID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gIHRhc2suY2FsbChnbG9iYWwsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJvbWlzZSA9IHN0YXRlLmZhY2FkZTtcbiAgICB2YXIgdmFsdWUgPSBzdGF0ZS52YWx1ZTtcbiAgICB2YXIgSVNfVU5IQU5ETEVEID0gaXNVbmhhbmRsZWQoc3RhdGUpO1xuICAgIHZhciByZXN1bHQ7XG4gICAgaWYgKElTX1VOSEFORExFRCkge1xuICAgICAgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmIChJU19OT0RFKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XG4gICAgICAgIH0gZWxzZSBkaXNwYXRjaEV2ZW50KFVOSEFORExFRF9SRUpFQ1RJT04sIHByb21pc2UsIHZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgLy8gQnJvd3NlcnMgc2hvdWxkIG5vdCB0cmlnZ2VyIGByZWplY3Rpb25IYW5kbGVkYCBldmVudCBpZiBpdCB3YXMgaGFuZGxlZCBoZXJlLCBOb2RlSlMgLSBzaG91bGRcbiAgICAgIHN0YXRlLnJlamVjdGlvbiA9IElTX05PREUgfHwgaXNVbmhhbmRsZWQoc3RhdGUpID8gVU5IQU5ETEVEIDogSEFORExFRDtcbiAgICAgIGlmIChyZXN1bHQuZXJyb3IpIHRocm93IHJlc3VsdC52YWx1ZTtcbiAgICB9XG4gIH0pO1xufTtcblxudmFyIGlzVW5oYW5kbGVkID0gZnVuY3Rpb24gKHN0YXRlKSB7XG4gIHJldHVybiBzdGF0ZS5yZWplY3Rpb24gIT09IEhBTkRMRUQgJiYgIXN0YXRlLnBhcmVudDtcbn07XG5cbnZhciBvbkhhbmRsZVVuaGFuZGxlZCA9IGZ1bmN0aW9uIChzdGF0ZSkge1xuICB0YXNrLmNhbGwoZ2xvYmFsLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb21pc2UgPSBzdGF0ZS5mYWNhZGU7XG4gICAgaWYgKElTX05PREUpIHtcbiAgICAgIHByb2Nlc3MuZW1pdCgncmVqZWN0aW9uSGFuZGxlZCcsIHByb21pc2UpO1xuICAgIH0gZWxzZSBkaXNwYXRjaEV2ZW50KFJFSkVDVElPTl9IQU5ETEVELCBwcm9taXNlLCBzdGF0ZS52YWx1ZSk7XG4gIH0pO1xufTtcblxudmFyIGJpbmQgPSBmdW5jdGlvbiAoZm4sIHN0YXRlLCB1bndyYXApIHtcbiAgcmV0dXJuIGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGZuKHN0YXRlLCB2YWx1ZSwgdW53cmFwKTtcbiAgfTtcbn07XG5cbnZhciBpbnRlcm5hbFJlamVjdCA9IGZ1bmN0aW9uIChzdGF0ZSwgdmFsdWUsIHVud3JhcCkge1xuICBpZiAoc3RhdGUuZG9uZSkgcmV0dXJuO1xuICBzdGF0ZS5kb25lID0gdHJ1ZTtcbiAgaWYgKHVud3JhcCkgc3RhdGUgPSB1bndyYXA7XG4gIHN0YXRlLnZhbHVlID0gdmFsdWU7XG4gIHN0YXRlLnN0YXRlID0gUkVKRUNURUQ7XG4gIG5vdGlmeShzdGF0ZSwgdHJ1ZSk7XG59O1xuXG52YXIgaW50ZXJuYWxSZXNvbHZlID0gZnVuY3Rpb24gKHN0YXRlLCB2YWx1ZSwgdW53cmFwKSB7XG4gIGlmIChzdGF0ZS5kb25lKSByZXR1cm47XG4gIHN0YXRlLmRvbmUgPSB0cnVlO1xuICBpZiAodW53cmFwKSBzdGF0ZSA9IHVud3JhcDtcbiAgdHJ5IHtcbiAgICBpZiAoc3RhdGUuZmFjYWRlID09PSB2YWx1ZSkgdGhyb3cgVHlwZUVycm9yKFwiUHJvbWlzZSBjYW4ndCBiZSByZXNvbHZlZCBpdHNlbGZcIik7XG4gICAgdmFyIHRoZW4gPSBpc1RoZW5hYmxlKHZhbHVlKTtcbiAgICBpZiAodGhlbikge1xuICAgICAgbWljcm90YXNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHdyYXBwZXIgPSB7IGRvbmU6IGZhbHNlIH07XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKHZhbHVlLFxuICAgICAgICAgICAgYmluZChpbnRlcm5hbFJlc29sdmUsIHdyYXBwZXIsIHN0YXRlKSxcbiAgICAgICAgICAgIGJpbmQoaW50ZXJuYWxSZWplY3QsIHdyYXBwZXIsIHN0YXRlKVxuICAgICAgICAgICk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgaW50ZXJuYWxSZWplY3Qod3JhcHBlciwgZXJyb3IsIHN0YXRlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN0YXRlLnZhbHVlID0gdmFsdWU7XG4gICAgICBzdGF0ZS5zdGF0ZSA9IEZVTEZJTExFRDtcbiAgICAgIG5vdGlmeShzdGF0ZSwgZmFsc2UpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpbnRlcm5hbFJlamVjdCh7IGRvbmU6IGZhbHNlIH0sIGVycm9yLCBzdGF0ZSk7XG4gIH1cbn07XG5cbi8vIGNvbnN0cnVjdG9yIHBvbHlmaWxsXG5pZiAoRk9SQ0VEKSB7XG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXG4gIFByb21pc2VDb25zdHJ1Y3RvciA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICBhbkluc3RhbmNlKHRoaXMsIFByb21pc2VDb25zdHJ1Y3RvciwgUFJPTUlTRSk7XG4gICAgYUZ1bmN0aW9uKGV4ZWN1dG9yKTtcbiAgICBJbnRlcm5hbC5jYWxsKHRoaXMpO1xuICAgIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhpcyk7XG4gICAgdHJ5IHtcbiAgICAgIGV4ZWN1dG9yKGJpbmQoaW50ZXJuYWxSZXNvbHZlLCBzdGF0ZSksIGJpbmQoaW50ZXJuYWxSZWplY3QsIHN0YXRlKSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGludGVybmFsUmVqZWN0KHN0YXRlLCBlcnJvcik7XG4gICAgfVxuICB9O1xuICBQcm9taXNlQ29uc3RydWN0b3JQcm90b3R5cGUgPSBQcm9taXNlQ29uc3RydWN0b3IucHJvdG90eXBlO1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnMgLS0gcmVxdWlyZWQgZm9yIGAubGVuZ3RoYFxuICBJbnRlcm5hbCA9IGZ1bmN0aW9uIFByb21pc2UoZXhlY3V0b3IpIHtcbiAgICBzZXRJbnRlcm5hbFN0YXRlKHRoaXMsIHtcbiAgICAgIHR5cGU6IFBST01JU0UsXG4gICAgICBkb25lOiBmYWxzZSxcbiAgICAgIG5vdGlmaWVkOiBmYWxzZSxcbiAgICAgIHBhcmVudDogZmFsc2UsXG4gICAgICByZWFjdGlvbnM6IFtdLFxuICAgICAgcmVqZWN0aW9uOiBmYWxzZSxcbiAgICAgIHN0YXRlOiBQRU5ESU5HLFxuICAgICAgdmFsdWU6IHVuZGVmaW5lZFxuICAgIH0pO1xuICB9O1xuICBJbnRlcm5hbC5wcm90b3R5cGUgPSByZWRlZmluZUFsbChQcm9taXNlQ29uc3RydWN0b3JQcm90b3R5cGUsIHtcbiAgICAvLyBgUHJvbWlzZS5wcm90b3R5cGUudGhlbmAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1wcm9taXNlLnByb3RvdHlwZS50aGVuXG4gICAgdGhlbjogZnVuY3Rpb24gdGhlbihvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCkge1xuICAgICAgdmFyIHN0YXRlID0gZ2V0SW50ZXJuYWxQcm9taXNlU3RhdGUodGhpcyk7XG4gICAgICB2YXIgcmVhY3Rpb24gPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShzcGVjaWVzQ29uc3RydWN0b3IodGhpcywgUHJvbWlzZUNvbnN0cnVjdG9yKSk7XG4gICAgICByZWFjdGlvbi5vayA9IHR5cGVvZiBvbkZ1bGZpbGxlZCA9PSAnZnVuY3Rpb24nID8gb25GdWxmaWxsZWQgOiB0cnVlO1xuICAgICAgcmVhY3Rpb24uZmFpbCA9IHR5cGVvZiBvblJlamVjdGVkID09ICdmdW5jdGlvbicgJiYgb25SZWplY3RlZDtcbiAgICAgIHJlYWN0aW9uLmRvbWFpbiA9IElTX05PREUgPyBwcm9jZXNzLmRvbWFpbiA6IHVuZGVmaW5lZDtcbiAgICAgIHN0YXRlLnBhcmVudCA9IHRydWU7XG4gICAgICBzdGF0ZS5yZWFjdGlvbnMucHVzaChyZWFjdGlvbik7XG4gICAgICBpZiAoc3RhdGUuc3RhdGUgIT0gUEVORElORykgbm90aWZ5KHN0YXRlLCBmYWxzZSk7XG4gICAgICByZXR1cm4gcmVhY3Rpb24ucHJvbWlzZTtcbiAgICB9LFxuICAgIC8vIGBQcm9taXNlLnByb3RvdHlwZS5jYXRjaGAgbWV0aG9kXG4gICAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1wcm9taXNlLnByb3RvdHlwZS5jYXRjaFxuICAgICdjYXRjaCc6IGZ1bmN0aW9uIChvblJlamVjdGVkKSB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XG4gICAgfVxuICB9KTtcbiAgT3duUHJvbWlzZUNhcGFiaWxpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByb21pc2UgPSBuZXcgSW50ZXJuYWwoKTtcbiAgICB2YXIgc3RhdGUgPSBnZXRJbnRlcm5hbFN0YXRlKHByb21pc2UpO1xuICAgIHRoaXMucHJvbWlzZSA9IHByb21pc2U7XG4gICAgdGhpcy5yZXNvbHZlID0gYmluZChpbnRlcm5hbFJlc29sdmUsIHN0YXRlKTtcbiAgICB0aGlzLnJlamVjdCA9IGJpbmQoaW50ZXJuYWxSZWplY3QsIHN0YXRlKTtcbiAgfTtcbiAgbmV3UHJvbWlzZUNhcGFiaWxpdHlNb2R1bGUuZiA9IG5ld1Byb21pc2VDYXBhYmlsaXR5ID0gZnVuY3Rpb24gKEMpIHtcbiAgICByZXR1cm4gQyA9PT0gUHJvbWlzZUNvbnN0cnVjdG9yIHx8IEMgPT09IFByb21pc2VXcmFwcGVyXG4gICAgICA/IG5ldyBPd25Qcm9taXNlQ2FwYWJpbGl0eShDKVxuICAgICAgOiBuZXdHZW5lcmljUHJvbWlzZUNhcGFiaWxpdHkoQyk7XG4gIH07XG5cbiAgaWYgKCFJU19QVVJFICYmIHR5cGVvZiBOYXRpdmVQcm9taXNlID09ICdmdW5jdGlvbicgJiYgTmF0aXZlUHJvbWlzZVByb3RvdHlwZSAhPT0gT2JqZWN0LnByb3RvdHlwZSkge1xuICAgIG5hdGl2ZVRoZW4gPSBOYXRpdmVQcm9taXNlUHJvdG90eXBlLnRoZW47XG5cbiAgICBpZiAoIVNVQkNMQVNTSU5HKSB7XG4gICAgICAvLyBtYWtlIGBQcm9taXNlI3RoZW5gIHJldHVybiBhIHBvbHlmaWxsZWQgYFByb21pc2VgIGZvciBuYXRpdmUgcHJvbWlzZS1iYXNlZCBBUElzXG4gICAgICByZWRlZmluZShOYXRpdmVQcm9taXNlUHJvdG90eXBlLCAndGhlbicsIGZ1bmN0aW9uIHRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpIHtcbiAgICAgICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VDb25zdHJ1Y3RvcihmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgbmF0aXZlVGhlbi5jYWxsKHRoYXQsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICAgIH0pLnRoZW4ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpO1xuICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzY0MFxuICAgICAgfSwgeyB1bnNhZmU6IHRydWUgfSk7XG5cbiAgICAgIC8vIG1ha2VzIHN1cmUgdGhhdCBuYXRpdmUgcHJvbWlzZS1iYXNlZCBBUElzIGBQcm9taXNlI2NhdGNoYCBwcm9wZXJseSB3b3JrcyB3aXRoIHBhdGNoZWQgYFByb21pc2UjdGhlbmBcbiAgICAgIHJlZGVmaW5lKE5hdGl2ZVByb21pc2VQcm90b3R5cGUsICdjYXRjaCcsIFByb21pc2VDb25zdHJ1Y3RvclByb3RvdHlwZVsnY2F0Y2gnXSwgeyB1bnNhZmU6IHRydWUgfSk7XG4gICAgfVxuXG4gICAgLy8gbWFrZSBgLmNvbnN0cnVjdG9yID09PSBQcm9taXNlYCB3b3JrIGZvciBuYXRpdmUgcHJvbWlzZS1iYXNlZCBBUElzXG4gICAgdHJ5IHtcbiAgICAgIGRlbGV0ZSBOYXRpdmVQcm9taXNlUHJvdG90eXBlLmNvbnN0cnVjdG9yO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7IC8qIGVtcHR5ICovIH1cblxuICAgIC8vIG1ha2UgYGluc3RhbmNlb2YgUHJvbWlzZWAgd29yayBmb3IgbmF0aXZlIHByb21pc2UtYmFzZWQgQVBJc1xuICAgIGlmIChzZXRQcm90b3R5cGVPZikge1xuICAgICAgc2V0UHJvdG90eXBlT2YoTmF0aXZlUHJvbWlzZVByb3RvdHlwZSwgUHJvbWlzZUNvbnN0cnVjdG9yUHJvdG90eXBlKTtcbiAgICB9XG4gIH1cbn1cblxuJCh7IGdsb2JhbDogdHJ1ZSwgd3JhcDogdHJ1ZSwgZm9yY2VkOiBGT1JDRUQgfSwge1xuICBQcm9taXNlOiBQcm9taXNlQ29uc3RydWN0b3Jcbn0pO1xuXG5zZXRUb1N0cmluZ1RhZyhQcm9taXNlQ29uc3RydWN0b3IsIFBST01JU0UsIGZhbHNlLCB0cnVlKTtcbnNldFNwZWNpZXMoUFJPTUlTRSk7XG5cblByb21pc2VXcmFwcGVyID0gZ2V0QnVpbHRJbihQUk9NSVNFKTtcblxuLy8gc3RhdGljc1xuJCh7IHRhcmdldDogUFJPTUlTRSwgc3RhdDogdHJ1ZSwgZm9yY2VkOiBGT1JDRUQgfSwge1xuICAvLyBgUHJvbWlzZS5yZWplY3RgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXByb21pc2UucmVqZWN0XG4gIHJlamVjdDogZnVuY3Rpb24gcmVqZWN0KHIpIHtcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KHRoaXMpO1xuICAgIGNhcGFiaWxpdHkucmVqZWN0LmNhbGwodW5kZWZpbmVkLCByKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcblxuJCh7IHRhcmdldDogUFJPTUlTRSwgc3RhdDogdHJ1ZSwgZm9yY2VkOiBJU19QVVJFIHx8IEZPUkNFRCB9LCB7XG4gIC8vIGBQcm9taXNlLnJlc29sdmVgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXByb21pc2UucmVzb2x2ZVxuICByZXNvbHZlOiBmdW5jdGlvbiByZXNvbHZlKHgpIHtcbiAgICByZXR1cm4gcHJvbWlzZVJlc29sdmUoSVNfUFVSRSAmJiB0aGlzID09PSBQcm9taXNlV3JhcHBlciA/IFByb21pc2VDb25zdHJ1Y3RvciA6IHRoaXMsIHgpO1xuICB9XG59KTtcblxuJCh7IHRhcmdldDogUFJPTUlTRSwgc3RhdDogdHJ1ZSwgZm9yY2VkOiBJTkNPUlJFQ1RfSVRFUkFUSU9OIH0sIHtcbiAgLy8gYFByb21pc2UuYWxsYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1wcm9taXNlLmFsbFxuICBhbGw6IGZ1bmN0aW9uIGFsbChpdGVyYWJsZSkge1xuICAgIHZhciBDID0gdGhpcztcbiAgICB2YXIgY2FwYWJpbGl0eSA9IG5ld1Byb21pc2VDYXBhYmlsaXR5KEMpO1xuICAgIHZhciByZXNvbHZlID0gY2FwYWJpbGl0eS5yZXNvbHZlO1xuICAgIHZhciByZWplY3QgPSBjYXBhYmlsaXR5LnJlamVjdDtcbiAgICB2YXIgcmVzdWx0ID0gcGVyZm9ybShmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgJHByb21pc2VSZXNvbHZlID0gYUZ1bmN0aW9uKEMucmVzb2x2ZSk7XG4gICAgICB2YXIgdmFsdWVzID0gW107XG4gICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICB2YXIgcmVtYWluaW5nID0gMTtcbiAgICAgIGl0ZXJhdGUoaXRlcmFibGUsIGZ1bmN0aW9uIChwcm9taXNlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IGNvdW50ZXIrKztcbiAgICAgICAgdmFyIGFscmVhZHlDYWxsZWQgPSBmYWxzZTtcbiAgICAgICAgdmFsdWVzLnB1c2godW5kZWZpbmVkKTtcbiAgICAgICAgcmVtYWluaW5nKys7XG4gICAgICAgICRwcm9taXNlUmVzb2x2ZS5jYWxsKEMsIHByb21pc2UpLnRoZW4oZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgaWYgKGFscmVhZHlDYWxsZWQpIHJldHVybjtcbiAgICAgICAgICBhbHJlYWR5Q2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgICB2YWx1ZXNbaW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9LCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICAtLXJlbWFpbmluZyB8fCByZXNvbHZlKHZhbHVlcyk7XG4gICAgfSk7XG4gICAgaWYgKHJlc3VsdC5lcnJvcikgcmVqZWN0KHJlc3VsdC52YWx1ZSk7XG4gICAgcmV0dXJuIGNhcGFiaWxpdHkucHJvbWlzZTtcbiAgfSxcbiAgLy8gYFByb21pc2UucmFjZWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtcHJvbWlzZS5yYWNlXG4gIHJhY2U6IGZ1bmN0aW9uIHJhY2UoaXRlcmFibGUpIHtcbiAgICB2YXIgQyA9IHRoaXM7XG4gICAgdmFyIGNhcGFiaWxpdHkgPSBuZXdQcm9taXNlQ2FwYWJpbGl0eShDKTtcbiAgICB2YXIgcmVqZWN0ID0gY2FwYWJpbGl0eS5yZWplY3Q7XG4gICAgdmFyIHJlc3VsdCA9IHBlcmZvcm0oZnVuY3Rpb24gKCkge1xuICAgICAgdmFyICRwcm9taXNlUmVzb2x2ZSA9IGFGdW5jdGlvbihDLnJlc29sdmUpO1xuICAgICAgaXRlcmF0ZShpdGVyYWJsZSwgZnVuY3Rpb24gKHByb21pc2UpIHtcbiAgICAgICAgJHByb21pc2VSZXNvbHZlLmNhbGwoQywgcHJvbWlzZSkudGhlbihjYXBhYmlsaXR5LnJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBpZiAocmVzdWx0LmVycm9yKSByZWplY3QocmVzdWx0LnZhbHVlKTtcbiAgICByZXR1cm4gY2FwYWJpbGl0eS5wcm9taXNlO1xuICB9XG59KTtcbiIsInZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIERFU0NSSVBUT1JTID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2Rlc2NyaXB0b3JzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgdG9Qcm9wZXJ0eUtleSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1wcm9wZXJ0eS1rZXknKTtcbnZhciBkZWZpbmVQcm9wZXJ0eU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcblxuLy8gTVMgRWRnZSBoYXMgYnJva2VuIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkgLSB0aHJvd2luZyBpbnN0ZWFkIG9mIHJldHVybmluZyBmYWxzZVxudmFyIEVSUk9SX0lOU1RFQURfT0ZfRkFMU0UgPSBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBlcy9uby1yZWZsZWN0IC0tIHJlcXVpcmVkIGZvciB0ZXN0aW5nXG4gIFJlZmxlY3QuZGVmaW5lUHJvcGVydHkoZGVmaW5lUHJvcGVydHlNb2R1bGUuZih7fSwgMSwgeyB2YWx1ZTogMSB9KSwgMSwgeyB2YWx1ZTogMiB9KTtcbn0pO1xuXG4vLyBgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXJlZmxlY3QuZGVmaW5lcHJvcGVydHlcbiQoeyB0YXJnZXQ6ICdSZWZsZWN0Jywgc3RhdDogdHJ1ZSwgZm9yY2VkOiBFUlJPUl9JTlNURUFEX09GX0ZBTFNFLCBzaGFtOiAhREVTQ1JJUFRPUlMgfSwge1xuICBkZWZpbmVQcm9wZXJ0eTogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBwcm9wZXJ0eUtleSwgYXR0cmlidXRlcykge1xuICAgIGFuT2JqZWN0KHRhcmdldCk7XG4gICAgdmFyIGtleSA9IHRvUHJvcGVydHlLZXkocHJvcGVydHlLZXkpO1xuICAgIGFuT2JqZWN0KGF0dHJpYnV0ZXMpO1xuICAgIHRyeSB7XG4gICAgICBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mKHRhcmdldCwga2V5LCBhdHRyaWJ1dGVzKTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGV4ZWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVnZXhwLWV4ZWMnKTtcblxuLy8gYFJlZ0V4cC5wcm90b3R5cGUuZXhlY2AgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUuZXhlY1xuJCh7IHRhcmdldDogJ1JlZ0V4cCcsIHByb3RvOiB0cnVlLCBmb3JjZWQ6IC8uLy5leGVjICE9PSBleGVjIH0sIHtcbiAgZXhlYzogZXhlY1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgcmVkZWZpbmUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvcmVkZWZpbmUnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciAkdG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nJyk7XG52YXIgZmFpbHMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZmFpbHMnKTtcbnZhciBmbGFncyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZmxhZ3MnKTtcblxudmFyIFRPX1NUUklORyA9ICd0b1N0cmluZyc7XG52YXIgUmVnRXhwUHJvdG90eXBlID0gUmVnRXhwLnByb3RvdHlwZTtcbnZhciBuYXRpdmVUb1N0cmluZyA9IFJlZ0V4cFByb3RvdHlwZVtUT19TVFJJTkddO1xuXG52YXIgTk9UX0dFTkVSSUMgPSBmYWlscyhmdW5jdGlvbiAoKSB7IHJldHVybiBuYXRpdmVUb1N0cmluZy5jYWxsKHsgc291cmNlOiAnYScsIGZsYWdzOiAnYicgfSkgIT0gJy9hL2InOyB9KTtcbi8vIEZGNDQtIFJlZ0V4cCN0b1N0cmluZyBoYXMgYSB3cm9uZyBuYW1lXG52YXIgSU5DT1JSRUNUX05BTUUgPSBuYXRpdmVUb1N0cmluZy5uYW1lICE9IFRPX1NUUklORztcblxuLy8gYFJlZ0V4cC5wcm90b3R5cGUudG9TdHJpbmdgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1yZWdleHAucHJvdG90eXBlLnRvc3RyaW5nXG5pZiAoTk9UX0dFTkVSSUMgfHwgSU5DT1JSRUNUX05BTUUpIHtcbiAgcmVkZWZpbmUoUmVnRXhwLnByb3RvdHlwZSwgVE9fU1RSSU5HLCBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICB2YXIgUiA9IGFuT2JqZWN0KHRoaXMpO1xuICAgIHZhciBwID0gJHRvU3RyaW5nKFIuc291cmNlKTtcbiAgICB2YXIgcmYgPSBSLmZsYWdzO1xuICAgIHZhciBmID0gJHRvU3RyaW5nKHJmID09PSB1bmRlZmluZWQgJiYgUiBpbnN0YW5jZW9mIFJlZ0V4cCAmJiAhKCdmbGFncycgaW4gUmVnRXhwUHJvdG90eXBlKSA/IGZsYWdzLmNhbGwoUikgOiByZik7XG4gICAgcmV0dXJuICcvJyArIHAgKyAnLycgKyBmO1xuICB9LCB7IHVuc2FmZTogdHJ1ZSB9KTtcbn1cbiIsIid1c2Ugc3RyaWN0JztcbnZhciBjb2xsZWN0aW9uID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvbGxlY3Rpb24nKTtcbnZhciBjb2xsZWN0aW9uU3Ryb25nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NvbGxlY3Rpb24tc3Ryb25nJyk7XG5cbi8vIGBTZXRgIGNvbnN0cnVjdG9yXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXNldC1vYmplY3RzXG5tb2R1bGUuZXhwb3J0cyA9IGNvbGxlY3Rpb24oJ1NldCcsIGZ1bmN0aW9uIChpbml0KSB7XG4gIHJldHVybiBmdW5jdGlvbiBTZXQoKSB7IHJldHVybiBpbml0KHRoaXMsIGFyZ3VtZW50cy5sZW5ndGggPyBhcmd1bWVudHNbMF0gOiB1bmRlZmluZWQpOyB9O1xufSwgY29sbGVjdGlvblN0cm9uZyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgY2hhckF0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3N0cmluZy1tdWx0aWJ5dGUnKS5jaGFyQXQ7XG52YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xudmFyIGRlZmluZUl0ZXJhdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RlZmluZS1pdGVyYXRvcicpO1xuXG52YXIgU1RSSU5HX0lURVJBVE9SID0gJ1N0cmluZyBJdGVyYXRvcic7XG52YXIgc2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuc2V0O1xudmFyIGdldEludGVybmFsU3RhdGUgPSBJbnRlcm5hbFN0YXRlTW9kdWxlLmdldHRlckZvcihTVFJJTkdfSVRFUkFUT1IpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZVtAQGl0ZXJhdG9yXWAgbWV0aG9kXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUtQEBpdGVyYXRvclxuZGVmaW5lSXRlcmF0b3IoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24gKGl0ZXJhdGVkKSB7XG4gIHNldEludGVybmFsU3RhdGUodGhpcywge1xuICAgIHR5cGU6IFNUUklOR19JVEVSQVRPUixcbiAgICBzdHJpbmc6IHRvU3RyaW5nKGl0ZXJhdGVkKSxcbiAgICBpbmRleDogMFxuICB9KTtcbi8vIGAlU3RyaW5nSXRlcmF0b3JQcm90b3R5cGUlLm5leHRgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy0lc3RyaW5naXRlcmF0b3Jwcm90b3R5cGUlLm5leHRcbn0sIGZ1bmN0aW9uIG5leHQoKSB7XG4gIHZhciBzdGF0ZSA9IGdldEludGVybmFsU3RhdGUodGhpcyk7XG4gIHZhciBzdHJpbmcgPSBzdGF0ZS5zdHJpbmc7XG4gIHZhciBpbmRleCA9IHN0YXRlLmluZGV4O1xuICB2YXIgcG9pbnQ7XG4gIGlmIChpbmRleCA+PSBzdHJpbmcubGVuZ3RoKSByZXR1cm4geyB2YWx1ZTogdW5kZWZpbmVkLCBkb25lOiB0cnVlIH07XG4gIHBvaW50ID0gY2hhckF0KHN0cmluZywgaW5kZXgpO1xuICBzdGF0ZS5pbmRleCArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7IHZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2UgfTtcbn0pO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgY3JlYXRlSFRNTCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtaHRtbCcpO1xudmFyIGZvcmNlZFN0cmluZ0hUTUxNZXRob2QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc3RyaW5nLWh0bWwtZm9yY2VkJyk7XG5cbi8vIGBTdHJpbmcucHJvdG90eXBlLmxpbmtgIG1ldGhvZFxuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1zdHJpbmcucHJvdG90eXBlLmxpbmtcbiQoeyB0YXJnZXQ6ICdTdHJpbmcnLCBwcm90bzogdHJ1ZSwgZm9yY2VkOiBmb3JjZWRTdHJpbmdIVE1MTWV0aG9kKCdsaW5rJykgfSwge1xuICBsaW5rOiBmdW5jdGlvbiBsaW5rKHVybCkge1xuICAgIHJldHVybiBjcmVhdGVIVE1MKHRoaXMsICdhJywgJ2hyZWYnLCB1cmwpO1xuICB9XG59KTtcbiIsIid1c2Ugc3RyaWN0JztcbnZhciBmaXhSZWdFeHBXZWxsS25vd25TeW1ib2xMb2dpYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9maXgtcmVnZXhwLXdlbGwta25vd24tc3ltYm9sLWxvZ2ljJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgdG9MZW5ndGggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tbGVuZ3RoJyk7XG52YXIgdG9TdHJpbmcgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8tc3RyaW5nJyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcbnZhciBhZHZhbmNlU3RyaW5nSW5kZXggPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYWR2YW5jZS1zdHJpbmctaW5kZXgnKTtcbnZhciByZWdFeHBFeGVjID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlZ2V4cC1leGVjLWFic3RyYWN0Jyk7XG5cbi8vIEBAbWF0Y2ggbG9naWNcbmZpeFJlZ0V4cFdlbGxLbm93blN5bWJvbExvZ2ljKCdtYXRjaCcsIGZ1bmN0aW9uIChNQVRDSCwgbmF0aXZlTWF0Y2gsIG1heWJlQ2FsbE5hdGl2ZSkge1xuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLm1hdGNoYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXN0cmluZy5wcm90b3R5cGUubWF0Y2hcbiAgICBmdW5jdGlvbiBtYXRjaChyZWdleHApIHtcbiAgICAgIHZhciBPID0gcmVxdWlyZU9iamVjdENvZXJjaWJsZSh0aGlzKTtcbiAgICAgIHZhciBtYXRjaGVyID0gcmVnZXhwID09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IHJlZ2V4cFtNQVRDSF07XG4gICAgICByZXR1cm4gbWF0Y2hlciAhPT0gdW5kZWZpbmVkID8gbWF0Y2hlci5jYWxsKHJlZ2V4cCwgTykgOiBuZXcgUmVnRXhwKHJlZ2V4cClbTUFUQ0hdKHRvU3RyaW5nKE8pKTtcbiAgICB9LFxuICAgIC8vIGBSZWdFeHAucHJvdG90eXBlW0BAbWF0Y2hdYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUtQEBtYXRjaFxuICAgIGZ1bmN0aW9uIChzdHJpbmcpIHtcbiAgICAgIHZhciByeCA9IGFuT2JqZWN0KHRoaXMpO1xuICAgICAgdmFyIFMgPSB0b1N0cmluZyhzdHJpbmcpO1xuICAgICAgdmFyIHJlcyA9IG1heWJlQ2FsbE5hdGl2ZShuYXRpdmVNYXRjaCwgcngsIFMpO1xuXG4gICAgICBpZiAocmVzLmRvbmUpIHJldHVybiByZXMudmFsdWU7XG5cbiAgICAgIGlmICghcnguZ2xvYmFsKSByZXR1cm4gcmVnRXhwRXhlYyhyeCwgUyk7XG5cbiAgICAgIHZhciBmdWxsVW5pY29kZSA9IHJ4LnVuaWNvZGU7XG4gICAgICByeC5sYXN0SW5kZXggPSAwO1xuICAgICAgdmFyIEEgPSBbXTtcbiAgICAgIHZhciBuID0gMDtcbiAgICAgIHZhciByZXN1bHQ7XG4gICAgICB3aGlsZSAoKHJlc3VsdCA9IHJlZ0V4cEV4ZWMocngsIFMpKSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbWF0Y2hTdHIgPSB0b1N0cmluZyhyZXN1bHRbMF0pO1xuICAgICAgICBBW25dID0gbWF0Y2hTdHI7XG4gICAgICAgIGlmIChtYXRjaFN0ciA9PT0gJycpIHJ4Lmxhc3RJbmRleCA9IGFkdmFuY2VTdHJpbmdJbmRleChTLCB0b0xlbmd0aChyeC5sYXN0SW5kZXgpLCBmdWxsVW5pY29kZSk7XG4gICAgICAgIG4rKztcbiAgICAgIH1cbiAgICAgIHJldHVybiBuID09PSAwID8gbnVsbCA6IEE7XG4gICAgfVxuICBdO1xufSk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgZml4UmVnRXhwV2VsbEtub3duU3ltYm9sTG9naWMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZml4LXJlZ2V4cC13ZWxsLWtub3duLXN5bWJvbC1sb2dpYycpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgYW5PYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvYW4tb2JqZWN0Jyk7XG52YXIgdG9JbnRlZ2VyID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWludGVnZXInKTtcbnZhciB0b0xlbmd0aCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1sZW5ndGgnKTtcbnZhciB0b1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1zdHJpbmcnKTtcbnZhciByZXF1aXJlT2JqZWN0Q29lcmNpYmxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3JlcXVpcmUtb2JqZWN0LWNvZXJjaWJsZScpO1xudmFyIGFkdmFuY2VTdHJpbmdJbmRleCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hZHZhbmNlLXN0cmluZy1pbmRleCcpO1xudmFyIGdldFN1YnN0aXR1dGlvbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtc3Vic3RpdHV0aW9uJyk7XG52YXIgcmVnRXhwRXhlYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWdleHAtZXhlYy1hYnN0cmFjdCcpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgUkVQTEFDRSA9IHdlbGxLbm93blN5bWJvbCgncmVwbGFjZScpO1xudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xuXG52YXIgbWF5YmVUb1N0cmluZyA9IGZ1bmN0aW9uIChpdCkge1xuICByZXR1cm4gaXQgPT09IHVuZGVmaW5lZCA/IGl0IDogU3RyaW5nKGl0KTtcbn07XG5cbi8vIElFIDw9IDExIHJlcGxhY2VzICQwIHdpdGggdGhlIHdob2xlIG1hdGNoLCBhcyBpZiBpdCB3YXMgJCZcbi8vIGh0dHBzOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzYwMjQ2NjYvZ2V0dGluZy1pZS10by1yZXBsYWNlLWEtcmVnZXgtd2l0aC10aGUtbGl0ZXJhbC1zdHJpbmctMFxudmFyIFJFUExBQ0VfS0VFUFNfJDAgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgcmVnZXhwL3ByZWZlci1lc2NhcGUtcmVwbGFjZW1lbnQtZG9sbGFyLWNoYXIgLS0gcmVxdWlyZWQgZm9yIHRlc3RpbmdcbiAgcmV0dXJuICdhJy5yZXBsYWNlKC8uLywgJyQwJykgPT09ICckMCc7XG59KSgpO1xuXG4vLyBTYWZhcmkgPD0gMTMuMC4zKD8pIHN1YnN0aXR1dGVzIG50aCBjYXB0dXJlIHdoZXJlIG4+bSB3aXRoIGFuIGVtcHR5IHN0cmluZ1xudmFyIFJFR0VYUF9SRVBMQUNFX1NVQlNUSVRVVEVTX1VOREVGSU5FRF9DQVBUVVJFID0gKGZ1bmN0aW9uICgpIHtcbiAgaWYgKC8uL1tSRVBMQUNFXSkge1xuICAgIHJldHVybiAvLi9bUkVQTEFDRV0oJ2EnLCAnJDAnKSA9PT0gJyc7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufSkoKTtcblxudmFyIFJFUExBQ0VfU1VQUE9SVFNfTkFNRURfR1JPVVBTID0gIWZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgdmFyIHJlID0gLy4vO1xuICByZS5leGVjID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICByZXN1bHQuZ3JvdXBzID0geyBhOiAnNycgfTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICByZXR1cm4gJycucmVwbGFjZShyZSwgJyQ8YT4nKSAhPT0gJzcnO1xufSk7XG5cbi8vIEBAcmVwbGFjZSBsb2dpY1xuZml4UmVnRXhwV2VsbEtub3duU3ltYm9sTG9naWMoJ3JlcGxhY2UnLCBmdW5jdGlvbiAoXywgbmF0aXZlUmVwbGFjZSwgbWF5YmVDYWxsTmF0aXZlKSB7XG4gIHZhciBVTlNBRkVfU1VCU1RJVFVURSA9IFJFR0VYUF9SRVBMQUNFX1NVQlNUSVRVVEVTX1VOREVGSU5FRF9DQVBUVVJFID8gJyQnIDogJyQwJztcblxuICByZXR1cm4gW1xuICAgIC8vIGBTdHJpbmcucHJvdG90eXBlLnJlcGxhY2VgIG1ldGhvZFxuICAgIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlXG4gICAgZnVuY3Rpb24gcmVwbGFjZShzZWFyY2hWYWx1ZSwgcmVwbGFjZVZhbHVlKSB7XG4gICAgICB2YXIgTyA9IHJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcyk7XG4gICAgICB2YXIgcmVwbGFjZXIgPSBzZWFyY2hWYWx1ZSA9PSB1bmRlZmluZWQgPyB1bmRlZmluZWQgOiBzZWFyY2hWYWx1ZVtSRVBMQUNFXTtcbiAgICAgIHJldHVybiByZXBsYWNlciAhPT0gdW5kZWZpbmVkXG4gICAgICAgID8gcmVwbGFjZXIuY2FsbChzZWFyY2hWYWx1ZSwgTywgcmVwbGFjZVZhbHVlKVxuICAgICAgICA6IG5hdGl2ZVJlcGxhY2UuY2FsbCh0b1N0cmluZyhPKSwgc2VhcmNoVmFsdWUsIHJlcGxhY2VWYWx1ZSk7XG4gICAgfSxcbiAgICAvLyBgUmVnRXhwLnByb3RvdHlwZVtAQHJlcGxhY2VdYCBtZXRob2RcbiAgICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXJlZ2V4cC5wcm90b3R5cGUtQEByZXBsYWNlXG4gICAgZnVuY3Rpb24gKHN0cmluZywgcmVwbGFjZVZhbHVlKSB7XG4gICAgICB2YXIgcnggPSBhbk9iamVjdCh0aGlzKTtcbiAgICAgIHZhciBTID0gdG9TdHJpbmcoc3RyaW5nKTtcblxuICAgICAgaWYgKFxuICAgICAgICB0eXBlb2YgcmVwbGFjZVZhbHVlID09PSAnc3RyaW5nJyAmJlxuICAgICAgICByZXBsYWNlVmFsdWUuaW5kZXhPZihVTlNBRkVfU1VCU1RJVFVURSkgPT09IC0xICYmXG4gICAgICAgIHJlcGxhY2VWYWx1ZS5pbmRleE9mKCckPCcpID09PSAtMVxuICAgICAgKSB7XG4gICAgICAgIHZhciByZXMgPSBtYXliZUNhbGxOYXRpdmUobmF0aXZlUmVwbGFjZSwgcngsIFMsIHJlcGxhY2VWYWx1ZSk7XG4gICAgICAgIGlmIChyZXMuZG9uZSkgcmV0dXJuIHJlcy52YWx1ZTtcbiAgICAgIH1cblxuICAgICAgdmFyIGZ1bmN0aW9uYWxSZXBsYWNlID0gdHlwZW9mIHJlcGxhY2VWYWx1ZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAgIGlmICghZnVuY3Rpb25hbFJlcGxhY2UpIHJlcGxhY2VWYWx1ZSA9IHRvU3RyaW5nKHJlcGxhY2VWYWx1ZSk7XG5cbiAgICAgIHZhciBnbG9iYWwgPSByeC5nbG9iYWw7XG4gICAgICBpZiAoZ2xvYmFsKSB7XG4gICAgICAgIHZhciBmdWxsVW5pY29kZSA9IHJ4LnVuaWNvZGU7XG4gICAgICAgIHJ4Lmxhc3RJbmRleCA9IDA7XG4gICAgICB9XG4gICAgICB2YXIgcmVzdWx0cyA9IFtdO1xuICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlZ0V4cEV4ZWMocngsIFMpO1xuICAgICAgICBpZiAocmVzdWx0ID09PSBudWxsKSBicmVhaztcblxuICAgICAgICByZXN1bHRzLnB1c2gocmVzdWx0KTtcbiAgICAgICAgaWYgKCFnbG9iYWwpIGJyZWFrO1xuXG4gICAgICAgIHZhciBtYXRjaFN0ciA9IHRvU3RyaW5nKHJlc3VsdFswXSk7XG4gICAgICAgIGlmIChtYXRjaFN0ciA9PT0gJycpIHJ4Lmxhc3RJbmRleCA9IGFkdmFuY2VTdHJpbmdJbmRleChTLCB0b0xlbmd0aChyeC5sYXN0SW5kZXgpLCBmdWxsVW5pY29kZSk7XG4gICAgICB9XG5cbiAgICAgIHZhciBhY2N1bXVsYXRlZFJlc3VsdCA9ICcnO1xuICAgICAgdmFyIG5leHRTb3VyY2VQb3NpdGlvbiA9IDA7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVzdWx0ID0gcmVzdWx0c1tpXTtcblxuICAgICAgICB2YXIgbWF0Y2hlZCA9IHRvU3RyaW5nKHJlc3VsdFswXSk7XG4gICAgICAgIHZhciBwb3NpdGlvbiA9IG1heChtaW4odG9JbnRlZ2VyKHJlc3VsdC5pbmRleCksIFMubGVuZ3RoKSwgMCk7XG4gICAgICAgIHZhciBjYXB0dXJlcyA9IFtdO1xuICAgICAgICAvLyBOT1RFOiBUaGlzIGlzIGVxdWl2YWxlbnQgdG9cbiAgICAgICAgLy8gICBjYXB0dXJlcyA9IHJlc3VsdC5zbGljZSgxKS5tYXAobWF5YmVUb1N0cmluZylcbiAgICAgICAgLy8gYnV0IGZvciBzb21lIHJlYXNvbiBgbmF0aXZlU2xpY2UuY2FsbChyZXN1bHQsIDEsIHJlc3VsdC5sZW5ndGgpYCAoY2FsbGVkIGluXG4gICAgICAgIC8vIHRoZSBzbGljZSBwb2x5ZmlsbCB3aGVuIHNsaWNpbmcgbmF0aXZlIGFycmF5cykgXCJkb2Vzbid0IHdvcmtcIiBpbiBzYWZhcmkgOSBhbmRcbiAgICAgICAgLy8gY2F1c2VzIGEgY3Jhc2ggKGh0dHBzOi8vcGFzdGViaW4uY29tL04yMVF6ZVFBKSB3aGVuIHRyeWluZyB0byBkZWJ1ZyBpdC5cbiAgICAgICAgZm9yICh2YXIgaiA9IDE7IGogPCByZXN1bHQubGVuZ3RoOyBqKyspIGNhcHR1cmVzLnB1c2gobWF5YmVUb1N0cmluZyhyZXN1bHRbal0pKTtcbiAgICAgICAgdmFyIG5hbWVkQ2FwdHVyZXMgPSByZXN1bHQuZ3JvdXBzO1xuICAgICAgICBpZiAoZnVuY3Rpb25hbFJlcGxhY2UpIHtcbiAgICAgICAgICB2YXIgcmVwbGFjZXJBcmdzID0gW21hdGNoZWRdLmNvbmNhdChjYXB0dXJlcywgcG9zaXRpb24sIFMpO1xuICAgICAgICAgIGlmIChuYW1lZENhcHR1cmVzICE9PSB1bmRlZmluZWQpIHJlcGxhY2VyQXJncy5wdXNoKG5hbWVkQ2FwdHVyZXMpO1xuICAgICAgICAgIHZhciByZXBsYWNlbWVudCA9IHRvU3RyaW5nKHJlcGxhY2VWYWx1ZS5hcHBseSh1bmRlZmluZWQsIHJlcGxhY2VyQXJncykpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcGxhY2VtZW50ID0gZ2V0U3Vic3RpdHV0aW9uKG1hdGNoZWQsIFMsIHBvc2l0aW9uLCBjYXB0dXJlcywgbmFtZWRDYXB0dXJlcywgcmVwbGFjZVZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocG9zaXRpb24gPj0gbmV4dFNvdXJjZVBvc2l0aW9uKSB7XG4gICAgICAgICAgYWNjdW11bGF0ZWRSZXN1bHQgKz0gUy5zbGljZShuZXh0U291cmNlUG9zaXRpb24sIHBvc2l0aW9uKSArIHJlcGxhY2VtZW50O1xuICAgICAgICAgIG5leHRTb3VyY2VQb3NpdGlvbiA9IHBvc2l0aW9uICsgbWF0Y2hlZC5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBhY2N1bXVsYXRlZFJlc3VsdCArIFMuc2xpY2UobmV4dFNvdXJjZVBvc2l0aW9uKTtcbiAgICB9XG4gIF07XG59LCAhUkVQTEFDRV9TVVBQT1JUU19OQU1FRF9HUk9VUFMgfHwgIVJFUExBQ0VfS0VFUFNfJDAgfHwgUkVHRVhQX1JFUExBQ0VfU1VCU1RJVFVURVNfVU5ERUZJTkVEX0NBUFRVUkUpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3InKS5mO1xudmFyIHRvTGVuZ3RoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLWxlbmd0aCcpO1xudmFyIHRvU3RyaW5nID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXN0cmluZycpO1xudmFyIG5vdEFSZWdFeHAgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbm90LWEtcmVnZXhwJyk7XG52YXIgcmVxdWlyZU9iamVjdENvZXJjaWJsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZXF1aXJlLW9iamVjdC1jb2VyY2libGUnKTtcbnZhciBjb3JyZWN0SXNSZWdFeHBMb2dpYyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jb3JyZWN0LWlzLXJlZ2V4cC1sb2dpYycpO1xudmFyIElTX1BVUkUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtcHVyZScpO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZXMvbm8tc3RyaW5nLXByb3RvdHlwZS1zdGFydHN3aXRoIC0tIHNhZmVcbnZhciAkc3RhcnRzV2l0aCA9ICcnLnN0YXJ0c1dpdGg7XG52YXIgbWluID0gTWF0aC5taW47XG5cbnZhciBDT1JSRUNUX0lTX1JFR0VYUF9MT0dJQyA9IGNvcnJlY3RJc1JlZ0V4cExvZ2ljKCdzdGFydHNXaXRoJyk7XG4vLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9wdWxsLzcwMlxudmFyIE1ETl9QT0xZRklMTF9CVUcgPSAhSVNfUFVSRSAmJiAhQ09SUkVDVF9JU19SRUdFWFBfTE9HSUMgJiYgISFmdW5jdGlvbiAoKSB7XG4gIHZhciBkZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFN0cmluZy5wcm90b3R5cGUsICdzdGFydHNXaXRoJyk7XG4gIHJldHVybiBkZXNjcmlwdG9yICYmICFkZXNjcmlwdG9yLndyaXRhYmxlO1xufSgpO1xuXG4vLyBgU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc3RyaW5nLnByb3RvdHlwZS5zdGFydHN3aXRoXG4kKHsgdGFyZ2V0OiAnU3RyaW5nJywgcHJvdG86IHRydWUsIGZvcmNlZDogIU1ETl9QT0xZRklMTF9CVUcgJiYgIUNPUlJFQ1RfSVNfUkVHRVhQX0xPR0lDIH0sIHtcbiAgc3RhcnRzV2l0aDogZnVuY3Rpb24gc3RhcnRzV2l0aChzZWFyY2hTdHJpbmcgLyogLCBwb3NpdGlvbiA9IDAgKi8pIHtcbiAgICB2YXIgdGhhdCA9IHRvU3RyaW5nKHJlcXVpcmVPYmplY3RDb2VyY2libGUodGhpcykpO1xuICAgIG5vdEFSZWdFeHAoc2VhcmNoU3RyaW5nKTtcbiAgICB2YXIgaW5kZXggPSB0b0xlbmd0aChtaW4oYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBhcmd1bWVudHNbMV0gOiB1bmRlZmluZWQsIHRoYXQubGVuZ3RoKSk7XG4gICAgdmFyIHNlYXJjaCA9IHRvU3RyaW5nKHNlYXJjaFN0cmluZyk7XG4gICAgcmV0dXJuICRzdGFydHNXaXRoXG4gICAgICA/ICRzdGFydHNXaXRoLmNhbGwodGhhdCwgc2VhcmNoLCBpbmRleClcbiAgICAgIDogdGhhdC5zbGljZShpbmRleCwgaW5kZXggKyBzZWFyY2gubGVuZ3RoKSA9PT0gc2VhcmNoO1xuICB9XG59KTtcbiIsIi8vIGBTeW1ib2wucHJvdG90eXBlLmRlc2NyaXB0aW9uYCBnZXR0ZXJcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc3ltYm9sLnByb3RvdHlwZS5kZXNjcmlwdGlvblxuJ3VzZSBzdHJpY3QnO1xudmFyICQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZXhwb3J0Jyk7XG52YXIgREVTQ1JJUFRPUlMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZGVzY3JpcHRvcnMnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLW9iamVjdCcpO1xudmFyIGRlZmluZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKS5mO1xudmFyIGNvcHlDb25zdHJ1Y3RvclByb3BlcnRpZXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY29weS1jb25zdHJ1Y3Rvci1wcm9wZXJ0aWVzJyk7XG5cbnZhciBOYXRpdmVTeW1ib2wgPSBnbG9iYWwuU3ltYm9sO1xuXG5pZiAoREVTQ1JJUFRPUlMgJiYgdHlwZW9mIE5hdGl2ZVN5bWJvbCA9PSAnZnVuY3Rpb24nICYmICghKCdkZXNjcmlwdGlvbicgaW4gTmF0aXZlU3ltYm9sLnByb3RvdHlwZSkgfHxcbiAgLy8gU2FmYXJpIDEyIGJ1Z1xuICBOYXRpdmVTeW1ib2woKS5kZXNjcmlwdGlvbiAhPT0gdW5kZWZpbmVkXG4pKSB7XG4gIHZhciBFbXB0eVN0cmluZ0Rlc2NyaXB0aW9uU3RvcmUgPSB7fTtcbiAgLy8gd3JhcCBTeW1ib2wgY29uc3RydWN0b3IgZm9yIGNvcnJlY3Qgd29yayB3aXRoIHVuZGVmaW5lZCBkZXNjcmlwdGlvblxuICB2YXIgU3ltYm9sV3JhcHBlciA9IGZ1bmN0aW9uIFN5bWJvbCgpIHtcbiAgICB2YXIgZGVzY3JpcHRpb24gPSBhcmd1bWVudHMubGVuZ3RoIDwgMSB8fCBhcmd1bWVudHNbMF0gPT09IHVuZGVmaW5lZCA/IHVuZGVmaW5lZCA6IFN0cmluZyhhcmd1bWVudHNbMF0pO1xuICAgIHZhciByZXN1bHQgPSB0aGlzIGluc3RhbmNlb2YgU3ltYm9sV3JhcHBlclxuICAgICAgPyBuZXcgTmF0aXZlU3ltYm9sKGRlc2NyaXB0aW9uKVxuICAgICAgLy8gaW4gRWRnZSAxMywgU3RyaW5nKFN5bWJvbCh1bmRlZmluZWQpKSA9PT0gJ1N5bWJvbCh1bmRlZmluZWQpJ1xuICAgICAgOiBkZXNjcmlwdGlvbiA9PT0gdW5kZWZpbmVkID8gTmF0aXZlU3ltYm9sKCkgOiBOYXRpdmVTeW1ib2woZGVzY3JpcHRpb24pO1xuICAgIGlmIChkZXNjcmlwdGlvbiA9PT0gJycpIEVtcHR5U3RyaW5nRGVzY3JpcHRpb25TdG9yZVtyZXN1bHRdID0gdHJ1ZTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBjb3B5Q29uc3RydWN0b3JQcm9wZXJ0aWVzKFN5bWJvbFdyYXBwZXIsIE5hdGl2ZVN5bWJvbCk7XG4gIHZhciBzeW1ib2xQcm90b3R5cGUgPSBTeW1ib2xXcmFwcGVyLnByb3RvdHlwZSA9IE5hdGl2ZVN5bWJvbC5wcm90b3R5cGU7XG4gIHN5bWJvbFByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFN5bWJvbFdyYXBwZXI7XG5cbiAgdmFyIHN5bWJvbFRvU3RyaW5nID0gc3ltYm9sUHJvdG90eXBlLnRvU3RyaW5nO1xuICB2YXIgbmF0aXZlID0gU3RyaW5nKE5hdGl2ZVN5bWJvbCgndGVzdCcpKSA9PSAnU3ltYm9sKHRlc3QpJztcbiAgdmFyIHJlZ2V4cCA9IC9eU3ltYm9sXFwoKC4qKVxcKVteKV0rJC87XG4gIGRlZmluZVByb3BlcnR5KHN5bWJvbFByb3RvdHlwZSwgJ2Rlc2NyaXB0aW9uJywge1xuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICBnZXQ6IGZ1bmN0aW9uIGRlc2NyaXB0aW9uKCkge1xuICAgICAgdmFyIHN5bWJvbCA9IGlzT2JqZWN0KHRoaXMpID8gdGhpcy52YWx1ZU9mKCkgOiB0aGlzO1xuICAgICAgdmFyIHN0cmluZyA9IHN5bWJvbFRvU3RyaW5nLmNhbGwoc3ltYm9sKTtcbiAgICAgIGlmIChoYXMoRW1wdHlTdHJpbmdEZXNjcmlwdGlvblN0b3JlLCBzeW1ib2wpKSByZXR1cm4gJyc7XG4gICAgICB2YXIgZGVzYyA9IG5hdGl2ZSA/IHN0cmluZy5zbGljZSg3LCAtMSkgOiBzdHJpbmcucmVwbGFjZShyZWdleHAsICckMScpO1xuICAgICAgcmV0dXJuIGRlc2MgPT09ICcnID8gdW5kZWZpbmVkIDogZGVzYztcbiAgICB9XG4gIH0pO1xuXG4gICQoeyBnbG9iYWw6IHRydWUsIGZvcmNlZDogdHJ1ZSB9LCB7XG4gICAgU3ltYm9sOiBTeW1ib2xXcmFwcGVyXG4gIH0pO1xufVxuIiwidmFyIGRlZmluZVdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZWZpbmUtd2VsbC1rbm93bi1zeW1ib2wnKTtcblxuLy8gYFN5bWJvbC5pdGVyYXRvcmAgd2VsbC1rbm93biBzeW1ib2xcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc3ltYm9sLml0ZXJhdG9yXG5kZWZpbmVXZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgJCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9leHBvcnQnKTtcbnZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgZ2V0QnVpbHRJbiA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nZXQtYnVpbHQtaW4nKTtcbnZhciBJU19QVVJFID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2lzLXB1cmUnKTtcbnZhciBERVNDUklQVE9SUyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kZXNjcmlwdG9ycycpO1xudmFyIE5BVElWRV9TWU1CT0wgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvbmF0aXZlLXN5bWJvbCcpO1xudmFyIGZhaWxzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2ZhaWxzJyk7XG52YXIgaGFzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2hhcycpO1xudmFyIGlzQXJyYXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaXMtYXJyYXknKTtcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1vYmplY3QnKTtcbnZhciBpc1N5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pcy1zeW1ib2wnKTtcbnZhciBhbk9iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9hbi1vYmplY3QnKTtcbnZhciB0b09iamVjdCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1vYmplY3QnKTtcbnZhciB0b0luZGV4ZWRPYmplY3QgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdG8taW5kZXhlZC1vYmplY3QnKTtcbnZhciB0b1Byb3BlcnR5S2V5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3RvLXByb3BlcnR5LWtleScpO1xudmFyICR0b1N0cmluZyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy90by1zdHJpbmcnKTtcbnZhciBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvY3JlYXRlLXByb3BlcnR5LWRlc2NyaXB0b3InKTtcbnZhciBuYXRpdmVPYmplY3RDcmVhdGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWNyZWF0ZScpO1xudmFyIG9iamVjdEtleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWtleXMnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eU5hbWVzTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzJyk7XG52YXIgZ2V0T3duUHJvcGVydHlOYW1lc0V4dGVybmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LW5hbWVzLWV4dGVybmFsJyk7XG52YXIgZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1nZXQtb3duLXByb3BlcnR5LXN5bWJvbHMnKTtcbnZhciBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JNb2R1bGUgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvb2JqZWN0LWdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpO1xudmFyIGRlZmluZVByb3BlcnR5TW9kdWxlID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL29iamVjdC1kZWZpbmUtcHJvcGVydHknKTtcbnZhciBwcm9wZXJ0eUlzRW51bWVyYWJsZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9vYmplY3QtcHJvcGVydHktaXMtZW51bWVyYWJsZScpO1xudmFyIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9jcmVhdGUtbm9uLWVudW1lcmFibGUtcHJvcGVydHknKTtcbnZhciByZWRlZmluZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9yZWRlZmluZScpO1xudmFyIHNoYXJlZCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9zaGFyZWQnKTtcbnZhciBzaGFyZWRLZXkgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvc2hhcmVkLWtleScpO1xudmFyIGhpZGRlbktleXMgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvaGlkZGVuLWtleXMnKTtcbnZhciB1aWQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvdWlkJyk7XG52YXIgd2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3dlbGwta25vd24tc3ltYm9sJyk7XG52YXIgd3JhcHBlZFdlbGxLbm93blN5bWJvbE1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbC13cmFwcGVkJyk7XG52YXIgZGVmaW5lV2VsbEtub3duU3ltYm9sID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RlZmluZS13ZWxsLWtub3duLXN5bWJvbCcpO1xudmFyIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL3NldC10by1zdHJpbmctdGFnJyk7XG52YXIgSW50ZXJuYWxTdGF0ZU1vZHVsZSA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9pbnRlcm5hbC1zdGF0ZScpO1xudmFyICRmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWl0ZXJhdGlvbicpLmZvckVhY2g7XG5cbnZhciBISURERU4gPSBzaGFyZWRLZXkoJ2hpZGRlbicpO1xudmFyIFNZTUJPTCA9ICdTeW1ib2wnO1xudmFyIFBST1RPVFlQRSA9ICdwcm90b3R5cGUnO1xudmFyIFRPX1BSSU1JVElWRSA9IHdlbGxLbm93blN5bWJvbCgndG9QcmltaXRpdmUnKTtcbnZhciBzZXRJbnRlcm5hbFN0YXRlID0gSW50ZXJuYWxTdGF0ZU1vZHVsZS5zZXQ7XG52YXIgZ2V0SW50ZXJuYWxTdGF0ZSA9IEludGVybmFsU3RhdGVNb2R1bGUuZ2V0dGVyRm9yKFNZTUJPTCk7XG52YXIgT2JqZWN0UHJvdG90eXBlID0gT2JqZWN0W1BST1RPVFlQRV07XG52YXIgJFN5bWJvbCA9IGdsb2JhbC5TeW1ib2w7XG52YXIgJHN0cmluZ2lmeSA9IGdldEJ1aWx0SW4oJ0pTT04nLCAnc3RyaW5naWZ5Jyk7XG52YXIgbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlLmY7XG52YXIgbmF0aXZlRGVmaW5lUHJvcGVydHkgPSBkZWZpbmVQcm9wZXJ0eU1vZHVsZS5mO1xudmFyIG5hdGl2ZUdldE93blByb3BlcnR5TmFtZXMgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzRXh0ZXJuYWwuZjtcbnZhciBuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZSA9IHByb3BlcnR5SXNFbnVtZXJhYmxlTW9kdWxlLmY7XG52YXIgQWxsU3ltYm9scyA9IHNoYXJlZCgnc3ltYm9scycpO1xudmFyIE9iamVjdFByb3RvdHlwZVN5bWJvbHMgPSBzaGFyZWQoJ29wLXN5bWJvbHMnKTtcbnZhciBTdHJpbmdUb1N5bWJvbFJlZ2lzdHJ5ID0gc2hhcmVkKCdzdHJpbmctdG8tc3ltYm9sLXJlZ2lzdHJ5Jyk7XG52YXIgU3ltYm9sVG9TdHJpbmdSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXRvLXN0cmluZy1yZWdpc3RyeScpO1xudmFyIFdlbGxLbm93blN5bWJvbHNTdG9yZSA9IHNoYXJlZCgnd2tzJyk7XG52YXIgUU9iamVjdCA9IGdsb2JhbC5RT2JqZWN0O1xuLy8gRG9uJ3QgdXNlIHNldHRlcnMgaW4gUXQgU2NyaXB0LCBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMTczXG52YXIgVVNFX1NFVFRFUiA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2NyaXB0b3IgPSBERVNDUklQVE9SUyAmJiBmYWlscyhmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RDcmVhdGUobmF0aXZlRGVmaW5lUHJvcGVydHkoe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gbmF0aXZlRGVmaW5lUHJvcGVydHkodGhpcywgJ2EnLCB7IHZhbHVlOiA3IH0pLmE7IH1cbiAgfSkpLmEgIT0gNztcbn0pID8gZnVuY3Rpb24gKE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgdmFyIE9iamVjdFByb3RvdHlwZURlc2NyaXB0b3IgPSBuYXRpdmVHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoT2JqZWN0UHJvdG90eXBlLCBQKTtcbiAgaWYgKE9iamVjdFByb3RvdHlwZURlc2NyaXB0b3IpIGRlbGV0ZSBPYmplY3RQcm90b3R5cGVbUF07XG4gIG5hdGl2ZURlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpO1xuICBpZiAoT2JqZWN0UHJvdG90eXBlRGVzY3JpcHRvciAmJiBPICE9PSBPYmplY3RQcm90b3R5cGUpIHtcbiAgICBuYXRpdmVEZWZpbmVQcm9wZXJ0eShPYmplY3RQcm90b3R5cGUsIFAsIE9iamVjdFByb3RvdHlwZURlc2NyaXB0b3IpO1xuICB9XG59IDogbmF0aXZlRGVmaW5lUHJvcGVydHk7XG5cbnZhciB3cmFwID0gZnVuY3Rpb24gKHRhZywgZGVzY3JpcHRpb24pIHtcbiAgdmFyIHN5bWJvbCA9IEFsbFN5bWJvbHNbdGFnXSA9IG5hdGl2ZU9iamVjdENyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRV0pO1xuICBzZXRJbnRlcm5hbFN0YXRlKHN5bWJvbCwge1xuICAgIHR5cGU6IFNZTUJPTCxcbiAgICB0YWc6IHRhZyxcbiAgICBkZXNjcmlwdGlvbjogZGVzY3JpcHRpb25cbiAgfSk7XG4gIGlmICghREVTQ1JJUFRPUlMpIHN5bWJvbC5kZXNjcmlwdGlvbiA9IGRlc2NyaXB0aW9uO1xuICByZXR1cm4gc3ltYm9sO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KE8sIFAsIEF0dHJpYnV0ZXMpIHtcbiAgaWYgKE8gPT09IE9iamVjdFByb3RvdHlwZSkgJGRlZmluZVByb3BlcnR5KE9iamVjdFByb3RvdHlwZVN5bWJvbHMsIFAsIEF0dHJpYnV0ZXMpO1xuICBhbk9iamVjdChPKTtcbiAgdmFyIGtleSA9IHRvUHJvcGVydHlLZXkoUCk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZiAoaGFzKEFsbFN5bWJvbHMsIGtleSkpIHtcbiAgICBpZiAoIUF0dHJpYnV0ZXMuZW51bWVyYWJsZSkge1xuICAgICAgaWYgKCFoYXMoTywgSElEREVOKSkgbmF0aXZlRGVmaW5lUHJvcGVydHkoTywgSElEREVOLCBjcmVhdGVQcm9wZXJ0eURlc2NyaXB0b3IoMSwge30pKTtcbiAgICAgIE9bSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGhhcyhPLCBISURERU4pICYmIE9bSElEREVOXVtrZXldKSBPW0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgQXR0cmlidXRlcyA9IG5hdGl2ZU9iamVjdENyZWF0ZShBdHRyaWJ1dGVzLCB7IGVudW1lcmFibGU6IGNyZWF0ZVByb3BlcnR5RGVzY3JpcHRvcigwLCBmYWxzZSkgfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzY3JpcHRvcihPLCBrZXksIEF0dHJpYnV0ZXMpO1xuICB9IHJldHVybiBuYXRpdmVEZWZpbmVQcm9wZXJ0eShPLCBrZXksIEF0dHJpYnV0ZXMpO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKSB7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIgcHJvcGVydGllcyA9IHRvSW5kZXhlZE9iamVjdChQcm9wZXJ0aWVzKTtcbiAgdmFyIGtleXMgPSBvYmplY3RLZXlzKHByb3BlcnRpZXMpLmNvbmNhdCgkZ2V0T3duUHJvcGVydHlTeW1ib2xzKHByb3BlcnRpZXMpKTtcbiAgJGZvckVhY2goa2V5cywgZnVuY3Rpb24gKGtleSkge1xuICAgIGlmICghREVTQ1JJUFRPUlMgfHwgJHByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwocHJvcGVydGllcywga2V5KSkgJGRlZmluZVByb3BlcnR5KE8sIGtleSwgcHJvcGVydGllc1trZXldKTtcbiAgfSk7XG4gIHJldHVybiBPO1xufTtcblxudmFyICRjcmVhdGUgPSBmdW5jdGlvbiBjcmVhdGUoTywgUHJvcGVydGllcykge1xuICByZXR1cm4gUHJvcGVydGllcyA9PT0gdW5kZWZpbmVkID8gbmF0aXZlT2JqZWN0Q3JlYXRlKE8pIDogJGRlZmluZVByb3BlcnRpZXMobmF0aXZlT2JqZWN0Q3JlYXRlKE8pLCBQcm9wZXJ0aWVzKTtcbn07XG5cbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShWKSB7XG4gIHZhciBQID0gdG9Qcm9wZXJ0eUtleShWKTtcbiAgdmFyIGVudW1lcmFibGUgPSBuYXRpdmVQcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHRoaXMsIFApO1xuICBpZiAodGhpcyA9PT0gT2JqZWN0UHJvdG90eXBlICYmIGhhcyhBbGxTeW1ib2xzLCBQKSAmJiAhaGFzKE9iamVjdFByb3RvdHlwZVN5bWJvbHMsIFApKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiBlbnVtZXJhYmxlIHx8ICFoYXModGhpcywgUCkgfHwgIWhhcyhBbGxTeW1ib2xzLCBQKSB8fCBoYXModGhpcywgSElEREVOKSAmJiB0aGlzW0hJRERFTl1bUF0gPyBlbnVtZXJhYmxlIDogdHJ1ZTtcbn07XG5cbnZhciAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApIHtcbiAgdmFyIGl0ID0gdG9JbmRleGVkT2JqZWN0KE8pO1xuICB2YXIga2V5ID0gdG9Qcm9wZXJ0eUtleShQKTtcbiAgaWYgKGl0ID09PSBPYmplY3RQcm90b3R5cGUgJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPYmplY3RQcm90b3R5cGVTeW1ib2xzLCBrZXkpKSByZXR1cm47XG4gIHZhciBkZXNjcmlwdG9yID0gbmF0aXZlR2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpO1xuICBpZiAoZGVzY3JpcHRvciAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKSB7XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZGVzY3JpcHRvcjtcbn07XG5cbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTykge1xuICB2YXIgbmFtZXMgPSBuYXRpdmVHZXRPd25Qcm9wZXJ0eU5hbWVzKHRvSW5kZXhlZE9iamVjdChPKSk7XG4gIHZhciByZXN1bHQgPSBbXTtcbiAgJGZvckVhY2gobmFtZXMsIGZ1bmN0aW9uIChrZXkpIHtcbiAgICBpZiAoIWhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoaGlkZGVuS2V5cywga2V5KSkgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhPKSB7XG4gIHZhciBJU19PQkpFQ1RfUFJPVE9UWVBFID0gTyA9PT0gT2JqZWN0UHJvdG90eXBlO1xuICB2YXIgbmFtZXMgPSBuYXRpdmVHZXRPd25Qcm9wZXJ0eU5hbWVzKElTX09CSkVDVF9QUk9UT1RZUEUgPyBPYmplY3RQcm90b3R5cGVTeW1ib2xzIDogdG9JbmRleGVkT2JqZWN0KE8pKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICAkZm9yRWFjaChuYW1lcywgZnVuY3Rpb24gKGtleSkge1xuICAgIGlmIChoYXMoQWxsU3ltYm9scywga2V5KSAmJiAoIUlTX09CSkVDVF9QUk9UT1RZUEUgfHwgaGFzKE9iamVjdFByb3RvdHlwZSwga2V5KSkpIHtcbiAgICAgIHJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIGBTeW1ib2xgIGNvbnN0cnVjdG9yXG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXN5bWJvbC1jb25zdHJ1Y3RvclxuaWYgKCFOQVRJVkVfU1lNQk9MKSB7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKSB7XG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiAkU3ltYm9sKSB0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvcicpO1xuICAgIHZhciBkZXNjcmlwdGlvbiA9ICFhcmd1bWVudHMubGVuZ3RoIHx8IGFyZ3VtZW50c1swXSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkIDogJHRvU3RyaW5nKGFyZ3VtZW50c1swXSk7XG4gICAgdmFyIHRhZyA9IHVpZChkZXNjcmlwdGlvbik7XG4gICAgdmFyIHNldHRlciA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgaWYgKHRoaXMgPT09IE9iamVjdFByb3RvdHlwZSkgc2V0dGVyLmNhbGwoT2JqZWN0UHJvdG90eXBlU3ltYm9scywgdmFsdWUpO1xuICAgICAgaWYgKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpIHRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjcmlwdG9yKHRoaXMsIHRhZywgY3JlYXRlUHJvcGVydHlEZXNjcmlwdG9yKDEsIHZhbHVlKSk7XG4gICAgfTtcbiAgICBpZiAoREVTQ1JJUFRPUlMgJiYgVVNFX1NFVFRFUikgc2V0U3ltYm9sRGVzY3JpcHRvcihPYmplY3RQcm90b3R5cGUsIHRhZywgeyBjb25maWd1cmFibGU6IHRydWUsIHNldDogc2V0dGVyIH0pO1xuICAgIHJldHVybiB3cmFwKHRhZywgZGVzY3JpcHRpb24pO1xuICB9O1xuXG4gIHJlZGVmaW5lKCRTeW1ib2xbUFJPVE9UWVBFXSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGdldEludGVybmFsU3RhdGUodGhpcykudGFnO1xuICB9KTtcblxuICByZWRlZmluZSgkU3ltYm9sLCAnd2l0aG91dFNldHRlcicsIGZ1bmN0aW9uIChkZXNjcmlwdGlvbikge1xuICAgIHJldHVybiB3cmFwKHVpZChkZXNjcmlwdGlvbiksIGRlc2NyaXB0aW9uKTtcbiAgfSk7XG5cbiAgcHJvcGVydHlJc0VudW1lcmFibGVNb2R1bGUuZiA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgZGVmaW5lUHJvcGVydHlNb2R1bGUuZiA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yTW9kdWxlLmYgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICBnZXRPd25Qcm9wZXJ0eU5hbWVzTW9kdWxlLmYgPSBnZXRPd25Qcm9wZXJ0eU5hbWVzRXh0ZXJuYWwuZiA9ICRnZXRPd25Qcm9wZXJ0eU5hbWVzO1xuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNNb2R1bGUuZiA9ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XG5cbiAgd3JhcHBlZFdlbGxLbm93blN5bWJvbE1vZHVsZS5mID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICByZXR1cm4gd3JhcCh3ZWxsS25vd25TeW1ib2wobmFtZSksIG5hbWUpO1xuICB9O1xuXG4gIGlmIChERVNDUklQVE9SUykge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLVN5bWJvbC1kZXNjcmlwdGlvblxuICAgIG5hdGl2ZURlZmluZVByb3BlcnR5KCRTeW1ib2xbUFJPVE9UWVBFXSwgJ2Rlc2NyaXB0aW9uJywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbiBkZXNjcmlwdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIGdldEludGVybmFsU3RhdGUodGhpcykuZGVzY3JpcHRpb247XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKCFJU19QVVJFKSB7XG4gICAgICByZWRlZmluZShPYmplY3RQcm90b3R5cGUsICdwcm9wZXJ0eUlzRW51bWVyYWJsZScsICRwcm9wZXJ0eUlzRW51bWVyYWJsZSwgeyB1bnNhZmU6IHRydWUgfSk7XG4gICAgfVxuICB9XG59XG5cbiQoeyBnbG9iYWw6IHRydWUsIHdyYXA6IHRydWUsIGZvcmNlZDogIU5BVElWRV9TWU1CT0wsIHNoYW06ICFOQVRJVkVfU1lNQk9MIH0sIHtcbiAgU3ltYm9sOiAkU3ltYm9sXG59KTtcblxuJGZvckVhY2gob2JqZWN0S2V5cyhXZWxsS25vd25TeW1ib2xzU3RvcmUpLCBmdW5jdGlvbiAobmFtZSkge1xuICBkZWZpbmVXZWxsS25vd25TeW1ib2wobmFtZSk7XG59KTtcblxuJCh7IHRhcmdldDogU1lNQk9MLCBzdGF0OiB0cnVlLCBmb3JjZWQ6ICFOQVRJVkVfU1lNQk9MIH0sIHtcbiAgLy8gYFN5bWJvbC5mb3JgIG1ldGhvZFxuICAvLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXN5bWJvbC5mb3JcbiAgJ2Zvcic6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgc3RyaW5nID0gJHRvU3RyaW5nKGtleSk7XG4gICAgaWYgKGhhcyhTdHJpbmdUb1N5bWJvbFJlZ2lzdHJ5LCBzdHJpbmcpKSByZXR1cm4gU3RyaW5nVG9TeW1ib2xSZWdpc3RyeVtzdHJpbmddO1xuICAgIHZhciBzeW1ib2wgPSAkU3ltYm9sKHN0cmluZyk7XG4gICAgU3RyaW5nVG9TeW1ib2xSZWdpc3RyeVtzdHJpbmddID0gc3ltYm9sO1xuICAgIFN5bWJvbFRvU3RyaW5nUmVnaXN0cnlbc3ltYm9sXSA9IHN0cmluZztcbiAgICByZXR1cm4gc3ltYm9sO1xuICB9LFxuICAvLyBgU3ltYm9sLmtleUZvcmAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc3ltYm9sLmtleWZvclxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihzeW0pIHtcbiAgICBpZiAoIWlzU3ltYm9sKHN5bSkpIHRocm93IFR5cGVFcnJvcihzeW0gKyAnIGlzIG5vdCBhIHN5bWJvbCcpO1xuICAgIGlmIChoYXMoU3ltYm9sVG9TdHJpbmdSZWdpc3RyeSwgc3ltKSkgcmV0dXJuIFN5bWJvbFRvU3RyaW5nUmVnaXN0cnlbc3ltXTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbiAoKSB7IFVTRV9TRVRURVIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uICgpIHsgVVNFX1NFVFRFUiA9IGZhbHNlOyB9XG59KTtcblxuJCh7IHRhcmdldDogJ09iamVjdCcsIHN0YXQ6IHRydWUsIGZvcmNlZDogIU5BVElWRV9TWU1CT0wsIHNoYW06ICFERVNDUklQVE9SUyB9LCB7XG4gIC8vIGBPYmplY3QuY3JlYXRlYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuY3JlYXRlXG4gIGNyZWF0ZTogJGNyZWF0ZSxcbiAgLy8gYE9iamVjdC5kZWZpbmVQcm9wZXJ0eWAgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnR5XG4gIGRlZmluZVByb3BlcnR5OiAkZGVmaW5lUHJvcGVydHksXG4gIC8vIGBPYmplY3QuZGVmaW5lUHJvcGVydGllc2AgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmRlZmluZXByb3BlcnRpZXNcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHlkZXNjcmlwdG9yc1xuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Jcbn0pO1xuXG4kKHsgdGFyZ2V0OiAnT2JqZWN0Jywgc3RhdDogdHJ1ZSwgZm9yY2VkOiAhTkFUSVZFX1NZTUJPTCB9LCB7XG4gIC8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc2AgbWV0aG9kXG4gIC8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtb2JqZWN0LmdldG93bnByb3BlcnR5bmFtZXNcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogJGdldE93blByb3BlcnR5TmFtZXMsXG4gIC8vIGBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzYCBtZXRob2RcbiAgLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1vYmplY3QuZ2V0b3ducHJvcGVydHlzeW1ib2xzXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogJGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIENocm9tZSAzOCBhbmQgMzkgYE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHNgIGZhaWxzIG9uIHByaW1pdGl2ZXNcbi8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTM0NDNcbiQoeyB0YXJnZXQ6ICdPYmplY3QnLCBzdGF0OiB0cnVlLCBmb3JjZWQ6IGZhaWxzKGZ1bmN0aW9uICgpIHsgZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlLmYoMSk7IH0pIH0sIHtcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMoaXQpIHtcbiAgICByZXR1cm4gZ2V0T3duUHJvcGVydHlTeW1ib2xzTW9kdWxlLmYodG9PYmplY3QoaXQpKTtcbiAgfVxufSk7XG5cbi8vIGBKU09OLnN0cmluZ2lmeWAgbWV0aG9kIGJlaGF2aW9yIHdpdGggc3ltYm9sc1xuLy8gaHR0cHM6Ly90YzM5LmVzL2VjbWEyNjIvI3NlYy1qc29uLnN0cmluZ2lmeVxuaWYgKCRzdHJpbmdpZnkpIHtcbiAgdmFyIEZPUkNFRF9KU09OX1NUUklOR0lGWSA9ICFOQVRJVkVfU1lNQk9MIHx8IGZhaWxzKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgc3ltYm9sID0gJFN5bWJvbCgpO1xuICAgIC8vIE1TIEVkZ2UgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIHt9XG4gICAgcmV0dXJuICRzdHJpbmdpZnkoW3N5bWJvbF0pICE9ICdbbnVsbF0nXG4gICAgICAvLyBXZWJLaXQgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIG51bGxcbiAgICAgIHx8ICRzdHJpbmdpZnkoeyBhOiBzeW1ib2wgfSkgIT0gJ3t9J1xuICAgICAgLy8gVjggdGhyb3dzIG9uIGJveGVkIHN5bWJvbHNcbiAgICAgIHx8ICRzdHJpbmdpZnkoT2JqZWN0KHN5bWJvbCkpICE9ICd7fSc7XG4gIH0pO1xuXG4gICQoeyB0YXJnZXQ6ICdKU09OJywgc3RhdDogdHJ1ZSwgZm9yY2VkOiBGT1JDRURfSlNPTl9TVFJJTkdJRlkgfSwge1xuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFycyAtLSByZXF1aXJlZCBmb3IgYC5sZW5ndGhgXG4gICAgc3RyaW5naWZ5OiBmdW5jdGlvbiBzdHJpbmdpZnkoaXQsIHJlcGxhY2VyLCBzcGFjZSkge1xuICAgICAgdmFyIGFyZ3MgPSBbaXRdO1xuICAgICAgdmFyIGluZGV4ID0gMTtcbiAgICAgIHZhciAkcmVwbGFjZXI7XG4gICAgICB3aGlsZSAoYXJndW1lbnRzLmxlbmd0aCA+IGluZGV4KSBhcmdzLnB1c2goYXJndW1lbnRzW2luZGV4KytdKTtcbiAgICAgICRyZXBsYWNlciA9IHJlcGxhY2VyO1xuICAgICAgaWYgKCFpc09iamVjdChyZXBsYWNlcikgJiYgaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpIHJldHVybjsgLy8gSUU4IHJldHVybnMgc3RyaW5nIG9uIHVuZGVmaW5lZFxuICAgICAgaWYgKCFpc0FycmF5KHJlcGxhY2VyKSkgcmVwbGFjZXIgPSBmdW5jdGlvbiAoa2V5LCB2YWx1ZSkge1xuICAgICAgICBpZiAodHlwZW9mICRyZXBsYWNlciA9PSAnZnVuY3Rpb24nKSB2YWx1ZSA9ICRyZXBsYWNlci5jYWxsKHRoaXMsIGtleSwgdmFsdWUpO1xuICAgICAgICBpZiAoIWlzU3ltYm9sKHZhbHVlKSkgcmV0dXJuIHZhbHVlO1xuICAgICAgfTtcbiAgICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICAgIHJldHVybiAkc3RyaW5naWZ5LmFwcGx5KG51bGwsIGFyZ3MpO1xuICAgIH1cbiAgfSk7XG59XG5cbi8vIGBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdYCBtZXRob2Rcbi8vIGh0dHBzOi8vdGMzOS5lcy9lY21hMjYyLyNzZWMtc3ltYm9sLnByb3RvdHlwZS1AQHRvcHJpbWl0aXZlXG5pZiAoISRTeW1ib2xbUFJPVE9UWVBFXVtUT19QUklNSVRJVkVdKSB7XG4gIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eSgkU3ltYm9sW1BST1RPVFlQRV0sIFRPX1BSSU1JVElWRSwgJFN5bWJvbFtQUk9UT1RZUEVdLnZhbHVlT2YpO1xufVxuLy8gYFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11gIHByb3BlcnR5XG4vLyBodHRwczovL3RjMzkuZXMvZWNtYTI2Mi8jc2VjLXN5bWJvbC5wcm90b3R5cGUtQEB0b3N0cmluZ3RhZ1xuc2V0VG9TdHJpbmdUYWcoJFN5bWJvbCwgU1lNQk9MKTtcblxuaGlkZGVuS2V5c1tISURERU5dID0gdHJ1ZTtcbiIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZ2xvYmFsJyk7XG52YXIgRE9NSXRlcmFibGVzID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2RvbS1pdGVyYWJsZXMnKTtcbnZhciBmb3JFYWNoID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2FycmF5LWZvci1lYWNoJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xuXG5mb3IgKHZhciBDT0xMRUNUSU9OX05BTUUgaW4gRE9NSXRlcmFibGVzKSB7XG4gIHZhciBDb2xsZWN0aW9uID0gZ2xvYmFsW0NPTExFQ1RJT05fTkFNRV07XG4gIHZhciBDb2xsZWN0aW9uUHJvdG90eXBlID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgLy8gc29tZSBDaHJvbWUgdmVyc2lvbnMgaGF2ZSBub24tY29uZmlndXJhYmxlIG1ldGhvZHMgb24gRE9NVG9rZW5MaXN0XG4gIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlICYmIENvbGxlY3Rpb25Qcm90b3R5cGUuZm9yRWFjaCAhPT0gZm9yRWFjaCkgdHJ5IHtcbiAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoQ29sbGVjdGlvblByb3RvdHlwZSwgJ2ZvckVhY2gnLCBmb3JFYWNoKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBDb2xsZWN0aW9uUHJvdG90eXBlLmZvckVhY2ggPSBmb3JFYWNoO1xuICB9XG59XG4iLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2dsb2JhbCcpO1xudmFyIERPTUl0ZXJhYmxlcyA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9kb20taXRlcmFibGVzJyk7XG52YXIgQXJyYXlJdGVyYXRvck1ldGhvZHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2VzLmFycmF5Lml0ZXJhdG9yJyk7XG52YXIgY3JlYXRlTm9uRW51bWVyYWJsZVByb3BlcnR5ID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2NyZWF0ZS1ub24tZW51bWVyYWJsZS1wcm9wZXJ0eScpO1xudmFyIHdlbGxLbm93blN5bWJvbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy93ZWxsLWtub3duLXN5bWJvbCcpO1xuXG52YXIgSVRFUkFUT1IgPSB3ZWxsS25vd25TeW1ib2woJ2l0ZXJhdG9yJyk7XG52YXIgVE9fU1RSSU5HX1RBRyA9IHdlbGxLbm93blN5bWJvbCgndG9TdHJpbmdUYWcnKTtcbnZhciBBcnJheVZhbHVlcyA9IEFycmF5SXRlcmF0b3JNZXRob2RzLnZhbHVlcztcblxuZm9yICh2YXIgQ09MTEVDVElPTl9OQU1FIGluIERPTUl0ZXJhYmxlcykge1xuICB2YXIgQ29sbGVjdGlvbiA9IGdsb2JhbFtDT0xMRUNUSU9OX05BTUVdO1xuICB2YXIgQ29sbGVjdGlvblByb3RvdHlwZSA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlKSB7XG4gICAgLy8gc29tZSBDaHJvbWUgdmVyc2lvbnMgaGF2ZSBub24tY29uZmlndXJhYmxlIG1ldGhvZHMgb24gRE9NVG9rZW5MaXN0XG4gICAgaWYgKENvbGxlY3Rpb25Qcm90b3R5cGVbSVRFUkFUT1JdICE9PSBBcnJheVZhbHVlcykgdHJ5IHtcbiAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShDb2xsZWN0aW9uUHJvdG90eXBlLCBJVEVSQVRPUiwgQXJyYXlWYWx1ZXMpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBDb2xsZWN0aW9uUHJvdG90eXBlW0lURVJBVE9SXSA9IEFycmF5VmFsdWVzO1xuICAgIH1cbiAgICBpZiAoIUNvbGxlY3Rpb25Qcm90b3R5cGVbVE9fU1RSSU5HX1RBR10pIHtcbiAgICAgIGNyZWF0ZU5vbkVudW1lcmFibGVQcm9wZXJ0eShDb2xsZWN0aW9uUHJvdG90eXBlLCBUT19TVFJJTkdfVEFHLCBDT0xMRUNUSU9OX05BTUUpO1xuICAgIH1cbiAgICBpZiAoRE9NSXRlcmFibGVzW0NPTExFQ1RJT05fTkFNRV0pIGZvciAodmFyIE1FVEhPRF9OQU1FIGluIEFycmF5SXRlcmF0b3JNZXRob2RzKSB7XG4gICAgICAvLyBzb21lIENocm9tZSB2ZXJzaW9ucyBoYXZlIG5vbi1jb25maWd1cmFibGUgbWV0aG9kcyBvbiBET01Ub2tlbkxpc3RcbiAgICAgIGlmIChDb2xsZWN0aW9uUHJvdG90eXBlW01FVEhPRF9OQU1FXSAhPT0gQXJyYXlJdGVyYXRvck1ldGhvZHNbTUVUSE9EX05BTUVdKSB0cnkge1xuICAgICAgICBjcmVhdGVOb25FbnVtZXJhYmxlUHJvcGVydHkoQ29sbGVjdGlvblByb3RvdHlwZSwgTUVUSE9EX05BTUUsIEFycmF5SXRlcmF0b3JNZXRob2RzW01FVEhPRF9OQU1FXSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBDb2xsZWN0aW9uUHJvdG90eXBlW01FVEhPRF9OQU1FXSA9IEFycmF5SXRlcmF0b3JNZXRob2RzW01FVEhPRF9OQU1FXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiIsInZhciAkID0gcmVxdWlyZSgnLi4vaW50ZXJuYWxzL2V4cG9ydCcpO1xudmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4uL2ludGVybmFscy9nbG9iYWwnKTtcbnZhciB1c2VyQWdlbnQgPSByZXF1aXJlKCcuLi9pbnRlcm5hbHMvZW5naW5lLXVzZXItYWdlbnQnKTtcblxudmFyIHNsaWNlID0gW10uc2xpY2U7XG52YXIgTVNJRSA9IC9NU0lFIC5cXC4vLnRlc3QodXNlckFnZW50KTsgLy8gPC0gZGlydHkgaWU5LSBjaGVja1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uIChzY2hlZHVsZXIpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChoYW5kbGVyLCB0aW1lb3V0IC8qICwgLi4uYXJndW1lbnRzICovKSB7XG4gICAgdmFyIGJvdW5kQXJncyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyO1xuICAgIHZhciBhcmdzID0gYm91bmRBcmdzID8gc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpIDogdW5kZWZpbmVkO1xuICAgIHJldHVybiBzY2hlZHVsZXIoYm91bmRBcmdzID8gZnVuY3Rpb24gKCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5ldy1mdW5jIC0tIHNwZWMgcmVxdWlyZW1lbnRcbiAgICAgICh0eXBlb2YgaGFuZGxlciA9PSAnZnVuY3Rpb24nID8gaGFuZGxlciA6IEZ1bmN0aW9uKGhhbmRsZXIpKS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9IDogaGFuZGxlciwgdGltZW91dCk7XG4gIH07XG59O1xuXG4vLyBpZTktIHNldFRpbWVvdXQgJiBzZXRJbnRlcnZhbCBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgZml4XG4vLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS90aW1lcnMtYW5kLXVzZXItcHJvbXB0cy5odG1sI3RpbWVyc1xuJCh7IGdsb2JhbDogdHJ1ZSwgYmluZDogdHJ1ZSwgZm9yY2VkOiBNU0lFIH0sIHtcbiAgLy8gYHNldFRpbWVvdXRgIG1ldGhvZFxuICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS90aW1lcnMtYW5kLXVzZXItcHJvbXB0cy5odG1sI2RvbS1zZXR0aW1lb3V0XG4gIHNldFRpbWVvdXQ6IHdyYXAoZ2xvYmFsLnNldFRpbWVvdXQpLFxuICAvLyBgc2V0SW50ZXJ2YWxgIG1ldGhvZFxuICAvLyBodHRwczovL2h0bWwuc3BlYy53aGF0d2cub3JnL211bHRpcGFnZS90aW1lcnMtYW5kLXVzZXItcHJvbXB0cy5odG1sI2RvbS1zZXRpbnRlcnZhbFxuICBzZXRJbnRlcnZhbDogd3JhcChnbG9iYWwuc2V0SW50ZXJ2YWwpXG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFBhcnRpY2xlc18xID0gcmVxdWlyZShcIi4uL1BhcnRpY2xlcy9QYXJ0aWNsZXNcIik7XG52YXIgU3RhcnNfMSA9IHJlcXVpcmUoXCIuL1N0YXJzXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgY2FudmFzID0gbmV3IFBhcnRpY2xlc18xLmRlZmF1bHQoJyNwYXJ0aWNsZXMnLCAnMmQnKTtcbmNhbnZhcy5zZXRQYXJ0aWNsZVNldHRpbmdzKFN0YXJzXzEuU3RhcnMuUGFydGljbGVzKTtcbmNhbnZhcy5zZXRJbnRlcmFjdGl2ZVNldHRpbmdzKFN0YXJzXzEuU3RhcnMuSW50ZXJhY3RpdmUpO1xuY2FudmFzLnN0YXJ0KCk7XG52YXIgcGF1c2VkID0gZmFsc2U7XG5XZWJQYWdlXzEuU2Nyb2xsSG9vay5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFdlYlBhZ2VfMS5TZWN0aW9ucy5nZXQoJ2NhbnZhcycpLmluVmlldygpKSB7XG4gICAgICAgIGlmIChwYXVzZWQpIHtcbiAgICAgICAgICAgIHBhdXNlZCA9IGZhbHNlO1xuICAgICAgICAgICAgY2FudmFzLnJlc3VtZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoIXBhdXNlZCkge1xuICAgICAgICAgICAgcGF1c2VkID0gdHJ1ZTtcbiAgICAgICAgICAgIGNhbnZhcy5wYXVzZSgpO1xuICAgICAgICB9XG4gICAgfVxufSwge1xuICAgIGNhcHR1cmU6IHRydWUsXG4gICAgcGFzc2l2ZTogdHJ1ZVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU3RhcnMgPSB2b2lkIDA7XG5leHBvcnRzLlN0YXJzID0ge1xuICAgIFBhcnRpY2xlczoge1xuICAgICAgICBudW1iZXI6IDMwMCxcbiAgICAgICAgZGVuc2l0eTogMjAwLFxuICAgICAgICBjb2xvcjogJyNGRkZGRkYnLFxuICAgICAgICBvcGFjaXR5OiAncmFuZG9tJyxcbiAgICAgICAgcmFkaXVzOiBbMiwgMi41LCAzLCAzLjUsIDQsIDQuNV0sXG4gICAgICAgIHNoYXBlOiAnY2lyY2xlJyxcbiAgICAgICAgc3Ryb2tlOiB7XG4gICAgICAgICAgICB3aWR0aDogMCxcbiAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCdcbiAgICAgICAgfSxcbiAgICAgICAgbW92ZToge1xuICAgICAgICAgICAgc3BlZWQ6IDAuMixcbiAgICAgICAgICAgIGRpcmVjdGlvbjogJ3JhbmRvbScsXG4gICAgICAgICAgICBzdHJhaWdodDogZmFsc2UsXG4gICAgICAgICAgICByYW5kb206IHRydWUsXG4gICAgICAgICAgICBlZGdlQm91bmNlOiBmYWxzZSxcbiAgICAgICAgICAgIGF0dHJhY3Q6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgcmVzaXplOiB0cnVlLFxuICAgICAgICAgICAgaG92ZXI6ICdidWJibGUnLFxuICAgICAgICAgICAgY2xpY2s6IGZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIGFuaW1hdGU6IHtcbiAgICAgICAgICAgIG9wYWNpdHk6IHtcbiAgICAgICAgICAgICAgICBzcGVlZDogMC4yLFxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBzeW5jOiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhZGl1czoge1xuICAgICAgICAgICAgICAgIHNwZWVkOiAzLFxuICAgICAgICAgICAgICAgIG1pbjogMCxcbiAgICAgICAgICAgICAgICBzeW5jOiBmYWxzZVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBJbnRlcmFjdGl2ZToge1xuICAgICAgICBob3Zlcjoge1xuICAgICAgICAgICAgYnViYmxlOiB7XG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6IDc1LFxuICAgICAgICAgICAgICAgIHJhZGl1czogOCxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiAxXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xudmFyIENvbXBvbmVudHM7XG4oZnVuY3Rpb24gKENvbXBvbmVudHMpIHtcbiAgICB2YXIgSGVscGVycztcbiAgICAoZnVuY3Rpb24gKEhlbHBlcnMpIHtcbiAgICAgICAgZnVuY3Rpb24gcnVuSWZEZWZpbmVkKF90aGlzLCBtZXRob2QsIGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChfdGhpc1ttZXRob2RdICYmIF90aGlzW21ldGhvZF0gaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICAgIF90aGlzW21ldGhvZF0oZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgSGVscGVycy5ydW5JZkRlZmluZWQgPSBydW5JZkRlZmluZWQ7XG4gICAgICAgIGZ1bmN0aW9uIGF0dGFjaEludGVyZmFjZShfdGhpcywgbmFtZSkge1xuICAgICAgICAgICAgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eShfdGhpcywgbmFtZSwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBJbnRlcmZhY2VbbmFtZV0sXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIEhlbHBlcnMuYXR0YWNoSW50ZXJmYWNlID0gYXR0YWNoSW50ZXJmYWNlO1xuICAgIH0pKEhlbHBlcnMgfHwgKEhlbHBlcnMgPSB7fSkpO1xuICAgIHZhciBJbnRlcmZhY2U7XG4gICAgKGZ1bmN0aW9uIChJbnRlcmZhY2UpIHtcbiAgICAgICAgZnVuY3Rpb24gYXBwZW5kVG8ocGFyZW50KSB7XG4gICAgICAgICAgICB2YXIgX3RoaXNfMSA9IHRoaXM7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQodGhpcy5lbGVtZW50KTtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIGlmICghX3RoaXNfMS5fbW91bnRlZCkge1xuICAgICAgICAgICAgICAgICAgICBFdmVudHMuZGlzcGF0Y2goX3RoaXNfMSwgJ21vdW50ZWQnLCB7IHBhcmVudDogcGFyZW50IH0pO1xuICAgICAgICAgICAgICAgICAgICBfdGhpc18xLl9tb3VudGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgICBJbnRlcmZhY2UuYXBwZW5kVG8gPSBhcHBlbmRUbztcbiAgICB9KShJbnRlcmZhY2UgfHwgKEludGVyZmFjZSA9IHt9KSk7XG4gICAgdmFyIEV2ZW50cztcbiAgICAoZnVuY3Rpb24gKEV2ZW50cykge1xuICAgICAgICBmdW5jdGlvbiBkaXNwYXRjaChfdGhpcywgZXZlbnQsIGRhdGEpIHtcbiAgICAgICAgICAgIEhlbHBlcnMucnVuSWZEZWZpbmVkKF90aGlzLCBldmVudCwgZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnRzLmRpc3BhdGNoID0gZGlzcGF0Y2g7XG4gICAgfSkoRXZlbnRzIHx8IChFdmVudHMgPSB7fSkpO1xuICAgIHZhciBfX0Jhc2UgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBfX0Jhc2UoKSB7XG4gICAgICAgICAgICB0aGlzLmVsZW1lbnQgPSBudWxsO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBfX0Jhc2U7XG4gICAgfSgpKTtcbiAgICB2YXIgQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKENvbXBvbmVudCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gQ29tcG9uZW50KCkge1xuICAgICAgICAgICAgdmFyIF90aGlzXzEgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICAgICAgX3RoaXNfMS5lbGVtZW50ID0gbnVsbDtcbiAgICAgICAgICAgIF90aGlzXzEuX21vdW50ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIF90aGlzXzEuX3NldHVwSW50ZXJmYWNlKCk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXNfMTtcbiAgICAgICAgfVxuICAgICAgICBDb21wb25lbnQucHJvdG90eXBlLl9zZXR1cEludGVyZmFjZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEhlbHBlcnMuYXR0YWNoSW50ZXJmYWNlKHRoaXMsICdhcHBlbmRUbycpO1xuICAgICAgICB9O1xuICAgICAgICBDb21wb25lbnQucHJvdG90eXBlLmFwcGVuZFRvID0gZnVuY3Rpb24gKHBhcmVudCkgeyB9O1xuICAgICAgICBDb21wb25lbnQucHJvdG90eXBlLmdldFJlZmVyZW5jZSA9IGZ1bmN0aW9uIChyZWYpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVsZW1lbnQucXVlcnlTZWxlY3RvcihcIltyZWY9XFxcIlwiICsgcmVmICsgXCJcXFwiXVwiKSB8fCBudWxsO1xuICAgICAgICB9O1xuICAgICAgICByZXR1cm4gQ29tcG9uZW50O1xuICAgIH0oX19CYXNlKSk7XG4gICAgdmFyIEluaXRpYWxpemU7XG4gICAgKGZ1bmN0aW9uIChJbml0aWFsaXplKSB7XG4gICAgICAgIGZ1bmN0aW9uIF9fSW5pdGlhbGl6ZSgpIHtcbiAgICAgICAgICAgIHRoaXMuZWxlbWVudCA9IHRoaXMuY3JlYXRlRWxlbWVudCgpO1xuICAgICAgICAgICAgRXZlbnRzLmRpc3BhdGNoKHRoaXMsICdjcmVhdGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgZnVuY3Rpb24gTWFpbihfdGhpcykge1xuICAgICAgICAgICAgKF9fSW5pdGlhbGl6ZS5iaW5kKF90aGlzKSkoKTtcbiAgICAgICAgfVxuICAgICAgICBJbml0aWFsaXplLk1haW4gPSBNYWluO1xuICAgIH0pKEluaXRpYWxpemUgfHwgKEluaXRpYWxpemUgPSB7fSkpO1xuICAgIHZhciBIVE1MQ29tcG9uZW50ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICAgICAgX19leHRlbmRzKEhUTUxDb21wb25lbnQsIF9zdXBlcik7XG4gICAgICAgIGZ1bmN0aW9uIEhUTUxDb21wb25lbnQoKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXNfMSA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgICAgICBJbml0aWFsaXplLk1haW4oX3RoaXNfMSk7XG4gICAgICAgICAgICByZXR1cm4gX3RoaXNfMTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gSFRNTENvbXBvbmVudDtcbiAgICB9KENvbXBvbmVudCkpO1xuICAgIENvbXBvbmVudHMuSFRNTENvbXBvbmVudCA9IEhUTUxDb21wb25lbnQ7XG4gICAgdmFyIERhdGFDb21wb25lbnQgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgICAgICBfX2V4dGVuZHMoRGF0YUNvbXBvbmVudCwgX3N1cGVyKTtcbiAgICAgICAgZnVuY3Rpb24gRGF0YUNvbXBvbmVudChkYXRhKSB7XG4gICAgICAgICAgICB2YXIgX3RoaXNfMSA9IF9zdXBlci5jYWxsKHRoaXMpIHx8IHRoaXM7XG4gICAgICAgICAgICBfdGhpc18xLmRhdGEgPSBkYXRhO1xuICAgICAgICAgICAgSW5pdGlhbGl6ZS5NYWluKF90aGlzXzEpO1xuICAgICAgICAgICAgcmV0dXJuIF90aGlzXzE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIERhdGFDb21wb25lbnQ7XG4gICAgfShDb21wb25lbnQpKTtcbiAgICBDb21wb25lbnRzLkRhdGFDb21wb25lbnQgPSBEYXRhQ29tcG9uZW50O1xufSkoQ29tcG9uZW50cyB8fCAoQ29tcG9uZW50cyA9IHt9KSk7XG5tb2R1bGUuZXhwb3J0cyA9IENvbXBvbmVudHM7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkVkdWNhdGlvbiA9IHZvaWQgMDtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50XCIpO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvRE9NXCIpO1xudmFyIEVkdWNhdGlvbiA9IChmdW5jdGlvbiAoX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKEVkdWNhdGlvbiwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBFZHVjYXRpb24oKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgRWR1Y2F0aW9uLnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7IH07XG4gICAgRWR1Y2F0aW9uLnByb3RvdHlwZS5jcmVhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBET01fMS5ET00ub25GaXJzdEFwcGVhcmFuY2UodGhpcy5lbGVtZW50LCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBfdGhpcy5zZXRQcm9ncmVzcygpO1xuICAgICAgICB9LCB7IHRpbWVvdXQ6IDUwMCwgb2Zmc2V0OiAwLjMgfSk7XG4gICAgfTtcbiAgICBFZHVjYXRpb24ucHJvdG90eXBlLnNldFByb2dyZXNzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29tcGxldGVkID0gdGhpcy5kYXRhLmNyZWRpdHMuY29tcGxldGVkIC8gdGhpcy5kYXRhLmNyZWRpdHMudG90YWwgKiAxMDAgKyBcIiVcIjtcbiAgICAgICAgdmFyIHRha2luZyA9ICh0aGlzLmRhdGEuY3JlZGl0cy5jb21wbGV0ZWQgKyB0aGlzLmRhdGEuY3JlZGl0cy50YWtpbmcpIC8gdGhpcy5kYXRhLmNyZWRpdHMudG90YWwgKiAxMDAgKyBcIiVcIjtcbiAgICAgICAgdGhpcy5nZXRSZWZlcmVuY2UoJ2NvbXBsZXRlZFRyYWNrJykuc3R5bGUud2lkdGggPSBjb21wbGV0ZWQ7XG4gICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCd0YWtpbmdUcmFjaycpLnN0eWxlLndpZHRoID0gdGFraW5nO1xuICAgICAgICB2YXIgY29tcGxldGVkTWFya2VyID0gdGhpcy5nZXRSZWZlcmVuY2UoJ2NvbXBsZXRlZE1hcmtlcicpO1xuICAgICAgICB2YXIgdGFraW5nTWFya2VyID0gdGhpcy5nZXRSZWZlcmVuY2UoJ3Rha2luZ01hcmtlcicpO1xuICAgICAgICBjb21wbGV0ZWRNYXJrZXIuc3R5bGUub3BhY2l0eSA9ICcxJztcbiAgICAgICAgY29tcGxldGVkTWFya2VyLnN0eWxlLmxlZnQgPSBjb21wbGV0ZWQ7XG4gICAgICAgIHRha2luZ01hcmtlci5zdHlsZS5vcGFjaXR5ID0gJzEnO1xuICAgICAgICB0YWtpbmdNYXJrZXIuc3R5bGUubGVmdCA9IHRha2luZztcbiAgICB9O1xuICAgIEVkdWNhdGlvbi5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlubGluZVN0eWxlID0ge1xuICAgICAgICAgICAgJy0tcHJvZ3Jlc3MtYmFyLWNvbG9yJzogdGhpcy5kYXRhLmNvbG9yXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJlZHVjYXRpb24gY2FyZCBpcy10aGVtZS1zZWNvbmRhcnkgZWxldmF0aW9uLTFcIiwgc3R5bGU6IGlubGluZVN0eWxlIH0sXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImNvbnRlbnQgcGFkZGluZy0yXCIgfSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImJvZHlcIiB9LFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImhlYWRlciBmbGV4IHJvdyBzbS13cmFwIG1kLW5vd3JhcCB4cy14LWNlbnRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJpY29uIHhzLWF1dG9cIiwgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IFwib3V0L2ltYWdlcy9FZHVjYXRpb24vXCIgKyB0aGlzLmRhdGEuaW1hZ2UgfSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJhYm91dCB4cy1mdWxsXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImluc3RpdHV0aW9uIGZsZXggcm93IHhzLXgtY2VudGVyIHhzLXktY2VudGVyIG1kLXgtYmVnaW5cIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJuYW1lIHhzLWZ1bGwgbWQtYXV0byBpcy1jZW50ZXItYWxpZ25lZCBpcy1ib2xkLXdlaWdodCBpcy1zaXplLTYgaXMtY29sb3JlZC1saW5rXCIsIGhyZWY6IHRoaXMuZGF0YS5saW5rLCB0YXJnZXQ6IFwiX2JsYW5rXCIgfSwgdGhpcy5kYXRhLm5hbWUpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJsb2NhdGlvbiBtZC14LXNlbGYtZW5kIGlzLWl0YWxpYyBpcy1zaXplLTggaXMtY29sb3ItbGlnaHRcIiB9LCB0aGlzLmRhdGEubG9jYXRpb24pKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImRlZ3JlZSBmbGV4IHJvdyB4cy14LWNlbnRlciB4cy15LWNlbnRlciBtZC14LWJlZ2luXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwibmFtZSB4cy1mdWxsIG1kLWF1dG8gaXMtY2VudGVyLWFsaWduZWQgaXMtYm9sZC13ZWlnaHQgaXMtc2l6ZS03IGlzLWNvbG9yLWxpZ2h0XCIgfSwgdGhpcy5kYXRhLmRlZ3JlZSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImRhdGUgbWQteC1zZWxmLWVuZCBpcy1pdGFsaWMgaXMtc2l6ZS04IGlzLWNvbG9yLWxpZ2h0XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiKFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLnN0YXJ0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCIgXFx1MjAxNCBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5lbmQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIilcIikpKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwicHJvZ3Jlc3MgZmxleCByb3cgeHMtbm93cmFwIHhzLXktY2VudGVyIHByb2dyZXNzLWJhci1ob3Zlci1jb250YWluZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwcm9ncmVzcy1iYXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29tcGxldGVkIG1hcmtlclwiLCBzdHlsZTogeyBvcGFjaXR5OiAwIH0sIHJlZjogXCJjb21wbGV0ZWRNYXJrZXJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJpcy1zaXplLThcIiB9LCB0aGlzLmRhdGEuY3JlZGl0cy5jb21wbGV0ZWQpKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRha2luZyBtYXJrZXJcIiwgc3R5bGU6IHsgb3BhY2l0eTogMCB9LCByZWY6IFwidGFraW5nTWFya2VyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiaXMtc2l6ZS04XCIgfSwgdGhpcy5kYXRhLmNyZWRpdHMuY29tcGxldGVkICsgdGhpcy5kYXRhLmNyZWRpdHMudGFraW5nKSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0cmFja1wiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYnVmZmVyXCIsIHJlZjogXCJ0YWtpbmdUcmFja1wiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiZmlsbFwiLCByZWY6IFwiY29tcGxldGVkVHJhY2tcIiB9KSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJjcmVkaXRzIGlzLXNpemUtOCB4cy1hdXRvXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRhdGEuY3JlZGl0cy50b3RhbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIiBjcmVkaXRzXCIpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpbmZvIGNvbnRlbnQgcGFkZGluZy14LTQgcGFkZGluZy15LTJcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiaXMtbGlnaHQtY29sb3IgaXMtc2l6ZS04IGlzLWl0YWxpY1wiIH0sIHRoaXMuZGF0YS5ncGEubWFqb3JcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiR1BBIC8gXCIgKyB0aGlzLmRhdGEuZ3BhLm92ZXJhbGwgKyBcIiAob3ZlcmFsbCkgLyBcIiArIHRoaXMuZGF0YS5ncGEubWFqb3IgKyBcIiAobWFqb3IpXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiR1BBIC8gXCIgKyB0aGlzLmRhdGEuZ3BhLm92ZXJhbGwpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLm5vdGVzLm1hcChmdW5jdGlvbiAobm90ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJpcy1saWdodC1jb2xvciBpcy1zaXplLTggaXMtaXRhbGljXCIgfSwgbm90ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJoclwiLCBudWxsKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY291cnNlc1wiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcInBcIiwgeyBjbGFzc05hbWU6IFwiaXMtYm9sZC13ZWlnaHQgaXMtc2l6ZS02XCIgfSwgXCJSZWNlbnQgQ291cnNld29ya1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwidWxcIiwgeyBjbGFzc05hbWU6IFwiZmxleCByb3cgaXMtc2l6ZS03XCIgfSwgdGhpcy5kYXRhLmNvdXJzZXMubWFwKGZ1bmN0aW9uIChjb3Vyc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJsaVwiLCB7IGNsYXNzTmFtZTogXCJ4cy0xMiBtZC02XCIgfSwgY291cnNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSkpKSkpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gRWR1Y2F0aW9uO1xufShDb21wb25lbnRfMS5EYXRhQ29tcG9uZW50KSk7XG5leHBvcnRzLkVkdWNhdGlvbiA9IEVkdWNhdGlvbjtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRXhwZXJpZW5jZSA9IHZvaWQgMDtcbnZhciBKU1hfMSA9IHJlcXVpcmUoXCIuLi8uLi9EZWZpbml0aW9ucy9KU1hcIik7XG52YXIgQ29tcG9uZW50XzEgPSByZXF1aXJlKFwiLi4vQ29tcG9uZW50XCIpO1xudmFyIEV4cGVyaWVuY2UgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhFeHBlcmllbmNlLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIEV4cGVyaWVuY2UoKSB7XG4gICAgICAgIHJldHVybiBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICB9XG4gICAgRXhwZXJpZW5jZS5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgIEV4cGVyaWVuY2UucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjYXJkIGlzLXRoZW1lLXNlY29uZGFyeSBlbGV2YXRpb24tMSBleHBlcmllbmNlXCIgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTJcIiB9LFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiaGVhZGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJpY29uXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpbWdcIiwgeyBzcmM6IFwiLi9vdXQvaW1hZ2VzL0V4cGVyaWVuY2UvXCIgKyB0aGlzLmRhdGEuc3ZnICsgXCIuc3ZnXCIgfSkpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjb21wYW55XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiwgY2xhc3NOYW1lOiBcIm5hbWUgaXMtc2l6ZS02IGlzLWJvbGQtd2VpZ2h0IGlzLWNvbG9yZWQtbGlua1wiIH0sIHRoaXMuZGF0YS5jb21wYW55KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImxvY2F0aW9uIGlzLXNpemUtOCBpcy1pdGFsaWMgaXMtY29sb3ItbGlnaHRcIiB9LCB0aGlzLmRhdGEubG9jYXRpb24pKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJyb2xlXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcIm5hbWUgaXMtc2l6ZS03IGlzLWJvbGQtd2VpZ2h0XCIgfSwgdGhpcy5kYXRhLnBvc2l0aW9uKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImRhdGUgaXMtc2l6ZS04IGlzLWl0YWxpYyBpcy1jb2xvci1saWdodFwiIH0sIFwiKFwiICsgdGhpcy5kYXRhLmJlZ2luICsgXCIgXFx1MjAxNCBcIiArIHRoaXMuZGF0YS5lbmQgKyBcIilcIikpKSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaHJcIiwgbnVsbCksXG4gICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjb250ZW50IGluZm9cIiB9LFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJkZXNjcmlwdGlvbiBpcy1zaXplLTggaXMtY29sb3ItbGlnaHQgaXMtaXRhbGljIGlzLWp1c3RpZmllZCBpcy1xdW90ZVwiIH0sIHRoaXMuZGF0YS5mbGF2b3IpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwidWxcIiwgeyBjbGFzc05hbWU6IFwiam9iIGlzLWxlZnQtYWxpZ25lZCBpcy1zaXplLTcgeHMteS1wYWRkaW5nLWJldHdlZW4tMVwiIH0sIHRoaXMuZGF0YS5yb2xlcy5tYXAoZnVuY3Rpb24gKHJvbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgcm9sZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pKSkpKSk7XG4gICAgfTtcbiAgICByZXR1cm4gRXhwZXJpZW5jZTtcbn0oQ29tcG9uZW50XzEuRGF0YUNvbXBvbmVudCkpO1xuZXhwb3J0cy5FeHBlcmllbmNlID0gRXhwZXJpZW5jZTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uLy4uLy4uL01vZHVsZXMvRE9NXCIpO1xudmFyIEhlbHBlcnM7XG4oZnVuY3Rpb24gKEhlbHBlcnMpIHtcbiAgICBmdW5jdGlvbiBsb2FkT25GaXJzdEFwcGVhcmFuY2UoaG9vaywgY2xhc3NOYW1lKSB7XG4gICAgICAgIGlmIChjbGFzc05hbWUgPT09IHZvaWQgMCkgeyBjbGFzc05hbWUgPSAncHJlbG9hZCc7IH1cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGhvb2suY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgICAgICAgRE9NXzEuRE9NLm9uRmlyc3RBcHBlYXJhbmNlKGhvb2ssIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBob29rLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9LCB7IG9mZnNldDogMC41IH0pO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgSGVscGVycy5sb2FkT25GaXJzdEFwcGVhcmFuY2UgPSBsb2FkT25GaXJzdEFwcGVhcmFuY2U7XG59KShIZWxwZXJzIHx8IChIZWxwZXJzID0ge30pKTtcbm1vZHVsZS5leHBvcnRzID0gSGVscGVycztcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKGIsIHApKSBkW3BdID0gYltwXTsgfTtcbiAgICAgICAgcmV0dXJuIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgfTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDbGFzcyBleHRlbmRzIHZhbHVlIFwiICsgU3RyaW5nKGIpICsgXCIgaXMgbm90IGEgY29uc3RydWN0b3Igb3IgbnVsbFwiKTtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICAgICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XG4gICAgICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUsIG5ldyBfXygpKTtcbiAgICB9O1xufSkoKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuTWVudSA9IHZvaWQgMDtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBFdmVudERpc3BhdGNoZXJfMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0V2ZW50RGlzcGF0Y2hlclwiKTtcbnZhciBNZW51ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWVudSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBNZW51KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIuY2FsbCh0aGlzKSB8fCB0aGlzO1xuICAgICAgICBfdGhpcy5vcGVuID0gZmFsc2U7XG4gICAgICAgIF90aGlzLlJHQlJlZ0V4cCA9IC8ocmdiXFwoKFswLTldezEsM30pLCAoWzAtOV17MSwzfSksIChbMC05XXsxLDN9KVxcKSl8KHJnYmFcXCgoWzAtOV17MSwzfSksIChbMC05XXsxLDN9KSwgKFswLTldezEsM30pLCAoMCg/OlxcLlswLTldezEsMn0pPylcXCkpL2c7XG4gICAgICAgIF90aGlzLkNvbnRhaW5lciA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5tZW51Jyk7XG4gICAgICAgIF90aGlzLkhhbWJ1cmdlciA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5tZW51IC5oYW1idXJnZXInKTtcbiAgICAgICAgX3RoaXMucmVnaXN0ZXIoJ3RvZ2dsZScpO1xuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIE1lbnUucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5vcGVuID0gIXRoaXMub3BlbjtcbiAgICAgICAgdGhpcy5vcGVuID8gdGhpcy5vcGVuTWVudSgpIDogdGhpcy5jbG9zZU1lbnUoKTtcbiAgICAgICAgdGhpcy5kaXNwYXRjaCgndG9nZ2xlJywgeyBvcGVuOiB0aGlzLm9wZW4gfSk7XG4gICAgfTtcbiAgICBNZW51LnByb3RvdHlwZS5vcGVuTWVudSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5Db250YWluZXIuc2V0QXR0cmlidXRlKCdvcGVuJywgJycpO1xuICAgICAgICB0aGlzLmRhcmtlbigpO1xuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUuY2xvc2VNZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICB0aGlzLkNvbnRhaW5lci5yZW1vdmVBdHRyaWJ1dGUoJ29wZW4nKTtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7IHJldHVybiBfdGhpcy51cGRhdGVDb250cmFzdCgpOyB9LCA3NTApO1xuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUuZGFya2VuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLkhhbWJ1cmdlci5jbGFzc0xpc3QucmVtb3ZlKCdsaWdodCcpO1xuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUubGlnaHRlbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5IYW1idXJnZXIuY2xhc3NMaXN0LmFkZCgnbGlnaHQnKTtcbiAgICB9O1xuICAgIE1lbnUucHJvdG90eXBlLnVwZGF0ZUNvbnRyYXN0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoIXRoaXMub3Blbikge1xuICAgICAgICAgICAgdmFyIGJhY2tncm91bmRDb2xvciA9IHRoaXMuZ2V0QmFja2dyb3VuZENvbG9yKCk7XG4gICAgICAgICAgICB0aGlzLmNoYW5nZUNvbnRyYXN0KGJhY2tncm91bmRDb2xvcik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE1lbnUucHJvdG90eXBlLmdldEJhY2tncm91bmRDb2xvciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGVsZW1lbnRzRnJvbVBvaW50ID0gZG9jdW1lbnQuZWxlbWVudHNGcm9tUG9pbnQgPyAnZWxlbWVudHNGcm9tUG9pbnQnIDogJ21zRWxlbWVudHNGcm9tUG9pbnQnO1xuICAgICAgICB2YXIgX2EgPSB0aGlzLkhhbWJ1cmdlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSwgdG9wID0gX2EudG9wLCBsZWZ0ID0gX2EubGVmdDtcbiAgICAgICAgdmFyIGVsZW1lbnRzID0gZG9jdW1lbnRbZWxlbWVudHNGcm9tUG9pbnRdKGxlZnQsIHRvcCk7XG4gICAgICAgIHZhciBsZW5ndGggPSBlbGVtZW50cy5sZW5ndGg7XG4gICAgICAgIHZhciBSR0IgPSBbXTtcbiAgICAgICAgdmFyIGJhY2tncm91bmQsIHJlZ0V4UmVzdWx0O1xuICAgICAgICB2YXIgc3R5bGVzO1xuICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IGxlbmd0aDsgKytpLCB0aGlzLlJHQlJlZ0V4cC5sYXN0SW5kZXggPSAwKSB7XG4gICAgICAgICAgICBzdHlsZXMgPSB3aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50c1tpXSk7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kID0gc3R5bGVzLmJhY2tncm91bmQgfHwgc3R5bGVzLmJhY2tncm91bmRDb2xvciArIHN0eWxlcy5iYWNrZ3JvdW5kSW1hZ2U7XG4gICAgICAgICAgICB3aGlsZSAocmVnRXhSZXN1bHQgPSB0aGlzLlJHQlJlZ0V4cC5leGVjKGJhY2tncm91bmQpKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlZ0V4UmVzdWx0WzFdKSB7XG4gICAgICAgICAgICAgICAgICAgIFJHQiA9IHJlZ0V4UmVzdWx0LnNsaWNlKDIsIDUpLm1hcChmdW5jdGlvbiAodmFsKSB7IHJldHVybiBwYXJzZUludCh2YWwpOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJHQjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocmVnRXhSZXN1bHRbNV0pIHtcbiAgICAgICAgICAgICAgICAgICAgUkdCID0gcmVnRXhSZXN1bHQuc2xpY2UoNiwgMTApLm1hcChmdW5jdGlvbiAodmFsKSB7IHJldHVybiBwYXJzZUludCh2YWwpOyB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFSR0IuZXZlcnkoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsID09PSAwOyB9KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFJHQjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gUkdCO1xuICAgIH07XG4gICAgTWVudS5wcm90b3R5cGUuY2hhbmdlQ29udHJhc3QgPSBmdW5jdGlvbiAoUkdCKSB7XG4gICAgICAgIHZhciBjb250cmFzdCwgbHVtaW5hbmNlO1xuICAgICAgICBpZiAoUkdCLmxlbmd0aCA9PT0gMykge1xuICAgICAgICAgICAgY29udHJhc3QgPSBSR0IubWFwKGZ1bmN0aW9uICh2YWwpIHsgcmV0dXJuIHZhbCAvIDI1NTsgfSkubWFwKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsIDw9IDAuMDM5MjggPyB2YWwgLyAxMi45MiA6IE1hdGgucG93KCh2YWwgKyAwLjA1NSkgLyAxLjA1NSwgMi40KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgbHVtaW5hbmNlID0gMC4yMTI2ICogY29udHJhc3RbMF0gKyAwLjcxNTIgKiBjb250cmFzdFsxXSArIDAuMDcyMiAqIGNvbnRyYXN0WzJdO1xuICAgICAgICAgICAgaWYgKGx1bWluYW5jZSA+IDAuMTc5KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5kYXJrZW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMubGlnaHRlbigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYXJrZW4oKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIE1lbnU7XG59KEV2ZW50RGlzcGF0Y2hlcl8xLkV2ZW50cy5FdmVudERpc3BhdGNoZXIpKTtcbmV4cG9ydHMuTWVudSA9IE1lbnU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlByb2plY3QgPSB2b2lkIDA7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBQcm9qZWN0ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUHJvamVjdCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBQcm9qZWN0KCkge1xuICAgICAgICB2YXIgX3RoaXMgPSBfc3VwZXIgIT09IG51bGwgJiYgX3N1cGVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cykgfHwgdGhpcztcbiAgICAgICAgX3RoaXMuaW5mb0Rpc3BsYXllZCA9IGZhbHNlO1xuICAgICAgICBfdGhpcy50b29sdGlwTGVmdCA9IHRydWU7XG4gICAgICAgIHJldHVybiBfdGhpcztcbiAgICB9XG4gICAgUHJvamVjdC5wcm90b3R5cGUuY3JlYXRlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMuZGF0YS5hd2FyZCkge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIF90aGlzLmNoZWNrVG9vbHRpcFNpZGUoKTsgfSwgeyBwYXNzaXZlOiB0cnVlIH0pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQcm9qZWN0LnByb3RvdHlwZS5tb3VudGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5kYXRhLmF3YXJkKSB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrVG9vbHRpcFNpZGUoKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUHJvamVjdC5wcm90b3R5cGUuY2hlY2tUb29sdGlwU2lkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvb2x0aXAgPSB0aGlzLmdldFJlZmVyZW5jZSgndG9vbHRpcCcpO1xuICAgICAgICB2YXIgdG9vbHRpcFBvcyA9IHRvb2x0aXAuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkubGVmdDtcbiAgICAgICAgdmFyIHNjcmVlbldpZHRoID0gRE9NXzEuRE9NLmdldFZpZXdwb3J0KCkud2lkdGg7XG4gICAgICAgIGlmICh0aGlzLnRvb2x0aXBMZWZ0ICE9PSAodG9vbHRpcFBvcyA+PSBzY3JlZW5XaWR0aCAvIDIpKSB7XG4gICAgICAgICAgICB0aGlzLnRvb2x0aXBMZWZ0ID0gIXRoaXMudG9vbHRpcExlZnQ7XG4gICAgICAgICAgICB2YXIgYWRkID0gdGhpcy50b29sdGlwTGVmdCA/ICdsZWZ0JyA6ICd0b3AnO1xuICAgICAgICAgICAgdmFyIHJlbW92ZSA9IHRoaXMudG9vbHRpcExlZnQgPyAndG9wJyA6ICdsZWZ0JztcbiAgICAgICAgICAgIHRvb2x0aXAuY2xhc3NMaXN0LnJlbW92ZShyZW1vdmUpO1xuICAgICAgICAgICAgdG9vbHRpcC5jbGFzc0xpc3QuYWRkKGFkZCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFByb2plY3QucHJvdG90eXBlLmxlc3NJbmZvID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLmluZm9EaXNwbGF5ZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9O1xuICAgIFByb2plY3QucHJvdG90eXBlLnRvZ2dsZUluZm8gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuaW5mb0Rpc3BsYXllZCA9ICF0aGlzLmluZm9EaXNwbGF5ZWQ7XG4gICAgICAgIHRoaXMudXBkYXRlKCk7XG4gICAgfTtcbiAgICBQcm9qZWN0LnByb3RvdHlwZS51cGRhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmluZm9EaXNwbGF5ZWQpIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdzbGlkZXInKS5zZXRBdHRyaWJ1dGUoJ29wZW5lZCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdzbGlkZXInKS5yZW1vdmVBdHRyaWJ1dGUoJ29wZW5lZCcpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ2V0UmVmZXJlbmNlKCdpbmZvVGV4dCcpLmlubmVySFRNTCA9ICh0aGlzLmluZm9EaXNwbGF5ZWQgPyAnTGVzcycgOiAnTW9yZScpICsgXCIgSW5mb1wiO1xuICAgIH07XG4gICAgUHJvamVjdC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGlubGluZVN0eWxlID0ge1xuICAgICAgICAgICAgJy0tYnV0dG9uLWJhY2tncm91bmQtY29sb3InOiB0aGlzLmRhdGEuY29sb3JcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGltYWdlU3R5bGUgPSB7XG4gICAgICAgICAgICBiYWNrZ3JvdW5kSW1hZ2U6IFwidXJsKFwiICsgKFwiLi9vdXQvaW1hZ2VzL1Byb2plY3RzL1wiICsgdGhpcy5kYXRhLmltYWdlKSArIFwiKVwiXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiAoSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ4cy0xMiBzbS02IG1kLTRcIiB9LFxuICAgICAgICAgICAgdGhpcy5kYXRhLmF3YXJkID9cbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImF3YXJkXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJ0b29sdGlwLWNvbnRhaW5lclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaW1nXCIsIHsgc3JjOiBcIm91dC9pbWFnZXMvUHJvamVjdHMvYXdhcmQucG5nXCIgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCB7IHJlZjogXCJ0b29sdGlwXCIsIGNsYXNzTmFtZTogXCJ0b29sdGlwIGxlZnQgaXMtc2l6ZS04XCIgfSwgdGhpcy5kYXRhLmF3YXJkKSkpXG4gICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJwcm9qZWN0IGNhcmQgaXMtdGhlbWUtc2Vjb25kYXJ5IGVsZXZhdGlvbi0xIGlzLWluLWdyaWQgaGlkZS1vdmVyZmxvd1wiLCBzdHlsZTogaW5saW5lU3R5bGUgfSxcbiAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcImltYWdlXCIsIHN0eWxlOiBpbWFnZVN0eWxlIH0pLFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTJcIiB9LFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInRpdGxlXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcIm5hbWUgaXMtc2l6ZS02IGlzLWJvbGQtd2VpZ2h0XCIsIHN0eWxlOiB7IGNvbG9yOiB0aGlzLmRhdGEuY29sb3IgfSB9LCB0aGlzLmRhdGEubmFtZSksXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJ0eXBlIGlzLXNpemUtOFwiIH0sIHRoaXMuZGF0YS50eXBlKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImRhdGUgaXMtc2l6ZS04IGlzLWNvbG9yLWxpZ2h0XCIgfSwgdGhpcy5kYXRhLmRhdGUpKSxcbiAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJib2R5XCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImZsYXZvciBpcy1zaXplLTdcIiB9LCB0aGlzLmRhdGEuZmxhdm9yKSksXG4gICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwic2xpZGVyIGlzLXRoZW1lLXNlY29uZGFyeVwiLCByZWY6IFwic2xpZGVyXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiY29udGVudCBwYWRkaW5nLTRcIiB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwidGl0bGUgZmxleCByb3cgeHMteC1iZWdpbiB4cy15LWNlbnRlclwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJwXCIsIHsgY2xhc3NOYW1lOiBcImlzLXNpemUtNiBpcy1ib2xkLXdlaWdodFwiIH0sIFwiRGV0YWlsc1wiKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgSlNYXzEuRWxlbWVudEZhY3RvcnkuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7IGNsYXNzTmFtZTogXCJjbG9zZS1idG4td3JhcHBlciB4cy14LXNlbGYtZW5kXCIgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIiwgeyBjbGFzc05hbWU6IFwiYnRuIGNsb3NlIGlzLXN2ZyBpcy1wcmltYXJ5XCIsIHRhYmluZGV4OiBcIi0xXCIsIG9uQ2xpY2s6IHRoaXMubGVzc0luZm8uYmluZCh0aGlzKSB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImZhcyBmYS10aW1lc1wiIH0pKSkpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwiYm9keVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiLCB7IGNsYXNzTmFtZTogXCJkZXRhaWxzIHhzLXktcGFkZGluZy1iZXR3ZWVuLTEgaXMtc2l6ZS05XCIgfSwgdGhpcy5kYXRhLmRldGFpbHMubWFwKGZ1bmN0aW9uIChkZXRhaWwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwibGlcIiwgbnVsbCwgZGV0YWlsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkpKSkpLFxuICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcIm9wdGlvbnMgaXMtdGhlbWUtc2Vjb25kYXJ5IHhzLXgtbWFyZ2luLWJldHdlZW4tMVwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIsIHsgY2xhc3NOYW1lOiBcImluZm8gYnRuIGlzLXByaW1hcnkgaXMtdGV4dCBpcy1jdXN0b21cIiwgb25DbGljazogdGhpcy50b2dnbGVJbmZvLmJpbmQodGhpcykgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJmYXMgZmEtaW5mb1wiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgcmVmOiBcImluZm9UZXh0XCIgfSwgXCJNb3JlIEluZm9cIikpLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLnJlcG8gP1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJhXCIsIHsgY2xhc3NOYW1lOiBcImNvZGUgYnRuIGlzLXByaW1hcnkgaXMtdGV4dCBpcy1jdXN0b21cIiwgaHJlZjogdGhpcy5kYXRhLnJlcG8sIHRhcmdldDogXCJfYmxhbmtcIiwgdGFiaW5kZXg6IFwiMFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImZhcyBmYS1jb2RlXCIgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIG51bGwsIFwiU2VlIENvZGVcIikpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5kYXRhLmV4dGVybmFsID9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJleHRlcm5hbCBidG4gaXMtcHJpbWFyeSBpcy10ZXh0IGlzLWN1c3RvbVwiLCBocmVmOiB0aGlzLmRhdGEuZXh0ZXJuYWwsIHRhcmdldDogXCJfYmxhbmtcIiwgdGFiaW5kZXg6IFwiMFwiIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiBcImZhcyBmYS1leHRlcm5hbC1saW5rLWFsdFwiIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwic3BhblwiLCBudWxsLCBcIlZpZXcgT25saW5lXCIpKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCkpKSkpO1xuICAgIH07XG4gICAgcmV0dXJuIFByb2plY3Q7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuUHJvamVjdCA9IFByb2plY3Q7XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlF1YWxpdHkgPSB2b2lkIDA7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBRdWFsaXR5ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoUXVhbGl0eSwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBRdWFsaXR5KGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIGRhdGEpIHx8IHRoaXM7XG4gICAgfVxuICAgIFF1YWxpdHkucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHsgfTtcbiAgICBRdWFsaXR5LnByb3RvdHlwZS5jcmVhdGVFbGVtZW50ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gKEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6IFwieHMtMTIgc20tNFwiIH0sXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiaVwiLCB7IGNsYXNzTmFtZTogXCJpY29uIFwiICsgdGhpcy5kYXRhLmZhQ2xhc3MgfSksXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJxdWFsaXR5IGlzLXNpemUtNSBpcy11cHBlcmNhc2VcIiB9LCB0aGlzLmRhdGEubmFtZSksXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwicFwiLCB7IGNsYXNzTmFtZTogXCJkZXNjIGlzLWxpZ2h0LXdlaWdodCBpcy1zaXplLTZcIiB9LCB0aGlzLmRhdGEuZGVzY3JpcHRpb24pKSk7XG4gICAgfTtcbiAgICByZXR1cm4gUXVhbGl0eTtcbn0oQ29tcG9uZW50XzEuRGF0YUNvbXBvbmVudCkpO1xuZXhwb3J0cy5RdWFsaXR5ID0gUXVhbGl0eTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFNlY3Rpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNlY3Rpb24oZWxlbWVudCkge1xuICAgICAgICB0aGlzLmVsZW1lbnQgPSBlbGVtZW50O1xuICAgIH1cbiAgICBTZWN0aW9uLnByb3RvdHlwZS5pblZpZXcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBET01fMS5ET00uaW5WZXJ0aWNhbFdpbmRvd1ZpZXcodGhpcy5lbGVtZW50KTtcbiAgICB9O1xuICAgIFNlY3Rpb24ucHJvdG90eXBlLmdldElEID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lbGVtZW50LmlkO1xuICAgIH07XG4gICAgU2VjdGlvbi5wcm90b3R5cGUuaW5NZW51ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gIXRoaXMuZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoJ25vLW1lbnUnKTtcbiAgICB9O1xuICAgIHJldHVybiBTZWN0aW9uO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFNlY3Rpb247XG4iLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYiAhPT0gXCJmdW5jdGlvblwiICYmIGIgIT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNraWxsID0gZXhwb3J0cy5Ta2lsbENhdGVnb3J5ID0gdm9pZCAwO1xudmFyIFNWR18xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvU1ZHXCIpO1xudmFyIEpTWF8xID0gcmVxdWlyZShcIi4uLy4uL0RlZmluaXRpb25zL0pTWFwiKTtcbnZhciBDb21wb25lbnRfMSA9IHJlcXVpcmUoXCIuLi9Db21wb25lbnRcIik7XG52YXIgU2tpbGxDYXRlZ29yeTtcbihmdW5jdGlvbiAoU2tpbGxDYXRlZ29yeSkge1xuICAgIFNraWxsQ2F0ZWdvcnlbU2tpbGxDYXRlZ29yeVtcIlByb2dyYW1taW5nXCJdID0gMV0gPSBcIlByb2dyYW1taW5nXCI7XG4gICAgU2tpbGxDYXRlZ29yeVtTa2lsbENhdGVnb3J5W1wiU2NyaXB0aW5nXCJdID0gMl0gPSBcIlNjcmlwdGluZ1wiO1xuICAgIFNraWxsQ2F0ZWdvcnlbU2tpbGxDYXRlZ29yeVtcIldlYlwiXSA9IDRdID0gXCJXZWJcIjtcbiAgICBTa2lsbENhdGVnb3J5W1NraWxsQ2F0ZWdvcnlbXCJTZXJ2ZXJcIl0gPSA4XSA9IFwiU2VydmVyXCI7XG4gICAgU2tpbGxDYXRlZ29yeVtTa2lsbENhdGVnb3J5W1wiRGF0YWJhc2VcIl0gPSAxNl0gPSBcIkRhdGFiYXNlXCI7XG4gICAgU2tpbGxDYXRlZ29yeVtTa2lsbENhdGVnb3J5W1wiRGV2T3BzXCJdID0gMzJdID0gXCJEZXZPcHNcIjtcbiAgICBTa2lsbENhdGVnb3J5W1NraWxsQ2F0ZWdvcnlbXCJGcmFtZXdvcmtcIl0gPSA2NF0gPSBcIkZyYW1ld29ya1wiO1xuICAgIFNraWxsQ2F0ZWdvcnlbU2tpbGxDYXRlZ29yeVtcIk90aGVyXCJdID0gMTI4XSA9IFwiT3RoZXJcIjtcbn0pKFNraWxsQ2F0ZWdvcnkgPSBleHBvcnRzLlNraWxsQ2F0ZWdvcnkgfHwgKGV4cG9ydHMuU2tpbGxDYXRlZ29yeSA9IHt9KSk7XG52YXIgU2tpbGwgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTa2lsbCwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBTa2lsbCgpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlciAhPT0gbnVsbCAmJiBfc3VwZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKSB8fCB0aGlzO1xuICAgIH1cbiAgICBTa2lsbC5wcm90b3R5cGUuZ2V0Q2F0ZWdvcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGEuY2F0ZWdvcnk7XG4gICAgfTtcbiAgICBTa2lsbC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgIFNraWxsLnByb3RvdHlwZS5jcmVhdGVkID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBTVkdfMS5TVkcubG9hZFNWRyhcIi4vb3V0L2ltYWdlcy9Ta2lsbHMvXCIgKyB0aGlzLmRhdGEuc3ZnKS50aGVuKGZ1bmN0aW9uIChzdmcpIHtcbiAgICAgICAgICAgIHN2Zy5zZXRBdHRyaWJ1dGUoJ2NsYXNzJywgJ2ljb24nKTtcbiAgICAgICAgICAgIHZhciBoZXhhZ29uID0gX3RoaXMuZ2V0UmVmZXJlbmNlKCdoZXhhZ29uJyk7XG4gICAgICAgICAgICBoZXhhZ29uLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKHN2ZywgaGV4YWdvbik7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgU2tpbGwucHJvdG90eXBlLmNyZWF0ZUVsZW1lbnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICghU2tpbGwuSGV4YWdvblNWRykge1xuICAgICAgICAgICAgdGhyb3cgJ0Nhbm5vdCBjcmVhdGUgU2tpbGwgZWxlbWVudCB3aXRob3V0IGJlaW5nIGluaXRpYWxpemVkLic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwibGlcIiwgeyBjbGFzc05hbWU6ICdza2lsbCB0b29sdGlwLWNvbnRhaW5lcicgfSxcbiAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgeyBjbGFzc05hbWU6ICdoZXhhZ29uLWNvbnRhaW5lcicsIHN0eWxlOiB7IGNvbG9yOiB0aGlzLmRhdGEuY29sb3IgfSB9LFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHsgY2xhc3NOYW1lOiAndG9vbHRpcCB0b3AgaXMtc2l6ZS03JyB9LCB0aGlzLmRhdGEubmFtZSksXG4gICAgICAgICAgICAgICAgU2tpbGwuSGV4YWdvblNWRy5jbG9uZU5vZGUodHJ1ZSkpKSk7XG4gICAgfTtcbiAgICBTa2lsbC5pbml0aWFsaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgaWYgKFNraWxsLkhleGFnb25TVkcpIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgU1ZHXzEuU1ZHLmxvYWRTVkcoJy4vb3V0L2ltYWdlcy9Db250ZW50L0hleGFnb24nKS50aGVuKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsICdoZXhhZ29uJyk7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdyZWYnLCAnaGV4YWdvbicpO1xuICAgICAgICAgICAgICAgICAgICBTa2lsbC5IZXhhZ29uU1ZHID0gZWxlbWVudDtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICByZXR1cm4gU2tpbGw7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuU2tpbGwgPSBTa2lsbDtcblNraWxsLmluaXRpYWxpemUoKTtcbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fYXNzaWduID0gKHRoaXMgJiYgdGhpcy5fX2Fzc2lnbikgfHwgZnVuY3Rpb24gKCkge1xuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbih0KSB7XG4gICAgICAgIGZvciAodmFyIHMsIGkgPSAxLCBuID0gYXJndW1lbnRzLmxlbmd0aDsgaSA8IG47IGkrKykge1xuICAgICAgICAgICAgcyA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSlcbiAgICAgICAgICAgICAgICB0W3BdID0gc1twXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdDtcbiAgICB9O1xuICAgIHJldHVybiBfX2Fzc2lnbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2tpbGxzRmlsdGVyID0gdm9pZCAwO1xudmFyIEpTWF8xID0gcmVxdWlyZShcIi4uLy4uL0RlZmluaXRpb25zL0pTWFwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi8uLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBTa2lsbF8xID0gcmVxdWlyZShcIi4vU2tpbGxcIik7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uLy4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBTa2lsbHNfMSA9IHJlcXVpcmUoXCIuLi8uLi9EYXRhL1NraWxsc1wiKTtcbnZhciBTa2lsbHNGaWx0ZXIgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIFNraWxsc0ZpbHRlcigpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5maWx0ZXIgPSAwO1xuICAgICAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgICAgICB0aGlzLnRvcCA9IGZhbHNlO1xuICAgICAgICB0aGlzLm1heEhlaWdodCA9IDIyNDtcbiAgICAgICAgdGhpcy5vcHRpb25FbGVtZW50cyA9IG5ldyBNYXAoKTtcbiAgICAgICAgdGhpcy5za2lsbEVsZW1lbnRzID0gW107XG4gICAgICAgIHRoaXMudXNpbmdBcnJvd0tleXMgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5sYXN0U2VsZWN0ZWQgPSBudWxsO1xuICAgICAgICB0aGlzLkNvbnRhaW5lciA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ3NlY3Rpb24jc2tpbGxzIC5za2lsbHMtZmlsdGVyJyk7XG4gICAgICAgIHRoaXMuRHJvcGRvd24gPSB0aGlzLkNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCcuZHJvcGRvd24nKTtcbiAgICAgICAgdGhpcy5TZWxlY3RlZE9wdGlvbnNEaXNwbGF5ID0gdGhpcy5Ecm9wZG93bi5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQtb3B0aW9ucyAuZGlzcGxheScpO1xuICAgICAgICB0aGlzLk1lbnUgPSB0aGlzLkRyb3Bkb3duLnF1ZXJ5U2VsZWN0b3IoJy5tZW51Jyk7XG4gICAgICAgIHRoaXMuTWVudU9wdGlvbnMgPSB0aGlzLk1lbnUucXVlcnlTZWxlY3RvcignLm9wdGlvbnMnKTtcbiAgICAgICAgdGhpcy5DYXRlZ29yeU1hcCA9IE9iamVjdC5lbnRyaWVzKFNraWxsXzEuU2tpbGxDYXRlZ29yeSlcbiAgICAgICAgICAgIC5maWx0ZXIoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gX2FbMF0sIHZhbCA9IF9hWzFdO1xuICAgICAgICAgICAgcmV0dXJuICFpc05hTihOdW1iZXIoa2V5KSk7XG4gICAgICAgIH0pXG4gICAgICAgICAgICAucmVkdWNlKGZ1bmN0aW9uIChvYmosIF9hKSB7XG4gICAgICAgICAgICB2YXIgX2I7XG4gICAgICAgICAgICB2YXIga2V5ID0gX2FbMF0sIHZhbCA9IF9hWzFdO1xuICAgICAgICAgICAgcmV0dXJuIF9fYXNzaWduKF9fYXNzaWduKHt9LCBvYmopLCAoX2IgPSB7fSwgX2Jba2V5XSA9IHZhbCwgX2IpKTtcbiAgICAgICAgfSwge30pO1xuICAgICAgICBET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgICAgICAgICBTa2lsbF8xLlNraWxsLmluaXRpYWxpemUoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0aWFsaXplKCk7XG4gICAgICAgICAgICAgICAgX3RoaXMuY3JlYXRlU2tpbGxFbGVtZW50cygpO1xuICAgICAgICAgICAgICAgIF90aGlzLmNyZWF0ZU9wdGlvbnMoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy51cGRhdGUoKTtcbiAgICAgICAgICAgICAgICBfdGhpcy5jcmVhdGVFdmVudExpc3RlbmVycygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuTWVudS5zdHlsZS5tYXhIZWlnaHQgPSB0aGlzLm1heEhlaWdodCArIFwicHhcIjtcbiAgICAgICAgdGhpcy5jaGVja1Bvc2l0aW9uKCk7XG4gICAgfTtcbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLmNyZWF0ZU9wdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIE9iamVjdC5lbnRyaWVzKHRoaXMuQ2F0ZWdvcnlNYXApLmZvckVhY2goZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gX2FbMF0sIHZhbCA9IF9hWzFdO1xuICAgICAgICAgICAgdmFyIGVsZW1lbnQgPSBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwibGlcIiwgeyBjbGFzc05hbWU6IFwiaXMtc2l6ZS03XCIgfSwgdmFsKTtcbiAgICAgICAgICAgIF90aGlzLm9wdGlvbkVsZW1lbnRzLnNldChlbGVtZW50LCBOdW1iZXIoa2V5KSk7XG4gICAgICAgICAgICBfdGhpcy5NZW51T3B0aW9ucy5hcHBlbmRDaGlsZChlbGVtZW50KTtcbiAgICAgICAgfSk7XG4gICAgfTtcbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLmNyZWF0ZVNraWxsRWxlbWVudHMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgU2tpbGxzXzIgPSBTa2lsbHNfMS5Ta2lsbHM7IF9pIDwgU2tpbGxzXzIubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgc2tpbGwgPSBTa2lsbHNfMltfaV07XG4gICAgICAgICAgICB0aGlzLnNraWxsRWxlbWVudHMucHVzaChuZXcgU2tpbGxfMS5Ta2lsbChza2lsbCkpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgZm9yICh2YXIgaSA9IFdlYlBhZ2VfMS5Ta2lsbHNHcmlkLmNoaWxkcmVuLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgICAgICBXZWJQYWdlXzEuU2tpbGxzR3JpZC5yZW1vdmVDaGlsZChXZWJQYWdlXzEuU2tpbGxzR3JpZC5jaGlsZHJlbi5pdGVtKGkpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5maWx0ZXIgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2tpbGxFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChza2lsbCkgeyByZXR1cm4gc2tpbGwuYXBwZW5kVG8oV2ViUGFnZV8xLlNraWxsc0dyaWQpOyB9KTtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRPcHRpb25zRGlzcGxheS5pbm5lclRleHQgPSAnTm9uZSc7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNraWxsRWxlbWVudHMuZmlsdGVyKGZ1bmN0aW9uIChza2lsbCkgeyByZXR1cm4gKHNraWxsLmdldENhdGVnb3J5KCkgJiBfdGhpcy5maWx0ZXIpICE9PSAwOyB9KVxuICAgICAgICAgICAgICAgIC5mb3JFYWNoKGZ1bmN0aW9uIChza2lsbCkgeyByZXR1cm4gc2tpbGwuYXBwZW5kVG8oV2ViUGFnZV8xLlNraWxsc0dyaWQpOyB9KTtcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gT2JqZWN0LmVudHJpZXModGhpcy5DYXRlZ29yeU1hcCkuZmlsdGVyKGZ1bmN0aW9uIChfYSkge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfYVswXSwgdmFsID0gX2FbMV07XG4gICAgICAgICAgICAgICAgcmV0dXJuIChfdGhpcy5maWx0ZXIgJiBOdW1iZXIoa2V5KSkgIT09IDA7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5tYXAoZnVuY3Rpb24gKF9hKSB7XG4gICAgICAgICAgICAgICAgdmFyIGtleSA9IF9hWzBdLCB2YWwgPSBfYVsxXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgICAgICAgfSkuam9pbignLCAnKTtcbiAgICAgICAgICAgIHRoaXMuU2VsZWN0ZWRPcHRpb25zRGlzcGxheS5pbm5lclRleHQgPSB0ZXh0O1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLmNyZWF0ZUV2ZW50TGlzdGVuZXJzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgaWYgKF90aGlzLm9wdGlvbkVsZW1lbnRzLmhhcyhldmVudC50YXJnZXQpKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMudG9nZ2xlT3B0aW9uKGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgcGF0aCA9IERPTV8xLkRPTS5nZXRQYXRoVG9Sb290KGV2ZW50LnRhcmdldCk7XG4gICAgICAgICAgICAgICAgaWYgKHBhdGguaW5kZXhPZihfdGhpcy5Ecm9wZG93bikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLmNsb3NlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5hY3RpdmUgPyBfdGhpcy5jbG9zZSgpIDogX3RoaXMub3BlbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwge1xuICAgICAgICAgICAgcGFzc2l2ZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChldmVudC5rZXlDb2RlID09PSAzMikge1xuICAgICAgICAgICAgICAgIHZhciBwYXRoID0gRE9NXzEuRE9NLmdldFBhdGhUb1Jvb3QoZG9jdW1lbnQuYWN0aXZlRWxlbWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKHBhdGguaW5kZXhPZihfdGhpcy5Ecm9wZG93bikgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5hY3RpdmUgJiYgX3RoaXMudXNpbmdBcnJvd0tleXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnRvZ2dsZU9wdGlvbihfdGhpcy5sYXN0U2VsZWN0ZWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChfdGhpcy5hY3RpdmUpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gMzcgfHwgZXZlbnQua2V5Q29kZSA9PT0gMzgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW92ZUFycm93U2VsZWN0aW9uKC0xKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKGV2ZW50LmtleUNvZGUgPT09IDM5IHx8IGV2ZW50LmtleUNvZGUgPT09IDQwKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdmVBcnJvd1NlbGVjdGlvbigxKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5NZW51T3B0aW9ucy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICAgICAgICAgIGlmIChfdGhpcy5sYXN0U2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICBfdGhpcy51c2luZ0Fycm93S2V5cyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIF90aGlzLmxhc3RTZWxlY3RlZC5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5Ecm9wZG93bi5hZGRFdmVudExpc3RlbmVyKCdibHVyJywgZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgICAgICBpZiAoX3RoaXMuYWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgX3RoaXMuY2xvc2UoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIFdlYlBhZ2VfMS5TY3JvbGxIb29rLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgX3RoaXMuY2hlY2tQb3NpdGlvbigpO1xuICAgICAgICB9LCB7XG4gICAgICAgICAgICBwYXNzaXZlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICB9O1xuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUuY2xvc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgICAgIHRoaXMuRHJvcGRvd24uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfTtcbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLm9wZW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5Ecm9wZG93bi5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgICAgaWYgKHRoaXMubGFzdFNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZC5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBTa2lsbHNGaWx0ZXIucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5hY3RpdmUgPyB0aGlzLmNsb3NlKCkgOiB0aGlzLm9wZW4oKTtcbiAgICB9O1xuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUudG9nZ2xlT3B0aW9uID0gZnVuY3Rpb24gKG9wdGlvbikge1xuICAgICAgICB2YXIgYml0ID0gdGhpcy5vcHRpb25FbGVtZW50cy5nZXQob3B0aW9uKTtcbiAgICAgICAgaWYgKCh0aGlzLmZpbHRlciAmIGJpdCkgIT09IDApIHtcbiAgICAgICAgICAgIG9wdGlvbi5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgb3B0aW9uLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5maWx0ZXIgXj0gYml0O1xuICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZCA9IG9wdGlvbjtcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICB9O1xuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUubW92ZUFycm93U2VsZWN0aW9uID0gZnVuY3Rpb24gKGRpcikge1xuICAgICAgICBpZiAoIXRoaXMubGFzdFNlbGVjdGVkKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZCA9IHRoaXMuTWVudU9wdGlvbnMuZmlyc3RFbGVtZW50Q2hpbGQ7XG4gICAgICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZC5jbGFzc0xpc3QuYWRkKCdob3ZlcicpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMudXNpbmdBcnJvd0tleXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RTZWxlY3RlZC5jbGFzc0xpc3QucmVtb3ZlKCdob3ZlcicpO1xuICAgICAgICAgICAgICAgIGlmIChkaXIgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFNlbGVjdGVkID0gKHRoaXMubGFzdFNlbGVjdGVkLnByZXZpb3VzRWxlbWVudFNpYmxpbmcgfHwgdGhpcy5NZW51T3B0aW9ucy5sYXN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubGFzdFNlbGVjdGVkID0gKHRoaXMubGFzdFNlbGVjdGVkLm5leHRFbGVtZW50U2libGluZyB8fCB0aGlzLk1lbnVPcHRpb25zLmZpcnN0RWxlbWVudENoaWxkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnVzaW5nQXJyb3dLZXlzID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubGFzdFNlbGVjdGVkLmNsYXNzTGlzdC5hZGQoJ2hvdmVyJyk7XG4gICAgICAgICAgICBpZiAoIURPTV8xLkRPTS5pbk9mZnNldFZpZXcodGhpcy5sYXN0U2VsZWN0ZWQsIHsgaWdub3JlWDogdHJ1ZSwgd2hvbGU6IHRydWUgfSkpIHtcbiAgICAgICAgICAgICAgICBET01fMS5ET00uc2Nyb2xsQ29udGFpbmVyVG9WaWV3V2hvbGVDaGlsZCh0aGlzLk1lbnUsIHRoaXMubGFzdFNlbGVjdGVkLCB7IGlnbm9yZVg6IHRydWUsIHNtb290aDogdHJ1ZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLnVzaW5nQXJyb3dLZXlzID0gdHJ1ZTtcbiAgICB9O1xuICAgIFNraWxsc0ZpbHRlci5wcm90b3R5cGUuY2hlY2tQb3NpdGlvbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKERPTV8xLkRPTS5waXhlbHNBYm92ZVNjcmVlbkJvdHRvbSh0aGlzLkRyb3Bkb3duKSA8PSB0aGlzLm1heEhlaWdodCkge1xuICAgICAgICAgICAgaWYgKCF0aGlzLnRvcCkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9wID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLkRyb3Bkb3duLmNsYXNzTGlzdC5hZGQoJ3RvcCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKHRoaXMudG9wKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b3AgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB0aGlzLkRyb3Bkb3duLmNsYXNzTGlzdC5yZW1vdmUoJ3RvcCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gU2tpbGxzRmlsdGVyO1xufSgpKTtcbmV4cG9ydHMuU2tpbGxzRmlsdGVyID0gU2tpbGxzRmlsdGVyO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG52YXIgX19leHRlbmRzID0gKHRoaXMgJiYgdGhpcy5fX2V4dGVuZHMpIHx8IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XG4gICAgICAgICAgICAoeyBfX3Byb3RvX186IFtdIH0gaW5zdGFuY2VvZiBBcnJheSAmJiBmdW5jdGlvbiAoZCwgYikgeyBkLl9fcHJvdG9fXyA9IGI7IH0pIHx8XG4gICAgICAgICAgICBmdW5jdGlvbiAoZCwgYikgeyBmb3IgKHZhciBwIGluIGIpIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoYiwgcCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBpZiAodHlwZW9mIGIgIT09IFwiZnVuY3Rpb25cIiAmJiBiICE9PSBudWxsKVxuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNsYXNzIGV4dGVuZHMgdmFsdWUgXCIgKyBTdHJpbmcoYikgKyBcIiBpcyBub3QgYSBjb25zdHJ1Y3RvciBvciBudWxsXCIpO1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Tb2NpYWwgPSB2b2lkIDA7XG52YXIgSlNYXzEgPSByZXF1aXJlKFwiLi4vLi4vRGVmaW5pdGlvbnMvSlNYXCIpO1xudmFyIENvbXBvbmVudF8xID0gcmVxdWlyZShcIi4uL0NvbXBvbmVudFwiKTtcbnZhciBTb2NpYWwgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhTb2NpYWwsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gU29jaWFsKCkge1xuICAgICAgICByZXR1cm4gX3N1cGVyICE9PSBudWxsICYmIF9zdXBlci5hcHBseSh0aGlzLCBhcmd1bWVudHMpIHx8IHRoaXM7XG4gICAgfVxuICAgIFNvY2lhbC5wcm90b3R5cGUudXBkYXRlID0gZnVuY3Rpb24gKCkgeyB9O1xuICAgIFNvY2lhbC5wcm90b3R5cGUuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIChKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHsgY2xhc3NOYW1lOiBcInNvY2lhbFwiIH0sXG4gICAgICAgICAgICBKU1hfMS5FbGVtZW50RmFjdG9yeS5jcmVhdGVFbGVtZW50KFwiYVwiLCB7IGNsYXNzTmFtZTogXCJidG4gaXMtc3ZnIGlzLXByaW1hcnlcIiwgaHJlZjogdGhpcy5kYXRhLmxpbmssIHRhcmdldDogXCJfYmxhbmtcIiB9LFxuICAgICAgICAgICAgICAgIEpTWF8xLkVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQoXCJpXCIsIHsgY2xhc3NOYW1lOiB0aGlzLmRhdGEuZmFDbGFzcyB9KSkpKTtcbiAgICB9O1xuICAgIHJldHVybiBTb2NpYWw7XG59KENvbXBvbmVudF8xLkRhdGFDb21wb25lbnQpKTtcbmV4cG9ydHMuU29jaWFsID0gU29jaWFsO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFib3V0TWUgPSB2b2lkIDA7XG5leHBvcnRzLkFib3V0TWUgPSBcIkkgYW0gYW4gYXNwaXJpbmcgd2ViIGRldmVsb3BlciBhbmQgc29mdHdhcmUgZW5naW5lZXIgY2hhc2luZyBteSBwYXNzaW9uIGZvciB3b3JraW5nIHdpdGggdGVjaG5vbG9neSBhbmQgcHJvZ3JhbW1pbmcgYXQgdGhlIFVuaXZlcnNpdHkgb2YgVGV4YXMgYXQgRGFsbGFzLiBJIGNyYXZlIHRoZSBvcHBvcnR1bml0eSB0byBjb250cmlidXRlIHRvIG1lYW5pbmdmdWwgcHJvamVjdHMgdGhhdCBlbXBsb3kgbXkgY3VycmVudCBnaWZ0cyBhbmQgaW50ZXJlc3RzIHdoaWxlIGFsc28gc2hvdmluZyBtZSBvdXQgb2YgbXkgY29tZm9ydCB6b25lIHRvIGxlYXJuIG5ldyBza2lsbHMuIE15IGdvYWwgaXMgdG8gbWF4aW1pemUgZXZlcnkgZXhwZXJpZW5jZSBhcyBhbiBvcHBvcnR1bml0eSBmb3IgcGVyc29uYWwsIHByb2Zlc3Npb25hbCwgYW5kIHRlY2huaWNhbCBncm93dGguXCI7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRWR1Y2F0aW9uID0gdm9pZCAwO1xuZXhwb3J0cy5FZHVjYXRpb24gPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnVGhlIFVuaXZlcnNpdHkgb2YgVGV4YXMgYXQgRGFsbGFzJyxcbiAgICAgICAgY29sb3I6ICcjQzc1QjEyJyxcbiAgICAgICAgaW1hZ2U6ICd1dGQuc3ZnJyxcbiAgICAgICAgbGluazogJ2h0dHBzOi8vdXRkYWxsYXMuZWR1JyxcbiAgICAgICAgbG9jYXRpb246ICdSaWNoYXJkc29uLCBUWCwgVVNBJyxcbiAgICAgICAgZGVncmVlOiAnTWFzdGVyIG9mIFNjaWVuY2UgaW4gQ29tcHV0ZXIgU2NpZW5jZScsXG4gICAgICAgIHN0YXJ0OiAnU3ByaW5nIDIwMjEnLFxuICAgICAgICBlbmQ6ICdGYWxsIDIwMjInLFxuICAgICAgICBjcmVkaXRzOiB7XG4gICAgICAgICAgICB0b3RhbDogMzMsXG4gICAgICAgICAgICBjb21wbGV0ZWQ6IDYsXG4gICAgICAgICAgICB0YWtpbmc6IDksXG4gICAgICAgIH0sXG4gICAgICAgIGdwYToge1xuICAgICAgICAgICAgb3ZlcmFsbDogJzQuMCcsXG4gICAgICAgIH0sXG4gICAgICAgIG5vdGVzOiBbXG4gICAgICAgICAgICAnU3lzdGVtcyBUcmFjaycsXG4gICAgICAgICAgICAnSm9uc3NvbiBTY2hvb2wgRmFzdC1UcmFjayBQcm9ncmFtJ1xuICAgICAgICBdLFxuICAgICAgICBjb3Vyc2VzOiBbXG4gICAgICAgICAgICAnQ29tcHV0ZXIgQXJjaGl0ZWN0dXJlJyxcbiAgICAgICAgICAgICdEZXNpZ24gYW5kIEFuYWx5c2lzIG9mIENvbXB1dGVyIEFsZ29yaXRobXMnLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnVGhlIFVuaXZlcnNpdHkgb2YgVGV4YXMgYXQgRGFsbGFzJyxcbiAgICAgICAgY29sb3I6ICcjQzc1QjEyJyxcbiAgICAgICAgaW1hZ2U6ICd1dGQuc3ZnJyxcbiAgICAgICAgbGluazogJ2h0dHBzOi8vdXRkYWxsYXMuZWR1JyxcbiAgICAgICAgbG9jYXRpb246ICdSaWNoYXJkc29uLCBUWCwgVVNBJyxcbiAgICAgICAgZGVncmVlOiAnQmFjaGVsb3Igb2YgU2NpZW5jZSBpbiBDb21wdXRlciBTY2llbmNlJyxcbiAgICAgICAgc3RhcnQ6ICdGYWxsIDIwMTgnLFxuICAgICAgICBlbmQ6ICdGYWxsIDIwMjEnLFxuICAgICAgICBjcmVkaXRzOiB7XG4gICAgICAgICAgICB0b3RhbDogMTI0LFxuICAgICAgICAgICAgY29tcGxldGVkOiAxMTQsXG4gICAgICAgICAgICB0YWtpbmc6IDEwLFxuICAgICAgICB9LFxuICAgICAgICBncGE6IHtcbiAgICAgICAgICAgIG92ZXJhbGw6ICc0LjAnLFxuICAgICAgICAgICAgbWFqb3I6ICc0LjAnXG4gICAgICAgIH0sXG4gICAgICAgIG5vdGVzOiBbXG4gICAgICAgICAgICAnQ29sbGVnaXVtIFYgSG9ub3JzJ1xuICAgICAgICBdLFxuICAgICAgICBjb3Vyc2VzOiBbXG4gICAgICAgICAgICAnRGF0YSBTdHJ1Y3R1cmVzIGFuZCBBbGdvcml0aG0gQW5hbHlzaXMnLFxuICAgICAgICAgICAgJ09wZXJhdGluZyBTeXN0ZW1zJyxcbiAgICAgICAgICAgICdTb2Z0d2FyZSBFbmdpbmVlcmluZycsXG4gICAgICAgICAgICAnUHJvZ3JhbW1pbmcgaW4gVU5JWCdcbiAgICAgICAgXVxuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRXhwZXJpZW5jZSA9IHZvaWQgMDtcbmV4cG9ydHMuRXhwZXJpZW5jZSA9IFtcbiAgICB7XG4gICAgICAgIHN2ZzogJ2dvb2dsZScsXG4gICAgICAgIGxpbms6ICdodHRwczovL2Fib3V0Lmdvb2dsZS8nLFxuICAgICAgICBjb21wYW55OiAnR29vZ2xlJyxcbiAgICAgICAgbG9jYXRpb246ICdSZW1vdGUnLFxuICAgICAgICBwb3NpdGlvbjogJ1NvZnR3YXJlIEVuZ2luZWVyaW5nIEludGVybicsXG4gICAgICAgIGJlZ2luOiAnTWF5IDIwMjEnLFxuICAgICAgICBlbmQ6ICdBdWd1c3QgMjAyMScsXG4gICAgICAgIGZsYXZvcjogJ0dvb2dsZSBpcyBhIG11bHRpbmF0aW9uYWwgdGVjaG5vbG9neSBjb21wYW55IHRoYXQgcHJvdmlkZXMgYSB3aWRlIHZhcmlldHkgb2YgSW50ZXJuZXQtcmVsYXRlZCBwcm9kdWN0cyBhbmQgc2VydmljZXMuIEFzIG9uZSBvZiB0aGUgbGFyZ2VzdCB0ZWNobm9sb2d5IGNvbXBhbmllcyBpbiB0aGUgd29ybGQsIEdvb2dsZSBjb250aW51ZXMgdG8gbGVhZCB0aGUgd2ViIGluIGlubm92YXRpb24gYW5kIGNyZWF0aXZpdHkuIEkgd29ya2VkIHJlbW90ZWx5IGluIENsb3VkIFRlY2huaWNhbCBJbmZyYXN0cnVjdHVyZSBvbiB0aGUgaW50ZXJuYWwgY2x1c3RlciBtYW5hZ2VtZW50IHN5c3RlbSB0aGF0IGVtcG93ZXJzIGFsbCBvZiBHb29nbGUgYXQgc2NhbGUuJyxcbiAgICAgICAgcm9sZXM6IFtcbiAgICAgICAgICAgICdEZXNpZ25lZCBhbmQgaW1wbGVtZW50ZWQgcnVubmluZyBPQ0kgY29udGFpbmVycyBpbiBHb29nbGXigJlzIGxhcmdlLXNjYWxlIGNsdXN0ZXIgbWFuYWdlciB1c2luZyBtb2Rlcm4gQysrLCBHbywgYW5kIFByb3RvYnVmLCBoZWxwaW5nIGJyaWRnZSB0aGUgZ3Jvd2luZyBnYXAgYmV0d2VlbiB0aGUgb3BlbiBzb3VyY2Ugc3RhY2sgYW5kIGludGVybmFsIHN0YWNrLicsXG4gICAgICAgICAgICAnRGV2ZWxvcGVkIGludGVybmFsIGNoYW5nZXMgdG8gb24tbWFjaGluZSBwYWNrYWdlIGxpZmVjeWNsZSwgYWxsb3dpbmcgcGFja2FnZXMgdG8gYmUgZGlyZWN0bHkgdGllZCB0byB0aGUgbGlmZXRpbWUgb2YgZGVwZW5kZW50IHRhc2tzLicsXG4gICAgICAgICAgICAnV3JvdGUgZXh0ZW5zaXZlIHVuaXQgdGVzdHMsIGludGVncmF0aW9uIHRlc3RzLCBhbmQgZGVzaWduIGRvY3VtZW50YXRpb24uJ1xuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBzdmc6ICdmaWRlbGl0eScsXG4gICAgICAgIGxpbms6ICdodHRwczovL3d3dy5maWRlbGl0eS5jb20vJyxcbiAgICAgICAgY29tcGFueTogJ0ZpZGVsaXR5IEludmVzdG1lbnRzJyxcbiAgICAgICAgbG9jYXRpb246ICdSZW1vdGUnLFxuICAgICAgICBwb3NpdGlvbjogJ1NvZnR3YXJlIEVuZ2luZWVyIEludGVybicsXG4gICAgICAgIGJlZ2luOiAnSnVuZSAyMDIwJyxcbiAgICAgICAgZW5kOiAnSnVseSAyMDIwJyxcbiAgICAgICAgZmxhdm9yOiAnRmlkZWxpdHkgSW52ZXN0bWVudHMgaXMgYW4gaW50ZXJuYXRpb25hbCBwcm92aWRlciBvZiBmaW5hbmNpYWwgc2VydmljZXMgdGhhdCBoZWxwIGluZGl2aWR1YWxzIGFuZCBpbnN0aXR1dGlvbnMgbWVldCB0aGVpciBmaW5hbmNpYWwgb2JqZWN0aXZlcy4gQXMgYSBsZWFkZXIgaW4gdGhlIGluZHVzdHJ5LCBGaWRlbGl0eSBpcyBjb21taXR0ZWQgdG8gdXNpbmcgc3RhdGUtb2YtdGhlLWFydCB0ZWNobm9sb2d5IHRvIHNlcnZlIGl0cyBjdXN0b21lcnMuIEkgd29ya2VkIHJlbW90ZWx5IGFzIGEgcGFydCBvZiB0aGUgU2luZ2xlIFNpZ24tT24gdGVhbSBpbiB0aGUgQ3VzdG9tZXIgUHJvdGVjdGlvbiBkaXZpc2lvbiBvZiBXb3JrcGxhY2UgSW52ZXN0aW5nLicsXG4gICAgICAgIHJvbGVzOiBbXG4gICAgICAgICAgICAnQ3JlYXRlZCBhIGZ1bGwtc3RhY2sgd2ViIGFwcGxpY2F0aW9uIGZvciBzaW5nbGUgc2lnbi1vbiB3b3JrIGludGFrZSB1c2luZyBBbmd1bGFyIGFuZCBTcHJpbmcgQm9vdC4nLFxuICAgICAgICAgICAgJ0RldmVsb3BlZCBhIGR5bmFtaWMgZm9ybSBjb21wb25lbnQgbGlicmFyeSBmb2N1c2VkIG9uIHJldXNhYmxlIGxvZ2ljLCBVSSBhYnN0cmFjdGlvbiwgYW5kIGRlc2lnbiBmbGV4aWJpbGl0eS4nLFxuICAgICAgICAgICAgJ0ludGVncmF0ZWQgZnJvbnQtZW5kIGFuZCBiYWNrLWVuZCBhcHBsaWNhdGlvbnMgdXNpbmcgTWF2ZW4gYnVpbGQgdG9vbHMgYW5kIERvY2tlci4nLFxuICAgICAgICAgICAgJ0VuZ2FnZWQgaW4gcHJvZmVzc2lvbmFsIHRyYWluaW5nIHNlc3Npb25zIGZvciBkZXZlbG9waW5nIG9uIEFtYXpvbiBXZWIgU2VydmljZXMuJyxcbiAgICAgICAgICAgICdXb3JrZWQgY2xvc2VseSB3aXRoIHRoZSBBZ2lsZSBwcm9jZXNzIGFuZCBpbmNyZW1lbnRhbCBzb2Z0d2FyZSBkZWxpdmVyeS4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgc3ZnOiAnbWVkaXQnLFxuICAgICAgICBsaW5rOiAnaHR0cHM6Ly9tZWRpdC5vbmxpbmUnLFxuICAgICAgICBjb21wYW55OiAnTWVkaXQnLFxuICAgICAgICBsb2NhdGlvbjogJ0R1YmxpbiwgSXJlbGFuZCcsXG4gICAgICAgIHBvc2l0aW9uOiAnV2ViIEFwcGxpY2F0aW9uIERldmVsb3BlcicsXG4gICAgICAgIGJlZ2luOiAnTWF5IDIwMTknLFxuICAgICAgICBlbmQ6ICdKdWx5IDIwMTknLFxuICAgICAgICBmbGF2b3I6ICdNZWRpdCBpcyBhIHN0YXJ0LXVwIGNvbXBhbnkgY29tbWl0dGVkIHRvIG1ha2luZyBtZWRpY2FsIGVkdWNhdGlvbiBtb3JlIGVmZmljaWVudCB0aHJvdWdoIHRoZWlyIG1vYmlsZSBzb2x1dGlvbnMuIEJ5IGNvbWJpbmluZyB0ZWNobm9sb2d5IHdpdGggY3VyYXRlZCBjb250ZW50LCBwcmFjdGljaW5nIHByb2Zlc3Npb25hbHMgYXJlIGdpdmVuIGEgcXVpY2ssIHVuaXF1ZSwgYW5kIHJlbGV2YW50IGxlYXJuaW5nIGV4cGVyaWVuY2UuIEkgaGFkIHRoZSBvcHBvcnR1bml0eSB0byB3b3JrIGFzIHRoZSBjb21wYW55XFwncyBmaXJzdCB3ZWIgZGV2ZWxvcGVyLCBsYXlpbmcgZG93biB0aGUgZXNzZW50aWFsIGZvdW5kYXRpb25zIGZvciBhIHdlYi1iYXNlZCB2ZXJzaW9uIG9mIHRoZWlyIGFwcGxpY2F0aW9uLicsXG4gICAgICAgIHJvbGVzOiBbXG4gICAgICAgICAgICAnQXJjaGl0ZWN0ZWQgdGhlIGluaXRpYWwgZm91bmRhdGlvbnMgZm9yIGEgZnVsbC1zY2FsZSwgc2luZ2xlLXBhZ2Ugd2ViIGFwcGxpY2F0aW9uIHVzaW5nIFZ1ZSwgVHlwZVNjcmlwdCwgYW5kIFNBU1MuJyxcbiAgICAgICAgICAgICdEZXNpZ25lZCBhbiBpbnRlcmZhY2Utb3JpZW50ZWQsIG1vZHVsYXJpemVkIHN0YXRlIG1hbmFnZW1lbnQgc3lzdGVtIHRvIHdvcmsgYmVoaW5kIHRoZSBhcHBsaWNhdGlvbi4nLFxuICAgICAgICAgICAgJ0RldmVsb3BlZCBhIFZ1ZSBjb25maWd1cmF0aW9uIGxpYnJhcnkgdG8gZW5oYW5jZSB0aGUgYWJpbGl0eSB0byBtb2NrIGFwcGxpY2F0aW9uIHN0YXRlIGluIHVuaXQgdGVzdGluZy4nLFxuICAgICAgICAgICAgJ0VzdGFibGlzaGVkIGEgY29tcHJlaGVuc2l2ZSBVSSBjb21wb25lbnQgbGlicmFyeSB0byBhY2NlbGVyYXRlIHRoZSBhYmlsaXR5IHRvIGFkZCBuZXcgY29udGVudC4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgc3ZnOiAnbGlmZWNodXJjaCcsXG4gICAgICAgIGxpbms6ICdodHRwczovL2xpZmUuY2h1cmNoJyxcbiAgICAgICAgY29tcGFueTogJ0xpZmUuQ2h1cmNoJyxcbiAgICAgICAgbG9jYXRpb246ICdFZG1vbmQsIE9LLCBVU0EnLFxuICAgICAgICBwb3NpdGlvbjogJ0luZm9ybWF0aW9uIFRlY2hub2xvZ3kgSW50ZXJuJyxcbiAgICAgICAgYmVnaW46ICdNYXkgMjAxOCcsXG4gICAgICAgIGVuZDogJ0F1Z3VzdCAyMDE4JyxcbiAgICAgICAgZmxhdm9yOiAnTGlmZS5DaHVyY2ggaXMgYSBtdWx0aS1zaXRlIGNodXJjaCB3aXRoIGEgd29ybGR3aWRlIGltcGFjdCwgY2VudGVyZWQgYXJvdW5kIHRoZWlyIG1pc3Npb24gdG8gXCJsZWFkIHBlb3BsZSB0byBiZWNvbWUgZnVsbHktZGV2b3RlZCBmb2xsb3dlcnMgb2YgQ2hyaXN0LlwiIEkgd29ya2VkIGFsb25nc2lkZSB0aGVpciBDZW50cmFsIEluZm9ybWF0aW9uIFRlY2hub2xvZ3kgdGVhbTogYSBncm91cCBkZWRpY2F0ZWQgdG8gdXRpbGl6aW5nIHRlY2hub2xvZ3kgdG8gc2VydmUgYW5kIGVxdWlwIHRoZSBjaHVyY2guJyxcbiAgICAgICAgcm9sZXM6IFtcbiAgICAgICAgICAgICdTcGVudCB0aW1lIGxlYXJuaW5nIGZyb20gaGFyZHdhcmUsIHNvZnR3YXJlLCBhbmQgZGF0YWJhc2UgdGVhbXMgaW4gYW4gQWdpbGUgZW52aXJvbm1lbnQuJyxcbiAgICAgICAgICAgICdEZXNpZ25lZCBhbmQgZGV2ZWxvcGVkIGEgd2ViIGFwcGxpY2F0aW9uIGZvciByZW1vdGUgdm9sdW50ZWVyIHRyYWNraW5nIHdpdGggTm9kZS5qcyBhbmQgUG9zdGdyZVNRTC4nLFxuICAgICAgICAgICAgJ0R5bmFtaWNhbGx5IGRlcGxveWVkIGFwcGxpY2F0aW9uIHRvIEdvb2dsZSBDbG91ZCBQbGF0Zm9ybSB1c2luZyBDbG91ZCBCdWlsZHMsIERvY2tlciwgYW5kIEt1YmVybmV0ZXMuJ1xuICAgICAgICBdXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Qcm9qZWN0cyA9IHZvaWQgMDtcbmV4cG9ydHMuUHJvamVjdHMgPSBbXG4gICAge1xuICAgICAgICBuYW1lOiAnRGF0YUpvaW50IENvcmUnLFxuICAgICAgICBjb2xvcjogJyM1MUE4QjknLFxuICAgICAgICBpbWFnZTogJ2RhdGFqb2ludC1jb3JlLmpwZycsXG4gICAgICAgIHR5cGU6ICdTZW5pb3IgQ2Fwc3RvbmUnLFxuICAgICAgICBkYXRlOiAnRmFsbCAyMDIxJyxcbiAgICAgICAgYXdhcmQ6IG51bGwsXG4gICAgICAgIGZsYXZvcjogJ1J1c3QgbGlicmFyeSBmb3Igc2hhcmVkIGNvZGUgYWNyb3NzIHVzZXItbGV2ZWwgRGF0YUpvaW50IGZyYW1ld29ya3MuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9kYXRham9pbnQvZGF0YWpvaW50LWNvcmUnLFxuICAgICAgICBleHRlcm5hbDogbnVsbCxcbiAgICAgICAgZGV0YWlsczogW1xuICAgICAgICAgICAgJ0ltcGxlbWVudGVkIHdpdGggUnVzdCBhbmQgU1FMeC4nLFxuICAgICAgICAgICAgJ01vdmVzIGRhdGFiYXNlIGNvbm5lY3Rpb24gYW5kIHF1ZXJ5aW5nIGNvZGUgdG8gYSBzaGFyZWQgbGlicmFyeSB0byBhdm9pZCBjb2RlIGR1cGxpY2F0aW9uLicsXG4gICAgICAgICAgICAnQWxsb3dzIGNvbm5lY3Rpb25zIHRvIGFueSBNeVNRTCwgUG9zdGdyZXMsIE1TU1FMLCBvciBTUUxpdGUgZGF0YWJhc2UuJyxcbiAgICAgICAgICAgICdFeHBvc2VkIG92ZXIgYSBDIEZGSSBmb3IgdXNlci1sZXZlbCBmcmFtZXdvcmtzIGluIFB5dGhvbiwgTUFUTEFCLCBhbmQgbW9yZS4nLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnUGFuZGEnLFxuICAgICAgICBjb2xvcjogJyM1ODY1RjInLFxuICAgICAgICBpbWFnZTogJ3BhbmRhLWRpc2NvcmQuanBnJyxcbiAgICAgICAgdHlwZTogJ05QTSBQYWNrYWdlJyxcbiAgICAgICAgZGF0ZTogJ1N1bW1lciAyMDIxJyxcbiAgICAgICAgYXdhcmQ6IG51bGwsXG4gICAgICAgIGZsYXZvcjogJ0NvbW1hbmQgZnJhbWV3b3JrIGZvciBidWlsZGluZyBEaXNjb3JkIGJvdHMgd2l0aCBkaXNjb3JkLmpzLicsXG4gICAgICAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkL3BhbmRhLWRpc2NvcmQnLFxuICAgICAgICBleHRlcm5hbDogJ2h0dHBzOi8vd3d3Lm5wbWpzLmNvbS9wYWNrYWdlL3BhbmRhLWRpc2NvcmQnLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAnSW1wbGVtZW50ZWQgd2l0aCBUeXBlU2NyaXB0IGFuZCBkaXNjb3JkLmpzLicsXG4gICAgICAgICAgICAnU3Ryb25nbHktdHlwZWQsIGNsYXNzLWJhc2VkIHN0cnVjdHVyZSBmb3Igd3JpdGluZyBjb21wbGV4IGNvbW1hbmRzLicsXG4gICAgICAgICAgICAnQWxsb3dzIG1lc3NhZ2UgY29tbWFuZHMgYW5kIGludGVyYWN0aW9uIGNvbW1hbmRzIHRvIGJlIGhhbmRsZWQgYnkgYSBzaW5nbGUgbWV0aG9kLicsXG4gICAgICAgICAgICAnSGFuZGxlcyBhcmd1bWVudCBwYXJzaW5nLCBjYXRlZ29yaWVzLCBwZXJtaXNzaW9ucywgY29vbGRvd25zLCBhbmQgbW9yZS4nXG4gICAgICAgIF0sXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdTcGluZGEgRGlzY29yZCBCb3QnLFxuICAgICAgICBjb2xvcjogJyNGNzVENUQnLFxuICAgICAgICBpbWFnZTogJ3NwaW5kYS5qcGcnLFxuICAgICAgICB0eXBlOiAnU2lkZSBQcm9qZWN0JyxcbiAgICAgICAgZGF0ZTogJ0ZhbGwgMjAyMCcsXG4gICAgICAgIGF3YXJkOiBudWxsLFxuICAgICAgICBmbGF2b3I6ICdEaXNjb3JkIGJvdCBmb3IgZ2VuZXJhdGluZyBTcGluZGEgcGF0dGVybnMsIGN1c3RvbSBjb21tYW5kcywgYW5kIG1vcmUuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQvc3BpbmRhLWRpc2NvcmQtYm90JyxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIFR5cGVTY3JpcHQsIGRpc2NvcmQuanMsIFNlcXVlbGl6ZSwgYW5kIFBhbmRhLicsXG4gICAgICAgICAgICAnRGVwbG95ZWQgd2l0aCBhIFBvc3RncmVTUUwgZGF0YWJhc2UgdG8gSGVyb2t1LicsXG4gICAgICAgICAgICBcIkdlbmVyYXRlcyBhIHJhbmRvbSBwYXR0ZXJuIG9mIHRoZSBQb2tcXHUwMEU5bW9uIFNwaW5kYSBmcm9tIDQsMjk0LDk2NywyOTUgcG9zc2liaWxpdGllcywgbWF0Y2hpbmcgdGhlIGJlaGF2aW9yIG9mIHRoZSBtYWlubGluZSBQb2tcXHUwMEU5bW9uIGdhbWVzXCIsXG4gICAgICAgICAgICAnU2VydmVyLXNwZWNpZmljLCBoaWdobHktcHJvZ3JhbW1hYmxlIGN1c3RvbSBjb21tYW5kcy4nLFxuICAgICAgICBdLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQWV0aGVyJyxcbiAgICAgICAgY29sb3I6ICcjMUMxQzY3JyxcbiAgICAgICAgaW1hZ2U6ICdhZXRoZXIuanBnJyxcbiAgICAgICAgdHlwZTogJ1NpZGUgUHJvamVjdCcsXG4gICAgICAgIGRhdGU6ICdTcHJpbmctV2ludGVyIDIwMjAnLFxuICAgICAgICBhd2FyZDogbnVsbCxcbiAgICAgICAgZmxhdm9yOiAnSFRUUC9IVFRQUy9XZWJTb2NrZXQgcHJveHkgc2VydmVyIGZvciB2aWV3aW5nIGFuZCBpbnRlcmNlcHRpbmcgd2ViIHRyYWZmaWMuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQvYWV0aGVyLXByb3h5JyxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIEMrKyB1c2luZyB0aGUgQm9vc3QuQXNpbyBsaWJyYXJ5LicsXG4gICAgICAgICAgICAnTXVsdGl0aHJlYWRlZCBIVFRQL0hUVFBTL1dlYlNvY2tldCBwYXJzaW5nLCBmb3J3YXJkaW5nLCBhbmQgaW50ZXJjZXB0aW9uLicsXG4gICAgICAgICAgICAnQ3VzdG9tIGNlcnRpZmljYXRlIGF1dGhvcml0eSBhbmQgY2VydGlmaWNhdGUgZ2VuZXJhdGlvbiB3aXRoIE9wZW5TU0wuJyxcbiAgICAgICAgICAgICdXZWJTb2NrZXQgY29tcHJlc3Npb24gYW5kIGRlY29tcHJlc3Npb24gd2l0aCB6bGliLicsXG4gICAgICAgICAgICAnRG96ZW5zIG9mIGNvbW1hbmQtbGluZSBvcHRpb25zIGFuZCBldmVudCBob29rIGludGVyY2VwdG9ycy4nLFxuICAgICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdBUiBTcGhlcmUnLFxuICAgICAgICBjb2xvcjogJyNEQjRGNTQnLFxuICAgICAgICBpbWFnZTogJ2FyLXNwaGVyZS5qcGcnLFxuICAgICAgICB0eXBlOiAnQUNNIElnbml0ZScsXG4gICAgICAgIGRhdGU6ICdGYWxsIDIwMTknLFxuICAgICAgICBhd2FyZDogJ0ZpcnN0IHBsYWNlIGZvciBGYWxsIDIwMTkgQUNNIElnbml0ZScsXG4gICAgICAgIGZsYXZvcjogJ01vYmlsZSBhcHBsaWNhdGlvbiB0byBwbGFjZSBwZXJzaXN0ZW50IEFSIG1vZGVscyBhbmQgZXhwZXJpZW5jZXMgYWNyb3NzIHRoZSBnbG9iZS4nLFxuICAgICAgICByZXBvOiAnaHR0cHM6Ly9naXRodWIuY29tL2phY2tzb24tbmVzdGVscm9hZC9hci1zcGhlcmUtc2VydmVyJyxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdTZW1lc3Rlci1sb25nIHRlYW0gZW50cmVwcmVuZXVyaWFsIHByb2plY3QuJyxcbiAgICAgICAgICAgICdMZWFkIHNlcnZlciBkZXZlbG9wZXIgd2l0aCBDIywgQVNQLk5FVCBDb3JlIE1WQywgYW5kIEVudGl0eSBGcmFtZXdvcmsuJyxcbiAgICAgICAgICAgICdTdHJlYW0gY29udGludW91cyBkYXRhIGFuZCByZWFsLXRpbWUgdXBkYXRlcyB3aXRoIFNpZ25hbFIuJyxcbiAgICAgICAgICAgICdTYXZlcyBnZW9ncmFwaGljYWwgZGF0YSB3aXRoIEF6dXJlIFNwYXRpYWwgQW5jaG9ycy4nLFxuICAgICAgICAgICAgJ0RlcGxveWVkIHRvIE1pY3Jvc29mdCBBenVyZSB3aXRoIFNRTCBTZXJ2ZXIgYW5kIEJsb2IgU3RvcmFnZS4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1BvcnRmb2xpbyBXZWJzaXRlJyxcbiAgICAgICAgY29sb3I6ICcjMjlBQjg3JyxcbiAgICAgICAgaW1hZ2U6ICdwb3J0Zm9saW8td2Vic2l0ZS5qcGcnLFxuICAgICAgICB0eXBlOiAnU2lkZSBQcm9qZWN0JyxcbiAgICAgICAgZGF0ZTogJ1NwcmluZy9TdW1tZXIgMjAxOScsXG4gICAgICAgIGF3YXJkOiBudWxsLFxuICAgICAgICBmbGF2b3I6ICdQZXJzb25hbCB3ZWJzaXRlIHRvIHNob3djYXNlIG15IHdvcmsgYW5kIGV4cGVyaWVuY2UuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQvcG9ydGZvbGlvLXdlYnNpdGUnLFxuICAgICAgICBleHRlcm5hbDogJ2h0dHBzOi8vamFja3Nvbi5uZXN0ZWxyb2FkLmNvbScsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCBmcm9tIHNjcmF0Y2ggd2l0aCBwdXJlIFR5cGVTY3JpcHQuJyxcbiAgICAgICAgICAgICdDdXN0b20tbWFkZSwgZHluYW1pYyBTQ1NTIGxpYnJhcnkuJyxcbiAgICAgICAgICAgICdDbGFzcy1iYXNlZCwgZWFzeS10by11cGRhdGUgSlNYIHJlbmRlcmluZyBmb3IgcmVjdXJyaW5nIGNvbnRlbnQuJyxcbiAgICAgICAgICAgICdTdXBwb3J0cyBJbnRlcm5ldCBFeHBsb3JlciAxMS4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1BvbmRlcicsXG4gICAgICAgIGNvbG9yOiAnI0ZGQTUwMCcsXG4gICAgICAgIGltYWdlOiAncG9uZGVyLmpwZycsXG4gICAgICAgIHR5cGU6ICdTaWRlIFByb2plY3QnLFxuICAgICAgICBkYXRlOiAnSGFja1VURCAyMDE5JyxcbiAgICAgICAgYXdhcmQ6ICdcIkJlc3QgVUkvVVhcIiBmb3IgSGFja1VURCAyMDE5JyxcbiAgICAgICAgZmxhdm9yOiAnV2ViIGFuZCBtb2JpbGUgYXBwbGljYXRpb24gdG8gbWFrZSBncm91cCBicmFpbnN0b3JtaW5nIG9yZ2FuaXplZCBhbmQgZWZmaWNpZW50LicsXG4gICAgICAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkL3BvbmRlci1oYWNrdXRkLTE5JyxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIFJlYWN0IGFuZCBGaXJlYmFzZSBSZWFsdGltZSBEYXRhYmFzZS4nLFxuICAgICAgICAgICAgJ0NvbXBsZXRlIGNvbm5lY3Rpb24gYW5kIHJlYWx0aW1lIHVwZGF0ZXMgd2l0aCBtb2JpbGUgY291bnRlcnBhcnQuJyxcbiAgICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnS2V5IENvbnN1bWVyJyxcbiAgICAgICAgY29sb3I6ICcjN0E2OUFEJyxcbiAgICAgICAgaW1hZ2U6ICdrZXktY29uc3VtZXIuanBnJyxcbiAgICAgICAgdHlwZTogJ1NpZGUgUHJvamVjdCcsXG4gICAgICAgIGRhdGU6ICdKYW51YXJ5IDIwMTknLFxuICAgICAgICBhd2FyZDogbnVsbCxcbiAgICAgICAgZmxhdm9yOiAnV2luZG93cyBjb21tYW5kIHRvIGF0dGFjaCBhIGxvdy1sZXZlbCBrZXlib2FyZCBob29rIGluIGFub3RoZXIgcnVubmluZyBwcm9jZXNzLicsXG4gICAgICAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkL2tleS1jb25zdW1lcicsXG4gICAgICAgIGV4dGVybmFsOiBudWxsLFxuICAgICAgICBkZXRhaWxzOiBbXG4gICAgICAgICAgICAnSW1wbGVtZW50ZWQgd2l0aCBDKysgYW5kIFdpbmRvd3MgQVBJLicsXG4gICAgICAgICAgICAnQXR0YWNoZXMgLmRsbCBmaWxlIHRvIGFub3RoZXIgcHJvY2VzcyB0byBhdm9pZCBkZXRlY3Rpb24uJyxcbiAgICAgICAgICAgICdJbnRlcmNlcHRzIGFuZCBjaGFuZ2VzIGtleSBpbnB1dHMgb24gdGhlIGZseS4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0NvbWV0IENsaW1hdGUgQVBJJyxcbiAgICAgICAgY29sb3I6ICcjMkQ4N0M2JyxcbiAgICAgICAgaW1hZ2U6ICdjb21ldC1jbGltYXRlLmpwZycsXG4gICAgICAgIHR5cGU6ICdDbGFzcyBQcm9qZWN0JyxcbiAgICAgICAgZGF0ZTogJ05vdmVtYmVyIDIwMTgnLFxuICAgICAgICBhd2FyZDogbnVsbCxcbiAgICAgICAgZmxhdm9yOiAnU2VsZi11cGRhdGluZyBBUEkgdG8gY29sbGVjdCBjdXJyZW50IHdlYXRoZXIgYW5kIFR3aXR0ZXIgZGF0YSBmb3IgdGhlIFVuaXZlcnNpdHkgb2YgVGV4YXMgYXQgRGFsbGFzLicsXG4gICAgICAgIHJlcG86ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkL2NvbWV0LWNsaW1hdGUtc2VydmVyJyxcbiAgICAgICAgZXh0ZXJuYWw6IG51bGwsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIEMjIGFuZCB0aGUgQVNQLk5FVCBDb3JlIE1WQy4nLFxuICAgICAgICAgICAgJ0RlcGxveWVkIHRvIEhlcm9rdSB3aXRoIFBvc3RncmVTUUwgZGF0YWJhc2UuJyxcbiAgICAgICAgICAgICdBbHdheXMgcmV0dXJucyBkYXRhIGxlc3MgdGhhbiAxMCBtaW51dGVzIG9sZC4nXG4gICAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0NocmlzdC1DZW50ZXJlZCcsXG4gICAgICAgIGNvbG9yOiAnI0ZFOTA0RScsXG4gICAgICAgIGltYWdlOiAnY2hyaXN0LWNlbnRlcmVkLmpwZycsXG4gICAgICAgIHR5cGU6ICdTaWRlIFByb2plY3QnLFxuICAgICAgICBkYXRlOiAnRmFsbCAyMDE4JyxcbiAgICAgICAgYXdhcmQ6IG51bGwsXG4gICAgICAgIGZsYXZvcjogJ0dvb2dsZSBDaHJvbWUgZXh0ZW5zaW9uIHRvIGRlbGl2ZXIgdGhlIFlvdVZlcnNpb24gVmVyc2Ugb2YgdGhlIERheSB0byB5b3VyIG5ldyB0YWIuJyxcbiAgICAgICAgcmVwbzogJ2h0dHBzOi8vZ2l0aHViLmNvbS9qYWNrc29uLW5lc3RlbHJvYWQvY2hyaXN0LWNlbnRlcmVkJyxcbiAgICAgICAgZXh0ZXJuYWw6ICdodHRwOi8vYml0Lmx5L2NocmlzdC1jZW50ZXJlZCcsXG4gICAgICAgIGRldGFpbHM6IFtcbiAgICAgICAgICAgICdJbXBsZW1lbnRlZCB3aXRoIFJlYWN0IGFuZCBDaHJvbWUgQVBJLicsXG4gICAgICAgICAgICAnQ3VzdG9tIHZlcnNlIHNlYXJjaGluZyBieSBrZXl3b3JkIG9yIG51bWJlci4nLFxuICAgICAgICAgICAgJ0dpdmVzIGN1cnJlbnQgd2VhdGhlciBmb3IgdXNlclxcJ3MgbG9jYXRpb24gdmlhIHRoZSBPcGVuV2VhdGhlck1hcCBBUEkuJ1xuICAgICAgICBdXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5RdWFsaXRpZXMgPSB2b2lkIDA7XG5leHBvcnRzLlF1YWxpdGllcyA9IFtcbiAgICB7XG4gICAgICAgIGZhQ2xhc3M6ICdmYXMgZmEtaGlzdG9yeScsXG4gICAgICAgIG5hbWU6ICdFZmZpY2llbnQnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ0kgY29uc2lzdGVudGx5IGJyaW5nIGVuZXJneSwgcHJvZHVjdGl2aXR5LCBvcmdhbml6YXRpb24sIGFuZCBhZ2lsaXR5IHRvIHRoZSB0YWJsZSBhcyBhbiBlZmZlY3RpdmUgd29ya2VyIGFuZCBhIHF1aWNrIGxlYXJuZXIuJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBmYUNsYXNzOiAnZmFyIGZhLXNub3dmbGFrZScsXG4gICAgICAgIG5hbWU6ICdBdHRlbnRpdmUnLFxuICAgICAgICBkZXNjcmlwdGlvbjogJ1RvIG1lLCBldmVyeSBkZXRhaWwgbWF0dGVycy4gSSBsb3ZlIGZvcm11bGF0aW5nIHRoZSBiaWcgcGljdHVyZSBqdXN0IGFzIG11Y2ggYXMgbWVhc3VyaW5nIG91dCB0aGUgdGlueSBkZXRhaWxzIGFuZCBlZGdlIGNhc2VzLidcbiAgICB9LFxuICAgIHtcbiAgICAgICAgZmFDbGFzczogJ2ZhcyBmYS1mZWF0aGVyLWFsdCcsXG4gICAgICAgIG5hbWU6ICdGbGV4aWJsZScsXG4gICAgICAgIGRlc2NyaXB0aW9uOiAnSSB3b3JrIGJlc3Qgd2hlbiBJIGFtIGNoYWxsZW5nZWQuIFdoaWxlIEkgdGhyaXZlIGluIG9yZ2FuaXphdGlvbiwgSSBjYW4gYWx3YXlzIGFkYXB0IGFuZCBwaWNrIHVwIG5ldyB0aGluZ3MgaW4gYSBzd2lmdCBtYW5uZXIuJ1xuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuU2tpbGxzID0gdm9pZCAwO1xudmFyIFNraWxsXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbFwiKTtcbmV4cG9ydHMuU2tpbGxzID0gW1xuICAgIHtcbiAgICAgICAgbmFtZTogJ0FtYXpvbiBXZWIgU2VydmljZXMnLFxuICAgICAgICBzdmc6ICdhd3MnLFxuICAgICAgICBjb2xvcjogJyMyMzJGM0UnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRldk9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0FuZ3VsYXInLFxuICAgICAgICBzdmc6ICdhbmd1bGFyJyxcbiAgICAgICAgY29sb3I6ICcjREQwMDMxJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuRnJhbWV3b3JrLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQysrJyxcbiAgICAgICAgc3ZnOiAnY3BsdXNwbHVzJyxcbiAgICAgICAgY29sb3I6ICcjOUIwMjNBJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5Qcm9ncmFtbWluZyB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5TZXJ2ZXIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdDIycsXG4gICAgICAgIHN2ZzogJ2NzaGFycCcsXG4gICAgICAgIGNvbG9yOiAnIzlCNEY5NycsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2VydmVyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnQ1NTJyxcbiAgICAgICAgc3ZnOiAnY3NzJyxcbiAgICAgICAgY29sb3I6ICcjM0M5Q0Q3JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdEb2NrZXInLFxuICAgICAgICBzdmc6ICdkb2NrZXInLFxuICAgICAgICBjb2xvcjogJyMyMkI5RUMnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRldk9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJy5ORVQgQ29yZS9GcmFtZXdvcmsnLFxuICAgICAgICBzdmc6ICdkb3RuZXQnLFxuICAgICAgICBjb2xvcjogJyMwRjc2QkQnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlNlcnZlciB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5GcmFtZXdvcmssXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdFeHByZXNzIEpTJyxcbiAgICAgICAgc3ZnOiAnZXhwcmVzcycsXG4gICAgICAgIGNvbG9yOiAnIzNEM0QzRCcsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2VydmVyIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkZyYW1ld29yayxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0ZpZ21hJyxcbiAgICAgICAgc3ZnOiAnZmlnbWEnLFxuICAgICAgICBjb2xvcjogJyNGMjRFMUUnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5Lk90aGVyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnRmlyZWJhc2UnLFxuICAgICAgICBzdmc6ICdmaXJlYmFzZScsXG4gICAgICAgIGNvbG9yOiAnI0ZGQ0EyOCcsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuRGF0YWJhc2UsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdHaXQnLFxuICAgICAgICBzdmc6ICdnaXQnLFxuICAgICAgICBjb2xvcjogJyNGMDUwMzInLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnR05VIEJhc2gnLFxuICAgICAgICBzdmc6ICdiYXNoJyxcbiAgICAgICAgY29sb3I6ICcjMkIzNTM5JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5TY3JpcHRpbmcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdHb29nbGUgQ2xvdWQgUGxhdGZvcm0nLFxuICAgICAgICBzdmc6ICdnY3AnLFxuICAgICAgICBjb2xvcjogJyM0Mzg2RkEnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRldk9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0d1bHAnLFxuICAgICAgICBzdmc6ICdndWxwJyxcbiAgICAgICAgY29sb3I6ICcjREE0NjQ4JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdIZXJva3UnLFxuICAgICAgICBzdmc6ICdoZXJva3UnLFxuICAgICAgICBjb2xvcjogJyM2NzYyQTYnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRldk9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0hUTUwnLFxuICAgICAgICBzdmc6ICdodG1sJyxcbiAgICAgICAgY29sb3I6ICcjRUY2NTJBJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdKYXZhJyxcbiAgICAgICAgc3ZnOiAnamF2YScsXG4gICAgICAgIGNvbG9yOiAnIzAwNzY5OScsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2VydmVyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnSmF2YVNjcmlwdCcsXG4gICAgICAgIHN2ZzogJ2phdmFzY3JpcHQnLFxuICAgICAgICBjb2xvcjogJyNGMERCNEYnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LldlYiB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5Qcm9ncmFtbWluZyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ0plc3QnLFxuICAgICAgICBzdmc6ICdqZXN0JyxcbiAgICAgICAgY29sb3I6ICcjQzIxMzI1JyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdLdWJlcm5ldGVzJyxcbiAgICAgICAgc3ZnOiAna3ViZXJuZXRlcycsXG4gICAgICAgIGNvbG9yOiAnIzM1NkRFNicsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuRGV2T3BzLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnTWljcm9zb2Z0IEF6dXJlJyxcbiAgICAgICAgc3ZnOiAnYXp1cmUnLFxuICAgICAgICBjb2xvcjogJyMwMDg5RDYnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LkRldk9wcyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ05vZGUuanMnLFxuICAgICAgICBzdmc6ICdub2RlanMnLFxuICAgICAgICBjb2xvcjogJyM4Q0M4NEInLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlNlcnZlcixcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1Bvc3RncmVTUUwnLFxuICAgICAgICBzdmc6ICdwb3N0Z3Jlc3FsJyxcbiAgICAgICAgY29sb3I6ICcjMzI2NjkwJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5EYXRhYmFzZSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1B5dGhvbicsXG4gICAgICAgIHN2ZzogJ3B5dGhvbicsXG4gICAgICAgIGNvbG9yOiAnIzM3NzZBQicsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2NyaXB0aW5nIHwgU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlNlcnZlcixcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1JlYWN0JyxcbiAgICAgICAgc3ZnOiAncmVhY3QnLFxuICAgICAgICBjb2xvcjogJyMwMEQ4RkYnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LldlYiB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5GcmFtZXdvcmssXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdSIExhbmd1YWdlJyxcbiAgICAgICAgc3ZnOiAncmxhbmcnLFxuICAgICAgICBjb2xvcjogJyMyMzY5QkMnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnUnVzdCcsXG4gICAgICAgIHN2ZzogJ3J1c3QnLFxuICAgICAgICBjb2xvcjogJyMwMDAwMDAnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LlByb2dyYW1taW5nLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnU0FTUy9TQ1NTJyxcbiAgICAgICAgc3ZnOiAnc2FzcycsXG4gICAgICAgIGNvbG9yOiAnI0NENjY5QScsXG4gICAgICAgIGNhdGVnb3J5OiBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuV2ViLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnU3ByaW5nJyxcbiAgICAgICAgc3ZnOiAnc3ByaW5nJyxcbiAgICAgICAgY29sb3I6ICcjNkRCMzNGJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5GcmFtZXdvcmsgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuU2VydmVyLFxuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnU1FMJyxcbiAgICAgICAgc3ZnOiAnc3FsJyxcbiAgICAgICAgY29sb3I6ICcjRjg5NzAwJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5EYXRhYmFzZSxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgbmFtZTogJ1R5cGVTY3JpcHQnLFxuICAgICAgICBzdmc6ICd0eXBlc2NyaXB0JyxcbiAgICAgICAgY29sb3I6ICcjMDA3QUNDJyxcbiAgICAgICAgY2F0ZWdvcnk6IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5XZWIgfCBTa2lsbF8xLlNraWxsQ2F0ZWdvcnkuUHJvZ3JhbW1pbmcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIG5hbWU6ICdWdWUuanMnLFxuICAgICAgICBzdmc6ICd2dWUnLFxuICAgICAgICBjb2xvcjogJyM0RkMwOEQnLFxuICAgICAgICBjYXRlZ29yeTogU2tpbGxfMS5Ta2lsbENhdGVnb3J5LldlYiB8IFNraWxsXzEuU2tpbGxDYXRlZ29yeS5GcmFtZXdvcmssXG4gICAgfVxuXTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5Tb2NpYWwgPSB2b2lkIDA7XG5leHBvcnRzLlNvY2lhbCA9IFtcbiAgICB7XG4gICAgICAgIG5hbWU6ICdHaXRIdWInLFxuICAgICAgICBmYUNsYXNzOiAnZmFiIGZhLWdpdGh1YicsXG4gICAgICAgIGxpbms6ICdodHRwczovL2dpdGh1Yi5jb20vamFja3Nvbi1uZXN0ZWxyb2FkJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnTGlua2VkSW4nLFxuICAgICAgICBmYUNsYXNzOiAnZmFiIGZhLWxpbmtlZGluJyxcbiAgICAgICAgbGluazogJ2h0dHBzOi8vd3d3LmxpbmtlZGluLmNvbS9pbi9qYWNrc29uLW5lc3RlbHJvYWQvJ1xuICAgIH0sXG4gICAge1xuICAgICAgICBuYW1lOiAnRW1haWwnLFxuICAgICAgICBmYUNsYXNzOiAnZmFzIGZhLWVudmVsb3BlJyxcbiAgICAgICAgbGluazogJ21haWx0bzpqYWNrc29uQG5lc3RlbHJvYWQuY29tJ1xuICAgIH1cbl07XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRWxlbWVudEZhY3RvcnkgPSB2b2lkIDA7XG52YXIgRWxlbWVudEZhY3Rvcnk7XG4oZnVuY3Rpb24gKEVsZW1lbnRGYWN0b3J5KSB7XG4gICAgdmFyIEZyYWdtZW50ID0gJzw+PC8+JztcbiAgICBmdW5jdGlvbiBjcmVhdGVFbGVtZW50KHRhZ05hbWUsIGF0dHJpYnV0ZXMpIHtcbiAgICAgICAgdmFyIGNoaWxkcmVuID0gW107XG4gICAgICAgIGZvciAodmFyIF9pID0gMjsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICBjaGlsZHJlbltfaSAtIDJdID0gYXJndW1lbnRzW19pXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGFnTmFtZSA9PT0gRnJhZ21lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBkb2N1bWVudC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KHRhZ05hbWUpO1xuICAgICAgICBpZiAoYXR0cmlidXRlcykge1xuICAgICAgICAgICAgZm9yICh2YXIgX2EgPSAwLCBfYiA9IE9iamVjdC5rZXlzKGF0dHJpYnV0ZXMpOyBfYSA8IF9iLmxlbmd0aDsgX2ErKykge1xuICAgICAgICAgICAgICAgIHZhciBrZXkgPSBfYltfYV07XG4gICAgICAgICAgICAgICAgdmFyIGF0dHJpYnV0ZVZhbHVlID0gYXR0cmlidXRlc1trZXldO1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdjbGFzc05hbWUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdjbGFzcycsIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoa2V5ID09PSAnc3R5bGUnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBKU3RvQ1NTKGF0dHJpYnV0ZVZhbHVlKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZSgnc3R5bGUnLCBhdHRyaWJ1dGVWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoa2V5LnN0YXJ0c1dpdGgoJ29uJykgJiYgdHlwZW9mIGF0dHJpYnV0ZVZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihrZXkuc3Vic3RyaW5nKDIpLnRvTG93ZXJDYXNlKCksIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgYXR0cmlidXRlVmFsdWUgPT09ICdib29sZWFuJyAmJiBhdHRyaWJ1dGVWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCAnJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGF0dHJpYnV0ZVZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBfYyA9IDAsIGNoaWxkcmVuXzEgPSBjaGlsZHJlbjsgX2MgPCBjaGlsZHJlbl8xLmxlbmd0aDsgX2MrKykge1xuICAgICAgICAgICAgdmFyIGNoaWxkID0gY2hpbGRyZW5fMVtfY107XG4gICAgICAgICAgICBhcHBlbmRDaGlsZChlbGVtZW50LCBjaGlsZCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuICAgIEVsZW1lbnRGYWN0b3J5LmNyZWF0ZUVsZW1lbnQgPSBjcmVhdGVFbGVtZW50O1xuICAgIGZ1bmN0aW9uIGFwcGVuZENoaWxkKHBhcmVudCwgY2hpbGQpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ3VuZGVmaW5lZCcgfHwgY2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheShjaGlsZCkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIF9pID0gMCwgY2hpbGRfMSA9IGNoaWxkOyBfaSA8IGNoaWxkXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gY2hpbGRfMVtfaV07XG4gICAgICAgICAgICAgICAgYXBwZW5kQ2hpbGQocGFyZW50LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAodHlwZW9mIGNoaWxkID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcGFyZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNoaWxkKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoY2hpbGQgaW5zdGFuY2VvZiBOb2RlKSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjaGlsZCA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBwYXJlbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoU3RyaW5nKGNoaWxkKSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIEVsZW1lbnRGYWN0b3J5LmFwcGVuZENoaWxkID0gYXBwZW5kQ2hpbGQ7XG4gICAgZnVuY3Rpb24gSlN0b0NTUyhjc3NPYmplY3QpIHtcbiAgICAgICAgdmFyIGNzc1N0cmluZyA9IFwiXCI7XG4gICAgICAgIHZhciBydWxlO1xuICAgICAgICB2YXIgcnVsZXMgPSBPYmplY3Qua2V5cyhjc3NPYmplY3QpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJ1bGVzLmxlbmd0aDsgaSsrLCBjc3NTdHJpbmcgKz0gJyAnKSB7XG4gICAgICAgICAgICBydWxlID0gcnVsZXNbaV07XG4gICAgICAgICAgICBjc3NTdHJpbmcgKz0gcnVsZS5yZXBsYWNlKC8oW0EtWl0pL2csIGZ1bmN0aW9uICh1cHBlcikgeyByZXR1cm4gXCItXCIgKyB1cHBlclswXS50b0xvd2VyQ2FzZSgpOyB9KSArIFwiOiBcIiArIGNzc09iamVjdFtydWxlXSArIFwiO1wiO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjc3NTdHJpbmc7XG4gICAgfVxufSkoRWxlbWVudEZhY3RvcnkgPSBleHBvcnRzLkVsZW1lbnRGYWN0b3J5IHx8IChleHBvcnRzLkVsZW1lbnRGYWN0b3J5ID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgQWJvdXRfMSA9IHJlcXVpcmUoXCIuLi9EYXRhL0Fib3V0XCIpO1xudmFyIFF1YWxpdGllc18xID0gcmVxdWlyZShcIi4uL0RhdGEvUXVhbGl0aWVzXCIpO1xudmFyIFF1YWxpdHlfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1F1YWxpdHlcIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgV2ViUGFnZV8xLkZsYXZvclRleHQuaW5uZXJUZXh0ID0gQWJvdXRfMS5BYm91dE1lO1xufSk7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgdmFyIG9iamVjdDtcbiAgICBmb3IgKHZhciBfaSA9IDAsIFF1YWxpdGllc18yID0gUXVhbGl0aWVzXzEuUXVhbGl0aWVzOyBfaSA8IFF1YWxpdGllc18yLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgcXVhbGl0eSA9IFF1YWxpdGllc18yW19pXTtcbiAgICAgICAgb2JqZWN0ID0gbmV3IFF1YWxpdHlfMS5RdWFsaXR5KHF1YWxpdHkpO1xuICAgICAgICBvYmplY3QuYXBwZW5kVG8oV2ViUGFnZV8xLlF1YWxpdGllc0NvbnRhaW5lcik7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYlhYMD0iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xuV2ViUGFnZV8xLkJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpIHtcbn0sIHtcbiAgICBjYXB0dXJlOiB0cnVlLFxuICAgIHBhc3NpdmU6IHRydWVcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBTb2NpYWxfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1NvY2lhbFwiKTtcbnZhciBTb2NpYWxfMiA9IHJlcXVpcmUoXCIuLi9EYXRhL1NvY2lhbFwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICB2YXIgY2FyZDtcbiAgICBmb3IgKHZhciBfaSA9IDAsIERhdGFfMSA9IFNvY2lhbF8yLlNvY2lhbDsgX2kgPCBEYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBkYXRhID0gRGF0YV8xW19pXTtcbiAgICAgICAgY2FyZCA9IG5ldyBTb2NpYWxfMS5Tb2NpYWwoZGF0YSk7XG4gICAgICAgIGNhcmQuYXBwZW5kVG8oV2ViUGFnZV8xLlNvY2lhbEdyaWQpO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnI2Nvbm5lY3QgLmZvb3RlciAuY29weXJpZ2h0IC55ZWFyJykuaW5uZXJUZXh0ID0gbmV3IERhdGUoKS5nZXRGdWxsWWVhcigpLnRvU3RyaW5nKCk7XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgRWR1Y2F0aW9uXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9FZHVjYXRpb25cIik7XG52YXIgRWR1Y2F0aW9uXzIgPSByZXF1aXJlKFwiLi4vRGF0YS9FZHVjYXRpb25cIik7XG5ET01fMS5ET00ubG9hZCgpLnRoZW4oZnVuY3Rpb24gKGRvY3VtZW50KSB7XG4gICAgdmFyIEVkdWNhdGlvblNlY3Rpb24gPSBXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdlZHVjYXRpb24nKS5lbGVtZW50O1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gRWR1Y2F0aW9uXzIuRWR1Y2F0aW9uOyBfaSA8IERhdGFfMS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgdmFyIGRhdGEgPSBEYXRhXzFbX2ldO1xuICAgICAgICBjYXJkID0gbmV3IEVkdWNhdGlvbl8xLkVkdWNhdGlvbihkYXRhKTtcbiAgICAgICAgY2FyZC5hcHBlbmRUbyhFZHVjYXRpb25TZWN0aW9uKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIERPTV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvRE9NXCIpO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG52YXIgRXhwZXJpZW5jZV8xID0gcmVxdWlyZShcIi4uL0NsYXNzZXMvRWxlbWVudHMvRXhwZXJpZW5jZVwiKTtcbnZhciBFeHBlcmllbmNlXzIgPSByZXF1aXJlKFwiLi4vRGF0YS9FeHBlcmllbmNlXCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uIChkb2N1bWVudCkge1xuICAgIHZhciBFeHBlcmllbmNlU2VjdGlvbiA9IFdlYlBhZ2VfMS5TZWN0aW9ucy5nZXQoJ2V4cGVyaWVuY2UnKS5lbGVtZW50O1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gRXhwZXJpZW5jZV8yLkV4cGVyaWVuY2U7IF9pIDwgRGF0YV8xLmxlbmd0aDsgX2krKykge1xuICAgICAgICB2YXIgZGF0YSA9IERhdGFfMVtfaV07XG4gICAgICAgIGNhcmQgPSBuZXcgRXhwZXJpZW5jZV8xLkV4cGVyaWVuY2UoZGF0YSk7XG4gICAgICAgIGNhcmQuYXBwZW5kVG8oRXhwZXJpZW5jZVNlY3Rpb24pO1xuICAgIH1cbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbkRPTV8xLkRPTS5sb2FkKCkudGhlbihmdW5jdGlvbiAoZG9jdW1lbnQpIHtcbiAgICBpZiAoIURPTV8xLkRPTS5pc0lFKCkpIHtcbiAgICAgICAgV2ViUGFnZV8xLkxvZ28uT3V0ZXIuY2xhc3NMaXN0LnJlbW92ZSgncHJlbG9hZCcpO1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5Mb2dvLklubmVyLmNsYXNzTGlzdC5yZW1vdmUoJ3ByZWxvYWQnKTtcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIFdlYlBhZ2VfMS5Mb2dvLk91dGVyLmNsYXNzTmFtZSA9ICdvdXRlcic7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgV2ViUGFnZV8xLkxvZ28uSW5uZXIuY2xhc3NOYW1lID0gJ2lubmVyJztcbiAgICAgICAgfSwgNDAwKTtcbiAgICB9XG59KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFdlYlBhZ2VfMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL1dlYlBhZ2VcIik7XG5XZWJQYWdlXzEuTWVudUJ1dHRvbi5zdWJzY3JpYmUoV2ViUGFnZV8xLk1haW4sIGZ1bmN0aW9uIChldmVudCkge1xuICAgIGlmIChldmVudC5uYW1lID09PSAndG9nZ2xlJykge1xuICAgICAgICBpZiAoZXZlbnQuZGV0YWlsLm9wZW4pIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5NYWluLnNldEF0dHJpYnV0ZSgnc2hpZnRlZCcsICcnKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIFdlYlBhZ2VfMS5NYWluLnJlbW92ZUF0dHJpYnV0ZSgnc2hpZnRlZCcpO1xuICAgICAgICB9XG4gICAgfVxufSk7XG5XZWJQYWdlXzEuU2Nyb2xsSG9vay5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbiAoZXZlbnQpIHtcbiAgICB2YXIgX2E7XG4gICAgdmFyIHNlY3Rpb247XG4gICAgdmFyIGFuY2hvcjtcbiAgICB2YXIgaXRlciA9IFdlYlBhZ2VfMS5TZWN0aW9uVG9NZW51LnZhbHVlcygpO1xuICAgIHZhciBjdXJyZW50ID0gaXRlci5uZXh0KCk7XG4gICAgZm9yICh2YXIgZG9uZSA9IGZhbHNlOyAhZG9uZTsgY3VycmVudCA9IGl0ZXIubmV4dCgpLCBkb25lID0gY3VycmVudC5kb25lKSB7XG4gICAgICAgIF9hID0gY3VycmVudC52YWx1ZSwgc2VjdGlvbiA9IF9hWzBdLCBhbmNob3IgPSBfYVsxXTtcbiAgICAgICAgaWYgKHNlY3Rpb24uaW5WaWV3KCkpIHtcbiAgICAgICAgICAgIGFuY2hvci5zZXRBdHRyaWJ1dGUoJ3NlbGVjdGVkJywgJycpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYW5jaG9yLnJlbW92ZUF0dHJpYnV0ZSgnc2VsZWN0ZWQnKTtcbiAgICAgICAgfVxuICAgIH1cbn0sIHtcbiAgICBjYXB0dXJlOiB0cnVlLFxuICAgIHBhc3NpdmU6IHRydWVcbn0pO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgV2ViUGFnZV8xID0gcmVxdWlyZShcIi4uL01vZHVsZXMvV2ViUGFnZVwiKTtcbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uIChldmVudCkge1xuICAgIFdlYlBhZ2VfMS5NZW51QnV0dG9uLnVwZGF0ZUNvbnRyYXN0KCk7XG59LCB7XG4gICAgY2FwdHVyZTogdHJ1ZSxcbiAgICBwYXNzaXZlOiB0cnVlXG59KTtcbldlYlBhZ2VfMS5NZW51QnV0dG9uLkhhbWJ1cmdlci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBXZWJQYWdlXzEuTWVudUJ1dHRvbi50b2dnbGUoKTtcbn0pO1xudmFyIGl0ZXIgPSBXZWJQYWdlXzEuU2VjdGlvblRvTWVudS52YWx1ZXMoKTtcbnZhciBjdXJyZW50ID0gaXRlci5uZXh0KCk7XG52YXIgX2xvb3BfMSA9IGZ1bmN0aW9uIChkb25lKSB7XG4gICAgdmFyIF9hO1xuICAgIHZhciBzZWN0aW9uO1xuICAgIHZhciBhbmNob3IgPSB2b2lkIDA7XG4gICAgX2EgPSBjdXJyZW50LnZhbHVlLCBzZWN0aW9uID0gX2FbMF0sIGFuY2hvciA9IF9hWzFdO1xuICAgIGFuY2hvci5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICBzZWN0aW9uLmVsZW1lbnQuc2Nyb2xsSW50b1ZpZXcoe1xuICAgICAgICAgICAgYmVoYXZpb3I6ICdzbW9vdGgnXG4gICAgICAgIH0pO1xuICAgIH0pO1xufTtcbmZvciAodmFyIGRvbmUgPSBmYWxzZTsgIWRvbmU7IGN1cnJlbnQgPSBpdGVyLm5leHQoKSwgZG9uZSA9IGN1cnJlbnQuZG9uZSkge1xuICAgIF9sb29wXzEoZG9uZSk7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuLi9Nb2R1bGVzL0RPTVwiKTtcbnZhciBXZWJQYWdlXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9XZWJQYWdlXCIpO1xudmFyIFByb2plY3RfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL1Byb2plY3RcIik7XG52YXIgUHJvamVjdHNfMSA9IHJlcXVpcmUoXCIuLi9EYXRhL1Byb2plY3RzXCIpO1xuRE9NXzEuRE9NLmxvYWQoKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgUHJvamVjdHNDb250YWluZXIgPSBXZWJQYWdlXzEuU2VjdGlvbnMuZ2V0KCdwcm9qZWN0cycpLmVsZW1lbnQucXVlcnlTZWxlY3RvcignLnByb2plY3RzLWNvbnRhaW5lcicpO1xuICAgIHZhciBjYXJkO1xuICAgIGZvciAodmFyIF9pID0gMCwgRGF0YV8xID0gUHJvamVjdHNfMS5Qcm9qZWN0czsgX2kgPCBEYXRhXzEubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIHZhciBkYXRhID0gRGF0YV8xW19pXTtcbiAgICAgICAgY2FyZCA9IG5ldyBQcm9qZWN0XzEuUHJvamVjdChkYXRhKTtcbiAgICAgICAgY2FyZC5hcHBlbmRUbyhQcm9qZWN0c0NvbnRhaW5lcik7XG4gICAgfVxufSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuRE9NID0gdm9pZCAwO1xudmFyIERPTTtcbihmdW5jdGlvbiAoRE9NKSB7XG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudHMocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwocXVlcnkpO1xuICAgIH1cbiAgICBET00uZ2V0RWxlbWVudHMgPSBnZXRFbGVtZW50cztcbiAgICBmdW5jdGlvbiBnZXRGaXJzdEVsZW1lbnQocXVlcnkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0RWxlbWVudHMocXVlcnkpWzBdO1xuICAgIH1cbiAgICBET00uZ2V0Rmlyc3RFbGVtZW50ID0gZ2V0Rmlyc3RFbGVtZW50O1xuICAgIGZ1bmN0aW9uIGdldFZpZXdwb3J0KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgaGVpZ2h0OiBNYXRoLm1heCh3aW5kb3cuaW5uZXJIZWlnaHQsIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRIZWlnaHQpLFxuICAgICAgICAgICAgd2lkdGg6IE1hdGgubWF4KHdpbmRvdy5pbm5lcldpZHRoLCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY2xpZW50V2lkdGgpXG4gICAgICAgIH07XG4gICAgfVxuICAgIERPTS5nZXRWaWV3cG9ydCA9IGdldFZpZXdwb3J0O1xuICAgIGZ1bmN0aW9uIGdldENlbnRlck9mVmlld3BvcnQoKSB7XG4gICAgICAgIHZhciBfYSA9IGdldFZpZXdwb3J0KCksIGhlaWdodCA9IF9hLmhlaWdodCwgd2lkdGggPSBfYS53aWR0aDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHg6IHdpZHRoIC8gMixcbiAgICAgICAgICAgIHk6IGhlaWdodCAvIDJcbiAgICAgICAgfTtcbiAgICB9XG4gICAgRE9NLmdldENlbnRlck9mVmlld3BvcnQgPSBnZXRDZW50ZXJPZlZpZXdwb3J0O1xuICAgIGZ1bmN0aW9uIGlzSUUoKSB7XG4gICAgICAgIHJldHVybiB3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudC5tYXRjaCgvKE1TSUV8VHJpZGVudCkvKSAhPT0gbnVsbDtcbiAgICB9XG4gICAgRE9NLmlzSUUgPSBpc0lFO1xuICAgIGZ1bmN0aW9uIGxvYWQoKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoZG9jdW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrXzEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCBjYWxsYmFja18xKTtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShkb2N1bWVudCk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgY2FsbGJhY2tfMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBET00ubG9hZCA9IGxvYWQ7XG4gICAgZnVuY3Rpb24gYm91bmRpbmdDbGllbnRSZWN0VG9PYmplY3QocmVjdCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiByZWN0LnRvcCxcbiAgICAgICAgICAgIHJpZ2h0OiByZWN0LnJpZ2h0LFxuICAgICAgICAgICAgYm90dG9tOiByZWN0LmJvdHRvbSxcbiAgICAgICAgICAgIGxlZnQ6IHJlY3QubGVmdCxcbiAgICAgICAgICAgIHdpZHRoOiByZWN0LndpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiByZWN0LmhlaWdodCxcbiAgICAgICAgICAgIHg6IHJlY3QueCA/IHJlY3QueCA6IDAsXG4gICAgICAgICAgICB5OiByZWN0LnkgPyByZWN0LnkgOiAwXG4gICAgICAgIH07XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uUGFnZShlbGVtZW50KSB7XG4gICAgICAgIHZhciByZWN0ID0gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuICFPYmplY3QudmFsdWVzKGJvdW5kaW5nQ2xpZW50UmVjdFRvT2JqZWN0KHJlY3QpKS5ldmVyeShmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgPT09IDA7IH0pO1xuICAgIH1cbiAgICBET00ub25QYWdlID0gb25QYWdlO1xuICAgIGZ1bmN0aW9uIGdldERPTU5hbWUoZWxlbWVudCkge1xuICAgICAgICB2YXIgc3RyID0gZWxlbWVudC50YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgICAgIGlmIChlbGVtZW50LmlkKSB7XG4gICAgICAgICAgICBzdHIgKz0gJyMnICsgZWxlbWVudC5pZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZWxlbWVudC5jbGFzc05hbWUpIHtcbiAgICAgICAgICAgIHN0ciArPSAnLicgKyBlbGVtZW50LmNsYXNzTmFtZS5yZXBsYWNlKC8gL2csICcuJyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN0cjtcbiAgICB9XG4gICAgRE9NLmdldERPTU5hbWUgPSBnZXRET01OYW1lO1xuICAgIGZ1bmN0aW9uIGdldERPTVBhdGgoZWxlbWVudCkge1xuICAgICAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgcGF0aCA9IFtlbGVtZW50XTtcbiAgICAgICAgd2hpbGUgKGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGlmIChlbGVtZW50LnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2h0bWwnKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwYXRoLnVuc2hpZnQoZWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhdGg7XG4gICAgfVxuICAgIERPTS5nZXRET01QYXRoID0gZ2V0RE9NUGF0aDtcbiAgICBmdW5jdGlvbiBnZXRET01QYXRoTmFtZXMoZWxlbWVudCkge1xuICAgICAgICB2YXIgcGF0aCA9IGdldERPTVBhdGgoZWxlbWVudCk7XG4gICAgICAgIGlmIChwYXRoLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXRoLm1hcChmdW5jdGlvbiAoZWxlbWVudCkgeyByZXR1cm4gZ2V0RE9NTmFtZShlbGVtZW50KTsgfSk7XG4gICAgfVxuICAgIERPTS5nZXRET01QYXRoTmFtZXMgPSBnZXRET01QYXRoTmFtZXM7XG4gICAgZnVuY3Rpb24gZ2V0Q1NTU2VsZWN0b3IoZWxlbWVudCwgY29uZGVuc2UpIHtcbiAgICAgICAgaWYgKGNvbmRlbnNlID09PSB2b2lkIDApIHsgY29uZGVuc2UgPSB0cnVlOyB9XG4gICAgICAgIHZhciBuYW1lcyA9IGdldERPTVBhdGhOYW1lcyhlbGVtZW50KTtcbiAgICAgICAgaWYgKCFjb25kZW5zZSB8fCBuYW1lcy5sZW5ndGggPD0gNikge1xuICAgICAgICAgICAgcmV0dXJuIG5hbWVzLmpvaW4oJyA+ICcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBsZW5ndGggPSBuYW1lcy5sZW5ndGg7XG4gICAgICAgIHZhciBiZWdpbiA9IG5hbWVzLnNsaWNlKDAsIDMpO1xuICAgICAgICB2YXIgZW5kID0gbmFtZXMuc2xpY2UobGVuZ3RoIC0gMywgbGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIGJlZ2luLmpvaW4oJyA+ICcpICsgXCIgPiAuLi4gPiBcIiArIGVuZC5qb2luKCcgPiAnKTtcbiAgICB9XG4gICAgRE9NLmdldENTU1NlbGVjdG9yID0gZ2V0Q1NTU2VsZWN0b3I7XG4gICAgZnVuY3Rpb24gZ2V0Q2hpbGRPZmZzZXRQb3NGb3JDb250YWluZXIoY29udGFpbmVyLCBjaGlsZCwgY2FsbGVyKSB7XG4gICAgICAgIGlmIChjYWxsZXIgPT09IHZvaWQgMCkgeyBjYWxsZXIgPSAnJzsgfVxuICAgICAgICB2YXIgb2Zmc2V0VG9wID0gMDtcbiAgICAgICAgdmFyIG9mZnNldExlZnQgPSAwO1xuICAgICAgICB2YXIgY3VyciA9IGNoaWxkO1xuICAgICAgICB3aGlsZSAoY3VyciAmJiBjdXJyICE9PSBjb250YWluZXIpIHtcbiAgICAgICAgICAgIG9mZnNldFRvcCArPSBjdXJyLm9mZnNldFRvcDtcbiAgICAgICAgICAgIG9mZnNldExlZnQgKz0gY3Vyci5vZmZzZXRMZWZ0O1xuICAgICAgICAgICAgY3VyciA9IChjdXJyLm9mZnNldFBhcmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjdXJyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKGNhbGxlciA/IGNhbGxlciArIFwiID0+IFwiIDogJycpICsgXCJcXFwiXCIgKyBnZXRDU1NTZWxlY3RvcihjaGlsZCkgKyBcIlxcXCIgZG9lcyBub3QgY29udGFpbiBcXFwiXCIgKyBnZXRDU1NTZWxlY3Rvcihjb250YWluZXIpICsgXCJcXFwiIGFzIGFuIG9mZnNldCBwYXJlbnQuIENoZWNrIHRoYXQgdGhlIGNvbnRhaW5lciBoYXMgXFxcInBvc2l0aW9uOiByZWxhdGl2ZVxcXCIgc2V0IG9yIHRoYXQgaXQgaXMgaW4gdGhlIERPTSBwYXRoLlwiKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4geyBvZmZzZXRUb3A6IG9mZnNldFRvcCwgb2Zmc2V0TGVmdDogb2Zmc2V0TGVmdCB9O1xuICAgIH1cbiAgICBET00uZ2V0Q2hpbGRPZmZzZXRQb3NGb3JDb250YWluZXIgPSBnZXRDaGlsZE9mZnNldFBvc0ZvckNvbnRhaW5lcjtcbiAgICBmdW5jdGlvbiBsaW5lcyh0b3AxLCBzaXplMSwgdG9wMiwgc2l6ZTIsIG9mZnNldCkge1xuICAgICAgICByZXR1cm4gW1xuICAgICAgICAgICAgdG9wMSAtIG9mZnNldCxcbiAgICAgICAgICAgIHRvcDEgLSBvZmZzZXQgKyBzaXplMSxcbiAgICAgICAgICAgIHRvcDIsXG4gICAgICAgICAgICB0b3AyICsgc2l6ZTIsXG4gICAgICAgIF07XG4gICAgfVxuICAgIGZ1bmN0aW9uIHh5T2Zmc2V0KHhPZmZzZXQsIHlPZmZzZXQsIHdpZHRoLCBoZWlnaHQpIHtcbiAgICAgICAgaWYgKHhPZmZzZXQgJiYgeE9mZnNldCA8PSAxKSB7XG4gICAgICAgICAgICB4T2Zmc2V0ID0gd2lkdGggKiB4T2Zmc2V0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgeE9mZnNldCA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHlPZmZzZXQgJiYgeU9mZnNldCA8PSAxKSB7XG4gICAgICAgICAgICB5T2Zmc2V0ID0gaGVpZ2h0ICogeU9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHlPZmZzZXQgPSAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7IHhPZmZzZXQ6IHhPZmZzZXQsIHlPZmZzZXQ6IHlPZmZzZXQgfTtcbiAgICB9XG4gICAgZnVuY3Rpb24gaW5PZmZzZXRWaWV3KGNoaWxkLCBzZXR0aW5ncykge1xuICAgICAgICBpZiAoc2V0dGluZ3MgPT09IHZvaWQgMCkgeyBzZXR0aW5ncyA9IHt9OyB9XG4gICAgICAgIHZhciBjb250YWluZXI7XG4gICAgICAgIHZhciBvZmZzZXRUb3A7XG4gICAgICAgIHZhciBvZmZzZXRMZWZ0O1xuICAgICAgICBpZiAoIXNldHRpbmdzLmNvbnRhaW5lcikge1xuICAgICAgICAgICAgY29udGFpbmVyID0gY2hpbGQub2Zmc2V0UGFyZW50O1xuICAgICAgICAgICAgaWYgKCFjb250YWluZXIpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2luT2Zmc2V0VmlldyhjaGlsZCwgLi4uKSA9PiBjaGlsZC5vZmZzZXRQYXJlbnQgY2Fubm90IGJlIG51bGwuIENoZWNrIHRoYXQgaXQgaXMgaW4gYSBjb250YWluZXIgd2l0aCBcInBvc2l0aW9uOiByZWxhdGl2ZVwiIHNldC4nKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9mZnNldFRvcCA9IGNoaWxkLm9mZnNldFRvcDtcbiAgICAgICAgICAgIG9mZnNldExlZnQgPSBjaGlsZC5vZmZzZXRMZWZ0O1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGdldENoaWxkT2Zmc2V0UG9zRm9yQ29udGFpbmVyKHNldHRpbmdzLmNvbnRhaW5lciwgY2hpbGQsICdpbk9mZnNldFZpZXcoY2hpbGQsIC4uLiknKTtcbiAgICAgICAgICAgIG9mZnNldFRvcCA9IHJlc3VsdC5vZmZzZXRUb3A7XG4gICAgICAgICAgICBvZmZzZXRMZWZ0ID0gcmVzdWx0Lm9mZnNldExlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNoaWxkUmVjdCA9IGNoaWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoT2JqZWN0LnZhbHVlcyhib3VuZGluZ0NsaWVudFJlY3RUb09iamVjdChjaGlsZFJlY3QpKS5ldmVyeShmdW5jdGlvbiAodmFsKSB7IHJldHVybiB2YWwgPT09IDA7IH0pKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBfYSA9IHh5T2Zmc2V0KHNldHRpbmdzLnhPZmZzZXQsIHNldHRpbmdzLnlPZmZzZXQsIGNvbnRhaW5lclJlY3Qud2lkdGgsIGNvbnRhaW5lclJlY3QuaGVpZ2h0KSwgeE9mZnNldCA9IF9hLnhPZmZzZXQsIHlPZmZzZXQgPSBfYS55T2Zmc2V0O1xuICAgICAgICB2YXIgeCA9IHRydWU7XG4gICAgICAgIHZhciB5ID0gdHJ1ZTtcbiAgICAgICAgaWYgKCFzZXR0aW5ncy5pZ25vcmVZKSB7XG4gICAgICAgICAgICB2YXIgX2IgPSBsaW5lcyhjb250YWluZXIuc2Nyb2xsVG9wLCBjb250YWluZXJSZWN0LmhlaWdodCwgb2Zmc2V0VG9wLCBjaGlsZFJlY3QuaGVpZ2h0LCB5T2Zmc2V0KSwgY29udGFpbmVyVG9wTGluZSA9IF9iWzBdLCBjb250YWluZXJCb3R0b21MaW5lID0gX2JbMV0sIGNoaWxkVG9wTGluZSA9IF9iWzJdLCBjaGlsZEJvdHRvbUxpbmUgPSBfYlszXTtcbiAgICAgICAgICAgIHkgPSBzZXR0aW5ncy53aG9sZSA/XG4gICAgICAgICAgICAgICAgY2hpbGRCb3R0b21MaW5lIDwgY29udGFpbmVyQm90dG9tTGluZVxuICAgICAgICAgICAgICAgICAgICAmJiBjaGlsZFRvcExpbmUgPiBjb250YWluZXJUb3BMaW5lXG4gICAgICAgICAgICAgICAgOiBjaGlsZEJvdHRvbUxpbmUgPiBjb250YWluZXJUb3BMaW5lXG4gICAgICAgICAgICAgICAgICAgICYmIGNoaWxkVG9wTGluZSA8IGNvbnRhaW5lckJvdHRvbUxpbmU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXR0aW5ncy5pZ25vcmVYKSB7XG4gICAgICAgICAgICB2YXIgX2MgPSBsaW5lcyhjb250YWluZXIuc2Nyb2xsTGVmdCwgY29udGFpbmVyUmVjdC53aWR0aCwgb2Zmc2V0TGVmdCwgY2hpbGRSZWN0LndpZHRoLCB4T2Zmc2V0KSwgY29udGFpbmVyTGVmdExpbmUgPSBfY1swXSwgY29udGFpbmVyUmlnaHRMaW5lID0gX2NbMV0sIGNoaWxkTGVmdExpbmUgPSBfY1syXSwgY2hpbGRSaWdodExpbmUgPSBfY1szXTtcbiAgICAgICAgICAgIHggPSBzZXR0aW5ncy53aG9sZSA/XG4gICAgICAgICAgICAgICAgY2hpbGRSaWdodExpbmUgPCBjb250YWluZXJSaWdodExpbmVcbiAgICAgICAgICAgICAgICAgICAgJiYgY2hpbGRMZWZ0TGluZSA+IGNvbnRhaW5lckxlZnRMaW5lXG4gICAgICAgICAgICAgICAgOiBjaGlsZFJpZ2h0TGluZSA+IGNvbnRhaW5lckxlZnRMaW5lXG4gICAgICAgICAgICAgICAgICAgICYmIGNoaWxkTGVmdExpbmUgPCBjb250YWluZXJSaWdodExpbmU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHggJiYgeTtcbiAgICB9XG4gICAgRE9NLmluT2Zmc2V0VmlldyA9IGluT2Zmc2V0VmlldztcbiAgICBmdW5jdGlvbiBzY3JvbGxUbyhjb250YWluZXIsIGxlZnQsIHRvcCwgc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzID09PSB2b2lkIDApIHsgc2V0dGluZ3MgPSB7fTsgfVxuICAgICAgICBpZiAoaXNJRSgpKSB7XG4gICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsTGVmdCA9IGxlZnQ7XG4gICAgICAgICAgICBjb250YWluZXIuc2Nyb2xsVG9wID0gdG9wO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29udGFpbmVyLnNjcm9sbFRvKHtcbiAgICAgICAgICAgICAgICBsZWZ0OiBsZWZ0LFxuICAgICAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgICAgIGJlaGF2aW9yOiBzZXR0aW5ncy5zbW9vdGggPyAnc21vb3RoJyA6ICdhdXRvJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNjcm9sbENvbnRhaW5lclRvVmlld1dob2xlQ2hpbGQoY29udGFpbmVyLCBjaGlsZCwgc2V0dGluZ3MpIHtcbiAgICAgICAgaWYgKHNldHRpbmdzID09PSB2b2lkIDApIHsgc2V0dGluZ3MgPSB7fTsgfVxuICAgICAgICB2YXIgcmVzdWx0ID0gZ2V0Q2hpbGRPZmZzZXRQb3NGb3JDb250YWluZXIoY29udGFpbmVyLCBjaGlsZCwgJ3Njcm9sbENvbnRhaW5lclRvVmlld0NoaWxkV2hvbGUoLi4uKScpO1xuICAgICAgICB2YXIgb2Zmc2V0VG9wID0gcmVzdWx0Lm9mZnNldFRvcDtcbiAgICAgICAgdmFyIG9mZnNldExlZnQgPSByZXN1bHQub2Zmc2V0TGVmdDtcbiAgICAgICAgdmFyIGNvbnRhaW5lclJlY3QgPSBjb250YWluZXIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICAgIHZhciBjaGlsZFJlY3QgPSBjaGlsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgdmFyIF9hID0geHlPZmZzZXQoc2V0dGluZ3MueE9mZnNldCwgc2V0dGluZ3MueU9mZnNldCwgY29udGFpbmVyUmVjdC53aWR0aCwgY29udGFpbmVyUmVjdC5oZWlnaHQpLCB4T2Zmc2V0ID0gX2EueE9mZnNldCwgeU9mZnNldCA9IF9hLnlPZmZzZXQ7XG4gICAgICAgIHZhciBfYiA9IGxpbmVzKGNvbnRhaW5lci5zY3JvbGxUb3AsIGNvbnRhaW5lclJlY3QuaGVpZ2h0LCBvZmZzZXRUb3AsIGNoaWxkUmVjdC5oZWlnaHQsIHlPZmZzZXQpLCBjb250YWluZXJUb3BMaW5lID0gX2JbMF0sIGNvbnRhaW5lckJvdHRvbUxpbmUgPSBfYlsxXSwgY2hpbGRUb3BMaW5lID0gX2JbMl0sIGNoaWxkQm90dG9tTGluZSA9IF9iWzNdO1xuICAgICAgICB2YXIgX2MgPSBsaW5lcyhjb250YWluZXIuc2Nyb2xsTGVmdCwgY29udGFpbmVyUmVjdC53aWR0aCwgb2Zmc2V0TGVmdCwgY2hpbGRSZWN0LndpZHRoLCB4T2Zmc2V0KSwgY29udGFpbmVyTGVmdExpbmUgPSBfY1swXSwgY29udGFpbmVyUmlnaHRMaW5lID0gX2NbMV0sIGNoaWxkTGVmdExpbmUgPSBfY1syXSwgY2hpbGRSaWdodExpbmUgPSBfY1szXTtcbiAgICAgICAgdmFyIHggPSBjb250YWluZXIuc2Nyb2xsTGVmdDtcbiAgICAgICAgdmFyIHkgPSBjb250YWluZXIuc2Nyb2xsVG9wO1xuICAgICAgICBpZiAoIXNldHRpbmdzLmlnbm9yZVkpIHtcbiAgICAgICAgICAgIHZhciBhYm92ZSA9IGNoaWxkVG9wTGluZSA8IGNvbnRhaW5lclRvcExpbmU7XG4gICAgICAgICAgICB2YXIgYmVsb3cgPSBjaGlsZEJvdHRvbUxpbmUgPiBjb250YWluZXJCb3R0b21MaW5lO1xuICAgICAgICAgICAgaWYgKGFib3ZlICYmICFiZWxvdykge1xuICAgICAgICAgICAgICAgIHkgPSBjaGlsZFRvcExpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghYWJvdmUgJiYgYmVsb3cpIHtcbiAgICAgICAgICAgICAgICB5ICs9IGNoaWxkQm90dG9tTGluZSAtIGNvbnRhaW5lckJvdHRvbUxpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzZXR0aW5ncy5pZ25vcmVYKSB7XG4gICAgICAgICAgICB2YXIgbGVmdCA9IGNoaWxkTGVmdExpbmUgPCBjb250YWluZXJMZWZ0TGluZTtcbiAgICAgICAgICAgIHZhciByaWdodCA9IGNoaWxkUmlnaHRMaW5lID4gY29udGFpbmVyUmlnaHRMaW5lO1xuICAgICAgICAgICAgaWYgKGxlZnQgJiYgIXJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgeCA9IGNoaWxkTGVmdExpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICghbGVmdCAmJiByaWdodCkge1xuICAgICAgICAgICAgICAgIHggKz0gY2hpbGRSaWdodExpbmUgLSBjb250YWluZXJSaWdodExpbmU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgc2Nyb2xsVG8oY29udGFpbmVyLCB4LCB5LCBzZXR0aW5ncyk7XG4gICAgfVxuICAgIERPTS5zY3JvbGxDb250YWluZXJUb1ZpZXdXaG9sZUNoaWxkID0gc2Nyb2xsQ29udGFpbmVyVG9WaWV3V2hvbGVDaGlsZDtcbiAgICBmdW5jdGlvbiBpblZlcnRpY2FsV2luZG93VmlldyhlbGVtZW50LCBvZmZzZXQpIHtcbiAgICAgICAgaWYgKG9mZnNldCA9PT0gdm9pZCAwKSB7IG9mZnNldCA9IDA7IH1cbiAgICAgICAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICBpZiAoT2JqZWN0LnZhbHVlcyhib3VuZGluZ0NsaWVudFJlY3RUb09iamVjdChyZWN0KSkuZXZlcnkoZnVuY3Rpb24gKHZhbCkgeyByZXR1cm4gdmFsID09PSAwOyB9KSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciB2aWV3SGVpZ2h0ID0gZ2V0Vmlld3BvcnQoKS5oZWlnaHQ7XG4gICAgICAgIGlmIChvZmZzZXQgPD0gMSkge1xuICAgICAgICAgICAgb2Zmc2V0ID0gdmlld0hlaWdodCAqIG9mZnNldDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHJlY3QuYm90dG9tICsgb2Zmc2V0KSA+PSAwICYmIChyZWN0LnRvcCArIG9mZnNldCAtIHZpZXdIZWlnaHQpIDwgMDtcbiAgICB9XG4gICAgRE9NLmluVmVydGljYWxXaW5kb3dWaWV3ID0gaW5WZXJ0aWNhbFdpbmRvd1ZpZXc7XG4gICAgZnVuY3Rpb24gcGl4ZWxzQmVsb3dTY3JlZW5Ub3AoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKS50b3A7XG4gICAgfVxuICAgIERPTS5waXhlbHNCZWxvd1NjcmVlblRvcCA9IHBpeGVsc0JlbG93U2NyZWVuVG9wO1xuICAgIGZ1bmN0aW9uIHBpeGVsc0Fib3ZlU2NyZWVuQm90dG9tKGVsZW1lbnQpIHtcbiAgICAgICAgdmFyIHJlY3QgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICB2YXIgdmlld0hlaWdodCA9IGdldFZpZXdwb3J0KCkuaGVpZ2h0O1xuICAgICAgICByZXR1cm4gdmlld0hlaWdodCAtIHJlY3QuYm90dG9tO1xuICAgIH1cbiAgICBET00ucGl4ZWxzQWJvdmVTY3JlZW5Cb3R0b20gPSBwaXhlbHNBYm92ZVNjcmVlbkJvdHRvbTtcbiAgICBmdW5jdGlvbiBvbkZpcnN0QXBwZWFyYW5jZShlbGVtZW50LCBjYWxsYmFjaywgc2V0dGluZykge1xuICAgICAgICB2YXIgdGltZW91dCA9IHNldHRpbmcgPyBzZXR0aW5nLnRpbWVvdXQgOiAwO1xuICAgICAgICB2YXIgb2Zmc2V0ID0gc2V0dGluZyA/IHNldHRpbmcub2Zmc2V0IDogMDtcbiAgICAgICAgaWYgKGluVmVydGljYWxXaW5kb3dWaWV3KGVsZW1lbnQsIG9mZnNldCkpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdmFyIGV2ZW50Q2FsbGJhY2tfMSA9IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgIGlmIChpblZlcnRpY2FsV2luZG93VmlldyhlbGVtZW50LCBvZmZzZXQpKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoY2FsbGJhY2ssIHRpbWVvdXQpO1xuICAgICAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBldmVudENhbGxiYWNrXzEsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhcHR1cmU6IHRydWVcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGV2ZW50Q2FsbGJhY2tfMSwge1xuICAgICAgICAgICAgICAgIGNhcHR1cmU6IHRydWUsXG4gICAgICAgICAgICAgICAgcGFzc2l2ZTogdHJ1ZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgRE9NLm9uRmlyc3RBcHBlYXJhbmNlID0gb25GaXJzdEFwcGVhcmFuY2U7XG4gICAgZnVuY3Rpb24gZ2V0UGF0aFRvUm9vdChlbGVtZW50KSB7XG4gICAgICAgIHZhciBwYXRoID0gW107XG4gICAgICAgIHZhciBjdXJyID0gZWxlbWVudDtcbiAgICAgICAgd2hpbGUgKGN1cnIpIHtcbiAgICAgICAgICAgIHBhdGgucHVzaChjdXJyKTtcbiAgICAgICAgICAgIGN1cnIgPSBjdXJyLnBhcmVudEVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBhdGguaW5kZXhPZih3aW5kb3cpID09PSAtMSAmJiBwYXRoLmluZGV4T2YoZG9jdW1lbnQpID09PSAtMSkge1xuICAgICAgICAgICAgcGF0aC5wdXNoKGRvY3VtZW50KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGF0aC5pbmRleE9mKHdpbmRvdykgPT09IC0xKSB7XG4gICAgICAgICAgICBwYXRoLnB1c2god2luZG93KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcGF0aDtcbiAgICB9XG4gICAgRE9NLmdldFBhdGhUb1Jvb3QgPSBnZXRQYXRoVG9Sb290O1xufSkoRE9NID0gZXhwb3J0cy5ET00gfHwgKGV4cG9ydHMuRE9NID0ge30pKTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuZXhwb3J0cy5FdmVudHMgPSB2b2lkIDA7XG52YXIgRXZlbnRzO1xuKGZ1bmN0aW9uIChFdmVudHMpIHtcbiAgICB2YXIgTmV3RXZlbnQgPSAoZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBOZXdFdmVudChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgICAgICAgICAgdGhpcy5kZXRhaWwgPSBkZXRhaWw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE5ld0V2ZW50O1xuICAgIH0oKSk7XG4gICAgRXZlbnRzLk5ld0V2ZW50ID0gTmV3RXZlbnQ7XG4gICAgdmFyIEV2ZW50RGlzcGF0Y2hlciA9IChmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEV2ZW50RGlzcGF0Y2hlcigpIHtcbiAgICAgICAgICAgIHRoaXMuZXZlbnRzID0gbmV3IFNldCgpO1xuICAgICAgICAgICAgdGhpcy5saXN0ZW5lcnMgPSBuZXcgTWFwKCk7XG4gICAgICAgIH1cbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5hZGQobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUudW5yZWdpc3RlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgICAgICAgICB0aGlzLmV2ZW50cy5kZWxldGUobmFtZSk7XG4gICAgICAgIH07XG4gICAgICAgIEV2ZW50RGlzcGF0Y2hlci5wcm90b3R5cGUuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNhbGxiYWNrKSB7XG4gICAgICAgICAgICB0aGlzLmxpc3RlbmVycy5zZXQoZWxlbWVudCwgY2FsbGJhY2spO1xuICAgICAgICB9O1xuICAgICAgICBFdmVudERpc3BhdGNoZXIucHJvdG90eXBlLnVuc3Vic2NyaWJlID0gZnVuY3Rpb24gKGVsZW1lbnQpIHtcbiAgICAgICAgICAgIHRoaXMubGlzdGVuZXJzLmRlbGV0ZShlbGVtZW50KTtcbiAgICAgICAgfTtcbiAgICAgICAgRXZlbnREaXNwYXRjaGVyLnByb3RvdHlwZS5kaXNwYXRjaCA9IGZ1bmN0aW9uIChuYW1lLCBkZXRhaWwpIHtcbiAgICAgICAgICAgIGlmIChkZXRhaWwgPT09IHZvaWQgMCkgeyBkZXRhaWwgPSBudWxsOyB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuZXZlbnRzLmhhcyhuYW1lKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBldmVudCA9IG5ldyBOZXdFdmVudChuYW1lLCBkZXRhaWwpO1xuICAgICAgICAgICAgdmFyIGl0ID0gdGhpcy5saXN0ZW5lcnMudmFsdWVzKCk7XG4gICAgICAgICAgICB2YXIgY2FsbGJhY2s7XG4gICAgICAgICAgICB3aGlsZSAoY2FsbGJhY2sgPSBpdC5uZXh0KCkudmFsdWUpIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhldmVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RGlzcGF0Y2hlcjtcbiAgICB9KCkpO1xuICAgIEV2ZW50cy5FdmVudERpc3BhdGNoZXIgPSBFdmVudERpc3BhdGNoZXI7XG59KShFdmVudHMgPSBleHBvcnRzLkV2ZW50cyB8fCAoZXhwb3J0cy5FdmVudHMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNWRyA9IHZvaWQgMDtcbnZhciBTVkc7XG4oZnVuY3Rpb24gKFNWRykge1xuICAgIFNWRy5zdmducyA9ICdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc7XG4gICAgU1ZHLnhsaW5rbnMgPSAnaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayc7XG4gICAgU1ZHLmxvYWRTVkcgPSBmdW5jdGlvbiAodXJsKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgcmVxdWVzdC5vcGVuKCdHRVQnLCB1cmwgKyBcIi5zdmdcIiwgdHJ1ZSk7XG4gICAgICAgICAgICByZXF1ZXN0Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcGFyc2VyID0gbmV3IERPTVBhcnNlcigpO1xuICAgICAgICAgICAgICAgIHZhciBwYXJzZWREb2N1bWVudCA9IHBhcnNlci5wYXJzZUZyb21TdHJpbmcocmVxdWVzdC5yZXNwb25zZVRleHQsICdpbWFnZS9zdmcreG1sJyk7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZShwYXJzZWREb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdzdmcnKSk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5vbmVycm9yID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJlamVjdChcIkZhaWxlZCB0byByZWFkIFNWRy5cIik7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcmVxdWVzdC5zZW5kKCk7XG4gICAgICAgIH0pO1xuICAgIH07XG59KShTVkcgPSBleHBvcnRzLlNWRyB8fCAoZXhwb3J0cy5TVkcgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLlNvY2lhbEdyaWQgPSBleHBvcnRzLlNraWxsc0dyaWQgPSBleHBvcnRzLlF1YWxpdGllc0NvbnRhaW5lciA9IGV4cG9ydHMuRmxhdm9yVGV4dCA9IGV4cG9ydHMuQmFja2dyb3VuZCA9IGV4cG9ydHMuU2VjdGlvblRvTWVudSA9IGV4cG9ydHMuU2VjdGlvbnMgPSBleHBvcnRzLlNraWxsc0ZpbHRlck9iamVjdCA9IGV4cG9ydHMuTWVudUJ1dHRvbiA9IGV4cG9ydHMuTG9nbyA9IGV4cG9ydHMuU2Nyb2xsSG9vayA9IGV4cG9ydHMuTWFpblNjcm9sbCA9IGV4cG9ydHMuTWFpbiA9IGV4cG9ydHMuQm9keSA9IHZvaWQgMDtcbnZhciBET01fMSA9IHJlcXVpcmUoXCIuL0RPTVwiKTtcbnZhciBTZWN0aW9uXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9TZWN0aW9uXCIpO1xudmFyIE1lbnVfMSA9IHJlcXVpcmUoXCIuLi9DbGFzc2VzL0VsZW1lbnRzL01lbnVcIik7XG52YXIgU2tpbGxzRmlsdGVyXzEgPSByZXF1aXJlKFwiLi4vQ2xhc3Nlcy9FbGVtZW50cy9Ta2lsbHNGaWx0ZXJcIik7XG5leHBvcnRzLkJvZHkgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdib2R5Jyk7XG5leHBvcnRzLk1haW4gPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdtYWluJyk7XG5leHBvcnRzLk1haW5TY3JvbGwgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdtYWluIC5zY3JvbGwnKTtcbmV4cG9ydHMuU2Nyb2xsSG9vayA9IERPTV8xLkRPTS5pc0lFKCkgPyB3aW5kb3cgOiBleHBvcnRzLk1haW5TY3JvbGw7XG5leHBvcnRzLkxvZ28gPSB7XG4gICAgT3V0ZXI6IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2hlYWRlci5sb2dvIC5pbWFnZSBpbWcub3V0ZXInKSxcbiAgICBJbm5lcjogRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnaGVhZGVyLmxvZ28gLmltYWdlIGltZy5pbm5lcicpXG59O1xuZXhwb3J0cy5NZW51QnV0dG9uID0gbmV3IE1lbnVfMS5NZW51KCk7XG5leHBvcnRzLlNraWxsc0ZpbHRlck9iamVjdCA9IG5ldyBTa2lsbHNGaWx0ZXJfMS5Ta2lsbHNGaWx0ZXIoKTtcbmV4cG9ydHMuU2VjdGlvbnMgPSBuZXcgTWFwKCk7XG5mb3IgKHZhciBfaSA9IDAsIF9hID0gQXJyYXkuZnJvbShET01fMS5ET00uZ2V0RWxlbWVudHMoJ3NlY3Rpb24nKSk7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBfYVtfaV07XG4gICAgZXhwb3J0cy5TZWN0aW9ucy5zZXQoZWxlbWVudC5pZCwgbmV3IFNlY3Rpb25fMS5kZWZhdWx0KGVsZW1lbnQpKTtcbn1cbmV4cG9ydHMuU2VjdGlvblRvTWVudSA9IG5ldyBNYXAoKTtcbmZvciAodmFyIF9iID0gMCwgX2MgPSBBcnJheS5mcm9tKERPTV8xLkRPTS5nZXRFbGVtZW50cygnaGVhZGVyLm5hdmlnYXRpb24gLnNlY3Rpb25zIGEnKSk7IF9iIDwgX2MubGVuZ3RoOyBfYisrKSB7XG4gICAgdmFyIGFuY2hvciA9IF9jW19iXTtcbiAgICB2YXIgaWQgPSBhbmNob3IuZ2V0QXR0cmlidXRlKCdocmVmJykuc3Vic3RyKDEpO1xuICAgIGlmIChleHBvcnRzLlNlY3Rpb25zLmdldChpZCkgJiYgZXhwb3J0cy5TZWN0aW9ucy5nZXQoaWQpLmluTWVudSgpKSB7XG4gICAgICAgIGV4cG9ydHMuU2VjdGlvblRvTWVudS5zZXQoaWQsIFtleHBvcnRzLlNlY3Rpb25zLmdldChpZCksIGFuY2hvcl0pO1xuICAgIH1cbn1cbmV4cG9ydHMuQmFja2dyb3VuZCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ2JnJyk7XG5leHBvcnRzLkZsYXZvclRleHQgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI2Fib3V0IC5mbGF2b3InKTtcbmV4cG9ydHMuUXVhbGl0aWVzQ29udGFpbmVyID0gRE9NXzEuRE9NLmdldEZpcnN0RWxlbWVudCgnc2VjdGlvbiNhYm91dCAucXVhbGl0aWVzJyk7XG5leHBvcnRzLlNraWxsc0dyaWQgPSBET01fMS5ET00uZ2V0Rmlyc3RFbGVtZW50KCdzZWN0aW9uI3NraWxscyAuaGV4LWdyaWQnKTtcbmV4cG9ydHMuU29jaWFsR3JpZCA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoJ3NlY3Rpb24jY29ubmVjdCAuc29jaWFsLWljb25zJyk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb24gPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIEFuaW1hdGlvbihzcGVlZCwgbWF4LCBtaW4sIGluY3JlYXNpbmcpIHtcbiAgICAgICAgaWYgKGluY3JlYXNpbmcgPT09IHZvaWQgMCkgeyBpbmNyZWFzaW5nID0gZmFsc2U7IH1cbiAgICAgICAgdGhpcy5zcGVlZCA9IHNwZWVkO1xuICAgICAgICB0aGlzLm1heCA9IG1heDtcbiAgICAgICAgdGhpcy5taW4gPSBtaW47XG4gICAgICAgIHRoaXMuaW5jcmVhc2luZyA9IGluY3JlYXNpbmc7XG4gICAgfVxuICAgIHJldHVybiBBbmltYXRpb247XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gQW5pbWF0aW9uO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG5leHBvcnRzLkFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zID0gdm9pZCAwO1xudmFyIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zO1xuKGZ1bmN0aW9uIChBbmltYXRpb25GcmFtZUZ1bmN0aW9ucykge1xuICAgIGZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIHdpbmRvdy53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICAgICAgICAgIHJldHVybiB3aW5kb3cuc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbiAgICAgICAgICAgIH07XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLnJlcXVlc3RBbmltYXRpb25GcmFtZSA9IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcbiAgICBmdW5jdGlvbiBjYW5jZWxBbmltYXRpb25GcmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHdpbmRvdy5jYW5jZWxBbmltYXRpb25GcmFtZSB8fFxuICAgICAgICAgICAgd2luZG93LndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lIHx8XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQ7XG4gICAgfVxuICAgIEFuaW1hdGlvbkZyYW1lRnVuY3Rpb25zLmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gY2FuY2VsQW5pbWF0aW9uRnJhbWU7XG59KShBbmltYXRpb25GcmFtZUZ1bmN0aW9ucyA9IGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgfHwgKGV4cG9ydHMuQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnMgPSB7fSkpO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29sb3IgPSAoZnVuY3Rpb24gKCkge1xuICAgIGZ1bmN0aW9uIENvbG9yKHIsIGcsIGIpIHtcbiAgICAgICAgdGhpcy5yID0gcjtcbiAgICAgICAgdGhpcy5nID0gZztcbiAgICAgICAgdGhpcy5iID0gYjtcbiAgICB9XG4gICAgQ29sb3IuZnJvbVJHQiA9IGZ1bmN0aW9uIChyLCBnLCBiKSB7XG4gICAgICAgIGlmIChyID49IDAgJiYgciA8IDI1NiAmJiBnID49IDAgJiYgZyA8IDI1NiAmJiBiID49IDAgJiYgYiA8IDI1Nikge1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBDb2xvcihyLCBnLCBiKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBDb2xvci5mcm9tT2JqZWN0ID0gZnVuY3Rpb24gKG9iaikge1xuICAgICAgICByZXR1cm4gQ29sb3IuZnJvbVJHQihvYmouciwgb2JqLmcsIG9iai5iKTtcbiAgICB9O1xuICAgIENvbG9yLmZyb21IZXggPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHJldHVybiBDb2xvci5mcm9tT2JqZWN0KENvbG9yLmhleFRvUkdCKGhleCkpO1xuICAgIH07XG4gICAgQ29sb3IuaGV4VG9SR0IgPSBmdW5jdGlvbiAoaGV4KSB7XG4gICAgICAgIHZhciByZXN1bHQgPSAvXiMoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICAgICAgICByZXR1cm4gcmVzdWx0ID8ge1xuICAgICAgICAgICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgICAgICAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICAgICAgICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gICAgICAgIH0gOiBudWxsO1xuICAgIH07XG4gICAgQ29sb3IucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKG9wYWNpdHkgPT09IHZvaWQgMCkgeyBvcGFjaXR5ID0gMTsgfVxuICAgICAgICByZXR1cm4gXCJyZ2JhKFwiICsgdGhpcy5yICsgXCIsXCIgKyB0aGlzLmcgKyBcIixcIiArIHRoaXMuYiArIFwiLFwiICsgb3BhY2l0eSArIFwiKVwiO1xuICAgIH07XG4gICAgcmV0dXJuIENvbG9yO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvbG9yO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgQ29vcmRpbmF0ZSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gQ29vcmRpbmF0ZSh4LCB5KSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuICAgIENvb3JkaW5hdGUucHJvdG90eXBlLmRpc3RhbmNlID0gZnVuY3Rpb24gKGNvb3JkKSB7XG4gICAgICAgIHZhciBkeCA9IGNvb3JkLnggLSB0aGlzLng7XG4gICAgICAgIHZhciBkeSA9IGNvb3JkLnkgLSB0aGlzLnk7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuICAgIH07XG4gICAgQ29vcmRpbmF0ZS5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKyBcInhcIiArIHRoaXMueTtcbiAgICB9O1xuICAgIHJldHVybiBDb29yZGluYXRlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IENvb3JkaW5hdGU7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIEFuaW1hdGlvbl8xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uXCIpO1xudmFyIENvbG9yXzEgPSByZXF1aXJlKFwiLi9Db2xvclwiKTtcbnZhciBDb29yZGluYXRlXzEgPSByZXF1aXJlKFwiLi9Db29yZGluYXRlXCIpO1xudmFyIFN0cm9rZV8xID0gcmVxdWlyZShcIi4vU3Ryb2tlXCIpO1xudmFyIFZlY3Rvcl8xID0gcmVxdWlyZShcIi4vVmVjdG9yXCIpO1xudmFyIFBhcnRpY2xlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZShzZXR0aW5ncykge1xuICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSBudWxsO1xuICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IG51bGw7XG4gICAgICAgIHRoaXMuY29sb3IgPSB0aGlzLmNyZWF0ZUNvbG9yKHNldHRpbmdzLmNvbG9yKTtcbiAgICAgICAgdGhpcy5vcGFjaXR5ID0gdGhpcy5jcmVhdGVPcGFjaXR5KHNldHRpbmdzLm9wYWNpdHkpO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gdGhpcy5jcmVhdGVWZWxvY2l0eShzZXR0aW5ncy5tb3ZlKTtcbiAgICAgICAgdGhpcy5zaGFwZSA9IHRoaXMuY3JlYXRlU2hhcGUoc2V0dGluZ3Muc2hhcGUpO1xuICAgICAgICB0aGlzLnN0cm9rZSA9IHRoaXMuY3JlYXRlU3Ryb2tlKHNldHRpbmdzLnN0cm9rZSk7XG4gICAgICAgIHRoaXMucmFkaXVzID0gdGhpcy5jcmVhdGVSYWRpdXMoc2V0dGluZ3MucmFkaXVzKTtcbiAgICAgICAgaWYgKHNldHRpbmdzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgIGlmIChzZXR0aW5ncy5hbmltYXRlLm9wYWNpdHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wYWNpdHlBbmltYXRpb24gPSB0aGlzLmFuaW1hdGVPcGFjaXR5KHNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoc2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJhZGl1c0FuaW1hdGlvbiA9IHRoaXMuYW5pbWF0ZVJhZGl1cyhzZXR0aW5ncy5hbmltYXRlLnJhZGl1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5idWJibGVkID0ge1xuICAgICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICAgIHJhZGl1czogMFxuICAgICAgICB9O1xuICAgIH1cbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlQ29sb3IgPSBmdW5jdGlvbiAoY29sb3IpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciA9PT0gJ3JhbmRvbScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21SR0IoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSwgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogMjU2KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21IZXgoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBjb2xvciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChjb2xvciBpbnN0YW5jZW9mIENvbG9yXzEuZGVmYXVsdCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBjb2xvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGNvbG9yIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVDb2xvcihjb2xvcltNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBjb2xvci5sZW5ndGgpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gQ29sb3JfMS5kZWZhdWx0LmZyb21PYmplY3QoY29sb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBDb2xvcl8xLmRlZmF1bHQuZnJvbVJHQigwLCAwLCAwKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVPcGFjaXR5ID0gZnVuY3Rpb24gKG9wYWNpdHkpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZU9wYWNpdHkob3BhY2l0eVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBvcGFjaXR5Lmxlbmd0aCldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2Ygb3BhY2l0eSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIGlmIChvcGFjaXR5ID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBvcGFjaXR5ID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgaWYgKG9wYWNpdHkgPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBvcGFjaXR5O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAxO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmNyZWF0ZVZlbG9jaXR5ID0gZnVuY3Rpb24gKG1vdmUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBtb3ZlID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGlmICghbW92ZSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLCAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICh0eXBlb2YgbW92ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHZhciB2ZWxvY2l0eSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHN3aXRjaCAobW92ZS5kaXJlY3Rpb24pIHtcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AnOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIC0xKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAndG9wLXJpZ2h0JzpcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkgPSBuZXcgVmVjdG9yXzEuZGVmYXVsdCgwLjcsIC0wLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMSwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgJ2JvdHRvbS1yaWdodCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMC43LCAwLjcpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20nOlxuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eSA9IG5ldyBWZWN0b3JfMS5kZWZhdWx0KDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdib3R0b20tbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgMC43KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTEsIDApO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICd0b3AtbGVmdCc6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoLTAuNywgLTAuNyk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHZlbG9jaXR5ID0gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKG1vdmUuc3RyYWlnaHQpIHtcbiAgICAgICAgICAgICAgICBpZiAobW92ZS5yYW5kb20pIHtcbiAgICAgICAgICAgICAgICAgICAgdmVsb2NpdHkueCAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgICAgICAgICB2ZWxvY2l0eS55ICo9IE1hdGgucmFuZG9tKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmVsb2NpdHkueCArPSBNYXRoLnJhbmRvbSgpIC0gMC41O1xuICAgICAgICAgICAgICAgIHZlbG9jaXR5LnkgKz0gTWF0aC5yYW5kb20oKSAtIDAuNTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB2ZWxvY2l0eTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcl8xLmRlZmF1bHQoMCwgMCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuY3JlYXRlU2hhcGUgPSBmdW5jdGlvbiAoc2hhcGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2hhcGVbTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogc2hhcGUubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHZhciBzaWRlcyA9IHBhcnNlSW50KHNoYXBlLnN1YnN0cmluZygwLCBzaGFwZS5pbmRleE9mKCctJykpKTtcbiAgICAgICAgICAgIGlmICghaXNOYU4oc2lkZXMpKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlU2hhcGUoc2lkZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiBzaGFwZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGlmIChzaGFwZSA+PSAzKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNoYXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiAnY2lyY2xlJztcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVTdHJva2UgPSBmdW5jdGlvbiAoc3Ryb2tlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygc3Ryb2tlID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBzdHJva2Uud2lkdGggPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAgICAgaWYgKHN0cm9rZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KHN0cm9rZS53aWR0aCwgdGhpcy5jcmVhdGVDb2xvcihzdHJva2UuY29sb3IpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBTdHJva2VfMS5kZWZhdWx0KDAsIENvbG9yXzEuZGVmYXVsdC5mcm9tUkdCKDAsIDAsIDApKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5jcmVhdGVSYWRpdXMgPSBmdW5jdGlvbiAocmFkaXVzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgcmFkaXVzID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgaWYgKHJhZGl1cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlUmFkaXVzKHJhZGl1c1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiByYWRpdXMubGVuZ3RoKV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID09PSAncmFuZG9tJykge1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHR5cGVvZiByYWRpdXMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBpZiAocmFkaXVzID49IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gcmFkaXVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiA1O1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLnBhcnNlU3BlZWQgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgaWYgKHNwZWVkID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHNwZWVkO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAwLjU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZU9wYWNpdHkgPSBmdW5jdGlvbiAoYW5pbWF0aW9uKSB7XG4gICAgICAgIGlmIChhbmltYXRpb24pIHtcbiAgICAgICAgICAgIHZhciBtYXggPSB0aGlzLm9wYWNpdHk7XG4gICAgICAgICAgICB2YXIgbWluID0gdGhpcy5jcmVhdGVPcGFjaXR5KGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuYW5pbWF0ZVJhZGl1cyA9IGZ1bmN0aW9uIChhbmltYXRpb24pIHtcbiAgICAgICAgaWYgKGFuaW1hdGlvbikge1xuICAgICAgICAgICAgdmFyIG1heCA9IHRoaXMucmFkaXVzO1xuICAgICAgICAgICAgdmFyIG1pbiA9IHRoaXMuY3JlYXRlUmFkaXVzKGFuaW1hdGlvbi5taW4pO1xuICAgICAgICAgICAgdmFyIHNwZWVkID0gdGhpcy5wYXJzZVNwZWVkKGFuaW1hdGlvbi5zcGVlZCkgLyAxMDA7XG4gICAgICAgICAgICBpZiAoIWFuaW1hdGlvbi5zeW5jKSB7XG4gICAgICAgICAgICAgICAgc3BlZWQgKj0gTWF0aC5yYW5kb20oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMub3BhY2l0eSAqPSBNYXRoLnJhbmRvbSgpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBBbmltYXRpb25fMS5kZWZhdWx0KHNwZWVkLCBtYXgsIG1pbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuc2V0UG9zaXRpb24gPSBmdW5jdGlvbiAocG9zaXRpb24pIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IHBvc2l0aW9uO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLm1vdmUgPSBmdW5jdGlvbiAoc3BlZWQpIHtcbiAgICAgICAgdGhpcy5wb3NpdGlvbi54ICs9IHRoaXMudmVsb2NpdHkueCAqIHNwZWVkO1xuICAgICAgICB0aGlzLnBvc2l0aW9uLnkgKz0gdGhpcy52ZWxvY2l0eS55ICogc3BlZWQ7XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuZ2V0UmFkaXVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5yYWRpdXMgKyB0aGlzLmJ1YmJsZWQucmFkaXVzO1xuICAgIH07XG4gICAgUGFydGljbGUucHJvdG90eXBlLmdldE9wYWNpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wYWNpdHkgKyB0aGlzLmJ1YmJsZWQub3BhY2l0eTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5lZGdlID0gZnVuY3Rpb24gKGRpcikge1xuICAgICAgICBzd2l0Y2ggKGRpcikge1xuICAgICAgICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55IC0gdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCh0aGlzLnBvc2l0aW9uLnggKyB0aGlzLmdldFJhZGl1cygpLCB0aGlzLnBvc2l0aW9uLnkpO1xuICAgICAgICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCwgdGhpcy5wb3NpdGlvbi55ICsgdGhpcy5nZXRSYWRpdXMoKSk7XG4gICAgICAgICAgICBjYXNlICdsZWZ0JzpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMucG9zaXRpb24ueCAtIHRoaXMuZ2V0UmFkaXVzKCksIHRoaXMucG9zaXRpb24ueSk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZS5wcm90b3R5cGUuaW50ZXJzZWN0aW5nID0gZnVuY3Rpb24gKHBhcnRpY2xlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvc2l0aW9uLmRpc3RhbmNlKHBhcnRpY2xlLnBvc2l0aW9uKSA8IHRoaXMuZ2V0UmFkaXVzKCkgKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlLnByb3RvdHlwZS5idWJibGUgPSBmdW5jdGlvbiAobW91c2UsIHNldHRpbmdzKSB7XG4gICAgICAgIHZhciBkaXN0YW5jZSA9IHRoaXMucG9zaXRpb24uZGlzdGFuY2UobW91c2UucG9zaXRpb24pO1xuICAgICAgICB2YXIgcmF0aW8gPSAxIC0gZGlzdGFuY2UgLyBzZXR0aW5ncy5kaXN0YW5jZTtcbiAgICAgICAgaWYgKHJhdGlvID49IDAgJiYgbW91c2Uub3Zlcikge1xuICAgICAgICAgICAgdGhpcy5idWJibGVkLm9wYWNpdHkgPSByYXRpbyAqIChzZXR0aW5ncy5vcGFjaXR5IC0gdGhpcy5vcGFjaXR5KTtcbiAgICAgICAgICAgIHRoaXMuYnViYmxlZC5yYWRpdXMgPSByYXRpbyAqIChzZXR0aW5ncy5yYWRpdXMgLSB0aGlzLnJhZGl1cyk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQub3BhY2l0eSA9IDA7XG4gICAgICAgICAgICB0aGlzLmJ1YmJsZWQucmFkaXVzID0gMDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFBhcnRpY2xlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFBhcnRpY2xlO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciBBbmltYXRpb25GcmFtZUZ1bmN0aW9uc18xID0gcmVxdWlyZShcIi4vQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNcIik7XG52YXIgRE9NXzEgPSByZXF1aXJlKFwiLi4vTW9kdWxlcy9ET01cIik7XG52YXIgQ29vcmRpbmF0ZV8xID0gcmVxdWlyZShcIi4vQ29vcmRpbmF0ZVwiKTtcbnZhciBQYXJ0aWNsZV8xID0gcmVxdWlyZShcIi4vUGFydGljbGVcIik7XG52YXIgUGFydGljbGVzID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBQYXJ0aWNsZXMoY3NzUXVlcnksIGNvbnRleHQpIHtcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdzdG9wcGVkJztcbiAgICAgICAgdGhpcy5waXhlbFJhdGlvTGltaXQgPSA4O1xuICAgICAgICB0aGlzLnBpeGVsUmF0aW8gPSAxO1xuICAgICAgICB0aGlzLnBhcnRpY2xlcyA9IG5ldyBBcnJheSgpO1xuICAgICAgICB0aGlzLm1vdXNlID0ge1xuICAgICAgICAgICAgcG9zaXRpb246IG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdCgwLCAwKSxcbiAgICAgICAgICAgIG92ZXI6IGZhbHNlXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gbnVsbDtcbiAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IERPTV8xLkRPTS5nZXRGaXJzdEVsZW1lbnQoY3NzUXVlcnkpO1xuICAgICAgICBpZiAodGhpcy5jYW52YXMgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRocm93IFwiQ2FudmFzIElEIFwiICsgY3NzUXVlcnkgKyBcIiBub3QgZm91bmQuXCI7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHggPSB0aGlzLmNhbnZhcy5nZXRDb250ZXh0KGNvbnRleHQpO1xuICAgICAgICB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMS5BbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKTtcbiAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lID0gQW5pbWF0aW9uRnJhbWVGdW5jdGlvbnNfMS5BbmltYXRpb25GcmFtZUZ1bmN0aW9ucy5jYW5jZWxBbmltYXRpb25GcmFtZSgpO1xuICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPSB7XG4gICAgICAgICAgICBudW1iZXI6IDM1MCxcbiAgICAgICAgICAgIGRlbnNpdHk6IDEwMDAsXG4gICAgICAgICAgICBjb2xvcjogJyNGRkZGRkYnLFxuICAgICAgICAgICAgb3BhY2l0eTogMSxcbiAgICAgICAgICAgIHJhZGl1czogNSxcbiAgICAgICAgICAgIHNoYXBlOiAnY2lyY2xlJyxcbiAgICAgICAgICAgIHN0cm9rZToge1xuICAgICAgICAgICAgICAgIHdpZHRoOiAwLFxuICAgICAgICAgICAgICAgIGNvbG9yOiAnIzAwMDAwMCdcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtb3ZlOiB7XG4gICAgICAgICAgICAgICAgc3BlZWQ6IDAuNCxcbiAgICAgICAgICAgICAgICBkaXJlY3Rpb246ICdib3R0b20nLFxuICAgICAgICAgICAgICAgIHN0cmFpZ2h0OiB0cnVlLFxuICAgICAgICAgICAgICAgIHJhbmRvbTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBlZGdlQm91bmNlOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBhdHRyYWN0OiBmYWxzZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGV2ZW50czoge1xuICAgICAgICAgICAgICAgIHJlc2l6ZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBob3ZlcjogZmFsc2UsXG4gICAgICAgICAgICAgICAgY2xpY2s6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYW5pbWF0ZToge1xuICAgICAgICAgICAgICAgIG9wYWNpdHk6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJhZGl1czogZmFsc2VcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzID0ge1xuICAgICAgICAgICAgaG92ZXI6IHtcbiAgICAgICAgICAgICAgICBidWJibGU6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IDc1LFxuICAgICAgICAgICAgICAgICAgICByYWRpdXM6IDcsXG4gICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlcHVsc2U6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2U6IDEwMCxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2xpY2s6IHtcbiAgICAgICAgICAgICAgICBhZGQ6IHtcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiA0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZW1vdmU6IHtcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiAyXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMudHJhY2tNb3VzZSgpO1xuICAgICAgICB0aGlzLmluaXRpYWxpemVQaXhlbFJhdGlvKHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID49IHRoaXMucGl4ZWxSYXRpb0xpbWl0ID8gdGhpcy5waXhlbFJhdGlvTGltaXQgLSAyIDogd2luZG93LmRldmljZVBpeGVsUmF0aW8pO1xuICAgICAgICB0aGlzLnNldENhbnZhc1NpemUoKTtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLnJlbW92ZVBhcnRpY2xlcygpO1xuICAgICAgICB0aGlzLmNyZWF0ZVBhcnRpY2xlcygpO1xuICAgICAgICB0aGlzLmRpc3RyaWJ1dGVQYXJ0aWNsZXMoKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUudHJhY2tNb3VzZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgaWYgKHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5ob3Zlcikge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5wb3NpdGlvbi54ID0gZXZlbnQub2Zmc2V0WCAqIF90aGlzLnBpeGVsUmF0aW87XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnkgPSBldmVudC5vZmZzZXRZICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2Uub3ZlciA9IHRydWU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VsZWF2ZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMubW91c2UucG9zaXRpb24ueCA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLm1vdXNlLnBvc2l0aW9uLnkgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5tb3VzZS5vdmVyID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5jbGljaykge1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMubW91c2VFdmVudHNBdHRhY2hlZCA9IHRydWU7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmluaXRpYWxpemVQaXhlbFJhdGlvID0gZnVuY3Rpb24gKG5ld1JhdGlvKSB7XG4gICAgICAgIGlmIChuZXdSYXRpbyA9PT0gdm9pZCAwKSB7IG5ld1JhdGlvID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87IH1cbiAgICAgICAgdmFyIG11bHRpcGxpZXIgPSBuZXdSYXRpbyAvIHRoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgdGhpcy53aWR0aCA9IHRoaXMuY2FudmFzLm9mZnNldFdpZHRoICogbXVsdGlwbGllcjtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSB0aGlzLmNhbnZhcy5vZmZzZXRIZWlnaHQgKiBtdWx0aXBsaWVyO1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzID0gdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cy5tYXAoZnVuY3Rpb24gKHIpIHsgcmV0dXJuIHIgKiBtdWx0aXBsaWVyOyB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmICh0eXBlb2YgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLnJhZGl1cyA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MucmFkaXVzICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5zcGVlZCAqPSBtdWx0aXBsaWVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZSAmJiB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuYW5pbWF0ZS5yYWRpdXMpIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVTZXR0aW5ncy5hbmltYXRlLnJhZGl1cy5zcGVlZCAqPSBtdWx0aXBsaWVyO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLmJ1YmJsZS5yYWRpdXMgKj0gbXVsdGlwbGllcjtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlLmRpc3RhbmNlICo9IG11bHRpcGxpZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzLmhvdmVyLnJlcHVsc2UpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIucmVwdWxzZS5kaXN0YW5jZSAqPSBtdWx0aXBsaWVyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMucGl4ZWxSYXRpbyA9IG5ld1JhdGlvO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5jaGVja1pvb20gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbyAhPT0gdGhpcy5waXhlbFJhdGlvICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvIDwgdGhpcy5waXhlbFJhdGlvTGltaXQpIHtcbiAgICAgICAgICAgIHRoaXMuc3RvcERyYXdpbmcoKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZSgpO1xuICAgICAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0Q2FudmFzU2l6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgdGhpcy5jYW52YXMud2lkdGggPSB0aGlzLndpZHRoO1xuICAgICAgICB0aGlzLmNhbnZhcy5oZWlnaHQgPSB0aGlzLmhlaWdodDtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMgJiYgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLmV2ZW50cy5yZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIF90aGlzLmNoZWNrWm9vbSgpO1xuICAgICAgICAgICAgICAgIF90aGlzLndpZHRoID0gX3RoaXMuY2FudmFzLm9mZnNldFdpZHRoICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfdGhpcy5oZWlnaHQgPSBfdGhpcy5jYW52YXMub2Zmc2V0SGVpZ2h0ICogX3RoaXMucGl4ZWxSYXRpbztcbiAgICAgICAgICAgICAgICBfdGhpcy5jYW52YXMud2lkdGggPSBfdGhpcy53aWR0aDtcbiAgICAgICAgICAgICAgICBfdGhpcy5jYW52YXMuaGVpZ2h0ID0gX3RoaXMuaGVpZ2h0O1xuICAgICAgICAgICAgICAgIGlmICghX3RoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnJlbW92ZVBhcnRpY2xlcygpO1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5jcmVhdGVQYXJ0aWNsZXMoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuZHJhd1BhcnRpY2xlcygpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBfdGhpcy5kaXN0cmlidXRlUGFydGljbGVzKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5nZXRGaWxsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdHguZmlsbFN0eWxlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRGaWxsID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5zZXRTdHJva2UgPSBmdW5jdGlvbiAoc3Ryb2tlKSB7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gc3Ryb2tlLmNvbG9yLnRvU3RyaW5nKCk7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHN0cm9rZS53aWR0aDtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuY3R4LmNsZWFyUmVjdCgwLCAwLCB0aGlzLmNhbnZhcy53aWR0aCwgdGhpcy5jYW52YXMuaGVpZ2h0KTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhdyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5kcmF3UGFydGljbGVzKCk7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSlcbiAgICAgICAgICAgIHRoaXMuYW5pbWF0aW9uRnJhbWUgPSB3aW5kb3cucmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMuZHJhdy5iaW5kKHRoaXMpKTtcbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc3RvcERyYXdpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhbmRsZVJlc2l6ZSkge1xuICAgICAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlUmVzaXplID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5hbmltYXRpb25GcmFtZSkge1xuICAgICAgICAgICAgd2luZG93LmNhbmNlbEFuaW1hdGlvbkZyYW1lKHRoaXMuYW5pbWF0aW9uRnJhbWUpO1xuICAgICAgICAgICAgdGhpcy5hbmltYXRpb25GcmFtZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhd1BvbHlnb24gPSBmdW5jdGlvbiAoY2VudGVyLCByYWRpdXMsIHNpZGVzKSB7XG4gICAgICAgIHZhciBkaWFnb25hbEFuZ2xlID0gMzYwIC8gc2lkZXM7XG4gICAgICAgIGRpYWdvbmFsQW5nbGUgKj0gTWF0aC5QSSAvIDE4MDtcbiAgICAgICAgdGhpcy5jdHguc2F2ZSgpO1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHgudHJhbnNsYXRlKGNlbnRlci54LCBjZW50ZXIueSk7XG4gICAgICAgIHRoaXMuY3R4LnJvdGF0ZShkaWFnb25hbEFuZ2xlIC8gKHNpZGVzICUgMiA/IDQgOiAyKSk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhyYWRpdXMsIDApO1xuICAgICAgICB2YXIgYW5nbGU7XG4gICAgICAgIGZvciAodmFyIHMgPSAwOyBzIDwgc2lkZXM7IHMrKykge1xuICAgICAgICAgICAgYW5nbGUgPSBzICogZGlhZ29uYWxBbmdsZTtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSksIHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguZmlsbCgpO1xuICAgICAgICB0aGlzLmN0eC5yZXN0b3JlKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmRyYXdQYXJ0aWNsZSA9IGZ1bmN0aW9uIChwYXJ0aWNsZSkge1xuICAgICAgICB2YXIgb3BhY2l0eSA9IHBhcnRpY2xlLmdldE9wYWNpdHkoKTtcbiAgICAgICAgdmFyIHJhZGl1cyA9IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICB0aGlzLnNldEZpbGwocGFydGljbGUuY29sb3IudG9TdHJpbmcob3BhY2l0eSkpO1xuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgaWYgKHR5cGVvZiAocGFydGljbGUuc2hhcGUpID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgdGhpcy5kcmF3UG9seWdvbihwYXJ0aWNsZS5wb3NpdGlvbiwgcmFkaXVzLCBwYXJ0aWNsZS5zaGFwZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBzd2l0Y2ggKHBhcnRpY2xlLnNoYXBlKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBjYXNlICdjaXJjbGUnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN0eC5hcmMocGFydGljbGUucG9zaXRpb24ueCwgcGFydGljbGUucG9zaXRpb24ueSwgcmFkaXVzLCAwLCBNYXRoLlBJICogMiwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5jbG9zZVBhdGgoKTtcbiAgICAgICAgaWYgKHBhcnRpY2xlLnN0cm9rZS53aWR0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMuc2V0U3Ryb2tlKHBhcnRpY2xlLnN0cm9rZSk7XG4gICAgICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5maWxsKCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmdldE5ld1Bvc2l0aW9uID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gbmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KE1hdGgucmFuZG9tKCkgKiB0aGlzLmNhbnZhcy53aWR0aCwgTWF0aC5yYW5kb20oKSAqIHRoaXMuY2FudmFzLmhlaWdodCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNoZWNrUG9zaXRpb24gPSBmdW5jdGlvbiAocGFydGljbGUpIHtcbiAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdsZWZ0JykueCA8IDApXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnggKz0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgncmlnaHQnKS54ID4gdGhpcy53aWR0aClcbiAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucG9zaXRpb24ueCAtPSBwYXJ0aWNsZS5nZXRSYWRpdXMoKTtcbiAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgndG9wJykueSA8IDApXG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnBvc2l0aW9uLnkgKz0gcGFydGljbGUuZ2V0UmFkaXVzKCk7XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgnYm90dG9tJykueSA+IHRoaXMuaGVpZ2h0KVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5wb3NpdGlvbi55IC09IHBhcnRpY2xlLmdldFJhZGl1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5kaXN0cmlidXRlUGFydGljbGVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmRlbnNpdHkgJiYgdHlwZW9mICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZGVuc2l0eSkgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICB2YXIgYXJlYSA9IHRoaXMuY2FudmFzLndpZHRoICogdGhpcy5jYW52YXMuaGVpZ2h0IC8gMTAwMDtcbiAgICAgICAgICAgIGFyZWEgLz0gdGhpcy5waXhlbFJhdGlvICogMjtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZXNQZXJBcmVhID0gYXJlYSAqIHRoaXMucGFydGljbGVTZXR0aW5ncy5udW1iZXIgLyB0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZGVuc2l0eTtcbiAgICAgICAgICAgIHZhciBtaXNzaW5nID0gcGFydGljbGVzUGVyQXJlYSAtIHRoaXMucGFydGljbGVzLmxlbmd0aDtcbiAgICAgICAgICAgIGlmIChtaXNzaW5nID4gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlUGFydGljbGVzKG1pc3NpbmcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVQYXJ0aWNsZXMoTWF0aC5hYnMobWlzc2luZykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLmNyZWF0ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uIChudW1iZXIsIHBvc2l0aW9uKSB7XG4gICAgICAgIGlmIChudW1iZXIgPT09IHZvaWQgMCkgeyBudW1iZXIgPSB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubnVtYmVyOyB9XG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gdm9pZCAwKSB7IHBvc2l0aW9uID0gbnVsbDsgfVxuICAgICAgICBpZiAoIXRoaXMucGFydGljbGVTZXR0aW5ncylcbiAgICAgICAgICAgIHRocm93ICdQYXJ0aWNsZSBzZXR0aW5ncyBtdXN0IGJlIGluaXRhbGl6ZWQgYmVmb3JlIGEgcGFydGljbGUgaXMgY3JlYXRlZC4nO1xuICAgICAgICB2YXIgcGFydGljbGU7XG4gICAgICAgIGZvciAodmFyIHAgPSAwOyBwIDwgbnVtYmVyOyBwKyspIHtcbiAgICAgICAgICAgIHBhcnRpY2xlID0gbmV3IFBhcnRpY2xlXzEuZGVmYXVsdCh0aGlzLnBhcnRpY2xlU2V0dGluZ3MpO1xuICAgICAgICAgICAgaWYgKHBvc2l0aW9uKSB7XG4gICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24ocG9zaXRpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbih0aGlzLmdldE5ld1Bvc2l0aW9uKCkpO1xuICAgICAgICAgICAgICAgIH0gd2hpbGUgKCF0aGlzLmNoZWNrUG9zaXRpb24ocGFydGljbGUpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzLnB1c2gocGFydGljbGUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnJlbW92ZVBhcnRpY2xlcyA9IGZ1bmN0aW9uIChudW1iZXIpIHtcbiAgICAgICAgaWYgKG51bWJlciA9PT0gdm9pZCAwKSB7IG51bWJlciA9IG51bGw7IH1cbiAgICAgICAgaWYgKCFudW1iZXIpIHtcbiAgICAgICAgICAgIHRoaXMucGFydGljbGVzID0gbmV3IEFycmF5KCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnBhcnRpY2xlcy5zcGxpY2UoMCwgbnVtYmVyKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS51cGRhdGVQYXJ0aWNsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAodmFyIF9pID0gMCwgX2EgPSB0aGlzLnBhcnRpY2xlczsgX2kgPCBfYS5sZW5ndGg7IF9pKyspIHtcbiAgICAgICAgICAgIHZhciBwYXJ0aWNsZSA9IF9hW19pXTtcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSkge1xuICAgICAgICAgICAgICAgIHBhcnRpY2xlLm1vdmUodGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuc3BlZWQpO1xuICAgICAgICAgICAgICAgIGlmICghdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUuZWRnZUJvdW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUuZWRnZSgncmlnaHQnKS54IDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUuc2V0UG9zaXRpb24obmV3IENvb3JkaW5hdGVfMS5kZWZhdWx0KHRoaXMud2lkdGggKyBwYXJ0aWNsZS5nZXRSYWRpdXMoKSwgTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUuZWRnZSgnbGVmdCcpLnggPiB0aGlzLndpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoLTEgKiBwYXJ0aWNsZS5nZXRSYWRpdXMoKSwgTWF0aC5yYW5kb20oKSAqIHRoaXMuaGVpZ2h0KSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5zZXRQb3NpdGlvbihuZXcgQ29vcmRpbmF0ZV8xLmRlZmF1bHQoTWF0aC5yYW5kb20oKSAqIHRoaXMud2lkdGgsIHRoaXMuaGVpZ2h0ICsgcGFydGljbGUuZ2V0UmFkaXVzKCkpKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5lZGdlKCd0b3AnKS55ID4gdGhpcy5oZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnNldFBvc2l0aW9uKG5ldyBDb29yZGluYXRlXzEuZGVmYXVsdChNYXRoLnJhbmRvbSgpICogdGhpcy53aWR0aCwgLTEgKiBwYXJ0aWNsZS5nZXRSYWRpdXMoKSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZS5lZGdlQm91bmNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5lZGdlKCdsZWZ0JykueCA8IDAgfHwgcGFydGljbGUuZWRnZSgncmlnaHQnKS54ID4gdGhpcy53aWR0aCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHkuZmxpcCh0cnVlLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLmVkZ2UoJ3RvcCcpLnkgPCAwIHx8IHBhcnRpY2xlLmVkZ2UoJ2JvdHRvbScpLnkgPiB0aGlzLmhlaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUudmVsb2NpdHkuZmxpcChmYWxzZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUub3BhY2l0eSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUub3BhY2l0eSA+PSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAocGFydGljbGUub3BhY2l0eSA8PSBwYXJ0aWNsZS5vcGFjaXR5QW5pbWF0aW9uLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5vcGFjaXR5ICs9IHBhcnRpY2xlLm9wYWNpdHlBbmltYXRpb24uc3BlZWQgKiAocGFydGljbGUub3BhY2l0eUFuaW1hdGlvbi5pbmNyZWFzaW5nID8gMSA6IC0xKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHBhcnRpY2xlLm9wYWNpdHkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwYXJ0aWNsZS5vcGFjaXR5ID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJ0aWNsZVNldHRpbmdzLmFuaW1hdGUucmFkaXVzKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChwYXJ0aWNsZS5yYWRpdXMgPj0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLm1heCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChwYXJ0aWNsZS5yYWRpdXMgPD0gcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLm1pbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLnJhZGl1cyArPSBwYXJ0aWNsZS5yYWRpdXNBbmltYXRpb24uc3BlZWQgKiAocGFydGljbGUucmFkaXVzQW5pbWF0aW9uLmluY3JlYXNpbmcgPyAxIDogLTEpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydGljbGUucmFkaXVzIDwgMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFydGljbGUucmFkaXVzID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MuZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFydGljbGVTZXR0aW5ncy5ldmVudHMuaG92ZXIgPT09ICdidWJibGUnICYmIHRoaXMuaW50ZXJhY3RpdmVTZXR0aW5ncy5ob3ZlciAmJiB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHBhcnRpY2xlLmJ1YmJsZSh0aGlzLm1vdXNlLCB0aGlzLmludGVyYWN0aXZlU2V0dGluZ3MuaG92ZXIuYnViYmxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuZHJhd1BhcnRpY2xlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdGhpcy5jbGVhcigpO1xuICAgICAgICB0aGlzLnVwZGF0ZVBhcnRpY2xlcygpO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDAsIF9hID0gdGhpcy5wYXJ0aWNsZXM7IF9pIDwgX2EubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgICAgICB2YXIgcGFydGljbGUgPSBfYVtfaV07XG4gICAgICAgICAgICB0aGlzLmRyYXdQYXJ0aWNsZShwYXJ0aWNsZSk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0UGFydGljbGVTZXR0aW5ncyA9IGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNoYW5nZSBzZXR0aW5ncyB3aGlsZSBDYW52YXMgaXMgcnVubmluZy4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc2V0SW50ZXJhY3RpdmVTZXR0aW5ncyA9IGZ1bmN0aW9uIChzZXR0aW5ncykge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSAhPT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnQ2Fubm90IGNoYW5nZSBzZXR0aW5ncyB3aGlsZSBDYW52YXMgaXMgcnVubmluZy4nO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5pbnRlcmFjdGl2ZVNldHRpbmdzID0gc2V0dGluZ3M7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFBhcnRpY2xlcy5wcm90b3R5cGUuc3RhcnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcnRpY2xlU2V0dGluZ3MgPT09IG51bGwpXG4gICAgICAgICAgICB0aHJvdyAnUGFydGljbGUgc2V0dGluZ3MgbXVzdCBiZSBpbml0YWxpemVkIGJlZm9yZSBDYW52YXMgY2FuIHN0YXJ0Lic7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlICE9PSAnc3RvcHBlZCcpXG4gICAgICAgICAgICB0aHJvdyAnQ2FudmFzIGlzIGFscmVhZHkgcnVubmluZy4nO1xuICAgICAgICB0aGlzLnN0YXRlID0gJ3J1bm5pbmcnO1xuICAgICAgICB0aGlzLmluaXRpYWxpemUoKTtcbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnBhdXNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAodGhpcy5zdGF0ZSA9PT0gJ3N0b3BwZWQnKSB7XG4gICAgICAgICAgICB0aHJvdyAnTm8gUGFydGljbGVzIHRvIHBhdXNlLic7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdwYXVzZWQnO1xuICAgICAgICB0aGlzLm1vdmVTZXR0aW5ncyA9IHRoaXMucGFydGljbGVTZXR0aW5ncy5tb3ZlO1xuICAgICAgICB0aGlzLnBhcnRpY2xlU2V0dGluZ3MubW92ZSA9IGZhbHNlO1xuICAgIH07XG4gICAgUGFydGljbGVzLnByb3RvdHlwZS5yZXN1bWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlID09PSAnc3RvcHBlZCcpIHtcbiAgICAgICAgICAgIHRocm93ICdObyBQYXJ0aWNsZXMgdG8gcmVzdW1lLic7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdydW5uaW5nJztcbiAgICAgICAgdGhpcy5wYXJ0aWNsZVNldHRpbmdzLm1vdmUgPSB0aGlzLm1vdmVTZXR0aW5ncztcbiAgICAgICAgdGhpcy5kcmF3KCk7XG4gICAgfTtcbiAgICBQYXJ0aWNsZXMucHJvdG90eXBlLnN0b3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHRoaXMuc3RhdGUgPSAnc3RvcHBlZCc7XG4gICAgICAgIHRoaXMuc3RvcERyYXdpbmcoKTtcbiAgICB9O1xuICAgIHJldHVybiBQYXJ0aWNsZXM7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gUGFydGljbGVzO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgU3Ryb2tlID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBTdHJva2Uod2lkdGgsIGNvbG9yKSB7XG4gICAgICAgIHRoaXMud2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cbiAgICByZXR1cm4gU3Ryb2tlO1xufSgpKTtcbmV4cG9ydHMuZGVmYXVsdCA9IFN0cm9rZTtcbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFZlY3RvciA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gVmVjdG9yKHgsIHkpIHtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG4gICAgVmVjdG9yLnByb3RvdHlwZS5mbGlwID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPT09IHZvaWQgMCkgeyB4ID0gdHJ1ZTsgfVxuICAgICAgICBpZiAoeSA9PT0gdm9pZCAwKSB7IHkgPSB0cnVlOyB9XG4gICAgICAgIGlmICh4KSB7XG4gICAgICAgICAgICB0aGlzLnggKj0gLTE7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHkpIHtcbiAgICAgICAgICAgIHRoaXMueSAqPSAtMTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5tYWduaXR1ZGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoKHRoaXMueCAqIHRoaXMueCkgKyAodGhpcy55ICogdGhpcy55KSk7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLmFuZ2xlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gTWF0aC50YW4odGhpcy55IC8gdGhpcy54KTtcbiAgICB9O1xuICAgIHJldHVybiBWZWN0b3I7XG59KCkpO1xuZXhwb3J0cy5kZWZhdWx0ID0gVmVjdG9yO1xuIl19
