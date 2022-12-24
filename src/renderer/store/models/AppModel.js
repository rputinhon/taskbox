import { AbstractDBModel } from "./AbstractDBModel"

const _settingsModel = {
    offlineUserProfile:undefined,
}

const _appModel = {
    name: '',
    version: '',
    editorversion: '',
}

export const appModel = Object.assign(_appModel, AbstractDBModel);
export const settingsModel = Object.assign(_settingsModel, AbstractDBModel);