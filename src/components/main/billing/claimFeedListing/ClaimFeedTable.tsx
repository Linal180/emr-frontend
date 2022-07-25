// packages block
import { FC, } from "react";
import { Box, Button, Table, TableBody, TableHead, TableRow, Typography } from "@material-ui/core";
// components block
import NoDataFoundComponent from "../../../common/NoDataFoundComponent";
// graphql, constants, context, interfaces/types, reducer, svgs and utils block
import { renderTh } from "../../../../utils";
import { PATIENT, VISIT, PROVIDER, FACILITY, BILLED, CLAIMED, STATUS, CLAIM_FEED_TEXT, EXPORT_TO_FILE, SCHEDULE } from "../../../../constants";
import { useTableStyles } from "../../../../styles/tableStyles";
import { AddWhiteIcon } from "../../../../assets/svgs";
import InputController from "../../../../controller";
import { FormProvider, useForm } from "react-hook-form";

const ClaimFeedTable: FC = (): JSX.Element => {
  const classes = useTableStyles()

  const methods = useForm({
    mode: "all",
  });

  return (
    <>
      <Box mb={2} display='flex' justifyContent='space-between' alignItems='center'>
        <Typography variant="h4" color="textPrimary">{CLAIM_FEED_TEXT}</Typography>

        <Box display='flex'>
          <Button
            variant="contained"
            color="secondary"
          >
            {EXPORT_TO_FILE}
          </Button>

          <Box p={1} />

          <Button
            variant="contained" color="primary"
          >
            <AddWhiteIcon />
            <Box ml={1} />
            {SCHEDULE}
          </Button>
        </Box>
      </Box>

      <FormProvider {...methods}>
        <form>
          <Box display="flex" alignItems="center">
            <InputController
              fieldType="text"
              controllerName="npi"
              controllerLabel={'NPI'}
            />
          </Box>
        </form>
      </FormProvider>

      <Box className={classes.mainTableContainer}>
        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(PATIENT)}
                {renderTh(VISIT)}
                {renderTh(PROVIDER)}
                {renderTh(FACILITY)}
                {renderTh(BILLED)}
                {renderTh(CLAIMED)}
                {renderTh(STATUS)}
              </TableRow>
            </TableHead>
            <TableBody>

            </TableBody>
          </Table>
          <Box display="flex" justifyContent="center" alignItems="center" pb={12} pt={5}>
            <NoDataFoundComponent />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ClaimFeedTable;
