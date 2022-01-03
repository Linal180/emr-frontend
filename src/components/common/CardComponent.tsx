// packages block
import { FC } from "react";
import { Card, CardContent, CardHeader, colors, IconButton, Box } from "@material-ui/core";
import { Edit, Save, ArrowBack, Visibility } from "@material-ui/icons";
import { Link } from "react-router-dom";
// interfaces/types block
import { REQUESTS, VIEW_SIGNED_DOCUMENT, VIEW_OWNERSHIP_REQUEST } from "../../constants";
import { CardComponentType } from "../../interfacesTypes";

const CardComponent: FC<CardComponentType> = ({ children, cardTitle, isEdit, hasEdit, onEditClick, disableEditIcon, disableSaveIcon, hideSaveIcon, link, requestLink }): JSX.Element => {
  return (
    <Box pb={4}>
      <Card className="overflow-visible">
        <Box borderBottom={`1px solid ${colors.grey[300]}`} mb={2}>
          <CardHeader
            action={
              hasEdit ? (
                <Box display="flex" alignItems="center">
                  {requestLink && (
                    <Link to={`${REQUESTS}/${requestLink}`}>
                      <Box display="flex" alignItems="center">
                        <Visibility color="primary" />
                        <Box pl={0.8} fontSize={14}>
                          {VIEW_OWNERSHIP_REQUEST}
                        </Box>
                      </Box>
                    </Link>
                  )}

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
