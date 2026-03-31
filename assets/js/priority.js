// ============================================
// PRIORITY CALCULATION ENGINE
// ============================================

// Priority Score Logic:
// Urgent: Deadline within 2 days OR waiting 5+ days
// High: Deadline within 4 days OR waiting 3+ days  
// Medium: Deadline within 1 week
// Normal: Everything else

function calculatePriority(submission) {
    const now = new Date();
    const submittedAt = new Date(submission.submittedAt);
    const deadline = new Date(submission.deadline);
    
    // Calculate days until deadline
    const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
    
    // Calculate days waiting (submitted until now)
    const daysWaiting = Math.ceil((now - submittedAt) / (1000 * 60 * 60 * 24));
    
    let priority = 'normal';
    let score = 0;
    
    // URGENT: Deadline within 2 days OR waiting 5+ days
    if (daysUntilDeadline <= 2 || daysWaiting >= 5) {
        priority = 'urgent';
        score = 100 + Math.max(0, 5 - daysUntilDeadline) * 10 + Math.max(0, daysWaiting - 5) * 5;
    }
    // HIGH: Deadline within 4 days OR waiting 3+ days
    else if (daysUntilDeadline <= 4 || daysWaiting >= 3) {
        priority = 'high';
        score = 75 + Math.max(0, 4 - daysUntilDeadline) * 8 + Math.max(0, daysWaiting - 3) * 4;
    }
    // MEDIUM: Deadline within 1 week
    else if (daysUntilDeadline <= 7) {
        priority = 'medium';
        score = 50 + Math.max(0, 7 - daysUntilDeadline) * 5;
    }
    // NORMAL: Everything else
    else {
        priority = 'normal';
        score = 25;
    }
    
    return { priority, score, daysUntilDeadline, daysWaiting };
}

// ============================================
// UPDATE PRIORITY FOR ALL SUBMISSIONS
// ============================================

async function updateAllPriorities() {
    try {
        const submissions = await getAllSubmissions({ status: 'pending' });
        
        for (let submission of submissions) {
            const priorityData = calculatePriority(submission);
            await updateSubmission(submission.id, {
                priority: priorityData.priority
            });
        }
        
        console.log(`Updated priorities for ${submissions.length} submissions`);
        return true;
    } catch (error) {
        console.error('✗ Update all priorities error:', error.message);
        throw error;
    }
}

// ============================================
// SORT SUBMISSIONS BY PRIORITY
// ============================================

function sortByPriority(submissions) {
    const priorityOrder = { urgent: 0, high: 1, medium: 2, normal: 3 };
    
    return submissions.sort((a, b) => {
        // First sort by priority level
        const priorityDiff = (priorityOrder[a.priority] || 999) - (priorityOrder[b.priority] || 999);
        if (priorityDiff !== 0) return priorityDiff;
        
        // Then by submission date (newest first)
        return new Date(b.submittedAt) - new Date(a.submittedAt);
    });
}

// ============================================
// SORT SUBMISSIONS BY SUBMISSION DATE
// ============================================

function sortBySubmissionOrder(submissions) {
    return submissions.sort((a, b) => {
        return new Date(b.submittedAt) - new Date(a.submittedAt);
    });
}

// ============================================
// GET PRIORITY BADGE COLOR
// ============================================

function getPriorityBadgeClass(priority) {
    const classes = {
        urgent: 'badge-danger',
        high: 'badge-warning',
        medium: 'badge-info',
        normal: 'badge-primary'
    };
    return classes[priority] || 'badge-primary';
}

// ============================================
// GET PRIORITY DISPLAY TEXT
// ============================================

function getPriorityLabel(priority) {
    const labels = {
        urgent: 'URGENT',
        high: 'HIGH',
        medium: 'MEDIUM',
        normal: 'NORMAL'
    };
    return labels[priority] || 'NORMAL';
}

// ============================================
// DASHBOARD STATS
// ============================================

async function getSubmissionStats() {
    try {
        const submissions = await getAllSubmissions();
        
        const stats = {
            total: submissions.length,
            pending: submissions.filter(s => s.status === 'pending').length,
            approved: submissions.filter(s => s.status === 'approved').length,
            rejected: submissions.filter(s => s.status === 'rejected').length,
            needsRevision: submissions.filter(s => s.status === 'needs_revision').length,
            urgent: submissions.filter(s => s.priority === 'urgent').length,
            high: submissions.filter(s => s.priority === 'high').length,
            byType: {}
        };
        
        // Count by type
        const types = ['General Announcement', 'Academic Notice', 'Event Invitation', 
                      'Urgent Notice', 'Club / Activity', 'Job / Opportunity'];
        types.forEach(type => {
            stats.byType[type] = submissions.filter(s => s.type === type).length;
        });
        
        return stats;
    } catch (error) {
        console.error('✗ Get stats error:', error.message);
        throw error;
    }
}

// ============================================
// FILTER SUBMISSIONS
// ============================================

function filterSubmissions(submissions, filters) {
    let result = [...submissions];
    
    if (filters.status) {
        result = result.filter(s => s.status === filters.status);
    }
    
    if (filters.priority) {
        result = result.filter(s => s.priority === filters.priority);
    }
    
    if (filters.type) {
        result = result.filter(s => s.type === filters.type);
    }
    
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        result = result.filter(s => 
            s.subject.toLowerCase().includes(searchTerm) ||
            s.body.toLowerCase().includes(searchTerm) ||
            s.submittedBy.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filters.department) {
        result = result.filter(s => s.department === filters.department);
    }
    
    return result;
}
