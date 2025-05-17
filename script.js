let callData = [];
let smsData = [];

function processFiles() {
    const callFile = document.getElementById('callHistory').files[0];
    const smsFile = document.getElementById('smsHistory').files[0];

    if (callFile) parseFile(callFile, 'call');
    if (smsFile) parseFile(smsFile, 'sms');
}

function parseFile(file, type) {
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const text = e.target.result;
        
        // CSV পার্সিং
        Papa.parse(text, {
            header: true,
            dynamicTyping: true,
            complete: (results) => {
                if(type === 'call') {
                    callData = results.data;
                    displayData(callData, 'callTable', 'কল হিস্টোরি');
                } else {
                    smsData = results.data;
                    displayData(smsData, 'smsTable', 'এসএমএস হিস্টোরি');
                }
                
                if(callData.length > 0 || smsData.length > 0) {
                    document.getElementById('downloadBtn').style.display = 'block';
                }
            }
        });
    };
    
    reader.readAsText(file);
}

function displayData(data, containerId, title) {
    const container = document.getElementById(containerId);
    let html = `<h3>${title}</h3><table>`;
    
    if(data.length > 0) {
        // হেডার তৈরি
        html += '<tr>';
        Object.keys(data[0]).forEach(key => {
            html += `<th>${key}</th>`;
        });
        html += '</tr>';

        // ডেটা সারি
        data.forEach(row => {
            html += '<tr>';
            Object.values(row).forEach(val => {
                html += `<td>${val}</td>`;
            });
            html += '</tr>';
        });
    }
    
    html += '</table>';
    container.innerHTML = html;
}

function downloadTxt() {
    let txtContent = '=== কল হিস্টোরি ===\n';
    callData.forEach(entry => {
        txtContent += Object.values(entry).join(' | ') + '\n';
    });

    txtContent += '\n=== এসএমএস হিস্টোরি ===\n';
    smsData.forEach(entry => {
        txtContent += Object.values(entry).join(' | ') + '\n';
    });

    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'history.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}