# TODO-WEBSITE PROJEKT DOKUMENTATION
=====================================

## PROJEKTÜBERSICHT
- **Name:** ToDo-Website
- **Live-URL:** https://dupl0s.github.io/ToDo-Website/
- **Backend-URL:** https://todobackend-35fl5cgkl-janniks-projects-e7141841.vercel.app

## TECHNOLOGIE-STACK

### FRONTEND (Angular 19.2.10)
- **Framework:** Angular 19.2.10 (Standalone Components)
- **Sprache:** TypeScript
- **Styling:** CSS + Bootstrap 5.3.6
- **HTTP:** Angular HttpClient
- **Kalender:** FullCalendar 6.1.17
- **State Management:** Angular Signals
- **Routing:** Angular Router mit Guards
- **Build-Tool:** Angular CLI

### BACKEND (Node.js + Express)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Sprache:** TypeScript
- **Datenbank:** PostgreSQL (Neon/Vercel)
- **ORM:** Drizzle ORM 0.44.2
- **Validation:** Zod 3.25.67
- **Testing:** Vitest
- **Deployment:** Vercel (Serverless)

## PROJEKTSTRUKTUR

```
ToDo-Website/
├── Frontend/                    # Angular Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/      # Wiederverwendbare Komponenten
│   │   │   │   ├── calendar/    # Kalender-Komponente
│   │   │   │   ├── popup/       # Modal/Popup-Komponente
│   │   │   │   └── sort-filter-dropdown/  # Filter/Sort Dropdown
│   │   │   ├── services/        # Angular Services
│   │   │   │   ├── user.service.ts       # Benutzerverwaltung
│   │   │   │   ├── todo.service.ts       # Todo-Verwaltung
│   │   │   │   └── categories.service.ts # Kategorie-Verwaltung
│   │   │   ├── model/           # TypeScript Interfaces
│   │   │   │   ├── user.type.ts
│   │   │   │   ├── todo.type.ts
│   │   │   │   └── categories.type.ts
│   │   │   ├── validators/      # Custom Validators
│   │   │   ├── helpers/         # Guards und Hilfsfunktionen
│   │   │   └── [pages]/         # Seiten-Komponenten
│   │   │       ├── login/
│   │   │       ├── registration/
│   │   │       ├── categories/
│   │   │       ├── todos/
│   │   │       ├── dustbin/
│   │   │       ├── user-edit/
│   │   │       └── password-reset/
│   │   └── assets/              # Statische Dateien
├── Backend/                     # Node.js Backend
│   ├── api/
│   │   ├── index.ts            # Haupt-API-Datei
│   │   └── routers/            # API Router
│   ├── src/
│   │   ├── db/                 # Datenbankschema und Konfiguration
│   │   │   ├── schema.ts       # Drizzle Datenbankschema
│   │   │   └── index.ts        # DB-Verbindung
│   │   ├── models/             # Datenmodelle
│   │   └── repositories/       # Repository Pattern
│   └── tests/                  # Backend Tests
└── .github/workflows/          # CI/CD Pipelines
```

## KERN-FEATURES

### 1. BENUTZERVERWALTUNG
- **Registrierung:** Benutzer können sich mit Name, E-Mail und Passwort registrieren
- **Login:** Sichere Anmeldung mit E-Mail und Passwort
- **Passwort-Reset:** E-Mail-basierte Passwort-Wiederherstellung
- **Profil-Bearbeitung:** Benutzer können ihre Daten bearbeiten
- **Logout:** Sichere Abmeldung mit Session-Bereinigung

**Validierungen:**
- E-Mail: Gültige E-Mail-Adresse mit Domain-Validator
- Passwort: Mindestens 8 Zeichen mit Regex-Validator
- Name: Mindestens 4 Zeichen

### 2. TODO-VERWALTUNG
- **CRUD-Operationen:** Vollständige Todo-Verwaltung
- **Eigenschaften pro Todo:**
  - Titel (text)
  - Benutzer-ID (userID)
  - Bereichs-ID (bereichsID) - Kategoriezuordnung
  - Deadline (datum)
  - Wichtigkeit (1-5 Skala)
  - Niveau/Schwierigkeit (1-5 Skala)
  - Abgeschlossen (boolean)

**Filter- und Sortieroptionen:**
- Nach Benutzer
- Nach Kategorie/Bereich
- Nach Abschlussstatus
- Nach Wichtigkeit
- Nach Datum

### 3. KATEGORIEN/BEREICHE
- **Bereichsverwaltung:** Erstellen, Bearbeiten, Löschen von Todo-Kategorien
- **Navigation:** Direkte Navigation zu Todos eines Bereichs
- **Schutz:** Bereiche mit Todos können nicht gelöscht werden

### 4. PAPIERKORB (DUSTBIN)
- **Soft Delete:** Gelöschte Todos werden in den Papierkorb verschoben
- **Wiederherstellung:** Todos können aus dem Papierkorb wiederhergestellt werden
- **Permanente Löschung:** Endgültige Entfernung von Todos aus dem Papierkorb

