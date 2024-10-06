import { handleRefAllocations } from './handleRefAllocations'
import { handleTeamPerformance } from './handleTeamPerformance'
import { handleFixturesByPitchAndTime } from './handleFixturesByPitchAndTime'

import type {
    Fixture,
    FixturesByPitchAndTime,
    Pitches,
    PoolTeamsPerformance,
    RefNames,
    RefRefSum,
    RefSum,
    Times,
} from './types'

type Return = {
    poolsTeamsPerformance: PoolTeamsPerformance
    refRefTally: RefRefSum
    refTally: RefSum
    pitches: Pitches
    times: Times
    fixturesByPitchAndTime: FixturesByPitchAndTime
}

export const aggregate = (fixtures: Fixture[], referees: RefNames): Return => {
    const poolsTeamsPerformance: PoolTeamsPerformance = new Map()

    const refTally: RefSum = new Map(referees.map(referee => [referee[0], 0]))
    const refRefTally: RefRefSum = new Map(referees.map(referee => [referee[0], new Map(refTally)]))

    const pitches: Pitches= new Set()
    const times: Times = new Set()
    const fixturesByPitchAndTime: FixturesByPitchAndTime = new Map()

    const handleRefAllocs = handleRefAllocations(refRefTally, refTally)
    const handleTeamPerf = handleTeamPerformance(poolsTeamsPerformance)
    const handleFixsByPitchTime = handleFixturesByPitchAndTime(fixturesByPitchAndTime)

    for (const fixture of fixtures) {
        if (fixture[0] === '') {
            break
        }

        pitches.add(fixture[1])
        times.add(fixture[0])

        handleRefAllocs(fixture)
        handleTeamPerf(fixture)
        handleFixsByPitchTime(fixture)
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