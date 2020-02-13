import Pressure from 'pressure'
import './index.css'
import registerServiceWorker from './registerServiceWorker'


registerServiceWorker()

const valentines = document.getElementById('valentines')
const heart = document.getElementById('heart')
const circle = document.getElementById('circle')

let ended = false

const start = () => {
  document.body.classList.add('start')
  document.body.classList.remove('end', 'reset')
}
const end = () => {
  document.body.classList.add('end')
  document.body.classList.remove('start', 'reset')
  ended = true
}
const reset = () => {
  document.body.classList.add('reset')
  document.body.classList.remove('start', 'end')
}

// Load icon svgs inline so they can be styled and not a font.
const iconsPath = 'lib/Font-Awesome-SVG-PNG/black/svg/'
const loadFontIcon = (name) => {
  const icon = `${iconsPath + name}.svg`
  // const id = `fa-${name}`

  const xhr = new XMLHttpRequest()
  xhr.open('GET', icon, true)
  xhr.onload = () => {
    // const loveIcon = xhr.responseXML.documentElement
    // loveIcon.id = id
    // loveIcon.classList.add(id)
    // element.appendChild(icon)
  }

  // Following line is just to be on the safe side;
  // not needed if your server delivers SVG with correct MIME type
  xhr.overrideMimeType('image/svg+xml')
  xhr.send('')
}

loadFontIcon('heart', heart)
loadFontIcon('heart-o', heart)

// Without force touch.
let timeout
const delay = 2000 // 2 seconds
// Mouse or touch events.
let eventIn = 'mousedown'
let eventOut = 'mouseup'
if ('ontouchstart' in window) {
  eventIn = 'touchstart'
  eventOut = 'touchend'
}

// const cancelNoForceTouch = () => {
//   heartEnd()
//   endNoForceTouch()
// }

const heartEnd = () => {
  window.clearTimeout(timeout)
  reset()
}

const heartStart = () => {
  start()
  timeout = window.setTimeout(() => {
    valentines.removeEventListener(eventIn, heartStart)
    valentines.removeEventListener(eventOut, heartEnd)
    end()
  }, delay)
}

// function endNoForceTouch() {
//   valentines.removeEventListener(eventIn, heartStart)
//   valentines.removeEventListener(eventOut, heartEnd)
// }

const startForceTouch = () => {
  document.body.classList.add('force-touch')
}
const startNoForceTouch = () => {
  document.body.classList.add('no-force-touch')
  valentines.addEventListener(eventIn, heartStart, false)
  valentines.addEventListener(eventOut, heartEnd, false)
}

// With force touch.
const styleForceValue = (forceValue) => {
  // Style the circle and heart like iOS 9+ 3d touch.
  // Copied from https://github.com/freinbichler/3d-touch/blob/e8f606284c2e08b039b3a2e595c4d6b1e2e52055/3dtouch.js#L47-L48
  heart.style.webkitTransform =
    `translateX(-50%) translateY(-50%) scale(${1 + forceValue * 1.5})`
  circle.style.webkitFilter = `blur(${forceValue * 30}px)`
}

// Pressure.js http://yamartino.github.io/pressure/
let isSetup = false
Pressure.set(valentines, {
  start() {
    if (ended) {
      return
    }
    if (!isSetup) {
      startForceTouch()
    }
    start()
  },
  end() {
    if (ended) {
      return
    }
    styleForceValue(0)
    reset()
  },
  change(forceValue) {
    if (ended) {
      return
    }
    styleForceValue(forceValue)
    if (forceValue >= 0.95) {
      end()
    }
  },
  unsupported() {
    // Use non-force-touch functions.
    if (!isSetup) {
      // Only run once.
      heartStart()
      startNoForceTouch()
    }
    isSetup = true
  },
})

// Finish loading. A function in the event queue will only be processed
// once every other bit of JavaScript here has run.
window.setTimeout(() => {
  document.getElementById('main').style.display = ''
  document.getElementById('loading').style.display = 'none'
}, 1000)
