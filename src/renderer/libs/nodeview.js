import Rete from "rete";
import VueRenderPlugin from "rete-vue-render-plugin";
import ConnectionPlugin from "rete-connection-plugin";
import ContextMenuPlugin from "rete-context-menu-plugin";
import AreaPlugin from "rete-area-plugin";
import CommentPlugin from "rete-comment-plugin";
// import HistoryPlugin from "rete-history-plugin";
// import ConnectionMasteryPlugin from 'rete-connection-mastery-plugin';
import SelectionPlugin from 'rete-drag-selection-plugin';

import customComponent, { getSocketByNodeName } from '../components/NodeEditor/Components/index'

import taskstate, { getStatusTypeByValue } from '../enums/taskstate'
import { eventBus } from '../../main';
import { isEventHandleable, processItems, getMutatedNode, _toConsumableArray } from "./utils";

import { TaskBox } from './taskbox'
import store from "../store";
import { nodesBBox } from "rete-area-plugin/src/utils";
import { ipcRenderer } from 'electron';
import { templatesRepository } from "../store/modules/templates/templatesRepository";
import LODTYPES, { getLODTypeByValue } from "../enums/LOD";
import { allowRule } from "../store/modules/user/user";
import RULES from "../enums/rules";
import { hasOpenAuditions } from "../store/modules/task/task";

const path = require('path');
let initialData = {
    id: 'taskbox@0.1.0',
    comments: [],
    nodes: {},
    lastview: {
        zoom: 1,
        pos: {
            x: 0,
            y: 0,
        }
    },
}
let editor = null;
let engine = null;
let components = [];
let currentTaskBox = null;
let commentsSelected = [];
let e_output = null;
let ctrkey = false;
// to prevent useless savings
let changing = false;
let loading = false;
let processing = false;
// to prevent empty auto-saving
let cleared = false;
let self = {};

let lastLOD = LODTYPES.HIGH;

class _nodeView extends TaskBox {
    constructor() {
        super('nodeView')
        self = this;

    }

    initStore(store) {
        this.store = store;
    }

    isInitialized() {
        return editor;
    }

    registerComponents = async function (library) {

        components.splice(0, components.length);
        let index = 0;

        library.blockLibrary.blocktypes.forEach(type => {
//&& library.categoryLibrary.find(t => t.name == type.meta.category).active
            if (type.properties.isactive) {
                type.index = index;
                let args = {
                    emitter: editor,
                    type: type,
                }
                components.push(new customComponent(type.meta.component, args));
                index++;
            }

        });

        components.map(c => {

            if (!editor.components.has(c.name)) {
                editor.register(c);
                engine.register(c);
            }
            else {
                editor.components.set(c.name, c);
                engine.components.set(c.name, c);
            }

        })

        return components;

    }

    async clear() {
        if (editor)
            editor.clear();

    }

    async close() {
        if (editor) {
            await editor.clear();
            await editor.fromJSON(initialData)
        }
    }


    async saveTaskBox(saveProject) {

        if (!editor) return;
        editor.trigger("saveTaskBox", saveProject || false);

    }


    isTaskBoxDisabled(taskbox) {
        let status = store.state.taskbox.project.taskboxes[taskbox.id].data.task.status;
        return status == taskstate.REPROVED.value || status == taskstate.PAUSED.value ? true : false;
    }

