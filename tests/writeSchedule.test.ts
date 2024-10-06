import { describe, expect, it } from 'vitest'
import Sheet = GoogleAppsScript.Spreadsheet.Sheet
import Range = GoogleAppsScript.Spreadsheet.Range
import { mock } from 'vitest-mock-extended'

import type { Fixture } from '../src/types'

import { aggregate } from '../src/aggregate'
import { writeSchedule } from '../src/writeSchedule'

const fixtures: Fixture[] = [
    ['12:15', 'AGP 1', 'POOL A', 'A', '1', 'B', '1', 'Ref 1', 'Ref 2', ''],
    ['12:15', 'AGP 2', 'POOL B', 'D', '2', 'E', '0', 'Ref 3', 'Ref 4', ''],
    ['12:45', 'AGP 1', 'POOL C', 'G', '10', 'H', '2', 'Ref 5', 'Ref 6', ''],
    ['13:15', 'AGP 2', 'POOL D', 'J', '', 'K', '', 'Ref 7', 'Ref 8', ''],
    ['13:45', 'AGP 2', 'POOL A', 'A', '2', 'C', '5', 'Ref 1', 'Ref 4', ''],
    ['14:15', 'AGP 3', 'POOL B', 'D', '', 'F', '', 'Ref 2', 'Ref 3', ''],
    ['14:45', 'AGP 1', 'POOL C', 'G', '', 'I', '', 'Ref 5', 'Ref 8', ''],
    ['14:45', 'AGP 2', 'POOL D', 'J', '', 'L', '', 'Ref 6', 'Ref 7', ''],
    ['15:15', 'AGP 1', 'POOL A', 'B', '', 'C', '', 'Ref 1', 'Ref 3', ''],
    ['15:15', 'AGP 3', 'POOL B', 'E', '', 'F', '', 'Ref 2', 'Ref 4', ''],
]

describe('writeSchedule', function () {
    it('produces what is expected', function () {
        const sSchedule = mock<Sheet>()
        const range = mock<Range>()

        // @ts-ignore
        sSchedule.getRange.mockReturnValue(range)

        const { fixturesByPitchAndTime, pitches, times } = aggregate(fixtures, [])

        writeSchedule(sSchedule, 14)(fixturesByPitchAndTime, pitches, times)

        expect(sSchedule.getRange.mock.calls).toEqual([
            [ 'A15:B17' ], [ 'A19:B21' ],
            [ 'A23:B25' ], [ 'A27:B29' ],
            [ 'A31:B33' ], [ 'A35:B37' ],
            [ 'A39:B41' ],
            [ 'D15:E17' ], [ 'D19:E21' ],
            [ 'D23:E25' ], [ 'D27:E29' ],
            [ 'D31:E33' ], [ 'D35:E37' ],
            [ 'D39:E41' ],
            [ 'G15:H17' ], [ 'G19:H21' ],
            [ 'G23:H25' ], [ 'G27:H29' ],
            [ 'G31:H33' ], [ 'G35:H37' ],
            [ 'G39:H41' ],
            [ '1:1' ], [ '14:14' ]
        ])

        const genCellsValue = (time: string, stage: string, homeTeam: string, awayTeam: string) => [[
            [time, stage],
            ['', homeTeam],
            ['', awayTeam],
        ]]

        const blank = genCellsValue('', '', '', '')

        expect(range.setValues.mock.calls).toEqual([
            //AGP 1
            genCellsValue('12:15', 'POOL A', 'A', 'B'),
            genCellsValue('12:45', 'POOL C', 'G', 'H'),
            genCellsValue('13:15', '', '', ''),
            genCellsValue('13:45', '', '', ''),
            genCellsValue('14:15', '', '', ''),
            genCellsValue('14:45', 'POOL C', 'G', 'I'),
            genCellsValue('15:15', 'POOL A', 'B', 'C'),
            //AGP 2
            genCellsValue('', 'POOL B', 'D', 'E'),
            blank,
            genCellsValue('', 'POOL D', 'J', 'K'),
            genCellsValue('', 'POOL A', 'A', 'C'),
            blank,
            genCellsValue('', 'POOL D', 'J', 'L'),
            blank,
            //AGP 3
            blank,
            blank,
            blank,
            blank,
            genCellsValue('', 'POOL B', 'D', 'F'),
            blank,
            genCellsValue('', 'POOL B', 'E', 'F'),
            // pitches cells
            [[
                ['', 'AGP 1', '', '', 'AGP 2', '', '', 'AGP 3', '', '']
            ]],
            [[
                ['TIME', 'AGP 1', '', '', 'AGP 2', '', '', 'AGP 3', '', '']
            ]],
        ])
    })
})