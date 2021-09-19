import { Box, Button, Input, Spinner, Text, useDisclosure } from '@chakra-ui/react';
import React, { useCallback, useRef, useState } from 'react';
import { BiSpreadsheet } from 'react-icons/bi';
import { MdFileDownload } from 'react-icons/md';
import { read, utils, writeFile } from 'xlsx';

import { Modal } from '../../components/Model';
import { delay } from '../../utils/delay';
import { cepMask } from '../../utils/formatStrings';

enum FILE_SUBTYPES {
  XLSX = 'vnd.openxmlformats-officedocument.spreadsheetml.sheet',
}

const Home: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [haveFile, setHaveFile] = useState<boolean>(false);
  const [formatedData, setFormatedData] = useState<string[][]>();
  const [formatedDataWithStatus, setFormatedDataWithStatus] = useState<string[][]>();
  const inputRef = useRef<any>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleValidateFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    const subtype = file.type.split('/')[1];

    if (subtype !== FILE_SUBTYPES.XLSX) {
      inputRef.current.value = '';
      onOpen();
      setHaveFile(false);
    } else {
      setHaveFile(true);
    }
  };

  const handleFormatData = useCallback(async (data: unknown[]) => {
    const formatedData: string[][] = [];
    const formatedDataWithStatus: string[][] = [];

    data.forEach((value: any) => {
      const status = value[2];
      const nome = value[4];
      const cep = cepMask(value[16]);
      const logradouro = value[9];
      const numero = value[10];
      const complemento = value[11];
      const bairro = value[12];
      const cidade = value[13];
      const estado = value[14];

      if (status === 'Aguardando envio') {
        formatedData.push([nome, cep, logradouro, numero, complemento, bairro, cidade, estado]);
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

    await delay(2000);
    setLoading(false);
    setFormatedData(formatedData);
    setFormatedDataWithStatus(formatedDataWithStatus);
  }, []);

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
    setFormatedDataWithStatus(undefined);
  }

  return (
    <>
      <Box d="flex" alignItems="center" justifyContent="center" height="100vh">
        <Box
          d="flex"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
          height="300px"
          width="400px"
          padding="20px"
          border="2px solid"
          borderColor="#3182ce60"
        >
          {loading && (
            <>
              <Spinner
                thickness="4px"
                speed="0.65s"
                emptyColor="gray.200"
                color="#3182ce"
                size="xl"
              />
            </>
          )}
          {false && (
          // {!loading && !formatedData && (
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
            </>
          )}
          {/* {!!formatedData && !!formatedDataWithStatus && !loading && (  */}
          {true && (
            <>
              <Text fontSize="xl" textAlign="center">
                Planilha formatada com sucesso!
              </Text>
              {/* <Button
                rightIcon={<MdFileDownload />}
                onClick={() =>
                  handleCreateFile(formatedDataWithStatus, 'ped-aguard-envio-status.xlsx')
                }
                colorScheme="blue"
                marginTop="20px"
              >
                Baixar planilha com Status
              </Button> */}
              <Button
                rightIcon={<MdFileDownload />}
                onClick={() => handleCreateFile(formatedData, 'ped-aguard-envio.xlsx')}
                colorScheme="blue"
                marginTop="20px"
              >
                Baixar planilha para importação
              </Button>

              <Text fontSize="md" textAlign="center" onClick={handleReset} marginTop="20px">
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
