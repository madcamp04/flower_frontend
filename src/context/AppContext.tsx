import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('userName') || '');
  const [groupName, setGroupName] = useState<string>(() => localStorage.getItem('groupName') || '');
  const [groupOwner, setGroupOwner] = useState<string>(() => localStorage.getItem('groupOwner') || '');
  const [projectName, setProjectName] = useState<string>(() => localStorage.getItem('projectName') || '');
  const [taskName, setTaskName] = useState<string>(() => localStorage.getItem('taskName') || '');

  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);

  useEffect(() => {
    localStorage.setItem('groupName', groupName);
  }, [groupName]);

  useEffect(() => {
    localStorage.setItem('groupOwner', groupOwner);
  }, [groupOwner]);

  useEffect(() => {
    localStorage.setItem('projectName', projectName);
  }, [projectName]);

  useEffect(() => {
    localStorage.setItem('taskName', taskName);
  }, [taskName]);

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