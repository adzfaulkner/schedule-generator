const aliases = new Map([
    ['London Eagles', 'London Eagles Green'],
    ['London Scorpions', 'London Scorpions Gurus']
])

export const writeOverallStandings = (
    sSeriesStandings: GoogleAppsScript.Spreadsheet.Sheet,
    finalStandings: any[][],
    previousFinalStandings: any[][]
): void => {
    const perf: Map<string, number> = new Map()
    const standings = [...finalStandings, ...previousFinalStandings]

    standings.forEach(([,team,pts]) => {
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

    let pos = 1
    overall.forEach(([team, pts]) => {
        sSeriesStandings.getRange(`A${pos+1}:C${pos+1}`)
            .setValues([[pos, team, pts]])
        pos++
    })
}
