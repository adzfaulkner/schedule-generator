import { describe, expect, it } from 'vitest'
import Sheet = GoogleAppsScript.Spreadsheet.Sheet
import Range = GoogleAppsScript.Spreadsheet.Range
import { mock } from 'vitest-mock-extended'

import type { Fixture } from '../src/types'

import { aggregate } from '../src/aggregate'
import { writeScheduleAndRefAllocations, writeSchedule, writeRefAllocations } from '../src/writeScheduleAndRefAllocations'
import { RefNames } from '../src/types'

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

const referees: RefNames = [['Ref 1'], ['Ref 2'], ['Ref 3'], ['Ref 4'], ['Ref 5'], ['Ref 6'], ['Ref 7'], ['Ref 8']]

describe('writeScheduleAndRefAllocations', function () {
    it('produces what is expected', function () {
        const { fixturesByPitchAndTime, pitches, times } = aggregate(fixtures, referees)

        const scheduleSheet = mock<Sheet>()
        const scheduleRange = mock<Range>()

        // @ts-ignore
        scheduleSheet.getRange.mockReturnValue(scheduleRange)

        const refAllocsSheet = mock<Sheet>()
        const refAllocsRange = mock<Range>()

        // @ts-ignore
        refAllocsSheet.getRange.mockReturnValue(refAllocsRange)

        const sut = writeScheduleAndRefAllocations(
            writeSchedule(scheduleSheet, 14),
            writeRefAllocations(refAllocsSheet, 2)
        )

        sut(fixturesByPitchAndTime, pitches, times)

        expect(scheduleSheet.getRange.mock.calls).toEqual([
            [ 'A15:B17' ], [ 'D15:E17' ], [ 'G15:H17' ],
            [ 'A19:B21' ], [ 'D19:E21' ], [ 'G19:H21' ],
            [ 'A23:B25' ], [ 'D23:E25' ], [ 'G23:H25' ],
            [ 'A27:B29' ], [ 'D27:E29' ], [ 'G27:H29' ],
            [ 'A31:B33' ], [ 'D31:E33' ], [ 'G31:H33' ],
            [ 'A35:B37' ], [ 'D35:E37' ], [ 'G35:H37' ],
            [ 'A39:B41' ], [ 'D39:E41' ], [ 'G39:H41' ],
            [ '1:1' ], [ '14:14' ]
        ])

        const genCellsValue = (time: string, stage: string, homeTeam: string, awayTeam: string) => [[
            [time, stage],
            ['', homeTeam],
            ['', awayTeam],
        ]]

        const blank = genCellsValue('', '', '', '')

        expect(scheduleRange.setValues.mock.calls).toEqual([
            //AGP 1
            genCellsValue('12:15', 'POOL A', 'A', 'B'),
            genCellsValue('', 'POOL B', 'D', 'E'),
            blank,

            genCellsValue('12:45', 'POOL C', 'G', 'H'),
            blank,
            blank,

            genCellsValue('13:15', '', '', ''),
            genCellsValue('', 'POOL D', 'J', 'K'),
            blank,

            genCellsValue('13:45', '', '', ''),
            genCellsValue('', 'POOL A', 'A', 'C'),
            blank,

            genCellsValue('14:15', '', '', ''),
            blank,
            genCellsValue('', 'POOL B', 'D', 'F'),

            genCellsValue('14:45', 'POOL C', 'G', 'I'),
            genCellsValue('', 'POOL D', 'J', 'L'),
            blank,

            genCellsValue('15:15', 'POOL A', 'B', 'C'),
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

        expect(refAllocsSheet.getRange.mock.calls).toEqual([
            [ '3:3' ],
            [ '7:7' ],
            [ '11:11' ],
            [ '15:15' ],
            [ '19:19' ],
            [ '23:23' ],
            [ '27:27' ],
            [ '2:2' ]
        ])

        const generateExpectedRow = (time: string, match1: string, match2: string, match3: string) => [[[
            time,
            match1,
            '',
            '',
            match2,
            '',
            '',
            match3,
            '',
            '',
        ]]]

        expect(refAllocsRange.setValues.mock.calls).toEqual([
            generateExpectedRow('12:15', 'POOL A - A v B', 'POOL B - D v E', ''),
            generateExpectedRow('12:45', 'POOL C - G v H', '', ''),
            generateExpectedRow('13:15', '', 'POOL D - J v K', ''),
            generateExpectedRow('13:45', '', 'POOL A - A v C', ''),
            generateExpectedRow('14:15', '', '', 'POOL B - D v F'),
            generateExpectedRow('14:45', 'POOL C - G v I', 'POOL D - J v L', ''),
            generateExpectedRow('15:15', 'POOL A - B v C', '', 'POOL B - E v F'),
            generateExpectedRow('TIME', 'AGP 1', 'AGP 2', 'AGP 3'),
        ])
    })
})