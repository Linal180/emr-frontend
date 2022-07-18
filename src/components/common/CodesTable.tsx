//packages block
import { Box, Card, Grid, Typography } from "@material-ui/core";
import { FC } from "react";
//components block
//constants, interfaces, utils block
import { BUILD_FEE_DOLLAR, CODE, DESCRIPTION, DIAGNOSIS_POINTERS, MODIFIERS, UNIT } from "../../constants";
import { CodesTableProps } from "../../interfacesTypes";
import { useTableStyles } from "../../styles/tableStyles";
import { GRAY_SIX, GREY_NINE } from "../../theme";

const CodesTable: FC<CodesTableProps> = ({ title, tableData, shouldShowPrice }) => {
  const classes = useTableStyles();

  return (
    <Card>
      <Box p={2} className={classes.mainTableContainer}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{title}</Typography>
        </Box>
        {/* <Box className="table-overflow">
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
                code, description, id, price, m1, m2, m3, m4, unit
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
        </Box> */}

        <Box pl={4} my={2} bgcolor={GREY_NINE}>
          <Grid container spacing={3} direction="row">
            <Grid item md={3} sm={3} xs={3}>
              <Typography variant="h5" color="textPrimary">{CODE}</Typography>
            </Grid>

            <Grid item md={5} sm={5} xs={5}>
              <Typography variant="h5" color="textPrimary">{DESCRIPTION}</Typography>
            </Grid>

            {shouldShowPrice && <Grid item md={2} sm={2} xs={2}>
              <Typography variant="h5" color="textPrimary">{BUILD_FEE_DOLLAR}</Typography>
            </Grid>}
          </Grid>
        </Box>

        {(tableData)?.map(({
          code, description, codeId, diagPointer, m1, m2, m3, m4, price, unit
        }, index) => {
          return (
            <>
              <Box pl={4}>
                <Grid container spacing={3} direction="row">
                  <Grid item md={3} sm={3} xs={3}>
                    {code}
                  </Grid>

                  <Grid item md={5} sm={5} xs={5}>
                    {description}
                  </Grid>

                  <Grid item md={2} sm={2} xs={2}>
                    {shouldShowPrice && (
                      <Box>
                        <Typography variant="h5" color="textPrimary">{price}</Typography>
                      </Box>
                    )}
                  </Grid>
                </Grid>
              </Box>

              {shouldShowPrice && <Box pl={4} pb={3} mb={3} borderBottom={`1px solid ${GRAY_SIX}`}>
                <Grid container spacing={3} direction="row">
                  <Grid item md={5} sm={12} xs={12}>
                    <Typography variant="h6" color="textPrimary">{MODIFIERS}</Typography>

                    <Box mt={1} display='flex'>
                      <Box mr={1}>
                        <Typography variant="h5" color="textPrimary">{m1}</Typography>
                      </Box>

                      <Box mr={1}>
                        <Typography variant="h5" color="textPrimary">{m2}</Typography>
                      </Box>

                      <Box mr={1}>
                        <Typography variant="h5" color="textPrimary">{m3}</Typography>
                      </Box>

                      <Box mr={1}>
                        <Typography variant="h5" color="textPrimary">{m4}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item md={5} sm={12} xs={12}>
                    <Typography variant="h6" color="textPrimary">{DIAGNOSIS_POINTERS}</Typography>

                    <Box mt={1} display='flex'>
                      <Box mr={1}>
                        <Typography variant="h5" color="textPrimary">{diagPointer}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item md={1} sm={12} xs={12}>
                    <Typography variant="h6" color="textPrimary">{UNIT}</Typography>

                    <Box mt={1}>
                      <Typography variant="h5" color="textPrimary">{unit}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>}
            </>
          )
        }
        )}
      </Box>
    </Card >
  )
}

export default CodesTable