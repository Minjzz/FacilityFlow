
// document.addEventListener('DOMContentLoaded', function () {
//     // Select all reserve buttons
//     const reserveButtons = document.querySelectorAll('.reserve-btn');

//     reserveButtons.forEach(button => {
//         button.addEventListener('click', function () {
//             // Get data attributes from the clicked button
//             const facilityId = this.getAttribute('data-facility-id');
//             const facilityName = this.getAttribute('data-facility-name');
//             const facilityType = this.getAttribute('data-facility-type');

//             // Fill hidden inputs in the modal
//             document.getElementById('facilityId').value = facilityId;
//             document.getElementById('facilityName').value = facilityName;
//             document.getElementById('facilityType').value = facilityType;

//             // Optional: update modal title for clarity
//             document.getElementById('reserveModalLabel').innerText = `Reserve ${facilityName}`;
//         });
//     });
// });



// Facility scroll buttons
const container = document.getElementById('facility-container');
document.querySelector('.scroll-left').addEventListener('click', () => {
    container.scrollBy({ left: -320, behavior: 'smooth' });
});
document.querySelector('.scroll-right').addEventListener('click', () => {
    container.scrollBy({ left: 320, behavior: 'smooth' });
});

