import { Transition } from "@headlessui/react";
import clsx from "clsx";
import { Fragment,useRef, } from "react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "sonner";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import TaskDetails from "./pages/TaskDetails";
import Tasks from "./pages/Tasks";
import Trash from "./pages/Trash";
import Users from "./pages/Users";
import Departments from "./pages/Department";
import Dashboard from "./pages/dashboard";
import { setOpenSidebar } from "./redux/slices/authSlice";
import Employees from "./pages/Employee";
import Accounts from "./pages/Account";
import RolePermission from "./pages/Permission";
import TaskAssignment from "./pages/TaskAssignment";
import DepartmentAssignment from "./pages/DepartmentAssignment";
import ChatBox from "./components/task/Milestones";
import Tasktransfer from "./pages/TaskTransfer";
import GanttApp from "./components/task/Gant";
import FileView from "./components/taskassigment/FileView";
import Home from "./pages/HomePage";
function Layout() {
  const dispatch=useDispatch();
  const location = useLocation();
  const authUser = useSelector((state) => state.authen);
  const acc_link = JSON.parse(localStorage.getItem('acc_url')) || [];
  console.log(acc_link)
  if(authUser.user===null || localStorage.getItem("authUser")===null || localStorage.getItem("authUser")===undefined){
    return <Navigate to="/log-in" replace />;
  }
  if(acc_link.includes(location.pathname)){
    console.log("err")
    return <Navigate to="/home" replace />;
  }
  const token=authUser.user.token;
  var payload = JSON.parse(atob(token.split('.')[1]));
  console.log(payload)
  localStorage.setItem("userId",payload.MaTaiKhoan)
  localStorage.setItem("permissionId",Number(payload.MaNhomQuyen))
  console.log(authUser)
  return (
    <div className='w-full h-screen flex flex-col md:flex-row'>
      <div className='w-1/5 h-screen bg-white sticky top-0 hidden md:block'>
        <Sidebar />
      </div>

      <MobileSidebar />

      <div className='flex-1 overflow-y-auto'>
        <Navbar />

        <div className='p-4 2xl:px-10'>
          <Outlet />
        </div>
      </div>
    </div>
  ) 
  // : (
  //   <Navigate to='/log-in' state={{ from: location }} replace />
  // );
}

const MobileSidebar = () => {
  const { isSidebarOpen } = useSelector((state) => state.authen);
  const mobileMenuRef = useRef(null);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };
  if(localStorage.getItem(""))
  return (
    <>
      <Transition
        show={isSidebarOpen}
        as={Fragment}
        enter='transition-opacity duration-700'
        enterFrom='opacity-x-10'
        enterTo='opacity-x-100'
        leave='transition-opacity duration-700'
        leaveFrom='opacity-x-100'
        leaveTo='opacity-x-0'
      >
        {(ref) => (
          <div
            ref={(node) => (mobileMenuRef.current = node)}
            className={clsx(
              "md:hidden w-full h-full bg-black/40 transition-all duration-700 transform ",
              isSidebarOpen ? "translate-x-0" : "translate-x-full"
            )}
            onClick={() => closeSidebar()}
          >
            <div className='bg-white w-3/4 h-full'>
              <div className='w-full flex justify-end px-5 mt-5'>
                <button
                  onClick={() => closeSidebar()}
                  className='flex justify-end items-end'
                >
                  <IoClose size={25} />
                </button>
              </div>

              <div className='-mt-10'>
                <Sidebar />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </>
  );
};

function App() {
  return (
    <main className='w-full min-h-screen bg-[#f3f4f6] position-fixed'>
      <Routes>
        <Route element={<Layout />}>
          <Route index path='/' element={<Navigate to='/home' />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/project/:id' element={<Tasks />} />
          <Route path='/in-progress/:status' element={<Tasks />} />
          <Route path='/todo/:status' element={<Tasks />} />
          <Route path='/team' element={<Users />} />
          <Route path='/department' element={<Departments/>} />
          <Route path='/employee' element={<Employees/>} />
          <Route path='/account' element={<Accounts/>} />
          <Route path='/permission' element={<RolePermission/>} />
          <Route path='/trashed' element={<Trash />} />
          <Route path='/taskassignment' element={<TaskAssignment/>} />
          <Route path='/assignmentdepartment' element={<DepartmentAssignment/>} />
          <Route path='/task/:id' element={<TaskDetails />} />
          <Route path='/milestones' element={<ChatBox />} /> 
          <Route path='/tasktransfer' element={<Tasktransfer/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path="/gant" element={<GanttApp/>}/>
          <Route path="/taskassignment/fileView/:id" element={<FileView/>}/>
          <Route path="*" element={<Navigate to="/home" />} />
        </Route>
        <Route path='/log-in' element={<Login />} />
      </Routes>

      <Toaster richColors />
    </main>
  );
}

export default App;
