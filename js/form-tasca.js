document.addEventListener('DOMContentLoaded', function() {
    const llistaCategories = JSON.parse(localStorage.getItem('categories')) || [];
    const selectCategoria = document.getElementById('categoria');
    selectCategoria.innerHTML = '<option value="">Selecciona una categoria</option>';

    llistaCategories.forEach(categoria => {
        const opcio = document.createElement('option');
        opcio.value = categoria.nom;
        opcio.textContent = categoria.nom;
        selectCategoria.appendChild(opcio);
    });

    document.getElementById('form-tasca').addEventListener('submit', function(event) {
        event.preventDefault();

        const titol = document.getElementById('titol').value.trim();
        const descripcio = document.getElementById('descripcio').value.trim();
        const data = document.getElementById('data').value;
        const categoriaSeleccionada = document.getElementById('categoria').value;
        const prioritat = document.getElementById('prioritat').value;

        if (!titol || !descripcio || !data || !categoriaSeleccionada || !prioritat) {
            alert('Tots els camps són obligatoris.');
            return;
        }

        let ultimIdentificador = parseInt(localStorage.getItem('ultimId')) || 0;
        ultimIdentificador++;
        const nouIdentificador = `tasca-${String(ultimIdentificador).padStart(3, '0')}`;
        localStorage.setItem('ultimId', ultimIdentificador);

        const novaTasca = {
            identificador: nouIdentificador,
            titol: titol,
            descripcio: descripcio,
            data: data,
            categoria: categoriaSeleccionada,
            prioritat: prioritat,
            completada: false
        };

        const llistaTasques = JSON.parse(localStorage.getItem('tasques')) || [];
        llistaTasques.push(novaTasca);
        localStorage.setItem('tasques', JSON.stringify(llistaTasques));

        window.location.href = 'index.html';
    });
});