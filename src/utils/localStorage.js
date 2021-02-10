
function loadTask(){
    let task = localStorage.getItem('Task')
    if(!task){
        return {}
    }
    task = JSON.parse(task)
    return task
}

function clearTasks(){
    return localStorage.removeItem('Task')
}

function getTask(key){
    let task = loadTask()
    return task[key]
}

function removeTask(key){
    let task = loadTask()
    delete task[key]
    task = JSON.stringify(task)
    localStorage.setItem('Task', task)
    return task
}

function setTask(key, value){
    let tasks = loadTask()
    tasks[key] = value
    tasks = JSON.stringify(tasks)
    localStorage.setItem('Task', tasks)
    return tasks
}

function loadUser(){
    let user = localStorage.getItem('User')
    if(!user){
        return {}
    }
    user = JSON.parse(user)
    return user
}

function setMainUser(name){
    let user = loadUser()
    localStorage.setItem('MainAcc',JSON.stringify(user[name]))
    return true
}

function unsetMainUser(){
    localStorage.removeItem('MainAcc')
    return true
}

function getMainUser(){
    let acc = localStorage.getItem('MainAcc')
    return acc
}

function addUser(name, pubkey, prvkey, net){
    let user = loadUser()
    user[name]={
        pubkey:pubkey,
        prvkey:prvkey,
        net:net
    }
    user = JSON.stringify(user)
    localStorage.setItem('User', user)
    return user
}

function removeUser(name){
    let user = loadUser()
    delete user[name]
    user = JSON.stringify(user)
    localStorage.setItem('User', user)
    return user
}

function getUser(name){
    let user = loadUser()
    return user[name]
}
function clearUsers(){
    localStorage.removeItem('User')
}

let storage = function Storage(){
    this.task = {
        loadTask:loadTask,
        setTask:setTask,
        getTask:getTask,
        removeTask:removeTask,
        clearTasks:clearTasks
    }
    this.user = {
        loadUser:loadUser,
        addUser:addUser,
        getUser:getUser,
        removeUser:removeUser,
        clearUsers:clearUsers
    }
    this.mainAcc = {
        get:getMainUser,
        set:setMainUser,
        unset:unsetMainUser
    }
}

module.exports = storage