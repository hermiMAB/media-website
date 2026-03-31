// ============================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ============================================

// Firebase configuration for University Announcement Portal
const firebaseConfig = {
    apiKey: "AIzaSyA0fi27Nm__qULONxjjLzZpS6R9R3zFTRo",
    authDomain: "university-announcement-portal.firebaseapp.com",
    projectId: "university-announcement-portal",
    storageBucket: "university-announcement-portal.firebasestorage.app",
    messagingSenderId: "156934527197",
    appId: "1:156934527197:web:d69b2d2784b3e770406334",
    measurementId: "G-S8N008F1Y6"
};

// Global Firebase references
let app = null;
let auth = null;
let db = null;
let storage = null;
let firebaseReady = false;

// Initialize Firebase
function initializeFirebase() {
    console.log('Initializing Firebase...');
    
    // Check if Firebase SDK is loaded
    if (typeof firebase === 'undefined') {
        console.error('Firebase SDK not loaded yet');
        setTimeout(initializeFirebase, 100);
        return;
    }
    
    try {
        // Initialize only once
        if (app === null) {
            app = firebase.initializeApp(firebaseConfig);
            auth = firebase.auth();
            db = firebase.firestore();
            storage = firebase.storage();
            
            console.log('Firebase initialized successfully');
            console.log('Auth:', !!auth);
            console.log('DB:', !!db);
            console.log('Storage:', !!storage);
            
            // Set up auth state observer
            observeAuthState();
            
            // Mark as ready
            firebaseReady = true;
            window.firebaseReady = true;
            console.log('Firebase ready flag set');
            
            // Dispatch event
            window.dispatchEvent(new Event('firebaseInitialized'));
        }
    } catch (error) {
        console.error('✗ Firebase initialization error:', error);
        setTimeout(initializeFirebase, 100);
    }
}

// ============================================
// AUTH STATE OBSERVER
// ============================================

let currentUser = undefined;
let userRole = undefined;
let authStateResolved = false;

function observeAuthState() {
    if (!auth) {
        console.error('Auth not available yet');
        return;
    }
    
    auth.onAuthStateChanged(async (user) => {
        console.log('[onAuthStateChanged] User state changed:', user ? user.email : 'logged out');
        currentUser = user;
        
        if (user) {
            console.log('User logged in:', user.email);
            console.log('  UID:', user.uid);
            
            // Get user role from Firestore
            try {
                console.log('  Fetching user profile from Firestore...');
                const userDoc = await db.collection('users').doc(user.uid).get();
                console.log('  Firestore query complete. Doc exists:', userDoc.exists);
                
                if (userDoc.exists) {
                    console.log('  User doc data:', userDoc.data());
                    userRole = userDoc.data().role;
                    console.log('User role set to:', userRole);
                } else {
                    console.warn('⚠ User document NOT FOUND in Firestore!');
                    console.warn('  Expected document ID:', user.uid);
                    console.warn('  Check if you created the user profile with the correct UID');
                    userRole = null;
                }
            } catch (error) {
                console.error('✗ Error fetching user role:', error.message);
                console.error('  Error details:', error);
                userRole = null;
            }
        } else {
            console.log('User logged out');
            currentUser = null;
            userRole = null;
        }
        
        authStateResolved = true;
        
        // Let other scripts know auth state changed
        console.log('[authStateChanged event] Dispatching event. currentUser:', currentUser?.email, 'userRole:', userRole);
        window.dispatchEvent(new Event('authStateChanged'));
    });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCurrentUser() {
    return currentUser;
}

function getUserRole() {
    return userRole;
}

function isAdmin() {
    return userRole === 'admin';
}

function isFaculty() {
    return userRole === 'faculty';
}

function isAuthenticated() {
    return currentUser !== null && currentUser !== undefined;
}

function isAuthStateResolved() {
    return authStateResolved;
}

// ============================================
// INITIALIZATION TRIGGER
// ============================================

// Check if Firebase is available, then initialize
function initializeWhenReady() {
    if (typeof firebase !== 'undefined') {
        console.log('Firebase SDK detected, initializing...');
        initializeFirebase();
    } else {
        console.error('Firebase SDK not available');
        // Retry once
        setTimeout(initializeWhenReady, 500);
    }
}

// Initialize immediately (defer ensures SDK is loaded first)
initializeWhenReady();
