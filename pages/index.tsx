import Head from 'next/head'
import { useState } from 'react'
import { jsPDF } from 'jspdf'
import { PdfViewer } from '../components/PdfViewer'

// TODO: Fix for render "Hello world!"
const doc = new jsPDF()
doc.html('<h1>hello world!</h1>')
const samplePdfData = doc.output()

export const Home = (): JSX.Element => {
  const [data] = useState<string>(samplePdfData)
  // const [data] = useState<string>(samplePdfUrl)
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <PdfViewer data={data} />
      </div>
      <button onClick={() => console.log(samplePdfData)}>console.</button>
      <button onClick={() => doc.save('a.pdf')}>Download pdf!</button>
    </>
  )
}

export default Home
