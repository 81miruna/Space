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
    { title:"Astronomical Problems", desc:"An introductory course in astrophysics", level:"beginner",  fileUrl:"Culegere Astro.pdf", cover:"astro1.jpg",  fileType:"PDF" },
    { title:"Introduction to Astronomy", desc:"From atomic nuclei to galactic superclusters", level:"beginner", fileUrl:"https://1drv.ms/b/c/bb4cb97d9f45c6fd/IQBCRxSE5dOPQq-IXX3BYGtkAT8UAvBS6j5MSG5TpwF2nPs?e=IPT2mU", cover:"astro2.webp",  fileType:"PDF"},
    { title:"Cosmology", desc:"The expanding universe, dark energy, and the Big Bang explained using accessible everyday analogies", level:"intermediate", fileUrl:"Ryden Cosmology.pdf", cover:"astro3.jfif",  fileType:"PDF" },
    { title:"Fundamental Astronomy", desc:"A Comprehensive introduction to both classical and modern astronomy", level:"intermediate" , fileUrl:"Fundamental Astronomy H.Karttunen.pdf", cover:"astro4.png",  fileType:"PDF"},
    { title:"Introduction to Cosmology: Second Edition", desc:"Learn accurate physics that aligns with standard university curricula", level:"advanced", fileUrl:"Barbara Ryden - Introduction to Cosmology-Cambridg_240803_113236.pdf", cover:"astro5.jpeg",  fileType:"PDF"},
    { title:"Foundations of Modern Astrophysics", desc:"A mathematically rigorous, and exhaustive deep dive into the actual physics governing everything", level:"advanced", cover:"astro6.webp",  fileType:"PDF" , fileUrl:"https://1drv.ms/b/c/bb4cb97d9f45c6fd/IQCAdTF3hGHaT7Aw8WSu4refAevpmNWGnk4C96ol8C08BTI?e=KKP7L3"},
  ];

 const READING_CATEGORIES = [
  { name:"Big Ideas", books:[
    { title:"Astrophysics for People in a Hurry", desc:"A fast, funny crash course through the biggest ideas in the field.", level:"beginner", fileUrl:"_OceanofPDF.com_Astrophysics_for_People_in_a_Hurry_-_Neil_DeGrasse_Tyson.epub", fileType:"EPUB", cover:"neil.jpeg" },
    { title:"A Brief History of Time", desc:"Hawking's approachable walk through black holes, time, and the Big Bang.", level:"intermediate", fileUrl:"_OceanofPDF.com_Brief_history_of_time_-_Stephen_hawking.pdf", fileType:"PDF", cover:"abrief.jpeg" },
    { title:"Brief Answers to the Big Questions", desc:"The book blends theoretical physics with humanitarian concern to make complex science universally accessible", level:"beginner", fileUrl:"_OceanofPDF.com_Brief_Answers_to_the_Big_Questions_-_Stephen_Hawking.epub", fileType:"EPUB" , cover:"stephenq.jpg"},
  ]},
  { name:"Stories", books:[
    { title:"Insterstellar", desc:"A perfect blend between groundbreaking theoretical physics and a highly emotional, character-driven story", genre:"Sci-Fi", fileUrl:"_OceanofPDF.com_Interstellar_-_Greg_Keyes.epub", fileType:"EPUB", cover:"interstellar.jpg" },
    { title:"Dark Matter", desc:"A tense story about choices, paths not taken, and personal identity, with a bit of quantum mechanics", genre:"Thriller",fileUrl:"_OceanofPDF.com_Dark_Matter_-_Blake_Crouch.epub", fileType:"EPUB" , cover:"dark.jpg"},
    { title:"Ascension", desc:"One of the best fast-paced narratives that blends space exploration, greed, reality television, and romance",genre:"Young Adult", fileUrl:"_OceanofPDF.com_Ascension_-_Victor_dixen.pdf" , fileType:"PDF", cover:"ascension.jpg"},
  ]},
];

  const EXERCISE_TOPICS = [
  { topic:"Textbook selected exercises", worksheets:[
    { name:"Set 1", fileUrl:"set1.docx", fileType:"DOCX" },
    { name:"Set 2", fileUrl:"set2.docx" , fileType:"DOCX"},
  ]},
  { topic:"Diverse problems - 1/2", worksheets:[
    { name:"Exercises", fileUrl:"HW3.zip" , fileType:"ZIP"},
    { name:"Solutions", fileUrl:"HW4.zip" , fileType:"ZIP"},
  ]},
  { topic:"Diverse problems - 2/2", worksheets:[
    { name:"Exercises", fileUrl:"problemsWeek.zip", fileType:"ZIP" },
    { name:"Solutions", fileUrl:"problemsWeek12.zip", fileType:"ZIP" },
  ]},
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
  const tagHtml = book.genre
    ? `<span class="tag genre">${book.genre}</span>`
    : `<span class="tag ${book.level}">${tagLabel[book.level]}</span>`;

  return `
    <div class="card" data-level="${book.level || ''}" data-search="${book.title.toLowerCase()} ${book.desc.toLowerCase()} ${(book.genre || '').toLowerCase()}">
      <div class="card-media" ${book.cover ? `style="background:url('${book.cover}') center/cover;"` : ''}>
        ${book.cover ? '' : '<span class="mono">cover placeholder</span>'}
      </div>
      <div class="card-body">
        <h3 class="card-title">${book.title}</h3>
        <p class="card-desc">${book.desc}</p>
        <div class="card-meta">
          ${tagHtml}
          ${book.fileUrl
            ? `<a class="card-link" href="${book.fileUrl}" target="_blank" rel="noopener">Download ${book.fileType} ↓</a>`
            : `<a class="card-link" href="#" onclick="return false;">Coming soon</a>`}
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
  document.getElementById('readingGrid').innerHTML = READING_CATEGORIES.map(cat => `
  <div class="book-category">
    <h3 class="book-category-title">${cat.name}</h3>
    <div class="card-grid">${cat.books.map(bookCard).join('')}</div>
  </div>`).join('');
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
            ${t.worksheets.map(w => `
              <li>${w.name}
                ${w.fileUrl
                  ? `<a href="${w.fileUrl}" target="_blank" rel="noopener">Download ${w.fileType || ''} ↓</a>`
                  : `<a href="#" onclick="return false;">Coming soon</a>`}
              </li>`).join('')}
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
      { title:"Introduction to Astronomy", creator:"CrashCourse", desc:"A friendly starting point for beginners", url:"https://youtu.be/0rHUDWjR5gg?si=kByT8SaWxRZ_hgM8" },
      { title:"Naked-Eye Astronomy", creator:"BBC Sky", desc:"What you can see tonight with nothing but your eyes", url:"https://youtu.be/Gl9qtBbKhEk?si=toXVurH73LyCqoSw" },
      { title:"Your First Telescope, Explained", creator:"Ian Lauer Astro", desc:"Choosing the best telescope for yourself", url:"https://youtu.be/6TIOSPMZkL0?si=k36Q2tIWfnBXho0FV" },
    ]},
    { name:"Astrophysics", videos:[
      { title:"The Cycle Of Stars", creator:"Brian Cox", desc:"Stellar evolution from birth to remnant" , url:"https://youtu.be/1YIDzCbdN0U?si=Bam7qWf7ULE8nNtK"},
      { title:"The Evolution Of The Universe", creator:"Brian Cox", desc:"An accessible visual explainer on the evolution of the universe" , url:"https://youtu.be/97qnebweV3E?si=fI0kReQTKDVnrnWF"},
      { title:"The Physics of Black Holes", creator:"ScienceCic", desc:"Event horizons, singularities, and more weird stuff" , url:"https://youtu.be/GQZ3R81iyE0?si=l6QMgcBEzcwYpguz"},
    ]},
    { name:"Cool Visualizations", videos:[
      { title:"General Relativity", creator:"ScienceClic", desc:"An easy way to understand general relativity", url:"https://youtu.be/wrwgIjBUYVc?si=ReMizgQu-exP0BfG" },
      { title:"Travelling at the Speed Of Light", creator:"ScienceClic", desc:"What does being a photon feel like? Only one way to find out", url:"https://youtu.be/vFNgd3pitAI?si=E0XdUSinHOCHaXS2" },
      { title:"Black Holes", creator:"ScienceClic", desc:"A visual journey of falling into a black hole" , url:"https://youtu.be/4rTv9wvvat8?si=JUtc_40LnvTjBX83"},
    ]},
     { name:"How does the Universe actually work?", videos:[
      { title:"The Standard Model", creator:"ScienceClic", desc:"Understand how the basic building blocks of matter interact through electromagnetic, weak, and strong forces, excluding only gravity", url:"https://youtu.be/44k7cMj_kpY?si=F2pxvBD1R8RjafIK" },
      { title:"Electromagnetic Waves", creator:"ScienceClic", desc:"Ever wondered how everyday technologies like Wi-Fi or microwaves work? Then this video is for you", url:"https://youtu.be/V_jYXQFjCmA?si=xVJdcXMosDplwmTc" },
      { title:"The Symmetry of the Universe", creator:"ScienceClic", desc:"A visualization of pretty much everything" , url:"https://youtu.be/0GUTJQCeKBE?si=X0OjeIdeeiXjJbD8"},
    ]},
    { name:"Overthinking about life and the universe? We all are", videos:[
      { title:"100 Questions with Brian Cox", creator:"Tom Simons", desc:"Using Python and Astropy to analyze real sky data.", url:"https://youtu.be/WVJDTj2YRWY?si=yT5do-0skypwFRcO" },
      { title:"Are Aliens Real?", creator:"Science Time", desc:"Even though we've never spotted them, it's entirely possible that aliens exist", url:"https://youtu.be/zS7fDY2jY44?si=-LoXjkm4GIgt1ePD" },
      { title:"What Was Before the Big Bang? ", creator:"Science Time", desc:"The numerical foundation behind most science code." , url:"https://youtu.be/BD0r2Xfgh_E?si=GYSDmSmfUOZIPWD_"},
    ]},
  ];

  function ytCard(v){
  const idMatch = v.url ? v.url.match(/(?:v=|youtu\.be\/)([\w-]{11})/) : null;
  const videoId = idMatch ? idMatch[1] : null;
  const thumb = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : null;
  return `
    <div class="yt-card">
      <div class="yt-thumb" ${thumb ? `style="background:url('${thumb}') center/cover;"` : ''}></div>
      <div class="yt-body">
        <h4 class="yt-title">${v.title}</h4>
        <p class="yt-creator">${v.creator}</p>
        <p class="yt-desc">${v.desc}</p>
        <a class="yt-watch" href="${v.url || '#'}" target="_blank" rel="noopener">Watch ▸</a>
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
      title:"The oldest quasars ever seen",
      image:"july.webp",
      url:"https://spacedaily.com/m-in-july-2026-europes-euclid-telescope-found-31-of-the-oldest-quasars-ever-seen-two-now-shining-with-the-light-of-a-trillion-suns-when-the-cosmos-was-just-5-percent-of-its-present-age-thei/",
      items:[
        "Europe's Euclid telescope has found 31 of the oldest known quasars in one go, and the haul roughly doubles the number known from that early stretch of the universe.",
      ],
    },
    {
      month:"June 2026",
      title:"Comet 3I/ATLAS",
      image:"june.jpg",
      url:"https://bintel.com.au/blogs/news/space-and-astronomy-news-27th-june-2026?srsltid=AfmBOooVnHeQG3ePpb8Zy1Rwj15uDyoeHtvKPfhJRoukqkQw0q1AiucS",
      items:[
        "Comet 3I/ATLAS is older than the Solar System. NASA confirms our most recent visitor is 10 to 12 billion years old.",
      ],
    },
    
  ];

  document.getElementById('updatesGrid').innerHTML = MONTHLY_UPDATES.map(u => `
    <article class="update-card">
      <div class="update-media" ${u.image ? `style="background:url('${u.image}') center/cover;"` : ''}>
  ${u.image ? '' : '<span class="mono">sky image placeholder</span>'}
</div>
      <div class="update-body">
        <p class="update-month mono">${u.month}</p>
        <h3 class="update-title">${u.title}</h3>
        <ul class="update-list">
          ${u.items.map(i => `<li>${i}</li>`).join('')}
        </ul>
        ${u.url ? `<a class="card-link" href="${u.url}" target="_blank" rel="noopener">Read More →</a>` : ''}
      </div>
    </article>`).join('');

  /* =========================================================
     12. FAQ
     ========================================================= */
  const FAQS = [
    { q:"I've never studied physics before — where do I start?", a:"Start in Resources → Course Books with the beginner-tagged titles, and pair them with the Beginner Astronomy video category. No prior background needed." },
    { q:"Do I need a telescope to get started?", a:"Not at all. Several projects and most of the monthly updates are built around naked-eye or binocular observing." },
    { q:"Are the star maps and educational resources free to download and use in classrooms?", a:"Of course! Feel free to download whatever you want and ask for more resources if you need them." },
    { q:"Can I suggest a book, video, or project?", a:"Yes — use the contact form below. Suggestions are always welcome." },
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
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/xaqggpre"; // <-- paste your real endpoint here

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = "Sending…";
    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        status.textContent = "Thanks — your message has been sent!";
        form.reset();
      } else {
        status.textContent = "Something went wrong — please try emailing directly instead.";
      }
    } catch (err) {
      status.textContent = "Something went wrong — please try emailing directly instead.";
    }
  });
})();

});
