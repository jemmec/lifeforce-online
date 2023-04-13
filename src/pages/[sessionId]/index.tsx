import { useSession } from "@/hooks/use-session";
import { useRouter } from "next/router"

export default function Session() {
    const router = useRouter();
    const { sessionId } = router.query;
    const { session } = useSession(sessionId as string);

    return (
        <>
            <div>
                {session.id}
            </div>
        </>
    )
}




export function SessionNotFound() {
    return (
        <>
            <div>
                Session not found.
            </div>
        </>
    )
}