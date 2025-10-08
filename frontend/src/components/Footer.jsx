export default function Footer() {
  return (
    <footer className="footer">
      <div>
        <h3>Visit Us</h3>
        <p>1234 Culinary Ave, Suite 100<br />Washington, DC 20002</p>
      </div>
      <div>
        <h3>Contact</h3>
        <p>
          Phone: (202) 555-4567<br />
          Email: reservations@cafefausse.com
        </p>
      </div>
      <div>
        <h3>Hours</h3>
        <p>
          Monday–Saturday: 5:00 PM – 11:00 PM<br />
          Sunday: 5:00 PM – 9:00 PM
        </p>
      </div>
      <p className="footer-note">© {new Date().getFullYear()} Café Fausse. All rights reserved.</p>
    </footer>
  );
}
