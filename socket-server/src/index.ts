import * as Koa from 'koa';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { Room, Settings, User } from './types';

const app = new Koa();
const httpServer = createServer(app.callback());
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

//Data

const passphrase = "swordfish";

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

const rooms: Room[] = [];

function p(log: string) {
  console.log(`Socket.io:${log} `);
}

io.on('connection', socket => {
  p(`Socket connected ${socket.id}`);

  socket.on('disconnect', (reason: string) => {
    if (socket.rooms.size > 1) {
      //handle leave room
    }
  });

  socket.conn.on("close", (reason: string) => {
    if (socket.rooms.size > 1) {
      //handle leave room
    }
  });

  socket.on("error", (err) => {
    p(`Socket error: ${err}`);
  });

  //Room / User event
  socket.on('new_room', (roomId: string, callback: any) => {
    socket.join(roomId);
    const user: User = new User(socket.id, true, '#fff', planeswalkers[Math.floor(Math.random() * planeswalkers.length)], 40);
    const room: Room = new Room(roomId, [], new Settings());
    room.users.push(user);
    rooms.push(room);
    p(`Room created ${room.id}`);
    callback(room);
  });

  socket.on("join_room", (roomId: string, callback: any) => {
    //get the room from the list
    const room = rooms.find(x => x.id === roomId);
    if (!room) return;
    //join the room
    socket.join(room.id);
    //Add user to room (non-host)
    const user: User = new User(socket.id, false, '#fff', planeswalkers[Math.floor(Math.random() * planeswalkers.length)], 40);
    room.users.push(user);
    //broadcast joined_room to all
    io.to(room.id).emit('joined_room', room, user);
    callback(room);
  });

  socket.on('leave_room', (roomId: string, callback: any) => {
    //Find the room
    const room = rooms.find(x => x.id === roomId);
    if (!room) return;
    //find the user
    const user = room.users.find(x => x.id === socket.id);
    if (!user) return;
    //leave the eroom
    socket.leave(room.id);
    const index = room.users.indexOf(user);
    room.users.splice(index, 1);
    //broadcast left_room to all
    io.to(room.id).emit('left_room', room, user);
    //if there is no more users in the room, terminate room
    if (room.users.length > 0) {
      //If the user who left was host, pass host to next user
      if (user.isHost) {
        const newHost = room.users[0];
        newHost.isHost = true;
        room.users.splice(0, 1, newHost);
      }
    } else {
      //teminate room
      p(`Room terminated ${room.id}`);
      const index = rooms.indexOf(room);
      rooms.splice(index, 1);
    }
    callback();
  });

  socket.on('update_settings', (settings: Settings, callback: any) => {

  });

  //User

  socket.on('update_user', (user: User, callback: any) => {

  });

  //Game Events

  socket.on('start', (callback: any) => {

  });
});

httpServer.listen(3001);

p("Running server at http://localhost:3001/");

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  token === passphrase ?
    next() : next(Error("Incorrect passphrase used."));
});