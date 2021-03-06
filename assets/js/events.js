import WakaTime from "./WakaTime.js";

/**
 * Whenever an alarms sets off, this function
 * gets called to detect the alarm name and
 * do appropriate action.
 *
 * @param alarm
 */
function resolveAlarm(alarm) {
    // |alarm| can be undefined because onAlarm also gets called from
    // window.setTimeout on old chrome versions.
    if (alarm && alarm.name == 'heartbeatAlarm') {

        console.log('recording a heartbeat - alarm triggered');

        var wakatime = new WakaTime;

        wakatime.recordHeartbeat();
    }
}

// Add a listener to resolve alarms
chrome.alarms.onAlarm.addListener(resolveAlarm);

// Create a new alarm for heartbeats.
chrome.alarms.create('heartbeatAlarm', {periodInMinutes: 2});

/**
 * Whenever a active tab is changed it records a heartbeat with that tab url.
 */
chrome.tabs.onActivated.addListener(function (activeInfo) {

    chrome.tabs.get(activeInfo.tabId, function (tab) {

        console.log('recording a heartbeat - active tab changed');

        var wakatime = new WakaTime;

        wakatime.recordHeartbeat();
    });

});

/**
 * Whenever any tab is updated it checks if the updated tab is the tab that is
 * currently active and if it is, then it records a heartbeat.
 */
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

    if (changeInfo.status === 'complete') {
        // Get current tab URL.
        chrome.tabs.query({active: true}, (tabs) => {
            // If tab updated is the same as active tab
            if (tabId == tabs[0].id) {
                console.log('recording a heartbeat - tab updated');

                var wakatime = new WakaTime;

                wakatime.recordHeartbeat();
            }
        });
    }

});
