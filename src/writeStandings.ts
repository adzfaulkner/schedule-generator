import type { Performance, PoolTeamsPerformance, PoolTeamsPerformanceAfterSort } from './types'

import { setValues } from './gas_wrappers'
import { sortPositions } from './sortPositions'

const STANDING_HEADER = ['Pos', 'Team', 'PL', 'W', 'D', 'L', 'TF', 'TA', 'TD', 'Pts']

type GenerateLines = () => any[]

export const separatePools = (
    poolsTeamsPerformance: PoolTeamsPerformance
): GenerateLines => (): any[] => {
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

    return lines
}

export const combinedPools = (
    poolsTeamsPerformance: PoolTeamsPerformance
): GenerateLines => (): any[] => {
    const lines: any[] = [
        [
            'Combined Standings',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ],
        STANDING_HEADER
    ]

    let combined: Map<string, Performance> = new Map()
    Array.from(poolsTeamsPerformance.keys()).sort().forEach((pool: string) => {
        const teamsPerformance: Map<string, Performance>  = poolsTeamsPerformance.get(pool)
        combined = new Map([...combined.entries(), ...teamsPerformance.entries()])
    })

    const sorted: PoolTeamsPerformanceAfterSort[] = Array.from(combined).sort(sortPositions)

    let pos = 1
    for (const [team, performance] of sorted) {
        lines.push([
            pos,
            ...[team, ...performance]
        ])
        pos++
    }

    return lines
}

export const writeStandings = (
    sStandings: GoogleAppsScript.Spreadsheet.Sheet,
    range: string
) => (
    lineGenerator: GenerateLines
) => {
    const lines=  lineGenerator()

    setValues(sStandings, `${range}${lines.length}`, lines)
}