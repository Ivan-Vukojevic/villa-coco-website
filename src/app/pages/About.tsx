import PageTransition from "../components/PageTransition";
import AboutContent from "../features/about/AboutContent";

export default function About() {
  return (
    <PageTransition>
      <AboutContent prioritizeImage />
    </PageTransition>
  );
}
