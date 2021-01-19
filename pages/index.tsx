import Head from 'next/head'
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { HTMLFontFace, jsPDF } from 'jspdf'
import { PdfViewer } from '../components/PdfViewer'
import { usePreviewIframe } from '../hooks/usePreviewIframe'
import { useInput } from '../hooks/useInput'

// Refferences: https://github.com/MrRio/jsPDF/pull/3040/files#diff-539eefab6f8ab52ca4b421fe2d8964bdaf77aa47ac8146edb374af84eaaee46d
const fontFaces: HTMLFontFace[] = [
  {
    family: 'Mouhitsu',
    src: [
      {
        url: 'http://localhost:3000/MouhitsuBold.ttf',
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Roboto',
    weight: 400,
    src: [
      {
        url: 'http://localhost:3000/Roboto/Roboto-Regular.ttf',
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Roboto',
    weight: 700,
    src: [
      {
        url: 'http://localhost:3000/Roboto/Roboto-Bold.ttf',
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Roboto',
    weight: 'bold',
    style: 'italic',
    src: [
      {
        url: 'http://localhost:3000/Roboto/Roboto-BoldItalic.ttf',
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Roboto',
    style: 'italic',
    src: [
      {
        url: 'http://localhost:3000/Roboto/Roboto-Italic.ttf',
        format: 'truetype',
      },
    ],
  },
]

const toFontFaceRule = (fontFace: HTMLFontFace) => {
  const srcs = fontFace.src.map(
    (src) => `url('${src.url}') format('${src.format}')`
  )

  const cssProps = [
    `font-family: ${fontFace.family}`,
    fontFace.stretch && `font-stretch: ${fontFace.stretch}`,
    fontFace.style && `font-style: ${fontFace.style}`,
    fontFace.weight && `font-weight: ${fontFace.weight}`,
    `src: ${srcs.join('\n')}`,
  ]

  return `
    @font-face {
      ${cssProps.filter((a) => a).join(';\n')} 
    }
  `
}

const initCss = `
${fontFaces.map(toFontFaceRule).join('\n')}
body {
  font-size: 14px;
}

.sans-serif {
  font-family: sans-serif;
}
.roboto {
  font-family: 'Roboto';
}

.generic {
  font-family: monospace; 
} 
.default {
  font-family: serif;
}
.bold {
  font-weight: bold;
}

.italic {
  font-style: italic;
}

.mouhitsu {
  font-family: 'Mouhitsu';
}
`
const initHtml = `
<div style="width: 200px; height: 200px;"> 
  <p class="default">
  The quick brown fox jumps over the lazy dog (default)
  <p>
  <p class="generic">
  The quick brown fox jumps over the lazy dog (generic)
  <p>
  <p class="sans-serif">
  The quick brown fox jumps over the lazy dog (sans-serif)
  <p>
  <p class="mouhitsu">なに</p>
  <div class="roboto">
    <p>
    The quick brown fox jumps over the lazy dog (roboto)
    <p>
    <p class="bold">
    The quick brown fox jumps over the lazy dog (roboto bold)
    <p>
    <p class="italic">
    The quick brown fox jumps over the lazy dog (roboto italic)
    <p>
    <p class="bold italic">
    The quick brown fox jumps over the lazy dog (roboto bold italic)
    <p> 
  </div>
</div>`

export const Home = (): JSX.Element => {
  const [html, { handleInput: handleChangeForHtml }] = useInput(initHtml)
  const [css, { handleInput: handleChangeForCss }] = useInput(initCss)
  const displayHtml = useMemo(
    () => '<body>' + '<style>' + css + '</style>' + html + '</body>',
    [css, html]
  )
  const [pdfBlob, setPdfBlob] = useState<string>('')
  const [iframeUrl, updateIframe] = usePreviewIframe(displayHtml)
  // const [isLoading, setLoading] = useState(true)
  const doc = useRef(new jsPDF())
  const updatePdf = useCallback(async (html: string) => {
    doc.current = new jsPDF()
    // TODO: Fix render japanese.
    // reffernces: https://github.com/MrRio/jsPDF/pull/3040
    await doc.current.html(html, {
      fontFaces,
      jsPDF: doc.current,
    })
    setPdfBlob(doc.current.output())
  }, [])
  const handleBlurTextArea = useCallback(() => {
    updatePdf(displayHtml)
    updateIframe(displayHtml)
  }, [displayHtml])
  useEffect(() => {
    console.log('load: ', Date.now())
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
        <iframe src={iframeUrl} width="100%" height="400px" />
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
