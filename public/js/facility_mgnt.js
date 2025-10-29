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

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("editFacilityModal");
    const closeBtns = modal.querySelectorAll(".close, .close-modal");

    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            modal.classList.add("show");

            const id = btn.getAttribute("data-id");
            const name = btn.getAttribute("data-name");
            const type = btn.getAttribute("data-type");
            const capacity = btn.getAttribute("data-capacity");
            const status = btn.getAttribute("data-status");

            document.getElementById("editFacilityId").value = id;
            document.getElementById("editFacilityName").value = name;
            document.getElementById("editFacilityType").value = type;
            document.getElementById("editFacilityCapacity").value = capacity;
            document.getElementById("editFacilityStatus").value = status;
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

function confirmDelete(form) {
    event.preventDefault();
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#aaa',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            form.submit();
        }
    });
    return false;
}
