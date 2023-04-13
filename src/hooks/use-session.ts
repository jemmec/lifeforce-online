export interface Session {
    id: string;
}

export function useSession(id: string): { session: Session } {
    const session: Session = { id: id };
    return { session };
}