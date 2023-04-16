import { UIEventHandler, useId } from "react";

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