// import React, { FC, HTMLAttributes, ReactChild } from 'react';

//  interface Props extends HTMLAttributes<HTMLDivElement> {
//   /** custom content, defaults to 'the snozzberries taste like snozzberries' */
//   children?: ReactChild;
// }

// // Please do not use types off of a default export module or else Storybook Docs will suffer.
// // see: https://github.com/storybookjs/storybook/issues/9556
// /**
//  * A custom Thing component. Neat!
//  */
// export const Thing: FC<Props> = ({ children }) => {

//import useSetStore from "./Hooks/useSetStore";
import {
  useProvider,
  createContext,
  IContext,
} from './Store/Hooks/StoreProvider';

export { useProvider, createContext, IContext };
