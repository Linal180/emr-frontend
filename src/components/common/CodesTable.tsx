//packages block
import { FC } from "react";
import { Box, Card, Grid, Typography } from "@material-ui/core";
//components block
//constants, interfaces, utils block
import { BUILD_FEE_DOLLAR, CODE, DESCRIPTION, DIAGNOSIS_POINTERS, MODIFIERS, UNIT } from "../../constants";
import { CodesTableProps } from "../../interfacesTypes";
import { GRAY_SIX, GREY_NINE } from "../../theme";

const CodesTable: FC<CodesTableProps> = ({ title, tableData, shouldShowPrice }) => {

  return (
    <Card>
      <Box p={2}>
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
          code, description, diagPointer, m1, m2, m3, m4, price, unit
        }) => {
          return (
            <>
              <Box pl={4} mb={1}>
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

              {shouldShowPrice && <Box pl={0} pb={3} mb={3} borderBottom={`1px solid ${GRAY_SIX}`}>
                <Grid container spacing={0} direction="row">
                  <Grid item md={3} sm={3} xs={4}>
                    <Box py={1.6} pl={3} bgcolor={GREY_NINE}>
                      <Box maxWidth={300}>
                        <Typography variant="h5" color="textPrimary" noWrap>{MODIFIERS}</Typography>
                      </Box>
                    </Box>

                    <Box pl={3} mt={1} display='flex' flexWrap='wrap'>
                      <Box mr={1.5}>
                        <Typography variant="body1" color="textPrimary">{m1}</Typography>
                      </Box>

                      <Box mr={1.5}>
                        <Typography variant="body1" color="textPrimary">{m2}</Typography>
                      </Box>

                      <Box mr={1.5}>
                        <Typography variant="body1" color="textPrimary">{m3}</Typography>
                      </Box>

                      <Box>
                        <Typography variant="body1" color="textPrimary">{m4}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item md={5} sm={5} xs={4}>
                    <Box py={1.6} pl={3} bgcolor={GREY_NINE}>
                      <Box maxWidth={300}>
                        <Typography variant="h5" color="textPrimary" noWrap>{DIAGNOSIS_POINTERS}</Typography>
                      </Box>
                    </Box>

                    <Box mt={1} display='flex'>
                      <Box pl={3} mr={1}>
                        <Typography variant="body1" color="textPrimary">{diagPointer}</Typography>
                      </Box>
                    </Box>
                  </Grid>

                  <Grid item md={4} sm={4} xs={4}>
                    <Box py={1.6} pl={3} bgcolor={GREY_NINE}>
                      <Typography variant="h5" color="textPrimary">{UNIT}</Typography>
                    </Box>

                    <Box pl={3} mt={1}>
                      <Typography variant="body1" color="textPrimary">{unit}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>}
            </>
          )
        }
        )}
      </Box>
    </Card>
  )
}

export default CodesTable;
