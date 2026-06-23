import { onBeforeUnmount, onMounted } from 'vue'

function formatDate(date) {
  const pad = (value) => String(value).padStart(2, '0')

  return [
    date.getFullYear(),
    pad(date.getMonth() + 1),
    pad(date.getDate()),
  ].join('-') + ' ' + [
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join(':')
}

export function useClock(setter) {
  let timer = null

  const update = () => {
    setter(formatDate(new Date()))
  }

  onMounted(() => {
    update()
    timer = window.setInterval(update, 1000)
  })

  onBeforeUnmount(() => {
    if (timer) {
      window.clearInterval(timer)
    }
  })
}
