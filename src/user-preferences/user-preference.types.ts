import type { Optional } from 'ts-toolbelt/out/Object/Optional'

type UserPreferenceBase = {
  id: string
  group: string
  user: string
}

export type KnownModals = 'balances' | 'scheduled-payment'

export interface FirstTimeModalPreference extends UserPreferenceBase {
  id: string
  user: string
  group: 'first-time-modal'
  seenModals: KnownModals[]
}

export interface ThemePreference extends UserPreferenceBase {
  id: string
  user: string
  group: 'theme'
  theme: 'light' | 'dark'
}

export interface PreferredPaymentPreference extends UserPreferenceBase {
  id: string
  user: string
  group: 'preferred-payment'
  preferredPaymentMethod: 'balances' | 'credit-card' | 'wire-transfer'
}

export type UserPreference = FirstTimeModalPreference | ThemePreference | PreferredPaymentPreference
