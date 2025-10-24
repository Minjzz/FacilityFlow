document.addEventListener('DOMContentLoaded', function () {
    const openBtn = document.querySelector('[data-modal="newReservation"]');
    const modal = document.getElementById('newReservationModal');
    const closeBtns = modal.querySelectorAll('.close-modal');

    function openModal() {
        modal.classList.add('show');
        modal.setAttribute('aria-hidden', 'false');
    }
    function closeModal() {
        modal.classList.remove('show');
        modal.setAttribute('aria-hidden', 'true');
    }

    if (openBtn) openBtn.addEventListener('click', openModal);
    closeBtns.forEach(b => b.addEventListener('click', closeModal));
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

});