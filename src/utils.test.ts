import {
  startSessionTimer,
  handleAppStateChangeForBackgroundTimer,
  init,
} from './utils'

describe('utils', () => {
  init({
    backgroundTime: 0.01,
    modalTime: 0.01,
    hideModal: jest.fn(),
    defaultCallback: jest.fn(),
    confirmButtonConfigs: {},
    cancelButtonConfigs: {},
  })

  it('handleAppStateChangeForBackgroundTimer when unauthenticated', () => {
    expect(handleAppStateChangeForBackgroundTimer('active')).toBe(undefined)
  })

  it('handles startSessionTimer with callback parameter without crash', () => {
    expect(startSessionTimer(jest.fn())).toBe(undefined)
  })

  it('handles startSessionTimer with no parameters without crash', () => {
    expect(startSessionTimer()).toBe(undefined)
  })

  jest.runAllTimers()

  describe('handleAppStateChangeForBackgroundTimer when authenticated', () => {
    jest.useRealTimers()
    it('starts the countdown', () => {
      expect(handleAppStateChangeForBackgroundTimer('active')).toBe(undefined)
    })

    it('continues the timing after coming back from active', async () => {
      // Call the function after 2000ms
      await new Promise((resolve) =>
        setTimeout(() => {
          expect(handleAppStateChangeForBackgroundTimer('active')).toBe(
            undefined,
          )
          resolve()
        }, 2000),
      )
    })

    it('ends the timing after coming back from active', async () => {
      init({
        backgroundTime: 0.01,
        modalTime: 0.01,
        hideModal: jest.fn(),
        defaultCallback: jest.fn(),
        confirmButtonConfigs: {},
        cancelButtonConfigs: {},
        onTimerEnd: jest.fn(),
      })
      startSessionTimer()
      // Call the function after 2000ms
      await new Promise((resolve) =>
        setTimeout(() => {
          expect(handleAppStateChangeForBackgroundTimer('active')).toBe(
            undefined,
          )
          resolve()
        }, 2000),
      )
    })

    it('handles inactive without crash', () => {
      expect(handleAppStateChangeForBackgroundTimer('inactive')).toBe(undefined)
    })
  })
})
