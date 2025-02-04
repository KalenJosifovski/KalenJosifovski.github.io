document.addEventListener('DOMContentLoaded', function () {
    console.log('Static visualisations: DOM loaded');

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

    // --- Function to Draw Molecule with Highlighted Substructure ---
    function drawMoleculeSubstructureHiglights() {
        var highlightContainer = document.getElementById('highlight-molecule');
        if (highlightContainer && window.RDKit) {
            // Read the SMILES and SMARTS strings from the data attributes
            var smiles = highlightContainer.getAttribute('data-smiles');
            var smarts = highlightContainer.getAttribute('data-smarts');
            try {
                var mol = window.RDKit.get_mol(smiles);
                var qmol = window.RDKit.get_qmol(smarts);
                var mdetails = mol.get_substruct_match(qmol);
                var canvas = document.createElement('canvas');
                canvas.width = 400;
                canvas.height = 300;
                highlightContainer.innerHTML = '';
                highlightContainer.appendChild(canvas);
                mol.draw_to_canvas_with_highlights(canvas, mdetails);
                console.log('Molecule with substructure highlights drawn successfully for SMILES:', smiles);
            } catch (error) {
                console.error('Error drawing highlighted molecule:', error);
            }
        } else {
            console.log('RDKit not ready for highlighted molecule, retrying in 1 second...');
            setTimeout(drawMoleculeSubstructureHiglights, 1000);
        }
    }

    // Wait for RDKit to be ready via the 'rdkit-ready' event
    window.addEventListener('rdkit-ready', function () {
        console.log('RDKit ready event received, drawing molecule...');
        drawMolecule();
        // Also draw the molecule with substructure highlights if the element exists
        if (document.getElementById('highlight-molecule')) {
            drawMoleculeSubstructureHiglights();
        }
    });
    // Fallback in case the event doesn't fire
    setTimeout(function () {
        if (!window.RDKit) {
            console.log('Fallback: Attempting to draw molecule...');
            drawMolecule();
            if (document.getElementById('highlight-molecule')) {
                drawMoleculeSubstructureHiglights();
            }
        }
    }, 2000);

});