<script setup>
import { computed, ref } from "vue";
import leftPanelBg from "@/assets/lift-bj2x.png";
import leftModuleImage from "@/assets/t-001.png";
import rightLifecycleBg from "@/assets/r-1coen-bj.png";
import stepDesensitizeIcon from "@/assets/d3-tuomi.png";
import stepDownloadIcon from "@/assets/d3-xiaza.png";
import stepInflateIcon from "@/assets/d3-jieya.png";
import stepStorageIcon from "@/assets/de-xixinz.png";
import stepValidateIcon from "@/assets/d3-jiaoyan.png";
import titleIcon from "@/assets/top-c1.png";
import topBg from "@/assets/top.png";
import titleBg from "@/assets/xiaobut-1.png";
import rightTitleIcon from "@/assets/y-top-icon.png";
import Module_1 from "@/components/Module_1.vue";
import Module_2 from "@/components/Module_2.vue";
import Module_3 from "@/components/Module_3.vue";
import PublicBackground from "@/components/PublicBackground.vue";
import ScreenHeader from "@/components/screen/ScreenHeader.vue";
import { useClock } from "@/composables/useClock";
import { useScreenScale } from "@/composables/useScreenScale";

defineOptions({
	name: "DashboardView",
});

// 页面头部：标题与时间
const pageTitle = ref("黑龙江省耕地资产数据治理与金融赋能平台");
const updateLabel = ref("最新数据同步时间");
const currentTime = ref("");

// 左右侧面板标题
const leftPanelTitle = "数据治理与自动化清洗";
const rightPanelTitle = "金融赋能与安全合规";

// 左侧第一模块：多源异构数据采集
const leftModuleTitle = "多源异构数据采集流";
const leftModulePlatformLabel = "智能清洗平台";
const leftModuleFlowList = [
	{ key: "finance", label: "省财政厅专线", className: "left-panel__flow-label--finance" },
	{ key: "land-transfer", label: "土地流转平台", className: "left-panel__flow-label--land-transfer" },
	{ key: "database", label: "确权基础地块库", className: "left-panel__flow-label--database" },
];

// 左侧第二模块：规则引擎监控
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

// 左侧第三模块：批次处理进度
const currentBatchStep = ref(4);
const batchProgressBaseSteps = [
	{ key: "receive", step: 1, icon: stepDownloadIcon, label: "1.文件接收" },
	{ key: "inflate", step: 2, icon: stepInflateIcon, label: "2.自动解压" },
	{ key: "validate", step: 3, icon: stepValidateIcon, label: "3.格式校验" },
	{ key: "desensitize", step: 4, icon: stepDesensitizeIcon, label: "4.敏感信息脱敏" },
	{ key: "storage", step: 5, icon: stepStorageIcon, label: "5.入库完成" },
];
const batchProgressSteps = computed(() =>
	batchProgressBaseSteps.map((step) => ({
		...step,
		completed: step.step < currentBatchStep.value,
		active: step.step === currentBatchStep.value,
	})),
);
const batchProgressValue = computed(() => Math.round((currentBatchStep.value / batchProgressBaseSteps.length) * 100));
const batchProgressTitle = "批次处理进度看板";
const currentBatchLabel = "当前批次:2026年度春季补贴数据";
const batchProgressLabel = "处理进度";
const batchStartLabel = "开始时间:";
const batchEndLabel = "完成时间:";
const batchStartTime = "2026-05-31 20:15:02";
const batchEndTime = "2026-05-31 20:15:02";

// 右侧第一模块：土地抵押全生命周期管理
const rightLifecycleTitle = "土地抵押全生命周期管理";
const rightLifecycleTotal = "89,466";
const rightLifecycleList = [
	{ key: "verified", label: "已核验", value: "28,756", percent: "32.1%", colorClass: "right-lifecycle__value--blue" },
	{ key: "registering", label: "抵押登记中", value: "28,756", percent: "32.1%", colorClass: "right-lifecycle__value--cyan" },
	{ key: "mortgaged", label: "在押状态", value: "28,756", percent: "32.1%", colorClass: "right-lifecycle__value--gold" },
	{ key: "released", label: "解押完成", value: "28,756", percent: "32.1%", colorClass: "right-lifecycle__value--purple" },
];

