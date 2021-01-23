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
        `;
    } else if (msg.cb.inDoc && msg.cb.id) {
      code = `
            document.${msg.cb.id} = "${msg.data}"
            `;
    } else if (msg.cb.inWin && msg.cb.id) {
      code = `
            window.${msg.cb.id} = "${msg.data}"
            `;
    } else if (msg.cb.inSite && msg.cb.id) {
      code = `
            ${msg.cb.id}="${msg.data}"
            `;
    } else {
      code = `
        document.getElementById('${msg.cb}').setAttribute('ENQ', '${msg.data}')
        `;
    }
  } else {
    code = `
        ENQWeb.Enq.cb = "${msg.data}"
        `;
  }

  return code;
}

function injectCb(code) {
  var script = document.createElement('script');
  script.textContent = code;
  (document.head || document.documentElement).appendChild(script);
  script.remove();
}

setupConnection();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udGVudHNjcmlwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZXh0ZW5zaW9uQXBpLmpzIl0sIm5hbWVzIjpbInRvQmFja2dyb3VuZCIsInRhc2tJZCIsInNldHVwQ29ubmVjdGlvbiIsImNvbnNvbGUiLCJsb2ciLCJjaHJvbWUiLCJydW50aW1lIiwiY29ubmVjdCIsIm5hbWUiLCJvbk1lc3NhZ2UiLCJhZGRMaXN0ZW5lciIsIm1zZyIsInNlbmRlciIsInNlbmRSZXNwb25zZSIsImNiIiwiaW5qZWN0U2NyaXB0Iiwic2NyaXB0IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwic3JjIiwiZXh0ZW5zaW9uQXBpIiwiZXh0ZW5zaW9uIiwiZ2V0VVJMIiwiY29udGFpbmVyIiwiaGVhZCIsImRvY3VtZW50RWxlbWVudCIsImluc2VydEJlZm9yZSIsImNoaWxkcmVuIiwib25sb2FkIiwicmVtb3ZlIiwiZSIsImVycm9yIiwiZXZlbnRIYW5kbGVyIiwiYWRkRXZlbnRMaXN0ZW5lciIsImFkZHJlc3MiLCJNYXRoIiwicmFuZG9tIiwidG9TdHJpbmciLCJkZXRhaWwiLCJ0eXBlIiwiZW5hYmxlIiwiYmFsYW5jZU9mIiwidHJhbnNhY3Rpb24iLCJwb3N0TWVzc2FnZSIsImRhdGEiLCJpbmplY3RDYiIsImluamVjdENvZGVHZW5lcmF0aW9uIiwiY29kZSIsImluVGV4dCIsImlkIiwiaW5Eb2MiLCJpbldpbiIsImluU2l0ZSIsInRleHRDb250ZW50IiwiYXBwZW5kQ2hpbGQiLCJnbG9iYWwiLCJicm93c2VyIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFD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QTFDLENBQXNEdEMsTUFBdEQ7QUFDQUEsUUFBTSxDQUFDYSxNQUFQO0FBQ0g7O0FBRUQzQixlQUFlO0FBQ2ZhLFlBQVk7QUFDWmlCLFlBQVksRzs7Ozs7Ozs7Ozs7O0FDL0daO0FBQUE7QUFBTyxNQUFNWixZQUFZLEdBQUdtQyxNQUFNLENBQUNsRCxNQUFQLEtBQWtCLFdBQWxCLEdBQ3RCa0QsTUFBTSxDQUFDbEQsTUFEZSxHQUV0QmtELE1BQU0sQ0FBQ0MsT0FGTixDIiwiZmlsZSI6ImNvbnRlbnRzY3JpcHQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvbnRlbnRzY3JpcHQuanNcIik7XG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG59IGNhdGNoIChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSBnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG4iLCJpbXBvcnQge2V4dGVuc2lvbkFwaX0gZnJvbSBcIi4vdXRpbHMvZXh0ZW5zaW9uQXBpXCI7XG5cbnZhciB0b0JhY2tncm91bmQgPSB7fVxudmFyIHRhc2tJZCA9IFtdXG5cbmZ1bmN0aW9uIHNldHVwQ29ubmVjdGlvbigpe1xuICAgIGNvbnNvbGUubG9nKCdjb250ZW50IHJlYWR5JylcbiAgICAvLyBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7Z3JlZXRpbmc6IFwiQ29udGVudCByZWFkeVwifSwgZnVuY3Rpb24ocmVzcG9uc2UpIHt9KTtcbiAgICB0b0JhY2tncm91bmQgPSBjaHJvbWUucnVudGltZS5jb25uZWN0KHtuYW1lOidjb250ZW50J30pXG4gICAgdG9CYWNrZ3JvdW5kLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnLHNlbmRlciwgc2VuZFJlc3BvbnNlKT0+e1xuICAgICAgICB2YXIgY2IgPSB0YXNrSWRbbXNnLnRhc2tJZF1cbiAgICAgICAgaWYoY2Ipe1xuICAgICAgICAgICAgY2IobXNnKVxuICAgICAgICAgICAgZGVsZXRlIHRhc2tJZFttc2cudGFza0lkXVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICAgIH0pXG59XG5cblxuZnVuY3Rpb24gaW5qZWN0U2NyaXB0KCl7XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gaW5qZWN0IGluLXBhZ2Ugc2NyaXB0XG4gICAgICAgIGxldCBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICAgICAgc2NyaXB0LnNyYyA9IGV4dGVuc2lvbkFwaS5leHRlbnNpb24uZ2V0VVJMKCdpbnBhZ2UuanMnKTtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuaGVhZCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQ7XG4gICAgICAgIGNvbnRhaW5lci5pbnNlcnRCZWZvcmUoc2NyaXB0LCBjb250YWluZXIuY2hpbGRyZW5bMF0pO1xuICAgICAgICBzY3JpcHQub25sb2FkID0gKCkgPT4gc2NyaXB0LnJlbW92ZSgpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignSW5qZWN0aW9uIGZhaWxlZC4nLCBlKTtcbiAgICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGV2ZW50SGFuZGxlcigpIHtcbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdFTlFDb250ZW50JywgKGUpPT57XG4gICAgICAgIGxldCBhZGRyZXNzID0gTWF0aC5yYW5kb20oKS50b1N0cmluZygzNilcbiAgICAgICAgc3dpdGNoIChlLmRldGFpbC50eXBlKXtcbiAgICAgICAgICAgIGNhc2UgJ2VuYWJsZSc6XG4gICAgICAgICAgICAgICAgdGFza0lkW2FkZHJlc3NdID0gZW5hYmxlXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ2JhbGFuY2VPZic6XG4gICAgICAgICAgICAgICAgdGFza0lkW2FkZHJlc3NdID0gYmFsYW5jZU9mXG4gICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIGNhc2UgJ3R4JzpcbiAgICAgICAgICAgICAgICB0YXNrSWRbYWRkcmVzc10gPSB0cmFuc2FjdGlvblxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIH1cbiAgICAgICAgdG9CYWNrZ3JvdW5kLnBvc3RNZXNzYWdlKHt0eXBlOmUuZGV0YWlsLnR5cGUsZGF0YTplLmRldGFpbC5kYXRhLCB0YXNrSWQ6YWRkcmVzcywgY2I6ZS5kZXRhaWwuY2J9KVxuICAgIH0pXG5cbn1cblxuZnVuY3Rpb24gZW5hYmxlKG1zZyl7XG4gICAgaW5qZWN0Q2IoaW5qZWN0Q29kZUdlbmVyYXRpb24obXNnKSlcbn1cbmZ1bmN0aW9uIGJhbGFuY2VPZihtc2cpe1xuICAgIGluamVjdENiKGluamVjdENvZGVHZW5lcmF0aW9uKG1zZykpXG59XG5mdW5jdGlvbiB0cmFuc2FjdGlvbihtc2cpe1xuICAgIGluamVjdENiKGluamVjdENvZGVHZW5lcmF0aW9uKG1zZykpXG59XG5cbi8vVE9ETyBjaGVjayBlcnJvciBpbiBtc2dcbmZ1bmN0aW9uIGluamVjdENvZGVHZW5lcmF0aW9uKG1zZyl7XG4gICAgdmFyIGNvZGUgPSAnJ1xuICAgIGlmKG1zZy5jYil7XG4gICAgICAgIGlmKG1zZy5jYi5pblRleHQgJiYgbXNnLmNiLmlkKXtcbiAgICAgICAgICAgIGNvZGUgPSBgXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcke21zZy5jYi5pZH0nKS5pbm5lclRleHQgPSBcIiR7bXNnLmRhdGF9XCJcbiAgICAgICAgYFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobXNnLmNiLmluRG9jICYmIG1zZy5jYi5pZCl7XG4gICAgICAgICAgICBjb2RlPWBcbiAgICAgICAgICAgIGRvY3VtZW50LiR7bXNnLmNiLmlkfSA9IFwiJHttc2cuZGF0YX1cIlxuICAgICAgICAgICAgYFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobXNnLmNiLmluV2luICYmIG1zZy5jYi5pZCl7XG4gICAgICAgICAgICBjb2RlPWBcbiAgICAgICAgICAgIHdpbmRvdy4ke21zZy5jYi5pZH0gPSBcIiR7bXNnLmRhdGF9XCJcbiAgICAgICAgICAgIGBcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKG1zZy5jYi5pblNpdGUgJiYgbXNnLmNiLmlkKXtcbiAgICAgICAgICAgIGNvZGU9YFxuICAgICAgICAgICAgJHttc2cuY2IuaWR9PVwiJHttc2cuZGF0YX1cIlxuICAgICAgICAgICAgYFxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICBjb2RlID0gYFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnJHttc2cuY2J9Jykuc2V0QXR0cmlidXRlKCdFTlEnLCAnJHttc2cuZGF0YX0nKVxuICAgICAgICBgXG4gICAgICAgIH1cbiAgICB9ZWxzZXtcbiAgICAgICAgY29kZSA9IGBcbiAgICAgICAgRU5RV2ViLkVucS5jYiA9IFwiJHttc2cuZGF0YX1cIlxuICAgICAgICBgXG4gICAgfVxuICAgIHJldHVybiBjb2RlXG59XG5cbmZ1bmN0aW9uIGluamVjdENiKGNvZGUpe1xuICAgIHZhciBzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgICBzY3JpcHQudGV4dENvbnRlbnQgPSBjb2RlO1xuICAgIChkb2N1bWVudC5oZWFkfHxkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpLmFwcGVuZENoaWxkKHNjcmlwdCk7XG4gICAgc2NyaXB0LnJlbW92ZSgpO1xufVxuXG5zZXR1cENvbm5lY3Rpb24oKTtcbmluamVjdFNjcmlwdCgpO1xuZXZlbnRIYW5kbGVyKClcblxuXG4iLCJleHBvcnQgY29uc3QgZXh0ZW5zaW9uQXBpID0gZ2xvYmFsLmNocm9tZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IGdsb2JhbC5jaHJvbWVcbiAgICA6IGdsb2JhbC5icm93c2VyIl0sInNvdXJjZVJvb3QiOiIifQ==