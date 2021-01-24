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
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {let user = {
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
  chrome.runtime.onMessage.addListener(msgHandler);
  chrome.runtime.onConnect.addListener(connectHandler);
}

async function msgHandler(msg, sender, sendResponse) {
  console.log(msg);
}

async function msgConnectHandler(msg, sender) {
  console.log(msg);
  let answer = '';

  if (msg.taskId) {
    // console.log(msg.taskId)
    // sender.postMessage({msg:'all work', taskId:msg.taskId, data:'qqq'})
    switch (msg.type) {
      case 'enable':
        sender.postMessage({
          data: user.Alice.pubkey,
          taskId: msg.taskId,
          cb: msg.cb
        });
        break;

      case 'balanceOf':
        ENQWeb.Enq.provider = 'http://95.216.207.173';
        answer = await ENQWeb.Net.get.getBalance(msg.data.address, msg.data.token);
        sender.postMessage({
          data: answer.amount,
          taskId: msg.taskId,
          cb: msg.cb
        });
        break;

      case 'tx':
        ENQWeb.Enq.provider = 'http://95.216.207.173';
        ENQWeb.Enq.User = user.genesis;
        ENQWeb.Net.post.tx(msg.data.address, ENQWeb.Enq.ticker, msg.data.amount, '', msg.data.token).then(answer => {
          // console.log(answer)
          sender.postMessage({
            data: answer.hash,
            taskId: msg.taskId,
            cb: msg.cb
          });
        }).catch(err => {}); //TODO catch errors

        break;

      default:
        break;
    }
  } else {
    console.log(msg);
  }
}

function msgPopupHandler(msg, sender) {
  console.log(msg);
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
} //TODO add cleaner connection list


async function connectHandler(port) {
  //console.log(port, port.name)
  // ports[port.name]=port
  await connectController(port);

  switch (port.name) {
    case 'content':
      port.onMessage.addListener(msgConnectHandler);
      break;

    case 'popup':
      port.onMessage.addListener(msgPopupHandler);
      break;

    default:
      break;
  }

  listPorts();
}

setupApp();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2dyb3VuZC5qcyJdLCJuYW1lcyI6WyJ1c2VyIiwiZ2VuZXNpcyIsInB1YmtleSIsInBydmtleSIsIkFsaWNlIiwiQm9iIiwiRXZhIiwiZ2xvYmFsIiwidXNlcnMiLCJwb3J0cyIsInNldHVwQXBwIiwiY29uc29sZSIsImxvZyIsImNocm9tZSIsInJ1bnRpbWUiLCJvbk1lc3NhZ2UiLCJhZGRMaXN0ZW5lciIsIm1zZ0hhbmRsZXIiLCJvbkNvbm5lY3QiLCJjb25uZWN0SGFuZGxlciIsIm1zZyIsInNlbmRlciIsInNlbmRSZXNwb25zZSIsIm1zZ0Nvbm5lY3RIYW5kbGVyIiwiYW5zd2VyIiwidGFza0lkIiwidHlwZSIsInBvc3RNZXNzYWdlIiwiZGF0YSIsImNiIiwiRU5RV2ViIiwiRW5xIiwicHJvdmlkZXIiLCJOZXQiLCJnZXQiLCJnZXRCYWxhbmNlIiwiYWRkcmVzcyIsInRva2VuIiwiYW1vdW50IiwiVXNlciIsInBvc3QiLCJ0eCIsInRpY2tlciIsInRoZW4iLCJoYXNoIiwiY2F0Y2giLCJlcnIiLCJtc2dQb3B1cEhhbmRsZXIiLCJsaXN0UG9ydHMiLCJkaXNjb25uZWN0SGFuZGxlciIsInBvcnQiLCJuYW1lIiwiY29ubmVjdENvbnRyb2xsZXIiLCJkaXNjb25uZWN0Il0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtR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LENBQUNDLElBQU4sQ0FBUixFQUFvQjtBQUNoQjFDLFNBQUssQ0FBQ3lDLElBQUksQ0FBQ0MsSUFBTixDQUFMLENBQWlCRSxVQUFqQjtBQUNBNUMsU0FBSyxDQUFDeUMsSUFBSSxDQUFDQyxJQUFOLENBQUwsR0FBbUJELElBQW5CO0FBQ0gsR0FIRCxNQUdLO0FBQ0R6QyxTQUFLLENBQUN5QyxJQUFJLENBQUNDLElBQU4sQ0FBTCxHQUFtQkQsSUFBbkI7QUFDSDtBQUNKLEMsQ0FFRDs7O0FBQ0EsZUFBZS9CLGNBQWYsQ0FBOEIrQixJQUE5QixFQUFtQztBQUMvQjtBQUNBO0FBQ0EsUUFBTUUsaUJBQWlCLENBQUNGLElBQUQsQ0FBdkI7O0FBQ0EsVUFBUUEsSUFBSSxDQUFDQyxJQUFiO0FBQ0ksU0FBSyxTQUFMO0FBQ0lELFVBQUksQ0FBQ25DLFNBQUwsQ0FBZUMsV0FBZixDQUEyQk8saUJBQTNCO0FBQ0E7O0FBQ0osU0FBSyxPQUFMO0FBQ0kyQixVQUFJLENBQUNuQyxTQUFMLENBQWVDLFdBQWYsQ0FBMkIrQixlQUEzQjtBQUNBOztBQUNKO0FBQ0k7QUFSUjs7QUFVQUMsV0FBUztBQUNaOztBQUVEdEMsUUFBUSxHIiwiZmlsZSI6ImJhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2JhY2tncm91bmQuanNcIik7XG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG59IGNhdGNoIChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSBnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG4iLCJcbmxldCB1c2VyID0ge1xuICAgIGdlbmVzaXM6e1xuICAgICAgICBwdWJrZXk6XG4gICAgICAgICAgICBcIjAyOWRkMjIyZWVkZGQ1YzMzNDBlOGQ0NmFlMGEyMmUyYzhlMzAxYmZlZTQ5MDNiY2Y4Yzg5OTc2NmM4Y2ViM2E3ZFwiLFxuICAgICAgICBwcnZrZXk6XG4gICAgICAgICAgICBcIjlkM2NlMWYzZWM5OWMyNmMyZTY0ZTA2ZDc3NWE1MjU3OGIwMDk4MmJmMTc0OGUyZTI5NzJmNzM3MzY0NGFjNWNcIlxuICAgIH0sXG4gICAgQWxpY2U6XG4gICAgICAgIHtcbiAgICAgICAgICAgIHBydmtleTpcbiAgICAgICAgICAgICAgICAnMzNkMjNjYTdkMzA2MDI2ZWFhNjhkODg2NGRkMzg3MTU4NGVkMTVjYzIwODAzMDc3YmVhNzE4MzFlZTU0OTJjYycsXG4gICAgICAgICAgICBwdWJrZXk6XG4gICAgICAgICAgICAgICAgJzAyMjgzMzNiOTlhNGQxMzEyZjMxODUxZGFkMWMzMmI1MzBkNWVlNjE1MzQ5NTFlYmU2NTBjNjYzOTBmZGNmZmU5OCdcbiAgICAgICAgfSxcbiAgICBCb2I6XG4gICAgICAgIHtcbiAgICAgICAgICAgIHBydmtleTpcbiAgICAgICAgICAgICAgICAnNjc3YjVjMDM0MGMxY2YxY2FjNDM1OGE1MTdmY2YxMDMyYzgwMTBlNzk3ZjJjYTg3NzI4ZTI5Y2E2MzhiNTkxNCcsXG4gICAgICAgICAgICBwdWJrZXk6XG4gICAgICAgICAgICAgICAgJzAzMGIxM2ExMzI3MmI2NjNkYTMzNDY4OTI5MTEwYzc1MDVmNzAwYjk1NWUxYWVlNzU0Y2NlMTdkNjZhM2ZkZTIwMCdcbiAgICAgICAgfSxcbiAgICBFdmE6e1xuICAgICAgICBwcnZrZXk6XG4gICAgICAgICAgICAnM2Y3YzhkMjM2Njc4ZDQ1YzQ0MzdiMzNkOTIwNmRjNzYyNmU0YzYxZGM2NDRjYTAyMzUwZWM4MGU5YzkwOGZkZCcsXG4gICAgICAgIHB1YmtleTpcbiAgICAgICAgICAgICcwMmI0MTMwOTkwOWEwYzQwMWMzOGUyZGQ3MzRhNmQ3ZjEzNzMzZDhjNWJmYTY4NjM5MDQ3YjE4OWZiNzhlMDg1NWQnIH1cbn1cbmdsb2JhbC51c2VycyA9IHVzZXJcbnZhciBwb3J0cyA9IHt9XG5cbmZ1bmN0aW9uIHNldHVwQXBwKCkge1xuICAgIGNvbnNvbGUubG9nKCdiYWNrZ3JvdW5kIHJlYWR5JylcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobXNnSGFuZGxlcilcbiAgICBjaHJvbWUucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoY29ubmVjdEhhbmRsZXIpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1zZ0hhbmRsZXIobXNnLHNlbmRlciwgc2VuZFJlc3BvbnNlKXtcbiAgICBjb25zb2xlLmxvZyhtc2cpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1zZ0Nvbm5lY3RIYW5kbGVyKG1zZyxzZW5kZXIpe1xuICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICBsZXQgYW5zd2VyID0gJydcbiAgICBpZihtc2cudGFza0lkKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobXNnLnRhc2tJZClcbiAgICAgICAgLy8gc2VuZGVyLnBvc3RNZXNzYWdlKHttc2c6J2FsbCB3b3JrJywgdGFza0lkOm1zZy50YXNrSWQsIGRhdGE6J3FxcSd9KVxuICAgICAgICBzd2l0Y2ggKG1zZy50eXBlKXtcbiAgICAgICAgICAgIGNhc2UgJ2VuYWJsZSc6XG4gICAgICAgICAgICAgICAgc2VuZGVyLnBvc3RNZXNzYWdlKHtkYXRhOnVzZXIuQWxpY2UucHVia2V5LHRhc2tJZDptc2cudGFza0lkLCBjYjptc2cuY2J9KVxuICAgICAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgICBjYXNlICdiYWxhbmNlT2YnOlxuICAgICAgICAgICAgICAgIEVOUVdlYi5FbnEucHJvdmlkZXIgPSAnaHR0cDovLzk1LjIxNi4yMDcuMTczJ1xuICAgICAgICAgICAgICAgIGFuc3dlciA9IGF3YWl0IEVOUVdlYi5OZXQuZ2V0LmdldEJhbGFuY2UobXNnLmRhdGEuYWRkcmVzcywgbXNnLmRhdGEudG9rZW4pXG4gICAgICAgICAgICAgICAgc2VuZGVyLnBvc3RNZXNzYWdlKHtkYXRhOmFuc3dlci5hbW91bnQsdGFza0lkOm1zZy50YXNrSWQsY2I6bXNnLmNifSlcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgY2FzZSAndHgnOlxuICAgICAgICAgICAgICAgIEVOUVdlYi5FbnEucHJvdmlkZXIgPSAnaHR0cDovLzk1LjIxNi4yMDcuMTczJ1xuICAgICAgICAgICAgICAgIEVOUVdlYi5FbnEuVXNlciA9IHVzZXIuZ2VuZXNpc1xuICAgICAgICAgICAgICAgIEVOUVdlYi5OZXQucG9zdC50eChtc2cuZGF0YS5hZGRyZXNzLEVOUVdlYi5FbnEudGlja2VyLG1zZy5kYXRhLmFtb3VudCwgJycsIG1zZy5kYXRhLnRva2VuKS50aGVuKGFuc3dlcj0+e1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhbnN3ZXIpXG4gICAgICAgICAgICAgICAgICAgIHNlbmRlci5wb3N0TWVzc2FnZSh7ZGF0YTphbnN3ZXIuaGFzaCx0YXNrSWQ6bXNnLnRhc2tJZCxjYjptc2cuY2J9KVxuICAgICAgICAgICAgICAgIH0pLmNhdGNoKGVycj0+e30pIC8vVE9ETyBjYXRjaCBlcnJvcnNcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBicmVha1xuICAgICAgICB9XG4gICAgfWVsc2V7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1zZ1BvcHVwSGFuZGxlcihtc2csIHNlbmRlcil7XG4gICAgY29uc29sZS5sb2cobXNnKVxufVxuXG5mdW5jdGlvbiBsaXN0UG9ydHMoKXtcbiAgICBjb25zb2xlLmxvZyhwb3J0cylcbiAgICBnbG9iYWwucG9ydHMgPSBwb3J0c1xufVxuZnVuY3Rpb24gZGlzY29ubmVjdEhhbmRsZXIocG9ydCl7XG4gICAgY29uc29sZS5sb2coJ2Rpc2Nvbm5lY3RlZDogJyArIHBvcnQubmFtZSlcbn1cbmZ1bmN0aW9uIGNvbm5lY3RDb250cm9sbGVyKHBvcnQpe1xuICAgIGlmKHBvcnRzW3BvcnQubmFtZV0pe1xuICAgICAgICBwb3J0c1twb3J0Lm5hbWVdLmRpc2Nvbm5lY3QoKVxuICAgICAgICBwb3J0c1twb3J0Lm5hbWVdID0gcG9ydFxuICAgIH1lbHNle1xuICAgICAgICBwb3J0c1twb3J0Lm5hbWVdID0gcG9ydFxuICAgIH1cbn1cblxuLy9UT0RPIGFkZCBjbGVhbmVyIGNvbm5lY3Rpb24gbGlzdFxuYXN5bmMgZnVuY3Rpb24gY29ubmVjdEhhbmRsZXIocG9ydCl7XG4gICAgLy9jb25zb2xlLmxvZyhwb3J0LCBwb3J0Lm5hbWUpXG4gICAgLy8gcG9ydHNbcG9ydC5uYW1lXT1wb3J0XG4gICAgYXdhaXQgY29ubmVjdENvbnRyb2xsZXIocG9ydClcbiAgICBzd2l0Y2ggKHBvcnQubmFtZSl7XG4gICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobXNnQ29ubmVjdEhhbmRsZXIpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdwb3B1cCc6XG4gICAgICAgICAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtc2dQb3B1cEhhbmRsZXIpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgbGlzdFBvcnRzKClcbn1cblxuc2V0dXBBcHAoKTsiXSwic291cmNlUm9vdCI6IiJ9