import { relationalDb } from '../../config/pouchdb'
import { Repository } from '../../db/AbstractDBRepository'
// import { notificationStatus } from '../../../enums/notificationstatus'
import store from '../..'
import notificationstatus from '../../../enums/notificationstatus'
// import store from '../..'


class NotificationRepository extends Repository {
    constructor() {
        super('notification', relationalDb)
        relationalDb.createIndex({
            index: { fields: ['_id', 'data.type', 'data.notificationType', 'data.createdBy', 'data.to', 'data.from', 'data.status'] },
        })
    }

    async save(entity) {
        let date = new Date().toISOString();
        entity.id = this.db.rel.uuid();
        entity.createdAt = date;
        entity.updatedAt = date;
        let result = super.save(entity)
        return result
    }

    async fetchUnsolved(profileId) {
        if (!profileId)
            profileId = store.state.user.user.metadata.profileId;

        return this.db.find({
            selector: {
                $and: [
                    {
                        'data.type': 'notification'
                    },
                    {
                        $or: [
                            {
                                'data.to': profileId
                            },
                            {
                                'data.from': profileId
                            },

                        ]
                    },
                    // {
                    //     'data.status': { $ne: notificationStatus.SOLVED.value }
                    // },

                ],

            },

        }).then(async (result) => {
            const relDocs = await this.db.rel.parseRelDocs('notification', result.docs)
            return relDocs.notifications || [];
        })
    }

    async isInvitationAccepted(id) {
        let res = await this.db.rel.find('notification', id);
        return res.notifications[0].status == notificationstatus.ACCEPTED.value ? true : false;
    }


    async createIndex() {
        return this.db.createIndex({
            index: { fields: ['index'] },
        })
    }
}

export const notificationRepository = new NotificationRepository();
