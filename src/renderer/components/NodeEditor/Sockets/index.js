import { Socket } from 'rete';

export let socketsTypes = []

export function populateSockets(sockets) {
    sockets.forEach(socket => {
        let _socket = createSocket(socket.name);
        socketsTypes.push({ name: socket.name, socket: _socket,combine:socket.combineWithTypes});
    });

    socketsTypes.forEach(socket => {
        socket.combine.forEach(type => {
            // console.loggetSocket(socket.name).combineWhith(getSocket(type)));
            // getSocket(socket.name).combineWhith(getSocket(type));
        });
    });
 
}
export function combineSockets(name) {
    return new Socket(name);
}

export function createSocket(name) {
    return new Socket(name);
}

export function getSocket(name) {
    return socketsTypes.find(socket => socket.name === name).socket;
}


