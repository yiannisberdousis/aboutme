# Διαδραστική Προσωπική Ιστοσελίδα & Portfolio | Δρ. Ιωάννης Δ. Μπερδούσης

Μια σύγχρονη, ταχύτατη και διαδραστική ιστοσελίδα/portfolio για τον **Δρ. Ιωάννη Δ. Μπερδούση**, σχεδιασμένη ειδικά για να αναδείξει το σπάνιο υβριδικό του προφίλ στην **Επιστήμη Υπολογιστών (Software Engineering & AI)** και την **Παιδαγωγική Επιστήμη / Διδακτική της Πληροφορικής**.

---

## ✨ Διαδραστικά Χαρακτηριστικά (Γιατί δεν είναι ένα βαρετό βιογραφικό)

1. **Επιλογή Οπτικής Γωνίας (Perspective / Role Switcher):**
   - 🎓 **Ακαδημαϊκή & Ερευνητική:** Εστίαση στο Μεταδιδακτορικό (AI & Inclusion), το Διδακτορικό (Άριστα), τις 33+ δημοσιεύσεις και τα ερευνητικά έργα (ASSESSMAKE21).
   - 💻 **Τεχνολογική & EdTech:** Εστίαση στη Μηχανική Λογισμικού (Nokia Networks R&D), το Physical Computing (Arduino, STEM) και την Κρυπτογραφία.
   - ⚡ **Σύνοψη (Executive TL;DR):** Γρήγορη σύνοψη για επιτροπές, αξιολογητές και HR με μια ματιά.
2. **Ζωντανό Κέντρο Δημοσιεύσεων (Research & Publications Hub):**
   - Αναζήτηση σε πραγματικό χρόνο (search bar) ανά τίτλο, λέξη-κλειδί (`gamification`, `gender`, `springer`, `tablets`, `arduino` κ.ά.).
   - Φίλτρα κατηγοριών (Όλες, Διεθνή Περιοδικά, Κεφάλαιο Springer, Συνέδρια, Ελληνικά).
   - Άμεσοι σύνδεσμοι DOI για κάθε επιστημονικό άρθρο.
   - Κουμπί άμεσης αντιγραφής **BibTeX** με toast ειδοποίηση για ακαδημαϊκή αναφορά.
3. **Διπλό Διαδραστικό Χρονολόγιο (Interactive Dual Timeline):**
   - Εναλλαγή ανάμεσα σε **Ακαδημαϊκές Σπουδές** (Postdoc, PhD, 2 MSc, 2 BSc) και **Επαγγελματική/Διδακτική Διαδρομή** (Πανεπιστήμιο Πελοποννήσου, Μητροπολιτικό Κολλέγιο, ΑΣΠΑΙΤΕ, Nokia Networks, Σχολεία).
4. **Interactive CLI / Command Center (`Ctrl+K`):**
   - Τερματικό εντολών για τους επισκέπτες (`help`, `bio`, `postdoc`, `pubs`, `skills`, `contact`, `clear`).
5. **Dark / Light Mode Toggle:**
   - Αυτόματη ανίχνευση προτιμήσεων συστήματος και δυνατότητα χειροκίνητης εναλλαγής.
6. **Έτοιμο για Εκτύπωση & PDF (`Print-to-PDF`):**
   - Ειδικό `@media print` CSS: Με το πάτημα του κουμπιού «Εκτύπωση PDF», αφαιρούνται τα μενού και τα εφέ και παράγεται ένα πεντακάθαρο, επίσημο ακαδημαϊκό έγγραφο.

---

## 🚀 Πώς να το δεις άμεσα στον υπολογιστή σου

Μπορείς απλά να ανοίξεις το αρχείο `index.html` σε οποιονδήποτε browser (Chrome, Edge, Firefox, Safari) κάνοντας διπλό κλικ πάνω του!

---

## 🌐 Οδηγίες για ανέβασμα στο GitHub & GitHub Pages (100% Δωρεάν)

### Βήμα 1: Δημιουργία Αποθετηρίου στο GitHub
1. Συνδέσου στο [GitHub](https://github.com).
2. Πάτησε **New Repository** (Νέο Αποθετήριο).
3. Δώσε όνομα, π.χ.:
   - `berdousis.github.io` (αν θέλεις να ανοίγει απευθείας στη διεύθυνση `https://<το-username-σου>.github.io`), **ή**
   - `portfolio` (θα ανοίγει στο `https://<το-username-σου>.github.io/portfolio`).
4. Επίλεξε **Public** και **μην** προσθέσεις README ή .gitignore (τα έχουμε ήδη έτοιμα).
5. Πάτησε **Create repository**.

### Βήμα 2: Αποστολή (Push) του Κώδικα
Άνοιξε το PowerShell ή το Terminal στον φάκελο του project και τρέξε:

```bash
git init
git add .
git commit -m "Initial commit: Interactive academic portfolio for Dr. Ioannis Berdousis"
git branch -M main
git remote add origin https://github.com/<ΤΟ_USERNAME_ΣΟΥ>/<ΤΟ_REPO_NAME>.git
git push -u origin main
```

*(Αντικατάστησε το `<ΤΟ_USERNAME_ΣΟΥ>` και το `<ΤΟ_REPO_NAME>` με τα δικά σου στοιχεία).*

### Βήμα 3: Ενεργοποίηση του GitHub Pages
1. Στη σελίδα του αποθετηρίου σου στο GitHub, πήγαινε στα **Settings** (Ρυθμίσεις) $\rightarrow$ **Pages** (στο αριστερό μενού).
2. Στο πεδίο **Source**:
   - Είτε επίλεξε **GitHub Actions** (το αρχείο `.github/workflows/deploy.yml` που ετοιμάσαμε θα κάνει αυτόματα το build),
   - Είτε επίλεξε **Deploy from a branch** $\rightarrow$ Branch: `main` $\rightarrow$ Folder: `/ (root)` και πάτησε **Save**.
3. Σε 1-2 λεπτά, η ιστοσελίδα σου θα είναι live στο διαδίκτυο!

---

## 🛠️ Πώς προσθέτεις νέες δημοσιεύσεις ή αλλαγές στο μέλλον

Όλα τα δεδομένα βρίσκονται στο αρχείο [`data.js`](file:///C:/Users/yiannis/.gemini/antigravity/scratch/ioannis-berdousis-portfolio/data.js).
Δεν χρειάζεται να πειράξεις καθόλου το HTML ή το design:
- Ανοίγεις το `data.js`.
- Προσθέτεις ή επεξεργάζεσαι τις δημοσιεύσεις στον πίνακα `publications: [...]`.
- Αποθηκεύεις και κάνεις `git push`! Η ιστοσελίδα ανανεώνεται αυτόματα.
