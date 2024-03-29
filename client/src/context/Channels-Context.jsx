import React, { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  channels: null,
  activeChannel: null,
  messages: null,
  cursor: null,
  hasMore: null,
  cache: null,
};

const channelsReducer = (state, action) => {
  switch (action.type) {
    case "SET_CHANNELS":
      return { ...state, channels: action.payload };
    case "SET_ACTIVE_CHANNEL":
      return { ...state, activeChannel: action.payload };
    case "SET_MESSAGES":
      return {
        ...state,
        messages: action.payload.messages,
        cursor: action.payload.cursor,
        hasMore: action.payload.hasMore,
      };
    case "SET_CUSTOM":
      return { ...state, ...action.payload };
    case "ADD_TO_CACHE":
      return {
        ...state,
        channels: null,
        activeChannel: null,
        messages: null,
        cursor: null,
        hasMore: null,
        cache: {
          channels: state.channels,
          activeChannel: state.activeChannel,
          messages: state.messages,
          cursor: state.cursor,
          hasMore: state.hasMore,
        },
      };
    case "USE_CACHE":
      return {
        ...state,
        channels: state.cache.channels,
        activeChannel: state.cache.activeChannel,
        messages: state.cache.messages,
        cursor: state.cache.cursor,
        hasMore: state.cache.hasMore,
        cache: null,
      };
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

export const ChannelsContext = createContext(initialState);

export const ChannelsContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(channelsReducer, initialState);
  const value = { ...state, dispatch };

  useEffect(() => {
    state.activeChannel &&
      navigate(
        `/servers/${state.activeChannel.serverId}/${state.activeChannel._id}`
      );
  }, [state.activeChannel]);

  return (
    <ChannelsContext.Provider value={value}>
      {children}
    </ChannelsContext.Provider>
  );
};
