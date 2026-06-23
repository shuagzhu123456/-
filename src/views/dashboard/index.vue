<script setup>
import { computed, ref } from "vue";
import leftModuleImage from "@/assets/t-001.png";
import leftPanelBg from "@/assets/lift-bj2x.png";
import stepDownloadIcon from "@/assets/d3-xiaza.png";
import stepInflateIcon from "@/assets/d3-jieya.png";
import stepValidateIcon from "@/assets/d3-jiaoyan.png";
import stepDesensitizeIcon from "@/assets/d3-tuomi.png";
import stepStorageIcon from "@/assets/de-xixinz.png";
import topBg from "@/assets/top.png";
import Module_1 from "@/components/Module_1.vue";
import Module_2 from "@/components/Module_2.vue";
import Module_3 from "@/components/Module_3.vue";
import PublicBackground from "@/components/PublicBackground.vue";
import titleIcon from "@/assets/top-c1.png";
import titleBg from "@/assets/xiaobut-1.png";
import ScreenHeader from "@/components/screen/ScreenHeader.vue";
import { useClock } from "@/composables/useClock";
import { useScreenScale } from "@/composables/useScreenScale";

// 页面标题：统一在头部组件中展示
const pageTitle = ref("黑龙江省耕地资产数据治理与金融赋能平台");

// 更新时间标签：放在头部右侧时间区域
const updateLabel = ref("最新数据同步时间");

// 当前时间：通过时钟组合式持续更新
const currentTime = ref("");

// 左侧总标题：用于公共背景模块头部
const leftPanelTitle = "数据治理与自动化清洗";

// 第一模块标题与文案：沿用当前已完成布局
const leftModuleTitle = "多源异构数据采集流";
const leftModulePlatformLabel = "智能清洗平台";
const leftModuleFlowList = [
	{
		key: "finance",
		label: "省财政厅专线",
		className: "left-panel__flow-label--finance",
	},
	{
		key: "land-transfer",
		label: "土地流转平台",
		className: "left-panel__flow-label--land-transfer",
	},
	{
		key: "database",
		label: "确权基础地块库",
		className: "left-panel__flow-label--database",
	},
];

// 第二模块静态数据：后续可平滑替换为接口返回
const ruleMonitorTitle = "智能清洗规则引擎监控";
const ruleMonitorScoreLabel = "本期数据质量评分";
const ruleMonitorScore = 60;
const ruleMonitorStatusLabel = "数据质量：";
const ruleMonitorStatusText = "优秀";
const ruleMonitorList = [
	{ id: 1, time: "[10:02:15]", messageLine1: "自动识别并修正异常地块", messageLine2: "地块样本 12 条" },
	{ id: 2, time: "[10:03:41]", messageLine1: "自动识别并修正重复数据", messageLine2: "地块样本 08 条" },
	{ id: 3, time: "[10:05:12]", messageLine1: "自动识别并修正字段缺失", messageLine2: "地块样本 16 条" },
	{ id: 4, time: "[10:07:28]", messageLine1: "自动识别并修正编码异常", messageLine2: "地块样本 11 条" },
	{ id: 5, time: "[10:08:53]", messageLine1: "自动识别并修正坐标偏移", messageLine2: "地块样本 06 条" },
	{ id: 6, time: "[10:10:19]", messageLine1: "自动识别并修正逻辑冲突", messageLine2: "地块样本 09 条" },
	{ id: 7, time: "[10:12:46]", messageLine1: "自动识别并修正口径差异", messageLine2: "地块样本 14 条" },
];

// 第三模块当前步骤：后续直接由接口返回当前进行到第几步
const currentBatchStep = ref(4);

// 第三模块固定步骤：只描述业务步骤和图标
const batchProgressBaseSteps = [
	{
		key: "receive",
		step: 1,
		icon: stepDownloadIcon,
		label: "1.文件接收",
	},
	{
		key: "inflate",
		step: 2,
		icon: stepInflateIcon,
		label: "2.自动解压",
	},
	{
		key: "validate",
		step: 3,
		icon: stepValidateIcon,
		label: "3.格式校验",
	},
	{
		key: "desensitize",
		step: 4,
		icon: stepDesensitizeIcon,
		label: "4.敏感信息脱敏",
	},
	{
		key: "storage",
		step: 5,
		icon: stepStorageIcon,
		label: "5.入库完成",
	},
];

