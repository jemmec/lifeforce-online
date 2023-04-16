export class Room {

    id: string;
    users: User[];
    settings: Settings;
    gameState: GameState | null;

    constructor(
        id: string,
        users: User[],
        settings: Settings
    ) {
        this.id = id;
        this.users = users;
        this.settings = settings;
        this.gameState = null;
    }

    public addUser(user: User) {
        this.users.push(user);
    }

    public removeUser(user: User) {
        const index = this.users.indexOf(user);
        this.users.splice(index, 1);
        if (user.isHost)
            this.changeHost();
    }

    public changeHost() {
        if (!this.isEmpty()) {
            const newHost = this.users[0];
            newHost.isHost = true;
            //Replace with new host
            this.users.splice(0, 1, newHost);
        }
    }

    public updateSettings(newSettings: Settings) {
        this.settings = { ...newSettings };
    }

    public updateUser(newUser: User) {
        const user = this.users.find(x => x.id === newUser.id);
        if (!user) return;
        const index = this.users.indexOf(user);
        this.users.splice(index, 1, newUser);
    }

    public isEmpty(): boolean { return this.users.length === 0 };


    public startGame() {
        this.gameState = new GameState(this);
    }

    public endGame() {
        this.gameState = null;
    }

    public resetGame() {
        this.gameState = new GameState(this);
    }
}


export class User {

    id: string;
    isHost: boolean;
    color: string;
    name: string;

    constructor(
        id: string,
        isHost: boolean,
        color: string,
        name: string
    ) {
        this.id = id;
        this.isHost = isHost;
        this.color = color;
        this.name = name;
    }

}

export class Settings {

    startingLife: number;

    constructor() {
        this.startingLife = 40;
    }

}

export class SocketError {

    code: number;
    message: string;

    constructor(
        code: number,
        message: string,
    ) {
        this.code = code;
        this.message = message;
    }
}

/**
 * The base state for the game
 */
export class GameState {

    playerStates: PlayerState[];

    constructor(room: Room) {
        //Map room users to their corrosponding state
        this.playerStates = room.users.map(user => {
            return new PlayerState(
                user,
                room.settings.startingLife
            );
        });
    }

    public modUserLife(userId: string, value: number) {
        const playerState = this.playerStates.find(x => x.userId === userId);
        if (playerState) {
            playerState.life = (playerState.life + value);
        }
    }

    public modOtherLife(userId: string, value: number) {
        for (let i = 0; i < this.playerStates.length; i++) {
            if (this.playerStates[i].userId !== userId)
                this.playerStates[i].life = (this.playerStates[i].life + value);
        }
    }

}


export class PlayerState {

    userId: string;
    life: number;

    constructor(
        user: User,
        startingLife: number
    ) {
        this.userId = user.id;
        this.life = startingLife;
    }
}

