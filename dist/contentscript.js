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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/contentscript.js");
/******/ })
/************************************************************************/
/******/ ({

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

/***/ "./src/contentscript.js":
/*!******************************!*\
  !*** ./src/contentscript.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_extensionApi__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/extensionApi */ "./src/utils/extensionApi.js");

var toBackground = {};
var pageToBack = {};
var taskId = [];

function setupConnection() {
  console.log('content ready'); // chrome.runtime.sendMessage({greeting: "Content ready"}, function(response) {});

  toBackground = chrome.runtime.connect({
    name: 'content'
  });
  toBackground.onMessage.addListener((msg, sender, sendResponse) => {
    var cb = taskId[msg.taskId];

    if (cb) {
      cb(msg);
      delete taskId[msg.taskId];
      return;
    }

    console.log(msg);
  });
}

function injectScript() {
  try {
    // inject in-page script
    let script = document.createElement('script');
    script.src = _utils_extensionApi__WEBPACK_IMPORTED_MODULE_0__["extensionApi"].extension.getURL('inpage.js');
    const container = document.head || document.documentElement;
    container.insertBefore(script, container.children[0]);

    script.onload = () => script.remove();
  } catch (e) {
    console.error('Injection failed.', e);
  }
}

async function eventHandler() {
  document.addEventListener('ENQConnect', e => {
    setupConnection();
    document.addEventListener('ENQContent', e => {
      let address = Math.random().toString(36);

      switch (e.detail.type) {
        case 'enable':
          taskId[address] = enable;
          break;

        case 'balanceOf':
          taskId[address] = balanceOf;
          break;

        case 'tx':
          taskId[address] = transaction;
          break;

        default:
          break;
      }

      toBackground.postMessage({
        type: e.detail.type,
        data: e.detail.data,
        taskId: address,
        cb: e.detail.cb
      });
    });
  });
}

function enable(msg) {
  injectCb(injectCodeGeneration(msg));
}

function balanceOf(msg) {
  injectCb(injectCodeGeneration(msg));
}

function transaction(msg) {
  injectCb(injectCodeGeneration(msg));
} //TODO check error in msg


function injectCodeGeneration(msg) {
  var code = '';

  if (msg.cb) {
    if (msg.cb.inText && msg.cb.id) {
      code = `
            document.getElementById('${msg.cb.id}').innerText = "${msg.data}"
            ENQWeb.Enq.cb = "${msg.data}"
            ENQWeb.Enq.ready = true
            `;
    } else if (msg.cb.inDoc && msg.cb.id) {
      code = `
            document.${msg.cb.id} = "${msg.data}"
            ENQWeb.Enq.cb = "${msg.data}"
            ENQWeb.Enq.ready = true
            `;
    } else if (msg.cb.inWin && msg.cb.id) {
      code = `
            window.${msg.cb.id} = "${msg.data}"
            ENQWeb.Enq.cb = "${msg.data}"
            ENQWeb.Enq.ready = true
            `;
    } else if (msg.cb.inSite && msg.cb.id) {
      code = `
            ${msg.cb.id}="${msg.data}"
            ENQWeb.Enq.cb = "${msg.data}"
            ENQWeb.Enq.ready = true
            `;
    } else {
      code = `
        document.getElementById('${msg.cb}').setAttribute('ENQ', '${msg.data}')
        ENQWeb.Enq.cb = "${msg.data}"
        ENQWeb.Enq.ready = true
        `;
    }
  } else {
    code = `
        ENQWeb.Enq.cb = "${msg.data}"
        ENQWeb.Enq.ready = true
        `;
  }

  return code;
}

function injectCb(code) {
  var script = document.createElement('script');
  script.textContent = code;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
} // setupConnection();


injectScript();
eventHandler();

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
const extensionApi = global.chrome !== 'undefined' ? global.chrome : global.browser;
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udGVudHNjcmlwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZXh0ZW5zaW9uQXBpLmpzIl0sIm5hbWVzIjpbInRvQmFja2dyb3VuZCIsInBhZ2VUb0JhY2siLCJ0YXNrSWQiLCJzZXR1cENvbm5lY3Rpb24iLCJjb25zb2xlIiwibG9nIiwiY2hyb21lIiwicnVudGltZSIsImNvbm5lY3QiLCJuYW1lIiwib25NZXNzYWdlIiwiYWRkTGlzdGVuZXIiLCJtc2ciLCJzZW5kZXIiLCJzZW5kUmVzcG9uc2UiLCJjYiIsImluamVjdFNjcmlwdCIsInNjcmlwdCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNyYyIsImV4dGVuc2lvbkFwaSIsImV4dGVuc2lvbiIsImdldFVSTCIsImNvbnRhaW5lciIsImhlYWQiLCJkb2N1bWVudEVsZW1lbnQiLCJpbnNlcnRCZWZvcmUiLCJjaGlsZHJlbiIsIm9ubG9hZCIsInJlbW92ZSIsImUiLCJlcnJvciIsImV2ZW50SGFuZGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRyZXNzIiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwiZGV0YWlsIiwidHlwZSIsImVuYWJsZSIsImJhbGFuY2VPZiIsInRyYW5zYWN0aW9uIiwicG9zdE1lc3NhZ2UiLCJkYXRhIiwiaW5qZWN0Q2IiLCJpbmplY3RDb2RlR2VuZXJhdGlvbiIsImNvZGUiLCJpblRleHQiLCJpZCIsImluRG9jIiwiaW5XaW4iLCJpblNpdGUiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwiZ2xvYmFsIiwiYnJvd3NlciJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtR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QUNBLFNBSlk7QUFLSDtBQUNKLEdBcENELE1Bb0NLO0FBQ0RHLFFBQUksR0FBSTtBQUNoQiwyQkFBMkJwQyxHQUFHLENBQUNpQyxJQUFLO0FBQ3BDO0FBQ0EsU0FIUTtBQUlIOztBQUNELFNBQU9HLElBQVA7QUFDSDs7QUFFRCxTQUFTRixRQUFULENBQWtCRSxJQUFsQixFQUF1QjtBQUNuQixNQUFJL0IsTUFBTSxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBYjtBQUNBRixRQUFNLENBQUNxQyxXQUFQLEdBQXFCTixJQUFyQjtBQUNBLEdBQUM5QixRQUFRLENBQUNPLElBQVQsSUFBZVAsUUFBUSxDQUFDUSxlQUF6QixFQUEwQzZCLFdBQTFDLENBQXNEdEMsTUFBdEQ7QUFDQUEsUUFBTSxDQUFDYSxNQUFQO0FBQ0gsQyxDQUVEOzs7QUFDQWQsWUFBWTtBQUNaaUIsWUFBWSxHOzs7Ozs7Ozs7Ozs7QUNsSVo7QUFBQTtBQUFPLE1BQU1aLFlBQVksR0FBR21DLE1BQU0sQ0FBQ2xELE1BQVAsS0FBa0IsV0FBbEIsR0FDdEJrRCxNQUFNLENBQUNsRCxNQURlLEdBRXRCa0QsTUFBTSxDQUFDQyxPQUZOLEMiLCJmaWxlIjoiY29udGVudHNjcmlwdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiLi9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29udGVudHNjcmlwdC5qc1wiKTtcbiIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbn0gY2F0Y2ggKGUpIHtcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcblx0aWYgKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpIGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcbiIsImltcG9ydCB7ZXh0ZW5zaW9uQXBpfSBmcm9tIFwiLi91dGlscy9leHRlbnNpb25BcGlcIjtcblxuXG5cbnZhciB0b0JhY2tncm91bmQgPSB7fVxudmFyIHBhZ2VUb0JhY2sgPSB7fVxudmFyIHRhc2tJZCA9IFtdXG5cblxuZnVuY3Rpb24gc2V0dXBDb25uZWN0aW9uKCl7XG4gICAgY29uc29sZS5sb2coJ2NvbnRlbnQgcmVhZHknKVxuXG4gICAgLy8gY2hyb21lLnJ1bnRpbWUuc2VuZE1lc3NhZ2Uoe2dyZWV0aW5nOiBcIkNvbnRlbnQgcmVhZHlcIn0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7fSk7XG4gICAgdG9CYWNrZ3JvdW5kID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7bmFtZTonY29udGVudCd9KVxuICAgIHRvQmFja2dyb3VuZC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZyxzZW5kZXIsIHNlbmRSZXNwb25zZSk9PntcbiAgICAgICAgdmFyIGNiID0gdGFza0lkW21zZy50YXNrSWRdXG4gICAgICAgIGlmKGNiKXtcbiAgICAgICAgICAgIGNiKG1zZylcbiAgICAgICAgICAgIGRlbGV0ZSB0YXNrSWRbbXNnLnRhc2tJZF1cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICB9KVxuXG59XG5cblxuZnVuY3Rpb24gaW5qZWN0U2NyaXB0KCl7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gaW5qZWN0IGluLXBhZ2Ugc2NyaXB0XG4gICAgICAgIGxldCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgc2NyaXB0LnNyYyA9IGV4dGVuc2lvbkFwaS5leHRlbnNpb24uZ2V0VVJMKCdpbnBhZ2UuanMnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoc2NyaXB0LCBjb250YWluZXIuY2hpbGRyZW5bMF0pO1xuICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4gc2NyaXB0LnJlbW92ZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignSW5qZWN0aW9uIGZhaWxlZC4nLCBlKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGV2ZW50SGFuZGxlcigpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdFTlFDb25uZWN0JywgKGUpPT57XG4gICAgICAgIHNldHVwQ29ubmVjdGlvbigpXG4gICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0VOUUNvbnRlbnQnLCAoZSk9PntcbiAgICAgICAgICAgIGxldCBhZGRyZXNzID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNilcbiAgICAgICAgICAgIHN3aXRjaCAoZS5kZXRhaWwudHlwZSl7XG4gICAgICAgICAgICAgICAgY2FzZSAnZW5hYmxlJzpcbiAgICAgICAgICAgICAgICAgICAgdGFza0lkW2FkZHJlc3NdID0gZW5hYmxlXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgY2FzZSAnYmFsYW5jZU9mJzpcbiAgICAgICAgICAgICAgICAgICAgdGFza0lkW2FkZHJlc3NdID0gYmFsYW5jZU9mXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgY2FzZSAndHgnOlxuICAgICAgICAgICAgICAgICAgICB0YXNrSWRbYWRkcmVzc10gPSB0cmFuc2FjdGlvblxuICAgICAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0b0JhY2tncm91bmQucG9zdE1lc3NhZ2Uoe3R5cGU6ZS5kZXRhaWwudHlwZSxkYXRhOmUuZGV0YWlsLmRhdGEsIHRhc2tJZDphZGRyZXNzLCBjYjplLmRldGFpbC5jYn0pXG4gICAgICAgIH0pXG4gICAgfSlcbn1cblxuZnVuY3Rpb24gZW5hYmxlKG1zZyl7XG4gICAgaW5qZWN0Q2IoaW5qZWN0Q29kZUdlbmVyYXRpb24obXNnKSlcbn1cbmZ1bmN0aW9uIGJhbGFuY2VPZihtc2cpe1xuICAgIGluamVjdENiKGluamVjdENvZGVHZW5lcmF0aW9uKG1zZykpXG59XG5mdW5jdGlvbiB0cmFuc2FjdGlvbihtc2cpe1xuICAgIGluamVjdENiKGluamVjdENvZGVHZW5lcmF0aW9uKG1zZykpXG59XG5cbi8vVE9ETyBjaGVjayBlcnJvciBpbiBtc2dcbmZ1bmN0aW9uIGluamVjdENvZGVHZW5lcmF0aW9uKG1zZyl7XG4gICAgdmFyIGNvZGUgPSAnJ1xuICAgIGlmKG1zZy5jYil7XG4gICAgICAgIGlmKG1zZy5jYi5pblRleHQgJiYgbXNnLmNiLmlkKXtcbiAgICAgICAgICAgIGNvZGUgPSBgXG4gICAgICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnJHttc2cuY2IuaWR9JykuaW5uZXJUZXh0ID0gXCIke21zZy5kYXRhfVwiXG4gICAgICAgICAgICBFTlFXZWIuRW5xLmNiID0gXCIke21zZy5kYXRhfVwiXG4gICAgICAgICAgICBFTlFXZWIuRW5xLnJlYWR5ID0gdHJ1ZVxuICAgICAgICAgICAgYFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobXNnLmNiLmluRG9jICYmIG1zZy5jYi5pZCl7XG4gICAgICAgICAgICBjb2RlPWBcbiAgICAgICAgICAgIGRvY3VtZW50LiR7bXNnLmNiLmlkfSA9IFwiJHttc2cuZGF0YX1cIlxuICAgICAgICAgICAgRU5RV2ViLkVucS5jYiA9IFwiJHttc2cuZGF0YX1cIlxuICAgICAgICAgICAgRU5RV2ViLkVucS5yZWFkeSA9IHRydWVcbiAgICAgICAgICAgIGBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKG1zZy5jYi5pbldpbiAmJiBtc2cuY2IuaWQpe1xuICAgICAgICAgICAgY29kZT1gXG4gICAgICAgICAgICB3aW5kb3cuJHttc2cuY2IuaWR9ID0gXCIke21zZy5kYXRhfVwiXG4gICAgICAgICAgICBFTlFXZWIuRW5xLmNiID0gXCIke21zZy5kYXRhfVwiXG4gICAgICAgICAgICBFTlFXZWIuRW5xLnJlYWR5ID0gdHJ1ZVxuICAgICAgICAgICAgYFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobXNnLmNiLmluU2l0ZSAmJiBtc2cuY2IuaWQpe1xuICAgICAgICAgICAgY29kZT1gXG4gICAgICAgICAgICAke21zZy5jYi5pZH09XCIke21zZy5kYXRhfVwiXG4gICAgICAgICAgICBFTlFXZWIuRW5xLmNiID0gXCIke21zZy5kYXRhfVwiXG4gICAgICAgICAgICBFTlFXZWIuRW5xLnJlYWR5ID0gdHJ1ZVxuICAgICAgICAgICAgYFxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBjb2RlID0gYFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnJHttc2cuY2J9Jykuc2V0QXR0cmlidXRlKCdFTlEnLCAnJHttc2cuZGF0YX0nKVxuICAgICAgICBFTlFXZWIuRW5xLmNiID0gXCIke21zZy5kYXRhfVwiXG4gICAgICAgIEVOUVdlYi5FbnEucmVhZHkgPSB0cnVlXG4gICAgICAgIGBcbiAgICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgICBjb2RlID0gYFxuICAgICAgICBFTlFXZWIuRW5xLmNiID0gXCIke21zZy5kYXRhfVwiXG4gICAgICAgIEVOUVdlYi5FbnEucmVhZHkgPSB0cnVlXG4gICAgICAgIGBcbiAgICB9XG4gICAgcmV0dXJuIGNvZGVcbn1cblxuZnVuY3Rpb24gaW5qZWN0Q2IoY29kZSl7XG4gICAgdmFyIHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgIHNjcmlwdC50ZXh0Q29udGVudCA9IGNvZGU7XG4gICAgKGRvY3VtZW50LmhlYWR8fGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkuYXBwZW5kQ2hpbGQoc2NyaXB0KTtcbiAgICBzY3JpcHQucmVtb3ZlKCk7XG59XG5cbi8vIHNldHVwQ29ubmVjdGlvbigpO1xuaW5qZWN0U2NyaXB0KCk7XG5ldmVudEhhbmRsZXIoKVxuXG5cblxuIiwiZXhwb3J0IGNvbnN0IGV4dGVuc2lvbkFwaSA9IGdsb2JhbC5jaHJvbWUgIT09ICd1bmRlZmluZWQnXG4gICAgPyBnbG9iYWwuY2hyb21lXG4gICAgOiBnbG9iYWwuYnJvd3NlciJdLCJzb3VyY2VSb290IjoiIn0=