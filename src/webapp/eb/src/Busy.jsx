function Busy({ isBusy }) {
    // Show and hide the hourglass
    React.useEffect(() => {
        hourglass.visibility = isBusy ? "visible" : "hidden";
    }, [isBusy]);

    // No visible component
    return null;
}
