import { Fixture, FixturesByPitchAndTime } from './types'

export const handleFixturesByPitchAndTime = (
    fixturesByPitchAndTime: FixturesByPitchAndTime
) => (fixture: Fixture): void =>
{
    const [time, pitch, stage] = fixture

    if (!stage.toUpperCase().includes("POOL")) {
        return
    }

    if (!fixturesByPitchAndTime.has(pitch)) {
        fixturesByPitchAndTime.set(pitch, new Map())
    }

    fixturesByPitchAndTime.get(pitch).set(time, fixture)
}