import { ranges, PREVIOUS_SCHEDULE_IDS } from './config'

const aliases = new Map([
    ['London Eagles', 'London Eagles Green']
])

export const writeOverallStandings = (): void => {
    //const ss: GoogleAppsScript.Spreadsheet.Spreadsheet = SpreadsheetApp.getActive()

    const perf: Map<string, number> = new Map()

    PREVIOUS_SCHEDULE_IDS.forEach(id => {
        const s = SpreadsheetApp.openById(id)
        const standings = s.getSheetByName('Final Standings')
            .getRange(ranges.finalStanding)

        standings.getValues().forEach(v => {
            let [,team,pts] = v

            if (team === '') {
                return
            }

            if (aliases.has(team)) {
                team = aliases.get(team)
            }

            if (!perf.has(team)) {
                perf.set(team, 0)
            }

            perf.set(team, perf.get(team) + parseInt(pts, 10))
        })
    })

    const overall = Array.from(perf)

    overall.sort((a: [string, number], b: [string, number]): number => {
        const [ateam, apts] = a
        const [bteam, bpts] = b

        if (apts < bpts) {
            return 1
        } else if (apts > bpts) {
            return -1
        }

        // absolute default is to sort by team name
        return ( ( ateam === bteam ) ? 0 : ( ( ateam > bteam ) ? 1 : -1 ) )
    })

    console.log(overall)
}
