import React from 'react';
/* eslint-disable react/prop-types, import/no-extraneous-dependencies */
import FirebaseProvider from './src/containers/FirebaseProvider';

import firebase from './src/services/firebase';

export const wrapRootElement = ({ element }) => {
  const ConnectedRootElement = (
    <FirebaseProvider firebase={firebase}>
      {element}
    </FirebaseProvider>
  );

  return ConnectedRootElement;
};
