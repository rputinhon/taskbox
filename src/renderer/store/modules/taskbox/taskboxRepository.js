import store from '../..'
import { relationalDb } from '../../config/pouchdb'
import { Repository } from '../../db/AbstractDBRepository'
import { taskRepository } from '../task/taskRepository'
import _ from 'lodash'
import { taskBoxInfo } from '../../models/TaskBoxInfo'
import { taskBoxModel } from '../../models/TaskBoxModel'
import CREDENTIALS from '../../../enums/credentials'
import taskstate from '../../../enums/taskstate'
import { isTaskCanceled, isTaskDone, isTaskPaused, isTaskStarted, isTaskWorking } from '../task/task'
import { NodeView } from '../../../libs/nodeview'
import { taskModel } from '../../models/TaskModel'
import { arrayToKeyValue } from '../../../libs/utils'
import { deletingstatus } from '../../../enums/deletingstatus'

class TaskboxRepository extends Repository {
    constructor() {
        super('taskbox', relationalDb)
        relationalDb.createIndex({
            index: { fields: ['_id', 'data.type', 'data.root', 'data.title', 'data.workers', 'data.createdBy', 'data.status'] },
        })
    }


    async save(entity) {
        let result = super.save(entity)
        return result
    }

    async openRoot(id) {
        let rootTask = await taskRepository.find(id);
        let rootTaskBox = await super.find(id);
        return this.db.rel.findHasMany('task', 'root', id).then((response) => {

            let taskSearch = response.tasks || [];
            let taskboxSearch = response.taskboxes || [];

            if (!taskboxSearch.find(t => t.id == id) && rootTaskBox)
                taskboxSearch.push(rootTaskBox);

            let taskboxes = arrayToKeyValue(taskboxSearch);
            let tasks = arrayToKeyValue(taskSearch);
            return { task: rootTask, taskboxes: taskboxes, tasks: tasks };
        })
    }

    async openTaskbox(id) {
        return this.db.rel.findHasMany('task', 'taskbox', id).then(async (response) => {
            let taskbox = response.taskboxes[0];
            let nodeList = Object.keys(taskbox.data.nodes);
            let tasks = arrayToKeyValue(response.tasks.filter(t => nodeList.includes(t.id)));
            return { taskbox: taskbox, tasks: tasks, inputs: [] }
        })

    }

    async getTaskBoxInputs(id) {
        return new Promise((resolve, reject) => {
            taskRepository.find(id).then((task) => {
                super.find(task.taskbox).then(parent => {
                    let inputList = parent.data.nodes[id] ? parent.data.nodes[id].inputs.in.connections.map(c => c.node) : [];
                    taskRepository.getList(inputList, ['_id', 'data.title', 'data.progress', 'data.status', 'data.taskType', 'data.value']).then((inputs) => {
                        resolve(inputs || [])
                    })
                        .catch((error) => {
                            console.error(error);
                            reject(error)
                        })
                })
            })
                .catch((error) => {
                    console.error(error);
                    reject(error)
                })
        })
    }

    async create(request) {

        return new Promise((resolve, reject) => {

            // const currentUser = store.state.user;

            let taskbox = Object.assign({}, _.cloneDeep(taskBoxModel));

            let task = Object.assign({}, _.cloneDeep(taskModel));
            task.taskType = request.type;

            if (request.title)
                task.title = request.title;
            if (request.subject)
                task.subject = request.subject;
            if (request.description)
                task.fullDescription = request.description;

            // task.workers.push({ profile: currentUser.user.metadata.profileId, credentials: [CREDENTIALS.MASTER.value] });


            task.taskbox = store.getters['taskbox/currentTaskBoxId'];
            task.root = store.getters['taskbox/currentRootId'];


            if (request.node) {
                Object.assign(taskbox, request.node);
                Object.assign(taskbox.data, _.cloneDeep(taskBoxModel).data);
                taskbox.id = request.node.id
                task.id = request.node.id;
            }
            else {
                taskbox.id = this.db.rel.uuid();
                task.id = taskbox.id;
            }

            taskboxRepository.save(taskbox).then((createdTaskBox) => {
                taskRepository.save(task).then(createdTask => {
                    resolve({ taskbox: createdTaskBox, task: createdTask, tasks: {} });
                })
                    .catch((error) => reject(console.log(error)));
            })

        })

    }

