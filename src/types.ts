export type RoomType = {
    id: string,
    users: UserType[],
    settings: SettingsType,
    gameState: GameStateType | null;
  }
  
  export type UserType = {
    id: string,
    isHost: boolean,
    color: string,
    name: string,
  }
  
  export type SettingsType = {
    startingLife: number,
  }
  
  export type SocketError = {
    code: number;
    message: string;
  }
  
  export type GameStateType = {
    playerStates: PlayerStateType[];
  }
  
  export type PlayerStateType = {
    userId: string;
    life: number;
  }