import type { Fixture, FixturesByPitchAndTime, Pitch, Pitches, Time, Times } from './types'

import { columnToLetter } from './columnToLetter'

type HandleTime = (time: Time) => void
type HandlePitch = (pitch: Pitch) => void
type HandleFixture = (fixture: Fixture) => void
type HandleNoFixture = (time: Time) => void
type CleanUp = () => void

interface Coords {
    row: number
    col: number
}

interface WriteHCallbacks {
    handleTime: HandleTime,
    handlePitch: HandlePitch
    handleNoFixture: HandleNoFixture,
    handleFixture: HandleFixture,
    cleanUp: CleanUp
}

export const writeScheduleAndRefAllocations = (
    writeSchedule: WriteHCallbacks,
    writeRefAllocs: WriteHCallbacks,
) => (
    fixturesByPitchAndTime: FixturesByPitchAndTime,
    pitches: Pitches,
    times: Times
) => {
    for (const time of times) {
        // handle new time
        writeSchedule.handleTime(time)
        writeRefAllocs.handleTime(time)

        for (const pitch of pitches) {
            // handle new pitch
            writeSchedule.handlePitch(pitch)
            writeRefAllocs.handlePitch(pitch)

            if (
                !fixturesByPitchAndTime.has(pitch)
                || !fixturesByPitchAndTime.get(pitch).has(time)
            ) {
                // handle blank fields
                writeSchedule.handleNoFixture(time)
                writeRefAllocs.handleNoFixture(time)
                continue
            }

            // handle writing fixture related data
            writeSchedule.handleFixture(fixturesByPitchAndTime.get(pitch).get(time))
            writeRefAllocs.handleFixture(fixturesByPitchAndTime.get(pitch).get(time))
        }
    }

    writeSchedule.cleanUp()
    writeRefAllocs.cleanUp()
}

export const writeSchedule = (
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    writeFromRow: number
): WriteHCallbacks => {
    const pitchLine: Pitch[] = []
    const coords: Coords = {
        row: (writeFromRow + 1) - 4,
        col: 0,
    }

    const generateRange = ((coords: Coords, writeFromRow: number, columnToLetter: Function) => (): string => {
        const colLetter = columnToLetter(coords.col)
        const colLetterTo = columnToLetter(coords.col + 1)

        return `${colLetter}${coords.row}:${colLetterTo}${coords.row+2}`
    })(coords, writeFromRow, columnToLetter)

    const handleTime = ((coords: Coords) => (time: Time): void => {
        coords.col = 0
        coords.row += 4
    })(coords)

    const handlePitch = ((coords: Coords, pitchLine: string[], writeFromRow: number) => (pitch: Pitch): void => {
        coords.col = coords.col === 0 ? 1 : coords.col + 3

        if (coords.row > (writeFromRow + 1)) {
            return
        }

        pitchLine.push(pitch)
        pitchLine.push('')
        pitchLine.push('')
    })(coords, pitchLine, writeFromRow)

    const handleNoFixture = ((sheet: GoogleAppsScript.Spreadsheet.Sheet, generateRange: Function, coords: Coords) => (time: Time): void => {
        const timeCellValue = coords.col === 1 ? time : ''

        sheet.getRange(generateRange()).setValues([
            [timeCellValue, ''],
            ['', ''],
            ['', ''],
        ])
    })(sheet, generateRange, coords)

    const handleFixture = ((sheet: GoogleAppsScript.Spreadsheet.Sheet, generateRange: Function, coords: Coords) => (fixture: Fixture): void => {
        const [time,,stage,home,,away] = fixture

        const timeCellValue = coords.col === 1 ? time : ''

        sheet.getRange(generateRange()).setValues([
            [timeCellValue, stage],
            ['', home],
            ['', away],
        ])
    })(sheet, generateRange, coords)

    const cleanUp = ((
        sheet: GoogleAppsScript.Spreadsheet.Sheet,
        pitchLine: string[],
        writeFromRow: number
    ) => (): void => {
        const writeFrom = 1

        sheet.getRange(`${writeFrom}:${writeFrom}`).setValues([['', ...pitchLine]])
        sheet.getRange(`${writeFromRow}:${writeFromRow}`).setValues([['TIME', ...pitchLine]])
    })(sheet, pitchLine, writeFromRow)

    return {
        handleTime,
        handlePitch,
        handleNoFixture,
        handleFixture,
        cleanUp,
    }
}

// writes ref allocations but it's important not to write over cells that will be edited
export const writeRefAllocations = (
    sheet: GoogleAppsScript.Spreadsheet.Sheet,
    writeFromRow: number
): WriteHCallbacks => {
    const pitchLine: string[] = ['TIME']
    const fixtureLine: string[] = []
    const coords: Coords = {
        row: writeFromRow + 1,
        col: 0,
    }

    const writeSheet = ((fixtureLine: string[], coords: Coords) => () => {
        if (fixtureLine.length === 0) {
            return
        }

        sheet.getRange(`${coords.row}:${coords.row}`).setValues([[...fixtureLine]])
        coords.row += 4
    })(fixtureLine, coords)

    const handleTime = ((sheet: GoogleAppsScript.Spreadsheet.Sheet, fixtureLine: string[], writeSheet: Function) => (time: Time): void => {
        writeSheet()
        fixtureLine.length = 0
        fixtureLine.push(time)
    })(sheet, fixtureLine, writeSheet)

    const handlePitch = ((pitchLine: Pitch[], coords: Coords, writeFromRow: number) => (pitch: Pitch): void => {
        if (coords.row !== (writeFromRow + 1)) {
            return
        }

        pitchLine.push(pitch)
        pitchLine.push('')
        pitchLine.push('')
    })(pitchLine, coords, writeFromRow)

    const handleNoFixture = ((fixtureLine: string[]) => (time: Time): void => {
        fixtureLine.push('')
        fixtureLine.push('')
        fixtureLine.push('')
    })(fixtureLine)

    const handleFixture = ((fixtureLine: string[]) => (fixture: Fixture): void => {
        const [,,stage,home,,away] = fixture

        fixtureLine.push(`${stage} - ${home} v ${away}`)
        fixtureLine.push('')
        fixtureLine.push('')
    })(fixtureLine)

    const cleanUp = ((
        sheet: GoogleAppsScript.Spreadsheet.Sheet,
        pitchLine: string[],
        writeSheet: Function,
        writeFromRow: number,
    ) => (): void => {
        writeSheet()

        sheet.getRange(`${writeFromRow}:${writeFromRow}`).setValues([pitchLine])
    })(sheet, pitchLine, writeSheet, writeFromRow)

    return {
        handleTime,
        handlePitch,
        handleNoFixture,
        handleFixture,
        cleanUp,
    }
}
