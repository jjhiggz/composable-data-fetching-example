import { Optional } from 'ts-toolbelt/out/Object/Optional'
import { UserPreference } from './user-preference.types'

const throwIfNotOk = (message: string) => (response: Response) => {
  if (!response.ok) throw new Error(message)
  return response
}

const baseUrl = `http://localhost:3000`

export const getUserPreferences = (userId: string) => {
  return fetch(`${baseUrl}/user-preferences`)
    .then(throwIfNotOk('could not get user preferences'))
    .then((response) => response.json() as Promise<UserPreference[]>)
    .then((preferences) => preferences.filter((preference) => preference.user === userId))
}

export const upsertUserPreference = async (userPreference: Optional<UserPreference, 'id'>) => {
  // this is bad, but wouldn't be necessary with a proper backend
  if (!userPreference.id) {
    return fetch(`${baseUrl}/user-preferences`, {
      method: 'POST',
      headers: {
        ['Content-Type']: 'application/json',
      },
      body: JSON.stringify(userPreference),
    }).then(throwIfNotOk('Could not post user preferences'))
  }

  return fetch(`${baseUrl}/user-preferences/${userPreference.id}`, {
    method: 'POST',
    headers: {
      ['Content-Type']: 'application/json',
    },
    body: JSON.stringify(userPreference),
  }).then(throwIfNotOk('could now update user preferences'))
}
