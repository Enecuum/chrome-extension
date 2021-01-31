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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/popup.js");
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

/***/ "./src/popup.js":
/*!**********************!*\
  !*** ./src/popup.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {const content = __webpack_require__(/*! ./ui/content */ "./src/ui/content.js");

var toBackground = {};
var taskId = [];

async function setupUi() {
  toBackground = chrome.runtime.connect({
    name: 'popup'
  });
  toBackground.onMessage.addListener((msg, sender, sendResponse) => {
    var cb = taskId[msg.taskId];

    if (cb) {
      cb(msg);
      delete taskId[msg.taskId];
      return;
    }

    msgHandler(msg, sender);
  });
  global.Port = toBackground; // Запуск интерфейса
  // await initApp(background)

  let Content = new content(toBackground);
  document.addEventListener('DOMContentLoaded', Content.init);
  global.Content = Content;
}

function msgHandler(msg, sender) {
  console.log(msg);
  console.log(sender);
}

setupUi();
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/ui/content.js":
/*!***************************!*\
  !*** ./src/ui/content.js ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const Storage = __webpack_require__(/*! ../utils/localStorage */ "./src/utils/localStorage.js");

var Content = function Content(port) {
  let storage = new Storage();

  function syncTask() {
    let task = storage.task.loadTask();
    let taskId = Object.keys(task);

    if (taskId.length > 0) {
      let html = ``;

      for (let i = 0; i < taskId.length; i++) {
        html += `
                <div class="" >
                    <h5 taskId='${taskId[i]}'>type: ${task[taskId[i]].type}; id: ${taskId[i]}</h5>
                    <button taskId='${taskId[i]}' taskApply="true">agree</button>
                    <button taskId='${taskId[i]}' taskApply="false">degree</button>
                </div>
                `;
      }

      $('#body').html(html);
    }
  }

  function syncAcc() {
    let accs = storage.user.loadUser();
    let names = Object.keys(accs);

    if (names.length === 0) {} else {
      let html = ``;

      for (let i = 0; i < names.length; i++) {
        html += `
                <div class="">
                    <h5>name: ${names[i]}</h5>
                    <h5>net: ${accs[names[i]].net}</h5>
                    <h5>pub: ${accs[names[i]].pubkey}</h5>
                </div>
                `;
      }

      $('#header').html(html);
    }
  }

  function eventHandler() {
    $('body').on('click', "[taskId]", function () {
      console.log('click task ', $(this).attr('taskId'));
      let task = $(this).attr('taskId');

      if ($(this).attr('taskApply') === 'true') {
        port.postMessage({
          taskId: task,
          agree: true
        });
      } else {
        port.postMessage({
          taskId: task,
          agree: false
        });
      }
    });
  }

  function addAcc() {}

  this.init = function () {
    syncAcc();
    syncTask();
    eventHandler();
  };

  this.addAcc = addAcc();
};

module.exports = Content;

/***/ }),

