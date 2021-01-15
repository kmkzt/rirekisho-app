import Head from 'next/head'
import { useEffect, useState, useRef, useCallback } from 'react'
import { jsPDF } from 'jspdf'
import { PdfViewer } from '../components/PdfViewer'
import { usePreviewIframe } from '../hooks/usePreviewIframe'

// const loadBinaryResource = (url: string, unicodeCleanUp?: boolean) => {
//   const req = new XMLHttpRequest();
//   req.open("GET", url, false);
//   // XHR binary charset opt by Marcus Granado 2006 [http://mgran.blogspot.com]
//   req.overrideMimeType("text/plain; charset=x-user-defined");
//   req.send(null);
//   if (req.status !== 200) {
//     throw new Error("Unable to load file");
//   }

//   const responseText = req.responseText;
//   if (unicodeCleanUp) {
//     const StringFromCharCode = String.fromCharCode;
//     const byteArray = new Array(req.responseText.length);

//     for (let i = 0; i < responseText.length; i += 1) {
//       byteArray[i] = StringFromCharCode(responseText.charCodeAt(i) & 0xff);
//     }
//     return byteArray.join("");
//   }

//   return req.responseText;
// };

const initHtml = `<style>
@font-face {
  font-family: 'Mouhitsu';
  font-weight: 400;
  src: url('http://localhost:3000/MouhitsuBold.ttf') format('truetype');
}
* {
  font-family: 'Mouhitsu';
}
</style>
<h1>テスト</h1>
<p>AAA</p>
`

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
      jsPDF: doc.current,
      fontFaces: [
        {
          family: 'Mouhitsu',
          src: [
            {
              url: 'http://localhost:3000/MouhitsuBold.ttf',
              format: 'truetype',
            },
          ],
        },
      ],
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
