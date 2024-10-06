import { columnToLetter } from './columnToLetter'

import type { FixturesByPitchAndTime, Pitches, Times } from './types'

export const writeSchedule = (
    sSchedule: GoogleAppsScript.Spreadsheet.Sheet,
    writeFromRow: number
) => (
    fixturesByPitchAndTime: FixturesByPitchAndTime,
    pitches: Pitches,
    times: Times
): void => {
    let writeFrom
    let range, col, colLetter, colLetterTo

    let pitchLine = []

    col = 1

    const setFixtureSheetCells = (time: string, pitch: string, range: string): string[][] => {
        const timeCellValue = col === 1 ? time: ''

        if (
            !fixturesByPitchAndTime.has(pitch)
            || !fixturesByPitchAndTime.get(pitch).has(time)
        ) {
            sSchedule.getRange(range).setValues([
                [timeCellValue, ''],
                ['', ''],
                ['', ''],
            ])

            return
        }

        const [,,stage,home,,away] = fixturesByPitchAndTime.get(pitch).get(time)

        sSchedule.getRange(range).setValues([
            [timeCellValue, stage],
            ['', home],
            ['', away],
        ])
    }

    for (const pitch of pitches) {
        pitchLine.push(pitch)
        pitchLine.push('')
        pitchLine.push('')

        writeFrom = writeFromRow + 1

        colLetter = columnToLetter(col)
        colLetterTo = columnToLetter(col+1)

        for (const time of times) {
            setFixtureSheetCells(time, pitch, `${colLetter}${writeFrom}:${colLetterTo}${writeFrom+2}`)
            writeFrom += 4
        }

        col += 3
    }

    writeFrom = 1

    range = `${writeFrom}:${writeFrom}`
    sSchedule.getRange(range).setValues([['', ...pitchLine]])

    writeFrom = writeFromRow

    range = `${writeFrom}:${writeFrom}`
    sSchedule.getRange(range).setValues([['TIME', ...pitchLine]])
}