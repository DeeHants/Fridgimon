function Busy({ isBusy }) {
    // Show and hide the hourglass
    React.useEffect(() => {
        // Check hourglass is defined
        if (typeof hourglass == 'undefined') {
            return;
        }

        // Toggle visibility
        hourglass.visibility = isBusy ? "visible" : "hidden";
    }, [isBusy]);

    // No visible component
    return null;
}
