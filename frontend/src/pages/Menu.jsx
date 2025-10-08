import { menuSections, accolades } from '../data/menu.js';

export default function Menu() {
  return (
    <div className="page menu">
      <header className="page-header">
        <h1>Seasonal Menu</h1>
        <p>Thoughtfully crafted courses highlighting the best ingredients of the season.</p>
      </header>

      <div className="menu-grid">
        {menuSections.map((section) => (
          <section key={section.id} className="menu-section">
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item.name}>
                  <div>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </div>
                  <span className="price">{item.price}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="accolades">
        <div>
          <h2>Awards</h2>
          <ul>
            {accolades.awards.map((award) => (
              <li key={award}>{award}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Critics Say</h2>
          {accolades.reviews.map((review) => (
            <blockquote key={review.author}>
              “{review.quote}”
              <footer>{review.author}</footer>
            </blockquote>
          ))}
        </div>
      </section>
    </div>
  );
}
