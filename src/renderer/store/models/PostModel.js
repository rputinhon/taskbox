
// import auditionstatus from "../../enums/auditionstatus"
// import taskstate from "../../enums/taskstate"
import { AbstractDBModel } from "./AbstractDBModel"

export const postType = {
  HISTORY: {
    value: 0,
    componentType: 'History',
    title: 'Post Title',
    icon: 'm 17.848558,22.747108 c 0.534248,0 10.805299,-0.05634 11.538462,0 0.733163,0.05634 1.342346,-0.716452 1.342346,-1.400954 0,-0.684502 0,-7.122197 0,-7.122197 0,-0.699335 -0.01093,-1.267545 -0.03278,-1.70463 -0.02185,-0.458939 -0.07649,-0.83046 -0.163906,-1.114565 -0.08742,-0.284105 -0.218543,-0.502648 -0.393376,-0.655627 -0.15298,-0.174834 -0.360595,-0.338741 -0.622846,-0.491721 C 28.904538,9.9077465 28.237983,9.7329128 27.516794,9.7329128 H 26.467791 V 8.9133791 h 12.751944 v 0.8195337 h -1.049003 c -0.284105,0 -0.590065,0.032781 -0.917878,0.098344 -0.305959,0.065563 -0.600991,0.1639067 -0.885096,0.2950322 -0.262251,0.131125 -0.502648,0.295032 -0.72119,0.49172 -0.218543,0.196688 -0.371522,0.426158 -0.458939,0.688409 -0.152979,0.458939 -0.229469,1.431452 -0.229469,2.917539 v 19.20987 c 0,0.699335 0.01093,1.267545 0.03278,1.70463 0.04371,0.437085 0.09834,0.79768 0.163907,1.081785 0.08742,0.284105 0.207615,0.513574 0.360595,0.688408 0.152979,0.152979 0.360594,0.305959 0.622845,0.458939 0.611919,0.349667 1.2894,0.524501 2.032444,0.524501 h 1.049003 v 0.819534 H 26.467791 V 37.89209 h 1.049003 c 0.502647,0 0.950659,-0.03278 1.344035,-0.09834 0.393376,-0.08742 0.732117,-0.273177 1.016222,-0.557282 0.284105,-0.305959 0.49172,-0.753971 0.622845,-1.344036 0.15298,-0.611918 0.22947,-1.431452 0.22947,-2.458601 0,0 -0.05576,-7.447593 0,-8.049215 0.05576,-0.601622 -0.682998,-1.031222 -1.234173,-1.031222 -0.551174,0 -11.013677,0 -11.574519,0 -0.560842,0 -1.025037,0.545035 -1.025037,1.06728 0,0.522245 0,8.013153 0,8.013153 0,0.699335 0.01093,1.267545 0.03278,1.70463 0.02185,0.437085 0.07649,0.79768 0.163907,1.081785 0.08742,0.284105 0.207616,0.513574 0.360595,0.688408 0.174834,0.152979 0.393376,0.305959 0.655627,0.458939 0.611919,0.349667 1.278473,0.524501 1.999662,0.524501 h 1.081785 v 0.819534 H 8.4052681 V 37.89209 h 1.0817845 c 1.2019834,0 2.0870794,-0.360595 2.6552894,-1.081784 0.349667,-0.437085 0.524501,-1.562578 0.524501,-3.376479 v -19.20987 c 0,-0.721189 -0.01093,-1.300326 -0.03278,-1.737411 -0.02185,-0.458939 -0.07649,-0.819533 -0.163907,-1.081784 C 12.382739,11.120657 12.26254,10.902114 12.10956,10.749135 11.956581,10.574301 11.748966,10.410394 11.486715,10.257414 10.874796,9.9077465 10.208242,9.7329128 9.4870526,9.7329128 H 8.4052681 V 8.9133791 H 21.189994 v 0.8195337 h -1.081785 c -0.262251,0 -0.557283,0.032781 -0.885096,0.098344 -0.305959,0.065563 -0.600992,0.1639067 -0.885097,0.2950322 -0.262251,0.131125 -0.502647,0.295032 -0.721189,0.49172 -0.218543,0.196688 -0.371522,0.426158 -0.458939,0.688409 -0.174834,0.524501 -0.262251,1.497014 -0.262251,2.917539 0,0 0,6.817116 0,7.374601 0,0.557485 0.418673,1.14855 0.952921,1.14855 z'
  },
  // TASK: {
  //   value: 1,
  //   componentType: 'Task',
  //   title: 'Task Title',
  //   icon: taskstate.UNSTARTED.icon
  // },
  // AUDITION: {
  //   value: 2,
  //   componentType: 'Audition',
  //   title: 'Audition',
  //   icon: auditionstatus.WAITING.icon
  // },
  // TEMPLATE: {
  //   value: 3,
  //   componentType: 'Template',
  //   title: 'Template',
  //   icon: 'm 18.160629,10.932606 c -0.05529,1.366022 0.510112,2.343336 0.976181,3.100395 l -2.708859,-0.0248 c -3.512534,-0.03287 -6.367327,2.857295 -6.367327,6.354925 V 35.88282 c 0,3.497577 2.857341,6.354924 6.354925,6.354924 h 15.168906 c 3.497583,0 6.354924,-2.857348 6.354924,-6.354924 v -2.49449 -0.01595 c -0.0219,-0.877961 -0.238501,-1.730459 -0.930118,-2.290749 -0.691618,-0.560291 -1.512155,-0.530187 -2.065749,-0.426969 -0.553595,0.103216 -1.005296,0.28523 -1.374804,0.414565 -0.369509,0.129334 -0.673303,0.178937 -0.614764,0.178937 -1.647677,0 -2.930317,-1.282642 -2.930317,-2.930317 v -0.03898 c 0,-1.647672 1.282641,-2.930317 2.930317,-2.930317 h 0.0035 0.0018 c -0.0235,1.16e-4 0.29062,0.04958 0.662599,0.164764 0.371979,0.11518 0.820373,0.274086 1.341142,0.372047 0.520769,0.09796 1.216015,0.19144 1.945277,-0.269291 0.729261,-0.460731 1.031102,-1.372424 1.031102,-2.177363 v -3.075592 c 0,-3.497581 -2.860061,-6.335889 -6.347837,-6.356697 l -3.213782,-0.01948 c 0.147319,-0.35821 0.327771,-0.759543 0.508465,-1.213584 0.211556,-0.531586 0.432284,-1.075167 0.432284,-1.803544 0,-3.0694383 -2.513076,-5.5683857 -5.582484,-5.5824835 -3.380073,-0.015525 -5.596371,2.5441277 -5.575433,5.5452765 z'
  // },
  PORTIFOLIO: {
    value: 4,
    title: 'Portifolio',
    componentType: 'Portifolio',
    icon: 'm 16.848657,5.4122682 c -0.854574,0.4907248 -1.379833,1.4025295 -1.375627,2.387968 -9.79e-4,10.6771368 -0.0052,22.0583848 -0.0052,32.9457908 0,1.380712 1.216487,2.500106 2.71663,2.500106 1.500143,0 2.716113,-1.119394 2.716113,-2.500106 V 29.326055 c 5.303621,-3.092265 10.597965,-6.177783 15.922543,-9.186521 1.85026,-1.04598 1.856904,-3.708851 0.01188,-4.76405 C 31.065694,12.076906 25.306315,8.7908978 19.605594,5.4288046 18.673853,4.970455 17.695834,4.9357017 16.848657,5.4122682 Z'
  },
}

