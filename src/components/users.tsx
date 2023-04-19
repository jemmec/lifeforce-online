import { useRoom } from "@/contexts/room-context";
import { useSocket } from "@/contexts/socket-context";
import { UserType } from "@/types";
import { PencilIcon, CheckIcon } from "@primer/octicons-react";
import { useState } from "react";
import { ColorWidget } from "./color-widget";
import { FadeLeftMotion } from "./motions";

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
    const [color, setColor] = useState(user.color);

    function handleEditUser() {
        setEdit(true);
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
            <FadeLeftMotion timing={{duration: 'medium'}}>
                <div key={user.id} className="user">
                    {
                        isMe ? (!edit ? <>
                            <div className="flex-start">
                                <div className="color" />
                                <b>{user.name}</b>
                            </div>
                            <div className="user-edit" onClick={handleEditUser}>
                                <PencilIcon size={32} />
                            </div>
                        </> : <>
                            <div className="flex-start">
                                <div className="color edit" >
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
                                        show={edit}
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
                                <CheckIcon size={32} />
                            </div>
                        </>) : <div className="flex-start">
                            <div className="color" />
                            <p>{user.name}</p>
                        </div>
                    }
                </div>
            </FadeLeftMotion>
            <style jsx>
                {`
                .user{
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;

                    font-size: 22px;
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
                    width: 32px;
                    min-width: 32px;
                    height: 32px;
                    min-height: 32px;
                    border-radius: 8px;
                    background-color: ${isMe ? color : user.color};
                }
                .color.edit{
                    cursor: pointer;
                    position: relative;
                }
                .modal{
                    position: fixed;
                    top: 0; left: 0; bottom: 0; right: 0;
                }
                input[type='text']
                {
                font-size: inherit;
                border-width: 2px;
                border-style: dashed;
                border-radius: var(--border-radius);
                background: none;
                color: var(--foreground);
                width: min-content;
                padding: 2px 4px;
                width: 100%;
                }
                
                `}
            </style>
        </>
    )
}