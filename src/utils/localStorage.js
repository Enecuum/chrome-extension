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
            // console.log(id)
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
                    break;
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
    user = JSON.parse(user)
    return user
}

function addUser(publicKey, privateKey, net) {
    let user = {
        publicKey: publicKey,
        privateKey: privateKey,
        net: net
    }
    localStorage.setItem('User', JSON.stringify(user))
    return user
}

function removeUser() {
    localStorage.setItem('User', '')
}

function getUser(name) {
    let user = loadUser()
    return user[name]
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
        if (state.lock)
            return true
        else
            return false
    } else
        return false
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

function unlock(pass) {
    let state = JSON.parse(localStorage.getItem('lock'))
    if (!state) {
        return false
    }
    if (state.pass === pass) {
        setLock(false)
        return true
    } else
        return false
}

let storage = function Storage() {

    this.task = {
        loadTask,
        setTask,
        getTask,
        removeTask,
        clearTasks
    }
    this.user = {
        loadUser,
        addUser,
        getUser,
        removeUser,
        clearUsers,
        setNet
    }
    this.list = {
        listOfTask,
        loadList,
        updateList,
        addToList
    }
    this.lock = {
        unlock,
        checkLock,
        setPassword,
        setLock
    }
}

module.exports = storage