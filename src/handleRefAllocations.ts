import { Fixture, RefRefSum, RefSum } from './types'

export const handleRefAllocations = (
    refRefTally: RefRefSum,
    refTally: RefSum,
) => ([,,,,,,,...refs]: Fixture): void =>
{
    const filtered: string[] = refs.filter(ref => refTally.has(ref))

    for (let o = 0;o < filtered.length;o++) {
        for (let i = 0;i < filtered.length;i++) {
            if (o === i) {
                refTally.set(refs[o], refTally.get(refs[o]) + 1)
                continue
            }

            const alloc = refRefTally.get(refs[o])
            alloc.set(refs[i], alloc.get(refs[i]) + 1)
        }
    }
}