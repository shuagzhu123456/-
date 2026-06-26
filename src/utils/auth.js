const TOKEN_KEY = "ACCESS_TOKEN";

// 统一管理 token，后续切换到 pinia 或 cookie 时只需要改这里
export const getToken = () => {
	return window.localStorage.getItem(TOKEN_KEY) || "";
};

export const setToken = (token) => {
	if (!token) {
		return;
	}

	window.localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = () => {
	window.localStorage.removeItem(TOKEN_KEY);
};

export { TOKEN_KEY };
