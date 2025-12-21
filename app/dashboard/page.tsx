'use client'

import { Suspense} from 'react'
import VideoDashboard from '@/components/VideoDashboard'
import { Loader2 } from 'lucide-react'

export default async function Page({searchParams}:{searchParams: { [key: string]: string}}) {
  const videoId = searchParams['videoId']

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        </div>
      }
    >
      <VideoDashboard videoId={videoId} />
    </Suspense>
  )
}





