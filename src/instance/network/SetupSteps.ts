export type SetupSteps = Map<SetupFlag, boolean>

export enum SetupFlag {
    COMMERCE = 0,
    WEBSITE = 1,
    HOSTING = 2,
    COMMUNITY = 3
}

export function fromObject(obj: any): SetupSteps {
    const map = new Map()
    for (const key in obj) {
        map.set(Number(key), obj[key])
    }
    return map
}