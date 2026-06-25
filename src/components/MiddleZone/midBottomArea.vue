<script setup>
import { computed } from "vue";
import HeilongjiangMap from "@/components/MiddleZone/HeilongjiangMap.vue";
import centerBottomMapBg from "@/assets/z-dt-bj.png";
import centerBottomTitleBg from "@/assets/z-top.png";
import centerBankIcon1 from "@/assets/z-d-icon1.png";
import centerBankIcon2 from "@/assets/z-d-icon2.png";
import centerBankIcon3 from "@/assets/z-d-icon3.png";
import centerBankIcon4 from "@/assets/z-d-icon4.png";
import centerBankIcon5 from "@/assets/z-d-icon5.png";
import centerBankIcon6 from "@/assets/z-d-icon6.png";
import centerBankIcon7 from "@/assets/z-d-icon7.png";

defineOptions({
	name: "MidBottomArea",
});

const DEFAULT_LEGEND_LIST = [
	{ key: "lv1", label: ">500", color: "#45d8e9" },
	{ key: "lv2", label: "300-500", color: "#2ab8d8" },
	{ key: "lv3", label: "100-300", color: "#1e91bf" },
	{ key: "lv4", label: "50-100", color: "#145d9e" },
	{ key: "lv5", label: "<50", color: "#0a3978" },
];

// 固定静态资源在组件内部维护，页面只传业务 key 和展示文案。
const BANK_ICON_MAP = {
	ccb: centerBankIcon1,
	abc: centerBankIcon2,
	boc: centerBankIcon3,
	psbc: centerBankIcon4,
	hlj: centerBankIcon5,
	rural: centerBankIcon6,
	other: centerBankIcon7,
};

const props = defineProps({
	title: {
		type: String,
		default: "",
	},
	legendTitle: {
		type: String,
		default: "",
	},
	legendList: {
		type: Array,
		default: () => [
			{ key: "lv1", label: ">500", color: "#45d8e9" },
			{ key: "lv2", label: "300-500", color: "#2ab8d8" },
			{ key: "lv3", label: "100-300", color: "#1e91bf" },
			{ key: "lv4", label: "50-100", color: "#145d9e" },
			{ key: "lv5", label: "<50", color: "#0a3978" },
		],
	},
	heatData: {
		type: Array,
		default: () => [],
	},
	// 机构数据只保留业务字段，组件内部负责匹配图标。
	bankList: {
		type: Array,
		default: () => [],
	},
	centerCityName: {
		type: String,
		default: "哈尔滨市",
	},
});

const emit = defineEmits(["region-click"]);

const bankDisplayList = computed(() =>
	props.bankList.map((item) => ({
		...item,
		icon: BANK_ICON_MAP[item.key] ?? "",
	})),
);

const handleRegionClick = (payload) => {
	emit("region-click", payload);
};
</script>

<template>
	<div class="mid-bottom-area">
		<div class="mid-bottom-area__title" :style="{ backgroundImage: `url(${centerBottomTitleBg})` }">
			<span>{{ title }}</span>
		</div>

		<div class="mid-bottom-area__map-shell" :style="{ backgroundImage: `url(${centerBottomMapBg})` }">
			<div class="mid-bottom-area__legend">
				<div class="mid-bottom-area__legend-title">{{ legendTitle }}</div>
				<div v-for="item in legendList" :key="item.key" class="mid-bottom-area__legend-item">
					<span class="mid-bottom-area__legend-color" :style="{ background: item.color }"></span>
					<span>{{ item.label }}</span>
				</div>
			</div>

			<div class="mid-bottom-area__map-panel">
				<HeilongjiangMap :heat-data="heatData" :center-city-name="centerCityName" @region-click="handleRegionClick" />
			</div>
		</div>

		<div class="mid-bottom-area__bank-row">
			<div v-for="item in bankDisplayList" :key="item.key" class="mid-bottom-area__bank-item">
				<img class="mid-bottom-area__bank-icon" :src="item.icon" alt="" />
				<div class="mid-bottom-area__bank-label">{{ item.label }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.mid-bottom-area {
	margin-top: 15px;
	height: 900px;
}

.mid-bottom-area__title {
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

.mid-bottom-area__map-shell {
	position: relative;
	height: 678px;
	padding: 10px 28px 0;
	box-sizing: border-box;
	background-repeat: no-repeat;
	background-position: center;
	background-size: 98% 88%;
}

.mid-bottom-area__legend {
	position: absolute;
	left: 10px;
	bottom: 40px;
	z-index: 2;
}

.mid-bottom-area__legend-title {
	margin-bottom: 12px;
	font-size: 15px;
	color: rgba(234, 244, 255, 0.9);
}

.mid-bottom-area__legend-item {
	display: flex;
	align-items: center;
	gap: 10px;
	margin-top: 8px;
	font-size: 14px;
	color: rgba(225, 239, 255, 0.88);
}

.mid-bottom-area__legend-color {
	display: block;
	width: 22px;
	height: 14px;
}

.mid-bottom-area__map-panel {
	position: relative;
	width: 100%;
	height: 100%;
	border-radius: 18px;
}

.mid-bottom-area__bank-row {
	display: grid;
	grid-template-columns: repeat(7, 1fr);
	align-items: end;
	column-gap: 18px;
	padding: 0 130px;
}

.mid-bottom-area__bank-item {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.mid-bottom-area__bank-icon {
	display: block;
	width: 82px;
	height: 82px;
	object-fit: contain;
}

.mid-bottom-area__bank-label {
	margin-top: 8px;
	font-size: 14px;
	color: rgba(231, 241, 255, 0.88);
	text-align: center;
	white-space: nowrap;
}
</style>
