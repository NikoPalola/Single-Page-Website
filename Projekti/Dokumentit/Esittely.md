# Vaihe 4 – Projekti esitys

## Auton osto ja myynti

## Projektin yleiskatsaus

Projektin tarkoitus oli tehdä helpot käyttäjäkohtaiset auton osto ja myynti sivusto.

Se on käyttäjille jotka haluavat ostaa tai myydä auton.

## Käyttötapaus summaus

| Käyttötapaus | Toteutuiko (kyllä/ei) | demonstrointi / huomiot |
|----------|----------------------|------------------------|
| Ostaja selaa valitsemansa automallien hintoja ja tietoja. | Kyllä | Ostaja voi selata myynnissä olevien autojen tietoja, mutta suodatus toimintoa ei ole tehty, jotta voisi hakea tiettyä automallia |
| Ostaja etsii myynnissä olevia autoja hakukriteerien perusteella | ei | Tähän en ehtinyt perehtyä, mutta hyvä jatkokehitysidea |
| Myyjä listaa uuden auton myyntiin lisäämällä kuvia ja tietoja | kyllä ja ei | Myyjä voi laittaa autoja myyntiin perustiedoin mutta kuvien lisääminen ei onnistu. |
| Ostaja voi tallentaa haluamansa automallinsa suosikkeihin. | ei | Tätä ominaisuutta en pitänyt tärkeänä tässä vaiheessa. |

_Add explanations for each use case, including demo timestamps if using video._

---

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

## 🚂 Development process

_Summarize your progress from start to finish, mentioning key decisions or changes along the way._

---

## ☀️ Reflection and future work

_What worked well? What challenges did you face? What would you add or improve in the future?_

---

## 📊 Work Hours Log

_You can copy from the logbook here._

| Date       | Time | Task                                |
|------------|------|-------------------------------------|
| 2.4.2025   | 3h   | Defined use cases                   |
| 4.4.2025   | 2h   | Built login form                    |
| ...        | ...  | ...                                 |
| **Total**  | **63h** |                                 |

---

## 🪢 Presentation link

_Add a link to your video presentation or state that it was presented live._
