const express = require('express');
const app = express();
const http = require('http');
const { addUser } = require('./utils/helpers');
const server = http.createServer(app);
// const socketio = require("socket.io");
const io = require('socket.io')(server, { origins: '*:*'});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});


io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('create-room', name => {
      console.log(name);
    })

    socket.on('join', ({name, room_id, user_id}) => {
      console.log('i am calling server');
      const {error, user} = addUser({
        socket_id: socket.id,
        name,
        room_id,
        user_id

      })

      if(error) {
        console.log('join error', error);
      } else {
        console.log('join user', user);
      }
    })
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server listening port ${PORT}`);
});