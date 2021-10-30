export function replaceById(array, elementToReplace) {
  const newArray = [];
  array.forEach(element => {
    if (element.id === elementToReplace.id)
      newArray.push(elementToReplace);
    else
      newArray.push(element);
  })
  return newArray;
}

export function deleteById(array, idToDelete) {
  const newArray = [];
  array.forEach(element => {
    if (element.id !== idToDelete)
      newArray.push(element);
  })
  return newArray;
}