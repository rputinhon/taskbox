import { relationalDb } from '../../config/pouchdb'
import { nanoid } from 'nanoid'
import { Repository } from '../../db/AbstractDBRepository'
import store from '../..'


class TemplatesRepository extends Repository {
    constructor() {
        super('template', relationalDb)
        relationalDb.createIndex({
            index: { fields: ['_id', 'data.name'] },
        })
    }

    async search(searchValue) {
        const selector = {
            'data.name': searchValue,
            'data.id': searchValue,
        }

        return super.search({
            selector,
        })
    }

    async save(entity) {
        let date = new Date().toISOString();
        entity.id=nanoid();
        entity.createdAt = date;
        entity.updatedAt = date;
        let result = super.save(entity)
        return result;
    }

    async getAll(){
        const user = store.state.user.user.metadata.profileId;
        const search = await this.db.rel.findHasMany('template','createdBy',user.id);
        return search.templates;
    }

    async createIndex() {
        return this.db.createIndex({
          index: { fields: ['index'] },
        })
      }
}

export const templatesRepository = new TemplatesRepository();
