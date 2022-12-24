import notificationstatus from "../../enums/notificationstatus";
import { AbstractDBModel } from "./AbstractDBModel"


export const _notificationModel = {
    type:'notification',
    to: '',
    from: '',
    notificationType: null,
    status: notificationstatus.SENT.value
}

export const notificationModel = Object.assign(_notificationModel, AbstractDBModel);