import { describe, expect, it } from 'vitest'

import { aggregate } from '../src/aggregate'

import type {Fixture, RefNames} from '../src/types'

const values: Fixture[] = [
    ['12:15', 'AGP 1', 'POOL A', 'A', '1', 'B', '1', 'Ref 1', 'Ref 2', ''],
    ['12:15', 'AGP 2', 'POOL B', 'D', '2', 'E', '0', 'Ref 3', 'Ref 4', ''],
    ['12:45', 'AGP 1', 'POOL C', 'G', '10', 'H', '2', 'Ref 5', 'Ref 6', ''],
    ['12:45', 'AGP 2', 'POOL D', 'J', '', 'K', '', 'Ref 7', 'Ref 8', ''],
    ['13:15', 'AGP 1', 'POOL A', 'A', '2', 'C', '5', 'Ref 1', 'Ref 4', ''],
    ['13:15', 'AGP 2', 'POOL B', 'D', '', 'F', '', 'Ref 2', 'Ref 3', ''],
    ['13:45', 'AGP 1', 'POOL C', 'G', '', 'I', '', 'Ref 5', 'Ref 8', ''],
    ['13:45', 'AGP 2', 'POOL D', 'J', '', 'L', '', 'Ref 6', 'Ref 7', ''],
    ['14:15', 'AGP 1', 'POOL A', 'B', '', 'C', '', 'Ref 1', 'Ref 3', ''],
    ['14:15', 'AGP 2', 'POOL B', 'E', '', 'F', '', 'Ref 2', 'Ref 4', ''],
    ['14:45', 'AGP 1', 'POOL C', 'H', '', 'I', '', 'Ref 5', 'Ref 7', ''],
    ['14:45', 'AGP 2', 'POOL D', 'K', '', 'L', '', 'Ref 6', 'Ref 8', ''],
    ['15:15', 'AGP 1', 'BOWL', 'Bowl 1', '', 'Bowl 2', '', 'Ref 1', 'Ref 6', ''],
    ['15:15', 'AGP 2', 'BOWL', 'Bowl 3', '', 'Bowl 3', '', 'Ref 4', 'Ref 8', ''],
    ['15:45', 'AGP 1', 'PLATE', 'Plate 1', '', 'Plate 2', '', 'Ref 2', 'Ref 7', ''],
    ['15:45', 'AGP 2', 'PLATE', 'Plate 3', '', 'Plate 4', '', 'Ref 3', 'Ref 5', ''],
    ['16:15', 'AGP 1', 'CUP', 'Cup 1', '', 'Cup 2', '', 'Ref 1', 'Ref 8', ''],
    ['16:15', 'AGP 2', 'CUP', 'Cup 3', '', 'Cup 4', '', 'Ref 4', 'Ref 6', ''],
    ['16:45', 'AGP 1', 'BOWL', 'Bowl F', '', 'Bowl F', '', 'Ref 2', 'Ref 5', ''],
    ['16:45', 'AGP 2', 'BOWL', '11/12th PO', '', '11/12th PO', '', 'Ref 3', 'Ref 7', ''],
    ['17:15', 'AGP 1', 'PLATE', 'Plate F', '', 'Plate F', '', 'Ref 1', 'Ref 4', ''],
    ['17:15', 'AGP 2', 'PLATE', '7/8th PO', '', '7/8th PO', '', 'Ref 6', 'Ref 8', ''],
    ['17:45', 'AGP 1', 'CUP', 'Cup F', '', 'Cup F', '', 'Ref 2', 'Ref 3', ''],
    ['17:45', 'AGP 2', 'CUP', '3/4 PO', '', '3/4 PO', '', 'Ref 5', 'Ref 7', ''],
    [ '', '', '', '', '', '', '', '','', ''],
]

const referees: RefNames = ['Ref 1', 'Ref 2', 'Ref 3', 'Ref 4', 'Ref 5', 'Ref 6', 'Ref 7', 'Ref 8']

