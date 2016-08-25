import * as moment from 'moment';

export const DURATION_H_M = 'h[h] m[m]';
export const DURATION_H_M_S = 'h[h] m[m] s[s]';
export const DURATION_HHMM = 'hhmm';

export function duration(ms: number, format: string = DURATION_H_M) {
  if (ms >= 60 * 1000) {
    return moment.duration(ms).format(format);
  } else {
    return moment.duration(ms).format(DURATION_H_M_S);
  }
}
