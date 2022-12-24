import { relationalDb } from '../../config/pouchdb'
import { Repository } from '../../db/AbstractDBRepository'


class LibraryRepository extends Repository {
    constructor() {
        super('library', relationalDb)
    }

    async search(container) {
        const searchValue = { $regex: RegExp(container, 'i') }
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

export const libraryRepository = new LibraryRepository();
