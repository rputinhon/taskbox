
import { AbstractDBModel } from "./AbstractDBModel"
export const _taskObjectModel = {
    name:'',
    category:'',
    description:'',
    parentObject:'',
    templates: [],
  }

  export const taskObjectModel = Object.assign(_taskObjectModel, AbstractDBModel);