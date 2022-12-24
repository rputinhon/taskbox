import { relationalDb } from '../../config/pouchdb'
import { nanoid } from 'nanoid'
import { Repository } from '../../db/AbstractDBRepository'


class ContentRepository extends Repository {
    constructor() {
        super('content', relationalDb)
        relationalDb.createIndex({
            index: { fields: ['_id'] },
        })
    }

    async search(searchValue) {
        const selector = {
            'data.id': searchValue,
        }

        return super.search({
            selector,
        })
    }

    async save(entity) {
        let date = new Date().toISOString();
        entity.id = nanoid();
        entity.createdAt = date;
        entity.updatedAt = date;
        let result = super.save(entity);
        return result
    }

    async createIndex() {
        return this.db.createIndex({
            index: { fields: ['index'] },
        })
    }
}

export const contentRepository = new ContentRepository();
