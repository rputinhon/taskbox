import { relationalDb } from '../../config/pouchdb'
import { nanoid } from 'nanoid'
import { Repository } from '../../db/AbstractDBRepository'
import store from '../..'


class PortifolioRepository extends Repository {
    constructor() {
        super('portifolio', relationalDb)
        relationalDb.createIndex({
            index: { fields: ['_id', 'member'] },
        })
    }

    async search(searchValue) {
        const selector = {
            'member': searchValue,
        }

        return super.search({
            selector,
        })
    }

    async getPortifolios(){
        let user = store.getters['user/profile'].id
        const result = await this.db.rel.findHasMany('portifolio', 'member', user);
        return result.portifolios || [];
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

export const portifolioRepository = new PortifolioRepository();
