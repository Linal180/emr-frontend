// packages block
import { FC, useState, ChangeEvent, memo } from "react";
import {
  Button, Dialog, DialogActions, DialogTitle, DialogContent, Box, Typography, FormControl, FormControlLabel, RadioGroup, Radio
} from "@material-ui/core";
// constants and interfaces block
import { SmartyModalComponentType } from "../../interfacesTypes";
import { useSmartyModalStyles } from "../../styles/smartyModalStyles";
import { DISMISS, Ok_TEXT, CHECK_ADDRESS, SMARTY_0_MATCH, YOU_ENTER, POSSIBLE_MATCH, SELECT_ADDRESS } from "../../constants";
import Alert from "./Alert";

const SmartyModal: FC<SmartyModalComponentType> = ({ isOpen, setOpen, data, userData, verifiedAddressHandler }): JSX.Element => {
  const classes = useSmartyModalStyles();
  const { address, street } = userData || {}
  const [addValue, setAddValue] = useState<string>('')

  const handleClose = () => setOpen && setOpen(!isOpen);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddValue((event.target as HTMLInputElement).value);
  };

  const clickHandler = () => {

    if (data?.length !== 0) {
      if (addValue) {
        const address = JSON.parse(addValue);
        const { deliveryLine1, cityName, zipCode, plus4Code } = address || {};
        verifiedAddressHandler(deliveryLine1, zipCode, plus4Code, cityName);
        setAddValue('')
        handleClose();
      }
      else {
        Alert.error(SELECT_ADDRESS)
      }
    }
    else {
      handleClose();
    }
  }


  return (
    <Dialog fullWidth maxWidth="sm" open={isOpen} onClose={handleClose}>
      <DialogTitle>{CHECK_ADDRESS}</DialogTitle>

      <DialogContent>
        <Typography variant="h6" className={classes.smallText}>{YOU_ENTER}</Typography>

        <Typography variant="h6" className={classes.yourAddress}>{street}</Typography>
        <Typography variant="h6" className={classes.yourAddress}>{address}</Typography>
        {data?.length === 0 && <Typography variant="h6" className={classes.smallTextTwo}>{SMARTY_0_MATCH}</Typography>}
        {data?.length > 0 &&
          <FormControl component="fieldset" className={classes.formControl}>
            <Typography variant="h6" className={classes.smallText}>{data?.length} {POSSIBLE_MATCH}</Typography>

            <RadioGroup name="address" value={addValue} onChange={handleChange}>
              {data?.map((add, index) => {
                const { deliveryLine1, lastLine, components } = add || {}
                const { cityName, state, zipCode, plus4Code } = components
                return (
                  <FormControlLabel key={`${index}-${deliveryLine1}-${lastLine}`} value={JSON.stringify({ deliveryLine1, cityName, state, zipCode, plus4Code })} control={<Radio color="secondary" />} label={<Typography variant="h6" className={classes.yourAddress}>{deliveryLine1}<br />{lastLine}</Typography>} />
                )
              })}
            </RadioGroup>
          </FormControl>
        }
      </DialogContent>

      <DialogActions>
        {data?.length !== 0 &&
          <Box pr={1}>
            <Button onClick={handleClose} variant="text" color="default">{DISMISS}</Button>
          </Box>
        }

        <Button color="primary" variant="contained" disabled={data?.length > 0 ? !addValue : false} onClick={clickHandler} size="large">{Ok_TEXT}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default memo(SmartyModal);