export function getPostTypeByValue(value) {
  return Object.values(postType).find((t) => t.value == value)
}

export const candidateStatus = {
  CANDIDATE: { value: 0, text: 'Undo!' },
  ACCEPTED: { value: 1, text: 'Accepted' },
  DENYED: { value: 2, text: 'Not Accepted' },
}

export const candidateModel = {
  member: undefined,
  createdAt: '',
  updatedAt: '',
  status: candidateStatus.CANDIDATE.value
}

export const checkModel = {
  member: undefined,
  createdAt: '',
}

export const postStatus = {
  IDLE: { value: 0, text: 'Post' },
  POSTED: { value: 1, text: 'Posted' },
  HIDDEN: { value: 2, text: 'Hidden' },
  ARCHIVED: { value: 3, text: 'Archived' },
}

export const shareWith = {
  ME: { value: 0, text: 'Only me' },
  MEMBERS: { value: 1, text: 'Members' },
  FOLLOWERS: { value: 2, text: 'Followers' },
  PUBLIC: { value: 3, text: 'Public' },
  // SELECTION: { value: 2, text: 'Some Members' },
}

export const _postModel = {
  id:'',
  archived:false,
  type: 'post',
  background: null,
  backgroundColor: 'grey',
  postType: postType.HISTORY.value,
  image: null,
  data: null,
  title: 'Post Title',
  subject: 'Write here your history',
  fullDescription: 'Full Description of the Task',
  messages: [],
  checks: [],
  interesteds: [],
  shareWith: shareWith.MEMBERS.value,
  postStatus: postStatus.IDLE
}

export const postModel = Object.assign(_postModel, AbstractDBModel);