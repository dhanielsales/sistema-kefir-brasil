import { Box, Button, Input, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useRef, useState } from 'react';
import { BiSpreadsheet } from 'react-icons/bi';
import { MdFileDownload, MdCreateNewFolder } from 'react-icons/md';
import { read, utils, writeFile } from 'xlsx';

import { format } from 'date-fns';

import { Modal } from '../../components/Model';
import { delay } from '../../utils/delay';
import { amount, cepMask, phoneMask } from '../../utils/formatStrings';

import { createContent } from '../../utils/print/createContent';
import { Order, Trader } from '../../utils/print/types';

const fs = window.require("fs");
const path = window.require("path");
const childProcess = window.require('child_process')

import createFolder from '../../utils/createFolder';
import createPDF from '../../utils/createPDF';
import createPDFCorreios from '../../utils/createPDFCorreios';

enum FILE_SUBTYPES {
  XLSX = 'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

const trader: Trader = {
  name: "Kefir Brasil",
  phone: "(85) 99988-7766",
  site: "www.lojakefirbr.com"
}

interface OrderList {
  [key: string]: Order
}

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [haveFile, setHaveFile] = useState<boolean>(false);
  const [formatedData, setFormatedData] = useState<string[][]>();
  const [formatedDataForPDFs, setFormatedDataForPDFs] = useState<OrderList>();
  const inputRef = useRef<any>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleValidateFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];
      const subtype = file.type.split('/')[1];

      if (subtype !== FILE_SUBTYPES.XLSX) {
        inputRef.current.value = '';
        onOpen();
        setHaveFile(false);
      } else {
        setHaveFile(true);
      }
    }
  };

  const handleFormatData = useCallback(async (data: unknown[]) => {
    const formatedData: string[][] = [];
    const formatedDataCorreios: string[][] = [];
    const formatedDataWithStatus: string[][] = [];
    let currentOrder: Order;
    const orders: OrderList = {};

    data.forEach((value: any) => {
      const status = value[2];
      const nome = value[4];
      const logradouro = value[9];
      const numero = value[10];
      const complemento = value[11];
      const bairro = value[12];
      const cidade = value[13];
      const estado = value[14];
      const cep = cepMask(value[16]);

      const orderId = Number(value[0]);
      const frete = amount(value[17]);
      const subtotal = amount(value[18]);
      const discount = amount(value[19]);
      const paymentMethod = value[26];

      const idProd = Number(value[20]);
      const nomeProd = value[21];
      const valorProd = amount(value[22]);
      const qtdeProd = value[23];

      const nomeClient = value[4]
      const addressClient = `${value[9]} ${value[10]}, ${value[11] ? value[11] : ''}, ${value[12]}, ${value[13]} - ${value[14]} ${cepMask(value[16])}`
      const phoneClient = phoneMask(value[7])

      if (status === 'Aguardando envio') {
        if (currentOrder?.id === orderId) {
          currentOrder.subtotal += valorProd + discount
          currentOrder.total += valorProd + discount
          currentOrder.products.push({
            id: idProd,
            name: nomeProd,
            amount: valorProd + discount,
            quantity: qtdeProd,
          })
        } else {
          currentOrder = {
            id: orderId,
            discount,
            paymentMethod,
            client: {
              name: nomeClient,
              address: addressClient,
              phone: phoneClient
            },
            total: amount(String(valorProd + discount)),
            subtotal:  amount(String(valorProd + discount)),
            products: [
              {
                id: idProd,
                name: nomeProd,
                amount: valorProd + discount,
                quantity: qtdeProd,
              }
            ]
          }
        }
        orders[orderId] = currentOrder;

        formatedData.push([nome, cep, logradouro, numero, complemento, bairro, cidade, estado]);
        formatedDataCorreios.push([orderId, nome, cep, logradouro, numero, complemento, bairro, cidade, estado]);
        formatedDataWithStatus.push([
          status,
          nome,
          cep,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
        ]);
      }
    });

    await delay(1000);
    setLoading(false);
    setFormatedData(formatedData);
    setFormatedDataForPDFs(orders)

    await handlePDFs(orders)
    await handlePDFsCorreios(formatedDataCorreios)
  }, []);

  const handlePDFs = useCallback(async (orderList: OrderList) => {
    const currentPath = process.cwd();
    const pdfFolder = path.join(currentPath, 'pdf');
    const currentDayFolder = path.join(pdfFolder, `${format(new Date(), 'dd-MM-yyyy')}`);

    createFolder(currentDayFolder)

    for (const [key, value] of Object.entries(orderList)) {
      const content = await createContent({
        client: value.client,
        order: value,
        trader
      })

      const file = path.join(currentDayFolder, `${key}.pdf`);

      let imagePath: string

      if (process.env.NODE_ENV === 'production') {
        // Prod
        imagePath = path.join(__dirname, "..", "..", "..", "..", "assets", "logo.png");
      } else {
        // Dev
        imagePath = path.join(__dirname, "..", "..", "..", "..", "..", "..", "assets", "logo.png");
      }

      const imageBuffer = fs.readFileSync(imagePath);
      await createPDF(content, file, imageBuffer);
    }
}, [])

