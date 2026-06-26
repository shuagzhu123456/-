<script setup>
import cardBgGold from "@/assets/d-top-1.png";
import cardBgBlue from "@/assets/d-top-2.png";
import iconArea from "@/assets/d-top-bj-1.png";
import iconFarmer from "@/assets/d-top-bj-2.png";
import iconFinance from "@/assets/d-top-bj-3.png";

defineOptions({
	name: "MiddleZoneTop",
});

const props = defineProps({
	// 顶部统计卡数据：后续直接替换为接口返回
	list: {
		type: Array,
		default: () => [
			{ key: "area", label: "累计确权土地面积", value: "12,856,34", unit: "万亩" },
			{ key: "farmer", label: "覆盖涉农主体数", value: "10,245", unit: "户/家" },
			{ key: "finance", label: "支撑信贷总金额", value: "15,678,44", unit: "万元" },
		],
	},
});

const cardConfigMap = {
	area: {
		cardBackground: cardBgGold,
		icon: iconArea,
		cardClass: "middle-top__card--gold",
	},
	farmer: {
		cardBackground: cardBgBlue,
		icon: iconFarmer,
		cardClass: "middle-top__card--blue",
	},
	finance: {
		cardBackground: cardBgBlue,
		icon: iconFinance,
		cardClass: "middle-top__card--blue",
	},
};
</script>

<template>
	<div class="middle-top">
		<!-- 中间区顶部：三张统计卡横向排列 -->
		<div
			v-for="(item, index) in list"
			:key="item.key ?? index"
			class="middle-top__card"
			:class="cardConfigMap[item.key]?.cardClass"
			:style="{ backgroundImage: `url(${cardConfigMap[item.key]?.cardBackground || cardBgBlue})` }">
			<div class="middle-top__icon-box">
				<img class="middle-top__icon" :src="cardConfigMap[item.key]?.icon || iconFarmer" alt="" />
			</div>

			<div class="middle-top__content">
				<div class="middle-top__label">{{ item.label }}</div>
				<div class="middle-top__value-row">
					<div class="middle-top__value">{{ item.value }}</div>
					<div class="middle-top__unit">{{ item.unit }}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
/* 中间区顶部：三卡横向布局 */
.middle-top {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	column-gap: 12px;
	width: 100%;
}

/* 中间区顶部：单张统计卡 */
.middle-top__card {
	display: flex;
	align-items: center;
	height: 114px;
	padding: 0 16px 0 16px;
	box-sizing: border-box;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
}

/* 中间区顶部：图标盒 */
.middle-top__icon-box {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56px;
	height: 56px;
	flex-shrink: 0;
}

/* 中间区顶部：图标 */
.middle-top__icon {
	display: block;
	width: 55px;
	height: 55px;
	object-fit: contain;
}

/* 中间区顶部：右侧内容区 */
.middle-top__content {
	flex: 1;
	min-width: 0;
	padding-left: 14px;
}

/* 中间区顶部：标题文字 */
.middle-top__label {
	font-size: 17px;
	font-weight: 700;
	line-height: 1.2;
	color: #eef7ff;
	white-space: nowrap;
}

/* 中间区顶部：数值与单位排布 */
.middle-top__value-row {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	margin-top: 14px;
}

/* 中间区顶部：主数值 */
.middle-top__value {
	font-size: 26px;
	font-weight: 700;
	line-height: 1;
	letter-spacing: 0.5px;
}

/* 中间区顶部：单位 */
.middle-top__unit {
	padding-bottom: 4px;
	font-size: 14px;
	line-height: 1;
	color: rgba(241, 247, 255, 0.92);
}

/* 中间区顶部：金色卡主数值 */
.middle-top__card--gold .middle-top__value {
	color: #f5d36f;
	text-shadow: 0 0 12px rgba(245, 211, 111, 0.22);
}

/* 中间区顶部：蓝色卡主数值 */
.middle-top__card--blue .middle-top__value {
	color: #f5d36f;
	text-shadow: 0 0 12px rgba(245, 211, 111, 0.22);
}
</style>
