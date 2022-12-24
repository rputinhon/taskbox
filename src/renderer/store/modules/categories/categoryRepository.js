import { relationalDb } from '../../config/pouchdb'
import { nanoid } from 'nanoid'
import { Repository } from '../../db/AbstractDBRepository'


class CategoryRepository extends Repository {
    constructor() {
        super('category', relationalDb)
        relationalDb.createIndex({
            index: { fields: ['_id', 'data.name'] },
        })
    }

    async search(searchValue) {
        const selector = {
            'data.name': searchValue,
        }

        const fields = ['data.name','_id']

        return super.search({
            selector,fields
        })
    }

    async save(entity) {
        let date = new Date().toISOString();
        entity.id=nanoid();
        entity.createdAt = date;
        entity.updatedAt = date;
        let result = super.save(entity)
        return result
    }

    async createIndex() {
        return this.db.createIndex({
          index: { fields: ['index'] },
        })
      }
}

export const categoryRepository = new CategoryRepository();
