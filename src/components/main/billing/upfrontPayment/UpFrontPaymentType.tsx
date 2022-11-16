import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { Box, TableCell, TableRow, Typography } from "@material-ui/core";
//components
import Selector from "../../../common/Selector";
import InputController from "../../../../controller";
//constants, styles, interfaces, theme
import { GREY } from "../../../../theme";
import { useTableStyles } from "../../../../styles/tableStyles";
import { CreateUpFrontPayment, SelectorOption, UpFrontPaymentTypeCompProps } from "../../../../interfacesTypes";
import {
  ADDITIONAL, COPAY_TEXT, MAPPED_COPAY_TYPE, PREVIOUS, UPFRONT_PAYMENT_TYPES, UPFRONT_TYPE_OPTIONS
} from "../../../../constants";

const UpFrontPaymentType: FC<UpFrontPaymentTypeCompProps> = ({ moduleName, shouldDisableEdit, copays }) => {
  const classes = useTableStyles();
  const methods = useFormContext<CreateUpFrontPayment>()
  const { watch, setValue } = methods
  const { [moduleName]: upFrontPaymentTypes } = watch()
  const { copayType } = upFrontPaymentTypes?.[0] || {}

  // const { append: appendUpFrontPaymentTypes } =
  //   useFieldArray({ control: control, name: moduleName });

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

  // const handlePaymentAdd = () => {
  //   appendUpFrontPaymentTypes({ ...UPFRONT_INITIAL_VALUES, paymentType: moduleName })
  // }

  const isCopay = moduleName === UPFRONT_PAYMENT_TYPES.Copay || moduleName === UPFRONT_PAYMENT_TYPES.Additional

  const { amount } = copays?.find((copay) => copay.type === (copayType?.id || '')) || {}

  const handleCopay = (copayValue: SelectorOption) => {
    const { id } = copayValue
    const { amount } = copays?.find((copay) => copay.type === (id || '')) || {}
    setValue(`Copay.0.dueAmount`, amount as never)
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

                {isCopay && <Box ml={3} width="80%" className={classes.boxBg}>
                  <Selector
                    addEmpty
                    label={''}
                    options={MAPPED_COPAY_TYPE}
                    name={`${moduleName}.${index}.copayType`}
                    onSelect={(copayValue: SelectorOption) => handleCopay(copayValue)}
                    disabled={shouldDisableEdit}
                  />
                </Box>}
              </Box>
            </TableCell>
            {copays?.length && < TableCell scope="row">
              {moduleName === UPFRONT_PAYMENT_TYPES.Copay && <Box pl={2} display='flex' alignItems='center' borderRadius={4} height={48} bgcolor={GREY}>
                <Typography variant="body1" color="inherit">{amount || '0.0'}</Typography>
              </Box>}
            </TableCell>}

            <TableCell scope="row">
              <Box className={classes.boxBg} maxWidth="fit-content">
                <InputController
                  fieldType="string"
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