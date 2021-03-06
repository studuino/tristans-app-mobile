#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var filestocopy = [{
    "resources/android/notification-icons/drawable-hdpi/ic_stat_onesignal_default.png":
        "platforms/android/app/src/main/res/drawable-hdpi/ic_stat_onesignal_default.png"
}, {
    "resources/android/notification-icons/drawable-mdpi/ic_stat_onesignal_default.png":
        "platforms/android/app/src/main/res/drawable-mdpi/ic_stat_onesignal_default.png"
}, {
    "resources/android/notification-icons/drawable-xhdpi/ic_stat_onesignal_default.png":
        "platforms/android/app/src/main/res/drawable-xhdpi/ic_stat_onesignal_default.png"
}, {
    "resources/android/notification-icons/drawable-xxhdpi/ic_stat_onesignal_default.png":
        "platforms/android/app/src/main/res/drawable-xxhdpi/ic_stat_onesignal_default.png"
}, {
    "resources/android/notification-icons/drawable-xxxhdpi/ic_stat_onesignal_default.png":
        "platforms/android/app/src/main/res/drawable-xxxhdpi/ic_stat_onesignal_default.png"
} ];

module.exports = function(context) {

    // no need to configure below
    var rootdir = context.opts.projectRoot;

    filestocopy.forEach(function(obj) {
        Object.keys(obj).forEach(function(key) {
            var val = obj[key];
            var srcfile = path.join(rootdir, key);
            var destfile = path.join(rootdir, val);
            console.log("copying "+srcfile+" to "+destfile);
            var destdir = path.dirname(destfile);
            if (fs.existsSync(srcfile) && fs.existsSync(destdir)) {
                fs.createReadStream(srcfile).pipe(
                    fs.createWriteStream(destfile));
            }
        });
    });

};
