import Client from "./Client";

export default class GameRoom {
    //each game room can have up to 7 clients
    clients: Array<Client>;
    id: string;

    constructor(id: string) {
        this.id = id;
        this.clients = new Array<Client>();
    }

    public addClient(client: Client): boolean {
        if (this.clients.length >= 7 || this.clients.includes(client)) {
            return false;
        }
        client.inRoom = true;
        client.roomId = this.id;
        this.clients.push(client);
        return true;
    }

    public removeClient(client: Client): boolean {
        let index = this.clients.indexOf(client);
        if (index === -1) {
            return false;
        }
        client.inRoom = false;
        client.roomId = undefined;
        this.clients.splice(index, 1);
        return true;
    }
}