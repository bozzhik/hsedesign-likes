'use server'

import type {ProfileValidationResult} from '@/lib/types'

export async function validateProfile(formData: FormData): Promise<ProfileValidationResult> {
  const profile = formData.get('profile') as string

  if (!profile || profile.trim() === '') {
    return {
      exists: false,
      profile: '',
      error: 'Please enter a profile ID',
    }
  }

  const cleanId = profile.trim().replace(/^https?:\/\/hsedesign\.ru\/designer\//, '')

  if (!cleanId || cleanId.length < 3) {
    return {
      exists: false,
      profile: cleanId,
      error: 'Invalid profile ID format',
    }
  }

  return {
    exists: true,
    profile: cleanId,
  }
}
