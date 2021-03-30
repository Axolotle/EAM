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

export function vRotate (v, theta) {
  theta = theta * (Math.PI / 180)
  const cos = Math.cos(theta)
  const sin = Math.sin(theta)
  return [cos * v[0] - sin * v[1], sin * v[0] + cos * v[1]]
}
