//packages block
import { BlobProvider, PDFViewer } from "@react-pdf/renderer";
import { useCallback, useEffect, useState } from "react";
import { Document, Page } from 'react-pdf/dist/umd/entry.webpack';
import { useParams } from "react-router";
//components
import Device from "./Device";
import ResultDoc from "./ResultDoc";
//constants, types, utils
import { LabTestsPayload, useFindLabResultInfoLazyQuery } from "../../../../generated/graphql";
import { ParamsType } from "../../../../interfacesTypes";

// Create Document Component
function LabResultDetail() {
  const { orderNum } = useParams<ParamsType>()
  const [labTest, setLabTest] = useState<LabTestsPayload['labTests']>()

  const { patient } = labTest?.[0] || {};
  const { facility } = patient || {}
  const { practice } = facility || {}
  const { attachments } = practice || {}
  const { url } = attachments?.[0] || {}

  const [findLabResultInfo] = useFindLabResultInfoLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setLabTest(null)
    },

    onCompleted(data) {
      const { findLabResultInfo } = data || {};

      if (findLabResultInfo) {
        const { labTests } = findLabResultInfo
        setLabTest(labTests as LabTestsPayload['labTests'])
      }
    }
  });

  const fetchLabTests = useCallback(async () => {
    try {
      orderNum && await findLabResultInfo({
        variables: {
          orderNumber: orderNum
        }
      });
    } catch (error) { }
  }, [findLabResultInfo, orderNum])

  useEffect(() => {
    orderNum && fetchLabTests()
  }, [fetchLabTests, orderNum])

  return (
    <Device>
      {({ isMobile }) => {
        if (isMobile) {
          return (
            <BlobProvider document={<ResultDoc labTest={labTest} attachmentUrl={url} />}>
              {({ blob, url, loading }) => {
                return loading ? <></> : (
                  <Document file={url}
                    renderMode="canvas">
                    <Page pageNumber={1}
                      width={window.innerWidth} />
                  </Document>
                );
              }}
            </BlobProvider>
          );
        }
        return (
          <PDFViewer style={{ width: "100%", height: `calc(100vh - 140px)`, }}>
            <ResultDoc labTest={labTest} attachmentUrl={url} />
          </PDFViewer>
        );
      }}
    </Device>

  );
}
export default LabResultDetail;
