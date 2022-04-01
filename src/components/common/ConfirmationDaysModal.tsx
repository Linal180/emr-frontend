// packages block
import { FC, useState } from "react";
import { FormProvider, useForm } from 'react-hook-form'
import { Button, Dialog, DialogTitle, TextField, Box, Table, TableHead, TableRow, TableBody, TableCell } from "@material-ui/core";
// components block
// interfaces, theme, utils and constants
import { renderTh } from '../../utils'
import { useFacilityStyles } from '../../styles/facilityStyles'
import { AddTimeIcon, DeleteTimeIcon } from '../../assets/svgs'
import { SAVE_TEXT, SERIAL_NO, TIME_FROM, TIME_TO } from "../../constants";
import { ConfirmationDaysTypes, WeekTimeItem } from "../../interfacesTypes";

const ConfirmationModal: FC<ConfirmationDaysTypes> = ({ setOpen, isOpen, title }): JSX.Element => {
  const [list, setList] = useState<WeekTimeItem[]>([])
  const methods = useForm({ mode: "all" });
  const classes = useFacilityStyles()
  const { handleSubmit } = methods;
  let count = 0

  const handleClose = () => {
    setOpen && setOpen(!isOpen)
  }

  const handleChange = (value: string, id: WeekTimeItem['id']) => {
    setList(prev => prev.map(item => item.id === id ? { ...item, value } : item))
  }

  const handleDelete = (id: WeekTimeItem['id']) => {
    setList(prev => prev.filter(item => item.id !== id))
  }

  const handleAdd = (index: number) => {
    const newItem = { id: count++, value: '' }
    setList(prev => [...prev.slice(0, index + 1), newItem, ...prev.slice(index + 1)])
  }

  const onSubmit = () => { }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="sm" fullWidth className={classes.disableBackdropStyle}>
      <DialogTitle id="alert-dialog-title"> {title}</DialogTitle>
      <Box>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              {renderTh(SERIAL_NO)}
              {renderTh(TIME_FROM)}
              {renderTh(TIME_TO)}
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>
                <TextField type='time' disabled />
              </TableCell>

              <TableCell>
                <TextField type='time' disabled />
              </TableCell>

              <Box onClick={() => handleAdd(0)} pt={3} className={classes.cursor}>
                <AddTimeIcon />
              </Box>

            </TableRow>
            {list.map((item, index) => (
              <TableRow key={index}>
                <TableCell scope="row">{`${item.id + 1}`}</TableCell>
                <TableCell scope="row">
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <TextField type='time' value={item.value} onChange={e => handleChange(e.currentTarget.value, item.id)} />
                    </form>
                  </FormProvider>
                </TableCell>

                <TableCell scope="row">
                  <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <TextField type='time' value={item.value} onChange={e => handleChange(e.currentTarget.value, item.id)} />
                    </form>
                  </FormProvider>
                </TableCell>

                <Box onClick={() => handleDelete(item.id)} pt={3} pl={1} className={classes.cursor}>
                  <DeleteTimeIcon />
                </Box>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Box pl={2} pt={4} pb={2}>
        <Button type="submit" variant="contained" color="primary" onClick={handleClose}>
          {SAVE_TEXT}
        </Button>
      </Box>
    </Dialog>
  );
};

export default ConfirmationModal;
