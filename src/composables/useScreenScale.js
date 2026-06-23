import { onBeforeUnmount, onMounted, ref } from 'vue'

const BASE_WIDTH = 1920
const BASE_HEIGHT = 1080

export function useScreenScale() {
  const scale = ref(1)

  const updateScale = () => {
    const widthRatio = window.innerWidth / BASE_WIDTH
    const heightRatio = window.innerHeight / BASE_HEIGHT
    scale.value = Math.min(widthRatio, heightRatio)
  }

  onMounted(() => {
    updateScale()
    window.addEventListener('resize', updateScale)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScale)
  })

  return {
    scale,
  }
}
