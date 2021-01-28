// import Form from '@rjsf/core'
import { jsPDF } from 'jspdf'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  InputHTMLAttributes,
  FocusEventHandler,
} from 'react'
import { fontMap as defaultFontMap } from '../constants/font'
import * as rirekisho from '../constants/template/rirekisho'
import { usePreviewIframe } from '../hooks/usePreviewIframe'
import {
  fontfaces2style,
  convertFontFaces,
  fontWeightList,
  FontWeight,
} from '../utils/fontfaces2style'

const CodeTextarea = dynamic(() => import('../components/CodeTextarea'), {
  ssr: false,
})

const PdfViewer = dynamic(() => import('../components/PdfViewer'), {
  ssr: false,
})
type H2cOptKey = 'scale' | 'scrollX' | 'scrollY'
type H2cOptsConfig = {
  [key in H2cOptKey]: InputHTMLAttributes<HTMLInputElement>
}
const editH2cOptsConfig: H2cOptsConfig = {
  scale: { type: 'number', min: 0.1, max: 3, step: 0.05 },
  scrollX: { type: 'number', step: 1 },
  scrollY: { type: 'number', step: 1 },
}
const editH2cOptKeys: Array<H2cOptKey> = Object.keys(editH2cOptsConfig) as any

const fontFamilyName = 'moji'
export const Home = (): JSX.Element => {
  const [html, setHtml] = useState(rirekisho.html)
  const [css, setCss] = useState(rirekisho.css)
  const [h2cOpts, setH2cOpts] = useState<{ [key in H2cOptKey]: number }>({
    scale: 0.7,
    scrollX: 70,
    scrollY: 40,
  })
  const [fontMap, setFontMap] = useState(defaultFontMap)
  const fontFaces = useMemo(() => convertFontFaces(fontFamilyName, fontMap), [
    fontMap,
  ])
  const fontFamilyStyle = useMemo(() => fontfaces2style(fontFaces), [fontFaces])
  const displayHtml = useMemo(
    () =>
      '<body>' +
      '<style>' +
      fontFamilyStyle +
      `\n * { font-family: ${fontFamilyName} }\n` +
      css +
      '</style>' +
      '<div style="min-width:100vw">' + // For rendering of jspdf.
      html +
      '</div>' +
      '</body>',
    [css, html, fontFamilyStyle]
  )
  const weightList = useMemo(
    () =>
      fontWeightList.filter((w) => !Object.keys(fontMap).includes(w as any)),
    [fontMap]
  )
  const [pdfBlob, setPdfBlob] = useState<string>('')
  const [iframeUrl, updateIframe] = usePreviewIframe(displayHtml)
  const doc = useRef(new jsPDF())
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
      fontFaces,
      jsPDF: doc.current,
      html2canvas: {
        ...h2cOpts,
        logging: false,
      },
    })

    setPdfBlob(doc.current.output())
  }, [h2cOpts, fontFaces, displayHtml])
  // const handleChangeFontFaces = useCallback(
  //   (ev) => {
  //     console.log(ev)
  //     // setFontFaces(ev.formData)
  //   },
  //   [setFontFaces]
  // )
  const updatePreview = useCallback(() => {
    updatePdf()
    updateIframe(displayHtml)
  }, [updatePdf, updateIframe, displayHtml])
  const handleChangeH2cOpts = useCallback(
    (ev: React.ChangeEvent<HTMLInputElement>) => {
      if (!editH2cOptKeys.includes(ev.target.name as any)) return
      setH2cOpts({
        ...h2cOpts,
        [ev.target.name]: +ev.target.value,
      })
    },
    [h2cOpts]
  )
  const handleBlurFontWeight = useCallback(
    (key: FontWeight): FocusEventHandler<HTMLSelectElement> => (ev) => {
      const { [key]: value, ...rest } = fontMap
      if (!ev.target.value) return
      setFontMap({
        ...rest,
        [ev.target.value]: value,
      } as any)
      updatePreview()
    },
    [fontMap, updatePreview]
  )

  const handleBlurFontUrl = useCallback(
    (key: FontWeight): FocusEventHandler<HTMLInputElement> => (ev) => {
      setFontMap({
        ...fontMap,
        [key]: ev.target.value,
      })
      updatePreview()
    },
    [fontMap, updatePreview]
  )

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
        <CodeTextarea
          language={'html'}
          value={html}
          onChange={setHtml}
          onBlur={console.log}
        />
        <CodeTextarea
          language={'css'}
          value={css}
          onChange={setCss}
          onBlur={console.log}
        />
        <div>
          {Object.entries(fontMap).map(([weight, url], i) => (
            <div key={weight}>
              <select
                defaultValue={weight}
                onBlur={handleBlurFontWeight(weight as FontWeight)}
              >
                {[weight, ...weightList].map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <input
                type="text"
                defaultValue={url}
                onBlur={handleBlurFontUrl(weight as FontWeight)}
              />
            </div>
          ))}
        </div>
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
          /* TODO: Web font not updated. */
          title="Preview HTML"
          src={iframeUrl}
          width="100%"
          height="400px"
        />
        <div style={{ display: 'flex' }}>
          {editH2cOptKeys.map((optName: H2cOptKey, i) => (
            <label key={i}>
              {optName}:
              <input
                name={optName}
                type="number"
                value={h2cOpts[optName]}
                onChange={handleChangeH2cOpts}
                onBlur={updatePdf}
                {...editH2cOptsConfig[optName]}
              />
            </label>
          ))}
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
