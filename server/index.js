require('dotenv').config();

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var watson = require('watson-developer-cloud');
var cors = require('cors');
var multer = require('multer');
var distance = require('gps-distance');
var fs = require('fs-extra');
var context;

var userList = [];

var parser = require('body-parser');


let upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, callback) => {
            let type = req.params.type;
            let path = `./uploads/${type}`;
            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: (req, file, callback) => {
            //originalname is the uploaded file's name with extn
            callback(null, file.originalname);
        }
    })
});


// cloudant DB connect
var nano = require('nano')('https://c922e2ed-ef74-4570-9620-6d13f536828e-bluemix:1593b6de42d311b31e81946cd364363c93a10c06af1b05482ee53406859e0686@c922e2ed-ef74-4570-9620-6d13f536828e-bluemix.cloudant.com');

app.use(parser.json());
app.use(cors());


var assistant = new watson.AssistantV1({
    username: process.env.username,
    password: process.env.password,
    version: process.env.version
});


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});


// socket.io Chat Code
io.on('connection', function (socket) {

    var user = {
        socketId: socket.conn.id,
        socketData: socket.handshake.time
    };


    var message = {
        type: 'default',
        text: '',
        option: '',
        pType: ''
    };

    console.log('a user connected : ' + user.socketId);

    // user login info
    socket.on("enter", function (msg) {
        var userInfo = {
            socketId: socket.conn.id,
            name: msg.name,
            blood: msg.blood,
            age: msg.age,
            gender: msg.gender,
            lat: msg.lat,
            lng: msg.lng,
            context: msg.context
        };

        userList.push(userInfo);
        //   console.log("userList", userList);
        console.log('userList Add');
    })


    // Message receive by client
    socket.on('message', function (msg) {

        //console.log('client Msg'+ ' : '+msg);

        for (var i = 0; i < userList.length; i++) {
            if (socket.conn.id == userList[i].socketId) {
                var num = i;
                assistant.message({
                    workspace_id: process.env.workspace_id,
                    context: userList[num].context,
                    input: {
                        'text': msg
                    }
                }, function (err, res) {
                    if (err)
                        console.log('error:', err);
                    else {
                        userList[num].context = res.context;

                        console.log(res.context);


                        if (res.output.generic[0].title) {
                            message.text = res.output.generic[0].title;
                            message.option = res.output.generic[0].options;
                        }

                        else {
                            message.text = res.output.generic[0].text;
                            if (res.output.generic[1]) {
                                if (res.output.generic[1].options) {
                                    message.text = message.text + res.output.generic[1].title;
                                    message.option = res.output.generic[1].options;
                                }
                            }
                        }

                        console.log(msg);

                        if (message.text) {
                            if (message.text.toString().includes('Advisory')) {
                                message.type = 'preview';
                            }
                            else if (message.text.toString().includes('the shelter')) {
                                message.type = 'map';
                            }
                            else if (message.text.toString().includes('article')) {
                                message.type = 'article';
                            }
                            else if (message.text.toString().includes('detailed explanation')) {
                                message.type = 'imageList';
                                if (msg.includes('driving a car')) {
                                    message.pType = 'driving';
                                }
                                else if (msg.includes('no table')) {
                                    message.pType = 'noTable';
                                }
                                else if (msg.includes('home with the')) {
                                    message.pType = 'withChild';
                                }
                                else if (msg.includes('watching a')) {
                                    message.pType = 'theater';
                                }
                                else if (msg.includes('alone')) {
                                    message.pType = 'homeAlone';
                                }
                                else if (msg.includes('shower')) {
                                    message.pType = 'shower';
                                }
                                else if (msg.includes('ocean')) {
                                    message.pType = 'oceanInfo';
                                }

                            }
                            else if (message.text.toString().includes('before an disaster')) {
                                message.type = 'imageList';
                                if (msg.includes('emergency cases')) {
                                    message.pType = 'prepareD';
                                }
                            }
                            else if (message.text.toString().includes('after an earthquake')) {
                                message.type = 'imageList';
                                if (msg.includes('earthquake stopped')) {
                                    message.pType = 'afterD';
                                }
                            }

                        }

                        socket.emit('message', message);

                        message.type = 'default';
                        message.option = null;
                    }
                });
            }
        }


    });

    socket.on('disconnect', function () {
        for (var i = 0; i < userList.length; i++) {
            if (socket.conn.id == userList[i].socketId) {
                console.log('a user disconnected : ' + socket.conn.id);
                userList.splice(i);
            }
        }
    });
});


// userImage Upload
app.post('/upload/:type', upload.single('photo'), function (req, res) {
    var d = new Date().toLocaleString();
    var info = {
        path: req.file.path,
        time: d,
        name: req.body.name,
        lat: req.body.lat,
        lng: req.body.lng,
        help: req.body.help
    };

    var user = nano.use('userimage');

    user.insert(info, function (err, body) {
        if (err) {
            console.log('에러');
        }
        else {
            res.json(1);
            // console.log(info);
        }
    });
    console.log('file Save');
});

// userImage Download
app.get('/uploads/user/:name', function (req, res) {
    var filePath = '/uploads/user';
    // console.log(req.params.name);
    var fileName = req.params.name;
    //
    var file = __dirname + filePath + '/' + fileName;
    res.download(file);
});


// input ShelInfo
app.post('/inputShel', function (req, res) {
    var shelter = nano.use('shelter');

    shelter.insert(req.body, function (err, body) {
        if (err) {
            console.log('에러');
        }
    });
    res.send(req.body);
});


