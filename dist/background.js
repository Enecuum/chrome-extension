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
    //         ENQWeb.Net.post.tx(msg.data.address,ENQWeb.Enq.ticker,msg.data.amount, '', msg.data.token).then(answer=>{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvYmFja2dyb3VuZC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvdXRpbHMvbG9jYWxTdG9yYWdlLmpzIl0sIm5hbWVzIjpbInN0b3JhZ2UiLCJyZXF1aXJlIiwiU3RvcmFnZSIsImdsb2JhbCIsImRpc2siLCJ1c2VyIiwiZ2VuZXNpcyIsInB1YmtleSIsInBydmtleSIsIkFsaWNlIiwiQm9iIiwiRXZhIiwidXNlcnMiLCJwb3J0cyIsInNldHVwQXBwIiwiY29uc29sZSIsImxvZyIsImNocm9tZSIsInJ1bnRpbWUiLCJvbk1lc3NhZ2UiLCJhZGRMaXN0ZW5lciIsIm1zZ0hhbmRsZXIiLCJvbkNvbm5lY3QiLCJjb25uZWN0SGFuZGxlciIsIm1zZyIsInNlbmRlciIsInNlbmRSZXNwb25zZSIsIm1zZ0Nvbm5lY3RIYW5kbGVyIiwiYW5zd2VyIiwidGFza0lkIiwidGFzayIsInNldFRhc2siLCJkYXRhIiwidHlwZSIsImNiIiwibXNnUG9wdXBIYW5kbGVyIiwiYWdyZWUiLCJ0YXNrSGFuZGxlciIsInJlbW92ZVRhc2siLCJsaXN0UG9ydHMiLCJkaXNjb25uZWN0SGFuZGxlciIsInBvcnQiLCJuYW1lIiwiY29ubmVjdENvbnRyb2xsZXIiLCJkaXNjb25uZWN0IiwiZ2V0VGFzayIsImxvYWRUYXNrIiwibG9jYWxTdG9yYWdlIiwiZ2V0SXRlbSIsIkpTT04iLCJwYXJzZSIsImNsZWFyVGFza3MiLCJyZW1vdmVJdGVtIiwia2V5Iiwic3RyaW5naWZ5Iiwic2V0SXRlbSIsInZhbHVlIiwidGFza3MiLCJsb2FkVXNlciIsImFkZFVzZXIiLCJuZXQiLCJyZW1vdmVVc2VyIiwiZ2V0VXNlciIsImNsZWFyVXNlcnMiLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVB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WDtBQUNBckMsTUFBSSxHQUFHNEMsSUFBSSxDQUFDSyxTQUFMLENBQWVqRCxJQUFmLENBQVA7QUFDQTBDLGNBQVksQ0FBQ1EsT0FBYixDQUFxQixNQUFyQixFQUE2QmxELElBQTdCO0FBQ0EsU0FBT0EsSUFBUDtBQUNIOztBQUVELFNBQVN5RCxPQUFULENBQWlCcEIsSUFBakIsRUFBc0I7QUFDbEIsTUFBSXJDLElBQUksR0FBR3FELFFBQVEsRUFBbkI7QUFDQSxTQUFPckQsSUFBSSxDQUFDcUMsSUFBRCxDQUFYO0FBQ0g7O0FBQ0QsU0FBU3FCLFVBQVQsR0FBcUI7QUFDakJoQixjQUFZLENBQUNLLFVBQWIsQ0FBd0IsTUFBeEI7QUFDSDs7QUFFRCxJQUFJcEQsT0FBTyxHQUFHLFNBQVNFLE9BQVQsR0FBa0I7QUFDNUIsT0FBSzRCLElBQUwsR0FBWTtBQUNSZ0IsWUFBUSxFQUFDQSxRQUREO0FBRVJmLFdBQU8sRUFBQ0EsT0FGQTtBQUdSYyxXQUFPLEVBQUNBLE9BSEE7QUFJUlAsY0FBVSxFQUFDQSxVQUpIO0FBS1JhLGNBQVUsRUFBQ0E7QUFMSCxHQUFaO0FBT0EsT0FBSzlDLElBQUwsR0FBWTtBQUNScUQsWUFBUSxFQUFDQSxRQUREO0FBRVJDLFdBQU8sRUFBQ0EsT0FGQTtBQUdSRyxXQUFPLEVBQUNBLE9BSEE7QUFJUkQsY0FBVSxFQUFDQSxVQUpIO0FBS1JFLGNBQVUsRUFBQ0E7QUFMSCxHQUFaO0FBT0gsQ0FmRDs7QUFpQkFDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQmpFLE9BQWpCLEMiLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiLi9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvYmFja2dyb3VuZC5qc1wiKTtcbiIsInZhciBnO1xuXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxuZyA9IChmdW5jdGlvbigpIHtcblx0cmV0dXJuIHRoaXM7XG59KSgpO1xuXG50cnkge1xuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcblx0ZyA9IGcgfHwgbmV3IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKTtcbn0gY2F0Y2ggKGUpIHtcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcblx0aWYgKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpIGcgPSB3aW5kb3c7XG59XG5cbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XG5cbm1vZHVsZS5leHBvcnRzID0gZztcbiIsIlxuXG5jb25zdCBzdG9yYWdlID0gcmVxdWlyZSgnLi91dGlscy9sb2NhbFN0b3JhZ2UnKVxubGV0IFN0b3JhZ2UgPSBuZXcgc3RvcmFnZSgpXG5nbG9iYWwuZGlzayA9IFN0b3JhZ2VcblxubGV0IHVzZXIgPSB7XG4gICAgZ2VuZXNpczp7XG4gICAgICAgIHB1YmtleTpcbiAgICAgICAgICAgIFwiMDI5ZGQyMjJlZWRkZDVjMzM0MGU4ZDQ2YWUwYTIyZTJjOGUzMDFiZmVlNDkwM2JjZjhjODk5NzY2YzhjZWIzYTdkXCIsXG4gICAgICAgIHBydmtleTpcbiAgICAgICAgICAgIFwiOWQzY2UxZjNlYzk5YzI2YzJlNjRlMDZkNzc1YTUyNTc4YjAwOTgyYmYxNzQ4ZTJlMjk3MmY3MzczNjQ0YWM1Y1wiXG4gICAgfSxcbiAgICBBbGljZTpcbiAgICAgICAge1xuICAgICAgICAgICAgcHJ2a2V5OlxuICAgICAgICAgICAgICAgICczM2QyM2NhN2QzMDYwMjZlYWE2OGQ4ODY0ZGQzODcxNTg0ZWQxNWNjMjA4MDMwNzdiZWE3MTgzMWVlNTQ5MmNjJyxcbiAgICAgICAgICAgIHB1YmtleTpcbiAgICAgICAgICAgICAgICAnMDIyODMzM2I5OWE0ZDEzMTJmMzE4NTFkYWQxYzMyYjUzMGQ1ZWU2MTUzNDk1MWViZTY1MGM2NjM5MGZkY2ZmZTk4J1xuICAgICAgICB9LFxuICAgIEJvYjpcbiAgICAgICAge1xuICAgICAgICAgICAgcHJ2a2V5OlxuICAgICAgICAgICAgICAgICc2NzdiNWMwMzQwYzFjZjFjYWM0MzU4YTUxN2ZjZjEwMzJjODAxMGU3OTdmMmNhODc3MjhlMjljYTYzOGI1OTE0JyxcbiAgICAgICAgICAgIHB1YmtleTpcbiAgICAgICAgICAgICAgICAnMDMwYjEzYTEzMjcyYjY2M2RhMzM0Njg5MjkxMTBjNzUwNWY3MDBiOTU1ZTFhZWU3NTRjY2UxN2Q2NmEzZmRlMjAwJ1xuICAgICAgICB9LFxuICAgIEV2YTp7XG4gICAgICAgIHBydmtleTpcbiAgICAgICAgICAgICczZjdjOGQyMzY2NzhkNDVjNDQzN2IzM2Q5MjA2ZGM3NjI2ZTRjNjFkYzY0NGNhMDIzNTBlYzgwZTljOTA4ZmRkJyxcbiAgICAgICAgcHVia2V5OlxuICAgICAgICAgICAgJzAyYjQxMzA5OTA5YTBjNDAxYzM4ZTJkZDczNGE2ZDdmMTM3MzNkOGM1YmZhNjg2MzkwNDdiMTg5ZmI3OGUwODU1ZCcgfVxufVxuZ2xvYmFsLnVzZXJzID0gdXNlclxudmFyIHBvcnRzID0ge31cblxuZnVuY3Rpb24gc2V0dXBBcHAoKSB7XG4gICAgY29uc29sZS5sb2coJ2JhY2tncm91bmQgcmVhZHknKVxuICAgIGNocm9tZS5ydW50aW1lLm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtc2dIYW5kbGVyKVxuICAgIGNocm9tZS5ydW50aW1lLm9uQ29ubmVjdC5hZGRMaXN0ZW5lcihjb25uZWN0SGFuZGxlcilcbn1cblxuYXN5bmMgZnVuY3Rpb24gbXNnSGFuZGxlcihtc2csc2VuZGVyLCBzZW5kUmVzcG9uc2Upe1xuICAgIGNvbnNvbGUubG9nKG1zZylcbn1cblxuYXN5bmMgZnVuY3Rpb24gbXNnQ29ubmVjdEhhbmRsZXIobXNnLHNlbmRlcil7XG4gICAgY29uc29sZS5sb2cobXNnKVxuICAgIGxldCBhbnN3ZXIgPSAnJ1xuICAgIGlmKG1zZy50YXNrSWQpe1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhtc2cudGFza0lkKVxuICAgICAgICAvLyBzZW5kZXIucG9zdE1lc3NhZ2Uoe21zZzonYWxsIHdvcmsnLCB0YXNrSWQ6bXNnLnRhc2tJZCwgZGF0YToncXFxJ30pXG4gICAgICAgIC8vIHN3aXRjaCAobXNnLnR5cGUpe1xuICAgICAgICAvLyAgICAgY2FzZSAnZW5hYmxlJzpcbiAgICAgICAgLy8gICAgICAgICBzZW5kZXIucG9zdE1lc3NhZ2Uoe2RhdGE6dXNlci5BbGljZS5wdWJrZXksdGFza0lkOm1zZy50YXNrSWQsIGNiOm1zZy5jYn0pXG4gICAgICAgIC8vICAgICAgICAgYnJlYWtcbiAgICAgICAgLy8gICAgIGNhc2UgJ2JhbGFuY2VPZic6XG4gICAgICAgIC8vICAgICAgICAgRU5RV2ViLkVucS5wcm92aWRlciA9ICdodHRwOi8vOTUuMjE2LjIwNy4xNzMnXG4gICAgICAgIC8vICAgICAgICAgYW5zd2VyID0gYXdhaXQgRU5RV2ViLk5ldC5nZXQuZ2V0QmFsYW5jZShtc2cuZGF0YS5hZGRyZXNzLCBtc2cuZGF0YS50b2tlbilcbiAgICAgICAgLy8gICAgICAgICBzZW5kZXIucG9zdE1lc3NhZ2Uoe2RhdGE6YW5zd2VyLmFtb3VudCx0YXNrSWQ6bXNnLnRhc2tJZCxjYjptc2cuY2J9KVxuICAgICAgICAvLyAgICAgICAgIGJyZWFrXG4gICAgICAgIC8vICAgICBjYXNlICd0eCc6XG4gICAgICAgIC8vICAgICAgICAgRU5RV2ViLkVucS5wcm92aWRlciA9ICdodHRwOi8vOTUuMjE2LjIwNy4xNzMnXG4gICAgICAgIC8vICAgICAgICAgRU5RV2ViLkVucS5Vc2VyID0gdXNlci5nZW5lc2lzXG4gICAgICAgIC8vICAgICAgICAgRU5RV2ViLk5ldC5wb3N0LnR4KG1zZy5kYXRhLmFkZHJlc3MsRU5RV2ViLkVucS50aWNrZXIsbXNnLmRhdGEuYW1vdW50LCAnJywgbXNnLmRhdGEudG9rZW4pLnRoZW4oYW5zd2VyPT57XG4gICAgICAgIC8vICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFuc3dlcilcbiAgICAgICAgLy8gICAgICAgICAgICAgc2VuZGVyLnBvc3RNZXNzYWdlKHtkYXRhOmFuc3dlci5oYXNoLHRhc2tJZDptc2cudGFza0lkLGNiOm1zZy5jYn0pXG4gICAgICAgIC8vICAgICAgICAgfSkuY2F0Y2goZXJyPT57fSkgLy9UT0RPIGNhdGNoIGVycm9yc1xuICAgICAgICAvLyAgICAgICAgIGJyZWFrXG4gICAgICAgIC8vICAgICBkZWZhdWx0OlxuICAgICAgICAvLyAgICAgICAgIGJyZWFrXG4gICAgICAgIC8vIH1cbiAgICAgICAgU3RvcmFnZS50YXNrLnNldFRhc2sobXNnLnRhc2tJZCwge2RhdGE6bXNnLmRhdGEsIHR5cGU6bXNnLnR5cGUsIGNiOm1zZy5jYn0pXG4gICAgfWVsc2V7XG4gICAgICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIG1zZ1BvcHVwSGFuZGxlcihtc2csIHNlbmRlcil7XG4gICAgY29uc29sZS5sb2cobXNnKVxuICAgIGlmKG1zZy5hZ3JlZSl7XG4gICAgICAgIHRhc2tIYW5kbGVyKG1zZy50YXNrSWQpXG4gICAgfWVsc2V7XG4gICAgICAgIFN0b3JhZ2UudGFzay5yZW1vdmVUYXNrKG1zZy50YXNrSWQpXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZW1vdmVkJylcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGxpc3RQb3J0cygpe1xuICAgIGNvbnNvbGUubG9nKHBvcnRzKVxuICAgIGdsb2JhbC5wb3J0cyA9IHBvcnRzXG59XG5mdW5jdGlvbiBkaXNjb25uZWN0SGFuZGxlcihwb3J0KXtcbiAgICBjb25zb2xlLmxvZygnZGlzY29ubmVjdGVkOiAnICsgcG9ydC5uYW1lKVxufVxuZnVuY3Rpb24gY29ubmVjdENvbnRyb2xsZXIocG9ydCl7XG4gICAgaWYocG9ydHNbcG9ydC5uYW1lXSl7XG4gICAgICAgIHBvcnRzW3BvcnQubmFtZV0uZGlzY29ubmVjdCgpXG4gICAgICAgIHBvcnRzW3BvcnQubmFtZV0gPSBwb3J0XG4gICAgfWVsc2V7XG4gICAgICAgIHBvcnRzW3BvcnQubmFtZV0gPSBwb3J0XG4gICAgfVxufVxuXG5mdW5jdGlvbiB0YXNrSGFuZGxlcih0YXNrSWQpe1xuICAgIGxldCB0YXNrID0gU3RvcmFnZS50YXNrLmdldFRhc2sodGFza0lkKVxuXG4gICAgY29uc29sZS5sb2codGFzaylcbn1cblxuLy9UT0RPIGFkZCBjbGVhbmVyIGNvbm5lY3Rpb24gbGlzdFxuYXN5bmMgZnVuY3Rpb24gY29ubmVjdEhhbmRsZXIocG9ydCl7XG4gICAgYXdhaXQgY29ubmVjdENvbnRyb2xsZXIocG9ydClcbiAgICBzd2l0Y2ggKHBvcnQubmFtZSl7XG4gICAgICAgIGNhc2UgJ2NvbnRlbnQnOlxuICAgICAgICAgICAgcG9ydC5vbk1lc3NhZ2UuYWRkTGlzdGVuZXIobXNnQ29ubmVjdEhhbmRsZXIpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBjYXNlICdwb3B1cCc6XG4gICAgICAgICAgICBwb3J0Lm9uTWVzc2FnZS5hZGRMaXN0ZW5lcihtc2dQb3B1cEhhbmRsZXIpXG4gICAgICAgICAgICBicmVha1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgYnJlYWtcbiAgICB9XG4gICAgbGlzdFBvcnRzKClcbn1cblxuc2V0dXBBcHAoKTsiLCJcbmZ1bmN0aW9uIGxvYWRUYXNrKCl7XG4gICAgbGV0IHRhc2sgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnVGFzaycpXG4gICAgaWYoIXRhc2spe1xuICAgICAgICByZXR1cm4ge31cbiAgICB9XG4gICAgdGFzayA9IEpTT04ucGFyc2UodGFzaylcbiAgICByZXR1cm4gdGFza1xufVxuXG5mdW5jdGlvbiBjbGVhclRhc2tzKCl7XG4gICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdUYXNrJylcbn1cblxuZnVuY3Rpb24gZ2V0VGFzayhrZXkpe1xuICAgIGxldCB0YXNrID0gbG9hZFRhc2soKVxuICAgIHJldHVybiB0YXNrW2tleV1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlVGFzayhrZXkpe1xuICAgIGxldCB0YXNrID0gbG9hZFRhc2soKVxuICAgIGRlbGV0ZSB0YXNrW2tleV1cbiAgICB0YXNrID0gSlNPTi5zdHJpbmdpZnkodGFzaylcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVGFzaycsIHRhc2spXG4gICAgcmV0dXJuIHRhc2tcbn1cblxuZnVuY3Rpb24gc2V0VGFzayhrZXksIHZhbHVlKXtcbiAgICBsZXQgdGFza3MgPSBsb2FkVGFzaygpXG4gICAgdGFza3Nba2V5XSA9IHZhbHVlXG4gICAgdGFza3MgPSBKU09OLnN0cmluZ2lmeSh0YXNrcylcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVGFzaycsIHRhc2tzKVxuICAgIHJldHVybiB0YXNrc1xufVxuXG5mdW5jdGlvbiBsb2FkVXNlcigpe1xuICAgIGxldCB1c2VyID0gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ1VzZXInKVxuICAgIGlmKCF1c2VyKXtcbiAgICAgICAgcmV0dXJuIHt9XG4gICAgfVxuICAgIHVzZXIgPSBKU09OLnBhcnNlKHVzZXIpXG4gICAgcmV0dXJuIHVzZXJcbn1cblxuZnVuY3Rpb24gYWRkVXNlcihuYW1lLCBwdWJrZXksIHBydmtleSwgbmV0KXtcbiAgICBsZXQgdXNlciA9IGxvYWRVc2VyKClcbiAgICB1c2VyW25hbWVdPXtcbiAgICAgICAgcHVia2V5OnB1YmtleSxcbiAgICAgICAgcHJ2a2V5OnBydmtleSxcbiAgICAgICAgbmV0Om5ldFxuICAgIH1cbiAgICB1c2VyID0gSlNPTi5zdHJpbmdpZnkodXNlcilcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnVXNlcicsIHVzZXIpXG4gICAgcmV0dXJuIHVzZXJcbn1cblxuZnVuY3Rpb24gcmVtb3ZlVXNlcihuYW1lKXtcbiAgICBsZXQgdXNlciA9IGxvYWRVc2VyKClcbiAgICBkZWxldGUgdXNlcltuYW1lXVxuICAgIHVzZXIgPSBKU09OLnN0cmluZ2lmeSh1c2VyKVxuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdVc2VyJywgdXNlcilcbiAgICByZXR1cm4gdXNlclxufVxuXG5mdW5jdGlvbiBnZXRVc2VyKG5hbWUpe1xuICAgIGxldCB1c2VyID0gbG9hZFVzZXIoKVxuICAgIHJldHVybiB1c2VyW25hbWVdXG59XG5mdW5jdGlvbiBjbGVhclVzZXJzKCl7XG4gICAgbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ1VzZXInKVxufVxuXG5sZXQgc3RvcmFnZSA9IGZ1bmN0aW9uIFN0b3JhZ2UoKXtcbiAgICB0aGlzLnRhc2sgPSB7XG4gICAgICAgIGxvYWRUYXNrOmxvYWRUYXNrLFxuICAgICAgICBzZXRUYXNrOnNldFRhc2ssXG4gICAgICAgIGdldFRhc2s6Z2V0VGFzayxcbiAgICAgICAgcmVtb3ZlVGFzazpyZW1vdmVUYXNrLFxuICAgICAgICBjbGVhclRhc2tzOmNsZWFyVGFza3NcbiAgICB9XG4gICAgdGhpcy51c2VyID0ge1xuICAgICAgICBsb2FkVXNlcjpsb2FkVXNlcixcbiAgICAgICAgYWRkVXNlcjphZGRVc2VyLFxuICAgICAgICBnZXRVc2VyOmdldFVzZXIsXG4gICAgICAgIHJlbW92ZVVzZXI6cmVtb3ZlVXNlcixcbiAgICAgICAgY2xlYXJVc2VyczpjbGVhclVzZXJzXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0b3JhZ2UiXSwic291cmNlUm9vdCI6IiJ9