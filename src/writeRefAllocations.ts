import { setValues } from './gas_wrappers'

import { FixturesByPitchAndTime, Pitches, Times } from './types'

export const writeRefAllocations = (
    sRefAllocs: GoogleAppsScript.Spreadsheet.Sheet,
    writeFromRow: number
) => (
    fixturesByPitchAndTime: FixturesByPitchAndTime,
    pitches: Pitches,
    times: Times
): void => {
    let line = ['TIME']
    let cellVal
    let writeFrom = writeFromRow

    for (const pitch of pitches) {
        line.push(pitch)
        line.push('')
        line.push('')
    }

    const range = `${writeFrom}:${writeFrom}`
    setValues(sRefAllocs, range, [line])

    writeFrom++

    for (const time of times) {
        line = [time]

        for (const pitch of pitches) {
            cellVal = ''

            if (
                fixturesByPitchAndTime.has(pitch)
                && fixturesByPitchAndTime.get(pitch).has(time)
            ) {
                const [,,stage,home,,away] = fixturesByPitchAndTime.get(pitch).get(time)
                cellVal = `${stage} - ${home} v ${away}`
            }

            line.push(cellVal)
            line.push('')
            line.push('')
        }

        setValues(sRefAllocs, `${writeFrom}:${writeFrom}`, [line])

        writeFrom += 4
    }
}