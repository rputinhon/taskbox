

const { dialog, Tray, Menu, clipboard, nativeImage } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const open = require('open');
const os = require('os');

const admZip = require('adm-zip');
const _ = require('lodash');
const moment = require('moment');

// local dependencies
const notification = require('./notification');
const { taskIcon, copyIcon, inputIcon, outputIcon, taskIcon32 } = require('./icons');

// get application directory
const appDir = path.resolve(os.homedir(), 'TaskBox');
const packDir = path.resolve(appDir, 'Packs');
const filesDir = path.resolve(appDir, 'Files');
const templatesDir = filesDir;



/****************************/
exports.getFolders = () => {

    const folderList = {
        home: appDir,
        packs: packDir,
        templates: templatesDir,
        files: filesDir
    }

    Object.values(folderList).forEach(folder => {
        fs.ensureDirSync(folder);
    })

    return folderList;
}

exports.openFolder = async (folder) => {
    fs.ensureDirSync(folder);
    require('child_process').exec(`start "" ${folder}`)
}

exports.packProject = async (request) => {


    let rootTaskBox = request.root;
    if (!rootTaskBox) return console.log('The Project has no Root.');

    // ensure `packDir` exists
    fs.ensureDirSync(packDir);

    let absolutePath = '';
    var zip = new admZip();


    packNode = async function (node) {

        let folder = absolutePath + request.paths[node.taskbox];

        if (node.taskType !== 'taskbox') {
            // files
            let file = node.value && node.value.file
            if (file) {
                if (fs.existsSync(file.path)) {

                    let data = fs.readFileSync(file.path, 'binary');
                    zip.addFile(`${folder + node.title + file.extension}`, Buffer.from(data, 'binary'));
                }
            }
            // notes
            if (node.taskType == 'note') {
                zip.addFile(`${folder}Note_${node.title}.txt`, Buffer.from(node.value || 'No notes', 'utf8'));
            }
            // links
            if (node.taskType == 'Link') {
                zip.addFile(`${folder}Link_${node.title}.url`, Buffer.from(node.value || 'No link', 'utf8'));
            }
        }

    }

    packTaskBox = async function () {

        if (request.children)
            await Promise.all(
                Object.values(request.children).map(async (entity) => {
                    await packNode(entity);
                })
            )

        return;

    }

    let packedPath = path.resolve(packDir, `${(rootTaskBox.title)}_${request.version}.zip`)

    await packTaskBox()
        .then(async () => {
            await new Promise(res => {
                zip.writeZipPromise(packedPath)
                setTimeout(res, 1000);
            })
        })
        .catch(console.error.bind(console)).finally(() => {
            return true;
        })
}

exports.importTemplate = async () => {
    // ensure `packDir` exists

    const file = await dialog.showOpenDialog({ properties: ['openFile', 'dontAddToRecent'], filters: [{ name: 'taskBox template', extensions: ['tb'] }] })

    if (file.canceled)
        return null;

    if (fs.existsSync(file.filePaths[0])) {
        template = fs.readFileSync(file.filePaths[0], "utf8");
        return JSON.parse(template);
    }
    else
        return null;
};

exports.getTemplate = async (path) => {
    // ensure `packDir` exists

    fs.ensureDirSync(templatesDir);

    if (fs.existsSync(path)) {
        let template = fs.readFileSync(path, "utf8");
        return JSON.parse(template);
    }
    else
        return null;
};

exports.exportTemplate = async (template) => {
    // ensure `packDir` exists
    fs.ensureDirSync(templatesDir);

    fs.writeFileSync(path.resolve(path.join(templatesDir, template.name + '.tb')), JSON.stringify(template), { encode: 'binary' }, function (err) {
        if (err) throw err;
        // console.log'It\'s saved! in same location.');
    });

    return templatesDir;

};

