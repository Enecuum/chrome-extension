/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "./";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/background.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;

/***/ }),

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/background.js":
/*!***************************!*\
  !*** ./src/background.js ***!
  \***************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @babel/runtime/helpers/asyncToGenerator */ "./node_modules/@babel/runtime/helpers/asyncToGenerator.js");
/* harmony import */ var _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_extensionApi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/extensionApi */ "./src/utils/extensionApi.js");



var storage = __webpack_require__(/*! ./utils/localStorage */ "./src/utils/localStorage.js");


var Storage = new storage();
global.disk = Storage;
var user = {
  genesis: {
    pubkey: "029dd222eeddd5c3340e8d46ae0a22e2c8e301bfee4903bcf8c899766c8ceb3a7d",
    prvkey: "9d3ce1f3ec99c26c2e64e06d775a52578b00982bf1748e2e2972f7373644ac5c"
  },
  Alice: {
    prvkey: '33d23ca7d306026eaa68d8864dd3871584ed15cc20803077bea71831ee5492cc',
    pubkey: '0228333b99a4d1312f31851dad1c32b530d5ee61534951ebe650c66390fdcffe98'
  },
  Bob: {
    prvkey: '677b5c0340c1cf1cac4358a517fcf1032c8010e797f2ca87728e29ca638b5914',
    pubkey: '030b13a13272b663da33468929110c7505f700b955e1aee754cce17d66a3fde200'
  },
  Eva: {
    prvkey: '3f7c8d236678d45c4437b33d9206dc7626e4c61dc644ca02350ec80e9c908fdd',
    pubkey: '02b41309909a0c401c38e2dd734a6d7f13733d8c5bfa68639047b189fb78e0855d'
  }
};
global.users = user;
var ports = {};

function setupApp() {
  console.log('background ready');
  _utils_extensionApi__WEBPACK_IMPORTED_MODULE_2__["extensionApi"].runtime.onMessage.addListener(msgHandler);
  _utils_extensionApi__WEBPACK_IMPORTED_MODULE_2__["extensionApi"].runtime.onConnect.addListener(connectHandler);
  taskCounter();
}

function msgHandler(_x, _x2, _x3) {
  return _msgHandler.apply(this, arguments);
}

function _msgHandler() {
  _msgHandler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(msg, sender, sendResponse) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log(msg);

          case 1:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _msgHandler.apply(this, arguments);
}

function msgConnectHandler(_x4, _x5) {
  return _msgConnectHandler.apply(this, arguments);
}

function _msgConnectHandler() {
  _msgConnectHandler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(msg, sender) {
    var answer;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log(msg);
            answer = '';

            if (msg.taskId) {
              Storage.task.setTask(msg.taskId, {
                data: msg.data,
                type: msg.type,
                cb: msg.cb
              });

              if (msg.type === 'balanceOf') {
                taskHandler(msg.taskId);
              } else {
                taskCounter();
              }
            } else {
              console.log(msg);
            }

          case 3:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _msgConnectHandler.apply(this, arguments);
}

function msgPopupHandler(_x6, _x7) {
  return _msgPopupHandler.apply(this, arguments);
}

function _msgPopupHandler() {
  _msgPopupHandler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee3(msg, sender) {
    var _user, buf, wallet, data, answer;

    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            console.log({
              msg: msg,
              sender: sender
            });

            if (!msg.popup) {
              _context3.next = 17;
              break;
            }

            if (!(msg.type === 'tx')) {
              _context3.next = 15;
              break;
            }

            _user = Storage.user.loadUser();
            buf = ENQWeb.Net.provider;
            ENQWeb.Net.provider = _user.net;
            wallet = {
              pubkey: _user.publicKey,
              prvkey: _user.privateKey
            };
            data = {
              from: wallet,
              to: msg.data.to,
              amount: Number(msg.data.amount) * 1e10
            };
            console.log(ENQWeb.Net.provider);
            console.log({
              data: data
            });
            _context3.next = 12;
            return ENQWeb.Net.post.tx_fee_off(data);

          case 12:
            answer = _context3.sent;
            console.log(answer);
            ENQWeb.Net.provider = buf;

          case 15:
            _context3.next = 18;
            break;

          case 17:
            if (msg.agree && msg.taskId) {
              taskHandler(msg.taskId);
              taskCounter();
            } else {
              if (msg.taskId) {
                // Storage.task.removeTask(msg.taskId)
                rejectTaskHandler(msg.taskId);
                console.log('removed');
                taskCounter();
              }
            }

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _msgPopupHandler.apply(this, arguments);
}

function listPorts() {
  console.log(ports);
  global.ports = ports;
}

function disconnectHandler(port) {
  console.log('disconnected: ' + port.name);
}

function connectController(port) {
  if (ports[port.name]) {
    ports[port.name].disconnect();
    ports[port.name] = port;
  } else {
    ports[port.name] = port;
  }
}

function taskCounter() {
  var tasks = Storage.task.loadTask();
  var ids = Object.keys(tasks);
  _utils_extensionApi__WEBPACK_IMPORTED_MODULE_2__["extensionApi"].browserAction.setBadgeText({
    text: "".concat(ids.length)
  });
}

global.counterTask = taskCounter;

function taskHandler(_x8) {
  return _taskHandler.apply(this, arguments);
}

function _taskHandler() {
  _taskHandler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee4(taskId) {
    var task, acc, data, wallet, buf;
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            task = Storage.task.getTask(taskId);
            console.log(task);
            acc = Storage.user.loadUser();
            data = '';
            wallet = {
              pubkey: acc.publicKey,
              prvkey: acc.privateKey
            };
            _context4.t0 = task.type;
            _context4.next = _context4.t0 === 'enable' ? 8 : _context4.t0 === 'tx' ? 13 : _context4.t0 === 'balanceOf' ? 27 : 38;
            break;

          case 8:
            console.log('enable. returned: ', acc);
            data = {
              pubkey: acc.publicKey,
              net: acc.net
            };
            ports.content.postMessage({
              data: JSON.stringify(data),
              taskId: taskId,
              cb: task.cb
            });
            Storage.task.removeTask(taskId);
            return _context4.abrupt("break", 39);

          case 13:
            console.log('tx handler work!');
            data = task.data;
            buf = ENQWeb.Net.provider;
            ENQWeb.Net.provider = data.net || acc.net;
            data.from = wallet;
            data.amount = Number(data.value);
            data.value = '';
            _context4.next = 22;
            return ENQWeb.Net.post.tx_fee_off(data);

          case 22:
            data = _context4.sent;
            ports.content.postMessage({
              data: JSON.stringify(data),
              taskId: taskId,
              cb: task.cb
            });
            Storage.task.removeTask(taskId);
            ENQWeb.Net.provider = buf;
            return _context4.abrupt("break", 39);

          case 27:
            console.log(' balanceOf handler work!');
            data = task.data;
            ENQWeb.Net.provider = data.net || acc.net;
            console.log(task.data, ENQWeb.Net.provider);
            _context4.next = 33;
            return ENQWeb.Net.get.getBalance(wallet.pubkey, data.tokenHash)["catch"](function (err) {
              console.log(err);
            });

          case 33:
            data = _context4.sent;
            ports.content.postMessage({
              data: JSON.stringify(data),
              taskId: taskId,
              cb: task.cb
            });
            console.log({
              data: JSON.stringify(data),
              taskId: taskId,
              cb: task.cb
            });
            Storage.task.removeTask(taskId);
            return _context4.abrupt("break", 39);

          case 38:
            return _context4.abrupt("break", 39);

          case 39:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));
  return _taskHandler.apply(this, arguments);
}

function rejectTaskHandler(taskId) {
  var task = Storage.task.getTask(taskId);
  var data = {
    reject: true
  };
  ports.content.postMessage({
    data: JSON.stringify(data),
    taskId: taskId,
    cb: task.cb
  });
  Storage.task.removeTask(taskId);
} //TODO add cleaner connection list


function connectHandler(_x9) {
  return _connectHandler.apply(this, arguments);
}

function _connectHandler() {
  _connectHandler = _babel_runtime_helpers_asyncToGenerator__WEBPACK_IMPORTED_MODULE_1___default()( /*#__PURE__*/_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee5(port) {
    return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return connectController(port);

          case 2:
            _context5.t0 = port.name;
            _context5.next = _context5.t0 === 'content' ? 5 : _context5.t0 === 'popup' ? 7 : 9;
            break;

          case 5:
            port.onMessage.addListener(msgConnectHandler);
            return _context5.abrupt("break", 10);

          case 7:
            port.onMessage.addListener(msgPopupHandler);
            return _context5.abrupt("break", 10);

          case 9:
            return _context5.abrupt("break", 10);

          case 10:
            listPorts();

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5);
  }));
  return _connectHandler.apply(this, arguments);
}

setupApp();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/utils/extensionApi.js":
/*!***********************************!*\
  !*** ./src/utils/extensionApi.js ***!
  \***********************************/