    async saveChildren(children) {
        let tasks = _.cloneDeep(children.filter(child => child.type == 'task'));
        tasks.forEach(task => {
            taskRepository.find(task.id).then((res) => {
                if (res)
                    task.rev = res.rev;
            })
        });
        taskRepository.saveMany(tasks).then(() => {
            return true;
        }).catch((error) => {
            console.error(error);
            return false;
        })

        let taskboxes = _.cloneDeep(children.filter(child => child.type == 'taskbox'));
        taskboxes.forEach(taskbox => {
            super.find(taskbox.id).then((res) => {
                if (res)
                    taskbox.rev = res.rev;
            })
        });
        new Promise((resolve) => {
            super.saveMany(taskboxes)
                .then(() => {
                    resolve();
                }).catch((error) => {
                    console.error(error);
                })
        })

    }

    async deleteTaskBox(id) {

        let root = await this.db.rel.find('task', id);
        const search = await this.getChildrenRecursive(id, {});
        let tasks = Object.values(search.children);
        tasks.push(root.tasks[0]);
        let taskboxesIds = Object.values(search.children).filter(t => t.taskType == 'taskbox').map(t => t.id);
        taskboxesIds.push(id)
        console.log(tasks);
        // delete all tasks
        await taskRepository.deleteMany(tasks);

        // delete all taskboxes
        const taskboxsearch = await this.db.rel.find('taskbox', taskboxesIds);
        await super.deleteMany(taskboxsearch.taskboxes);

    }

    async deleteRoot(root) {
        return new Promise((resolve, reject) => {
            this.db.rel.findHasMany('task', 'root', root).then(async (response) => {
                let rootTaskBox = await taskboxRepository.find(root);
                let rootTask = await taskRepository.find(root);
                response.tasks.push(rootTask);


                let taskboxes = response.taskboxes || [];

                if (rootTaskBox !== undefined)
                    taskboxes.push(rootTaskBox);

                let tasks = response.tasks || [];

                if (rootTask !== undefined)
                    tasks.push(rootTask);

                if (taskboxes.length)
                    await taskboxRepository.deleteMany(taskboxes.filter(t => t !== undefined))
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((error) => reject(console.log(error)));

                if (tasks.length)
                    await taskRepository.deleteMany(tasks.filter(t => t !== undefined))
                        .then((res) => {
                            console.log(res);
                        })
                        .catch((error) => reject(console.log(error)));

                resolve();
            })
        })
    }

    async isPaused(id) {
        return taskRepository.getField(id, 'status').then(status => {
            return isTaskPaused(status);
        })
    }
    async isAnyParentPaused(id) {
        let response = await this.getChildrenRecursive(id, {}, id, null, true);

        console.log(response);

    }

    async getTaskBoxInfo(list) {

        let info = _.cloneDeep(taskBoxInfo);
        if (!list) return info;

        let startedCount = list.filter(t => t.status == taskstate.STARTED.value).length;

        let donecount = list.filter(t => t.status == taskstate.DONE.value).length;

        let progress = 0;
        list.map(t => {
            if (!isTaskCanceled(t))
                progress += t.progress || 0;
        });


        let members = [];
        list.filter(t => t.workers && t.workers.length > 0).map((t) => { t.workers.map(m => { if (!members.includes(m.profile)) members.push(m.profile) }) });

        info.Total.value = list.length;
        info.Boxes.value = list.filter(t => t.taskType == 'taskbox').length;
        info.Unstarted.value = list.filter(t => t.status == taskstate.UNSTARTED.value).length;
        info.Started.value = startedCount;
        info.Reviewing.value = list.filter(t => t.status == taskstate.REVIEWING.value).length;
        info.Paused.value = list.filter(t => t.status == taskstate.PAUSED.value).length;
        info.Done.value = donecount;
        info.Canceled.value = list.filter(t => t.status == taskstate.REPROVED.value).length;
        info.Members.value = members.length;
        // info.Open.value = list.filter(t => t.status == taskstate.OPEN.value).length;
        // info.Open.value = list.filter(t => t.workers.length == 0).length;

        let calculedProgress = Math.round(progress / (info.Total.value - info.Canceled.value));
        let incompletecount = list.length - donecount - info.Canceled.value;
        info.Incomplete.value = incompletecount



        info.Progress = calculedProgress;
        return info;

    }

