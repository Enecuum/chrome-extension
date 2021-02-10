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

/* WEBPACK VAR INJECTION */(function(global) {const storage = __webpack_require__(/*! ./utils/localStorage */ "./src/utils/localStorage.js");

let Storage = new storage();
global.disk = Storage;
let user = {
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
    // switch (msg.type){
    //     case 'enable':
    //         sender.postMessage({data:user.Alice.pubkey,taskId:msg.taskId, cb:msg.cb})
    //         break
    //     case 'balanceOf':
    //         ENQWeb.Enq.provider = 'http://95.216.207.173'
    //         answer = await ENQWeb.Net.get.getBalance(msg.data.address, msg.data.token)
    //         sender.postMessage({data:answer.amount,taskId:msg.taskId,cb:msg.cb})
    //         break
    //     case 'tx':
    //         ENQWeb.Enq.provider = 'http://95.216.207.173'
    //         ENQWeb.Enq.User = user.genesis
    //         ENQWeb.Net.post.tx(user.genesis,msg.data.address,ENQWeb.Enq.ticker,msg.data.amount, '', msg.data.token).then(answer=>{
    //             // console.log(answer)
    //             sender.postMessage({data:answer.hash,taskId:msg.taskId,cb:msg.cb})
    //         }).catch(err=>{}) //TODO catch errors
    //         break
    //     default:
    //         break
    // }
    Storage.task.setTask(msg.taskId, {
      data: msg.data,
      type: msg.type,
      cb: msg.cb
    });
  } else {
    console.log(msg);
  }
}

function msgPopupHandler(msg, sender) {
  console.log(msg);

  if (msg.agree) {
    taskHandler(msg.taskId);
  } else {
    Storage.task.removeTask(msg.taskId);
    console.log('removed');
  }
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

function taskHandler(taskId) {
  let task = Storage.task.getTask(taskId);
  console.log(task);
  let acc = Storage.mainAcc.get();

  switch (task.id) {
    case 'enable':
      if (typeof acc) {
        console.log('enable. returned: ', acc);
        ports.content.postMessage({
          data: JSON.stringify(acc.pubkey),
          taskId: msg.taskId,
          cb: msg.cb
        });
      }

      break;

    case 'tx':
      console.log();

      if (typeof acc) {
        console.log('tx, returned ', acc); // ports.content.postMessage()
      }

      break;

    case 'balanceOf':
      console.log();
      break;

    default:
      break;
  }
} //TODO add cleaner connection list


async function connectHandler(port) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvbG9jYWxTdG9yYWdlLmpzIl0sIm5hbWVzIjpbInN0b3JhZ2UiLCJyZXF1aXJlIiwiU3RvcmFnZSIsImdsb2JhbCIsImRpc2siLCJ1c2VyIiwiZ2VuZXNpcyIsInB1YmtleSIsInBydmtleSIsIkFsaWNlIiwiQm9iIiwiRXZhIiwidXNlcnMiLCJwb3J0cyIsInNldHVwQXBwIiwiY29uc29sZSIsImxvZyIsImNocm9tZSIsInJ1bnRpbWUiLCJvbk1lc3NhZ2UiLCJhZGRMaXN0ZW5lciIsIm1zZ0hhbmRsZXIiLCJvbkNvbm5lY3QiLCJjb25uZWN0SGFuZGxlciIsIm1zZyIsInNlbmRlciIsInNlbmRSZXNwb25zZSIsIm1zZ0Nvbm5lY3RIYW5kbGVyIiwiYW5zd2VyIiwidGFza0lkIiwidGFzayIsInNldFRhc2siLCJkYXRhIiwidHlwZSIsImNiIiwibXNnUG9wdXBIYW5kbGVyIiwiYWdyZWUiLCJ0YXNrSGFuZGxlciIsInJlbW92ZVRhc2siLCJsaXN0UG9ydHMiLCJkaXNjb25uZWN0SGFuZGxlciIsInBvcnQiLCJuYW1lIiwiY29ubmVjdENvbnRyb2xsZXIiLCJkaXNjb25uZWN0IiwiZ2V0VGFzayIsImFjYyIsIm1haW5BY2MiLCJnZXQiLCJpZCIsImNvbnRlbnQiLCJwb3N0TWVzc2FnZSIsIkpTT04iLCJzdHJpbmdpZnkiLCJsb2FkVGFzayIsImxvY2FsU3RvcmFnZSIsImdldEl0ZW0iLCJwYXJzZSIsImNsZWFyVGFza3MiLCJyZW1vdmVJdGVtIiwia2V5Iiwic2V0SXRlbSIsInZhbHVlIiwidGFza3MiLCJsb2FkVXNlciIsInNldE1haW5Vc2VyIiwidW5zZXRNYWluVXNlciIsImdldE1haW5Vc2VyIiwiYWRkVXNlciIsIm5ldCIsInJlbW92ZVVzZXIiLCJnZXRVc2VyIiwiY2xlYXJVc2VycyIsInNldCIsInVuc2V0IiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7Ozs7O0FDakJBLG9EQUFNQSxPQUFPLEdBQUdDLG1CQUFPLENBQUMseURBQUQsQ0FBdkI7O0FBQ0EsSUFBSUMsT0FBTyxHQUFHLElBQUlGLE9BQUosRUFBZDtBQUNBRyxNQUFNLENBQUNDLElBQVAsR0FBY0YsT0FBZDtBQUVBLElBQUlHLElBQUksR0FBRztBQUNQQyxTQUFPLEVBQUM7QUFDSkMsVUFBTSxFQUNGLG9FQUZBO0FBR0pDLFVBQU0sRUFDRjtBQUpBLEdBREQ7QUFPUEMsT0FBSyxF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aUI1RSxPQUFqQixDIiwiZmlsZSI6ImJhY2tncm91bmQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi4vXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2JhY2tncm91bmQuanNcIik7XG4iLCJ2YXIgZztcblxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcbmcgPSAoZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0aGlzO1xufSkoKTtcblxudHJ5IHtcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXG5cdGcgPSBnIHx8IG5ldyBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCk7XG59IGNhdGNoIChlKSB7XG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXG5cdGlmICh0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKSBnID0gd2luZG93O1xufVxuXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGc7XG4iLCJcblxuY29uc3Qgc3RvcmFnZSA9IHJlcXVpcmUoJy4vdXRpbHMvbG9jYWxTdG9yYWdlJylcbmxldCBTdG9yYWdlID0gbmV3IHN0b3JhZ2UoKVxuZ2xvYmFsLmRpc2sgPSBTdG9yYWdlXG5cbmxldCB1c2VyID0ge1xuICAgIGdlbmVzaXM6e1xuICAgICAgICBwdWJrZXk6XG4gICAgICAgICAgICBcIjAyOWRkMjIyZWVkZGQ1YzMzNDBlOGQ0NmFlMGEyMmUyYzhlMzAxYmZlZTQ5MDNiY2Y4Yzg5OTc2NmM4Y2ViM2E3ZFwiLFxuICAgICAgICBwcnZrZXk6XG4gICAgICAgICAgICBcIjlkM2NlMWYzZWM5OWMyNmMyZTY0ZTA2ZDc3NWE1MjU3OGIwMDk4MmJmMTc0OGUyZTI5NzJmNzM3MzY0NGFjNWNcIlxuICAgIH0sXG4gICAgQWxpY2U6XG4gICAgICAgIHtcbiAgICAgICAgICAgIHBydmtleTpcbiAgICAgICAgICAgICAgICAnMzNkMjNjYTdkMzA2MDI2ZWFhNjhkODg2NGRkMzg3MTU4NGVkMTVjYzIwODAzMDc3YmVhNzE4MzFlZTU0OTJjYycsXG4gICAgICAgICAgICBwdWJrZXk6XG4gICAgICAgICAgICAgICAgJzAyMjgzMzNiOTlhNGQxMzEyZjMxODUxZGFkMWMzMmI1MzBkNWVlNjE1MzQ5NTFlYmU2NTBjNjYzOTBmZGNmZmU5OCdcbiAgICAgICAgfSxcbiAgICBCb2I6XG4gICAgICAgIHtcbiAgICAgICAgICAgIHBydmtleTpcbiAgICAgICAgICAgICAgICAnNjc3YjVjMDM0MGMxY2YxY2FjNDM1OGE1MTdmY2YxMDMyYzgwMTBlNzk3ZjJjYTg3NzI4ZTI5Y2E2MzhiNTkxNCcsXG4gICAgICAgICAgICBwdWJrZXk6XG4gICAgICAgICAgICAgICAgJzAzMGIxM2ExMzI3MmI2NjNkYTMzNDY4OTI5MTEwYzc1MDVmNzAwYjk1NWUxYWVlNzU0Y2NlMTdkNjZhM2ZkZTIwMCdcbiAgICAgICAgfSxcbiAgICBFdmE6e1xuICAgICAgICBwcnZrZXk6XG4gICAgICAgICAgICAnM2Y3YzhkMjM2Njc4ZDQ1YzQ0MzdiMzNkOTIwNmRjNzYyNmU0YzYxZGM2NDRjYTAyMzUwZWM4MGU5YzkwOGZkZCcsXG4gICAgICAgIHB1YmtleTpcbiAgICAgICAgICAgICcwMmI0MTMwOTkwOWEwYzQwMWMzOGUyZGQ3MzRhNmQ3ZjEzNzMzZDhjNWJmYTY4NjM5MDQ3YjE4OWZiNzhlMDg1NWQnIH1cbn1cbmdsb2JhbC51c2VycyA9IHVzZXJcbnZhciBwb3J0cyA9IHt9XG5cbmZ1bmN0aW9uIHNldHVwQXBwKCkge1xuICAgIGNvbnNvbGUubG9nKCdiYWNrZ3JvdW5kIHJlYWR5JylcbiAgICBjaHJvbWUucnVudGltZS5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobXNnSGFuZGxlcilcbiAgICBjaHJvbWUucnVudGltZS5vbkNvbm5lY3QuYWRkTGlzdGVuZXIoY29ubmVjdEhhbmRsZXIpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1zZ0hhbmRsZXIobXNnLHNlbmRlciwgc2VuZFJlc3BvbnNlKXtcbiAgICBjb25zb2xlLmxvZyhtc2cpXG59XG5cbmFzeW5jIGZ1bmN0aW9uIG1zZ0Nvbm5lY3RIYW5kbGVyKG1zZyxzZW5kZXIpe1xuICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICBsZXQgYW5zd2VyID0gJydcbiAgICBpZihtc2cudGFza0lkKXtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobXNnLnRhc2tJZClcbiAgICAgICAgLy8gc2VuZGVyLnBvc3RNZXNzYWdlKHttc2c6J2FsbCB3b3JrJywgdGFza0lkOm1zZy50YXNrSWQsIGRhdGE6J3FxcSd9KVxuICAgICAgICAvLyBzd2l0Y2ggKG1zZy50eXBlKXtcbiAgICAgICAgLy8gICAgIGNhc2UgJ2VuYWJsZSc6XG4gICAgICAgIC8vICAgICAgICAgc2VuZGVyLnBvc3RNZXNzYWdlKHtkYXRhOnVzZXIuQWxpY2UucHVia2V5LHRhc2tJZDptc2cudGFza0lkLCBjYjptc2cuY2J9KVxuICAgICAgICAvLyAgICAgICAgIGJyZWFrXG4gICAgICAgIC8vICAgICBjYXNlICdiYWxhbmNlT2YnOlxuICAgICAgICAvLyAgICAgICAgIEVOUVdlYi5FbnEucHJvdmlkZXIgPSAnaHR0cDovLzk1LjIxNi4yMDcuMTczJ1xuICAgICAgICAvLyAgICAgICAgIGFuc3dlciA9IGF3YWl0IEVOUVdlYi5OZXQuZ2V0LmdldEJhbGFuY2UobXNnLmRhdGEuYWRkcmVzcywgbXNnLmRhdGEudG9rZW4pXG4gICAgICAgIC8vICAgICAgICAgc2VuZGVyLnBvc3RNZXNzYWdlKHtkYXRhOmFuc3dlci5hbW91bnQsdGFza0lkOm1zZy50YXNrSWQsY2I6bXNnLmNifSlcbiAgICAgICAgLy8gICAgICAgICBicmVha1xuICAgICAgICAvLyAgICAgY2FzZSAndHgnOlxuICAgICAgICAvLyAgICAgICAgIEVOUVdlYi5FbnEucHJvdmlkZXIgPSAnaHR0cDovLzk1LjIxNi4yMDcuMTczJ1xuICAgICAgICAvLyAgICAgICAgIEVOUVdlYi5FbnEuVXNlciA9IHVzZXIuZ2VuZXNpc1xuICAgICAgICAvLyAgICAgICAgIEVOUVdlYi5OZXQucG9zdC50eCh1c2VyLmdlbmVzaXMsbXNnLmRhdGEuYWRkcmVzcyxFTlFXZWIuRW5xLnRpY2tlcixtc2cuZGF0YS5hbW91bnQsICcnLCBtc2cuZGF0YS50b2tlbikudGhlbihhbnN3ZXI9PntcbiAgICAgICAgLy8gICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYW5zd2VyKVxuICAgICAgICAvLyAgICAgICAgICAgICBzZW5kZXIucG9zdE1lc3NhZ2Uoe2RhdGE6YW5zd2VyLmhhc2gsdGFza0lkOm1zZy50YXNrSWQsY2I6bXNnLmNifSlcbiAgICAgICAgLy8gICAgICAgICB9KS5jYXRjaChlcnI9Pnt9KSAvL1RPRE8gY2F0Y2ggZXJyb3JzXG4gICAgICAgIC8vICAgICAgICAgYnJlYWtcbiAgICAgICAgLy8gICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vICAgICAgICAgYnJlYWtcbiAgICAgICAgLy8gfVxuICAgICAgICBTdG9yYWdlLnRhc2suc2V0VGFzayhtc2cudGFza0lkLCB7ZGF0YTptc2cuZGF0YSwgdHlwZTptc2cudHlwZSwgY2I6bXNnLmNifSlcbiAgICB9ZWxzZXtcbiAgICAgICAgY29uc29sZS5sb2cobXNnKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbXNnUG9wdXBIYW5kbGVyKG1zZywgc2VuZGVyKXtcbiAgICBjb25zb2xlLmxvZyhtc2cpXG4gICAgaWYobXNnLmFncmVlKXtcbiAgICAgICAgdGFza0hhbmRsZXIobXNnLnRhc2tJZClcbiAgICB9ZWxzZXtcbiAgICAgICAgU3RvcmFnZS50YXNrLnJlbW92ZVRhc2sobXNnLnRhc2tJZClcbiAgICAgICAgY29uc29sZS5sb2coJ3JlbW92ZWQnKVxuICAgIH1cbn1cblxuZnVuY3Rpb24gbGlzdFBvcnRzKCl7XG4gICAgY29uc29sZS5sb2cocG9ydHMpXG4gICAgZ2xvYmFsLnBvcnRzID0gcG9ydHNcbn1cbmZ1bmN0aW9uIGRpc2Nvbm5lY3RIYW5kbGVyKHBvcnQpe1xuICAgIGNvbnNvbGUubG9nKCdkaXNjb25uZWN0ZWQ6ICcgKyBwb3J0Lm5hbWUpXG59XG5mdW5jdGlvbiBjb25uZWN0Q29udHJvbGxlcihwb3J0KXtcbiAgICBpZihwb3J0c1twb3J0Lm5hbWVdKXtcbiAgICAgICAgcG9ydHNbcG9ydC5uYW1lXS5kaXNjb25uZWN0KClcbiAgICAgICAgcG9ydHNbcG9ydC5uYW1lXSA9IHBvcnRcbiAgICB9ZWxzZXtcbiAgICAgICAgcG9ydHNbcG9ydC5uYW1lXSA9IHBvcnRcbiAgICB9XG59XG5cbmZ1bmN0aW9uIHRhc2tIYW5kbGVyKHRhc2tJZCl7XG4gICAgbGV0IHRhc2sgPSBTdG9yYWdlLnRhc2suZ2V0VGFzayh0YXNrSWQpXG4gICAgY29uc29sZS5sb2codGFzaylcbiAgICBsZXQgYWNjID0gU3RvcmFnZS5tYWluQWNjLmdldCgpXG4gICAgc3dpdGNoKHRhc2suaWQpe1xuICAgICAgICBjYXNlICdlbmFibGUnOlxuICAgICAgICAgICAgaWYodHlwZW9mIGFjYyl7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2VuYWJsZS4gcmV0dXJuZWQ6ICcsIGFjYylcbiAgICAgICAgICAgICAgICBwb3J0cy5jb250ZW50LnBvc3RNZXNzYWdlKHtkYXRhOkpTT04uc3RyaW5naWZ5KGFjYy5wdWJrZXkpLHRhc2tJZDptc2cudGFza0lkLCBjYjptc2cuY2J9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgJ3R4JzpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKClcbiAgICAgICAgICAgIGlmKHR5cGVvZiBhY2Mpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0eCwgcmV0dXJuZWQgJywgYWNjKVxuICAgICAgICAgICAgICAgIC8vIHBvcnRzLmNvbnRlbnQucG9zdE1lc3NhZ2UoKVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgY2FzZSAnYmFsYW5jZU9mJzpcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKClcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBicmVha1xuICAgIH1cbn1cblxuLy9UT0RPIGFkZCBjbGVhbmVyIGNvbm5lY3Rpb24gbGlzdFxuYXN5bmMgZnVuY3Rpb24gY29ubmVjdEhhbmRsZXIocG9ydCl7XG4gICAgYXdhaXQgY29ubmVjdENvbnRyb2xsZXIocG9ydClcbiAgICBzd2l0Y2ggKHBvcnQubmFtZSl7XG4gICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobXNnQ29ubmVjdEhhbmRsZXIpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdwb3B1cCc6XG4gICAgICAgICAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtc2dQb3B1cEhhbmRsZXIpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgbGlzdFBvcnRzKClcbn1cblxuc2V0dXBBcHAoKTsiLCJcbmZ1bmN0aW9uIGxvYWRUYXNrKCl7XG4gICAgbGV0IHRhc2sgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnVGFzaycpXG4gICAgaWYoIXRhc2spe1xuICAgICAgICByZXR1cm4ge31cbiAgICB9XG4gICAgdGFzayA9IEpTT04ucGFyc2UodGFzaylcbiAgICByZXR1cm4gdGFza1xufVxuXG5mdW5jdGlvbiBjbGVhclRhc2tzKCl7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdUYXNrJylcbn1cblxuZnVuY3Rpb24gZ2V0VGFzayhrZXkpe1xuICAgIGxldCB0YXNrID0gbG9hZFRhc2soKVxuICAgIHJldHVybiB0YXNrW2tleV1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlVGFzayhrZXkpe1xuICAgIGxldCB0YXNrID0gbG9hZFRhc2soKVxuICAgIGRlbGV0ZSB0YXNrW2tleV1cbiAgICB0YXNrID0gSlNPTi5zdHJpbmdpZnkodGFzaylcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVGFzaycsIHRhc2spXG4gICAgcmV0dXJuIHRhc2tcbn1cblxuZnVuY3Rpb24gc2V0VGFzayhrZXksIHZhbHVlKXtcbiAgICBsZXQgdGFza3MgPSBsb2FkVGFzaygpXG4gICAgdGFza3Nba2V5XSA9IHZhbHVlXG4gICAgdGFza3MgPSBKU09OLnN0cmluZ2lmeSh0YXNrcylcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVGFzaycsIHRhc2tzKVxuICAgIHJldHVybiB0YXNrc1xufVxuXG5mdW5jdGlvbiBsb2FkVXNlcigpe1xuICAgIGxldCB1c2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1VzZXInKVxuICAgIGlmKCF1c2VyKXtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICAgIHVzZXIgPSBKU09OLnBhcnNlKHVzZXIpXG4gICAgcmV0dXJuIHVzZXJcbn1cblxuZnVuY3Rpb24gc2V0TWFpblVzZXIobmFtZSl7XG4gICAgbGV0IHVzZXIgPSBsb2FkVXNlcigpXG4gICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ01haW5BY2MnLEpTT04uc3RyaW5naWZ5KHVzZXJbbmFtZV0pKVxuICAgIHJldHVybiB0cnVlXG59XG5cbmZ1bmN0aW9uIHVuc2V0TWFpblVzZXIoKXtcbiAgICBsb2NhbFN0b3JhZ2UucmVtb3ZlSXRlbSgnTWFpbkFjYycpXG4gICAgcmV0dXJuIHRydWVcbn1cblxuZnVuY3Rpb24gZ2V0TWFpblVzZXIoKXtcbiAgICBsZXQgYWNjID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ01haW5BY2MnKVxuICAgIHJldHVybiBhY2Ncbn1cblxuZnVuY3Rpb24gYWRkVXNlcihuYW1lLCBwdWJrZXksIHBydmtleSwgbmV0KXtcbiAgICBsZXQgdXNlciA9IGxvYWRVc2VyKClcbiAgICB1c2VyW25hbWVdPXtcbiAgICAgICAgcHVia2V5OnB1YmtleSxcbiAgICAgICAgcHJ2a2V5OnBydmtleSxcbiAgICAgICAgbmV0Om5ldFxuICAgIH1cbiAgICB1c2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcilcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVXNlcicsIHVzZXIpXG4gICAgcmV0dXJuIHVzZXJcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVXNlcihuYW1lKXtcbiAgICBsZXQgdXNlciA9IGxvYWRVc2VyKClcbiAgICBkZWxldGUgdXNlcltuYW1lXVxuICAgIHVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdVc2VyJywgdXNlcilcbiAgICByZXR1cm4gdXNlclxufVxuXG5mdW5jdGlvbiBnZXRVc2VyKG5hbWUpe1xuICAgIGxldCB1c2VyID0gbG9hZFVzZXIoKVxuICAgIHJldHVybiB1c2VyW25hbWVdXG59XG5mdW5jdGlvbiBjbGVhclVzZXJzKCl7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ1VzZXInKVxufVxuXG5sZXQgc3RvcmFnZSA9IGZ1bmN0aW9uIFN0b3JhZ2UoKXtcbiAgICB0aGlzLnRhc2sgPSB7XG4gICAgICAgIGxvYWRUYXNrOmxvYWRUYXNrLFxuICAgICAgICBzZXRUYXNrOnNldFRhc2ssXG4gICAgICAgIGdldFRhc2s6Z2V0VGFzayxcbiAgICAgICAgcmVtb3ZlVGFzazpyZW1vdmVUYXNrLFxuICAgICAgICBjbGVhclRhc2tzOmNsZWFyVGFza3NcbiAgICB9XG4gICAgdGhpcy51c2VyID0ge1xuICAgICAgICBsb2FkVXNlcjpsb2FkVXNlcixcbiAgICAgICAgYWRkVXNlcjphZGRVc2VyLFxuICAgICAgICBnZXRVc2VyOmdldFVzZXIsXG4gICAgICAgIHJlbW92ZVVzZXI6cmVtb3ZlVXNlcixcbiAgICAgICAgY2xlYXJVc2VyczpjbGVhclVzZXJzXG4gICAgfVxuICAgIHRoaXMubWFpbkFjYyA9IHtcbiAgICAgICAgZ2V0OmdldE1haW5Vc2VyLFxuICAgICAgICBzZXQ6c2V0TWFpblVzZXIsXG4gICAgICAgIHVuc2V0OnVuc2V0TWFpblVzZXJcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3RvcmFnZSJdLCJzb3VyY2VSb290IjoiIn0=