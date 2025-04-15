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
  <Teleport to="body">
    <div v-if="modelValue" class="modal-backdrop" @click="handleClose">
      <div ref="modalContent" class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>JSON View</h3>
          <button class="close-button" @click="handleClose" title="Close modal">&times;</button>
        </div>
        <div class="modal-body">
          <pre>{{ formattedJson }}</pre>
        </div>
      </div>
    </div>
  </Teleport>
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
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--color-background);
  border-radius: 12px;
  max-width: 90%;
  max-height: 90vh;
  width: 800px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid var(--color-border);
  transform: translateY(0);
  transition: transform 0.2s ease-out;
  animation: modal-in 0.2s ease-out;
}

@keyframes modal-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-soft);
}

.modal-header h3 {
  margin: 0;
  color: var(--color-heading);
  font-weight: 600;
  font-size: 1.25rem;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.75rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: var(--color-text);
  border-radius: 6px;
  line-height: 1;
  transition: all 0.2s;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: var(--color-background);
  transform: scale(1.05);
}

.modal-body {
  padding: 1.5rem;
  overflow: auto;
  max-height: calc(90vh - 5rem);
  background: var(--color-background);
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9375rem;
  line-height: 1.6;
  color: var(--color-text);
  background: var(--color-background-soft);
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
}
</style>
