import { MenuItem } from "@mui/material";

export const StageFilter = ({
  Stages,
  SelectedStage,
  handleStageSelected,
}: {
  handleStageSelected: (Stage: { id: number; name: string }) => void;
  Stages: { id: number; name: string }[];
  SelectedStage: number;
}) => {
  return (
    <>
      {Stages.map((option, index) => (
        <MenuItem
          key={index}
          selected={SelectedStage == option.id}
          onClick={() => handleStageSelected(option)}
          style={{ width: "100%" }}
        >
          {option.name}
        </MenuItem>
      ))}
    </>
  );
};
