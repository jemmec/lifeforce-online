export class Room {
    id: string;
    users: User[];
    settings: Settings;
    constructor(
        id: string,
        users: User[],
        settings: Settings
    ) {
        this.id = id;
        this.users = users;
        this.settings = settings;
    }
}

export class User {
    id: string;
    isHost: boolean;
    color: string;
    name: string;
    life: number;
    constructor(
        id: string,
        isHost: boolean,
        color: string,
        name: string,
        life: number,
    ) {
        this.id = id;
        this.isHost = isHost;
        this.color = color;
        this.name = name;
        this.life = life;
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