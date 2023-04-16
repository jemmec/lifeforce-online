const koa = require("koa");
const app = new koa();
const httpServer = require("http").createServer(app.callback());
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:3000"
    }
});

const planeswalkers = [
    "Jace Beleren",
    "Liliana Vess",
    "Chandra Nalaar",
    "Ajani Goldmane",
    "Garruk Wildspeaker",
    "Elspeth Tirel",
    "Nicol Bolas",
    "Karn Liberated",
    "Teferi, Mage of Zhalfir",
    "Nissa Revane",
    "Koth of the Hammer",
    "Gideon Jura",
    "Sorin Markov",
    "Tamiyo, the Moon Sage",
    "Venser, the Sojourner",
    "Dack Fayden",
    "Ugin, the Spirit Dragon",
    "Sarkhan Vol",
    "Domri Rade",
    "Ashiok, Nightmare Weaver",
];

function p(log) {
    console.log(`Socket.io:${log} `);
}

function createSettings() {
    return {
        startingLife: 40,
    };
}

function createRoom(roomId) {
    return {
        id: roomId,
        users: [],
        settings: createSettings(),
    };
}

function createUser(id, host) {
    return {
        id: id,
        isHost: host,
        color: '#ff00ff',
        name: planeswalkers[Math.floor(Math.random() * planeswalkers.length)],
        life: 40,
    };
}

//meta-data
const rooms = [];

io.on("connection", socket => {
    //Socket connection event
    p(`Socket connected ${socket.id}`)

    //builtin events

    socket.on('disconnect', (reason) => {
        if (socket.rooms.length > 1) {
            //handle leave room
        }
    });

    socket.conn.on("close", (reason) => {
        if (socket.rooms.length > 1) {
            //handle leave room
        }
    });

    socket.on("error", (err) => {
        p(`Socket error: ${err}`);
    });

    //Room / User event
    socket.on('new_room', (roomId, callback) => {
        socket.join(roomId);
        //Add user to room (as host)
        const user = createUser(socket.id, true);
        const room = createRoom(roomId);
        room.users.push(user);
        rooms.push(room);
        p(`Room created ${room.id}`);
        callback(room);
    });

    socket.on("join_room", (roomId, callback) => {
        //get the room from the list
        const room = rooms.find(x => x.id === roomId);
        if (room) {
            //join the room
            socket.join(room.id);
            //Add user to room (non-host)
            const user = createUser(socket.id, false);
            room.users.push(user);
            //broadcast joined_room to all
            io.to(room.id).emit('joined_room', room, user);
            callback(room);
        }
        else {
            //Throw 404 room not found error
        }
    });

    socket.on('leave_room', (roomId, callback) => {
        const room = rooms.find(x => x.id === roomId);
        if (room) {
            socket.leave(room.id);
            //remove me from the room
            const user = room.users.find(x => x.id === socket.id);
            const index = room.users.indexOf(user);
            room.users.splice(index, 1);
            //if there is no more users in the room, terminate room
            if (room.users.length > 0) {
                //If the user who left was host, pass host to next user
                if (user.isHost) {
                    const newHost = room.users[0];
                    newHost.isHost = true;
                    room.users.splice(0, 1, newHost);
                }
                //broadcast left_room to all
                io.to(room.id).emit('left_room', room, user);
            } else {
                //teminate room
                p(`Room terminated ${room.id}`);
                const index = rooms.indexOf(room);
                rooms.splice(index, 1);
            }
            callback();
        } else {
            //Throw not in room error
        }
    });

    socket.on('update_settings', (settings, callback) => {

    });

    //User

    socket.on('update_user', (user, callback) => {


    });

    //Game Events

    socket.on('start', (callback) => {



    });




});

httpServer.listen(3001);

p("Running server at http://localhost:3001/");

//Middle-ware

//TODO: Allow connections from specific origins only

const passphrase = "swordfish";
//Ensure the socket is connecting wiht the correct passphrase
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    token === passphrase ?
        next() : next(Error("Incorrect passphrase used."));
});

