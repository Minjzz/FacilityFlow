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
    const closeBtns = modal.querySelectorAll(".close");

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            modal.classList.add("show");

            const id = btn.getAttribute("data-id");
            const id_num = btn.getAttribute("data-id_num");
            const name = btn.getAttribute("data-name");
            const course = btn.getAttribute("data-course");
            const yearLevel = btn.getAttribute("data-yearLevel");
            const email = btn.getAttribute("data-email");
            const status = btn.getAttribute("data-status");

            document.getElementById("updateStudentId").value = id;
            document.getElementById("updateStudentNum").value = id_num;
            document.getElementById("updateFullName").value = name;
            document.getElementById("updateCourse").value = course;
            document.getElementById("updateYearLevel").value = yearLevel;
            document.getElementById("updateEmail").value = email;
            document.getElementById("updateStatus").value = status;
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            modal.classList.remove("show");
        });
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("show");
        }
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const form = btn.closest('.delete-form'); 

            Swal.fire({
                title: 'Are you sure?',
                text: "This will permanently delete the student record!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#2e8b57',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    form.submit(); 
                }
            });
        });
    });
});
