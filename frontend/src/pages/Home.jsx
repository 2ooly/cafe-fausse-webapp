import { Link } from 'react-router-dom';
import NewsletterSignup from '../components/NewsletterSignup.jsx';

const heroImage = 'home-cafe-fausse.webp';

export default function Home() {
  return (
    <div className="page home">
      <section className="hero">
        <div className="hero-text">
          <h1>Café Fausse</h1>
          <p>
            Where modern culinary artistry meets timeless hospitality. Discover an evening of elevated flavors curated by Chef
            Antonio Rossi.
          </p>
          <Link className="cta-button" to="/reservations">
            Reserve a Table
          </Link>
        </div>
        <div className="hero-image">
          <img src={heroImage} alt="Dining table set at Café Fausse" />
        </div>
      </section>

      <section className="info-panels">
        <article>
          <h2>Hours</h2>
          <p>Monday–Saturday: 5:00 PM – 11:00 PM<br />Sunday: 5:00 PM – 9:00 PM</p>
        </article>
        <article>
          <h2>Visit</h2>
          <p>1234 Culinary Ave, Suite 100<br />Washington, DC 20002</p>
        </article>
        <article>
          <h2>Contact</h2>
          <p>(202) 555-4567<br />reservations@cafefausse.com</p>
        </article>
      </section>

      <section className="experience">
        <h2>A Modern Classic</h2>
        <p>
          Since 2010, Café Fausse has blended traditional Italian flavors with inventive, seasonal ingredients. Our tasting menus and
          curated wine pairings are inspired by the craftsmanship of Chef Antonio Rossi and restaurateur Maria Lopez.
        </p>
      </section>

      <NewsletterSignup />
    </div>
  );
}
