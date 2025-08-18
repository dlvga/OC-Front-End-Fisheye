// scripts/ui/likesManager.js
export function initLikes() {
    // Récupère tous les coeurs et compteurs
    const hearts = document.querySelectorAll('.media-card .likes img');
    const likeSpans = document.querySelectorAll('.media-card .likes-count');

    // Map id -> élément compteur
    const idToCountEl = new Map();
    likeSpans.forEach(span => {
        const id = span.closest('.media-card')?.dataset.id;
        if (id) idToCountEl.set(String(id), span);
    });

    // Map id -> état (liké / non-liké)
    const likedStates = new Map();

    // Accessibilité + écouteurs par id
    hearts.forEach(heart => {
        const id = heart.closest('.media-card')?.dataset.id;
        if (!id) return;

        heart.setAttribute('tabindex', '0');
        heart.setAttribute('role', 'button');
        heart.setAttribute('aria-label', 'Ajouter ou retirer un like');
        heart.setAttribute('aria-pressed', 'false');

        const toggle = () => toggleLikeById(String(id), heart);
        heart.addEventListener('click', toggle);
        heart.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });

    function toggleLikeById(id, heartEl) {
        const span = idToCountEl.get(id);
        if (!span) return;

        const current = parseInt(span.textContent, 10) || 0;
        const isLiked = likedStates.get(id) === true;
        const next = isLiked ? current - 1 : current + 1;

        span.textContent = String(next);
        likedStates.set(id, !isLiked);
        if (heartEl) heartEl.setAttribute('aria-pressed', String(!isLiked));

        updateTotalLikes();
    }

    function updateTotalLikes() {
        let total = 0;
        idToCountEl.forEach(span => {
            total += parseInt(span.textContent, 10) || 0;
        });
        const totalEl = document.getElementById('total-likes');
        if (totalEl) totalEl.textContent = String(total);
    }

    updateTotalLikes();
}