describe('aggregate', function () {
    it('should produce what is expected', function () {
        const { poolsTeamsPerformance, refRefTally, refTally, pitches, times, fixturesByPitchAndTime } = aggregate(values, referees)

        expect(Array.from(poolsTeamsPerformance.keys())).toEqual(['POOL A', 'POOL B', 'POOL C', 'POOL D'])

        // team w d l ts ta td pts
        expect(Array.from(poolsTeamsPerformance.get('POOL A'))).toEqual([
            ['A', [2, 0, 1, 1, 3, 6, -3, 3]],
            ['B', [1, 0, 1, 0, 1, 1, 0, 2]],
            ['C', [1, 1, 0, 0, 5, 2, 3, 4]],
        ])

        expect(Array.from(poolsTeamsPerformance.get('POOL B'))).toEqual([
            ['D', [1, 1, 0, 0, 2, 0, 2, 4]],
            ['E', [1, 0, 0, 1, 0, 2, -2, 1]],
            ['F', [0, 0, 0, 0, 0, 0, 0, 0]],
        ])

        expect(Array.from(poolsTeamsPerformance.get('POOL C'))).toEqual([
            ['G', [1, 1, 0, 0, 10, 2, 8, 4]],
            ['H', [1, 0, 0, 1, 2, 10, -8, 1]],
            ['I', [0, 0, 0, 0, 0, 0, 0, 0]],
        ])

        expect(Array.from(poolsTeamsPerformance.get('POOL D'))).toEqual([
            ['J', [0, 0, 0, 0, 0, 0, 0, 0]],
            ['K', [0, 0, 0, 0, 0, 0, 0, 0]],
            ['L', [0, 0, 0, 0, 0, 0, 0, 0]],
        ])

        expect(Array.from(refRefTally.keys())).toEqual(['Ref 1', 'Ref 2', 'Ref 3', 'Ref 4', 'Ref 5', 'Ref 6', 'Ref 7', 'Ref 8'])

        expect(Array.from(refRefTally.get('Ref 1').entries())).toEqual([
            ['Ref 1', 0],
            ['Ref 2', 1],
            ['Ref 3', 1],
            ['Ref 4', 2],
            ['Ref 5', 0],
            ['Ref 6', 1],
            ['Ref 7', 0],
            ['Ref 8', 1],
        ])

        expect(Array.from(refRefTally.get('Ref 2').entries())).toEqual([
            ['Ref 1', 1],
            ['Ref 2', 0],
            ['Ref 3', 2],
            ['Ref 4', 1],
            ['Ref 5', 1],
            ['Ref 6', 0],
            ['Ref 7', 1],
            ['Ref 8', 0],
        ])

        expect(Array.from(refRefTally.get('Ref 3').entries())).toEqual([
            ['Ref 1', 1],
            ['Ref 2', 2],
            ['Ref 3', 0],
            ['Ref 4', 1],
            ['Ref 5', 1],
            ['Ref 6', 0],
            ['Ref 7', 1],
            ['Ref 8', 0],
        ])

        expect(Array.from(refRefTally.get('Ref 4').entries())).toEqual([
            ['Ref 1', 2],
            ['Ref 2', 1],
            ['Ref 3', 1],
            ['Ref 4', 0],
            ['Ref 5', 0],
            ['Ref 6', 1],
            ['Ref 7', 0],
            ['Ref 8', 1],
        ])

        expect(Array.from(refRefTally.get('Ref 5').entries())).toEqual([
            ['Ref 1', 0],
            ['Ref 2', 1],
            ['Ref 3', 1],
            ['Ref 4', 0],
            ['Ref 5', 0],
            ['Ref 6', 1],
            ['Ref 7', 2],
            ['Ref 8', 1],
        ])

        expect(Array.from(refRefTally.get('Ref 6').entries())).toEqual([
            ['Ref 1', 1],
            ['Ref 2', 0],
            ['Ref 3', 0],
            ['Ref 4', 1],
            ['Ref 5', 1],
            ['Ref 6', 0],
            ['Ref 7', 1],
            ['Ref 8', 2],
        ])

        expect(Array.from(refRefTally.get('Ref 7').entries())).toEqual([
            ['Ref 1', 0],
            ['Ref 2', 1],
            ['Ref 3', 1],
            ['Ref 4', 0],
            ['Ref 5', 2],
            ['Ref 6', 1],
            ['Ref 7', 0],
            ['Ref 8', 1],
        ])

        expect(Array.from(refRefTally.get('Ref 8').entries())).toEqual([
            ['Ref 1', 1],
            ['Ref 2', 0],
            ['Ref 3', 0],
            ['Ref 4', 1],
            ['Ref 5', 1],
            ['Ref 6', 2],
            ['Ref 7', 1],
            ['Ref 8', 0],
        ])

        expect(Array.from(refTally.entries())).toEqual([
            [ 'Ref 1', 6 ],
            [ 'Ref 2', 6 ],
            [ 'Ref 3', 6 ],
            [ 'Ref 4', 6 ],
            [ 'Ref 5', 6 ],
            [ 'Ref 6', 6 ],
            [ 'Ref 7', 6 ],
            [ 'Ref 8', 6 ]
        ])

        expect(Array.from(pitches)).toEqual(['AGP 1', 'AGP 2'])

        expect(Array.from(times)).toEqual(['12:15', '12:45', '13:15', '13:45', '14:15', '14:45', '15:15', '15:45', '16:15', '16:45', '17:15', '17:45'])

        expect(Array.from(fixturesByPitchAndTime.keys())).toEqual(['AGP 1', 'AGP 2'])

        expect(Array.from(fixturesByPitchAndTime.get('AGP 1').keys())).toEqual(['12:15', '12:45', '13:15', '13:45', '14:15', '14:45'])

        expect(Array.from(fixturesByPitchAndTime.get('AGP 2').keys())).toEqual(['12:15', '12:45', '13:15', '13:45', '14:15', '14:45'])
    })
})