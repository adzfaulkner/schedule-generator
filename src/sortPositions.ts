import { PoolTeamsPerformanceAfterSort } from './types'

export const sortPositions = (
    [hname, [,,,,hts,,htd,hpts]]: PoolTeamsPerformanceAfterSort,
    [aname, [,,,,ats,,atd,apts]]: PoolTeamsPerformanceAfterSort
): number => {
    if (hpts < apts) {
        return 1
    } else if (hpts > apts) {
        return -1
    }

    if (htd < atd) {
        return 1
    } else if (htd > atd) {
        return -1
    }

    if (hts < ats) {
        return 1
    } else if (hts > ats) {
        return -1
    }

    // absolute default is to sort by team name
    return ( ( hname === aname ) ? 0 : ( ( hname > aname ) ? 1 : -1 ) )
}