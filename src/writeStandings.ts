import { sortPositions } from './sortPositions'

import type { PoolTeamsPerformance } from './types'
import { PoolTeamsPerformanceAfterSort, Team } from "./types";

const STANDING_HEADER = ['Pos', 'Team', 'Pl', 'W', 'D', 'L', 'TF', 'TA', 'TD', 'Pts']

export const writeStandings = (
    sStandings: GoogleAppsScript.Spreadsheet.Sheet,
    range: string
) => (
    poolsTeamsPerformance: PoolTeamsPerformance
) => {
    const lines: any[] = []

    poolsTeamsPerformance.forEach((teamsPerformance, pool) => {
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

    sStandings.getRange(`${range}${lines.length}`).setValues(lines)
}