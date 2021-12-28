import React, { useContext, useEffect } from 'react';
import { UserContext } from '../../UserContext';
import { Link, useParams } from 'react-router-dom';
import io from 'socket.io-client'
let socket;

const Chat = () => {
    const { user, setUser } = useContext(UserContext)
    const {room_id, room_name} = useParams()

    const ENDPT = 'localhost:5000';
    useEffect(() => {
        socket = io(ENDPT)
        
            console.log('I am calling');
            if(!user) {
                return alert('No user available')
            }
            socket.emit('join', {name: user.name, room_id, user_id: user.id})
        
    }, []);

    return (
        <div>
            <div>{room_id}, {room_name}</div>
            <h1>Chat {JSON.stringify(user)}</h1>
            <Link to={'/'}>
                <button>go to home</button>
            </Link>
        </div>
    )
}

export default Chat
