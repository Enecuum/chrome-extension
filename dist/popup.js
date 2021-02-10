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

/* WEBPACK VAR INJECTION */(function(global) {const content = __webpack_require__(/*! ./ui/content */ "./src/ui/content.js"); // const UI = require('./ui/index')


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

  let Content = new content(toBackground);
  document.addEventListener('DOMContentLoaded', Content.init);
  global.Content = Content; // await UI(toBackground)
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
                    <h5>type: ${task[taskId[i]].type}; id: ${taskId[i]}</h5>
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

    if (names.length === 0) {
      html = addBlock();
      $('#header').html(html);
    } else {
      let html = ``;
      html += addBtn();

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

  function addBlock() {
    let html = `<div className="container">
            <div className="">
                <input type="text" id="accName" placeholder="acc Name">
            </div>
            <div className="">
                <input type="text" id="pvtkey" placeholder="private key">
            </div>
            <div className="">
                <select name="net" id="net">
                    <option value="https://pulse.enecuum.com">pulse</option>
                    <option value="https://bit.enecuum.com">bit</option>
                    <option value="http://95.216.207.173">f3</option>
                </select>
            </div>
            <div className="">
                <button addAccBtn className="btn success">add</button>
                <button addAccBtnCnl className="btn success">Cancel</button>
            </div>
        </div>`;
    return html;
  }

  function addBtn() {
    let html = `<div>
                    <button addBtn class="success">add Acc</button>
                </div>   `;
    return html;
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

      syncTask();
    });
    $('body').on('click', "[addAccBtn]", function () {
      console.log('add ', $('#pvtkey').val());
      let name = $('#accName').val();
      let pvtkey = $('#pvtkey').val();
      let pubkey = ENQWeb.Utils.Sign.getPublicKey(pvtkey, true);
      let net = $('select[name=net]').val();
      console.log(name, pubkey, pvtkey, net);
      storage.user.addUser(name, pubkey, pvtkey, net);
      storage.mainAcc.set(name);
      syncAcc();
    });
    $('body').on('click', '[addBtn]', function () {
      let html = addBlock();
      $('#header').html(html);
    });
    $('body').on('click', '[addAccBtnCnl]', function () {
      syncAcc();
    });
  }

  this.init = function () {
    syncAcc();
    syncTask();
    eventHandler();
  };
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

function setMainUser(name) {
  let user = loadUser();
  localStorage.setItem('MainAcc', JSON.stringify(user[name]));
  return true;
}

function unsetMainUser() {
  localStorage.removeItem('MainAcc');
  return true;
}

function getMainUser() {
  let acc = localStorage.getItem('MainAcc');
  return acc;
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
  this.mainAcc = {
    get: getMainUser,
    set: setMainUser,
    unset: unsetMainUser
  };
};

module.exports = storage;

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcG9wdXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VpL2NvbnRlbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2xvY2FsU3RvcmFnZS5qcyJdLCJuYW1lcyI6WyJjb250ZW50IiwicmVxdWlyZSIsInRvQmFja2dyb3VuZCIsInRhc2tJZCIsInNldHVwVWkiLCJjaHJvbWUiLCJydW50aW1lIiwiY29ubmVjdCIsIm5hbWUiLCJvbk1lc3NhZ2UiLCJhZGRMaXN0ZW5lciIsIm1zZyIsInNlbmRlciIsInNlbmRSZXNwb25zZSIsImNiIiwibXNnSGFuZGxlciIsImdsb2JhbCIsIlBvcnQiLCJDb250ZW50IiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwiaW5pdCIsImNvbnNvbGUiLCJsb2ciLCJTdG9yYWdlIiwicG9ydCIsInN0b3JhZ2UiLCJzeW5jVGFzayIsInRhc2siLCJsb2FkVGFzayIsIk9iamVjdCIsImtleXMiLCJsZW5ndGgiLCJodG1sIiwiaSIsInR5cGUiLCIkIiwic3luY0FjYyIsImFjY3MiLCJ1c2VyIiwibG9hZFVzZXIiLCJuYW1lcyIsImFkZEJsb2NrIiwiYWRkQnRuIiwibmV0IiwicHVia2V5IiwiZXZlbnRIYW5kbGVyIiwib24iLCJhdHRyIiwicG9zdE1lc3NhZ2UiLCJhZ3JlZSIsInZhbCIsInB2dGtleSIsIkVOUVdlYiIsIlV0aWxzIiwiU2lnbiIsImdldFB1YmxpY0tleSIsImFkZFVzZXIiLCJtYWluQWNjIiwic2V0IiwibW9kdWxlIiwiZXhwb3J0cyIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJKU09OIiwicGFyc2UiLCJjbGVhclRhc2tzIiwicmVtb3ZlSXRlbSIsImdldFRhc2siLCJrZXkiLCJyZW1vdmVUYXNrIiwic3RyaW5naWZ5Iiwic2V0SXRlbSIsInNldFRhc2siLCJ2YWx1ZSIsInRhc2tzIiwic2V0TWFpblVzZXIiLCJ1bnNldE1haW5Vc2VyIiwiZ2V0TWFpblVzZXIiLCJhY2MiLCJwcnZrZXkiLCJyZW1vdmVVc2VyIiwiZ2V0VXNlciIsImNsZWFyVXNlcnMiLCJnZXQiLCJ1bnNldCJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7Ozs7O0FDbkJBLG9EQUFNQSxPQUFPLEdBQUdDLG1CQUFPLENBQUMseUNBQUQsQ0FBdkIsQyxDQUNBOzs7QUFFQSxJQUFJQyxZQUFZLEdBQUcsRUFBbkI7QUFDQSxJQUFJQyxNQUFNLEdBQUcsRUFBYjs7QUFDQSxlQUFlQyxPQUFmLEdBQXlCO0FBQ3JCRixjQUFZLEdBQUdHLE1B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QUFRLEVBQUNBLFFBREQ7QUFFUmlCLFdBQU8sRUFBQ0EsT0FGQTtBQUdSeUIsV0FBTyxFQUFDQSxPQUhBO0FBSVJELGNBQVUsRUFBQ0EsVUFKSDtBQUtSRSxjQUFVLEVBQUNBO0FBTEgsR0FBWjtBQU9BLE9BQUt6QixPQUFMLEdBQWU7QUFDWDBCLE9BQUcsRUFBQ04sV0FETztBQUVYbkIsT0FBRyxFQUFDaUIsV0FGTztBQUdYUyxTQUFLLEVBQUNSO0FBSEssR0FBZjtBQUtILENBcEJEOztBQXNCQWpCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5DLE9BQWpCLEMiLCJmaWxlIjoicG9wdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BvcHVwLmpzXCIpO1xuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwiY29uc3QgY29udGVudCA9IHJlcXVpcmUoJy4vdWkvY29udGVudCcpXG4vLyBjb25zdCBVSSA9IHJlcXVpcmUoJy4vdWkvaW5kZXgnKVxuXG52YXIgdG9CYWNrZ3JvdW5kID0ge307XG52YXIgdGFza0lkID0gW11cbmFzeW5jIGZ1bmN0aW9uIHNldHVwVWkoKSB7XG4gICAgdG9CYWNrZ3JvdW5kID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7bmFtZToncG9wdXAnfSlcbiAgICB0b0JhY2tncm91bmQub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2csc2VuZGVyLCBzZW5kUmVzcG9uc2UpPT57XG4gICAgICAgIHZhciBjYiA9IHRhc2tJZFttc2cudGFza0lkXVxuICAgICAgICBpZihjYil7XG4gICAgICAgICAgICBjYihtc2cpXG4gICAgICAgICAgICBkZWxldGUgdGFza0lkW21zZy50YXNrSWRdXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBtc2dIYW5kbGVyKG1zZywgc2VuZGVyKVxuICAgIH0pXG4gICAgZ2xvYmFsLlBvcnQgPSB0b0JhY2tncm91bmRcblxuICAgIC8vINCX0LDQv9GD0YHQuiDQuNC90YLQtdGA0YTQtdC50YHQsFxuICAgIGxldCBDb250ZW50ID0gbmV3IGNvbnRlbnQodG9CYWNrZ3JvdW5kKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLENvbnRlbnQuaW5pdClcbiAgICBnbG9iYWwuQ29udGVudCA9IENvbnRlbnRcbiAgICAvLyBhd2FpdCBVSSh0b0JhY2tncm91bmQpXG59XG5cbmZ1bmN0aW9uIG1zZ0hhbmRsZXIobXNnLCBzZW5kZXIpe1xuICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICBjb25zb2xlLmxvZyhzZW5kZXIpXG59XG5cbnNldHVwVWkoKVxuIiwiY29uc3QgU3RvcmFnZSA9IHJlcXVpcmUoJy4uL3V0aWxzL2xvY2FsU3RvcmFnZScpXG5cbnZhciBDb250ZW50ID0gZnVuY3Rpb24gQ29udGVudChwb3J0KXtcbiAgICBsZXQgc3RvcmFnZT0gbmV3IFN0b3JhZ2UoKVxuICAgIGZ1bmN0aW9uIHN5bmNUYXNrKCl7XG4gICAgICAgIGxldCB0YXNrID0gc3RvcmFnZS50YXNrLmxvYWRUYXNrKClcbiAgICAgICAgbGV0IHRhc2tJZCA9IE9iamVjdC5rZXlzKHRhc2spXG4gICAgICAgIGlmKHRhc2tJZC5sZW5ndGg+MCl7XG4gICAgICAgICAgICBsZXQgaHRtbCA9IGBgXG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPCB0YXNrSWQubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGh0bWwgKz0gYFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJcIiA+XG4gICAgICAgICAgICAgICAgICAgIDxoNT50eXBlOiAke3Rhc2tbdGFza0lkW2ldXS50eXBlfTsgaWQ6ICR7dGFza0lkW2ldfTwvaDU+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdGFza0lkPScke3Rhc2tJZFtpXX0nIHRhc2tBcHBseT1cInRydWVcIj5hZ3JlZTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHRhc2tJZD0nJHt0YXNrSWRbaV19JyB0YXNrQXBwbHk9XCJmYWxzZVwiPmRlZ3JlZTwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIGBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoJyNib2R5JykuaHRtbChodG1sKVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIHN5bmNBY2MoKXtcbiAgICAgICAgbGV0IGFjY3MgPSBzdG9yYWdlLnVzZXIubG9hZFVzZXIoKVxuICAgICAgICBsZXQgbmFtZXMgPSBPYmplY3Qua2V5cyhhY2NzKVxuICAgICAgICBpZihuYW1lcy5sZW5ndGggPT09IDAgKXtcbiAgICAgICAgICAgIGh0bWwgPSBhZGRCbG9jaygpXG4gICAgICAgICAgICAkKCcjaGVhZGVyJykuaHRtbChodG1sKVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCBodG1sID0gYGBcbiAgICAgICAgICAgIGh0bWwgKz0gYWRkQnRuKClcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8bmFtZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgIGh0bWwrPWBcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiXCI+XG4gICAgICAgICAgICAgICAgICAgIDxoNT5uYW1lOiAke25hbWVzW2ldfTwvaDU+XG4gICAgICAgICAgICAgICAgICAgIDxoNT5uZXQ6ICR7YWNjc1tuYW1lc1tpXV0ubmV0fTwvaDU+XG4gICAgICAgICAgICAgICAgICAgIDxoNT5wdWI6ICR7YWNjc1tuYW1lc1tpXV0ucHVia2V5fTwvaDU+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnI2hlYWRlcicpLmh0bWwoaHRtbClcbiAgICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBhZGRCbG9jaygpe1xuICAgICAgICBsZXQgaHRtbCA9IGA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJcIj5cbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cImFjY05hbWVcIiBwbGFjZWhvbGRlcj1cImFjYyBOYW1lXCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiXCI+XG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgaWQ9XCJwdnRrZXlcIiBwbGFjZWhvbGRlcj1cInByaXZhdGUga2V5XCI+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiXCI+XG4gICAgICAgICAgICAgICAgPHNlbGVjdCBuYW1lPVwibmV0XCIgaWQ9XCJuZXRcIj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImh0dHBzOi8vcHVsc2UuZW5lY3V1bS5jb21cIj5wdWxzZTwvb3B0aW9uPlxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwiaHR0cHM6Ly9iaXQuZW5lY3V1bS5jb21cIj5iaXQ8L29wdGlvbj5cbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImh0dHA6Ly85NS4yMTYuMjA3LjE3M1wiPmYzPC9vcHRpb24+XG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiXCI+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBhZGRBY2NCdG4gY2xhc3NOYW1lPVwiYnRuIHN1Y2Nlc3NcIj5hZGQ8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8YnV0dG9uIGFkZEFjY0J0bkNubCBjbGFzc05hbWU9XCJidG4gc3VjY2Vzc1wiPkNhbmNlbDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PmBcbiAgICAgICAgcmV0dXJuIGh0bWxcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRCdG4oKXtcbiAgICAgICAgbGV0IGh0bWwgPSBgPGRpdj5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBhZGRCdG4gY2xhc3M9XCJzdWNjZXNzXCI+YWRkIEFjYzwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PiAgIGBcbiAgICAgICAgcmV0dXJuIGh0bWxcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBldmVudEhhbmRsZXIoKXtcbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsIFwiW3Rhc2tJZF1cIixmdW5jdGlvbigpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsaWNrIHRhc2sgJywgJCh0aGlzKS5hdHRyKCd0YXNrSWQnKSlcbiAgICAgICAgICAgIGxldCB0YXNrID0gJCh0aGlzKS5hdHRyKCd0YXNrSWQnKVxuICAgICAgICAgICAgaWYoJCh0aGlzKS5hdHRyKCd0YXNrQXBwbHknKSA9PT0gJ3RydWUnKXtcbiAgICAgICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHt0YXNrSWQ6dGFzaywgYWdyZWU6dHJ1ZX0pXG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgcG9ydC5wb3N0TWVzc2FnZSh7dGFza0lkOnRhc2ssIGFncmVlOmZhbHNlfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN5bmNUYXNrKClcbiAgICAgICAgfSlcbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsIFwiW2FkZEFjY0J0bl1cIiwgZnVuY3Rpb24gKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnYWRkICcsICQoJyNwdnRrZXknKS52YWwoKSlcbiAgICAgICAgICAgIGxldCBuYW1lID0gJCgnI2FjY05hbWUnKS52YWwoKVxuICAgICAgICAgICAgbGV0IHB2dGtleSA9ICQoJyNwdnRrZXknKS52YWwoKVxuICAgICAgICAgICAgbGV0IHB1YmtleSA9IEVOUVdlYi5VdGlscy5TaWduLmdldFB1YmxpY0tleShwdnRrZXksIHRydWUpXG4gICAgICAgICAgICBsZXQgbmV0ID0gJCgnc2VsZWN0W25hbWU9bmV0XScpLnZhbCgpXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhuYW1lLCBwdWJrZXksIHB2dGtleSwgbmV0KVxuICAgICAgICAgICAgc3RvcmFnZS51c2VyLmFkZFVzZXIobmFtZSwgcHVia2V5LCBwdnRrZXksbmV0KVxuICAgICAgICAgICAgc3RvcmFnZS5tYWluQWNjLnNldChuYW1lKVxuICAgICAgICAgICAgc3luY0FjYygpXG4gICAgICAgIH0pXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnW2FkZEJ0bl0nLCBmdW5jdGlvbiAoKXtcbiAgICAgICAgICAgIGxldCBodG1sID0gYWRkQmxvY2soKVxuICAgICAgICAgICAgJCgnI2hlYWRlcicpLmh0bWwoaHRtbClcbiAgICAgICAgfSlcbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICdbYWRkQWNjQnRuQ25sXScsIGZ1bmN0aW9uICgpe1xuICAgICAgICAgICAgc3luY0FjYygpXG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgc3luY0FjYygpXG4gICAgICAgIHN5bmNUYXNrKClcbiAgICAgICAgZXZlbnRIYW5kbGVyKClcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gQ29udGVudFxuIiwiXG5mdW5jdGlvbiBsb2FkVGFzaygpe1xuICAgIGxldCB0YXNrID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1Rhc2snKVxuICAgIGlmKCF0YXNrKXtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICAgIHRhc2sgPSBKU09OLnBhcnNlKHRhc2spXG4gICAgcmV0dXJuIHRhc2tcbn1cblxuZnVuY3Rpb24gY2xlYXJUYXNrcygpe1xuICAgIHJldHVybiBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnVGFzaycpXG59XG5cbmZ1bmN0aW9uIGdldFRhc2soa2V5KXtcbiAgICBsZXQgdGFzayA9IGxvYWRUYXNrKClcbiAgICByZXR1cm4gdGFza1trZXldXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVRhc2soa2V5KXtcbiAgICBsZXQgdGFzayA9IGxvYWRUYXNrKClcbiAgICBkZWxldGUgdGFza1trZXldXG4gICAgdGFzayA9IEpTT04uc3RyaW5naWZ5KHRhc2spXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1Rhc2snLCB0YXNrKVxuICAgIHJldHVybiB0YXNrXG59XG5cbmZ1bmN0aW9uIHNldFRhc2soa2V5LCB2YWx1ZSl7XG4gICAgbGV0IHRhc2tzID0gbG9hZFRhc2soKVxuICAgIHRhc2tzW2tleV0gPSB2YWx1ZVxuICAgIHRhc2tzID0gSlNPTi5zdHJpbmdpZnkodGFza3MpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1Rhc2snLCB0YXNrcylcbiAgICByZXR1cm4gdGFza3Ncbn1cblxuZnVuY3Rpb24gbG9hZFVzZXIoKXtcbiAgICBsZXQgdXNlciA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdVc2VyJylcbiAgICBpZighdXNlcil7XG4gICAgICAgIHJldHVybiB7fVxuICAgIH1cbiAgICB1c2VyID0gSlNPTi5wYXJzZSh1c2VyKVxuICAgIHJldHVybiB1c2VyXG59XG5cbmZ1bmN0aW9uIHNldE1haW5Vc2VyKG5hbWUpe1xuICAgIGxldCB1c2VyID0gbG9hZFVzZXIoKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdNYWluQWNjJyxKU09OLnN0cmluZ2lmeSh1c2VyW25hbWVdKSlcbiAgICByZXR1cm4gdHJ1ZVxufVxuXG5mdW5jdGlvbiB1bnNldE1haW5Vc2VyKCl7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ01haW5BY2MnKVxuICAgIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIGdldE1haW5Vc2VyKCl7XG4gICAgbGV0IGFjYyA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdNYWluQWNjJylcbiAgICByZXR1cm4gYWNjXG59XG5cbmZ1bmN0aW9uIGFkZFVzZXIobmFtZSwgcHVia2V5LCBwcnZrZXksIG5ldCl7XG4gICAgbGV0IHVzZXIgPSBsb2FkVXNlcigpXG4gICAgdXNlcltuYW1lXT17XG4gICAgICAgIHB1YmtleTpwdWJrZXksXG4gICAgICAgIHBydmtleTpwcnZrZXksXG4gICAgICAgIG5ldDpuZXRcbiAgICB9XG4gICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KHVzZXIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1VzZXInLCB1c2VyKVxuICAgIHJldHVybiB1c2VyXG59XG5cbmZ1bmN0aW9uIHJlbW92ZVVzZXIobmFtZSl7XG4gICAgbGV0IHVzZXIgPSBsb2FkVXNlcigpXG4gICAgZGVsZXRlIHVzZXJbbmFtZV1cbiAgICB1c2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcilcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVXNlcicsIHVzZXIpXG4gICAgcmV0dXJuIHVzZXJcbn1cblxuZnVuY3Rpb24gZ2V0VXNlcihuYW1lKXtcbiAgICBsZXQgdXNlciA9IGxvYWRVc2VyKClcbiAgICByZXR1cm4gdXNlcltuYW1lXVxufVxuZnVuY3Rpb24gY2xlYXJVc2Vycygpe1xuICAgIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdVc2VyJylcbn1cblxubGV0IHN0b3JhZ2UgPSBmdW5jdGlvbiBTdG9yYWdlKCl7XG4gICAgdGhpcy50YXNrID0ge1xuICAgICAgICBsb2FkVGFzazpsb2FkVGFzayxcbiAgICAgICAgc2V0VGFzazpzZXRUYXNrLFxuICAgICAgICBnZXRUYXNrOmdldFRhc2ssXG4gICAgICAgIHJlbW92ZVRhc2s6cmVtb3ZlVGFzayxcbiAgICAgICAgY2xlYXJUYXNrczpjbGVhclRhc2tzXG4gICAgfVxuICAgIHRoaXMudXNlciA9IHtcbiAgICAgICAgbG9hZFVzZXI6bG9hZFVzZXIsXG4gICAgICAgIGFkZFVzZXI6YWRkVXNlcixcbiAgICAgICAgZ2V0VXNlcjpnZXRVc2VyLFxuICAgICAgICByZW1vdmVVc2VyOnJlbW92ZVVzZXIsXG4gICAgICAgIGNsZWFyVXNlcnM6Y2xlYXJVc2Vyc1xuICAgIH1cbiAgICB0aGlzLm1haW5BY2MgPSB7XG4gICAgICAgIGdldDpnZXRNYWluVXNlcixcbiAgICAgICAgc2V0OnNldE1haW5Vc2VyLFxuICAgICAgICB1bnNldDp1bnNldE1haW5Vc2VyXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JhZ2UiXSwic291cmNlUm9vdCI6IiJ9