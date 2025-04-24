# Vaihe 4 – Projekti esitys

## Auton osto ja myynti

## Projektin yleiskatsaus

Projektin tarkoitus oli tehdä helpot käyttäjäkohtaiset auton osto ja myynti sivusto.

Se on käyttäjille jotka haluavat ostaa tai myydä auton.

## Käyttötapaus summaus

| Käyttötapaus | Toteutuiko (kyllä/ei) | demonstrointi / huomiot |
|----------|----------------------|------------------------|
| Ostaja selaa valitsemansa automallien hintoja ja tietoja. | Kyllä ja ei | Ostaja voi selata myynnissä olevien autojen tietoja, mutta suodatus toimintoa ei ole tehty, jotta voisi hakea tiettyä automallia |
| Ostaja etsii myynnissä olevia autoja hakukriteerien perusteella | ei | Tähän en ehtinyt perehtyä, mutta hyvä jatkokehitysidea |
| Myyjä listaa uuden auton myyntiin lisäämällä kuvia ja tietoja | kyllä ja ei | Myyjä voi laittaa autoja myyntiin perustiedoin mutta kuvien lisääminen ei onnistu. |
| Ostaja voi tallentaa haluamansa automallinsa suosikkeihin. | ei | Tätä ominaisuutta en pitänyt tärkeänä tässä vaiheessa. |

## Tekninen totetus

Frontend (Käyttöliittymä):

React – komponenttipohjainen SPA (Single Page Application)

Axios – HTTP-pyyntöjen tekemiseen backendille

localStorage – kirjautumistiedon säilyttämiseen selaimessa

React Hooks (useState, useEffect) – tilan ja sivuvaikutusten hallintaan

Backend (Palvelin):

Node.js + Express – kevyt ja nopea HTTP-palvelin

JWT (jsonwebtoken) – käyttäjän tunnistautuminen ja pääsynhallinta

bcryptjs – salasanojen hajauttamiseen (hashaus)

Sequelize ORM – tietokantaoperaatioiden hoitamiseen

CORS & Express Middleware – rajapintojen suojaus ja pyyntöjen käsittely

Tietokanta:

SQLite – kevyt ja tiedostopohjainen relaatiotietokanta

## Kehitys prosessi

### Vaihe 1: Suunnittelu ja perusympäristön rakentaminen

Päätin käyttää Node.js + Express backendissä, koska siitä on tullut kohtalaisen tuttu tässä kurssissa.

Frontend toteutettiin Reactilla, josta myös on kokemusta tullut kurssin myötä.

Tietokantana valitsin SQLite:n, koska se on kevyt ja helposti otettavissa käyttöön paikallisessa kehitysympäristössä. Ja lisäksi sitäkin tullut käytettyä.

### Vaihe 2: CRUD-toiminnot autoille

Tein toiminnallisuudet autojen luomiseen, muokkaamiseen ja poistamiseen.

Tein erilliset reitit, jotka palauttavat joko kaikki autot tai vain kirjautuneen käyttäjän omat autot.

Kaikki toiminnot suojattiin niin, että käyttäjä voi hallita vain omia ilmoituksiaan.

### Vaihe 3: Frontendin rakentaminen

Kehitin lomakekomponentit kirjautumiseen, rekisteröintiin, tietojen päivittämiseen ja ilmoituksen lisäämiseen.

Toteutin tilanhallinnan useState- ja useEffect-hookeilla.

Käytin axios-kirjastoa yhteyksiin backendin kanssa.

### Vaihe 4: Autentikointi ja käyttäjähallinta

Toteutin käyttäjän rekisteröinnin ja kirjautumisen JWT-tokenin avulla.

Salasanat suojattiin bcrypt-kirjastolla hashauksen avulla.

Tein JWT-tarkistuksen middlewarella, jolla varmistetaan, että vain kirjautunut käyttäjä voi suorittaa tiettyjä toimintoja (kuten auton lisääminen tai muokkaaminen).

