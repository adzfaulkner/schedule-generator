import { setValues } from './gas_wrappers'
import { sortPositions } from './sortPositions'

import type { PoolTeamsPerformance, PoolTeamsPerformanceAfterSort, Team } from './types'

const STANDING_HEADER = ['Pos', 'Team', 'PL', 'W', 'D', 'L', 'TF', 'TA', 'TD', 'Pts']

export const writeStandings = (
    sStandings: GoogleAppsScript.Spreadsheet.Sheet,
    range: string
) => (
    poolsTeamsPerformance: PoolTeamsPerformance
) => {
    const lines: any[] = []

    Array.from(poolsTeamsPerformance.keys()).sort().forEach((pool: string) => {
        const teamsPerformance = poolsTeamsPerformance.get(pool)

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

        const sorted: PoolTeamsPerformanceAfterSort[] = Array.from(teamsPerformance).sort(sortPositions)

        let pos = 1
        for (const [team, performance] of sorted) {
            lines.push([
                pos,
                ...[team, ...performance]
            ])
            pos++
        }
    })

    setValues(sStandings, `${range}${lines.length}`, lines)
}