import { FC } from "react";
import { Box, Card, CardContent, CardHeader, IconButton, Menu } from "@material-ui/core";
import { AddChartingIcon } from "../../../../assets/svgs";
import { usePatientChartingStyles } from "../../../../styles/patientCharting";
import FilterSearch from "../allergies/FilterSearch";
import { CardLayoutProps } from "../../../../interfacesTypes";

const CardLayout: FC<CardLayoutProps> = ({
  hasAdd, disableAddIcon, onClickAddIcon, openSearch, cardId, isMenuOpen, handleMenuClose, cardTitle,
  children, filterTabs, onSearch, searchData, searchLoading, dispatcher
}) => {
  const classes = usePatientChartingStyles()

  return (
    <Card>
      <CardHeader
        action={
          hasAdd && (
            <Box display="flex" alignItems="center">
              <IconButton
                disabled={disableAddIcon}
                onClick={(event) => onClickAddIcon(event)}
                aria-label="patient-charting"
              >
                <AddChartingIcon />
              </IconButton>

              <Menu
                getContentAnchorEl={null}
                anchorEl={openSearch}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                id={cardId}
                keepMounted
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={isMenuOpen}
                onClose={handleMenuClose}
                className={classes.dropdown}
              >
                <FilterSearch
                  tabs={filterTabs}
                  dispatcher={dispatcher}
                  loading={searchLoading}
                  searchData={searchData}
                  searchItem={(tab, query) => onSearch(tab, query)}
                />
              </Menu>
            </Box>
          )
        }
        title={cardTitle}
      />

      <CardContent>
        {children}
      </CardContent>
    </Card>
  )
};

export default CardLayout;
