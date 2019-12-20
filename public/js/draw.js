const COLOURS = ['#4C19E5', '#A7EBCA', '#FFFFFF', '#D8EBA7', '#868E80']
let radius = 5
let socket

// TODO: Refactor to use socket.id instead
let myId = Math.random()

const sketchId = window.location.pathname.replace('/sketches/', '')

// https://stackoverflow.com/questions/4817029/whats-the-best-way-to-detect-a-touch-screen-device-using-javascript/4819886#4819886
const isTouch = (function isTouch () {
  if (
    'ontouchstart' in window ||
    (window.DocumentTouch && document instanceof DocumentTouch)
  ) {
    return true
  }

  const prefixes = ' -webkit- -moz- -o- -ms- '.split(' ')
  const mq = query => window.matchMedia(query).matches

  // include the 'heartz' as a way to have a non matching MQ to help terminate the join
  // https://git.io/vznFH
  const query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('')
  return mq(query)
})()

Sketch.create({
  container: document.getElementById('sketch-container'),
  autoclear: false,
  retina: 'auto',
  setup () {
    this.lineCap = 'round'
    this.lineJoin = 'round'

    // Setup socket listeners
    socket = io(`/sketches?id=${sketchId}`)

    socket.on('stroke', stroke => {
      console.log('Received network stroke!')
      this.drawStroke(stroke)
    })

    socket.on('strokes-snapshot', snapshot => {
      console.log('Received snapshot!', snapshot)
      snapshot.forEach(this.drawStroke.bind(this))
    })
  },
  // update () {
  //   radius = 10
  // },
  // Mouse & touch events are merged, so handling touch events by default
  // and powering sketches using the touches array is recommended for easy
  // scalability. If you only need to handle the mouse / desktop browsers,
  // use the 0th touch element and you get wider device support for free.
  touchmove () {
    if (!isTouch && !this.dragging) return

    for (var i = this.touches.length - 1, touch; i >= 0; i--) {
      touch = this.touches[i]
      this.lineCap = 'round'
      this.lineJoin = 'round'
      this.fillStyle = this.strokeStyle = COLOURS[i % COLOURS.length]
      this.lineWidth = radius

      const stroke = {
        start: { x: touch.ox, y: touch.oy },
        end: { x: touch.x, y: touch.y },
        colour: this.fillStyle,
        lineWidth: this.lineWidth,
        author: myId
      }

      this.drawStroke(stroke)

      socket.emit('stroke', stroke)
    }
  },
  drawStroke ({ start, end, colour, lineWidth }) {
    this.fillStyle = this.strokeStyle = colour
    this.lineWidth = lineWidth

    this.beginPath()
    this.moveTo(start.x, start.y)
    this.lineTo(end.x, end.y)
    this.stroke()
  }
})

const link = document.getElementById('link')
link.textContent = window.location
const clipboard = new ClipboardJS('.link-container')

clipboard.on('success', () => {
  toastr.options = {
    closeButton: false,
    debug: true,
    newestOnTop: false,
    progressBar: false,
    positionClass: 'toast-top-right',
    preventDuplicates: false,
    onclick: null,
    showDuration: '300',
    hideDuration: '1000',
    timeOut: '3000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut'
  }

  toastr.success('Now send it to your friends and get drawing!', 'Copied!')
})
