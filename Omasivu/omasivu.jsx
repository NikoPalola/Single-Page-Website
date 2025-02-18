import React from "react";
import "./App.css";

const Header = () => (
  <header>
    <h1>Tervetuloa Verkkosivulle</h1>
  </header>
);

const Navigation = () => (
  <nav>
    <a href="#about">Tietoa</a>
    <a href="#services">Jotain</a>
    <a href="#contact">Yhteystiedot</a>
  </nav>
);

const Section = ({ id, title, children }) => (
  <section id={id} className={id}>
    <h2>{title}</h2>
    <p>{children}</p>
  </section>
);

const Footer = () => (
  <footer>
    <p>&copy; 2025 Niko Palola</p>
  </footer>
);

const Contact = () => {
  const handleClick = () => {
    alert("Kiitos yhteydenotosta!");
  };

  return (
    <Section id="contact" title="Yhteystiedot">
      Ota yhteyttä: niko.palola@centria.fi
      <br />
      <button onClick={handleClick}>Lähetä viesti</button>
    </Section>
  );
};

const App = () => {
  return (
    <div>
      <Header />
      <Navigation />
      <Section id="about" title="Tietoa">Tämä on yksinkertainen yhden sivun verkkosivu.</Section>
      <Section id="services" title="Palvelut">Tämä on web-kehittämisen jatkokurssi</Section>
      <Contact />
      <Footer />
    </div>
  );
};

export default App;
