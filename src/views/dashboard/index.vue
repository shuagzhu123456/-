<script setup>
import { computed, ref } from "vue";
import leftPanelBg from "@/assets/lift-bj2x.png";
import leftModuleImage from "@/assets/t-001.png";
import stepDesensitizeIcon from "@/assets/d3-tuomi.png";
import stepDownloadIcon from "@/assets/d3-xiaza.png";
import stepInflateIcon from "@/assets/d3-jieya.png";
import stepStorageIcon from "@/assets/de-xixinz.png";
import stepValidateIcon from "@/assets/d3-jiaoyan.png";
import titleIcon from "@/assets/top-c1.png";
import topBg from "@/assets/top.png";
import titleBg from "@/assets/xiaobut-1.png";
import rightTitleIcon from "@/assets/y-top-icon.png";
import centerBottomMapBg from "@/assets/z-dt-bj.png";
import centerBottomTitleBg from "@/assets/z-top.png";
import centerBankIcon1 from "@/assets/z-d-icon1.png";
import centerBankIcon2 from "@/assets/z-d-icon2.png";
import centerBankIcon3 from "@/assets/z-d-icon3.png";
import centerBankIcon4 from "@/assets/z-d-icon4.png";
import centerBankIcon5 from "@/assets/z-d-icon5.png";
import centerBankIcon6 from "@/assets/z-d-icon6.png";
import centerBankIcon7 from "@/assets/z-d-icon7.png";
import Module_1 from "@/components/Module_1.vue";
import Module_2 from "@/components/Module_2.vue";
import Module_3 from "@/components/Module_3.vue";
import MiddleZoneTop from "@/components/MiddleZone/MiddleZone_top.vue";
import PublicBackground from "@/components/PublicBackground.vue";
import RightModule_1 from "@/components/rightModule_1.vue";
import RightModule_2 from "@/components/rightModule_2.vue";
import RightModule_3 from "@/components/rightModule_3.vue";
import HeilongjiangMap from "@/components/HeilongjiangMap.vue";
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

// 左侧第二模块：智能清洗规则引擎监控
const ruleMonitorTitle = "智能清洗规则引擎监控";
const ruleMonitorScoreLabel = "本期数据质量评分";
const ruleMonitorScore = 80;
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

// 左侧第三模块：批次处理进度看板
const currentBatchStep = ref(2);
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

// 中间区顶部：三张统计卡
const middleTopList = [
	{ key: "area", label: "累计确权土地面积", value: "12,856,34", unit: "万亩" },
	{ key: "farmer", label: "覆盖涉农主体数", value: "10,245", unit: "户/家" },
	{ key: "finance", label: "支撑信贷总金额", value: "15,678,44", unit: "万元" },
];

// 右侧第一模块：土地抵押全生命周期管理
const rightLifecycleTitle = "土地抵押全生命周期管理";
const rightLifecycleTotalLabel = "合计:";
const rightLifecycleTotal = "89,466";
const rightLifecycleUnit = "笔";
const rightLifecycleList = [
	{ key: "verified", label: "已核验", value: "28,756", percent: "32.1%", colorClass: "right-lifecycle__value--blue" },
	{ key: "registering", label: "抵押登记中", value: "28,756", percent: "32.1%", colorClass: "right-lifecycle__value--cyan" },
	{ key: "mortgaged", label: "在押状态", value: "28,756", percent: "32.1%", colorClass: "right-lifecycle__value--gold" },
	{ key: "released", label: "解押完成", value: "28,756", percent: "32.1%", colorClass: "right-lifecycle__value--purple" },
];

