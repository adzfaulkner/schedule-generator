const cache = new Map()

export const columnToLetter = ((cache: Map<number, string>) => (col: number): string => {
    if (!cache.has(col)) {
        let temp, letter = '', column = col

        while (column > 0) {
            temp = (column - 1) % 26
            letter = String.fromCharCode(temp + 65) + letter
            column = (column - temp - 1) / 26
        }

        cache.set(col, letter)
    }

    return cache.get(col)
})(cache)
