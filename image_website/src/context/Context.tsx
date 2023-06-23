"use client"


import React, { Dispatch, createContext, useReducer } from "react";

type StateType = {
  loading: boolean;
  error: {
    isError: boolean,
    message: string
  };
};

type ActionType = {
  type: string;
  value?: any; // Add a value property to ActionType
};

const initialState: StateType = {
  loading: false,
  error: {
    isError: false,
    message: ''
  },
};

const reducer = (
    state: StateType, 
    action: ActionType) => 
    {
    switch (action.type) {
        case "LOADING":
        return {
            ...state,
            loading: action.value 
        };
        case "ERROR":
        return {
            ...state,
            error: action.value
        };
        default:
        return state;
    }
};

export const AppContext = createContext<{
  state: StateType;
  dispatch: Dispatch<ActionType>;
}>({ state: initialState, dispatch: () => null });




export const AppContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const setLoading = (
  dispatch: Dispatch<ActionType>, // Add type annotation for dispatch
  value: boolean // Add type annotation for value
) => dispatch({ type: "LOADING", value });

export const setError = (
    dispatch: Dispatch<ActionType>, // Add type annotation for dispatch
    value:  { isError: boolean; message: string } // Add type annotation for value
) => dispatch({ type: "ERROR", value });

