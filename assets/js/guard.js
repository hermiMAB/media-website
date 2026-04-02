// ============================================
// PAGE PROTECTION & REDIRECTS
// ============================================

function protectPageAsAdmin() {
    // Wait for auth state to be determined (including role from Firestore)
    return waitForAuth().then(() => {
        console.log('[protectPageAsAdmin] Check - authenticated:', isAuthenticated(), 'isAdmin:', isAdmin());
        
        // Must be logged in AND be admin
        if (!isAuthenticated()) {
            console.warn('[protectPageAsAdmin] ✗ Not authenticated, redirecting to login');
            window.location.href = '../auth/login.html';
            return false;
        }
        
        if (!isAdmin()) {
            console.warn('[protectPageAsAdmin] ✗ Not admin, redirecting to user dashboard');
            window.location.href = './user/dashboard.html';
            return false;
        }
        
        console.log('[protectPageAsAdmin] Access granted');
        return true;
    });
}

function protectPageAsFaculty() {
    // Wait for auth state to be determined (including role from Firestore)
    return waitForAuth().then(() => {
        console.log('[protectPageAsFaculty] Check - authenticated:', isAuthenticated(), 'isFaculty:', isFaculty(), 'isAdmin:', isAdmin());
        
        // Must be logged in
        if (!isAuthenticated()) {
            console.warn('[protectPageAsFaculty] ✗ Not authenticated, redirecting to login');
            window.location.href = '../auth/login.html';
            return false;
        }

        // Faculty or admin can access faculty pages
        if (!isFaculty() && !isAdmin()) {
            console.warn('[protectPageAsFaculty] ✗ Invalid role, redirecting to login');
            window.location.href = '../auth/login.html';
            return false;
        }
        
        console.log('[protectPageAsFaculty] Access granted');
        return true;
    });
}

function protectPageAsAuthenticated() {
    // Wait for auth state
    return waitForAuth().then(() => {
        console.log('[protectPageAsAuthenticated] Check - authenticated:', isAuthenticated());
        
        // Just need to be logged in
        if (!isAuthenticated()) {
            console.warn('[protectPageAsAuthenticated] ✗ Not authenticated, redirecting to login');
            window.location.href = '../auth/login.html';
            return false;
        }
        
        console.log('[protectPageAsAuthenticated] Access granted');
        return true;
    });
}

// Helper function to wait for auth state + role to load
function waitForAuth() {
    return new Promise((resolve) => {
        let attempts = 0;
        const checkAuth = setInterval(() => {
            attempts++;
            console.log(`[waitForAuth] Attempt ${attempts}/50 - currentUser:`, currentUser?.email, 'userRole:', userRole);
            
            // Wait until Firebase auth observer has resolved at least once.
            // If logged in, also wait until role loading has completed.
            const hasResolvedAuthState = typeof isAuthStateResolved === 'function' && isAuthStateResolved();
            const hasAuth = hasResolvedAuthState && (currentUser === null || userRole !== undefined);
            
            if (hasAuth) {
                clearInterval(checkAuth);
                console.log('[waitForAuth] Auth ready:',  { currentUser: currentUser?.email, userRole });
                resolve();
            } else if (attempts > 50) {
                // Timeout after 5 seconds
                clearInterval(checkAuth);
                console.warn('[waitForAuth] ✗ Timeout! Proceeding anyway. State:', { currentUser: currentUser?.email, userRole });
                resolve();
            }
        }, 100);
    });
}

function redirectIfAuthenticated() {
    // Check if already logged in
    if (currentUser !== null && userRole) {
        if (isAdmin()) {
            window.location.href = '../admin/dashboard.html';
        } else {
            window.location.href = '../user/dashboard.html';
        }
        return true;
    }
    return false;
}

// ============================================
// LISTEN FOR AUTH STATE CHANGES
// ============================================

window.addEventListener('authStateChanged', () => {
    // Update UI elements based on auth state
    updateAuthUI();
});

function updateAuthUI() {
    const authElements = document.querySelectorAll('[data-auth-required]');
    const unauthElements = document.querySelectorAll('[data-unauth-required]');
    const adminElements = document.querySelectorAll('[data-admin-required]');
    const facultyElements = document.querySelectorAll('[data-faculty-required]');
    
    // Show/hide elements based on auth state
    authElements.forEach(el => {
        el.style.display = isAuthenticated() ? 'block' : 'none';
    });
    
    unauthElements.forEach(el => {
        el.style.display = isAuthenticated() ? 'none' : 'block';
    });
    
    adminElements.forEach(el => {
        el.style.display = isAdmin() ? 'block' : 'none';
    });
    
    facultyElements.forEach(el => {
        el.style.display = isFaculty() ? 'block' : 'none';
    });
    
    // Update user info if element exists
    const userNameEl = document.getElementById('user-name');
    if (userNameEl && currentUser) {
        userNameEl.textContent = currentUser.email.split('@')[0];
    }
}

// ============================================
// INIT ON PAGE LOAD
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for auth state to be determined
    setTimeout(() => {
        updateAuthUI();
    }, 100);
});
