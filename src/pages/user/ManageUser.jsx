import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "@/services/ApiServices";
import { API_USERS_LIST_DATATABLE, API_USERS_STATUS } from "@/services/ApiEndPoint";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import LoaderWrapperView from "@/components/LoaderWrapperView";
import Card from "@/components/ui/Card";
import DataTables from "datatables.net";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "datatables.net";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react";

const ManageUser = () => {
  const navigate = useNavigate();
  const tableRef = useRef();

  const [show, setShow] = useState(false);
  const [id, setId] = useState("");
  const [Data, setData] = useState();
  const [status, setStatus] = useState("");

  const token = JSON.parse(localStorage.getItem("token"));
  const columns = [
    {
      data: "date",
      title: "Date",

      render: function (data, type, row) {
        return `
        <div>
        <span class="inline-flex items-center">
          <span class="text-sm text-slate-600 dark:text-slate-300 ">
            ${data}
            <br />
            ${row.status == 1 ? '<span class="badge bg-success-500 text-white">Active</span>' : '<span class="badge bg-warning-500 text-white">Deactive</span>'}
          </span>
        </span>
      </div>
            `;
      }
    },
    {
      data: "name",
      title: "Name"
    },

    { data: "email", title: "Email" },
    {
      data: "role",
      title: "Role",
      render: function (data, type, row) {
        return `
      <div>
      <span class="inline-flex items-center">
        <span class="text-sm text-slate-600 dark:text-slate-300 ">
    
          <br />
          ${data == 1 ? "<span>Sub Admin</span>" : "<span>Sales</span>"}
        </span>
      </span>
    </div>
          `;
      }
    },
    {
      data: "id",
      title: "<div class='text-end'>Action</div>",
      render: function (data, type, row) {
        return `


              <div class="flex justify-end">
              <button class="edit-btn btn btn-outline-dark text-center btn-sm ml-3 flex items-center" data-id="${row.id}"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--heroicons inline mr-1" width="1em" height="1em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"></path></svg>Edit</button>
           ${row.status == 1 ? `<button class="delete-btn btn btn-outline-warning text-center btn-sm ml-3 flex items-center" data-id="${row.id}" data-status="${row.status}"><svg xmlns="http://www.w3.org/2000/svg" class="mr-1" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 4c-4.419 0-8 3.582-8 8s3.581 8 8 8s8-3.582 8-8s-3.581-8-8-8m3.707 10.293a.999.999 0 1 1-1.414 1.414L12 13.414l-2.293 2.293a.997.997 0 0 1-1.414 0a.999.999 0 0 1 0-1.414L10.586 12L8.293 9.707a.999.999 0 1 1 1.414-1.414L12 10.586l2.293-2.293a.999.999 0 1 1 1.414 1.414L13.414 12z"/></svg>Deactivate</button>` : `<button class="delete-btn btn btn-outline-success text-center btn-sm ml-3 flex items-center" data-id="${row.id}" data-status="${row.status}"> <svg xmlns="http://www.w3.org/2000/svg" class="mr-1" width="1.13em" height="1em" viewBox="0 0 27 24"><path fill="currentColor" d="M24 24H0V0h18.4v2.4h-16v19.2h20v-8.8h2.4V24zM4.48 11.58l1.807-1.807l5.422 5.422l13.68-13.68L27.2 3.318L11.709 18.809z"/></svg>Activate</button>`}
                     </div>
       
            `;
      }
    }
  ];

  useEffect(() => {
    const tableData = new DataTables(tableRef.current, {
      processing: true,
      serverSide: true,
      ajax: {
        url: API_USERS_LIST_DATATABLE,

        dataSrc: "data",
        data: function (d) {
          //   d.customParam = "value";
        },
        beforeSend: function (request) {
          request.setRequestHeader("Authorization", `Bearer ${token}`);
        },
        error: function (xhr, error, thrown) {
          console.error("AJAX error:", error);
        },
        complete: function (xhr, textStatus) {
          console.log("AJAX request completed:", textStatus);
        }
      },

      columns,
      pageLength: 100,
      responsive: true,
      searching: true,
      searchDelay: 500,
      search: {
        search: ""
      },

      language: {
        lengthMenu: "Show _MENU_",
        search: "_INPUT_",
        searchPlaceholder: "Search keyword",
        info: "Showing _START_ to _END_ of _TOTAL_ entries",
        paginate: {
          first: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--heroicons" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M10.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L12.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06z"></path><path d="M4.72 11.47a.75.75 0 0 0 0 1.06l7.5 7.5a.75.75 0 1 0 1.06-1.06L6.31 12l6.97-6.97a.75.75 0 0 0-1.06-1.06z"></path></g></svg>',
          last: '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--heroicons" width="1em" height="1em" viewBox="0 0 24 24"><g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"><path d="M13.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L11.69 12L4.72 5.03a.75.75 0 0 1 1.06-1.06z"></path><path d="M19.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06L17.69 12l-6.97-6.97a.75.75 0 0 1 1.06-1.06z"></path></g></svg>',
          next: "Next",
          previous: "Pre"
        },
        emptyTable: "Data not found"
      }
    });

    tableRef.current.addEventListener("click", function async(event) {
      const target = event.target;

      if (target.classList.contains("edit-btn")) {
        const id = target.getAttribute("data-id");
        navigate(`/manage-users/edit/${id}`);
      }

      if (target.classList.contains("delete-btn")) {
        const id = target.getAttribute("data-id");
        const status = target.getAttribute("data-status");

        setShow(true);
        setId(id);
        setStatus(status);
      }
    });

    setData(tableData);
  }, []);

  const deleteData = async (ida) => {
    Api(`${API_USERS_STATUS}/${ida}`)
      .then((res) => {
        if (res.status === "RC200") {
          Data.ajax.reload();
          setShow(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Breadcrumbs title="Manage Users" />
      <LoaderWrapperView>
        <Card>
          <div className="md:flex justify-between items-center mb-6">
            <h4 className="card-title">Manage Users</h4>

            <div className="flex items-center">
              <button
                className="btn btn-outline-dark text-center mx-4 flex items-center"
                onClick={() => {
                  navigate("/manage-users/add");
                }}
              >
                <Icon icon="heroicons-outline:plus" />
                <span className="ml-1"> Add User</span>
              </button>
            </div>
          </div>
          <div className="overflow-x-auto -mx-6 border-t pt-1">
            <div className="inline-block min-w-full align-middle">
              <div className="overflow-hidden ">
                <table ref={tableRef} className="min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700">
                  <thead className="bg-slate-200 dark:bg-slate-700">
                    {/* {headerGroups?.map((headerGroup) => (
                      <tr {...headerGroup?.getHeaderGroupProps()}>
                        {headerGroup?.headers?.map((column) => (
                          <th {...column?.getHeaderProps(column?.getSortByToggleProps())} scope="col" className=" table-th ">
                            {column?.render("Header")}
                            <span>{column.isSorted ? (column.isSortedDesc ? " 🔽" : " 🔼") : ""}</span>
                          </th>
                        ))}
                      </tr>
                    ))} */}
                  </thead>

                  <tbody className="bg-white divide-y divide-slate-100 dark:bg-slate-800 dark:divide-slate-700"></tbody>
                </table>
              </div>
            </div>
          </div>
        </Card>
      </LoaderWrapperView>

      <Modal
        title=""
        label="Delete"
        labelClass="btn-outline-danger"
        centered
        activeModal={show}
        onClose={() => setShow(false)}
        scrollContent
        footerContent={
          <>
            <Button text="No" className="btn-outline-dark flex justify-center items-center h-[38px]" onClick={() => setShow(false)} />
            <Button text="Yes" className="btn-outline-dark flex justify-center items-center h-[38px]" onClick={() => deleteData(id)} />
          </>
        }
      >
        {/* <h4 className="font-medium text-lg mb-3 text-slate-900">Lorem ipsum dolor sit.</h4> */}
        <div className="text-base text-slate-600 dark:text-slate-300">Are you sure, do you want to {status == 1 ? "deactivate" : "activate"} ?</div>
      </Modal>
    </>
  );
};

export default ManageUser;
