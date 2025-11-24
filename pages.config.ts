import { defineUniPages } from '@uni-helper/vite-plugin-uni-pages'

export default defineUniPages({
  pages: [],
  // entryPagePath: 'pages/launch/index',
  globalStyle: {
    backgroundColor: '@bgColor',
    backgroundColorBottom: '@bgColorBottom',
    backgroundColorTop: '@bgColorTop',
    backgroundTextStyle: '@bgTxtStyle',
    navigationBarBackgroundColor: '#000000',
    navigationBarTextStyle: '@navTxtStyle',
    navigationBarTitleText: 'Vitesse-Uni',
    navigationStyle: 'custom',
  },
  tabBar: {
    backgroundColor: '#FAFBFD',
    borderStyle: 'black',
    selectedColor: '#3E93FF',
    height: '60px',
    list: [
      {
        text: '督办任务',
        pagePath: 'pages/task/index',
        iconPath: 'static/task.png',
        selectedIconPath: 'static/task-active.png',
      },
      {
        text: '信息通知',
        pagePath: 'pages/notice/index',
        iconPath: 'static/notice.png',
        selectedIconPath: 'static/notice-active.png',
      },
      {
        text: '评价考核',
        pagePath: 'pages/evaluation/index',
        iconPath: 'static/evaluation.png',
        selectedIconPath: 'static/evaluation-active.png',
      },
    ],
  },
})
