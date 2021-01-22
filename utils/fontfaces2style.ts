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

// TODO: Fix type to avoid having to associate values with all keys.
export type FontMap = {
  [key in Exclude<HTMLFontFace['weight'], undefined>]: string[] | undefined
}

// Refferences: https://github.com/MrRio/jsPDF/pull/3040/files#diff-539eefab6f8ab52ca4b421fe2d8964bdaf77aa47ac8146edb374af84eaaee46d
export const convertFontFaces = (
  name: string,
  fontMap: FontMap
): HTMLFontFace[] => {
  // @ts-expect-error
  const entry: Array<[FontMapKey, Array<string>]> = Object.entries(fontMap)
  return entry.map(
    ([weight, srclist]: [keyof FontMap, string[]]): HTMLFontFace => ({
      weight,
      family: name,
      src: srclist.map((url) => ({
        url,
        format: 'truetype',
      })),
    })
  )
}
