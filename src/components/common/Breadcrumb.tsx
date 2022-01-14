// packages block
import { FC } from "react";
import { Breadcrumbs, Link } from "@material-ui/core";
// history, interfaces block
import history from "../../history";
import { BreadcrumbProps } from '../../interfacesTypes'

const Breadcrumb: FC<BreadcrumbProps> = ({ path }) => {
  const handleClick = (link: string) => {
    if (link) {
      history.push(link);
    }
  };

  return (
    <Breadcrumbs aria-label="breadcrumb">
      {path.map((bread, index) => {
        const { text, link } = bread;

        return (
          <Link color="textPrimary" key={`${text}-${index}`} className="pointer-cursor" onClick={() => handleClick(link)}>
            {text}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
};

export default Breadcrumb;
