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
//   return <div>{children || `the  like snozzberries`}</div>;
// };

import useSelector from "./Store/Hooks/useSelector";
import useSetState from "./Store/Hooks/useSetState";
//import useSetStore from "./Hooks/useSetStore";
import StoreProvider from "./Store/Hooks/StoreProvider";

export { StoreProvider, useSelector, useSetState };
