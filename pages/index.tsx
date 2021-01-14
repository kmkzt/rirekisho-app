import Head from 'next/head'
import { useEffect, useState, useRef, useCallback } from 'react'
import { jsPDF } from 'jspdf'
import { PdfViewer } from '../components/PdfViewer'

export const Home = (): JSX.Element => {
  const [html] = useState('<h1>hello world!</h1>')
  const [pdfBlob, setPdfBlob] = useState<string>('')
  // const [isLoading, setLoading] = useState(true)
  const doc = useRef(new jsPDF())
  const updatePdf = useCallback(async (htmlString: string) => {
    await doc.current.html(htmlString, { jsPDF: doc.current })
    // console.log(worker)
    setPdfBlob(doc.current.output())
  }, [])
  useEffect(() => {
    console.log('load: ', Date.now())
    updatePdf(html)
  }, [])
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <button onClick={() => console.log(pdfBlob)}>Debug console.</button>
        <button onClick={() => doc.current.save(Date.now() + '.pdf')}>
          Download pdf
        </button>
        <PdfViewer data={pdfBlob} />
      </div>
    </>
  )
}

export default Home
