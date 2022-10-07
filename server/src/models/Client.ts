export default class Client {

    constructor(id: string) {
        this.id = id;
    }


    id: string;
    inRoom: boolean = false;
    roomId?: string = undefined;
}