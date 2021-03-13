export function sleep (ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}


export function getRandInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}


export function easeInOutQuad (t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}


export function prefetchAudioFile (uri, presets) {
  return new Promise(resolve => {
    const audio = new Audio('/static/assets' + uri)
    if (presets) {
      for (const preset in presets) {
        audio[preset] = presets[preset]
      }
    }
    audio.addEventListener('canplaythrough', resolve(audio))
  })
}
