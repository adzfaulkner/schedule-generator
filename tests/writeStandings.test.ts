import { describe, expect, it } from 'vitest'
import Sheet = GoogleAppsScript.Spreadsheet.Sheet
import Range = GoogleAppsScript.Spreadsheet.Range
import { mock } from 'vitest-mock-extended'

import {writeStandings, separatePools, combinedPools} from '../src/writeStandings'
import type { PoolTeamsPerformance } from '../src/types'

const poolA = new Map([
    ['Team 1', [3,0,3,0,14,14,0,6]],
    ['Team 2', [3,2,1,0,20,5,15,9]],
    ['Team 3', [3,1,1,1,10,13,-3,4]],
    ['Team 4', [3,1,1,1,10,11,-1,4]],
])

const poolB = new Map([
    ['Team 5', [3,1,2,0,15,13,2,6]],
    ['Team 6', [3,0,0,3,5,15,-10,3]],
    ['Team 7', [3,1,2,0,15,12,3,6]],
    ['Team 8', [3,1,2,0,16,14,2,6]],
])

const poolsTeamsPerformance = new Map([
    ['POOL B', poolB],
    ['POOL A', poolA],
]) as PoolTeamsPerformance

describe('writeStandings', function () {
    it('seperate pools produces what is expected', function () {
        const sStandings = mock<Sheet>()
        const range = mock<Range>()

        // @ts-ignore
        sStandings.getRange.mockReturnValue(range)

        writeStandings(sStandings, 'A1:J')(separatePools(poolsTeamsPerformance))

        expect(sStandings.getRange).toHaveBeenCalledWith("A1:J12")

        expect(range.setValues).toHaveBeenCalledWith([
            [ 'POOL A', '', '', '', '', '', '', '', '', '' ],
            [ 'Pos', 'Team', 'PL', 'W',   'D',    'L', 'TF',  'TA',   'TD', 'Pts' ],
            [ 1, 'Team 2', 3, 2, 1, 0, 20, 5, 15, 9 ],
            [ 2, 'Team 1', 3, 0, 3, 0, 14, 14, 0, 6 ],
            [ 3, 'Team 4', 3, 1, 1, 1, 10, 11, -1, 4 ],
            [ 4, 'Team 3', 3, 1, 1, 1, 10, 13, -3, 4 ],
            [ 'POOL B', '', '', '', '', '', '', '', '', '' ],
            [ 'Pos', 'Team', 'PL', 'W',   'D',    'L', 'TF',  'TA',   'TD', 'Pts' ],
            [ 1, 'Team 7', 3, 1, 2, 0, 15, 12, 3, 6 ],
            [ 2, 'Team 8', 3, 1, 2, 0, 16, 14, 2, 6 ],
            [ 3, 'Team 5', 3, 1, 2, 0, 15, 13, 2, 6 ],
            [ 4, 'Team 6', 3, 0, 0, 3, 5, 15, -10, 3 ]
        ])
    })

    it('combined pools produces what is expected', function () {
        const sStandings = mock<Sheet>()
        const range = mock<Range>()

        // @ts-ignore
        sStandings.getRange.mockReturnValue(range)

        writeStandings(sStandings, 'A1:J')(combinedPools(poolsTeamsPerformance))

        expect(sStandings.getRange).toHaveBeenCalledWith("A1:J10")

        expect(range.setValues).toHaveBeenCalledWith([
            [ 'Pool Standings', '', '', '', '', '', '', '', '', '' ],
            [ 'Pos', 'Team', 'PL', 'W',   'D',    'L', 'TF',  'TA',   'TD', 'Pts' ],
            [ 1, 'Team 2', 3, 2, 1, 0, 20, 5, 15, 9 ],
            [ 2, 'Team 7', 3, 1, 2, 0, 15, 12, 3, 6 ],
            [ 3, 'Team 8', 3, 1, 2, 0, 16, 14, 2, 6 ],
            [ 4, 'Team 5', 3, 1, 2, 0, 15, 13, 2, 6 ],
            [ 5, 'Team 1', 3, 0, 3, 0, 14, 14, 0, 6 ],
            [ 6, 'Team 4', 3, 1, 1, 1, 10, 11, -1, 4 ],
            [ 7, 'Team 3', 3, 1, 1, 1, 10, 13, -3, 4 ],
            [ 8, 'Team 6', 3, 0, 0, 3, 5, 15, -10, 3 ]
        ])
    })
})