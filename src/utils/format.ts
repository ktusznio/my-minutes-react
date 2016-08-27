import * as moment from 'moment';

const FORMAT_HIDDEN_INPUT = 'hhmm';
const FORMAT_INPUT = 'HH[h] : mm[m]';
const FORMAT_HOURS_MINUTES = 'h[h] m[m]';
const FORMAT_HOURS_MINUTES_SECONDS = 'h[h] m[m] s[s]';

export function timeTracked(ms: number): string {
  return moment.duration(ms).format(FORMAT_HOURS_MINUTES_SECONDS);
}

export function timeRemaining(ms: number): string {
  if (ms >= 60 * 60 * 1000) {
    return moment.duration(ms).format(FORMAT_HOURS_MINUTES);
  } else if (ms >= 1000) {
    return moment.duration(ms).format(FORMAT_HOURS_MINUTES_SECONDS);
  } else {
    return '1s';
  }
}

export function timeInput(ms: number): string {
  let result = moment.duration(ms).format(FORMAT_INPUT);
  if (result.length < FORMAT_INPUT.length - 4) {
    result = '00h : ' + result;
  }
  return result;
}

export function timeHiddenInput(ms: number): string {
  return moment.duration(ms).format(FORMAT_HIDDEN_INPUT);
}
