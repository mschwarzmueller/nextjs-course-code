import Server, { ServerConstructor } from '../next-server/server/next-server';
declare type NextServerConstructor = ServerConstructor & {
    /**
     * Whether to launch Next.js in dev mode - @default false
     */
    dev?: boolean;
};
declare function createServer(options: NextServerConstructor): Server;
export default createServer;
