import { AbstractDBModel } from "./AbstractDBModel"
export const _templateModel = {
    name:'',
    description:'',
    stars:0,
    data:{}
  }

  export const templateModel = Object.assign(_templateModel, AbstractDBModel);