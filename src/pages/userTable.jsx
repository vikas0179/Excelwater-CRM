// import React, { useState } from "react";
// import { useTable, useRowSelect, useSortBy, useGlobalFilter, usePagination } from "react-table";
// import Card from "@/components/ui/Card";
// import { Icon } from "@iconify/react";
// import { useNavigate } from "react-router-dom";

// const UserTable = ({ columns, data, allData, pageIndex, setPageIndex, paginate = true, msg = "Data not found", Sname = "" }) => {
//   const navigate = useNavigate();

//   const tableInstance = useTable(
//     {
//       columns,
//       data,
//       initialState: {
//         pageSize: 100,
//         pageIndex: 0
//       }
//     },
//     useGlobalFilter,
//     useSortBy,
//     usePagination,
//     useRowSelect
//   );
//   const {
//     getTableProps,
//     getTableBodyProps,
//     headerGroups,
//     footerGroups,
//     page,
//     nextPage,
//     previousPage,
//     canNextPage,
//     canPreviousPage,
//     pageOptions,
//     state,
//     gotoPage,
//     pageCount,
//     setPageSize,
//     setGlobalFilter,
//     prepareRow
//   } = tableInstance;

//   const { globalFilter, pageSize } = state;
//   return (
//     <>
//       <div className="overflow-x-auto -mx-6">
//         <div className="inline-block min-w-full align-middle">
//           <div className="overflow-hidden ">
//             <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700" {...getTableProps}>
//               <thead className="bg-[#f1f5f9]  dark:bg-slate-700">
//                 {headerGroups?.map((headerGroup) => (
//                   <tr {...headerGroup?.getHeaderGroupProps()}>
//                     {headerGroup?.headers?.map((column) => (
//                       <th
//                         {...column?.getHeaderProps(column?.getSortByToggleProps())}
//                         scope="col"
//                         className=" table-th"
//                         style={{ width: column?.width }}
//                       >
//                         {column?.render("Header")}
//                         <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
//                       </th>
//                     ))}
//                   </tr>
//                 ))}
//               </thead>

//               <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" {...getTableBodyProps}>
//                 {page.length != 0 ? (
//                   page?.map((row) => {
//                     prepareRow(row);
//                     return (
//                       <tr {...row?.getRowProps()}>
//                         {row?.cells?.map((cell) => {
//                           return (
//                             <td {...cell?.getCellProps()} className="table-td">
//                               {cell?.render("Cell")}
//                             </td>
//                           );
//                         })}
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <>
//                     <tr role="row" className="">
//                       <td colSpan={columns?.length} role="cell" className="table-td text-center text-lg pb-0 pt-6">
//                         {msg}
//                       </td>
//                     </tr>
//                   </>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
//       {paginate && data?.length != 0 && (
//         <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
//           <div className=" flex items-center space-x-3 rtl:space-x-reverse">
//             {/* <select className="form-control py-2 w-max" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
//             {[10, 25, 50].map((pageSize) => (
//               <option key={pageSize} value={pageSize}>
//                 Show {pageSize}
//               </option>
//             ))}
//           </select> */}

//             <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
//               Showing
//               <span>
//                 {"  "}
//                 {allData.from} to {allData.to} of {allData.total} {Sname}
//               </span>
//             </span>
//           </div>
//           <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
//             <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 className={` ${pageIndex == 1 ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => setPageIndex(1)}
//                 // disabled={!canPreviousPage}
//               >
//                 <Icon icon="heroicons:chevron-double-left-solid" />
//               </button>
//             </li>
//             <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 className={` ${pageIndex == 1 ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => {
//                   if (pageIndex > 1) {
//                     setPageIndex(pageIndex - 1);
//                   }
//                 }}
//                 // disabled={!canPreviousPage}
//               >
//                 Prev
//               </button>
//             </li>
//             {Array.apply(0, Array(allData.last_page)).map((x, i) => (
//               <li key={i}>
//                 <button
//                   href="#"
//                   aria-current="page"
//                   className={` ${
//                     pageIndex === i + 1
//                       ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium "
//                       : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "
//                   }    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`}
//                   onClick={() => setPageIndex(i + 1)}
//                 >
//                   {i + 1}
//                 </button>
//               </li>
//             ))}
//             <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 className={` ${pageIndex == allData.last_page ? "opacity-50 cursor-not-allowed" : ""}`}
//                 onClick={() => {
//                   if (pageIndex < allData.last_page) {
//                     setPageIndex(pageIndex + 1);
//                   }
//                 }}
//                 // disabled={!canNextPage}
//               >
//                 Next
//               </button>
//             </li>
//             <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
//               <button
//                 onClick={() => setPageIndex(allData.last_page)}
//                 // disabled={!canNextPage}
//                 className={`${pageIndex == allData.last_page ? "opacity-50 cursor-not-allowed" : ""}`}
//               >
//                 <Icon icon="heroicons:chevron-double-right-solid" />
//               </button>
//             </li>
//           </ul>
//         </div>
//       )}
//     </>
//   );
// };

// export default UserTable;

import React from "react";
import { useTable, useRowSelect, useSortBy, useGlobalFilter, usePagination } from "react-table";
import { Icon } from "@iconify/react";

