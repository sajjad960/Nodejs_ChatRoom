import React from 'react'
import './Input.css'

const Input = ({message, setMessage, sendMessage}) => {
    return (
        <div>
            <form action="" onSubmit={sendMessage} className='form'>
                <input type="text" value={message} className='input' placeholder='Type message here'
                onChange={event => setMessage(event.target.value)} onKeyPress={e => e.key === 'Enter'? sendMessage(e) : null} />

                <button className='sendButton'>Send Message</button>
            </form>
        </div>
    )
}

export default Input