// 右侧第二模块：主动式风险预警推送
const rightPushTitle = "主动式风险预警推送(实时)";
const rightPushMoreText = "更多";
const rightPushList = [
	{ id: 1, type: "warning", message: "[预警]客户“张”名下土地发生流转变更，已推送至建行", time: "15:29:18" },
	{ id: 2, type: "risk", message: "[风控]客户“张”名下土地发生流转变更，已推送至建行", time: "15:29:18" },
	{ id: 3, type: "notice", message: "[通知]客户“张”名下土地发生流转变更，已推送至建行", time: "15:29:18" },
	{ id: 4, type: "warning", message: "[预警]客户“张”名下土地发生流转变更，已推送至建行", time: "15:29:18" },
	{ id: 5, type: "risk", message: "[风控]客户“张”名下土地发生流转变更，已推送至建行", time: "15:29:18" },
	{ id: 6, type: "notice", message: "[通知]客户“张”名下土地发生流转变更，已推送至建行", time: "15:29:18" },
];

// 右侧第三模块：金融级安全防护体系
const rightSecurityTitle = "金融级安全防护体系";
const rightSecurityList = [
	{ key: "sdk", title: "SDK集群鉴权", desc: "多因子认证动态令牌" },
	{ key: "network", title: "政务专线隔离", desc: "物理隔离专网传输" },
	{ key: "crypto", title: "国密算法传输", desc: "SM2/SM3/SM4" },
	{ key: "privacy", title: "隐私计算脱敏", desc: "数据可用不可见" },
];

// 大屏缩放：保持 1920x1080 适配
// 中间区底部：全域耕地资产态势地图
const centerBottomTitle = "全域耕地资产态势地图";
const centerBottomLegendTitle = "确权面积(万亩)";
const centerBottomLegendList = [
	{ key: "lv1", label: ">500", color: "#45d8e9" },
	{ key: "lv2", label: "300-500", color: "#2ab8d8" },
	{ key: "lv3", label: "100-300", color: "#1e91bf" },
	{ key: "lv4", label: "50-100", color: "#145d9e" },
	{ key: "lv5", label: "<50", color: "#0a3978" },
];
const centerBottomBankList = [
	{ key: "ccb", label: "建设银行", icon: centerBankIcon1 },
	{ key: "abc", label: "农业银行", icon: centerBankIcon2 },
	{ key: "boc", label: "中国银行", icon: centerBankIcon3 },
	{ key: "psbc", label: "邮储银行", icon: centerBankIcon4 },
	{ key: "hlj", label: "龙江银行", icon: centerBankIcon5 },
	{ key: "rural", label: "农商银行", icon: centerBankIcon6 },
	{ key: "other", label: "其他金融机构", icon: centerBankIcon7 },
];
const centerBottomHeatData = ref([
	{ name: "哈尔滨市", value: 620, lineColor: "#74fdff" },
	{ name: "齐齐哈尔市", value: 358, lineColor: "#6af9ff" },
	{ name: "大庆市", value: 210, lineColor: "#61f7ff" },
	{ name: "绥化市", value: 186, lineColor: "#5eedff" },
	{ name: "黑河市", value: 88, lineColor: "#69f0ff" },
	{ name: "伊春市", value: 132, lineColor: "#6afcff" },
	{ name: "鹤岗市", value: 115, lineColor: "#73f8ff" },
	{ name: "佳木斯市", value: 301, lineColor: "#7af8ff" },
	{ name: "双鸭山市", value: 145, lineColor: "#72ffff" },
	{ name: "七台河市", value: 93, lineColor: "#6cefff" },
	{ name: "鸡西市", value: 162, lineColor: "#ffc64f" },
	{ name: "牡丹江市", value: 274, lineColor: "#ffd35a" },
	{ name: "大兴安岭地区", value: 76, lineColor: "#75fbff" },
]);

