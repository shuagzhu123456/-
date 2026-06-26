<script setup>
import { computed, nextTick, onBeforeUnmount, ref, watch } from "vue";
import riskControlIcon from "@/assets/r-ic-fengkong.png";
import noticeIcon from "@/assets/r-ic-tongzhi.png";
import warningIcon from "@/assets/r-ic-yujing.png";

defineOptions({
	name: "RightModule_2",
});

const props = defineProps({
	// 模块标题：支持父层按业务传入
	title: {
		type: String,
		default: "",
	},
	// 右上角操作文案：默认展示“更多”
	moreText: {
		type: String,
		default: "更多",
	},
	// 消息列表：后续可直接替换为接口返回
	list: {
		type: Array,
		default: () => [],
	},
	// 是否显示底部分隔线：便于后续复用
	showDivider: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(["more-click", "item-click"]);

const listTrackRef = ref(null);

let scrollFrame = 0;
let scrollOffset = 0;

const typeStyleMap = {
	warning: {
		icon: warningIcon,
		rowClass: "right-push__item--warning",
	},
	risk: {
		icon: riskControlIcon,
		rowClass: "right-push__item--risk",
	},
	notice: {
		icon: noticeIcon,
		rowClass: "right-push__item--notice",
	},
};

const normalizedList = computed(() =>
	props.list.map((item, index) => {
		const type = item.type || "notice";
		const style = typeStyleMap[type] || typeStyleMap.notice;

		return {
			...item,
			id: item.id ?? `${type}-${index}`,
			icon: item.icon || style.icon,
			rowClass: style.rowClass,
		};
	}),
);

const duplicatedList = computed(() => {
	if (normalizedList.value.length <= 4) {
		return normalizedList.value;
	}

	return [...normalizedList.value, ...normalizedList.value];
});

// 停止滚动：切换数据或组件卸载时统一清理
const stopScroll = () => {
	if (scrollFrame) {
		window.cancelAnimationFrame(scrollFrame);
		scrollFrame = 0;
	}
};

// 启动滚动：数据过多时执行无缝循环
const startScroll = () => {
	stopScroll();
	scrollOffset = 0;

	if (!listTrackRef.value || normalizedList.value.length <= 4) {
		if (listTrackRef.value) {
			listTrackRef.value.style.transform = "";
		}
		return;
	}

	const loopHeight = listTrackRef.value.scrollHeight / 2;

	const step = () => {
		scrollOffset += 0.32;
		if (scrollOffset >= loopHeight) {
			scrollOffset = 0;
		}

		listTrackRef.value.style.transform = `translateY(-${scrollOffset}px)`;
		scrollFrame = window.requestAnimationFrame(step);
	};

	scrollFrame = window.requestAnimationFrame(step);
};

watch(
	() => props.list,
	() => {
		nextTick(() => {
			startScroll();
		});
	},
	{ immediate: true, deep: true },
);

onBeforeUnmount(() => {
	stopScroll();
});
</script>

<template>
	<div class="right-push">
		<!-- 模块标题区：左侧标题，右侧更多 -->
		<div class="right-push__title">
			<div class="right-push__title-main">
				<span class="right-push__triangle"></span>
				<span class="right-push__title-text">{{ title }}</span>
			</div>

			<button type="button" class="right-push__more" @click="$emit('more-click')">
				<span>{{ moreText }}</span>
				<i>&gt;</i>
			</button>
		</div>

		<!-- 模块列表区：根据消息类型切换图标和颜色 -->
		<div class="right-push__list-shell">
			<div class="right-push__list-mask">
				<div ref="listTrackRef" class="right-push__list-track">
					<div v-for="(item, index) in duplicatedList" :key="`${item.id}-${index}`" class="right-push__item" :class="item.rowClass" @click="$emit('item-click', item)">
						<img class="right-push__icon" :src="item.icon" alt="" />
						<div class="right-push__message">{{ item.message }}</div>
						<div class="right-push__time">{{ item.time }}</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 底部分隔线：与下个模块做视觉分隔 -->
		<div v-if="showDivider" class="right-push__divider"></div>
	</div>
</template>

<style scoped lang="scss">
/* 右侧第二模块：整体容器 */
.right-push {
	width: 100%;
	max-width: 29.875rem;
	margin: 0.5rem auto 0;
}

/* 右侧第二模块：标题栏 */
.right-push__title {
	display: flex;
	align-items: center;
	justify-content: space-between;
	height: 32px;
	padding: 0 4px 0 14px;
}

/* 右侧第二模块：左侧标题组合 */
.right-push__title-main {
	display: flex;
	align-items: center;
	gap: 12px;
}

/* 右侧第二模块：蓝色三角装饰 */
.right-push__triangle {
	width: 0;
	height: 0;
	border-top: 8px solid transparent;
	border-bottom: 8px solid transparent;
	border-left: 14px solid #42b8ff;
	filter: drop-shadow(0 0 8px rgba(66, 184, 255, 0.28));
}

/* 右侧第二模块：标题文字 */
.right-push__title-text {
	font-size: clamp(0.95rem, 0.9vw, 1.0625rem);
	font-weight: 700;
	letter-spacing: 0.6px;
	color: #68caff;
	text-shadow: 0 0 8px rgba(46, 185, 255, 0.3);
}

/* 右侧第二模块：更多按钮 */
.right-push__more {
	display: inline-flex;
	align-items: center;
	gap: 5px;
	padding: 0;
	border: 0;
	background: transparent;
	font-size: clamp(0.75rem, 0.82vw, 0.875rem);
	color: rgba(236, 245, 255, 0.92);
	cursor: pointer;

	i {
		font-style: normal;
		font-size: 13px;
	}
}

/* 右侧第二模块：列表外框 */
.right-push__list-shell {
	margin-top: 6px;
	padding: 1px;
	border: 1px solid rgba(29, 125, 255, 0.24);
	border-radius: 6px;
	background: rgba(5, 19, 43, 0.42);
	box-shadow: inset 0 0 18px rgba(8, 46, 105, 0.18);
}

/* 右侧第二模块：可视区域 */
.right-push__list-mask {
	height: clamp(15rem, 24vh, 16.875rem);
	overflow: hidden;
}

/* 右侧第二模块：滚动轨道 */
.right-push__list-track {
	will-change: transform;
}

/* 右侧第二模块：单行消息 */
.right-push__item {
	display: grid;
	grid-template-columns: 1.625rem minmax(0, 1fr) 4.875rem;
	align-items: center;
	column-gap: 12px;
	height: clamp(2.75rem, 4.6vh, 3.125rem);
	padding: 0 18px 0 18px;
	border-bottom: 1px solid rgba(13, 63, 122, 0.72);
	box-sizing: border-box;
}

.right-push__item:last-child {
	border-bottom: 0;
}

/* 右侧第二模块：消息图标 */
.right-push__icon {
	display: block;
	width: 26px;
	height: 26px;
	object-fit: contain;
}

/* 右侧第二模块：消息文本 */
.right-push__message {
	font-size: clamp(0.8rem, 0.86vw, -0.9375rem);
	line-height: 1.45;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
}

/* 右侧第二模块：时间 */
.right-push__time {
	justify-self: end;
	font-size: clamp(0.8rem, 0.86vw, 0.9375rem);
	color: rgba(229, 241, 255, 0.88);
}

/* 右侧第二模块：三种业务颜色 */
.right-push__item--warning .right-push__message {
	color: #ff6b61;
	text-shadow: 0 0 8px rgba(255, 107, 97, 0.18);
}

.right-push__item--risk .right-push__message {
	color: #f0b238;
	text-shadow: 0 0 8px rgba(240, 178, 56, 0.18);
}

.right-push__item--notice .right-push__message {
	color: #4ea5ff;
	text-shadow: 0 0 8px rgba(78, 165, 255, 0.18);
}

/* 右侧第二模块：底部分隔线 */
.right-push__divider {
	margin-top: 10px;
	border-bottom: 1px solid #002f5d;
}

@media (max-height: 980px) {
	.right-push {
		margin-top: 4px;
	}

	.right-push__list-mask {
		height: clamp(14.25rem, 19vh, 13.5rem);
	}

	.right-push__item {
		height: clamp(2.2rem, 3.7vh, 2.5rem);
		padding: 0 0.875rem;
	}

	.right-push__divider {
		margin-top: 6px;
	}
}
</style>
