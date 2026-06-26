<script setup>
import { computed } from "vue";
import panelBackgroundImage from "@/assets/lift-bj2x.png";
import leftTitleIcon from "@/assets/top-c1.png";
import rightTitleIcon from "@/assets/y-top-icon.png";
import titleBackgroundImage from "@/assets/xiaobut-1.png";

defineOptions({
	name: "PublicBackground",
});

const props = defineProps({
	// 面板标题：页面只需要传真实业务标题文本。
	title: {
		type: String,
		default: "",
	},
	// 面板类型：用于区分左侧和右侧的固定视觉资源。
	side: {
		type: String,
		default: "left",
		validator: (value) => ["left", "right"].includes(value),
	},
});

defineEmits(["title-click"]);

// 图标由组件内部决定，页面不再关心静态资源路径。
const titleIcon = computed(() => (props.side === "right" ? rightTitleIcon : leftTitleIcon));
</script>

<template>
	<aside class="public-panel" :style="{ backgroundImage: `url(${panelBackgroundImage})` }">
		<!-- 标题区域：固定承载标题背景和左右图标。 -->
		<div class="public-panel__header" :style="{ backgroundImage: `url(${titleBackgroundImage})` }" @click="$emit('title-click')">
			<img class="public-panel__header-icon" :src="titleIcon" alt="" />
			<span class="public-panel__header-text">{{ title }}</span>
		</div>

		<!-- 业务内容由插槽承接，组件只负责统一视觉层。 -->
		<div class="public-panel__content">
			<slot />
		</div>
	</aside>
</template>

<style scoped lang="scss">
.public-panel {
	position: absolute;
	width: clamp(28rem, 25vw, 31.75rem);
	height: 100%;
	padding: 8px;
	box-sizing: border-box;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
}

.public-panel__header {
	display: flex;
	align-items: center;
	gap: 10px;
	height: 43px;
	padding: 0 18px 0 14px;
	background-repeat: no-repeat;
	background-position: left center;
	background-size: 100% 100%;
}

.public-panel__header-icon {
	width: 28px;
	height: 28px;
	flex-shrink: 0;
}

.public-panel__header-text {
	font-size: 20px;
	font-weight: 700;
	letter-spacing: 0.5px;
	color: #f3fbff;
	text-shadow: 0 0 10px rgba(47, 180, 255, 0.22);
}

.public-panel__content {
	width: 100%;
}

@media (max-height: 980px) {
	.public-panel {
		padding: 6px;
	}

	.public-panel__header {
		height: 38px;
		padding: 0 14px 0 12px;
	}

	.public-panel__header-icon {
		width: 24px;
		height: 24px;
	}

	.public-panel__header-text {
		font-size: 18px;
	}
}
</style>
