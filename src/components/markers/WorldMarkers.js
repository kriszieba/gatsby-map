import React, { useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { CircleMarker } from 'react-leaflet'

import colors from 'assets/stylesheets/settings/_colors.scss'

import { popData } from '../../data/popData'

function addDeathRatio(popData, country) {
  const populationItem = popData.filter(
    item => item.country == country.Country_Region
  )

  if (populationItem[0]) {
    const population = populationItem[0].population
    const deathsPer100k = country.Deaths
      ? (country.Deaths / population) * 100000
      : null

    country['deathsPer100k'] = deathsPer100k.toFixed(0)
  }
}

const WorldMarkers = ({ onClick }) => {
  const [active, setActive] = useState(false)

  const data = useStaticQuery(graphql`
    query {
      allWorldCsv {
        edges {
          node {
            id
            Confirmed
            Deaths
            Recovered
            Country_Region
            Province_State
            Lat
            Long_
            Admin2
          }
        }
      }
    }
  `)

  const edges = data.allWorldCsv.edges
  let maxConfirmed = 0
  let maxDeathRate = 0

  for (let edge in edges) {
    let conf = edges[edge].node.Confirmed

    if (conf > maxConfirmed) {
      maxConfirmed = conf
    }

    let dr = edges[edge].node.Deaths / (conf + Number.EPSILON)
    if (dr > maxDeathRate) {
      maxDeathRate = dr
    }
  }

  const getBubble = confirmed => {
    let color
    let number = confirmed
    let radius

    if (confirmed > 0) {
      color = colors.world
    }

    //console.log(Math.sqrt((1000*number/maxConfirmed)/Math.PI))
    radius = 3 + 17 * Math.sqrt(number / 10000 / Math.PI)

    return { color, radius }
  }

  return edges.map(edge => {
    const country = edge.node

    if (country.Confirmed > 0) {
      const { color, radius } = getBubble(country.Confirmed)

      if (!country.Admin2 && !country.Province_State) {
        addDeathRatio(popData, country)
      }

      const latitude = country.Lat === 0 ? null : country.Lat.substring(0, 10)
      const longitude =
        country.Long_ === 0 ? null : country.Long_.substring(0, 10)

      return (
        <CircleMarker
          key={country.id}
          radius={radius}
          color={color}
          stroke={false}
          center={[latitude, longitude]}
          fillOpacity={active === country.id ? 0.9 : 0.6}
          onClick={() => {
            setActive(country.id)
            onClick(country)
          }}
        ></CircleMarker>
      )
    }
  })
}

export default WorldMarkers
