// Test mode: open the app with ?test=1. Uses separate server data and device memory.
export const TEST_MODE = new URLSearchParams(location.search).get('test') === '1'
export const q = TEST_MODE ? '?test=1' : ''
