export const ranges = {
    // raw sheet fixture list - time cell to last ref
    fixture: 'A1:J30',
    // referee names column of the ref cross table
    refNames: 'A2:A12',
    // 1st referee tally cell (should be blacked out) to bottom right of the total column
    refRefTally: 'D2:M12',
    // where to write the standings from
    standings: 'A1:J',
    // ignore the header
    finalStanding: 'A2:C13',
}

// this id row number to write the schedule from which typically will be the row after the game length / halftime duration statement
export const SCHEDULE_WRITE_FROM_ROW = 6

export const REF_ALLOCS_WRITE_FROM = 2

export const PREVIOUS_SCHEDULE_IDS = []