import { computePerf } from './computerPerf'

import { Fixture, Performance, PoolTeamsPerformance } from './types'

export const handleTeamPerformance = (
    poolsTeamsPerformance: PoolTeamsPerformance
) => ([,,stage,home,homeScore,away,awayScore]: Fixture): void =>
{
    // pl w d l tf ta td pts
    const initialPerf: Performance = [0, 0, 0, 0, 0, 0, 0, 0]

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