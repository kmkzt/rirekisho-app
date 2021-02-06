//refference: https://vercel.com/docs/environment-variables#system-environment-variables
export const HOST = `//${
  process.env.NEXT_PUBLIC_VERCEL_URL || 'localhost:3000'
}`

export const isDev = process.env.NODE_ENV !== 'production'
