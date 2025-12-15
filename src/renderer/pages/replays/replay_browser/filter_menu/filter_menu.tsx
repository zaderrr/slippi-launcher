import ClearIcon from "@mui/icons-material/Clear";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { characters as charUtils, stages as stageUtils } from "@slippi/slippi-js";
import { useRef, useState } from "react";

import { useReplayFilter } from "@/lib/hooks/use_replay_filter";

import { CharacterFilterMenu } from "./character_filter";
import { StageFilter } from "./stage_filter";
export const FilterMenu = ({ showFilters }: { showFilters: boolean }) => {
  const [open, setOpen] = useState(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<string>();
  const [replayFilter, setReplayFilter] = useState<ReplayFilter>({
    Stage: { id: 0, name: "unselected" },
    Characters: [],
  });
  const clearStoreFilters = useReplayFilter((store) => store.resetFilter);
  const setStagePlayed = useReplayFilter((store) => store.setStagePlayed);
  const setCharacters = useReplayFilter((store) => store.setCharacters);
  const anchorRef = useRef<HTMLDivElement>(null);
  //List of characters to ignore - May want to include it, but as an easy way to filter out "non-standard" characters
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
      //Filter out ignored characters
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
      //Only get legal stages, can easily be expanded.
      //FOD,PS,YS,DL,BF,FD respectively
      { id: 2, name: stageUtils.getStageName(2) },
      { id: 3, name: stageUtils.getStageName(3) },
      { id: 8, name: stageUtils.getStageName(8) },
      { id: 28, name: stageUtils.getStageName(28) },
      { id: 31, name: stageUtils.getStageName(31) },
      { id: 32, name: stageUtils.getStageName(32) },
    ],
    Characters: getAllCharcters(),
  };

  interface ReplayFilter {
    Stage: { id: number; name: string };
    Characters: number[];
  }
  const handleStageSelected = (Stage: { id: number; name: string }) => {
    const NewFilter: ReplayFilter = { Stage: replayFilter.Stage, Characters: replayFilter.Characters };
    if (replayFilter.Stage.id == Stage.id) {
      NewFilter.Stage = { id: 0, name: "unselected" };
    } else {
      NewFilter.Stage = Stage;
    }
    setOpen(false);
    setStagePlayed(NewFilter.Stage.id);
    setReplayFilter(NewFilter);
  };

  const handleFilterMenuToggle = (menu: "Stage" | "Characters") => {
    setSelectedFilterOptions(menu);
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };
  const handleCharacterSelected = (CharacterID: number) => {
    const SelectedChar = charUtils.getCharacterInfo(CharacterID);
    const NewFilter: ReplayFilter = { Stage: replayFilter.Stage, Characters: replayFilter.Characters };
    const index = replayFilter.Characters.indexOf(SelectedChar.id);
    if (index > -1) {
      NewFilter.Characters.splice(index, 1);
    } else {
      NewFilter.Characters.push(SelectedChar.id);
    }
    setReplayFilter(NewFilter);
    let StoreArr: number[] = [];
    StoreArr = StoreArr.concat(NewFilter.Characters);
    setCharacters(StoreArr);
    setOpen(false);
  };
  const clearFilters = () => {
    const defaultFilters = {
      Stage: { id: 0, name: "unselected" },
      Characters: [],
    };
    setReplayFilter(defaultFilters);
    clearStoreFilters();
  };

  if (showFilters == false) {
    return null;
  } else {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          height: "40px",
          backgroundColor: "#1B0B28",
          background: "linear-gradient(180deg,rgba(27, 11, 40, 1) 0%, rgba(41, 19, 59, 1) 100%)",
          padding: "10px",
        }}
      >
        <div>
          <ButtonGroup ref={anchorRef} aria-label="Button group with a nested menu">
            <Button
              variant={replayFilter.Stage.id != 0 ? "contained" : "outlined"}
              onClick={() => handleFilterMenuToggle("Stage")}
            >
              {replayFilter.Stage.id != 0 ? replayFilter.Stage.name : "Stage"}
            </Button>
            <Button
              onClick={() => handleFilterMenuToggle("Characters")}
              variant={replayFilter.Characters.length > 0 ? "contained" : "outlined"}
            >
              {replayFilter.Characters.length === 0 ? "Characters" : replayFilter.Characters.length + " selected"}
            </Button>
          </ButtonGroup>
        </div>
        <div>
          <Button variant="outlined" color="error" onClick={clearFilters}>
            <ClearIcon color="error" fontSize="small" />
          </Button>
        </div>
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
                      <CharacterFilterMenu
                        CharacterFilters={FilterOptions.Characters}
                        SelectedCharacters={replayFilter.Characters}
                        handleSelected={handleCharacterSelected}
                      />
                    )}
                    {selectedFilterOptions == "Stage" && (
                      <StageFilter
                        Stages={FilterOptions.Stage}
                        SelectedStage={replayFilter.Stage}
                        handleStageSelected={handleStageSelected}
                      />
                    )}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    );
  }
};
