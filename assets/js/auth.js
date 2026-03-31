// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

// ============================================
// LOGIN
// ============================================

async function loginUser(email, password) {
    try {
        // Ensure auth is initialized
        if (!auth || typeof auth.signInWithEmailAndPassword !== 'function') {
            throw new Error('Firebase Auth not initialized. Please refresh the page.');
        }
        
        const result = await auth.signInWithEmailAndPassword(email, password);
        console.log('Login successful:', result.user.email);
        return result;
    } catch (error) {
        console.error('Login error:', error.message);
        throw error;
    }
}

// ============================================
// REGISTER / SIGN UP
// ============================================

async function registerUser(email, password, userData) {
    try {
        // Ensure auth and db are initialized
        if (!auth || !db) {
            throw new Error('Firebase not initialized. Please refresh the page.');
        }
        
        // Create auth user
        const result = await auth.createUserWithEmailAndPassword(email, password);
        const uid = result.user.uid;
        
        // Store user data in Firestore
        await db.collection('users').doc(uid).set({
            name: userData.name || email.split('@')[0],
            email: email,
            department: userData.department || '',
            role: userData.role || 'faculty', // Default role
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        
        console.log('Registration successful:', email);
        return result;
    } catch (error) {
        console.error('✗ Registration error:', error.message);
        throw error;
    }
}

// ============================================
// LOGOUT
// ============================================

async function logoutUser() {
    try {
        await auth.signOut();
        console.log('Logout successful');
        currentUser = null;
        userRole = null;
        // Always return user to login after sign-out
        window.location.href = './auth/login.html';
        return true;
    } catch (error) {
        console.error('✗ Logout error:', error.message);
        throw error;
    }
}

// ============================================
// PASSWORD RESET
// ============================================

async function sendPasswordResetEmail(email) {
    try {
        await auth.sendPasswordResetEmail(email);
        console.log('Password reset email sent to:', email);
        return true;
    } catch (error) {
        console.error('✗ Password reset error:', error.message);
        throw error;
    }
}

// ============================================
// PASSWORD CHANGE
// ============================================

async function changePassword(currentPassword, newPassword) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        // Re-authenticate with current password
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            currentPassword
        );
        await user.reauthenticateWithCredential(credential);
        
        // Update password
        await user.updatePassword(newPassword);
        console.log('Password changed successfully');
        return true;
    } catch (error) {
        console.error('✗ Password change error:', error.message);
        throw error;
    }
}

// ============================================
// UPDATE PROFILE
// ============================================

async function updateUserProfile(updates) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        // Update Firestore user document
        await db.collection('users').doc(user.uid).update({
            ...updates,
            updatedAt: new Date().toISOString()
        });
        
        // Update Firebase Auth display name if provided
        if (updates.name) {
            await user.updateProfile({
                displayName: updates.name
            });
        }
        
        console.log('Profile updated successfully');
        return true;
    } catch (error) {
        console.error('✗ Profile update error:', error.message);
        throw error;
    }
}

// ============================================
// GET USER PROFILE
// ============================================

async function getUserProfile() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (!userDoc.exists) {
            throw new Error('User profile not found');
        }
        
        return {
            uid: user.uid,
            ...userDoc.data()
        };
    } catch (error) {
        console.error('✗ Get profile error:', error.message);
        throw error;
    }
}

// ============================================
// DELETE ACCOUNT
// ============================================

async function deleteUserAccount(password) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('No user logged in');
        
        // Re-authenticate with password
        const credential = firebase.auth.EmailAuthProvider.credential(
            user.email,
            password
        );
        await user.reauthenticateWithCredential(credential);
        
        // Delete user document from Firestore
        await db.collection('users').doc(user.uid).delete();
        
        // Delete user from Firebase Auth
        await user.delete();
        
        console.log('Account deleted successfully');
        currentUser = null;
        userRole = null;
        return true;
    } catch (error) {
        console.error('✗ Account deletion error:', error.message);
        throw error;
    }
}

// ============================================
// SESSION MANAGEMENT
// ============================================

function setAuthCookie(key, value, hours = 24) {
    const expires = new Date();
    expires.setHours(expires.getHours() + hours);
    document.cookie = `${key}=${value};expires=${expires.toUTCString()};path=/`;
}

function getAuthCookie(key) {
    const nameEQ = key + '=';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length);
        }
    }
    return null;
}

function deleteAuthCookie(key) {
    document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}


// ============================================
// ERROR MESSAGES
// ============================================

function getFirebaseErrorMessage(error) {
    switch (error.code) {
        case 'auth/user-not-found':
            return 'No account found with this email address.';
        case 'auth/wrong-password':
            return 'Incorrect password. Please try again.';
        case 'auth/invalid-email':
            return 'Please enter a valid email address.';
        case 'auth/user-disabled':
            return 'This account has been disabled. Contact support.';
        case 'auth/too-many-requests':
            return 'Too many failed attempts. Please try again later.';
        case 'auth/network-request-failed':
            return 'Network error. Please check your connection.';
        case 'auth/invalid-credential':
            return 'Invalid email or password. Please try again.';
        default:
            return 'Something went wrong. Please try again.';
    }
}