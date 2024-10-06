import { aggregate } from './aggregate'
import {
    ranges,
    SCHEDULE_WRITE_FROM_ROW,
    REF_ALLOCS_WRITE_FROM
} from './config'
import { writeRefCrossTable } from './writeRefCrosstable'
import { writeStandings } from './writeStandings'
import { writeScheduleAndRefAllocations, writeSchedule, writeRefAllocations } from './writeScheduleAndRefAllocations'

import type { Fixture, RefNames } from './types'

function onChange(e) {
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActive()
    const active = ss.getActiveSheet()

    if (!['Raw', 'Ref Allocations', 'Ref Crosstable'].includes(active.getName())) {
        return
    }

    const sRaw = ss.getSheetByName('Raw')
    const sRefAllocs = ss.getSheetByName('Ref Allocations')
    const sRefCrosstable = ss.getSheetByName('Ref Crosstable')
    const sStandings = ss.getSheetByName('Standings')
    const sSchedule = ss.getSheetByName('Schedule')

    const fixtureValues: Fixture[] = sRaw.getRange(ranges.fixture).getValues() as Fixture[]
    const refereeValues: RefNames = sRefCrosstable.getRange(ranges.refNames).getValues() as RefNames

    const { poolsTeamsPerformance, refRefTally, refTally, fixturesByPitchAndTime, pitches, times } = aggregate(fixtureValues, refereeValues)

    writeRefCrossTable(sRefCrosstable, ranges.refRefTally)(refRefTally, refTally)
    writeStandings(sStandings, ranges.standings)(poolsTeamsPerformance)

    writeScheduleAndRefAllocations(
        writeRefAllocations(sRefAllocs, REF_ALLOCS_WRITE_FROM),
        writeSchedule(sSchedule, SCHEDULE_WRITE_FROM_ROW)
    )(fixturesByPitchAndTime, pitches, times)
}

global.onChange = onChange