### 5. KALENDER-ANSICHT
- **FullCalendar Integration:** Visuelle Darstellung der Todos
- **Ansichten:** Monat, Woche, Tag
- **Farbcodierung:** Grün für abgeschlossene, Rot für offene Todos
- **Deadline-Anzeige:** Todos werden an ihrem Fälligkeitsdatum angezeigt

## DATENBANK-SCHEMA

### USERS Tabelle
```sql
users (
  userId: uuid UNIQUE,
  username: text NOT NULL,
  email: text,
  password: text
)
```

### TODOS Tabelle
```sql
todos (
  id: serial PRIMARY KEY,
  userID: text,
  completed: boolean,
  deadline: text,
  niveau: integer,
  importance: integer,
  bereichsID: integer,
  title: text
)
```

### SECTIONS Tabelle
```sql
sections (
  id: serial NOT NULL,
  name: text
)
```

## API-ENDPUNKTE

### BENUTZER-ENDPUNKTE
- `GET /users` - Alle Benutzer abrufen
- `POST /users` - Neuen Benutzer erstellen
- `PUT /users/:id` - Benutzer aktualisieren
- `DELETE /users/:id` - Benutzer löschen
- `POST /users/login` - Benutzer-Login
- `POST /users/reset-password` - Passwort zurücksetzen

### TODO-ENDPUNKTE
- `GET /todos` - Todos abrufen (mit Query-Parametern für Filterung)
  - Query-Parameter: userID, bereichsID, completed, importance, niveau
- `GET /todos/:id` - Todos nach Bereichs-ID
- `POST /todos` - Neues Todo erstellen
- `PUT /todos/:id` - Todo aktualisieren
- `DELETE /todos/:id` - Todo löschen

### KATEGORIEN-ENDPUNKTE
- `GET /sections` - Alle Bereiche/Kategorien abrufen

## ROUTING UND NAVIGATION

### GESCHÜTZTE ROUTEN (mit LoggedActivate Guard)
- `/categories` - Kategorien-Übersicht
- `/todos` - Todo-Liste
- `/todos/:id` - Todos für spezifischen Bereich
- `/calendar` - Kalender-Ansicht
- `/dustbin` - Papierkorb
- `/dustbin/:id` - Papierkorb für spezifischen Bereich
- `/user-edit` - Profil bearbeiten

### ÖFFENTLICHE ROUTEN
- `/` - Startseite
- `/login` - Anmeldung
- `/registration` - Registrierung
- `/password-reset` - Passwort zurücksetzen

## STATE MANAGEMENT

### ANGULAR SIGNALS (Frontend)
- **TodoService:** Verwaltet Todo-Liste und Papierkorb mit Signals
- **UserService:** Verwaltet Benutzer-State mit BehaviorSubject
- **Local Storage:** Persistierung von Benutzer- und Todo-Daten

### DATEN-PERSISTIERUNG
- **Backend:** PostgreSQL-Datenbank via Drizzle ORM
- **Frontend:** Local Storage für Offline-Fähigkeiten
- **Synchronisation:** HTTP-Calls zwischen Frontend und Backend

## SICHERHEIT UND VALIDIERUNG

### FRONTEND-VALIDIERUNG
- **Email-Validator:** Custom Domain-Validator
- **Passwort-Validator:** Regex-basierte Stärke-Prüfung
- **Formulare:** Reactive Forms mit Angular Validators

### BACKEND-VALIDIERUNG
- **Zod-Schemas:** Typsichere Validierung aller API-Inputs
- **Error Handling:** Strukturierte Fehlerbehandlung
- **CORS:** Konfiguriert für spezifische Domains

### CONTENT SECURITY POLICY
```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self'; 
      script-src 'self' 'unsafe-inline'; 
      style-src 'self' 'unsafe-inline'; 
      img-src 'self' data:; 
      font-src 'self' data:;
      connect-src 'self' https://todobackend-35fl5cgkl-janniks-projects-e7141841.vercel.app;">
```

## CI/CD UND DEPLOYMENT

### GITHUB ACTIONS WORKFLOWS

#### Frontend (publish-frontend.yml)
- **Trigger:** Push nach main branch in Frontend/
- **Schritte:**
  1. Checkout Code
  2. Setup Node.js 22
  3. npm ci --force
  4. npm run build
  5. Deploy zu GitHub Pages

#### Backend (build-backend.yml)
- **Trigger:** Push/PR nach main branch
- **Schritte:**
  1. Lint mit ESLint
  2. TypeScript Type-Check
  3. Tests mit Vitest
  4. Build mit TypeScript Compiler
  5. Upload Build-Artefakte

### DEPLOYMENT-STRATEGIEN
- **Frontend:** GitHub Pages (Static Hosting)
- **Backend:** Vercel (Serverless Functions)
- **Datenbank:** Neon PostgreSQL (Cloud-hosted)

## TESTING

### BACKEND TESTS
- **Framework:** Vitest
- **Coverage:** Unit Tests für API-Endpunkte
- **Beispiel-Test:** `index.test.ts` mit grundlegenden Assertions

