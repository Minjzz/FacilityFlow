document.addEventListener('DOMContentLoaded', function () {
    const addBtn = document.getElementById('addStudentBtn');
    const modal = document.getElementById('addStudentModal');
    const closeBtn = modal.querySelector('.close');

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

    if (addBtn) addBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

});