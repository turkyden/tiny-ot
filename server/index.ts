import { createServer } from 'http'
import { parse } from 'url'
import next from 'next'
import WebSocket from 'ws'
import ShareDB from 'sharedb'
import WebSocketJSONStream from '@teamwork/websocket-json-stream'

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      app.render(req, res, '/a', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/b', query)
    } else {
      handle(req, res, parsedUrl)
    }
  })

  const webSocketServer = WebSocket.Server({server: server});

  const backend = new ShareDB();

  webSocketServer.on('connection', (webSocket: any) => {
    const stream = new WebSocketJSONStream(webSocket)
    backend.listen(stream)
  })
  
  server.listen(port);

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  )
})