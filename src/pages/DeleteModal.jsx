import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Api from "@/services/ApiServices";
import React, { useState } from "react";

const DeleteModal = ({ deleteshow, setDeleteShow, setDeleteId, deleteId, ApiName, getData, tableRe = "" }) => {
  const [loading, setLoading] = useState(false);

  const deleteAction = async (ida) => {
    try {
      setLoading(true);
      const res = await Api(`${ApiName}/${ida}`);
      setLoading(false);
      if (res.status === "RC200") {
        setDeleteShow(false);
        setDeleteId("");
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
        label="Delete"
        labelClass="btn-outline-danger"
        centered
        activeModal={deleteshow}
        onClose={() => setDeleteShow(false)}
        scrollContent
        footerContent={
          <>
            <Button text="No" className="btn-outline-dark flex items-center h-[38px]" onClick={() => setDeleteShow(false)} />
            <Button isLoading={loading} text="Yes" className="btn-outline-dark flex items-center h-[38px]" onClick={() => deleteAction(deleteId)} />
          </>
        }
      >
        <div className="text-base text-slate-600 dark:text-slate-300">Are you sure, do you want to delete?</div>
      </Modal>
    </div>
  );
};

export default DeleteModal;
