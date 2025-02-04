window.addEventListener('load', function () {
    console.log('Checking RDKit availability...');
    
    function initializeRDKit() {
        if (typeof window.initRDKitModule !== 'undefined') {
        console.log('Found RDKit module, initializing...');
        window.initRDKitModule().then(function (RDKit) {
            console.log('RDKit initialized successfully');
            window.RDKit = RDKit;
            window.dispatchEvent(new Event('rdkit-ready'));
        }).catch(function (error) {
            console.error('RDKit initialization failed:', error);
        });
        } else {
        console.log('RDKit module not found, retrying in 1 second...');
        setTimeout(initializeRDKit, 1000);
        }
    }
    initializeRDKit();
});
