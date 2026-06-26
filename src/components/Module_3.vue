<script setup>
import { computed } from "vue";
import stepActiveCardBg from "@/assets/d3-2.png";
import stepCardBg from "@/assets/d3-1.png";
import stepConfirmIcon from "@/assets/d3-queren.png";
import stepDesensitizeIcon from "@/assets/d3-tuomi.png";
import stepDownloadIcon from "@/assets/d3-xiaza.png";
import stepInflateIcon from "@/assets/d3-jieya.png";
import stepStorageIcon from "@/assets/de-xixinz.png";
import stepValidateIcon from "@/assets/d3-jiaoyan.png";

defineOptions({
	name: "Module_3",
});

const STEP_ICON_MAP = {
	receive: stepDownloadIcon,
	inflate: stepInflateIcon,
	validate: stepValidateIcon,
	desensitize: stepDesensitizeIcon,
	storage: stepStorageIcon,
};

const props = defineProps({
	// 模块标题：页面只传业务标题文本。
	title: {
		type: String,
		default: "",
	},
	// 当前批次文案：用于显示当前正在处理的数据批次。
	currentBatchLabel: {
		type: String,
		default: "",
	},
	// 步骤列表：只保留业务字段，图标由组件内部按 key 匹配。
	steps: {
		type: Array,
		default: () => [],
	},
	// 进度标题：例如“处理进度”。
	progressLabel: {
		type: String,
		default: "",
	},
	// 进度值：支持接口返回 number 或 string。
	progressValue: {
		type: [Number, String],
		default: 0,
	},
	// 开始时间标题。
	startLabel: {
		type: String,
		default: "",
	},
	// 开始时间值。
	startTime: {
		type: String,
		default: "",
	},
	// 结束时间标题。
	endLabel: {
		type: String,
		default: "",
	},
	// 结束时间值。
	endTime: {
		type: String,
		default: "",
	},
	// 是否显示进度条和时间区域上方分隔线。
	showDivider: {
		type: Boolean,
		default: true,
	},
});

defineEmits(["step-click"]);

// 统一清洗进度值，避免接口数据异常时影响展示。
const normalizedProgressValue = computed(() => {
	const numericValue = Number(props.progressValue);
	if (!Number.isFinite(numericValue)) {
		return 0;
	}

	return Math.min(Math.max(numericValue, 0), 100);
});

// 组件内部补齐图标等视觉字段，页面只关心业务状态。
const displaySteps = computed(() =>
	props.steps.map((step) => ({
		...step,
		icon: STEP_ICON_MAP[step.key] ?? "",
	})),
);

// 步骤卡片默认尺寸在这里控制；后续若想调大/调小，可先改 width、height。
const getStepCardStyle = (step) => ({
	backgroundImage: `url(${step.active ? stepActiveCardBg : stepCardBg})`,
});

const getProgressWidth = () => `${normalizedProgressValue.value}%`;
</script>

<template>
	<div class="batch-progress">
		<div class="batch-progress__title">
			<span class="batch-progress__triangle"></span>
			<span class="batch-progress__title-text">{{ title }}</span>
			<span class="batch-progress__current">{{ currentBatchLabel }}</span>
		</div>

		<div class="batch-progress__steps">
			<template v-for="(step, index) in displaySteps" :key="step.key ?? index">
				<div class="batch-progress__step" @click="$emit('step-click', step)">
					<div class="batch-progress__step-card" :class="{ 'batch-progress__step-card--active': step.active }" :style="getStepCardStyle(step)">
						<img v-if="step.icon" class="batch-progress__step-icon" :src="step.icon" alt="" />
						<img v-if="step.completed" class="batch-progress__step-check" :src="stepConfirmIcon" alt="" />
					</div>
					<div class="batch-progress__step-label">{{ step.label }}</div>
				</div>

				<div v-if="index < displaySteps.length - 1" class="batch-progress__step-arrow">&gt;</div>
			</template>
		</div>

		<div v-if="showDivider" class="batch-progress__divider"></div>

		<div class="batch-progress__bar-row">
			<div class="batch-progress__bar-label">{{ progressLabel }}</div>
			<div class="batch-progress__bar-track">
				<div class="batch-progress__bar-fill" :style="{ width: getProgressWidth() }"></div>
			</div>
			<div class="batch-progress__bar-value">{{ normalizedProgressValue }}%</div>
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
/* 组件整体宽度在这里控制；如需放大模块，可先改 width。 */
.batch-progress {
	width: 100%;
	max-width: 28.75rem;
	margin: 10px auto 0;
}

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
	font-size: clamp(15px, 0.9vw, 17px);
	font-weight: 700;
	letter-spacing: 0.5px;
	color: #68caff;
	text-shadow: 0 0 8px rgba(46, 185, 255, 0.3);
}

