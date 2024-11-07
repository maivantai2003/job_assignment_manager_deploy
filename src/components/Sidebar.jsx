import React, { useEffect, useRef, useState } from "react";
import { MdDashboard, MdOutlineAddTask } from "react-icons/md";
import {
  FaTasks,
  FaUsers,
  FaPlus,
  FaUser,
  FaExchangeAlt,
  FaHome,
} from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { setOpenSidebar } from "../redux/slices/authSlice";
import clsx from "clsx";
import { addProject, fetchProjects } from "../redux/project/projectSlice";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { FaUserGroup } from "react-icons/fa6";
import { GoProject } from "react-icons/go";
import { checkPermission } from "../redux/permissiondetail/permissionDetailSlice";
import API_ENDPOINTS from "../constant/linkapi";
const Sidebar = () => {
  const dispatch = useDispatch();
  const [connection, setConnection] = useState(null);
  const [loadingProjects, setLoadingProjects] = useState(true);

  const [permissionAction, setpermissionAction] = useState([]);
  const [viewFuntions, setViewFunction] = useState([]);
  const navigate = useNavigate();
  //const { user } = useSelector((state) => state.authen);
  const duans = useSelector((state) => state.projects.list);
  const maquyen = Number(localStorage.getItem("permissionId"));
  const taskSubMenu = duans.map((duan) => ({
    label: duan.tenDuAn,
    link: `/project/${duan.maDuAn}`,
    color: "bg-blue-500",
    key: duan.maDuAn,
  }));
  const linkData = [
    {
      label: "Tổng Quan",
      link: "/dashboard",
      icon: <MdDashboard />,
    },
    {
      label: "Dự Án",
      icon: <GoProject />,
      subMenu: taskSubMenu,
    },
    {
      label: "Phân Quyền",
      link: "/permission",
      icon: <FaTasks />,
    },
    {
      label: "Công Việc",
      link: "/taskassignment",
      icon: <FaTasks />,
    },
    {
      label: "Công Việc Phòng Ban",
      link: "/assignmentdepartment",
      icon: <FaUserGroup />,
    },
    {
      label: "Chuyển Giao Công Việc",
      link: "/tasktransfer",
      icon: <FaExchangeAlt />,
    },
    {
      label: "Phòng Ban",
      link: "/department",
      icon: <FaUsers />,
    },
    {
      label: "Nhân Viên",
      link: "/employee",
      icon: <FaUser />,
    },
    {
      label: "Tài Khoản",
      link: "/account",
      icon: <FaUsers />,
    },
  ];
  useEffect(() => {
    const fetchData = async () => {
      setLoadingProjects(true);
      await dispatch(fetchProjects({ search: "", page: 20 }));
      const result = await dispatch(
        checkPermission({ maQuyen: maquyen, tenChucNang: "Dự Án" })
      ).unwrap();
      setpermissionAction(result);
      const visibleLinks = [];
      const acc_link = [];
      for (const link of linkData) {
        const result = await dispatch(
          checkPermission({ maQuyen: maquyen, tenChucNang: link.label })
        ).unwrap();
        if (result.includes("Xem")) {
          visibleLinks.push(link);
        } else {
          if (link.link === undefined) {
            acc_link.push("/project");
          } else {
            acc_link.push(link.link);
          }
        }
      }
      setViewFunction(visibleLinks);
      localStorage.setItem("acc_url", JSON.stringify(acc_link));
      console.log(localStorage.getItem("acc_url"));
      console.log(acc_link);
      setLoadingProjects(false);
    };
    fetchData();
  }, [dispatch, maquyen]);
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(API_ENDPOINTS.HUB_URL)
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

    setConnection(newConnection);
  }, []);
  useEffect(() => {
    const startConnection = async () => {
      if (connection && connection.state === "Disconnected") {
        try {
          await connection.start();
          console.log("Connected!");

          connection.on("loadDuAn", async () => {
            await dispatch(fetchProjects({ search: "", page: 20 }));
          });

          connection.on("loadHanhDong", async () => {
            const result = await dispatch(
              checkPermission({ maQuyen: maquyen, tenChucNang: "Dự Án" })
            ).unwrap();
            setpermissionAction(result);
            const visibleLinks = [];
            const acc_link = [];
            for (const link of linkData) {
              const result = await dispatch(
                checkPermission({ maQuyen: maquyen, tenChucNang: link.label })
              ).unwrap();
              if (result.includes("Xem")) {
                visibleLinks.push(link);
              } else {
                if (link.link === undefined) {
                  acc_link.push("/project");
                } else {
                  acc_link.push(link.link);
                }
              }
            }
            console.log(visibleLinks);
            setViewFunction(visibleLinks);
            localStorage.setItem("acc_url", JSON.stringify(acc_link));
            console.log(localStorage.getItem("acc_url"));
            console.log(acc_link);
          });
        } catch (error) {
          console.error("Connection failed: ", error);
        }
      }
    };
    startConnection();
    return () => {
      if (connection) {
        connection.off("loadDuAn");
        connection.off("loadHanhDong");
      }
    };
  }, [connection, dispatch]);
  const location = useLocation();
  const currentPath = location.pathname;
  const sidebarLinks = linkData.filter((link) =>
    viewFuntions.some((view) => view.label === link.label)
  );
  const closeSidebar = () => {
    dispatch(setOpenSidebar(false));
  };
  const [expandedSubMenu, setExpandedSubMenu] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    if (isModalOpen) {
      const input = document.querySelector("input");
      input?.focus();
    }
  }, [isModalOpen]);
  if (loadingProjects) {
    return (
      <div className="flex justify-center items-center h-24">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  const handleProjectSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra độ dài chuỗi
    if (projectName.length < 1) {
      setError("Tên dự án phải có ít nhất 1 ký tự!");
      return;
    }

    if (projectName.length === 0) {
      setError("Tên dự án không được để trống!");
      return;
    }
    setError("");
    try {
      await dispatch(
        addProject({
          tenDuAn: projectName,
        })
      );
      console.log("Dự án được tạo:", projectName);
      setProjectName("");
      setModalOpen(false);
    } catch (e) {
      console.log(e);
    }
  };
  const NavLink = ({ el }) => {
    const hasSubMenu = !!el.subMenu;
    return (
      <>
        <Link
          to={el.link}
          onClick={() => {
            closeSidebar();
            if (hasSubMenu) {
              setExpandedSubMenu(
                el.label === expandedSubMenu ? null : el.label
              );
            } else {
              setExpandedSubMenu(null);
            }
          }}
          className={clsx(
            "w-full flex gap-3 px-4 py-3 rounded-lg items-center text-gray-800 text-base cursor-pointer transition-all duration-200",
            currentPath.startsWith(el.link)
              ? "bg-blue-600 text-white"
              : "hover:bg-gray-100"
          )}
        >
          {el.icon}
          <span className="font-medium">{el.label}</span>
          {hasSubMenu && (
            <span
              className={clsx("ml-auto transition-transform duration-200", {
                "rotate-180": expandedSubMenu === el.label,
              })}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (expandedSubMenu === el.label) {
                  setExpandedSubMenu(null);
                } else {
                  setExpandedSubMenu(el.label);
                  setModalOpen(true);
                }
              }}
            >
              {permissionAction.includes("Thêm") && <FaPlus />}
            </span>
          )}
        </Link>
        {hasSubMenu && expandedSubMenu === el.label && (
          <div className="ml-8 flex flex-col space-y-2 mt-2">
            {el.subMenu.map((subEl) => (
              <Link
                key={subEl.label}
                to={subEl.link}
                onClick={closeSidebar}
                className={clsx(
                  "flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                  currentPath === subEl.link ? "bg-blue-600 text-white" : ""
                )}
              >
                <span className={`w-2 h-2 ${subEl.color} rounded-full`} />
                <span className="font-medium">{subEl.label}</span>
              </Link>
            ))}
          </div>
        )}
      </>
    );
  };

  const Modal = ({ isOpen, onClose }) => {
    const inputRef = useRef(null);

    useEffect(() => {
      if (isOpen && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isOpen]);
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
          <h2 className="text-lg font-bold mb-4">Nhập Tên Dự Án</h2>
          <form onSubmit={handleProjectSubmit}>
            <input
              type="text"
              ref={inputRef}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Tên dự án"
              value={projectName}
              className={clsx(
                "w-full p-2 border rounded mb-4 ",
                error ? "border-red-500" : "border-gray-300"
              )}
              required
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setProjectName("");
                  setError("");
                  onClose();
                }}
                className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Lưu
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col gap-6 p-5 bg-white shadow-lg rounded-xl">
      <h1 className="flex gap-2 items-center">
        <p className="bg-blue-600 p-3 rounded-full">
          <MdOutlineAddTask className="text-white text-2xl" />
        </p>
        <span className="text-2xl font-bold text-gray-900">
          Quản lý công việc
        </span>
      </h1>
      <div className="pt-4">
        <button
          className="w-full flex gap-2 p-3 items-center text-lg text-gray-800 hover:bg-gray-100 rounded-lg transition"
          onClick={() => navigate("/home")}
        >
          <FaHome />
          <span>Home</span>
        </button>
      </div>
      <div className="flex-1 flex flex-col gap-y-5 overflow-y-auto">
        {sidebarLinks.map((link) => (
          <NavLink el={link} key={link.label} />
        ))}
      </div>

      {/* <div className="pt-4">
        <button
          className="w-full flex gap-2 p-3 items-center text-lg text-gray-800 hover:bg-gray-100 rounded-lg transition"
          onClick={() => setModalOpen(true)}
        >
          <MdSettings />
          <span>Chỉnh Sửa</span>
        </button>
      </div> */}

      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default Sidebar;
