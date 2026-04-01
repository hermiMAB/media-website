// ============================================
// UTILITY FUNCTIONS
// ============================================

// ============================================
// DATE & TIME FORMATTING
// ============================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
}

// ============================================
// FILE SIZE FORMATTING
// ============================================

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// ============================================
// STRING VALIDATION
// ============================================

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPassword(password) {
    // Minimum 6 characters (you can make this stricter)
    return password && password.length >= 6;
}

function isValidUrl(url) {
    try {
        new URL(url);
        return true;
    } catch (_) {
        return false;
    }
}

// ============================================
// FORM VALIDATION
// ============================================

function validateRequired(value) {
    return value && value.trim().length > 0;
}

function validateMinLength(value, minLength) {
    return value && value.length >= minLength;
}

function validateMaxLength(value, maxLength) {
    return !value || value.length <= maxLength;
}

function validateEmail(email) {
    return isValidEmail(email);
}

// ============================================
// ERROR HANDLING
// ============================================

function getFirebaseErrorMessage(error) {
    const errorMessages = {
        'auth/user-not-found': 'Email not found. Please check and try again.',
        'auth/wrong-password': 'Incorrect password. Please try again.',
        'auth/email-already-in-use': 'Email already registered. Please log in or use another email.',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters.',
        'auth/invalid-email': 'Please enter a valid email address.',
        'auth/operation-not-allowed': 'This operation is not allowed. Please try again.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
        'auth/network-request-failed': 'Network error. Please check your connection.',
    };
    
    return errorMessages[error.code] || error.message || 'An error occurred. Please try again.';
}

// ============================================
// LOCAL STORAGE HELPERS
// ============================================

function saveToLocalStorage(key, value) {
    try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(key, serialized);
        return true;
    } catch (error) {
        console.error('✗ Local storage save error:', error);
        return false;
    }
}

function getFromLocalStorage(key, defaultValue = null) {
    try {
        const value = localStorage.getItem(key);
        return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
        console.error('✗ Local storage get error:', error);
        return defaultValue;
    }
}

function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('✗ Local storage remove error:', error);
        return false;
    }
}

function clearLocalStorage() {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error('✗ Local storage clear error:', error);
        return false;
    }
}

// ============================================
// DOM UTILITIES
// ============================================

function show(element) {
    if (element) element.style.display = '';
}

function hide(element) {
    if (element) element.style.display = 'none';
}

function toggleClass(element, className) {
    if (element) element.classList.toggle(className);
}

function addClass(element, className) {
    if (element) element.classList.add(className);
}

function removeClass(element, className) {
    if (element) element.classList.remove(className);
}

function hasClass(element, className) {
    return element && element.classList.contains(className);
}

// ============================================
// NOTIFICATION / TOAST
// ============================================

function showNotification(message, type = 'info', duration = 5000) {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type}`;
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.top = '1rem';
    notification.style.right = '1rem';
    notification.style.zIndex = '9999';
    notification.style.animation = 'slideIn 0.3s ease-out';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ============================================
// CURRENCY FORMATTING (if needed)
// ============================================

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// ============================================
// QUERY STRING HELPERS
// ============================================

function getQueryParam(paramName) {
    const params = new URLSearchParams(window.location.search);
    return params.get(paramName);
}

function getAllQueryParams() {
    return Object.fromEntries(new URLSearchParams(window.location.search));
}

function setQueryParam(paramName, value) {
    const params = new URLSearchParams(window.location.search);
    params.set(paramName, value);
    window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
}

// ============================================
// DEBOUNCE & THROTTLE
// ============================================

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
// Add this to the bottom of your utils.js
function navigateTo(path, params = {}) {
    const query = Object.keys(params)
        .map(k => `${k}=${encodeURIComponent(params[k])}`)
        .join('&');
    window.location.href = query ? `${path}?${query}` : path;
}

// ============================================
// SHARED LAYOUT NORMALIZATION
// ============================================

function ensureConsistentNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    // Ensure brand always links to home
    const existingBrand = navbar.querySelector('.navbar-brand');
    if (existingBrand && existingBrand.tagName !== 'A') {
        const brandLink = document.createElement('a');
        brandLink.className = existingBrand.className;
        brandLink.href = '/media-website/index.html';
        brandLink.textContent = existingBrand.textContent.trim() || 'University Announcement Portal';
        existingBrand.replaceWith(brandLink);
    } else if (existingBrand && !existingBrand.getAttribute('href')) {
        existingBrand.setAttribute('href', '/index.html');
    }

    // Add Home link to menu-style navbars if missing
    const menu = navbar.querySelector('.navbar-menu');
    if (menu && !menu.querySelector('[data-home-link="true"]')) {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = '/media-website/index.html';
        link.className = 'navbar-link';
        link.textContent = 'Home';
        link.setAttribute('data-home-link', 'true');
        li.appendChild(link);
        menu.insertBefore(li, menu.firstChild);
    }

    // Ensure admin pages have a full navbar menu
    if (window.location.pathname.includes('/admin/')) {
        let adminMenu = navbar.querySelector('.navbar-menu');
        const navbarContainer = navbar.querySelector('.navbar-container') || navbar.querySelector('.navbar-content');

        if (!adminMenu && navbarContainer) {
            // Create a standard admin menu when missing
            adminMenu = document.createElement('ul');
            adminMenu.className = 'navbar-menu';
            adminMenu.id = 'navbar-menu';

            const links = [
                { href: '/admin/dashboard.html', label: 'Dashboard' },
                { href: '/admin/all-submissions.html', label: 'All Submissions' },
                { href: '/admin/approved.html', label: 'Approved' },
                { href: '/admin/settings.html', label: 'Settings' }
            ];

            links.forEach((item) => {
                const li = document.createElement('li');
                const a = document.createElement('a');
                a.href = item.href;
                a.className = 'navbar-link';
                a.textContent = item.label;
                if (window.location.pathname.endsWith(item.href.replace('/admin/', ''))) {
                    a.classList.add('active');
                }
                li.appendChild(a);
                adminMenu.appendChild(li);
            });

            const logoutContainer = navbarContainer.querySelector('.navbar-right');
            if (logoutContainer) {
                navbarContainer.insertBefore(adminMenu, logoutContainer);
            } else {
                navbarContainer.appendChild(adminMenu);
            }
        }
    }
}

function ensureConsistentFooter() {
    const isAuthPage = window.location.pathname.includes('/auth/');
    const hasFooter = !!document.querySelector('footer.footer');
    if (isAuthPage || hasFooter) return;

    const footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML = '<div class="container">University Announcement Portal</div>';
    document.body.appendChild(footer);
}

document.addEventListener('DOMContentLoaded', () => {
    ensureConsistentNavigation();
    ensureConsistentFooter();
});