.batch-progress__current {
	margin-left: 12px;
	font-size: clamp(11px, 0.72vw, 13px);
	color: rgba(239, 247, 255, 0.72);
}

.batch-progress__steps {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	margin-top: 16px;
}

.batch-progress__step {
	width: clamp(60px, 4.6vw, 87px);
	cursor: pointer;
}

/* 单个步骤卡片大小在这里控制；默认是 79 x 85。 */
.batch-progress__step-card {
	position: relative;
	width: clamp(56px, 4.15vw, 79px);
	height: clamp(60px, 4.5vw, 85px);
	margin: 0 auto;
	display: flex;
	align-items: center;
	justify-content: center;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
}

.batch-progress__step-card--active {
	filter: drop-shadow(0 0 12px rgba(76, 163, 255, 0.28));
}

.batch-progress__step-icon {
	display: block;
	max-width: clamp(30px, 2.25vw, 43px);
	max-height: clamp(32px, 2.4vw, 46px);
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
	font-size: clamp(10px, 0.68vw, 12px);
	line-height: 1.1;
	text-align: center;
	color: rgba(239, 247, 255, 0.9);
	white-space: nowrap;
}

.batch-progress__step-arrow {
	width: clamp(12px, 1vw, 22px);
	padding-top: clamp(16px, 1.8vw, 30px);
	font-size: clamp(16px, 1.25vw, 24px);
	line-height: 1;
	text-align: center;
	color: rgba(239, 247, 255, 0.7);
}

.batch-progress__divider {
	margin-top: 14px;
	border-bottom: 1px solid #002f5d;
}

/* 进度条高度、圆角、颜色可在这一组样式里调整。 */
.batch-progress__bar-row {
	display: grid;
	grid-template-columns: auto 1fr auto;
	align-items: center;
	gap: 14px;
	margin-top: 18px;
}

.batch-progress__bar-label {
	font-size: clamp(11px, 0.72vw, 13px);
	font-weight: 600;
	color: rgba(239, 247, 255, 0.86);
}

.batch-progress__bar-track {
	position: relative;
	height: clamp(16px, 1.2vw, 22px);
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
	font-size: clamp(14px, 0.95vw, 16px);
	font-weight: 700;
	color: #5eb7ff;
}

/* 时间区域的高度、边框、左右留白可在这里调整。 */
.batch-progress__time-row {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	height: clamp(36px, 2.8vw, 46px);
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
	font-size: clamp(10px, 0.62vw, 11px);
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

@media (max-height: 980px) {
	.batch-progress {
		margin-top: 8px;
	}

	.batch-progress__steps {
		margin-top: 12px;
	}

	.batch-progress__step-label {
		margin-top: 8px;
	}

	.batch-progress__divider {
		margin-top: 12px;
	}

	.batch-progress__bar-row {
		margin-top: 14px;
		gap: 10px;
	}

	.batch-progress__time-row {
		height: 34px;
		margin-top: 12px;
		padding: 0 12px;
	}
}
</style>
