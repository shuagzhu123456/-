<script setup>
import { GaugeChart } from "echarts/charts";
import { TooltipComponent } from "echarts/components";
import { init, use, graphic } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import chartBottomBg from "@/assets/echs-but.png";
import chartStatusIcon from "@/assets/dpa.png";

// 只注册当前仪表盘用到的 ECharts 能力，避免整包引入。
use([GaugeChart, TooltipComponent, CanvasRenderer]);

defineOptions({
	name: "Module_2",
});

const props = defineProps({
	// 模块标题：支持外部传入不同业务场景文案
	title: {
		type: String,
		default: "",
	},
	// 评分标签：用于展示图表中心说明文字
	scoreLabel: {
		type: String,
		default: "",
	},
	// 评分值：作为图表和中心数值的核心数据
	score: {
		type: [Number, String],
		default: 0,
	},
	// 状态标签：用于描述状态字段含义
	statusLabel: {
		type: String,
		default: "",
	},
	// 状态值：展示当前数据质量或业务状态
	statusText: {
		type: String,
		default: "",
	},
	// 列表数据：后续可直接对接真实接口结果
	list: {
		type: Array,
		default: () => [],
	},
	// 底部分隔线：允许按场景控制显示与隐藏
	showDivider: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["chart-ready"]);

const chartRef = ref(null);
const listTrackRef = ref(null);

let ruleMonitorChart = null;
let ruleMonitorScrollFrame = 0;
let ruleMonitorScrollOffset = 0;

const numericScore = computed(() => {
	const value = Number(props.score);
	return Number.isFinite(value) ? value : 0;
});

const duplicatedList = computed(() => {
	if (props.list.length <= 4) {
		return props.list;
	}

	return [...props.list, ...props.list];
});

// 初始化图表：由组件内部接管 ECharts 生命周期
const initChart = () => {
	if (!chartRef.value) {
		return;
	}

	if (!ruleMonitorChart) {
		ruleMonitorChart = init(chartRef.value);
		emit("chart-ready", ruleMonitorChart);
	}

	ruleMonitorChart.setOption({
		animation: false,
		tooltip: {
			show: true,
			trigger: "item",
			backgroundColor: "rgba(6, 18, 39, 0.92)",
			borderColor: "#43b8ff",
			borderWidth: 1,
			padding: [8, 12],
			textStyle: {
				color: "#eff7ff",
				fontSize: 12,
			},
			extraCssText: "box-shadow: 0 0 14px rgba(67, 184, 255, 0.38), inset 0 0 10px rgba(67, 184, 255, 0.12); border-radius: 6px;",
			formatter: () => `${props.statusLabel}${numericScore.value}%<br/>${props.statusLabel}${props.statusText}`,
		},
		series: [
			{
				type: "gauge",
				silent: false,
				center: ["50%", "52%"],
				radius: "82%",
				startAngle: 220,
				endAngle: -40,
				progress: {
					show: true,
					width: 22,
					roundCap: false,
					itemStyle: {
						color: new graphic.LinearGradient(0, 0, 1, 0, [
							{ offset: 0, color: "#1a7fff" },
							{ offset: 0.52, color: "#1fd5ff" },
							{ offset: 1, color: "#10dd6d" },
						]),
						shadowBlur: 16,
						shadowColor: "rgba(31, 184, 255, 0.28)",
					},
				},
				pointer: { show: false },
				axisLine: {
					lineStyle: {
						width: 22,
						color: [[1, "rgba(20, 73, 143, 0.42)"]],
					},
				},
				axisTick: { show: false },
				splitLine: { show: false },
				axisLabel: { show: false },
				anchor: { show: false },
				title: { show: false },
				detail: { show: false },
				data: [{ value: numericScore.value, name: props.scoreLabel }],
			},
			{
				type: "gauge",
				center: ["50%", "52%"],
				radius: "101%",
				startAngle: 220,
				endAngle: -40,
				progress: { show: false },
				pointer: { show: false },
				axisLine: {
					lineStyle: {
						width: 7,
						color: [[1, "rgba(23, 96, 189, 0.2)"]],
					},
				},
				axisTick: {
					show: true,
					distance: -9,
					splitNumber: 4,
					lineStyle: {
						color: "#1a77ff",
						width: 1,
					},
					length: 4,
				},
				splitLine: { show: false },
				axisLabel: { show: false },
				anchor: { show: false },
				title: { show: false },
				detail: { show: false },
				data: [{ value: 100 }],
			},
		],
	});

	ruleMonitorChart.resize();
};

// 停止列表滚动：切换数据或卸载时统一清理
const stopScroll = () => {
	if (ruleMonitorScrollFrame) {
		window.cancelAnimationFrame(ruleMonitorScrollFrame);
		ruleMonitorScrollFrame = 0;
	}
};

// 启动列表滚动：长度较长时自动做无缝循环
const startScroll = () => {
	stopScroll();
	ruleMonitorScrollOffset = 0;

	if (!listTrackRef.value || props.list.length <= 4) {
		if (listTrackRef.value) {
			listTrackRef.value.style.transform = "";
		}
		return;
	}

	const listHeight = listTrackRef.value.scrollHeight / 2;

	const step = () => {
		ruleMonitorScrollOffset += 0.3;
		if (ruleMonitorScrollOffset >= listHeight) {
			ruleMonitorScrollOffset = 0;
		}

		listTrackRef.value.style.transform = `translateY(-${ruleMonitorScrollOffset}px)`;
		ruleMonitorScrollFrame = window.requestAnimationFrame(step);
	};

	ruleMonitorScrollFrame = window.requestAnimationFrame(step);
};

watch(
	() => [props.score, props.statusText, props.scoreLabel, props.statusLabel],
	() => {
		nextTick(() => {
			initChart();
		});
	},
	{ immediate: true }
);

watch(
	() => props.list,
	() => {
		nextTick(() => {
			startScroll();
		});
	},
	{ immediate: true, deep: true }
);

watch(
	() => chartRef.value,
	() => {
		nextTick(() => {
			initChart();
		});
	}
);

onBeforeUnmount(() => {
	stopScroll();

	if (ruleMonitorChart) {
		ruleMonitorChart.dispose();
		ruleMonitorChart = null;
	}
});
</script>

<template>
	<div class="rule-monitor">
		<div class="rule-monitor__title">
			<span class="rule-monitor__triangle"></span>
			<span class="rule-monitor__title-text">{{ title }}</span>
		</div>

		<div class="rule-monitor__content">
			<div class="rule-monitor__chart-area">
				<div class="rule-monitor__chart-shell">
					<div ref="chartRef" class="rule-monitor__chart"></div>

					<div class="rule-monitor__chart-center">
						<div class="rule-monitor__score-label">{{ scoreLabel }}</div>
						<div class="rule-monitor__score-value">
							{{ numericScore }}
							<span>%</span>
						</div>
					</div>

					<div class="rule-monitor__chart-bottom">
						<img class="rule-monitor__chart-bottom-bg" :src="chartBottomBg" alt="" />
					</div>

					<div class="rule-monitor__status">
						<span>{{ statusLabel }}{{ statusText }}</span>
						<img :src="chartStatusIcon" alt="" />
					</div>
				</div>
			</div>

			<div class="rule-monitor__list-panel">
				<div class="rule-monitor__list-mask">
					<div ref="listTrackRef" class="rule-monitor__list-track">
						<div v-for="(item, index) in duplicatedList" :key="`${item.id ?? index}-${index}`" class="rule-monitor__list-item">
							<div class="rule-monitor__item-time">{{ item.time }}</div>
							<div class="rule-monitor__item-text">
								<div>{{ item.messageLine1 }}</div>
								<div>{{ item.messageLine2 }}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div v-if="showDivider" class="rule-monitor__divider"></div>
	</div>
</template>

<style scoped lang="scss">
/* 第二模块容器：承接规则引擎监控内容 */
.rule-monitor {
	width: 480px;
	margin: 15px auto 0;
}

/* 第二模块标题行 */
.rule-monitor__title {
	display: flex;
	align-items: center;
	gap: 12px;
	height: 30px;
	margin-left: 24px;
}

/* 第二模块标题三角装饰 */
.rule-monitor__triangle {
	width: 0;
	height: 0;
	border-top: 8px solid transparent;
	border-bottom: 8px solid transparent;
	border-left: 14px solid #42b8ff;
	filter: drop-shadow(0 0 8px rgba(66, 184, 255, 0.28));
}

/* 第二模块标题文字 */
.rule-monitor__title-text {
	font-size: 18px;
	font-weight: 700;
	letter-spacing: 1px;
	color: #68caff;
	text-shadow: 0 0 8px rgba(46, 185, 255, 0.3);
}

/* 第二模块主体区域：左右布局 */
.rule-monitor__content {
	display: grid;
	grid-template-columns: 214px 1fr;
	align-items: start;
	gap: 16px;
	margin-top: 10px;
}

/* 左侧图表区域 */
.rule-monitor__chart-area {
	position: relative;
	height: 288px;
	display: flex;
	justify-content: center;
}

/* 图表视觉容器 */
.rule-monitor__chart-shell {
	position: relative;
	width: 214px;
	height: 302px;
	display: flex;
	justify-content: center;
}

/* ECharts 容器 */
.rule-monitor__chart {
	width: 214px;
	height: 236px;
	margin: 0 auto;
}

/* 图表中心文案 */
.rule-monitor__chart-center {
	position: absolute;
	top: 85px;
	left: 50%;
	width: 150px;
	transform: translateX(-50%);
	text-align: center;
	pointer-events: none;
}

.rule-monitor__score-label {
	font-size: 12px;
	color: #dcefff;
	opacity: 0.92;
}

.rule-monitor__score-value {
	margin-top: 8px;
	font-size: 40px;
	font-weight: 700;
	line-height: 1;
	color: #f8fbff;
	text-shadow: 0 0 14px rgba(255, 255, 255, 0.16);

	span {
		font-size: 16px;
	}
}

/* 图表底部切图 */
.rule-monitor__chart-bottom {
	position: absolute;
	left: 50%;
	bottom: 49px;
	width: 252px;
	transform: translateX(-50%) scale(0.94);
	transform-origin: center bottom;
	pointer-events: none;
}

.rule-monitor__chart-bottom-bg {
	display: block;
	width: 252px;
	height: 257px;
}

/* 数据质量底部状态 */
.rule-monitor__status {
	position: absolute;
	left: 50%;
	bottom: 90px;
	display: flex;
	align-items: center;
	gap: 6px;
	transform: translateX(-50%);
	font-size: 14px;
	font-weight: 700;
	color: #14ec7d;
	white-space: nowrap;
	pointer-events: none;

	img {
		display: block;
		width: 11px;
		height: 13px;
	}
}

/* 右侧列表区域外框 */
.rule-monitor__list-panel {
	position: relative;
	height: 278px;
	padding: 12px;
	border: 1px solid rgba(29, 125, 255, 0.42);
	border-radius: 14px;
	background: rgba(5, 19, 43, 0.32);
	box-shadow: inset 0 0 18px rgba(8, 46, 105, 0.2);
	overflow: hidden;
}

/* 列表可视区 */
.rule-monitor__list-mask {
	position: relative;
	height: 100%;
	overflow: hidden;
}

/* 列表滚动轨道 */
.rule-monitor__list-track {
	will-change: transform;
}

/* 列表单项 */
.rule-monitor__list-item {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 8px;
	align-items: start;
	min-height: 58px;
	padding: 8px 0 6px;
}

/* 时间文本 */
.rule-monitor__item-time {
	font-size: 14px;
	font-weight: 500;
	line-height: 1;
	color: #12f1a1;
	text-shadow: 0 0 8px rgba(18, 241, 161, 0.22);
}

/* 列表消息文本 */
.rule-monitor__item-text {
	font-size: 14px;
	line-height: 1.42;
	color: rgba(239, 247, 255, 0.84);
}

/* 模块底部分隔线：用于与下一个模块做视觉区隔 */
.rule-monitor__divider {
	margin-top: 12px;
	border-bottom: 1px solid #002f5d;
}
</style>
