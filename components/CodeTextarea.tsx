import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import React, { FC, useRef, useEffect, HTMLAttributes } from 'react'

const WORKER_BASE_PATH = '_next/static/'
export type Language = 'html' | 'css' | 'markdown'
interface Props extends HTMLAttributes<HTMLDivElement> {
  value: string
  language: Language
  onChangeValue: (val: string) => void
}
export const CodeTextarea: FC<Props> = ({
  value,
  language,
  onChangeValue,
  onBlur,
  ...rest
}) => {
  const divEl = useRef<HTMLDivElement>(null)
  const editor = useRef<monaco.editor.IStandaloneCodeEditor>()
  useEffect(() => {
    if (!process.browser) return
    // @ts-expect-error
    if (window.MonacoEnvironment?.getWorkerUrl) return
    // @ts-expect-error
    window.MonacoEnvironment = {
      getWorkerUrl: function (_moduleId: any, label: string) {
        if (label === 'json') {
          return `${WORKER_BASE_PATH}/json.worker.bundle.js`
        }
        if (label === 'css' || label === 'scss' || label === 'less') {
          return `${WORKER_BASE_PATH}/css.worker.bundle.js`
        }
        if (label === 'html' || label === 'handlebars' || label === 'razor') {
          return `${WORKER_BASE_PATH}/html.worker.bundle.js`
        }
        if (label === 'typescript' || label === 'javascript') {
          return `${WORKER_BASE_PATH}/ts.worker.bundle.js`
        }
        return `${WORKER_BASE_PATH}/editor.worker.bundle.js`
      },
    }
  }, [])
  useEffect(() => {
    if (!divEl.current) return
    editor.current = monaco.editor.create(divEl.current, {
      value,
      language,
    })

    editor.current.onDidChangeModelContent(
      (ev: monaco.editor.IModelContentChangedEvent) => {
        if (!editor.current) return
        onChangeValue(editor.current.getValue())
      }
    )
    editor.current.onDidBlurEditorText(onBlur)
    return () => {
      if (!editor.current) return
      editor.current.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  return <div ref={divEl} {...rest} />
}

export default CodeTextarea
