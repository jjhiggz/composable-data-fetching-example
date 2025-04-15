import type { Character } from './character.type'

type AllCharacterFilters = {
  page: number
  status: string
  species: string
  name: string
  gender: 'male' | 'female'
}

export type CharacterFiltersPartial = Partial<AllCharacterFilters>

export const getCharacters = (filters: CharacterFiltersPartial = {}): Promise<Character[]> => {
  const urlSearchParans = new URLSearchParams(filters)
  return fetch(`https://rickandmortyapi.com/api/character/${urlSearchParans.toString()}`)
    .then((response) => response.json())
    .then((response) => response.data)
}
