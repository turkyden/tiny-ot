"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const url_1 = require("url");
const next_1 = __importDefault(require("next"));
const ws_1 = __importDefault(require("ws"));
const sharedb_1 = __importDefault(require("sharedb"));
const WebSocketJSONStream_1 = __importDefault(require("./WebSocketJSONStream"));
const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next_1.default({ dev });
const handle = app.getRequestHandler();
app.prepare().then(() => {
    const server = http_1.createServer((req, res) => {
        const parsedUrl = url_1.parse(req.url, true);
        const { pathname, query } = parsedUrl;
        if (pathname === '/a') {
            app.render(req, res, '/a', query);
        }
        else if (pathname === '/b') {
            app.render(req, res, '/b', query);
        }
        else {
            handle(req, res, parsedUrl);
        }
    });
    const webSocketServer = new ws_1.default.Server({ server: server });
    const backend = new sharedb_1.default();
    webSocketServer.on('connection', (webSocket) => {
        const stream = new WebSocketJSONStream_1.default(webSocket);
        backend.listen(stream);
    });
    server.listen(port);
    // tslint:disable-next-line:no-console
    console.log(`> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`);
});
//# sourceMappingURL=index.js.map