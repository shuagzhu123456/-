<script setup>
defineOptions({
	name: "PublicBackground",
});

const props = defineProps({
	// 面板背景图：由外部传入，兼容左右区域复用
	panelBackground: {
		type: String,
		default: "",
	},
	// 标题背景图：用于承载统一标题装饰
	titleBackground: {
		type: String,
		default: "",
	},
	// 标题图标：支持不同区域传入不同图标
	titleIcon: {
		type: String,
		default: "",
	},
	// 标题文本：保持标题内容可配置
	title: {
		type: String,
		default: "",
	},
	// 背景替代文本：兼顾通用性与可访问性
	panelAlt: {
		type: String,
		default: "",
	},
	// 图标替代文本：兼顾通用性与可访问性
	iconAlt: {
		type: String,
		default: "",
	},
});

defineEmits(["title-click"]);
</script>

<template>
	<aside class="public-panel" :style="{ backgroundImage: panelBackground ? `url(${panelBackground})` : 'none' }" :aria-label="panelAlt">
		<!-- 标题外壳：统一承载背景、图标和标题文字 -->
		<div class="public-panel__header" :style="{ backgroundImage: titleBackground ? `url(${titleBackground})` : 'none' }" @click="$emit('title-click')">
			<img v-if="titleIcon" class="public-panel__header-icon" :src="titleIcon" :alt="iconAlt" />
			<span class="public-panel__header-text">{{ title }}</span>
		</div>

		<!-- 内容插槽：业务模块由页面自行组合 -->
		<div class="public-panel__content">
			<slot />
		</div>
	</aside>
</template>

<style scoped lang="scss">
/* 公共面板外壳：负责统一背景与基础内边距 */
.public-panel {
	position: absolute;
	top: 109px;
	left: 10px;
	width: 508px;
	height: 99%;
	padding: 8px;
	box-sizing: border-box;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
}

/* 公共标题区：统一承载标题装饰与布局 */
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

/* 公共标题图标：保持统一尺寸与对齐 */
.public-panel__header-icon {
	width: 28px;
	height: 28px;
	flex-shrink: 0;
}

/* 公共标题文字：复用大屏高亮风格 */
.public-panel__header-text {
	font-size: 20px;
	font-weight: 700;
	letter-spacing: 0.5px;
	color: #f3fbff;
	text-shadow: 0 0 10px rgba(47, 180, 255, 0.22);
}

/* 公共内容区：承接具体业务模块 */
.public-panel__content {
	width: 100%;
}
</style>
