import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ScrollToTop from "./ScrollToTop";

const SITE_URL = "https://www.villacocokozino.eu";

const PAGE_META: Record<string, { title: string; canonicalPath: string; indexable: boolean }> = {
  "/": {
    title: "Villa Coco Kozino",
    canonicalPath: "/",
    indexable: true,
  },
  "/about": {
    title: "About | Villa Coco Kozino",
    canonicalPath: "/about",
    indexable: true,
  },
  "/gallery": {
    title: "Gallery | Villa Coco Kozino",
    canonicalPath: "/gallery",
    indexable: true,
  },
  "/contact": {
    title: "Contact | Villa Coco Kozino",
    canonicalPath: "/contact",
    indexable: true,
  },
};

function setOrCreateMeta(name: string, content: string) {
  let meta = document.querySelector(`meta[name=\"${name}\"]`);
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", name);
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", content);
}

function setCanonical(href: string) {
  let canonical = document.querySelector("link[rel='canonical']");
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", href);
}

export default function Layout() {
  const location = useLocation();

  useEffect(() => {
    const meta = PAGE_META[location.pathname] ?? {
      title: "Page Not Found | Villa Coco Kozino",
      canonicalPath: location.pathname,
      indexable: false,
    };

    document.title = meta.title;
    setCanonical(`${SITE_URL}${meta.canonicalPath === "/" ? "/" : meta.canonicalPath}`);
    setOrCreateMeta("robots", meta.indexable ? "index,follow" : "noindex,nofollow");
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f2f2f2]">
      <ScrollToTop />
      <Header />
      <main className="flex-1 pt-20 lg:pt-[88px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}