function toggleDropdown() {
    document.getElementById("dropdownMenu").classList.toggle("show");
}

const modal = document.getElementById("addStudentModal");
const addBtn = document.getElementById("addStudentBtn");
const closeBtn = document.querySelector(".close");

addBtn.onclick = () => (modal.style.display = "block");
closeBtn.onclick = () => (modal.style.display = "none");
window.onclick = (e) => { if (e.target === modal) modal.style.display = "none"; };

const form = document.getElementById("addStudentForm");
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const table = document.querySelector(".student-table tbody");
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
            <td>${form.studentId.value}</td>
            <td>${form.fullName.value}</td>
            <td>${form.course.value}</td>
            <td>${form.yearLevel.value}</td>
            <td><span class="status ${form.status.value.toLowerCase()}">${form.status.value}</span></td>
            <td>
                <button class="action-btn view">View</button>
                <button class="action-btn edit">Edit</button>
            </td>
        `;
    table.appendChild(newRow);
    modal.style.display = "none";
    form.reset();
});