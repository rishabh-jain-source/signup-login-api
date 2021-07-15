const express = require('express')
const path = require('path')
const app = express()
const http = require('http')
const socketio = require('socket.io')
const mongoose = require('mongoose')
const { User } = require('./model/User')
const { userRoute } = require('./routers/userRouter')
require('dotenv').config()
const port = process.env.PORT || 4069

const server = http.createServer(app)

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json());

const connection = mongoose.connect("mongodb+srv://rishabh-jain-source:Tushar@99RJ@cluster0.d8zjb.mongodb.net/MYDatabase?authSource=admin&replicaSet=atlas-dmz1ie-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })

    .then(() => { console.log("Database connected") })
    .catch((err) => { console.log(err) })

app.use('/', userRoute)

app.post("/signup", async (req, res) => {
    try {
        console.log(req.body)
        let myUser = await User.findOne({ email: req.body.email })
        if (myUser) {
            return res.status(500).send({ msg: "USER EXIST" })
        }
        console.log(req.body)
        const user = new User(req.body)
        console.log("USER", user)
        let check = await user.save()
        res.status(200).send({ msg: check })
    }
    catch (err) {
        res.status(500).send({ msg: err })
    }
})

const io = socketio(server)

let count = 0
// io.on('connection', (socket) => {
//     // socket.send("hell")
//     io.emit("count", ++count)
//     console.log("connected")
//     socket.on("countUpdate", (msg) => {
//         io.emit("count", msg)
//     })
// })
io.on('connection', (socket) => {
    console.log("connected")
    socket.broadcast.emit("welcome", "A user has joined")
    socket.on("msg", (data, msg) => {
        socket.broadcast.emit("print", data)
        msg("Delivered")
    })
    socket.on("disconnect", () => {
        io.emit("print", "A user has left")
    })
    socket.on("location", data => {
        socket.broadcast.emit("location", data)
    })
    socket.on('message', function (message) {
        console.log(message);
    });
})


server.listen(port, () => {
    console.log("Connected on port ", port)
})