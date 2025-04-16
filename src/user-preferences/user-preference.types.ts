type UserPreferenceBase = {
  id: string
  group: string
  user: string
  preferences: { key: string; value: string }[]
}

export const allKnownModals = ['balances', 'scheduled-payment']
export type KnownModal = (typeof allKnownModals)[number]

export interface FirstTimeModalPreference extends UserPreferenceBase {
  id: string
  user: string
  group: 'first-time-modal'
  preferences: { key: KnownModal; value: 'true' | 'false' }[]
}

export interface ThemePreference extends UserPreferenceBase {
  id: string
  user: string
  group: 'theme'
  preferences: { key: 'theme'; value: 'light' | 'dark' }[]
}

type KnownCurrency = 'USD' | 'EU' | 'AUD' | 'GBP'
type PreferredPaymentPreferenceType =
  | { key: 'preferredPaymentMethod'; value: 'balance' | 'credit-card' }
  | { key: 'preferredCurrency'; value: KnownCurrency }
export interface PreferredPaymentPreference extends UserPreferenceBase {
  id: string
  user: string
  group: 'preferred-payment'
  preferences: PreferredPaymentPreferenceType[]
}

export type UserPreference = FirstTimeModalPreference | ThemePreference | PreferredPaymentPreference
