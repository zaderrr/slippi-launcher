import React, { useState } from "react";

import { TabbedDialog } from "@/pages/settings/dolphin_settings/gecko_codes/tabbed_dialog";

import { GameFilterTab } from "./game_filter_tab";
import { PlayerFilterTab } from "./player_filter_tab";
export const AdvancedFilter = ({
  showDialog,
  setShowDialog,
}: {
  showDialog: boolean;
  setShowDialog: (dialog: boolean) => void;
}) => {
  const tabs = React.useMemo((): { name: string; Component: React.ComponentType }[] => {
    const playerFilterPage = () => <PlayerFilterTab />;
    const gameFilterPage = () => <GameFilterTab />;
    return [
      {
        name: "Player", //Add localisation
        Component: playerFilterPage,
      },
      {
        name: "Game", // add localisation
        Component: gameFilterPage,
      },
    ];
  }, []);

  const [currentTab, setCurrentTab] = useState(0);
  return (
    <>
      <TabbedDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        tabs={tabs}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />
    </>
  );
};
