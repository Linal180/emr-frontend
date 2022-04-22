import { FC } from "react";
import { Box, Card, CardContent, CardHeader, IconButton, Menu } from "@material-ui/core";
import { AddChartingIcon } from "../../../../assets/svgs";
import { usePatientChartingStyles } from "../../../../styles/patientCharting";
import FilterSearch from "../allergies/FilterSearch";
import { CardLayoutProps } from "../../../../interfacesTypes";

const CardLayout: FC<CardLayoutProps> = ({
  hasAdd, disableAddIcon, onClickAddIcon, anchorEl, cardId, isMenuOpen, handleMenuClose, cardTitle,
  children, filterTabs, onSearch, searchData, searchLoading
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
                anchorEl={anchorEl}
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
                  searchItem={(tab, query) => onSearch(tab, query)}
                  searchData={searchData}
                  loading={searchLoading}
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
