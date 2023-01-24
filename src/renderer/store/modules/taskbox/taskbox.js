

import { taskboxRepository } from './taskboxRepository';

import { NodeView } from '../../../libs/nodeview';
import { ipcRenderer } from 'electron';
import { eventBus } from '../../../../main';

import apistate from "../../../enums/apistate";
import store from "../.."
import LOD from '../../../enums/LOD';
import { taskBoxInfo } from '../../models/TaskBoxInfo';
import { taskRepository } from '../task/taskRepository';
import { analizeColor, getPercentage, getTimeWasted, isTaskCanceled, isTaskDone, isTaskStarted } from '../task/task';
import { nextTick } from 'process';
import taskstate from '../../../enums/taskstate';
import { arrayToKeyValue, getMutatedNode } from '../../../libs/utils';

import moment from 'moment';
import _ from 'lodash';
import { taskModel } from '../../models/TaskModel';
import initialstate from './initialstate';

const state = () => {
    return {
        // actual root taskbox.
        root: null,
        // actual working taskbox.
        currentTaskBox: null,
        // Current TaskBox task
        // info about the taskbox tasks.
        taskBoxInfo: null,
        // List of the exposed outputs inside the taskbox.
        taskBoxInputs: [],

        //changes
        hasChanges: false,

        // alalisis
        analysing: false,
        analisis: {},

        //due
        dueTracker: {},

        // BreadCrumb Data navigation
        breadCrumb: null,

        //MODALS
        packingTaskBox: null,
        previewingTask: null,
        auditingTask: null,
        taskInputs: [],
        taskOutputs: [],

        resetingTaskbox: null,
        changingStatus: null,
        newStatus: null,

        deleting: null,

        changingWorker: null,
        toTemplate: null,

        loading: false,
        packList: [],
        fileList: [],
        LOD: LOD.LOW,

        // history stack
        backStack: [],
        changeStack: []
    }
}

const getters = {
    currentTaskBox: (state) => state.currentTaskBox && state.root ? state.root.taskboxes[state.currentTaskBox.id] : null,
    currentTaskBoxTasks: (state) => state.currentTaskBox && state.root ? Object.values(state.root.tasks).filter(t => state.root.taskboxes[state.currentTaskBox.id] && Object.keys(state.root.taskboxes[state.currentTaskBox.id].data.nodes).includes(t.id)) : [],
    currentTaskBoxTasksIdList: (state) => state.currentTaskBox && state.root ? Object.keys(state.root.taskboxes[state.currentTaskBox.id].data.nodes) : [],
    currentTaskBoxId: (state) => state.currentTaskBox ? state.currentTaskBox.id : null,
    currentRootId: (state) => state.root ? state.root.task.id : null,
    changingWorker: (state) => state.changingWorker ? state.changingWorker : null,
    isRoot: (state) => state.currentRootId == state.currentTaskBox ? true : false,
    isParentRoot: (state) => state.root.taskboxes[state.currentTaskBox.id].taskbox == state.currentRootId ? true : false
}

