<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: boolean
  data: unknown
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const formattedJson = computed(() => JSON.stringify(props.data, null, 2))

const close = () => {
  emit('update:modelValue', false)
}
</script>

<template>
  <Teleport to="body">
    <div v-if="modelValue" class="modal-overlay" @click="close">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>JSON View</h3>
          <button class="close-button" @click="close">&times;</button>
        </div>
        <pre class="json-content">{{ formattedJson }}</pre>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
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
  background: var(--color-background);
  border-radius: 8px;
  padding: 1.5rem;
  max-width: 90%;
  max-height: 90vh;
  width: 600px;
  overflow: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.modal-header h3 {
  margin: 0;
  color: var(--color-heading);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--color-text);
  padding: 0.25rem 0.5rem;
  line-height: 1;
}

.json-content {
  margin: 0;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 4px;
  overflow: auto;
  font-family: monospace;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