exports.workOnFileTask = async (args) => {

    let c_taskIcon = nativeImage.createFromDataURL(taskIcon);
    let c_copyIcon = nativeImage.createFromDataURL(copyIcon);
    let c_inputIcon = nativeImage.createFromDataURL(inputIcon);
    let c_outputIcon = nativeImage.createFromDataURL(outputIcon);
    let tray = new Tray(nativeImage.createFromDataURL(taskIcon32));

    let menuItems = [
        {
            label: `Task : ${args.task.title} | ${args.task.progress}%`, icon: c_taskIcon, role: 'copy', type: 'normal', toolTip: 'click to copy the file path.', click: function () {
                clipboard.writeText(args.task.value.file.path)
            }
        },
    ]

    if (args.inputs && args.inputs.length) {
        menuItems.push({ label: '', type: 'separator' });
        menuItems.push({ label: 'Inputs:', icon: c_inputIcon, type: 'normal' });
        args.inputs.map(task => {
            if (task && task.value && task.value.file)
                menuItems.push({
                    label: `${task.value.file.path}`, icon: c_copyIcon, role: 'copy', type: 'normal', toolTip: 'click to copy the file path.', click: function () {
                        clipboard.writeText(task.value.file.path)
                    }
                })
        })
    }

    if (args.outputs && args.outputs.length) {
        menuItems.push({ label: '', type: 'separator' });
        menuItems.push({ label: 'Outputs:', icon: c_outputIcon, type: 'normal' });
        args.outputs.map(task => {
            if (task && task.value && task.value.file)
                menuItems.push({
                    label: `${task.value.file.path}`, icon: c_copyIcon, role: 'copy', type: 'normal', toolTip: 'click to copy the file path.', click: function () {
                        clipboard.writeText(task.value.file.path)
                    }
                })
        })
    }

    let openReviews = args.task.due.reviews ? args.task.due.reviews.filter((r) => !r.value) : [];
    if (openReviews.length) {
        for (let i = 0; i < openReviews.length; i++) {
            const review = openReviews[i];
            menuItems.push({ label: '', type: 'separator' });
            menuItems.push({ label: 'Review Notes', type: 'normal' });
            for (let k = 0; k < review.reviewItems.length; k++) {
                const rev = review.reviewItems[k];
                menuItems.push({
                    label: `${rev.text}`, checked: rev.value, type: 'checkbox', toolTip: 'click to tick the review.', click: function () {
                        args.win.webContents.send('app:tick-review', { review: i, item: k });
                    }
                })
                
            }
        }
    }

    const contextMenu = Menu.buildFromTemplate(menuItems)
    tray.setToolTip('working on task: ' + args.task.title);
    tray.setContextMenu(contextMenu);

    if (fs.existsSync(args.task.value.file.path))
        await open(args.task.value.file.path, { wait: true }).then(() => { }).catch((error) => { console.log(error); }).finally(() => {
            tray.destroy();
            return true;
        })
}

exports.getUserName = () => {
    return process.env.USERNAME;
}

exports.taskDone = (task) => {
    notification.taskDone(task);
}

exports.ensureFolder = (folder) => {

    // ensure `appDir` exists
    fs.ensureDirSync(appDir);
    const filePath = path.join(path.resolve(appDir, folder));
    fs.ensureDirSync(filePath);

}

exports.renameFolder = (folder) => {

    // ensure `appDir` exists
    fs.ensureDirSync(appDir);
    let _old = path.join(path.resolve(appDir, folder.oldPath));
    fs.ensureDirSync(_old);
    let _new = path.join(path.resolve(appDir, folder.newPath));
    fs.renameSync(_old, _new);
}

exports.ensureFile = (file) => {

    // ensure `appDir` existssDir
    fs.ensureDirSync(appDir);
    const filePath = path.resolve(appDir, file);
    fs.ensureFileSync(filePath);

}

exports.fileExist = (file) => {
    return fs.existsSync(file);
}

exports.renameFile = (file, newname) => {

    const filePath = path.resolve(filesDir, file);
    fs.ensureFileSync(filePath);

    let _old = path.join(path.resolve(appDir, folder.oldPath));
    fs.ensureDirSync(_old);
    let _new = path.join(path.resolve(appDir, newname));
    fs.renameSync(_old, _new);
}
exports.duplicateFile = (file) => {

    let name = file.split('.')[0];
    name += '_copy' + '.' + file.split('.')[1];
    const sourcePath = path.resolve(filesDir, file);
    const desitinationPath = path.resolve(filesDir, name);

    if (!fs.existsSync(sourcePath))
        return;


    fs.copyFileSync(sourcePath, desitinationPath);

    const fileStats = fs.statSync(desitinationPath);

    return {
        name: name,
        path: desitinationPath,
        extension: path.extname(name).toLowerCase(),
        size: Number(fileStats.size / 1000).toFixed(1), // kb
    };


}

exports.existInFilesFolder = (file) => {

    if (!file && typeof (file) !== String) return;

    let _path = path.dirname(file);
    let _exist = fs.existsSync(file);

    if (_path == filesDir && _exist)
        return true;
    else
        return false;

}

exports.templateList = () => {

    fs.ensureDirSync(filesDir);
    const files = fs.readdirSync(filesDir);

    return files.filter(filename =>
        path.extname(filename) == '.tb'
    ).map(filename => {
        const filePath = path.resolve(filesDir, filename);
        const fileStats = fs.statSync(filePath);
        return {
            name: filename,
            path: filePath,
            // createdAt: moment(fileStats.atime).format('DD/MM/YY h:mm'),
            extension: path.extname(filename),
            size: Number(fileStats.size / 1000).toFixed(1), // kb
        };
    });

}

exports.packList = () => {

    fs.ensureDirSync(packDir);
    const files = fs.readdirSync(packDir);

    return files.map(filename => {
        const filePath = path.resolve(packDir, filename);
        const fileStats = fs.statSync(filePath);
        return {
            name: filename,
            path: filePath,
            createdAt: moment(fileStats.atime).format('DD/MM/YY h:mm'),
            extension: path.extname(filename),
            size: Number(fileStats.size / 1000).toFixed(1), // kb
        };
    });

}

