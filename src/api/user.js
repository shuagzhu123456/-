import request from "@/utils/request";

// 获取用户列表：查询类接口统一使用 getXxxApi 命名
export const getUserListApi = async (params) => {
	return request.get("/users", params);
};

// 创建用户：新增类接口统一使用 createXxxApi 命名
export const createUserApi = async (data) => {
	return request.post("/users", data);
};

// 更新用户：修改类接口统一使用 updateXxxApi 命名
export const updateUserApi = async (userId, data) => {
	return request.put(`/users/${userId}`, data);
};

// 删除用户：删除类接口统一使用 deleteXxxApi 命名
export const deleteUserApi = async (userId) => {
	return request.delete(`/users/${userId}`);
};
