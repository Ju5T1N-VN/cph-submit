import config from './config';
import { CphSubmitResponse, CphEmptyResponse } from './types';
import { handleSubmit } from './handleSubmit';
import log from './log';

// SỬA LỖI 1: Thêm khai báo 'browser' cho TypeScript
declare const browser: any;

// --- PHẦN 1: Logic polling CPH server bằng Alarms ---

const CPH_POLLING_ALARM = 'cph-polling-alarm';

const mainLoop = async () => {
    log('Main loop running...');
    let cphResponse;
    try {
        const headers = new Headers();
        headers.append('cph-submit', 'true');
        const request = new Request(config.cphServerEndpoint.href, { method: 'GET', headers });
        cphResponse = await fetch(request);
    } catch (err) {
        log('Error fetching from CPH server. Is it running?', err);
        return;
    }

    if (!cphResponse.ok) {
        log('Error response from CPH server', cphResponse);
        return;
    }

    const response: CphSubmitResponse | CphEmptyResponse = await cphResponse.json();

    if (response.empty) {
        log('Got empty response from CPH.');
        return;
    }

    log('Got submission data from CPH. Handling submit...');
    handleSubmit(response.problemName, response.languageId, response.sourceCode, response.url);
};

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === CPH_POLLING_ALARM) {
        mainLoop();
    }
});

function createAlarm() {
    chrome.alarms.get(CPH_POLLING_ALARM, (existingAlarm) => {
        if (!existingAlarm) {
            chrome.alarms.create(CPH_POLLING_ALARM, {
                delayInMinutes: 0.05,
                periodInMinutes: 0.05,
            });
            log('CPH polling alarm created.');
        }
    });
}

chrome.runtime.onInstalled.addListener(createAlarm);
chrome.runtime.onStartup.addListener(createAlarm);
createAlarm();

// --- PHẦN 2: "LÍNH CANH" - Logic tiêm script tự động ---

chrome.webNavigation.onCompleted.addListener(async (details) => {
    if (details.frameId !== 0) {
        return;
    }

    try {
        const result = await chrome.storage.local.get('cph_last_submission');
        const data = result['cph_last_submission'];

        if (data && Date.now() - data.timestamp < 30000) {
            log('WebNav Listener: Found fresh submission data. Injecting script into tab:', details.tabId);
            
            if (typeof browser !== 'undefined') { // Firefox
                await browser.tabs.executeScript(details.tabId, { file: '/dist/injectedScript.js' });
            } else { // Chrome / Edge
                await chrome.scripting.executeScript({
                    target: { tabId: details.tabId },
                    files: ['/dist/injectedScript.js'],
                });
            }
        }
    } catch (e) {
        console.error("CPH-SUBMIT [WebNav Listener]: Error during script injection.", e);
    }
}, {
    url: [
        { hostContains: 'codeforces.com', pathSuffix: '/submit' }
    ]
});

log('Background script initialized with Alarms and WebNavigation listeners.');