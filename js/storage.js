// storage.js
function guardarTasques(tasques) {
    localStorage.setItem('tasques', JSON.stringify(tasques));
}

function carregarTasques() {
    return JSON.parse(localStorage.getItem('tasques')) || [];
}

function guardarCategories(categories) {
    localStorage.setItem('categories', JSON.stringify(categories));
}

function carregarCategories() {
    return JSON.parse(localStorage.getItem('categories')) || [];
}

function obtenirUltimId() {
    return parseInt(localStorage.getItem('ultimId')) || 0;
}

function guardarUltimId(id) {
    localStorage.setItem('ultimId', id);
}