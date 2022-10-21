// packages block
import {
  Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, FormGroup, Typography
} from "@material-ui/core";
import { FC, useState } from "react";
// components block
// interfaces/types block, theme, svgs and constants
import { PRINT, PRINT_PATIENT_CHART } from "../../../../../constants";
import { ChartSelectionViewerProps } from "../../../../../interfacesTypes";

const ChartSelectionModal: FC<ChartSelectionViewerProps> = ({
  isOpen, handleClose, modulesToPrint, setModulesToPrint, setIsChartPdfModalOpen
}): JSX.Element => {
  const moduleNames = [
    "Patient Demographics", "Vitals", "Diagnoses", "Triage Notes", "Allergies",
    "Medications", "Family History", "Surgical History", "HPI", "ROS"
  ]

  const [isSelectAll, setIsSelectAll] = useState<boolean>(false)

  const handleModuleToPrint = (moduleName: string) => {
    if (modulesToPrint.includes(moduleName)) {
      setModulesToPrint(modulesToPrint.filter((module) => module !== moduleName))
    } else {
      setModulesToPrint([...modulesToPrint, moduleName])
    }
  }

  const handleSelectAll = () => {
    if (isSelectAll) {
      setModulesToPrint([])
    } else {
      setModulesToPrint(moduleNames)
    }
    setIsSelectAll(!isSelectAll)
  }

  return (
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
          <FormGroup>
            <FormControlLabel
              control={
                <Box>
                  <Checkbox color="primary" checked={isSelectAll}
                    onChange={() => handleSelectAll()} />
                </Box>
              }

              label={<Typography variant="h6">{'Select All'}</Typography>}
            />
          </FormGroup>
          {moduleNames.map(moduleName => {
            return (
              <FormGroup>
                <FormControlLabel
                  control={
                    <Box>
                      <Checkbox color="primary" checked={modulesToPrint.includes(moduleName)}
                        onChange={() => handleModuleToPrint(moduleName)} />
                    </Box>
                  }

                  label={<Typography variant="h6">{moduleName}</Typography>}
                />
              </FormGroup>
            )
          })
          }
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" color="primary" disabled={modulesToPrint.length ? false : true} onClick={() => {
          setIsChartPdfModalOpen(true);
          handleClose()
        }}>
          {PRINT}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChartSelectionModal;
