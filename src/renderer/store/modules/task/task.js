import { taskRepository } from './taskRepository';
import { auditionModel, reviewItem } from '../../models/TaskModel';

import taskstate from '../../../enums/taskstate';
import moment from 'moment'
import store from '../..';
import _ from 'lodash';
import { candidateModel } from '../../models/PostModel';
import auditionstatus from '../../../enums/auditionstatus';
import CREDENTIALS from '../../../enums/credentials';
import { NodeView } from '../../../libs/nodeview';
import { eventBus } from '../../../../main';
import reviewstatus from '../../../enums/reviewstatus';

const state = () => {
}

const getters = {
}

const actions = {
    async FETCH_TASKS({ commit }, taskboxId) {
        return new Promise((resolve, reject) => {
            try {
                taskRepository.get(taskboxId).then(response => {
                    resolve(commit('SET_TASKS', response))
                });
            } catch (error) {
                reject(error)
            }
        });
    },
    async ADD_TASK({ commit }, node) {
        return new Promise((resolve, reject) => {

            taskRepository.createFromNode(node)
                .then((task) => {
                    commit('SUCCESS_CREATE_TASK');
                    resolve(task);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                })
        })

    },
    async FETCH_TASK({ commit }, id) {

        return taskRepository.find(id).then(response => {
            commit('SUCCESS_FETCH_TASK');
            return response;
        }).catch((error) => {
            console.log(error);
        })

    },
    async GET_FIELD({ commit }, args) {
        return taskRepository.getField(args.task, args.field).then(response => {
            commit('SUCCESS_FETCH_TASK');
            return response;
        }).catch((error) => {
            console.log(error);
        })
    },
    async GET_REVIEWS({ commit }, id) {
        return taskRepository.getReviews(id).then(response => {
            commit('SUCCESS_FETCH_TASK');
            return response;
        }).catch((error) => {
            console.log(error);
        })
    },
    async AUDIT({ dispatch, commit }, args) {
        let response = null;

        if (typeof (args.audition) == 'string')
            response = await dispatch('FIND_TASK', args.audition)
        else {
            if (typeof (args.audition) == 'object')
                response = args.audition;
        }
        if (!response) return [];
        let auditTask = _.cloneDeep(response)

        if (!auditTask.value || !auditTask.value.auditions)
            auditTask.value = { auditions: {} }

        if (auditTask.value.auditions[args.auditing]) return;

        let auditor = store.state.user.profile;
        let audition = Object.assign({}, auditionModel)
        audition.createdAt = new Date().toISOString();
        audition.member = auditor.id;
        auditTask.value.auditions[args.auditing] = audition;

        commit('UPDATE_AUDITION_PROGRESS', { task: auditTask, inputs: args.inputs, save: true });
    },

    async CHECK_AUDITING_INPUTS({ commit, dispatch }, args) {

        let auditions = [];

        let copy = null;

        if (typeof (args.audition) == 'string')
            copy = _.cloneDeep(await dispatch('FIND_TASK', args.audition))
        else {
            if (typeof (args.audition) == 'object')
                copy = _.cloneDeep(args.audition);
        }

        if (args.audition.value && args.audition.value.auditions) {
            auditions = Object.keys(args.audition.value.auditions);
        }
        else
            Object.assign(copy.value, { auditions: {} })

        if (args.inputs == auditions) return;

        commit('UPDATE_AUDITION_PROGRESS', { task: copy, inputs: args.inputs, save: true });

    },
    async FIND_TASK({ commit }, id) {
        let task = store.state.taskbox.root.tasks[id];
        if (task)
            return task;
        return taskRepository.find(id).then(response => {
            commit('SUCCESS_FETCH_TASK');
            return response;
        }).catch((error) => {
            console.log(error);
        })
    },
    async CANDIDATE_TO_TASK({ commit }, args) {

        if (!args.task) return;

        return new Promise(response => {
            taskRepository.find(args.task).then((task) => {
                if (!task) return;

                let copy = _.cloneDeep(task);

                if (!copy.candidats)
                    Object.assign(copy, { candidats: [] })

                if (copy.candidats.find(c => c.member == args.member)) return;

                let candidate = Object.assign({}, candidateModel);
                candidate.member = args.member;
                candidate.createdAt = new Date().toISOString();
                copy.candidats.push(candidate)

                taskRepository.saveOrUpdate(copy).then(() => {
                    commit("SUCCESS_UPDATE_TASK")
                    response(copy.candidats);
                })

            })

        })
    },
    async REMOVE_TASK_CANDIDATE({ commit }, args) {

        if (!args.task) return;

        return new Promise(response => {
            taskRepository.find(args.task).then((task) => {

                if (!task || !task.candidats) return;

                let candidate = task.candidats.find(c => c.member == args.member);
                if (!candidate) return;

                let index = task.candidats.indexOf(candidate);

                let copy = _.cloneDeep(task);

                copy.candidats.splice(index, 1);

                taskRepository.saveOrUpdate(copy).then((res) => {
                    commit("SUCCESS_UPDATE_TASK")
                    response(res.candidats);
                })

            })

        })
    },
    async ADD_REVIEW_ITEM({ commit }, args) {

        let copy = _.cloneDeep(args.task);

        if (!copy.auditors) {
            Object.assign(copy, { auditors: {} });

            let newAudition = Object.assign({}, _.cloneDeep(auditionModel));
            newAudition.createdAt = new Date().toISOString();

            copy.auditors[args.auditor] = newAudition;
        }

        let item = Object.assign({}, reviewItem);
        item.text = args.msg;

        copy.auditors[args.auditor].reviews.push(item);

        return store.dispatch('taskbox/UPDATE_TASK', copy)
            .then(() => {
                commit('SUCCESS_UPDATE_TASK')
                return true;
            })
            .catch((error) => console.log(error))

    },
    async DELETE_REVIEW_ITEM({ commit }, args) {

        let copy = _.cloneDeep(args.task);

        if (!copy.auditors || !copy.auditors[args.auditor].reviews[args.index]) return;

        copy.auditors[args.auditor].reviews.splice(args.index, 1);

        return store.dispatch('taskbox/UPDATE_TASK', copy)
            .then(() => {
                commit('SUCCESS_UPDATE_TASK')
                return true;
            })
            .catch((error) => console.log(error))

    },
    async TOGGLE_REVIEW_ITEM({ commit }, args) {
        let copy = _.cloneDeep(args.task);

        if (!copy.auditors || !copy.auditors[args.auditor].reviews[args.index]) return;

        if (copy.auditors[args.auditor].reviews[args.index].checked == undefined || copy.auditors[args.auditor].reviews[args.index].checked == null)
            Object.assign(copy.auditors[args.auditor].reviews[args.index], { checked: false });

        copy.auditors[args.auditor].reviews[args.index].checked = !copy.auditors[args.auditor].reviews[args.index].checked;

        return store.dispatch('taskbox/UPDATE_TASK', copy)
            .then(() => {
                commit('SUCCESS_UPDATE_TASK')
                return true;
            })
            .catch((error) => console.log(error))

    },
    async SET_REVIEW_STATUS({ commit }, args) {

        let copy = _.cloneDeep(args.task);

        if (!copy.auditors || !copy.auditors[args.auditor].reviews[args.index]) return;

        copy.auditors[args.auditor].reviews[args.index].status = args.status;
        if(args.status == reviewstatus.REFUSED.value)
        copy.auditors[args.auditor].reviews[args.index].checked = false;

        return store.dispatch('taskbox/UPDATE_TASK', copy)
            .then(() => {
                commit('SUCCESS_UPDATE_TASK')
                return true;
            })
            .catch((error) => console.log(error))

    },





}


