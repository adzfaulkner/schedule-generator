import { describe, expect, it } from 'vitest'
import Sheet = GoogleAppsScript.Spreadsheet.Sheet
import Range = GoogleAppsScript.Spreadsheet.Range
import { mock } from 'vitest-mock-extended'

import type { Fixture } from '../src/types'

import { aggregate } from '../src/aggregate'
import { writeRefCrossTable } from '../src/writeRefCrosstable'
import {RefNames} from "../src/types";

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

describe('writeRefCrosstable', function () {
    it('produces what is expected', function () {
        const sheet = mock<Sheet>()
        const range = mock<Range>()

        // @ts-ignore
        sheet.getRange.mockReturnValue(range)

        const { refRefTally, refTally } = aggregate(fixtures, referees)

        writeRefCrossTable(sheet, 'D2:M9')(refRefTally, refTally)

        expect(sheet.getRange.mock.calls).toEqual([
            ['D2:M9'],
        ])

        expect(range.setValues.mock.calls).toEqual([
            [
                [
                    [0, 1, 1, 1, 0, 0, 0, 0, '', 3],
                    [1, 0, 1, 1, 0, 0, 0, 0, '', 3],
                    [1, 1, 0, 1, 0, 0, 0, 0, '', 3],
                    [1, 1, 1, 0, 0, 0, 0, 0, '', 3],
                    [0, 0, 0, 0, 0, 1, 0, 1, '', 2],
                    [0, 0, 0, 0, 1, 0, 1, 0, '', 2],
                    [0, 0, 0, 0, 0, 1, 0, 1, '', 2],
                    [0, 0, 0, 0, 1, 0, 1, 0, '', 2],
                ]
            ]
        ])
    })
})