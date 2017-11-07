const fs = require('fs')
const intersect = require('@turf/intersect')

const outer = JSON.parse(fs.readFileSync('nam.constituencies.geojson')).features
const inner = JSON.parse(fs.readFileSync('nam.villages.geojson')).features//.slice(0, 100)

console.time('intersect');
const grouped_by_intersection = outer.map(outer => {
  const intersected_inners = inner.map(inner => {
    try {
      const intersection_result = intersect(outer, inner)
      if (intersection_result) return intersection_result
    } catch (e) {
    }
  }).filter(i => i)
  return {
    outer: outer,
    inners: intersected_inners
  }
});
console.timeEnd('intersect')