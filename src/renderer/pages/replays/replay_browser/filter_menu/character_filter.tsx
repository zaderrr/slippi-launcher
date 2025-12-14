import { Button } from "@mui/material";
import type { characters as charUtils } from "@slippi/slippi-js";

import { getCharacterIcon } from "@/lib/utils";
export const CharacterFilterMenu = ({
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
