import { css } from '@emotion/css'
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
  FocusEvent,
} from 'react'
import type { Language } from '../components/CodeTextarea'
import { Tabs } from '../components/Tabs'
import { isDev } from '../constants/env'
import { fontMap as defaultFontMap } from '../constants/font'
import * as markdown from '../constants/template/markdown'
import * as rirekisho from '../constants/template/rirekisho'
import { usePreviewIframe } from '../hooks/usePreviewIframe'
import {
  fontfaces2style,
  convertFontFaces,
  fontWeightList,
  FontWeight,
} from '../utils/fontfaces2style'
import marked from '../utils/marked'

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
  const [md, setMd] = useState(markdown.markdown)
  const [html, setHtml] = useState(rirekisho.html)
  const [cssString, setCss] = useState(markdown.css)
  const [language, setLanguage] = useState<Language>('markdown')
  const [previewMode, setPreviewMode] = useState('iframe')
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
  const styleSheet = useMemo(
    () =>
      '<style>' +
      fontFamilyStyle +
      `\n * { font-family: ${fontFamilyName} }\n` +
      cssString +
      '</style>',
    [cssString, fontFamilyStyle]
  )

  const contents = useMemo(
    () => (language === 'markdown' ? marked(md) : html),
    [language, html, md]
  )

  const displayHtml = useMemo(
    () =>
      '<body>' +
      styleSheet +
      '<div style="min-width:100vw">' +
      contents +
      '</div>' +
      '</body>',
    [contents, styleSheet]
  )
  const weightList = useMemo(
    () =>
      fontWeightList.filter((w) => !Object.keys(fontMap).includes(w as any)),
    [fontMap]
  )
  const [pdfBlob, setPdfBlob] = useState<string>('')
  const [iframeUrl, updateIframe] = usePreviewIframe(displayHtml)
  const [format, setFormat] = useState('a3')
  const [orientation, setOrientation] = useState<'l' | 'p'>('l')
  const doc = useRef(new jsPDF())
  const editCodeValue = useMemo(() => {
    if (language === 'html') return html
    if (language === 'markdown') return md
    if (language === 'css') return cssString
    return ''
  }, [language, md, html, cssString])
  const updatePdf = useCallback(async () => {
    doc.current = new jsPDF({
      format,
      orientation,
      unit: 'px',
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
  const handleChangeLanguage = useCallback((lang) => setLanguage(lang), [
    setLanguage,
  ])
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

  const handleChangeCode = useCallback(
    (code: string) => {
      if (language === 'html') {
        setHtml(code)
        return
      }
      if (language === 'css') {
        setCss(code)
        return
      }
      if (language === 'markdown') {
        setMd(code)
      }
    },
    [language]
  )

  const handleBlurFormat = useCallback(
    (ev: FocusEvent<HTMLSelectElement>) => {
      setFormat(ev.target.value)
      updatePreview()
    },
    [setFormat, updatePreview]
  )

  const handleBlurOrientation = useCallback(
    (ev: FocusEvent<HTMLSelectElement>) => {
      setOrientation(ev.target.value as 'l' | 'p')
      updatePreview()
    },
    [setOrientation, updatePreview]
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
        <div style={{ display: 'flex' }}>
          <select defaultValue={orientation} onBlur={handleBlurOrientation}>
            <option value="l">landscape(横)</option>
            <option value="p">portrait(縦)</option>
          </select>
          <select defaultValue={format} onBlur={handleBlurFormat}>
            <option value="a3">a3</option>
            <option value="a4">a4</option>
          </select>
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
          {isDev && (
            <button onClick={() => console.log(pdfBlob)}>Debug console.</button>
          )}
          <button onClick={() => doc.current.save(Date.now() + '.pdf')}>
            Download pdf
          </button>
        </div>
        <div>
          <Tabs
            list={[
              { value: 'html', text: 'HTML' },
              { value: 'css', text: 'CSS' },
              { value: 'markdown', text: 'Markdown' },
            ]}
            onChangeTab={handleChangeLanguage}
            activeValue={language}
          />
          <CodeTextarea
            className={css`
              width: 500px;
              height: 500px;
            `}
            language={language}
            value={editCodeValue}
            onChangeValue={handleChangeCode}
            onBlur={console.log}
          />
        </div>
        <div>
          <Tabs
            list={[
              { value: 'iframe', text: 'Preview Html' },
              { value: 'pdf', text: 'PDF preview' },
            ]}
            onChangeTab={setPreviewMode as any}
            activeValue={previewMode}
          />
          {previewMode === 'iframe' && (
            <iframe
              /* TODO: Web font not updated. */
              title="Preview HTML"
              src={iframeUrl}
              width="100%"
              height="400px"
            />
          )}
          {previewMode === 'pdf' && <PdfViewer data={pdfBlob} />}
        </div>
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
    </>
  )
}

export default Home
