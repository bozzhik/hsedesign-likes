'use server'

import type {WidgetCodeResult} from '@/lib/types'
import {validateProfile} from '@/lib/validate-profile'

export async function generateWidgetCode(formData: FormData): Promise<WidgetCodeResult | null> {
  const result = await validateProfile(formData)

  if (!result.exists) {
    return null
  }

  const {profile, likesCount = 0} = result

  const html = generateHtmlCode(profile, likesCount)
  const markdown = generateMarkdownCode(profile, likesCount)

  return {html, markdown, profile, likesCount}
}

function generateHtmlCode(profile: string, likesCount: number): string {
  const widgetUrl = `https://hsedesign.bozzhik.com/api/widget?profile=${profile}`
  return `<img src="${widgetUrl}?format=svg" alt="HSE Design Likes" />`
}

function generateMarkdownCode(profile: string, likesCount: number): string {
  const widgetUrl = `https://hsedesign.bozzhik.com/api/widget?profile=${profile}`
  return `![HSE Design Likes](${widgetUrl}?format=svg)`
}
