// This is storage object,

const {LIST, TASK, USER, LOCK, CONFIG, TOKENS} = require("./names");
const indexDB = require('./indexDB')
const {generateAccountData, account} = require("../user");
// import indexDB from './indexDB'
// import {LIST, TASK, USER, LOCK, CONFIG, TOKENS} from "./names";

function loadTask() {
    let task = localStorage.getItem(TASK)
    if (!task) {
        return {}
    }
    task = JSON.parse(task)
    return task
}

function clearTasks() {
    localStorage.removeItem(TASK)
    localStorage.removeItem(LIST)
    return true
}

function listOfTask() {
    let tasks = JSON.parse(localStorage.getItem(LIST))
    let list = []
    if (tasks && tasks.length > 0) {
        for (let id in tasks) {
            list.push(getTask(tasks[id]))
        }
    }
    return list
}

function loadList() {
    let list = JSON.parse(localStorage.getItem(LIST))
    if (list) {
        return list
    } else {
        return []
    }
}

function addToList(taskId) {
    let list = loadList()
    if (!list) {
        list = []
    }
    list.push(taskId)
    localStorage.setItem(LIST, JSON.stringify(list))
    return true
}

function updateList() {
    let tasks = loadTask()
    let ids = Object.keys(tasks)
    let list = loadList()
    if (ids.length > 0) {
        let ptr = []
        for (let id in ids) {
            for (let j in list) {
                if (list[j] === ids[id]) {
                    ptr.push(list[j])
                    break
                }
            }
        }
        localStorage.setItem(LIST, JSON.stringify(ptr))
    } else {
        localStorage.setItem(LIST, '[]')
    }
}

function getTask(key) {
    let task = loadTask()
    return task[key]
}

function removeTask(key) {
    let task = loadTask()
    delete task[key]
    task = JSON.stringify(task)
    localStorage.setItem(TASK, task)
    updateList()
    return task
}

function setTask(key, value) {
    let tasks = loadTask()
    if (tasks[key]) {
        tasks[key] = value
        tasks = JSON.stringify(tasks)
        localStorage.setItem(TASK, tasks)
    } else {
        tasks[key] = value
        tasks = JSON.stringify(tasks)
        localStorage.setItem(TASK, tasks)
        addToList(key)
    }
    return tasks
}

//
function userExist() {
    return localStorage.getItem(USER).length > 0
}

//
function loadUser() {

    // let oldUser = localStorage.getItem('User')
    // if (oldUser && oldUser.length > 0) {
    //
    //     let privateKey = JSON.parse(oldUser).privateKey
    //     let data = generateAccountData(privateKey, account)
    //     data.privateKeys.push(privateKey)
    //
    //     userStorage.promise.sendPromise({
    //         account: true,
    //         set: true,
    //         data: data
    //     }).then(() => {return
    //         localStorage.setItem('User', '')
    //     })
    //
    //     return data
    // }

    let user = localStorage.getItem(USER)

    indexDB.get(USER).then(user => {
        // console.dir('IndexDB user exist: ' + !!user)
    })

    if (!user) {
        return {}
    }
    if (!checkLock()) {
        if (this.name === 'popup') {
            return sendPromise({
                account: true,
                request: true
            })
        }
        user = JSON.parse(user)
        return user
    } else {
        return {}
    }
}

function loadUserNotJson() {
    let user = localStorage.getItem(USER)
    if (!user) {
        return {}
    } else {
        return user
    }
}

function addUser(obj) {
    // obj: {publicKey, privateKey, net, token}
    // console.log(obj)
    localStorage.setItem(USER, JSON.stringify(obj))
    return obj
}

function removeUser() {
    localStorage.setItem(USER, JSON.stringify({}))
}

function getUser(name) {
    let user = loadUser()
    return user[name]
}

function changeUser(account, json = false) {
    if (json) {
        localStorage.setItem(USER, JSON.stringify(account))
        return true
    } else {
        localStorage.setItem(USER, account)
        return true
    }
}

function clearUsers() {
    localStorage.removeItem(USER)
}

function setNet(net) {
    let acc = loadUser()
    acc.net = net
    localStorage.setItem(USER, JSON.stringify(acc))
    return acc
}

