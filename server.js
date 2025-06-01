const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.static(__dirname));

let clickCount = 0;

io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Send current count to new users
    socket.emit('updateCount', clickCount);

    socket.on('cookieClick', () => {
        clickCount++;
        io.emit('updateCount', clickCount);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
