/* eslint-disable max-len */
/* eslint-disable no-console */
import React, { useEffect } from 'react';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import moment from 'moment';
import { useTheme } from '@material-ui/core/styles';
import useStyles from './styles';

const Plot = createPlotlyComponent(Plotly);

interface SelectedWorkflowRunData {
  testsPassed: number;
  testsFailed: number;
  resilienceScore: number;
  testDate: string;
  xLoc: number;
  yLoc: number;
  workflowRunID: string;
}

export interface PopOverCallBackType {
  (selectedWorkflowRunData: SelectedWorkflowRunData, visible: boolean): void;
}

interface WorkflowRunData {
  testsPassed: number;
  testsFailed: number;
  resilienceScore: number;
  testDate: string;
  workflowRunID: string;
}

interface WorkflowRunsBarChartProps {
  workflowRunData: WorkflowRunData[];
  callBackToShowPopOver: PopOverCallBackType;
}

const WorkflowRunsBarChart: React.FC<WorkflowRunsBarChartProps> = ({
  workflowRunData,
  callBackToShowPopOver,
}) => {
  const { palette } = useTheme();

  const classes = useStyles();

  const [plotData, setPlotData] = React.useState<any[]>([]);

  const [plotLayout, setPlotLayout] = React.useState<any>({});

  const [visible, setVisible] = React.useState<boolean>(false);

  const [visibleLocation, setVisibleLocation] = React.useState<{
    x: number;
    y: number;
  }>({ x: 0, y: 0 });

  const [visibleIndex, setVisibleIndex] = React.useState<any>(0);

  const [colorsPassed, setColorsPassed] = React.useState<string[]>([
    palette.primary.dark,
    palette.primary.dark,
    palette.primary.dark,
  ]);

  const [colorsFailed, setColorsFailed] = React.useState<string[]>([
    palette.error.dark,
    palette.error.dark,
    palette.error.dark,
  ]);

  const [selected, setSelected] = React.useState<boolean>(false);

  // Function to convert UNIX time in format of DD MMM YYY
  const formatDate = (date: any) => {
    const updated = new Date(date * 1000).toString();
    const resDate = moment(updated).format('YYYY-MM-DD');
    return resDate;
  };

  const processData = () => {
    const passed = {
      x: [''],
      y: [0],
      name: 'Passed tests',
      type: 'bar',
      width: [0],
      customdata: [0],
      marker: {
        color: colorsPassed,
      },
      hoverinfo: 'skip',
      hovertemplate: '<extra></extra>',
    };

    const failed = {
      x: [''],
      y: [0],
      name: 'Failed tests',
      type: 'bar',
      width: [0],
      marker: {
        color: colorsFailed,
      },
      customdata: [0],
      hoverinfo: 'skip',
      hovertemplate: '<extra></extra>',
    };

    for (let i = 0; i < workflowRunData.length; i += 1) {
      passed.x.push(formatDate(workflowRunData[i].testDate));
      passed.y.push(
        (workflowRunData[i].testsPassed /
          (workflowRunData[i].testsPassed + workflowRunData[i].testsFailed)) *
          100
      );
      passed.width.push(1000 * 3600 * 7);
      failed.x.push(formatDate(workflowRunData[i].testDate));
      failed.y.push(
        (workflowRunData[i].testsFailed /
          (workflowRunData[i].testsPassed + workflowRunData[i].testsFailed)) *
          100
      );
      failed.width.push(1000 * 3600 * 7);
      passed.customdata.push(i);
      failed.customdata.push(i);
    }
    passed.x.shift();
    passed.y.shift();
    passed.width.shift();
    failed.x.shift();
    failed.y.shift();
    failed.width.shift();
    passed.customdata.shift();
    failed.customdata.shift();
    setPlotData([passed, failed]);
  };

  const selectorOptions = {
    buttons: [
      {
        step: 'day',
        stepmode: 'backward',
        count: 7,
        label: '1 Week',
      },
      {
        step: 'day',
        stepmode: 'backward',
        count: 14,
        label: '2 Weeks',
      },
      {
        step: 'month',
        stepmode: 'backward',
        count: 1,
        label: '1 Month',
      },
      {
        step: 'month',
        stepmode: 'backward',
        count: 3,
        label: '3 Months',
      },
      {
        step: 'month',
        stepmode: 'backward',
        count: 6,
        label: '6 Months',
      },
      {
        step: 'year',
        stepmode: 'backward',
        count: 1,
        label: '1 Year',
      },
      {
        step: 'year',
        stepmode: 'backward',
        count: 2,
        label: '2 Years',
      },
      {
        step: 'all',
        label: 'default',
      },
    ],
  };

  const processLayout = () => {
    const layout = {
      xaxis: {
        showgrid: false,
        showline: true,
        showticklabels: true,
        linecolor: palette.graphAnnotationsColor,
        linewidth: 0.5,
        ticks: 'outside',
        tickcolor: palette.graphAnnotationsColor,
        tickwidth: 0,
        ticklen: 0,
        tickfont: {
          family: 'Ubuntu, monospace',
          color: palette.customColors.black(0.4),
        },
        rangeselector: selectorOptions as any,
        rangeslider: { visible: true },
      },
      yaxis: {
        showgrid: false,
        zeroline: false,
        showline: false,
        showticklabels: false,
        linecolor: palette.graphAnnotationsColor,
        linewidth: 0.5,
        ticks: 'outside',
        tickcolor: palette.graphAnnotationsColor,
        tickwidth: 0,
        ticklen: 0,
        tickfont: {
          family: 'Ubuntu, monospace',
          color: palette.customColors.black(0.4),
        },
      },
      cliponaxis: true,
      layer: 'below_traces',
      autosize: true,
      margin: {
        autoexpand: false,
        l: 50,
        r: 200,
        t: 50,
        b: 120,
        p: 10,
      },
      font: {
        family: 'Ubuntu, monospace',
        color: palette.customColors.black(0.4),
      },
      barmode: 'stack',
      showlegend: true,
      legend: { orientation: 'h', y: 1, x: 0.955 },
      hovermode: 'closest',
      hoverlabel: {
        bgcolor: palette.secondary.contrastText,
        bordercolor: palette.secondary.contrastText,
      },
      modebar: {
        bgcolor: palette.secondary.contrastText,
      },
    };
    setPlotLayout(layout);
  };

  useEffect(() => {
    processData();
    processLayout();
    try {
      const nodeStyle = (document.getElementsByClassName(
        'modebar'
      )[0] as HTMLElement).style;
      nodeStyle.left = '29%';
      nodeStyle.transform = 'translateY(110%)';
    } catch (err) {
      console.log(err);
    }
  }, []);

  useEffect(() => {
    processData();
    try {
      const nodeStyle = (document.getElementsByClassName(
        'modebar'
      )[0] as HTMLElement).style;
      nodeStyle.left = '29%';
      nodeStyle.transform = 'translateY(110%)';
    } catch (err) {
      console.log(err);
    }
  }, [colorsPassed, colorsFailed]);

  useEffect(() => {
    const selectedWorkflowRunData: SelectedWorkflowRunData = {
      testsPassed: workflowRunData[visibleIndex].testsPassed,
      testsFailed: workflowRunData[visibleIndex].testsFailed,
      resilienceScore: workflowRunData[visibleIndex].resilienceScore,
      testDate: workflowRunData[visibleIndex].testDate,
      xLoc: visibleLocation.x,
      yLoc: visibleLocation.y,
      workflowRunID: workflowRunData[visibleIndex].workflowRunID,
    };
    callBackToShowPopOver(selectedWorkflowRunData, visible);
  }, [visible]);

  return (
    <div>
      <div id="myPlot">
        <Plot
          data={plotData}
          layout={plotLayout}
          useResizeHandler
          className={classes.plot}
          config={{
            displaylogo: false,
            autosizable: true,
            responsive: true,
            frameMargins: 0.2,
            showAxisDragHandles: true,
            showAxisRangeEntryBoxes: true,
            showTips: true,
            displayModeBar: true,
            toImageButtonOptions: {
              format: 'png',
              filename: `Workflow-Run-${workflowRunData[0].workflowRunID}`,
              width: 1920,
              height: 1080,
              scale: 2,
            },
          }}
          onHover={(data) => {
            if (!selected) {
              let ind = 0;
              let recolour = false;
              const newPassedColours = [];
              const newFailedColours = [];
              let loc = { x: 0, y: 0 };
              for (let i = 0; i < colorsPassed.length; i++) {
                if (colorsPassed[i] === palette.graphHoverColors.passedTests) {
                  recolour = true;
                }
              }
              if (!recolour) {
                for (let i = 0; i < data.points.length; i++) {
                  ind = (data.points[i].customdata as unknown) as number;
                  loc = {
                    x: data.event.pageX,
                    y: data.event.pageY - data.event.offsetY,
                  };
                }
                for (let i = 0; i < colorsPassed.length; i++) {
                  if (i !== ind) {
                    newPassedColours.push(palette.graphHoverColors.passedTests);
                    newFailedColours.push(palette.graphHoverColors.failedTests);
                  } else {
                    newPassedColours.push(palette.primary.dark);
                    newFailedColours.push(palette.error.dark);
                  }
                }
              } else {
                for (let i = 0; i < colorsPassed.length; i++) {
                  newPassedColours.push(palette.primary.dark);
                  newFailedColours.push(palette.error.dark);
                }
              }
              setVisibleIndex(ind);
              setVisibleLocation(loc);
              setColorsPassed(newPassedColours);
              setColorsFailed(newFailedColours);
              setVisible(true);
            }
          }}
          onClick={(data) => {
            const newPassedColours = [];
            const newFailedColours = [];
            let ind = 0;
            for (let i = 0; i < data.points.length; i++) {
              ind = (data.points[i].customdata as unknown) as number;
            }
            for (let i = 0; i < colorsPassed.length; i++) {
              if (i !== ind) {
                newPassedColours.push(palette.graphHoverColors.passedTests);
                newFailedColours.push(palette.graphHoverColors.failedTests);
              } else {
                newPassedColours.push(palette.primary.dark);
                newFailedColours.push(palette.error.dark);
              }
            }
            setSelected(true);
            setColorsPassed(newPassedColours);
            setColorsFailed(newFailedColours);
          }}
          onUnhover={() => {
            if (!selected) {
              const newPassedColours = [];
              const newFailedColours = [];
              for (let i = 0; i < colorsPassed.length; i++) {
                newPassedColours.push(palette.primary.dark);
                newFailedColours.push(palette.error.dark);
              }
              setColorsPassed(newPassedColours);
              setColorsFailed(newFailedColours);
              setVisible(false);
            }
          }}
        />
      </div>
    </div>
  );
};

export default WorkflowRunsBarChart;