    decorateConnection(conn) {
        var el = conn.el, connection = conn.connection;
        if (!connection.output.node && !store.state.taskbox.root.tasks[connection.output.node.id]) return;
        let analysing = store.state.taskbox.analysing;
        let analisis = store.state.taskbox.analisis;
        if (analysing && analisis[connection.output.node.id]) {
            let colorStart = analisis[connection.output.node.id][analysing].color;
            let colorEnd = analisis[connection.input.node.id][analysing].color;
            let gradientColors = el.querySelectorAll('stop');
            if (gradientColors[0].getAttribute('stop-color') !== colorStart)
                gradientColors[0].setAttribute('stop-color', colorStart);
            if (gradientColors[1].getAttribute('stop-color') !== colorEnd)
                gradientColors[1].setAttribute('stop-color', colorEnd);
        }
        let task = store.state.taskbox.root.tasks[connection.output.node.id];
        let status = getStatusTypeByValue(task ? task.status : 0);
        let auditing = hasOpenAuditions(task);

        let style = `stroke-linecap:${analysing ? 'square' : 'round'}!important;stroke-opacity:${analysing ? 0.7 : 1}!important;stroke-width:${analysing ? 150 : 25}px!important;stroke:${analysing ? `url(#${connection.input.node.id + connection.output.node.id}) ` : !auditing ? status.color : 'grey'}!important;stroke-dasharray: ${!auditing || analysing ? 0 : 45}!important;`
        var mainPath = el.querySelector('path');

        if (mainPath) mainPath.setAttribute('style', style)
    }

    async exposeOutput(conn, value) {
        conn.node.data.passout = value;
        editor.trigger("saveTaskBox")
        conn.node.update();
    }


    connectingFromExtenal(conn) {
        e_output = conn;
        return e_output;
    }

    addGroup() {
        // var ids = self.getSelected().list.map(function (node) {
        //     return node.id;
        // });
        // var nodes = ids.map(function (id) {
        //     return self.findNode(id)
        // });
        editor.trigger('addcomment', {
            type: 'frame',
            nodes: editor.selected.list
        });
    }

    async changeNodeID(node, newId, list) {
        let oldId = node.id;
        node.id = newId;
        list.map(item => {
            item.inputs.in.connections.map(conn => {
                if (conn.node == oldId)
                    conn.node = newId
            })
            item.outputs.flowingData.connections.map(conn => {
                if (conn.node == oldId)
                    conn.node = newId
            })
        })
        return { node: node, list: list };
    }

    async createNode(name, position) {
        if (!name) return;

        const component = editor.components.get(name)
        if (!component) throw new Error(`Component ${name} not found`)

        let node = await component.createNode({});

        node.position = position;


        return node;
    }

    async createNodeAndAdd(name, e, value) {
        if (!editor) return;
        // force update the mouse position
        editor.view.area.pointermove(e);
        let node = await self.createNode(name, [editor.view.area.mouse.x+200, editor.view.area.mouse.y-100]);
        await self.addNode(node);
        self.saveTaskBox();
        store.dispatch('taskbox/ADD_TASK', { node: node, value: value }).then(() => {
            changing = false;
        })
    }


    async addNode(node) {
        editor.addNode(node);
        self.process();
        changing = false;
    }

    isNodeInConnectionList(id, list) {
        list.map(conn => {
            if (conn.input.node.id == id || conn.output.node.id == id)
                return true;
        });
        return false;
    }

    async addTemplate(template, e) {

        try {

            // force update the mouse position
            editor.view.area.pointermove(e);

            let node = await editor.components.get('TaskBox').createNode({});
            node.position = [editor.view.area.mouse.x, editor.view.area.mouse.y];

            editor.addNode(node);
            node.vueContext.loading = true;

            store.dispatch(`taskbox/ADD_TEMPLATE`, { node: getMutatedNode(node), template: template }).then(async () => {
                // Object.assign(node.data,data)
                setTimeout(() => {
                    node.vueContext.loading = false;
                    self.updateNode(node.id);
                }, 500);
                // self.saveTaskBox(true);
            })

        } catch (error) {
            console.log(error);
        }

    }

    async packInTaskBox() {

        let center = nodesBBox(editor, editor.selected.list).getCenter();

        let taskboxNode = await editor.components.get('TaskBox').createNode({});

        taskboxNode.position = center;

        editor.addNode(taskboxNode);
        taskboxNode.vueContext.loading = true;

        let selection = _toConsumableArray(editor.selected.list);
        let idList = selection.map(n => n.id);

        selection.forEach(async function (selected) {
            let connections = await selected.getConnections();
            connections.map(async function (conn) {

                if (!idList.includes(conn.input.node.id) && conn.output.node.id == selected.id) {
                    editor.connect(taskboxNode.outputs.get('flowingData'), conn.input)
                }

                if (!idList.includes(conn.output.node.id) && conn.input.node.id == selected.id) {
                    editor.connect(conn.output, taskboxNode.inputs.get('in'))
                }

            })

        })
        store.dispatch('taskbox/PACKIN_TASKBOX', { node: taskboxNode, selection: selection }).then(() => {
            setTimeout(() => {
                taskboxNode.vueContext.loading = false;
                self.updateNode(taskboxNode.id);
                self.saveTaskBox(true);
            }, 100);
            changing = false;
        })



    }

    async unpackTaskBox(node) {

        store.dispatch('taskbox/UNPACK_TASKBOX', node)
            .then(async (args) => {

                await editor.fromJSON(args.taskbox.data).then(() => {
                    self.deleteNode(node.id);
                    self.saveTaskBox(true);
                })
            })
            .catch((error) => {
                console.log(error);
            }).finally(() => {
                changing = false;
            })
    }

    async addFiles(files, e, copy) {
        files.forEach(async (item) => {
            if (item.file.isDirectory) return;
            editor.view.area.pointermove(e);
            if (item.file.extension == '.tb')
                await ipcRenderer.invoke('app:get-Template', item.file.path).then(async (template) => {
                    await self.addTemplate(template, e);
                })

            else {
                if (copy)
                    await ipcRenderer.invoke('app:duplicate-File', item.file.name).then(async (response) => {
                        console.log(response);
                        self.createNodeAndAdd('File', e, { file: response })
                        store.dispatch('taskbox/GET_FILE_LIST');
                    })
                else
                    self.createNodeAndAdd('File', e, { file: item.file })
            }
        });
    }


    async connect(output, input) {
        await editor.connect(output, input);
    }

    async getConnections(id) {
        return self.findNode(id).then(node => {
            return node.getConnections();
        })
    }

    getInputNodes(id) {
        return self.findNode(id).then(node => {
            if (!node) return [];
            return getMutatedNode(node).inputs.in.connections.map(c => c.node);
        })
    }

    async duplicateNode(node) {
        let task = store.state.taskbox.root.tasks[node.id];
        if (task && task.value && task.value.file)
            await ipcRenderer.invoke('app:duplicate-File', task.value.file.name).then(async (response) => {
                await self.addNode(node);
                store.dispatch('taskbox/ADD_TASK', { node: node, value: response }).then(() => {
                    changing = false;
                })
                store.dispatch('taskbox/GET_FILE_LIST');
            })
        else {
            await self.addNode(node);
            store.dispatch('taskbox/ADD_TASK', { node: node }).then(() => {
                changing = false;
            })
        }

    }

    async findNode(id, filter) {
        if (!editor) return;
        let node = editor.nodes.find(n => n.id == id);
        if (!filter || (filter && node.name == filter))
            return node;
    }

    getPos(id) {
        return self.findNode(id).then(node => {
            return node.position || false;
        })
    }

    getStatusType(task) {
        return getStatusTypeByValue(task.status);
    }

    updateFrameColor(frame) {
        editor.trigger('updatecomment', frame);
        frame.obj.update()
        editor.trigger("saveTaskBox")
    }

    // View 

    selectMany(idList) {
        idList.map((id) => {
            let node = editor.view.nodes.get(editor.nodes[id])
            if (node) {
                editor.selected.add(node, true);
            }
        })
        editor.trigger('updateSelection');
    }

    getSelected() {
        if (!editor) return false;
        return editor.selected.list;
    }

    hasSelection() {
        return self.getSelected().length > 0 ? true : false;
    }

    selectAll() {
        editor.nodes.forEach(node => {
            editor.selectNode(node, true);

        });
        // eventBus.$emit('selected', editor.selected);
    }

    getView() {
        let view = {
            zoom: editor.view.area.transform.k,
            pos: {
                x: editor.view.area.transform.x,
                y: editor.view.area.transform.y
            }
        }
        return Object.assign({}, view);
    }

    frameAll() {
        AreaPlugin.zoomAt(editor);
        self.updateLOD();
    }

    frameNode(id) {
        if (!editor || !id) return;

        self.findNode(id).then((node) => {
            if (node)
                AreaPlugin.zoomAt(editor, [node]);
        })
    }

    clearEditor(save) {
        editor.clear();
        cleared == true;
        if (save)
            editor.trigger("saveTaskBox")
    }

    clearSelection() {

        if (!editor) return;

        editor.selected.clear();
        commentsSelected.forEach(cm => {
            cm.el.classList.remove('selected')
        })

        commentsSelected.splice(0, commentsSelected.length);

        eventBus.$emit('selected', []);
        eventBus.$emit('commentselected', null);
        self.updateNodes();
    }

    // Data
    async deleteNode(id) {
        self.findNode(id).then(async (node) => {
            if (!node) return;
            changing = true;
            await editor.removeNode(node);
            changing = false;
            self.process();
        });
    }


    async deleteSelected(force, list) {
        changing = true;
        let selected = editor.selected.list;

        if (list)
            selected.concat(list)

        //exclude comments
        commentsSelected.forEach((comment) => {
            editor.trigger('removecomment', { comment: comment })
        });

        commentsSelected = commentsSelected.splice(0, commentsSelected.length);

        selected.map(s => {
            if (!store.state.taskbox.root.tasks[s.id]) {
                editor.removeNode(s);
                selected.pop(s);
            }
            if (s.name == 'TasBox')
                console.log(s.data);
        })

        if (selected.length > 0) {
            if (force) {
                store.dispatch('taskbox/DELETE_TASKS', selected.map(s => s.id)).then(() => {
                    changing = false;
                    self.saveTaskBox(true);
                })
            }
            else {
                if (!store.state.taskbox.deletingNodes)
                    store.dispatch('taskbox/CONFIRM_DELETE_TASKS', selected)
            }
        }
        else {
            changing = false;
            self.saveTaskBox(true);
        }

    }

    getData() {
        var data = {
            comments: editor.toJSON().comments,
            id: currentTaskBox.data.id,
            nodes: {}
        };
        editor.nodes.forEach(function (node) {
            return data.nodes[node.id] = getMutatedNode(node);
        });

        return data;
    }


    async process() {
        if (!editor.silent) {
            await engine.abort();
            editor.trigger("process");
        }
        self.updateNodes();
    }

    removeConnection(conn) {
        editor.removeConnection(conn.input.node.getConnections().filter(c => c.input.key == conn.input.key)[0]);
        self.process();
    }

    async connectFromExtenalInput(output, input, data) {

        let sourceSocket = getSocketByNodeName(output.data.socket)

        if (input.socket.compatibleWith(sourceSocket)) {
            if (input.hasConnection() && !input.multipleConnections) {
                editor.removeConnection(input.node.getConnections().filter(c => c.input.key == input.key)[0]);
            }

            let connData = { [input.key]: data || null };

            store.commit('node/addExternalConnection', { node: input.node.id, parent: input.node.data.taskbox, connection: { [input.node.id]: connData } });

            editor.trigger('updateexternalinputs');
            input.node.update()

        }
        else
            store.commit('SET_ERROR_STATE', 'sockets are not compatible');

        eventBus.$emit('updateExternalConnection');

        if (!editor.silent) {
            await engine.abort();
            self.process();
        }
        setTimeout(() => {
            self.saveTaskBox();
        }, 0);
    }

    async connectExposedNode(conn, inputs, external) {

        if (external)
            self.connectFromExtenalInput(conn.output, conn.input, inputs[0].id)
        else {
            conn.data = self.filterInputData(conn.output.node);
            conn.data.connections = inputs;
            conn.input.node.update();

            eventBus.$emit('updateExternalConnection');


            if (!editor.silent) {
                await engine.abort();
                self.process();
            }
            setTimeout(() => {
                self.saveTaskBox();
            }, 100);
        }

    }


    async updateNode(nodeId) {
        self.findNode(nodeId).then((node) => {
            if (!node) return;
            node.update();
            node.vueContext.update();
            editor.view.updateConnections({ node });
            // self.process();
        });

    }

    async updateNodeData(updatednode) {
        self.findNode(updatednode.id).then((node) => {
            if (!node) return;
            node.data = updatednode.data;
            self.updateNode(updatednode.id);
        })
    }

    async updateNodes() {
        // if(!editor) return;
        var list = _toConsumableArray(editor.nodes);
        list.forEach(async function (node) {
            await editor.view.updateConnections({ node });
            node.update();
            node.vueContext.$forceUpdate();
        });
    }

    updateLOD(value, force) {
        let factor = value || editor.view.area.transform.k;

        let LOD = getLODTypeByValue(factor);

        if (LOD !== lastLOD || force) {
            store.commit('taskbox/SETLOD', LOD);
            lastLOD = LOD;
        }
    }

    ctrlKeyPressed(value) {
        ctrkey = value;
    }

    isEmpty() {
        return !editor || !Object.keys(editor.nodes).length ? true : false;
    }

    async initEditor(library) {

        // if(self.isInitialized())return;

        let id = initialData.id;

        let container = document.querySelector('#nodeview');

        editor = new Rete.NodeEditor(id, container);
        engine = new Rete.Engine(id);

        editor.use(ConnectionPlugin);

        editor.use(VueRenderPlugin);
        editor.use(AreaPlugin, {
        })

        editor.use(ContextMenuPlugin, {
            searchBar: false,
            delay: 0,
            items: {

                // "Dump JSON": () => {
                //     console.log(editor.toJSON());
                // }
            },
            // allocate(component) {
            //      if (component.type)
            //          return [component.type.meta.category];
            // },
            rename(component) {
                if (component.name == 'Input') return null;
                return component.name;
            },
            nodeItems: node => {
                let type = store.getters['library/library'].blockLibrary.blocktypes.find(n => n.name == node.name);

                if (node.name == 'TaskBox') {
                    let custom = {};
                    if (allowRule(RULES.PREVIEW, store.state.taskbox.root.tasks[node.id]) && type.properties.preview)
                        custom['Preview'] = () => { store.commit('taskbox/PREVIEW_TASK', { task: node.id, savestack: true }) };
                    if (allowRule(RULES.EDIT, store.state.taskbox.root.tasks[node.id]))
                        custom['Save As Template'] = () => { store.commit('taskbox/CREATE_TEMPLATE', store.state.taskbox.root.tasks[node.id]); }
                    return custom;
                }
                if (allowRule(RULES.PREVIEW, store.state.taskbox.root.tasks[node.id]) && type.properties.preview)
                    return { ['Preview']: () => { store.commit('taskbox/PREVIEW_TASK', { task: node.id, savestack: true }) } };
                return {}
            },

        });

        editor.bind('resetFrameComment');
        editor.bind('commentselected');
        editor.bind('commentcreated');
        editor.bind('commentremoved');
        editor.bind('syncframes');
        editor.bind('updatenodes');
        editor.bind('addcomment');
        editor.bind('removecomment');
        editor.bind('editColor');
        editor.bind('updatecomment');
        editor.bind('updateSelection');
        editor.bind('clearSelection');
        editor.bind('updateexternalinputs');
        editor.bind('saveTaskBox');

        editor.use(CommentPlugin, {
            inlineCommentKeys: { code: 'Key5', shiftKey: true, ctrlKey: true, altKey: true },
            margin: 80, // indent for new frame comments by default 30 (px)
            disableBuiltInEdit: true
        })

        //Drag selection plugin
        editor.use(SelectionPlugin, { enabled: true });

        //editor.use(HistoryPlugin);

        // Pick connection plugin
        // editor.use(ConnectionMasteryPlugin, {

        // });


        // Register the node types components
        self.registerComponents(library);

        editor.bind('confirmdelete');
        editor.bind("addcustomnode");

        self.updateEditor();
    }

    async setDataToNode(id, data) {
        let node = await self.findNode(id);
        node.data = data;
        self.updateNode(id);
        self.saveTaskBox();
    }

    async updateEditorData(taskbox, skipView, selection) {

        currentTaskBox = taskbox;

        loading = true;

        editor.clear();
        await editor.fromJSON(currentTaskBox ? currentTaskBox.data : initialData).then(() => {

            if (!skipView) {
                const { area } = editor.view;
                if (area == undefined)
                    return;

                area.transform.x = currentTaskBox && currentTaskBox.data.lastview.pos.x || 0;
                area.transform.y = currentTaskBox && currentTaskBox.data.lastview.pos.y || 0;
                area.zoom(currentTaskBox && currentTaskBox.data.lastview.zoom || (1, 0, 0));

                area.update();
                self.updateLOD(currentTaskBox && currentTaskBox.data.lastview.zoom || 1, true);
            }
            if (selection) {
                selection.forEach(async id => {
                    self.findNode(id).then((node) => {
                        if (node)
                            editor.selectNode(node, true);
                    })
                });
                editor.trigger('updateSelection');

            }
        })
        clearTimeout(changing);
        changing = false;
        loading = false;
    }

    updateEditor() {

        editor.on('showcontextmenu', () => {
            return allowRule(RULES.ADD, currentTaskBox);
        })

        editor.on('saveTaskBox', async (saveTaskbox) => {

            if (!allowRule(RULES.EDIT, currentTaskBox) || !currentTaskBox)
                return false;


            if (changing)
                return;

            let data = self.getData();
            data.lastview = self.getView();

            store.commit("taskbox/UPDATE_EDITOR_CHANGES", { data: data, save: saveTaskbox })

            cleared = false;
            clearTimeout(changing);

        })

        // Render the Nodeeditor
        editor.on(
            "process",
            async () => {
                if (editor.silent || processing) return;
                processing = true;
                await engine.abort();
                await engine.process(editor.toJSON());
                processing = false;
            }
        );

        editor.on(
            "updatenodes",
            async () => {
                if (editor.silent) return;
                self.updateNodes();
            }
        );

        editor.on('updateexternalinputs', () => {

        });

        editor.on('editColor', (c) => {
            eventBus.$emit("pickColor", c);
        });

        editor.on('commentselected', (comment) => {

            if (ctrkey == false)
                self.clearSelection();

            commentsSelected.push(comment);
            commentsSelected.forEach(cm => {
                cm.el.classList.add('selected')
            })
            eventBus.$emit('commentselected', comment);
        });

        editor.on('updateSelection', async () => {
            eventBus.$emit('selected', editor.selected.list);
            self.updateNodes();
        });

        editor.on('selectnode', async () => {
            eventBus.$emit('selected', editor.selected.list);
        });

        editor.on('clearSelection', function () {
            self.clearSelection();
        })

        editor.on('rendernode', ({ el, node }) => el.addEventListener('dblclick', () => {

            if (node.name == "TaskBox") {
                store.dispatch('taskbox/OPEN_TASKBOX', { id: node.id, deeper: true, savestack: true })
            }
            else {
                let type = store.getters['library/library'].blockLibrary.blocktypes.find(n => n.name == node.name);
                if (type.properties.preview)
                    store.commit('taskbox/PREVIEW_TASK', { task: node.id, savestack: true });
            }
        }));

        editor.on("addcustomnode", async (node) => {
            await self.addNode(node);
            eventBus.$emit('checkEmpty');
            store.dispatch('taskbox/ADD_TASK', { node: node }).then(() => {
                changing = false;
            })
        })

        editor.on("confirmdelete", (node) => {
            self.deleteSelected(false, node);
        })

        editor.on(
            "noderemoved",
            async () => {
                if (editor.silent) return;

                clearTimeout(changing);

                changing = setTimeout(function () {
                    changing = false;
                }, 0);

                await engine.abort();
                self.process();

                eventBus.$emit('checkEmpty');

            }
        );


        editor.on('nodetranslated', () => {
            if (editor.silent || loading) return;
            clearTimeout(changing);

            changing = setTimeout(function () {
                eventBus.$emit('updateTasks');
                store.commit('taskbox/ADD_TO_CHANGE_STACK', editor.selected.list.map(n => n.id))
                changing = false;
            }, 500);

        });


        editor.on(
            "connectioncreated",
            async (conn) => {
                if (editor.silent && loading) return;

                conn.output.connections.forEach(conn => {
                    store.commit('taskbox/CREATE_CONNECTION', conn);
                })

                if (conn.input.node.name == 'TaskBox')
                    store.commit('taskbox/UPDATE_TASKBOX_INPUTS', getMutatedNode(conn.input.node));

                self.process();
                if (!loading)
                    self.saveTaskBox();
            });

        editor.on(
            "connectionremoved",
            async (conn) => {
                if (editor.silent || loading) return;
                clearTimeout(changing);

                eventBus.$emit('updateTaskItem', conn.input.node.id);

                self.process();
                if (!loading)
                    self.saveTaskBox();
            }
        );

        editor.on(
            "connectionpick",
            (conn) => {
                if (e_output) {
                    let task = store.state.taskbox.root.tasks[conn.node.id];
                    store.commit('task/ADD_EXTERNAL_VALUE', { task: task, inputId: e_output.id });
                    eventBus.$emit('updateExternalConnection')
                    return false;
                }
            }
        );

        editor.on(
            "connectiondrop",
            async (c) => {
                if (editor.silent) return;
                eventBus.$emit('droppingConnection', c)
                self.process();
            }
        );

        editor.on('renderconnection', function (_ref) {
            self.decorateConnection(_ref);
        });

        editor.on('updateconnection', function (_ref) {
            self.decorateConnection(_ref);
        });

        editor.on('zoom', ({ source }) => {
            if (loading) return;

            self.updateLOD();

            clearTimeout(changing);

            changing = setTimeout(function () {
                store.commit('taskbox/ADD_TO_CHANGE_STACK', [currentTaskBox.id])
                changing = false;
            }, 100);


            return source !== "dblclick";

        });


        editor.view.container.addEventListener('dragover', e => e.preventDefault())
        editor.view.container.addEventListener('drop', async e => {
            e.stopPropagation()
            e.preventDefault()
            if (!e.dataTransfer) return;

            const fromFilesList = e.dataTransfer.getData('name')
            const isTemplate = e.dataTransfer.getData('isTemplate')
            const copy = e.dataTransfer.effectAllowed == 'copy' ? true : false;

            if (fromFilesList) {
                const name = e.dataTransfer.getData('name');
                const path = e.dataTransfer.getData('path');
                const extension = e.dataTransfer.getData('extension');

                await self.addFiles([{ file: { name: name, path: path, extension: extension } }], e, copy)
            }

            if (isTemplate) {
                const path = e.dataTransfer.getData('path');
                if (path) {
                    await ipcRenderer.invoke('app:get-Template', path).then(async (template) => {
                        await self.addTemplate(template, e);
                    })
                } else {
                    const id = e.dataTransfer.getData('id');
                    templatesRepository.find(id).then((template) => {
                        self.addTemplate(template, e);
                    })
                }
            }

            if (!isEventHandleable(e)) return;

            if (e.dataTransfer.items) {
                processItems(e.dataTransfer.items, async (err, files) => {

                    if (err) {
                        // TODO: A future version of this library might expose this somehow
                        console.error(err)
                        return
                    }

                    if (files.length === 0) return

                    const _files = files.map(file => {
                        return {
                            file: {
                                name: file.name.split('.')[0],
                                path: file.path,
                                extension: path.extname(file.name),
                                lastModified: file.lastModified,
                                size: file.size,
                                type: file.type
                            }
                        }
                    })

                    await self.addFiles(_files, e);
                    // const fileList = e.dataTransfer.files;

                    // // TODO: This callback has too many arguments, and the order is too
                    // // arbitrary. In next major version, it should be cleaned up.
                    // listeners.onDrop(files, pos, fileList, directories)
                })

            }

        })

    }
}


export const NodeView = new _nodeView();