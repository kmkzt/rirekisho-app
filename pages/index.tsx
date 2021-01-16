import Head from 'next/head'
import { useEffect, useState, useRef, useCallback } from 'react'
import { HTMLFontFace, jsPDF } from 'jspdf'
import { PdfViewer } from '../components/PdfViewer'
import { usePreviewIframe } from '../hooks/usePreviewIframe'

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

const initHtml = `
<div style="width: 200px; height: 200px;"> 
  <style>
    ${fontFaces.map(toFontFaceRule)}
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
  </style>
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
  const [html, setHtml] = useState(initHtml)
  const [pdfBlob, setPdfBlob] = useState<string>('')
  const [iframeUrl, updateIframe] = usePreviewIframe(html)
  // const [isLoading, setLoading] = useState(true)
  const doc = useRef(new jsPDF())
  const updatePdf = useCallback(async (htmlString: string) => {
    doc.current = new jsPDF()
    // TODO: Fix render japanese.
    // reffernces: https://github.com/MrRio/jsPDF/pull/3040
    await doc.current.html(htmlString, {
      fontFaces,
      jsPDF: doc.current,
    })
    // refferences: https://github.com/MrRio/jsPDF/blob/master/test/specs/japanese.spec.js
    // const fontBlob = loadBinaryResource('/MouhitsuBold.ttf')
    // doc.current.addFileToVFS("MouhitsuBold.ttf", fontBlob );
    // doc.current.addFont("MouhitsuBold.ttf", "Mouhitsu", "bold");
    // doc.current.setFont("Mouhitsu", "bold"); // set font
    // doc.current.setLanguage("ja");
    // doc.current.setFontSize(20);
    // doc.current.text("なに", 20, 20);
    // console.log(worker)
    setPdfBlob(doc.current.output())
  }, [])
  const handleChangeTextArea = useCallback(
    (ev: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHtml(ev.target.value)
    },
    [setHtml]
  )
  const handleBlurTextArea = useCallback(() => {
    updatePdf(html)
    updateIframe(html)
  }, [html])
  useEffect(() => {
    console.log('load: ', Date.now())
    if (process.browser) {
      updatePdf(html)
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
          onChange={handleChangeTextArea}
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
