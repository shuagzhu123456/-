<script setup>
import dynamicBg from "@/assets/r-bj-dongtai.png";
import shieldCore from "@/assets/r-dp.png";

defineOptions({
	name: "RightModule_3",
});

const props = defineProps({
	// 模块标题：后续可按业务场景复用
	title: {
		type: String,
		default: "",
	},
	// 卡片文案列表：后续可直接对接接口字段
	list: {
		type: Array,
		default: () => [],
	},
	// 是否显示底部分隔线：便于后续复用
	showDivider: {
		type: Boolean,
		default: false,
	},
});
</script>

<template>
	<div class="security-system">
		<!-- 模块标题：左侧三角装饰 + 标题文字 -->
		<div class="security-system__title">
			<span class="security-system__triangle"></span>
			<span class="security-system__title-text">{{ title }}</span>
		</div>

		<!-- 模块内容：中间动态底图 + 四张叠加卡片 -->
		<div class="security-system__content">
			<div class="security-system__visual">
				<img class="security-system__visual-rotating" :src="dynamicBg" alt="" />
				<img class="security-system__visual-core" :src="shieldCore" alt="" />
			</div>

			<div class="security-system__cards">
				<div v-for="(item, index) in list" :key="item.key" class="security-system__card" :class="`security-system__card--${index + 1}`">
					<div class="security-system__card-title">{{ item.title }}</div>
					<div class="security-system__card-desc">{{ item.desc }}</div>
				</div>
			</div>
		</div>

		<!-- 底部分隔线：与下个模块做视觉分隔 -->
		<div v-if="showDivider" class="security-system__divider"></div>
	</div>
</template>

<style scoped lang="scss">
/* 右侧第三模块：整体容器 */
.security-system {
	width: 478px;
	margin: 18px auto 0;
}

/* 右侧第三模块：标题栏 */
.security-system__title {
	display: flex;
	align-items: center;
	gap: 12px;
	height: 32px;
	padding-left: 14px;
}

/* 右侧第三模块：蓝色三角装饰 */
.security-system__triangle {
	width: 0;
	height: 0;
	border-top: 8px solid transparent;
	border-bottom: 8px solid transparent;
	border-left: 14px solid #42b8ff;
	filter: drop-shadow(0 0 8px rgba(66, 184, 255, 0.28));
}

/* 右侧第三模块：标题文字 */
.security-system__title-text {
	font-size: 17px;
	font-weight: 700;
	letter-spacing: 0.6px;
	color: #68caff;
	text-shadow: 0 0 8px rgba(46, 185, 255, 0.3);
}

/* 右侧第三模块：主体布局容器 */
.security-system__content {
	position: relative;
	height: 250px;
	margin-top: 10px;
}

/* 右侧第三模块：中间视觉区 */
.security-system__visual {
	position: absolute;
	top: 50%;
	left: 52%;
	width: 268px;
	height: 268px;
	transform: translate(-50%, -50%);
}

/* 右侧第三模块：底层动态旋转图 */
.security-system__visual-rotating {
	position: absolute;
	inset: 0;
	width: 250px;
	height: 250px;
	animation: security-rotate 12s linear infinite;
}

/* 右侧第三模块：上层盾牌图 */
.security-system__visual-core {
	position: absolute;
	top: 48%;
	left: 47%;
	width: 170px;
	height: 170px;
	transform: translate(-50%, -50%);
}

/* 右侧第三模块：卡片叠加层 */
.security-system__cards {
	position: absolute;
	inset: 0;
}

/* 右侧第三模块：能力卡片 */
.security-system__card {
	position: absolute;
	width: 154px;
	height: 85px;
	padding: 20px 10px 0;
	box-sizing: border-box;
	text-align: center;
	background-image: url("@/assets/r-bj-conm.png");
	background-repeat: no-repeat;
	background-position: center;
	background-size: 100% 100%;
}

.security-system__card--1 {
	top: 12px;
	left: 10px;
}

.security-system__card--2 {
	left: 10px;
	bottom: 30px;
}

.security-system__card--3 {
	top: 12px;
	right: 10px;
}

.security-system__card--4 {
	right: 10px;
	bottom: 30px;
}

/* 右侧第三模块：卡片主标题 */
.security-system__card-title {
	font-size: 14px;
	font-weight: 700;
	line-height: 1.2;
	color: #7bc0ff;
	text-shadow: 0 0 8px rgba(80, 178, 255, 0.18);
}

/* 右侧第三模块：卡片说明 */
.security-system__card-desc {
	margin-top: 12px;
	font-size: 12px;
	line-height: 1.3;
	color: rgba(231, 241, 255, 0.86);
}

/* 右侧第三模块：底部分隔线 */
.security-system__divider {
	margin-top: 12px;
	border-bottom: 1px solid #002f5d;
}

@keyframes security-rotate {
	from {
		transform: rotate(0deg);
	}

	to {
		transform: rotate(360deg);
	}
}
</style>
