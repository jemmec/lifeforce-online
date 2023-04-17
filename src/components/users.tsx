import { useRoom } from "@/contexts/room-context";
import { UserType } from "@/types";

export function Users() {
    const { me, room } = useRoom();
    return (
      <>
        <div>
          <div>
            {
              room.users.map((user: UserType) => {
                const isMe = user === me;
                return (
                  <div key={user.id}>
                    <p>{isMe ? `(me)` : ''}{user.name}</p>
                  </div>
                );
              })
            }
          </div>
        </div>
      </>
    )
  }
  