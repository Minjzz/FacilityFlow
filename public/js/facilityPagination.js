export function initFacilityPagination(facilitiesData, tableBodyId = 'facility-table-body', paginationId = 'pagination', rowsPerPage = 5) {
    let currentPage = 1;

    function renderTable(page = 1) {
        const tbody = document.getElementById(tableBodyId);
        tbody.innerHTML = '';

        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        const pageFacilities = facilitiesData.slice(start, end);

        if (pageFacilities.length === 0) {
            tbody.innerHTML = `<tr><td colspan="6">No facilities available.</td></tr>`;
            return;
        }

        pageFacilities.forEach(f => {
            let statusBadge = '';
            if(f.status === 'Available') statusBadge = `<span class="badge bg-success">${f.status}</span>`;
            else if(f.status === 'Almost Full') statusBadge = `<span class="badge bg-warning text-dark">${f.status}</span>`;
            else statusBadge = `<span class="badge bg-danger">${f.status}</span>`;

            const actionBtn = f.status === 'Available' ? 
                `<button type="button" class="btn btn-green btn-sm reserve-btn" data-bs-toggle="modal" data-bs-target="#reserveModal" data-facility="${f.name}">Reserve</button>` 
                : 'N/A';

            tbody.innerHTML += `
                <tr>
                    <td>${f.name}</td>
                    <td>${f.type || '-'}</td>
                    <td>${f.capacity || '-'}</td>
                    <td>${f.occupation}</td>
                    <td>${statusBadge}</td>
                    <td>${actionBtn}</td>
                </tr>
            `;
        });

        renderPagination();
    }

    function renderPagination() {
        const pagination = document.getElementById(paginationId);
        pagination.innerHTML = '';

        const pageCount = Math.ceil(facilitiesData.length / rowsPerPage);

        for(let i = 1; i <= pageCount; i++){
            const li = document.createElement('li');
            li.classList.add('page-item');
            if(i === currentPage) li.classList.add('active');

            const a = document.createElement('a');
            a.classList.add('page-link');
            a.href = '#';
            a.innerText = i;
            a.addEventListener('click', function(e){
                e.preventDefault();
                currentPage = i;
                renderTable(currentPage);
            });

            li.appendChild(a);
            pagination.appendChild(li);
        }
    }

    document.addEventListener('DOMContentLoaded', () => renderTable(currentPage));
}
