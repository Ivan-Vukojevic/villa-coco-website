import PageTransition from "../components/PageTransition";
import ContactForm from "../features/contact/ContactForm";

export default function Contact() {
  return (
    <PageTransition>
      <ContactForm prioritizeImage />
    </PageTransition>
  );
}
