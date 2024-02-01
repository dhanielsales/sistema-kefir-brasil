import { PDFDocument, PDFPage, rgb, StandardFonts, PageSizes } from 'pdf-lib';
const fs = window.require('fs');

interface Content {
    nome: string
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
}

interface Text {
    title: string
    name: string
    address: string
}

function capitalizeFirsts(text: string): string {
    const words = text.split(" ").filter(Boolean);
    const result = words.map((word) => {
        const curr = word.toLocaleLowerCase()
        return curr[0].toUpperCase() + curr.substring(1)
    }).join(" ");

    return result
}

export default async function createPDFCorreios(content: Content, filePath: string) {
    const pdfDoc = await PDFDocument.create()
    const { logradouro, bairro, cep, cidade, complemento, estado, nome, numero } = content

    const texts: Text[] = [
        {
            title: 'REMETENTE',
            name: "Verônica Rodrigues",
            address:  `Duets Office - Rua Gilberto Studart, 55 - Torre Sul, Sala 1018 - Cocó Fortaleza - CE - CEP: 60192-105`
        },
        {
            title: 'DESTINATÁRIO',
            name: capitalizeFirsts(nome),
            address: `${logradouro}, ${numero} ${complemento ? `- ${complemento}` : ''} - ${bairro} ${cidade} - ${estado} - CEP: ${cep}`
        }
    ]

    await addContent(texts,  pdfDoc)
    await save(filePath, pdfDoc)
}

async function addContent(texts: Text[], pdfDoc: PDFDocument) {
    const page = await pdfDoc.addPage()
    const fontBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    let currHeight = 0
    let currPosition = 550

    for (const [index, text] of Object.entries(texts)) {
        const titleSize = 20
        const titleHeight = font.heightAtSize(titleSize)

        const addresses = text.address.match(/.{1,42}/g) ?? [];

        page.drawText(text.title, {
            x: 45,
            y: currPosition - (addresses.length < 3 ? 5 : 0 ),
            size: titleSize,
            font: fontBold,
            color: rgb(0, 0, 0)
        })

        currHeight += titleHeight + 10
        currPosition -= titleHeight + 5

        const nameSize = 20

        page.drawText(text.name, {
            x: 45,
            y: currPosition,
            size: nameSize,
            font,
            color: rgb(0, 0, 0)
        })


        for (const address of addresses) {
            const size = 20
            const height = font.heightAtSize(titleSize)

            currHeight += height + 10
            currPosition -= height + 5

            page.drawText(address, {
                x: 45,
                y: currPosition,
                size,
                font,
                color: rgb(0, 0, 0)
            })
        }

        page.drawRectangle({
            x: 40,
            y: currPosition - 10,
            width: 380,
            height: currHeight + 10,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1.5,
        })

        currHeight = 0

        const ref = Number(index) + 1
        currPosition = 550 + (ref * (50 * addresses.length + 1))
    }
}

async function save(filePath: string, pdfDoc: PDFDocument) {
    const pdfBytes = await pdfDoc.save();
    await fs.writeFileSync(filePath, pdfBytes);
}
