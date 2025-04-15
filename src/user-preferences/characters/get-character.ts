import type { Character } from './character.type'

type AllCharacterFilters = {
  status: string
  species: string
  name: string
  gender: 'male' | 'female'
}

type CharacterFiltersPartial = Partial<AllCharacterFilters>

export type CharacterFilter = {
  [K in keyof AllCharacterFilters]: {
    key: K
    value: AllCharacterFilters[K]
  }
}[keyof AllCharacterFilters]

export const getCharacters = (filters: CharacterFiltersPartial = {}): Promise<Character> => {
  const urlSearchParans = new URLSearchParams(filters)
  return fetch(`https://rickandmortyapi.com/api/character/${urlSearchParans.toString()}`)
    .then((response) => response.json())
    .then((response) => response.data)
}
