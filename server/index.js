const express = require('express');
const mongoose = require('mongoose')
const app = express();
const cookieParser = require('cookie-parser')
const cors = require('cors')

//env
const dotenv = require('dotenv') 
dotenv.config({ path: "./config.env"})

//cors
app.use(cors({
  credentials: 'include',
  origin: '*'
}));



// routes connection
const authRoutes = require('./routes/authRoutes')
app.use(express.json())
app.use(authRoutes)
app.use(cookieParser())


// cookies area
app.get('/set-cookies', (req, res) => {
  res.cookie('username', 'Tony');
  res.cookie('isAuthenticated', true, { maxAge: 24 * 60 * 60 * 1000 });
  res.send('cookies are set');
})
app.get('/get-cookies', (req, res) => {
  const cookies = req.cookies;
  console.log(cookies);
  res.json(cookies);
})

const http = require('http');
const { addUser, getUser, removeUser } = require('./utils/helpers');
const Room = require('./models/Room');
const Message = require('./models/Message');
const server = http.createServer(app);
// const socketio = require("socket.io");
const io = require('socket.io')(server, { origins: '*:*'});

//connect mongoDB
mongoose.connect('mongodb://localhost:27017/chatroom').then(() => console.log("DB connection successful"))

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});



io.on('connection', (socket) => {
    console.log(socket.id);
    Room.find().then(result => {
      socket.emit('output-rooms', result)
    })
    socket.on('create-room', name => {
      // console.log(name);
      const room = new Room({name})
      room.save().then(result => {
        io.emit('room-created', result)
      })
    })

    socket.on('join', ({name, room_id, user_id}) => {
      console.log('i am calling server');
      const {error, user} = addUser({
        socket_id: socket.id,
        name,
        room_id,
        user_id

      })

      socket.join(room_id)

      if(error) {
        console.log('join error', error);
      } else {
        console.log('join user', user);
      }
    })

    socket.on('sendMessage', (message, room_id, callback) => {
      const user = getUser(socket.id);
      if(!user) return 'No user found'
      const msgToStore = {
        name: user.name,
        user_id: user.user_id,
        room_id,
        text: message
      }
      console.log('messsage', msgToStore);

      // for storing message (emmit send a request to frontend and add messages and show it)
      const msg = new Message(msgToStore)
      msg.save().then(result => {
        io.to(room_id).emit('message', result);
        // callback()
      })
    })

    socket.on('disconnect', () => {
      const user = removeUser(socket.id)
    })
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening port ${PORT}`);
});