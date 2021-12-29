import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { Link, useParams } from 'react-router-dom';
import io from 'socket.io-client'
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
            socket.emit('join', {name: user.name, room_id, user_id: user.id})
        
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
        <div>
            <div>{room_id}, {room_name}</div>
            <h1>Chat {JSON.stringify(user)}</h1>
            <pre>{JSON.stringify(messages,null, '\t')}</pre>
            <form action="" onSubmit={sendMessage}>
                <input type="text" value={message} onChange={event => setMessage(event.target.value)} onKeyPress={e => e.key === 'Enter'? sendMessage(e) : null} />

                <button>Send Message</button>
            </form>
        </div>
    )
}

export default Chat
