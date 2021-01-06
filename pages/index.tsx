import Head from 'next/head'
import * as pdfjsLib from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/build/pdf.worker.entry')

const loadingTask = pdfjsLib.getDocument('http://localhost:3000/sample.pdf')

loadingTask.promise.then((pdf) => {
  console.log(pdf)
})

export const Home = (): JSX.Element => (
  <div className="container">
    <Head>
      <title>Create Next App</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main></main>
  </div>
)

export default Home
