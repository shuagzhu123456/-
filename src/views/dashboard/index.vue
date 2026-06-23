<script setup>
import { computed, ref } from "vue";
import leftModuleImage from "@/assets/t-001.png";
import leftPanelBg from "@/assets/lift-bj2x.png";
import stepActiveCardBg from "@/assets/d3-2.png";
import stepCardBg from "@/assets/d3-1.png";
import stepConfirmIcon from "@/assets/d3-queren.png";
import stepDownloadIcon from "@/assets/d3-xiaza.png";
import stepInflateIcon from "@/assets/d3-jieya.png";
import stepValidateIcon from "@/assets/d3-jiaoyan.png";
import stepDesensitizeIcon from "@/assets/d3-tuomi.png";
import stepStorageIcon from "@/assets/de-xixinz.png";
import topBg from "@/assets/top.png";
import Module_1 from "@/components/Module_1.vue";
import Module_2 from "@/components/Module_2.vue";
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

// 第三模块基础步骤：只描述固定业务步骤与图标
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

// 第三模块显示步骤：根据当前步骤自动推导已完成、高亮、未开始状态
const batchProgressSteps = computed(() =>
	batchProgressBaseSteps.map((step) => ({
		...step,
		completed: step.step < currentBatchStep.value,
		active: step.step === currentBatchStep.value,
		cardBackground: step.step === currentBatchStep.value ? stepActiveCardBg : stepCardBg,
	})),
);

// 第三模块进度条：当前先按步骤占比换算，后续可直接替换为接口进度值
const batchProgressValue = computed(() => Math.round((currentBatchStep.value / batchProgressBaseSteps.length) * 100));

// 第三模块批次与时间：先用静态数据占位
const currentBatchLabel = "当前批次:2026年度春季补贴数据";
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
						<div class="batch-progress">
							<div class="batch-progress__title">
								<span class="batch-progress__triangle"></span>
								<span class="batch-progress__title-text">批次处理进度看板</span>
								<span class="batch-progress__current">{{ currentBatchLabel }}</span>
							</div>

							<div class="batch-progress__steps">
								<template v-for="(step, index) in batchProgressSteps" :key="step.key">
									<div class="batch-progress__step">
										<div class="batch-progress__step-card" :class="{ 'batch-progress__step-card--active': step.active }" :style="{ backgroundImage: `url(${step.cardBackground})` }">
											<img class="batch-progress__step-icon" :src="step.icon" alt="" />
											<img v-if="step.completed" class="batch-progress__step-check" :src="stepConfirmIcon" alt="" />
										</div>
										<div class="batch-progress__step-label">{{ step.label }}</div>
									</div>

									<div v-if="index < batchProgressSteps.length - 1" class="batch-progress__step-arrow">&gt;</div>
								</template>
							</div>

							<div class="batch-progress__divider"></div>

							<div class="batch-progress__bar-row">
								<div class="batch-progress__bar-label">处理进度</div>
								<div class="batch-progress__bar-track">
									<div class="batch-progress__bar-fill" :style="{ width: `${batchProgressValue}%` }"></div>
								</div>
								<div class="batch-progress__bar-value">{{ batchProgressValue }}%</div>
							</div>

							<div class="batch-progress__time-row">
								<div class="batch-progress__time-item">
									<img class="batch-progress__time-icon" :src="stepConfirmIcon" alt="" />
									<span>开始时间:{{ batchStartTime }}</span>
								</div>

								<div class="batch-progress__time-divider"></div>

								<div class="batch-progress__time-item">
									<img class="batch-progress__time-icon" :src="stepConfirmIcon" alt="" />
									<span>完成时间:{{ batchEndTime }}</span>
								</div>
							</div>
						</div>
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

/* 第三模块：批次处理进度看板 */
.batch-progress {
	width: 460px;
	margin: 10px auto 0;
}

/* 第三模块标题行 */
.batch-progress__title {
	display: flex;
	align-items: center;
	height: 30px;
	margin-left: 20px;
}

.batch-progress__triangle {
	width: 0;
	height: 0;
	margin-right: 10px;
	border-top: 8px solid transparent;
	border-bottom: 8px solid transparent;
	border-left: 14px solid #42b8ff;
	filter: drop-shadow(0 0 8px rgba(66, 184, 255, 0.28));
}

.batch-progress__title-text {
	font-size: 17px;
	font-weight: 700;
	letter-spacing: 0.5px;
	color: #68caff;
	text-shadow: 0 0 8px rgba(46, 185, 255, 0.3);
}

.batch-progress__current {
	margin-left: 12px;
	font-size: 13px;
	color: rgba(239, 247, 255, 0.72);
}

/* 第三模块步骤流 */
.batch-progress__steps {
	display: flex;
	align-items: flex-start;
	margin-top: 16px;
}

.batch-progress__step {
	width: 87px;
}

.batch-progress__step-card {
	position: relative;
	width: 79px;
	height: 85px;
	margin: 0 auto;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.batch-progress__step-card--active {
	filter: drop-shadow(0 0 12px rgba(76, 163, 255, 0.28));
}

.batch-progress__step-icon {
	display: block;
	max-width: 43px;
	max-height: 46px;
}

.batch-progress__step-check {
	position: absolute;
	right: -2px;
	bottom: -2px;
	width: 22px;
	height: 22px;
}

.batch-progress__step-label {
	margin-top: 10px;
	font-size: 12px;
	line-height: 1.1;
	text-align: center;
	color: rgba(239, 247, 255, 0.9);
	white-space: nowrap;
}

.batch-progress__step-arrow {
	width: 22px;
	padding-top: 30px;
	font-size: 24px;
	line-height: 1;
	text-align: center;
	color: rgba(239, 247, 255, 0.7);
}

/* 第三模块分隔线 */
.batch-progress__divider {
	margin-top: 14px;
	border-bottom: 1px solid #002f5d;
}

/* 第三模块进度条 */
.batch-progress__bar-row {
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	gap: 14px;
	margin-top: 18px;
}

.batch-progress__bar-label {
	font-size: 13px;
	font-weight: 600;
	color: rgba(239, 247, 255, 0.86);
}

.batch-progress__bar-track {
	position: relative;
	height: 22px;
	border-radius: 14px;
	background: rgba(30, 70, 130, 0.46);
	overflow: hidden;
}

.batch-progress__bar-fill {
	height: 100%;
	border-radius: 14px;
	background: linear-gradient(90deg, #1a7fff 0%, #26a8ff 100%);
	box-shadow: 0 0 12px rgba(38, 168, 255, 0.28);
}

.batch-progress__bar-value {
	font-size: 16px;
	font-weight: 700;
	color: #5eb7ff;
}

/* 第三模块时间区域 */
.batch-progress__time-row {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	height: 46px;
	margin-top: 18px;
	padding: 0 16px;
	border: 1px solid rgba(29, 125, 255, 0.22);
	border-radius: 6px;
	background: rgba(5, 19, 43, 0.26);
}

.batch-progress__time-item {
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 11px;
	color: rgba(239, 247, 255, 0.78);
}

.batch-progress__time-icon {
	width: 18px;
	height: 18px;
}

.batch-progress__time-divider {
	width: 1px;
	height: 16px;
	background: rgba(29, 125, 255, 0.22);
}
</style>
