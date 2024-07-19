export const formatTypeText = (string) => {
    let formattedString = string.replace(/_/g, ' ');
    formattedString = formattedString.toLowerCase();
    formattedString = formattedString.charAt(0).toUpperCase() + formattedString.slice(1);

    return formattedString;
};

export const smoothScrollToBottom = (element) => {
    const scrollHeight = element.scrollHeight;
    const startScrollTop = element.scrollTop;
    const distance = scrollHeight - startScrollTop;
    const duration = 500;
    let startTime = null;

    const animateScroll = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        element.scrollTop = startScrollTop + distance * progress;

        if (timeElapsed < duration) {
            window.requestAnimationFrame(animateScroll);
        } else {
            element.scrollTop = scrollHeight;
        }
    };

    window.requestAnimationFrame(animateScroll);
};
