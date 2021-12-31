const Message = require('../models/Message')

module.exports.getMessages = async(req, res) => {
    const room_id = req.params.room_id
    // console.log();
    try {
        const messages = await Message.find({room_id});

        res.status(200).json({
            messages
        })
        
    } catch (error) {

        const errMessage = 'something rong'
        res.status(400).json({ errMessage });
    }
}