<script setup>
defineOptions({
	name: "RightModule_1",
});

const props = defineProps({
	// 模块标题：支持父层按业务场景传入
	title: {
		type: String,
		default: "",
	},
	// 生命周期列表：后续可直接接入接口返回数据
	list: {
		type: Array,
		default: () => [],
	},
	// 合计标签：避免组件内部写死业务文案
	totalLabel: {
		type: String,
		default: "",
	},
	// 合计数值：支持页面传入真实统计结果
	totalValue: {
		type: [String, Number],
		default: "",
	},
	// 单位文案：兼容不同业务单位展示
	unit: {
		type: String,
		default: "",
	},
	// 是否显示底部分隔线：便于不同布局复用
	showDivider: {
		type: Boolean,
		default: true,
	},
});

defineEmits(["row-click"]);
</script>

<template>
	<div class="right-lifecycle">
		<!-- 模块标题区：统一承载装饰与标题文字 -->
		<div class="right-lifecycle__title">
			<span class="right-lifecycle__triangle"></span>
			<span class="right-lifecycle__title-text">{{ title }}</span>
		</div>

		<!-- 模块内容区：根据传入列表渲染统计内容 -->
		<div class="right-lifecycle__content">
			<div v-for="(item, index) in list" :key="item.key ?? index" class="right-lifecycle__row" @click="$emit('row-click', item)">
				<div class="right-lifecycle__label">{{ item.label }}</div>

				<div class="right-lifecycle__stat">
					<div class="right-lifecycle__value" :class="item.colorClass">
						<span>{{ item.value }}</span>
						<i>{{ item.unit || unit }}</i>
					</div>
					<div class="right-lifecycle__percent">({{ item.percent }})</div>
				</div>
			</div>
		</div>

		<!-- 合计区：统一展示总数与单位信息 -->
		<div class="right-lifecycle__total">
			<span class="right-lifecycle__total-label">{{ totalLabel }}</span>
			<span class="right-lifecycle__total-value">{{ totalValue }}</span>
			<span class="right-lifecycle__total-unit">{{ unit }}</span>
		</div>

		<!-- 底部分隔线：用于与后续模块做视觉分隔 -->
		<div v-if="showDivider" class="right-lifecycle__divider"></div>
	</div>
</template>

<style lang="scss" scoped>
/* 右侧第一模块容器：承载生命周期统计模块布局 */
.right-lifecycle {
	width: 474px;
	margin: 4px auto 0;
}

/* 模块标题栏：统一放置三角装饰与标题 */
.right-lifecycle__title {
	display: flex;
	align-items: center;
	gap: 10px;
	height: 30px;
	margin-left: 16px;
}

.right-lifecycle__triangle {
	width: 0;
	height: 0;
	margin-top: 1px;
	border-top: 8px solid transparent;
	border-bottom: 8px solid transparent;
	border-left: 15px solid #42b8ff;
	filter: drop-shadow(0 0 8px rgba(66, 184, 255, 0.28));
}

.right-lifecycle__title-text {
	font-size: 17px;
	font-weight: 700;
	letter-spacing: 0.6px;
	color: #68caff;
	text-shadow: 0 0 8px rgba(46, 185, 255, 0.3);
}

/* 模块内容区：内部负责承载背景与列表排版 */
.right-lifecycle__content {
	display: flex;
	flex-direction: column;
	width: 474px;
	height: 220px;
	margin-top: 6px;
	padding: 4px 0 0 47px;
	box-sizing: border-box;
	background-image: url("@/assets/r-1coen-bj.png");
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
}

.right-lifecycle__row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 53px;
	cursor: pointer;
}

.right-lifecycle__label {
	font-size: 16px;
	font-weight: 700;
	letter-spacing: 0.2px;
	color: #f4fbff;
	text-shadow: 0 0 8px rgba(255, 255, 255, 0.12);
}

.right-lifecycle__stat {
	width: 126px;
	text-align: left;
}

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

.right-lifecycle__percent {
	margin-top: 7px;
	padding-left: 2px;
	font-size: 12px;
	color: rgba(229, 241, 255, 0.78);
}

/* 合计区：统一展示总计标签、数值和单位 */
.right-lifecycle__total {
	display: flex;
	align-items: baseline;
	justify-content: center;
	gap: 8px;
	margin-top: 6px;
}

.right-lifecycle__total-label,
.right-lifecycle__total-unit {
	font-size: 17px;
	color: #eef8ff;
}

.right-lifecycle__total-value {
	font-size: 20px;
	font-weight: 700;
	line-height: 1;
	color: #ffc74c;
	letter-spacing: 0.6px;
	text-shadow: 0 0 10px rgba(255, 199, 76, 0.24);
}

.right-lifecycle__divider {
	margin-top: 9px;
	border-bottom: 1px solid #002f5d;
}
</style>
