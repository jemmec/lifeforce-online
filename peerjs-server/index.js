const { PeerServer } = require("peer");
const config = require("./peer.config.js");

const peerServer = PeerServer(config);

console.log(`Running PeerServer at https://localhost:${config.port}`);

peerServer.on('connection', (client) => { console.log(`PeerServer: client connected -> ${client.getId()}`) });
peerServer.on('disconnect', (client) => { console.log(`PeerServer: client disconnected -> ${client.getId()}`) });
