const express = require('express');
const router = express.Router();
const cors = require('cors');
router.use(cors());
const Chat = require('../Models/WorldChat');

router.use(express.json());

router.put('/update-chat', async (req, res) => {
    const chat = await Chat.findOne();

    chat.chat.push(req.body.chat);
    await chat.save();
});
router.get('/get-chat',async (req,res)=>{
    const chat = await Chat.findOne();
    return res.send(chat);
})
router.post('/get-room-chat',async (req,res)=>{
    const chat = await Chat.findOne({roomName:req.body.roomName});
    return res.send(chat);
})
router.post('/room-chat',async (req,res)=>{
    let chat = await Chat.findOne({roomName:req.body.roomName});
    if(chat)
    {
        chat.chat.push(req.body.chat);
        await chat.save();
        return 
    }
        chat=new Chat({
            chat:req.body.chat,
            roomName:req.body.roomName,
            expiryAt:new Date(new Date().getTime() + 3600 * 1000)
        })
        await chat.save();

    return res.send(chat);
})

module.exports = router;
