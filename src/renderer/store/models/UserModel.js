import { AbstractDBModel } from "./AbstractDBModel"

export const _userModel = {
  username: "Guest User",
  metadata: {
    email: null,
    profile: null,
  },
  credentials:[],
  loginServices:[]
}

export const userModel = Object.assign(_userModel, AbstractDBModel);