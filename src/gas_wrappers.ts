export const getRange = (sheet: GoogleAppsScript.Spreadsheet.Sheet, range: string): GoogleAppsScript.Spreadsheet.Range => {
    try {
        return sheet.getRange(range)
    } catch (e) {
        throw Error(`error: ${e.name}: ${e.message} whilst fetch sheet ${sheet.getName()} range ${range}`)
    }
}

export const setValues = ((getRange: Function) => (sheet: GoogleAppsScript.Spreadsheet.Sheet, range: string, values: string[][]) => {
    const r = getRange(sheet, range)

    try {
        r.setValues(values)
    } catch (e) {
        throw Error(`error: ${e.name}: ${e.message} whilst set values sheet ${sheet.getName()} range ${range}`)
    }
})(getRange)