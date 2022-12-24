import { dataModel } from "../store/models/DataModel";

export const blockTypesFixtures = [
    {
        name: 'TaskBox',
        meta: {
            component: 'TaskBoxComponent',
            previewType: { name: 'taskbox', properties: { scrollable: true, fullscreen: true, showTitle: true } },
            category: 'Task',
            application: 'Folder',
            color: '#0057ff',
            description: 'A block that act like a folder to organize nodes',
            label: 'my projects',
            typeicon: `m 21.454744,3.5828806 c -3.388512,0.020648 -7.180933,1.1428628 -9.560387,2.9916171 L 5.8900701,11.239299 c -1.353807,1.051862 -2.0227686,2.163343 -2.0450875,3.170943 l -0.028064,-0.03353 0.017924,22.531078 h 0.01481 c 0.051109,1.292273 1.1832952,2.397213 3.3338936,2.954193 L 23.379756,44.05664 c 3.889349,1.007297 9.575098,-0.166401 12.747704,-2.631406 l 6.003513,-4.664804 c 1.336503,-1.038416 1.955865,-2.13121 2.001428,-3.124162 l 0.0156,-7.74e-4 0.03508,-22.460128 -0.0054,0.0063 C 44.177101,9.8505477 43.03812,8.7077146 40.837524,8.1377851 L 24.641314,3.9431282 C 23.668977,3.6913041 22.584282,3.576034 21.454778,3.5829173 Z M 21.640477,5.55286 c 0.881148,-0.00535 1.72707,0.084231 2.485608,0.280683 l 5.868296,1.5161893 -13.91,10.7510777 -6.8307416,-1.782339 C 7.7561209,15.930631 6.890686,15.202106 6.6931847,14.333415 6.8401002,13.649554 7.350863,12.922022 8.2447385,12.227511 L 14.181317,7.8864302 c 1.856259,-1.442247 4.815718,-2.3174606 7.45916,-2.3335702 z m 9.365143,2.0588434 7.805645,2.2060601 c 1.49195,0.3863975 2.35794,1.1105085 2.559676,1.9749195 -0.143911,0.686899 -0.62491,1.454782 -1.550775,2.116041 l -5.907769,4.219363 c -2.612659,1.731361 -6.910614,2.838698 -9.944768,2.052888 l -6.872008,-1.818194 z m 10.545713,8.1531766 0.06203,17.224694 c -0.120663,0.834939 -0.474675,1.555448 -1.569488,2.406081 l -5.89401,4.282681 c -2.475011,1.922998 -7.036989,2.785578 -10.068823,1.99086 L 9.0960934,37.741273 C 7.6214911,37.358386 6.7587125,36.647266 6.5442135,35.795982 6.5332755,35.481773 6.5223775,35.167563 6.5114795,34.853354 l 0.062027,-16.726227 c 0.0016,-0.399866 0.7736586,0.308211 1.2303287,0.426483 l 15.5759408,3.94655 c 3.889348,1.007296 9.575098,-0.166401 12.747704,-2.631406 z m -12.155588,8.398329 c -1.02595,0 -1.85173,0.825782 -1.85173,1.85173 v 12.760178 c 0,1.02595 0.82578,1.852511 1.85173,1.852511 1.025949,0 1.85173,-0.826561 1.85173,-1.852511 V 26.014939 c 0,-1.025948 -0.825781,-1.85173 -1.85173,-1.85173 z m -8.340974,3.007211 c -0.08912,2.18e-4 -0.177472,0.03172 -0.246378,0.092 l -0.0015,-0.03977 -5.422647,3.846922 -1.812746,-2.43181 c -0.115953,-0.155094 -0.3404,-0.191874 -0.504457,-0.08264 l -1.404197,0.933272 c -0.168288,0.11217 -0.208794,0.334735 -0.09044,0.494315 l 3.03138,4.078486 c 0.11748,0.158308 0.346956,0.194247 0.511468,0.07953 l 7.1699,-4.990706 c 0.165966,-0.11536 0.202683,-0.338638 0.08109,-0.495874 l -1.051003,-1.359755 -0.01248,0.01325 c -0.02295,-0.03978 -0.05353,-0.0753 -0.09044,-0.103698 -0.0502,-0.02301 -0.104023,-0.03366 -0.157495,-0.03353 z`,
            tags: ['folder']
        },
        properties: {
            isactive: true,
            confirmDelete: true,
            preview: false,
            readonly: false,
            archived: false,
        },
        data: {
            comments: [],
            id: 'taskbox@0.1.0',
            flowingData: dataModel,
            lastview: {
                zoom: 1,
                pos: {
                    x: 0,
                    y: 0,
                }
            },
        },
    },
    {
        name: 'File',
        meta: {
            title: "FileName",
            component: 'FileComponent',
            previewType: { name: 'file', properties: { scrollable: true, fullscreen: true, showTitle: true } },
            category: 'File',
            color: '#ff9800',
            application: 'File',
            description: 'keep track of a file progress',
            typeicon: `m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125l-8.8496-8.8496zm1.8184 13.635h2.3438v2.0098h-1.6934c-0.42757 0-0.7253 0.08061-0.89062 0.24023-0.16532 0.15392-0.24805 0.42484-0.24805 0.8125v0.66602h6.5508v9.5781h-3.0859v-7.3887h-3.4648v7.3887h-3.0859v-7.3887h-1.5059v-2.1895h1.5059v-0.66602c0-1.0433 0.2896-1.8126 0.87109-2.3086 0.58149-0.50168 1.4831-0.75391 2.7031-0.75391zm2.9766 0h3.0859v2.498h-3.0859zm6.0273 0h3.0625v13.307h-3.0625zm10.596 3.498c1.505 0 2.7086 0.45294 3.6094 1.3594 0.90644 0.90644 1.3594 2.1183 1.3594 3.6348v0.87109h-7.1582c0.07411 0.71831 0.33463 1.258 0.7793 1.6172 0.44467 0.35916 1.0652 0.53906 1.8633 0.53906 0.6442 0 1.3019-0.09507 1.9746-0.2832 0.6784-0.19383 1.3753-0.48343 2.0879-0.87109v2.3594c-0.72401 0.27364-1.4479 0.47841-2.1719 0.61523-0.72401 0.14252-1.4479 0.21484-2.1719 0.21484-1.7331 0-3.0815-0.43847-4.0449-1.3164-0.95775-0.88364-1.4375-2.1223-1.4375-3.7129 0-1.562 0.46951-2.7905 1.4102-3.6855 0.94634-0.89504 2.2471-1.3418 3.9004-1.3418zm-0.01758 2.0352c-0.59289 0-1.0748 0.16756-1.4453 0.50391-0.37056 0.33065-0.60019 0.8104-0.69141 1.4375h3.9766c0-0.58149-0.17162-1.0489-0.51367-1.4023-0.33635-0.35916-0.77889-0.53906-1.3262-0.53906z`,
            tags: ['file']
        },
        properties: {
            isactive: true,
            preview: true,
            confirmDelete: true,
            readonly: false,
            archived: false,
        },
        data: {
            flowingData: dataModel,
        },
    },
    {
        name: 'Note',
        meta: {
            title: "NoteName",
            component: 'NoteComponent',
            previewType: { name: 'note', properties: { scrollable: true, fullscreen: true, showTitle: true } },
            category: 'Task',
            color: '#ff9800',
            application: 'Task',
            description: 'Task some notes',
            typeicon: `M 4.9887164,5.0166222 V 11.608239 H 43.011284 V 5.0166222 Z M 39.09047,6.9575401 A 1.3970416,1.3970416 0 0 1 40.487706,8.3547709 1.3970416,1.3970416 0 0 1 39.09047,9.7515198 1.3970416,1.3970416 0 0 1 37.693241,8.3547709 1.3970416,1.3970416 0 0 1 39.09047,6.9575401 Z M 4.9887164,12.539245 V 42.983378 H 37.780332 L 43.011284,38.2095 V 12.539245 Z M 26.678987,20.77588 h 2.176678 v 1.933701 h 2.244036 v 1.556488 h -2.244036 v 2.887802 c 0,0.316168 0.06295,0.531231 0.188606,0.644729 0.125657,0.10944 0.375257,0.164067 0.748172,0.164067 h 1.118652 v 1.556488 h -1.866824 c -0.859326,0 -1.469502,-0.178326 -1.830255,-0.535027 -0.356703,-0.360755 -0.535029,-0.970931 -0.535029,-1.830257 v -2.887802 h -1.082084 v -1.556488 h 1.082084 z M 13.50345,22.545513 c 0.786365,0 1.382092,0.240795 1.787435,0.723153 0.409396,0.482358 0.614416,1.183898 0.614416,2.104025 v 4.146464 h -2.189186 v -0.675039 -2.49856 c 0,-0.587746 -0.01397,-0.993383 -0.04234,-1.216322 -0.02432,-0.222938 -0.0689,-0.386817 -0.133757,-0.492206 -0.08512,-0.14187 -0.200497,-0.251604 -0.346421,-0.328618 -0.145922,-0.08107 -0.312484,-0.121248 -0.498942,-0.121248 -0.453983,0 -0.810635,0.176125 -1.070055,0.528773 -0.259419,0.348595 -0.388761,0.832869 -0.388761,1.453043 v 3.350177 H 9.0591627 V 22.709581 H 11.23584 v 0.996923 c 0.328328,-0.397236 0.676656,-0.688737 1.045517,-0.875194 0.368862,-0.190511 0.776219,-0.285797 1.222096,-0.285797 z m 7.661192,0 c 1.17144,0 2.085361,0.315993 2.742017,0.948326 0.660708,0.632335 0.991148,1.507798 0.991148,2.626544 0,1.118745 -0.33044,1.994209 -0.991148,2.626544 -0.656656,0.632332 -1.570577,0.948807 -2.742017,0.948807 -1.175494,0 -2.095538,-0.316475 -2.7603,-0.948807 -0.660708,-0.632335 -0.991149,-1.507799 -0.991149,-2.626544 0,-1.118746 0.330441,-1.994209 0.991149,-2.626544 0.664762,-0.632333 1.584806,-0.948326 2.7603,-0.948326 z m 14.531393,0 c 1.0701,0 1.925471,0.322115 2.565915,0.96661 0.644493,0.644495 0.966612,1.505992 0.966612,2.584202 v 0.62019 h -5.089017 c 0.05272,0.510732 0.237139,0.893597 0.553313,1.148962 0.316165,0.255365 0.758057,0.382988 1.325534,0.382988 0.458043,0 0.926145,-0.06687 1.404446,-0.200637 0.482366,-0.137815 0.976679,-0.344556 1.483358,-0.620188 v 1.678217 c -0.514784,0.194564 -1.02919,0.340555 -1.543975,0.437836 -0.514792,0.101336 -1.029675,0.152041 -1.54446,0.152041 -1.232243,0 -2.191226,-0.312071 -2.876259,-0.936298 -0.680976,-0.628282 -1.021457,-1.508148 -1.021457,-2.639053 0,-1.110639 0.33484,-1.9839 1.003655,-2.620288 0.672871,-0.636389 1.59684,-0.954582 2.772335,-0.954582 z m -0.01199,1.446788 c -0.42156,0 -0.764248,0.119778 -1.027721,0.35893 -0.263473,0.235099 -0.427349,0.575583 -0.492203,1.02146 h 2.82718 c 0,-0.413449 -0.121982,-0.74609 -0.365189,-0.997403 -0.23915,-0.255365 -0.552943,-0.382987 -0.942067,-0.382987 z M 21.164682,24.102 c -0.482357,0 -0.851256,0.173924 -1.106621,0.522518 -0.251313,0.344541 -0.377214,0.843263 -0.377214,1.495865 0,0.652602 0.125901,1.153041 0.377214,1.501637 0.255365,0.344542 0.624264,0.517226 1.106621,0.517226 0.474251,0 0.837027,-0.172684 1.088339,-0.517226 0.251313,-0.348596 0.376733,-0.849035 0.376733,-1.501637 0,-0.652602 -0.12542,-1.151324 -0.376733,-1.495865 C 22.001709,24.275924 21.638933,24.102 21.164682,24.102 Z`,
            tags: ['note', 'task']
        },
        properties: {
            isactive: true,
            preview: true,
            confirmDelete: true,
            readonly: false,
            archived: false,
        },
        data: {
        },
    },
    {
        name: 'Audition',
        meta: {
            title: "Audition",
            component: 'AuditionComponent',
            previewType: { name: 'audition', properties: { scrollable: true, fullscreen: false, showTitle: true } },
            category: 'Task',
            color: '#ff9800',
            application: 'Task',
            description: 'To Audit the progress of tasks',
            typeicon: `m 23.813533,3.1491618 c -11.39123,0 -20.6643712,9.2731412 -20.6643712,20.6643712 0,11.391232 9.2731412,20.662306 20.6643712,20.662306 11.391232,0 20.662306,-9.271074 20.662306,-20.662306 0,-11.39123 -9.271074,-20.6643712 -20.662306,-20.6643712 z m 0,3.5295004 c 9.483673,0 17.132804,7.6511958 17.132804,17.1348708 0,9.483678 -7.649131,17.132804 -17.132804,17.132804 -9.483675,0 -17.1348708,-7.649126 -17.1348708,-17.132804 0,-9.483675 7.6511958,-17.1348708 17.1348708,-17.1348708 z m 0.156063,4.4694948 c -4.187077,0 -7.615556,3.428472 -7.615556,7.615555 v 0.0021 c 0.002,1.565636 0.502398,3.044007 1.353406,4.28501 -3.278847,0.954866 -5.735567,3.869576 -5.735567,7.447607 v 2.230356 c 9e-5,0.900996 0.729919,1.631325 1.630908,1.631423 h 20.419425 c 0.900986,-9.8e-5 1.630812,-0.73043 1.630908,-1.631423 v -2.230356 c 0,-3.483152 -2.321904,-6.356773 -5.467882,-7.39283 0.87703,-1.252925 1.397881,-2.74861 1.399913,-4.339787 v -0.0021 c 0,-4.187081 -3.428468,-7.615553 -7.615555,-7.615555 z m 0,3.262333 v 5.29e-4 c 2.422956,0 4.351547,1.927987 4.352705,4.350639 -0.0019,1.736957 -1.025437,3.298254 -2.618961,3.98942 -1.618073,0.706362 -1.1175,3.121666 0.648023,3.126941 h 1.420584 c 2.586699,0 4.618323,2.033199 4.618323,4.62039 v 0.59893 H 15.234729 v -0.59893 c 0,-2.587191 2.031617,-4.62039 4.618322,-4.62039 h 1.735295 c 1.766701,-0.0027 2.269234,-2.420106 0.65009,-3.126941 -1.592871,-0.690892 -2.618494,-2.251252 -2.621546,-3.987353 v -0.0026 c 9e-4,-2.422656 1.929759,-4.350639 4.352706,-4.350639 z`,
            tags: ['audit', 'task']
        },
        properties: {
            isactive: false,
            preview: false,
            confirmDelete: true,
            readonly: false,
            archived: false,
        },
        data: {
        },
    },
    /*{
        name: 'Flow',
        meta: {
            component: 'SimpleFlow',
            previewType: { name: 'string', properties: { scrollable: true, fullscreen: false, showTitle: true } },
            category: 'Flow',
            application: 'Flow',
            color: '#5fd35f',
            description: 'Use to block or flow the data between connections',
            typeicon: `<rect width="48" height="48" ry="10.406" fill="#5fd35f" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm12.762 11.846c0.99181 0.009698 1.9608 0.49714 2.5508 1.3906l2.8477 4.3145h5.4492c1.7131 0 3.0918 1.3787 3.0918 3.0918 0 1.7131-1.3787 3.0938-3.0918 3.0938h-6.3887c-1.2167 0.27382-2.5239-0.20891-3.2539-1.3145l-3.8164-5.7773c-0.94401-1.4296-0.55262-3.3411 0.87695-4.2852 0.53609-0.354 1.1393-0.51947 1.7344-0.51367zm-13.338 5.7051h4.9238c1.7131 0 3.0918 1.3787 3.0918 3.0918 0 1.7131-1.3787 3.0938-3.0918 3.0938h-4.9238c-1.7131 0-3.0918-1.3806-3.0918-3.0938 1e-7 -1.7131 1.3787-3.0918 3.0918-3.0918z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".78666" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
            tags: ['flow']
        },
        properties: {
            isactive: true,
            confirmDelete: false,
            taskable: false,
            readonly: false,
            preview: false,
            archived: false,
        },
        data: {
            title: "Flow",
            task: _taskModel,
            taskable: false,
            taskOrder: 0,
            flowingData: { value: null, mutated: '', flowing: false },
            exposeOutput: true,

        },
    },
    {
        name: 'Review Flow',
        meta: {
            component: 'FlowWithReview',
            previewType: { name: 'string', properties: { scrollable: true, fullscreen: false, showTitle: true } },
            category: 'Flow',
            application: 'Flow',
            color: '#5fd35f',
            description: 'Use to block or flow the data between connections',
            typeicon: `<rect width="48" height="48" ry="10.406" fill="#5fd35f" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm12.762 11.846c0.99181 0.009698 1.9608 0.49714 2.5508 1.3906l2.8477 4.3145h5.4492c1.7131 0 3.0918 1.3787 3.0918 3.0918 0 1.7131-1.3787 3.0938-3.0918 3.0938h-6.3887c-1.2167 0.27382-2.5239-0.20891-3.2539-1.3145l-3.8164-5.7773c-0.94401-1.4296-0.55262-3.3411 0.87695-4.2852 0.53609-0.354 1.1393-0.51947 1.7344-0.51367zm-13.338 5.7051h4.9238c1.7131 0 3.0918 1.3787 3.0918 3.0918 0 1.7131-1.3787 3.0938-3.0918 3.0938h-4.9238c-1.7131 0-3.0918-1.3806-3.0918-3.0938 1e-7 -1.7131 1.3787-3.0918 3.0918-3.0918z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".78666" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
            tags: ['flow']
        },
        properties: {
            isactive: true,
            confirmDelete: false,
            taskable: false,
            readonly: false,
            preview: false,
            archived: false,
        },
        data: {
            title: "Review Flow",
            task: _taskModel,
            taskable: false,
            taskOrder: 0,
            flowingData: { value: null, mutated: '', flowing: false },
            exposeOutput: true,

        },
    },
    {
        name: 'Task',
        meta: {
            component: 'TaskComponent',
            previewType: { name: 'plaintask', properties: { scrollable: true, fullscreen: false, showTitle: true } },
            category: 'Flow',
            application: 'Task',
            color: '#5fd35f',
            description: 'A text field to register a task',
            typeicon: `<rect width="48" height="48" ry="10.406" fill="#5fd35f" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm20.24 11.891 2.8926 2.7891-14.158 14.254-8.4082-8.4062 2.7891-2.6895 5.6211 5.6035 11.264-11.551z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".78666" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
            tags: ['task']
        },
        properties: {
            isactive: true,
            confirmDelete: false,
            readonly: false,
            preview: true,
            archived: false,
        },
        data: {
            title: "TaskName",
            task: _taskModel,
            taskable: true,
            taskOrder:null,
            flowingData: {value:null,mutated:'',flowing:true},
            exposeOutput:true,

        },
    },
    {
        name: 'Number',
        meta: {
            title: "Number",
            component: 'NumberComponent',
            previewType: { name: 'string', properties: { scrollable: true, fullscreen: false, showTitle: true } },
            category: 'Math',
            color: '#9955ff',
            application: 'Math',
            description: 'Number Input for math nodes',
            image: '',//256x128
            typeicon: `<rect width="48" height="48" ry="10.406" fill="#9955ff" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm5.8477 10.412h4.2871v4.2852h2.8555v-4.2852h4.2871v4.2852h2.8574v4.2871h-2.8574v2.8555h2.8574v4.2871h-2.8574v4.2852h-4.2871v-4.2852h-2.8555v4.2852h-4.2871v-4.2852h-2.8574v-4.2871h2.8574v-2.8555h-2.8574v-4.2871h2.8574v-4.2852zm4.2871 8.5723v2.8555h2.8555v-2.8555h-2.8555z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".78666" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
            tags: ['math', 'number', 'int']
        },
        properties: {
            isactive: true,
            preview: true,
            confirmDelete: false,
            readonly: false,
            archived: false,
        },
        data: {
            title: 'Number',
            task: _numberTaskModel,
            flowingData: { value: 0, mutated: '', flowing: true },
            numberType: 0,
            taskable: false,
            exposeOutput: true,

        },

    },
    {
        name: 'Operation',
        meta: {
            title: "Operation",
            component: 'OperationComponent',
            previewType: { name: 'string', properties: { scrollable: true, fullscreen: false, showTitle: true } },
            category: 'Math',
            application: 'Math',
            color: '#9955ff',
            description: 'Operation for two number imputs',
            image: '',//256x128
            typeicon: `<rect width="48" height="48" ry="10.406" fill="#9955ff" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <path d="M 12.4375 3.5878906 C 7.5346 3.5878906 3.5878906 7.5346 3.5878906 12.4375 L 3.5878906 35.5625 C 3.5878906 40.4654 7.5346 44.412109 12.4375 44.412109 L 35.5625 44.412109 C 40.4654 44.412109 44.412109 40.4654 44.412109 35.5625 L 44.412109 12.4375 C 44.412109 7.5346 40.4654 3.5878906 35.5625 3.5878906 L 12.4375 3.5878906 z M 21.675781 13.990234 L 26.675781 13.990234 L 26.675781 21.431641 L 34.195312 21.431641 L 34.195312 26.568359 L 26.675781 26.568359 L 26.675781 34.009766 L 21.675781 34.009766 L 21.675781 26.568359 L 14.175781 26.568359 L 14.175781 21.431641 L 21.675781 21.431641 L 21.675781 13.990234 z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".78666" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
            options: [{ name: 'add', oneinput: false },
            { name: 'subtract', oneinput: false },
            { name: 'multiply', tex: ['\\ast', '\\cdot', ''], oneinput: false },
            { name: 'divide', oneinput: false },
            { name: 'root', oneinput: false },
            { name: 'powerto', oneinput: false },
            { name: 'log', oneinput: false },
            { name: 'percent', oneinput: false },
            { name: 'invert', oneinput: true }],
            tags: ['math', 'number', 'int', 'add']
        },
        properties: {
            isactive: true,
            preview: true,
            confirmDelete: false,
            readonly: false,
            archived: false,
        },
        data: {
            title: 'Operation',
            task: _numberTaskModel,
            flowingData: { value: 0, mutated: '', flowing: true },
            selected: 0,
            textype: 0,
            taskable: false,
            exposeOutput: true,

        },

    },
    {
        name: 'Symbol',
        meta: {
            title: "Symbol",
            component: 'SymbolComponent',
            previewType: { name: 'string', properties: { scrollable: true, fullscreen: false, showTitle: true } },
            category: 'Math',
            application: 'Math',
            color: '#9955ff',
            description: 'Math Symbol',
            image: '',//256x128
            typeicon: `<rect width="48" height="48" ry="10.406" fill="#9955ff" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <path d="m 35.542969,3.5683594 c -8.151443,0.093196 -16.30442,-0.091258 -24.455078,0.09375 -4.868534,0.6450138 -8.3204899,5.8094721 -7.4980521,10.5668516 0.077519,7.698277 -0.1803862,15.412125 0.1468624,23.100345 0.8529823,4.577138 5.6977498,7.794941 10.2500107,7.080813 7.779084,-0.07844 15.573747,0.181075 23.342777,-0.146856 4.580801,-0.853608 7.800275,-5.706117 7.077264,-10.261428 C 44.34017,26.246236 44.57982,18.486981 44.271484,10.734373 43.529881,6.7032767 39.652149,3.4852781 35.542969,3.5683594 Z M 15.201172,17.425781 c 5.865885,0 11.731771,0 17.597656,0 0,1.745443 0,3.490885 0,5.236328 -5.865885,0 -11.731771,0 -17.597656,0 0,-1.745443 0,-3.490885 0,-5.236328 z m 0,7.927735 c 5.865885,0 11.731771,0 17.597656,0 0,1.740234 0,3.480469 0,5.220703 -5.865885,0 -11.731771,0 -17.597656,0 0,-1.740234 0,-3.480469 0,-5.220703 z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".78666" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
            options: [
                { name: 'plusminus', icon: `+-`, tex: '\\pm' },
                { name: 'equal', icon: `=`, tex: '=' },
                { name: 'different', icon: `!=`, tex: '\\ne' },
                { name: 'lessthen', icon: `<`, tex: '\\lt' },
                { name: 'greaterthen', icon: `>`, tex: '\\gt' },
                { name: 'lessequal', icon: `<=`, tex: '\\le' },
                { name: 'greaterequal', icon: `=>`, tex: '\\ge' },
                { name: 'mlessthen', icon: `m<`, tex: '\\ll' },
                { name: 'mgreaterthen', icon: `m>`, tex: '\\gg' },
                { name: 'prec', icon: `-<`, tex: '\\prec' },
                { name: 'precequal', icon: `-<=`, tex: '\\preceq' },
                { name: 'succ', icon: `>-`, tex: '\\succ' },
                { name: 'succequal', icon: `>-=`, tex: '\\succeq' },
                { name: 'in', icon: `E`, tex: '\\in' },
                { name: 'notin', icon: `!E`, tex: '\\notin' },
                { name: 'subset', icon: `C`, tex: '\\subset' },
                { name: 'supset', icon: `!C`, tex: '\\supset' },
                { name: 'subseteq', icon: `C=`, tex: '\\subseteq' },
                { name: 'supseteq', icon: `!C=`, tex: '\\supseteq' },
                { name: 'equivalent', icon: `-=`, tex: '\\equiv' },
                { name: 'cong', icon: `~=`, tex: '\\cong' },
                { name: 'approx', icon: `~~`, tex: '\\approx' },
                { name: 'propto', icon: `oc`, tex: '\\propto' },


            ],
            tags: ['math', 'number', 'int', 'add']
        },
        properties: {
            isactive: true,
            preview: true,
            confirmDelete: false,
            readonly: false,
            archived: false,
        },
        data: {
            title: 'Symbol',
            task: _numberTaskModel,
            flowingData: { value: 0, mutated: '', flowing: true },
            selected: 0,
            textype: 0,
            taskable: false,
            exposeOutput: true,

        },
    },
    {
        name: 'Group',
        meta: {
            title: "Group",
            component: 'GroupComponent',
            previewType: { name: 'string', properties: { scrollable: true, fullscreen: false, showTitle: true } },
            category: 'Math',
            application: 'Math',
            color: '#9955ff',
            description: 'Group math inputs',
            image: '',//256x128
            typeicon: `<rect width="48" height="48" ry="10.406" fill="#9955ff" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496z" fill="#fafafa" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <text x="24" y="32.359386" fill="#9955ff" font-family="sans-serif" font-size="40px" text-align="center" text-anchor="middle" style="line-height:1.25" xml:space="preserve"><tspan x="24" y="32.359386" fill="#9955ff" font-family="sans-serif" font-size="26.667px" font-weight="bold" style="font-variant-caps:normal;font-variant-east-asian:normal;font-variant-ligatures:normal;font-variant-numeric:normal">( )</tspan></text>`,
            options: [
                { name: 'parentesis', icon: `( )`, tex: '()' },
                { name: 'curlbraquets', icon: `{ }`, tex: '{}' },
                { name: 'braquets', icon: `[ ]`, tex: '[]' }],
            tags: ['math', 'number', 'int', 'Multiply']
        },
        properties: {
            isactive: true,
            preview: true,
            confirmDelete: false,
            readonly: false,
            archived: false,
        },
        data: {
            title: 'Group',
            task: _numberTaskModel,
            taskable: false,
            flowingData: { value: 0, mutated: '', flowing: true },
            selected: 0,
            exposeOutput: true,

        },

    },
    {
        name: 'Formula',
        meta: {
            title: "Formula",
            component: 'FormulaComponent',
            previewType: { name: 'mathFormula', properties: { scrollable: true, fullscreen: false, showTitle: true } },
            category: 'Math',
            application: 'Math',
            color: '#9955ff',
            description: 'Render a math formula from inputs',
            image: '',//256x128
            typeicon: `<rect width="48" height="48" ry="10.406" fill="#9955ff" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm1.6621 13.658h2.0254v1.7383h-1.4648c-0.37478 0-0.63331 0.07091-0.78125 0.20898-0.14793 0.13314-0.22266 0.36585-0.22266 0.70117v0.57812h2.2637v1.8926h-2.2637v6.3906h-2.6484v-6.3906h-1.3184v-1.8926h1.3184v-0.57812c1e-6 -0.90242 0.25092-1.5671 0.75391-1.9961 0.50299-0.43395 1.2826-0.65234 2.3379-0.65234zm5.4062 0.015625h2.1973c-0.6312 1.1687-1.1043 2.3122-1.4199 3.4316-0.3156 1.1145-0.47461 2.2168-0.47461 3.3066 0 1.0898 0.15613 2.1951 0.4668 3.3145 0.3156 1.1194 0.7916 2.2658 1.4277 3.4395h-2.1973c-0.75448-1.218-1.3119-2.374-1.6719-3.4688-0.35998-1.0997-0.53906-2.1915-0.53906-3.2715 0-1.0799 0.17908-2.1708 0.53906-3.2754 0.36491-1.1095 0.92233-2.2684 1.6719-3.4766zm14.395 0h2.1973c0.74955 1.2082 1.3041 2.367 1.6641 3.4766 0.36491 1.1046 0.54883 2.1954 0.54883 3.2754 0 1.0799-0.18104 2.1718-0.54102 3.2715-0.35998 1.0947-0.9174 2.2507-1.6719 3.4688h-2.1973c0.6312-1.1736 1.1043-2.3201 1.4199-3.4395 0.3156-1.1194 0.47461-2.2246 0.47461-3.3145 0-1.0898-0.15901-2.1922-0.47461-3.3066-0.3156-1.1194-0.78872-2.2629-1.4199-3.4316zm-10.607 3.2109h2.8047l1.6934 2.4551 1.7148-2.4551h2.8047l-2.9883 4.0293 3.1348 4.2539h-2.8008l-1.8652-2.6172-1.8418 2.6172h-2.8027l3.1367-4.2383-2.9902-4.0449z" fill="#fafafa" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
            tags: ['math', 'number', 'int', 'Formula']
        },
        properties: {
            isactive: true,
            preview: true,
            confirmDelete: false,
            readonly: false,
            archived: false,
        },
        data: {
            title: 'Formula',
            task: _numberTaskModel,
            flowingData: { value: 0, mutated: '', flowing: true },
            taskable: false,
            taskOrder: 0,
            exposeOutput: true,


        },

    },
    {
        name: 'Text',
        meta: {
            title: "TextName",
            component: 'TextComponent',
            previewType: { name: 'textpage', properties: { scrollable: false, fullscreen: false, showTitle: true } },
            category: 'Text',
            application: 'Text',
            color: '#0057ff',
            description: 'text nodes',
            typeicon: `<rect width="48" height="48" ry="10.406" fill="#0057ff" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496zm8.7224 10.118h6.5566l7.9004 21.328h-5.5293l-1.3418-3.8848h-8.5996l-1.3574 3.8848h-5.5293zm3.2852 5-2.9277 8.4863h5.8418z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".78666" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
            tags: ['text']
        },
        properties: {
            isactive: true,
            preview: true,
            confirmDelete: true,
            readonly: false,
            archived: false,
        },
        data: {
            title: 'TextName',
            hasContent: 'text',
            task: taskModel,
            taskable: true,
            taskOrder: 0,
            exposeOutput: true,
            flowingData: { value: {}, mutated: '', flowing: true },

        },
    },
    {
        name: 'Book',
        meta: {
            title: "BookName",
            component: 'BookComponent',
            // previewType: { name: 'textpage', properties: { scrollable: false, fullscreen: false, showTitle: true } },
            category: 'Text',
            application: 'Text',
            color: '#0057ff',
            description: 'Create a Book with text inputs',
            typeicon: `<rect width="48" height="48" ry="10.406" fill="#0057ff" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
            <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496zm8.7224 10.118h6.5566l7.9004 21.328h-5.5293l-1.3418-3.8848h-8.5996l-1.3574 3.8848h-5.5293zm3.2852 5-2.9277 8.4863h5.8418z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".78666" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
            tags: ['text']
        },
        properties: {
            isactive: true,
            preview: false,
            confirmDelete: true,
            readonly: false,
            archived: false,
        },
        data: {
            title: 'PageName',
            task: _fileTaskModel,
            taskable: true,
            taskOrder: 0,
            exposeOutput: true,
            flowingData: { value: {}, mutated: '', flowing: true },
        },
    },*/

]


