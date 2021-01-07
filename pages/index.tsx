import { useCallback, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry')

export const Home = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const viewerRef = useRef<HTMLDivElement>(null)
  const [isLoading, setLoading] = useState(true)
  const renderPdfCanvas = useCallback((pdf: pdfjsLib.PDFDocumentProxy) => {
    pdf.getPage(1).then((page) => {
      if (!canvasRef.current) return
      const viewport = page.getViewport({ scale: 1.5 })
      canvasRef.current.width = viewport.width
      canvasRef.current.height = viewport.height
      const canvasContext = canvasRef.current.getContext('2d')

      if (!canvasContext) return
      const renderTask = page.render({
        canvasContext,
        viewport,
      })
      renderTask.promise.then(() => {
        console.log('Page rendered')
      })
    })
  }, [])
  const renderPdfViewer = useCallback((pdf: pdfjsLib.PDFDocumentProxy) => {
    import('pdfjs-dist/web/pdf_viewer').then((pdfjsViewer) => {
      console.log('pdf:', pdf)
      console.log('pdfjsViewer', pdfjsViewer)
      // if (!viewerRef.current) return
      // const eventBus = new pdfjsViewer.EventBus();
      // // (Optionally) enable hyperlinks within PDF files.
      // const pdfLinkService = new pdfjsViewer.PDFLinkService({
      //   eventBus: eventBus,
      // });
      // // (Optionally) enable find controller.
      // const pdfFindController = new pdfjsViewer.PDFFindController({
      //   eventBus: eventBus,
      //   linkService: pdfLinkService,
      // });
      // const pdfViewer = new pdfjsViewer.PDFViewer({
      //   container: viewerRef.current,
      //   eventBus: eventBus,
      //   linkService: pdfLinkService,
      //   findController: pdfFindController,
      // });
      // pdfLinkService.setViewer(pdfViewer);

      // // Set pdfDocument
      // pdfViewer.setDocument(pdf);
      // pdfLinkService.setDocument(pdf, null);

      // eventBus.on("pagesinit", function () {
      //   // We can use pdfViewer now, e.g. let's change default scale.
      //   pdfViewer.currentScaleValue = "page-width";

      //   // We can try searching for things.
      //   // const SEARCH_FOR = 'HELLO'
      //   // if (SEARCH_FOR) {
      //   //   pdfFindController.executeCommand("find", { query: SEARCH_FOR });
      //   // }
      // });
    })
  }, [])

  useEffect(() => {
    if (canvasRef.current && isLoading) {
      setLoading(false)
      const loadingTask = pdfjsLib.getDocument(
        'http://localhost:3000/sample.pdf'
      )
      loadingTask.promise.then((pdf) => {
        renderPdfCanvas(pdf)
        renderPdfViewer(pdf)
      })
    }
  }, [isLoading, setLoading])
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading && <div>Loading ...</div>}
      <div ref={viewerRef} />
      <canvas ref={canvasRef} />
    </div>
  )
}

export default Home
