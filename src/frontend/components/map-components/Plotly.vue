<template>
  <div
    id="plotly"
    ref="plotly"
    class="w-100 h-100"
  >
    <div class="position-absolute p-2 text-left" style="top:0;">
      <b-badge v-if="filteredFeatures" variant="danger" class="mr-0" style="border-radius:0px;border-right:#FFFFFF 1px solid">
        {{ filteredFeatures.length }} &nbsp;
      </b-badge>
      <b-badge variant="dark" class="ml-0" style="border-radius:0px;">
        {{ featureCount }}
        <span v-if="filteredFeatures">
          (filtered)
        </span>
        <span v-else>
          total
        </span>
      </b-badge>
    </div>
  </div>
</template>

<script>
import Plotly, { feature } from 'plotly.js-mapbox-dist'

export default {
  props: {
    filteredFeatures: {
      type: [Array, Boolean],
      default: false,
    },
    filters: {
      type: [Object, Boolean],
      default: false,
    },
  },
  data() {
    return {
      featureCount: 0,
      mutedColor: 'rgba(180, 180, 180, 0.2)',
      mainPlotlyReference: 'plotly',
      plotlyInstance: null,
      plotlyData: null,
      colorBins: [],
      outline: {
        lon: [],
        lat: [],
      },
      iceland: {},
      selection: [],
      ids: [],
      colors: [],
    }
  },
  watch: {
    filteredFeatures(newValue, oldValue) {
      if (this.plotlyInstance) {
        if (newValue) {
          this.setFilteredFeatures()
        } else {
          this.clearFilteredFeatures()
        }
      }

    },
    plotlyInstance(val) {
      if (val && this.filteredFeatures) {
        this.setFilteredFeatures()
      }
    },
  },
  mounted() {
    this.collectColorBins()
    this.getJSON()
  },
  methods: {
    collectColorBins() {
      this.colorBins = []
      for (let i = 0; i < this.featureCount; i++) this.colorBins.push(this.mutedColor)
    },
    clearFilteredFeatures() {
      Object.values(this.plotlyData).forEach((value, index) => {
        this.colorBins[value[0]] = value[1]
      })
      Plotly.restyle(this.plotlyInstance, 'marker.color', [this.colorBins], [0])
      this.clearFilterOutline()
    },
    setFilterOutline() {
      let update = {
        'lon': [this.outline.lon],
        'lat': [this.outline.lat],
      }
      Plotly.restyle(this.plotlyInstance, update, [1])
    },
    clearFilterOutline() {
      let update = {
        'lon': [0],
        'lat': [0],
      }
      Plotly.restyle(this.plotlyInstance, update, [1])
    },
    setFilteredFeatures() {
      if (!this.filters.polygon) {
        this.clearFilterOutline()
      }
      this.collectColorBins()
      const data = this.plotlyData

      this.filteredFeatures.forEach((value, index) => {
        if (data[value]) {
          const pointLocation = data[value][0]
          const pointColor = data[value][1]
          this.colorBins[pointLocation] = pointColor
        }
      })

      Plotly.restyle(this.plotlyInstance, 'marker.color', [this.colorBins], [0])
    },
    getJSON() {
      let options = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      }
      fetch('https://raw.githubusercontent.com/castuofa/dataarc-source/main/map-layers/iceland.geojson', options)
      .then((response) => {
        return response.json()
      },
      )
      .then((json) => {
        this.iceland = json
        for (const feature in this.iceland.features) {
          this.ids.push(feature)
          this.colors.push(0)
          this.iceland.features[feature].id = feature
        }
        this.loadMap()
      })
    },
    isPointInPolygon(latitude, longitude, polygon) {
      const x = latitude; const y = longitude
      let inside = false
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i][0]; const yi = polygon[i][1]
        const xj = polygon[j][0]; const yj = polygon[j][1]

        const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi)

        if (intersect) {
          inside = !inside
          this.selection = polygon
        }
      }
      return inside

    },
    loadMap() {
      const vm = this
      Plotly.d3.csv(`${this.$apiUrl}/query/features`, (err, parsedRows) => {
        const rows = parsedRows.sort((a, b) => {
          const idA = a.id
          const idB = b.id
          if (idA < idB) return -1
          if (idA > idB) return 1
          return 0
        })
        vm.featureCount = rows.length
        vm.collectColorBins()

        function unpack(items, key) {
          return items.map((row) => {
            return row[key]
          })
        }

        const data = [
          {
            type: 'scattermapbox',
            ids: unpack(rows, 'id'),
            text: unpack(rows, 'text'),
            lon: unpack(rows, 'lon'),
            lat: unpack(rows, 'lat'),
            color: unpack(rows, 'color'),
            marker: {
              color: unpack(rows, 'color'),
              opacity: Array(rows.length).fill(0.6),
              size: Array(rows.length).fill(8),
              allowoverlap: true,
            },
            hovertemplate: '%{text}<extra></extra>',
            showlegend: false,
          },
          {
            type: 'scattermapbox',
            mode: 'lines',
            lon: 0,
            lat: 0,
            marker: { size: 10, color: 'black'},
            showlegend: false,
            hoverinfo: 'none'
          },
          {
            type: 'choroplethmapbox',
            geojson: this.iceland,
            locations: this.ids,
            z: this.colors,
            marker: {
              line: {
                width: 2,
                color: 'rgba(116, 73, 17, 1)',
              },
              opacity: 0.2,
            },
            selected: {
              marker: {
                opacity: 0.2,
              },
            },
            unselected: {
              marker: {
                opacity: 0.2,
              },
            },
            showscale: false,
            showlegend: false,
            hoverinfo: 'skip',
          },
        ]

        const layout = {
          autosize: true,
          dragmode: 'zoom',
          mapbox: {
            style: 'carto-positron',
            center: { lat: 62, lon: -18 },
            zoom: 2,
          },
          margin: {
            r: 0, t: 0, b: 0, l: 0,
          },
          hoverlabel: {
            font: {
              color: 'white',
            },
            padding: 2,
            bordercolor: 'white',
          },
          showlegend: false,
        }

        let modeBarButtons = [[
          'pan2d',
          'select2d',
          'lasso2d',
          'zoomIn2d',
          'zoomOut2d',
          'resetViews',
          'toImage',
        ]]

        const config = {
          modeBarButtons: modeBarButtons,
          responsive: true,
          displaylogo: false,
          displayModeBar: true,
        }

        Plotly.newPlot(vm.mainPlotlyReference, data, layout, config).then((gd) => {
          vm.plotlyInstance = gd
          vm.plotlyData = {}
          data[0].ids.forEach((value, index) => {
            vm.plotlyData[value] = [index, data[0].color[index]]
          })

          gd.addEventListener('mouseup', (evt) => {
            let xaxis = gd._fullLayout.mapbox._subplot.xaxis;
            let yaxis = gd._fullLayout.mapbox._subplot.yaxis;
            let l = gd._fullLayout.margin.l;
            let t = gd._fullLayout.margin.t;

            let xInDataCoord = xaxis.p2c(evt.x - l);
            let yInDataCoord = yaxis.p2c(evt.y - t);

            for (let i = 0; i < this.iceland.features.length; i++) {
              let coords = this.iceland.features[i].geometry.coordinates
              // If multiple polygons
              if (coords.length > 1) {
                for (let a = 0; a < coords.length; a++) {
                  if (this.isPointInPolygon(xInDataCoord, yInDataCoord, coords[a][0])) {
                    this.outline = {lat:[], lon:[]}
                    const firstPoint = this.selection[0]
                    for (const point in this.selection) {
                      this.outline.lon.push(this.selection[point][0])
                      this.outline.lat.push(this.selection[point][1])
                    }
                    this.outline.lon.push(firstPoint[0])
                    this.outline.lat.push(firstPoint[1])
                    this.setFilterOutline()
                    this.$emit('filtered', this.selection)
                    a = coords.length
                    i = this.iceland.features.length
                  }
                }
              }
              // Single Polygon
              else if (this.isPointInPolygon(xInDataCoord, yInDataCoord, coords[0])) {
                this.outline = {lat:[], lon:[]}
                const firstPoint = this.selection[0]
                for (const point in this.selection) {
                  this.outline.lon.push(this.selection[point][0])
                  this.outline.lat.push(this.selection[point][1])
                }
                this.outline.lon.push(firstPoint[0])
                this.outline.lat.push(firstPoint[1])
                this.setFilterOutline()
                this.$emit('filtered', this.selection)
                i = this.iceland.features.length
              }
            }
          })



          gd.on('plotly_selected', (eventData) => {
            if (eventData) {
              this.selection = []
              vm.addSelectionToFilter(eventData)
            }
          })
          gd.on('plotly_deselect', (eventData) => {
            this.$emit('removed', 'polygon')
          })
          gd.on('plotly_click', (eventData) => {
            if (eventData) {
              // WORKING EXAMPLE BELOW ON HOW TO COLORIZE CHART POINTS
              // var active = [
              //   '5fb05de59966e02a444509dd',
              //   '5faaf29809924644bc92778c',
              //   '5fb05de59966e02a444508dc',
              //   '5faaf29809924644bc927caa',
              //   '5faaf29809924644bc928899',
              //   '5faaf29809924644bc9275b9',
              //   '5faaf29809924644bc9278d8',
              //   '5faaf29809924644bc92830b',
              //   '5faaf29809924644bc9288ba',
              //   '5faac9a794c20d2de0de5c8d',
              //   '5faaf29909924644bc929218',
              //   '5faaf29909924644bc9295d1',
              //   '5faac9a794c20d2de0de5b08',
              //   '5faaf29809924644bc92882b',
              //   '5fb05826d8d8cf26ca190f20',
              //   '5faaf29809924644bc927590',
              //   '5faac9a794c20d2de0de5860',
              //   '5faaf29809924644bc927584',
              //   '5faaf29809924644bc92811f',
              //   '5faaf29809924644bc92844b',
              //   '5faaf29809924644bc927c8f',
              //   '5faaf29809924644bc928c69',
              //   '5faac9a794c20d2de0de6592',
              //   '5faaf29809924644bc927e7f',
              //   '5fb05826d8d8cf26ca190eba',
              //   '5fb05826d8d8cf26ca191152',
              //   '5faac9a794c20d2de0de5af0',
              //   '5fb05826d8d8cf26ca19168f',
              //   '5faac9a794c20d2de0de5fbe',
              //   '5faaf29809924644bc928c31',
              //   '5fb05826d8d8cf26ca1917db',
              //   '5fb05826d8d8cf26ca1917fb',
              //   '5fb05de59966e02a4444fd98',
              //   '5faac9a794c20d2de0de530a',
              //   '5faac9a794c20d2de0de7059',
              //   '5faac9a794c20d2de0de5e6b',
              //   '5faaf29809924644bc927701',
              //   '5faac9a794c20d2de0de6d6e',
              //   '5faac9a794c20d2de0de5da2',
              //   '5faaf29809924644bc927f7f',
              //   '5faaf29809924644bc9286d9',
              //   '5faaf29809924644bc928811',
              //   '5faaf29909924644bc92956d',
              //   '5faac9a894c20d2de0de72e1',
              //   '5fb05826d8d8cf26ca190ebc',
              //   '5fb05de59966e02a4444fef9',
              //   '5faac9a794c20d2de0de55ae',
              //   '5fb05de59966e02a4445009c',
              //   '5fb05de59966e02a44450119',
              //   '5faaf29809924644bc927b2b',
              //   '5faac9a794c20d2de0de54b5',
              //   '5faac9a794c20d2de0de6ff1',
              //   '5faaf29809924644bc928a2b',
              //   '5faaf29809924644bc9285b3',
              //   '5faaf29809924644bc928247',
              //   '5fb05826d8d8cf26ca191390',
              //   '5faac9a794c20d2de0de63e8',
              //   '5faac9a794c20d2de0de609b',
              //   '5faaf29909924644bc92972c',
              //   '5fb05de59966e02a4444ffaa',
              //   '5fb05de59966e02a44450932',
              //   '5faac9a794c20d2de0de5b2d',
              //   '5faac9a794c20d2de0de6551',
              //   '5faac9a794c20d2de0de5fd7',
              //   '5faaf29909924644bc9296cc',
              //   '5fb05826d8d8cf26ca1910e9',
              //   '5fb05826d8d8cf26ca191a4e',
              //   '5faaf29809924644bc9281d3',
              //   '5faaf29909924644bc9296aa',
              //   '5fb05de59966e02a44450695',
              //   '5faaf29809924644bc9286e2',
              //   '5faac9a794c20d2de0de620d',
              //   '5faac9a794c20d2de0de59dd',
              //   '5faaf29809924644bc927cf7',
              //   '5faaf29909924644bc9292fe',
              //   '5faac9a794c20d2de0de595b',
              //   '5faaf29809924644bc9279a8',
              //   '5fb05826d8d8cf26ca191454',
              //   '5faaf29909924644bc929153',
              //   '5faaf29909924644bc9291ac',
              //   '5fb05826d8d8cf26ca191157',
              //   '5faaf29809924644bc927807',
              //   '5fb05de59966e02a444504f5',
              //   '5fb05de59966e02a4444fc88',
              //   '5faac9a794c20d2de0de6fc3',
              //   '5fb05de59966e02a444503c1',
              //   '5faaf29809924644bc928324',
              //   '5fb05de59966e02a44450613',
              //   '5faaf29809924644bc928a58',
              //   '5faac9a794c20d2de0de6407',
              //   '5fb05de59966e02a44450471',
              //   '5fb05826d8d8cf26ca191609',
              //   '5fb05de59966e02a4444fc6b',
              //   '5faaf29809924644bc928989',
              //   '5faaf29809924644bc9286b5',
              //   '5faaf29809924644bc928e91',
              //   '5faaf29909924644bc9296bf',
              //   '5faaf29909924644bc929847',
              //   '5fb05de59966e02a44450139',
              //   '5fb05826d8d8cf26ca191b19'
              // ];
              // // for loop
              // for (let i = 0; i < data[0].ids.length; i++) {
              //   if (!active.includes(data[0].ids[i])) {
              //     data[0].marker.color[i] = 'lightslategray';
              //     data[0].marker.opacity[i] = 0.5;
              //     data[0].marker.size[i] = 3;
              //   }
              // }
              // Plotly.newPlot('plotly', data, layout, config);
            }
          })
        })
      })
    },
    addSelectionToFilter(eventData) {
      const type = eventData.range ? 'box' : 'polygon'
      const array = []
      if (type === 'box') {
        const corner1X = eventData.range.mapbox[0][0]
        const corner1Y = eventData.range.mapbox[0][1]
        const corner2X = eventData.range.mapbox[1][0]
        const corner2Y = eventData.range.mapbox[1][1]
        array.push([corner1X, corner1Y])
        array.push([corner2X, corner1Y])
        array.push([corner2X, corner2Y])
        array.push([corner1X, corner2Y])
        this.outline.lon = [corner1X, corner2X, corner2X, corner1X, corner1X]
        this.outline.lat = [corner1Y, corner1Y, corner2Y, corner2Y, corner1Y]
        this.setFilterOutline()

      } else {
        this.outline = {lat:[], lon:[]}
        let firstPoint = eventData.lassoPoints.mapbox[0]
        eventData.lassoPoints.mapbox.forEach((point) => {
          array.push(point)
          this.outline.lon.push(point[0])
          this.outline.lat.push(point[1])
        })
        this.outline.lon.push(firstPoint[0])
        this.outline.lat.push(firstPoint[1])
        this.setFilterOutline()
      }
      this.$emit('filtered', array)
    },
  },
}
</script>

<style></style>
