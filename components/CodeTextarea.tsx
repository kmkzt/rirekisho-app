import * as monaco from 'monaco-editor/esm/vs/editor/editor.api'
import React, { FC, useRef, useEffect } from 'react'

const WORKER_BASE_PATH = '_next/static/'

interface Props {
  value: string
  language: 'html' | 'css' | 'markdown'
  onChange: (val: string) => void
  onBlur: (ev?: any) => void
  size?: [number, number]
}
export const CodeTextarea: FC<Props> = ({
  value,
  language,
  onChange,
  onBlur,
  size: [width, height] = [500, 300],
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
        onChange(editor.current.getValue())
      }
    )
    editor.current.onDidBlurEditorText(onBlur)
    return () => {
      if (!editor.current) return
      editor.current.dispose()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  return (
    <div
      ref={divEl}
      className="Editor"
      style={{
        width,
        height,
      }}
    />
  )
}

export default CodeTextarea
