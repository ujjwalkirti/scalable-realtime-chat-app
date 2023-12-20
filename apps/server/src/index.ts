import http from 'http'
import SocketService from './services/socket';
import { startMessageConsumer } from './services/kafka';


async function init() {
    startMessageConsumer()
    const httpServer = http.createServer();
    const port = process.env.PORT || 8000;

    const socketService = new SocketService();

    socketService.io.attach(httpServer)


    httpServer.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    })
    socketService.initListeners()

}

init()
