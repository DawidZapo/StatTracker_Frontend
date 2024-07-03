export const formatTypeText = (string) => {
    let formattedString = string.replace(/_/g, ' ');
    formattedString = formattedString.toLowerCase();
    formattedString = formattedString.charAt(0).toUpperCase() + formattedString.slice(1);

    return formattedString;
}
