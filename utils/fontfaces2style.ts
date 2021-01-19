import { HTMLFontFace } from 'jspdf'

export const toFontFaceRule = ({
  family,
  src,
  stretch,
  style,
  weight,
}: HTMLFontFace) => {
  const srcs = src.map(({ url, format }) => `url('${url}') format('${format}')`)

  const cssProps = [
    `font-family: ${family}`,
    stretch && `font-stretch: ${stretch}`,
    style && `font-style: ${style}`,
    weight && `font-weight: ${weight}`,
    `src: ${srcs.join('\n')}`,
  ]

  return `@font-face { ${cssProps.filter(Boolean).join(';\n')} }`
}

export const fontfaces2style = (fontFaces: HTMLFontFace[]) =>
  `${fontFaces.map(toFontFaceRule).join('\n')}`
