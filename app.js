import http from 'http'

import Koa from 'koa'
import Router from '@koa/router'
import SocketIo from 'socket.io'
import staticServer from 'koa-static'
import send from 'koa-sendfile'

import getWordCombination from './utils/words'

/*
Basic description:
0. The user starts on the homepage, with links to (1) a new sketch and (2) join
  an existing sketch by entering its ID.
1. If a user clicks the link to /sketches/new, generate a sketch id for them and redirect them there.
2. If a user enters an ID of a sketch they want to join, they will end up at /sketches/<sketch-id>, thus joining room <sketch-id> on the
   /sketches namespace in socketio.
3. When a user connects to a room they get sent a recap of all the strokes and
   replays these to reconstruct the sketch up to the current moment. From then on...
4. ... Any connected user in a room gets all `stroke` events whenever anyone in that
   room draws a stroke
*/

const app = new Koa()
const router = new Router()

const PORT = process.env.PORT || 3000

router.get('/', async ctx => {
  await send(ctx, 'public/index.html')
})

// If user lands on /, generate a sketch id for them and redirect them there
router.get('/sketches/new', ctx => {
  // Create new sketch id
  const id = getWordCombination()

  ctx.redirect(`/sketches/${id}`)
})

router.get('/sketches/join', ctx => {
  // Join a sketch at the sketchId passed in
  const id = ctx.query.id

  if (!id) {
    ctx.status = 404
    return send(ctx, 'public/404.html')
  }

  ctx.redirect(`/sketches/${id}`)
})

router.get('/sketches/:id', async ctx => {
  await send(ctx, 'public/sketch.html')
})

app.use(router.routes())
app.use(router.allowedMethods())
app.use(staticServer('public'))

const httpServer = http.createServer(app.callback())
const io = SocketIo(httpServer, {
  allowEIO3: true
})
const sketches = io.of('/sketches')

// Record all strokes for all sketchIds
// TODO: Store these better!
const strokes = {}

sketches.on('connection', socket => {
  // Close connections made without sketchIds
  if (!socket.handshake.query.id) socket.disconnect(true)

  // Get the id of this sketch
  const { id } = socket.handshake.query
  socket.join(id)

  console.log(`A user connected to sketchId ${id}`)

  // Replay the recorded strokes in this room
  if (strokes[id]) socket.emit('strokes-snapshot', strokes[id])

  socket.on('stroke', stroke => {
    // console.log(`User ${socket.id} drew a stroke in room`, socket.rooms)

    if (!strokes[id]) strokes[id] = [stroke]
    else strokes[id].push(stroke)

    // Emit this stroke to all users at this sketch id
    // TODO: Broadcast this instead of simply emitting it
    // (so it doesn't get sent to the stroke author)
    // TODO: Verify broadcasting works
    socket.broadcast.to(id).emit('stroke', stroke)
  })
})

httpServer.listen(PORT, () => {
  const { address, port, family } = httpServer.address()
  console.log(`Listening on ${family} at ${address}:${port}`)
})
