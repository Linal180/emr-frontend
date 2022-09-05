import { PDFViewer } from "@react-pdf/renderer";
import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../../../../context";
import { LabTestsPayload, useFindLabResultInfoLazyQuery } from "../../../../generated/graphql";
import { ParamsType } from "../../../../interfacesTypes";
import ResultDoc from "./ResultDoc";

// Create Document Component
function LabResultDetail() {
  const { orderNum } = useParams<ParamsType>()
  const [labTest, setLabTest] = useState<LabTestsPayload['labTests']>()
  const { user } = useContext(AuthContext)
  const { facility } = user || {}
  const { practice } = facility || {}
  const { attachments } = practice || {}
  const { preSignedUrl } = attachments?.[0] || {}

  console.log("preSignedUrl", preSignedUrl)

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
    <PDFViewer style={{ width: "100%", height: `calc(100vh - 140px)`, }}>
      <ResultDoc labTest={labTest} attachmentUrl={preSignedUrl} />
    </PDFViewer>
  );
}
export default LabResultDetail;
