// Code run when background script detects there is a problem to submit
import config from './config';
import log from './log';

declare const browser: any;

if (typeof browser !== 'undefined') {
    self.chrome = browser;
}

// SỬA ĐỔI 1: Đổi tên hàm và logic để nhận diện cả contest và gym
/**
 * Checks if the problem URL is from a contest or a gym.
 * @param problemUrl The URL of the problem.
 * @returns True if it's a contest or gym problem, false otherwise.
 */
export const isContestOrGymProblem = (problemUrl: string) => {
    return problemUrl.includes('/contest/') || problemUrl.includes('/gym/');
};

// SỬA ĐỔI 2: Cập nhật logic để tạo đúng URL submit cho cả contest và gym
/**
 * Gets the correct submission URL for a given problem URL.
 * @param problemUrl The URL of the problem.
 * @returns The submission URL.
 */
export const getSubmitUrl = (problemUrl: string) => {
    // Nếu không phải contest hay gym, trả về trang submit mặc định
    if (!isContestOrGymProblem(problemUrl)) {
        return config.cfSubmitPage.href;
    }

    const url = new URL(problemUrl);
    // Tách chuỗi pathname, ví dụ: "/contest/1234/problem/A" -> ["", "contest", "1234", ...]
    const pathParts = url.pathname.split('/');
    
    const type = pathParts[1]; // Sẽ là "contest" hoặc "gym"
    const id = pathParts[2]; // Sẽ là contestId hoặc gymId

    const submitURL = `https://codeforces.com/${type}/${id}/submit`;
    log(`Generated submit URL: ${submitURL}`);
    return submitURL;
};

/** Opens the Codeforces submit page and injects a script to submit the code. */
export const handleSubmit = async (
    problemName: string,
    languageId: number,
    sourceCode: string,
    problemUrl: string,
) => {
    if (problemName === '' || languageId == -1 || sourceCode == '') {
        log('Invalid arguments to handleSubmit');
        return;
    }

    log('isContestOrGymProblem', isContestOrGymProblem(problemUrl));

    let tab = await chrome.tabs.create({
        active: true,
        url: getSubmitUrl(problemUrl),
    });

    const tabId = tab.id as number;

    chrome.windows.update(tab.windowId, {
        focused: true,
    });

    if (typeof browser !== 'undefined') {
        await browser.tabs.executeScript(tab.id, {
            file: '/dist/injectedScript.js',
        });
    } else {
        await chrome.scripting.executeScript({
            target: {
                tabId,
                allFrames: true,
            },
            files: ['/dist/injectedScript.js'],
        });
    }
    chrome.tabs.sendMessage(tabId, {
        type: 'cph-submit',
        problemName,
        languageId,
        sourceCode,
        url: problemUrl,
    });
    log('Sending message to tab with script');

    // Logic listener bên dưới không cần thay đổi
    const filter = {
        url: [{ urlContains: 'codeforces.com/problemset/status' }],
    };

    log('Adding nav listener');

    chrome.webNavigation.onCommitted.addListener((args) => {
        log('Navigation about to happen');
        if (args.tabId === tab.id) {
            log('Our tab is navigating');
        }
    }, filter);
};