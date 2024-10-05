function timeControl(f: (addTime: (ms: number) => void) => void) {
    const originalDateNow = Date.now;

    let currentTime = Date.now();
    Date.now = () => currentTime;

    function addTime(ms: number) {
        currentTime += ms;
    }
    f(addTime);

    Date.now = originalDateNow;
}
