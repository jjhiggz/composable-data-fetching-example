<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userId = ref('')

onMounted(() => {
  userId.value = localStorage.getItem('userId') || ''
})

const handleLogout = () => {
  const { id: _, user: __, group: ___, ...relevantData } = pref
  router.push('/login')
}
</script>

<template>
  <main>
    <div class="user-info">
      <span>Welcome, {{ userId }}</span>
      <button @click="handleLogout" class="logout-button">Logout</button>
    </div>
  </main>
</template>

<style scoped>
.user-info {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem;
  gap: 1rem;
}

.logout-button {
  padding: 0.5rem 1rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

.logout-button:hover {
  background-color: #b91c1c;
}
</style>
