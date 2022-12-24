// FIXTURES - CATEGORY OF BLOCKS

// * svgIcon = PUT ONLY THE VECTOR VALUE
export const categoryTypesFixture = [
    {
        name: 'Task',
        description: 'Task nodes',
        parent: 'Task',
        active:true,
        color:'#5fd35f',
        svgIcon: `<rect width="48" height="48" ry="10.406" fill="#5fd35f" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
        <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm20.24 11.891 2.8926 2.7891-14.158 14.254-8.4082-8.4062 2.7891-2.6895 5.6211 5.6035 11.264-11.551z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".78666" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
        tags: ['task', 'note', 'group','box']
    },
    {
        name: 'Math',
        description: 'All kind of nodes that process number types',
        parent: 'Math',
        active:false,
        color:'#9955ff',
        svgIcon: `<rect width="48" height="48" ry="10.406" fill="#95f" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
        <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm9.7324 8.3438h3.3184v5.916h5.6016v3.3887h-5.6016v6.0293h-3.3184v-6.0293h-5.2598v-3.3887h5.2598v-5.916zm-4.7031 20.096h13.162v4.041h-13.162v-4.041z" fill="#fafafa" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
        tags: ['number', 'float', 'add', 'subtract', 'divide', 'multiply']
    },
    {
        name: 'Text',
        description: 'All kind of nodes that process text',
        parent: 'Text',
        active:false,
        color:'#0057ff',
        svgIcon: `<rect width="48" height="48" ry="10.406" fill="#0057ff" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
        <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496zm8.7224 10.118h6.5566l7.9004 21.328h-5.5293l-1.3418-3.8848h-8.5996l-1.3574 3.8848h-5.5293zm3.2852 5-2.9277 8.4863h5.8418z" fill="#fafafa" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".78666" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
        tags: ['string', 'char', 'word', 'frase', 'sentence', 'chapter', 'book', 'magazine', 'literature']
    },
    {
        name: 'IO',
        description: 'Imput nodes',
        parent: 'IO',
        active:false,
        color:'#d3bc5f',
        svgIcon: `<rect width="48" height="48" ry="10.406" fill="#d3bc5f" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
        <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm16.721 12.096c2.402 0 4.2922 0.74354 5.6719 2.2305 1.3797 1.4798 2.0703 3.5111 2.0703 6.0918s-0.69061 4.6101-2.0703 6.0898c-1.3797 1.4798-3.2699 2.2207-5.6719 2.2207-2.4091 0-4.2993-0.74811-5.6719-2.2422-1.3726-1.5012-2.0586-3.5234-2.0586-6.0684 0-2.5664 0.68604-4.5931 2.0586-6.0801 1.3726-1.4941 3.2628-2.2422 5.6719-2.2422zm-18.057 0.98h8.5996v2.7871h-2.2949v10.391h2.2949v2.7871h-8.5996v-2.7871h2.293v-10.391h-2.293v-2.7871zm18.068 2.6797c-0.49326 0-0.94147 0.08886-1.3418 0.26758-0.40033 0.17157-0.78647 0.48322-1.1582 0.93359-0.32884 0.41462-0.59542 0.96412-0.80273 1.6504-0.20016 0.68628-0.30078 1.5063-0.30078 2.457 0 0.97937 0.096048 1.7948 0.28906 2.4453 0.19302 0.64338 0.45698 1.1831 0.79297 1.6191 0.34314 0.44322 0.73385 0.76011 1.1699 0.95313 0.43607 0.18586 0.8869 0.2793 1.3516 0.2793 0.47181 0 0.92787-0.10062 1.3711-0.30078 0.44322-0.20731 0.82675-0.5242 1.1484-0.95312 0.34314-0.46466 0.6071-1.0044 0.79297-1.6191 0.18587-0.62194 0.2793-1.4347 0.2793-2.4355 0-0.95078-0.10062-1.759-0.30078-2.4238-0.19302-0.67198-0.45436-1.2215-0.7832-1.6504-0.34314-0.43607-0.7319-0.74773-1.168-0.93359-0.42892-0.19302-0.87518-0.28906-1.3398-0.28906z" fill="#fafafa" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
        tags: ['imput','file']
    },
    {
        name: 'File',
        description: 'All kind of nodes that handle file tasks',
        parent: 'File',
        active:true,
        color:'#d3bc5f',
        svgIcon: `<path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125l-8.8496-8.8496zm1.8184 13.635h2.3438v2.0098h-1.6934c-0.42757 0-0.7253 0.08061-0.89062 0.24023-0.16532 0.15392-0.24805 0.42484-0.24805 0.8125v0.66602h6.5508v9.5781h-3.0859v-7.3887h-3.4648v7.3887h-3.0859v-7.3887h-1.5059v-2.1895h1.5059v-0.66602c0-1.0433 0.2896-1.8126 0.87109-2.3086 0.58149-0.50168 1.4831-0.75391 2.7031-0.75391zm2.9766 0h3.0859v2.498h-3.0859zm6.0273 0h3.0625v13.307h-3.0625zm10.596 3.498c1.505 0 2.7086 0.45294 3.6094 1.3594 0.90644 0.90644 1.3594 2.1183 1.3594 3.6348v0.87109h-7.1582c0.07411 0.71831 0.33463 1.258 0.7793 1.6172 0.44467 0.35916 1.0652 0.53906 1.8633 0.53906 0.6442 0 1.3019-0.09507 1.9746-0.2832 0.6784-0.19383 1.3753-0.48343 2.0879-0.87109v2.3594c-0.72401 0.27364-1.4479 0.47841-2.1719 0.61523-0.72401 0.14252-1.4479 0.21484-2.1719 0.21484-1.7331 0-3.0815-0.43847-4.0449-1.3164-0.95775-0.88364-1.4375-2.1223-1.4375-3.7129 0-1.562 0.46951-2.7905 1.4102-3.6855 0.94634-0.89504 2.2471-1.3418 3.9004-1.3418zm-0.01758 2.0352c-0.59289 0-1.0748 0.16756-1.4453 0.50391-0.37056 0.33065-0.60019 0.8104-0.69141 1.4375h3.9766c0-0.58149-0.17162-1.0489-0.51367-1.4023-0.33635-0.35916-0.77889-0.53906-1.3262-0.53906z" fill="#d3bc5f"/>`,
        tags: ['file']
    },
    {
        name: 'Flow',
        description: 'Utility blocks like, folders, groups, etc',
        parent: 'Utils',
        active:false,
        color:'#5fd35f',
        svgIcon: `<rect width="48" height="48" ry="10.406" fill="#5fd35f" stop-color="#000000" stroke-linecap="round" stroke-linejoin="round" stroke-width=".92494" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>
        <path d="m12.438 3.5879c-4.9029 0-8.8496 3.9467-8.8496 8.8496v23.125c0 4.9029 3.9467 8.8496 8.8496 8.8496h23.125c4.9029 0 8.8496-3.9467 8.8496-8.8496v-23.125c0-4.9029-3.9467-8.8496-8.8496-8.8496h-23.125zm12.762 11.846c0.99181 0.009698 1.9608 0.49714 2.5508 1.3906l2.8477 4.3145h5.4492c1.7131 0 3.0918 1.3787 3.0918 3.0918 0 1.7131-1.3787 3.0938-3.0918 3.0938h-6.3887c-1.2167 0.27382-2.5239-0.20891-3.2539-1.3145l-3.8164-5.7773c-0.94401-1.4296-0.55262-3.3411 0.87695-4.2852 0.53609-0.354 1.1393-0.51947 1.7344-0.51367zm-13.338 5.7051h4.9238c1.7131 0 3.0918 1.3787 3.0918 3.0918 0 1.7131-1.3787 3.0938-3.0918 3.0938h-4.9238c-1.7131 0-3.0918-1.3806-3.0918-3.0938 1e-7 -1.7131 1.3787-3.0918 3.0918-3.0918z" fill="#fafafa" style="-inkscape-stroke:none;paint-order:fill markers stroke"/>`,
        tags: ['image']
    }
]