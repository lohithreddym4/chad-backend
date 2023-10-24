const io = require('socket.io')(4000,{
    cors: {
      origin: '*',
    },
  });
  const connectedSockets = new Set();
let Uname;
io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('user-joined',(name)=>{
    Uname=String(name).split(" ")[0]
    socket.broadcast.emit('user-success',Uname)
  });
  socket.on('user-joined-room',(name,room)=>{
    Uname=String(name).split(" ")[0]
    socket.broadcast.to(room).emit('user-success',Uname)
  });
  socket.on('user-left',(name,room)=>{
    Uname=String(name).split(" ")[0]
    socket.broadcast.to(room).emit('user-left',Uname)
  });
  socket.on('chat-message',(name,message,type,room)=>{
    socket.emit('world-chat')
      if(String(message).endsWith("undefined"))
      return
    io.emit('send-message',name+": "+message);
  })
  socket.on('world-chat',()=>{
    socket.emit('world-chat');
  })
  socket.on('scroll-message',(type,room)=>{
    if(type==="room")
    io.to(room).emit('chat-scroll');
  else{
    socket.emit('chat-scroll');
  }
  })
  socket.on('chat-room-message',(name,message,room)=>{
    socket.emit('room-chat')
    if(String(message).endsWith("undefined"))
    return
    io.to(room).emit('send-message',name+": "+message,"room");
  })
  socket.on('disconnect', () => {
    connectedSockets.delete(socket);
  });
  socket.on('leave-room',room=>{
    socket.leave(room);
  })
  socket.on('clear-chat',()=>{
    socket.emit('clear-all');
  })
  socket.on('room-join',room=>{
    socket.join(room);
    connectedSockets.add(socket);
  })
});