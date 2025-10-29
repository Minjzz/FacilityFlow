document.addEventListener("DOMContentLoaded", function () {
    // Set modal date to today
    const today = new Date().toISOString().split("T")[0];
    const modalDate = document.getElementById("modalDate");
    modalDate.value = today;
    modalDate.min = today;

    // Facility Reserve Buttons
    const reserveButtons = document.querySelectorAll(".reserve-btn");
    reserveButtons.forEach(btn => {
        btn.addEventListener("click", function () {
            const facilityId = btn.getAttribute("data-facility-id");
            const facilityName = btn.getAttribute("data-facility-name");
            const facilityType = btn.getAttribute("data-facility-type");

            // Set hidden inputs
            document.getElementById("modalFacilityId").value = facilityId;
            document.getElementById("modalFacilityName").value = facilityName;
            document.getElementById("modalFacilityType").value = facilityType;

            // Update modal title
            document.getElementById("reserveModalLabel").textContent = `Reserve ${facilityName}`;

            // Open the modal
            const reserveModal = new bootstrap.Modal(document.getElementById('reserveModal'));
            reserveModal.show();
        });
    });

    // Scroll buttons
    const container = document.getElementById('facility-container');
    document.querySelector('.scroll-left').addEventListener('click', () => {
        container.scrollBy({ left: -320, behavior: 'smooth' });
    });
    document.querySelector('.scroll-right').addEventListener('click', () => {
        container.scrollBy({ left: 320, behavior: 'smooth' });
    });
});