    async getChildrenTasks(id) {
        const searchTB = await this.find(id);
        if (!searchTB) return [];
        let idList = Object.values(searchTB.data.nodes).map(n => n.id);
        let children = await this.db.rel.find('task', idList);
        return children.tasks;
    }

    async getTaskBoxWithChildren(parentId, types, fields, onlyTaskBoxes) {
        //parent taskbox
        const parent = await this.find(parentId);

        let current = await this.db.find({
            selector: {
                $and: [
                    {
                        '_id': 'task_2_' + parentId
                    },
                ],

            },
            fields: fields ? fields.filter((x) => x !== undefined) : undefined,

        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('task', result.docs)
            return relDocs.tasks[0];
        })

        Object.assign(current, { children: [] });
        if (!parent) return current;

        let idList = Object.values(parent.data.nodes).filter(e => types && types.length && types.includes(e.name.toLowerCase()) || e).map(n => n.id);
        return this.db.find({
            selector: {
                $and: [
                    {
                        '_id': { $in: idList.map(id => { return 'task_2_' + id }) }
                    },
                    {
                        'data.taskType': onlyTaskBoxes ? 'taskbox' : { $gt: null }
                    }
                ],

            },
            fields: fields ? fields.filter((x) => x !== undefined) : undefined,

        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('task', result.docs)
            current.children = relDocs.tasks || [];
            return current;
        })

    }

    async getBreadCrumb(root, current) {

        let taskboxes = store.state.taskbox.root.taskboxes;
        let tasks = store.state.taskbox.root.tasks;

        let breadData = [];

        if(!current) return breadData;

        let last = {
            id: current.id,
            root: current.root,
            taskbox: current.taskbox,
            title: current.title,
            status: current.status,
            progress: current.progress,
            due: current.due,
            children: []
        }

        last.children = Object.values(tasks).filter(t => taskboxes[last.id] && Object.values(taskboxes[last.id].data.nodes).filter(t => t.name == 'TaskBox').map(t => t.id).includes(t.id)).map(r => {
            return {
                id: r.id,
                root: r.root,
                taskbox: r.taskbox,
                title: r.title,
                status: r.status,
                progress: r.progress,
                due: r.due,
            }
        })

        breadData.push(last);

        // while current is not start (root).
        while (last.id !== root.id) {
            // get parent
            let task = last.taskbox !== root.id ? tasks[last.taskbox] : root;
            if (!task)
                return;

            let item = {
                id: task.id,
                root: task.root,
                taskbox: task.taskbox,
                title: task.title,
                status: task.status,
                progress: task.progress,
                due: task.due,
                children: []
            }

            //get children 
            item.children = Object.values(tasks).filter(t => Object.values(taskboxes[item.id].data.nodes).filter(t => t.name == 'TaskBox').map(t => t.id).includes(t.id)).map(r => {
                return {
                    id: r.id,
                    root: r.root,
                    taskbox: r.taskbox,
                    title: r.title,
                    status: r.status,
                    progress: r.progress,
                    due: r.due,
                }
            })

            last = item;
            breadData.push(last);
        }

        breadData.reverse();
        return breadData;
    }

