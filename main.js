const userInput = document.getElementById('userInput');
const generateBtn = document.getElementById('generateBtn');
const exampleBtn = document.getElementById('exampleBtn');
const outputContent = document.getElementById('outputContent');
const outputActions = document.getElementById('outputActions');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');

const OLLAMA_API = 'http://localhost:11434/api/generate';
const MODEL = 'tinyllama';

// Behavioral Template - Updated for multiple test cases
const SYSTEM_PROMPT = `You are a professional QA Engineer. Generative at least 5 to 7 detailed test cases for the user's input.
Include Functional, Edge, and Negative scenarios.

Follow this exact structure for EACH test case:
TC-XXX
Title: [Concise Title]
Priority: [High/Medium/Low]
Preconditions: [List preconditions]
Steps:
1. [Step 1]
2. [Step 2]
...
Expected Result: [Expected Outcome]

Ensure you output multiple test cases (TC-001, TC-002, etc.) separated clearly.`;

// 1. Generate Logic
generateBtn.addEventListener('click', async () => {
    const input = userInput.value.trim();
    if (!input) return;

    // UI Loading State
    generateBtn.disabled = true;
    generateBtn.innerHTML = '<span>Processing...</span><span class="btn-icon">⏳</span>';
    outputContent.innerHTML = `
        <div class="placeholder-state" style="opacity: 0.7;">
            <span class="placeholder-icon" style="animation: spin 2s linear infinite;">⚙️</span>
            <p><strong>Generating Test Cases...</strong></p>
        </div>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
    `;

    try {
        const response = await fetch(OLLAMA_API, {
            method: 'POST',
            body: JSON.stringify({
                model: MODEL,
                prompt: `${SYSTEM_PROMPT}\n\nUser Input: ${input}`,
                stream: false
            })
        });

        if (!response.ok) throw new Error('Ollama connection failed.');
        const data = await response.json();
        const text = data.response;

        // Render Cards
        outputContent.innerHTML = parseTestCases(text);
        outputActions.classList.remove('hidden');

    } catch (error) {
        outputContent.innerHTML = `
            <div class="placeholder-state" style="color: #ff4444;">
                <span class="placeholder-icon">⚠️</span>
                <p>System Error: ${error.message}</p>
                <p style="font-size: 0.8rem; margin-top: 10px;">Check if Ollama is running.</p>
            </div>
        `;
    } finally {
        generateBtn.disabled = false;
        generateBtn.innerHTML = '<span>Generate Test Cases</span><span class="btn-icon">▶</span>';
    }
});

// 2. Parser Logic
function parseTestCases(text) {
    // Improved Regex to catch multiple formats of TC headers
    const blocks = text.split(/(?=TC[-_]?\d+|Test Case \d+)/i).filter(b => b.trim().length > 20);

    if (blocks.length === 0) {
        // Fallback if regex fails - display raw text nicely
        return `<div class="test-case-card"><div class="tc-title">Generated Output</div><pre style="white-space: pre-wrap; font-family: sans-serif; color: #ccc;">${text}</pre></div>`;
    }

    return blocks.map((block, index) => {
        const lines = block.split('\n').map(l => l.trim()).filter(l => l);

        // Smarter Title Extraction
        let titleLine = lines.find(l => l.toLowerCase().startsWith('title:')) || lines[0] || "Test Case";
        let title = titleLine.replace(/^(Title:|TC[-_]?\d+|Test Case \d+[:.]?)/i, '').trim();

        // Fallback title if empty
        if (title.length < 5) title = "Functional Verification";

        const type = title.toLowerCase().includes('error') || title.toLowerCase().includes('invalid') ? 'Negative' : 'Functional';

        return `
            <div class="test-case-card">
                <div class="tc-header">
                    <span>TC_${String(index + 1).padStart(3, '0')}</span>
                    <span style="color: var(--neon-cyan); border: 1px solid var(--neon-cyan); padding: 0 4px; border-radius: 4px; font-size: 0.7rem;">${type}</span>
                </div>
                <div class="tc-title">${title}</div>
                
                <div class="tc-steps">
                    <strong>Steps:</strong>
                    <ul>
                         ${lines.filter(l => /^\d+\./.test(l) || l.startsWith('-')).slice(0, 8).map(l => `<li>${l.replace(/^\d+\.|-/, '').trim()}</li>`).join('')}
                    </ul>
                </div>
                <div class="tc-expected">${lines.find(l => l.toLowerCase().startsWith('expected'))?.replace(/^Expected Result:/i, '') || 'Verify expected outcome per requirements.'}</div>
            </div>
        `;
    }).join('');
}

// 3. Example Button Logic
exampleBtn.addEventListener('click', () => {
    userInput.value = "As a verified user, I want to use the Search feature to find products by name, category, or ID. Results should be filtered by relevance.";
    userInput.focus();
});

// 4. Copy Logic
copyBtn.addEventListener('click', () => {
    const text = outputContent.innerText;
    navigator.clipboard.writeText(text);
    const originalText = copyBtn.innerText;
    copyBtn.innerText = '✅ Copied!';
    setTimeout(() => copyBtn.innerText = originalText, 2000);
});

// 5. Download Logic (PDF)
downloadBtn.addEventListener('click', () => {
    // Check if jsPDF is loaded
    if (typeof jspdf === 'undefined') {
        alert('PDF Library loading... please try again in 2 seconds.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const date = new Date();
    const dateStr = date.toLocaleDateString().replace(/\//g, '-');
    const timeStr = date.toLocaleTimeString().replace(/:/g, '-');
    const filename = `Test_Cases_Report_${dateStr}_${timeStr}.pdf`;

    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text("Generated Test Cases Report", 20, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${date.toLocaleString()}`, 20, 28);

    doc.setTextColor(0);
    doc.setFontSize(10);

    const cards = document.querySelectorAll('.test-case-card');
    let y = 40;

    cards.forEach((card, i) => {
        if (y > 270) { doc.addPage(); y = 20; }

        const title = card.querySelector('.tc-title').innerText;
        const id = `TC_${String(i + 1).padStart(3, '0')}`;
        const steps = card.querySelector('.tc-steps ul').innerText;
        const expected = card.querySelector('.tc-expected').innerText;

        doc.setFontSize(12);
        doc.setFillColor(230, 230, 230);
        doc.rect(20, y - 5, 170, 8, 'F');
        doc.text(`${id}: ${title}`, 22, y);
        y += 10;

        doc.setFontSize(10);
        const splitSteps = doc.splitTextToSize("Steps:\n" + steps, 160);
        doc.text(splitSteps, 25, y);
        y += (splitSteps.length * 5) + 5;

        const splitExp = doc.splitTextToSize("Expected: " + expected, 160);
        doc.text(splitExp, 25, y);
        y += (splitExp.length * 5) + 15;
    });

    doc.save(filename);
});
