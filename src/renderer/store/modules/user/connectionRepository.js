/* eslint-disable */

import { relationalDb } from '../../config/pouchdb'
import { Repository } from '../../db/AbstractDBRepository'
import _ from 'lodash'
import { invitationStatus, connectionModel, messageStatus } from '../../models/ConnectionModel'
import store from '../..'
import moment from 'moment';

class ConnectionRepository extends Repository {
    constructor() {
        super('connection', relationalDb)
        relationalDb.createIndex({
            index: { fields: ['_id', 'data.type', 'data.invitations', 'data.host', 'data.guest', 'data.status', 'data.messages'] },
        })
    }

    async search(id) {
        let response = await super.search({
            selector: {
                $and: [
                    {
                        'data.type': 'connection'
                    },
                    {
                        $or: [
                            {
                                '_id': 'connection_2_' + id
                            },
                            {
                                'data.host': id
                            },
                            {
                                'data.guest': id
                            }
                        ]
                    }
                ],

            }
        })
        return response;
    }

    async save(entity) {
        let date = new Date().toISOString();
        entity.id = this.db.rel.uuid();
        entity.createdAt = date;
        entity.updatedAt = date;
        let result = super.save(entity);
        return result
    }

    async create(host, guest) {

        let connection = Object.assign({}, connectionModel);
        connection.host = host;
        connection.guest = guest;

        return this.save(connection).then((res) => {
            return res;
        })

    }

    async getAll(member, list) {
        if (!list)
            return this.db.find({
                selector: {
                    $and: [
                        {
                            'data.type': 'connection'
                        },
                        {
                            $or: [
                                {
                                    'data.host': member
                                },
                                {
                                    'data.guest': member
                                }
                            ]
                        }
                    ],
                },
                fields: ['_id', 'data.host', 'data.guest', 'data.status', 'data.id', 'data.invitations', 'data.messages'],
            }).then(async (result) => {
                const relDocs = await this.db.rel.parseRelDocs('connection', result.docs)
                let response = [];
                relDocs.connections.map(async c => {
                    let conn = _.cloneDeep(c);

                    response.push({
                        id: conn.id,
                        host: conn.host,
                        guest: conn.guest,
                        status: conn.status,
                        invitations: conn.invitations,
                        lastMessage: conn.messages[c.messages.length - 1]
                    })
                })

                return response || [];
            })
        else {
            const relDocs = await this.db.rel.find('connection', list)
            return relDocs.connections || [];
        }
    }

    async isInvited(host, guest) {
        return this.db.find({
            selector: {
                $and: [
                    {
                        'data.type': 'connection'
                    },
                    {
                        'data.status': invitationStatus.INVITED.value
                    },
                    {
                        'data.host': host
                    },
                    {
                        'data.guest': guest
                    },
                ],
            },
        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('connection', result.docs)
            return relDocs.connections.lenght > 0 ? true : false;
        })
    }

    async connected(host, guest) {
        return this.db.find({
            selector: {
                $and: [
                    {
                        'data.type': 'connection'
                    },
                    {
                        $or: [
                            {
                                'data.host': host
                            },
                            {
                                'data.guest': guest
                            }
                        ],

                    },
                    {
                        $or: [
                            {
                                'data.guest': host
                            },
                            {
                                'data.host': guest
                            }
                        ],

                    }
                ],
            },
        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('connection', result.docs)
            return relDocs.connections.lenght > 0 ? relDocs.connections[0].status : false;
        })
    }

    async getConnectionsMembers(connectionList) {
        const relDocs = await this.db.rel.find('connection', connectionList);
        return relDocs.connections.filter(conn => conn.status == invitationStatus.ACCEPTED.value).map(c => c.guest);
    }

    async getMessages(id, status) {
        const selector = {
            $and: [
                {
                    'data.type': 'connection'
                },
                {
                    '_id': 'connection_2_' + id
                }
            ],

        }
        const statusField = {
            'data.messages': {
                $elemMatch: [{
                    'status': { $eq: status }
                }]
            }
        }
        if (status)
            selector.$and.push(statusField);

        return this.db.find({
            selector: selector,
            fields: ['_id', 'data.messages'],
        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('connection', result.docs)
            return relDocs.connections.length ? relDocs.connections[0].messages : [];
        })
    }

    async createIndex() {
        return this.db.createIndex({
            index: { fields: ['index'] },
        })
    }
}

export const connectionRepository = new ConnectionRepository();
