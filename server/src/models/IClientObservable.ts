import IClientObserver from "./IClientObserver";

export default interface IClientObservervable {
    subscribe(observer: IClientObserver): void;
}