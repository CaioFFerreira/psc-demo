import React from "react";
import { Button, Card, Divider, Modal, Spin, Tooltip, Upload } from "antd";
import { EyeOutlined, UploadOutlined } from "@ant-design/icons";
import { ContainerDocuments, PDFControls, CardFooter } from "./style";
import { Document, Page, pdfjs } from "react-pdf";
import { OrderStatusContext } from "../../OrderStatusContext";
import useNotification from "../../../../hooks/useNotification";
import api from "../../../../services/api";
import Title from "../../../../components/shared/Title";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const DEFAULT_FILE_LIST = {
  1: { fileBase64: "", file: [] },
  2: { fileBase64: "", file: [] },
  3: { fileBase64: "", file: [] },
  4: { fileBase64: "", file: [] },
  5: { fileBase64: "", file: [] },
  6: { fileBase64: "", file: [] },
  7: { fileBase64: "", file: [] },
  8: { fileBase64: "", file: [] },
  9: { fileBase64: "", file: [] },
  10: { fileBase64: "", file: [] },
  11: { fileBase64: "", file: [] },
  12: { fileBase64: "", file: [] },
};

const EditUploadDocuments = () => {
  const { next, prev, orderUserRegistration } =
    React.useContext(OrderStatusContext);
  const [loading, setLoading] = React.useState(false);
  const { openNotificationWithIcon, contextHolder } = useNotification();

  const [numPages, setNumPages] = React.useState<any>(null);
  const [pageNumber, setPageNumber] = React.useState(1);

  const [fileListAll, setFileListAll] = React.useState<any>(DEFAULT_FILE_LIST);
  const [filePreview, setFilePreview] = React.useState<any>(null);

  const submitFiles = ({ file }: any, numberDoc: number) => {
    if (file.size > 5242880) {
      openNotificationWithIcon({
        type: "error",
        title: file.name,
        description: "Arquivo muito grande",
      });

      getFiles();
    } else {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);

      api
        .post(
          `/price/company-upload?userId=${orderUserRegistration.userId}&typeDocumentCompany=${numberDoc}`,
          formData,
          {
            headers: {
              "content-type": "multipart/form-data",
              Accept: "text/plain",
            },
          }
        )
        .then(() => {
          openNotificationWithIcon({
            type: "success",
            title: file.name,
            description: "Arquivo enviado com sucesso",
          });
        })
        .catch(() => {
          openNotificationWithIcon({
            type: "error",
            title: file.name,
            description: "Erro ao enviar o arquivo",
          });
        })
        .finally(() => {
          getFiles();
          setLoading(false);
        });
    }
  };

  const removeFile = (file: any) => {
    setLoading(true);
    api
      .delete(`/price/company-upload/${orderUserRegistration.userId}`)
      .then(() => {
        openNotificationWithIcon({
          type: "success",
          title: file.name,
          description: "Arquivo removido com sucesso",
        });
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          title: file.name,
          description: "Erro ao remover o arquivo",
        });
      })
      .finally(() => {
        getFiles();
        setLoading(false);
      });
  };

  function onDocumentLoadSuccess({ numPages }: any) {
    setNumPages(numPages);
  }

  const getFiles = () => {
    setLoading(true);
    api
      .get(`/price/company-upload/${orderUserRegistration.userId}`)
      .then(({ data }) => {
        const setBase64ToFileList = (base64: string) => {
          const file = new File([base64], "documento.pdf", {
            type: "application/pdf",
          });
          return file;
        };

        setFileListAll({
          1: {
            fileBase64: data.ccmei,
            file: data.ccmei ? [setBase64ToFileList(data.ccmei)] : [],
          },
          2: {
            fileBase64: data.simplesStatementLastYear,
            file: data.simplesStatementLastYear
              ? [setBase64ToFileList(data.simplesStatementLastYear)]
              : [],
          },
          3: {
            fileBase64: data.lastYearSocialIncomeTax,
            file: data.lastYearSocialIncomeTax
              ? [setBase64ToFileList(data.lastYearSocialIncomeTax)]
              : [],
          },
          4: {
            fileBase64: data.lastContractChange,
            file: data.lastContractChange
              ? [setBase64ToFileList(data.lastContractChange)]
              : [],
          },
          5: {
            fileBase64: data.irpjLastYear,
            file: data.irpjLastYear
              ? [setBase64ToFileList(data.irpjLastYear)]
              : [],
          },
          6: {
            fileBase64: data.lastYearRevenue,
            file: data.lastYearRevenue
              ? [setBase64ToFileList(data.lastYearRevenue)]
              : [],
          },

          7: {
            fileBase64: data.balanceSheetPreviousYear,
            file: data.balanceSheetPreviousYear
              ? [setBase64ToFileList(data.balanceSheetPreviousYear)]
              : [],
          },
          8: {
            fileBase64: data.currentYearBalanceSheet,
            file: data.currentYearBalanceSheet
              ? [setBase64ToFileList(data.currentYearBalanceSheet)]
              : [],
          },
          9: {
            fileBase64: data.drePreviousYear,
            file: data.drePreviousYear
              ? [setBase64ToFileList(data.drePreviousYear)]
              : [],
          },
          10: {
            fileBase64: data.dreCurrentYear,
            file: data.dreCurrentYear
              ? [setBase64ToFileList(data.dreCurrentYear)]
              : [],
          },
          11: {
            fileBase64: data.bankIndebtedness,
            file: data.bankIndebtedness
              ? [setBase64ToFileList(data.bankIndebtedness)]
              : [],
          },
          12: {
            fileBase64: data.others,
            file: data.others ? [setBase64ToFileList(data.others)] : [],
          },
        });
      })
      .catch(() => {
        openNotificationWithIcon({
          type: "error",
          title: "Erro",
          description: "Erro ao carregar os arquivos, tente novamente.",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  React.useEffect(() => {
    getFiles();
  }, []);

  const [previewOpen, setPreviewOpen] = React.useState(false);
  const handleCancel = () => {
    setPreviewOpen(false);
    setFilePreview(null);
    setPageNumber(1);
  };
  const handlePreview = (file: any) => {
    setFilePreview("data:application/pdf;base64," + file);
    setPreviewOpen(true);
  };

  return (
    <div>
      {contextHolder}
      <Title
        title="Carregar documentos"
        paragraph="Para fazermos o cadastro na Fleet, precisamos da foto de alguns
        documentos, eles são utilizados para validar e preencher o cadastro do cliente"
      />
      <Modal
        width={1000}
        open={previewOpen}
        title="Visualização do documento"
        footer={null}
        onCancel={handleCancel}
      >
        <Document onLoadSuccess={onDocumentLoadSuccess} file={filePreview}>
          <Page pageNumber={pageNumber} />
        </Document>
        <PDFControls className="pt--20">
          <Button
            size="small"
            disabled={pageNumber === 1}
            onClick={() => setPageNumber(pageNumber - 1)}
          >
            Anterior
          </Button>
          <p className="text--sm text--center">
            {pageNumber} de {numPages}
          </p>
          <Button
            size="small"
            onClick={() => setPageNumber(pageNumber + 1)}
            disabled={pageNumber === numPages}
          >
            Próxima
          </Button>
        </PDFControls>
      </Modal>

      <Spin spinning={loading} size="large">
        <ContainerDocuments>
          <Card title="Contrato Social ou CCMEI">
            <Upload
              name="contrato-social-ou-ccmei"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: false,
              }}
              fileList={fileListAll[1].file}
              beforeUpload={() => {
                return false;
              }}
              onChange={(e) => submitFiles(e, 1)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[1].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[1].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="Declaração do SIMPLES Último Ano">
            <Upload
              name="declaracao-do-simples-ultimo-ano"
              maxCount={1}
              accept=".pdf"
              fileList={fileListAll[2].file}
              showUploadList={{
                showRemoveIcon: false,
              }}
              beforeUpload={() => {
                return false;
              }}
              onChange={(e) => submitFiles(e, 2)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[2].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[2].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="IRPF do Socio Último Ano">
            <Upload
              name="irpf-do-socio-ultimo-ano"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: false,
              }}
              beforeUpload={() => {
                return false;
              }}
              fileList={fileListAll[3].file}
              onChange={(e) => submitFiles(e, 3)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[3].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[3].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="Última Alteração Contratual">
            <Upload
              name="ultima-alteracao-contratual"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: false,
              }}
              fileList={fileListAll[4].file}
              beforeUpload={() => {
                return false;
              }}
              onChange={(e) => submitFiles(e, 4)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[4].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[4].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="IRPJ Último Ano">
            <Upload
              name="irpj-ultimo-ano"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: false,
              }}
              fileList={fileListAll[5].file}
              beforeUpload={() => {
                return false;
              }}
              onChange={(e) => submitFiles(e, 5)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>

              {fileListAll[5].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[5].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="Relação de Faturamento Último Ano">
            <Upload
              name="relacao-de-faturamento-ultimo-ano"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: true,
              }}
              fileList={fileListAll[6].file}
              beforeUpload={() => {
                return false;
              }}
              onChange={(e) => submitFiles(e, 6)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[6].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[6].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="Balanço ano anterior">
            <Upload
              name="balanco-ano-anterior"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: false,
              }}
              beforeUpload={() => {
                return false;
              }}
              fileList={fileListAll[7].file}
              onChange={(e) => submitFiles(e, 7)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[7].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[7].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="Balanço ano vigente">
            <Upload
              name="balanco-ano-vigente"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: false,
              }}
              fileList={fileListAll[8].file}
              beforeUpload={() => {
                return false;
              }}
              onChange={(e) => submitFiles(e, 8)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[8].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[8].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="DRE ano anterior">
            <Upload
              name="dre-ano-anterior"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: false,
              }}
              beforeUpload={() => {
                return false;
              }}
              fileList={fileListAll[9].file}
              onChange={(e) => submitFiles(e, 9)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[9].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[9].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="DRE ano vigente">
            <Upload
              name="dre-ano-vigente"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: false,
              }}
              fileList={fileListAll[10].file}
              beforeUpload={() => {
                return false;
              }}
              onChange={(e) => submitFiles(e, 10)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[10].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[10].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="Relação de Endividamento Bancário">
            <Upload
              name="relacao-de-endividamento-bancario"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: false,
              }}
              fileList={fileListAll[11].file}
              beforeUpload={() => {
                return false;
              }}
              onChange={(e) => submitFiles(e, 11)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[11].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[11].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>

          <Card title="Outros">
            <Upload
              name="outros"
              maxCount={1}
              accept=".pdf"
              showUploadList={{
                showRemoveIcon: false,
              }}
              fileList={fileListAll[12].file}
              beforeUpload={() => {
                return false;
              }}
              onChange={(e) => submitFiles(e, 12)}
            >
              <Button icon={<UploadOutlined />}>Selecione seu arquivo</Button>
            </Upload>
            <Divider />
            <CardFooter>
              <p className="text--black text--xs">Arquivos PDF até 5 mb</p>
              {fileListAll[12].fileBase64 && (
                <Tooltip title="Visualizar documento">
                  <Button
                    onClick={() => handlePreview(fileListAll[12].fileBase64)}
                    type="primary"
                    shape="circle"
                    icon={<EyeOutlined />}
                  />
                </Tooltip>
              )}
            </CardFooter>
          </Card>
        </ContainerDocuments>
      </Spin>
      <div className="text--right pt--20">
        <Button onClick={() => prev()} className="mr--10">
          Voltar
        </Button>
        <Button type="primary" onClick={() => next()}>
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default EditUploadDocuments;
