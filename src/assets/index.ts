const assetUrl = (relativePath: string) => new URL(relativePath, import.meta.url).href;

const imgHero640 = "/hero/villa-coco-kozino-hero-day-640w.avif";
const imgHero768 = "/hero/villa-coco-kozino-hero-day-768w.avif";
const imgHero960 = "/hero/villa-coco-kozino-hero-day-960w.avif";
const imgHero1280 = "/hero/villa-coco-kozino-hero-day-1280w.avif";
const imgHero1920 = "/hero/villa-coco-kozino-hero-day-1920w.avif";
const imgHero2560 = "/hero/villa-coco-kozino-hero-day-2560w.avif";

const imgAbout640 = assetUrl("./images/hero/villa-coco-kozino-about-interior-640w.avif");
const imgAbout960 = assetUrl("./images/hero/villa-coco-kozino-about-interior-960w.avif");
const imgAbout1280 = assetUrl("./images/hero/villa-coco-kozino-about-interior-1280w.avif");

const imgContact640 = assetUrl("./images/hero/villa-coco-kozino-contact-booking-640w.avif");
const imgContact768 = assetUrl("./images/hero/villa-coco-kozino-contact-booking-768w.avif");
const imgContact960 = assetUrl("./images/hero/villa-coco-kozino-contact-booking-960w.avif");
const imgContact1280 = assetUrl("./images/hero/villa-coco-kozino-contact-booking-1280w.avif");
const imgContact1920 = assetUrl("./images/hero/villa-coco-kozino-contact-booking-1920w.avif");
const imgContact2560 = assetUrl("./images/hero/villa-coco-kozino-contact-booking-2560w.avif");

const imgHeroSrcSet = `${imgHero640} 640w, ${imgHero768} 768w, ${imgHero960} 960w, ${imgHero1280} 1280w, ${imgHero1920} 1920w, ${imgHero2560} 2560w`;
const imgAboutSrcSet = `${imgAbout640} 640w, ${imgAbout960} 960w, ${imgAbout1280} 1280w`;
const imgContactSrcSet = `${imgContact640} 640w, ${imgContact768} 768w, ${imgContact960} 960w, ${imgContact1280} 1280w, ${imgContact1920} 1920w, ${imgContact2560} 2560w`;

const imgHeroResponsive = imgHero640;
const imgAboutResponsive = imgAbout640;
const imgContactResponsive = imgContact640;

// Export hero images
export {
	imgHeroResponsive as imgHero,
	imgHeroSrcSet,
	imgAboutResponsive as imgAbout,
	imgAboutSrcSet,
	imgContactResponsive as imgContact,
	imgContactSrcSet,
};
