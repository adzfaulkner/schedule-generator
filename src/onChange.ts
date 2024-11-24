import { aggregate } from './aggregate'
import {
    ranges,
    SCHEDULE_WRITE_FROM_ROW,
    REF_ALLOCS_WRITE_FROM
} from './config'
import { getRange } from './gas_wrappers'
import { writeRefCrossTable } from './writeRefCrosstable'
import { writeStandings } from './writeStandings'
import { writeScheduleAndRefAllocations, writeSchedule, writeRefAllocations } from './writeScheduleAndRefAllocations'

import type { Fixture, RefNames } from './types'
import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions

function getRefNames(refCrosstable: GoogleAppsScript.Spreadsheet.Sheet): RefNames {
    const refNames: RefNames = []
    let refName: string = ''

    let row = 2
    while (true) {
        refName = getRange(refCrosstable, `A${row}`).getValue()

        if (refName === '') {
            break
        }

        refNames.push([refName])
        row++
    }

    return refNames
}

export function onChange() {
    const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActive()
    const active = ss.getActiveSheet()

    if (!['Schedule', 'Ref Allocations', 'Ref Crosstable'].includes(active.getName())) {
        return
    }

    const sRaw = ss.getSheetByName('Raw')
    const sRefAllocs = ss.getSheetByName('Ref Allocations')
    const sRefCrosstable = ss.getSheetByName('Ref Crosstable')
    const sStandings = ss.getSheetByName('Standings')
    const sSchedule = ss.getSheetByName('Schedule')
    const fixtureValues: Fixture[] = getRange(sRaw, ranges.fixture).getValues() as Fixture[]
    const refereeValues = getRefNames(sRefCrosstable)

    console.log(refereeValues)

    const {
        poolsTeamsPerformance,
        refRefTally,
        refTally,
        fixturesByPitchAndTime,
        pitches,
        times
    } = aggregate(fixtureValues, refereeValues)

    writeRefCrossTable(sRefCrosstable, ranges.refRefTally)(refRefTally, refTally)
    writeStandings(sStandings, ranges.standings)(poolsTeamsPerformance)

    writeScheduleAndRefAllocations(
        writeRefAllocations(sRefAllocs, REF_ALLOCS_WRITE_FROM),
        writeSchedule(sSchedule, SCHEDULE_WRITE_FROM_ROW)
    )(fixturesByPitchAndTime, pitches, times)

    const options: URLFetchRequestOptions = {
        'method': 'put',
        'payload': JSON.stringify({
            spreadsheetId: ss.getId(),
        }),
    }

    UrlFetchApp.fetch('https://e5ufi5onrd.execute-api.eu-west-2.amazonaws.com/prod/update', options)
}