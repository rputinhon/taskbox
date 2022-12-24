const { Notification, nativeImage } = require('electron');

exports.default = (args) => {
    let icon = nativeImage.createFromDataURL(args.icon);
    const notif = {
        icon: icon,
        title: args.title,
        body: args.body,
    };
    new Notification(notif).show();
}

