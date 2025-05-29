import React from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";

const SelectCom = ({ control, name, label, option, searchable = true, placeholder, error, isMulti = false, defaultValue }) => {
  return (
    <>
      {isMulti ? (
        <div>
          <label htmlFor=" hh" className="form-label ">
            {label}
          </label>
          <Controller name={name} control={control} defaultValue={[]} render={({ field }) => <Select {...field} isMulti options={option} isSearchable={searchable} placeholder={placeholder} className={`react-select ${error?.message ? "has-error" : ""}`} classNamePrefix="select" id="hh" />} />
          {error?.message && <p className="text-danger-500 block text-sm mt-2">{error?.message}</p>}
        </div>
      ) : (
        <div>
          <label htmlFor="hh" className="form-label ">
            {label}
          </label>
          <Controller name={name} control={control} render={({ field }) => <Select {...field} options={option} onMenuOpen={true} defaultValue={defaultValue} isSearchable={searchable} placeholder={placeholder} className={`react-select ${error?.value?.message ? "has-error" : ""}`} classNamePrefix="select" id="hh" />} />
          {error?.value?.message && <p className="text-danger-500 block text-sm mt-2">{error?.value?.message}</p>}
        </div>
      )}
    </>
  );
};

export default SelectCom;