// 页面缩放：保持 1920x1080 大屏适配
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

			<!-- 内容区域：三栏独立比例布局 -->
			<div class="screen-content-layer" :style="screenTransform">
				<div class="screen-body">
					<!-- 左侧区：占 25%，面板贴左 -->
					<div class="screen-column screen-column--left">
						<PublicBackground class="screen-panel" :panel-background="leftPanelBg" :title-background="titleBg" :title-icon="titleIcon" :title="leftPanelTitle">
							<!-- 第一模块：多源异构数据采集 -->
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

					<!-- 中间区：占 50%，先保留占位 -->
					<div class="screen-column screen-column--center">
						<div class="center-placeholder">
							<div class="center-placeholder__label">中间区占位</div>
						</div>
					</div>

					<!-- 右侧区：占 25%，面板贴右 -->
					<div class="screen-column screen-column--right">
						<PublicBackground class="screen-panel" :panel-background="leftPanelBg" :title-background="titleBg" :title-icon="rightTitleIcon" :title="rightPanelTitle">
							<!-- 右侧第一模块：土地抵押全生命周期管理 -->
							<div class="right-lifecycle">
								<div class="right-lifecycle__title">
									<span class="right-lifecycle__triangle"></span>
									<span class="right-lifecycle__title-text">{{ rightLifecycleTitle }}</span>
								</div>

								<div class="right-lifecycle__content" :style="{ backgroundImage: `url(${rightLifecycleBg})` }">
									<div v-for="item in rightLifecycleList" :key="item.key" class="right-lifecycle__row">
										<div class="right-lifecycle__label">{{ item.label }}</div>

										<div class="right-lifecycle__stat">
											<div class="right-lifecycle__value" :class="item.colorClass">
												<span>{{ item.value }}</span>
												<i>笔</i>
											</div>
											<div class="right-lifecycle__percent">({{ item.percent }})</div>
										</div>
									</div>
								</div>

								<div class="right-lifecycle__total">
									<span class="right-lifecycle__total-label">合计:</span>
									<span class="right-lifecycle__total-value">{{ rightLifecycleTotal }}</span>
									<span class="right-lifecycle__total-unit">笔</span>
								</div>
								<div class="left-panel__border-but"></div>
							</div>
						</PublicBackground>
					</div>
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

/* 内容层：固定 1920 画布坐标 */
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

/* 页面主体：三栏比例骨架 */
.screen-body {
	display: grid;
	grid-template-columns: 25% 50% 25%;
	width: 100%;
	padding-top: 90px;
	box-sizing: border-box;
	pointer-events: auto;
}

/* 三栏容器：彼此独立 */
.screen-column {
	position: relative;
	width: 100%;
	height: 100%;
}

/* 左侧区：贴左对齐 */
.screen-column--left {
	display: flex;
	justify-content: flex-start;
	padding-left: 10px;
	box-sizing: border-box;
}

/* 中间区：先放占位盒 */
.screen-column--center {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: 15px;
	box-sizing: border-box;
}

/* 右侧区：贴右对齐 */
.screen-column--right {
	display: flex;
	justify-content: flex-end;
	box-sizing: border-box;
	margin-left: 300px;
}

/* 面板容器：收回公共组件默认绝对定位 */
.screen-panel {
	position: relative;
	top: 0;
	left: 0;
	right: auto;
}

/* 右侧面板：强制服从右对齐 */
.screen-column--right .screen-panel {
	left: auto;
	right: 0;
	margin-left: auto;
	margin-right: 0;
}

/* 中间区占位框：后续直接替换为真实模块 */
.center-placeholder {
	display: flex;
	align-items: center;
	justify-content: center;
	width: calc(100% - 48px);
	min-height: 220px;
	border: 1px dashed rgba(76, 174, 255, 0.45);
	border-radius: 18px;
	background: linear-gradient(180deg, rgba(8, 26, 53, 0.32), rgba(5, 17, 38, 0.18));
	box-shadow: inset 0 0 20px rgba(17, 99, 196, 0.12);
}

