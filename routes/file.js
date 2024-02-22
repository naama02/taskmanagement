const router = require('express').Router();
const multer = require("multer");
const verifyToken = require('../utils/verifyToken');
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/eventFiles")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage
})

router.post('/upload/file', upload.single('eventFile'), verifyToken(['admin', 'user']), async (req, res) => {
    const fileUri = process.env.SERVER_URL + '/' + req.file.path.replace(/\\/g, '/').replace('public/', '');

    return res.send({ fileUri: fileUri })
});


module.exports = router;