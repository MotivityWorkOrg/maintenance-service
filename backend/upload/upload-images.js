let multer = require('multer');
let imagePath = '../images/profile/';

let storage = multer.diskStorage({ //multers disk storage settings
    destination: function (req, file, cb) {
        cb(null, imagePath);
    },
    filename: function (req, file, cb) {
        let dateTimeStamp = Date.now();
        cb(null, file.fieldname + '-' + dateTimeStamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
    }
});

module.exports = {
    imageUpload: function (req, res) {
        console.log(' Coming here ');
        multer({ //multer settings
            storage: storage
        }).single('photo');
    }
};