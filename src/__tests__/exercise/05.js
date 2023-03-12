// mocking HTTP requests
// http://localhost:3000/login-submission

import * as React from 'react'
import {render, screen, waitForElementToBeRemoved} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {build, fake} from '@jackfranklin/test-data-bot'
import Login from '../../components/login-submission'
import {rest} from 'msw'
import {setupServer} from 'msw/lib/node'

const buildLoginForm = build({
  fields: {
    username: fake(f => f.internet.userName()),
    password: fake(f => f.internet.password()),
  },
})

const PASSWORD_ERROR = 'password required'

const worker = setupServer(
  rest.post(
    'https://auth-provider.example.com/api/login',
    async (req, res, ctx) => {
      if (!req.body.password) {
        return res(ctx.status(400), ctx.json({message: PASSWORD_ERROR}))
      }
      return res(
        ctx.json({
          username: req.body.username,
        }),
      )
    },
  ),
)

beforeAll(() => worker.listen())
afterAll(() => worker.close())

test(`logging in displays the user's username`, async () => {
  render(<Login />)
  const {username, password} = buildLoginForm()

  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.type(screen.getByLabelText(/password/i), password)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))

  await waitForElementToBeRemoved(() => screen.getByLabelText('loading...'))

  expect(screen.getByText(username)).toBeInTheDocument()
})

test('omitting the password results in error', async () => {
  render(<Login />)
  const {username} = buildLoginForm()
  await userEvent.type(screen.getByLabelText(/username/i), username)
  await userEvent.click(screen.getByRole('button', {name: /submit/i}))
  await waitForElementToBeRemoved(() => screen.getByLabelText('loading...'))

  expect(screen.getByText(PASSWORD_ERROR)).toBeInTheDocument()
})
