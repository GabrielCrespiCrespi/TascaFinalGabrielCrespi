document.addEventListener('DOMContentLoaded', async function() {
    let tasques = JSON.parse(localStorage.getItem('tasques')) || [];
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    let tasquesFiltrades = [...tasques];
    if (tasques.length === 0) {
        tasques = [
            { id: 1, titol: "Tasca 1", descripcio: "Descripció 1", data: "2025-01-15", prioritat: "Alta", categoria: "General", realitzada: true },
            { id: 2, titol: "Tasca 2", descripcio: "Descripció 2", data: "2025-03-10", prioritat: "Mitjana", categoria: "General", realitzada: true },
            { id: 3, titol: "Tasca 3", descripcio: "Descripció 3", data: "2025-06-20", prioritat: "Baixa", categoria: "General", realitzada: true },
        ];
        localStorage.setItem('tasques', JSON.stringify(tasques));
        tasquesFiltrades = [...tasques];
    }
    try {
        const resposta1 = await fetch('dades/activitats_001.json');
        const json1 = await resposta1.json();
        const resposta2 = await fetch('dades/activitats_002.json');
        const json2 = await resposta2.json();
        const tasquesJSON = [...json1, ...json2];
        tasquesJSON.forEach(tascaJSON => {
            if (!tasques.some(t => t.id === tascaJSON.id)) {
                tasques.push(tascaJSON);
            }
        });
        localStorage.setItem('tasques', JSON.stringify(tasques));
        tasquesFiltrades = [...tasques];
    } catch (error) {
        console.warn('No s\'han pogut carregar els arxius JSON, utilitzant dades inicials:', error);
    }
    const llistatActivitats = document.getElementById('llistat-activitats');
    const llistatActivitatsAcabades = document.getElementById('llistat-activitats-acabades');
    if (!llistatActivitats || !llistatActivitatsAcabades) {
        console.error('No es troben els elements #llistat-activitats o #llistat-activitats-acabades');
        return;
    }
    mostrarTasques();
    function mostrarTasques() {
        const tasquesPendents = tasquesFiltrades.filter(tasca => !tasca.realitzada);
        const tasquesAcabades = tasquesFiltrades.filter(tasca => tasca.realitzada);
        llistatActivitats.innerHTML = '';
        if (tasquesPendents.length === 0) {
            llistatActivitats.innerHTML = '<p>No hi ha tasques pendents.</p>';
        } else {
            tasquesPendents.forEach((tasca, index) => {
                const nomCategoria = typeof tasca.categoria === 'string' ? tasca.categoria : tasca.categoria.nom;
                const categoriaObj = categories.find(cat => cat.nom === nomCategoria) || (typeof tasca.categoria === 'object' ? tasca.categoria : null);
                const colorCategoria = categoriaObj ? categoriaObj.color : '#ffffff';
                const div = document.createElement('div');
                div.className = 'tasca';
                div.style.backgroundColor = colorCategoria;
                div.innerHTML = `
                    <div class="info-tasca">
                        <h3>${tasca.titol}</h3>
                        <p>${tasca.descripcio}</p>
                        <p>${tasca.data}</p>
                    </div>
                    <div>
                        <span class="prioritat prioritat-${tasca.prioritat}">${tasca.prioritat}</span>
                        <button class="marcar-realitzada" onclick="marcarComRealitzada(${index})" title="Marcar com Realitzada">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="eliminar" onclick="eliminarTasca(${index})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                llistatActivitats.appendChild(div);
            });
        }
        llistatActivitatsAcabades.innerHTML = '';
        if (tasquesAcabades.length === 0) {
            llistatActivitatsAcabades.innerHTML = '<p>No hi ha tasques acabades.</p>';
        } else {
            tasquesAcabades.forEach((tasca, index) => {
                const nomCategoria = typeof tasca.categoria === 'string' ? tasca.categoria : tasca.categoria.nom;
                const categoriaObj = categories.find(cat => cat.nom === nomCategoria) || (typeof tasca.categoria === 'object' ? tasca.categoria : null);
                const colorCategoria = categoriaObj ? categoriaObj.color : '#ffffff';
                const div = document.createElement('div');
                div.className = 'tasca';
                div.style.backgroundColor = colorCategoria;
                div.innerHTML = `
                    <div class="info-tasca">
                        <h3>${tasca.titol}</h3>
                        <p>${tasca.descripcio}</p>
                        <p>${tasca.data}</p>
                    </div>
                    <div>
                        <span class="prioritat prioritat-${tasca.prioritat}">${tasca.prioritat}</span>
                        <button class="eliminar" onclick="eliminarTasca(${index})" title="Eliminar">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `;
                llistatActivitatsAcabades.appendChild(div);
            });
        }
        console.log('Actualitzant gràfic des de index.js...');
        actualitzarGrafic();
    }
    window.marcarComRealitzada = function(index) {
        tasques[index].realitzada = true;
        localStorage.setItem('tasques', JSON.stringify(tasques));
        tasquesFiltrades = [...tasques];
        cercarTasques(document.getElementById('cercar-tasques').value);
    };
    window.eliminarTasca = function(index) {
        tasques.splice(index, 1);
        localStorage.setItem('tasques', JSON.stringify(tasques));
        tasquesFiltrades = [...tasques];
        cercarTasques(document.getElementById('cercar-tasques').value);
    };
    window.pujarTasques = function(event) {
        const fitxer = event.target.files[0];
        if (!fitxer) return;
        const lector = new FileReader();
        lector.onload = function(e) {
            try {
                const tasquesNoves = JSON.parse(e.target.result);
                if (!Array.isArray(tasquesNoves)) {
                    alert('L\'arxiu JSON no té el format correcte. Ha de ser un array de tasques.');
                    return;
                }
                tasquesNoves.forEach(tasca => {
                    if (!tasques.some(t => t.id === tasca.id)) {
                        tasques.push(tasca);
                    }
                });
                localStorage.setItem('tasques', JSON.stringify(tasques));
                tasquesFiltrades = [...tasques];
                cercarTasques(document.getElementById('cercar-tasques').value);
            } catch (error) {
                alert('Error llegint l\'arxiu JSON: ' + error.message);
            }
        };
        lector.readAsText(fitxer);
    };
    window.cercarTasques = function(consulta) {
        consulta = consulta.toLowerCase();
        tasquesFiltrades = tasques.filter(tasca => 
            tasca.titol.toLowerCase().includes(consulta) || 
            tasca.descripcio.toLowerCase().includes(consulta)
        );
        mostrarTasques();
    };
});