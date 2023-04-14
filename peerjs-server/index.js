const { PeerServer } = require("peer");
const config = require("./peer.config.js");
const peerServer = PeerServer(config);