import { setValues } from './gas_wrappers'

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

    setValues(sRefCrosstable, writeRange, lines)
}