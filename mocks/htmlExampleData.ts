import { HTMLFontFace } from 'jspdf'

// TODO: Fix hostname
// Refferences: https://github.com/MrRio/jsPDF/pull/3040/files#diff-539eefab6f8ab52ca4b421fe2d8964bdaf77aa47ac8146edb374af84eaaee46d
export const exampleFontFaces: HTMLFontFace[] = [
  {
    family: 'Koruri',
    weight: 300,
    src: [
      {
        url: 'http://localhost:3000/koruri/Koruri-Light.ttf',
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Koruri',
    weight: 400,
    src: [
      {
        url: 'http://localhost:3000/koruri/Koruri-Regular.ttf',
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Koruri',
    weight: 500,
    src: [
      {
        url: 'http://localhost:3000/koruri/Koruri-Semibold.ttf',
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Koruri',
    weight: 700,
    src: [
      {
        url: 'http://localhost:3000/koruri/Koruri-Bold.ttf',
        format: 'truetype',
      },
    ],
  },
  {
    family: 'Koruri',
    weight: 900,
    src: [
      {
        url: 'http://localhost:3000/koruri/Koruri-Extrabold.ttf',
        format: 'truetype',
      },
    ],
  },

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

export const exampleCss = `
body {
  font-size: 14px;
}
.koruri {
  font-family: 'Koruri';
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

export const exampleHtml = `
<div style="width: 200px; height: 200px;"> 
  <p class="koruri">こるり koruri</p>
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
