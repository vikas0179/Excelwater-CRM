import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "@/services/ApiServices";
import { API_USERS_LIST, API_USERS_STATUS } from "@/services/ApiEndPoint";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import LoaderWrapperView from "@/components/LoaderWrapperView";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { Icon } from "@iconify/react";
import UserTable from "../userTable";
import Badge from "@/components/ui/Badge";
import Tooltip from "@/components/ui/Tooltip";
import Textinput from "@/components/ui/Textinput";
import { useAsyncDebounce } from "react-table";

const User = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [dsearch, setDSearch] = useState("");
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);

  const [deleteId, setDeleteId] = useState("");
  const [show, setShow] = useState(false);
  const [status, setstatus] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDSearch(search);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const getData = async () => {
    try {
      setLoading(true);
      const response = await Api(`${API_USERS_LIST}?page=${pageIndex}&search=${dsearch}`);
      setLoading(false);

      setData(response.data);
      setAllData(response);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  //   const debouncedFetchData = useAsyncDebounce(getData);

  //   useEffect(() => {
  //     setLoading(true);
  //     debouncedFetchData()
  //       .then((res) => {
  //         setLoading(false);
  //         setData(res.data);
  //         setAllData(res);
  //       })
  //       .catch((error) => {
  //         console.error("Error fetching data:", error);
  //       });
  //   }, [search, pageIndex]);

  useEffect(() => {
    getData();
  }, [dsearch, pageIndex]);

  const COLUMNS = [
    {
      Header: "Date",
      accessor: "date",
      width: "15%",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="text-sm text-slate-600 dark:text-slate-300 ">
                {row?.cell?.value} <br />
                {row?.cell?.row?.original?.status === 1 ? <Badge label="Active" className="bg-success-500 text-white" /> : <Badge label="Deactive" className="bg-warning-500 text-white" />}
              </span>
            </span>
          </div>
        );
      }
    },
    {
      Header: "Name",
      accessor: "name",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="text-sm text-slate-600 dark:text-slate-300 ">{row?.cell?.value}</span>
            </span>
          </div>
        );
      }
    },
    {
      Header: "Email",
      accessor: "email",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="text-sm text-slate-600 dark:text-slate-300 ">{row?.cell?.value}</span>
            </span>
          </div>
        );
      }
    },
    {
      Header: "Role",
      accessor: "role",
      Cell: (row) => {
        return (
          <div>
            <span className="inline-flex items-center">
              <span className="text-sm text-slate-600 dark:text-slate-300 ">{row?.cell?.value == 1 ? "Sub Admin" : "Sales"}</span>
            </span>
          </div>
        );
      }
    },

    {
      Header: <div className="text-end">Action</div>,
      accessor: "id",
      width: "12%",
      Cell: (row) => {
        return (
          <div className="flex space-x-3 rtl:space-x-reverse justify-end">
            <Tooltip content="Edit" placement="top" arrow animation="shift-away">
              <button className="action-btn" type="button" onClick={() => navigate(`/manage-users/edit/${row?.cell?.value}`)}>
                <Icon icon="heroicons:pencil-square" />
              </button>
            </Tooltip>
            <Tooltip content={row?.cell?.row?.original?.status == 1 ? "Deactivate" : "Activate"} placement="top" arrow animation="shift-away" theme={row?.cell?.row?.original?.status == 1 ? "warning" : "success"}>
              <button
                className="action-btn"
                type="button"
                onClick={() => {
                  setShow(true);
                  setDeleteId(row?.cell?.value);
                  setstatus(row?.cell?.row?.original?.status);
                }}
              >
                <Icon icon={row?.cell?.row?.original?.status == 1 ? "gridicons:cross" : "heroicons:check"} />
              </button>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  const deleteData = async (ida) => {
    Api(`${API_USERS_STATUS}/${ida}`)
      .then((res) => {
        if (res.status === "RC200") {
          setShow(false);
          getData();
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
              <div className="flex items-center">
                <Textinput
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  placeholder="search"
                />
              </div>
              <button
                className="btn btn-outline-dark btn-sm text-center ml-4 flex items-center h-[38px]"
                onClick={() => {
                  navigate("/manage-users/add");
                }}
              >
                <Icon icon="heroicons-outline:plus" />
                <span className="ml-1">Add User</span>
              </button>
            </div>
          </div>
          <LoaderWrapperView isLoading={loading}>
            <UserTable columns={COLUMNS} data={data} allData={allData} setPageIndex={setPageIndex} pageIndex={pageIndex} Sname="Users" />
          </LoaderWrapperView>
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
            <Button text="Yes" className="btn-outline-dark flex justify-center items-center h-[38px]" onClick={() => deleteData(deleteId)} />
          </>
        }
      >
        {/* <h4 className="font-medium text-lg mb-3 text-slate-900">Lorem ipsum dolor sit.</h4> */}
        <div className="text-base text-slate-600 dark:text-slate-300">Are you sure, do you want to {status == 1 ? "deactivate" : "activate"} ?</div>
      </Modal>
    </>
  );
};

export default User;
