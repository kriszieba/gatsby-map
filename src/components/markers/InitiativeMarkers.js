import React, { useState } from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import { CircleMarker } from 'react-leaflet'

import colors from 'assets/stylesheets/settings/_colors.scss'

const InitiativeMarkers = ({ loadTotal, onClick }) => {
  const [active, setActive] = useState(false)

  const data = useStaticQuery(graphql`
    query {
      allInitiativesCsv {
        edges {
          node {
            id
            Latitud
            Longitud
          }
        }
      }
    }
  `)

  const edges = data.allInitiativesCsv.edges

  return edges.map(edge => {
    const initiative = edge.node

    if (initiative) {
      return (
        <CircleMarker
          key={initiative.id}
          radius={10}
          color={colors.initiatives}
          stroke={false}
          center={[initiative.Latitud, initiative.Longitud]}
          fillOpacity={active === initiative.id ? 0.9 : 0.7}
          onClick={() => {
            onClick(initiative)
            setActive(initiative.id)
          }}
        ></CircleMarker>
      )
    }
  })
}

export default InitiativeMarkers
