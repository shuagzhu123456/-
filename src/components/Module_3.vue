<script setup>
import stepActiveCardBg from "@/assets/d3-2.png";
import stepCardBg from "@/assets/d3-1.png";
import stepConfirmIcon from "@/assets/d3-queren.png";

defineOptions({
	name: "Module_3",
});

const props = defineProps({
	// 模块标题：支持外部按业务场景传入
	title: {
		type: String,
		default: "",
	},
	// 当前批次文案：用于展示本次处理任务
	currentBatchLabel: {
		type: String,
		default: "",
	},
	// 步骤列表：后续可直接替换为接口返回
	steps: {
		type: Array,
		default: () => [],
	},
	// 进度标签：避免组件内部写死业务文案
	progressLabel: {
		type: String,
		default: "",
	},
	// 进度值：支持页面传入真实百分比
	progressValue: {
		type: [Number, String],
		default: 0,
	},
	// 开始时间标签：用于左侧时间说明
	startLabel: {
		type: String,
		default: "",
	},
	// 开始时间：后续可接接口返回
	startTime: {
		type: String,
		default: "",
	},
	// 完成时间标签：用于右侧时间说明
	endLabel: {
		type: String,
		default: "",
	},
	// 完成时间：后续可接接口返回
	endTime: {
		type: String,
		default: "",
	},
	// 底部分隔线：允许按场景控制显示
	showDivider: {
		type: Boolean,
		default: true,
	},
});

defineEmits(["step-click"]);

// 统一清洗进度值，保证展示层只处理合法百分比
const normalizeProgressValue = (value) => {
	const numericValue = Number(value);
	if (!Number.isFinite(numericValue)) {
		return 0;
	}

	return Math.min(Math.max(numericValue, 0), 100);
};

// 统一组装步骤展示数据，组件内部负责视觉资源映射
const getStepCardStyle = (step) => ({
	backgroundImage: `url(${step.active ? stepActiveCardBg : stepCardBg})`,
});

const getProgressWidth = () => `${normalizeProgressValue(props.progressValue)}%`;
</script>

<template>
	<div class="batch-progress">
		<div class="batch-progress__title">
			<span class="batch-progress__triangle"></span>
			<span class="batch-progress__title-text">{{ title }}</span>
			<span class="batch-progress__current">{{ currentBatchLabel }}</span>
		</div>

		<div class="batch-progress__steps">
			<template v-for="(step, index) in steps" :key="step.key ?? index">
				<div class="batch-progress__step" @click="$emit('step-click', step)">
					<div class="batch-progress__step-card" :class="{ 'batch-progress__step-card--active': step.active }" :style="getStepCardStyle(step)">
						<img class="batch-progress__step-icon" :src="step.icon" alt="" />
						<img v-if="step.completed" class="batch-progress__step-check" :src="stepConfirmIcon" alt="" />
					</div>
					<div class="batch-progress__step-label">{{ step.label }}</div>
				</div>

				<div v-if="index < steps.length - 1" class="batch-progress__step-arrow">&gt;</div>
			</template>
		</div>

		<div v-if="showDivider" class="batch-progress__divider"></div>

		<div class="batch-progress__bar-row">
			<div class="batch-progress__bar-label">{{ progressLabel }}</div>
			<div class="batch-progress__bar-track">
				<div class="batch-progress__bar-fill" :style="{ width: getProgressWidth() }"></div>
			</div>
			<div class="batch-progress__bar-value">{{ normalizeProgressValue(progressValue) }}%</div>
		</div>

		<div class="batch-progress__time-row">
			<div class="batch-progress__time-item">
				<img class="batch-progress__time-icon" :src="stepConfirmIcon" alt="" />
				<span>{{ startLabel }}{{ startTime }}</span>
			</div>

			<div class="batch-progress__time-divider"></div>

			<div class="batch-progress__time-item">
				<img class="batch-progress__time-icon" :src="stepConfirmIcon" alt="" />
				<span>{{ endLabel }}{{ endTime }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
/* 第三模块容器：承载批次处理进度看板 */
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
	cursor: pointer;
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