/***/ "./src/utils/localStorage.js":
/*!***********************************!*\
  !*** ./src/utils/localStorage.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

function loadTask() {
  let task = localStorage.getItem('Task');

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
  let task = loadTask();
  return task[key];
}

function removeTask(key) {
  let task = loadTask();
  delete task[key];
  task = JSON.stringify(task);
  localStorage.setItem('Task', task);
  return task;
}

function setTask(key, value) {
  let tasks = loadTask();
  tasks[key] = value;
  tasks = JSON.stringify(tasks);
  localStorage.setItem('Task', tasks);
  return tasks;
}

function loadUser() {
  let user = localStorage.getItem('User');

  if (!user) {
    return {};
  }

  user = JSON.parse(user);
  return user;
}

function addUser(name, pubkey, prvkey, net) {
  let user = loadUser();
  user[name] = {
    pubkey: pubkey,
    prvkey: prvkey,
    net: net
  };
  user = JSON.stringify(user);
  localStorage.setItem('User', user);
  return user;
}

function removeUser(name) {
  let user = loadUser();
  delete user[name];
  user = JSON.stringify(user);
  localStorage.setItem('User', user);
  return user;
}

function getUser(name) {
  let user = loadUser();
  return user[name];
}

function clearUsers() {
  localStorage.removeItem('User');
}

let storage = function Storage() {
  this.task = {
    loadTask: loadTask,
    setTask: setTask,
    getTask: getTask,
    removeTask: removeTask,
    clearTasks: clearTasks
  };
  this.user = {
    loadUser: loadUser,
    addUser: addUser,
    getUser: getUser,
    removeUser: removeUser,
    clearUsers: clearUsers
  };
};

module.exports = storage;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcG9wdXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VpL2NvbnRlbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2xvY2FsU3RvcmFnZS5qcyJdLCJuYW1lcyI6WyJjb250ZW50IiwicmVxdWlyZSIsInRvQmFja2dyb3VuZCIsInRhc2tJZCIsInNldHVwVWkiLCJjaHJvbWUiLCJydW50aW1lIiwiY29ubmVjdCIsIm5hbWUiLCJvbk1lc3NhZ2UiLCJhZGRMaXN0ZW5lciIsIm1zZyIsInNlbmRlciIsInNlbmRSZXNwb25zZSIsImNiIiwibXNnSGFuZGxlciIsImdsb2JhbCIsIlBvcnQiLCJDb250ZW50IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiaW5pdCIsImNvbnNvbGUiLCJsb2ciLCJTdG9yYWdlIiwicG9ydCIsInN0b3JhZ2UiLCJzeW5jVGFzayIsInRhc2siLCJsb2FkVGFzayIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJodG1sIiwiaSIsInR5cGUiLCIkIiwic3luY0FjYyIsImFjY3MiLCJ1c2VyIiwibG9hZFVzZXIiLCJuYW1lcyIsIm5ldCIsInB1YmtleSIsImV2ZW50SGFuZGxlciIsIm9uIiwiYXR0ciIsInBvc3RNZXNzYWdlIiwiYWdyZWUiLCJhZGRBY2MiLCJtb2R1bGUiLCJleHBvcnRzIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImNsZWFyVGFza3MiLCJyZW1vdmVJdGVtIiwiZ2V0VGFzayIsImtleSIsInJlbW92ZVRhc2siLCJzdHJpbmdpZnkiLCJzZXRJdGVtIiwic2V0VGFzayIsInZhbHVlIiwidGFza3MiLCJhZGRVc2VyIiwicHJ2a2V5IiwicmVtb3ZlVXNlciIsImdldFVzZXIiLCJjbGVhclVzZXJzIl0sIm1hcHBpbmdzIjoi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QTtBQUlSRSxjQUFVLEVBQUNBLFVBSkg7QUFLUkosY0FBVSxFQUFDQTtBQUxILEdBQVo7QUFPQSxPQUFLakIsSUFBTCxHQUFZO0FBQ1JDLFlBQVEsRUFBQ0EsUUFERDtBQUVSMEIsV0FBTyxFQUFDQSxPQUZBO0FBR1JHLFdBQU8sRUFBQ0EsT0FIQTtBQUlSRCxjQUFVLEVBQUNBLFVBSkg7QUFLUkUsY0FBVSxFQUFDQTtBQUxILEdBQVo7QUFPSCxDQWZEOztBQWlCQXBCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnpCLE9BQWpCLEMiLCJmaWxlIjoicG9wdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BvcHVwLmpzXCIpO1xuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwiY29uc3QgY29udGVudCA9IHJlcXVpcmUoJy4vdWkvY29udGVudCcpXG5cbnZhciB0b0JhY2tncm91bmQgPSB7fTtcbnZhciB0YXNrSWQgPSBbXVxuYXN5bmMgZnVuY3Rpb24gc2V0dXBVaSgpIHtcbiAgICB0b0JhY2tncm91bmQgPSBjaHJvbWUucnVudGltZS5jb25uZWN0KHtuYW1lOidwb3B1cCd9KVxuICAgIHRvQmFja2dyb3VuZC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIoKG1zZyxzZW5kZXIsIHNlbmRSZXNwb25zZSk9PntcbiAgICAgICAgdmFyIGNiID0gdGFza0lkW21zZy50YXNrSWRdXG4gICAgICAgIGlmKGNiKXtcbiAgICAgICAgICAgIGNiKG1zZylcbiAgICAgICAgICAgIGRlbGV0ZSB0YXNrSWRbbXNnLnRhc2tJZF1cbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIG1zZ0hhbmRsZXIobXNnLCBzZW5kZXIpXG4gICAgfSlcbiAgICBnbG9iYWwuUG9ydCA9IHRvQmFja2dyb3VuZFxuXG4gICAgLy8g0JfQsNC/0YPRgdC6INC40L3RgtC10YDRhNC10LnRgdCwXG4gICAgLy8gYXdhaXQgaW5pdEFwcChiYWNrZ3JvdW5kKVxuICAgIGxldCBDb250ZW50ID0gbmV3IGNvbnRlbnQodG9CYWNrZ3JvdW5kKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLENvbnRlbnQuaW5pdClcbiAgICBnbG9iYWwuQ29udGVudCA9IENvbnRlbnRcbn1cblxuZnVuY3Rpb24gbXNnSGFuZGxlcihtc2csIHNlbmRlcil7XG4gICAgY29uc29sZS5sb2cobXNnKVxuICAgIGNvbnNvbGUubG9nKHNlbmRlcilcbn1cblxuc2V0dXBVaSgpIiwiY29uc3QgU3RvcmFnZSA9IHJlcXVpcmUoJy4uL3V0aWxzL2xvY2FsU3RvcmFnZScpXG5cbnZhciBDb250ZW50ID0gZnVuY3Rpb24gQ29udGVudChwb3J0KXtcbiAgICBsZXQgc3RvcmFnZT0gbmV3IFN0b3JhZ2UoKVxuICAgIGZ1bmN0aW9uIHN5bmNUYXNrKCl7XG4gICAgICAgIGxldCB0YXNrID0gc3RvcmFnZS50YXNrLmxvYWRUYXNrKClcbiAgICAgICAgbGV0IHRhc2tJZCA9IE9iamVjdC5rZXlzKHRhc2spXG4gICAgICAgIGlmKHRhc2tJZC5sZW5ndGg+MCl7XG4gICAgICAgICAgICBsZXQgaHRtbCA9IGBgXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPCB0YXNrSWQubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gYFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJcIiA+XG4gICAgICAgICAgICAgICAgICAgIDxoNSB0YXNrSWQ9JyR7dGFza0lkW2ldfSc+dHlwZTogJHt0YXNrW3Rhc2tJZFtpXV0udHlwZX07IGlkOiAke3Rhc2tJZFtpXX08L2g1PlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHRhc2tJZD0nJHt0YXNrSWRbaV19JyB0YXNrQXBwbHk9XCJ0cnVlXCI+YWdyZWU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0YXNrSWQ9JyR7dGFza0lkW2ldfScgdGFza0FwcGx5PVwiZmFsc2VcIj5kZWdyZWU8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKCcjYm9keScpLmh0bWwoaHRtbClcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBzeW5jQWNjKCl7XG4gICAgICAgIGxldCBhY2NzID0gc3RvcmFnZS51c2VyLmxvYWRVc2VyKClcbiAgICAgICAgbGV0IG5hbWVzID0gT2JqZWN0LmtleXMoYWNjcylcbiAgICAgICAgaWYobmFtZXMubGVuZ3RoID09PSAwICl7XG5cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBsZXQgaHRtbCA9IGBgXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPG5hbWVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBodG1sKz1gXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIlwiPlxuICAgICAgICAgICAgICAgICAgICA8aDU+bmFtZTogJHtuYW1lc1tpXX08L2g1PlxuICAgICAgICAgICAgICAgICAgICA8aDU+bmV0OiAke2FjY3NbbmFtZXNbaV1dLm5ldH08L2g1PlxuICAgICAgICAgICAgICAgICAgICA8aDU+cHViOiAke2FjY3NbbmFtZXNbaV1dLnB1YmtleX08L2g1PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoJyNoZWFkZXInKS5odG1sKGh0bWwpXG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZXZlbnRIYW5kbGVyKCl7XG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCBcIlt0YXNrSWRdXCIsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbGljayB0YXNrICcsICQodGhpcykuYXR0cigndGFza0lkJykpXG4gICAgICAgICAgICBsZXQgdGFzayA9ICQodGhpcykuYXR0cigndGFza0lkJylcbiAgICAgICAgICAgIGlmKCQodGhpcykuYXR0cigndGFza0FwcGx5JykgPT09ICd0cnVlJyl7XG4gICAgICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7dGFza0lkOnRhc2ssIGFncmVlOnRydWV9KVxuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2Uoe3Rhc2tJZDp0YXNrLCBhZ3JlZTpmYWxzZX0pXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgfVxuICAgIGZ1bmN0aW9uIGFkZEFjYygpe31cbiAgICB0aGlzLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICBzeW5jQWNjKClcbiAgICAgICAgc3luY1Rhc2soKVxuICAgICAgICBldmVudEhhbmRsZXIoKVxuICAgIH1cbiAgICB0aGlzLmFkZEFjYyA9IGFkZEFjYygpXG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGVudFxuIiwiXG5mdW5jdGlvbiBsb2FkVGFzaygpe1xuICAgIGxldCB0YXNrID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1Rhc2snKVxuICAgIGlmKCF0YXNrKXtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICAgIHRhc2sgPSBKU09OLnBhcnNlKHRhc2spXG4gICAgcmV0dXJuIHRhc2tcbn1cblxuZnVuY3Rpb24gY2xlYXJUYXNrcygpe1xuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnVGFzaycpXG59XG5cbmZ1bmN0aW9uIGdldFRhc2soa2V5KXtcbiAgICBsZXQgdGFzayA9IGxvYWRUYXNrKClcbiAgICByZXR1cm4gdGFza1trZXldXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVRhc2soa2V5KXtcbiAgICBsZXQgdGFzayA9IGxvYWRUYXNrKClcbiAgICBkZWxldGUgdGFza1trZXldXG4gICAgdGFzayA9IEpTT04uc3RyaW5naWZ5KHRhc2spXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1Rhc2snLCB0YXNrKVxuICAgIHJldHVybiB0YXNrXG59XG5cbmZ1bmN0aW9uIHNldFRhc2soa2V5LCB2YWx1ZSl7XG4gICAgbGV0IHRhc2tzID0gbG9hZFRhc2soKVxuICAgIHRhc2tzW2tleV0gPSB2YWx1ZVxuICAgIHRhc2tzID0gSlNPTi5zdHJpbmdpZnkodGFza3MpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1Rhc2snLCB0YXNrcylcbiAgICByZXR1cm4gdGFza3Ncbn1cblxuZnVuY3Rpb24gbG9hZFVzZXIoKXtcbiAgICBsZXQgdXNlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdVc2VyJylcbiAgICBpZighdXNlcil7XG4gICAgICAgIHJldHVybiB7fVxuICAgIH1cbiAgICB1c2VyID0gSlNPTi5wYXJzZSh1c2VyKVxuICAgIHJldHVybiB1c2VyXG59XG5cbmZ1bmN0aW9uIGFkZFVzZXIobmFtZSwgcHVia2V5LCBwcnZrZXksIG5ldCl7XG4gICAgbGV0IHVzZXIgPSBsb2FkVXNlcigpXG4gICAgdXNlcltuYW1lXT17XG4gICAgICAgIHB1YmtleTpwdWJrZXksXG4gICAgICAgIHBydmtleTpwcnZrZXksXG4gICAgICAgIG5ldDpuZXRcbiAgICB9XG4gICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KHVzZXIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1VzZXInLCB1c2VyKVxuICAgIHJldHVybiB1c2VyXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVVzZXIobmFtZSl7XG4gICAgbGV0IHVzZXIgPSBsb2FkVXNlcigpXG4gICAgZGVsZXRlIHVzZXJbbmFtZV1cbiAgICB1c2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcilcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVXNlcicsIHVzZXIpXG4gICAgcmV0dXJuIHVzZXJcbn1cblxuZnVuY3Rpb24gZ2V0VXNlcihuYW1lKXtcbiAgICBsZXQgdXNlciA9IGxvYWRVc2VyKClcbiAgICByZXR1cm4gdXNlcltuYW1lXVxufVxuZnVuY3Rpb24gY2xlYXJVc2Vycygpe1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdVc2VyJylcbn1cblxubGV0IHN0b3JhZ2UgPSBmdW5jdGlvbiBTdG9yYWdlKCl7XG4gICAgdGhpcy50YXNrID0ge1xuICAgICAgICBsb2FkVGFzazpsb2FkVGFzayxcbiAgICAgICAgc2V0VGFzazpzZXRUYXNrLFxuICAgICAgICBnZXRUYXNrOmdldFRhc2ssXG4gICAgICAgIHJlbW92ZVRhc2s6cmVtb3ZlVGFzayxcbiAgICAgICAgY2xlYXJUYXNrczpjbGVhclRhc2tzXG4gICAgfVxuICAgIHRoaXMudXNlciA9IHtcbiAgICAgICAgbG9hZFVzZXI6bG9hZFVzZXIsXG4gICAgICAgIGFkZFVzZXI6YWRkVXNlcixcbiAgICAgICAgZ2V0VXNlcjpnZXRVc2VyLFxuICAgICAgICByZW1vdmVVc2VyOnJlbW92ZVVzZXIsXG4gICAgICAgIGNsZWFyVXNlcnM6Y2xlYXJVc2Vyc1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdG9yYWdlIl0sInNvdXJjZVJvb3QiOiIifQ==