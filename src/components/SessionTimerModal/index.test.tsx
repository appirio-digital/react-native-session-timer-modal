import React from 'react'
import { shallow } from 'enzyme'

import SessionTimerModal from './index'

jest.mock('Platform', () => {
  const Platform = require.requireActual('Platform')
  Platform.OS = 'android'
  return Platform
})

jest.useFakeTimers()

describe('SessionTimerModal', () => {
  const render = shallow(<SessionTimerModal />)
  const instance = render.instance() as SessionTimerModal

  it('renders correctly', () => {
    expect(render).toBeDefined()
  })

  it('handles toggleSessionTimerModal', () => {
    instance.toggleSessionTimerModal()
  })

  it('handles hideModal', () => {
    instance.hideModal()
  })

  it('is able to unmount', () => {
    render.unmount()
  })
})
