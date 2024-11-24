import { columnToLetter } from './columnToLetter'
import { setValues } from './gas_wrappers'

import type { RefRefSum, RefSum } from './types'

export const writeRefCrossTable = (
    sRefCrosstable: GoogleAppsScript.Spreadsheet.Sheet
) => (
    refRefTally: RefRefSum,
    refTally: RefSum
): void => {
    const lines: any[] = []

    refRefTally.forEach((m, key) => {
        lines.push([
            ...Array.from(m.values()),
            '',
            refTally.get(key)
        ])
    })

    console.log(columnToLetter(lines[0].length + 4), lines.length)

    const writeRange = `D2:${columnToLetter(lines[0].length + 4)}${lines.length+1}`

    console.log(writeRange)

    setValues(sRefCrosstable, writeRange, lines)
}