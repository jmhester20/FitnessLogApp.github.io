// client/src/AuthContext.js
import React from 'react';

export const AuthContext = React.createContext({
  token: null,
  setToken: () => {}
});
