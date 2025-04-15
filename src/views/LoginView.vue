<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useLogin, useOptionalUser } from '@/hooks/use-auth'

const router = useRouter()
const userId = ref('')

const { data: user } = useOptionalUser()
const { mutate: login, isPending } = useLogin()

const handleSubmit = () => {
  if (userId.value.trim()) {
    login(userId.value, {
      onSuccess: () => router.push('/'),
    })
  }
}

// Redirect if already logged in
if (user.value) {
  router.push('/')
}
</script>

<template>
  <div class="login-container">
    <div class="login-form">
      <h2>Welcome</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="userId">Enter your User ID:</label>
          <input
            type="text"
            id="userId"
            v-model="userId"
            required
            placeholder="Your User ID"
            autocomplete="off"
            :disabled="isPending"
          />
        </div>
        <button type="submit" :disabled="!userId.trim() || isPending">
          {{ isPending ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
}

.login-form {
  background: var(--color-background-soft, #f9fafb);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  margin-bottom: 2rem;
  color: var(--color-heading, #111827);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text, #374151);
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 4px;
  background: var(--color-background, #ffffff);
  color: var(--color-text, #374151);
}

input:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button {
  width: 100%;
  padding: 0.75rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background: #1d4ed8;
}
</style>
