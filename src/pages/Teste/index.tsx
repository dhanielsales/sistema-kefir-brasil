import { Box, Button} from '@chakra-ui/react';
import React, {useState} from 'react';
import { CreatePDF } from '../../utils/print/CreatePDFs';
import { Client, Order, Trader } from '../../utils/print/types';

import fs from 'fs';
import path from 'path';

const Teste: React.FC = () => {
  const [innerContent, setInnerContent] = useState<any>();

  // const handleClick = () => {
  //   const client: Client = {
  //     name: "Manoel Silveira Sales Neto",
  //     address: "Rua Fulano de tal, 123, Centro, São Paulo SP - Brasil",
  //     cpf: "561.184.880-02",
  //     phone: "(85) 99988-7766",
  //   }
  //   const order: Order = {
  //     id: "123456",
  //     discount: 13,
  //     paymentMethod: "PIX",
  //     products: [
  //         {
  //           amount: 23,
  //           name: "Caixa de coisas", 
  //           quantity: 2
  //         },
  //         {
  //           amount: 35,
  //           name: "Kefir de água", 
  //           quantity: 1
  //         }
  //     ],
  //     total: 81,
  //     subtotal: 81 - 13
  //   }
  //   const trader: Trader = {
  //     name: "Kefir Brasil",
  //     address: "Rua Fulano de tal, 123, Centro, São Paulo SP - Brasil",
  //     cnpj: "33.083.204/0001-92",
  //     phone: "(85) 99988-7766",
  //     site: "www.lojakefirbr.com"
  //   }
    
  //   const content = CreatePDF({
  //     client,
  //     order, 
  //     trader
  //   })

  //   console.log(content)
  //   setInnerContent(content)
  // }

  const handleClick = () => {
    const currentPath = path.dirname(__dirname);
    alert(`currentPath ${currentPath}`)
    alert(`process.cwd() ${process.cwd()}`)
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