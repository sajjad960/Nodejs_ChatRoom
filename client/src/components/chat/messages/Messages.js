import React from 'react'

const Messages = ({messages, user_id}) => {
    console.log(messages);
    return (
        <div>
            Message {user_id}
            {messages.map(message =>
                (
                    <div key={message.id}>{message.text}</div>
                )
            )}
        </div>
    )
}

export default Messages
