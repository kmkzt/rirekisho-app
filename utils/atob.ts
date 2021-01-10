export const atob = (str: string): string => {
  if (process.browser) {
    return window.atob(str)
  }
  return new Buffer(str, 'base64').toString('binary')
}
