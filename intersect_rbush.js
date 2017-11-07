const fs = require('fs')
const intersect = require('@turf/intersect')
const bounding_box = require('@turf/bbox')
const rbush = require('rbush')


console.time('everything')

// Specify unique ID fields for outer and inner sets of data
const outer_id_field = 'OBJECTID'
const inner_id_field = 'uID'

// Load outer and inner geodata files
const outer = JSON.parse(fs.readFileSync('nam.constituencies.geojson')).features
const inner = JSON.parse(fs.readFileSync('nam.villages.geojson')).features//.slice(0, 100)

// Bounding boxes for everything
console.time('bboxes')

function bbox_and_id(feature, field, type) {
  const bbox = bounding_box(feature.geometry)
  return {
    id: feature.properties[field],
    minX: bbox[0],
    minY: bbox[1],
    maxX: bbox[2],
    maxY: bbox[3],
    type,
    feature
  }
}

const inner_bboxes = inner.map(f => bbox_and_id(f, inner_id_field, 'inner'))
const outer_bboxes = outer.map(f => bbox_and_id(f, outer_id_field, 'outer'))
console.timeEnd('bboxes')
console.log('inner_bboxes.length', inner_bboxes.length)
console.log('outer_bboxes.length', outer_bboxes.length)


// Create spatial index
console.time('index')
const all_bboxes = inner_bboxes.concat(outer_bboxes)
const tree = rbush()
const index = tree.load(all_bboxes)
console.timeEnd('index')
console.log('indexed', all_bboxes.length, 'bboxes')


// Find ids of inner bboxes that are in each outer bbox
// This narrows search for intersections
console.time('intersect');
const grouped_by_bbox = outer.map(outer_feature => {
  // Want to get IDs of any inner features found by bbox
  const outer_bbox = outer_bboxes.find(b => b.id === outer_feature.properties[outer_id_field])
  const found_inners = tree.search(outer_bbox)
  const found_inner_features = found_inners.map(f => f.feature)
  const confirmed_intersections = found_inner_features.filter(inner_feature => {
    try {
      const result = intersect(outer_feature.geometry, inner_feature.geometry)
      if (result) return true
    } catch (e) {
      console.error(e)
    }
  })

  return {
    outer: outer_feature,
    inners: confirmed_intersections
  }
})
console.timeEnd('intersect')

console.timeEnd('everything')

