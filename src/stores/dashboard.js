import { defineStore } from 'pinia'

export const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    currentTime: '',
    updateTime: '2026-05-31 23:59:59',
    stats: [
      { label: '累计确权土地面积', value: '12,856.34', unit: '万亩', theme: 'gold' },
      { label: '覆盖涉农主体数', value: '10,245', unit: '户/家', theme: 'blue' },
      { label: '支撑信贷总金额', value: '15,678.44', unit: '万元', theme: 'cyan' },
    ],
    mapLegend: ['>500', '300~500', '100~300', '50~100', '<50'],
    processSteps: [
      '1.文件接收',
      '2.自动解压',
      '3.格式校验',
      '4.敏感信息脱敏',
      '5.入库完成',
    ],
    banks: ['建设银行', '农业银行', '中国银行', '邮储银行', '龙江银行', '农商银行', '其他金融机构'],
  }),
  actions: {
    setCurrentTime(value) {
      this.currentTime = value
    },
  },
})
