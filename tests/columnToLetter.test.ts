import { describe, expect, it } from 'vitest'

import { columnToLetter } from '../src/columnToLetter'

describe('columnToLetter', function () {
    it('produces what is expected', function () {
        expect(columnToLetter(1)).toEqual('A')
        expect(columnToLetter(4)).toEqual('D')
        expect(columnToLetter(27)).toEqual('AA')
    })
})