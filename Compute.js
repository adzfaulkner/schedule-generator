// raw sheet fixture list - time cell to last ref
const FIXTURE_RANGE = 'B:J'
// referee names column of the ref cross table
const REF_NAMES_RANGE = 'A2:A9'
// 1st referee tally cell (should be blacked out) to bottom right of the total column
const REF_REF_TALLY_RANGE = 'D2:M9'
const STANDINGS_RANGE = 'A1:J'
const STANDING_HEADER = ['Pos', 'Team', 'Pl', 'W', 'D', 'L', 'TF', 'TA', 'TD', 'Pts']
// schedule row number that pitches should be written on
const SCHEDULE_WRITE_FROM_ROW = 18;

const PTS_WIN = 4
const PTS_DRAW = 2
const PTS_LOSS = 1

const columnToLetter = (column) => {
  let temp, letter = ''

  while (column > 0) {
    temp = (column - 1) % 26
    letter = String.fromCharCode(temp + 65) + letter
    column = (column - temp - 1) / 26
  }

  return letter
}

const sortPositions = ([hname,[,,,,hts,,htd,hpts]], [aname,[,,,,ats,,atd,apts]]) => {
  if (hpts < apts) {
    return 1
  } else if (hts > apts) {
    return -1
  }

  if (htd < atd) {
    return 1
  } else if (htd > atd) {
    return -1
  }

  if (hts < ats) {
    return 1
  } else if (htd > ats) {
    return -1
  }

  // absolute default is to sort by team name
  return ( ( hname === aname ) ? 0 : ( ( hname > aname ) ? 1 : -1 ) )
}

