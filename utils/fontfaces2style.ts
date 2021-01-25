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

export type FontWeight = Exclude<HTMLFontFace['weight'], undefined | number>
// TODO: Fix type to avoid having to associate values with all keys.
export type FontMap = {
  [key in FontWeight]: string
}
export const fontWeightList: Array<FontWeight> = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
]

// Refferences: https://github.com/MrRio/jsPDF/pull/3040/files#diff-539eefab6f8ab52ca4b421fe2d8964bdaf77aa47ac8146edb374af84eaaee46d
export const convertFontFaces = (
  name: string,
  fontMap: FontMap
): HTMLFontFace[] => {
  // @ts-expect-error
  const entry: Array<[keyof FontMap, string]> = Object.entries(fontMap)
  return entry.map(
    ([weight, url]): HTMLFontFace => ({
      weight,
      family: name,
      src: [
        {
          url,
          format: 'truetype',
        },
      ],
    })
  )
}
