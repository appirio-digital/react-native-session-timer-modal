import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({
  adapter: new Adapter(),
})

jest.mock('react-native-background-timer', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  setInterval: (callback?: void, duration?: number) =>
    setTimeout(callback, duration),
  clearInterval: (timeout: number) => clearTimeout(timeout),
}))

jest.useFakeTimers()
