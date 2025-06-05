// export const BASE_URL = window.location.hostname == "crm.kentwater.ca" ? "https://api.kentwater.ca/" : "https://devcrmapi.kentwater.ca/";
export const BASE_URL = "https://crmapi.excelwater.ca/public/";
// export const BASE_URL = "http://192.168.29.191/Excelwater-CRM-API/public/";
export const API_URL = BASE_URL + "api/admin";

//login
export const API_LOGIN = "login";
export const API_LOGOUT = "logout";
export const API_GET_PWD_RESET_LINK = "forgot-password";
export const API_RESET_PASSWORD = "reset-password";
export const API_VERIFY_TOKEN = "verify-token";

export const API_GET_DATA = "get-data";

//account-details
export const API_GET_PROFILE = "get-profile";
export const API_UPDATE_PROFILE = "update-profile";
export const API_CHANGE_PASSWORD = "change-password";

export const API_FINANCIAL_ADVISORS_ADD = "financial-advisors/add";
export const API_FINANCIAL_ADVISORS_UPDAE = "financial-advisors/update";
export const API_FINANCIAL_ADVISORS_DETAIL = "financial-advisors";
export const API_FINANCIAL_ADVISORS_LIST = "financial-advisors/list";
export const API_FINANCIAL_ADVISORS_STATUS = "financial-advisors/status";
export const API_COUNTERY = "get-data";

export const API_USERS_ADD = "users/add";
export const API_USERS_UPDATE = "users/update";
export const API_USERS_DETAIL = "users";
export const API_USERS_LIST = "users/list";
export const API_USERS_STATUS = "users/status";
export const API_USERS_LIST_DATATABLE = "https://api.kentwater.ca/api/admin/users/list";

export const API_USERS_INVESTMENT_ADD = "users/investment/add";
export const API_USERS_INVESTMENT_UPDATE = "users/investment/update";
export const API_USERS_INVESTMENT_UPDATE_VALUES = "users/investment/update-values";
export const API_USERS_INVESTMENT_DELETE_VALUES = "users/investment/delete-values";
export const API_USERS_INVESTMENT_LIST = "users/investment/list";
export const API_USERS_INVESTMENT_HISTORY = "users/investment/history";
export const API_USERS_INVESTMENT_DELETE_INVESTMENT = "users/investment/delete-investment";
export const API_USERS_INVESTMENT_CHART = "users/investment/chart";

export const API_MANAGE_LEADS_LIST_DATATABEL = "https://api.kentwater.ca/api/admin/get-leads";
export const API_USERS_SEARCH_SALES_PERSON = "users/search-sales-person";
export const API_GET_ASSIGNED_LEADS = "get-assigned-leads";
export const API_TRANSFER_LEADS = "trasnsfer-leads";
export const API_ASSIGN_LEADS = "assign-lead";
export const API_MANAGE_LEADS_LIST = "get-leads";
export const API_MANAGE_LEADS_DETAILS = "lead-details";
export const API_MANAGE_LEADS_HISTORY = "lead-history";
export const API_ADD_LEAD = "add-lead";
export const API_UPDATE_LEADS = "update-lead";
export const API_LEAD_DETAILS = "lead-detail";
export const API_LEAD_DELETE = "lead-delete";

export const API_SALES_GET_LEADS_DATATABAL = "https://api.kentwater.ca/api/admin/sales/get-leads";
export const API_SALES_GET_LEADS = "sales/get-leads";
export const API_SALES_LEAD_STATUS_UPDATE = "sales/lead/status-update";
export const API_SALES_LEAD_DETAILS = "sales/lead/details";

export const API_SALES_LEAD_HISTORY = "sales/lead/history";
export const API_SALES_LEAD_UPDATE = "sales/lead/update";
export const API_SALES_GET_SALES_DASHBOARD = "sales/get-sales-dashboard";
export const API_REPORT_REVENUE = "report/revenue";
export const API_GET_STATIC_DATA = "get-static-data";

