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

const UI = __webpack_require__(/*! ./ui/index */ "./src/ui/index.js");

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
  global.Content = Content;
  await UI(toBackground);
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

/***/ "./src/ui/index.js":
/*!*************************!*\
  !*** ./src/ui/index.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

throw new Error("Module build failed (from ./node_modules/babel-loader/lib/index.js):\nSyntaxError: /Users/roman/work/enq_ext/src/ui/index.js: Support for the experimental syntax 'jsx' isn't currently enabled (7:9):\n\n\u001b[0m \u001b[90m  5 |\u001b[39m \u001b[36mexport\u001b[39m \u001b[36masync\u001b[39m \u001b[36mfunction\u001b[39m initApp(background){\u001b[0m\n\u001b[0m \u001b[90m  6 |\u001b[39m     render(\u001b[0m\n\u001b[0m\u001b[31m\u001b[1m>\u001b[22m\u001b[39m\u001b[90m  7 |\u001b[39m         \u001b[33m<\u001b[39m\u001b[33mApp\u001b[39m background\u001b[33m=\u001b[39m{background}\u001b[33m/\u001b[39m\u001b[33m>\u001b[39m\u001b[33m,\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m    |\u001b[39m         \u001b[31m\u001b[1m^\u001b[22m\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m  8 |\u001b[39m         document\u001b[33m.\u001b[39mgetElementById(\u001b[32m'app-content'\u001b[39m)\u001b[0m\n\u001b[0m \u001b[90m  9 |\u001b[39m     )\u001b[33m;\u001b[39m\u001b[0m\n\u001b[0m \u001b[90m 10 |\u001b[39m }\u001b[0m\n\nAdd @babel/preset-react (https://git.io/JfeDR) to the 'presets' section of your Babel config to enable transformation.\nIf you want to leave it as-is, add @babel/plugin-syntax-jsx (https://git.io/vb4yA) to the 'plugins' section to enable parsing.\n    at Parser._raise (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:776:17)\n    at Parser.raiseWithData (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:769:17)\n    at Parser.expectOnePlugin (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:9198:18)\n    at Parser.parseExprAtom (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10667:22)\n    at Parser.parseExprSubscripts (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10248:23)\n    at Parser.parseUpdate (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10228:21)\n    at Parser.parseMaybeUnary (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10206:23)\n    at Parser.parseExprOps (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10071:23)\n    at Parser.parseMaybeConditional (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10045:23)\n    at Parser.parseMaybeAssign (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10008:21)\n    at /Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:9975:39\n    at Parser.allowInAnd (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:11647:12)\n    at Parser.parseMaybeAssignAllowIn (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:9975:17)\n    at Parser.parseExprListItem (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:11407:18)\n    at Parser.parseCallExpressionArguments (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10448:22)\n    at Parser.parseCoverCallAndAsyncArrowHead (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10356:29)\n    at Parser.parseSubscript (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10292:19)\n    at Parser.parseSubscripts (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10265:19)\n    at Parser.parseExprSubscripts (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10254:17)\n    at Parser.parseUpdate (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10228:21)\n    at Parser.parseMaybeUnary (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10206:23)\n    at Parser.parseExprOps (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10071:23)\n    at Parser.parseMaybeConditional (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10045:23)\n    at Parser.parseMaybeAssign (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:10008:21)\n    at Parser.parseExpressionBase (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:9953:23)\n    at /Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:9947:39\n    at Parser.allowInAnd (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:11641:16)\n    at Parser.parseExpression (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:9947:17)\n    at Parser.parseStatementContent (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:11907:23)\n    at Parser.parseStatement (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:11776:17)\n    at Parser.parseBlockOrModuleBlockBody (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:12358:25)\n    at Parser.parseBlockBody (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:12349:10)\n    at Parser.parseBlock (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:12333:10)\n    at Parser.parseFunctionBody (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:11319:24)\n    at Parser.parseFunctionBodyAndFinish (/Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:11303:10)\n    at /Users/roman/work/enq_ext/node_modules/@babel/core/node_modules/@babel/parser/lib/index.js:12491:12");

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcG9wdXAuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3VpL2NvbnRlbnQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3V0aWxzL2xvY2FsU3RvcmFnZS5qcyJdLCJuYW1lcyI6WyJjb250ZW50IiwicmVxdWlyZSIsIlVJIiwidG9CYWNrZ3JvdW5kIiwidGFza0lkIiwic2V0dXBVaSIsImNocm9tZSIsInJ1bnRpbWUiLCJjb25uZWN0IiwibmFtZSIsIm9uTWVzc2FnZSIsImFkZExpc3RlbmVyIiwibXNnIiwic2VuZGVyIiwic2VuZFJlc3BvbnNlIiwiY2IiLCJtc2dIYW5kbGVyIiwiZ2xvYmFsIiwiUG9ydCIsIkNvbnRlbnQiLCJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJpbml0IiwiY29uc29sZSIsImxvZyIsIlN0b3JhZ2UiLCJwb3J0Iiwic3RvcmFnZSIsInN5bmNUYXNrIiwidGFzayIsImxvYWRUYXNrIiwiT2JqZWN0Iiwia2V5cyIsImxlbmd0aCIsImh0bWwiLCJpIiwidHlwZSIsIiQiLCJzeW5jQWNjIiwiYWNjcyIsInVzZXIiLCJsb2FkVXNlciIsIm5hbWVzIiwibmV0IiwicHVia2V5IiwiZXZlbnRIYW5kbGVyIiwib24iLCJhdHRyIiwicG9zdE1lc3NhZ2UiLCJhZ3JlZSIsImFkZEFjYyIsIm1vZHVsZSIsImV4cG9ydHMiLCJsb2NhbFN0b3JhZ2UiLCJnZXRJdGVtIiwiSlNPTiIsInBhcnNlIiwiY2xlYXJUYXNrcyIsInJlbW92ZUl0ZW0iLCJnZXRUYXNrIiwia2V5IiwicmVtb3ZlVGFzayIsInN0cmluZ2lmeSIsInNldEl0ZW0iLCJzZXRUYXNrIiwidmFsdWUiLCJ0YXNrcyIsImFkZFVzZXIiLCJwcnZrZXkiLCJyZW1vdmVVc2VyIiwiZ2V0VXNlciIsImNsZWFyVXNlcnMiXSwibWFwcGlu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a0I7QUFDNUIsT0FBS0ksSUFBTCxHQUFZO0FBQ1JDLFlBQVEsRUFBQ0EsUUFERDtBQUVSa0MsV0FBTyxFQUFDQSxPQUZBO0FBR1JMLFdBQU8sRUFBQ0EsT0FIQTtBQUlSRSxjQUFVLEVBQUNBLFVBSkg7QUFLUkosY0FBVSxFQUFDQTtBQUxILEdBQVo7QUFPQSxPQUFLakIsSUFBTCxHQUFZO0FBQ1JDLFlBQVEsRUFBQ0EsUUFERDtBQUVSMEIsV0FBTyxFQUFDQSxPQUZBO0FBR1JHLFdBQU8sRUFBQ0EsT0FIQTtBQUlSRCxjQUFVLEVBQUNBLFVBSkg7QUFLUkUsY0FBVSxFQUFDQTtBQUxILEdBQVo7QUFPSCxDQWZEOztBQWlCQXBCLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnpCLE9BQWpCLEMiLCJmaWxlIjoicG9wdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL3BvcHVwLmpzXCIpO1xuIiwidmFyIGc7XG5cbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXG5nID0gKGZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdGhpcztcbn0pKCk7XG5cbnRyeSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxuXHRnID0gZyB8fCBuZXcgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpO1xufSBjYXRjaCAoZSkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxuXHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIikgZyA9IHdpbmRvdztcbn1cblxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3Ncbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cblxubW9kdWxlLmV4cG9ydHMgPSBnO1xuIiwiY29uc3QgY29udGVudCA9IHJlcXVpcmUoJy4vdWkvY29udGVudCcpXG5jb25zdCBVSSA9IHJlcXVpcmUoJy4vdWkvaW5kZXgnKVxuXG52YXIgdG9CYWNrZ3JvdW5kID0ge307XG52YXIgdGFza0lkID0gW11cbmFzeW5jIGZ1bmN0aW9uIHNldHVwVWkoKSB7XG4gICAgdG9CYWNrZ3JvdW5kID0gY2hyb21lLnJ1bnRpbWUuY29ubmVjdCh7bmFtZToncG9wdXAnfSlcbiAgICB0b0JhY2tncm91bmQub25NZXNzYWdlLmFkZExpc3RlbmVyKChtc2csc2VuZGVyLCBzZW5kUmVzcG9uc2UpPT57XG4gICAgICAgIHZhciBjYiA9IHRhc2tJZFttc2cudGFza0lkXVxuICAgICAgICBpZihjYil7XG4gICAgICAgICAgICBjYihtc2cpXG4gICAgICAgICAgICBkZWxldGUgdGFza0lkW21zZy50YXNrSWRdXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgfVxuICAgICAgICBtc2dIYW5kbGVyKG1zZywgc2VuZGVyKVxuICAgIH0pXG4gICAgZ2xvYmFsLlBvcnQgPSB0b0JhY2tncm91bmRcblxuICAgIC8vINCX0LDQv9GD0YHQuiDQuNC90YLQtdGA0YTQtdC50YHQsFxuICAgIGxldCBDb250ZW50ID0gbmV3IGNvbnRlbnQodG9CYWNrZ3JvdW5kKVxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLENvbnRlbnQuaW5pdClcbiAgICBnbG9iYWwuQ29udGVudCA9IENvbnRlbnRcbiAgICBhd2FpdCBVSSh0b0JhY2tncm91bmQpXG59XG5cbmZ1bmN0aW9uIG1zZ0hhbmRsZXIobXNnLCBzZW5kZXIpe1xuICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICBjb25zb2xlLmxvZyhzZW5kZXIpXG59XG5cbnNldHVwVWkoKSIsImNvbnN0IFN0b3JhZ2UgPSByZXF1aXJlKCcuLi91dGlscy9sb2NhbFN0b3JhZ2UnKVxuXG52YXIgQ29udGVudCA9IGZ1bmN0aW9uIENvbnRlbnQocG9ydCl7XG4gICAgbGV0IHN0b3JhZ2U9IG5ldyBTdG9yYWdlKClcbiAgICBmdW5jdGlvbiBzeW5jVGFzaygpe1xuICAgICAgICBsZXQgdGFzayA9IHN0b3JhZ2UudGFzay5sb2FkVGFzaygpXG4gICAgICAgIGxldCB0YXNrSWQgPSBPYmplY3Qua2V5cyh0YXNrKVxuICAgICAgICBpZih0YXNrSWQubGVuZ3RoPjApe1xuICAgICAgICAgICAgbGV0IGh0bWwgPSBgYFxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTwgdGFza0lkLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICBodG1sICs9IGBcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiXCIgPlxuICAgICAgICAgICAgICAgICAgICA8aDUgdGFza0lkPScke3Rhc2tJZFtpXX0nPnR5cGU6ICR7dGFza1t0YXNrSWRbaV1dLnR5cGV9OyBpZDogJHt0YXNrSWRbaV19PC9oNT5cbiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0YXNrSWQ9JyR7dGFza0lkW2ldfScgdGFza0FwcGx5PVwidHJ1ZVwiPmFncmVlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdGFza0lkPScke3Rhc2tJZFtpXX0nIHRhc2tBcHBseT1cImZhbHNlXCI+ZGVncmVlPC9idXR0b24+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgYFxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnI2JvZHknKS5odG1sKGh0bWwpXG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gc3luY0FjYygpe1xuICAgICAgICBsZXQgYWNjcyA9IHN0b3JhZ2UudXNlci5sb2FkVXNlcigpXG4gICAgICAgIGxldCBuYW1lcyA9IE9iamVjdC5rZXlzKGFjY3MpXG4gICAgICAgIGlmKG5hbWVzLmxlbmd0aCA9PT0gMCApe1xuXG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgbGV0IGh0bWwgPSBgYFxuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTxuYW1lcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgaHRtbCs9YFxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJcIj5cbiAgICAgICAgICAgICAgICAgICAgPGg1Pm5hbWU6ICR7bmFtZXNbaV19PC9oNT5cbiAgICAgICAgICAgICAgICAgICAgPGg1Pm5ldDogJHthY2NzW25hbWVzW2ldXS5uZXR9PC9oNT5cbiAgICAgICAgICAgICAgICAgICAgPGg1PnB1YjogJHthY2NzW25hbWVzW2ldXS5wdWJrZXl9PC9oNT5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICBgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAkKCcjaGVhZGVyJykuaHRtbChodG1sKVxuICAgICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIGV2ZW50SGFuZGxlcigpe1xuICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgXCJbdGFza0lkXVwiLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2xpY2sgdGFzayAnLCAkKHRoaXMpLmF0dHIoJ3Rhc2tJZCcpKVxuICAgICAgICAgICAgbGV0IHRhc2sgPSAkKHRoaXMpLmF0dHIoJ3Rhc2tJZCcpXG4gICAgICAgICAgICBpZigkKHRoaXMpLmF0dHIoJ3Rhc2tBcHBseScpID09PSAndHJ1ZScpe1xuICAgICAgICAgICAgICAgIHBvcnQucG9zdE1lc3NhZ2Uoe3Rhc2tJZDp0YXNrLCBhZ3JlZTp0cnVlfSlcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICBwb3J0LnBvc3RNZXNzYWdlKHt0YXNrSWQ6dGFzaywgYWdyZWU6ZmFsc2V9KVxuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgIH1cbiAgICBmdW5jdGlvbiBhZGRBY2MoKXt9XG4gICAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgc3luY0FjYygpXG4gICAgICAgIHN5bmNUYXNrKClcbiAgICAgICAgZXZlbnRIYW5kbGVyKClcbiAgICB9XG4gICAgdGhpcy5hZGRBY2MgPSBhZGRBY2MoKVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IENvbnRlbnRcbiIsIlxuZnVuY3Rpb24gbG9hZFRhc2soKXtcbiAgICBsZXQgdGFzayA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdUYXNrJylcbiAgICBpZighdGFzayl7XG4gICAgICAgIHJldHVybiB7fVxuICAgIH1cbiAgICB0YXNrID0gSlNPTi5wYXJzZSh0YXNrKVxuICAgIHJldHVybiB0YXNrXG59XG5cbmZ1bmN0aW9uIGNsZWFyVGFza3MoKXtcbiAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ1Rhc2snKVxufVxuXG5mdW5jdGlvbiBnZXRUYXNrKGtleSl7XG4gICAgbGV0IHRhc2sgPSBsb2FkVGFzaygpXG4gICAgcmV0dXJuIHRhc2tba2V5XVxufVxuXG5mdW5jdGlvbiByZW1vdmVUYXNrKGtleSl7XG4gICAgbGV0IHRhc2sgPSBsb2FkVGFzaygpXG4gICAgZGVsZXRlIHRhc2tba2V5XVxuICAgIHRhc2sgPSBKU09OLnN0cmluZ2lmeSh0YXNrKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdUYXNrJywgdGFzaylcbiAgICByZXR1cm4gdGFza1xufVxuXG5mdW5jdGlvbiBzZXRUYXNrKGtleSwgdmFsdWUpe1xuICAgIGxldCB0YXNrcyA9IGxvYWRUYXNrKClcbiAgICB0YXNrc1trZXldID0gdmFsdWVcbiAgICB0YXNrcyA9IEpTT04uc3RyaW5naWZ5KHRhc2tzKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdUYXNrJywgdGFza3MpXG4gICAgcmV0dXJuIHRhc2tzXG59XG5cbmZ1bmN0aW9uIGxvYWRVc2VyKCl7XG4gICAgbGV0IHVzZXIgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnVXNlcicpXG4gICAgaWYoIXVzZXIpe1xuICAgICAgICByZXR1cm4ge31cbiAgICB9XG4gICAgdXNlciA9IEpTT04ucGFyc2UodXNlcilcbiAgICByZXR1cm4gdXNlclxufVxuXG5mdW5jdGlvbiBhZGRVc2VyKG5hbWUsIHB1YmtleSwgcHJ2a2V5LCBuZXQpe1xuICAgIGxldCB1c2VyID0gbG9hZFVzZXIoKVxuICAgIHVzZXJbbmFtZV09e1xuICAgICAgICBwdWJrZXk6cHVia2V5LFxuICAgICAgICBwcnZrZXk6cHJ2a2V5LFxuICAgICAgICBuZXQ6bmV0XG4gICAgfVxuICAgIHVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdVc2VyJywgdXNlcilcbiAgICByZXR1cm4gdXNlclxufVxuXG5mdW5jdGlvbiByZW1vdmVVc2VyKG5hbWUpe1xuICAgIGxldCB1c2VyID0gbG9hZFVzZXIoKVxuICAgIGRlbGV0ZSB1c2VyW25hbWVdXG4gICAgdXNlciA9IEpTT04uc3RyaW5naWZ5KHVzZXIpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ1VzZXInLCB1c2VyKVxuICAgIHJldHVybiB1c2VyXG59XG5cbmZ1bmN0aW9uIGdldFVzZXIobmFtZSl7XG4gICAgbGV0IHVzZXIgPSBsb2FkVXNlcigpXG4gICAgcmV0dXJuIHVzZXJbbmFtZV1cbn1cbmZ1bmN0aW9uIGNsZWFyVXNlcnMoKXtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnVXNlcicpXG59XG5cbmxldCBzdG9yYWdlID0gZnVuY3Rpb24gU3RvcmFnZSgpe1xuICAgIHRoaXMudGFzayA9IHtcbiAgICAgICAgbG9hZFRhc2s6bG9hZFRhc2ssXG4gICAgICAgIHNldFRhc2s6c2V0VGFzayxcbiAgICAgICAgZ2V0VGFzazpnZXRUYXNrLFxuICAgICAgICByZW1vdmVUYXNrOnJlbW92ZVRhc2ssXG4gICAgICAgIGNsZWFyVGFza3M6Y2xlYXJUYXNrc1xuICAgIH1cbiAgICB0aGlzLnVzZXIgPSB7XG4gICAgICAgIGxvYWRVc2VyOmxvYWRVc2VyLFxuICAgICAgICBhZGRVc2VyOmFkZFVzZXIsXG4gICAgICAgIGdldFVzZXI6Z2V0VXNlcixcbiAgICAgICAgcmVtb3ZlVXNlcjpyZW1vdmVVc2VyLFxuICAgICAgICBjbGVhclVzZXJzOmNsZWFyVXNlcnNcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmFnZSJdLCJzb3VyY2VSb290IjoiIn0=