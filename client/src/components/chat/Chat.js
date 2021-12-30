import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { Link, useParams } from 'react-router-dom';
import io from 'socket.io-client'
import Messages from './messages/Messages';
import Input from './input/Input'
import './Chat.css'
let socket;

const Chat = () => {
    const { user, setUser } = useContext(UserContext)
    const {room_id, room_name} = useParams()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])

    const ENDPT = 'localhost:5000';
    useEffect(() => {
        socket = io(ENDPT)
        
            console.log('I am calling');
            if(!user) {
                return alert('No user available')
            }
            socket.emit('join', {name: user.name, room_id, user_id: user._id})
        
    }, []);

    useEffect(() => {
      socket.on('message', message => {
          setMessages([...messages, message])
      })
    }, [messages])

    const sendMessage = e => {
        e.preventDefault();

        if(message) {
            console.log(message);
            socket.emit('sendMessage', message, room_id)
            setMessage('')
        }
    }

    return (
        <div className='outerContainer'>
            {/* <div>{room_id}, {room_name}</div>
            <h1>Chat {JSON.stringify(user)}</h1> */} 
          <div className="container">

            <Messages messages={messages} user_id={user._id}/>
            <Input message={message}
             setMessage={setMessage}
             sendMessage={sendMessage} />
          </div>
        </div>
    )
}

export default Chat
