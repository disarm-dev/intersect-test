const fs = require('fs')
const intersect = require('@turf/intersect')

const villages = JSON.parse(fs.readFileSync('nam.villages.geojson')).features.slice(0, 10)
const cons = JSON.parse(fs.readFileSync('nam.constituencies.geojson')).features.slice(0, 10)

console.time('intersect');
big_result = cons.map(con => {
    const con_result = villages.map(v => {
        try {
            const result = intersect(con, v)
            if (result) return result
        } catch (e) {}
    }).filter(i => i)
    return con_result
});
console.timeEnd('intersect')