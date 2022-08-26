import { IconButton } from "@material-ui/core";
import { PDFDownloadLink } from "@react-pdf/renderer";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { DownloadIcon } from "../../../../assets/svgs";
import { LabTestsPayload, useFindLabResultInfoLazyQuery } from "../../../../generated/graphql";
import ResultDoc from "./ResultDoc";

const ResultDownloadLink = ({ orderNumber }: { orderNumber: string }) => {
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
      orderNumber && await findLabResultInfo({
        variables: {
          orderNumber: orderNumber
        }
      });
    } catch (error) { }
  }, [findLabResultInfo, orderNumber])

  useEffect(() => {
    orderNumber && fetchLabTests()
  }, [fetchLabTests, orderNumber])
  return (
    <PDFDownloadLink document={<ResultDoc labTest={labTest} />} fileName={`lab_orders_${orderNumber}_${moment(new Date()).format('DD_MM_YYYY_hh_mm_A')}`}>
      {({ blob, url, loading, error }) =>
        <IconButton disabled={loading}>
          <DownloadIcon />
        </IconButton>
      }

    </PDFDownloadLink>
  )
}

export default ResultDownloadLink