const actions = {
    // Creates a taskbox with  a null root id and open it.
    async CREATE_ROOT({ commit }, request) {
        store.commit('SET_API_STATE', apistate.SAVING);
        commit('SUCCESS_CLOSE_ROOT');
        return new Promise((resolve, reject) => {
            taskboxRepository.create(request).then(response => {
                store.dispatch("user/GET_TASKS", { member: null });

                resolve(commit("SUCCESS_OPEN_ROOT", { task: response.task, taskboxes: { [response.taskbox.id]: response.taskbox }, tasks: {} }));

            })
                .catch((error) => {
                    console.error(error);
                    reject(error)
                })
        });

    },
    // Delete root
    async DELETE_ROOT({ commit }, id) {
        store.commit('SET_API_STATE', apistate.LOADING);
        return new Promise((resolve) => {

            taskboxRepository.deleteRoot(id).then(async () => {
                commit('SUCCESS_DELETE_ROOT')
            })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    store.dispatch("user/GET_TASKS", { member: null })
                    resolve();
                })
        });

    },
    //Opens child taskboxes of root
    async OPEN_TASKBOX({ state, commit }, request) {

        store.commit('SET_API_STATE', apistate.LOADING);
        commit('LOADING', true);
        if (!state.root)
            taskboxRepository.openRoot(request.id).then((response) => {
                commit("SUCCESS_OPEN_ROOT", response);
            })
        else {
            let task = request.id == state.root.task.id ? state.root.task : state.root.tasks[request.id]
            Object.assign(request, { task: task })
            commit("SUCCESS_OPEN_TASKBOX", request);
        }


    },
    async GET_TASKBOX_INPUTS({ state, commit }, id) {

        store.commit('SET_API_STATE', apistate.LOADING);

        if (!id || !state.currentTaskBox.id) return;
        commit('LOADING', true);
        new Promise((resolve, reject) => {
            taskboxRepository.getTaskBoxInputs(id || state.currentTaskBox.id).then((response) => {
                // console.log(response);
                resolve(commit("SUCCESS_GET_TASKBOX_INPUTS", response));
            })
                .catch((error) => {
                    console.error(error);
                    reject(error)
                })
        });

    },
    // Save current TaskBox
    async SAVE({ getters, commit }) {
        store.commit('SET_API_STATE', apistate.SAVING);
        eventBus.$emit('setWorking', true);
        new Promise((resolve) => {

            let entity = _.cloneDeep(getters.currentTaskBox);
            taskboxRepository.find(entity.id).then((response) => {
                entity.rev = response.rev;
                taskboxRepository.saveOrUpdate(entity).then((response) => {
                    resolve(commit("SUCCESS_SAVE_TASKBOX", response));
                })
                    .catch((error) => {
                        console.error(error);
                    })

            })
                .catch((error) => {
                    console.error(error);
                })
        })

    },
    //Add Task
    async ADD_TASK({ commit }, args) {
        store.commit('SET_API_STATE', apistate.SAVING);

        return new Promise((resolve, reject) => {

            if (args.node.name == 'TaskBox') {

                taskboxRepository.create({ node: getMutatedNode(args.node), type: 'taskbox' })
                    .then((response) => {
                        commit('SUCCESS_ADD_TASKBOX', response.taskbox);
                        resolve(commit('SUCCESS_ADD_TASK', response.task));
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    })
            }
            else {
                taskRepository.create({ id: args.node.id, type: args.node.name.toLowerCase(), value: args.value, title: args.value && args.value.file ? args.value.file.name.split('.')[0] : null })
                    .then((response) => {
                        resolve(commit('SUCCESS_ADD_TASK', response));
                    })
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                    })
            }

        });
    },
    // Get current taskbox tasks
    async GET_TASKS({ getters, commit }, idList) {

        return new Promise((resolve, reject) => {
            let tasksIds = idList || getters.currentTaskBoxTasks.map(t => t.id);

            taskRepository.getList(tasksIds).then((tasks) => {
                resolve(commit('SUCCESS_SET_TASKS', tasks))
            })
                .catch((error) => {
                    console.error(error);
                    reject(error)
                })

        })
    },
    // Save an updated task
    async UPDATE_TASK({ commit }, task) {
        store.commit('SET_API_STATE', apistate.SAVING);
        return new Promise((resolve) => {
            taskRepository.saveOrUpdate(task).then((response) => {
                NodeView.updateNode(task.id);
                commit("SUCCESS_UPDATE_TASK", response);
                resolve(response);
            }).catch((error) => {
                console.error(error);
                resolve()
            })
        })

    },
    // Delete all tasks in the id list
    async CONFIRM_DELETE_TASKS({ commit }, nodes) {

        commit("SET_DELETING_TASKS", await taskboxRepository.getDeletingTree(nodes))

    },
    // Delete task
    async DELETE_TASK({ commit }, task) {
        store.commit('SET_API_STATE', apistate.SAVING);

        return new Promise((resolve) => {

            taskRepository.delete(task).then(async () => {

                if (task.taskType == 'taskbox') {

                    taskboxRepository.delete(task).then(() => {
                        commit("SUCCESS_DELETE_TASKBOX", task)
                        resolve(true);
                    })
                        .catch((error) => {
                            console.error(error);
                        })
                        
                }
                else {
                    commit("SUCCESS_DELETE_TASK", task)
                    resolve(true);
                }
            })
                .catch((error) => {
                    console.log(error);
                })
        });

    },
    // Delete task
    async REMOVE_NODES({ commit }, args) {
        store.commit('SET_API_STATE', apistate.SAVING);

        return new Promise((resolve) => {
            taskboxRepository.find(args.taskbox).then(response => {
                let taskbox = _.cloneDeep(response);
                args.nodes.forEach(id => {
                    if (taskbox.data.nodes[id])
                        delete taskbox.data.nodes[id]
                });
                taskRepository.saveOrUpdate(taskbox).then(() => {
                    resolve(commit("SUCCESS_REMOVE_NODES", args.nodes));
                })
            })
                .catch((error) => {
                    console.error(error);
                })
        })

    },
    // Delete all tasks in the id list
    async DELETE_TASKS({ commit, state }, list) {
        store.commit('SET_API_STATE', apistate.SAVING);

        new Promise((resolve) => {

            list.forEach(async (id) => {
                if (!state.root.tasks[id]) return

                taskRepository.delete({ id: id }).then(() => {
                    if (state.root.tasks[id].taskType == 'taskbox') {
                        taskboxRepository.delete({ id: id }).then(() => {
                        })
                            .catch((error) => {
                                console.error(error);
                            })
                    }
                })
                    .catch((error) => {
                        console.log(error);
                    })
            });

            resolve(commit("SUCCESS_DELETE_TASKS", list));
        })
    },
    // Move tasks between taskboxes
    async MOVE_TASKS_TO({ commit }, args) {
        store.commit('SET_API_STATE', apistate.SAVING);
        return new Promise((resolve, reject) => {
            taskboxRepository.moveTasksTo(args.from, args.to, args.list).then((response) => {
                commit('SUCCESS_MOVE_TASKS_TO', response);
                resolve(response);
            })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })

        });
    },
    async PACK_TASKBOX({ state }, id) {
        return new Promise((resolve, reject) => {

            taskboxRepository.packTaskBox(id || state.currentTaskBox.id).then((response) => {
                resolve(response);
            })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })
    },
    // Put selected tasks in a new taskbox
    async PACKIN_TASKBOX({ state, commit, dispatch }, args) {
        store.commit('SET_API_STATE', apistate.SAVING);

        let idList = args.selection.map((n) => n.id);

        commit("SUCCESS_DELETE_TASKS", idList);

        return new Promise((resolve, reject) => {

            taskboxRepository.create({ node: getMutatedNode(args.node), type: 'taskbox' }).then((response) => {
                dispatch('MOVE_TASKS_TO', { from: state.currentTaskBox.id, to: response.taskbox.id, list: idList }).then(() => {
                    resolve(commit('SUCCESS_PACKIN_TASKBOX', response));
                })
            })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })

    },
    // Put all tasks of the selected taskbox in the current taskbox
    async UNPACK_TASKBOX({ state, commit, dispatch }, taskbox) {
        store.commit('SET_API_STATE', apistate.SAVING);

        return new Promise((resolve) => {
            console.log(taskbox);
            taskboxRepository.getChildrenIds(taskbox.id).then(list => {
                if (list.length)
                    dispatch('MOVE_TASKS_TO', { from: taskbox.id, to: state.currentTaskBox.id, list: list }).then((args) => {
                        commit('SUCCESS_UNPACK_TASKBOX', { node: taskbox, children: args.list });
                        nextTick(() => {
                            taskboxRepository.delete(state.root.tasks[taskbox.id]).then(() => {
                                commit("SUCCESS_DELETE_TASKS", [taskbox.id]);
                            })
                            resolve({ taskbox: args.to, selection: list });
                        })

                    })
                        .catch((error) => {
                            console.log(error);
                        })
            })
        })

    },
    async CREATE_TEMPLATE({ commit }, root) {

        store.commit('SET_API_STATE', apistate.SAVING);

        return new Promise((resolve) => {

            taskboxRepository.createTemplate(root).then((template) => {
                commit('SUCCESS_CREATE_TEMPLATE', template)
                resolve(template);
            })


        });
    },
    async ADD_TEMPLATE({ commit }, args) {
        store.commit('SET_API_STATE', apistate.SAVING);

        return new Promise((resolve) => {
            taskboxRepository.buildTemplate(args.template, args.node).then((response) => {
                commit('SUCCESS_ADD_TEMPLATE', response);
                resolve();
            })

        });

    },
    async UPDATE_TASKBOX({ commit }, taskbox){
        taskboxRepository.saveOrUpdate(taskbox).then(()=>{
            commit('SUCCESS_UPDATE_TASKBOX');
        })
    },
    async UPDATE_TASKBOX_PROGRESS({ state, dispatch }, value) {
        let info = value || state.taskBoxInfo || null;
        if (!info) return;
        new Promise((resolve) => {
            nextTick(() => {

                let copy = _.cloneDeep(state.currentTaskBox);
                let hasChanges = false;

                if (info.Incomplete.value > 0) {

                    if ((isTaskDone(state.currentTaskBox)) || (!isTaskStarted(state.currentTaskBox) && (info.Unstarted.value !== (info.Total.value - info.Canceled.value))))
                        store.commit('task/WORK_ON_TASK', state.currentTaskBox);


                    if (state.currentTaskBox.status !== taskstate.UNSTARTED.value && (info.Unstarted.value == (info.Total.value - info.Canceled.value))) {
                        let now = new Date().toISOString();

                        let progresses = copy.due.progressChanges;
                        progresses.push({ progress: 0, time: now, fromStatus: copy.status, toStatus: 0 })
                        copy.due = _.cloneDeep(taskModel).due;
                        copy.due.progressChanges = progresses;

                        hasChanges = true;

                    }
                }
                else {
                    if (info.Incomplete.value == 0 && !isTaskDone(state.currentTaskBox) && info.Total.value > 0) {
                        store.commit('task/SET_TASK_DONE', state.currentTaskBox);
                    }
                }
                if (state.currentTaskBox && state.currentTaskBox.progress !== info.Progress && info.Total.value > 0) {
                    copy.progress = info.Progress;
                    let changetime = new Date().toISOString();
                    if (!copy.due.progressChanges)
                        Object.assign(copy.due, { progressChanges: [] });

                    copy.due.progressChanges.push({ progress: copy.progress, time: changetime });

                    hasChanges = true;

                }

                if (hasChanges) {
                    if (!copy.taskInfo)
                        Object.assign(copy, { taskInfo: null });

                    let res = {};
                    Object.keys(info).map(v => {
                        return res[v] = { value: info[v].value }
                    });
                    copy.progress = info.Progress;
                    copy.taskInfo = res;
                    resolve(dispatch('UPDATE_TASK', copy));
                }
                else (resolve())

            })
        })
    },
    async GET_TASKBOX_INFO({ state, commit }, tasks) {
        store.commit('SET_API_STATE', apistate.LOADING);

        if (!state.currentTaskBox)
            return;

        return new Promise((resolve, reject) => {
            let taskList = tasks || Object.values(state.root.tasks).filter(t => state.root.taskboxes[state.currentTaskBox.id] && Object.keys(state.root.taskboxes[state.currentTaskBox.id].data.nodes).includes(t.id));
            taskboxRepository.getTaskBoxInfo(taskList).then((info) => {
                commit('SUCCESS_SET_TASKBOX_INFO', info || taskBoxInfo)
                resolve(info || taskBoxInfo);

            })
                .catch((error) => {
                    console.error(error);
                    reject(error)
                })
        });
    },
    async UPDATE_BREADCRUMB({ state, commit }) {
        let current = _.cloneDeep(state.currentTaskBox);
        // if (!current) return;
        // Object.assign(current, { children: [] });
        // current.children = Object.values(state.root.tasks).filter(t => t.taskType == 'taskbox');

        taskboxRepository.getBreadCrumb(state.root.task, current).then((response) => {
            commit('SUCCESS_UPDATE_BREADCRUMB', response)
        })
    },
    async GET_PACK_LIST({ commit }) {
        let list = await ipcRenderer.invoke('app:getPackList')
            .then((list) => {
                commit("UPDATE_PACK_LIST", list || []);
            })
        return list;
    },
    async GET_FILE_LIST({ commit }) {
        let list = await ipcRenderer.invoke('app:getFileList')
            .then((list) => {
                commit("UPDATE_FILE_LIST", list || []);
            })
        return list;
    },
    async RESET_TASKBOX_TASK({ commit }, id) {
        await new Promise((res) => {
            taskboxRepository.resetTask(id).then(() => {
                commit('SUCCESS_RESET_TASKBOX_TASK');
                res();
            })

        })
    },
    async SET_TASKBOX_DONE({ commit }, id) {
        await new Promise((res) => {
            taskboxRepository.setTaskDone(id).then(() => {
                commit('SUCCESS_SET_TASKBOX_DONE');
                res();
            })

        })
    },
    async SET_TASKBOX_PAUSED({ commit }, id) {
        await new Promise((res) => {
            taskboxRepository.setTaskPaused(id).then(() => {
                commit('SUCCESS_SET_TASKBOX_PAUSED');
                res();
            })

        })
    },
    async SET_TASKBOX_WORKING({ commit }, id) {
        await new Promise((res) => {
            taskboxRepository.setTaskWorking(id).then(() => {
                commit('SUCCESS_SET_TASKBOX_PAUSED');
                res();
            })

        })
    },
}

