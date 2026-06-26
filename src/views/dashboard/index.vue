<script setup>
import { computed, ref } from "vue";
import leftModuleImage from "@/assets/t-001.png";
import topBg from "@/assets/top.png";
import Module_1 from "@/components/Module_1.vue";
import Module_2 from "@/components/Module_2.vue";
import Module_3 from "@/components/Module_3.vue";
import MidBottomArea from "@/components/MiddleZone/midBottomArea.vue";
import MiddleZoneTop from "@/components/MiddleZone/MiddleZone_top.vue";
import PublicBackground from "@/components/PublicBackground.vue";
import RightModule_1 from "@/components/rightModule_1.vue";
import RightModule_2 from "@/components/rightModule_2.vue";
import RightModule_3 from "@/components/rightModule_3.vue";
import ScreenHeader from "@/components/screen/ScreenHeader.vue";
import { useClock } from "@/composables/useClock";

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
	{ key: "receive", step: 1, label: "1.文件接收" },
	{ key: "inflate", step: 2, label: "2.自动解压" },
	{ key: "validate", step: 3, label: "3.格式校验" },
	{ key: "desensitize", step: 4, label: "4.敏感信息脱敏" },
	{ key: "storage", step: 5, label: "5.入库完成" },
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

// 中间底部：地图与机构数据
const centerBottomTitle = "全域耕地资产态势地图";
const centerBottomLegendTitle = "确权面积(万亩)";
const centerBottomBankList = [
	{ key: "ccb", label: "建设银行" },
	{ key: "abc", label: "农业银行" },
	{ key: "boc", label: "中国银行" },
	{ key: "psbc", label: "邮储银行" },
	{ key: "hlj", label: "龙江银行" },
	{ key: "rural", label: "农商银行" },
	{ key: "other", label: "其他金融机构" },
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

useClock((value) => {
	currentTime.value = value;
});

// 统一缩放样式：头部和内容区共用
</script>

<template>
	<div class="screen-page">
		<div class="screen-stage">
			<ScreenHeader v-model:title="pageTitle" v-model:time-value="currentTime" :time-label="updateLabel" :background-src="topBg" />

			<div class="screen-content-layer">
				<div class="screen-body">
					<div class="screen-column screen-column--left">
						<PublicBackground class="screen-panel" side="left" :title="leftPanelTitle">
							<Module_1 :title="leftModuleTitle" :image-src="leftModuleImage" :image-alt="leftModuleTitle" :flow-list="leftModuleFlowList" :platform-label="leftModulePlatformLabel" />

							<Module_2
								:title="ruleMonitorTitle"
								:score-label="ruleMonitorScoreLabel"
								:score="ruleMonitorScore"
								:status-label="ruleMonitorStatusLabel"
								:status-text="ruleMonitorStatusText"
								:list="ruleMonitorList" />

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

					<div class="screen-column screen-column--center">
						<div class="center-shell">
							<MiddleZoneTop :list="middleTopList" />
							<MidBottomArea
								:title="centerBottomTitle"
								:legend-title="centerBottomLegendTitle"
								:heat-data="centerBottomHeatData"
								:bank-list="centerBottomBankList"
								@region-click="handleMapRegionClick" />
						</div>
					</div>

					<div class="screen-column screen-column--right">
						<PublicBackground class="screen-panel" side="right" :title="rightPanelTitle">
							<RightModule_1 :title="rightLifecycleTitle" :list="rightLifecycleList" :total-label="rightLifecycleTotalLabel" :total-value="rightLifecycleTotal" :unit="rightLifecycleUnit" />
							<RightModule_2 :title="rightPushTitle" :more-text="rightPushMoreText" :list="rightPushList" />
							<RightModule_3 :title="rightSecurityTitle" :list="rightSecurityList" />
						</PublicBackground>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.screen-page {
	min-height: 100vh;
	min-height: 100dvh;
	overflow-x: hidden;
	overflow-y: auto;
	background: radial-gradient(circle at top, rgba(17, 84, 159, 0.28), transparent 38%), linear-gradient(180deg, #031325 0%, #020b18 100%);
}

.screen-stage {
	position: relative;
	width: 100vw;
	min-height: 100vh;
	min-height: 100dvh;
	overflow: visible;
}

.screen-content-layer {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2;
	width: 100%;
	height: 100%;
	pointer-events: none;
}

.screen-body {
	display: grid;
	grid-template-columns: clamp(28rem, 25vw, 31.75rem) minmax(0, 1fr) clamp(28rem, 25vw, 31.75rem);
	column-gap: clamp(0.75rem, 1vw, 1rem);
	width: 100%;
	height: 100%;
	padding: clamp(5.25rem, 8vh, 5.75rem) clamp(0.75rem, 1vw, 1rem) clamp(1rem, 1.8vh, 1.5rem);
	box-sizing: border-box;
	pointer-events: auto;
	overflow: hidden;
}

.screen-column {
	position: relative;
	width: 100%;
	min-width: 0;
}

.screen-column--left {
	display: flex;
	justify-content: flex-start;
	box-sizing: border-box;
}

.screen-column--center {
	display: flex;
	align-items: flex-start;
	justify-content: center;
	min-width: 0;
	padding-top: clamp(0.75rem, 1vh, 1rem);
	box-sizing: border-box;
}

.screen-column--right {
	display: flex;
	justify-content: flex-end;
	box-sizing: border-box;
}

.screen-panel {
	position: relative;
	top: 0;
	left: 0;
	right: auto;
}

.screen-column--right .screen-panel {
	left: auto;
	right: 0;
	margin-left: auto;
	margin-right: 0;
}

.center-shell {
	width: 100%;
	min-width: 0;
}

@media (max-width: 1600px) {
	.screen-body {
		grid-template-columns: clamp(23rem, 26vw, 27rem) minmax(0, 1fr) clamp(23rem, 26vw, 27rem);
		padding-top: clamp(4.9rem, 7vh, 5.35rem);
		padding-bottom: clamp(0.75rem, 1.4vh, 1.25rem);
	}
}

@media (max-width: 1366px) {
	.screen-body {
		grid-template-columns: clamp(20.5rem, 27vw, 23.5rem) minmax(0, 1fr) clamp(20.5rem, 27vw, 23.5rem);
		column-gap: 0.75rem;
		padding-top: clamp(4.35rem, 6vh, 4.9rem);
		padding-bottom: 0.75rem;
	}
}
</style>
