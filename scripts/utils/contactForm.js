// scripts/utils/contactForm.js

/**
 * Modale de contact accessible (focus management, trap focus, validation).
 * Conçu pour respecter les bonnes pratiques d’accessibilité
 */

const MODAL_ID = 'contact_modal';
const NAME_SPAN_ID = 'contact_modal_photographer_name';
const OPEN_BTN_CLASS = 'contact_button';
const CLOSE_BTN_ID = 'close_modal_btn';
const FORM_ID = 'contact_form';

let lastFocusedElement = null;
let trapFocusHandler = null;

/**
 * Met à jour le nom du photographe dans le titre de la modale.
 */
function updateModalTitle() {
    const nameSpan = document.getElementById(NAME_SPAN_ID);
    if (!nameSpan) return;

    const source = document.querySelector('.photographer-header .photographer-title');
    const name = source?.textContent?.trim();

    if (name && name !== nameSpan.textContent) {
        nameSpan.textContent = name;
    }
}

/**
 * Alterne l’exposition du contenu hors modale via aria-hidden.
 * Cible le header de page uniquement.
 * @param {boolean} hide - true pour masquer le contenu hors modale.
 */
function toggleMainContent(hide) {
    const pageHeader = document.querySelector('body > header');
    const main = document.getElementById('main');
    const stats = document.querySelector('.photographer-stats');

    const setHidden = (el, hidden) => {
        if (!el) return;
        if (hidden) el.setAttribute('aria-hidden', 'true');
        else el.removeAttribute('aria-hidden');
    };

    setHidden(pageHeader, hide);
    setHidden(main, hide);
    setHidden(stats, hide);
}

/**
 * Ouvre la modale de contact avec gestion du focus et du scroll.
 * @param {HTMLElement} modal - Élément racine de la modale.
 */
function openModal(modal) {
    lastFocusedElement = document.activeElement;
    updateModalTitle();

    modal.classList.remove('hidden');
    modal.classList.add('visible');
    modal.setAttribute('aria-hidden', 'false');

    toggleMainContent(true);
    document.body.style.overflow = 'hidden';

    const firstField = modal.querySelector('input, textarea, select, button');
    if (firstField instanceof HTMLElement) firstField.focus();

    trapFocus(modal);
}

/**
 * Ferme la modale, restaure le contenu et le focus précédent.
 * @param {HTMLElement} modal - Élément racine de la modale.
 */
function closeModal(modal) {
    modal.classList.remove('visible');
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');

    document.body.style.overflow = '';
    toggleMainContent(false);

    if (trapFocusHandler) {
        modal.removeEventListener('keydown', trapFocusHandler);
        trapFocusHandler = null;
    }

    if (lastFocusedElement instanceof HTMLElement && document.contains(lastFocusedElement)) {
        lastFocusedElement.focus();
    }
}

/**
 * Confine le focus dans la modale et permet la fermeture via Échap.
 * @param {HTMLElement} modal - Élément racine de la modale.
 */
function trapFocus(modal) {
    const selectors = [
        'a[href]',
        'button:not([disabled])',
        'input:not([disabled])',
        'textarea:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])'
    ];
    const focusable = Array.from(modal.querySelectorAll(selectors.join(',')));
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    /**
     * @param {KeyboardEvent} e
     */
    function onKeyDown(e) {
        if (e.key === 'Tab') {
            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            closeModal(modal);
        }
    }

    trapFocusHandler = onKeyDown;
    modal.addEventListener('keydown', trapFocusHandler);
}

/**
 * Réinitialise les messages et états d’erreur des champs.
 * @param {HTMLFormElement} form - Le formulaire.
 * @param {string[]} fieldNames - Liste des noms de champs à réinitialiser.
 */
function resetFormErrors(form, fieldNames) {
    fieldNames.forEach((name) => {
        const field = form?.[name];
        const err = document.getElementById(`error_${name}`);
        if (err) err.textContent = '';
        if (field instanceof HTMLElement) {
            field.classList.remove('error');
            field.setAttribute('aria-invalid', 'false');
        }
    });
}

/**
 * Valide un champ et met à jour son message d’erreur et son état.
 * @param {HTMLFormElement} form - Le formulaire.
 * @param {string} fieldName - Nom du champ à valider.
 * @param {(value: string) => (string|null)} validator - Retourne un message d’erreur ou null.
 * @returns {boolean} true si le champ est valide, sinon false.
 */
function validateField(form, fieldName, validator) {
    const field = form?.[fieldName];
    const errorEl = document.getElementById(`error_${fieldName}`);
    if (!(field instanceof HTMLElement) || !errorEl) return true;

    const errorMsg = validator(field.value);
    if (errorMsg) {
        errorEl.textContent = errorMsg;
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        return false;
    } else {
        errorEl.textContent = '';
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        return true;
    }
}

/**
 * Initialise la modale et la validation du formulaire de contact.
 */
export function initContactForm() {
    const modal = document.getElementById(MODAL_ID);
    const openBtn = document.body.querySelector(`.${OPEN_BTN_CLASS}`);
    const closeBtn = document.getElementById(CLOSE_BTN_ID);
    const form = document.getElementById(FORM_ID);

    if (!modal || !closeBtn || !form) return;

    // Validateurs
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const validators = {
        first_name: (v) => (v.trim() ? null : 'Le prénom est requis.'),
        last_name: (v) => (v.trim() ? null : 'Le nom est requis.'),
        email: (v) =>
            !v.trim()
                ? 'L\'email est requis.'
                : !emailRegex.test(v)
                    ? 'Format d\'email invalide.'
                    : null,
        message: (v) => (v.trim() ? null : 'Le message est requis.')
    };
    const fieldNames = Object.keys(validators);

    if (openBtn) {
        openBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
        });
    }

    closeBtn.addEventListener('click', () => closeModal(modal));

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        resetFormErrors(form, fieldNames);

        let valid = true;
        let firstErrorField = null;

        fieldNames.forEach((name) => {
            const ok = validateField(form, name, validators[name]);
            if (!ok && !firstErrorField) firstErrorField = form[name];
            valid = valid && ok;
        });

        if (!valid) {
            if (firstErrorField instanceof HTMLElement) firstErrorField.focus();
            return;
        }

        const data = {
            firstName: form.first_name.value.trim(),
            lastName: form.last_name.value.trim(),
            email: form.email.value.trim(),
            message: form.message.value.trim()
        };
        console.log('Contact form submitted:', data);

        form.reset();
        closeModal(modal);
    });
}