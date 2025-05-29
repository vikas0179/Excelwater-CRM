import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Api from "@/services/ApiServices";
import React, { useState } from "react";

const StatusModal = ({ statusShow, setStatusShow, setStatusId, activeDective, statusId, ApiName, getData, tableRe = "" }) => {
  const [loading, setLoading] = useState(false);

  const statusAction = async (ida) => {
    try {
      setLoading(true);
      const res = await Api(`${ApiName}/${ida}`);
      setLoading(false);
      if (res.status === "RC200") {
        setStatusShow(false);
        setStatusId("");
        {
          getData && getData();
        }
        {
          tableRe && tableRe?.ajax?.reload();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Modal
        title=""
        label="Status Update"
        labelClass="btn-outline-danger"
        centered
        activeModal={statusShow}
        onClose={() => setStatusShow(false)}
        scrollContent
        footerContent={
          <>
            <Button text="No" className="btn-outline-dark flex items-center h-[38px]" onClick={() => setStatusShow(false)} />
            <Button text="Yes" isLoading={loading} className="btn-outline-dark flex items-center h-[38px]" onClick={() => statusAction(statusId)} />
          </>
        }
      >
        <div className="text-base text-slate-600 dark:text-slate-300">Are you sure, do you want to {activeDective == 1 ? "deactivate" : "activate"}?</div>
      </Modal>
    </div>
  );
};

export default StatusModal;
