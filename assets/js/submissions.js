// ============================================
// SUBMISSIONS - CRUD OPERATIONS
// ============================================

// ============================================
// CREATE SUBMISSION
// ============================================

async function createSubmission(submissionData) {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        
        // Get user profile for submission
        const userDoc = await db.collection('users').doc(user.uid).get();
        const userData = userDoc.data();
        
        const submission = {
            id: '', // Will be set after creation
            submittedBy: userData.name || 'Unknown',
            submitterEmail: user.email,
            department: userData.department || '',
            type: submissionData.type,
            subject: submissionData.subject,
            body: submissionData.body,
            documentUrl: submissionData.documentUrl || '',
            fileName: submissionData.fileName || '',
            submittedAt: new Date().toISOString(),
            deadline: submissionData.deadline,
            status: 'pending',
            feedback: '',
            priority: null,
            submitterId: user.uid,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to Firestore
        const docRef = await db.collection('submissions').add(submission);
        
        // Update document with its own ID
        await docRef.update({ id: docRef.id });
        
        console.log('Submission created:', docRef.id);
        return { ...submission, id: docRef.id };
    } catch (error) {
        console.error('✗ Create submission error:', error.message);
        throw error;
    }
}

// ============================================
// GET SUBMISSION
// ============================================

async function getSubmission(submissionId) {
    try {
        const doc = await db.collection('submissions').doc(submissionId).get();
        if (!doc.exists) {
            throw new Error('Submission not found');
        }
        return doc.data();
    } catch (error) {
        console.error('✗ Get submission error:', error.message);
        throw error;
    }
}

// ============================================
// GET ALL SUBMISSIONS (with filters)
// ============================================

async function getAllSubmissions(filters = {}) {
    try {
        let query = db.collection('submissions');
        
        // Apply filters
        if (filters.status) {
            query = query.where('status', '==', filters.status);
        }
        
        if (filters.type) {
            query = query.where('type', '==', filters.type);
        }
        
        if (filters.submitterId) {
            query = query.where('submitterId', '==', filters.submitterId);
        }
        
        const snapshot = await query.get();
        const submissions = [];
        
        snapshot.forEach(doc => {
            submissions.push(doc.data());
        });
        
        console.log(`Retrieved ${submissions.length} submissions`);
        return submissions;
    } catch (error) {
        console.error('✗ Get all submissions error:', error.message);
        throw error;
    }
}

// ============================================
// GET USER'S SUBMISSIONS
// ============================================

async function getUserSubmissions() {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not authenticated');
        
        const submissions = await getAllSubmissions({ submitterId: user.uid });
        return submissions;
    } catch (error) {
        console.error('✗ Get user submissions error:', error.message);
        throw error;
    }
}

// ============================================
// UPDATE SUBMISSION
// ============================================

async function updateSubmission(submissionId, updates) {
    try {
        updates.updatedAt = new Date().toISOString();
        
        await db.collection('submissions').doc(submissionId).update(updates);
        console.log('Submission updated:', submissionId);
        return true;
    } catch (error) {
        console.error('✗ Update submission error:', error.message);
        throw error;
    }
}

// ============================================
// DELETE SUBMISSION (soft delete - change status)
// ============================================

async function deleteSubmission(submissionId) {
    try {
        await db.collection('submissions').doc(submissionId).delete();
        console.log('Submission deleted:', submissionId);
        return true;
    } catch (error) {
        console.error('✗ Delete submission error:', error.message);
        throw error;
    }
}

// ============================================
// SUBMISSION STATUS UPDATES
// ============================================

async function approveSubmission(submissionId) {
    try {
        await updateSubmission(submissionId, {
            status: 'approved',
            feedback: ''
        });
        console.log('Submission approved:', submissionId);
        return true;
    } catch (error) {
        console.error('✗ Approve submission error:', error.message);
        throw error;
    }
}

async function rejectSubmission(submissionId, reason) {
    try {
        await updateSubmission(submissionId, {
            status: 'rejected',
            feedback: reason
        });
        console.log('Submission rejected:', submissionId);
        return true;
    } catch (error) {
        console.error('✗ Reject submission error:', error.message);
        throw error;
    }
}

async function requestRevision(submissionId, feedback) {
    try {
        await updateSubmission(submissionId, {
            status: 'needs_revision',
            feedback: feedback
        });
        console.log('Revision requested:', submissionId);
        return true;
    } catch (error) {
        console.error('✗ Request revision error:', error.message);
        throw error;
    }
}

// ============================================
// RESUBMIT AFTER REVISION
// ============================================

async function resubmitAfterRevision(submissionId, updates) {
    try {
        updates.status = 'pending';
        updates.feedback = '';
        await updateSubmission(submissionId, updates);
        console.log('Submission resubmitted:', submissionId);
        return true;
    } catch (error) {
        console.error('✗ Resubmit error:', error.message);
        throw error;
    }
}
