import { Socket } from "rete";

// TEXT
// import TextComponent from "./Text/TextComponent";
// FILE
import FileComponent from "./File/FileComponent";
// MATH
// import NumberComponent from "./Math/NumberComponent";
// import OperationComponent from "./Math/OperationComponent";
// import SymbolComponent from "./Math/SymbolComponent";
// import GroupComponent from "./Math/GroupComponent";
// import FormulaComponent from "./Math/FormulaComponent";
// TASK
import TaskBoxComponent from "./Task/TaskBoxComponent";
import NoteComponent from "./Note/NoteComponent";
// FLOW
import AuditionComponent from "./Audition/AuditionComponent";
// import FlowWithReview from "./Flow/FlowWithReview";


export const anysocket = new Socket('Any Type');
anysocket.color = '#fafafa';
export const mathsocket = new Socket('Number');
mathsocket.color = '#9955ff';
export const filesocket = new Socket('File');
filesocket.color = '#d3bc5f';
export const textsocket = new Socket('Text');
textsocket.color = '#0057ff';

mathsocket.combineWith(anysocket);
filesocket.combineWith(anysocket);
textsocket.combineWith(anysocket);
anysocket.combineWith(mathsocket);
anysocket.combineWith(filesocket);
anysocket.combineWith(textsocket);

const Sockets = {
    'TaskBox':anysocket,
    // 'Number':mathsocket,
    'Note':anysocket,
    // 'Operation':mathsocket,
    // 'Formula':mathsocket,
    // 'Flow':anysocket,
    // 'FlowWithReview':anysocket,
    'File':filesocket,
    // 'Text':textsocket
    'Audition':anysocket
};

export function getSocketByNodeName(name){
    return Sockets[name];
}

// Use ES6 Object Literal Property Value Shorthand to maintain a map
// where the keys share the same names as the classes themselves
const classes = {
    // TEXT
    // 'TextComponent':TextComponent,
    // FILE
    'FileComponent':FileComponent,
    // MATH
    // 'NumberComponent':NumberComponent,
    // 'OperationComponent':OperationComponent,
    // 'SymbolComponent':SymbolComponent,
    // 'GroupComponent':GroupComponent,
    // 'FormulaComponent':FormulaComponent,
    // TASK
    'TaskBoxComponent':TaskBoxComponent,
    'NoteComponent':NoteComponent,
    // FLOW
    'AuditionComponent':AuditionComponent
    // 'SimpleFlow':SimpleFlow,
    // 'FlowWithReview':FlowWithReview

};

class customComponent {
    constructor (className, args) {
        return new classes[className](args);
    }
}

export default customComponent;
