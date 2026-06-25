<script setup>
import { MapChart, LinesChart, EffectScatterChart } from "echarts/charts";
import { GeoComponent, TooltipComponent, VisualMapComponent } from "echarts/components";
import { init, registerMap, use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import heilongjiangGeoJsonUrl from "@/assets/map/230000.geojson?url";

defineOptions({
	name: "HeilongjiangMap",
});

// 按需注册 ECharts，避免把整个 echarts 全量打包进来。
use([MapChart, LinesChart, EffectScatterChart, GeoComponent, TooltipComponent, VisualMapComponent, CanvasRenderer]);

const MAP_NAME = "heilongjiang";
// 中心城市：飞线起点、中心扩散、默认重点城市都从这里控制。
const DEFAULT_CENTER_CITY = "哈尔滨市";
const DEFAULT_LINE_COLOR = "#52f7ff";
// 热区颜色分段：后续想调深浅层级，优先改这里。
const DEFAULT_PIECES = [
	{ min: 501, color: "#45d8e9" },
	{ min: 300, max: 500, color: "#2ab8d8" },
	{ min: 100, max: 299, color: "#1e91bf" },
	{ min: 50, max: 99, color: "#145d9e" },
	{ max: 49, color: "#0a3978" },
];

const props = defineProps({
	heatData: {
		type: Array,
		default: () => [],
	},
	centerCityName: {
		type: String,
		default: DEFAULT_CENTER_CITY,
	},
});

const emit = defineEmits(["region-click"]);

const chartRef = ref(null);
const activeRegionName = ref("");
const geoJsonData = ref(null);

let mapChart = null;
let mapRegistered = false;

const getCoordinateBounds = (coordinates, bounds) => {
	for (const item of coordinates) {
		if (Array.isArray(item?.[0])) {
			getCoordinateBounds(item, bounds);
			continue;
		}

		const [longitude, latitude] = item;
		bounds.minLng = Math.min(bounds.minLng, longitude);
		bounds.maxLng = Math.max(bounds.maxLng, longitude);
		bounds.minLat = Math.min(bounds.minLat, latitude);
		bounds.maxLat = Math.max(bounds.maxLat, latitude);
	}
};

// 根据每个地市的 GeoJSON 边界计算中心点。
// 后续散点、飞线、点击扩散都依赖这里。
const cityCenterMap = computed(() =>
	(geoJsonData.value?.features ?? []).reduce((result, feature) => {
		const bounds = {
			minLng: Infinity,
			maxLng: -Infinity,
			minLat: Infinity,
			maxLat: -Infinity,
		};

		getCoordinateBounds(feature.geometry?.coordinates ?? [], bounds);

		result[feature.properties.name] = [Number(((bounds.minLng + bounds.maxLng) / 2).toFixed(6)), Number(((bounds.minLat + bounds.maxLat) / 2).toFixed(6))];

		return result;
	}, {}),
);

// 把外部传入的热区数据和地图地市名称做一次标准化合并。
const normalizedHeatData = computed(() =>
	(geoJsonData.value?.features ?? []).map((feature, index) => {
		const current = props.heatData.find((item) => item.name === feature.properties.name) ?? {};
		return {
			id: feature.properties.id,
			name: feature.properties.name,
			value: Number(current.value ?? 0),
			lineColor: current.lineColor ?? (index > 9 ? "#ffd35a" : DEFAULT_LINE_COLOR),
			coord: cityCenterMap.value[feature.properties.name],
		};
	}),
);

// 中心点：地图发散动画的起点。
const centerPoint = computed(() => cityCenterMap.value[props.centerCityName] ?? cityCenterMap.value[DEFAULT_CENTER_CITY] ?? [126.642464, 45.756967]);

// 飞线数据：想改线条颜色、粗细、弯曲程度，可以从这里和 buildOption 里的 lines 配置一起看。
const linesData = computed(() =>
	normalizedHeatData.value
		.filter((item) => item.coord && item.name !== props.centerCityName)
		.map((item) => ({
			fromName: props.centerCityName,
			toName: item.name,
			coords: [centerPoint.value, item.coord],
			lineStyle: {
				color: item.lineColor,
				width: item.name === activeRegionName.value ? 3 : 2,
				opacity: item.name === activeRegionName.value ? 1 : 0.82,
			},
		})),
);

// 城市节点数据：名称、圆点颜色、圆点位置在这里组装。
const cityPointData = computed(() =>
	normalizedHeatData.value
		.filter((item) => item.coord)
		.map((item) => ({
			name: item.name,
			value: [...item.coord, item.value],
			itemStyle: {
				color: item.name === props.centerCityName ? "#ffffff" : "#94ffff",
			},
		})),
);

// 地图面域数据：热区着色和值映射走这里。
const mapRegionData = computed(() =>
	normalizedHeatData.value.map((item) => ({
		name: item.name,
		value: item.value,
		selected: item.name === activeRegionName.value,
	})),
);

// 点击某个地区后，额外叠一层扩散动画。
const activeRippleData = computed(() => {
	if (!activeRegionName.value || !cityCenterMap.value[activeRegionName.value]) {
		return [];
	}

	const activeItem = normalizedHeatData.value.find((item) => item.name === activeRegionName.value);

	return [
		{
			name: activeRegionName.value,
			value: [...cityCenterMap.value[activeRegionName.value], activeItem?.value ?? 0],
		},
	];
});

// 注册地图，只做一次。
const ensureMapRegistered = () => {
	if (mapRegistered || !geoJsonData.value) {
		return;
	}

	registerMap(MAP_NAME, geoJsonData.value);
	mapRegistered = true;
};

const buildOption = () => ({
	animation: true,
	tooltip: {
		trigger: "item",
		backgroundColor: "rgba(6, 18, 39, 0.96)",
		borderColor: "#43b8ff",
		borderWidth: 1,
		padding: [10, 14],
		textStyle: {
			color: "#eff7ff",
			fontSize: 12,
		},
		extraCssText: "box-shadow: 0 0 16px rgba(67, 184, 255, 0.35), inset 0 0 10px rgba(67, 184, 255, 0.12); border-radius: 8px;",
		formatter: (params) => {
			if (!params.name) {
				return "";
			}

			const currentValue = Array.isArray(params.value) ? (params.value[2] ?? 0) : (params.value ?? 0);
			return `${params.name}<br/>确权面积：${currentValue} 万亩`;
		},
	},
	visualMap: {
		show: false,
		type: "piecewise",
		seriesIndex: 0,
		// 热区颜色分段映射：区间和颜色都在这里调整。
		pieces: DEFAULT_PIECES,
	},
	geo: {
		map: MAP_NAME,
		roam: false,
		silent: false,
		// 地图默认位置：想上下左右挪地图，改这里。
		layoutCenter: ["52%", "50%"],
		// 地图默认大小：后续想整体放大/缩小地图，优先改这里。
		layoutSize: "99%",
		selectedMode: "single",
		// 地图默认样式：块面颜色、边框颜色、边框粗细、发光强度都在这里。
		itemStyle: {
			areaColor: "#0a3978",
			borderColor: "#79e0ff",
			borderWidth: 1.3,
			shadowBlur: 22,
			shadowColor: "rgba(82, 234, 255, 0.28)",
		},
		label: {
			show: false,
		},
		// 鼠标移入样式：hover 高亮效果在这里调。
		emphasis: {
			label: {
				color: "#ffffff",
			},
			itemStyle: {
				areaColor: "#3ee5ff",
				borderColor: "#ffffff",
				borderWidth: 2,
				shadowBlur: 32,
				shadowColor: "rgba(104, 245, 255, 0.65)",
			},
		},
		// 点击选中样式：点击某个地区后的块面高亮效果在这里调。
		select: {
			label: {
				color: "#ffffff",
				fontWeight: 700,
			},
			itemStyle: {
				areaColor: "#66f1ff",
				borderColor: "#ffffff",
				borderWidth: 2.6,
				shadowBlur: 38,
				shadowColor: "rgba(120, 245, 255, 0.8)",
			},
		},
	},
	series: [
		{
			name: "heat-region",
			type: "map",
			geoIndex: 0,
			data: mapRegionData.value,
			animationDuration: 1000,
			animationEasing: "cubicOut",
		},
		{
			name: "flow-lines",
			type: "lines",
			coordinateSystem: "geo",
			zlevel: 3,
			// 飞线流光动画：速度、尾迹长度、光点大小在这里调。
			effect: {
				show: true,
				period: 4,
				trailLength: 0.24,
				symbol: "circle",
				symbolSize: 5,
				color: "#ffffff",
			},
			// 飞线线体样式：粗细、透明度、弯曲程度在这里调。
			lineStyle: {
				width: 2,
				opacity: 0.82,
				curveness: 0.32,
			},
			data: linesData.value,
		},
		{
			name: "city-points",
			type: "effectScatter",
			coordinateSystem: "geo",
			zlevel: 4,
			showEffectOn: "render",
			// 城市节点扩散圈：节奏和范围在这里调。
			rippleEffect: {
				period: 4,
				scale: 3.4,
				brushType: "stroke",
			},
			// 城市名称样式：显示开关、字号、位置、颜色都在这里。
			label: {
				show: true,
				formatter: "{b}",
				position: "top",
				distance: 10,
				fontSize: 14,
				fontWeight: 700,
				color: "#edf8ff",
				textBorderColor: "rgba(0, 36, 78, 0.72)",
				textBorderWidth: 4,
			},
			// 城市圆点发光强度在这里。
			itemStyle: {
				shadowBlur: 18,
				shadowColor: "rgba(136, 255, 255, 0.92)",
			},
			// 城市圆点大小：中心城市和普通城市大小在这里区分。
			symbolSize: (value, params) => (params.name === props.centerCityName ? 17 : 11),
			data: cityPointData.value,
		},
		{
			name: "center-ripple",
			type: "effectScatter",
			coordinateSystem: "geo",
			zlevel: 5,
			silent: true,
			// 中心扩散动画：地图中间那一圈圈波纹在这里调。
			rippleEffect: {
				period: 5,
				scale: 7,
				brushType: "stroke",
			},
			itemStyle: {
				color: "#ffffff",
				shadowBlur: 42,
				shadowColor: "rgba(93, 233, 255, 0.95)",
			},
			symbolSize: 18,
			data: [
				{
					name: props.centerCityName,
					value: [...centerPoint.value, 0],
				},
			],
		},
		{
			name: "click-ripple",
			type: "effectScatter",
			coordinateSystem: "geo",
			zlevel: 6,
			silent: true,
			// 点击地区后的扩散圈：颜色、速度、范围都在这里调。
			rippleEffect: {
				period: 3,
				scale: 5.6,
				brushType: "stroke",
			},
			itemStyle: {
				color: "#ffe48f",
				shadowBlur: 28,
				shadowColor: "rgba(255, 223, 123, 0.92)",
			},
			symbolSize: 12,
			data: activeRippleData.value,
		},
	],
});

// 真正渲染图表：后续如果你要继续加 click、mouseover、自动轮播等逻辑，从这里扩展。
const renderChart = () => {
	if (!chartRef.value || !geoJsonData.value) {
		return;
	}

	ensureMapRegistered();

	if (!mapChart) {
		mapChart = init(chartRef.value);
		mapChart.on("click", (params) => {
			if (!params.name) {
				return;
			}

			activeRegionName.value = params.name;
			emit("region-click", {
				name: params.name,
				value: Array.isArray(params.value) ? (params.value[2] ?? 0) : (params.value ?? 0),
			});
		});
	}

	mapChart.setOption(buildOption(), true);

	if (activeRegionName.value) {
		mapChart.dispatchAction({
			type: "select",
			seriesIndex: 0,
			name: activeRegionName.value,
		});
	}

	mapChart.resize();
};

// GeoJSON 改为运行时加载，减少主 JS chunk 体积。
const loadGeoJson = async () => {
	if (geoJsonData.value) {
		return;
	}

	const response = await fetch(heilongjiangGeoJsonUrl);
	geoJsonData.value = await response.json();
};

const handleResize = () => {
	mapChart?.resize();
};

watch(
	() => [props.heatData, props.centerCityName, geoJsonData.value],
	() => {
		nextTick(() => {
			renderChart();
		});
	},
	{ immediate: true, deep: true },
);

watch(
	() => chartRef.value,
	() => {
		nextTick(() => {
			renderChart();
		});
	},
);

onMounted(async () => {
	window.addEventListener("resize", handleResize);
	await loadGeoJson();
	renderChart();
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", handleResize);

	if (mapChart) {
		mapChart.dispose();
		mapChart = null;
	}
});
</script>

<template>
	<div class="heilongjiang-map">
		<div class="heilongjiang-map__grid"></div>
		<div ref="chartRef" class="heilongjiang-map__chart"></div>
	</div>
</template>

<style scoped lang="scss">
/* 地图外层容器：
   想控制这个地图模块整体占位、裁剪方式，先改这里。 */
.heilongjiang-map {
	position: relative;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

/* 背景网格装饰层：
   想改背景网格密度、透明度、明暗，就改这里。 */
.heilongjiang-map__grid {
	position: absolute;
	inset: 0;
	background-image: linear-gradient(rgba(31, 120, 194, 0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(31, 120, 194, 0.12) 1px, transparent 1px);
	background-size: 34px 30px;
	mask-image: radial-gradient(circle at center, rgba(0, 0, 0, 1) 52%, transparent 88%);
	opacity: 0.32;
	pointer-events: none;
}

/* ECharts 挂载容器：
   想让图表铺满或留白，优先改这里的宽高。
   如果只是想改“地图默认大小”，优先改上面的 buildOption -> geo -> layoutSize。 */
.heilongjiang-map__chart {
	position: relative;
	z-index: 1;
	width: 100%;
	height: 100%;
}
</style>
