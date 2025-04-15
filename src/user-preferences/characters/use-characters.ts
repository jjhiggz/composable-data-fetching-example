import { useQuery } from '@tanstack/vue-query'
import { computed, ref, type ComputedRef } from 'vue'
import { getCharacters, type CharacterFiltersPartial } from './get-character'
import type { Character } from './character.type'

export const useCharacters = () => {
  const filters = ref<CharacterFiltersPartial>({})
  const filterKeys = computed(() =>
    Object.entries(filters.value).map(([key, value]) => `${key}-${value}`),
  )

  const query = useQuery({
    queryKey: ['characters', ...filterKeys.value],
    queryFn: () => getCharacters(filters.value),
    initialData: [] as Character[],
  })

  const characters: ComputedRef<Character[]> = computed(() => query.data.value)

  return {
    characters,
    filters,
    isLoading: computed(() => query.isLoading.value),
    error: computed(() => query.error.value),
  }
}