export function isTaskStarted(task) {
    if (!task) return false
    return task.status > 0 ? true : false;
}

export function isTaskWorking(task) {
    return task.status == taskstate.STARTED.value ? true : false;
}

export function isTaskPaused(task) {
    if (!task) return false
    return task.status == taskstate.PAUSED.value ? true : false;
}

export function isTaskReviewing(task) {
    if (!task) return false
    return task.status == taskstate.REVIEWING.value ? true : false;
}

export function isTaskCanceled(task) {
    if (!task) return false
    return task.status == taskstate.REPROVED.value ? true : false;
}

export function isTaskDone(task) {
    if (!task) return false
    return task.status == taskstate.DONE.value ? true : false;
}

export function isTaskOpen() {
    return false ;
    // if (!task) return false
    // return task.status == taskstate.OPEN.value ? true : false;
}

export function hasOpenAuditions(task) {

    if (typeof task == 'string')
        task = store.state.taskbox.root.tasks[task];

    if (task && task.taskType == 'audition')
        return !isTaskDone(task)


    else return false;
}

export function hasDueStart(task) {
    if (!task) return false
    return task.due.plannedToStartAt ? true : false;
}

export function hasDueEnd(task) {
    if (!task && !task.due) return false
    return task.due.plannedToEndAt ? true : false;
}

