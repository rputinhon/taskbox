/* eslint-disable */

import  { getStatusTypeByValue } from '../../../enums/taskstate';
import { relationalDb } from '../../config/pouchdb'
import { Repository } from '../../db/AbstractDBRepository'
import { taskboxRepository } from '../taskbox/taskboxRepository';
import { isTaskCanceled, isTaskPaused } from './task';
import _ from 'lodash';
import store from '../..';
import { taskModel } from '../../models/TaskModel';
import CREDENTIALS from '../../../enums/credentials';

class TaskRepository extends Repository {
    constructor() {
        super('task', relationalDb)
        relationalDb.createIndex({
            index: { fields: ['_id', 'data.id', 'data.type', 'data.taskType', 'data.title', 'data.workers', 'data.workers', 'data.createdBy'] },
        })
    }

    async search(criteria) {
        let response = await super.search(criteria);
        return response;
    }


    async get(id) {
        let obj = {};
        let result = await this.db.rel.find('task', id);
        return obj[id] = result.tasks[0];
    }

    async create(request) {

        return new Promise((resolve, reject) => {

            const currentUser = store.state.user;

            let task = Object.assign({}, _.cloneDeep(taskModel));
            task.taskType = request.type;

            if (request.title)
                task.title = request.title;
            if (request.subject)
                task.subject = request.subject;
            if (request.description)
                task.fullDescription = request.description;

            if (request.value)
                task.value = request.value;

            task.workers.push({ profile: currentUser.user.metadata.profileId, credentials: [CREDENTIALS.MASTER.value] });

            task.taskbox = store.getters['taskbox/currentTaskBoxId'];
            task.root = store.getters['taskbox/currentRootId'];

            if (request.id)
                task.id = request.id;


            taskRepository.save(task)
                .then(createdTask => {
                    resolve(createdTask);
                })
                .catch((error) => reject(console.log(error)));

        })

    }

    async saveList(list) {

        list.forEach(task => {
            new Promise((resolve, reject) => {
                taskRepository.saveOrUpdate(task).then(() => {
                    resolve();
                })
                    .catch((error) => {
                        console.error(error);
                        reject(error)
                    })
            })

        });
    }

    async getField(id, field) {
        let result = await super.find(id);
        return result && result[field] || undefined;
    }

    async getReviews(id) {
        let result = await super.find(id);
        return result && result.due && result.due.reviews ? result.due.reviews : [];
    }

    async getList(list, fields) {

        const selector = {
            $and: [
                {
                    '_id': { $in: list.map(id => { return 'task_2_' + id }) }
                }
            ],
        }

        return this.db.find({
            selector: selector,
            fields: fields,
        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('tasks', result.docs);

            let tasks = {};
            relDocs.tasks.forEach((task) => {
                tasks[task.id] = task
            });
            return tasks;

        });

    }

    async getUserRoots(profileId) {
        return this.db.find({
            selector: {
                $and: [
                    {
                        'data.taskType': 'taskbox'
                    },
                    {
                        'data.createdBy': { $in: [profileId, 'offline'] }
                    },
                    {
                        'data.root': { $eq: null }
                    },
                ],

            },
            fields: ['_id', 'data.root', 'data.id', 'data.createdBy', 'data'].filter((x) => x !== undefined),

        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('task', result.docs)
            return relDocs.tasks || [];
        })
    }



    async getUserAuditions(userId) {

        const selector = {
            $and: [
                {
                    'data.type': 'task',
                },
                {
                    'data.taskType': 'audition'
                },
                {
                    'data.workers': {
                        $elemMatch: {
                            'profile': userId
                        }
                    },
                },
            ]
        }

        return this.db.find({
            selector: selector,

        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('task', result.docs)

            let auditions=[];
            relDocs.tasks.forEach(async task => {
                let inputs = await taskboxRepository.getInputTasks()
                auditions.push({
                    task:task,
                    inputs:inputs
                })
            });
            return auditions;
        })
    }

    async getUserTasks(request) {
        const selector = {
            $and: [
                {
                    'data.type': 'task',
                    $or: [
                        {
                            'data.taskType': { $ne: 'taskbox' }
                        },
                        {
                            'data.taskType': 'taskbox',
                            'data.root': { $ne: null }
                        },

                    ]
                },
                {
                    $or: [
                        {
                            'data.workers': {
                                $elemMatch: {
                                    'profile': request.member
                                }
                            },
                        },
                        // {
                        //     $and: [
                        //         {
                        //             'data.createdBy': request.member,
                        //         },
                        //         {
                        //             'data.status': taskstate.OPEN.value,
                        //         },
                        //     ]
                        // }

                    ]
                }
            ]

        }

        return this.db.find({
            selector: selector,

        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('task', result.docs)
            let roots = await this.getUserRoots(request.member);
            let taskboxes = relDocs.taskboxes || []
            
            const taskboxesTasks = await this.db.rel.find('task', taskboxes.map(t => t.id));

            return {
                roots: roots,
                tasks: relDocs.tasks,
                taskboxes: taskboxesTasks.tasks
            }
        })


    }


    async checkIfAnyParentDisabled(task) {

        if (!task) return { value: false };

        let project = await taskboxRepository.find(task.projectId);

        if (!project)
            return { value: false };

        let root = project.root;
        let current = await this.db.rel.find('task', task.taskbox);

        if (!current)
            return { value: false };

        while (current.taskbox !== root) {
            let disabled = isTaskCanceled(current) ||
                isTaskPaused(current) ? true : false;
            if (disabled)
                return { value: true, status: getStatusTypeByValue(current.status) };
            current = await this.db.rel.find('task', task.taskbox);
        }

        return { value: false };

    }

    async deleteTasks(list) {
        let response = await this.db.rel.find('task', list);
        super.deleteMany(response.tasks);
        console.log(list);
    }

    async deleteAll(root) {
        this.db.rel.find('task', root).then((response) => {
            super.delete(response.tasks[0]);
        })
        this.db.rel.findHasMany('task', 'root', root).then((response) => {
            if (response.tasks.length > 0)
                super.deleteMany(response.tasks);
        })
    }
    async getRev(id) {
        return this.find(id).then((response) => {
            return response.rev;
        })
    }


    async createIndex() {
        return this.db.createIndex({
            index: { fields: ['index'] },
        })
    }
}

export const taskRepository = new TaskRepository();
