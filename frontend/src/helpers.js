import { DateTime } from "luxon";

export function findById(array, id) {
  return array.find(element => element.id === id)
}

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

export function deleteByValue(array, valueToDelete) {
  const newArray = [];
  array.forEach(element => {
    if (element !== valueToDelete)
      newArray.push(element);
  })
  return newArray;
}

export function formatDate(date, format = DateTime.DATE_MED_WITH_WEEKDAY) {
  return DateTime.fromISO(date).toLocaleString(format)
}

export function formatServerDate(date) {
  return date.toISOString().split("T")[0];
}

export function timeFrom(date) {
  return DateTime.fromISO(date).toRelative(date)
}

export class BlocksFinder {
  constructor(htmlText) {
    this.htmlText = htmlText;
    this.blocks = [];
    this.resetState();
  }

  resetState() {
    this.newBlockStart = true;
    this.currentTag = null;
    this.currentBlock = "";
    this.potentialTagClosure = false;
  }

  findBlocks() {
    for (let index = 0; index < this.htmlText.length; index++) {
      const character = this.htmlText[index];
      this.currentBlock += character;

      if (this.newBlockStart) {
        if (character === "<")
          continue;
        else if (character === ">") {
          this.newBlockStart = false;
        }
        if (this.currentTag)
          this.currentTag += character;
        else
          this.currentTag = character;
      } else {
        if (this.potentialTagClosure) {
          if ([...this.currentTag, "/", ">"].includes(character)) {
            if (character === '>') {
              this.blocks.push(this.currentBlock);
              this.resetState();
            }
          } else
            this.potentialTagClosure = false;
        } else {
          if (character === "<")
            this.potentialTagClosure = true
        }
      }
    }
    return this.blocks;
  }
}