export function isTaskable(task) {
    return task.taskable ? true : false;
}

export function getTimeWasted(due) {
    if (due.completedAt && due.startedAt) {

        let start = new Date(due.startedAt).getTime();
        let end = new Date(due.completedAt).getTime();
        let duration = end - start;
        console.log(duration);
        return duration;
    }
    else
        return 0;
}

export function analizeColor(value, reverse) {
    if (isNaN(value) || value == Infinity)
        value = 0;
    if (value > 1000) value /= 1000;
    let red = value > 50 ? 1 - (2 * (value - 50)) / 100 : 1;
    let green = value > 50 ? 1 : (2 * value) / 100;
    let blue = value / 100 / 2 / 255;

    if (!reverse)
        return `rgb(${red * 255},${green * 255},${blue})`;
    else
        return `rgb(${green * 255},${red * 255},${blue})`;
}

export function getWeightedAverage(array, value) {

    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };

    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };

    let sum = array.reduce(function (a, b) {
        return (a * value) + (b * value);
    }) / (array.length * value);

    return sum / 1000;
}

export function getPercentage(array, value) {

    Array.prototype.max = function () {
        return Math.max.apply(null, this);
    };

    Array.prototype.min = function () {
        return Math.min.apply(null, this);
    };

    let min = array.map((v) => v).min();
    let max = array.map((v) => v).max();

    let range = (max - min);
    let calc = Math.round(((value - min) * 100) / range);
    return isNaN(calc) ? 0 : calc;
}

