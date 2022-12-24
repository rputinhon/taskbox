
import { AbstractDBModel } from "./AbstractDBModel"

export const _chatModel = {
    members:{},
    messages:[],
  }

  export const chatModel = Object.assign(_chatModel, AbstractDBModel);