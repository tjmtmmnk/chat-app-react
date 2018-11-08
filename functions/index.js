const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase);
const app = express();
app.use(cors);

exports.v1 = functions.https.onRequest(app);

function createChannel(cname) {
    let channles_ref = admin.database().ref('channels');
    let date1 = new Date();
    let date2 = new Date();
    date2.setSeconds(date2.getSeconds() + 1);

    const default_data = `{
        "message" : {
            "1" : {
            "body" : "Welcome to #${cname} channel!",
            "date" : "${date1.toJSON()}",
            "user" : {
                "avatar" : "",
                "id" : "robot",
                "name" : "Robot"
                }
            },
            "2" : {
            "body" : "Let's post first message!",
            "date" : "${date2.toJSON()}",
            "user" : {
                "avatar" : "",
                "id" : "robot",
                "name" : "Robot"
                }
            }
        }
    }`;
    channles_ref.child(cname).set((JSON.parse(default_data)));
}

// チャンネル作成
app.post('/channels', (req, res) => {
    let cname = req.body.cname;
    createChannel(cname);
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(201).json({result: 'ok'});
});

//メッセージ作成
app.post('/channels/:cname/messages', (req, res) => {
    let cname = req.params.cname;
    let message = {
        date: new Date().toJSON(),
        body: req.body.body,
        user: req.user
    };
    let message_ref = admin.database().ref(`channels/${cname}/messages`);
    message_ref.push(message);
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(201).send({result: 'ok'});
});

// チャンネル一覧取得
app.get('/channels', (req, res) => {
    let channel_ref = admin.database().ref('channels');
    channel_ref.once('value', function (snapshot) {
        let items = new Array();
        snapshot.forEach(function (childSnapshot) {
            let cname = childSnapshot.key;
            items.push(cname);
        });
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send({channels: items});
    });
});

// 日付順に最後からMAX20件のメッセージを取得
app.get('/channels/:cname/messages', (req, res) => {
    let cname = req.params.cname;
    let message_ref = admin.database().ref(`channels/${cname}/messages`).orderByChild('date').limitToLast(20);
    message_ref.once('value', function (snapshot) {
        let items = new Array();
        snapshot.forEach(function (childSnapshot) {
            let message = childSnapshot.val();
            message.id = childSnapshot.key;
            items.push(message);
        });
        items.reverse();
        res.header('Content-Type', 'application/json; charset=utf-8');
        res.send({messages: items});
    });
});

//初期状態に戻す
app.post('/reset', (req, res) => {
    createChannel('general');
    createChannel('random');
    res.header('Content-Type', 'application/json; charset=utf-8');
    res.status(201).send({result: "ok"});
});