    async getChildrenRecursive(id, children, root, fields, onlyTaskBoxes) {

        let current = await this.getTaskBoxWithChildren(id, [], fields, onlyTaskBoxes);

        if (children)
            current.children.forEach(async item => {
                children[item.id] = item;
            })

        await Promise.all(
            current.children.filter(c => c.taskType == 'taskbox').map(async (item) => {
                await this.getChildrenRecursive(item.id, children, root, fields, onlyTaskBoxes);
            })
        )
        return { root: current, children: children };
    }

    async getPath(rootId, current) {
        let pathArr = [];
        if (!current) return null;

        // current with children
        pathArr.push(current.title);
        // while cuurent is not start (root).
        while (current.id !== rootId) {
            // get parent with children 
            let response = await taskRepository.find(current.taskbox);

            if (!response)
                return;

            current = {
                id: response.id,
                title: response.title
            }

            pathArr.push(current.title);
        }

        pathArr.reverse();
        let path = '';

        pathArr.forEach(p => {
            path += p + '/';

        });

        return path;
    }

    async getDeletingTaskBox(id, tree) {

        tree[id] = {id:id, status: deletingstatus.WAITING, children: {} };
        let children = await this.getChildrenTasks(id)

        if (children.length)
            children.forEach(async task => {
                if (task.taskType !== 'taskbox')
                    tree[id].children[task.id] = {id:task.id, status: deletingstatus.WAITING };
                else
                    tree[id].children[task.id] = {id:task.id, status: deletingstatus.WAITING, children: await this.getDeletingTaskBox(task.id, {}) };

            });

        return tree
    }

    async getDeletingTree(nodes) {

        let tree = {children:{}};

        nodes.map(async n => {

            if (n.name !== 'TaskBox'){
                tree.children[n.id] = {id:n.id, status: deletingstatus.WAITING }
            }
            else{
                await this.getDeletingTaskBox(n.id, tree.children)

            }

        })

        return tree;
    }

    async packTaskBox(id) {


        let response = await this.getChildrenRecursive(id, {}, id, ['_id', 'data.id', 'data.taskType', 'data.taskbox', 'data.title', 'data.value']);
        let taskboxes = Object.values(response.children).filter(t => t.taskType == 'taskbox');
        taskboxes.push(response.root);

        let paths = {};

        await Promise.all(
            taskboxes.map(async tb => {
                let path = await this.getPath(id, tb);
                paths[tb.id] = path;
            })
        )

        return { root: response.root, children: response.children, paths: paths };
    }


    async moveTasksTo(from, to, list, root) {

        let search = await this.db.rel.find('taskbox', [from, to]);

        let fromTaskBox = search.taskboxes.find(tb => tb.id == from);
        let toTaskBox = search.taskboxes.find(tb => tb.id == to);

        if (!fromTaskBox || !toTaskBox) return;

        return new Promise((resolve) => {

            list.forEach(id => {
                toTaskBox.data.nodes[id] = fromTaskBox.data.nodes[id]
                delete fromTaskBox.data.nodes[id];
            });

            let tasks = store.state.taskbox.root.tasks;

            super.saveOrUpdate(fromTaskBox).then(() => {
                super.saveOrUpdate(toTaskBox).then(() => {
                    list.map(async id => {

                        let task = _.cloneDeep(tasks[id]);

                        if (!task) return;
                        task.taskbox = to;

                        if (root)
                            task.root = root;

                        await taskRepository.saveOrUpdate(task)
                    });
                    resolve({ from: fromTaskBox, to: toTaskBox });
                })
            })
        });

    }


    async getInputTasks(task, onlyIds) {
        if (!task) return;
        return new Promise(res => {
            this.find(task.taskbox).then((taskbox) => {
                if (!taskbox || !taskbox.data.nodes[task.id])
                    return res([]);
                let idList = taskbox.data.nodes[task.id].inputs.in.connections.map(c => c.node);
                if (onlyIds)
                    res(idList)
                this.db.rel.find('task', idList).then(response => {
                    res(response.tasks);

                })
            })

        })
    }

