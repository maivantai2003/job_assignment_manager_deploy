import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPermissionById, fetchPermissions, updatePermission } from "../../redux/permission/permissionSlice";
import { fetchFunctions } from "../../redux/function/functionSlice";
import { addPermissionDetail, deletePermissionDetail, fetchPermissionDetails, updatePermissionDetail } from "../../redux/permissiondetail/permissionDetailSlice";

const UserPermissions = ({ role, onClose }) => {
  const maQuyen = role.maQuyen;
  const [permissions, setPermissions] = useState([]);
  const dispatch = useDispatch();

  const functions = useSelector((state) => state.functions.list);
  const permissionsByRole = useSelector((state) =>
    state.permissions.list.find((nhomquyen) => nhomquyen.maQuyen === maQuyen)
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchFunctions({ search: "", page: 10 }))
        await dispatch(fetchPermissionById(maQuyen))
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, [dispatch, maQuyen]);
  useEffect(() => {
    const fetchPermissions = async () => {
      if (!permissionsByRole || !permissionsByRole.chiTietQuyens) return;
  
      //console.log("Fetched permissionsByRole:", permissionsByRole);
      //console.log(permissionsByRole.chiTietQuyens)
      const updatedPermissions = functions.map((func) => {
        const actions = ["Xem", "Thêm", "Sửa", "Xóa"].map((action, index) => {
          const chiTietQuyen = permissionsByRole.chiTietQuyens.find(
            (perm) =>
              perm.maChucNang === func.maChucNang 
              && perm.hanhDong === action
              && perm.maNhomQuyen === maQuyen
          );
          //console.log(chiTietQuyen)
          const allowed = !!chiTietQuyen;
          //console.log(allowed)
          return {
            id: index + 1,
            action,
            allowed,
            maChiTietQuyen: chiTietQuyen ? chiTietQuyen.maChiTietQuyen : null,
          };
        });
        return {
          function: func.tenChucNang,
          functionId: func.maChucNang,
          actions,
        };
      });
  
      setPermissions(updatedPermissions);
    };
  
    fetchPermissions();
  }, [functions, permissionsByRole]);

  const handleCheckboxChange =async (permissionId) => {
    const permission = permissions.find(
      (perm) => perm.function === permissionId
    );
    const maChucNang = permission.functionId;
    const maQuyen = role.maQuyen;
    const isChecked = permission.actions.every((action) => action.allowed);
    const status=!isChecked
    setPermissions((prevPermissions) =>
      prevPermissions.map((perm) =>
        perm.function === permissionId
          ? {
              ...perm,
              actions: perm.actions.map((action) => ({
                ...action,
                allowed: !isChecked,
              })),
            }
          : perm
      )
    );
    for (const action of permission.actions) {
      let chiTietQuyen = {
        maChiTietQuyen: action.maChiTietQuyen,
        maQuyen: maQuyen,
        maChucNang: maChucNang,
        hanhDong: action.action,
        status: status,
      };
      if ((await save(chiTietQuyen))===false) {
        console.log("Error saving permission detail for action:", action.action);
      }
    }
  };
  async function save(chiTietQuyen){
    try{
      let model={
        maNhomQuyen:chiTietQuyen.maQuyen,
        maChucNang:chiTietQuyen.maChucNang,
        hanhDong:chiTietQuyen.hanhDong,
      }
      console.log(chiTietQuyen.maChiTietQuyen)
      if(chiTietQuyen.maChiTietQuyen===null){
        console.log(chiTietQuyen)
        console.log(model)
        const result=await dispatch(addPermissionDetail(model)).unwrap()
        chiTietQuyen.maChiTietQuyen = result.maChiTietQuyen;
        console.log(result)
        setPermissions((prevPermissions) =>
          prevPermissions.map((perm) =>
            perm.functionId === chiTietQuyen.maChucNang
              ? {
                  ...perm,
                  actions: perm.actions.map((action) =>
                    action.action === chiTietQuyen.hanhDong
                      ? { ...action, maChiTietQuyen: result.maChiTietQuyen, allowed: true }
                      : action
                  ),
                }
              : perm
          )
        );
      }else{
        console.log(model)
        const result=await dispatch(deletePermissionDetail(chiTietQuyen.maChiTietQuyen))
        setPermissions((prevPermissions) =>
          prevPermissions.map((perm) =>
              perm.functionId === chiTietQuyen.maChucNang
                  ? {
                        ...perm,
                        actions: perm.actions.map((action) =>
                            action.action === chiTietQuyen.hanhDong
                                ? { ...action, maChiTietQuyen: null, allowed: false }
                                : action
                        ),
                    }
                  : perm
          )
      );
      console.log(result)
      }
      await dispatch(fetchPermissionById(maQuyen))
      //console.log(permissionsByRole)
      return true
    }catch(e){
      console.log(e)
      return false;
    }
  }
  const handleActionChange =async (permissionId, actionId) => {
    const permission = permissions.find(
      (perm) => perm.function === permissionId
    );
    const action = permission.actions.find((action) => action.id === actionId);
    const maChucNang = permission.functionId;
    const actionName = action.action;
    const maChiTietQuyen = action.maChiTietQuyen;
    const maQuyen = role.maQuyen;
    const status=!action.allowed;
    let chiTietQuyen={
      maChiTietQuyen:maChiTietQuyen,
      maQuyen:maQuyen,
      maChucNang:maChucNang,
      hanhDong:actionName,
      status:status
    }
    //
    setPermissions((prevPermissions) =>
      prevPermissions.map((perm) =>
        perm.function === permissionId
          ? {
              ...perm,
              actions: perm.actions.map((action) =>
                action.id === actionId
                  ? { ...action, allowed: !action.allowed }
                  : action
              ),
            }
          : perm
      )
    );
    try{
      if ((await save(chiTietQuyen))===false) {
        console.log("Error saving permission detail for action:", actionName);
      }
      //await dispatch(fetchPermissionById(maQuyen));
    }catch(e){
      console.log(e)
    }
  };
  return (
    <div>
      <h2 className="text-xl mb-4">Quyền cho {role.tenQuyen}</h2>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Chức năng</th>
            <th className="py-2 px-4 border">Xem</th>
            <th className="py-2 px-4 border">Thêm</th>
            <th className="py-2 px-4 border">Sửa</th>
            <th className="py-2 px-4 border">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {permissions.map((permission) => (
            <React.Fragment key={permission.function}>
              <tr>
                <td className="py-2 px-4 border">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={permission.actions.every(
                        (action) => action.allowed
                      )}
                      onChange={() => handleCheckboxChange(permission.function)}
                    />
                    <span className="ml-2">{permission.function}</span>
                  </label>
                </td>
                {permission.actions.map((action) => (
                  <td key={action.id} className="py-2 px-4 border">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={action.allowed}
                        onChange={() =>
                          handleActionChange(permission.function, action.id)
                        }
                      />
                      <span className="ml-2">
                        {action.allowed ? "Có" : "Không"}
                      </span>
                    </label>
                  </td>
                ))}
              </tr>
            </React.Fragment>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        {/* <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSave}
        >
          Lưu
        </button> */}
        <button
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded ml-2"
          onClick={onClose}
        >
          Đóng
        </button>
      </div>
    </div>
  );
};
 
export default UserPermissions; 