// We need to implement search "engine" on client side

// Search engine requirements:
// 1. Search data source should be persisted, and should not be re-downloaded on each app load.
// 2. Each search request should be cached in order to prevent unnecessary search function invocation
// 3. Minimum string length to initiate search should be 2 symbols
// 4. Fields used to search: type, name (Model defined in services/SearchService.ts)
// 5. Result prioritization:
//   1. market
//   2. growing price: item value lastTradedPrevious should be closer to high value

//=====================================================================================================

// Display options:
// For the search input use simple input field
// for displaying search result show a list where each list item looks like below:
// Since the search results may be huge, we need to have some kind of optimization, please propose a solution

// #####################################################
// #          item name | market | price              #
// #####################################################

// Item name: ${name}_${type}
// Price: we should show lastTradedPrevious * lotSize, and it should be colored in:
//// red - if price is lower than lastTradedPrevious,
//// grey - if price the same,
//// green - if price higher than lastTradedPrevious


import { useState } from 'react'
import "./styles.css";
import useSearchService from "./hook/useSearchService";
import { Search } from './components/Search';
import MarketGrid from './components/MarketGrid';
import ReactPaginate from 'react-paginate';


export default function App() {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);

  const searchResult = useSearchService({
    search,
    page
  });

  function handlePageClick(selectedItem: { selected: number; }): void {
    setPage(selectedItem.selected + 1);
  }

  return (
    <div className="App">
      <Search search={search} setSearch={setSearch} />
      <div className='Total'>Total: {searchResult.totalItems}</div>
      <MarketGrid markets={searchResult.result} />
      <div className='Paginated'>
        <ReactPaginate
          previousLabel="Previous"
          nextLabel="Next"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakLabel="..."
          breakClassName="page-item"
          breakLinkClassName="page-link"
          pageCount={searchResult.totalPages}
          marginPagesDisplayed={2}
          pageRangeDisplayed={15}
          onPageChange={handlePageClick}
          containerClassName="pagination"
          activeClassName="active"
        />      
      </div>
    </div>
  );
}
