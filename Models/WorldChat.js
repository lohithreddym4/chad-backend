const mongoose=require('mongoose')
const chat=mongoose.Schema({
    chat:{
        type:Array
    },
    roomName:{
        type:String
    }
})
module.exports=mongoose.model('world-chat',chat)