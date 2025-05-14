function UnlockButton() {
    const [cradleStatus, setCradleStatus] = React.useState(true);

    React.useEffect(() => {
        const interval = setInterval(() => checkCradleStatus(), 1000);

        return () => clearInterval(interval);
    }, []);

    function checkCradleStatus() {
        let inCradle = EB.SmartCradle.wallId != -1;
        setCradleStatus(inCradle);
    }

    return cradleStatus && (
        <button onClick={() => { EB.SmartCradle.unlock(500, 500, 10) }}>
            Unlock
        </button>
    );
}
