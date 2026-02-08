/**
 * Chart theme using hex colors only, so Nivo/d3-color parsing is stable
 * after dependency updates (e.g. d3-color 3.1.x).
 */
export const getChartTheme = (isDarkMode: boolean) => ({
  axis: {
    ticks: {
      text: {
        fill: isDarkMode ? "#f0f0f0" : "#333333",
      },
    },
    legend: {
      text: {
        fill: isDarkMode ? "#f0f0f0" : "#333333",
      },
    },
    domain: {
      line: {
        stroke: isDarkMode ? "#525252" : "#a3a3a3",
      },
    },
  },
  grid: {
    line: {
      stroke: isDarkMode ? "#525252" : "#e5e5e5",
    },
  },
  legends: {
    text: {
      fill: isDarkMode ? "#f0f0f0" : "#333333",
    },
  },
  tooltip: {
    container: {
      background: isDarkMode ? "#333333" : "#ffffff",
      color: isDarkMode ? "#f0f0f0" : "#333333",
    },
  },
});