// print Shelter List
app.get('/listShel', function (req, res) {
    var shelter = nano.use('shelter');
    shelter.list({include_docs: true}, function (err, body) {
        var dataArr = [];
        body.rows.forEach(function (db) {
            var data = {
                name: db.doc.name,
                x: db.doc.x,
                y: db.doc.y,
                differ: distance(37.528292, 127.117533, db.doc.x, db.doc.y)
            };
            dataArr.push(data);
        });
        // console.log(dataArr);

        var maxNum, num;

        for (var i = 0; i < dataArr.length; i++) {
            if (!maxNum) {
                maxNum = dataArr[i].differ;
                num = i;
            }
            if (maxNum > dataArr[i].differ) {
                maxNum = dataArr[i];
                num = i;
            }
        }
        res.send(dataArr[num]);
    });
});

// send GPS, print nearby Shelter
app.post('/closeShel', function (req, res) {
    var shelter = nano.use('shelter');
    shelter.list({include_docs: true}, function (err, body) {
        var dataArr = [];
        body.rows.forEach(function (db) {
            var data = {
                name: db.doc.name,
                x: db.doc.x,
                y: db.doc.y,
                differ: distance(req.body.x, req.body.y, db.doc.x, db.doc.y)
            };
            dataArr.push(data);
        });
        // console.log(dataArr);

        var maxNum, num;

        for (var i = 0; i < dataArr.length; i++) {
            if (!maxNum) {
                maxNum = dataArr[i].differ;
                num = i;
            }
            if (maxNum > dataArr[i].differ) {
                maxNum = dataArr[i];
                num = i;
            }
        }
        res.send(dataArr[num]);
    });
    // console.log(req.body)
});


// print userImage as json type
app.get('/listPhoto', function (req, res) {
    var userphoto = nano.use('userimage');
    var dataArr = [];
    userphoto.list({include_docs: true}, function (err, body) {
        body.rows.forEach((db) =>
            dataArr.push(db.doc));
        res.send(dataArr);
    });
});


// print userImage by ID
app.get('/detail/:id', function (req, res) {
    console.log(req.params);
    var userphoto = nano.use('userimage');

    userphoto.get(req.params.id, function (err, body) {
        res.send(body);
    });
});

// Show multiple shelters within a specific distance
app.post('/closeShelList', function (req, res) {
    var shelter = nano.use('shelter');
    shelter.list({include_docs: true}, function (err, body) {
        var dataArr = [];
        body.rows.forEach(function (db) {
            var data = {
                name: db.doc.name,
                x: db.doc.x,
                y: db.doc.y,
                differ: distance(req.body.x, req.body.y, db.doc.x, db.doc.y)
            };
            if (data.differ < 10) {
                dataArr.push(data);
            }
        });
        console.log(dataArr);

        res.send(dataArr);
    });
    // console.log(req.body)
});


// print newsPreview example
app.get('/newsPreview', function (req, res) {
    var newsPreviewList = [];

    var info1 = {
        type: 'newsPreview',
        title: 'Earthquake: 4.4 quake strikes Inland',
        content: 'This information comes from the USGS Earthquake Notification Service and this post was created '
    };
    var info2 = {
        type: 'newsPreview',
        title: '2.6 earthquake shakes near Concord',
        content: 'CONCORD (KRON) - A 2.6 magnitude earthquake has struck near Concord on Tuesday afternoon, according'
    };
    var info3 = {
        type: 'newsPreview',
        title: 'Death Toll From Indonesia Earthquake Passes 43',
        content: 'An earthquake expected in Istanbul may claim the lives of 26,000 to 30,000 people...'
    };

    newsPreviewList.push(info1);
    newsPreviewList.push(info2);
    newsPreviewList.push(info3);

    res.send(newsPreviewList);
});


// print connect user list
app.get('/userList', function (req, res) {
    res.json(userList);
});


// Image Preview save
app.post('/imagePreview/:type', upload.single('image'), function (req, res) {
    var info = {
        path: req.file.path,
        situation: req.body.situation,
        imageNum: req.body.imageNum,
    };

    var user = nano.use('imagelist');

    user.insert(info, function (err, body) {
        if (err) {
            console.log('error');
        }
        else {
            res.json(1);
            // console.log(info);
        }
    });
    console.log('file save');
});

// Image Preview download
app.get('/uploads/preview/:name', function (req, res) {
    var filePath = '/uploads/preview';
    // console.log(req.params.name);
    var fileName = req.params.name;
    //
    var file = __dirname + filePath + '/' + fileName;
    res.download(file);
});

///

// News Preview save
app.post('/newsPreview/:type', upload.single('newsImage'), function (req, res) {
    var info = {
        path: req.file.path,
        title: req.body.title,
        content: req.body.content,
    };

    var user = nano.use('imagelist');

    user.insert(info, function (err, body) {
        if (err) {
            console.log('error');
        }
        else {
            res.json(1);
            // console.log(info);
        }
    });
    console.log('file save');
});

// News Preview download
app.get('/uploads/preview/:name', function (req, res) {
    var filePath = '/uploads/preview';
    // console.log(req.params.name);
    var fileName = req.params.name;
    //
    var file = __dirname + filePath + '/' + fileName;
    res.download(file);
});


// listen 8080 PORT
http.listen(8080, function () {
    console.log('listening on *:8080');
});