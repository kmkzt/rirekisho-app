// import Form from '@rjsf/core'
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
  const [scale, setScale] = useState(0.5)
  const [fontFaces, setFontFaces] = useState(exampleFontFaces)
  const displayHtml = useMemo(
    () =>
      '<body>' +
      '<style>' +
      fontfaces2style(fontFaces) +
      css +
      '</style>' +
      // For A3 pixel size. TODO: Compatible paper size.
      // '<div style="width: 1587px; height: 1122px;">' +
      html +
      // '</div>' +
      '</body>',
    [css, html, fontFaces]
  )
  const [pdfBlob, setPdfBlob] = useState<string>('')
  const [iframeUrl, updateIframe] = usePreviewIframe(displayHtml)
  const doc = useRef(new jsPDF())
  // const [isLoading, setLoading] = useState(true)
  const updatePdf = useCallback(async () => {
    doc.current = new jsPDF({
      orientation: 'l',
      unit: 'px',
      format: 'a3',
      compress: false,
      precision: 16,
    })
    // TODO: Fix render japanese.
    // reffernces: https://github.com/MrRio/jsPDF/pull/3040
    await doc.current.html(displayHtml, {
      fontFaces: exampleFontFaces,
      jsPDF: doc.current,
      html2canvas: {
        scale,
      },
    })
    setPdfBlob(doc.current.output())
  }, [scale, displayHtml])
  // const handleChangeFontFaces = useCallback(
  //   (ev) => {
  //     console.log(ev)
  //     // setFontFaces(ev.formData)
  //   },
  //   [setFontFaces]
  // )
  const handleChangeScale = useCallback(
    (ev) => {
      setScale(ev.target.value)
      updatePdf()
    },
    [updatePdf]
  )
  const handleBlurTextArea = useCallback(() => {
    updatePdf()
    updateIframe(displayHtml)
  }, [updatePdf, updateIframe, displayHtml])

  useEffect(() => {
    if (process.browser) {
      updatePdf()
    }
  }, [])
  return (
    <>
      <Head>
        <title>Create Next App</title>
        {/* For react-jsonschema-form 
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
        ></link>
        */}
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
        {/* TODO: Rendering error
        <Form
          schema={{
            type: 'array',
            items: {
              type: 'object',
              properties: {
                family: { type: 'string' },
                weight: { type: 'string' },
                src: {
                  type: 'array',
                  items: {
                    type: 'object',
                    properties: {
                      url: { type: 'string' },
                      format: { type: 'string' },
                    },
                  },
                },
              },
            },
          }}
          formData={exampleFontFaces}
          onChange={handleChangeFontFaces}
        /> */}
        <iframe
          title="Preview HTML"
          src={iframeUrl}
          width="100%"
          height="400px"
        />
        <div style={{ display: 'flex' }}>
          <label>
            Scale:{' '}
            <input
              type="number"
              value={scale}
              step={0.1}
              min={0.1}
              max={3}
              onChange={handleChangeScale}
            />
          </label>
          <button onClick={() => console.log(pdfBlob)}>Debug console.</button>
          <button onClick={() => doc.current.save(Date.now() + '.pdf')}>
            Download pdf
          </button>
        </div>
        <PdfViewer data={pdfBlob} />
      </div>
    </>
  )
}

export default Home
