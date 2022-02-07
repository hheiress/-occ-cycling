const formatDate = (dateIn) => {
    if (dateIn == null || typeof dateIn == "undefined") {
        return '';
    }
    return dateIn.toISOString().split('T')[0];
}

module.exports = {formatDate};