/*! exports provided: extensionApi */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "extensionApi", function() { return extensionApi; });
var extensionApi = global.chrome !== 'undefined' ? global.chrome : global.browser;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/utils/localStorage.js":
/*!***********************************!*\
  !*** ./src/utils/localStorage.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

function loadTask() {
  var task = localStorage.getItem('Task');

  if (!task) {
    return {};
  }

  task = JSON.parse(task);
  return task;
}

function clearTasks() {
  return localStorage.removeItem('Task');
}

function getTask(key) {
  var task = loadTask();
  return task[key];
}

function removeTask(key) {
  var task = loadTask();
  delete task[key];
  task = JSON.stringify(task);
  localStorage.setItem('Task', task);
  return task;
}

function setTask(key, value) {
  var tasks = loadTask();
  tasks[key] = value;
  tasks = JSON.stringify(tasks);
  localStorage.setItem('Task', tasks);
  return tasks;
}

function loadUser() {
  var user = localStorage.getItem('User');

  if (!user) {
    return {};
  }

  user = JSON.parse(user);
  return user;
}

function addUser(publicKey, privateKey, net) {
  var user = {
    publicKey: publicKey,
    privateKey: privateKey,
    net: net
  };
  localStorage.setItem('User', JSON.stringify(user));
  return user;
}

function removeUser() {
  localStorage.setItem('User', '');
}

function setMainUser(name) {
  var user = loadUser();
  localStorage.setItem('MainAcc', JSON.stringify(user[name]));
  return true;
}

function unsetMainUser() {
  localStorage.removeItem('MainAcc');
  return true;
}

function getMainUser() {
  var acc = localStorage.getItem('MainAcc');
  return acc;
}

function getUser(name) {
  var user = loadUser();
  return user[name];
}

function clearUsers() {
  localStorage.removeItem('User');
}

var storage = function Storage() {
  this.task = {
    loadTask: loadTask,
    setTask: setTask,
    getTask: getTask,
    removeTask: removeTask,
    clearTasks: clearTasks
  }, this.user = {
    loadUser: loadUser,
    addUser: addUser,
    getUser: getUser,
    removeUser: removeUser,
    clearUsers: clearUsers
  }, this.mainAcc = {
    get: getMainUser,
    set: setMainUser,
    unset: unsetMainUser
  };
};

module.exports = storage;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL0BiYWJlbC9ydW50aW1lL2hlbHBlcnMvYXN5bmNUb0dlbmVyYXRvci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvQGJhYmVsL3J1bnRpbWUvcmVnZW5lcmF0b3IvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JlZ2VuZXJhdG9yLXJ1bnRpbWUvcnVudGltZS5qcyIsIndlYnBhY2s6Ly8vKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzIiwid2VicGFjazovLy8uL3NyYy9iYWNrZ3JvdW5kLmpzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9leHRlbnNpb25BcGkuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2xvY2FsU3RvcmFnZS5qcyJdLCJuYW1lcyI6WyJzdG9yYWdlIiwicmVxdWlyZSIsIlN0b3JhZ2UiLCJnbG9iYWwiLCJkaXNrIiwidXNlciIsImdlbmVzaXMiLCJwdWJrZXkiLCJwcnZrZXkiLCJBbGljZSIsIkJvYiIsIkV2YSIsInVzZXJzIiwicG9ydHMiLCJzZXR1cEFwcCIsImNvbnNvbGUiLCJsb2ciLCJleHRlbnNpb25BcGkiLCJydW50aW1lIiwib25NZXNzYWdlIiwiYWRkTGlzdGVuZXIiLCJtc2dIYW5kbGVyIiwib25Db25uZWN0IiwiY29ubmVjdEhhbmRsZXIiLCJ0YXNrQ291bnRlciIsIm1zZyIsInNlbmRlciIsInNlbmRSZXNwb25zZSIsIm1zZ0Nvbm5lY3RIYW5kbGVyIiwiYW5zd2VyIiwidGFza0lkIiwidGFzayIsInNldFRhc2siLCJkYXRhIiwidHlwZSIsImNiIiwidGFza0hhbmRsZXIiLCJtc2dQb3B1cEhhbmRsZXIiLCJwb3B1cCIsImxvYWRVc2VyIiwiYnVmIiwiRU5RV2ViIiwiTmV0IiwicHJvdmlkZXIiLCJuZXQiLCJ3YWxsZXQiLCJwdWJsaWNLZXkiLCJwcml2YXRlS2V5IiwiZnJvbSIsInRvIiwiYW1vdW50IiwiTnVtYmVyIiwicG9zdCIsInR4X2ZlZV9vZmYiLCJhZ3JlZSIsInJlamVjdFRhc2tIYW5kbGVyIiwibGlzdFBvcnRzIiwiZGlzY29ubmVjdEhhbmRsZXIiLCJwb3J0IiwibmFtZSIsImNvbm5lY3RDb250cm9sbGVyIiwiZGlzY29ubmVjdCIsInRhc2tzIiwibG9hZFRhc2siLCJpZHMiLCJPYmplY3QiLCJrZXlzIiwiYnJvd3NlckFjdGlvbiIsInNldEJhZGdlVGV4dCIsInRleHQiLCJsZW5ndGgiLCJjb3VudGVyVGFzayIsImdldFRhc2siLCJhY2MiLCJjb250ZW50IiwicG9zdE1lc3NhZ2UiLCJKU09OIiwic3RyaW5naWZ5IiwicmVtb3ZlVGFzayIsInZhbHVlIiwiZ2V0IiwiZ2V0QmFsYW5jZSIsInRva2VuSGFzaCIsImVyciIsInJlamVjdCIsImNocm9tZSIsImJyb3dzZXIiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwicGFyc2UiLCJjbGVhclRhc2tzIiwicmVtb3ZlSXRlbSIsImtleSIsInNldEl0ZW0iLCJhZGRVc2VyIiwicmVtb3ZlVXNlciIsInNldE1haW5Vc2VyIiwidW5zZXRNYWluVXNlciIsImdldE1haW5Vc2VyIiwiZ2V0VXNlciIsImNsZWFyVXNlcnMiLCJtYWluQWNjIiwic2V0IiwidW5zZXQiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FB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O0FBQ0E7QUFDQTs7QUFFQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsU0FBUztBQUNUO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxvQ0FBb0MsY0FBYztBQUNsRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQ0FBaUMsa0JBQWtCO0FBQ25EO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxpQkFBaUI7O0FBRWpCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdCQUF3QixpQkFBaUI7QUFDekM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxZQUFZO0FBQ1o7QUFDQTs7QUFFQTtBQUNBLFlBQVk7QUFDWjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7O0FBRUw7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTs7QUFFQSxXQUFXO0FBQ1g7QUFDQTtBQUNBOztBQUVBLFdBQVc7QUFDWDtBQUNBO0FBQ0E7O0FBRUEsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBLDhDQUE4QyxRQUFRO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsS0FBSzs7QUFFTDtBQUNBO0FBQ0E7QUFDQTs7QUFF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Q0MsT0FBYixDQUFxQixTQUFyQixDQUFWO0FBQ0EsU0FBT2YsR0FBUDtBQUNIOztBQUVELFNBQVMwQixPQUFULENBQWlCeEMsSUFBakIsRUFBdUI7QUFDbkIsTUFBSXRELElBQUksR0FBR2tDLFFBQVEsRUFBbkI7QUFDQSxTQUFPbEMsSUFBSSxDQUFDc0QsSUFBRCxDQUFYO0FBQ0g7O0FBRUQsU0FBU3lDLFVBQVQsR0FBc0I7QUFDbEJiLGNBQVksQ0FBQ0ksVUFBYixDQUF3QixNQUF4QjtBQUNIOztBQUVELElBQUkzRixPQUFPLEdBQUcsU0FBU0UsT0FBVCxHQUFtQjtBQUU3QixPQUFLNkIsSUFBTCxHQUFZO0FBQ1JnQyxZQUFRLEVBQVJBLFFBRFE7QUFFUi9CLFdBQU8sRUFBUEEsT0FGUTtBQUdSd0MsV0FBTyxFQUFQQSxPQUhRO0FBSVJNLGNBQVUsRUFBVkEsVUFKUTtBQUtSWSxjQUFVLEVBQVZBO0FBTFEsR0FBWixFQU9BLEtBQUtyRixJQUFMLEdBQVk7QUFDUmtDLFlBQVEsRUFBUkEsUUFEUTtBQUVSdUQsV0FBTyxFQUFQQSxPQUZRO0FBR1JLLFdBQU8sRUFBUEEsT0FIUTtBQUlSSixjQUFVLEVBQVZBLFVBSlE7QUFLUkssY0FBVSxFQUFWQTtBQUxRLEdBUFosRUFjQSxLQUFLQyxPQUFMLEdBQWU7QUFDWHJCLE9BQUcsRUFBRWtCLFdBRE07QUFFWEksT0FBRyxFQUFFTixXQUZNO0FBR1hPLFNBQUssRUFBRU47QUFISSxHQWRmO0FBbUJILENBckJEOztBQXVCQU8sTUFBTSxDQUFDQyxPQUFQLEdBQWlCekcsT0FBakIsQyIsImZpbGUiOiJiYWNrZ3JvdW5kLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9iYWNrZ3JvdW5kLmpzXCIpO1xuIiwiZnVuY3Rpb24gYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBrZXksIGFyZykge1xuICB0cnkge1xuICAgIHZhciBpbmZvID0gZ2VuW2tleV0oYXJnKTtcbiAgICB2YXIgdmFsdWUgPSBpbmZvLnZhbHVlO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIHJlamVjdChlcnJvcik7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaWYgKGluZm8uZG9uZSkge1xuICAgIHJlc29sdmUodmFsdWUpO1xuICB9IGVsc2Uge1xuICAgIFByb21pc2UucmVzb2x2ZSh2YWx1ZSkudGhlbihfbmV4dCwgX3Rocm93KTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfYXN5bmNUb0dlbmVyYXRvcihmbikge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHZhciBzZWxmID0gdGhpcyxcbiAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGdlbiA9IGZuLmFwcGx5KHNlbGYsIGFyZ3MpO1xuXG4gICAgICBmdW5jdGlvbiBfbmV4dCh2YWx1ZSkge1xuICAgICAgICBhc3luY0dlbmVyYXRvclN0ZXAoZ2VuLCByZXNvbHZlLCByZWplY3QsIF9uZXh0LCBfdGhyb3csIFwibmV4dFwiLCB2YWx1ZSk7XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIF90aHJvdyhlcnIpIHtcbiAgICAgICAgYXN5bmNHZW5lcmF0b3JTdGVwKGdlbiwgcmVzb2x2ZSwgcmVqZWN0LCBfbmV4dCwgX3Rocm93LCBcInRocm93XCIsIGVycik7XG4gICAgICB9XG5cbiAgICAgIF9uZXh0KHVuZGVmaW5lZCk7XG4gICAgfSk7XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gX2FzeW5jVG9HZW5lcmF0b3I7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVnZW5lcmF0b3ItcnVudGltZVwiKTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxudmFyIHJ1bnRpbWUgPSAoZnVuY3Rpb24gKGV4cG9ydHMpIHtcbiAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgdmFyIE9wID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgdmFyIGhhc093biA9IE9wLmhhc093blByb3BlcnR5O1xuICB2YXIgdW5kZWZpbmVkOyAvLyBNb3JlIGNvbXByZXNzaWJsZSB0aGFuIHZvaWQgMC5cbiAgdmFyICRTeW1ib2wgPSB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgPyBTeW1ib2wgOiB7fTtcbiAgdmFyIGl0ZXJhdG9yU3ltYm9sID0gJFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcbiAgdmFyIGFzeW5jSXRlcmF0b3JTeW1ib2wgPSAkU3ltYm9sLmFzeW5jSXRlcmF0b3IgfHwgXCJAQGFzeW5jSXRlcmF0b3JcIjtcbiAgdmFyIHRvU3RyaW5nVGFnU3ltYm9sID0gJFN5bWJvbC50b1N0cmluZ1RhZyB8fCBcIkBAdG9TdHJpbmdUYWdcIjtcblxuICBmdW5jdGlvbiBkZWZpbmUob2JqLCBrZXksIHZhbHVlKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqW2tleV07XG4gIH1cbiAgdHJ5IHtcbiAgICAvLyBJRSA4IGhhcyBhIGJyb2tlbiBPYmplY3QuZGVmaW5lUHJvcGVydHkgdGhhdCBvbmx5IHdvcmtzIG9uIERPTSBvYmplY3RzLlxuICAgIGRlZmluZSh7fSwgXCJcIik7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIGRlZmluZSA9IGZ1bmN0aW9uKG9iaiwga2V5LCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG9ialtrZXldID0gdmFsdWU7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBJZiBvdXRlckZuIHByb3ZpZGVkIGFuZCBvdXRlckZuLnByb3RvdHlwZSBpcyBhIEdlbmVyYXRvciwgdGhlbiBvdXRlckZuLnByb3RvdHlwZSBpbnN0YW5jZW9mIEdlbmVyYXRvci5cbiAgICB2YXIgcHJvdG9HZW5lcmF0b3IgPSBvdXRlckZuICYmIG91dGVyRm4ucHJvdG90eXBlIGluc3RhbmNlb2YgR2VuZXJhdG9yID8gb3V0ZXJGbiA6IEdlbmVyYXRvcjtcbiAgICB2YXIgZ2VuZXJhdG9yID0gT2JqZWN0LmNyZWF0ZShwcm90b0dlbmVyYXRvci5wcm90b3R5cGUpO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QgfHwgW10pO1xuXG4gICAgLy8gVGhlIC5faW52b2tlIG1ldGhvZCB1bmlmaWVzIHRoZSBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlIC5uZXh0LFxuICAgIC8vIC50aHJvdywgYW5kIC5yZXR1cm4gbWV0aG9kcy5cbiAgICBnZW5lcmF0b3IuX2ludm9rZSA9IG1ha2VJbnZva2VNZXRob2QoaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG5cbiAgICByZXR1cm4gZ2VuZXJhdG9yO1xuICB9XG4gIGV4cG9ydHMud3JhcCA9IHdyYXA7XG5cbiAgLy8gVHJ5L2NhdGNoIGhlbHBlciB0byBtaW5pbWl6ZSBkZW9wdGltaXphdGlvbnMuIFJldHVybnMgYSBjb21wbGV0aW9uXG4gIC8vIHJlY29yZCBsaWtlIGNvbnRleHQudHJ5RW50cmllc1tpXS5jb21wbGV0aW9uLiBUaGlzIGludGVyZmFjZSBjb3VsZFxuICAvLyBoYXZlIGJlZW4gKGFuZCB3YXMgcHJldmlvdXNseSkgZGVzaWduZWQgdG8gdGFrZSBhIGNsb3N1cmUgdG8gYmVcbiAgLy8gaW52b2tlZCB3aXRob3V0IGFyZ3VtZW50cywgYnV0IGluIGFsbCB0aGUgY2FzZXMgd2UgY2FyZSBhYm91dCB3ZVxuICAvLyBhbHJlYWR5IGhhdmUgYW4gZXhpc3RpbmcgbWV0aG9kIHdlIHdhbnQgdG8gY2FsbCwgc28gdGhlcmUncyBubyBuZWVkXG4gIC8vIHRvIGNyZWF0ZSBhIG5ldyBmdW5jdGlvbiBvYmplY3QuIFdlIGNhbiBldmVuIGdldCBhd2F5IHdpdGggYXNzdW1pbmdcbiAgLy8gdGhlIG1ldGhvZCB0YWtlcyBleGFjdGx5IG9uZSBhcmd1bWVudCwgc2luY2UgdGhhdCBoYXBwZW5zIHRvIGJlIHRydWVcbiAgLy8gaW4gZXZlcnkgY2FzZSwgc28gd2UgZG9uJ3QgaGF2ZSB0byB0b3VjaCB0aGUgYXJndW1lbnRzIG9iamVjdC4gVGhlXG4gIC8vIG9ubHkgYWRkaXRpb25hbCBhbGxvY2F0aW9uIHJlcXVpcmVkIGlzIHRoZSBjb21wbGV0aW9uIHJlY29yZCwgd2hpY2hcbiAgLy8gaGFzIGEgc3RhYmxlIHNoYXBlIGFuZCBzbyBob3BlZnVsbHkgc2hvdWxkIGJlIGNoZWFwIHRvIGFsbG9jYXRlLlxuICBmdW5jdGlvbiB0cnlDYXRjaChmbiwgb2JqLCBhcmcpIHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJub3JtYWxcIiwgYXJnOiBmbi5jYWxsKG9iaiwgYXJnKSB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgcmV0dXJuIHsgdHlwZTogXCJ0aHJvd1wiLCBhcmc6IGVyciB9O1xuICAgIH1cbiAgfVxuXG4gIHZhciBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ID0gXCJzdXNwZW5kZWRTdGFydFwiO1xuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRZaWVsZCA9IFwic3VzcGVuZGVkWWllbGRcIjtcbiAgdmFyIEdlblN0YXRlRXhlY3V0aW5nID0gXCJleGVjdXRpbmdcIjtcbiAgdmFyIEdlblN0YXRlQ29tcGxldGVkID0gXCJjb21wbGV0ZWRcIjtcblxuICAvLyBSZXR1cm5pbmcgdGhpcyBvYmplY3QgZnJvbSB0aGUgaW5uZXJGbiBoYXMgdGhlIHNhbWUgZWZmZWN0IGFzXG4gIC8vIGJyZWFraW5nIG91dCBvZiB0aGUgZGlzcGF0Y2ggc3dpdGNoIHN0YXRlbWVudC5cbiAgdmFyIENvbnRpbnVlU2VudGluZWwgPSB7fTtcblxuICAvLyBEdW1teSBjb25zdHJ1Y3RvciBmdW5jdGlvbnMgdGhhdCB3ZSB1c2UgYXMgdGhlIC5jb25zdHJ1Y3RvciBhbmRcbiAgLy8gLmNvbnN0cnVjdG9yLnByb3RvdHlwZSBwcm9wZXJ0aWVzIGZvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gR2VuZXJhdG9yXG4gIC8vIG9iamVjdHMuIEZvciBmdWxsIHNwZWMgY29tcGxpYW5jZSwgeW91IG1heSB3aXNoIHRvIGNvbmZpZ3VyZSB5b3VyXG4gIC8vIG1pbmlmaWVyIG5vdCB0byBtYW5nbGUgdGhlIG5hbWVzIG9mIHRoZXNlIHR3byBmdW5jdGlvbnMuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uKCkge31cbiAgZnVuY3Rpb24gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUoKSB7fVxuXG4gIC8vIFRoaXMgaXMgYSBwb2x5ZmlsbCBmb3IgJUl0ZXJhdG9yUHJvdG90eXBlJSBmb3IgZW52aXJvbm1lbnRzIHRoYXRcbiAgLy8gZG9uJ3QgbmF0aXZlbHkgc3VwcG9ydCBpdC5cbiAgdmFyIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XG4gIEl0ZXJhdG9yUHJvdG90eXBlW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcblxuICB2YXIgZ2V0UHJvdG8gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Y7XG4gIHZhciBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSA9IGdldFByb3RvICYmIGdldFByb3RvKGdldFByb3RvKHZhbHVlcyhbXSkpKTtcbiAgaWYgKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlICYmXG4gICAgICBOYXRpdmVJdGVyYXRvclByb3RvdHlwZSAhPT0gT3AgJiZcbiAgICAgIGhhc093bi5jYWxsKE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlLCBpdGVyYXRvclN5bWJvbCkpIHtcbiAgICAvLyBUaGlzIGVudmlyb25tZW50IGhhcyBhIG5hdGl2ZSAlSXRlcmF0b3JQcm90b3R5cGUlOyB1c2UgaXQgaW5zdGVhZFxuICAgIC8vIG9mIHRoZSBwb2x5ZmlsbC5cbiAgICBJdGVyYXRvclByb3RvdHlwZSA9IE5hdGl2ZUl0ZXJhdG9yUHJvdG90eXBlO1xuICB9XG5cbiAgdmFyIEdwID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGUucHJvdG90eXBlID1cbiAgICBHZW5lcmF0b3IucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSk7XG4gIEdlbmVyYXRvckZ1bmN0aW9uLnByb3RvdHlwZSA9IEdwLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLmNvbnN0cnVjdG9yID0gR2VuZXJhdG9yRnVuY3Rpb247XG4gIEdlbmVyYXRvckZ1bmN0aW9uLmRpc3BsYXlOYW1lID0gZGVmaW5lKFxuICAgIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlLFxuICAgIHRvU3RyaW5nVGFnU3ltYm9sLFxuICAgIFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICApO1xuXG4gIC8vIEhlbHBlciBmb3IgZGVmaW5pbmcgdGhlIC5uZXh0LCAudGhyb3csIGFuZCAucmV0dXJuIG1ldGhvZHMgb2YgdGhlXG4gIC8vIEl0ZXJhdG9yIGludGVyZmFjZSBpbiB0ZXJtcyBvZiBhIHNpbmdsZSAuX2ludm9rZSBtZXRob2QuXG4gIGZ1bmN0aW9uIGRlZmluZUl0ZXJhdG9yTWV0aG9kcyhwcm90b3R5cGUpIHtcbiAgICBbXCJuZXh0XCIsIFwidGhyb3dcIiwgXCJyZXR1cm5cIl0uZm9yRWFjaChmdW5jdGlvbihtZXRob2QpIHtcbiAgICAgIGRlZmluZShwcm90b3R5cGUsIG1ldGhvZCwgZnVuY3Rpb24oYXJnKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pbnZva2UobWV0aG9kLCBhcmcpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBleHBvcnRzLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBleHBvcnRzLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBpZiAoT2JqZWN0LnNldFByb3RvdHlwZU9mKSB7XG4gICAgICBPYmplY3Quc2V0UHJvdG90eXBlT2YoZ2VuRnVuLCBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGdlbkZ1bi5fX3Byb3RvX18gPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZTtcbiAgICAgIGRlZmluZShnZW5GdW4sIHRvU3RyaW5nVGFnU3ltYm9sLCBcIkdlbmVyYXRvckZ1bmN0aW9uXCIpO1xuICAgIH1cbiAgICBnZW5GdW4ucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShHcCk7XG4gICAgcmV0dXJuIGdlbkZ1bjtcbiAgfTtcblxuICAvLyBXaXRoaW4gdGhlIGJvZHkgb2YgYW55IGFzeW5jIGZ1bmN0aW9uLCBgYXdhaXQgeGAgaXMgdHJhbnNmb3JtZWQgdG9cbiAgLy8gYHlpZWxkIHJlZ2VuZXJhdG9yUnVudGltZS5hd3JhcCh4KWAsIHNvIHRoYXQgdGhlIHJ1bnRpbWUgY2FuIHRlc3RcbiAgLy8gYGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIilgIHRvIGRldGVybWluZSBpZiB0aGUgeWllbGRlZCB2YWx1ZSBpc1xuICAvLyBtZWFudCB0byBiZSBhd2FpdGVkLlxuICBleHBvcnRzLmF3cmFwID0gZnVuY3Rpb24oYXJnKSB7XG4gICAgcmV0dXJuIHsgX19hd2FpdDogYXJnIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gQXN5bmNJdGVyYXRvcihnZW5lcmF0b3IsIFByb21pc2VJbXBsKSB7XG4gICAgZnVuY3Rpb24gaW52b2tlKG1ldGhvZCwgYXJnLCByZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChnZW5lcmF0b3JbbWV0aG9kXSwgZ2VuZXJhdG9yLCBhcmcpO1xuICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgcmVqZWN0KHJlY29yZC5hcmcpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHJlc3VsdCA9IHJlY29yZC5hcmc7XG4gICAgICAgIHZhciB2YWx1ZSA9IHJlc3VsdC52YWx1ZTtcbiAgICAgICAgaWYgKHZhbHVlICYmXG4gICAgICAgICAgICB0eXBlb2YgdmFsdWUgPT09IFwib2JqZWN0XCIgJiZcbiAgICAgICAgICAgIGhhc093bi5jYWxsKHZhbHVlLCBcIl9fYXdhaXRcIikpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZUltcGwucmVzb2x2ZSh2YWx1ZS5fX2F3YWl0KS50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgICAgICBpbnZva2UoXCJuZXh0XCIsIHZhbHVlLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICAgICAgaW52b2tlKFwidGhyb3dcIiwgZXJyLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIFByb21pc2VJbXBsLnJlc29sdmUodmFsdWUpLnRoZW4oZnVuY3Rpb24odW53cmFwcGVkKSB7XG4gICAgICAgICAgLy8gV2hlbiBhIHlpZWxkZWQgUHJvbWlzZSBpcyByZXNvbHZlZCwgaXRzIGZpbmFsIHZhbHVlIGJlY29tZXNcbiAgICAgICAgICAvLyB0aGUgLnZhbHVlIG9mIHRoZSBQcm9taXNlPHt2YWx1ZSxkb25lfT4gcmVzdWx0IGZvciB0aGVcbiAgICAgICAgICAvLyBjdXJyZW50IGl0ZXJhdGlvbi5cbiAgICAgICAgICByZXN1bHQudmFsdWUgPSB1bndyYXBwZWQ7XG4gICAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xuICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgIC8vIElmIGEgcmVqZWN0ZWQgUHJvbWlzZSB3YXMgeWllbGRlZCwgdGhyb3cgdGhlIHJlamVjdGlvbiBiYWNrXG4gICAgICAgICAgLy8gaW50byB0aGUgYXN5bmMgZ2VuZXJhdG9yIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBoYW5kbGVkIHRoZXJlLlxuICAgICAgICAgIHJldHVybiBpbnZva2UoXCJ0aHJvd1wiLCBlcnJvciwgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHByZXZpb3VzUHJvbWlzZTtcblxuICAgIGZ1bmN0aW9uIGVucXVldWUobWV0aG9kLCBhcmcpIHtcbiAgICAgIGZ1bmN0aW9uIGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCkge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2VJbXBsKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgIGludm9rZShtZXRob2QsIGFyZywgcmVzb2x2ZSwgcmVqZWN0KTtcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcmV2aW91c1Byb21pc2UgPVxuICAgICAgICAvLyBJZiBlbnF1ZXVlIGhhcyBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gd2Ugd2FudCB0byB3YWl0IHVudGlsXG4gICAgICAgIC8vIGFsbCBwcmV2aW91cyBQcm9taXNlcyBoYXZlIGJlZW4gcmVzb2x2ZWQgYmVmb3JlIGNhbGxpbmcgaW52b2tlLFxuICAgICAgICAvLyBzbyB0aGF0IHJlc3VsdHMgYXJlIGFsd2F5cyBkZWxpdmVyZWQgaW4gdGhlIGNvcnJlY3Qgb3JkZXIuIElmXG4gICAgICAgIC8vIGVucXVldWUgaGFzIG5vdCBiZWVuIGNhbGxlZCBiZWZvcmUsIHRoZW4gaXQgaXMgaW1wb3J0YW50IHRvXG4gICAgICAgIC8vIGNhbGwgaW52b2tlIGltbWVkaWF0ZWx5LCB3aXRob3V0IHdhaXRpbmcgb24gYSBjYWxsYmFjayB0byBmaXJlLFxuICAgICAgICAvLyBzbyB0aGF0IHRoZSBhc3luYyBnZW5lcmF0b3IgZnVuY3Rpb24gaGFzIHRoZSBvcHBvcnR1bml0eSB0byBkb1xuICAgICAgICAvLyBhbnkgbmVjZXNzYXJ5IHNldHVwIGluIGEgcHJlZGljdGFibGUgd2F5LiBUaGlzIHByZWRpY3RhYmlsaXR5XG4gICAgICAgIC8vIGlzIHdoeSB0aGUgUHJvbWlzZSBjb25zdHJ1Y3RvciBzeW5jaHJvbm91c2x5IGludm9rZXMgaXRzXG4gICAgICAgIC8vIGV4ZWN1dG9yIGNhbGxiYWNrLCBhbmQgd2h5IGFzeW5jIGZ1bmN0aW9ucyBzeW5jaHJvbm91c2x5XG4gICAgICAgIC8vIGV4ZWN1dGUgY29kZSBiZWZvcmUgdGhlIGZpcnN0IGF3YWl0LiBTaW5jZSB3ZSBpbXBsZW1lbnQgc2ltcGxlXG4gICAgICAgIC8vIGFzeW5jIGZ1bmN0aW9ucyBpbiB0ZXJtcyBvZiBhc3luYyBnZW5lcmF0b3JzLCBpdCBpcyBlc3BlY2lhbGx5XG4gICAgICAgIC8vIGltcG9ydGFudCB0byBnZXQgdGhpcyByaWdodCwgZXZlbiB0aG91Z2ggaXQgcmVxdWlyZXMgY2FyZS5cbiAgICAgICAgcHJldmlvdXNQcm9taXNlID8gcHJldmlvdXNQcm9taXNlLnRoZW4oXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmcsXG4gICAgICAgICAgLy8gQXZvaWQgcHJvcGFnYXRpbmcgZmFpbHVyZXMgdG8gUHJvbWlzZXMgcmV0dXJuZWQgYnkgbGF0ZXJcbiAgICAgICAgICAvLyBpbnZvY2F0aW9ucyBvZiB0aGUgaXRlcmF0b3IuXG4gICAgICAgICAgY2FsbEludm9rZVdpdGhNZXRob2RBbmRBcmdcbiAgICAgICAgKSA6IGNhbGxJbnZva2VXaXRoTWV0aG9kQW5kQXJnKCk7XG4gICAgfVxuXG4gICAgLy8gRGVmaW5lIHRoZSB1bmlmaWVkIGhlbHBlciBtZXRob2QgdGhhdCBpcyB1c2VkIHRvIGltcGxlbWVudCAubmV4dCxcbiAgICAvLyAudGhyb3csIGFuZCAucmV0dXJuIChzZWUgZGVmaW5lSXRlcmF0b3JNZXRob2RzKS5cbiAgICB0aGlzLl9pbnZva2UgPSBlbnF1ZXVlO1xuICB9XG5cbiAgZGVmaW5lSXRlcmF0b3JNZXRob2RzKEFzeW5jSXRlcmF0b3IucHJvdG90eXBlKTtcbiAgQXN5bmNJdGVyYXRvci5wcm90b3R5cGVbYXN5bmNJdGVyYXRvclN5bWJvbF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG4gIGV4cG9ydHMuQXN5bmNJdGVyYXRvciA9IEFzeW5jSXRlcmF0b3I7XG5cbiAgLy8gTm90ZSB0aGF0IHNpbXBsZSBhc3luYyBmdW5jdGlvbnMgYXJlIGltcGxlbWVudGVkIG9uIHRvcCBvZlxuICAvLyBBc3luY0l0ZXJhdG9yIG9iamVjdHM7IHRoZXkganVzdCByZXR1cm4gYSBQcm9taXNlIGZvciB0aGUgdmFsdWUgb2ZcbiAgLy8gdGhlIGZpbmFsIHJlc3VsdCBwcm9kdWNlZCBieSB0aGUgaXRlcmF0b3IuXG4gIGV4cG9ydHMuYXN5bmMgPSBmdW5jdGlvbihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCwgUHJvbWlzZUltcGwpIHtcbiAgICBpZiAoUHJvbWlzZUltcGwgPT09IHZvaWQgMCkgUHJvbWlzZUltcGwgPSBQcm9taXNlO1xuXG4gICAgdmFyIGl0ZXIgPSBuZXcgQXN5bmNJdGVyYXRvcihcbiAgICAgIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpLFxuICAgICAgUHJvbWlzZUltcGxcbiAgICApO1xuXG4gICAgcmV0dXJuIGV4cG9ydHMuaXNHZW5lcmF0b3JGdW5jdGlvbihvdXRlckZuKVxuICAgICAgPyBpdGVyIC8vIElmIG91dGVyRm4gaXMgYSBnZW5lcmF0b3IsIHJldHVybiB0aGUgZnVsbCBpdGVyYXRvci5cbiAgICAgIDogaXRlci5uZXh0KCkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICByZXR1cm4gcmVzdWx0LmRvbmUgPyByZXN1bHQudmFsdWUgOiBpdGVyLm5leHQoKTtcbiAgICAgICAgfSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gbWFrZUludm9rZU1ldGhvZChpbm5lckZuLCBzZWxmLCBjb250ZXh0KSB7XG4gICAgdmFyIHN0YXRlID0gR2VuU3RhdGVTdXNwZW5kZWRTdGFydDtcblxuICAgIHJldHVybiBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIGNvbnRleHQubWV0aG9kID0gbWV0aG9kO1xuICAgICAgY29udGV4dC5hcmcgPSBhcmc7XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciBkZWxlZ2F0ZVJlc3VsdCA9IG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuICAgICAgICAgIGlmIChkZWxlZ2F0ZVJlc3VsdCkge1xuICAgICAgICAgICAgaWYgKGRlbGVnYXRlUmVzdWx0ID09PSBDb250aW51ZVNlbnRpbmVsKSBjb250aW51ZTtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZVJlc3VsdDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoY29udGV4dC5tZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgLy8gU2V0dGluZyBjb250ZXh0Ll9zZW50IGZvciBsZWdhY3kgc3VwcG9ydCBvZiBCYWJlbCdzXG4gICAgICAgICAgLy8gZnVuY3Rpb24uc2VudCBpbXBsZW1lbnRhdGlvbi5cbiAgICAgICAgICBjb250ZXh0LnNlbnQgPSBjb250ZXh0Ll9zZW50ID0gY29udGV4dC5hcmc7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0KSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgICAgdGhyb3cgY29udGV4dC5hcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgY29udGV4dC5kaXNwYXRjaEV4Y2VwdGlvbihjb250ZXh0LmFyZyk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICAgIGNvbnRleHQuYWJydXB0KFwicmV0dXJuXCIsIGNvbnRleHQuYXJnKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHN0YXRlID0gR2VuU3RhdGVFeGVjdXRpbmc7XG5cbiAgICAgICAgdmFyIHJlY29yZCA9IHRyeUNhdGNoKGlubmVyRm4sIHNlbGYsIGNvbnRleHQpO1xuICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwibm9ybWFsXCIpIHtcbiAgICAgICAgICAvLyBJZiBhbiBleGNlcHRpb24gaXMgdGhyb3duIGZyb20gaW5uZXJGbiwgd2UgbGVhdmUgc3RhdGUgPT09XG4gICAgICAgICAgLy8gR2VuU3RhdGVFeGVjdXRpbmcgYW5kIGxvb3AgYmFjayBmb3IgYW5vdGhlciBpbnZvY2F0aW9uLlxuICAgICAgICAgIHN0YXRlID0gY29udGV4dC5kb25lXG4gICAgICAgICAgICA/IEdlblN0YXRlQ29tcGxldGVkXG4gICAgICAgICAgICA6IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLmFyZyA9PT0gQ29udGludWVTZW50aW5lbCkge1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHZhbHVlOiByZWNvcmQuYXJnLFxuICAgICAgICAgICAgZG9uZTogY29udGV4dC5kb25lXG4gICAgICAgICAgfTtcblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuICAgICAgICAgIC8vIERpc3BhdGNoIHRoZSBleGNlcHRpb24gYnkgbG9vcGluZyBiYWNrIGFyb3VuZCB0byB0aGVcbiAgICAgICAgICAvLyBjb250ZXh0LmRpc3BhdGNoRXhjZXB0aW9uKGNvbnRleHQuYXJnKSBjYWxsIGFib3ZlLlxuICAgICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gcmVjb3JkLmFyZztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBDYWxsIGRlbGVnYXRlLml0ZXJhdG9yW2NvbnRleHQubWV0aG9kXShjb250ZXh0LmFyZykgYW5kIGhhbmRsZSB0aGVcbiAgLy8gcmVzdWx0LCBlaXRoZXIgYnkgcmV0dXJuaW5nIGEgeyB2YWx1ZSwgZG9uZSB9IHJlc3VsdCBmcm9tIHRoZVxuICAvLyBkZWxlZ2F0ZSBpdGVyYXRvciwgb3IgYnkgbW9kaWZ5aW5nIGNvbnRleHQubWV0aG9kIGFuZCBjb250ZXh0LmFyZyxcbiAgLy8gc2V0dGluZyBjb250ZXh0LmRlbGVnYXRlIHRvIG51bGwsIGFuZCByZXR1cm5pbmcgdGhlIENvbnRpbnVlU2VudGluZWwuXG4gIGZ1bmN0aW9uIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpIHtcbiAgICB2YXIgbWV0aG9kID0gZGVsZWdhdGUuaXRlcmF0b3JbY29udGV4dC5tZXRob2RdO1xuICAgIGlmIChtZXRob2QgPT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gQSAudGhyb3cgb3IgLnJldHVybiB3aGVuIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgbm8gLnRocm93XG4gICAgICAvLyBtZXRob2QgYWx3YXlzIHRlcm1pbmF0ZXMgdGhlIHlpZWxkKiBsb29wLlxuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgIGlmIChjb250ZXh0Lm1ldGhvZCA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIC8vIE5vdGU6IFtcInJldHVyblwiXSBtdXN0IGJlIHVzZWQgZm9yIEVTMyBwYXJzaW5nIGNvbXBhdGliaWxpdHkuXG4gICAgICAgIGlmIChkZWxlZ2F0ZS5pdGVyYXRvcltcInJldHVyblwiXSkge1xuICAgICAgICAgIC8vIElmIHRoZSBkZWxlZ2F0ZSBpdGVyYXRvciBoYXMgYSByZXR1cm4gbWV0aG9kLCBnaXZlIGl0IGFcbiAgICAgICAgICAvLyBjaGFuY2UgdG8gY2xlYW4gdXAuXG4gICAgICAgICAgY29udGV4dC5tZXRob2QgPSBcInJldHVyblwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICAgIG1heWJlSW52b2tlRGVsZWdhdGUoZGVsZWdhdGUsIGNvbnRleHQpO1xuXG4gICAgICAgICAgaWYgKGNvbnRleHQubWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIC8vIElmIG1heWJlSW52b2tlRGVsZWdhdGUoY29udGV4dCkgY2hhbmdlZCBjb250ZXh0Lm1ldGhvZCBmcm9tXG4gICAgICAgICAgICAvLyBcInJldHVyblwiIHRvIFwidGhyb3dcIiwgbGV0IHRoYXQgb3ZlcnJpZGUgdGhlIFR5cGVFcnJvciBiZWxvdy5cbiAgICAgICAgICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgICBjb250ZXh0LmFyZyA9IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgXCJUaGUgaXRlcmF0b3IgZG9lcyBub3QgcHJvdmlkZSBhICd0aHJvdycgbWV0aG9kXCIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2gobWV0aG9kLCBkZWxlZ2F0ZS5pdGVyYXRvciwgY29udGV4dC5hcmcpO1xuXG4gICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgIGNvbnRleHQubWV0aG9kID0gXCJ0aHJvd1wiO1xuICAgICAgY29udGV4dC5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG5cbiAgICBpZiAoISBpbmZvKSB7XG4gICAgICBjb250ZXh0Lm1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgIGNvbnRleHQuYXJnID0gbmV3IFR5cGVFcnJvcihcIml0ZXJhdG9yIHJlc3VsdCBpcyBub3QgYW4gb2JqZWN0XCIpO1xuICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9XG5cbiAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAvLyBBc3NpZ24gdGhlIHJlc3VsdCBvZiB0aGUgZmluaXNoZWQgZGVsZWdhdGUgdG8gdGhlIHRlbXBvcmFyeVxuICAgICAgLy8gdmFyaWFibGUgc3BlY2lmaWVkIGJ5IGRlbGVnYXRlLnJlc3VsdE5hbWUgKHNlZSBkZWxlZ2F0ZVlpZWxkKS5cbiAgICAgIGNvbnRleHRbZGVsZWdhdGUucmVzdWx0TmFtZV0gPSBpbmZvLnZhbHVlO1xuXG4gICAgICAvLyBSZXN1bWUgZXhlY3V0aW9uIGF0IHRoZSBkZXNpcmVkIGxvY2F0aW9uIChzZWUgZGVsZWdhdGVZaWVsZCkuXG4gICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuXG4gICAgICAvLyBJZiBjb250ZXh0Lm1ldGhvZCB3YXMgXCJ0aHJvd1wiIGJ1dCB0aGUgZGVsZWdhdGUgaGFuZGxlZCB0aGVcbiAgICAgIC8vIGV4Y2VwdGlvbiwgbGV0IHRoZSBvdXRlciBnZW5lcmF0b3IgcHJvY2VlZCBub3JtYWxseS4gSWZcbiAgICAgIC8vIGNvbnRleHQubWV0aG9kIHdhcyBcIm5leHRcIiwgZm9yZ2V0IGNvbnRleHQuYXJnIHNpbmNlIGl0IGhhcyBiZWVuXG4gICAgICAvLyBcImNvbnN1bWVkXCIgYnkgdGhlIGRlbGVnYXRlIGl0ZXJhdG9yLiBJZiBjb250ZXh0Lm1ldGhvZCB3YXNcbiAgICAgIC8vIFwicmV0dXJuXCIsIGFsbG93IHRoZSBvcmlnaW5hbCAucmV0dXJuIGNhbGwgdG8gY29udGludWUgaW4gdGhlXG4gICAgICAvLyBvdXRlciBnZW5lcmF0b3IuXG4gICAgICBpZiAoY29udGV4dC5tZXRob2QgIT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgY29udGV4dC5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgY29udGV4dC5hcmcgPSB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmUteWllbGQgdGhlIHJlc3VsdCByZXR1cm5lZCBieSB0aGUgZGVsZWdhdGUgbWV0aG9kLlxuICAgICAgcmV0dXJuIGluZm87XG4gICAgfVxuXG4gICAgLy8gVGhlIGRlbGVnYXRlIGl0ZXJhdG9yIGlzIGZpbmlzaGVkLCBzbyBmb3JnZXQgaXQgYW5kIGNvbnRpbnVlIHdpdGhcbiAgICAvLyB0aGUgb3V0ZXIgZ2VuZXJhdG9yLlxuICAgIGNvbnRleHQuZGVsZWdhdGUgPSBudWxsO1xuICAgIHJldHVybiBDb250aW51ZVNlbnRpbmVsO1xuICB9XG5cbiAgLy8gRGVmaW5lIEdlbmVyYXRvci5wcm90b3R5cGUue25leHQsdGhyb3cscmV0dXJufSBpbiB0ZXJtcyBvZiB0aGVcbiAgLy8gdW5pZmllZCAuX2ludm9rZSBoZWxwZXIgbWV0aG9kLlxuICBkZWZpbmVJdGVyYXRvck1ldGhvZHMoR3ApO1xuXG4gIGRlZmluZShHcCwgdG9TdHJpbmdUYWdTeW1ib2wsIFwiR2VuZXJhdG9yXCIpO1xuXG4gIC8vIEEgR2VuZXJhdG9yIHNob3VsZCBhbHdheXMgcmV0dXJuIGl0c2VsZiBhcyB0aGUgaXRlcmF0b3Igb2JqZWN0IHdoZW4gdGhlXG4gIC8vIEBAaXRlcmF0b3IgZnVuY3Rpb24gaXMgY2FsbGVkIG9uIGl0LiBTb21lIGJyb3dzZXJzJyBpbXBsZW1lbnRhdGlvbnMgb2YgdGhlXG4gIC8vIGl0ZXJhdG9yIHByb3RvdHlwZSBjaGFpbiBpbmNvcnJlY3RseSBpbXBsZW1lbnQgdGhpcywgY2F1c2luZyB0aGUgR2VuZXJhdG9yXG4gIC8vIG9iamVjdCB0byBub3QgYmUgcmV0dXJuZWQgZnJvbSB0aGlzIGNhbGwuIFRoaXMgZW5zdXJlcyB0aGF0IGRvZXNuJ3QgaGFwcGVuLlxuICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL2lzc3Vlcy8yNzQgZm9yIG1vcmUgZGV0YWlscy5cbiAgR3BbaXRlcmF0b3JTeW1ib2xdID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG5cbiAgR3AudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gXCJbb2JqZWN0IEdlbmVyYXRvcl1cIjtcbiAgfTtcblxuICBmdW5jdGlvbiBwdXNoVHJ5RW50cnkobG9jcykge1xuICAgIHZhciBlbnRyeSA9IHsgdHJ5TG9jOiBsb2NzWzBdIH07XG5cbiAgICBpZiAoMSBpbiBsb2NzKSB7XG4gICAgICBlbnRyeS5jYXRjaExvYyA9IGxvY3NbMV07XG4gICAgfVxuXG4gICAgaWYgKDIgaW4gbG9jcykge1xuICAgICAgZW50cnkuZmluYWxseUxvYyA9IGxvY3NbMl07XG4gICAgICBlbnRyeS5hZnRlckxvYyA9IGxvY3NbM107XG4gICAgfVxuXG4gICAgdGhpcy50cnlFbnRyaWVzLnB1c2goZW50cnkpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVzZXRUcnlFbnRyeShlbnRyeSkge1xuICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uIHx8IHt9O1xuICAgIHJlY29yZC50eXBlID0gXCJub3JtYWxcIjtcbiAgICBkZWxldGUgcmVjb3JkLmFyZztcbiAgICBlbnRyeS5jb21wbGV0aW9uID0gcmVjb3JkO1xuICB9XG5cbiAgZnVuY3Rpb24gQ29udGV4dCh0cnlMb2NzTGlzdCkge1xuICAgIC8vIFRoZSByb290IGVudHJ5IG9iamVjdCAoZWZmZWN0aXZlbHkgYSB0cnkgc3RhdGVtZW50IHdpdGhvdXQgYSBjYXRjaFxuICAgIC8vIG9yIGEgZmluYWxseSBibG9jaykgZ2l2ZXMgdXMgYSBwbGFjZSB0byBzdG9yZSB2YWx1ZXMgdGhyb3duIGZyb21cbiAgICAvLyBsb2NhdGlvbnMgd2hlcmUgdGhlcmUgaXMgbm8gZW5jbG9zaW5nIHRyeSBzdGF0ZW1lbnQuXG4gICAgdGhpcy50cnlFbnRyaWVzID0gW3sgdHJ5TG9jOiBcInJvb3RcIiB9XTtcbiAgICB0cnlMb2NzTGlzdC5mb3JFYWNoKHB1c2hUcnlFbnRyeSwgdGhpcyk7XG4gICAgdGhpcy5yZXNldCh0cnVlKTtcbiAgfVxuXG4gIGV4cG9ydHMua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBleHBvcnRzLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKHNraXBUZW1wUmVzZXQpIHtcbiAgICAgIHRoaXMucHJldiA9IDA7XG4gICAgICB0aGlzLm5leHQgPSAwO1xuICAgICAgLy8gUmVzZXR0aW5nIGNvbnRleHQuX3NlbnQgZm9yIGxlZ2FjeSBzdXBwb3J0IG9mIEJhYmVsJ3NcbiAgICAgIC8vIGZ1bmN0aW9uLnNlbnQgaW1wbGVtZW50YXRpb24uXG4gICAgICB0aGlzLnNlbnQgPSB0aGlzLl9zZW50ID0gdW5kZWZpbmVkO1xuICAgICAgdGhpcy5kb25lID0gZmFsc2U7XG4gICAgICB0aGlzLmRlbGVnYXRlID0gbnVsbDtcblxuICAgICAgdGhpcy5tZXRob2QgPSBcIm5leHRcIjtcbiAgICAgIHRoaXMuYXJnID0gdW5kZWZpbmVkO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgaWYgKCFza2lwVGVtcFJlc2V0KSB7XG4gICAgICAgIGZvciAodmFyIG5hbWUgaW4gdGhpcykge1xuICAgICAgICAgIC8vIE5vdCBzdXJlIGFib3V0IHRoZSBvcHRpbWFsIG9yZGVyIG9mIHRoZXNlIGNvbmRpdGlvbnM6XG4gICAgICAgICAgaWYgKG5hbWUuY2hhckF0KDApID09PSBcInRcIiAmJlxuICAgICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCBuYW1lKSAmJlxuICAgICAgICAgICAgICAhaXNOYU4oK25hbWUuc2xpY2UoMSkpKSB7XG4gICAgICAgICAgICB0aGlzW25hbWVdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG5cbiAgICAgICAgaWYgKGNhdWdodCkge1xuICAgICAgICAgIC8vIElmIHRoZSBkaXNwYXRjaGVkIGV4Y2VwdGlvbiB3YXMgY2F1Z2h0IGJ5IGEgY2F0Y2ggYmxvY2ssXG4gICAgICAgICAgLy8gdGhlbiBsZXQgdGhhdCBjYXRjaCBibG9jayBoYW5kbGUgdGhlIGV4Y2VwdGlvbiBub3JtYWxseS5cbiAgICAgICAgICBjb250ZXh0Lm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICAgIGNvbnRleHQuYXJnID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuICEhIGNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPD0gZmluYWxseUVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgLy8gSWdub3JlIHRoZSBmaW5hbGx5IGVudHJ5IGlmIGNvbnRyb2wgaXMgbm90IGp1bXBpbmcgdG8gYVxuICAgICAgICAvLyBsb2NhdGlvbiBvdXRzaWRlIHRoZSB0cnkvY2F0Y2ggYmxvY2suXG4gICAgICAgIGZpbmFsbHlFbnRyeSA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHZhciByZWNvcmQgPSBmaW5hbGx5RW50cnkgPyBmaW5hbGx5RW50cnkuY29tcGxldGlvbiA6IHt9O1xuICAgICAgcmVjb3JkLnR5cGUgPSB0eXBlO1xuICAgICAgcmVjb3JkLmFyZyA9IGFyZztcblxuICAgICAgaWYgKGZpbmFsbHlFbnRyeSkge1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwibmV4dFwiO1xuICAgICAgICB0aGlzLm5leHQgPSBmaW5hbGx5RW50cnkuZmluYWxseUxvYztcbiAgICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzLmNvbXBsZXRlKHJlY29yZCk7XG4gICAgfSxcblxuICAgIGNvbXBsZXRlOiBmdW5jdGlvbihyZWNvcmQsIGFmdGVyTG9jKSB7XG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICB0aHJvdyByZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgIHJlY29yZC50eXBlID09PSBcImNvbnRpbnVlXCIpIHtcbiAgICAgICAgdGhpcy5uZXh0ID0gcmVjb3JkLmFyZztcbiAgICAgIH0gZWxzZSBpZiAocmVjb3JkLnR5cGUgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgdGhpcy5ydmFsID0gdGhpcy5hcmcgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm1ldGhvZCA9IFwicmV0dXJuXCI7XG4gICAgICAgIHRoaXMubmV4dCA9IFwiZW5kXCI7XG4gICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcIm5vcm1hbFwiICYmIGFmdGVyTG9jKSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGFmdGVyTG9jO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgZmluaXNoOiBmdW5jdGlvbihmaW5hbGx5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LmZpbmFsbHlMb2MgPT09IGZpbmFsbHlMb2MpIHtcbiAgICAgICAgICB0aGlzLmNvbXBsZXRlKGVudHJ5LmNvbXBsZXRpb24sIGVudHJ5LmFmdGVyTG9jKTtcbiAgICAgICAgICByZXNldFRyeUVudHJ5KGVudHJ5KTtcbiAgICAgICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG5cbiAgICBcImNhdGNoXCI6IGZ1bmN0aW9uKHRyeUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IHRyeUxvYykge1xuICAgICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuICAgICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgICAgICB2YXIgdGhyb3duID0gcmVjb3JkLmFyZztcbiAgICAgICAgICAgIHJlc2V0VHJ5RW50cnkoZW50cnkpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGhyb3duO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFRoZSBjb250ZXh0LmNhdGNoIG1ldGhvZCBtdXN0IG9ubHkgYmUgY2FsbGVkIHdpdGggYSBsb2NhdGlvblxuICAgICAgLy8gYXJndW1lbnQgdGhhdCBjb3JyZXNwb25kcyB0byBhIGtub3duIGNhdGNoIGJsb2NrLlxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaWxsZWdhbCBjYXRjaCBhdHRlbXB0XCIpO1xuICAgIH0sXG5cbiAgICBkZWxlZ2F0ZVlpZWxkOiBmdW5jdGlvbihpdGVyYWJsZSwgcmVzdWx0TmFtZSwgbmV4dExvYykge1xuICAgICAgdGhpcy5kZWxlZ2F0ZSA9IHtcbiAgICAgICAgaXRlcmF0b3I6IHZhbHVlcyhpdGVyYWJsZSksXG4gICAgICAgIHJlc3VsdE5hbWU6IHJlc3VsdE5hbWUsXG4gICAgICAgIG5leHRMb2M6IG5leHRMb2NcbiAgICAgIH07XG5cbiAgICAgIGlmICh0aGlzLm1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICB0aGlzLmFyZyA9IHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFJlZ2FyZGxlc3Mgb2Ygd2hldGhlciB0aGlzIHNjcmlwdCBpcyBleGVjdXRpbmcgYXMgYSBDb21tb25KUyBtb2R1bGVcbiAgLy8gb3Igbm90LCByZXR1cm4gdGhlIHJ1bnRpbWUgb2JqZWN0IHNvIHRoYXQgd2UgY2FuIGRlY2xhcmUgdGhlIHZhcmlhYmxlXG4gIC8vIHJlZ2VuZXJhdG9yUnVudGltZSBpbiB0aGUgb3V0ZXIgc2NvcGUsIHdoaWNoIGFsbG93cyB0aGlzIG1vZHVsZSB0byBiZVxuICAvLyBpbmplY3RlZCBlYXNpbHkgYnkgYGJpbi9yZWdlbmVyYXRvciAtLWluY2x1ZGUtcnVudGltZSBzY3JpcHQuanNgLlxuICByZXR1cm4gZXhwb3J0cztcblxufShcbiAgLy8gSWYgdGhpcyBzY3JpcHQgaXMgZXhlY3V0aW5nIGFzIGEgQ29tbW9uSlMgbW9kdWxlLCB1c2UgbW9kdWxlLmV4cG9ydHNcbiAgLy8gYXMgdGhlIHJlZ2VuZXJhdG9yUnVudGltZSBuYW1lc3BhY2UuIE90aGVyd2lzZSBjcmVhdGUgYSBuZXcgZW1wdHlcbiAgLy8gb2JqZWN0LiBFaXRoZXIgd2F5LCB0aGUgcmVzdWx0aW5nIG9iamVjdCB3aWxsIGJlIHVzZWQgdG8gaW5pdGlhbGl6ZVxuICAvLyB0aGUgcmVnZW5lcmF0b3JSdW50aW1lIHZhcmlhYmxlIGF0IHRoZSB0b3Agb2YgdGhpcyBmaWxlLlxuICB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiID8gbW9kdWxlLmV4cG9ydHMgOiB7fVxuKSk7XG5cbnRyeSB7XG4gIHJlZ2VuZXJhdG9yUnVudGltZSA9IHJ1bnRpbWU7XG59IGNhdGNoIChhY2NpZGVudGFsU3RyaWN0TW9kZSkge1xuICAvLyBUaGlzIG1vZHVsZSBzaG91bGQgbm90IGJlIHJ1bm5pbmcgaW4gc3RyaWN0IG1vZGUsIHNvIHRoZSBhYm92ZVxuICAvLyBhc3NpZ25tZW50IHNob3VsZCBhbHdheXMgd29yayB1bmxlc3Mgc29tZXRoaW5nIGlzIG1pc2NvbmZpZ3VyZWQuIEp1c3RcbiAgLy8gaW4gY2FzZSBydW50aW1lLmpzIGFjY2lkZW50YWxseSBydW5zIGluIHN0cmljdCBtb2RlLCB3ZSBjYW4gZXNjYXBlXG4gIC8vIHN0cmljdCBtb2RlIHVzaW5nIGEgZ2xvYmFsIEZ1bmN0aW9uIGNhbGwuIFRoaXMgY291bGQgY29uY2VpdmFibHkgZmFpbFxuICAvLyBpZiBhIENvbnRlbnQgU2VjdXJpdHkgUG9saWN5IGZvcmJpZHMgdXNpbmcgRnVuY3Rpb24sIGJ1dCBpbiB0aGF0IGNhc2VcbiAgLy8gdGhlIHByb3BlciBzb2x1dGlvbiBpcyB0byBmaXggdGhlIGFjY2lkZW50YWwgc3RyaWN0IG1vZGUgcHJvYmxlbS4gSWZcbiAgLy8geW91J3ZlIG1pc2NvbmZpZ3VyZWQgeW91ciBidW5kbGVyIHRvIGZvcmNlIHN0cmljdCBtb2RlIGFuZCBhcHBsaWVkIGFcbiAgLy8gQ1NQIHRvIGZvcmJpZCBGdW5jdGlvbiwgYW5kIHlvdSdyZSBub3Qgd2lsbGluZyB0byBmaXggZWl0aGVyIG9mIHRob3NlXG4gIC8vIHByb2JsZW1zLCBwbGVhc2UgZGV0YWlsIHlvdXIgdW5pcXVlIHByZWRpY2FtZW50IGluIGEgR2l0SHViIGlzc3VlLlxuICBGdW5jdGlvbihcInJcIiwgXCJyZWdlbmVyYXRvclJ1bnRpbWUgPSByXCIpKHJ1bnRpbWUpO1xufVxuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwiY29uc3Qgc3RvcmFnZSA9IHJlcXVpcmUoJy4vdXRpbHMvbG9jYWxTdG9yYWdlJylcbmltcG9ydCB7ZXh0ZW5zaW9uQXBpfSBmcm9tIFwiLi91dGlscy9leHRlbnNpb25BcGlcIlxubGV0IFN0b3JhZ2UgPSBuZXcgc3RvcmFnZSgpXG5nbG9iYWwuZGlzayA9IFN0b3JhZ2VcblxubGV0IHVzZXIgPSB7XG4gICAgZ2VuZXNpczp7XG4gICAgICAgIHB1YmtleTpcbiAgICAgICAgICAgIFwiMDI5ZGQyMjJlZWRkZDVjMzM0MGU4ZDQ2YWUwYTIyZTJjOGUzMDFiZmVlNDkwM2JjZjhjODk5NzY2YzhjZWIzYTdkXCIsXG4gICAgICAgIHBydmtleTpcbiAgICAgICAgICAgIFwiOWQzY2UxZjNlYzk5YzI2YzJlNjRlMDZkNzc1YTUyNTc4YjAwOTgyYmYxNzQ4ZTJlMjk3MmY3MzczNjQ0YWM1Y1wiXG4gICAgfSxcbiAgICBBbGljZTpcbiAgICAgICAge1xuICAgICAgICAgICAgcHJ2a2V5OlxuICAgICAgICAgICAgICAgICczM2QyM2NhN2QzMDYwMjZlYWE2OGQ4ODY0ZGQzODcxNTg0ZWQxNWNjMjA4MDMwNzdiZWE3MTgzMWVlNTQ5MmNjJyxcbiAgICAgICAgICAgIHB1YmtleTpcbiAgICAgICAgICAgICAgICAnMDIyODMzM2I5OWE0ZDEzMTJmMzE4NTFkYWQxYzMyYjUzMGQ1ZWU2MTUzNDk1MWViZTY1MGM2NjM5MGZkY2ZmZTk4J1xuICAgICAgICB9LFxuICAgIEJvYjpcbiAgICAgICAge1xuICAgICAgICAgICAgcHJ2a2V5OlxuICAgICAgICAgICAgICAgICc2NzdiNWMwMzQwYzFjZjFjYWM0MzU4YTUxN2ZjZjEwMzJjODAxMGU3OTdmMmNhODc3MjhlMjljYTYzOGI1OTE0JyxcbiAgICAgICAgICAgIHB1YmtleTpcbiAgICAgICAgICAgICAgICAnMDMwYjEzYTEzMjcyYjY2M2RhMzM0Njg5MjkxMTBjNzUwNWY3MDBiOTU1ZTFhZWU3NTRjY2UxN2Q2NmEzZmRlMjAwJ1xuICAgICAgICB9LFxuICAgIEV2YTp7XG4gICAgICAgIHBydmtleTpcbiAgICAgICAgICAgICczZjdjOGQyMzY2NzhkNDVjNDQzN2IzM2Q5MjA2ZGM3NjI2ZTRjNjFkYzY0NGNhMDIzNTBlYzgwZTljOTA4ZmRkJyxcbiAgICAgICAgcHVia2V5OlxuICAgICAgICAgICAgJzAyYjQxMzA5OTA5YTBjNDAxYzM4ZTJkZDczNGE2ZDdmMTM3MzNkOGM1YmZhNjg2MzkwNDdiMTg5ZmI3OGUwODU1ZCcgfVxufVxuZ2xvYmFsLnVzZXJzID0gdXNlclxubGV0IHBvcnRzID0ge31cblxuZnVuY3Rpb24gc2V0dXBBcHAoKSB7XG4gICAgY29uc29sZS5sb2coJ2JhY2tncm91bmQgcmVhZHknKVxuICAgIGV4dGVuc2lvbkFwaS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtc2dIYW5kbGVyKVxuICAgIGV4dGVuc2lvbkFwaS5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihjb25uZWN0SGFuZGxlcilcbiAgICB0YXNrQ291bnRlcigpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1zZ0hhbmRsZXIobXNnLHNlbmRlciwgc2VuZFJlc3BvbnNlKXtcbiAgICBjb25zb2xlLmxvZyhtc2cpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1zZ0Nvbm5lY3RIYW5kbGVyKG1zZyxzZW5kZXIpe1xuICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICBsZXQgYW5zd2VyID0gJydcbiAgICBpZihtc2cudGFza0lkKXtcbiAgICAgICAgU3RvcmFnZS50YXNrLnNldFRhc2sobXNnLnRhc2tJZCwge2RhdGE6bXNnLmRhdGEsIHR5cGU6bXNnLnR5cGUsIGNiOm1zZy5jYn0pXG4gICAgICAgIGlmKG1zZy50eXBlID09PSAnYmFsYW5jZU9mJyl7XG4gICAgICAgICAgICB0YXNrSGFuZGxlcihtc2cudGFza0lkKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHRhc2tDb3VudGVyKClcbiAgICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgICBjb25zb2xlLmxvZyhtc2cpXG4gICAgfVxuXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1zZ1BvcHVwSGFuZGxlcihtc2csIHNlbmRlcil7XG4gICAgY29uc29sZS5sb2coe21zZywgc2VuZGVyfSlcbiAgICBpZihtc2cucG9wdXApe1xuICAgICAgICBpZihtc2cudHlwZSA9PT0ndHgnKXtcbiAgICAgICAgICAgIGxldCB1c2VyID0gU3RvcmFnZS51c2VyLmxvYWRVc2VyKClcbiAgICAgICAgICAgIGxldCBidWYgPSBFTlFXZWIuTmV0LnByb3ZpZGVyXG4gICAgICAgICAgICBFTlFXZWIuTmV0LnByb3ZpZGVyID0gdXNlci5uZXRcbiAgICAgICAgICAgIGxldCB3YWxsZXQgPSB7cHVia2V5OnVzZXIucHVibGljS2V5LCBwcnZrZXk6dXNlci5wcml2YXRlS2V5fVxuICAgICAgICAgICAgbGV0IGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgZnJvbTp3YWxsZXQsXG4gICAgICAgICAgICAgICAgdG86bXNnLmRhdGEudG8sXG4gICAgICAgICAgICAgICAgYW1vdW50Ok51bWJlcihtc2cuZGF0YS5hbW91bnQpKjFlMTBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKEVOUVdlYi5OZXQucHJvdmlkZXIpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh7ZGF0YX0pXG4gICAgICAgICAgICBsZXQgYW5zd2VyID0gYXdhaXQgRU5RV2ViLk5ldC5wb3N0LnR4X2ZlZV9vZmYoZGF0YSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGFuc3dlcilcbiAgICAgICAgICAgIEVOUVdlYi5OZXQucHJvdmlkZXIgPSBidWZcbiAgICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgICBpZihtc2cuYWdyZWUgJiYgbXNnLnRhc2tJZCl7XG4gICAgICAgICAgICB0YXNrSGFuZGxlcihtc2cudGFza0lkKVxuICAgICAgICAgICAgdGFza0NvdW50ZXIoKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGlmKG1zZy50YXNrSWQpe1xuICAgICAgICAgICAgICAgIC8vIFN0b3JhZ2UudGFzay5yZW1vdmVUYXNrKG1zZy50YXNrSWQpXG4gICAgICAgICAgICAgICAgcmVqZWN0VGFza0hhbmRsZXIobXNnLnRhc2tJZClcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVtb3ZlZCcpXG4gICAgICAgICAgICAgICAgdGFza0NvdW50ZXIoKVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cblxuZnVuY3Rpb24gbGlzdFBvcnRzKCl7XG4gICAgY29uc29sZS5sb2cocG9ydHMpXG4gICAgZ2xvYmFsLnBvcnRzID0gcG9ydHNcbn1cbmZ1bmN0aW9uIGRpc2Nvbm5lY3RIYW5kbGVyKHBvcnQpe1xuICAgIGNvbnNvbGUubG9nKCdkaXNjb25uZWN0ZWQ6ICcgKyBwb3J0Lm5hbWUpXG59XG5mdW5jdGlvbiBjb25uZWN0Q29udHJvbGxlcihwb3J0KXtcbiAgICBpZihwb3J0c1twb3J0Lm5hbWVdKXtcbiAgICAgICAgcG9ydHNbcG9ydC5uYW1lXS5kaXNjb25uZWN0KClcbiAgICAgICAgcG9ydHNbcG9ydC5uYW1lXSA9IHBvcnRcbiAgICB9ZWxzZXtcbiAgICAgICAgcG9ydHNbcG9ydC5uYW1lXSA9IHBvcnRcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRhc2tDb3VudGVyKCl7XG4gICAgbGV0IHRhc2tzID0gU3RvcmFnZS50YXNrLmxvYWRUYXNrKClcbiAgICBsZXQgaWRzID0gT2JqZWN0LmtleXModGFza3MpXG4gICAgZXh0ZW5zaW9uQXBpLmJyb3dzZXJBY3Rpb24uc2V0QmFkZ2VUZXh0KHt0ZXh0OmAke2lkcy5sZW5ndGh9YH0pXG59XG5cbmdsb2JhbC5jb3VudGVyVGFzayA9IHRhc2tDb3VudGVyXG5cbmFzeW5jIGZ1bmN0aW9uIHRhc2tIYW5kbGVyKHRhc2tJZCl7XG4gICAgbGV0IHRhc2sgPSBTdG9yYWdlLnRhc2suZ2V0VGFzayh0YXNrSWQpXG4gICAgY29uc29sZS5sb2codGFzaylcbiAgICBsZXQgYWNjID0gU3RvcmFnZS51c2VyLmxvYWRVc2VyKClcbiAgICBsZXQgZGF0YSA9ICcnO1xuICAgIGxldCB3YWxsZXQgPSB7cHVia2V5OmFjYy5wdWJsaWNLZXksIHBydmtleTphY2MucHJpdmF0ZUtleX07XG4gICAgc3dpdGNoKHRhc2sudHlwZSl7XG4gICAgICAgIGNhc2UgJ2VuYWJsZSc6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZW5hYmxlLiByZXR1cm5lZDogJywgYWNjKVxuICAgICAgICAgICAgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICBwdWJrZXk6YWNjLnB1YmxpY0tleSxcbiAgICAgICAgICAgICAgICBuZXQ6YWNjLm5ldCxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvcnRzLmNvbnRlbnQucG9zdE1lc3NhZ2Uoe2RhdGE6SlNPTi5zdHJpbmdpZnkoZGF0YSksdGFza0lkOnRhc2tJZCwgY2I6dGFzay5jYn0pO1xuICAgICAgICAgICAgU3RvcmFnZS50YXNrLnJlbW92ZVRhc2sodGFza0lkKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAndHgnOlxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3R4IGhhbmRsZXIgd29yayEnKVxuICAgICAgICAgICAgZGF0YSA9IHRhc2suZGF0YVxuICAgICAgICAgICAgbGV0IGJ1ZiA9IEVOUVdlYi5OZXQucHJvdmlkZXJcbiAgICAgICAgICAgIEVOUVdlYi5OZXQucHJvdmlkZXIgPSBkYXRhLm5ldCB8fCBhY2MubmV0XG4gICAgICAgICAgICBkYXRhLmZyb20gPSB3YWxsZXRcbiAgICAgICAgICAgIGRhdGEuYW1vdW50ID0gTnVtYmVyKGRhdGEudmFsdWUpXG4gICAgICAgICAgICBkYXRhLnZhbHVlID0gJydcbiAgICAgICAgICAgIGRhdGEgPSBhd2FpdCBFTlFXZWIuTmV0LnBvc3QudHhfZmVlX29mZihkYXRhKVxuICAgICAgICAgICAgcG9ydHMuY29udGVudC5wb3N0TWVzc2FnZSh7ZGF0YTpKU09OLnN0cmluZ2lmeShkYXRhKSx0YXNrSWQ6dGFza0lkLCBjYjp0YXNrLmNifSlcbiAgICAgICAgICAgIFN0b3JhZ2UudGFzay5yZW1vdmVUYXNrKHRhc2tJZClcbiAgICAgICAgICAgIEVOUVdlYi5OZXQucHJvdmlkZXIgPSBidWZcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ2JhbGFuY2VPZic6XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnIGJhbGFuY2VPZiBoYW5kbGVyIHdvcmshJylcbiAgICAgICAgICAgIGRhdGEgPSB0YXNrLmRhdGFcbiAgICAgICAgICAgIEVOUVdlYi5OZXQucHJvdmlkZXIgPSBkYXRhLm5ldCB8fCBhY2MubmV0XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0YXNrLmRhdGEsIEVOUVdlYi5OZXQucHJvdmlkZXIpXG4gICAgICAgICAgICBkYXRhID0gYXdhaXQgRU5RV2ViLk5ldC5nZXQuZ2V0QmFsYW5jZSh3YWxsZXQucHVia2V5LCBkYXRhLnRva2VuSGFzaClcbiAgICAgICAgICAgICAgICAuY2F0Y2goZXJyPT57XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycil9KVxuICAgICAgICAgICAgcG9ydHMuY29udGVudC5wb3N0TWVzc2FnZSh7ZGF0YTpKU09OLnN0cmluZ2lmeShkYXRhKSx0YXNrSWQ6dGFza0lkLCBjYjp0YXNrLmNifSlcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHtkYXRhOkpTT04uc3RyaW5naWZ5KGRhdGEpLHRhc2tJZDp0YXNrSWQsIGNiOnRhc2suY2J9KVxuICAgICAgICAgICAgU3RvcmFnZS50YXNrLnJlbW92ZVRhc2sodGFza0lkKVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGJyZWFrXG4gICAgfVxufVxuXG5mdW5jdGlvbiByZWplY3RUYXNrSGFuZGxlcih0YXNrSWQpe1xuICAgIGxldCB0YXNrID0gU3RvcmFnZS50YXNrLmdldFRhc2sodGFza0lkKVxuICAgIGxldCBkYXRhID0ge3JlamVjdDp0cnVlfVxuICAgIHBvcnRzLmNvbnRlbnQucG9zdE1lc3NhZ2Uoe2RhdGE6SlNPTi5zdHJpbmdpZnkoZGF0YSksdGFza0lkOnRhc2tJZCwgY2I6dGFzay5jYn0pXG4gICAgU3RvcmFnZS50YXNrLnJlbW92ZVRhc2sodGFza0lkKVxufVxuXG4vL1RPRE8gYWRkIGNsZWFuZXIgY29ubmVjdGlvbiBsaXN0XG5hc3luYyBmdW5jdGlvbiBjb25uZWN0SGFuZGxlcihwb3J0KXtcbiAgICBhd2FpdCBjb25uZWN0Q29udHJvbGxlcihwb3J0KVxuICAgIHN3aXRjaCAocG9ydC5uYW1lKXtcbiAgICAgICAgY2FzZSAnY29udGVudCc6XG4gICAgICAgICAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtc2dDb25uZWN0SGFuZGxlcilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3BvcHVwJzpcbiAgICAgICAgICAgIHBvcnQub25NZXNzYWdlLmFkZExpc3RlbmVyKG1zZ1BvcHVwSGFuZGxlcilcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVha1xuICAgIH1cbiAgICBsaXN0UG9ydHMoKVxufVxuXG5zZXR1cEFwcCgpOyIsImV4cG9ydCBjb25zdCBleHRlbnNpb25BcGkgPSBnbG9iYWwuY2hyb21lICE9PSAndW5kZWZpbmVkJ1xuICAgID8gZ2xvYmFsLmNocm9tZVxuICAgIDogZ2xvYmFsLmJyb3dzZXIiLCJmdW5jdGlvbiBsb2FkVGFzaygpIHtcbiAgICBsZXQgdGFzayA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdUYXNrJylcbiAgICBpZiAoIXRhc2spIHtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICAgIHRhc2sgPSBKU09OLnBhcnNlKHRhc2spXG4gICAgcmV0dXJuIHRhc2tcbn1cblxuZnVuY3Rpb24gY2xlYXJUYXNrcygpIHtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ1Rhc2snKVxufVxuXG5mdW5jdGlvbiBnZXRUYXNrKGtleSkge1xuICAgIGxldCB0YXNrID0gbG9hZFRhc2soKVxuICAgIHJldHVybiB0YXNrW2tleV1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlVGFzayhrZXkpIHtcbiAgICBsZXQgdGFzayA9IGxvYWRUYXNrKClcbiAgICBkZWxldGUgdGFza1trZXldXG4gICAgdGFzayA9IEpTT04uc3RyaW5naWZ5KHRhc2spXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1Rhc2snLCB0YXNrKVxuICAgIHJldHVybiB0YXNrXG59XG5cbmZ1bmN0aW9uIHNldFRhc2soa2V5LCB2YWx1ZSkge1xuICAgIGxldCB0YXNrcyA9IGxvYWRUYXNrKClcbiAgICB0YXNrc1trZXldID0gdmFsdWVcbiAgICB0YXNrcyA9IEpTT04uc3RyaW5naWZ5KHRhc2tzKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdUYXNrJywgdGFza3MpXG4gICAgcmV0dXJuIHRhc2tzXG59XG5cbmZ1bmN0aW9uIGxvYWRVc2VyKCkge1xuICAgIGxldCB1c2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1VzZXInKVxuICAgIGlmICghdXNlcikge1xuICAgICAgICByZXR1cm4ge31cbiAgICB9XG4gICAgdXNlciA9IEpTT04ucGFyc2UodXNlcilcbiAgICByZXR1cm4gdXNlclxufVxuXG5mdW5jdGlvbiBhZGRVc2VyKHB1YmxpY0tleSwgcHJpdmF0ZUtleSwgbmV0KSB7XG4gICAgbGV0IHVzZXIgPSB7XG4gICAgICAgIHB1YmxpY0tleTogcHVibGljS2V5LFxuICAgICAgICBwcml2YXRlS2V5OiBwcml2YXRlS2V5LFxuICAgICAgICBuZXQ6IG5ldFxuICAgIH1cbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVXNlcicsIEpTT04uc3RyaW5naWZ5KHVzZXIpKVxuICAgIHJldHVybiB1c2VyXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVVzZXIoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1VzZXInLCAnJylcbn1cblxuZnVuY3Rpb24gc2V0TWFpblVzZXIobmFtZSkge1xuICAgIGxldCB1c2VyID0gbG9hZFVzZXIoKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdNYWluQWNjJywgSlNPTi5zdHJpbmdpZnkodXNlcltuYW1lXSkpXG4gICAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gdW5zZXRNYWluVXNlcigpIHtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnTWFpbkFjYycpXG4gICAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gZ2V0TWFpblVzZXIoKSB7XG4gICAgbGV0IGFjYyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdNYWluQWNjJylcbiAgICByZXR1cm4gYWNjXG59XG5cbmZ1bmN0aW9uIGdldFVzZXIobmFtZSkge1xuICAgIGxldCB1c2VyID0gbG9hZFVzZXIoKVxuICAgIHJldHVybiB1c2VyW25hbWVdXG59XG5cbmZ1bmN0aW9uIGNsZWFyVXNlcnMoKSB7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ1VzZXInKVxufVxuXG5sZXQgc3RvcmFnZSA9IGZ1bmN0aW9uIFN0b3JhZ2UoKSB7XG5cbiAgICB0aGlzLnRhc2sgPSB7XG4gICAgICAgIGxvYWRUYXNrLFxuICAgICAgICBzZXRUYXNrLFxuICAgICAgICBnZXRUYXNrLFxuICAgICAgICByZW1vdmVUYXNrLFxuICAgICAgICBjbGVhclRhc2tzXG4gICAgfSxcbiAgICB0aGlzLnVzZXIgPSB7XG4gICAgICAgIGxvYWRVc2VyLFxuICAgICAgICBhZGRVc2VyLFxuICAgICAgICBnZXRVc2VyLFxuICAgICAgICByZW1vdmVVc2VyLFxuICAgICAgICBjbGVhclVzZXJzXG4gICAgfSxcbiAgICB0aGlzLm1haW5BY2MgPSB7XG4gICAgICAgIGdldDogZ2V0TWFpblVzZXIsXG4gICAgICAgIHNldDogc2V0TWFpblVzZXIsXG4gICAgICAgIHVuc2V0OiB1bnNldE1haW5Vc2VyXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JhZ2UiXSwic291cmNlUm9vdCI6IiJ9