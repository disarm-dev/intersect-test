DOUMA - Getting villages for a given constituency.

- naive intersect-only: 25.7 seconds
- rbush then intersect:  1.5 seconds


## Detail timing for the rbush-then-intersection

- bboxes: 7.035ms
- index: 6.841ms
- intersect: 1545.715ms
- whole thing: 1574.938ms

The only thing I think we can do to speed it up further is cache the index. 
But this would be pointless for our use-case, and would only save us 6.8 milliseconds!
