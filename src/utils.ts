import type {Fixture, Team, Time} from './types'

export function teamCrossTable(teams: Team[][], fixtures: Fixture[], times: Time[][]): string[][] {
    const teamsM: Team[] = teams.map((l: Team[]) => l[0])
    const timesM: Time[] = Array.from(new Set(times.map((l: Time[]) => l[0])
        .sort((a: Time, b: Time): number => {
            const aa: number = parseInt(a.replace(':', ''), 10)
            const bb: number = parseInt(b.replace(':', ''), 10)

            if (aa < bb) {
                return -1
            } else if(aa > bb) {
                return 1
            }

            return 0
        })))

    const teamsInSlot: Map<Time, Team[]> = new Map(timesM.map((time: Time) => [time, []]))

    const teamSums: [Team, number][] = teamsM.map((team: Team) => [team, 0])
    const hasPlayed: [Team, string][] = teamsM.map((team: Team) => [team, ''])

    const backToBackCount: Map<Team, number> = new Map([...teamSums])
    const sumMatches: Map<Team, number> = new Map([...teamSums])
    const teamsHasPlayed: Map<Team, Map<Team, string>> = new Map(teamsM.map((team: Team) => [team, new Map([...hasPlayed])]))

    for (const [time,,,homeTeam,,awayTeam] of fixtures) {
        if (time === '') {
            break
        }

        if (!teamsM.includes(homeTeam) || !teamsM.includes(awayTeam)) {
            continue
        }

        teamsHasPlayed.get(homeTeam).set(awayTeam, teamsHasPlayed.get(homeTeam).get(awayTeam) + 'X')
        teamsHasPlayed.get(awayTeam).set(homeTeam, teamsHasPlayed.get(awayTeam).get(homeTeam) + 'X')

        sumMatches.set(homeTeam, sumMatches.get(homeTeam) + 1)
        sumMatches.set(awayTeam, sumMatches.get(awayTeam) + 1)

        teamsInSlot.set(time, [...teamsInSlot.get(time), homeTeam, awayTeam])
    }

    for (let i = 1;i < timesM.length;i++) {
        teamsInSlot.get(timesM[i])
            .filter((team: Team) => teamsInSlot.get(timesM[i - 1]).includes(team))
            .forEach((team: Team) => {
                backToBackCount.set(team, backToBackCount.get(team) + 1)
            })
    }

    return teamsM.map((teamO: Team): string[] => {
        const line: string[] = teamsM.map((teamI: Team): string => teamsHasPlayed.get(teamO).get(teamI))
        line.push(backToBackCount.get(teamO).toString())
        line.push(sumMatches.get(teamO).toString())

        return line
    })
}