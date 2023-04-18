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
                <h3>{`Users`}</h3>
                <div className="user-list">
                    {room.users.map((user: UserType) => <User key={user.id} user={user} />)}
                </div>
            </div>
            <style jsx>
                {`
                .users{
                    display: flex;
                    flex-direction: column;
                    gap: var(--gap-md);
                }
                h3{
                    align-self: center;
                }
                .user-list{
                    display: flex;
                    flex-direction: column;
                    gap: var(--gap-sm);
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

    function handleKeyDown(e: any) {
        if (e.key === 'Enter') {
            handleEndEdit();
        }
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
                        <div className="flex-start">
                            <div className="color" />
                            <b>{user.name}</b>
                        </div>
                        <div className="user-edit" onClick={handleEditUser}>
                            <PencilIcon size={20} />
                        </div>
                    </> : <>
                        <div className="flex-start">
                            <div className="color" />
                            <input
                                type='text'
                                maxLength={32}
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onFocus={(e) => { e.target.select() }}
                            />
                        </div>
                        <div className="user-edit" onClick={handleEndEdit}>
                            <CheckIcon size={20} />
                        </div>
                    </>) : <div className="flex-start">
                        <div className="color" />
                        <p>{user.name}</p>
                    </div>
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
                .flex-start{
                    display: flex;
                    flex-direction: row;
                    justify-content: flex-start;
                    align-items: center;
                    gap: var(--gap-md)
                }
                .color{
                    width: 18px;
                    height: 18px;
                    border-radius: 12px;
                    background-color: ${me.color};
                }
                `}
            </style>
        </>
    )
}