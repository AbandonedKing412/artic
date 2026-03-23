document.addEventListener('DOMContentLoaded', () => {

    // ── HAMBURGER MENU ──
    const hamburger = document.getElementById('hamburger');
    const mainNav   = document.getElementById('mainNav');
    if (hamburger && mainNav) {
        hamburger.addEventListener('click', () => {
            mainNav.classList.toggle('open');
        });
        // close nav when a link is clicked
        mainNav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', () => mainNav.classList.remove('open'));
        });
    }

    // ── HERO SLIDER ──
    const heroPrev   = document.querySelector('.hero-prev');
    const heroNext   = document.querySelector('.hero-next');
    const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
    const heroDots   = Array.from(document.querySelectorAll('.hero-dot'));
    let heroCurrent  = 0;
    let heroTimer;

    if (heroSlides.length && heroDots.length && heroPrev && heroNext) {
        function heroGoTo(index) {
            heroSlides[heroCurrent].classList.remove('active');
            heroDots[heroCurrent].classList.remove('active');
            heroCurrent = (index + heroSlides.length) % heroSlides.length;
            heroSlides[heroCurrent].classList.add('active');
            heroDots[heroCurrent].classList.add('active');
        }
        function heroAutoPlay() {
            heroTimer = setInterval(() => heroGoTo(heroCurrent + 1), 9000);
        }
        function heroResetTimer() {
            clearInterval(heroTimer);
            heroAutoPlay();
        }
        heroPrev.addEventListener('click', () => { heroGoTo(heroCurrent - 1); heroResetTimer(); });
        heroNext.addEventListener('click', () => { heroGoTo(heroCurrent + 1); heroResetTimer(); });
        heroDots.forEach((dot, i) => {
            dot.addEventListener('click', () => { heroGoTo(i); heroResetTimer(); });
        });
        heroAutoPlay();
    }

    // ── MEMBERS CAROUSEL ──
    // Concept: 5 fixed slots always visible [ 0, 1, 2(center), 3, 4 ]
    // current = index of the card sitting in the center slot
    // Slots fill with cards relative to center. If index < 0 or >= total, slot is empty.

    const slots   = Array.from(document.querySelectorAll('.carousel-slot'));
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    // card data pulled from HTML
    const cardData = Array.from(document.querySelectorAll('.carousel-card-data')).map(el => ({
        img:  el.dataset.img,
        alt:  el.dataset.alt,
        name: el.dataset.name,
        desc: el.dataset.desc
    }));
    const total = cardData.length;
    let current = 4; // start on card 5 (index 4) so center slot shows card 5

    function update() {
        slots.forEach((slot, s) => {
            if (getComputedStyle(slot).display === 'none') return;
            const offset    = s - 2;
            const cardIndex = current + offset;
            const inner     = slot.querySelector('.slot-inner');

            if (cardIndex < 0 || cardIndex >= total) {
                slot.classList.add('slot-empty');
                inner.innerHTML = '';
                return;
            }

            slot.classList.remove('slot-empty');
            slot.classList.toggle('slot-center', offset === 0);

            const d = cardData[cardIndex];
            inner.innerHTML = `
                <img src="${d.img}" alt="${d.alt}">
                <div class="carousel-overlay">
                    <h3>${d.name}</h3>
                    <p>${d.desc}</p>
                </div>`;
        });

        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === total - 1;
    }

    prevBtn.addEventListener('click', () => { if (current > 0)           { current--; update(); } });
    nextBtn.addEventListener('click', () => { if (current < total - 1)   { current++; update(); } });

    update();
});