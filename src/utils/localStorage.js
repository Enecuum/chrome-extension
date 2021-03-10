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
    if (tasks.length > 0) {
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
        localStorage.setItem('list', '')
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
    tasks[key] = value
    tasks = JSON.stringify(tasks)
    localStorage.setItem('Task', tasks)
    addToList(key)
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
    this.list = {
        listOfTask,
        loadList,
        updateList,
        addToList
    }
    this.mainAcc = {
        get: getMainUser,
        set: setMainUser,
        unset: unsetMainUser
    }
}

module.exports = storage