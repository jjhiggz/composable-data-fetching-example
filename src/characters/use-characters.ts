import { useQuery } from '@tanstack/vue-query'
import { computed, ref, watch, type ComputedRef } from 'vue'
import { getCharacters, type CharacterFiltersPartial } from './get-character'
import type { Character } from './character.type'

export const useCharacters = () => {
  const filters = ref<CharacterFiltersPartial>({})
  const filterKey = computed(() =>
    Object.entries(filters.value)
      .map(([key, value]) => `${key}-${value}`)
      .join('.'),
  )

  const query = useQuery({
    queryKey: ['characters', filterKey],
    queryFn: () => getCharacters(filters.value),
  })

  return {
    filters,
    query,
  }
}
