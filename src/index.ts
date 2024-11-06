import log from 'sistemium-debug'
import Koa from 'koa'
import { createServer } from 'http'
import { Server } from 'socket.io'

const { debug } = log('index')
const { SERVER_PORT } = process.env
const app = new Koa()
const httpServer = createServer(app.callback())
const io = new Server(httpServer, {
  /* options */
})

io.on('connection', socket => {
  debug('connection', socket.id)
  socket.on('hey', (payload: any, payload2: any) => {
    debug('got hey', payload, payload2)
    socket.emit('hoa')
    // callback((new Date).toJSON())
  })
})

httpServer.listen(SERVER_PORT)

debug('started on port', SERVER_PORT)