const handleMapRegionClick = (payload) => {
	console.log("map region click:", payload);
};

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

					<!-- 中间区：占 50%，先布局顶部统计卡 -->
					<div class="screen-column screen-column--center">
						<div class="center-shell">
							<!-- 中间区顶部 -->
							<MiddleZoneTop :list="middleTopList" />

							<!-- 中间区底部 -->
							<div class="center-bottom">
								<div class="center-bottom__title" :style="{ backgroundImage: `url(${centerBottomTitleBg})` }">
									<span>{{ centerBottomTitle }}</span>
								</div>

								<div class="center-bottom__map-shell" :style="{ backgroundImage: `url(${centerBottomMapBg})` }">
									<div class="center-bottom__legend">
										<div class="center-bottom__legend-title">{{ centerBottomLegendTitle }}</div>
										<div v-for="item in centerBottomLegendList" :key="item.key" class="center-bottom__legend-item">
											<span class="center-bottom__legend-color" :style="{ background: item.color }"></span>
											<span>{{ item.label }}</span>
										</div>
									</div>

									<div class="center-bottom__map-panel">
										<HeilongjiangMap :heat-data="centerBottomHeatData" @region-click="handleMapRegionClick" />
									</div>
								</div>

								<div class="center-bottom__bank-row">
									<div v-for="item in centerBottomBankList" :key="item.key" class="center-bottom__bank-item">
										<img class="center-bottom__bank-icon" :src="item.icon" alt="" />
										<div class="center-bottom__bank-label">{{ item.label }}</div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- 右侧区：占 25%，面板贴右 -->
					<div class="screen-column screen-column--right">
						<PublicBackground class="screen-panel" :panel-background="leftPanelBg" :title-background="titleBg" :title-icon="rightTitleIcon" :title="rightPanelTitle">
							<!-- 右侧第一模块：土地抵押全生命周期管理 -->
							<RightModule_1 :title="rightLifecycleTitle" :list="rightLifecycleList" :total-label="rightLifecycleTotalLabel" :total-value="rightLifecycleTotal" :unit="rightLifecycleUnit" />

							<!-- 右侧第二模块：主动式风险预警推送 -->
							<RightModule_2 :title="rightPushTitle" :more-text="rightPushMoreText" :list="rightPushList" />

							<!-- 右侧第三模块：金融级安全防护体系 -->
							<RightModule_3 :title="rightSecurityTitle" :list="rightSecurityList" />
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
	margin-left: 12px;
}

/* 中间区：承载上下结构 */
.screen-column--center {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	padding: 16px;
	box-sizing: border-box;
	width: 1200px;
	margin-left: 36px;
}

/* 右侧区：贴右对齐 */
.screen-column--right {
	display: flex;
	justify-content: flex-end;
	box-sizing: border-box;
	margin-left: 288px;
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

/* 中间区外壳：后续继续承接顶部和底部模块 */
.center-shell {
	width: 100%;
}

/* 中间区底部：地图模块容器 */
.center-bottom {
	margin-top: 15px;
	height: 900px;
}

/* 中间区底部：标题条 */
.center-bottom__title {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 48px;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;

	span {
		font-size: 24px;
		font-weight: 700;
		letter-spacing: 1px;
		color: #eef8ff;
		margin-bottom: 22px;
		text-shadow: 0 0 10px rgba(61, 182, 255, 0.2);
	}
}

/* 中间区底部：地图背景区 */
.center-bottom__map-shell {
	position: relative;
	height: 663px;
	padding: 10px 28px 0;
	box-sizing: border-box;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 98% 88%;
}

/* 中间区底部：左侧图例 */
.center-bottom__legend {
	position: absolute;
	left: 10px;
	bottom: 40px;
	z-index: 2;
}

.center-bottom__legend-title {
	margin-bottom: 12px;
	font-size: 15px;
	color: rgba(234, 244, 255, 0.9);
}

.center-bottom__legend-item {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 8px;
	font-size: 14px;
	color: rgba(225, 239, 255, 0.88);
}

.center-bottom__legend-color {
	display: block;
	width: 22px;
	height: 14px;
}

/* 中间区底部：地图实例区 */
.center-bottom__map-panel {
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 18px;
}

/* 中间区底部：底部图标行 */
.center-bottom__bank-row {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	align-items: end;
	column-gap: 18px;
	padding: 0 130px;
}

/* 中间区底部：单个图标项 */
.center-bottom__bank-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.center-bottom__bank-icon {
	display: block;
	width: 82px;
	height: 82px;
	object-fit: contain;
}

.center-bottom__bank-label {
	margin-top: 8px;
	font-size: 14px;
	color: rgba(231, 241, 255, 0.88);
	text-align: center;
	white-space: nowrap;
}
</style>
