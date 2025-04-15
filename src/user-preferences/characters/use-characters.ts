import { useQuery } from '@tanstack/vue-query'
import { computed, ref, type ComputedRef } from 'vue'
import { getCharacters, type CharacterFiltersPartial } from './get-character'
import type { Character } from './character.type'

export const useCharacters = () => {
  const filters = ref<CharacterFiltersPartial>({})
  const filterKeys = computed(() =>
    Object.entries(filters).map(([key, value]) => `${key}-${value}`),
  )

  const { data } = useQuery({
    queryKey: ['characters', ...filterKeys.value],
    queryFn: () => getCharacters(filters.value),
  })

  const characters: ComputedRef<Character[]> = computed(() => {
    return data.value ?? []
  })

  return {
    characters,
    filters,
  }
}