    async getIOTasks(task) {
        return new Promise(res => {
            this.find(task.taskbox).then((taskbox) => {

                if (!taskbox)
                    res([]);

                let externalInputs = task.externalValue || [];
                let inputIdList = taskbox.data.nodes[task.id].inputs.in.connections.map(c => c.node);
                let outputIdList = taskbox.data.nodes[task.id].outputs.flowingData.connections.map(c => c.node)
                let inputs = [];
                let outputs = [];
                this.db.rel.find('task', inputIdList.concat(externalInputs)).then(inp => {
                    inputs = inp.tasks;
                    this.db.rel.find('task', outputIdList).then(outp => {
                        outputs = outp.tasks;
                        res({
                            inputs: inputs || [],
                            outputs: outputs || []
                        });
                    })
                })
            })

        })
    }


    async createTask(child, type, root, taskbox) {
        if (type == 'task') {
            taskRepository.createFromNode({ node: child.node, root: root, taskbox: taskbox }).then(() => {
            })

        } else {

            let children = {};

            Object.entries(child.children).map(c => {
                let type = c[0].split('_')[1];
                NodeView.changeNodeID(c[1].node, this.db.rel.uuid()).then((node) => {
                    children[node.id] = type;
                })
            })

            this.createFromNode({ node: child.node, children: children, root: root, taskbox: taskbox }).then((response) => {
                Object.entries(child.children).map((child) => {
                    let type = child[0].split('_')[1];
                    NodeView.changeNodeID(child[1].node, this.db.rel.uuid()).then(() => {
                        // Object.assign(child[1].node, node);
                        this.createTask(child[1], type, root, response.id);
                    })
                })
            })

        }
    }

    taskCount(id) {
        return new Promise(res => {
            super.find(id).then(response => {
                res(response ? Object.keys(response.data.nodes).length : 0);
            })

        })
    }

    reNewNodeIds(list) {
        let newList = {};
        let changes = {};

        let toChange = typeof list == 'object' ? Object.values(list) : list;

        // change ids
        toChange.map(node => {

            let oldId = node.id;
            let newId = this.db.rel.uuid()
            changes[oldId] = newId;

            node.id = newId;
            Object.values(list).map(item => {
                item.inputs.in.connections.map(conn => {
                    if (conn.node == oldId)
                        conn.node = newId
                })
                item.outputs.flowingData.connections.map(conn => {
                    if (conn.node == oldId)
                        conn.node = newId
                })
            })

            newList[newId] = node;

        })

        return { nodes: newList, changes: changes };
    }

    async saveList(list) {

        list.forEach(taskbox => {
            new Promise((resolve, reject) => {
                taskboxRepository.saveOrUpdate(taskbox).then(() => {
                    resolve();
                })
                    .catch((error) => {
                        console.error(error);
                        reject(error)
                    })
            })

        });
    }

