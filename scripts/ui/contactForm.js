/**
 * Gestionnaire de la modale de contact accessible
 * Implémente le focus trap, la validation de formulaire et la gestion ARIA
 */

import {createFocusTrap, focusElement, restoreFocus} from '../utils/focusTrap.js';

// Constantes pour les identifiants et sélecteurs de la modale
const MODAL_ID = 'contact_modal';
const NAME_SPAN_ID = 'contact_modal_photographer_name';
const OPEN_BTN_CLASS = 'contact_button';
const CLOSE_BTN_ID = 'close_modal_btn';
const FORM_ID = 'contact_form';

// Variables globales pour la gestion du focus et du focus trap
let lastFocusedElement = null;
let focusTrapCleanup = null;

/**
 * Met à jour dynamiquement le nom du photographe dans le titre de la modale
 * Récupère le nom depuis le header de la page photographe
 */
function updateModalTitle() {
    const nameSpan = document.getElementById(NAME_SPAN_ID);
    if (!nameSpan) return;

    // Source du nom : titre dans le header du photographe
    const photographerTitleElement = document.querySelector('.photographer-header .photographer-title');
    const photographerName = photographerTitleElement?.textContent?.trim();

    // Mise à jour uniquement si le nom a changé (optimisation)
    if (photographerName && photographerName !== nameSpan.textContent) {
        nameSpan.textContent = photographerName;
    }
}

/**
 * Masque ou affiche le contenu principal de la page via aria-hidden
 * Nécessaire pour l'accessibilité : seule la modale doit être perçue par les lecteurs d'écran
 * @param {boolean} hideMainContent - true pour masquer le contenu principal, false pour l'afficher
 */
function toggleMainContent(hideMainContent) {
    // Éléments principaux à masquer quand la modale est ouverte
    const pageHeader = document.querySelector('body > header');
    const mainContent = document.getElementById('main');
    const photographerStats = document.querySelector('.photographer-stats');

    /**
     * Utilitaire pour définir ou supprimer aria-hidden sur un élément
     * @param {HTMLElement|null} element - Élément à modifier
     * @param {boolean} shouldHide - État à appliquer
     */
    const setAriaHidden = (element, shouldHide) => {
        if (!element) return;

        if (shouldHide) {
            element.setAttribute('aria-hidden', 'true');
        } else {
            element.removeAttribute('aria-hidden');
        }
    };

    // Application de l'état d'accessibilité sur tous les éléments principaux
    setAriaHidden(pageHeader, hideMainContent);
    setAriaHidden(mainContent, hideMainContent);
    setAriaHidden(photographerStats, hideMainContent);
}

/**
 * Ouvre la modale de contact avec toutes les mesures d'accessibilité
 * @param {HTMLElement} modalElement - Élément racine de la modale
 */
function openModal(modalElement) {
    // Sauvegarde de l'élément ayant le focus avant ouverture (pour restauration à la fermeture)
    lastFocusedElement = document.activeElement;

    // Mise à jour du titre avec le nom du photographe actuel
    updateModalTitle();

    // Changement des classes CSS pour l'animation et la visibilité
    modalElement.classList.remove('hidden');
    modalElement.classList.add('visible');
    modalElement.setAttribute('aria-hidden', 'false');

    // Masquage du contenu principal pour les lecteurs d'écran
    toggleMainContent(true);

    // Prévention du scroll de la page en arrière-plan
    document.body.style.overflow = 'hidden';

    // Focus initial sur le bouton de fermeture
    focusElement(`#${CLOSE_BTN_ID}`, modalElement);

    // Création du focus trap pour confiner la navigation clavier dans la modale
    focusTrapCleanup = createFocusTrap(modalElement, {
        onEscape: () => closeModal(modalElement)
    });
}

/**
 * Ferme la modale et restaure l'état initial de la page
 * @param {HTMLElement} modalElement - Élément racine de la modale
 */
function closeModal(modalElement) {
    // Animation de fermeture via les classes CSS
    modalElement.classList.remove('visible');
    modalElement.classList.add('hidden');
    modalElement.setAttribute('aria-hidden', 'true');

    // Restauration du scroll normal de la page
    document.body.style.overflow = '';

    // Réaffichage du contenu principal pour les lecteurs d'écran
    toggleMainContent(false);

    // Destruction du focus trap pour libérer la navigation clavier
    if (focusTrapCleanup) {
        focusTrapCleanup();
        focusTrapCleanup = null;
    }

    // Restauration du focus sur l'élément qui avait ouvert la modale
    restoreFocus(lastFocusedElement);
}

/**
 * Remet à zéro l'état d'erreur de tous les champs du formulaire
 * @param {HTMLFormElement} formElement - Formulaire à réinitialiser
 * @param {string[]} fieldNames - Liste des noms des champs à nettoyer
 */
