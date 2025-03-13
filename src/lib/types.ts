/**
 * Profile validation result
 */
export type ProfileValidationResult = {
  exists: boolean
  profile: string
  likesCount?: number
  error?: string
}

/**
 * Widget code generation result
 */
export type WidgetCodeResult = {
  html: string
  markdown: string
  profile: string
  likesCount: number
}
