import { makeStyles, createStyles } from "@material-ui/core";

export const useAppMenuStyles = makeStyles((theme) =>
createStyles({
  menuItem: {
    "&.active": {
      background: "rgba(0, 0, 0, 0.08)",
      "& .MuiListItemIcon-root": {
        color: "#fff",
      },
    },
  },
  menuItemIcon: {
    color: "#97c05c",
  },
  leftNavBar: {
    paddingLeft:0
  }
})
);