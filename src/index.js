import Pressure from 'pressure'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

registerServiceWorker()

const valentines = document.getElementById('valentines')
const heart = document.getElementById('heart')
const circle = document.getElementById('circle')

let ended = false

const createSvg = (path) => {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('width', '2048')
  svg.setAttribute('height', '2048')
  svg.setAttribute('viewBox', '0 0 2048 2048')
  svg.appendChild(path)
  return svg
}
const createSvgPath = (d) => {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  return path
}

const heartSvg = createSvg(createSvgPath('M1024 1792q-26 0-44-18l-624-602q-10-8-27.5-26t-55.5-65.5-68-97.5-53.5-121-23.5-138q0-220 127-344t351-124q62 0 126.5 21.5t120 58 95.5 68.5 76 68q36-36 76-68t95.5-68.5 120-58 126.5-21.5q224 0 351 124t127 344q0 221-229 450l-623 600q-18 18-44 18z'))
const heartOSvg = createSvg(createSvgPath('M1792 724q0-81-21.5-143t-55-98.5-81.5-59.5-94-31-98-8-112 25.5-110.5 64-86.5 72-60 61.5q-18 22-49 22t-49-22q-24-28-60-61.5t-86.5-72-110.5-64-112-25.5-98 8-94 31-81.5 59.5-55 98.5-21.5 143q0 168 187 355l581 560 580-559q188-188 188-356zm128 0q0 221-229 450l-623 600q-18 18-44 18t-44-18l-624-602q-10-8-27.5-26t-55.5-65.5-68-97.5-53.5-121-23.5-138q0-220 127-344t351-124q62 0 126.5 21.5t120 58 95.5 68.5 76 68q36-36 76-68t95.5-68.5 120-58 126.5-21.5q224 0 351 124t127 344z'))

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

const loadFontIcon = (id, svg, element) => {
  svg.id = id
  svg.classList.add(id)
  element.appendChild(svg)
}

loadFontIcon('fa-heart', heartSvg, heart)
loadFontIcon('fa-heart-o', heartOSvg, heart)

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
