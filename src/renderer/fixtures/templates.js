export const template = {
    "data": {
      "rev": "",
      "name": "Image from 3d model",
      "description": "A template to create an image (e.g:trademark) from an 3d model, with a reference image.",
      "stars": 0,
      "data": {
        "root": {
          "taskbox": {
            "name": "TaskBox",
            "inputs": {
              "in": {
                "connections": []
              }
            },
            "outputs": {
              "flowingData": {
                "connections": []
              }
            },
            "position": [
              0,
              0
            ],
            "data": {
              "flowingData": {
                "value": null,
                "mutated": "",
                "flowing": true,
                "exposed": false
              },
              "id": "taskbox@0.1.0",
              "comments": [],
              "nodes": {
                "05E7D136-CBC9-42ED-8759-D4AC6742C70A": {
                  "id": "05E7D136-CBC9-42ED-8759-D4AC6742C70A",
                  "name": "File",
                  "data": {
                    "flowingData": {
                      "value": null,
                      "mutated": "",
                      "flowing": true,
                      "exposed": false
                    }
                  },
                  "inputs": {
                    "in": {
                      "connections": []
                    }
                  },
                  "outputs": {
                    "flowingData": {
                      "connections": [
                        {
                          "node": "A5AA491C-1866-A25B-BE5E-AD49100641CD",
                          "input": "in",
                          "data": {
                            "socket": "File",
                            "connections": {}
                          }
                        }
                      ]
                    }
                  },
                  "position": [
                    118.9468056356145,
                    229.0295797352239
                  ]
                },
                "A5AA491C-1866-A25B-BE5E-AD49100641CD": {
                  "id": "A5AA491C-1866-A25B-BE5E-AD49100641CD",
                  "name": "File",
                  "data": {
                    "flowingData": {
                      "value": null,
                      "mutated": "",
                      "flowing": true,
                      "exposed": false
                    }
                  },
                  "inputs": {
                    "in": {
                      "connections": [
                        {
                          "node": "05E7D136-CBC9-42ED-8759-D4AC6742C70A",
                          "output": "flowingData",
                          "data": {
                            "socket": "File",
                            "connections": {}
                          }
                        }
                      ]
                    }
                  },
                  "outputs": {
                    "flowingData": {
                      "connections": [
                        {
                          "node": "A01676ED-17C6-388F-98D2-F81CA01B8DB2",
                          "input": "in",
                          "data": {
                            "socket": "File",
                            "connections": {}
                          }
                        }
                      ]
                    }
                  },
                  "position": [
                    604.0337264791985,
                    223.3693840230485
                  ]
                },
                "A196497F-079E-42F6-A963-18292DC47703": {
                  "id": "A196497F-079E-42F6-A963-18292DC47703",
                  "name": "File",
                  "data": {
                    "flowingData": {
                      "value": null,
                      "mutated": "",
                      "flowing": true,
                      "exposed": false
                    }
                  },
                  "inputs": {
                    "in": {
                      "connections": [
                        {
                          "node": "A01676ED-17C6-388F-98D2-F81CA01B8DB2",
                          "output": "flowingData",
                          "data": {
                            "socket": "File",
                            "connections": {}
                          }
                        }
                      ]
                    }
                  },
                  "outputs": {
                    "flowingData": {
                      "connections": []
                    }
                  },
                  "position": [
                    1583.3987963315776,
                    216.08761695080653
                  ]
                },
                "A01676ED-17C6-388F-98D2-F81CA01B8DB2": {
                  "id": "A01676ED-17C6-388F-98D2-F81CA01B8DB2",
                  "name": "File",
                  "data": {
                    "flowingData": {
                      "value": null,
                      "mutated": "",
                      "flowing": true,
                      "exposed": false
                    }
                  },
                  "inputs": {
                    "in": {
                      "connections": [
                        {
                          "node": "A5AA491C-1866-A25B-BE5E-AD49100641CD",
                          "output": "flowingData",
                          "data": {
                            "socket": "File",
                            "connections": {}
                          }
                        }
                      ]
                    }
                  },
                  "outputs": {
                    "flowingData": {
                      "connections": [
                        {
                          "node": "A196497F-079E-42F6-A963-18292DC47703",
                          "input": "in",
                          "data": {
                            "socket": "File",
                            "connections": {}
                          }
                        }
                      ]
                    }
                  },
                  "position": [
                    1096.3877219010346,
                    219.8702935802056
                  ]
                }
              },
              "lastview": {
                "zoom": 0.3553203024257993,
                "pos": {
                  "x": 53.76938387381767,
                  "y": 222.70350162947804
                }
              }
            },
            "createdBy": "offline",
            "createdAt": "2022-11-19T12:36:58.343Z",
            "updatedAt": "2022-11-20T16:09:21.095Z",
            "id": "08DEC031-711C-CB75-A203-9727C25049C0",
            "rev": "37-d7ca2c6f2f9f8afaba1a4f05e56ba9d6"
          },
          "task": {
            "root": null,
            "taskbox": null,
            "type": "task",
            "taskType": "taskbox",
            "taskInfo": {
              "Total": {
                "value": 4
              },
              "Done": {
                "value": 3
              },
              "Incomplete": {
                "value": 1
              },
              "Unstarted": {
                "value": 0
              },
              "Started": {
                "value": 1
              },
              "Reviewing": {
                "value": 0
              },
              "Paused": {
                "value": 0
              },
              "Canceled": {
                "value": 0
              },
              "Open": {
                "value": 0
              },
              "Boxes": {
                "value": 0
              },
              "Members": {
                "value": 1
              },
              "Progress": 93
            },
            "title": "sample - 3d model",
            "subject": "taskbox 3d model",
            "fullDescription": "A modeling workflow for a trademark",
            "thumbnail": "",
            "progress": 100,
            "status": 4,
            "candidats": [],
            "workers": [
              {
                "profile": "offline",
                "credentials": [
                  4
                ]
              }
            ],
            "comments": [],
            "auditions": {},
            "value": null,
            "externalValue": null,
            "version": null,
            "due": {
              "plannedToStartAt": null,
              "startedAt": "2022-11-19T13:34:18.455Z",
              "pauses": [],
              "reviews": [],
              "progressChanges": [
                {
                  "progress": 33,
                  "time": "2022-11-19T13:34:19.450Z"
                },
                {
                  "progress": 49,
                  "time": "2022-11-19T14:24:44.887Z"
                },
                {
                  "progress": 61,
                  "time": "2022-11-20T11:14:45.478Z"
                },
                {
                  "progress": 64,
                  "time": "2022-11-20T11:36:07.472Z"
                },
                {
                  "progress": 48,
                  "time": "2022-11-20T14:34:25.462Z"
                },
                {
                  "progress": 39,
                  "time": "2022-11-20T14:36:43.519Z"
                },
                {
                  "progress": 48,
                  "time": "2022-11-20T14:37:18.416Z"
                },
                {
                  "progress": 51,
                  "time": "2022-11-20T14:40:42.134Z"
                },
                {
                  "progress": 66,
                  "time": "2022-11-20T14:45:55.891Z"
                },
                {
                  "progress": 67,
                  "time": "2022-11-20T14:50:04.404Z"
                },
                {
                  "progress": 54,
                  "time": "2022-11-20T15:51:08.428Z"
                },
                {
                  "progress": 67,
                  "time": "2022-11-20T15:59:44.200Z"
                },
                {
                  "progress": 75,
                  "time": "2022-11-20T16:07:25.714Z"
                },
                {
                  "progress": 93,
                  "time": "2022-11-20T16:07:32.518Z"
                }
              ],
              "submitReviewAt": [],
              "timeExtensions": [],
              "canceledAt": [],
              "plannedToEndAt": null,
              "completedAt": "2022-11-20T16:09:15.326Z"
            },
            "createdBy": "offline",
            "tags": [],
            "createdAt": "2022-11-19T12:36:58.446Z",
            "updatedAt": "2022-11-20T16:09:15.531Z",
            "id": "08DEC031-711C-CB75-A203-9727C25049C0",
            "rev": "17-b1e1bf861ee1b75a4997cd965468bf69"
          }
        },
        "children": {
          "taskboxes": [],
          "tasks": [
            {
              "root": "08DEC031-711C-CB75-A203-9727C25049C0",
              "taskbox": "08DEC031-711C-CB75-A203-9727C25049C0",
              "type": "task",
              "taskType": "file",
              "taskInfo": null,
              "title": "ref_Logo",
              "subject": "Select a reference image to build the 3d logo",
              "fullDescription": "Full description of the task",
              "thumbnail": '',
              "progress": 100,
              "status": 4,
              "candidats": [],
              "workers": [
                {
                  "profile": "offline",
                  "credentials": [
                    4
                  ]
                }
              ],
              "comments": [],
              "auditions": {},
              "value": {
                "file": {
                  "name": "ref_Logo",
                  "path": "C:\\Users\\usuario\\Pictures\\ref_Logo.png",
                  "extension": ".png",
                  "size": "9.3"
                }
              },
              "externalValue": null,
              "version": null,
              "due": {
                "plannedToStartAt": null,
                "startedAt": "2022-11-19T13:34:18.024Z",
                "pauses": [],
                "reviews": [],
                "progressChanges": [],
                "submitReviewAt": [],
                "timeExtensions": [],
                "canceledAt": [],
                "plannedToEndAt": null,
                "completedAt": "2022-11-19T13:34:18.024Z"
              },
              "createdBy": "offline",
              "tags": [],
              "createdAt": "2022-11-19T12:37:06.649Z",
              "updatedAt": "2022-11-19T13:34:18.195Z",
              "id": "05E7D136-CBC9-42ED-8759-D4AC6742C70A",
              "rev": "6-d7b7d1302481ad30380bc60999896250"
            },
            {
              "root": "08DEC031-711C-CB75-A203-9727C25049C0",
              "taskbox": "08DEC031-711C-CB75-A203-9727C25049C0",
              "type": "task",
              "taskType": "file",
              "taskInfo": null,
              "title": "box_logo",
              "subject": "Save the Render Result",
              "fullDescription": "Full description of the task",
              "thumbnail": "",
              "progress": 100,
              "status": 4,
              "candidats": [],
              "workers": [
                {
                  "profile": "offline",
                  "credentials": [
                    4
                  ]
                }
              ],
              "comments": [],
              "auditions": {},
              "value": {
                "file": {
                  "name": "box_logo",
                  "path": "C:\\Users\\usuario\\TaskBox\\Files\\box_logo.png",
                  "extension": ".png",
                  "size": "258.7"
                }
              },
              "externalValue": null,
              "version": null,
              "due": {
                "plannedToStartAt": null,
                "startedAt": "2022-11-20T14:40:40.198Z",
                "pauses": [],
                "reviews": [],
                "progressChanges": [
                  {
                    "progress": 11,
                    "time": "2022-11-20T14:40:41.719Z"
                  },
                  {
                    "progress": 69,
                    "time": "2022-11-20T14:45:55.271Z"
                  }
                ],
                "submitReviewAt": [],
                "timeExtensions": [],
                "canceledAt": [],
                "plannedToEndAt": null,
                "completedAt": "2022-11-20T16:07:25.170Z"
              },
              "createdBy": "offline",
              "tags": [],
              "createdAt": "2022-11-20T14:36:42.965Z",
              "updatedAt": "2022-11-20T16:07:25.351Z",
              "id": "A01676ED-17C6-388F-98D2-F81CA01B8DB2",
              "rev": "8-14906eb71fc8c382d0c901fd3a2c8636"
            },
            {
              "root": "08DEC031-711C-CB75-A203-9727C25049C0",
              "taskbox": "08DEC031-711C-CB75-A203-9727C25049C0",
              "type": "task",
              "taskType": "file",
              "taskInfo": null,
              "title": "box_logo",
              "subject": "Treat the image received from the rendering.",
              "fullDescription": "Full description of the task",
              "thumbnail": "",
              "progress": 100,
              "status": 4,
              "candidats": [],
              "workers": [
                {
                  "profile": "offline",
                  "credentials": [
                    4
                  ]
                }
              ],
              "comments": [],
              "auditions": {},
              "value": {
                "file": {
                  "name": "box_logo",
                  "path": "C:\\dev\\tb\\public\\img\\box_logo.png",
                  "extension": ".png",
                  "size": "111.1"
                }
              },
              "externalValue": null,
              "version": null,
              "due": {
                "plannedToStartAt": null,
                "startedAt": "2022-11-20T16:07:25.192Z",
                "pauses": [],
                "reviews": [],
                "progressChanges": [
                  {
                    "progress": 72,
                    "time": "2022-11-20T16:07:32.138Z"
                  }
                ],
                "submitReviewAt": [],
                "timeExtensions": [],
                "canceledAt": [],
                "plannedToEndAt": null,
                "completedAt": "2022-11-20T16:09:14.611Z"
              },
              "createdBy": "offline",
              "tags": [],
              "createdAt": "2022-11-19T12:37:56.519Z",
              "updatedAt": "2022-11-20T16:09:14.924Z",
              "id": "A196497F-079E-42F6-A963-18292DC47703",
              "rev": "9-695888f7f8f44d08fc38c86882f64986"
            },
            {
              "root": "08DEC031-711C-CB75-A203-9727C25049C0",
              "taskbox": "08DEC031-711C-CB75-A203-9727C25049C0",
              "type": "task",
              "taskType": "file",
              "taskInfo": null,
              "title": "box_model",
              "subject": "Model the 3d box.",
              "fullDescription": "Full description of the task",
              "thumbnail": "",
              "progress": 100,
              "status": 4,
              "candidats": [],
              "workers": [
                {
                  "profile": "offline",
                  "credentials": [
                    4
                  ]
                }
              ],
              "comments": [],
              "auditions": {},
              "value": {
                "file": {
                  "name": "box_model",
                  "path": "C:\\Users\\usuario\\TaskBox\\Files\\box_model.blend",
                  "extension": ".blend",
                  "size": "0.0"
                }
              },
              "externalValue": null,
              "version": null,
              "due": {
                "plannedToStartAt": null,
                "startedAt": "2022-11-19T13:34:18.048Z",
                "pauses": [],
                "reviews": [],
                "progressChanges": [
                  {
                    "progress": 47,
                    "time": "2022-11-19T14:24:44.316Z"
                  },
                  {
                    "progress": 84,
                    "time": "2022-11-20T11:14:38.913Z"
                  },
                  {
                    "progress": 91,
                    "time": "2022-11-20T11:36:06.479Z"
                  },
                  {
                    "progress": 93,
                    "time": "2022-11-20T13:44:30.762Z"
                  }
                ],
                "submitReviewAt": [],
                "timeExtensions": [],
                "canceledAt": [],
                "plannedToEndAt": null,
                "completedAt": "2022-11-20T14:50:03.902Z"
              },
              "createdBy": "offline",
              "tags": [],
              "createdAt": "2022-11-19T12:37:18.958Z",
              "updatedAt": "2022-11-20T14:50:04.061Z",
              "id": "A5AA491C-1866-A25B-BE5E-AD49100641CD",
              "rev": "13-65d4d07705b936ffc8d88c2ab4012a49"
            }
          ]
        }
      },
    }
  }