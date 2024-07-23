import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  userName: string;
  setUserName: (name: string) => void;
  groupName: string;
  setGroupName: (name: string) => void;
  groupOwner: string;
  setGroupOwner: (name: string) => void;
  projectName: string;
  setProjectName: (name: string) => void;
  taskName: string;
  setTaskName: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [userName, setUserName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupOwner, setGroupOwner] = useState('');
  const [projectName, setProjectName] = useState('');
  const [taskName, setTaskName] = useState('');

  return (
    <AppContext.Provider
      value={{
        userName,
        setUserName,
        groupName,
        setGroupName,
        groupOwner,
        setGroupOwner,
        projectName,
        setProjectName,
        taskName,
        setTaskName,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
