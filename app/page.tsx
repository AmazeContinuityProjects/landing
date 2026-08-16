"use client";

import Image from "next/image";
import { useState } from "react";
import { AboutSection, NavigationTabs } from "@amazecontinuityprojects/amazeui";

export default function Home() {
  // 1. Set up the state variables in your parent page
  const [activeTab, setActiveTab] = useState("home");
  const [currSemesterID, setCurrSemesterID] = useState("SEM1");
  const [isReloading, setIsReloading] = useState(false);

  const [settings, setSettings] = useState({
    isSidebarCollapsed: false,
  });

  // 2. Define handler functions
  const handleLogOut = () => console.log("Logging out...");
  const handleReload = () => setIsReloading(true);
  return (
    <NavigationTabs
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      currSemesterID={currSemesterID}
      setCurrSemesterID={setCurrSemesterID}
      handleLogOutRequest={handleLogOut}
      handleReloadRequest={handleReload}
      showGpa={false}
      showProfilePhoto={false}
      settings={settings}       
      setSettings={setSettings}
      semesterIDs={[]}
      marksData={[]}
      ODhoursData={[]}
      // Pass other required state & callbacks here...
    />
  );
}
