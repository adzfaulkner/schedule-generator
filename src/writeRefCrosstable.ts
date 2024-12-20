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

    const writeRange = `D2:${columnToLetter(lines[0].length + 3)}${lines.length+1}`

    setValues(sRefCrosstable, writeRange, lines)
}