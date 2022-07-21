//packages block
import { Box, Card, Grid, Typography } from "@material-ui/core";
import { FC } from "react";
//components block
//constants, interfaces, utils block
import { BUILD_FEE_DOLLAR, CODE, DESCRIPTION, DIAGNOSIS_POINTERS, MODIFIERS, SR_NO, UNIT } from "../../constants";
import { CodesTableProps } from "../../interfacesTypes";
import { SearchTooltip } from "../../styles/searchTooltip";
import { useTableStyles } from "../../styles/tableStyles";
import { GREY_NINE } from "../../theme";

const CodesTable: FC<CodesTableProps> = ({ title, tableData, shouldShowPrice }) => {
  const classes = useTableStyles()

  return (
    <Card>
      <Box p={2}>
        <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">{title}</Typography>
        </Box>

        <Box pl={4} my={2} bgcolor={GREY_NINE}>
          <Grid container spacing={3} direction="row">
            <Grid item md={1} sm={1} xs={1}>
              <Typography variant="h5" color="textPrimary">{SR_NO}</Typography>
            </Grid>

            {shouldShowPrice ?
              <>
                <Grid item md={1} sm={1} xs={1}>
                  <Typography variant="h5" color="textPrimary">{CODE}</Typography>
                </Grid>

                <Grid item md={1} sm={1} xs={1}>
                  <Typography variant="h6" color="textPrimary">{UNIT}</Typography>
                </Grid>

                <Grid item md={1} sm={1} xs={1}>
                  <Typography variant="h5" color="textPrimary">{BUILD_FEE_DOLLAR}</Typography>
                </Grid>

                <Grid item md={3} sm={3} xs={3}>
                  <Typography variant="h5" color="textPrimary">{MODIFIERS}</Typography>
                </Grid>

                <Grid item md={4} sm={4} xs={4}>
                  <Typography variant="h5" color="textPrimary">{DIAGNOSIS_POINTERS}</Typography>
                </Grid>
              </> :
              <>
                <Grid item md={3} sm={3} xs={3}>
                  <Typography variant="h5" color="textPrimary">{CODE}</Typography>
                </Grid>

                <Grid item md={6} sm={6} xs={6}>
                  <Typography variant="h5" color="textPrimary">{DESCRIPTION}</Typography>
                </Grid>
              </>
            }
          </Grid>
        </Box>

        {(tableData)?.map(({
          code, description, diagPointer, m1, m2, m3, m4, price, unit
        }, index) => {
          return (
            <Box pl={4} mb={1}>
              <Grid container spacing={3} direction="row">
                <Grid item md={1} sm={1} xs={1}>
                  <Box>
                    <Typography variant="body1" color="textPrimary">{index+1}</Typography>
                  </Box>
                </Grid>

                <Grid item md={shouldShowPrice ? 1 : 3} sm={shouldShowPrice ? 1 : 3} xs={shouldShowPrice ? 1 : 3}>
                  <SearchTooltip
                    PopperProps={{
                      disablePortal: true,
                    }}
                    arrow
                    placement="bottom"
                    className={classes.tooltipContainer}
                    title={description}
                  >
                    <div>{code}</div>
                  </SearchTooltip>
                </Grid>



                {shouldShowPrice ? (
                  <>
                    <Grid item md={1} sm={1} xs={1}>
                      <Box>
                        <Typography variant="body1" color="textPrimary">{unit}</Typography>
                      </Box>
                    </Grid>

                    <Grid item md={1} sm={1} xs={1}>
                      <Box>
                        <Typography variant="body1" color="textPrimary">{price}</Typography>
                      </Box>
                    </Grid>

                    <Grid item md={3} sm={3} xs={3}>
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

                    <Grid item md={3} sm={3} xs={3}>
                      <Box>
                        <Typography variant="body1" color="textPrimary">{diagPointer}</Typography>
                      </Box>
                    </Grid>
                  </>
                ) :
                  <>
                    <Grid item md={5} sm={5} xs={5}>
                      {description}
                    </Grid>
                  </>
                }
              </Grid>
            </Box>
          )
        }
        )}
      </Box>
    </Card>
  )
}

export default CodesTable;
