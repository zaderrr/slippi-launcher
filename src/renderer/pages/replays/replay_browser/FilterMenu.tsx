import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { characters as charUtils, stages as stageUtils } from "@slippi/slippi-js";
import { forwardRef, useRef, useState } from "react";

import { useReplayFilter } from "@/lib/hooks/use_replay_filter";
import { getCharacterIcon } from "@/lib/utils";
export const FilterMenu = forwardRef<HTMLInputElement>(() => {
  const [open, setOpen] = useState(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<string>();
  const setStagePlayed = useReplayFilter((store) => store.setStagePlayed);
  const [replayFilter, setReplayFilter] = useState<ReplayFilter>({
    Stage: { id: 0, name: "unselected" },
    Characters: [],
  });
  const anchorRef = useRef<HTMLDivElement>(null);

  const IgnoreCharacters = [
    "Master Hand",
    "Popo",
    "Wireframe (Male)",
    "Wireframe (Female)",
    "Gigabowser",
    "Crazy Hand",
    "Sandbag",
  ];
  const getAllCharcters = () => {
    const AllChars = charUtils.getAllCharacters();
    const names: charUtils.CharacterInfo[] = [];
    AllChars.forEach((character) => {
      if (!IgnoreCharacters.includes(character.name)) {
        names.push(character);
      }
    });
    return names;
  };
  const FilterOptions: {
    Stage: { id: number; name: string }[];
    Characters: charUtils.CharacterInfo[];
  } = {
    Stage: [
      { id: 2, name: stageUtils.getStageName(2) },
      { id: 3, name: stageUtils.getStageName(3) },
      { id: 8, name: stageUtils.getStageName(8) },
      { id: 31, name: stageUtils.getStageName(31) },
      { id: 28, name: stageUtils.getStageName(28) },
      { id: 32, name: stageUtils.getStageName(32) },
    ],
    Characters: getAllCharcters(),
  };

  interface ReplayFilter {
    Stage: { id: number; name: string };
    Characters: string[];
  }
  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    const NewFilter: ReplayFilter = { Stage: replayFilter.Stage, Characters: replayFilter.Characters };
    if (replayFilter.Stage.id == FilterOptions.Stage[index].id) {
      NewFilter.Stage = { id: 0, name: "unselected" };
    } else {
      NewFilter.Stage = FilterOptions.Stage[index];
    }
    setReplayFilter(NewFilter);
    setStagePlayed(NewFilter.Stage.id);
    setOpen(false);
  };

  const handleStageFilterToggle = () => {
    setSelectedFilterOptions("Stage");
    setOpen((prevOpen) => !prevOpen);
  };
  const handleCharactersFilterToggle = () => {
    setSelectedFilterOptions("Characters");
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };
  const handleCharacterSelected = (CharacterID: number) => {
    const SelectedChar = charUtils.getCharacterName(CharacterID);
    const NewFilter: ReplayFilter = { Stage: replayFilter.Stage, Characters: replayFilter.Characters };
    const index = replayFilter.Characters.indexOf(SelectedChar);
    if (index > -1) {
      replayFilter.Characters.splice(index, 1);
    } else {
      NewFilter.Characters.push(SelectedChar);
    }
    setReplayFilter(NewFilter);
    setOpen(false);
  };
  return (
    <div
      style={{
        flex: "flex",
        height: "40px",
        backgroundColor: "#1B0B28",
        background: "linear-gradient(180deg,rgba(27, 11, 40, 1) 0%, rgba(41, 19, 59, 1) 100%)",
        padding: "10px",
      }}
    >
      <ButtonGroup ref={anchorRef} aria-label="Button group with a nested menu">
        <Button variant={replayFilter.Stage.id != 0 ? "contained" : "outlined"} onClick={handleStageFilterToggle}>
          {replayFilter.Stage.id != 0 ? replayFilter.Stage.name : "Stage"}
        </Button>
        <Button
          onClick={handleCharactersFilterToggle}
          variant={replayFilter.Characters.length > 0 ? "contained" : "outlined"}
        >
          {replayFilter.Characters.length === 0 ? "Characters" : replayFilter.Characters.length + " selected"}
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition={true}
        disablePortal={true}
        style={{ width: "40%" }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem={true}>
                  {selectedFilterOptions == "Characters" && (
                    <CharacterSelector
                      CharacterFilters={FilterOptions.Characters}
                      SelectedCharacters={replayFilter.Characters}
                      handleSelected={handleCharacterSelected}
                    />
                  )}
                  {selectedFilterOptions == "Stage" &&
                    FilterOptions[selectedFilterOptions].map((option, index) => (
                      <MenuItem
                        key={option.id}
                        selected={replayFilter[selectedFilterOptions].id === option.id}
                        onClick={(event) => handleMenuItemClick(event, index)}
                        style={{ width: "100%" }}
                      >
                        {option.name}
                      </MenuItem>
                    ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
});

const CharacterSelector = ({
  handleSelected,
  CharacterFilters,
  SelectedCharacters,
}: {
  handleSelected: (characterId: number) => void;
  CharacterFilters: charUtils.CharacterInfo[];
  SelectedCharacters: string[];
}) => {
  return (
    <div>
      {CharacterFilters.map((character, index) => (
        <Button
          key={index}
          variant={SelectedCharacters.includes(character.name) ? "contained" : "text"}
          style={{ height: "50px", width: "20px", aspectRatio: 1 }}
          onClick={() => handleSelected(character.id)}
        >
          <img src={getCharacterIcon(character.id)} style={{ width: "40px" }}></img>
        </Button>
      ))}
    </div>
  );
};
