/* =========================================================
   ORBITNOTES — script.js
   Organized into small, commented modules so new content
   (books, exercises, projects, videos, updates) can be added
   by editing the DATA objects near the top of this file.
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ============ 1. STARFIELD BACKGROUND ============ */
  (function starfield(){
    const canvas = document.getElementById('starfield');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let w, h;

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight * (document.body.scrollHeight / window.innerHeight > 1 ? 1 : 1);
      h = canvas.height = window.innerHeight;
      buildStars();
    }

    function buildStars(){
      const count = Math.floor((w * h) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.3,
        baseAlpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        phase: Math.random() * Math.PI * 2,
        driftX: (Math.random() - 0.5) * 0.02,
        driftY: (Math.random() - 0.5) * 0.02,
      }));
    }

    let scrollY = 0;
    window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive:true });

    function animate(t){
      ctx.clearRect(0, 0, w, h);
      const parallax = scrollY * 0.04;
      for (const s of stars){
        s.phase += s.twinkleSpeed;
        const alpha = s.baseAlpha * (0.6 + 0.4 * Math.sin(s.phase));
        s.x += s.driftX;
        s.y += s.driftY;
        if (s.x < 0) s.x = w; if (s.x > w) s.x = 0;
        if (s.y < 0) s.y = h; if (s.y > h) s.y = 0;

        const y = (s.y + parallax * (s.r)) % h;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${alpha})`;
        ctx.arc(s.x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(animate);
  })();

  /* ============ 2. RANDOM HERO QUOTE ============ */
  (function heroQuote(){
    const quotes = [
      { text: "Somewhere, something incredible is waiting to be known.", author: "Carl Sagan" },
      { text: "The cosmos is within us. We are made of star-stuff.", author: "Carl Sagan" },
      { text: "Equipped with his five senses, man explores the universe around him and calls the adventure Science.", author: "Edwin Hubble" },
      { text: "For small creatures such as we, the vastness is bearable only through love.", author: "Carl Sagan" },
      { text: "Astronomy compels the soul to look upward, and leads us from this world to another.", author: "Plato" },
      { text: "The universe is under no obligation to make sense to you.", author: "Neil deGrasse Tyson" },
      { text: "We are a way for the cosmos to know itself.", author: "Carl Sagan" },
      { text: "Somewhere, something incredible is waiting to be known — and it starts with looking up.", author: "adapted from Carl Sagan" }
    ];
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    document.querySelector('.quote-text').textContent = q.text;
    document.querySelector('.quote-author').textContent = q.author;
  })();

  /* ============ 3. NAV: scroll state, mobile menu, smooth links ============ */
  (function nav(){
    const topnav = document.getElementById('topnav');
    window.addEventListener('scroll', () => {
      topnav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive:true });

    const toggle = document.getElementById('navToggle');
    const links = document.getElementById('navLinks');
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', false);
    }));
  })();

  /* ============ 4. CONSTELLATION RAIL — scroll spy ============ */
  (function rail(){
    const dots = document.querySelectorAll('.rail-dot');
    const sections = Array.from(dots).map(d => document.getElementById(d.dataset.target)).filter(Boolean);

    dots.forEach(dot => dot.addEventListener('click', () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior:'smooth' });
    }));

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          dots.forEach(d => d.classList.toggle('active', d.dataset.target === entry.target.id));
        }
      });
    }, { rootMargin:'-45% 0px -45% 0px', threshold:0 });

    sections.forEach(s => observer.observe(s));
  })();

  /* ============ 5. FADE-IN SECTIONS ON SCROLL ============ */
  (function reveal(){
    const items = document.querySelectorAll('.fade-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting){
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold:0.12 });
    items.forEach(i => observer.observe(i));
  })();

  /* ============ 6. BACK TO TOP ============ */
  (function backToTop(){
    const btn = document.getElementById('backToTop');
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 600);
    }, { passive:true });
    btn.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
  })();

  /* =========================================================
     7. RESOURCE DATA
     Add new items here — cards render automatically.
     ========================================================= */
  const COURSE_BOOKS = [
    { title:"University Physics", desc:"The classic calculus-based intro to mechanics, waves, and thermodynamics.", level:"beginner" },
    { title:"Introduction to Classical Mechanics", desc:"A rigorous next step after intro physics, with worked problem sets.", level:"intermediate" },
    { title:"An Introduction to Modern Astrophysics", desc:"The standard undergraduate astrophysics reference — stars, galaxies, cosmology.", level:"advanced" },
    { title:"Griffiths' Introduction to Electrodynamics", desc:"The go-to text for electromagnetism, from statics to radiation.", level:"advanced" },
    { title:"Mathematical Methods for Physics", desc:"Builds the math toolkit — vectors, ODEs, Fourier series — used across every topic here.", level:"intermediate" },
    { title:"Foundations of Astronomy", desc:"A gentle, well-illustrated starting point for naked-eye and telescope astronomy.", level:"beginner" },
  ];

  const READING_BOOKS = [
    { title:"Cosmos", desc:"Carl Sagan's sweeping, poetic tour of the universe and our place in it.", level:"beginner" },
    { title:"Astrophysics for People in a Hurry", desc:"A fast, funny crash course through the biggest ideas in the field.", level:"beginner" },
    { title:"A Brief History of Time", desc:"Hawking's approachable walk through black holes, time, and the Big Bang.", level:"intermediate" },
    { title:"The Elegant Universe", desc:"A vivid introduction to string theory and the search for a theory of everything.", level:"intermediate" },
    { title:"Black Holes and Time Warps", desc:"Kip Thorne on the physics — and the physicists — behind general relativity's strangest predictions.", level:"advanced" },
    { title:"The Order of Time", desc:"Carlo Rovelli's meditation on what time actually is, once you stop assuming.", level:"intermediate" },
  ];

  const EXERCISE_TOPICS = [
    { topic:"Mechanics", worksheets:["Kinematics warm-up", "Newton's laws problem set", "Energy & momentum challenge"] },
    { topic:"Electromagnetism", worksheets:["Electrostatics basics", "Circuits problem set", "Maxwell's equations primer"] },
    { topic:"Waves", worksheets:["Wave properties worksheet", "Standing waves & resonance"] },
    { topic:"Optics", worksheets:["Ray diagrams practice", "Lenses & telescopes problem set"] },
    { topic:"Relativity", worksheets:["Special relativity warm-up", "Spacetime diagrams worksheet"] },
    { topic:"Astronomy", worksheets:["Celestial coordinates practice", "Observing log template"] },
    { topic:"Astrophysics", worksheets:["Stellar structure problem set", "Hertzsprung–Russell diagram exercise"] },
    { topic:"Mathematics", worksheets:["Calculus for physics warm-up", "Differential equations practice"] },
  ];

  const PROJECTS = [
    { title:"Build a Simple Telescope", difficulty:"beginner", time:"2–3 hours", materials:"Two lenses, cardboard tube, tape", desc:"Assemble a basic refracting telescope from household materials and learn how magnification works." },
    { title:"Track Moon Phases", difficulty:"beginner", time:"1 month", materials:"Notebook, clear sky", desc:"Observe and sketch the Moon every few nights to build an intuitive feel for the lunar cycle." },
    { title:"Observe Jupiter's Moons", difficulty:"intermediate", time:"Several evenings", materials:"Binoculars or small telescope, tripod", desc:"Spot the four Galilean moons and log their positions night to night." },
    { title:"Analyze Exoplanet Data", difficulty:"advanced", time:"1–2 weekends", materials:"Laptop, spreadsheet or Python", desc:"Use public transit light-curve data to estimate a planet's size and orbital period." },
    { title:"Build a Spectroscope", difficulty:"intermediate", time:"2–4 hours", materials:"CD/DVD, cardboard box, craft knife", desc:"Build a simple diffraction-grating spectroscope and split light into its component colors." },
    { title:"Measure Light Pollution", difficulty:"beginner", time:"A few nights", materials:"Star chart or app, notebook", desc:"Estimate your sky's darkness by counting the faintest stars visible in a known constellation." },
  ];

  const tagLabel = { beginner:"Beginner", intermediate:"Intermediate", advanced:"Advanced" };

  function bookCard(book){
    return `
      <div class="card" data-level="${book.level}" data-search="${book.title.toLowerCase()} ${book.desc.toLowerCase()}">
        <div class="card-media mono">cover placeholder</div>
        <div class="card-body">
          <h3 class="card-title">${book.title}</h3>
          <p class="card-desc">${book.desc}</p>
          <div class="card-meta">
            <span class="tag ${book.level}">${tagLabel[book.level]}</span>
            <a class="card-link" href="#" onclick="return false;">Download PDF ↓</a>
          </div>
        </div>
      </div>`;
  }

  function projectCard(p){
    return `
      <div class="card" data-level="${p.difficulty}" data-search="${p.title.toLowerCase()} ${p.desc.toLowerCase()}">
        <div class="card-media mono">project photo</div>
        <div class="card-body">
          <h3 class="card-title">${p.title}</h3>
          <p class="card-desc">${p.desc}</p>
          <p class="project-meta">
            <span>⏱ ${p.time}</span>
            <span>🧰 ${p.materials}</span>
          </p>
          <div class="card-meta">
            <span class="tag ${p.difficulty}">${tagLabel[p.difficulty]}</span>
          </div>
        </div>
      </div>`;
  }

  function renderGrid(id, items, cardFn){
    document.getElementById(id).innerHTML = items.map(cardFn).join('');
  }
  renderGrid('coursebooksGrid', COURSE_BOOKS, bookCard);
  renderGrid('readingGrid', READING_BOOKS, bookCard);
  renderGrid('projectsGrid', PROJECTS, projectCard);

  function renderAccordion(){
    const el = document.getElementById('exerciseAccordion');
    el.innerHTML = EXERCISE_TOPICS.map((t, i) => `
      <div class="accordion-item" data-search="${t.topic.toLowerCase()}">
        <button class="accordion-header" data-idx="${i}">
          ${t.topic} <span class="chevron">⌄</span>
        </button>
        <div class="accordion-panel">
          <ul class="worksheet-list">
            ${t.worksheets.map(w => `<li>${w} <a href="#" onclick="return false;">Download ↓</a></li>`).join('')}
          </ul>
        </div>
      </div>`).join('');

    el.querySelectorAll('.accordion-header').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('.accordion-item').classList.toggle('open');
      });
    });
  }
  renderAccordion();

  /* ============ 8. RESOURCE TABS ============ */
  (function resourceTabs(){
    const tabs = document.querySelectorAll('.resource-tab');
    tabs.forEach(tab => tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.resource-panel').forEach(p => p.classList.remove('active'));
      document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
    }));
  })();

  /* ============ 9. RESOURCE SEARCH + DIFFICULTY FILTER ============ */
  (function resourceFilters(){
    const search = document.getElementById('resourceSearch');
    const chips = document.querySelectorAll('.filter-chip');
    let activeLevel = 'all';

    function applyFilters(){
      const q = search.value.trim().toLowerCase();
      let anyVisible = false;

      document.querySelectorAll('.resource-panel .card').forEach(card => {
        const matchesLevel = activeLevel === 'all' || card.dataset.level === activeLevel;
        const matchesSearch = !q || card.dataset.search.includes(q);
        const show = matchesLevel && matchesSearch;
        card.style.display = show ? '' : 'none';
        if (show) anyVisible = true;
      });

      document.querySelectorAll('.accordion-item').forEach(item => {
        const matchesSearch = !q || item.dataset.search.includes(q) ||
          [...item.querySelectorAll('.worksheet-list li')].some(li => li.textContent.toLowerCase().includes(q));
        item.style.display = matchesSearch ? '' : 'none';
        if (matchesSearch) anyVisible = true;
      });

      const emptyState = document.getElementById('resourceEmptyState');
      const activePanel = document.querySelector('.resource-panel.active');
      const hasResults = activePanel.querySelectorAll(':scope .card, :scope .accordion-item').length === 0 ||
        [...activePanel.querySelectorAll(':scope .card, :scope .accordion-item')].some(el => el.style.display !== 'none');
      emptyState.hidden = hasResults;
    }

    search.addEventListener('input', applyFilters);
    chips.forEach(chip => chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeLevel = chip.dataset.level;
      applyFilters();
    }));
    document.querySelectorAll('.resource-tab').forEach(tab => tab.addEventListener('click', applyFilters));
  })();

  /* =========================================================
     10. YOUTUBE RECOMMENDATIONS DATA
     ========================================================= */
  const YT_CATEGORIES = [
    { name:"Beginner Astronomy", videos:[
      { title:"How to Actually Learn Astronomy", creator:"Anton Petrov", desc:"A friendly starting map for total beginners." },
      { title:"Naked-Eye Astronomy 101", creator:"Astrum", desc:"What you can see tonight with nothing but your eyes." },
      { title:"Your First Telescope, Explained", creator:"Dylan O'Donnell", desc:"Choosing and setting up a beginner scope." },
    ]},
    { name:"University Lectures", videos:[
      { title:"MIT 8.01 Classical Mechanics", creator:"MIT OpenCourseWare", desc:"Full lecture series on introductory mechanics." },
      { title:"Stanford Modern Physics", creator:"Stanford Online", desc:"Bridging classical and quantum ideas." },
      { title:"Yale Fundamentals of Physics", creator:"YaleCourses", desc:"A complete undergraduate physics sequence." },
    ]},
    { name:"Astrophysics", videos:[
      { title:"How Stars Die", creator:"PBS Space Time", desc:"Stellar evolution from birth to remnant." },
      { title:"What Is Dark Matter, Really?", creator:"Kurzgesagt", desc:"An accessible visual explainer on the missing mass problem." },
      { title:"The Physics of Black Holes", creator:"PBS Space Time", desc:"Event horizons, singularities, and Hawking radiation." },
    ]},
    { name:"Documentaries", videos:[
      { title:"The Farthest: Voyager in Space", creator:"PBS", desc:"The story of humanity's most distant spacecraft." },
      { title:"Cosmos: A Spacetime Odyssey", creator:"Neil deGrasse Tyson", desc:"A modern reboot of Sagan's classic series." },
      { title:"In Saturn's Rings", creator:"IMAX", desc:"A visual journey through the outer solar system." },
    ]},
    { name:"Space Missions", videos:[
      { title:"James Webb: First Images Explained", creator:"NASA", desc:"Breaking down JWST's earliest discoveries." },
      { title:"How Artemis Will Return Us to the Moon", creator:"NASASpaceflight", desc:"A walkthrough of the Artemis program's architecture." },
      { title:"Perseverance: Landing on Mars", creator:"NASA JPL", desc:"The '7 minutes of terror' explained in detail." },
    ]},
    { name:"Mathematics", videos:[
      { title:"Essence of Calculus", creator:"3Blue1Brown", desc:"Building calculus intuition visually, from the ground up." },
      { title:"Differential Equations, Visually", creator:"3Blue1Brown", desc:"Why differential equations show up everywhere in physics." },
      { title:"Linear Algebra for Physics", creator:"Faculty of Khan", desc:"The linear algebra you actually need for mechanics and QM." },
    ]},
    { name:"Programming for Science", videos:[
      { title:"Python for Astronomers", creator:"Astropy Project", desc:"Using Python and Astropy to analyze real sky data." },
      { title:"Plotting Light Curves in Python", creator:"Corey Schafer", desc:"Practical data-plotting skills for exoplanet analysis." },
      { title:"Intro to NumPy for Data Analysis", creator:"freeCodeCamp", desc:"The numerical foundation behind most science code." },
    ]},
  ];

  function ytCard(v){
    return `
      <div class="yt-card">
        <div class="yt-thumb">thumbnail</div>
        <div class="yt-body">
          <h4 class="yt-title">${v.title}</h4>
          <p class="yt-creator">${v.creator}</p>
          <p class="yt-desc">${v.desc}</p>
          <a class="yt-watch" href="#" onclick="return false;">Watch ▸</a>
        </div>
      </div>`;
  }

  document.getElementById('ytCategories').innerHTML = YT_CATEGORIES.map(cat => `
    <div class="yt-category">
      <h3>${cat.name}</h3>
      <div class="yt-grid">${cat.videos.map(ytCard).join('')}</div>
    </div>`).join('');

  /* =========================================================
     11. MONTHLY ASTRONOMY UPDATES DATA
     Add a new object at the top of MONTHLY_UPDATES to publish
     a new month — the newest post always appears first.
     ========================================================= */
  const MONTHLY_UPDATES = [
    {
      month:"July 2026",
      title:"Meteors, a Morning Planet Parade, and a New Launch Window",
      items:[
        "Southern Delta Aquariids peak late in the month",
        "Venus and Jupiter both visible before dawn",
        "A new crewed launch window opens mid-month",
        "Fresh JWST imagery of a nearby star nursery",
      ],
    },
    {
      month:"June 2026",
      title:"Solstice Skies and a Bright Noctilucent Season",
      items:[
        "June solstice marks the longest daylight of the year",
        "Noctilucent clouds visible at high latitudes after sunset",
        "Mercury reaches its best evening visibility of the year",
        "New exoplanet candidate announced from transit survey data",
      ],
    },
    {
      month:"May 2026",
      title:"Eta Aquariids and Saturn's Return to the Morning Sky",
      items:[
        "Eta Aquariid meteor shower peaks in the first week",
        "Saturn becomes visible again in the pre-dawn sky",
        "A small asteroid makes a well-tracked close approach",
        "ESA mission update on upcoming sample-return timeline",
      ],
    },
  ];

  document.getElementById('updatesGrid').innerHTML = MONTHLY_UPDATES.map(u => `
    <article class="update-card">
      <div class="update-media mono">sky image placeholder</div>
      <div class="update-body">
        <p class="update-month mono">${u.month}</p>
        <h3 class="update-title">${u.title}</h3>
        <ul class="update-list">
          ${u.items.map(i => `<li>${i}</li>`).join('')}
        </ul>
        <a class="card-link" href="#" onclick="return false;">Read More →</a>
      </div>
    </article>`).join('');

  /* =========================================================
     12. FAQ
     ========================================================= */
  const FAQS = [
    { q:"I've never studied physics before — where do I start?", a:"Start in Resources → Course Books with the beginner-tagged titles, and pair them with the Beginner Astronomy video category. No prior background needed." },
    { q:"Do I need a telescope to get started?", a:"Not at all. Several projects and most of the monthly updates are built around naked-eye or binocular observing." },
    { q:"How often are the monthly updates posted?", a:"A new post goes up at the start of each month, covering meteor showers, planet visibility, launches, and recent discoveries." },
    { q:"Can I suggest a book, video, or project?", a:"Yes — use the contact form below. Suggestions from fellow students are especially welcome." },
  ];

  document.getElementById('faqList').innerHTML = FAQS.map((f, i) => `
    <div class="faq-item">
      <button class="faq-q" data-idx="${i}">${f.q} <span class="plus">+</span></button>
      <div class="faq-a">${f.a}</div>
    </div>`).join('');

  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('.faq-item').classList.toggle('open'));
  });

  /* ============ 13. CONTACT FORM (placeholder submit) ============ */
  (function contactForm(){
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      status.textContent = "Message ready to send — connect this form to an email service to go live.";
      form.reset();
    });
  })();

});