// get the list of files
exports.fileList = () => {
    fs.ensureDirSync(packDir);
    const files = fs.readdirSync(filesDir);

    return files.map(filename => {
        const filePath = path.resolve(filesDir, filename);
        const fileStats = fs.statSync(filePath);

        return {
            name: filename,
            path: filePath,
            extension: path.extname(filename),
            size: Number(fileStats.size / 1000).toFixed(1), // kb
        };
    });
};

// get the list of files
exports.saveFile = (file) => {

    fs.ensureDirSync(filesDir);
    const filePath = path.resolve(filesDir, file.path);
    if (!fs.existsSync(filePath))
        fs.ensureFileSync(filePath);

    fs.writeFileSync(filePath, file.data, function (err) {
        if (err) throw err;
        // console.log'It\'s saved! in same location.');
    });


};

// get the list of files
exports.getFile = (file) => {

    fs.ensureDirSync(filesDir);
    const filePath = path.resolve(filesDir, file.path);

    if (fs.existsSync(filePath))
        return fs.readFile(filePath, file.encoding);

};



/****************************/

exports.createFile = (file) => {
    fs.ensureDirSync(filesDir);

    const filePath = path.resolve(filesDir, file.name);
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, file.data, file.encode, function (err) {
            if (err) throw err;
            // console.log'It\'s saved! in same location.');
        });
    }
    const fileStats = fs.statSync(filePath);

    return {
        name: path.basename(file.name.split('.')[0]),
        path: filePath,
        extension: path.extname(file.name).toLowerCase(),
        size: Number(fileStats.size / 1000).toFixed(1), // kb
    };
}

// add File
exports.addFile = (file) => {

    // fs.createFileSync()
    // ensure `appDir` exists
    fs.ensureDirSync(filesDir);
    const filePath = path.resolve(filesDir, file.name);
    if (!fs.existsSync(filePath)) {
        fs.copyFileSync(file.path, filePath);
    }
    // const file = fs.readdirSync(filePath);
}

// add files
exports.addFiles = (files = []) => {

    // ensure `appDir` exists
    fs.ensureDirSync(filesDir);

    // copy `files` recursively (ignore duplicate file names)
    files.forEach(file => {
        const filePath = path.resolve(filesDir, file.name);

        if (!fs.existsSync(filePath)) {
            fs.copyFileSync(file.path, filePath);
        }
    });

    // display notification
    notification.filesAdded(files.length);
};

// delete a file
exports.deleteFile = async (filename) => {
    fs.ensureDirSync(filesDir);

    const filePath = path.resolve(filename);
    const _path = path.dirname(filename);
    // remove file from the file system
    if (fs.existsSync(filePath) && _path == filesDir)
        return fs.removeSync(filePath);
};

// delete a file
exports.deletePack = async (packname) => {
    fs.ensureDirSync(packDir);

    const filePath = path.resolve(packname);
    const _path = path.dirname(packname);
    // remove file from the file system
    if (fs.existsSync(filePath) && _path == packDir)
        return fs.removeSync(filePath);

};

// delete a folder
exports.deleteFolder = (foldername) => {
    const folderPath = path.resolve(appDir, foldername);

    fs.rmdirSync(folderPath, { recursive: true }, (err) => {
        if (err) {
            // console.logerr);
        } else {
            // console.log"directory deleted successfully");
        }
    })

};

// open a file
exports.openFile = (filename) => {
    const filePath = path.resolve(appDir, filename);

    // open a file using default application
    if (fs.existsSync(filePath)) {
        try {
            open(filePath);

            // var watcher = chokidar.watch(filePath, { persistent: true });

            // watcher.on('all', async (e, filePath) => {
            // console.loge,filePath);
            // `[${new Date().toLocaleString()}] ${filePath} has been updated.`
            //   );

            // Get update content of file, in this case is one line
            // var updateContent = await readLastLines.read(filePath, 1);

            // emit an event when the file has been updated
            // this.emit('file-updated', { message: updateContent });
            // });
        } catch (error) {
            // console.logerror);
        }
    }
};

exports.selectImage = async (request) => {
    let props = ['openFile', 'dontAddToRecent', 'promptToCreate'];

    console.log(request);
    if (request.multiple)
        props.push('multiSelections');

    const file = await dialog.showOpenDialog({ properties: props, filters: [{ name: 'Images', extensions: ['png', 'jpg'] }] })

    if (file.canceled)
        return undefined;

    return file.filePaths;


};

// select a file
exports.selectFile = async (filters) => {
    const file = await dialog.showOpenDialog({ properties: ['openFile', 'dontAddToRecent', 'promptToCreate'], filters: filters || [] })

    if (file.canceled)
        return null;

    const fileStats = fs.statSync(file.filePaths[0]);

    return {
        name: path.basename(file.filePaths[0].split('.')[0]),
        path: file.filePaths[0],
        extension: path.extname(file.filePaths[0]).toLowerCase(),
        size: Number(fileStats.size / 1000).toFixed(1), // kb
    };
};

/*-----*/

// watch files from the application's storage directory
exports.watchFiles = (win) => {
    // chokidar.watch(appDir).on('unlink', (filepath) => {
    //     win.webContents.send('app:delete-file', path.parse(filepath).base);
    // });
}