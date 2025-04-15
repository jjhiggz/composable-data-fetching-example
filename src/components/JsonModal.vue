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
          <button class="close-button" @click="handleClose">&times;</button>
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
}

.modal-content {
  background: var(--color-background, white);
  border-radius: 8px;
  max-width: 80%;
  max-height: 80vh;
  width: 600px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.modal-header h3 {
  margin: 0;
  color: var(--color-heading, #111827);
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  color: var(--color-text, #374151);
  border-radius: 4px;
}

.close-button:hover {
  background: var(--color-background-soft, #f3f4f6);
}

.modal-body {
  padding: 1rem;
  overflow: auto;
  max-height: calc(80vh - 4rem);
}

pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text, #374151);
}
</style>
