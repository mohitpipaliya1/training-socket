var express=require('express');

var app=express();

var server=require('http').createServer(app);

var io=require('socket.io').listen(server);

users=[];
connections=[];


server.listen(process.env.PORT || 5000);

console.log("...SERVER RUNNING...");


app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});

io.sockets.on("connection",(socket)=>{

    
    connections.push(socket);
   // console.log("Live Connections: %s",connections.length);
    
    socket.on('send message',(data,x)=>{
        console.log(data);
        socket.to(socket.msg).emit('New Message',{msg:data,x});
        socket.emit('ownmassage',{msg:data,x:socket.username,y:socket.msg});
      
    });

   

    socket.on('New User',function (data,callback) {
        callback(true);
     //   roomName=data.name;
        socket.username=data.name;
        socket.room=data.name;
        socket.join(socket.room);
        users.push(socket.username);
      //  console.log(socket.room);
        socket.emit('joinmassage',{msg:'you conneted in '+socket.room});
            
        updateUsernames();
    });


    socket.on('joinroom',function(data){

        socket.msg=data.val;
        
    });
    

    
    function updateUsernames()
    {
        console.log(users);
        io.sockets.emit('Get Users', {temp:JSON.stringify(users)});
    }

    socket.on('disconnect',(data)=>{
        if(!socket.username) return;
        users.splice(users.indexOf(socket),1);
        connections.splice(connections.indexOf(socket),1);
      //  console.log("Live Connections: %s",connections.length);
    });
    
});