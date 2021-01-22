import { FontMap } from '../utils/fontfaces2style'
import { HOST } from './env'

// @ts-expect-error
export const fontMap: FontMap = {
  [300]: [`${HOST}/koruri/Koruri-Light.ttf`],
  [400]: [`${HOST}/koruri/Koruri-Regular.ttf`],
  [500]: [`${HOST}/koruri/Koruri-Semibold.ttf`],
  [700]: [`${HOST}/koruri/Koruri-Bold.ttf`],
  [900]: [`${HOST}/koruri/Koruri-Extrabold.ttf`],
}