### FRONTEND TESTS
- **Framework:** Jasmine + Karma
- **Komponenten-Tests:** Spec-Dateien für alle Komponenten
- **Services-Tests:** Mocking von HTTP-Calls mit HttpClientTestingModule

## BESONDERE FEATURES

### POPUP-KOMPONENTE
- **Zweck:** Universelles Modal für Todo-Bearbeitung und Bereich-Verwaltung
- **Modi:** 'edit', 'reminder', 'bereich-edit'
- **Features:** Dynamische Inhalte, Event-Emitter für Parent-Communication

### SORT-FILTER-DROPDOWN
- **Funktionen:** 
  - Sortierung nach verschiedenen Kriterien
  - Datumsbereich-Filter
  - Dynamische Filter-Anwendung
- **UI:** Bootstrap-integrierte Dropdown-Menüs

### LOCAL STORAGE INTEGRATION
- **Offline-Fähigkeiten:** Todos und Benutzerdaten werden lokal gespeichert
- **Synchronisation:** Automatische Sync bei verfügbarer Internetverbindung
- **Fallback:** Funktioniert auch ohne Backend-Verbindung

## DEVELOPMENT WORKFLOW

### SETUP
```bash
# Projekt klonen und dependencies installieren
npm install

# Development starten (beide Server)
npm run dev

# Einzeln starten:
# Frontend: npm run start --prefix Frontend
# Backend: npm run dev --prefix Backend
```

### BUILD
```bash
# Alles bauen
npm run build

# Einzeln bauen:
# Frontend: npm run build --prefix Frontend  
# Backend: npm run build --prefix Backend
```

### TESTING
```bash
# Backend Tests
npm run test --prefix Backend

# Frontend Tests  
npm run test --prefix Frontend
```

## ARCHITEKTUR-PRINZIPIEN

### FRONTEND
- **Standalone Components:** Moderne Angular-Architektur ohne NgModules
- **Reactive Programming:** RxJS für asynchrone Operationen
- **Service-Pattern:** Zentrale Services für Geschäftslogik
- **Component Communication:** Input/Output + Services
- **Guards:** Route-Protection mit canActivate

### BACKEND
- **REST-API:** Klare HTTP-Verben und Statuscodes
- **Repository Pattern:** Abstraktion der Datenzugriffe
- **Middleware:** Express-Middleware für CORS, JSON-Parsing
- **Error Handling:** Zentrale Fehlerbehandlung
- **Serverless:** Optimiert für Vercel Functions

## ZUKUNFTIGE ERWEITERUNGEN

### GEPLANTE FEATURES
- **Real-time Updates:** WebSocket-Integration
- **Push-Notifications:** Deadline-Erinnerungen
- **Kollaboration:** Geteilte Todo-Listen
- **Export/Import:** CSV/JSON-Export von Todos
- **Dark Mode:** Theme-Switcher
- **Mobile App:** Progressive Web App (PWA)

### TECHNISCHE VERBESSERUNGEN
- **Caching:** Redis für Backend-Caching
- **Database Migrations:** Automatisierte Schema-Updates
- **Logging:** Strukturiertes Logging mit Winston
- **Monitoring:** Application Performance Monitoring
- **Rate Limiting:** API-Schutz vor Missbrauch

## BEKANNTE PROBLEME/LIMITIERUNGEN

1. **Local Storage Limitation:** Begrenzte Speicherkapazität
2. **Error Boundaries:** Fehlende globale Fehlerbehandlung im Frontend
3. **Optimistic Updates:** Keine optimistische UI-Updates bei API-Calls
4. **Image Uploads:** Keine Datei-Upload-Funktionalität
5. **Responsive Design:** Eingeschränkte Mobile-Optimierung

## PERFORMANCE-OPTIMIERUNGEN

### FRONTEND
- **Lazy Loading:** Route-basiertes Code-Splitting
- **OnPush Strategy:** Change Detection Optimierung
- **Signals:** Moderne Reactive State Management
- **Build Optimization:** Angular CLI Optimierungen

### BACKEND
- **Database Indexing:** Optimierte Query-Performance
- **Compression:** Gzip-Komprimierung für Responses
- **Caching Headers:** Browser-Caching für statische Assets
- **Serverless Optimierung:** Cold-Start Minimierung

## WARTUNG UND UPDATES

### DEPENDENCY MANAGEMENT
- **Regelmäßige Updates:** Monatliche Dependency-Updates
- **Security Patches:** Automatische Sicherheitsupdates
- **Breaking Changes:** Versionierung und Migration-Guides

### MONITORING
- **Error Tracking:** Fehler-Logging und -Tracking
- **Performance Monitoring:** Response-Zeit-Überwachung
- **Usage Analytics:** Benutzer-Verhalten-Analyse

=====================================
Dokumentation erstellt am: $(date)
Projekt-Version: 1.0.50 (Backend), 0.0.0 (Frontend)
=====================================
