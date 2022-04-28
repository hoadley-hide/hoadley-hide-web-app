import { promises as fs } from "fs";

async function loadTrackers(): Promise<TrackerManager> {
  const fileText = (await fs.readFile(`./data/HH22_mqtt_data.json`)).toString();
  const fileLinesText = fileText.split("\n");

  const traces = fileLinesText
    .filter((lineText) => !!lineText)
    .map((lineText, index) => {
      // console.log("processing line %d", index);
      return JSON.parse(lineText);
    });

  const manager = new TrackerManager();

  traces.forEach((t) => {
    let thisTracker = manager.get({ device_id: t.end_device_ids.device_id });
    if (!thisTracker) {
      thisTracker = manager.addTracker(
        new TrackerLog(t.end_device_ids.device_id)
      );
    }
    thisTracker.addTrackerLog(t);
  });

  return manager;
}

interface TraceBase {
  end_device_ids: {
    device_id: string;
    application_ids: { application_id: string };
    dev_eui: string;
    join_eui: string;
    dev_addr: string;
  };
  correlation_ids: string[];
  received_at: string;
}
interface TraceJoinAccept extends TraceBase {
  join_accept: {
    session_key_id: string;
    received_at: string;
  };
}
interface TraceUplinkMessage extends TraceBase {
  uplink_message: {};
}
interface TraceLocationSolved extends TraceBase {
  location_solved: {
    service: string;
    location: {
      latitude: number;
      longitude: number;
      source: string;
    };
  };
}
type Trace = TraceJoinAccept | TraceUplinkMessage | TraceLocationSolved;

interface Patrol {
  patrolName: string;
  patrolNumber: string;
  trackerId: string;
  colour: string;
}

const patrolToTrackerMap: Patrol[] = [
  {
    patrolNumber: "01",
    patrolName: "Toomuc Valley",
    trackerId: "81",
    colour: "#DFFF00",
  },
  {
    patrolNumber: "02",
    patrolName: "1st Inverloch/1st Morwell",
    trackerId: "83",
    colour: "#FFBF00",
  },
  {
    patrolNumber: "03",
    patrolName: "1st Torquay/1st Modewarre",
    trackerId: "72",
    colour: "#FF7F50",
  },
  {
    patrolNumber: "04",
    patrolName: "1st The Basin",
    trackerId: "77",
    colour: "#DE3163",
  },
  {
    patrolNumber: "05",
    patrolName: "Bentleigh/Dingley/Narringalling",
    trackerId: "85",
    colour: "#9FE2BF",
  },
  {
    patrolNumber: "06",
    patrolName: "Nindethana Collective 1",
    trackerId: "80",
    colour: "#40E0D0",
  },
  {
    patrolNumber: "07",
    patrolName: "Nindethana Collective 2",
    trackerId: "70",
    colour: "#6495ED",
  },
  {
    patrolNumber: "08",
    patrolName: "Nindethana Collective 3",
    trackerId: "6D",
    colour: "#CCCCFF",
  },
  {
    patrolNumber: "09",
    patrolName: "North Ringwood",
    trackerId: "8F",
    colour: "#808000",
  },
  {
    patrolNumber: "10",
    patrolName: "Bennettswood/1st Victorian Sea",
    trackerId: "86",
    colour: "#800000",
  },
  {
    patrolNumber: "11",
    patrolName: "1st Mt Clear",
    trackerId: "8E",
    colour: "#008000",
  },
  {
    patrolNumber: "12",
    patrolName: "4th Knox/49C11",
    trackerId: "7B",
    colour: "#00FFFF",
  },
  {
    patrolNumber: "13",
    patrolName: "Eureka",
    trackerId: "8A",
    colour: "#008080",
  },
  {
    patrolNumber: "14",
    patrolName: "2nd Footscray",
    trackerId: "7A",
    colour: "#000080",
  },
  {
    patrolNumber: "15",
    patrolName: "Auburn/1st Craigieburn",
    trackerId: "88",
    colour: "#0000FF",
  },
  {
    patrolNumber: "17",
    patrolName: "Wirringga",
    trackerId: "6B",
    colour: "#00FF00",
  },
  {
    patrolNumber: "19",
    patrolName: "Monash",
    trackerId: "7E",
    colour: "#808080",
  },
  {
    patrolNumber: "20",
    patrolName: "Moreland",
    trackerId: "2B",
    colour: "#FF00FF",
  },
  {
    patrolNumber: "21",
    patrolName: "1st/14th Brighton",
    trackerId: "89",
    colour: "#800080",
  },
];

