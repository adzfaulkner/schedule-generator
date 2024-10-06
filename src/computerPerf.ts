import {Performance} from "./types";

const PTS_WIN = 4
const PTS_DRAW = 2
const PTS_LOSS = 1

export const computePerf = (
    hperf: Performance,
    hs: number,
    aperf: Performance,
    as: number
): void => {
  hperf[0]++
  aperf[0]++
  hperf[4] += hs
  aperf[4] += as
  hperf[5] += as
  aperf[5] += hs

  //td calc
  hperf[6] = hperf[4] - hperf[5]
  aperf[6] = aperf[4] - aperf[5]

  if (hs > as) {
    // home team win
    hperf[1]++
    aperf[3]++
    hperf[7] += PTS_WIN
    aperf[7] += PTS_LOSS
  } else if (as > hs) {
    // away team win
    aperf[1]++
    hperf[3]++
    aperf[7] += PTS_WIN
    hperf[7] += PTS_LOSS
  } else {
    // assume draw
    hperf[2]++
    aperf[2]++
    hperf[7] += PTS_DRAW
    aperf[7] += PTS_DRAW
  }
}