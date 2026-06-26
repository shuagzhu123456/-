<script setup>
import { computed } from "vue";

defineOptions({
	name: "ScreenHeader",
});

const props = defineProps({
	// 标题文本：支持通过 v-model:title 双向绑定
	title: {
		type: String,
		default: "",
	},
	// 时间标签：用于展示时间说明文案
	timeLabel: {
		type: String,
		default: "",
	},
	// 时间值：支持通过 v-model:time-value 双向绑定
	timeValue: {
		type: String,
		default: "",
	},
	// 头部背景图：由外部传入，避免组件写死资源
	backgroundSrc: {
		type: String,
		default: "",
	},
	// 背景图替代文本：兼顾通用性与可访问性
	backgroundAlt: {
		type: String,
		default: "",
	},
	// 画布样式：允许父层传入缩放等样式
});

const emit = defineEmits(["update:title", "update:timeValue", "background-load", "background-error"]);

// 标题模型：统一处理标题展示与 v-model 兼容
const titleModel = computed({
	get: () => props.title,
	set: (value) => {
		emit("update:title", value);
	},
});

// 时间模型：统一处理时间值展示与 v-model 兼容
const timeValueModel = computed({
	get: () => props.timeValue,
	set: (value) => {
		emit("update:timeValue", value);
	},
});

// 背景图加载完成时向外通知
const handleBackgroundLoad = (event) => {
	emit("background-load", event);
};

// 背景图加载失败时向外通知
const handleBackgroundError = (event) => {
	emit("background-error", event);
};
</script>

<template>
	<div v-if="backgroundSrc" class="screen-header-bg">
		<img :src="backgroundSrc" :alt="backgroundAlt" @load="handleBackgroundLoad" @error="handleBackgroundError" />
	</div>

	<div class="screen-canvas">
		<header class="screen-header">
			<div class="screen-header__title">{{ titleModel }}</div>

			<div class="screen-header__time">
				<span class="screen-header__time-label">{{ timeLabel }}</span>
				<span class="screen-header__time-value">{{ timeValueModel }}</span>
			</div>
		</header>

		<slot />
	</div>
</template>

<style scoped lang="scss">
/* 头部背景层：独立铺满浏览器顶部区域 */
.screen-header-bg {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 0;
	width: 100%;
	pointer-events: none;

	img {
		display: block;
		width: 100%;
		height: 100%;
		object-fit: fill;
	}
}

/* 大屏画布层：承载缩放后的统一布局坐标 */
.screen-canvas {
	position: relative;
	z-index: 1;
	width: 100%;
	height: 100%;
	min-height: 0;
}

/* 头部容器：约束标题与时间区域的定位 */
.screen-header {
	position: relative;
}

/* 主标题：位于头部中轴区域 */
.screen-header__title {
	position: absolute;
	top: clamp(1rem, 1.8vh, 1.25rem);
	left: 50%;
	transform: translateX(-50%);
	font-size: clamp(1.5rem, 1.4vw, 1.875rem);
	font-weight: 700;
	line-height: 1.2;
	letter-spacing: clamp(0.04rem, 0.12vw, 0.125rem);
	color: #eef7ff;
	text-shadow: 0 0 12px rgba(56, 177, 255, 0.28);
	white-space: nowrap;
}

/* 时间区域：位于头部右上角 */
.screen-header__time {
	position: absolute;
	top: clamp(1.5rem, 2.4vh, 1.65rem);
	right: clamp(0.5rem, 0.8vw, 1rem);
	display: flex;
	align-items: center;
	gap: clamp(0.5rem, 0.8vw, 0.875rem);
	font-size: clamp(0.875rem, 0.95vw, 1.125rem);
	line-height: 1;
}

/* 时间标签：用于展示辅助说明文案 */
.screen-header__time-label {
	color: rgba(210, 232, 255, 0.72);
}

/* 时间值：突出当前时间信息 */
.screen-header__time-value {
	color: #1fd5ff;
	font-weight: 500;
	letter-spacing: 0.5px;
}
</style>
