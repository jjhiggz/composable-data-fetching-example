import type { Character } from './character.type'

type AllCharacterFilters = {
  page: number
  status: string
  species: string
  name: string
  gender: 'male' | 'female'
}

export type CharacterFiltersPartial = Partial<AllCharacterFilters>

export const getCharacters = async (
  filters: CharacterFiltersPartial = {},
): Promise<Character[]> => {
  // Convert number values to strings for URLSearchParams
  const stringifiedFilters = Object.entries(filters).reduce(
    (acc, [key, value]) => ({
      ...acc,
      [key]: String(value),
    }),
    {} as Record<string, string>,
  )

  const urlSearchParams = new URLSearchParams(stringifiedFilters)
  const response = await fetch(
    `https://rickandmortyapi.com/api/character?${urlSearchParams.toString()}`,
  )
  const json = await response.json()

  // The Rick and Morty API returns { info: {...}, results: [...] }
  return json.results
}
