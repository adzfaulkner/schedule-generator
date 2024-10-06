import { ranges } from './config'

import type { RefRefSum, RefSum } from './types'

export const writeRefCrossTable = (
    sRefCrosstable: GoogleAppsScript.Spreadsheet.Sheet,
    writeRange: string,
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

    sRefCrosstable.getRange(writeRange).setValues(lines)
}