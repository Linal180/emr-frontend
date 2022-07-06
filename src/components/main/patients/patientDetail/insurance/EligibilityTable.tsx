// packages block
import { FormProvider, useForm } from "react-hook-form";
import {
  Box, Table, TableBody, TableHead, TableRow, TableCell, Grid, Button, Typography,
} from "@material-ui/core";
// components block
import Search from "../../../../common/Search";
import Selector from "../../../../common/Selector";
import PageHeader from "../../../../common/PageHeader";
import BackButton from "../../../../common/BackButton";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { useTableStyles } from "../../../../../styles/tableStyles";
import { PatientSearchInputProps } from "../../../../../interfacesTypes";
import { renderTh } from "../../../../../utils";
import {
  ACTION, ALL_INSURANCES, CHECK_ELIGIBILITY, COVERAGE_ROUTE, ELIGIBILITY_BREAD, ELIGIBILITY_TABLE_DUMMY_DATA, INSURANCE,
  PATIENTS_ROUTE, STATUS, TIME_OF_CHECK
} from "../../../../../constants";
import { Link } from "react-router-dom";

const EligibilityTableComponent = () => {
  const classes = useTableStyles()

  const methods = useForm<PatientSearchInputProps>({ mode: "all" });
  const search = (query: string) => { }

  return (
    <>
      <Box display='flex'>
        <BackButton to={`${PATIENTS_ROUTE}`} />

        <Box ml={2}>
          <PageHeader
            title={CHECK_ELIGIBILITY}
            path={[ELIGIBILITY_BREAD]}
          />
        </Box>
      </Box>

      <Box className={classes.mainTableContainer}>
        <Grid container spacing={3}>
          <FormProvider {...methods}>
            <Grid item md={4} sm={12} xs={12}>
              <Box mt={2}>
                <Search search={search} />
              </Box>
            </Grid>

            <Grid item md={2} sm={12} xs={12}>
              <Selector
                name="insurances"
                label={ALL_INSURANCES}
                addEmpty
                options={[]}
              />
            </Grid>

            <Grid item md={2} sm={12} xs={12}>
              <Box mt={2.5}>
                <Button variant="contained" color="primary">{CHECK_ELIGIBILITY}</Button>
              </Box>
            </Grid>
          </FormProvider>
        </Grid>

        <Box className="table-overflow" mt={4}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(INSURANCE)}
                {renderTh(TIME_OF_CHECK)}
                {renderTh(STATUS)}
                {renderTh(ACTION)}
              </TableRow>
            </TableHead>

            <TableBody>
              {ELIGIBILITY_TABLE_DUMMY_DATA.map((item, id) => {
                const { insurance, time, status, action } = item;
                return (
                  <TableRow key={id}>
                    <TableCell scope="row"> {insurance}</TableCell>
                    <TableCell scope="row">{time}</TableCell>
                    <TableCell scope="row">{status}</TableCell>
                    <TableCell scope="row">
                      <Link to={COVERAGE_ROUTE}>
                        <Typography color="textSecondary" className="text-underline">{action}</Typography>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* {((!(loading) && !patients?.length) || (error)) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )} */}
        </Box>
      </Box>

      {/* {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            count={totalPages}
            shape="rounded"
            variant="outlined"
            page={page}
            onChange={handleChange}
          />
        </Box>
      )} */}
    </>
  )
}

export default EligibilityTableComponent;