const computePerf = (hperf, hs, aperf, as) => {
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

const handleRefAllocations = (refRefTally, refTally, [,,,,,,,...refs]) => {
  refs = refs.filter(ref => refTally.has(ref))

  for (let o = 0;o < refs.length;o++) {
    for (let i = 0;i < refs.length;i++) {
      if (o === i) {
        refTally.set(refs[o], refTally.get(refs[o]) + 1)
        continue
      }

      const alloc = refRefTally.get(refs[o])
      alloc.set(refs[i], alloc.get(refs[i]) + 1)
    }
  }
}

const handleTeamPerformance = (poolsTeamsPerformance, [,,stage,home,homeScore,away,awayScore]) => {
  // pl w d l tf ta td pts
  const initialPerf = [0, 0, 0, 0, 0, 0, 0, 0]

  if (!stage.match(/POOL/i)) {
    return
  }

  if (!poolsTeamsPerformance.has(stage)) {
    poolsTeamsPerformance.set(stage, new Map())
  }

  const poolTeamsPerformance = poolsTeamsPerformance.get(stage)

  if (!poolTeamsPerformance.has(home)) {
    poolTeamsPerformance.set(home, [...initialPerf])
  }

  if (!poolTeamsPerformance.has(away)) {
    poolTeamsPerformance.set(away, [...initialPerf])
  }

  if (homeScore === '' || awayScore === '') {
    return
  }

  computePerf(
      poolTeamsPerformance.get(home),
      parseInt(homeScore, 10),
      poolTeamsPerformance.get(away),
      parseInt(awayScore, 10)
  )
}

const handleFixturesByPitchAndTime = (fixturesByPitchAndTime, fixture) => {
  const [time, pitch] = fixture

  if (!fixturesByPitchAndTime.has(pitch)) {
    fixturesByPitchAndTime.set(pitch, new Map())
  }

  fixturesByPitchAndTime.get(pitch).set(time, fixture)
}

const writeRefAllocations = (sRefAllocs, fixturesByPitchAndTime, pitches, times) => {
  let line = [
      ['TIME']
  ]

  let writeFrom = 2

  for (const pitch of pitches) {
    line[0].push(pitch)
    line[0].push('')
    line[0].push('')
  }

  const range = `${writeFrom}:${writeFrom}`
  sRefAllocs.getRange(range).setValues(line)

  writeFrom++

  for (const time of times) {
    line = [
      [time]
    ]

    for (const pitch of pitches) {
      const [,,stage,home,,away] = fixturesByPitchAndTime.get(pitch).get(time)

      line[0].push(`${stage} - ${home} v ${away}`)
      line[0].push('')
      line[0].push('')
    }

    const range = `${writeFrom}:${writeFrom}`
    sRefAllocs.getRange(range).setValues(line)

    writeFrom += 4
  }
}

const writeRefCrosstable = (sRefCrosstable, refRefTally, refTally) => {
  const lines = []
  for ([key, m] of refRefTally.entries()) {
    let line = []

    for (r of m.values()) {
      line.push(r)
    }

    line = [
      ...line,
      '',
      refTally.get(key)
    ]

    lines.push(line)
  }

  sRefCrosstable.getRange(REF_REF_TALLY_RANGE).setValues(lines)
}

const writeStandings = (sStandings, poolStandings) => {
  const lines = []

  for ([pool, standings] of poolStandings.entries()) {
    lines.push([
        pool,
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
    ])

    lines.push(STANDING_HEADER)

    const sorted = Array.from(standings)
        .sort(sortPositions)

    let pos = 1
    for (const l of sorted) {
      lines.push([
          pos.toString(),
          ...[l[0], ...l[1]]
      ])
      pos++
    }
  }

  const range = `${STANDINGS_RANGE}${lines.length}`
  sStandings.getRange(range).setValues(lines)
}

const writeSchedule = (sSchedule, fixturesByPitchAndTime, pitches, times) => {
  let writeFrom = 1
  let range, col, colLetter, colLetterTo

  let pitchLine = ['']

  col = 1

  for (const pitch of pitches) {
    pitchLine.push(pitch)
    pitchLine.push('')
    pitchLine.push('')

    writeFrom = SCHEDULE_WRITE_FROM_ROW + 1

    colLetter = columnToLetter(col)
    colLetterTo = columnToLetter(col+1)

    for (const time of times) {
      const [,,stage,home,,away] = fixturesByPitchAndTime.get(pitch).get(time)

      range = `${colLetter}${writeFrom}:${colLetterTo}${writeFrom+2}`
      sSchedule.getRange(range).setValues([
        [col === 1 ? time : '', stage],
        ['', home],
        ['', away],
      ])

      writeFrom += 4
    }

    col += 3
  }

  writeFrom = 1

  range = `${writeFrom}:${writeFrom}`
  sSchedule.getRange(range).setValues([pitchLine])

  writeFrom = SCHEDULE_WRITE_FROM_ROW

  pitchLine[0] = 'TIME'

  range = `${writeFrom}:${writeFrom}`
  sSchedule.getRange(range).setValues([pitchLine])
}

function Compute(fixtures, referees) {
  const poolsTeamsPerformance = new Map()

  const refTally = new Map(referees.map(referee => [referee[0], 0]))
  const refRefTally = new Map(referees.map(referee => [referee[0], new Map(refTally)]))

  const pitches = new Set()
  const times = new Set()
  const fixturesByPitchAndTime = new Map()

  for (const fixture of fixtures) {
    if (fixture[0] === '') {
      break
    }

    pitches.add(fixture[1])
    times.add(fixture[0])

    handleRefAllocations(refRefTally, refTally, fixture)
    handleTeamPerformance(poolsTeamsPerformance, fixture)
    handleFixturesByPitchAndTime(fixturesByPitchAndTime, fixture)
  }

  return {
    poolsTeamsPerformance,
    refRefTally,
    refTally,
    pitches,
    times,
    fixturesByPitchAndTime
  }
}

function onChange(e) {
  const ss = SpreadsheetApp.getActive()
  const active = ss.getActiveSheet()

  if (!['Raw', 'Ref Allocations', 'Ref Crosstable'].includes(active.getName())) {
    return
  }

  const sRaw = ss.getSheetByName('Raw')
  const sRefAllocs = ss.getSheetByName('Ref Allocations')
  const sRefCrosstable = ss.getSheetByName('Ref Crosstable')
  const sStandings = ss.getSheetByName('Standings')
  const sSchedule = ss.getSheetByName('Schedule')

  const fixtureValues = sRaw.getRange(FIXTURE_RANGE).getValues()
  const refereeValues = sRefCrosstable.getRange(REF_NAMES_RANGE).getValues()

  const { poolsTeamsPerformance, refRefTally, refTally, fixturesByPitchAndTime, pitches, times } = Compute(fixtureValues, refereeValues)

  writeRefCrosstable(sRefCrosstable, refRefTally, refTally)
  writeStandings(sStandings, poolsTeamsPerformance)
  writeRefAllocations(sRefAllocs, fixturesByPitchAndTime, pitches, times)
  writeSchedule(sSchedule, fixturesByPitchAndTime, pitches, times)
}
