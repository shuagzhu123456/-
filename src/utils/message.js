const MESSAGE_TYPES = {
	success: "success",
	error: "error",
	warning: "warning",
	info: "info",
};

const MESSAGE_CONTAINER_ID = "app-message-container";
const MESSAGE_DURATION = 2800;

const createContainer = () => {
	let container = document.getElementById(MESSAGE_CONTAINER_ID);
	if (container) {
		return container;
	}

	container = document.createElement("div");
	container.id = MESSAGE_CONTAINER_ID;
	container.style.position = "fixed";
	container.style.top = "24px";
	container.style.right = "24px";
	container.style.zIndex = "9999";
	container.style.display = "flex";
	container.style.flexDirection = "column";
	container.style.gap = "12px";
	container.style.pointerEvents = "none";
	document.body.appendChild(container);
	return container;
};

const getMessageStyle = (type) => {
	const colorMap = {
		[MESSAGE_TYPES.success]: {
			border: "rgba(46, 255, 168, 0.45)",
			background: "rgba(6, 25, 36, 0.92)",
			shadow: "rgba(46, 255, 168, 0.18)",
		},
		[MESSAGE_TYPES.error]: {
			border: "rgba(255, 96, 96, 0.45)",
			background: "rgba(36, 12, 18, 0.92)",
			shadow: "rgba(255, 96, 96, 0.18)",
		},
		[MESSAGE_TYPES.warning]: {
			border: "rgba(255, 196, 73, 0.45)",
			background: "rgba(36, 24, 6, 0.92)",
			shadow: "rgba(255, 196, 73, 0.18)",
		},
		[MESSAGE_TYPES.info]: {
			border: "rgba(67, 184, 255, 0.45)",
			background: "rgba(6, 18, 39, 0.92)",
			shadow: "rgba(67, 184, 255, 0.18)",
		},
	};

	return colorMap[type] || colorMap[MESSAGE_TYPES.info];
};

const showMessage = (message, type = MESSAGE_TYPES.info) => {
	if (!message || typeof document === "undefined") {
		return;
	}

	const container = createContainer();
	const style = getMessageStyle(type);
	const element = document.createElement("div");

	element.textContent = message;
	element.style.minWidth = "220px";
	element.style.maxWidth = "360px";
	element.style.padding = "12px 16px";
	element.style.border = `1px solid ${style.border}`;
	element.style.borderRadius = "8px";
	element.style.background = style.background;
	element.style.boxShadow = `0 0 16px ${style.shadow}`;
	element.style.color = "#eff7ff";
	element.style.fontSize = "14px";
	element.style.lineHeight = "1.5";
	element.style.wordBreak = "break-all";
	element.style.pointerEvents = "auto";
	element.style.backdropFilter = "blur(8px)";

	container.appendChild(element);

	window.setTimeout(() => {
		element.remove();
	}, MESSAGE_DURATION);
};

export const message = {
	success(text) {
		showMessage(text, MESSAGE_TYPES.success);
	},
	error(text) {
		showMessage(text, MESSAGE_TYPES.error);
	},
	warning(text) {
		showMessage(text, MESSAGE_TYPES.warning);
	},
	info(text) {
		showMessage(text, MESSAGE_TYPES.info);
	},
};

export default message;
