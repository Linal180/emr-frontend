// packages block
import { useState, ChangeEvent, FC } from 'react';
import { TextField, MenuItem, Box } from '@material-ui/core';
// constant block
import { MAPPED_STATUS } from '../../../constants';
import { useCalendarStyles } from '../../../styles/calendarStyles';

const StatusSelector: FC = (): JSX.Element => {
  const classes = useCalendarStyles()
  const [status, setStatus_] = useState('status');

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setStatus_(event.target.value);
  };

  return (
    <form className={classes.statusDropdown} noValidate>
      <Box>
        <TextField
          id="standard-select-currency"
          select
          value={status}
          onChange={handleChange}
        >
          {MAPPED_STATUS.map((option, index) =>
            <MenuItem key={`${option.value}-${index}`} value={option.value}>
              {option.label}
            </MenuItem>
          )}
        </TextField>
      </Box>
    </form>
  );
}

export default StatusSelector;
