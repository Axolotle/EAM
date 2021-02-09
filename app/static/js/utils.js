export function renderTemplate (templateId, { data, select, selectAll } = {}) {
  const main = document.querySelector('main div')
  main.innerHTML = ''
  const template = document.getElementById('tmp-' + templateId)
  const clone = document.importNode(template.content, true)

  clone.querySelectorAll('[data-t]').forEach(elem => {
    const d = elem.dataset
    const content = d.ep ? data[d.t][data.episode] : data[d.t]
    if (elem.dataset.html) {
      elem.innerHTML = content
    } else {
      elem.textContent = content
    }
  })

  main.appendChild(clone)

  if (select) {
    return main.querySelector(select)
  } else if (selectAll) {
    return main.querySelectorAll(selectAll)
  }
  return main
}


export function formatText (textArr) {
  return `<p>${textArr.join('<br>')}</p>`
}


export function clearScreen () {
  const main = document.querySelector('main div')
  main.innerHTML = ''
}


export function waitForClick (btn) {
  return new Promise(resolve => {
    btn.onclick = () => resolve()
  })
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


export async function play (audio) {
  return new Promise(resolve => {
    audio.addEventListener('ended', resolve)
    audio.play()
  })
}


export function sleep (ms = 1000) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
