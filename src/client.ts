import { io } from 'socket.io-client'
import log from 'sistemium-debug'

const socket = io(`http://localhost:${process.env.SERVER_PORT}`)
// const socket2 = io(`http://localhost:${process.env.SERVER_PORT}`)

const { debug } = log('client')

socket.on('connect', () => {
  debug('connected')
  socket.emit('hey', { a: 123 }, { b: 234 }, (ack: any) => {
    debug('got ack', ack)
  })
})

socket.on('hoa', () => {
  debug('got hoa')
})
