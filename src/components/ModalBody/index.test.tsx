import React from 'react'
import { shallow } from 'enzyme'
import moment from 'moment'

import ModalBody from './index'

jest.mock('Platform', () => {
  const Platform = require.requireActual('Platform')
  Platform.OS = 'ios'
  return Platform
})

describe('ModalBody', () => {
  const mockedProps = {
    hideModal: jest.fn(),
    title: 'title',
    subtitle: 'subtitle',
    cancelButtonConfigs: {
      text: 'No',
      onPress: jest.fn(),
    },
    confirmButtonConfigs: {
      text: 'Yes',
      onPress: jest.fn(),
    },
    onTimerEnd: jest.fn(),
    modalTime: 0.003,
    modalConfigs: {
      isVisible: true,
      children: {},
    },
  }

  const render = shallow(<ModalBody {...mockedProps} />)

  it('renders correctly', () => {
    expect(render).toBeDefined()
  })

  it('can click on the yes and no buttons', () => {
    const instance = render.instance() as ModalBody
    instance.handleYesBtnPress()
    instance.handleNoBtnPress()
  })

  it('is able to trigger start timer', () => {
    const toTrigger = shallow(<ModalBody {...mockedProps} />)
    toTrigger.setState({ countdown: moment.duration(1, 'minute') })
    const instance = toTrigger.instance() as ModalBody
    instance.handleAppStateChangeForCountdown('active')
    instance.handleCountDown()
    jest.runAllTimers()
  })

  it('is able to trigger stop timer', () => {
    const toTrigger = shallow(<ModalBody {...mockedProps} />)
    toTrigger.setState({ countdown: moment.duration(1, 'milliseconds') })
    const instance = toTrigger.instance() as ModalBody
    instance.handleCountDown()
    jest.runAllTimers()
  })

  it('is able to unmount', () => {
    render.unmount()
  })
})
