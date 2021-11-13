import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
const fs = window.require('fs');

export default async function createPDF(content: string, filePath: string, image?: Buffer) {
    const pdfDoc = await PDFDocument.create()
    const pdfPage = await pdfDoc.addPage()
    pdfPage.setHeight(18 * content.split('\n').length + 50)

    if (image) {
        await addImage(image, pdfPage, pdfDoc)        
    }

    await addContent(content, pdfPage, pdfDoc)
    await save(filePath, pdfDoc)
}

async function addContent(text: string, page: PDFPage, pdfDoc: PDFDocument) {
    const { height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.CourierBold);

    page.drawText(text, {
        lineHeight: 15,
        y: height - 4 * 35,
        x: 0,
        size: 12,
        font,
        color: rgb(0, 0, 0)
    });
}

async function addImage(image: Buffer, page: PDFPage, pdfDoc: PDFDocument) {
    const embeddedImage = await pdfDoc.embedPng(image);
    const imageDimension = embeddedImage.scale(0.25)
    const { height } = page.getSize();

    page.drawImage(embeddedImage, {
        y: height - 4 * 27,
        x: 90,
        width: imageDimension.width,
        height: imageDimension.height,
    });
}

async function save(filePath: string, pdfDoc: PDFDocument) {
    const pdfBytes = await pdfDoc.save();
    await fs.writeFileSync(filePath, pdfBytes);
}