document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggleBtns = document.querySelectorAll('.sidebar-toggle');
    const themeToggleBtn = document.querySelector('.theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-icon') : null;
    const COLLAPSE_KEY = 'sidebarCollapsed';

    if (sidebar) {
        if (localStorage.getItem(COLLAPSE_KEY) === 'true') {
            sidebar.classList.add('collapsed');
        } else {
            sidebar.classList.remove('collapsed');
        }
    }

    sidebarToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (sidebar) {
                sidebar.classList.toggle('collapsed');
                localStorage.setItem(COLLAPSE_KEY, sidebar.classList.contains('collapsed'));
            }
            if (themeIcon) updateThemeIcon();
        });
    });

    if (sidebar && window.innerWidth <= 768) sidebar.classList.add('collapsed');

    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldUseDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);

    document.body.classList.toggle('dark-theme', shouldUseDark);
    if (themeIcon) updateThemeIcon();

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            if (themeIcon) updateThemeIcon();
        });
    }

    function updateThemeIcon() {
        const isDark = document.body.classList.contains('dark-theme');
        themeIcon.textContent = isDark ? 'light_mode' : 'dark_mode';
    }

    window.toggleDropdown = function () {
        document.getElementById('dropdownMenu').classList.toggle('show');
    };

    updateInsightCards(data);

    function initializeModal() {
        const modal = document.getElementById('editModal');
        const editButtons = document.querySelectorAll('.recent_order td:last-child');
        const closeButtons = document.querySelectorAll('.close-modal');

        editButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const row = button.parentElement;
                populateModal(row);
                modal.classList.add('show');
            });
        });

        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modal.classList.remove('show');
            });
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }

    function populateModal(row) {
        const cells = row.cells;
        document.getElementById('supplierID').value = cells[0].textContent;
        document.getElementById('supplierName').value = cells[1].textContent;
        document.getElementById('contactPerson').value = cells[2].textContent;
        document.getElementById('status').value = cells[3].textContent.toLowerCase();
    }

    initializeModal();
});