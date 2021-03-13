export function sleep (ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
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
