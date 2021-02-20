import { css } from '@emotion/css'
import React, { FC, useCallback } from 'react'

interface Props {
  list: Array<{ value: string; text: string }>
  onChangeTab: (val: string) => void
  activeValue: string
}

export const Tabs: FC<Props> = ({
  list,
  onChangeTab: changeTab,
  activeValue,
}) => {
  const handleClickTab = useCallback((val) => () => changeTab(val), [changeTab])
  return (
    <div
      className={css`
        display: flex;
        justify-content: flex-start;
      `}
    >
      {list.map(({ text, value }, i) => {
        const isActive = activeValue === value
        return (
          <div
            key={value}
            className={css({
              padding: '2px 5px',
              borderRadius: '3px 3px 0 0',
              backgroundColor: isActive ? '#aaa' : '#fafafa',
            })}
            onClick={handleClickTab(value)}
          >
            {text}
          </div>
        )
      })}
    </div>
  )
}
