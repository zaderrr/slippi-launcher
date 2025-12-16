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

const IGNORE_CHARACTERS = [
  "Master Hand",
  "Popo",
  "Wireframe (Male)",
  "Wireframe (Female)",
  "Gigabowser",
  "Crazy Hand",
  "Sandbag",
];

const LEGAL_STAGE_IDS = [2, 3, 8, 28, 31, 32];

const FILTER_OPTIONS: {
  Stage: { id: number; name: string }[];
  Characters: charUtils.CharacterInfo[];
} = {
  Stage: LEGAL_STAGE_IDS.map((id) => ({ id, name: stageUtils.getStageName(id) })),
  Characters: charUtils.getAllCharacters().filter((character) => !IGNORE_CHARACTERS.includes(character.name)),
};

export const FilterMenu = ({ showFilters }: { showFilters: boolean }) => {
  const [open, setOpen] = useState(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<string>();
  const clearStoreFilters = useReplayFilter((store) => store.resetFilter);
  const setStagePlayed = useReplayFilter((store) => store.setStagePlayed);
  const stageFilter = useReplayFilter((store) => store.stagePlayed);
  const charactersFilter = useReplayFilter((store) => store.characters);
  const setCharacters = useReplayFilter((store) => store.setCharacters);
  const anchorRef = useRef<HTMLDivElement>(null);

  const handleStageSelected = (Stage: { id: number; name: string }) => {
    if (stageFilter == Stage.id) {
      setStagePlayed(0);
    } else {
      setStagePlayed(Stage.id);
    }
    setOpen(false);
  };

  const handleFilterMenuToggle = (menu: "Stage" | "Characters") => {
    setSelectedFilterOptions(menu);
    setOpen((prevOpen) => (selectedFilterOptions === menu ? !prevOpen : true));
  };
  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };
  const handleCharacterSelected = (CharacterID: number) => {
    const SelectedCharacters = [...charactersFilter];
    const index = SelectedCharacters.findIndex((x) => x == CharacterID);
    if (index > -1) {
      SelectedCharacters.splice(index, 1);
    } else {
      SelectedCharacters.push(CharacterID);
    }
    setCharacters(SelectedCharacters);
  };
  const clearFilters = () => {
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
          backgroundColor: "#1B0B28",
          background: "linear-gradient(180deg,rgba(27, 11, 40, 1) 0%, rgba(41, 19, 59, 1) 100%)",
          padding: "10px",
        }}
      >
        <div>
          <ButtonGroup ref={anchorRef} aria-label="Button group with a nested menu">
            <Button
              variant={stageFilter != 0 ? "contained" : "outlined"}
              onClick={() => handleFilterMenuToggle("Stage")}
            >
              {stageFilter != 0 ? FILTER_OPTIONS.Stage.find((x) => x.id == stageFilter)?.name : "Stage"}
            </Button>
            <Button
              onClick={() => handleFilterMenuToggle("Characters")}
              variant={charactersFilter.length > 0 ? "contained" : "outlined"}
            >
              {charactersFilter.length === 0 ? "Characters" : charactersFilter.length + " selected"}
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
                        CharacterFilters={FILTER_OPTIONS.Characters}
                        SelectedCharacters={charactersFilter}
                        handleSelected={handleCharacterSelected}
                      />
                    )}
                    {selectedFilterOptions == "Stage" && (
                      <StageFilter
                        Stages={FILTER_OPTIONS.Stage}
                        SelectedStage={stageFilter}
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
