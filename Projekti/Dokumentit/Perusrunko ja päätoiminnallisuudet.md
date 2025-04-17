# Projekti vaihe 2 - Perusrakenne ja päätoiminnot
Tässä dokumentissä on sovelluksen perurakenne ja päätoiminnot.
## 1. Ympäristö
Ympäristö on toteutettu paikallisesti.

Palvelin käynnistyy osoitteessa: http://localhost:3000 ja vite http://localhost:5173

Frontend ja backend toimivat omissa kansioissaan.

Tietokantana käytetään tiedostopohjaista SQLite-tietokantaa (Tietokanta.db).

## 2. Taustajärjestelmä

Teknologia: Node.js + Express

Salasanaturva: Salasanat hashataan bcryptjs-kirjastolla ennen tietokantaan tallennusta.

Tunnistus: Käyttäjän tunnistus toteutetaan jsonwebtoken-kirjaston (JWT) avulla. Tokenit vanhenevat 1 tunnin kuluttua.

Reitit: Sovellus tarjoaa REST API:n mm. kirjautumiseen, käyttäjien ja autojen hallintaan.


## 3. Käyttöliittymä

![image](https://github.com/user-attachments/assets/42ce4ca6-d343-453f-8d78-bf03956dce5a)
Käyttöliittymä on toteutettu Reactilla.

Tätä ei ole vielä aivan loppuun asti viimeistelty, mutta perusrakenne on valmiina. 

## 4. Tietokanta

Tietokantana on SQLite, ORM:na käytössä Sequelize.

Tallennettavat tiedot: Käyttäjät: id, name, email, username, password ja Autot: id, brand, model, year, kilometers, price, description, sellerId

Käyttäjällä voi olla useita autoja (1:N suhde). Auto liittyy yhteen käyttäjään (myyjä)

Esimerkkejä kyselyistä:

User.findByPk()

Car.findAll({ where: { sellerId } })

## 5. Perusrunko ja arkkitehtuuri

frontend: React

Tilanhallinta: useState, useEffect, localStorage

API-kutsut tehdään axios-kirjastolla

Lomakkeet: kirjautuminen, rekisteröityminen, auton lisäys ja muokkaus

Backend: Express (Node.js)

REST API käyttäjille ja autoille

JWT-tunnistus middlewarella

ORM: Sequelize SQLite-tietokanta

Komponenttiesimerkkejä:

Login.jsx: Kirjautumistoiminnallisuus

UpdateCar.jsx: Auton tietojen muokkaus

## 6. Toiminnot

Myynnissä olevien autojen selaaminen (ei vaadi kirjautumista).

Käyttäjän luominen rekisteröintilomakkeella.

Kirjautuminen ja JWT-tokenin saanti.

Käyttäjän muokkaus ja poisto (vain oma tili).

Auton lisääminen, muokkaaminen ja poistaminen (vain omat autot).

Kaikkien autojen listaus, jossa näkyy myyjän käyttäjänimi.

## 7. Koodin laatu ja dokumentaatio

Sovelluksen koodi on jaettu loogisiin osiin.

Frontend: komponentit ja näkymät.

Backend: reitit, mallit ja middleware.

Koodi on luettavaa ja kommentoitu keskeisiltä osilta.

Dokumentaatio kattaa projektin rakenteen ja toiminnot (tämä dokumentti)

Tämä dokumentti kattaa projektin rakenteen ja toiminnot.

## 8. Testaaminen

Sovellusta on testattu manuaalisesti selaimessa.

Käyttäjän luonti, kirjautuminen ja tokenin toiminta

Auton lisääminen, muokkaaminen ja poistaminen

Käyttöliittymä reagoi virheisiin ja palauttaa onnistumisviestit

## 9. Käyttäjä näkymä ja käytettävyys

Käyttöliittymä on selkeä ja suoraviivainen

Käyttäjä näkee myynnissä olevat autot, oman profiilin ja omat ilmoitukset.

Toiminnot ja navigaatio on selkeät, helpot ja yksinkertaiset.
