import { describe, expect, it } from 'vitest'
import Sheet = GoogleAppsScript.Spreadsheet.Sheet
import Range = GoogleAppsScript.Spreadsheet.Range
import { mock } from 'vitest-mock-extended'

import type { Fixture } from '../src/types'

import { aggregate } from '../src/aggregate'
import { writeRefAllocations } from '../src/writeRefAllocations'

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

describe('writeRefAllocations', function () {
    it('produces what is expected', function () {
        const sRefAllocations = mock<Sheet>()
        const range = mock<Range>()

        // @ts-ignore
        sRefAllocations.getRange.mockReturnValue(range)

        const { fixturesByPitchAndTime, pitches, times } = aggregate(fixtures, [])

        writeRefAllocations(sRefAllocations, 14)(fixturesByPitchAndTime, pitches, times)

        expect(sRefAllocations.getRange.mock.calls).toEqual([
            [ '14:14' ],
            [ '15:15' ],
            [ '19:19' ],
            [ '23:23' ],
            [ '27:27' ],
            [ '31:31' ],
            [ '35:35' ],
            [ '39:39' ]
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

        expect(range.setValues.mock.calls).toEqual([
            generateExpectedRow('TIME', 'AGP 1', 'AGP 2', 'AGP 3'),
            generateExpectedRow('12:15', 'POOL A - A v B', 'POOL B - D v E', ''),
            generateExpectedRow('12:45', 'POOL C - G v H', '', ''),
            generateExpectedRow('13:15', '', 'POOL D - J v K', ''),
            generateExpectedRow('13:45', '', 'POOL A - A v C', ''),
            generateExpectedRow('14:15', '', '', 'POOL B - D v F'),
            generateExpectedRow('14:45', 'POOL C - G v I', 'POOL D - J v L', ''),
            generateExpectedRow('15:15', 'POOL A - B v C', '', 'POOL B - E v F'),
        ])
    })
})