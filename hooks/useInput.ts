import { Dispatch, SetStateAction, useCallback, useState } from 'react'

type InputEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

export const useInput = (
  initValue = ''
): [
  string,
  {
    setValue: Dispatch<SetStateAction<string>>
    handleInput: (ev: InputEvent) => void
  }
] => {
  const [val, setValue] = useState(initValue)
  const handleInput = useCallback(
    (ev: InputEvent) => {
      setValue(ev.target.value)
    },
    [setValue]
  )
  return [
    val,
    {
      setValue,
      handleInput,
    },
  ]
}
