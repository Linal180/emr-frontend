// packages block
import { FC } from "react";
import { Edit, Save, ArrowBack } from "@material-ui/icons";
import {
  Card, CardContent, CardHeader, IconButton, Box, Button, CircularProgress
} from "@material-ui/core";
// interfaces/types block
import { SAVE_TEXT } from "../../constants";
import { CardComponentType } from "../../interfacesTypes";

const CardComponent: FC<CardComponentType> = ({
  children, cardTitle, isEdit, hasEdit, onEditClick, disableEditIcon, disableSaveIcon, hideSaveIcon,
  saveBtn, state, disableSubmit, isFullHeight, onSubmitClick, saveBtnText
}): JSX.Element => {
  const { activeStep } = state || {}

  return (
    <Card className={`${isFullHeight && true ? 'fullMinHeight card-box-shadow' : 'card-box-shadow'}`}>
      <CardHeader
        action={
          hasEdit ? (
            <Box display="flex" alignItems="center">
              {isEdit ? (
                <Box>
                  {!hideSaveIcon && (
                    <IconButton disabled={disableSaveIcon} type="submit" color="primary" size='small' aria-label="settings">
                      <Save />
                    </IconButton>
                  )}

                  <IconButton size='small' onClick={onEditClick} aria-label="settings">
                    <ArrowBack />
                  </IconButton>
                </Box>
              ) : (
                <IconButton size='small' disabled={disableEditIcon} onClick={onEditClick} aria-label="settings">
                  <Edit />
                </IconButton>
              )}
            </Box>
          ) : saveBtn
            ? typeof activeStep === 'number' &&
            <Button
              variant="contained" color='primary' type={onSubmitClick ? 'button' : 'submit'}
              disabled={disableSubmit}
              onClick={onSubmitClick ? () => onSubmitClick() : () => { }}
            >
              {saveBtnText ? saveBtnText : SAVE_TEXT}
              {disableSubmit && <CircularProgress size={20} color="inherit" />}
            </Button>
            : ''
        }
        title={cardTitle}
      />

      <CardContent>{children}</CardContent>
    </Card>
  )
};

export default CardComponent;
