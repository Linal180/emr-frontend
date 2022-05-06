// packages block
import { FC } from "react";
import { Link } from "react-router-dom";
// history, interfaces block
import { PageBackIcon } from "../../assets/svgs";
import { BackButtonProps } from "../../interfacesTypes";

const BackButton: FC<BackButtonProps> = ({ to }) => <Link to={to}>
  <PageBackIcon />
</Link>

export default BackButton;
