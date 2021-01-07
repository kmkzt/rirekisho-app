import {useCallback, useEffect, useRef, useState} from 'react'
import Head from 'next/head'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry')

export const Home = (): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setLoading] = useState(true)
  const pdfRenderToCanvas = useCallback((pdf: pdfjsLib.PDFDocumentProxy) => {
    pdf.getPage(1).then((page) => {
      if (!canvasRef.current) return 
      const canvasContext = canvasRef.current.getContext('2d')
      if (!canvasContext) return
      const renderTask = page.render({
        canvasContext,
        viewport: page.getViewport({ scale: 1.5 })
      })
      renderTask.promise.then(function () {
        console.log('Page rendered');
      });
    })
  },[])
  useEffect(() => {
    if (canvasRef.current && isLoading) {
      setLoading(false)
      const loadingTask = pdfjsLib.getDocument('http://localhost:3000/sample.pdf')
      loadingTask.promise.then((pdf) => {
        pdfRenderToCanvas(pdf)
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
    <canvas ref={canvasRef} />
  </div>
)
}

export default Home
