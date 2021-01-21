import { HTMLFontFace } from 'jspdf'

const HOST = process.env.VERCEL_URL
  ? `//${process.env.VERCEL_URL}`
  : `//localhost:3000`
// TODO: Fix hostname
// Refferences: https://github.com/MrRio/jsPDF/pull/3040/files#diff-539eefab6f8ab52ca4b421fe2d8964bdaf77aa47ac8146edb374af84eaaee46d
export const exampleFontFaces: HTMLFontFace[] = [
  {
    family: 'Koruri',
    weight: 300,
    src: [
      {
        url: `${HOST}/koruri/Koruri-Light.ttf`,
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Koruri',
    weight: 400,
    src: [
      {
        url: `${HOST}/koruri/Koruri-Regular.ttf`,
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Koruri',
    weight: 500,
    src: [
      {
        url: `${HOST}/koruri/Koruri-Semibold.ttf`,
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Koruri',
    weight: 700,
    src: [
      {
        url: `${HOST}/koruri/Koruri-Bold.ttf`,
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Koruri',
    weight: 900,
    src: [
      {
        url: `${HOST}/koruri/Koruri-Extrabold.ttf`,
        format: 'truetype',
      },
    ],
  },
]

export const exampleCss = `
* {
  font-family: 'Koruri';
}
`

export const exampleHtml = `
  <h1>あいうえお</h1>
  <h2>かきくけこ</h2>
  <h3>さしすせそ</h3>
  <h4>たちつてと</h4>
  <h5>なにぬねの</h5>
  <h6>はひふへほ</h6>
  <p>まみむめも</p>`
