import { relationalDb } from '../../config/pouchdb';
import { Repository } from '../../db/AbstractDBRepository';
import store from '../..';

class MemberRepository extends Repository {
    constructor() {
        super('profile', relationalDb)
        relationalDb.createIndex({
            index: { fields: ['_id', 'data.type', 'data.id', 'data.username', 'data.firstName', 'data.lastName'] },
        })
    }

    async search(searchValue) {
        const user = store.state.user.user;
        if (searchValue == user.name || !searchValue) return;

        
        let response = await super.search({
            selector: {
                $or: [
                    {
                        'data.username': { $gte: searchValue },
                    },
                    {
                        'data.firstName': { $gte: searchValue },
                    },
                    {
                        'data.lastName': { $gte: searchValue },
                    },
                ]
            },
            sorts: []
        })
        return response.map(m => {
            return {
                id: m.id,
                avatar: m.profilePicture,
                name: m.username,
                type: 'profile'
            }
        })

    }

    async getCurrent() {
        const user = store.state.user.user.metadata.profileId;
        const selector = {
            $and: [
                {
                    'data.id': user
                }

            ],
        }

        return this.db.find({
            selector: selector,
            fields: ['_id', 'data.id', 'data.username', 'data.profilePicture'],
        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('profiles', result.docs)
            console.log(relDocs);
            return relDocs.profiles[0] || null;
        });


    }

    async getFollowers(id) {
        const selector = {
            $or: [
                {
                    'data.following': { $gte: id }
                }
            ],
        }

        return this.search({
            selector: selector,
            fields: ['id'],
        }).then(async (result) => {
                return result
        });
    }


    async getList(list, fields) {

        const selector = {
            $and: [
                {
                    '_id': { $in: list.map(id => { return 'profile_2_' + id }) }
                }
            ],
        }

        return this.db.find({
            selector: selector,
            fields: fields,
        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('profiles', result.docs)
            return relDocs.profiles || null;
        });


    }
    async get(id, fields) {
        const selector = {
            $and: [
                {
                    '_id': 'profile_2_' + id
                }

            ],
        }

        return this.db.find({
            selector: selector,
            fields: fields,
        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('profiles', result.docs)
            return relDocs.profiles[0] || null;
        });


    }

    async getAll(memberList) {
        if (!memberList) return;
        let profiles = await this.db.rel.find('profile', memberList.map(m => m.id));
        return memberList.map(m => {
            let index = memberList.indexOf(m);
            return Object.assign(m,
                {
                    id: profiles.profiles[index].id,
                    name: profiles.profiles[index].username,
                    avatar: profiles.profiles[index].profilePicture,
                }
            )

        })
    }


    async createIndex() {
        return this.db.createIndex({
            index: { fields: ['index'] },
        })
    }
}

export const memberRepository = new MemberRepository();
