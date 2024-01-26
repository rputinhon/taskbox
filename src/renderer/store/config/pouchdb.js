/* eslint-disable camelcase */
import PouchDB from 'pouchdb'
import PouchAuth from 'pouchdb-authentication'
import PouchdbFind from 'pouchdb-find'
import RelationalPouch from 'relational-pouch'
import store from '..'

// const memoryAdapter = require('pouchdb-adapter-memory')
const search = require('pouchdb-quick-search')

PouchDB.plugin(search);
PouchDB.plugin(require('pouchdb-adapter-memory'));
// PouchDB.plugin(memoryAdapter);
PouchDB.plugin(RelationalPouch);
PouchDB.plugin(PouchdbFind);
PouchDB.plugin(PouchAuth);

// var db = new PouchDB('mydb', {adapter: 'memory'});

let localDb = new PouchDB('local_taskbox', { skip_setup: true })
let taskbox = null;
let dbsync = null;

export class taskboxDB {
  constructor(host) {
    this.host = host;
    this.init();
  }
  init() {
    taskbox = new PouchDB(`${this.host}/taskbox`, {
      skip_setup: true
    })
  }
  taskbox() {
    return taskbox;
  }
  async sync() {
    if (dbsync) {
      dbsync.cancel()
    }

    let serverInfo = await taskbox.info();
    if (taskbox) {
      return new Promise((resolve, reject) => {
        // do one-off sync from the server until completion
        localDb.sync(taskbox)
          .on('complete', info => {

            store.commit('user/SET_SERVER_READY', true)

            // handleResponse(null, info, oncomplete, 'model.sync.complete')
            // then two-way, continuous, retriable sync
            if (info.pull)
              store.commit('app/SET_SYNC_STATUS', { info: serverInfo, syncInfo: info.pull });


            dbsync = localDb.sync(taskbox, { live: true, retry: false })
              .on('complete', info => {
                console.log(info);
                store.commit('user/SET_SERVER_READY', true)
              })
              .on('change', info => {
                // incoming changes only
                // info.direction === 'pull' && 
                if (info.change) {
                  store.commit('app/SET_SYNC_STATUS', { info: serverInfo, syncInfo: info.change });
                  // const host = store.state.user.user.metadata.profileId;
                  if (info.change.docs_written > 0) {

                    // Connection changes
                    if (info.change.docs.find(d => d.data && d.data.type == 'connection'))// && d.data.guest == host || d.data.host == host
                      store.dispatch('connection/GET_ALL');

                    let idList = store.getters['taskbox/currentTaskBoxTasksIdList'];
                    // Task changes
                    if (info.change.docs.find(d => d.data && d.data.type == 'task' && idList.includes(d.data.id))) {
                      store.dispatch('taskbox/GET_TASKS');
                      store.dispatch('user/GET_TASKS', { member: null });
                    }

                  }
                }
              })
              .on('error', err => {
                store.commit('user/SET_SERVER_READY', false)
                // store.dispatch('user/LOGOUT');
                console.warn(err)
                return reject(err)
              })

            return resolve(info)
          })
          .on('error', err => {
            return reject(err)
          })
      })
    } else {
      return Promise.resolve()
    }
  }
}

export const schema = [
  {
    singular: 'app',
    plural: 'apps'
  },
  {
    singular: 'category',
    plural: 'categories'
  },
  {
    singular: 'chat',
    plural: 'chats'
  },
  {
    singular: 'content',
    plural: 'contents'
  },
  {
    singular: 'notification',
    plural: 'notifications'
  },
  {
    singular: 'connection',
    plural: 'connections'
  },
  {
    singular: 'library',
    plural: 'libraries'
  },
  {
    singular: 'profile',
    plural: 'profiles'
  },
  {
    singular: 'portifolio',
    plural: 'portifolios',
    relations: {
      nodes: {
        hasMany: { type: 'portifolio', options: { queryInverse: 'portifolio', async: true } }
      },
    }
  },
  {
    singular: 'post',
    plural: 'posts'
  },
  {
    singular: 'task',
    plural: 'tasks',
    relations: {
      taskbox: { belongsTo: 'taskbox' }
    }
  },
  {
    singular: 'taskbox',
    plural: 'taskboxes',
    relations: {
      nodes: {
        hasMany: { type: 'task', options: { queryInverse: 'taskbox', async: true } }
      },
    }
  },
  {
    singular: 'taskObject',
    plural: 'taskObjects'
  },
  {
    singular: 'template',
    plural: 'templates'
  },
]

export const relationalDb = localDb.setSchema(schema);

