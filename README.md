<!-- # react-manage-state
 **react-manage-state is the simplest way to manage your global state with little boilerplate code. It uses React's createContext and useState under the hood with first class typescript support.**

## Note:
- Make sure your code editor supports typescript **v4 or above** or just use latest version of **[Visual Studio code](https://code.visualstudio.com/download)**
- If you are using **react-manage-state** in a **typescript** project, make sure you set **declaration: false** in your **tsconfig.json**

# Examples:
- [Javascript project](https://github.com/sai6855/react-manage-state-example-js)
- [Typescript project](https://github.com/sai6855/react-manage-state-example-ts)

# Set Up:
```
import React from "react";
import { createContext,useProvider } from "react-manage-state";

const defaultstore = {
    user:{
        firstName:"",
        lastName:"",
        middleName:""
    }
}

const StoreContext = createContext(defaultStore);

export const StoreProvider = ({ children }) => {
  const { state, setState } = useProvider(defaultStore);

  return (
    <StoreContext.Provider value={{ state, setState }}>{children}</StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  const { state, setState } = React.useContext(StoreContext);

  return { setState, state };
};

```

### Wrap above **StoreProvider** function at your App top level in app's entry file:
```
ReactDOM.render(
  <React.StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
```

##### That's it boiler plate is done, now you can import useStoreContext anywhere in your app to access and change store values.

## How to access and change store values.

As you can see **defaultStore** has **user** property and user has **firstName** and **lastName** as properties, we will create 2 input fields whose values are firstName and lastName respectively, Using **setState** function we will learn how to capture user entered fields and store them.

```
import React from "react";
import useStoreContext from "../Store/useStoreContext";

const Input = () => {
  const { setState , state} = useStoreContext();

  return (
    <>
      <input
       value={state.store.user.firstName}
       placeholder="firstname"
       onChange={(e) => setState(() => e.target.value, "store.app.user.firstName")}
      />
      <input
        placeholder="lastname"
        value={state.store.user.lastName}
        onChange={(e) => setState(e.target.value, "store.app.user.lastName")}
      />
       <input
        placeholder="middlename"
        value={state.store.user.middleName}
        onChange={(e) => setState((prevMiddleName)=>e.target.value, "store.app.user.lastName")}
      />
    </>
  );
};
```

# About setState:
**setState** uses react's **useState** hook under the hood, so as useState is asynchronous function setState is also asynchronous function. **setState** accepts 2 parameters, **1st parameter** is either a callback function which returns a value or direct value it's self. **2nd parameter** is the path of property in defaultStore object.
if you use callback function as 1st parameter then callback gives you 2 parameters, 1st parameter is the value of path in previous render and 2nd is value of store in previous render.
 -->


Work in Progress , Please don't use it yet.