Tässä vaiheessa käytin tekoälyä, jotta sain toimimaan käyttäjä tunnistautumisen.

### Vaihe 5: Testaus ja hienosäätö

Testasin eri käyttötapauksia: kirjautuminen, virheelliset salasanat, tokenin vanheneminen jne.

Tarkistin, että käyttöliittymä reagoi oikein eri tilanteisiin.

Paransin virheilmoituksia ja lisäsin tarkistuksia.

### Vaihe 6: Dokumentointi ja viimeistely

Koodien tarkistaminen sekä tarkistaa että koodin pääosat on kommentoitu.

Työtuntien kirjanpito, minkä verrarn mennyt aikaa mihinkin työhön.

Projektin valmistelu esitystä varten

## Pohdinta ja tulevaisuuden parannukset

Projektissa toimii hyvin perus asiat jotka mahdollistavat sivun idean. 

Käyttätilin teko, kirjautuminen, auton myyntiin laittaminen, auton tietojen muokkaus ja poistaminen sekä käyttäjätili tietojen muokkaus tai poistaminen. 

Tulevaisuudessa olisi hyvä, että autoja voisi suodattaa mallikohtaisesti ja auton myynti-ilmoituksiin kuvien lisäämisen mahdollisuus.

## Tuntikirjanpito

| Päivämäärä  | Tunteja käytetty | Aihe | Tehdyt työt |  
| :---  |     :---:      |     :---:      |     :---:      |
| 2.4.2025 | 2 |  Sovelluksen aloitus |  backendin,frontendin ja tietokannan perustamista |
| 4.4.2025 | 3 |  Sovelluksen jatkaminen |  backendin,frontendin ja tyylien teko. Sekä yritys saada pilviympäristö käyttöön, mutta huonolla menestyksellä. |
| 4.4.2025 | 3 |  Sovelluksen jatkaminen |  Sovelluksen kehitys, käyttöliittymä, tietokannan kehitys ja ominaisuuksien lisääminen ja parantelu. |
| 7.4.2025 | 2 |  Sovelluksen jatkaminen |  Sovelluksen toiminnallisuuksien ja kirjautumisen tekoa. |
| 8.4.2025 | 2 |  Sovelluksen jatkaminen |  Sovelluksen käyttäjä ongelmien korjaamista. |
| 7.4.2025 | 2 |  Sovelluksen jatkaminen |  Sovelluksen toiminnallisuuksien ja kirjautumisen tekoa ja testaamista. |
| 8.4.2025 | 2 |  Sovelluksen jatkaminen |  Sovelluksen käyttäjä ongelmien korjaamista ja testaamista. |
| 9.4.2025 | 3 |  Sovelluksen jatkaminen |  Sovelluksen ongelmien korjaus ja testaamista. |
| 9.4.2025 | 3 |  Sovelluksen jatkaminen |  Sovelluksen ongelmien korjaus ja testaamista. |
| 12.4.2025 | 1 |  Testaaminen ja dokumentointia |  Toiminnallisuuksien testaaminen ja dokumentin täyttäminen. |
| 22.4.2025 | 1 |  Esityksen tekeminen |  Esityksen teko |
| 24.4.2025 | 1 |  Esityksen tekeminen |  Tallenteen teko ja loppuraportin viimeistely |

## Esityksen linkki

https://centriafi-my.sharepoint.com/:v:/r/personal/niko_palola_centria_fi/Documents/Tallenteet/Tapaaminen%20j%C3%A4rjest%C3%A4j%C3%A4n%20Niko%20Palola%20ATIS23Y%20kanssa-20250424_204925-Kokouksen%20tallenne.mp4?csf=1&web=1&e=mTacef&nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJTdHJlYW1XZWJBcHAiLCJyZWZlcnJhbFZpZXciOiJTaGFyZURpYWxvZy1MaW5rIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXcifX0%3D
