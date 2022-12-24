
import sharepost from "../../enums/sharepost";
import { AbstractDBModel } from "./AbstractDBModel"

export const like = {
  member: undefined,
}

export const _portifolioModel = {
  title: '',
  description: '',
  images: [], // 512 x 512 max
  messages: [],
  likes: [],
  member: '', // user id
  visible: sharepost.ME
}

export const portifolioModel = Object.assign(_portifolioModel, AbstractDBModel);