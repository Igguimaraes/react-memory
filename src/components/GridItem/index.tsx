import { GridItemType } from "../../types/GridItemType";
import * as C from "./styles";
import b7svg from "../../svgs/b7.svg";
import { Items } from "../../data/items";
type Props = {
  item: GridItemType;
  onClick: () => void;
};
export const GridItem = ({ item, onClick }: Props) => {
  return (
    <C.Container
      showBackgroud={item.permanentShow || item.show}
      onClick={onClick}
    >
      {item.permanentShow === false && item.show === false && (
        <C.Icon src={b7svg} alt="" opacity={0.1} />
      )}

      {(item.permanentShow || item.show) && item.item !== null && (
        <C.Icon src={Items[item.item].icon} alt="" />
      )}
    </C.Container>
  );
};
