import { relationalDb } from '../../config/pouchdb'
import { Repository } from '../../db/AbstractDBRepository'

class AppRepository extends Repository {
    constructor() {
        super('app', relationalDb)
    }

    async search(container) {
        const searchValue = { $regex: RegExp(container, 'a') }
        const selector = {
            $and: [
                {
                    $or: [
                        {
                            'data.type': searchValue,
                        },
                        {
                            'data.data': searchValue,
                        },
                    ],
                },
            ].filter((x) => x !== undefined)
        }

        return super.search({
            selector,
        })
    }

    async save(entity) {
        return super.save(entity)
    }
}


export const appRepository = new AppRepository()