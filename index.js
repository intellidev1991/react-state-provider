import React, { createContext, useContext, useReducer } from "react";
import PropTypes from "prop-types";

export const StateContext = createContext();

/**
 * Wrap this component around main App content
 * @example
  <StateProvider initialState={initialState} reducer={reducer}> App </StateProvider>
 */
export const StateProvider = ({ reducer, initialState, children }) => (
  <StateContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </StateContext.Provider>
);

/**
 * use this Hook inside your any component to access your store
 * @example
   const [{ user }, dispatch] = useStateValue();
 */
export const useStateValue = () => useContext(StateContext);

/**
 * if you have more than one reducer use this function to create root_reducer, we mix all of your reducers into one reducer function
 * @param {object} reducers
 * @example
  const root_reducer = combineReducers({user: reducer_user,items: reducer_items});
 */
export const combineReducers = reducers => {
  // First get an array with all the keys of the reducers (the reducer names)
  const reducerKeys = Object.keys(reducers);

  return function combination(state = {}, action) {
    // This is the object we are going to return.
    const nextState = {};

    // Loop through all the reducer keys
    for (let i = 0; i < reducerKeys.length; i++) {
      // Get the current key name
      const key = reducerKeys[i];
      // Get the current reducer
      const reducer = reducers[key];
      // Get the the previous state
      const previousStateForKey = state[key];
      // Get the next state by running the reducer
      const nextStateForKey = reducer(previousStateForKey, action);
      // Update the new state for the current reducer
      nextState[key] = nextStateForKey;
    }
    return nextState;
  };
};

// --- propTypes
StateProvider.propTypes = {
  /**
   * @return {React.Node}
   */
  children: PropTypes.node.isRequired,

  /**
   * Object containing initial state value.
   */
  initialState: PropTypes.shape({}).isRequired,

  /**
   *
   * @param {object} state
   * @param {object} action
   */
  reducer: PropTypes.func.isRequired
};
