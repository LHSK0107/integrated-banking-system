import React from "react";
import ReactPaginate from "react-paginate";

const Paging = ({ itemsPerPage }) => {
//   console.log(currentItems, count, handlePageChange);
  
  return (
      <ReactPaginate
        // pageCount={count}
        //   activePage={page}
        //   itemsCountPerPage={10} // 한 페이지당 보여줄 리스트 아이템의 개수
        //   totalItemsCount={count} // 총 아이템의 개수
        pageRangeDisplayed={10} // Paginator 내에서 보여줄 페이지의 범위
        marginPagesDisplayed={0}
        breakLabel={""}
        previousLabel={"이전"}
        nextLabel={"다음"}
        // onPageChange={handlePageChange}
        // containerClassName={"pagination-ul"}
        // activeClassName={"currentPage"}
        // previousClassName={"pageLabel-btn"}
        // nextClassName={"pageLabel-btn"}
        renderOnZeroPageCount={null}
      />
  );
};

export default Paging;
