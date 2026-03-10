import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "../..");

const galleryImageKeys = [
  "01-villa-coco-kozino-pool-night",
  "02-villa-coco-kozino-drone-neighborhood-oblique",
  "03-villa-coco-kozino-pool-day",
  "04-villa-coco-kozino-drone-oblique",
  "05-villa-coco-kozino-2-living-day",
  "06-villa-coco-kozino-2-kitchen-modern",
  "07-villa-coco-kozino-2-master-bedroom",
  "08-villa-coco-kozino-2-king-bedroom-wide-day",
  "09-villa-coco-kozino-2-bedroom-double",
  "10-villa-coco-kozino-2-bedroom-double-day",
  "11-villa-coco-kozino-2-bathroom",
  "12-villa-coco-kozino-2-bathroom-wide",
  "13-villa-coco-kozino-1-living-day",
  "14-villa-coco-kozino-1-kitchen-modern",
  "15-villa-coco-kozino-1-king-bedroom-day",
  "16-villa-coco-kozino-1-king-bedroom-wide-day",
  "17-villa-coco-kozino-1-twin-bedroom-corner-day",
  "18-villa-coco-kozino-1-bathroom-detail",
  "19-villa-coco-kozino-1-bathroom-vanity-detail",
  "20-villa-coco-kozino-1-bathroom-daylight",
  "21-villa-coco-kozino-terrace-sunset",
  "22-villa-coco-kozino-drone-sea-view",
];

const responsiveJobs = [
  {
    input: "src/assets/images/hero/villa-coco-kozino-about-interior-2500x1500.avif",
    outputs: [
      { output: "src/assets/images/hero/villa-coco-kozino-about-interior-640w.avif", width: 640, quality: 52, format: "avif" },
      { output: "src/assets/images/hero/villa-coco-kozino-about-interior-960w.avif", width: 960, quality: 52, format: "avif" },
      { output: "src/assets/images/hero/villa-coco-kozino-about-interior-1280w.avif", width: 1280, quality: 54, format: "avif" },
    ],
  },
  {
    // Generate all hero variants from the master source actually served from /public/hero.
    input: "public/hero/villa-coco-kozino-hero-day-4000x3000.avif",
    outputs: [
      { output: "public/hero/villa-coco-kozino-hero-day-640w.avif", width: 640, quality: 52, format: "avif" },
      { output: "public/hero/villa-coco-kozino-hero-day-768w.avif", width: 768, quality: 52, format: "avif" },
      { output: "public/hero/villa-coco-kozino-hero-day-960w.avif", width: 960, quality: 54, format: "avif" },
      { output: "public/hero/villa-coco-kozino-hero-day-1280w.avif", width: 1280, quality: 56, format: "avif" },
      { output: "public/hero/villa-coco-kozino-hero-day-1920w.avif", width: 1920, quality: 58, format: "avif" },
      { output: "public/hero/villa-coco-kozino-hero-day-2560w.avif", width: 2560, quality: 58, format: "avif" },
    ],
  },
  {
    input: "src/assets/images/hero/villa-coco-kozino-contact-booking-1280w.avif",
    outputs: [
      { output: "src/assets/images/hero/villa-coco-kozino-contact-booking-640w.avif", width: 640, quality: 52, format: "avif" },
      { output: "src/assets/images/hero/villa-coco-kozino-contact-booking-768w.avif", width: 768, quality: 51, format: "avif" },
      { output: "src/assets/images/hero/villa-coco-kozino-contact-booking-960w.avif", width: 960, quality: 50, format: "avif" },
    ],
  },
  {
    input: "public/logo.avif",
    outputs: [{ output: "public/logo-128.avif", width: 128, quality: 48, format: "avif" }],
  },
  {
    input: "public/logo-white.avif",
    outputs: [{ output: "public/logo-white-128.avif", width: 128, quality: 48, format: "avif" }],
  },
  {
    input: "public/logo.webp",
    outputs: [{ output: "public/logo-128.webp", width: 128, quality: 70, format: "webp" }],
  },
  {
    input: "public/logo-white.webp",
    outputs: [{ output: "public/logo-white-128.webp", width: 128, quality: 70, format: "webp" }],
  },
];

function buildSource(inputPath, width) {
  return sharp(inputPath).resize({ width, withoutEnlargement: true });
}

async function writeOutput(inputPath, outputSpec) {
  const outputPath = path.resolve(root, outputSpec.output);
  const base = buildSource(inputPath, outputSpec.width);

  if (outputSpec.format === "webp") {
    await base.webp({ quality: outputSpec.quality }).toFile(outputPath);
    return;
  }

  await base.avif({ quality: outputSpec.quality }).toFile(outputPath);
}

async function runResponsiveJobs() {
  for (const job of responsiveJobs) {
    const inputPath = path.resolve(root, job.input);
    for (const output of job.outputs) {
      await writeOutput(inputPath, output);
    }
  }
}

async function generateGalleryThumbnailVariants() {
  const galleryDir = path.resolve(root, "src/assets/images/gallery");

  await Promise.all(
    galleryImageKeys.map(async (key) => {
      const inputPath = path.join(galleryDir, `${key}-640w.avif`);
      const inputPathLarge = path.join(galleryDir, `${key}-1280w.avif`);
      const outputPathSmall = path.join(galleryDir, `${key}-256w.avif`);
      const outputPath = path.join(galleryDir, `${key}-384w.avif`);
      const outputPathMedium = path.join(galleryDir, `${key}-960w.avif`);

      await sharp(inputPath)
        .resize({ width: 256, withoutEnlargement: true })
        .avif({ quality: 48 })
        .toFile(outputPathSmall);

      await sharp(inputPath)
        .resize({ width: 384, withoutEnlargement: true })
        .avif({ quality: 46 })
        .toFile(outputPath);

      await sharp(inputPathLarge)
        .resize({ width: 960, withoutEnlargement: true })
        .avif({ quality: 52 })
        .toFile(outputPathMedium);
    }),
  );
}

async function main() {
  await runResponsiveJobs();
  await generateGalleryThumbnailVariants();
  console.log("Responsive image variants generated.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});