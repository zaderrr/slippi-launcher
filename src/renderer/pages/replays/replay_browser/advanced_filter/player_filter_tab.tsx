import type { PlayerFilter } from "@database/filters/types";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Input from "@mui/material/Input";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { useState } from "react";
type textField = "tag" | "connectCode" | "displayName";
export const PlayerFilterTab = () => {
  const [playerFilter, setPlayerFilter] = useState<PlayerFilter>({ type: "player" });
  const changePort = (port: number) => {
    const newFilter = { ...playerFilter };
    if (port == newFilter.port) {
      newFilter.port = undefined;
    } else {
      newFilter.port = port;
    }
    setPlayerFilter(newFilter);
  };

  const updateTextField = (field: textField, value: string) => {
    const newFilter: PlayerFilter = { ...playerFilter };
    newFilter[field] = value;
    setPlayerFilter(newFilter);
  };

  const updateDidWin = (winner: boolean) => {
    const newFilter: PlayerFilter = { ...playerFilter };
    newFilter.mustBeWinner = winner;
    setPlayerFilter(newFilter);
  };

  const applyFilter = () => {
    console.log(playerFilter);
  };
  return (
    <>
      <div style={{ width: "80%" }}>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p>Player name: </p>
          <Input placeholder="Fizzi" onChange={(event) => updateTextField("displayName", event.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p>Player code: </p>
          <Input placeholder="Fiz#999" onChange={(event) => updateTextField("connectCode", event.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p>Player tag: </p>
          <Input placeholder="MIKU" onChange={(event) => updateTextField("tag", event.target.value)} />
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p>Player port: </p>
          <RadioGroup
            row={true}
            value={playerFilter.port || 0}
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
          >
            <FormControlLabel value="1" control={<Radio color="error" onClick={() => changePort(1)} />} label="" />
            <FormControlLabel value="2" control={<Radio color="info" onClick={() => changePort(2)} />} label="" />
            <FormControlLabel value="3" control={<Radio color="warning" onClick={() => changePort(3)} />} label="" />
            <FormControlLabel value="4" control={<Radio color="success" onClick={() => changePort(4)} />} label="" />
          </RadioGroup>
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p>Player character(s): </p>
          <Input placeholder="Fiz#999" />
        </div>
        <div style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between" }}>
          <p>Player won: </p>
          <Checkbox onChange={(event, checked) => updateDidWin(checked)} />
        </div>
        <Button variant="text" onClick={applyFilter}>
          Save
        </Button>
      </div>
    </>
  );
};
