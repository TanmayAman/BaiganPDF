// BaiganPDF - PDF Hosting Script
const appData = JSON.parse(localStorage.getItem('BaiganPDF')) || {
    folders: [],
    pdfs: []
};

// DOM Elements
const folderList = document.getElementById('folderList');
const pdfContainer = document.getElementById('pdfContainer');
const pathBar = document.getElementById('pathBar');
const adminBtn = document.getElementById('adminBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderFolders();
    renderPDFs();
    
    // Admin button event
    if (adminBtn) {
        adminBtn.addEventListener('click', () => {
            const password = prompt('Enter admin password:');
            if (password === 'BaiganPDF@123') {
                window.location.href = 'admin.html';
            } else {
                alert('Incorrect password!');
            }
        });
    }
});

// Render Folders
function renderFolders() {
    folderList.innerHTML = '';
    
    // All PDFs item
    const allItem = document.createElement('li');
    allItem.className = 'active';
    allItem.innerHTML = '<i class="fas fa-layer-group"></i> All PDFs';
    allItem.addEventListener('click', () => {
        document.querySelectorAll('.folder-list li').forEach(li => li.classList.remove('active'));
        allItem.classList.add('active');
        renderPDFs();
        updatePathBar();
    });
    folderList.appendChild(allItem);
    
    // Folder items
    appData.folders.forEach(folder => {
        const folderItem = document.createElement('li');
        folderItem.innerHTML = `<i class="fas fa-folder"></i> ${folder.name}`;
        folderItem.addEventListener('click', () => {
            document.querySelectorAll('.folder-list li').forEach(li => li.classList.remove('active'));
            folderItem.classList.add('active');
            renderPDFs(folder.id);
            updatePathBar(folder.name);
        });
        folderList.appendChild(folderItem);
    });
}

// Render PDFs
function renderPDFs(folderId = null) {
    pdfContainer.innerHTML = '';
    
    const filteredPDFs = folderId 
        ? appData.pdfs.filter(pdf => pdf.folderId === folderId)
        : appData.pdfs;
    
    if (filteredPDFs.length === 0) {
        pdfContainer.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-file-pdf"></i>
                <p>No PDFs found</p>
            </div>
        `;
        return;
    }
    
    filteredPDFs.forEach(pdf => {
        const pdfCard = document.createElement('div');
        pdfCard.className = 'pdf-card';
        
        const folderName = pdf.folderId ? getFolderName(pdf.folderId) : null;
        
        pdfCard.innerHTML = `
            <div class="pdf-thumbnail">
                <i class="fas fa-file-pdf"></i>
            </div>
            <div class="pdf-info">
                <div class="pdf-title" title="${pdf.title}">${pdf.title}</div>
                ${folderName ? `<div class="pdf-folder"><i class="fas fa-folder"></i> ${folderName}</div>` : ''}
                <div class="pdf-actions">
                    <button class="btn btn-primary view-pdf" data-link="${pdf.link}">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-outline download-pdf" data-link="${pdf.link}">
                        <i class="fas fa-download"></i> Download
                    </button>
                </div>
            </div>
        `;
        
        pdfContainer.appendChild(pdfCard);
    });
    
    // Add event listeners
    document.querySelectorAll('.view-pdf').forEach(btn => {
        btn.addEventListener('click', () => {
            window.open(convertToViewLink(btn.dataset.link), '_blank');
        });
    });
    
    document.querySelectorAll('.download-pdf').forEach(btn => {
        btn.addEventListener('click', () => {
            downloadPDF(btn.dataset.link);
        });
    });
}

// Update Path Bar
function updatePathBar(folderName = null) {
    pathBar.innerHTML = '';
    
    const rootItem = document.createElement('span');
    rootItem.className = 'path-item' + (folderName === null ? ' active' : '');
    rootItem.textContent = 'All PDFs';
    rootItem.addEventListener('click', () => {
        document.querySelector('.folder-list li:first-child').click();
    });
    pathBar.appendChild(rootItem);
    
    if (folderName) {
        const separator = document.createElement('span');
        separator.innerHTML = '&nbsp;/&nbsp;';
        pathBar.appendChild(separator);
        
        const folderItem = document.createElement('span');
        folderItem.className = 'path-item active';
        folderItem.textContent = folderName;
        pathBar.appendChild(folderItem);
    }
}

// Helper Functions
function convertToViewLink(link) {
    if (link.includes('drive.google.com')) {
        const fileId = link.match(/\/file\/d\/([^\/]+)/)[1];
        return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return link;
}

function downloadPDF(link) {
    let downloadLink = link;
    if (link.includes('drive.google.com')) {
        const fileId = link.match(/\/file\/d\/([^\/]+)/)[1];
        downloadLink = `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
    
    const a = document.createElement('a');
    a.href = downloadLink;
    a.target = '_blank';
    a.click();
}

function getFolderName(id) {
    const folder = appData.folders.find(f => f.id === id);
    return folder ? folder.name : null;
}

function generateId() {
    return Math.random().toString(36).substring(2, 15);
}

function saveData() {
    localStorage.setItem('BaiganPDF', JSON.stringify(appData));
}