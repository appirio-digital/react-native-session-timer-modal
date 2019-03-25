import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({
  adapter: new Adapter(),
})

jest.mock('react-native-background-timer', () => ({
  start: jest.fn(),
  stop: jest.fn(),
  setInterval: jest.fn(),
  clearInterval: jest.fn(),
}))

jest.useFakeTimers()
