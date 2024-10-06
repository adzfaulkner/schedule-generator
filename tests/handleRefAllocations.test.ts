import { describe, expect, it } from 'vitest'

import { handleRefAllocations } from '../src/handleRefAllocations'

import type { RefNames } from '../src/types'
import {Fixture} from "../src/types";

const fixture: Fixture = ['12:15', 'AGP 1', 'POOL A', 'A', '1', 'B', '1', 'Ref 1', 'Ref 2', '']

const referees: RefNames = [['Ref 1'], ['Ref 2'], ['Ref 3'], ['Ref 4'], ['Ref 5'], ['Ref 6'], ['Ref 7'], ['Ref 8']]

describe('handleRefAllocations', function () {
    it('should ignore refs that are not in the list ie player refs', function () {
        const refTally = new Map(referees.map(referee => [referee[0], 0]))
        const refRefTally = new Map(referees.map(referee => [referee[0], new Map(refTally)]))

        fixture[fixture.length - 1] = 'Invalid'

        handleRefAllocations(refRefTally, refTally)(fixture)

        expect(Array.from(refTally.entries())).toEqual([
            ['Ref 1', 1],
            ['Ref 2', 1],
            ['Ref 3', 0],
            ['Ref 4', 0],
            ['Ref 5', 0],
            ['Ref 6', 0],
            ['Ref 7', 0],
            ['Ref 8', 0],
        ])

        expect(Array.from(refRefTally.keys())).toEqual(['Ref 1','Ref 2','Ref 3','Ref 4','Ref 5','Ref 6','Ref 7','Ref 8'])
    })
})