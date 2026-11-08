// app.js - Διαδραστική λειτουργικότητα για το portfolio του Δρ. Ιωάννη Μπερδούση

document.addEventListener('DOMContentLoaded', () => {
  const data = window.CV_DATA;
  if (!data) return;

  // Initialize Lucide Icons if available
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // State
  let currentRole = 'academic'; // 'academic', 'tech', 'executive'
  let currentPubCategory = 'all';
  let currentSearchQuery = '';
  let currentTimelineMode = 'academic'; // 'academic', 'experience'

  // DOM Elements
  const searchInput = document.getElementById('pub-search-input');
  const pubCategoryBtns = document.querySelectorAll('[data-pub-filter]');
  const publicationsContainer = document.getElementById('publications-list');
  const pubCountBadge = document.getElementById('pub-count-badge');
  const roleTabs = document.querySelectorAll('[data-role-tab]');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const toastEl = document.getElementById('toast');
  const terminalModal = document.getElementById('terminal-modal');
  const terminalToggleBtn = document.getElementById('terminal-toggle-btn');
  const terminalCloseBtn = document.getElementById('terminal-close-btn');
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const timelineToggleBtns = document.querySelectorAll('[data-timeline-toggle]');
  const timelineContentEl = document.getElementById('timeline-content');

  // --- Toast Notification Helper ---
  window.showToast = function(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
    toastEl.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
      toastEl.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
      toastEl.classList.remove('opacity-100', 'translate-y-0');
    }, 2500);
  };

  // --- Copy to Clipboard Helper ---
  window.copyText = function(text, label = "Αντιγράφηκε!") {
    navigator.clipboard.writeText(text).then(() => {
      showToast(`✓ ${label}`);
    }).catch(() => {
      showToast('Αποτυχία αντιγραφής');
    });
  };

  // --- Dark / Light Theme Toggle ---
  function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateThemeIcon();
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateThemeIcon();
  }

  function updateThemeIcon() {
    const icon = document.getElementById('theme-icon');
    if (!icon) return;
    const isDark = document.documentElement.classList.contains('dark');
    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    if (window.lucide) window.lucide.createIcons();
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', toggleTheme);
  }
  initTheme();

  // --- Role Switcher (Perspective Mode) ---
  function setRole(role) {
    currentRole = role;
    roleTabs.forEach(btn => {
      const active = btn.getAttribute('data-role-tab') === role;
      if (active) {
        btn.classList.add('bg-primary-600', 'text-white', 'shadow-md');
        btn.classList.remove('text-slate-600', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
      } else {
        btn.classList.remove('bg-primary-600', 'text-white', 'shadow-md');
        btn.classList.add('text-slate-600', 'dark:text-slate-300', 'hover:bg-slate-100', 'dark:hover:bg-slate-800');
      }
    });

    const sections = {
      academic: document.getElementById('perspective-academic'),
      education: document.getElementById('perspective-education'),
      executive: document.getElementById('perspective-executive')
    };

    Object.keys(sections).forEach(key => {
      if (!sections[key]) return;
      if (key === role) {
        sections[key].classList.remove('hidden');
        sections[key].classList.add('animate-fade-in');
      } else {
        sections[key].classList.add('hidden');
        sections[key].classList.remove('animate-fade-in');
      }
    });
  }

  roleTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      setRole(btn.getAttribute('data-role-tab'));
    });
  });

  // --- Render Publications Hub ---
  function getFilteredPublications() {
    const query = currentSearchQuery.toLowerCase().trim();
    return data.publications.filter(pub => {
      const matchesCategory = 
        currentPubCategory === 'all' ? true :
        currentPubCategory === 'book' ? pub.type === 'book' :
        currentPubCategory === 'intl-journal' ? pub.type === 'intl-journal' :
        currentPubCategory === 'conference' ? pub.type === 'conference' :
        currentPubCategory === 'greek' ? (pub.type === 'greek-journal' || pub.type === 'greek-conference') : true;

      const matchesSearch = !query || 
        pub.title.toLowerCase().includes(query) ||
        pub.authors.toLowerCase().includes(query) ||
        pub.source.toLowerCase().includes(query) ||
        pub.tags.some(tag => tag.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }

  function renderPublications() {
    if (!publicationsContainer) return;
    const filtered = getFilteredPublications();

    if (pubCountBadge) {
      pubCountBadge.textContent = `${filtered.length} από ${data.publications.length}`;
    }

    if (filtered.length === 0) {
      publicationsContainer.innerHTML = `
        <div class="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <i data-lucide="search-x" class="w-10 h-10 mx-auto mb-3 opacity-60"></i>
          <p class="font-medium">Δεν βρέθηκαν δημοσιεύσεις με τα συγκεκριμένα κριτήρια.</p>
          <button onclick="window.resetPubFilters()" class="mt-3 text-sm text-primary-600 dark:text-primary-400 hover:underline">Επαναφορά φίλτρων</button>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
      return;
    }

    const typeBadges = {
      'book': { label: 'Κεφάλαιο Βιβλίου (Springer)', color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800' },
      'intl-journal': { label: 'Διεθνές Περιοδικό', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800' },
      'conference': { label: 'Διεθνές Συνέδριο', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800' },
      'greek-journal': { label: 'Ελληνικό Περιοδικό', color: 'bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300 border-sky-200 dark:border-sky-800' },
      'greek-conference': { label: 'Ελληνικό Συνέδριο', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800' }
    };

    publicationsContainer.innerHTML = filtered.map(pub => {
      const typeInfo = typeBadges[pub.type] || { label: 'Δημοσίευση', color: 'bg-slate-100 text-slate-800' };
      const bibtex = generateBibtex(pub);
      const safeBibtex = encodeURIComponent(bibtex);

      return `
        <div class="group relative p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg hover:border-primary-500/50 dark:hover:border-primary-500/50 transition-all duration-300 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${typeInfo.color}">
                ${typeInfo.label}
              </span>
              <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                ${pub.year}
              </span>
            </div>

            <h4 class="text-base font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors leading-snug mb-2">
              ${pub.title}
            </h4>

            <p class="text-xs text-slate-600 dark:text-slate-400 mb-1.5 font-medium">
              <span class="text-slate-400 dark:text-slate-500">Συγγραφείς:</span> ${pub.authors}
            </p>

            <p class="text-xs text-slate-500 dark:text-slate-400 italic mb-4">
              ${pub.source}
            </p>

            <div class="flex flex-wrap gap-1.5 mb-4">
              ${pub.tags.map(t => `<span class="px-2 py-0.5 text-[11px] rounded bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-mono">#${t}</span>`).join('')}
            </div>
          </div>

          <div class="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
            ${pub.doi ? `
              <a href="${pub.doi}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 bg-primary-50 dark:bg-primary-950/40 px-2.5 py-1.5 rounded-lg border border-primary-200 dark:border-primary-900/60 transition-colors">
                <i data-lucide="external-link" class="w-3.5 h-3.5"></i>
                <span>DOI Link</span>
              </a>
            ` : `<span class="text-xs text-slate-400 italic">Peer-Reviewed</span>`}

            <button onclick="window.copyBibtex('${safeBibtex}')" class="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" title="Αντιγραφή BibTeX">
              <i data-lucide="quote" class="w-3.5 h-3.5"></i>
              <span>BibTeX</span>
            </button>
          </div>
        </div>
      `;
    }).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  function generateBibtex(pub) {
    const key = `berdousis${pub.year}${pub.id.toLowerCase()}`;
    return `@article{${key},
  title={${pub.title}},
  author={${pub.authors}},
  journal={${pub.source}},
  year={${pub.year}}${pub.doi ? `,\n  doi={${pub.doi}}` : ''}
}`;
  }

  window.copyBibtex = function(encodedBibtex) {
    const bibtex = decodeURIComponent(encodedBibtex);
    copyText(bibtex, "Το BibTeX αντιγράφηκε στο πρόχειρο!");
  };

  window.resetPubFilters = function() {
    currentPubCategory = 'all';
    currentSearchQuery = '';
    if (searchInput) searchInput.value = '';
    updateCategoryButtons();
    renderPublications();
  };

  function updateCategoryButtons() {
    pubCategoryBtns.forEach(btn => {
      const active = btn.getAttribute('data-pub-filter') === currentPubCategory;
      if (active) {
        btn.classList.add('bg-primary-600', 'text-white', 'shadow-sm');
        btn.classList.remove('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
      } else {
        btn.classList.remove('bg-primary-600', 'text-white', 'shadow-sm');
        btn.classList.add('bg-white', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderPublications();
    });
  }

  pubCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentPubCategory = btn.getAttribute('data-pub-filter');
      updateCategoryButtons();
      renderPublications();
    });
  });

  // --- Dual Timeline (Academic vs Professional) ---
  function renderTimeline() {
    if (!timelineContentEl) return;
    const items = currentTimelineMode === 'academic' ? data.education : data.workExperience;

    timelineContentEl.innerHTML = items.map((item, idx) => `
      <div class="relative pl-8 pb-8 group last:pb-0">
        <!-- Vertical connector line -->
        <div class="absolute left-3 top-3 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-800 group-last:hidden"></div>
        <!-- Dot -->
        <div class="absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full bg-primary-600 ring-4 ring-primary-100 dark:ring-primary-950/60"></div>
        
        <div class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-primary-400 dark:hover:border-primary-600 transition-colors">
          <div class="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <span class="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-primary-50 dark:bg-primary-950/60 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-900">
              ${item.period}
            </span>
            ${item.badge ? `
              <span class="text-xs px-2 py-0.5 rounded font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                ${item.badge}
              </span>
            ` : ''}
          </div>
          
          <h4 class="text-base font-bold text-slate-900 dark:text-white">
            ${item.title || item.role}
          </h4>
          
          <p class="text-xs font-medium text-slate-600 dark:text-slate-400 mt-0.5">
            ${item.institution || item.organization}
          </p>
          
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
            ${item.detail || item.desc}
          </p>
        </div>
      </div>
    `).join('');

    if (window.lucide) window.lucide.createIcons();
  }

  timelineToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currentTimelineMode = btn.getAttribute('data-timeline-toggle');
      timelineToggleBtns.forEach(b => {
        const active = b.getAttribute('data-timeline-toggle') === currentTimelineMode;
        if (active) {
          b.classList.add('bg-primary-600', 'text-white', 'shadow-sm');
          b.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
        } else {
          b.classList.remove('bg-primary-600', 'text-white', 'shadow-sm');
          b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-400');
        }
      });
      renderTimeline();
    });
  });

  // --- Interactive Terminal / Command Center ---
  function toggleTerminal(open) {
    if (!terminalModal) return;
    if (open) {
      terminalModal.classList.remove('hidden');
      terminalInput.focus();
    } else {
      terminalModal.classList.add('hidden');
    }
  }

  if (terminalToggleBtn) terminalToggleBtn.addEventListener('click', () => toggleTerminal(true));
  if (terminalCloseBtn) terminalCloseBtn.addEventListener('click', () => toggleTerminal(false));

  // Keyboard shortcut Ctrl+K / Cmd+K
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      toggleTerminal(terminalModal.classList.contains('hidden'));
    }
    if (e.key === 'Escape' && !terminalModal.classList.contains('hidden')) {
      toggleTerminal(false);
    }
  });

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const cmd = terminalInput.value.trim().toLowerCase();
        handleTerminalCommand(cmd);
        terminalInput.value = '';
      }
    });
  }

  function handleTerminalCommand(cmd) {
    appendTerminalLine(`guest@berdousis.gr:~$ ${cmd}`, 'text-primary-400 font-semibold');

    switch (cmd) {
      case 'help':
        appendTerminalLine(`Διαθέσιμες εντολές:
  • bio        - Σύντομο ακαδημαϊκό & εκπαιδευτικό προφίλ
  • postdoc    - Πληροφορίες μεταδιδακτορικής έρευνας
  • training   - Επιμορφωτικό έργο ενηλίκων (eTwinning, ΔΥΠΑ κ.α.)
  • teaching   - Διδακτική εμπειρία (Πανεπιστήμια, ΣΑΕΚ, Σχολεία)
  • stats      - Βασικά αριθμητικά μεγέθη & επιτεύγματα
  • pubs       - Σύνολο και κατηγορίες επιστημονικών δημοσιεύσεων
  • skills     - Τομείς εξειδίκευσης & ενδιαφέροντα
  • contact    - Στοιχεία επικοινωνίας
  • clear      - Καθαρισμός τερματικού
  • exit       - Κλείσιμο τερματικού`);
        break;

      case 'bio':
        appendTerminalLine(`Δρ. Ιωάννης Δ. Μπερδούσης
Μεταδιδακτορικός Ερευνητής (Παν. Πελοποννήσου) & Διδάκτωρ Διδακτικής Πληροφορικής (Παν. Αιγαίου - Άριστα).
Μόνιμος Εκπαιδευτικός ΠΕ86 & Επιμορφωτής Ενηλίκων (1.500+ ώρες).
Εξειδίκευση στην Τεχνητή Νοημοσύνη στην Εκπαίδευση, Gamified Learning, Εκπαιδευτική Ρομποτική & Συμπερίληψη.`);
        break;

      case 'training':
        appendTerminalLine(`Επιμορφωτικό Έργο & Εκπαίδευση Ενηλίκων (1.500+ ώρες):
  - eTwinning AI: Παιδαγωγική αξιοποίηση Τεχνητής Νοημοσύνης (200 ώρες)
  - eTwinning Robotics: Arduino Basic & Ρομποτική (200 ώρες)
  - eTwinning: Διαδραστικά Συστήματα στη Διδασκαλία (200 ώρες)
  - Δ.ΥΠ.Α / ΚΕΚ ΣΑΡΩΝΙΣ: Ψηφιακές & Πράσινες Δεξιότητες (510 ώρες)
  - ΣΕΠΕ / ΚΕΚ ΑΠΟΨΗ: Διαχειριστής Βάσεων Δεδομένων (250 ώρες)
  - Ε.Ε.Π.Ε.Κ.: Σύγχρονες Μέθοδοι Τηλεκπαίδευσης & Πληροφοριακά Συστήματα (350+ ώρες)
  - Α.Π.Θ.: Ταχύρρυθμη Επιμόρφωση στην Εξ Αποστάσεως Εκπαίδευση (20 ώρες)`);
        break;

      case 'teaching':
        appendTerminalLine(`Διδακτική Εμπειρία:
  - Τριτοβάθμια: Μητροπολιτικό Κολλέγιο (MA ICT), Παν. Πελοποννήσου (Αυτοδύναμη διδασκαλία Προγραμματισμού, Βάσεων Δεδομένων, Ηθικής & Διάχυτων Συστημάτων), ΑΣΠΑΙΤΕ, ΤΕΙ
  - Μετα-δευτεροβάθμια: ΣΑΕΚ / Δ.ΙΕΚ Τρίπολης, Άργους, Ναυπλίου (400+ ώρες σε C++, Web Dev, DBs, OS)
  - Σχολική: Μόνιμος Εκπαιδευτικός ΠΕ86 (2021-Σήμερα) & Αναπληρωτής (2010-2021)`);
        break;

      case 'postdoc':
        appendTerminalLine(`[Μεταδιδακτορική Έρευνα - 09/2025 έως Σήμερα]
Ίδρυμα: Πανεπιστήμιο Πελοποννήσου, Τμήμα Πληροφορικής και Τηλεπικοινωνιών
Αντικείμενο: Τεχνητή Νοημοσύνη, Προγραμματισμός και Συμπερίληψη στην Εκπαίδευση.`);
        break;

      case 'stats':
        appendTerminalLine(`Stats:
  - 1 Μεταδιδακτορικό (UoP) & 1 Διδακτορικό με 'Άριστα' (UoA)
  - 4 Ακαδημαϊκοί Τίτλοι (2 MSc, 2 BSc)
  - 33+ Επιστημονικές Δημοσιεύσεις (Springer, 13 Διεθνή Περιοδικά)
  - 15+ Έτη Διδασκαλίας & Επιμόρφωσης`);
        break;

      case 'pubs':
        appendTerminalLine(`Δημοσιεύσεις (Σύνολο: ${data.publications.length}):
  - 1 Κεφάλαιο σε Βιβλίο (Springer)
  - 13 Διεθνή Επιστημονικά Περιοδικά με Κριτές (όλα με DOI)
  - 6 Ελληνικά Επιστημονικά Περιοδικά με Κριτές
  - 6 Διεθνή Συνέδρια με Κριτές (INTED, WCES κ.α.)
  - 7 Ελληνικά Συνέδρια με Κριτές`);
        break;

      case 'skills':
        appendTerminalLine(`Τομείς Εξειδίκευσης & Ερευνητικά Ενδιαφέροντα:
  - Τεχνητή Νοημοσύνη στην Εκπαίδευση (LLMs, GenAI, Inclusivity)
  - Παιχνιδοποίηση / Gamified Learning (SDT, Flow Theory, TAM)
  - Διδακτική της Πληροφορικής & Εκπαίδευση Ενηλίκων
  - Έμφυλες Διαστάσεις στην Επιστήμη Υπολογιστών (Gender in CS)
  - Εκπαιδευτική Ρομποτική & Physical Computing (Arduino, Scratch S4A)
  - Προγραμματισμός, Βάσεις Δεδομένων & Πληροφοριακά Συστήματα`);
        break;

      case 'contact':
        appendTerminalLine(`Επικοινωνία:
  - Email: ${data.profile.email}
  - Τηλ: ${data.profile.phone}
  - Τοποθεσία: ${data.profile.location}`);
        break;

      case 'clear':
        terminalOutput.innerHTML = '';
        return;

      case 'exit':
        toggleTerminal(false);
        return;

      case '':
        break;

      default:
        appendTerminalLine(`Η εντολή "${cmd}" δεν βρέθηκε. Πληκτρολογήστε 'help' για τη λίστα εντολών.`, 'text-rose-400');
        break;
    }

    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function appendTerminalLine(text, className = 'text-slate-300') {
    const p = document.createElement('pre');
    p.className = `whitespace-pre-wrap font-mono text-xs my-1 ${className}`;
    p.textContent = text;
    terminalOutput.appendChild(p);
  }

  // Initial Renders
  setRole('academic');
  renderPublications();
  renderTimeline();
});
