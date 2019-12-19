import http from 'http'

import Koa from 'koa'
import SocketIo from 'socket.io'
import staticServer from 'koa-static'

// import routes from './routes'

const app = new Koa()

// app.use(routes)
app.use(staticServer('public'))

const httpServer = http.createServer(app.callback())
const io = SocketIo(httpServer)

io.on('connection', socket => {
  console.log('A user connected!')
  socket.on('message', message => console.log(message))
  socket.on('stroke', stroke => {
    console.log(stroke)

    io.emit('stroke', stroke)
  })
})

app.use(async ctx => {
  ctx.body = '<h1>hi</h1>'
})

httpServer.listen(3000, () => console.log('Listening at http://localhost:3000'))