const mutations = {
    LOADING(state, value) {
        state.loading = value;
    },
    SUCCESS_OPEN_ROOT(state, root) {

        state.root = root;
        state.currentTaskBox = root.task;

        store.dispatch('taskbox/UPDATE_BREADCRUMB').then(() => {
            store.dispatch('taskbox/GET_TASKBOX_INPUTS').then(() => {
                store.dispatch('taskbox/GET_TASKBOX_INFO').then(() => {

                    store.commit('taskbox/RESET_CHANGE_STACK');

                    eventBus.$emit('OpenTaskbox', true);

                    store.commit('taskbox/LOADING', false);
                    store.commit('app/SET_MAIN_TAB', 0);
                    store.commit('SET_API_STATE', apistate.DONE);
                })
            })
        })
    },
    SUCCESS_OPEN_TASKBOX(state, args) {

        state.currentTaskBox = args.task;
        store.commit('app/SET_MAIN_TAB', 0);
        eventBus.$emit('OpenTaskbox', args.deeper);

        nextTick(() => {
            store.dispatch('taskbox/UPDATE_BREADCRUMB').then(() => {
                // store.dispatch('taskbox/GET_TASKBOX_INPUTS',args.task.id).then(() => {
                store.dispatch('taskbox/GET_TASKBOX_INFO').then(() => {

                })
                    // })
                    .catch(() => { })
                    .finally(() => {
                        store.commit('taskbox/RESET_CHANGE_STACK');
                        store.commit('taskbox/LOADING', false);
                        store.commit('SET_API_STATE', apistate.DONE);
                    })
            })

        })

    },
    SUCCESS_SET_TASKBOX: (state, taskbox) => {
        state.root.taskboxes[taskbox.id] = taskbox;
    },
    SUCCESS_SET_TASKBOX_TASK: (state, task) => {
        state.currentTaskBox = task;
        if (state.previewingTask)
            store.commit('taskbox/PREVIEW_TASK', { task: state.currentTaskBox, savestack: true });
    },
    SUCCESS_RESET_TASKBOX_TASK: () => {
    },
    SUCCESS_SET_TASKBOX_DONE: () => {
    },
    SUCCESS_SET_TASKBOX_PAUSED: () => {
    },
    RESET_TASK(state) {
        state.resetingTaskbox = true;
    },
    CLOSE_RESETING_TASK(state) {
        state.resetingTaskbox = false;
    },
    SUCCESS_CLOSE_ROOT: (state) => {
        NodeView.clear();
        Object.assign(state, initialstate);
        NodeView.close();
        state.hasChanges = false;
    },
    SUCCESS_DELETE_ROOT() {
    },
    SUCCESS_GET_TASKBOX_INPUTS(state, inputs) {
        state.taskBoxInputs = inputs;
    },
    SUCCESS_SAVE_TASKBOX: (state, taskbox) => {

        if (taskbox) {
            store.commit('taskbox/SUCCESS_SET_TASKBOX', taskbox);

            nextTick(() => {
                store.dispatch('taskbox/UPDATE_BREADCRUMB').then(() => {
                    // store.dispatch('taskbox/GET_TASKBOX_INFO').then(() => {
                    setTimeout(() => {
                        store.commit('taskbox/SET_HAS_CHANGES', false);
                        store.commit('SET_API_STATE', apistate.DONE);
                        eventBus.$emit('setWorking', false)
                    }, 700);
                    // })
                })
            })
        }
    },
    SUCCESS_UPDATE_TASKBOX(){

    },
    SUCCESS_UPDATE_TASKS_INFO(){
        nextTick(() => {
            store.dispatch('taskbox/UPDATE_BREADCRUMB').then(() => {
                store.dispatch('taskbox/GET_TASKBOX_INFO').then((info) => {
                    store.dispatch('taskbox/UPDATE_TASKBOX_PROGRESS', info).then(() => {
                        setTimeout(() => {
                            store.commit('SET_API_STATE', apistate.DONE);
                            eventBus.$emit('updateTasks');
                        }, 700);
                    })
                })
            })
        })
    },
    SUCCESS_SET_TASKS(state, tasks) {
        state.root.tasks = tasks;
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_SET_TASK(state, task) {
        state.root.tasks[task.id] = task;
        // store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_ADD_TASKBOX: async (state, taskbox) => {
        Object.assign(state.root.taskboxes, arrayToKeyValue([taskbox]))
        store.commit('SET_API_STATE', apistate.DONE);
    },
    SUCCESS_ADD_TASK: async (state, task) => {

        Object.assign(state.root.tasks, arrayToKeyValue([task]))
        NodeView.saveTaskBox(true);
        store.commit('taskbox/SUCCESS_UPDATE_TASKS_INFO');
      
    },
    SET_DELETING_TASKS: (state, deleting) => {
        state.deleting = deleting;
    },
    SUCCESS_REMOVE_NODES: (state, nodes) => {
        nodes.forEach(id => {
            if (state.root.taskboxes[state.currentTaskBox.id].data.nodes[id])
                delete state.root.taskboxes[state.currentTaskBox.id].data.nodes[id];
        })
    },
    SUCCESS_DELETE_TASKBOX: (state,task) => {

        if(state.root.taskboxes[task.id])
            delete state.root.taskboxes[task.id];

        // remove node from current taskbox
        if(state.root.taskboxes[state.root.tasks[task.id].taskbox].data.nodes[task.id]){
            delete state.root.taskboxes[state.root.tasks[task.id].taskbox].data.nodes[task.id];

            if(state.root.tasks[task.id].taskbox !== state.currentTaskBox.id)
            store.dispatch('taskbox/UPDATE_TASKBOX',state.root.taskboxes[state.root.tasks[task.id].taskbox])
            // save taskbox
        }

        // remove from root tasks list
        if(state.root.tasks[task.id])
            delete state.root.tasks[task.id];

        // try to delete the node in the node view
        NodeView.deleteNode(task.id);

        
    },
    SUCCESS_DELETE_TASK: (state,task) => {

        // remove from root tasks list
        if(state.root.tasks[task.id])
            delete state.root.tasks[task.id];

        // remove node from current taskbox
        if(state.root.tasks[task.id].taskbox == state.currentTaskBox.id){
            if(state.root.taskboxes[state.currentTaskBox.id].data.nodes[task.id])
            delete state.root.taskboxes[state.currentTaskBox.id].data.nodes[task.id]
            // try to delete the node in the node view
            NodeView.deleteNode(task.id);
        }
        
    },
    SUCCESS_DELETE_TASKS: (state, list) => {

        list.forEach(id => {

            if (state.root.taskboxes[state.currentTaskBox.id].data.nodes[id])
                delete state.root.taskboxes[state.currentTaskBox.id].data.nodes[id];

            if (state.root.tasks[id] && state.root.taskboxes[state.root.tasks[id].taskbox].data.nodes[id])
                delete state.root.taskboxes[state.root.tasks[id].taskbox].data.nodes[id];

            if (state.root.tasks[id] && state.root.tasks[id].taskType == 'taskbox')
                delete state.root.taskboxes[id];

            if (state.root.tasks[id])
                delete state.root.tasks[id];

            NodeView.deleteNode(id);
        })

        NodeView.saveTaskBox(true);

        store.commit('taskbox/SUCCESS_UPDATE_TASKS_INFO');
    },
    SUCCESS_UPDATE_TASK(state, task) {

        if (state.previewingTask && state.previewingTask.id == task.id)
            if (JSON.stringify(_.cloneDeep(state.previewingTask).value) !== JSON.stringify(_.cloneDeep(task).value)
                && state.previewingTask.taskType == 'file')
                store.commit('taskbox/PREVIEW_TASK', { task: task, savestack: false });
            else
                store.commit('taskbox/UPDATE_PREVIEWING_TASK', task);

        if (state.auditingTask && state.auditingTask.id == task.id)
            store.commit('taskbox/UPDATE_AUDITING_TASK', task);


        if (state.root) {

            if (state.root.tasks[task.id])
                state.root.tasks[task.id] = task;


            if (task.id == state.currentTaskBox.id)
                state.currentTaskBox = task;


            if (state.analysing !== false)
                store.commit('taskbox/ANALISE')

            store.commit('user/SUCCESS_UPDATE_TASK', task)
            store.commit('taskbox/SUCCESS_UPDATE_TASKS_INFO');

        }

    },
    SET_PACKING(state, task) {
        state.packingTaskBox = task || state.currentTaskBox;
    },
    CLOSE_PACKING(state) {
        state.packingTaskBox = null;
    },
    SUCCESS_PACKIN_TASKBOX(state, args) {
        state.root.tasks[args.task.id] = args.task;
        state.root.taskboxes[state.currentTaskBox.id].data.nodes[args.node.id] = args.node;
        store.dispatch('taskbox/GET_TASKS');
    },
    SUCCESS_UNPACK_TASKBOX: (state, args) => {

        console.log(args);

        // delete state.root.tasks[args.node.id];

        // args.children.map(id => {
        //     state.root.tasks[id] = args.children[id];
        //     state.currentTaskBox.node.data.nodes[id] = args.children[id].node;
        //     store.commit('taskbox/ADD_TO_CHANGE_STACK', [id]);
        // });

        // if (state.currentTaskBox.node.data.nodes[args.node.id])
        //     delete state.currentTaskBox.node.data.nodes[args.node.id];



        // store.commit('SET_API_STATE', apistate.DONE);

    },
    SUCCESS_MOVE_TASKS_TO: (state, args) => {

        if (!state.root) return;

        if (args.from.id == state.currentTaskBox) {
            state.root.taskboxes[state.currentTaskBox.id].data = args.from.data;
        }
        else
            if (args.to.id == state.currentTaskBox)
                state.root.taskboxes[state.currentTaskBox.id].data = args.to.data;

        store.commit('SET_API_STATE', apistate.DONE);
    },
    CHANGE_DELETING_STATUS(state,args){
        args.item.status = args.status
    },
    CONFIRM_DELETE_TASKS(state, selection) {
        if (state.previewingTask) return;
        state.deletingNodes = selection.map(id => state.root.tasks[id]);
    },
    CLOSE_DELETE_TASKS(state) {
        state.deletingNodes = null;
    },
    CREATE_TEMPLATE: (state, entity) => {
        state.toTemplate = entity;
    },
    CLOSE_CREATE_TEMPLATE: (state) => {
        state.toTemplate = null;
    },
    SUCCESS_CREATE_TEMPLATE: () => {
    },
    SUCCESS_ADD_TEMPLATE: (state, args) => {
        state.root.taskboxes[state.currentTaskBox.id].data.nodes[args.node.id] = args.node;
        NodeView.saveTaskBox(true);
        args.tasks.forEach(task => {
            state.root.tasks[task.id] = task;
        })
        args.taskboxes.forEach(taskbox => {
            state.root.taskboxes[taskbox.id] = taskbox;
        })
        store.commit('SET_API_STATE', apistate.DONE);
    },
    UPDATE_AUDITING_TASK: async (state, task) => {
        Object.assign(state.auditingTask, task);
    },
    UPDATE_PREVIEWING_TASK: (state, task) => {
        Object.assign(state.previewingTask, task);
    },
    // Update current taskbox data from Node View
    UPDATE_EDITOR_CHANGES(state, request) {
        if (!state.currentTaskBox) return;
        Object.assign(state.root.taskboxes[state.currentTaskBox.id].data, request.data);
        if (request.save)
            store.dispatch('taskbox/SAVE')

    },
    //Change stack
    SET_HAS_CHANGES(state, value) {
        state.hasChanges = value;
    },
    RESET_CHANGE_STACK(state) {
        state.changeStack.splice(0, state.changeStack.length);
        state.hasChanges = false;
    },
    ADD_TO_CHANGE_STACK(state, ids) {
        ids.forEach(id => {
            if (!state.changeStack.includes(id))
                state.changeStack.push(id);
        });
        state.hasChanges = true;
    },
    // Node view LOD
    SETLOD(state, value) {
        state.LOD = value;
    },
    // Due Tracker
    UPDATE_TRACKER(state, request) {
        state.trackerUpdated = false;
        state.dueTracker[request.id] = request.tracker
        state.trackerUpdated = true;
    },
    RESET_TRACKER(state) {
        state.dueTracker = {};
    },
    REMOVE_TRACKER(state, id) {
        if (state.dueTracker[id])
            delete state.dueTracker[id]
    },
    SUCCESS_SET_TASKBOX_INFO(state, info) {
        state.taskBoxInfo = info;
    },
    SUCCESS_UPDATE_BREADCRUMB(state, breadcrumb) {
        state.breadCrumb = breadcrumb;
    },
    CHANGE_TASK_WORKER(state, entity) {
        state.changingWorker = entity;
    },
    CLOSE_WORKER_WINDOW(state) {
        state.changingWorker = null;
    },
    SET_PREVIEWING_TASK_IO(state, args) {
        state.taskInputs = args.inputs;
        state.taskOutputs = args.outputs;
    },
    async SET_PREVIEWING_TASK(state, task) {
        state.previewingTask = task;
        let connections = await taskboxRepository.getIOTasks(task);
        store.commit('taskbox/SET_PREVIEWING_TASK_IO', connections);
    },
    SET_AUDITING_TASK(state, task) {
        state.auditingTask = task;
    },
    AUDIT_NEXT_INPUT(state) {
        if (!state.auditingTask)
            return state.auditingTask = state.taskInputs[0]

        let index = state.taskInputs.indexOf(state.auditingTask);
        if (index + 1 < state.taskInputs.length)
            state.auditingTask = state.taskInputs[index + 1];
    },
    PREVIEW_TASK(state, request) {
        let entity = null;

        if (typeof (request.task) == 'string')
            entity = state.root.tasks[request.task]
        else
            entity = request.task

        if (!entity) return;

        store.commit('taskbox/SET_PREVIEWING_TASK', entity);

        if (request.savestack)
            store.commit('taskbox/UPDATE_BACK_STACK', { isTaskbox: state.previewingTask.taskType == 'taskbox', id: state.previewingTask.id, taskbox: state.previewingTask.taskbox });


    },
    CLOSE_CONFIRM_STATUS(state) {
        state.changingStatus = null;
        state.newStatus = null;
    },
    CONFIRM_STATUS(state, request) {
        state.changingStatus = request.task;
        state.newStatus = request.status;
    },
    CLOSE_PREVIEW(state) {
        // if (store.state.app.appSettings[1].value && state.previewingTask.type == 'task') store.commit(`task/PAUSE_TASK`, _.cloneDeep(state.previewingTask));

        state.previewingTask = null;
        state.auditingTask = null;
        state.taskInputs = state.taskInputs.splice(0, state.taskInputs.length);
        state.taskOutputs = state.taskOutputs.splice(0, state.taskOutputs.length);

        store.commit('taskbox/RESET_BACK_STACK');
    },
    RESET_BACK_STACK: (state) => {
        state.backStack.splice(0, state.backStack.length);
    },
    UPDATE_BACK_STACK: (state, item) => {
        state.backStack.push(item);
    },
    NAV_HOME: (state) => {
        if (state.currentTaskBox.id == state.root.task.id) return;
        store.dispatch('taskbox/OPEN_TASKBOX', { id: state.root.task.id, deeper: false, savestack: false }).then(() => {
            store.commit('taskbox/RESET_BACK_STACK');
        })
    },
    NAV_UP: (state) => {
        if (state.currentTaskBox.id == state.root.task.id) return;
        store.dispatch('taskbox/OPEN_TASKBOX', { id: state.currentTaskBox.taskbox, deeper: false, savestack: true });
    },
    NAV_BACK: (state) => {
        if (state.backStack.length > 0) {
            let id = state.backStack[state.backStack.length - 2].id;

            store.commit('taskbox/PREVIEW_TASK', { task: state.root.tasks[id], savestack: false });

            state.backStack.pop();
        }
    },
    UPDATE_PACK_LIST: (state, list) => {
        state.packList = list;
    },
    UPDATE_FILE_LIST: (state, list) => {
        state.fileList = list;
    },
    CREATE_CONNECTION: (state, conn) => {
        conn.data.taskbox = conn.output.node.data.taskbox;
        conn.data.projectId = conn.output.node.data.projectId;
        conn.data.socket = conn.output.node.name;
        conn.data.connections = {};

        store.commit('taskbox/ADD_TO_CHANGE_STACK', [conn.input.node.id, conn.output.node.id]);

    },
    REMOVE_EXTERNAL_CONNECTION: (state, request) => {
        delete request.conn.data.connections[request.node];
    },
    SET_TASKBOX_DATA: (state, request) => {
        request.node.data = request.data;
    },

    UPDATE_DATA_LEVEL: (state, request) => {
        request.node.data.level = request.value;
    },
    UPDATE_DATA_TASKORDER: (state, request) => {
        request.node.data.taskOrder = request.value;
    },

    UPDATE_TASKBOX_INPUTS: () => {
        NodeView.process();
        NodeView.saveTaskBox();
    },
    TOGGLE_DATA_FLOWING: (state, request) => {

        request.taskbox.data.flowingData.flowing = request.value;
        Object.values(request.taskbox.data.nodes).forEach(node => {
            // if (node.name == "TaskBox"){
            //   node.data.flowingData.flowing = request.value;
            //   // store.commit('task/toogleAllTasksFlowing', { taskbox: node, value: request.value });
            // }
            // else
            node.data.flowingData.flowing = request.value;
        });
        NodeView.process();
        NodeView.saveTaskBox();
    },
    CHANGE_ANALISIS(state, type) {
        state.analysing = type;
        if (type == false) {
            Object.assign(state.analisis, {});
            NodeView.updateNodes();
        }

    },
    SET_ANALISIS(state, analisis) {
        state.analisis = analisis;
    },
    ANALISE(state, list) {
        state.analisis = {};

        if (state.analysing == false)
            return;

        if (!list && !state.root.tasks)
            return;

        if (!list)
            list = store.getters['taskbox/currentTaskBoxTasks'];


        let anl = {};
        let tasksList = list.map((t) => {
            if (t.taskType == 'taskbox')
                return t.taskInfo ? t.taskInfo.Total.value - t.taskInfo.Canceled.value : 0;
            else {
                if (t.taskType == 'audition')
                    return t.value && t.value.auditions ? Object.keys(t.value.auditions).length : 0;
            }
            return 1;
        })

        let durationList = list.map((t) => getTimeWasted(t.due));

        let reviewsList = list.map((t) => t.due.reviews && t.due.reviews.length || 0);
        let pausesList = list.map((t) => t.due.pauses.length);

        let count = 0;
        list.forEach((item) => {

            let tasks = tasksList[count];
            let tasksP = getPercentage(tasksList, tasksList[count]);

            let progress = item.progress;

            let duration = durationList[count];
            let durationP = getPercentage(durationList, durationList[count]);

            let reviews = reviewsList[count];
            let reviewsP = getPercentage(reviewsList, reviewsList[count]);

            let pauses = pausesList[count];
            let pausesP = getPercentage(pausesList, pausesList[count]);
            anl[item.id] = {
                tasks: {
                    text: `${tasks} task${tasks !== 1 ? 's' : ''}`,
                    value: tasks,
                    percentage: tasksP,
                    color: !isTaskCanceled(item) ? analizeColor(tasksP, true) : 'black',
                },
                progress: {
                    text: `${progress}%`,
                    value: progress,
                    percentage: progress,
                    color: !isTaskCanceled(item) ? analizeColor(progress, false) : 'black',
                },
                duration: {
                    text: isTaskDone(item) ? `Done in ${moment.utc(duration).format("HH mm' ss''")}` : 'Undone',
                    value: duration,
                    percentage: durationP,
                    color: !isTaskCanceled(item) ? isTaskDone(item) ? analizeColor(durationP, true) : 'grey' : 'black',
                },
                reviews: {
                    text: `${reviews} Review${reviews !== 1 ? 's' : ''}`,
                    value: reviews,
                    percentage: reviewsP,
                    color: !isTaskCanceled(item) ? analizeColor(reviewsP, true) : 'black',
                },
                pauses: {
                    text: `${pauses} Pause${pauses !== 1 ? 's' : ''}`,
                    value: pauses,
                    percentage: pausesP,
                    color: !isTaskCanceled(item) ? analizeColor(pausesP, true) : 'black',
                },
            }
            count++;
        })
        store.commit('taskbox/SET_ANALISIS', anl)

        NodeView.updateNodes();
    },


}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}


