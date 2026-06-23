<script setup>
defineOptions({
	name: "Module_1",
});

const props = defineProps({
	// 模块标题：支持外部传入不同业务文案
	title: {
		type: String,
		default: "",
	},
	// 主图资源：由父层控制实际展示内容
	imageSrc: {
		type: String,
		default: "",
	},
	// 主图说明：兼顾图片语义与可访问性
	imageAlt: {
		type: String,
		default: "",
	},
	// 流转标签列表：由父层传入文案和定位类名
	flowList: {
		type: Array,
		default: () => [],
	},
	// 右下角平台文案：避免组件内部写死
	platformLabel: {
		type: String,
		default: "",
	},
	// 底部分隔线：允许按场景控制显示与隐藏
	showDivider: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["image-load", "image-error"]);

// 主图加载完成时向外通知，便于后续做状态联动
const handleImageLoad = (event) => {
	emit("image-load", event);
};

// 主图加载失败时向外通知，便于父层兜底处理
const handleImageError = (event) => {
	emit("image-error", event);
};
</script>

<template>
	<div class="left-panel__module">
		<div class="left-panel__module-title">{{ title }}</div>

		<img class="left-panel__module-image" :src="imageSrc" :alt="imageAlt" @load="handleImageLoad" @error="handleImageError" />

		<div class="left-panel__module-copy">
			<div v-for="item in flowList" :key="item.key" class="left-panel__flow-label" :class="item.className">
				{{ item.label }}
			</div>

			<div class="left-panel__funnel-label">{{ platformLabel }}</div>
		</div>

		<div v-if="showDivider" class="left-panel__border-but"></div>
	</div>
</template>

<style scoped lang="scss">
/* 第一模块容器：承接主图和覆盖文案布局 */
.left-panel__module {
	position: relative;
	width: 460px;
	height: 249px;
	margin: 8px auto 0;
}

/* 第一模块标题：位于模块左上角 */
.left-panel__module-title {
	height: 28px;
	margin: 0 0 12px 24px;
	font-size: 18px;
	font-weight: 700;
	letter-spacing: 1px;
	color: #68caff;
	text-shadow: 0 0 8px rgba(46, 185, 255, 0.3);
}

/* 第一模块主图：按视觉稿比例展示 */
.left-panel__module-image {
	display: block;
	width: 460px;
	height: 208px;
}

/* 第一模块覆盖层：承载流转标签和平台文案 */
.left-panel__module-copy {
	position: absolute;
	top: 40px;
	left: 0;
	width: 460px;
	height: 208px;
}

/* 流转标签：复用当前大屏发光文字风格 */
.left-panel__flow-label {
	position: absolute;
	left: 68px;
	font-size: 18px;
	font-weight: 700;
	line-height: 1;
	color: #f5fbff;
	text-shadow: 0 0 8px rgba(255, 255, 255, 0.16);
}

.left-panel__flow-label--finance {
	top: 15px;
}

.left-panel__flow-label--land-transfer {
	top: 90px;
}

.left-panel__flow-label--database {
	top: 170px;
}

/* 平台文案：固定在主图右下角区域 */
.left-panel__funnel-label {
	position: absolute;
	right: 18px;
	bottom: 16px;
	font-size: 17px;
	font-weight: 700;
	line-height: 1;
	color: #f5fbff;
	text-shadow: 0 0 8px rgba(255, 255, 255, 0.16);
}

/* 底部分隔线：用于和后续模块做视觉分隔 */
.left-panel__border-but {
	margin-top: 12px;
	border-bottom: 1px solid #002f5d;
}
</style>
