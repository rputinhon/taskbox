import _ from 'lodash';
import { taskBoxModel } from "../../../models/TaskBoxModel";
import store from "../../..";


export  function createTaskBox(request) {
    const currentUser = store.state.user;
    let newTaskBox = Object.assign({}, _.cloneDeep(taskBoxModel));
    if(request){
        newTaskBox.task.title=request.name;
        newTaskBox.task.subject=request.subject;
        newTaskBox.task.description=request.description;
    }
    newTaskBox.createdBy = { user: currentUser.user.name, profile: currentUser.user.metadata.profileId };
    newTaskBox.createdAt = new Date().toISOString();
    newTaskBox.updatedAt = newTaskBox.createdAt;
    return newTaskBox;
}

export  function resetIds(nodes, parentId) {
    Object.values(nodes).map(node => {
        nodes[parentId] = node;
        delete node[node.id];
        node.id = parentId;
        node.data.taskbox = parentId
        if (node.name == 'TaskBox')
            resetIds(node.data.nodes, parentId);

    })
}

export  function createTaskBoxFromNode(node) {
    if (!node) return console.log('Provide a Node');

    const currentUser = store.state.user;

    let newTaskBox =  Object.assign({}, _.cloneDeep(taskBoxModel));
    Object.assign(newTaskBox.node, _.cloneDeep(node));

    newTaskBox.createdBy = { user: currentUser.user.name, profile: currentUser.user.metadata.profileId }
    newTaskBox.createdAt = new Date().toISOString();
    newTaskBox.updatedAt = newTaskBox.createdAt;

    return newTaskBox;
}

export  function createNode(node, data) {

    const currentUser = store.state.user;

    let newNode = Object.assign({}, node);

    if (data)
        Object.assign(newNode.data, data);

    newNode.createdBy = { user: currentUser.user.name, profile: currentUser.user.metadata.profileId };
    newNode.createdAt = new Date().toISOString();
    newNode.updatedAt = newNode.createdAt;


    return newNode;
}