function resetFormErrors(formElement, fieldNames) {
    fieldNames.forEach((fieldName) => {
        const inputField = formElement?.[fieldName];
        const errorMessageElement = document.getElementById(`error_${fieldName}`);

        // Suppression du message d'erreur affiché
        if (errorMessageElement) {
            errorMessageElement.textContent = '';
        }

        // Suppression des classes et attributs d'erreur sur le champ
        if (inputField instanceof HTMLElement) {
            inputField.classList.remove('error');
            inputField.setAttribute('aria-invalid', 'false');
        }
    });
}

/**
 * Valide un champ individuel et met à jour son affichage d'erreur
 * @param {HTMLFormElement} formElement - Formulaire contenant le champ
 * @param {string} fieldName - Nom du champ à valider
 * @param {function} validatorFunction - Fonction qui retourne un message d'erreur ou null
 * @returns {boolean} true si le champ est valide, false sinon
 */
function validateField(formElement, fieldName, validatorFunction) {
    const inputField = formElement?.[fieldName];
    const errorDisplayElement = document.getElementById(`error_${fieldName}`);

    // Vérification de l'existence des éléments nécessaires
    if (!(inputField instanceof HTMLElement) || !errorDisplayElement) {
        return true; // Considéré comme valide si les éléments sont manquants
    }

    // Exécution de la validation sur la valeur actuelle du champ
    const validationErrorMessage = validatorFunction(inputField.value);

    if (validationErrorMessage) {
        // État d'erreur : affichage du message et classes CSS
        errorDisplayElement.textContent = validationErrorMessage;
        inputField.classList.add('error');
        inputField.setAttribute('aria-invalid', 'true');
        return false;
    } else {
        // État valide : suppression des indicateurs d'erreur
        errorDisplayElement.textContent = '';
        inputField.classList.remove('error');
        inputField.setAttribute('aria-invalid', 'false');
        return true;
    }
}

/**
 * Initialise la modale de contact et configure tous les event listeners
 * Point d'entrée principal pour activer la fonctionnalité de contact
 */
export function initContactForm() {
    // Récupération de tous les éléments DOM nécessaires
    const contactModal = document.getElementById(MODAL_ID);
    const openContactButton = document.body.querySelector(`.${OPEN_BTN_CLASS}`);
    const closeModalButton = document.getElementById(CLOSE_BTN_ID);
    const contactFormElement = document.getElementById(FORM_ID);

    // Vérification de l'existence des éléments critiques
    if (!contactModal || !closeModalButton || !contactFormElement) {
        console.warn('Contact form: Éléments manquants dans le DOM');
        return;
    }

    // Configuration des validateurs pour chaque champ du formulaire
    const emailValidationRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const fieldValidators = {
        first_name: (value) => (value.trim() ? null : 'Le prénom est requis.'),
        last_name: (value) => (value.trim() ? null : 'Le nom est requis.'),
        email: (value) => {
            if (!value.trim()) return 'L\'email est requis.';
            if (!emailValidationRegex.test(value)) return 'Format d\'email invalide.';
            return null;
        },
        message: (value) => (value.trim() ? null : 'Le message est requis.')
    };

    const formFieldNames = Object.keys(fieldValidators);

    // Event listener pour l'ouverture de la modale
    if (openContactButton) {
        openContactButton.addEventListener('click', (clickEvent) => {
            clickEvent.preventDefault();
            openModal(contactModal);
        });
    }

    // Event listener pour la fermeture de la modale
    closeModalButton.addEventListener('click', () => closeModal(contactModal));

    // Event listener pour la soumission du formulaire avec validation complète
    contactFormElement.addEventListener('submit', (submitEvent) => {
        submitEvent.preventDefault();

        // Réinitialisation de l'état d'erreur avant nouvelle validation
        resetFormErrors(contactFormElement, formFieldNames);

        // Variables pour suivre l'état de validation globale
        let isFormValid = true;
        let firstFieldWithError = null;

        // Validation de chaque champ individuellement
        formFieldNames.forEach((fieldName) => {
            const isFieldValid = validateField(contactFormElement, fieldName, fieldValidators[fieldName]);

            // Mémorisation du premier champ en erreur pour le focus
            if (!isFieldValid && !firstFieldWithError) {
                firstFieldWithError = contactFormElement[fieldName];
            }

            // Le formulaire n'est valide que si tous les champs le sont
            isFormValid = isFormValid && isFieldValid;
        });

        // Gestion du cas d'erreur : focus sur le premier champ invalide
        if (!isFormValid) {
            if (firstFieldWithError instanceof HTMLElement) {
                firstFieldWithError.focus();
            }
            return;
        }

        // Formulaire valide : extraction et traitement des données
        const formData = {
            firstName: contactFormElement.first_name.value.trim(),
            lastName: contactFormElement.last_name.value.trim(),
            email: contactFormElement.email.value.trim(),
            message: contactFormElement.message.value.trim()
        };

        // Simulation d'envoi (en production, appel API ici)
        console.log('Données du formulaire de contact soumises:', formData);

        // Nettoyage et fermeture après soumission réussie
        contactFormElement.reset();
        closeModal(contactModal);
    });
}