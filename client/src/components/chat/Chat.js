import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { Link, Redirect, useParams } from 'react-router-dom';
import io from 'socket.io-client'
import Messages from './messages/Messages';
import Input from './input/Input'
import './Chat.css'
import { hostAddress } from '../../utils/helpers';
let socket;

const Chat = () => {
    const { user, setUser } = useContext(UserContext)
    const {room_id, room_name} = useParams()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])


    const ENDPT = 'localhost:5000';
    useEffect(() => {
        const getingMessage =async () => {
            try {
                const res = await fetch(`${hostAddress}/messages/${room_id}`, {
                  method: 'GET',
                  credentials: 'same-origin',
                  // body: JSON.stringify({token}),
                  headers: { 'Content-Type': 'application/json'
                }});
                const data = await res.json();
                if(data.messages) {
                    setMessages(data.messages)
                }
              } catch (error) {
                  
                console.log(error)
              }
        }

       
        getingMessage()
       
    }, [room_id])

    useEffect(() => {
        socket = io(ENDPT)
        
            console.log('I am calling');
            if(!user) {
                return alert('Please login or Singup')
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
    if(!user) {
        return (
            <Redirect to='/'/>
        )
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
