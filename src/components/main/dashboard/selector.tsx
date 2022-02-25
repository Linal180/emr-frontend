import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { WHITE_FOUR } from '../../../theme';

const currencies = [
  {
    value: 'USD',
    label: 'status',
  },
  {
    value: 'EUR',
    label: '€',
  },
  {
    value: 'BTC',
    label: '฿',
  },
  {
    value: 'JPY',
    label: '¥',
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        border: `1px solid ${WHITE_FOUR}`,
        width: '12ch',
      },
      '& .MuiSelect-selectMenu': {
        margin: theme.spacing(1),
        minHeight: 'auto'
      },
      '& .MuiSelect-select': {
        padding: 0
      }
    },
  }),
);

export default function MultilineTextFields() {
  const classes = useStyles();
  const [currency, setCurrency] = React.useState('USD');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCurrency(event.target.value);
  };

  return (
    <form className={classes.root} noValidate autoComplete="on">
      <div>
        <TextField
          id="standard-select-currency"
          select
          value={currency}
          onChange={handleChange}
        >
          {currencies.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    </form>
  );
}