class TrackerLog {
  device_id: string;
  traces: Trace[];
  patrol: Patrol | null = null;
  constructor(device_id: string) {
    this.traces = [];
    this.device_id = device_id;
  }
  addTrackerLog(trace: Trace) {
    this.traces.push(trace);
  }

  setPatrol(patrol: Patrol) {
    this.patrol = patrol;
  }
}

class TrackerManager {
  trackers: TrackerLog[] = [];

  addTracker(tracker: TrackerLog) {
    this.trackers.push(tracker);
    return tracker;
  }

  get(lookup: { device_id?: string; patrolNumber?: string }) {
    const tracker = this.trackers.find(
      (tracker) =>
        (lookup.device_id &&
          tracker.device_id.toLowerCase() === lookup.device_id.toLowerCase()) ||
        (lookup.patrolNumber &&
          tracker.patrol?.patrolNumber === lookup.patrolNumber)
    );

    return tracker;
  }
}

interface GeoJson {
  type: "Feature";
  properties: {
    stroke?: string;
    "marker-color"?: string;
    id: number;
    RogID: string;
  };
  geometry:
    | {
        type: "Point";
        /** Long, Lat */
        coordinates: [number, number];
      }
    | {
        type: "LineString";
        /** Long, Lat */
        coordinates: number[][];
      };
}

async function loadBases(): Promise<GeoJson[]> {
  const GeoJsonData = JSON.parse(
    (await fs.readFile(`./data/HH22_RadioActiv8.json`)).toString()
  );
  return GeoJsonData.features;
}

async function main() {
  const trackers = await loadTrackers();
  const bases = await loadBases();

  patrolToTrackerMap.map((patrol) => {
    let tracker = trackers.get({ device_id: `tracker-${patrol.trackerId}` });

    // if the tracker is not found, not much we can do.
    tracker?.setPatrol(patrol);
  });

  let counter = bases.length;

  writeGeoJson([
    ...bases.map((base) => {
      base.properties["marker-color"] = "#ff0000";
      return base;
    }),
    ...trackers.trackers.flatMap((tracker): GeoJson[] => {
      const data: GeoJson = {
        type: "Feature",
        properties: {
          stroke: tracker.patrol?.colour || "#0000FF",
          id: ++counter,
          RogID: `${tracker.device_id}-${tracker.patrol?.patrolNumber}`,
        },
        geometry: {
          type: "LineString",
          coordinates: tracker.traces
            .map((trace: Trace) => {
              if (!("location_solved" in trace)) {
                return null;
              }
              return [
                trace.location_solved.location.longitude,
                trace.location_solved.location.latitude,
              ];
            })
            .filter((x) => x !== null) as number[][],
        },
      };

      const features = tracker.traces.map((trace: Trace): GeoJson | null => {
        if (!("location_solved" in trace)) {
          return null;
        }

        const data: GeoJson = {
          type: "Feature",
          properties: {
            "marker-color": tracker.patrol?.colour || "#0000FF",
            id: ++counter,
            RogID: `${tracker.device_id}-${tracker.patrol?.patrolNumber}-${trace.received_at}`,
          },
          geometry: {
            type: "Point",
            coordinates: [
              trace.location_solved.location.longitude,
              trace.location_solved.location.latitude,
            ],
          },
        };

        return data;
      });

      if (data.geometry.coordinates.length === 0) {
        return features.filter((x) => x !== null) as GeoJson[];
      } else {
        return [data, ...(features.filter((x) => x !== null) as GeoJson[])];
      }
    }),
  ]);
}

async function writeGeoJson(features: GeoJson[]) {
  await fs.writeFile(
    "./data/HH22.radioactiv8.display.geo.json",
    JSON.stringify({ type: "FeatureCollection", features: features }, null, 2)
  );
}
main().catch(console.error);
