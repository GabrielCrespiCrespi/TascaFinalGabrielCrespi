// categories.js
document.addEventListener('DOMContentLoaded', function() {
    const categories = carregarCategories();
    const llistatCategories = document.getElementById('llistat-categories');

    function mostrarCategories() {
        llistatCategories.innerHTML = categories.length === 0 ? '<p>No hi ha categories creades.</p>' : '';
        categories.forEach((cat, index) => {
            const div = document.createElement('div');
            div.className = 'categoria';
            div.innerHTML = `
                <h3>${cat.nom}</h3>
                <p>Color: <span style="background-color: ${cat.color}; padding: 5px;"></span></p>
                <button onclick="eliminarCategoria(${index})" title="Eliminar">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            llistatCategories.appendChild(div);
        });
    }

    document.getElementById('formulari-categoria').addEventListener('submit', function(event) {
        event.preventDefault();
        const nom = document.getElementById('nom-categoria').value.trim();
        const color = document.getElementById('color-categoria').value;

        if (!nom || !color) {
            alert('Introdueix un nom i selecciona un color.');
            return;
        }

        if (categories.some(cat => cat.nom === nom)) {
            alert('Aquesta categoria ja existeix!');
            return;
        }

        categories.push({ nom, color });
        guardarCategories(categories);
        mostrarCategories();
        document.getElementById('formulari-categoria').reset();
    });

    window.eliminarCategoria = function(index) {
        categories.splice(index, 1);
        guardarCategories(categories);
        mostrarCategories();
    };

    mostrarCategories();
});