const UserTable = ({ columns, data, allData, pageIndex, setPageIndex, paginate = true, msg = "Data not found", Sname = "" }) => {
  const tableInstance = useTable(
    {
      columns,
      data,
      disableSortBy: true,
      initialState: {
        pageSize: 100,
        pageIndex: 0
      }
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    useRowSelect
  );

  const { getTableProps, getTableBodyProps, headerGroups, footerGroups, page, nextPage, previousPage, canNextPage, canPreviousPage, pageOptions, state, gotoPage, pageCount, setPageSize, setGlobalFilter, prepareRow } = tableInstance;

  const { globalFilter, pageSize } = state;

  const scrollToTop = () => {
    window.scroll({
      top: 0,
      behavior: "smooth"
    });
  };

  return (
    <>
      <div className="overflow-x-auto -mx-6">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden ">
            <table className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700" {...getTableProps}>
              <thead className="bg-[#f1f5f9]  dark:bg-slate-700">
                {headerGroups?.map((headerGroup) => (
                  <tr {...headerGroup?.getHeaderGroupProps()}>
                    {headerGroup?.headers?.map((column) => (
                      <th {...column?.getHeaderProps(column?.getSortByToggleProps())} scope="col" className=" table-th " style={{ width: column.width }}>
                        {column?.render("Header")}
                        <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700" {...getTableBodyProps}>
                {page.length != 0 ? (
                  page?.map((row) => {
                    prepareRow(row);
                    return (
                      <tr {...row?.getRowProps()}>
                        {row?.cells?.map((cell) => {
                          return (
                            <td {...cell?.getCellProps()} className="table-td">
                              {cell?.render("Cell")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                ) : (
                  <>
                    <tr role="row" className="">
                      <td colSpan={columns?.length} role="cell" className="table-td text-center text-lg pb-0 pt-6">
                        {msg}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {paginate && data.length > 0 && (
        <div className="md:flex md:space-y-0 space-y-5 justify-between mt-6 items-center">
          <div className=" flex items-center space-x-3 rtl:space-x-reverse">
            {/* <select className="form-control py-2 w-max" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
            {[10, 25, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select> */}

            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              Showing
              <span className="pl-[5px]">
                {allData.from} to {allData.to} of {allData.total} {Sname}
              </span>
            </span>
          </div>
          {/* <ul className="flex items-center  space-x-3  rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${pageIndex == 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => setPageIndex(1)}
                // disabled={!canPreviousPage}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${pageIndex == 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (pageIndex > 1) {
                    setPageIndex(pageIndex - 1);
                  }
                }}
                // disabled={!canPreviousPage}
              >
                Prev
              </button>
            </li>
            {Array.apply(0, Array(allData.last_page)).map((x, i) => (
              <li key={i}>
                <button href="#" aria-current="page" className={` ${pageIndex === i + 1 ? "bg-slate-900 dark:bg-slate-600  dark:text-slate-200 text-white font-medium " : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900  font-normal  "}    text-sm rounded leading-[16px] flex h-6 w-6 items-center justify-center transition-all duration-150`} onClick={() => setPageIndex(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={` ${pageIndex == allData.last_page ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (pageIndex < allData.last_page) {
                    setPageIndex(pageIndex + 1);
                  }
                }}
                // disabled={!canNextPage}
              >
                Next
              </button>
            </li>
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => setPageIndex(allData.last_page)}
                // disabled={!canNextPage}
                className={`${pageIndex == allData.last_page ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul> */}
          <ul className="flex items-center space-x-3 rtl:space-x-reverse">
            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${pageIndex == 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  setPageIndex(1);
                  scrollToTop();
                }}
              >
                <Icon icon="heroicons:chevron-double-left-solid" />
              </button>
            </li>

            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${pageIndex == 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (pageIndex > 1) {
                    setPageIndex(pageIndex - 1);
                    scrollToTop();
                  }
                }}
              >
                Prev
              </button>
            </li>

            {(() => {
              const totalPages = allData.last_page;
              const maxPagesToShow = 5; // Adjust to show more or fewer pages

              let pages = [];
              if (totalPages <= maxPagesToShow) {
                for (let i = 1; i <= totalPages; i++) {
                  pages.push(i);
                }
              } else {
                let startPage = Math.max(1, pageIndex - 2);
                let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

                if (startPage > 1) {
                  pages.push(1);
                  if (startPage > 2) {
                    pages.push("...");
                  }
                }

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(i);
                }

                if (endPage < totalPages) {
                  if (endPage < totalPages - 1) {
                    pages.push("...");
                  }
                  pages.push(totalPages);
                }
              }

              return pages.map((page, index) => (
                <li key={index}>
                  {page === "..." ? (
                    <span className="text-slate-600 dark:text-slate-400">...</span>
                  ) : (
                    <button
                      className={`${pageIndex === page ? "bg-slate-900 dark:bg-slate-600 text-white font-medium" : "bg-slate-100 dark:bg-slate-700 dark:text-slate-400 text-slate-900 font-normal"} text-sm rounded h-6 w-6 flex items-center justify-center transition-all duration-150`}
                      onClick={() => {
                        setPageIndex(page);
                        scrollToTop();
                      }}
                    >
                      {page}
                    </button>
                  )}
                </li>
              ));
            })()}

            <li className="text-sm leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                className={`${pageIndex == allData.last_page ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={() => {
                  if (pageIndex < allData.last_page) {
                    setPageIndex(pageIndex + 1);
                    scrollToTop();
                  }
                }}
              >
                Next
              </button>
            </li>

            <li className="text-xl leading-4 text-slate-900 dark:text-white rtl:rotate-180">
              <button
                onClick={() => {
                  setPageIndex(allData.last_page);
                  scrollToTop();
                }}
                className={`${pageIndex == allData.last_page ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Icon icon="heroicons:chevron-double-right-solid" />
              </button>
            </li>
          </ul>
        </div>
      )}
    </>
  );
};

export default UserTable;
