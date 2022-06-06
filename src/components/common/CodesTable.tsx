//packages block
import { FC } from "react";
import { Box, Card, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@material-ui/core";
//components block
import NoDataFoundComponent from "./NoDataFoundComponent";
//constants, interfaces, utils block
import { CODE, DESCRIPTION, PRICE_WITH_DOLLAR } from "../../constants";
import { CodesTableProps } from "../../interfacesTypes";
import { useTableStyles } from "../../styles/tableStyles";
import { renderTh } from "../../utils";

const CodesTable: FC<CodesTableProps> = ({ title, tableData, shouldShowPrice }) => {
  const classes = useTableStyles();

  return (
    <Card>
      <Box p={2} className={classes.mainTableContainer}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{title}</Typography>
        </Box>
        <Box className="table-overflow">
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                {renderTh(CODE)}
                {renderTh(DESCRIPTION)}
                {shouldShowPrice && renderTh(PRICE_WITH_DOLLAR)}
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData?.map(({
                code, description, id, price
              }) => {
                return (
                  <TableRow key={id}>
                    <TableCell scope="row">{code}</TableCell>
                    <TableCell scope="row">{description}</TableCell>
                    {shouldShowPrice && (
                      <TableCell scope="row">
                            {price || 0}
                      </TableCell>
                    )}
                  </TableRow>
                )
              }
              )}
            </TableBody>
          </Table>

          {(!tableData?.length) && (
            <Box display="flex" justifyContent="center" pb={12} pt={5}>
              <NoDataFoundComponent />
            </Box>
          )}
        </Box>
      </Box>
    </Card>
  )
}

export default CodesTable