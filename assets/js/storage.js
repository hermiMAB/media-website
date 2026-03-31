// ============================================
// FIREBASE STORAGE - FILE OPERATIONS
// ============================================

// ============================================
// UPLOAD FILE
// ============================================

async function uploadDocument(file, submissionId) {
    try {
        if (!file) {
            throw new Error('No file provided');
        }
        
        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
            throw new Error('File size exceeds 10MB limit');
        }
        
        // Create unique filename
        const timestamp = Date.now();
        const filename = `${submissionId}-${timestamp}-${file.name}`;
        const filepath = `submissions/${filename}`;
        
        // Show progress
        console.log(`Uploading ${file.name}...`);
        
        // Upload to Firebase Storage
        const storageRef = firebase.storage().ref(filepath);
        const uploadTask = storageRef.put(file);
        
        // Handle upload completion
        await uploadTask;
        
        // Get download URL
        const downloadUrl = await storageRef.getDownloadURL();
        console.log('File uploaded successfully');
        
        return {
            url: downloadUrl,
            name: file.name,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString()
        };
    } catch (error) {
        console.error('✗ Upload error:', error.message);
        throw error;
    }
}

// ============================================
// DELETE FILE
// ============================================

async function deleteDocument(fileUrl) {
    try {
        if (!fileUrl) return false;
        
        const fileRef = firebase.storage().refFromURL(fileUrl);
        await fileRef.delete();
        
        console.log('File deleted successfully');
        return true;
    } catch (error) {
        console.error('✗ Delete file error:', error.message);
        throw error;
    }
}

// ============================================
// DOWNLOAD FILE
// ============================================

async function downloadDocument(fileUrl, fileName) {
    try {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        
        xhr.onload = () => {
            const url = window.URL.createObjectURL(xhr.response);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = fileName;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        };
        
        xhr.onerror = () => {
            throw new Error('Download failed');
        };
        
        xhr.open('GET', fileUrl);
        xhr.send();
        
        console.log('File download started');
    } catch (error) {
        console.error('✗ Download error:', error.message);
        throw error;
    }
}

// ============================================
// GET FILE METADATA
// ============================================

async function getFileMetadata(fileUrl) {
    try {
        const fileRef = firebase.storage().refFromURL(fileUrl);
        const metadata = await fileRef.getMetadata();
        
        return {
            name: metadata.name,
            size: metadata.size,
            type: metadata.contentType,
            uploaded: metadata.timeCreated,
            updated: metadata.updated
        };
    } catch (error) {
        console.error('✗ Get file metadata error:', error.message);
        throw error;
    }
}

// ============================================
// LIST FILES IN FOLDER
// ============================================

async function listDocuments(submissionId) {
    try {
        const folderRef = firebase.storage().ref(`submissions/`);
        const result = await folderRef.listAll();
        
        // Filter by submission ID
        const files = result.items.filter(item => 
            item.name.startsWith(submissionId)
        );
        
        const fileList = [];
        for (let file of files) {
            const url = await file.getDownloadURL();
            fileList.push({
                name: file.name,
                url: url,
                fullPath: file.fullPath
            });
        }
        
        return fileList;
    } catch (error) {
        console.error('✗ List documents error:', error.message);
        throw error;
    }
}

// ============================================
// UPLOAD PROGRESS TRACKING
// ============================================

function uploadDocumentWithProgress(file, submissionId, onProgress) {
    return new Promise(async (resolve, reject) => {
        try {
            const timestamp = Date.now();
            const filename = `${submissionId}-${timestamp}-${file.name}`;
            const filepath = `submissions/${filename}`;
            
            const storageRef = firebase.storage().ref(filepath);
            const uploadTask = storageRef.put(file);
            
            // Track upload progress
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    if (onProgress) {
                        onProgress(progress);
                    }
                },
                (error) => {
                    console.error('✗ Upload error:', error);
                    reject(error);
                },
                async () => {
                    const url = await storageRef.getDownloadURL();
                    resolve({
                        url: url,
                        name: file.name,
                        size: file.size,
                        type: file.type
                    });
                }
            );
        } catch (error) {
            reject(error);
        }
    });
}
