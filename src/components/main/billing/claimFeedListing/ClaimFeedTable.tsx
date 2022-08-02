// packages block
import {
  Box, Button, Card, Collapse, Grid, Table, TableBody, TableCell, TableHead, TableRow, Typography
} from "@material-ui/core";
import { ExpandLess, ExpandMore } from "@material-ui/icons";
import { Pagination } from "@material-ui/lab";
import { ChangeEvent, FC, useCallback, useEffect, useMemo, useState } from "react";
import { CSVLink } from "react-csv";
import { FormProvider, useForm } from "react-hook-form";
// components block
import moment from "moment";
import Alert from "../../../common/Alert";
import Loader from "../../../common/Loader";
import DatePicker from "../../../common/DatePicker";
import ItemSelector from "../../../common/ItemSelector";
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
import FacilitySelector from "../../../common/Selector/FacilitySelector";
import LogsPatientSelector from "../../../common/userLogs/PatientSelector";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { DownloadIconWhite } from "../../../../assets/svgs";
import {
  ADJUSTMENT, ALLOWED, APPLY_FILTER, BILLED, CLAIM_FEED_TEXT, CLAIM_ID, CLEAR_FILTER, DATE_OF_SERVICE, EMPTY_OPTION,
  EXPORT_TO_FILE, FACILITY, FROM_DATE, INS, INS_1, INS_PAID, ITEM_MODULE, PAGE_LIMIT, PATIENT, PAYER, PT_PAID, SYNC, 
  TOTALS, TO_DATE, UPDATE_FILTER
} from "../../../../constants";
import { 
  LiveClaimFeedPayload, useCreateLiveClaimFeedMutation, useFindAllLiveClaimFeedsLazyQuery 
} from "../../../../generated/graphql";
import { ClaimFeedAdvanceSearchInputProps, ClaimFeedAdvanceSearchProps } from "../../../../interfacesTypes";
import { useTableStyles } from "../../../../styles/tableStyles";
import { BLACK_TWO, GREY_FIVE } from "../../../../theme";
import { getArrayOfObjSum, getFormatDateString, renderTh } from "../../../../utils";

const headers = [
  { label: CLAIM_ID, key: "claimId" },
  { label: PATIENT, key: "patient" },
  { label: DATE_OF_SERVICE, key: "dos" },
  { label: FACILITY, key: "facilityName" },
  { label: BILLED, key: "billed" },
  { label: ALLOWED, key: "allowed" },
  { label: ADJUSTMENT, key: "adjustment" },
  { label: INS_PAID, key: "insPaid" },
  { label: PT_PAID, key: "patientPaid" },
  { label: INS, key: "insuranceName" }
];

const ClaimFeedTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const [advanceSearchOpen, setAdvanceSearchOpen] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [page, setPage] = useState(1)
  const [liveClaimFeeds, setLiveClaimFeeds] = useState<LiveClaimFeedPayload['liveClaimFeeds']>()

  const methods = useForm<ClaimFeedAdvanceSearchProps>({
    mode: "all",
  });

  const { watch, setValue } = methods
  const { claimFeedFacilityName, claimFeedFromDate, claimFeedPatientName, claimFeedPayerId, claimFeedToDate } = watch()

  const handleChange = (_: ChangeEvent<unknown>, page: number) => {
    setPage(page)
  }

  const [findAllLiveClaimFeedsQuery, { loading, error }] = useFindAllLiveClaimFeedsLazyQuery({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError() {
      setLiveClaimFeeds([])
      setTotalPages(0)
    },

    onCompleted(data) {
      const { findAllLiveClaimFeeds } = data || {};

      if (findAllLiveClaimFeeds) {
        const { pagination, liveClaimFeeds } = findAllLiveClaimFeeds
        liveClaimFeeds && setLiveClaimFeeds(liveClaimFeeds as LiveClaimFeedPayload['liveClaimFeeds'])


        if (pagination) {
          const { totalPages } = pagination
          typeof totalPages === 'number' && setTotalPages(totalPages)
        }
      } else {
        setLiveClaimFeeds([])
      }
    }
  });

  const findAllLiveClaimFeeds = useCallback(async (inputs?: ClaimFeedAdvanceSearchInputProps) => {
    try {
      const pageInputs = { paginationOptions: { page, limit: PAGE_LIMIT } }

      await findAllLiveClaimFeedsQuery({
        variables: {
          liveClaimFeedInput: {
            ...pageInputs,
            ...(inputs ? inputs : {})
          }
        }
      })
    } catch (error) { }
  }, [page, findAllLiveClaimFeedsQuery])

  const [createLiveClaimFeed, { loading: createLiveClaimFeedLoading }] = useCreateLiveClaimFeedMutation({
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",

    onError(error) {
      Alert.error(error.message)
    },

    onCompleted(data) {
      if (data) {
        findAllLiveClaimFeeds()
      }
    }
  });

  useEffect(() => {
    findAllLiveClaimFeeds()
  }, [page, findAllLiveClaimFeeds]);

  const totalAmounts = useMemo(() => {
    if (!liveClaimFeeds?.length) {
      return {}
    }

    const totalBilled = getArrayOfObjSum(liveClaimFeeds, 'totalCharge')
    const insTotalPaid = getArrayOfObjSum(liveClaimFeeds, 'totalPaid')
    const totalAllowed = liveClaimFeeds.reduce((acc: any, value: any) => {
      const parseCharge = JSON.parse(value.charge)
      const allowedAmount = getArrayOfObjSum(parseCharge, 'allowed')
      acc += allowedAmount
      return acc
    }, 0)

    const totalAdjustments = liveClaimFeeds.reduce((acc: any, value: any) => {
      const parseCharge = JSON.parse(value.charge)
      const allowedAmount = parseCharge.reduce((acc: any, value: any) => {
        acc += getArrayOfObjSum(value.adjustment, 'amount')
        return acc
      }, 0)
      acc += allowedAmount
      return acc
    }, 0)

    const totalPatPaid = liveClaimFeeds.reduce((acc: any, value: any) => {
      const parseCharge = JSON.parse(value.charge)
      const allowedAmount = parseCharge.reduce((acc: any, value: any) => {
        const filteredAdjustments = value.adjustment?.filter((adjustmentValue: any) => adjustmentValue.group === 'PR')
        return acc += getArrayOfObjSum(filteredAdjustments, 'amount')
      }, 0)
      acc += allowedAmount
      return acc
    }, 0)

    return {
      totalBilled,
      insTotalPaid,
      totalAllowed,
      totalAdjustments,
      totalPatPaid
    }
  }, [liveClaimFeeds])

  const csvData = useMemo(() => {
    if (!!liveClaimFeeds?.length) {
      return (liveClaimFeeds.map((item) => {
        const { eraId, patientFullName, fromDos, provName, charge, payerName } = item || {}
        const parseCharge = JSON.parse(charge)
        const allowedAmount = getArrayOfObjSum(parseCharge, 'allowed')
        const insPaidAmount = getArrayOfObjSum(parseCharge, 'paid')
        const billedAmount = getArrayOfObjSum(parseCharge, 'charge')
        const adjustedAmount = parseCharge.reduce((acc: any, value: any) => {
          acc += getArrayOfObjSum(value.adjustment, 'amount')
          return acc
        }, 0)

        const patAmount = parseCharge.reduce((acc: any, value: any) => {
          const filteredAdjustments = value.adjustment?.filter((adjustmentValue: any) => adjustmentValue.group === 'PR')
          return acc += getArrayOfObjSum(filteredAdjustments, 'amount')
        }, 0)

        return {
          claimId: eraId,
          patient: patientFullName,
          dos: getFormatDateString(fromDos, 'MM/DD/YYYY'),
          facilityName: provName,
          billed: billedAmount,
          allowed: allowedAmount,
          adjustment: adjustedAmount,
          insPaid: insPaidAmount,
          patientPaid: patAmount,
          insuranceName: payerName
        }
      }) ?? []) as object[]
    }

    return []
  }, [liveClaimFeeds])

  const handleAdvanceSearch = () => {
    const facilityName = claimFeedFacilityName?.name === '--' ? '' : claimFeedFacilityName?.name
    const patientName = claimFeedPatientName?.name === '--' ? '' : claimFeedPatientName?.name
    const payerName = claimFeedPayerId?.name === '--' ? '' : claimFeedPayerId?.name?.split(" |")?.[0]

    findAllLiveClaimFeeds({
      claimFeedFacilityName: facilityName || '',
      claimFeedPatientName: patientName || '',
      claimFeedPayerId: payerName || '',
      claimFeedFromDate,
      claimFeedToDate
    })
  }

  const handleClear = () => {
    setValue('claimFeedFacilityName', EMPTY_OPTION)
    setValue('claimFeedPatientName', EMPTY_OPTION)
    setValue('claimFeedPayerId', EMPTY_OPTION)
    setValue('claimFeedFromDate', null)
    setValue('claimFeedToDate', null)

    findAllLiveClaimFeeds()
  }

  if (createLiveClaimFeedLoading) {
    return <Loader loading loaderText="Syncing Claim Feeds..." />
  }

  return (
    <>
      <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4" color="textPrimary">{CLAIM_FEED_TEXT}</Typography>

        <Box display='flex'>
          <CSVLink data={csvData as object[]} headers={headers} className="csvLink"
            filename={`live_claim_feed_data_${moment(new Date()).format('DD_MM_YYYY_hh_mm_A')}`}>
            <Button variant="contained" startIcon={<DownloadIconWhite />} color="secondary">
              {EXPORT_TO_FILE}
            </Button>
          </CSVLink>

          <Box p={1} />

          <Button
            variant="outlined"
            color="secondary"
            onClick={() => createLiveClaimFeed()}
          >
            {SYNC}
          </Button>
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form>
          <Card>
            <Box p={3}>
              <Box
                onClick={() => setAdvanceSearchOpen(!advanceSearchOpen)}
                className='pointer-cursor'
                border={`1px solid ${GREY_FIVE}`} borderRadius={4}
                color={BLACK_TWO} p={1.35} display='flex' width={140}
              >
                <Typography variant="body1">{APPLY_FILTER}</Typography>
                {advanceSearchOpen ? <ExpandLess /> : <ExpandMore />}
              </Box>

              <Collapse in={advanceSearchOpen} mountOnEnter unmountOnExit>
                <FormProvider {...methods}>
                  <Box mt={4}>
                    <Grid container spacing={2} direction="row">
                      <Grid item xs={12} sm={12} md={12} lg={9}>
                        <Grid container spacing={3} direction="row">
                          <Grid item xs={12} sm={6} md={3} lg={2}>
                            <FacilitySelector
                              addEmpty
                              label={FACILITY}
                              name="claimFeedFacilityName"
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={3} lg={3}>
                            <LogsPatientSelector
                              addEmpty
                              label={PATIENT}
                              name="claimFeedPatientName"
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={3} lg={3}>
                            <ItemSelector
                              addEmpty
                              label={PAYER}
                              name="claimFeedPayerId"
                              modalName={ITEM_MODULE.insurance}
                            />
                          </Grid>

                          <Grid item xs={12} sm={6} md={3} lg={2}>
                            <DatePicker label={FROM_DATE} name="claimFeedFromDate" />
                          </Grid>

                          <Grid item xs={12} sm={6} md={3} lg={2}>
                            <DatePicker label={TO_DATE} name="claimFeedToDate" />
                          </Grid>
                        </Grid>
                      </Grid>

                      {/* <Grid item xs={12} sm={12} md={12} lg={3}>
                        <Grid container spacing={3} direction="row">
                          <Grid item xs={12} sm={12} md={3}>
                            <InputController
                              fieldType="text"
                              controllerName="payerId"
                              controllerLabel={PAYER_ID}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={3}>
                            <InputController
                              fieldType="text"
                              controllerName="drClaim"
                              controllerLabel={DR_CLAIM_NO}
                            />
                          </Grid>
                        </Grid>
                      </Grid> */}

                      <Grid item xs={12} sm={12} md={12} lg={3}>
                        <Box display="flex" alignItems="flex-baseline" flexWrap="wrap">
                          <Box mx={0.7} mt={2.5}>
                            <Button variant="contained" color="secondary" onClick={handleAdvanceSearch}>
                              {UPDATE_FILTER}
                            </Button>
                          </Box>

                          {/* <Box ml={2} minWidth={180}>
                            <Selector
                              value={EMPTY_OPTION}
                              label={DISPLAY_COLUMNS}
                              name="displayColumns"
                              options={MAPPED_STATES}
                            />
                          </Box> */}

                          <Box mx={0.7} mt={2.5}>
                            <Button variant="outlined" color="default" onClick={handleClear}>
                              {CLEAR_FILTER}
                            </Button>
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>
                  </Box>
                </FormProvider>
              </Collapse>

              <Box mt={3} className="table-overflow">
                <Table aria-label="customized table">
                  <TableHead>
                    <TableRow>
                      {/* {renderTh(INFO)} */}
                      {renderTh(CLAIM_ID)}
                      {renderTh(PATIENT)}
                      {renderTh(DATE_OF_SERVICE)}
                      {renderTh(FACILITY)}
                      {renderTh(BILLED)}
                      {renderTh(ALLOWED)}
                      {renderTh(ADJUSTMENT)}
                      {renderTh(INS_PAID)}
                      {renderTh(PT_PAID)}
                      {/* {renderTh(INS_BAL)} */}
                      {/* {renderTh(PT_LINE_ITEM_BAL)} */}
                      {/* {renderTh(CLAIM_BAL)} */}
                      {/* {renderTh(EXP_REIMBURSEMENT)} */}
                      {renderTh(INS_1)}
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow className={classes.firstRowBg}>
                      {/* <TableCell scope="row"></TableCell> */}
                      <TableCell scope="row"></TableCell>
                      <TableCell scope="row"></TableCell>
                      <TableCell scope="row"></TableCell>
                      <TableCell scope="row">
                        <Typography color="secondary">{TOTALS}</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">${totalAmounts.totalBilled}</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">${totalAmounts.totalAllowed}</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">${totalAmounts.totalAdjustments}</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">${totalAmounts.insTotalPaid}</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">${totalAmounts.totalPatPaid}</Typography>
                      </TableCell>

                      {/* <TableCell scope="row">
                        <Typography color="secondary">$630.44</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$396.84</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$630.44</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$630.44</Typography>
                      </TableCell>

                      <TableCell scope="row">
                        <Typography color="secondary">$275.43</Typography>
                      </TableCell> */}

                      <TableCell scope="row"></TableCell>
                    </TableRow>

                    {liveClaimFeeds?.map((item, index) => {
                      const {
                        charge, patientFullName, fromDos, provName, eraId, payerName
                      } = item || {};
                      const parseCharge = JSON.parse(charge)
                      const allowedAmount = getArrayOfObjSum(parseCharge, 'allowed')
                      const insPaidAmount = getArrayOfObjSum(parseCharge, 'paid')
                      const billedAmount = getArrayOfObjSum(parseCharge, 'charge')
                      const adjustedAmount = parseCharge.reduce((acc: any, value: any) => {
                        acc += getArrayOfObjSum(value.adjustment, 'amount')
                        return acc
                      }, 0)

                      const patAmount = parseCharge.reduce((acc: any, value: any) => {
                        const filteredAdjustments = value.adjustment?.filter((adjustmentValue: any) => adjustmentValue.group === 'PR')
                        return acc += getArrayOfObjSum(filteredAdjustments, 'amount')
                      }, 0)

                      return (
                        <TableRow key={index} className={classes.tableRowRoot}>
                          {/* <TableCell scope="row">
                            {info}
                          </TableCell> */}

                          <TableCell scope="row">
                            {eraId}
                          </TableCell>

                          <TableCell scope="row">
                            {patientFullName}
                          </TableCell>

                          <TableCell scope="row">
                            {getFormatDateString(fromDos, 'MM/DD/YYYY')}
                          </TableCell>

                          <TableCell scope="row">
                            {provName}
                          </TableCell>

                          <TableCell scope="row">
                            {billedAmount}
                          </TableCell>

                          <TableCell scope="row">
                            {allowedAmount}
                          </TableCell>

                          <TableCell scope="row">
                            {adjustedAmount}
                          </TableCell>

                          <TableCell scope="row">
                            {insPaidAmount}
                          </TableCell>

                          {/* <TableCell scope="row">
                            {ins2Paid}
                          </TableCell> */}

                          <TableCell scope="row">
                            {patAmount}
                          </TableCell>

                          {/* <TableCell scope="row">
                            {insBal}
                          </TableCell>

                          <TableCell scope="row">
                            {ptLineItemBal}
                          </TableCell>

                          <TableCell scope="row">
                            {claimBal}
                          </TableCell>

                          <TableCell scope="row">
                            {expReimbursement}
                          </TableCell> */}

                          <TableCell scope="row">
                            {payerName}...
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>

                {((!(loading) && !liveClaimFeeds?.length) || (error)) && (
                  <Box display="flex" justifyContent="center" pb={12} pt={5}>
                    <NoDataFoundComponent />
                  </Box>
                )}
              </Box>
            </Box>
          </Card>
        </form>
      </FormProvider>

      {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            count={totalPages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )}
    </>
  );
};

export default ClaimFeedTable;
