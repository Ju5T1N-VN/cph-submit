import log from './log';

type SubmissionData = {
    problemName: string;
    url: string;
    sourceCode: string;
    languageId: number;
    timestamp: number;
};

log('cph-submit script injected. Observer is starting.');

function runSubmissionObserver(attemptCount = 0) {
    const MAX_ATTEMPTS = 60;
    const submitButton = document.querySelector('input.submit[type="submit"]');

    if (submitButton) {
        log(`Observer found the submit form after ${attemptCount} attempts. Proceeding to fetch data.`);
        fetchAndFillData();
        return;
    }

    if (attemptCount < MAX_ATTEMPTS) {
        log(`Observer did not find submit form. Retrying in 500ms... (Attempt ${attemptCount + 1}/${MAX_ATTEMPTS})`);
        setTimeout(() => runSubmissionObserver(attemptCount + 1), 500);
        return;
    }

    log('Observer stopped after maximum attempts. The submit form was not found.');
}

async function fetchAndFillData() {
    try {
        const result = await chrome.storage.local.get('cph_last_submission');
        const data = result['cph_last_submission'] as SubmissionData;

        if (data && Date.now() - data.timestamp < 30000) {
            log('Found fresh submission data in storage:', data);
            await chrome.storage.local.remove('cph_last_submission'); 
            fillForm(data);
        } else {
            log('No fresh submission data found in storage. Script will do nothing.');
        }
    } catch (e) {
        console.error('CPH-SUBMIT [INJECTED]: Error while accessing storage!', e);
    }
}

function fillForm(data: SubmissionData) {
    log('Starting to fill form with data.');
    
    const languageEl = document.querySelector('select[name="programTypeId"]') as HTMLSelectElement;
    const sourceCodeTextarea = document.getElementById('sourceCodeTextarea') as HTMLTextAreaElement;
    const submitBtn = document.querySelector('input.submit[type="submit"]') as HTMLInputElement;
    const editor = (window as any).ace?.edit('editor');

    if (!languageEl || !sourceCodeTextarea || !submitBtn) {
        log('Error: One or more form elements disappeared unexpectedly.');
        return;
    }

    languageEl.value = data.languageId.toString();
    sourceCodeTextarea.value = data.sourceCode;
    if (editor) {
        editor.setValue(data.sourceCode, 1);
    }
    log('Filled language and source code.');

    const isContestOrGymProblem = (url: string) => url.includes('/contest/') || url.includes('/gym/');

    if (isContestOrGymProblem(data.url)) {
        const problemIndexEl = document.querySelector('select[name="submittedProblemIndex"]') as HTMLSelectElement;
        if (problemIndexEl) {
            const problemIndex = data.url.split('/').pop() || '';
            problemIndexEl.value = problemIndex;
            problemIndexEl.dispatchEvent(new Event('change'));
            log(`Set problem index to: ${problemIndex}`);
        }
    } else {
        const problemCodeEl = document.querySelector('input[name="submittedProblemCode"]') as HTMLInputElement;
        if (problemCodeEl) {
            problemCodeEl.value = data.problemName;
            // SỬA LỖI 2: Sửa tên biến trong câu lệnh log
            log(`Set problem code to: ${data.problemName}`);
        }
    }

    log('Form filled. Clicking submit.');
    submitBtn.disabled = false;
    submitBtn.click();
}

runSubmissionObserver();