const wrapper_testimonial = document.querySelector(".wrapper_testimonial");
const carousel = document.querySelector(".carousel");
const gap = 16; // tu gap real en el CSS
const firstCardWidth = carousel.querySelector(".card").offsetWidth + gap;
const arrowBtns = document.querySelectorAll(".wrapper_testimonial i");
const carouselChildrens = [...carousel.children];

let isDragging = false;
let startX, startScrollLeft;
let stopForCenter = false;
let autoPlayInterval;

// Número de cards visibles
let cardPerView = Math.round(carousel.offsetWidth / firstCardWidth);

// Duplicados para scroll infinito
carouselChildrens.slice(-cardPerView).reverse().forEach(card => {
    carousel.insertAdjacentHTML("afterbegin", card.outerHTML);
});
carouselChildrens.slice(0, cardPerView).forEach(card => {
    carousel.insertAdjacentHTML("beforeend", card.outerHTML);
});

// Posición inicial
carousel.classList.add("no-transition");
carousel.scrollLeft = carousel.offsetWidth;
carousel.classList.remove("no-transition");

// Flechas
arrowBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        carousel.scrollLeft += btn.id === "left" 
            ? -(firstCardWidth - 1) 
            : (firstCardWidth - 1);
    });
});

// Drag
const dragStart = (e) => {
    isDragging = true;
    carousel.classList.add("dragging");
    startX = e.pageX;
    startScrollLeft = carousel.scrollLeft;
};

const dragging = (e) => {
    if (!isDragging) return;
    carousel.scrollLeft = startScrollLeft - (e.pageX - startX);
};

const dragStop = () => {
    isDragging = false;
    carousel.classList.remove("dragging");
};

// Scroll infinito corregido
function fixInfinite() {
    const maxScroll = carousel.scrollWidth - carousel.offsetWidth;

    // No llegar al límite exacto → evita detener bugs
    if (carousel.scrollLeft <= 0) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = maxScroll - (carousel.offsetWidth * 1.1);
        carousel.classList.remove("no-transition");
    }

    if (carousel.scrollLeft >= maxScroll - 2) {
        carousel.classList.add("no-transition");
        carousel.scrollLeft = carousel.offsetWidth + 2;
        carousel.classList.remove("no-transition");
    }
}

// Autoplay continuo sin romper wrappers
function startAutoPlay() {
    if (stopForCenter) return;

    clearInterval(autoPlayInterval);
    autoPlayInterval = setInterval(() => {
        // movimiento por card pero evitando límite exacto
        carousel.scrollLeft += firstCardWidth - 1;
        fixInfinite();
    }, 1800);
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

// Detectar card central
const cards = carousel.querySelectorAll(".card");

function updateCenterCard() {
    const rect = carousel.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    let closest = null;
    let minDist = Infinity;

    cards.forEach(card => {
        const r = card.getBoundingClientRect();
        const cardCenter = r.left + r.width / 2;
        const dist = Math.abs(cardCenter - centerX);

        if (dist < minDist) {
            minDist = dist;
            closest = card;
        }
    });

    cards.forEach(c => c.classList.remove("active"));
    if (closest) closest.classList.add("active");

    // Si el cursor está sobre la card central → detener autoplay
    if (closest && closest.matches(":hover")) {
        stopForCenter = true;
        stopAutoPlay();
    } else {
        stopForCenter = false;
        startAutoPlay();
    }
}

// Eventos
carousel.addEventListener("mousedown", dragStart);
carousel.addEventListener("mousemove", dragging);
document.addEventListener("mouseup", dragStop);

carousel.addEventListener("scroll", () => {
    fixInfinite();
    updateCenterCard();
});

wrapper_testimonial.addEventListener("mouseleave", () => {
    stopForCenter = false;
    startAutoPlay();
});

// Inicializar
updateCenterCard();
startAutoPlay();
