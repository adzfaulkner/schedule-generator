const rewire = require('rewire')

const sut = rewire('../Compute.js')

const columnToLetter = sut.__get__('columnToLetter')

describe('columnToLetter', function () {
    it('produces what is expected', function () {
        expect(columnToLetter(1)).toEqual('A')
        expect(columnToLetter(4)).toEqual('D')
        expect(columnToLetter(27)).toEqual('AA')
    })
})