function checkLock() {
    let state = JSON.parse(localStorage.getItem(LOCK))
    if (state) {
        if (state.lock) {
            return true
        } else {
            return false
        }
    } else {
        return false
    }
}

function setLock(value) {
    let state = JSON.parse(localStorage.getItem(LOCK))
    if (!state) {
        state = {}
    }
    state.lock = value
    localStorage.setItem(LOCK, JSON.stringify(state))
    return true
}

function setPassword(password) {
    let state = JSON.parse(localStorage.getItem(LOCK))
    if (!state) {
        state = {}
    }
    state.pass = password.toString()
    localStorage.setItem(LOCK, JSON.stringify(state))
    return true
}

function unlock(password) {
    let state = JSON.parse(localStorage.getItem(LOCK))
    if (!state) {
        return false
    }
    if (state.pass === password.toString()) {
        setLock(false)
        return true
    } else {
        return false
    }
}

function lock() {
    let state = JSON.parse(localStorage.getItem(LOCK))
    if (!state) {
        return false
    }
    setLock(true)
}

function removeLock() {
    localStorage.setItem(LOCK, JSON.stringify(false))
    return true
}


function getHashPassword() {
    let state = JSON.parse(localStorage.getItem(LOCK))
    if (!state) {
        return false
    }
    if (state.pass) {
        return state.pass
    } else {
        return false
    }
}

function sendPromise(obj) {

    return new Promise((resolve) => {

        if (chrome.runtime.getManifest().version.includes('web')) {

            // console.log('web send promise');
            webBackgroundPort(obj, ENQWeb).then(answer => {
                if (answer.response !== undefined) {
                    resolve(answer.response);
                } else {
                    resolve(answer);
                }
            })

        } else {

            //
            chrome.runtime.sendMessage(obj, answer => {
                if (answer.response !== undefined) {
                    resolve(answer.response);
                } else {
                    resolve(answer);
                }
            })
        }
    })
}

function initConfig() {
    let config = {
        openTxPopup: true,
        openEnablePopup: true,
        openSignPopup: true
    }
    localStorage.setItem(CONFIG, JSON.stringify(config))
    return true
}

function getConfig() {
    let config = JSON.parse(localStorage.getItem(CONFIG))
    if (!config) {
        return false
    }
    return config
}

function setConfig(config) {
    if (!config) {
        let configErrorString = 'Error in setting config'
        console.log(configErrorString)
        return false
    } else {
        if (config.openTxPopup === undefined || config.openEnablePopup === undefined) {
            return false
        } else {
            localStorage.setItem(CONFIG, JSON.stringify(config))
            return true
        }
    }
}

function resultTask(taskId, result) {
    let task = getTask(taskId)
    task.result = result
    setTask(taskId, task)
    return true
}

function getTokens() {
    let tokens = JSON.parse(localStorage.getItem(TOKENS))
    if (!tokens) {
        tokens = {}
    }
    return tokens
}

function clearTokens() {
    localStorage.removeItem(TOKENS)
    return true
}

function setTokens(obj) {
    //obj:{net, tokens[]}
    localStorage.setItem(TOKENS, JSON.stringify(obj))
    return true
}

// TODO constructor
function Storage(name) {

    // let loadUser = await loadUser

    this.name = name
    this.task = {
        name,
        loadTask,
        setTask,
        getTask,
        removeTask,
        clearTasks,
        resultTask
    }
    this.user = {
        name,
        loadUser,
        userExist,
        addUser,
        getUser,
        removeUser,
        clearUsers,
        setNet,
        changeUser,
        loadUserNotJson
    }
    this.list = {
        name,
        listOfTask,
        loadList,
        updateList,
        addToList
    }
    this.lock = {
        name,
        unlock,
        checkLock,
        setPassword,
        setLock,
        getHashPassword,
        lock,
        removeLock
    }
    this.config = {
        initConfig,
        getConfig,
        setConfig
    }
    this.tokens = {
        getTokens,
        setTokens,
        clearTokens
    }
    this.promise = {
        sendPromise
    }
}

module.exports = Storage
