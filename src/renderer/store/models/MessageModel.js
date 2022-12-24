
import { AbstractDBModel } from "./AbstractDBModel"
export const _messageModel = {
    text:'',
    member:undefined,
  }

export const messageModel = Object.assign(_messageModel, AbstractDBModel);