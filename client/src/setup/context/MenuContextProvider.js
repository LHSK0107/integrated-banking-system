import React, {createContext, useState} from 'react';

const MenuContext = createContext(null);

export const MenuContextProvider = ({children}) => {
    const [clickCountList, setClickCountList] = useState(null);
    const value = {
      clickCountList,
      setClickCountList
    }
    return (
      <MenuContext.Provider value={value}>{children}</MenuContext.Provider>
    );
}


export default MenuContext;