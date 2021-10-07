import { Box, Button} from '@chakra-ui/react';
import React, {useState} from 'react';
import { createContent } from '../../utils/print/createContent';
import { Client, Order, Trader } from '../../utils/print/types';

const fs = window.require("fs");
const path = window.require("path");

import createFolder from '../../utils/createFolder';
import createPDF from '../../utils/createPDF';

const client: Client = {
  name: "Manoel Silveira Sales Neto",
  address: "Rua Fulano de tal, 123, Centro, São Paulo SP - Brasil",
  cpf: "561.184.880-02",
  phone: "(85) 99988-7766",
}

const order: Order = {
  id: "123456",
  discount: 13,
  paymentMethod: "PIX",
  products: [
      {
        amount: 34.90,
        name: "COMBO - Kefir de Água + Tampa de tecido para COPO", 
        quantity: 2
      },
      {
        amount: 48.90,
        name: "KOMBUCHÁ MUSHROOM ( Scoby inteiro - COM LÍQUIDO)", 
        quantity: 4
      },
      {
        amount: 40.15,
        name: "KOMBUCHÁ DO HIMALAIA (Scoby inteiro - SEM LÍQUIDO)", 
        quantity: 1
      },
      {
        amount: 27.90,
        name: "KOMBUCHÁ DO HIMALAIA", 
        quantity: 3
      }
  ],
  total: 81,
  subtotal: 81 - 13
}

const trader: Trader = {
  name: "Kefir Brasil",
  address: "Rua Fulano de tal, 123, Centro, São Paulo SP - Brasil",
  cnpj: "33.083.204/0001-92",
  phone: "(85) 99988-7766",
  site: "www.lojakefirbr.com"
}

const Teste: React.FC = () => {
  const [innerContent, setInnerContent] = useState<any>();

  
  const handleClick = async () => {
    const currentPath = process.cwd();
    const pdfFolder = `${currentPath}\\pdf`;
    createFolder(pdfFolder)

    const content = await createContent({
      client,
      order, 
      trader
    })

    const file = `${pdfFolder}\\teste.pdf`

    // Prod - Copiar Assets para dentro de 
    // const imagePath = path.join(__dirname, "..", "..", "..", "..", "assets", "logo.png");
    
    // Dev
    const imagePath = path.join(__dirname, "..", "..", "..", "..", "..", "..", "assets", "logo.png");
    
    const imageBuffer = fs.readFileSync(imagePath);
    await createPDF(content, file, imageBuffer);
  }

  return ( 
    <Box d="flex" alignItems="center" justifyContent="center" height="100vh">
      <Button
        marginTop="30px"
        colorScheme="blue"
        onClick={handleClick}
      >
        Formatar arquivo
      </Button>
      <Box dangerouslySetInnerHTML={{__html: innerContent}} />
    </Box>
  );
}

export default Teste;