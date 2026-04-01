// ============================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ============================================

const firebaseConfig = {
    apiKey: "AIzaSyA0fi27Nm__qULONxjjLzZpS6R9R3zFTRo",
    authDomain: "university-announcement-portal.firebaseapp.com",
    projectId: "university-announcement-portal",
    storageBucket: "university-announcement-portal.firebasestorage.app",
    messagingSenderId: "156934527197",
    appId: "1:156934527197:web:d69b2d2784b3e770406334"
};

// Initialize Firebase directly
firebase.initializeApp(firebaseConfig);

const auth    = firebase.auth();
const db      = firebase.firestore();
const storage = firebase.storage();

console.log('✓ Firebase initialized');
console.log('✓ Auth:', !!auth);
console.log('✓ DB:', !!db);

// ============================================
// USER STATE
// ============================================

let currentUser = null;
let userRole    = null;

auth.onAuthStateChanged(async (user) => {
    currentUser = user;
    userRole    = null;

    if (user) {
        console.log('✓ Logged in:', user.email, '| UID:', user.uid);
        try {
            const userDoc = await db.collection('users').doc(user.uid).get();
            if (userDoc.exists) {
                userRole = userDoc.data().role;
                console.log('✓ Role:', userRole);
            } else {
                console.warn('⚠ No Firestore document for UID:', user.uid);
                console.warn('  Go to Firebase Console → Firestore → users collection');
                console.warn('  Create a document with ID =', user.uid);
                console.warn('  Add field: role = "admin" or "faculty"');
            }
        } catch (err) {
            console.error('✗ Error fetching role:', err.message);
        }
    } else {
        console.log('✓ No user logged in');
    }

    window.dispatchEvent(new Event('authStateChanged'));
});

// ============================================
// HELPER FUNCTIONS
// ============================================

function getCurrentUser()  { return currentUser; }
function getUserRole()     { return userRole; }
function isAdmin()         { return userRole === 'admin'; }
function isFaculty()       { return userRole === 'faculty'; }
function isAuthenticated() { return currentUser !== null; }
