// packages block
import { FC, } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Box, Grid, Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
// components block
import Search from "../../common/Search";
import HeaderSelector from "../../common/HeaderSelector";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { useTableStyles } from "../../../styles/tableStyles";
import { EditNewIcon, TrashNewIcon } from "../../../assets/svgs";
import { renderTh } from "../../../utils";
import {
  ACTION, CHARGE_DOLLAR, CODE, DESCRIPTION, EFFECTIVE_DATE, EXPIRY_DATE, FEE_SCHEDULE_DUMMY_DATA,
  MODIFIER, PRICING,
} from "../../../constants";

const FeeTable: FC = (): JSX.Element => {
  const classes = useTableStyles()
  const methods = useForm({ mode: "all" });
  const search = (query: string) => { };

  return (
    <>
      <Box className={classes.mainTableContainer}>
        <Box mt={2} mb={1}>
          <Grid container spacing={3}>
            <Grid item md={4} sm={12} xs={12}>
              <Search search={search} />
            </Grid>

            <Grid item md={1} sm={12} xs={12}>
              <FormProvider {...methods}>
                <HeaderSelector
                  name="pricing"
                  label={PRICING}
                />
              </FormProvider>
            </Grid>
          </Grid>
        </Box>

        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(CODE)}
                {renderTh(MODIFIER)}
                {renderTh(DESCRIPTION)}
                {renderTh(EFFECTIVE_DATE)}
                {renderTh(EXPIRY_DATE)}
                {renderTh(CHARGE_DOLLAR)}
                {renderTh(ACTION, "center")}
              </TableRow>
            </TableHead>

            <TableBody>
              {FEE_SCHEDULE_DUMMY_DATA.map((item, index) => {
                const { code, modifier, description, effectiveDate, expiryDate, charge } = item;
                return (
                  <TableRow key={index}>
                    <TableCell scope="row">{code}</TableCell>
                    <TableCell scope="row">{modifier}</TableCell>
                    <TableCell scope="row">{description}</TableCell>
                    <TableCell scope="row">{effectiveDate}</TableCell>
                    <TableCell scope="row">{expiryDate}</TableCell>
                    <TableCell scope="row">{charge}</TableCell>
                    <TableCell scope="row">
                      <Box display="flex" alignItems="center" minWidth={100} justifyContent="center">
                        <Box className={classes.iconsBackground}>
                          <EditNewIcon />
                        </Box>

                        <Box className={classes.iconsBackground}>
                          <TrashNewIcon />
                        </Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              }
              )}
            </TableBody>
          </Table>
        </Box>
      </Box>

      {/* {totalPages > 1 && (
        <Box display="flex" justifyContent="flex-end" p={3}>
          <Pagination
            shape="rounded"
            variant="outlined"
            page={page}
            count={totalPages}
            onChange={handleChange}
          />
        </Box>
      )} */}
    </>
  );
};

export default FeeTable;
