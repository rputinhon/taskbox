import { AbstractDBModel } from "./AbstractDBModel"
export const _profileModel = {
  type: 'profile',
  coverPicture: null,
  profilePicture: null,
  username: 'Guest',
  firstName: "Offline",
  lastName: "User",
  fullName: "Guest User",
  following:[],
  remember: {
    recent: null,
    // Task filter settings
    taskFilter: 6,
    onlyTaskable: false,
  },
  displaySettings: [],
  appSettings: [],
}

export const profileModel = Object.assign(_profileModel, AbstractDBModel);