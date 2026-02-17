import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Store } from '../types'

// Fix Leaflet default marker icons not loading in bundlers
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Hardcoded Brisbane-Noosa suburb coordinates
const SUBURB_COORDS: Record<string, [number, number]> = {
  'north lakes': [-27.2285, 152.9876],
  'redcliffe': [-27.2289, 153.1069],
  'margate': [-27.2411, 153.1044],
  'caboolture': [-27.0847, 152.9511],
  'morayfield': [-27.1077, 152.9500],
  'burpengary': [-27.1571, 152.9583],
  'deception bay': [-27.1917, 153.0228],
  'narangba': [-27.1992, 152.9619],
  'bribie island': [-27.0789, 153.1478],
  'caloundra': [-26.7984, 153.1297],
  'golden beach': [-26.8167, 153.1333],
  'pelican waters': [-26.8333, 153.1167],
  'kawana': [-26.7167, 153.1333],
  'mooloolaba': [-26.6816, 153.1186],
  'maroochydore': [-26.6546, 153.0916],
  'alexandra headland': [-26.6700, 153.1100],
  'buderim': [-26.6846, 153.0565],
  'nambour': [-26.6273, 152.9592],
  'coolum': [-26.5305, 153.0864],
  'coolum beach': [-26.5305, 153.0864],
  'peregian': [-26.4861, 153.0917],
  'peregian beach': [-26.4861, 153.0917],
  'noosa': [-26.3942, 153.0764],
  'noosa heads': [-26.3942, 153.0764],
  'noosaville': [-26.3989, 153.0567],
  'tewantin': [-26.3917, 153.0333],
  'sunshine plaza': [-26.6546, 153.0916],
  'sippy downs': [-26.7167, 153.0500],
  'mountain creek': [-26.7000, 153.1000],
  'warana': [-26.7333, 153.1333],
  'wurtulla': [-26.7500, 153.1333],
  'currimundi': [-26.7667, 153.1333],
  'glass house mountains': [-26.8981, 152.9431],
  'beerwah': [-26.8583, 152.9583],
  'landsborough': [-26.8083, 152.9583],
  'palmwoods': [-26.6885, 152.9583],
  'maleny': [-26.7500, 152.8500],
  'montville': [-26.6833, 152.8833],
  'eumundi': [-26.4750, 152.9500],
  'yandina': [-26.5583, 152.9583],
  'bli bli': [-26.6167, 153.0333],
  'pacific paradise': [-26.6167, 153.0833],
  'mudjimba': [-26.6167, 153.1000],
  'twin waters': [-26.6333, 153.0833],
  // Brisbane suburbs
  'brisbane': [-27.4705, 153.0260],
  'chermside': [-27.3858, 153.0311],
  'aspley': [-27.3628, 153.0167],
  'strathpine': [-27.3050, 152.9894],
  'albany creek': [-27.3489, 152.9678],
  'brendale': [-27.3167, 152.9833],
  'warner': [-27.2917, 152.9500],
  'petrie': [-27.2667, 152.9750],
  'kallangur': [-27.2500, 152.9833],
  'murrumba downs': [-27.2667, 153.0000],
  'dakabin': [-27.2333, 152.9833],
  'griffin': [-27.2500, 153.0333],
  'scarborough': [-27.2000, 153.1167],
  'woody point': [-27.2333, 153.1000],
  'clontarf': [-27.2500, 153.0833],
  'kippa-ring': [-27.2333, 153.0833],
  'rothwell': [-27.2167, 153.0500],
}

interface RouteMapProps {
  stores: Store[]
  homeSuburb: string
  containerId: string
}

const TIER_HEX: Record<string, string> = {
  A: '#dc2626',
  B: '#f59e0b',
  C: '#3b82f6',
  D: '#6b7280',
}

export function RouteMap({ stores, homeSuburb, containerId }: RouteMapProps) {
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return

    // Clean up existing map
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    const map = L.map(container, {
      zoomControl: false,
      attributionControl: false,
    })
    mapRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
    }).addTo(map)

    // Resolve coordinates
    function getCoords(suburb: string): [number, number] | null {
      return SUBURB_COORDS[suburb.toLowerCase().trim()] || null
    }

    const homeCoords = getCoords(homeSuburb)
    const points: [number, number][] = []

    // Add home marker
    if (homeCoords) {
      L.marker(homeCoords, {
        icon: L.divIcon({
          className: '',
          html: `<div style="background:#16a34a;color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">H</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      })
        .addTo(map)
        .bindPopup(`Home: ${homeSuburb}`)
      points.push(homeCoords)
    }

    // Add store markers
    stores.forEach((store, i) => {
      const coords = store.lat && store.lng
        ? [store.lat, store.lng] as [number, number]
        : getCoords(store.suburb)

      if (coords) {
        const color = TIER_HEX[store.tier] || '#6b7280'
        L.marker(coords, {
          icon: L.divIcon({
            className: '',
            html: `<div style="background:${color};color:white;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:bold;border:2px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3);">${i + 1}</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          }),
        })
          .addTo(map)
          .bindPopup(`${store.name} (Tier ${store.tier})`)
        points.push(coords)
      }
    })

    // Draw route line
    if (points.length > 1) {
      L.polyline(points, {
        color: '#2563eb',
        weight: 3,
        opacity: 0.6,
        dashArray: '8, 8',
      }).addTo(map)
    }

    // Fit bounds
    if (points.length > 0) {
      const bounds = L.latLngBounds(points)
      map.fitBounds(bounds, { padding: [30, 30] })
    } else {
      // Default to Brisbane-Noosa corridor
      map.setView([-26.8, 153.0], 9)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [stores, homeSuburb, containerId])

  return null // Renders into an existing DOM container
}