const mutations = {
    SET_TASKS(state, tasks) {
        store.commit('task/UPDATE_ANALISIS', tasks);
    },
    SUCCESS_CREATE_TASK() {
    },
    SUCCESS_FETCH_TASK() {
    },
    SUCCESS_DELETE_TASK() {
    },
    SUCCESS_UPDATE_TASK() {
    },
    CHANGE_TASK_TITLE(state,args) {
        Object.assign(args.task, args.title)
    },
    ADD_EXTERNAL_VALUE(state, args) {
        if (!args.task.externalValue)
            Object.assign(args.task, { externalValue: null })

        if (args.task.externalValue == args.inputId) return;
        args.task.externalValue = args.inputId;

        store.dispatch('taskbox/UPDATE_TASK', args.task)
            .then(() => {
                NodeView.process();
            })
            .catch((error) => console.log(error))
    },
    REMOVE_EXTERNAL_VALUE(state, args) {
        if (!args.task.externalValue) return;

        args.task.externalValue = null;
        store.dispatch('taskbox/UPDATE_TASK', args.task)
            .then(() => {
                NodeView.process();
            })
            .catch((error) => console.log(error))
    },
    async AUDIT(state, args) {

        if (args.task.auditors && args.task.auditors[args.auditor]) return;

        if (!args.task.auditors) Object.assign(args.task, { auditors: {} });

        let newAudition = Object.assign({}, _.cloneDeep(auditionModel));
        newAudition.createdAt = new Date().toISOString();

        args.task.auditors[args.auditor] = newAudition;

        store.dispatch('taskbox/UPDATE_TASK', args.task)
            .then(() => { })
            .catch((error) => console.log(error))

    },

    async SET_AUDITION_STATUS(state, args) {

        if (!args.task.auditors) {
            Object.assign(args.task, { auditors: {} });

            let newAudition = Object.assign({}, _.cloneDeep(auditionModel));
            newAudition.createdAt = new Date().toISOString();

            args.task.auditors[args.auditor] = newAudition;
        }

        args.task.auditors[args.auditor].status = args.status;

        switch (args.status) {
            case auditionstatus.APROOVED.value:
                if (!isTaskDone(args.task))
                    store.commit('task/SET_TASK_DONE', args.task)
                break;
            case auditionstatus.REVIEWING.value:
                if (!isTaskReviewing(args.task))
                    store.commit('task/REVIEW_TASK', args.task)
                break;
            case auditionstatus.REPROVED.value:
                if (!isTaskCanceled(args.task))
                    store.commit('task/CANCEL_TASK', args.task)
                break;
            default:
                store.dispatch('taskbox/UPDATE_TASK', args.task)
                    .then(() => { })
                    .catch((error) => console.log(error))
                break;
        }


    },
    async UPDATE_AUDITION_PROGRESS(state, args) {


        let task = null;
        if (typeof (args.task) == 'string') {
            await store.dispatch('task/FIND_TASK', args.task).then(response => {
                task = _.cloneDeep(response);
            })
        }
        else {
            if (typeof (args.task) == 'object')
                task = _.cloneDeep(args.task);
        }

        if (!task) return;

        let inputCount = 0;
        let canceled = 0
        let completed = 0;

        inputCount = args.inputs.length;
        args.inputs.map(id => {
            if (task.value &&
                task.value.auditions &&
                task.value.auditions[id]) {
                if (task.value.auditions[id].status == auditionstatus.APROOVED.value)
                    completed++;
                else {
                    if (task.value.auditions[id].status == auditionstatus.REPROVED.value)
                        canceled++;
                }
            }
        })

        let auditionProgress = args.inputs.length ? Math.round((completed / (inputCount - canceled)) * 100) : 0;

        if (task.progress !== auditionProgress) {

            task.progress = auditionProgress;
            let changetime = new Date().toISOString();
            task.due.progressChanges.push({ progress: task.progress, time: changetime });
            args.save = true;
        }


        if (task.progress >= 0 && task.progress < 100 && (!isTaskStarted(task) || isTaskDone(task)))
            return store.commit('task/WORK_ON_TASK', task);
        else {
            if (task.progress == 100 && !isTaskDone(task))
                return store.commit('task/SET_TASK_DONE', task);
            else {
                if (args.save)
                    store.dispatch('taskbox/UPDATE_TASK', task)
                        .then(() => {
                        })
                        .catch((error) => console.log(error))
            }
        }

        eventBus.$emit('updateTaskItem', task.id);

    },
    async ADD_COMMENT(state, args) {
        if (!args.task.comments)
            Object.assign(args.task, { comments: [] })
        args.task.comments.push(args.message);

        store.dispatch('taskbox/UPDATE_TASK', args.task)
            .then(() => { })
            .catch((error) => console.log(error))
    },
    async REMOVE_COMMENT(state, args) {
        if (!args.task.comments) return;
        args.task.comments.splice(args.index, 1);

        store.dispatch('taskbox/UPDATE_TASK', args.task)
            .then(() => { })
            .catch((error) => console.log(error))
    },
    async SET_OPEN(state, task) {

        task.status = taskstate.OPEN.value;
        task.workers = [];

        store.dispatch('taskbox/UPDATE_TASK', task)
        .then(() => {
            
        })
            .catch((error) => console.log(error))

    },
    async SET_WORKERS(state, args) {

        // if (args.workers.length == 0)
        //     return store.commit('task/SET_OPEN', args.task)

        args.task.workers = args.workers.map(id => {
            return {
                profile: id,
                credentials: [CREDENTIALS.WORKER.value],
                addedAt: new Date().toISOString()
            }
        });

        if (isTaskOpen(args.task))
            return store.commit('task/WORK_ON_TASK', args.task)
        else
            store.dispatch('taskbox/UPDATE_TASK', args.task)
                .then(() => { })
                .catch((error) => console.log(error))

    },
    async UPDATE_TASK_PROGRESS(state, task) {

        let changetime = new Date().toISOString();
        if (!task.due.progressChanges)
            Object.assign(task.due, { progressChanges: [] });

        task.due.progressChanges.push({ progress: task.progress, time: changetime });

        store.dispatch('taskbox/UPDATE_TASK', task)
            .then(() => {
                
            })
            .catch((error) => console.log(error))

    },
    async ADD_EXTRA_TIME(state, request) {

        let changetime = new Date().toISOString();

        if (!request.task.due.timeExtensions)
            Object.assign(request.task.due, { timeExtensions: [] })
        request.task.due.timeExtensions.push({ time: request.time, in: changetime });

        request.task.due.plannedToEndAt = moment(request.task.due.plannedToEndAt || moment.now()).add(request.time.value, request.time.text).toISOString();
        store.dispatch('taskbox/UPDATE_TASK', request.task)
            .then(() => {
            })
            .catch((error) => console.log(error))
    },
    async RESET_TASK(state, task) {
        let now = new Date().toISOString();

        let progresses = task.due.progressChanges;
        progresses.push({ progress: 0, time: now })

        Object.assign(task.due, {
            startedAt: null,
            pauses: [],
            progressChanges: progresses,
            reviewRequestAt: [],
            submitReviewAt: [],
            plannedToStartAt: null,
            plannedToEndAt: null,
            timeExtensions: [],
            canceledAt: [],
            completedAt: null
        })



        task.progress = 0;
        task.status = taskstate.UNSTARTED.value;

        store.dispatch('taskbox/UPDATE_TASK', task)
        .then(() => {
            
        })
            .catch((error) => console.log(error))
    },
    async START_TASK(state, task) {

        Object.assign(task.due, { completedAt: null });
        Object.assign(task.due, { startedAt: new Date().toISOString() });

        task.status = taskstate.STARTED.value;
        task.progress = 0;

        store.dispatch('taskbox/UPDATE_TASK', task)
        .then(() => {
            
        })
            .catch((error) => console.log(error))

    },
    async WORK_ON_TASK(state, task) {

        const now = new Date().toISOString();

        if (!task.due.startedAt)
            task.due.startedAt = now;

        task.due.completedAt = null;
        task.status = taskstate.STARTED.value;

        store.dispatch('taskbox/UPDATE_TASK', task)
        .then(() => {
            
        })
            .catch((error) => console.log(error))
    },
    async PAUSE_TASK(state, task) {
        let now = new Date().toISOString();
        task.due.completedAt = null;
        task.due.pauses.push(now);
        task.status = taskstate.PAUSED.value;

        store.dispatch('taskbox/UPDATE_TASK', task)
        .then(() => {
            
        })
            .catch((error) => console.log(error))
    },
    async REVIEW_TASK(state, task) {

        if (isTaskReviewing(task)) return;

        task.status = taskstate.REVIEWING.value;

        store.dispatch('taskbox/UPDATE_TASK', task)
        .then(() => {
            
        })
            .catch((error) => console.log(error))

    },
    async CANCEL_TASK(state, task) {

        let now = new Date().toISOString();

        task.due.canceledAt.push(now);
        task.status = taskstate.REPROVED.value;

        store.dispatch('taskbox/UPDATE_TASK', task)
        .then(() => {
            
        })
            .catch((error) => console.log(error))

    },
    async SET_TASK_DONE(state, task) {
        let now = new Date().toISOString();

        task.due.completedAt = now;

        if (!task.due.startedAt)
            task.due.startedAt = now;

        task.progress = 100;
        task.status = taskstate.DONE.value;

        store.dispatch('taskbox/UPDATE_TASK', task)
        .then(() => {
            
            store.dispatch('notification/NOTIFY_TASK_DONE', task);
        })
            .catch((error) => console.log(error));

        // if (store.state.taskbox.currentTaskBox) {

        //     let node = store.getters['taskbox/currentTaskBox'].data.nodes[task.id];
        //     if (node && node.outputs.flowingData)
        //         node.outputs.flowingData.connections.forEach(async conn => {
        //             let child = store.state.taskbox.root.tasks[conn.node];
        //             if (child && !isTaskStarted(child))
        //                 store.commit('task/START_TASK', child);
        //             else
        //                 taskRepository.find(conn.node).then((result) => {
        //                     if (result && !isTaskStarted(result))
        //                         store.commit('task/START_TASK', result);

        //                 })
        //         });
        // }

    },
    async SET_DUE_PLANNED_START(state, request) {
        request.task.due.plannedToStartAt = request.date;

        store.dispatch('taskbox/UPDATE_TASK', request.task)
            .then(() => { })
            .catch((error) => console.log(error))
    },
    async SET_DUE_PLANNED_END(state, request) {
        request.task.due.plannedToEndAt = request.date;

        store.dispatch('taskbox/UPDATE_TASK', request.task)
            .then(() => { })
            .catch((error) => console.log(error))
    },
    async SUBMIT_TASK_REVIEW(state, task) {
        task.due.submitReviewAt.push(new Date().toISOString());

        store.dispatch('taskbox/UPDATE_TASK', task)
            .then(() => { })
            .catch((error) => console.log(error))

    },

    // async SET_TASKBOX_DONE(state, entity) {

    //     store.dispatch('task/FIND_TASK', taskbox.id).then((task) => {
    //         if (!task) return;
    //         store.dispatch('task/SET_TASK_DONE', task).then(() => {

    //             Object.values(taskbox.data.nodes).forEach((node) => {

    //                 store.dispatch('task/FIND_TASK', node.id).then(async (task) => {
    //                     if (node.name == "TaskBox") {
    //                         await store.dispatch('task/SET_TASKBOX_DONE', node);
    //                     }
    //                     else {
    //                         if (isTaskable(task) && !isTaskCanceled(task)) {
    //                             if (!isTaskDone(task))
    //                                 await store.dispatch('task/SET_TASK_DONE', task);
    //                         }
    //                     }
    //                 })
    //             })
    //         })
    //     })
    // },

}

export default {
    namespaced: true,
    state,
    actions,
    getters,
    mutations
}


