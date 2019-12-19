const COLOURS = ['#E3EB64', '#A7EBCA', '#FFFFFF', '#D8EBA7', '#868E80']
let radius = 0
let socket
let myId = Math.random()

Sketch.create({
  container: document.getElementById('sketch-container'),
  autoclear: false,
  retina: 'auto',
  setup () {
    console.log('setup')
    socket = io()

    socket.on('message', message => console.log(message))
    socket.on('stroke', stroke => {
      console.log('Received network stroke!')

      if (stroke.author !== myId) this.drawStroke(stroke)
    })
  },
  update () {
    radius = 10
  },
  // Event handlers
  keydown () {
    if (this.keys.C) this.clear()
  },
  // Mouse & touch events are merged, so handling touch events by default
  // and powering sketches using the touches array is recommended for easy
  // scalability. If you only need to handle the mouse / desktop browsers,
  // use the 0th touch element and you get wider device support for free.
  touchmove () {
    if (!this.dragging) return

    for (var i = this.touches.length - 1, touch; i >= 0; i--) {
      touch = this.touches[i]
      this.lineCap = 'round'
      this.lineJoin = 'round'
      this.fillStyle = this.strokeStyle = COLOURS[i % COLOURS.length]
      this.lineWidth = radius

      const stroke = {
        start: { x: touch.ox, y: touch.oy },
        end: { x: touch.x, y: touch.y },
        author: myId
      }

      this.drawStroke(stroke)

      socket.emit('stroke', stroke)
    }
  },
  drawStroke ({ start, end }) {
    this.beginPath()
    this.moveTo(start.x, start.y)
    this.lineTo(end.x, end.y)
    this.stroke()
  }
})
