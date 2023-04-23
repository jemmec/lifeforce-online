# Lifeforce (online)

## Environment variables

```
NEXT_PUBLIC_SOCKET_IO_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_IO_PASSPHRASE=swordfish
```

## Room TTL

When no users are present in a room, the room will "Stay-alive" for the specified TTL. The first user to join back into the room will be made "host".

## Heroku

Push socket-server to heroku app:
```
git subtree push --prefix socket-server heroku master
```

## Todo

- Include manual typing of `roomId`
- Add "drop-out" support.
    - When a user leaves the room their `User` object will not be delete from memory. If a user tried to re-join the room with the same `footprint` (different from `userId`, since that could be re-generated by socket.io) they will re-join as the corrosponding `User`.
    - The footprint can be stored inside a user's `localStorage` object with as the following object:
        ```js
        {
            key: <roomId>,
            value: <footprint>
        }
        ```