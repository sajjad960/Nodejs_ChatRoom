import React from 'react'
import { Link } from 'react-router-dom'
import Room from './Room'

const RoomList = ({ rooms }) => {
    return (
        <div>
            {rooms && rooms.map(room => (
            <div>
                <Link to={'/chat/'+room._id+'/'+room.name}>
                 <Room key={room._id} name={room.name} />
                </Link>
            </div>
            ))}
        </div>
    )
}

export default RoomList
