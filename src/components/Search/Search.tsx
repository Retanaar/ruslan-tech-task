//import {} from 'react'

import { ChangeEvent } from "react";

import { debounce }  from 'lodash';
interface Props {
  search: string;
  setSearch: (s: string) => void;
}

export const Search = ({ search, setSearch }: Props) => {

  const handleSearch = debounce((e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  }, 300);

  return (
    <div style={{ display: "flex", alignItems: 'flex-end'}}>
      <div style={{marginRight: "1rem"}}>Search</div>
      <div><input name='search' onChange={handleSearch}/></div>
    </div>
  );
};



