const {Router} = require('express')
const messageController = require('../controllers/messageController')

const router = Router();
router.get('/messages/:room_id', messageController.getMessages)

module.exports = router