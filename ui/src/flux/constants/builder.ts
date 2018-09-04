export const NEW_FROM = `from(bucket: "pick a bucket")\n\t|> filter(fn: (r) => r.tag == "value")\n\t|> range(start: -1m)`
export const NEW_JOIN = `join(tables:{fil:fil, tele:tele}, on:["host"], fn:(tables) => tables.fil["_value"] + tables.tele["_value"])`
