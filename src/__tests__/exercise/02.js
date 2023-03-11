// simple test with ReactDOM
// http://localhost:3000/counter

import {fireEvent, render, screen} from '@testing-library/react'
import Counter from '../../components/counter'

// NOTE: this is a new requirement in React 18
// https://reactjs.org/blog/2022/03/08/react-18-upgrade-guide.html#configuring-your-testing-environment
// Luckily, it's handled for you by React Testing Library :)
global.IS_REACT_ACT_ENVIRONMENT = true

test('counter increments and decrements when the buttons are clicked', () => {
  render(<Counter />)

  const decrementBtn = screen.getByText(/decrement/i, {selector: 'button'})
  const incrementBtn = screen.getByText(/increment/i, {selector: 'button'})
  const message = screen.getByText(/current count: */i)
  //
  expect(message.textContent).toBe('Current count: 0')
  fireEvent.click(incrementBtn)
  expect(message.textContent).toBe('Current count: 1')
  fireEvent.click(decrementBtn)
  expect(message.textContent).toBe('Current count: 0')
})

/* eslint no-unused-vars:0 */
