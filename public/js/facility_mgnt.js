document.addEventListener('DOMContentLoaded', function () {
    const addBtn = document.querySelector('.add-btn');
    const modal = document.getElementById('addFacilityModal');
    if (!addBtn || !modal) return;

    const closeBtns = modal.querySelectorAll('.close-modal, .close, .btn-secondary');

    function openModal() {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }
    function closeModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    addBtn.addEventListener('click', openModal);
    closeBtns.forEach(btn => btn.addEventListener('click', closeModal));
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
});

document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('facilityTrack');
    if (!track) return;

    const leftBtn = document.querySelector('.carousel-arrow.left');
    const rightBtn = document.querySelector('.carousel-arrow.right');
    
    let currentIndex = 0;
    const cardWidth = track.querySelector('.facility-card')?.offsetWidth || 0;
    const cardsPerView = 4;
    const totalCards = track.children.length;
    const maxIndex = Math.max(0, totalCards - cardsPerView);

    function updateArrowVisibility() {
        if (leftBtn) leftBtn.style.visibility = currentIndex <= 0 ? 'hidden' : 'visible';
        if (rightBtn) rightBtn.style.visibility = currentIndex >= maxIndex ? 'hidden' : 'visible';
    }

    function slideCards(direction) {
        currentIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));
        const offset = -(currentIndex * (cardWidth + 16)); // 16px is the gap
        track.style.transform = `translateX(${offset}px)`;
        updateArrowVisibility();
    }

    if (leftBtn) leftBtn.addEventListener('click', () => slideCards(-1));
    if (rightBtn) rightBtn.addEventListener('click', () => slideCards(1));

    // Initialize arrow visibility
    updateArrowVisibility();

    // Update on window resize
    window.addEventListener('resize', updateArrowVisibility);
});