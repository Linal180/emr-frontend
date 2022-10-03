import { Box, TableCell, TableRow, Typography } from "@material-ui/core";
import { FC } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { 
  ADDITIONAL, COPAY_TEXT, PREVIOUS, UPFRONT_INITIAL_VALUES, UPFRONT_PAYMENT_TYPES, UPFRONT_TYPE_OPTIONS 
} from "../../../../constants";
import InputController from "../../../../controller";
import { CreateUpFrontPayment, UpFrontPaymentTypeCompProps } from "../../../../interfacesTypes";
import { useTableStyles } from "../../../../styles/tableStyles";
import { GREY } from "../../../../theme";
import Selector from "../../../common/Selector";

const UpFrontPaymentType: FC<UpFrontPaymentTypeCompProps> = ({ moduleName, shouldDisableEdit }) => {
  const classes = useTableStyles();
  const methods = useFormContext<CreateUpFrontPayment>()
  const { control, watch } = methods
  const { [moduleName]: upFrontPaymentTypes } = watch()

  const { append: appendUpFrontPaymentTypes, remove: removeUpFrontPaymentTypes } =
    useFieldArray({ control: control, name: moduleName });

  const getTitle = () => {
    switch (moduleName) {
      case UPFRONT_PAYMENT_TYPES.Copay:
        return COPAY_TEXT
      case UPFRONT_PAYMENT_TYPES.Additional:
        return ADDITIONAL
      case UPFRONT_PAYMENT_TYPES.Previous:
        return PREVIOUS
      default:
        return ''
    }
  }

  const handlePaymentAdd = () => {
    appendUpFrontPaymentTypes({ ...UPFRONT_INITIAL_VALUES, paymentType: moduleName })
  }

  return <>
    {upFrontPaymentTypes.map((_, index) => {
      return (
        <>
          <TableRow>
            <TableCell scope="row">
              <Box display='flex' alignItems='center'>
                <Box minWidth={80}>
                  {index === 0 ? getTitle() : ''}
                </Box>

                <Box ml={3} width="80%" className={classes.boxBg}>
                  <Selector
                    addEmpty
                    options={UPFRONT_TYPE_OPTIONS}
                    label=""
                    name={`${moduleName}.${index}.type`}
                    disabled={shouldDisableEdit}
                  />
                </Box>
              </Box>
            </TableCell>
            <TableCell scope="row">
              <Box pl={2} display='flex' alignItems='center' borderRadius={4} height={48} bgcolor={GREY}>
                <Typography variant="body1" color="inherit">20</Typography>
              </Box>
            </TableCell>

            <TableCell scope="row">
              <Box className={classes.boxBg} maxWidth="fit-content">
                <InputController
                  fieldType="number"
                  controllerLabel={''}
                  controllerName={`${moduleName}.${index}.amount`}
                  disabled={shouldDisableEdit}
                />
              </Box>
            </TableCell>

            <TableCell scope="row">
              <Box className={classes.boxBg}>
                <Selector
                  addEmpty
                  options={UPFRONT_TYPE_OPTIONS}
                  label=""
                  name={`${moduleName}.${index}.type`}
                  disabled={shouldDisableEdit}
                />
              </Box>
            </TableCell>

            <TableCell scope="row">
              <Box className={classes.boxBg}>
                <InputController
                  fieldType="text"
                  controllerLabel={''}
                  controllerName={`${moduleName}.${index}.notes`}
                  disabled={shouldDisableEdit}
                />
              </Box>
            </TableCell>

            {/* {!shouldDisableEdit && <TableCell scope="row">
              <Box display="flex" alignItems="center">
                <Box className="billing-box" onClick={handlePaymentAdd} display="flex" justifyContent="center" width="50%">
                  {index === 0 && <AddCircleOutline color='inherit' />}
                </Box>

                {index > 0 && <Box ml={1} className="billing-box" onClick={() => removeUpFrontPaymentTypes(index)} display="flex" justifyContent="flex-end" width="100%">
                  <RemoveCircleOutline color='error' />
                </Box>}
              </Box>
            </TableCell>} */}
          </TableRow>
        </>
      )
    })}
  </>
}

export default UpFrontPaymentType