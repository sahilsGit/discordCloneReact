import useAuth from "@/hooks/useAuth";
import React, { createContext, useEffect, useReducer } from "react";
import { useNavigate } from "react-router-dom";

const initialState = {
  conversations: null,
  activeConversation: null,
  messages: null,
  cursor: null,
  hasMore: null,
  cache: null,
};

const conversationsReducer = (state, action) => {
  switch (action.type) {
    case "SET_CONVERSATIONS":
      return { ...state, conversations: action.payload };
    case "SET_ACTIVE_CONVERSATION":
      return { ...state, activeConversation: action.payload };
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
        activeConversation: null,
        messages: null,
        cursor: null,
        hasMore: null,
        cache: {
          activeConversation: state.activeConversation,
          messages: state.messages,
          cursor: state.cursor,
          hasMore: state.hasMore,
        },
      };
    case "USE_CACHE":
      return {
        ...state,
        activeConversation: state.cache.activeConversation,
        messages: state.cache.messages,
        cursor: state.cache.cursor,
        hasMore: state.cache.hasMore,
        cache: null,
      };
    default:
      return state;
  }
};

export const ConversationsContext = createContext(initialState);

export const ConversationsContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(conversationsReducer, initialState);
  const profileId = useAuth("id");

  const value = {
    ...state,
    dispatch,
  };

  useEffect(() => {
    state.activeConversation &&
      navigate(
        `/@me/conversations/${state.activeConversation.theirProfileId}/${profileId}`
      );
  }, [state.activeConversation]);

  return (
    <ConversationsContext.Provider value={value}>
      {children}
    </ConversationsContext.Provider>
  );
};
