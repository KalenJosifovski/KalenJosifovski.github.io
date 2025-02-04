document.addEventListener('DOMContentLoaded', function () {
    console.log('Static visualisations: DOM loaded');

    // --- Protein Visualisation using 3Dmol.js ---
    var proteinContainer = document.getElementById('protein-viewer');
    if (proteinContainer) {
        // Read the PDB ID from the data attribute
        var pdbId = proteinContainer.getAttribute('data-pdb-id');
        var viewer = $3Dmol.createViewer(proteinContainer, { backgroundColor: 'white' });
        var pdbUri = 'https://files.rcsb.org/view/' + pdbId + '.pdb';
        jQuery.ajax(pdbUri, {
            success: function (data) {
                viewer.addModel(data, 'pdb');
                viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
                viewer.zoomTo();
                viewer.render();
                console.log('3Dmol viewer rendered for protein:', pdbId);
            },
            error: function (error) {
                console.error('Failed to load PDB:', error);
            }
        });
    }

    // --- Molecule Visualisation using RDKit ---
    function drawMolecule() {
        var moleculeContainer = document.getElementById('molecule-container');
        if (moleculeContainer && window.RDKit) {
            // Read the SMILES string from the data attribute
            var smiles = moleculeContainer.getAttribute('data-smiles');
            try {
                var mol = window.RDKit.get_mol(smiles);
                if (mol) {
                    var canvas = document.createElement('canvas');
                    canvas.width = 400;
                    canvas.height = 300;
                    moleculeContainer.innerHTML = '';
                    moleculeContainer.appendChild(canvas);
                    mol.draw_to_canvas(canvas, canvas.width, canvas.height);
                    console.log('Molecule drawn successfully for SMILES:', smiles);
                } else {
                    console.error('Failed to create molecule from SMILES');
                }
            } catch (error) {
                console.error('Error drawing molecule:', error);
            }
        } else {
            console.log('RDKit not ready, retrying in 1 second...');
            setTimeout(drawMolecule, 1000);
        }
    }
    // Wait for RDKit to be ready via the 'rdkit-ready' event
    window.addEventListener('rdkit-ready', function () {
        console.log('RDKit ready event received, drawing molecule...');
        drawMolecule();
    });
    // Fallback in case the event doesn't fire
    setTimeout(function () {
        if (!window.RDKit) {
            console.log('Fallback: Attempting to draw molecule...');
            drawMolecule();
        }
    }, 2000);

    // --- Interactive Plot using Plotly ---
    var plotlyContainer = document.getElementById('plotly-chart');
    if (plotlyContainer) {
        Plotly.newPlot('plotly-chart', [{
            x: [1, 2, 3, 4],
            y: [10, 15, 13, 17],
            type: 'scatter'
        }]);
        console.log('Plotly chart rendered');
    }
});