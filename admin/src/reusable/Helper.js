export const removeElem = (array, item) => {
    var index = array.indexOf(item);
    if (index !== -1) {
        array.splice(index, 1);
    }
    return array
}
export const hasElem = (array, item) => {

    var index = array.indexOf(item);
    if (index !== -1) {
        return true
    }

    return false
}