const rewire = require('rewire')

const sut = rewire('../Compute.js')

const writeStandings = sut.__get__('writeStandings')

describe('writeStandings', function () {
    it('produces what is expected', function () {
        let expectedRange = ''
        let expectedVals = []

        const sStandings = {
            getRange: (range) => {
                expectedRange = range
                return {
                    setValues: (vals) => {
                        expectedVals = vals
                    }
                }
            }
        }

        const poolA = new Map([
            ['Team 1', [3,0,3,0,14,14,0,6]],
            ['Team 2', [3,2,1,0,20,5,15,9]],
            ['Team 3', [3,1,1,1,10,13,-3,4]],
            ['Team 4', [3,1,1,1,10,11,-1,4]],
        ])

        const poolB = new Map([
            ['Team 5', [3,1,2,0,15,13,2,6]],
            ['Team 6', [3,0,0,3,5,15,-10,3]],
            ['Team 7', [3,1,2,0,15,12,3,6]],
            ['Team 8', [3,1,2,0,16,14,2,6]],
        ])

        const poolsTeamsPerformance = new Map([
            ['POOL A', poolA],
            ['POOL B', poolB],
        ])

        writeStandings(sStandings, poolsTeamsPerformance)

        expect(expectedRange).toEqual("A1:J12")

        expect(expectedVals).toEqual([
            [ 'POOL A', '', '', '', '', '', '', '', '', '' ],
            [ 'Pos', 'Team', 'Pl', 'W',   'D',    'L', 'TF',  'TA',   'TD', 'Pts' ],
            [ 1, 'Team 2', 3, 2, 1, 0, 20, 5, 15, 9 ],
            [ 2, 'Team 1', 3, 0, 3, 0, 14, 14, 0, 6 ],
            [ 3, 'Team 4', 3, 1, 1, 1, 10, 11, -1, 4 ],
            [ 4, 'Team 3', 3, 1, 1, 1, 10, 13, -3, 4 ],
            [ 'POOL B', '', '', '', '', '', '', '', '', '' ],
            [ 'Pos', 'Team', 'Pl', 'W',   'D',    'L', 'TF',  'TA',   'TD', 'Pts' ],
            [ 1, 'Team 7', 3, 1, 2, 0, 15, 12, 3, 6 ],
            [ 2, 'Team 8', 3, 1, 2, 0, 16, 14, 2, 6 ],
            [ 3, 'Team 5', 3, 1, 2, 0, 15, 13, 2, 6 ],
            [ 4, 'Team 6', 3, 0, 0, 3, 5, 15, -10, 3 ]
        ])
    })
})