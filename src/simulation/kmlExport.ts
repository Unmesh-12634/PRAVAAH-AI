import { SimulationPayload, InfrastructureItem } from './types';
import { generateCircleCoordinates } from './geographicUtils';

/**
 * Generates an OGC KML 2.2 XML string compatible with Google Earth Web and Google Earth Pro
 */
export function exportSimulationToKml(
  payload: SimulationPayload,
  infrastructure: InfrastructureItem[]
): string {
  const { cyclone, forecast } = payload;

  const forecastCoordinatesStr = [
    `${cyclone.lon},${cyclone.lat},1000`,
    ...forecast.map((f) => `${f.lon},${f.lat},1000`),
  ].join(' ');

  // Generate wind radius circle for current position
  const galeCircle = generateCircleCoordinates(cyclone.lat, cyclone.lon, 120);
  const galeRingStr = galeCircle.map(([lon, lat]) => `${lon},${lat},200`).join(' ');

  return `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>VAYU-SHIELD - ${cyclone.name}</name>
    <description>3D Cyclone Simulation Track and Critical Infrastructure Impact Model</description>

    <!-- Styles -->
    <Style id="cycloneEyeStyle">
      <IconStyle>
        <scale>1.4</scale>
        <Icon>
          <href>http://maps.google.com/mapfiles/kml/shapes/donut.png</href>
        </Icon>
      </IconStyle>
      <LabelStyle>
        <color>ff2d55ff</color>
        <scale>1.1</scale>
      </LabelStyle>
    </Style>

    <Style id="forecastTrackStyle">
      <LineStyle>
        <color>ffff0000</color>
        <width>5</width>
      </LineStyle>
    </Style>

    <Style id="galeRingStyle">
      <LineStyle>
        <color>ff00f0ff</color>
        <width>2</width>
      </LineStyle>
      <PolyStyle>
        <color>2200f0ff</color>
      </PolyStyle>
    </Style>

    <!-- 1. Current Cyclone Eye -->
    <Placemark>
      <name>${cyclone.name} (Eye Center)</name>
      <description>Wind: ${cyclone.wind_kmph} km/h | Pressure: ${cyclone.pressure_hpa} hPa</description>
      <styleUrl>#cycloneEyeStyle</styleUrl>
      <Point>
        <coordinates>${cyclone.lon},${cyclone.lat},200</coordinates>
      </Point>
    </Placemark>

    <!-- 2. Forecast Trajectory Line -->
    <Placemark>
      <name>Forecast Trajectory Track</name>
      <styleUrl>#forecastTrackStyle</styleUrl>
      <LineString>
        <extrude>1</extrude>
        <tessellate>1</tessellate>
        <altitudeMode>relativeToGround</altitudeMode>
        <coordinates>${forecastCoordinatesStr}</coordinates>
      </LineString>
    </Placemark>

    <!-- 3. Gale Wind Radius (34kt Zone) -->
    <Placemark>
      <name>34kt Gale Wind Footprint</name>
      <styleUrl>#galeRingStyle</styleUrl>
      <Polygon>
        <outerBoundaryIs>
          <LinearRing>
            <coordinates>${galeRingStr}</coordinates>
          </LinearRing>
        </outerBoundaryIs>
      </Polygon>
    </Placemark>

    <!-- 4. Critical Infrastructure Points -->
    <Folder>
      <name>Critical Infrastructure</name>
      ${infrastructure
        .map(
          (item) => `
      <Placemark>
        <name>${item.name}</name>
        <description>${item.type.toUpperCase()} - ${item.description}</description>
        <Point>
          <coordinates>${item.lon},${item.lat},${item.elevation_m}</coordinates>
        </Point>
      </Placemark>`
        )
        .join('')}
    </Folder>

  </Document>
</kml>`;
}

/**
 * Triggers a browser download of the simulation as a .kml file
 */
export function downloadKmlFile(payload: SimulationPayload, infrastructure: InfrastructureItem[]) {
  const kmlContent = exportSimulationToKml(payload, infrastructure);
  const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${payload.cyclone.name.toLowerCase().replace(/\s+/g, '_')}_google_earth.kml`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
