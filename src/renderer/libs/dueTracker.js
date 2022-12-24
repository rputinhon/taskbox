import _ from "lodash";
import moment from "moment";
import { eventBus } from "../../main";
import { TaskBox } from "./taskbox";

let self = {};
let dueList = {};

class _dueTracker extends TaskBox {
    constructor() {
        super('dueTracker')
        self = this;
        this.updating = false

    }
    update(interval) {
        this.updating = setInterval(() => {
            Object.keys(dueList).map(id => {
                let e = _.cloneDeep(dueList[id]);
                if (e.p <= 100) {
                    const max = moment(e.d).valueOf();
                    const now = moment.now();
                    const min = e.s ? moment(e.s).valueOf() : now;
                    let range = max - min;

                    let percent = ((now - min) * 100) / range;
                    e.p = percent;
                    dueList[id] = e;
                    eventBus.$emit('updateInterval', { id: id, interval: e.p })
                }
            });
        }, interval || 1000);

    }
    getInterval(id) {
        if (!self.isTracking(id)) return 0;
        return dueList[id].p;
    }
    isTracking(id) {
        return dueList[id] ? true : false;
    }
    track(task, update) {
        if (!self.isTracking(task.id) || update) {
            dueList[task.id] = { s: task.due.startedAt, d: task.due.plannedToEndAt, p: 0 };
            if (!this.updating)
                self.update();

        }
    }
    untrack(id) {
        if (this.isTracking(id))
            delete dueList[id];
    }
    clear() {
        dueList = {};
    }
    pause() {
        clearInterval(this.updating);
    }

}

export const DueTracker = new _dueTracker();