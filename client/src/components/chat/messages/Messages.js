import React from 'react'
import Message from '../message/Message';
import STB from 'react-scroll-to-bottom'
import './Message.css'

const Messages = ({messages, user_id}) => {
    console.log(messages);
    return (
        <STB className='messages'>
            {/* Message {user_id} */}
            {messages.map(message =>
                (
                    <Message key={message._id} messsage={message} current_uid={user_id}/>
                )
            )}
        </STB>
    )
}

export default Messages
