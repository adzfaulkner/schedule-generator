import { ranges, PREVIOUS_SCHEDULE_IDS } from './config'
import * as console from "node:console";

export const writeOverallStandings = (): void => {
    //const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActive()

    PREVIOUS_SCHEDULE_IDS.forEach(id => {
        const s = SpreadsheetApp.openById(id)
        const standings = s.getSheetByName('Final Standings')
            .getRange(ranges.finalStanding)

        console.log(standings.getValues())
    })
}
