import store from '..';
import { schema } from '../config/pouchdb'
import { Unsorted } from './SortRequest'

export class Repository {
  db;
  type;
  pluralType;
  parent;

  constructor(type, db) {
    this.db = db
    this.type = type
    this.pluralType = schema.find((s) => s.singular === this.type)?.plural || ''
  }

  async find(options) {
    const documents = await this.db.rel.find(this.type, options)
    const entity = documents[this.pluralType][0]
    return entity
  }

  async findChildren(parent) {
    this.parent = parent;
    return this.findAll();
  }

  async findAll(sort = Unsorted) {
    const selector = {
      _id: {
        $regex: RegExp(this.type, 'i'),
      },
    }

    sort.sorts.forEach((s) => {
      selector[`data.${s.field}`] = { $gt: null }
    })

    // Adds an index to each of the fields coming from the sorting object
    // allowing the algorithm to sort by any given SortRequest, by avoiding the default index error (lack of index)

    await Promise.all(
      sort.sorts.map(
        async (s) => {
          await this.db.createIndex({
            index: {
              fields: [`data.${s.field}`],
            },
          })

          return sort
        },
      ),
    )

    const result = await this.db.find({
      selector,
      sort: [{ [`data.createdAt`]: 'desc' }]
      // sort.sorts.length > 0
      //   ? sort.sorts.map((s) => ({ [`data.${s.field}`]: s.direction }))
      //   : undefined,
    })
    const relDocs = await this.db.rel.parseRelDocs(this.type, result.docs)
    return relDocs[this.pluralType]
  }

  async count() {
    const result = await this.findAll()
    return result.length
  }

  async search(criteria, sort = Unsorted) {

    if (criteria.sorts)
      criteria.sorts.forEach((s) => {
        criteria.selector[`data.${s.field}`] = { $gt: null }
      })

    if (criteria.fields)
      criteria.fields.forEach((s) => {
        criteria.selector[`data.${s.field}`] = { $gt: null }
      })

    if (criteria.sorts)
      await Promise.all(
        criteria.sorts.map(
          async (s) => {
            await this.db.createIndex({
              index: {
                fields: [`data.${s.field}`],
              },
            })

            return sort
          },
        ),
      )

    const response = await this.db.find({
      selector: {
        $and: [
          {
            _id: {
              $regex: RegExp(this.type, 'i'),
            },
          },
          { ...criteria.selector },
        ],
      },
      ...criteria.options,
      fields:
        criteria.fields && criteria.fields.length > 0
          ? criteria.fields.map((f) => `data.${f}`)
          : undefined,
      sort:
        criteria.sorts && criteria.sorts.length > 0
          ? criteria.sorts.map((s) => ({ [`data.${s.field}`]: s.direction }))
          : undefined,
    })
    const data = await this.db.rel.parseRelDocs(this.type, response.docs)
    return data[this.pluralType]
  }


  async save(entity) {
    const currentUser = store.state.user;
    const currentTime = new Date().toISOString()
    const { id, rev, ...valuesToSave } = entity
    const savedEntity = await this.db.rel.save(this.type, {
      id,
      rev,
      ...valuesToSave,
      createdBy: currentUser.user.metadata.profileId,
      createdAt: currentTime,
      updatedAt: currentTime,
    })

    let result = await this.find(savedEntity.id);
    return result
  }

  async saveMany(entities) {
    console.log(entities);
    if (entities.length == 0)
      return;

    await Promise.all(
      entities.map(
        async (e) => {
          await this.saveOrUpdate(e);
        },
      ),
    )

    return true;
  }

  async saveOrUpdate(entity) {

    let response = await this.find(entity.id)

    if (!await response) {
      return this.save(entity)
    }

    Object.assign(entity, { rev: response.rev })

    const { id, rev, ...dataToSave } = entity

    try {
      const entityToUpdate = {
        id,
        rev,
        ...dataToSave,
        updatedAt: new Date().toISOString(),
      }

      await this.db.rel.save(this.type, entityToUpdate)
      return this.find(entity.id)
    } catch (error) {

      return this.save(entity)
    }

  }

  async delete(entity) {
    const entityToDelete = await this.find(entity.id)
    await this.db.rel.del(this.type, entity)
    return entityToDelete
  }

  async deleteMany(entities) {
    if (entities.length == 0)
      return;

    await Promise.all(
      entities.map(
        async (e) => {
          await this.delete(e);
        },
      ),
    )

    return true;
  }
}


