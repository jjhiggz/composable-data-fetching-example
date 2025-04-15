<script setup lang="ts">
import { computed, ref } from 'vue'
import { onClickOutside, onKeyStroke } from '@vueuse/core'

interface Props {
  modelValue: boolean
  jsonData: unknown
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()

const modalContent = ref<HTMLElement | null>(null)

const formattedJson = computed(() => {
  try {
    return typeof props.jsonData === 'string'
      ? JSON.stringify(JSON.parse(props.jsonData), null, 2)
      : JSON.stringify(props.jsonData, null, 2)
  } catch {
    return 'Invalid JSON'
  }
})

const handleClose = () => emit('update:modelValue', false)

onClickOutside(modalContent, handleClose)
onKeyStroke('Escape', handleClose)
</script>

<template>
  <div class="modal-backdrop" id="modal">
    <h1>Fucks</h1>
    <div ref="modalContent" class="modal-content">
      <pre>{{ formattedJson }}</pre>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 80%;
  max-height: 80%;
  overflow: auto;
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
