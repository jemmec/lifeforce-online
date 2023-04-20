import * as Koa from 'koa';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { Room, Settings, RoomError, User } from './types';

const app = new Koa();
const httpServer = createServer(app.callback());
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

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
  "Teferi",
  "Nissa Revane",
  "Koth of the Hammer",
  "Gideon Jura",
  "Sorin Markov",
  "Tamiyo",
  "Venser",
  "Dack Fayden",
  "Ugin",
  "Sarkhan Vol",
  "Domri Rade",
  "Ashiok",
];

const colors = [
  "#F94144",
  "#F3722C",
  "#F8961E",
  "#F9C74F",
  "#90BE6D",
  "#43AA8B",
  "#577590",
  "#99657D"
];

function randomName(): string {
  return planeswalkers[Math.floor(Math.random() * planeswalkers.length)];
}

function randomColor(): string {
  return colors[Math.floor(Math.random() * colors.length)];
}

const rooms: Room[] = [];

function p(log: string) {
  console.log(`Socket.io: ${log}`);
}

function findRoom(roomId: string, onFound: (room: Room) => void) {

}


function leaveRoom(socket: Socket, roomId: string) {
  const room = rooms.find(x => x.id === roomId);
  if (!room) return;
  //find the user
  const user = room.users.find(x => x.id === socket.id);
  if (!user) return;
  //leave the room
  socket.leave(room.id);
  room.removeUser(user);
  //if there is no more users in the room, terminate room
  if (room.isEmpty()) {
    const index = rooms.indexOf(room);
    rooms.splice(index, 1);
    return;
  }
  //broadcast updated_room to all (not empty)
  io.to(room.id).emit('updated_room', room);
}

io.on('connection', socket => {

  p(`Socket connected ${socket.id}`);

  socket.on("disconnecting", () => {
    //handle leave room when a socket is disconnecting
    if (socket.rooms.size > 1) {
      //Note: sockts are always inside a room with their 'id'
      leaveRoom(socket, [...socket.rooms][1]);
    }
  });

  socket.on('disconnect', (reason: string) => {
    p(`Socket disconnect: ${reason}`);
  });

  socket.conn.on("close", (reason: string) => {
    p(`Socket close: ${reason}`);
  });

  socket.on("error", (err) => {
    p(`Socket error: ${err}`);
  });

  socket.on('new_room', (roomId: string, callback: any) => {
    socket.join(roomId);
    const room: Room = new Room(roomId, [], new Settings());
    room.addUser(
      new User(socket.id, true, randomColor(), randomName())
    );
    rooms.push(room);
    callback(room);
  });

  socket.on("join_room", (roomId: string, callback: any) => {
    //get the room from the list
    const room = rooms.find(x => x.id === roomId);
    if (!room) return;
    //Check to see if the room is full
    if (room.users.length === room.settings.seats) {
      //Emit error
      socket.emit('room_error', new RoomError(roomId, 403, "Sorry, there are no more seats left at the table."))
      //Return null
      callback(null);
      return;
    }
    //join the room
    socket.join(room.id);
    //Add user to room (non-host)
    const user = new User(socket.id, false, randomColor(), randomName());
    room.addUser(user);
    //broadcast joined_room to all
    io.to(room.id).emit('updated_room', room);
    callback(room);
  });

  socket.on('leave_room', (roomId: string, callback: any) => {
    leaveRoom(socket, roomId);
    callback();
  });

  socket.on('update_settings', (roomId: string, settings: Settings) => {
    const room = rooms.find(x => x.id === roomId);
    if (!room) return;
    room.updateSettings(settings);
    //Broadcast to all (but me) that settings have changed
    socket.to(room.id).emit('updated_settings', settings);
  });

  socket.on('update_user', (roomId: string, user: User) => {
    const room = rooms.find(x => x.id === roomId);
    if (!room) return;
    room.updateUser(user);
    //broadcast to all (but me) that user has updated
    socket.to(room.id).emit('updated_room', room);
  });

  socket.on('start_game', (roomId: string) => {
    const room = rooms.find(x => x.id === roomId);
    if (!room) return;
    //Start the game
    room.startGame();
    p(`Game has started in room ${room.id}`);
    io.to(room.id).emit('updated_room', room);
  });

  socket.on("end_game", (roomId: string) => {
    const room = rooms.find(x => x.id === roomId);
    if (!room) return;
    room.endGame();
    p(`Game has stopped in room ${room.id}`)
    io.to(room.id).emit('updated_room', room);
  });

  socket.on("reset_game", (roomId: string) => {
    const room = rooms.find(x => x.id === roomId);
    if (!room) return;
    room.resetGame();
    p(`Game has reset in room ${room.id}`)
    io.to(room.id).emit('updated_room', room);
  });

  socket.on('mod_life', (roomId: string, value: number) => {
    const room = rooms.find(x => x.id === roomId);
    if (!room) return;
    if (!room.gameState) return;
    //update game state
    room.gameState.modUserLife(socket.id, value);
    socket.to(room.id).emit('updated_gamestate', room.gameState);
  });

  socket.on('mod_other_life', (roomId: string, value: number) => {
    const room = rooms.find(x => x.id === roomId);
    if (!room) return;
    if (!room.gameState) return;
    //update game state
    room.gameState.modOtherLife(socket.id, value);
    io.to(room.id).emit('updated_gamestate', room.gameState);
  });

});

httpServer.listen(3001);

p("Running server at http://localhost:3001/");

//Middleware

io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  token === passphrase ?
    next() : next(Error("Incorrect passphrase used."));
});