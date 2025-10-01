import config from './config';
import log from './log';

// Hàm helper để xác định loại URL
export const isContestOrGymProblem = (problemUrl: string) => {
    return problemUrl.includes('/contest/') || problemUrl.includes('/gym/');
};

// Hàm helper để tạo đúng URL nộp bài
export const getSubmitUrl = (problemUrl: string) => {
    if (!isContestOrGymProblem(problemUrl)) {
        return config.cfSubmitPage.href;
    }
    const url = new URL(problemUrl);
    const pathParts = url.pathname.split('/');
    const type = pathParts[1]; // "contest" hoặc "gym"
    const id = pathParts[2];   // ID của contest/gym
    return `https://codeforces.com/${type}/${id}/submit`;
};

// Hàm chính, được gọi bởi backgroundScript
export const handleSubmit = async (
    problemName: string,
    languageId: number,
    sourceCode: string,
    problemUrl: string,
) => {
    // Kiểm tra đầu vào
    if (!problemName || languageId === -1 || !sourceCode) {
        log('Invalid arguments passed to handleSubmit. Aborting.');
        return;
    }

    try {
        // Đóng gói dữ liệu với timestamp
        const submissionData = {
            problemName,
            languageId,
            sourceCode,
            url: problemUrl,
            timestamp: Date.now(),
        };

        // Bước 1: Lưu dữ liệu vào storage
        await chrome.storage.local.set({ 'cph_last_submission': submissionData });
        log('Saved submission data to local storage.');

        // Bước 2: Mở một tab mới. "Lính canh" trong backgroundScript sẽ lo phần còn lại.
        await chrome.tabs.create({
            active: true,
            url: getSubmitUrl(problemUrl),
        });
        log('New submission tab opened.');

    } catch (error) {
        console.error('CPH-SUBMIT [handleSubmit]: A critical error occurred:', error);
    }
};