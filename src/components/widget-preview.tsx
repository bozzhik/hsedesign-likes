import type {WidgetCodeResult, ProfileValidationResult} from '@/lib/types'
import {Copy, Check} from 'lucide-react'

import {Button} from '@/components/ui/button'
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'

type Props = {
  validatedData: ProfileValidationResult
  generatedCode: WidgetCodeResult
  activeTab: 'html' | 'markdown'
  copied: boolean
  onTabChange: (value: 'html' | 'markdown') => void
  onCopy: () => void
}

export function WidgetPreview({validatedData, generatedCode, activeTab, copied, onTabChange, onCopy}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Widget</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="mb-4">
          <div className="flex flex-col space-y-4">
            <h3 className="text-sm font-medium">Preview:</h3>
            <div className="p-4 border rounded-md flex items-center justify-center">
              <a href={`https://hsedesign.ru/designer/${validatedData.profile}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-sm font-medium hover:opacity-90 transition-opacity">
                ❤️ {validatedData.error ? '—' : validatedData.likesCount ?? 'undefined'}
              </a>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as 'html' | 'markdown')}>
          <TabsList className="mb-4">
            <TabsTrigger value="html">HTML</TabsTrigger>
            <TabsTrigger value="markdown">Markdown</TabsTrigger>
          </TabsList>

          <TabsContent value="html" className="mt-0">
            <div data-element="code" className="relative">
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{generatedCode.html}</pre>
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="mt-0">
            <div data-element="code" className="relative">
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">{generatedCode.markdown}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter>
        <Button onClick={onCopy} className="flex items-center gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy to Clipboard'}
        </Button>
      </CardFooter>
    </Card>
  )
}
