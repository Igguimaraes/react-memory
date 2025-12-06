import { useEffect, useState } from "react";
import * as C from "./app.styles";
import logoImage from "./assets/devmemory_logo.png";
import RestartImage from "./svgs/restart.svg";
import { Button } from "./components/Button";
import { InfoItem } from "./components/infoItem";
import { GridItemType } from "./types/GridItemType";
import { Items } from "./data/items";
import { GridItem } from "./components/GridItem";
import { formatTimeElapsed } from "./helpers/formarTimeElapsed";

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [movieCount, setMovieCount] = useState<number>(0);
  const [showCount, setShowCount] = useState<number>(0);
  const [gridItems, setGridItems] = useState<GridItemType[]>([]);
  useEffect(() => resetAndCreateGrid(), []);

  useEffect(() => {
    const timer = setInterval(() => {
      if (playing) setTimeElapsed(timeElapsed + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [playing, timeElapsed]);

  useEffect(() => {
    if (showCount === 2) {
      // Verificar se of abertos são iguais!
      let opened = gridItems.filter((item) => item.show === true);
      if (opened.length === 2) {
        // v1 - se eles são iguais , tornalos permanents

        if (opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems];
          for (let i in tmpGrid) {
            if (tmpGrid[i].show) {
              tmpGrid[i].permanentShow = true;
              tmpGrid[i].show = false;
            }
            setGridItems(tmpGrid);
            setShowCount(0);
          }
        } else {
          //v2 - se não forem iguais, feche eles !
          setTimeout(() => {
            let tmpGrid = [...gridItems];
            for (let i in tmpGrid) {
              tmpGrid[i].show = false;
            }
            setGridItems(tmpGrid);
            setShowCount(0);
          }, 1000);
        }

        setMovieCount((movieCount) => movieCount + 1);
      }
    }
  }, [showCount, gridItems]);
  //verificar se o jogo terminou !
  useEffect(() => {
    if (
      movieCount > 0 &&
      gridItems.every((item) => item.permanentShow === true)
    ) {
      setPlaying(false);
    }
  }, [movieCount, gridItems]);

  const resetAndCreateGrid = () => {
    // resetar o jogo
    setTimeElapsed(0);
    setMovieCount(0);
    setShowCount(0);
    // criar o grid
    //grid vazio
    let tmpGrid: GridItemType[] = [];
    for (let i = 0; i < Items.length * 2; i++)
      tmpGrid.push({
        item: null,
        show: false,
        permanentShow: false,
      });

    // preencher Grid
    for (let w = 0; w < 2; w++) {
      for (let i = 0; i < Items.length; i++) {
        let pos = -1;
        while (pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (Items.length * 2));
        }

        tmpGrid[pos].item = i;
      }
    }

    // jogar no State
    setGridItems(tmpGrid);
    // Grid começar o jogo
    setPlaying(true);
  };

  const handleItemClick = (index: number) => {
    if (playing && index !== null && showCount < 2) {
      let tmpGrid = [...gridItems];
      if (
        tmpGrid[index].permanentShow === false &&
        tmpGrid[index].show === false
      ) {
        tmpGrid[index].show = true;
        setShowCount(showCount + 1);
      }
      setGridItems(tmpGrid);
    }
  };
  return (
    <C.Container>
      <C.Info>
        <C.LogoLink>
          <h1>DevMemory</h1>
        </C.LogoLink>
        <C.H1>
          <p> Powered By: Igor Guimarães</p>
        </C.H1>

        <C.InfoArea>
          <InfoItem label="Tempo" value={formatTimeElapsed(timeElapsed)} />
          <InfoItem label="Movimentos" value={movieCount.toString()} />
        </C.InfoArea>

        <Button
          label="Reiniciar"
          icon={RestartImage}
          onClick={resetAndCreateGrid}
        />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem
              key={index}
              item={item}
              onClick={() => handleItemClick(index)}
            />
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  );
};
export default App;
