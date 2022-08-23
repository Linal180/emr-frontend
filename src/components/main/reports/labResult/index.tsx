import { PDFViewer } from "@react-pdf/renderer";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router";
import { LabTestsPayload, useFindLabResultInfoLazyQuery } from "../../../../generated/graphql";
import { ParamsType } from "../../../../interfacesTypes";
import ResultDoc from "./ResultDoc";

// Create Document Component
function LabResultDetail() {
  const { orderNum } = useParams<ParamsType>()
  const [labTest, setLabTest] = useState<LabTestsPayload['labTests']>()

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
      <ResultDoc labTest={labTest} />
    </PDFViewer>
  );
}
export default LabResultDetail;
