/**
 * Gestionnaire du dropdown de tri des médias
 * Implémente un composant dropdown accessible
 */
export class MediaSortDropdown {
    /**
     * Constructeur du dropdown de tri
     * @param {string} triggerSelector - Sélecteur CSS du bouton déclencheur
     * @param {string} listboxSelector - Sélecteur CSS de la liste d'options
     */
    constructor(triggerSelector, listboxSelector) {
        this.trigger = document.querySelector(triggerSelector);
        this.listbox = document.querySelector(listboxSelector);
        this.options = Array.from(this.listbox.querySelectorAll("[role=option]"));
        this.focusedIndex = this.options.findIndex(opt => opt.getAttribute("aria-selected") === "true");

        // Callback appelé lors du changement de sélection
        this.onSelectionChange = null;
        this.init();
    }

    /**
     * Initialise le composant en attachant les event listeners
     * @private
     */
    init() {
        this.attachListeners();
    }

    /**
     * Attache tous les event listeners nécessaires
     * @private
     */
    attachListeners() {
        // Ouverture/fermeture au clic sur le trigger
        this.trigger.addEventListener("click", () => this.toggle());

        // Navigation au clavier dans la listbox
        this.listbox.addEventListener("keydown", (e) => this.handleKeydown(e));

        // Sélection d'une option au clic
        this.options.forEach((option, index) => {
            option.addEventListener("click", () => this.selectOption(index));
        });
    }

    /**
     * Bascule l'état ouvert/fermé du dropdown
     */
    toggle() {
        const expanded = this.trigger.getAttribute("aria-expanded") === "true";
        this.setExpanded(!expanded);
    }

    /**
     * Définit l'état d'expansion du dropdown
     * @param {boolean} open - True pour ouvrir, false pour fermer
     */
    setExpanded(open) {
        // Mise à jour des attributs ARIA
        this.trigger.setAttribute("aria-expanded", String(open));
        this.listbox.hidden = !open;

        if (open) {
            // Focus sur l'option sélectionnée à l'ouverture
            this.options[this.focusedIndex].tabIndex = 0;
            this.options[this.focusedIndex].focus();
        } else {
            // Réinitialisation des tabindex à la fermeture
            this.options.forEach((opt, i) => {
                opt.tabIndex = i === this.focusedIndex ? 0 : -1;
            });
        }
    }

    /**
     * Gère la navigation au clavier dans le dropdown
     * @param {KeyboardEvent} e - Événement clavier
     */
    handleKeydown(e) {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                // Navigation vers le bas (avec bouclage)
                this.moveFocus((this.focusedIndex + 1) % this.options.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                // Navigation vers le haut (avec bouclage)
                this.moveFocus((this.focusedIndex - 1 + this.options.length) % this.options.length);
                break;
            case "Enter":
                e.preventDefault();
                // Sélection de l'option focalisée
                this.selectOption(this.focusedIndex);
                this.close();
                break;
            case "Escape":
                e.preventDefault();
                // Fermeture du dropdown
                this.close();
                break;
        }
    }

    /**
     * Déplace le focus vers une nouvelle option
     * @param {number} newIndex - Index de la nouvelle option à focaliser
     */
    moveFocus(newIndex) {
        if (newIndex === this.focusedIndex) return;

        // Retrait du focus de l'option actuelle
        this.options[this.focusedIndex].tabIndex = -1;

        // Attribution du focus à la nouvelle option
        this.options[newIndex].tabIndex = 0;
        this.options[newIndex].focus();
        this.focusedIndex = newIndex;
    }

    /**
     * Sélectionne une option et met à jour l'interface
     * @param {number} index - Index de l'option à sélectionner
     */
    selectOption(index) {
        // Mise à jour des attributs aria-selected
        this.options.forEach((opt, i) => {
            opt.setAttribute("aria-selected", i === index ? "true" : "false");
            opt.tabIndex = i === index ? 0 : -1;
        });

        // Mise à jour du texte du bouton trigger
        this.trigger.firstChild.textContent = this.options[index].textContent;
        this.focusedIndex = index;

        // Notification du changement via callback
        if (this.onSelectionChange) {
            const selectedValue = this.getSortValue(index);
            this.onSelectionChange(selectedValue);
        }
        this.close();
    }

    /**
     * Ferme le dropdown et remet le focus sur le trigger
     */
    close() {
        this.setExpanded(false);
        this.trigger.focus();
    }

    /**
     * Convertit l'index de sélection en valeur de tri
     * @param {number} index - Index de l'option sélectionnée
     * @returns {string} Valeur de tri correspondante
     */
    getSortValue(index) {
        const mapping = { 0: 'popularity', 1: 'date', 2: 'title' };
        return mapping[index] || 'popularity';
    }
}