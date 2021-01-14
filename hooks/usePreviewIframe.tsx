import { useCallback, useEffect, useState } from 'react'

export const usePreviewIframe = (
  html: string
): [string, (htm: string) => void] => {
  const [url, setUrl] = useState<string>('')
  const update = useCallback(
    (uHtml) => {
      if (url) URL.revokeObjectURL(url)
      const blob = new Blob([uHtml], { type: 'text/html' })
      setUrl(URL.createObjectURL(blob))
    },
    [url]
  )
  useEffect(() => {
    update(html)
  }, [])
  return [url, update]
}
