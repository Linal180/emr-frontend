import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

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
        width: '12ch',
      },
      '& .MuiSelect-selectMenu': {
        minHeight: 'auto'
      },
      '& .MuiSelect-select': {
        padding: 'auto'
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