(function () {
    'use strict';
    const searchTermRepl = nodecg.Replicant('search-term');

    class OwlSearchTerm extends Polymer.Element {
        static get is() {
            return 'owl-search-term';
        }

        ready() {
            super.ready();
            searchTermRepl.on('change', value => {
                this.searchTerm = value;
            });
        }

        update() {
            searchTermRepl.value = this.searchTerm;
        }
    }
    customElements.define(OwlSearchTerm.is, OwlSearchTerm);
})();