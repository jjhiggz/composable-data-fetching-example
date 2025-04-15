<script setup lang="ts">
import type { KnownModal } from '@/user-preferences/user-preference.types'

interface Props {
  onCloseForever: (modalId: KnownModal) => Promise<void>
  onCloseTemporarily: (modalId: KnownModal) => void
}

const props = defineProps<Props>()

const handleCloseForever = () => props.onCloseForever('balances')
const handleCloseTemporarily = () => props.onCloseTemporarily('balances')
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Welcome to Balances!</h3>
      </div>
      <div class="modal-body">
        <p class="balance-poem">
          Balances are fun,<br />
          Balances are cool,<br />
          If you don't like Balances,<br />
          you should get schooled
        </p>
        <div class="modal-actions">
          <button class="secondary-button" @click="handleCloseTemporarily">Close for Now</button>
          <button class="primary-button" @click="handleCloseForever">Never Show Again</button>
        </div>
      </div>
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
  backdrop-filter: blur(4px);
}

.modal-content {
  background: var(--color-background);
  border-radius: 12px;
  max-width: 90%;
  width: 500px;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  border: 1px solid var(--color-border);
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

.modal-body {
  padding: 2rem;
  background: var(--color-background);
}

.balance-poem {
  text-align: center;
  font-size: 1.25rem;
  line-height: 2;
  margin-bottom: 2rem;
  color: var(--color-text);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.primary-button,
.secondary-button {
  padding: 0.625rem 1.25rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.primary-button {
  background-color: #2563eb;
  color: white;
}

.primary-button:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.secondary-button {
  background-color: var(--color-background-soft);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.secondary-button:hover {
  background-color: var(--color-background);
  transform: translateY(-1px);
}
</style>
