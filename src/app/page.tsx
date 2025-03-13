import Link from 'next/link'
import {WidgetGenerator} from '@/components/widget-generator'

export default function HomePage() {
  return (
    <main className="min-h-screen grid place-items-center bg-neutral-50">
      <div className="w-full max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-1.5">
          <h1 className="text-3xl font-extrabold">HSE Design Likes Widget Generator</h1>
          <p className="text-neutral-600">
            Create a simple likes widget for your{' '}
            <Link href="https://hsedesign.ru/designer/bozzhik" target="_blank" rel="noopener noreferrer" className="text-blue-900 hover:underline underline-blue-900 hover:text-neutral-900">
              HSE Design
            </Link>{' '}
            portfolio
          </p>
        </div>

        <WidgetGenerator />
      </div>
    </main>
  )
}
