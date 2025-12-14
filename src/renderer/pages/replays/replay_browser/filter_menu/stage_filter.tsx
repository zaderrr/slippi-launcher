import { MenuItem } from "@mui/material";

export const StageFilter = ({
  Stages,
  SelectedStage,
  handleStageSelected,
}: {
  handleStageSelected: (Stage: { id: number; name: string }) => void;
  Stages: { id: number; name: string }[];
  SelectedStage: { id: number; name: string };
}) => {
  return (
    <>
      {Stages.map((option, index) => (
        <MenuItem
          key={index}
          selected={SelectedStage.id === option.id}
          onClick={() => handleStageSelected(option)}
          style={{ width: "100%" }}
        >
          {option.name}
        </MenuItem>
      ))}
    </>
  );
};
