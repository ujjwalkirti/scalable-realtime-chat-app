import Redis from "ioredis";
import { Server } from "socket.io";
import dotenv from "dotenv";

dotenv.config();

const pub = new Redis(
    {
        host: process.env.REDIS_HOST as string,
        port: parseInt(process.env.REDIS_PORT as string),
        username: process.env.REDIS_USERNAME as string,
        password: process.env.REDIS_PASSWORD as string,
    }
);
const sub = new Redis(
    {
        host: process.env.REDIS_HOST as string,
        port: parseInt(process.env.REDIS_PORT as string),
        username: process.env.REDIS_USERNAME as string,
        password: process.env.REDIS_PASSWORD as string,
    }
);
// console.log(process.env.REDIS_HOST, process.env.REDIS_PORT, process.env.REDIS_USERNAME, process.env.RESIS_PASSWORD)
class SocketService {
    private _io: Server;

    constructor() {
        console.log("Init socket server..")
        this._io = new Server({
            cors: {
                allowedHeaders: ['*'],
                origin: '*'
            }
        });
        sub.subscribe('MESSAGES');
    }

    public initListeners() {
        const io = this.io;

        io.on('connect', function (socket) {
            console.log("New Socket connected", socket.id);

            socket.on("event:message", async ({ message }: { message: string }) => {
                await pub.publish("MESSAGES", JSON.stringify({ message }));
            })
        })

        sub.on('message', (channel, message) => {
            if (channel === 'MESSAGES')
                io.emit('message', JSON.parse(message) as { message: string })
        })
    }

    get io() {
        return this._io;
    }
}

export default SocketService
