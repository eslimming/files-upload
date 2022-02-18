const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const _ = require('lodash');

const app = express();

// enable files upload
app.use(fileUpload({
    createParentPath: true,
    limits: {
        fileSize: 2 * 1024 * 1024 * 1024 //2MB max file(s) size
    },
}));

//add other middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

// upoad single file
app.post('/upload', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
            let file = req.files.file;

            //Use the mv() method to place the file in upload directory (i.e. "uploads")
            file.mv('./uploads/' + file.name);

            //send response
            res.send({
                status: true,
                message: 'File is uploaded',
                data: {
                    name: file.name,
                    mimetype: file.mimetype,
                    size: file.size
                }
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/leerTags/:file', async (req, res) => {
    try {
        var file = req.params.file
        var data = require("fs").readFileSync("./uploads/" + file, "utf8")
        data = data.split("\r\n")[0].split(",").slice(1)
        res.send({
            status: true,
            file: file,
            tags: data
        });


        // var stream = require("fs").createReadStream("./uploads/MiCSV.csv")
        // var reader = require("readline").createInterface({ input: stream })
        // var arr = []
        // reader.on("line", (row) => { arr.push(row.split(",")) })
        // res.send({
        //     status: true,
        //     message: reader
        // });


    } catch (err) {
        res.status(500).send(err);
    }
});


app.get('/fastCSV/:file', async (req, res) => {
    const file = req.params.file
    const csv = require('csv-parser')
    const fs = require('fs')
    try {
        try {
            fs.createReadStream('./uploads/' + file)
                .pipe(csv())
                .on('error', function (error) {
                    source.destroy();
                    console.log('csv error');
                })
                .on('headers', (headers) => {
                    res.send({
                        file: file,
                        tags: headers.slice(1)
                    });
                })

        } catch {
            res.status(500).send([]);
        }


    } catch {
        res.status(500).send('error');

    }
});

<<<<<<< HEAD
=======

>>>>>>> 0f79574ac9c782a261f6cfa519f705da83b75df9



//*****************************************/
// upload multiple files
app.post('/upload-photos', async (req, res) => {
    try {
        if (!req.files) {
            res.send({
                status: false,
                message: 'No file uploaded'
            });
        } else {
            let data = [];

            //loop all files
            _.forEach(_.keysIn(req.files.photos), (key) => {
                let photo = req.files.photos[key];

                //move photo to upload directory
                photo.mv('./uploads/' + photo.name);

                //push file details
                data.push({
                    name: photo.name,
                    mimetype: photo.mimetype,
                    size: photo.size
                });
            });

            //return response
            res.send({
                status: true,
                message: 'Files are uploaded',
                data: data
            });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//make uploads directory static
app.use(express.static('uploads'));

//start app 
const port = process.env.PORT || 3000;

app.listen(port, () =>
    console.log(`App is listening on port ${port}.`)
);