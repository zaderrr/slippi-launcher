import type { PlayerFilter } from "@database/filters/types";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grow from "@mui/material/Grow";
import Input from "@mui/material/Input";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { characters as charUtils, stages as stageUtils } from "@slippi/slippi-js";
import { useRef, useState } from "react";

import { useReplayFilter } from "@/lib/hooks/use_replay_filter";

import { CharacterFilterMenu } from "../filter_menu/character_filter";
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
export const PlayerFilterTab = () => {
  const anchorRef = useRef<HTMLDivElement>(null);
  const setStorePlayerFilter = useReplayFilter((store) => store.setPlayer);

  const storePlayerFilter = useReplayFilter((store) => store.player);
  const [displayName, setDisplayName] = useState(storePlayerFilter.displayName ?? "");
  const [connectCode, setConnectCode] = useState(storePlayerFilter.connectCode ?? "");
  const [tag, setTag] = useState(storePlayerFilter.tag ?? "");
  const [port, setPort] = useState<number | undefined>(storePlayerFilter.port);
  const [characterIds, setCharacterIds] = useState<number[]>(storePlayerFilter.characterIds ?? []);
  const [mustBeWinner, setMustBeWinner] = useState(storePlayerFilter.mustBeWinner ?? false);
  const [open, setOpen] = useState(false);
  const characterSelected = (characterID: number) => {
    setCharacterIds((current) => {
      const selectedCharacters = [...current];
      const index = selectedCharacters.findIndex((x) => x === characterID);
      if (index > -1) {
        selectedCharacters.splice(index, 1);
      } else {
        selectedCharacters.push(characterID);
      }
      return selectedCharacters;
    });
  };
  const changePort = (port: number) => {
    setPort((current) => (current === port ? undefined : port));
  };
  const handleCharacterToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }
    setOpen(false);
  };

  const applyFilter = () => {
    const newFilter: PlayerFilter = { type: "player" };
    if (displayName) {
      newFilter.displayName = displayName;
    }
    if (connectCode) {
      newFilter.connectCode = connectCode;
    }
    if (tag) {
      newFilter.tag = tag;
    }
    if (port) {
      newFilter.port = port;
    }
    if (characterIds.length > 0) {
      newFilter.characterIds = characterIds;
    }
    if (mustBeWinner) {
      newFilter.mustBeWinner = true;
    }
    setStorePlayerFilter(newFilter);
  };
  return (
    <>
      <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p style={{ width: "100%" }}>Player name </p>
          <Input
            placeholder="Fizzi"
            value={displayName}
            onChange={(event) => setDisplayName(event.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p style={{ width: "100%" }}>Player code </p>
          <Input
            placeholder="Fiz#999"
            value={connectCode}
            onChange={(event) => setConnectCode(event.target.value.toUpperCase())} //Query expects upper case
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p style={{ width: "100%" }}>Player tag </p>
          <Input
            placeholder="MIKU"
            value={tag}
            onChange={(event) => setTag(event.target.value)}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p style={{ width: "100%" }}>Player port </p>
          <RadioGroup
            row={true}
            value={(port ?? 0).toString()}
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            style={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <FormControlLabel
              value="1"
              control={<Radio color="error" onClick={() => changePort(1)} style={{ width: "100%" }} />}
              label=""
            />
            <FormControlLabel
              value="2"
              control={<Radio color="info" onClick={() => changePort(2)} style={{ width: "100%" }} />}
              label=""
            />
            <FormControlLabel
              value="3"
              control={<Radio color="warning" onClick={() => changePort(3)} style={{ width: "100%" }} />}
              label=""
            />
            <FormControlLabel
              value="4"
              control={<Radio color="success" onClick={() => changePort(4)} style={{ width: "100%" }} />}
              label=""
            />
          </RadioGroup>
        </div>
        <div
          style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}
          ref={anchorRef}
        >
          <p style={{ width: "100%" }}>Player character(s) </p>
          <Button
            onClick={handleCharacterToggle}
            style={{ width: "100%" }}
            variant={characterIds.length === 0 ? "outlined" : "contained"}
          >
            {characterIds.length === 0 && "Characters"}
            {characterIds.length > 0 && characterIds.length + " selected"}
          </Button>
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p style={{ width: "100%" }}>Player won </p>
          <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
            <Checkbox checked={mustBeWinner} onChange={(event, checked) => setMustBeWinner(checked)} />
          </div>
        </div>
        <Button variant="text" onClick={applyFilter}>
          Save
        </Button>
        <Popper
          sx={{ zIndex: 1 }}
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          transition={true}
          disablePortal={true}
          style={{ width: "100%" }}
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
                    <CharacterFilterMenu
                      handleSelected={characterSelected}
                      CharacterFilters={FILTER_OPTIONS.Characters}
                      SelectedCharacters={characterIds}
                    />
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
    </>
  );
};
