const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '.jpeg');
    },
});

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb({ message: 'Not an image! Please upload only images.' }, false);
    }
};

const uploadPhotos = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fieldSize: 5000000 },
});

const productResizePhotos = async (req, res, next) => {
    if (!req.files) {
        return next();
    }

    await Promise.all(req.files.map(async (file) => {
        try {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`/public/images/products/${file.filename}`);

            // Delete the original file after processing
            await fs.unlink(file.path);
            fs.unlink(multerStorage.destination + '/' + file.filename, (err) => {
                if (err) throw err;
                console.log('successfully deleted ' + file.filename);
            });
        } catch (error) {
            console.error('Error processing file:', error);
        }
    }));

    next();
};

const blogResizePhotos = async (req, res, next) => {
    if (!req.files) {
        return next();
    }

    await Promise.all(req.files.map(async (file) => {
        try {
            await sharp(file.path)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(`/public/images/blogs/${file.filename}`);

            // Delete the original file after processing
            await fs.unlink(file.path);
            fs.unlink(multerStorage.destination + '/' + file.filename, (err) => {
                if (err) throw err;
                console.log('successfully deleted ' + file.filename);
            });
        } catch (error) {
            console.error('Error processing file:', error);
        }
    }));

    next();
};

module.exports = { uploadPhotos, productResizePhotos, blogResizePhotos };

