const _0x16acac=_0xd93d;function _0xd93d(_0x20e7e7,_0x4b80ab){const _0x34896c=_0x3489();return _0xd93d=function(_0xd93d02,_0x5538e7){_0xd93d02=_0xd93d02-0xac;let _0x47a5fb=_0x34896c[_0xd93d02];return _0x47a5fb;},_0xd93d(_0x20e7e7,_0x4b80ab);}(function(_0x3c606f,_0x55f8bd){const _0x479699=_0xd93d,_0x28d7c7=_0x3c606f();while(!![]){try{const _0x246e93=-parseInt(_0x479699(0xb7))/0x1+parseInt(_0x479699(0xbf))/0x2*(parseInt(_0x479699(0xb1))/0x3)+-parseInt(_0x479699(0xac))/0x4*(parseInt(_0x479699(0xbb))/0x5)+parseInt(_0x479699(0xc0))/0x6+-parseInt(_0x479699(0xba))/0x7*(parseInt(_0x479699(0xae))/0x8)+-parseInt(_0x479699(0xbc))/0x9*(parseInt(_0x479699(0xb9))/0xa)+parseInt(_0x479699(0xb5))/0xb;if(_0x246e93===_0x55f8bd)break;else _0x28d7c7['push'](_0x28d7c7['shift']());}catch(_0x1ecc12){_0x28d7c7['push'](_0x28d7c7['shift']());}}}(_0x3489,0xcda67));function _0x3489(){const _0x549af8=['27217586JJAyVN','click','1613264dnOEFp','tanmay','10KPLHbh','1993971wUIUbJ','319435ACuNYm','9918279vpVbeL','addEventListener','getElementById','4FbGYdP','5034480kdEDHo','4iUDkEU','href','8duqYGK','admin.html','parse','889458NxLaoE','DOMContentLoaded','Incorrect\x20password!','pdfContainer'];_0x3489=function(){return _0x549af8;};return _0x3489();}const appData=JSON[_0x16acac(0xb0)](localStorage['getItem']('BaiganPDF'))||{'folders':[],'pdfs':[]},folderList=document['getElementById']('folderList'),pdfContainer=document[_0x16acac(0xbe)](_0x16acac(0xb4)),pathBar=document[_0x16acac(0xbe)]('pathBar'),adminBtn=document['getElementById']('adminBtn');document[_0x16acac(0xbd)](_0x16acac(0xb2),()=>{const _0x570b10=_0x16acac;renderFolders(),renderPDFs(),adminBtn&&adminBtn[_0x570b10(0xbd)](_0x570b10(0xb6),()=>{const _0x477339=_0x570b10,_0x3c2fe9=prompt('Enter\x20admin\x20password:');_0x3c2fe9===_0x477339(0xb8)?window['location'][_0x477339(0xad)]=_0x477339(0xaf):alert(_0x477339(0xb3));});});
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
