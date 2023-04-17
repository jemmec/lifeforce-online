import { useRoom } from "@/contexts/room-context";
import { useSocket } from "@/contexts/socket-context";
import { UserType } from "@/types";
import { PencilIcon, CheckIcon } from "@primer/octicons-react";
import { useState } from "react";

export function Users() {
    const { me, room } = useRoom();

    return (
        <>
            <div className="users">
                <div className="user-list">
                    {room.users.map((user: UserType) => <User key={user.id} user={user} />)}
                </div>
            </div>
            <style jsx>
                {`
                .users
                    
                }
                .user-list{
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-start;
                }
            `}
            </style>
        </>
    )
}

export function User({ user }: { user: UserType }) {

    const { socket } = useSocket();
    const { me, room, setMe } = useRoom();
    const isMe = user === me;
    const [edit, setEdit] = useState(false);
    const [name, setName] = useState(user.name);

    function handleEditUser() {
        setEdit(true);
    }

    function handleEndEdit() {
        setEdit(false);
        //update username locally
        const newMe = { ...me, name: name };
        setMe(newMe);
        //Push update to everyone 
        if (socket) {
            socket.emit('update_user', room.id, newMe);
        }
    }

    return (
        <>
            <div key={user.id} className="user">
                {
                    isMe ? (!edit ? <>
                        <b>{user.name}</b>
                        <div className="user-edit" onClick={handleEditUser}>
                            <PencilIcon size={20} />
                        </div>
                    </> : <>
                        <input maxLength={32} value={name} onChange={(e) => setName(e.target.value)} />
                        <div className="user-edit" onClick={handleEndEdit}>
                            <CheckIcon size={20} />
                        </div>
                    </>) : <p>{user.name}</p>
                }
            </div>
            <style jsx>
                {`
                .user{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                }
                .user-edit{
                    cursor: pointer;
                }
                `}
            </style>
        </>
    )
}