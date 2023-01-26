const app = require('express')();
const express = require('express');
const multipartMiddleware = require('connect-multiparty')();
const bodyParser = require('body-parser');
const db = require('./sql.js');
const getbook = require('./getbook.js');
const fs = require("fs");
const path = require("path");
const os = require('os');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/server/book", express.static('book'));
app.use("/index", express.static('../page'));

app.all('*', function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin','*');
    // res.setHeader("Content-Type", "application/json;charset=utf-8"); 
    next();
});

app.get('/', function(req, res){
    res.redirect(302, '/index/');
})

app.post('/api', multipartMiddleware, function (req, res) {
   res.send("test")
});

app.post('/api/getIp', function(req, res){
    let iplist = [];
    let ifaces = os.networkInterfaces();
    for (var dev in ifaces) {
        ifaces[dev].forEach(function(details, alias){
            if (details.family == 'IPv4') {
                iplist.push(details.address);
            }
        });
    }
    res.json(iplist);
})

app.post('/api/booklist', multipartMiddleware, function (req, res) {
    let page = req.body.page;
    if (page==null){page=0};
    page = (Number(page)-1)*20;

    db.database.all("select count(bid) from book", function(err, num){
        if (err){
            console.log("Select Error", err.message);
        }else{
            db.database.all("select * from book order by time desc limit "+page+",20", function(err, rows){
                if (err){
                    console.log("Select Error", err.message);
                    res.json({"booklist":[], "num":num[0]['count(bid)']});
                }else{
                    res.json({"booklist":rows, "num":num[0]['count(bid)']});
                }
            })
        }
    })
});

app.post('/api/getBookInfo', multipartMiddleware, function (req, res) {
    let bid = req.body.bid;
    if (bid==undefined){res.json({"status":"err"});return;}
    db.database.all(`select * from book where \`bid\`='${bid}'`, function(err, rows){
        if (err){
            console.log("Select Error", err.message);
            res.json({"status":"err"})
        }else{
            res.json(rows[0]);
        }
    })
});

app.post('/api/getBookRead', multipartMiddleware, function (req, res) {
    let bid = req.body.bid;
    if (bid==undefined){res.json({"status":"err"});return;}
    
    let FileMap = {};
    let FileList = fs.readdirSync(`./server/book/db/${bid}/`);
    for (let i in FileList){
        let is = FileList[i].split(".");
        FileMap[is[0]]=is[1];
    }
    FileMap['len']=FileList.length;

    res.json(FileMap);
});

app.post('/api/addNhentai', multipartMiddleware, function (req, res) {
    let url = req.body.url;
    if (url != ""){
        getbook.getNhentai(url);
        res.json({"status":"ok"});
    }else{
        res.json({"status":"error"});
    };
    
});

app.listen(8086, () => {
    console.log("Start Server...")
})
