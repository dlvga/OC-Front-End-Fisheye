// Gestion du dropdown de tri
export class MediaSortDropdown {
    constructor(triggerSelector, listboxSelector) {
        this.trigger = document.querySelector(triggerSelector);
        this.listbox = document.querySelector(listboxSelector);
        this.options = Array.from(this.listbox.querySelectorAll("[role=option]"));
        this.focusedIndex = this.options.findIndex(opt => opt.getAttribute("aria-selected") === "true");

        this.onSelectionChange = null;
        this.init();
    }

    init() {
        this.attachListeners();
    }

    attachListeners() {
        this.trigger.addEventListener("click", () => this.toggle());
        this.listbox.addEventListener("keydown", (e) => this.handleKeydown(e));

        this.options.forEach((option, index) => {
            option.addEventListener("click", () => this.selectOption(index));
        });
    }

    toggle() {
        const expanded = this.trigger.getAttribute("aria-expanded") === "true";
        this.setExpanded(!expanded);
    }

    setExpanded(open) {
        this.trigger.setAttribute("aria-expanded", String(open));
        this.listbox.hidden = !open;

        if (open) {
            this.options[this.focusedIndex].tabIndex = 0;
            this.options[this.focusedIndex].focus();
        } else {
            this.options.forEach((opt, i) => {
                opt.tabIndex = i === this.focusedIndex ? 0 : -1;
            });
        }
    }

    handleKeydown(e) {
        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                this.moveFocus((this.focusedIndex + 1) % this.options.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                this.moveFocus((this.focusedIndex - 1 + this.options.length) % this.options.length);
                break;
            case "Enter":
                e.preventDefault();
                this.selectOption(this.focusedIndex);
                this.close();
                break;
            case "Escape":
                e.preventDefault();
                this.close();
                break;
        }
    }

    moveFocus(newIndex) {
        if (newIndex === this.focusedIndex) return;

        this.options[this.focusedIndex].tabIndex = -1;
        this.options[newIndex].tabIndex = 0;
        this.options[newIndex].focus();
        this.focusedIndex = newIndex;
    }

    selectOption(index) {
        this.options.forEach((opt, i) => {
            opt.setAttribute("aria-selected", i === index ? "true" : "false");
            opt.tabIndex = i === index ? 0 : -1;
        });

        this.trigger.firstChild.textContent = this.options[index].textContent;
        this.focusedIndex = index;

        // Notifier le changement via callback
        if (this.onSelectionChange) {
            const selectedValue = this.getSortValue(index);
            this.onSelectionChange(selectedValue);
        }
        this.close();
    }

    close() {
        this.setExpanded(false);
        this.trigger.focus();
    }

    getSortValue(index) {
        const mapping = { 0: 'popularity', 1: 'date', 2: 'title' };
        return mapping[index] || 'popularity';
    }
}