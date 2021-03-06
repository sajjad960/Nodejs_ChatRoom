import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../UserContext';
import { Link } from 'react-router-dom';
import RoomList from './RoomList';
import { io } from "socket.io-client";
import { hostAddress } from '../../utils/helpers';
let socket;


const Home = () => {
    
    const ENDPT = 'api.chatroom.findsajjad.com';
    // useEffect(() => {
    //     socket = io.connect('localhost:10000', {secure: true});
    // }, [])
    useEffect(() => {
        socket = io("api.chatroom.findsajjad.com");

        return () => {
            socket.emit('disconnected');
            socket.off()
        }
    }, [ENDPT]);

    const { user, setUser } = useContext(UserContext);
    const [room, setRoom] = useState('')
    const [rooms, setRooms] = useState([])

    const handleSubmit = e => {
        e.preventDefault();
        socket.emit('create-room', room);
        console.log(room);
        setRoom('')

    }
    useEffect(() => {
        socket.on('output-rooms', rooms => {
            setRooms(rooms)
        })
    }, [])
    
    useEffect(() => {
        socket.on('room-created', room => {
            setRooms([...rooms, room])
        })
    }, [rooms])
    // const rooms = [
    //     {
    //         name: 'room1',
    //         _id: '123'
    //     },
    //     {
    //         name: 'room2',
    //         _id: '456'
    //     }
    // ]
    // const setAsJohn = () => {
    //     const john = {
    //         name: 'John',
    //         email: 'john@email.com',
    //         password: '123',
    //         id: '123'
    //     }
    //     setUser(john);
    // }
    // const setAsTom = () => {
    //     const tom = {
    //         name: 'Tom',
    //         email: 'tom@email.com',
    //         password: '456',
    //         id: '456'
    //     }
    //     setUser(tom);
    // }
    return (
        <div>
            <div className="row">
                <div className="col s12 m6">
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">Welcome {user ? user.name : ''}</span>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="input-field col s12">
                                        <input
                                            placeholder="Enter a room name"
                                            id="room" type="text" value={room} onChange={e => setRoom(e.target.value)} className="validate" />
                                        <label htmlFor="room">Room</label>
                                    </div>
                                </div>
                                <button className="btn">Create Room</button>
                            </form>
                        </div>
                        <div className="card-action">
                            {/* <a href="#" onClick={setAsJohn}>set as John</a>
                            <a href="#" onClick={setAsTom}>set as Tom</a> */}
                        </div>
                    </div>
                </div>
                <div className="col s6 m5 offset-1">
                    <RoomList rooms={rooms} />
                </div>
            </div>

            <Link to={'/chat'}>
                <button>go to chat</button>
            </Link>
        </div>
    )
}

export default Home
