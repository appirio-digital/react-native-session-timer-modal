import React, { Component } from 'react'
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  AppState,
  Text,
} from 'react-native'
import moment, { Duration } from 'moment'

import {
  startSessionTimer,
  stopSessionTimer,
  getBackgroundTimerEndTime,
  getCurrentTimeStamp,
} from '../utils'
import { ISessionTimerModalProps } from './SessionTimerModal'

interface IModalBodyProps extends ISessionTimerModalProps {
  hideModal(): void
}

interface IModalBodyStates {
  countdown: Duration
}

const formatCountdown = (countdown: Duration) => {
  let result = ''

  if (countdown && moment.isDuration(countdown)) {
    let minutes: any = countdown.minutes()
    let seconds: any = countdown.seconds()

    if (minutes < 10) {
      minutes = `0${minutes}`
    }
    if (seconds < 10) {
      seconds = `0${seconds}`
    }

    result = `${minutes}:${seconds}`
  }

  return result
}

let defaultModalTimeDuration: Duration
let modalEndtime: number = 0

export class ModalBody extends Component<IModalBodyProps, IModalBodyStates> {
  public state = {
    countdown: moment.duration(this.props.modalTime, 'minutes'),
  }

  public componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChangeForCountdown)
    defaultModalTimeDuration = moment.duration(this.props.modalTime, 'minutes')
    modalEndtime =
      defaultModalTimeDuration.asMilliseconds() + getBackgroundTimerEndTime()

    this.startCountdown()
  }

  public componentWillUnmount() {
    AppState.removeEventListener(
      'change',
      this.handleAppStateChangeForCountdown,
    )
  }

  public handleAppStateChangeForCountdown = (nextAppState: string) => {
    if (nextAppState === 'active') {
      this.startCountdown()
    }
  }

  public initializeSessionCountdown = (duration: number): Duration => {
    return duration >= 0
      ? moment.duration(duration, 'milliseconds')
      : defaultModalTimeDuration
  }

  public startCountdown = () => {
    const duration = modalEndtime - getCurrentTimeStamp()

    if (duration > 0) {
      this.setState(
        { countdown: this.initializeSessionCountdown(duration) },
        () => startSessionTimer(this.handleCountDown, 1000),
      )
    } else {
      this.handleSessionTimeout(false)
    }
  }

  public handleCountDown = () =>
    this.setState(
      ({ countdown }) => ({ countdown: countdown.subtract(1, 's') }),
      () => {
        if (this.state.countdown.asMilliseconds() <= 0) {
          this.handleSessionTimeout(false)
        }
      },
    )

  public handleSessionTimeout = (
    isStillAuthed: boolean,
    manualPress?: boolean,
  ) => {
    this.resetCountdown()
    this.props.hideModal()
    stopSessionTimer(isStillAuthed)
    if (this.props.onTimerEnd && !isStillAuthed && !manualPress) {
      setTimeout(this.props.onTimerEnd, 310)
    }
  }

  public handleYesBtnPress = () => {
    this.handleSessionTimeout(true, true)
    if (this.props.onModalConfirmPress) {
      setTimeout(this.props.onModalConfirmPress, 310)
    }
  }

  public handleNoBtnPress = () => {
    this.handleSessionTimeout(false, true)
    if (this.props.onModalCancelPress) {
      setTimeout(this.props.onModalCancelPress, 310)
    }
  }

  public resetCountdown = () =>
    this.setState({
      countdown: this.initializeSessionCountdown(-1),
    })

  public render() {
    const { countdown } = this.state
    const {
      containerStyle,
      title,
      titleStyle,
      subtitle,
      subtitleStyle,
      countdownTextStyle,
      cancelText,
      confirmText,
      buttonTextStyle,
    } = this.props

    return (
      <View style={[styles.modalContainer, containerStyle]}>
        <View style={[styles.textContainer, titleStyle]}>
          <Text style={styles.title} accessible={true}>
            {title}
          </Text>
          <Text
            style={[styles.countdown, countdownTextStyle]}
            accessible={true}
          >
            {formatCountdown(countdown)}
          </Text>
          <Text style={[styles.desc, subtitleStyle]} accessible={true}>
            {subtitle}
          </Text>
        </View>
        <View style={styles.btnRow}>
          <TouchableOpacity
            onPress={this.handleNoBtnPress}
            style={[styles.modalBtn, styles.noBtn]}
          >
            <Text style={[styles.modalBtnText, buttonTextStyle]}>
              {cancelText}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.handleYesBtnPress}
            style={styles.modalBtn}
          >
            <Text style={[styles.modalBtnText, buttonTextStyle]}>
              {confirmText}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  btnRow: {
    borderTopColor: '#CCCCCC',
    borderTopWidth: 0.5,
    flexDirection: 'row',
  },
  countdown: {
    fontSize: 30,
    textAlign: 'center',
  },
  desc: {
    marginBottom: 12,
    textAlign: 'center',
  },
  modalBtn: {
    alignItems: 'center',
    ...Platform.select({
      android: {
        borderTopColor: '#CCCCCC',
        borderTopWidth: 0.5,
      },
    }),
    width: '50%',
  },
  modalBtnText: {
    color: 'blue',
    paddingVertical: 10,
  },
  modalContainer: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginHorizontal: 25,
    maxWidth: 250,
  },
  noBtn: {
    ...Platform.select({
      android: {
        borderRightWidth: 1,
      },
      ios: {
        borderRightWidth: 0.5,
      },
    }),
    borderRightColor: '#CCCCCC',
  },

  textContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    marginBottom: 3,
    textAlign: 'center',
  },
})