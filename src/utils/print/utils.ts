export function cleanSpaces(str: string): string {
  return str.replace(/&nbsp;/g, '')
}

export function includeSpace(qty: number) {
  return '&nbsp;'.repeat(qty);
}

export function centralizeText(text: string, maxCharLine = 47): string {
  const qtySpaces = (maxCharLine - text.length) / 2;
  return `${includeSpace(qtySpaces)}${text}${includeSpace(qtySpaces)}`;
}

export function alingRightText(text: string, maxCharLine = 47) {
  const qtySpaces = maxCharLine - Number(text.replace(/&nbsp;/g, ' ').length);
  return `${includeSpace(qtySpaces)}${text}`;
}

export function justifiyText(textLeft: string, textRight: string, maxCharLine = 47) {
  const qtySpaces = maxCharLine - (Number(cleanSpaces(textLeft).length) + Number(cleanSpaces(textRight).length));
  return `${textLeft}${includeSpace(qtySpaces)}${textRight}`;
}

export function formatProductsHeader(maxCharLine = 47) {
  const itemField = 'Item';
  const qtdField = 'Qtd';
  const vlUnitField = 'Vl Unit.';
  const vlTotalField = 'Vl Total';
  const lengthLine =
    Number(itemField.length) +
    Number(qtdField.length) +
    Number(vlUnitField.length) +
    Number(vlTotalField.length);
  return `${includeSpace(maxCharLine - (Number(lengthLine) + 13))}${itemField}${includeSpace(3)}${qtdField}${includeSpace(5)}${vlUnitField}${includeSpace(5)}${vlTotalField}<br>`;
}

export function formatAmount(amount: string, maxCharAmount = 8) {
  const qtySpaces = maxCharAmount - Number(amount.length);
  return `R$${includeSpace(qtySpaces)}${amount}`;
}

export function formatAddress(addressText: string, addressLabelLength = 0, maxCharLine = 47) {
  const lines = [];
  let currentAddressCharacters = 0
  let currentLine = 0

  while (true) {
    if (currentAddressCharacters >= addressText.length) {
      break;
    }
        
    const referenceAddres = addressText.substr(currentAddressCharacters)
    const lineLimit = currentLine === 0 ? (maxCharLine - addressLabelLength) : maxCharLine
    const currentContent = referenceAddres.substr(0, lineLimit)
    lines[currentLine] = currentContent
    currentAddressCharacters += currentContent.length
    currentLine+= 1
  }

  return lines.join("<br />")
}