// 第三模块显示步骤：根据当前步骤自动推导完成态与高亮态
const batchProgressSteps = computed(() =>
	batchProgressBaseSteps.map((step) => ({
		...step,
		completed: step.step < currentBatchStep.value,
		active: step.step === currentBatchStep.value,
	})),
);

// 第三模块进度值：当前先按步骤占比换算，后续可直接替换为接口进度
const batchProgressValue = computed(() => Math.round((currentBatchStep.value / batchProgressBaseSteps.length) * 100));

// 第三模块批次与时间：先用静态数据占位
const batchProgressTitle = "批次处理进度看板";
const currentBatchLabel = "当前批次:2026年度春季补贴数据";
const batchProgressLabel = "处理进度";
const batchStartLabel = "开始时间:";
const batchEndLabel = "完成时间:";
const batchStartTime = "2026-05-31 20:15:02";
const batchEndTime = "2026-05-31 20:15:02";

// 大屏缩放：保持 1920 x 1080 适配逻辑
const { scale } = useScreenScale();

useClock((value) => {
	currentTime.value = value;
});

// 统一缩放样式：头部和内容区共用
const screenTransform = computed(() => ({
	transform: `scale(${scale.value})`,
}));
</script>

<template>
	<div class="screen-page">
		<div class="screen-stage">
			<!-- 头部区域：背景、标题、时间 -->
			<ScreenHeader v-model:title="pageTitle" v-model:time-value="currentTime" :time-label="updateLabel" :background-src="topBg" :canvas-style="screenTransform" />

			<!-- 内容区域：当前先承载左侧区 -->
			<div class="screen-content-layer" :style="screenTransform">
				<div class="screen-body">
					<!-- 左侧区：复用公共背景壳 -->
					<PublicBackground class="left-panel" :panel-background="leftPanelBg" :title-background="titleBg" :title-icon="titleIcon" :title="leftPanelTitle">
						<!-- 第一模块：多源异构数据采集流 -->
						<Module_1 :title="leftModuleTitle" :image-src="leftModuleImage" :image-alt="leftModuleTitle" :flow-list="leftModuleFlowList" :platform-label="leftModulePlatformLabel" />

						<!-- 第二模块：智能清洗规则引擎监控 -->
						<Module_2
							:title="ruleMonitorTitle"
							:score-label="ruleMonitorScoreLabel"
							:score="ruleMonitorScore"
							:status-label="ruleMonitorStatusLabel"
							:status-text="ruleMonitorStatusText"
							:list="ruleMonitorList" />

						<!-- 第三模块：批次处理进度看板 -->
						<Module_3
							:title="batchProgressTitle"
							:current-batch-label="currentBatchLabel"
							:steps="batchProgressSteps"
							:progress-label="batchProgressLabel"
							:progress-value="batchProgressValue"
							:start-label="batchStartLabel"
							:start-time="batchStartTime"
							:end-label="batchEndLabel"
							:end-time="batchEndTime" />
					</PublicBackground>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
/* 页面外层：控制整屏背景和溢出 */
.screen-page {
	min-height: 100vh;
	overflow: hidden;
	background: radial-gradient(circle at top, rgba(17, 84, 159, 0.28), transparent 38%), linear-gradient(180deg, #031325 0%, #020b18 100%);
}

/* 大屏舞台层：承载头部和内容区 */
.screen-stage {
	position: relative;
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}

/* 内容层：固定 1920 画布坐标系 */
.screen-content-layer {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	width: 1920px;
	height: 1080px;
	transform-origin: top left;
	pointer-events: none;
}

/* 页面主体：头部以下的业务区域 */
.screen-body {
	position: relative;
	width: 100%;
	height: calc(100% - 109px);
	padding-top: 109px;
	box-sizing: border-box;
	pointer-events: auto;
}

/* 左侧区域：保持贴左布局 */
.left-panel {
	position: absolute;
	top: 109px;
	left: 10px;
}
</style>
