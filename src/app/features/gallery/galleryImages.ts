const getAsset = (fileName: string) =>
  new URL(`../../../assets/images/gallery/${fileName}`, import.meta.url).href;

const imageDefinitions = [
  { key: "01-villa-coco-kozino-pool-night", alt: "Villa Coco Kozino Pool at Night", title: "Villa Coco Kozino", description: "Pool at Night" },
  { key: "02-villa-coco-kozino-drone-neighborhood-oblique", alt: "Villa Coco Kozino Drone Neighborhood View", title: "Villa Coco Kozino", description: "Drone Neighborhood View" },
  { key: "03-villa-coco-kozino-pool-day", alt: "Villa Coco Kozino Pool During Day", title: "Villa Coco Kozino", description: "Pool During Day" },
  { key: "04-villa-coco-kozino-drone-oblique", alt: "Villa Coco Kozino Drone Oblique View", title: "Villa Coco Kozino", description: "Drone Oblique View" },
  { key: "05-villa-coco-kozino-2-living-day", alt: "Villa Coco Kozino Apartment 2 Living Room", title: "Villa Coco Kozino", description: "Apartment 2 Living Room" },
  { key: "06-villa-coco-kozino-2-kitchen-modern", alt: "Villa Coco Kozino Apartment 2 Modern Kitchen", title: "Villa Coco Kozino", description: "Apartment 2 Modern Kitchen" },
  { key: "07-villa-coco-kozino-2-master-bedroom", alt: "Villa Coco Kozino Apartment 2 Master Bedroom", title: "Villa Coco Kozino", description: "Apartment 2 Master Bedroom" },
  { key: "08-villa-coco-kozino-2-king-bedroom-wide-day", alt: "Villa Coco Kozino Apartment 2 King Bedroom Wide", title: "Villa Coco Kozino", description: "Apartment 2 King Bedroom" },
  { key: "09-villa-coco-kozino-2-bedroom-double", alt: "Villa Coco Kozino Apartment 2 Double Bedroom", title: "Villa Coco Kozino", description: "Apartment 2 Double Bedroom" },
  { key: "10-villa-coco-kozino-2-bedroom-double-day", alt: "Villa Coco Kozino Apartment 2 Double Bedroom Day", title: "Villa Coco Kozino", description: "Apartment 2 Double Bedroom" },
  { key: "11-villa-coco-kozino-2-bathroom", alt: "Villa Coco Kozino Apartment 2 Bathroom", title: "Villa Coco Kozino", description: "Apartment 2 Bathroom" },
  { key: "12-villa-coco-kozino-2-bathroom-wide", alt: "Villa Coco Kozino Apartment 2 Bathroom Wide", title: "Villa Coco Kozino", description: "Apartment 2 Bathroom" },
  { key: "13-villa-coco-kozino-1-living-day", alt: "Villa Coco Kozino Apartment 1 Living Room", title: "Villa Coco Kozino", description: "Apartment 1 Living Room" },
  { key: "14-villa-coco-kozino-1-kitchen-modern", alt: "Villa Coco Kozino Apartment 1 Modern Kitchen", title: "Villa Coco Kozino", description: "Apartment 1 Modern Kitchen" },
  { key: "15-villa-coco-kozino-1-king-bedroom-day", alt: "Villa Coco Kozino Apartment 1 King Bedroom", title: "Villa Coco Kozino", description: "Apartment 1 King Bedroom" },
  { key: "16-villa-coco-kozino-1-king-bedroom-wide-day", alt: "Villa Coco Kozino Apartment 1 King Bedroom Wide", title: "Villa Coco Kozino", description: "Apartment 1 King Bedroom" },
  { key: "17-villa-coco-kozino-1-twin-bedroom-corner-day", alt: "Villa Coco Kozino Apartment 1 Twin Bedroom", title: "Villa Coco Kozino", description: "Apartment 1 Twin Bedroom" },
  { key: "18-villa-coco-kozino-1-bathroom-detail", alt: "Villa Coco Kozino Apartment 1 Bathroom Detail", title: "Villa Coco Kozino", description: "Apartment 1 Bathroom Detail" },
  { key: "19-villa-coco-kozino-1-bathroom-vanity-detail", alt: "Villa Coco Kozino Apartment 1 Bathroom Vanity", title: "Villa Coco Kozino", description: "Apartment 1 Bathroom Vanity" },
  { key: "20-villa-coco-kozino-1-bathroom-daylight", alt: "Villa Coco Kozino Apartment 1 Bathroom Daylight", title: "Villa Coco Kozino", description: "Apartment 1 Bathroom Daylight" },
  { key: "21-villa-coco-kozino-terrace-sunset", alt: "Villa Coco Kozino Terrace at Sunset", title: "Villa Coco Kozino", description: "Terrace at Sunset" },
  { key: "22-villa-coco-kozino-drone-sea-view", alt: "Villa Coco Kozino Drone Sea View", title: "Villa Coco Kozino", description: "Drone Sea View" },
];

export const galleryImages = imageDefinitions.map(({ key, alt, title, description }) => ({
  key,
  thumbnailSrc: getAsset(`${key}-256w.avif`),
  displaySrc: getAsset(`${key}-640w.avif`),
  fullSrc: getAsset(`${key}-1280w.avif`),
  thumbnailSrcSet: `${getAsset(`${key}-256w.avif`)} 256w, ${getAsset(`${key}-384w.avif`)} 384w, ${getAsset(`${key}-640w.avif`)} 640w`,
  displaySrcSet: `${getAsset(`${key}-640w.avif`)} 640w, ${getAsset(`${key}-960w.avif`)} 960w, ${getAsset(`${key}-1280w.avif`)} 1280w`,
  fullSrcSet: `${getAsset(`${key}-640w.avif`)} 640w, ${getAsset(`${key}-960w.avif`)} 960w, ${getAsset(`${key}-1280w.avif`)} 1280w`,
  alt,
  title,
  description,
}));
