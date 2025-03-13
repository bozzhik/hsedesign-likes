'use client'

import type {ProfileValidationResult, WidgetCodeResult} from '@/lib/types'
import {Copy, AlertCircle, Check} from 'lucide-react'

import {useState} from 'react'
import {useSearchParams, useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {validateProfile} from '@/lib/validate-profile'
import {generateWidgetCode} from '@/lib/generate-code'

import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Label} from '@/components/ui/label'
import {Alert, AlertDescription} from '@/components/ui/alert'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {WidgetPreview} from '@/components/widget-preview'

type FormValues = {
  profile: string
}

type WidgetState = {
  validatedData: ProfileValidationResult | null
  generatedCode: WidgetCodeResult | null
  activeTab: 'html' | 'markdown'
  copied: boolean
}

export function WidgetGenerator() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialProfile = searchParams.get('profile') || ''

  const [widgetState, setWidgetState] = useState<WidgetState>({
    validatedData: null,
    generatedCode: null,
    activeTab: 'html',
    copied: false,
  })

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<FormValues>({
    defaultValues: {
      profile: initialProfile,
    },
  })

  const onSubmit = async (data: FormValues) => {
    try {
      const params = new URLSearchParams(searchParams)
      params.set('profile', data.profile)
      router.push(`?${params.toString()}`)

      const formData = new FormData()
      formData.append('profile', data.profile)

      // Validate profile
      const result = await validateProfile(formData)

      if (!result.exists) {
        throw new Error(result.error || 'Invalid profile ID')
      }

      // Generate widget code
      const codeResult = await generateWidgetCode(formData)
      if (!codeResult) {
        throw new Error('Failed to generate widget code')
      }

      setWidgetState((prev) => ({
        ...prev,
        validatedData: result,
        generatedCode: codeResult,
      }))
    } catch (error) {
      setWidgetState((prev) => ({
        ...prev,
        validatedData: null,
        generatedCode: null,
      }))
      throw error
    }
  }

  const copyToClipboard = () => {
    if (!widgetState.generatedCode) return

    const code = widgetState.activeTab === 'html' ? widgetState.generatedCode.html : widgetState.generatedCode.markdown

    navigator.clipboard.writeText(code)
    setWidgetState((prev) => ({...prev, copied: true}))
    setTimeout(() => setWidgetState((prev) => ({...prev, copied: false})), 2000)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Generate your HSE Design likes widget</CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} id="profile-form" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="profile">Profile username or ID</Label>

              <Input
                {...register('profile', {
                  required: 'Profile ID is required',
                  minLength: {
                    value: 3,
                    message: 'Profile ID must be at least 3 characters',
                  },
                })}
                placeholder="e.g., bozzhik or 0343560ef9f34dacb686d455776ca6eb"
              />

              <p className="text-sm text-gray-500">Enter your profile username (e.g., bozzhik) or ID from your HSE Design URL</p>
            </div>

            {errors.profile && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{errors.profile.message}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>

        <CardFooter>
          <Button type="submit" form="profile-form" disabled={isSubmitting}>
            {isSubmitting ? 'Validating...' : 'Generate Widget'}
          </Button>
        </CardFooter>
      </Card>

      {widgetState.validatedData && widgetState.generatedCode && (
        <Card>
          <CardHeader>
            <CardTitle>Your Widget</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="mb-4">
              <WidgetPreview profile={widgetState.validatedData.profile} likesCount={widgetState.validatedData.likesCount || 0} />
            </div>

            <Tabs defaultValue="html" onValueChange={(value) => setWidgetState((prev) => ({...prev, activeTab: value as 'html' | 'markdown'}))}>
              <TabsList className="mb-4">
                <TabsTrigger value="html">HTML</TabsTrigger>
                <TabsTrigger value="markdown">Markdown</TabsTrigger>
              </TabsList>

              <TabsContent value="html" className="mt-0">
                <div className="relative">
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{widgetState.generatedCode.html}</pre>
                </div>
              </TabsContent>

              <TabsContent value="markdown" className="mt-0">
                <div className="relative">
                  <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{widgetState.generatedCode.markdown}</pre>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter>
            <Button onClick={copyToClipboard} className="flex items-center gap-2">
              {widgetState.copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {widgetState.copied ? 'Copied!' : 'Copy to Clipboard'}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
