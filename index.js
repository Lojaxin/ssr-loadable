import express from 'express';
import renderHtml from './src/ssr/server-render';

class App {
    constructor() {
        this.server = express();
    }
    run() {
        const server = this.server = express();
        server.use(express.static('public'));
        server.get('*', renderHtml());

        server.listen(3000, () => {
            console.log('server is running at http://localhost:3000');
        });
    }
}

const app = new App();
app.run();

