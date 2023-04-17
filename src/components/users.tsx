import { useRoom } from "@/contexts/room-context";
import { UserType } from "@/types";

export function Users() {
    const { me, room } = useRoom();
    return (
        <>
            <div className="users">
                <div className="user-list">
                    {
                        room.users.map((user: UserType) => {
                            const isMe = user === me;
                            return (
                                <div key={user.id} className="user">
                                    {
                                        isMe ? <b>{user.name}</b> : <p>{user.name}</p>
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
            <style jsx>
                {`
                .users{
                    
                }
                .user-list{
                    
                }
            `}
            </style>
        </>
    )
}
