function loadTask() {
    let task = localStorage.getItem('Task')
    if (!task) {
        return {}
    }
    task = JSON.parse(task)
    return task
}

function clearTasks() {
    localStorage.removeItem('Task')
    localStorage.removeItem('list')
    return true
}

function listOfTask() {
    let tasks = JSON.parse(localStorage.getItem('list'))
    let list = []
    if (tasks && tasks.length > 0) {
        for (let id in tasks) {
            list.push(getTask(tasks[id]))
        }
    }
    return list
}

function loadList() {
    let list = JSON.parse(localStorage.getItem('list'))
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
    localStorage.setItem('list', JSON.stringify(list))
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
        localStorage.setItem('list', JSON.stringify(ptr))
    } else {
        localStorage.setItem('list', '[]')
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
    localStorage.setItem('Task', task)
    updateList()
    return task
}

function setTask(key, value) {
    let tasks = loadTask()
    if (tasks[key]) {
        tasks[key] = value
        tasks = JSON.stringify(tasks)
        localStorage.setItem('Task', tasks)
    } else {
        tasks[key] = value
        tasks = JSON.stringify(tasks)
        localStorage.setItem('Task', tasks)
        addToList(key)
    }
    return tasks
}

function loadUser() {
    let user = localStorage.getItem('User')
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
    let user = localStorage.getItem('User')
    if (!user) {
        return {}
    } else {
        return user
    }
}

function addUser(obj) {
    // obj: {publicKey, privateKey, net, token}
    localStorage.setItem('User', JSON.stringify(obj))
    return obj
}

function removeUser() {
    localStorage.setItem('User', '')
}

function getUser(name) {
    let user = loadUser()
    return user[name]
}

function changeUser(account, json = false) {
    if (json) {
        localStorage.setItem('User', JSON.stringify(account))
        return true
    } else {
        localStorage.setItem('User', account)
        return true
    }
}

function clearUsers() {
    localStorage.removeItem('User')
}

function setNet(net) {
    let acc = loadUser()
    acc.net = net
    localStorage.setItem('User', JSON.stringify(acc))
    return acc
}

function checkLock() {
    let state = JSON.parse(localStorage.getItem('lock'))
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
    let state = JSON.parse(localStorage.getItem('lock'))
    if (!state) {
        state = {}
    }
    state.lock = value
    localStorage.setItem('lock', JSON.stringify(state))
    return true
}

function setPassword(password) {
    let state = JSON.parse(localStorage.getItem('lock'))
    if (!state) {
        state = {}
    }
    state.pass = password.toString()
    localStorage.setItem('lock', JSON.stringify(state))
    return true
}

function unlock(password) {
    let state = JSON.parse(localStorage.getItem('lock'))
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
    let state = JSON.parse(localStorage.getItem('lock'))
    if (!state) {
        return false
    }
    setLock(true)
}

function removeLock() {
    localStorage.removeItem('lock')
    return true
}


function getHashPassword() {
    let state = JSON.parse(localStorage.getItem('lock'))
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
        chrome.runtime.sendMessage(obj, answer => {
            if (answer.response !== undefined) {
                resolve(answer.response)
            } else {
                resolve(answer)
            }
        })
    })
}

function initConfig() {
    let config = {
        openTxPopup: true,
        openEnablePopup: true,
        openSignPopup: true
    }
    localStorage.setItem('config', JSON.stringify(config))
    return true
}

function getConfig() {
    let config = JSON.parse(localStorage.getItem('config'))
    if (!config) {
        return false
    }
    return config
}

function setConfig(config) {
    if (!config) {
        console.log('error in setting config')
        return false
    } else {
        if (config.openTxPopup === undefined || config.openEnablePopup === undefined) {
            return false
        } else {
            localStorage.setItem('config', JSON.stringify(config))
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

let storage = function Storage(name) {
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
    this.promise = {
        sendPromise
    }
}

module.exports = storage
