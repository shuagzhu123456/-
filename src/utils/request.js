import axios from "axios";
import { getToken, removeToken } from "@/utils/auth";
import message from "@/utils/message";

const SUCCESS_CODES = new Set([0, 200, "0", "200"]);
const DEFAULT_TIMEOUT = 15000;

const service = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL || "",
	timeout: Number(import.meta.env.VITE_API_TIMEOUT || DEFAULT_TIMEOUT),
	headers: {
		"Content-Type": "application/json;charset=UTF-8",
	},
});

const getErrorMessage = (error) => {
	if (error.code === "ECONNABORTED" || `${error.message}`.includes("timeout")) {
		return "请求超时，请稍后重试";
	}

	if (error.response?.status === 401) {
		return "登录状态已失效，请重新登录";
	}

	if (error.response?.status === 403) {
		return "暂无权限访问该接口";
	}

	if (error.response?.status === 404) {
		return "请求地址不存在";
	}

	if (error.response?.status >= 500) {
		return "服务异常，请稍后重试";
	}

	return error.response?.data?.message || error.response?.data?.msg || error.message || "请求失败";
};

// 请求拦截器：统一注入 token 和常用头
service.interceptors.request.use(
	(config) => {
		const requestConfig = { ...config };
		const token = getToken();

		if (token) {
			requestConfig.headers.Authorization = `Bearer ${token}`;
		}

		return requestConfig;
	},
	(error) => Promise.reject(error),
);

// 响应拦截器：统一处理业务状态码和网络异常
service.interceptors.response.use(
	(response) => {
		const { data } = response;

		// 文件流、二进制流直接返回
		if (response.config.responseType === "blob" || response.config.responseType === "arraybuffer") {
			return data;
		}

		// 接口未约定 code 时，直接返回数据本体，兼容现有后端
		if (typeof data !== "object" || data === null || !("code" in data)) {
			return data;
		}

		if (SUCCESS_CODES.has(data.code)) {
			return data.data ?? data;
		}

		if (Number(data.code) === 401) {
			removeToken();
		}

		const errorMessage = data.message || data.msg || "请求失败";
		message.error(errorMessage);
		return Promise.reject(new Error(errorMessage));
	},
	(error) => {
		const errorMessage = getErrorMessage(error);

		if (error.response?.status === 401) {
			removeToken();
		}

		message.error(errorMessage);
		return Promise.reject(error);
	},
);

// 统一请求入口：页面和业务模块都从这里走，禁止直接用 axios
const request = async (config) => {
	const response = await service(config);
	return response;
};

request.get = async (url, params = {}, config = {}) => {
	return request({
		url,
		method: "get",
		params,
		...config,
	});
};

request.post = async (url, data = {}, config = {}) => {
	return request({
		url,
		method: "post",
		data,
		...config,
	});
};

request.put = async (url, data = {}, config = {}) => {
	return request({
		url,
		method: "put",
		data,
		...config,
	});
};

request.delete = async (url, params = {}, config = {}) => {
	return request({
		url,
		method: "delete",
		params,
		...config,
	});
};

export { service };
export default request;
