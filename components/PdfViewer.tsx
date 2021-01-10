import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import 'pdfjs-dist/web/pdf_viewer.css'

pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry')

interface Props {
  data?: string
}

const isUrl = (url: string) => url.startsWith('http')

/**
 * TODO: Return EventBus, PDFFindControler, PDFLinkService for easy event handling.
 */
export const usePdfViewer = ({
  data,
}: Props): [RefObject<any>, { isLoading: boolean; load: () => void }] => {
  const ref = useRef<any>(null)
  const [isLoading, setLoading] = useState(true)

  const renderPdfViewer = useCallback((pdf: pdfjsLib.PDFDocumentProxy) => {
    import('pdfjs-dist/web/pdf_viewer').then((pdfjsViewer) => {
      if (!ref.current) return
      const eventBus = new pdfjsViewer.EventBus()
      // (Optionally) enable hyperlinks within PDF files.
      const linkService = new pdfjsViewer.PDFLinkService({
        eventBus,
      })
      // (Optionally) enable find controller.
      const findController = new pdfjsViewer.PDFFindController({
        eventBus,
        linkService,
      })
      const pdfViewer = new pdfjsViewer.PDFViewer({
        eventBus,
        linkService,
        findController,
        container: ref.current,
      })
      linkService.setViewer(pdfViewer)

      // Set pdfDocument
      pdfViewer.setDocument(pdf)
      linkService.setDocument(pdf, null)

      // eventBus.on('pagesinit', () => {
      //   // We can use pdfViewer now, e.g. let's change default scale.
      //   pdfViewer.currentScaleValue = 'page-width'

      //   // We can try searching for things.
      //   const SEARCH_FOR = 'Simple'
      //   if (SEARCH_FOR) {
      //     pdfFindController.executeCommand('find', { query: SEARCH_FOR })
      //   }
      // })
    })
  }, [])

  const load = useCallback(() => {
    if (!data) {
      console.error('data is empty!')
      return
    }
    const loadingTask = isUrl(data)
      ? pdfjsLib.getDocument(data)
      : pdfjsLib.getDocument({ data })
    loadingTask.promise.then((pdf) => {
      renderPdfViewer(pdf)
    })
  }, [data, renderPdfViewer])

  useEffect(() => {
    if (ref.current && isLoading) {
      setLoading(false)
      load()
    }
  }, [isLoading, setLoading, load])

  return [
    ref,
    {
      isLoading,
      load,
    },
  ]
}
export const PdfViewer = (props: Props): JSX.Element => {
  const [viewerRef, { isLoading }] = usePdfViewer(props)
  return (
    <>
      {isLoading && <div>Loading...</div>}
      <PdfRenderArea ref={viewerRef} />
    </>
  )
}
export const PdfRenderArea = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} tabIndex={0}>
      <div id="viewer" className="pdfViewer" />
    </div>
  )
})
