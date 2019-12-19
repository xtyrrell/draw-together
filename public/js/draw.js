const COLOURS = ['#E3EB64', '#A7EBCA', '#FFFFFF', '#D8EBA7', '#868E80']

let radius = 0

Sketch.create({
  container: document.getElementById('sketch-container'),
  autoclear: false,
  retina: 'auto',
  setup: () => {
    // const socket = io()
    // socket.on('stroke', stroke => console.log(stroke))
  },
  update: () => (radius = 10),
  // Event handlers
  keydown: () => {
    // if (this.keys.C) this.clear()
  },
  // Mouse & touch events are merged, so handling touch events by default
  // and powering sketches using the touches array is recommended for easy
  // scalability. If you only need to handle the mouse / desktop browsers,
  // use the 0th touch element and you get wider device support for free.
  touchmove: () => {
    if (!this.dragging) return

    for (var i = this.touches.length - 1, touch; i >= 0; i--) {
      touch = this.touches[i]
      this.lineCap = 'round'
      this.lineJoin = 'round'
      this.fillStyle = this.strokeStyle = COLOURS[i % COLOURS.length]
      this.lineWidth = radius
      this.beginPath()

      const { ox, oy, x, y } = touch

      this.moveTo(ox, oy)
      this.lineTo(x, y)
      this.stroke()

      // if (socket) socket.emit('stroke', { ox, oy, x, y })
    }
  }
})
