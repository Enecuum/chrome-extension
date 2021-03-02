function loadTask() {
    let task = localStorage.getItem('Task')
    if (!task) {
        return {}
    }
    task = JSON.parse(task)
    return task
}

function clearTasks() {
    return localStorage.removeItem('Task')
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
    return task
}

function setTask(key, value) {
    let tasks = loadTask()
    tasks[key] = value
    tasks = JSON.stringify(tasks)
    localStorage.setItem('Task', tasks)
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

function setMainUser(name) {
    let user = loadUser()
    localStorage.setItem('MainAcc', JSON.stringify(user[name]))
    return true
}

function unsetMainUser() {
    localStorage.removeItem('MainAcc')
    return true
}

function getMainUser() {
    let acc = localStorage.getItem('MainAcc')
    return acc
}

function getUser(name) {
    let user = loadUser()
    return user[name]
}

function clearUsers() {
    localStorage.removeItem('User')
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
        clearUsers
    }
    this.mainAcc = {
        get: getMainUser,
        set: setMainUser,
        unset: unsetMainUser
    }
}

module.exports = storage