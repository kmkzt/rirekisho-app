import React from 'react'
import { Home } from '../../pages/index'
import { render, fireEvent } from '../testUtils'

describe('Home page', () => {
  it.skip('matches snapshot', () => {
    const { asFragment } = render(<Home />, {})
    expect(asFragment()).toMatchSnapshot()
  })

  it.skip('clicking button triggers alert', () => {
    const { getByText } = render(<Home />, {})
    window.alert = jest.fn()
    fireEvent.click(getByText('Test Button'))
    expect(window.alert).toHaveBeenCalledWith('With typescript and Jest')
  })
})
