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

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("updateStudentModal");
    const closeBtns = modal.querySelectorAll(".close, .close-modal");

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            modal.classList.add("show");

            document.getElementById("updateStudentId").value = btn.dataset.id;
            document.getElementById("updateStudentNum").value = btn.dataset.id_num;
            document.getElementById("updateFullName").value = btn.dataset.name;
            document.getElementById("updateYear").value = btn.dataset.year;
            document.getElementById("updateEmail").value = btn.dataset.email;
            document.getElementById("updateStatus").value = btn.dataset.status;
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => modal.classList.remove("show"));
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) modal.classList.remove("show");
    });
});


