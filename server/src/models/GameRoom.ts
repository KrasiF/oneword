import ClientGlobalState from "./ClientGlobalState";

export default class GameRoom {
    //each game room can have up to 7 clients
    clients: Array<ClientGlobalState>;
    id: string;

    constructor(id: string) {
        this.id = id;
        this.clients = new Array<ClientGlobalState>();
    }

    public addClient(client: ClientGlobalState): boolean {
        if (this.clients.length >= 7 || this.clients.includes(client)) {
            return false;
        }
        this.clients.push(client);
        return true;
    }

    public removeClient(client: ClientGlobalState): boolean {
        let index = this.clients.indexOf(client);
        if (index === -1) {
            return false;
        }
        this.clients.splice(index, 1);
        return true;
    }
}