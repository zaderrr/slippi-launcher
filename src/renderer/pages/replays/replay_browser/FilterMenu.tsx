import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import { forwardRef, useRef, useState } from "react";
export const FilterMenu = forwardRef<HTMLInputElement>(() => {
  const [open, setOpen] = useState(false);
  const [selectedFilterOptions, setSelectedFilterOptions] = useState<string>();
  const [replayFilter, setReplayFilter] = useState<ReplayFilter>({ Stage: undefined, Characters: [] });
  const anchorRef = useRef<HTMLDivElement>(null);

  const StageFilterOptions = [
    "Battlefield",
    "Pokemon Stadium",
    "Final Destination",
    "Dream Land",
    "Yoshi's story",
    "Fountain of Dreams",
  ];
  const CharactersFilterOptions = ["Falco", "Fox", "Marth", "Sheik"];

  const FilterOptions = {
    Stage: StageFilterOptions,
    Characters: CharactersFilterOptions,
  };
  interface ReplayFilter {
    Stage: string | undefined;
    Characters: string[] | undefined;
  }
  const handleMenuItemClick = (event: React.MouseEvent<HTMLLIElement, MouseEvent>, index: number) => {
    const NewFilter: ReplayFilter = { Stage: replayFilter.Stage, Characters: replayFilter.Characters };
    if (selectedFilterOptions == "Stage") {
      if (replayFilter.Stage == StageFilterOptions[index]) {
        NewFilter.Stage = undefined;
      } else {
        NewFilter.Stage = StageFilterOptions[index];
      }
    } else if (selectedFilterOptions == "Chracters") {
      //  NewFilter.Characters = CharactersFilterOptions[index];
    }
    setReplayFilter(NewFilter);
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
  return (
    <div
      style={{ flex: "flex", height: "40px", backgroundColor: "rgb(41,19,59)", borderRadius: "10px", padding: "10px" }}
    >
      <ButtonGroup ref={anchorRef} aria-label="Button group with a nested menu">
        <Button variant={replayFilter.Stage ? "contained" : "outlined"} onClick={handleStageFilterToggle}>
          {replayFilter.Stage || "Stage"}
        </Button>
        <Button onClick={handleCharactersFilterToggle}>Characters</Button>
        <Button
          size="small"
          aria-controls={open ? "split-button-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition={true}
        disablePortal={true}
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
                  {FilterOptions[selectedFilterOptions].map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={replayFilter[selectedFilterOptions] === option}
                      onClick={(event) => handleMenuItemClick(event, index)}
                    >
                      {option}
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
