import auditionstatus from "../../enums/auditionstatus"
import reviewstatus from "../../enums/reviewstatus"
import taskstate from "../../enums/taskstate"

export const dueTypes = {
   'plannedToStartAt': { value: 1, function: 'SET_DUE_PLANNED_START', color: 'primary' },
   'plannedToEndAt': { value: 2, function: 'SET_DUE_PLANNED_END', color: 'error' },
}

export const reviewItem = {
   text: '',
   status: reviewstatus.OPEN.value,
   checked:false,
   canvas: null,
   comments: []
}

// export const reviewModel = {
//    reviewItems: [],
//    member: undefined,
//    status: reviewstatus.OPEN.value
// }

export const auditionModel = {
   createdAt: '',
   changedAt: '',
   reviews: [],
   status: auditionstatus.WAITING.value,
}

export const taskModel = {
   id: '',
   //To quick searching
   root: null,
   //Parenting 
   taskbox: null,
   //Type to fast db searching
   type: 'task',
   //Type to identify the type
   taskType: 'task',
   //for taskbox
   taskInfo:null,
   //Title of the task
   title: 'task',
   //The objective task subject
   subject: 'Task subject',
   //The objective task subject
   fullDescription: 'Full description of the task',
   //Snapshot for the task
   thumbnail: '',
   //Progress of the task
   progress: 0,
   //Progress of the task
   status: taskstate.UNSTARTED.value,
   //Invitations to task
   candidats: [],
   //Actual task workers
   workers: [],
   //Task comments
   comments: [],
   //Task auditions and reviews
   auditors: {},
   //Any value that the Task can hold
   value: null,
   //Values provided from connections out of the current box
   externalValue:null,
   useExternalValue:false,
   
   version:null,
   //All about date
   due: {
      plannedToStartAt: null,
      startedAt: null,
      pauses: [],
      reviews: [],
      progressChanges: [],
      submitReviewAt: [],
      timeExtensions: [],
      canceledAt: [],
      plannedToEndAt: null,
      completedAt: null
   },
   createdBy: '',
   tags: []
}
