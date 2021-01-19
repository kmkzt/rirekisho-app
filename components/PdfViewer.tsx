import * as pdfjsLib from 'pdfjs-dist'
import {
  FC,
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import 'pdfjs-dist/web/pdf_viewer.css'

// TODO: optimize import timing.
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

  const loadPdfUrl = useCallback(
    (url: string) => {
      const loadingTask = pdfjsLib.getDocument(url)
      loadingTask.promise.then(renderPdfViewer)
    },
    [renderPdfViewer]
  )

  const loadPdfData = useCallback(
    (data: string) => {
      const loadingTask = pdfjsLib.getDocument({ data })
      loadingTask.promise.then(renderPdfViewer)
    },
    [renderPdfViewer]
  )

  const load = useCallback(() => {
    if (!data) {
      console.error('data is empty!')
      return
    }
    if (isUrl(data)) loadPdfUrl(data)
    else loadPdfData(data)
  }, [data, loadPdfData, loadPdfUrl])

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

export const PdfRenderArea = forwardRef<HTMLDivElement>((props, ref) => (
  <div ref={ref}>
    <div id="viewer" className="pdfViewer" />
  </div>
))

export const PdfViewer: FC<Props> = (props) => {
  const [viewerRef, { isLoading, load }] = usePdfViewer(props)
  useEffect(load, [load])
  return (
    <>
      {isLoading && <div>Loading...</div>}
      <PdfRenderArea ref={viewerRef} />
    </>
  )
}
