import store from '../..';
import { relationalDb } from '../../config/pouchdb'
import { Repository } from '../../db/AbstractDBRepository'
import { shareWith } from '../../models/PostModel';

class PostRepository extends Repository {
    constructor() {
        super('post', relationalDb)
        relationalDb.createIndex({
            index: { fields: ['_id'] },
        })
    }

    async search(searchCriteria, options, archived) {

        const user = store.state.user;
        const memberList = store.state.connection.members.map(m => m.member);
        memberList.push(user.profile.id);

        const defaultCriteria = {
            selector: {
                $or: [
                    {
                        'data.createdBy': user.profile.id
                    },
                    {
                        'data.shareWith': shareWith.PUBLIC.value
                    },
                    {

                        $and: [
                            {
                                'data.shareWith': shareWith.FOLLOWERS.value
                            },
                            {
                                'data.createdBy': { $in: user.profile.following || undefined }
                            }
                        ]

                    },
                    {
                        $and: [
                            {
                                'data.shareWith': shareWith.ME.value
                            },
                            {
                                'data.createdBy': user.profile.id
                            }
                        ]

                    },
                    {
                        $and: [
                            {
                                'data.shareWith': shareWith.MEMBERS.value
                            },
                            {
                                'data.createdBy': { $in: memberList }
                            }
                        ]

                    }
                ]
            },
            options: { ...options } || { limit: 7, skip: 0 },
            sorts: [{ field: 'createdAt', direction: 'desc' }]
        }

        if (searchCriteria)
            Object.assign(searchCriteria, defaultCriteria);

        let response = await super.search(searchCriteria || defaultCriteria);
        if (!archived)
            return response.filter(p => p.archived !== true && p.archived !== null);
        else
            return response;
    }

    async getPersonalPosts(member, options) {
        const defaultCriteria = {
            selector: {
                $or: [
                    {
                        'data.createdBy': member
                    },
                ]
            },
            options: { ...options } || { limit: 7, skip: 0 },
            sorts: [{ field: 'createdAt', direction: 'desc' }]
        }
        let response = await super.search(defaultCriteria);
        return response;
    }

    async getField(id, field) {
        let result = await super.find(id);
        return result && result[field];
    }

    async exist(id) {
        let result = await super.find(id);
        return result ? true : false;
    }

    async createIndex() {
        return this.db.createIndex({
            index: { fields: ['index'] },
        })
    }
}

export const postRepository = new PostRepository();
