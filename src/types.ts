export type Pitch = string
export type Time = string
type Stage = string
export type Team = string
type Score = string
type Ref = string
export type RefNames = [Ref][]
export type Fixture = [Time, Pitch, Stage, Team, Score, Team, Score, Ref, Ref, Ref]

export type FixturesByPitchAndTime = Map<Pitch, Map<Time, Fixture>>
export type Pitches = Set<string>
export type Times = Set<string>

export type RefSum = Map<Ref, number>
export type RefRefSum = Map<Ref, RefSum>

export type Performance = [number, number, number, number, number, number, number, number]

export type PoolTeamsPerformance = Map<Stage, Map<Team, Performance>>

export type PoolTeamsPerformanceAfterSort = [Team, Performance]