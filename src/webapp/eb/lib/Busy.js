"use strict";

function Busy(_ref) {
  var isBusy = _ref.isBusy;
  // Show and hide the hourglass
  React.useEffect(function () {
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