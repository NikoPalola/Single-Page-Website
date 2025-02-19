import React from "react";
import "./App.css";

const Header = () => <header className="header"><h1>Tervetuloa Verkkosivulle</h1></header>;

const Navigation = () => (
  <nav className="nav">
    <a href="#about" className="nav-link">Tietoa</a>
    <a href="#services" className="nav-link">Jotain</a>
    <a href="#contact" className="nav-link">Yhteystiedot</a>
  </nav>
);

const Section = ({ id, title, children }) => (
  <section id={id} className={`section ${id}`}>
    <h2>{title}</h2>
    <p>{children}</p>
  </section>
);

const Footer = () => <footer className="footer"><p>&copy; 2025 Niko Palola</p></footer>;

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
    <div className="body">
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