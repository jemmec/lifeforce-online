import { useRoom } from "@/contexts/room-context";
import { useSocket } from "@/contexts/socket-context";
import { UserType } from "@/types";
import { PencilIcon, CheckIcon } from "@primer/octicons-react";
import { useState } from "react";
import { ColorWidget } from "./color-widget";

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
    const [showColor, setShowColor] = useState(false);
    const [color, setColor] = useState(user.color);

    function handleEditUser() {
        setEdit(true);
    }

    function handleColorClicked() {
        setShowColor(true);
    }

    function handleColorChange(color: string) {
        setColor(color);
    }

    function handleKeyDown(e: any) {
        if (e.key === 'Enter') {
            handleEndEdit();
        }
    }

    function handleEndEdit() {
        setEdit(false);
        //Hide color editor (if open)
        setShowColor(false);
        let hasChanges = false;
        const newMe = { ...me };
        if (name !== me.name) {
            //update name
            hasChanges = true;
            newMe.name = name;
        }
        if (color !== me.color) {
            //update color
            hasChanges = true;
            newMe.color = color;
        }
        //Only push the changes if there are any
        if (hasChanges) {
            //Update locally
            setMe(newMe);
            //Push update to everyone 
            if (socket) {
                socket.emit('update_user', room.id, newMe);
            }
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
                            <div className="color edit" onClick={handleColorClicked} >
                                <ColorWidget
                                    colors={[
                                        "#F94144",
                                        "#F3722C",
                                        "#F8961E",
                                        "#F9C74F",
                                        "#90BE6D",
                                        "#43AA8B",
                                        "#577590",
                                        "#99657D"
                                    ]}
                                    show={showColor}
                                    onChange={handleColorChange}
                                />
                            </div>
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
                .flex-start>b,
                .flex-start>p{
                    padding: 2px 4px;
                }
                .color{
                    width: 18px;
                    min-width: 18px;
                    height: 18px;
                    min-height: 18px;
                    border-radius: 12px;
                    background-color: ${color};
                }
                .color.edit{
                    cursor: pointer;
                    position: relative;
                }
                .modal{
                    position: fixed;
                    top: 0; left: 0; bottom: 0; right: 0;
                }
                `}
            </style>
        </>
    )
}