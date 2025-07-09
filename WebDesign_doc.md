Dieses Projekt ist eine moderne, responsive Todo-Webanwendung, die mit Angular für eine komponentenbasierte 
Architektur und dynamisches UI-Rendering entwickelt wurde. Das Design legt besonderen Wert auf eine klare 
Benutzeroberfläche, Barrierefreiheit sowie die Anpassungsfähigkeit an verschiedene Themes und verwendet 
leistungsoptimiertes CSS sowie moderne Frontend-Praktiken.


### Theming-System: Hell-/Dunkelmodus (CSS-basiert)          ### Matr-Nr: 2199855
Die Anwendung enthält ein leistungsfähiges Hell-/Dunkelmodus-System, das mit CSS-Variablen in style.css 
implementiert wurde. Dieses System gewährleistet eine moderne, skalierbare und performante Art der 
Theme-Umschaltung.
- **Technologie:** Reines CSS mit benutzerdefinierten Properties (--Variablen)
- **Mechanismus:** Durch das Umschalten der Klasse .dark-theme auf <body> oder dem Root-Container werden 
Theme-Variablen neu gesetzt.
- **Definierte Variablen:**
        --background-color, --text-color, --card-bg, --btn-bg, --border-color, usw.
- **Overrides:**
        Die Klasse .dark-theme überschreibt diese Variablen für den Dunkelmodus.
- **Anwendung in Komponenten:** Alle Komponenten wie home, categories, todo, and dustbin nutzen diese Variablen


### Home Page/StartSeite:                                    ### Matr. Nr: 2199855
- **Verwendete Technologien:**
    - Angular für Struktur und Routing
    - CSS Variablen für Design und Theme
    - HTML für semantische Struktur
- **Merkmale:**
    - Zeigt eine personalisierte Willkommensnachricht.
    - Minimalistisches und responsives Layout mittels Flexbox/Grid
    - Automatische Anpassung an den aktivierten Hell-/Dunkelmodus.
    - Dient als zentrale Einstiegsseite mit Navigation zu Aufgaben und Kategorien.


### Categories/Kategorien Komponente                         ### Matr. Nr: 2199855
- **Verwendete Technologien:**
    - Angular: Komponentenlogik, Datenbindung
    - Reactive Forms 
    - Bootstrap
    - HTML5, CSS
    - CSS-basiertes Karussell
-**Funktionalität:**
    - Dynamisches Laden und Anzeigen von Kategorien mit individuellen    Icons und Farben.
    - Flexibles Layout, das sich automatisch an Bildschirmgrößen anpasst.
-**Karussell-Design:**
    - Native horizontale Scroll-Komponente mit CSS Scroll Snap.
    - Kein externes Karussell-Plugin notwendig.


### Todo Komponente                                         ### Matr. Nr: 2352061
-**Verwendete Technologien:**
    - Angular
    - Reactive Forms (FormsBuilder)
    - HTML, CSS
    - ANgular Material Icons
-**Merkmale:**
    - Anzeige von Aufgaben innerhalb der jeweiligen Kategorie.
    - Aufgabenstatus (erledigt/offen) visuell markiert.
    - Editier-, Lösch- und Statusfunktionen über Icons.

### Sortier- und Filter Komponenten
-**Verwendete Technologien:**
    - Angular
    - Bootstrap: Dropdowns & Buttons
    - CSS
-**Merkmale:**
    - Runde Schaltflächen mit Hover-Effekten.
    - Tags mit individuell gestalteten „Close“-Buttons.
    - Flexibles Layout (display: flex, gap).
    - Adaptive Styles basierend auf dem Farbmodus (durch CSS-Variablen).

### Kalender Komponente                                     ### Matr. Nr: 2352061
-**Technologie:**
    - Angular
    - FullCalendar (Integration via @fullcalendar/core)
    - Plugins: dayGridPlugin, timeGridPlugin

-**Merkmale:**
    - Farbmarkierung je nach Status (erledigt: grün, offen: rot)