/* 中间区占位文字 */
.center-placeholder__label {
	font-size: 24px;
	font-weight: 600;
	letter-spacing: 3px;
	color: rgba(109, 206, 255, 0.82);
	text-shadow: 0 0 10px rgba(43, 170, 255, 0.2);
}

/* 右侧第一模块：整体容器 */
.right-lifecycle {
	width: 474px;
	margin: 4px auto 0;
}

/* 右侧第一模块：标题栏 */
.right-lifecycle__title {
	display: flex;
	align-items: center;
	gap: 10px;
	height: 30px;
	margin-left: 16px;
}

/* 右侧第一模块：蓝色三角装饰 */
.right-lifecycle__triangle {
	width: 0;
	height: 0;
	margin-top: 1px;
	border-top: 8px solid transparent;
	border-bottom: 8px solid transparent;
	border-left: 15px solid #42b8ff;
	filter: drop-shadow(0 0 8px rgba(66, 184, 255, 0.28));
}

/* 右侧第一模块：标题文字 */
.right-lifecycle__title-text {
	font-size: 17px;
	font-weight: 700;
	letter-spacing: 0.6px;
	color: #68caff;
	text-shadow: 0 0 8px rgba(46, 185, 255, 0.3);
}

/* 右侧第一模块：内容背景区 */
.right-lifecycle__content {
	display: flex;
	flex-direction: column;
	width: 474px;
	height: 220px;
	margin-top: 6px;
	padding: 4px 0px 0 47px;
	box-sizing: border-box;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
}

/* 右侧第一模块：单行内容 */
.right-lifecycle__row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 53px;
}

/* 右侧第一模块：左侧标题 */
.right-lifecycle__label {
	font-size: 16px;
	font-weight: 700;
	letter-spacing: 0.2px;
	color: #f4fbff;
	text-shadow: 0 0 8px rgba(255, 255, 255, 0.12);
}

/* 右侧第一模块：右侧统计列 */
.right-lifecycle__stat {
	width: 126px;
	text-align: left;
}

/* 右侧第一模块：数值与单位 */
.right-lifecycle__value {
	display: flex;
	align-items: baseline;
	gap: 8px;
	font-weight: 700;
	line-height: 1;

	span {
		font-size: 20px;
		letter-spacing: 0.5px;
	}

	i {
		font-style: normal;
		font-size: 12px;
	}
}

/* 右侧第一模块：四色数值 */
.right-lifecycle__value--blue {
	color: #47aaff;
}

.right-lifecycle__value--cyan {
	color: #28f1ca;
}

.right-lifecycle__value--gold {
	color: #ffc649;
}

.right-lifecycle__value--purple {
	color: #a88cff;
}

/* 右侧第一模块：占比文本 */
.right-lifecycle__percent {
	margin-top: 7px;
	padding-left: 2px;
	font-size: 12px;
	color: rgba(229, 241, 255, 0.78);
}

/* 右侧第一模块：合计区 */
.right-lifecycle__total {
	display: flex;
	align-items: baseline;
	justify-content: center;
	gap: 8px;
	margin-top: 6px;
}

/* 右侧第一模块：合计辅助文字 */
.right-lifecycle__total-label,
.right-lifecycle__total-unit {
	font-size: 17px;
	color: #eef8ff;
}

/* 右侧第一模块：合计数字 */
.right-lifecycle__total-value {
	font-size: 20px;
	font-weight: 700;
	line-height: 1;
	color: #ffc74c;
	letter-spacing: 0.6px;
	text-shadow: 0 0 10px rgba(255, 199, 76, 0.24);
}
/* 底部分隔线：用于和后续模块做视觉分隔 */
.left-panel__border-but {
	margin-top: 9px;
	border-bottom: 1px solid #002f5d;
}
</style>
