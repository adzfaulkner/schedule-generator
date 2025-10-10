import { aggregate } from './aggregate'
import {
    ranges,
    REF_ALLOCS_WRITE_FROM,
} from './config'
import { getRange } from './gas_wrappers'
import { writeRefCrossTable } from './writeRefCrosstable'
import { writeScheduleAndRefAllocations, writeRefAllocations } from './writeScheduleAndRefAllocations'

import {Fixture, Pitch, RefNames, Team, Time} from './types'

function getRefNames(refCrosstable: GoogleAppsScript.Spreadsheet.Sheet): RefNames {
    const refNames: RefNames = []
    let refName: string = ''

    let row = 2
    while (true) {
        refName = getRange(refCrosstable, `A${row}`).getValue()

        if (refName === '') {
            break
        }

        refNames.push(refName)
        row++
    }

    return refNames
}

export function onChange() {
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActive()
    const active = ss.getActiveSheet()

    if (!['Ref Allocations', 'Ref Crosstable'].includes(active.getName())) {
        return
    }

    const sRaw = ss.getSheetByName('Raw')
    const sRefAllocs = ss.getSheetByName('Ref Allocations')
    const sRefCrosstable = ss.getSheetByName('Ref Crosstable')

    const fixtureValues: Fixture[] = getRange(sRaw, ranges.fixture)
        .getValues()
        .map(line => [line[0], line[2], line[4], line[5], '', line[6], '', line[7], line[8], line[9]]) as Fixture[]

    const refereeValues = getRefNames(sRefCrosstable)

    const {
        refRefTally,
        refTally,
        fixturesByPitchAndTime,
        pitches,
        times
    } = aggregate(fixtureValues, refereeValues)

    writeRefCrossTable(sRefCrosstable)(refRefTally, refTally)

    writeScheduleAndRefAllocations([
        writeRefAllocations(sRefAllocs, REF_ALLOCS_WRITE_FROM)
    ])(fixturesByPitchAndTime, pitches, times)
}