    async buildTemplate(template, node) {

        // user to add as worker
        const currentUser = store.state.user;

        // value to return
        let templateTask = null;

        // to keep track of id changes;
        let taskboxIdChanges = {};
        let taskIdChanges = {};

        // root
        taskboxIdChanges[template.data.root.taskbox.id] = node.id;
        template.data.root.taskbox.id = node.id;
        template.data.root.taskbox.position = node.position;

        let response = this.reNewNodeIds(template.data.root.taskbox.data.nodes);
        template.data.root.taskbox.data.nodes = response.nodes;
        Object.assign(taskIdChanges, response.changes);

        delete template.data.root.taskbox.rev;

        await taskboxRepository.save(template.data.root.taskbox).then(async () => {

            taskIdChanges[template.data.root.task.id] = node.id;
            template.data.root.task.id = node.id;
            template.data.root.task.root = store.getters['taskbox/currentRootId'];
            template.data.root.task.taskbox = store.getters['taskbox/currentTaskBoxId'];
            template.data.root.task.title = template.name;
            template.data.root.task.fullDescription = template.description;

            if (template.data.root.task.externalValue && template.data.root.task.externalValue.length) {
                template.data.root.task.externalValue.map(id => {
                    if (taskIdChanges[id])
                        template.data.root.task.externalValue[template.data.root.task.externalValue.indexOf(id)] = taskIdChanges[id];
                });
            }

            if (template.data.root.task.value && template.data.root.task.value.auditions)
                template.data.root.task.value.auditions = {};

            delete template.data.root.task.rev;

            //reset task
            template.data.root.task.status = 0;
            template.data.root.task.progress = 0;
            template.data.root.task.due = _.cloneDeep(taskModel).due;
            template.data.root.task.workers = [];
            template.data.root.task.workers.push({ profile: currentUser.user.metadata.profileId, credentials: [CREDENTIALS.MASTER.value] });

            await taskRepository.save(template.data.root.task).then(createdTask => {
                templateTask = createdTask;
            })
                .catch((error) => console.log(error));
        }).catch((error) => console.log(error));

        //children

        // renew taskbox ids and children nodes.
        template.data.children.taskboxes.map(async taskbox => {

            delete taskbox.rev;

            let response = this.reNewNodeIds(taskbox.data.nodes);
            taskbox.data.nodes = response.nodes;
            Object.assign(taskIdChanges, response.changes);

            let newId = taskIdChanges[taskbox.id] || this.db.rel.uuid();

            taskboxIdChanges[taskbox.id] = newId;
            taskbox.id = newId;

        });

        await this.saveList(template.data.children.taskboxes);

        // renew tasks ids
        template.data.children.tasks.map(task => {

            delete task.rev;
            task.root = store.getters['taskbox/currentRootId'];

            if (taskboxIdChanges[task.taskbox])
                task.taskbox = taskboxIdChanges[task.taskbox];

            task.id = task.taskType == 'taskbox' ? taskboxIdChanges[task.id] : taskIdChanges[task.id];

            if (task.externalValue && task.externalValue.length) {
                task.externalValue.map(id => {
                    if (taskIdChanges[id])
                        task.externalValue[task.externalValue.indexOf(id)] = taskIdChanges[id];
                });
            }

            if (task.value && task.value.auditions)
                task.value.auditions = {};

            //reset task
            task.status = 0;
            task.progress = 0;
            task.due = _.cloneDeep(taskModel).due;
            task.workers = [];
            task.workers.push({ profile: currentUser.user.metadata.profileId, credentials: [CREDENTIALS.MASTER.value] });


        })

        await taskRepository.saveList(template.data.children.tasks);

        template.data.children.taskboxes.push(template.data.root.taskbox);
        template.data.children.tasks.push(templateTask);

        Object.assign(node.data, template.data.root.taskbox.data);

        return { node: node, taskboxes: template.data.children.taskboxes, tasks: template.data.children.tasks };

    }

    getChildren(taskboxId) {

        let list = {
            tasks: [],
            taskboxes: []
        }

        let rootID = store.state.taskbox.root.task.id;

        let TaskBoxList = store.state.taskbox.root.taskboxes;
        let TaskList = store.state.taskbox.root.tasks;
        let excludedParentIds = [];

        let currentTaskBox = TaskBoxList[taskboxId];

        if (TaskList[currentTaskBox.id] && TaskList[currentTaskBox.id].taskbox) {
            while (currentTaskBox.id !== rootID) {
                let next = TaskBoxList[TaskList[currentTaskBox.id].taskbox]
                if (!next) return;
                currentTaskBox = next;
                excludedParentIds.push(next.id);
            }

        }

        list.tasks = Object.values(TaskList).filter(t => !excludedParentIds.includes(t.taskbox) && t.id !== taskboxId);
        list.taskboxes = Object.values(TaskBoxList).filter(t => !excludedParentIds.includes(t.id) && t.id !== taskboxId);

        return list;
    }

    async getChildrenIds(parent) {
        return super.find(parent).then((response) => {
            return response ? Object.keys(response.data.nodes) : [];
        })
    }

    async createTemplate(taskbox) {

        let rootTaskBox = store.state.taskbox.root.taskboxes[taskbox];
        let rootTask = store.state.taskbox.currentTaskBox;

        let children = this.getChildren(taskbox);

        // create the template data object
        let data = {
            root: {
                taskbox: rootTaskBox,
                task: rootTask,
            },
            children: children
        }

        return data;

    }

