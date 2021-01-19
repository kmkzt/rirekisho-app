import { HTMLFontFace, jsPDF } from 'jspdf'
import Head from 'next/head'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { PdfViewer } from '../components/PdfViewer'
import { useInput } from '../hooks/useInput'
import { usePreviewIframe } from '../hooks/usePreviewIframe'
import {
  exampleFontFaces,
  exampleCss,
  exampleHtml,
} from '../mocks/htmlExampleData'
import { fontfaces2style } from '../utils/fontfaces2style'

export const Home = (): JSX.Element => {
  const [html, { handleInput: handleChangeForHtml }] = useInput(exampleHtml)
  const [css, { handleInput: handleChangeForCss }] = useInput(exampleCss)
  const displayHtml = useMemo(
    () =>
      '<body>' +
      '<style>' +
      fontfaces2style(exampleFontFaces) +
      css +
      '</style>' +
      html +
      '</body>',
    [css, html]
  )
  const [pdfBlob, setPdfBlob] = useState<string>('')
  const [iframeUrl, updateIframe] = usePreviewIframe(displayHtml)
  const doc = useRef(new jsPDF())
  // const [isLoading, setLoading] = useState(true)
  const updatePdf = useCallback(async (html: string) => {
    doc.current = new jsPDF()
    // TODO: Fix render japanese.
    // reffernces: https://github.com/MrRio/jsPDF/pull/3040
    await doc.current.html(html, {
      fontFaces: exampleFontFaces,
      jsPDF: doc.current,
    })
    setPdfBlob(doc.current.output())
  }, [])
  const handleBlurTextArea = useCallback(() => {
    updatePdf(displayHtml)
    updateIframe(displayHtml)
  }, [updatePdf, updateIframe, displayHtml])

  useEffect(() => {
    if (process.browser) {
      updatePdf(displayHtml)
    }
  }, [])
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container">
        <textarea
          value={html}
          onChange={handleChangeForHtml}
          onBlur={handleBlurTextArea}
          rows={10}
        />
        <textarea
          value={css}
          onChange={handleChangeForCss}
          onBlur={handleBlurTextArea}
          rows={10}
        />
        <iframe
          title="Preview HTML"
          src={iframeUrl}
          width="100%"
          height="400px"
        />
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