const handlePDFsCorreios = useCallback(async (data: string[][]) => {
  const currentPath = process.cwd();
  const pdfFolder = path.join(currentPath, 'etiquetas');
  const currentDayFolder = path.join(pdfFolder, `${format(new Date(), 'dd-MM-yyyy')}`);

  createFolder(currentDayFolder)
  for (const curr of data) {
    const [orderId, nome, cep, logradouro, numero, complemento, bairro, cidade, estado] = curr
    const file = path.join(currentDayFolder, `${orderId}.pdf`);
    const currObj = {
      nome: nome ? String(nome).trim() : '',
      cep: cep ? String(cep).trim() : '',
      logradouro: logradouro ? String(logradouro).trim() : '',
      numero: numero ? String(numero).trim() : '',
      complemento: complemento ? String(complemento).trim() : '',
      bairro: bairro ? String(bairro).trim() : '',
      cidade: cidade ? String(cidade).trim() : '',
      estado: estado ? String(estado).trim() : '',
     }

     await createPDFCorreios(currObj, file);
  }
}, [])

  const handleFileUpload = () => {
    setLoading(true);
    const file = inputRef.current.files[0];
    const reader = new FileReader();
    if (file) {
      reader.onload = function (e: any) {
        const data = e.target.result;
        const readedData = read(data, { type: 'binary' });
        const wsname = readedData.SheetNames[0];
        const ws = readedData.Sheets[wsname];

        const dataParse = utils.sheet_to_json(ws, { header: 1 });
        handleFormatData(dataParse);
      };
      reader.readAsBinaryString(file);
    }
  };

  const handleCreateFile = (data: string[][], fileName: string) => {
    const workbook = utils.book_new();
    const workSheet = utils.aoa_to_sheet(data);
    utils.book_append_sheet(workbook, workSheet, 'SheetJS');
    writeFile(workbook, fileName);
  };

  const handleReset = () => {
    setLoading(false);
    setHaveFile(false);
    setFormatedData(undefined);
    setFormatedDataForPDFs(undefined)
  }

  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="center" height="100vh">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          height="400px"
          width="400px"
          padding="20px"
          border="2px solid"
          borderColor="#3182ce60"
        >
          {loading && (
            <Spinner
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="#3182ce"
              size="xl"
            />
          )}
          {!loading && !formatedData && (
            <>
              <Text fontSize="xl" marginBottom="10px" fontWeight="bold">
                Formatador de planilha
              </Text>

              <Text fontSize="md" textAlign="center">
                Adicione sua planilha para converter os dados dela no formato desejado
              </Text>

              <Input
                type="file"
                name="file"
                marginTop="30px"
                padding="4px"
                accept=".xlsx"
                multiple={false}
                ref={inputRef}
                onChange={handleValidateFile}
              />

              <Button
                marginTop="30px"
                rightIcon={<BiSpreadsheet />}
                colorScheme="blue"
                isLoading={loading}
                isDisabled={!haveFile}
                onClick={handleFileUpload}
              >
                Formatar arquivo
              </Button>
              <Button
                rightIcon={<MdCreateNewFolder />}
                onClick={() => childProcess.exec(`explorer.exe "${process.cwd()}"`)}
                colorScheme="blue"
                marginTop="20px"
              >
                Abrir pasta geral
              </Button>
            </>
          )}
          {!!formatedData && !!formatedDataForPDFs && !loading && (
            <>
              <Text fontSize="xl" textAlign="center">
                Processo concluído! <br />
                Planilha formatada com sucesso! <br />
                PDFs gerados com sucesso!
              </Text>

              <Button
                rightIcon={<MdFileDownload />}
                onClick={() => formatedData && handleCreateFile(formatedData, 'ped-aguard-envio.xlsx')}
                colorScheme="blue"
                marginTop="20px"
              >
                Baixar planilha para importação
              </Button>

              <Button
                rightIcon={<MdCreateNewFolder />}
                onClick={() => childProcess.exec(`explorer.exe "${process.cwd()}\\pdf"`)}
                colorScheme="blue"
                marginTop="20px"
              >
                Abrir pasta com Cupons Fiscais em PDF
              </Button>


              <Button
                rightIcon={<MdCreateNewFolder />}
                onClick={() => childProcess.exec(`explorer.exe "${process.cwd()}\\etiquetas"`)}
                colorScheme="blue"
                marginTop="20px"
              >
                Abrir pasta com Etiquetas em PDF
              </Button>
              <Text
                fontSize="md"
                textAlign="center"
                onClick={handleReset}
                marginTop="20px"
                textDecoration="underline"
                cursor="pointer"
                transition="all .2s"
                fontWeight="bold"
                _hover={{color: "#3182CE"}}
              >
                Voltar
              </Text>
            </>
          )}
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Home;
