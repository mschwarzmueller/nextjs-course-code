declare type Handler = (...evts: any[]) => void;
export declare type MittEmitter = {
    on(type: string, handler: Handler): void;
    off(type: string, handler: Handler): void;
    emit(type: string, ...evts: any[]): void;
};
export default function mitt(): MittEmitter;
export {};