export const API_GET_DASHBOARD = "get-dashboard";

export const API_SALES_CHANNEL_ADD = "sales/channel/add";
export const API_SALES_CHANNEL_UPDATE = "sales/channel/update";
export const API_SALES_CHANNEL_DETAILS = "sales/channel/details";
export const API_SALES_CHANNEL_LIST = "sales/channel/list";
export const API_SALES_CHANNEL_DELETE = "sales/channel/delete";

export const API_SALES_SEND_ESTIMATES = "sales/send-estimates";
export const API_GET_ALL_PRODUCTS = "get-all-products";

export const API_SALES_INSTALLATION_COMPLETED = "sales/installation/completed";
export const API_SALES_WATER_TEST_COMPLETED = "sales/water-test/completed";

export const API_GET_PENDING_INSTALLATIONS = "get-pending-installations";
export const API_GET_PENDING_WATER_TEST = "get-pending-water-test";

export const API_LEADS_MESSAGE = "leads-message";
export const API_GET_ALL_SALES_CHANNELS = "get-all-sales-channels";

export const API_GET_LEAD_STATISTICS = "get-lead-statistics";
export const API_UPDATE_ADS_SPENDS = "update-ads-spends";

export const API_LEAD_LAST_COMMENT = "lead-last-comment";

export const API_LEADS_EXPORT_EXCEL = "export-leads";

export const API_DUPLICATE_LEADS_COMBINED = "duplicate-leads-combined";
export const API_GET_DUPLICATE_LEADS = "get-duplicate-leads";
export const API_GET_ASSIGNED_LEADS_MULTIPLE = "get-assigned-leads-multiple";

// new variables --------------
export const API_GET_ALL_SPARE_PARTS_DATA = "get_all_spare_part";
export const API_GET_ALL_SUPPLIER_DATA = "get_all_supplier";
export const API_GET_ALL_PRODUCT_DATA = "get_all_ptoduct";

// supplier 
export const API_SUPPLIER_ADD = "add_supplier";
export const API_MANAGE_SUPPLIER_LIST = "suppliers";
export const API_EDIT_SUPPLIER = "edit_supplier";
export const API_DELETE_SUPPLIER = "delete_supplier";

//spareparts
export const API_SPAREPARTS_ADD = "add_spare_part";
export const API_MANAGE_SPAREPARTS_LIST = "spare_parts";
export const API_EDIT_SPAREPARTS = "edit_spare_part";
export const API_DELETE_SPAREPARTS = "delete_spare_part";

//producstmaster
export const API_PRODUCT_ADD = "add_product_master";
export const API_MANAGE_PRODUCT_LIST = "product_master";
export const API_EDIT_PRODUCT = "edit_product_master";
export const API_DELETE_PRODUCT = "delete_product_master";

//order 
export const API_ORDER_ADD = "add_order";
export const API_MANAGE_ORDER_LIST = "orders";
export const API_EDIT_ORDER = "edit_order";
export const API_DELETE_ORDER = "delete_order";
export const API_EDIT_ORDER_DETAILS = "edit_order_details";
export const API_GET_SUPPLIERWISE_SPAREPARTS = "get_supplier_wise_sparepart";

// invoice
export const API_INVOCIE_ADD = "add_invoice";
export const API_INVOCIE_MANAGE_LIST = "invoices";
export const API_DELETE_INVOICE = "delete_invoice";
export const API_INVOICE_EDIT = "edit_invoice";
export const API_INVOICE_DATA_BT_ID = "get_invoice";


// customer 
export const API_CUSTOMER_ADD = "add_user";
export const API_CUSTOMER_MANAGE_LIST = "get_users";
export const API_DELETE_CUSTOMER = "delete_user";
export const API_CUSTOMER_EDIT = "edit_user";

// dashboadr count 
export const API_DASHBOARD_COUNT = "dashboard_all_count";

// alert material report
export const API_ALERT_MATERIAL_REPORT = "get_materia_report";





