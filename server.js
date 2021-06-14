'use strict'
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const axios = require('axios');
const mongoose = require('mongoose');
let server = express();
server.use(cors());
server.use(express.json());
mongoose.connect("mongodb://localhost:27017/digimon", {
    useNewUrlParser: true, useUnifiedTopology: true
});
const PORT = process.env.PORT;

var digiSchema = new mongoose.Schema({

    name: {
        name: String,
        img: String,
        level: String,
    }
});

// This creates our model from the above schema, using mongoose's model method
var digiModel = mongoose.model('digi', digiSchema);

class Digimon {
    constructor(data) {
        this.name = data.name;
        this.img = data.img;
        this.level = data.level;
    }
}
//Handlers
server.get('/', testHandler)
server.get('/digimon', digimonHandler)
server.post('/addFav', addToFav)
server.get('/getFav', getFavHandler)
server.delete('/delete/:id', deleteHandler)
server.put('/update/:id', updateHandler)

function testHandler(req, res) {
    res.send('Iam Alive');
}
// http://localhost:3001/digimon?level=Rookie
function digimonHandler(req, res) {
    let { level } = req.query;
    const url = `https://digimon-api.vercel.app/api/digimon?${level}`;
    axios.get(url).then(result => {
        console.log('dddddddddddddddddddd', result.data);
        const myArr = result.data.map(item => new Digimon(item))
        res.send(myArr)
    }
    )
}
function addToFav(req, res) {
    const { name, img, level } = req.body;
    let newData = new digiModel({
        name: name,
        img: img,
        level: level,

    })
    newData.save()
}
function getFavHandler(req, res) {
    digiModel.find({}, (err, data) => {
        res.send(data);
    }
    )
}
function deleteHandler(res, req) {
    const id = req.params.id;
    digiModel.deleteOne({ _id: id }, (err) => {
        digiModel.find({}, (err, data) => {
            res.send(data);
        })

    })
}
function updateHandler(req, res) {
    const id = req.params.id;
    const { name, img, level } = req.body;
    digiModel.findOne({ _id: id }, (err, data1) => {
        data1.name = name,
            data1.img = img,
            data1.level = level,
            data1.save().then(() => {
                digiModel.find({}, (err, data) => {
                    res.send(data);
                })
            })
    })

}
server.listen(PORT, function () {
    console.log(`run on  port ${PORT}`)
});