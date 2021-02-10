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
            ENQWeb.Enq.cb[${msg.cb.taskId}] = "${msg.data}"
            ENQWeb.Enq.ready[${msg.cb.taskId}] = true
            `;
    } else if (msg.cb.inDoc && msg.cb.id) {
      code = `
            document.${msg.cb.id} = "${msg.data}"
            ENQWeb.Enq.cb[${msg.cb.taskId}] = "${msg.data}"
            ENQWeb.Enq.ready[${msg.cb.taskId}] = true
            `;
    } else if (msg.cb.inWin && msg.cb.id) {
      code = `
            window.${msg.cb.id} = "${msg.data}"
            ENQWeb.Enq.cb[${msg.cb.taskId}] = "${msg.data}"
            ENQWeb.Enq.ready[${msg.cb.taskId}] = true
            `;
    } else if (msg.cb.inSite && msg.cb.id) {
      code = `
            ${msg.cb.id}="${msg.data}"
            ENQWeb.Enq.cb[${msg.cb.taskId}] = "${msg.data}"
            ENQWeb.Enq.ready[${msg.cb.taskId}] = true
            `;
    } else {
      code = `
        document.getElementById('${msg.cb.cb}').setAttribute('ENQ', '${msg.data}')
        ENQWeb.Enq.cb[${msg.cb.taskId}] = "${msg.data}"
        ENQWeb.Enq.ready[${msg.cb.taskId}] = true
        `;
    }
  } else {
    code = `
        ENQWeb.Enq.cb[${msg.cb.taskId}] = "${msg.data}"
        ENQWeb.Enq.ready[${msg.cb.taskId}] = true
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvY29udGVudHNjcmlwdC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvZXh0ZW5zaW9uQXBpLmpzIl0sIm5hbWVzIjpbInRvQmFja2dyb3VuZCIsInBhZ2VUb0JhY2siLCJ0YXNrSWQiLCJzZXR1cENvbm5lY3Rpb24iLCJjb25zb2xlIiwibG9nIiwiY2hyb21lIiwicnVudGltZSIsImNvbm5lY3QiLCJuYW1lIiwib25NZXNzYWdlIiwiYWRkTGlzdGVuZXIiLCJtc2ciLCJzZW5kZXIiLCJzZW5kUmVzcG9uc2UiLCJjYiIsImluamVjdFNjcmlwdCIsInNjcmlwdCIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsInNyYyIsImV4dGVuc2lvbkFwaSIsImV4dGVuc2lvbiIsImdldFVSTCIsImNvbnRhaW5lciIsImhlYWQiLCJkb2N1bWVudEVsZW1lbnQiLCJpbnNlcnRCZWZvcmUiLCJjaGlsZHJlbiIsIm9ubG9hZCIsInJlbW92ZSIsImUiLCJlcnJvciIsImV2ZW50SGFuZGxlciIsImFkZEV2ZW50TGlzdGVuZXIiLCJhZGRyZXNzIiwiTWF0aCIsInJhbmRvbSIsInRvU3RyaW5nIiwiZGV0YWlsIiwidHlwZSIsImVuYWJsZSIsImJhbGFuY2VPZiIsInRyYW5zYWN0aW9uIiwicG9zdE1lc3NhZ2UiLCJkYXRhIiwiaW5qZWN0Q2IiLCJpbmplY3RDb2RlR2VuZXJhdGlvbiIsImNvZGUiLCJpblRleHQiLCJpZCIsImluRG9jIiwiaW5XaW4iLCJpblNpdGUiLCJ0ZXh0Q29udGVudCIsImFwcGVuZENoaWxkIiwiZ2xvYmFsIiwiYnJvd3NlciJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7Ozs7OztBQ25CQTtBQUFBO0FBQUE7QUFJQSxJQUFJQSxZQUFZLEdBQUcsRUFBbkI7QUFDQSxJQUFJQyxVQUFVLEdBQUcsRUFBakI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsRUFBYjs7QUFHQSxTQUFTQyxlQUFULEdBQTBCO0FBQ3RCQyxTQUFPLENBQUNDLEdBQVIsQ0FBWSxlQUFaLEVBRHNCLENBR3RCOztBQUNBTCxjQUFZLEdBQUdNLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlQyxPQUFmLENBQXVCO0FBQUNDLFFBQUksRUFBQztBQUFOLEdBQXZCLENBQWY7QUFDQVQsY0FBWSxDQUFDVSxTQUFiLENBQXVCQyxXQUF2QixDQUFtQyxDQUFDQyxHQUFELEVBQUtDLE1BQUwsRUFBYUMsWUFBYixLQUE0QjtBQUMzRCxRQUFJQyxFQUFFLEdBQUdiLE1BQU0sQ0FBQ1UsR0FBRyxDQUFDVixNQUFMLENBQWY7O0FBQ0EsUUFBR2EsRUFBSCxFQUFNO0FBQ0ZBLFFBQUUsQ0FBQ0gsR0FBRCxDQUFGO0FBQ0EsYUFBT1YsTUFBTSxDQUFDVSxHQUFHLENBQUNWLE1BQUwsQ0FBYjtBQUNBO0FBQ0g7O0FBQ0RFLFdBQU8sQ0FBQ0MsR0FBUixDQUFZTyxHQUFaO0FBQ0gsR0FSRDtBQVVIOztBQUdELFNBQVNJLFlBQVQsR0FBdUI7QUFDbkIsTUFBSTtBQUNBO0FBQ0EsUUFBSUMsTUFBTSxHQUFHQyxRQUFRLENBQUNDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBYjtBQUNBRixVQUFNLENBQUNHLEdBQVAsR0FBYUMsZ0VBQVksQ0FBQ0MsU0FBYixDQUF1QkMsTUFBdkIsQ0FBOEIsV0FBOUIsQ0FBYjtBQUNBLFVBQU1DLFNBQVMsR0FBR04sUUFBUSxDQUFDTyxJQUFULElBQWlCUCxRQUFRLENBQUNRLGVBQTVDO0FBQ0FGLGFBQVMsQ0FBQ0csWUFBVixDQUF1QlYsTUFBdkIsRUFBK0JPLFNBQVMsQ0FBQ0ksUUFBVixDQUFtQixDQUFuQixDQUEvQjs7QUFDQVgsVUFBTSxDQUFDWSxNQUFQLEdBQWdCLE1BQU1aLE1BQU0sQ0FBQ2EsTUFBUCxFQUF0QjtBQUNILEdBUEQsQ0FPRSxPQUFPQyxDQUFQLEVBQVU7QUFDUjNCLFdBQU8sQ0FBQzRCLEtBQVIsQ0FBYyxtQkFBZCxFQUFtQ0QsQ0FBbkM7QUFDSDtBQUNKOztBQUVELGVBQWVFLFlBQWYsR0FBOEI7QUFDMUJmLFVBQVEsQ0FBQ2dCLGdCQUFULENBQTBCLFlBQTFCLEVBQXlDSCxDQUFELElBQUs7QUFDekM1QixtQkFBZTtBQUNmZSxZQUFRLENBQUNnQixnQkFBVCxDQUEwQixZQUExQixFQUF5Q0gsQ0FBRCxJQUFLO0FBQ3pDLFVBQUlJLE9BQU8sR0FBR0MsSUFBSSxDQUFDQyxNQUFMLEdBQWNDLFFBQWQsQ0FBdUIsRUFBdkIsQ0FBZDs7QUFDQSxjQUFRUCxDQUFDLENBQUNRLE1BQUYsQ0FBU0MsSUFBakI7QUFDSSxhQUFLLFFBQUw7QUFDSXRDLGdCQUFNLENBQUNpQyxPQUFELENBQU4sR0FBa0JNLE1BQWxCO0FBQ0E7O0FBQ0osYUFBSyxXQUFMO0FBQ0l2QyxnQkFBTSxDQUFDaUMsT0FBRCxDQUFOLEdBQWtCTyxTQUFsQjtBQUNBOztBQUNKLGFBQUssSUFBTDtBQUNJeEMsZ0JBQU0sQ0FBQ2lDLE9BQUQsQ0FBTixHQUFrQlEsV0FBbEI7QUFDQTs7QUFDSjtBQUNJO0FBWFI7O0FBYUEzQyxrQkFBWSxDQUFDNEMsV0FBYixDQUF5QjtBQUFDSixZQUFJLEVBQUNULENBQUMsQ0FBQ1EsTUFBRixDQUFTQyxJQUFmO0FBQW9CSyxZQUFJLEVBQUNkLENBQUMsQ0FBQ1EsTUFBRixDQUFTTSxJQUFsQztBQUF3QzNDLGNBQU0sRUFBQ2lDLE9BQS9DO0FBQXdEcEIsVUFBRSxFQUFDZ0IsQ0FBQyxDQUFDUSxNQUFGLENBQVN4QjtBQUFwRSxPQUF6QjtBQUNILEtBaEJEO0FBaUJILEdBbkJEO0FBb0JIOztBQUVELFNBQVMwQixNQUFULENBQWdCN0IsR0FBaEIsRUFBb0I7QUFDaEJrQyxVQUFRLENBQUNDLG9CQUFvQixDQUFDbkMsR0FBRCxDQUFyQixDQUFSO0FBQ0g7O0FBQ0QsU0FBUzhCLFNBQVQsQ0FBbUI5QixHQUFuQixFQUF1QjtBQUNuQmtDLFVBQVEsQ0FBQ0Msb0JBQW9CLENBQUNuQyxHQUFELENBQXJCLENBQVI7QUFDSDs7QUFDRCxTQUFTK0IsV0FBVCxDQUFxQi9CLEdBQXJCLEVBQXlCO0FBQ3JCa0MsVUFBUSxDQUFDQyxvQkFBb0IsQ0FBQ25DLEdBQUQsQ0FBckIsQ0FBUjtBQUNILEMsQ0FFRDs7O0FBQ0EsU0FBU21DLG9CQUFULENBQThCbkMsR0FBOUIsRUFBa0M7QUFDOUIsTUFBSW9DLElBQUksR0FBRyxFQUFYOztBQUNBLE1BQUdwQyxHQUFHLENBQUNHLEVBQVAsRUFBVTtBQUNOLFFBQUdILEdBQUcsQ0FBQ0csRUFBSixDQUFPa0MsTUFBUCxJQUFpQnJDLEdBQUcsQ0FBQ0csRUFBSixDQUFPbUMsRUFBM0IsRUFBOEI7QUFDMUJGLFVBQUksR0FBSTtBQUNwQix1Q0FBdUNwQyxHQUFHLENBQUNHLEVBQUosQ0FBT21DLEVBQUcsbUJBQWtCdEMsR0FBRyxDQUFDaUMsSUFBSztBQUM1RSw0QkFBNEJqQyxHQUFHLENBQUNHLEVBQUosQ0FBT2IsTUFBTyxRQUFPVSxHQUFHLENBQUNpQyxJQUFLO0FBQzFELCtCQUErQmpDLEdBQUcsQ0FBQ0csRUFBSixDQUFPYixNQUFPO0FBQzdDLGFBSlk7QUFLSCxLQU5ELE1BT0ssSUFBR1UsR0FBRyxDQUFDRyxFQUFKLENBQU9vQyxLQUFQLElBQWdCdkMsR0FBRyxDQUFDRyxFQUFKLENBQU9tQyxFQUExQixFQUE2QjtBQUM5QkYsVUFBSSxHQUFFO0FBQ2xCLHVCQUF1QnBDLEdBQUcsQ0FBQ0csRUFBSixDQUFPbUMsRUFBRyxPQUFNdEMsR0FBRyxDQUFDaUMsSUFBSztBQUNoRCw0QkFBNEJqQyxHQUFHLENBQUNHLEVBQUosQ0FBT2IsTUFBTyxRQUFPVSxHQUFHLENBQUNpQyxJQUFLO0FBQzFELCtCQUErQmpDLEdBQUcsQ0FBQ0csRUFBSixDQUFPYixNQUFPO0FBQzdDLGFBSlk7QUFLSCxLQU5JLE1BT0EsSUFBR1UsR0FBRyxDQUFDRyxFQUFKLENBQU9xQyxLQUFQLElBQWdCeEMsR0FBRyxDQUFDRyxFQUFKLENBQU9tQyxFQUExQixFQUE2QjtBQUM5QkYsVUFBSSxHQUFFO0FBQ2xCLHFCQUFxQnBDLEdBQUcsQ0FBQ0csRUFBSixDQUFPbUMsRUFBRyxPQUFNdEMsR0FBRyxDQUFDaUMsSUFBSztBQUM5Qyw0QkFBNEJqQyxHQUFHLENBQUNHLEVBQUosQ0FBT2IsTUFBTyxRQUFPVSxHQUFHLENBQUNpQyxJQUFLO0FBQzFELCtCQUErQmpDLEdBQUcsQ0FBQ0csRUFBSixDQUFPYixNQUFPO0FBQzdDLGFBSlk7QUFLSCxLQU5JLE1BT0EsSUFBR1UsR0FBRyxDQUFDRyxFQUFKLENBQU9zQyxNQUFQLElBQWlCekMsR0FBRyxDQUFDRyxFQUFKLENBQU9tQyxFQUEzQixFQUE4QjtBQUMvQkYsVUFBSSxHQUFFO0FBQ2xCLGNBQWNwQyxHQUFHLENBQUNHLEVBQUosQ0FBT21DLEVBQUcsS0FBSXRDLEdBQUcsQ0FBQ2lDLElBQUs7QUFDckMsNEJBQTRCakMsR0FBRyxDQUFDRyxFQUFKLENBQU9iLE1BQU8sUUFBT1UsR0FBRyxDQUFDaUMsSUFBSztBQUMxRCwrQkFBK0JqQyxHQUFHLENBQUNHLEVBQUosQ0FBT2IsTUFBTztBQUM3QyxhQUpZO0FBS0gsS0FOSSxNQU9EO0FBQ0E4QyxVQUFJLEdBQUk7QUFDcEIsbUNBQW1DcEMsR0FBRyxDQUFDRyxFQUFKLENBQU9BLEVBQUcsMkJBQTBCSCxHQUFHLENBQUNpQyxJQUFLO0FBQ2hGLHdCQUF3QmpDLEdBQUcsQ0FBQ0csRUFBSixDQUFPYixNQUFPLFFBQU9VLEdBQUcsQ0FBQ2lDLElBQUs7QUFDdEQsMkJBQTJCakMsR0FBRyxDQUFDRyxFQUFKLENBQU9iLE1BQU87QUFDekMsU0FKWTtBQUtIO0FBQ0osR0FwQ0QsTUFvQ0s7QUFDRDhDLFFBQUksR0FBSTtBQUNoQix3QkFBd0JwQyxHQUFHLENBQUNHLEVBQUosQ0FBT2IsTUFBTyxRQUFPVSxHQUFHLENBQUNpQyxJQUFLO0FBQ3RELDJCQUEyQmpDLEdBQUcsQ0FBQ0csRUFBSixDQUFPYixNQUFPO0FBQ3pDLFNBSFE7QUFJSDs7QUFDRCxTQUFPOEMsSUFBUDtBQUNIOztBQUVELFNBQVNGLFFBQVQsQ0FBa0JFLElBQWxCLEVBQXVCO0FBQ25CLE1BQUkvQixNQUFNLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBVCxDQUF1QixRQUF2QixDQUFiO0FBQ0FGLFFBQU0sQ0FBQ3FDLFdBQVAsR0FBcUJOLElBQXJCO0FBQ0EsR0FBQzlCLFFBQVEsQ0FBQ08sSUFBVCxJQUFlUCxRQUFRLENBQUNRLGVBQXpCLEVBQTBDNkIsV0FBMUMsQ0FBc0R0QyxNQUF0RDtBQUNBQSxRQUFNLENBQUNhLE1BQVA7QUFDSCxDLENBRUQ7OztBQUNBZCxZQUFZO0FBQ1ppQixZQUFZLEc7Ozs7Ozs7Ozs7OztBQ2xJWjtBQUFBO0FBQU8sTUFBTVosWUFBWSxHQUFHbUMsTUFBTSxDQUFDbEQsTUFBUCxLQUFrQixXQUFsQixHQUN0QmtELE1BQU0sQ0FBQ2xELE1BRGUsR0FFdEJrRCxNQUFNLENBQUNDLE9BRk4sQyIsImZpbGUiOiJjb250ZW50c2NyaXB0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIuL1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb250ZW50c2NyaXB0LmpzXCIpO1xuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwiaW1wb3J0IHtleHRlbnNpb25BcGl9IGZyb20gXCIuL3V0aWxzL2V4dGVuc2lvbkFwaVwiO1xuXG5cblxudmFyIHRvQmFja2dyb3VuZCA9IHt9XG52YXIgcGFnZVRvQmFjayA9IHt9XG52YXIgdGFza0lkID0gW11cblxuXG5mdW5jdGlvbiBzZXR1cENvbm5lY3Rpb24oKXtcbiAgICBjb25zb2xlLmxvZygnY29udGVudCByZWFkeScpXG5cbiAgICAvLyBjaHJvbWUucnVudGltZS5zZW5kTWVzc2FnZSh7Z3JlZXRpbmc6IFwiQ29udGVudCByZWFkeVwifSwgZnVuY3Rpb24ocmVzcG9uc2UpIHt9KTtcbiAgICB0b0JhY2tncm91bmQgPSBjaHJvbWUucnVudGltZS5jb25uZWN0KHtuYW1lOidjb250ZW50J30pXG4gICAgdG9CYWNrZ3JvdW5kLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcigobXNnLHNlbmRlciwgc2VuZFJlc3BvbnNlKT0+e1xuICAgICAgICB2YXIgY2IgPSB0YXNrSWRbbXNnLnRhc2tJZF1cbiAgICAgICAgaWYoY2Ipe1xuICAgICAgICAgICAgY2IobXNnKVxuICAgICAgICAgICAgZGVsZXRlIHRhc2tJZFttc2cudGFza0lkXVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICAgIH0pXG5cbn1cblxuXG5mdW5jdGlvbiBpbmplY3RTY3JpcHQoKXtcbiAgICB0cnkge1xuICAgICAgICAvLyBpbmplY3QgaW4tcGFnZSBzY3JpcHRcbiAgICAgICAgbGV0IHNjcmlwdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICAgICAgICBzY3JpcHQuc3JjID0gZXh0ZW5zaW9uQXBpLmV4dGVuc2lvbi5nZXRVUkwoJ2lucGFnZS5qcycpO1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5oZWFkIHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudDtcbiAgICAgICAgY29udGFpbmVyLmluc2VydEJlZm9yZShzY3JpcHQsIGNvbnRhaW5lci5jaGlsZHJlblswXSk7XG4gICAgICAgIHNjcmlwdC5vbmxvYWQgPSAoKSA9PiBzY3JpcHQucmVtb3ZlKCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdJbmplY3Rpb24gZmFpbGVkLicsIGUpO1xuICAgIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gZXZlbnRIYW5kbGVyKCkge1xuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0VOUUNvbm5lY3QnLCAoZSk9PntcbiAgICAgICAgc2V0dXBDb25uZWN0aW9uKClcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRU5RQ29udGVudCcsIChlKT0+e1xuICAgICAgICAgICAgbGV0IGFkZHJlc3MgPSBNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KVxuICAgICAgICAgICAgc3dpdGNoIChlLmRldGFpbC50eXBlKXtcbiAgICAgICAgICAgICAgICBjYXNlICdlbmFibGUnOlxuICAgICAgICAgICAgICAgICAgICB0YXNrSWRbYWRkcmVzc10gPSBlbmFibGVcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlICdiYWxhbmNlT2YnOlxuICAgICAgICAgICAgICAgICAgICB0YXNrSWRbYWRkcmVzc10gPSBiYWxhbmNlT2ZcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgICAgICBjYXNlICd0eCc6XG4gICAgICAgICAgICAgICAgICAgIHRhc2tJZFthZGRyZXNzXSA9IHRyYW5zYWN0aW9uXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRvQmFja2dyb3VuZC5wb3N0TWVzc2FnZSh7dHlwZTplLmRldGFpbC50eXBlLGRhdGE6ZS5kZXRhaWwuZGF0YSwgdGFza0lkOmFkZHJlc3MsIGNiOmUuZGV0YWlsLmNifSlcbiAgICAgICAgfSlcbiAgICB9KVxufVxuXG5mdW5jdGlvbiBlbmFibGUobXNnKXtcbiAgICBpbmplY3RDYihpbmplY3RDb2RlR2VuZXJhdGlvbihtc2cpKVxufVxuZnVuY3Rpb24gYmFsYW5jZU9mKG1zZyl7XG4gICAgaW5qZWN0Q2IoaW5qZWN0Q29kZUdlbmVyYXRpb24obXNnKSlcbn1cbmZ1bmN0aW9uIHRyYW5zYWN0aW9uKG1zZyl7XG4gICAgaW5qZWN0Q2IoaW5qZWN0Q29kZUdlbmVyYXRpb24obXNnKSlcbn1cblxuLy9UT0RPIGNoZWNrIGVycm9yIGluIG1zZ1xuZnVuY3Rpb24gaW5qZWN0Q29kZUdlbmVyYXRpb24obXNnKXtcbiAgICB2YXIgY29kZSA9ICcnXG4gICAgaWYobXNnLmNiKXtcbiAgICAgICAgaWYobXNnLmNiLmluVGV4dCAmJiBtc2cuY2IuaWQpe1xuICAgICAgICAgICAgY29kZSA9IGBcbiAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcke21zZy5jYi5pZH0nKS5pbm5lclRleHQgPSBcIiR7bXNnLmRhdGF9XCJcbiAgICAgICAgICAgIEVOUVdlYi5FbnEuY2JbJHttc2cuY2IudGFza0lkfV0gPSBcIiR7bXNnLmRhdGF9XCJcbiAgICAgICAgICAgIEVOUVdlYi5FbnEucmVhZHlbJHttc2cuY2IudGFza0lkfV0gPSB0cnVlXG4gICAgICAgICAgICBgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihtc2cuY2IuaW5Eb2MgJiYgbXNnLmNiLmlkKXtcbiAgICAgICAgICAgIGNvZGU9YFxuICAgICAgICAgICAgZG9jdW1lbnQuJHttc2cuY2IuaWR9ID0gXCIke21zZy5kYXRhfVwiXG4gICAgICAgICAgICBFTlFXZWIuRW5xLmNiWyR7bXNnLmNiLnRhc2tJZH1dID0gXCIke21zZy5kYXRhfVwiXG4gICAgICAgICAgICBFTlFXZWIuRW5xLnJlYWR5WyR7bXNnLmNiLnRhc2tJZH1dID0gdHJ1ZVxuICAgICAgICAgICAgYFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYobXNnLmNiLmluV2luICYmIG1zZy5jYi5pZCl7XG4gICAgICAgICAgICBjb2RlPWBcbiAgICAgICAgICAgIHdpbmRvdy4ke21zZy5jYi5pZH0gPSBcIiR7bXNnLmRhdGF9XCJcbiAgICAgICAgICAgIEVOUVdlYi5FbnEuY2JbJHttc2cuY2IudGFza0lkfV0gPSBcIiR7bXNnLmRhdGF9XCJcbiAgICAgICAgICAgIEVOUVdlYi5FbnEucmVhZHlbJHttc2cuY2IudGFza0lkfV0gPSB0cnVlXG4gICAgICAgICAgICBgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihtc2cuY2IuaW5TaXRlICYmIG1zZy5jYi5pZCl7XG4gICAgICAgICAgICBjb2RlPWBcbiAgICAgICAgICAgICR7bXNnLmNiLmlkfT1cIiR7bXNnLmRhdGF9XCJcbiAgICAgICAgICAgIEVOUVdlYi5FbnEuY2JbJHttc2cuY2IudGFza0lkfV0gPSBcIiR7bXNnLmRhdGF9XCJcbiAgICAgICAgICAgIEVOUVdlYi5FbnEucmVhZHlbJHttc2cuY2IudGFza0lkfV0gPSB0cnVlXG4gICAgICAgICAgICBgXG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGNvZGUgPSBgXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCcke21zZy5jYi5jYn0nKS5zZXRBdHRyaWJ1dGUoJ0VOUScsICcke21zZy5kYXRhfScpXG4gICAgICAgIEVOUVdlYi5FbnEuY2JbJHttc2cuY2IudGFza0lkfV0gPSBcIiR7bXNnLmRhdGF9XCJcbiAgICAgICAgRU5RV2ViLkVucS5yZWFkeVske21zZy5jYi50YXNrSWR9XSA9IHRydWVcbiAgICAgICAgYFxuICAgICAgICB9XG4gICAgfWVsc2V7XG4gICAgICAgIGNvZGUgPSBgXG4gICAgICAgIEVOUVdlYi5FbnEuY2JbJHttc2cuY2IudGFza0lkfV0gPSBcIiR7bXNnLmRhdGF9XCJcbiAgICAgICAgRU5RV2ViLkVucS5yZWFkeVske21zZy5jYi50YXNrSWR9XSA9IHRydWVcbiAgICAgICAgYFxuICAgIH1cbiAgICByZXR1cm4gY29kZVxufVxuXG5mdW5jdGlvbiBpbmplY3RDYihjb2RlKXtcbiAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gICAgc2NyaXB0LnRleHRDb250ZW50ID0gY29kZTtcbiAgICAoZG9jdW1lbnQuaGVhZHx8ZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50KS5hcHBlbmRDaGlsZChzY3JpcHQpO1xuICAgIHNjcmlwdC5yZW1vdmUoKTtcbn1cblxuLy8gc2V0dXBDb25uZWN0aW9uKCk7XG5pbmplY3RTY3JpcHQoKTtcbmV2ZW50SGFuZGxlcigpXG5cblxuXG4iLCJleHBvcnQgY29uc3QgZXh0ZW5zaW9uQXBpID0gZ2xvYmFsLmNocm9tZSAhPT0gJ3VuZGVmaW5lZCdcbiAgICA/IGdsb2JhbC5jaHJvbWVcbiAgICA6IGdsb2JhbC5icm93c2VyIl0sInNvdXJjZVJvb3QiOiIifQ==