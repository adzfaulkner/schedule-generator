import { Fixture, FixturesByPitchAndTime } from './types'

export const handleFixturesByPitchAndTime = (
    fixturesByPitchAndTime: FixturesByPitchAndTime
) => (fixture: Fixture): void =>
{
    const [time, pitch] = fixture

    if (!fixturesByPitchAndTime.has(pitch)) {
        fixturesByPitchAndTime.set(pitch, new Map())
    }

    fixturesByPitchAndTime.get(pitch).set(time, fixture)
}