    async resetTask(id) {
        let response = await this.getChildrenRecursive(id, {}, id, null);
        response.children[response.root.id] = response.root;
        await Promise.all(
            Object.values(response.children).filter(t => isTaskStarted(t)).map(async task => {

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

                let rev = await taskRepository.getRev(task.id);
                Object.assign(task, { rev: rev })

                await taskRepository.saveOrUpdate(task).then((response) => {
                    NodeView.updateNode(task.id);
                    store.commit("taskbox/SUCCESS_UPDATE_TASK", response);
                }).catch((error) => {
                    console.error(error);
                })


                return true

            })
        )
        return true;
    }

    async setTaskDone(id) {
        let response = await this.getChildrenRecursive(id, {}, id, null);
        response.children[response.root.id] = response.root;
        await Promise.all(
            Object.values(response.children).filter(t => !isTaskDone(t)).map(async task => {

                if (isTaskCanceled(task) && task.id !== response.root.id) return;

                let copy = _.cloneDeep(task);
                let now = new Date().toISOString();

                copy.due.completedAt = now;

                if (!copy.due.startedAt)
                    copy.due.startedAt = now;

                copy.progress = 100;
                copy.status = taskstate.DONE.value;

                let rev = await taskRepository.getRev(copy.id);
                Object.assign(copy, { rev: rev })

                await taskRepository.saveOrUpdate(copy).then((response) => {
                    NodeView.updateNode(copy.id);
                    store.commit("taskbox/SUCCESS_UPDATE_TASK", response);
                }).catch((error) => {
                    console.error(error);
                })


                return true

            })
        )
        return true;
    }

    async setTaskPaused(id) {
        let response = await this.getChildrenRecursive(id, {}, id, null, true);
        response.children[response.root.id] = response.root;
        await Promise.all(
            Object.values(response.children).filter(t => !isTaskPaused(t) && !isTaskCanceled(t)).map(async task => {

                let copy = _.cloneDeep(task);
                let now = new Date().toISOString();
                copy.due.completedAt = null;
                copy.due.pauses.push(now);
                copy.status = taskstate.PAUSED.value;

                let rev = await taskRepository.getRev(copy.id);
                Object.assign(copy, { rev: rev })

                await taskRepository.saveOrUpdate(copy).then((response) => {
                    NodeView.updateNode(copy.id);
                    store.commit("taskbox/SUCCESS_UPDATE_TASK", response);
                }).catch((error) => {
                    console.error(error);
                })

                return true

            })
        )
        return true;
    }

    async setTaskWorking(id) {
        let response = await this.getChildrenRecursive(id, {}, id, null, true);
        response.children[response.root.id] = response.root;
        await Promise.all(
            Object.values(response.children).filter(t => !isTaskWorking(t)).map(async task => {

                if (isTaskCanceled(task) && task.id !== response.root.id) return;
                let copy = _.cloneDeep(task);
                let now = new Date().toISOString();
                if (!copy.due.startedAt)
                    copy.due.startedAt = now;

                copy.due.completedAt = null;
                copy.status = taskstate.STARTED.value;


                let rev = await taskRepository.getRev(copy.id);
                Object.assign(copy, { rev: rev })

                await taskRepository.saveOrUpdate(copy).then((response) => {
                    NodeView.updateNode(copy.id);
                    store.commit("taskbox/SUCCESS_UPDATE_TASK", response);
                }).catch((error) => {
                    console.error(error);
                })

                return true

            })
        )
        return true;
    }

    async getTaskCount(id) {
        return super.find(id).then((response) => {
            console.log(response);
            return Object.keys(response.data.nodes).length;
        })
    }

    async getDeletingEntities(list) {
        const response = await this.db.rel.find('task', list);
        return response;
    }

    async createIndex() {
        return this.db.createIndex({
            index: { fields: ['index'] },
        })
    }
}

export const taskboxRepository = new TaskboxRepository();
