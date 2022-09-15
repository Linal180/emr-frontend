// packages block
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Typography } from "@material-ui/core";
import { FC } from "react";
// components block
// interfaces/types block, theme, svgs and constants
import { PRINT, PRINT_PATIENT_CHART } from "../../../../../constants";
import { ChartSelectionViewerProps } from "../../../../../interfacesTypes";

const ChartSelectionModal: FC<ChartSelectionViewerProps> = ({ isOpen, handleClose, modulesToPrint, setModulesToPrint, setIsChartPdfModalOpen }): JSX.Element => {
  const moduleNames = ["Patient Demographics", "Vitals", "Diagnoses", "Triage Notes", "Allergies", "Medications", "Family History", "Surgical History"]

  const handleModuleToPrint = (moduleName: string) => {
    if (modulesToPrint.includes(moduleName)) {
      setModulesToPrint(modulesToPrint.filter((module) => module !== moduleName))
    } else {
      setModulesToPrint([...modulesToPrint, moduleName])
    }
  }

  return (
    <>
      <Dialog
        maxWidth="xs"
        fullWidth
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{PRINT_PATIENT_CHART}</DialogTitle>
        <DialogContent>
          <Box className="dialogBg">
            {moduleNames.map(moduleName => {
              return (
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Box mr={1}>
                        <Checkbox color="primary" checked={modulesToPrint.includes(moduleName)}
                          onChange={() => handleModuleToPrint(moduleName)} />
                      </Box>
                    }

                    label={<Typography variant="h4">{moduleName}</Typography>}
                  />
                </FormGroup>
              )
            })
            }

          </Box>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="primary" onClick={() => {
            setIsChartPdfModalOpen(true);
            handleClose()
          }}>
            {PRINT}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChartSelectionModal;
