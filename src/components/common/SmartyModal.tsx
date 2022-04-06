// packages block
import { FC, useState, ChangeEvent } from "react";
import {
  Button, Dialog, DialogActions, DialogTitle, DialogContent, Box, Typography, FormControl,
  FormLabel, FormControlLabel, RadioGroup, Radio
} from "@material-ui/core";
// constants and interfaces block
import { SmartyModalComponentType } from "../../interfacesTypes";
import { useSmartyModalStyles } from "../../styles/smartyModalStyles";
import { DISMISS, Ok_TEXT, CHECK_ADDRESS, SMARTY_0_MATCH, YOU_ENTER, POSSIBLE_MATCH } from "../../constants";

const SmartyModal: FC<SmartyModalComponentType> = ({ isOpen, setOpen, data, userData }): JSX.Element => {
  const classes = useSmartyModalStyles();
  const { address, street } = userData || {}
  const [addValue, setAddValue] = useState('')

  const handleClose = () => setOpen && setOpen(!isOpen);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAddValue((event.target as HTMLInputElement).value);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={isOpen}
      onClose={handleClose}
    >
      <DialogTitle>{CHECK_ADDRESS}</DialogTitle>

      <DialogContent>
        <Typography className={classes.smallText}>{YOU_ENTER}</Typography>

        <Typography variant="h6" className={classes.yourAddress}>{street}</Typography>
        <Typography variant="h6" className={classes.yourAddress}>{address}</Typography>
        {data?.length === 0 && <Typography className={classes.smartText}>{SMARTY_0_MATCH}</Typography>}
        {data?.length > 0 &&
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend" className={classes.smallText}>{data?.length} {POSSIBLE_MATCH}</FormLabel>
            <RadioGroup name="address" value={addValue} onChange={handleChange}>
              {data?.map((add) => {
                const { deliveryLine1, lastLine } = add || {}
                return (
                  <FormControlLabel value={`${deliveryLine1},${lastLine}`} control={<Radio color="primary" />} label={<>{deliveryLine1}<br />{lastLine}</>} />
                )
              })}
            </RadioGroup>
          </FormControl>
        }
      </DialogContent>

      <DialogActions>
        {data?.length !== 0 &&
          <Box pr={1}>
            <Button onClick={handleClose} variant="outlined" color="default">{DISMISS}</Button>
          </Box>
        }

        <Button color="primary" variant="contained" disabled={data?.length > 0 ? !addValue : false} onClick={handleClose} size="large">{Ok_TEXT}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SmartyModal;
