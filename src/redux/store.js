import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import { apiSlice } from "./slices/apiSlice";
import departmetReducer from "./departments/departmentSlice";
import employeeReducer from "./employees/employeeSlice"
import accountReducer from "./accounts/accountSlice"
import functionReducer from "./function/functionSlice"
import permissionReducer from "./permission/permissionSlice"
import authenReducer from "./authen/authenSlice"
import projectReducer from "./project/projectSlice"
import sectionReducer from "./section/sectionSlice"
import taskReduder from "./task/taskSlice"
import sendGmailReducer from "./sendgmail/sendgmailSlice"
import assignmentReducer from "./assignment/assignmentSlice"
import workdepartmentReducer from "./workdepartment/workdepartmentSlice"
import taskhistoryReducer from "./taskhistory/taskhistorySlice"
import fileReducer from "./file/fileSlice"
import fileassignmentReducer from "./fileassignment/fileassignmentSlice"
import reminderReducer from "./reminder/reminderSlice"
import taskTransferReducer from "./tasktransfer/tasktranferSlice"
import schedulingReducer from  "./scheduling/schedulingSlice"
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    //auth: authReducer,
    assignments:assignmentReducer,
    departments:departmetReducer,
    employees:employeeReducer,
    accounts:accountReducer,
    functions:functionReducer,
    permissions:permissionReducer,
    projects:projectReducer,
    authen:authenReducer,
    sections:sectionReducer,
    tasks:taskReduder,
    sendGmail:sendGmailReducer,
    workdepartments:workdepartmentReducer,
    taskhistories:taskhistoryReducer,
    file:fileReducer,
    fileassignment:fileassignmentReducer,
    reminders:reminderReducer,
    tasktransfer:taskTransferReducer,
    scheduling:schedulingReducer
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
