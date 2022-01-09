// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
import { Edit, Save, ArrowBack, Visibility } from "@material-ui/icons";
import { Card, CardContent, CardHeader, colors, IconButton, Box } from "@material-ui/core";
// interfaces/types block
import { CardComponentType } from "../../interfacesTypes";
import { VIEW_SIGNED_DOCUMENT } from "../../constants";
import { useFacilityStyles } from "../../styles/facilityStyles";

const CardComponent: FC<CardComponentType> = ({ children, cardTitle, isEdit, hasEdit, onEditClick, disableEditIcon, disableSaveIcon, hideSaveIcon, link, requestLink }): JSX.Element => {
  const classes = useFacilityStyles()

  return (
    <Box pb={4}>
      <Card className={classes.subContainer}>
        <Box mb={2} borderBottom={`1px solid ${colors.grey[300]}`}>
          <CardHeader
            action={
              hasEdit ? (
                <Box display="flex" alignItems="center">
                  {isEdit ? (
                    <Box>
                      {!hideSaveIcon && (
                        <IconButton disabled={disableSaveIcon} type="submit" color="primary" aria-label="settings">
                          <Save />
                        </IconButton>
                      )}
                      <IconButton onClick={onEditClick} aria-label="settings">
                        <ArrowBack />
                      </IconButton>
                    </Box>
                  ) : (
                    <IconButton disabled={disableEditIcon} onClick={onEditClick} aria-label="settings">
                      <Edit />
                    </IconButton>
                  )}
                </Box>
              ) : link &&
              <Box pt={0.6}>
                <a href={link || ""} target="_blank" rel="noreferrer">
                  <Box display="flex" alignItems="center">
                    <Visibility color="primary" />
                    <Box pl={0.8} fontSize={14}>
                      {VIEW_SIGNED_DOCUMENT}
                    </Box>
                  </Box>
                </a>
              </Box>
            }

            title={cardTitle}
          />
        </Box>

        <CardContent>{children}</CardContent>
      </Card>
    </Box>
  );
};

export default CardComponent;
